/**
 * @jest-environment node
 */
// Safety numbers. These properties are what the feature rests on, so they are
// pinned rather than assumed.

import {
  peerFingerprint,
  SAFETY_BITS_PER_WORD,
  SAFETY_WORD_COUNT,
  safetyNumber,
  safetyNumberIndices,
} from "../fingerprint";

function key(fill: number): Uint8Array {
  return new Uint8Array(32).fill(fill);
}

const ALICE_NOISE = key(0x11);
const ALICE_SIGN = key(0x22);
const BOB_NOISE = key(0x33);
const BOB_SIGN = key(0x44);

const alice = peerFingerprint(ALICE_NOISE, ALICE_SIGN);
const bob = peerFingerprint(BOB_NOISE, BOB_SIGN);

describe("peerFingerprint", () => {
  it("is 32 bytes and deterministic", () => {
    expect(alice).toHaveLength(32);
    expect(peerFingerprint(ALICE_NOISE, ALICE_SIGN)).toEqual(alice);
  });

  // Why the fingerprint is not just the peer ID. A peer ID is SHA-256 of the
  // Noise key alone, so a forged card keeping the victim's peer ID and Noise
  // key while substituting the SIGNING key produces an identical peer ID, and
  // comparing that aloud would confirm the forgery.
  it("changes when only the signing key changes", () => {
    const substituted = peerFingerprint(ALICE_NOISE, key(0x99));
    expect(substituted).not.toEqual(alice);
  });

  it("changes when only the Noise key changes", () => {
    expect(peerFingerprint(key(0x99), ALICE_SIGN)).not.toEqual(alice);
  });

  it("refuses a key that is not 32 bytes", () => {
    expect(() => peerFingerprint(new Uint8Array(31), ALICE_SIGN)).toThrow();
    expect(() => peerFingerprint(ALICE_NOISE, new Uint8Array(33))).toThrow();
  });
});

describe("safetyNumber", () => {
  // Both phones render the same code without either side knowing who is who,
  // so one person reads and the other listens instead of both reading.
  it("is the same from either side", () => {
    expect(safetyNumber(alice, bob)).toEqual(safetyNumber(bob, alice));
  });

  it("differs per pair", () => {
    const carol = peerFingerprint(key(0x55), key(0x66));
    expect(safetyNumber(alice, bob)).not.toEqual(safetyNumber(alice, carol));
  });

  // A substituted signing key must change the code, or the comparison confirms
  // nothing.
  it("changes when one side's signing key is substituted", () => {
    const impostor = peerFingerprint(BOB_NOISE, key(0x99));
    expect(safetyNumber(alice, impostor)).not.toEqual(safetyNumber(alice, bob));
  });

  // Domain separation: a peer fingerprint and a pair hash are both SHA-256 over
  // concatenated bytes, and the pair hash takes peer fingerprints as input.
  it("is not the peer fingerprint of the same inputs", () => {
    expect(safetyNumber(alice, alice)).not.toEqual(alice);
  });
});

describe("safetyNumberIndices", () => {
  it("returns the expected count, all in range", () => {
    const indices = safetyNumberIndices(safetyNumber(alice, bob));
    expect(indices).toHaveLength(SAFETY_WORD_COUNT);
    for (const index of indices) {
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(1 << SAFETY_BITS_PER_WORD);
    }
  });

  // Most significant bit first. Two devices that disagree here render different
  // words for the same keys, which reads to their users as an attack.
  it("reads seven bits at a time from the top of the digest", () => {
    // 0b1111111 0000000 1111111 ... : alternating runs across byte boundaries.
    const digest = new Uint8Array(32);
    digest[0] = 0b11111110;
    digest[1] = 0b00000011;
    digest[2] = 0b11111000;
    expect(safetyNumberIndices(digest).slice(0, 3)).toEqual([127, 0, 127]);
  });

  it("is deterministic", () => {
    const digest = safetyNumber(alice, bob);
    expect(safetyNumberIndices(digest)).toEqual(safetyNumberIndices(digest));
  });
});
