// Platform audio for live push-to-talk: the two backends that voice-capture.ts
// and voice-player.ts are written against, implemented on top of the native
// AirhopVoice module.
//
// Everything above these two classes is platform-agnostic and already tested:
// the burst wire format, the jitter buffer, the relay policy. Everything below
// them is AudioRecord/MediaCodec on Android and AVAudioEngine/AVAudioConverter
// on iOS. This file is the seam, and it is deliberately thin.
//
// If the native module is missing (an older build, or a platform where it did
// not register), `isLiveVoiceAvailable` reports false and the app keeps using
// voice notes. Live voice degrading to a voice note is a designed fallback, not
// a failure: the whole feature is an optimisation of a gesture that already
// works.

import NativeAirhopVoice from "@bridge/NativeAirhopVoice";
import { base64ToBytes, bytesToBase64 } from "@core/encoding/base64";
import type {
  AudioCaptureBackend,
  VoiceCodecId,
} from "@core/mesh/voice-capture";
import type { AudioPlaybackBackend } from "@core/mesh/voice-player";
import { t } from "@i18n";
import { NativeEventEmitter, type EventSubscription } from "react-native";

const EVT_FRAME = "AirhopVoice.frame";
const EVT_CAPTURE_ERROR = "AirhopVoice.captureError";
const EVT_PLAYBACK_LEVEL = "AirhopVoice.playbackLevel";

