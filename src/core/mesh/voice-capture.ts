// Push-to-talk voice capture: encodes audio into VOICE_FRAME (0x29) packets.
//
// Architecture: audio capture is delegated to an AudioCaptureBackend interface.
// The platform implementation (expo-av, react-native-audio-api, etc.) provides
// raw PCM callbacks; this module handles PTT session state, frame sequencing,
// and packet construction.
//
// VOICE_FRAME payload format (Airhop extension, not part of bitchat v2):
//   [0–3]  u32-BE  session_id   groups all frames from one PTT press
//   [4–5]  u16-BE  seq          frame index within session (0-based)
//   [6]    u8      codec        0x00 = AAC-LC 16kHz mono, 0x01 = Opus 16kHz mono
//   [7]    u8      flags        bit 0: is_last (end of session)
//   [8+]   bytes   frame_data   encoded audio bytes
//
// Broadcast cadence: frames are sent as they are produced by the encoder
// (typically 20–40 ms per frame for AAC/Opus). The TTL flood delivers them
// to all nearby peers simultaneously.

import { bytesToHex } from "@noble/hashes/utils.js";
import {
  Flags,
  PacketType,
  signPacket,
  type Packet,
} from "../mesh/packet-codec";

// ---- Voice frame payload format ---------------------------------------------

export const VoiceCodec = {
  AAC_LC_16KHZ_MONO: 0x00,
  OPUS_16KHZ_MONO: 0x01,
} as const;

export type VoiceCodecId = (typeof VoiceCodec)[keyof typeof VoiceCodec];

const FLAG_IS_LAST = 0x01;

// Header is 8 bytes: session_id(4) + seq(2) + codec(1) + flags(1)
const VOICE_FRAME_HEADER_SIZE = 8;

// ---- Types ------------------------------------------------------------------

export interface VoiceCaptureConfig {
  senderPeerID: string; // 16 hex chars
  signingPrivKey: Uint8Array;
  codec?: VoiceCodecId;
  onPacket: (packet: Packet) => void; // called per encoded frame
}

// Injected audio backend - the platform implementation satisfies this interface.
// Keeps VoiceCapture free of react-native dependencies and fully testable.
export interface AudioCaptureBackend {
  // Start capturing audio. The backend calls onFrame with each encoded chunk.
  startCapture(onFrame: (frameData: Uint8Array) => void): Promise<void>;
  // Stop capturing and flush any pending frames.
  stopCapture(): Promise<void>;
}

// ---- VoiceCaptureSession ----------------------------------------------------

export class VoiceCaptureSession {
  private readonly config: VoiceCaptureConfig;
  private readonly backend: AudioCaptureBackend;
  private readonly codec: VoiceCodecId;

  private active = false;
  private sessionId = 0;
  private seq = 0;
  private readonly senderIDBytes: Uint8Array;

  constructor(config: VoiceCaptureConfig, backend: AudioCaptureBackend) {
    this.config = config;
    this.backend = backend;
    this.codec = config.codec ?? VoiceCodec.AAC_LC_16KHZ_MONO;

    this.senderIDBytes = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
      this.senderIDBytes[i] = parseInt(
        config.senderPeerID.slice(i * 2, i * 2 + 2),
        16,
      );
    }
  }

  // Begin a PTT burst. Resolves once audio capture starts.
  async startPtt(): Promise<void> {
    if (this.active) return;
    this.active = true;
    this.sessionId = generateSessionId();
    this.seq = 0;

    await this.backend.startCapture((frameData) => {
      if (this.active) this.emitFrame(frameData, false);
    });
  }

  // End the PTT burst. Sends a final frame with is_last=1.
  async stopPtt(): Promise<void> {
    if (!this.active) return;
    this.active = false;

    await this.backend.stopCapture();
    // Emit a zero-byte last frame so receivers know the burst ended.
    this.emitFrame(new Uint8Array(0), true);
  }

  get isActive(): boolean {
    return this.active;
  }

  // ---- Private ---------------------------------------------------------------

  private emitFrame(frameData: Uint8Array, isLast: boolean): void {
    const payload = buildVoiceFramePayload(
      this.sessionId,
      this.seq,
      this.codec,
      isLast,
      frameData,
    );
    this.seq = (this.seq + 1) & 0xffff;

    const packet: Packet = {
      type: PacketType.VOICE_FRAME,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: this.senderIDBytes,
      recipientID: new Uint8Array(8), // broadcast
      timestamp: Math.floor(Date.now() / 1000),
      nonce: crypto.getRandomValues(new Uint8Array(8)),
      signature: new Uint8Array(64),
      payload,
    };
    packet.signature = signPacket(packet, this.config.signingPrivKey);
    this.config.onPacket(packet);
  }
}

// ---- Voice frame payload codec ----------------------------------------------

export function buildVoiceFramePayload(
  sessionId: number,
  seq: number,
  codec: VoiceCodecId,
  isLast: boolean,
  frameData: Uint8Array,
): Uint8Array {
  const buf = new Uint8Array(VOICE_FRAME_HEADER_SIZE + frameData.length);
  const view = new DataView(buf.buffer);
  view.setUint32(0, sessionId >>> 0, false); // u32-BE
  view.setUint16(4, seq & 0xffff, false); // u16-BE
  buf[6] = codec;
  buf[7] = isLast ? FLAG_IS_LAST : 0;
  buf.set(frameData, VOICE_FRAME_HEADER_SIZE);
  return buf;
}

export interface VoiceFrameHeader {
  sessionId: number;
  seq: number;
  codec: VoiceCodecId;
  isLast: boolean;
}

export function parseVoiceFramePayload(payload: Uint8Array): {
  header: VoiceFrameHeader;
  frameData: Uint8Array;
} | null {
  if (payload.length < VOICE_FRAME_HEADER_SIZE) return null;
  const view = new DataView(payload.buffer, payload.byteOffset);
  const sessionId = view.getUint32(0, false);
  const seq = view.getUint16(4, false);
  const codec = payload[6] as VoiceCodecId;
  const flags = payload[7];
  const isLast = (flags & FLAG_IS_LAST) !== 0;
  const frameData = payload.slice(VOICE_FRAME_HEADER_SIZE);

  return {
    header: { sessionId, seq, codec, isLast },
    frameData,
  };
}

// ---- Helpers ----------------------------------------------------------------

function generateSessionId(): number {
  // 32-bit random session ID; collisions are astronomically unlikely in
  // a local mesh with short session lifetimes.
  const buf = crypto.getRandomValues(new Uint8Array(4));
  return new DataView(buf.buffer).getUint32(0, false);
}

// Export for use in store/UI to display active PTT sessions.
export function sessionIdHex(sessionId: number): string {
  const buf = new Uint8Array(4);
  new DataView(buf.buffer).setUint32(0, sessionId >>> 0, false);
  return bytesToHex(buf);
}
