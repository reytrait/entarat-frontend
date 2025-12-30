"use client";
import Image from "next/image";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import { HERO, NAVIGATION, SITE_CONFIG } from "@/lib/constants";

const HeroHeader = () => {
  const { theme } = useTheme();

  const { dark, light } = SITE_CONFIG.logo;
  return (
    //   {/* Header */}
    <header className="flex items-center justify-between py-6 md:py-8">
      {/* Logo */}
      <div className="flex items-center gap-2">
        {/* Light mode logo (black) */}
        <Image
          src={theme === "dark" ? dark : light}
          alt={SITE_CONFIG.logo.alt}
          width={200}
          height={24}
          className="h-6 w-auto md:h-8"
          priority
        />
      </div>

      {/* Navigation - hidden on mobile, visible on desktop */}
      <nav className="hidden items-center gap-8 text-base font-medium text-main-text md:flex">
        {NAVIGATION.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="transition-opacity hover:opacity-80"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {/* Create Game Button */}
        <EntaratBtn variant="primary" size="default">
          <svg
            className="h-4 w-4"
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
      </div>
    </header>
  );
};

export default HeroHeader;
