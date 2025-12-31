export type Player = {
  id: string;
  name: string;
  avatar: string;
  gameId: string;
  score: number;
};

export type Question = {
  id: number;
  question: string;
  image: string;
  options: string[];
  correctAnswer: number;
  category: string;
};

export type Game = {
  id: string;
  playerIds: string[];
  currentRound: number;
  totalRounds: number;
  status: "waiting" | "playing" | "finished";
  answers: Map<string, { answer: number; round: number; timestamp: number }>;
  startTime: number | null;
};

export type WebSocketMessage =
  | {
      type: "join";
      gameId: string;
      playerId: string;
      name: string;
      avatar: string;
      totalRounds?: number;
    }
  | { type: "start_game"; gameId: string }
  | { type: "submit_answer"; gameId: string; answer: number }
  | { type: "next_round"; gameId: string };
