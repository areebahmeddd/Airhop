// Transient store for Nostr location notes (kind-1 notes tagged to a geohash).
//
// This is the online half of the notices sheet: bitchat bridges geohash board
// posts to Nostr as kind-1 notes and also lets people post standalone location
// notes. We subscribe per active geo cell (geohash-channel-service) and drop the
// results here. Not persisted: these are re-fetched from relays on every
// subscribe, and NIP-40 expiries are enforced client-side because relays are not
// required to. The board's own signed posts live in board-store; the UI merges
// the two, preferring the board copy of a bridged note.

import { create } from "zustand";

export interface LocationNote {
  id: string; // Nostr event id
  pubkey: string; // per-cell author pubkey (unlinkable)
  content: string;
  createdAtMs: number;
  nickname?: string;
  // The matched `g` tag: can be a neighbor of the subscribed cell.
  geohash: string;
  // NIP-40 expiration in ms, when the note carries one.
  expiresAtMs?: number;
  isUrgent: boolean;
}

// Defensive cap per cell (relay limit is 200).
const MAX_NOTES_PER_CELL = 500;

interface NoticesState {
  notesByGeohash: Record<string, LocationNote[]>;
  seenIDs: Record<string, true>;

  addNote: (note: LocationNote) => void;
  notesForGeohash: (geohash: string) => LocationNote[];
  removeNote: (id: string) => void;
  clearGeohash: (geohash: string) => void;
  clearAll: () => void;
}

function pruneExpired(notes: LocationNote[], now: number): LocationNote[] {
  return notes.filter(
    (n) => n.expiresAtMs === undefined || n.expiresAtMs > now,
  );
}

export const useNoticesStore = create<NoticesState>((set, get) => ({
  notesByGeohash: {},
  seenIDs: {},

  addNote(note: LocationNote) {
    if (get().seenIDs[note.id]) return; // O(1) duplicate rejection
    const now = Date.now();
    if (note.expiresAtMs !== undefined && note.expiresAtMs <= now) return;
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

  clearGeohash(geohash: string) {
    set((state) => {
      const next = { ...state.notesByGeohash };
      delete next[geohash];
      return { notesByGeohash: next };
    });
  },

  clearAll() {
    set({ notesByGeohash: {}, seenIDs: {} });
  },
}));
