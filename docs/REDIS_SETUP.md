# Redis Setup for Game Caching

## Overview

Redis has been integrated into the NestJS server to provide fast caching for:
- **Game State**: Full game objects cached with 1-hour TTL
- **Player Data**: Player information cached with 1-hour TTL
- **Round Data**: Round-specific data (optional, can be enabled)

## Architecture

### Components Created

1. **`RedisService`** (`apps/server/src/redis/redis.service.ts`)
   - Handles all Redis operations
   - Provides caching methods for games, players, and rounds
   - Gracefully falls back to in-memory storage if Redis is unavailable
   - Supports pub/sub for multi-instance deployments

2. **`RedisModule`** (`apps/server/src/redis/redis.module.ts`)
   - Global module that exports RedisService
   - Available throughout the application

3. **Updated `DatabaseService`**
   - Now uses Redis for persistence
   - Maintains in-memory Maps for fast access
   - Automatically syncs with Redis on writes
   - Loads games from Redis on startup

## Installation

### 1. Install Dependencies

```bash
cd apps/server
pnpm install
```

This will install `ioredis` and `@types/ioredis`.

### 2. Install Redis Locally

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**Windows:**
```bash
# Use Docker
docker run -d -p 6379:6379 redis:alpine
```

### 3. Configure Environment Variables

Update `apps/server/.env`:
```env
REDIS_URL=redis://localhost:6379
# Optional:
# REDIS_PASSWORD=your-password
# REDIS_DB=0
```

### 4. Verify Redis Connection

```bash
redis-cli ping
# Should return: PONG
```

## Usage

### Cache Keys

- `game:{gameId}` - Full game state (1 hour TTL)
- `player:{playerId}` - Player information (1 hour TTL)
- `round:{gameId}:{roundNumber}` - Round-specific data (optional)

### Automatic Caching

The `DatabaseService` automatically:
- Caches games when created or updated
- Caches players when created or updated
- Loads games from Redis on server startup
- Falls back to in-memory if Redis is unavailable

### Manual Cache Operations

```typescript
// In any service that injects RedisService
constructor(private readonly redisService: RedisService) {}

// Cache a game
await this.redisService.cacheGame(gameId, game, 3600); // 1 hour TTL

// Get cached game
const cachedGame = await this.redisService.getCachedGame(gameId);

// Invalidate all game-related cache
await this.redisService.invalidateGameCache(gameId);
```

## Production Deployment

### Option 1: Redis on Same Server

Follow the installation steps in `DEPLOYMENT.md` which includes Redis setup.

### Option 2: AWS ElastiCache

1. Create ElastiCache Redis cluster in AWS Console
2. Configure security groups
3. Update environment variable:
   ```env
   REDIS_URL=redis://your-elasticache-endpoint:6379
   ```

### Option 3: Redis Cloud

1. Sign up at [Redis Cloud](https://redis.com/try-free/)
2. Create database
3. Get connection URL
4. Update environment variable:
   ```env
   REDIS_URL=redis://username:password@host:port
   ```

## Monitoring

### Check Redis Status

```bash
# Monitor commands in real-time
redis-cli MONITOR

# Check memory usage
redis-cli INFO memory

# List all keys (use with caution)
redis-cli KEYS "*"

# Get specific game
redis-cli GET "game:trivia-1"
```

### Application Logs

The RedisService logs connection status:
- `✅ Redis connected` - Successfully connected
- `✅ Redis connection verified` - Connection tested
- `❌ Redis error` - Connection error (falls back to in-memory)
- `⚠️  Continuing without Redis` - Redis unavailable, using in-memory only

## Benefits

1. **Performance**: Fast retrieval of game state
2. **Persistence**: Games survive server restarts (if configured)
3. **Scalability**: Multi-instance support with shared cache
4. **Memory Efficiency**: Reduces in-memory storage requirements
5. **Resilience**: Gracefully falls back if Redis is unavailable

## Troubleshooting

### Redis Not Connecting

1. Check if Redis is running:
   ```bash
   redis-cli ping
   ```

2. Check Redis logs:
   ```bash
   # Linux
   sudo tail -f /var/log/redis/redis-server.log
   
   # macOS
   tail -f /usr/local/var/log/redis.log
   ```

3. Verify connection URL in `.env`

4. Check firewall/security groups if using remote Redis

### High Memory Usage

1. Set memory limits in Redis config:
   ```conf
   maxmemory 256mb
   maxmemory-policy allkeys-lru
   ```

2. Reduce TTL values in code (currently 3600 seconds = 1 hour)

3. Implement cache eviction for old games

## Next Steps

1. **Install dependencies**: `pnpm install` in `apps/server`
2. **Start Redis**: Follow installation steps above
3. **Test connection**: Verify Redis is accessible
4. **Start server**: The app will automatically use Redis if available

The application will work with or without Redis - it gracefully falls back to in-memory storage if Redis is unavailable.

