// Jest mock for expo-audio.
//
// The real module reaches for a native audio session at import time, which is
// fatal rather than merely unavailable under jest-expo: ExpoAudio.ts reads a
// prototype off a native class that does not exist in node, so anything that
// transitively imports it throws before a single test runs. mesh-service does,
// through services/audio-session.
//
// The surface is only what the app imports, and it is inert: nothing asserts on
// audio, so the point is that importing the modules under test works.
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
  pause: jest.fn(),
  stop: jest.fn(async () => undefined),
  prepareToRecordAsync: jest.fn(async () => undefined),
  getStatus: jest.fn(() => ({ ...recorderState })),
  isRecording: false,
  uri: null,
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
