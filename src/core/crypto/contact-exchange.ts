// Contact card: compact binary encoding for NFC tap and QR code peer exchange.
//
// When two users meet in person they can exchange contact info by:
//   a) NFC tap:  phone A writes an NDEF record; phone B reads and imports it.
//   b) QR code:  phone A displays a QR; phone B scans it with the camera.
//
// Both transports carry the same ContactCard binary blob. The QR content
// uses a URI scheme so scanners open Airhop directly: "airhop:v1/<base64url>".
// The NFC NDEF type is "application/airhop-contact-v1" (a MIME media type).
//
// ContactCard binary layout (fixed header, variable nickname):
//
//   [0]       u8     version = 1
//   [1–8]     bytes  peerID (8 bytes, first half of SHA-256(noisePub))
//   [9–40]    bytes  Noise static public key (32 bytes, X25519)
//   [41–72]   bytes  Ed25519 signing public key (32 bytes)
//   [73]      u8     nickname length (0–32)
//   [74–N]    utf8   nickname (0–32 bytes)
//
// Total: 74 + nicknameLen bytes (74–106 bytes).

import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";

// ---- Types ------------------------------------------------------------------

export interface ContactCard {
  peerID: string; // 16 hex chars
  noisePubKey: Uint8Array; // 32-byte X25519
  signingPubKey: Uint8Array; // 32-byte Ed25519
  nickname: string; // 0–32 UTF-8 characters
}

// ---- Binary encode/decode ---------------------------------------------------

const CARD_VERSION = 1;
const FIXED_HEADER_SIZE = 74; // version(1) + peerID(8) + noisePub(32) + signingPub(32) + nickLen(1)
const MAX_NICKNAME_BYTES = 32;

export function encodeContactCard(card: ContactCard): Uint8Array {
  if (card.peerID.length !== 16 || !/^[0-9a-fA-F]{16}$/.test(card.peerID)) {
    throw new Error("contact-exchange: peerID must be exactly 16 hex chars");
  }
  if (card.noisePubKey.length !== 32) {
    throw new Error("contact-exchange: noisePubKey must be 32 bytes");
  }
  if (card.signingPubKey.length !== 32) {
    throw new Error("contact-exchange: signingPubKey must be 32 bytes");
  }

  // Encode, then byte-truncate to MAX_NICKNAME_BYTES. This matches the
  // behavior in announce-manager.ts (silent truncation). Callers should
  // validate nickname length before calling, but we never throw for it.
  let nicknameBytes = new TextEncoder().encode(card.nickname);
  if (nicknameBytes.length > MAX_NICKNAME_BYTES) {
    nicknameBytes = nicknameBytes.slice(0, MAX_NICKNAME_BYTES);
  }

  const peerIDBytes = hexToBytes(card.peerID);

  const buf = new Uint8Array(FIXED_HEADER_SIZE + nicknameBytes.length);
  buf[0] = CARD_VERSION;
  buf.set(peerIDBytes, 1);
  buf.set(card.noisePubKey, 9);
  buf.set(card.signingPubKey, 41);
  buf[73] = nicknameBytes.length;
  buf.set(nicknameBytes, FIXED_HEADER_SIZE);
  return buf;
}

export function decodeContactCard(buf: Uint8Array): ContactCard {
  if (buf.length < FIXED_HEADER_SIZE) {
    throw new Error(
      `contact-exchange: buffer too short (${buf.length} < ${FIXED_HEADER_SIZE})`,
    );
  }
  if (buf[0] !== CARD_VERSION) {
    throw new Error(
      `contact-exchange: unsupported version ${buf[0]} (expected ${CARD_VERSION})`,
    );
  }

  const peerIDBytes = buf.slice(1, 9);
  const noisePubKey = buf.slice(9, 41);
  const signingPubKey = buf.slice(41, 73);
  const nickLen = buf[73];

  if (nickLen > MAX_NICKNAME_BYTES) {
    throw new Error(
      `contact-exchange: nickname length ${nickLen} exceeds maximum ${MAX_NICKNAME_BYTES}`,
    );
  }
  if (buf.length < FIXED_HEADER_SIZE + nickLen) {
    throw new Error("contact-exchange: buffer truncated in nickname field");
  }

  const nickname = new TextDecoder().decode(
    buf.slice(FIXED_HEADER_SIZE, FIXED_HEADER_SIZE + nickLen),
  );

  return {
    peerID: bytesToHex(peerIDBytes),
    noisePubKey,
    signingPubKey,
    nickname,
  };
}

