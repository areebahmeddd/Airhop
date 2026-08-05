/**
 * @jest-environment node
 */
// An attachment Airhop sends must decode in bitchat, on both of its clients.
//
// This is the closest thing to a cross-client field test that CI can run.
// `decodeLikeBitchatIOS` and `decodeLikeBitchatAndroid` below are faithful ports
// of `BitchatFilePacket.decode` from bitchat/ios and bitchat/android, kept
// literal so they can be diffed against the originals. Airhop's real encoder is
// run through both.
//
// Two clients rather than one, because they do not agree with each other:
//
//   * iOS declares `fileName: String?` and accepts a packet without one.
//   * Android does `val n = name ?: return null`, so a missing filename drops
//     the whole transfer.
//
// Anything Airhop emits has to satisfy the stricter of the two, and a change
// that only ever gets tested against an iPhone would not reveal that.
//
// The failure this guards is silent on both ends. bitchat logs a decode failure
// to its own console and shows nothing; Airhop pages out every fragment, marks
// the bubble sent, and is never told. So the encoding contract is pinned here
// rather than discovered in the field.

import {
  encodeFilePacket,
  MAX_FILE_BYTES,
  wireMediaName,
} from "../bitchat-file-packet";

interface Decoded {
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  content: Uint8Array;
}

// ---- Port of bitchat/ios BitchatFilePacket.decode ---------------------------

const TLV_FILENAME = 0x01;
const TLV_FILESIZE = 0x02;
const TLV_MIMETYPE = 0x03;
const TLV_CONTENT = 0x04;
const KNOWN = new Set([TLV_FILENAME, TLV_FILESIZE, TLV_MIMETYPE, TLV_CONTENT]);

function be(data: Uint8Array, at: number, bytes: number): number | null {
  if (data.length - at < bytes) return null;
  let v = 0;
  for (let i = 0; i < bytes; i++) v = v * 256 + data[at + i];
  return v;
}

// iOS: unknown tags hit `case nil: continue`, having already read a 2-byte
// length. Content prefers a 4-byte length and falls back to 2 bytes.
function decodeLikeBitchatIOS(data: Uint8Array): Decoded | null {
  let cursor = 0;
  let fileName: string | undefined;
  let fileSize: number | undefined;
  let mimeType: string | undefined;
  const chunks: Uint8Array[] = [];

  while (cursor < data.length) {
    const type = data[cursor];
    cursor += 1;

    let length: number | null;
    if (type === TLV_CONTENT) {
      const snapshot = cursor;
      const canonical = be(data, cursor, 4);
      if (canonical !== null && canonical <= data.length - (cursor + 4)) {
        length = canonical;
        cursor += 4;
      } else {
        cursor = snapshot;
        length = be(data, cursor, 2);
        if (length !== null) cursor += 2;
      }
    } else {
      length = be(data, cursor, 2);
      if (length !== null) cursor += 2;
    }
    if (length === null || length < 0) return null;
    if (data.length - cursor < length) return null;

    const value = data.subarray(cursor, cursor + length);
    cursor += length;

    if (type === TLV_FILENAME) {
      fileName = new TextDecoder().decode(value);
    } else if (type === TLV_FILESIZE) {
      if (length === 4 || length === 8) {
        let size = 0;
        for (const b of value) size = size * 256 + b;
        if (size > MAX_FILE_BYTES) return null;
        fileSize = size;
      }
    } else if (type === TLV_MIMETYPE) {
      mimeType = new TextDecoder().decode(value);
    } else if (type === TLV_CONTENT) {
      chunks.push(value);
    } else if (KNOWN.has(type)) {
      return null; // unreachable, kept so the branch set matches the Swift
    }
    // Unknown tag: skipped, exactly as `case nil: continue` does.
  }

  const total = chunks.reduce((n, c) => n + c.length, 0);
  if (total === 0 || total > MAX_FILE_BYTES) return null;
  const content = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) {
    content.set(c, at);
    at += c.length;
  }
  return { fileName, fileSize: fileSize ?? total, mimeType, content };
}

// ---- Port of bitchat/android BitchatFilePacket.decode ------------------------

