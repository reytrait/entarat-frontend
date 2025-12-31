import { forwardRef, Module } from "@nestjs/common";
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
    GameUtilsService,
    // Regular provider - let NestJS handle the injection with forwardRef in constructor
    GameService,
    // RoundTimerService with forwardRef for GameService
    {
      provide: RoundTimerService,
      useFactory: (
        databaseService: DatabaseService,
        gameService: GameService,
      ) => {
        return new RoundTimerService(databaseService, gameService);
      },
      inject: [DatabaseService, forwardRef(() => GameService) as any],
    },
    // GameGateway with all dependencies
    {
      provide: GameGateway,
      useFactory: (
        databaseService: DatabaseService,
        gameService: GameService,
        roundTimerService: RoundTimerService,
      ) => {
        if (!roundTimerService) {
          console.error("❌ RoundTimerService is null in GameGateway factory!");
        }
        if (!gameService) {
          console.error("❌ GameService is null in GameGateway factory!");
        }
        if (!databaseService) {
          console.error("❌ DatabaseService is null in GameGateway factory!");
        }
        const gateway = new GameGateway(
          databaseService,
          gameService,
          roundTimerService,
        );
        console.log("✅ GameGateway factory created with:", {
          hasDatabaseService: !!databaseService,
          hasGameService: !!gameService,
          hasRoundTimerService: !!roundTimerService,
        });
        return gateway;
      },
      inject: [DatabaseService, GameService, RoundTimerService],
    },
  ],
  exports: [GameService, RoundTimerService],
})
export class GameModule {}