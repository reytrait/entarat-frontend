"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import HeroHeader from "@/app/components/HeroHeader";
import PlayFullBgSection from "@/app/components/PlayFullBgSection";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useUser } from "@/components/user-provider";

// Mock players data - in real app, this would come from a backend/context
const MOCK_PLAYERS = [
  { id: "1", name: "Reynolds", avatar: "/avatars/avatar-blue-square.svg" },
  { id: "2", name: "Allen", avatar: "/avatars/avatar-purple-square.svg" },
  { id: "3", name: "Jenny", avatar: "/avatars/avatar-red-square.svg" },
  { id: "4", name: "Melitius", avatar: "/avatars/avatar-orange-square.svg" },
  { id: "5", name: "Ugochukwu", avatar: "/avatars/avatar-green-square.svg" },
];

export default function LobbyPage() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId") || "trivia-1";
  const [gameCode, setGameCode] = useState<string>("");
  const [shareLink, setShareLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { displayName } = useUser();

  // Generate game code and share link on mount
  useEffect(() => {
    // Generate a random 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGameCode(code);

    // Generate share link
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/join-game?gameId=${gameId}&invitedBy=${displayName || "Host"}&code=${code}`;
      setShareLink(link);
    }
  }, [gameId, displayName]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleStartGame = () => {
    // TODO: Implement start game logic
    console.log("Starting game:", { gameId, gameCode });
  };

  // QR code data - link to join-game page
  const qrCodeValue =
    shareLink ||
    `${typeof window !== "undefined" ? window.location.origin : ""}/join-game?gameId=${gameId}`;

  return (
    <PlayFullBgSection>
      <div className="min-h-screen">
        <div className="container mx-auto max-md:px-4 px-6 md:px-12">
          <HeroHeader />
        </div>

        <div className="relative z-10 flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12">
          <div
            className="w-full max-w-4xl rounded-2xl p-[2px]"
            style={{
              background: "linear-gradient(135deg, #E200B5 0%, #FFA900 100%)",
              boxShadow:
                "0 0 20px rgba(226, 0, 181, 0.5), 0 0 40px rgba(255, 169, 0, 0.3)",
            }}
          >
            <div className="rounded-2xl bg-[#1a1a1a] p-6 md:p-8">
              {/* Title */}
              <Text
                variant="h2"
                textColor="white"
                align="center"
                className="mb-8"
              >
                Trivia Game room
              </Text>

              {/* Top Section: QR Code and Waiting Players */}
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left: QR Code */}
                <div>
                  <Text
                    variant="body"
                    textColor="white"
                    className="mb-4 font-medium"
                  >
                    Scan code to join
                  </Text>
                  <div className="flex justify-center rounded-lg bg-white p-4">
                    <QRCodeSVG
                      value={qrCodeValue}
                      size={300}
                      level="M"
                      marginSize={2}
                      fgColor="#1a1a1a"
                    />
                  </div>
                </div>

                {/* Right: Waiting Players */}
                <div>
                  <Text
                    variant="body"
                    textColor="white"
                    className="mb-4 font-medium"
                  >
                    Waiting For Players to join
                  </Text>
                  <div className="space-y-2">
                    {MOCK_PLAYERS.map((player) => (
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
                        <Text variant="small" textColor="white">
                          {player.name}
                        </Text>
                      </div>
                    ))}
                    <Text
                      variant="small"
                      textColor="white"
                      className="mt-4 opacity-70"
                    >
                      5 More
                    </Text>
                  </div>
                </div>
              </div>

              {/* Send Link Section */}
              <div className="mb-8">
                <Text
                  variant="body"
                  textColor="white"
                  className="mb-3 font-medium"
                >
                  Send Link to Friends
                </Text>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="border-yellow-400 bg-gray-800/50 text-white"
                  />
                  <EntaratBtn
                    variant="primary"
                    size="default"
                    onClick={handleCopyLink}
                    className="whitespace-nowrap"
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </EntaratBtn>
                </div>
              </div>

              {/* Game Code Section */}
              <div className="mb-8">
                <Text
                  variant="body"
                  textColor="white"
                  className="mb-3 font-medium"
                >
                  or use code
                </Text>
                <div
                  className="rounded-lg border-2 border-gray-700 bg-gray-900/50 p-6 text-center"
                  style={{
                    boxShadow: "0 0 10px rgba(255, 169, 0, 0.2)",
                  }}
                >
                  <Text
                    variant="h1"
                    textColor="white"
                    className="font-mono tracking-wider"
                  >
                    {gameCode}
                  </Text>
                </div>
              </div>

              {/* Start Game Button */}
              <div className="flex justify-center">
                <EntaratBtn
                  variant="primary"
                  size="lg"
                  onClick={handleStartGame}
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
                  Start Game
                </EntaratBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlayFullBgSection>
  );
}
