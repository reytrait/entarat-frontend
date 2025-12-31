import { Injectable } from "@nestjs/common";
import type { WebSocket } from "ws";
import { DatabaseService } from "../database/database.service";
import { GameService } from "./game.service";

@Injectable()
export class RoundTimerService {
	private roundTimers = new Map<string, NodeJS.Timeout>();

	constructor(
		private readonly databaseService: DatabaseService,
		private readonly gameService: GameService,
	) {}

	/**
	 * Starts a timer for a round that will automatically send results when time expires
	 */
	startRoundTimer(gameId: string, connections: Map<string, WebSocket>): void {
		// Clear any existing timer for this game
		this.stopRoundTimer(gameId);

		const game = this.databaseService.games.get(gameId);
		if (!game || !game.roundStartTime || !game.currentQuestion) {
			return;
		}

		const timer = setTimeout(() => {
			const currentGame = this.databaseService.games.get(gameId);
			// Check if round is still active and time has expired
			if (!currentGame || currentGame.status !== "playing") {
				return;
			}

			const now = Date.now();
			const elapsed = now - (currentGame.roundStartTime || 0);
			const remaining = Math.max(0, currentGame.roundDuration - elapsed);

			// Only process if time has actually expired
			if (remaining <= 0) {
				// Use void to handle promise without blocking
				void this.handleRoundExpired(gameId, connections);
			}

			// Clean up timer
			this.roundTimers.delete(gameId);
		}, game.roundDuration);

		this.roundTimers.set(gameId, timer);
	}

	/**
	 * Stops the round timer for a game
	 */
	stopRoundTimer(gameId: string): void {
		const timer = this.roundTimers.get(gameId);
		if (timer) {
			clearTimeout(timer);
			this.roundTimers.delete(gameId);
		}
	}

	/**
	 * Gets round results for a game (used when client requests results)
	 */
	getRoundResults(
		gameId: string,
		databaseService: DatabaseService,
		gameService: GameService,
		_connections: Map<string, WebSocket>,
	) {
		const game = databaseService.games.get(gameId);
		if (!game || !game.currentQuestion) {
			return null;
		}

		const currentQuestion = game.currentQuestion;
		const now = Date.now();
		const elapsed = now - (game.roundStartTime || 0);
		const remaining = Math.max(0, game.roundDuration - elapsed);
		const timeExpired = remaining <= 0;

		if (!timeExpired) {
			return null; // Round still active
		}

		const isLastRound = game.currentRound >= game.totalRounds;

		// Calculate scores and track player answers
		const playerAnswers = new Map<
			string,
			{ answer: number; isCorrect: boolean; timestamp: number }
		>();

		game.answers.forEach((answerData, pid) => {
			const isCorrect = answerData.answer === currentQuestion.correctAnswer;
			playerAnswers.set(pid, {
				answer: answerData.answer,
				isCorrect,
				timestamp: answerData.timestamp,
			});

			if (isCorrect) {
				const player = databaseService.players.get(pid);
				if (player) {
					player.score += 1;
				}
			}
		});

		// Add entries for players who didn't answer
		game.playerIds.forEach((pid) => {
			if (!playerAnswers.has(pid)) {
				playerAnswers.set(pid, {
					answer: -1,
					isCorrect: false,
					timestamp: Date.now(),
				});
			}
		});

		// Save round data to history if not already saved
		const roundExists = game.roundHistory.some(
			(r) => r.round === game.currentRound,
		);
		if (!roundExists) {
			game.roundHistory.push({
				round: game.currentRound,
				question: currentQuestion,
				playerAnswers,
			});
		}

		if (isLastRound) {
			// Last round - return game finished
			game.status = "finished";
			game.summary = gameService.generateGameSummary(game);
			return {
				type: "game_finished" as const,
				scores: game.playerIds.map((id) => ({
					player: databaseService.players.get(id),
					score: databaseService.players.get(id)?.score || 0,
				})),
				summary: game.summary,
			};
		} else {
			// Not last round - return round results
			const allAnswers = Array.from(game.answers.entries()).map(
				([pid, ans]) => ({
					playerId: pid,
					player: databaseService.players.get(pid),
					answer: ans.answer,
					isCorrect: ans.answer === currentQuestion.correctAnswer,
				}),
			);

			// Add entries for players who didn't answer
			game.playerIds.forEach((pid) => {
				if (!game.answers.has(pid)) {
					allAnswers.push({
						playerId: pid,
						player: databaseService.players.get(pid),
						answer: -1,
						isCorrect: false,
					});
				}
			});

			return {
				type: "round_results" as const,
				round: game.currentRound,
				correctAnswer: currentQuestion.correctAnswer,
				answers: allAnswers,
			};
		}
	}

