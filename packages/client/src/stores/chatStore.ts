import { create } from 'zustand';
import type { ChatMessage } from '@p2p-rooms/shared';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  unreadCount: number;

  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setOpen: (open: boolean) => void;
  incrementUnread: () => void;
  clearUnread: () => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isOpen: false,
  unreadCount: 0,

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      unreadCount: state.isOpen ? 0 : state.unreadCount + 1,
    })),

  setOpen: (open) =>
    set({
      isOpen: open,
      unreadCount: open ? 0 : undefined,
    }),

  incrementUnread: () =>
    set((state) => ({
      unreadCount: state.unreadCount + 1,
    })),

  clearUnread: () => set({ unreadCount: 0 }),

  reset: () =>
    set({
      messages: [],
      isOpen: false,
      unreadCount: 0,
    }),
}));
