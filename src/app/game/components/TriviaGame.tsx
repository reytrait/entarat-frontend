"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import { Text } from "@/components/ui/text";
import { useUser } from "@/components/user-provider";
import { SITE_CONFIG } from "@/lib/constants";

type Player = {
  id: string;
  name: string;
  avatar: string;
  score: number;
};

type Question = {
  id: number;
  question: string;
  image: string;
  options: string[];
  correctAnswer: number;
  category: string;
};

type GameState = {
  round: number;
  totalRounds: number;
  question: Question | null;
  selectedAnswer: number | null;
  showResults: boolean;
  correctAnswer: number | null;
  players: Player[];
  answers: Array<{
    playerId: string;
    player: Player;
    answer: number;
    isCorrect: boolean;
  }>;
};

type TriviaGameProps = {
  gameId: string;
};

export function TriviaGame({ gameId }: TriviaGameProps) {
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

  const startProgressTimer = () => {
    stopProgressTimer();
    setProgress(0);
    const duration = 30000; // 30 seconds per question
    const interval = 100; // Update every 100ms
    const increment = (interval / duration) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          stopProgressTimer();
          return 100;
        }
        return prev + increment;
      });
    }, interval);
  };

  const stopProgressTimer = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

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

  const getAnswerColor = (index: number) => {
    if (!gameState.showResults) {
      return gameState.selectedAnswer === index
        ? "border-yellow-400 bg-yellow-400/20"
        : "border-blue-500 bg-blue-500/20";
    }

    if (index === gameState.correctAnswer) {
      return "border-green-500 bg-green-500/20 text-green-400";
    }

    if (
      gameState.selectedAnswer === index &&
      index !== gameState.correctAnswer
    ) {
      return "border-red-500 bg-red-500/20 text-red-400";
    }

    return "border-blue-500 bg-blue-500/20";
  };

  if (!gameState.question && gameState.round === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Text variant="h2" textColor="white" className="mb-4">
            Waiting for game to start...
          </Text>
          <EntaratBtn variant="primary" onClick={handleStartGame}>
            Start Game
          </EntaratBtn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-purple-900/40 p-4 md:p-8">
      <div className="container mx-auto grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main Game Area */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={SITE_CONFIG.logo.noText_white}
                alt={SITE_CONFIG.logo.alt}
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <Text variant="h4" textColor="white">
                TRIVIA GAME
              </Text>
            </div>
          </div>

          {/* Round Info */}
          <div className="mb-4">
            <Text variant="h2" textColor="white" className="mb-2">
              TRIVIA
            </Text>
            <Text variant="body" textColor="white" className="mb-2">
              Round {gameState.round} of {gameState.totalRounds}
            </Text>
            {/* Progress Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full bg-orange-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          {gameState.question && (
            <div className="mb-6 rounded-lg bg-gray-900/80 p-6">
              <Text variant="h3" textColor="white" className="mb-4">
                {gameState.question.question}
              </Text>

              {/* Question Image Placeholder */}
              <div className="mb-6 flex justify-center">
                <div className="relative h-64 w-full max-w-md overflow-hidden rounded-lg bg-gray-800">
                  <div className="flex h-full items-center justify-center">
                    <Text
                      variant="body"
                      textColor="white"
                      className="opacity-50"
                    >
                      {gameState.question.image}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {gameState.question.options.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={
                      gameState.showResults || gameState.selectedAnswer !== null
                    }
                    className={`cursor-pointer rounded-lg border-2 p-4 text-left transition-all hover:scale-105 ${getAnswerColor(index)}`}
                  >
                    <Text variant="body" textColor="white">
                      {option}
                    </Text>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Next Round Button */}
          {gameState.showResults && gameState.round < gameState.totalRounds && (
            <div className="flex justify-end">
              <EntaratBtn variant="primary" size="lg" onClick={handleNextRound}>
                Next Round →
              </EntaratBtn>
            </div>
          )}
        </div>

        {/* Players Panel */}
        <div className="rounded-lg bg-purple-900/50 p-4">
          <Text variant="h4" textColor="white" className="mb-4">
            Players
          </Text>

          <div className="space-y-2">
            {gameState.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-3 rounded-md bg-gray-800/50 p-2"
              >
                <div className="relative h-8 w-8 shrink-0">
                  <Image
                    src={player.avatar}
                    alt={player.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <Text variant="small" textColor="white">
                    {player.name}
                  </Text>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-gray-700">
                    <div className="h-full w-full bg-green-500" />
                  </div>
                </div>
                <div className="h-6 w-6 rounded-full bg-yellow-500" />
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Text variant="small" textColor="white">
                Mic
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text variant="small" textColor="white">
                Auto Play
              </Text>
              <button
                type="button"
                onClick={() => setAutoPlay(!autoPlay)}
                className={`h-6 w-12 rounded-full transition-colors ${
                  autoPlay ? "bg-orange-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white transition-transform ${
                    autoPlay ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Next Round Info */}
          {gameState.round < gameState.totalRounds && (
            <div className="mt-6">
              <Text variant="small" textColor="white" className="opacity-70">
                Round {gameState.round + 1} of {gameState.totalRounds}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
