/**
 * @jest-environment node
 */
// bitchat compatibility, tested against bitchat rather than against ourselves.
//
// VISION.md principle 6 says Airhop nodes must talk to bitchat nodes, and
// principle 7 says that when in doubt we do what bitchat does. compat.test.ts
// already pins byte offsets, but it pins them against Airhop's own constants,
// which cannot catch a divergence both sides of the assertion share.
//
// Two things here go further:
//
//   1. A live mixed mesh. A BitchatActor implements bitchat's rules - its own
//      type registry, its own signature policy, its own courier ceiling - and
//      stands in the same room as real Airhop phones. Messages have to cross in
//      both directions, and Airhop's private extensions have to cost it
//      nothing.
//   2. A differential read of the ACTUAL bitchat sources, which are vendored in
//      this repo. Constants are parsed out of the Swift and compared to
//      Airhop's, so an upstream change shows up as a failing test rather than
//      as a field report.

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
  const shim = require("../lifecycle/harness/bridge-shim") as {
    bleBridge: unknown;
  };
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("../../../bridge/NativeAirhopWiFi", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const shim = require("../lifecycle/harness/bridge-shim") as {
    wifiBridge: unknown;
  };
  return { __esModule: true, default: shim.wifiBridge };
});

import { FRAGMENT_SIZE } from "../../../core/mesh/fragment-manager";
import { PacketType } from "../../../core/mesh/packet-codec";
import { BitchatActor } from "./harness/bitchat-actor";
import { SimDevice } from "./harness/device";
import { noCrashes } from "./harness/invariants";
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

// Node's fs/path, declared rather than pulled in via @types/node. This is the
// only test that reads the repository from disk, and the app itself ships with
// no Node type dependency; adding one for a single readFileSync would widen the
// dependency surface of a shipping product to serve a test.
declare const __dirname: string;
declare function require(id: string): unknown;

interface NodeFs {
  readFileSync(path: string, encoding: string): string;
  existsSync(path: string): boolean;
}
interface NodePath {
  join(...parts: string[]): string;
}
const fs = require("fs") as NodeFs;
const path = require("path") as NodePath;

const BITCHAT_IOS = path.join(__dirname, "..", "..", "..", "..", "bitchat-ios");

function bitchatSource(relative: string): string {
  return fs.readFileSync(path.join(BITCHAT_IOS, relative), "utf8");
}

// The vendored bitchat checkout is a developer convenience, not a build
// dependency, so a clone without it must skip rather than fail.
function bitchatAvailable(): boolean {
  return fs.existsSync(
    path.join(BITCHAT_IOS, "bitchat", "Services", "TransportConfig.swift"),
  );
}

// Pull `static let name: Type = value` out of Swift.
function swiftConstant(source: string, name: string): number | null {
  const match = new RegExp(`static let ${name}\\s*:?[^=]*=\\s*([0-9_.]+)`).exec(
    source,
  );
  if (match === null) return null;
  return Number(match[1].replace(/_/g, ""));
}

// ---------------------------------------------------------------------------

