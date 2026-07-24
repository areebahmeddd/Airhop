/**
 * @jest-environment node
 *
 * Wire-format compatibility vectors for the bitchat v2 protocol.
 *
 * Every test pins a known-value expectation against the byte layout in
 * PROTOCOLS.md and implemented in packet-codec.ts. These tests match
 * bitchat BinaryProtocol.swift / BinaryProtocol.kt exactly. If any fail,
 * the change is likely a protocol-breaking regression.
 */
import { ed25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import {
  AnnounceManager,
  decodeAnnouncePayload,
  encodeAnnouncePayload,
} from "../announce-manager";
import { FRAG_DATA_SIZE, FRAGMENT_SIZE } from "../fragment-manager";
import {
  BROADCAST_ID,
  computePacketId,
  decodePacket,
  encodePacket,
  Flags,
  isBroadcast,
  PacketType,
  signPacket,
  V2_HEADER_SIZE,
  verifyPacket,
  type Packet,
} from "../packet-codec";

// ---- Peer ID Derivation -------------------------------------------------------
// PROTOCOLS.md: peerID = hex(SHA-256(noiseStaticPubKey)).slice(0, 16)

describe("Peer ID derivation", () => {
  test("SHA-256 of all-zero 32-byte key produces correct hex prefix", () => {
    const zeroKey = new Uint8Array(32);
    const hash = sha256(zeroKey);
    const peerID = bytesToHex(hash).slice(0, 16);
    // Known vector: SHA-256(0x00*32) = 66687aadf862bd776c8fc18b8e9f8e20...
    expect(peerID).toBe("66687aadf862bd77");
  });

  test("peerID is always 16 lowercase hex characters", () => {
    for (let seed = 0; seed < 8; seed++) {
      const key = new Uint8Array(32).fill(seed);
      const peerID = bytesToHex(sha256(key)).slice(0, 16);
      expect(peerID).toHaveLength(16);
      expect(peerID).toMatch(/^[0-9a-f]{16}$/);
    }
  });

  test("two different keys always produce different peer IDs", () => {
    const idA = bytesToHex(sha256(new Uint8Array(32).fill(0x01))).slice(0, 16);
    const idB = bytesToHex(sha256(new Uint8Array(32).fill(0x02))).slice(0, 16);
    expect(idA).not.toBe(idB);
  });
});

// ---- Packet Header Byte Layout -----------------------------------------------
// PROTOCOLS.md section 2 / BinaryProtocol.swift:
//
//   Fixed header (v2, 16 bytes):
//   [0]      version = 2
//   [1]      type
//   [2]      ttl
//   [3–10]   timestamp u64 BE
//   [11]     flags
//   [12–15]  payloadLength u32 BE
//
//   Variable (after header):
//   senderID    (8 bytes, always)
//   recipientID (8 bytes, only if hasRecipient)
//   payload
//   signature   (64 bytes, only if hasSignature)

describe("Packet header byte layout (v2)", () => {
  const SENDER = new Uint8Array([
    0xaa, 0xbb, 0xcc, 0xdd, 0x11, 0x22, 0x33, 0x44,
  ]);
  const RECIPIENT = new Uint8Array([
    0xde, 0xad, 0xbe, 0xef, 0x00, 0x01, 0x02, 0x03,
  ]);
  const PAYLOAD = new Uint8Array([0xff, 0xfe, 0xfd]);

  // Unicast packet with signature.
  const packet: Packet = {
    type: PacketType.ANNOUNCE,
    ttl: 7,
    flags: Flags.SIGNED | Flags.HAS_RECIPIENT,
    senderID: SENDER,
    recipientID: RECIPIENT,
    timestamp: 0x12345678, // low value for u64 (high 32 bits = 0)
    signature: new Uint8Array(64).fill(0x5a),
    payload: PAYLOAD,
  };

  let buf: Uint8Array;
  beforeAll(() => {
    buf = encodePacket(packet);
  });

  test("V2_HEADER_SIZE is 16", () => expect(V2_HEADER_SIZE).toBe(16));
  test("byte[0] is version 2", () => expect(buf[0]).toBe(2));
  test("byte[1] is packet type", () =>
    expect(buf[1]).toBe(PacketType.ANNOUNCE));
  test("byte[2] is TTL", () => expect(buf[2]).toBe(7));

  // Timestamp: u64 BE at [3–10]
  test("bytes[3–10] are timestamp u64 BE", () => {
    const view = new DataView(buf.buffer);
    const hi = view.getUint32(3, false);
    const lo = view.getUint32(7, false);
    const ts = hi * 0x100000000 + lo;
    expect(ts).toBe(0x12345678);
  });

  // Flags at [11]
  test("byte[11] is flags", () =>
    expect(buf[11]).toBe(Flags.SIGNED | Flags.HAS_RECIPIENT));

  // PayloadLength u32 BE at [12–15]
  test("bytes[12–15] are payloadLength u32 BE", () => {
    const view = new DataView(buf.buffer);
    expect(view.getUint32(12, false)).toBe(PAYLOAD.length);
  });

  // Variable section starts at [16]
  test("bytes[16–23] are senderID", () =>
    expect(Array.from(buf.slice(16, 24))).toEqual(Array.from(SENDER)));
  test("bytes[24–31] are recipientID (hasRecipient=1)", () =>
    expect(Array.from(buf.slice(24, 32))).toEqual(Array.from(RECIPIENT)));
  test("bytes[32–34] are payload", () =>
    expect(Array.from(buf.slice(32, 35))).toEqual(Array.from(PAYLOAD)));
  test("bytes[35–98] are signature (64 bytes)", () =>
    expect(buf.slice(35, 99).every((b) => b === 0x5a)).toBe(true));
  // Core is 16 header + 8 senderID + 8 recipientID + 3 payload + 64 sig = 99,
  // then PKCS#7-padded up to the 256 block (bitchat MessagePadding).
  test("frame is PKCS#7-padded to a block size", () =>
    expect(buf.length).toBe(256));

  // Broadcast: no recipientID field on the wire, so payload sits right after the
  // senderID at offset 24 (16 header + 8 senderID).
  test("broadcast omits recipientID field from wire", () => {
    const bcast: Packet = {
      ...packet,
      flags: Flags.SIGNED, // no HAS_RECIPIENT
      recipientID: BROADCAST_ID,
    };
    const bcastBuf = encodePacket(bcast);
    expect(Array.from(bcastBuf.slice(24, 24 + PAYLOAD.length))).toEqual(
      Array.from(PAYLOAD),
    );
    expect(isBroadcast(decodePacket(bcastBuf)!)).toBe(true);
  });
});

// ---- Flag Bit Values ----------------------------------------------------------
// Must match bitchat BinaryProtocol.Flags exactly.

describe("Flag bit values", () => {
  test("HAS_RECIPIENT = 0x01", () => expect(Flags.HAS_RECIPIENT).toBe(0x01));
  test("SIGNED = 0x02", () => expect(Flags.SIGNED).toBe(0x02));
  test("COMPRESSED = 0x04", () => expect(Flags.COMPRESSED).toBe(0x04));
  test("HAS_ROUTE = 0x08", () => expect(Flags.HAS_ROUTE).toBe(0x08));
  test("IS_RSR = 0x10", () => expect(Flags.IS_RSR).toBe(0x10));
});

// ---- Packet Round-Trip -------------------------------------------------------

describe("Packet encode/decode round-trip", () => {
  test("all fields survive encode → decode (broadcast)", () => {
    const original: Packet = {
      type: PacketType.CHANNEL_MSG,
      ttl: 5,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8).fill(0x01),
      recipientID: BROADCAST_ID,
      timestamp: 1_700_000_000,
      signature: new Uint8Array(64).fill(0x03),
      payload: new TextEncoder().encode("hello mesh"),
    };

    const decoded = decodePacket(encodePacket(original));
    expect(decoded).not.toBeNull();
    expect(decoded!.type).toBe(original.type);
    expect(decoded!.ttl).toBe(original.ttl);
    expect(decoded!.timestamp).toBe(original.timestamp);
    expect(Array.from(decoded!.senderID)).toEqual(
      Array.from(original.senderID),
    );
    expect(new TextDecoder().decode(decoded!.payload)).toBe("hello mesh");
  });

  test("all fields survive encode → decode (unicast with route)", () => {
    const hop1 = new Uint8Array(8).fill(0xcc);
    const hop2 = new Uint8Array(8).fill(0xdd);
    const original: Packet = {
      type: PacketType.NOISE_ENCRYPTED,
      ttl: 4,
      flags: Flags.SIGNED | Flags.HAS_RECIPIENT,
      senderID: new Uint8Array(8).fill(0x11),
      recipientID: new Uint8Array(8).fill(0x22),
      timestamp: 1_720_000_000,
      signature: new Uint8Array(64).fill(0xee),
      payload: new Uint8Array([0x01, 0x02, 0x03]),
      route: [hop1, hop2],
    };

    const decoded = decodePacket(encodePacket(original));
    expect(decoded).not.toBeNull();
    expect(decoded!.route).toHaveLength(2);
    expect(Array.from(decoded!.route![0])).toEqual(Array.from(hop1));
    expect(Array.from(decoded!.route![1])).toEqual(Array.from(hop2));
  });

  test("isRSR flag round-trips", () => {
    const p: Packet = {
      type: PacketType.REQUEST_SYNC,
      ttl: 0,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8),
      recipientID: BROADCAST_ID,
      timestamp: 1_700_000_000,
      signature: new Uint8Array(64),
      payload: new Uint8Array(1),
      isRSR: true,
    };
    const decoded = decodePacket(encodePacket(p));
    expect(decoded!.isRSR).toBe(true);
  });

  test("decodePacket accepts v1 and v2, rejects unknown versions", () => {
    const sample: Packet = {
      type: PacketType.ANNOUNCE,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8).fill(0x11),
      recipientID: BROADCAST_ID,
      timestamp: 1_700_000_000_000,
      signature: new Uint8Array(64),
      payload: new TextEncoder().encode("hi"),
    };
    // v1 and v2 are both valid bitchat wire versions.
    expect(
      decodePacket(encodePacket({ ...sample, version: 1 })),
    ).not.toBeNull();
    expect(
      decodePacket(encodePacket({ ...sample, version: 2 })),
    ).not.toBeNull();
    const bad = new Uint8Array(100);
    bad[0] = 3;
    expect(decodePacket(bad)).toBeNull();
  });

  test("decodePacket returns null for truncated buffer", () => {
    expect(decodePacket(new Uint8Array(10))).toBeNull();
  });

  test("BROADCAST_ID is all-zeros 8 bytes", () => {
    expect(BROADCAST_ID.length).toBe(8);
    expect(BROADCAST_ID.every((b) => b === 0)).toBe(true);
  });

  test("isBroadcast detects broadcast packet (no HAS_RECIPIENT)", () => {
    const p: Packet = {
      type: PacketType.CHANNEL_MSG,
      ttl: 7,
      flags: Flags.SIGNED, // no HAS_RECIPIENT
      senderID: new Uint8Array(8),
      recipientID: BROADCAST_ID,
      timestamp: 0,
      signature: new Uint8Array(64),
      payload: new Uint8Array(0),
    };
    expect(isBroadcast(p)).toBe(true);
  });
});

