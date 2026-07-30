// Tests for voice-capture burst codec.
// Validates the VOICE_FRAME payload format matches VoiceBurstPacket.swift.

import { ed25519 } from "@noble/curves/ed25519.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import type { Packet } from "../packet-codec";
import {
  BurstFlags,
  decodeBurstPacket,
  encodeBurstCanceled,
  encodeBurstData,
  encodeBurstEnd,
  encodeBurstStart,
  framesToAdtsFile,
  VoiceCaptureSession,
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

describe("packetizer budget", () => {
  // The 210-byte content budget exists so a voice packet never enters the
  // fragment scheduler, which caps concurrent transfers and would starve file
  // sends while someone talks.
  function collect(): { packets: Packet[]; session: VoiceCaptureSession } {
    const packets: Packet[] = [];
    let onFrame: ((f: Uint8Array) => void) | null = null;
    const session = new VoiceCaptureSession(
      {
        senderPeerID: "aabbccdd00112233",
        signingPrivKey: ed25519.utils.randomSecretKey(),
        onPacket: (p) => packets.push(p),
      },
      {
        startCapture: (cb) => {
          onFrame = cb;
          return Promise.resolve();
        },
        stopCapture: () => Promise.resolve(),
      },
    );
    return {
      packets,
      session: Object.assign(session, {
        feed: (f: Uint8Array) => onFrame?.(f),
      }),
    };
  }

  it("never emits a payload that would need fragmentation", async () => {
    const { packets, session } = collect();
    await session.startPtt();
    // Realistic frames: AAC-LC 16 kHz mono at 16 kbps is about 130 bytes.
    for (let i = 0; i < 12; i++) {
      (session as unknown as { feed: (f: Uint8Array) => void }).feed(
        new Uint8Array(130).fill(i + 1),
      );
    }
    await session.stopPtt();

    for (const packet of packets) {
      expect(packet.payload.length).toBeLessThanOrEqual(210);
    }
  });

  it("drops a frame too large to ever fit its own packet", async () => {
    const { packets, session } = collect();
    await session.startPtt();
    const before = packets.length;
    (session as unknown as { feed: (f: Uint8Array) => void }).feed(
      new Uint8Array(400).fill(9),
    );
    await session.stopPtt();
    // START and END only: the oversize frame produced no data packet, rather
    // than an oversize one that would have been fragmented.
    const dataPackets = packets.slice(before, packets.length - 1);
    expect(dataPackets).toHaveLength(0);
  });
});

describe("DM burst scoping", () => {
  // A DM burst is sealed to one peer. It must never also go out as a broadcast,
  // or audio meant for one person is heard by everyone in range.
  function dmSession(send: (payload: Uint8Array) => boolean) {
    const broadcast: Packet[] = [];
    let onFrame: ((f: Uint8Array) => void) | null = null;
    const session = new VoiceCaptureSession(
      {
        senderPeerID: "aabbccdd00112233",
        signingPrivKey: ed25519.utils.randomSecretKey(),
        onPacket: (p) => broadcast.push(p),
        onDmPayload: send,
      },
      {
        startCapture: (cb) => {
          onFrame = cb;
          return Promise.resolve();
        },
        stopCapture: () => Promise.resolve(),
      },
    );
    return {
      broadcast,
      session,
      feed: (f: Uint8Array) => onFrame?.(f),
    };
  }

  it("never broadcasts a DM burst", async () => {
    const sealed: Uint8Array[] = [];
    const { broadcast, session, feed } = dmSession((p) => {
      sealed.push(p);
      return true;
    });

    await session.startPtt();
    feed(new Uint8Array(130).fill(7));
    await session.stopPtt();

    expect(broadcast).toHaveLength(0);
    // START, one DATA, END all went through the sealed path.
    expect(sealed.length).toBeGreaterThanOrEqual(3);
  });

  it("sends the same burst bytes a public burst would", async () => {
    const sealed: Uint8Array[] = [];
    const { session, feed } = dmSession((p) => {
      sealed.push(p);
      return true;
    });

    await session.startPtt();
    feed(new Uint8Array(130).fill(7));
    await session.stopPtt();

    // One wire format, two envelopes: every payload decodes with the same
    // parser a public VOICE_FRAME packet uses.
    const kinds = sealed.map((p) => decodeBurstPacket(p)?.kind);
    expect(kinds[0]).toBe("start");
    expect(kinds).toContain("data");
    expect(kinds[kinds.length - 1]).toBe("end");
  });

  it("stops the burst when the session goes away mid-talk", async () => {
    // The peer walked off. Live audio has no queue to wait in, so encoding on
    // into a dead session would just burn the microphone.
    let alive = true;
    const { session, feed } = dmSession(() => alive);

    await session.startPtt();
    expect(session.isActive).toBe(true);
    alive = false;
    feed(new Uint8Array(130).fill(7));
    // The flush that carries this frame fails, and the session closes itself.
    feed(new Uint8Array(130).fill(8));
    expect(session.isActive).toBe(false);
  });
});

describe("framesToAdtsFile", () => {
  // The live frames are bare AAC: no container, because the codec byte already
  // says what they are. A file has to be self-describing, so each frame gets a
  // seven-byte ADTS header. This is what turns a burst people heard live into
  // a voice note that anyone out of range can still play.
  it("prefixes every frame with a valid ADTS header", () => {
    const frames = [new Uint8Array(120).fill(1), new Uint8Array(96).fill(2)];
    const file = framesToAdtsFile(frames);

    expect(file.length).toBe(7 + 120 + 7 + 96);

    // Sync word, MPEG-4, layer 0, no CRC.
    expect(file[0]).toBe(0xff);
    expect(file[1]).toBe(0xf1);
    // AAC-LC (profile 1), 16 kHz (index 8), mono (1).
    expect((file[2] >> 6) & 0x03).toBe(1);
    expect((file[2] >> 2) & 0x0f).toBe(8);
    expect(((file[2] & 0x01) << 2) | ((file[3] >> 6) & 0x03)).toBe(1);

    // Frame length field covers header + payload, so a player can walk the file.
    const first = ((file[3] & 0x03) << 11) | (file[4] << 3) | (file[5] >> 5);
    expect(first).toBe(7 + 120);

    // The second frame starts exactly where the first said it would end.
    expect(file[first]).toBe(0xff);
    const second =
      ((file[first + 3] & 0x03) << 11) |
      (file[first + 4] << 3) |
      (file[first + 5] >> 5);
    expect(second).toBe(7 + 96);
  });

  it("returns an empty file for no frames", () => {
    expect(framesToAdtsFile([]).length).toBe(0);
  });
});

// One hold may only occupy the radio for so long. Matches bitchat's
// PTTCaptureEngine.maxCaptureDuration: past the ceiling the session stays open
// and stops encoding, so the gesture still belongs to the user and releasing
// still ends the burst properly.
describe("burst duration ceiling", () => {
  function collect(): {
    packets: Packet[];
    session: VoiceCaptureSession & { feed: (f: Uint8Array) => void };
  } {
    const packets: Packet[] = [];
    let onFrame: ((f: Uint8Array) => void) | null = null;
    const session = new VoiceCaptureSession(
      {
        senderPeerID: "aabbccdd00112233",
        signingPrivKey: ed25519.utils.randomSecretKey(),
        onPacket: (p) => packets.push(p),
      },
      {
        startCapture: (cb) => {
          onFrame = cb;
          return Promise.resolve();
        },
        stopCapture: () => Promise.resolve(),
      },
    );
    return {
      packets,
      session: Object.assign(session, {
        feed: (f: Uint8Array) => onFrame?.(f),
      }),
    };
  }

  const frame = () => new Uint8Array(130).fill(9);

  it("stops emitting once the burst passes two minutes", async () => {
    const now = jest.spyOn(Date, "now");
    try {
      now.mockReturnValue(1_000_000);
      const { packets, session } = collect();
      await session.startPtt();

      // Well inside the ceiling: these are carried.
      for (let i = 0; i < 12; i++) session.feed(frame());
      const during = packets.length;
      expect(during).toBeGreaterThan(1); // START plus at least one DATA

      // Two minutes and a second later, the mic is still held.
      now.mockReturnValue(1_000_000 + 121_000);
      for (let i = 0; i < 12; i++) session.feed(frame());

      expect(packets.length).toBe(during);
    } finally {
      now.mockRestore();
    }
  });

  it("still ends the burst properly when the user finally releases", async () => {
    const now = jest.spyOn(Date, "now");
    try {
      now.mockReturnValue(2_000_000);
      const { packets, session } = collect();
      await session.startPtt();
      for (let i = 0; i < 12; i++) session.feed(frame());

      now.mockReturnValue(2_000_000 + 121_000);
      for (let i = 0; i < 12; i++) session.feed(frame());
      await session.stopPtt();

      // The END is what tells every listener the burst is over; suppressing
      // frames must never suppress that, or the far side waits for a timeout.
      const last = decodeBurstPacket(packets[packets.length - 1].payload);
      expect(last?.kind).toBe("end");
      // And the audio captured before the ceiling is still a playable note.
      expect(session.finalizedRecording()).not.toBeNull();
    } finally {
      now.mockRestore();
    }
  });
});
