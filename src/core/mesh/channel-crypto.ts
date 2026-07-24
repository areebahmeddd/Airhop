// End-to-end encryption for private channels.
//
// Every custom (user-created) channel is private: it has a random 32-byte key,
// created with the channel and carried to invitees inside the invite link. The
// key is the channel's real identity and its read/write credential, whoever
// holds it is a member.
//
// Messages are sealed with XChaCha20-Poly1305 (AEAD, random 24-byte nonce),
// the same cipher family as the DM transport. There is deliberately NO channel
// tag on the BLE wire: a receiver trial-decrypts with each key it holds, so a
// sniffer can't even tell which private channel a blob belongs to, and a
// non-member's decrypt simply fails (the auth tag won't verify).
//
// The sealed payload also carries the sender's id and nickname. Over BLE the
// packet is individually signed too, but over Nostr every member's event is
// signed with a SHARED channel key (so the relay can't tell members apart), so
// attribution has to live inside the ciphertext. It is self-asserted among
// members, the same trust level as a nickname in any group chat.

import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, randomBytes } from "@noble/hashes/utils.js";
import { getPublicKey } from "nostr-tools";

const KEY_LEN = 32;
const NONCE_LEN = 24;
const TAG_LEN = 16;

// Domain separator so a channel key can never collide with another use.
const NOSTR_INFO = new TextEncoder().encode("airhop-channel-nostr-v1");
// secp256k1 group order; a valid private key is in [1, n-1].
const SECP256K1_N = BigInt(
  "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
);

export interface ChannelPlaintext {
  msgId: string;
  senderID: string;
  senderNickname: string;
  text: string;
}

// ---- base64url (URL-safe, no padding) so one string works in both the store
// and the invite link ---------------------------------------------------------

function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToBytes(s: string): Uint8Array | null {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

// ---- key ---------------------------------------------------------------------

// A fresh channel key, base64url-encoded for storage and links.
export function generateChannelKey(): string {
  return bytesToB64url(randomBytes(KEY_LEN));
}

// True if a string is a well-formed channel key (32 bytes once decoded).
export function isValidChannelKey(keyB64: string): boolean {
  const bytes = b64urlToBytes(keyB64);
  return bytes !== null && bytes.length === KEY_LEN;
}

// ---- Nostr identity (for internet-reachable private channels) ----------------

export interface ChannelNostrIdentity {
  privKey: Uint8Array;
  pubKeyHex: string;
}

// Derive the shared Nostr keypair for a channel from its key. Every member
// derives the same one, so they all publish under, and subscribe to, a single
// author pubkey that is unguessable without the key and unlinkable to anyone's
// real identity. Returns null for a malformed key.
export function deriveChannelNostrIdentity(
  keyB64: string,
): ChannelNostrIdentity | null {
  const key = b64urlToBytes(keyB64);
  if (key === null || key.length !== KEY_LEN) return null;
  for (let i = 0; i < 10; i++) {
    const input = new Uint8Array(NOSTR_INFO.length + 4);
    input.set(NOSTR_INFO, 0);
    new DataView(input.buffer).setUint32(NOSTR_INFO.length, i, false);
    const candidate = hmac(sha256, key, input);
    const value = BigInt("0x" + bytesToHex(candidate));
    if (value > 0n && value < SECP256K1_N) {
      return { privKey: candidate, pubKeyHex: getPublicKey(candidate) };
    }
  }
  const fallback = sha256(new Uint8Array([...key, ...NOSTR_INFO]));
  return { privKey: fallback, pubKeyHex: getPublicKey(fallback) };
}

// ---- message framing (plaintext, before encryption) -------------------------
//   [msgIdLen u8][msgId][senderIdLen u8][senderId][nickLen u8][nick][text]

function lp(s: string): Uint8Array {
  return new TextEncoder().encode(s).slice(0, 255);
}

function frame(m: ChannelPlaintext): Uint8Array {
  const id = lp(m.msgId);
  const sid = lp(m.senderID);
  const nick = lp(m.senderNickname);
  const text = new TextEncoder().encode(m.text);
  const out = new Uint8Array(
    3 + id.length + sid.length + nick.length + text.length,
  );
  let off = 0;
  out[off++] = id.length;
  out.set(id, off);
  off += id.length;
  out[off++] = sid.length;
  out.set(sid, off);
  off += sid.length;
  out[off++] = nick.length;
  out.set(nick, off);
  off += nick.length;
  out.set(text, off);
  return out;
}

function unframe(bytes: Uint8Array): ChannelPlaintext | null {
  const dec = new TextDecoder();
  let off = 0;
  const read = (): string | null => {
    if (off >= bytes.length) return null;
    const len = bytes[off++];
    if (off + len > bytes.length) return null;
    const s = dec.decode(bytes.slice(off, off + len));
    off += len;
    return s;
  };
  const msgId = read();
  const senderID = read();
  const senderNickname = read();
  if (msgId === null || senderID === null || senderNickname === null) {
    return null;
  }
  return {
    msgId,
    senderID,
    senderNickname,
    text: dec.decode(bytes.slice(off)),
  };
}

// ---- seal / open -------------------------------------------------------------

// Encrypt a channel message. The returned bytes are the payload:
// [nonce (24)][ciphertext + auth tag].
export function sealChannelMessage(
  keyB64: string,
  message: ChannelPlaintext,
): Uint8Array {
  const key = b64urlToBytes(keyB64);
  if (key === null || key.length !== KEY_LEN) {
    throw new Error("invalid channel key");
  }
  const nonce = randomBytes(NONCE_LEN);
  const ct = xchacha20poly1305(key, nonce).encrypt(frame(message));
  const out = new Uint8Array(NONCE_LEN + ct.length);
  out.set(nonce, 0);
  out.set(ct, NONCE_LEN);
  return out;
}

// Try to decrypt with one key. Returns null on the wrong key or a tampered
// blob, so callers can trial each key they hold without any of them throwing.
export function openChannelMessage(
  keyB64: string,
  blob: Uint8Array,
): ChannelPlaintext | null {
  if (blob.length < NONCE_LEN + TAG_LEN) return null;
  const key = b64urlToBytes(keyB64);
  if (key === null || key.length !== KEY_LEN) return null;
  const nonce = blob.slice(0, NONCE_LEN);
  const ct = blob.slice(NONCE_LEN);
  try {
    return unframe(xchacha20poly1305(key, nonce).decrypt(ct));
  } catch {
    return null;
  }
}
