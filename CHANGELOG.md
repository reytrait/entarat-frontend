# Changelog

This document tracks all major changes and features implemented in the Entarat trivia game application.

All changes are listed with timestamps in reverse chronological order (newest first).

---

## [2025-12-31] Auto-Play Feature & Game Summary

### Auto-Play Feature
- **Automatic round progression**: When autoplay is toggled on, rounds automatically advance after 3 seconds
- **No manual interaction needed**: Eliminates need to click "Next Round" button when autoplay is enabled
- **Smart timing**: Waits 3 seconds after round results are shown before advancing
- **Last round protection**: Auto-play does not trigger on the final round (game finished)
- **Toggle control**: Users can still toggle autoplay on/off at any time
- **Cleanup handling**: Auto-play timeouts are properly cleared on component unmount and when next round starts

### Game Summary Feature
- **Complete game summary**: When game status is `"finished"`, server generates comprehensive summary object
- **Summary includes**:
  - All questions asked with correct answers
  - Player statistics (total score, questions passed, questions failed)
  - Detailed answer breakdown per player per round
- **Summary page**: New frontend page displays complete game breakdown
  - Player statistics with winner highlighting
  - Questions breakdown showing all options with correct answer highlighted
  - Player answers for each question with correct/incorrect indicators
  - Visual indicators (green for correct, red for incorrect)
- **Round history tracking**: Server tracks all rounds with questions and player answers
- **Automatic summary generation**: Summary is automatically created when game completes

### Database Expansion
- **Expanded question database**: Increased from 3 to 30 questions
- **Diverse categories**: Questions span Science, Geography, Art, History, Literature, Sports, Math, Food, Entertainment
- **All questions include**: Image URLs, 4 answer options, correct answer index, category

### Game Completion Improvements
- **Automatic completion tracking**: Server automatically detects when all rounds are complete
- **Immediate result sending**: Final results sent to all users immediately when game finishes
- **Completion detection**: Works for both timer expiration and early completion scenarios

### Technical Changes

**Server-Side:**
- Added `RoundData` type to track round questions and answers
- Added `GameSummary` type with questions and player statistics
- Updated `Game` type to include `roundHistory: RoundData[]` and `summary?: GameSummary`
- Added `generateGameSummary()` function to create summary from round history
- Updated `checkAndCompleteGame()` to generate and send summary
- Updated `submit_answer` handler to save round data to history
- Updated `round-timer.ts` to save round history and generate summary
- Initialize `roundHistory: []` when creating new games
- Updated `game_state` message to include summary when game is finished (2025-12-31)
- Automatically generates summary if missing when sending `game_state` for finished games (2025-12-31)

**Client-Side:**
- Added `GameSummary` type matching server structure
- Added `summary?: GameSummary` to `GameState`
- Created `GameSummary.tsx` component for detailed game breakdown display
- Updated `useTriviaGame.ts` to handle summary in `game_finished` message and `game_state` message
- Updated `index.tsx` to show `GameSummary` component when summary is available
- Added auto-play functionality with 3-second delay after round results
- Added `yellow` text color variant to Text component for winner highlighting
- Added `autoPlayTimeoutRef` to track auto-play timeout
- Added `autoPlayRef` to track current autoplay state without dependency issues
- Auto-play automatically sends `next_round` event when enabled and round results received

---

## Game Features & Improvements

### Round Timer & Countdown
- **Added countdown timer display**: Shows remaining seconds (e.g., "30s") alongside the progress bar
- **Time expiration handling**: Timer stops when time runs out, prevents answer selection after expiration
- **Visual feedback**: Countdown turns red when ≤ 5 seconds, shows "Time's Up!" when expired
- **Progress bar synchronization**: Progress bar accurately reflects remaining time and stops at 100% when expired

### Question Management
- **Option randomization**: All question options are randomized each time a question is shown
- **Correct answer mapping**: Correct answer index is automatically updated after randomization
- **No question repeats**: Each question ID is used only once per game
- **Round limit enforcement**: Total rounds cannot exceed the number of available questions in the database
- **Unique question selection**: Questions are randomly selected from unused pool

### Game Flow
- **Game finished screen**: Displays final scores with winner highlighting when all rounds complete
- **Last round detection**: Automatically detects and handles the final round
- **Answer tracking**: All selected answers are preserved and displayed in results
- **Time expiration state**: Tracks when time expires to disable further interactions

