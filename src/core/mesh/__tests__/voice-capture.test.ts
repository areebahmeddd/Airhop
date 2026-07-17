// Tests for voice-capture burst codec.
// Validates the VOICE_FRAME payload format matches VoiceBurstPacket.swift.

import { bytesToHex } from "@noble/hashes/utils.js";
import {
  BurstFlags,
  decodeBurstPacket,
  encodeBurstCanceled,
  encodeBurstData,
  encodeBurstEnd,
  encodeBurstStart,
  VoiceCodec,
} from "../voice-capture";

function makeBurstID(seed: number): Uint8Array {
  return new Uint8Array(8).fill(seed);
}

describe("VoiceCodec constants", () => {
  it("AAC_LC_16KHZ_MONO = 0x01 (matches VoiceBurstCodec.aacLC16kMono)", () => {
    expect(VoiceCodec.AAC_LC_16KHZ_MONO).toBe(0x01);
  });
});

describe("BurstFlags constants", () => {
  it("DATA = 0x00", () => expect(BurstFlags.DATA).toBe(0x00));
  it("START = 0x01", () => expect(BurstFlags.START).toBe(0x01));
  it("END = 0x02", () => expect(BurstFlags.END).toBe(0x02));
  it("CANCELED = 0x04", () => expect(BurstFlags.CANCELED).toBe(0x04));
});

describe("encodeBurstStart / decodeBurstPacket (START)", () => {
  const id = makeBurstID(0xaa);

  it("round-trips burstID and codec", () => {
    const payload = encodeBurstStart(id, VoiceCodec.AAC_LC_16KHZ_MONO);
    const result = decodeBurstPacket(payload);
    if (!result) {
      expect(result).not.toBeNull();
      return;
    }
    expect(result.kind).toBe("start");
    if (result.kind !== "start") return;
    expect(bytesToHex(result.burstID)).toBe(bytesToHex(id));
    expect(result.codec).toBe(VoiceCodec.AAC_LC_16KHZ_MONO);
  });

  it("START payload wire layout: burstID[8] | seq u16 BE=0 | flags=0x01 | codec u8", () => {
    const payload = encodeBurstStart(id, VoiceCodec.AAC_LC_16KHZ_MONO);
    // Minimum length: 8 (burstID) + 2 (seq) + 1 (flags) + 1 (codec) = 12
    expect(payload.length).toBe(12);
    // burstID at [0-7]
    expect(Array.from(payload.slice(0, 8))).toEqual(Array.from(id));
    // seq = 0 at [8-9]
    const view = new DataView(payload.buffer);
    expect(view.getUint16(8, false)).toBe(0);
    // flags = START (0x01) at [10]
    expect(payload[10]).toBe(BurstFlags.START);
    // codec at [11]
    expect(payload[11]).toBe(VoiceCodec.AAC_LC_16KHZ_MONO);
  });
});

describe("encodeBurstData / decodeBurstPacket (DATA)", () => {
  const id = makeBurstID(0xbb);
  const frame1 = new Uint8Array([0x11, 0x22, 0x33]);
  const frame2 = new Uint8Array([0x44, 0x55]);

  it("round-trips single frame", () => {
    const payload = encodeBurstData(id, 1, [frame1]);
    const result = decodeBurstPacket(payload);
    if (!result || result.kind !== "data") {
      expect(result?.kind).toBe("data");
      return;
    }
    expect(result.seq).toBe(1);
    expect(result.frames).toHaveLength(1);
    expect(Array.from(result.frames[0])).toEqual(Array.from(frame1));
  });

  it("round-trips multiple frames in one DATA packet", () => {
    const payload = encodeBurstData(id, 2, [frame1, frame2]);
    const result = decodeBurstPacket(payload);
    if (!result || result.kind !== "data") {
      expect(result?.kind).toBe("data");
      return;
    }
    expect(result.frames).toHaveLength(2);
    expect(Array.from(result.frames[0])).toEqual(Array.from(frame1));
    expect(Array.from(result.frames[1])).toEqual(Array.from(frame2));
  });

  it("DATA flags byte is 0x00", () => {
    const payload = encodeBurstData(id, 1, [frame1]);
    expect(payload[10]).toBe(BurstFlags.DATA);
  });

  it("seq u16 BE is encoded correctly", () => {
    const payload = encodeBurstData(id, 0x0102, [frame1]);
    const view = new DataView(payload.buffer);
    expect(view.getUint16(8, false)).toBe(0x0102);
  });
});

describe("encodeBurstEnd / decodeBurstPacket (END)", () => {
  const id = makeBurstID(0xcc);

  it("round-trips totalDataPackets and durationMs", () => {
    const payload = encodeBurstEnd(id, 0, 5, 2500);
    const result = decodeBurstPacket(payload);
    if (!result || result.kind !== "end") {
      expect(result?.kind).toBe("end");
      return;
    }
    expect(result.totalDataPackets).toBe(5);
    expect(result.durationMs).toBe(2500);
    expect(bytesToHex(result.burstID)).toBe(bytesToHex(id));
  });

  it("END flags byte is 0x02", () => {
    const payload = encodeBurstEnd(id, 0, 1, 1000);
    expect(payload[10]).toBe(BurstFlags.END);
  });
});

describe("encodeBurstCanceled / decodeBurstPacket (CANCELED)", () => {
  const id = makeBurstID(0xdd);

  it("round-trips canceled burst", () => {
    const payload = encodeBurstCanceled(id, 0);
    const result = decodeBurstPacket(payload);
    expect(result!.kind).toBe("canceled");
    expect(bytesToHex(result!.burstID)).toBe(bytesToHex(id));
  });

  it("CANCELED flags byte is 0x04", () => {
    const payload = encodeBurstCanceled(id, 0);
    expect(payload[10]).toBe(BurstFlags.CANCELED);
  });
});

describe("decodeBurstPacket error handling", () => {
  it("returns null for too-short payload (< 11 bytes)", () => {
    expect(decodeBurstPacket(new Uint8Array(10))).toBeNull();
  });

  it("returns null for zero-length input", () => {
    expect(decodeBurstPacket(new Uint8Array(0))).toBeNull();
  });

  it("returns null for unknown flags byte", () => {
    // Valid structure but flags byte 0x08 is unknown
    const buf = new Uint8Array(12);
    buf[10] = 0x08; // unknown flag
    expect(decodeBurstPacket(buf)).toBeNull();
  });
});