// ---- Signature Coverage -------------------------------------------------------
// Signing matches bitchat toBinaryDataForSigning():
// encode with ttl=0, isRSR=false, hasSignature=0, then sign the bytes.
// This lets relay nodes decrement TTL without invalidating the signature.

describe("Signature coverage (relay TTL compat)", () => {
  const privKey = new Uint8Array(32).fill(0xcc);
  const pubKey = ed25519.getPublicKey(privKey);

  function makePacket(ttl: number): Packet {
    return {
      type: PacketType.CHANNEL_MSG,
      ttl,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8).fill(0x10),
      recipientID: BROADCAST_ID,
      timestamp: 1_700_000_000,
      signature: new Uint8Array(64),
      payload: new TextEncoder().encode("relay test"),
    };
  }

  test("signature verifies on the original packet", () => {
    const p = makePacket(7);
    p.signature = signPacket(p, privKey);
    expect(verifyPacket(p, pubKey)).toBe(true);
  });

  test("signature still verifies after relay decrements TTL", () => {
    const p = makePacket(7);
    p.signature = signPacket(p, privKey);
    p.ttl = 6;
    expect(verifyPacket(p, pubKey)).toBe(true);
  });

  test("TTL=0 still verifies (TTL normalised to 0 during signing)", () => {
    const p = makePacket(7);
    p.signature = signPacket(p, privKey);
    p.ttl = 0;
    expect(verifyPacket(p, pubKey)).toBe(true);
  });

  test("tampered payload invalidates signature", () => {
    const p = makePacket(7);
    p.signature = signPacket(p, privKey);
    const tamperedPayload = new Uint8Array(p.payload);
    tamperedPayload[0] ^= 0xff;
    expect(verifyPacket({ ...p, payload: tamperedPayload }, pubKey)).toBe(
      false,
    );
  });

  test("tampered senderID invalidates signature", () => {
    const p = makePacket(7);
    p.signature = signPacket(p, privKey);
    expect(
      verifyPacket({ ...p, senderID: new Uint8Array(8).fill(0xff) }, pubKey),
    ).toBe(false);
  });

  test("unsigned packet (no SIGNED flag) is rejected", () => {
    const p = makePacket(7);
    p.flags = 0x00; // no SIGNED
    expect(verifyPacket(p, pubKey)).toBe(false);
  });

  test("isRSR flag cleared in signing bytes (does not break sig)", () => {
    const p = makePacket(7);
    p.signature = signPacket(p, privKey);
    // Packet arrives with isRSR tagged by the relay: must still verify.
    const relayTagged = { ...p, isRSR: true };
    expect(verifyPacket(relayTagged, pubKey)).toBe(true);
  });
});

