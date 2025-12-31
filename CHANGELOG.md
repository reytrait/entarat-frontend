# Changelog

This document tracks all major changes and features implemented in the Entarat trivia game application.

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
- **Round duration management**: Centralized round duration constant (30 seconds default)

## Technical Implementation

### Server-Side Changes

#### New Files
- `server/utils.ts`: Utility functions for question randomization and selection
  - `randomizeQuestionOptions()`: Shuffles options and updates correct answer index
  - `getUnusedQuestion()`: Selects unused questions to prevent repeats

#### Modified Files

**`server/types.ts`**
- Added `usedQuestionIds: number[]` to `Game` type to track used questions
- Added `roundDuration: number` to track round duration

**`server/websocket.ts`**
- Implemented question randomization on `start_game` and `next_round`
- Added question tracking to prevent repeats
- Enforced round limit based on available questions
- Updated scoring to use randomized question's correct answer index
- Added round timestamp tracking for reconnection support

**`server/db.ts`**
- Contains question database (currently 3 sample questions)
- Questions include: id, question text, image path, options array, correctAnswer index, category

### Client-Side Changes

#### Modified Files

**`src/app/game/games/TriviaGame1/types.ts`**
- Added `isFinished?: boolean` to `GameState`
- Added `finalScores?: Array<{player: Player | undefined; score: number}>`
- Added `timeExpired?: boolean` to track time expiration

**`src/app/game/games/TriviaGame1/useTriviaGame.ts`**
- Added `remainingTime` state to track countdown in seconds
- Updated `startProgressTimer()` to calculate and update remaining time
- Added time expiration detection and handling
- Updated `handleAnswerSelect()` to prevent selection when time expired
- Added `game_finished` handler to store final scores
- Updated `round_results` handler to detect last round

**`src/app/game/games/TriviaGame1/index.tsx`**
- Added `GameFinished` component rendering when game is complete
- Passes `remainingTime` to `GameArea` component

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

### Constants & Configuration

**`src/lib/constants/game.ts`**
- `ROUND_DURATION_MS = 30000` (30 seconds) - Single source of truth for round duration
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
   - Timer starts (30 seconds)

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

## Answer Verification

- Original question has `correctAnswer: 0` (first option)
- After randomization, options shuffled: `["Jupiter", "Mars", "Venus", "Saturn"]`
- Correct answer index updated to match new position (e.g., `correctAnswer: 1`)
- Player answers are checked against the new randomized index
- Scoring works correctly regardless of option order

## Database Structure

Current questions in `server/db.ts`:
1. Science: "Which planet is known as the Red Planet?" (Mars)
2. Geography: "What is the largest ocean on Earth?" (Pacific)
3. Art: "Who painted the Mona Lisa?" (Da Vinci)

**Note**: The game automatically limits rounds to the number of available questions (currently 3).

## Future Improvements

- Add more questions to the database
- Implement question categories filtering
- Add difficulty levels
- Implement question shuffling across multiple games
- Add question statistics tracking

