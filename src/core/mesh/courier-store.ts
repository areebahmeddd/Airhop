// Store-and-forward courier system.
//
// Compatible with bitchat iOS CourierStore.swift.
//
// When no transport can reach a recipient, a message is sealed (Noise X) into
// a courier envelope and handed to connected peers who may physically encounter
// the recipient later. Strict quotas prevent the device from being used as a
// public mailbag.
//
// Envelope wire format (COURIER_ENV packet payload):
//   [16 bytes: recipient tag]  HMAC-SHA256(recipientNoisePub, dayEpoch)[0:16]
//   [8  bytes: expiry]         Unix milliseconds as u64 BE
//   [1  byte:  copies]         Spray-and-wait budget
//   [rest:     ciphertext]     Noise X sealed payload

import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { noiseXOpen, noiseXSeal } from "../crypto/noise-x";
import {
  Flags,
  PacketType,
  signPacket,
  type Packet,
} from "../mesh/packet-codec";

// Constants per PROTOCOLS.md section 6.
const POOL_SIZE = 40;
const ENVELOPE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ENVELOPE_BYTES = 16 * 1024; // 16 KiB plaintext cap
const FAVORITE_QUOTA = 5;
const VERIFIED_QUOTA = 2;

// Spray-and-wait: initial copy budget per envelope.
const INITIAL_COPIES = 4;

// ---- Recipient tag -----------------------------------------------------------

// Matches CourierEnvelope.recipientTag(noiseStaticKey:epochDay:) in BitFoundation.
// HMAC-SHA256(key=noiseStaticKey, message="bitchat-courier-tag-v1" || epochDay_BE4)[0:16]
// epochDay = floor(unixSeconds / 86400) as u32 BE (rotates daily).
const TAG_CONTEXT = new TextEncoder().encode("bitchat-courier-tag-v1");

export function recipientTag(
  recipientNoisePubKey: Uint8Array,
  nowMs: number = Date.now(),
): Uint8Array {
  const epochDay = Math.floor(nowMs / (86400 * 1000));
  // 4-byte BE u32 epoch day (matches Swift epochDay(for:) which returns UInt32)
  const dayBuf = new Uint8Array(4);
  new DataView(dayBuf.buffer).setUint32(0, epochDay >>> 0, false);
  const message = new Uint8Array(TAG_CONTEXT.length + 4);
  message.set(TAG_CONTEXT);
  message.set(dayBuf, TAG_CONTEXT.length);
  const mac = hmac(sha256, recipientNoisePubKey, message);
  return mac.slice(0, 16);
}

// ---- Envelope wire format ---------------------------------------------------
//
// TLV encoding matching bitchat iOS CourierEnvelope.encode() / .decode().
// Types:
//   0x01  recipientTag  (16 bytes)
//   0x02  expiry        (8 bytes, u64 BE, milliseconds)
//   0x03  ciphertext    (variable)
//   0x04  copies        (1 byte, omitted when copies == 1)
//
// All lengths are u16 BE.

const ENV_TLV_TAG = 0x01;
const ENV_TLV_EXPIRY = 0x02;
const ENV_TLV_CIPHERTEXT = 0x03;
const ENV_TLV_COPIES = 0x04;
const TAG_LENGTH = 16;

function appendTlv(type: number, value: Uint8Array, into: number[]): void {
  into.push(type);
  into.push((value.length >> 8) & 0xff);
  into.push(value.length & 0xff);
  for (const b of value) into.push(b);
}

export interface SealedEnvelope {
  recipientTag: Uint8Array; // 16 bytes
  expiryMs: number; // Unix ms
  copies: number; // spray budget
  ciphertext: Uint8Array; // Noise X output
}

