/**
 * @jest-environment node
 */
import { ed25519 } from "@noble/curves/ed25519.js";
import {
  BROADCAST_ID,
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
    flags: Flags.SIGNED, // signed broadcast
    senderID: new Uint8Array([0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88]),
    recipientID: new Uint8Array(8),
    timestamp: 1700000000,
    nonce: new Uint8Array([0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x01, 0x02]),
    signature: new Uint8Array(64),
    payload: new TextEncoder().encode("hello"),
    ...overrides,
  };
}

describe("packet-codec", () => {
  describe("encode/decode round-trip", () => {
    it("round-trips a broadcast packet with correct byte offsets", () => {
      const p = makePacket();
      const encoded = encodePacket(p);
      const decoded = decodePacket(encoded);

      expect(decoded).not.toBeNull();
      expect(decoded!.type).toBe(PacketType.ANNOUNCE);
      expect(decoded!.ttl).toBe(7);
      expect(decoded!.flags).toBe(Flags.SIGNED); // flags preserved through wire
      expect(Array.from(decoded!.senderID)).toEqual(Array.from(p.senderID));
      expect(Array.from(decoded!.recipientID)).toEqual(
        Array.from(BROADCAST_ID),
      );
      expect(decoded!.timestamp).toBe(1700000000);
      expect(Array.from(decoded!.nonce)).toEqual(Array.from(p.nonce));
      expect(Array.from(decoded!.payload)).toEqual(
        Array.from(new TextEncoder().encode("hello")),
      );
    });

    it("preserves combined flags through encode/decode", () => {
      // Simulates a unicast compressed packet arriving from a bitchat peer
      const combinedFlags =
        Flags.HAS_RECIPIENT | Flags.COMPRESSED | Flags.SIGNED;
      const p = makePacket({ flags: combinedFlags });
      const encoded = encodePacket(p);
      expect(encoded[3]).toBe(combinedFlags);
      const decoded = decodePacket(encoded);
      expect(decoded!.flags).toBe(combinedFlags);
    });

    it("sets version byte to 2 at offset 0", () => {
      const encoded = encodePacket(makePacket());
      expect(encoded[0]).toBe(2);
    });

    it("sets type at offset 1", () => {
      const encoded = encodePacket(
        makePacket({ type: PacketType.CHANNEL_MSG }),
      );
      expect(encoded[1]).toBe(PacketType.CHANNEL_MSG);
    });

    it("sets TTL at offset 2", () => {
      const encoded = encodePacket(makePacket({ ttl: 5 }));
      expect(encoded[2]).toBe(5);
    });

    it("encodes timestamp big-endian at offsets 20–23", () => {
      const ts = 0x12345678;
      const encoded = encodePacket(makePacket({ timestamp: ts }));
      const view = new DataView(encoded.buffer);
      expect(view.getUint32(20, false)).toBe(ts);
    });

    it("places payload starting at offset 96", () => {
      const payload = new Uint8Array([0xde, 0xad, 0xbe, 0xef]);
      const encoded = encodePacket(makePacket({ payload }));
      expect(encoded.length).toBe(100);
      expect(Array.from(encoded.slice(96))).toEqual([0xde, 0xad, 0xbe, 0xef]);
    });

    it("returns null for packets shorter than 96 bytes", () => {
      expect(decodePacket(new Uint8Array(95))).toBeNull();
    });

    it("returns null for version != 2", () => {
      const buf = new Uint8Array(96);
      buf[0] = 1; // v1
      expect(decodePacket(buf)).toBeNull();
    });
  });

  describe("signing and verification", () => {
    it("sign + verify round-trip succeeds", () => {
      const privKey = ed25519.utils.randomSecretKey();
      const pubKey = ed25519.getPublicKey(privKey);
      const p = makePacket();
      p.signature = signPacket(p, privKey);
      expect(verifyPacket(p, pubKey)).toBe(true);
    });

    it("signature verification fails after modifying payload", () => {
      const privKey = ed25519.utils.randomSecretKey();
      const pubKey = ed25519.getPublicKey(privKey);
      const p = makePacket();
      p.signature = signPacket(p, privKey);
      // Flip a byte in payload
      const tamperedPayload = new Uint8Array(p.payload);
      tamperedPayload[0] ^= 0xff;
      const tampered = { ...p, payload: tamperedPayload };
      expect(verifyPacket(tampered, pubKey)).toBe(false);
    });

    it("signature is valid even after TTL decrement (relay-safe)", () => {
      const privKey = ed25519.utils.randomSecretKey();
      const pubKey = ed25519.getPublicKey(privKey);
      const p = makePacket({ ttl: 7 });
      p.signature = signPacket(p, privKey);
      // Simulate relay decrementing TTL
      const relayed = { ...p, ttl: 6 };
      expect(verifyPacket(relayed, pubKey)).toBe(true);
    });

    it("verifyPacket returns false for wrong public key", () => {
      const privKey = ed25519.utils.randomSecretKey();
      const wrongPubKey = ed25519.getPublicKey(ed25519.utils.randomSecretKey());
      const p = makePacket();
      p.signature = signPacket(p, privKey);
      expect(verifyPacket(p, wrongPubKey)).toBe(false);
    });

    it("verifyPacket returns false when FLAG_SIGNED is not set", () => {
      const privKey = ed25519.utils.randomSecretKey();
      const pubKey = ed25519.getPublicKey(privKey);
      const p = makePacket({ flags: 0x00 }); // no SIGNED bit
      p.signature = signPacket(p, privKey);
      expect(verifyPacket(p, pubKey)).toBe(false);
    });

    it("flags are included in the signing message", () => {
      const privKey = ed25519.utils.randomSecretKey();
      const pubKey = ed25519.getPublicKey(privKey);
      const p = makePacket({ flags: Flags.SIGNED | Flags.COMPRESSED });
      p.signature = signPacket(p, privKey);
      // Verify succeeds with original flags
      expect(verifyPacket(p, pubKey)).toBe(true);
      // Tamper with flags - verification must fail
      expect(verifyPacket({ ...p, flags: Flags.SIGNED }, pubKey)).toBe(false);
    });
  });

  describe("broadcast and unicast helpers", () => {
    it("isBroadcast returns true for all-zero recipientID", () => {
      expect(isBroadcast(makePacket())).toBe(true);
    });

    it("isBroadcast returns false for non-zero recipientID", () => {
      const p = makePacket({
        recipientID: new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0]),
      });
      expect(isBroadcast(p)).toBe(false);
    });

    it("isForMe returns true when recipientID matches", () => {
      const myID = new Uint8Array([
        0xde, 0xad, 0xbe, 0xef, 0xca, 0xfe, 0xba, 0xbe,
      ]);
      const p = makePacket({ recipientID: myID });
      expect(isForMe(p, myID)).toBe(true);
    });

    it("isForMe returns false for a different ID", () => {
      const myID = new Uint8Array([
        0xde, 0xad, 0xbe, 0xef, 0xca, 0xfe, 0xba, 0xbe,
      ]);
      const othersID = new Uint8Array([
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
      ]);
      const p = makePacket({ recipientID: othersID });
      expect(isForMe(p, myID)).toBe(false);
    });
  });

  describe("packet type constants", () => {
    it("ANNOUNCE = 0x01", () => expect(PacketType.ANNOUNCE).toBe(0x01));
    it("CHANNEL_MSG = 0x02", () => expect(PacketType.CHANNEL_MSG).toBe(0x02));
    it("DM = 0x03", () => expect(PacketType.DM).toBe(0x03));
    it("COURIER_ENV = 0x06", () => expect(PacketType.COURIER_ENV).toBe(0x06));
    it("VOICE_FRAME = 0x29", () => expect(PacketType.VOICE_FRAME).toBe(0x29));
    it("CASHU_TOKEN = 0x40", () => expect(PacketType.CASHU_TOKEN).toBe(0x40));
  });
});
