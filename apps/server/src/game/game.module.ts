import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";
import { GameUtilsService } from "./game-utils.service";
import { RoundTimerService } from "./round-timer.service";

@Module({
  imports: [DatabaseModule],
  controllers: [GameController],
  providers: [GameUtilsService, GameService, RoundTimerService, GameGateway],
  exports: [GameService, RoundTimerService],
})
export class GameModule {}
