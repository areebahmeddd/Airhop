// Private groups: wire formats and crypto.
//
// Byte-compatible with bitchat GroupProtocol.swift. Two wire forms:
//
//   Group state (creator-signed roster + epoch key) travels over Noise as a
//   NoisePayload of type groupInvite (0x06) or groupKeyUpdate (0x07). Every
//   member verifies the creator's Ed25519 signature over
//   "bitchat-group-v1" | groupID | epoch | SHA256(key) | SHA256(roster) |
//   SHA256(name) before trusting it.
//
//   Group messages broadcast as MessageType.groupMessage (0x25): a cleartext
//   groupID + epoch + nonce framing an ChaCha20-Poly1305 body. Only members
//   holding the epoch key can open it; the inner content is Ed25519-signed by
//   the author so a member cannot forge another member's messages.
//
// All TLVs use a 2-byte big-endian length. ChaCha20-Poly1305 is RFC 8439
// (12-byte nonce, 16-byte tag) with AAD = groupID ‖ epoch(4B BE), matching
// CryptoKit's ChaChaPoly so the two clients interoperate.

import { chacha20poly1305 } from "@noble/ciphers/chacha.js";
import { ed25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, concatBytes, hexToBytes } from "@noble/hashes/utils.js";

export const GROUP_ID_LENGTH = 16;
export const GROUP_KEY_LENGTH = 32;
export const GROUP_MAX_MEMBERS = 16;
const FINGERPRINT_LENGTH = 32;
const SIGNING_KEY_LENGTH = 32;
const MAX_NICKNAME_BYTES = 64;
const NONCE_LENGTH = 12;
const TAG_LENGTH = 16;

const STATE_DOMAIN = new TextEncoder().encode("bitchat-group-v1");
const MSG_DOMAIN = new TextEncoder().encode("bitchat-group-msg-v1");
const enc = new TextEncoder();
const dec = new TextDecoder("utf-8", { fatal: false });

export interface GroupMember {
  fingerprint: string; // SHA-256 of the member's Noise static key (64 hex)
  signingKey: Uint8Array; // 32-byte Ed25519 public key
  nickname: string;
}

export interface BitchatGroup {
  groupID: Uint8Array; // 16 bytes
  name: string;
  epoch: number; // u32
  members: GroupMember[];
  creatorFingerprint: string;
}

export interface GroupStatePayload extends BitchatGroup {
  key: Uint8Array; // 32-byte epoch key
  signature: Uint8Array; // 64-byte Ed25519 by the creator
}

export interface GroupMessageEnvelope {
  groupID: Uint8Array;
  epoch: number;
  nonce: Uint8Array; // 12 bytes
  ciphertext: Uint8Array; // ChaChaPoly body ‖ 16-byte tag
}

export interface GroupMessagePlaintext {
  messageID: string;
  senderSigningKey: Uint8Array;
  senderNickname: string;
  timestampMs: number;
  content: string;
}

// ---- byte helpers -----------------------------------------------------------

function u32be(value: number): Uint8Array {
  const out = new Uint8Array(4);
  new DataView(out.buffer).setUint32(0, value >>> 0, false);
  return out;
}
function readU32be(v: Uint8Array): number | null {
  if (v.length !== 4) return null;
  return new DataView(v.buffer, v.byteOffset, 4).getUint32(0, false);
}
function u64be(value: number): Uint8Array {
  const out = new Uint8Array(8);
  new DataView(out.buffer).setBigUint64(0, BigInt(value), false);
  return out;
}
function readU64be(v: Uint8Array): number | null {
  if (v.length !== 8) return null;
  return Number(new DataView(v.buffer, v.byteOffset, 8).getBigUint64(0, false));
}

interface TLVField {
  type: number;
  value: Uint8Array;
}

function putTLV(type: number, value: Uint8Array): Uint8Array {
  if (value.length > 0xffff) throw new Error("group TLV value too long");
  const out = new Uint8Array(3 + value.length);
  out[0] = type;
  new DataView(out.buffer).setUint16(1, value.length, false);
  out.set(value, 3);
  return out;
}

function parseTLV(data: Uint8Array): TLVField[] | null {
  const fields: TLVField[] = [];
  let off = 0;
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  while (off < data.length) {
    if (off + 3 > data.length) return null;
    const type = data[off];
    const length = view.getUint16(off + 1, false);
    const start = off + 3;
    if (start + length > data.length) return null;
    fields.push({ type, value: data.slice(start, start + length) });
    off = start + length;
  }
  return fields;
}

