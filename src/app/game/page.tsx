"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { GameStartLoader } from "@/app/game/components/GameStartLoader";
import PlayFullBgSection from "@/app/components/PlayFullBgSection";
import { Text } from "@/components/ui/text";

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
      {gameStarted && (
        <PlayFullBgSection>
          <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
            <div className="text-center">
              <Text
                variant="h1"
                textColor="white"
                align="center"
                className="mb-4"
              >
                Game Started!
              </Text>
              <Text
                variant="body"
                textColor="white"
                align="center"
                className="opacity-80"
              >
                Game ID: {gameId}
              </Text>
              <Text
                variant="body"
                textColor="white"
                align="center"
                className="mt-4 opacity-60"
              >
                Main game interface coming soon...
              </Text>
            </div>
          </div>
        </PlayFullBgSection>
      )}
    </>
  );
}
