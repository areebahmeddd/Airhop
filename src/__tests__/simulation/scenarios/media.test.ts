/**
 * @jest-environment node
 */
// Attachments and voice: the two features whose bugs only show up when
// something else is happening at the same moment.
//
// A photo is one FILE_TRANSFER packet split into fragments that each fit a single
// BLE write, paced onto the radio 20ms apart. A live voice burst is a stream of
// small packets that must NOT enter the fragment scheduler. Both share one
// radio. Every
// scenario here is about what happens when they share it badly.

jest.mock("expo-location", () => ({}));
jest.mock("react-native/Libraries/EventEmitter/RCTDeviceEventEmitter", () =>
  // Every phone needs its own listener set. See harness/event-router.ts: this
  // is the only interception point that reliably catches every path by which
  // mesh-service and the native modules reach the emitter.
  (
    require("../harness/event-router") as { routerModule: () => unknown }
  ).routerModule(),
);
jest.mock("@bridge/NativeAirhopBLE", () => {
  const shim = require("../../harness/bridge-shim");
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("@bridge/NativeAirhopWiFi", () => {
  const shim = require("../../harness/bridge-shim");
  return { __esModule: true, default: shim.wifiBridge };
});
// Each of these factories re-runs inside every sandboxed phone's module
// registry, so each phone gets its own disk and its own microphone.
jest.mock("expo-file-system", () =>
  require("../harness/media-fabric").createExpoFileSystemMock(),
);
jest.mock("@bridge/NativeAirhopVoice", () => {
  const { createNativeVoiceMock } = require("../harness/media-fabric");
  const built = createNativeVoiceMock();
  const mod = built.module as Record<string, unknown>;
  mod.__record = built.record;
  return { __esModule: true, default: mod };
});

import {
  encodeFilePacket,
  MAX_SENT_IMAGE_BYTES,
} from "@core/mesh/wire/file-packet";
import {
  decodePacket,
  encodePacket,
  Flags,
  PacketType,
  signPacket,
  type Packet,
} from "@core/mesh/wire/packet-codec";
import { BitchatActor } from "../harness/bitchat-actor";
import { SimDevice, type DeviceSpec } from "../harness/device";
import {
  exactlyOnce,
  noCrashes,
  noForgedSenders,
  noOversizedFrames,
} from "../harness/invariants";
import { media, sameBytes } from "../harness/media-fabric";
import { RadioFabric } from "../harness/radio-fabric";
import { Scenario, waitFor } from "../harness/scenario";

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// The bridge carries base64, so an injected packet has to be encoded the way
// the native module would encode it.
function toBase64(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];
    out += B64[b0 >> 2];
    out += B64[((b0 & 0x03) << 4) | ((b1 ?? 0) >> 4)];
    out += b1 === undefined ? "=" : B64[((b1 & 0x0f) << 2) | ((b2 ?? 0) >> 6)];
    out += b2 === undefined ? "=" : B64[b2 & 0x3f];
  }
  return out;
}

function peerIdToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

// An attachment packet that CLAIMS to come from `claimedPeerID`.
function forgeAttachment(opts: {
  claimedPeerID: string;
  recipientPeerID?: string;
  channel?: string;
  content: Uint8Array;
  caption: string;
  timestamp: number;
  signWith?: Uint8Array;
}): string {
  const tlv = encodeFilePacket({
    fileName: "photo.jpg",
    mimeType: "image/jpeg",
    content: opts.content,
    channel: opts.channel,
    caption: opts.caption,
  })!;
  const directed = opts.recipientPeerID !== undefined;
  const packet: Packet = {
    type: PacketType.FILE_TRANSFER,
    ttl: 7,
    flags:
      (directed ? Flags.HAS_RECIPIENT : 0) |
      (opts.signWith !== undefined ? Flags.SIGNED : 0),
    senderID: peerIdToBytes(opts.claimedPeerID),
    recipientID: directed
      ? peerIdToBytes(opts.recipientPeerID!)
      : new Uint8Array(8),
    timestamp: opts.timestamp,
    signature: new Uint8Array(64),
    payload: tlv,
  };
  if (opts.signWith !== undefined) {
    packet.signature = signPacket(packet, opts.signWith);
  }
  return toBase64(encodePacket(packet));
}

let scenario: Scenario | null = null;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  scenario?.close();
  scenario = null;
  jest.clearAllTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

function room(
  s: Scenario,
  specs: DeviceSpec[],
): { radio: RadioFabric; devices: SimDevice[] } {
  const radio = new RadioFabric(s.world);
  const devices = specs.map((spec) => SimDevice.create(s.world, spec));
  for (const d of devices) radio.add(d);
  s.track(...devices);
  for (const d of devices) d.launch();
  return { radio, devices };
}

