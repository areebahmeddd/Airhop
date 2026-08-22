// Tests for the VoicePlayer jitter buffer.
// No native deps; uses a mock AudioPlaybackBackend.

import type { Packet } from "../../wire/packet-codec";
import { Flags, PacketType } from "../../wire/packet-codec";
import {
  encodeBurstCanceled,
  encodeBurstData,
  encodeBurstStart,
  VoiceCodec,
} from "../voice-capture";
import { VoicePlayer, type AudioPlaybackBackend } from "../voice-player";

// Every VoicePlayer a test builds is tracked and closed afterwards.
//
// A VoiceSession holds two live timers (the jitter-buffer flush and the session
// timeout). Left open they outlive the test, which is what made Jest report
// "a worker process has failed to exit gracefully" for this whole directory.
// Closing them here is also the behaviour the app relies on: mesh-service
// closes its player on shutdown for exactly the same reason.
const openPlayers: { close: () => void }[] = [];

function track<T extends { close: () => void }>(player: T): T {
  openPlayers.push(player);
  return player;
}

afterEach(() => {
  for (const player of openPlayers) player.close();
  openPlayers.length = 0;
});

// burstID seeded from a small integer for deterministic test sessions.
function burstID(seed: number): Uint8Array {
  return new Uint8Array(8).fill(seed);
}

function makeStartPacket(seed: number): Packet {
  return {
    type: PacketType.VOICE_FRAME,
    ttl: 7,
    flags: Flags.SIGNED,
    senderID: new Uint8Array(8),
    recipientID: new Uint8Array(8),
    timestamp: Math.floor(Date.now() / 1000),
    signature: new Uint8Array(64),
    payload: encodeBurstStart(burstID(seed), VoiceCodec.AAC_LC_16KHZ_MONO),
  };
}

function makeCanceledPacket(seed: number): Packet {
  return {
    type: PacketType.VOICE_FRAME,
    ttl: 7,
    flags: Flags.SIGNED,
    senderID: new Uint8Array(8),
    recipientID: new Uint8Array(8),
    timestamp: Math.floor(Date.now() / 1000),
    signature: new Uint8Array(64),
    payload: encodeBurstCanceled(burstID(seed), 9),
  };
}

function makeDataPacket(seed: number, seq: number, data?: Uint8Array): Packet {
  const frames = [data ?? new Uint8Array([seq & 0xff])];
  return {
    type: PacketType.VOICE_FRAME,
    ttl: 7,
    flags: Flags.SIGNED,
    senderID: new Uint8Array(8),
    recipientID: new Uint8Array(8),
    timestamp: Math.floor(Date.now() / 1000),
    signature: new Uint8Array(64),
    payload: encodeBurstData(burstID(seed), seq, frames),
  };
}

// A talker who walks out of range mid-sentence sends no END and no CANCELED:
// the packets simply stop. Nothing arrives to notice that by, so the player's
// own timeout is the only thing that ends the burst - and it has to say so, or
// the screen keeps naming somebody who stopped talking seconds ago. This is the
// same stale-indicator bug we saw from the other side on bitchat, and the
// timeout matches theirs so both give up together.
describe("a talker who stops without saying so", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("is dropped on the player's own clock, and the floor is reported free", () => {
    const changes: number[] = [];
    const player = track(
      new VoicePlayer(
        {
          playFrames: () => Promise.resolve(),
          endSession: () => undefined,
        },
        () => changes.push(player.activeSessions.length),
      ),
    );

    player.handlePacket(makeStartPacket(1), "peer1");
    player.handlePacket(makeDataPacket(1, 1), "peer1");
    jest.advanceTimersByTime(400); // past the jitter buffer, still talking
    expect(player.activeSessions).toHaveLength(1);
    expect(changes).toHaveLength(0);

    // They walk off. No END, no CANCELED, just silence.
    jest.advanceTimersByTime(3_000);
    expect(player.activeSessions).toHaveLength(0);
    // And somebody was told, rather than the burst quietly disappearing from a
    // list nothing re-reads.
    expect(changes).toEqual([0]);
  });
});

