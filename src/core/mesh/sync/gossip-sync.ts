// Gossip sync using Golomb-Coded Set (GCS) filters.
//
// Wire-compatible with bitchat iOS GossipSyncManager / RequestSyncPacket.
//
// Protocol flow:
//   1. Every 15 seconds, send a REQUEST_SYNC packet to each connected peer,
//      containing a GCS filter of the packet IDs we have seen recently.
//   2. On receiving a REQUEST_SYNC from a peer, decode the filter and send
//      back any packets we have that the peer appears to be missing.
//
// Three rules the other implementations enforce too:
//
//   * REQUEST_SYNC is link-local (ttl 0). It asks what the peer on the far end
//     of this link is missing; relaying it asks the wrong node.
//   * Responses are link-local (ttl 0) and tagged IS_RSR. Without ttl 0 the
//     requester's flood router treats each replayed packet as new, which it
//     is, and re-floods it. One peer rejoining after a partition would push
//     the entire archive back across the mesh.
//   * Requests are unicast, so a response can be attributed to a request we
//     made. See request-sync-manager.ts.
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
//   0x05  since   (uint64 BE) filter-coverage cursor, ms since epoch

import { sha256 } from "@noble/hashes/sha2.js";
import { concatBytes } from "@noble/hashes/utils.js";
import {
  computePacketId,
  Flags,
  PacketType,
  signPacket,
  type Packet,
  type SendFn,
} from "../wire/packet-codec";

// Constants per PROTOCOLS.md section 5.
const SYNC_INTERVAL_MS = 15_000;
const SEEN_CAPACITY = 1000;
export const GCS_MAX_BYTES = 400;
export const GCS_TARGET_FPR = 0.01; // 1%

// REQUEST_SYNC and every packet sent in answer to one travel exactly one hop.
// bitchat sets ttl 0 in both directions (GossipSyncManager.sendRequestSync and
// every `toSend.ttl = 0` on the response path) and its sync spec states it as
// a MUST. See the header note for what goes wrong without it.
const SYNC_TTL = 0;

// How long a packet stays worth offering, per type. One blanket window would be
// wrong in both directions: it would keep presence alive after its sender left,
// and expire board posts meant to outlive everyone carrying them.

// Presence that outlives its sender misreports who is in the room. 60s is a
// consensus rule in bitchat-android's sync.md and matches bitchat-iOS's
// stale-peer timeout.
const MAX_AGE_ANNOUNCE_MS = 60_000;
// Carrying the room's recent history across a partition is the point of gossip.
// bitchat-iOS publicMessageMaxAgeSeconds = 900.
const MAX_AGE_MESSAGE_MS = 900_000;
// Board posts carry their own author-chosen expiry (max 7 days, PROTOCOLS.md
// section 3) and the board store enforces it on receipt. This is only a
// backstop against an entry sitting in the LRU forever.
const MAX_AGE_BOARD_MS = 7 * 24 * 60 * 60 * 1000;

// Group messages, same window public messages get. A group is a conversation, not
// a noticeboard, and a member who was away for a quarter of an hour is the case
// backfill exists for. Longer would be pointless: a roster change rotates the
// epoch key, and a message sealed under the old one can no longer be read.
const MAX_AGE_GROUP_MS = 900_000;

// One REQUEST_SYNC can replay the whole store, so a peer asking in a tight loop
// is an amplifier pointed at us and at the shared radio. Bounds how often one
// peer can make us run a diff pass. Matches bitchat-iOS
// responseRateLimitMaxResponses / responseRateLimitWindowSeconds.
const RESPONSE_LIMIT_MAX = 8;
const RESPONSE_LIMIT_WINDOW_MS = 30_000;

