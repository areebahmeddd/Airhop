/**
 * @jest-environment node
 */
// Wire-format tests for the bitchat-compatible binary codec. These lock in
// byte-level behavior that must match bitchat iOS/Android: v1 + v2 headers,
// PKCS#7 padding, raw-DEFLATE compression, and signing over the padded encoding.
import { ed25519 } from "@noble/curves/ed25519.js";
import { deflateRaw } from "pako";
import { optimalBlockSize, pad } from "../message-padding";
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
import { compress } from "../packet-compression";

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
  });

  // bitchat signs and verifies over the RE-ENCODED packet, so a re-encode has
  // to reproduce the originator's exact bytes. DEFLATE output is not canonical
  // and the three implementations use three different encoders (Apple's
  // compression_encode_buffer on iOS, zlib on Android, pako here), so a
  // re-encode must reuse the payload as received rather than compressing again.
  //
  // These tests stand in for a foreign encoder using pako's pre-2.2 hash: it
  // emits a VALID but different DEFLATE stream for the same input, which is
  // exactly the shape of the cross-implementation difference.
  describe("foreign-encoder compatibility", () => {
    // Same derivation as packet-compression: @types/pako 2.0.4 predates the
    // legacyHash option, so take the type from the function itself.
    type DeflateOpts = NonNullable<Parameters<typeof deflateRaw>[1]> & {
      legacyHash: boolean;
    };
    const LEGACY_ENCODER: DeflateOpts = { level: 6, legacyHash: true };

    // Verified to encode differently under the two hashes.
    const TEXT =
      "the mesh is up near the north gate. relay running all evening if anyone needs a bridge out to the wider network tonight. ".repeat(
        3,
      );

    const SENDER = new Uint8Array([
      0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
    ]);
    const TIMESTAMP = 1_700_000_000_000;

    // Assemble the v2 frame by hand (broadcast, compressed, no route) instead of
    // going through encodePacket. Building the fixture with our own encoder
    // would be circular: it would re-compress and the frame would stop being
    // foreign, so the tests would pass even with the fix removed.
    function buildFrame(
      ttl: number,
      compressedPayload: Uint8Array,
      originalSize: number,
      signature: Uint8Array | null,
    ): Uint8Array {
      const isSigned = signature !== null;
      const payloadDataSize = compressedPayload.length + 4; // + originalSize field
      const size = 16 + 8 + payloadDataSize + (isSigned ? 64 : 0); // header + senderID
      const buf = new Uint8Array(size);
      const view = new DataView(buf.buffer);
      let off = 0;
      buf[off++] = 2; // version
      buf[off++] = PacketType.ANNOUNCE;
      buf[off++] = ttl;
      view.setUint32(off, Math.floor(TIMESTAMP / 0x100000000), false);
      view.setUint32(off + 4, TIMESTAMP >>> 0, false);
      off += 8;
      buf[off++] = Flags.COMPRESSED | (isSigned ? Flags.SIGNED : 0);
      view.setUint32(off, payloadDataSize, false);
      off += 4;
      buf.set(SENDER, off);
      off += 8;
      view.setUint32(off, originalSize, false);
      off += 4;
      buf.set(compressedPayload, off);
      off += compressedPayload.length;
      if (signature !== null) buf.set(signature, off);
      return pad(buf, optimalBlockSize(buf.length));
    }

    // A frame exactly as another implementation would have put it on the wire:
    // signed over its own encoding, compressed by an encoder that is not ours.
    function foreignFrame(ttl = 7) {
      const payload = new TextEncoder().encode(TEXT);
      const foreignBytes = deflateRaw(payload, LEGACY_ENCODER);
      const priv = ed25519.utils.randomSecretKey();
      const pub = ed25519.getPublicKey(priv);
      // Signing preimage: same frame with ttl=0 and no signature (bitchat
      // toBinaryDataForSigning), padded.
      const preimage = buildFrame(0, foreignBytes, payload.length, null);
      const signature = ed25519.sign(preimage, priv);
      const frame = buildFrame(ttl, foreignBytes, payload.length, signature);
      return { frame, payload, foreignBytes, pub };
    }

    it("the fixture really differs from our own encoder", () => {
      const { payload, foreignBytes } = foreignFrame();
      const ours = compress(payload);
      expect(ours).not.toBeNull();
      // Both are valid DEFLATE for the same input, but not the same bytes.
      expect(Array.from(foreignBytes)).not.toEqual(Array.from(ours!));
    });

    it("decodes a foreign frame, preserving its wire payload", () => {
      const { frame, payload, foreignBytes } = foreignFrame();
      const decoded = decodePacket(frame)!;
      expect(decoded).not.toBeNull();
      expect(Array.from(decoded.payload)).toEqual(Array.from(payload));
      expect(decoded.wirePayload!.compressed).toBe(true);
      expect(Array.from(decoded.wirePayload!.bytes)).toEqual(
        Array.from(foreignBytes),
      );
    });

    it("verifies a signed packet compressed by another implementation", () => {
      const { frame, pub } = foreignFrame();
      const decoded = decodePacket(frame)!;
      // Verifies because the signing blob was rebuilt from the originator's
      // bytes rather than re-compressed with our encoder.
      expect(verifyPacket(decoded, pub)).toBe(true);
    });

    it("re-encoding a decoded foreign frame is byte-identical", () => {
      const { frame } = foreignFrame();
      const decoded = decodePacket(frame)!;
      expect(Array.from(encodePacket(decoded))).toEqual(Array.from(frame));
    });

    it("relaying preserves the originator's compressed bytes and signature", () => {
      const { frame, foreignBytes, pub } = foreignFrame(7);

      // Relay exactly as flood-router does: decrement TTL and re-encode. The
      // originator's payload bytes must survive the hop, or every node
      // downstream would reject a legitimate packet.
      const received = decodePacket(frame)!;
      const relayed = decodePacket(
        encodePacket({ ...received, ttl: received.ttl - 1 }),
      )!;

      expect(relayed.ttl).toBe(6);
      expect(Array.from(relayed.wirePayload!.bytes)).toEqual(
        Array.from(foreignBytes),
      );
      expect(verifyPacket(relayed, pub)).toBe(true);
    });

    it("rejects a same-length payload swap on a compressed packet", () => {
      const { frame, pub } = foreignFrame();
      const decoded = decodePacket(frame)!;

      // Same length, so a length-based staleness check would let the wire form
      // through and sign the pre-swap bytes. The payload binding must catch it.
      const swapped = Uint8Array.from(decoded.payload);
      swapped[0] ^= 0xff;
      expect(swapped.length).toBe(decoded.payload.length);
      expect(verifyPacket({ ...decoded, payload: swapped }, pub)).toBe(false);
    });

    it("still compresses with our own encoder for locally built packets", () => {
      const payload = new TextEncoder().encode(TEXT);
      const wire = encodePacket(makePacket({ payload }));
      const decoded = decodePacket(wire)!;
      expect(decoded.wirePayload!.compressed).toBe(true);
      expect(Array.from(decoded.wirePayload!.bytes)).toEqual(
        Array.from(compress(payload)!),
      );
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

  describe("malformed frames decode to null rather than throwing", () => {
    // decodePacket is fed arbitrary bytes off the radio and has no try/catch
    // around it in mesh-service, so a throw here does not stay here: it escapes
    // into the native packetReceived listener. Returning null is the contract.
    it("a COMPRESSED frame whose length field runs off the end returns null", () => {
      // 24 bytes exactly: v2 header (16, payloadLength being a 4-byte BE field
      // at offset 12) + senderID (8), with COMPRESSED set and HAS_RECIPIENT
      // clear. That leaves the read offset sitting precisely at the end of the
      // buffer, and DataView.getUint32 throws RangeError past the end instead of
      // reading garbage. payloadLength must be >= 4 to reach the read, and small
      // enough to clear the MAX_PAYLOAD_BYTES gate, so it goes in the LOW byte.
      const raw = new Uint8Array(24);
      raw[0] = 2; // version
      raw[1] = PacketType.CHANNEL_MSG;
      raw[2] = 7; // ttl
      raw[11] = Flags.COMPRESSED; // flags
      raw[15] = 4; // payloadLength = 4, big-endian across 12..15
      // bytes 16..23 are the 8-byte senderID (zeros), ending the buffer.

      expect(() => decodePacket(raw)).not.toThrow();
      expect(decodePacket(raw)).toBeNull();
    });

    it("truncating a valid frame at every length never throws", () => {
      // The general form of the same contract, since one hand-built frame only
      // proves the one offset. Every prefix of a real packet is a frame the
      // radio could plausibly hand us after a dropped fragment.
      const full = encodePacket(
        makePacket({ payload: new Uint8Array([1, 2, 3, 4, 5]) }),
      );
      for (let n = 0; n < full.length; n++) {
        expect(() => decodePacket(full.slice(0, n))).not.toThrow();
      }
    });
  });
});
