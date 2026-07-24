// Attachment wire format, byte-compatible with bitchat's BitchatFilePacket
// (BitchatFilePacket.swift / MimeType.swift / FileTransferLimits.swift).
//
// bitchat sends a whole file as ONE FILE_TRANSFER (0x22) packet whose payload is
// a TLV blob; the fragment layer (which we already match) splits it into 469-byte
// BLE fragments. There is no app-level chunking or JSON metadata. The canonical
// tags are fileName(0x01), fileSize(0x02), mimeType(0x03), content(0x04); we
// append two Airhop-only tags (channel 0x05, duration 0x06) that bitchat skips as
// unknown, so our multi-channel routing and voice-note durations survive without
// breaking bitchat parsing.

// ---- Limits (bitchat FileTransferLimits) ------------------------------------

export const MAX_FILE_BYTES = 1 * 1024 * 1024; // 1 MiB, absolute ceiling
export const MAX_VOICE_BYTES = 512 * 1024; // 512 KiB
export const MAX_IMAGE_BYTES = 512 * 1024; // 512 KiB

// Worst-case reassembled frame: the 1 MiB payload plus the TLV metadata (max
// fileName + mimeType) and the binary packet envelope. Mirrors bitchat's
// FileTransferLimits.maxFramedFileBytes so the fragment reassembler and packet
// decoder accept the largest file a bitchat peer can send.
export const MAX_FRAMED_FILE_BYTES =
  MAX_FILE_BYTES + 0xffff * 2 + 18 + (16 + 8 + 8 + 64);

// ---- MIME allow-list (bitchat MimeType.allowed, plus video for Airhop) ------

// bitchat rejects video; Airhop supports it as an add-on. Video only renders
// Airhop-to-Airhop (a bitchat peer will drop a video MIME), which is acceptable
// since bitchat has no video feature to break.
const BITCHAT_ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "audio/mp4",
  "audio/m4a",
  "audio/aac",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "application/pdf",
  "application/octet-stream",
]);

export function isAllowedMime(mime: string | undefined): boolean {
  if (mime === undefined) return true; // treated as octet-stream
  const m = mime.toLowerCase();
  return BITCHAT_ALLOWED_MIME.has(m) || m.startsWith("video/");
}

// Validate a file's leading bytes against its declared MIME type (bitchat
// MimeType.matches). octet-stream, video, and unknown types skip validation
// (bitchat is lenient for m4a too). Guards against a peer mislabeling content.
export function mimeMatchesMagic(
  mime: string | undefined,
  data: Uint8Array,
): boolean {
  if (data.length === 0) return false;
  if (mime === undefined) return true;
  const m = mime.toLowerCase();
  const at = (i: number): number => data[i] ?? -1;
  switch (m) {
    case "image/jpeg":
    case "image/jpg":
      return (
        data.length >= 3 && at(0) === 0xff && at(1) === 0xd8 && at(2) === 0xff
      );
    case "image/png":
      return (
        data.length >= 8 &&
        at(0) === 0x89 &&
        at(1) === 0x50 &&
        at(2) === 0x4e &&
        at(3) === 0x47 &&
        at(4) === 0x0d &&
        at(5) === 0x0a &&
        at(6) === 0x1a &&
        at(7) === 0x0a
      );
    case "image/gif":
      return (
        data.length >= 6 &&
        at(0) === 0x47 &&
        at(1) === 0x49 &&
        at(2) === 0x46 &&
        at(3) === 0x38 &&
        (at(4) === 0x37 || at(4) === 0x39) &&
        at(5) === 0x61
      );
    case "image/webp":
      return (
        data.length >= 12 &&
        at(0) === 0x52 &&
        at(1) === 0x49 &&
        at(2) === 0x46 &&
        at(3) === 0x46 &&
        at(8) === 0x57 &&
        at(9) === 0x45 &&
        at(10) === 0x42 &&
        at(11) === 0x50
      );
    case "audio/mp4":
    case "audio/m4a":
    case "audio/aac":
      // Recorder output varies by platform; bitchat is lenient (size-capped).
      return data.length > 100;
    case "audio/mpeg":
    case "audio/mp3":
      if (
        data.length >= 3 &&
        at(0) === 0x49 &&
        at(1) === 0x44 &&
        at(2) === 0x33
      )
        return true; // ID3
      return data.length >= 2 && at(0) === 0xff && (at(1) & 0xe0) === 0xe0;
    case "audio/wav":
    case "audio/x-wav":
      return (
        data.length >= 12 &&
        at(0) === 0x52 &&
        at(1) === 0x49 &&
        at(2) === 0x46 &&
        at(3) === 0x46 &&
        at(8) === 0x57 &&
        at(9) === 0x41 &&
        at(10) === 0x56 &&
        at(11) === 0x45
      );
    case "audio/ogg":
      return (
        data.length >= 4 &&
        at(0) === 0x4f &&
        at(1) === 0x67 &&
        at(2) === 0x67 &&
        at(3) === 0x53
      );
    case "application/pdf":
      return (
        data.length >= 4 &&
        at(0) === 0x25 &&
        at(1) === 0x50 &&
        at(2) === 0x44 &&
        at(3) === 0x46
      );
    case "application/octet-stream":
      return true;
    default:
      // Video and anything else: no signature check (Airhop extension).
      return true;
  }
}

