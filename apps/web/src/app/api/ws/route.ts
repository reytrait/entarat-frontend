/**
 * Next.js API route to proxy WebSocket connections to NestJS server
 * This keeps the NestJS server URL hidden from the client
 */

import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  // This is a placeholder - WebSocket proxying in Next.js requires a custom server
  // For now, we'll use a different approach with a WebSocket upgrade handler
  
  return new Response("WebSocket endpoint - use /api/ws/upgrade", {
    status: 200,
  });
}

// Note: Full WebSocket proxying requires a custom Next.js server
// Alternative: Use Next.js API routes for HTTP endpoints and direct WebSocket to NestJS
// with environment variable for the URL (not exposed in client bundle)

