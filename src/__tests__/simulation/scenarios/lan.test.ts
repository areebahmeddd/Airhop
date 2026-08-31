/**
 * @jest-environment node
 */
// The LAN transport, end to end through the real mesh engine.
//
// What makes this worth simulating rather than unit testing: mDNS reveals every
// device on a network at once, which is a shape Bluetooth cannot produce and
// therefore a shape nothing else in this suite exercises. The cap that keeps it
// survivable is a pure function with its own tests; these scenarios check that
// the cap is actually reached through the controller, the registry, the router
// and the radios, with no help.
//
// The properties that matter:
//
//   * Nothing is published until the user asks. This is the only transport
//     where consent is a precondition, because an mDNS record tells everyone on
//     the network, and whoever runs it, that this phone is carrying Airhop.
//   * A message crosses between an iPhone and an Android phone. Neither
//     Bluetooth range nor WiFi Aware is available here, so if it arrives, it
//     arrived over LAN. This is the gap the transport exists to fill.
//   * A crowded network does not become a full mesh. Thirty phones each hold
//     eight links, not twenty-nine.
//   * Client isolation looks like an empty network and not like a bug. Most
//     venue WiFi lets mDNS through and drops the TCP, and the app cannot tell
//     before trying.

jest.mock("expo-location", () => ({}));
jest.mock("react-native/Libraries/EventEmitter/RCTDeviceEventEmitter", () =>
  (
    require("../harness/event-router") as { routerModule: () => unknown }
  ).routerModule(),
);
jest.mock("@bridge/NativeAirhopBLE", () => {
  const shim = require("../../harness/bridge-shim");
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("@bridge/NativeAirhopLAN", () => {
  const shim = require("../../harness/bridge-shim");
  return { __esModule: true, default: shim.lanBridge };
});

import { SimDevice, type DeviceSpec } from "../harness/device";
import { noCrashes } from "../harness/invariants";
import { LanFabric } from "../harness/lan-fabric";
import { RadioFabric } from "../harness/radio-fabric";
import { Scenario, waitFor } from "../harness/scenario";

jest.setTimeout(120_000);

let scenario: Scenario | null = null;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  scenario?.close();
  scenario = null;
  jest.useRealTimers();
});

function phone(
  id: string,
  seedByte: number,
  platform: "android" | "ios" = "android",
  lanEnabled = true,
): DeviceSpec {
  return { id, platform, seedByte, lanEnabled };
}

// Every phone in the room, on one network, with no Bluetooth between any of
// them. Anything that arrives, arrived over LAN.
function room(
  s: Scenario,
  specs: readonly DeviceSpec[],
): { radio: RadioFabric; lan: LanFabric; devices: SimDevice[] } {
  const radio = new RadioFabric(s.world);
  const lan = new LanFabric(s.world);
  const devices = specs.map((spec) => SimDevice.create(s.world, spec));
  for (const d of devices) {
    radio.add(d);
    lan.add(d);
  }
  radio.setTopology([]);
  return { radio, lan, devices };
}

