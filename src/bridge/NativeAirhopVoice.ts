// Codegen input: TurboModule spec for live push-to-talk audio.
//
// This is the one piece of PTT that cannot live in TypeScript. The wire format,
// the jitter buffer, and the routing are all already in JS (voice-capture.ts,
// voice-player.ts, flood-router.ts); what JS cannot do is tap the microphone
// and hand back encoded frames 15 times a second, or decode and play them with
// sub-second latency. expo-audio records to a file and plays from a file, so it
// is the wrong shape for this and is left to voice notes.
//
// On Android: backed by AirhopVoiceModule.kt (AudioRecord + MediaCodec).
// On iOS:     backed by AirhopVoiceModule.swift (AVAudioEngine + AVAudioConverter).
//
// Both produce and consume the SAME thing: raw AAC-LC frames, 16 kHz, mono,
// 16 kbps, one frame per 1024 samples (64 ms), with no ADTS header. That is
// codec 0x01 in the burst wire format, which is what bitchat sends and expects.
// Frames cross the bridge base64-encoded, matching how the BLE and WiFi modules
// already pass bytes.
//
// Capture and playback are each a single pipeline. One microphone and one
// speaker means one of each is all that can be in use, and the design's
// "one voice at a time" rule is enforced above this layer.
//
// Events emitted by native code via NativeEventEmitter:
//
// 'AirhopVoice.frame'
//   { dataBase64: string }
//   One encoded AAC frame from the microphone, ready to packetize.
//
// 'AirhopVoice.captureError'
//   { message: string }
//   Capture stopped on its own: the mic was taken by another app, the encoder
//   failed, or the audio session was interrupted. Callers should end the burst.
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  // Open the mic and start emitting 'AirhopVoice.frame'. Resolves once capture
  // is running; the actual work happens on a native thread, so this never
  // blocks JS. Rejects if the mic is unavailable or permission is missing.
  startCapture(): Promise<void>;

  // Stop capture and release the mic. Safe to call when not capturing.
  stopCapture(): Promise<void>;

  // Open the playback pipeline for one incoming burst. Safe to call when one
  // is already open: the existing pipeline is torn down first, which is what
  // "one voice at a time" means in practice.
  startPlayback(): Promise<void>;

  // Queue decoded-and-played frames, in order. Frames are played as they
  // arrive; pacing and gap-filling are the caller's job (voice-player.ts).
  enqueueFrames(framesBase64: string[]): Promise<void>;

  // Finish playback once queued audio has drained, and release the speaker.
  stopPlayback(): Promise<void>;

  // Required by React Native NativeEventEmitter contract.
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// Optional: a device without the module (or a build that predates it) simply
// has no live voice, and PTT falls back to voice notes.
export default TurboModuleRegistry.get<Spec>("AirhopVoice");
