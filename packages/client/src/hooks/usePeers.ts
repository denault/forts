import { useCallback, useEffect, useRef, useState, MutableRefObject } from 'react';
import type Peer from 'simple-peer';
import { MeshTransport } from '../lib/mediaTransport';
import { SignalingClient } from '../lib/signaling';

interface UsePeersOptions {
  signalingRef: MutableRefObject<SignalingClient | null>;
  localStream: MediaStream | null;
}

export function usePeers({ signalingRef, localStream }: UsePeersOptions) {
  const transportRef = useRef<MeshTransport | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());

  // Initialize transport
  useEffect(() => {
    if (!transportRef.current) {
      transportRef.current = new MeshTransport();
    }

    const transport = transportRef.current;

    transport.onRemoteStream((peerId, stream) => {
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        next.set(peerId, stream);
        return next;
      });
    });

    transport.onPeerDisconnect((peerId) => {
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        next.delete(peerId);
        return next;
      });
    });

    return () => {
      transport.destroy();
      transportRef.current = null;
    };
  }, []);

  // Update local stream
  useEffect(() => {
    if (transportRef.current && localStream) {
      transportRef.current.setLocalStream(localStream);
    }
  }, [localStream]);

  // Set up signal handler
  useEffect(() => {
    if (!transportRef.current) return;

    const transport = transportRef.current;

    transport.onSignalData((targetPeerId, signal) => {
      signalingRef.current?.send({
        type: 'signal',
        targetPeerId,
        signal,
      });
    });
  }, [signalingRef]);

  const createPeer = useCallback((peerId: string, initiator: boolean) => {
    transportRef.current?.createPeer(peerId, initiator);
  }, []);

  const handleSignal = useCallback((fromPeerId: string, signal: Peer.SignalData) => {
    transportRef.current?.handleSignal(fromPeerId, signal);
  }, []);

  const removePeer = useCallback((peerId: string) => {
    transportRef.current?.removePeer(peerId);
    setRemoteStreams((prev) => {
      const next = new Map(prev);
      next.delete(peerId);
      return next;
    });
  }, []);

  const destroyAll = useCallback(() => {
    transportRef.current?.destroy();
    setRemoteStreams(new Map());
  }, []);

  return {
    remoteStreams,
    createPeer,
    handleSignal,
    removePeer,
    destroyAll,
  };
}
