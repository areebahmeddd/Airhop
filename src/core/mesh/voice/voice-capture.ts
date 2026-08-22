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
// START is sent with the first captured frame, not when the button goes down.
// A burst is only real once there is audio in it, and announcing one before the
// microphone has produced anything is what turns a failed capture into a live
// bubble on the far side that never plays. See sendStartIfNeeded.
//
// DATA packets batch multiple encoded frames (each prefixed with a u16 length)
// into a single VOICE_FRAME packet up to PTT_MAX_BURST_BYTES (210 bytes) so
// the packet never needs BLE fragmentation.
import { bytesToHex, randomBytes } from "@noble/hashes/utils.js";
import {
  Flags,
  PacketType,
  signPacket,
  type Packet,
} from "../wire/packet-codec";

// ---- Constants (per PUSH-TO-TALK-DESIGN.md / VoiceBurstPacket.swift) ----

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

// How long one hold may keep sending. Matches bitchat's
// PTTCaptureEngine.maxCaptureDuration.
//
// Past this the session stays open but stops encoding: the gesture belongs to
// the user, so releasing still ends the burst normally with an END packet and
// still produces the voice note. Nothing is torn down under their finger. What
// stops is airtime, which matters because a burst is ~2 KiB/s of a link that
// carries ~18 KiB/s in total, and because every listener now cuts a burst off at
// its own inbound ceiling anyway. Enforcing it here means one sender stops
// sending, rather than every receiver independently deciding to stop listening.
export const MAX_BURST_MS = 120_000;

// Ceiling on the finalized voice note kept for a burst. At ~130 bytes a frame
// and 64 ms per frame this is a little over four minutes, well past the 512 KiB
// the file transfer would accept anyway; the cap is here so a stuck microphone
// cannot grow the array without bound.
const MAX_RECORDED_FRAMES = 4096;

// Fixed burst packet header size: burstID(8) + seq(2) + flags(1) = 11 bytes.
const BURST_HEADER_SIZE = 11;

const BURST_ID_SIZE = 8;

// One AAC-LC frame is 1024 samples, which at 16 kHz is 64 ms. The receiver
// fills a missing packet with exactly this much silence.
const MS_PER_FRAME = 64;

// When the repeats of a CANCELED packet go out, in ms after the first.
//
// CANCELED is the one packet in this format whose loss the receiver cannot
// recover from. A burst that simply stops is covered on both clients by a
// three-second idle timeout that turns it into a finished voice note, which is
// the right answer for a dropped END. There is no equivalent for a retraction:
// a lost CANCELED means the far side keeps and plays exactly the audio the
// talker asked it to throw away.
//
// It is also the packet most likely to be dropped, because it is written the
// instant a burst has finished saturating the link. So it goes out three times
// over a third of a second. Repeats are idempotent on every client (a CANCELED
// for a burst already gone is ignored), and the whole retraction costs 33 bytes.
const RETRACT_REPEAT_MS = [110, 330];

// Shortest hold that counts as having said something.
//
// Below this the press was a tap on the mic rather than a hold, and both ends
// should be left with nothing: the talker sees no bubble in their own thread,
// so a listener must not be holding a third of a second of audio as a voice
// note. That is why a short burst is RETRACTED and not ended - the same call
// bitchat makes in PTTLiveVoiceSession.finish(), which sends `.canceled` below
// its own minimum and deletes the file rather than delivering it.
//
// The threshold itself is ours, not bitchat's: theirs is 1 s, shared with their
// voice-note recorder. Airhop's recorder has no floor at all, so matching 1 s
// here would mean a 700 ms hold sends a note when nobody is in range and
// nothing when somebody is - the delivery strategy leaking into whether the
// message exists. 500 ms is short enough to be a tap and long enough that the
// two paths agree in every case a user can feel. Nothing on the wire depends on
// it: receivers enforce no minimum, on either client.
export const MIN_BURST_KEEP_MS = 500;

// ---- Types ----

