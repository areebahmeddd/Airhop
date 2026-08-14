/**
 * @jest-environment node
 */
// Tier R: bare relay nodes, the ESP32-on-a-pole case.
//
// Third-party relays exist (bitle.org, bitchat-esp32, bitchat-relay) and Airhop
// works with them for one reason: forwarding consults no registry and verifies
// no signature. If that ever changes, these fail. See PROTOCOLS.md section 10.

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
jest.mock("@bridge/NativeAirhopWiFi", () => {
  const shim = require("../../harness/bridge-shim");
  return { __esModule: true, default: shim.wifiBridge };
});

import { SimDevice } from "../harness/device";
import {
  badgeMatchesThreads,
  exactlyOnce,
  noCrashes,
  noDuplicateText,
  noForgedSenders,
} from "../harness/invariants";
import { RadioFabric } from "../harness/radio-fabric";
import { RelayNode } from "../harness/relay-node";
import { Scenario, waitFor } from "../harness/scenario";

jest.setTimeout(240_000);

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

const CHANNEL = "#bluetooth";

function phones(s: Scenario, ids: string[]): SimDevice[] {
  return ids.map((id, i) =>
    SimDevice.create(s.world, {
      id,
      platform: "android",
      seedByte: 21 + i * 13,
    }),
  );
}

// ---------------------------------------------------------------------------

test("R01 two phones out of range of each other talk through a relay", async () => {
  const s = (scenario = new Scenario({
    id: "R01",
    title: "a box on a pole stands in for the person who is not there",
    seed: 501,
  }));
  const radio = new RadioFabric(s.world);
  const [alice, bob] = phones(s, ["alice", "bob"]);
  const relay = new RelayNode(s.world, { id: "pole" });
  for (const n of [alice, bob]) radio.add(n);
  radio.add(relay);
  s.track(alice, bob);

  // Alice and bob cannot hear each other, and there is no third PERSON between
  // them. Only the relay.
  radio.setTopology([
    ["alice", "pole"],
    ["bob", "pole"],
  ]);
  alice.launch();
  bob.launch();
  relay.launch();

  alice.joinChannel(CHANNEL);
  bob.joinChannel(CHANNEL);

  const linked = await waitFor(s.world, () => relay.seen.received > 0, 30_000);
  s.check("the relay is carrying traffic", linked, `${relay.seen.received}`);

  // Discovery first, and the ordering is the property rather than setup. A
  // public message is verified against a signing key learned from an ANNOUNCE,
  // so a relay does not make two strangers reachable: it makes their announces
  // reachable. Sending before that lands is correctly dropped at the far end.
  const found = await waitFor(
    s.world,
    () => bob.peers().includes(alice.peerID),
    60_000,
  );
  s.check("bob learned alice through the relay", found);

  alice.send(CHANNEL, "anyone at the south gate");
  const arrived = await waitFor(
    s.world,
    () => bob.texts(CHANNEL).includes("anyone at the south gate"),
    60_000,
  );

  s.check(
    "bob heard alice through a node that holds no keys and knows nobody",
    arrived,
    `bob=[${bob.texts(CHANNEL).join(" | ")}] relayed=${relay.seen.relayed}`,
  );
  s.check("the relay actually forwarded", relay.seen.relayed > 0);

  s.expectNone("exactly once", exactlyOnce([alice, bob]));
  s.expectNone("no duplicate text", noDuplicateText([alice, bob], CHANNEL));
  s.expectNone("no forged senders", noForgedSenders([alice, bob]));
  s.expectNone("process health", noCrashes([alice, bob]));
  s.assert(true);
});

test("R02 a relay never appears as a peer", async () => {
  // A relay that announced itself would sit in the Mesh tab as a person nobody
  // can message. Saying nothing keeps it out of the roster and costs it nothing.
  const s = (scenario = new Scenario({
    id: "R02",
    title: "infrastructure is not a contact",
    seed: 502,
  }));
  const radio = new RadioFabric(s.world);
  const [alice, bob] = phones(s, ["alice", "bob"]);
  const relay = new RelayNode(s.world, { id: "pole" });
  for (const n of [alice, bob]) radio.add(n);
  radio.add(relay);
  s.track(alice, bob);

  radio.setTopology([
    ["alice", "pole"],
    ["bob", "pole"],
  ]);
  alice.launch();
  bob.launch();
  relay.launch();
  alice.joinChannel(CHANNEL);
  bob.joinChannel(CHANNEL);

  await waitFor(s.world, () => alice.peers().includes(bob.peerID), 60_000);

  s.check(
    "alice found bob through the relay",
    alice.peers().includes(bob.peerID),
    `peers=[${alice.peers().join(", ")}]`,
  );
  // The relay's fabric label is not a peer ID and must never be treated as one.
  s.check(
    "the relay itself is not in anyone's peer list",
    !alice.peers().includes(relay.peerID) &&
      !bob.peers().includes(relay.peerID),
    `alice=[${alice.peers().join(", ")}] bob=[${bob.peers().join(", ")}]`,
  );

  s.expectNone("badge matches threads", badgeMatchesThreads([alice, bob]));
  s.expectNone("process health", noCrashes([alice, bob]));
  s.assert(true);
});

