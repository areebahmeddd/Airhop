// Gossip sync using Golomb-Coded Set (GCS) filters.
//
// Wire-compatible with bitchat iOS GossipSyncManager / RequestSyncPacket.
//
// Protocol flow:
//   1. Every 15 seconds, broadcast a REQUEST_SYNC packet containing a GCS
//      filter of the packet IDs we have seen recently.
//   2. On receiving a REQUEST_SYNC from a peer, decode the filter and send
//      back any packets we have that the peer appears to be missing.
//
// Packet ID (per PacketIdUtil.swift / PacketIdUtil.kt):
//   SHA-256(type[1] | senderID[8] | timestamp_u64_BE[8] | payload)[0:16]
//   See computePacketId in packet-codec.ts.
//
// GCS hash for filter membership:
//   h64 = first 8 bytes of SHA-256(packetID) as big-endian u64
//
// Wire format for REQUEST_SYNC payload (TLV, type-u8, length-u16-BE, value):
//   0x01  P       (uint8)   Golomb-Rice parameter
//   0x02  M       (uint32 BE) hash range
//   0x03  data    (bytes)   Golomb-Rice bitstream
//   0x04  types   (1-8 bytes LE) SyncTypeFlags bitmask

import { sha256 } from "@noble/hashes/sha2.js";
import { concatBytes } from "@noble/hashes/utils.js";
import {
  computePacketId,
  Flags,
  PacketType,
  signPacket,
  type Packet,
} from "./packet-codec";

// Constants per PROTOCOLS.md section 5.
const SYNC_INTERVAL_MS = 15_000;
const SEEN_CAPACITY = 1000;
const GCS_MAX_BYTES = 400;
const GCS_TARGET_FPR = 0.01; // 1%

// SyncTypeFlags bit indices (bit -> message type), matching bitchat's
// SyncTypeFlags.swift so a board sync round is mutually intelligible.
const TYPE_BIT_ANNOUNCE = 0; // bit 0
const TYPE_BIT_MESSAGE = 1; // bit 1
const TYPE_BIT_BOARD = 8; // bit 8 (board posts persist and sync until expiry)

// Map a packet type to its SyncTypeFlags bit, or null when it is not gossiped.
function syncBitForType(type: PacketType): number | null {
  switch (type) {
    case PacketType.ANNOUNCE:
      return TYPE_BIT_ANNOUNCE;
    case PacketType.CHANNEL_MSG:
      return TYPE_BIT_MESSAGE;
    case PacketType.BOARD_POST:
      return TYPE_BIT_BOARD;
    default:
      return null;
  }
}

// The bitfield is a little-endian integer, 1-8 bytes with trailing zero bytes
// trimmed (bit 8 widens it from 1 to 2 bytes). Unknown high bits are ignored by
// the decoder, so old clients simply never match the newer bits.
function encodeTypeFlags(types: number): Uint8Array {
  const bytes: number[] = [];
  let v = types;
  while (v > 0 && bytes.length < 8) {
    bytes.push(v & 0xff);
    v = Math.floor(v / 256);
  }
  if (bytes.length === 0) bytes.push(0);
  return new Uint8Array(bytes);
}

function decodeTypeFlags(bytes: Uint8Array): number {
  let v = 0;
  for (let i = 0; i < bytes.length && i < 8; i++) v += bytes[i] * 256 ** i;
  return v;
}

// ---- GCS h64 derivation -----------------------------------------------------

// 8-byte value for GCS membership check:
// h64 = first 8 bytes of SHA-256(packetID) as big-endian u64, sign bit cleared.
// The sign-bit mask matches bitchat iOS GCSFilter.h64(_:).
function packetIdToH64(packetId: Uint8Array): bigint {
  const hash = sha256(packetId);
  const view = new DataView(hash.buffer);
  const raw =
    (BigInt(view.getUint32(0, false)) << 32n) |
    BigInt(view.getUint32(4, false));
  return raw & 0x7fff_ffff_ffff_ffffn; // clear sign bit
}

// ---- GCS filter (Golomb-Coded Set) -------------------------------------------

function deriveP(fpr: number): number {
  const f = Math.max(0.000001, Math.min(0.25, fpr));
  return Math.max(1, Math.ceil(Math.log2(1 / f)));
}

// Build a GCS filter from an array of h64 values.
// Returns { p, m, data } where data is the Golomb-Rice bitstream.
//
// M formula: M = count * 2^P, matching bitchat iOS GCSFilter.hashRange().
// This gives FPR ≈ 1/2^P per element regardless of the set size.
export function buildGcsFilter(
  h64s: bigint[],
  maxBytes: number,
  targetFpr: number,
): { p: number; m: number; data: Uint8Array } {
  const p = deriveP(targetFpr);
  if (h64s.length === 0) {
    return { p, m: 1, data: new Uint8Array(0) };
  }

  // M = count * 2^P, capped at u32 max to match the bitchat iOS wire type.
  const raw = h64s.length * (1 << p);
  const mNum = Math.min(raw, 0xffffffff);
  const modulo = BigInt(Math.max(1, mNum));

  // Map each h64 to [1, M), deduplicate and sort (matches normalizeMappedValues).
  const mapped = h64s
    .map((v) => {
      const x = v % modulo;
      return x === 0n ? 1n : x;
    })
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  // Deduplicate: keep only values strictly greater than the previous.
  const sorted: bigint[] = [];
  let last = 0n;
  for (const v of mapped) {
    if (v > last) {
      sorted.push(v);
      last = v;
    }
  }

  const data = encodeGolombRice(sorted, p, maxBytes);
  return { p, m: mNum, data };
}

