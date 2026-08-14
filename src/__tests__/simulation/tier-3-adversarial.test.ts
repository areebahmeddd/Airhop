/**
 * @jest-environment node
 */
// Tier C: somebody in the room is hostile, or the world is.
//
// Everything here is an attack or a failure injected on purpose. The bar is not
// "the app survives" - it is "the app refuses, and tells the user nothing false
// while refusing".

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
  const shim = require("../harness/bridge-shim");
  return { __esModule: true, default: shim.bleBridge };
});
jest.mock("@bridge/NativeAirhopWiFi", () => {
  const shim = require("../harness/bridge-shim");
  return { __esModule: true, default: shim.wifiBridge };
});

import type { Identity } from "@core/crypto/identity";
import {
  ANNOUNCE_TTL,
  encodeAnnouncePayload,
} from "@core/mesh/discovery/announce-manager";
import {
  encodePacket,
  Flags,
  PacketType,
  signPacket,
  type Packet,
} from "@core/mesh/wire/packet-codec";
import {
  channelPacketType,
  encodeAirhopChannelPayload,
  encodeMeshPublicPayload,
  MESH_PUBLIC_CHANNEL,
} from "@core/router/message-router";
import { ed25519 } from "@noble/curves/ed25519.js";
import { SimDevice } from "./harness/device";
import { noCrashes, noForgedSenders } from "./harness/invariants";
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

function peerIdToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// The bridge carries base64, so an injected packet has to be encoded the same
// way the native module would encode it.
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

function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

// A public channel message that CLAIMS to come from `claimedPeerID`.
function forgePublicMessage(opts: {
  claimedPeerID: string;
  channel: string;
  text: string;
  timestamp: number;
  // When set, sign with this key. An attacker holds their own key and never the
  // victim's, so a signature made here can only verify against the claimed
  // peer's registered key in the one case where the caller deliberately passes
  // that peer's real key (scenario C02).
  signWith?: Uint8Array;
}): string {
  const packet: Packet = {
    // The mesh room and a named channel travel under different types, so a
    // forgery aimed at either has to use the right one to be worth testing.
    type: channelPacketType(opts.channel),
    ttl: 7,
    flags: opts.signWith !== undefined ? Flags.SIGNED : 0,
    senderID: peerIdToBytes(opts.claimedPeerID),
    recipientID: new Uint8Array(8),
    timestamp: opts.timestamp,
    signature: new Uint8Array(64),
    payload:
      opts.channel === MESH_PUBLIC_CHANNEL
        ? encodeMeshPublicPayload(opts.text)
        : encodeAirhopChannelPayload(
            opts.channel,
            opts.text,
            `forged-${String(opts.timestamp)}`,
          ),
  };
  if (opts.signWith !== undefined) {
    packet.signature = signPacket(packet, opts.signWith);
  }
  return toBase64(encodePacket(packet));
}

// An ANNOUNCE that claims `claimedPeerID`, carrying whatever key material the
// caller wants bound to it. This is the packet that decides, for every later
// packet, WHICH key a claimed sender is checked against - so getting it wrong
// silently defeats the signature rule that C01 pins.
function forgeAnnounce(opts: {
  claimedPeerID: string;
  noisePubKey: Uint8Array;
  signingPubKey: Uint8Array;
  nickname: string;
  timestamp: number;
  signWith?: Uint8Array;
}): string {
  const payload = encodeAnnouncePayload(
    {
      noiseStaticPubKey: opts.noisePubKey,
      signingPubKey: opts.signingPubKey,
    } as Identity,
    opts.nickname,
  );
  const packet: Packet = {
    type: PacketType.ANNOUNCE,
    ttl: ANNOUNCE_TTL,
    flags: opts.signWith !== undefined ? Flags.SIGNED : 0,
    senderID: peerIdToBytes(opts.claimedPeerID),
    recipientID: new Uint8Array(8),
    timestamp: opts.timestamp,
    signature: new Uint8Array(64),
    payload,
  };
  if (opts.signWith !== undefined) {
    packet.signature = signPacket(packet, opts.signWith);
  }
  return toBase64(encodePacket(packet));
}

