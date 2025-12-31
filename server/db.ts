import type { Game, Player, Question } from "./types";

// In-memory database (temp storage)
export const db = {
  games: new Map<string, Game>(),
  players: new Map<string, Player>(),
  questions: [
    {
      id: 1,
      question: "Which planet is known as the Red Planet?",
      image: "/images/mars.jpg",
      options: ["Mars", "Jupiter", "Saturn", "Venus"],
      correctAnswer: 0,
      category: "Science",
    },
    {
      id: 2,
      question: "What is the largest ocean on Earth?",
      image: "/images/ocean.jpg",
      options: ["Atlantic", "Pacific", "Indian", "Arctic"],
      correctAnswer: 1,
      category: "Geography",
    },
    {
      id: 3,
      question: "Who painted the Mona Lisa?",
      image: "/images/mona-lisa.jpg",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
      correctAnswer: 2,
      category: "Art",
    },
  ] as Question[],
};
