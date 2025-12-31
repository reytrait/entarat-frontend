import type { Question } from "./types";

/**
 * Randomizes the options array and returns the new question with randomized options
 * and the new correct answer index after randomization.
 * @param question - The original question with correctAnswer index
 * @returns A new question object with randomized options and updated correctAnswer index
 */
export function randomizeQuestionOptions(
  question: Question,
): Question & { originalCorrectAnswer: number } {
  // Create a copy of the options array
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
    originalCorrectAnswer, // Keep track of original for verification if needed
  };
}

/**
 * Gets an unused question from the database, ensuring no repeats.
 * @param availableQuestions - Array of all available questions
 * @param usedQuestionIds - Array of question IDs that have already been used
 * @returns A question that hasn't been used yet, or null if all questions are used
 */
export function getUnusedQuestion(
  availableQuestions: Question[],
  usedQuestionIds: number[],
): Question | null {
  const unusedQuestions = availableQuestions.filter(
    (q) => !usedQuestionIds.includes(q.id),
  );

  if (unusedQuestions.length === 0) {
    return null; // All questions have been used
  }

  // Randomly select from unused questions
  const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
  return unusedQuestions[randomIndex];
}

/**
 * Removes the correctAnswer from a question object before sending to client.
 * This prevents clients from knowing the answer before submitting their choice.
 * @param question - The question object with correctAnswer
 * @returns A question object without correctAnswer
 */
export function sanitizeQuestionForClient(
  question: Question & { originalCorrectAnswer?: number },
): Omit<Question, "correctAnswer"> & { originalCorrectAnswer?: number } {
  const { correctAnswer: _correctAnswer, ...sanitized } = question;
  return sanitized;
}
