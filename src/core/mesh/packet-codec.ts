// Binary encode/decode for the bitchat wire format.
//
// Byte-identical to bitchat BinaryProtocol.swift / BinaryProtocol.kt so an
// Airhop packet is decodable and signature-verifiable by bitchat iOS and Android
// nodes, and vice versa. Two header versions coexist:
//
//   v1 header (14 bytes):  version type ttl timestamp(8) flags payloadLen(u16)
//   v2 header (16 bytes):  version type ttl timestamp(8) flags payloadLen(u32)
//
// bitchat emits its core broadcasts (ANNOUNCE, message, leave) as v1 and uses v2
// for file transfer and source-routed packets; both sides decode either. We
// decode both and emit v2 (bitchat decodes v2 for every type).
//
// Variable sections (in order after the fixed header):
//   senderID     (8 bytes, always present)
//   recipientID  (8 bytes, only when hasRecipient = 1; omitted for broadcast)
//   route        (v2 only, hasRoute = 1: [count u8][hop×8]...), NOT counted in payloadLength
//   originalSize (lengthField bytes, only when isCompressed = 1)
//   payload      (compressed bytes when isCompressed, else raw)
//   signature    (64 bytes, only when hasSignature = 1)
// The whole frame is then PKCS#7-padded to a fixed block size (MessagePadding).
//
//   timestamp is MILLISECONDS since the Unix epoch (bitchat unit).
//   payloadLength = payload bytes + (isCompressed ? originalSize field : 0);
//                   it does NOT include the route block.
//
// Signing (matches bitchat toBinaryDataForSigning()): encode the packet with
// ttl=0, isRSR cleared, and no signature, PADDED, then Ed25519-sign. Receivers
// re-encode identically to verify. Clearing TTL lets relays decrement it, and
// clearing isRSR lets a packet be re-tagged as a solicited sync response,
// without invalidating the signature.
import { ed25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { concatBytes } from "@noble/hashes/utils.js";
import { optimalBlockSize, pad, unpad } from "./message-padding";
import { compress, decompress, shouldCompress } from "./packet-compression";

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
  BOARD_POST = 0x23, // Signed geohash/mesh bulletin-board post or tombstone
  PREKEY_BUNDLE = 0x24, // Signed batch of one-time prekeys (gossiped)
  GROUP_MESSAGE = 0x25, // Group-encrypted broadcast (cleartext group ID + AEAD)
  PING = 0x26, // Directed mesh echo request (nonce + origin TTL)
  PONG = 0x27, // Directed mesh echo reply (echoed nonce + origin TTL)
  NOSTR_CARRIER = 0x28, // Gateway-ferried signed Nostr event
  VOICE_FRAME = 0x29, // PTT audio burst (matches bitchat-iOS voiceFrame)
  CHANNEL_ENC = 0x2a, // Airhop private channel: XChaCha20-Poly1305 sealed msg
}

// Removed types, recorded so they aren't reintroduced by accident:
//
//   0x30 VIDEO_FRAME: video was specified over "WiFi Aware or
//     MultipeerConnectivity", but those are different protocols that cannot
//     interoperate. iOS<->Android video is impossible on that path, so the
//     type described a feature that could never work cross-platform.
//
//   0x40 CASHU_TOKEN: ecash travels as text inside an ordinary encrypted DM
//     and is detected by findTokensInText(). That works today and needs no
//     dedicated packet type; a second path would only be a second thing to
//     keep in sync.

// Flag bit values: must match bitchat BinaryProtocol.Flags exactly.
export const Flags = {
  HAS_RECIPIENT: 0x01, // bit 0: recipientID field is present (unicast)
  SIGNED: 0x02, // bit 1: 64-byte Ed25519 signature is appended
  COMPRESSED: 0x04, // bit 2: raw-DEFLATE payload, preceded by originalSize
  HAS_ROUTE: 0x08, // bit 3: source-route hop list is present
  IS_RSR: 0x10, // bit 4: packet is a solicited sync response
} as const;

