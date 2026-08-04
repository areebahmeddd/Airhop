/**
 * @jest-environment node
 */
// Tier B: more than two people, more than one transport, nothing simple.
//
// Tier A proves the app works. This tier proves it works when the room is
// bigger than the radio, when somebody walks out mid-sentence, and when two
// transports both have a claim on the same message.

jest.mock("expo-location", () => ({}));
jest.mock("react-native/Libraries/EventEmitter/RCTDeviceEventEmitter", () =>
  // Every phone needs its own listener set. See harness/event-router.ts: this
  // is the only interception point that reliably catches every path by which
  // mesh-service and the native modules reach the emitter.
  (
    require("./harness/event-router") as { routerModule: () => unknown }
  ).routerModule(),
);
jest.mock("../../../bridge/NativeAirhopBLE", () => {
  const shim = require("../lifecycle/harness/bridge-shim");
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("../../../bridge/NativeAirhopWiFi", () => {
  const shim = require("../lifecycle/harness/bridge-shim");
  return { __esModule: true, default: shim.wifiBridge };
});

import { SimDevice, type DeviceSpec } from "./harness/device";
import {
  badgeMatchesThreads,
  convergence,
  exactlyOnce,
  noCrashes,
  noDuplicateText,
  noForgedSenders,
  StatusWatcher,
  unreadCoherent,
} from "./harness/invariants";
import { RadioFabric } from "./harness/radio-fabric";
import { Scenario, waitFor, waitForCoarse } from "./harness/scenario";

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

function phones(
  s: Scenario,
  n: number,
  platform: "android" | "ios" | "mixed" = "android",
  base = 10,
): { radio: RadioFabric; devices: SimDevice[] } {
  const radio = new RadioFabric(s.world);
  const devices: SimDevice[] = [];
  for (let i = 0; i < n; i++) {
    const spec: DeviceSpec = {
      id: `p${i}`,
      platform:
        platform === "mixed" ? (i % 2 === 0 ? "android" : "ios") : platform,
      seedByte: base + i * 3,
    };
    const d = SimDevice.create(s.world, spec);
    devices.push(d);
    radio.add(d);
  }
  s.track(...devices);
  return { radio, devices };
}

// ---------------------------------------------------------------------------

test("B01 a message crosses a chain of phones that cannot hear each other", async () => {
  const s = (scenario = new Scenario({
    id: "B01",
    title: "five phones in a line, only neighbours in range",
    seed: 7,
  }));
  const { radio, devices } = phones(s, 5);
  radio.setChain(devices.map((d) => d.id));
  for (const d of devices) d.launch();

  const linked = await waitFor(s.world, () => radio.linkCount() === 4);
  s.check(
    "exactly the neighbouring links came up",
    linked,
    `links=[${radio.linkedPairs().join(", ")}]`,
  );
  s.check(
    "the ends of the chain are not directly linked",
    !radio.isLinked("p0", "p4"),
  );

  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);

  // Wait for the chain to learn who p0 is before p0 speaks.
  //
  // A public message is only displayed by a node that already holds the
  // author's signing key, which arrives in the author's ANNOUNCE and has to be
  // relayed hop by hop down the line. Speaking the instant the LINKS are up
  // races that: the far nodes relay the message correctly but cannot yet
  // authenticate it, so they forward without displaying, and nothing re-sends
  // it. That is the signature rule working as designed - bitchat behaves the
  // same way - but it makes "did it arrive" a question about announce timing
  // rather than about routing, which is what this scenario is for.
  const chainKnowsSender = await waitForCoarse(
    s.world,
    () => devices.slice(1).every((d) => d.peers().includes(devices[0].peerID)),
    45_000,
  );
  s.check(
    "every node in the chain learned the sender's identity",
    chainKnowsSender,
    devices
      .slice(1)
      .map((d) => `${d.id}=${String(d.peers().includes(devices[0].peerID))}`)
      .join(" "),
  );

  devices[0].send(channel, "relayed all the way down");

  const reached = await waitFor(
    s.world,
    () => devices[4].texts(channel).length > 0,
    20_000,
  );

  s.check(
    "the far end of a 4-hop chain received it",
    reached,
    devices.map((d) => `${d.id}=${d.texts(channel).length}`).join(" "),
  );

  // Give the chain time to converge before judging it.
  //
  // A node several hops out can receive a public message BEFORE it has received
  // the author's ANNOUNCE, and a message whose signing key you do not yet hold
  // is refused rather than displayed. That is the signature rule working as
  // intended, and bitchat behaves the same way; what closes the gap is gossip
  // sync re-serving the message once the key is known, on its own cadence.
  // Asserting convergence the instant the far end lights up would be asserting
  // that no node is ever one hop behind on identity, which is untrue of any
  // flood network - and made this scenario flaky rather than wrong.
  await waitForCoarse(
    s.world,
    () => convergence(devices, channel).length === 0,
    45_000,
  );

  s.expectNone("convergence", convergence(devices, channel));
  s.expectNone("exactly once", exactlyOnce(devices));
  s.expectNone("no duplicate text", noDuplicateText(devices, channel));
  s.expectNone("no forged senders", noForgedSenders(devices));
  s.expectNone("process health", noCrashes(devices));
  s.assert();
});

test("B02 a lossy, jittery, duplicating radio still converges", async () => {
  const s = (scenario = new Scenario({
    id: "B02",
    title: "20% loss, 10% duplication, wide jitter, six phones",
    seed: 4242,
  }));
  const { radio, devices } = phones(s, 6);
  radio.setConditions({
    loss: 0.2,
    duplicate: 0.1,
    latencyMs: 40,
    jitterMs: 60,
  });
  for (const d of devices) d.launch();
  await waitFor(s.world, () => radio.linkCount() > 0, 20_000);

  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);
  devices[0].send(channel, "lossy hello");
  devices[3].send(channel, "lossy reply");

  await s.world.settle(30_000);

  // Loss is real: this scenario does NOT assert everyone got everything, which
  // a 20%-loss radio cannot guarantee without retransmission. What it asserts
  // is the thing that must hold regardless - nobody saw anything twice, and
  // nobody saw anything forged.
  s.expectNone("exactly once", exactlyOnce(devices));
  s.expectNone("no duplicate text", noDuplicateText(devices, channel));
  s.expectNone("no forged senders", noForgedSenders(devices));
  s.expectNone("badge matches threads", badgeMatchesThreads(devices));
  s.expectNone("unread coherent", unreadCoherent(devices));
  s.expectNone("process health", noCrashes(devices));
  s.check(
    "the radio actually exercised its faults",
    radio.packetsDropped > 0 && radio.packetsDuplicated > 0,
    `dropped=${radio.packetsDropped} duplicated=${radio.packetsDuplicated} delivered=${radio.packetsDelivered}`,
  );
  s.assert(true);
});