test("R03 a chain of relays carries a message further than one hop", async () => {
  // Two poles and nobody in between, which a single extender cannot answer.
  const s = (scenario = new Scenario({
    id: "R03",
    title: "relay to relay, with no person anywhere in the middle",
    seed: 503,
  }));
  const radio = new RadioFabric(s.world);
  const [alice, bob] = phones(s, ["alice", "bob"]);
  const north = new RelayNode(s.world, { id: "north" });
  const south = new RelayNode(s.world, { id: "south" });
  for (const n of [alice, bob]) radio.add(n);
  radio.add(north);
  radio.add(south);
  s.track(alice, bob);

  radio.setTopology([
    ["alice", "north"],
    ["north", "south"],
    ["south", "bob"],
  ]);
  alice.launch();
  bob.launch();
  north.launch();
  south.launch();
  alice.joinChannel(CHANNEL);
  bob.joinChannel(CHANNEL);

  // Two relays deep, so the announce has further to travel than in R01.
  const found = await waitFor(
    s.world,
    () => bob.peers().includes(alice.peerID),
    90_000,
  );
  s.check("the announce crossed both relays", found);

  alice.send(CHANNEL, "two poles and no people");
  const arrived = await waitFor(
    s.world,
    () => bob.texts(CHANNEL).includes("two poles and no people"),
    90_000,
  );

  s.check(
    "the message crossed both relays",
    arrived,
    `north=${north.seen.relayed} south=${south.seen.relayed} bob=[${bob
      .texts(CHANNEL)
      .join(" | ")}]`,
  );
  s.check(
    "both relays carried it",
    north.seen.relayed > 0 && south.seen.relayed > 0,
  );

  s.expectNone("exactly once", exactlyOnce([alice, bob]));
  s.expectNone("no duplicate text", noDuplicateText([alice, bob], CHANNEL));
  s.expectNone("process health", noCrashes([alice, bob]));
  s.assert(true);
});

test("R04 relays in a loop do not trade a packet forever", async () => {
  // Three nodes wired in a ring have a path back to themselves. Without dedup
  // and TTL one message circles until the air is full, which is worse than no
  // relay at all.
  const s = (scenario = new Scenario({
    id: "R04",
    title: "a ring of relays settles instead of resonating",
    seed: 504,
  }));
  const radio = new RadioFabric(s.world);
  const [alice, bob] = phones(s, ["alice", "bob"]);
  const a = new RelayNode(s.world, { id: "ra" });
  const b = new RelayNode(s.world, { id: "rb" });
  const c = new RelayNode(s.world, { id: "rc" });
  for (const n of [alice, bob]) radio.add(n);
  for (const r of [a, b, c]) radio.add(r);
  s.track(alice, bob);

  radio.setTopology([
    ["alice", "ra"],
    ["ra", "rb"],
    ["rb", "rc"],
    ["rc", "ra"],
    ["rc", "bob"],
  ]);
  alice.launch();
  bob.launch();
  for (const r of [a, b, c]) r.launch();
  alice.joinChannel(CHANNEL);
  bob.joinChannel(CHANNEL);

  await waitFor(s.world, () => bob.peers().includes(alice.peerID), 90_000);

  alice.send(CHANNEL, "ring test");
  await waitFor(
    s.world,
    () => bob.texts(CHANNEL).includes("ring test"),
    90_000,
  );

  // Well past delivery, so anything circulating has time to show itself.
  await waitFor(s.world, () => false, 30_000);

  // Once each, not "the counter stopped". Announces flow for as long as the
  // mesh is up, so a total that stops growing is a dead mesh. What must hold is
  // that no relay forwards the same packet twice.
  for (const [name, r] of [
    ["ra", a],
    ["rb", b],
    ["rc", c],
  ] as const) {
    s.check(
      `${name} forwarded each packet exactly once`,
      r.seen.relayed === r.seen.relayedIDs.size,
      `relayed=${r.seen.relayed} distinct=${r.seen.relayedIDs.size}`,
    );
  }
  s.check(
    "duplicates were recognised rather than forwarded",
    a.seen.droppedDuplicate +
      b.seen.droppedDuplicate +
      c.seen.droppedDuplicate >
      0,
  );

  s.expectNone("no duplicate text", noDuplicateText([alice, bob], CHANNEL));
  s.expectNone("exactly once", exactlyOnce([alice, bob]));
  s.expectNone("process health", noCrashes([alice, bob]));
  s.assert(true);
});

test("R05 a private message survives a relay it cannot read", async () => {
  // A DM crosses a node holding no keys and arrives readable at the far end.
  const s = (scenario = new Scenario({
    id: "R05",
    title: "the postbox cannot open the envelope",
    seed: 505,
  }));
  const radio = new RadioFabric(s.world);
  const [alice, bob] = phones(s, ["alice", "bob"]);
  const relay = new RelayNode(s.world, { id: "pole" });
  for (const n of [alice, bob]) radio.add(n);
  radio.add(relay);
  s.track(alice, bob);

  radio.setTopology([
    ["alice", "pole"],
    ["bob", "pole"],
  ]);
  alice.launch();
  bob.launch();
  relay.launch();
  alice.joinChannel(CHANNEL);
  bob.joinChannel(CHANNEL);

  // The handshake floods through the relay too, which is half the property.
  const found = await waitFor(
    s.world,
    () => alice.peers().includes(bob.peerID),
    60_000,
  );
  s.check("the handshake path exists through the relay", found);

  const dm = `dm:${bob.peerID}`;
  alice.send(dm, "meet at the north gate");
  const arrived = await waitFor(
    s.world,
    () => bob.texts(`dm:${alice.peerID}`).includes("meet at the north gate"),
    90_000,
  );

  s.check(
    "bob received the private message",
    arrived,
    `relayed=${relay.seen.relayed}`,
  );
  s.check("the relay carried it", relay.seen.relayed > 0);

  s.expectNone("no forged senders", noForgedSenders([alice, bob]));
  s.expectNone("process health", noCrashes([alice, bob]));
  s.assert(true);
});
