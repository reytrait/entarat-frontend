import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Ellipse } from "@/components/ui/ellipse";
import { EntaratBtn } from "@/components/ui/entarat-btn";
import { HERO, NAVIGATION, SITE_CONFIG } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden overflow-x-hidden bg-[#03010B] dark:bg-transparent">
      {/* Dark mode: Gradient background with lines pattern */}
      <div className="absolute inset-0 hidden dark:block">
        {/* Lines pattern overlay for dark mode */}
        {/* <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: "url('/lines_bg.svg')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        /> */}
      </div>

      {/* Light mode: White background with lines pattern */}
      {/* <div
        className="absolute inset-0 block bg-white dark:hidden"
        style={{
          backgroundImage: "url('/lines_bg.svg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          opacity: 0.1,
        }}
      /> */}

      {/* Ellipse Decorations */}
      {/* <Ellipse type="1" size="lg" position={{ top: "-5%", left: "-5%" }} /> */}
      {/* <Ellipse type="2" size="110vw" position={{ y: "0%", x: "0%" }} center />
      <Ellipse
        type="1"
        size="120%w"
        position={{ y: "100%", x: "100%" }}
        center
      />
      <Ellipse type="3" size="70vw" position={{ y: "50%", x: "50%" }} center /> */}

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
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

        {/* Hero Section */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center md:px-12">
          {/* Main Title */}
          <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 dark:text-white md:text-6xl lg:text-7xl">
            {HERO.title}
          </h1>

          {/* Description */}
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-900 dark:text-white md:text-xl">
            {HERO.description}
          </p>

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
      </div>
    </section>
  );
}
