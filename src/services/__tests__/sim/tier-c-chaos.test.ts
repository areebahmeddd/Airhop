/**
 * @jest-environment node
 */
// Chaos: the world is actively hostile, and the schedule is chosen by a seed.
//
// The scenarios above this file each describe one failure. These describe a
// CLASS of failure and let a seeded generator pick the particulars, then assert
// only properties that must hold whatever it picked. A property that survives a
// few thousand random schedules is evidence; a scripted expectation that passes
// once is not.
//
// Every failure prints its seed. Re-running that seed reproduces the run
// exactly, on any machine, which is the only thing that makes a chaos suite
// worth having.

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
  const shim = require("../lifecycle/harness/bridge-shim") as {
    bleBridge: unknown;
  };
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("@bridge/NativeAirhopWiFi", () => {
  const shim = require("../lifecycle/harness/bridge-shim") as {
    wifiBridge: unknown;
  };
  return { __esModule: true, default: shim.wifiBridge };
});

import {
  encodePacket,
  Flags,
  PacketType,
  signPacket,
  type Packet,
} from "@core/mesh/wire/packet-codec";
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { SimDevice, type DeviceSpec } from "./harness/device";
import {
  badgeMatchesThreads,
  exactlyOnce,
  noCrashes,
  noDuplicateText,
  noForgedSenders,
  StatusWatcher,
  unreadCoherent,
} from "./harness/invariants";
import { RadioFabric } from "./harness/radio-fabric";
import { Scenario, waitFor, waitForCoarse } from "./harness/scenario";
import { WifiFabric } from "./harness/wifi-fabric";

jest.setTimeout(180_000);

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

