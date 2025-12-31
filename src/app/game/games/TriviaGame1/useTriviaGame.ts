import { useEffect, useRef, useState } from "react";
import { useUser } from "@/components/user-provider";
import { getDeviceId, getPlayerId } from "@/lib/utils";
import type { GameState } from "./types";

const QUESTION_DURATION = 30000; // 30 seconds per question
const PROGRESS_INTERVAL = 100; // Update every 100ms

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
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasJoinedRef = useRef(false);
  const isMountedRef = useRef(true);

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

    const startProgressTimer = () => {
      stopProgressTimer();
      setProgress(0);
      const increment = (PROGRESS_INTERVAL / QUESTION_DURATION) * 100;

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            stopProgressTimer();
            return 100;
          }
          return prev + increment;
        });
      }, PROGRESS_INTERVAL);
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

    // Connect to WebSocket
    const wsUrl =
      typeof window !== "undefined"
        ? `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`
        : "ws://localhost:3000/ws";

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
      console.log("WebSocket connected");

      // Prevent duplicate join messages
      if (hasJoinedRef.current) {
        console.log("Join message already sent, skipping...");
        return;
      }

      // Join game with device ID and persistent player ID
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
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "players_list":
            setGameState((prev) => ({
              ...prev,
              players: data.players || [],
              totalPlayers: data.totalPlayers,
            }));
            break;

          case "game_state":
            setGameState((prev) => ({
              ...prev,
              players: data.game.players || [],
              totalPlayers: data.game.totalPlayers,
              round: data.game.currentRound || 0,
              totalRounds: data.game.totalRounds || 12,
            }));
            break;

          case "player_joined":
            setGameState((prev) => ({
              ...prev,
              players: data.players || [],
              totalPlayers: data.totalPlayers,
            }));
            break;

          case "game_started":
            setGameState((prev) => ({
              ...prev,
              round: data.round,
              totalRounds: data.totalRounds,
              question: data.question,
              selectedAnswer: null,
              showResults: false,
              correctAnswer: null,
              answers: [],
            }));
            startProgressTimer();
            break;

          case "round_results":
            setGameState((prev) => ({
              ...prev,
              showResults: true,
              correctAnswer: data.correctAnswer,
              answers: data.answers || [],
            }));
            stopProgressTimer();
            break;

          case "next_round":
            setGameState((prev) => ({
              ...prev,
              round: data.round,
              question: data.question,
              selectedAnswer: null,
              showResults: false,
              correctAnswer: null,
              answers: [],
            }));
            startProgressTimer();
            break;

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

          case "game_finished":
            console.log("Game finished", data.scores);
            break;
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
    if (gameState.selectedAnswer !== null || gameState.showResults) return;

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
    connectionError,
    handleAnswerSelect,
    handleNextRound,
    handleStartGame,
  };
}
