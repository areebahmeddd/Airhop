// Binary encode/decode for the bitchat v2 wire format.
//
// Packet layout (all offsets are fixed regardless of flags):
//
//   [0]      u8     version = 2
//   [1]      u8     type
//   [2]      u8     ttl  (normalized to 0 for signing; decremented each hop)
//   [3]      u8     flags
//                     bit 0: hasRecipient (1 = unicast, recipientID non-zero)
//                     bit 1: compressed   (1 = LZ4 payload - not yet used)
//                     bit 2: signed       (1 = 64-byte Ed25519 signature present)
//                     bit 3: hasRoute     (1 = source route list follows signature)
//   [4–11]   bytes  senderID   (8 bytes)
//   [12–19]  bytes  recipientID (8 bytes, all-zeros = broadcast)
//   [20–23]  u32-BE timestamp  (Unix seconds)
//   [24–31]  bytes  nonce      (8 bytes random, for dedup)
//   [32–95]  bytes  signature  (64 bytes Ed25519; zeros if signed flag = 0)
//   [96+]    bytes  payload    (variable; source route prepended if hasRoute = 1)
//
// Signature coverage: header bytes [0–31] with TTL zeroed, plus raw payload bytes.
// This lets relay nodes decrement TTL without invalidating the signature.
import { ed25519 } from "@noble/curves/ed25519.js";

// Packet type registry per PROTOCOLS.md section 3.
// Types 0x01–0x28 are bitchat-defined; 0x29+ are Airhop extensions.
export const enum PacketType {
  ANNOUNCE = 0x01,
  CHANNEL_MSG = 0x02,
  DM = 0x03,
  DM_ACK = 0x04,
  FILE_CHUNK = 0x05,
  COURIER_ENV = 0x06,
  GOSSIP_FILTER = 0x07,
  VOICE_FRAME = 0x29,
  VIDEO_FRAME = 0x30,
  CASHU_TOKEN = 0x40,
}

// Byte offsets
const VERSION_OFFSET = 0;
const TYPE_OFFSET = 1;
const TTL_OFFSET = 2;
const FLAGS_OFFSET = 3;
const SENDER_ID_OFFSET = 4;
const RECIPIENT_ID_OFFSET = 12;
const TIMESTAMP_OFFSET = 20;
const NONCE_OFFSET = 24;
const SIGNATURE_OFFSET = 32;
const PAYLOAD_OFFSET = 96;
const HEADER_SIZE = 32; // bytes covered by signature (header only, not sig field itself)

// Flag bit masks - exported so callers can build flags for outgoing packets.
// Incoming packet flags are read from the wire unchanged.
export const Flags = {
  HAS_RECIPIENT: 0x01, // bit 0: 1 = unicast (recipientID non-zero)
  COMPRESSED: 0x02, // bit 1: 1 = LZ4-compressed payload
  SIGNED: 0x04, // bit 2: 1 = 64-byte Ed25519 signature present
  HAS_ROUTE: 0x08, // bit 3: 1 = source route list follows signature
} as const;

// Private alias used in verifyPacket guard
const FLAG_SIGNED = Flags.SIGNED;

export const BROADCAST_ID = new Uint8Array(8); // all-zeros, broadcast sentinel

export interface Packet {
  type: PacketType;
  ttl: number;
  // Raw flags byte from the wire. Must include Flags.SIGNED before signing.
  // Use Flags.* constants to build this for outgoing packets.
  flags: number;
  senderID: Uint8Array; // 8 bytes
  recipientID: Uint8Array; // 8 bytes (zeros = broadcast)
  timestamp: number; // u32 Unix seconds
  nonce: Uint8Array; // 8 bytes
  signature: Uint8Array; // 64 bytes
  payload: Uint8Array;
}