function encodeGolombRice(
  sorted: bigint[],
  p: number,
  maxBytes: number,
): Uint8Array {
  const bits: number[] = [];

  function writeBit(b: number): void {
    bits.push(b & 1);
  }

  let prev = 0n;
  for (const v of sorted) {
    const delta = v - prev;
    if (delta <= 0n) continue; // skip duplicates
    prev = v;
    const x = delta - 1n; // encode x+1 → store x
    const q = Number(x >> BigInt(p));
    const r = Number(x & BigInt((1 << p) - 1));
    // Unary: q ones then zero
    for (let i = 0; i < q; i++) writeBit(1);
    writeBit(0);
    // P-bit remainder (MSB first)
    for (let i = p - 1; i >= 0; i--) writeBit((r >> i) & 1);
  }

  // Pack bits into bytes (MSB first within each byte).
  const byteCount = Math.ceil(bits.length / 8);
  if (byteCount > maxBytes) {
    // If it doesn't fit, return empty (caller treats as "no filter").
    return new Uint8Array(0);
  }

  const out = new Uint8Array(byteCount);
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) out[i >> 3] |= 1 << (7 - (i & 7));
  }
  return out;
}

// Decode a GCS filter and return the sorted set of mapped h64 values.
export function decodeGcsFilter(
  p: number,
  m: number,
  data: Uint8Array,
): bigint[] {
  if (p < 1 || p > 32 || m <= 1 || data.length === 0) return [];

  const modulo = BigInt(m);
  const values: bigint[] = [];
  let bitPos = 0;
  let acc = 0n;

  function readBit(): number | null {
    if (bitPos >= data.length * 8) return null;
    const b = (data[bitPos >> 3] >> (7 - (bitPos & 7))) & 1;
    bitPos++;
    return b;
  }

  function readUnary(): number | null {
    let q = 0;
    while (true) {
      const b = readBit();
      if (b === null) return null;
      if (b === 0) return q;
      q++;
      if (q > 0xffff) return null; // guard against malformed input
    }
  }

  function readBits(count: number): number | null {
    let result = 0;
    for (let i = 0; i < count; i++) {
      const b = readBit();
      if (b === null) return null;
      result = (result << 1) | b;
    }
    return result;
  }

  while (true) {
    const q = readUnary();
    if (q === null) break;
    const r = readBits(p);
    if (r === null) break;
    const x = (BigInt(q) << BigInt(p)) + BigInt(r) + 1n;
    acc += x;
    if (acc >= modulo) break;
    values.push(acc);
  }

  return values;
}

// Check whether a h64 value is contained in a decoded filter set.
function filterContains(sortedValues: bigint[], candidate: bigint): boolean {
  let lo = 0;
  let hi = sortedValues.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (sortedValues[mid] === candidate) return true;
    if (sortedValues[mid] < candidate) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}

// ---- Wire encode/decode for REQUEST_SYNC payload ----------------------------

// TLV encoder: type (u8), length (u16 BE), value
function encodeTlv(type: number, value: Uint8Array): Uint8Array {
  const out = new Uint8Array(3 + value.length);
  out[0] = type;
  new DataView(out.buffer).setUint16(1, value.length, false); // BE
  out.set(value, 3);
  return out;
}

export interface GossipFilterPayload {
  p: number;
  m: number;
  data: Uint8Array;
  types?: number; // SyncTypeFlags bitmask
}

export function encodeGossipFilterPayload(
  params: GossipFilterPayload,
): Uint8Array {
  const parts: Uint8Array[] = [
    encodeTlv(0x01, new Uint8Array([params.p & 0xff])),
    encodeTlv(
      0x02,
      (() => {
        const b = new Uint8Array(4);
        new DataView(b.buffer).setUint32(0, params.m, false);
        return b;
      })(),
    ),
    encodeTlv(0x03, params.data),
  ];
  if (params.types !== undefined && params.types !== 0) {
    parts.push(encodeTlv(0x04, encodeTypeFlags(params.types)));
  }
  return concatBytes(...parts);
}

