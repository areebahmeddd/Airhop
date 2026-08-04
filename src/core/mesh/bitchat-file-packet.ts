// Attachment wire format, byte-compatible with bitchat's BitchatFilePacket
// (BitchatFilePacket.swift / MimeType.swift / FileTransferLimits.swift).
//
// bitchat sends a whole file as ONE FILE_TRANSFER (0x22) packet whose payload is
// a TLV blob; the fragment layer (which we already match) splits it into frames
// that fit one BLE write. There is no app-level chunking or JSON metadata. The canonical
// tags are fileName(0x01), fileSize(0x02), mimeType(0x03), content(0x04); we
// append two Airhop-only tags (channel 0x05, duration 0x06) that bitchat skips as
// unknown, so our multi-channel routing and voice-note durations survive without
// breaking bitchat parsing.

// ---- Limits (bitchat FileTransferLimits) ------------------------------------

export const MAX_FILE_BYTES = 1 * 1024 * 1024; // 1 MiB, absolute ceiling
export const MAX_VOICE_BYTES = 512 * 1024; // 512 KiB
export const MAX_IMAGE_BYTES = 512 * 1024; // 512 KiB

// What Airhop puts on the air for a photo, as opposed to the ceiling above,
// which is what it will ACCEPT. The two differ because of a receiver-side limit
// on the other client.
//
// bitchat expires a half-built assembly 30 seconds after the FIRST fragment
// arrives, not 30 seconds after the last: BLEFragmentAssemblyBuffer stamps its
// `timestamp` once at startAssemblyIfNeeded and never refreshes it. At the ~20ms
// pacing both clients use, 512 KiB is around 1,120 frames and 22 seconds, so a
// photo at the ceiling only landed if the link never made us retry a single
// frame. 256 KiB is about 11 seconds, which leaves room for the backoff a busy
// link forces. bitchat's own photos are 45 KB at a 448px edge, so this stays
// generous by comparison, and Airhop-to-Airhop is unaffected either way: our own
// reassembly times out on idle, not on total duration.
export const MAX_SENT_IMAGE_BYTES = 256 * 1024; // 256 KiB

// The largest transfer that reliably completes inside bitchat's 30-second
// assembly window, with room for the retries a busy link forces. At the ~20ms
// pacing both clients use and 467 data bytes per frame, this is about 15 seconds.
//
// Not a cap: Airhop-to-Airhop happily carries the full MAX_FILE_BYTES, because
// our own reassembly times out on idle rather than on total duration. It is the
// line past which sending to a BITCHAT peer is worth warning about, since above
// it the file is dropped on arrival and we would otherwise show a sent tick.
export const MAX_BITCHAT_TRANSFER_BYTES = 350 * 1024; // 350 KiB

// Worst-case reassembled frame: the 1 MiB payload plus the TLV metadata (max
// fileName + mimeType) and the binary packet envelope. Mirrors bitchat's
// FileTransferLimits.maxFramedFileBytes so the fragment reassembler and packet
// decoder accept the largest file a bitchat peer can send.
export const MAX_FRAMED_FILE_BYTES =
  MAX_FILE_BYTES + 0xffff * 2 + 18 + (16 + 8 + 8 + 64);

// ---- Wire file names --------------------------------------------------------

// bitchat derives a stable message ID for private media from the file name, and
// only for two exact shapes: `img_<UUID>.jpg` and `voice_<UUID>.m4a` (it also
// accepts a 16-hex-digit voice token). Anything else, including the plain
// "photo.jpg" Airhop used to send, makes BitchatFilePacket.stableID return nil,
// which drops the whole transfer onto bitchat's legacy path: no delivery
// receipt, no arrival dedup, and repeat arrivals stacking up as "name (1)",
// "name (2)". The name is not what a person reads for a photo or a voice note
// (both render as media, never as a file row), so matching bitchat's shape costs
// nothing and buys the receipts.
export function wireMediaName(
  kind: "image" | "voice",
  extension: "jpg" | "m4a",
): string {
  return `${kind === "image" ? "img" : "voice"}_${uuidV4()}.${extension}`;
}

// RFC 4122 version 4, from the platform CSPRNG. `Math.random` is banned in this
// codebase and would be wrong here anyway: two photos naming the same id would
// collide in bitchat's dedup and the second would be discarded as a duplicate.
function uuidV4(): string {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40; // version 4
  b[8] = (b[8] & 0x3f) | 0x80; // RFC 4122 variant
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// ---- MIME allow-list (bitchat MimeType.allowed, plus video for Airhop) ------

// bitchat accepts every one of these, including video, but only renders images
// and voice notes: MimeType resolves an unrecognised type through
// application/octet-stream (whose UTType is public.data, which everything
// conforms to), and BitchatMessage.mediaKind only surfaces .image and .voice.
// So a video or a document reaches a bitchat peer and lands as a plain
// "[file] name.ext" line it cannot open. Airhop renders both properly, and there
// is no bitchat feature to break either way.
const BITCHAT_ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "audio/mp4",
  "audio/m4a",
  // Receive-side leniency, not something we send: Android recorders and older
  // Airhop builds label AAC-in-MP4 this way. bitchat would reject it, so we
  // send the canonical audio/mp4 (see resolveMimeType) and accept both.
  "audio/x-m4a",
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
export type AttachmentKind = "image" | "voice" | "video" | "document";

export function typeFromMime(mime: string | undefined): AttachmentKind {
  const m = (mime ?? "").toLowerCase();
  if (m.startsWith("image/")) return "image";
  if (m.startsWith("audio/")) return "voice";
  if (m.startsWith("video/")) return "video";
  return "document";
}

// Last-resort MIME by file extension, for the pickers that hand back a file
// with no type at all.
const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  m4a: "audio/mp4",
  aac: "audio/aac",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  pdf: "application/pdf",
  mp4: "video/mp4",
  mov: "video/quicktime",
};

