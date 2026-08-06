// The app's audio session, in one place.
//
// `setAudioModeAsync` takes `Partial<AudioMode>` but is not a patch: the native
// side decodes it into a whole record, so an omitted field resets to its native
// default rather than staying put. `playsInSilentMode` defaults to false
// (expo-audio ios/AudioRecords.swift; the JSDoc saying true is wrong), and on
// iOS that selects `.ambient`, which the ring/silent switch mutes. So handing
// the microphone back and staying audible are two statements, and both have to
// be made every time.
//
// The app also needs a mode to return to: with no call at launch the session
// sits in the OS default, which the same switch mutes.
//
// Two named states, so no call site restates the full record.

import { setAudioModeAsync, type AudioMode } from "expo-audio";

// Every field stated: omitting one resets it.
const BASE: AudioMode = {
  playsInSilentMode: true,
  // Voice notes and push-to-talk are short; no reason to stop other audio.
  interruptionMode: "mixWithOthers",
  allowsRecording: false,
  shouldPlayInBackground: false,
  shouldRouteThroughEarpiece: false,
  allowsBackgroundRecording: false,
};

// The state the app sits in.
export async function setAudioForPlayback(): Promise<void> {
  await setAudioModeAsync(BASE);
}

// Recording a voice note or holding push-to-talk. iOS moves to
// `.playAndRecord` for the duration; leaving it there routes later playback to
// the earpiece, so it must be handed back.
export async function setAudioForRecording(): Promise<void> {
  await setAudioModeAsync({ ...BASE, allowsRecording: true });
}
