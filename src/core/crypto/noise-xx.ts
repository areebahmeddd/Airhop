// Noise_XX_25519_ChaChaPoly_SHA256 handshake and transport session.
//
// Wire-compatible with bitchat iOS NoiseProtocol.swift.
//
// Three-message handshake pattern:
//   msg1: initiator → responder  (→ e)              32 bytes
//   msg2: responder → initiator  (← e,ee,s,es)      96 bytes
//   msg3: initiator → responder  (→ s,se)            64 bytes
//
// Transport messages: [4-byte BE nonce prefix][ciphertext+16-byte Poly1305 tag]
// The nonce is prepended so the receiver can decrypt out-of-order messages
// using the sliding-window replay guard. This matches bitchat's
// `useExtractedNonce: true` transport cipher mode.

import { chacha20poly1305 } from "@noble/ciphers/chacha.js";
import { x25519 } from "@noble/curves/ed25519.js";
import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { concatBytes } from "@noble/hashes/utils.js";

// Protocol name: 31 bytes, padded to 32 with a trailing zero byte.
const PROTOCOL_NAME_BYTES = new TextEncoder().encode(
  "Noise_XX_25519_ChaChaPoly_SHA256",
);

// Transport messages use a 4-byte BE nonce prefix.
const TRANSPORT_NONCE_PREFIX_LEN = 4;
// Poly1305 auth tag length.
const TAG_LEN = 16;
// Sliding-window replay protection covers the last 1024 nonces.
const REPLAY_WINDOW = 1024;
const REPLAY_BYTES = REPLAY_WINDOW >> 3; // 128 bytes

export type NoiseRole = "initiator" | "responder";

// A fully established Noise session. Both sides hold one after the
// three-message handshake completes.
export interface NoiseSession {
  // The peer's X25519 static public key, authenticated by the handshake.
  readonly remoteStaticPubKey: Uint8Array;
  // SHA-256 of the full handshake transcript. Used for channel binding.
  readonly handshakeHash: Uint8Array;
  // Encrypt `plaintext` → [4-byte BE nonce][ciphertext+tag]
  encrypt(plaintext: Uint8Array): Uint8Array;
  // Decrypt [4-byte BE nonce][ciphertext+tag] → plaintext.
  // Throws on auth failure or replay.
  decrypt(message: Uint8Array): Uint8Array;
}

// --- Internal helpers ---------------------------------------------------------

// HKDF as specified by the Noise Protocol Framework:
//   tempKey = HMAC-SHA256(ck, ikm)
//   output[i] = HMAC-SHA256(tempKey, output[i-1] || [i])  (output[0] = empty)
function noiseHkdf(
  ck: Uint8Array,
  ikm: Uint8Array,
  count: 2 | 3,
): Uint8Array[] {
  const tempKey = hmac(sha256, ck, ikm);
  const out: Uint8Array[] = [];
  let prev = new Uint8Array(0);
  for (let i = 1; i <= count; i++) {
    const data = new Uint8Array(prev.length + 1);
    data.set(prev);
    data[prev.length] = i;
    prev = hmac(sha256, tempKey, data);
    out.push(prev.slice());
  }
  return out;
}

// Build a 12-byte ChaCha20-Poly1305 nonce matching bitchat's layout:
//   bytes [0–3]  = 0x00
//   bytes [4–7]  = counter as LE u32
//   bytes [8–11] = 0x00
function makeNonce(counter: number): Uint8Array {
  const nonce = new Uint8Array(12);
  new DataView(nonce.buffer).setUint32(4, counter >>> 0, true);
  return nonce;
}

// Encrypt with ChaCha20-Poly1305. Returns ciphertext+tag (no nonce prefix).
// Used during the handshake and inside the transport helpers.
function chachaEncrypt(
  key: Uint8Array,
  n: number,
  aad: Uint8Array,
  plaintext: Uint8Array,
): Uint8Array {
  return chacha20poly1305(key, makeNonce(n), aad).encrypt(plaintext);
}

// Decrypt with ChaCha20-Poly1305. Throws if auth fails.
function chachaDecrypt(
  key: Uint8Array,
  n: number,
  aad: Uint8Array,
  ciphertextWithTag: Uint8Array,
): Uint8Array {
  return chacha20poly1305(key, makeNonce(n), aad).decrypt(ciphertextWithTag);
}

