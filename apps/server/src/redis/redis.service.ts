import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import Redis from "ioredis";
import type { Game, Player } from "../types/game";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private subscriber: Redis | null = null;
  private publisher: Redis | null = null;

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    
    try {
      // Main client for general operations
      this.client = new Redis(redisUrl, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });

      // Subscriber for pub/sub (if needed for multi-instance deployments)
      this.subscriber = new Redis(redisUrl);
      
      // Publisher for pub/sub
      this.publisher = new Redis(redisUrl);

      this.client.on("connect", () => {
        this.logger.log("✅ Redis connected");
      });

      this.client.on("error", (error) => {
        this.logger.error("❌ Redis error:", error);
      });

      // Test connection
      await this.client.ping();
      this.logger.log("✅ Redis connection verified");
    } catch (error) {
      this.logger.error("❌ Failed to connect to Redis:", error);
      this.logger.warn("⚠️  Continuing without Redis - using in-memory storage only");
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
    if (this.subscriber) {
      await this.subscriber.quit();
    }
    if (this.publisher) {
      await this.publisher.quit();
    }
  }

  /**
   * Check if Redis is available
   */
  isAvailable(): boolean {
    return this.client?.status === "ready";
  }

  /**
   * Get a value from Redis
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) return null;
    
    try {
      const value = await this.client!.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a value in Redis with optional expiration
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    if (!this.isAvailable()) return false;
    
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client!.setex(key, ttlSeconds, serialized);
      } else {
        await this.client!.set(key, serialized);
      }
      return true;
    } catch (error) {
      this.logger.error(`Error setting key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete a key from Redis
   */
  async del(key: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    
    try {
      await this.client!.del(key);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    
    try {
      const result = await this.client!.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set expiration on a key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.isAvailable()) return false;
    
    try {
      await this.client!.expire(key, seconds);
      return true;
    } catch (error) {
      this.logger.error(`Error setting expiration on key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get all keys matching a pattern
   */
  async keys(pattern: string): Promise<string[]> {
    if (!this.isAvailable()) return [];
    
    try {
      return await this.client!.keys(pattern);
    } catch (error) {
      this.logger.error(`Error getting keys with pattern ${pattern}:`, error);
      return [];
    }
  }

  /**
   * Cache game state
   */
  async cacheGame(gameId: string, game: Game, ttlSeconds: number = 3600): Promise<boolean> {
    return this.set(`game:${gameId}`, game, ttlSeconds);
  }

  /**
   * Get cached game state
   */
  async getCachedGame(gameId: string): Promise<Game | null> {
    return this.get<Game>(`game:${gameId}`);
  }

  /**
   * Cache player data
   */
  async cachePlayer(playerId: string, player: Player, ttlSeconds: number = 3600): Promise<boolean> {
    return this.set(`player:${playerId}`, player, ttlSeconds);
  }

  /**
   * Get cached player data
   */
  async getCachedPlayer(playerId: string): Promise<Player | null> {
    return this.get<Player>(`player:${playerId}`);
  }

  /**
   * Cache round data
   */
  async cacheRound(gameId: string, round: number, roundData: any, ttlSeconds: number = 3600): Promise<boolean> {
    return this.set(`round:${gameId}:${round}`, roundData, ttlSeconds);
  }

  /**
   * Get cached round data
   */
  async getCachedRound(gameId: string, round: number): Promise<any | null> {
    return this.get(`round:${gameId}:${round}`);
  }

  /**
   * Invalidate all game-related cache
   */
  async invalidateGameCache(gameId: string): Promise<void> {
    if (!this.isAvailable()) return;
    
    try {
      const keys = await this.keys(`*:${gameId}*`);
      if (keys.length > 0) {
        await this.client!.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Error invalidating cache for game ${gameId}:`, error);
    }
  }

  /**
   * Publish a message to a channel (for multi-instance deployments)
   */
  async publish(channel: string, message: any): Promise<number> {
    if (!this.isAvailable() || !this.publisher) return 0;
    
    try {
      return await this.publisher.publish(channel, JSON.stringify(message));
    } catch (error) {
      this.logger.error(`Error publishing to channel ${channel}:`, error);
      return 0;
    }
  }

  /**
   * Subscribe to a channel (for multi-instance deployments)
   */
  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    if (!this.isAvailable() || !this.subscriber) return;
    
    try {
      await this.subscriber.subscribe(channel);
      this.subscriber.on("message", (ch, msg) => {
        if (ch === channel) {
          try {
            callback(JSON.parse(msg));
          } catch (error) {
            this.logger.error(`Error parsing message from channel ${channel}:`, error);
          }
        }
      });
    } catch (error) {
      this.logger.error(`Error subscribing to channel ${channel}:`, error);
    }
  }
}

