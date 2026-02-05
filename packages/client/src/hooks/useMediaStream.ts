import { useCallback, useEffect, useRef } from 'react';
import { useMediaStore } from '../stores/mediaStore';

export function useMediaStream() {
  const { localStream, screenStream, setLocalStream, setScreenStream, setMuted, setCameraOff, setScreenSharing } =
    useMediaStore();
  const streamRef = useRef<MediaStream | null>(null);

  const startMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('Failed to get media devices:', err);
      throw err;
    }
  }, [setLocalStream]);

  const stopMedia = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setLocalStream(null);
    }
  }, [setLocalStream]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      const newMuted = audioTracks.length > 0 && audioTracks[0].enabled;
      audioTracks.forEach((track) => {
        track.enabled = !newMuted;
      });
      setMuted(newMuted);
      return newMuted;
    }
    return false;
  }, [localStream, setMuted]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      const newOff = videoTracks.length > 0 && videoTracks[0].enabled;
      videoTracks.forEach((track) => {
        track.enabled = !newOff;
      });
      setCameraOff(newOff);
      return newOff;
    }
    return false;
  }, [localStream, setCameraOff]);

  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      // Listen for user stopping screen share via browser UI
      stream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
        setScreenSharing(false);
      };

      setScreenStream(stream);
      setScreenSharing(true);
      return stream;
    } catch (err) {
      console.error('Failed to start screen share:', err);
      throw err;
    }
  }, [setScreenStream, setScreenSharing]);

  const stopScreenShare = useCallback(() => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setScreenSharing(false);
    }
  }, [screenStream, setScreenStream, setScreenSharing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMedia();
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    localStream,
    screenStream,
    startMedia,
    stopMedia,
    toggleMute,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
  };
}