// The MIME type to put on the wire, which is never blank and never something
// the far side will refuse.
//
// This matters more than it looks. A receiver (ours and bitchat's alike) drops
// a file whose type is not on the allow-list, and an empty string is not on the
// allow-list, so a picker that returned no type produced an attachment that
// sent successfully, showed a full progress bar, and silently never arrived.
// Anything unrecognised becomes application/octet-stream, which bitchat accepts
// and renders as a document, so the file lands even when its type does not.
export function resolveMimeType(
  declared: string | undefined,
  fileName: string | undefined,
): string {
  const d = declared?.trim().toLowerCase();
  if (d !== undefined && d.length > 0 && isAllowedMime(d)) return d;
  const ext = fileName?.toLowerCase().split(".").pop() ?? "";
  return MIME_BY_EXTENSION[ext] ?? "application/octet-stream";
}

// bitchat caps photos and voice notes tighter than the 1 MiB ceiling it applies
// to files in general (FileTransferLimits). Sending past a cap is not a partial
// success: the peer refuses the whole file, so the check belongs before the
// first fragment goes out, not after.
export function maxBytesForType(type: AttachmentKind): number {
  if (type === "voice") return MAX_VOICE_BYTES;
  if (type === "image") return MAX_IMAGE_BYTES;
  return MAX_FILE_BYTES;
}

// ---- TLV encode/decode ------------------------------------------------------

const TLV_FILENAME = 0x01;
const TLV_FILESIZE = 0x02;
const TLV_MIMETYPE = 0x03;
const TLV_CONTENT = 0x04;
const TLV_CHANNEL = 0x05; // Airhop extension (bitchat skips it)
const TLV_DURATION = 0x06; // Airhop extension: voice-note duration ms
const TLV_CAPTION = 0x07; // Airhop extension: attachment caption text (bitchat skips it)

// A caption is chat text, not a document: keep it short so a huge string can't
// bloat the file frame. 512 bytes matches the board-post content cap.
const MAX_CAPTION_BYTES = 512;

export interface FilePacket {
  fileName?: string;
  mimeType?: string;
  content: Uint8Array;
  channel?: string; // Airhop routing (bitchat ignores)
  durationMs?: number; // Airhop voice duration (bitchat ignores)
  caption?: string; // Airhop attachment caption (bitchat ignores)
}

function u16(n: number): [number, number] {
  return [(n >> 8) & 0xff, n & 0xff];
}
function u32(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

// Encode a FilePacket to the bitchat TLV blob. Returns null when the content is
// empty or exceeds the 1 MiB ceiling.
//
// The metadata tags are built in a plain array and the file bytes are copied in
// with set(). That split is not stylistic: spreading the content into
// Array.push passes every byte as a separate function argument, which overflows
// the call stack somewhere in the tens of kilobytes. Every attachment past that
// size threw a RangeError from inside the encoder, well before the 1 MiB
// ceiling this function is supposed to be enforcing.
export function encodeFilePacket(p: FilePacket): Uint8Array | null {
  if (p.content.length === 0 || p.content.length > MAX_FILE_BYTES) return null;
  const enc = new TextEncoder();
  const head: number[] = [];

  if (p.fileName !== undefined) {
    const b = enc.encode(p.fileName);
    if (b.length <= 0xffff) {
      head.push(TLV_FILENAME, ...u16(b.length), ...b);
    }
  }
  // fileSize: u16 length = 4, then u32 value (bitchat canonical).
  head.push(TLV_FILESIZE, ...u16(4), ...u32(p.content.length));
  if (p.mimeType !== undefined) {
    const b = enc.encode(p.mimeType);
    if (b.length <= 0xffff) {
      head.push(TLV_MIMETYPE, ...u16(b.length), ...b);
    }
  }
  // Airhop extensions (bitchat skips these as unknown TLVs, reading their u16
  // length): channel and duration. Placed before content, which bitchat expects
  // last with a u32 length.
  if (p.channel !== undefined) {
    const b = enc.encode(p.channel);
    if (b.length <= 0xffff) {
      head.push(TLV_CHANNEL, ...u16(b.length), ...b);
    }
  }
  if (p.durationMs !== undefined && p.durationMs > 0) {
    head.push(TLV_DURATION, ...u16(4), ...u32(p.durationMs));
  }
  if (p.caption !== undefined && p.caption.length > 0) {
    const b = enc.encode(p.caption);
    if (b.length > 0 && b.length <= MAX_CAPTION_BYTES) {
      head.push(TLV_CAPTION, ...u16(b.length), ...b);
    }
  }
  // content: u32 length (bitchat canonical), then bytes.
  head.push(TLV_CONTENT, ...u32(p.content.length));

  const out = new Uint8Array(head.length + p.content.length);
  out.set(head, 0);
  out.set(p.content, head.length);
  return out;
}

// Decode a bitchat TLV blob. Tolerates bitchat's legacy encodings (fileSize
// len 8, content len 2). Returns null when malformed or over the size cap.
export function decodeFilePacket(data: Uint8Array): FilePacket | null {
  let off = 0;
  let fileName: string | undefined;
  let mimeType: string | undefined;
  let channel: string | undefined;
  let durationMs: number | undefined;
  let caption: string | undefined;
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
      case TLV_CAPTION:
        if (len <= MAX_CAPTION_BYTES) caption = dec.decode(value);
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
  return { fileName, mimeType, content, channel, durationMs, caption };
}