const android = (id: string, seedByte: number): DeviceSpec => ({
  id,
  platform: "android",
  seedByte,
});

test("M01 a photo arrives byte-exact and is readable from its bubble", async () => {
  const s = (scenario = new Scenario({
    id: "M01",
    title: "40KB JPEG over BLE: fragment, reassemble, cache, render",
    seed: 3,
  }));
  const { radio, devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
  ]);
  const [alice, bob] = devices;
  await waitFor(s.world, () => alice.peers().includes(bob.peerID), 20_000);

  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);

  const photo = media.jpeg(40_000);
  const accepted = alice.sendAttachment(channel, photo, {
    type: "image",
    name: "roadblock.jpg",
    mimeType: "image/jpeg",
  });
  s.check("the send was accepted by a transport", accepted);

  const arrived = await waitFor(
    s.world,
    () => bob.attachments(channel).length > 0,
    60_000,
  );
  s.check(
    "the attachment arrived",
    arrived,
    `bob has ${bob.attachments(channel).length} attachment(s), ${bob.files().length} file(s) cached`,
  );

  const bubble = bob.attachments(channel)[0];
  s.check(
    "it is rendered as an image with its filename",
    bubble?.attachment?.type === "image" &&
      bubble.attachment.name === "roadblock.jpg",
    `type=${String(bubble?.attachment?.type)} name=${String(bubble?.attachment?.name)}`,
  );
  s.check(
    "the declared size matches what was sent",
    bubble?.attachment?.sizeBytes === photo.length,
    `sizeBytes=${String(bubble?.attachment?.sizeBytes)} sent=${photo.length}`,
  );

  const stored = bubble?.attachment?.uri
    ? bob.readAttachment(bubble.attachment.uri)
    : null;
  s.check(
    "the cached file is byte-identical to what alice sent",
    stored !== null && sameBytes(stored, photo),
    stored === null
      ? "nothing at the bubble's uri"
      : `${stored.length} bytes cached vs ${photo.length} sent`,
  );
  s.expectNone("exactly once", exactlyOnce(devices));
  s.expectNone("every frame fits a BLE write", noOversizedFrames(radio));
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("M10 a photo at the send budget arrives, every frame legal", async () => {
  const s = (scenario = new Scenario({
    id: "M10",
    title: "256KiB JPEG: the largest photo Airhop will put on the air",
    seed: 31,
  }));
  const { radio, devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
  ]);
  const [alice, bob] = devices;
  await waitFor(s.world, () => alice.peers().includes(bob.peerID), 20_000);

  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);

  // The whole media tier used to top out at 40 KB, which is 88 fragments. Nothing
  // exercised the hundreds-of-fragments path where a sizing mistake or a stalled
  // assembly actually shows up.
  const photo = media.jpeg(MAX_SENT_IMAGE_BYTES);
  const accepted = alice.sendAttachment(channel, photo, {
    type: "image",
    name: "big.jpg",
    mimeType: "image/jpeg",
  });
  s.check("the send was accepted by a transport", accepted);

  const arrived = await waitFor(
    s.world,
    () => bob.attachments(channel).length > 0,
    120_000,
  );
  s.check(
    "a photo at the send budget still arrives whole",
    arrived,
    `bob has ${bob.attachments(channel).length} attachment(s)`,
  );

  const bubble = bob.attachments(channel)[0];
  const stored = bubble?.attachment?.uri
    ? bob.readAttachment(bubble.attachment.uri)
    : null;
  s.check(
    "byte-identical after several hundred fragments",
    stored !== null && sameBytes(stored, photo),
    stored === null
      ? "nothing at the bubble's uri"
      : `${stored.length} bytes cached vs ${photo.length} sent`,
  );

  s.expectNone("exactly once", exactlyOnce(devices));
  s.expectNone("every frame fits a BLE write", noOversizedFrames(radio));
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("M02 three phones sending photos to one receiver at the same time", async () => {
  const s = (scenario = new Scenario({
    id: "M02",
    title: "parallel inbound transfers contend for one radio",
    seed: 17,
  }));
  const { radio, devices } = room(s, [
    android("hub", 11),
    android("a", 22),
    android("b", 33),
    android("c", 44),
  ]);
  const [hub, ...senders] = devices;
  await waitFor(
    s.world,
    () => senders.every((d) => d.peers().includes(hub.peerID)),
    30_000,
  );
  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);

  // All three start on the same tick. This is the case that used to lose files
  // before the pacer learned to back off on a refused write.
  const sent = new Map<string, Uint8Array>();
  for (const sender of senders) {
    const bytes = media.jpeg(20_000 + sender.id.charCodeAt(0) * 7);
    sent.set(sender.id, bytes);
    sender.sendAttachment(channel, bytes, {
      type: "image",
      name: `${sender.id}.jpg`,
      mimeType: "image/jpeg",
    });
  }

  const allIn = await waitFor(
    s.world,
    () => hub.attachments(channel).length >= 3,
    120_000,
  );
  s.check(
    "all three transfers completed",
    allIn,
    `hub received ${hub.attachments(channel).length} of 3`,
  );

  for (const sender of senders) {
    const bubble = hub
      .attachments(channel)
      .find((m) => m.attachment?.name === `${sender.id}.jpg`);
    const original = sent.get(sender.id);
    const stored =
      bubble?.attachment?.uri !== undefined
        ? hub.readAttachment(bubble.attachment.uri)
        : null;
    s.check(
      `${sender.id}'s photo arrived intact and was not mixed with another`,
      stored !== null && original !== undefined && sameBytes(stored, original),
      stored === null
        ? "missing"
        : `${stored.length} bytes vs ${String(original?.length)} sent`,
    );
  }
  s.expectNone("exactly once", exactlyOnce(devices));
  s.expectNone("no forged senders", noForgedSenders(devices));
  s.expectNone("every frame fits a BLE write", noOversizedFrames(radio));
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("M03 a file that lies about its type is refused", async () => {
  const s = (scenario = new Scenario({
    id: "M03",
    title: "declared image/jpeg, actually a PDF",
    seed: 21,
  }));
  const { radio, devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
  ]);
  const [alice, bob] = devices;
  await waitFor(s.world, () => alice.peers().includes(bob.peerID), 20_000);
  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);

  // A real photo first, so a later refusal cannot be explained by a broken link.
  alice.sendAttachment(channel, media.jpeg(8_000), {
    type: "image",
    name: "real.jpg",
    mimeType: "image/jpeg",
  });
  const good = await waitFor(
    s.world,
    () => bob.attachments(channel).length === 1,
    60_000,
  );
  s.check("a genuine photo gets through", good);

  // Now bytes whose magic says PDF while the packet claims JPEG. The receiver
  // checks magic against the declared type precisely so a file cannot lie about
  // what it is (PROTOCOLS.md 3.2).
  alice.sendAttachment(channel, media.pdf(8_000), {
    type: "image",
    name: "not-really.jpg",
    mimeType: "image/jpeg",
  });
  await s.world.advance(30_000);

  const liar = bob
    .attachments(channel)
    .find((m) => m.attachment?.name === "not-really.jpg");
  s.check(
    "a file whose magic bytes contradict its MIME is not rendered",
    liar === undefined,
    `bob attachments: ${bob
      .attachments(channel)
      .map((m) => String(m.attachment?.name))
      .join(", ")}`,
  );
  s.expectNone("every frame fits a BLE write", noOversizedFrames(radio));
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("M04 a voice note is delivered as a playable file", async () => {
  const s = (scenario = new Scenario({
    id: "M04",
    title: "recorded AAC sent as a file, with its duration",
    seed: 23,
  }));
  const { radio, devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
  ]);
  const [alice, bob] = devices;
  await waitFor(s.world, () => alice.peers().includes(bob.peerID), 20_000);
  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);

  const note = media.voiceNote(24_000);
  alice.sendAttachment(channel, note, {
    type: "voice",
    name: "note.m4a",
    mimeType: "audio/aac",
    durationMs: 7_400,
  });

  const arrived = await waitFor(
    s.world,
    () => bob.attachments(channel).length > 0,
    60_000,
  );
  s.check("the voice note arrived", arrived);

  const bubble = bob.attachments(channel)[0];
  s.check(
    "it renders as voice, not as a document",
    bubble?.attachment?.type === "voice",
    `type=${String(bubble?.attachment?.type)}`,
  );
  s.check(
    "its duration survived the wire (Airhop TLV 0x06)",
    bubble?.attachment?.durationMs === 7_400,
    `durationMs=${String(bubble?.attachment?.durationMs)}`,
  );
  const stored =
    bubble?.attachment?.uri !== undefined
      ? bob.readAttachment(bubble.attachment.uri)
      : null;
  s.check(
    "the audio is on disk and playable, byte-exact",
    stored !== null && sameBytes(stored, note),
    stored === null ? "no bytes at the uri" : `${stored.length} bytes`,
  );
  s.expectNone("every frame fits a BLE write", noOversizedFrames(radio));
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("M08 an attachment cannot be forged, misrouted, or aimed at a room you never joined", async () => {
  // Attachments carry the same authority as text - they render in a thread with
  // a sender's name on them - so they need the same three rules text has.
  const s = (scenario = new Scenario({
    id: "M08",
    title: "attachment forgery, confused deputy, and channel injection",
    seed: 41,
  }));
  const { radio, devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
    android("mallory", 77),
  ]);
  const [alice, bob, mallory] = devices;
  await waitFor(s.world, () => bob.peers().includes(alice.peerID), 20_000);
  await waitFor(s.world, () => bob.peers().includes(mallory.peerID), 20_000);
  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);

  const captions = (): string[] =>
    [...bob.texts(channel), ...bob.texts(`dm:${alice.peerID}`)].filter(Boolean);

  // 1. Unsigned, claiming alice. This is the one that used to work: nothing on
  //    the attachment path looked at the signature at all.
  radio.injectTo(
    bob.id,
    mallory.id,
    forgeAttachment({
      claimedPeerID: alice.peerID,
      recipientPeerID: bob.peerID,
      content: media.jpeg(2_000),
      caption: "unsigned, claiming alice",
      timestamp: s.world.wallClock(),
    }),
  );
  await s.world.advance(2_000);
  s.check(
    "an UNSIGNED attachment claiming a known peer is not rendered",
    !captions().includes("unsigned, claiming alice"),
    `bob sees [${captions().join(" | ")}]`,
  );

  // 2. Signed, but with mallory's key while claiming alice's ID.
  radio.injectTo(
    bob.id,
    mallory.id,
    forgeAttachment({
      claimedPeerID: alice.peerID,
      recipientPeerID: bob.peerID,
      content: media.jpeg(2_000),
      caption: "signed by the wrong key",
      timestamp: s.world.wallClock(),
      signWith: mallory.identity.signingPrivKey,
    }),
  );
  await s.world.advance(2_000);
  s.check(
    "an attachment signed by the WRONG key is not rendered",
    !captions().includes("signed by the wrong key"),
    `bob sees [${captions().join(" | ")}]`,
  );

  // 3. Confused deputy: correctly signed by mallory, but addressed to ALICE.
  //    Bob is only a relay here and must forward without ever rendering it.
  //    Before the fix this landed in bob's thread with mallory, which is how a
  //    private photo leaked to every node within seven hops of either end.
  radio.injectTo(
    bob.id,
    mallory.id,
    forgeAttachment({
      claimedPeerID: mallory.peerID,
      recipientPeerID: alice.peerID,
      content: media.jpeg(2_000),
      caption: "addressed to alice, not bob",
      timestamp: s.world.wallClock(),
      signWith: mallory.identity.signingPrivKey,
    }),
  );
  await s.world.advance(2_000);
  s.check(
    "an attachment addressed to someone else is relayed but never rendered",
    ![
      ...bob.texts(channel),
      ...bob.texts(`dm:${mallory.peerID}`),
      ...bob.texts(`dm:${alice.peerID}`),
    ].includes("addressed to alice, not bob"),
    `bob sees [${captions().join(" | ")}]`,
  );

  // 4. Channel injection: a genuinely signed broadcast from mallory tagged for
  //    a room bob never joined. The tag used to be honoured verbatim, and the
  //    room was created on the spot to hold it.
  radio.injectTo(
    bob.id,
    mallory.id,
    forgeAttachment({
      claimedPeerID: mallory.peerID,
      channel: "#never-joined",
      content: media.jpeg(2_000),
      caption: "into a room you never joined",
      timestamp: s.world.wallClock(),
      signWith: mallory.identity.signingPrivKey,
    }),
  );
  await s.world.advance(2_000);
  s.check(
    "an attachment cannot conjure a channel bob never joined",
    !bob.channels().includes("#never-joined"),
    `bob's rooms = [${bob.channels().join(", ")}]`,
  );

  // The control: a real attachment from alice still arrives. A rule that
  // dropped everything would pass all four checks above and be worthless.
  alice.sendAttachment(`dm:${bob.peerID}`, media.jpeg(3_000), {
    type: "image",
    name: "real.jpg",
    mimeType: "image/jpeg",
    caption: "genuinely alice",
  });
  const arrived = await waitFor(
    s.world,
    () => bob.texts(`dm:${alice.peerID}`).includes("genuinely alice"),
    30_000,
  );
  s.check("a genuine attachment from alice still arrives", arrived);

  s.expectNone("no forged senders", noForgedSenders(devices));
  // No frame-size check here. This scenario deliberately injects packets far
  // past the link limit, and bob relaying one is the app under test behaving
  // correctly rather than a sender sizing a frame wrong.
  s.expectNone("process health", noCrashes(devices));
  s.assert();
});

