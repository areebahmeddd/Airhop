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
// That option still defaults to true on 2.x for backwards compatibility, so we
// set it explicitly. pako 3 makes false the default.

import { deflateRaw, inflateRaw } from "pako";

// Don't compress below this size (bitchat Constants.compressionThresholdBytes).
export const COMPRESSION_THRESHOLD = 100;

// zlib DEFAULT_COMPRESSION, the level Android passes and iOS's COMPRESSION_ZLIB
// matches. Do not change: it would break signature parity with bitchat.
const COMPRESSION_LEVEL = 6;

// pako 2.2.0 added `legacyHash`, but @types/pako 2.0.4 predates it, so it is
// not in DeflateFunctionOptions yet. Derive the type from deflateRaw rather
// than casting, so the rest of the options stay checked.
type DeflateOptions = NonNullable<Parameters<typeof deflateRaw>[1]> & {
  legacyHash: boolean;
};

// legacyHash: false selects the zlib-compatible hash. Do not change: it is what
// makes our output byte-identical to bitchat's, and signatures depend on it.
const DEFLATE_OPTIONS: DeflateOptions = {
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

// Decompress raw DEFLATE. Returns null on failure or size mismatch.
export function decompress(
  compressed: Uint8Array,
  originalSize: number,
): Uint8Array | null {
  try {
    const out = inflateRaw(compressed);
    if (out.length !== originalSize) return null;
    return out;
  } catch {
    return null;
  }
}
