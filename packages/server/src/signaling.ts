import { WebSocket, WebSocketServer } from 'ws';
import { nanoid } from 'nanoid';
import type { ClientMessage, ServerMessage, Peer, SignalData } from '@p2p-rooms/shared';
import { MAX_ROOM_SIZE } from '@p2p-rooms/shared';
import { RoomManager } from './room.js';

interface ClientState {
  peerId: string;
  roomId: string | null;
  displayName: string | null;
}

export class SignalingServer {
  private wss: WebSocketServer;
  private roomManager: RoomManager;
  private clients: Map<WebSocket, ClientState> = new Map();

  constructor(port: number) {
    this.roomManager = new RoomManager();
    this.wss = new WebSocketServer({ port });

    this.wss.on('connection', (ws) => this.handleConnection(ws));
    this.wss.on('error', (error) => console.error('WebSocket server error:', error));

    console.log(`Signaling server running on ws://localhost:${port}`);
  }

  private handleConnection(ws: WebSocket): void {
    const clientState: ClientState = {
      peerId: nanoid(),
      roomId: null,
      displayName: null,
    };
    this.clients.set(ws, clientState);

    console.log(`Client connected: ${clientState.peerId}`);

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString()) as ClientMessage;
        this.handleMessage(ws, clientState, message);
      } catch (err) {
        console.error('Failed to parse message:', err);
        this.sendError(ws, 'Invalid message format');
      }
    });

    ws.on('close', () => {
      this.handleDisconnect(ws, clientState);
    });

    ws.on('error', (error) => {
      console.error(`Client error (${clientState.peerId}):`, error);
    });
  }

  private handleMessage(ws: WebSocket, state: ClientState, message: ClientMessage): void {
    switch (message.type) {
      case 'join':
        this.handleJoin(ws, state, message.roomId, message.displayName);
        break;
      case 'leave':
        this.handleLeave(ws, state);
        break;
      case 'signal':
        this.handleSignal(state, message.targetPeerId, message.signal);
        break;
      case 'chat':
        this.handleChat(state, message.content);
        break;
      case 'media-state':
        this.handleMediaState(state, message.isMuted, message.isCameraOff, message.isScreenSharing);
        break;
    }
  }

  private handleJoin(
    ws: WebSocket,
    state: ClientState,
    roomId: string,
    displayName: string
  ): void {
    // Leave current room if in one
    if (state.roomId) {
      this.handleLeave(ws, state);
    }

    const room = this.roomManager.getOrCreateRoom(roomId);

    // Check room capacity
    if (room.peers.size >= MAX_ROOM_SIZE) {
      this.sendError(ws, `Room is full (max ${MAX_ROOM_SIZE} participants)`);
      return;
    }

    state.roomId = roomId;
    state.displayName = displayName;

    const peer: Peer = {
      id: state.peerId,
      displayName,
      isMuted: false,
      isCameraOff: false,
      isScreenSharing: false,
    };

    // Get existing peers before adding new one
    const existingPeers = room.getPeersArray();

    // Add new peer to room
    room.addPeer(peer);

    console.log(`${displayName} (${state.peerId}) joined room ${roomId}`);

    // Send room state to the new peer
    this.send(ws, {
      type: 'joined',
      peerId: state.peerId,
      peers: existingPeers,
      chatHistory: room.chatHistory,
    });

    // Notify existing peers about the new peer
    this.broadcastToRoom(roomId, { type: 'peer-joined', peer }, state.peerId);
  }

  private handleLeave(ws: WebSocket, state: ClientState): void {
    if (!state.roomId) return;

    const room = this.roomManager.getRoom(state.roomId);
    if (room) {
      room.removePeer(state.peerId);
      console.log(`${state.displayName} (${state.peerId}) left room ${state.roomId}`);

      // Notify other peers
      this.broadcastToRoom(state.roomId, { type: 'peer-left', peerId: state.peerId });

      // Clean up empty rooms
      this.roomManager.removeRoomIfEmpty(state.roomId);
    }

    state.roomId = null;
    state.displayName = null;
  }

  private handleSignal(
    state: ClientState,
    targetPeerId: string,
    signal: SignalData
  ): void {
    if (!state.roomId) return;

    // Find target peer's WebSocket
    for (const [targetWs, targetState] of this.clients) {
      if (targetState.peerId === targetPeerId && targetState.roomId === state.roomId) {
        this.send(targetWs, {
          type: 'signal',
          fromPeerId: state.peerId,
          signal,
        });
        break;
      }
    }
  }

  private handleChat(state: ClientState, content: string): void {
    if (!state.roomId || !state.displayName) return;

    const room = this.roomManager.getRoom(state.roomId);
    if (!room) return;

    const message = room.addChatMessage(state.peerId, state.displayName, content);

    // Broadcast to all peers in the room (including sender)
    this.broadcastToRoom(state.roomId, { type: 'chat', message });
  }

  private handleMediaState(
    state: ClientState,
    isMuted: boolean,
    isCameraOff: boolean,
    isScreenSharing: boolean
  ): void {
    if (!state.roomId) return;

    const room = this.roomManager.getRoom(state.roomId);
    if (!room) return;

    room.updatePeerMediaState(state.peerId, isMuted, isCameraOff, isScreenSharing);

    // Broadcast to other peers
    this.broadcastToRoom(
      state.roomId,
      {
        type: 'peer-media-state',
        peerId: state.peerId,
        isMuted,
        isCameraOff,
        isScreenSharing,
      },
      state.peerId
    );
  }

  private handleDisconnect(ws: WebSocket, state: ClientState): void {
    this.handleLeave(ws, state);
    this.clients.delete(ws);
    console.log(`Client disconnected: ${state.peerId}`);
  }

  private send(ws: WebSocket, message: ServerMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private sendError(ws: WebSocket, errorMessage: string): void {
    this.send(ws, { type: 'error', message: errorMessage });
  }

  private broadcastToRoom(roomId: string, message: ServerMessage, excludePeerId?: string): void {
    for (const [ws, state] of this.clients) {
      if (state.roomId === roomId && state.peerId !== excludePeerId) {
        this.send(ws, message);
      }
    }
  }

  close(): void {
    this.wss.close();
  }
}
