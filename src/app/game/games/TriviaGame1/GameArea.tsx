import Image from "next/image";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import { Text } from "@/components/ui/text";
import { SITE_CONFIG } from "@/lib/constants";
import { AnswerButton } from "./AnswerButton";
import type { GameState } from "./types";

type GameAreaProps = {
  gameState: GameState;
  progress: number;
  onAnswerSelect: (index: number) => void;
  onNextRound: () => void;
};

export function GameArea({
  gameState,
  progress,
  onAnswerSelect,
  onNextRound,
}: GameAreaProps) {
  return (
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
              <AnswerButton
                key={index}
                option={option}
                index={index}
                gameState={gameState}
                onSelect={onAnswerSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* Next Round Button */}
      {gameState.showResults &&
        gameState.round < gameState.totalRounds && (
          <div className="flex justify-end">
            <EntaratBtn
              variant="primary"
              size="lg"
              onClick={onNextRound}
            >
              Next Round →
            </EntaratBtn>
          </div>
        )}
    </div>
  );
}

