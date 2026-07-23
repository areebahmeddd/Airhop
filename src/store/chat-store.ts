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
  // Local-only notice rendered as centered muted text instead of a bubble
  // (e.g. "you took a screenshot"). Never sent over the mesh.
  isSystem?: boolean;
  // Local-only, never sent over the mesh, mirroring how WhatsApp/Telegram
  // already treat starring: private to you.
  isStarred?: boolean;
  // Set only on the sender's own outgoing copy of a forwarded message.
  forwarded?: boolean;
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
  // NOTE: channelTransports / channelVisibilities were removed. They were
  // written by the UI and read by nothing, so a channel marked "Private" was
  // still plaintext-broadcast to everyone in range and a channel set to "Nostr"
  // still went out over BLE. Keeping settings that silently do nothing, one of
  // them implying encryption, is worse than not offering them. Channels are
  // public by design; privacy lives in DMs (Noise + Double Ratchet).
  // User-created channels pinned to the top of "Your Channels" (WhatsApp-style).
  pinnedChannels: string[];
  // Conversations (channels or DMs) the user has muted.
  mutedChannels: string[];

  addChannel: (channel: string) => void;
  removeChannel: (channel: string) => void;
  // Returns false if the rename was rejected (name unchanged, or already taken)
  // so callers don't apply follow-up edits to the wrong channel.
  renameChannel: (oldName: string, newName: string) => boolean;
  togglePinChannel: (channel: string) => void;
  // Muting a conversation stops it raising notifications and keeps its unread
  // out of the aggregate badges (tab, segments, sections). The per-row unread
  // count still shows, so a muted chat is quiet, not invisible.
  toggleMuteChannel: (channel: string) => void;
  clearChannelMessages: (channel: string) => void;
  // Fold one channel's messages into another and delete the source. Used when a
  // Nostr-only correspondent is later identified over BLE, so the two threads
  // for the same person become one.
  mergeChannel: (from: string, to: string) => void;
  addMessage: (msg: ChatMessage) => void;
  toggleStar: (channel: string, id: string) => void;
  setActiveChannel: (channel: string) => void;
  markChannelRead: (channel: string) => void;
  setLastThread: (channel: string) => void;
  setChannelDescription: (channel: string, description: string) => void;
  clearAll: () => void;
}

// Inbound-message observers. A side channel so features like notifications can
// react to a new message from someone else without the store importing them
// (which would couple this pure state container to UI/native concerns). Fired
// once per genuinely-new, not-mine message; suppression decisions belong to the
// observer, not here.
type InboundListener = (msg: ChatMessage) => void;
const inboundListeners = new Set<InboundListener>();