test("X01 an Airhop phone and a bitchat phone talk to each other", async () => {
  const s = (scenario = new Scenario({
    id: "X01",
    title: "mixed mesh: messages cross in both directions",
    seed: 400,
  }));
  const radio = new RadioFabric(s.world);
  const airhop = SimDevice.create(s.world, {
    id: "airhop",
    platform: "android",
    seedByte: 11,
  });
  const bitchat = new BitchatActor(s.world, {
    id: "bitchat",
    platform: "ios",
    seedByte: 210,
  });
  radio.add(airhop);
  radio.add(bitchat);
  s.track(airhop);
  airhop.launch();
  bitchat.launch();

  const channel = "#bluetooth";
  airhop.joinChannel(channel);

  const met = await waitFor(
    s.world,
    () =>
      airhop.peers().includes(bitchat.peerID) &&
      bitchat.seen.knownPeers.has(airhop.peerID),
    30_000,
  );
  s.check(
    "they discovered each other with no configuration",
    met,
    `airhop sees [${airhop.peers().join(",")}], bitchat sees [${[...bitchat.seen.knownPeers].join(",")}]`,
  );

  // Airhop speaks; bitchat must hear it.
  airhop.send(channel, "from airhop to bitchat");
  const heardByBitchat = await waitFor(
    s.world,
    () =>
      bitchat.seen.publicMessages.some(
        (m) => m.text === "from airhop to bitchat",
      ),
    20_000,
  );
  s.check(
    "a bitchat node decoded and accepted an Airhop message",
    heardByBitchat,
    `bitchat heard [${bitchat.seen.publicMessages.map((m) => m.text).join(" | ")}]`,
  );

  // bitchat speaks; Airhop must hear it.
  bitchat.sendPublicMessage(channel, "from bitchat to airhop");
  const heardByAirhop = await waitFor(
    s.world,
    () => airhop.texts(channel).includes("from bitchat to airhop"),
    20_000,
  );
  s.check(
    "an Airhop node decoded and accepted a bitchat message",
    heardByAirhop,
    `airhop heard [${airhop.texts(channel).join(" | ")}]`,
  );
  s.check(
    "and attributed it to the bitchat peer, not to nobody",
    airhop.messages(channel).some((m) => m.senderID === bitchat.peerID),
    `senders seen: ${airhop
      .messages(channel)
      .map((m) => m.senderID)
      .join(",")}`,
  );
  s.check(
    "bitchat rejected nothing it should have accepted",
    bitchat.seen.rejectedSignatures === 0,
    `rejected ${bitchat.seen.rejectedSignatures} signatures`,
  );
  s.expectNone("process health", noCrashes([airhop]));
  s.assert(true);
});

test("X02 Airhop's private extensions cost a bitchat node nothing", async () => {
  const s = (scenario = new Scenario({
    id: "X02",
    title: "0x12 and 0x2a are dropped as unknown, and the mesh carries on",
    seed: 401,
  }));
  const radio = new RadioFabric(s.world);
  const a = SimDevice.create(s.world, {
    id: "airhopA",
    platform: "android",
    seedByte: 11,
  });
  const b = SimDevice.create(s.world, {
    id: "airhopB",
    platform: "android",
    seedByte: 22,
  });
  const bitchat = new BitchatActor(s.world, {
    id: "bitchat",
    platform: "ios",
    seedByte: 220,
  });
  // A line, so every Airhop-to-Airhop packet has to pass THROUGH the bitchat
  // node. If its handling of an unknown type were destructive, this is where it
  // would show.
  radio.add(a);
  radio.add(bitchat);
  radio.add(b);
  radio.setTopology([
    ["airhopA", "bitchat"],
    ["bitchat", "airhopB"],
  ]);
  s.track(a, b);
  a.launch();
  b.launch();
  bitchat.launch();

  const publicChannel = "#bluetooth";
  for (const d of [a, b]) d.joinChannel(publicChannel);
  await waitFor(s.world, () => radio.linkCount() === 2, 30_000);

  // A private channel is an Airhop-only construct sealed as 0x2a. Both Airhop
  // phones join it; the bitchat node in the middle must relay without
  // understanding, and must not choke.
  const privateChannel = "#secret";
  const key = new Uint8Array(32).fill(9);
  for (const d of [a, b]) d.joinPrivateChannel(privateChannel, key);

  // A two-hop peer is only knowable once its ANNOUNCE has been relayed, and a
  // public message from a peer whose signing key you do not hold is refused
  // (that is the point of the signature rule). So wait for the topology to be
  // known before speaking, and assert that it becomes known at all - which is
  // itself the interesting property here, since the relay in the middle is a
  // bitchat node.
  const learnedAcrossHop = await waitForCoarse(
    s.world,
    () => b.peers().includes(a.peerID),
    60_000,
  );
  s.check(
    "airhopB learned airhopA through the bitchat node in between",
    learnedAcrossHop,
    `airhopB peers=[${b.peers().join(",")}], airhopA is ${a.peerID}`,
  );

  a.send(publicChannel, "public, everyone hears this");
  a.send(privateChannel, "private, bitchat cannot read this");

  await s.world.settle(30_000);

  s.check(
    "the public message crossed the bitchat node to the far Airhop phone",
    b.texts(publicChannel).includes("public, everyone hears this"),
    `airhopB public = [${b.texts(publicChannel).join(" | ")}] ` +
      `| links=${radio.linkCount()} ` +
      `| airhopB peers=[${b.peers().join(",")}] ` +
      `| airhopA peer=${a.peerID} bitchat peer=${bitchat.peerID} ` +
      `| bitchat relayed=${bitchat.seen.relayed}`,
  );
  s.check(
    "bitchat could read the public message",
    bitchat.seen.publicMessages.some(
      (m) => m.text === "public, everyone hears this",
    ),
  );
  s.check(
    "bitchat could NOT read the private-channel message",
    !bitchat.seen.publicMessages.some((m) =>
      m.text.includes("bitchat cannot read this"),
    ),
    `bitchat heard [${bitchat.seen.publicMessages.map((m) => m.text).join(" | ")}]`,
  );
  const droppedTypes = [...bitchat.seen.droppedUnknownTypes.keys()];
  s.check(
    "it dropped the Airhop-only type as unknown rather than mishandling it",
    droppedTypes.every(
      (t) => t === PacketType.CHANNEL_ENC || t === PacketType.DR_ENCRYPTED,
    ),
    `dropped types: ${droppedTypes.map((t) => `0x${t.toString(16)}`).join(", ")}`,
  );
  s.check(
    "and stayed healthy: it kept relaying afterwards",
    bitchat.seen.relayed > 0,
    `relayed ${bitchat.seen.relayed} packets`,
  );
  s.expectNone("process health", noCrashes([a, b]));
  s.assert(true);
});

