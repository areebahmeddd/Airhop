// Bulletin-board wire format (MessageType.boardPost = 0x23 payloads).
//
// Byte-identical to bitchat BoardPackets.swift so a signed Airhop board post or
// tombstone verifies on bitchat iOS/Android and vice versa. A board post is a
// signed, persistent notice designed to outlive chat: it lives until its
// author-chosen expiry (max 7 days). A tombstone is a signed deletion marker
// only the author's key can produce.
//
// TLV layout (type u8, length u16 big-endian, value):
//   0x01 kind (u8)               0x01 post, 0x02 tombstone
//   0x02 postID (16B random)
//   0x03 geohash (UTF-8, "" = mesh-local board, max 12)  [post]
//   0x04 content (UTF-8, 1..512 bytes)                    [post]
//   0x05 authorSigningKey (32B Ed25519 public key)
//   0x06 authorNickname (UTF-8, max 64 bytes)             [post]
//   0x07 createdAt (u64 BE, ms)                           [post]
//   0x08 expiresAt (u64 BE, ms, max 7 days after created) [post]
//   0x09 flags (u8, bit0 = urgent)                        [post]
//   0x0A signature (64B Ed25519)
//   0x0B deletedAt (u64 BE, ms)                           [tombstone]
// Unknown TLVs are skipped for forward compatibility.
//
// The signature covers a canonical, length-prefixed encoding (signingBytes),
// NOT the TLV, so field reordering or padding cannot change what was signed.

import { ed25519 } from "@noble/curves/ed25519.js";

export const BoardWireConstants = {
  POST_ID_LENGTH: 16,
  SIGNING_KEY_LENGTH: 32,
  SIGNATURE_LENGTH: 64,
  CONTENT_MAX_BYTES: 512,
  NICKNAME_MAX_BYTES: 64,
  GEOHASH_MAX_LENGTH: 12,
  // Posts may live at most 7 days past their creation timestamp.
  MAX_LIFETIME_MS: 7 * 24 * 60 * 60 * 1000,
  POST_SIGNING_CONTEXT: "bitchat-board-v1",
  TOMBSTONE_SIGNING_CONTEXT: "bitchat-board-del-v1",
} as const;

const GEOHASH_ALPHABET = new Set("0123456789bcdefghjkmnpqrstuvwxyz");

const URGENT_FLAG = 0x01;

enum TLV {
  KIND = 0x01,
  POST_ID = 0x02,
  GEOHASH = 0x03,
  CONTENT = 0x04,
  AUTHOR_SIGNING_KEY = 0x05,
  AUTHOR_NICKNAME = 0x06,
  CREATED_AT = 0x07,
  EXPIRES_AT = 0x08,
  FLAGS = 0x09,
  SIGNATURE = 0x0a,
  DELETED_AT = 0x0b,
}

enum WireKind {
  POST = 0x01,
  TOMBSTONE = 0x02,
}

export interface BoardPost {
  postID: Uint8Array; // 16 bytes
  geohash: string; // "" = mesh-local board
  content: string;
  authorSigningKey: Uint8Array; // 32-byte Ed25519 public key
  authorNickname: string;
  createdAt: number; // ms
  expiresAt: number; // ms
  flags: number;
  signature: Uint8Array; // 64 bytes
}

export interface BoardTombstone {
  postID: Uint8Array;
  authorSigningKey: Uint8Array;
  deletedAt: number; // ms
  signature: Uint8Array;
}

export type BoardWire =
  | { kind: "post"; post: BoardPost }
  | { kind: "tombstone"; tombstone: BoardTombstone };

export function isUrgent(post: BoardPost): boolean {
  return (post.flags & URGENT_FLAG) !== 0;
}

export const URGENT: number = URGENT_FLAG;

// ---- encoders ---------------------------------------------------------------

const enc = new TextEncoder();
const dec = new TextDecoder("utf-8", { fatal: false });

function u64be(value: number): Uint8Array {
  const out = new Uint8Array(8);
  new DataView(out.buffer).setBigUint64(0, BigInt(value), false);
  return out;
}

function readU64be(v: Uint8Array): number | null {
  if (v.length !== 8) return null;
  const n = new DataView(v.buffer, v.byteOffset, 8).getBigUint64(0, false);
  // Board timestamps are ms since epoch: well within Number's safe range.
  return Number(n);
}

