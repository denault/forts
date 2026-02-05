import Peer from 'simple-peer';
import { ICE_SERVERS } from '@p2p-rooms/shared';

export interface PeerConnection {
  peerId: string;
  peer: Peer.Instance;
  stream: MediaStream | null;
}

// Use Peer.SignalData from simple-peer for internal use, but expose as unknown for interop
export type SignalHandler = (targetPeerId: string, signal: Peer.SignalData) => void;
export type StreamHandler = (peerId: string, stream: MediaStream) => void;
export type DisconnectHandler = (peerId: string) => void;

export class MeshTransport {
  private connections: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private onSignal: SignalHandler | null = null;
  private onStream: StreamHandler | null = null;
  private onDisconnect: DisconnectHandler | null = null;

  setLocalStream(stream: MediaStream | null): void {
    this.localStream = stream;

    // Update all existing peers with the new stream
    for (const conn of this.connections.values()) {
      if (stream) {
        try {
          // Remove old tracks
          const senders = (conn.peer as unknown as { _pc?: RTCPeerConnection })._pc?.getSenders();
          senders?.forEach((sender) => {
            if (sender.track?.kind === 'video' || sender.track?.kind === 'audio') {
              conn.peer.removeTrack(sender.track, this.localStream!);
            }
          });
          // Add new tracks
          stream.getTracks().forEach((track) => {
            conn.peer.addTrack(track, stream);
          });
        } catch {
          // Peer might not be ready yet
        }
      }
    }
  }

  setScreenStream(stream: MediaStream | null): void {
    this.screenStream = stream;
  }

  onSignalData(handler: SignalHandler): void {
    this.onSignal = handler;
  }

  onRemoteStream(handler: StreamHandler): void {
    this.onStream = handler;
  }

  onPeerDisconnect(handler: DisconnectHandler): void {
    this.onDisconnect = handler;
  }

  createPeer(peerId: string, initiator: boolean): void {
    if (this.connections.has(peerId)) {
      console.log(`[WebRTC] Peer ${peerId} already exists`);
      return;
    }

    console.log(`[WebRTC] Creating ${initiator ? 'initiator' : 'receiver'} peer for ${peerId}`);
    console.log(`[WebRTC] Local stream available: ${!!this.localStream}`);

    let peer: Peer.Instance;
    try {
      peer = new Peer({
        initiator,
        stream: this.localStream || undefined,
        config: { iceServers: ICE_SERVERS },
        trickle: true,
      });
    } catch (err) {
      console.error(`[WebRTC] Failed to create peer for ${peerId}:`, err);
      return;
    }

    peer.on('signal', (signal) => {
      console.log(`[WebRTC] Sending signal to ${peerId}:`, signal.type || 'candidate');
      this.onSignal?.(peerId, signal);
    });

    peer.on('stream', (stream) => {
      console.log(`[WebRTC] Received stream from ${peerId}:`, stream.getTracks().map(t => `${t.kind}:${t.enabled}`));
      const conn = this.connections.get(peerId);
      if (conn) {
        conn.stream = stream;
      }
      this.onStream?.(peerId, stream);
    });

    peer.on('connect', () => {
      console.log(`Connected to peer ${peerId}`);
    });

    peer.on('close', () => {
      console.log(`Peer ${peerId} closed`);
      this.removePeer(peerId);
      this.onDisconnect?.(peerId);
    });

    peer.on('error', (err) => {
      console.error(`Peer ${peerId} error:`, err);
      this.removePeer(peerId);
      this.onDisconnect?.(peerId);
    });

    this.connections.set(peerId, { peerId, peer, stream: null });
  }

  handleSignal(fromPeerId: string, signal: Peer.SignalData): void {
    console.log(`[WebRTC] Received signal from ${fromPeerId}:`, signal.type || 'candidate');
    let conn = this.connections.get(fromPeerId);

    // If we receive a signal but don't have a connection, create one as non-initiator
    if (!conn) {
      console.log(`[WebRTC] No connection for ${fromPeerId}, creating as non-initiator`);
      this.createPeer(fromPeerId, false);
      conn = this.connections.get(fromPeerId);
    }

    if (conn) {
      try {
        conn.peer.signal(signal);
      } catch (err) {
        console.error(`[WebRTC] Failed to handle signal for ${fromPeerId}:`, err);
      }
    }
  }

  removePeer(peerId: string): void {
    const conn = this.connections.get(peerId);
    if (conn) {
      try {
        conn.peer.destroy();
      } catch {
        // Already destroyed
      }
      this.connections.delete(peerId);
    }
  }

  getRemoteStream(peerId: string): MediaStream | null {
    return this.connections.get(peerId)?.stream || null;
  }

  getAllStreams(): Map<string, MediaStream> {
    const streams = new Map<string, MediaStream>();
    for (const [peerId, conn] of this.connections) {
      if (conn.stream) {
        streams.set(peerId, conn.stream);
      }
    }
    return streams;
  }

  destroy(): void {
    for (const conn of this.connections.values()) {
      try {
        conn.peer.destroy();
      } catch {
        // Ignore
      }
    }
    this.connections.clear();
  }
}
