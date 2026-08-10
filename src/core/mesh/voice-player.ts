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
import {
  decodeBurstPacket,
  VoiceCodec,
  type VoiceCodecId,
} from "./voice-capture";

// 350 ms jitter buffer per ROADMAP.md.
const JITTER_BUFFER_MS = 350;

// A session is dropped if no new frame arrives within this window.
//
// This is the safety net under every burst that never says goodbye: a talker
// who walks out of range, or whose END was lost on the way. Matches bitchat's
// IDLE_TIMEOUT_MS / pttBurstEndTimeoutSeconds, both 3 s, so the same silence
// resolves at the same moment on either client rather than leaving one of them
// showing a talker the other has already given up on. Comfortably clear of the
// 350 ms jitter buffer, so ordinary gaps never trip it.
const SESSION_TIMEOUT_MS = 3_000;

// Maximum frames held in the jitter buffer per session (prevents memory abuse
// if packets arrive much faster than they are played back).
const MAX_BUFFERED_FRAMES = 64;

// Concurrent inbound bursts. Matches bitchat's pttMaxConcurrentAssemblies.
const MAX_CONCURRENT_SESSIONS = 8;

// Total audio bytes one burst may deliver before it is cut off, and the rate it
// may deliver them at. Matches bitchat's pttMaxBurstBytes and
// pttInboundMaxBytesPerSecond.
//
// The buffer cap above bounds MEMORY; these bound TIME. Without them a peer in
// range can hold the floor indefinitely, streaming into whichever room the
// listener happens to be looking at, and an honest client's own 120-second limit
// is no help because a hostile one simply does not have it. Real speech arrives
// at about 2 KB/s, so the rate ceiling is generous enough that a burst crossing
// it is not speech.
const MAX_BURST_BYTES = 384 * 1024;
const MAX_BYTES_PER_SECOND = 6_000;

