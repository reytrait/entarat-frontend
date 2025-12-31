import { useEffect, useRef, useState } from "react";
import { useUser } from "@/components/user-provider";
import type { GameState } from "./types";

const QUESTION_DURATION = 30000; // 30 seconds per question
const PROGRESS_INTERVAL = 100; // Update every 100ms

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
  const wsRef = useRef<WebSocket | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
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

    // Skip if already connected or connecting
    if (wsRef.current) {
      const currentState = wsRef.current.readyState;
      if (
        currentState === WebSocket.CONNECTING ||
        currentState === WebSocket.OPEN
      ) {
        return;
      }
    }

    // Connect to WebSocket
    const wsUrl =
      typeof window !== "undefined"
        ? `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`
        : "ws://localhost:3000/ws";

    let ws: WebSocket;
    try {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      return;
    }

    ws.onopen = () => {
      console.log("WebSocket connected");
      // Join game
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "join",
            gameId: gameId,
            playerId: `player-${Date.now()}`,
            name: displayName || "Player",
            avatar: selectedAvatar || "/avatars/avatar-blue-square.svg",
            totalRounds: 12,
          }),
        );
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "players_list":
            // Explicit players list sent to newly joined user
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

          case "game_finished":
            // Handle game finished
            console.log("Game finished", data.scores);
            break;
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected", event.code, event.reason);
      // Only clear ref if this is our connection
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
    };

    return () => {
      stopProgressTimer();
      // Only close if this is still our connection
      if (wsRef.current === ws) {
        if (
          ws.readyState === WebSocket.CONNECTING ||
          ws.readyState === WebSocket.OPEN
        ) {
          ws.close(1000, "Component unmounting");
        }
        wsRef.current = null;
      }
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
    handleAnswerSelect,
    handleNextRound,
    handleStartGame,
  };
}