test("L01 nothing is published until the user turns the transport on", async () => {
  const s = (scenario = new Scenario({
    id: "L01",
    title: "consent is a precondition, not a preference",
    seed: 700,
  }));
  const { lan, devices } = room(s, [
    phone("a", 11, "android", false),
    phone("b", 22, "android", false),
  ]);
  const [a, b] = devices;
  s.track(a, b);
  lan.join("a", "office");
  lan.join("b", "office");
  a.launch();
  b.launch();

  await s.world.advance(20_000);

  s.check(
    "neither phone dialled anything",
    lan.dialsAttempted === 0,
    `dials=${lan.dialsAttempted}`,
  );
  s.check("no LAN link exists", lan.linkCount() === 0);
  s.check(
    "and they never found each other",
    !a.peers().includes(b.peerID),
    `a sees ${a.peers().length} peers`,
  );

  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("L02 an iPhone and an Android phone meet over the network", async () => {
  const s = (scenario = new Scenario({
    id: "L02",
    title: "the gap WiFi Aware cannot fill",
    seed: 701,
  }));
  const { lan, devices } = room(s, [
    phone("a", 11, "android"),
    phone("b", 22, "ios"),
  ]);
  const [a, b] = devices;
  s.track(a, b);
  lan.join("a", "hotspot");
  lan.join("b", "hotspot");
  a.launch();
  b.launch();

  s.check(
    "no Bluetooth link exists between them",
    a.bleLinkCount() === 0 && b.bleLinkCount() === 0,
  );

  const met = await waitFor(
    s.world,
    () => a.peers().includes(b.peerID) && b.peers().includes(a.peerID),
    40_000,
  );
  s.check(
    "they discovered each other across platforms",
    met,
    `a=[${a.peers().join(",")}] b=[${b.peers().join(",")}]`,
  );

  const channel = "#bluetooth";
  a.joinChannel(channel);
  b.joinChannel(channel);
  a.send(channel, "the bridge is out");

  const heard = await waitFor(
    s.world,
    () => b.texts(channel).includes("the bridge is out"),
    30_000,
  );
  s.check(
    "and the message crossed",
    heard,
    `b=[${b.texts(channel).join("|")}]`,
  );
  // The proof it went over LAN and not some path the harness left open: the
  // fabric counted the bytes itself.
  s.check(
    "over the LAN fabric, which carried every byte",
    lan.framesCarried > 0 && lan.linkCount() === 1,
    `frames=${lan.framesCarried} links=${lan.linkCount()}`,
  );

  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("L03 a crowded network does not become a full mesh", async () => {
  const s = (scenario = new Scenario({
    id: "L03",
    title: "the cap holds through the whole stack",
    seed: 702,
  }));
  // Twelve phones is past the eight-link cap while staying inside the time a
  // scenario should take. Uncapped this is 66 links; capped it is 48.
  const specs = Array.from({ length: 12 }, (_, i) =>
    phone(`p${String(i)}`, 10 + i),
  );
  const { lan, devices } = room(s, specs);
  s.track(...devices);
  for (const spec of specs) lan.join(spec.id, "conference");
  for (const d of devices) d.launch();

  await s.world.advance(30_000);

  const counts = devices.map((d) => lan.linkCountFor(d.id));
  const worst = Math.max(...counts);
  s.check(
    "no phone holds more than the cap",
    worst <= 8,
    `most links on one phone = ${worst} (all: ${counts.join(",")})`,
  );
  s.check(
    "and it is not a full mesh",
    lan.linkCount() < (specs.length * (specs.length - 1)) / 2,
    `links=${lan.linkCount()} of a possible ${(specs.length * (specs.length - 1)) / 2}`,
  );
  // Exactly the cap, not merely under it: the ring gives every phone eight
  // neighbours at this size, so a cap that silently collapsed to one or two
  // would still pass a "no more than eight" check.
  s.check(
    "every phone holds exactly the cap",
    counts.every((c) => c === 8),
    `counts=${counts.join(",")}`,
  );
  s.check(
    "which is the ring's total, counted once per pair",
    lan.linkCount() === (specs.length * 8) / 2,
    `links=${lan.linkCount()} expected ${(specs.length * 8) / 2}`,
  );

  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("L03b a message relays across the LAN ring with no Bluetooth anywhere", async () => {
  const s = (scenario = new Scenario({
    id: "L03b",
    title: "multi-hop over LAN alone",
    seed: 705,
  }));
  // Twelve phones is past the eight-link cap, so the ring is not a full mesh
  // and at least one pair is two hops apart. With no Bluetooth between anyone,
  // anything that arrives was relayed by a LAN peer.
  const specs = Array.from({ length: 12 }, (_, i) =>
    phone(`p${String(i)}`, 40 + i),
  );
  const { lan, devices } = room(s, specs);
  s.track(...devices);
  for (const spec of specs) lan.join(spec.id, "conference");
  for (const d of devices) d.launch();
  await s.world.advance(30_000);

  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);

  // The ring wraps, so the first and last phones are neighbours. Pick a peer
  // the ring genuinely leaves two hops away rather than assuming one.
  const [first] = devices;
  const last = devices.find(
    (d) => d !== first && !lan.isLinked(first.id, d.id),
  );
  s.check(
    "the ring leaves someone more than one hop away",
    last !== undefined,
    `${first.id} is linked to ${String(lan.linkCountFor(first.id))} of ${String(devices.length - 1)}`,
  );
  if (last === undefined) {
    s.assert(true);
    return;
  }

  first.send(channel, "relayed across the ring");
  const heard = await waitFor(
    s.world,
    () => last.texts(channel).includes("relayed across the ring"),
    40_000,
  );
  s.check(
    "and the far end heard it anyway",
    heard,
    `${last.id} = [${last.texts(channel).join("|")}]`,
  );
  s.check(
    "with no Bluetooth link anywhere in the room",
    devices.every((d) => d.bleLinkCount() === 0),
  );

  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("L04 client isolation looks like an empty network, not a broken app", async () => {
  const s = (scenario = new Scenario({
    id: "L04",
    title: "discovery crosses, the connection does not",
    seed: 703,
  }));
  const { lan, devices } = room(s, [
    phone("a", 11, "android"),
    phone("b", 22, "android"),
  ]);
  const [a, b] = devices;
  s.track(a, b);
  lan.setClientIsolation("guest", true);
  lan.join("a", "guest");
  lan.join("b", "guest");
  a.launch();
  b.launch();

  await s.world.advance(30_000);

  s.check(
    "both phones tried to connect",
    lan.dialsAttempted > 0,
    `dials=${lan.dialsAttempted}`,
  );
  s.check(
    "every attempt was dropped by the access point",
    lan.dialsRefused === lan.dialsAttempted && lan.linkCount() === 0,
    `refused=${lan.dialsRefused} of ${lan.dialsAttempted}, links=${lan.linkCount()}`,
  );
  s.check(
    "so neither phone believes it has a peer",
    !a.peers().includes(b.peerID) && !b.peers().includes(a.peerID),
  );

  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("L05 leaving the network takes the links with it", async () => {
  const s = (scenario = new Scenario({
    id: "L05",
    title: "a phone that walks out does not linger as reachable",
    seed: 704,
  }));
  const { lan, devices } = room(s, [
    phone("a", 11, "android"),
    phone("b", 22, "android"),
  ]);
  const [a, b] = devices;
  s.track(a, b);
  lan.join("a", "cafe");
  lan.join("b", "cafe");
  a.launch();
  b.launch();

  const met = await waitFor(
    s.world,
    () => a.peers().includes(b.peerID),
    40_000,
  );
  s.check("they met first", met);

  lan.leave("b");
  await s.world.advance(5_000);

  s.check(
    "the link is gone on both sides",
    lan.linkCount() === 0,
    `links=${lan.linkCount()}`,
  );

  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});
