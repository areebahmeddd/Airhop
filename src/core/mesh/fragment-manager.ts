// Fragment manager: split a packet too large for one BLE frame into frames that
// fit, and reassemble them on the far side.
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
import { MAX_FRAMED_FILE_BYTES } from "./bitchat-file-packet";
import {
  PacketType,
  decodePacket,
  encodePacket,
  type Packet,
} from "./packet-codec";

// The Bluetooth ceiling on a single ATT attribute value, and therefore on every
// frame we hand the radio.
//
// This has to be a FRAME budget, not a payload budget. It used to be spent as
// the latter: 469 payload bytes plus a 16-byte header, an 8-byte senderID and a
// 64-byte signature encoded to 557 bytes, 45 over the limit. Android writes
// without response, so the stack truncated to MTU-3 and the far side's decoder
// failed reading a signature whose last bytes never arrived; iOS falls back to a
// long write, which cannot exceed 512 either. Every fragment of every attachment
// was discarded before any handler saw it, with no error on either side. Live
// voice was unaffected only because a burst is 210 bytes and never fragments.
export const MAX_BLE_FRAME = 512;

// Bytes consumed by the fragment header inside the payload.
const FRAG_HEADER_LEN = 13; // 8 + 2 + 2 + 1

// What the envelope costs around the fragment data, worst case:
//   16  v2 packet header
//    8  senderID
//    8  recipientID, present on a DM fragment (a public one omits it)
//   13  the fragment header above
// Fragments are deliberately unsigned, so no 64-byte signature: authenticity is
// carried by the inner packet, which is itself signed and re-verified after
// reassembly. bitchat does the same (BLEOutboundFragmentPlanner sends
// `signature: nil`), and neither side's fragment path inspects one.
const FRAME_OVERHEAD = 16 + 8 + 8 + FRAG_HEADER_LEN; // 45

// Maximum data bytes per fragment, derived so the encoded frame lands exactly on
// the budget. bitchat computes 469 from the same budget with a smaller header;
// being a couple of bytes under it costs nothing, because the chunk size is a
// sender-side choice that the receiver never has to agree with.
export const FRAG_DATA_SIZE = MAX_BLE_FRAME - FRAME_OVERHEAD; // 467 bytes

// Max simultaneous reassembly slots. Matches bitchat.
const MAX_CONCURRENT = 128;

// How long a partial assembly may sit SILENT before it is dropped. Measured
// from the last fragment that arrived, not from the first.
//
// That distinction is the whole point. A 512 KiB photo is about 1,120
// fragments, and the sender paces them 20ms apart, so it cannot arrive in under
// ~22 seconds; a 1 MiB file takes twice that. Timing out on total duration
// deleted the half-built file mid-transfer, and the fragments still coming in
// then started a fresh assembly that could never reach its total, so the file
// was lost silently and permanently. Idle time is the thing that actually means
// the sender is gone.
const TIMEOUT_MS = 30_000;

// Hard cap on total reassembled size. Guards against memory exhaustion while
// admitting the largest file a bitchat peer can send (1 MiB content + TLV +
// packet envelope), matching bitchat's FileTransferLimits.maxFramedFileBytes.
const MAX_REASSEMBLED_BYTES = MAX_FRAMED_FILE_BYTES;

// The outer fragment packet type per PROTOCOLS.md.
const OUTER_TYPE = PacketType.FRAGMENT; // 0x20

export type FragmentCallback = (packet: Packet) => void;

// Reports reassembly progress as fragments of a stream arrive, so the UI can
// show an incoming-file card before the whole file is here.
export interface FragmentProgress {
  key: string; // assembly key (senderHex_streamHex), stable per stream
  originalType: PacketType; // type of the packet being reassembled
  received: number; // fragments received so far
  total: number; // fragments expected
  receivedBytes: number; // data bytes received so far
}
export type FragmentProgressCallback = (info: FragmentProgress) => void;

// ---- Fragmentation -----------------------------------------------------------

// Only the peer ID: fragments are unsigned, so there is no key to hold.
export interface FragmentIdentity {
  peerID: string; // 16 hex chars = 8 bytes
}

// Split `packet` (must be too large to fit in one BLE frame) into fragment
// packets ready to hand to the FloodRouter.
export function fragmentPacket(
  packet: Packet,
  identity: FragmentIdentity,
): Packet[] {
  const data = encodePacket(packet);
  if (data.length <= MAX_BLE_FRAME) {
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

    fragments.push({
      type: OUTER_TYPE,
      ttl: 7,
      flags: 0,
      senderID: senderIDBytes,
      // Carry the parent's recipient. A DM's fragments used to go out addressed
      // to nobody, which made bitchat classify them as public: it archived
      // sealed private media in its gossip store and re-offered it to third
      // parties, and relayed each fragment to every neighbour instead of down
      // the directed path.
      recipientID: packet.recipientID ?? new Uint8Array(8),
      timestamp: Date.now(),
      // Zeros, not a signature: the SIGNED flag is clear, so the encoder omits
      // the 64 bytes entirely.
      signature: new Uint8Array(64),
      payload,
    });
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

export function decodeFragmentPayload(
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
  // When the last fragment landed. Drives the idle timeout; see TIMEOUT_MS.
  updatedAt: number;
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
    onProgress?: FragmentProgressCallback,
  ): void {
    const header = decodeFragmentPayload(payload);
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
        updatedAt: Date.now(),
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
    // Progress keeps the assembly alive: a transfer that is still arriving is
    // not a stale one, however long it has been running.
    asm.updatedAt = Date.now();

    onProgress?.({
      key,
      originalType: header.originalType,
      received: asm.fragments.size,
      total: asm.total,
      receivedBytes: asm.byteCount,
    });

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

  // Purge assemblies that have received nothing for TIMEOUT_MS.
  evictExpired(): void {
    const cutoff = Date.now() - TIMEOUT_MS;
    for (const [key, asm] of this.assemblies) {
      if (asm.updatedAt < cutoff) this.assemblies.delete(key);
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
