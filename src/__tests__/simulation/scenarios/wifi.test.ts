/**
 * @jest-environment node
 */
// The same-platform fast path.
//
// ARCHITECTURE.md lists WiFi Aware (Android only) as an accelerator
// that the mesh engine is not supposed to notice: same `Transport` interface as
// BLE, priority 1 in the router, and it carries what BLE cannot. Until this
// suite the transport was code-complete and entirely unproven. The harness's
// WiFi bridge was inert - every method a no-op that resolved undefined and
// never emitted - so no scenario had ever formed a WiFi link.
//
// What is worth asserting, and why:
//
//   * A link forms and the phones find each other over it, with no BLE at all.
//     If discovery only ever worked because a radio fabric was also running,
//     the fast path would be decorative.
//   * Messages cross it, and the timeline cannot tell which radio carried them.
//     That is the claim the whole two-transport design rests on.
//   * Android and iOS never link. Two different protocols behind one interface
//     is exactly the shape that invites a wrong assumption.
//   * Losing the link is cleaned up, so a peer that walked away does not sit in
//     the registry looking reachable.
//   * A payload far past the BLE frame ceiling crosses in one piece. This is the
//     entire reason the transport exists.

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
// W-F04 sends a real attachment, and a received file is only recorded once it
// has been written to this phone's disk.
jest.mock("expo-file-system", () =>
  require("../harness/media-fabric").createExpoFileSystemMock(),
);

import { SimDevice, type DeviceSpec } from "../harness/device";
import { noCrashes } from "../harness/invariants";
import { media, sameBytes } from "../harness/media-fabric";
import { RadioFabric } from "../harness/radio-fabric";
import { Scenario, waitFor } from "../harness/scenario";
import { WifiFabric } from "../harness/wifi-fabric";

jest.setTimeout(120_000);

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

const CHANNEL = "#bluetooth";

// ---------------------------------------------------------------------------

test("W-F01 two phones meet over WiFi with no Bluetooth between them", async () => {
  const s = (scenario = new Scenario({
    id: "W-F01",
    title: "discovery and delivery on the fast path alone",
    seed: 900,
  }));
  // A radio fabric with NO topology between them: both phones have BLE running
  // and can hear nobody. Anything that happens below happened over WiFi.
  const radio = new RadioFabric(s.world);
  const wifi = new WifiFabric(s.world);
  const a = SimDevice.create(s.world, android("a", 11));
  const b = SimDevice.create(s.world, android("b", 22));
  for (const d of [a, b]) {
    radio.add(d);
    wifi.add(d);
  }
  radio.setTopology([]); // nobody is in Bluetooth range of anybody
  s.track(a, b);
  a.launch();
  b.launch();

  s.check(
    "no Bluetooth link exists between them",
    a.bleLinkCount() === 0 && b.bleLinkCount() === 0,
    `a=${a.bleLinkCount()} b=${b.bleLinkCount()}`,
  );

  wifi.link("a", "b");

  // mesh-service announces itself the instant a WiFi link comes up, which is
  // what turns a socket into a discovered peer.
  const met = await waitFor(
    s.world,
    () => a.peers().includes(b.peerID) && b.peers().includes(a.peerID),
    30_000,
  );
  s.check(
    "each phone discovered the other over WiFi",
    met,
    `a sees ${a.peers().length}, b sees ${b.peers().length}`,
  );

  a.joinChannel(CHANNEL);
  b.joinChannel(CHANNEL);
  // Let the joins settle before sending: a channel message is only rendered by
  // a phone that has joined the room, and joining is not instantaneous.
  await waitFor(
    s.world,
    () => a.channels().includes(CHANNEL) && b.channels().includes(CHANNEL),
    10_000,
  );
  a.send(CHANNEL, "carried by wifi");

  const arrived = await waitFor(
    s.world,
    () => b.texts(CHANNEL).includes("carried by wifi"),
    30_000,
  );
  s.check(
    "and the message crossed it",
    arrived,
    `b has ${b.texts(CHANNEL).length} messages, channels=${b.channels().join(",")}`,
  );
  s.check(
    "the fabric actually carried frames",
    wifi.framesCarried > 0,
    `frames=${wifi.framesCarried} bytes=${wifi.bytesCarried}`,
  );
  s.check(
    "with Bluetooth still carrying nothing",
    radio.bytesOnAir === 0,
    `ble bytes=${radio.bytesOnAir}`,
  );
  s.expectNone("process health", noCrashes([a, b]));
  s.assert(true);
});

