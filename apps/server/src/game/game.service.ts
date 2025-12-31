import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { WebSocket } from "ws";
import { DatabaseService } from "../database/database.service";
import {
  Game,
  GameSummary,
  JoinMessage,
  Player,
  Question,
  WSMsgType,
} from "../types/game";
import { ROUND_DURATION_MS } from "./constants";
import { GameUtilsService } from "./game-utils.service";
import { RoundTimerService } from "./round-timer.service";

@Injectable()
export class GameService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly gameUtils: GameUtilsService,
    @Inject(forwardRef(() => RoundTimerService))
    private readonly roundTimerService: RoundTimerService,
  ) {}

  async handleJoin(
    data: JoinMessage,
    client: WebSocket,
    connections: Map<string, WebSocket>,
  ) {
    console.log("🔌 handleJoin", data);
    const gameId = data.gameId;
    const playerId = data.playerId;

    // Check if device already has a player in this game
    const game = await this.databaseService.getGame(gameId);
    if (game) {
      let existingPlayerWithDevice: string | undefined;
      for (const pid of game.playerIds) {
        const player = await this.databaseService.getPlayer(pid);
        if (player?.deviceId === data.deviceId) {
          existingPlayerWithDevice = pid;
          break;
        }
      }

      if (existingPlayerWithDevice) {
        const existingPlayer = await this.databaseService.getPlayer(
          existingPlayerWithDevice,
        );
        console.log(
          `❌ Device already in game - Device: "${data.deviceId}", Existing Player: "${existingPlayer?.name}" (${existingPlayerWithDevice})`,
        );
        client.send(
          JSON.stringify({
            type: WSMsgType.ERROR,
            message: `Device already connected to this game as "${existingPlayer?.name}". Only one connection per device is allowed.`,
          }),
        );
        client.close(1008, "Device already in game");
        return;
      }
    }

    connections.set(playerId, client);

    // Add player to game
    let currentGame = await this.databaseService.getGame(gameId);
    if (!currentGame) {
      // Ensure totalRounds doesn't exceed available questions
      const maxRounds = this.databaseService.questions.length;
      const requestedRounds = data.totalRounds || 12;
      const totalRounds = Math.min(requestedRounds, maxRounds);

      currentGame = {
        id: gameId,
        playerIds: [],
        currentRound: 0,
        totalRounds: totalRounds,
        status: "waiting",
        answers: new Map(),
        startTime: null,
        currentQuestion: null,
        roundStartTime: null,
        roundDuration: ROUND_DURATION_MS,
        usedQuestionIds: [],
        roundHistory: [],
      };
      await this.databaseService.saveGameToCache(gameId, currentGame);
      console.log(
        `🎮 New game created: ${gameId} with ${totalRounds} rounds (max available: ${maxRounds})`,
      );
    }

    if (currentGame && !currentGame.playerIds.includes(playerId)) {
      currentGame.playerIds.push(playerId);
      await this.databaseService.saveGameToCache(gameId, currentGame);
    }

    // Store player info with deviceId
    const player: Player = {
      id: playerId,
      name: data.name,
      avatar: data.avatar,
      gameId: gameId,
      score: 0,
      deviceId: data.deviceId,
    };
    await this.databaseService.savePlayerToCache(playerId, player);

    // Log user joined
    console.log(
      `✅ User joined - Name: "${data.name}", ID: "${playerId}", Device: "${data.deviceId}", Game: "${gameId}"`,
    );

    // Get limited players list (max 15) with total count
    const playersData = this.getLimitedPlayersList(
      currentGame?.playerIds || [],
    );

    // Notify all other players in game (excluding the newly joined one)
    this.broadcastToGame(
      gameId,
      {
        type: WSMsgType.PLAYER_JOINED,
        player: this.databaseService.players.get(playerId),
        players: playersData.players,
        totalPlayers: playersData.totalPlayers,
      },
      connections,
      playerId, // Exclude the joining player
    );

    // Send combined game state (includes players list) to the newly joined user
    if (currentGame) {
      // If game is finished and summary doesn't exist, generate it
      if (currentGame.status === "finished" && !currentGame.summary) {
        currentGame.summary = this.generateGameSummary(currentGame);
      }

      const gameStateMessage: {
        type: WSMsgType;
        game: Game & {
          players: typeof playersData.players;
          totalPlayers: number;
          summary?: GameSummary;
        };
      } = {
        type: WSMsgType.GAME_STATE,
        game: {
          ...currentGame,
          players: playersData.players,
          totalPlayers: playersData.totalPlayers,
        },
      };

      // Include summary if game is finished
      if (currentGame.status === "finished" && currentGame.summary) {
        gameStateMessage.game.summary = currentGame.summary;
      }

      client.send(JSON.stringify(gameStateMessage));

      // If game is in progress, check if round has expired
      if (
        currentGame.status === "playing" &&
        currentGame.currentQuestion &&
        currentGame.roundStartTime
      ) {
        const now = Date.now();
        const elapsed = now - currentGame.roundStartTime;
        const remaining = Math.max(0, currentGame.roundDuration - elapsed);
        const timeExpired = remaining <= 0;

        // If time expired, check if it's the last round
        if (timeExpired) {
          const isLastRound =
            currentGame.currentRound >= currentGame.totalRounds;

          // If it's the last round and time expired, end the game and send final scores
          if (isLastRound) {
            const currentQuestion = currentGame.currentQuestion;
            if (currentQuestion) {
              // Calculate final scores for all players who answered
              currentGame.answers.forEach((answerData, pid) => {
                if (answerData.answer === currentQuestion.correctAnswer) {
                  const player = this.databaseService.players.get(pid);
                  if (player) {
                    player.score += 1;
                  }
                }
              });
            }

            // Mark game as finished
            currentGame.status = "finished";

            // Send game finished with final scores
            client.send(
              JSON.stringify({
                type: WSMsgType.GAME_FINISHED,
                scores: currentGame.playerIds.map((id) => ({
                  player: this.databaseService.players.get(id),
                  score: this.databaseService.players.get(id)?.score || 0,
                })),
              }),
            );
            console.log(
              `📤 Sent game finished to reconnecting player - Round: ${currentGame.currentRound}/${currentGame.totalRounds} (last round, expired)`,
            );
          } else {
            // Not last round, send round results
            const currentQuestion = currentGame.currentQuestion;
            if (!currentQuestion) {
              return;
            }

            // Calculate scores for all players who answered
            currentGame.answers.forEach((answerData, pid) => {
              if (answerData.answer === currentQuestion.correctAnswer) {
                const player = this.databaseService.players.get(pid);
                if (player) {
                  player.score += 1;
                }
              }
            });

            // Include all players in results (those who answered and those who didn't)
            const allAnswers = Array.from(currentGame.answers.entries()).map(
              ([pid, ans]) => ({
                playerId: pid,
                player: this.databaseService.players.get(pid),
                answer: ans.answer,
                isCorrect: ans.answer === currentQuestion.correctAnswer,
              }),
            );

            // Add entries for players who didn't answer (answer: -1 means no answer)
            currentGame.playerIds.forEach((pid) => {
              if (!currentGame.answers.has(pid)) {
                allAnswers.push({
                  playerId: pid,
                  player: this.databaseService.players.get(pid),
                  answer: -1, // No answer submitted
                  isCorrect: false,
                });
              }
            });

            // Send round results to reconnecting player
            client.send(
              JSON.stringify({
                type: WSMsgType.ROUND_RESULTS,
                round: currentGame.currentRound,
                correctAnswer: currentQuestion.correctAnswer,
                answers: allAnswers,
              }),
            );
            console.log(
              `📤 Sent round results to reconnecting player - Round: ${currentGame.currentRound} (expired, ${currentGame.answers.size}/${currentGame.playerIds.length} answered)`,
            );
          }
        } else {
          // Round still active or no answers yet, send current question
          // Remove correctAnswer before sending to client
          const sanitizedQuestion = currentGame.currentQuestion
            ? this.gameUtils.sanitizeQuestionForClient(
                currentGame.currentQuestion,
              )
            : null;

          client.send(
            JSON.stringify({
              type: WSMsgType.GAME_STARTED,
              round: currentGame.currentRound,
              totalRounds: currentGame.totalRounds,
              question: sanitizedQuestion,
              roundStartTime: currentGame.roundStartTime,
              roundDuration: currentGame.roundDuration,
              remainingTime: remaining, // Include remaining time for client
            }),
          );
          console.log(
            `📤 Sent current question to reconnecting player - Round: ${currentGame.currentRound}, Remaining: ${Math.round(remaining / 1000)}s`,
          );
        }
      }
    }
  }

  handleStartGame(gameId: string, connections: Map<string, WebSocket>) {
    const startGame = this.databaseService.games.get(gameId);
    if (!startGame) return;

    if (!this.roundTimerService) {
      console.error("RoundTimerService is not available");
    }

    startGame.status = "playing";
    startGame.currentRound = 1;
    startGame.startTime = Date.now();

    // Get an unused question (ensures no repeats)
    const unusedQuestion = this.gameUtils.getUnusedQuestion(
      startGame.usedQuestionIds,
    );

    if (!unusedQuestion) {
      // No more questions available, end game
      startGame.status = "finished";
      this.broadcastToGame(
        gameId,
        {
          type: WSMsgType.GAME_FINISHED,
          scores: startGame.playerIds.map((id) => ({
            player: this.databaseService.players.get(id),
            score: this.databaseService.players.get(id)?.score || 0,
          })),
        },
        connections,
      );
      return;
    }

    // Randomize options and get new correct answer index
    const randomizedQuestion =
      this.gameUtils.randomizeQuestionOptions(unusedQuestion);

    // Mark this question as used
    startGame.usedQuestionIds.push(unusedQuestion.id);

    // Store current question (with randomized options) and round start time
    startGame.currentQuestion = randomizedQuestion;
    startGame.roundStartTime = Date.now();
    startGame.roundDuration = ROUND_DURATION_MS;

    // Start timer to automatically send results when round expires
    this.roundTimerService?.startRoundTimer(gameId, connections);

    // Remove correctAnswer before sending to client
    const sanitizedQuestion =
      this.gameUtils.sanitizeQuestionForClient(randomizedQuestion);

    this.broadcastToGame(
      gameId,
      {
        type: WSMsgType.GAME_STARTED,
        round: startGame.currentRound,
        totalRounds: startGame.totalRounds,
        question: sanitizedQuestion,
        roundStartTime: startGame.roundStartTime,
        roundDuration: startGame.roundDuration,
      },
      connections,
    );
  }

  handleSubmitAnswer(
    gameId: string,
    answer: number,
    client: WebSocket,
    connections: Map<string, WebSocket>,
  ) {
    const answerGame = this.databaseService.games.get(gameId);
    if (!answerGame) return;

    // Find playerId from connections
    let playerId: string | null = null;
    for (const [pid, ws] of connections.entries()) {
      if (ws === client) {
        playerId = pid;
        break;
      }
    }

    if (!playerId) return;

    answerGame.answers.set(playerId, {
      answer: answer,
      round: answerGame.currentRound,
      timestamp: Date.now(),
    });

    // Check if all players answered
    if (answerGame.answers.size === answerGame.playerIds.length) {
      // Use the current question (already randomized) for scoring
      const currentQuestion = answerGame.currentQuestion;
      if (!currentQuestion) {
        console.error("No current question found for scoring");
        return;
      }

      // Calculate scores based on the randomized question's correct answer
      answerGame.answers.forEach((answerData, pid) => {
        if (answerData.answer === currentQuestion.correctAnswer) {
          const player = this.databaseService.players.get(pid);
          if (player) {
            player.score += 1;
          }
        }
      });

      // Stop the round timer since all players answered
      this.roundTimerService?.stopRoundTimer(gameId);

      // Check if this is the last round - if so, complete the game immediately
      const isLastRound = answerGame.currentRound >= answerGame.totalRounds;

      if (isLastRound) {
        // Last round complete - finish game and send final results immediately
        this.checkAndCompleteGame(gameId, answerGame, connections);
        return;
      }

      // Not last round - send round results
      this.sendRoundResults(gameId, answerGame, currentQuestion, connections);

      // Clear answers for next round (if not finished)
      answerGame.answers.clear();
    } else {
      // Notify that answer was received
      this.broadcastToGame(
        gameId,
        {
          type: WSMsgType.ANSWER_RECEIVED,
          playerId: playerId,
          remaining: answerGame.playerIds.length - answerGame.answers.size,
        },
        connections,
      );
    }
  }

  handleNextRound(gameId: string, connections: Map<string, WebSocket>) {
    const nextGame = this.databaseService.games.get(gameId);
    if (!nextGame) return;

    nextGame.currentRound += 1;

    if (nextGame.currentRound > nextGame.totalRounds) {
      // Game over
      nextGame.status = "finished";
      this.broadcastToGame(
        gameId,
        {
          type: WSMsgType.GAME_FINISHED,
          scores: nextGame.playerIds.map((id) => ({
            player: this.databaseService.players.get(id),
            score: this.databaseService.players.get(id)?.score || 0,
          })),
        },
        connections,
      );
      return;
    }

    // Get an unused question (ensures no repeats)
    const unusedQuestion = this.gameUtils.getUnusedQuestion(
      nextGame.usedQuestionIds,
    );

    if (!unusedQuestion) {
      // No more questions available, end game
      nextGame.status = "finished";
      this.broadcastToGame(
        gameId,
        {
          type: WSMsgType.GAME_FINISHED,
          scores: nextGame.playerIds.map((id) => ({
            player: this.databaseService.players.get(id),
            score: this.databaseService.players.get(id)?.score || 0,
          })),
        },
        connections,
      );
      return;
    }

    // Randomize options and get new correct answer index
    const randomizedQuestion =
      this.gameUtils.randomizeQuestionOptions(unusedQuestion);

    // Mark this question as used
    nextGame.usedQuestionIds.push(unusedQuestion.id);

    // Store current question (with randomized options) and round start time
    nextGame.currentQuestion = randomizedQuestion;
    nextGame.roundStartTime = Date.now();
    nextGame.roundDuration = ROUND_DURATION_MS;

    // Start timer to automatically send results when round expires
    this.roundTimerService?.startRoundTimer(gameId, connections);

    // Remove correctAnswer before sending to client
    const sanitizedQuestion =
      this.gameUtils.sanitizeQuestionForClient(randomizedQuestion);

    this.broadcastToGame(
      gameId,
      {
        type: WSMsgType.NEXT_ROUND,
        round: nextGame.currentRound,
        totalRounds: nextGame.totalRounds,
        question: sanitizedQuestion,
        roundStartTime: nextGame.roundStartTime,
        roundDuration: nextGame.roundDuration,
      },
      connections,
    );
  }

  handleRequestRoundResults(
    gameId: string,
    client: WebSocket,
    connections: Map<string, WebSocket>,
  ) {
    if (!this.roundTimerService) {
      client.send(
        JSON.stringify({
          type: WSMsgType.ERROR,
          message: "Round timer service unavailable",
        }),
      );
      return;
    }

    const results = this.roundTimerService.getRoundResults(
      gameId,
      this.databaseService,
      this,
      connections,
    );
    if (results) {
      client.send(JSON.stringify(results));
      console.log(
        `📤 Sent requested round results to player - Game: ${gameId}`,
      );
    } else {
      // Round still active or no results available
      client.send(
        JSON.stringify({
          type: WSMsgType.ERROR,
          message: "Round is still active or results not available",
        }),
      );
    }
  }

  broadcastToGame(
    gameId: string,
    message: object,
    connections: Map<string, WebSocket>,
    excludePlayerId?: string,
  ) {
    const game = this.databaseService.games.get(gameId);
    if (!game) return;

    game.playerIds.forEach((playerId) => {
      // Skip excluded player
      if (excludePlayerId && playerId === excludePlayerId) {
        return;
      }

      const connection = connections.get(playerId);
      if (connection && connection.readyState === WebSocket.OPEN) {
        connection.send(JSON.stringify(message));
      }
    });
  }

  getLimitedPlayersList(playerIds: string[]): {
    players: Array<{
      id: string;
      name: string;
      avatar: string;
      score: number;
      gameId: string;
    }>;
    totalPlayers: number;
  } {
    const allPlayers = playerIds
      .map((id) => this.databaseService.players.get(id))
      .filter(
        (player): player is NonNullable<typeof player> => player !== undefined,
      );

    const totalPlayers = allPlayers.length;
    const limitedPlayers = allPlayers.slice(0, 15);

    return {
      players: limitedPlayers.map((player) => ({
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        score: player.score,
        gameId: player.gameId,
      })),
      totalPlayers,
    };
  }

  generateGameSummary(game: Game): GameSummary {
    return this.gameUtils.generateGameSummary(game);
  }

  private checkAndCompleteGame(
    gameId: string,
    game: Game,
    connections: Map<string, WebSocket>,
  ): boolean {
    const isLastRound = game.currentRound >= game.totalRounds;

    if (isLastRound && game.status === "playing") {
      // All rounds complete - mark as finished and send final results
      game.status = "finished";

      // Generate summary
      game.summary = this.generateGameSummary(game);

      const finalScores = game.playerIds.map((id: string) => ({
        player: this.databaseService.players.get(id),
        score: this.databaseService.players.get(id)?.score || 0,
      }));

      this.broadcastToGame(
        gameId,
        {
          type: WSMsgType.GAME_FINISHED,
          scores: finalScores,
          summary: game.summary,
        },
        connections,
      );

      console.log(
        `🎉 All rounds complete! Game finished - Round: ${game.currentRound}/${game.totalRounds}`,
      );

      return true; // Game completed
    }

    return false; // Game still in progress
  }

  private sendRoundResults(
    gameId: string,
    game: Game,
    currentQuestion: Question & { originalCorrectAnswer?: number },
    connections: Map<string, WebSocket>,
  ) {
    const allAnswers = Array.from(game.answers.entries()).map(([pid, ans]) => ({
      playerId: pid,
      player: this.databaseService.players.get(pid),
      answer: ans.answer,
      isCorrect: ans.answer === currentQuestion.correctAnswer,
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

    this.broadcastToGame(
      gameId,
      {
        type: WSMsgType.ROUND_RESULTS,
        round: game.currentRound,
        correctAnswer: currentQuestion.correctAnswer,
        answers: allAnswers,
      },
      connections,
    );
  }
}