// --- Sliding-window replay guard (1024-nonce window) -------------------------

class ReplayWindow {
  private highest = 0;
  private readonly bits = new Uint8Array(REPLAY_BYTES);

  isValid(n: number): boolean {
    if (n > this.highest) return true;
    const offset = this.highest - n;
    if (offset >= REPLAY_WINDOW) return false; // too old
    return (this.bits[offset >> 3] & (1 << (offset & 7))) === 0;
  }

  markSeen(n: number): void {
    if (n > this.highest) {
      const shift = n - this.highest;
      if (shift >= REPLAY_WINDOW) {
        this.bits.fill(0);
      } else {
        const byteShift = shift >> 3;
        const bitShift = shift & 7;
        for (let i = REPLAY_BYTES - 1; i >= 0; i--) {
          const src = i - byteShift;
          let b = 0;
          if (src >= 0) {
            b = this.bits[src] >> bitShift;
            if (bitShift !== 0 && src > 0) {
              b |= (this.bits[src - 1] << (8 - bitShift)) & 0xff;
            }
          }
          this.bits[i] = b & 0xff;
        }
      }
      this.highest = n;
      this.bits[0] |= 1;
    } else {
      const offset = this.highest - n;
      this.bits[offset >> 3] |= 1 << (offset & 7);
    }
  }
}

// --- Transport session -------------------------------------------------------

function makeTransportSession(
  sendKey: Uint8Array,
  recvKey: Uint8Array,
  remoteStaticPubKey: Uint8Array,
  handshakeHash: Uint8Array,
): NoiseSession {
  let sendCounter = 0;
  let recvCounter = 0;
  const recvReplay = new ReplayWindow();
  // Keep copies so we can zero them out if needed in future
  const sk = sendKey.slice();
  const rk = recvKey.slice();

  return {
    remoteStaticPubKey: remoteStaticPubKey.slice(),
    handshakeHash: handshakeHash.slice(),

    encrypt(plaintext: Uint8Array): Uint8Array {
      if (sendCounter > 0xffffffff)
        throw new Error("Noise: send nonce exhausted");
      const n = sendCounter++;
      // Encrypt without nonce prefix during AEAD, then prepend the 4-byte BE nonce.
      const ciphertextWithTag = chachaEncrypt(
        sk,
        n,
        new Uint8Array(0),
        plaintext,
      );
      const msg = new Uint8Array(
        TRANSPORT_NONCE_PREFIX_LEN + ciphertextWithTag.length,
      );
      new DataView(msg.buffer).setUint32(0, n >>> 0, false); // BE prefix
      msg.set(ciphertextWithTag, TRANSPORT_NONCE_PREFIX_LEN);
      return msg;
    },

    decrypt(message: Uint8Array): Uint8Array {
      if (message.length < TRANSPORT_NONCE_PREFIX_LEN + TAG_LEN) {
        throw new Error("Noise: message too short");
      }
      const n = new DataView(message.buffer, message.byteOffset).getUint32(
        0,
        false,
      ); // BE
      if (!recvReplay.isValid(n)) throw new Error("Noise: replay detected");
      const payload = message.slice(TRANSPORT_NONCE_PREFIX_LEN);
      const plaintext = chachaDecrypt(rk, n, new Uint8Array(0), payload);
      recvReplay.markSeen(n);
      recvCounter = Math.max(recvCounter, n + 1);
      return plaintext;
    },
  };
}

// --- NoiseHandshake class ----------------------------------------------------

// Manages the XX handshake state. Create with `createInitiator` or
// `createResponder`, then call the appropriate write/read methods in order,
// then call `split()` to obtain the transport session.
export class NoiseHandshake {
  readonly role: NoiseRole;

  // Symmetric state
  private h: Uint8Array; // handshake hash
  private ck: Uint8Array; // chaining key
  private k: Uint8Array | null = null; // current cipher key (null = no key yet)
  private n = 0; // cipher nonce counter, reset by mixKey

  // Keys
  private readonly localStaticPriv: Uint8Array;
  private readonly localStaticPub: Uint8Array;
  private localEphemeralPriv: Uint8Array | null = null;
  private localEphemeralPub: Uint8Array | null = null;
  private remoteEphemeralPub: Uint8Array | null = null;
  private remoteStaticPub: Uint8Array | null = null;