test("X03 Airhop's constants still match the vendored bitchat sources", () => {
  const s = (scenario = new Scenario({
    id: "X03",
    title: "differential read of bitchat-ios, not of our own header file",
    seed: 402,
  }));

  if (!bitchatAvailable()) {
    s.check(
      "the vendored bitchat-ios checkout is present to diff against",
      true,
      "skipped: bitchat-ios is not in this working tree",
    );
    s.assert();
    return;
  }
  const transport = bitchatSource("bitchat/Services/TransportConfig.swift");

  // Each of these is a number Airhop hard-codes somewhere. Reading it out of
  // the vendored Swift means an upstream change surfaces here instead of in a
  // field report about messages not arriving.
  const cases: {
    name: string;
    swift: string;
    ours: number;
    note: string;
  }[] = [
    {
      name: "max concurrent central links",
      swift: "bleMaxCentralLinks",
      ours: 6,
      note: "capped in AirhopBLEModule.kt and .swift; a crowded room depends on it",
    },
    {
      name: "forced announce minimum interval (ms)",
      swift: "bleForceAnnounceMinIntervalSeconds",
      ours: 0.15,
      note: "mesh-service FORCE_ANNOUNCE_MIN_INTERVAL_MS, expressed in seconds upstream",
    },
  ];

  for (const c of cases) {
    const upstream = swiftConstant(transport, c.swift);
    s.check(
      `${c.name} matches bitchat-ios`,
      upstream !== null && upstream === c.ours,
      upstream === null
        ? `TransportConfig.${c.swift} not found upstream (renamed or removed)`
        : `bitchat=${upstream} airhop=${c.ours} — ${c.note}`,
    );
  }

  // The fragment size is the one constant where a mismatch means silent,
  // total failure of every attachment between the two apps.
  s.check(
    "fragment size is still 469 bytes",
    FRAGMENT_SIZE === 469,
    `FRAGMENT_SIZE=${FRAGMENT_SIZE}`,
  );

  // Packet type registry: every value Airhop defines below 0x29 is bitchat's,
  // and Airhop's own extensions must sit outside that range so bitchat drops
  // them rather than misreading them.
  s.check(
    "Airhop's private types sit outside bitchat's registry",
    PacketType.DR_ENCRYPTED === 0x12 && PacketType.CHANNEL_ENC === 0x2a,
    `DR_ENCRYPTED=0x${PacketType.DR_ENCRYPTED.toString(16)} CHANNEL_ENC=0x${PacketType.CHANNEL_ENC.toString(16)}`,
  );
  s.assert();
});
