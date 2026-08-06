/**
 * @jest-environment node
 */
// The courier wire format, asserted against the published vectors.
//
// `docs/spec/courier-test-vectors.json` lets a second implementation be written
// without reading this codebase. A published file nothing checks is worse than
// none: it looks authoritative and drifts. So every value is read FROM the JSON
// and compared against the running code.
//
// Three ways of getting the format wrong fail silently, each with a case below:
//
//   * expiry is milliseconds, not seconds
//   * the copies TLV is omitted at 1, not written as 1
//   * the recipient tag rotates daily off the recipient's PUBLIC key
//
// Not pinned: the Ed25519 signature bytes. Signing is randomized in some
// implementations and deterministic in others, and both verify, so pinning them
// would fail a correct client. The signed pre-image is what must match, and the
// packet codec's own vectors cover it.

import { hexToBytes } from "@noble/hashes/utils.js";
import vectors from "../../../../docs/spec/courier-test-vectors.json";
import {
  computeRecipientTag,
  encodeEnvelopePayload,
  ENVELOPE_TTL_MS,
} from "../courier-store";

const hex = (bytes: Uint8Array): string =>
  [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

describe("the published vector file", () => {
  // A rename or a bad merge that empties a section must fail loudly rather than
  // skipping every assertion below it and reporting green.
  it("has the sections the tests below read", () => {
    expect(vectors.recipientTag.cases.length).toBeGreaterThan(0);
    expect(vectors.envelopeTLV.cases.length).toBeGreaterThan(0);
    expect(vectors.recipientTag.label).toBe("bitchat-courier-tag-v1");
  });
});

describe("recipient tag", () => {
  const key = hexToBytes(vectors.recipientTag.recipientNoisePublicKeyHex);

  it.each(vectors.recipientTag.cases)(
    "matches the published tag at epoch day $epochDay",
    ({ nowMillis, tagHex }) => {
      expect(hex(computeRecipientTag(key, nowMillis))).toBe(tagHex);
    },
  );

  it("rotates daily, so mail cannot be followed by tag across days", () => {
    // The rotation is the only unlinkability the scheme has, and it is weak
    // (the HMAC key is public). Losing it entirely would be worse.
    const [day0, day20000] = vectors.recipientTag.cases;
    expect(day0.tagHex).not.toBe(day20000.tagHex);
  });

  it("is 16 bytes, the length the TLV declares", () => {
    for (const c of vectors.recipientTag.cases) {
      expect(hexToBytes(c.tagHex)).toHaveLength(16);
    }
  });
});

describe("envelope TLV", () => {
  const { recipientTagHex, expiryMillis, ciphertextHex } = vectors.envelopeTLV;

  const build = (copies: number): Uint8Array =>
    encodeEnvelopePayload({
      recipientTag: hexToBytes(recipientTagHex),
      expiryMs: expiryMillis,
      copies,
      ciphertext: hexToBytes(ciphertextHex),
    });

  it.each(vectors.envelopeTLV.cases)(
    "encodes byte-for-byte as published at copies=$copies",
    ({ copies, encodedHex }) => {
      expect(hex(build(copies))).toBe(encodedHex);
    },
  );

  it("omits the copies TLV at 1 rather than writing it", () => {
    // The silent-failure case. A decoder that requires 0x04 refuses every
    // carry-only envelope, and the sender never learns.
    const one = hex(build(1));
    const four = hex(build(4));
    expect(four.endsWith("04000104")).toBe(true);
    expect(one.includes("04000104")).toBe(false);
    expect(four.startsWith(one)).toBe(true);
  });

  it("writes expiry as eight bytes of milliseconds, big-endian", () => {
    // Seconds would be ~1000x too small, so every envelope would read as long
    // expired and be dropped at deposit with nothing logged.
    const encoded = hex(build(4));
    const expected = expiryMillis.toString(16).padStart(16, "0");
    expect(encoded).toContain(`020008${expected}`);
    // And the value really is a millisecond timestamp, not a second one: a
    // seconds reading of the same number lands far outside any plausible date.
    expect(new Date(expiryMillis).getUTCFullYear()).toBeGreaterThan(2020);
    expect(new Date(expiryMillis).getUTCFullYear()).toBeLessThan(2100);
  });

  it("uses u16 lengths, so the tag TLV declares 0x0010", () => {
    expect(hex(build(4)).startsWith("010010")).toBe(true);
  });
});

describe("published limits match the implementation", () => {
  it("carries the same envelope lifetime the code enforces", () => {
    // A sender that stamps a longer expiry gets no carriage rather than longer
    // carriage, so publishing the wrong number here would produce envelopes
    // that are refused everywhere.
    expect(vectors.limits.envelopeTtlMillis).toBe(ENVELOPE_TTL_MS);
  });
});
