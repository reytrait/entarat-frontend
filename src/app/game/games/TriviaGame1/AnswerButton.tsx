import { Text } from "@/components/ui/text";
import type { GameState } from "./types";

type AnswerButtonProps = {
  option: string;
  index: number;
  gameState: GameState;
  onSelect: (index: number) => void;
};

export function AnswerButton({
  option,
  index,
  gameState,
  onSelect,
}: AnswerButtonProps) {
  const getAnswerColor = (idx: number) => {
    if (!gameState.showResults) {
      return gameState.selectedAnswer === idx
        ? "border-yellow-400 bg-yellow-400/20"
        : "border-blue-500 bg-blue-500/20";
    }

    if (idx === gameState.correctAnswer) {
      return "border-green-500 bg-green-500/20 text-green-400";
    }

    if (gameState.selectedAnswer === idx && idx !== gameState.correctAnswer) {
      return "border-red-500 bg-red-500/20 text-red-400";
    }

    return "border-blue-500 bg-blue-500/20";
  };

  const isDisabled =
    gameState.showResults ||
    gameState.selectedAnswer !== null ||
    gameState.timeExpired;

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      disabled={isDisabled}
      className={`rounded-lg border-2 p-4 text-left transition-all ${
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:scale-105"
      } ${getAnswerColor(index)}`}
    >
      <Text variant="body" textColor="white">
        {option}
      </Text>
    </button>
  );
}
