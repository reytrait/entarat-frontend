import type { Game, Player, Question } from "./types";

// In-memory database (temp storage)
export const db = {
  games: new Map<string, Game>(),
  players: new Map<string, Player>(),
  questions: [
    {
      id: 1,
      question: "Which planet is known as the Red Planet?",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/360px-OSIRIS_Mars_true_color.jpg",
      options: ["Mars", "Jupiter", "Saturn", "Venus"],
      correctAnswer: 0,
      category: "Science",
    },
    {
      id: 2,
      question: "What is the largest ocean on Earth?",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Ocean_Beach.jpg/1600px-Ocean_Beach.jpg",
      options: ["Atlantic", "Pacific", "Indian", "Arctic"],
      correctAnswer: 1,
      category: "Geography",
    },
    {
      id: 3,
      question: "Who painted the Mona Lisa?",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Mona_Lisa.jpg/960px-Mona_Lisa.jpg",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
      correctAnswer: 2,
      category: "Art",
    },
  ] as Question[],
};
