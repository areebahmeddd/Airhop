// LRU seen-set for packet deduplication.
//
// Tracks 8-byte packet nonces. A packet whose nonce has been seen within the
// last 5 minutes is a duplicate and must be dropped before relay or display.
// The cache is bounded to 1000 entries; oldest entries are evicted on overflow
// rather than letting memory grow unbounded.
//
// Constants per PROTOCOLS.md section 4:
//   - LRU size:         1000 entries
//   - Expiry window:    5 minutes
const MAX_SIZE = 1000;
const EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

function nonceKey(nonce: Uint8Array): string {
  // Hex-encode 8 bytes (16 chars) as a Map key - fast and collision-free.
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += nonce[i].toString(16).padStart(2, "0");
  }
  return s;
}

export class Deduplicator {
  // Map preserves insertion order, which is what we rely on for LRU eviction.
  private readonly seen: Map<string, number> = new Map();

  // Return true if the nonce has been seen within the expiry window.
  has(nonce: Uint8Array): boolean {
    const key = nonceKey(nonce);
    const ts = this.seen.get(key);
    if (ts === undefined) return false;
    if (Date.now() - ts > EXPIRY_MS) {
      this.seen.delete(key);
      return false;
    }
    return true;
  }

  // Record a nonce as seen. Evicts the oldest entry if the cache is full.
  add(nonce: Uint8Array): void {
    const key = nonceKey(nonce);
    if (this.seen.has(key)) {
      // Refresh timestamp by deleting and re-inserting (maintains LRU order).
      this.seen.delete(key);
    } else if (this.seen.size >= MAX_SIZE) {
      // Map.keys() returns an iterator in insertion order.
      const oldest = this.seen.keys().next().value;
      if (oldest !== undefined) {
        this.seen.delete(oldest);
      }
    }
    this.seen.set(key, Date.now());
  }

  // Number of currently tracked nonces (including potentially expired ones).
  get size(): number {
    return this.seen.size;
  }

  // Remove all entries older than the expiry window. Called periodically to
  // reclaim memory without waiting for the LRU cap to trigger eviction.
  purgeExpired(): void {
    const cutoff = Date.now() - EXPIRY_MS;
    for (const [key, ts] of this.seen) {
      if (ts < cutoff) {
        this.seen.delete(key);
      } else {
        // Map iteration is insertion-order, so once we see a fresh entry all
        // subsequent entries are also fresh.
        break;
      }
    }
  }

  reset(): void {
    this.seen.clear();
  }
}