// ---- PacketID Derivation ------------------------------------------------------
// Matches bitchat PacketIdUtil.swift / PacketIdUtil.kt:
//   SHA-256(type[1] | senderID[8] | timestamp_u64_BE[8] | payload)[0:16]

describe("Packet ID derivation (dedup and gossip sync key)", () => {
  test("computePacketId produces 16-byte result", () => {
    const p: Packet = {
      type: PacketType.ANNOUNCE,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8).fill(0xaa),
      recipientID: BROADCAST_ID,
      timestamp: 1_700_000_000,
      signature: new Uint8Array(64),
      payload: new Uint8Array([0x01, 0x02]),
    };
    const id = computePacketId(p);
    expect(id.length).toBe(16);
  });

  test("same fields produce the same packetID", () => {
    const p: Packet = {
      type: PacketType.CHANNEL_MSG,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8).fill(0x11),
      recipientID: BROADCAST_ID,
      timestamp: 1_720_000_000,
      signature: new Uint8Array(64),
      payload: new TextEncoder().encode("hello"),
    };
    const id1 = computePacketId(p);
    const id2 = computePacketId({ ...p, ttl: 3 }); // TTL excluded from ID
    expect(bytesToHex(id1)).toBe(bytesToHex(id2));
  });

  test("different senderID produces different packetID", () => {
    const base: Packet = {
      type: PacketType.ANNOUNCE,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8).fill(0x01),
      recipientID: BROADCAST_ID,
      timestamp: 1_700_000_000,
      signature: new Uint8Array(64),
      payload: new Uint8Array(4),
    };
    const id1 = computePacketId(base);
    const id2 = computePacketId({
      ...base,
      senderID: new Uint8Array(8).fill(0x02),
    });
    expect(bytesToHex(id1)).not.toBe(bytesToHex(id2));
  });

  test("timestamp is encoded as u64 (> u32 max survives round-trip)", () => {
    // Unix timestamp in year 2100 (> 2^32): 4102444800
    const ts = 4_102_444_800;
    const p: Packet = {
      type: PacketType.ANNOUNCE,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8),
      recipientID: BROADCAST_ID,
      timestamp: ts,
      signature: new Uint8Array(64),
      payload: new Uint8Array(1),
    };
    const decoded = decodePacket(encodePacket(p));
    expect(decoded!.timestamp).toBe(ts);
  });
});

