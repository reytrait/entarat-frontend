import { Controller, Get, Param } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Controller("api")
export class GameController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get("questions")
  getQuestions() {
    return this.databaseService.questions;
  }

  @Get("games/:gameId")
  async getGame(@Param("gameId") gameId: string) {
    const game = await this.databaseService.getGame(gameId);
    if (!game) {
      return { error: "Game not found" };
    }

    const players = [];
    for (const id of game.playerIds) {
      const player = await this.databaseService.getPlayer(id);
      if (player) {
        players.push(player);
      }
    }

    return {
      ...game,
      players,
    };
  }
}

