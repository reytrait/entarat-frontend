import Image from "next/image";
import { useRouter } from "next/navigation";
import { Text } from "@/components/ui/text";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import { SITE_CONFIG } from "@/lib/constants";
import type { GameState } from "./types";

type GameFinishedProps = {
  gameState: GameState;
};

export function GameFinished({ gameState }: GameFinishedProps) {
  const router = useRouter();
  
  // Sort scores in descending order
  const sortedScores = [...(gameState.finalScores || [])].sort(
    (a, b) => b.score - a.score,
  );

  const handleStartNewGame = () => {
    router.push("/game-review");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <Image
              src={SITE_CONFIG.logo.noText_white}
              alt={SITE_CONFIG.logo.alt}
              width={60}
              height={60}
              className="h-15 w-15"
            />
            <Text variant="h1" textColor="white">
              Game Finished!
            </Text>
          </div>
          <Text variant="body" textColor="white" className="opacity-80">
            All {gameState.totalRounds} rounds completed
          </Text>
        </div>

        {/* Final Scores */}
        <div className="mb-8 rounded-lg bg-gray-900/80 p-6">
          <Text variant="h3" textColor="white" className="mb-6 text-center">
            Final Scores
          </Text>
          <div className="space-y-4">
            {sortedScores.map((scoreEntry, index) => {
              const player = scoreEntry.player;
              const isWinner = index === 0 && sortedScores.length > 0;
              
              return (
                <div
                  key={player?.id || `player-${index}`}
                  className={`flex items-center justify-between rounded-lg border-2 p-4 ${
                    isWinner
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-gray-700 bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {isWinner && (
                      <Text variant="h4" textColor="yellow" className="mr-2">
                        🏆
                      </Text>
                    )}
                    <div className="relative h-12 w-12 shrink-0">
                      {player?.avatar ? (
                        <Image
                          src={player.avatar}
                          alt={player.name || "Player"}
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
                        {player?.name || "Unknown Player"}
                      </Text>
                      {player?.id && (
                        <Text variant="small" textColor="white" className="opacity-60">
                          ID: {player.id.substring(0, 8)}...
                        </Text>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Text
                      variant="h3"
                      textColor={isWinner ? "yellow" : "white"}
                      weight="bold"
                    >
                      {scoreEntry.score}
                    </Text>
                    <Text variant="small" textColor="white" className="opacity-60">
                      points
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Game Complete Message */}
        <div className="mb-8 text-center">
          <Text variant="body" textColor="white" className="opacity-70">
            Thanks for playing! The game has ended.
          </Text>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <EntaratBtn
            variant="primary"
            size="lg"
            onClick={handleStartNewGame}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Game controller icon"
            >
              <title>Game controller</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Start New Game
          </EntaratBtn>
          <EntaratBtn
            variant="secondary"
            size="lg"
            onClick={handleGoHome}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Home icon"
            >
              <title>Home</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </EntaratBtn>
        </div>
      </div>
    </div>
  );
}

