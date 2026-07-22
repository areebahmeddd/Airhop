// Signal Double Ratchet algorithm.
//
// Spec: https://signal.org/docs/specifications/doubleratchet/
//
// Provides per-message forward secrecy and break-in recovery. Used for all
// offline courier DMs. Initialized from a root key derived by static-static
// ECDH over the two peers' Noise static keys (see mesh-service.ts).
//
// The ratchet has two interleaved components:
//   Symmetric-key ratchet: derives sending/receiving message keys from chain keys
//   DH ratchet: advances root key whenever a new ratchet public key is received
//
// Out-of-order messages are supported via a map of skipped message keys. The
// map is capped at MAX_SKIP entries (1000) to bound memory usage.

import { chacha20poly1305 } from "@noble/ciphers/chacha.js";
import { x25519 } from "@noble/curves/ed25519.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, randomBytes } from "@noble/hashes/utils.js";

// Hard limit on skipped message keys stored at once. Protects against
// memory-exhaustion by a peer that sends many out-of-order messages.
const MAX_SKIP = 1000;

// KDF info strings. Fixed ASCII constants; never change these.
const KDF_RK_INFO = new TextEncoder().encode("airhop-dr-root-v1");
const KDF_CK_MSG_BYTE = new Uint8Array([0x01]);
const KDF_CK_CHAIN_BYTE = new Uint8Array([0x02]);

// AEAD: ChaCha20-Poly1305. Message key is 32 bytes. Nonce is 12 bytes
// (all-zeros; key is single-use so nonce reuse is not a concern here).
const AEAD_NONCE = new Uint8Array(12); // zero nonce; MK is used once

// ---- Key types --------------------------------------------------------------

export interface RatchetKeyPair {
  readonly priv: Uint8Array; // 32-byte X25519 scalar
  readonly pub: Uint8Array; // 32-byte X25519 public key
}

export function generateRatchetKeyPair(): RatchetKeyPair {
  const priv = randomBytes(32);
  const pub = x25519.getPublicKey(priv);
  return { priv, pub };
}

// ---- Internal KDF helpers ---------------------------------------------------

// KDF_RK: derives a new root key and chain key from the current root key and
// a Diffie-Hellman output. Uses HKDF-SHA256 with a fixed info string.
// Returns [new_root_key (32), new_chain_key (32)].
function kdfRk(rk: Uint8Array, dhOut: Uint8Array): [Uint8Array, Uint8Array] {
  const output = hkdf(sha256, dhOut, rk, KDF_RK_INFO, 64);
  return [output.slice(0, 32), output.slice(32, 64)];
}

// KDF_CK: advances a chain key one step.
// Returns [new_chain_key, message_key] using HMAC-SHA256.
function kdfCk(ck: Uint8Array): [Uint8Array, Uint8Array] {
  const mk = hmac(sha256, ck, KDF_CK_MSG_BYTE);
  const newCk = hmac(sha256, ck, KDF_CK_CHAIN_BYTE);
  return [newCk, mk];
}

// ENCRYPT: authenticates the header as AAD, encrypts plaintext with the MK.
// Returns ciphertext+tag (no nonce prefix; key is single-use).
function aeadEncrypt(
  mk: Uint8Array,
  plaintext: Uint8Array,
  aad: Uint8Array,
): Uint8Array {
  return chacha20poly1305(mk, AEAD_NONCE, aad).encrypt(plaintext);
}

// DECRYPT: authenticates AAD and decrypts. Throws on auth failure.
function aeadDecrypt(
  mk: Uint8Array,
  ciphertext: Uint8Array,
  aad: Uint8Array,
): Uint8Array {
  return chacha20poly1305(mk, AEAD_NONCE, aad).decrypt(ciphertext);
}

// ---- Header encoding --------------------------------------------------------
//
// Header wire format (40 bytes):
//   [0–31]   DHs_pub  (32 bytes, sender's current ratchet public key)
//   [32–35]  PN       (u32-BE, number of messages in previous sending chain)
//   [36–39]  N        (u32-BE, message number in current sending chain)

const HEADER_LEN = 40;

export interface MessageHeader {
  dhPub: Uint8Array; // 32-byte ratchet public key
  pn: number; // previous chain message count
  n: number; // current message number
}

