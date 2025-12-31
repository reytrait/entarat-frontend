"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { EntaratBtn } from "../../components/ui/entarat-btn";
import { Input } from "../../components/ui/input";
import { Text } from "../../components/ui/text";
import { useUser } from "../../components/user-provider";
import HeroHeader from "../components/HeroHeader";
import PlayFullBgSection from "../components/PlayFullBgSection";
import { AVATARS } from "./constant";



export default function JoinGamePage() {
  const searchParams = useSearchParams();
  const invitedBy = searchParams.get("invitedBy") || "Host";
  const gameId = searchParams.get("gameId");
  const code = searchParams.get("code");

  const { displayName, setDisplayName, selectedAvatar, setSelectedAvatar } =
    useUser();

  const handleJoinGame = () => {
    // TODO: Implement join game logic
    console.log("Joining game with:", {
      displayName,
      selectedAvatar,
      gameId,
      code,
      invitedBy,
    });
  };
  return (
    <PlayFullBgSection>
      <div className="relative z-5 min-h-screen">
        <div className="container mx-auto max-md:px-4 px-6 md:px-12">
          <HeroHeader />
        </div>

        <div className="relative z-5 flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12">
          <div
            className="w-full max-w-2xl rounded-2xl p-[2px]"
            style={{
              background: "linear-gradient(135deg, #E200B5 0%, #FFA900 100%)",
              boxShadow:
                "0 0 20px rgba(226, 0, 181, 0.5), 0 0 40px rgba(255, 169, 0, 0.3)",
            }}
          >
            <div className="rounded-2xl bg-[#1a1a1a] p-6 md:p-8">
              {/* Title */}
              <Text
                variant="h4"
                textColor="white"
                align="center"
                className="mb-8"
              >
                You have been invited to a Trivia game by {invitedBy}
              </Text>

              {/* Display Name Input */}
              <div className="mb-8">
                <Text
                  variant="body"
                  textColor="white"
                  className="mb-3 font-medium"
                >
                  Display name
                </Text>
                <Input
                  type="text"
                  placeholder="Type a name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="border-yellow-400 bg-white text-gray-900 placeholder:text-gray-500 focus-visible:ring-yellow-400"
                />
              </div>

              {/* Avatar Selection */}
              <div className="mb-8">
                <Text
                  variant="body"
                  textColor="white"
                  className="mb-4 font-medium"
                >
                  Choose an avatar
                </Text>
                <div
                  className="rounded-lg p-[2px]"
                  style={{
                    background:
                      "linear-gradient(135deg, #E200B5 0%, #FFA900 100%)",
                    boxShadow: "0 0 15px rgba(226, 0, 181, 0.4)",
                  }}
                >
                  <div className="grid grid-cols-6 gap-2 rounded-lg bg-[#1a1a1a] p-4">
                    {AVATARS.map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`cursor-pointer relative aspect-square rounded-md border-2 transition-all hover:scale-110 ${
                          selectedAvatar === avatar
                            ? "border-yellow-400 ring-2 ring-yellow-400 ring-offset-2 ring-offset-[#1a1a1a]"
                            : "border-transparent hover:border-yellow-400/50"
                        }`}
                        aria-label={`Select avatar ${avatar}`}
                      >
                        <Image
                          src={avatar}
                          alt={`Avatar ${avatar}`}
                          fill
                          className="object-contain p-1"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Join Game Button */}
              <div className="flex justify-center">
                <EntaratBtn
                  variant="primary"
                  size="lg"
                  onClick={handleJoinGame}
                  disabled={Boolean(!displayName.trim() || !selectedAvatar)}
                  className="w-full md:w-auto"
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
                  Join Game
                </EntaratBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlayFullBgSection>
  );
}