// SyncTypeFlags bit indices (bit -> message type), matching bitchat's
// SyncTypeFlags.swift so a board sync round is mutually intelligible.
const TYPE_BIT_ANNOUNCE = 0; // bit 0
const TYPE_BIT_MESSAGE = 1; // bit 1
const TYPE_BIT_BOARD = 8; // bit 8 (board posts persist and sync until expiry)
// bit 10 (private group messages). bitchat defines this bit, caches group
// packets, advertises them and serves them; Airhop defined none of it, so a group
// had no store-and-forward at all. Airhop-to-Airhop nothing was ever backfilled,
// and toward bitchat the exchange was one-directional: bitchat filled our gaps
// and we never answered its requests. The payload stays sealed under the epoch
// key either way, so a relay learns nothing by carrying it.
const TYPE_BIT_GROUP = 10;
// Airhop's named public channels (CHANNEL_MSG_AIRHOP). Without a bit of their
// own these messages would have no catch-up at all, since they no longer ride
// bit 1 with the mesh room.
//
// Airhop-only, and safe in both directions: bitchat's SyncTypeFlags masks off
// bits that map to no known type, so a request carrying this one is answered
// with the types bitchat does know, and bitchat never sets it.
//
// Bit 24, not 11. bitchat's table ends at 10 and it allocates forward, so 11 is
// the next value it would reach for. 24 leaves it thirteen and stays under 31,
// which the encoder needs: `1 << 31` is negative in JavaScript and `v & 0xff`
// in encodeTypeFlags coerces to a 32-bit int, so a higher bit would silently
// fold onto a lower one.
const TYPE_BIT_AIRHOP_CHANNEL = 24;

// Map a packet type to its SyncTypeFlags bit, or null when it is not gossiped.
//
// FILE_TRANSFER is bit 7 in bitchat and is deliberately absent here, which is
// the one place this table diverges from theirs. An attachment is up to 1 MiB,
// so serving one from sync is ten to forty-five seconds of exclusive radio time
// per asking peer, against a GCS filter sized at 400 bytes for items that are
// small and numerous. bitchat's own reassembly also expires 30 seconds after the
// first fragment, so a re-flooded file frequently fails on arrival anyway and
// the airtime buys nothing.
//
// The interop cost is bounded and symmetric: a bitchat peer may ask for bit 7
// and we answer with nothing, and we never ask for it ourselves. Neither side
// errors, because an unmatched bit maps to no type. What it means for a user is
// that a channel attachment missed while out of range is not backfilled, where
// text, board posts and group messages are. Media on the mesh is best-effort at
// the moment it is sent.
function syncBitForType(type: PacketType): number | null {
  switch (type) {
    case PacketType.ANNOUNCE:
      return TYPE_BIT_ANNOUNCE;
    case PacketType.CHANNEL_MSG:
      return TYPE_BIT_MESSAGE;
    case PacketType.CHANNEL_MSG_AIRHOP:
      return TYPE_BIT_AIRHOP_CHANNEL;
    case PacketType.BOARD_POST:
      return TYPE_BIT_BOARD;
    case PacketType.GROUP_MESSAGE:
      return TYPE_BIT_GROUP;
    default:
      return null;
  }
}

// How long a packet of this type stays a sync candidate. Null for types that
// are never gossiped, which syncBitForType already rejects.
function maxAgeForType(type: PacketType): number | null {
  switch (type) {
    case PacketType.ANNOUNCE:
      return MAX_AGE_ANNOUNCE_MS;
    case PacketType.CHANNEL_MSG:
    case PacketType.CHANNEL_MSG_AIRHOP:
      return MAX_AGE_MESSAGE_MS;
    case PacketType.BOARD_POST:
      return MAX_AGE_BOARD_MS;
    case PacketType.GROUP_MESSAGE:
      return MAX_AGE_GROUP_MS;
    default:
      return null;
  }
}

