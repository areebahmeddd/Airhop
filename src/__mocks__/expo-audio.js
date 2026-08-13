// Mock for expo-audio used in Jest test environments.
//
// The real module reaches for a native audio session at import time, which is
// fatal rather than merely unavailable under jest-expo: `ExpoAudio.ts` reads a
// prototype off a native class that does not exist in node, so anything that
// transitively imports it throws before a single test runs. mesh-service does,
// through services/audio-session, which is how the live-voice pipeline hands
// the session back when the speaker goes quiet.
//
// The surface here is only what the app imports. Nothing asserts on audio, so
// these are inert: the point is that importing the modules under test works.
const setAudioModeAsync = jest.fn(async () => undefined);

const recorderState = {
  canRecord: false,
  isRecording: false,
  durationMillis: 0,
  mediaServicesDidReset: false,
  url: null,
};

const recorder = {
  record: jest.fn(),
  stop: jest.fn(async () => undefined),
  pause: jest.fn(),
  prepareToRecordAsync: jest.fn(async () => undefined),
  getStatus: jest.fn(() => ({ ...recorderState })),
  uri: null,
  isRecording: false,
};

module.exports = {
  setAudioModeAsync,
  AudioModule: {
    getRecordingPermissionsAsync: jest.fn(async () => ({ granted: true })),
    requestRecordingPermissionsAsync: jest.fn(async () => ({ granted: true })),
  },
  RecordingPresets: { HIGH_QUALITY: {}, LOW_QUALITY: {} },
  useAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn(async () => undefined),
    remove: jest.fn(),
  })),
  useAudioPlayerStatus: jest.fn(() => ({
    playing: false,
    currentTime: 0,
    duration: 0,
    didJustFinish: false,
  })),
  useAudioRecorder: jest.fn(() => recorder),
  useAudioRecorderState: jest.fn(() => ({ ...recorderState })),
};