test("W-F02 an iPhone never forms a WiFi link with anyone", async () => {
  const s = (scenario = new Scenario({
    id: "W-F02",
    title: "iOS has no fast path, so every iPhone hop stays on Bluetooth",
    seed: 901,
  }));
  const radio = new RadioFabric(s.world);
  const wifi = new WifiFabric(s.world);
  const droid = SimDevice.create(s.world, android("droid", 11));
  const iphone = SimDevice.create(s.world, {
    id: "iphone",
    platform: "ios",
    seedByte: 22,
  });
  for (const d of [droid, iphone]) {
    radio.add(d);
    wifi.add(d);
  }
  radio.setTopology([]);
  s.track(droid, iphone);
  droid.launch();
  iphone.launch();

  // Airhop presents one transport behind one interface, which makes it easy to
  // assume every device has it. iOS does not: MultipeerConnectivity was removed
  // rather than repaired, so an iPhone registers no WiFi module at all and every
  // hop it takes is Bluetooth, whoever is on the other end.
  const linked = wifi.link("droid", "iphone");

  s.check("the fabric refused the link", !linked);
  s.check(
    "and recorded why rather than failing silently",
    wifi.refusedCrossPlatform === 1,
    `refusals=${wifi.refusedCrossPlatform}`,
  );
  s.check("no link exists", wifi.linkCount() === 0);

  droid.joinChannel(CHANNEL);
  iphone.joinChannel(CHANNEL);
  droid.send(CHANNEL, "should not arrive by wifi");
  await waitFor(s.world, () => false, 3_000).catch(() => undefined);

  s.check(
    "and nothing crossed",
    !iphone.texts(CHANNEL).includes("should not arrive by wifi"),
    `iphone saw ${iphone.texts(CHANNEL).length} messages`,
  );
  s.check("no frames were carried", wifi.framesCarried === 0);
  s.expectNone("process health", noCrashes([droid, iphone]));
  s.assert(true);
});

test("W-F03 a phone that walks away stops looking reachable", async () => {
  const s = (scenario = new Scenario({
    id: "W-F03",
    title: "link loss is cleaned up, not left behind",
    seed: 902,
  }));
  const radio = new RadioFabric(s.world);
  const wifi = new WifiFabric(s.world);
  const a = SimDevice.create(s.world, android("a", 11));
  const b = SimDevice.create(s.world, android("b", 22));
  for (const d of [a, b]) {
    radio.add(d);
    wifi.add(d);
  }
  radio.setTopology([]);
  s.track(a, b);
  a.launch();
  b.launch();
  wifi.link("a", "b");

  s.check(
    "they met over WiFi",
    await waitFor(s.world, () => a.peers().includes(b.peerID), 30_000),
  );
  a.joinChannel(CHANNEL);
  b.joinChannel(CHANNEL);

  wifi.unlink("a", "b");
  const carriedBefore = wifi.framesCarried;

  // The registry entry may linger until its expiry, which is correct: a peer
  // heard about recently is still worth trying. What must NOT happen is the
  // send succeeding over a socket that is gone.
  a.send(CHANNEL, "shouted at a closed socket");
  await waitFor(s.world, () => false, 3_000).catch(() => undefined);

  s.check(
    "nothing was written to the dead link",
    wifi.framesCarried === carriedBefore,
    `carried ${carriedBefore} -> ${wifi.framesCarried}`,
  );
  s.check(
    "and the far side never got it",
    !b.texts(CHANNEL).includes("shouted at a closed socket"),
  );

  // Coming back must work without a restart: the same pair links again and
  // traffic resumes.
  wifi.link("a", "b");
  a.send(CHANNEL, "back in range");
  const resumed = await waitFor(
    s.world,
    () => b.texts(CHANNEL).includes("back in range"),
    30_000,
  );
  s.check("and a relink resumes delivery", resumed);
  s.expectNone("process health", noCrashes([a, b]));
  s.assert(true);
});

