// X3DH: Extended Triple Diffie-Hellman key agreement.
//
// Spec: https://signal.org/docs/specifications/x3dh/
//
// Allows Alice to establish a shared secret with Bob even when Bob is offline,
// using a prekey bundle Bob previously published to Nostr. The resulting
// shared secret initializes a Double Ratchet session (see double-ratchet.ts).
//
// Keys:
//   IK  (Identity Key):      the node's Noise static X25519 key pair
//   SPK (Signed Prekey):     a medium-term X25519 key pair, signed by IK
//   OPK (One-Time Prekey):   a set of ephemeral X25519 key pairs; one consumed per session
//   EK  (Ephemeral Key):     fresh X25519 key pair generated per agreement (initiator only)
//
// Key agreement (Alice → Bob, OPK optional):
//   DH1 = X25519(IK_Alice.priv, SPK_Bob.pub)
//   DH2 = X25519(EK.priv,       IK_Bob.pub)
//   DH3 = X25519(EK.priv,       SPK_Bob.pub)
//   DH4 = X25519(EK.priv,       OPK_Bob.pub)   (only if OPK is present)
//   SK  = KDF(DH1 || DH2 || DH3 [|| DH4])
//
// Prekey bundles are published as Nostr kind-10002 replaceable events
// (one per node identity) so that any online peer can initiate a ratchet.

import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { concatBytes, randomBytes } from "@noble/hashes/utils.js";

// HKDF info string. Fixed; never change without a protocol version bump.
const X3DH_INFO = new TextEncoder().encode("airhop-x3dh-v1");

// "F" constant used as HKDF salt: 32 bytes of 0xFF, per the X3DH spec.
// Provides a domain separation guarantee even if DH output is weak.
const F = new Uint8Array(32).fill(0xff);

// ---- Key types --------------------------------------------------------------

export interface X25519KeyPair {
  readonly priv: Uint8Array; // 32-byte scalar
  readonly pub: Uint8Array; // 32-byte public key
}

export function generateX25519KeyPair(): X25519KeyPair {
  const priv = randomBytes(32);
  const pub = x25519.getPublicKey(priv);
  return { priv, pub };
}

// ---- Prekey bundle ----------------------------------------------------------

// A bundle the receiver (Bob) publishes to Nostr so that any sender (Alice)
// can initiate a ratchet session while Bob is offline.
export interface PrekeyBundle {
  // Bob's identity key (Noise static X25519 public key). 32 bytes.
  ikPub: Uint8Array;
  // Bob's signed prekey. 32 bytes.
  spkPub: Uint8Array;
  // Ed25519 signature of spkPub by Bob's signing key. 64 bytes.
  // Alice verifies this before using the bundle.
  spkSig: Uint8Array;
  // One-time prekeys. Alice picks one (the first) and removes it.
  // The bundle is valid without OPKs but weaker against key-compromise impersonation.
  opkPubs: Uint8Array[];
}

// A bundle together with the private keys Bob needs to complete the agreement.
export interface OwnPrekeyBundle {
  bundle: PrekeyBundle;
  spkPriv: Uint8Array; // 32-byte private key matching spkPub
  opkPrivs: Uint8Array[]; // private keys parallel to bundle.opkPubs
}

// Generate a fresh prekey bundle for this node.
//   ikPriv:       Noise static private key (X25519, 32 bytes)
//   signingPriv:  Ed25519 signing private key (32-byte seed, as stored by identity.ts)
//   opkCount:     how many one-time prekeys to generate (default 10)
export function generatePrekeyBundle(
  ikPriv: Uint8Array,
  signingPriv: Uint8Array,
  opkCount = 10,
): OwnPrekeyBundle {
  const ikPub = x25519.getPublicKey(ikPriv);

  const spk = generateX25519KeyPair();
  // Sign the SPK public key with the Ed25519 signing key.
  const spkSig = ed25519.sign(spk.pub, signingPriv);

  const opks = Array.from({ length: opkCount }, () => generateX25519KeyPair());

  return {
    bundle: {
      ikPub,
      spkPub: spk.pub,
      spkSig,
      opkPubs: opks.map((k) => k.pub),
    },
    spkPriv: spk.priv,
    opkPrivs: opks.map((k) => k.priv),
  };
}

// ---- Agreement result -------------------------------------------------------

// What the initiator (Alice) produces and sends alongside the first DR message.
export interface X3DHInitMessage {
  // Alice's ephemeral X25519 public key. Bob needs this to compute the SK.
  ekPub: Uint8Array; // 32 bytes
  // Index of the one-time prekey Bob should use. -1 if no OPK was selected.
  opkIndex: number;
  // Alice's identity key public (so Bob can compute DH2 = X25519(EK, IK_Alice)).
  ikPub: Uint8Array; // 32 bytes
}

export interface X3DHResult {
  // 32-byte shared secret. Feed directly into initSender / initReceiver
  // from double-ratchet.ts as the root key.
  sk: Uint8Array;
}

