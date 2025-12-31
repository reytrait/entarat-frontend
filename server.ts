import { createServer, type IncomingMessage, type ServerResponse } from "http";
import next from "next";
import { parse } from "url";
import { WebSocketServer } from "ws";
import { handleApiRoutes } from "./server/api";
import { handleWebSocketConnection } from "./server/websocket";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || "", true);

    // Handle API routes before Next.js
    const handled = handleApiRoutes(req, res, parsedUrl);
    if (handled) {
      return;
    }

    // Let Next.js handle all other routes
    handle(req, res, parsedUrl);
  });

  // WebSocket server
  const wss = new WebSocketServer({ server, path: "/ws" });

  // WebSocket connection handler
  wss.on("connection", (ws, req) => {
    handleWebSocketConnection(ws, req);
  });

  server.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`,
    );
    console.log(`> WebSocket server ready at ws://localhost:${port}/ws`);
  });
});
