/**
 * @jest-environment node
 */
// Contact-card identity binding.
//
// A peer ID is only meaningful because it is the fingerprint of the peer's
// Noise static public key. Anything that accepts a contact out-of-band (QR,
// NFC) MUST re-derive and compare, or a forged card can claim someone else's
// peer ID while supplying attacker-controlled keys, and every DM the user
// then believes they are sending to that contact would be encrypted to the
// forger instead. bitchat-iOS enforces the same rule on inbound announces
// (`senderMismatch`).
//
// These tests pin the derivation and the round-trip so the QR path and the
// ANNOUNCE path can never disagree about what a peer ID means.

import { x25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import {
  decodeQRContent,
  encodeQRContent,
  type ContactCard,
} from "../contact-exchange";

// The one derivation rule the whole scheme rests on.
function derivePeerID(noisePubKey: Uint8Array): string {
  return bytesToHex(sha256(noisePubKey)).slice(0, 16);
}

function makeCard(seed: number, nickname = "swift-otter-42"): ContactCard {
  const noisePriv = new Uint8Array(32).fill(seed);
  const noisePubKey = x25519.getPublicKey(noisePriv);
  const signingPubKey = new Uint8Array(32).fill(seed + 100);
  return {
    peerID: derivePeerID(noisePubKey),
    noisePubKey,
    signingPubKey,
    nickname,
  };
}

describe("peer ID binding", () => {
  it("derives a 16-hex peer ID from the Noise public key", () => {
    const card = makeCard(1);
    expect(card.peerID).toMatch(/^[0-9a-f]{16}$/);
    expect(card.peerID).toBe(derivePeerID(card.noisePubKey));
  });

  it("gives different keys different peer IDs", () => {
    expect(makeCard(1).peerID).not.toBe(makeCard(2).peerID);
  });

  it("detects a card whose peer ID does not match its keys", () => {
    // The forgery: claim peer A's ID while supplying attacker keys.
    const victim = makeCard(1);
    const attacker = makeCard(2);
    const forged: ContactCard = { ...attacker, peerID: victim.peerID };

    expect(derivePeerID(forged.noisePubKey)).not.toBe(forged.peerID);
  });

  it("accepts a well-formed card", () => {
    const card = makeCard(3);
    expect(derivePeerID(card.noisePubKey)).toBe(card.peerID);
  });
});

describe("QR round-trip", () => {
  it("preserves every field through encode/decode", () => {
    const card = makeCard(4, "quiet-falcon-17");
    const decoded = decodeQRContent(encodeQRContent(card));

    expect(decoded).not.toBeNull();
    expect(decoded?.peerID).toBe(card.peerID);
    expect(decoded?.nickname).toBe(card.nickname);
    expect(bytesToHex(decoded!.noisePubKey)).toBe(bytesToHex(card.noisePubKey));
    expect(bytesToHex(decoded!.signingPubKey)).toBe(
      bytesToHex(card.signingPubKey),
    );
  });

  it("survives the binding check after a round-trip", () => {
    // Guards against an encoding bug that would silently break verification
    // for every scanned card.
    const card = makeCard(5);
    const decoded = decodeQRContent(encodeQRContent(card));
    expect(derivePeerID(decoded!.noisePubKey)).toBe(decoded?.peerID);
  });

  it("returns null for a bare peer ID rather than throwing", () => {
    // The scanner tries card-parsing first and falls back to a plain ID, so
    // this must fail softly.
    expect(decodeQRContent("aabbccdd00112233")).toBeNull();
  });

  it("returns null for arbitrary non-Airhop QR content", () => {
    expect(decodeQRContent("https://example.com")).toBeNull();
    expect(decodeQRContent("")).toBeNull();
  });
});
