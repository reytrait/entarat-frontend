import { useEffect, useRef, useState } from "react";
import { useUser } from "../../../../components/user-provider";
import {
  PROGRESS_UPDATE_INTERVAL_MS,
  ROUND_DURATION_MS,
} from "../../../../lib/constants/game";
import { getDeviceId, getPlayerId } from "../../../../lib/utils";
import type { GameState, GameSummary, Player, Question } from "./types";

const QUESTION_DURATION = ROUND_DURATION_MS;
const PROGRESS_INTERVAL = PROGRESS_UPDATE_INTERVAL_MS;

// Global connection registry to prevent multiple connections per game
const connectionRegistry = new Map<string, WebSocket>();

export function useTriviaGame(gameId: string) {
  const { displayName, selectedAvatar } = useUser();
  const [gameState, setGameState] = useState<GameState>({
    round: 0,
    totalRounds: 12,
    question: null,
    selectedAnswer: null,
    showResults: false,
    correctAnswer: null,
    players: [],
    answers: [],
  });
  const [autoPlay, setAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number | null>(null); // Remaining time in seconds
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const requestResultsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayRef = useRef(autoPlay);
  const hasJoinedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Keep autoPlayRef in sync with autoPlay state
  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  useEffect(() => {
    isMountedRef.current = true;
    console.log("🔵 Effect starting for gameId:", gameId);
    console.log("🔵 Registry state:", Array.from(connectionRegistry.keys()));

    const stopProgressTimer = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    const startProgressTimer = (
      roundStartTime?: number,
      roundDuration?: number,
    ) => {
      stopProgressTimer();

      // If we have timing info from server (reconnecting during active round)
      if (roundStartTime !== undefined && roundDuration !== undefined) {
        const now = Date.now();
        const elapsed = now - roundStartTime;
        const actualRemaining = Math.max(0, roundDuration - elapsed);
        const initialProgress = (elapsed / roundDuration) * 100;

        setProgress(Math.min(100, Math.max(0, initialProgress)));
        setRemainingTime(Math.ceil(actualRemaining / 1000)); // Convert to seconds

        if (actualRemaining <= 0) {
          // Round already expired
          setProgress(100);
          setRemainingTime(0);
          return;
        }

        progressIntervalRef.current = setInterval(() => {
          const currentTime = Date.now();
          const currentElapsed = currentTime - roundStartTime;
          const currentRemaining = Math.max(0, roundDuration - currentElapsed);
          const remainingSeconds = Math.ceil(currentRemaining / 1000);

          setRemainingTime(remainingSeconds);

          setProgress(() => {
            const newProgress = (currentElapsed / roundDuration) * 100;
            if (newProgress >= 100 || remainingSeconds <= 0) {
              stopProgressTimer();
              setRemainingTime(0);
              // Mark time as expired when timer reaches 0
              setGameState((prev) => ({
                ...prev,
                timeExpired: true,
              }));
              return 100;
            }
            return Math.min(100, newProgress);
          });
        }, PROGRESS_INTERVAL);
      } else {
        // Normal case: starting fresh round
        setProgress(0);
        setRemainingTime(Math.ceil(QUESTION_DURATION / 1000)); // Initial countdown
        const increment = (PROGRESS_INTERVAL / QUESTION_DURATION) * 100;

        progressIntervalRef.current = setInterval(() => {
          setProgress((prev) => {
            const newProgress = prev + increment;
            // Update remaining time based on progress
            const remaining = QUESTION_DURATION * (1 - newProgress / 100);
            const remainingSeconds = Math.ceil(remaining / 1000);
            setRemainingTime(remainingSeconds);

            if (newProgress >= 100 || remainingSeconds <= 0) {
              stopProgressTimer();
              setRemainingTime(0);
              // Mark time as expired when timer reaches 0
              setGameState((prev) => ({
                ...prev,
                timeExpired: true,
              }));
              return 100;
            }
            return newProgress;
          });
        }, PROGRESS_INTERVAL);
      }
    };

    // Check if a connection already exists for this game
    const existingConnection = connectionRegistry.get(gameId);
    if (existingConnection) {
      const state = existingConnection.readyState;
      console.log(
        "🟢 Found existing connection, state:",
        state,
        "(0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED)",
      );

      if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
        console.log(
          "✅ Reusing existing WebSocket connection for game:",
          gameId,
        );
        wsRef.current = existingConnection;
        return;
      }

      // Connection is closing or closed, remove it
      console.log("🧹 Removing stale connection from registry");
      connectionRegistry.delete(gameId);
    }

    // TEMPORARILY: Connect directly to backend (bypassing proxy)
    // TODO: Re-enable proxy after testing
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/ws";

    let ws: WebSocket;
    try {
      setConnectionError(null);
      console.log("🚀 Creating NEW WebSocket connection", wsUrl);
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      // Register this connection immediately
      connectionRegistry.set(gameId, ws);
      console.log("📝 Registered connection in global registry for:", gameId);
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      setConnectionError("Failed to connect to game server");
      return;
    }

    ws.onopen = () => {
      console.log(
        "WebSocket connected, waiting for socket_connected message...",
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "socket_connected": {
            console.log("✅ Socket connected confirmed", {
              connectionId: data.connectionId,
              timestamp: data.timestamp,
            });

            // Prevent duplicate join messages
            if (hasJoinedRef.current) {
              console.log("Join message already sent, skipping...");
              break;
            }

            // Now send join message after receiving socket_connected
            if (ws.readyState === WebSocket.OPEN) {
              hasJoinedRef.current = true;
              const deviceId = getDeviceId();
              const playerId = getPlayerId();
              ws.send(
                JSON.stringify({
                  type: "join",
                  gameId: gameId,
                  playerId: playerId,
                  name: displayName || "Player",
                  avatar: selectedAvatar || "/avatars/avatar-blue-square.svg",
                  deviceId: deviceId,
                  totalRounds: 12,
                }),
              );
              console.log("Join message sent", { playerId, deviceId, gameId });
            }
            break;
          }

          case "players_list":
            setGameState((prev) => ({
              ...prev,
              players: data.players || [],
              totalPlayers: data.totalPlayers,
            }));
            break;

          case "game_state": {
            const gameStateData = data as {
              game: {
                players: Player[];
                totalPlayers: number;
                currentRound: number;
                totalRounds: number;
                status: string;
                summary?: GameSummary;
              };
            };

            // If game is finished, set finished state and summary
            const isFinished = gameStateData.game.status === "finished";

            setGameState((prev) => ({
              ...prev,
              players: gameStateData.game.players || [],
              totalPlayers: gameStateData.game.totalPlayers,
              round: gameStateData.game.currentRound || 0,
              totalRounds: gameStateData.game.totalRounds || 12,
              isFinished: isFinished,
              summary: gameStateData.game.summary,
              // If finished, also set final scores from players
              ...(isFinished && {
                finalScores: gameStateData.game.players.map((player) => ({
                  player,
                  score: player.score || 0,
                })),
              }),
            }));
            break;
          }

          case "player_joined":
            setGameState((prev) => ({
              ...prev,
              players: data.players || [],
              totalPlayers: data.totalPlayers,
            }));
            break;

          case "game_started": {
            const gameStartedData = data as {
              round: number;
              totalRounds: number;
              question: Question;
              roundStartTime?: number;
              roundDuration?: number;
              remainingTime?: number;
            };

            // Check if time has already expired (remainingTime is 0 or negative)
            const timeExpired =
              gameStartedData.remainingTime !== undefined &&
              gameStartedData.remainingTime <= 0;

            // If time expired on resume, check if it's the last round
            if (timeExpired) {
              const isLastRound =
                gameStartedData.round >= gameStartedData.totalRounds;

              stopProgressTimer();
              setRemainingTime(0);
              setProgress(100);

              // If it's the last round, wait for game_finished message
              // Otherwise, wait for round_results
              if (isLastRound) {
                // Last round expired - wait for game_finished
                setGameState((prev) => ({
                  ...prev,
                  round: gameStartedData.round,
                  totalRounds: gameStartedData.totalRounds,
                  question: null, // Don't show question for last round
                  timeExpired: true,
                  showResults: false,
                  isFinished: false, // Will be set to true when game_finished arrives
                }));
                console.log(
                  "Last round expired on resume, waiting for game_finished...",
                );

                // Request game finished results if not received within 1 second
                if (requestResultsTimeoutRef.current) {
                  clearTimeout(requestResultsTimeoutRef.current);
                }
                requestResultsTimeoutRef.current = setTimeout(() => {
                  if (wsRef.current?.readyState === WebSocket.OPEN) {
                    console.log(
                      "Requesting game finished results from server...",
                    );
                    wsRef.current.send(
                      JSON.stringify({
                        type: "request_round_results",
                        gameId: gameId,
                      }),
                    );
                  }
                  requestResultsTimeoutRef.current = null;
                }, 1000);
              } else {
                // Not last round - wait for round_results
                setGameState((prev) => ({
                  ...prev,
                  round: gameStartedData.round,
                  totalRounds: gameStartedData.totalRounds,
                  question: gameStartedData.question, // Keep question for context
                  timeExpired: true,
                  showResults: false, // Will be set to true when round_results arrives
                }));
                console.log(
                  "Round expired on resume, waiting for round_results...",
                );

                // Request round results if not received within 1 second
                if (requestResultsTimeoutRef.current) {
                  clearTimeout(requestResultsTimeoutRef.current);
                }
                requestResultsTimeoutRef.current = setTimeout(() => {
                  if (wsRef.current?.readyState === WebSocket.OPEN) {
                    console.log("Requesting round results from server...");
                    wsRef.current.send(
                      JSON.stringify({
                        type: "request_round_results",
                        gameId: gameId,
                      }),
                    );
                  }
                  requestResultsTimeoutRef.current = null;
                }, 1000);
              }
            } else {
              // Round still active, show question and start timer
              setGameState((prev) => ({
                ...prev,
                round: gameStartedData.round,
                totalRounds: gameStartedData.totalRounds,
                question: gameStartedData.question,
                selectedAnswer: null,
                showResults: false,
                correctAnswer: null,
                answers: [],
                timeExpired: false,
              }));

              // Use server-provided timing if available (for reconnections)
              startProgressTimer(
                gameStartedData.roundStartTime,
                gameStartedData.roundDuration,
              );
            }
            break;
          }

          case "round_results": {
            const roundResultsData = data as {
              round: number;
              correctAnswer: number;
              answers: Array<{
                playerId: string;
                player: Player | undefined;
                answer: number;
                isCorrect: boolean;
              }>;
            };

            // Check if this is the last round and update state
            // Preserve selectedAnswer so it shows what was selected
            setGameState((prev) => {
              const isLastRound = roundResultsData.round >= prev.totalRounds;

              // Auto-play: If enabled and not last round, automatically go to next round after 3 seconds
              if (autoPlayRef.current && !isLastRound) {
                // Clear any existing autoplay timeout
                if (autoPlayTimeoutRef.current) {
                  clearTimeout(autoPlayTimeoutRef.current);
                }

                // Set timeout to automatically go to next round after 3 seconds
                autoPlayTimeoutRef.current = setTimeout(() => {
                  if (
                    wsRef.current?.readyState === WebSocket.OPEN &&
                    isMountedRef.current
                  ) {
                    console.log(
                      "🔄 Auto-play: Automatically advancing to next round",
                    );
                    wsRef.current.send(
                      JSON.stringify({
                        type: "next_round",
                        gameId: gameId,
                      }),
                    );
                  }
                  autoPlayTimeoutRef.current = null;
                }, 3000); // 3 seconds delay
              }

              return {
                ...prev,
                showResults: true,
                correctAnswer: roundResultsData.correctAnswer,
                answers: (roundResultsData.answers || []).filter(
                  (a): a is typeof a & { player: Player } =>
                    a.player !== undefined,
                ),
                isFinished: isLastRound,
                timeExpired: false, // Reset time expired when results are shown
                // Keep selectedAnswer so it displays in results
              };
            });
            stopProgressTimer();
            setRemainingTime(null); // Clear countdown when round ends
            break;
          }

          case "next_round": {
            const nextRoundData = data as {
              round: number;
              totalRounds: number;
              question: Question;
              roundStartTime?: number;
              roundDuration?: number;
            };
            setGameState((prev) => ({
              ...prev,
              round: nextRoundData.round,
              question: nextRoundData.question,
              selectedAnswer: null,
              showResults: false,
              correctAnswer: null,
              answers: [],
            }));
            // Use server-provided timing if available
            startProgressTimer(
              nextRoundData.roundStartTime,
              nextRoundData.roundDuration,
            );
            break;
          }

          case "player_left":
            setGameState((prev) => ({
              ...prev,
              players: data.players || [],
              totalPlayers: data.totalPlayers,
            }));
            break;

          case "error":
            console.error("WebSocket error:", data.message);
            setConnectionError(data.message || "An error occurred");
            break;

          case "game_finished": {
            // Clear the request timeout since we received final scores
            if (requestResultsTimeoutRef.current) {
              clearTimeout(requestResultsTimeoutRef.current);
              requestResultsTimeoutRef.current = null;
            }

            const gameFinishedData = data as {
              scores: Array<{
                player: Player | undefined;
                score: number;
              }>;
              summary?: GameSummary;
            };
            setGameState((prev) => ({
              ...prev,
              isFinished: true,
              showResults: false,
              question: null,
              finalScores: gameFinishedData.scores || [],
              summary: gameFinishedData.summary,
            }));
            stopProgressTimer();
            setRemainingTime(null);
            break;
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionError("Connection error occurred");
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected", event.code, event.reason);

      // Remove from registry
      if (connectionRegistry.get(gameId) === ws) {
        connectionRegistry.delete(gameId);
      }

      wsRef.current = null;
      hasJoinedRef.current = false;

      // Set error for unexpected closures
      if (event.code !== 1000 && event.code !== 1001 && event.code !== 1006) {
        if (event.code === 1008) {
          setConnectionError(
            event.reason || "Device already connected to this game",
          );
        } else {
          setConnectionError("Connection closed unexpectedly");
        }
      }
    };

    // Cleanup function
    return () => {
      console.log("🔴 Effect cleanup called");
      isMountedRef.current = false;
      stopProgressTimer();

      // Clear request timeout
      if (requestResultsTimeoutRef.current) {
        clearTimeout(requestResultsTimeoutRef.current);
        requestResultsTimeoutRef.current = null;
      }

      // Clear autoplay timeout
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
        autoPlayTimeoutRef.current = null;
      }

      // In React Strict Mode, cleanup runs immediately before re-mount
      // Add a small delay to allow the re-mounted effect to see the existing connection
      setTimeout(() => {
        // Only close if:
        // 1. This is STILL the registered connection
        // 2. Component is NOT mounted (isMountedRef is still false after delay)
        if (
          !isMountedRef.current &&
          connectionRegistry.get(gameId) === ws &&
          ws.readyState === WebSocket.OPEN
        ) {
          console.log(
            "🔌 Closing WebSocket in cleanup (component truly unmounted)",
          );
          try {
            ws.close(1000, "Component unmounting");
            connectionRegistry.delete(gameId);
          } catch (error) {
            console.log("Error closing WebSocket:", error);
          }
        } else {
          console.log(
            "⏭️ Skipping cleanup close - component remounted or connection replaced",
          );
        }
      }, 50); // 50ms delay to let React Strict Mode re-mount complete
    };
  }, [gameId, displayName, selectedAvatar]);

  const handleAnswerSelect = (answerIndex: number) => {
    // Prevent selection if: already selected, results shown, or time expired
    if (
      gameState.selectedAnswer !== null ||
      gameState.showResults ||
      gameState.timeExpired
    ) {
      return;
    }

    setGameState((prev) => ({ ...prev, selectedAnswer: answerIndex }));

    // Send answer to server
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "submit_answer",
          gameId: gameId,
          answer: answerIndex,
        }),
      );
    }
  };

  const handleNextRound = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "next_round",
          gameId: gameId,
        }),
      );
    }
  };

  const handleStartGame = () => {
    console.log("handleStartGame");
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "start_game",
          gameId: gameId,
        }),
      );
    }
  };

  return {
    gameState,
    autoPlay,
    setAutoPlay,
    progress,
    remainingTime,
    connectionError,
    handleAnswerSelect,
    handleNextRound,
    handleStartGame,
  };
}
