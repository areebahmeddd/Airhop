// Gossiped one-time prekey bundles (MessageType 0x24).
//
// Byte-identical to bitchat PrekeyBundle.swift. A bundle publishes a batch of
// one-time Curve25519 public prekeys bound to the owner's Noise static key by an
// Ed25519 signature over domain-prefixed canonical bytes. Anyone holding the
// owner's announce-verified signing key can verify a bundle offline, which is
// what lets bundles spread and persist mesh-wide via gossip sync while the owner
// is away. Senders seal courier mail to one of these prekeys (one-way Noise X)
// instead of the owner's long-lived static key, restoring forward secrecy for
// asynchronous first contact.
//
// TLV layout (type u8, length u16 big-endian, value):
//   0x01 noiseStaticPublicKey (32B)
//   0x02 prekeys              (N x [id u32-BE ‖ pubkey 32B], 1..8 entries)
//   0x03 generatedAt         (u64-BE ms; newer replaces older per noise key)
//   0x04 signature           (64B Ed25519 over signableBytes)
// Unknown TLVs are skipped for forward compatibility.

import { ed25519 } from "@noble/curves/ed25519.js";

export const PREKEY_KEY_LENGTH = 32;
export const PREKEY_SIGNATURE_LENGTH = 64;
export const PREKEY_MAX_PREKEYS = 8;
const PREKEY_ENTRY_LENGTH = 4 + PREKEY_KEY_LENGTH;

const SIGNING_CONTEXT = new TextEncoder().encode("bitchat-prekey-bundle-v1");

enum TLV {
  NOISE_STATIC_PUBLIC_KEY = 0x01,
  PREKEYS = 0x02,
  GENERATED_AT = 0x03,
  SIGNATURE = 0x04,
}

export interface Prekey {
  id: number; // u32
  publicKey: Uint8Array; // 32-byte Curve25519 public key
}

export interface PrekeyBundle {
  noiseStaticPublicKey: Uint8Array; // 32 bytes
  prekeys: Prekey[];
  generatedAt: number; // ms
  signature: Uint8Array; // 64 bytes
}

// ---- byte helpers -----------------------------------------------------------

function u32be(value: number): Uint8Array {
  const out = new Uint8Array(4);
  new DataView(out.buffer).setUint32(0, value >>> 0, false);
  return out;
}

function u64be(value: number): Uint8Array {
  const out = new Uint8Array(8);
  new DataView(out.buffer).setBigUint64(0, BigInt(value), false);
  return out;
}

function u16be(value: number): Uint8Array {
  const out = new Uint8Array(2);
  new DataView(out.buffer).setUint16(0, value, false);
  return out;
}

