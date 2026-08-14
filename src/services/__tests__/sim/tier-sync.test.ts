/**
 * @jest-environment node
 */
// Tier S: the gossip sync and replay contract, across real phones.
//
// Each scenario pins a property that only appears with more than one device and
// more than one hop. The unit tests in core/mesh cover the shapes; these cover
// what those shapes do to a room.
//
// Both failures guarded against here are silent. A sync storm looks like a busy
// mesh, and a replayed packet looks like a message, so neither surfaces as an
// error on any device. Watching the air is the only way to see them.

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
  const shim = require("../lifecycle/harness/bridge-shim");
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("@bridge/NativeAirhopWiFi", () => {
  const shim = require("../lifecycle/harness/bridge-shim");
  return { __esModule: true, default: shim.wifiBridge };
});

import {
  decodePacket,
  encodePacket,
  Flags,
  PacketType,
  signPacket,
  type Packet,
} from "@core/mesh/packet-codec";
import {
  channelPacketType,
  encodeAirhopChannelPayload,
  encodeMeshPublicPayload,
  MESH_PUBLIC_CHANNEL,
} from "@core/router/message-router";
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

function base64ToBytes(b64: string): Uint8Array {
  const bin = globalThis.atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToBase64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return globalThis.btoa(s);
}

function hex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Everything a given phone puts on the air, decoded. The tap is the only
// honest place to ask "what actually went out" - a device's own state cannot
// tell you what it chose to relay.
function watchAir(
  radio: RadioFabric,
  fromID: string,
): { packets: Packet[]; stop: () => void } {
  const packets: Packet[] = [];
  const stop = radio.tapWrites((who, _linkID, dataBase64) => {
    if (who !== fromID) return;
    const p = decodePacket(base64ToBytes(dataBase64));
    if (p !== null) packets.push(p);
  });
  return { packets, stop };
}

// A public message genuinely signed by `author`, stamped at whatever time the
// caller wants. Signing with the author's real key is the point: it removes the
// signature rule from the question entirely, so anything that refuses the
// packet refused it for the reason under test.
function signedPublicMessage(
  author: SimDevice,
  channel: string,
  text: string,
  timestamp: number,
  messageID: string,
  isRSR = false,
): Uint8Array {
  const senderID = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    senderID[i] = parseInt(author.peerID.slice(i * 2, i * 2 + 2), 16);
  }
  const packet: Packet = {
    type: channelPacketType(channel),
    ttl: 7,
    flags: Flags.SIGNED,
    senderID,
    recipientID: new Uint8Array(8),
    timestamp,
    signature: new Uint8Array(64),
    payload:
      channel === MESH_PUBLIC_CHANNEL
        ? encodeMeshPublicPayload(text)
        : encodeAirhopChannelPayload(channel, text, messageID),
    ...(isRSR ? { isRSR: true } : {}),
  };
  packet.signature = signPacket(packet, author.identity.signingPrivKey);
  return encodePacket(packet);
}

function phones(
  s: Scenario,
  ids: string[],
): { radio: RadioFabric; devices: SimDevice[] } {
  const radio = new RadioFabric(s.world);
  const devices = ids.map((id, i) =>
    SimDevice.create(s.world, {
      id,
      platform: "android",
      seedByte: 11 + i * 11,
    }),
  );
  for (const d of devices) radio.add(d);
  s.track(...devices);
  return { radio, devices };
}

// ---------------------------------------------------------------------------

