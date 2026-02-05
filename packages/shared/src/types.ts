export interface Peer {
  id: string;
  displayName: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
}

export interface Room {
  id: string;
  peers: Map<string, Peer>;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  peerId: string;
  displayName: string;
  content: string;
  timestamp: number;
}

export interface MediaState {
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
}
