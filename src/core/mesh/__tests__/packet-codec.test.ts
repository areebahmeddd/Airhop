/**
 * @jest-environment node
 */
// Wire-format tests for the bitchat-compatible binary codec. These lock in
// byte-level behavior that must match bitchat iOS/Android: v1 + v2 headers,
// PKCS#7 padding, raw-DEFLATE compression, and signing over the padded encoding.
import { ed25519 } from "@noble/curves/ed25519.js";
import {
  BROADCAST_ID,
  computePacketId,
  decodePacket,
  encodePacket,
  Flags,
  isBroadcast,
  isForMe,
  PacketType,
  signPacket,
  verifyPacket,
  type Packet,
} from "../packet-codec";

function makePacket(overrides: Partial<Packet> = {}): Packet {
  return {
    type: PacketType.ANNOUNCE,
    ttl: 7,
    flags: Flags.SIGNED,
    senderID: new Uint8Array([0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88]),
    recipientID: new Uint8Array(8),
    timestamp: 1_700_000_000_000, // milliseconds, per bitchat
    signature: new Uint8Array(64),
    payload: new TextEncoder().encode("hello"),
    ...overrides,
  };
}

describe("packet-codec", () => {
  describe("encode/decode round-trip", () => {
    it("round-trips a broadcast packet, preserving every field", () => {
      const p = makePacket();
      const decoded = decodePacket(encodePacket(p));
      expect(decoded).not.toBeNull();
      expect(decoded!.type).toBe(PacketType.ANNOUNCE);
      expect(decoded!.ttl).toBe(7);
      expect(Array.from(decoded!.senderID)).toEqual(Array.from(p.senderID));
      expect(Array.from(decoded!.recipientID)).toEqual(
        Array.from(BROADCAST_ID),
      );
      expect(decoded!.timestamp).toBe(1_700_000_000_000);
      expect(new TextDecoder().decode(decoded!.payload)).toBe("hello");
    });

    it("round-trips a unicast packet with a recipient", () => {
      const p = makePacket({
        flags: Flags.SIGNED | Flags.HAS_RECIPIENT,
        recipientID: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
      });
      const decoded = decodePacket(encodePacket(p));
      expect(Array.from(decoded!.recipientID)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8,
      ]);
      expect(isBroadcast(decoded!)).toBe(false);
    });

    it("emits v2 by default and reads the version back", () => {
      const encoded = encodePacket(makePacket());
      expect(encoded[0]).toBe(2);
      expect(decodePacket(encoded)!.version).toBe(2);
    });

    it("round-trips a v1 packet (bitchat's broadcast header)", () => {
      const p = makePacket({ version: 1 });
      const encoded = encodePacket(p);
      expect(encoded[0]).toBe(1);
      const decoded = decodePacket(encoded);
      expect(decoded!.version).toBe(1);
      expect(new TextDecoder().decode(decoded!.payload)).toBe("hello");
    });

    it("type at [1], ttl at [2], flags at [11]", () => {
      const encoded = encodePacket(
        makePacket({ type: PacketType.CHANNEL_MSG, ttl: 5, flags: 0 }),
      );
      expect(encoded[1]).toBe(PacketType.CHANNEL_MSG);
      expect(encoded[2]).toBe(5);
      // Broadcast, unsigned, uncompressed -> flags byte is 0.
      expect(encoded[11]).toBe(0);
    });

    it("pads the frame to a PKCS#7 block size", () => {
      // A tiny broadcast (16+8+4 = 28 bytes) pads up to the 256 block.
      const encoded = encodePacket(
        makePacket({
          payload: new Uint8Array([0xde, 0xad, 0xbe, 0xef]),
          flags: 0,
        }),
      );
      expect(encoded.length).toBe(256);
      // Payload still sits right after header(16) + senderID(8).
      expect(Array.from(encoded.slice(24, 28))).toEqual([
        0xde, 0xad, 0xbe, 0xef,
      ]);
      expect(new TextDecoder().decode(decodePacket(encoded)!.payload)).toBe(
        new TextDecoder().decode(new Uint8Array([0xde, 0xad, 0xbe, 0xef])),
      );
    });

    it("a large u64 (ms) timestamp survives the round-trip", () => {
      const ts = 4_102_444_800_000; // year 2100 in ms, > 2^32
      expect(
        decodePacket(encodePacket(makePacket({ timestamp: ts })))!.timestamp,
      ).toBe(ts);
    });

    it("returns null for a too-short buffer", () => {
      expect(decodePacket(new Uint8Array(15))).toBeNull();
    });

    it("returns null for an unsupported version", () => {
      const buf = new Uint8Array(96);
      buf[0] = 3;
      expect(decodePacket(buf)).toBeNull();
    });
  });

  describe("compression (raw DEFLATE, bitchat-compatible)", () => {
    it("compresses a large low-entropy payload and restores it exactly", () => {
      // 500 bytes of repetitive text: >100 threshold, low unique-byte ratio.
      const original = new TextEncoder().encode("ab".repeat(250));
      const p = makePacket({ payload: original, flags: Flags.SIGNED });
      const encoded = encodePacket(p);
      // COMPRESSED flag is derived by the encoder and set on the wire.
      expect((encoded[11] & Flags.COMPRESSED) !== 0).toBe(true);
      const decoded = decodePacket(encoded);
      expect(Array.from(decoded!.payload)).toEqual(Array.from(original));
    });

    it("does NOT compress a small payload", () => {
      const encoded = encodePacket(
        makePacket({ payload: new Uint8Array([1, 2, 3]), flags: 0 }),
      );
      expect((encoded[11] & Flags.COMPRESSED) !== 0).toBe(false);
    });

    it("does NOT compress high-entropy data", () => {
      // Coprime step covers all 256 byte values -> unique ratio ~1.0.
      const big = new Uint8Array(300);
      for (let i = 0; i < big.length; i++) big[i] = (i * 167 + 13) & 0xff;
      const encoded = encodePacket(makePacket({ payload: big, flags: 0 }));
      expect((encoded[11] & Flags.COMPRESSED) !== 0).toBe(false);
    });
  });

  describe("signing and verification", () => {
    it("sign + verify round-trip succeeds (uncompressed)", () => {
      const priv = ed25519.utils.randomSecretKey();
      const pub = ed25519.getPublicKey(priv);
      const p = makePacket();
      p.signature = signPacket(p, priv);
      expect(verifyPacket(p, pub)).toBe(true);
    });

    it("sign + verify round-trip succeeds through a compressed payload", () => {
      const priv = ed25519.utils.randomSecretKey();
      const pub = ed25519.getPublicKey(priv);
      const p = makePacket({
        payload: new TextEncoder().encode("xy".repeat(200)),
      });
      p.signature = signPacket(p, priv);
      // Re-decode the wire packet and verify, mirroring the receive path.
      const decoded = decodePacket(encodePacket(p))!;
      decoded.signature = p.signature;
      expect(verifyPacket(decoded, pub)).toBe(true);
    });

    it("fails after modifying the payload", () => {
      const priv = ed25519.utils.randomSecretKey();
      const pub = ed25519.getPublicKey(priv);
      const p = makePacket();
      p.signature = signPacket(p, priv);
      const tampered = { ...p, payload: new TextEncoder().encode("hellp") };
      expect(verifyPacket(tampered, pub)).toBe(false);
    });

    it("stays valid after a TTL decrement (relay-safe)", () => {
      const priv = ed25519.utils.randomSecretKey();
      const pub = ed25519.getPublicKey(priv);
      const p = makePacket({ ttl: 7 });
      p.signature = signPacket(p, priv);
      expect(verifyPacket({ ...p, ttl: 6 }, pub)).toBe(true);
    });

    it("stays valid after being tagged as a solicited sync response (isRSR)", () => {
      const priv = ed25519.utils.randomSecretKey();
      const pub = ed25519.getPublicKey(priv);
      const p = makePacket();
      p.signature = signPacket(p, priv);
      expect(verifyPacket({ ...p, isRSR: true }, pub)).toBe(true);
    });

    it("fails for the wrong public key", () => {
      const priv = ed25519.utils.randomSecretKey();
      const wrong = ed25519.getPublicKey(ed25519.utils.randomSecretKey());
      const p = makePacket();
      p.signature = signPacket(p, priv);
      expect(verifyPacket(p, wrong)).toBe(false);
    });

    it("fails when the SIGNED flag is not set", () => {
      const priv = ed25519.utils.randomSecretKey();
      const pub = ed25519.getPublicKey(priv);
      const p = makePacket({ flags: 0 });
      p.signature = signPacket(p, priv);
      expect(verifyPacket(p, pub)).toBe(false);
    });
  });

  describe("broadcast and unicast helpers", () => {
    it("isBroadcast is true for an all-zero recipient", () => {
      expect(isBroadcast(makePacket())).toBe(true);
    });

    it("isForMe matches a recipient id", () => {
      const myID = new Uint8Array([
        0xde, 0xad, 0xbe, 0xef, 0xca, 0xfe, 0xba, 0xbe,
      ]);
      expect(isForMe(makePacket({ recipientID: myID }), myID)).toBe(true);
      expect(
        isForMe(makePacket({ recipientID: new Uint8Array(8).fill(1) }), myID),
      ).toBe(false);
    });
  });

  describe("packet type constants (match bitchat MessageType)", () => {
    it("core types", () => {
      expect(PacketType.ANNOUNCE).toBe(0x01);
      expect(PacketType.CHANNEL_MSG).toBe(0x02);
      expect(PacketType.LEAVE).toBe(0x03);
      expect(PacketType.NOISE_HANDSHAKE).toBe(0x10);
      expect(PacketType.NOISE_ENCRYPTED).toBe(0x11);
      expect(PacketType.FRAGMENT).toBe(0x20);
      expect(PacketType.FILE_TRANSFER).toBe(0x22);
    });
  });

  describe("computePacketId", () => {
    it("is 16 bytes and deterministic", () => {
      const p = makePacket({ payload: new Uint8Array([1, 2, 3]) });
      expect(computePacketId(p)).toHaveLength(16);
      expect(computePacketId(p)).toEqual(computePacketId(p));
    });

    it("differs across type or payload", () => {
      const a = makePacket({
        type: PacketType.ANNOUNCE,
        payload: new Uint8Array([1]),
      });
      const b = makePacket({
        type: PacketType.CHANNEL_MSG,
        payload: new Uint8Array([1]),
      });
      expect(computePacketId(a)).not.toEqual(computePacketId(b));
    });
  });
});
