export type Player = {
  id: string;
  name: string;
  avatar: string;
  gameId: string;
  score: number;
  deviceId: string;
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
  currentQuestion: Question | null;
  roundStartTime: number | null;
  roundDuration: number; // Duration in milliseconds (default 30 seconds)
  usedQuestionIds: number[]; // Track which question IDs have been used
};

export type JoinMessage = {
  type: "join";
  gameId: string;
  playerId: string;
  name: string;
  avatar: string;
  deviceId: string;
  totalRounds?: number;
};
export type StartGameMessage = { type: "start_game"; gameId: string };
export type SubmitAnswerMessage = {
  type: "submit_answer";
  gameId: string;
  answer: number;
};
export type NextRoundMessage = { type: "next_round"; gameId: string };

export type WebSocketMessage =
  | JoinMessage
  | StartGameMessage
  | SubmitAnswerMessage
  | NextRoundMessage;
