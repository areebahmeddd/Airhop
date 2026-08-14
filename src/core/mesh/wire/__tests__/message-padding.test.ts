/**
 * @jest-environment node
 */
// Byte-parity tests for PKCS#7 padding, matching bitchat MessagePadding.swift.
import { optimalBlockSize, pad, unpad } from "../message-padding";

describe("message-padding", () => {
  describe("optimalBlockSize (dataSize + 16 overhead)", () => {
    it("picks the smallest block that fits", () => {
      expect(optimalBlockSize(1)).toBe(256);
      expect(optimalBlockSize(240)).toBe(256); // 240+16 = 256
      expect(optimalBlockSize(241)).toBe(512); // 257 -> next block
      expect(optimalBlockSize(496)).toBe(512); // 512
      expect(optimalBlockSize(497)).toBe(1024);
      expect(optimalBlockSize(1008)).toBe(1024);
      expect(optimalBlockSize(2032)).toBe(2048);
    });

    it("returns the data size itself when larger than the biggest block", () => {
      expect(optimalBlockSize(5000)).toBe(5000);
    });
  });

  describe("pad / unpad round-trip", () => {
    it("pads with PKCS#7 bytes equal to the pad length", () => {
      const data = new Uint8Array([1, 2, 3]);
      const padded = pad(data, 256);
      expect(padded.length).toBe(256);
      const padLen = 256 - 3;
      expect(padded[padded.length - 1]).toBe(padLen & 0xff);
      // unpad only strips when padLen <= 255; 253 here, so it round-trips.
      expect(Array.from(unpad(padded))).toEqual([1, 2, 3]);
    });

    it("is a no-op when more than 255 pad bytes would be needed", () => {
      const data = new Uint8Array(2); // pad to 256 needs 254 <= 255, ok
      expect(pad(data, 256).length).toBe(256);
      // Padding a tiny frame to 512 needs 510 pad bytes -> refused (no-op).
      const tiny = new Uint8Array(1);
      expect(pad(tiny, 512).length).toBe(1);
    });

    it("is a no-op when data already meets the target", () => {
      const data = new Uint8Array(300);
      expect(pad(data, 256)).toBe(data);
    });

    it("unpad leaves a non-padded frame untouched", () => {
      const notPadded = new Uint8Array([9, 9, 9, 0]); // last byte 0 -> invalid pad
      expect(Array.from(unpad(notPadded))).toEqual([9, 9, 9, 0]);
    });

    it("unpad rejects an inconsistent tail", () => {
      // last byte says 3 pad bytes but they are not all 3
      const bad = new Uint8Array([1, 2, 3, 9, 3]);
      expect(Array.from(unpad(bad))).toEqual([1, 2, 3, 9, 3]);
    });
  });
});
