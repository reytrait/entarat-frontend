#!/bin/bash

# Migration script to move Next.js app to apps/web

echo "🚀 Starting monorepo migration..."

# Create apps/web directory if it doesn't exist
mkdir -p apps/web

# Move Next.js files to apps/web (excluding node_modules, .next, etc.)
echo "📦 Moving Next.js app to apps/web..."

# Copy essential files
cp -r src apps/web/ 2>/dev/null || true
cp -r public apps/web/ 2>/dev/null || true
cp next.config.ts apps/web/ 2>/dev/null || true
cp next-env.d.ts apps/web/ 2>/dev/null || true
cp tsconfig.json apps/web/ 2>/dev/null || true
cp postcss.config.mjs apps/web/ 2>/dev/null || true
cp components.json apps/web/ 2>/dev/null || true
cp biome.json apps/web/ 2>/dev/null || true

# Create package.json for apps/web
cat > apps/web/package.json << 'EOF'
{
  "name": "@entarat/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check",
    "format": "biome format --write"
  },
  "dependencies": {
    "@entarat/shared": "workspace:*",
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-slot": "^1.2.4",
    "@splidejs/react-splide": "^0.7.12",
    "@splidejs/splide": "^4.1.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.562.0",
    "next": "16.1.1",
    "qrcode.react": "^4.2.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-hook-form": "^7.69.0",
    "tailwind-merge": "^3.4.0",
    "zod": "^4.2.1"
  },
  "devDependencies": {
    "@biomejs/biome": "2.2.0",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5"
  }
}
EOF

echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Run: pnpm install"
echo "2. Run: cd packages/shared && pnpm build"
echo "3. Complete NestJS server migration (see MONOREPO_MIGRATION.md)"
echo "4. Create Next.js API routes to proxy to NestJS"

