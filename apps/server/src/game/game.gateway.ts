import { Injectable, OnModuleInit } from "@nestjs/common";
import { WebSocketServer } from "@nestjs/platform-ws";
import { Server, WebSocket } from "ws";
import type { JoinMessage } from "../types/game";
import { DatabaseService } from "../database/database.service";
import { GameService } from "./game.service";
import { RoundTimerService } from "./round-timer.service";

@Injectable()
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private connections = new Map<string, WebSocket>();

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly gameService: GameService,
    private readonly roundTimerService: RoundTimerService,
  ) {}

  onModuleInit() {
    this.server.on("connection", (client: WebSocket) => {
      this.handleConnection(client);
    });
  }

  private handleConnection(client: WebSocket) {
    console.log("🔌 Client connected");

    client.on("message", (message: WebSocket.RawData) => {
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
        this.handlePlayerLeave(playerId);
        break;
      }
    }
    console.log("🔌 Client disconnected");
  }

  private async handleMessage(data: any, client: WebSocket) {
    try {
      switch (data.type) {
        case "join":
          await this.gameService.handleJoin(
            data as JoinMessage,
            client,
            this.connections,
          );
          break;
        case "start_game":
          await this.gameService.handleStartGame(
            data.gameId,
            this.connections,
            this.roundTimerService,
          );
          break;
        case "submit_answer":
          await this.gameService.handleSubmitAnswer(
            data.gameId,
            data.answer,
            client,
            this.connections,
            this.roundTimerService,
          );
          break;
        case "next_round":
          await this.gameService.handleNextRound(
            data.gameId,
            this.connections,
            this.roundTimerService,
          );
          break;
        case "request_round_results":
          await this.gameService.handleRequestRoundResults(
            data.gameId,
            client,
            this.connections,
            this.roundTimerService,
          );
          break;
        default:
          console.warn("Unknown message type:", data.type);
          client.send(
            JSON.stringify({
              type: "error",
              message: `Unknown message type: ${data.type}`,
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

  private handlePlayerLeave(playerId: string) {
    const player = this.databaseService.players.get(playerId);
    if (!player) return;

    const game = this.databaseService.games.get(player.gameId);
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