export function groupFingerprint(noiseStaticPubKey: Uint8Array): string {
  return bytesToHex(sha256(noiseStaticPubKey));
}

// ---- roster -----------------------------------------------------------------

function truncatedNickname(nickname: string): Uint8Array {
  let n = nickname;
  while (enc.encode(n).length > MAX_NICKNAME_BYTES) n = n.slice(0, -1);
  return enc.encode(n);
}

export function encodeRoster(members: GroupMember[]): Uint8Array | null {
  if (members.length > GROUP_MAX_MEMBERS) return null;
  const parts: Uint8Array[] = [new Uint8Array([members.length])];
  for (const m of members) {
    const fp = hexToBytesSafe(m.fingerprint);
    if (fp === null || fp.length !== FINGERPRINT_LENGTH) return null;
    if (m.signingKey.length !== SIGNING_KEY_LENGTH) return null;
    const nick = truncatedNickname(m.nickname);
    parts.push(fp, m.signingKey, new Uint8Array([nick.length]), nick);
  }
  return concatBytes(...parts);
}

export function decodeRoster(data: Uint8Array): GroupMember[] | null {
  if (data.length < 1) return null;
  const count = data[0];
  if (count > GROUP_MAX_MEMBERS) return null;
  const members: GroupMember[] = [];
  let off = 1;
  for (let i = 0; i < count; i++) {
    const fixed = FINGERPRINT_LENGTH + SIGNING_KEY_LENGTH + 1;
    if (off + fixed > data.length) return null;
    const fingerprint = bytesToHex(data.slice(off, off + FINGERPRINT_LENGTH));
    const signingKey = data.slice(
      off + FINGERPRINT_LENGTH,
      off + FINGERPRINT_LENGTH + SIGNING_KEY_LENGTH,
    );
    const nickLen = data[off + FINGERPRINT_LENGTH + SIGNING_KEY_LENGTH];
    const nickStart = off + fixed;
    if (nickStart + nickLen > data.length) return null;
    const nickname = dec.decode(data.slice(nickStart, nickStart + nickLen));
    members.push({ fingerprint, signingKey, nickname });
    off = nickStart + nickLen;
  }
  if (off !== data.length) return null;
  return members;
}

function hexToBytesSafe(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(hex)) return null;
  try {
    return hexToBytes(hex);
  } catch {
    return null;
  }
}

// ---- group state (invite / key update) --------------------------------------

enum StateField {
  GROUP_ID = 0x01,
  NAME = 0x02,
  KEY = 0x03,
  EPOCH = 0x04,
  ROSTER = 0x05,
  CREATOR_FINGERPRINT = 0x06,
  SIGNATURE = 0x07,
}

export function groupStateSigningContent(
  groupID: Uint8Array,
  epoch: number,
  key: Uint8Array,
  rosterBlob: Uint8Array,
  name: string,
): Uint8Array {
  return concatBytes(
    STATE_DOMAIN,
    groupID,
    u32be(epoch),
    sha256(key),
    sha256(rosterBlob),
    sha256(enc.encode(name)),
  );
}

export function signGroupState(
  group: BitchatGroup,
  key: Uint8Array,
  signingPrivKey: Uint8Array,
): GroupStatePayload | null {
  const rosterBlob = encodeRoster(group.members);
  if (rosterBlob === null) return null;
  const content = groupStateSigningContent(
    group.groupID,
    group.epoch,
    key,
    rosterBlob,
    group.name,
  );
  const signature = ed25519.sign(content, signingPrivKey);
  return { ...group, key, signature };
}

export function verifyGroupState(payload: GroupStatePayload): boolean {
  if (payload.members.length > GROUP_MAX_MEMBERS) return false;
  const creator = payload.members.find(
    (m) => m.fingerprint === payload.creatorFingerprint,
  );
  if (creator === undefined) return false;
  const rosterBlob = encodeRoster(payload.members);
  if (rosterBlob === null) return false;
  const content = groupStateSigningContent(
    payload.groupID,
    payload.epoch,
    payload.key,
    rosterBlob,
    payload.name,
  );
  try {
    return ed25519.verify(payload.signature, content, creator.signingKey);
  } catch {
    return false;
  }
}

