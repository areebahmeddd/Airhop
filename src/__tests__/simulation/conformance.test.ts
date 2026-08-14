/**
 * @jest-environment node
 */
// bitchat compatibility, tested against bitchat rather than against ourselves.
//
// VISION.md principle 6 says Airhop nodes must talk to bitchat nodes, and
// principle 7 says that when in doubt we do what bitchat does. packet-frame-vectors.test.ts
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
  (
    require("./harness/event-router") as { routerModule: () => unknown }
  ).routerModule(),
);
jest.mock("@bridge/NativeAirhopBLE", () => {
  const shim = require("../harness/bridge-shim") as {
    bleBridge: unknown;
  };
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("@bridge/NativeAirhopWiFi", () => {
  const shim = require("../harness/bridge-shim") as {
    wifiBridge: unknown;
  };
  return { __esModule: true, default: shim.wifiBridge };
});

import { MAX_BLE_FRAME } from "@core/mesh/routing/fragment-manager";
import {
  MAX_BITCHAT_TRANSFER_BYTES,
  MAX_FILE_BYTES,
  MAX_FRAMED_FILE_BYTES,
  MAX_IMAGE_BYTES,
  MAX_SENT_IMAGE_BYTES,
  MAX_VOICE_BYTES,
} from "@core/mesh/wire/file-packet";
import { PacketType } from "@core/mesh/wire/packet-codec";
import {
  CELL_PRECISION as BRIDGE_CELL_PRECISION,
  DOWNLINK_EVENTS_PER_MINUTE as BRIDGE_DOWNLINK_PER_MINUTE,
  ID_SET_CAP as BRIDGE_ID_SET_CAP,
  MAX_EVENT_AGE_SECONDS as BRIDGE_MAX_EVENT_AGE_SECONDS,
  PARTICIPANT_TTL_MS as BRIDGE_PARTICIPANT_TTL_MS,
  UPLINK_EVENTS_PER_MINUTE_PER_DEPOSITOR as BRIDGE_UPLINK_PER_DEPOSITOR,
} from "@services/bridge-service";
import {
  DOWNLINK_EVENTS_PER_MINUTE as GATEWAY_DOWNLINK_PER_MINUTE,
  CARRIER_MAX_EVENT_AGE_SECONDS as GATEWAY_MAX_EVENT_AGE_SECONDS,
  MAX_QUEUED_UPLINKS as GATEWAY_MAX_QUEUED,
  MAX_QUEUED_UPLINKS_PER_DEPOSITOR as GATEWAY_MAX_QUEUED_PER_DEPOSITOR,
  UPLINK_EVENTS_PER_MINUTE_PER_DEPOSITOR as GATEWAY_UPLINK_PER_DEPOSITOR,
} from "@services/mesh-service";
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

// The vendored checkout lives at <repo>/bitchat/ios. This read `bitchat-ios`
// for a while, which no longer exists, so `bitchatAvailable()` was always false
// and every differential check below took the skip branch and asserted true. A
// green test that cannot fail is worse than no test, because it is counted.
const BITCHAT_IOS = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "bitchat",
  "ios",
);

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

// Pull a `static let name: Type = <arithmetic>` out of Swift, evaluating simple
// products like `512 * 1024`. FileTransferLimits states its ceilings that way
// rather than as literals.
function swiftConstantExpr(source: string, name: string): number | null {
  const match = new RegExp(
    `static let ${name}\\s*:?[^=]*=\\s*([0-9_ *]+)`,
  ).exec(source);
  if (match === null) return null;
  const parts = match[1]
    .split("*")
    .map((p) => Number(p.replace(/_/g, "").trim()));
  if (parts.some((n) => !Number.isFinite(n))) return null;
  return parts.reduce((a, b) => a * b, 1);
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
    title: "Airhop-only types reach no handler, and the mesh carries on",
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

  // A private channel is an Airhop-only construct sealed as 0x50. Both Airhop
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

  // A named Airhop channel. Both Airhop phones join it; the bitchat node has no
  // such room and no field on the wire to name one, so it must not see it.
  const namedChannel = "#neighborhood";
  for (const d of [a, b]) d.joinChannel(namedChannel);

  a.send(publicChannel, "public, everyone hears this");
  a.send(privateChannel, "private, bitchat cannot read this");
  a.send(namedChannel, "neighborhood, not bitchat's room");

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
  // The message must reach the far Airhop phone THROUGH the bitchat relay while
  // staying invisible to the relay's own user.
  s.check(
    "the named channel crossed the bitchat node to the far Airhop phone",
    b.texts(namedChannel).includes("neighborhood, not bitchat's room"),
    `airhopB ${namedChannel} = [${b.texts(namedChannel).join(" | ")}]`,
  );
  s.check(
    "bitchat did NOT see the named channel in its public room",
    !bitchat.seen.publicMessages.some((m) =>
      m.text.includes("not bitchat's room"),
    ),
    `bitchat heard [${bitchat.seen.publicMessages.map((m) => m.text).join(" | ")}]`,
  );
  // Nor as mojibake: bitchat-android decodes public payloads leniently and
  // substitutes U+FFFD, so a framed payload under 0x02 would show as a junk
  // line. Under its own type there is nothing to decode.
  s.check(
    "and did not render it as replacement characters either",
    !bitchat.seen.publicMessages.some((m) => m.text.includes("�")),
    `bitchat heard [${bitchat.seen.publicMessages.map((m) => m.text).join(" | ")}]`,
  );
  const droppedTypes = [...bitchat.seen.droppedUnknownTypes.keys()];
  s.check(
    "it dropped every Airhop-only type as unknown rather than mishandling it",
    droppedTypes.every(
      (t) =>
        t === PacketType.CHANNEL_ENC ||
        t === PacketType.DR_ENCRYPTED ||
        t === PacketType.CHANNEL_MSG_AIRHOP,
    ),
    `dropped types: ${droppedTypes.map((t) => `0x${t.toString(16)}`).join(", ")}`,
  );
  s.check(
    "including the named-channel type, which it saw and refused",
    droppedTypes.includes(PacketType.CHANNEL_MSG_AIRHOP),
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

  // Attachment ceilings, read out of BitFoundation rather than TransportConfig.
  // Every one of these is a silent failure if it drifts: bitchat refuses an
  // oversized payload in its decoder, so the sender pages out the whole file,
  // marks the bubble sent, and is never told it was dropped.
  const limits = bitchatSource(
    "localPackages/BitFoundation/Sources/BitFoundation/FileTransferLimits.swift",
  );
  const limitCases: { name: string; swift: string; ours: number }[] = [
    { name: "max payload", swift: "maxPayloadBytes", ours: MAX_FILE_BYTES },
    {
      name: "max voice note",
      swift: "maxVoiceNoteBytes",
      ours: MAX_VOICE_BYTES,
    },
    { name: "max image", swift: "maxImageBytes", ours: MAX_IMAGE_BYTES },
  ];
  for (const c of limitCases) {
    const upstream = swiftConstantExpr(limits, c.swift);
    s.check(
      `${c.name} matches bitchat-ios`,
      upstream !== null && upstream === c.ours,
      upstream === null
        ? `FileTransferLimits.${c.swift} not found upstream`
        : `bitchat=${upstream} airhop=${c.ours}`,
    );
  }

  // Airhop sends photos well under the image ceiling because bitchat expires a
  // half-built file this many seconds after its FIRST fragment, not its last.
  // If upstream ever refreshes that stamp or lengthens the window, our send
  // budget is leaving usable headroom on the table and should be revisited.
  const fragmentLifetime = swiftConstant(
    transport,
    "bleFragmentLifetimeSeconds",
  );
  s.check(
    "bitchat's fragment assembly window is still 30s from the first fragment",
    fragmentLifetime === 30,
    `bitchat=${String(fragmentLifetime)}s drives MAX_SENT_IMAGE_BYTES=${String(MAX_SENT_IMAGE_BYTES / 1024)}KiB and the ${String(MAX_BITCHAT_TRANSFER_BYTES / 1024)}KiB warning`,
  );

  // Live voice replay window. Airhop drops a burst older than this before it
  // reaches a speaker, and the two have to agree or one side plays audio the
  // other considers stale.
  const pttMaxAge = swiftConstant(transport, "pttPublicFrameMaxAgeSeconds");
  s.check(
    "live voice freshness window matches bitchat-ios",
    pttMaxAge === 30,
    `bitchat=${String(pttMaxAge)}s airhop=30s`,
  );

  // Bridge and gateway quotas. These are airtime and abuse budgets shared
  // between two implementations of the same rendezvous: if bitchat tightens a
  // downlink budget and Airhop does not, an Airhop gateway floods a room that
  // bitchat gateways are politely rationing, and nothing in either app reports
  // it. Read from their two Limits enums rather than from our own header.
  const bridgeSwift = bitchatSource(
    "bitchat/Services/Gateway/BridgeService.swift",
  );
  const gatewaySwift = bitchatSource(
    "bitchat/Services/Gateway/GatewayService.swift",
  );

  const quotaCases: {
    name: string;
    source: string;
    swift: string;
    ours: number;
  }[] = [
    // Bridge
    {
      name: "bridge rendezvous cell precision",
      source: bridgeSwift,
      swift: "cellPrecision",
      ours: BRIDGE_CELL_PRECISION,
    },
    {
      name: "bridge downlink budget per minute",
      source: bridgeSwift,
      swift: "downlinkEventsPerMinute",
      ours: BRIDGE_DOWNLINK_PER_MINUTE,
    },
    {
      name: "bridge uplink budget per depositor per minute",
      source: bridgeSwift,
      swift: "uplinkEventsPerMinutePerDepositor",
      ours: BRIDGE_UPLINK_PER_DEPOSITOR,
    },
    {
      name: "bridge loop-cache capacity",
      source: bridgeSwift,
      swift: "maxTrackedEventIDs",
      ours: BRIDGE_ID_SET_CAP,
    },
    // Gateway
    {
      name: "gateway downlink budget per minute",
      source: gatewaySwift,
      swift: "downlinkEventsPerMinute",
      ours: GATEWAY_DOWNLINK_PER_MINUTE,
    },
    {
      name: "gateway uplink budget per depositor per minute",
      source: gatewaySwift,
      swift: "uplinkEventsPerMinutePerDepositor",
      ours: GATEWAY_UPLINK_PER_DEPOSITOR,
    },
    // The bag a gateway holds while its relays are down. Bounded twice, and
    // both bounds matter: the total stops a busy island exhausting memory, the
    // per-depositor share stops one peer crowding everyone else out of it.
    {
      name: "gateway queued uplinks, total",
      source: gatewaySwift,
      swift: "maxQueuedUplinks",
      ours: GATEWAY_MAX_QUEUED,
    },
    {
      name: "gateway queued uplinks, per depositor",
      source: gatewaySwift,
      swift: "maxQueuedUplinksPerDepositor",
      ours: GATEWAY_MAX_QUEUED_PER_DEPOSITOR,
    },
  ];
  for (const c of quotaCases) {
    const upstream = swiftConstantExpr(c.source, c.swift);
    s.check(
      `${c.name} matches bitchat-ios`,
      upstream !== null && upstream === c.ours,
      upstream === null
        ? `Limits.${c.swift} not found upstream`
        : `bitchat=${upstream} airhop=${c.ours}`,
    );
  }

  // Clock skew, stated in seconds upstream and shared by both carriers.
  for (const [name, source, ours] of [
    ["bridge", bridgeSwift, BRIDGE_MAX_EVENT_AGE_SECONDS],
    ["gateway", gatewaySwift, GATEWAY_MAX_EVENT_AGE_SECONDS],
  ] as const) {
    const upstream = swiftConstantExpr(source, "maxEventAgeSeconds");
    s.check(
      `${name} accepted clock skew matches bitchat-ios`,
      upstream !== null && upstream === ours,
      `bitchat=${String(upstream)}s airhop=${String(ours)}s`,
    );
  }

  // Participant freshness drives the "people across the bridge" count, so a
  // mismatch makes the two apps disagree about who is present in one room.
  const freshness = swiftConstantExpr(
    bridgeSwift,
    "participantFreshnessSeconds",
  );
  s.check(
    "bridge participant freshness matches bitchat-ios",
    freshness !== null && freshness * 1000 === BRIDGE_PARTICIPANT_TTL_MS,
    `bitchat=${String(freshness)}s airhop=${String(BRIDGE_PARTICIPANT_TTL_MS / 1000)}s`,
  );

  // The frame budget is the one constant where being wrong means silent, total
  // failure of every attachment between the two apps: an oversized frame is
  // truncated by the radio and the far side's decoder rejects it.
  s.check(
    "fragment frame budget is the 512-byte ATT ceiling",
    MAX_BLE_FRAME === 512,
    `MAX_BLE_FRAME=${MAX_BLE_FRAME}`,
  );

  // The file ceiling, read from bitchat-ios rather than copied.
  //
  // Three numbers, two of which agree. bitchat-ios refuses a packet whose
  // declared expanded size passes `maxFramedFileBytes` (~1.13 MiB); Android and
  // Airhop both bound decompression at 10 MiB. Airhop sits on both sides
  // deliberately: `MAX_PAYLOAD_BYTES` takes Android's number because bounding
  // the inflate as it runs is the safer design (#1634 argues the same upstream),
  // while `MAX_FRAMED_FILE_BYTES` uses the iOS formula verbatim because a file
  // is the only payload that approaches it.
  //
  // This guards the day someone raises `MAX_FILE_BYTES`. Nothing in the app
  // would complain: sending works, Android receives, and every attachment to an
  // iPhone silently stops arriving. Upstream needed a line-by-line read of the
  // decoder to find that (#1618); failing the build while both numbers live in
  // one repository is the cheap defence.
  const iosLimits = bitchatAvailable()
    ? bitchatSource(
        "localPackages/BitFoundation/Sources/BitFoundation/FileTransferLimits.swift",
      )
    : "";
  const iosMaxPayload = bitchatAvailable()
    ? swiftConstantExpr(iosLimits, "maxPayloadBytes")
    : null;
  // Their `maxFramedFileBytes` is a computed closure rather than a literal, so
  // it is rebuilt here from the same terms: payload + TLV envelope + binary
  // envelope. Reading `maxPayloadBytes` from source is what keeps it honest; the
  // overheads are fixed by the wire format and cannot drift without the frame
  // layout itself changing, which the checks above already cover.
  const iosFramedCeiling =
    iosMaxPayload === null ? null : iosMaxPayload + 0xffff * 2 + 18 + 96;
  s.check(
    "bitchat-ios file limits were read, not assumed",
    !bitchatAvailable() || iosMaxPayload !== null,
    `maxPayloadBytes=${String(iosMaxPayload)}`,
  );
  s.check(
    "our framed file ceiling matches the one bitchat-ios enforces",
    iosFramedCeiling === null || MAX_FRAMED_FILE_BYTES === iosFramedCeiling,
    `bitchat=${String(iosFramedCeiling)} airhop=${MAX_FRAMED_FILE_BYTES}`,
  );
  // The per-type caps are what a person actually runs into, and each has to
  // leave room for the envelope underneath it.
  s.check(
    "every per-type cap still fits inside that ceiling",
    iosFramedCeiling === null ||
      [MAX_FILE_BYTES, MAX_IMAGE_BYTES, MAX_VOICE_BYTES].every(
        (cap) => cap + 0xffff * 2 + 18 + 96 <= iosFramedCeiling,
      ),
    `file=${MAX_FILE_BYTES} image=${MAX_IMAGE_BYTES} voice=${MAX_VOICE_BYTES} ceiling=${String(iosFramedCeiling)}`,
  );

  // Packet type registry, read from bitchat's own enum rather than from a
  // constant of ours.
  //
  // Airhop's extensions have to sit clear of bitchat's allocation frontier.
  // bitchat assigns forward, so "the next free value" is the one place an
  // extension must never go: both projects reach for it, and then each side's
  // parser depends on the other's validation to not misread the payload.
  // Airhop sat on 0x2A/0x2B until upstream reserved them for courier spray-ack.
  //
  // The margin is what makes this a warning rather than a post-mortem. It fails
  // while bitchat is still approaching, leaving room to move before any build
  // ships on a contested value.
  const bitchatTypes = bitchatAvailable()
    ? [
        ...bitchatSource(
          "localPackages/BitFoundation/Sources/BitFoundation/MessageType.swift",
        ).matchAll(/case\s+\w+\s*=\s*0x([0-9a-fA-F]{2})/g),
      ].map((m) => parseInt(m[1], 16))
    : [];
  const bitchatMax = Math.max(0, ...bitchatTypes);
  const airhopOnly = [
    PacketType.DR_ENCRYPTED,
    PacketType.CHANNEL_ENC,
    PacketType.CHANNEL_MSG_AIRHOP,
  ];
  const HEADROOM = 0x10;
  s.check(
    "bitchat's registry was read, not assumed",
    !bitchatAvailable() || bitchatTypes.length > 10,
    `parsed ${bitchatTypes.length} types, max 0x${bitchatMax.toString(16)}`,
  );
  // DR_ENCRYPTED is the one exception: 0x12 sits inside bitchat's range but on
  // a value it has never assigned, and it predates this rule. Left alone
  // because moving a shipped type costs a migration; it is listed here so the
  // exemption is visible rather than forgotten.
  s.check(
    "Airhop's extensions clear bitchat's frontier by a safe margin",
    !bitchatAvailable() ||
      airhopOnly
        .filter((t) => t !== PacketType.DR_ENCRYPTED)
        .every((t) => t > bitchatMax + HEADROOM),
    `bitchat max=0x${bitchatMax.toString(16)}, airhop=[${airhopOnly
      .map((t) => `0x${t.toString(16)}`)
      .join(", ")}]`,
  );
  s.check(
    "and none of them collides with a value bitchat has assigned",
    airhopOnly.every((t) => !bitchatTypes.includes(t)),
    `bitchat=[${bitchatTypes.map((t) => `0x${t.toString(16)}`).join(", ")}]`,
  );
  s.assert();
});
