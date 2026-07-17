/**
 * @jest-environment node
 */
import { ed25519 } from "@noble/curves/ed25519.js";
import { PacketType, type Packet } from "../packet-codec";
import {
  VIDEO_FRAME_HEADER_SIZE,
  VideoCapture,
  VideoCodec,
  decodeVideoFramePayload,
  encodeVideoFramePayload,
  type VideoCaptureBackend,
  type VideoFrameHeader,
} from "../video-capture";
import { VideoPlayer, type VideoPlaybackBackend } from "../video-player";

// ---- Header codec tests -----------------------------------------------------

describe("encodeVideoFramePayload / parseVideoFramePayload", () => {
  const baseHeader: VideoFrameHeader = {
    sessionId: 0xdeadbeef,
    frameSeq: 42,
    width: 854,
    height: 480,
    codec: VideoCodec.HEVC,
    isKeyFrame: true,
    isLast: false,
  };

  test("round-trip: header and frame data survive encode/parse", () => {
    const frameData = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
    const payload = encodeVideoFramePayload(baseHeader, frameData);
    const result = decodeVideoFramePayload(payload);

    expect(result).not.toBeNull();
    const { header, frameData: out } = result!;
    expect(header.sessionId).toBe(baseHeader.sessionId);
    expect(header.frameSeq).toBe(baseHeader.frameSeq);
    expect(header.width).toBe(854);
    expect(header.height).toBe(480);
    expect(header.codec).toBe(VideoCodec.HEVC);
    expect(header.isKeyFrame).toBe(true);
    expect(header.isLast).toBe(false);
    expect(Array.from(out)).toEqual([0x00, 0x01, 0x02, 0x03]);
  });

  test("is_last flag round-trips", () => {
    const h = { ...baseHeader, isLast: true, isKeyFrame: false };
    const payload = encodeVideoFramePayload(h, new Uint8Array(0));
    const result = decodeVideoFramePayload(payload);
    expect(result!.header.isLast).toBe(true);
    expect(result!.header.isKeyFrame).toBe(false);
  });

  test("empty frame data (end-of-session marker)", () => {
    const payload = encodeVideoFramePayload(
      { ...baseHeader, isLast: true },
      new Uint8Array(0),
    );
    const result = decodeVideoFramePayload(payload);
    expect(result!.frameData).toHaveLength(0);
  });

  test("minimum valid payload is exactly VIDEO_FRAME_HEADER_SIZE bytes", () => {
    const payload = new Uint8Array(VIDEO_FRAME_HEADER_SIZE);
    expect(decodeVideoFramePayload(payload)).not.toBeNull();
  });

  test("too-short payload returns null", () => {
    expect(
      decodeVideoFramePayload(new Uint8Array(VIDEO_FRAME_HEADER_SIZE - 1)),
    ).toBeNull();
    expect(decodeVideoFramePayload(new Uint8Array(0))).toBeNull();
  });
});

// ---- VideoCapture tests -----------------------------------------------------

function makeBackend(
  onFrame?: (data: Uint8Array, isKey: boolean) => void,
): VideoCaptureBackend {
  let frameCallback: ((data: Uint8Array, isKey: boolean) => void) | null = null;
  return {
    async startCapture(
      _w: number,
      _h: number,
      cb: (data: Uint8Array, isKey: boolean) => void,
    ) {
      frameCallback = cb;
      onFrame && cb(new Uint8Array(64).fill(0x01), true); // synthetic key frame
    },
    async stopCapture() {
      frameCallback = null;
    },
    // Test helper: push a frame programmatically.
    _pushFrame(data: Uint8Array, isKey: boolean) {
      frameCallback?.(data, isKey);
    },
  } as VideoCaptureBackend & {
    _pushFrame: (d: Uint8Array, k: boolean) => void;
  };
}