// Broadcast sentinel: all-zeros recipientID.
// The encoder omits the recipientID field (and clears HAS_RECIPIENT) when it
// detects an all-zeros recipient. Decoders set recipientID to BROADCAST_ID when
// HAS_RECIPIENT is not set, preserving the isBroadcast() helper contract.
export const BROADCAST_ID = new Uint8Array(8);

// Fixed header sizes.
export const V1_HEADER_SIZE = 14; // 2-byte payload length
export const V2_HEADER_SIZE = 16; // 4-byte payload length (+ optional route)
const SENDER_ID_SIZE = 8;
const RECIPIENT_ID_SIZE = 8;
const SIGNATURE_SIZE = 64;
// Shortest decodable frame: the smaller (v1) header plus a senderID.
const MIN_DECODE_SIZE = V1_HEADER_SIZE + SENDER_ID_SIZE; // 22 bytes

// Fixed-header field positions (identical up to flags for v1 and v2).
const TTL_OFFSET = 2; // u8
const FLAGS_OFFSET = 11; // u8

export interface Packet {
  type: PacketType;
  ttl: number;
  // Flags byte. Use Flags.* constants. HAS_RECIPIENT / HAS_ROUTE / IS_RSR /
  // COMPRESSED are all derived by the encoder from the struct fields; only
  // SIGNED is honoured as an input (set it before signPacket).
  flags: number;
  senderID: Uint8Array; // 8 bytes
  recipientID: Uint8Array; // 8 bytes (all-zeros = broadcast)
  timestamp: number; // MILLISECONDS since epoch (u64 on wire; safe up to 2^53)
  signature: Uint8Array; // 64 bytes (zeros when unsigned)
  payload: Uint8Array; // decoded (decompressed) payload
  // Wire header version. Decoder reports what it read; encoder defaults to 2.
  version?: number;
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

// Maximum decodable payload length, matching bitchat's FileTransferLimits guard
// against absurd length fields (defends the decompressor and allocator).
const MAX_PAYLOAD_BYTES = 20 * 1024 * 1024;

function headerSizeFor(version: number): number | null {
  if (version === 1) return V1_HEADER_SIZE;
  if (version === 2) return V2_HEADER_SIZE;
  return null;
}

// Encode a packet to bitchat's binary wire format. `padding` defaults to true
// (the on-wire form and the signing preimage are both padded).
export function encodePacket(p: Packet, padding = true): Uint8Array {
  const version = p.version ?? 2;
  const lengthFieldBytes = version === 2 ? 4 : 2;
  const headerSize = version === 2 ? V2_HEADER_SIZE : V1_HEADER_SIZE;

  // Compress the payload when bitchat would, keeping the original size so the
  // receiver can restore it. Route bytes are never compressed.
  let payload = p.payload;
  let isCompressed = false;
  let originalSize = 0;
  if (shouldCompress(payload)) {
    const maxRepresentable = version === 2 ? 0xffffffff : 0xffff;
    if (payload.length <= maxRepresentable) {
      const c = compress(payload);
      if (c !== null) {
        originalSize = payload.length;
        payload = c;
        isCompressed = true;
      }
    }
  }

  const isBcast = p.recipientID.every((b) => b === 0);
  const hasRecipient = !isBcast;
  const isSigned = (p.flags & Flags.SIGNED) !== 0;
  // Route is v2-only.
  const route = version >= 2 ? (p.route ?? []) : [];
  const hasRoute = route.length > 0;
  const isRSR = p.isRSR === true;

  let wireFlags = 0;
  if (hasRecipient) wireFlags |= Flags.HAS_RECIPIENT;
  if (isSigned) wireFlags |= Flags.SIGNED;
  if (isCompressed) wireFlags |= Flags.COMPRESSED;
  if (hasRoute) wireFlags |= Flags.HAS_ROUTE;
  if (isRSR) wireFlags |= Flags.IS_RSR;

  const routeBytes = hasRoute ? 1 + route.length * SENDER_ID_SIZE : 0;
  const originalSizeFieldBytes = isCompressed ? lengthFieldBytes : 0;
  // payloadLength counts the payload and the compression preamble, NOT the route.
  const payloadDataSize = payload.length + originalSizeFieldBytes;

  let size = headerSize + SENDER_ID_SIZE;
  if (hasRecipient) size += RECIPIENT_ID_SIZE;
  size += routeBytes;
  size += payloadDataSize;
  if (isSigned) size += SIGNATURE_SIZE;

  const buf = new Uint8Array(size);
  const view = new DataView(buf.buffer);
  let off = 0;

  buf[off++] = version;
  buf[off++] = p.type;
  buf[off++] = p.ttl;
  writeU64BE(view, off, p.timestamp);
  off += 8;
  buf[off++] = wireFlags;
  if (version === 2) {
    view.setUint32(off, payloadDataSize, false);
    off += 4;
  } else {
    view.setUint16(off, payloadDataSize, false);
    off += 2;
  }

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
  if (isCompressed) {
    if (version === 2) {
      view.setUint32(off, originalSize, false);
      off += 4;
    } else {
      view.setUint16(off, originalSize, false);
      off += 2;
    }
  }
  buf.set(payload, off);
  off += payload.length;
  if (isSigned) {
    buf.set(p.signature.slice(0, 64), off);
  }

  if (padding) {
    return pad(buf, optimalBlockSize(buf.length));
  }
  return buf;
}

export function decodePacket(raw: Uint8Array): Packet | null {
  // Decode as-is first (robust when padding was not applied), then retry after
  // stripping PKCS#7 padding, exactly bitchat's BinaryProtocol.decode.
  const direct = decodeCore(raw);
  if (direct !== null) return direct;
  const unpadded = unpad(raw);
  if (unpadded.length === raw.length) return null;
  return decodeCore(unpadded);
}

function decodeCore(raw: Uint8Array): Packet | null {
  if (raw.length < MIN_DECODE_SIZE) return null;
  const view = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);