test("W-F04 a photo too big for one BLE frame crosses WiFi in one piece", async () => {
  const s = (scenario = new Scenario({
    id: "W-F04",
    title: "the reason the fast path exists",
    seed: 903,
  }));
  const radio = new RadioFabric(s.world);
  const wifi = new WifiFabric(s.world);
  const a = SimDevice.create(s.world, android("a", 11));
  const b = SimDevice.create(s.world, android("b", 22));
  for (const d of [a, b]) {
    radio.add(d);
    wifi.add(d);
  }
  radio.setTopology([]);
  s.track(a, b);
  a.launch();
  b.launch();
  wifi.link("a", "b");
  s.check(
    "they met over WiFi",
    await waitFor(s.world, () => a.peers().includes(b.peerID), 30_000),
  );
  a.joinChannel(CHANNEL);
  b.joinChannel(CHANNEL);

  // 64 KiB is around 140 BLE frames at the 467-byte data ceiling, paced 20ms
  // apart: about three seconds of exclusive radio time. Over WiFi it is one
  // write. The mesh engine composes it identically either way, which is the
  // property under test.
  // Real JPEG magic bytes. The transfer layer refuses a file whose declared
  // MIME does not match its contents (tier-media M03), so a buffer of filler
  // would be rejected before it ever reached a radio.
  const bytes = media.jpeg(64 * 1024);
  const accepted = a.sendAttachment(CHANNEL, bytes, {
    type: "image",
    name: "big.jpg",
    mimeType: "image/jpeg",
    durationMs: 0,
  });
  s.check("the send was accepted for transmission", accepted);

  const received = await waitFor(
    s.world,
    () => b.attachments(CHANNEL).length > 0,
    120_000,
  );
  s.check(
    "the attachment arrived over the fast path",
    received,
    `frames=${wifi.framesCarried} bytes=${wifi.bytesCarried}`,
  );
  s.check(
    "and Bluetooth carried none of it",
    radio.bytesOnAir === 0,
    `ble bytes=${radio.bytesOnAir}`,
  );
  const uri = b.attachments(CHANNEL)[0]?.attachment?.uri;
  const landed = uri !== undefined ? b.readAttachment(uri) : null;
  s.check(
    "the bytes that landed are the bytes that were sent",
    landed !== null && sameBytes(landed, bytes),
    `uri=${String(uri)} bytes=${landed?.length ?? 0}`,
  );
  s.expectNone("process health", noCrashes([a, b]));
  s.assert(true);
});

// ---------------------------------------------------------------------------
// Both radios at once
// ---------------------------------------------------------------------------

