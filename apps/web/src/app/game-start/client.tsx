"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Text } from "../../components/ui/text";
import { SITE_CONFIG } from "../../lib/constants";
import PlayFullBgSection from "../components/PlayFullBgSection";

const TOTAL_DOTS = 8;
const ANIMATION_DURATION = 2000; // 2 seconds
const FADE_OUT_DURATION = 500; // 0.5 seconds

// Stable array of dot IDs to avoid using index as key
const DOT_IDS = Array.from({ length: TOTAL_DOTS }, (_, i) => `dot-${i}`);

export default function GameStartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId") || "trivia-1";

  const [filledDots, setFilledDots] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Animate dots filling over 2 seconds
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const dots = Math.floor(progress * TOTAL_DOTS);
      setFilledDots(dots);

      if (progress >= 1) {
        clearInterval(interval);
        // Start fade out
        setIsFading(true);
        // Navigate to main game after fade out
        setTimeout(() => {
          router.push(`/game?gameId=${gameId}`);
        }, FADE_OUT_DURATION);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [gameId, router]);

  return (
    <PlayFullBgSection>
      <div className="relative z-5 flex min-h-screen flex-col items-center justify-center">
        <div
          className={`flex flex-col items-center gap-6 transition-opacity duration-500 ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Entarat logo */}
          <div className="relative h-24 w-24 md:h-32 md:w-32">
            <div className="absolute inset-0 rounded-lg flex items-center justify-center">
              <Image
                src={SITE_CONFIG.logo.noText_white}
                alt={SITE_CONFIG.logo.alt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Loading dots */}
          <div className="flex gap-2">
            {DOT_IDS.map((dotId, index) => {
              const isFilled = index < filledDots;
              const isOrange = index < 5;
              return (
                <div
                  key={dotId}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    isFilled
                      ? isOrange
                        ? "bg-orange-500"
                        : "bg-orange-700"
                      : "bg-gray-600"
                  }`}
                />
              );
            })}
          </div>

          {/* Starting Game text */}
          <Text variant="h3" textColor="white" align="center">
            Starting Game
          </Text>
        </div>
      </div>
    </PlayFullBgSection>
  );
}