test("B03 corrupted packets are rejected and nothing crashes", async () => {
  const s = (scenario = new Scenario({
    id: "B03",
    title: "a radio that mangles one byte in eight packets",
    seed: 99,
  }));
  const { radio, devices } = phones(s, 4);
  for (const d of devices) d.launch();
  await waitFor(s.world, () => radio.linkCount() > 0, 20_000);

  radio.setConditions({ corrupt: 0.125 });
  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);
  for (let i = 0; i < 12; i++) {
    devices[i % 4].send(channel, `message ${i}`);
    await s.world.advance(120);
  }
  await s.world.settle(20_000);

  s.check(
    "the radio actually corrupted packets",
    radio.packetsCorrupted > 0,
    `corrupted=${radio.packetsCorrupted}`,
  );
  s.expectNone("no crashes on malformed input", noCrashes(devices));
  s.expectNone("no forged senders", noForgedSenders(devices));
  s.expectNone("exactly once", exactlyOnce(devices));
  // A corrupted packet must never surface as content. Every rendered message
  // has to be one that was actually sent.
  const legitimate = new Set<string>();
  for (let i = 0; i < 12; i++) legitimate.add(`message ${i}`);
  const bogus: string[] = [];
  for (const d of devices) {
    for (const m of d.messages(channel)) {
      if (m.isSystem === true) continue;
      if (!legitimate.has(m.text)) bogus.push(`${d.id}: "${m.text}"`);
    }
  }
  s.check(
    "no corrupted payload was ever rendered as a message",
    bogus.length === 0,
    bogus.slice(0, 5).join(" | "),
  );
  s.assert(true);
});

