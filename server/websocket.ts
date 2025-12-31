import type { IncomingMessage } from "http";
import WebSocket from "ws";
import { db } from "./db";
import type { WebSocketMessage } from "./types";

// Store active connections
export const connections = new Map<string, WebSocket>();

// Helper function to broadcast to all clients in a game
export function broadcastToGame(gameId: string, message: object) {
  const game = db.games.get(gameId);
  if (!game) return;

  game.playerIds.forEach((playerId) => {
    const connection = connections.get(playerId);
    if (connection && connection.readyState === WebSocket.OPEN) {
      connection.send(JSON.stringify(message));
    }
  });
}

// Helper function to get limited players list (max 15) with total count
function getLimitedPlayersList(playerIds: string[]): {
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
    .map((id) => db.players.get(id))
    .filter(
      (player): player is NonNullable<typeof player> => player !== undefined,
    );

  const totalPlayers = allPlayers.length;
  const limitedPlayers = allPlayers.slice(0, 15);

  return {
    players: limitedPlayers,
    totalPlayers,
  };
}

export function handleWebSocketConnection(
  ws: WebSocket,
  _req: IncomingMessage,
) {
  let playerId: string | null = null;
  let gameId: string | null = null;

  console.log("🔌 New WebSocket connection established");

  ws.on("message", (message: WebSocket.RawData) => {
    try {
      const data = JSON.parse(message.toString()) as WebSocketMessage;

      switch (data.type) {
        case "join": {
          playerId = data.playerId;
          gameId = data.gameId;
          connections.set(playerId, ws);

          // Add player to game
          if (!db.games.has(gameId)) {
            db.games.set(gameId, {
              id: gameId,
              playerIds: [],
              currentRound: 0,
              totalRounds: data.totalRounds || 12,
              status: "waiting",
              answers: new Map(),
              startTime: null,
            });
            console.log(`🎮 New game created: ${gameId}`);
          }

          const game = db.games.get(gameId);
          if (game && !game.playerIds.includes(playerId)) {
            game.playerIds.push(playerId);
          }

          // Store player info
          db.players.set(playerId, {
            id: playerId,
            name: data.name,
            avatar: data.avatar,
            gameId: gameId,
            score: 0,
          });

          // Log user joined
          console.log(
            `✅ User joined - Name: "${data.name}", ID: "${playerId}", Game: "${gameId}"`,
          );

          // Get limited players list (max 15) with total count
          const playersData = getLimitedPlayersList(game?.playerIds || []);

          // Send limited players list to the newly joined user
          ws.send(
            JSON.stringify({
              type: "players_list",
              players: playersData.players,
              totalPlayers: playersData.totalPlayers,
            }),
          );

          // Notify all players in game (including the newly joined one)
          broadcastToGame(gameId, {
            type: "player_joined",
            player: db.players.get(playerId),
            players: playersData.players,
            totalPlayers: playersData.totalPlayers,
          });

          // Send current game state to the newly joined user
          ws.send(
            JSON.stringify({
              type: "game_state",
              game: {
                ...game,
                players: playersData.players,
                totalPlayers: playersData.totalPlayers,
              },
            }),
          );
          break;
        }

        case "start_game": {
          gameId = data.gameId;
          const startGame = db.games.get(gameId);
          if (startGame) {
            startGame.status = "playing";
            startGame.currentRound = 1;
            startGame.startTime = Date.now();

            // Get question for current round
            const questionIndex =
              (startGame.currentRound - 1) % db.questions.length;
            const question = db.questions[questionIndex];

            broadcastToGame(gameId, {
              type: "game_started",
              round: startGame.currentRound,
              totalRounds: startGame.totalRounds,
              question: question,
            });
          }
          break;
        }

        case "submit_answer": {
          gameId = data.gameId;
          const answerGame = db.games.get(gameId);
          if (answerGame && playerId) {
            answerGame.answers.set(playerId, {
              answer: data.answer,
              round: answerGame.currentRound,
              timestamp: Date.now(),
            });

            // Check if all players answered
            if (answerGame.answers.size === answerGame.playerIds.length) {
              const questionIndex =
                (answerGame.currentRound - 1) % db.questions.length;
              const question = db.questions[questionIndex];

              // Calculate scores
              answerGame.answers.forEach((answerData, pid) => {
                if (answerData.answer === question.correctAnswer) {
                  const player = db.players.get(pid);
                  if (player) {
                    player.score += 1;
                  }
                }
              });

              // Send results
              broadcastToGame(gameId, {
                type: "round_results",
                round: answerGame.currentRound,
                correctAnswer: question.correctAnswer,
                answers: Array.from(answerGame.answers.entries()).map(
                  ([pid, ans]) => ({
                    playerId: pid,
                    player: db.players.get(pid),
                    answer: ans.answer,
                    isCorrect: ans.answer === question.correctAnswer,
                  }),
                ),
              });

              // Clear answers for next round
              answerGame.answers.clear();
            } else {
              // Notify that answer was received
              broadcastToGame(gameId, {
                type: "answer_received",
                playerId: playerId,
                remaining:
                  answerGame.playerIds.length - answerGame.answers.size,
              });
            }
          }
          break;
        }

        case "next_round": {
          gameId = data.gameId;
          const nextGame = db.games.get(gameId);
          if (nextGame) {
            nextGame.currentRound += 1;

            if (nextGame.currentRound > nextGame.totalRounds) {
              // Game over
              nextGame.status = "finished";
              broadcastToGame(gameId, {
                type: "game_finished",
                scores: nextGame.playerIds.map((id) => ({
                  player: db.players.get(id),
                  score: db.players.get(id)?.score || 0,
                })),
              });
            } else {
              // Get next question
              const questionIndex =
                (nextGame.currentRound - 1) % db.questions.length;
              const question = db.questions[questionIndex];

              broadcastToGame(gameId, {
                type: "next_round",
                round: nextGame.currentRound,
                totalRounds: nextGame.totalRounds,
                question: question,
              });
            }
          }
          break;
        }
      }
    } catch (error) {
      console.error("Error handling message:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      );
    }
  });

  ws.on("close", () => {
    if (playerId) {
      const player = db.players.get(playerId);
      const playerName = player?.name || "Unknown";
      console.log(
        `👋 User disconnected - Name: "${playerName}", ID: "${playerId}"`,
      );
      connections.delete(playerId);
      if (gameId) {
        const game = db.games.get(gameId);
        if (game) {
          game.playerIds = game.playerIds.filter((id) => id !== playerId);
          const playersData = getLimitedPlayersList(game.playerIds);
          broadcastToGame(gameId, {
            type: "player_left",
            playerId: playerId,
            players: playersData.players,
            totalPlayers: playersData.totalPlayers,
          });
        }
      }
    } else {
      console.log("👋 WebSocket connection closed (no player ID)");
    }
  });
}
