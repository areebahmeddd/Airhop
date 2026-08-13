// Reading bitchat's verification QR.
//
// bitchat shows `bitchat://verify?...` from its own verification sheet. That QR
// is not a contact card: on their side it names a peer they are ALREADY
// connected to, and the real proof is a nonce challenge sent over the live Noise
// session afterwards. Scanning one there fails outright if the peer is not in
// the current peer list.
//
// Airhop reads it for what it carries rather than for what it means to them: the
// Noise and Ed25519 public keys, the nickname, and optionally an npub. That is
// exactly a contact card, and it is the only way an Airhop user can pick up a
// bitchat user's identity in person - our own `airhop:v1/` format is unreadable
// to bitchat, and theirs was unreadable to us.
//
// One-way by nature. We do not answer their challenge protocol, so the bitchat
// user learns nothing and sees no verification on their side. The UI must not
// imply otherwise.
//
// Format (VerificationService.VerificationQR):
//   bitchat://verify?v=1&noise=<64 hex>&sign=<64 hex>&nick=<utf8>
//                   &ts=<unix seconds>&nonce=<base64url>&sig=<128 hex>
//                   [&npub=<bech32>]
//
// The signature is Ed25519 over canonicalBytes() below, made with the key in
// `sign`. It proves whoever built the QR held that private key; the timestamp
// bounds how long that proof is worth anything.

import { ed25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { decode as decodeBech32 } from "nostr-tools/nip19";
import type { ContactCard } from "./contact-exchange";

// Domain separator, byte-identical to VerificationQR.context. Signing without
// it would let a signature made for one purpose be replayed as another.
const CONTEXT = "bitchat-verify-v1";

// How far the QR's timestamp may sit from ours, in either direction. Matches
// TransportConfig.verificationQRMaxAgeSeconds.
//
// Both directions on purpose, as bitchat does: a future-dated stamp must not buy
// a QR a longer life than a fresh one gets. This is what stops a screenshot from
// working tomorrow, and it is the one security property their format has that
// ours does not.
const MAX_AGE_MS = 5 * 60 * 1000;

const HEX_32 = /^[0-9a-f]{64}$/i;
const HEX_64 = /^[0-9a-f]{128}$/i;

export type BitchatQrOutcome =
  | { ok: true; card: ContactCard }
  // The code is a bitchat verification QR and is not usable. Separated from
  // "not one at all" so the scanner can say why instead of ignoring it: an
  // expired code looks identical to an unreadable one through a viewfinder.
  | { ok: false; reason: "expired" | "tampered" };

// Length-prefixed UTF-8, capped at 255 bytes, matching VerificationQR
// .canonicalBytes(). The cap is part of the format rather than a guard: bitchat
// truncates the same way, so a longer nickname has to be truncated identically
// or the signature will not verify.
function appendField(out: number[], value: string): void {
  const bytes = new TextEncoder().encode(value);
  const len = Math.min(bytes.length, 255);
  out.push(len);
  for (let i = 0; i < len; i++) out.push(bytes[i] as number);
}

function canonicalBytes(f: {
  v: string;
  noise: string;
  sign: string;
  npub: string;
  nick: string;
  ts: string;
  nonce: string;
}): Uint8Array {
  const out: number[] = [];
  appendField(out, CONTEXT);
  appendField(out, f.v);
  appendField(out, f.noise.toLowerCase());
  appendField(out, f.sign.toLowerCase());
  appendField(out, f.npub);
  appendField(out, f.nick);
  appendField(out, f.ts);
  appendField(out, f.nonce);
  return new Uint8Array(out);
}

// A bitchat npub carries the same 32-byte secp256k1 key our card stores raw.
// Absent, or malformed, leaves the contact mesh-only - which is a real bitchat
// user, not an error, since the field is optional on their side too.
function nostrKeyFromNpub(npub: string): Uint8Array | undefined {
  if (npub.length === 0) return undefined;
  try {
    const decoded = decodeBech32(npub);
    if (decoded.type !== "npub" || typeof decoded.data !== "string") {
      return undefined;
    }
    return hexToBytes(decoded.data);
  } catch {
    return undefined;
  }
}

// Parse and verify. Returns null when this is not a bitchat verification QR at
// all, so the caller can carry on trying other formats.
export function parseBitchatVerifyQr(
  raw: string,
  nowMs: number = Date.now(),
): BitchatQrOutcome | null {
  const trimmed = raw.trim();
  if (!/^bitchat:\/\/verify\b/i.test(trimmed)) return null;

  let params: URLSearchParams;
  try {
    // The scheme is not hierarchical to every URL parser, so the query is taken
    // directly rather than through a host/path parse that may not survive it.
    const q = trimmed.indexOf("?");
    if (q < 0) return { ok: false, reason: "tampered" };
    params = new URLSearchParams(trimmed.slice(q + 1));
  } catch {
    return { ok: false, reason: "tampered" };
  }

  const v = params.get("v");
  const noise = params.get("noise");
  const sign = params.get("sign");
  const nick = params.get("nick");
  const ts = params.get("ts");
  const nonce = params.get("nonce");
  const sig = params.get("sig");
  const npub = params.get("npub") ?? "";
  if (
    v === null ||
    noise === null ||
    sign === null ||
    nick === null ||
    ts === null ||
    nonce === null ||
    sig === null
  ) {
    return { ok: false, reason: "tampered" };
  }
  if (!HEX_32.test(noise) || !HEX_32.test(sign) || !HEX_64.test(sig)) {
    return { ok: false, reason: "tampered" };
  }

  const seconds = Number(ts);
  if (!Number.isFinite(seconds)) return { ok: false, reason: "tampered" };

  // Freshness before the signature: a stale code is the likelier case by far
  // (a screenshot, a photo of a screen), and it is the one the user can act on.
  if (Math.abs(nowMs - seconds * 1000) > MAX_AGE_MS) {
    return { ok: false, reason: "expired" };
  }

  let verified: boolean;
  try {
    verified = ed25519.verify(
      hexToBytes(sig),
      canonicalBytes({ v, noise, sign, npub, nick, ts, nonce }),
      hexToBytes(sign),
    );
  } catch {
    return { ok: false, reason: "tampered" };
  }
  if (!verified) return { ok: false, reason: "tampered" };

  // bitchat carries no peer ID: theirs derives from the Noise key the same way
  // ours does, so it is recomputed rather than trusted. That also means the
  // binding check every card faces on our side is satisfied by construction.
  const noisePubKey = hexToBytes(noise);
  const peerID = bytesToHex(sha256(noisePubKey)).slice(0, 16);

  return {
    ok: true,
    card: {
      peerID,
      noisePubKey,
      signingPubKey: hexToBytes(sign),
      nickname: nick,
      nostrPubKey: nostrKeyFromNpub(npub),
    },
  };
}