const android = (id: string, seedByte: number): DeviceSpec => ({
  id,
  platform: "android",
  seedByte,
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

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
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

// ---------------------------------------------------------------------------

test("C03 replaying captured packets does not duplicate anything", async () => {
  const s = (scenario = new Scenario({
    id: "C03",
    title: "an attacker records the air and plays it back 200 times",
    seed: 777,
  }));
  const radio = new RadioFabric(s.world);
  const alice = SimDevice.create(s.world, android("alice", 11));
  const bob = SimDevice.create(s.world, android("bob", 22));
  const mallory = SimDevice.create(s.world, android("mallory", 88));
  const cast = [alice, bob, mallory];
  for (const d of cast) radio.add(d);
  s.track(...cast);
  for (const d of cast) d.launch();

  const channel = "#bluetooth";
  await waitFor(s.world, () => bob.peers().includes(alice.peerID), 20_000);
  for (const d of cast) d.joinChannel(channel);

  // Capture: everything alice puts on the air, as any radio in range can.
  const captured: string[] = [];
  const originalWrite = radio.tapWrites((fromID, _linkID, data) => {
    if (fromID === alice.id) captured.push(data);
  });

  alice.send(channel, "the message worth replaying");
  await waitFor(
    s.world,
    () => bob.texts(channel).includes("the message worth replaying"),
    20_000,
  );
  originalWrite();

  const beforeCount = bob.messages(channel).length;
  s.check(
    "something was captured off the air",
    captured.length > 0,
    `${captured.length} frames`,
  );

  // Play it all back, many times over.
  for (let round = 0; round < 200; round++) {
    for (const frame of captured) {
      radio.injectTo(bob.id, mallory.id, frame);
    }
  }
  await s.world.settle(20_000);

  s.check(
    "replaying 200 rounds added nothing to the thread",
    bob.messages(channel).length === beforeCount,
    `before=${beforeCount} after=${bob.messages(channel).length}`,
  );
  s.expectNone("exactly once", exactlyOnce(cast));
  s.expectNone("no duplicate text", noDuplicateText(cast, channel));
  s.expectNone("unread coherent", unreadCoherent(cast));
  s.expectNone("badge matches threads", badgeMatchesThreads(cast));
  s.expectNone("process health", noCrashes(cast));
  s.assert(true);
});

test("C04 a Sybil flood of fake peers does not evict the real ones", async () => {
  const s = (scenario = new Scenario({
    id: "C04",
    title: "500 invented peer IDs announce themselves at once",
    seed: 909,
  }));
  const radio = new RadioFabric(s.world);
  const alice = SimDevice.create(s.world, android("alice", 11));
  const bob = SimDevice.create(s.world, android("bob", 22));
  const mallory = SimDevice.create(s.world, android("mallory", 88));
  const cast = [alice, bob, mallory];
  for (const d of cast) radio.add(d);
  s.track(...cast);
  for (const d of cast) d.launch();

  const channel = "#bluetooth";
  await waitFor(s.world, () => bob.peers().includes(alice.peerID), 20_000);
  for (const d of cast) d.joinChannel(channel);
  alice.send(channel, "I am a real peer");
  await waitFor(
    s.world,
    () => bob.texts(channel).includes("I am a real peer"),
    20_000,
  );

  // Establish alice as a settled direct neighbour before the flood starts.
  //
  // The property under test is that a flood cannot evict an ESTABLISHED
  // neighbour. Bob can learn alice's identity from a relayed announce (which is
  // enough to display her messages) before her direct announce has bound his
  // link to her, and flooding in that window would be testing the setup rather
  // than the defence.
  const established = await waitForCoarse(
    s.world,
    () => bob.isDirectPeer(alice.peerID),
    30_000,
  );
  s.check(
    "alice is an established direct neighbour before the flood",
    established,
    `bob sees alice as direct: ${String(bob.isDirectPeer(alice.peerID))}`,
  );

  // Each fake peer is internally consistent: a real keypair, a peer ID properly
  // derived from it, a correctly signed announce. Nothing about any one of them
  // is detectably wrong - which is exactly what makes a Sybil flood a resource
  // problem rather than a signature problem.
  for (let i = 0; i < 500; i++) {
    const signingPriv = sha256(
      new TextEncoder().encode(`sybil-sign-${String(i)}`),
    );
    const signingPub = ed25519.getPublicKey(signingPriv);
    const noisePriv = sha256(
      new TextEncoder().encode(`sybil-noise-${String(i)}`),
    );
    const noisePub = x25519.getPublicKey(noisePriv);
    const peerID = bytesToHex(sha256(noisePub)).slice(0, 16);

    const nick = new TextEncoder().encode(`sybil${String(i)}`);
    const payload = new Uint8Array(2 + nick.length + 2 + 32 + 2 + 32);
    let o = 0;
    payload[o++] = 0x01;
    payload[o++] = nick.length;
    payload.set(nick, o);
    o += nick.length;
    payload[o++] = 0x02;
    payload[o++] = 32;
    payload.set(noisePub, o);
    o += 32;
    payload[o++] = 0x03;
    payload[o++] = 32;
    payload.set(signingPub, o);

    const senderID = new Uint8Array(8);
    for (let k = 0; k < 8; k++) {
      senderID[k] = parseInt(peerID.slice(k * 2, k * 2 + 2), 16);
    }
    const packet: Packet = {
      type: PacketType.ANNOUNCE,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID,
      recipientID: new Uint8Array(8),
      timestamp: s.world.wallClock(),
      signature: new Uint8Array(64),
      payload,
    };
    packet.signature = signPacket(packet, signingPriv);
    radio.injectTo(bob.id, mallory.id, toBase64(encodePacket(packet)));
  }
  await s.world.settle(30_000);

  s.check(
    "the real peer is still known after the flood",
    bob.peers().includes(alice.peerID),
    `bob knows ${bob.peerCount()} peers; alice=${alice.peerID} present=${String(bob.peers().includes(alice.peerID))}`,
  );
  // Boundedness is the property, not any particular number. 500 fakes must not
  // produce 500 entries: the list is capped, and the only things allowed above
  // the cap are peers we hold an actual BLE link to, which cannot be invented.
  const directNeighbours = 2;
  s.check(
    "the peer list is bounded rather than growing with the flood",
    bob.peerCount() <= 200 + directNeighbours,
    `bob holds ${bob.peerCount()} peers after 500 fakes announced (cap 200 + ${directNeighbours} direct)`,
  );
  s.check(
    "the real message is still in the thread",
    bob.texts(channel).includes("I am a real peer"),
    `bob thread=[${bob.texts(channel).join(" | ")}]`,
  );
  s.expectNone("process health", noCrashes(cast));
  s.assert(true);
});

test("C05 a phone killed mid-conversation comes back consistent", async () => {
  const s = (scenario = new Scenario({
    id: "C05",
    title: "process death and cold relaunch, with storage surviving",
    seed: 4242,
  }));
  const { devices } = room(s, [android("alice", 11), android("bob", 22)]);
  const [alice, bob] = devices;
  const channel = "#bluetooth";
  await waitFor(s.world, () => alice.peers().includes(bob.peerID), 20_000);
  for (const d of devices) d.joinChannel(channel);

  alice.send(channel, "before the crash");
  await waitFor(
    s.world,
    () => bob.texts(channel).includes("before the crash"),
    20_000,
  );
  const beforeKill = bob.messages(channel).length;

  // The OS reclaims bob's process. MMKV survives; memory does not.
  bob.kill();
  await s.world.advance(2_000);
  alice.send(channel, "while bob was dead");
  await s.world.advance(3_000);

  bob.relaunch();
  const reconnected = await waitForCoarse(
    s.world,
    () =>
      alice.peers().includes(bob.peerID) && bob.peers().includes(alice.peerID),
    40_000,
  );
  s.check("the mesh re-formed after a cold relaunch", reconnected);
  s.check(
    "messages from before the crash survived on disk",
    bob.messages(channel).length >= beforeKill &&
      bob.texts(channel).includes("before the crash"),
    `bob thread=[${bob.texts(channel).join(" | ")}]`,
  );

  // And the conversation continues.
  alice.send(channel, "after bob came back");
  const resumed = await waitForCoarse(
    s.world,
    () => bob.texts(channel).includes("after bob came back"),
    40_000,
  );
  s.check(
    "new messages arrive again after the relaunch",
    resumed,
    `bob thread=[${bob.texts(channel).join(" | ")}]`,
  );

  s.expectNone("exactly once", exactlyOnce(devices));
  s.expectNone("no duplicate text", noDuplicateText(devices, channel));
  s.expectNone("badge matches threads", badgeMatchesThreads(devices));
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("C06 a panic wipe leaves nothing behind and the room carries on", async () => {
  const s = (scenario = new Scenario({
    id: "C06",
    title: "triple-tap the logo while two conversations are live",
    seed: 5150,
  }));
  const { radio, devices } = room(s, [
    android("alice", 11),
    android("bob", 22),
    android("carol", 33),
  ]);
  const [alice, bob, carol] = devices;
  const channel = "#bluetooth";
  await waitForCoarse(
    s.world,
    () => devices.every((d) => d.peerCount() === 2),
    30_000,
  );
  for (const d of devices) d.joinChannel(channel);
  alice.send(channel, "something to forget");
  bob.send(`dm:${alice.peerID}`, "a private thing to forget");
  await s.world.settle(20_000);

  s.check(
    "bob's service sees both of its radio links before the wipe",
    bob.bleLinkCount() === 2,
    `bobServiceLinks=${bob.bleLinkCount()} radioLinks=${radio.linkCount()}`,
  );
  s.check(
    "alice has something worth wiping",
    alice.messages(channel).length > 0,
    `${alice.messages(channel).length} public messages held`,
  );

  alice.panicWipe();
  await s.world.advance(2_000);

  s.check(
    "every message is gone",
    Object.values(alice.allMessages()).every((rows) => rows.length === 0),
    JSON.stringify(
      Object.fromEntries(
        Object.entries(alice.allMessages()).map(([k, v]) => [k, v.length]),
      ),
    ),
  );
  // A wiped phone is a fresh install, and a fresh install has the default
  // location channels. What must not survive is anything the USER accumulated:
  // messages, contacts, custom channels, unread state.
  const defaults = new Set([
    "#bluetooth",
    "#block",
    "#neighborhood",
    "#city",
    "#province",
    "#region",
  ]);
  s.check(
    "only the default channels remain, as on a fresh install",
    alice.channels().every((c) => defaults.has(c)),
    `channels=[${alice.channels().join(",")}]`,
  );
  s.check("no contact remains", alice.contacts().length === 0);
  s.check(
    "the badge is clear",
    alice.totalUnread() === 0,
    `badge=${alice.totalUnread()}`,
  );

  // The rest of the room is unaffected: a wipe is local, not a network event.
  const sendResult = bob.send(channel, "life goes on");
  const stillWorks = await waitForCoarse(
    s.world,
    () => carol.texts(channel).includes("life goes on"),
    30_000,
  );
  s.check(
    "the other phones keep talking to each other",
    stillWorks,
    `send=${sendResult} bobMeshAlive=${String(bob.mesh !== null)} carolMeshAlive=${String(carol.mesh !== null)} radioLink=${String(radio.isLinked("bob", "carol"))} bobServiceLinks=${bob.bleLinkCount()} bobPeers=[${bob.peers().join(",")}] carolPeers=[${carol.peers().join(",")}] carolThread=[${carol.texts(channel).join(" | ")}] carolChannels=[${carol.channels().join(",")}]`,
  );
  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("C07 seeded soak: eight phones, hundreds of random events", async () => {
  const seed = 20260731;
  const s = (scenario = new Scenario({
    id: "C07",
    title: "a room where anything can happen to anyone at any moment",
    seed,
  }));
  const { radio, devices } = room(
    s,
    Array.from({ length: 8 }, (_, i) => android(`p${String(i)}`, 5 + i * 7)),
  );
  // WiFi runs alongside Bluetooth for the whole soak.
  //
  // Every scenario in tier-wifi is deterministic and small: two or three phones,
  // a link brought up or torn down at a moment the test chose. None of that
  // answers what happens when WiFi flaps in a crowded room while people
  // background their phones and the Bluetooth radio is already degraded. The
  // phones here are all Android, so any pair can link.
  const wifi = new WifiFabric(s.world);
  for (const d of devices) wifi.add(d);

  const rng = s.world.rng.fork("soak");
  const watcher = new StatusWatcher(devices);
  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);

  await waitForCoarse(
    s.world,
    () => devices.every((d) => d.peerCount() >= 4),
    30_000,
  );

  // Everything a phone or the world can plausibly do, drawn at random. The
  // point is not any individual action - it is that no ORDERING of them breaks
  // an invariant.
  const sentTexts: string[] = [];
  let sendSeq = 0;
  const actions: { name: string; run: () => void }[] = [
    {
      name: "somebody says something",
      run: () => {
        const d = rng.pick(devices);
        const text = `msg-${String(sendSeq++)}-from-${d.id}`;
        sentTexts.push(text);
        d.send(channel, text);
      },
    },
    {
      name: "somebody sends a DM",
      run: () => {
        const from = rng.pick(devices);
        const to = rng.pick(devices.filter((d) => d.id !== from.id));
        from.send(`dm:${to.peerID}`, `dm-${String(sendSeq++)}`);
      },
    },
    {
      name: "a phone goes to the home screen",
      run: () => rng.pick(devices).background(),
    },
    { name: "a phone is reopened", run: () => rng.pick(devices).foreground() },
    {
      name: "somebody walks out of range",
      run: () => radio.setIsolated(rng.pick(devices).id, true),
    },
    {
      name: "somebody walks back",
      run: () => radio.setIsolated(rng.pick(devices).id, false),
    },
    {
      name: "Bluetooth is toggled off and on",
      run: () => {
        const d = rng.pick(devices);
        d.setBluetooth(false);
        d.setBluetooth(true);
      },
    },
    {
      name: "a thread is opened",
      run: () => rng.pick(devices).openThread(channel),
    },
    { name: "a thread is closed", run: () => rng.pick(devices).closeThread() },
    {
      name: "the radio gets worse",
      run: () =>
        radio.setConditions({
          loss: rng.float() * 0.3,
          duplicate: rng.float() * 0.15,
          corrupt: rng.float() * 0.05,
        }),
    },
    { name: "signal strength churns", run: () => radio.churnRssi() },
    {
      name: "a phone is killed and relaunched",
      run: () => {
        const d = rng.pick(devices);
        d.kill();
        d.relaunch();
      },
    },
    {
      name: "two phones find each other over WiFi",
      run: () => {
        const a = rng.pick(devices);
        const b = rng.pick(devices.filter((d) => d.id !== a.id));
        wifi.link(a.id, b.id);
      },
    },
    {
      name: "a WiFi link drops",
      run: () => {
        const a = rng.pick(devices);
        const b = rng.pick(devices.filter((d) => d.id !== a.id));
        wifi.unlink(a.id, b.id);
      },
    },
  ];

  const ROUNDS = 300;
  for (let i = 0; i < ROUNDS; i++) {
    const action = rng.pick(actions);
    try {
      action.run();
    } catch (e) {
      s.check(
        `action "${action.name}" threw at round ${String(i)}`,
        false,
        String(e),
      );
    }
    await s.world.advance(rng.int(20, 200), 25);
    watcher.sample();
    if (devices.some((d) => d.os.crashed !== null)) break;
  }

  // Let the world calm down, with everybody in range and a clean radio, so the
  // final state is one the mesh has actually had a chance to converge on.
  radio.setConditions({ loss: 0, duplicate: 0, corrupt: 0 });
  for (const d of devices) {
    radio.setIsolated(d.id, false);
    d.foreground();
  }
  await s.world.settle(60_000, 1_000);
  watcher.sample();

  // No outcome is asserted. Only properties.
  s.expectNone("nothing crashed", noCrashes(devices));
  s.expectNone("no message rendered twice", exactlyOnce(devices));
  s.expectNone("no duplicated text", noDuplicateText(devices, channel));
  s.expectNone("no forged senders", noForgedSenders(devices));
  s.expectNone("delivery state never ran backwards", watcher.results());
  s.expectNone("unread counts stayed coherent", unreadCoherent(devices));
  s.expectNone("badges matched their threads", badgeMatchesThreads(devices));

  const delivered = devices.map(
    (d) => d.messages(channel).filter((m) => !m.isMine).length,
  );
  s.check(
    "the mesh was actually carrying traffic, not silently dead",
    Math.max(...delivered) > 0,
    `per-device inbound: ${delivered.join(",")} across ${sentTexts.length} public sends`,
  );
  s.check(
    "the radio saw real load",
    radio.packetsDelivered > 100,
    `${radio.packetsDelivered} packets, ${radio.packetsDropped} dropped, ${radio.packetsCorrupted} corrupted`,
  );
  // Without this, the two WiFi actions could be silently doing nothing and the
  // soak would still pass every invariant, which is the failure mode where a
  // test reports coverage it does not have.
  s.check(
    "WiFi was genuinely part of the churn, not a no-op action",
    wifi.framesCarried > 0,
    `${wifi.framesCarried} frames, ${wifi.bytesCarried} bytes, ${wifi.linkCount()} links still up`,
  );
  s.assert(true);
});
