// Tests for voice-capture burst codec.
// Validates the VOICE_FRAME payload format matches VoiceBurstPacket.swift.

import { ed25519 } from "@noble/curves/ed25519.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { MAX_BLE_FRAME } from "../fragment-manager";
import { encodePacket, type Packet } from "../packet-codec";
import {
  BurstFlags,
  decodeBurstPacket,
  encodeBurstCanceled,
  encodeBurstData,
  encodeBurstEnd,
  encodeBurstStart,
  framesToAdtsFile,
  MIN_BURST_KEEP_MS,
  VoiceCaptureSession,
  VoiceCodec,
} from "../voice-capture";

function makeBurstID(seed: number): Uint8Array {
  return new Uint8Array(8).fill(seed);
}

// Realistic frames: AAC-LC 16 kHz mono at 16 kbps is about 130 bytes, and each
// one is 64 ms of audio.
const frame = (fill = 9) => new Uint8Array(130).fill(fill);

// Enough of them to be a message rather than a mis-tap. Below MIN_BURST_KEEP_MS
// a release retracts the burst instead of ending it, so any test asserting an
// END has to hold the button for at least this long.
const KEEPABLE_FRAMES = Math.ceil(MIN_BURST_KEEP_MS / 64) + 4;

function hold(feed: (f: Uint8Array) => void, frames = KEEPABLE_FRAMES): void {
  for (let i = 0; i < frames; i++) feed(frame(i + 1));
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
    hold((f) =>
      (session as unknown as { feed: (x: Uint8Array) => void }).feed(f),
    );
    await session.stopPtt();

    for (const packet of packets) {
      expect(packet.payload.length).toBeLessThanOrEqual(210);
    }
  });

  // The budget only helps if it survives encoding, so this is the assertion
  // that protects live voice.
  //
  // The 210-byte budget bounds the payload, but the radio carries the encoded
  // frame: 16 header + 8 senderID + payload + 64 signature. Padding that
  // ~309-byte frame rounds it up to the next block, which costs airtime on
  // every packet of a call and, once a burst batches more frames, pushes it
  // into the fragment scheduler. bitchat leaves voiceFrame unpadded for the
  // same reason (BLEOutboundPacketPolicy).
  //
  // The padding check compares against the frame's own unpadded encoding rather
  // than against a size limit. A limit is a moving target: when MAX_BLE_FRAME
  // moved from 469 to 512 a padded voice frame landed on exactly 512 and a
  // "fits in one frame" assertion started passing with the padding restored.
  // Comparing a frame to itself cannot drift.
  it("never emits a FRAME that would need fragmentation", async () => {
    const { packets, session } = collect();
    await session.startPtt();
    hold((f) =>
      (session as unknown as { feed: (x: Uint8Array) => void }).feed(f),
    );
    await session.stopPtt();

    expect(packets.length).toBeGreaterThan(2); // START + data + END
    for (const packet of packets) {
      const framed = encodePacket(packet);
      expect(framed.length).toBe(encodePacket(packet, false).length);
      expect(framed.length).toBeLessThanOrEqual(MAX_BLE_FRAME);
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
    hold(feed);
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
    hold(feed);
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

  // A dead session stops the ENCODER, not the burst. The finger is still on the
  // button, and whatever it does next still has to reach the far side: a peer
  // who dropped out for a moment and came back must be told the burst was
  // retracted, or they keep and play audio the talker took back.
  it("still retracts after the session went away mid-talk", async () => {
    let alive = true;
    const sealed: Uint8Array[] = [];
    const { session, feed } = dmSession((p) => {
      if (alive) sealed.push(p);
      return alive;
    });

    await session.startPtt();
    alive = false;
    feed(new Uint8Array(130).fill(7));
    feed(new Uint8Array(130).fill(8));
    expect(session.isActive).toBe(false);

    // The peer is back by the time the user slides to cancel.
    alive = true;
    sealed.length = 0;
    await session.cancelPtt();

    expect(sealed.length).toBeGreaterThan(0);
    expect(decodeBurstPacket(sealed[0])?.kind).toBe("canceled");
  });
});

// Closing a burst is the one decision that belongs to the person holding the
// button, and it has to survive everything that can stop the microphone without
// them: a Noise session dropping, the last peer in range walking off.
describe("burst close is the talker's decision", () => {
  function collect(): {
    packets: Packet[];
    session: VoiceCaptureSession & { feed: (f: Uint8Array) => void };
    stops: number;
  } {
    const packets: Packet[] = [];
    let onFrame: ((f: Uint8Array) => void) | null = null;
    const counter = { stops: 0 };
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
        stopCapture: () => {
          counter.stops++;
          return Promise.resolve();
        },
      },
    );
    return {
      packets,
      get stops() {
        return counter.stops;
      },
      session: Object.assign(session, {
        feed: (f: Uint8Array) => onFrame?.(f),
      }),
    };
  }

  const kinds = (packets: Packet[]) =>
    packets.map((p) => decodeBurstPacket(p.payload)?.kind);

  it("suspend stops the microphone without ending the burst", async () => {
    const collected = collect();
    const { packets, session } = collected;
    await session.startPtt();
    session.feed(new Uint8Array(130).fill(1));
    await session.suspend();

    expect(collected.stops).toBe(1);
    expect(session.isActive).toBe(false);
    // Nothing has closed it: no END and no CANCELED have gone out.
    expect(kinds(packets)).not.toContain("end");
    expect(kinds(packets)).not.toContain("canceled");
  });

  it("releasing after a suspend still ends the burst and keeps the audio", async () => {
    const { packets, session } = collect();
    await session.startPtt();
    hold(session.feed);
    await session.suspend();
    await session.stopPtt();

    expect(kinds(packets)[packets.length - 1]).toBe("end");
    // The words were said. They are still a playable note for anyone who was
    // out of range while it was live.
    expect(session.finalizedRecording()).not.toBeNull();
  });

  it("sliding back after a suspend still retracts the burst", async () => {
    const { packets, session } = collect();
    await session.startPtt();
    // Long enough that a release would have kept it, so this proves the slide
    // is what threw it away.
    hold(session.feed);
    await session.suspend();
    await session.cancelPtt();

    expect(kinds(packets)).toContain("canceled");
    expect(kinds(packets)).not.toContain("end");
    expect(session.finalizedRecording()).toBeNull();
  });

  it("closes a burst exactly once", async () => {
    const { packets, session } = collect();
    await session.startPtt();
    hold(session.feed);
    await session.stopPtt();
    await session.stopPtt();
    await session.cancelPtt();

    expect(kinds(packets).filter((k) => k === "end")).toHaveLength(1);
    expect(kinds(packets)).not.toContain("canceled");
  });

  it("does not retract a burst that was never started", async () => {
    const { packets, session } = collect();
    await session.cancelPtt();
    expect(packets).toHaveLength(0);
  });

  // A tap on the mic instead of a hold. bitchat does the same thing in
  // PTTLiveVoiceSession.finish(): below its minimum it sends `.canceled` and
  // deletes the file rather than delivering a fragment of a word.
  //
  // Ending it instead would leave everyone in range holding a third of a second
  // of audio as a voice note, in a conversation where the person who pressed the
  // button sees no message at all.
  it("retracts a hold too short to be a message", async () => {
    const { packets, session } = collect();
    await session.startPtt();
    hold(session.feed, 2); // 128 ms
    await session.stopPtt();

    expect(kinds(packets)).toContain("canceled");
    expect(kinds(packets)).not.toContain("end");
    // And nothing is left to send as a note, so the thread stays empty on both
    // sides rather than only on one.
    expect(session.finalizedRecording()).toBeNull();
  });

  it("keeps a hold that just clears the minimum", async () => {
    const { packets, session } = collect();
    await session.startPtt();
    hold(session.feed, Math.ceil(MIN_BURST_KEEP_MS / 64));
    await session.stopPtt();

    expect(kinds(packets)).toContain("end");
    expect(kinds(packets)).not.toContain("canceled");
    expect(session.finalizedRecording()).not.toBeNull();
  });
});

