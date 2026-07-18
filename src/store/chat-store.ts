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
  // Map of channel name to messages (chronological, oldest first)
  messages: Record<string, ChatMessage[]>;
  activeChannel: string;
  // Unread count per channel, cleared when the thread is opened
  unreadCounts: Record<string, number>;

  addChannel: (channel: string) => void;
  removeChannel: (channel: string) => void;
  addMessage: (msg: ChatMessage) => void;
  setActiveChannel: (channel: string) => void;
  markChannelRead: (channel: string) => void;
}

// Max messages kept in memory per channel. Oldest are trimmed.
const MAX_PER_CHANNEL = 200;

// Default channels shown on first launch, mirroring bitchat's channel hierarchy.
// Mesh: BLE-only broadcast channel. Location channels: Nostr, sorted by coverage.
const DEFAULT_CHANNELS = [
  "#bluetooth",
  "#block",
  "#neighborhood",
  "#city",
  "#province",
  "#region",
];

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
      unreadCounts: {},

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
          // Increment unread count if the message is incoming and not in the active thread
          const isUnread = !msg.isMine && msg.channel !== state.activeChannel;
          return {
            messages: { ...state.messages, [msg.channel]: trimmed },
            unreadCounts: isUnread
              ? {
                  ...state.unreadCounts,
                  [msg.channel]: (state.unreadCounts[msg.channel] ?? 0) + 1,
                }
              : state.unreadCounts,
          };
        });
      },

      setActiveChannel(channel: string) {
        set({ activeChannel: channel });
      },

      removeChannel(channel: string) {
        set((state) => {
          const channels = state.channels.filter((c) => c !== channel);
          const messages = { ...state.messages };
          delete messages[channel];
          const unreadCounts = { ...state.unreadCounts };
          delete unreadCounts[channel];
          const activeChannel =
            state.activeChannel === channel
              ? (channels.find((c) => !c.startsWith("dm:")) ?? "")
              : state.activeChannel;
          return { channels, messages, unreadCounts, activeChannel };
        });
      },

      markChannelRead(channel: string) {
        set((state) => ({
          unreadCounts: { ...state.unreadCounts, [channel]: 0 },
        }));
      },
    }),
    {
      name: "airhop-chat",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
