import Image from "next/image";
import { Text } from "../../../../components/ui/text";
import type { GameState } from "./types";

type PlayersPanelProps = {
  gameState: GameState;
  autoPlay: boolean;
  onAutoPlayToggle: () => void;
};

export function PlayersPanel({
  gameState,
  autoPlay,
  onAutoPlayToggle,
}: PlayersPanelProps) {
  return (
    <div className="rounded-lg bg-purple-900/50 p-4">
      <Text variant="h4" textColor="white" className="mb-4">
        Players
        {gameState.totalPlayers !== undefined && gameState.totalPlayers > 0 && (
          <span className="ml-2 text-sm opacity-70">
            ({gameState.totalPlayers})
          </span>
        )}
      </Text>

      <div className="space-y-2">
        {gameState.players.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 rounded-md bg-gray-800/50 p-2"
          >
            <div className="relative h-8 w-8 shrink-0">
              <Image
                src={player.avatar}
                alt={player.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <Text variant="small" textColor="white">
                {player.name}
              </Text>
              <div className="h-1 w-full overflow-hidden rounded-full bg-gray-700">
                <div className="h-full w-full bg-green-500" />
              </div>
            </div>
            <div className="h-6 w-6 rounded-full bg-yellow-500" />
          </div>
        ))}
        {gameState.totalPlayers !== undefined &&
          gameState.totalPlayers > gameState.players.length && (
            <div className="rounded-md bg-gray-800/30 p-2 text-center">
              <Text variant="small" textColor="white" className="opacity-70">
                +{gameState.totalPlayers - gameState.players.length} more
                {gameState.totalPlayers - gameState.players.length === 1
                  ? " player"
                  : " players"}
              </Text>
            </div>
          )}
      </div>

      {/* Controls */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <Text variant="small" textColor="white">
            Mic
          </Text>
        </div>
        <div className="flex items-center justify-between">
          <Text variant="small" textColor="white">
            Auto Play
          </Text>
          <button
            type="button"
            onClick={onAutoPlayToggle}
            className={`h-6 w-12 rounded-full transition-colors ${
              autoPlay ? "bg-orange-500" : "bg-gray-600"
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white transition-transform ${
                autoPlay ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Next Round Info */}
      {gameState.round < gameState.totalRounds && (
        <div className="mt-6">
          <Text variant="small" textColor="white" className="opacity-70">
            Round {gameState.round + 1} of {gameState.totalRounds}
          </Text>
        </div>
      )}
    </div>
  );
}
