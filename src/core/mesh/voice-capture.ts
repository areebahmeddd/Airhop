// Push-to-talk voice capture: encodes audio into VOICE_FRAME (0x29) packets.
//
// Architecture: audio capture is delegated to an AudioCaptureBackend interface.
// The platform implementation (expo-av, react-native-audio-api, etc.) provides
// raw PCM callbacks; this module handles PTT session state, frame sequencing,
// and packet construction.
//
// VOICE_FRAME payload format (matches bitchat VoiceBurstPacket.swift):
//   [burstID: 8 bytes][seq: u16 BE][flags: u8][type-specific payload]
//
//   flags 0x01 (START):    payload = [codec: u8]
//   flags 0x00 (DATA):     payload = [len: u16 BE][AAC frame]... (1+ frames)
//   flags 0x02 (END):      payload = [totalDataPackets: u16 BE][durationMs: u32 BE]
//   flags 0x04 (CANCELED): payload empty; receivers discard the burst
//
// seq 0 is reserved for the START packet. DATA packets start at seq 1.
// Codec 0x01 = AAC-LC 16 kHz mono (matches VoiceBurstCodec.aacLC16kMono).
//
// DATA packets batch multiple encoded frames (each prefixed with a u16 length)
// into a single VOICE_FRAME packet up to PTT_MAX_BURST_BYTES (210 bytes) so
// the packet never needs BLE fragmentation.
import { randomBytes } from "@noble/hashes/utils.js";
import {
  Flags,
  PacketType,
  signPacket,
  type Packet,
} from "../mesh/packet-codec";

// ---- Constants (per PUSH-TO-TALK-DESIGN.md / VoiceBurstPacket.swift) --------

// Codec values: must match VoiceBurstCodec in bitchat.
export const VoiceCodec = {
  AAC_LC_16KHZ_MONO: 0x01, // VoiceBurstCodec.aacLC16kMono
} as const;

export type VoiceCodecId = (typeof VoiceCodec)[keyof typeof VoiceCodec];

// Burst packet flag values.
export const BurstFlags = {
  DATA: 0x00, // Audio data frames
  START: 0x01, // Session open (carries codec byte)
  END: 0x02, // Session close (carries stats)
  CANCELED: 0x04, // Session aborted
} as const;

// Maximum encoded bytes per DATA packet payload (content budget per packet).
// Matches TransportConfig.pttMaxBurstContentBytes = 210 in bitchat.
const PTT_MAX_BURST_BYTES = 210;

// Maximum frames per DATA packet (guard against misconfiguration).
const MAX_FRAMES_PER_PACKET = 8;

// Fixed burst packet header size: burstID(8) + seq(2) + flags(1) = 11 bytes.
const BURST_HEADER_SIZE = 11;

const BURST_ID_SIZE = 8;

// ---- Types ------------------------------------------------------------------

export interface VoiceCaptureConfig {
  senderPeerID: string; // 16 hex chars
  signingPrivKey: Uint8Array;
  codec?: VoiceCodecId;
  onPacket: (packet: Packet) => void;
}

export interface AudioCaptureBackend {
  startCapture(onFrame: (frameData: Uint8Array) => void): Promise<void>;
  stopCapture(): Promise<void>;
}

// ---- VoiceCaptureSession ----------------------------------------------------

export class VoiceCaptureSession {
  private readonly config: VoiceCaptureConfig;
  private readonly backend: AudioCaptureBackend;
  private readonly codec: VoiceCodecId;

  private active = false;
  private burstID = new Uint8Array(BURST_ID_SIZE);
  private seq = 0; // next seq to emit (0 = START, 1+ = DATA)
  private dataPacketCount = 0;
  private burstStartMs = 0;
  private pendingFrames: Uint8Array[] = [];
  private pendingSize = 0;
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

  // Begin a PTT burst: sends START packet, begins capturing.
  async startPtt(): Promise<void> {
    if (this.active) return;
    this.active = true;
    this.burstID = randomBytes(BURST_ID_SIZE);
    this.seq = 0;
    this.dataPacketCount = 0;
    this.burstStartMs = Date.now();
    this.pendingFrames = [];
    this.pendingSize = 0;

    // Send START packet (seq=0).
    this.emit(encodeBurstStart(this.burstID, this.codec));
    this.seq = 1;

    await this.backend.startCapture((frameData) => {
      if (this.active) this.addFrame(frameData);
    });
  }

  // End the PTT burst: flush pending frames, send END packet.
  async stopPtt(): Promise<void> {
    if (!this.active) return;
    this.active = false;
    await this.backend.stopCapture();

    // Flush any buffered frames.
    this.flushPending();

    const durationMs = Date.now() - this.burstStartMs;
    this.emit(
      encodeBurstEnd(this.burstID, this.seq, this.dataPacketCount, durationMs),
    );
  }

  // Abort the PTT burst: send CANCELED packet, discard pending frames.
  async cancelPtt(): Promise<void> {
    if (!this.active) return;
    this.active = false;
    await this.backend.stopCapture();
    this.pendingFrames = [];
    this.pendingSize = 0;
    this.emit(encodeBurstCanceled(this.burstID, this.seq));
  }

  get isActive(): boolean {
    return this.active;
  }

  // ---- Private ----------------------------------------------------------------

  private addFrame(frameData: Uint8Array): void {
    const frameCost = 2 + frameData.length; // u16 length prefix + data
    // If adding this frame would exceed the budget or the frame count limit,
    // flush what we have first.
    if (
      this.pendingFrames.length > 0 &&
      (BURST_HEADER_SIZE + this.pendingSize + frameCost > PTT_MAX_BURST_BYTES ||
        this.pendingFrames.length >= MAX_FRAMES_PER_PACKET)
    ) {
      this.flushPending();
    }
    this.pendingFrames.push(frameData);
    this.pendingSize += frameCost;
  }

