import { NestFactory } from "@nestjs/core";
import { WsAdapter } from "@nestjs/platform-ws";
import { WebSocketServer } from "ws";
import { AppModule } from "./app.module";
import { GameGateway } from "./game/game.gateway";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable WebSocket adapter
  app.useWebSocketAdapter(new WsAdapter(app));

  // Enable CORS for Next.js frontend
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const port = process.env.PORT || 3001;
  const httpServer = await app.listen(port);

  // Manually create WebSocket server and attach it to GameGateway
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws",
  });

  const gameGateway = app.get(GameGateway);
  gameGateway.setServer(wss);

  console.log(`🚀 NestJS server is running on: http://localhost:${port}`);
  console.log(`📡 CORS enabled for: ${frontendUrl}`);
  console.log(`🔌 WebSocket server ready at ws://localhost:${port}/ws`);
  console.log(`   Connect to: ws://localhost:${port}/ws`);
}
bootstrap();
