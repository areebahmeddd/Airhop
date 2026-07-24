/**
 * @jest-environment node
 */
import { ed25519 } from "@noble/curves/ed25519.js";
import { NoiseHandshake } from "../../crypto/noise-xx";
import {
  decodeNoisePayload,
  decodePrivateMessagePacket,
  encodeNoisePrivateMessage,
  NoisePayloadType,
} from "../../mesh/noise-payload";
import { Flags, PacketType, type Packet } from "../../mesh/packet-codec";
import {
  decodeChannelMsgPayload,
  encodeChannelMsgPayload,
  MessageRouter,
  newMessageId,
  PeerRegistry,
  type RouterIdentity,
} from "../message-router";

function makeIdentity(): RouterIdentity {
  const signingPrivKey = ed25519.utils.randomSecretKey();
  const signingPubKey = ed25519.getPublicKey(signingPrivKey);
  const peerID = Array.from(signingPubKey.slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const noiseStaticPrivKey = ed25519.utils.randomSecretKey();
  return { peerID, signingPrivKey, noiseStaticPrivKey };
}

function makePeerNoiseSession() {
  const iPriv = ed25519.utils.randomSecretKey();
  const rPriv = ed25519.utils.randomSecretKey();

  const initiator = NoiseHandshake.createInitiator(iPriv);
  const responder = NoiseHandshake.createResponder(rPriv);

  responder.readMsg1(initiator.writeMsg1());
  initiator.readMsg2(responder.writeMsg2());
  responder.readMsg3(initiator.writeMsg3());

  return { sessionI: initiator.split(), sessionR: responder.split() };
}

describe("encodeChannelMsgPayload / decodeChannelMsgPayload", () => {
  test("round-trips channel and text", () => {
    const encoded = encodeChannelMsgPayload(
      "#general",
      "hello world",
      "abc123",
    );
    const decoded = decodeChannelMsgPayload(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.channel).toBe("#general");
    expect(decoded!.text).toBe("hello world");
    expect(decoded!.msgId).toBe("abc123");
  });

  test("returns null for empty payload", () => {
    expect(decodeChannelMsgPayload(new Uint8Array(0))).toBeNull();
  });

  test("returns null when channel length exceeds payload", () => {
    const buf = new Uint8Array([100]); // chLen=100 but no data follows
    expect(decodeChannelMsgPayload(buf)).toBeNull();
  });

  test("empty channel and text round-trips", () => {
    const encoded = encodeChannelMsgPayload("", "", "");
    const decoded = decodeChannelMsgPayload(encoded);
    expect(decoded!.channel).toBe("");
    expect(decoded!.text).toBe("");
  });
});

describe("PeerRegistry", () => {
  test("get returns undefined for unknown peer", () => {
    const r = new PeerRegistry();
    expect(r.get("0000000000000000")).toBeUndefined();
  });

  test("update and get works for a fresh peer", () => {
    const r = new PeerRegistry();
    r.update({
      peerID: "aabbccdd00112233",
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "alice",
    });
    const entry = r.get("aabbccdd00112233");
    expect(entry).not.toBeUndefined();
    expect(entry!.nickname).toBe("alice");
  });

  test("isReachable returns true for known peer", () => {
    const r = new PeerRegistry();
    r.update({
      peerID: "aabb",
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "bob",
    });
    expect(r.isReachable("aabb")).toBe(true);
  });

  test("setSession attaches session to peer", () => {
    const r = new PeerRegistry();
    const peerID = "cc00112233445566";
    r.update({
      peerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "charlie",
    });
    const { sessionI } = makePeerNoiseSession();
    r.setSession(peerID, sessionI);
    expect(r.get(peerID)?.session).toBe(sessionI);
  });

  test("evictStale removes nothing for fresh peers", () => {
    const r = new PeerRegistry();
    r.update({
      peerID: "ddee",
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "dave",
    });
    r.evictStale();
    expect(r.size).toBe(1);
  });

  test("isDirect defaults to false when not provided", () => {
    const r = new PeerRegistry();
    r.update({
      peerID: "aabb",
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "alice",
    });
    expect(r.get("aabb")?.isDirect).toBe(false);
  });

  test("markDirect sets isDirect=true on a known peer", () => {
    const r = new PeerRegistry();
    r.update({
      peerID: "aabb",
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "alice",
    });
    r.markDirect("aabb");
    expect(r.get("aabb")?.isDirect).toBe(true);
  });

  test("markIndirect clears isDirect on a known peer", () => {
    const r = new PeerRegistry();
    r.update({
      peerID: "aabb",
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "alice",
      isDirect: true,
    });
    r.markIndirect("aabb");
    expect(r.get("aabb")?.isDirect).toBe(false);
  });
});

describe("MessageRouter", () => {
  test("sendChannelMessage broadcasts a signed CHANNEL_MSG packet", () => {
    const identity = makeIdentity();
    const registry = new PeerRegistry();
    const broadcasts: Packet[] = [];
    const router = new MessageRouter(
      identity,
      registry,
      (p) => broadcasts.push(p),
      () => {},
    );

    router.sendChannelMessage("#test", "hi there", "msg-1");

    expect(broadcasts.length).toBe(1);
    expect(broadcasts[0].type).toBe(PacketType.CHANNEL_MSG);
    expect(broadcasts[0].flags & Flags.SIGNED).toBeTruthy();

    const decoded = decodeChannelMsgPayload(broadcasts[0].payload);
    expect(decoded!.channel).toBe("#test");
    expect(decoded!.text).toBe("hi there");
  });

  test("sendDm returns needs-courier when peer has no session", () => {
    const identity = makeIdentity();
    const registry = new PeerRegistry();
    registry.update({
      peerID: "aabbccdd00112233",
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "alice",
    });
    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      () => {},
    );
    expect(router.sendDm("aabbccdd00112233", "hello", "m0")).toBe(
      "needs-courier",
    );
  });

  test("sendDm sends unicast DM when session is established", () => {
    const identity = makeIdentity();
    const registry = new PeerRegistry();
    const recipientPeerID = "aabbccdd00112233";

    registry.update({
      peerID: recipientPeerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "alice",
    });
    const { sessionI, sessionR } = makePeerNoiseSession();
    registry.setSession(recipientPeerID, sessionI);

    const unicasts: { peerID: string; packet: Packet }[] = [];
    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      (pid, p) => unicasts.push({ peerID: pid, packet: p }),
    );

    const result = router.sendDm(recipientPeerID, "secret", "msg1");
    expect(result).toBe("sent");
    expect(unicasts.length).toBe(1);
    expect(unicasts[0].peerID).toBe(recipientPeerID);
    expect(unicasts[0].packet.type).toBe(PacketType.NOISE_ENCRYPTED);

    // The recipient decrypts to a bitchat NoisePayload private message.
    const decrypted = sessionR.decrypt(unicasts[0].packet.payload);
    const np = decodeNoisePayload(decrypted)!;
    expect(np.type).toBe(NoisePayloadType.PRIVATE_MESSAGE);
    const pm = decodePrivateMessagePacket(np.body)!;
    expect(pm.messageID).toBe("msg1");
    expect(pm.content).toBe("secret");
  });

  test("decryptDm recovers the typed NoisePayload for a known peer", () => {
    const identity = makeIdentity();
    const registry = new PeerRegistry();
    const senderPeerID = "0011223344556677";

    registry.update({
      peerID: senderPeerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "sender",
    });

    const { sessionI, sessionR } = makePeerNoiseSession();
    // Sender uses sessionI to encrypt, receiver uses sessionR to decrypt
    registry.setSession(senderPeerID, sessionR);

    const ciphertext = sessionI.encrypt(
      encodeNoisePrivateMessage("id7", "private message")!,
    );

    const incomingPacket: Packet = {
      type: PacketType.NOISE_ENCRYPTED,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8),
      recipientID: new Uint8Array(8),
      timestamp: 1000,
      signature: new Uint8Array(64),
      payload: ciphertext,
    };

    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      () => {},
    );
    const np = router.decryptDm(incomingPacket, senderPeerID)!;
    expect(np.type).toBe(NoisePayloadType.PRIVATE_MESSAGE);
    expect(decodePrivateMessagePacket(np.body)!.content).toBe(
      "private message",
    );
  });

  test("decryptDm returns null for unknown sender", () => {
    const identity = makeIdentity();
    const registry = new PeerRegistry();
    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      () => {},
    );
    const packet: Packet = {
      type: PacketType.NOISE_ENCRYPTED,
      ttl: 7,
      flags: 0,
      senderID: new Uint8Array(8),
      recipientID: new Uint8Array(8),
      timestamp: 0,
      signature: new Uint8Array(64),
      payload: new Uint8Array(0),
    };
    expect(router.decryptDm(packet, "unknown000000000")).toBeNull();
  });

  test("sendDm returns sent-nostr when Nostr pubkey is known and no BLE session", () => {
    const identity = makeIdentity();
    const registry = new PeerRegistry();
    const recipientPeerID = "aabbccdd00112233";

    registry.update({
      peerID: recipientPeerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "alice",
    });
    registry.setNostrPubkey(
      recipientPeerID,
      "a".repeat(64), // fake secp256k1 hex pubkey
    );

    const nostrSent: { pubkey: string; text: string }[] = [];
    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      () => {},
      async (pubkey, text) => {
        nostrSent.push({ pubkey, text });
      },
    );

    const result = router.sendDm(recipientPeerID, "via nostr", "m0");
    expect(result).toBe("sent-nostr");
  });

  test("sendDm falls back to needs-courier when Nostr pubkey unknown and no BLE session", () => {
    const identity = makeIdentity();
    const registry = new PeerRegistry();
    const recipientPeerID = "bbccddee11223344";

    registry.update({
      peerID: recipientPeerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "bob",
    });
    // No nostrPubkey set, no nostrSend fn injected.
    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      () => {},
    );

    expect(router.sendDm(recipientPeerID, "offline", "m0")).toBe(
      "needs-courier",
    );
  });

  test("sendDm prefers BLE over Nostr even when both are available", () => {
    const identity = makeIdentity();
    const registry = new PeerRegistry();
    const recipientPeerID = "ccddee0011223344";

    registry.update({
      peerID: recipientPeerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "charlie",
    });
    registry.setNostrPubkey(recipientPeerID, "b".repeat(64));
    const { sessionI } = makePeerNoiseSession();
    registry.setSession(recipientPeerID, sessionI);

    const nostrSent: string[] = [];
    const unicasts: Packet[] = [];
    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      (_, p) => unicasts.push(p),
      async (pubkey) => {
        nostrSent.push(pubkey);
      },
    );

    const result = router.sendDm(recipientPeerID, "prefer ble", "m0");
    expect(result).toBe("sent");
    expect(unicasts).toHaveLength(1);
    expect(nostrSent).toHaveLength(0);
  });

  test("setNostrPubkey stores the key and is retrievable", () => {
    const registry = new PeerRegistry();
    const peerID = "1122334455667788";
    registry.update({
      peerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "eve",
    });

    registry.setNostrPubkey(peerID, "c".repeat(64));

    expect(registry.get(peerID)?.nostrPubkey).toBe("c".repeat(64));
  });

  test("update() preserves nostrPubkey across BLE re-announces", () => {
    // BLE ANNOUNCE packets do not carry a nostrPubkey field, so update() is
    // called without one. The previously learned nostrPubkey must survive.
    const registry = new PeerRegistry();
    const peerID = "aabbccdd11223344";

    registry.update({
      peerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "frank",
    });
    registry.setNostrPubkey(peerID, "d".repeat(64));

    // Simulate a second ANNOUNCE with no nostrPubkey field.
    registry.update({
      peerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "frank-v2",
    });

    // nostrPubkey must still be present.
    expect(registry.get(peerID)?.nostrPubkey).toBe("d".repeat(64));
    // Nickname should be updated to reflect the new announce.
    expect(registry.get(peerID)?.nickname).toBe("frank-v2");
  });

  test("sendDm hands the packet to the transport callback, which owns WiFi-vs-BLE", () => {
    // The router no longer has a separate WiFi tier. It emits one unicast and
    // the injected callback (MeshService in production) decides whether that
    // goes over a WiFi link or BLE. Asserting here that exactly one dispatch
    // happens is what stops a second, duplicate WiFi path being reintroduced.
    const identity = makeIdentity();
    const registry = new PeerRegistry();
    const recipientPeerID = "aabbccdd00112233";

    registry.update({
      peerID: recipientPeerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "alice",
    });
    const { sessionI } = makePeerNoiseSession();
    registry.setSession(recipientPeerID, sessionI);

    const unicasts: { peerID: string; packet: Packet }[] = [];
    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      (peerID, p) => unicasts.push({ peerID, packet: p }),
    );

    expect(router.sendDm(recipientPeerID, "hello", "m0")).toBe("sent");
    expect(unicasts).toHaveLength(1);
    expect(unicasts[0].peerID).toBe(recipientPeerID);
    expect(unicasts[0].packet.type).toBe(PacketType.NOISE_ENCRYPTED);
  });

  test("direct transport is skipped entirely when no Noise session exists", () => {
    // Without a session the router cannot encrypt a DM for any direct transport.
    const identity = makeIdentity();
    const registry = new PeerRegistry();
    const recipientPeerID = "ccddee0011223344";

    registry.update({
      peerID: recipientPeerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "carol",
    });
    registry.setNostrPubkey(recipientPeerID, "e".repeat(64));

    const unicasts: string[] = [];
    const nostrSent: string[] = [];
    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      (peerID: string) => {
        unicasts.push(peerID);
      },
      async (pubkey) => {
        nostrSent.push(pubkey);
      },
    );

    const result = router.sendDm(recipientPeerID, "no session", "m0");
    expect(result).toBe("sent-nostr");
    expect(unicasts).toHaveLength(0);
    expect(nostrSent).toHaveLength(1);
  });
});

