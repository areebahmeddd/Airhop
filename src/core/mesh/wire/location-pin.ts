// A location pin: one place, sent once, to one person.
//
// A message rather than a session: no timer, no repeating send, no background
// location, nothing left running. Live sharing would need a GPS subscription
// held open, an expiry enforced on both sides, and background location on both
// platforms, for a case a fresh pin every few minutes already covers.
//
// Fixed width, since every field is present on every pin and a TLV would cost
// bytes to say so:
//
//   [0]        u8      version = 1
//   [1 to 4]   i32-BE  latitude,  microdegrees (degrees x 1e6)
//   [5 to 8]   i32-BE  longitude, microdegrees
//   [9 to 10]  u16-BE  horizontal accuracy in metres, 0xFFFF = unknown
//   [11 to 18] u64-BE  when the fix was taken, Unix milliseconds
//
// 19 bytes, so it never approaches a fragment boundary.
//
// Microdegrees rather than a float: 1e-6 degrees is about 11 cm, finer than any
// phone GPS, and an integer encodes identically where a float's last bits do
// not. i32 covers the range with room to spare.
//
// The timestamp is the fix, not the send. A pin that spent four minutes in a
// composer is four minutes old, and the receiver has to be able to say so.

export const LOCATION_PIN_VERSION = 1;
export const LOCATION_PIN_BYTES = 19;

// No accuracy figure from the OS. Distinct from 0, which claims a perfect fix.
export const ACCURACY_UNKNOWN = 0xffff;

// Metres. At 5 km the arrow points at a suburb, and a wrong arrow is worse
// than no pin.
const MAX_USEFUL_ACCURACY_M = 5000;

const MICRO = 1_000_000;

export interface LocationPin {
  lat: number; // decimal degrees
  lng: number; // decimal degrees
  // Horizontal accuracy in metres, or undefined when the OS did not say.
  accuracyM?: number;
  // When the fix was taken, Unix milliseconds.
  takenAtMs: number;
}

export function encodeLocationPin(pin: LocationPin): Uint8Array {
  if (!Number.isFinite(pin.lat) || pin.lat < -90 || pin.lat > 90) {
    throw new Error("location-pin: latitude out of range");
  }
  if (!Number.isFinite(pin.lng) || pin.lng < -180 || pin.lng > 180) {
    throw new Error("location-pin: longitude out of range");
  }
  const out = new Uint8Array(LOCATION_PIN_BYTES);
  const view = new DataView(out.buffer);
  out[0] = LOCATION_PIN_VERSION;
  view.setInt32(1, Math.round(pin.lat * MICRO), false);
  view.setInt32(5, Math.round(pin.lng * MICRO), false);
  view.setUint16(
    9,
    pin.accuracyM === undefined || !Number.isFinite(pin.accuracyM)
      ? ACCURACY_UNKNOWN
      : Math.min(Math.max(Math.round(pin.accuracyM), 0), MAX_USEFUL_ACCURACY_M),
    false,
  );
  view.setBigUint64(11, BigInt(Math.max(0, Math.round(pin.takenAtMs))), false);
  return out;
}

// Null rather than throwing, matching every other decoder here: these bytes are
// chosen by the far end, and a malformed pin is one we do not render.
export function decodeLocationPin(data: Uint8Array): LocationPin | null {
  if (data.length !== LOCATION_PIN_BYTES) return null;
  if (data[0] !== LOCATION_PIN_VERSION) return null;

  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const lat = view.getInt32(1, false) / MICRO;
  const lng = view.getInt32(5, false) / MICRO;
  // Refused rather than clamped. A sender chooses these integers, and clamping
  // turns nonsense into a plausible point somebody would walk towards.
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  const rawAccuracy = view.getUint16(9, false);
  const takenAtMs = Number(view.getBigUint64(11, false));
  if (!Number.isSafeInteger(takenAtMs)) return null;

  return {
    lat,
    lng,
    ...(rawAccuracy === ACCURACY_UNKNOWN ? {} : { accuracyM: rawAccuracy }),
    takenAtMs,
  };
}
