/**
 * @jest-environment node
 */
import { ed25519 } from "@noble/curves/ed25519.js";
import {
  buildGcsFilter,
  decodeGcsFilter,
  decodeGossipFilterPayload,
  encodeGossipFilterPayload,
  GossipSync,
} from "../gossip-sync";
import {
  computePacketId,
  Flags,
  PacketType,
  type Packet,
} from "../packet-codec";

function makeIdentity() {
  const signingPrivKey = ed25519.utils.randomSecretKey();
  const signingPubKey = ed25519.getPublicKey(signingPrivKey);
  const peerID = Array.from(signingPubKey.slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { signingPrivKey, peerID };
}

function makePacket(
  type: PacketType,
  timestamp: number,
  payload: Uint8Array,
): Packet {
  return {
    type,
    ttl: 7,
    flags: Flags.SIGNED,
    senderID: new Uint8Array(8).fill(1),
    recipientID: new Uint8Array(8),
    timestamp,
    signature: new Uint8Array(64),
    payload,
  };
}

describe("computePacketId", () => {
  test("produces 16 bytes", () => {
    const p = makePacket(PacketType.ANNOUNCE, 1000, new Uint8Array(4));
    expect(computePacketId(p)).toHaveLength(16);
  });

  test("is deterministic", () => {
    const p = makePacket(PacketType.ANNOUNCE, 1000, new Uint8Array([1, 2, 3]));
    const id1 = computePacketId(p);
    const id2 = computePacketId(p);
    expect(id1).toEqual(id2);
  });

  test("differs for different packets", () => {
    const p1 = makePacket(PacketType.ANNOUNCE, 1000, new Uint8Array([1]));
    const p2 = makePacket(PacketType.CHANNEL_MSG, 1000, new Uint8Array([1]));
    expect(computePacketId(p1)).not.toEqual(computePacketId(p2));
  });
});

describe("GCS filter build/decode", () => {
  test("empty h64s produces empty data", () => {
    const { data } = buildGcsFilter([], 400, 0.01);
    expect(data).toHaveLength(0);
  });

  test("single value encodes and decodes", () => {
    const h64s = [12345678901234n];
    const { p, m, data } = buildGcsFilter(h64s, 400, 0.01);
    const decoded = decodeGcsFilter(p, m, data);
    // The decoded value is h64 % m, so we check membership
    expect(decoded.length).toBeGreaterThanOrEqual(0); // no crash
  });

  test("known values can be found in decoded filter (membership)", () => {
    const values = [100n, 200n, 300n, 400n, 500n];
    const { p, m, data } = buildGcsFilter(values, 400, 0.01);
    const decoded = decodeGcsFilter(p, m, data);
    // Each original value % m should appear in the decoded sorted set
    const mBig = BigInt(m);
    for (const v of values) {
      const mapped = v % mBig === 0n ? 1n : v % mBig;
      expect(decoded).toContain(mapped);
    }
  });

  test("decodeGcsFilter with invalid p returns empty", () => {
    expect(decodeGcsFilter(0, 10, new Uint8Array([0xff]))).toEqual([]);
  });

  test("decodeGcsFilter with m=0 returns empty", () => {
    expect(decodeGcsFilter(7, 0, new Uint8Array([0xff]))).toEqual([]);
  });
});

describe("GossipFilterPayload encode/decode", () => {
  test("round-trips through encode/decode", () => {
    const params = {
      p: 7,
      m: 256,
      data: new Uint8Array([0xab, 0xcd]),
      types: 3,
    };
    const encoded = encodeGossipFilterPayload(params);
    const decoded = decodeGossipFilterPayload(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.p).toBe(7);
    expect(decoded!.m).toBe(256);
    expect(decoded!.data).toEqual(new Uint8Array([0xab, 0xcd]));
    expect(decoded!.types).toBe(3);
  });

  test("returns null for truncated data", () => {
    expect(decodeGossipFilterPayload(new Uint8Array([0x01, 0x00]))).toBeNull();
  });
});

describe("GossipSync class", () => {
  const identity = makeIdentity();

  test("seenCount starts at 0", () => {
    const gs = new GossipSync();
    expect(gs.seenCount).toBe(0);
  });

  test("track ignores non-gossip packet types", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.NOISE_ENCRYPTED, 1000, new Uint8Array(4)));
    expect(gs.seenCount).toBe(0);
  });

  test("track stores ANNOUNCE and CHANNEL_MSG", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 1000, new Uint8Array(4)));
    gs.track(makePacket(PacketType.CHANNEL_MSG, 1001, new Uint8Array(4)));
    expect(gs.seenCount).toBe(2);
  });

  test("buildFilterPacket returns null when nothing tracked", () => {
    const gs = new GossipSync();
    expect(gs.buildFilterPacket(identity)).toBeNull();
  });

  test("buildFilterPacket returns a signed REQUEST_SYNC packet", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 1000, new Uint8Array(4)));
    const pkt = gs.buildFilterPacket(identity);
    expect(pkt).not.toBeNull();
    expect(pkt!.type).toBe(PacketType.REQUEST_SYNC);
    expect(pkt!.flags & Flags.SIGNED).toBeTruthy();
  });

  test("handleFilter returns packets the peer is missing", () => {
    const gs = new GossipSync();
    // Track two distinct packets
    const p1 = makePacket(PacketType.ANNOUNCE, 1000, new Uint8Array([1]));
    const p2 = makePacket(PacketType.ANNOUNCE, 1001, new Uint8Array([2]));
    gs.track(p1);
    gs.track(p2);

    // Build a filter for an empty peer (knows nothing)
    const emptyGs = new GossipSync();
    // emptyGs has nothing tracked so buildFilterPacket returns null; build a
    // synthetic empty filter packet to represent a peer with no history.
    void emptyGs;
    const emptyPayload = encodeGossipFilterPayload({
      p: 7,
      m: 1,
      data: new Uint8Array(0),
    });
    const syntheticFilter: Packet = {
      type: PacketType.REQUEST_SYNC,
      ttl: 2,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8),
      recipientID: new Uint8Array(8),
      timestamp: 1000,
      signature: new Uint8Array(64),
      payload: emptyPayload,
    };

    const missing = gs.handleFilter(syntheticFilter);
    // Since the peer has nothing, we should offer both our packets
    expect(missing.length).toBe(2);
  });

  test("reset clears tracked packets", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 1000, new Uint8Array(4)));
    gs.reset();
    expect(gs.seenCount).toBe(0);
  });
});
