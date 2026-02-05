import { create } from 'zustand';

interface MediaState {
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  localStream: MediaStream | null;
  screenStream: MediaStream | null;

  setMuted: (muted: boolean) => void;
  setCameraOff: (off: boolean) => void;
  setScreenSharing: (sharing: boolean) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setScreenStream: (stream: MediaStream | null) => void;
  reset: () => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  isMuted: false,
  isCameraOff: false,
  isScreenSharing: false,
  localStream: null,
  screenStream: null,

  setMuted: (muted) => set({ isMuted: muted }),
  setCameraOff: (off) => set({ isCameraOff: off }),
  setScreenSharing: (sharing) => set({ isScreenSharing: sharing }),
  setLocalStream: (stream) => set({ localStream: stream }),
  setScreenStream: (stream) => set({ screenStream: stream }),

  reset: () =>
    set({
      isMuted: false,
      isCameraOff: false,
      isScreenSharing: false,
      localStream: null,
      screenStream: null,
    }),
}));