function encodeHeader(h: MessageHeader): Uint8Array {
  const buf = new Uint8Array(HEADER_LEN);
  buf.set(h.dhPub, 0);
  const dv = new DataView(buf.buffer);
  dv.setUint32(32, h.pn >>> 0, false);
  dv.setUint32(36, h.n >>> 0, false);
  return buf;
}

function decodeHeader(buf: Uint8Array): MessageHeader {
  if (buf.length < HEADER_LEN) throw new Error("DR: header too short");
  const dv = new DataView(buf.buffer, buf.byteOffset);
  return {
    dhPub: buf.slice(0, 32),
    pn: dv.getUint32(32, false),
    n: dv.getUint32(36, false),
  };
}

// ---- Ratchet state ----------------------------------------------------------

// The full Double Ratchet state for one conversation. Keep one per peer.
// Serializable for storage: no closures, only plain data.
export interface RatchetState {
  // Sending ratchet key pair. Rotated with each DH ratchet step.
  DHs: RatchetKeyPair;
  // Receiver's current ratchet public key. null until first message received.
  DHr: Uint8Array | null;
  // Root key. 32 bytes.
  RK: Uint8Array;
  // Sending chain key. null if no messages have been sent since last DH step.
  CKs: Uint8Array | null;
  // Receiving chain key. null until first message received.
  CKr: Uint8Array | null;
  // Sending message number (counter in current sending chain).
  Ns: number;
  // Receiving message number (next expected in current receiving chain).
  Nr: number;
  // Number of messages sent in the previous sending chain (saved in header).
  PN: number;
  // Skipped message keys: map of "<DH_pub_hex>:<N>" → message key (32 bytes).
  // Capped at MAX_SKIP entries total.
  MKSKIPPED: Map<string, Uint8Array>;
}

// ---- Initialization ---------------------------------------------------------

// Initialize the ratchet as the SENDER (Alice):
//   - rk:   shared secret from the static-static ECDH (32 bytes)
//   - dhPub: recipient's signed prekey public (Bob's SPK_pub, 32 bytes)
//
// Alice performs the first DH ratchet step immediately so she can send.
export function initSender(rk: Uint8Array, dhPub: Uint8Array): RatchetState {
  const DHs = generateRatchetKeyPair();
  const dhOut = x25519.getSharedSecret(DHs.priv, dhPub);
  const [newRk, cks] = kdfRk(rk, dhOut);
  return {
    DHs,
    DHr: dhPub,
    RK: newRk,
    CKs: cks,
    CKr: null,
    Ns: 0,
    Nr: 0,
    PN: 0,
    MKSKIPPED: new Map(),
  };
}

// Initialize the ratchet as the RECEIVER (Bob):
//   - rk:       shared secret from the static-static ECDH (32 bytes)
//   - dhsPriv:  Bob's signed prekey private (SPK_priv, 32 bytes)
//
// Bob holds the key pair used by Alice to initialize; he waits for her first
// message to perform his first DH ratchet step.
export function initReceiver(
  rk: Uint8Array,
  dhsPriv: Uint8Array,
): RatchetState {
  const pub = x25519.getPublicKey(dhsPriv);
  return {
    DHs: { priv: dhsPriv, pub },
    DHr: null,
    RK: rk,
    CKs: null,
    CKr: null,
    Ns: 0,
    Nr: 0,
    PN: 0,
    MKSKIPPED: new Map(),
  };
}

// ---- Encrypt ----------------------------------------------------------------

// Encrypt a plaintext message. Returns the ciphertext with the 40-byte header
// prepended: [header (40 bytes)][ciphertext+tag].
//
// State is mutated in place.
export function ratchetEncrypt(
  state: RatchetState,
  plaintext: Uint8Array,
): Uint8Array {
  if (state.CKs === null) {
    throw new Error(
      "DR: sending chain not initialized. Call initSender before sending.",
    );
  }

  const [newCks, mk] = kdfCk(state.CKs);
  state.CKs = newCks;

  const header: MessageHeader = {
    dhPub: state.DHs.pub,
    pn: state.PN,
    n: state.Ns,
  };
  state.Ns++;

  const headerBytes = encodeHeader(header);
  const ciphertext = aeadEncrypt(mk, plaintext, headerBytes);

  // [header][ciphertext+tag]
  const out = new Uint8Array(HEADER_LEN + ciphertext.length);
  out.set(headerBytes, 0);
  out.set(ciphertext, HEADER_LEN);
  return out;
}