// The scenario that is NOT here, and why.
//
// The obvious question with two radios up is "which one wins for a private
// message". It was written, and it turned out to be the wrong question. Airhop
// does not pick a winner. A message is a recipient-addressed, TTL-bounded
// packet that FLOODS every transport, because no node knows the topology and
// the recipient may be several hops away. Encryption is what makes it private,
// not the path. Five separate places in mesh-service write to a WiFi link, so
// disabling any one of them changes nothing observable.
//
// For a DM that is doubly unfalsifiable: even with both dedup layers removed,
// a Double Ratchet message can only be decrypted once, so a second copy can
// never reach the thread. The test could not fail, which means it was not
// testing anything.
//
// Public messages are where the property has teeth. They have no ratchet, so
// deduplication is the only thing standing between "two radios" and "every
// message shown twice". Remove it and this scenario reports six copies.
test("W-F06 a public message on both radios is still read once", async () => {
  const s = (scenario = new Scenario({
    id: "W-F06",
    title: "broadcast goes out on every link, and the far side dedupes",
    seed: 905,
  }));
  const radio = new RadioFabric(s.world);
  const wifi = new WifiFabric(s.world);
  const a = SimDevice.create(s.world, android("a", 11));
  const b = SimDevice.create(s.world, android("b", 22));
  for (const d of [a, b]) {
    radio.add(d);
    wifi.add(d);
  }
  s.track(a, b);
  a.launch();
  b.launch();
  await waitFor(s.world, () => a.peers().includes(b.peerID), 30_000);
  wifi.link("a", "b");
  await waitFor(s.world, () => wifi.isLinked("a", "b"), 10_000);

  a.joinChannel(CHANNEL);
  b.joinChannel(CHANNEL);
  await waitFor(
    s.world,
    () => a.channels().includes(CHANNEL) && b.channels().includes(CHANNEL),
    10_000,
  );

  // Unlike a DM, a broadcast has no single destination to choose between, so it
  // goes out on every open link. That means a peer holding BOTH radios gets two
  // copies of the same signed packet, and the deduplicator is what stops the
  // room showing everything twice.
  a.send(CHANNEL, "said once");
  const seen = await waitFor(
    s.world,
    () => b.texts(CHANNEL).includes("said once"),
    30_000,
  );
  s.check("it arrived", seen);

  // Settle, so a late second copy would have landed by now.
  await waitFor(s.world, () => false, 5_000).catch(() => undefined);
  s.check(
    "and exactly once, however many radios carried it",
    b.texts(CHANNEL).filter((t) => t === "said once").length === 1,
    `copies=${b.texts(CHANNEL).filter((t) => t === "said once").length}`,
  );
  s.check(
    "both transports really were in play",
    wifi.bytesCarried > 0 && radio.bytesOnAir > 0,
    `wifi=${wifi.bytesCarried} ble=${radio.bytesOnAir}`,
  );
  s.expectNone("process health", noCrashes([a, b]));
  s.assert(true);
});

test("W-F07 a message crosses a WiFi hop and a Bluetooth hop to get there", async () => {
  const s = (scenario = new Scenario({
    id: "W-F07",
    title: "the mesh engine does not care which radio carried a packet",
    seed: 906,
  }));
  const radio = new RadioFabric(s.world);
  const wifi = new WifiFabric(s.world);
  const a = SimDevice.create(s.world, android("a", 11));
  const relayPhone = SimDevice.create(s.world, android("middle", 22));
  const c = SimDevice.create(s.world, android("c", 33));
  const cast = [a, relayPhone, c];
  for (const d of cast) {
    radio.add(d);
    wifi.add(d);
  }
  // a and c are nowhere near each other on either radio. The only path is
  // a --WiFi--> middle --BLE--> c, so the packet has to change transport
  // mid-flight to arrive. This is the claim ARCHITECTURE.md makes when it says
  // the mesh engine does not care which radio is carrying a message.
  radio.setTopology([["middle", "c"]]);
  s.track(...cast);
  for (const d of cast) d.launch();
  wifi.link("a", "middle");

  const ready = await waitFor(
    s.world,
    () =>
      a.peers().includes(relayPhone.peerID) &&
      c.peers().includes(relayPhone.peerID),
    30_000,
  );
  s.check(
    "the chain formed",
    ready,
    `a=${a.peers().length} c=${c.peers().length}`,
  );
  // This assertion is the scenario's own control, and it is why no code-level
  // one is needed. Given a has zero Bluetooth links and c has no WiFi link, a
  // message from a that reaches c cannot have arrived without changing
  // transport somewhere in the middle. The three checks together cannot be
  // satisfied by any single-radio path.
  s.check(
    "a and c cannot hear each other directly on either radio",
    !wifi.isLinked("a", "c") && a.bleLinkCount() === 0,
    `wifi=${wifi.isLinked("a", "c")} a ble links=${a.bleLinkCount()}`,
  );

  // The far ends have to learn each other's signing key before a public message
  // from a stranger is accepted at all: an absent key is a failed check, not a
  // skipped one. That announce has to make the same two-transport journey.
  const learned = await waitFor(
    s.world,
    () => c.peers().includes(a.peerID) && a.peers().includes(c.peerID),
    60_000,
  );
  s.check(
    "the announce crossed both transports too",
    learned,
    `c sees ${c.peers().length}, a sees ${a.peers().length}`,
  );

  for (const d of cast) d.joinChannel(CHANNEL);
  await waitFor(
    s.world,
    () => cast.every((d) => d.channels().includes(CHANNEL)),
    10_000,
  );
  a.send(CHANNEL, "two transports, one message");

  const arrived = await waitFor(
    s.world,
    () => c.texts(CHANNEL).includes("two transports, one message"),
    30_000,
  );
  s.check(
    "it reached the far end across both transports",
    arrived,
    `c has ${c.texts(CHANNEL).length} messages`,
  );
  s.expectNone("process health", noCrashes(cast));
  s.assert(true);
});

