// Activity feed: the history behind the bell icon.
//
// Every inbound message from someone else is logged here as one entry, so the
// bell screen can show a running list of what happened while you were away, the
// way Instagram's activity tab or any chat app's notification history does. It
// spans both DMs and channels because a notification can come from either.
//
// This is a view-side convenience log, not a source of truth: the messages
// themselves live in chat-store. Persisted so the history survives a restart,
// and capped so a busy channel can't grow it without bound.

import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ActivityEntry {
  // The originating message id, so the same message is never logged twice.
  id: string;
  // "dm:<peerID>" or "#channel". What a tap on the row should open.
  channel: string;
  isDM: boolean;
  senderID: string;
  senderNickname: string;
  // One-line preview (text, or a media summary like "Photo").
  preview: string;
  timestampMs: number;
  // False until the user has opened the bell screen and seen it.
  seen: boolean;
  // "message" (default) or "notice" (a board/bulletin post). Lets the bell and
  // the per-room board-icon badge tell the two apart.
  kind?: "message" | "notice";
  // For notices only: the board's geohash ("" = the mesh-local board). Used to
  // badge the right room's board icon and to mark a room's notices seen.
  geohash?: string;
}

// Newest entries kept; older ones fall off. Enough to scroll a meaningful
// history without letting a chatty channel balloon storage.
const MAX_ENTRIES = 100;

interface ActivityState {
  // Newest first.
  entries: ActivityEntry[];
  record: (entry: Omit<ActivityEntry, "seen">) => void;
  markAllSeen: () => void;
  // Mark every notice for one board (geohash, "" = mesh) as seen. Called when
  // the user opens that room's notices sheet, so its board-icon badge clears.
  markNoticesSeen: (geohash: string) => void;
  unseenCount: () => number;
  // Count of unseen notices for one board, for the per-room board-icon badge.
  unseenNoticesFor: (geohash: string) => number;
  clearAll: () => void;
}

const storage = createMMKV({ id: "activity-store" });

const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      entries: [],

      record(entry) {
        set((state) => {
          // Dedupe by message id: the same message can reach us over several
          // mesh paths, and it should log once.
          if (state.entries.some((e) => e.id === entry.id)) return state;
          const next = [{ ...entry, seen: false }, ...state.entries];
          return { entries: next.slice(0, MAX_ENTRIES) };
        });
      },

      markAllSeen() {
        set((state) => {
          if (state.entries.every((e) => e.seen)) return state;
          return { entries: state.entries.map((e) => ({ ...e, seen: true })) };
        });
      },

      markNoticesSeen(geohash) {
        set((state) => {
          let changed = false;
          const entries = state.entries.map((e) => {
            if (
              e.kind === "notice" &&
              (e.geohash ?? "") === geohash &&
              !e.seen
            ) {
              changed = true;
              return { ...e, seen: true };
            }
            return e;
          });
          return changed ? { entries } : state;
        });
      },

      unseenCount() {
        return get().entries.reduce((n, e) => (e.seen ? n : n + 1), 0);
      },

      unseenNoticesFor(geohash) {
        return get().entries.reduce(
          (n, e) =>
            e.kind === "notice" && (e.geohash ?? "") === geohash && !e.seen
              ? n + 1
              : n,
          0,
        );
      },

      clearAll() {
        set({ entries: [] });
      },
    }),
    {
      name: "activity",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
