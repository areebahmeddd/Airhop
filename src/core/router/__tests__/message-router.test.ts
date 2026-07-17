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
      nonce: new Uint8Array(8),
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
      nonce: new Uint8Array(8),
      signature: new Uint8Array(64),
      payload: new Uint8Array(0),
    };
    expect(router.decryptDm(packet, "unknown000000000")).toBeNull();
  });
});