// Whether a tracked packet is still worth advertising or offering.
//
// A future timestamp is treated as expired rather than fresh: a packet stamped
// past the local clock is either a badly skewed device or a sender trying to
// pin an entry at the head of everyone's candidate set forever, and neither is
// something to carry on someone else's behalf.
function isFreshCandidate(packet: Packet, now: number): boolean {
  const maxAge = maxAgeForType(packet.type);
  if (maxAge === null) return false;
  const age = now - packet.timestamp;
  return age >= -MAX_AGE_ANNOUNCE_MS && age <= maxAge;
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

// Roughly how many elements fit in a filter of this size at this P, per
// bitchat's GCS spec: N_max ~= floor((8 * sizeBytes) / (P + 2)). An estimate
// only; the encoder below trims further if the real encoding overflows.
function estimateMaxElements(sizeBytes: number, p: number): number {
  return Math.max(1, Math.floor((8 * sizeBytes) / (p + 2)));
}

// Build a GCS filter. The caller must pass h64 values newest-first.
//
// Returns the wire parameters plus `includedCount`: how many inputs the filter
// covers. Trimming drops from the tail of a newest-first list, so the covered
// set is a contiguous newest-prefix and the since-cursor can name an exact
// timestamp. Trimming in hash order would leave an arbitrary subset that no
// timestamp describes.
//
// M formula: M = count * 2^P, matching bitchat iOS GCSFilter.hashRange().
// This gives FPR ~= 1/2^P per element regardless of the set size.
export function buildGcsFilter(
  h64s: bigint[],
  maxBytes: number,
  targetFpr: number,
): { p: number; m: number; data: Uint8Array; includedCount: number } {
  const p = deriveP(targetFpr);
  if (h64s.length === 0) {
    return { p, m: 1, data: new Uint8Array(0), includedCount: 0 };
  }

  const cap = estimateMaxElements(maxBytes, p);
  // The modulus is fixed to the initial candidate count so `m` stays stable as
  // the tail is trimmed below. A modulus that moved with each retry would
  // change every mapped value, so the trimming loop would never converge on
  // anything meaningful.
  const raw = Math.min(h64s.length, cap) * (1 << p);
  const mNum = Math.max(1, Math.min(raw, 0xffffffff));
  const modulo = BigInt(mNum);

  const encodeFirst = (count: number): Uint8Array => {
    // Map each h64 to [1, M), sort, and drop duplicates (normalizeMappedValues).
    const mapped = h64s
      .slice(0, count)
      .map((v) => {
        const x = v % modulo;
        return x === 0n ? 1n : x;
      })
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

    const sorted: bigint[] = [];
    let last = 0n;
    for (const v of mapped) {
      if (v > last) {
        sorted.push(v);
        last = v;
      }
    }
    return sorted.length === 0
      ? new Uint8Array(0)
      : encodeGolombRice(sorted, p);
  };

  // Shrink until it fits. Dropping 10% per pass converges quickly and matches
  // bitchat's loop. Emitting nothing on overflow would be worse than it sounds:
  // an empty filter reads as "I have nothing", so the responder replies with
  // its entire store, and overflow is likeliest on the busiest mesh.
  let count = Math.min(h64s.length, cap);
  let encoded = encodeFirst(count);
  while (encoded.length > maxBytes && count > 1) {
    count = Math.max(1, Math.floor((count * 9) / 10));
    encoded = encodeFirst(count);
  }
  // A single element that still overflows cannot be represented at all.
  if (encoded.length > maxBytes) {
    return { p, m: mNum, data: new Uint8Array(0), includedCount: 0 };
  }

  return {
    p,
    m: mNum,
    data: encoded,
    includedCount: encoded.length === 0 ? 0 : count,
  };
}

function encodeGolombRice(sorted: bigint[], p: number): Uint8Array {
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
  const out = new Uint8Array(Math.ceil(bits.length / 8));
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
  // Oldest timestamp our filter actually covers, ms since epoch. A responder
  // holding something older than this knows it is outside the filter rather
  // than missing from it, and skips it instead of re-sending it every round.
  since?: number;
}

// Encode a u64 big-endian from a JS number. Timestamps are milliseconds, well
// inside 2^53, so the split is exact.
function u64be(value: number): Uint8Array {
  const b = new Uint8Array(8);
  const view = new DataView(b.buffer);
  view.setUint32(0, Math.floor(value / 0x100000000), false);
  view.setUint32(4, value >>> 0, false);
  return b;
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
  if (params.since !== undefined && params.since > 0) {
    parts.push(encodeTlv(0x05, u64be(params.since)));
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
  let since: number | undefined;

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
      case 0x05:
        if (value.length === 8) {
          const view = new DataView(value.buffer, value.byteOffset);
          since =
            view.getUint32(0, false) * 0x100000000 + view.getUint32(4, false);
        }
        break;
    }
  }

  if (p === undefined || m === undefined || data === undefined) return null;
  return { p, m, data, types, since };
}

// ---- Response rate limiting --------------------------------------------------

// Sliding window of answers per peer. Not a deduplicator: a peer asks every 15s
// and gets an answer. This only caps the case where it asks far faster, since
// each answer costs a store scan and a burst of writes on a shared radio.
class SyncResponseRateLimiter {
  private readonly hits = new Map<string, number[]>();

