/**
 * @jest-environment node
 */
import { Deduplicator } from "../deduplicator";

function packetId(first: number): Uint8Array {
  const n = new Uint8Array(16);
  n[0] = first;
  return n;
}

describe("Deduplicator", () => {
  let dedup: Deduplicator;

  beforeEach(() => {
    dedup = new Deduplicator();
  });

  describe("basic operations", () => {
    it("has() returns false for an unseen packetID", () => {
      expect(dedup.has(packetId(0x01))).toBe(false);
    });

    it("add() then has() returns true", () => {
      dedup.add(packetId(0x01));
      expect(dedup.has(packetId(0x01))).toBe(true);
    });

    it("different packetIDs are tracked independently", () => {
      dedup.add(packetId(0x01));
      expect(dedup.has(packetId(0x01))).toBe(true);
      expect(dedup.has(packetId(0x02))).toBe(false);
    });

    it("size reflects the number of tracked entries", () => {
      expect(dedup.size).toBe(0);
      dedup.add(packetId(0x01));
      dedup.add(packetId(0x02));
      expect(dedup.size).toBe(2);
    });

    it("reset() clears all entries", () => {
      dedup.add(packetId(0x01));
      dedup.reset();
      expect(dedup.size).toBe(0);
      expect(dedup.has(packetId(0x01))).toBe(false);
    });
  });

  describe("LRU eviction", () => {
    it("evicts the oldest entry when capacity (1000) is exceeded", () => {
      // Fill to capacity
      for (let i = 0; i < 1000; i++) {
        const n = new Uint8Array(16);
        n[0] = (i >> 8) & 0xff;
        n[1] = i & 0xff;
        dedup.add(n);
      }
      expect(dedup.size).toBe(1000);

      // Adding one more should evict the oldest (index 0)
      dedup.add(packetId(0xff));
      expect(dedup.size).toBe(1000);

      // The very first entry (i=0, bytes [0,0,...]) should be evicted
      const oldest = new Uint8Array(16); // i=0: n[0]=0, n[1]=0
      expect(dedup.has(oldest)).toBe(false);
    });

    it("re-adding a packetID refreshes its position (not double-counted)", () => {
      dedup.add(packetId(0x01));
      dedup.add(packetId(0x01)); // re-add
      expect(dedup.size).toBe(1);
    });
  });

  describe("expiry", () => {
    it("has() returns false and removes an expired entry", () => {
      jest.useFakeTimers();

      dedup.add(packetId(0x01));
      expect(dedup.has(packetId(0x01))).toBe(true);

      // Advance past the 5-minute expiry window
      jest.advanceTimersByTime(5 * 60 * 1000 + 1);

      expect(dedup.has(packetId(0x01))).toBe(false);

      jest.useRealTimers();
    });

    it("purgeExpired() removes entries older than 5 minutes", () => {
      jest.useFakeTimers();

      dedup.add(packetId(0x01));
      dedup.add(packetId(0x02));

      jest.advanceTimersByTime(5 * 60 * 1000 + 1);

      dedup.purgeExpired();
      expect(dedup.size).toBe(0);

      jest.useRealTimers();
    });

    it("fresh entries survive purgeExpired()", () => {
      jest.useFakeTimers();

      dedup.add(packetId(0x01));
      jest.advanceTimersByTime(1000); // 1 second only
      dedup.add(packetId(0x02));

      dedup.purgeExpired();
      // Neither is expired yet
      expect(dedup.size).toBe(2);

      jest.useRealTimers();
    });
  });
});
