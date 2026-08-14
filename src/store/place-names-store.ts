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

import { decodeGeohash } from "@core/nostr/geohash-presence";
import * as Location from "expo-location";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// The device's language, resolved on first use and then reused.
//
// Read through Intl rather than a localization package: this is the only
// consumer of it in the app, and Hermes implements DateTimeFormat on both
// platforms, backed by android.icu and NSFoundation. The value is only ever a
// cache key, so what matters is that it differs between languages, not that it
// is a well-formed BCP-47 tag.
//
// Resolved lazily rather than at module scope so that importing this store
// costs nothing. It is imported by the panic wipe, which runs on paths where
// no place name is ever looked up.
let deviceLocale: string | null = null;

function getDeviceLocale(): string {
  if (deviceLocale === null) {
    try {
      deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    } catch {
      deviceLocale = "en";
    }
  }
  return deviceLocale;
}

// Cache keys fold in the language the name was resolved in.
//
// Reverse geocoding is done by the OS, and both platforms answer in the
// device's language: iOS CLGeocoder follows the bundle's preferred
// localization and Android's Geocoder follows the default Locale, and neither
// takes a locale argument. So a cell resolved while the phone was in English
// stays "Kumaraswamy Layout" and one resolved in Hindi comes back in
// Devanagari.
//
// Keyed on the geohash alone the cache never expires, so changing the phone's
// language leaves every seen channel labelled in the old one permanently. Keying
// on the language makes a change re-resolve, and keeps both spellings for the
// user who switches back and forth.
//
// The language is sampled once per process, so a change made while Airhop is
// running lands on the next launch rather than immediately. That is the cheap
// end of the trade and still strictly better than never.
export function placeNameKey(geohash: string): string {
  return `${getDeviceLocale()}|${geohash}`;
}

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
        const key = placeNameKey(geohash);
        if (get().names[key] !== undefined || inFlight.has(key)) return;
        inFlight.add(key);
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
              set((state) => ({ names: { ...state.names, [key]: name } }));
            }
          } catch {
            // Geocoder or network unavailable: leave it unresolved so a later
            // session can try again. The UI just omits the name meanwhile.
          } finally {
            inFlight.delete(key);
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