export interface VoiceCaptureConfig {
  senderPeerID: string; // 16 hex chars
  signingPrivKey: Uint8Array;
  codec?: VoiceCodecId;
  // Emits a signed VOICE_FRAME packet for the public mesh.
  onPacket: (packet: Packet) => void;
  // Emits the same burst payload for a DM, where it rides inside the peer's
  // Noise session instead of being broadcast in the clear. When set, the burst
  // goes here and `onPacket` is not used: a DM burst must never also be
  // broadcast, or the audio meant for one person is heard by the whole room.
  //
  // Best-effort, like the broadcast path: a frame that cannot go out right now
  // is simply not sent. See emit().
  onDmPayload?: (payload: Uint8Array) => void;
}

export interface AudioCaptureBackend {
  startCapture(onFrame: (frameData: Uint8Array) => void): Promise<void>;
  stopCapture(): Promise<void>;
}

// ---- VoiceCaptureSession ----

export class VoiceCaptureSession {
  private readonly config: VoiceCaptureConfig;
  private readonly backend: AudioCaptureBackend;
  private readonly codec: VoiceCodecId;

  // Whether the microphone is open for this burst.
  //
  // One flag, because there is one thing that opens it and one thing that
  // closes it: the user's finger. Nothing else may end a burst early - not a
  // peer walking out of range, not a Noise session going away - because the
  // hold is also a recording, and a recording that stops when the radio does is
  // a message the talker loses half of without being told. The wire is
  // best-effort on top of that; see emit().
  //
  // Starts false, so a release or a cancel that arrives before the mic was ever
  // opened is a no-op rather than an END or a CANCELED for a zeroed burst ID.
  private open = false;
  // Whether this burst has announced itself. Until the first frame is captured
  // nobody has been told the burst exists, so there is nothing to end, nothing
  // to retract, and no bubble anywhere to clean up. See sendStartIfNeeded.
  private startSent = false;
  private burstID = new Uint8Array(BURST_ID_SIZE);
  private seq = 0; // next seq to emit (0 = START, 1+ = DATA)
  private dataPacketCount = 0;
  private burstStartMs = 0;
  private pendingFrames: Uint8Array[] = [];
  private pendingSize = 0;
  // Every frame sent this burst, kept so the same audio can be finalized as an
  // ordinary voice note when the talker lets go. That copy is what reaches
  // anyone who was out of range while it was live, and what stays in the chat
  // afterwards. Bounded: past the cap the burst is longer than anyone will
  // listen back to, and the live audio is unaffected either way.
  private recorded: Uint8Array[] = [];
  private recordedBytes = 0;
  // Pending repeats of this burst's CANCELED packet. See RETRACT_REPEAT_MS.
  private retractTimers: ReturnType<typeof setTimeout>[] = [];
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

  // Begin a PTT burst: opens the microphone. Nothing goes on the wire until the
  // first frame arrives - see sendStartIfNeeded.
  //
  // Throws if the microphone could not be opened. The burst is left closable
  // either way: the caller still has a finger on the button, and cancelPtt()
  // on a burst that never announced itself is correctly a no-op.
  async startPtt(): Promise<void> {
    if (this.open) return;
    this.open = true;
    this.startSent = false;
    this.clearRetractTimers();
    this.burstID = randomBytes(BURST_ID_SIZE);
    // seq 0 belongs to START, which is emitted with the first frame; DATA
    // packets number from 1 whether or not that has happened yet.
    this.seq = 1;
    this.dataPacketCount = 0;
    this.burstStartMs = Date.now();
    this.pendingFrames = [];
    this.pendingSize = 0;
    this.recorded = [];
    this.recordedBytes = 0;

    await this.backend.startCapture((frameData) => {
      if (this.open) this.addFrame(frameData);
    });
  }

  // End the PTT burst: flush pending frames, send END packet.
  async stopPtt(): Promise<void> {
    if (!this.open) return;
    this.open = false;
    await this.backend.stopCapture();

    // A hold too short to be a message is retracted, not ended. See
    // MIN_BURST_KEEP_MS: the tail is deliberately not flushed first, because
    // the point is that nothing survives this press on either side.
    //
    // Measured in captured audio, not in how long the button was down. bitchat
    // checks both because its frame counter can outlive the hold; ours cannot,
    // since a frame exists only if the microphone produced it. So the frame
    // count already covers the case the wall clock is there for - a long hold
    // that captured nothing because the mic never opened - and covers it more
    // honestly, without counting the time the mic took to open as speech.
    if (this.recordedDurationMs < MIN_BURST_KEEP_MS) {
      this.discard();
      this.retract();
      return;
    }

    // Flush any buffered frames.
    this.flushPending();

    // The length of the audio, not of the press. They differ by however long
    // the microphone took to open, which is hundreds of milliseconds on a cold
    // start and would otherwise be reported to the far side as speech. Same
    // quantity bitchat sends (encoded frames x frame duration).
    this.emit(
      encodeBurstEnd(
        this.burstID,
        this.seq,
        this.dataPacketCount,
        this.recordedDurationMs,
      ),
    );
  }