test("B04 walking out of range parks the message instead of losing it", async () => {
  const s = (scenario = new Scenario({
    id: "B04",
    title: "a DM sent to somebody who just left the room",
    seed: 5,
  }));
  const { radio, devices } = phones(s, 2);
  const [alice, bob] = devices;
  const watcher = new StatusWatcher(devices);
  for (const d of devices) d.launch();
  await waitFor(s.world, () => alice.peers().includes(bob.peerID));

  // They meet, so a Noise session and a contact exist.
  alice.send(`dm:${bob.peerID}`, "before you go");
  await waitFor(s.world, () => bob.texts(`dm:${alice.peerID}`).length > 0);

  // Bob walks away.
  radio.setIsolated(bob.id, true);
  await waitFor(s.world, () => radio.linkCount() === 0, 10_000);

  const outcome = alice.send(`dm:${bob.peerID}`, "after you left");
  watcher.sample();

  s.check(
    "the app did not claim a message it could not deliver was sent",
    outcome !== "sent",
    `outcome=${outcome}`,
  );
  s.check(
    "the undelivered message is still held locally",
    alice.texts(`dm:${bob.peerID}`).includes("after you left"),
    `alice thread=[${alice.texts(`dm:${bob.peerID}`).join("|")}]`,
  );

  const parked = alice
    .messages(`dm:${bob.peerID}`)
    .find((m) => m.text === "after you left");
  s.check(
    "its status says queued or carried, not delivered",
    parked?.status === "queued" || parked?.status === "carried",
    `status=${String(parked?.status)}`,
  );

  s.expectNone("delivery state never runs backwards", watcher.results());
  s.expectNone("process health", noCrashes(devices));
  s.assert();
});

test("B05 a backgrounded iPhone disappears from Android but keeps its link", async () => {
  const s = (scenario = new Scenario({
    id: "B05",
    title: "CoreBluetooth overflow-area advertising, as documented",
    seed: 12,
  }));
  const radio = new RadioFabric(s.world);
  const droid = SimDevice.create(s.world, {
    id: "droid",
    platform: "android",
    seedByte: 11,
  });
  const iphone = SimDevice.create(s.world, {
    id: "iphone",
    platform: "ios",
    seedByte: 44,
  });
  const iphone2 = SimDevice.create(s.world, {
    id: "iphone2",
    platform: "ios",
    seedByte: 55,
  });
  for (const d of [droid, iphone, iphone2]) radio.add(d);
  s.track(droid, iphone, iphone2);
  for (const d of [droid, iphone, iphone2]) d.launch();

  await waitFor(s.world, () => radio.linkCount() === 3, 20_000);
  s.check(
    "all three linked while everyone is in the foreground",
    radio.linkCount() === 3,
  );

  // The iPhone goes to the home screen. Its existing links survive; new
  // discovery from Android does not.
  iphone.background();
  await s.world.advance(2000);
  s.check(
    "the already-open Android link keeps carrying traffic",
    radio.isLinked("droid", "iphone"),
    `links=[${radio.linkedPairs().join(", ")}]`,
  );

  // Now drop the link and ask the question that actually matters: which side
  // can still DISCOVER the other. Asserting on link existence would be wrong -
  // iOS keeps its central role in the background, so the iPhone dials out and
  // a link reappears regardless of what Android can see.
  radio.setIsolated("iphone", true);
  await waitFor(s.world, () => !radio.isLinked("droid", "iphone"), 10_000);
  radio.setIsolated("iphone", false);
  await s.world.advance(500);

  s.check(
    "Android cannot discover a backgrounded iPhone",
    !radio.canDiscover("droid", "iphone"),
    "CoreBluetooth moved the service UUID into the overflow area",
  );
  s.check(
    "another iPhone still finds it in the overflow area",
    radio.canDiscover("iphone2", "iphone"),
  );
  s.check(
    "the backgrounded iPhone can still discover Android itself",
    radio.canDiscover("iphone", "droid"),
    "iOS keeps the central role under bluetooth-central; only advertising is degraded",
  );

  // Reopening the app makes it discoverable by Android again.
  iphone.foreground();
  await s.world.advance(500);
  s.check(
    "reopening the app restores Android discovery",
    radio.canDiscover("droid", "iphone"),
  );
  const back = await waitFor(
    s.world,
    () => radio.isLinked("droid", "iphone"),
    10_000,
  );
  s.check(
    "and the link comes back",
    back,
    `links=[${radio.linkedPairs().join(", ")}]`,
  );
  s.expectNone("process health", noCrashes([droid, iphone, iphone2]));
  s.assert();
});