// How many cut-off bursts are remembered, so one that broke a cap cannot simply
// carry on and be handed a fresh budget by the next packet. Bounded because the
// memory only has to outlive the flood that caused it; a burst is identified by
// 8 random bytes, so a talker starting a genuinely new one is never affected.
const MAX_CUTOFF_MEMORY = 32;

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
  // Cumulative audio bytes delivered by this burst, for the caps above.
  private receivedBytes = 0;

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

  // Called for each DATA burst packet. Returns false when the burst broke a cap
  // and was cut off, so the caller can drop the session rather than keep feeding
  // a corpse.
  addFrames(seq: number, frames: Uint8Array[]): boolean {
    if (this.ended) return false;

    this.receivedBytes += frames.reduce((sum, f) => sum + f.length, 0);
    // +2s of slack so the very first packets, which arrive before any elapsed
    // time has accumulated, are not judged as an infinite rate.
    const elapsedSec = (Date.now() - this.startMs) / 1000 + 2;
    if (
      this.receivedBytes > MAX_BURST_BYTES ||
      this.receivedBytes > MAX_BYTES_PER_SECOND * elapsedSec
    ) {
      // Play what legitimately arrived, then close. Cutting off mid-sentence is
      // the right outcome for a burst that is no longer plausibly speech.
      this.markEnded();
      this.flush();
      this.destroy();
      return false;
    }

    if (this.buffer.length >= MAX_BUFFERED_FRAMES) {
      // Drop oldest entry to make room (buffer overrun protection).
      this.buffer.shift();
    }

    this.buffer.push({ seq, frames, arrivedMs: Date.now() });

    // Sort buffer by sequence number (handles reordering).
    this.buffer.sort((a, b) => a.seq - b.seq);

    this.resetTimeout();
    this.scheduleFlush();
    return true;
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
  // Told whenever the set of talkers changes, so the UI can stop naming one who
  // has stopped.
  //
  // Every other way a session ends is driven by a packet arriving, and the
  // caller re-reads `activeSessions` right after handing us that packet. The
  // idle timeout is the one that fires with nothing arriving, which is exactly
  // the case where the talker went quiet without saying so - so without this
  // the "LIVE - Alice is speaking" pill outlived the audio, waiting for a
  // packet that was never coming.
  private readonly onSessionsChanged: () => void;
  // Key: "${senderPeerID}:${sessionId}"
  private sessions = new Map<string, VoiceSession>();
  // Bursts cut off for breaking a cap. Every packet of such a burst is ignored
  // from then on, including its END: without this the session was torn down and
  // the very next packet opened a replacement with its byte count back at zero,
  // which handed a flooding peer an unlimited budget one cap at a time.
  private readonly cutOffBursts = new Set<string>();

  constructor(
    backend: AudioPlaybackBackend,
    onSessionsChanged: () => void = () => undefined,
  ) {
    this.backend = backend;
    this.onSessionsChanged = onSessionsChanged;
  }

  // Feed a raw VOICE_FRAME packet into the player. Handles session lifecycle and
  // frame routing automatically. Call this from the BLE packet receive path.
  handlePacket(packet: Packet, senderPeerID: string): void {
    this.handleBurstPayload(packet.payload, senderPeerID);
  }

  // The same burst bytes, however they arrived: broadcast in a VOICE_FRAME
  // packet, or sealed inside a peer's Noise session as a DM. Everything from
  // here down is scope-agnostic, which is the point of the shared format.
  handleBurstPayload(payload: Uint8Array, senderPeerID: string): void {
    const burst = decodeBurstPacket(payload);
    if (!burst) return;

    const burstIDHex = bytesToHex(burst.burstID);
    const key = `${senderPeerID}:${burstIDHex}`;
    // Already cut off for flooding: every remaining packet of this burst is
    // dead to us, END included.
    if (this.cutOffBursts.has(key)) return;

    switch (burst.kind) {
      case "start": {
        // Only so many bursts can be in flight at once. Every one holds a
        // jitter buffer, and only one of them can be making sound, so past this
        // point a new burst is buying nothing at the cost of memory. Matches
        // bitchat's pttMaxConcurrentAssemblies. The oldest goes rather than
        // refusing the new one: a talker who just started is more likely to be
        // the one being listened to than one whose buffer has gone stale.
        if (!this.sessions.has(key)) {
          this.openSession(key, burst.burstID, senderPeerID, burst.codec);
        }
        break;
      }
      case "data": {
        // A burst whose START we never saw. Two ordinary things cause this and
        // neither should mean silence: the START packet was lost (one dropped
        // packet at the head of a burst would otherwise mute the whole thing),
        // or we walked into range while somebody was already mid-sentence.
        //
        // Starting from a DATA packet is safe because the codec is not really
        // in question: 0x01 is the only value the format defines, and a burst
        // in any other codec would have been refused at the START anyway. This
        // is a receive-side recovery, so nothing on the wire changes and a
        // bitchat sender needs to do nothing differently.
        const session =
          this.sessions.get(key) ??
          this.openSession(
            key,
            burst.burstID,
            senderPeerID,
            VoiceCodec.AAC_LC_16KHZ_MONO,
          );
        if (!session.addFrames(burst.seq, burst.frames)) {
          // Cut off: free the slot, and remember the burst so its remaining
          // packets cannot open a fresh one.
          this.sessions.delete(key);
          if (this.cutOffBursts.size >= MAX_CUTOFF_MEMORY) {
            const oldest = this.cutOffBursts.keys().next().value;
            if (oldest !== undefined) this.cutOffBursts.delete(oldest);
          }
          this.cutOffBursts.add(key);
        }
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

  private openSession(
    key: string,
    burstID: Uint8Array,
    senderPeerID: string,
    codec: VoiceCodecId,
  ): VoiceSession {
    // Only so many bursts can be in flight at once. Every one holds a jitter
    // buffer, and only one of them can be making sound, so past this point a
    // new burst buys nothing at the cost of memory. Matches bitchat's
    // pttMaxConcurrentAssemblies. The oldest goes rather than refusing the new
    // one: a talker who just started is likelier to be the one being listened
    // to than one whose buffer has gone stale.
    if (this.sessions.size >= MAX_CONCURRENT_SESSIONS) {
      const oldest = this.sessions.keys().next().value;
      if (oldest !== undefined) {
        this.sessions.get(oldest)?.destroy();
        this.sessions.delete(oldest);
      }
    }
    const session = new VoiceSession(
      bytesToHex(burstID),
      senderPeerID,
      codec,
      this.backend,
      (id) => {
        this.sessions.delete(`${senderPeerID}:${id}`);
        this.onSessionsChanged();
      },
    );
    this.sessions.set(key, session);
    return session;
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
    this.cutOffBursts.clear();
  }
}
