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
  title: "How It Works",
  steps: [
    {
      title: "Pick a game",
      description:
        "Spin up a game room in seconds. Public for anyone or private for your circle only. You're in control.",
    },
    {
      title: "Share the Link",
      description:
        "Send a link, ping a username, or pull from your friends list. Across towns or time zones — everyone gets in.",
      emoji: undefined,
    },
    {
      title: "Start Playing",
      description:
        "Charades, Trivia, Word Dash, and more — all with seamless voice chat. No app-hopping, no awkward silences. Just play and vibe.",
      emoji: undefined,
    },
  ],
  philosophy: {
    title: "How It Works",
    emoji: "😊",
    description:
      "We believe games should feel human. Entarat uses custom avatars, expressive voice filters, and joyful animations to make online game nights feel real again. No stiff video calls. Just energy, presence, and pure fun. Your vibe matters. We built Entarat around it.",
  },
  images: {
    step1: {
      img: "/how_it_works/1.png",
      alt: "People playing games outdoors",
    },
    step2: {
      img: "/how_it_works/2.png",
      alt: "Group of friends playing games",
    },
    step3: {
      img: "/how_it_works/3.png",
      alt: "Children playing games together",
    },
  },
} as const;

export const TESTIMONIALS = {
  title: "Testimonials/Preview Video",
  items: [
    {
      quote: "It felt like we were all in one room. A real Entarater",
      name: "John",
      avatar: "😊",
    },
    {
      quote:
        "We ditched Zoom and never looked back. Entarat is our new Friday ritual.",
      name: "John",
      avatar: "🍞",
    },
    {
      quote:
        "Perfect for remote teams. Casual, creative, and zero awkward pauses",
      name: "Rena",
      avatar: "😐",
    },
    {
      quote: "It felt like we were all in one room.",
      name: "John",
      avatar: "😮",
    },
  ],
} as const;

export const FOOTER = {
  social: {
    twitter: {
      label: "Twitter",
      url: "https://twitter.com/entarat",
      icon: "x",
    },
    instagram: {
      label: "Instagram",
      url: "https://instagram.com/entarat",
      icon: "instagram",
    },
    discord: {
      label: "Discord",
      url: "https://discord.gg/entarat",
      icon: "discord",
    },
    facebook: {
      label: "Facebook",
      url: "https://facebook.com/entarat",
      icon: "facebook",
    },
  },
  navigation: {
    title: "Navigation",
    links: [
      { label: "Hero", href: "#hero" },
      { label: "Games Preview", href: "#games" },
      { label: "Features", href: "#features" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Call-to-Action", href: "#cta" },
    ],
  },
  games: {
    title: "Games",
    links: [
      { label: "Complete the words", href: "#game-complete-words" },
      { label: "Charades", href: "#game-charades" },
      { label: "Word Dash", href: "#game-word-dash" },
      { label: "Quick Quiz", href: "#game-quick-quiz" },
      { label: "Trivia Time", href: "#game-trivia-time" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Resources", href: "/resources" },
      { label: "Blog", href: "/blog" },
      { label: "Support", href: "/support" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
  copyright: `© ${new Date().getFullYear()} Entarat. All rights reserved.`,
} as const;
