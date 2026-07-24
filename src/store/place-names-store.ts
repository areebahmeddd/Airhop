// Human-readable names for geohash cells, e.g. "tdr1k" -> "Kumaraswamy Layout".
//
// A location channel is scoped by a geohash, which is precise but unreadable. We
// reverse-geocode the cell's centre once (best-effort, device-side) and cache
// the result, so the UI can show "~Kumaraswamy Layout" beside the coverage tag,
// matching how bitchat labels its location channels.
//
// Geocoding is best-effort: it needs a network round-trip and a platform
// geocoder, and either can be unavailable. Every failure resolves to no name and
// the UI simply omits it. A successful lookup is cached (a geohash cell maps to
// the same place forever), so we never geocode the same cell twice. Raw
// coordinates never leave the device: only the cell's centre is geocoded, and it
// is derived from the geohash the app already knows.

import * as Location from "expo-location";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { decodeGeohash } from "../core/nostr/presence";

interface PlaceNamesState {
  // geohash -> resolved place name.
  names: Record<string, string>;
  // Kick off a best-effort lookup for a cell if we do not already have one.
  resolve: (geohash: string) => void;
  clearAll: () => void;
}

// Cells whose lookup is in flight this session, so concurrent renders of the
// same channel do not each fire a geocode. Not persisted: it is purely a
// de-dupe guard for the current process.
const inFlight = new Set<string>();

// Pick the address component that matches the cell's coverage. A 2-char cell is
// a whole region, a 5-char cell a city, a 7-char cell a block, so the useful
// label differs by length. Mirrors bitchat's per-level naming.
function pickName(
  geohash: string,
  a: Location.LocationGeocodedAddress,
): string | null {
  const n = geohash.length;
  let name: string | null;
  if (n <= 2) name = a.region ?? a.country;
  else if (n <= 4) name = a.region ?? a.subregion ?? a.city;
  else if (n === 5) name = a.city ?? a.subregion ?? a.region;
  else if (n === 6) name = a.district ?? a.city ?? a.subregion;
  else name = a.district ?? a.name ?? a.street ?? a.city;
  const trimmed = name?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

const storage = createMMKV({ id: "place-names-store" });

const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const usePlaceNamesStore = create<PlaceNamesState>()(
  persist(
    (set, get) => ({
      names: {},

      resolve(geohash: string) {
        if (geohash.length === 0) return;
        if (get().names[geohash] !== undefined || inFlight.has(geohash)) return;
        inFlight.add(geohash);
        void (async () => {
          try {
            const { lat, lng } = decodeGeohash(geohash);
            const results = await Location.reverseGeocodeAsync({
              latitude: lat,
              longitude: lng,
            });
            const first = results[0];
            const name = first ? pickName(geohash, first) : null;
            if (name !== null) {
              set((state) => ({ names: { ...state.names, [geohash]: name } }));
            }
          } catch {
            // Geocoder or network unavailable: leave it unresolved so a later
            // session can try again. The UI just omits the name meanwhile.
          } finally {
            inFlight.delete(geohash);
          }
        })();
      },

      clearAll() {
        inFlight.clear();
        set({ names: {} });
      },
    }),
    {
      name: "place-names-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