  private flushPending(): void {
    if (this.pendingFrames.length === 0) return;
    const payload = encodeBurstData(this.burstID, this.seq, this.pendingFrames);
    this.seq = (this.seq + 1) & 0xffff;
    this.dataPacketCount = (this.dataPacketCount + 1) & 0xffff;
    this.pendingFrames = [];
    this.pendingSize = 0;
    this.emit(payload);
  }

  private emit(burstPayload: Uint8Array): void {
    const packet: Packet = {
      type: PacketType.VOICE_FRAME,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: this.senderIDBytes,
      recipientID: new Uint8Array(8), // broadcast
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload: burstPayload,
    };
    packet.signature = signPacket(packet, this.config.signingPrivKey);
    this.config.onPacket(packet);
  }
}

// ---- VoiceBurstPacket encode/decode -----------------------------------------
// Matches VoiceBurstPacket.swift / encode() and decode() exactly.

function writeBurstHeader(
  buf: Uint8Array,
  burstID: Uint8Array,
  seq: number,
  flags: number,
): void {
  buf.set(burstID.slice(0, BURST_ID_SIZE), 0);
  new DataView(buf.buffer).setUint16(BURST_ID_SIZE, seq & 0xffff, false);
  buf[BURST_ID_SIZE + 2] = flags;
}

// START packet: [burstID:8][seq:2][0x01][codec:1]
export function encodeBurstStart(
  burstID: Uint8Array,
  codec: VoiceCodecId,
): Uint8Array {
  const buf = new Uint8Array(BURST_HEADER_SIZE + 1);
  writeBurstHeader(buf, burstID, 0, BurstFlags.START);
  buf[BURST_HEADER_SIZE] = codec;
  return buf;
}

// DATA packet: [burstID:8][seq:2][0x00][len:2][frame]...(repeating)
export function encodeBurstData(
  burstID: Uint8Array,
  seq: number,
  frames: readonly Uint8Array[],
): Uint8Array {
  let dataSize = 0;
  for (const f of frames) dataSize += 2 + f.length;
  const buf = new Uint8Array(BURST_HEADER_SIZE + dataSize);
  writeBurstHeader(buf, burstID, seq, BurstFlags.DATA);
  let off = BURST_HEADER_SIZE;
  for (const f of frames) {
    new DataView(buf.buffer).setUint16(off, f.length, false);
    off += 2;
    buf.set(f, off);
    off += f.length;
  }
  return buf;
}

// END packet: [burstID:8][seq:2][0x02][totalDataPackets:2][durationMs:4]
export function encodeBurstEnd(
  burstID: Uint8Array,
  seq: number,
  totalDataPackets: number,
  durationMs: number,
): Uint8Array {
  const buf = new Uint8Array(BURST_HEADER_SIZE + 6);
  writeBurstHeader(buf, burstID, seq, BurstFlags.END);
  const view = new DataView(buf.buffer);
  view.setUint16(BURST_HEADER_SIZE, totalDataPackets & 0xffff, false);
  view.setUint32(BURST_HEADER_SIZE + 2, durationMs >>> 0, false);
  return buf;
}

// CANCELED packet: [burstID:8][seq:2][0x04]
export function encodeBurstCanceled(
  burstID: Uint8Array,
  seq: number,
): Uint8Array {
  const buf = new Uint8Array(BURST_HEADER_SIZE);
  writeBurstHeader(buf, burstID, seq, BurstFlags.CANCELED);
  return buf;
}

// ---- Parsed burst packet types ----------------------------------------------

export type BurstPacket =
  | { kind: "start"; burstID: Uint8Array; seq: number; codec: VoiceCodecId }
  | { kind: "data"; burstID: Uint8Array; seq: number; frames: Uint8Array[] }
  | {
      kind: "end";
      burstID: Uint8Array;
      seq: number;
      totalDataPackets: number;
      durationMs: number;
    }
  | { kind: "canceled"; burstID: Uint8Array; seq: number };

export function decodeBurstPacket(payload: Uint8Array): BurstPacket | null {
  if (payload.length < BURST_HEADER_SIZE) return null;
  const burstID = payload.slice(0, BURST_ID_SIZE);
  const seq = new DataView(
    payload.buffer,
    payload.byteOffset + BURST_ID_SIZE,
  ).getUint16(0, false);
  const flags = payload[BURST_ID_SIZE + 2];
  const rest = payload.slice(BURST_HEADER_SIZE);

  switch (flags) {
    case BurstFlags.START: {
      if (rest.length < 1) return null;
      const codec = rest[0] as VoiceCodecId;
      if (codec !== VoiceCodec.AAC_LC_16KHZ_MONO) return null;
      return { kind: "start", burstID, seq, codec };
    }
    case BurstFlags.DATA: {
      const frames: Uint8Array[] = [];
      let off = 0;
      while (off + 2 <= rest.length && frames.length < MAX_FRAMES_PER_PACKET) {
        const len = new DataView(rest.buffer, rest.byteOffset + off).getUint16(
          0,
          false,
        );
        off += 2;
        if (off + len > rest.length) return null;
        frames.push(rest.slice(off, off + len));
        off += len;
      }
      if (frames.length === 0) return null;
      return { kind: "data", burstID, seq, frames };
    }
    case BurstFlags.END: {
      if (rest.length < 6) return null;
      const view = new DataView(rest.buffer, rest.byteOffset);
      const totalDataPackets = view.getUint16(0, false);
      const durationMs = view.getUint32(2, false);
      return { kind: "end", burstID, seq, totalDataPackets, durationMs };
    }
    case BurstFlags.CANCELED:
      return { kind: "canceled", burstID, seq };
    default:
      return null;
  }
}
