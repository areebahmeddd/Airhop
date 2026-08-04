// Base64 and base64url, in one place.
//
// These had grown into twelve separate implementations across the app: five
// encoders, five decoders, and three base64url variants, each written where it
// was needed. They were not equivalent, which is the reason this file exists
// rather than a tidiness argument:
//
//   * base64url decoding re-padded the input in two places and not in the
//     third, so the same string could decode in a Nostr envelope and fail in a
//     private-channel key.
//   * base64 decoding threw on malformed input in four places and returned null
//     in the fifth, so a caller's error handling depended on which copy it
//     happened to reach.
//   * one encoder hand-rolled the alphabet to avoid `btoa`, a caution the rest
//     of the codebase had already dropped.
//
// Several of these sit directly on crypto paths (contact cards, channel keys,
// Nostr envelopes, courier drops), where a padding disagreement reads as a
// decryption failure and gets diagnosed as a network problem.
//
// Both error behaviours are kept and named, so no call site changes meaning by
// being migrated: `*ToBytes` throws on malformed input, `try*ToBytes` returns
// null. Pick the one the caller already expected.
//
// Nothing here touches the wire format. Base64 is how bytes cross the native
// bridge and how text-only transports carry binary; the packet encoder works in
// bytes throughout.

// Standard base64 (RFC 4648 section 4), padded.
export function bytesToBase64(bytes: Uint8Array): string {
  // Built one character at a time rather than with a spread into
  // String.fromCharCode: an attachment is up to a megabyte, and spreading an
  // array that size overflows the call stack on both engines.
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

// Standard base64 to bytes. Throws on malformed input.
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

// Standard base64 to bytes, or null when the input is not valid base64.
export function tryBase64ToBytes(base64: string): Uint8Array | null {
  try {
    return base64ToBytes(base64);
  } catch {
    return null;
  }
}

// base64url (RFC 4648 section 5): "+/" become "-_" and padding is dropped, so
// the result is safe in a URL, a QR payload and a deep link without escaping.
export function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// base64url to bytes. Throws on malformed input.
//
// Padding is restored before decoding. Unpadded input is the normal case here,
// since the encoder above strips it, and an engine is not obliged to accept it:
// the one copy of this that skipped the re-pad was a decode failure waiting for
// the right input length.
export function base64UrlToBytes(base64url: string): Uint8Array {
  let b64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) b64 += "=";
  return base64ToBytes(b64);
}

// base64url to bytes, or null when the input is not valid base64url.
export function tryBase64UrlToBytes(base64url: string): Uint8Array | null {
  try {
    return base64UrlToBytes(base64url);
  } catch {
    return null;
  }
}
