// Payload compression, byte-identical to bitchat's CompressionUtil (iOS
// CompressionUtil.swift / Android CompressionUtil.kt).
//
// bitchat auto-compresses packet payloads with RAW DEFLATE (RFC 1951, no zlib
// header) and stores the original size so the receiver can restore it. iOS uses
// Apple's COMPRESSION_ZLIB and Android uses java.util.zip.Deflater with
// DEFAULT_COMPRESSION (level 6) + nowrap=true; both are reference zlib, and the
// two interoperate.
//
// Our compressed bytes must match theirs byte for byte. Both sides sign the
// re-encoded packet (packet-codec signingBytes / bitchat
// toBinaryDataForSigning) and the VERIFY path re-encodes too, so verification
// re-compresses. A different encoder means a different signing blob and a
// signature that will not verify, even though the payload is identical.
//
// Deflate output is not canonical: any conforming encoder produces a valid
// stream, but not the same bytes. pako's original hash does NOT match reference
// zlib. pako 2.2.0 added the ANZAC++ hash, which does, behind `legacyHash`.
// pako 3 defaults that option to false, which is what we want, but we set it
// explicitly so parity does not ride on a default.

import { deflateRaw, Inflate } from "pako";

// Don't compress below this size (bitchat Constants.compressionThresholdBytes).
export const COMPRESSION_THRESHOLD = 100;

// Largest payload we will accept, either declared on the wire or produced by
// decompressing. Matches bitchat's AppConstants.Protocol.MAX_PAYLOAD_LENGTH
// (10 MiB); the decoder imports it so one number bounds both.
//
// It lives here rather than in packet-codec because decompress() has to enforce
// it too, and packet-codec already imports this module.
export const MAX_PAYLOAD_BYTES = 10 * 1024 * 1024;

// zlib DEFAULT_COMPRESSION, the level Android passes and iOS's COMPRESSION_ZLIB
// matches. Do not change: it would break signature parity with bitchat.
const COMPRESSION_LEVEL = 6;

// legacyHash: false selects the zlib-compatible hash. Do not change: it is what
// makes our output byte-identical to bitchat's, and signatures depend on it.
const DEFLATE_OPTIONS: NonNullable<Parameters<typeof deflateRaw>[1]> = {
  level: COMPRESSION_LEVEL,
  legacyHash: false,
};

// Whether compressing is worthwhile: large enough, and not already high-entropy
// (already-compressed / encrypted data barely shrinks). Mirrors bitchat's
// unique-byte-ratio heuristic exactly so both sides make the same decision.
export function shouldCompress(data: Uint8Array): boolean {
  if (data.length < COMPRESSION_THRESHOLD) return false;
  const unique = new Set(data).size;
  const sampleSize = Math.min(data.length, 256);
  return unique / sampleSize < 0.9;
}

// Compress with raw DEFLATE. Returns null when the input is too small or the
// result is not smaller than the input (bitchat: compressedSize < data.count).
export function compress(data: Uint8Array): Uint8Array | null {
  if (data.length < COMPRESSION_THRESHOLD) return null;
  try {
    const out = deflateRaw(data, DEFLATE_OPTIONS);
    if (out.length > 0 && out.length < data.length) return out;
    return null;
  } catch {
    return null;
  }
}

// Decompress raw DEFLATE. Returns null on failure, overflow or size mismatch.
//
// `originalSize` is a number the SENDER put on the wire, so it is a claim, not a
// fact. The output is therefore capped at that claim while inflating rather than
// measured afterwards: a packet can declare 100 bytes and carry a stream that
// expands to a gigabyte, and inflating it whole before noticing is an
// out-of-memory crash that any unauthenticated peer in radio range can trigger.
//
// Both bitchat clients bound the output the same way. iOS inflates into a buffer
// allocated at exactly `originalSize`, so the decoder physically cannot write
// past it. Android does the same and then asks the inflater for one more byte;
// producing one proves the declared size was a lie. Streaming and stopping at
// the first byte over the limit is that check, applied continuously.
//
// Nothing legitimate is affected. A valid stream inflates to exactly
// `originalSize`, and anything else was already refused by the size comparison
// this replaces. The only change is that the refusal now happens before the
// memory is spent instead of after.
export function decompress(
  compressed: Uint8Array,
  originalSize: number,
): Uint8Array | null {
  if (compressed.length === 0) return null;
  if (originalSize <= 0 || originalSize > MAX_PAYLOAD_BYTES) return null;

  const inflator = new Inflate({ raw: true });
  const parts: Uint8Array[] = [];
  let produced = 0;

  // pako hands each output chunk here and does not guard the call, so throwing
  // aborts the inflate loop instead of letting it run the bomb to completion.
  // Every throw is caught below and reported as a refusal, which keeps this
  // function's "never throws" contract.
  inflator.onData = (chunk: unknown): void => {
    const bytes = chunk as Uint8Array;
    produced += bytes.length;
    if (produced > originalSize) throw new Error("decompress: overflow");
    parts.push(bytes);
  };

  try {
    inflator.push(compressed, true);
  } catch {
    return null;
  }

  // err covers a corrupt stream and a truncated one (pako reports a stream that
  // ends before its terminating marker as Z_BUF_ERROR rather than succeeding
  // with partial output).
  if (inflator.err) return null;
  if (produced !== originalSize) return null;

  const out = new Uint8Array(originalSize);
  let off = 0;
  for (const part of parts) {
    out.set(part, off);
    off += part.length;
  }
  return out;
}
