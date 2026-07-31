/**
 * @jest-environment node
 */
// Attachments and voice: the two features whose bugs only show up when
// something else is happening at the same moment.
//
// A photo is one FILE_TRANSFER packet split into 469-byte fragments and paced
// onto the radio 20ms apart. A live voice burst is a stream of small packets
// that must NOT enter the fragment scheduler. Both share one radio. Every
// scenario here is about what happens when they share it badly.

jest.mock("expo-location", () => ({}));
jest.mock("react-native/Libraries/EventEmitter/RCTDeviceEventEmitter", () =>
  // Every phone needs its own listener set. See harness/event-router.ts: this
  // is the only interception point that reliably catches every path by which
  // mesh-service and the native modules reach the emitter.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  (
    require("./harness/event-router") as { routerModule: () => unknown }
  ).routerModule(),
);
jest.mock("../../../bridge/NativeAirhopBLE", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const shim = require("../lifecycle/harness/bridge-shim");
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("../../../bridge/NativeAirhopWiFi", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const shim = require("../lifecycle/harness/bridge-shim");
  return { __esModule: true, default: shim.wifiBridge };
});
// Each of these factories re-runs inside every sandboxed phone's module
// registry, so each phone gets its own disk and its own microphone.
jest.mock("expo-file-system", () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("./harness/media-fabric").createExpoFileSystemMock(),
);
jest.mock("../../../bridge/NativeAirhopVoice", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createNativeVoiceMock } = require("./harness/media-fabric");
  const built = createNativeVoiceMock();
  const mod = built.module as Record<string, unknown>;
  mod.__record = built.record;
  return { __esModule: true, default: mod };
});

import { SimDevice, type DeviceSpec } from "./harness/device";
import { exactlyOnce, noCrashes, noForgedSenders } from "./harness/invariants";
import { media, sameBytes } from "./harness/media-fabric";
import { RadioFabric } from "./harness/radio-fabric";
import { Scenario, waitFor } from "./harness/scenario";

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

// ---------------------------------------------------------------------------

test("M01 a photo arrives byte-exact and is readable from its bubble", async () => {
  const s = (scenario = new Scenario({
    id: "M01",
    title: "40KB JPEG over BLE: fragment, reassemble, cache, render",
    seed: 3,
  }));
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
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
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("M02 three phones sending photos to one receiver at the same time", async () => {
  const s = (scenario = new Scenario({
    id: "M02",
    title: "parallel inbound transfers contend for one radio",
    seed: 17,
  }));
  const { devices } = room(s, [
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
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("M03 a file that lies about its type is refused", async () => {
  const s = (scenario = new Scenario({
    id: "M03",
    title: "declared image/jpeg, actually a PDF",
    seed: 21,
  }));
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
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
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("M04 a voice note is delivered as a playable file", async () => {
  const s = (scenario = new Scenario({
    id: "M04",
    title: "recorded AAC sent as a file, with its duration",
    seed: 23,
  }));
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
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
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
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
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});
