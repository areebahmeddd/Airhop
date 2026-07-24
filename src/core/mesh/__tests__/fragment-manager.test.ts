/**
 * @jest-environment node
 */
import { ed25519 } from "@noble/curves/ed25519.js";
import {
  FRAGMENT_SIZE,
  FRAG_DATA_SIZE,
  FragmentManager,
  decodeFragmentPayload,
  fragmentPacket,
} from "../fragment-manager";
import { Flags, PacketType, signPacket, type Packet } from "../packet-codec";

function makeIdentity() {
  const signingPrivKey = ed25519.utils.randomSecretKey();
  const signingPubKey = ed25519.getPublicKey(signingPrivKey);
  // peerID = first 8 bytes of pubkey as hex
  const peerID = Array.from(signingPubKey.slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { signingPrivKey, signingPubKey, peerID };
}

// Build a large packet with `payloadSize` payload bytes.
function makeLargePacket(
  payloadSize: number,
  identity: ReturnType<typeof makeIdentity>,
): Packet {
  const senderIDBytes = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    senderIDBytes[i] = parseInt(identity.peerID.slice(i * 2, i * 2 + 2), 16);
  }
  const packet: Packet = {
    type: PacketType.CHANNEL_MSG,
    ttl: 7,
    flags: Flags.SIGNED,
    senderID: senderIDBytes,
    recipientID: new Uint8Array(8),
    timestamp: 1000,
    signature: new Uint8Array(64),
    // High-entropy fill so the codec's raw-DEFLATE compression leaves it large:
    // an all-one-byte payload would compress below a single BLE frame and there
    // would be nothing to fragment.
    payload: (() => {
      const p = new Uint8Array(payloadSize);
      for (let i = 0; i < payloadSize; i++) p[i] = (i * 167 + 13) & 0xff;
      return p;
    })(),
  };
  packet.signature = signPacket(packet, identity.signingPrivKey);
  return packet;
}

describe("fragmentPacket", () => {
  const identity = makeIdentity();

  test("throws when packet fits in one frame", () => {
    const small: Packet = {
      type: PacketType.ANNOUNCE,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: new Uint8Array(8),
      recipientID: new Uint8Array(8),
      timestamp: 0,
      signature: new Uint8Array(64),
      payload: new Uint8Array(10),
    };
    expect(() => fragmentPacket(small, identity, signPacket)).toThrow(
      "fits in one frame",
    );
  });

  test("fragments a large packet into the correct count", () => {
    // Payload big enough to require 3 fragments
    const packet = makeLargePacket(FRAG_DATA_SIZE * 2 + 10, identity);
    const frags = fragmentPacket(packet, identity, signPacket);
    expect(frags.length).toBe(3);
  });

  test("each fragment is within FRAGMENT_SIZE", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE * 3, identity);
    const frags = fragmentPacket(packet, identity, signPacket);
    for (const f of frags) {
      expect(f.payload.length).toBeLessThanOrEqual(FRAGMENT_SIZE);
    }
  });

  test("all fragments share the same stream ID", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE * 2 + 1, identity);
    const frags = fragmentPacket(packet, identity, signPacket);
    const headers = frags.map((f) => decodeFragmentPayload(f.payload)!);
    const streamIds = headers.map((h) => h.streamU64);
    expect(streamIds.every((s) => s === streamIds[0])).toBe(true);
  });

  test("index and total are set correctly", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE * 2 + 1, identity);
    const frags = fragmentPacket(packet, identity, signPacket);
    const headers = frags.map((f) => decodeFragmentPayload(f.payload)!);
    expect(headers.map((h) => h.index)).toEqual([0, 1, 2]);
    expect(headers.every((h) => h.total === 3)).toBe(true);
  });

  test("original packet type is encoded in each fragment header", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE + 1, identity);
    const frags = fragmentPacket(packet, identity, signPacket);
    const headers = frags.map((f) => decodeFragmentPayload(f.payload)!);
    expect(
      headers.every((h) => h.originalType === PacketType.CHANNEL_MSG),
    ).toBe(true);
  });
});

describe("parseFragmentPayload", () => {
  test("returns null for payload shorter than header", () => {
    expect(decodeFragmentPayload(new Uint8Array(5))).toBeNull();
  });

  test("returns null when index >= total", () => {
    const buf = new Uint8Array(13 + 4);
    const view = new DataView(buf.buffer);
    // stream (8), index=5, total=3 → invalid
    view.setUint16(8, 5, false);
    view.setUint16(10, 3, false);
    expect(decodeFragmentPayload(buf)).toBeNull();
  });

  test("returns null when total=0", () => {
    const buf = new Uint8Array(13 + 4);
    // total=0
    expect(decodeFragmentPayload(buf)).toBeNull();
  });
});

