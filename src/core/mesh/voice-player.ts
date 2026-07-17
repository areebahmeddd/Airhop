// Push-to-talk voice player: jitter buffer + ordered frame delivery.
//
// Incoming VOICE_FRAME packets from different senders may arrive out of order
// or with gaps (BLE mesh does not guarantee ordering). The jitter buffer holds
// frames for JITTER_BUFFER_MS before flushing them in sequence order, smoothing
// over network jitter while keeping latency acceptable for live PTT.
//
// One VoiceSession is created per (senderPeerID, sessionId) pair. Sessions are
// automatically cleaned up when a last-frame is received or after an inactivity
// timeout.

import type { Packet } from "./packet-codec";
import {
  parseVoiceFramePayload,
  type VoiceCodecId,
  type VoiceFrameHeader,
} from "./voice-capture";

// 350 ms jitter buffer per ROADMAP.md.
const JITTER_BUFFER_MS = 350;

// A session is dropped if no new frame arrives within this window.
const SESSION_TIMEOUT_MS = 5_000;

// Maximum frames held in the jitter buffer per session (prevents memory abuse
// if packets arrive much faster than they are played back).
const MAX_BUFFERED_FRAMES = 64;

// ---- Types ------------------------------------------------------------------

// Injected playback backend - the platform satisfies this interface.
export interface AudioPlaybackBackend {
  // Called when the jitter buffer delivers a batch of ordered frames.
  // frames are in sequence order, ready for decoding and playback.
  playFrames(
    sessionId: number,
    codec: VoiceCodecId,
    frames: Uint8Array[],
  ): Promise<void>;
  // Called when a PTT session ends (last frame received + buffer flushed).
  endSession(sessionId: number): void;
}

interface BufferedFrame {
  seq: number;
  frameData: Uint8Array;
  isLast: boolean;
  arrivedMs: number;
}

// ---- VoiceSession -----------------------------------------------------------

// Manages the jitter buffer for a single (peer, sessionId) PTT burst.
class VoiceSession {
  readonly sessionId: number;
  readonly senderPeerID: string;
  readonly codec: VoiceCodecId;
  private readonly backend: AudioPlaybackBackend;
  private readonly onDone: (sessionId: number) => void;

  private buffer: BufferedFrame[] = [];
  private nextExpectedSeq = 0;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private timeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private ended = false;
  private startMs = Date.now();

  constructor(
    sessionId: number,
    senderPeerID: string,
    codec: VoiceCodecId,
    backend: AudioPlaybackBackend,
    onDone: (sessionId: number) => void,
  ) {
    this.sessionId = sessionId;
    this.senderPeerID = senderPeerID;
    this.codec = codec;
    this.backend = backend;
    this.onDone = onDone;
    this.resetTimeout();
  }

  addFrame(header: VoiceFrameHeader, frameData: Uint8Array): void {
    if (this.ended) return;
    if (this.buffer.length >= MAX_BUFFERED_FRAMES) {
      // Drop oldest frame to make room (buffer overrun protection).
      this.buffer.shift();
    }

    this.buffer.push({
      seq: header.seq,
      frameData,
      isLast: header.isLast,
      arrivedMs: Date.now(),
    });

    // Sort buffer by sequence number (handles reordering).
    this.buffer.sort((a, b) => a.seq - b.seq);

    this.resetTimeout();
    this.scheduleFlush();
  }

  // Force-flush all buffered frames now (called on session end or timeout).
  flush(): void {
    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    this.deliverFrames(true);
  }

  destroy(): void {
    if (this.flushTimer !== null) clearTimeout(this.flushTimer);
    if (this.timeoutTimer !== null) clearTimeout(this.timeoutTimer);
    this.ended = true;
    this.buffer = [];
  }

  // ---- Private ---------------------------------------------------------------

  private scheduleFlush(): void {
    if (this.flushTimer !== null) return;
    // Flush after jitter buffer window elapses from session start.
    const elapsed = Date.now() - this.startMs;
    const delay = Math.max(0, JITTER_BUFFER_MS - elapsed);
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.deliverFrames(false);
    }, delay);
  }

  private deliverFrames(isFinal: boolean): void {
    if (this.buffer.length === 0) return;

    // Collect all contiguous frames starting from nextExpectedSeq.
    const toDeliver: BufferedFrame[] = [];
    while (this.buffer.length > 0) {
      const next = this.buffer[0];
      // Accept if this is the expected sequence or we are in final flush mode
      // (deliver whatever we have, gaps and all).
      if (isFinal || next.seq === this.nextExpectedSeq) {
        this.buffer.shift();
        this.nextExpectedSeq = (next.seq + 1) & 0xffff;
        toDeliver.push(next);
      } else {
        break;
      }
    }

    if (toDeliver.length === 0) return;

    const rawFrames = toDeliver.map((f) => f.frameData);
    const hasLastFrame = toDeliver.some((f) => f.isLast);

    this.backend.playFrames(this.sessionId, this.codec, rawFrames).catch(() => {
      // Best-effort: playback errors are non-fatal
    });

    if (hasLastFrame || (isFinal && this.buffer.length === 0)) {
      this.ended = true;
      this.backend.endSession(this.sessionId);
      this.onDone(this.sessionId);
    }
  }

  private resetTimeout(): void {
    if (this.timeoutTimer !== null) clearTimeout(this.timeoutTimer);
    this.timeoutTimer = setTimeout(() => {
      this.flush();
      this.ended = true;
      this.backend.endSession(this.sessionId);
      this.onDone(this.sessionId);
    }, SESSION_TIMEOUT_MS);
  }
}

// ---- VoicePlayer ------------------------------------------------------------

export class VoicePlayer {
  private readonly backend: AudioPlaybackBackend;
  // Key: "${senderPeerID}:${sessionId}"
  private sessions = new Map<string, VoiceSession>();

  constructor(backend: AudioPlaybackBackend) {
    this.backend = backend;
  }

  // Feed a raw VOICE_FRAME packet into the player. Handles session creation and
  // frame routing automatically. Call this from the BLE packet receive path.
  handlePacket(packet: Packet, senderPeerID: string): void {
    const parsed = parseVoiceFramePayload(packet.payload);
    if (!parsed) return;

    const { header, frameData } = parsed;
    const key = `${senderPeerID}:${header.sessionId}`;

    let session = this.sessions.get(key);
    if (!session) {
      session = new VoiceSession(
        header.sessionId,
        senderPeerID,
        header.codec,
        this.backend,
        (id) => {
          this.sessions.delete(`${senderPeerID}:${id}`);
        },
      );
      this.sessions.set(key, session);
    }

    session.addFrame(header, frameData);
  }

  // Active PTT sessions (for UI display).
  get activeSessions(): { senderPeerID: string; sessionId: number }[] {
    return [...this.sessions.values()].map((s) => ({
      senderPeerID: s.senderPeerID,
      sessionId: s.sessionId,
    }));
  }

  // Tear down all sessions (e.g. on app background).
  close(): void {
    for (const session of this.sessions.values()) session.destroy();
    this.sessions.clear();
  }
}
