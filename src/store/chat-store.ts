// Chat state: channels and messages.
// MMKV-persisted so messages survive app restarts.

import { MAX_CHANNEL_NAME } from "@utils/deep-link";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useActivityStore } from "./activity-store";
import { useChannelMembersStore } from "./channel-members-store";

export type AttachmentType = "image" | "voice" | "document" | "video";

// Delivery lifecycle of an outgoing message, WhatsApp-style. Only meaningful on
// your own messages (isMine). "carried" means handed to a store-and-forward
// courier (best-effort physical delivery); "sent" means it left the device;
// "delivered"/"read" are confirmed by the recipient over the mesh.
export type MessageStatus =
  | "sending"
  | "sent"
  | "carried" // handed to a store-and-forward courier (a device will ferry it)
  | "queued" // held locally, retried over the mesh/internet when a route returns
  | "delivered"
  | "read"
  | "failed"
  // The sender pulled an ecash payment back into their wallet before it landed.
  // Set only on a token message, and only by the wallet's reclaim.
  | "reclaimed";

// Progression rank, so a status only ever moves forward (a late "delivered"
// never downgrades a message that is already "read").
//
// "reclaimed" outranks everything deliberately. It is terminal, and it describes
// the money rather than the packet: once the proofs are back in the sender's
// balance, a late receipt must not relabel the bubble "delivered" and imply the
// recipient was paid.
const STATUS_RANK: Record<MessageStatus, number> = {
  sending: 0,
  failed: 1,
  sent: 2,
  carried: 2,
  queued: 2,
  delivered: 3,
  read: 4,
  reclaimed: 5,
};

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
  // Set only on the sender's own outgoing copy of a forwarded message.
  forwarded?: boolean;
  // True when this public message arrived from another mesh island across the
  // mesh bridge (rendered with a network glyph), rather than over Bluetooth.
  viaBridge?: boolean;
  // A place somebody sent, rendered as a card instead of a bubble.
  //
  // On the message rather than in a store of its own because a pin is a
  // message: one point, one moment, no updates, so it lives and dies with the
  // row it arrived in and the panic wipe takes it with everything else. See
  // core/mesh/wire/location-pin.ts.
  //
  // `takenAtMs` is separate from the message timestamp: a pin that waited in a
  // composer is older than the message carrying it, and the card reports the
  // age of the fix rather than of the delivery.
  locationPin?: {
    lat: number;
    lng: number;
    accuracyM?: number;
    takenAtMs: number;
  };
  // Delivery status (own outgoing messages only). Undefined on received
  // messages and legacy rows. See MessageStatus.
  status?: MessageStatus;
  // When the recipient confirmed delivery / read, for the Message info sheet.
  deliveredAtMs?: number;
  readAtMs?: number;
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
  // User-created channels pinned to the top of "Your Rooms" (WhatsApp-style).
  pinnedChannels: string[];
  // Conversations (channels or DMs) the user has muted.
  mutedChannels: string[];
  // Per-channel end-to-end encryption keys (base64url), one per private
  // (custom) channel. A channel with a key here is private and encrypted; a
  // channel without one (the built-in location channels) is public plaintext.
  channelKeys: Record<string, string>;
  // Reach of each private channel: "ble" (local mesh only, most private) or
  // "ble+nostr" (also bridged over Nostr for internet reach, at the cost of a
  // stable channel tag visible to relays). Chosen at creation, carried in the
  // invite so every member subscribes the same way.
  channelReach: Record<string, "ble" | "ble+nostr">;
  // Threads folded into another one, `from` to `to`. A DM is keyed
  // `dm:nostr_<pubkey>` until the sender's announce identifies them, then
  // `dm:<peerID>`; mergeChannel folds the first into the second. Anything still
  // holding the old name resolves through here: the open thread, the
  // last-thread restore, a tapped notification, a bell row.
  channelRedirects: Record<string, string>;
  // The geohash cell a `dm:nostr_<pubkey>` conversation belongs to.
  //
  // A location-channel DM is written from our per-cell identity, which is
  // derived from (seed, geohash) - so replying to one needs to know WHICH cell
  // it happened in. Held only in memory that binding is gone after a relaunch,
  // and opening such a thread from the Direct list falls through to the MAIN
  // Nostr identity instead. The recipient then gets a message from a key they
  // have never seen, which opens a second thread
  // rather than continuing theirs - and it handed a person we had only ever met
  // pseudonymously in a location channel our permanent identity, which is the
  // exact link per-cell identities exist to prevent.
  //
  // Persisted here rather than in a store of its own so it is written, cleared
  // and wiped with the conversation it describes. Absence means the thread is
  // NOT a geohash DM: it is someone who reached our durable identity and whose
  // peer ID we do not know yet, and replying to them from that identity is
  // correct.
  geoDmCells: Record<string, string>;
  // The name a location-channel peer goes by, keyed by their per-cell pubkey.
  //
  // A geohash nickname rides the `n` tag on their CHANNEL messages, so it is
  // known where they are talking and nowhere else: a geo DM carries no nickname
  // at all. Without this the same person read as "NeverDie#0c08" in the channel
  // and "anon#0c08" everywhere their conversation appeared - the DM list, the
  // thread header, the contact sheet - because those all resolve from the pubkey
  // alone and the pubkey does not know it.
  //
  // Recorded when a conversation with them opens, which is both the moment the
  // name is in hand and the only reason to keep it. Bounded by conversations
  // rather than by everyone ever seen in a cell.
  geoDmNames: Record<string, string>;
  // How far a contact-card exchange has got in a location DM, keyed by their
  // per-cell pubkey.
  //
  // Both halves are needed before the two threads may be folded into one, and
  // the reason is attribution rather than tidiness. Merging is what switches our
  // replies from the pseudonymous per-cell rail onto the durable one - and the
  // durable inbox recognises a sender only by a Nostr key it already knows.
  // (It cannot do otherwise: the envelope carries a sender peer ID, but that
  // field is unauthenticated, so trusting it would let anyone file a message
  // into anyone's thread.)
  //
  // So switching rails before they hold OUR card lands our messages in a second,
  // unattributed thread on their side - the exact split this feature exists to
  // heal. Waiting until both have been exchanged means both people cross over at
  // the same moment, and neither ever sees the conversation fork.
  geoCardExchange: Record<string, { theirPeerID?: string; sentMine?: boolean }>;

  addChannel: (channel: string) => void;
  // Follow a merged-away channel to the thread it now lives in. Identity for
  // anything never merged, so it is safe to call on any channel.
  resolveChannel: (channel: string) => string;
  // Join (or create) a private channel with its E2E key and reach. Used when
  // you create a channel, when you tap someone's invite link, and when you
  // paste one into the app.
  //
  // Returns the channel it actually landed in, which is not always the name
  // asked for: a private channel is identified by its KEY, never its name (the
  // name never touches the wire), so two unrelated rooms can both be called
  // "#team". Joining the second under the same label would overwrite the first
  // one's key and orphan it, so a clash lands in a suffixed room of its own.
  // Callers open whatever comes back rather than the name they passed in.
  joinPrivateChannel: (
    channel: string,
    keyBase64: string,
    overNostr: boolean,
  ) => string;
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
  // Remember which cell a geohash DM belongs to. A no-op when unchanged, so the
  // inbound path can call it per message without rewriting the store.
  // `displayName` is the already-formatted `nick#last4`, exactly as the channel
  // renders it, so the two surfaces can never disagree about spelling.
  setGeoDmCell: (pubkey: string, geohash: string, displayName?: string) => void;
  // Record a half of the card exchange. `theirPeerID` is who they turned out to
  // be; `sentMine` is that we have told them who we are.
  noteGeoCardExchange: (
    pubkey: string,
    half: { theirPeerID?: string; sentMine?: boolean },
  ) => void;
  // Both halves are done and the threads have been folded together, so the
  // bookkeeping - and the record of which cell we met in - has no one left to
  // serve.
  clearGeoCardExchange: (pubkey: string) => void;
  addMessage: (msg: ChatMessage) => void;
  // Advance an outgoing message's delivery status (never downgrades). `atMs`
  // stamps the delivered/read time for the Message info sheet.
  setMessageStatus: (
    channel: string,
    id: string,
    status: MessageStatus,
    atMs?: number,
  ) => void;
  // Remove a single message. Used by Undo Send to pull an outgoing message back
  // during its brief hold window, before it is ever transmitted.
  removeMessage: (channel: string, id: string) => void;
  // Give up on messages left mid-flight by a process that died, so a retry can
  // be offered instead of an hourglass that never resolves.
  //
  // "sending" is the only in-flight status with no owner across a restart: the
  // outbox resumes queued and sent, the courier resumes carried. A message is
  // "sending" during Undo Send's hold window (held in a ref, flushed on unmount)
  // or between transmit and the transport answering, and a kill in either window
  // strands it.
  //
  // Marked failed rather than re-sent: the persisted state cannot say whether
  // the bytes reached the radio, so re-sending could duplicate. "failed" is also
  // what makes the bubble tappable, since handleRetryMessage refuses any other
  // status.
  failStaleSending: (olderThanMs: number, now?: number) => void;
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