export function subscribeInboundMessages(fn: InboundListener): () => void {
  inboundListeners.add(fn);
  return () => {
    inboundListeners.delete(fn);
  };
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
    (set, get) => ({
      channels: DEFAULT_CHANNELS,
      messages: {},
      // Empty string: user at list, not inside any thread.
      // Changing from DEFAULT_CHANNELS[0] so new messages to #bluetooth are
      // counted as unread until the user explicitly opens that channel.
      activeChannel: "",
      lastThread: "",
      unreadCounts: {},
      channelDescriptions: {},
      pinnedChannels: [],
      mutedChannels: [],

      addChannel(channel: string) {
        set((state) => {
          if (state.channels.includes(channel)) return state;
          return { channels: [...state.channels, channel] };
        });
      },

      addMessage(msg: ChatMessage) {
        // Decide this before the set() runs: was it already present? Observers
        // must fire exactly once for a new message and never for a duplicate
        // (mesh flooding delivers the same message by several paths).
        const priorMessages = get().messages[msg.channel] ?? [];
        const isDuplicate = priorMessages.some((m) => m.id === msg.id);

        set((state) => {
          const existing = state.messages[msg.channel] ?? [];
          // Deduplicate by id
          if (existing.some((m) => m.id === msg.id)) return state;
          // Insert by timestamp instead of appending. Mesh messages can arrive
          // out of order (a multi-hop relay is slower than a direct link but
          // still carries the ORIGINAL sender timestamp), which otherwise
          // renders bubbles out of sequence and makes the date-separator check
          // (which only compares adjacent items) emit a stray "Yesterday" in
          // the middle of today's conversation.
          // Linear scan from the end: the common case is a genuinely newest
          // message, which lands on the first comparison.
          let insertAt = existing.length;
          while (
            insertAt > 0 &&
            existing[insertAt - 1].timestampMs > msg.timestampMs
          ) {
            insertAt--;
          }
          const next = [
            ...existing.slice(0, insertAt),
            msg,
            ...existing.slice(insertAt),
          ];
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

        if (!isDuplicate && !msg.isMine) {
          for (const fn of inboundListeners) fn(msg);
        }
      },

      toggleStar(channel: string, id: string) {
        set((state) => {
          const existing = state.messages[channel] ?? [];
          return {
            messages: {
              ...state.messages,
              [channel]: existing.map((m) =>
                m.id === id ? { ...m, isStarred: !m.isStarred } : m,
              ),
            },
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
          const channelDescriptions = { ...state.channelDescriptions };
          delete channelDescriptions[channel];
          const pinnedChannels = state.pinnedChannels.filter(
            (c) => c !== channel,
          );
          const mutedChannels = state.mutedChannels.filter(
            (c) => c !== channel,
          );
          // Clear activeChannel rather than reassigning it to some arbitrary
          // surviving channel. The old behaviour picked the first non-DM
          // channel (usually #bluetooth) while the user was sitting on the LIST
          // view, and since addMessage suppresses the unread bump for the
          // active channel, that channel then silently stopped showing unread
          // badges until the user opened and closed some other thread.
          const activeChannel =
            state.activeChannel === channel ? "" : state.activeChannel;
          return {
            channels,
            messages,
            unreadCounts,
            channelDescriptions,
            pinnedChannels,
            mutedChannels,
            activeChannel,
          };
        });
      },

      renameChannel(oldName: string, newName: string) {
        // Normalise: ensure exactly one leading #.
        const clean = "#" + newName.replace(/^#+/, "");
        // Decide OUTSIDE set() so the result can be reported. Previously this
        // silently no-opped on a collision while the caller carried on as if it
        // had worked: renaming #foo onto an existing #bar left #foo untouched
        // and overwrote #bar's description with #foo's drafts.
        if (clean === oldName || get().channels.includes(clean)) return false;

        set((state) => {
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
          const pinnedChannels = state.pinnedChannels.includes(oldName)
            ? state.pinnedChannels.map((c) => (c === oldName ? clean : c))
            : state.pinnedChannels;
          const activeChannel =
            state.activeChannel === oldName ? clean : state.activeChannel;
          // lastThread must follow the rename too, otherwise an app restart
          // tries to reopen a channel key that no longer exists and lands the
          // user on an empty thread.
          const lastThread =
            state.lastThread === oldName ? clean : state.lastThread;
          return {
            channels,
            messages,
            unreadCounts,
            channelDescriptions,
            pinnedChannels,
            activeChannel,
            lastThread,
          };
        });
        return true;
      },

      togglePinChannel(channel: string) {
        set((state) => ({
          pinnedChannels: state.pinnedChannels.includes(channel)
            ? state.pinnedChannels.filter((c) => c !== channel)
            : [...state.pinnedChannels, channel],
        }));
      },

      toggleMuteChannel(channel: string) {
        set((state) => ({
          mutedChannels: state.mutedChannels.includes(channel)
            ? state.mutedChannels.filter((c) => c !== channel)
            : [...state.mutedChannels, channel],
        }));
      },

      // Wipes a channel's messages and unread count but keeps the channel
      // itself (and its description/transport/visibility/pin state) intact,
      // distinct from removeChannel, which deletes the channel entirely.
      clearChannelMessages(channel: string) {
        set((state) => {
          const messages = { ...state.messages };
          delete messages[channel];
          return {
            messages,
            unreadCounts: { ...state.unreadCounts, [channel]: 0 },
          };
        });
      },

      mergeChannel(from: string, to: string) {
        if (from === to) return;
        set((state) => {
          const source = state.messages[from];
          if (source === undefined || source.length === 0) {
            // Nothing to move, but still drop the empty source channel.
            if (!(from in state.messages) && !state.channels.includes(from)) {
              return state;
            }
            const messages = { ...state.messages };
            delete messages[from];
            const unreadCounts = { ...state.unreadCounts };
            delete unreadCounts[from];
            return {
              messages,
              unreadCounts,
              channels: state.channels.filter((c) => c !== from),
            };
          }

          const target = state.messages[to] ?? [];
          const seen = new Set(target.map((m) => m.id));
          const merged = [
            ...target,
            ...source
              .filter((m) => !seen.has(m.id))
              .map((m) => ({ ...m, channel: to })),
          ].sort((a, b) => a.timestampMs - b.timestampMs);

          const messages = { ...state.messages, [to]: merged };
          delete messages[from];

          const unreadCounts = { ...state.unreadCounts };
          unreadCounts[to] =
            (unreadCounts[to] ?? 0) + (unreadCounts[from] ?? 0);
          delete unreadCounts[from];

          const channels = state.channels.filter((c) => c !== from);
          return {
            messages,
            unreadCounts,
            channels: channels.includes(to) ? channels : [...channels, to],
          };
        });
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

      clearAll() {
        set({
          channels: DEFAULT_CHANNELS,
          messages: {},
          activeChannel: "",
          lastThread: "",
          unreadCounts: {},
          channelDescriptions: {},
          pinnedChannels: [],
          mutedChannels: [],
        });
      },
    }),
    {
      name: "airhop-chat",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
