// Per-geohash Nostr identities.
//
// Location channels MUST NOT be signed with the user's main Nostr key. That key
// is published in ANNOUNCE (TLV) and used for DMs, so reusing it here would let
// any relay operator, or anyone watching a geohash, tie the user's movement
// history to their durable identity, and correlate the block/city/region cells
// they post in as one person. A fresh key per geohash breaks those links.
//
// Derivation matches bitchat's shape (bitchat/ios NostrIdentityBridge.swift):
//
//   privkey = HMAC-SHA256(seed, utf8(geohash) || u32_be(i))
//
// trying i = 0, 1, 2… until the result is a valid secp256k1 scalar. Nothing on
// the wire depends on the derivation, only that each geohash gets its own
// unlinkable key, so bitchat and Airhop interoperate without sharing seeds
// (they couldn't anyway; the seed never leaves the device).
//
// The seed here is derived from the existing Ed25519 signing key rather than
// stored separately. It is a one-way HMAC, so the seed cannot be walked back to
// the identity, and it avoids a second secret to provision, back up, and wipe.

import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { getPublicKey } from "nostr-tools";

// Domain separator, so this seed can never collide with another use of the
// signing key.
const SEED_INFO = new TextEncoder().encode("airhop-geohash-seed-v1");

// secp256k1 group order. A valid private key is in [1, n-1].
const SECP256K1_N = BigInt(
  "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
);

export interface GeohashIdentity {
  privKey: Uint8Array;
  pubKeyHex: string; // x-only, as Nostr uses
}

// Per-device seed for all geohash derivations.
export function deriveGeohashSeed(signingPrivKey: Uint8Array): Uint8Array {
  return hmac(sha256, signingPrivKey, SEED_INFO);
}

function isValidScalar(key: Uint8Array): boolean {
  const value = BigInt("0x" + bytesToHex(key));
  return value > 0n && value < SECP256K1_N;
}

// Derive the unlinkable identity used for one geohash channel.
//
// Deterministic: the same seed and geohash always produce the same key, so a
// user keeps a stable pseudonym within a channel across restarts while
// remaining unlinkable across channels.
export function deriveGeohashIdentity(
  seed: Uint8Array,
  geohash: string,
): GeohashIdentity {
  const label = new TextEncoder().encode(geohash.toLowerCase());

  for (let i = 0; i < 10; i++) {
    const input = new Uint8Array(label.length + 4);
    input.set(label, 0);
    // Big-endian counter (bitchat-iOS uses BE here; Android uses LE, which is
    // a latent divergence on their side. It only matters if i > 0, which
    // essentially never happens: a random 32-byte HMAC is a valid scalar with
    // overwhelming probability.)
    new DataView(input.buffer).setUint32(label.length, i, false);

    const candidate = hmac(sha256, seed, input);
    if (isValidScalar(candidate)) {
      return { privKey: candidate, pubKeyHex: getPublicKey(candidate) };
    }
  }

  // Fallback mirrors bitchat: hash seed || label and use that.
  const fallback = sha256(new Uint8Array([...seed, ...label]));
  return { privKey: fallback, pubKeyHex: getPublicKey(fallback) };
}

// Display name convention shared with bitchat: the self-asserted nickname is
// suffixed with the last 4 hex chars of the pubkey, so two people who pick the
// same nickname in a public channel remain distinguishable. Nicknames here are
// untrusted decoration; the pubkey is the identity.
export function geohashDisplayName(
  pubkeyHex: string,
  nickname?: string,
): string {
  const suffix = pubkeyHex.slice(-4);
  const nick = nickname?.trim();
  return nick !== undefined && nick.length > 0
    ? `${nick}#${suffix}`
    : `anon#${suffix}`;
}