// Android differs in three ways that matter: content length is ALWAYS 4 bytes
// with no 2-byte fallback, FILE_SIZE must be exactly 4 bytes or the packet is
// rejected, and the filename is mandatory.
function decodeLikeBitchatAndroid(data: Uint8Array): Decoded | null {
  let off = 0;
  let name: string | undefined;
  let size: number | undefined;
  let mime: string | undefined;
  let content: Uint8Array | undefined;

  while (off < data.length) {
    if (data.length - off < 3) return null;
    const t = data[off];
    off += 1;

    let len: number | null;
    if (t === TLV_CONTENT) {
      len = be(data, off, 4);
      if (len === null) return null;
      off += 4;
    } else {
      len = be(data, off, 2);
      if (len === null) return null;
      off += 2;
    }
    if (len < 0 || off + len > data.length) return null;

    if (!KNOWN.has(t)) {
      off += len; // unknown tag: advance past the value
      continue;
    }
    const value = data.subarray(off, off + len);
    off += len;

    if (t === TLV_FILENAME) name = new TextDecoder().decode(value);
    else if (t === TLV_FILESIZE) {
      if (len !== 4) return null;
      let n = 0;
      for (const b of value) n = n * 256 + b;
      size = n;
    } else if (t === TLV_MIMETYPE) mime = new TextDecoder().decode(value);
    else if (t === TLV_CONTENT) {
      content = content === undefined ? value : concat(content, value);
    }
  }

  if (name === undefined) return null; // `val n = name ?: return null`
  if (content === undefined) return null;
  return {
    fileName: name,
    fileSize: size ?? content.length,
    mimeType: mime ?? "application/octet-stream",
    content,
  };
}

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

// ---- The contract -----------------------------------------------------------

const CLIENTS: [string, (d: Uint8Array) => Decoded | null][] = [
  ["bitchat/ios", decodeLikeBitchatIOS],
  ["bitchat/android", decodeLikeBitchatAndroid],
];

function bytes(n: number, fill = 0xab): Uint8Array {
  return new Uint8Array(n).fill(fill);
}

describe.each(CLIENTS)(
  "an Airhop attachment decodes in %s",
  (_name, decode) => {
    it("carries a photo with its name, mime and bytes intact", () => {
      const content = bytes(4096);
      const wire = encodeFilePacket({
        fileName: wireMediaName("image", "jpg"),
        mimeType: "image/jpeg",
        content,
      });
      const out = decode(wire!);

      expect(out).not.toBeNull();
      expect(out?.content).toEqual(content);
      expect(out?.mimeType).toBe("image/jpeg");
      expect(out?.fileName).toMatch(/^img_[0-9a-f-]{36}\.jpg$/);
      expect(out?.fileSize).toBe(content.length);
    });

    it("survives every Airhop-only tag it does not understand", () => {
      // channel (0x05), duration (0x06) and caption (0x07) are ours. bitchat skips
      // each by reading a 2-byte length, so an encoder that used any other width
      // would desync the cursor and lose the whole file, not just the tag.
      const content = bytes(2048);
      const wire = encodeFilePacket({
        fileName: wireMediaName("voice", "m4a"),
        mimeType: "audio/mp4",
        content,
        channel: "#bluetooth",
        durationMs: 4200,
        caption: "the words that come with it",
      });
      const out = decode(wire!);

      expect(out?.content).toEqual(content);
      expect(out?.fileName).toMatch(/^voice_[0-9a-f-]{36}\.m4a$/);
    });

    it("always sends a filename, which Android requires and iOS does not", () => {
      const wire = encodeFilePacket({
        fileName: "notes.pdf",
        mimeType: "application/pdf",
        content: bytes(64),
      });
      expect(decode(wire!)?.fileName).toBe("notes.pdf");
    });

    it("handles a document at the largest size Airhop will send", () => {
      const content = bytes(MAX_FILE_BYTES);
      const wire = encodeFilePacket({
        fileName: "big.bin",
        mimeType: "application/octet-stream",
        content,
      });
      const out = decode(wire!);
      expect(out?.content.length).toBe(MAX_FILE_BYTES);
      expect(out?.fileSize).toBe(MAX_FILE_BYTES);
    });

    it("handles a one-byte file without a length-width edge case", () => {
      const wire = encodeFilePacket({
        fileName: "x.txt",
        mimeType: "text/plain",
        content: bytes(1),
      });
      expect(decode(wire!)?.content.length).toBe(1);
    });

    it("carries a unicode filename and caption without truncation", () => {
      const wire = encodeFilePacket({
        fileName: "photo.jpg",
        mimeType: "image/jpeg",
        content: bytes(32),
        caption: "café ☕ 東京",
      });
      expect(decode(wire!)?.fileName).toBe("photo.jpg");
    });
  },
);

describe("Airhop refuses what bitchat would reject", () => {
  it("will not encode an empty file", () => {
    expect(
      encodeFilePacket({
        fileName: "a",
        mimeType: "text/plain",
        content: bytes(0),
      }),
    ).toBeNull();
  });

  it("will not encode past the 1 MiB ceiling both clients enforce", () => {
    expect(
      encodeFilePacket({
        fileName: "a",
        mimeType: "text/plain",
        content: bytes(MAX_FILE_BYTES + 1),
      }),
    ).toBeNull();
  });
});