// Cross-transport message identity.
//
// A location channel sends the same message over BLE *and* Nostr, and the Nostr
// copy is signed with a per-geohash key, so to a receiver the two look like two
// different people saying the same thing. A sender-assigned ID carried on both
// transports is what collapses them into one bubble.
describe("message ID (cross-transport dedupe)", () => {
  test("round-trips the message id alongside channel and text", () => {
    const encoded = encodeChannelMsgPayload("#city", "hello", "deadbeef1234");
    const decoded = decodeChannelMsgPayload(encoded);
    expect(decoded!.msgId).toBe("deadbeef1234");
    expect(decoded!.channel).toBe("#city");
    expect(decoded!.text).toBe("hello");
  });

  test("newMessageId returns 16 lowercase hex chars", () => {
    expect(newMessageId()).toMatch(/^[0-9a-f]{16}$/);
  });

  test("newMessageId is unique across calls", () => {
    const ids = new Set(Array.from({ length: 200 }, () => newMessageId()));
    expect(ids.size).toBe(200);
  });

  test("distinguishes two identical messages sent in the same second", () => {
    // Packet-level dedupe hashes the payload, so without a per-message id the
    // second "ok" would be swallowed as a duplicate packet.
    const a = encodeChannelMsgPayload("#general", "ok", newMessageId());
    const b = encodeChannelMsgPayload("#general", "ok", newMessageId());
    expect(decodeChannelMsgPayload(a)!.msgId).not.toBe(
      decodeChannelMsgPayload(b)!.msgId,
    );
  });

  test("text containing spaces survives the length-prefixed framing", () => {
    const encoded = encodeChannelMsgPayload("#a", "x y z", "id1");
    const decoded = decodeChannelMsgPayload(encoded);
    expect(decoded!.text).toBe("x y z");
    expect(decoded!.msgId).toBe("id1");
  });

  test("returns null when the id length overruns the payload", () => {
    // chLen=1, channel="#", idLen=200 with no data following.
    expect(decodeChannelMsgPayload(new Uint8Array([1, 35, 200]))).toBeNull();
  });
});