test("S01 catching up after a partition does not re-flood the mesh", async () => {
  // The bug this exists for: sync responses were replayed carrying their
  // original ttl. The requester's flood router sees each one as new, which it
  // is, and forwards it to every other neighbour, who forward it again. One
  // phone rejoining after a partition pushes the entire archive across the
  // mesh, and the symptom is a room that gets slower the longer it runs.
  const s = (scenario = new Scenario({
    id: "S01",
    title: "a rejoining phone catches up without rebroadcasting what it learns",
    seed: 91,
  }));
  // Four phones, because the fourth is what makes the test able to fail: a
  // rejoining node with a single link has nowhere to relay to, since the relay
  // path skips the link a packet arrived on. Carol arrives between bob and
  // dave, so anything she forwards has somewhere to go.
  const { radio, devices } = phones(s, ["alice", "bob", "carol", "dave"]);
  const [alice, bob, carol, dave] = devices;

  // Carol and dave start out of everyone's range.
  radio.setTopology([["alice", "bob"]]);
  for (const d of devices) d.launch();

  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);

  await waitFor(s.world, () => bob.peers().includes(alice.peerID), 20_000);

  const said = ["water at the south gate", "medic tent moved", "bridge is up"];
  for (const text of said) {
    alice.send(channel, text);
    await s.world.advance(300);
  }
  const bobHeard = await waitFor(
    s.world,
    () => said.every((t) => bob.texts(channel).includes(t)),
    20_000,
  );
  s.check("bob heard the room while carol was away", bobHeard);

  // Carol walks into range, bridging bob and dave. From here on, watch what
  // she puts on the air.
  const carolAir = watchAir(radio, carol.id);
  s.world.say("TOPOLOGY_CHANGE", "carol arrives between bob and dave");
  radio.setTopology([
    ["alice", "bob"],
    ["bob", "carol"],
    ["carol", "dave"],
  ]);

  const caughtUp = await waitForCoarse(
    s.world,
    () =>
      said.every((t) => carol.texts(channel).includes(t)) &&
      carol.peers().includes(dave.peerID),
    60_000,
  );
  s.check(
    "carol caught up on everything she missed",
    caughtUp,
    `carol thread = [${carol.texts(channel).join(" | ")}]`,
  );
  s.check(
    "carol had somewhere to relay to, so a storm would have been visible",
    carol.peers().includes(dave.peerID),
  );

  // Give any scheduled relay its chance before judging. A relay is jittered by
  // up to 220ms, so asserting the instant the text appears would race the timer
  // and pass for the wrong reason - the storm would simply not have started
  // yet. Three seconds is well past the window and past a further sync round.
  await s.world.advance(3_000);

  // The load-bearing half. Catching up is only correct if it stays local: a
  // node that relays what it was just handed turns one catch-up into a storm.
  const aliceSenderID = alice.peerID;
  const rebroadcast = carolAir.packets.filter(
    (p) =>
      p.type === PacketType.CHANNEL_MSG && hex(p.senderID) === aliceSenderID,
  );
  carolAir.stop();
  s.check(
    "carol never rebroadcast a single packet she caught up on",
    rebroadcast.length === 0,
    `carol relayed ${String(rebroadcast.length)} of alice's messages back onto the air`,
  );

  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("S02 sync requests and their answers never leave the link", async () => {
  // REQUEST_SYNC is a question about what the phone on the far end of THIS
  // link is missing. Relaying it asks a node that was never being addressed,
  // and every hop it travels multiplies the answers.
  const s = (scenario = new Scenario({
    id: "S02",
    title: "sync traffic is link-local in both directions",
    seed: 92,
  }));
  const { radio, devices } = phones(s, ["alice", "bob", "carol"]);
  radio.setChain(devices.map((d) => d.id));
  for (const d of devices) d.launch();

  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);
  await waitForCoarse(s.world, () => radio.linkCount() === 2, 30_000);

  devices[0].send(channel, "something to sync about");

  // Watch the middle phone: it is the only one with somewhere to relay TO.
  const bobAir = watchAir(radio, devices[1].id);
  await s.world.advance(40_000);
  bobAir.stop();

  const syncPackets = bobAir.packets.filter(
    (p) => p.type === PacketType.REQUEST_SYNC,
  );
  s.check(
    "the middle phone did send sync requests of its own",
    syncPackets.length > 0,
    `saw ${String(syncPackets.length)} REQUEST_SYNC writes`,
  );
  s.check(
    "every sync request went out link-local (ttl 0)",
    syncPackets.every((p) => p.ttl === 0),
    `ttls = [${syncPackets.map((p) => String(p.ttl)).join(",")}]`,
  );
  // A request carrying someone else's senderID would mean we relayed theirs.
  const ownID = devices[1].peerID;
  s.check(
    "the middle phone never forwarded a neighbour's sync request",
    syncPackets.every((p) => hex(p.senderID) === ownID),
  );

  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("S03 an old packet is refused even when its signature is perfect", async () => {
  // The deduplicator is not the defence here: its window is five minutes and
  // its state is per device, so it says nothing about a phone that never saw
  // the original. Someone can record a message in one room and play it into
  // strangers' phones later, attributed to its author and presented as current.
  //
  // The test is built as a matched pair. Two messages, both signed with
  // alice's real key, both injected by a phone that is not alice, into a phone
  // that has met alice but never saw either message. They differ in exactly one
  // field: the timestamp. If only the stale one is refused, the age check is
  // what refused it - not the signature rule, not dedup, not routing.
  const s = (scenario = new Scenario({
    id: "S03",
    title: "a matched pair differing only in age",
    seed: 93,
  }));
  const { radio, devices } = phones(s, ["alice", "bob", "carol", "mallory"]);
  const [alice, , carol, mallory] = devices;

  // Everyone meets first, so carol holds alice's signing key. Without that,
  // both messages would be dropped for being unverifiable and the test would
  // pass while proving nothing.
  radio.setFullMesh();
  for (const d of devices) d.launch();
  const channel = "#bluetooth";
  for (const d of devices) d.joinChannel(channel);
  const met = await waitForCoarse(
    s.world,
    () => carol.peers().includes(alice.peerID),
    45_000,
  );
  s.check("carol learned alice's identity before the attack", met);

  // Alice leaves. Carol is now alone with mallory, so nothing can reach her
  // through an honest path and any arrival is the injection under test.
  s.world.say("TOPOLOGY_CHANGE", "alice and bob walk away; mallory stays");
  radio.setTopology([
    ["alice", "bob"],
    ["carol", "mallory"],
  ]);
  await waitForCoarse(
    s.world,
    () => radio.isLinked("carol", "mallory"),
    30_000,
  );

  const stale = "the meeting is at four";
  const fresh = "the meeting is at five";
  const staleAt = s.world.wallClock() - 6 * 60_000;

  // Mallory replays something alice said six minutes ago, byte-perfect.
  radio.injectTo(
    carol.id,
    mallory.id,
    bytesToBase64(
      signedPublicMessage(alice, channel, stale, staleAt, `replay-${staleAt}`),
    ),
  );
  await s.world.advance(5_000);
  s.check(
    "a six-minute-old message is refused",
    !carol.texts(channel).includes(stale),
    `carol thread = [${carol.texts(channel).join(" | ")}]`,
  );

  // The control. Same author, same key, same injector, same link - only the
  // timestamp differs. A check that rejected both would pass the assertion
  // above and be worthless.
  const freshAt = s.world.wallClock();
  radio.injectTo(
    carol.id,
    mallory.id,
    bytesToBase64(
      signedPublicMessage(alice, channel, fresh, freshAt, `live-${freshAt}`),
    ),
  );
  const arrived = await waitFor(
    s.world,
    () => carol.texts(channel).includes(fresh),
    15_000,
  );
  s.check(
    "the identical message stamped now IS accepted",
    arrived,
    `carol thread = [${carol.texts(channel).join(" | ")}]`,
  );

  // And the one path that is allowed to carry old packets buys a stranger
  // nothing. IS_RSR is the sender's claim; the pending request is our own
  // record, and carol never asked mallory for a sync of this.
  radio.injectTo(
    carol.id,
    mallory.id,
    bytesToBase64(
      signedPublicMessage(
        alice,
        channel,
        stale,
        staleAt,
        `rsr-${staleAt}`,
        true,
      ),
    ),
  );
  await s.world.advance(5_000);
  s.check(
    "claiming IS_RSR does not buy an unsolicited replay an exemption",
    !carol.texts(channel).includes(stale),
    `carol thread = [${carol.texts(channel).join(" | ")}]`,
  );

  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});

test("S04 a route planned by another node is followed, not flooded", async () => {
  // Airhop never plans routes, since publishing a crowd's adjacency graph is
  // the wrong price for routing bandwidth (see core/mesh/source-route.ts). A
  // bitchat peer that has planned one is still owed the hop it asked for, or we
  // become a node other implementations route around. The forged packet here
  // stands in for that peer.
  const s = (scenario = new Scenario({
    id: "S04",
    title: "an intermediate hop unicasts along the route instead of flooding",
    seed: 94,
  }));
  const { radio, devices } = phones(s, ["alice", "bob", "carol", "dave"]);
  const [alice, bob, carol] = devices;

  // Bob has TWO onward neighbours. With one, following a route and flooding
  // look identical from the air and the test could not tell them apart.
  radio.setTopology([
    ["alice", "bob"],
    ["bob", "carol"],
    ["bob", "dave"],
  ]);
  for (const d of devices) d.launch();
  const linked = await waitForCoarse(
    s.world,
    () => radio.linkCount() === 3,
    45_000,
  );
  s.check("bob has two onward neighbours", linked);

  const bobAir = watchAir(radio, bob.id);

  // Alice -> [bob] -> carol. The route carries intermediate hops only; carol is
  // in the header, per SOURCE_ROUTING.md section 3.
  const senderID = new Uint8Array(8);
  const recipientID = new Uint8Array(8);
  const hop = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    senderID[i] = parseInt(alice.peerID.slice(i * 2, i * 2 + 2), 16);
    recipientID[i] = parseInt(carol.peerID.slice(i * 2, i * 2 + 2), 16);
    hop[i] = parseInt(bob.peerID.slice(i * 2, i * 2 + 2), 16);
  }
  const marker = new Uint8Array([0x5e, 0xed, 0x01, 0x02, 0x03, 0x04]);
  const routedPacket: Packet = {
    type: PacketType.NOISE_ENCRYPTED,
    ttl: 7,
    flags: Flags.HAS_RECIPIENT,
    senderID,
    recipientID,
    timestamp: s.world.wallClock(),
    signature: new Uint8Array(64),
    payload: marker,
    version: 2,
    route: [hop],
  };
  radio.injectTo(bob.id, alice.id, bytesToBase64(encodePacket(routedPacket)));
  await s.world.advance(5_000);
  bobAir.stop();

  const forwarded = bobAir.packets.filter(
    (p) =>
      p.type === PacketType.NOISE_ENCRYPTED &&
      p.payload.length === marker.length &&
      p.payload.every((b, i) => b === marker[i]),
  );
  s.check(
    "bob forwarded the routed packet",
    forwarded.length > 0,
    `saw ${String(forwarded.length)} forwards`,
  );
  s.check(
    "bob forwarded it exactly once, not to every neighbour",
    forwarded.length === 1,
    `saw ${String(forwarded.length)} forwards; a flood would be 2 (carol and dave)`,
  );
  s.check(
    "the route survived the hop, so the next relay can follow it too",
    forwarded[0]?.route?.length === 1,
  );

  s.expectNone("process health", noCrashes(devices));
  s.assert(true);
});
