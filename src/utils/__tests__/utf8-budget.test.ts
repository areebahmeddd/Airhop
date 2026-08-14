/**
 * @jest-environment node
 */
// The composer measures its budget in UTF-8 bytes because the wire does. Every
// test here is a case where counting characters instead would be wrong, and
// wrong in the direction that loses a message: a DM that overruns its TLV
// encodes to null and is dropped on every transport with nothing shown at
// either end.

import {
  PRIVATE_MESSAGE_MAX_CONTENT_BYTES,
  encodePrivateMessagePacket,
} from "@core/mesh/wire/noise-payload";
import { truncateToUtf8Bytes, utf8ByteLength } from "../utf8-budget";

describe("utf8ByteLength", () => {
  it("counts bytes, not characters", () => {
    expect(utf8ByteLength("hello")).toBe(5);
    // A single character that costs two bytes.
    expect(utf8ByteLength("é")).toBe(2);
    // One grapheme, one code point, four bytes — and two UTF-16 units, which
    // is what `String.length` and TextInput's maxLength would have counted.
    expect(utf8ByteLength("😀")).toBe(4);
    expect("😀".length).toBe(2);
  });
});

describe("truncateToUtf8Bytes", () => {
  it("leaves text that already fits untouched", () => {
    expect(truncateToUtf8Bytes("hello", 255)).toBe("hello");
  });

  it("never returns more bytes than the budget", () => {
    const text = "😀".repeat(100); // 400 bytes
    const fitted = truncateToUtf8Bytes(text, 255);
    expect(utf8ByteLength(fitted)).toBeLessThanOrEqual(255);
  });

  it("cuts on a code point boundary, never mid-character", () => {
    // 255 is not a multiple of 4, so a naive byte slice would split the last
    // emoji and emit a lone surrogate half that renders as a replacement
    // character on the far side.
    const fitted = truncateToUtf8Bytes("😀".repeat(100), 255);
    expect(utf8ByteLength(fitted)).toBe(252); // 63 whole emoji
    expect(fitted).not.toContain("�");
    expect([...fitted].every((c) => c === "😀")).toBe(true);
  });

  it("keeps as much as fits rather than dropping to the last safe word", () => {
    expect(truncateToUtf8Bytes("abcdef", 3)).toBe("abc");
  });

  it("returns empty when a single code point cannot fit", () => {
    expect(truncateToUtf8Bytes("😀", 3)).toBe("");
  });
});

describe("the budget matches what the wire actually accepts", () => {
  // The point of the exercise: whatever the composer allows must encode. If the
  // constant and the encoder ever disagree, this fails rather than shipping a
  // composer that accepts text the transport silently drops.
  const encode = (text: string): Uint8Array | null =>
    encodePrivateMessagePacket("m-1", text);

  it("accepts text clamped to the budget, in ASCII and in emoji", () => {
    for (const raw of ["a".repeat(400), "😀".repeat(200), "é".repeat(300)]) {
      const fitted = truncateToUtf8Bytes(
        raw,
        PRIVATE_MESSAGE_MAX_CONTENT_BYTES,
      );
      expect(encode(fitted)).not.toBeNull();
    }
  });

  it("refuses one byte past the budget (the failure being prevented)", () => {
    expect(
      encode("a".repeat(PRIVATE_MESSAGE_MAX_CONTENT_BYTES)),
    ).not.toBeNull();
    expect(
      encode("a".repeat(PRIVATE_MESSAGE_MAX_CONTENT_BYTES + 1)),
    ).toBeNull();
    // And the character-count trap: 64 emoji is only 64 characters but 256
    // bytes, so a composer capped at 255 characters would have let this through.
    expect("😀".repeat(64).length).toBeLessThan(
      PRIVATE_MESSAGE_MAX_CONTENT_BYTES,
    );
    expect(encode("😀".repeat(64))).toBeNull();
  });
});
