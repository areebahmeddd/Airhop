/**
 * @jest-environment node
 */
import { ed25519 } from "@noble/curves/ed25519.js";
import { NoiseHandshake } from "../../crypto/noise-xx";
import { Flags, PacketType, type Packet } from "../../mesh/packet-codec";
import {
  MessageRouter,
  PeerRegistry,
  decodeChannelMsgPayload,
  encodeChannelMsgPayload,
  type RouterIdentity,
  type WiFiUnicastFn,
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
    const encoded = encodeChannelMsgPayload("#general", "hello world");
    const decoded = decodeChannelMsgPayload(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.channel).toBe("#general");
    expect(decoded!.text).toBe("hello world");
  });

  test("returns null for empty payload", () => {
    expect(decodeChannelMsgPayload(new Uint8Array(0))).toBeNull();
  });

  test("returns null when channel length exceeds payload", () => {
    const buf = new Uint8Array([100]); // chLen=100 but no data follows
    expect(decodeChannelMsgPayload(buf)).toBeNull();
  });

  test("empty channel and text round-trips", () => {
    const encoded = encodeChannelMsgPayload("", "");
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

    router.sendChannelMessage("#test", "hi there");

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
    expect(router.sendDm("aabbccdd00112233", "hello")).toBe("needs-courier");
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

    const unicasts: Array<{ peerID: string; packet: Packet }> = [];
    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      (pid, p) => unicasts.push({ peerID: pid, packet: p }),
    );

    const result = router.sendDm(recipientPeerID, "secret");
    expect(result).toBe("sent");
    expect(unicasts.length).toBe(1);
    expect(unicasts[0].peerID).toBe(recipientPeerID);
    expect(unicasts[0].packet.type).toBe(PacketType.NOISE_ENCRYPTED);

    // The recipient can decrypt with their session
    const decrypted = sessionR.decrypt(unicasts[0].packet.payload);
    expect(new TextDecoder().decode(decrypted)).toBe("secret");
  });

  test("decryptDm recovers plaintext for known peer with session", () => {
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

    const plaintext = new TextEncoder().encode("private message");
    const ciphertext = sessionI.encrypt(plaintext);

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
    const result = router.decryptDm(incomingPacket, senderPeerID);
    expect(result).toBe("private message");
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

    const nostrSent: Array<{ pubkey: string; text: string }> = [];
    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      () => {},
      async (pubkey, text) => {
        nostrSent.push({ pubkey, text });
      },
    );

    const result = router.sendDm(recipientPeerID, "via nostr");
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

    expect(router.sendDm(recipientPeerID, "offline")).toBe("needs-courier");
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

    const result = router.sendDm(recipientPeerID, "prefer ble");
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

  test("sendDm sends via WiFi when wifiUnicast is injected and returns true", () => {
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

    const wifiSent: string[] = [];
    const bleUnicasts: Packet[] = [];
    const wifiUnicast: WiFiUnicastFn = (peerID) => {
      wifiSent.push(peerID);
      return true;
    };

    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      (_, p) => bleUnicasts.push(p),
      undefined,
      wifiUnicast,
    );

    const result = router.sendDm(recipientPeerID, "via wifi");
    expect(result).toBe("sent");
    expect(wifiSent).toHaveLength(1);
    expect(wifiSent[0]).toBe(recipientPeerID);
    // BLE unicast must not be called when WiFi succeeds.
    expect(bleUnicasts).toHaveLength(0);
  });

  test("sendDm falls back to BLE when wifiUnicast returns false", () => {
    const identity = makeIdentity();
    const registry = new PeerRegistry();
    const recipientPeerID = "bbccddee11223344";

    registry.update({
      peerID: recipientPeerID,
      noisePubKey: new Uint8Array(32),
      signingPubKey: new Uint8Array(32),
      nickname: "bob",
    });
    const { sessionI } = makePeerNoiseSession();
    registry.setSession(recipientPeerID, sessionI);

    const bleUnicasts: Packet[] = [];
    const wifiUnicast: WiFiUnicastFn = () => false; // peer not in WiFi range

    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      (_, p) => bleUnicasts.push(p),
      undefined,
      wifiUnicast,
    );

    const result = router.sendDm(recipientPeerID, "fallback ble");
    expect(result).toBe("sent");
    expect(bleUnicasts).toHaveLength(1);
    expect(bleUnicasts[0].type).toBe(PacketType.NOISE_ENCRYPTED);
  });

  test("WiFi tier is skipped entirely when no Noise session exists", () => {
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

    const wifiCalled: string[] = [];
    const nostrSent: string[] = [];
    const router = new MessageRouter(
      identity,
      registry,
      () => {},
      () => {},
      async (pubkey) => {
        nostrSent.push(pubkey);
      },
      (peerID) => {
        wifiCalled.push(peerID);
        return true;
      },
    );

    const result = router.sendDm(recipientPeerID, "no session");
    expect(result).toBe("sent-nostr");
    expect(wifiCalled).toHaveLength(0);
    expect(nostrSent).toHaveLength(1);
  });
});