function paddedKey(key: Uint8Array): Uint8Array {
  const fixed = key.slice(0, PREKEY_KEY_LENGTH);
  if (fixed.length === PREKEY_KEY_LENGTH) return fixed;
  const out = new Uint8Array(PREKEY_KEY_LENGTH);
  out.set(fixed);
  return out;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

// ---- signing ----------------------------------------------------------------

// Canonical bytes covered by the Ed25519 signature: domain context, owner key,
// prekey count, each (id, key) pair, and the generation time. Encoders and
// verifiers must derive these identically (matches Swift signableBytes()).
export function prekeyBundleSignableBytes(
  fields: Omit<PrekeyBundle, "signature">,
): Uint8Array {
  const parts: Uint8Array[] = [];
  const ctx = SIGNING_CONTEXT.slice(0, 255);
  parts.push(new Uint8Array([ctx.length]));
  parts.push(ctx);
  parts.push(paddedKey(fields.noiseStaticPublicKey));
  parts.push(new Uint8Array([Math.min(fields.prekeys.length, 255)]));
  for (const prekey of fields.prekeys.slice(0, 255)) {
    parts.push(u32be(prekey.id));
    parts.push(paddedKey(prekey.publicKey));
  }
  parts.push(u64be(fields.generatedAt));
  return concat(parts);
}

export function signPrekeyBundle(
  fields: Omit<PrekeyBundle, "signature">,
  signingPrivKey: Uint8Array,
): PrekeyBundle {
  const signature = ed25519.sign(
    prekeyBundleSignableBytes(fields),
    signingPrivKey,
  );
  return { ...fields, signature };
}

// Verify against the owner's announce-bound Ed25519 signing key (which the
// caller supplies; the bundle itself carries only the noise key).
export function verifyPrekeyBundle(
  bundle: PrekeyBundle,
  signingPubKey: Uint8Array,
): boolean {
  try {
    return ed25519.verify(
      bundle.signature,
      prekeyBundleSignableBytes(bundle),
      signingPubKey,
    );
  } catch {
    return false;
  }
}

// ---- wire encode/decode -----------------------------------------------------

export function encodePrekeyBundle(bundle: PrekeyBundle): Uint8Array | null {
  if (
    bundle.noiseStaticPublicKey.length !== PREKEY_KEY_LENGTH ||
    bundle.signature.length !== PREKEY_SIGNATURE_LENGTH ||
    bundle.prekeys.length === 0 ||
    bundle.prekeys.length > PREKEY_MAX_PREKEYS ||
    !bundle.prekeys.every((p) => p.publicKey.length === PREKEY_KEY_LENGTH)
  ) {
    return null;
  }

  const entries: Uint8Array[] = [];
  for (const prekey of bundle.prekeys) {
    entries.push(u32be(prekey.id));
    entries.push(prekey.publicKey);
  }
  const entriesBytes = concat(entries);

  const parts: Uint8Array[] = [];
  const tlv = (type: TLV, value: Uint8Array) => {
    parts.push(new Uint8Array([type]));
    parts.push(u16be(value.length));
    parts.push(value);
  };
  tlv(TLV.NOISE_STATIC_PUBLIC_KEY, bundle.noiseStaticPublicKey);
  tlv(TLV.PREKEYS, entriesBytes);
  tlv(TLV.GENERATED_AT, u64be(bundle.generatedAt));
  tlv(TLV.SIGNATURE, bundle.signature);
  return concat(parts);
}

export function decodePrekeyBundle(data: Uint8Array): PrekeyBundle | null {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let off = 0;
  let noiseStaticPublicKey: Uint8Array | undefined;
  let prekeys: Prekey[] | undefined;
  let generatedAt: number | undefined;
  let signature: Uint8Array | undefined;

  while (off < data.length) {
    const type = data[off];
    off += 1;
    if (off + 2 > data.length) return null;
    const length = view.getUint16(off, false);
    off += 2;
    if (off + length > data.length) return null;
    const value = data.subarray(off, off + length);
    off += length;

    switch (type) {
      case TLV.NOISE_STATIC_PUBLIC_KEY:
        if (length !== PREKEY_KEY_LENGTH) return null;
        noiseStaticPublicKey = value.slice();
        break;
      case TLV.PREKEYS: {
        if (
          length === 0 ||
          length % PREKEY_ENTRY_LENGTH !== 0 ||
          length / PREKEY_ENTRY_LENGTH > PREKEY_MAX_PREKEYS
        ) {
          return null;
        }
        const parsed: Prekey[] = [];
        for (let p = 0; p < length; p += PREKEY_ENTRY_LENGTH) {
          const id =
            (value[p] << 24) |
            (value[p + 1] << 16) |
            (value[p + 2] << 8) |
            value[p + 3];
          parsed.push({
            id: id >>> 0,
            publicKey: value.slice(p + 4, p + PREKEY_ENTRY_LENGTH),
          });
        }
        prekeys = parsed;
        break;
      }
      case TLV.GENERATED_AT:
        if (length !== 8) return null;
        generatedAt = Number(view.getBigUint64(off - length, false));
        break;
      case TLV.SIGNATURE:
        if (length !== PREKEY_SIGNATURE_LENGTH) return null;
        signature = value.slice();
        break;
      default:
        break; // unknown TLV: forward compatible
    }
  }

  if (
    noiseStaticPublicKey === undefined ||
    prekeys === undefined ||
    generatedAt === undefined ||
    signature === undefined ||
    prekeys.length === 0
  ) {
    return null;
  }
  // Duplicate prekey IDs would let one consumed ID shadow another.
  if (new Set(prekeys.map((p) => p.id)).size !== prekeys.length) return null;

  return { noiseStaticPublicKey, prekeys, generatedAt, signature };
}