// The widest location channels are the noisiest, so they start muted on a fresh
// install: the user opts into #city and #region by unmuting, rather than being
// flooded by them out of the box. Their per-row unread still shows; muted just
// keeps them from badging the app or raising notifications until unmuted.
const DEFAULT_MUTED_CHANNELS = ["#city", "#province", "#region"];

// Where a private channel with this key belongs, given the rooms already
// joined. Normally the name asked for. When that name is already taken by a
// DIFFERENT key it is a genuine second room that happens to share a label
// (nothing stops two people naming a channel "#team"), so it gets its own
// suffixed one rather than overwriting the key of the room already there.
// Re-joining a room already held, under any label, is a no-op that returns
// where it already lives, so tapping the same invite twice never duplicates it.
//
// The suffix is `-2`, `-3`, ... and never whitespace: this label is what an
// onward invite link carries, and the link parser rejects names with spaces or
// past MAX_CHANNEL_NAME. The base is trimmed so the suffixed name still fits.
export function freeChannelLabel(
  channelKeys: Record<string, string>,
  channel: string,
  keyBase64: string,
): string {
  if (
    channelKeys[channel] === undefined ||
    channelKeys[channel] === keyBase64
  ) {
    return channel;
  }
  // Already joined under some other label: go back to that room.
  for (const [name, key] of Object.entries(channelKeys)) {
    if (key === keyBase64) return name;
  }
  for (let n = 2; n < 100; n++) {
    const suffix = `-${String(n)}`;
    const base = channel.slice(0, 1 + MAX_CHANNEL_NAME - suffix.length);
    const candidate = `${base}${suffix}`;
    if (channelKeys[candidate] === undefined) return candidate;
  }
  // 98 rooms sharing one name is not a real scenario; fall back to the name as
  // given rather than looping and letting the last one win.
  return channel;
}

