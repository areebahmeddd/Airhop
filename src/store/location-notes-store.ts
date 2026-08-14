// Transient store for Nostr location notes (kind-1 notes tagged to a geohash).
//
// This is the online half of the notices sheet: bitchat bridges geohash board
// posts to Nostr as kind-1 notes and also lets people post standalone location
// notes. We subscribe per active geo cell (geohash-channel-service) and drop the
// results here. Not persisted: these are re-fetched from relays on every
// subscribe, and NIP-40 expiries are enforced client-side because relays are not
// required to. The board's own signed posts live in board-store; the UI merges
// the two, preferring the board copy of a bridged note.
//
// A geohash notice exists twice, and the two copies are retracted by different
// mechanisms, so both are honoured here:
//
//   the board post    a signed BOARD_POST tombstone flooded over BLE, applied
//                     by `suppressBridged` (board-store calls it)
//   the bridged note  a NIP-09 kind-5 deletion, applied by `removeNote`
//                     (the geohash subscription calls it)
//
// The tombstone is the one that needs care: the merge hides the note only while
// a matching board post exists, so retiring the post alone un-hides the copy.

import { create } from "zustand";

// Grouped identity, then body, then place, then time, so the two timestamps sit
// together and every literal that builds one reads in the same order.
export interface LocationNote {
  id: string; // Nostr event id
  pubkey: string; // per-cell author pubkey (unlinkable)
  nickname?: string;

  content: string;
  isUrgent: boolean;

  // The matched `g` tag, which can be a neighbour of the subscribed cell.
  geohash: string;

  createdAtMs: number;
  // NIP-40 expiration in ms, when the note carries one.
  expiresAtMs?: number;
}

// A bridged copy is a same-content note signed by an unlinkable key, so the two
// share no identifier and are matched on content, author name and closeness in
// time. Exported because the sheet's merge and a tombstone must use one rule.
export const BRIDGE_DEDUPE_MS = 15 * 60 * 1000;

// A board post lives at most 7 days, so a suppression is useless past that.
const SUPPRESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

// Defensive cap per cell (relay limit is 200).
const MAX_NOTES_PER_CELL = 500;
// Bound on retracted-notice fingerprints, oldest evicted first.
const MAX_SUPPRESSIONS = 500;

// The identifying shape of a bridged note, taken from its board post.
export interface BridgedNoticeFingerprint {
  geohash: string;
  content: string;
  nickname: string;
  createdAtMs: number;
}

// Normalized author name, so a blank nickname on either copy compares equal.
export function noticeAuthor(nickname: string | undefined): string {
  return (nickname ?? "").trim() || "anon";
}

// Whether the note is the bridged copy this fingerprint describes. The geohash
// must match exactly: the subscription also surfaces neighbouring cells, where
// a same-text note is a different notice.
export function matchesBridged(
  fingerprint: BridgedNoticeFingerprint,
  note: {
    geohash: string;
    content: string;
    nickname?: string;
    createdAtMs: number;
  },
): boolean {
  return (
    fingerprint.geohash === note.geohash &&
    fingerprint.content === note.content &&
    fingerprint.nickname === noticeAuthor(note.nickname) &&
    Math.abs(fingerprint.createdAtMs - note.createdAtMs) <= BRIDGE_DEDUPE_MS
  );
}

interface NoticesState {
  notesByGeohash: Record<string, LocationNote[]>;
  seenIDs: Record<string, true>;
  // Notices retracted by a board tombstone. Kept rather than applied once,
  // because relays re-serve the bridged note on every subscribe.
  suppressed: BridgedNoticeFingerprint[];

  addNote: (note: LocationNote) => void;
  notesForGeohash: (geohash: string) => LocationNote[];
  removeNote: (id: string) => void;
  // A board tombstone landed: drop the bridged copy and keep it dropped.
  suppressBridged: (fingerprint: BridgedNoticeFingerprint) => void;
  clearGeohash: (geohash: string) => void;
  clearAll: () => void;
}

function pruneExpired(notes: LocationNote[], now: number): LocationNote[] {
  return notes.filter(
    (n) => n.expiresAtMs === undefined || n.expiresAtMs > now,
  );
}

export const useLocationNotesStore = create<NoticesState>((set, get) => ({
  notesByGeohash: {},
  seenIDs: {},
  suppressed: [],

  addNote(note: LocationNote) {
    if (get().seenIDs[note.id]) return; // O(1) duplicate rejection
    const now = Date.now();
    if (note.expiresAtMs !== undefined && note.expiresAtMs <= now) return;
    // Already retracted. A relay need not honour a NIP-09 deletion, and a
    // tombstone never reaches relays at all, so the note will be served again
    // and the check belongs on the way in.
    if (get().suppressed.some((f) => matchesBridged(f, note))) {
      set((state) => ({ seenIDs: { ...state.seenIDs, [note.id]: true } }));
      return;
    }
    set((state) => {
      const existing = state.notesByGeohash[note.geohash] ?? [];
      const merged = pruneExpired([note, ...existing], now)
        .sort((a, b) => b.createdAtMs - a.createdAtMs)
        .slice(0, MAX_NOTES_PER_CELL);
      return {
        notesByGeohash: { ...state.notesByGeohash, [note.geohash]: merged },
        seenIDs: { ...state.seenIDs, [note.id]: true },
      };
    });
  },

  notesForGeohash(geohash: string): LocationNote[] {
    const now = Date.now();
    const notes = get().notesByGeohash[geohash] ?? [];
    const live = pruneExpired(notes, now);
    if (live.length !== notes.length) {
      set((state) => ({
        notesByGeohash: { ...state.notesByGeohash, [geohash]: live },
      }));
    }
    return live;
  },

  removeNote(id: string) {
    set((state) => {
      const next: Record<string, LocationNote[]> = {};
      for (const [gh, notes] of Object.entries(state.notesByGeohash)) {
        next[gh] = notes.filter((n) => n.id !== id);
      }
      // Keep the id in seenIDs so a relay replay cannot resurrect it.
      return { notesByGeohash: next };
    });
  },

  suppressBridged(fingerprint: BridgedNoticeFingerprint) {
    set((state) => {
      const now = Date.now();
      const live = state.suppressed.filter(
        (f) => f.createdAtMs + SUPPRESSION_LIFETIME_MS > now,
      );
      const suppressed = [...live, fingerprint].slice(-MAX_SUPPRESSIONS);

      const notes = state.notesByGeohash[fingerprint.geohash];
      if (notes === undefined) return { suppressed };
      const kept = notes.filter((n) => !matchesBridged(fingerprint, n));
      if (kept.length === notes.length) return { suppressed };
      return {
        suppressed,
        notesByGeohash: {
          ...state.notesByGeohash,
          [fingerprint.geohash]: kept,
        },
      };
    });
  },

  clearGeohash(geohash: string) {
    set((state) => {
      const next = { ...state.notesByGeohash };
      delete next[geohash];
      return { notesByGeohash: next };
    });
  },

  clearAll() {
    set({ notesByGeohash: {}, seenIDs: {}, suppressed: [] });
  },
}));