// Canonical signing input: a 1-byte-length-prefixed context, then fixed fields
// and u16-length-prefixed variable fields so no two combinations collide.
function postSigningBytes(p: Omit<BoardPost, "signature">): Uint8Array {
  const parts: Uint8Array[] = [];
  appendContext(parts, BoardWireConstants.POST_SIGNING_CONTEXT);
  parts.push(p.postID);
  appendLengthPrefixed(parts, enc.encode(p.geohash));
  appendLengthPrefixed(parts, enc.encode(p.content));
  parts.push(p.authorSigningKey);
  appendLengthPrefixed(parts, enc.encode(p.authorNickname));
  parts.push(u64be(p.createdAt));
  parts.push(u64be(p.expiresAt));
  parts.push(new Uint8Array([p.flags & 0xff]));
  return concat(parts);
}

function tombstoneSigningBytes(
  postID: Uint8Array,
  deletedAt: number,
): Uint8Array {
  const parts: Uint8Array[] = [];
  appendContext(parts, BoardWireConstants.TOMBSTONE_SIGNING_CONTEXT);
  parts.push(postID);
  parts.push(u64be(deletedAt));
  return concat(parts);
}

function appendContext(parts: Uint8Array[], context: string): void {
  const bytes = enc.encode(context).slice(0, 255);
  parts.push(new Uint8Array([bytes.length]));
  parts.push(bytes);
}

function appendLengthPrefixed(parts: Uint8Array[], value: Uint8Array): void {
  const clipped = value.slice(0, 0xffff);
  const len = new Uint8Array(2);
  new DataView(len.buffer).setUint16(0, clipped.length, false);
  parts.push(len);
  parts.push(clipped);
}

function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

function tlv(parts: Uint8Array[], type: TLV, value: Uint8Array): void {
  const header = new Uint8Array(3);
  header[0] = type;
  new DataView(header.buffer).setUint16(1, value.length, false);
  parts.push(header);
  parts.push(value);
}

// ---- signing / verification -------------------------------------------------

// Build and sign a board post with the author's Ed25519 signing private key.
export function signBoardPost(
  fields: Omit<BoardPost, "signature">,
  signingPrivKey: Uint8Array,
): BoardPost {
  const signature = ed25519.sign(postSigningBytes(fields), signingPrivKey);
  return { ...fields, signature };
}

export function signBoardTombstone(
  postID: Uint8Array,
  authorSigningKey: Uint8Array,
  deletedAt: number,
  signingPrivKey: Uint8Array,
): BoardTombstone {
  const signature = ed25519.sign(
    tombstoneSigningBytes(postID, deletedAt),
    signingPrivKey,
  );
  return { postID, authorSigningKey, deletedAt, signature };
}

export function verifyBoardWire(wire: BoardWire): boolean {
  try {
    if (wire.kind === "post") {
      const p = wire.post;
      return ed25519.verify(
        p.signature,
        postSigningBytes(p),
        p.authorSigningKey,
      );
    }
    const t = wire.tombstone;
    return ed25519.verify(
      t.signature,
      tombstoneSigningBytes(t.postID, t.deletedAt),
      t.authorSigningKey,
    );
  } catch {
    return false;
  }
}

// ---- wire encode/decode -----------------------------------------------------

export function encodeBoardWire(wire: BoardWire): Uint8Array {
  const parts: Uint8Array[] = [];
  if (wire.kind === "post") {
    const p = wire.post;
    tlv(parts, TLV.KIND, new Uint8Array([WireKind.POST]));
    tlv(parts, TLV.POST_ID, p.postID);
    tlv(parts, TLV.GEOHASH, enc.encode(p.geohash));
    tlv(parts, TLV.CONTENT, enc.encode(p.content));
    tlv(parts, TLV.AUTHOR_SIGNING_KEY, p.authorSigningKey);
    tlv(parts, TLV.AUTHOR_NICKNAME, enc.encode(p.authorNickname));
    tlv(parts, TLV.CREATED_AT, u64be(p.createdAt));
    tlv(parts, TLV.EXPIRES_AT, u64be(p.expiresAt));
    tlv(parts, TLV.FLAGS, new Uint8Array([p.flags & 0xff]));
    tlv(parts, TLV.SIGNATURE, p.signature);
  } else {
    const t = wire.tombstone;
    tlv(parts, TLV.KIND, new Uint8Array([WireKind.TOMBSTONE]));
    tlv(parts, TLV.POST_ID, t.postID);
    tlv(parts, TLV.AUTHOR_SIGNING_KEY, t.authorSigningKey);
    tlv(parts, TLV.DELETED_AT, u64be(t.deletedAt));
    tlv(parts, TLV.SIGNATURE, t.signature);
  }
  return concat(parts);
}

