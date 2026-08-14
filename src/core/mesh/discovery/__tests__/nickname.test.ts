/**
 * @jest-environment node
 */
// Nickname canonicalization. The bug these guard against is silent: two valid
// encodings of one visible name compare unequal, so a mention never fires and
// one person occupies two rows of a participant list.
import {
  decodeAnnouncePayload,
  encodeAnnouncePayload,
} from "../announce-manager";
import { nicknameKey, normalizeNickname, sameNickname } from "../nickname";

// "José" written the two ways a keyboard can produce it. These are different
// byte sequences that render identically.
const COMPOSED = "José"; // U+00E9 LATIN SMALL LETTER E WITH ACUTE
const DECOMPOSED = "José"; // U+0065 + U+0301 COMBINING ACUTE ACCENT

describe("normalizeNickname", () => {
  it("the two encodings of one name are not equal to begin with", () => {
    // If this ever fails the rest of the suite is testing nothing.
    expect(COMPOSED).not.toBe(DECOMPOSED);
    expect(COMPOSED.length).toBe(4);
    expect(DECOMPOSED.length).toBe(5);
  });

  it("collapses both encodings to the same string", () => {
    expect(normalizeNickname(DECOMPOSED)).toBe(normalizeNickname(COMPOSED));
    expect(normalizeNickname(DECOMPOSED)).toBe(COMPOSED);
  });

  it("trims surrounding whitespace, which is invisible in a name", () => {
    expect(normalizeNickname("  ana  ")).toBe("ana");
  });

  it("leaves an already-canonical name untouched", () => {
    expect(normalizeNickname("ana")).toBe("ana");
  });

  it("sameNickname ignores encoding and case", () => {
    expect(sameNickname(COMPOSED, DECOMPOSED)).toBe(true);
    expect(sameNickname(COMPOSED, DECOMPOSED.toUpperCase())).toBe(true);
    expect(sameNickname("ana", "anabelle")).toBe(false);
  });

  it("nicknameKey is stable across encoding and case", () => {
    expect(nicknameKey(DECOMPOSED)).toBe(nicknameKey(COMPOSED.toUpperCase()));
  });
});

describe("announce nickname round-trip", () => {
  const identity = {
    peerID: "1122334455667788",
    noiseStaticPubKey: new Uint8Array(32).fill(1),
    signingPubKey: new Uint8Array(32).fill(2),
  };
  const senderID = new Uint8Array(8).fill(0x11);

  function roundTrip(nickname: string): string {
    const payload = encodeAnnouncePayload(
      identity as never,
      nickname,
      [],
      undefined,
      0,
    );
    const info = decodeAnnouncePayload(payload, senderID);
    expect(info).not.toBeNull();
    return info!.nickname;
  }

  // The interop case. A peer announcing the decomposed form must land in our
  // registry under the same string a peer announcing the composed form does,
  // or every downstream comparison sees two people.
  it("a decomposed announce decodes to the canonical form", () => {
    expect(roundTrip(DECOMPOSED)).toBe(COMPOSED);
    expect(roundTrip(DECOMPOSED)).toBe(roundTrip(COMPOSED));
  });

  it("normalizes on the way out too, so peers receive one form", () => {
    const payload = encodeAnnouncePayload(
      identity as never,
      DECOMPOSED,
      [],
      undefined,
      0,
    );
    // TLV 0x01 sits first: [type][len][value].
    expect(payload[0]).toBe(0x01);
    const value = payload.slice(2, 2 + payload[1]);
    expect(new TextDecoder().decode(value)).toBe(COMPOSED);
  });

  it("truncates to the 32-byte budget by bytes, not characters", () => {
    // 32 emoji is 128 UTF-8 bytes. Slicing to 32 characters would emit all of
    // them and blow four times past the documented budget.
    const payload = encodeAnnouncePayload(
      identity as never,
      "\u{1f600}".repeat(32),
      [],
      undefined,
      0,
    );
    expect(payload[0]).toBe(0x01);
    expect(payload[1]).toBeLessThanOrEqual(32);
  });

  it("truncation never splits a character", () => {
    const payload = encodeAnnouncePayload(
      identity as never,
      "\u{1f600}".repeat(32),
      [],
      undefined,
      0,
    );
    const value = payload.slice(2, 2 + payload[1]);
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(value);
    // No lone surrogate, so no replacement character on the far side.
    expect(decoded).not.toContain("�");
    expect([...decoded].every((c) => c === "\u{1f600}")).toBe(true);
  });
});
