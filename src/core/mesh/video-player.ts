// Video frame player: jitter buffer and ordered frame delivery for video calls.
//
// Incoming VIDEO_FRAME packets arrive over WiFi Aware / MultipeerConnectivity
// and may be reordered in transit. The jitter buffer holds frames for
// JITTER_BUFFER_MS before flushing them in frame_seq order.
//
// One VideoSession is created per (senderPeerID, sessionId) pair. Sessions are
// cleaned up when the last frame is received or after an inactivity timeout.

import { type Packet } from "./packet-codec";
import {
  decodeVideoFramePayload,
  type VideoCodecId,
  type VideoFrameHeader,
} from "./video-capture";

// Jitter buffer window in milliseconds.
// Video tolerates slightly more latency than voice for smoother playback.
const JITTER_BUFFER_MS = 100;

// Session is dropped if no frame arrives within this window.
const SESSION_TIMEOUT_MS = 10_000;

// Maximum frames held per session before oldest are discarded.
const MAX_BUFFERED_FRAMES = 120; // ~8 s at 15 fps

// ---- Types ------------------------------------------------------------------

export interface VideoPlaybackBackend {
  // Called with a batch of ordered frames ready for decoding and display.
  // Frames are in frame_seq order, no gaps.
  renderFrames(
    sessionId: number,
    codec: VideoCodecId,
    width: number,
    height: number,
    frames: Uint8Array[],
  ): Promise<void>;
  // Called when a video session ends (last frame received + buffer flushed).
  endSession(sessionId: number): void;
}

interface BufferedVideoFrame {
  seq: number;
  frameData: Uint8Array;
  header: VideoFrameHeader;
  arrivedMs: number;
}

// ---- VideoSession -----------------------------------------------------------

class VideoSession {
  readonly sessionId: number;
  readonly senderPeerID: string;

  private buffer: BufferedVideoFrame[] = [];
  private nextExpectedSeq = 0;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private timeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private ended = false;
  private codec: VideoCodecId | null = null;
  private width = 0;
  private height = 0;

  private readonly backend: VideoPlaybackBackend;
  private readonly onDone: (sessionId: number) => void;

  constructor(
    sessionId: number,
    senderPeerID: string,
    backend: VideoPlaybackBackend,
    onDone: (sessionId: number) => void,
  ) {
    this.sessionId = sessionId;
    this.senderPeerID = senderPeerID;
    this.backend = backend;
    this.onDone = onDone;
    this.resetTimeout();
  }

  receiveFrame(header: VideoFrameHeader, frameData: Uint8Array): void {
    if (this.ended) return;

    if (this.codec === null) {
      this.codec = header.codec;
      this.width = header.width;
      this.height = header.height;
    }

    this.resetTimeout();

    if (this.buffer.length >= MAX_BUFFERED_FRAMES) {
      // Drop the oldest buffered frame to make room.
      this.buffer.shift();
    }

    this.buffer.push({
      seq: header.frameSeq,
      frameData,
      header,
      arrivedMs: Date.now(),
    });

    if (header.isLast) {
      // Cancel both timers before flushing so no timer fires after ended = true.
      this.cancelFlushTimer();
      if (this.timeoutTimer !== null) {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = null;
      }
      this.flushAll();
      return;
    }

    // Schedule a flush after the jitter window if not already scheduled.
    if (this.flushTimer === null) {
      this.flushTimer = setTimeout(() => {
        this.flushTimer = null;
        this.flushAvailable();
      }, JITTER_BUFFER_MS);
    }
  }

  // Flush all contiguous frames starting from nextExpectedSeq.
  private flushAvailable(): void {
    this.buffer.sort((a, b) => a.seq - b.seq);
    const batch: Uint8Array[] = [];

    while (
      this.buffer.length > 0 &&
      this.buffer[0].seq === this.nextExpectedSeq
    ) {
      const frame = this.buffer.shift()!;
      batch.push(frame.frameData);
      this.nextExpectedSeq++;
    }

    if (batch.length > 0 && this.codec !== null) {
      this.backend.renderFrames(
        this.sessionId,
        this.codec,
        this.width,
        this.height,
        batch,
      );
    }
  }

  // Flush everything remaining: used on is_last.
  private flushAll(): void {
    this.buffer.sort((a, b) => a.seq - b.seq);
    const batch = this.buffer.map((f) => f.frameData);
    this.buffer = [];
    this.ended = true;

    if (batch.length > 0 && this.codec !== null) {
      this.backend
        .renderFrames(
          this.sessionId,
          this.codec,
          this.width,
          this.height,
          batch,
        )
        .then(() => {
          this.backend.endSession(this.sessionId);
          this.onDone(this.sessionId);
        });
    } else {
      this.backend.endSession(this.sessionId);
      this.onDone(this.sessionId);
    }
  }

  private resetTimeout(): void {
    if (this.timeoutTimer !== null) clearTimeout(this.timeoutTimer);
    this.timeoutTimer = setTimeout(() => {
      this.ended = true;
      this.backend.endSession(this.sessionId);
      this.onDone(this.sessionId);
    }, SESSION_TIMEOUT_MS);
  }

  private cancelFlushTimer(): void {
    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  dispose(): void {
    this.cancelFlushTimer();
    if (this.timeoutTimer !== null) clearTimeout(this.timeoutTimer);
    this.ended = true;
  }
}

// ---- VideoPlayer ------------------------------------------------------------

// Manages all concurrent incoming video sessions.
export class VideoPlayer {
  private readonly sessions = new Map<string, VideoSession>();
  private readonly backend: VideoPlaybackBackend;

  constructor(backend: VideoPlaybackBackend) {
    this.backend = backend;
  }

  // Feed an inbound VIDEO_FRAME packet. Returns false if the payload is invalid.
  receivePacket(packet: Packet): boolean {
    const parsed = decodeVideoFramePayload(packet.payload);
    if (!parsed) return false;

    const { header, frameData } = parsed;
    const senderHex = Array.from(packet.senderID)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const key = `${senderHex}:${header.sessionId}`;

    let session = this.sessions.get(key);
    if (!session) {
      session = new VideoSession(
        header.sessionId,
        senderHex,
        this.backend,
        (sessionId) => {
          // Remove by iterating since we key by sender+sessionId.
          for (const [k, s] of this.sessions) {
            if (s.sessionId === sessionId && k === key) {
              this.sessions.delete(k);
              break;
            }
          }
        },
      );
      this.sessions.set(key, session);
    }

    session.receiveFrame(header, frameData);
    return true;
  }

  // Number of active incoming video sessions.
  get activeSessionCount(): number {
    return this.sessions.size;
  }

  // Dispose all sessions (call when WiFi transport is stopped).
  disposeAll(): void {
    for (const session of this.sessions.values()) {
      session.dispose();
    }
    this.sessions.clear();
  }
}
