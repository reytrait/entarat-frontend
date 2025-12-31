export const GAME_CATEGORIES = [
  "All",
  "Charades",
  "Spelling Bees",
  "Quizes",
  "Trivias",
  "Complete the words",
] as const;

type Game = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: (typeof GAME_CATEGORIES)[number];
  bgColor: string;
  borderColor: string;
  avatars?: { src: string; alt: string }[];
};

type GameCategory = {
  category: (typeof GAME_CATEGORIES)[number];
  defaultAvatar?: { src: string; alt: string };
  games: Game[];
};

export const GAMES: GameCategory[] = [
  {
    category: "Charades",
    defaultAvatar: {
      src: "/assets/icons/charades.png",
      alt: "Charades avatar",
    },
    games: [
      {
        id: "charades-1",
        title: "Charades",
        subtitle: "Act it out, no words allowed",
        description:
          "Guess the word from your friend's wild gestures and dramatic performances",
        category: "Charades",
        bgColor: "#1E029D",
        borderColor: "#AE9CFF",
      },
      {
        id: "charades-2",
        title: "Charades",
        subtitle: "Act it out, no words allowed",
        description:
          "Guess the word from your friend's wild gestures and dramatic performances",
        category: "Charades",
        bgColor: "#1E029D",
        borderColor: "#AE9CFF",
      },
      {
        id: "charades-3",
        title: "Charades",
        subtitle: "Act it out, no words allowed",
        description:
          "Guess the word from your friend's wild gestures and dramatic performances",
        category: "Charades",
        bgColor: "#1E029D",
        borderColor: "#AE9CFF",
      },
      {
        id: "charades-4",
        title: "Charades",
        subtitle: "Act it out, no words allowed",
        description:
          "Guess the word from your friend's wild gestures and dramatic performances",
        category: "Charades",
        bgColor: "#1E029D",
        borderColor: "#AE9CFF",
      },
    ],
  },
  {
    category: "Quizes",
    defaultAvatar: {
      src: "/assets/icons/science_quiz.png",
      alt: "Science quiz avatar",
    },

    games: [
      {
        id: "science-quiz-1",
        title: "Science Quiz",
        subtitle: "Act it out, no words allowed",
        description:
          "Guess the word from your friend's wild gestures and dramatic performances",
        category: "Quizes",
        bgColor: "#E200B5",
        borderColor: "#FF7E7E",
      },
      {
        id: "science-quiz-2",
        title: "Science Quiz",
        subtitle: "Act it out, no words allowed",
        description:
          "Guess the word from your friend's wild gestures and dramatic performances",
        category: "Quizes",
        bgColor: "#E200B5",
        borderColor: "#FF7E7E",
      },
      {
        id: "science-quiz-3",
        title: "Science Quiz",
        subtitle: "Act it out, no words allowed",
        description:
          "Guess the word from your friend's wild gestures and dramatic performances",
        category: "Quizes",
        bgColor: "#E200B5",
        borderColor: "#FF7E7E",
      },
      {
        id: "science-quiz-4",
        title: "Science Quiz",
        subtitle: "Act it out, no words allowed",
        description:
          "Guess the word from your friend's wild gestures and dramatic performances",
        category: "Quizes",
        bgColor: "#E200B5",
        borderColor: "#FF7E7E",
      },
    ],
  },
  {
    category: "Trivias",
    defaultAvatar: { src: "/assets/icons/trivias.png", alt: "Trivia avatar" },
    games: [
      {
        id: "trivias-1",
        title: "Trivias",
        subtitle: "Act it out, no words allowed",
        description:
          "Guess the word from your friend's wild gestures and dramatic performances",
        category: "Trivias",
        bgColor: "#00951E",
        borderColor: "#AE9CFF",
      },
      {
        id: "trivias-2",
        title: "Trivias",
        subtitle: "Act it out, no words allowed",
        description:
          "Guess the word from your friend's wild gestures and dramatic performances",
        category: "Trivias",
        bgColor: "#00951E",
        borderColor: "#AE9CFF",
      },
      {
        id: "trivias-3",
        title: "Trivias",
        subtitle: "Act it out, no words allowed",
        description:
          "Guess the word from your friend's wild gestures and dramatic performances",
        category: "Trivias",
        bgColor: "#00951E",
        borderColor: "#AE9CFF",
      },
      {
        id: "trivias-4",
        title: "Trivias",
        subtitle: "Act it out, no words allowed",
        description:
          "Guess the word from your friend's wild gestures and dramatic performances",
        category: "Trivias",
        bgColor: "#00951E",
        borderColor: "#AE9CFF",
      },
    ],
  },
] as const;
