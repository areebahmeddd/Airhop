// Safety numbers: the code two people read to each other to confirm the keys
// their phones hold are the right ones.
//
// Key delivery and verification are separate steps. A QR scan does both at
// once; every other way of learning someone's keys (an airhop:// link, a card
// inside a geohash DM, hearing their announce) does only the first. This is the
// second on its own, so the confirming channel can be anything the two people
// trust: a call, a radio, another app. The strength comes from that channel.
//
// Two properties the rest of the feature rests on:
//
//   * It covers BOTH keys. A peer ID is SHA-256 of the Noise key alone, so
//     reading one aloud would not catch the attack that matters: a forged card
//     keeps the victim's real peer ID and Noise key and substitutes the
//     attacker's SIGNING key.
//   * It imports nothing. A match sets a flag, a mismatch tells the user to
//     stop. Neither writes a key, so unlike the scan path there is no
//     re-pinning power to gate.

import { sha256 } from "@noble/hashes/sha2.js";

// Domain separators. The pair hash takes the peer hash's output as its input,
// so without them one could be substituted for the other.
const PEER_CONTEXT = "airhop-fingerprint-v1";
const PAIR_CONTEXT = "airhop-safety-number-v1";

const encoder = new TextEncoder();

function concat(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

// Compare two byte strings of equal length. Returns <0, 0 or >0 so the pair
// hash below can order its two inputs.
function compareBytes(a: Uint8Array, b: Uint8Array): number {
  for (let i = 0; i < a.length && i < b.length; i++) {
    const diff = (a[i] as number) - (b[i] as number);
    if (diff !== 0) return diff;
  }
  return a.length - b.length;
}

// One identity's fingerprint: 32 bytes over both of its public keys. Never
// shown on its own; it is the input to the pair hash below.
export function peerFingerprint(
  noisePubKey: Uint8Array,
  signingPubKey: Uint8Array,
): Uint8Array {
  if (noisePubKey.length !== 32 || signingPubKey.length !== 32) {
    throw new Error("fingerprint: both keys must be 32 bytes");
  }
  return sha256(
    concat(encoder.encode(PEER_CONTEXT), noisePubKey, signingPubKey),
  );
}

// The code both people see, identical on the two phones.
//
// Sorted before hashing so neither side has to know who is who. Without it each
// side derives a different string and the exchange doubles in length.
export function safetyNumber(ours: Uint8Array, theirs: Uint8Array): Uint8Array {
  const [first, second] =
    compareBytes(ours, theirs) <= 0 ? [ours, theirs] : [theirs, ours];
  return sha256(concat(encoder.encode(PAIR_CONTEXT), first, second));
}

// Six words from 128-entry lists is 42 bits.
//
// Sized against the attack rather than to a round number. Forging a match means
// grinding keys until the pair hash lands on the same six words: 2^42 for one
// targeted pair, and it has to be done before the two people speak. Every extra
// word is another word to read over a bad line, and a code nobody finishes
// reading protects nothing.
export const SAFETY_WORD_COUNT = 6;
export const SAFETY_BITS_PER_WORD = 7;

// Seven-bit indices out of the hash, most significant bit first, so the mapping
// is fixed here rather than by how a runtime slices bytes.
//
// Here rather than beside the word lists because two devices must agree on it
// exactly, while the words themselves are presentation.
export function safetyNumberIndices(digest: Uint8Array): number[] {
  const indices: number[] = [];
  let bitOffset = 0;
  for (let i = 0; i < SAFETY_WORD_COUNT; i++) {
    let value = 0;
    for (let bit = 0; bit < SAFETY_BITS_PER_WORD; bit++) {
      const absolute = bitOffset + bit;
      const byte = digest[absolute >> 3] as number;
      value = (value << 1) | ((byte >> (7 - (absolute & 7))) & 1);
    }
    indices.push(value);
    bitOffset += SAFETY_BITS_PER_WORD;
  }
  return indices;
}
