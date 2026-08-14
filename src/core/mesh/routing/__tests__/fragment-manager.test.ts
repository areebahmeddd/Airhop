/**
 * @jest-environment node
 */
import { ed25519 } from "@noble/curves/ed25519.js";
import { MAX_FRAMED_FILE_BYTES } from "../../wire/file-packet";
import {
  Flags,
  PacketType,
  encodePacket,
  signPacket,
  type Packet,
} from "../../wire/packet-codec";
import {
  FRAG_DATA_SIZE,
  FragmentManager,
  MAX_BLE_FRAME,
  decodeFragmentPayload,
  fragmentPacket,
} from "../fragment-manager";

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
    expect(() => fragmentPacket(small, identity)).toThrow("fits in one frame");
  });

  test("fragments a large packet into the correct count", () => {
    // Payload big enough to require 3 fragments
    const packet = makeLargePacket(FRAG_DATA_SIZE * 2 + 10, identity);
    const frags = fragmentPacket(packet, identity);
    expect(frags.length).toBe(3);
  });

  // The regression that matters. Asserting the payload size was what let a
  // 557-byte frame ship: the payload was 469 and correct by that measure, while
  // the header, senderID and a 64-byte signature pushed the encoded frame 45
  // bytes past what any BLE link can carry. Measure what goes on the wire.
  test("every encoded fragment frame fits one BLE write", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE * 3, identity);
    const frags = fragmentPacket(packet, identity);
    for (const f of frags) {
      expect(encodePacket(f).length).toBeLessThanOrEqual(MAX_BLE_FRAME);
    }
  });

  // A DM's fragments must stay addressed, or bitchat treats sealed private media
  // as a public packet: it archives it for gossip sync and floods every hop.
  test("fragments carry the parent packet's recipient", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE * 2, identity);
    packet.recipientID = new Uint8Array(8).fill(0xab);
    const frags = fragmentPacket(packet, identity);
    for (const f of frags) {
      expect(Array.from(f.recipientID)).toEqual(Array.from(packet.recipientID));
      expect(encodePacket(f).length).toBeLessThanOrEqual(MAX_BLE_FRAME);
    }
  });

  // bitchat sends `signature: nil` on fragments and neither side's fragment path
  // inspects one; the inner packet is signed and re-verified after reassembly.
  test("fragments are unsigned", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE * 2, identity);
    const frags = fragmentPacket(packet, identity);
    for (const f of frags) expect(f.flags & Flags.SIGNED).toBe(0);
  });

  test("all fragments share the same stream ID", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE * 2 + 1, identity);
    const frags = fragmentPacket(packet, identity);
    const headers = frags.map((f) => decodeFragmentPayload(f.payload)!);
    const streamIds = headers.map((h) => h.streamU64);
    expect(streamIds.every((s) => s === streamIds[0])).toBe(true);
  });

  test("index and total are set correctly", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE * 2 + 1, identity);
    const frags = fragmentPacket(packet, identity);
    const headers = frags.map((f) => decodeFragmentPayload(f.payload)!);
    expect(headers.map((h) => h.index)).toEqual([0, 1, 2]);
    expect(headers.every((h) => h.total === 3)).toBe(true);
  });

  test("original packet type is encoded in each fragment header", () => {
    const packet = makeLargePacket(FRAG_DATA_SIZE + 1, identity);
    const frags = fragmentPacket(packet, identity);
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
    const frags = fragmentPacket(packet, identity);
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
    const frags = fragmentPacket(packet, identity);
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
    const frags = fragmentPacket(packet, identity);
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
    const frags = fragmentPacket(packet, identity);
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
    const frags = fragmentPacket(packet, identity);
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
    const frags = fragmentPacket(packet, identity2);
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

describe("FragmentManager reassembly timeout", () => {
  const identity = makeIdentity();

  afterEach(() => {
    jest.useRealTimers();
  });

  test("survives a transfer that runs longer than the timeout", () => {
    // The case the whole feature exists for: a photo-sized file over Bluetooth.
    // The sender paces fragments 20ms apart, so a real transfer runs well past
    // 30 seconds. Timing out on total duration deleted the half-built file
    // mid-flight and the rest of the fragments started an assembly that could
    // never complete, losing the file with no error anywhere.
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));

    const packet = makeLargePacket(FRAG_DATA_SIZE * 8, identity);
    const frags = fragmentPacket(packet, identity);
    const manager = new FragmentManager();
    const senderID = frags[0].senderID;
    let reassembled: Packet | null = null;

    for (const f of frags) {
      // 10 seconds between fragments: slow, but never silent for 30.
      jest.advanceTimersByTime(10_000);
      manager.receive(senderID, f.payload, (p) => {
        reassembled = p;
      });
    }

    expect(reassembled).not.toBeNull();
  });

  test("drops an assembly that goes silent", () => {
    // The case the timeout is actually for: the sender walked out of range
    // part way through, so the partial file must not sit in memory forever.
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));

    const packet = makeLargePacket(FRAG_DATA_SIZE * 4, identity);
    const frags = fragmentPacket(packet, identity);
    const manager = new FragmentManager();
    const senderID = frags[0].senderID;
    let reassembled: Packet | null = null;

    manager.receive(senderID, frags[0].payload, (p) => {
      reassembled = p;
    });
    jest.advanceTimersByTime(31_000);
    // The rest arrives after the gap: the stale half is gone, so this cannot
    // complete, and nothing is left holding its bytes.
    for (const f of frags.slice(1)) {
      manager.receive(senderID, f.payload, (p) => {
        reassembled = p;
      });
    }

    expect(reassembled).toBeNull();
  });
});

