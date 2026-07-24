// Bookmarked geohash cells. Persisted so a saved place survives a restart and
// can be reopened from the "Go to a place" sheet even after the user has left
// the channel. Mirrors bitchat's GeohashBookmarksStore: a plain list of cells
// the user chose to keep, newest first.
//
// Only the bare geohash is stored. Its human-readable place name is resolved
// separately and cached in place-names-store, so a bookmark never depends on a
// name being available.
//
// Panic wipe clears this, since a bookmark reveals a place the user cares about.

import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GeohashBookmarksState {
  // Geohash cells, newest first.
  bookmarks: string[];
  isBookmarked: (geohash: string) => boolean;
  toggle: (geohash: string) => void;
  remove: (geohash: string) => void;
  clearAll: () => void;
}

const storage = createMMKV({ id: "geohash-bookmarks-store" });

const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const useGeohashBookmarksStore = create<GeohashBookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      isBookmarked(geohash: string) {
        return get().bookmarks.includes(geohash);
      },

      toggle(geohash: string) {
        set((state) =>
          state.bookmarks.includes(geohash)
            ? { bookmarks: state.bookmarks.filter((g) => g !== geohash) }
            : { bookmarks: [geohash, ...state.bookmarks] },
        );
      },

      remove(geohash: string) {
        set((state) => ({
          bookmarks: state.bookmarks.filter((g) => g !== geohash),
        }));
      },

      clearAll() {
        set({ bookmarks: [] });
      },
    }),
    {
      name: "geohash-bookmarks-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