describe("VoicePlayer", () => {
  let playedFrames: Uint8Array[][];
  let endedSessions: string[];
  let backend: AudioPlaybackBackend;

  beforeEach(() => {
    playedFrames = [];
    endedSessions = [];
    backend = {
      playFrames: async (_burstIDHex, _codec, frames) => {
        playedFrames.push(frames);
      },
      endSession: (burstIDHex) => {
        endedSessions.push(burstIDHex);
      },
    };
  });

  it("creates a session on first (START) packet", () => {
    const player = track(new VoicePlayer(backend));
    player.handlePacket(makeStartPacket(1), "peerA");
    expect(player.activeSessions).toHaveLength(1);
    expect(player.activeSessions[0].senderPeerID).toBe("peerA");
    player.close();
  });

  it("creates separate sessions for different senders", () => {
    const player = track(new VoicePlayer(backend));
    player.handlePacket(makeStartPacket(1), "peerA");
    player.handlePacket(makeStartPacket(2), "peerB");
    expect(player.activeSessions).toHaveLength(2);
    player.close();
  });

  it("starts playing from DATA when the START was missed", () => {
    // This used to discard the burst, which meant one lost packet at the head
    // silenced the whole thing, and walking into range mid-sentence got you
    // nothing until the talker let go and pressed again. The codec is not in
    // doubt (0x01 is the only value the format defines), so a burst can be
    // picked up from any DATA packet. Receive-side only: nothing on the wire
    // changes and a bitchat sender does nothing differently.
    const player = track(new VoicePlayer(backend));
    player.handlePacket(makeDataPacket(1, 1), "peerA");
    expect(player.activeSessions).toHaveLength(1);
    player.close();
  });

  it("accepts DATA after START", () => {
    const player = track(new VoicePlayer(backend));
    player.handlePacket(makeStartPacket(1), "peerA");
    expect(() =>
      player.handlePacket(makeDataPacket(1, 1), "peerA"),
    ).not.toThrow();
    player.close();
  });

  it("ignores packets with invalid payload", () => {
    const player = track(new VoicePlayer(backend));
    const badPkt: Packet = {
      type: PacketType.VOICE_FRAME,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8),
      recipientID: new Uint8Array(8),
      timestamp: 0,
      signature: new Uint8Array(64),
      payload: new Uint8Array(3), // too short
    };
    expect(() => player.handlePacket(badPkt, "peerX")).not.toThrow();
    expect(player.activeSessions).toHaveLength(0);
    player.close();
  });

  it("closes all sessions on player.close()", () => {
    const player = track(new VoicePlayer(backend));
    player.handlePacket(makeStartPacket(1), "peerA");
    player.handlePacket(makeStartPacket(2), "peerB");
    expect(player.activeSessions).toHaveLength(2);
    player.close();
    expect(player.activeSessions).toHaveLength(0);
  });

  it("does not create a new session for the same sender+burstID", () => {
    const player = track(new VoicePlayer(backend));
    player.handlePacket(makeStartPacket(42), "peerA");
    player.handlePacket(makeDataPacket(42, 1), "peerA");
    player.handlePacket(makeDataPacket(42, 2), "peerA");
    expect(player.activeSessions).toHaveLength(1);
    player.close();
  });

  it("uses codec from START packet (AAC-LC 16 kHz mono = 0x01)", () => {
    expect(VoiceCodec.AAC_LC_16KHZ_MONO).toBe(0x01);
  });
});

describe("VoicePlayer resource caps", () => {
  // A room where a lot of people talk at once must not grow a jitter buffer per
  // talker without limit. Only one burst can be making sound anyway.
  it("evicts the oldest burst past the concurrency cap", () => {
    const played: string[] = [];
    const player = track(
      new VoicePlayer({
        playFrames: (burstIDHex) => {
          played.push(burstIDHex);
          return Promise.resolve();
        },
        endSession: () => undefined,
      }),
    );

    for (let i = 0; i < 12; i++) {
      const burstID = new Uint8Array(8).fill(i + 1);
      player.handlePacket(
        {
          type: PacketType.VOICE_FRAME,
          ttl: 7,
          flags: Flags.SIGNED,
          senderID: new Uint8Array(8).fill(i + 1),
          recipientID: new Uint8Array(8),
          timestamp: Date.now(),
          signature: new Uint8Array(64),
          payload: encodeBurstStart(burstID, VoiceCodec.AAC_LC_16KHZ_MONO),
        },
        `peer${String(i)}`,
      );
    }

    expect(player.activeSessions.length).toBeLessThanOrEqual(8);
    player.close();
  });
});

