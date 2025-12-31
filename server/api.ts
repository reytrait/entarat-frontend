import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { db } from "./db";

export function handleApiRoutes(
  req: IncomingMessage,
  res: ServerResponse,
  parsedUrl: ReturnType<typeof parse>,
): boolean {
  // Only handle /api routes
  if (!parsedUrl.pathname?.startsWith("/api/")) {
    return false;
  }

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return true;
  }

  // Handle /api/questions
  if (parsedUrl.pathname === "/api/questions") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(db.questions));
    return true;
  }

  // Handle /api/games/:gameId
  if (parsedUrl.pathname?.match(/^\/api\/games\/(.+)$/)) {
    const gameId = parsedUrl.pathname.split("/")[3];
    const game = db.games.get(gameId);
    if (!game) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Game not found" }));
      return true;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        ...game,
        players: game.playerIds.map((id) => db.players.get(id)),
      }),
    );
    return true;
  }

  return false;
}

