import type { NextRequest } from "next/server";

// This route handler is for documentation purposes
// WebSocket proxying is handled by the custom server (server.ts)
export async function GET(_request: NextRequest) {
  return new Response("WebSocket proxy endpoint - use ws:// protocol", {
    status: 200,
  });
}
