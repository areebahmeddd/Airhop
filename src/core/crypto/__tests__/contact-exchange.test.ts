/**
 * @jest-environment node
 */
import {
  decodeContactCard,
  decodeQRContent,
  encodeContactCard,
  encodeQRContent,
  type ContactCard,
} from "../contact-exchange";

function makeCard(overrides: Partial<ContactCard> = {}): ContactCard {
  return {
    peerID: "3a9f2c1b4e5d6f70",
    noisePubKey: new Uint8Array(32).fill(0xaa),
    signingPubKey: new Uint8Array(32).fill(0xbb),
    nickname: "swift",
    ...overrides,
  };
}

describe("ContactCard binary encode/decode", () => {
  test("round-trip: all fields survive encode → decode", () => {
    const card = makeCard();
    const encoded = encodeContactCard(card);
    const decoded = decodeContactCard(encoded);

    expect(decoded.peerID).toBe(card.peerID);
    expect(Array.from(decoded.noisePubKey)).toEqual(
      Array.from(card.noisePubKey),
    );
    expect(Array.from(decoded.signingPubKey)).toEqual(
      Array.from(card.signingPubKey),
    );
    expect(decoded.nickname).toBe(card.nickname);
  });

  test("empty nickname encodes and decodes correctly", () => {
    const card = makeCard({ nickname: "" });
    const decoded = decodeContactCard(encodeContactCard(card));
    expect(decoded.nickname).toBe("");
  });

  test("max-length 32-byte nickname round-trips", () => {
    const card = makeCard({ nickname: "a".repeat(32) });
    const decoded = decodeContactCard(encodeContactCard(card));
    expect(decoded.nickname).toBe("a".repeat(32));
  });

  test("nickname longer than 32 bytes is silently truncated", () => {
    const card = makeCard({ nickname: "a".repeat(60) });
    const buf = encodeContactCard(card);
    const decoded = decodeContactCard(buf);
    expect(decoded.nickname.length).toBeLessThanOrEqual(32);
  });

  test("multi-byte UTF-8 nickname round-trips", () => {
    const card = makeCard({ nickname: "日本語" });
    const decoded = decodeContactCard(encodeContactCard(card));
    expect(decoded.nickname).toBe("日本語");
  });

  test("version byte is 1", () => {
    const buf = encodeContactCard(makeCard());
    expect(buf[0]).toBe(1);
  });

  test("peerID bytes are at offset 1–8", () => {
    const card = makeCard({ peerID: "aabbccddeeff0011" });
    const buf = encodeContactCard(card);
    const extracted = Array.from(buf.slice(1, 9)).map((b) =>
      b.toString(16).padStart(2, "0"),
    );
    expect(extracted.join("")).toBe("aabbccddeeff0011");
  });

  test("throws on truncated buffer", () => {
    expect(() => decodeContactCard(new Uint8Array(30))).toThrow("too short");
  });

  test("throws on wrong version byte", () => {
    const buf = encodeContactCard(makeCard());
    buf[0] = 99;
    expect(() => decodeContactCard(buf)).toThrow("unsupported version");
  });

  test("throws on invalid peerID length", () => {
    expect(() => encodeContactCard({ ...makeCard(), peerID: "short" })).toThrow(
      "16 hex chars",
    );
  });

  test("different keys produce different encodings", () => {
    const buf1 = encodeContactCard(
      makeCard({ noisePubKey: new Uint8Array(32).fill(1) }),
    );
    const buf2 = encodeContactCard(
      makeCard({ noisePubKey: new Uint8Array(32).fill(2) }),
    );
    expect(Array.from(buf1)).not.toEqual(Array.from(buf2));
  });
});

describe("QR content encode/decode", () => {
  test("QR content starts with airhop:v1/ scheme", () => {
    const qr = encodeQRContent(makeCard());
    expect(qr.startsWith("airhop:v1/")).toBe(true);
  });

  test("round-trip: QR encode → decode recovers all fields", () => {
    const card = makeCard({ nickname: "falcon-relay" });
    const qr = encodeQRContent(card);
    const decoded = decodeQRContent(qr);

    expect(decoded).not.toBeNull();
    expect(decoded!.peerID).toBe(card.peerID);
    expect(decoded!.nickname).toBe(card.nickname);
    expect(Array.from(decoded!.noisePubKey)).toEqual(
      Array.from(card.noisePubKey),
    );
  });

  test("decodeQRContent returns null for non-Airhop QR", () => {
    expect(decodeQRContent("https://example.com")).toBeNull();
    expect(decodeQRContent("")).toBeNull();
    expect(decodeQRContent("bitcoin:abc123")).toBeNull();
  });

  test("decodeQRContent returns null for corrupted base64url", () => {
    expect(decodeQRContent("airhop:v1/!!!invalid!!!")).toBeNull();
  });

  test("QR content contains no padding chars (=)", () => {
    const qr = encodeQRContent(makeCard());
    expect(qr).not.toContain("=");
  });

  test("QR content uses URL-safe chars only (no + or /)", () => {
    // Run multiple cards to exercise different byte patterns.
    for (let fill = 0; fill < 16; fill++) {
      const card = makeCard({ noisePubKey: new Uint8Array(32).fill(fill) });
      const qr = encodeQRContent(card);
      const b64part = qr.slice("airhop:v1/".length);
      expect(b64part).not.toContain("+");
      expect(b64part).not.toContain("/");
    }
  });
});

// The NFC payload tests were removed with the NFC contact path: iOS cannot
// emulate an NDEF tag (no HCE), so phone-to-phone tap is impossible. QR carries
// the identical ContactCard binary and is covered above.