// A retraction is the one control packet nothing else can stand in for. Both
// clients turn a burst that merely stops into a finished voice note after three
// seconds, so a lost END costs nothing; a lost CANCELED means the far side
// keeps and plays exactly what the talker took back.
describe("CANCELED is repeated", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  function collect(): {
    packets: Packet[];
    session: VoiceCaptureSession;
  } {
    const packets: Packet[] = [];
    const session = new VoiceCaptureSession(
      {
        senderPeerID: "aabbccdd00112233",
        signingPrivKey: ed25519.utils.randomSecretKey(),
        onPacket: (p) => packets.push(p),
      },
      {
        startCapture: () => Promise.resolve(),
        stopCapture: () => Promise.resolve(),
      },
    );
    return { packets, session };
  }

  it("sends the same retraction three times inside half a second", async () => {
    const { packets, session } = collect();
    await session.startPtt();
    await session.cancelPtt();

    const canceled = () =>
      packets.filter((p) => decodeBurstPacket(p.payload)?.kind === "canceled");
    expect(canceled()).toHaveLength(1);

    jest.advanceTimersByTime(500);
    expect(canceled()).toHaveLength(3);

    // Every copy names the same burst, or the repeats retract nothing.
    const ids = new Set(
      canceled().map((p) => {
        const burst = decodeBurstPacket(p.payload);
        return burst ? bytesToHex(burst.burstID) : "";
      }),
    );
    expect(ids).toEqual(new Set([session.burstIDHex]));
  });

  it("gives each copy its own timestamp, so none is a stale replay", async () => {
    const { packets, session } = collect();
    const now = jest.spyOn(Date, "now");
    try {
      now.mockReturnValue(5_000_000);
      await session.startPtt();
      await session.cancelPtt();
      now.mockReturnValue(5_000_400);
      jest.advanceTimersByTime(500);
    } finally {
      now.mockRestore();
    }

    const canceled = packets.filter(
      (p) => decodeBurstPacket(p.payload)?.kind === "canceled",
    );
    // A receiver drops a voice frame older than 30s and deduplicates by packet
    // ID: identical copies would be thrown away as replays of the first.
    expect(new Set(canceled.map((p) => p.timestamp)).size).toBeGreaterThan(1);
  });
});

