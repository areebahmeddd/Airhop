/**
 * @jest-environment node
 */
// Per-geohash identity derivation.
//
// The property that matters is UNLINKABILITY: posting in #city and #region
// from the same device must not be attributable to one person, and neither
// must be tied to the user's main Nostr key. These tests pin that, plus the
// determinism that gives a user a stable pseudonym within one channel.

import { getPublicKey } from "nostr-tools";
import {
  deriveGeohashIdentity,
  deriveGeohashSeed,
  geohashDisplayName,
} from "../geohash-identity";

const SIGNING_KEY = new Uint8Array(32).fill(7);
const OTHER_SIGNING_KEY = new Uint8Array(32).fill(9);

describe("deriveGeohashSeed", () => {
  it("is deterministic for one identity", () => {
    expect(deriveGeohashSeed(SIGNING_KEY)).toEqual(
      deriveGeohashSeed(SIGNING_KEY),
    );
  });

  it("differs between identities", () => {
    expect(deriveGeohashSeed(SIGNING_KEY)).not.toEqual(
      deriveGeohashSeed(OTHER_SIGNING_KEY),
    );
  });

  it("is not the signing key itself", () => {
    // One-way: the seed must never be a copy of the key it came from.
    expect(deriveGeohashSeed(SIGNING_KEY)).not.toEqual(SIGNING_KEY);
  });
});

describe("deriveGeohashIdentity", () => {
  const seed = deriveGeohashSeed(SIGNING_KEY);

  it("produces a valid secp256k1 key usable by nostr-tools", () => {
    const id = deriveGeohashIdentity(seed, "u4pruy");
    expect(id.privKey).toHaveLength(32);
    expect(id.pubKeyHex).toMatch(/^[0-9a-f]{64}$/);
    // The pubkey must actually correspond to the private key.
    expect(getPublicKey(id.privKey)).toBe(id.pubKeyHex);
  });

  it("is stable for the same geohash (stable pseudonym in a channel)", () => {
    expect(deriveGeohashIdentity(seed, "u4pruy").pubKeyHex).toBe(
      deriveGeohashIdentity(seed, "u4pruy").pubKeyHex,
    );
  });

  it("is UNLINKABLE across geohashes", () => {
    // The core privacy property: the city cell and the region cell that
    // contains it must not share a key, or a relay could stitch a user's
    // movements together.
    const city = deriveGeohashIdentity(seed, "u4pru");
    const region = deriveGeohashIdentity(seed, "u4");
    expect(city.pubKeyHex).not.toBe(region.pubKeyHex);
  });

  it("is unlinkable across users in the same cell", () => {
    const a = deriveGeohashIdentity(deriveGeohashSeed(SIGNING_KEY), "u4pru");
    const b = deriveGeohashIdentity(
      deriveGeohashSeed(OTHER_SIGNING_KEY),
      "u4pru",
    );
    expect(a.pubKeyHex).not.toBe(b.pubKeyHex);
  });

  it("normalises case so a geohash is one channel", () => {
    expect(deriveGeohashIdentity(seed, "U4PRU").pubKeyHex).toBe(
      deriveGeohashIdentity(seed, "u4pru").pubKeyHex,
    );
  });

  it("gives every precision level a distinct key", () => {
    const hashes = ["u", "u4", "u4p", "u4pr", "u4pru", "u4pruy", "u4pruyd"];
    const keys = new Set(
      hashes.map((h) => deriveGeohashIdentity(seed, h).pubKeyHex),
    );
    expect(keys.size).toBe(hashes.length);
  });
});

describe("geohashDisplayName", () => {
  const pubkey = "a".repeat(60) + "beef";

  it("suffixes the nickname with the last 4 pubkey chars", () => {
    expect(geohashDisplayName(pubkey, "alice")).toBe("alice#beef");
  });

  it("falls back to anon when no nickname is given", () => {
    expect(geohashDisplayName(pubkey)).toBe("anon#beef");
    expect(geohashDisplayName(pubkey, "")).toBe("anon#beef");
    expect(geohashDisplayName(pubkey, "   ")).toBe("anon#beef");
  });

  it("keeps identical nicknames distinguishable", () => {
    // Nicknames are self-asserted, so two people can claim the same one. The
    // suffix is what stops them being confused for each other.
    const other = "b".repeat(60) + "cafe";
    expect(geohashDisplayName(pubkey, "alice")).not.toBe(
      geohashDisplayName(other, "alice"),
    );
  });
});
