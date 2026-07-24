/**
 * @jest-environment node
 */
// Board gossip sync: board posts (type 0x23) ride the GCS sync machinery with a
// multi-byte SyncTypeFlags round (bit 8), mutually intelligible with bitchat.
import { ed25519 } from "@noble/curves/ed25519.js";
import {
  decodeGossipFilterPayload,
  encodeGossipFilterPayload,
  GossipSync,
} from "../gossip-sync";
import { Flags, PacketType, signPacket, type Packet } from "../packet-codec";

const TYPE_BIT_ANNOUNCE = 0;
const TYPE_BIT_MESSAGE = 1;
const TYPE_BIT_BOARD = 8;

function packet(type: PacketType, seed: number): Packet {
  const senderID = new Uint8Array(8).fill(seed & 0xff);
  return {
    type,
    ttl: 7,
    flags: Flags.SIGNED,
    senderID,
    recipientID: new Uint8Array(8),
    timestamp: 1_700_000_000_000 + seed,
    signature: new Uint8Array(64),
    payload: new Uint8Array([seed, seed + 1, seed + 2, 0xaa, 0xbb]),
  };
}

// An empty-filter REQUEST_SYNC (peer holds nothing) requesting the given types.
function emptyFilterRequest(types: number): Packet {
  const payload = encodeGossipFilterPayload({
    p: 19,
    m: 1,
    data: new Uint8Array(0),
    types,
  });
  const priv = ed25519.utils.randomSecretKey();
  const pkt: Packet = {
    type: PacketType.REQUEST_SYNC,
    ttl: 2,
    flags: Flags.SIGNED,
    senderID: new Uint8Array(8).fill(0x99),
    recipientID: new Uint8Array(8),
    timestamp: 1_700_000_000_000,
    signature: new Uint8Array(64),
    payload,
  };
  pkt.signature = signPacket(pkt, priv);
  return pkt;
}

describe("board gossip sync", () => {
  it("encodes the board bit as a two-byte little-endian type field", () => {
    const types =
      (1 << TYPE_BIT_ANNOUNCE) |
      (1 << TYPE_BIT_MESSAGE) |
      (1 << TYPE_BIT_BOARD);
    const payload = encodeGossipFilterPayload({
      p: 19,
      m: 1,
      data: new Uint8Array(0),
      types,
    });
    const decoded = decodeGossipFilterPayload(payload)!;
    expect(decoded.types).toBe(types); // 0x103 survives the LE round-trip
  });

  it("tracks board posts and offers them on a board-typed request", () => {
    const g = new GossipSync();
    g.track(packet(PacketType.ANNOUNCE, 1));
    g.track(packet(PacketType.CHANNEL_MSG, 2));
    g.track(packet(PacketType.BOARD_POST, 3));
    expect(g.seenCount).toBe(3);

    // A board-only request draws the board post, not the announce/message.
    const boardMissing = g.handleFilter(
      emptyFilterRequest(1 << TYPE_BIT_BOARD),
    );
    expect(boardMissing).toHaveLength(1);
    expect(boardMissing[0].type).toBe(PacketType.BOARD_POST);
  });

  it("does not offer board posts to a peer that only asked for announces", () => {
    const g = new GossipSync();
    g.track(packet(PacketType.BOARD_POST, 5));
    const missing = g.handleFilter(emptyFilterRequest(1 << TYPE_BIT_ANNOUNCE));
    expect(missing).toHaveLength(0);
  });
});
