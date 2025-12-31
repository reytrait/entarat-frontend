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
  correctAnswer: number;
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
};

export type TriviaGameProps = {
  gameId: string;
};
