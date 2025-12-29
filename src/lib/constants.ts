// Site-wide constants and content
// Update content here to easily manage all text across the application

export const SITE_CONFIG = {
  name: "Entarat",
  logo: {
    emoji: "😊",
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
  title: "",
  description: "",
  // Add content here when component is implemented
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