describe("burstIDHex", () => {
  it("is the 16 lowercase hex characters bitchat matches a voice note on", async () => {
    const session = new VoiceCaptureSession(
      {
        senderPeerID: "aabbccdd00112233",
        signingPrivKey: ed25519.utils.randomSecretKey(),
        onPacket: () => undefined,
      },
      {
        startCapture: () => Promise.resolve(),
        stopCapture: () => Promise.resolve(),
      },
    );
    await session.startPtt();
    // `voice_<burstIDHex>.aac` is the name the finalized note travels under, and
    // both bitchat clients take the 16 characters after `voice_` and require
    // every one of them to be a hex digit.
    expect(session.burstIDHex).toMatch(/^[0-9a-f]{16}$/);
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

  it("stops emitting once the burst passes two minutes", async () => {
    const now = jest.spyOn(Date, "now");
    try {
      now.mockReturnValue(1_000_000);
      const { packets, session } = collect();
      await session.startPtt();

      // Well inside the ceiling: these are carried.
      hold(session.feed);
      const during = packets.length;
      expect(during).toBeGreaterThan(1); // START plus at least one DATA

      // Two minutes and a second later, the mic is still held.
      now.mockReturnValue(1_000_000 + 121_000);
      hold(session.feed);

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
      hold(session.feed);

      now.mockReturnValue(2_000_000 + 121_000);
      hold(session.feed);
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
