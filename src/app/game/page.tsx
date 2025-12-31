"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { GameStartLoader } from "@/app/game/components/GameStartLoader";
import { TriviaGame } from "@/app/game/games/TriviaGame1";
import GameComingSoon from "./components/GameComingSoon";

type GameComponent = React.ComponentType<{ gameId: string }>;

type AvailableGame = {
  id: string;
  component: GameComponent;
};

const gamesAvailable: AvailableGame[] = [
  {
    id: "trivia-1",
    component: TriviaGame,
  },
];

export default function GamePage() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId") || "trivia-1";
  const [gameStarted, setGameStarted] = useState(false);

  const GameComponent = useMemo(() => {
    const game = gamesAvailable.find((g) => g.id === gameId);
    return game?.component || null;
  }, [gameId]);

  const handleGameStartComplete = () => {
    setGameStarted(true);
  };

  return (
    <>
      {/* Show loader first, then transition to game */}
      {!gameStarted && <GameStartLoader onComplete={handleGameStartComplete} />}

      {/* Main game content - only show after loader completes */}
      {gameStarted &&
        (GameComponent ? (
          <GameComponent gameId={gameId} />
        ) : (
          <GameComingSoon gameId={gameId} />
        ))}
    </>
  );
}
