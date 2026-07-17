// Fragment manager: split large packets into 469-byte chunks and reassemble.
//
// Wire-compatible with bitchat iOS BLEFragmentHandler / BLEFragmentAssemblyBuffer.
//
// Fragment payload layout (inside a FILE_CHUNK / 0x05 packet):
//   [8 bytes: fragment stream ID (u64 BE, random per original packet)]
//   [2 bytes: fragment index (u16 BE, 0-based)]
//   [2 bytes: total fragment count (u16 BE)]
//   [1 byte:  original packet type]
//   [rest:    fragment data (up to FRAG_DATA_SIZE bytes)]
//
// The "original packet" carried in fragment data is the full 96+ byte wire
// encoding of the original packet (as returned by encodePacket).

import { hexToBytes } from "@noble/hashes/utils.js";
import {
  Flags,
  PacketType,
  decodePacket,
  encodePacket,
  type Packet,
} from "./packet-codec";

// BLE MTU limit used by bitchat (must match exactly for interop).
export const FRAGMENT_SIZE = 469;

// Bytes consumed by the fragment header inside the payload.
const FRAG_HEADER_LEN = 13; // 8 + 2 + 2 + 1

// Maximum data bytes per fragment.
export const FRAG_DATA_SIZE = FRAGMENT_SIZE - FRAG_HEADER_LEN; // 456 bytes

// Max simultaneous reassembly slots. Matches bitchat.
const MAX_CONCURRENT = 128;

// Reassembly timeout (30 seconds). After this, partial assemblies are dropped.
const TIMEOUT_MS = 30_000;

// Hard cap on total reassembled size (1 MiB). Guards against memory exhaustion.
const MAX_REASSEMBLED_BYTES = 1 * 1024 * 1024;

// The outer fragment packet type per PROTOCOLS.md.
const OUTER_TYPE = PacketType.FRAGMENT; // 0x20

export type FragmentCallback = (packet: Packet) => void;

// ---- Fragmentation -----------------------------------------------------------

export interface FragmentIdentity {
  peerID: string; // 16 hex chars = 8 bytes
  signingPrivKey: Uint8Array;
}

// Split `packet` (must be too large to fit in one BLE frame) into fragment
// packets, each signed and ready to hand to the FloodRouter.
// `sign` should be `signPacket` from packet-codec.
export function fragmentPacket(
  packet: Packet,
  identity: FragmentIdentity,
  sign: (p: Packet, key: Uint8Array) => Uint8Array,
): Packet[] {
  const data = encodePacket(packet);
  if (data.length <= FRAGMENT_SIZE) {
    throw new Error("fragmentPacket called on packet that fits in one frame");
  }

  const total = Math.ceil(data.length / FRAG_DATA_SIZE);
  if (total > 0xffff) throw new Error("Fragment: packet too large to fragment");

  const streamID = crypto.getRandomValues(new Uint8Array(8));
  const senderIDBytes = hexToBytes(identity.peerID);
  const fragments: Packet[] = [];

  for (let i = 0; i < total; i++) {
    const chunk = data.slice(i * FRAG_DATA_SIZE, (i + 1) * FRAG_DATA_SIZE);
    const payload = buildFragmentPayload(
      streamID,
      i,
      total,
      packet.type,
      chunk,
    );

    const frag: Packet = {
      type: OUTER_TYPE,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: senderIDBytes,
      recipientID: new Uint8Array(8), // broadcast
      timestamp: Math.floor(Date.now() / 1000),
      nonce: crypto.getRandomValues(new Uint8Array(8)),
      signature: new Uint8Array(64),
      payload,
    };
    frag.signature = sign(frag, identity.signingPrivKey);
    fragments.push(frag);
  }

  return fragments;
}

function buildFragmentPayload(
  streamID: Uint8Array,
  index: number,
  total: number,
  originalType: PacketType,
  data: Uint8Array,
): Uint8Array {
  const buf = new Uint8Array(FRAG_HEADER_LEN + data.length);
  const view = new DataView(buf.buffer);
  buf.set(streamID, 0);
  view.setUint16(8, index, false); // BE
  view.setUint16(10, total, false); // BE
  buf[12] = originalType;
  buf.set(data, FRAG_HEADER_LEN);
  return buf;
}

