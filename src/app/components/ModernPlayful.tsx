import { EntaratBtn } from "@/components/ui/entarat-btn";
import { HERO, MODERN_PLAYFUL } from "@/lib/constants";

export function ModernPlayful() {
  return (
    <section
      id="cta"
      className="relative w-full overflow-hidden py-20 md:py-32 z-2"
      style={{
        background:
          "radial-gradient(ellipse at center, rgb(30 2 157), rgb(10 0 57))",
      }}
    >
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/lines_bg.svg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Repeating Pattern Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/patterns/bg_pattern_repeat.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "25% auto",
          opacity: 0.1,
          filter: "brightness(0.2)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto container max-md:px-4 text-center md:px-12">
        {/* Headline */}
        <h2 className="mb-8 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
          {MODERN_PLAYFUL.title}
        </h2>

        {/* Description */}
        <div className="mb-12 space-y-4 text-lg leading-relaxed text-white md:text-xl lg:text-2xl text-center">
          {MODERN_PLAYFUL.description.map((line) => (
            <p key={line.slice(0, 30)} className="m-0">
              {line}
            </p>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
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
            {MODERN_PLAYFUL.button.text}
          </EntaratBtn>
        </div>
      </div>
    </section>
  );
}
