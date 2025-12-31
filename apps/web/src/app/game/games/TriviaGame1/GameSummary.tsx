"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { EntaratBtn } from "../../../../components/ui/entarat-btn";
import { Text } from "../../../../components/ui/text";
import type { GameSummary as GameSummaryType } from "./types";

type GameSummaryProps = {
  summary: GameSummaryType;
};

export function GameSummary({ summary }: GameSummaryProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <Text variant="h1" textColor="white" className="mb-2">
            Game Summary
          </Text>
          <Text variant="body" textColor="white" className="opacity-80">
            Complete breakdown of all questions and player performance
          </Text>
        </div>

        {/* Player Statistics */}
        <div className="rounded-lg bg-gray-900/80 p-6">
          <Text variant="h3" textColor="white" className="mb-6">
            Player Statistics
          </Text>
          <div className="space-y-4">
            {summary.playerStats.map((stat, index) => {
              const isWinner =
                index === 0 &&
                summary.playerStats.length > 0 &&
                stat.totalScore ===
                  Math.max(...summary.playerStats.map((s) => s.totalScore));

              return (
                <div
                  key={stat.playerId}
                  className={`rounded-lg border-2 p-4 ${
                    isWinner
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-gray-700 bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {isWinner && (
                        <Text variant="h4" textColor="yellow" className="mr-2">
                          🏆
                        </Text>
                      )}
                      <div className="relative h-12 w-12 shrink-0">
                        {stat.player?.avatar ? (
                          <Image
                            src={stat.player.avatar}
                            alt={stat.player.name || "Player"}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-700">
                            <Text variant="small" textColor="white">
                              ?
                            </Text>
                          </div>
                        )}
                      </div>
                      <div>
                        <Text
                          variant="body"
                          textColor={isWinner ? "yellow" : "white"}
                          weight={isWinner ? "bold" : "normal"}
                        >
                          {stat.player?.name || "Unknown Player"}
                        </Text>
                        <Text
                          variant="small"
                          textColor="white"
                          className="opacity-60"
                        >
                          Score: {stat.totalScore} | Passed:{" "}
                          {stat.questionsPassed} | Failed:{" "}
                          {stat.questionsFailed}
                        </Text>
                      </div>
                    </div>
                    <div className="text-right">
                      <Text
                        variant="h3"
                        textColor={isWinner ? "yellow" : "white"}
                        weight="bold"
                      >
                        {stat.totalScore}
                      </Text>
                      <Text
                        variant="small"
                        textColor="white"
                        className="opacity-60"
                      >
                        points
                      </Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Questions Breakdown */}
        <div className="rounded-lg bg-gray-900/80 p-6">
          <Text variant="h3" textColor="white" className="mb-6">
            Questions Breakdown
          </Text>
          <div className="space-y-6">
            {summary.questions.map((q, questionIndex) => {
              const roundStat = summary.playerStats[0]; // Get first player's answers for reference
              const playerAnswer = roundStat?.answers.find(
                (a) => a.round === q.round,
              );

              return (
                <div
                  key={q.round}
                  className="rounded-lg border border-gray-700 bg-gray-800/50 p-4"
                >
                  <div className="mb-4">
                    <Text variant="h4" textColor="white" className="mb-2">
                      Round {q.round}: {q.question.question}
                    </Text>
                    <Text
                      variant="small"
                      textColor="white"
                      className="opacity-60"
                    >
                      Category: {q.question.category}
                    </Text>
                  </div>

                  {q.question.image && (
                    <div className="mb-4 flex justify-center">
                      <div className="relative h-48 w-full max-w-md overflow-hidden rounded-lg bg-gray-700">
                        <Image
                          src={q.question.image}
                          alt={q.question.question}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <Text
                      variant="body"
                      textColor="white"
                      className="mb-2 font-semibold"
                    >
                      Options:
                    </Text>
                    <div className="grid grid-cols-2 gap-2">
                      {q.question.options.map((option, optIndex) => {
                        const isCorrect = optIndex === q.correctAnswer;
                        return (
                          <div
                            key={optIndex}
                            className={`rounded-md border-2 p-2 ${
                              isCorrect
                                ? "border-green-500 bg-green-500/20"
                                : "border-gray-600 bg-gray-700/50"
                            }`}
                          >
                            <Text
                              variant="small"
                              textColor={isCorrect ? "green" : "white"}
                              weight={isCorrect ? "bold" : "normal"}
                            >
                              {isCorrect && "✓ "}
                              {option}
                            </Text>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Player Answers */}
                  <div>
                    <Text
                      variant="body"
                      textColor="white"
                      className="mb-2 font-semibold"
                    >
                      Player Answers:
                    </Text>
                    <div className="space-y-2">
                      {summary.playerStats.map((stat) => {
                        const answer = stat.answers.find(
                          (a) => a.round === q.round,
                        );
                        const selectedOption =
                          answer && answer.answer >= 0
                            ? q.question.options[answer.answer]
                            : "No answer";
                        const isCorrect = answer?.isCorrect ?? false;

                        return (
                          <div
                            key={stat.playerId}
                            className="flex items-center justify-between rounded-md border border-gray-600 bg-gray-700/30 p-2"
                          >
                            <div className="flex items-center gap-2">
                              {stat.player?.avatar && (
                                <div className="relative h-6 w-6 shrink-0">
                                  <Image
                                    src={stat.player.avatar}
                                    alt={stat.player.name || "Player"}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                  />
                                </div>
                              )}
                              <Text variant="small" textColor="white">
                                {stat.player?.name || "Unknown"}:{" "}
                                {selectedOption}
                              </Text>
                            </div>
                            <Text
                              variant="small"
                              textColor={isCorrect ? "green" : "red"}
                              weight="bold"
                            >
                              {isCorrect ? "✓ Correct" : "✗ Wrong"}
                            </Text>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <EntaratBtn
            variant="primary"
            size="lg"
            onClick={() => router.push("/game-review")}
          >
            Play Again
          </EntaratBtn>
          <EntaratBtn
            variant="secondary"
            size="lg"
            onClick={() => router.push("/")}
          >
            Go Home
          </EntaratBtn>
        </div>
      </div>
    </div>
  );
}