  // Abort the PTT burst: send CANCELED packet, discard pending frames.
  async cancelPtt(): Promise<void> {
    if (!this.open) return;
    this.open = false;
    await this.backend.stopCapture();
    this.discard();
    this.retract();
  }

  get isActive(): boolean {
    return this.open;
  }

  // The burst ID as lowercase hex, which is how both the receiver's session key
  // and bitchat's `voice_<16 hex>` note name spell it.
  get burstIDHex(): string {
    return bytesToHex(this.burstID);
  }

  // ---- Private ----

  private addFrame(frameData: Uint8Array): void {
    // Past the burst ceiling, drop the frame. Deliberately silent: the button
    // is still held, and the release path is what reports the burst as finished.
    // Dropping here caps the live stream and the finalized note together, since
    // both are fed from this one call.
    if (Date.now() - this.burstStartMs >= MAX_BURST_MS) return;

    const frameCost = 2 + frameData.length; // u16 length prefix + data
    // A single frame that cannot fit a packet on its own is dropped rather
    // than emitted oversize. The encoder's ~130-byte frames never reach this;
    // it stops a misconfigured encoder from pushing every voice packet into
    // the fragment scheduler, which is the one thing the 210-byte budget
    // exists to prevent. Matches VoiceBurstPacketizer.add in bitchat.
    if (BURST_HEADER_SIZE + frameCost > PTT_MAX_BURST_BYTES) return;
    // This frame is going into the burst, so the burst now exists. Announce it
    // before anything carrying audio can go out ahead of it.
    this.sendStartIfNeeded();
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
    if (this.recorded.length < MAX_RECORDED_FRAMES) {
      this.recorded.push(frameData);
      this.recordedBytes += frameData.length;
    }
  }

  // The burst as a standalone, playable file, or null when nothing was
  // captured. Read after stopPtt; cancelPtt discards it, because a cancelled
  // burst should leave nothing behind even though the live audio already
  // played on the far side.
  finalizedRecording(): Uint8Array | null {
    if (this.recorded.length === 0) return null;
    return framesToAdtsFile(this.recorded);
  }

  // Milliseconds of audio captured, from the frame count rather than the wall
  // clock: it is the length of what is actually in the file.
  get recordedDurationMs(): number {
    return this.recorded.length * MS_PER_FRAME;
  }

  // Announce the burst, once, on the first frame that will be sent.
  //
  // Deliberately not done when the button goes down. A microphone that fails to
  // open - a stale audio session, a call holding the input, a permission
  // revoked between the check and the press - would otherwise leave a START on
  // the wire with no audio behind it, and both clients turn a bare START into a
  // live bubble: bitchat opens an assembly for it (ChatLiveVoiceCoordinator
  // .handle), Airhop opens a session (VoicePlayer.handleBurstPayload). The far
  // side then shows LIVE for the three seconds its idle timeout takes to give
  // up. Sending START with the audio means a burst that captured nothing is
  // simply never mentioned. Matches PTTLiveVoiceSession.start in bitchat, which
  // sends START from inside its first onFrames callback for the same reason.
  private sendStartIfNeeded(): void {
    if (this.startSent) return;
    this.startSent = true;
    this.emit(encodeBurstStart(this.burstID, this.codec));
  }