// ---- Decrypt ----------------------------------------------------------------

// Decrypt a message produced by ratchetEncrypt. Returns the plaintext.
// Throws on auth failure or if the message key cannot be found.
//
// State is mutated in place.
export function ratchetDecrypt(
  state: RatchetState,
  message: Uint8Array,
): Uint8Array {
  if (message.length < HEADER_LEN) {
    throw new Error("DR: message too short");
  }
  const headerBytes = message.slice(0, HEADER_LEN);
  const ciphertext = message.slice(HEADER_LEN);
  const header = decodeHeader(headerBytes);

  // 1. Check the skipped-key cache first (handles out-of-order delivery).
  const skippedKey = trySkippedKey(state, header, ciphertext, headerBytes);
  if (skippedKey !== null) return skippedKey;

  // 2. If the ratchet key has changed, advance the DH ratchet.
  const dhPubHex = bytesToHex(header.dhPub);
  const currentDhHex = state.DHr ? bytesToHex(state.DHr) : null;
  if (dhPubHex !== currentDhHex) {
    skipMessageKeys(state, header.pn);
    dhRatchetStep(state, header.dhPub);
  }

  // 3. Skip to the expected message number in the current receiving chain.
  skipMessageKeys(state, header.n);

  // 4. Decrypt with the next receiving message key.
  if (state.CKr === null) throw new Error("DR: receiving chain not ready");
  const [newCkr, mk] = kdfCk(state.CKr);
  state.CKr = newCkr;
  state.Nr++;

  return aeadDecrypt(mk, ciphertext, headerBytes);
}

// ---- Internal helpers -------------------------------------------------------

// Look up a message key in the skip cache and attempt decryption.
function trySkippedKey(
  state: RatchetState,
  header: MessageHeader,
  ciphertext: Uint8Array,
  headerBytes: Uint8Array,
): Uint8Array | null {
  const key = `${bytesToHex(header.dhPub)}:${header.n}`;
  const mk = state.MKSKIPPED.get(key);
  if (mk === undefined) return null;
  state.MKSKIPPED.delete(key);
  return aeadDecrypt(mk, ciphertext, headerBytes);
}

// Advance the receiving chain key, storing skipped message keys, until we
// reach message number `until`. Respects MAX_SKIP.
function skipMessageKeys(state: RatchetState, until: number): void {
  if (state.Nr > until) return;
  if (until - state.Nr > MAX_SKIP) {
    throw new Error("DR: too many skipped messages");
  }
  while (state.Nr < until) {
    if (state.CKr === null) throw new Error("DR: receiving chain not ready");
    const [newCkr, mk] = kdfCk(state.CKr);
    state.CKr = newCkr;
    const key = `${state.DHr ? bytesToHex(state.DHr) : "null"}:${state.Nr}`;
    if (state.MKSKIPPED.size >= MAX_SKIP) {
      // Evict the oldest entry (Map preserves insertion order).
      const firstKey = state.MKSKIPPED.keys().next().value;
      if (firstKey !== undefined) state.MKSKIPPED.delete(firstKey);
    }
    state.MKSKIPPED.set(key, mk);
    state.Nr++;
  }
}

// Perform a DH ratchet step: generate a new key pair, advance root key twice
// (once for receiving, once for sending), update DHr.
function dhRatchetStep(state: RatchetState, newDhPub: Uint8Array): void {
  state.PN = state.Ns;
  state.Ns = 0;
  state.Nr = 0;
  state.DHr = newDhPub;

  // Receiving ratchet step: derive new CKr using Bob's new ratchet key.
  const dhOut1 = x25519.getSharedSecret(state.DHs.priv, newDhPub);
  const [rk1, ckr] = kdfRk(state.RK, dhOut1);
  state.RK = rk1;
  state.CKr = ckr;

  // Sending ratchet step: generate new DHs, derive new CKs.
  state.DHs = generateRatchetKeyPair();
  const dhOut2 = x25519.getSharedSecret(state.DHs.priv, newDhPub);
  const [rk2, cks] = kdfRk(state.RK, dhOut2);
  state.RK = rk2;
  state.CKs = cks;
}
