"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { EntaratBtn } from "../../components/ui/entarat-btn";
import { Input } from "../../components/ui/input";
import { Text } from "../../components/ui/text";
import { useUser } from "../../components/user-provider";
import { generateGameCode } from "../../lib/utils";
import { WSMsgType } from "../../types/game";
import HeroHeader from "../components/HeroHeader";
import PlayFullBgSection from "../components/PlayFullBgSection";
import { MOCK_PLAYERS } from "./constant";



export default function LobbyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId") || "trivia-1";
  const [gameCode, setGameCode] = useState<string>("");
  const [shareLink, setShareLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { displayName } = useUser();

  // Generate game code and share link on mount
  useEffect(() => {
    setMounted(true);
    // Generate a unique code based on timestamp
    const code = generateGameCode(6);
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
    // TEMPORARILY: Connect directly to backend (bypassing proxy)
    // TODO: Re-enable proxy after testing
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/ws";

    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: WSMsgType.START_GAME,
          gameId: gameId,
        }),
      );
      ws.close();
      // Navigate to game page after starting
      router.push(`/game?gameId=${gameId}`);
    };

    ws.onerror = () => {
      // If WebSocket fails, still navigate (game will try to connect)
      router.push(`/game?gameId=${gameId}`);
    };
  };

  // QR code data - only use shareLink after mount to avoid hydration mismatch
  const qrCodeValue = mounted && shareLink ? shareLink : "";

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
                    {mounted && qrCodeValue ? (
                      <QRCodeSVG
                        value={qrCodeValue}
                        size={300}
                        level="M"
                        marginSize={2}
                        fgColor="#1a1a1a"
                      />
                    ) : (
                      <div className="h-[300px] w-[300px] flex items-center justify-center">
                        <Text
                          variant="small"
                          textColor="muted"
                          className="opacity-50"
                        >
                          Loading QR code...
                        </Text>
                      </div>
                    )}
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
                    className="font-mono tracking-wider "
                    align="center"
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
