import { Injectable, type OnModuleInit } from "@nestjs/common";
import { Server, WebSocket } from "ws";
import { DatabaseService } from "../database/database.service";
import { JoinMessage, WSMsgType } from "../types/game";
import { GameService } from "./game.service";
import { RoundTimerService } from "./round-timer.service";

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
    console.log("✅ GameGateway initialized (waiting for server)");
  }

  setServer(server: Server) {
    this.server = server;
    this.server.on("connection", (client: WebSocket) => {
      this.handleConnection(client);
    });
    console.log("✅ WebSocket server attached to GameGateway");
  }

  private handleConnection(client: WebSocket) {
    console.log("🔌 Client connected");

    // Send connection confirmation with ID and timestamp
    const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const connectionMessage = JSON.stringify({
      type: WSMsgType.SOCKET_CONNECTED,
      connectionId,
      timestamp: Date.now(),
    });

    if (client.readyState === WebSocket.OPEN) {
      client.send(connectionMessage);
    } else {
      client.once("open", () => {
        client.send(connectionMessage);
      });
    }

    client.on("message", (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        this.handleMessage(data, client);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        client.send(
          JSON.stringify({
            type: WSMsgType.ERROR,
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
        case WSMsgType.JOIN:
          await this.gameService.handleJoin(
            message as JoinMessage,
            client,
            this.connections,
          );
          break;
        case WSMsgType.START_GAME:
          if (typeof message.gameId === "string") {
            if (!this.roundTimerService) {
              console.error(
                "RoundTimerService is not available in GameGateway",
              );
              client.send(
                JSON.stringify({
                  type: WSMsgType.ERROR,
                  message: "Game service unavailable",
                }),
              );
              return;
            }
            await this.gameService.handleStartGame(
              message.gameId,
              this.connections,
            );
          }
          break;
        case WSMsgType.SUBMIT_ANSWER:
          if (
            typeof message.gameId === "string" &&
            typeof message.answer === "number"
          ) {
            await this.gameService.handleSubmitAnswer(
              message.gameId,
              message.answer,
              client,
              this.connections,
            );
          }
          break;
        case WSMsgType.NEXT_ROUND:
          if (typeof message.gameId === "string") {
            await this.gameService.handleNextRound(
              message.gameId,
              this.connections,
            );
          }
          break;
        case WSMsgType.REQUEST_ROUND_RESULTS:
          if (typeof message.gameId === "string") {
            await this.gameService.handleRequestRoundResults(
              message.gameId,
              client,
              this.connections,
            );
          }
          break;
        default:
          console.warn("Unknown message type:", message.type);
          client.send(
            JSON.stringify({
              type: WSMsgType.ERROR,
              message: `Unknown message type: ${message.type}`,
            }),
          );
      }
    } catch (error) {
      console.error("Error handling message:", error);
      client.send(
        JSON.stringify({
          type: WSMsgType.ERROR,
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
        type: WSMsgType.PLAYER_LEFT,
        playerId,
        players: this.gameService.getLimitedPlayersList(game.playerIds).players,
        totalPlayers: game.playerIds.length,
      },
      this.connections,
    );
  }
}
