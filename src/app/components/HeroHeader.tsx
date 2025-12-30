import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import { HERO, NAVIGATION, SITE_CONFIG } from "@/lib/constants";

const HeroHeader = () => {
  return (
    //   {/* Header */}
    <header className="flex items-center justify-between py-6 md:py-8">
      {/* Logo */}
      <div className="flex items-center gap-2">
        {/* Light mode logo (black) */}
        <Image
          src={SITE_CONFIG.logo.light}
          alt={SITE_CONFIG.logo.alt}
          width={200}
          height={24}
          className="h-6 w-auto dark:hidden md:h-8"
          priority
        />
        {/* Dark mode logo (white) */}
        <Image
          src={SITE_CONFIG.logo.dark}
          alt={SITE_CONFIG.logo.alt}
          width={200}
          height={24}
          className="hidden h-6 w-auto dark:block md:h-8"
          priority
        />
      </div>

      {/* Navigation - hidden on mobile, visible on desktop */}
      <nav className="hidden items-center gap-8 text-sm font-medium text-gray-900 dark:text-white md:flex">
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
