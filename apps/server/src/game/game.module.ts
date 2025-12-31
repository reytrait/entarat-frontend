import { Module, forwardRef, Inject } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { DatabaseService } from "../database/database.service";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";
import { GameUtilsService } from "./game-utils.service";
import { RoundTimerService } from "./round-timer.service";

@Module({
  imports: [DatabaseModule],
  controllers: [GameController],
  providers: [
    GameGateway,
    GameService,
    GameUtilsService,
    {
      provide: RoundTimerService,
      useFactory: (
        databaseService: DatabaseService,
        gameService: GameService,
      ) => {
        return new RoundTimerService(databaseService, gameService);
      },
      inject: [DatabaseService, forwardRef(() => GameService)],
    },
  ],
  exports: [GameService, RoundTimerService],
})
export class GameModule {}
