// Reading bitchat's verification QR.
//
// The fixtures are built the way bitchat builds them - canonical bytes signed
// with the Ed25519 key the QR names - so a change to either side's field order
// or length prefixing shows up here as a signature that no longer verifies.

import { ed25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { npubEncode } from "nostr-tools/nip19";
import { parseBitchatVerifyQr } from "../bitchat-verify-qr";

const NOW = 1_700_000_000_000;
const NOISE = new Uint8Array(32).fill(0x11);
const SIGN_PRIV = new Uint8Array(32).fill(0x22);
const SIGN_PUB = ed25519.getPublicKey(SIGN_PRIV);
const NPUB = npubEncode("cc".repeat(32));

function canonical(f: Record<string, string>): Uint8Array {
  const out: number[] = [];
  const push = (v: string): void => {
    const b = new TextEncoder().encode(v);
    const n = Math.min(b.length, 255);
    out.push(n);
    for (let i = 0; i < n; i++) out.push(b[i] as number);
  };
  push("bitchat-verify-v1");
  push(f.v as string);
  push((f.noise as string).toLowerCase());
  push((f.sign as string).toLowerCase());
  push(f.npub ?? "");
  push(f.nick as string);
  push(f.ts as string);
  push(f.nonce as string);
  return new Uint8Array(out);
}

function makeQr(over: Partial<Record<string, string>> = {}): string {
  const f: Record<string, string> = {
    v: "1",
    noise: bytesToHex(NOISE),
    sign: bytesToHex(SIGN_PUB),
    nick: "neverdie",
    ts: String(Math.floor(NOW / 1000)),
    nonce: "AAAAAAAAAAAAAAAAAAAAAA",
    npub: NPUB,
    ...over,
  };
  const sig = bytesToHex(ed25519.sign(canonical(f), SIGN_PRIV));
  const q = new URLSearchParams({ ...f, sig });
  return `bitchat://verify?${q.toString()}`;
}

describe("parseBitchatVerifyQr", () => {
  it("ignores anything that is not a bitchat verify URL", () => {
    expect(parseBitchatVerifyQr("airhop:v1/abc", NOW)).toBeNull();
    expect(parseBitchatVerifyQr("3a9f2c1b4e5d6f70", NOW)).toBeNull();
    expect(parseBitchatVerifyQr("https://example.com", NOW)).toBeNull();
  });

  it("accepts a well-formed, fresh, signed code", () => {
    const out = parseBitchatVerifyQr(makeQr(), NOW);
    expect(out?.ok).toBe(true);
  });

  // Their format carries no peer ID. Recomputing it is what makes the card
  // satisfy the binding check every other card on our side faces.
  it("derives the peer ID from the Noise key rather than trusting one", () => {
    const out = parseBitchatVerifyQr(makeQr(), NOW);
    expect(out?.ok === true && out.card.peerID).toBe(
      bytesToHex(sha256(NOISE)).slice(0, 16),
    );
  });

  it("carries the nickname and decodes the npub", () => {
    const out = parseBitchatVerifyQr(makeQr(), NOW);
    if (out?.ok !== true) throw new Error("expected ok");
    expect(out.card.nickname).toBe("neverdie");
    expect(bytesToHex(out.card.nostrPubKey as Uint8Array)).toBe(
      "cc".repeat(32),
    );
  });

  // A bitchat user with no Nostr identity is a real user, not a broken code.
  it("accepts a code with no npub, leaving a mesh-only contact", () => {
    const out = parseBitchatVerifyQr(makeQr({ npub: "" }), NOW);
    if (out?.ok !== true) throw new Error("expected ok");
    expect(out.card.nostrPubKey).toBeUndefined();
  });

  // The property their format has and ours does not: a screenshot goes stale.
  it("refuses a code older than five minutes", () => {
    const qr = makeQr();
    expect(parseBitchatVerifyQr(qr, NOW + 6 * 60_000)).toEqual({
      ok: false,
      reason: "expired",
    });
  });

  // Both directions, as bitchat checks: a future stamp must not buy a longer
  // life than a fresh one gets.
  it("refuses a future-dated code just as firmly", () => {
    const qr = makeQr();
    expect(parseBitchatVerifyQr(qr, NOW - 6 * 60_000)).toEqual({
      ok: false,
      reason: "expired",
    });
  });

  it("refuses a code whose signature does not cover its contents", () => {
    // Nickname swapped after signing: the classic edit of a valid code.
    const tampered = makeQr().replace("nick=neverdie", "nick=someoneelse");
    expect(parseBitchatVerifyQr(tampered, NOW)).toEqual({
      ok: false,
      reason: "tampered",
    });
  });

  it("refuses a signature made by a different key", () => {
    const other = ed25519.getPublicKey(new Uint8Array(32).fill(0x33));
    const qr = makeQr().replace(
      `sign=${bytesToHex(SIGN_PUB)}`,
      `sign=${bytesToHex(other)}`,
    );
    expect(parseBitchatVerifyQr(qr, NOW)).toEqual({
      ok: false,
      reason: "tampered",
    });
  });

  it("refuses a code missing a required field", () => {
    const qr = makeQr().replace(/&nonce=[^&]*/, "");
    expect(parseBitchatVerifyQr(qr, NOW)).toEqual({
      ok: false,
      reason: "tampered",
    });
  });

  it("refuses malformed key material rather than throwing", () => {
    expect(parseBitchatVerifyQr(makeQr({ noise: "zz" }), NOW)).toEqual({
      ok: false,
      reason: "tampered",
    });
    expect(parseBitchatVerifyQr("bitchat://verify", NOW)).toEqual({
      ok: false,
      reason: "tampered",
    });
  });
});