export function encodeGroupState(
  payload: GroupStatePayload,
): Uint8Array | null {
  const rosterBlob = encodeRoster(payload.members);
  const fp = hexToBytesSafe(payload.creatorFingerprint);
  if (rosterBlob === null || fp === null || fp.length !== 32) return null;
  try {
    return concatBytes(
      putTLV(StateField.GROUP_ID, payload.groupID),
      putTLV(StateField.NAME, enc.encode(payload.name)),
      putTLV(StateField.KEY, payload.key),
      putTLV(StateField.EPOCH, u32be(payload.epoch)),
      putTLV(StateField.ROSTER, rosterBlob),
      putTLV(StateField.CREATOR_FINGERPRINT, fp),
      putTLV(StateField.SIGNATURE, payload.signature),
    );
  } catch {
    return null;
  }
}

export function decodeGroupState(data: Uint8Array): GroupStatePayload | null {
  const fields = parseTLV(data);
  if (fields === null) return null;
  let groupID: Uint8Array | undefined;
  let name: string | undefined;
  let key: Uint8Array | undefined;
  let epoch: number | null | undefined;
  let members: GroupMember[] | null | undefined;
  let creatorFingerprint: string | undefined;
  let signature: Uint8Array | undefined;

  for (const { type, value } of fields) {
    switch (type) {
      case StateField.GROUP_ID:
        if (value.length === GROUP_ID_LENGTH) groupID = value;
        break;
      case StateField.NAME:
        name = dec.decode(value);
        break;
      case StateField.KEY:
        if (value.length === GROUP_KEY_LENGTH) key = value;
        break;
      case StateField.EPOCH:
        epoch = readU32be(value);
        break;
      case StateField.ROSTER:
        members = decodeRoster(value);
        break;
      case StateField.CREATOR_FINGERPRINT:
        if (value.length === 32) creatorFingerprint = bytesToHex(value);
        break;
      case StateField.SIGNATURE:
        if (value.length === 64) signature = value;
        break;
      default:
        break;
    }
  }
  if (
    groupID === undefined ||
    name === undefined ||
    key === undefined ||
    epoch === undefined ||
    epoch === null ||
    members === undefined ||
    members === null ||
    members.length === 0 ||
    creatorFingerprint === undefined ||
    signature === undefined
  ) {
    return null;
  }
  return { groupID, name, key, epoch, members, creatorFingerprint, signature };
}

// ---- group message envelope (0x25) ------------------------------------------

enum EnvField {
  GROUP_ID = 0x01,
  EPOCH = 0x02,
  NONCE = 0x03,
  CIPHERTEXT = 0x04,
}

export function encodeGroupEnvelope(env: GroupMessageEnvelope): Uint8Array {
  return concatBytes(
    putTLV(EnvField.GROUP_ID, env.groupID),
    putTLV(EnvField.EPOCH, u32be(env.epoch)),
    putTLV(EnvField.NONCE, env.nonce),
    putTLV(EnvField.CIPHERTEXT, env.ciphertext),
  );
}

export function decodeGroupEnvelope(
  data: Uint8Array,
): GroupMessageEnvelope | null {
  const fields = parseTLV(data);
  if (fields === null) return null;
  let groupID: Uint8Array | undefined;
  let epoch: number | null | undefined;
  let nonce: Uint8Array | undefined;
  let ciphertext: Uint8Array | undefined;
  for (const { type, value } of fields) {
    switch (type) {
      case EnvField.GROUP_ID:
        if (value.length === GROUP_ID_LENGTH) groupID = value;
        break;
      case EnvField.EPOCH:
        epoch = readU32be(value);
        break;
      case EnvField.NONCE:
        if (value.length === NONCE_LENGTH) nonce = value;
        break;
      case EnvField.CIPHERTEXT:
        if (value.length > 0) ciphertext = value;
        break;
      default:
        break;
    }
  }
  if (
    groupID === undefined ||
    epoch === undefined ||
    epoch === null ||
    nonce === undefined ||
    ciphertext === undefined
  ) {
    return null;
  }
  return { groupID, epoch, nonce, ciphertext };
}

// ---- message crypto ---------------------------------------------------------

enum InnerField {
  MESSAGE_ID = 0x01,
  SENDER_SIGNING_KEY = 0x02,
  SENDER_NICKNAME = 0x03,
  TIMESTAMP = 0x04,
  CONTENT = 0x05,
  SIGNATURE = 0x06,
}

