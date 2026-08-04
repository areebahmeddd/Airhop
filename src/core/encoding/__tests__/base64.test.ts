/**
 * @jest-environment node
 */
// Base64 and base64url. These pin the behaviours that differed between the
// twelve implementations this file replaced, because those differences were the
// reason to consolidate: a string that decoded in one place and failed in
// another is a decryption failure that reads as a network problem.
import {
  base64ToBytes,
  base64UrlToBytes,
  bytesToBase64,
  bytesToBase64Url,
  tryBase64ToBytes,
  tryBase64UrlToBytes,
} from "../base64";

const HELLO = new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]); // "hello"

describe("standard base64", () => {
  it("round-trips", () => {
    expect(base64ToBytes(bytesToBase64(HELLO))).toEqual(HELLO);
  });

  it("matches the known encoding", () => {
    expect(bytesToBase64(HELLO)).toBe("aGVsbG8=");
    expect(base64ToBytes("aGVsbG8=")).toEqual(HELLO);
  });

  it("handles an empty input", () => {
    expect(bytesToBase64(new Uint8Array(0))).toBe("");
    expect(base64ToBytes("")).toEqual(new Uint8Array(0));
  });

  // The high bytes are where a naive implementation using a signed char or a
  // sloppy mask goes wrong.
  it("round-trips every byte value", () => {
    const all = new Uint8Array(256);
    for (let i = 0; i < 256; i++) all[i] = i;
    expect(base64ToBytes(bytesToBase64(all))).toEqual(all);
  });

  it("round-trips each of the three padding lengths", () => {
    for (const n of [1, 2, 3, 4, 5, 6]) {
      const bytes = new Uint8Array(n).fill(0xab);
      expect(base64ToBytes(bytesToBase64(bytes))).toEqual(bytes);
    }
  });
});

describe("base64 error behaviour", () => {
  // Both behaviours existed in the code this replaced. Keeping them separate
  // and named is what let every call site migrate without changing meaning.
  it("base64ToBytes throws on malformed input", () => {
    expect(() => base64ToBytes("!!!!")).toThrow();
  });

  it("tryBase64ToBytes returns null instead", () => {
    expect(tryBase64ToBytes("!!!!")).toBeNull();
  });

  it("tryBase64ToBytes still decodes valid input", () => {
    expect(tryBase64ToBytes("aGVsbG8=")).toEqual(HELLO);
  });
});

describe("base64url", () => {
  // 0xFB 0xFF produce "+/" in standard base64, which is exactly what base64url
  // has to replace. Without a case like this the substitution is untested.
  const TRICKY = new Uint8Array([0xfb, 0xff, 0xbf]);

  it("uses the URL-safe alphabet and drops padding", () => {
    expect(bytesToBase64(TRICKY)).toBe("+/+/");
    expect(bytesToBase64Url(TRICKY)).toBe("-_-_");
    expect(bytesToBase64Url(HELLO)).toBe("aGVsbG8");
    expect(bytesToBase64Url(HELLO)).not.toContain("=");
  });

  it("round-trips", () => {
    expect(base64UrlToBytes(bytesToBase64Url(TRICKY))).toEqual(TRICKY);
    expect(base64UrlToBytes(bytesToBase64Url(HELLO))).toEqual(HELLO);
  });

  // The drift that motivated this file. One of the three base64url decoders
  // never restored padding before decoding, so an unpadded string, which is
  // the only kind the encoder produces, was at the mercy of how forgiving the
  // engine happened to be.
  it("decodes unpadded input, which is all the encoder emits", () => {
    expect(base64UrlToBytes("aGVsbG8")).toEqual(HELLO);
  });

  it("also accepts input that still carries padding", () => {
    expect(base64UrlToBytes("aGVsbG8=")).toEqual(HELLO);
  });

  it("round-trips every byte value", () => {
    const all = new Uint8Array(256);
    for (let i = 0; i < 256; i++) all[i] = i;
    expect(base64UrlToBytes(bytesToBase64Url(all))).toEqual(all);
  });

  it("round-trips each padding length unpadded", () => {
    for (const n of [1, 2, 3, 4, 5, 6]) {
      const bytes = new Uint8Array(n).fill(0xab);
      const encoded = bytesToBase64Url(bytes);
      expect(encoded).not.toContain("=");
      expect(base64UrlToBytes(encoded)).toEqual(bytes);
    }
  });
});

describe("base64url error behaviour", () => {
  it("base64UrlToBytes throws on malformed input", () => {
    expect(() => base64UrlToBytes("!!!!")).toThrow();
  });

  // A length that is 1 mod 4 cannot be valid base64: no padding makes it whole.
  it("throws on an impossible length rather than returning short bytes", () => {
    expect(() => base64UrlToBytes("aGVsbG8ZZZZZa")).toThrow();
  });

  it("tryBase64UrlToBytes returns null instead", () => {
    expect(tryBase64UrlToBytes("!!!!")).toBeNull();
  });
});

describe("cross-encoding", () => {
  // The two alphabets must not be silently interchangeable, or a base64url
  // string reaching a base64 decoder would decode to the wrong bytes rather
  // than failing.
  it("a base64url string with substituted characters is not valid base64", () => {
    expect(tryBase64ToBytes("-_-_")).toBeNull();
  });
});
