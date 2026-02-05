import { create } from 'zustand';
import type { Peer } from '@p2p-rooms/shared';

interface RoomState {
  roomId: string | null;
  localPeerId: string | null;
  displayName: string | null;
  peers: Map<string, Peer>;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;

  setRoomId: (roomId: string | null) => void;
  setLocalPeerId: (peerId: string) => void;
  setDisplayName: (name: string) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
  setPeers: (peers: Peer[]) => void;
  addPeer: (peer: Peer) => void;
  removePeer: (peerId: string) => void;
  updatePeerMediaState: (
    peerId: string,
    isMuted: boolean,
    isCameraOff: boolean,
    isScreenSharing: boolean
  ) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  roomId: null,
  localPeerId: null,
  displayName: null,
  peers: new Map(),
  isConnected: false,
  isConnecting: false,
  error: null,

  setRoomId: (roomId) => set({ roomId }),
  setLocalPeerId: (peerId) => set({ localPeerId: peerId }),
  setDisplayName: (name) => set({ displayName: name }),
  setConnected: (connected) => set({ isConnected: connected, isConnecting: false }),
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  setError: (error) => set({ error }),

  setPeers: (peers) =>
    set({
      peers: new Map(peers.map((p) => [p.id, p])),
    }),

  addPeer: (peer) =>
    set((state) => {
      const newPeers = new Map(state.peers);
      newPeers.set(peer.id, peer);
      return { peers: newPeers };
    }),

  removePeer: (peerId) =>
    set((state) => {
      const newPeers = new Map(state.peers);
      newPeers.delete(peerId);
      return { peers: newPeers };
    }),

  updatePeerMediaState: (peerId, isMuted, isCameraOff, isScreenSharing) =>
    set((state) => {
      const peer = state.peers.get(peerId);
      if (!peer) return state;
      const newPeers = new Map(state.peers);
      newPeers.set(peerId, { ...peer, isMuted, isCameraOff, isScreenSharing });
      return { peers: newPeers };
    }),

  reset: () =>
    set({
      roomId: null,
      localPeerId: null,
      displayName: null,
      peers: new Map(),
      isConnected: false,
      isConnecting: false,
      error: null,
    }),
}));