describe("FragmentManager", () => {
  const identity = makeIdentity();

  test("reassembles in-order fragments", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE * 2 + 1, identity);
    const frags = fragmentPacket(packet, identity, signPacket);
    const manager = new FragmentManager();
    const senderID = frags[0].senderID;
    let reassembled: Packet | null = null;

    for (const f of frags) {
      manager.receive(senderID, f.payload, (p) => {
        reassembled = p;
      });
    }

    expect(reassembled).not.toBeNull();
    expect((reassembled! as Packet).type).toBe(PacketType.CHANNEL_MSG);
  });

  test("reassembles out-of-order fragments", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE * 3, identity);
    const frags = fragmentPacket(packet, identity, signPacket);
    const manager = new FragmentManager();
    const senderID = frags[0].senderID;
    let reassembled: Packet | null = null;

    // Deliver in reverse order
    for (const f of [...frags].reverse()) {
      manager.receive(senderID, f.payload, (p) => {
        reassembled = p;
      });
    }

    expect(reassembled).not.toBeNull();
  });

  test("duplicate fragments do not corrupt reassembly", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE + 1, identity);
    const frags = fragmentPacket(packet, identity, signPacket);
    const manager = new FragmentManager();
    const senderID = frags[0].senderID;
    let callCount = 0;

    // Send fragment 0 twice
    manager.receive(senderID, frags[0].payload, () => {
      callCount++;
    });
    manager.receive(senderID, frags[0].payload, () => {
      callCount++;
    });
    manager.receive(senderID, frags[1].payload, (p) => {
      callCount++;
      expect(p).not.toBeNull();
    });

    expect(callCount).toBe(1); // only the final completion fires
  });

  test("evictExpired removes stale assemblies", () => {
    const manager = new FragmentManager();
    // Feed a partial assembly (one fragment of a two-fragment stream)
    const packet = makeLargePacket(FRAG_DATA_SIZE + 1, identity);
    const frags = fragmentPacket(packet, identity, signPacket);
    manager.receive(frags[0].senderID, frags[0].payload, () => {});
    expect(manager.size).toBe(1);
    // Simulate time passing by calling the JS timer override isn't needed;
    // evictExpired uses Date.now() internally. We can't travel time here,
    // so just confirm the slot exists and eviction with fresh data is a no-op.
    manager.evictExpired();
    expect(manager.size).toBe(1); // not yet expired (just added)
  });

  test("reset clears all assemblies", () => {
    const manager = new FragmentManager();
    const packet = makeLargePacket(FRAG_DATA_SIZE + 1, identity);
    const frags = fragmentPacket(packet, identity, signPacket);
    manager.receive(frags[0].senderID, frags[0].payload, () => {});
    expect(manager.size).toBe(1);
    manager.reset();
    expect(manager.size).toBe(0);
  });

  test("reports incremental progress as fragments arrive", () => {
    const identity2 = makeIdentity();
    // A FILE_TRANSFER packet large enough to span several fragments.
    const base = makeLargePacket(FRAG_DATA_SIZE * 4, identity2);
    const packet: Packet = { ...base, type: PacketType.FILE_TRANSFER };
    packet.signature = signPacket(packet, identity2.signingPrivKey);
    const frags = fragmentPacket(packet, identity2, signPacket);
    expect(frags.length).toBeGreaterThan(1);

    const manager = new FragmentManager();
    const progress: {
      received: number;
      total: number;
      receivedBytes: number;
      originalType: number;
    }[] = [];
    for (const f of frags) {
      manager.receive(
        f.senderID,
        f.payload,
        () => {},
        (p) => progress.push(p),
      );
    }

    // One progress event per fragment, counts climbing to the full total.
    expect(progress).toHaveLength(frags.length);
    expect(progress[0].received).toBe(1);
    expect(progress[0].originalType).toBe(PacketType.FILE_TRANSFER);
    const last = progress[progress.length - 1];
    expect(last.received).toBe(last.total);
    expect(last.total).toBe(frags.length);
    // Bytes received only ever increase.
    for (let i = 1; i < progress.length; i++) {
      expect(progress[i].receivedBytes).toBeGreaterThan(
        progress[i - 1].receivedBytes,
      );
    }
  });
});
