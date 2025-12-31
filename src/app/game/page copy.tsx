"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { GameStartLoader } from "@/app/game/components/GameStartLoader";
import { TriviaGame } from "@/app/game/components/TriviaGame";

export default function GamePage() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId") || "trivia-1";
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameStartComplete = () => {
    setGameStarted(true);
  };

  return (
    <>
      {/* Show loader first, then transition to game */}
      {!gameStarted && <GameStartLoader onComplete={handleGameStartComplete} />}

      {/* Main game content */}
      {gameStarted && <TriviaGame gameId={gameId} />}
    </>
  );
}
