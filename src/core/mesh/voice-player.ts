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

import { bytesToHex } from "@noble/hashes/utils.js";
import type { Packet } from "./packet-codec";
import { decodeBurstPacket, type VoiceCodecId } from "./voice-capture";

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
    burstIDHex: string,
    codec: VoiceCodecId,
    frames: Uint8Array[],
  ): Promise<void>;
  // Called when a PTT session ends (END/CANCELED received + buffer flushed).
  endSession(burstIDHex: string): void;
}

interface BufferedFrame {
  seq: number;
  // A single DATA packet may carry multiple compressed frames.
  frames: Uint8Array[];
  arrivedMs: number;
}

// ---- VoiceSession -----------------------------------------------------------

// Manages the jitter buffer for a single (peer, burstID) PTT burst.
class VoiceSession {
  readonly burstIDHex: string;
  readonly senderPeerID: string;
  readonly codec: VoiceCodecId;
  private readonly backend: AudioPlaybackBackend;
  private readonly onDone: (burstIDHex: string) => void;

  private buffer: BufferedFrame[] = [];
  private nextExpectedSeq = 1; // DATA seq starts at 1 (0 is START)
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private timeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private ended = false;
  private endReceived = false;
  private startMs = Date.now();

  constructor(
    burstIDHex: string,
    senderPeerID: string,
    codec: VoiceCodecId,
    backend: AudioPlaybackBackend,
    onDone: (burstIDHex: string) => void,
  ) {
    this.burstIDHex = burstIDHex;
    this.senderPeerID = senderPeerID;
    this.codec = codec;
    this.backend = backend;
    this.onDone = onDone;
    this.resetTimeout();
  }

  // Called for each DATA burst packet.
  addFrames(seq: number, frames: Uint8Array[]): void {
    if (this.ended) return;
    if (this.buffer.length >= MAX_BUFFERED_FRAMES) {
      // Drop oldest entry to make room (buffer overrun protection).
      this.buffer.shift();
    }

    this.buffer.push({ seq, frames, arrivedMs: Date.now() });

    // Sort buffer by sequence number (handles reordering).
    this.buffer.sort((a, b) => a.seq - b.seq);

    this.resetTimeout();
    this.scheduleFlush();
  }

  // Called when the END burst packet is received.
  markEnded(): void {
    this.endReceived = true;
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
    if (this.buffer.length === 0) {
      // Nothing to deliver. If END was received and no more data is expected,
      // still signal completion.
      if (isFinal && this.endReceived && !this.ended) {
        this.signalDone();
      }
      return;
    }

    // Collect all contiguous DATA entries starting from nextExpectedSeq.
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

    // Flatten all frames from all DATA packets in sequence order.
    const rawFrames = toDeliver.flatMap((entry) => entry.frames);

    this.backend
      .playFrames(this.burstIDHex, this.codec, rawFrames)
      .catch(() => {
        // Best-effort: playback errors are non-fatal.
      });

    if (isFinal && this.buffer.length === 0 && this.endReceived) {
      this.signalDone();
    }
  }

  private signalDone(): void {
    if (this.ended) return;
    if (this.timeoutTimer !== null) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    this.ended = true;
    this.backend.endSession(this.burstIDHex);
    this.onDone(this.burstIDHex);
  }

  private resetTimeout(): void {
    if (this.timeoutTimer !== null) clearTimeout(this.timeoutTimer);
    this.timeoutTimer = setTimeout(() => {
      this.markEnded();
      this.flush();
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

  // Feed a raw VOICE_FRAME packet into the player. Handles session lifecycle and
  // frame routing automatically. Call this from the BLE packet receive path.
  handlePacket(packet: Packet, senderPeerID: string): void {
    const burst = decodeBurstPacket(packet.payload);
    if (!burst) return;

    const burstIDHex = bytesToHex(burst.burstID);
    const key = `${senderPeerID}:${burstIDHex}`;

    switch (burst.kind) {
      case "start": {
        if (!this.sessions.has(key)) {
          const session = new VoiceSession(
            burstIDHex,
            senderPeerID,
            burst.codec,
            this.backend,
            (id) => {
              this.sessions.delete(`${senderPeerID}:${id}`);
            },
          );
          this.sessions.set(key, session);
        }
        break;
      }
      case "data": {
        const session = this.sessions.get(key);
        // Discard DATA packets for unknown sessions (no START received).
        if (!session) break;
        session.addFrames(burst.seq, burst.frames);
        break;
      }
      case "end": {
        const session = this.sessions.get(key);
        if (!session) break;
        session.markEnded();
        session.flush();
        break;
      }
      case "canceled": {
        const session = this.sessions.get(key);
        if (session) session.destroy();
        this.sessions.delete(key);
        break;
      }
    }
  }

  // Active PTT sessions (for UI display).
  get activeSessions(): { senderPeerID: string; burstIDHex: string }[] {
    return [...this.sessions.values()].map((s) => ({
      senderPeerID: s.senderPeerID,
      burstIDHex: s.burstIDHex,
    }));
  }

  // Tear down all sessions (e.g. on app background).
  close(): void {
    for (const session of this.sessions.values()) session.destroy();
    this.sessions.clear();
  }
}
