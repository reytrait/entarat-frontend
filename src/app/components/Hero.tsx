import { Button } from "@/components/ui/button";
import { HERO, NAVIGATION, SITE_CONFIG } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-transparent">
      {/* Dark mode: Gradient background with grid pattern */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "linear-gradient(to bottom right, rgb(251 191 36), rgb(249 115 22), rgb(147 51 234), rgb(0 0 0))",
        }}
      >
        {/* Grid pattern overlay for dark mode */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Light mode: White background with light grid pattern */}
      <div
        className="absolute inset-0 block bg-white dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{SITE_CONFIG.logo.emoji}</span>
            <span className="text-xl font-semibold text-gray-900 dark:text-white md:text-2xl">
              {SITE_CONFIG.logo.text}
            </span>
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

          {/* Create Game Button */}
          <Button
            className="bg-amber-400 text-gray-900 shadow-[0_0_20px_rgba(255,68,0,0.3)] transition-shadow hover:bg-amber-500 hover:shadow-[0_0_25px_rgba(255,68,0,0.5)] dark:bg-amber-400 dark:text-black dark:shadow-[0_0_20px_rgba(255,68,0,0.5)] dark:hover:bg-amber-500"
            size="default"
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
          </Button>
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
            <Button
              className="bg-amber-400 text-gray-900 shadow-[0_0_20px_rgba(255,68,0,0.3)] transition-shadow hover:bg-amber-500 hover:shadow-[0_0_25px_rgba(255,68,0,0.5)] dark:bg-amber-400 dark:text-black dark:shadow-[0_0_20px_rgba(255,68,0,0.5)] dark:hover:bg-amber-500"
              size="lg"
            >
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
            </Button>

            <Button
              variant="outline"
              className="border-2 border-gray-900 bg-transparent text-gray-900 transition-colors hover:bg-gray-100 dark:border-white dark:text-white dark:hover:bg-white/10"
              size="lg"
            >
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
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