// Attachment kind derived from the MIME type, since bitchat's packet carries no
// explicit type field.
export function typeFromMime(
  mime: string | undefined,
): "image" | "voice" | "video" | "document" {
  const m = (mime ?? "").toLowerCase();
  if (m.startsWith("image/")) return "image";
  if (m.startsWith("audio/")) return "voice";
  if (m.startsWith("video/")) return "video";
  return "document";
}

// ---- TLV encode/decode ------------------------------------------------------

const TLV_FILENAME = 0x01;
const TLV_FILESIZE = 0x02;
const TLV_MIMETYPE = 0x03;
const TLV_CONTENT = 0x04;
const TLV_CHANNEL = 0x05; // Airhop extension (bitchat skips it)
const TLV_DURATION = 0x06; // Airhop extension: voice-note duration ms

export interface FilePacket {
  fileName?: string;
  mimeType?: string;
  content: Uint8Array;
  channel?: string; // Airhop routing (bitchat ignores)
  durationMs?: number; // Airhop voice duration (bitchat ignores)
}

function u16(n: number): [number, number] {
  return [(n >> 8) & 0xff, n & 0xff];
}
function u32(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

// Encode a FilePacket to the bitchat TLV blob. Returns null when the content is
// empty or exceeds the 1 MiB ceiling.
export function encodeFilePacket(p: FilePacket): Uint8Array | null {
  if (p.content.length === 0 || p.content.length > MAX_FILE_BYTES) return null;
  const enc = new TextEncoder();
  const out: number[] = [];

  if (p.fileName !== undefined) {
    const b = enc.encode(p.fileName);
    if (b.length <= 0xffff) {
      out.push(TLV_FILENAME, ...u16(b.length), ...b);
    }
  }
  // fileSize: u16 length = 4, then u32 value (bitchat canonical).
  out.push(TLV_FILESIZE, ...u16(4), ...u32(p.content.length));
  if (p.mimeType !== undefined) {
    const b = enc.encode(p.mimeType);
    if (b.length <= 0xffff) {
      out.push(TLV_MIMETYPE, ...u16(b.length), ...b);
    }
  }
  // Airhop extensions (bitchat skips these as unknown TLVs, reading their u16
  // length): channel and duration. Placed before content, which bitchat expects
  // last with a u32 length.
  if (p.channel !== undefined) {
    const b = enc.encode(p.channel);
    if (b.length <= 0xffff) {
      out.push(TLV_CHANNEL, ...u16(b.length), ...b);
    }
  }
  if (p.durationMs !== undefined && p.durationMs > 0) {
    out.push(TLV_DURATION, ...u16(4), ...u32(p.durationMs));
  }
  // content: u32 length (bitchat canonical), then bytes.
  out.push(TLV_CONTENT, ...u32(p.content.length), ...p.content);
  return new Uint8Array(out);
}

// Decode a bitchat TLV blob. Tolerates bitchat's legacy encodings (fileSize
// len 8, content len 2). Returns null when malformed or over the size cap.
export function decodeFilePacket(data: Uint8Array): FilePacket | null {
  let off = 0;
  let fileName: string | undefined;
  let mimeType: string | undefined;
  let channel: string | undefined;
  let durationMs: number | undefined;
  const contentParts: Uint8Array[] = [];
  let contentLen = 0;
  const dec = new TextDecoder();

  const readLen = (bytes: number): number | null => {
    if (off + bytes > data.length) return null;
    let v = 0;
    for (let i = 0; i < bytes; i++) v = v * 256 + data[off++];
    return v;
  };

  while (off < data.length) {
    const type = data[off++];
    let len: number | null;
    if (type === TLV_CONTENT) {
      // canonical u32, fall back to legacy u16
      const snap = off;
      const canonical = readLen(4);
      if (canonical !== null && off + canonical <= data.length) {
        len = canonical;
      } else {
        off = snap;
        len = readLen(2);
      }
    } else {
      len = readLen(2);
    }
    if (len === null || len < 0 || off + len > data.length) return null;
    const value = data.slice(off, off + len);
    off += len;

    switch (type) {
      case TLV_FILENAME:
        fileName = dec.decode(value);
        break;
      case TLV_FILESIZE:
        // value is the declared size; we trust the content bytes themselves.
        break;
      case TLV_MIMETYPE:
        mimeType = dec.decode(value);
        break;
      case TLV_CHANNEL:
        channel = dec.decode(value);
        break;
      case TLV_DURATION:
        if (len === 4) {
          durationMs =
            (value[0] << 24) | (value[1] << 16) | (value[2] << 8) | value[3];
        }
        break;
      case TLV_CONTENT:
        contentLen += value.length;
        if (contentLen > MAX_FILE_BYTES) return null;
        contentParts.push(value);
        break;
      default:
        break; // skip unknown tags
    }
  }

  if (contentLen === 0) return null;
  const content = new Uint8Array(contentLen);
  let o = 0;
  for (const part of contentParts) {
    content.set(part, o);
    o += part.length;
  }
  return { fileName, mimeType, content, channel, durationMs };
}
