/**
 * @jest-environment node
 */
// The seam between the platform-agnostic PTT stack and the native audio module.
//
// What matters here is the fallback behaviour: every one of these paths is a
// case where live voice is unavailable or dies mid-burst, and in each of them
// the app has to keep working rather than hang, throw, or leave the speaker
// open. The audio itself needs devices; these are the decisions around it.

import NativeAirhopVoice from "@bridge/NativeAirhopVoice";
import { NativeAudioPlayback } from "../voice-audio";

jest.mock("@bridge/NativeAirhopVoice", () => ({
  __esModule: true,
  default: {
    startPlayback: jest.fn(() => Promise.resolve()),
    enqueueFrames: jest.fn(() => Promise.resolve()),
    stopPlayback: jest.fn(() => Promise.resolve()),
    startCapture: jest.fn(() => Promise.resolve()),
    stopCapture: jest.fn(() => Promise.resolve()),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
}));

const native = NativeAirhopVoice as unknown as {
  startPlayback: jest.Mock;
  enqueueFrames: jest.Mock;
  stopPlayback: jest.Mock;
};

const frame = () => [new Uint8Array([1, 2, 3])];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("NativeAudioPlayback", () => {
  it("opens the speaker once per burst, not once per batch", async () => {
    const playback = new NativeAudioPlayback();
    await playback.playFrames("aa", 0x01, frame());
    await playback.playFrames("aa", 0x01, frame());
    await playback.playFrames("aa", 0x01, frame());

    expect(native.startPlayback).toHaveBeenCalledTimes(1);
    expect(native.enqueueFrames).toHaveBeenCalledTimes(3);
  });

  it("hands the speaker to a new talker mid-burst", async () => {
    // One voice at a time: a second burst replaces the first rather than
    // mixing, which is the native side's contract for startPlayback.
    const playback = new NativeAudioPlayback();
    await playback.playFrames("aa", 0x01, frame());
    await playback.playFrames("bb", 0x01, frame());

    expect(native.startPlayback).toHaveBeenCalledTimes(2);
  });

  it("ignores an end for a burst that is not the one playing", async () => {
    // A late END from an earlier talker must not cut off the current one.
    const playback = new NativeAudioPlayback();
    await playback.playFrames("bb", 0x01, frame());
    playback.endSession("aa");

    expect(native.stopPlayback).not.toHaveBeenCalled();
  });

  it("releases the speaker when the burst it opened ends", async () => {
    const playback = new NativeAudioPlayback();
    await playback.playFrames("aa", 0x01, frame());
    playback.endSession("aa");

    expect(native.stopPlayback).toHaveBeenCalledTimes(1);
  });

  it("gives up on a burst the speaker refused, without throwing", async () => {
    // A call takes the audio session mid-burst. Retrying into a device that is
    // not listening is pointless; the finalized voice note is the fallback.
    native.startPlayback.mockRejectedValueOnce(new Error("audio session busy"));
    const playback = new NativeAudioPlayback();

    await expect(
      playback.playFrames("aa", 0x01, frame()),
    ).resolves.toBeUndefined();

    // Reset, so the next burst is free to try again rather than being stuck.
    await playback.playFrames("cc", 0x01, frame());
    expect(native.startPlayback).toHaveBeenCalledTimes(2);
  });

  it("does nothing for an empty batch", async () => {
    const playback = new NativeAudioPlayback();
    await playback.playFrames("aa", 0x01, []);

    expect(native.startPlayback).not.toHaveBeenCalled();
    expect(native.enqueueFrames).not.toHaveBeenCalled();
  });
});

describe("NativeAudioPlayback autoplay gate", () => {
  // Audio must never start from a screen the user is not looking at. The burst
  // is still tracked (so "X is talking" stays right), it just makes no sound.
  it("stays silent when the conversation is not on screen", async () => {
    const playback = new NativeAudioPlayback(() => false);
    await playback.playFrames("aa", 0x01, frame());

    expect(native.startPlayback).not.toHaveBeenCalled();
    expect(native.enqueueFrames).not.toHaveBeenCalled();
  });

  it("plays when the conversation is on screen", async () => {
    const playback = new NativeAudioPlayback(() => true);
    await playback.playFrames("aa", 0x01, frame());

    expect(native.startPlayback).toHaveBeenCalledTimes(1);
  });

  it("cuts the audio when the user leaves mid-burst", async () => {
    // Backgrounding the app or walking out of the thread should stop the sound
    // where it happens, not at the end of whatever was being said.
    let audible = true;
    const playback = new NativeAudioPlayback(() => audible);
    await playback.playFrames("aa", 0x01, frame());
    expect(native.startPlayback).toHaveBeenCalledTimes(1);

    audible = false;
    await playback.playFrames("aa", 0x01, frame());
    expect(native.stopPlayback).toHaveBeenCalledTimes(1);
    expect(native.enqueueFrames).toHaveBeenCalledTimes(1); // no second batch
  });

  it("picks the audio back up when the user returns", async () => {
    let audible = false;
    const playback = new NativeAudioPlayback(() => audible);
    await playback.playFrames("aa", 0x01, frame());
    audible = true;
    await playback.playFrames("aa", 0x01, frame());

    expect(native.startPlayback).toHaveBeenCalledTimes(1);
    expect(native.enqueueFrames).toHaveBeenCalledTimes(1);
  });
});