  const version = raw[0];
  const headerSize = headerSizeFor(version);
  if (headerSize === null) return null;
  const lengthFieldBytes = version === 2 ? 4 : 2;
  if (raw.length < headerSize + SENDER_ID_SIZE) return null;

  const type = raw[1] as PacketType;
  const ttl = raw[TTL_OFFSET];
  const timestamp = readU64BE(view, 3);
  const flags = raw[FLAGS_OFFSET];
  const payloadLen =
    version === 2 ? view.getUint32(12, false) : view.getUint16(12, false);
  if (payloadLen > MAX_PAYLOAD_BYTES) return null;

  const hasRecipient = (flags & Flags.HAS_RECIPIENT) !== 0;
  const hasSig = (flags & Flags.SIGNED) !== 0;
  const isCompressed = (flags & Flags.COMPRESSED) !== 0;
  const hasRoute = version >= 2 && (flags & Flags.HAS_ROUTE) !== 0;
  const isRSR = (flags & Flags.IS_RSR) !== 0;

  let off = headerSize;

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

  // Payload: payloadLen covers the payload plus the compression preamble.
  let payload: Uint8Array;
  if (isCompressed) {
    if (payloadLen < lengthFieldBytes) return null;
    const origSize =
      version === 2 ? view.getUint32(off, false) : view.getUint16(off, false);
    off += lengthFieldBytes;
    if (origSize > MAX_PAYLOAD_BYTES) return null;
    const compressedSize = payloadLen - lengthFieldBytes;
    if (compressedSize <= 0 || off + compressedSize > raw.length) return null;
    const compressed = raw.slice(off, off + compressedSize);
    off += compressedSize;
    const decompressed = decompress(compressed, origSize);
    if (decompressed === null) return null;
    payload = decompressed;
  } else {
    if (off + payloadLen > raw.length) return null;
    payload = raw.slice(off, off + payloadLen);
    off += payloadLen;
  }

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
    version,
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
