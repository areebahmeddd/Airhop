// Tests for geohash encoding/decoding in presence.ts.
// presence.ts has no native or network dependencies; fully testable in CI.

import { decodeGeohash, encodeGeohash } from "../presence";

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