// ---- Fragment header parsing -------------------------------------------------

export interface FragmentHeader {
  streamU64: bigint; // 8-byte stream ID as bigint
  index: number;
  total: number;
  originalType: PacketType;
  data: Uint8Array;
}

export function parseFragmentPayload(
  payload: Uint8Array,
): FragmentHeader | null {
  if (payload.length < FRAG_HEADER_LEN) return null;
  const view = new DataView(
    payload.buffer,
    payload.byteOffset,
    payload.byteLength,
  );

  const hi = view.getUint32(0, false);
  const lo = view.getUint32(4, false);
  const streamU64 = (BigInt(hi) << 32n) | BigInt(lo);

  const index = view.getUint16(8, false);
  const total = view.getUint16(10, false);

  if (total === 0 || total > 10_000 || index >= total) return null;

  return {
    streamU64,
    index,
    total,
    originalType: payload[12] as PacketType,
    data: payload.slice(FRAG_HEADER_LEN),
  };
}

// ---- Assembly buffer ---------------------------------------------------------

type AssemblyKey = string; // `${senderHex}_${streamHex}`

interface Assembly {
  total: number;
  fragments: Map<number, Uint8Array>;
  createdAt: number;
  byteCount: number;
}

export class FragmentManager {
  private readonly assemblies = new Map<AssemblyKey, Assembly>();

  // Process a received fragment packet. Calls `onComplete` with the
  // reassembled inner Packet when the last fragment arrives.
  // `fromSenderID` is the 8-byte senderID from the outer fragment packet.
  receive(
    fromSenderID: Uint8Array,
    payload: Uint8Array,
    onComplete: FragmentCallback,
  ): void {
    const header = parseFragmentPayload(payload);
    if (header === null) return;

    const key = buildKey(fromSenderID, header.streamU64);
    this.evictExpired();

    let asm = this.assemblies.get(key);
    if (asm === undefined) {
      if (this.assemblies.size >= MAX_CONCURRENT) {
        // Evict the oldest slot to make room.
        const oldest = this.assemblies.keys().next().value;
        if (oldest !== undefined) this.assemblies.delete(oldest);
      }
      asm = {
        total: header.total,
        fragments: new Map(),
        createdAt: Date.now(),
        byteCount: 0,
      };
      this.assemblies.set(key, asm);
    }

    if (asm.fragments.has(header.index)) return; // duplicate

    if (asm.byteCount + header.data.length > MAX_REASSEMBLED_BYTES) {
      this.assemblies.delete(key);
      return;
    }

    asm.fragments.set(header.index, header.data);
    asm.byteCount += header.data.length;

    if (asm.fragments.size === asm.total) {
      this.assemblies.delete(key);
      const parts: Uint8Array[] = [];
      for (let i = 0; i < asm.total; i++) {
        const frag = asm.fragments.get(i);
        if (frag === undefined) return;
        parts.push(frag);
      }
      const raw = concatParts(parts);
      const packet = decodePacket(raw);
      if (packet !== null) onComplete(packet);
    }
  }

  // Purge assemblies older than TIMEOUT_MS.
  evictExpired(): void {
    const cutoff = Date.now() - TIMEOUT_MS;
    for (const [key, asm] of this.assemblies) {
      if (asm.createdAt < cutoff) this.assemblies.delete(key);
    }
  }

  get size(): number {
    return this.assemblies.size;
  }

  reset(): void {
    this.assemblies.clear();
  }
}

// ---- Helpers -----------------------------------------------------------------

function buildKey(senderID: Uint8Array, streamU64: bigint): AssemblyKey {
  let hex = "";
  for (let i = 0; i < 8; i++)
    hex += (senderID[i] ?? 0).toString(16).padStart(2, "0");
  return `${hex}_${streamU64.toString(16).padStart(16, "0")}`;
}

function concatParts(parts: Uint8Array[]): Uint8Array {
  const len = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(len);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}