describe("VideoCapture", () => {
  const signingPriv = ed25519.utils.randomSecretKey();
  const peerID = "aabbccddeeff0011";

  test("startSession emits a signed VIDEO_FRAME packet", async () => {
    const packets: Packet[] = [];
    const capture = new VideoCapture(
      {
        senderPeerID: peerID,
        signingPrivKey: signingPriv,
        onPacket: (p) => packets.push(p),
      },
      makeBackend(() => {}), // pass truthy onFrame so the backend emits a synthetic frame
    );

    await capture.startSession();
    expect(packets.length).toBeGreaterThanOrEqual(1);
    expect(packets[0].type).toBe(PacketType.VIDEO_FRAME);
    // TTL must be 1 (WiFi Direct only, not to be relayed over BLE).
    expect(packets[0].ttl).toBe(1);
    await capture.stopSession();
  });

  test("stopSession emits a final is_last packet", async () => {
    const packets: Packet[] = [];
    const capture = new VideoCapture(
      {
        senderPeerID: peerID,
        signingPrivKey: signingPriv,
        onPacket: (p) => packets.push(p),
      },
      makeBackend(),
    );

    await capture.startSession();
    packets.length = 0; // clear init frame
    await capture.stopSession();

    expect(packets.length).toBe(1);
    const result = decodeVideoFramePayload(packets[0].payload);
    expect(result!.header.isLast).toBe(true);
  });

  test("isActive reflects session state", async () => {
    const capture = new VideoCapture(
      { senderPeerID: peerID, signingPrivKey: signingPriv, onPacket: () => {} },
      makeBackend(),
    );

    expect(capture.isActive).toBe(false);
    await capture.startSession();
    expect(capture.isActive).toBe(true);
    await capture.stopSession();
    expect(capture.isActive).toBe(false);
  });

  test("calling startSession twice is idempotent", async () => {
    const callCount = { start: 0 };
    const backend: VideoCaptureBackend = {
      async startCapture() {
        callCount.start++;
      },
      async stopCapture() {},
    };
    const capture = new VideoCapture(
      { senderPeerID: peerID, signingPrivKey: signingPriv, onPacket: () => {} },
      backend,
    );

    await capture.startSession();
    await capture.startSession();
    expect(callCount.start).toBe(1);
    await capture.stopSession();
  });
});

// ---- VideoPlayer tests ------------------------------------------------------

function makePlaybackBackend(): VideoPlaybackBackend & {
  rendered: Uint8Array[][];
  ended: number[];
} {
  const rendered: Uint8Array[][] = [];
  const ended: number[] = [];
  return {
    async renderFrames(_id, _codec, _w, _h, frames) {
      rendered.push(frames);
    },
    endSession(id) {
      ended.push(id);
    },
    rendered,
    ended,
  };
}

function makeFakePacket(
  header: VideoFrameHeader,
  frameData: Uint8Array,
  senderPeerIDBytes: Uint8Array,
): import("../packet-codec").Packet {
  return {
    type: PacketType.VIDEO_FRAME,
    ttl: 1,
    flags: 0,
    senderID: senderPeerIDBytes,
    recipientID: new Uint8Array(8),
    timestamp: Math.floor(Date.now() / 1000),
    signature: new Uint8Array(64),
    payload: encodeVideoFramePayload(header, frameData),
  };
}

describe("VideoPlayer", () => {
  const sender = new Uint8Array([
    0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00, 0x11,
  ]);
  const baseHeader: VideoFrameHeader = {
    sessionId: 1,
    frameSeq: 0,
    width: 854,
    height: 480,
    codec: VideoCodec.HEVC,
    isKeyFrame: true,
    isLast: false,
  };

  test("receivePacket returns true for valid VIDEO_FRAME packet", () => {
    const backend = makePlaybackBackend();
    const player = new VideoPlayer(backend);
    const pkt = makeFakePacket(baseHeader, new Uint8Array(16), sender);
    expect(player.receivePacket(pkt)).toBe(true);
    player.disposeAll();
  });

  test("receivePacket returns false for too-short payload", () => {
    const backend = makePlaybackBackend();
    const player = new VideoPlayer(backend);
    const pkt = {
      type: PacketType.VIDEO_FRAME,
      ttl: 1,
      flags: 0,
      senderID: sender,
      recipientID: new Uint8Array(8),
      timestamp: 0,
      signature: new Uint8Array(64),
      payload: new Uint8Array(3), // too short
    };
    expect(player.receivePacket(pkt)).toBe(false);
  });

  test("is_last frame triggers endSession after render", async () => {
    const backend = makePlaybackBackend();
    const player = new VideoPlayer(backend);

    const lastHeader = { ...baseHeader, isLast: true };
    const pkt = makeFakePacket(lastHeader, new Uint8Array(8), sender);
    player.receivePacket(pkt);

    // endSession is called asynchronously after renderFrames resolves.
    await new Promise((r) => setTimeout(r, 20));
    expect(backend.ended).toContain(1);
  });

  test("activeSessionCount tracks live sessions", async () => {
    const backend = makePlaybackBackend();
    const player = new VideoPlayer(backend);

    const pkt = makeFakePacket(baseHeader, new Uint8Array(8), sender);
    player.receivePacket(pkt);
    expect(player.activeSessionCount).toBe(1);

    player.disposeAll();
    expect(player.activeSessionCount).toBe(0);
  });

  test("two different senders create separate sessions", () => {
    const backend = makePlaybackBackend();
    const player = new VideoPlayer(backend);

    const sender2 = new Uint8Array([
      0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
    ]);
    player.receivePacket(makeFakePacket(baseHeader, new Uint8Array(8), sender));
    player.receivePacket(
      makeFakePacket(baseHeader, new Uint8Array(8), sender2),
    );

    expect(player.activeSessionCount).toBe(2);
    player.disposeAll();
  });
});
