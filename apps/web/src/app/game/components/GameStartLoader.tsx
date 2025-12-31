"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Text } from "../../../components/ui/text";
import { SITE_CONFIG } from "../../../lib/constants";
import PlayFullBgSection from "../../components/PlayFullBgSection";

const TOTAL_DOTS = 8;
const ANIMATION_DURATION = 2000; // 2 seconds
const FADE_OUT_DURATION = 750; // 0.75 seconds

// Stable array of dot IDs to avoid using index as key
const DOT_IDS = Array.from({ length: TOTAL_DOTS }, (_, i) => `dot-${i}`);

type GameStartLoaderProps = {
  onComplete: () => void;
};

export function GameStartLoader({ onComplete }: GameStartLoaderProps) {
  const [filledDots, setFilledDots] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

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
        // Hide loader and call onComplete after fade out
        setTimeout(() => {
          setShowLoader(false);
          onComplete();
        }, FADE_OUT_DURATION);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!showLoader) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <PlayFullBgSection>
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
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
                return (
                  <div
                    key={dotId}
                    className={`h-6 w-6 rounded-full transition-all duration-300 ${
                      isFilled ? "bg-[#FFA900]" : "bg-[#FFA900]/32"
                    }`}
                  />
                );
              })}
            </div>

            {/* Starting Game text */}
            <Text variant="h3" textColor="white" align="center" weight="bold">
              Starting Game
            </Text>
          </div>
        </div>
      </PlayFullBgSection>
    </div>
  );
}
