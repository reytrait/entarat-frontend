"use client";

import { useEffect } from "react";
import { Text } from "../../../../components/ui/text";
import PlayFullBgSection from "../../../components/PlayFullBgSection";
import { GameArea } from "./GameArea";
import { GameFinished } from "./GameFinished";
import { GameSummary } from "./GameSummary";
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
    remainingTime,
    connectionError,
    handleAnswerSelect,
    handleNextRound,
    handleStartGame,
  } = useTriviaGame(gameId);

  useEffect(() => {
    console.log("TriviaGame1");
  }, []);

  if (connectionError) {
    return (
      <PlayFullBgSection>
        <div className="relative z-5 flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Text variant="h2" textColor="white" className="mb-4">
              Connection Error
            </Text>
            <Text variant="body" textColor="white" className="opacity-80">
              {connectionError}
            </Text>
          </div>
        </div>
      </PlayFullBgSection>
    );
  }

  if (!gameState.question && gameState.round === 0) {
    return <WaitingScreen onStartGame={handleStartGame} />;
  }

  // Show game finished screen when game is complete
  // Also show if last round expired on resume (waiting for final scores)
  if (
    (gameState.isFinished && gameState.finalScores) ||
    (gameState.round >= gameState.totalRounds &&
      gameState.timeExpired &&
      !gameState.question)
  ) {
    // If we have final scores, show them. Otherwise show loading state
    if (gameState.finalScores && gameState.finalScores.length > 0) {
      // If summary is available, show detailed summary page
      if (gameState.summary) {
        return (
          <PlayFullBgSection>
            <GameSummary summary={gameState.summary} />
          </PlayFullBgSection>
        );
      }
      // Otherwise show simple finished screen
      return (
        <PlayFullBgSection>
          <GameFinished gameState={gameState} />
        </PlayFullBgSection>
      );
    } else {
      // Waiting for final scores from server
      return (
        <PlayFullBgSection>
          <div className="relative z-5 flex min-h-screen items-center justify-center">
            <div className="text-center">
              <Text variant="h2" textColor="white" className="mb-4">
                Game Ended
              </Text>
              <Text variant="body" textColor="white" className="opacity-80">
                Calculating final scores...
              </Text>
            </div>
          </div>
        </PlayFullBgSection>
      );
    }
  }

  return (
    <PlayFullBgSection>
      <div className="relative z-5 min-h-screen bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-purple-900/40 p-4 md:p-8">
        <div className="container mx-auto grid grid-cols-1 gap-6 lg:grid-cols-4">
          <GameArea
            gameState={gameState}
            progress={progress}
            remainingTime={remainingTime}
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