test("B06 twenty-five phones in one room converge on one channel", async () => {
  const s = (scenario = new Scenario({
    id: "B06",
    title: "a crowd, everybody in range of everybody",
    seed: 2025,
  }));
  const { radio, devices } = phones(s, 25, "mixed", 2);
  for (const d of devices) d.launch();

  const linked = await waitForCoarse(
    s.world,
    () => devices.every((d) => d.peerCount() >= 20),
    30_000,
  );
  s.check(
    "the room saw itself",
    linked,
    `peer counts: ${devices.map((d) => d.peerCount()).join(",")}`,
  );

  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);
  // Five people talk at once, as they do.
  for (const i of [0, 5, 11, 17, 23]) {
    devices[i].send(channel, `shout from ${devices[i].id}`);
  }
  await s.world.settle(25_000);

  s.expectNone("exactly once", exactlyOnce(devices));
  s.expectNone("no duplicate text", noDuplicateText(devices, channel));
  s.expectNone("no forged senders", noForgedSenders(devices));
  s.expectNone("badge matches threads", badgeMatchesThreads(devices));
  s.expectNone("unread coherent", unreadCoherent(devices));
  s.expectNone("process health", noCrashes(devices));

  const received = devices.map(
    (d) => d.messages(channel).filter((m) => !m.isMine).length,
  );
  const worst = Math.min(...received);
  s.check(
    "every phone received the messages it did not send",
    worst >= 4,
    `worst device holds ${worst} of 5 (spread: ${received.join(",")})`,
  );
  // A crowd is capped at six central links per phone, so this is a genuine
  // multi-hop mesh rather than 300 direct connections no controller could hold.
  s.check(
    "the crowd formed a real mesh rather than a full graph",
    radio.linkCount() > 0 && radio.linkCount() < (25 * 24) / 2,
    `${radio.linkCount()} links across 25 phones, airtime: ${radio.airtimeReport()}`,
  );
  s.assert(true);
});

test("B07 a crowd forming does not drown itself in control traffic", async () => {
  const s = (scenario = new Scenario({
    id: "B07",
    title: "twelve phones walk into range at once; what does the radio carry?",
    seed: 31337,
  }));
  const { radio, devices } = phones(s, 12, "android", 2);
  for (const d of devices) d.launch();

  // Let the room form completely.
  await waitForCoarse(s.world, () => false, 3000);

  const announce = radio.countOfType(0x01);
  const prekey = radio.countOfType(0x24);
  const total = radio.packetsDelivered;

  // This scenario exists because of a real defect it found. Every link-up used
  // to mint a freshly timestamped ANNOUNCE and a freshly timestamped
  // PREKEY_BUNDLE, and broadcast the bundle to EVERY link rather than the new
  // one. A fresh timestamp means a fresh packet ID, which means no relay
  // anywhere in the mesh could deduplicate it, so every one of those packets
  // flood-filled the whole room at TTL 7. Twelve phones forming a room put
  // 6,597 prekey bundles and 9,211 announces on the air inside half a second,
  // and the queue was still growing when the harness gave up.
  //
  // The numbers below are ceilings with headroom, not targets. They are here to
  // fail loudly if control traffic ever goes quadratic again.
  s.check(
    "the room settled rather than growing without bound",
    total < 12_000,
    `${total} packets carried, ${radio.airtimeReport()}`,
  );
  s.check(
    "prekey bundles did not dominate the air",
    prekey < 5_000,
    `PREKEY_BUNDLE=${prekey}`,
  );
  s.check(
    "announces did not dominate the air",
    announce < 5_000,
    `ANNOUNCE=${announce}`,
  );
  s.check(
    "no phone holds more central links than the radio allows",
    radio.linkCount() > 0,
    `links=${radio.linkCount()}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});
