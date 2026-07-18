// Binary encode/decode for the bitchat v2 wire format.
//
// Matches bitchat BinaryProtocol.swift / BinaryProtocol.kt exactly so
// Airhop packets are decodable by bitchat iOS and Android nodes.
//
// Fixed header (v2, 16 bytes):
//   [0]      u8      version = 2
//   [1]      u8      type
//   [2]      u8      ttl (default 7; normalized to 0 for signing)
//   [3–10]   u64-BE  timestamp (Unix seconds)
//   [11]     u8      flags
//                      bit 0 (0x01): hasRecipient – recipientID field present
//                      bit 1 (0x02): hasSignature – 64-byte Ed25519 sig appended
//                      bit 2 (0x04): isCompressed – zlib payload (reserved)
//                      bit 3 (0x08): hasRoute     – source-route hop list present
//                      bit 4 (0x10): isRSR        – solicited sync response
//   [12–15]  u32-BE  payloadLength
//
// Variable sections (in order after the fixed header):
//   senderID    (8 bytes, always present)
//   recipientID (8 bytes, only when hasRecipient = 1)
//   route       (when hasRoute = 1: [count: u8][hop1: 8 bytes]...[hopN: 8 bytes])
//   payload     (payloadLength bytes)
//   signature   (64 bytes, only when hasSignature = 1)
//
// Signing (matches bitchat toBinaryDataForSigning()):
//   Encode the packet with ttl=0, isRSR cleared, hasSignature cleared (no sig),
//   then Ed25519-sign the resulting bytes. Receivers re-encode with the same
//   parameters to verify. Clearing TTL lets relays decrement it without
//   invalidating the signature.
import { ed25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { concatBytes } from "@noble/hashes/utils.js";

// Packet type registry per PROTOCOLS.md section 3.
// All values match bitchat MessageType.swift / MessageType.kt (public domain).
// 0x01–0x28 are bitchat-defined; 0x29+ are Airhop extensions.
export const enum PacketType {
  ANNOUNCE = 0x01, // "I'm here" with nickname
  CHANNEL_MSG = 0x02, // Public channel message
  LEAVE = 0x03, // Peer departing
  COURIER_ENV = 0x04, // Store-and-forward envelope
  NOISE_HANDSHAKE = 0x10, // Noise XX handshake (init or response)
  NOISE_ENCRYPTED = 0x11, // Post-handshake Noise-transport encrypted DM
  DR_ENCRYPTED = 0x12, // Double Ratchet encrypted DM (Airhop-to-Airhop only)
  FRAGMENT = 0x20, // Single BLE fragment of a larger message
  REQUEST_SYNC = 0x21, // GCS filter gossip request (local-only, TTL=2)
  FILE_TRANSFER = 0x22, // Binary file / audio / image payload
  VOICE_FRAME = 0x29, // PTT audio burst (Airhop extension)
  VIDEO_FRAME = 0x30, // Video frame, WiFi only (Airhop extension)
  CASHU_TOKEN = 0x40, // Cashu ecash token (Airhop extension)
}

// Flag bit values: must match bitchat BinaryProtocol.Flags exactly.
export const Flags = {
  HAS_RECIPIENT: 0x01, // bit 0: recipientID field is present (unicast)
  SIGNED: 0x02, // bit 1: 64-byte Ed25519 signature is appended
  COMPRESSED: 0x04, // bit 2: payload is zlib-compressed (reserved)
  HAS_ROUTE: 0x08, // bit 3: source-route hop list is present
  IS_RSR: 0x10, // bit 4: packet is a solicited sync response
} as const;

// Broadcast sentinel: all-zeros recipientID.
// The encoder omits the recipientID field (and clears HAS_RECIPIENT) when it
// detects an all-zeros recipient. Decoders set recipientID to BROADCAST_ID when
// HAS_RECIPIENT is not set, preserving the isBroadcast() helper contract.
export const BROADCAST_ID = new Uint8Array(8);

// Fixed header size for v2 packets.
export const V2_HEADER_SIZE = 16;
const SENDER_ID_SIZE = 8;
const RECIPIENT_ID_SIZE = 8;
const SIGNATURE_SIZE = 64;
const MIN_DECODE_SIZE = V2_HEADER_SIZE + SENDER_ID_SIZE; // 24 bytes

// Fixed-header field positions.
const VERSION_OFFSET = 0; // u8
const TYPE_OFFSET = 1; // u8
const TTL_OFFSET = 2; // u8
const TIMESTAMP_OFFSET = 3; // u64 BE (8 bytes)
const FLAGS_OFFSET = 11; // u8
const PAYLOAD_LEN_OFFSET = 12; // u32 BE (4 bytes)

export interface Packet {
  type: PacketType;
  ttl: number;
  // Flags byte. Use Flags.* constants. HAS_RECIPIENT is derived automatically
  // from recipientID during encoding. SIGNED must be set before calling
  // signPacket. IS_RSR and HAS_ROUTE are derived from isRSR / route fields.
  flags: number;
  senderID: Uint8Array; // 8 bytes
  recipientID: Uint8Array; // 8 bytes (all-zeros = broadcast)
  timestamp: number; // Unix seconds (u64 on wire; JS number is safe up to 2^53)
  signature: Uint8Array; // 64 bytes (zeros when unsigned)
  payload: Uint8Array;
  // Optional fields: encoder derives HAS_ROUTE and IS_RSR flags from these.
  isRSR?: boolean;
  route?: readonly Uint8Array[]; // intermediate hop peerIDs, each 8 bytes
}

// Encode a u64 into big-endian at `offset` in a DataView.
// JS numbers up to Number.MAX_SAFE_INTEGER (2^53-1) are fine here.
function writeU64BE(view: DataView, offset: number, n: number): void {
  const hi = Math.floor(n / 0x100000000) >>> 0;
  const lo = n >>> 0;
  view.setUint32(offset, hi, false);
  view.setUint32(offset + 4, lo, false);
}

// Read a u64 big-endian from a DataView; returns a JS number.
// Safe for any timestamp value for centuries to come.
function readU64BE(view: DataView, offset: number): number {
  const hi = view.getUint32(offset, false);
  const lo = view.getUint32(offset + 4, false);
  return hi * 0x100000000 + lo;
}

export function encodePacket(p: Packet): Uint8Array {
  const isBcast = p.recipientID.every((b) => b === 0);
  const hasRecipient = !isBcast;
  const isSigned = (p.flags & Flags.SIGNED) !== 0;
  const isCompressed = (p.flags & Flags.COMPRESSED) !== 0;
  const route = p.route ?? [];
  const hasRoute = route.length > 0;
  const isRSR = p.isRSR === true;

  // Derive the wire flags byte: always computed from struct fields.
  let wireFlags = 0;
  if (hasRecipient) wireFlags |= Flags.HAS_RECIPIENT;
  if (isSigned) wireFlags |= Flags.SIGNED;
  if (isCompressed) wireFlags |= Flags.COMPRESSED;
  if (hasRoute) wireFlags |= Flags.HAS_ROUTE;
  if (isRSR) wireFlags |= Flags.IS_RSR;

  const routeBytes = hasRoute ? 1 + route.length * SENDER_ID_SIZE : 0;
  const payloadLen = p.payload.length;

  let size = V2_HEADER_SIZE + SENDER_ID_SIZE;
  if (hasRecipient) size += RECIPIENT_ID_SIZE;
  size += routeBytes;
  size += payloadLen;
  if (isSigned) size += SIGNATURE_SIZE;

  const buf = new Uint8Array(size);
  const view = new DataView(buf.buffer);
  let off = 0;

  buf[off++] = 2; // version
  buf[off++] = p.type;
  buf[off++] = p.ttl;
  writeU64BE(view, off, p.timestamp);
  off += 8;
  buf[off++] = wireFlags;
  view.setUint32(off, payloadLen, false);
  off += 4;

  buf.set(p.senderID.slice(0, 8), off);
  off += 8;
  if (hasRecipient) {
    buf.set(p.recipientID.slice(0, 8), off);
    off += 8;
  }
  if (hasRoute) {
    buf[off++] = route.length;
    for (const hop of route) {
      buf.set(hop.slice(0, 8), off);
      off += 8;
    }
  }
  buf.set(p.payload, off);
  off += payloadLen;
  if (isSigned) {
    buf.set(p.signature.slice(0, 64), off);
  }

  return buf;
}

export function decodePacket(raw: Uint8Array): Packet | null {
  if (raw.length < MIN_DECODE_SIZE) return null;
  const view = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);

  if (raw[VERSION_OFFSET] !== 2) return null; // only v2

  const type = raw[TYPE_OFFSET] as PacketType;
  const ttl = raw[TTL_OFFSET];
  const timestamp = readU64BE(view, TIMESTAMP_OFFSET);
  const flags = raw[FLAGS_OFFSET];
  const payloadLen = view.getUint32(PAYLOAD_LEN_OFFSET, false);

  const hasRecipient = (flags & Flags.HAS_RECIPIENT) !== 0;
  const hasSig = (flags & Flags.SIGNED) !== 0;
  const hasRoute = (flags & Flags.HAS_ROUTE) !== 0;
  const isRSR = (flags & Flags.IS_RSR) !== 0;

  let off = V2_HEADER_SIZE;

  if (off + SENDER_ID_SIZE > raw.length) return null;
  const senderID = raw.slice(off, off + SENDER_ID_SIZE);
  off += SENDER_ID_SIZE;

  let recipientID = BROADCAST_ID;
  if (hasRecipient) {
    if (off + RECIPIENT_ID_SIZE > raw.length) return null;
    recipientID = raw.slice(off, off + RECIPIENT_ID_SIZE);
    off += RECIPIENT_ID_SIZE;
  }

  const route: Uint8Array[] = [];
  if (hasRoute) {
    if (off >= raw.length) return null;
    const count = raw[off++];
    for (let i = 0; i < count; i++) {
      if (off + SENDER_ID_SIZE > raw.length) return null;
      route.push(raw.slice(off, off + SENDER_ID_SIZE));
      off += SENDER_ID_SIZE;
    }
  }

  if (off + payloadLen > raw.length) return null;
  const payload = raw.slice(off, off + payloadLen);
  off += payloadLen;

  let signature = new Uint8Array(SIGNATURE_SIZE);
  if (hasSig) {
    if (off + SIGNATURE_SIZE > raw.length) return null;
    signature = raw.slice(off, off + SIGNATURE_SIZE);
  }

  return {
    type,
    ttl,
    flags,
    senderID,
    recipientID,
    timestamp,
    signature,
    payload,
    isRSR: isRSR || undefined,
    route: route.length > 0 ? route : undefined,
  };
}

