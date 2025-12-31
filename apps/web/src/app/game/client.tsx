"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GameComingSoon from "./components/GameComingSoon";
import { GameStartLoader } from "./components/GameStartLoader";
import { TriviaGame } from "./games/TriviaGame1";

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
  const startedRef = useRef(false);

  const GameComponent = useMemo(() => {
    const game = gamesAvailable.find((g) => g.id === gameId);
    return game?.component || null;
  }, [gameId]);

  // Memoize the callback to prevent it from changing on re-renders
  const handleGameStartComplete = useCallback(() => {
    if (startedRef.current) {
      console.log("Game already started, ignoring duplicate call");
      return;
    }
    startedRef.current = true;
    setGameStarted(true);
  }, []);

  useEffect(() => {
    console.log("GamePage mounted");
  }, []);

  return (
    <>
      {/* Show loader first, then transition to game */}
      {!gameStarted && <GameStartLoader onComplete={handleGameStartComplete} />}

      {/* Main game content - only show after loader completes */}
      {gameStarted &&
        (GameComponent ? (
          <GameComponent key={gameId} gameId={gameId} />
        ) : (
          <GameComingSoon gameId={gameId} />
        ))}
    </>
  );
}
