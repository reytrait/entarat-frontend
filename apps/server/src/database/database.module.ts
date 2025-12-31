import { Module } from "@nestjs/common";
import { RedisModule } from "../redis/redis.module";
import { DatabaseService } from "./database.service";

@Module({
  imports: [RedisModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