  // Tell every listener to drop this burst, and keep saying it. See
  // RETRACT_REPEAT_MS for why once is not enough.
  //
  // Each repeat is built through emit(), so it carries its own timestamp and
  // signature: the copies are distinct packets rather than replays, which keeps
  // them clear of the freshness window and the flood deduplicator alike.
  private retract(): void {
    // Nobody was ever told about this burst, so there is nothing to take back.
    // Saying so anyway costs three signed packets on a link that carries about
    // 18 KiB/s, and every receiver would drop them as control packets for a
    // burst they never saw.
    if (!this.startSent) return;
    this.emit(encodeBurstCanceled(this.burstID, this.seq));
    for (const delay of RETRACT_REPEAT_MS) {
      this.retractTimers.push(
        setTimeout(() => {
          this.emit(encodeBurstCanceled(this.burstID, this.seq));
        }, delay),
      );
    }
  }

  // Leave nothing of this burst behind: neither the tail waiting to go out nor
  // the copy that would have become a voice note.
  private discard(): void {
    this.pendingFrames = [];
    this.pendingSize = 0;
    this.recorded = [];
    this.recordedBytes = 0;
  }

  private clearRetractTimers(): void {
    for (const timer of this.retractTimers) clearTimeout(timer);
    this.retractTimers = [];
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

  // Put one burst packet on the wire, if there is a wire.
  //
  // Best-effort, always. A frame that cannot go out - nobody in range, a Noise
  // session that went away when the peer walked off - is dropped and the burst
  // carries on: live audio has no queue worth waiting in, but the microphone is
  // still open and the recording is still accumulating, so the words survive as
  // the voice note the release sends. Stopping the capture here instead cost
  // the talker the second half of a sentence every time a link flapped, which
  // on Bluetooth is often, and told them nothing.
  private emit(burstPayload: Uint8Array): void {
    // A DM burst is sealed to one peer and never broadcast. Same bytes, and
    // the only difference is the envelope they travel in.
    if (this.config.onDmPayload !== undefined) {
      this.config.onDmPayload(burstPayload);
      return;
    }
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

// ---- VoiceBurstPacket encode/decode ----
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

// ---- ADTS wrapping ----

// Wrap raw AAC frames in ADTS headers to make a standalone, playable file.
//
// The frames on the wire are bare AAC: no container, no header, because the
// codec byte already says what they are and every byte saved is Bluetooth time.
// A file needs to be self-describing, and ADTS is the cheapest way to do that:
// seven bytes in front of each frame carrying the profile, sample rate, and
// channel count. Every player on both platforms reads it, and audio/aac is on
// bitchat's MIME allow-list, so the result travels as an ordinary voice note.
//
// This is what lets a live burst also become something durable: the people in
// range heard it as it was spoken, and everyone else gets the recording.
const ADTS_HEADER_BYTES = 7;
// Sampling frequency index 8 = 16 kHz, in the MPEG-4 table.
const ADTS_FREQ_INDEX_16K = 8;
// AAC-LC. ADTS stores "object type minus one", so AAC-LC (2) is written as 1.
const ADTS_PROFILE_AAC_LC = 1;
const ADTS_CHANNELS_MONO = 1;

function writeAdtsHeader(
  out: Uint8Array,
  offset: number,
  frameLen: number,
): void {
  const total = ADTS_HEADER_BYTES + frameLen;
  out[offset] = 0xff;
  // Sync word continues, MPEG-4, layer 0, no CRC.
  out[offset + 1] = 0xf1;
  out[offset + 2] =
    (ADTS_PROFILE_AAC_LC << 6) |
    (ADTS_FREQ_INDEX_16K << 2) |
    ((ADTS_CHANNELS_MONO >> 2) & 0x01);
  out[offset + 3] = ((ADTS_CHANNELS_MONO & 0x03) << 6) | ((total >> 11) & 0x03);
  out[offset + 4] = (total >> 3) & 0xff;
  // Bottom 3 bits of the length, then buffer fullness set to "variable".
  out[offset + 5] = ((total & 0x07) << 5) | 0x1f;
  out[offset + 6] = 0xfc;
}

export function framesToAdtsFile(frames: readonly Uint8Array[]): Uint8Array {
  let size = 0;
  for (const frame of frames) size += ADTS_HEADER_BYTES + frame.length;
  const out = new Uint8Array(size);
  let off = 0;
  for (const frame of frames) {
    writeAdtsHeader(out, off, frame.length);
    off += ADTS_HEADER_BYTES;
    out.set(frame, off);
    off += frame.length;
  }
  return out;
}

// ---- Parsed burst packet types ----

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