### Round Progress Tracking
- **Server-side timestamp tracking**: Server tracks when each round starts
- **Reconnection support**: On page refresh, current question and remaining time are sent to reconnecting players
- **Progress synchronization**: Progress bar and countdown sync correctly after reconnection
- **Round duration management**: Centralized round duration constant (10 seconds default)
- **Automatic result sending**: Server automatically sends round results when time expires
- **Result request mechanism**: Clients can request round results if not received automatically
- **Last round handling**: On resume to expired last round, game immediately shows final summary

### Security & Anti-Cheating
- **Answer hiding**: Correct answer is never sent to clients until after they submit their answer
- **Question sanitization**: Server removes `correctAnswer` from questions before sending to clients
- **Results-only disclosure**: Correct answer only revealed in `round_results` message after answers are submitted

## Technical Implementation

### Server-Side Changes

#### New Files
- `server/utils.ts`: Utility functions for question randomization and selection
  - `randomizeQuestionOptions()`: Shuffles options and updates correct answer index
  - `getUnusedQuestion()`: Selects unused questions to prevent repeats
  - `sanitizeQuestionForClient()`: Removes `correctAnswer` from questions before sending to clients

- `server/round-timer.ts`: Automatic round timer management
  - `startRoundTimer()`: Starts timer that automatically sends results when round expires
  - `stopRoundTimer()`: Stops timer when all players answer early
  - `getRoundResults()`: Returns round results on demand for client requests
  - Saves round data to history when timer expires (2025-12-31)
  - Generates summary when last round expires (2025-12-31)
  - Includes summary in `game_finished` message (2025-12-31)

#### Modified Files

**`server/types.ts`**
- Added `usedQuestionIds: number[]` to `Game` type to track used questions
- Added `roundDuration: number` to track round duration
- Added `RequestRoundResultsMessage` type for client result requests
- Added `RoundData` type to track round questions and player answers
- Added `GameSummary` type with questions and player statistics
- Updated `Game` type to include `roundHistory: RoundData[]` and `summary?: GameSummary`

**`server/websocket.ts`**
- Implemented question randomization on `start_game` and `next_round`
- Added question tracking to prevent repeats
- Enforced round limit based on available questions
- Updated scoring to use randomized question's correct answer index
- Added round timestamp tracking for reconnection support
- Integrated automatic round timer that sends results when time expires
- Added `request_round_results` message handler for client requests
- Sanitizes questions (removes `correctAnswer`) before sending to clients
- Stops round timer when all players answer early
- Handles last round expiration by sending `game_finished` instead of `round_results`
- Added `generateGameSummary()` function to create summary from round history
- Updated `checkAndCompleteGame()` to generate and send summary with final scores
- Updated `submit_answer` handler to save round data to `roundHistory`
- Initialize `roundHistory: []` when creating new games

**`server/db.ts`**
- Contains question database (30 questions as of 2025-12-31)
- Questions include: id, question text, image path, options array, correctAnswer index, category
- All questions include image URLs from Wikimedia Commons

### Client-Side Changes

#### Modified Files

**`src/app/game/games/TriviaGame1/types.ts`**
- Added `isFinished?: boolean` to `GameState`
- Added `finalScores?: Array<{player: Player | undefined; score: number}>`
- Added `timeExpired?: boolean` to track time expiration
- Made `correctAnswer` optional in `Question` type (not sent from server until results)
- Added `GameSummary` type matching server structure
- Added `summary?: GameSummary` to `GameState`

**`src/app/game/games/TriviaGame1/useTriviaGame.ts`**
- Added `remainingTime` state to track countdown in seconds
- Updated `startProgressTimer()` to calculate and update remaining time
- Added time expiration detection and handling
- Updated `handleAnswerSelect()` to prevent selection when time expired
- Added `game_finished` handler to store final scores and summary
- Updated `round_results` handler to detect last round
- Added automatic result request mechanism (requests results if not received within 1 second)
- Handles last round expiration on resume by waiting for `game_finished` message
- Cleans up result request timeouts when results arrive
- Handles `summary` in `game_finished` message and stores in game state

**`src/app/game/games/TriviaGame1/index.tsx`**
- Added `GameFinished` component rendering when game is complete
- Passes `remainingTime` to `GameArea` component
- Shows loading state when waiting for final scores on last round expiration
- Shows `GameSummary` component when summary is available
- Falls back to `GameFinished` if summary not available

