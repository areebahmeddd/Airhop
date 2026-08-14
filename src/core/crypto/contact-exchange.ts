// Contact card: compact binary encoding for QR code peer exchange.
//
// When two users meet in person, phone A displays a QR and phone B scans it
// with the camera. The QR carries a ContactCard binary blob, encoded in a URI
// scheme so scanners open Airhop directly: "airhop:v1/<base64url>".
//
// ContactCard binary layout (fixed header, variable nickname, trailing npub):
//
//   [0]        u8     version (1)
//   [1-8]      bytes  peerID (8 bytes, first half of SHA-256(noisePub))
//   [9-40]     bytes  Noise static public key (32 bytes, X25519)
//   [41-72]    bytes  Ed25519 signing public key (32 bytes)
//   [73]       u8     nickname length (0-32)
//   [74-M]     utf8   nickname (0-32 bytes)
//   [M+1-M+32] bytes  Nostr public key (32 bytes, secp256k1)
//
// Total: 106 + nicknameLen bytes. Every card carries all three keys: the Noise
// and signing keys for BLE, and the Nostr key so a contact met only by QR (never
// over Bluetooth) is still reachable over the internet. Airhop is pre-1.0 with no
// install base, so there is exactly one card format rather than a versioned pair.

import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { base64UrlToBytes, bytesToBase64Url } from "../encoding/base64";

// A card read from our own `airhop:v1/` format, where the Nostr key is part of
// the fixed layout and therefore always present. Narrower than ContactCard so
// callers of the decoders below need no guard for a field that format cannot
// omit.
export type AirhopContactCard = ContactCard & { nostrPubKey: Uint8Array };

export interface ContactCard {
  peerID: string; // 16 hex chars
  noisePubKey: Uint8Array; // 32-byte X25519
  signingPubKey: Uint8Array; // 32-byte Ed25519
  nickname: string; // 0-32 UTF-8 characters
  // 32-byte secp256k1 (Nostr identity).
  //
  // Optional because a card can now come from a bitchat verification QR, where
  // the npub field is itself optional. Our own `airhop:v1/` cards always carry
  // one - encodeContactCard refuses without it - so absence means "read from
  // bitchat, mesh-only contact" rather than a malformed card of ours.
  nostrPubKey?: Uint8Array;
}

const CARD_VERSION = 1;
const FIXED_HEADER_SIZE = 74; // version(1) + peerID(8) + noisePub(32) + signingPub(32) + nickLen(1)
const NOSTR_PUBKEY_SIZE = 32;
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
  // Required here even though the field is optional on the type: `airhop:v1/`
  // has a fixed-width Nostr key at the end, so there is no way to encode a card
  // without one. Absence only ever comes from a bitchat QR, which is read and
  // never re-emitted.
  if (card.nostrPubKey === undefined || card.nostrPubKey.length !== 32) {
    throw new Error("contact-exchange: nostrPubKey must be 32 bytes");
  }

  // Encode, then byte-truncate to MAX_NICKNAME_BYTES. This matches the
  // behavior in announce-manager.ts (silent truncation). Callers should
  // validate nickname length before calling, but we never throw for it.
  let nicknameBytes = new TextEncoder().encode(card.nickname);
  if (nicknameBytes.length > MAX_NICKNAME_BYTES) {
    nicknameBytes = nicknameBytes.slice(0, MAX_NICKNAME_BYTES);
  }

  const peerIDBytes = hexToBytes(card.peerID);

  const buf = new Uint8Array(
    FIXED_HEADER_SIZE + nicknameBytes.length + NOSTR_PUBKEY_SIZE,
  );
  buf[0] = CARD_VERSION;
  buf.set(peerIDBytes, 1);
  buf.set(card.noisePubKey, 9);
  buf.set(card.signingPubKey, 41);
  buf[73] = nicknameBytes.length;
  buf.set(nicknameBytes, FIXED_HEADER_SIZE);
  buf.set(card.nostrPubKey, FIXED_HEADER_SIZE + nicknameBytes.length);
  return buf;
}

export function decodeContactCard(buf: Uint8Array): AirhopContactCard {
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
  const npubStart = FIXED_HEADER_SIZE + nickLen;
  if (buf.length < npubStart + NOSTR_PUBKEY_SIZE) {
    throw new Error("contact-exchange: buffer truncated");
  }

  const nickname = new TextDecoder().decode(
    buf.slice(FIXED_HEADER_SIZE, npubStart),
  );

  return {
    peerID: bytesToHex(peerIDBytes),
    noisePubKey,
    signingPubKey,
    nickname,
    nostrPubKey: buf.slice(npubStart, npubStart + NOSTR_PUBKEY_SIZE),
  };
}

// URI scheme for QR codes. Standard scanners launch the app via deep link.
// Content: "airhop:v1/<base64url-encoded-ContactCard-binary>"
const QR_SCHEME = "airhop:v1/";

export function encodeQRContent(card: ContactCard): string {
  const binary = encodeContactCard(card);
  return QR_SCHEME + bytesToBase64Url(binary);
}

// Parse a QR code content string. Returns null if it's not an Airhop contact QR.
export function decodeQRContent(qr: string): AirhopContactCard | null {
  if (!qr.startsWith(QR_SCHEME)) return null;
  const b64 = qr.slice(QR_SCHEME.length);
  let binary: Uint8Array;
  try {
    binary = base64UrlToBytes(b64);
  } catch {
    return null;
  }
  try {
    return decodeContactCard(binary);
  } catch {
    return null;
  }
}
