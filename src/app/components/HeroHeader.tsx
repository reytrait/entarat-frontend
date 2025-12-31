"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import {
  HERO,
  NAVIGATION,
  SITE_CONFIG,
  TEMP_PAGES_CREATED,
} from "@/lib/constants";

const HeroHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  const HIDDEN_HEADER_PAGES = ["/game-setup", "/join-game"];
  const REMOVE_NAVS = ["/game-setup", "/join-game"];
  // Hide Create Game button on game-setup page
  const showCreateGameButton = !HIDDEN_HEADER_PAGES.some((page) =>
    pathname?.startsWith(page),
  );
  const removeNavs = REMOVE_NAVS.some((page) => pathname?.startsWith(page));

  const { dark, light } = SITE_CONFIG.logo;

  const handleCreateGame = () => {
    router.push("/game-setup");
  };
  return (
    //   {/* Header */}
    // <header className="bg-main-bg">
    <header>
      {TEMP_PAGES_CREATED && (
        <div className="fixed top-0 right-0 bg-red-950-200 z-99 flex gap-2">
          {TEMP_PAGES_CREATED.map((page) => (
            <Link
              key={page.path}
              href={page.path}
              className="cursor-pointer bg-amber-200 z-99"
            >
              {page.title}
            </Link>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between py-6 md:py-8 container mx-auto max-md:px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {/* Light mode logo (black) */}

          <Link href="/" className="z-2 cursor-pointer">
            <Image
              src={theme === "dark" ? dark : light}
              alt={SITE_CONFIG.logo.alt}
              width={200}
              height={24}
              className="h-6 w-auto md:h-8"
              priority
            />
          </Link>
        </div>

        {/* Navigation - hidden on mobile, visible on desktop */}
        {!removeNavs ? (
          <nav className="hidden items-center gap-8 text-base font-medium text-main-text md:flex">
            {NAVIGATION.links.map((link) => {
              const isExternalLink = link.href.startsWith("/");
              return isExternalLink ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-opacity hover:opacity-80 z-5"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="transition-opacity hover:opacity-80"
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        ) : null}

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Create Game Button */}
          {showCreateGameButton && (
            <EntaratBtn
              variant="primary"
              size="default"
              onClick={handleCreateGame}
            >
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
          )}
        </div>
      </div>
    </header>
  );
};

export default HeroHeader;