export function decodeGossipFilterPayload(
  payload: Uint8Array,
): GossipFilterPayload | null {
  let off = 0;
  let p: number | undefined;
  let m: number | undefined;
  let data: Uint8Array | undefined;
  let types: number | undefined;

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
      case 0x01:
        if (value.length === 1) p = value[0];
        break;
      case 0x02:
        if (value.length === 4)
          m = new DataView(value.buffer, value.byteOffset).getUint32(0, false);
        break;
      case 0x03:
        if (value.length <= GCS_MAX_BYTES + 16) data = value;
        break;
      case 0x04:
        if (value.length >= 1 && value.length <= 8)
          types = decodeTypeFlags(value);
        break;
    }
  }

  if (p === undefined || m === undefined || data === undefined) return null;
  return { p, m, data, types };
}

// ---- GossipSync class -------------------------------------------------------

export type SendFn = (packet: Packet) => void;
export type SendToPeerFn = (peerID: string, packet: Packet) => void;

export interface GossipSyncIdentity {
  peerID: string;
  signingPrivKey: Uint8Array;
}

// Holds the recent packets seen for gossip reconciliation.
// Only ANNOUNCE and CHANNEL_MSG types are gossiped per bitchat convention.
export class GossipSync {
  // Ordered list of (packetIdHex → packet), newest at end. Capped at SEEN_CAPACITY.
  private readonly seen = new Map<string, Packet>();
  private timer: ReturnType<typeof setInterval> | null = null;

  // Start broadcasting the GCS filter on the 15-second interval.
  start(identity: GossipSyncIdentity, send: SendFn): void {
    if (this.timer !== null) this.stop();
    this.timer = setInterval(() => {
      const filterPacket = this.buildFilterPacket(identity);
      if (filterPacket !== null) send(filterPacket);
    }, SYNC_INTERVAL_MS);
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Track a packet as seen. Call this for every relayed/received ANNOUNCE
  // or CHANNEL_MSG packet. Caps the store at SEEN_CAPACITY.
  track(packet: Packet): void {
    if (!isGossipType(packet.type)) return;
    const id = bytesToHex(computePacketId(packet));
    if (this.seen.has(id)) {
      this.seen.delete(id); // re-insert to move to newest position
    } else if (this.seen.size >= SEEN_CAPACITY) {
      // Evict the oldest entry.
      const oldest = this.seen.keys().next().value;
      if (oldest !== undefined) this.seen.delete(oldest);
    }
    this.seen.set(id, packet);
  }

  // Build the REQUEST_SYNC broadcast packet.
  buildFilterPacket(identity: GossipSyncIdentity): Packet | null {
    if (this.seen.size === 0) return null;

    const ids = [...this.seen.values()].map(computePacketId);
    const h64s = ids.map(packetIdToH64);
    const { p, m, data } = buildGcsFilter(h64s, GCS_MAX_BYTES, GCS_TARGET_FPR);

    // Advertise every type we track so a peer answers with any it holds and we
    // lack: announces, public messages, and signed board posts.
    const typeFlags =
      (1 << TYPE_BIT_ANNOUNCE) |
      (1 << TYPE_BIT_MESSAGE) |
      (1 << TYPE_BIT_BOARD);

    const payload = encodeGossipFilterPayload({ p, m, data, types: typeFlags });
    const senderIDBytes = hexToBytes(identity.peerID);

    const packet: Packet = {
      type: PacketType.REQUEST_SYNC,
      ttl: 2, // gossip filter stays local-ish; short TTL reduces storm risk
      flags: Flags.SIGNED,
      senderID: senderIDBytes,
      recipientID: new Uint8Array(8),
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload,
    };
    packet.signature = signPacket(packet, identity.signingPrivKey);
    return packet;
  }

  // Handle an incoming REQUEST_SYNC packet from a peer. Returns the list
  // of packets we have that the peer appears to be missing (for the caller
  // to send back).
  handleFilter(filterPacket: Packet): Packet[] {
    const params = decodeGossipFilterPayload(filterPacket.payload);
    if (params === null) return [];

    const decodedFilter = decodeGcsFilter(params.p, params.m, params.data);
    const missing: Packet[] = [];

    // A request without a types field is a pre-type-aware peer: answer with the
    // original announce+message set only.
    const requestedTypes =
      params.types ?? (1 << TYPE_BIT_ANNOUNCE) | (1 << TYPE_BIT_MESSAGE);

    for (const packet of this.seen.values()) {
      // Only offer a packet whose type the requester actually asked for, so a
      // board round never draws announces and vice versa.
      const bit = syncBitForType(packet.type);
      if (bit === null || (requestedTypes & (1 << bit)) === 0) continue;

      const id = computePacketId(packet);
      const h64 = packetIdToH64(id);
      const inPeerFilter = filterContains(
        decodedFilter,
        h64 % BigInt(params.m),
      );
      if (!inPeerFilter) {
        missing.push(packet);
      }
    }

    return missing;
  }

  get seenCount(): number {
    return this.seen.size;
  }

  reset(): void {
    this.seen.clear();
  }
}

// ---- Helpers -----------------------------------------------------------------

function isGossipType(type: PacketType): boolean {
  return syncBitForType(type) !== null;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length >> 1);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += b.toString(16).padStart(2, "0");
  return s;
}
