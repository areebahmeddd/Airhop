/**
 * @jest-environment node
 */
// The location pin wire format: fixed 19 bytes, integer microdegrees, and a
// decoder that refuses rather than clamps. The refusal is the part that
// matters, since these bytes are chosen by the far end.

import {
  ACCURACY_UNKNOWN,
  decodeLocationPin,
  encodeLocationPin,
  LOCATION_PIN_BYTES,
  LOCATION_PIN_VERSION,
} from "../location-pin";

const PIN = {
  lat: 12.971599,
  lng: 77.594566,
  accuracyM: 18,
  takenAtMs: 1_760_000_000_000,
};

describe("encodeLocationPin", () => {
  it("is always the same 19 bytes, so it never nears a fragment", () => {
    expect(encodeLocationPin(PIN)).toHaveLength(LOCATION_PIN_BYTES);
    expect(encodeLocationPin({ lat: 0, lng: 0, takenAtMs: 0 })).toHaveLength(
      LOCATION_PIN_BYTES,
    );
  });

  it("stamps the version first", () => {
    expect(encodeLocationPin(PIN)[0]).toBe(LOCATION_PIN_VERSION);
  });

  it("writes the accuracy sentinel when the OS gave none", () => {
    const bytes = encodeLocationPin({ lat: 1, lng: 2, takenAtMs: 3 });
    const view = new DataView(bytes.buffer);
    expect(view.getUint16(9, false)).toBe(ACCURACY_UNKNOWN);
  });

  it("refuses a coordinate that is not on Earth", () => {
    expect(() =>
      encodeLocationPin({ lat: 91, lng: 0, takenAtMs: 0 }),
    ).toThrow();
    expect(() =>
      encodeLocationPin({ lat: 0, lng: -181, takenAtMs: 0 }),
    ).toThrow();
    expect(() =>
      encodeLocationPin({ lat: Number.NaN, lng: 0, takenAtMs: 0 }),
    ).toThrow();
  });
});

describe("round trip", () => {
  it("keeps a position to within a metre", () => {
    const decoded = decodeLocationPin(encodeLocationPin(PIN));
    expect(decoded).not.toBeNull();
    // Microdegrees are about 11 cm, so six places is the resolution.
    expect(decoded?.lat).toBeCloseTo(PIN.lat, 5);
    expect(decoded?.lng).toBeCloseTo(PIN.lng, 5);
    expect(decoded?.accuracyM).toBe(PIN.accuracyM);
    expect(decoded?.takenAtMs).toBe(PIN.takenAtMs);
  });

  it("carries southern and western hemispheres", () => {
    const south = { lat: -33.86882, lng: -151.20929, takenAtMs: 1 };
    const decoded = decodeLocationPin(encodeLocationPin(south));
    expect(decoded?.lat).toBeCloseTo(south.lat, 5);
    expect(decoded?.lng).toBeCloseTo(south.lng, 5);
  });

  it("reports unknown accuracy as absent rather than as a number", () => {
    const decoded = decodeLocationPin(
      encodeLocationPin({ lat: 1, lng: 2, takenAtMs: 3 }),
    );
    expect(decoded?.accuracyM).toBeUndefined();
  });

  // The fix time, not the send time. A pin that waited in a composer is older
  // than the message carrying it, and the card has to be able to say so.
  it("carries the moment of the fix unchanged", () => {
    const decoded = decodeLocationPin(encodeLocationPin(PIN));
    expect(decoded?.takenAtMs).toBe(PIN.takenAtMs);
  });
});

describe("decodeLocationPin refuses", () => {
  it("a payload of the wrong length", () => {
    expect(decodeLocationPin(new Uint8Array(18))).toBeNull();
    expect(decodeLocationPin(new Uint8Array(20))).toBeNull();
    expect(decodeLocationPin(new Uint8Array(0))).toBeNull();
  });

  it("an unknown version", () => {
    const bytes = encodeLocationPin(PIN);
    bytes[0] = 2;
    expect(decodeLocationPin(bytes)).toBeNull();
  });

  // Refused, not clamped: a clamp draws a confident arrow at a fabricated
  // place.
  it("a latitude off the globe", () => {
    const bytes = encodeLocationPin(PIN);
    new DataView(bytes.buffer).setInt32(1, 91_000_000, false);
    expect(decodeLocationPin(bytes)).toBeNull();
  });

  it("a longitude off the globe", () => {
    const bytes = encodeLocationPin(PIN);
    new DataView(bytes.buffer).setInt32(5, -181_000_000, false);
    expect(decodeLocationPin(bytes)).toBeNull();
  });

  it("a timestamp past what a number can hold exactly", () => {
    const bytes = encodeLocationPin(PIN);
    new DataView(bytes.buffer).setBigUint64(11, 2n ** 63n, false);
    expect(decodeLocationPin(bytes)).toBeNull();
  });
});
