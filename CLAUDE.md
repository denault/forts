# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm install          # Install all dependencies
pnpm dev              # Run server (port 3001) and client (port 3000) in parallel
pnpm dev:server       # Run only the signaling server
pnpm dev:client       # Run only the React client
pnpm build            # Build all packages (shared → server/client)
pnpm lint             # ESLint check
pnpm format           # Prettier format
```

Docker deployment:
```bash
docker compose up     # Production: server on 3001, nginx on 80
```

## Architecture Overview

This is a P2P video chat application using a **mesh WebRTC topology** (direct peer connections, 2-6 participants). The signaling server only relays connection metadata; actual media flows peer-to-peer.

### Monorepo Structure (pnpm workspaces)

- **`@p2p-rooms/shared`** - TypeScript types shared between server and client
- **`@p2p-rooms/server`** - WebSocket signaling server (Node.js + ws)
- **`@p2p-rooms/client`** - React frontend (Vite + Tailwind + Zustand)

### Data Flow

1. Client connects to signaling server via WebSocket
2. On room join, server assigns peer ID and returns existing peer list
3. New peer initiates WebRTC connections to all existing peers (via `simple-peer`)
4. WebRTC signals (SDP/ICE) are relayed through signaling server
5. Once connected, media streams flow directly between peers

### Key Abstractions

**Signaling Protocol** (`packages/shared/src/signaling.ts`):
- `ClientMessage`: join, leave, signal, chat, media-state
- `ServerMessage`: joined, peer-joined, peer-left, signal, chat, peer-media-state, error

**MeshTransport** (`packages/client/src/lib/mediaTransport.ts`):
- Manages all peer connections using simple-peer
- Designed for future SFU replacement without client component changes

**State Management** (Zustand stores in `packages/client/src/stores/`):
- `roomStore`: Room membership, peer list, connection status
- `chatStore`: Chat messages, unread count
- `mediaStore`: Local media state (muted, camera off, screen sharing)

### Room URLs

Format: `/r/{room-id}` - Rooms are created on first join, destroyed when empty.
