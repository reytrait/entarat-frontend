import Image from "next/image";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import { Text } from "@/components/ui/text";
import { HERO } from "@/lib/constants";
import HeroHeader from "./HeroHeader";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden overflow-x-hidden bg-[#03010B] dark:bg-transparent">
      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <HeroHeader />

        {/* Hero Section */}
        <div className="flex flex-1 gap-5 flex-col items-center justify-center self-center pt-10 md:pt-20">
          <div className="flex flex-1 gap-4 flex-col items-center justify-center text-center ">
            {/* Main Title */}
            <Text variant="h1" textColor="default" className="mb-5 max-w-4xl">
              {HERO.title}
            </Text>

            {/* Description */}
            <Text
              variant="lead"
              textColor="default"
              leading="relaxed"
              align="center"
              className="mb-5 max-w-4xl"
            >
              {HERO.description}
            </Text>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <EntaratBtn variant="primary" size="lg">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label={HERO.gameControllerIcon.ariaLabel}
                >
                  <title>{HERO.gameControllerIcon.title}</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {HERO.buttons.createGame}
              </EntaratBtn>

              <EntaratBtn variant="outline" size="lg">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label={HERO.gameControllerIcon.ariaLabel}
                >
                  <title>{HERO.gameControllerIcon.title}</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {HERO.buttons.joinWithCode}
              </EntaratBtn>
            </div>
          </div>
          {/* Game Cards Section - Bottom of Hero */}
          <div className="bottom-0 left-0 right-0 flex items-end justify-center">
            <Image
              src="/hero_bottom_card.png"
              alt="Game cards preview"
              width={1200}
              height={400}
              className="w-full max-w-7xl object-contain"
              unoptimized
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