const storage = createMMKV({ id: "chat-store" });

// How long a burst of writes is allowed to collapse into one. See below.
const PERSIST_THROTTLE_MS = 400;

const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => {
    storage.remove(name);
    pendingWrite = null;
    if (writeTimer !== null) {
      clearTimeout(writeTimer);
      writeTimer = null;
    }
  },
};

// Coalesce persistence: a write costs the size of the whole store, not the size
// of what changed.
//
// zustand/persist serialises the entire persisted slice on every set(), which
// here is every channel and thread, up to 200 messages each, JSON-stringified
// and handed to MMKV synchronously on the JS thread. One arriving message pays
// for the room's entire history.
//
// Survivable at conversational speed, and not survivable in the case this app
// exists for: a phone rejoining a busy mesh takes its missed history in a
// burst, and every packet in that burst re-serialises everything received so
// far. Same quadratic append bitchat's conversation-store work removed.
//
// Trailing-edge throttle: at most one write per window, and the last value in
// the window is what lands. Dropping intermediate snapshots is safe because
// each is a complete picture rather than a delta.
let writeTimer: ReturnType<typeof setTimeout> | null = null;
let pendingWrite: { name: string; value: string } | null = null;

const throttledMmkvStorage = {
  getItem: mmkvStorage.getItem,
  removeItem: mmkvStorage.removeItem,
  setItem: (name: string, value: string): void => {
    pendingWrite = { name, value };
    if (writeTimer !== null) return;
    writeTimer = setTimeout(() => {
      writeTimer = null;
      const write = pendingWrite;
      pendingWrite = null;
      if (write !== null) storage.set(write.name, write.value);
    }, PERSIST_THROTTLE_MS);
  },
};

// Force anything still in the window to disk. Called when the app is about to
// stop being able to write - backgrounding, or a deliberate shutdown - because
// a throttle that loses the last 400ms of a conversation on the way out is a
// worse bug than the one it fixes.
export function flushChatPersistence(): void {
  if (writeTimer !== null) {
    clearTimeout(writeTimer);
    writeTimer = null;
  }
  const write = pendingWrite;
  pendingWrite = null;
  if (write !== null) storage.set(write.name, write.value);
}