export function encodeEnvelopePayload(env: SealedEnvelope): Uint8Array {
  const bytes: number[] = [];

  appendTlv(ENV_TLV_TAG, env.recipientTag.slice(0, TAG_LENGTH), bytes);

  const expiryBuf = new Uint8Array(8);
  new DataView(expiryBuf.buffer).setBigUint64(0, BigInt(env.expiryMs), false);
  appendTlv(ENV_TLV_EXPIRY, expiryBuf, bytes);

  appendTlv(ENV_TLV_CIPHERTEXT, env.ciphertext, bytes);

  // Omit copies TLV when == 1 (carry-only); matches bitchat iOS wire format
  if (env.copies > 1) {
    appendTlv(ENV_TLV_COPIES, new Uint8Array([env.copies & 0xff]), bytes);
  }

  return new Uint8Array(bytes);
}

export function decodeEnvelopePayload(
  payload: Uint8Array,
): SealedEnvelope | null {
  let off = 0;
  let tag: Uint8Array | undefined;
  let expiryMs: number | undefined;
  let ciphertext: Uint8Array | undefined;
  let copies = 1;

  while (off + 3 <= payload.length) {
    const type = payload[off];
    off++;
    const len = new DataView(
      payload.buffer,
      payload.byteOffset + off,
    ).getUint16(0, false);
    off += 2;
    if (off + len > payload.length) return null;
    const value = payload.slice(off, off + len);
    off += len;

    switch (type) {
      case ENV_TLV_TAG:
        if (len === TAG_LENGTH) tag = value;
        break;
      case ENV_TLV_EXPIRY:
        if (len === 8)
          expiryMs = Number(
            new DataView(value.buffer, value.byteOffset).getBigUint64(0, false),
          );
        break;
      case ENV_TLV_CIPHERTEXT:
        if (len > 0 && len <= MAX_ENVELOPE_BYTES) ciphertext = value;
        break;
      case ENV_TLV_COPIES:
        if (len === 1) copies = value[0];
        break;
      // Unknown TLVs: skip for forward compatibility
    }
  }

  if (tag === undefined || expiryMs === undefined || ciphertext === undefined)
    return null;
  return { recipientTag: tag, expiryMs, copies, ciphertext };
}

// ---- Trust tiers ------------------------------------------------------------

export type CourierTier = "favorite" | "verified";

interface StoredEnvelope {
  recipientTag: Uint8Array;
  expiryMs: number;
  ciphertext: Uint8Array;
  depositorNoisePub: Uint8Array; // 32-byte X25519 pub of who deposited this
  storedAt: number;
  tier: CourierTier;
  copies: number;
}

// ---- CourierStore -----------------------------------------------------------

export class CourierStore {
  private readonly envelopes: StoredEnvelope[] = [];

  // Deposit an incoming courier envelope. Returns true if accepted.
  deposit(
    payload: Uint8Array,
    depositorNoisePub: Uint8Array,
    tier: CourierTier,
  ): boolean {
    const env = decodeEnvelopePayload(payload);
    if (env === null) return false;
    if (env.expiryMs < Date.now()) return false; // already expired
    if (env.ciphertext.length > MAX_ENVELOPE_BYTES) return false;

    this.evictExpired();

    // Check per-depositor quota by tier.
    const quota = tier === "favorite" ? FAVORITE_QUOTA : VERIFIED_QUOTA;
    const depositorCount = this.envelopes.filter(
      (e) =>
        e.depositorNoisePub.every((b, i) => b === depositorNoisePub[i]) &&
        e.tier === tier,
    ).length;
    if (depositorCount >= quota) return false;

    // Check total pool cap.
    if (this.envelopes.length >= POOL_SIZE) {
      // Evict lowest-priority slot (verified-tier, then oldest).
      const idx = this.findEvictionCandidate();
      if (idx < 0) return false; // pool full, all favorites
      this.envelopes.splice(idx, 1);
    }

    this.envelopes.push({
      recipientTag: env.recipientTag,
      expiryMs: env.expiryMs,
      ciphertext: env.ciphertext,
      depositorNoisePub: depositorNoisePub.slice(),
      storedAt: Date.now(),
      tier,
      copies: env.copies,
    });
    return true;
  }

