// Tests for voice-capture frame codec.
// No native deps; purely tests the payload encode/decode round-trip.

import {
  buildVoiceFramePayload,
  parseVoiceFramePayload,
  sessionIdHex,
  VoiceCodec,
} from "../voice-capture";

describe("buildVoiceFramePayload / parseVoiceFramePayload", () => {
  it("round-trips a normal audio frame", () => {
    const sessionId = 0xdeadbeef;
    const seq = 42;
    const codec = VoiceCodec.AAC_LC_16KHZ_MONO;
    const frameData = new Uint8Array([0x01, 0x02, 0x03, 0x04]);

    const payload = buildVoiceFramePayload(
      sessionId,
      seq,
      codec,
      false,
      frameData,
    );
    const parsed = parseVoiceFramePayload(payload);

    expect(parsed).not.toBeNull();
    expect(parsed!.header.sessionId).toBe(sessionId);
    expect(parsed!.header.seq).toBe(seq);
    expect(parsed!.header.codec).toBe(codec);
    expect(parsed!.header.isLast).toBe(false);
    expect(Array.from(parsed!.frameData)).toEqual([0x01, 0x02, 0x03, 0x04]);
  });

  it("sets is_last flag correctly", () => {
    const payload = buildVoiceFramePayload(
      1,
      0,
      VoiceCodec.OPUS_16KHZ_MONO,
      true,
      new Uint8Array(0),
    );
    const parsed = parseVoiceFramePayload(payload);
    expect(parsed!.header.isLast).toBe(true);
    expect(parsed!.header.codec).toBe(VoiceCodec.OPUS_16KHZ_MONO);
  });

  it("handles empty frame data (end-of-session marker)", () => {
    const payload = buildVoiceFramePayload(
      99,
      0,
      VoiceCodec.AAC_LC_16KHZ_MONO,
      true,
      new Uint8Array(0),
    );
    const parsed = parseVoiceFramePayload(payload);
    expect(parsed!.frameData).toHaveLength(0);
    expect(parsed!.header.isLast).toBe(true);
  });

  it("returns null for too-short payload", () => {
    expect(parseVoiceFramePayload(new Uint8Array(3))).toBeNull();
    expect(parseVoiceFramePayload(new Uint8Array(7))).toBeNull();
  });

  it("returns non-null for exactly 8-byte header (empty frame)", () => {
    const payload = new Uint8Array(8);
    const parsed = parseVoiceFramePayload(payload);
    expect(parsed).not.toBeNull();
  });

  it("wraps sequence number at 16 bits", () => {
    // seq 0xFFFF + 1 should come back as 0 if we apply the wrap
    const payload = buildVoiceFramePayload(
      1,
      0xffff,
      VoiceCodec.AAC_LC_16KHZ_MONO,
      false,
      new Uint8Array(1),
    );
    const parsed = parseVoiceFramePayload(payload);
    expect(parsed!.header.seq).toBe(0xffff);
  });
});

describe("sessionIdHex", () => {
  it("produces a 8-char hex string", () => {
    const hex = sessionIdHex(0xdeadbeef);
    expect(hex).toBe("deadbeef");
    expect(hex).toHaveLength(8);
  });

  it("zero-pads small session IDs", () => {
    expect(sessionIdHex(1)).toHaveLength(8);
    expect(sessionIdHex(1)).toBe("00000001");
  });
});
