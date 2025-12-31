// Site-wide constants and content
// Update content here to easily manage all text across the application

// temporary
export const TEMP_PAGES_CREATED = [
  {
    path: "/",
    title: "Home",
  },
  {
    path: "/game-review",
    title: "Game Preview",
  },
  {
    path: "/game-setup",
    title: "Game Setup",
  },
  {
    path: "/join-game",
    title: "Join Game",
  },
  {
    path: "/lobby",
    title: "Lobby",
  },
  {
    path: "/game",
    title: "Game Start",
  },
];

export const HIDDEN_FOOTER_PAGES = [
  "/game-setup",
  "/login",
  "/register",
  "/join-game",
  "/lobby",
  "/game",
];

export const SITE_CONFIG = {
  name: "Entarat",
  logo: {
    light: "/assets/logo/entarat-logo__black.svg",
    dark: "/assets/logo/entarat-logo__white.svg",
    noText_white: "/assets/logo/entarat-logo__white-no-text.svg",
    alt: "Entarat Logo",
    text: "Entarat",
  },
} as const;

export const NAVIGATION = {
  links: [
    { label: "Hero", href: "#hero" },
    { label: "Games Preview", href: "/game-review" },
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
  gameCards: [
    {
      title: "Trivia Time",
      description:
        "The ultimate brain battle. Test your knowledge across pop science, and weird facts. Quiz",
      color: "#E0006D",
      rotation: -12,
      zIndex: 1,
    },
    {
      title: "Complete the Word",
      description:
        "One letter can change ever. Take turns filling in blanks — smarts win the roun.",
      color: "#FF0004",
      rotation: -6,
      zIndex: 2,
    },
    {
      title: "Charades",
      description:
        "Act it out, no words allowed. Guess the word from your friend's wild gestures and dramatic performances",
      color: "#1E029D",
      rotation: 0,
      zIndex: 3,
    },
    {
      title: "Quick Quiz",
      description:
        "Race against time to answer quirky questions with your crew. Guess the Sound",
      color: "#00FF00",
      rotation: 6,
      zIndex: 2,
    },
    {
      title: "Word Dash",
      description:
        "Think fast under pressure. A word scramble game — rack up points before the buzzer!",
      color: "#0A0039",
      rotation: 12,
      zIndex: 1,
    },
  ],
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

export const BRAND_COLORS = {
  primary: {
    orange: "#FFAD0D",
    magenta: "#E0006D",
    blue: "#1E029D",
  },
  secondary: {
    teal: "#00E4D5",
    limeGreen: "#00FF00",
    red: "#FF0004",
    black: "#000000",
  },
  gradients: {
    orangeYellow: {
      from: "#FFAD0D",
      to: "#FFD700",
    },
    bluePurple: {
      from: "#1E029D",
      to: "#0A0039",
    },
    magentaPink: {
      from: "#E0006D",
      to: "#8B008B",
    },
  },
} as const;

export const MODERN_PLAYFUL = {
  title: "Modern. Playful. Familiar.",
  description: [
    "We designed Entarat to feel like a mix between your favorite party app and your favorite people.",
    "Custom avatars. Voice filters. Animated reactions.",
    "Every interaction feels warm, expressive, and human.",
  ],
  button: {
    text: "Create Game",
  },
} as const;

export const AVATARS = {
  blue: {
    square: "/avatars/avatar-blue-square.svg",
    square2: "/avatars/avatar-blue-square-2.svg",
    square3: "/avatars/avatar-blue-square-3.svg",
  },
  cyan: {
    default: "/avatars/avatar-cyan.svg",
    smile: "/avatars/avatar-cyan-smile.svg",
    square: "/avatars/avatar-cyan-square.svg",
    square2: "/avatars/avatar-cyan-square-2.svg",
    square3: "/avatars/avatar-cyan-square-3.svg",
    squareVariant: "/avatars/avatar-cyan-square-variant.svg",
  },
  gradient: {
    default: "/avatars/avatar-gradient.svg",
    variant: "/avatars/avatar-gradient-variant.svg",
    square: "/avatars/avatar-gradient-square.svg",
  },
  green: {
    default: "/avatars/avatar-green.svg",
    variant: "/avatars/avatar-green-variant.svg",
    square: "/avatars/avatar-green-square.svg",
    square2: "/avatars/avatar-green-square-2.svg",
  },
  orange: {
    default: "/avatars/avatar-orange.svg",
    square: "/avatars/avatar-orange-square.svg",
    square2: "/avatars/avatar-orange-square-2.svg",
  },
  pink: {
    square: "/avatars/avatar-pink-square.svg",
    square2: "/avatars/avatar-pink-square-2.svg",
  },
  purple: {
    square: "/avatars/avatar-purple-square.svg",
    square2: "/avatars/avatar-purple-square-2.svg",
  },
  red: {
    default: "/avatars/avatar-red.svg",
    square: "/avatars/avatar-red-square.svg",
    square2: "/avatars/avatar-red-square-2.svg",
    square3: "/avatars/avatar-red-square-3.svg",
  },
  teal: {
    square: "/avatars/avatar-teal-square.svg",
    square2: "/avatars/avatar-teal-square-2.svg",
  },
  yellow: {
    square: "/avatars/avatar-yellow-square.svg",
    square2: "/avatars/avatar-yellow-square-2.svg",
  },
  placeholder: {
    gray1: "/avatars/avatar-placeholder-gray-1.svg",
    gray2: "/avatars/avatar-placeholder-gray-2.svg",
    gray3: "/avatars/avatar-placeholder-gray-3.svg",
  },
  group: {
    group48: "/avatars/avatar-group-48.svg",
    group49: "/avatars/avatar-group-49.svg",
    group49Variant: "/avatars/avatar-group-49-variant.svg",
    group50: "/avatars/avatar-group-50.svg",
    group50Variant: "/avatars/avatar-group-50-variant.svg",
    group51: "/avatars/avatar-group-51.svg",
    group51Variant: "/avatars/avatar-group-51-variant.svg",
    group52: "/avatars/avatar-group-52.svg",
    group52Variant: "/avatars/avatar-group-52-variant.svg",
    group53: "/avatars/avatar-group-53.svg",
  },
  actions: {
    okSign: "/avatars/avatar-ok-sign.svg",
    wave: "/avatars/avatar-wave.svg",
  },
} as const;

export const TESTIMONIALS = {
  title: "Testimonials/ Preview Video",
  items: [
    {
      quote: "It felt like we were all in one room. A real Entarater",
      name: "John",
      avatar: "/avatars/avatar-cyan-smile.svg",
      avatarColor: "cyan",
      bgColor: BRAND_COLORS.primary.orange,
    },
    {
      quote:
        "We ditched Zoom and never looked back. Entarat is our new Friday ritual.",
      name: "John",
      avatar: "/avatars/avatar-orange.svg",
      avatarColor: "orange",
      bgColor: BRAND_COLORS.primary.magenta,
    },
    {
      quote:
        "Perfect for remote teams. Casual, creative, and zero awkward pauses",
      name: "Rena",
      avatar: "/avatars/avatar-green.svg",
      avatarColor: "green",
      bgColor: BRAND_COLORS.secondary.teal,
    },
    {
      quote: "It felt like we were all in one room.",
      name: "John",
      avatar: "/avatars/avatar-red.svg",
      avatarColor: "red",
      bgColor: BRAND_COLORS.primary.blue,
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