  // Check if any carried envelopes match this recipient tag. Returns matching
  // ciphertexts for delivery (and removes them from the store).
  deliverMatching(tag: Uint8Array): SealedEnvelope[] {
    const delivered: SealedEnvelope[] = [];
    for (let i = this.envelopes.length - 1; i >= 0; i--) {
      const e = this.envelopes[i];
      if (e.recipientTag.every((b, j) => b === tag[j])) {
        delivered.push({
          recipientTag: e.recipientTag,
          expiryMs: e.expiryMs,
          copies: e.copies,
          ciphertext: e.ciphertext,
        });
        this.envelopes.splice(i, 1);
      }
    }
    return delivered;
  }

  // Spray: when meeting a courier-eligible peer, hand half the copy budget.
  // Returns packets to forward, decrementing the stored copies.
  sprayTo(_peerNoisePub: Uint8Array): SealedEnvelope[] {
    const toSpray: SealedEnvelope[] = [];

    for (const e of this.envelopes) {
      if (e.copies < 2) continue;
      const half = Math.floor(e.copies / 2);
      e.copies -= half;
      toSpray.push({
        recipientTag: e.recipientTag,
        expiryMs: e.expiryMs,
        copies: half,
        ciphertext: e.ciphertext,
      });
    }
    return toSpray;
  }

  // Seal a plaintext message into a courier envelope packet.
  static seal(
    plaintext: Uint8Array,
    senderStaticPrivKey: Uint8Array,
    recipientNoisePubKey: Uint8Array,
    senderPeerID: string,
    signingPrivKey: Uint8Array,
  ): Packet {
    const ciphertext = noiseXSeal(
      senderStaticPrivKey,
      recipientNoisePubKey,
      plaintext,
    );
    const tag = recipientTag(recipientNoisePubKey);
    const expiryMs = Date.now() + ENVELOPE_TTL_MS;

    const env: SealedEnvelope = {
      recipientTag: tag,
      expiryMs,
      copies: INITIAL_COPIES,
      ciphertext,
    };

    const senderIDBytes = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
      senderIDBytes[i] = parseInt(senderPeerID.slice(i * 2, i * 2 + 2), 16);
    }

    const packet: Packet = {
      type: PacketType.COURIER_ENV,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: senderIDBytes,
      recipientID: new Uint8Array(8), // broadcast
      timestamp: Math.floor(Date.now() / 1000),
      nonce: crypto.getRandomValues(new Uint8Array(8)),
      signature: new Uint8Array(64),
      payload: encodeEnvelopePayload(env),
    };
    packet.signature = signPacket(packet, signingPrivKey);
    return packet;
  }

  // Open a courier envelope addressed to us.
  static open(
    ciphertext: Uint8Array,
    recipientStaticPrivKey: Uint8Array,
  ): { plaintext: Uint8Array; senderStaticPubKey: Uint8Array } {
    return noiseXOpen(recipientStaticPrivKey, ciphertext);
  }

  evictExpired(): void {
    const now = Date.now();
    for (let i = this.envelopes.length - 1; i >= 0; i--) {
      if (this.envelopes[i].expiryMs < now) this.envelopes.splice(i, 1);
    }
  }

  get size(): number {
    return this.envelopes.length;
  }

  reset(): void {
    this.envelopes.length = 0;
  }

  // Returns index of best eviction candidate: prefer verified-tier, then oldest.
  private findEvictionCandidate(): number {
    let bestIdx = -1;
    let bestScore = -1;

    for (let i = 0; i < this.envelopes.length; i++) {
      const e = this.envelopes[i];
      // Score: verified-tier (higher) + older (higher)
      const tierScore = e.tier === "verified" ? 1000 : 0;
      const ageScore = Date.now() - e.storedAt;
      const score = tierScore + ageScore;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    return bestIdx;
  }
}
