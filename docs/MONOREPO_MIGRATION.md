# Monorepo Migration Guide

This document outlines the migration from a single Next.js app with Express server to a monorepo structure with NestJS backend and Next.js frontend.

## Structure

```
entarat-FE/
├── apps/
│   ├── web/          # Next.js frontend (moved from root)
│   └── server/       # NestJS backend
├── packages/
│   └── shared/       # Shared types and utilities
└── pnpm-workspace.yaml
```

## Setup Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build Shared Package

```bash
cd packages/shared
pnpm build
```

### 3. Start Development

**Terminal 1 - NestJS Server:**
```bash
cd apps/server
pnpm start:dev
```

**Terminal 2 - Next.js Frontend:**
```bash
cd apps/web
pnpm dev
```

## Next Steps

1. **Complete NestJS Migration:**
   - Migrate `server/websocket.ts` to `apps/server/src/game/game.gateway.ts`
   - Migrate `server/round-timer.ts` to `apps/server/src/game/round-timer.service.ts`
   - Migrate `server/utils.ts` to `apps/server/src/game/utils.ts`

2. **Create Next.js API Routes:**
   - Create `/apps/web/src/app/api/ws/route.ts` to proxy WebSocket connections
   - Create `/apps/web/src/app/api/games/route.ts` for game endpoints

3. **Update Frontend:**
   - Update WebSocket connections to use Next.js API routes instead of direct server connection
   - Update all API calls to use Next.js server actions/API routes

4. **Environment Variables:**
   - Add `NEXT_PUBLIC_API_URL` for frontend
   - Add `NESTJS_SERVER_URL` for Next.js API routes (internal)

## Benefits

- **Security**: Backend URL not exposed to client
- **Type Safety**: Shared types between frontend and backend
- **Scalability**: Independent deployment of frontend and backend
- **Maintainability**: Clear separation of concerns

