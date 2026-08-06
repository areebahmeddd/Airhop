// Fitting text to a wire budget measured in UTF-8 bytes.
//
// Wire lengths are byte counts; `TextInput`'s `maxLength` is a UTF-16 unit
// count. They disagree on anything but ASCII, and by a lot: one emoji is one
// grapheme, two UTF-16 units, four UTF-8 bytes. So `maxLength={255}` over a
// 255-BYTE envelope admits 255 emoji, four times too large, which then fails to
// encode with nothing shown to either side.
//
// Truncation drops whole code points rather than slicing, since a raw `.slice()`
// can split a surrogate pair and emit a lone half that decodes to a replacement
// character. Same rule as `fitNickname` in announce-manager.ts, which fits the
// 32-byte nickname TLV.

const encoder = new TextEncoder();

// Length of `text` in UTF-8 bytes.
export function utf8ByteLength(text: string): number {
  return encoder.encode(text).length;
}

// The longest prefix of `text` that fits `maxBytes` of UTF-8, cut on a code
// point boundary. Returns `text` unchanged when it already fits, so the common
// path allocates nothing beyond the measurement.
export function truncateToUtf8Bytes(text: string, maxBytes: number): string {
  if (utf8ByteLength(text) <= maxBytes) return text;
  const codePoints = [...text];
  // Walk back a code point at a time rather than binary-searching: a composer
  // clamp only ever runs one or two points past the budget, because it is
  // applied on every keystroke.
  while (codePoints.length > 0) {
    codePoints.pop();
    const candidate = codePoints.join("");
    if (utf8ByteLength(candidate) <= maxBytes) return candidate;
  }
  return "";
}
