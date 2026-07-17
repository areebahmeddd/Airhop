// Chat state: channels and messages.
// MMKV-persisted so messages survive app restarts.

import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  channel: string;
  senderID: string; // 16-hex peer ID
  senderNickname: string;
  text: string;
  timestampMs: number;
  isMine: boolean;
}

interface ChatState {
  channels: string[];
  // Map of channel name → messages (chronological, oldest first)
  messages: Record<string, ChatMessage[]>;
  activeChannel: string;

  addChannel: (channel: string) => void;
  addMessage: (msg: ChatMessage) => void;
  setActiveChannel: (channel: string) => void;
}

// Max messages kept in memory per channel. Oldest are trimmed.
const MAX_PER_CHANNEL = 200;

// Default channels shown on first launch.
const DEFAULT_CHANNELS = ["#general", "#local"];

const storage = createMMKV({ id: "chat-store" });

const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      channels: DEFAULT_CHANNELS,
      messages: {},
      activeChannel: DEFAULT_CHANNELS[0],

      addChannel(channel: string) {
        set((state) => {
          if (state.channels.includes(channel)) return state;
          return { channels: [...state.channels, channel] };
        });
      },

      addMessage(msg: ChatMessage) {
        set((state) => {
          const existing = state.messages[msg.channel] ?? [];
          // Deduplicate by id
          if (existing.some((m) => m.id === msg.id)) return state;
          const next = [...existing, msg];
          // Trim to cap
          const trimmed =
            next.length > MAX_PER_CHANNEL
              ? next.slice(next.length - MAX_PER_CHANNEL)
              : next;
          return {
            messages: { ...state.messages, [msg.channel]: trimmed },
          };
        });
      },

      setActiveChannel(channel: string) {
        set({ activeChannel: channel });
      },
    }),
    {
      name: "airhop-chat",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
