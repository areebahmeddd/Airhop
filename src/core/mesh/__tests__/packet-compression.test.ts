/**
 * @jest-environment node
 */
// Tests for raw-DEFLATE payload compression (bitchat CompressionUtil parity).
import {
  compress,
  COMPRESSION_THRESHOLD,
  decompress,
  shouldCompress,
} from "../packet-compression";

describe("packet-compression", () => {
  it("threshold matches bitchat (100 bytes)", () => {
    expect(COMPRESSION_THRESHOLD).toBe(100);
  });

  describe("shouldCompress", () => {
    it("is false below the threshold", () => {
      expect(shouldCompress(new Uint8Array(50))).toBe(false);
    });

    it("is true for large low-entropy data", () => {
      expect(shouldCompress(new TextEncoder().encode("ab".repeat(200)))).toBe(
        true,
      );
    });

    it("is false for high-entropy data", () => {
      const big = new Uint8Array(300);
      for (let i = 0; i < big.length; i++) big[i] = (i * 167 + 13) & 0xff;
      expect(shouldCompress(big)).toBe(false);
    });
  });

  describe("compress / decompress round-trip", () => {
    it("compresses repetitive data and restores it exactly", () => {
      const original = new TextEncoder().encode("hello world ".repeat(50));
      const c = compress(original);
      expect(c).not.toBeNull();
      expect(c!.length).toBeLessThan(original.length);
      const back = decompress(c!, original.length);
      expect(Array.from(back!)).toEqual(Array.from(original));
    });

    it("returns null when the input is too small", () => {
      expect(compress(new Uint8Array(10))).toBeNull();
    });

    it("returns null when compression would not shrink the data", () => {
      // 200 unique-ish bytes barely compress; incompressible -> null.
      const big = new Uint8Array(200);
      for (let i = 0; i < big.length; i++) big[i] = (i * 167 + 13) & 0xff;
      // Not compressible; compress() returns null (result not smaller).
      expect(compress(big)).toBeNull();
    });

    it("decompress rejects a wrong original size", () => {
      const original = new TextEncoder().encode("x".repeat(200));
      const c = compress(original)!;
      expect(decompress(c, 999)).toBeNull();
    });
  });
});
