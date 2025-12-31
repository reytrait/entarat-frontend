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
    // Connect to WebSocket
    const wsUrl =
      typeof window !== "undefined"
        ? `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`
        : "ws://localhost:3000/ws";
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      // Join game
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
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "game_state":
          setGameState((prev) => ({
            ...prev,
            players: data.game.players || [],
            round: data.game.currentRound || 0,
            totalRounds: data.game.totalRounds || 12,
          }));
          break;

        case "player_joined":
          setGameState((prev) => ({
            ...prev,
            players: data.players || [],
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

        case "game_finished":
          // Handle game finished
          console.log("Game finished", data.scores);
          break;
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
      stopProgressTimer();
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
