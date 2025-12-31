import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// Backend WebSocket URL from environment variable (server-side only, not exposed to client)
// Use WS_URL for server-side, fallback to NEXT_PUBLIC_WS_URL for compatibility
const BACKEND_WS_URL =
  process.env.WS_URL || process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/ws";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url || "", true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Create WebSocket server for proxying
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket upgrade requests
  server.on("upgrade", (request, socket, head) => {
    const { pathname } = parse(request.url || "");

    // Proxy WebSocket connections from /api/ws to backend
    if (pathname === "/api/ws") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        // Connect to backend WebSocket server
        const backendWs = new WebSocket(BACKEND_WS_URL);

        // Forward messages from client to backend
        ws.on("message", (data) => {
          if (backendWs.readyState === WebSocket.OPEN) {
            backendWs.send(data);
          }
        });

        // Forward messages from backend to client
        backendWs.on("message", (data) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
          }
        });

        // Handle connection errors
        ws.on("error", (error) => {
          console.error("Client WebSocket error:", error);
          backendWs.close();
        });

        backendWs.on("error", (error) => {
          console.error("Backend WebSocket error:", error);
          ws.close();
        });

        // Handle disconnections
        ws.on("close", () => {
          backendWs.close();
        });

        backendWs.on("close", () => {
          ws.close();
        });

        // Forward connection status
        backendWs.on("open", () => {
          console.log("✅ WebSocket proxy connected to backend");
        });
      });
    } else {
      // Reject non-proxy WebSocket connections
      socket.destroy();
    }
  });

  server
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> WebSocket proxy available at ws://${hostname}:${port}/api/ws`);
      console.log(`> Proxying to backend: ${BACKEND_WS_URL}`);
    });
});