test("C08 a forged ANNOUNCE cannot rebind a known peer's signing key", async () => {
  // C01 proves a message is checked against the signing key bound to the peer
  // it claims to be. This proves an attacker cannot choose that key.
  //
  // The attack is one packet upstream of C01 and defeats it completely. A peer
  // ID is the first 16 hex of SHA-256(noise pubkey), and that noise key is
  // broadcast in the clear in every announce - so Mallory can replay Alice's
  // real peer ID and real noise key (both public), attach her OWN signing key,
  // and sign the announce with it. It is internally consistent: the derivation
  // matches and the signature verifies against the key inside the packet.
  // Nothing about it is detectably wrong in isolation.
  //
  // The only thing that stops it is refusing to REPLACE a signing key already
  // bound to that peer. Hence the last assertion, which is the real one: after
  // the attack, genuine traffic from the real Alice must still verify - which
  // it can only do if her original key is still the pinned one.
  const s = (scenario = new Scenario({
    id: "C08",
    title: "announce-level identity hijack",
    seed: 68,
  }));
  const radio = new RadioFabric(s.world);
  const alice = SimDevice.create(s.world, {
    id: "alice",
    platform: "android",
    seedByte: 11,
  });
  const bob = SimDevice.create(s.world, {
    id: "bob",
    platform: "android",
    seedByte: 22,
  });
  const mallory = SimDevice.create(s.world, {
    id: "mallory",
    platform: "android",
    seedByte: 77,
  });
  const cast = [alice, bob, mallory];
  for (const d of cast) radio.add(d);
  s.track(...cast);
  for (const d of cast) d.launch();

  const channel = "#bluetooth";
  await waitFor(s.world, () => bob.peers().includes(alice.peerID), 20_000);
  for (const d of cast) d.joinChannel(channel);

  alice.send(channel, "alice, before the attack");
  const legit = await waitFor(
    s.world,
    () => bob.texts(channel).includes("alice, before the attack"),
    15_000,
  );
  s.check("bob has alice's real signing key bound before the attack", legit);

  // Attack 1: an UNSIGNED announce claiming alice's ID.
  //
  // This used to be accepted outright. Verification ran only `if (SIGNED)`, so
  // clearing the flag meant the sender opted out of being checked and their
  // keys were written to the registry unchallenged.
  radio.injectTo(
    bob.id,
    mallory.id,
    forgeAnnounce({
      claimedPeerID: alice.peerID,
      noisePubKey: alice.identity.noiseStaticPubKey,
      signingPubKey: mallory.identity.signingPubKey,
      nickname: "alice",
      timestamp: s.world.wallClock(),
    }),
  );
  await s.world.advance(2000);

  // Attack 2: a fully self-consistent signed announce - alice's public noise
  // key (so the peer ID derivation checks out), mallory's signing key, signed
  // by mallory. Both the derivation check and the signature check PASS. Only
  // the pin refuses it.
  radio.injectTo(
    bob.id,
    mallory.id,
    forgeAnnounce({
      claimedPeerID: alice.peerID,
      noisePubKey: alice.identity.noiseStaticPubKey,
      signingPubKey: mallory.identity.signingPubKey,
      nickname: "alice",
      timestamp: s.world.wallClock(),
      signWith: mallory.identity.signingPrivKey,
    }),
  );
  await s.world.advance(2000);

  // Attack 3: sender mismatch - claim alice's ID while carrying mallory's own
  // noise key. Rejected because the ID no longer derives from the key.
  radio.injectTo(
    bob.id,
    mallory.id,
    forgeAnnounce({
      claimedPeerID: alice.peerID,
      noisePubKey: mallory.identity.noiseStaticPubKey,
      signingPubKey: mallory.identity.signingPubKey,
      nickname: "alice",
      timestamp: s.world.wallClock(),
      signWith: mallory.identity.signingPrivKey,
    }),
  );
  await s.world.advance(2000);

  // If any of the three had landed, this message would render as alice: it is
  // signed with the key the attacker tried to bind to her ID.
  radio.injectTo(
    bob.id,
    mallory.id,
    forgePublicMessage({
      claimedPeerID: alice.peerID,
      channel,
      text: "alice says: send me your ecash",
      timestamp: s.world.wallClock(),
      signWith: mallory.identity.signingPrivKey,
    }),
  );
  await s.world.advance(2000);
  s.check(
    "a message signed by the key the attacker tried to bind is not displayed",
    !bob.texts(channel).includes("alice says: send me your ecash"),
    `bob thread = [${bob.texts(channel).join(" | ")}]`,
  );

  // The load-bearing assertion. A pin that survived by breaking alice would be
  // no better than the hijack, so the real requirement is that her key is still
  // the bound one and her genuine traffic still verifies.
  alice.send(channel, "alice, after the attack");
  const stillWorks = await waitFor(
    s.world,
    () => bob.texts(channel).includes("alice, after the attack"),
    20_000,
  );
  s.check(
    "the real alice's key survived the attack and her traffic still verifies",
    stillWorks,
    `bob thread = [${bob.texts(channel).join(" | ")}]`,
  );

  s.expectNone("no forged senders", noForgedSenders(cast));
  s.expectNone("process health", noCrashes(cast));
  s.assert();
});