// ---- Alice (initiator) side -------------------------------------------------

// Compute the X3DH shared secret and produce the init message Alice must send
// to Bob alongside her first Double Ratchet message.
//
//   ikPriv:   Alice's Noise static private key (X25519)
//   signingPub: Bob's Ed25519 signing public key (for SPK verification)
//   bundle:   Bob's published prekey bundle
export function x3dhInitiate(
  ikPriv: Uint8Array,
  signingPub: Uint8Array,
  bundle: PrekeyBundle,
): { result: X3DHResult; initMsg: X3DHInitMessage } {
  // Verify that Bob's SPK was signed by his signing key. Prevents
  // a relay replacing the SPK with an attacker-controlled value.
  const spkValid = ed25519.verify(bundle.spkSig, bundle.spkPub, signingPub);
  if (!spkValid) throw new Error("X3DH: SPK signature verification failed");

  const ek = generateX25519KeyPair();
  const ikPub = x25519.getPublicKey(ikPriv);

  // The four DH outputs per the spec.
  const dh1 = x25519.getSharedSecret(ikPriv, bundle.spkPub);
  const dh2 = x25519.getSharedSecret(ek.priv, bundle.ikPub);
  const dh3 = x25519.getSharedSecret(ek.priv, bundle.spkPub);

  let dhConcat: Uint8Array;
  let opkIndex = -1;

  if (bundle.opkPubs.length > 0) {
    // Use the first available OPK. The sender is expected to remove it from
    // the bundle after this (the receiver removes it from local storage).
    opkIndex = 0;
    const dh4 = x25519.getSharedSecret(ek.priv, bundle.opkPubs[0]);
    dhConcat = concatBytes(dh1, dh2, dh3, dh4);
  } else {
    dhConcat = concatBytes(dh1, dh2, dh3);
  }

  const sk = hkdf(sha256, dhConcat, F, X3DH_INFO, 32);

  return {
    result: { sk },
    initMsg: { ekPub: ek.pub, opkIndex, ikPub },
  };
}

// ---- Bob (receiver) side ----------------------------------------------------

// Recompute the X3DH shared secret from Alice's init message and Bob's own keys.
//
//   ikPriv:   Bob's Noise static private key (X25519)
//   spkPriv:  Bob's signed prekey private key (X25519)
//   opkPriv:  The one-time prekey private Alice indicated (null if opkIndex === -1)
//   initMsg:  The X3DHInitMessage Alice sent
export function x3dhReceive(
  ikPriv: Uint8Array,
  spkPriv: Uint8Array,
  opkPriv: Uint8Array | null,
  initMsg: X3DHInitMessage,
): X3DHResult {
  const dh1 = x25519.getSharedSecret(spkPriv, initMsg.ikPub);
  const dh2 = x25519.getSharedSecret(ikPriv, initMsg.ekPub);
  const dh3 = x25519.getSharedSecret(spkPriv, initMsg.ekPub);

  let dhConcat: Uint8Array;
  if (opkPriv !== null) {
    const dh4 = x25519.getSharedSecret(opkPriv, initMsg.ekPub);
    dhConcat = concatBytes(dh1, dh2, dh3, dh4);
  } else {
    dhConcat = concatBytes(dh1, dh2, dh3);
  }

  const sk = hkdf(sha256, dhConcat, F, X3DH_INFO, 32);
  return { sk };
}

// ---- Nostr bundle serialization ---------------------------------------------
//
// Bundles are published as the content of a Nostr kind-10002 replaceable event
// (one per node; newer replaces older). Content is a JSON object:
//
//   {
//     "v": 1,
//     "ik":  "<hex>",          // 32-byte IK public key
//     "spk": "<hex>",          // 32-byte SPK public key
//     "sig": "<hex>",          // 64-byte Ed25519 SPK signature
//     "opks": ["<hex>", ...]   // one-time prekeys (may be empty)
//   }

export function serializeBundle(bundle: PrekeyBundle): string {
  return JSON.stringify({
    v: 1,
    ik: toHex(bundle.ikPub),
    spk: toHex(bundle.spkPub),
    sig: toHex(bundle.spkSig),
    opks: bundle.opkPubs.map(toHex),
  });
}

export function deserializeBundle(json: string): PrekeyBundle {
  const obj = JSON.parse(json) as {
    v: number;
    ik: string;
    spk: string;
    sig: string;
    opks: string[];
  };
  if (obj.v !== 1) throw new Error("X3DH: unsupported bundle version");
  return {
    ikPub: fromHex(obj.ik),
    spkPub: fromHex(obj.spk),
    spkSig: fromHex(obj.sig),
    opkPubs: (obj.opks ?? []).map(fromHex),
  };
}

// ---- Hex helpers ------------------------------------------------------------

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("X3DH: odd-length hex");
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}