**`src/app/game/games/TriviaGame1/GameArea.tsx`**
- Added countdown timer display with "Time's Up!" message
- Updated to show time expiration state
- Disabled "Next Round" button when game is finished

**`src/app/game/games/TriviaGame1/AnswerButton.tsx`**
- Added `timeExpired` check to disable buttons when time runs out
- Updated disabled state styling

#### New Files

**`src/app/game/games/TriviaGame1/GameFinished.tsx`**
- Displays final game scores
- Shows winner with trophy icon
- Sorts players by score (descending)
- Displays player avatars and names
- Added "Start New Game" button to navigate to game selection (2025-12-31)
- Added "Go Home" button to navigate to homepage (2025-12-31)

**`src/app/game/games/TriviaGame1/GameSummary.tsx`** (New - 2025-12-31)
- Displays comprehensive game summary with all questions and player performance
- Shows player statistics with scores, questions passed/failed counts
- Displays all questions with:
  - Question text, image, category
  - All options with correct answer highlighted in green
  - Each player's answer for each question
  - Correct/incorrect indicators per player
- Winner highlighting with trophy icon
- "Play Again" and "Go Home" navigation buttons

### Constants & Configuration

**`src/lib/constants/game.ts`**
- `ROUND_DURATION_MS = 10000` (10 seconds) - Single source of truth for round duration
- `PROGRESS_UPDATE_INTERVAL_MS = 100` - Progress bar update frequency

## Game Flow

1. **Game Creation**: 
   - Player joins game
   - Total rounds are capped at available question count
   - `usedQuestionIds` array initialized

2. **Game Start**:
   - Unused question selected randomly
   - Options randomized
   - Correct answer index updated
   - Question marked as used
   - Timer starts (10 seconds)

3. **During Round**:
   - Countdown timer displays remaining seconds
   - Progress bar shows visual progress
   - Players can select answers until time expires
   - Time expiration disables answer selection

4. **Round Results**:
   - Selected answers are preserved
   - Correct/incorrect status shown
   - Scores calculated based on randomized correct answer
   - Last round detection triggers game end

5. **Next Round**:
   - Another unused question selected
   - Options randomized again
   - Process repeats until all questions used or rounds complete

6. **Game Finished**:
   - Final scores displayed
   - Winner highlighted
   - Game marked as finished
   - No further rounds possible

## Reconnection Handling

- On page refresh during active round:
  - Server sends current question with `roundStartTime` and `roundDuration`
  - Client calculates remaining time
  - Progress bar and countdown sync correctly
  - If time expired, timer stops and answers disabled
  - Client automatically requests results if not received within 1 second
  - Last round expiration immediately shows game finished summary

## Automatic Result Management

- **Timer-based sending**: Server starts a timer when each round begins
- **Automatic expiration**: When timer expires, server automatically calculates and sends results
- **Early completion**: If all players answer before time expires, timer is stopped and results sent immediately
- **Client fallback**: If client doesn't receive results automatically, it requests them after 1 second
- **Last round handling**: Expired last round triggers `game_finished` instead of `round_results`

## Answer Verification

- Original question has `correctAnswer: 0` (first option)
- After randomization, options shuffled: `["Jupiter", "Mars", "Venus", "Saturn"]`
- Correct answer index updated to match new position (e.g., `correctAnswer: 1`)
- Player answers are checked against the new randomized index
- Scoring works correctly regardless of option order
- **Security**: `correctAnswer` is never sent to clients until after they submit their answer
- Clients only receive `correctAnswer` in `round_results` message after answers are submitted

## Database Structure

Current questions in `server/db.ts`: **30 questions** across multiple categories
- **Science** (9 questions): Planets, chemistry, physics, biology, animals
- **Geography** (8 questions): Countries, capitals, oceans, rivers, deserts
- **Art** (2 questions): Famous paintings and artists
- **History** (2 questions): World War II, inventions
- **Literature** (1 question): Shakespeare
- **Sports** (1 question): Basketball
- **Math** (2 questions): Geometry, prime numbers
- **Food** (1 question): Guacamole
- **Entertainment** (1 question): Academy Awards
- **Other** (3 questions): Mixed topics

**Note**: The game automatically limits rounds to the number of available questions (currently 30).

## Future Improvements

- Add more questions to the database
- Implement question categories filtering
- Add difficulty levels
- Implement question shuffling across multiple games
- Add question statistics tracking