// A peer in Bluetooth range can send whatever it likes for as long as it likes,
// and an honest client's own 120-second limit is no defence because a hostile
// one simply does not have it. These pin the inbound ceilings that stop one
// talker holding the floor indefinitely. Matches bitchat's pttMaxBurstBytes and
// pttInboundMaxBytesPerSecond.
describe("VoicePlayer inbound burst caps", () => {
  function makeBackend(): AudioPlaybackBackend {
    return {
      playFrames: async () => {
        /* discard: these tests assert session lifecycle, not audio */
      },
      endSession: () => {
        /* no-op */
      },
    };
  }

  it("cuts off a burst that exceeds the per-second rate", () => {
    const player = track(new VoicePlayer(makeBackend()));
    player.handlePacket(makeStartPacket(1), "aabbccdd00112233");
    expect(player.activeSessions).toHaveLength(1);

    // 6 KiB/s with 2s of startup slack means ~12 KiB is the most a brand-new
    // burst may deliver. Firing 30 KiB of well-formed packets back to back is
    // not speech, it is someone holding the floor.
    for (let seq = 1; seq <= 200; seq++) {
      player.handlePacket(
        makeDataPacket(1, seq, new Uint8Array(150)),
        "aabbccdd00112233",
      );
    }

    expect(player.activeSessions).toHaveLength(0);
  });

  it("keeps a burst arriving at a plausible speech rate", () => {
    const player = track(new VoicePlayer(makeBackend()));
    player.handlePacket(makeStartPacket(2), "aabbccdd00112233");

    // Real speech is ~2 KiB/s; a few hundred bytes per packet is normal.
    for (let seq = 1; seq <= 10; seq++) {
      player.handlePacket(
        makeDataPacket(2, seq, new Uint8Array(200)),
        "aabbccdd00112233",
      );
    }

    expect(player.activeSessions).toHaveLength(1);
  });

  it("does not hand a cut-off burst a fresh budget", () => {
    // The flaw this guards: tearing the session down freed the slot, and the
    // NEXT packet of the same flood opened a replacement with its byte count
    // back at zero. A peer could then stream forever, one cap at a time.
    const player = track(new VoicePlayer(makeBackend()));
    player.handlePacket(makeStartPacket(3), "aabbccdd00112233");
    for (let seq = 1; seq <= 200; seq++) {
      player.handlePacket(
        makeDataPacket(3, seq, new Uint8Array(150)),
        "aabbccdd00112233",
      );
    }
    expect(player.activeSessions).toHaveLength(0);

    // More of the same burst must NOT reopen it.
    for (let seq = 201; seq <= 260; seq++) {
      player.handlePacket(
        makeDataPacket(3, seq, new Uint8Array(150)),
        "aabbccdd00112233",
      );
    }
    expect(player.activeSessions).toHaveLength(0);

    // A genuinely new burst from the same peer is unaffected: a burst is
    // identified by 8 random bytes, so this is a different conversation.
    player.handlePacket(makeStartPacket(4), "aabbccdd00112233");
    expect(player.activeSessions).toHaveLength(1);
  });
});

// Three people in a room, two of them talking. There is one speaker, so only
// one of them can be heard; the question is whether the third person hears one
// voice cleanly or two voices shredding each other.
describe("two people talking at once", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  function playerWithLog(): {
    player: VoicePlayer;
    played: string[];
    ended: string[];
  } {
    const played: string[] = [];
    const ended: string[] = [];
    const player = track(
      new VoicePlayer({
        playFrames: (burstIDHex) => {
          played.push(burstIDHex);
          return Promise.resolve();
        },
        endSession: (burstIDHex) => {
          ended.push(burstIDHex);
        },
      }),
    );
    return { player, played, ended };
  }

  // The hex spelling of burstID(seed): eight copies of the same byte.
  const hex = (seed: number): string =>
    seed.toString(16).padStart(2, "0").repeat(8);

  it("plays only the first talker, and keeps counting both", () => {
    const { player, played } = playerWithLog();

    player.handlePacket(makeStartPacket(1), "alice");
    player.handlePacket(makeDataPacket(1, 1), "alice");
    jest.advanceTimersByTime(400);

    // Bob keys up while Alice still has the floor.
    player.handlePacket(makeStartPacket(2), "bob");
    for (let seq = 1; seq <= 5; seq++) {
      player.handlePacket(makeDataPacket(2, seq), "bob");
      player.handlePacket(makeDataPacket(1, seq + 1), "alice");
      jest.advanceTimersByTime(400);
    }

    // Every batch that reached the speaker was Alice's. Bob never took it away
    // from her mid-sentence, which is what made both unintelligible.
    expect(played.length).toBeGreaterThan(0);
    expect(new Set(played)).toEqual(new Set([hex(1)]));
    // Both are still talkers: the banner says two people are speaking, and
    // Bob's voice note still arrives afterwards.
    expect(player.activeSessions).toHaveLength(2);
  });

  it("hands the floor to whoever is still talking when the first stops", () => {
    const { player, played } = playerWithLog();

    player.handlePacket(makeStartPacket(1), "alice");
    player.handlePacket(makeDataPacket(1, 1), "alice");
    player.handlePacket(makeStartPacket(2), "bob");
    player.handlePacket(makeDataPacket(2, 1), "bob");
    jest.advanceTimersByTime(400);
    expect(new Set(played)).toEqual(new Set([hex(1)]));

    // Alice stops. Bob talks through her silence, so his session stays open
    // while hers ages out on the idle timeout.
    let bobSeq = 2;
    for (let i = 0; i < 10; i++) {
      player.handlePacket(makeDataPacket(2, bobSeq++), "bob");
      jest.advanceTimersByTime(400);
    }

    expect(player.activeSessions).toHaveLength(1);
    expect(played).toContain(hex(2));
  });

  it("silences a retracted burst instead of letting its tail play out", () => {
    const { player, ended } = playerWithLog();

    player.handlePacket(makeStartPacket(1), "alice");
    player.handlePacket(makeDataPacket(1, 1), "alice");
    jest.advanceTimersByTime(400);

    player.handlePacket(makeCanceledPacket(1), "alice");
    // Up to two seconds of what she took back can still be queued in the audio
    // pipeline; ending the session is what stops it being heard.
    expect(ended).toEqual([hex(1)]);
    expect(player.activeSessions).toHaveLength(0);
  });
});