	/**
	 * Handles when a round expires
	 */
	private async handleRoundExpired(
		gameId: string,
		connections: Map<string, WebSocket>,
	): Promise<void> {
		const game = await this.databaseService.getGame(gameId);
		if (!game || !game.currentQuestion) {
			return;
		}

		const isLastRound = game.currentRound >= game.totalRounds;

		// Calculate scores for all players who answered
		for (const [pid, answerData] of game.answers.entries()) {
			if (answerData.answer === game.currentQuestion!.correctAnswer) {
				const player = await this.databaseService.getPlayer(pid);
				if (player) {
					player.score += 1;
					await this.databaseService.savePlayerToCache(pid, player);
				}
			}
		}

		if (isLastRound) {
			// Last round - end game immediately
			await this.endGame(gameId, connections);
		} else {
			// Not last round - send round results
			await this.sendRoundResults(gameId, connections);
		}
	}

	/**
	 * Sends round results to all players
	 */
	private sendRoundResults(
		gameId: string,
		connections: Map<string, WebSocket>,
	): void {
		const game = this.databaseService.games.get(gameId);
		if (!game || !game.currentQuestion) return;

		const allAnswers = Array.from(game.answers.entries()).map(([pid, ans]) => ({
			playerId: pid,
			player: this.databaseService.players.get(pid),
			answer: ans.answer,
			isCorrect: ans.answer === game.currentQuestion!.correctAnswer,
		}));

		// Add entries for players who didn't answer
		game.playerIds.forEach((pid) => {
			if (!game.answers.has(pid)) {
				allAnswers.push({
					playerId: pid,
					player: this.databaseService.players.get(pid),
					answer: -1,
					isCorrect: false,
				});
			}
		});

		// Save round data to history
		const roundExists = game.roundHistory.some(
			(r) => r.round === game.currentRound,
		);
		if (!roundExists) {
			const playerAnswers = new Map<
				string,
				{ answer: number; isCorrect: boolean; timestamp: number }
			>();
			game.answers.forEach((answerData, pid) => {
				playerAnswers.set(pid, {
					answer: answerData.answer,
					isCorrect: answerData.answer === game.currentQuestion!.correctAnswer,
					timestamp: answerData.timestamp,
				});
			});
			game.playerIds.forEach((pid) => {
				if (!playerAnswers.has(pid)) {
					playerAnswers.set(pid, {
						answer: -1,
						isCorrect: false,
						timestamp: Date.now(),
					});
				}
			});
			game.roundHistory.push({
				round: game.currentRound,
				question: game.currentQuestion!,
				playerAnswers,
			});
		}

		this.gameService.broadcastToGame(
			gameId,
			{
				type: "round_results",
				round: game.currentRound,
				correctAnswer: game.currentQuestion.correctAnswer,
				answers: allAnswers,
			},
			connections,
		);
		console.log(
			`⏰ Round timer expired - Sent results (Round ${game.currentRound}/${game.totalRounds})`,
		);

		// Clear answers for next round
		game.answers.clear();
	}

	/**
	 * Ends the game and sends final results
	 */
	private endGame(gameId: string, connections: Map<string, WebSocket>): void {
		const game = this.databaseService.games.get(gameId);
		if (!game) return;

		game.status = "finished";
		game.summary = this.gameService.generateGameSummary(game);

		const finalScores = game.playerIds.map((id) => ({
			player: this.databaseService.players.get(id),
			score: this.databaseService.players.get(id)?.score || 0,
		}));

		this.gameService.broadcastToGame(
			gameId,
			{
				type: "game_finished",
				scores: finalScores,
				summary: game.summary,
			},
			connections,
		);

		console.log(
			`🎉 All rounds complete! Game finished (Round ${game.currentRound}/${game.totalRounds}) - Timer expired`,
		);
	}
}
