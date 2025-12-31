"use client";

import PlayFullBgSection from "@/app/components/PlayFullBgSection";
import { GameArea } from "./GameArea";
import { PlayersPanel } from "./PlayersPanel";
import type { TriviaGameProps } from "./types";
import { useTriviaGame } from "./useTriviaGame";
import { WaitingScreen } from "./WaitingScreen";

export function TriviaGame({ gameId }: TriviaGameProps) {
  const {
    gameState,
    autoPlay,
    setAutoPlay,
    progress,
    handleAnswerSelect,
    handleNextRound,
    handleStartGame,
  } = useTriviaGame(gameId);

  if (!gameState.question && gameState.round === 0) {
    return <WaitingScreen onStartGame={handleStartGame} />;
  }

  return (
    <PlayFullBgSection>
      <div className="min-h-screen bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-purple-900/40 p-4 md:p-8">
        <div className="container mx-auto grid grid-cols-1 gap-6 lg:grid-cols-4">
          <GameArea
            gameState={gameState}
            progress={progress}
            onAnswerSelect={handleAnswerSelect}
            onNextRound={handleNextRound}
          />
          <PlayersPanel
            gameState={gameState}
            autoPlay={autoPlay}
            onAutoPlayToggle={() => setAutoPlay(!autoPlay)}
          />
        </div>
      </div>
    </PlayFullBgSection>
  );
}