test("M07 a recorded voice burst cannot be replayed later at someone else", async () => {
  // Live voice is the one feature where a signature alone is not enough.
  //
  // The signing preimage normalises ttl and isRSR, so a captured VOICE_FRAME
  // replays byte-for-byte and verifies perfectly against the real speaker's
  // announce-bound key. The deduplicator is no defence either: its window is
  // five minutes and its state is per device, so it has nothing to say about a
  // phone that never heard the original. Without a freshness bound, someone
  // could record Alice in one room and play her voice out of a stranger's phone
  // later, attributed to her and presented as live.
  const s = (scenario = new Scenario({
    id: "M07",
    title: "voice burst replay",
    seed: 31,
  }));
  const { radio, devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
    android("carol", 33),
  ]);
  const [alice, bob, carol] = devices;
  await waitFor(s.world, () => bob.peers().includes(alice.peerID), 20_000);
  await waitFor(s.world, () => carol.peers().includes(alice.peerID), 20_000);
  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);
  bob.listenTo(channel);
  carol.listenTo(channel);

  // Capture everything Alice puts on the air, exactly as an attacker with a
  // radio would. No keys, no session, no cooperation from anyone.
  const captured: string[] = [];
  const untap = radio.tapWrites((fromID, _linkID, dataBase64) => {
    if (fromID === alice.id) captured.push(dataBase64);
  });

  const started = await alice.startVoiceBurst(channel);
  s.check("the microphone opened", started);
  await s.world.advance(1_000);
  await alice.stopVoiceBurst();
  await s.world.advance(2_000);
  untap();

  const heardLive = carol.voice?.framesPlayed.length ?? 0;
  s.check(
    "carol heard the burst live",
    heardLive > 0,
    `${String(heardLive)} frames played`,
  );
  s.check("frames were captured off the air", captured.length > 0);

  // Well past the 30s window. Also past the deduplicator's five minutes, so
  // dedup cannot be what refuses the replay.
  await s.world.advance(10 * 60 * 1000);

  const bobBefore = bob.voice?.framesPlayed.length ?? 0;
  for (const frame of captured) radio.injectTo(bob.id, alice.id, frame);
  await s.world.advance(3_000);

  s.check(
    "replaying alice's recorded burst plays nothing",
    (bob.voice?.framesPlayed.length ?? 0) === bobBefore,
    `before=${String(bobBefore)} after=${String(bob.voice?.framesPlayed.length)}`,
  );
  s.expectNone("no forged senders", noForgedSenders(devices));
  s.expectNone("every frame fits a BLE write", noOversizedFrames(radio));
  s.expectNone("process health", noCrashes(devices));
  s.assert();
});

