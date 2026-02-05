# Build stage
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/server/package.json ./packages/server/

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY packages/server ./packages/server

# Build
RUN pnpm --filter @p2p-rooms/shared build && pnpm --filter @p2p-rooms/server build

# Production stage
FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/server/package.json ./packages/server/

COPY package.json pnpm-workspace.yaml ./

RUN pnpm install --prod --filter @p2p-rooms/server --filter @p2p-rooms/shared

EXPOSE 3001

WORKDIR /app/packages/server
CMD ["node", "dist/index.js"]
