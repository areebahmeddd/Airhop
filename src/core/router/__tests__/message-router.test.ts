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
  channelPacketType,
  decodeAirhopChannelPayload,
  decodeMeshPublicPayload,
  encodeAirhopChannelPayload,
  encodeMeshPublicPayload,
  MESH_PUBLIC_CHANNEL,
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

describe("public message payloads", () => {
  test("the mesh room goes out under bitchat's type, everything else under ours", () => {
    expect(channelPacketType(MESH_PUBLIC_CHANNEL)).toBe(PacketType.CHANNEL_MSG);
    expect(channelPacketType("#neighborhood")).toBe(
      PacketType.CHANNEL_MSG_AIRHOP,
    );
  });

  test("the mesh room's payload is the text and nothing else", () => {
    const encoded = encodeMeshPublicPayload("hello world");
    expect(encoded).toEqual(new TextEncoder().encode("hello world"));
    expect(decodeMeshPublicPayload(encoded)).toBe("hello world");
  });

  test("a named channel round-trips its channel, text and id", () => {
    const encoded = encodeAirhopChannelPayload(
      "#general",
      "hello world",
      "abc123",
    );
    const decoded = decodeAirhopChannelPayload(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.channel).toBe("#general");
    expect(decoded!.text).toBe("hello world");
    expect(decoded!.msgId).toBe("abc123");
  });

  test("both decoders return null for an empty payload", () => {
    expect(decodeMeshPublicPayload(new Uint8Array(0))).toBeNull();
    expect(decodeAirhopChannelPayload(new Uint8Array(0))).toBeNull();
  });

  test("returns null when channel length exceeds payload", () => {
    // chLen=100 with no data following.
    expect(decodeAirhopChannelPayload(new Uint8Array([100]))).toBeNull();
  });

  test("empty channel and text round-trips", () => {
    const encoded = encodeAirhopChannelPayload("", "", "");
    const decoded = decodeAirhopChannelPayload(encoded);
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

  const GATEWAY = 1 << 2;
  function addPeer(
    r: PeerRegistry,
    peerID: string,
    capabilities?: number,
    isDirect?: boolean,
  ): void {
    r.update({
      peerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: peerID,
      capabilities,
      isDirect,
    });
  }

  test("hasReachableGateway is false when no peer advertises the bit", () => {
    const r = new PeerRegistry();
    addPeer(r, "aabb", 0);
    addPeer(r, "ccdd", 1 << 3); // groups, not gateway
    expect(r.hasReachableGateway()).toBe(false);
    expect(r.firstReachableGateway()).toBeUndefined();
  });

  test("firstReachableGateway finds a peer advertising the gateway bit", () => {
    const r = new PeerRegistry();
    addPeer(r, "aabb", 0);
    addPeer(r, "ccdd", GATEWAY | (1 << 5)); // gateway + vouch
    expect(r.hasReachableGateway()).toBe(true);
    expect(r.firstReachableGateway()?.peerID).toBe("ccdd");
  });

  test("firstReachableGateway prefers a direct gateway over a mesh one", () => {
    const r = new PeerRegistry();
    addPeer(r, "mesh", GATEWAY, false);
    addPeer(r, "direct", GATEWAY, true);
    expect(r.firstReachableGateway()?.peerID).toBe("direct");
  });

  test("capabilities are preserved across a re-announce that omits them", () => {
    const r = new PeerRegistry();
    addPeer(r, "aabb", GATEWAY);
    addPeer(r, "aabb", undefined); // a relayed announce with no capability read
    expect(r.get("aabb")?.capabilities).toBe(GATEWAY);
    expect(r.hasReachableGateway()).toBe(true);
  });

  test("a gateway that turns the bit off stops being reachable", () => {
    const r = new PeerRegistry();
    addPeer(r, "aabb", GATEWAY);
    addPeer(r, "aabb", 0); // explicit empty capabilities clears the bit
    expect(r.hasReachableGateway()).toBe(false);
  });

  const BRIDGE = 1 << 7;
  test("firstReachableBridge finds a peer advertising the bridge bit", () => {
    const r = new PeerRegistry();
    addPeer(r, "aabb", GATEWAY); // gateway only, not a bridge
    addPeer(r, "ccdd", BRIDGE | GATEWAY); // a bridge gateway
    expect(r.hasReachableBridge()).toBe(true);
    expect(r.firstReachableBridge()?.peerID).toBe("ccdd");
    // A gateway-only peer is not a bridge and vice versa.
    expect(r.firstReachableGateway()?.peerID).toBeDefined();
  });

  test("bridge and gateway bits are independent", () => {
    const r = new PeerRegistry();
    addPeer(r, "aabb", BRIDGE); // bridge but NOT gateway
    expect(r.hasReachableBridge()).toBe(true);
    expect(r.hasReachableGateway()).toBe(false);
  });

  test("PeerEntry preserves bridgeGeohash across a re-announce that omits it", () => {
    const r = new PeerRegistry();
    r.update({
      peerID: "aabb",
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "aabb",
      capabilities: BRIDGE,
      bridgeGeohash: "u4pruy",
    });
    r.update({
      peerID: "aabb",
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "aabb",
      capabilities: BRIDGE,
    });
    expect(r.get("aabb")?.bridgeGeohash).toBe("u4pruy");
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
    expect(broadcasts[0].type).toBe(PacketType.CHANNEL_MSG_AIRHOP);
    expect(broadcasts[0].flags & Flags.SIGNED).toBeTruthy();

    const decoded = decodeAirhopChannelPayload(broadcasts[0].payload);
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

  // lastSeenMs is refreshed only by ANNOUNCE, which arrives on a 15-30s jitter.
  // DIRECT_PEER_TTL_MS was 15s, so a peer on a live link spent a third of every
  // cycle hidden by `get()` - and the DM path resolved its session through
  // `get()`. Inbound messages were dropped with no error and no retry, since
  // sendDm had already returned "sent" and the outbox never queued them.
  describe("a direct peer idling between announces", () => {
    const GAP_MS = 30_000; // the announce ceiling, ANNOUNCE_CONNECTED_MAX_MS

    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    function directPeerWithSession(peerID: string) {
      const registry = new PeerRegistry();
      registry.update({
        peerID,
        noisePubKey: new Uint8Array(32),
        signingPubKey: new Uint8Array(32),
        nickname: "alice",
        isDirect: true,
      });
      registry.markDirect(peerID);
      return registry;
    }

    test("stays reachable across a full announce interval", () => {
      const peerID = "aabbccdd00112233";
      const registry = directPeerWithSession(peerID);

      jest.advanceTimersByTime(GAP_MS);

      expect(registry.isReachable(peerID)).toBe(true);
      expect(registry.reachablePeers().map((p) => p.peerID)).toEqual([peerID]);
    });

    test("still decrypts an inbound DM once its announce has aged out", () => {
      const senderPeerID = "0011223344556677";
      const registry = directPeerWithSession(senderPeerID);
      const { sessionI, sessionR } = makePeerNoiseSession();
      registry.setSession(senderPeerID, sessionR);

      const router = new MessageRouter(
        makeIdentity(),
        registry,
        () => {},
        () => {},
      );

      // Well past even the relaxed TTL, so this holds however it is tuned.
      jest.advanceTimersByTime(GAP_MS * 10);
      expect(registry.isReachable(senderPeerID)).toBe(false);

      const packet: Packet = {
        type: PacketType.NOISE_ENCRYPTED,
        ttl: 7,
        flags: Flags.SIGNED,
        senderID: new Uint8Array(8),
        recipientID: new Uint8Array(8),
        timestamp: Date.now(),
        signature: new Uint8Array(64),
        payload: sessionI.encrypt(
          encodeNoisePrivateMessage("m1", "still here")!,
        ),
      };

      const np = router.decryptDm(packet, senderPeerID);
      expect(np).not.toBeNull();
      expect(decodePrivateMessagePacket(np!.body)!.content).toBe("still here");
    });

    test("a decrypted packet counts as liveness, so the conversation stays fresh", () => {
      const senderPeerID = "0011223344556677";
      const registry = directPeerWithSession(senderPeerID);
      const { sessionI, sessionR } = makePeerNoiseSession();
      registry.setSession(senderPeerID, sessionR);

      const router = new MessageRouter(
        makeIdentity(),
        registry,
        () => {},
        () => {},
      );

      jest.advanceTimersByTime(GAP_MS * 10);
      expect(registry.isReachable(senderPeerID)).toBe(false);

      router.decryptDm(
        {
          type: PacketType.NOISE_ENCRYPTED,
          ttl: 7,
          flags: Flags.SIGNED,
          senderID: new Uint8Array(8),
          recipientID: new Uint8Array(8),
          timestamp: Date.now(),
          signature: new Uint8Array(64),
          payload: sessionI.encrypt(encodeNoisePrivateMessage("m1", "hi")!),
        },
        senderPeerID,
      );

      expect(registry.isReachable(senderPeerID)).toBe(true);
    });

    test("a garbled packet does not count as liveness", () => {
      const senderPeerID = "0011223344556677";
      const registry = directPeerWithSession(senderPeerID);
      const { sessionR } = makePeerNoiseSession();
      registry.setSession(senderPeerID, sessionR);

      const router = new MessageRouter(
        makeIdentity(),
        registry,
        () => {},
        () => {},
      );

      jest.advanceTimersByTime(GAP_MS * 10);

      expect(
        router.decryptDm(
          {
            type: PacketType.NOISE_ENCRYPTED,
            ttl: 7,
            flags: Flags.SIGNED,
            senderID: new Uint8Array(8),
            recipientID: new Uint8Array(8),
            timestamp: Date.now(),
            signature: new Uint8Array(64),
            payload: new Uint8Array([1, 2, 3, 4]),
          },
          senderPeerID,
        ),
      ).toBeNull();
      expect(registry.isReachable(senderPeerID)).toBe(false);
    });

    test("still acks a message it just accepted", () => {
      const peerID = "aabbccdd00112233";
      const registry = directPeerWithSession(peerID);
      const { sessionI } = makePeerNoiseSession();
      registry.setSession(peerID, sessionI);

      const unicasts: { peerID: string; packet: Packet }[] = [];
      const router = new MessageRouter(
        makeIdentity(),
        registry,
        () => {},
        (pid, p) => unicasts.push({ peerID: pid, packet: p }),
      );

      jest.advanceTimersByTime(GAP_MS * 10);
      expect(registry.isReachable(peerID)).toBe(false);

      expect(
        router.sendNoiseReceipt(peerID, NoisePayloadType.DELIVERED, "m1"),
      ).toBe(true);
      expect(unicasts.length).toBe(1);
    });

    test("an unknown peer is still refused", () => {
      const registry = new PeerRegistry();
      const router = new MessageRouter(
        makeIdentity(),
        registry,
        () => {},
        () => {},
      );
      expect(registry.sessionFor("unknown000000000")).toBeUndefined();
      expect(
        router.sendNoiseReceipt(
          "unknown000000000",
          NoisePayloadType.DELIVERED,
          "m1",
        ),
      ).toBe(false);
    });
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
    const encoded = encodeAirhopChannelPayload(
      "#city",
      "hello",
      "deadbeef1234",
    );
    const decoded = decodeAirhopChannelPayload(encoded);
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
    const a = encodeAirhopChannelPayload("#general", "ok", newMessageId());
    const b = encodeAirhopChannelPayload("#general", "ok", newMessageId());
    expect(decodeAirhopChannelPayload(a)!.msgId).not.toBe(
      decodeAirhopChannelPayload(b)!.msgId,
    );
  });

  test("text containing spaces survives the length-prefixed framing", () => {
    const encoded = encodeAirhopChannelPayload("#a", "x y z", "id1");
    const decoded = decodeAirhopChannelPayload(encoded);
    expect(decoded!.text).toBe("x y z");
    expect(decoded!.msgId).toBe("id1");
  });

  test("returns null when the id length overruns the payload", () => {
    // chLen=1, channel="#", idLen=200 with no data following.
    expect(decodeAirhopChannelPayload(new Uint8Array([1, 35, 200]))).toBeNull();
  });

  // #bluetooth is bitchat's mesh room. It carries no ID on the wire because
  // bitchat has nowhere to put one; both implementations derive the same
  // content-stable one instead, which is what onChannelMsg keys it on.
  test("the mesh room carries no framing at all", () => {
    const encoded = encodeMeshPublicPayload("hello");
    expect(encoded.length).toBe(5);
    expect(decodeMeshPublicPayload(encoded)).toBe("hello");
  });
});

// ---------------------------------------------------------------------------
// Session-authenticated identity (Noise payload 0x21).
//
// Announced state is a claim: an announce is signed with a key carried inside
// the same announce, so anyone who reads a victim's public Noise key off the
// air can self-sign a consistent announce under that peer ID. Trust-on-first-use
// covers the steady state but loses the race - whoever announces first wins the
// pin, and the real peer can then never correct it.
//
// State that arrives inside a completed Noise session is different in kind: a
// session only completes when the remote static key hashes to the claimed peer
// ID, so it proves possession of the private key. These tests pin the ordering
// that follows: proven beats assumed, and assumed never overwrites proven.
describe("PeerRegistry: authenticated peer state", () => {
  const PEER = "aabbccdd00112233";
  const ANNOUNCED_KEY = new Uint8Array(32).fill(0x11);
  const PROVEN_KEY = new Uint8Array(32).fill(0x22);
  const OTHER_KEY = new Uint8Array(32).fill(0x33);
  const CAP_MEDIA = 1 << 8;

  function withAnnouncedPeer(): PeerRegistry {
    const r = new PeerRegistry();
    r.update({
      peerID: PEER,
      noisePubKey: new Uint8Array(32),
      signingPubKey: ANNOUNCED_KEY,
      nickname: "alice",
      capabilities: CAP_MEDIA,
    });
    return r;
  }

  test("an announced capability is never treated as authenticated", () => {
    const r = withAnnouncedPeer();
    expect(r.get(PEER)!.capabilities).toBe(CAP_MEDIA);
    expect(r.hasAuthenticatedCapability(PEER, CAP_MEDIA)).toBe(false);
  });

  test("a proof inside the session authenticates the capability", () => {
    const r = withAnnouncedPeer();
    expect(r.setAuthenticatedState(PEER, PROVEN_KEY, CAP_MEDIA)).toBe(true);
    expect(r.hasAuthenticatedCapability(PEER, CAP_MEDIA)).toBe(true);
  });

  // The heal. TOFU binds whoever announced first; a proof means possession of
  // the real Noise private key, which no observer can fake.
  test("a proof corrects a trust-on-first-use pin", () => {
    const r = withAnnouncedPeer();
    r.setAuthenticatedState(PEER, PROVEN_KEY, CAP_MEDIA);
    expect(Array.from(r.get(PEER)!.signingPubKey)).toEqual(
      Array.from(PROVEN_KEY),
    );
    expect(r.get(PEER)!.signingKeyAuthenticated).toBe(true);
  });

  // The reverse must never happen, or the next announce silently reduces a
  // proof back to a claim.
  test("a later announce cannot replace a proven key", () => {
    const r = withAnnouncedPeer();
    r.setAuthenticatedState(PEER, PROVEN_KEY, CAP_MEDIA);
    r.update({
      peerID: PEER,
      noisePubKey: new Uint8Array(32),
      signingPubKey: OTHER_KEY,
      nickname: "alice",
    });
    expect(Array.from(r.get(PEER)!.signingPubKey)).toEqual(
      Array.from(PROVEN_KEY),
    );
  });

  test("a later announce cannot clear an authenticated capability", () => {
    const r = withAnnouncedPeer();
    r.setAuthenticatedState(PEER, PROVEN_KEY, CAP_MEDIA);
    r.update({
      peerID: PEER,
      noisePubKey: new Uint8Array(32),
      signingPubKey: PROVEN_KEY,
      nickname: "alice",
      capabilities: 0,
    });
    expect(r.hasAuthenticatedCapability(PEER, CAP_MEDIA)).toBe(true);
    expect(r.get(PEER)!.signingKeyAuthenticated).toBe(true);
  });

  // Two different proven keys for one peer ID cannot both be real. The first
  // stands, and the caller is told so it can stop trusting the second session.
  test("a second, different proof is refused", () => {
    const r = withAnnouncedPeer();
    r.setAuthenticatedState(PEER, PROVEN_KEY, CAP_MEDIA);
    expect(r.setAuthenticatedState(PEER, OTHER_KEY, CAP_MEDIA)).toBe(false);
    expect(Array.from(r.get(PEER)!.signingPubKey)).toEqual(
      Array.from(PROVEN_KEY),
    );
  });

  test("repeating the same proof is accepted and updates capabilities", () => {
    const r = withAnnouncedPeer();
    r.setAuthenticatedState(PEER, PROVEN_KEY, 0);
    expect(r.setAuthenticatedState(PEER, PROVEN_KEY, CAP_MEDIA)).toBe(true);
    expect(r.hasAuthenticatedCapability(PEER, CAP_MEDIA)).toBe(true);
  });

  test("an unknown peer neither throws nor invents an entry", () => {
    const r = new PeerRegistry();
    expect(r.setAuthenticatedState("ffffffffffffffff", PROVEN_KEY, 0)).toBe(
      true,
    );
    expect(r.get("ffffffffffffffff")).toBeUndefined();
  });
});
