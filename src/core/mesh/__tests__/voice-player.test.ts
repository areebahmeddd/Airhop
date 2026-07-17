// Tests for the VoicePlayer jitter buffer.
// No native deps; uses a mock AudioPlaybackBackend.

import type { Packet } from "../packet-codec";
import { Flags, PacketType } from "../packet-codec";
import { buildVoiceFramePayload, VoiceCodec } from "../voice-capture";
import { VoicePlayer, type AudioPlaybackBackend } from "../voice-player";

function makeVoicePacket(
  sessionId: number,
  seq: number,
  isLast: boolean,
  frameData?: Uint8Array,
): Packet {
  const data = frameData ?? new Uint8Array([seq & 0xff]);
  return {
    type: PacketType.VOICE_FRAME,
    ttl: 7,
    flags: Flags.SIGNED,
    senderID: new Uint8Array(8),
    recipientID: new Uint8Array(8),
    timestamp: Math.floor(Date.now() / 1000),
    nonce: new Uint8Array(8),
    signature: new Uint8Array(64),
    payload: buildVoiceFramePayload(
      sessionId,
      seq,
      VoiceCodec.AAC_LC_16KHZ_MONO,
      isLast,
      data,
    ),
  };
}

describe("VoicePlayer", () => {
  let playedFrames: Uint8Array[][];
  let endedSessions: number[];
  let backend: AudioPlaybackBackend;

  beforeEach(() => {
    playedFrames = [];
    endedSessions = [];
    backend = {
      playFrames: async (_sessionId, _codec, frames) => {
        playedFrames.push(frames);
      },
      endSession: (sessionId) => {
        endedSessions.push(sessionId);
      },
    };
  });

  it("creates a session on first packet", () => {
    const player = new VoicePlayer(backend);
    const pkt = makeVoicePacket(1, 0, false);
    player.handlePacket(pkt, "peerA");
    expect(player.activeSessions).toHaveLength(1);
    expect(player.activeSessions[0].senderPeerID).toBe("peerA");
    player.close();
  });

  it("creates separate sessions for different senders", () => {
    const player = new VoicePlayer(backend);
    player.handlePacket(makeVoicePacket(1, 0, false), "peerA");
    player.handlePacket(makeVoicePacket(2, 0, false), "peerB");
    expect(player.activeSessions).toHaveLength(2);
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
      nonce: new Uint8Array(8),
      signature: new Uint8Array(64),
      payload: new Uint8Array(3), // too short - invalid
    };
    expect(() => player.handlePacket(badPkt, "peerX")).not.toThrow();
    expect(player.activeSessions).toHaveLength(0);
    player.close();
  });

  it("closes all sessions on player.close()", () => {
    const player = new VoicePlayer(backend);
    player.handlePacket(makeVoicePacket(1, 0, false), "peerA");
    player.handlePacket(makeVoicePacket(2, 0, false), "peerB");
    expect(player.activeSessions).toHaveLength(2);
    player.close();
    expect(player.activeSessions).toHaveLength(0);
  });

  it("does not create a new session for the same sender+sessionId", () => {
    const player = new VoicePlayer(backend);
    player.handlePacket(makeVoicePacket(42, 0, false), "peerA");
    player.handlePacket(makeVoicePacket(42, 1, false), "peerA");
    player.handlePacket(makeVoicePacket(42, 2, false), "peerA");
    expect(player.activeSessions).toHaveLength(1);
    player.close();
  });
});
