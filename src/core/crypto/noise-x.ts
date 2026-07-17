// Noise_X_25519_ChaChaPoly_SHA256 one-way sealing.
//
// Used for courier envelopes: the sender seals a message to a known recipient
// static key. The recipient can decrypt and verify the sender's identity.
//
// Single-message pattern: → e, es, s, ss
//
// Wire format: [32 e_pub][48 enc_s+tag][payload_len+16 enc_payload+tag]
//
// Unlike XX, there is no response from the recipient. This means:
// - No forward secrecy: compromise of the recipient's static key exposes mail.
// - The sender's identity is authenticated inside the ciphertext.

import { chacha20poly1305 } from "@noble/ciphers/chacha.js";
import { x25519 } from "@noble/curves/ed25519.js";
import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { concatBytes } from "@noble/hashes/utils.js";

const PROTOCOL_NAME_BYTES = new TextEncoder().encode(
  "Noise_X_25519_ChaChaPoly_SHA256",
);

const TAG_LEN = 16;

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

function makeNonce(counter: number): Uint8Array {
  const nonce = new Uint8Array(12);
  new DataView(nonce.buffer).setUint32(4, counter >>> 0, true);
  return nonce;
}

// Symmetric state bundled into a plain object to avoid class overhead
// for a one-shot operation.
type SymState = {
  h: Uint8Array;
  ck: Uint8Array;
  k: Uint8Array | null;
  n: number;
};

function initSymState(): SymState {
  const h = new Uint8Array(32);
  h.set(PROTOCOL_NAME_BYTES);
  return { h, ck: h.slice(), k: null, n: 0 };
}

function mixHash(ss: SymState, data: Uint8Array): void {
  ss.h = sha256(concatBytes(ss.h, data));
}

function mixKey(ss: SymState, ikm: Uint8Array): void {
  const [newCk, tempKey] = noiseHkdf(ss.ck, ikm, 2);
  ss.ck = newCk;
  ss.k = tempKey;
  ss.n = 0;
}

function encryptAndHash(ss: SymState, plaintext: Uint8Array): Uint8Array {
  if (ss.k !== null) {
    const ct = chacha20poly1305(ss.k, makeNonce(ss.n++), ss.h).encrypt(
      plaintext,
    );
    mixHash(ss, ct);
    return ct;
  }
  mixHash(ss, plaintext);
  return plaintext.slice();
}

function decryptAndHash(ss: SymState, ciphertext: Uint8Array): Uint8Array {
  if (ss.k !== null) {
    const pt = chacha20poly1305(ss.k, makeNonce(ss.n++), ss.h).decrypt(
      ciphertext,
    );
    mixHash(ss, ciphertext);
    return pt;
  }
  mixHash(ss, ciphertext);
  return ciphertext.slice();
}

// Seal `plaintext` from the sender to the recipient.
//
// `senderStaticPrivKey`    : 32-byte X25519 private key of the sender
// `recipientStaticPubKey`  : 32-byte X25519 public key of the recipient
//
// Returns the sealed envelope ciphertext.
export function noiseXSeal(
  senderStaticPrivKey: Uint8Array,
  recipientStaticPubKey: Uint8Array,
  plaintext: Uint8Array,
): Uint8Array {
  const ss = initSymState();

  // Pre-message: mix recipient's static pub (known upfront)
  mixHash(ss, recipientStaticPubKey);

  // Generate ephemeral key
  const ePriv = crypto.getRandomValues(new Uint8Array(32));
  const ePub = x25519.getPublicKey(ePriv);
  const senderStaticPub = x25519.getPublicKey(senderStaticPrivKey);

  // e: send ephemeral pub
  mixHash(ss, ePub);

  // es: DH(e_sender, s_recipient)
  const es = x25519.getSharedSecret(ePriv, recipientStaticPubKey);
  mixKey(ss, es);

  // s: encrypt sender static pub
  const enc_s = encryptAndHash(ss, senderStaticPub); // 32+16 = 48 bytes

  // ss: DH(s_sender, s_recipient)
  const ss_dh = x25519.getSharedSecret(
    senderStaticPrivKey,
    recipientStaticPubKey,
  );
  mixKey(ss, ss_dh);

  // payload
  const enc_payload = encryptAndHash(ss, plaintext);

  // Zero ephemeral priv
  ePriv.fill(0);

  return concatBytes(ePub, enc_s, enc_payload);
}

// Open a sealed envelope.
//
// `recipientStaticPrivKey` : 32-byte X25519 private key of the recipient
//
// Returns `{ plaintext, senderStaticPubKey }`.
// Throws on authentication failure.
export function noiseXOpen(
  recipientStaticPrivKey: Uint8Array,
  envelope: Uint8Array,
): { plaintext: Uint8Array; senderStaticPubKey: Uint8Array } {
  const recipientStaticPub = x25519.getPublicKey(recipientStaticPrivKey);
  const minLen = 32 + 48 + TAG_LEN; // e_pub + enc_s+tag + enc_empty+tag
  if (envelope.length < minLen) throw new Error("NoiseX: envelope too short");

  const ss = initSymState();

  // Pre-message: mix our static pub
  mixHash(ss, recipientStaticPub);

  let off = 0;

  // e: read sender ephemeral pub
  const ePub = envelope.slice(off, off + 32);
  off += 32;
  mixHash(ss, ePub);

  // es: DH(s_recipient, e_sender)
  const es = x25519.getSharedSecret(recipientStaticPrivKey, ePub);
  mixKey(ss, es);

  // s: decrypt sender static pub
  const enc_s = envelope.slice(off, off + 48);
  off += 48;
  const senderStaticPub = decryptAndHash(ss, enc_s); // 32 bytes

  // ss: DH(s_recipient, s_sender)
  const ss_dh = x25519.getSharedSecret(recipientStaticPrivKey, senderStaticPub);
  mixKey(ss, ss_dh);

  // payload
  const enc_payload = envelope.slice(off);
  const plaintext = decryptAndHash(ss, enc_payload);

  return { plaintext, senderStaticPubKey: senderStaticPub };
}
