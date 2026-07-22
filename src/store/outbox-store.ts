// Pending outbound DMs awaiting a route to their recipient.
//
// Why this exists: `MessageRouter.sendDm` returns "needs-courier" when a peer
// has no Noise session, no WiFi/BLE link and no known Nostr pubkey. That result
// used to be discarded. The UI claimed "queued for delivery" while the message
// was dropped on the floor and never retried, even when the peer walked back
// into range seconds later. Every out-of-range DM was silently lost.
//
// This store is the actual queue behind that promise. MeshService enqueues on
// failure and flushes when a peer becomes reachable again (their ANNOUNCE
// arrives, or a Noise/Double-Ratchet session is established).
//
// Persisted, because "I'll deliver this when they're back in range" has to
// survive an app restart to mean anything.
//
// This is deliberately NOT the full store-and-forward courier described in the
// architecture docs (sealed envelopes relayed via third-party peers). It covers
// the case that actually matters day to day, the recipient becoming reachable
// again, without trusting intermediates to carry ciphertext.

import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

// Hard cap so a long offline stretch can't grow the store without bound.
const MAX_PENDING = 500;

interface OutboxState {
  pending: PendingMessage[];

  enqueue: (msg: Omit<PendingMessage, "attempts">) => void;
  // Remove a message once it has actually gone out.
  resolve: (id: string) => void;
  // Everything still owed to a given peer, oldest first.
  forPeer: (peerID: string) => PendingMessage[];
  markAttempted: (id: string) => void;
  // Drop anything past OUTBOX_TTL_MS. Called before each flush.
  evictExpired: (nowMs?: number) => void;
  clearAll: () => void;
}

const storage = createMMKV({ id: "outbox-store" });

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
          // Oldest-first eviction when over the cap.
          return {
            pending:
              next.length > MAX_PENDING ? next.slice(-MAX_PENDING) : next,
          };
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
        set((state) => {
          const cutoff = nowMs - OUTBOX_TTL_MS;
          const kept = state.pending.filter((p) => p.createdAtMs >= cutoff);
          return kept.length === state.pending.length
            ? state
            : { pending: kept };
        });
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
