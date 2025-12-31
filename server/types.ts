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

export type RoundData = {
  round: number;
  question: Question;
  playerAnswers: Map<
    string,
    { answer: number; isCorrect: boolean; timestamp: number }
  >;
};

export type GameSummary = {
  questions: Array<{
    round: number;
    question: Question;
    correctAnswer: number;
  }>;
  playerStats: Array<{
    playerId: string;
    player: Player | undefined;
    totalScore: number;
    questionsPassed: number; // Correct answers
    questionsFailed: number; // Incorrect or no answer
    answers: Array<{
      round: number;
      answer: number;
      isCorrect: boolean;
    }>;
  }>;
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
  roundDuration: number; // Duration in milliseconds (default 10 seconds)
  usedQuestionIds: number[]; // Track which question IDs have been used
  roundHistory: RoundData[]; // Track all rounds with questions and answers
  summary?: GameSummary; // Summary when game is finished
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
export type RequestRoundResultsMessage = {
  type: "request_round_results";
  gameId: string;
};

export type WebSocketMessage =
  | JoinMessage
  | StartGameMessage
  | SubmitAnswerMessage
  | NextRoundMessage
  | RequestRoundResultsMessage;
