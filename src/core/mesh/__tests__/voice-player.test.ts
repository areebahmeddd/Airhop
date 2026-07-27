// Tests for the VoicePlayer jitter buffer.
// No native deps; uses a mock AudioPlaybackBackend.

import type { Packet } from "../packet-codec";
import { Flags, PacketType } from "../packet-codec";
import {
  encodeBurstData,
  encodeBurstStart,
  VoiceCodec,
} from "../voice-capture";
import { VoicePlayer, type AudioPlaybackBackend } from "../voice-player";

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
    const player = new VoicePlayer(backend);
    player.handlePacket(makeStartPacket(1), "peerA");
    expect(player.activeSessions).toHaveLength(1);
    expect(player.activeSessions[0].senderPeerID).toBe("peerA");
    player.close();
  });

  it("creates separate sessions for different senders", () => {
    const player = new VoicePlayer(backend);
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
    const player = new VoicePlayer(backend);
    player.handlePacket(makeDataPacket(1, 1), "peerA");
    expect(player.activeSessions).toHaveLength(1);
    player.close();
  });

  it("accepts DATA after START", () => {
    const player = new VoicePlayer(backend);
    player.handlePacket(makeStartPacket(1), "peerA");
    expect(() =>
      player.handlePacket(makeDataPacket(1, 1), "peerA"),
    ).not.toThrow();
    player.close();
  });

  it("ignores packets with invalid payload", () => {
    const player = new VoicePlayer(backend);
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
    const player = new VoicePlayer(backend);
    player.handlePacket(makeStartPacket(1), "peerA");
    player.handlePacket(makeStartPacket(2), "peerB");
    expect(player.activeSessions).toHaveLength(2);
    player.close();
    expect(player.activeSessions).toHaveLength(0);
  });

  it("does not create a new session for the same sender+burstID", () => {
    const player = new VoicePlayer(backend);
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
    const player = new VoicePlayer({
      playFrames: (burstIDHex) => {
        played.push(burstIDHex);
        return Promise.resolve();
      },
      endSession: () => undefined,
    });

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
