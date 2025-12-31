export enum WSMsgType {
  // Client to Server
  JOIN = "join",
  START_GAME = "start_game",
  SUBMIT_ANSWER = "submit_answer",
  NEXT_ROUND = "next_round",
  REQUEST_ROUND_RESULTS = "request_round_results",

  // Server to Client
  SOCKET_CONNECTED = "socket_connected",
  ERROR = "error",
  PLAYER_JOINED = "player_joined",
  PLAYERS_LIST = "players_list",
  GAME_STATE = "game_state",
  GAME_FINISHED = "game_finished",
  ROUND_RESULTS = "round_results",
  GAME_STARTED = "game_started",
  ANSWER_RECEIVED = "answer_received",
  PLAYER_LEFT = "player_left",
}

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
  type: WSMsgType.JOIN;
  gameId: string;
  playerId: string;
  name: string;
  avatar: string;
  deviceId: string;
  totalRounds?: number;
};
export type StartGameMessage = {
  type: WSMsgType.START_GAME;
  gameId: string;
};
export type SubmitAnswerMessage = {
  type: WSMsgType.SUBMIT_ANSWER;
  gameId: string;
  answer: number;
};
export type NextRoundMessage = {
  type: WSMsgType.NEXT_ROUND;
  gameId: string;
};
export type RequestRoundResultsMessage = {
  type: WSMsgType.REQUEST_ROUND_RESULTS;
  gameId: string;
};

export type WebSocketMessage =
  | JoinMessage
  | StartGameMessage
  | SubmitAnswerMessage
  | NextRoundMessage
  | RequestRoundResultsMessage;