function isValidGeohashField(geohash: string): boolean {
  if (geohash.length === 0) return true;
  for (const ch of geohash) if (!GEOHASH_ALPHABET.has(ch)) return false;
  return true;
}

// Structural decode. The caller MUST still verify the signature
// (`verifyBoardWire`) before ingesting.
export function decodeBoardWire(data: Uint8Array): BoardWire | null {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let off = 0;
  let kind: WireKind | undefined;
  let postID: Uint8Array | undefined;
  let geohash: string | undefined;
  let content: string | undefined;
  let contentBytes = 0;
  let authorSigningKey: Uint8Array | undefined;
  let authorNickname: string | undefined;
  let nicknameBytes = 0;
  let createdAt: number | null | undefined;
  let expiresAt: number | null | undefined;
  let flags: number | undefined;
  let signature: Uint8Array | undefined;
  let deletedAt: number | null | undefined;

  while (off + 3 <= data.length) {
    const t = data[off];
    off += 1;
    const len = view.getUint16(off, false);
    off += 2;
    if (off + len > data.length) return null;
    const v = data.subarray(off, off + len);
    off += len;

    switch (t) {
      case TLV.KIND:
        if (v.length !== 1) return null;
        kind = v[0];
        break;
      case TLV.POST_ID:
        if (v.length !== BoardWireConstants.POST_ID_LENGTH) return null;
        postID = v.slice();
        break;
      case TLV.GEOHASH:
        if (v.length > BoardWireConstants.GEOHASH_MAX_LENGTH) return null;
        geohash = dec.decode(v);
        break;
      case TLV.CONTENT:
        if (v.length > BoardWireConstants.CONTENT_MAX_BYTES) return null;
        contentBytes = v.length;
        content = dec.decode(v);
        break;
      case TLV.AUTHOR_SIGNING_KEY:
        if (v.length !== BoardWireConstants.SIGNING_KEY_LENGTH) return null;
        authorSigningKey = v.slice();
        break;
      case TLV.AUTHOR_NICKNAME:
        if (v.length > BoardWireConstants.NICKNAME_MAX_BYTES) return null;
        nicknameBytes = v.length;
        authorNickname = dec.decode(v);
        break;
      case TLV.CREATED_AT:
        createdAt = readU64be(v);
        break;
      case TLV.EXPIRES_AT:
        expiresAt = readU64be(v);
        break;
      case TLV.FLAGS:
        if (v.length !== 1) return null;
        flags = v[0];
        break;
      case TLV.SIGNATURE:
        if (v.length !== BoardWireConstants.SIGNATURE_LENGTH) return null;
        signature = v.slice();
        break;
      case TLV.DELETED_AT:
        deletedAt = readU64be(v);
        break;
      default:
        break; // forward compatible: ignore unknown TLVs
    }
  }

  if (
    postID === undefined ||
    authorSigningKey === undefined ||
    signature === undefined
  ) {
    return null;
  }

  if (kind === WireKind.POST) {
    if (
      geohash === undefined ||
      content === undefined ||
      authorNickname === undefined ||
      createdAt === undefined ||
      createdAt === null ||
      expiresAt === undefined ||
      expiresAt === null ||
      flags === undefined ||
      contentBytes < 1 ||
      nicknameBytes > BoardWireConstants.NICKNAME_MAX_BYTES ||
      !isValidGeohashField(geohash) ||
      expiresAt <= createdAt ||
      expiresAt - createdAt > BoardWireConstants.MAX_LIFETIME_MS
    ) {
      return null;
    }
    return {
      kind: "post",
      post: {
        postID,
        geohash,
        content,
        authorSigningKey,
        authorNickname,
        createdAt,
        expiresAt,
        flags,
        signature,
      },
    };
  }

  if (kind === WireKind.TOMBSTONE) {
    if (deletedAt === undefined || deletedAt === null) return null;
    return {
      kind: "tombstone",
      tombstone: { postID, authorSigningKey, deletedAt, signature },
    };
  }

  return null;
}

// A fresh 16-byte random post ID.
export function newPostID(): Uint8Array {
  return crypto.getRandomValues(
    new Uint8Array(BoardWireConstants.POST_ID_LENGTH),
  );
}