// ---- QR code format ---------------------------------------------------------

// URI scheme for QR codes. Standard scanners launch the app via deep link.
// Content: "airhop:v1/<base64url-encoded-ContactCard-binary>"
const QR_SCHEME = "airhop:v1/";

export function encodeQRContent(card: ContactCard): string {
  const binary = encodeContactCard(card);
  return QR_SCHEME + toBase64URL(binary);
}

// Parse a QR code content string. Returns null if it's not an Airhop contact QR.
export function decodeQRContent(qr: string): ContactCard | null {
  if (!qr.startsWith(QR_SCHEME)) return null;
  const b64 = qr.slice(QR_SCHEME.length);
  let binary: Uint8Array;
  try {
    binary = fromBase64URL(b64);
  } catch {
    return null;
  }
  try {
    return decodeContactCard(binary);
  } catch {
    return null;
  }
}

// ---- NFC NDEF format --------------------------------------------------------

// MIME type string for the NFC NDEF record. The native NFC module should
// write an NDEF record of this type containing encodeContactCard() bytes.
export const NFC_MIME_TYPE = "application/airhop-contact-v1";

// The NFC payload IS the raw binary ContactCard (no extra envelope).
// The NDEF type (NFC_MIME_TYPE) is the discriminator, not a header byte.
export function encodeNFCPayload(card: ContactCard): Uint8Array {
  return encodeContactCard(card);
}

export function decodeNFCPayload(payload: Uint8Array): ContactCard {
  return decodeContactCard(payload);
}

// ---- Base64-URL helpers (RFC 4648 §5, no padding) ---------------------------

function toBase64URL(bytes: Uint8Array): string {
  // Convert to standard base64 first, then adjust chars.
  let b64 = "";
  // Build string from bytes manually (no btoa in all React Native envs).
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    b64 += chars[b0 >> 2];
    b64 += chars[((b0 & 3) << 4) | (b1 >> 4)];
    b64 += i + 1 < bytes.length ? chars[((b1 & 15) << 2) | (b2 >> 6)] : "";
    b64 += i + 2 < bytes.length ? chars[b2 & 63] : "";
  }
  // Convert standard base64 to base64url (no padding).
  return b64.replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64URL(b64url: string): Uint8Array {
  // Restore standard base64 with padding.
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  if (pad === 2) b64 += "==";
  else if (pad === 3) b64 += "=";
  else if (pad === 1)
    throw new Error("contact-exchange: invalid base64url length");

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const charIndex = new Uint8Array(256).fill(255);
  for (let i = 0; i < chars.length; i++) charIndex[chars.charCodeAt(i)] = i;

  const byteCount =
    Math.floor((b64.length * 3) / 4) -
    (b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0);
  const out = new Uint8Array(byteCount);
  let outIdx = 0;

  for (let i = 0; i < b64.length; i += 4) {
    const v0 = charIndex[b64.charCodeAt(i)];
    const v1 = charIndex[b64.charCodeAt(i + 1)];
    const v2 = charIndex[b64.charCodeAt(i + 2)];
    const v3 = charIndex[b64.charCodeAt(i + 3)];
    if (v0 === 255 || v1 === 255)
      throw new Error("contact-exchange: invalid base64url char");
    if (outIdx < byteCount) out[outIdx++] = (v0 << 2) | (v1 >> 4);
    if (v2 !== 255 && outIdx < byteCount)
      out[outIdx++] = ((v1 & 15) << 4) | (v2 >> 2);
    if (v3 !== 255 && outIdx < byteCount) out[outIdx++] = ((v2 & 3) << 6) | v3;
  }
  return out;
}
