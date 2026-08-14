// The native contract for live push-to-talk audio.
//
// Hand-maintained, not Codegen input. See NativeAirhopBLE.ts for why.
//
// This is the one part of PTT that cannot live in TypeScript. The wire format,
// jitter buffer and routing are already in JS (core/mesh/voice/ and
// core/mesh/routing/). What JS cannot do is tap the microphone and hand back
// encoded frames fifteen times a second, or decode and play them with sub-second
// latency. expo-audio records to and plays from a file, so it is the wrong shape
// here and is left to voice notes.
//
// Android is backed by AirhopVoiceModule.kt (AudioRecord + MediaCodec), iOS by
// AirhopVoiceModule.swift (AVAudioEngine + AVAudioConverter). Both produce and
// consume the same frames: raw AAC-LC, 16 kHz mono at 16 kbps, one frame per 1024
// samples (64 ms), no ADTS header. That is codec 0x01 in the burst wire format,
// which is what bitchat sends and expects. Frames cross base64-encoded, matching
// the BLE and WiFi modules.
//
// Capture and playback are each a single pipeline, since there is one microphone
// and one speaker. The "one voice at a time" rule is enforced above this layer.
//
// Events emitted by native code:
//
//   AirhopVoice.frame          { dataBase64, level }
//   AirhopVoice.playbackLevel  { level }
//   AirhopVoice.captureError   { message }
//
// `level` is loudness from 0 to 1, plain unshaped RMS, so a meter can be drawn
// without a second event stream. Speech sits low on a linear scale, and the curve
// that makes it read well belongs in the UI where it can be tuned without a
// native rebuild. playbackLevel needs its own event because playback has no frame
// stream to ride along on. captureError means capture stopped on its own (the mic
// was taken, the encoder failed, the session was interrupted) and the caller
// should end the burst.
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  // Open the mic and start emitting frames. Resolves once capture is running; the
  // work happens on a native thread, so this never blocks JS. Rejects when the
  // mic is unavailable or permission is missing.
  startCapture(): Promise<void>;

  // Safe to call when not capturing.
  stopCapture(): Promise<void>;

  // Open the playback pipeline for one incoming burst. Safe to call when one is
  // already open: the existing pipeline is torn down first, which is what "one
  // voice at a time" means in practice.
  startPlayback(): Promise<void>;

  // Queue frames in order. They play as they arrive; pacing and gap-filling are
  // the caller's job. See core/mesh/voice/voice-player.ts.
  enqueueFrames(framesBase64: string[]): Promise<void>;

  // Finish once queued audio has drained, and release the speaker.
  stopPlayback(): Promise<void>;

  // Required by the NativeEventEmitter contract.
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// Optional: a device without the module has no live voice, and PTT falls back to
// voice notes.
export default TurboModuleRegistry.get<Spec>("AirhopVoice");
