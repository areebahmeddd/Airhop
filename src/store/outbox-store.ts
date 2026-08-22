// Pending outbound DMs awaiting a route to their recipient.
//
// `MessageRouter.sendDm` returns "needs-courier" when a peer has no Noise
// session, no WiFi or BLE link and no known Nostr pubkey. This store is the queue
// behind the "queued for delivery" the UI shows for that case: MeshService
// enqueues on failure and flushes when the peer becomes reachable again, either
// through their ANNOUNCE or once a Noise or Double Ratchet session exists.
// Without it that promise is a lie and every out-of-range DM is lost.
//
// Persisted, because "I'll deliver this when they're back in range" has to
// survive an app restart to mean anything.
//
// This is deliberately NOT the full store-and-forward courier described in the
// architecture docs (sealed envelopes relayed via third-party peers). It covers
// the case that actually matters day to day, the recipient becoming reachable
// again, without trusting intermediates to carry ciphertext.

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getStorage } from "./mmkv";

export interface PendingMessage {
  // Mirrors the ChatMessage id so the UI can reconcile delivery state.
  id: string;
  recipientPeerID: string;
  channel: string;
  text: string;
  createdAtMs: number;
  attempts: number;
}

// Give up after this long. A week-old "hi" is noise, not a message.
export const OUTBOX_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Hard cap PER RECIPIENT, so a long offline stretch cannot grow the store
// without bound.
//
// Per recipient rather than global, matching bitchat's maxMessagesPerPeer. A
// single global cap evicted the OLDEST entry whatever it was, so one chatty
// unreachable peer silently deleted somebody else's queued mail - and the
// sender was never told, because eviction is invisible. A per-peer cap makes
// the cost of an unreachable conversation land on that conversation.
export const MAX_PENDING_PER_PEER = 100;

// How many real send opportunities a message gets before it is called failed.
//
// bitchat's number, and now bitchat's meaning. An attempt is charged only when
// something actually went out over a route that could have acknowledged it: the
// courier branch, which sends nothing, does not charge, and neither does the
// expiry timer, which no longer sends at all. Retries fire on delivery
// opportunities - a peer announcing, the app coming forward, relays
// reconnecting - so eight of them is eight genuine chances, not eight ticks of
// a clock.
//
// Getting that ordering wrong is what makes this constant dangerous: charged
// per timer tick it turns a seven-day queue into six minutes and marks messages
// failed that relays have already published. Charged per opportunity it bounds
// both retention and airtime, which is the job it does in bitchat.
export const MAX_SEND_ATTEMPTS = 8;

interface OutboxState {
  pending: PendingMessage[];

  enqueue: (msg: Omit<PendingMessage, "attempts">) => void;
  // Remove a message once it has actually gone out.
  resolve: (id: string) => void;
  // Everything still owed to a given peer, oldest first.
  forPeer: (peerID: string) => PendingMessage[];
  markAttempted: (id: string) => void;
  // Drop anything past OUTBOX_TTL_MS or MAX_SEND_ATTEMPTS, and report what
  // was dropped so the sender's bubble can stop claiming it is still coming.
  //
  // Returning the dropped entries rather than swallowing them is the point: an
  // expired message disappearing from the queue while its bubble keeps the
  // hourglass forever is the same silent-loss shape the queue exists to prevent.
  // Called before each flush.
  evictExpired: (nowMs?: number) => PendingMessage[];
  clearAll: () => void;
}

const storage = getStorage("outbox-store");

const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const useOutboxStore = create<OutboxState>()(
  persist(
    (set, get) => ({
      pending: [],

      enqueue(msg) {
        set((state) => {
          // Same id already queued: keep the original attempt count.
          if (state.pending.some((p) => p.id === msg.id)) return state;
          const next = [...state.pending, { ...msg, attempts: 0 }];
          // Oldest-first eviction, within this recipient only.
          const mine = next.filter(
            (p) => p.recipientPeerID === msg.recipientPeerID,
          );
          if (mine.length <= MAX_PENDING_PER_PEER) return { pending: next };
          const doomed = new Set(
            mine.slice(0, mine.length - MAX_PENDING_PER_PEER).map((p) => p.id),
          );
          return { pending: next.filter((p) => !doomed.has(p.id)) };
        });
      },

      resolve(id) {
        set((state) => ({ pending: state.pending.filter((p) => p.id !== id) }));
      },

      forPeer(peerID) {
        return get()
          .pending.filter((p) => p.recipientPeerID === peerID)
          .sort((a, b) => a.createdAtMs - b.createdAtMs);
      },

      markAttempted(id) {
        set((state) => ({
          pending: state.pending.map((p) =>
            p.id === id ? { ...p, attempts: p.attempts + 1 } : p,
          ),
        }));
      },

      evictExpired(nowMs = Date.now()) {
        const cutoff = nowMs - OUTBOX_TTL_MS;
        const dropped = get().pending.filter(
          (p) => p.createdAtMs < cutoff || p.attempts >= MAX_SEND_ATTEMPTS,
        );
        if (dropped.length === 0) return [];
        const doomed = new Set(dropped.map((p) => p.id));
        set((state) => ({
          pending: state.pending.filter((p) => !doomed.has(p.id)),
        }));
        return dropped;
      },

      clearAll() {
        set({ pending: [] });
      },
    }),
    {
      name: "outbox-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