  shouldRespond(peerID: string, now: number): boolean {
    const cutoff = now - RESPONSE_LIMIT_WINDOW_MS;
    const recent = (this.hits.get(peerID) ?? []).filter((t) => t > cutoff);
    if (recent.length >= RESPONSE_LIMIT_MAX) {
      // Keep the trimmed list so the window still slides while blocked.
      this.hits.set(peerID, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(peerID, recent);
    return true;
  }

  forget(peerID: string): void {
    this.hits.delete(peerID);
  }

  reset(): void {
    this.hits.clear();
  }
}

// ---- GossipSync class -------------------------------------------------------

export type SendToPeerFn = (peerID: string, packet: Packet) => void;

export interface GossipSyncIdentity {
  peerID: string;
  signingPrivKey: Uint8Array;
}

export interface GossipSyncWiring {
  // Broadcast fallback, used only while we have no attributed peers yet.
  send: SendFn;
  // Preferred path: one request per connected peer, so responses can be
  // attributed. Omitted only in tests that do not exercise attribution.
  sendToPeer?: SendToPeerFn;
  // Peers we currently hold a link to, by peerID.
  getPeers?: () => readonly string[];
  // Told about every request we send, so the receive path can recognise a
  // solicited response. See request-sync-manager.ts.
  onRequest?: (peerID: string) => void;
}

// Holds the recent packets seen for gossip reconciliation.
// Only ANNOUNCE, CHANNEL_MSG, BOARD_POST and GROUP_MESSAGE are gossiped;
// syncBitForType is the single place that decides.
export class GossipSync {
  // Ordered list of (packetIdHex → packet), newest at end. Capped at SEEN_CAPACITY.
  private readonly seen = new Map<string, Packet>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly rateLimiter = new SyncResponseRateLimiter();

  // Start the 15-second sync round.
  //
  // Unicast per connected peer is the normal path; broadcast is a discovery
  // fallback for the window before any peer is attributed, as in bitchat's
  // GossipSyncManager. A broadcast round still reconciles content, but its
  // answers cannot be exempted from the requester's freshness window.
  start(identity: GossipSyncIdentity, wiring: GossipSyncWiring | SendFn): void {
    if (this.timer !== null) this.stop();
    const w: GossipSyncWiring =
      typeof wiring === "function" ? { send: wiring } : wiring;

    this.timer = setInterval(() => {
      const now = Date.now();
      this.prune(now);

      const peers = w.getPeers?.() ?? [];
      if (w.sendToPeer !== undefined && peers.length > 0) {
        for (const peerID of peers) {
          const pkt = this.buildFilterPacket(identity, peerID, now);
          if (pkt === null) return; // nothing to sync; same for every peer
          // Registered BEFORE the send: on a fast link the response can
          // outrun our own continuation, and a response that lands before its
          // registration looks exactly like an unsolicited one.
          w.onRequest?.(peerID);
          w.sendToPeer(peerID, pkt);
        }
        return;
      }

      const filterPacket = this.buildFilterPacket(identity, undefined, now);
      if (filterPacket !== null) w.send(filterPacket);
    }, SYNC_INTERVAL_MS);
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Drop candidates past their per-type window. Idempotent; driven from the
  // sync tick rather than a timer of its own.
  prune(now: number = Date.now()): void {
    for (const [id, packet] of this.seen) {
      if (!isFreshCandidate(packet, now)) this.seen.delete(id);
    }
  }

  // A link went down. Clears that peer's response budget so a genuine
  // reconnect is not throttled by the previous session's traffic.
  forgetPeer(peerID: string): void {
    this.rateLimiter.forget(peerID);
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

  // Build a REQUEST_SYNC packet. Unicast when `toPeerID` is given, broadcast
  // otherwise. Either way ttl 0: this is a question for the far end of one
  // link, and relaying it asks a node that was never being addressed.
  buildFilterPacket(
    identity: GossipSyncIdentity,
    toPeerID?: string,
    now: number = Date.now(),
  ): Packet | null {
    // Newest first: the filter builder trims from the tail when it overflows
    // its byte budget, so this ordering is what makes the covered set a
    // contiguous newest-prefix and the cursor below exact.
    const candidates = [...this.seen.values()]
      .filter((p) => isFreshCandidate(p, now))
      .sort((a, b) => b.timestamp - a.timestamp);
    if (candidates.length === 0) return null;

    const h64s = candidates.map((p) => packetIdToH64(computePacketId(p)));
    const { p, m, data, includedCount } = buildGcsFilter(
      h64s,
      GCS_MAX_BYTES,
      GCS_TARGET_FPR,
    );

    // Advertise every type we track so a peer answers with any it holds and we
    // lack: announces, public messages, and signed board posts.
    const typeFlags =
      (1 << TYPE_BIT_ANNOUNCE) |
      (1 << TYPE_BIT_MESSAGE) |
      (1 << TYPE_BIT_BOARD) |
      (1 << TYPE_BIT_GROUP) |
      (1 << TYPE_BIT_AIRHOP_CHANNEL);

    // The cursor goes out only when the filter could not cover everything we
    // hold. It means "my filter was truncated and reaches back this far", not
    // "do not send me anything older than my oldest packet". Getting that
    // backwards breaks catch-up silently: a device that just joined holds only
    // recent packets because it was not there, so a cursor at its oldest entry
    // would withhold exactly the history it turned up to collect.
    const since =
      includedCount > 0 && includedCount < candidates.length
        ? candidates[includedCount - 1].timestamp
        : undefined;

    const payload = encodeGossipFilterPayload({
      p,
      m,
      data,
      types: typeFlags,
      since,
    });

    const directed = toPeerID !== undefined;
    const packet: Packet = {
      type: PacketType.REQUEST_SYNC,
      ttl: SYNC_TTL,
      flags: directed ? Flags.SIGNED | Flags.HAS_RECIPIENT : Flags.SIGNED,
      senderID: hexToBytes(identity.peerID),
      recipientID: directed ? hexToBytes(toPeerID) : new Uint8Array(8),
      timestamp: now,
      signature: new Uint8Array(64),
      payload,
    };
    packet.signature = signPacket(packet, identity.signingPrivKey);
    return packet;
  }

  // Handle an incoming REQUEST_SYNC from `fromPeerID`. Returns the packets we
  // hold that the peer appears to be missing, ready to write straight back down
  // the link it asked on.
  //
  // Responses come back ttl 0 and flagged IS_RSR. ttl 0 keeps them link-local,
  // or the requester's flood router would see each one as new and push it
  // across the mesh. IS_RSR marks them as the answer to the requester's own
  // question, so it can exempt them from its freshness window. Both fields are
  // normalised out of the signing preimage, so retagging a stored packet leaves
  // its signature verifiable.
  handleFilter(
    filterPacket: Packet,
    fromPeerID?: string,
    now: number = Date.now(),
  ): Packet[] {
    // Rate limit before decoding: the diff pass is the expensive part, and a
    // peer that asks in a loop should not be able to make us pay for it.
    if (
      fromPeerID !== undefined &&
      !this.rateLimiter.shouldRespond(fromPeerID, now)
    ) {
      return [];
    }

    const params = decodeGossipFilterPayload(filterPacket.payload);
    if (params === null) return [];

    const decodedFilter = decodeGcsFilter(params.p, params.m, params.data);
    const missing: Packet[] = [];

    // A request without a types field is a pre-type-aware peer: answer with the
    // original announce+message set only.
    const requestedTypes =
      params.types ?? (1 << TYPE_BIT_ANNOUNCE) | (1 << TYPE_BIT_MESSAGE);

    for (const packet of this.seen.values()) {
      // Never offer something we would not advertise ourselves. Otherwise a
      // peer whose own window has closed keeps being handed packets it will
      // drop, every round, forever.
      if (!isFreshCandidate(packet, now)) continue;

      // Only offer a packet whose type the requester actually asked for, so a
      // board round never draws announces and vice versa.
      const bit = syncBitForType(packet.type);
      if (bit === null || (requestedTypes & (1 << bit)) === 0) continue;

      // Outside the requester's filter coverage: not missing, just older than
      // what it asked about.
      if (params.since !== undefined && packet.timestamp < params.since)
        continue;

      const id = computePacketId(packet);
      const h64 = packetIdToH64(id);
      const inPeerFilter = filterContains(
        decodedFilter,
        h64 % BigInt(params.m),
      );
      if (!inPeerFilter) {
        missing.push({ ...packet, ttl: SYNC_TTL, isRSR: true });
      }
    }

    return missing;
  }

  get seenCount(): number {
    return this.seen.size;
  }

  reset(): void {
    this.seen.clear();
    this.rateLimiter.reset();
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
