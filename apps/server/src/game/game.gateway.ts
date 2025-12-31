import { Injectable, type OnModuleInit } from "@nestjs/common";
import type { Server, WebSocket } from "ws";
import type { DatabaseService } from "../database/database.service";
import type { JoinMessage } from "../types/game";
import type { GameService } from "./game.service";
import type { RoundTimerService } from "./round-timer.service";

@Injectable()
export class GameGateway implements OnModuleInit {
	server: Server | null = null;

	private connections = new Map<string, WebSocket>();

	constructor(
		private readonly databaseService: DatabaseService,
		private readonly gameService: GameService,
		private readonly roundTimerService: RoundTimerService,
	) {}

	onModuleInit() {
		// Server will be set externally via setServer method
	}

	setServer(server: Server) {
		this.server = server;
		this.server.on("connection", (client: WebSocket) => {
			this.handleConnection(client);
		});
	}

	private handleConnection(client: WebSocket) {
		console.log("🔌 Client connected");

		client.on("message", (message: Buffer) => {
			try {
				const data = JSON.parse(message.toString());
				this.handleMessage(data, client);
			} catch (error) {
				console.error("Error parsing WebSocket message:", error);
				client.send(
					JSON.stringify({
						type: "error",
						message: "Invalid message format",
					}),
				);
			}
		});

		client.on("close", () => {
			this.handleDisconnect(client);
		});

		client.on("error", (error) => {
			console.error("WebSocket error:", error);
		});
	}

	private handleDisconnect(client: WebSocket) {
		// Find and remove connection
		for (const [playerId, ws] of this.connections.entries()) {
			if (ws === client) {
				this.connections.delete(playerId);
				void this.handlePlayerLeave(playerId);
				break;
			}
		}
		console.log("🔌 Client disconnected");
	}

	private async handleMessage(data: unknown, client: WebSocket) {
		try {
			if (!data || typeof data !== "object" || !("type" in data)) {
				throw new Error("Invalid message format");
			}

			const message = data as { type: string; [key: string]: unknown };

			switch (message.type) {
				case "join":
					await this.gameService.handleJoin(
						message as JoinMessage,
						client,
						this.connections,
					);
					break;
				case "start_game":
					if (typeof message.gameId === "string") {
						await this.gameService.handleStartGame(
							message.gameId,
							this.connections,
							this.roundTimerService,
						);
					}
					break;
				case "submit_answer":
					if (
						typeof message.gameId === "string" &&
						typeof message.answer === "number"
					) {
						await this.gameService.handleSubmitAnswer(
							message.gameId,
							message.answer,
							client,
							this.connections,
							this.roundTimerService,
						);
					}
					break;
				case "next_round":
					if (typeof message.gameId === "string") {
						await this.gameService.handleNextRound(
							message.gameId,
							this.connections,
							this.roundTimerService,
						);
					}
					break;
				case "request_round_results":
					if (typeof message.gameId === "string") {
						await this.gameService.handleRequestRoundResults(
							message.gameId,
							client,
							this.connections,
							this.roundTimerService,
						);
					}
					break;
				default:
					console.warn("Unknown message type:", message.type);
					client.send(
						JSON.stringify({
							type: "error",
							message: `Unknown message type: ${message.type}`,
						}),
					);
			}
		} catch (error) {
			console.error("Error handling message:", error);
			client.send(
				JSON.stringify({
					type: "error",
					message: error instanceof Error ? error.message : "Unknown error",
				}),
			);
		}
	}

	private async handlePlayerLeave(playerId: string) {
		const player = await this.databaseService.getPlayer(playerId);
		if (!player) return;

		const game = await this.databaseService.getGame(player.gameId);
		if (!game) return;

		// Remove player from game
		const index = game.playerIds.indexOf(playerId);
		if (index > -1) {
			game.playerIds.splice(index, 1);
		}

		// Broadcast updated player list
		this.gameService.broadcastToGame(
			player.gameId,
			{
				type: "player_left",
				playerId,
				players: this.gameService.getLimitedPlayersList(game.playerIds).players,
				totalPlayers: game.playerIds.length,
			},
			this.connections,
		);
	}
}
