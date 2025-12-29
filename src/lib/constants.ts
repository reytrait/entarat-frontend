// Site-wide constants and content
// Update content here to easily manage all text across the application

export const SITE_CONFIG = {
  name: "Entarat",
  logo: {
    light: "/entarat-logo__black.svg",
    dark: "/entarat-logo__white.svg",
    alt: "Entarat Logo",
    text: "Entarat",
  },
} as const;

export const NAVIGATION = {
  links: [
    { label: "Hero", href: "#hero" },
    { label: "Games Preview", href: "#games" },
    { label: "Features", href: "#features" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Call-to-Action", href: "#cta" },
  ],
} as const;

export const HERO = {
  title: "Play. Talk. Vibe. Together.",
  description:
    "Entarat brings the magic of game nights online. Real-time voice. Instant games. Endless fun. Whether you're chilling with friends or bonding with teammates You're just one tap away.",
  buttons: {
    createGame: "Create Game",
    joinWithCode: "Join with Code",
  },
  gameControllerIcon: {
    ariaLabel: "Game controller icon",
    title: "Game controller",
  },
} as const;

export const WHY_ENTARACT = {
  title: "Why Entarat?",
  features: [
    {
      title: "Smart Game Design",
      description:
        "Games made for real humans: easy to start, impossible to stop. No downloads, no nonsense.",
      icon: "puzzle",
      iconColor: "green",
    },
    {
      title: "Made for Groups",
      description:
        "Whether it's three besties or thirty teammates, Entarat scales the fun. Private lobbies, team modes, and smart moderation included.",
      icon: "group",
      iconColor: "blue",
    },
    {
      title: "Built-in Voice Magic",
      description:
        "Talk while you play — without switching tabs or juggling apps. Your voice powers the fun.",
      icon: "microphone",
      iconColor: "white",
    },
    {
      title: "Play Across Screens",
      description:
        "Phone? Laptop? Tablet? Doesn't matter. Switch devices mid-game without dropping out.",
      icon: "globe",
      iconColor: "blue-green",
    },
  ],
} as const;

export const HOW_IT_WORKS = {
  title: "",
  description: "",
  steps: [],
  // Add content here when component is implemented
} as const;

export const TESTIMONIALS = {
  title: "",
  items: [],
  // Add content here when component is implemented
} as const;

export const FOOTER = {
  copyright: "",
  links: [],
  // Add content here when component is implemented
} as const;
