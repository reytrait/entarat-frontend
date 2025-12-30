"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import HeroHeader from "@/app/components/HeroHeader";
import { useGameSetup } from "@/components/game-setup-provider";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import { Text } from "@/components/ui/text";
import { GAMES } from "@/lib/constants/game_reviews";

export default function GameSetupPage() {
  const searchParams = useSearchParams();
  const urlGameId = searchParams.get("gameId");

  const {
    gameId,
    setGameId,
    displayName,
    setDisplayName,
    hostingSetting,
    setHostingSetting,
    access,
    setAccess,
    numPlayers,
    setNumPlayers,
    rounds,
    setRounds,
    playTime,
    setPlayTime,
    gameMood,
    setGameMood,
    stickers,
    setStickers,
  } = useGameSetup();

  // Update gameId from URL when it changes
  useEffect(() => {
    if (urlGameId) {
      setGameId(urlGameId);
    }
  }, [urlGameId, setGameId]);

  // Find the game from the gameId
  const game = GAMES.flatMap((cat) => cat.games).find((g) => g.id === gameId);

  const handleCreateGame = () => {
    // TODO: Implement game creation logic
    console.log("Creating game with:", {
      gameId,
      displayName,
      hostingSetting,
      access,
      numPlayers,
      rounds,
      playTime,
      gameMood,
      stickers,
    });
    // Navigate to game room or show success
  };

  return (
    <div className="min-h-screen bg-[#03010B]">
      <div className="container mx-auto max-md:px-4 px-6 md:px-12">
        {/* Header */}
        <HeroHeader />

        {/* Main Content */}
        <div className="py-8 flex justify-center">
          <div
            className="p-0.5 rounded-2xl"
            style={{
              background: "linear-gradient(90deg, #E200B5 0%, #FFA900 100%)",
            }}
          >
            <div
              className="w-full max-w-2xl rounded-2xl bg-[#1a1a1a] p-6 md:p-8 flex flex-col gap-6"
              style={{
                background:
                  "linear-gradient(to bottom right, #1B1B1B 15%, #411616 100%)",
              }}
            >
              {game && (
                <Text variant="body" textColor="white" className="opacity-70">
                  Setting up: {game.title}
                </Text>
              )}

              {/* Game Setup Section */}
              <div>
                <Text variant="h4" textColor="white" align="center">
                  Game Setup
                </Text>

                {/* Display Name */}
                <div className="mb-6">
                  <label htmlFor="display-name" className="mb-2 block">
                    <Text variant="body" textColor="white" className="mb-2">
                      Display name
                    </Text>
                  </label>
                  <input
                    id="display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name here"
                    className="w-full rounded-lg bg-gray-700 px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Hosting Setting */}
                <div className="mb-6">
                  <div className="mb-2 block">
                    <Text variant="body" textColor="white" className="mb-2">
                      Hosting Setting
                    </Text>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setHostingSetting("moderator")}
                      className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        hostingSetting === "moderator"
                          ? "bg-orange-300 text-gray-900"
                          : "bg-orange-600 text-white"
                      }`}
                    >
                      Moderator Mood
                    </button>
                    <button
                      type="button"
                      onClick={() => setHostingSetting("host")}
                      className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        hostingSetting === "host"
                          ? "bg-orange-300 text-gray-900"
                          : "bg-orange-600 text-white"
                      }`}
                    >
                      Host and Play
                    </button>
                  </div>
                </div>

                {/* Access */}
                <div className="mb-6">
                  <div className="mb-2 block">
                    <Text variant="body" textColor="white" className="mb-2">
                      Access
                    </Text>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAccess("private")}
                      className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        access === "private"
                          ? "bg-orange-300 text-gray-900"
                          : "bg-orange-600 text-white"
                      }`}
                    >
                      Private (Passworded)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccess("public")}
                      className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        access === "public"
                          ? "bg-orange-300 text-gray-900"
                          : "bg-orange-600 text-white"
                      }`}
                    >
                      Public Game
                    </button>
                  </div>
                </div>
              </div>

              {/* Room Setup Section */}
              <div>
                <Text variant="h4" textColor="white" align="center">
                  Room Setup
                </Text>

                {/* Number of Players */}
                <div className="mb-6">
                  <label htmlFor="num-players" className="mb-2 block">
                    <Text variant="body" textColor="white" className="mb-2">
                      Number of players
                    </Text>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setNumPlayers(Math.max(1, numPlayers - 1))}
                      className="h-10 w-10 rounded-lg bg-orange-600 text-white transition-colors hover:bg-orange-500"
                      aria-label="Decrease number of players"
                    >
                      -
                    </button>
                    <input
                      id="num-players"
                      type="number"
                      value={numPlayers}
                      onChange={(e) =>
                        setNumPlayers(
                          Math.max(1, parseInt(e.target.value) || 1),
                        )
                      }
                      className="flex-1 rounded-lg bg-gray-700 px-4 py-3 text-center text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setNumPlayers(numPlayers + 1)}
                      className="h-10 w-10 rounded-lg bg-orange-600 text-white transition-colors hover:bg-orange-500"
                      aria-label="Increase number of players"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Rounds */}
                <div className="mb-6">
                  <label htmlFor="rounds" className="mb-2 block">
                    <Text variant="body" textColor="white" className="mb-2">
                      Rounds
                    </Text>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRounds(Math.max(1, rounds - 1))}
                      className="h-10 w-10 rounded-lg bg-orange-600 text-white transition-colors hover:bg-orange-500"
                      aria-label="Decrease rounds"
                    >
                      -
                    </button>
                    <input
                      id="rounds"
                      type="number"
                      value={rounds}
                      onChange={(e) =>
                        setRounds(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="flex-1 rounded-lg bg-gray-700 px-4 py-3 text-center text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setRounds(rounds + 1)}
                      className="h-10 w-10 rounded-lg bg-orange-600 text-white transition-colors hover:bg-orange-500"
                      aria-label="Increase rounds"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Play Time */}
                <div className="mb-6">
                  <label htmlFor="play-time" className="mb-2 block">
                    <Text variant="body" textColor="white" className="mb-2">
                      Play Time
                    </Text>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="play-time"
                      type="number"
                      value={playTime}
                      onChange={(e) =>
                        setPlayTime(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="flex-1 rounded-lg bg-gray-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      className="rounded-lg bg-gray-700 px-6 py-3 text-white transition-colors hover:bg-gray-600"
                    >
                      Mins
                    </button>
                  </div>
                </div>

                {/* Game mood */}
                <div className="mb-6">
                  <div className="mb-2 block">
                    <Text variant="body" textColor="white" className="mb-2">
                      Game mood
                    </Text>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGameMood("solo")}
                      className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        gameMood === "solo"
                          ? "bg-orange-300 text-gray-900"
                          : "bg-orange-600 text-white"
                      }`}
                    >
                      Solo
                    </button>
                    <button
                      type="button"
                      onClick={() => setGameMood("team")}
                      className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        gameMood === "team"
                          ? "bg-orange-300 text-gray-900"
                          : "bg-orange-600 text-white"
                      }`}
                    >
                      Team
                    </button>
                  </div>
                </div>

                {/* Stickers/reactions */}
                <div className="mb-6">
                  <div className="mb-2 block">
                    <Text variant="body" textColor="white" className="mb-2">
                      Stickers/reactions
                    </Text>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStickers("off")}
                      className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        stickers === "off"
                          ? "bg-orange-300 text-gray-900"
                          : "bg-orange-600 text-white"
                      }`}
                    >
                      Off
                    </button>
                    <button
                      type="button"
                      onClick={() => setStickers("on")}
                      className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        stickers === "on"
                          ? "bg-orange-300 text-gray-900"
                          : "bg-orange-600 text-white"
                      }`}
                    >
                      On
                    </button>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="mb-6">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-orange-400 transition-colors hover:text-orange-300"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-label="Settings icon"
                    >
                      <title>Settings</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <Text
                      variant="small"
                      textColor="white"
                      className="opacity-80"
                    >
                      Advanced Settings
                    </Text>
                  </button>
                </div>
              </div>

              {/* Create Game Button */}
              <div className="mt-8">
                <EntaratBtn
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleCreateGame}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-label="Add icon"
                  >
                    <title>Add</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Game
                </EntaratBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
