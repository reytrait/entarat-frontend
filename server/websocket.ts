import type { IncomingMessage } from "http";
import WebSocket from "ws";
import { ROUND_DURATION_MS } from "../src/lib/constants/game";
import { db } from "./db";
import type { JoinMessage, WebSocketMessage } from "./types";
import { getUnusedQuestion, randomizeQuestionOptions } from "./utils";

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
  let joinData: JoinMessage;
  let playerId: string | null = null;
  let gameId: string | null = null;

  console.log("🔌 New WebSocket connection established");

  ws.on("message", (message: WebSocket.RawData) => {
    try {
      const parsed = JSON.parse(message.toString());
      const data = parsed as WebSocketMessage;

      switch (data.type) {
        case "join": {
          // TypeScript should narrow data to JoinMessage here
          const joinMessage = data as JoinMessage;
          joinData = joinMessage;
          playerId = joinMessage.playerId;
          gameId = joinMessage.gameId;

          // Check if device already has a player in this game
          const game = db.games.get(gameId);
          if (game) {
            const existingPlayerWithDevice = game.playerIds.find((pid) => {
              const player = db.players.get(pid);
              return player?.deviceId === joinMessage.deviceId;
            });

            if (existingPlayerWithDevice) {
              const existingPlayer = db.players.get(existingPlayerWithDevice);
              console.log(
                `❌ Device already in game - Device: "${joinMessage.deviceId}", Existing Player: "${existingPlayer?.name}" (${existingPlayerWithDevice})`,
              );
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: `Device already connected to this game as "${existingPlayer?.name}". Only one connection per device is allowed.`,
                }),
              );
              ws.close(1008, "Device already in game");
              return;
            }
          }

          connections.set(playerId, ws);

          // Add player to game
          if (!db.games.has(gameId)) {
            // Ensure totalRounds doesn't exceed available questions
            const maxRounds = db.questions.length;
            const requestedRounds = joinMessage.totalRounds || 12;
            const totalRounds = Math.min(requestedRounds, maxRounds);

            db.games.set(gameId, {
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
              usedQuestionIds: [], // Track used questions
            });
            console.log(
              `🎮 New game created: ${gameId} with ${totalRounds} rounds (max available: ${maxRounds})`,
            );
          }

          const currentGame = db.games.get(gameId);
          if (currentGame && !currentGame.playerIds.includes(playerId)) {
            currentGame.playerIds.push(playerId);
          }

          // Store player info with deviceId
          db.players.set(playerId, {
            id: playerId,
            name: joinMessage.name,
            avatar: joinMessage.avatar,
            gameId: gameId,
            score: 0,
            deviceId: joinMessage.deviceId,
          });

          // Log user joined
          console.log(
            `✅ User joined - Name: "${joinMessage.name}", ID: "${playerId}", Device: "${joinMessage.deviceId}", Game: "${gameId}"`,
          );

          // Get limited players list (max 15) with total count
          const playersData = getLimitedPlayersList(
            currentGame?.playerIds || [],
          );

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
                ...currentGame,
                players: playersData.players,
                totalPlayers: playersData.totalPlayers,
              },
            }),
          );

          // If game is in progress, check if round has expired
          if (
            currentGame &&
            currentGame.status === "playing" &&
            currentGame.currentQuestion &&
            currentGame.roundStartTime
          ) {
            const now = Date.now();
            const elapsed = now - currentGame.roundStartTime;
            const remaining = Math.max(0, currentGame.roundDuration - elapsed);
            const timeExpired = remaining <= 0;

            // If time expired, calculate and send round results
            if (timeExpired) {
              const currentQuestion = currentGame.currentQuestion;

              // Calculate scores for all players who answered
              currentGame.answers.forEach((answerData, pid) => {
                if (answerData.answer === currentQuestion.correctAnswer) {
                  const player = db.players.get(pid);
                  if (player) {
                    player.score += 1;
                  }
                }
              });

              // Include all players in results (those who answered and those who didn't)
              const allAnswers = Array.from(currentGame.answers.entries()).map(
                ([pid, ans]) => ({
                  playerId: pid,
                  player: db.players.get(pid),
                  answer: ans.answer,
                  isCorrect: ans.answer === currentQuestion.correctAnswer,
                }),
              );

              // Add entries for players who didn't answer (answer: -1 means no answer)
              currentGame.playerIds.forEach((pid) => {
                if (!currentGame.answers.has(pid)) {
                  allAnswers.push({
                    playerId: pid,
                    player: db.players.get(pid),
                    answer: -1, // No answer submitted
                    isCorrect: false,
                  });
                }
              });

              // Send round results to reconnecting player
              ws.send(
                JSON.stringify({
                  type: "round_results",
                  round: currentGame.currentRound,
                  correctAnswer: currentQuestion.correctAnswer,
                  answers: allAnswers,
                }),
              );
              console.log(
                `📤 Sent round results to reconnecting player - Round: ${currentGame.currentRound} (expired, ${currentGame.answers.size}/${currentGame.playerIds.length} answered)`,
              );
            } else {
              // Round still active or no answers yet, send current question
              ws.send(
                JSON.stringify({
                  type: "game_started",
                  round: currentGame.currentRound,
                  totalRounds: currentGame.totalRounds,
                  question: currentGame.currentQuestion,
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
          break;
        }

        case "start_game": {
          gameId = data.gameId;
          const startGame = db.games.get(gameId);
          if (startGame) {
            startGame.status = "playing";
            startGame.currentRound = 1;
            startGame.startTime = Date.now();

            // Get an unused question (ensures no repeats)
            const unusedQuestion = getUnusedQuestion(
              db.questions,
              startGame.usedQuestionIds,
            );

            if (!unusedQuestion) {
              // No more questions available, end game
              startGame.status = "finished";
              broadcastToGame(gameId, {
                type: "game_finished",
                scores: startGame.playerIds.map((id) => ({
                  player: db.players.get(id),
                  score: db.players.get(id)?.score || 0,
                })),
              });
              break;
            }

            // Randomize options and get new correct answer index
            const randomizedQuestion = randomizeQuestionOptions(unusedQuestion);

            // Mark this question as used
            startGame.usedQuestionIds.push(unusedQuestion.id);

            // Store current question (with randomized options) and round start time
            startGame.currentQuestion = randomizedQuestion;
            startGame.roundStartTime = Date.now();
            startGame.roundDuration = ROUND_DURATION_MS;

            broadcastToGame(gameId, {
              type: "game_started",
              round: startGame.currentRound,
              totalRounds: startGame.totalRounds,
              question: randomizedQuestion,
              roundStartTime: startGame.roundStartTime,
              roundDuration: startGame.roundDuration,
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
              // Use the current question (already randomized) for scoring
              const currentQuestion = answerGame.currentQuestion;
              if (!currentQuestion) {
                console.error("No current question found for scoring");
                break;
              }

              // Calculate scores based on the randomized question's correct answer
              answerGame.answers.forEach((answerData, pid) => {
                if (answerData.answer === currentQuestion.correctAnswer) {
                  const player = db.players.get(pid);
                  if (player) {
                    player.score += 1;
                  }
                }
              });

              // Send results using the randomized question's correct answer
              broadcastToGame(gameId, {
                type: "round_results",
                round: answerGame.currentRound,
                correctAnswer: currentQuestion.correctAnswer,
                answers: Array.from(answerGame.answers.entries()).map(
                  ([pid, ans]) => ({
                    playerId: pid,
                    player: db.players.get(pid),
                    answer: ans.answer,
                    isCorrect: ans.answer === currentQuestion.correctAnswer,
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
              // Get an unused question (ensures no repeats)
              const unusedQuestion = getUnusedQuestion(
                db.questions,
                nextGame.usedQuestionIds,
              );

              if (!unusedQuestion) {
                // No more questions available, end game
                nextGame.status = "finished";
                broadcastToGame(gameId, {
                  type: "game_finished",
                  scores: nextGame.playerIds.map((id) => ({
                    player: db.players.get(id),
                    score: db.players.get(id)?.score || 0,
                  })),
                });
                break;
              }

              // Randomize options and get new correct answer index
              const randomizedQuestion =
                randomizeQuestionOptions(unusedQuestion);

              // Mark this question as used
              nextGame.usedQuestionIds.push(unusedQuestion.id);

              // Store current question (with randomized options) and round start time
              nextGame.currentQuestion = randomizedQuestion;
              nextGame.roundStartTime = Date.now();
              nextGame.roundDuration = ROUND_DURATION_MS;

              broadcastToGame(gameId, {
                type: "next_round",
                round: nextGame.currentRound,
                totalRounds: nextGame.totalRounds,
                question: randomizedQuestion,
                roundStartTime: nextGame.roundStartTime,
                roundDuration: nextGame.roundDuration,
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
    if (joinData?.playerId) {
      const playerId = joinData.playerId;
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
      console.log("👋 WebSocket connection closed (no player ID)", joinData);
    }
  });
}
