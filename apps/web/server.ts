// import { createServer } from "node:http";
// import { parse } from "node:url";
// import next from "next";
// import { WebSocket, WebSocketServer } from "ws";
// import { WSMsgType } from "./src/types/game";

// const dev = process.env.NODE_ENV !== "production";
// const hostname = process.env.HOSTNAME || "localhost";
// const port = parseInt(process.env.PORT || "3000", 10);

// // Backend WebSocket URL from environment variable (server-side only, not exposed to client)
// // Use WS_URL for server-side, fallback to NEXT_PUBLIC_WS_URL for compatibility
// const BACKEND_WS_URL =
//   process.env.WS_URL ||
//   process.env.NEXT_PUBLIC_WS_URL ||
//   "ws://localhost:3001/ws";

// const app = next({ dev, hostname, port });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = createServer(async (req, res) => {
//     try {
//       const parsedUrl = parse(req.url || "", true);
//       await handle(req, res, parsedUrl);
//     } catch (err) {
//       console.error("Error occurred handling", req.url, err);
//       res.statusCode = 500;
//       res.end("internal server error");
//     }
//   });

//   // Create WebSocket server for proxying
//   const wss = new WebSocketServer({ noServer: true });

//   // Handle WebSocket upgrade requests
//   server.on("upgrade", (request, socket, head) => {
//     const { pathname } = parse(request.url || "");

//     // Proxy WebSocket connections from /api/ws to backend
//     if (pathname === "/api/ws") {
//       wss.handleUpgrade(request, socket, head, (ws) => {
//         // Connect to backend WebSocket server
//         const backendWs = new WebSocket(BACKEND_WS_URL);
//         let backendConnected = false;

//         // Forward messages from client to backend (only when backend is connected)
//         ws.on("message", (data) => {
//           if (backendConnected && backendWs.readyState === WebSocket.OPEN) {
//             backendWs.send(data);
//           } else {
//             // Backend not ready, queue or reject
//             ws.send(
//               JSON.stringify({
//                 type: WSMsgType.ERROR,
//                 message: "Backend connection not ready",
//               }),
//             );
//           }
//         });

//         // Forward messages from backend to client
//         backendWs.on("message", (data) => {
//           if (ws.readyState === WebSocket.OPEN) {
//             ws.send(data);
//           }
//         });

//         // Handle connection errors
//         ws.on("error", (error) => {
//           console.error("Client WebSocket error:", error);
//           if (
//             backendWs.readyState === WebSocket.OPEN ||
//             backendWs.readyState === WebSocket.CONNECTING
//           ) {
//             backendWs.close();
//           }
//         });

//         backendWs.on("error", (error: Error) => {
//           // Only log if not already connected (to reduce noise)
//           if (!backendConnected) {
//             console.error("Backend WebSocket connection error:", error.message);
//           }
//           if (ws.readyState === WebSocket.OPEN) {
//             ws.send(
//               JSON.stringify({
//                 type: WSMsgType.ERROR,
//                 message: "Failed to connect to game server",
//               }),
//             );
//             ws.close();
//           }
//         });

//         // Handle disconnections
//         ws.on("close", () => {
//           if (
//             backendWs.readyState === WebSocket.OPEN ||
//             backendWs.readyState === WebSocket.CONNECTING
//           ) {
//             backendWs.close();
//           }
//         });

//         backendWs.on("close", () => {
//           backendConnected = false;
//           if (ws.readyState === WebSocket.OPEN) {
//             ws.close();
//           }
//         });

//         // Forward connection status
//         backendWs.on("open", () => {
//           backendConnected = true;
//           console.log("✅ WebSocket proxy connected to backend");

//           // Send connection confirmation to client
//           const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
//           const connectionMessage = JSON.stringify({
//             type: WSMsgType.SOCKET_CONNECTED,
//             connectionId,
//             timestamp: Date.now(),
//           });

//           if (ws.readyState === WebSocket.OPEN) {
//             ws.send(connectionMessage);
//           }
//         });
//       });
//     } else {
//       // Reject non-proxy WebSocket connections
//       socket.destroy();
//     }
//   });

//   server
//     .once("error", (err) => {
//       console.error(err);
//       process.exit(1);
//     })
//     .listen(port, () => {
//       console.log(`> Ready on http://${hostname}:${port}`);
//       console.log(
//         `> WebSocket proxy available at ws://${hostname}:${port}/api/ws`,
//       );
//       console.log(`> Proxying to backend: ${BACKEND_WS_URL}`);
//     });
// });
