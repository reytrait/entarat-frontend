import { db } from "./db";
import { broadcastToGame, generateGameSummary } from "./websocket";

// Store active round timers
const roundTimers = new Map<string, NodeJS.Timeout>();

/**
 * Starts a timer for a round that will automatically send results when time expires
 */
export function startRoundTimer(gameId: string) {
  // Clear any existing timer for this game
  stopRoundTimer(gameId);

  const game = db.games.get(gameId);
  if (!game || !game.roundStartTime || !game.currentQuestion) {
    return;
  }

  const timer = setTimeout(() => {
    const currentGame = db.games.get(gameId);
    // Check if round is still active and time has expired
    if (!currentGame || currentGame.status !== "playing") {
      return;
    }

    const now = Date.now();
    const elapsed = now - (currentGame.roundStartTime || 0);
    const remaining = Math.max(0, currentGame.roundDuration - elapsed);

    // Only process if time has actually expired
    if (remaining <= 0) {
      const currentQuestion = currentGame.currentQuestion;
      if (!currentQuestion) {
        return;
      }

      const isLastRound = currentGame.currentRound >= currentGame.totalRounds;

      // Calculate scores for all players who answered
      currentGame.answers.forEach((answerData, pid) => {
        if (answerData.answer === currentQuestion.correctAnswer) {
          const player = db.players.get(pid);
          if (player) {
            player.score += 1;
          }
        }
      });

      if (isLastRound) {
        // Last round - end game immediately
        currentGame.status = "finished";

        const finalScores = currentGame.playerIds.map((id) => ({
          player: db.players.get(id),
          score: db.players.get(id)?.score || 0,
        }));

        broadcastToGame(gameId, {
          type: "game_finished",
          scores: finalScores,
        });

        console.log(
          `🎉 All rounds complete! Game finished (Round ${currentGame.currentRound}/${currentGame.totalRounds}) - Timer expired`,
        );
      } else {
        // Not last round - send round results
        const allAnswers = Array.from(currentGame.answers.entries()).map(
          ([pid, ans]) => ({
            playerId: pid,
            player: db.players.get(pid),
            answer: ans.answer,
            isCorrect: ans.answer === currentQuestion.correctAnswer,
          }),
        );

        // Add entries for players who didn't answer
        currentGame.playerIds.forEach((pid) => {
          if (!currentGame.answers.has(pid)) {
            allAnswers.push({
              playerId: pid,
              player: db.players.get(pid),
              answer: -1, // No answer submitted
              isCorrect: false,
            });
          }
        });

        broadcastToGame(gameId, {
          type: "round_results",
          round: currentGame.currentRound,
          correctAnswer: currentQuestion.correctAnswer,
          answers: allAnswers,
        });
        console.log(
          `⏰ Round timer expired - Sent results (Round ${currentGame.currentRound}/${currentGame.totalRounds})`,
        );
      }

      // Clear answers for next round (if not finished)
      if (!isLastRound) {
        currentGame.answers.clear();
      }
    }

    // Clean up timer
    roundTimers.delete(gameId);
  }, game.roundDuration);

  roundTimers.set(gameId, timer);
}

/**
 * Stops the round timer for a game
 */
export function stopRoundTimer(gameId: string) {
  const timer = roundTimers.get(gameId);
  if (timer) {
    clearTimeout(timer);
    roundTimers.delete(gameId);
  }
}

/**
 * Gets round results for a game (used when client requests results)
 */
export function getRoundResults(gameId: string) {
  const game = db.games.get(gameId);
  if (!game || !game.currentQuestion) {
    return null;
  }

  const currentQuestion = game.currentQuestion;
  const now = Date.now();
  const elapsed = now - (game.roundStartTime || 0);
  const remaining = Math.max(0, game.roundDuration - elapsed);
  const timeExpired = remaining <= 0;

  if (!timeExpired) {
    return null; // Round still active
  }

  const isLastRound = game.currentRound >= game.totalRounds;

  // Calculate scores and track player answers
  const playerAnswers = new Map<
    string,
    { answer: number; isCorrect: boolean; timestamp: number }
  >();

  game.answers.forEach((answerData, pid) => {
    const isCorrect = answerData.answer === currentQuestion.correctAnswer;
    playerAnswers.set(pid, {
      answer: answerData.answer,
      isCorrect,
      timestamp: answerData.timestamp,
    });

    if (isCorrect) {
      const player = db.players.get(pid);
      if (player) {
        player.score += 1;
      }
    }
  });

  // Add entries for players who didn't answer
  game.playerIds.forEach((pid) => {
    if (!playerAnswers.has(pid)) {
      playerAnswers.set(pid, {
        answer: -1,
        isCorrect: false,
        timestamp: Date.now(),
      });
    }
  });

  // Save round data to history if not already saved
  const roundExists = game.roundHistory.some(
    (r) => r.round === game.currentRound,
  );
  if (!roundExists) {
    game.roundHistory.push({
      round: game.currentRound,
      question: currentQuestion,
      playerAnswers,
    });
  }

  if (isLastRound) {
    // Last round - return game finished
    game.status = "finished";
    game.summary = generateGameSummary(game);
    return {
      type: "game_finished" as const,
      scores: game.playerIds.map((id) => ({
        player: db.players.get(id),
        score: db.players.get(id)?.score || 0,
      })),
      summary: game.summary,
    };
  } else {
    // Not last round - return round results
    const allAnswers = Array.from(game.answers.entries()).map(([pid, ans]) => ({
      playerId: pid,
      player: db.players.get(pid),
      answer: ans.answer,
      isCorrect: ans.answer === currentQuestion.correctAnswer,
    }));

    // Add entries for players who didn't answer
    game.playerIds.forEach((pid) => {
      if (!game.answers.has(pid)) {
        allAnswers.push({
          playerId: pid,
          player: db.players.get(pid),
          answer: -1,
          isCorrect: false,
        });
      }
    });

    return {
      type: "round_results" as const,
      round: game.currentRound,
      correctAnswer: currentQuestion.correctAnswer,
      answers: allAnswers,
    };
  }
}
