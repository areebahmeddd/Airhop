// bitchat's NIP-44-flavored encryption for Nostr DMs.
//
// bitchat labels this "nip44-v2" but it is NOT the published NIP-44 spec (which
// nostr-tools implements): it uses XChaCha20-Poly1305 with a single-step HKDF and
// a "v2:"+base64url framing. Since the Nostr DM signature covers the encrypted
// content, we must produce byte-identical output for a bitchat client to decrypt
// our DMs and vice versa. Reference: NostrProtocol.swift encrypt/decrypt/
// deriveSharedSecret/deriveNIP44V2Key and XChaCha20Poly1305Compat.swift.
//
// Scheme:
//   sharedSecret = ECDH(senderPriv, recipientPub) serialized COMPRESSED (33 bytes)
//   key          = HKDF-SHA256(ikm = sharedSecret, salt = "", info = "nip44-v2", 32)
//   ciphertext   = XChaCha20-Poly1305(key, nonce24).seal(plaintext)  // no padding
//   wire         = "v2:" + base64url(nonce24 ++ ciphertext ++ tag16)
//
// x-only keys: Nostr pubkeys are 32-byte x-only, BIP-340 even-Y by convention, so
// the point is 0x02||x. Private keys are normalized to even-Y so ECDH is
// consistent (raw random scalars can land on odd-Y). Decrypt tries 0x02 then 0x03
// for the sender's x-only key, matching bitchat.

import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { bytesToNumberBE, numberToBytesBE } from "@noble/curves/utils.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";

const NIP44_INFO = new TextEncoder().encode("nip44-v2");
const EMPTY = new Uint8Array(0);
const CURVE_ORDER = secp256k1.Point.Fn.ORDER;
const NONCE_SIZE = 24;
const TAG_SIZE = 16;

// Normalize a secret key so its public key has an even Y (BIP-340). A raw random
// scalar can land on odd Y, which would make the x-only (0x02||x) point we use in
// ECDH the wrong (negated) point and break interop. bitchat's Schnorr keys are
// always even-Y, so we match by negating the scalar (n - d) when needed.
export function normalizeSecretKeyEvenY(priv: Uint8Array): Uint8Array {
  const pub = secp256k1.getPublicKey(priv, true);
  if (pub[0] === 0x02) return priv;
  return numberToBytesBE(
    (CURVE_ORDER - bytesToNumberBE(priv)) % CURVE_ORDER,
    32,
  );
}

// The x-only (32-byte) public key for a secret key, normalized to even-Y.
export function xOnlyPublicKey(priv: Uint8Array): Uint8Array {
  return secp256k1.getPublicKey(normalizeSecretKeyEvenY(priv), true).slice(1);
}

function conversationKey(
  priv: Uint8Array,
  peerXOnly: Uint8Array,
  parity: 0x02 | 0x03,
): Uint8Array {
  const pubCompressed = new Uint8Array(33);
  pubCompressed[0] = parity;
  pubCompressed.set(peerXOnly, 1);
  const shared = secp256k1.getSharedSecret(priv, pubCompressed, true);
  return hkdf(sha256, shared, EMPTY, NIP44_INFO, 32);
}

// Encrypt a plaintext string to a recipient's x-only pubkey. Returns the bitchat
// "v2:"+base64url ciphertext string.
export function bitchatNip44Encrypt(
  plaintext: string,
  recipientXOnly: Uint8Array,
  senderPriv: Uint8Array,
): string {
  const priv = normalizeSecretKeyEvenY(senderPriv);
  const key = conversationKey(priv, recipientXOnly, 0x02);
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_SIZE));
  // noble returns ciphertext ++ tag concatenated; that is exactly the wire form.
  const ctTag = xchacha20poly1305(key, nonce).encrypt(
    new TextEncoder().encode(plaintext),
  );
  const combined = new Uint8Array(nonce.length + ctTag.length);
  combined.set(nonce, 0);
  combined.set(ctTag, nonce.length);
  return "v2:" + toBase64Url(combined);
}

// Decrypt a bitchat "v2:" ciphertext from a sender's x-only pubkey. Returns null
// on any failure (never throws), so callers can drop an undecryptable DM.
export function bitchatNip44Decrypt(
  ciphertext: string,
  senderXOnly: Uint8Array,
  recipientPriv: Uint8Array,
): string | null {
  if (!ciphertext.startsWith("v2:")) return null;
  let data: Uint8Array;
  try {
    data = fromBase64Url(ciphertext.slice(3));
  } catch {
    return null;
  }
  if (data.length <= NONCE_SIZE + TAG_SIZE) return null;
  const nonce = data.slice(0, NONCE_SIZE);
  const ctTag = data.slice(NONCE_SIZE);
  const priv = normalizeSecretKeyEvenY(recipientPriv);
  // The sender's x-only key is even-Y by convention; try 0x02 then 0x03.
  for (const parity of [0x02, 0x03] as const) {
    try {
      const key = conversationKey(priv, senderXOnly, parity);
      const pt = xchacha20poly1305(key, nonce).decrypt(ctTag);
      return new TextDecoder().decode(pt);
    } catch {
      // wrong parity or auth failure; try the next
    }
  }
  return null;
}

// ---- base64url (no padding) -------------------------------------------------

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) b64 += "=";
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
