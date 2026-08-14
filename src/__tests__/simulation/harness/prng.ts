// Deterministic randomness, because chaos you cannot replay is noise.
//
// Every scenario draws its faults from one of these, seeded from a number the
// scenario prints. A soak run that fails on seed 91744 fails on seed 91744
// again, on any machine, forever - which is the difference between "the fuzzer
// found something" and "the fuzzer found something and we can go look at it".
//
// xorshift128 rather than Math.random for exactly that reason, and rather than
// a dependency because it is twenty lines.

export class Prng {
  private s0: number;
  private s1: number;
  private s2: number;
  private s3: number;

  constructor(readonly seed: number) {
    // splitmix64-style expansion so neighbouring seeds do not produce
    // correlated streams. Seed 1 and seed 2 must look nothing alike.
    let x = seed >>> 0 || 0x9e3779b9;
    const next = (): number => {
      x = (x + 0x6d2b79f5) >>> 0;
      let t = x;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return (t ^ (t >>> 14)) >>> 0;
    };
    this.s0 = next();
    this.s1 = next();
    this.s2 = next();
    this.s3 = next();
  }

  // Raw 32-bit draw.
  private nextUint32(): number {
    const t = this.s1 << 9;
    let r = Math.imul(this.s1, 5);
    r = ((r << 7) | (r >>> 25)) >>> 0;
    r = Math.imul(r, 9) >>> 0;
    this.s2 ^= this.s0;
    this.s3 ^= this.s1;
    this.s1 ^= this.s2;
    this.s0 ^= this.s3;
    this.s2 ^= t;
    this.s3 = ((this.s3 << 11) | (this.s3 >>> 21)) >>> 0;
    return r;
  }

  // [0, 1)
  float(): number {
    return this.nextUint32() / 0x1_0000_0000;
  }

  // [min, max] inclusive.
  int(min: number, max: number): number {
    if (max <= min) return min;
    return min + (this.nextUint32() % (max - min + 1));
  }

  // True with probability p.
  chance(p: number): boolean {
    return this.float() < p;
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new Error("pick from empty list");
    return items[this.int(0, items.length - 1)];
  }

  // Fisher-Yates on a copy, so callers can shuffle a list they do not own.
  shuffle<T>(items: readonly T[]): T[] {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  // A named sub-stream. Lets one subsystem's draws stay stable when another
  // subsystem's draw count changes, so adding a fault type to the radio does
  // not reshuffle every wallet decision in an existing seed.
  fork(name: string): Prng {
    let h = 2166136261;
    for (let i = 0; i < name.length; i++) {
      h ^= name.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return new Prng((this.seed ^ h) >>> 0);
  }

  // Bytes, for packet corruption.
  bytes(n: number): Uint8Array {
    const out = new Uint8Array(n);
    for (let i = 0; i < n; i++) out[i] = this.int(0, 255);
    return out;
  }
}
