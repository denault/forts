import type { Peer, ChatMessage } from '@p2p-rooms/shared';
import { CHAT_HISTORY_LIMIT } from '@p2p-rooms/shared';
import { nanoid } from 'nanoid';

export class Room {
  public readonly id: string;
  public readonly peers: Map<string, Peer> = new Map();
  public readonly chatHistory: ChatMessage[] = [];
  public readonly createdAt: Date = new Date();

  constructor(id: string) {
    this.id = id;
  }

  addPeer(peer: Peer): void {
    this.peers.set(peer.id, peer);
  }

  removePeer(peerId: string): void {
    this.peers.delete(peerId);
  }

  getPeer(peerId: string): Peer | undefined {
    return this.peers.get(peerId);
  }

  updatePeerMediaState(
    peerId: string,
    isMuted: boolean,
    isCameraOff: boolean,
    isScreenSharing: boolean
  ): void {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.isMuted = isMuted;
      peer.isCameraOff = isCameraOff;
      peer.isScreenSharing = isScreenSharing;
    }
  }

  addChatMessage(peerId: string, displayName: string, content: string): ChatMessage {
    const message: ChatMessage = {
      id: nanoid(),
      peerId,
      displayName,
      content,
      timestamp: Date.now(),
    };
    this.chatHistory.push(message);

    // Limit chat history size
    if (this.chatHistory.length > CHAT_HISTORY_LIMIT) {
      this.chatHistory.shift();
    }

    return message;
  }

  getPeersArray(): Peer[] {
    return Array.from(this.peers.values());
  }

  isEmpty(): boolean {
    return this.peers.size === 0;
  }
}

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  getOrCreateRoom(roomId: string): Room {
    let room = this.rooms.get(roomId);
    if (!room) {
      room = new Room(roomId);
      this.rooms.set(roomId, room);
      console.log(`Room created: ${roomId}`);
    }
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  removeRoomIfEmpty(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room && room.isEmpty()) {
      this.rooms.delete(roomId);
      console.log(`Room deleted: ${roomId}`);
    }
  }

  getRoomCount(): number {
    return this.rooms.size;
  }
}
