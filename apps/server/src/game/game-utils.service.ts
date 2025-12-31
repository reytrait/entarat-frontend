import { Injectable } from "@nestjs/common";
import type { Game, GameSummary, Question } from "@entarat/shared";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class GameUtilsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Randomizes the options array and returns the new question with randomized options
   * and the new correct answer index after randomization.
   */
  randomizeQuestionOptions(
    question: Question,
  ): Question & { originalCorrectAnswer: number } {
    const options = [...question.options];
    const originalCorrectAnswer = question.correctAnswer;
    const correctOption = options[originalCorrectAnswer];

    // Shuffle the options array using Fisher-Yates algorithm
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    // Find the new index of the correct answer after shuffling
    const newCorrectAnswer = options.indexOf(correctOption);

    return {
      ...question,
      options,
      correctAnswer: newCorrectAnswer,
      originalCorrectAnswer,
    };
  }

  /**
   * Gets an unused question from the database, ensuring no repeats.
   */
  getUnusedQuestion(
    usedQuestionIds: number[],
  ): (Question & { originalCorrectAnswer: number }) | null {
    return this.getUnusedQuestionFromList(
      this.databaseService.questions,
      usedQuestionIds,
    );
  }

  /**
   * Gets an unused question from a provided list, ensuring no repeats.
   */
  private getUnusedQuestionFromList(
    availableQuestions: Question[],
    usedQuestionIds: number[],
  ): (Question & { originalCorrectAnswer: number }) | null {
    const unusedQuestions = this.databaseService.questions.filter(
      (q) => !usedQuestionIds.includes(q.id),
    );

    if (unusedQuestions.length === 0) {
      return null; // All questions have been used
    }

    // Randomly select from unused questions
    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    const selectedQuestion = unusedQuestions[randomIndex];
    return this.randomizeQuestionOptions(selectedQuestion);
  }

  /**
   * Removes the correctAnswer from a question object before sending to client.
   */
  sanitizeQuestionForClient(
    question: Question & { originalCorrectAnswer?: number },
  ): Omit<Question, "correctAnswer"> & { originalCorrectAnswer?: number } {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { correctAnswer: _correctAnswer, ...sanitized } = question;
    return sanitized;
  }

  /**
   * Generates a game summary with all questions and player statistics.
   */
  generateGameSummary(game: Game): GameSummary {
    const questions = game.roundHistory.map((roundData) => ({
      round: roundData.round,
      question: roundData.question,
      correctAnswer: roundData.question.correctAnswer,
    }));

    const playerStats = game.playerIds.map((playerId) => {
      const player = this.databaseService.players.get(playerId);
      let questionsPassed = 0;
      let questionsFailed = 0;
      const answers: Array<{
        round: number;
        answer: number;
        isCorrect: boolean;
      }> = [];

      game.roundHistory.forEach((roundData) => {
        const playerAnswer = roundData.playerAnswers.get(playerId);
        if (playerAnswer) {
          answers.push({
            round: roundData.round,
            answer: playerAnswer.answer,
            isCorrect: playerAnswer.isCorrect,
          });
          if (playerAnswer.isCorrect) {
            questionsPassed++;
          } else {
            questionsFailed++;
          }
        } else {
          // No answer submitted
          answers.push({
            round: roundData.round,
            answer: -1,
            isCorrect: false,
          });
          questionsFailed++;
        }
      });

      return {
        playerId,
        player,
        totalScore: player?.score || 0,
        questionsPassed,
        questionsFailed,
        answers,
      };
    });

    return {
      questions,
      playerStats,
    };
  }
}

