# Entarat Game Server

## Setup

The backend server is a custom Next.js server written in TypeScript (`server.ts`) that integrates both the Next.js app and WebSocket server.

### Installation

Dependencies are managed with **pnpm** in the root `package.json`. The server uses:
- **Next.js** - Custom server integration
- **WebSocket (ws)** - Real-time communication
- **TypeScript** - Type-safe server code
- **tsx** - TypeScript execution
- **In-memory database (Map)** - Temporary storage

### Running the Server

**Run the application:**
```bash
pnpm dev
```

This will start:
- Next.js app on `http://localhost:3000`
- WebSocket server on `ws://localhost:3000/ws`
- REST API endpoints on `http://localhost:3000/api/*`

**For production:**
```bash
pnpm build
pnpm start
```

**Note:** Make sure all dependencies are installed:
```bash
pnpm install
```

## API Endpoints

### REST API

- `GET /api/games/:gameId` - Get game state
- `GET /api/questions` - Get all questions

### WebSocket Events

#### Client → Server

- `join` - Join a game
  ```json
  {
    "type": "join",
    "gameId": "trivia-1",
    "playerId": "player-123",
    "name": "Player Name",
    "avatar": "/avatars/avatar-blue-square.svg",
    "totalRounds": 12
  }
  ```

- `start_game` - Start the game
  ```json
  {
    "type": "start_game",
    "gameId": "trivia-1"
  }
  ```

- `submit_answer` - Submit an answer
  ```json
  {
    "type": "submit_answer",
    "gameId": "trivia-1",
    "answer": 0
  }
  ```

- `next_round` - Move to next round
  ```json
  {
    "type": "next_round",
    "gameId": "trivia-1"
  }
  ```

#### Server → Client

- `game_state` - Current game state
- `player_joined` - Player joined notification
- `game_started` - Game started with first question
- `round_results` - Round results after all players answered
- `next_round` - Next round question
- `game_finished` - Game finished with final scores

## Database Structure

The server uses in-memory storage (Map objects):

- `db.games` - Active games
- `db.players` - Player information
- `db.questions` - Question bank

## Testing the Server

### 1. Testing REST API Endpoints

You can test the REST API using `curl` or any HTTP client:

**Get all questions:**
```bash
curl http://localhost:3000/api/questions
```

**Get game state:**
```bash
curl http://localhost:3000/api/games/trivia-1
```

### 2. Testing WebSocket Connection

#### Using Browser Console

1. Open your browser's developer console (F12)
2. Run this JavaScript code:

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:3000/ws');

// Listen for messages
ws.onopen = () => {
  console.log('Connected to WebSocket');
  
  // Join a game
  ws.send(JSON.stringify({
    type: 'join',
    gameId: 'trivia-1',
    playerId: 'test-player-1',
    name: 'Test Player',
    avatar: '/avatars/avatar-blue-square.svg',
    totalRounds: 12
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket closed');
};
```

#### Using wscat (Command Line Tool)

Install wscat:
```bash
pnpm add -g wscat
```

Connect and send messages:
```bash
# Connect to WebSocket
wscat -c ws://localhost:3000/ws

# Then send JSON messages:
{"type":"join","gameId":"trivia-1","playerId":"test-1","name":"Test","avatar":"/avatars/avatar-blue-square.svg","totalRounds":12}
{"type":"start_game","gameId":"trivia-1"}
{"type":"submit_answer","gameId":"trivia-1","answer":0}
{"type":"next_round","gameId":"trivia-1"}
```

### 3. Testing the Full Game Flow

1. **Start the server:**
   ```bash
   pnpm dev
   ```

2. **Open multiple browser tabs/windows** to simulate multiple players:
   - Tab 1: Navigate to `http://localhost:3000/lobby?gameId=test-game-1`
   - Tab 2: Navigate to `http://localhost:3000/join-game?gameId=test-game-1&invitedBy=Host`

3. **In the lobby:**
   - Click "Start Game" button
   - This will navigate to `/game` and trigger the game start

4. **In the game:**
   - Players should see the question
   - Select answers
   - See results when all players answer
   - Click "Next Round" to continue

### 4. Testing with Postman/Insomnia

**REST API:**
- Create a GET request to `http://localhost:3000/api/questions`
- Create a GET request to `http://localhost:3000/api/games/:gameId`

**WebSocket:**
- Use Postman's WebSocket feature or Insomnia's WebSocket support
- Connect to `ws://localhost:3000/ws`
- Send JSON messages as shown in the WebSocket Events section

### 5. Debugging

**Check server logs:**
The server logs all WebSocket connections and messages. Watch the terminal where `pnpm dev` is running.

**Browser DevTools:**
- Open Network tab → WS filter to see WebSocket connections
- Check Console for any WebSocket errors
- Use Application → Local Storage to check stored game state

## Notes

- The database is temporary and will reset on server restart
- For production, replace with a persistent database (PostgreSQL, MongoDB, etc.)
- WebSocket connections are managed per player
- Game state is synchronized across all players in real-time
- The server is written in TypeScript for type safety
- Use `tsx` to run the TypeScript server file directly
