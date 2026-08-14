/**
 * @jest-environment node
 */
// Tier A: the app working, with nothing going wrong.
//
// These are the scenarios that must never be red. Every one of them is a thing
// a user does in the first five minutes: turn the app on, see somebody, say
// something, get a reply. Tiers B and C exist to break these; if a Tier A
// scenario fails, nothing below it is worth reading yet.

jest.mock("expo-location", () => ({}));
jest.mock("react-native/Libraries/EventEmitter/RCTDeviceEventEmitter", () =>
  // Every phone needs its own listener set. See harness/event-router.ts: this
  // is the only interception point that reliably catches every path by which
  // mesh-service and the native modules reach the emitter.
  (
    require("./harness/event-router") as { routerModule: () => unknown }
  ).routerModule(),
);
// EAGER factories. A lazy `get default()` resolves after jest.isolateModules has
// closed, which would hand every sandboxed phone the same native module. See
// harness/device.ts.
jest.mock("@bridge/NativeAirhopBLE", () => {
  const shim = require("../harness/bridge-shim");
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("@bridge/NativeAirhopWiFi", () => {
  const shim = require("../harness/bridge-shim");
  return { __esModule: true, default: shim.wifiBridge };
});

import { SimDevice, type DeviceSpec } from "./harness/device";
import {
  badgeMatchesThreads,
  convergence,
  exactlyOnce,
  noCrashes,
  noForgedSenders,
  senderKeptOwnCopy,
  StatusWatcher,
  unreadCoherent,
} from "./harness/invariants";
import { RadioFabric } from "./harness/radio-fabric";
import { Scenario, waitFor } from "./harness/scenario";

let scenario: Scenario | null = null;

afterEach(() => {
  scenario?.close();
  scenario = null;
  jest.clearAllTimers();
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

// Stand up n phones on one radio, all launched, all in range.
function room(
  s: Scenario,
  specs: DeviceSpec[],
): { radio: RadioFabric; devices: SimDevice[] } {
  const radio = new RadioFabric(s.world);
  const devices = specs.map((spec) => SimDevice.create(s.world, spec));
  for (const d of devices) radio.add(d);
  s.track(...devices);
  return { radio, devices };
}

const android = (id: string, seedByte: number): DeviceSpec => ({
  id,
  platform: "android",
  seedByte,
});

const ios = (id: string, seedByte: number): DeviceSpec => ({
  id,
  platform: "ios",
  seedByte,
});

test("A01 cold start on Android brings the mesh up and finds the room", async () => {
  const s = (scenario = new Scenario({
    id: "A01",
    title: "cold start, permissions already granted, two peers in range",
  }));
  const { radio, devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
  ]);
  const [alice, bob] = devices;

  alice.launch();
  bob.launch();
  const found = await waitFor(s.world, () => radio.linkCount() === 1);

  s.check("a BLE link came up on its own", found);
  s.check(
    "no blocker is reported once the radios are running",
    alice.meshState().bleBlocker === "none",
    `blocker=${String(alice.meshState().bleBlocker)}`,
  );
  s.check(
    "alice sees bob on the mesh",
    alice.peers().includes(bob.peerID),
    `alice peers=[${alice.peers().join(", ")}]`,
  );
  s.check(
    "bob sees alice on the mesh",
    bob.peers().includes(alice.peerID),
    `bob peers=[${bob.peers().join(", ")}]`,
  );
  s.check(
    "peer IDs derive differently from different keys",
    alice.peerID !== bob.peerID,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert();
});

test("A02 cold start on iOS does not claim Bluetooth is off on a healthy phone", async () => {
  const s = (scenario = new Scenario({
    id: "A02",
    title: "iOS CBManager reports unknown before poweredOn",
  }));
  const { devices } = room(s, [ios("iphone", 33)]);
  const [iphone] = devices;

  iphone.launch();
  // The window that used to produce a false banner: CoreBluetooth has not yet
  // delivered its first didUpdateState.
  await s.world.advance(20);
  const early = iphone.meshState().bleBlocker;
  s.check(
    "the pre-state window reads as starting, not adapter-off",
    early === "starting" || early === "none",
    `blocker at 20ms = ${String(early)}`,
  );

  await s.world.advance(3000);
  s.check(
    "settles to no blocker once CoreBluetooth reports poweredOn",
    iphone.meshState().bleBlocker === "none",
    `blocker=${String(iphone.meshState().bleBlocker)}`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert();
});

test("A03 a public channel message reaches everyone in the room, once", async () => {
  const s = (scenario = new Scenario({
    id: "A03",
    title: "three phones, one public channel, one message",
  }));
  const { devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
    ios("carol", 33),
  ]);
  const [alice, bob, carol] = devices;

  for (const d of devices) d.launch();
  await waitFor(s.world, () =>
    devices.every((d) => d.peerCount() === devices.length - 1),
  );

  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);
  alice.send(channel, "water station at the south gate");

  const delivered = await waitFor(
    s.world,
    () => bob.texts(channel).length > 0 && carol.texts(channel).length > 0,
  );

  s.check(
    "everyone in range received it",
    delivered,
    [
      `alice=[${alice.texts(channel).join("|")}]`,
      `bob=[${bob.texts(channel).join("|")}]`,
      `carol=[${carol.texts(channel).join("|")}]`,
    ].join("  "),
  );
  s.check(
    "the text survived the wire intact",
    bob.texts(channel)[0] === "water station at the south gate",
    `bob got "${String(bob.texts(channel)[0])}"`,
  );
  s.check(
    "the sender is attributed correctly",
    bob.messages(channel)[0]?.senderID === alice.peerID,
    `senderID=${String(bob.messages(channel)[0]?.senderID)}`,
  );

  s.expectNone("convergence", convergence(devices, channel));
  s.expectNone(
    "the sender kept its own copy",
    senderKeptOwnCopy(alice, channel, ["water station at the south gate"]),
  );
  s.expectNone("exactly once", exactlyOnce(devices));
  s.expectNone("no forged senders", noForgedSenders(devices));
  s.expectNone("process health", noCrashes(devices));
  s.assert();
});

test("A04 a private DM round trips with a delivery receipt", async () => {
  const s = (scenario = new Scenario({
    id: "A04",
    title: "Noise XX handshake, DM, receipt, read receipt",
  }));
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
  const [alice, bob] = devices;
  const watcher = new StatusWatcher(devices);

  for (const d of devices) d.launch();
  await waitFor(s.world, () => alice.peers().includes(bob.peerID));

  const outcome = alice.send(`dm:${bob.peerID}`, "meet me by the fountain");
  s.check(
    "the send was accepted by a transport",
    outcome === "sent" || outcome === "queued",
    `outcome=${outcome}`,
  );

  const arrived = await waitFor(s.world, () => {
    watcher.sample();
    return bob.texts(`dm:${alice.peerID}`).length > 0;
  });
  s.check(
    "the DM arrived",
    arrived,
    `bob dm thread = [${bob.texts(`dm:${alice.peerID}`).join("|")}]`,
  );

  // Bob opens the thread, which is what sends read receipts.
  bob.openThread(`dm:${alice.peerID}`);
  await waitFor(s.world, () => {
    watcher.sample();
    const mine = alice.messages(`dm:${bob.peerID}`)[0];
    return mine?.status === "delivered" || mine?.status === "read";
  });

  const sent = alice.messages(`dm:${bob.peerID}`)[0];
  s.check(
    "alice's copy reached at least 'delivered'",
    sent?.status === "delivered" || sent?.status === "read",
    `status=${String(sent?.status)}`,
  );
  s.check(
    "opening the thread cleared its unread count",
    bob.unread(`dm:${alice.peerID}`) === 0,
    `unread=${bob.unread(`dm:${alice.peerID}`)}`,
  );

  s.expectNone("delivery state never runs backwards", watcher.results());
  s.expectNone("exactly once", exactlyOnce(devices));
  s.expectNone(
    "unread coherent",
    unreadCoherent(devices, { bob: `dm:${alice.peerID}` }),
  );
  s.expectNone("badge matches threads", badgeMatchesThreads(devices));
  s.expectNone("process health", noCrashes(devices));
  s.assert();
});

test("A05 messages sent at the same instant all survive on every device", async () => {
  const s = (scenario = new Scenario({
    id: "A05",
    title: "three senders, one channel, one millisecond",
  }));
  const { devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
    android("carol", 33),
  ]);
  const [alice, bob, carol] = devices;

  for (const d of devices) d.launch();
  await waitFor(s.world, () =>
    devices.every((d) => d.peerCount() === devices.length - 1),
  );
  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);

  // No awaits between them: all three hit the radio on the same tick.
  alice.send(channel, "from alice");
  bob.send(channel, "from bob");
  carol.send(channel, "from carol");

  await waitFor(s.world, () =>
    devices.every((d) => d.messages(channel).length === 3),
  );

  for (const d of devices) {
    s.check(
      `${d.id} holds all three messages`,
      d.messages(channel).length === 3,
      `has [${d.texts(channel).join("|")}]`,
    );
  }
  s.expectNone("convergence", convergence(devices, channel));
  s.expectNone("exactly once", exactlyOnce(devices));
  s.expectNone("process health", noCrashes(devices));
  s.assert();
});

test("A06 the person who answered the handshake can speak first", async () => {
  const s = (scenario = new Scenario({
    id: "A06",
    title: "the Noise responder opens the thread and replies",
  }));
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
  const [alice, bob] = devices;
  const watcher = new StatusWatcher(devices);

  for (const d of devices) d.launch();
  await waitFor(s.world, () => alice.peers().includes(bob.peerID));

  // Alice speaks first, so ALICE is the Noise initiator and bob the responder.
  alice.send(`dm:${bob.peerID}`, "are you there?");
  const arrived = await waitFor(
    s.world,
    () => bob.texts(`dm:${alice.peerID}`).includes("are you there?"),
    20_000,
  );
  s.check("the opening DM arrived", arrived);

  // Opening the thread sends read receipts. The responder's Double Ratchet has
  // no sending chain until it has received a ratchet message, so this is the
  // exact moment the encrypt path used to throw - inside a UI handler, with
  // nothing able to catch it.
  let openThrew: string | null = null;
  try {
    bob.openThread(`dm:${alice.peerID}`);
  } catch (e) {
    openThrew = String(e);
  }
  s.check(
    "opening the thread did not throw",
    openThrew === null,
    openThrew ?? "",
  );

  // And replying must work, over whichever transport is currently usable.
  let replyThrew: string | null = null;
  let replyStatus = "";
  try {
    replyStatus = bob.send(`dm:${alice.peerID}`, "yes, right here");
  } catch (e) {
    replyThrew = String(e);
  }
  s.check("replying did not throw", replyThrew === null, replyThrew ?? "");
  s.check(
    "the reply was accepted by a transport",
    replyStatus === "sent" || replyStatus === "queued",
    `status=${replyStatus}`,
  );

  const replyLanded = await waitFor(
    s.world,
    () => {
      watcher.sample();
      return alice.texts(`dm:${bob.peerID}`).includes("yes, right here");
    },
    20_000,
  );
  s.check(
    "and the reply reached alice",
    replyLanded,
    `alice thread=[${alice.texts(`dm:${bob.peerID}`).join(" | ")}]`,
  );

  s.expectNone("delivery state never runs backwards", watcher.results());
  s.expectNone("exactly once", exactlyOnce(devices));
  s.expectNone("process health", noCrashes(devices));
  s.assert();
});
