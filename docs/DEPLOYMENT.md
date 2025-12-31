# Deployment Guide

This guide covers deploying the Entarat monorepo application, including separate deployment of the NestJS backend server and Next.js frontend.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Building for Production](#building-for-production)
3. [Deploying Backend to AWS EC2](#deploying-backend-to-aws-ec2)
4. [Deploying Frontend](#deploying-frontend)
5. [Environment Configuration](#environment-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

- Node.js 20+ and pnpm installed
- Git

### Setup Steps

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd entarat-FE
   pnpm install
   ```

2. **Build shared package:**
   ```bash
   cd packages/shared
   pnpm build
   cd ../..
   ```

3. **Set up environment variables:**
   ```bash
   # Copy example files
   cp apps/web/.env.example apps/web/.env.local
   cp apps/server/.env.example apps/server/.env
   
   # Edit the files with your local URLs
   ```

4. **Start development servers:**
   ```bash
   # Terminal 1: Start NestJS server
   pnpm dev:server
   
   # Terminal 2: Start Next.js frontend
   pnpm dev:web
   ```

   Or use the combined command:
   ```bash
   pnpm dev
   ```

---

## Building for Production

### Build All Packages

```bash
# Build shared package first
pnpm build:shared

# Build backend
pnpm build:server

# Build frontend
pnpm build:web
```

Or build everything:
```bash
pnpm build
```

### Build Outputs

- **Shared Package**: `packages/shared/dist/`
- **NestJS Server**: `apps/server/dist/`
- **Next.js Frontend**: `apps/web/.next/`

---

## Deploying Backend to AWS EC2

This section covers deploying the NestJS server to an AWS EC2 instance.

### Prerequisites

- AWS account with EC2 access
- SSH key pair
- Domain name (optional, for custom domain)

### Step 1: Launch EC2 Instance

1. **Go to AWS Console → EC2 → Launch Instance**

2. **Configure Instance:**
   - **Name**: `entarat-backend-server`
   - **AMI**: Ubuntu 22.04 LTS (or Amazon Linux 2023)
   - **Instance Type**: t3.small or t3.medium (minimum 2GB RAM)
   - **Key Pair**: Create or select an existing key pair
   - **Network Settings**: 
     - Allow HTTP (port 80)
     - Allow HTTPS (port 443)
     - Allow Custom TCP (port 3001) - for your NestJS server
     - Allow WebSocket (port 3001) - same as above
   - **Storage**: 20GB minimum

3. **Launch Instance**

### Step 2: Connect to EC2 Instance

```bash
# Replace with your key file and instance IP
ssh -i your-key.pem ubuntu@your-ec2-ip-address
```

### Step 3: Install Dependencies on EC2

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx (for reverse proxy)
sudo apt install -y nginx

# Install Redis (for caching)
sudo apt install -y redis-server

# Start and enable Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify Redis is running
redis-cli ping  # Should return "PONG"
```

### Step 4: Clone and Build Application

```bash
# Clone repository
git clone <your-repository-url>
cd entarat-FE

# Install dependencies
pnpm install

# Build shared package
cd packages/shared
pnpm build
cd ../..

# Build server
cd apps/server
pnpm build
cd ../..
```

### Step 5: Configure Environment Variables

```bash
cd apps/server
cp .env.example .env
nano .env
```

Update `.env`:
```env
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

### Step 6: Set Up Nginx Reverse Proxy

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/entarat-backend
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-server-domain.com;  # Replace with your domain or use IP

    # WebSocket upgrade headers
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket endpoint
    location /ws {
        proxy_pass http://localhost:3001/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/entarat-backend /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### Step 7: Set Up SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-server-domain.com

# Certbot will automatically configure Nginx for HTTPS
```

### Step 8: Start Server with PM2

```bash
cd /path/to/entarat-FE/apps/server

# Start with PM2
pm2 start dist/main.js --name entarat-backend

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions provided
```

### Step 9: Configure Firewall

```bash
# Allow Nginx
sudo ufw allow 'Nginx Full'

# Allow SSH
sudo ufw allow ssh

# Enable firewall
sudo ufw enable
```

### Step 10: Update Security Group

In AWS Console → EC2 → Security Groups:
- Allow inbound traffic on port 80 (HTTP)
- Allow inbound traffic on port 443 (HTTPS)
- Allow inbound traffic on port 22 (SSH) - only from your IP

---

## Deploying Frontend

### Option 1: Vercel (Recommended for Next.js)

1. **Connect Repository:**
   - Go to [Vercel](https://vercel.com)
   - Import your Git repository
   - Select `apps/web` as the root directory

2. **Configure Build Settings:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm build:shared && pnpm build:web`
   - **Output Directory**: `.next`

3. **Set Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-server-domain.com
   NEXT_PUBLIC_WS_URL=wss://your-server-domain.com
   ```

4. **Deploy**

### Option 2: AWS EC2 (Same as Backend)

Follow similar steps as backend deployment, but:
- Use port 3000 for Next.js
- Update Nginx to proxy to Next.js
- Build command: `pnpm build:web`
- Start command: `pnpm start` (in apps/web)

### Option 3: Docker Deployment

Create `apps/web/Dockerfile`:
```dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app .
RUN cd packages/shared && pnpm build
RUN cd apps/web && pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/node_modules ./node_modules
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["pnpm", "start"]
```

Build and run:
```bash
docker build -t entarat-web -f apps/web/Dockerfile .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://your-server.com entarat-web
```

---

## Environment Configuration

### Backend (.env)

```env
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

### Frontend (.env.local or Vercel Environment Variables)

```env
NEXT_PUBLIC_API_URL=https://your-server-domain.com
NEXT_PUBLIC_WS_URL=wss://your-server-domain.com
PORT=3000
```

**Important Notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Use `wss://` (secure WebSocket) in production, not `ws://`
- Update CORS in backend to allow your frontend domain

---

## Separate Deployment Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend       │
│   (Vercel/EC2)  │────────▶│   (AWS EC2)      │
│   Port: 3000    │  HTTP   │   Port: 3001     │
│                 │  WebSocket│                 │
└─────────────────┘         └─────────────────┘
        │                            │
        │                            │
        ▼                            ▼
   https://app.com              https://api.com
```

### Benefits

- **Scalability**: Scale frontend and backend independently
- **Security**: Backend URL not exposed to client (via Next.js API routes)
- **Flexibility**: Deploy to different providers
- **Cost Optimization**: Use appropriate instance sizes for each service

---

## Troubleshooting

### Backend Issues

**Server not starting:**
```bash
# Check logs
pm2 logs entarat-backend

# Check if port is in use
sudo lsof -i :3001

# Restart server
pm2 restart entarat-backend
```

**WebSocket connection failed:**
- Ensure Nginx is configured for WebSocket upgrades
- Check security group allows port 443 (HTTPS)
- Verify `wss://` is used in production (not `ws://`)

### Frontend Issues

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf apps/web/.next
pnpm build:shared
pnpm build:web
```

**API calls failing:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings in backend
- Verify backend is accessible from frontend domain

### Network Issues

**Connection timeout:**
- Check security groups in AWS
- Verify firewall rules
- Check Nginx configuration

**SSL Certificate issues:**
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

---

## Monitoring and Maintenance

### PM2 Monitoring

```bash
# View process status
pm2 status

# View logs
pm2 logs entarat-backend

# Monitor resources
pm2 monit

# Restart on file changes (development)
pm2 start dist/main.js --watch --name entarat-backend
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### System Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js (if needed)
# Use nvm or reinstall from NodeSource
```

---

## Security Best Practices

1. **Use HTTPS/WSS**: Always use secure connections in production
2. **Environment Variables**: Never commit `.env` files
3. **Firewall**: Only open necessary ports
4. **SSH Keys**: Use SSH keys instead of passwords
5. **Regular Updates**: Keep system and dependencies updated
6. **Rate Limiting**: Implement rate limiting on API endpoints
7. **CORS**: Configure CORS to only allow your frontend domain

---

## Cost Optimization

### AWS EC2

- Use **Reserved Instances** for predictable workloads
- Use **Spot Instances** for development/testing
- Right-size instances based on actual usage
- Use **Auto Scaling** if traffic varies

### Vercel

- Free tier available for Next.js
- Pay-as-you-go for production
- Automatic CDN and edge functions

---

## Next Steps

1. Set up monitoring (e.g., CloudWatch, Sentry)
2. Implement CI/CD pipelines
3. Set up database (PostgreSQL, MongoDB)
4. Add Redis for caching/sessions
5. Implement backup strategies
6. Set up staging environment