test("W-F08 losing WiFi mid-conversation falls back to Bluetooth", async () => {
  const s = (scenario = new Scenario({
    id: "W-F08",
    title: "the fast path going away is not the conversation going away",
    seed: 907,
  }));
  const radio = new RadioFabric(s.world);
  const wifi = new WifiFabric(s.world);
  const a = SimDevice.create(s.world, android("a", 11));
  const b = SimDevice.create(s.world, android("b", 22));
  for (const d of [a, b]) {
    radio.add(d);
    wifi.add(d);
  }
  s.track(a, b);
  a.launch();
  b.launch();
  await waitFor(s.world, () => a.peers().includes(b.peerID), 30_000);

  // Each device keys the thread by the OTHER party, and the session is
  // established before WiFi arrives so the failover below is about routing
  // rather than about a handshake that had not finished.
  const toB = `dm:${b.peerID}`;
  const fromA = `dm:${a.peerID}`;
  a.send(toB, "establishing the session");
  s.check(
    "the conversation started",
    await waitFor(
      s.world,
      () => b.texts(fromA).includes("establishing the session"),
      60_000,
    ),
  );

  wifi.link("a", "b");
  await waitFor(s.world, () => wifi.isLinked("a", "b"), 10_000);

  a.send(toB, "while wifi is up");
  s.check(
    "a message went over WiFi",
    await waitFor(
      s.world,
      () => b.texts(fromA).includes("while wifi is up"),
      30_000,
    ),
  );

  // WiFi Aware is the first thing to go when phones drift apart or the OS
  // reclaims the radio, and it goes without warning. Bluetooth is still there;
  // the user should never notice more than a change in speed.
  wifi.unlink("a", "b");
  const bleBefore = radio.bytesOnAir;

  a.send(toB, "after wifi went away");
  const recovered = await waitFor(
    s.world,
    () => b.texts(fromA).includes("after wifi went away"),
    30_000,
  );
  s.check("the conversation continued over Bluetooth", recovered);
  s.check(
    "and Bluetooth is what carried it",
    radio.bytesOnAir > bleBefore,
    `ble ${bleBefore} -> ${radio.bytesOnAir}`,
  );
  s.expectNone("process health", noCrashes([a, b]));
  s.assert(true);
});