test("M05 live push-to-talk reaches the other phone's speaker", async () => {
  const s = (scenario = new Scenario({
    id: "M05",
    title: "a burst is captured, packetised, relayed, buffered and played",
    seed: 29,
  }));
  const { radio, devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
  ]);
  const [alice, bob] = devices;
  await waitFor(s.world, () => alice.peers().includes(bob.peerID), 20_000);
  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);

  // Bob is looking at the thread, which is what makes audio audible at all.
  bob.listenTo(channel);
  s.check(
    "alice may talk on this channel",
    alice.canSendLiveVoice(channel),
    "a peer is reachable and live voice is enabled",
  );

  const started = await alice.startVoiceBurst(channel);
  s.check("the microphone opened", started);
  // Hold the button for about a second of speech.
  await s.world.advance(1_000);
  await alice.stopVoiceBurst();
  // Past the 350ms jitter buffer, so the receiver has released what it holds.
  await s.world.advance(2_000);

  s.check(
    "alice's microphone actually ran",
    (alice.voice?.captureStarted ?? 0) > 0 &&
      (alice.voice?.captureStopped ?? 0) > 0,
    `started=${String(alice.voice?.captureStarted)} stopped=${String(alice.voice?.captureStopped)}`,
  );
  s.check(
    "voice packets went on the air as VOICE_FRAME (0x29)",
    radio.countOfType(0x29) > 0,
    `airtime: ${radio.airtimeReport()}`,
  );
  s.check(
    "bob's speaker received frames",
    (bob.voice?.framesPlayed.length ?? 0) > 0,
    `${String(bob.voice?.framesPlayed.length)} frames played`,
  );
  // PROTOCOLS.md 3.1: a voice payload stays under 210 bytes so it never enters
  // the fragment scheduler and cannot starve a file transfer.
  s.check(
    "no voice packet was large enough to be fragmented",
    radio.countOfType(0x20) === 0,
    `FRAGMENT packets seen: ${radio.countOfType(0x20)}`,
  );
  s.expectNone("every frame fits a BLE write", noOversizedFrames(radio));
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("M06 talking while a file is in flight starves neither", async () => {
  const s = (scenario = new Scenario({
    id: "M06",
    title: "a photo transfer and a voice burst share one radio",
    seed: 31,
  }));
  const { radio, devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
  ]);
  const [alice, bob] = devices;
  await waitFor(s.world, () => alice.peers().includes(bob.peerID), 20_000);
  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);
  bob.listenTo(channel);

  const photo = media.jpeg(60_000);
  alice.sendAttachment(channel, photo, {
    type: "image",
    name: "busy.jpg",
    mimeType: "image/jpeg",
  });
  // Start talking a moment into the transfer, so the two genuinely overlap.
  await s.world.advance(400);
  const talking = await alice.startVoiceBurst(channel);
  s.check("the burst opened while a transfer was running", talking);
  await s.world.advance(1_200);
  await alice.stopVoiceBurst();

  const done = await waitFor(
    s.world,
    () => bob.attachments(channel).length > 0,
    120_000,
  );
  s.check(
    "the file still completed",
    done,
    `bob has ${bob.attachments(channel).length} attachment(s)`,
  );
  const bubble = bob.attachments(channel)[0];
  const stored =
    bubble?.attachment?.uri !== undefined
      ? bob.readAttachment(bubble.attachment.uri)
      : null;
  s.check(
    "and arrived byte-exact despite the contention",
    stored !== null && sameBytes(stored, photo),
    stored === null ? "missing" : `${stored.length} of ${photo.length} bytes`,
  );
  s.check(
    "the audio was heard too",
    (bob.voice?.framesPlayed.length ?? 0) > 0,
    `${String(bob.voice?.framesPlayed.length)} frames played`,
  );
  s.check(
    "both traffic classes were on the air",
    radio.countOfType(0x29) > 0 && radio.countOfType(0x20) > 0,
    radio.airtimeReport(),
  );
  s.expectNone("every frame fits a BLE write", noOversizedFrames(radio));
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("M09 a private photo is sealed in the session, not signed in the open", async () => {
  // What this is really about: a DM attachment used to cross the mesh as a
  // signed FILE_TRANSFER. Signed means a relay cannot forge it - it does NOT
  // mean a relay cannot read it, and a private photo used to be legible to
  // every node it passed through. bitchat now classifies that wire form as the
  // legacy migration fallback and has scheduled its removal.
  //
  // The seal is gated on the recipient having proven capability bit 8 inside a
  // Noise session (payload 0x21), never on the bit it announced - an announce
  // is self-signed with a key it carries itself, so gating on that would let
  // anyone in radio range clear the bit for a peer and force every attachment
  // back into the clear.
  const s = (scenario = new Scenario({
    id: "M09",
    title: "a DM attachment never appears in cleartext on the air",
    seed: 21,
  }));
  const { radio, devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
    android("relay", 33),
  ]);
  const [alice, bob] = devices;
  // A DM attachment needs a DIRECT link, not merely a known peer: a file is far
  // too large to flood, so mesh-service refuses the send outright without one.
  const direct = await waitFor(
    s.world,
    () => alice.isDirectPeer(bob.peerID) && bob.isDirectPeer(alice.peerID),
    30_000,
  );
  s.check("alice and bob hold a direct link", direct);

  // Each side keys the thread by the OTHER peer.
  const aliceThread = `dm:${bob.peerID}`;
  const bobThread = `dm:${alice.peerID}`;
  alice.openThread(aliceThread);
  bob.openThread(bobThread);

  // A DM has to happen first: the Noise session, and therefore the 0x21 proof
  // that authorises sealing, is established by talking. This is the real
  // sequence a person goes through, not a shortcut around it.
  alice.send(aliceThread, "sending you the photo");
  const talked = await waitFor(
    s.world,
    () => bob.texts(bobThread).includes("sending you the photo"),
    30_000,
  );
  s.check("a session was established by the first message", talked);

  // Then wait for the thing that actually authorises sealing, rather than
  // treating "the text arrived" as a proxy for it. Bob receiving alice's
  // message proves alice's session works; it does NOT prove alice has yet
  // processed bob's 0x21 coming the other way, and that is what she needs.
  // Sending in that window falls back to signed cleartext by design, which on
  // a slower machine is what this scenario was accidentally measuring.
  const sealable = await waitFor(
    s.world,
    () => alice.mesh?.canSealPrivateMedia(bob.peerID) === true,
    30_000,
  );
  s.check("bob has proven he can read sealed media", sealable);

  // Watch every byte alice puts on the air from here on.
  const onAir: Packet[] = [];
  const stopTap = radio.tapWrites((who, _linkID, dataBase64) => {
    if (who !== alice.id) return;
    const bin = globalThis.atob(dataBase64);
    const raw = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) raw[i] = bin.charCodeAt(i);
    const p = decodePacket(raw);
    if (p !== null) onAir.push(p);
  });

  const photo = media.jpeg(20_000);
  const accepted = alice.sendAttachment(aliceThread, photo, {
    type: "image",
    name: "private.jpg",
    mimeType: "image/jpeg",
  });
  s.check("the send was accepted by a transport", accepted);

  const arrived = await waitFor(
    s.world,
    () => bob.attachments(bobThread).length > 0,
    60_000,
  );
  stopTap();

  s.check(
    "the photo still arrives",
    arrived,
    `bob has ${bob.attachments(bobThread).length} attachment(s)`,
  );
  const uri = bob.attachments(bobThread)[0]?.attachment?.uri;
  const stored = uri !== undefined ? bob.readAttachment(uri) : null;
  s.check(
    "and it decrypts to the exact bytes alice picked",
    stored !== null && sameBytes(stored, photo),
    stored === null
      ? "nothing at the bubble's uri"
      : `${stored.length} bytes cached vs ${photo.length} sent`,
  );

  const fragments = onAir.filter((p) => p.type === PacketType.FRAGMENT);
  s.check(
    "the file went out fragmented, as any file does",
    fragments.length > 0,
    `saw ${String(fragments.length)} fragments`,
  );

  // The load-bearing assertion. Checking only for a whole FILE_TRANSFER packet
  // would be worthless: a 20KB file is always split, so no whole file packet is
  // transmitted either way, and that check passes just as happily when the
  // photo crosses the mesh in the clear. The fragment header names the inner
  // type it carries (byte 12), which is what distinguishes the two wire forms.
  const innerTypes = new Set(
    fragments.map((f) => (f.payload.length > 12 ? f.payload[12] : -1)),
  );
  s.check(
    "every fragment carries a Noise-encrypted packet, not a file packet",
    fragments.length > 0 && !innerTypes.has(PacketType.FILE_TRANSFER),
    `inner types seen: [${[...innerTypes].join(",")}] (${String(PacketType.FILE_TRANSFER)} would be cleartext)`,
  );
  s.check(
    "and no whole cleartext file packet was transmitted either",
    onAir.every((p) => p.type !== PacketType.FILE_TRANSFER),
  );

  s.expectNone("every frame fits a BLE write", noOversizedFrames(radio));
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("M12 a photo Airhop sends is reassembled by a bitchat phone", async () => {
  // The one claim nothing tested. Byte fixtures prove our file TLV matches
  // bitchat's layout, and the radio's link limit proves each frame is legal, but
  // neither says a node playing by bitchat's rules can put the fragments back
  // together and get the original photo out. That is exactly what was false in
  // the field: every frame was 45 bytes over the ATT ceiling, so bitchat's
  // decoder rejected each one and no photo ever arrived, silently, in both
  // directions.
  //
  // Sent at the real send budget, so this also stands as the guard on it: 256KiB
  // is about eleven seconds of paced fragments, and bitchat abandons a stream
  // thirty seconds after its FIRST fragment. Raise the budget far enough and this
  // scenario reports an expired assembly instead of a photo.
  const s = (scenario = new Scenario({
    id: "M12",
    title: "Airhop photo, reassembled and decoded by bitchat's rules",
    seed: 41,
  }));
  const radio = new RadioFabric(s.world);
  const alice = SimDevice.create(s.world, android("alice", 11));
  const droid = new BitchatActor(s.world, {
    id: "droid",
    platform: "android",
    seedByte: 231,
    channels: ["#bluetooth"],
  });
  radio.add(alice);
  radio.add(droid);
  s.track(alice);
  alice.launch();
  droid.launch();

  const channel = "#bluetooth";
  alice.joinChannel(channel);

  // An unverifiable file packet is dropped, and the signing key travels in the
  // ANNOUNCE, so there is nothing to test until the two have met.
  const met = await waitFor(
    s.world,
    () => droid.seen.knownPeers.has(alice.peerID),
    30_000,
  );
  s.check("the bitchat phone learned alice and her signing key", met);

  const photo = media.jpeg(MAX_SENT_IMAGE_BYTES);
  const accepted = alice.sendAttachment(channel, photo, {
    type: "image",
    name: "img_9f8e7d6c-5b4a-4938-8271-6f5e4d3c2b1a.jpg",
    mimeType: "image/jpeg",
  });
  s.check("the send was accepted by a transport", accepted);

  const arrived = await waitFor(
    s.world,
    () => droid.seen.filesReceived.length > 0,
    120_000,
  );
  s.check(
    "bitchat reassembled the fragments into a file",
    arrived,
    `filesReceived=${droid.seen.filesReceived.length} expired=${droid.seen.expiredAssemblies}`,
  );

  const file = droid.seen.filesReceived[0];
  s.check(
    "the photo is byte-identical to what alice sent",
    file !== undefined && sameBytes(file.content, photo),
    file === undefined
      ? "nothing decoded"
      : `${file.content.length}B decoded vs ${photo.length}B sent`,
  );
  s.check(
    "the name and MIME survived the TLV",
    file?.mime === "image/jpeg" && (file?.name ?? "").startsWith("img_"),
    `name=${String(file?.name)} mime=${String(file?.mime)}`,
  );
  // The window is measured from the first fragment, so a transfer that is too
  // large or paced too slowly shows up here rather than as a missing photo.
  s.check(
    "no stream was abandoned inside bitchat's assembly window",
    droid.seen.expiredAssemblies === 0,
    `${droid.seen.expiredAssemblies} expired`,
  );
  s.check(
    "it went as fragmented FILE_TRANSFER, the path bitchat understands",
    radio.countOfType(0x20) > 0,
    `airtime: ${radio.airtimeReport()}`,
  );

  s.expectNone("every frame fits a BLE write", noOversizedFrames(radio));
  s.expectNone("process health", noCrashes([alice]));
  s.assert(true);
});