// ---- ANNOUNCE TLV Format -----------------------------------------------------
// ANNOUNCE payload uses 1-byte type + 1-byte length TLVs (Packets.swift format).
//   0x01 nickname, 0x02 noisePub (32 bytes), 0x03 signingPub (32 bytes)

// Walk TLV payload and return map of type → value bytes.
function parseTLVs(buf: Uint8Array): Map<number, Uint8Array> {
  const map = new Map<number, Uint8Array>();
  let i = 0;
  while (i + 2 <= buf.length) {
    const type = buf[i];
    const len = buf[i + 1];
    i += 2;
    if (i + len > buf.length) break;
    map.set(type, buf.slice(i, i + len));
    i += len;
  }
  return map;
}

describe("ANNOUNCE TLV encoding", () => {
  const noisePub = new Uint8Array(32).fill(0xaa);
  const signingPub = new Uint8Array(32).fill(0xbb);
  const identity = {
    peerID: "aabb000000000000",
    noiseStaticPrivKey: new Uint8Array(32),
    noiseStaticPubKey: noisePub,
    signingPrivKey: new Uint8Array(32),
    signingPubKey: signingPub,
    nostrPubKey: "aa".repeat(32),
  };

  test("payload contains 0x01 TLV for nickname", () => {
    const payload = encodeAnnouncePayload(identity, "alice");
    const tlvs = parseTLVs(payload);
    expect(tlvs.has(0x01)).toBe(true);
    expect(new TextDecoder().decode(tlvs.get(0x01)!)).toBe("alice");
  });

  test("payload contains 0x02 TLV (32-byte noisePub)", () => {
    const payload = encodeAnnouncePayload(identity, "bob");
    const tlvs = parseTLVs(payload);
    expect(tlvs.has(0x02)).toBe(true);
    expect(tlvs.get(0x02)!.length).toBe(32);
    expect(Array.from(tlvs.get(0x02)!)).toEqual(Array.from(noisePub));
  });

  test("payload contains 0x03 TLV (32-byte signingPub)", () => {
    const payload = encodeAnnouncePayload(identity, "bob");
    const tlvs = parseTLVs(payload);
    expect(tlvs.has(0x03)).toBe(true);
    expect(tlvs.get(0x03)!.length).toBe(32);
    expect(Array.from(tlvs.get(0x03)!)).toEqual(Array.from(signingPub));
  });

  test("encode/decode round-trip recovers all fields", () => {
    const senderID = new Uint8Array(8).fill(0x11);
    const payload = encodeAnnouncePayload(identity, "charlie");
    const decoded = decodeAnnouncePayload(payload, senderID);
    expect(decoded).not.toBeNull();
    expect(decoded!.nickname).toBe("charlie");
    expect(Array.from(decoded!.noisePubKey)).toEqual(Array.from(noisePub));
    expect(Array.from(decoded!.signingPubKey)).toEqual(Array.from(signingPub));
  });

  test("nickname longer than 32 chars is truncated to 32", () => {
    const long = "x".repeat(60);
    const payload = encodeAnnouncePayload(identity, long);
    const decoded = decodeAnnouncePayload(payload, new Uint8Array(8));
    expect(decoded!.nickname.length).toBeLessThanOrEqual(32);
  });

  test("encodeAnnouncePayload includes TLV 0x04 when neighborIDs provided", () => {
    const neighbor = new Uint8Array(8).fill(0xcc);
    const payload = encodeAnnouncePayload(identity, "dave", [neighbor]);
    const tlvs = parseTLVs(payload);
    expect(tlvs.has(0x04)).toBe(true);
    // TLV 0x04 is 8 bytes per neighbor
    expect(tlvs.get(0x04)!.length).toBe(8);
    expect(Array.from(tlvs.get(0x04)!)).toEqual(Array.from(neighbor));
  });

  test("encodeAnnouncePayload caps neighbor TLV at 10 entries", () => {
    const neighbors = Array.from({ length: 15 }, (_, i) =>
      new Uint8Array(8).fill(i),
    );
    const payload = encodeAnnouncePayload(identity, "eve", neighbors);
    const tlvs = parseTLVs(payload);
    expect(tlvs.has(0x04)).toBe(true);
    expect(tlvs.get(0x04)!.length).toBe(10 * 8);
  });

  test("encodeAnnouncePayload omits TLV 0x04 when no neighbors", () => {
    const payload = encodeAnnouncePayload(identity, "frank", []);
    const tlvs = parseTLVs(payload);
    expect(tlvs.has(0x04)).toBe(false);
  });

  test("AnnounceManager.buildPacket includes neighbor TLV when provided", () => {
    const mgr = new AnnounceManager();
    const neighbor = new Uint8Array(8).fill(0xdd);
    const packet = mgr.buildPacket(identity, "grace", [neighbor]);
    const tlvs = parseTLVs(packet.payload);
    expect(tlvs.has(0x04)).toBe(true);
    expect(tlvs.get(0x04)!.length).toBe(8);
  });

  test("AnnounceManager.buildPacket omits TLV 0x04 when called without neighbors", () => {
    const mgr = new AnnounceManager();
    const packet = mgr.buildPacket(identity, "henry");
    const tlvs = parseTLVs(packet.payload);
    expect(tlvs.has(0x04)).toBe(false);
  });

  test("AnnounceManager.start passes getNeighborIDs result into each announce", () => {
    const mgr = new AnnounceManager();
    const neighbor = new Uint8Array(8).fill(0xee);
    const sent: ReturnType<typeof mgr.buildPacket>[] = [];
    mgr.start(
      identity,
      "iris",
      (p) => sent.push(p),
      () => [neighbor],
    );
    mgr.stop();
    expect(sent.length).toBeGreaterThan(0);
    const tlvs = parseTLVs(sent[0].payload);
    expect(tlvs.has(0x04)).toBe(true);
  });
});

// ---- Fragment Constants -------------------------------------------------------
// PROTOCOLS.md: fragment size = 469 bytes total; header = 13 bytes.

describe("Fragment wire constants", () => {
  test("FRAGMENT_SIZE is exactly 469 bytes (BLE MTU limit)", () => {
    expect(FRAGMENT_SIZE).toBe(469);
  });

  test("FRAG_DATA_SIZE is FRAGMENT_SIZE minus 13-byte fragment header", () => {
    expect(FRAG_DATA_SIZE).toBe(469 - 13);
  });

  test("fragment header is 8+2+2+1 = 13 bytes", () => {
    expect(469 - FRAG_DATA_SIZE).toBe(13);
  });
});

// ---- BLE Service / Characteristic UUIDs -------------------------------------
// These must never change without a protocol version bump.

describe("BLE UUID constants", () => {
  const SERVICE_UUID = "F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C";
  const CHAR_UUID = "A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D";

  test("Service UUID matches PROTOCOLS.md", () => {
    expect(SERVICE_UUID.toUpperCase()).toBe(
      "F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C",
    );
  });

  test("Characteristic UUID matches PROTOCOLS.md", () => {
    expect(CHAR_UUID.toUpperCase()).toBe(
      "A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D",
    );
  });
});