  private constructor(localStaticPriv: Uint8Array, role: NoiseRole) {
    this.role = role;
    this.localStaticPriv = localStaticPriv.slice();
    this.localStaticPub = x25519.getPublicKey(localStaticPriv);

    // Initialize symmetric state: h = ck = protocol_name (exactly 32 bytes, so
    // it is used directly, not hashed).
    this.h = new Uint8Array(32);
    this.h.set(PROTOCOL_NAME_BYTES);
    this.ck = this.h.slice();

    // MixHash(prologue). Standard Noise ALWAYS runs this after InitializeSymmetric
    // even when the prologue is empty, and bitchat does too, so h becomes
    // SHA-256(protocol_name). Skipping it left our handshake hash one hash behind
    // bitchat's, which is used as the AEAD associated data when the static key is
    // sealed in message 2: same key, different AAD, so the tag mismatches and no
    // bitchat<->Airhop handshake could ever complete. The prologue is empty on
    // both sides (see NoiseSession call sites), so no data is carried, only the
    // hash step.
    this.mixHash(new Uint8Array(0));
  }

  static createInitiator(localStaticPrivKey: Uint8Array): NoiseHandshake {
    return new NoiseHandshake(localStaticPrivKey, "initiator");
  }

  static createResponder(localStaticPrivKey: Uint8Array): NoiseHandshake {
    return new NoiseHandshake(localStaticPrivKey, "responder");
  }

  // msg1: initiator → responder (→ e)
  // Returns 32-byte ephemeral public key (no encryption yet, no payload).
  writeMsg1(): Uint8Array {
    this.assertRole("initiator");
    this.localEphemeralPriv = crypto.getRandomValues(new Uint8Array(32));
    this.localEphemeralPub = x25519.getPublicKey(this.localEphemeralPriv);
    this.mixHash(this.localEphemeralPub);
    // Empty payload: no key yet → just mixHash(empty)
    this.encryptAndHash(new Uint8Array(0));
    return this.localEphemeralPub.slice();
  }

  // msg1: responder reads
  readMsg1(msg: Uint8Array): void {
    this.assertRole("responder");
    if (msg.length < 32) throw new Error("Noise: msg1 too short");
    this.remoteEphemeralPub = msg.slice(0, 32);
    this.mixHash(this.remoteEphemeralPub);
    // Decrypt empty payload (no key yet)
    this.decryptAndHash(msg.slice(32));
  }

  // msg2: responder → initiator (← e,ee,s,es)
  // Returns 96 bytes: 32 (e_pub) + 48 (enc_s+tag) + 16 (enc_empty+tag)
  writeMsg2(): Uint8Array {
    this.assertRole("responder");
    if (this.remoteEphemeralPub === null)
      throw new Error("Noise: must readMsg1 first");

    this.localEphemeralPriv = crypto.getRandomValues(new Uint8Array(32));
    this.localEphemeralPub = x25519.getPublicKey(this.localEphemeralPriv);

    // e
    this.mixHash(this.localEphemeralPub);
    // ee: DH(my_eph, remote_eph)
    const ee = x25519.getSharedSecret(
      this.localEphemeralPriv,
      this.remoteEphemeralPub,
    );
    this.mixKey(ee);
    // s: encrypt local static pub
    const enc_s = this.encryptAndHash(this.localStaticPub); // 48 bytes
    // es: responder role → DH(my_static, remote_eph)
    const es = x25519.getSharedSecret(
      this.localStaticPriv,
      this.remoteEphemeralPub,
    );
    this.mixKey(es);
    // payload (empty)
    const enc_payload = this.encryptAndHash(new Uint8Array(0)); // 16 bytes

    return concatBytes(this.localEphemeralPub, enc_s, enc_payload);
  }

