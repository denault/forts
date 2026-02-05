import type { Peer, ChatMessage } from './types.js';

// Signal data from simple-peer
export interface SignalData {
  type?: string;
  sdp?: string;
  candidate?: RTCIceCandidateInit;
}

// Client → Server messages
export type ClientMessage =
  | { type: 'join'; roomId: string; displayName: string }
  | { type: 'leave' }
  | { type: 'signal'; targetPeerId: string; signal: SignalData }
  | { type: 'chat'; content: string }
  | { type: 'media-state'; isMuted: boolean; isCameraOff: boolean; isScreenSharing: boolean };

// Server → Client messages
export type ServerMessage =
  | { type: 'joined'; peerId: string; peers: Peer[]; chatHistory: ChatMessage[] }
  | { type: 'peer-joined'; peer: Peer }
  | { type: 'peer-left'; peerId: string }
  | { type: 'signal'; fromPeerId: string; signal: SignalData }
  | { type: 'chat'; message: ChatMessage }
  | { type: 'peer-media-state'; peerId: string; isMuted: boolean; isCameraOff: boolean; isScreenSharing: boolean }
  | { type: 'error'; message: string };
