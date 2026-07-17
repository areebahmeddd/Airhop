// Video frame capture: encodes video into VIDEO_FRAME (0x30) packets.
//
// VIDEO_FRAME is a WiFi-Direct-only packet type (per PROTOCOLS.md and
// ROADMAP.md). BLE (~15 KB/s) is far too slow for any video; this transport
// requires WiFi Aware (Android) or MultipeerConnectivity (iOS) to be active.
//
// Architecture: video capture is delegated to a VideoCaptureBackend interface.
// The platform implementation uses react-native-vision-camera v5. This module
// handles session state, frame sequencing, and packet construction.
//
// VIDEO_FRAME payload format (Airhop extension, PROTOCOLS.md 0x30):
//   [0–3]   u32-BE  session_id    groups all frames from one call session
//   [4–7]   u32-BE  frame_seq     frame index within session (0-based)
//   [8–9]   u16-BE  width         encoded width in pixels
//   [10–11] u16-BE  height        encoded height in pixels
//   [12]    u8      codec         0x01 = HEVC/H.265
//   [13]    u8      flags         bit 0: key_frame, bit 1: is_last
//   [14+]   bytes   frame_data    encoded HEVC frame bytes
//
// Target profile: 480p / 15 fps for compatibility with WiFi Aware bandwidth.

import { randomBytes } from "@noble/hashes/utils.js";
import { Flags, PacketType, signPacket, type Packet } from "./packet-codec";

// ---- Video frame payload constants ------------------------------------------

export const VideoCodec = {
  HEVC: 0x01, // H.265 / HEVC
} as const;

export type VideoCodecId = (typeof VideoCodec)[keyof typeof VideoCodec];

const FLAG_KEY_FRAME = 0x01;
const FLAG_IS_LAST = 0x02;

// Header is 14 bytes: session_id(4) + frame_seq(4) + width(2) + height(2) + codec(1) + flags(1)
export const VIDEO_FRAME_HEADER_SIZE = 14;

// ---- Types ------------------------------------------------------------------

export interface VideoSessionConfig {
  senderPeerID: string; // 16 hex chars
  signingPrivKey: Uint8Array;
  width?: number; // default 854 (480p landscape)
  height?: number; // default 480
  codec?: VideoCodecId;
  // Called with a completed VIDEO_FRAME packet ready for WiFi transport.
  onPacket: (packet: Packet) => void;
}

// The platform backend produces raw encoded HEVC frames. Injected to keep
// this module free of react-native-vision-camera imports and testable.
export interface VideoCaptureBackend {
  // Start encoding. Calls onFrame with each key/delta frame.
  // width and height are hints for the encoder.
  startCapture(
    width: number,
    height: number,
    onFrame: (frameData: Uint8Array, isKeyFrame: boolean) => void,
  ): Promise<void>;
  // Stop encoding and flush pending frames.
  stopCapture(): Promise<void>;
}

// ---- VideoFrame header utilities --------------------------------------------

export interface VideoFrameHeader {
  sessionId: number;
  frameSeq: number;
  width: number;
  height: number;
  codec: VideoCodecId;
  isKeyFrame: boolean;
  isLast: boolean;
}

export function encodeVideoFramePayload(
  header: VideoFrameHeader,
  frameData: Uint8Array,
): Uint8Array {
  const payload = new Uint8Array(VIDEO_FRAME_HEADER_SIZE + frameData.length);
  const dv = new DataView(payload.buffer);
  dv.setUint32(0, header.sessionId, false);
  dv.setUint32(4, header.frameSeq, false);
  dv.setUint16(8, header.width, false);
  dv.setUint16(10, header.height, false);
  payload[12] = header.codec;
  let flags = 0;
  if (header.isKeyFrame) flags |= FLAG_KEY_FRAME;
  if (header.isLast) flags |= FLAG_IS_LAST;
  payload[13] = flags;
  payload.set(frameData, VIDEO_FRAME_HEADER_SIZE);
  return payload;
}

export function parseVideoFramePayload(
  payload: Uint8Array,
): { header: VideoFrameHeader; frameData: Uint8Array } | null {
  if (payload.length < VIDEO_FRAME_HEADER_SIZE) return null;
  const dv = new DataView(payload.buffer, payload.byteOffset);
  const flags = payload[13];
  return {
    header: {
      sessionId: dv.getUint32(0, false),
      frameSeq: dv.getUint32(4, false),
      width: dv.getUint16(8, false),
      height: dv.getUint16(10, false),
      codec: payload[12] as VideoCodecId,
      isKeyFrame: (flags & FLAG_KEY_FRAME) !== 0,
      isLast: (flags & FLAG_IS_LAST) !== 0,
    },
    frameData: payload.slice(VIDEO_FRAME_HEADER_SIZE),
  };
}

// ---- VideoCapture -----------------------------------------------------------

export class VideoCapture {
  private readonly config: VideoSessionConfig;
  private readonly backend: VideoCaptureBackend;
  private readonly codec: VideoCodecId;
  private readonly width: number;
  private readonly height: number;

  private active = false;
  private sessionId = 0;
  private frameSeq = 0;
  private readonly senderIDBytes: Uint8Array;

  constructor(config: VideoSessionConfig, backend: VideoCaptureBackend) {
    this.config = config;
    this.backend = backend;
    this.codec = config.codec ?? VideoCodec.HEVC;
    this.width = config.width ?? 854; // 480p landscape
    this.height = config.height ?? 480;

    this.senderIDBytes = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
      this.senderIDBytes[i] = parseInt(
        config.senderPeerID.slice(i * 2, i * 2 + 2),
        16,
      );
    }
  }

  // Begin a video call session. Resolves once the encoder is running.
  async startSession(): Promise<void> {
    if (this.active) return;
    this.active = true;
    this.sessionId = generateSessionId();
    this.frameSeq = 0;

    await this.backend.startCapture(
      this.width,
      this.height,
      (frameData, isKeyFrame) => {
        if (this.active) this.emitFrame(frameData, isKeyFrame, false);
      },
    );
  }

  // End the video call. Sends a final frame with is_last=1.
  async stopSession(): Promise<void> {
    if (!this.active) return;
    this.active = false;

    await this.backend.stopCapture();
    // Send an empty last frame to signal end-of-session to the receiver.
    this.emitFrame(new Uint8Array(0), false, true);
  }

  private emitFrame(
    frameData: Uint8Array,
    isKeyFrame: boolean,
    isLast: boolean,
  ): void {
    const header: VideoFrameHeader = {
      sessionId: this.sessionId,
      frameSeq: this.frameSeq++,
      width: this.width,
      height: this.height,
      codec: this.codec,
      isKeyFrame,
      isLast,
    };

    const payload = encodeVideoFramePayload(header, frameData);

    const packet: Packet = {
      type: PacketType.VIDEO_FRAME,
      ttl: 1, // WiFi Direct only; must not be relayed over BLE mesh
      flags: Flags.SIGNED,
      senderID: this.senderIDBytes,
      recipientID: new Uint8Array(8), // broadcast within WiFi session
      timestamp: Math.floor(Date.now() / 1000),
      nonce: randomBytes(8),
      signature: new Uint8Array(64),
      payload,
    };
    packet.signature = signPacket(packet, this.config.signingPrivKey);
    this.config.onPacket(packet);
  }

  get isActive(): boolean {
    return this.active;
  }
}

// Random 32-bit session ID.
function generateSessionId(): number {
  const b = randomBytes(4);
  return ((b[0] << 24) | (b[1] << 16) | (b[2] << 8) | b[3]) >>> 0;
}
