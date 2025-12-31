# Entarat - Trivia Game Platform

A modern trivia game platform built with Next.js frontend and NestJS backend in a monorepo structure.

## 🏗️ Project Structure

```
entarat-FE/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── server/       # NestJS backend server
├── packages/
│   └── shared/       # Shared TypeScript types and utilities
└── pnpm-workspace.yaml
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Build shared package
pnpm build:shared
```

### Development

```bash
# Start both frontend and backend
pnpm dev

# Or start separately
pnpm dev:web      # Next.js frontend (port 3000)
pnpm dev:server   # NestJS backend (port 3001)
```

### Environment Setup

1. **Frontend** (`apps/web/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_WS_URL=ws://localhost:3001
   ```

2. **Backend** (`apps/server/.env`):
   ```env
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

Copy the example files:
```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/server/.env.example apps/server/.env
```

## 📦 Build

```bash
# Build all packages
pnpm build

# Or build individually
pnpm build:shared
pnpm build:server
pnpm build:web
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:
- AWS EC2 deployment
- Vercel deployment
- Docker deployment
- Environment configuration
- SSL/HTTPS setup

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [MONOREPO_MIGRATION.md](./MONOREPO_MIGRATION.md) - Migration details
- [CHANGELOG.md](./CHANGELOG.md) - Change history

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: NestJS, WebSocket
- **Package Manager**: pnpm
- **Monorepo**: pnpm workspaces

## 📝 Scripts

- `pnpm dev` - Start both frontend and backend in development
- `pnpm build` - Build all packages
- `pnpm start` - Start production servers
- `pnpm lint` - Lint code
- `pnpm format` - Format code

## 🔒 Security

- Backend URL is not exposed to client (uses Next.js API routes)
- Environment variables for sensitive configuration
- CORS configured for frontend domain only

## 📄 License

Private - All rights reserved