export function encodePacket(p: Packet): Uint8Array {
  const buf = new Uint8Array(PAYLOAD_OFFSET + p.payload.length);
  const view = new DataView(buf.buffer);

  buf[VERSION_OFFSET] = 2;
  buf[TYPE_OFFSET] = p.type;
  buf[TTL_OFFSET] = p.ttl;
  buf[FLAGS_OFFSET] = p.flags; // caller owns this - no reconstruction
  buf.set(p.senderID.slice(0, 8), SENDER_ID_OFFSET);
  buf.set(p.recipientID.slice(0, 8), RECIPIENT_ID_OFFSET);
  view.setUint32(TIMESTAMP_OFFSET, p.timestamp, false); // big-endian
  buf.set(p.nonce.slice(0, 8), NONCE_OFFSET);
  buf.set(p.signature.slice(0, 64), SIGNATURE_OFFSET);
  buf.set(p.payload, PAYLOAD_OFFSET);

  return buf;
}

export function decodePacket(raw: Uint8Array): Packet | null {
  if (raw.length < PAYLOAD_OFFSET) return null;
  if (raw[VERSION_OFFSET] !== 2) return null; // only support v2

  const view = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);

  return {
    type: raw[TYPE_OFFSET] as PacketType,
    ttl: raw[TTL_OFFSET],
    flags: raw[FLAGS_OFFSET], // preserve raw flags from wire
    senderID: raw.slice(SENDER_ID_OFFSET, SENDER_ID_OFFSET + 8),
    recipientID: raw.slice(RECIPIENT_ID_OFFSET, RECIPIENT_ID_OFFSET + 8),
    timestamp: view.getUint32(TIMESTAMP_OFFSET, false),
    nonce: raw.slice(NONCE_OFFSET, NONCE_OFFSET + 8),
    signature: raw.slice(SIGNATURE_OFFSET, PAYLOAD_OFFSET),
    payload: raw.slice(PAYLOAD_OFFSET),
  };
}

// Build the bytes Ed25519 signs: header [0–31] with TTL zeroed, plus payload.
// Uses p.flags directly - the caller must have set Flags.SIGNED before calling
// signPacket. This preserves compressed/hasRoute bits so receivers can verify.
function signingMessage(p: Packet): Uint8Array {
  const msg = new Uint8Array(HEADER_SIZE + p.payload.length);
  const view = new DataView(msg.buffer);

  msg[VERSION_OFFSET] = 2;
  msg[TYPE_OFFSET] = p.type;
  msg[TTL_OFFSET] = 0; // normalized to 0 so relay TTL decrements don't break sig
  msg[FLAGS_OFFSET] = p.flags; // preserve all flags (compressed, hasRoute, etc.)
  msg.set(p.senderID.slice(0, 8), SENDER_ID_OFFSET);
  msg.set(p.recipientID.slice(0, 8), RECIPIENT_ID_OFFSET);
  view.setUint32(TIMESTAMP_OFFSET, p.timestamp, false);
  msg.set(p.nonce.slice(0, 8), NONCE_OFFSET);
  msg.set(p.payload, HEADER_SIZE);

  return msg;
}

// Sign a packet. The packet's flags field must already include Flags.SIGNED.
// Returns the 64-byte Ed25519 signature to store in packet.signature.
export function signPacket(p: Packet, signingPrivKey: Uint8Array): Uint8Array {
  return ed25519.sign(signingMessage(p), signingPrivKey);
}

// Verify a packet's signature against the claimed sender's public key.
// Returns false if the packet should be dropped (invalid or unsigned).
export function verifyPacket(p: Packet, signingPubKey: Uint8Array): boolean {
  if (!(p.flags & FLAG_SIGNED)) return false; // unsigned packet - drop
  try {
    return ed25519.verify(p.signature, signingMessage(p), signingPubKey);
  } catch {
    return false;
  }
}

// Check whether the packet's recipientID matches ours (unicast to us).
export function isForMe(p: Packet, myPeerIDBytes: Uint8Array): boolean {
  for (let i = 0; i < 8; i++) {
    if (p.recipientID[i] !== myPeerIDBytes[i]) return false;
  }
  return true;
}

// Check whether the packet is a broadcast (recipientID all-zeros).
export function isBroadcast(p: Packet): boolean {
  return p.recipientID.every((b) => b === 0);
}
