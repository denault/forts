import { useCallback, useEffect, useRef, MutableRefObject } from 'react';
import type Peer from 'simple-peer';
import type { ServerMessage } from '@p2p-rooms/shared';
import { SignalingClient } from '../lib/signaling';
import { useRoomStore } from '../stores/roomStore';
import { useChatStore } from '../stores/chatStore';
import { useMediaStore } from '../stores/mediaStore';
import { usePeers } from './usePeers';

interface UseRoomOptions {
  localStream: MediaStream | null;
}

export function useRoom({ localStream }: UseRoomOptions) {
  const signalingRef = useRef<SignalingClient | null>(null) as MutableRefObject<SignalingClient | null>;

  const {
    roomId,
    localPeerId,
    isConnected,
    peers,
    setRoomId,
    setLocalPeerId,
    setConnected,
    setConnecting,
    setError,
    setPeers,
    addPeer,
    removePeer: removePeerFromStore,
    updatePeerMediaState,
    reset: resetRoom,
  } = useRoomStore();

  const { setMessages, addMessage, reset: resetChat } = useChatStore();
  const { isMuted, isCameraOff, isScreenSharing, reset: resetMedia } = useMediaStore();

  const { remoteStreams, createPeer, handleSignal, removePeer, destroyAll } = usePeers({
    signalingRef,
    localStream,
  });

  // Handle server messages
  const handleMessage = useCallback(
    (message: ServerMessage) => {
      switch (message.type) {
        case 'joined':
          setLocalPeerId(message.peerId);
          setPeers(message.peers);
          setMessages(message.chatHistory);
          setConnected(true);

          // Create peer connections to all existing peers (we're the initiator)
          message.peers.forEach((peer) => {
            createPeer(peer.id, true);
          });
          break;

        case 'peer-joined':
          addPeer(message.peer);
          // New peer joined, they will initiate the connection
          break;

        case 'peer-left':
          removePeerFromStore(message.peerId);
          removePeer(message.peerId);
          break;

        case 'signal':
          handleSignal(message.fromPeerId, message.signal as Peer.SignalData);
          break;

        case 'chat':
          addMessage(message.message);
          break;

        case 'peer-media-state':
          updatePeerMediaState(
            message.peerId,
            message.isMuted,
            message.isCameraOff,
            message.isScreenSharing
          );
          break;

        case 'error':
          setError(message.message);
          break;
      }
    },
    [
      setLocalPeerId,
      setPeers,
      setMessages,
      setConnected,
      addPeer,
      removePeerFromStore,
      addMessage,
      updatePeerMediaState,
      setError,
      createPeer,
      handleSignal,
      removePeer,
    ]
  );

  // Initialize signaling client
  useEffect(() => {
    if (!signalingRef.current) {
      signalingRef.current = new SignalingClient();
      signalingRef.current.onMessage(handleMessage);
    }

    return () => {
      signalingRef.current?.disconnect();
      signalingRef.current = null;
    };
  }, [handleMessage]);

  const joinRoom = useCallback(
    async (newRoomId: string, displayName: string) => {
      setConnecting(true);
      setError(null);

      try {
        if (!signalingRef.current) {
          signalingRef.current = new SignalingClient();
          signalingRef.current.onMessage(handleMessage);
        }

        if (!signalingRef.current.isConnected()) {
          await signalingRef.current.connect();
        }

        setRoomId(newRoomId);
        signalingRef.current.send({
          type: 'join',
          roomId: newRoomId,
          displayName,
        });
      } catch (err) {
        setConnecting(false);
        setError('Failed to connect to server');
        console.error('Failed to join room:', err);
      }
    },
    [handleMessage, setRoomId, setConnecting, setError]
  );

  const leaveRoom = useCallback(() => {
    signalingRef.current?.send({ type: 'leave' });
    destroyAll();
    resetRoom();
    resetChat();
    resetMedia();
  }, [destroyAll, resetRoom, resetChat, resetMedia]);

  const sendChat = useCallback((content: string) => {
    signalingRef.current?.send({ type: 'chat', content });
  }, []);

  const updateMediaState = useCallback(() => {
    signalingRef.current?.send({
      type: 'media-state',
      isMuted,
      isCameraOff,
      isScreenSharing,
    });
  }, [isMuted, isCameraOff, isScreenSharing]);

  // Send media state updates when they change
  useEffect(() => {
    if (isConnected) {
      updateMediaState();
    }
  }, [isConnected, isMuted, isCameraOff, isScreenSharing, updateMediaState]);

  return {
    roomId,
    localPeerId,
    isConnected,
    peers,
    remoteStreams,
    joinRoom,
    leaveRoom,
    sendChat,
  };
}
