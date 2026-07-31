// Where each phone is standing.
//
// This exists because its absence quietly disabled two whole features. Every
// simulation file mocked `expo-location` as `{}`, so `getCoarseLocation()`
// returned null, so the named location channels (#block through #region)
// resolved to no geohash cell at all. geohash-channel-service says so plainly:
// "with location denied, the NAMED channels resolve to no cell". No cell means
// nothing is published to Nostr, which means a gateway has nothing to uplink
// and a bridge has no rendezvous cell to meet in.
//
// Scenarios written against that mock could only ever assert that nothing
// happened. Placing the phones somewhere is what makes the internet gateway and
// the mesh bridge testable at all.
//
// Coordinates are per phone, so two devices can share a cell (neighbours) or
// sit in different ones (different cities), which is the distinction both
// features are built around.

export interface Coords {
  lat: number;
  lng: number;
}

// A few real places, far enough apart to land in different geohash cells at
// every precision the app uses.
export const PLACES: Record<string, Coords> = {
  // Bengaluru, and a second point ~1km away: same city cell, different block.
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bengaluruNorth: { lat: 12.9816, lng: 77.5946 },
  // Far enough to share nothing.
  london: { lat: 51.5074, lng: -0.1278 },
  tokyo: { lat: 35.6762, lng: 139.6503 },
};

interface DeviceLocation {
  coords: Coords | null;
  granted: boolean;
}

class LocationRegistry {
  private readonly byDevice = new Map<string, DeviceLocation>();

  place(deviceID: string, coords: Coords | null, granted = true): void {
    this.byDevice.set(deviceID, { coords, granted });
  }

  // Location permission refused, which must degrade the named channels rather
  // than break the app.
  deny(deviceID: string): void {
    this.byDevice.set(deviceID, { coords: null, granted: false });
  }

  forDevice(deviceID: string | null): DeviceLocation {
    if (deviceID === null) return { coords: null, granted: false };
    return this.byDevice.get(deviceID) ?? { coords: null, granted: false };
  }

  reset(): void {
    this.byDevice.clear();
  }
}

// Process-wide for the same reason the event router is: a `jest.mock` factory
// runs in whichever registry first requires the mocked module, so a module-level
// singleton can be duplicated. globalThis cannot.
const KEY = "__airhopSimLocationRegistry";

function registry(): LocationRegistry {
  const g = globalThis as Record<string, unknown>;
  let existing = g[KEY] as LocationRegistry | undefined;
  if (existing === undefined) {
    existing = new LocationRegistry();
    g[KEY] = existing;
  }
  return existing;
}

export function locations(): LocationRegistry {
  return registry();
}

// The module body a test file installs in place of `expo-location`.
//
// Each sandbox gets its own instance (expo modules ARE isolated per module
// registry - the in-memory filesystem relies on the same thing), so the phone
// it belongs to is bound once at build time rather than inferred at call time.
// Position lookups happen on timers deep inside the geohash service, not on a
// native callback, so there is no reliable "who is running" frame to read.
export function expoLocationMock(): unknown {
  const GRANTED = "granted";
  const DENIED = "denied";
  let boundDevice: string | null = null;
  const me = (): DeviceLocation => registry().forDevice(boundDevice);
  const position = (): unknown => {
    const here = me().coords;
    if (here === null) return null;
    return {
      coords: { latitude: here.lat, longitude: here.lng, accuracy: 50 },
      timestamp: 0,
    };
  };
  return {
    __bindDevice(deviceID: string): void {
      boundDevice = deviceID;
    },
    PermissionStatus: { GRANTED, DENIED, UNDETERMINED: "undetermined" },
    Accuracy: { Lowest: 1, Low: 2, Balanced: 3, High: 4, Highest: 5 },
    async getForegroundPermissionsAsync() {
      return { status: me().granted ? GRANTED : DENIED };
    },
    async requestForegroundPermissionsAsync() {
      return { status: me().granted ? GRANTED : DENIED };
    },
    async getLastKnownPositionAsync() {
      return position();
    },
    async getCurrentPositionAsync() {
      return position();
    },
  };
}