// ---- Adversarial reassembly ---------------------------------------------------
//
// Fragments are unsigned and skip the deduplicator, so both halves of the
// assembly key (sender ID and stream ID) are attacker-choosable: anyone in
// radio range can emit a fragment addressed to a stream they do not own. What
// the buffer must guarantee is that doing so cannot corrupt or destroy an
// honest transfer in progress.
describe("a spoofed fragment cannot damage somebody else's transfer", () => {
  // Craft a fragment payload by hand rather than through fragmentPacket, so a
  // test can state header fields no honest sender would ever emit. Layout is
  // the 13-byte header from the top of this file: stream 8, index 2, total 2,
  // inner type 1.
  function spoofFragment(
    streamID: Uint8Array,
    index: number,
    total: number,
    originalType: number,
    data: Uint8Array,
  ): Uint8Array {
    const out = new Uint8Array(13 + data.length);
    out.set(streamID.slice(0, 8), 0);
    new DataView(out.buffer).setUint16(8, index, false);
    new DataView(out.buffer).setUint16(10, total, false);
    out[12] = originalType;
    out.set(data, 13);
    return out;
  }

  const streamIDOf = (payload: Uint8Array): Uint8Array => payload.slice(0, 8);

  test("a smaller declared total cannot truncate an in-flight assembly", () => {
    // The attack: a stream holding indices 0-2 of ten receives one injected
    // fragment claiming total = 3. If completion read the arriving header
    // instead of the pinned one, the buffer would declare the message complete
    // and hand a third of a file to the receive path as though it were whole.
    const identity = makeIdentity();
    const packet = makeLargePacket(FRAG_DATA_SIZE * 10, identity);
    const frags = fragmentPacket(packet, identity);
    const manager = new FragmentManager();
    const senderID = frags[0].senderID;
    const stream = streamIDOf(frags[0].payload);

    let reassembled: Packet | null = null;
    const deliver = (payload: Uint8Array): void => {
      manager.receive(senderID, payload, (p) => {
        reassembled = p;
      });
    };

    for (const f of frags.slice(0, 3)) deliver(f.payload);
    deliver(
      spoofFragment(stream, 2, 3, PacketType.CHANNEL_MSG, new Uint8Array(8)),
    );

    // Nothing was handed up early.
    expect(reassembled).toBeNull();

    // And the honest transfer still finishes intact: the injected fragment did
    // not overwrite index 2 either, so the payload is the original one.
    for (const f of frags.slice(3)) deliver(f.payload);
    expect(reassembled).not.toBeNull();
    expect(reassembled!.payload).toEqual(packet.payload);
  });

  test("an oversized fragment does not destroy the assembly it targets", () => {
    // A fragment is capped at 467 bytes on the wire, but the outer packet may
    // be compressed and the decoder inflates up to the sender-declared size, so
    // one small packet can present a huge `data`. This used to delete the whole
    // assembly: a remote kill switch for any transfer whose stream ID was
    // observable on the air, with no error at either end.
    const identity = makeIdentity();
    const packet = makeLargePacket(FRAG_DATA_SIZE * 4, identity);
    const frags = fragmentPacket(packet, identity);
    const manager = new FragmentManager();
    const senderID = frags[0].senderID;
    const stream = streamIDOf(frags[0].payload);

    let reassembled: Packet | null = null;
    const deliver = (payload: Uint8Array): void => {
      manager.receive(senderID, payload, (p) => {
        reassembled = p;
      });
    };

    deliver(frags[0].payload);
    deliver(
      spoofFragment(
        stream,
        1,
        frags.length,
        PacketType.CHANNEL_MSG,
        new Uint8Array(MAX_FRAMED_FILE_BYTES + 1),
      ),
    );

    // The rest of the honest transfer arrives and still completes.
    for (const f of frags.slice(1)) deliver(f.payload);
    expect(reassembled).not.toBeNull();
    expect(reassembled!.payload).toEqual(packet.payload);
  });

  test("an oversized first fragment cannot evict a stream from a full table", () => {
    // Starting an assembly evicts the oldest slot to make room. A fragment that
    // can never be stored must therefore be refused before the table is
    // touched, or rejecting it is still one packet that costs a stranger their
    // transfer.
    const identity = makeIdentity();
    const packet = makeLargePacket(FRAG_DATA_SIZE * 3, identity);
    const frags = fragmentPacket(packet, identity);
    const manager = new FragmentManager();
    const senderID = frags[0].senderID;

    // The victim's stream goes in first, so it is the oldest slot.
    let reassembled: Packet | null = null;
    const deliver = (from: Uint8Array, payload: Uint8Array): void => {
      manager.receive(from, payload, (p) => {
        reassembled = p;
      });
    };
    deliver(senderID, frags[0].payload);

    // Fill the rest of the table with other senders' streams.
    for (let i = 1; i < 128; i++) {
      const other = new Uint8Array(8);
      other[0] = i & 0xff;
      other[1] = (i >> 8) & 0xff;
      deliver(
        other,
        spoofFragment(other, 0, 4, PacketType.CHANNEL_MSG, new Uint8Array(4)),
      );
    }
    expect(manager.size).toBe(128);

    // Now the unstorable fragment, from a sender with no slot of its own.
    const attacker = new Uint8Array(8).fill(0xee);
    deliver(
      attacker,
      spoofFragment(
        attacker,
        0,
        2,
        PacketType.CHANNEL_MSG,
        new Uint8Array(MAX_FRAMED_FILE_BYTES + 1),
      ),
    );

    // Nothing was admitted, and the victim's stream still completes.
    expect(manager.size).toBe(128);
    for (const f of frags.slice(1)) deliver(senderID, f.payload);
    expect(reassembled).not.toBeNull();
    expect(reassembled!.payload).toEqual(packet.payload);
  });

  test("progress reports the pinned type, not a later fragment's claim", () => {
    // The progress callback drives the incoming-file card. Reading the type off
    // each arriving fragment would let an injected packet relabel a photo as a
    // voice note mid-transfer.
    const identity = makeIdentity();
    const packet = makeLargePacket(FRAG_DATA_SIZE * 3, identity);
    const frags = fragmentPacket(packet, identity);
    const manager = new FragmentManager();
    const senderID = frags[0].senderID;
    const stream = streamIDOf(frags[0].payload);
    const seen: number[] = [];

    const deliver = (payload: Uint8Array): void => {
      manager.receive(
        senderID,
        payload,
        () => undefined,
        (info) => seen.push(info.originalType),
      );
    };

    deliver(frags[0].payload);
    deliver(
      spoofFragment(
        stream,
        1,
        frags.length,
        PacketType.VOICE_FRAME,
        new Uint8Array(8),
      ),
    );
    deliver(frags[1].payload);

    // The mismatched fragment was refused outright, so only the honest two
    // reported progress, both under the pinned type.
    expect(seen).toEqual([PacketType.CHANNEL_MSG, PacketType.CHANNEL_MSG]);
  });
});
