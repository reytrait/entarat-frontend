export type Player = {
  id: string;
  name: string;
  avatar: string;
  score: number;
};

export type Question = {
  id: number;
  question: string;
  image: string;
  options: string[];
  correctAnswer?: number; // Optional - only present after round_results
  category: string;
};

export type GameState = {
  round: number;
  totalRounds: number;
  question: Question | null;
  selectedAnswer: number | null;
  showResults: boolean;
  correctAnswer: number | null;
  players: Player[];
  totalPlayers?: number;
  answers: Array<{
    playerId: string;
    player: Player;
    answer: number;
    isCorrect: boolean;
  }>;
  isFinished?: boolean;
  finalScores?: Array<{
    player: Player | undefined;
    score: number;
  }>;
  timeExpired?: boolean; // Track if time has run out
  summary?: GameSummary; // Game summary with questions and player stats
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

export type TriviaGameProps = {
  gameId: string;
};