  // msg2: initiator reads
  readMsg2(msg: Uint8Array): void {
    this.assertRole("initiator");
    if (msg.length < 96) throw new Error("Noise: msg2 too short");
    let off = 0;

    // e
    const e_pub = msg.slice(off, off + 32);
    off += 32;
    this.remoteEphemeralPub = e_pub;
    this.mixHash(e_pub);
    // ee: DH(my_eph, remote_eph)
    const ee = x25519.getSharedSecret(this.localEphemeralPriv!, e_pub);
    this.mixKey(ee);
    // s: decrypt remote static pub
    const enc_s = msg.slice(off, off + 48);
    off += 48;
    this.remoteStaticPub = this.decryptAndHash(enc_s); // 32 bytes
    // es: initiator role → DH(my_eph, remote_static)
    const es = x25519.getSharedSecret(
      this.localEphemeralPriv!,
      this.remoteStaticPub,
    );
    this.mixKey(es);
    // payload (empty, 16-byte tag)
    this.decryptAndHash(msg.slice(off));
  }

  // msg3: initiator → responder (→ s,se)
  // Returns 64 bytes: 48 (enc_s+tag) + 16 (enc_empty+tag)
  writeMsg3(): Uint8Array {
    this.assertRole("initiator");
    if (this.remoteEphemeralPub === null)
      throw new Error("Noise: must readMsg2 first");

    // s: encrypt local static pub
    const enc_s = this.encryptAndHash(this.localStaticPub); // 48 bytes
    // se: initiator role → DH(my_static, remote_eph)
    const se = x25519.getSharedSecret(
      this.localStaticPriv,
      this.remoteEphemeralPub,
    );
    this.mixKey(se);
    // payload (empty)
    const enc_payload = this.encryptAndHash(new Uint8Array(0)); // 16 bytes

    return concatBytes(enc_s, enc_payload);
  }

  // msg3: responder reads
  readMsg3(msg: Uint8Array): void {
    this.assertRole("responder");
    if (msg.length < 64) throw new Error("Noise: msg3 too short");
    let off = 0;

    // s: decrypt remote static pub
    const enc_s = msg.slice(off, off + 48);
    off += 48;
    this.remoteStaticPub = this.decryptAndHash(enc_s); // 32 bytes
    // se: responder role → DH(my_eph, remote_static)
    const se = x25519.getSharedSecret(
      this.localEphemeralPriv!,
      this.remoteStaticPub,
    );
    this.mixKey(se);
    // payload (empty)
    this.decryptAndHash(msg.slice(off));
  }

  // Derive transport keys from the handshake. Must be called after the last
  // message is written/read. Zeroes out all internal handshake state.
  split(): NoiseSession {
    if (this.remoteStaticPub === null) {
      throw new Error("Noise: handshake not complete");
    }

    const [k1, k2] = noiseHkdf(this.ck, new Uint8Array(0), 2);

    // Initiator sends with k1, receives with k2. Responder is flipped.
    const [sendKey, recvKey] = this.role === "initiator" ? [k1, k2] : [k2, k1];

    const session = makeTransportSession(
      sendKey,
      recvKey,
      this.remoteStaticPub,
      this.h,
    );

    // Zero sensitive state
    this.localStaticPriv.fill(0);
    if (this.localEphemeralPriv) this.localEphemeralPriv.fill(0);
    if (this.k) this.k.fill(0);
    this.h.fill(0);
    this.ck.fill(0);

    return session;
  }

  // Symmetric state helpers

  private mixHash(data: Uint8Array): void {
    this.h = sha256(concatBytes(this.h, data));
  }

  private mixKey(ikm: Uint8Array): void {
    const [newCk, tempKey] = noiseHkdf(this.ck, ikm, 2);
    this.ck = newCk;
    this.k = tempKey;
    this.n = 0; // reset counter per Noise spec
  }

  private encryptAndHash(plaintext: Uint8Array): Uint8Array {
    if (this.k !== null) {
      const ct = chachaEncrypt(this.k, this.n++, this.h, plaintext);
      this.mixHash(ct);
      return ct;
    }
    this.mixHash(plaintext);
    return plaintext.slice();
  }

  private decryptAndHash(ciphertext: Uint8Array): Uint8Array {
    if (this.k !== null) {
      const pt = chachaDecrypt(this.k, this.n++, this.h, ciphertext);
      this.mixHash(ciphertext);
      return pt;
    }
    this.mixHash(ciphertext);
    return ciphertext.slice();
  }

  private assertRole(expected: NoiseRole): void {
    if (this.role !== expected) {
      throw new Error(`Noise: expected role ${expected}, got ${this.role}`);
    }
  }
}