test("C01 a message claiming a trusted peer's ID is refused unless it is signed by them", async () => {
  const s = (scenario = new Scenario({
    id: "C01",
    title: "impersonating a contact on a public channel",
    seed: 66,
  }));
  const radio = new RadioFabric(s.world);
  const alice = SimDevice.create(s.world, {
    id: "alice",
    platform: "android",
    seedByte: 11,
  });
  const bob = SimDevice.create(s.world, {
    id: "bob",
    platform: "android",
    seedByte: 22,
  });
  const mallory = SimDevice.create(s.world, {
    id: "mallory",
    platform: "android",
    seedByte: 77,
  });
  const cast = [alice, bob, mallory];
  for (const d of cast) radio.add(d);
  s.track(...cast);
  for (const d of cast) d.launch();

  const channel = "#bluetooth";
  await waitFor(s.world, () => bob.peers().includes(alice.peerID), 20_000);
  for (const d of cast) d.joinChannel(channel);

  // Establish that bob knows alice and accepts her real traffic, so a later
  // refusal cannot be explained away as "bob was not listening".
  alice.send(channel, "this one is really from alice");
  const legit = await waitFor(
    s.world,
    () => bob.texts(channel).includes("this one is really from alice"),
    15_000,
  );
  s.check("a genuine signed message from a known peer is accepted", legit);

  // Attack 1: no signature at all, claiming alice's peer ID.
  //
  // This is the one that used to work. The old check was `if (SIGNED &&
  // haveKey) verify`, so clearing the signature flag skipped verification
  // entirely and the message rendered as alice.
  radio.injectTo(
    bob.id,
    mallory.id,
    forgePublicMessage({
      claimedPeerID: alice.peerID,
      channel,
      text: "alice says: send me your ecash",
      timestamp: s.world.wallClock(),
    }),
  );
  await s.world.advance(2000);
  s.check(
    "an UNSIGNED message claiming a known peer's ID is not displayed",
    !bob.texts(channel).includes("alice says: send me your ecash"),
    `bob thread = [${bob.texts(channel).join(" | ")}]`,
  );

  // Attack 2: signed, but with mallory's own key rather than alice's.
  radio.injectTo(
    bob.id,
    mallory.id,
    forgePublicMessage({
      claimedPeerID: alice.peerID,
      channel,
      text: "alice says: meet me alone",
      timestamp: s.world.wallClock(),
      signWith: mallory.identity.signingPrivKey,
    }),
  );
  await s.world.advance(2000);
  s.check(
    "a message signed by the WRONG key is not displayed",
    !bob.texts(channel).includes("alice says: meet me alone"),
    `bob thread = [${bob.texts(channel).join(" | ")}]`,
  );

  // Attack 3: a peer nobody has ever heard announce. There is no key to check
  // against, which must read as a failed check rather than a skipped one.
  radio.injectTo(
    bob.id,
    mallory.id,
    forgePublicMessage({
      claimedPeerID: "deadbeefdeadbeef",
      channel,
      text: "from nobody at all",
      timestamp: s.world.wallClock(),
      signWith: mallory.identity.signingPrivKey,
    }),
  );
  await s.world.advance(2000);
  s.check(
    "a message from a peer with no announced signing key is not displayed",
    !bob.texts(channel).includes("from nobody at all"),
    `bob thread = [${bob.texts(channel).join(" | ")}]`,
  );

  s.expectNone("no forged senders", noForgedSenders(cast));
  s.expectNone("process health", noCrashes(cast));
  s.assert();
});

test("C02 the strict signature rule still lets genuine traffic through", async () => {
  // The counterpart to C01. A check that rejects everything would pass C01 and
  // be worthless, so this pins the other side of the boundary.
  const s = (scenario = new Scenario({
    id: "C02",
    title: "a correctly signed packet from a known peer is accepted",
    seed: 67,
  }));
  const radio = new RadioFabric(s.world);
  const alice = SimDevice.create(s.world, {
    id: "alice",
    platform: "android",
    seedByte: 11,
  });
  const bob = SimDevice.create(s.world, {
    id: "bob",
    platform: "android",
    seedByte: 22,
  });
  for (const d of [alice, bob]) radio.add(d);
  s.track(alice, bob);
  for (const d of [alice, bob]) d.launch();

  const channel = "#bluetooth";
  await waitFor(s.world, () => bob.peers().includes(alice.peerID), 20_000);
  for (const d of [alice, bob]) d.joinChannel(channel);

  s.check(
    "the harness is signing with alice's real identity key",
    sameBytes(
      ed25519.getPublicKey(alice.identity.signingPrivKey),
      alice.identity.signingPubKey,
    ),
  );

  radio.injectTo(
    bob.id,
    alice.id,
    forgePublicMessage({
      claimedPeerID: alice.peerID,
      channel,
      text: "genuinely alice",
      timestamp: s.world.wallClock(),
      signWith: alice.identity.signingPrivKey,
    }),
  );
  await s.world.advance(2000);

  s.check(
    "a correctly signed message from a known peer is displayed",
    bob.texts(channel).includes("genuinely alice"),
    `bob thread = [${bob.texts(channel).join(" | ")}]`,
  );
  s.expectNone("process health", noCrashes([alice, bob]));
  s.assert();
});

