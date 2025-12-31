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
		GameService,
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
		{
			provide: GameGateway,
			useFactory: (
				databaseService: DatabaseService,
				gameService: GameService,
				roundTimerService: RoundTimerService,
			) => {
				return new GameGateway(databaseService, gameService, roundTimerService);
			},
			inject: [
				DatabaseService,
				forwardRef(() => GameService) as any,
				RoundTimerService,
			],
		},
	],
	exports: [GameService, RoundTimerService],
})
export class GameModule {}
