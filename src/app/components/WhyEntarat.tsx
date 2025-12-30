import { Ellipse } from "@/components/ui/ellipse";
import { WHY_ENTARACT } from "@/lib/constants";

export function WhyEntarat() {
  return (
    <section
      id="features"
      className="relative w-full overflow-hidden bg-[#03010B] py-20 dark:bg-[#03010B] md:py-32"
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "url('/lines_bg.svg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      <Ellipse type="2" size="110vw" position={{ y: "100%", x: "0%" }} center />
      <Ellipse type="1" size="120%w" position={{ y: "0%", x: "100%" }} center />
      <Ellipse type="3" size="70vw" position={{ y: "50%", x: "50%" }} center />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        {/* Title */}
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          {WHY_ENTARACT.title}
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {WHY_ENTARACT.features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-gray-50 p-8 dark:bg-gray-900/50 dark:backdrop-blur-sm"
            >
              {/* Icon */}
              <div className="mb-4">
                {feature.icon === "puzzle" && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500">
                    <svg
                      className="h-7 w-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Puzzle piece icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                      />
                    </svg>
                  </div>
                )}
                {feature.icon === "group" && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500">
                    <svg
                      className="h-7 w-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Group icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                )}
                {feature.icon === "microphone" && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700 dark:bg-gray-600">
                    <svg
                      className="h-7 w-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Microphone icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                )}
                {feature.icon === "globe" && (
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      background:
                        "linear-gradient(to bottom right, rgb(59 130 246), rgb(34 197 94))",
                    }}
                  >
                    <svg
                      className="h-7 w-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>Globe icon</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M15 11a3 3 0 11-6 0m6 0a3 3 0 10-6 0m6 0h.01M12 21a9 9 0 01-9-9 9 9 0 0118 0 9 9 0 01-9 9z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 md:text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
