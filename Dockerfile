# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/server/package.json ./packages/server/
COPY packages/client/package.json ./packages/client/

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY packages/server ./packages/server
COPY packages/client ./packages/client

# Build all packages
RUN pnpm build

# Production stage for server
FROM node:20-alpine AS server

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy built server and shared packages
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/server/package.json ./packages/server/

# Copy workspace files for production install
COPY package.json pnpm-workspace.yaml ./

# Install production dependencies only
RUN pnpm install --prod --filter @p2p-rooms/server --filter @p2p-rooms/shared

EXPOSE 3001

WORKDIR /app/packages/server
CMD ["node", "dist/index.js"]

# Production stage for client (static files served by nginx)
FROM nginx:alpine AS client

# Copy built client files
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