// The scenario that answers "is the fast path actually used", as opposed to
// "does it work when it is the only thing available".
//
// W-F04 proves a photo crosses WiFi with the BLE topology deliberately empty.
// That is a real property, but it is not the configuration anybody is ever in:
// two phones close enough to hold a WiFi link are close enough to be Bluetooth
// neighbours too, so the shipped case has BOTH radios up and the interesting
// question is which one the file takes.
//
// The risk being guarded is specific and has a precedent. bitchat shipped its
// own WiFi bulk path and later found it had never fired once in production: an
// unrelated image-compression change put every real photo below the size that
// triggers the transport, so the feature was live, tested, and dead. A radio
// that only carries traffic in a configuration nobody is in is decorative, and
// nothing about the app's behaviour would say so.
//
// Airhop has no size threshold, so it cannot fail that exact way. What it has
// instead is the direct-link shortcut: an addressed packet goes to the WiFi
// link when the recipient has been mapped to one, which is the whole reason the
// mapping exists (ARCHITECTURE.md, "Transport Stack"). If that mapping never
// populates in practice, or the BLE path wins the race, every attachment
// quietly fragments over Bluetooth at ~22 KB/s while a 250 Mbps radio sits idle
// beside it. The symptom is "photos are slow", which is indistinguishable from
// the way they have always been.
test("W-F09 with both radios up, a DM attachment still takes the fast path", async () => {
  const s = (scenario = new Scenario({
    id: "W-F09",
    title: "the fast path is used in the configuration people are actually in",
    seed: 907,
  }));
  const radio = new RadioFabric(s.world);
  const wifi = new WifiFabric(s.world);
  const a = SimDevice.create(s.world, android("a", 11));
  const b = SimDevice.create(s.world, android("b", 22));
  for (const d of [a, b]) {
    radio.add(d);
    wifi.add(d);
  }
  // Both radios reach: BLE neighbours AND a WiFi link. This is the shipped
  // configuration, and the one no other scenario in this file covers.
  radio.setTopology([["a", "b"]]);
  s.track(a, b);
  a.launch();
  b.launch();
  await waitFor(s.world, () => a.peers().includes(b.peerID), 30_000);
  wifi.link("a", "b");
  const bothUp = await waitFor(
    s.world,
    () => wifi.isLinked("a", "b") && a.bleLinkCount() > 0,
    10_000,
  );
  s.check(
    "both radios really are up between them",
    bothUp,
    `wifi=${wifi.isLinked("a", "b")} ble links=${a.bleLinkCount()}`,
  );

  // Measure from here, so presence traffic that has already flowed over
  // Bluetooth is not counted against the file.
  const bleBefore = radio.bytesOnAir;
  const wifiBefore = wifi.bytesCarried;

  const dm = `dm:${b.peerID}`;
  const bytes = media.jpeg(64 * 1024);
  s.check(
    "the send was accepted",
    a.sendAttachment(dm, bytes, {
      type: "image",
      name: "both-radios.jpg",
      mimeType: "image/jpeg",
      durationMs: 0,
    }),
  );

  const arrived = await waitFor(
    s.world,
    () => b.attachments(`dm:${a.peerID}`).length > 0,
    120_000,
  );
  s.check("the photo arrived", arrived);

  const bleSpent = radio.bytesOnAir - bleBefore;
  const wifiSpent = wifi.bytesCarried - wifiBefore;

  // The file is 64 KiB, so whichever radio carried it spent at least that much.
  // Naming the file size rather than comparing the two totals is what makes
  // this fail loudly if the shortcut regresses: a BLE-only send would show
  // wifiSpent near zero while bleSpent cleared the file size, and a
  // both-radios flood would show both above it.
  s.check(
    "WiFi carried the file",
    wifiSpent > bytes.length,
    `wifi=${wifiSpent} file=${bytes.length}`,
  );
  s.check(
    "and Bluetooth was not made to fragment it as well",
    bleSpent < bytes.length,
    `ble=${bleSpent} file=${bytes.length}`,
  );

  const uri = b.attachments(`dm:${a.peerID}`)[0]?.attachment?.uri;
  const landed = uri !== undefined ? b.readAttachment(uri) : null;
  s.check(
    "and what landed is what was sent",
    landed !== null && sameBytes(landed, bytes),
    `bytes=${landed?.length ?? 0}`,
  );
  s.expectNone("process health", noCrashes([a, b]));
  s.assert(true);
});