export function groupMessageSigningContent(
  groupID: Uint8Array,
  epoch: number,
  messageID: string,
  timestampMs: number,
  content: string,
): Uint8Array {
  return concatBytes(
    MSG_DOMAIN,
    groupID,
    u32be(epoch),
    enc.encode(messageID),
    u64be(timestampMs),
    enc.encode(content),
  );
}

// Seal a group message into a 0x25 payload. Returns null on encode failure.
export function sealGroupMessage(args: {
  content: string;
  messageID: string;
  senderNickname: string;
  senderSigningKey: Uint8Array;
  senderSigningPrivKey: Uint8Array;
  timestampMs: number;
  groupID: Uint8Array;
  epoch: number;
  key: Uint8Array;
}): Uint8Array | null {
  const signature = ed25519.sign(
    groupMessageSigningContent(
      args.groupID,
      args.epoch,
      args.messageID,
      args.timestampMs,
      args.content,
    ),
    args.senderSigningPrivKey,
  );
  let inner: Uint8Array;
  try {
    inner = concatBytes(
      putTLV(InnerField.MESSAGE_ID, enc.encode(args.messageID)),
      putTLV(InnerField.SENDER_SIGNING_KEY, args.senderSigningKey),
      putTLV(InnerField.SENDER_NICKNAME, enc.encode(args.senderNickname)),
      putTLV(InnerField.TIMESTAMP, u64be(args.timestampMs)),
      putTLV(InnerField.CONTENT, enc.encode(args.content)),
      putTLV(InnerField.SIGNATURE, signature),
    );
  } catch {
    return null;
  }
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));
  const aad = concatBytes(args.groupID, u32be(args.epoch));
  const ciphertext = chacha20poly1305(args.key, nonce, aad).encrypt(inner);
  return encodeGroupEnvelope({
    groupID: args.groupID,
    epoch: args.epoch,
    nonce,
    ciphertext,
  });
}

// Open + verify a group message envelope with the epoch key. Roster membership
// of the sender is the CALLER's check; this only proves the author holds
// senderSigningKey. Returns null on any failure.
export function openGroupMessage(
  env: GroupMessageEnvelope,
  key: Uint8Array,
): GroupMessagePlaintext | null {
  if (env.ciphertext.length <= TAG_LENGTH) return null;
  const aad = concatBytes(env.groupID, u32be(env.epoch));
  let inner: Uint8Array;
  try {
    inner = chacha20poly1305(key, env.nonce, aad).decrypt(env.ciphertext);
  } catch {
    return null;
  }
  const fields = parseTLV(inner);
  if (fields === null) return null;
  let messageID: string | undefined;
  let senderSigningKey: Uint8Array | undefined;
  let senderNickname: string | undefined;
  let timestampMs: number | null | undefined;
  let content: string | undefined;
  let signature: Uint8Array | undefined;
  for (const { type, value } of fields) {
    switch (type) {
      case InnerField.MESSAGE_ID:
        messageID = dec.decode(value);
        break;
      case InnerField.SENDER_SIGNING_KEY:
        if (value.length === 32) senderSigningKey = value;
        break;
      case InnerField.SENDER_NICKNAME:
        senderNickname = dec.decode(value);
        break;
      case InnerField.TIMESTAMP:
        timestampMs = readU64be(value);
        break;
      case InnerField.CONTENT:
        content = dec.decode(value);
        break;
      case InnerField.SIGNATURE:
        if (value.length === 64) signature = value;
        break;
      default:
        break;
    }
  }
  if (
    messageID === undefined ||
    messageID.length === 0 ||
    senderSigningKey === undefined ||
    senderNickname === undefined ||
    timestampMs === undefined ||
    timestampMs === null ||
    content === undefined ||
    signature === undefined
  ) {
    return null;
  }
  const signingContent = groupMessageSigningContent(
    env.groupID,
    env.epoch,
    messageID,
    timestampMs,
    content,
  );
  try {
    if (!ed25519.verify(signature, signingContent, senderSigningKey))
      return null;
  } catch {
    return null;
  }
  return { messageID, senderSigningKey, senderNickname, timestampMs, content };
}

export function newGroupID(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(GROUP_ID_LENGTH));
}

export function newGroupKey(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(GROUP_KEY_LENGTH));
}
