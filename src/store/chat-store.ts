// Chat state: channels and messages.
// MMKV-persisted so messages survive app restarts.

import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AttachmentType = "image" | "voice" | "document" | "video";

// Metadata for a file attached to a chat message.
// The `uri` field holds a local file URI on the sender's device.
// When received over the mesh the uri is populated from the decoded bytes.
export interface ChatAttachment {
  type: AttachmentType;
  uri: string;
  name?: string; // original filename (documents / video)
  mimeType?: string;
  durationMs?: number; // voice notes and video
  sizeBytes?: number;
}

export interface ChatMessage {
  id: string;
  channel: string;
  senderID: string; // 16-hex peer ID
  senderNickname: string;
  text: string;
  timestampMs: number;
  isMine: boolean;
  attachment?: ChatAttachment;
}

interface ChatState {
  channels: string[];
  // Map of channel name to messages (chronological, oldest first)
  messages: Record<string, ChatMessage[]>;
  activeChannel: string;
  // Last open thread channel, persisted so the UI can restore on re-launch after
  // the OS kills the process. Empty string means the user was at the list view.
  lastThread: string;
  // Unread count per channel, cleared when the thread is opened
  unreadCounts: Record<string, number>;
  // User-written descriptions for custom channels (persisted via MMKV).
  channelDescriptions: Record<string, string>;
  // Transport preference for custom channels: "BLE" | "Nostr" | "BLE + Nostr".
  channelTransports: Record<string, string>;
  // Visibility preference for custom channels: "Public" | "Private".
  channelVisibilities: Record<string, string>;
  // Channels the user has archived (hidden but messages preserved).
  archivedChannels: string[];

  addChannel: (channel: string) => void;
  removeChannel: (channel: string) => void;
  renameChannel: (oldName: string, newName: string) => void;
  archiveChannel: (channel: string) => void;
  unarchiveChannel: (channel: string) => void;
  addMessage: (msg: ChatMessage) => void;
  setActiveChannel: (channel: string) => void;
  markChannelRead: (channel: string) => void;
  setLastThread: (channel: string) => void;
  setChannelDescription: (channel: string, description: string) => void;
  setChannelTransport: (channel: string, transport: string) => void;
  setChannelVisibility: (channel: string, visibility: string) => void;
  clearAll: () => void;
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
      // Empty string: user at list, not inside any thread.
      // Changing from DEFAULT_CHANNELS[0] so new messages to #bluetooth are
      // counted as unread until the user explicitly opens that channel.
      activeChannel: "",
      lastThread: "",
      unreadCounts: {},
      channelDescriptions: {},
      channelTransports: {},
      channelVisibilities: {},
      archivedChannels: [],

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
          // Trim to cap and track how many unread messages were dropped.
          const overflow = next.length - MAX_PER_CHANNEL;
          const dropped = overflow > 0 ? next.slice(0, overflow) : [];
          const trimmed = overflow > 0 ? next.slice(overflow) : next;
          // Keep unread count consistent: subtract any unread messages lost to trimming.
          const droppedUnread = dropped.filter((m) => !m.isMine).length;
          const isUnread = !msg.isMine && msg.channel !== state.activeChannel;
          const prevUnread = state.unreadCounts[msg.channel] ?? 0;
          const newUnread =
            Math.max(0, prevUnread - droppedUnread) + (isUnread ? 1 : 0);
          return {
            messages: { ...state.messages, [msg.channel]: trimmed },
            unreadCounts: { ...state.unreadCounts, [msg.channel]: newUnread },
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

      renameChannel(oldName: string, newName: string) {
        // Normalise: ensure exactly one leading #.
        const clean = "#" + newName.replace(/^#+/, "");
        set((state) => {
          // No-op if the name is unchanged or already taken.
          if (clean === oldName || state.channels.includes(clean)) return state;
          const channels = state.channels.map((c) =>
            c === oldName ? clean : c,
          );
          const messages = { ...state.messages };
          if (messages[oldName]) {
            messages[clean] = messages[oldName].map((m) => ({
              ...m,
              channel: clean,
            }));
            delete messages[oldName];
          }
          const unreadCounts = { ...state.unreadCounts };
          if (unreadCounts[oldName] !== undefined) {
            unreadCounts[clean] = unreadCounts[oldName];
            delete unreadCounts[oldName];
          }
          const channelDescriptions = { ...state.channelDescriptions };
          if (channelDescriptions[oldName] !== undefined) {
            channelDescriptions[clean] = channelDescriptions[oldName];
            delete channelDescriptions[oldName];
          }
          const channelTransports = { ...state.channelTransports };
          if (channelTransports[oldName] !== undefined) {
            channelTransports[clean] = channelTransports[oldName];
            delete channelTransports[oldName];
          }
          const activeChannel =
            state.activeChannel === oldName ? clean : state.activeChannel;
          return {
            channels,
            messages,
            unreadCounts,
            channelDescriptions,
            channelTransports,
            activeChannel,
          };
        });
      },

      archiveChannel(channel: string) {
        set((state) => {
          if (state.archivedChannels.includes(channel)) return state;
          return { archivedChannels: [...state.archivedChannels, channel] };
        });
      },

      unarchiveChannel(channel: string) {
        set((state) => ({
          archivedChannels: state.archivedChannels.filter((c) => c !== channel),
        }));
      },

      markChannelRead(channel: string) {
        set((state) => ({
          unreadCounts: { ...state.unreadCounts, [channel]: 0 },
        }));
      },

      setLastThread(channel: string) {
        set({ lastThread: channel });
      },

      setChannelDescription(channel: string, description: string) {
        set((state) => ({
          channelDescriptions: {
            ...state.channelDescriptions,
            [channel]: description,
          },
        }));
      },

      setChannelTransport(channel: string, transport: string) {
        set((state) => ({
          channelTransports: {
            ...state.channelTransports,
            [channel]: transport,
          },
        }));
      },

      setChannelVisibility(channel: string, visibility: string) {
        set((state) => ({
          channelVisibilities: {
            ...state.channelVisibilities,
            [channel]: visibility,
          },
        }));
      },

      clearAll() {
        set({
          channels: DEFAULT_CHANNELS,
          messages: {},
          activeChannel: "",
          lastThread: "",
          unreadCounts: {},
          channelDescriptions: {},
          channelTransports: {},
          channelVisibilities: {},
          archivedChannels: [],
        });
      },
    }),
    {
      name: "airhop-chat",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
