// Tests for geohash encoding/decoding in geohash-presence.ts.
// geohash-presence.ts has no native or network dependencies; fully testable in CI.

import {
  decodeGeohash,
  decorrelationDelayMs,
  encodeGeohash,
  mayBroadcastPresence,
  nextHeartbeatDelayMs,
} from "../geohash-presence";

describe("presence", () => {
  describe("encodeGeohash", () => {
    it("encodes San Francisco at precision 5", () => {
      const hash = encodeGeohash(37.7749, -122.4194, 5);
      expect(hash).toHaveLength(5);
      // San Francisco should be in the "9q8yy" area
      expect(hash.startsWith("9q8")).toBe(true);
    });

    it("encodes Berlin at precision 5", () => {
      const hash = encodeGeohash(52.52, 13.405, 5);
      expect(hash).toHaveLength(5);
      // Berlin should be in the "u33d" area
      expect(hash.startsWith("u33d")).toBe(true);
    });

    it("encodes Tokyo at precision 4", () => {
      const hash = encodeGeohash(35.6762, 139.6503, 4);
      expect(hash).toHaveLength(4);
      expect(hash.startsWith("xn")).toBe(true);
    });

    it("returns correct precision length", () => {
      for (let p = 1; p <= 9; p++) {
        expect(encodeGeohash(0, 0, p)).toHaveLength(p);
      }
    });

    it("encodes origin (0, 0)", () => {
      const hash = encodeGeohash(0, 0, 5);
      // The origin should be in cell 's0000' area
      expect(hash).toHaveLength(5);
      expect(typeof hash).toBe("string");
    });
  });

  describe("decodeGeohash", () => {
    it("round-trips San Francisco at precision 5", () => {
      const original = { lat: 37.7749, lng: -122.4194 };
      const hash = encodeGeohash(original.lat, original.lng, 5);
      const decoded = decodeGeohash(hash);
      // Precision 5 gives ~2.4 km error in each direction
      expect(Math.abs(decoded.lat - original.lat)).toBeLessThan(0.1);
      expect(Math.abs(decoded.lng - original.lng)).toBeLessThan(0.1);
    });

    it("round-trips Berlin at precision 5", () => {
      const original = { lat: 52.52, lng: 13.405 };
      const hash = encodeGeohash(original.lat, original.lng, 5);
      const decoded = decodeGeohash(hash);
      expect(Math.abs(decoded.lat - original.lat)).toBeLessThan(0.1);
      expect(Math.abs(decoded.lng - original.lng)).toBeLessThan(0.1);
    });

    it("handles single-character hash (precision 1)", () => {
      const hash = encodeGeohash(0, 0, 1);
      const decoded = decodeGeohash(hash);
      expect(decoded.lat).toBeDefined();
      expect(decoded.lng).toBeDefined();
    });
  });
});

// Heartbeat policy.
//
// Presence is the one thing in this app that publishes location on purpose, so
// what it refuses to publish is as much the feature as what it publishes. Each
// rule below comes from the cross-platform GeohashPresenceSpec, which both
// bitchat clients implement identically.
describe("presence broadcast policy", () => {
  test("coarse cells may broadcast: region, province, city", () => {
    expect(mayBroadcastPresence(2)).toBe(true); // region
    expect(mayBroadcastPresence(4)).toBe(true); // province
    expect(mayBroadcastPresence(5)).toBe(true); // city
  });

  // At these precisions a cell is a neighbourhood, a block, a building. A
  // heartbeat there is a statement about where a person is standing, and the
  // spec's answer is that the count is simply not knowable: the UI shows
  // "? people" rather than an undercount presented as fact.
  test("fine cells never broadcast: neighbourhood, block, building", () => {
    expect(mayBroadcastPresence(6)).toBe(false); // neighbourhood
    expect(mayBroadcastPresence(7)).toBe(false); // block
    expect(mayBroadcastPresence(8)).toBe(false); // building
    expect(mayBroadcastPresence(9)).toBe(false);
  });

  test("an unknown precision is refused rather than allowed", () => {
    expect(mayBroadcastPresence(99)).toBe(false);
    expect(mayBroadcastPresence(0)).toBe(false);
  });
});

describe("heartbeat timing", () => {
  // 40-80s, averaging 60. A fixed cadence would itself be a fingerprint; the
  // average is what keeps a peer inside everyone else's five-minute online
  // window with room to miss a round.
  test("the round interval stays within the 40-80s window", () => {
    expect(nextHeartbeatDelayMs(() => 0)).toBe(40_000);
    expect(nextHeartbeatDelayMs(() => 0.999999)).toBeLessThanOrEqual(80_000);
    expect(nextHeartbeatDelayMs(() => 0.5)).toBe(60_000);
  });

  // Each cell is signed by a different derived key, so publishing them together
  // still leaks: three unfamiliar pubkeys arriving in the same instant, round
  // after round, group into one device by timing alone.
  test("cells inside a round are spaced 2-5s apart", () => {
    expect(decorrelationDelayMs(() => 0)).toBe(2_000);
    expect(decorrelationDelayMs(() => 0.999999)).toBeLessThanOrEqual(5_000);
  });

  test("both delays stay inside their window for any random value", () => {
    for (let i = 0; i <= 100; i++) {
      const r = i / 100;
      const beat = nextHeartbeatDelayMs(() => r);
      expect(beat).toBeGreaterThanOrEqual(40_000);
      expect(beat).toBeLessThanOrEqual(80_000);
      const gap = decorrelationDelayMs(() => r);
      expect(gap).toBeGreaterThanOrEqual(2_000);
      expect(gap).toBeLessThanOrEqual(5_000);
    }
  });
});
