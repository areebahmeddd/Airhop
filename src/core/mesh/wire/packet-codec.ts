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
//   route        (v2 only, hasRoute = 1: [count u8][hopx8]...)
//                NOT counted in payloadLength
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
import {
  compress,
  decompress,
  MAX_PAYLOAD_BYTES,
  shouldCompress,
} from "./packet-compression";

// Packet type registry per PROTOCOLS.md section 3.
//
// Everything up to VOICE_FRAME matches bitchat MessageType.swift /
// MessageType.kt (public domain). bitchat allocates forward and has reached
// 0x2C, so the values just past it are theirs to take, not ours. Airhop's own
// types live at 0x50 and up; see the note there before adding one.
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

  // Airhop extensions, allocated at 0x50 to stay clear of bitchat's frontier.
  // bitchat assigns forward and has reached 0x2C, so anything just past their
  // last shipped value is contested ground: one byte with two meanings makes
  // each side's parser depend on the other's validation to not misfire. 0x50
  // leaves them 36 values of room, and conformance.test.ts fails if they come
  // within 16, so a future collision surfaces in CI rather than in the field.
  CHANNEL_ENC = 0x50, // Airhop private channel: XChaCha20-Poly1305 sealed msg
  // Not 0x02: bitchat's BLE mesh has one public room, so a location cell sent as
  // 0x02 would render there, addressed to an audience its author never chose, on
  // top of the Nostr copy bitchat already receives. `#bluetooth` keeps 0x02.
  CHANNEL_MSG_AIRHOP = 0x51,
}

// Retired values, recorded so they are not reintroduced:
//
//   0x30 VIDEO_FRAME  specified over WiFi Aware or MultipeerConnectivity, which
//                     cannot interoperate, so cross-platform video was never
//                     reachable on that path.
//   0x40 CASHU_TOKEN  ecash travels as text inside an ordinary encrypted DM and
//                     is found by findTokensInText(). A dedicated type would be
//                     a second path to keep in sync.

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
// Other implementations use an all-0xFF sentinel instead; see isBroadcast().
export const BROADCAST_ID = new Uint8Array(8);

// Fixed header sizes.
export const V1_HEADER_SIZE = 14; // 2-byte payload length
export const V2_HEADER_SIZE = 16; // 4-byte payload length (+ optional route)
export const SENDER_ID_SIZE = 8;
const RECIPIENT_ID_SIZE = 8;
const SIGNATURE_SIZE = 64;
// Shortest decodable frame: the smaller (v1) header plus a senderID.
const MIN_DECODE_SIZE = V1_HEADER_SIZE + SENDER_ID_SIZE; // 22 bytes

// Fixed-header field positions (identical up to flags for v1 and v2).
const TTL_OFFSET = 2; // u8
const FLAGS_OFFSET = 11; // u8

// The payload exactly as it arrived, recorded by decodePacket.
//
// DEFLATE output is not canonical. bitchat iOS compresses with Apple's
// compression_encode_buffer, Android with java.util.zip.Deflater, and Airhop
// with pako; all three inflate each other's streams, but none reproduces another's
// bytes, and the size check in compress() can even make them disagree on whether
// to compress at all. Since signatures cover the re-encoded packet, a re-encode
// must reproduce the originator's exact bytes. Keeping the wire form does that
// without recompressing, which is what makes both foreign-packet verification and
// relaying work: a relay re-encodes, and recompressing would substitute its own
// bytes and break verification for every node downstream.
export interface WirePayload {
  bytes: Uint8Array; // as transmitted (compressed iff `compressed`)
  compressed: boolean; // whether the originator compressed it
  // The exact `payload` array these bytes decode to. The encoder reuses the wire
  // form only when this is reference-identical to the packet's `payload`, so a
  // rewritten payload falls back to compressing. Without that binding, a
  // same-length payload swap would be signed against the pre-swap bytes and
  // verify anyway.
  forPayload: Uint8Array;
}

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
  // Set by decodePacket only. When present the encoder reuses these bytes
  // verbatim instead of compressing `payload` again. Never set it by hand on a
  // packet you built: it is keyed to `payload` and the encoder discards it if
  // the two disagree.
  wirePayload?: WirePayload;
}

// Hand a packet to the transport, fire and forget.
//
// Lives beside `Packet` because flood-router and gossip-sync each had their own
// identical copy. Returns void deliberately: these are floods with no per-packet
// outcome. A transport that can refuse a write needs a type that says so, which
// is file-transfer-service's Paced* pair.
export type SendFn = (packet: Packet) => void;

// Timestamps are u64 on the wire but JS numbers, so these two are exact only up
// to Number.MAX_SAFE_INTEGER (2^53-1), which is centuries of milliseconds.
function writeU64BE(view: DataView, offset: number, n: number): void {
  const hi = Math.floor(n / 0x100000000) >>> 0;
  const lo = n >>> 0;
  view.setUint32(offset, hi, false);
  view.setUint32(offset + 4, lo, false);
}

function readU64BE(view: DataView, offset: number): number {
  const hi = view.getUint32(offset, false);
  const lo = view.getUint32(offset + 4, false);
  return hi * 0x100000000 + lo;
}

function headerSizeFor(version: number): number | null {
  if (version === 1) return V1_HEADER_SIZE;
  if (version === 2) return V2_HEADER_SIZE;
  return null;
}