// A LEAVE says "this peer is gone" and costs nothing to forge for any peer ID
// in earshot. Refusing to act on one is necessary but not sufficient: a relay
// that forwards it anyway spends the room's airtime on a lie and hands the same
// lie to every node downstream, including any that check less strictly.
test("C09 a forged LEAVE is neither acted on nor passed along", async () => {
  const s = (scenario = new Scenario({
    id: "C09",
    title: "forged departure stops at the first honest relay",
    seed: 69,
  }));
  const radio = new RadioFabric(s.world);
  const alice = SimDevice.create(s.world, {
    id: "alice",
    platform: "android",
    seedByte: 11,
  });
  const bob = SimDevice.create(s.world, {
    id: "bob",
    platform: "android",
    seedByte: 22,
  });
  const carol = SimDevice.create(s.world, {
    id: "carol",
    platform: "android",
    seedByte: 33,
  });
  const mallory = SimDevice.create(s.world, {
    id: "mallory",
    platform: "android",
    seedByte: 77,
  });
  const cast = [alice, bob, carol, mallory];
  for (const d of cast) radio.add(d);
  // A line, so anything reaching carol had to be relayed BY bob. Without the
  // third hop there is no way to tell "bob ignored it" from "bob did not
  // forward it", and forwarding is half of what this scenario is about.
  radio.setTopology([
    ["alice", "bob"],
    ["bob", "carol"],
    ["mallory", "bob"],
  ]);
  s.track(...cast);
  for (const d of cast) d.launch();

  const channel = "#bluetooth";
  for (const d of cast) d.joinChannel(channel);
  await waitFor(s.world, () => bob.peers().includes(alice.peerID), 30_000);
  s.check(
    "bob can see alice before the attack",
    bob.peers().includes(alice.peerID),
  );

  const leaveFramesBefore = radio.countOfType(PacketType.LEAVE);

  // Mallory claims alice's peer ID on a LEAVE signed with her own key. The
  // packet is well-formed and self-consistent; it is only wrong about who sent
  // it, which is exactly what the pinned signing key exists to detect.
  const forged: Packet = {
    type: PacketType.LEAVE,
    ttl: 3,
    flags: Flags.SIGNED,
    senderID: peerIdToBytes(alice.peerID),
    recipientID: new Uint8Array(8),
    timestamp: s.world.wallClock(),
    signature: new Uint8Array(64),
    payload: new Uint8Array(0),
  };
  forged.signature = signPacket(forged, mallory.identity.signingPrivKey);
  radio.injectTo(bob.id, mallory.id, toBase64(encodePacket(forged)));
  await s.world.advance(5_000);

  s.check(
    "bob did not evict alice on a forged departure",
    bob.peers().includes(alice.peerID),
    `bob sees [${bob.peers().join(",")}]`,
  );
  s.check(
    "and did not put the forgery back on the air",
    radio.countOfType(PacketType.LEAVE) === leaveFramesBefore,
    `LEAVE frames before=${leaveFramesBefore} after=${radio.countOfType(PacketType.LEAVE)}`,
  );

  // The other half: a real departure must still be honoured, or the rule above
  // is just a way to break presence.
  //
  // Driven through the actual "user goes Away" path rather than an injected
  // packet, because the goodbye has to survive its own shutdown to be worth
  // anything. MeshService.stop() sends the LEAVE before taking the radios
  // down; with those two the other way round the farewell was handed to a
  // transport already told to shut, and a departing peer vanished by timeout
  // instead of by announcement.
  alice.mesh?.stop();
  const noticed = await waitFor(
    s.world,
    () => !bob.peers().includes(alice.peerID),
    20_000,
  );
  s.check(
    "a genuine departure is announced, not waited out",
    noticed,
    `bob sees [${bob.peers().join(",")}]`,
  );

  s.expectNone("no forged senders", noForgedSenders([bob, carol]));
  s.expectNone("process health", noCrashes([bob, carol]));
  s.assert(true);
});