test("M11 a bitchat-Android voice burst reaches an Airhop speaker", async () => {
  // Broadcast has two encodings on the wire and both mean the same thing.
  // bitchat-iOS and Airhop leave the recipient field out; bitchat-Android
  // writes eight 0xFF bytes with HAS_RECIPIENT set. Live voice is refused
  // unless the packet is addressed to everyone, so a receiver that knows only
  // the first encoding drops every Android burst, silently and completely: no
  // error, no bubble, just a person talking and nobody hearing it.
  const s = (scenario = new Scenario({
    id: "M11",
    title: "the all-0xFF broadcast sentinel is accepted",
    seed: 37,
  }));
  const radio = new RadioFabric(s.world);
  const bob = SimDevice.create(s.world, android("bob", 22));
  const droid = new BitchatActor(s.world, {
    id: "droid",
    platform: "android",
    seedByte: 230,
  });
  radio.add(bob);
  radio.add(droid);
  s.track(bob);
  bob.launch();
  droid.launch();

  const channel = "#bluetooth";
  bob.joinChannel(channel);
  bob.listenTo(channel);

  // The signing key travels in the ANNOUNCE, and an unverifiable voice frame is
  // dropped, so there is nothing to test until bob has one.
  const met = await waitFor(
    s.world,
    () => bob.peers().includes(droid.peerID),
    30_000,
  );
  s.check("bob learned the bitchat peer and its signing key", met);

  droid.sendVoiceBurst();
  // Past the 350ms jitter buffer, so the player has released what it holds.
  await s.world.advance(2_000);

  s.check(
    "bob's speaker played the burst",
    (bob.voice?.framesPlayed.length ?? 0) > 0,
    `${String(bob.voice?.framesPlayed.length ?? 0)} frames played`,
  );
  // The frames that came out of the speaker are the ones the bitchat node put
  // in, not something the player synthesised to cover a gap.
  s.check(
    "the audio is what was spoken, byte for byte",
    (bob.voice?.framesPlayed ?? []).some(
      (f) => f.length === 60 && f.every((b) => b === 0x5a),
    ),
    `frame sizes: [${(bob.voice?.framesPlayed ?? []).map((f) => f.length).join(",")}]`,
  );
  s.check(
    "it arrived as VOICE_FRAME (0x29), not through the fragment scheduler",
    radio.countOfType(0x29) > 0 && radio.countOfType(0x20) === 0,
    `airtime: ${radio.airtimeReport()}`,
  );
  s.expectNone("every frame fits a BLE write", noOversizedFrames(radio));
  s.expectNone("process health", noCrashes([bob]));
  s.assert(true);
});