// Whether a packet of this type is padded to a fixed block on the wire.
//
// Two different things are called padding here, and conflating them breaks the
// protocol in opposite directions. The signing preimage is padded for every type
// always, so pad bytes sit inside the signed material of every signed packet;
// signingBytes() forces that and this function has no part in it. The outbound
// frame is padded only where its length would leak something, which is what this
// decides, mirroring bitchat's BLEOutboundPacketPolicy.padsBLEFrame.
//
// Padding hides plaintext length behind ciphertext length. On a type whose size
// is already public it buys nothing and costs airtime on a ~15 KB/s radio: a
// 30-byte PING becomes 256 bytes, and a ~309-byte voice burst becomes 512, past
// the fragment frame budget and most negotiated MTUs. Voice is the one type where
// that cost is a broken feature rather than wasted bytes, since the 210-byte
// burst budget exists to keep it out of the fragment scheduler.
export function padsBLEFrame(type: PacketType): boolean {
  switch (type) {
    // Noise transport and handshake frames: ciphertext length is message
    // length. These are the two bitchat pads, and the set has to match.
    case PacketType.NOISE_ENCRYPTED:
    case PacketType.NOISE_HANDSHAKE:
    // Airhop-only private types in the same class. bitchat drops both as
    // unknown, so padding them costs no compatibility.
    case PacketType.DR_ENCRYPTED:
    case PacketType.CHANNEL_ENC:
      return true;
    default:
      // Everything else is public, already length-bounded, or time-critical.
      return false;
  }
}

// Encode a packet to bitchat's binary wire format.
//
// `padding` defaults to the per-type wire policy above. Callers that need the
// padded form regardless - only signingBytes() - pass true explicitly.
export function encodePacket(
  p: Packet,
  padding = padsBLEFrame(p.type),
): Uint8Array {
  const version = p.version ?? 2;
  const lengthFieldBytes = version === 2 ? 4 : 2;
  const headerSize = version === 2 ? V2_HEADER_SIZE : V1_HEADER_SIZE;

  // Compress the payload when bitchat would, keeping the original size so the
  // receiver can restore it. Route bytes are never compressed.
  let payload = p.payload;
  let isCompressed = false;
  let originalSize = 0;
  // A decoded packet carries its wire form. Reuse it so re-encoding reproduces
  // the originator's bytes exactly (see WirePayload). Only trust it when it
  // still describes `payload`, so a caller that swapped the payload out falls
  // back to compressing rather than emitting a mismatched frame.
  const maxRepresentable = version === 2 ? 0xffffffff : 0xffff;
  const wire = p.wirePayload;
  // The originalSize field is version-sized, so refuse a wire form whose size
  // this version cannot express rather than truncating it. Only reachable if a
  // caller re-encodes a v2 frame as v1, which nothing does today.
  const canReuseWire =
    wire !== undefined &&
    wire.forPayload === p.payload &&
    (!wire.compressed || p.payload.length <= maxRepresentable);
  if (canReuseWire) {
    if (wire!.compressed) {
      payload = wire!.bytes;
      originalSize = p.payload.length;
      isCompressed = true;
    }
    // Not compressed on the wire: leave `payload` as-is and do NOT consult
    // shouldCompress. The originator decided not to compress, and re-deriving
    // that decision with a different encoder can disagree at the size check.
  } else if (shouldCompress(payload)) {
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
  let wirePayload: WirePayload;
  if (isCompressed) {
    if (payloadLen < lengthFieldBytes) return null;
    // payloadLen is a claim made by the sender; this bounds the read against
    // what actually arrived. Every other read in this function is guarded the
    // same way, and this one was not: a 24-byte frame declaring COMPRESSED with
    // payloadLength 4 left `off` exactly at the end of the buffer, and DataView
    // THROWS on an out-of-range read rather than returning null like the rest of
    // the failure paths here. decodePacket has no try/catch and neither does the
    // caller, so the RangeError escaped into the native packetReceived listener.
    // A malformed frame must decode to null, never throw.
    if (off + lengthFieldBytes > raw.length) return null;
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
    wirePayload = { bytes: compressed, compressed: true, forPayload: payload };
  } else {
    if (off + payloadLen > raw.length) return null;
    payload = raw.slice(off, off + payloadLen);
    off += payloadLen;
    wirePayload = { bytes: payload, compressed: false, forPayload: payload };
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
    wirePayload,
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
  return encodePacket(
    {
      ...p,
      ttl: 0,
      isRSR: false,
      // Clear SIGNED so the signature field is excluded from the signed bytes.
      flags: p.flags & ~Flags.SIGNED,
      signature: new Uint8Array(SIGNATURE_SIZE),
    },
    // Always padded, for every type, regardless of the wire policy. bitchat's
    // toBinaryDataForSigning() encodes with padding on, so pad bytes are part
    // of the signed material for every signed packet. Using the per-type
    // default here would re-sign announces, messages, board posts and files
    // over a different preimage, and no bitchat node would verify them.
    true,
  );
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

// Check whether the packet is addressed to everyone rather than to one peer.
//
// Three encodings mean the same thing on the wire, and all three are accepted:
//   - HAS_RECIPIENT clear, recipientID field absent. What we and bitchat-iOS
//     emit, and what BROADCAST_ID stands in for after decoding.
//   - recipientID all-zeros, the decoded form of the case above.
//   - recipientID all-0xFF, the broadcast sentinel bitchat-Android writes with
//     HAS_RECIPIENT set. Dropping these would silently lose Android live voice
//     and public file transfers.
export function isBroadcast(p: Packet): boolean {
  if (!(p.flags & Flags.HAS_RECIPIENT)) return true;
  return (
    p.recipientID.every((b) => b === 0) ||
    p.recipientID.every((b) => b === 0xff)
  );
}