// Produce the byte string Ed25519 signs / verifies.
// Matches bitchat toBinaryDataForSigning(): encode the packet with ttl=0,
// isRSR cleared, and hasSignature cleared (so no signature field appears).
// This means relay TTL decrements and solicited-response tagging never
// invalidate the original signature.
function signingBytes(p: Packet): Uint8Array {
  return encodePacket({
    ...p,
    ttl: 0,
    isRSR: false,
    // Clear SIGNED so the signature field is excluded from the signed bytes.
    flags: p.flags & ~Flags.SIGNED,
    signature: new Uint8Array(SIGNATURE_SIZE),
  });
}

// Sign a packet. flags must include Flags.SIGNED before calling.
// Returns the 64-byte Ed25519 signature to store in packet.signature.
export function signPacket(p: Packet, signingPrivKey: Uint8Array): Uint8Array {
  return ed25519.sign(signingBytes(p), signingPrivKey);
}

// Verify a packet's Ed25519 signature against the sender's declared public key.
// Returns false if the packet should be dropped silently.
export function verifyPacket(p: Packet, signingPubKey: Uint8Array): boolean {
  if (!(p.flags & Flags.SIGNED)) return false;
  try {
    return ed25519.verify(p.signature, signingBytes(p), signingPubKey);
  } catch {
    return false;
  }
}

// Compute the 16-byte packet ID used for GCS gossip-sync and deduplication.
// Matches bitchat PacketIdUtil.swift / PacketIdUtil.kt:
//   SHA-256(type[1] | senderID[8] | timestamp_u64_BE[8] | payload)[0:16]
export function computePacketId(p: Packet): Uint8Array {
  const tsBuf = new Uint8Array(8);
  writeU64BE(new DataView(tsBuf.buffer), 0, p.timestamp);
  return sha256(
    concatBytes(
      new Uint8Array([p.type]),
      p.senderID.slice(0, 8),
      tsBuf,
      p.payload,
    ),
  ).slice(0, 16);
}

// Check whether the packet's recipientID is addressed to the given peer.
export function isForMe(p: Packet, myPeerIDBytes: Uint8Array): boolean {
  for (let i = 0; i < 8; i++) {
    if (p.recipientID[i] !== myPeerIDBytes[i]) return false;
  }
  return true;
}

// Check whether the packet is a broadcast (recipientID all-zeros, or
// HAS_RECIPIENT flag not set: both mean "no specific recipient").
export function isBroadcast(p: Packet): boolean {
  if (!(p.flags & Flags.HAS_RECIPIENT)) return true;
  return p.recipientID.every((b) => b === 0);
}