// Discard anything still in the window without writing it, and drop the
// snapshot from memory.
//
// For the panic wipe. A throttled write holds a complete plaintext snapshot of
// every thread in a module variable until its timer fires, so a wipe that
// leaves it armed is a wipe with a queued write of the data it destroyed.
//
// The current call order happens to be safe, since clearing the store replaces
// the snapshot before any timer can run. Cancelling first makes it true by
// construction instead of by accident.
export function dropPendingChatPersistence(): void {
  if (writeTimer !== null) {
    clearTimeout(writeTimer);
    writeTimer = null;
  }
  pendingWrite = null;
}

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
      mutedChannels: DEFAULT_MUTED_CHANNELS,
      channelKeys: {},
      channelReach: {},
      channelRedirects: {},
      geoDmCells: {},
      geoDmNames: {},
      geoCardExchange: {},

      addChannel(channel: string) {
        set((state) => {
          if (state.channels.includes(channel)) return state;
          return { channels: [...state.channels, channel] };
        });
      },

      resolveChannel(channel: string) {
        return get().channelRedirects[channel] ?? channel;
      },

      joinPrivateChannel(
        channel: string,
        keyBase64: string,
        overNostr: boolean,
      ) {
        const target = freeChannelLabel(get().channelKeys, channel, keyBase64);
        set((state) => ({
          channels: state.channels.includes(target)
            ? state.channels
            : [...state.channels, target],
          channelKeys: { ...state.channelKeys, [target]: keyBase64 },
          channelReach: {
            ...state.channelReach,
            [target]: overNostr ? "ble+nostr" : "ble",
          },
        }));
        return target;
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
          // Keep the unread count consistent: subtract anything lost to trimming.
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

      setMessageStatus(channel, id, status, atMs) {
        set((state) => {
          const existing = state.messages[channel];
          if (existing === undefined) return state;
          let changed = false;
          const next = existing.map((m) => {
            if (m.id !== id) return m;
            // Never move backwards: a stray "delivered" after "read" is ignored.
            // The one exception is an explicit reset to "sending": that is only
            // ever set locally by a retry (never by a late receipt), and it must
            // be allowed to pull a "failed" bubble back so the retry shows its
            // in-progress state instead of staying red. "reclaimed" is exempt
            // from that too: the proofs are back in the sender's wallet, so
            // there is nothing left to retry.
            if (m.status === "reclaimed") return m;
            // "failed" is a local give-up, not a late receipt, so it is exempt
            // from the rank rule in the same way "sending" is - but only over
            // the statuses a give-up can legitimately correct.
            //
            // It ranks BELOW sent/carried/queued, which are exactly the states
            // an undeliverable message sits in, so the rank rule silently
            // discarded every attempt to mark one failed. The bubble kept its
            // hourglass forever over a message the outbox had already dropped,
            // which is the failure the give-up exists to report. It must still
            // never overwrite delivered or read: those are proof the message
            // arrived, and a lost receipt is not a lost message.
            const isLocalGiveUp =
              status === "failed" &&
              (m.status === undefined ||
                STATUS_RANK[m.status] <= STATUS_RANK.queued);
            if (
              m.status !== undefined &&
              status !== "sending" &&
              !isLocalGiveUp &&
              STATUS_RANK[status] < STATUS_RANK[m.status]
            ) {
              return m;
            }
            changed = true;
            return {
              ...m,
              status,
              ...(status === "delivered" && atMs !== undefined
                ? { deliveredAtMs: atMs }
                : {}),
              ...(status === "read" && atMs !== undefined
                ? { readAtMs: atMs }
                : {}),
            };
          });
          if (!changed) return state;
          return { messages: { ...state.messages, [channel]: next } };
        });
      },

      removeMessage(channel, id) {
        set((state) => {
          const existing = state.messages[channel];
          if (existing === undefined) return state;
          const next = existing.filter((m) => m.id !== id);
          if (next.length === existing.length) return state;
          return { messages: { ...state.messages, [channel]: next } };
        });
      },

      failStaleSending(olderThanMs, now = Date.now()) {
        set((state) => {
          const messages: Record<string, ChatMessage[]> = {};
          let changed = false;
          for (const [channel, list] of Object.entries(state.messages)) {
            let touched = false;
            const next = list.map((m) => {
              if (m.status !== "sending") return m;
              if (now - m.timestampMs < olderThanMs) return m;
              touched = true;
              return { ...m, status: "failed" as const };
            });
            messages[channel] = touched ? next : list;
            if (touched) changed = true;
          }
          return changed ? { messages } : state;
        });
      },

      setActiveChannel(channel: string) {
        set({ activeChannel: channel });
      },

      removeChannel(channel: string) {
        // Leaving takes the key, so who else held it is no longer ours to
        // keep. Rejoining rebuilds the roster from live traffic.
        useChannelMembersStore.getState().clearChannel(channel);
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
          const channelKeys = { ...state.channelKeys };
          delete channelKeys[channel];
          const channelReach = { ...state.channelReach };
          delete channelReach[channel];
          // A deleted geohash DM must not leave its cell behind. The binding is
          // a record of where we were when we spoke to someone, and outliving
          // the conversation it belongs to is exactly the kind of location
          // breadcrumb the per-cell identities exist to avoid.
          const geoDmCells = { ...state.geoDmCells };
          const geoDmNames = { ...state.geoDmNames };
          const geoCardExchange = { ...state.geoCardExchange };
          const geoKey = channel.replace(/^dm:nostr_/, "");
          delete geoDmCells[geoKey];
          delete geoDmNames[geoKey];
          delete geoCardExchange[geoKey];
          // Clear activeChannel rather than reassigning it to some arbitrary
          // surviving channel. Picking the first non-DM channel (usually
          // #bluetooth) while the user sits on the LIST view is wrong, because
          // addMessage suppresses the unread bump for the
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
            channelKeys,
            channelReach,
            geoDmCells,
            geoDmNames,
            geoCardExchange,
            activeChannel,
          };
        });
      },

      renameChannel(oldName: string, newName: string) {
        // Normalise: ensure exactly one leading #.
        const clean = "#" + newName.replace(/^#+/, "");
        // Decide OUTSIDE set() so the result can be reported. Silently no-opping
        // on a collision lets the caller carry on as if it worked: renaming #foo
        // onto an existing #bar leaves #foo untouched and overwrites #bar's
        // description with #foo's drafts.
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
          const mutedChannels = state.mutedChannels.includes(oldName)
            ? state.mutedChannels.map((c) => (c === oldName ? clean : c))
            : state.mutedChannels;
          // The encryption key and reach MUST follow the rename: the name is a
          // local label, the key is the channel's real identity. Dropping it
          // would silently turn a private channel keyless (unable to decrypt its
          // own traffic) and lose its Bluetooth+Internet reach.
          const channelKeys = { ...state.channelKeys };
          if (channelKeys[oldName] !== undefined) {
            channelKeys[clean] = channelKeys[oldName];
            delete channelKeys[oldName];
          }
          const channelReach = { ...state.channelReach };
          if (channelReach[oldName] !== undefined) {
            channelReach[clean] = channelReach[oldName];
            delete channelReach[oldName];
          }
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
            mutedChannels,
            channelKeys,
            channelReach,
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

      // Fold one thread into another when an announce ties two channel keys to
      // the same person.
      //
      // `from` may be the thread the user has open: a conversation carried over
      // Nostr before this peer was seen on Bluetooth is merged the moment they
      // walk into range. So the pointers move with the messages, or the open
      // thread renders a channel that no longer exists.
      noteGeoCardExchange(
        pubkey: string,
        half: { theirPeerID?: string; sentMine?: boolean },
      ) {
        set((state) => ({
          geoCardExchange: {
            ...state.geoCardExchange,
            [pubkey]: { ...state.geoCardExchange[pubkey], ...half },
          },
        }));
      },

      clearGeoCardExchange(pubkey: string) {
        set((state) => {
          const geoCardExchange = { ...state.geoCardExchange };
          delete geoCardExchange[pubkey];
          // The cell and the pseudonym's name go with it: once the conversation
          // is durable it resolves through their contact, so both are just a
          // record of where we met and what they called themselves there.
          const geoDmCells = { ...state.geoDmCells };
          const geoDmNames = { ...state.geoDmNames };
          delete geoDmCells[pubkey];
          delete geoDmNames[pubkey];
          return { geoCardExchange, geoDmCells, geoDmNames };
        });
      },

      setGeoDmCell(pubkey: string, geohash: string, displayName?: string) {
        // Guarded, because the inbound geo-DM path calls this on every message
        // and the store's writes reach disk. Only a genuinely new binding, or a
        // name we did not have, is worth one.
        const state = get();
        const cellUnchanged = state.geoDmCells[pubkey] === geohash;
        const named = displayName !== undefined && displayName.length > 0;
        const nameUnchanged =
          !named || state.geoDmNames[pubkey] === displayName;
        if (cellUnchanged && nameUnchanged) return;
        set((s) => ({
          geoDmCells: { ...s.geoDmCells, [pubkey]: geohash },
          geoDmNames: named
            ? { ...s.geoDmNames, [pubkey]: displayName }
            : s.geoDmNames,
        }));
      },

      mergeChannel(from: string, to: string) {
        if (from === to) return;
        // Reading either name means reading the merged conversation, so nothing
        // folded in is unread. Same rule addMessage applies per message.
        const readingTarget =
          get().activeChannel === from || get().activeChannel === to;
        // Chained merges collapse, so a thread merged twice resolves in one hop
        // rather than pointing at another alias.
        function redirectsAfterMerge(
          existing: Record<string, string>,
        ): Record<string, string> {
          const next: Record<string, string> = {};
          for (const [alias, target] of Object.entries(existing)) {
            if (alias === to) continue; // `to` is live again; it is not an alias
            next[alias] = target === from ? to : target;
          }
          next[from] = to;
          return next;
        }
        useActivityStore.getState().repointChannel(from, to);
        set((state) => {
          const followed = {
            channelRedirects: redirectsAfterMerge(state.channelRedirects),
            activeChannel:
              state.activeChannel === from ? to : state.activeChannel,
            lastThread: state.lastThread === from ? to : state.lastThread,
          };
          const source = state.messages[from];
          if (source === undefined || source.length === 0) {
            // Nothing to move, but still drop the empty source channel.
            if (!(from in state.messages) && !state.channels.includes(from)) {
              return followed;
            }
            const messages = { ...state.messages };
            delete messages[from];
            const unreadCounts = { ...state.unreadCounts };
            delete unreadCounts[from];
            return {
              ...followed,
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
          unreadCounts[to] = readingTarget
            ? 0
            : (unreadCounts[to] ?? 0) + (unreadCounts[from] ?? 0);
          delete unreadCounts[from];

          const channels = state.channels.filter((c) => c !== from);
          return {
            ...followed,
            messages,
            unreadCounts,
            channels: channels.includes(to) ? channels : [...channels, to],
          };
        });
      },

      // Opening a conversation clears both records of it: the unread count on
      // its row and its rows in the bell. The OS notification for the channel
      // is dismissed at the same moment (dismissNotificationsFor).
      markChannelRead(channel: string) {
        useActivityStore.getState().markChannelSeen(channel);
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
          mutedChannels: DEFAULT_MUTED_CHANNELS,
          channelKeys: {},
          channelReach: {},
          channelRedirects: {},
          geoDmCells: {},
          geoDmNames: {},
          geoCardExchange: {},
        });
      },
    }),
    {
      name: "airhop-chat",
      storage: createJSONStorage(() => throttledMmkvStorage),
      // Only what is worth surviving a restart. `activeChannel` is deliberately
      // excluded: it is where the user is looking right now, not history, and
      // persisting it means every thread switch rewrites the entire store.
      partialize: (state) => ({
        channels: state.channels,
        messages: state.messages,
        lastThread: state.lastThread,
        unreadCounts: state.unreadCounts,
        channelDescriptions: state.channelDescriptions,
        pinnedChannels: state.pinnedChannels,
        mutedChannels: state.mutedChannels,
        channelKeys: state.channelKeys,
        channelReach: state.channelReach,
        // Persisted: a notification in the shade, the last-thread restore and
        // an old bell row all outlive the session holding a stale name.
        channelRedirects: state.channelRedirects,
        // Persisted for the reason given on the field: without it, a relaunch
        // turns a reply to a location-channel DM into a message from our
        // durable identity.
        geoDmCells: state.geoDmCells,
        geoDmNames: state.geoDmNames,
        // Persisted alongside it: a half-finished exchange has to survive a
        // relaunch, or tapping Keep and reopening the app would offer it again
        // and merge nothing.
        geoCardExchange: state.geoCardExchange,
      }),
    },
  ),
);