// A loudness reading from native, 0 (silence) to 1 (clipping), or 0 for
// anything that is not a usable number. Native is trusted to send RMS, but a
// meter is drawn from this and a stray value would be a bar taller than the row
// it sits in.
function readLevel(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

// Whether this build can do live voice at all. Checked before offering PTT so
// the UI never promises something the device cannot do.
export function isLiveVoiceAvailable(): boolean {
  return NativeAirhopVoice !== null && NativeAirhopVoice !== undefined;
}

// ---- Capture ----------------------------------------------------------------

// Feeds encoded AAC frames from the microphone into a VoiceCaptureSession.
export class NativeAudioCapture implements AudioCaptureBackend {
  private frameSub: EventSubscription | null = null;
  private errorSub: EventSubscription | null = null;
  private readonly emitter: NativeEventEmitter | null;
  // Told when capture dies on its own (mic taken by a call, encoder failure)
  // so the burst can be ended rather than left hanging open.
  private readonly onFailure: (message: string) => void;
  // How loud each frame was, for the meter beside the timer. Rides on the frame
  // event, so it stops arriving exactly when the audio does.
  private readonly onLevel: (level: number) => void;

  constructor(
    onFailure: (message: string) => void = () => undefined,
    onLevel: (level: number) => void = () => undefined,
  ) {
    this.onFailure = onFailure;
    this.onLevel = onLevel;
    this.emitter = isLiveVoiceAvailable()
      ? new NativeEventEmitter(
          NativeAirhopVoice as unknown as ConstructorParameters<
            typeof NativeEventEmitter
          >[0],
        )
      : null;
  }

  async startCapture(onFrame: (frame: Uint8Array) => void): Promise<void> {
    const native = NativeAirhopVoice;
    if (!native || !this.emitter) throw new Error(t("voice.unavailable"));

    // Subscribe before starting, so no frame from the first moments is missed.
    this.frameSub = this.emitter.addListener(
      EVT_FRAME,
      (event: { dataBase64?: string; level?: number }) => {
        if (typeof event.dataBase64 !== "string") return;
        const frame = base64ToBytes(event.dataBase64);
        if (frame.length === 0) return;
        onFrame(frame);
        this.onLevel(readLevel(event.level));
      },
    );
    this.errorSub = this.emitter.addListener(
      EVT_CAPTURE_ERROR,
      (event: { message?: string }) => {
        this.onFailure(event.message ?? t("voice.recording_stopped"));
      },
    );

    try {
      await native.startCapture();
    } catch (err) {
      // Leave nothing subscribed if the mic never opened.
      await this.stopCapture();
      throw err;
    }
  }

  async stopCapture(): Promise<void> {
    this.frameSub?.remove();
    this.frameSub = null;
    this.errorSub?.remove();
    this.errorSub = null;
    // The meter is fed by the frames, so it has to be told the audio stopped;
    // otherwise the bars freeze at whatever the last syllable measured.
    this.onLevel(0);
    // Best-effort: the mic is already gone if this throws, and a failure here
    // must not stop the burst from being closed off cleanly.
    await NativeAirhopVoice?.stopCapture().catch(() => undefined);
  }
}

// ---- Playback ---------------------------------------------------------------

// Plays the frames the jitter buffer releases.
//
// One pipeline, one burst: the native side tears down whatever was playing when
// a new burst starts, which is the "one voice at a time" rule from the design.
// Tracking the open burst here means a late frame from a burst that already
// ended is dropped rather than reopening the speaker.
export class NativeAudioPlayback implements AudioPlaybackBackend {
  private openBurst: string | null = null;
  // Whether audio should be heard at all right now. Asked every batch rather
  // than once per burst, so leaving the thread or backgrounding the app stops
  // the sound where it happens instead of at the end of the burst.
  private readonly isAudible: () => boolean;
  // How loud the talker is, for the meter in the incoming banner. Reported from
  // the speaker rather than from the packets, so it moves only while audio is
  // genuinely being played: a burst held behind the floor, or one arriving
  // while the user is looking elsewhere, correctly shows nothing.
  private readonly onLevel: (level: number) => void;
  // The speaker has gone quiet: no burst is playing and none is about to.
  //
  // Playing a burst puts the audio session into the recording-capable state the
  // native module needs, and nothing else takes it back out: every existing
  // path that restores it hangs off the microphone being released, and a
  // listener who never talks never releases anything. Left there, the session
  // stays active and ducking, so the podcast a user was half-listening to is
  // quieter for the rest of the app's life. Whoever owns this decides whether
  // handing it back is safe right now; see mesh-service, which is the layer
  // that knows whether the microphone is also in use.
  private readonly onIdle: () => void;
  private levelSub: EventSubscription | null = null;

  constructor(
    isAudible: () => boolean = () => true,
    onLevel: (level: number) => void = () => undefined,
    onIdle: () => void = () => undefined,
  ) {
    this.isAudible = isAudible;
    this.onLevel = onLevel;
    this.onIdle = onIdle;
    if (isLiveVoiceAvailable()) {
      const emitter = new NativeEventEmitter(
        NativeAirhopVoice as unknown as ConstructorParameters<
          typeof NativeEventEmitter
        >[0],
      );
      this.levelSub = emitter.addListener(
        EVT_PLAYBACK_LEVEL,
        (event: { level?: number }) => {
          this.onLevel(readLevel(event.level));
        },
      );
    }
  }

  async playFrames(
    burstIDHex: string,
    _codec: VoiceCodecId,
    frames: Uint8Array[],
  ): Promise<void> {
    const native = NativeAirhopVoice;
    if (!native || frames.length === 0) return;

    // Not being watched: track the burst but make no sound. Audio starting on
    // its own from a screen the user is not on is the fastest way to make a
    // feature like this hated.
    if (!this.isAudible()) {
      if (this.openBurst !== null) {
        this.openBurst = null;
        this.onLevel(0);
        void native.stopPlayback().catch(() => undefined);
        this.onIdle();
      }
      return;
    }

    try {
      if (this.openBurst !== burstIDHex) {
        this.openBurst = burstIDHex;
        await native.startPlayback();
      }
      await native.enqueueFrames(frames.map(bytesToBase64));
    } catch {
      // The speaker is unavailable (a call, a route change). Give up on this
      // burst rather than retrying into a device that is not listening; the
      // finalized voice note still arrives and is playable.
      this.openBurst = null;
    }
  }

  endSession(burstIDHex: string): void {
    if (this.openBurst !== burstIDHex) return;
    this.openBurst = null;
    this.onLevel(0);
    void NativeAirhopVoice?.stopPlayback().catch(() => undefined);
    this.onIdle();
  }

  // Stop immediately, whatever is playing. Used when the app backgrounds or the
  // mesh goes down.
  close(): void {
    this.openBurst = null;
    this.onLevel(0);
    this.levelSub?.remove();
    this.levelSub = null;
    void NativeAirhopVoice?.stopPlayback().catch(() => undefined);
    this.onIdle();
  }
}
