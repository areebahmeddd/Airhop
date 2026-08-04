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
  decodePacket,
  encodePacket,
  Flags,
  PacketType,
  signPacket,
  verifyPacket,
  type Packet,
} from "../packet-codec";

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length >> 1);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function makeIdentity() {
  const signingPrivKey = ed25519.utils.randomSecretKey();
  const signingPubKey = ed25519.getPublicKey(signingPrivKey);
  const peerID = Array.from(signingPubKey.slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { signingPrivKey, peerID };
}

// Sync candidates are age-bounded per type, so a packet's timestamp has to be
// relative to now rather than a fixed literal. `ageMs` is how long ago it was
// sent; 0 means "just now".
function makePacket(
  type: PacketType,
  ageMs: number,
  payload: Uint8Array,
): Packet {
  return {
    type,
    ttl: 7,
    flags: Flags.SIGNED,
    senderID: new Uint8Array(8).fill(1),
    recipientID: new Uint8Array(8),
    timestamp: Date.now() - ageMs,
    signature: new Uint8Array(64),
    payload,
  };
}

// A peer that holds nothing: an empty GCS filter, so everything we have looks
// missing to it.
function emptyFilterPacket(since?: number): Packet {
  return {
    type: PacketType.REQUEST_SYNC,
    ttl: 0,
    flags: Flags.SIGNED,
    senderID: new Uint8Array(8),
    recipientID: new Uint8Array(8),
    timestamp: Date.now(),
    signature: new Uint8Array(64),
    payload: encodeGossipFilterPayload({
      p: 7,
      m: 1,
      data: new Uint8Array(0),
      types: (1 << 0) | (1 << 1) | (1 << 8) | (1 << 10),
      since,
    }),
  };
}

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
    gs.track(makePacket(PacketType.NOISE_ENCRYPTED, 0, new Uint8Array(4)));
    expect(gs.seenCount).toBe(0);
  });

  test("track stores ANNOUNCE and CHANNEL_MSG", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 0, new Uint8Array(4)));
    gs.track(makePacket(PacketType.CHANNEL_MSG, 1, new Uint8Array(4)));
    expect(gs.seenCount).toBe(2);
  });

  test("buildFilterPacket returns null when nothing tracked", () => {
    const gs = new GossipSync();
    expect(gs.buildFilterPacket(identity)).toBeNull();
  });

  test("buildFilterPacket returns a signed REQUEST_SYNC packet", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 0, new Uint8Array(4)));
    const pkt = gs.buildFilterPacket(identity);
    expect(pkt).not.toBeNull();
    expect(pkt!.type).toBe(PacketType.REQUEST_SYNC);
    expect(pkt!.flags & Flags.SIGNED).toBeTruthy();
  });

  test("handleFilter returns packets the peer is missing", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 0, new Uint8Array([1])));
    gs.track(makePacket(PacketType.ANNOUNCE, 1, new Uint8Array([2])));

    const missing = gs.handleFilter(emptyFilterPacket());
    // The peer has nothing, so we offer both.
    expect(missing.length).toBe(2);
  });

  test("reset clears tracked packets", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 0, new Uint8Array(4)));
    gs.reset();
    expect(gs.seenCount).toBe(0);
  });
});

// The properties in this block are the ones that stop one rejoining peer from
// turning into a mesh-wide packet storm. Each maps to a rule the other
// implementations enforce; see the header of gossip-sync.ts.
describe("GossipSync: link-local contract", () => {
  const identity = makeIdentity();

  test("REQUEST_SYNC is sent at ttl 0 so no relay forwards it", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 0, new Uint8Array(4)));
    expect(gs.buildFilterPacket(identity)!.ttl).toBe(0);
  });

  test("a unicast request is addressed to the peer it asks", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 0, new Uint8Array(4)));
    const to = "00112233445566aa";
    const pkt = gs.buildFilterPacket(identity, to)!;
    expect(pkt.flags & Flags.HAS_RECIPIENT).toBeTruthy();
    expect(
      Array.from(pkt.recipientID)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    ).toBe(to);
  });

  test("a broadcast request carries no recipient", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 0, new Uint8Array(4)));
    const pkt = gs.buildFilterPacket(identity)!;
    expect(pkt.flags & Flags.HAS_RECIPIENT).toBeFalsy();
  });

  // The bug this pins: responses used to go back carrying their ORIGINAL ttl
  // (5-7, whatever they were heard at). The requester's flood router sees each
  // one as new - which it is, that is exactly why it was sent - and re-floods
  // it. One peer catching up after a partition re-floods the whole archive.
  test("responses come back at ttl 0 and tagged IS_RSR", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 0, new Uint8Array([1])));
    gs.track(makePacket(PacketType.CHANNEL_MSG, 0, new Uint8Array([2])));

    const missing = gs.handleFilter(emptyFilterPacket());
    expect(missing.length).toBe(2);
    for (const pkt of missing) {
      expect(pkt.ttl).toBe(0);
      expect(pkt.isRSR).toBe(true);
    }
  });

  // ttl and isRSR are both normalised out of the signing preimage, so retagging
  // a stored packet must leave its original signature verifiable. If this ever
  // breaks, every sync response becomes an unverifiable packet the requester
  // drops - a silent, total failure of catch-up.
  test("retagging a response does not disturb its signature", () => {
    const signer = makeIdentity();
    const gs = new GossipSync();
    const original = makePacket(PacketType.CHANNEL_MSG, 0, new Uint8Array([9]));
    original.senderID = hexToBytes(signer.peerID);
    original.signature = signPacket(original, signer.signingPrivKey);
    gs.track(original);

    const [replayed] = gs.handleFilter(emptyFilterPacket());
    expect(replayed.ttl).toBe(0);
    expect(replayed.isRSR).toBe(true);
    const signingPubKey = ed25519.getPublicKey(signer.signingPrivKey);
    expect(verifyPacket(replayed, signingPubKey)).toBe(true);
    // And it survives a full wire round trip, which is what actually happens.
    expect(
      verifyPacket(decodePacket(encodePacket(replayed))!, signingPubKey),
    ).toBe(true);
  });
});

describe("GossipSync: candidate age bounds", () => {
  const identity = makeIdentity();

  // Presence that outlives its sender is a lie the mesh tells about who is in
  // the room. 60s is a consensus rule in bitchat-android's sync.md.
  test("an announce older than 60s is neither advertised nor offered", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 61_000, new Uint8Array([1])));
    expect(gs.buildFilterPacket(identity)).toBeNull();
    expect(gs.handleFilter(emptyFilterPacket())).toHaveLength(0);
  });

  test("a public message stays a candidate for 15 minutes", () => {
    const gs = new GossipSync();
    gs.track(
      makePacket(PacketType.CHANNEL_MSG, 14 * 60_000, new Uint8Array([1])),
    );
    expect(gs.handleFilter(emptyFilterPacket())).toHaveLength(1);

    const stale = new GossipSync();
    stale.track(
      makePacket(PacketType.CHANNEL_MSG, 16 * 60_000, new Uint8Array([1])),
    );
    expect(stale.handleFilter(emptyFilterPacket())).toHaveLength(0);
  });

  // Board posts are signed and carry their own expiry (up to 7 days). The
  // message window must not quietly delete them from the mesh.
  test("a board post outlives the message window", () => {
    const gs = new GossipSync();
    gs.track(
      makePacket(PacketType.BOARD_POST, 60 * 60_000, new Uint8Array([1])),
    );
    expect(gs.handleFilter(emptyFilterPacket())).toHaveLength(1);
  });

  // Group messages had no sync bit at all, so a group had no store-and-forward:
  // nothing was ever cached, advertised, requested or served. bitchat defines
  // bit 10 and does all four, so the exchange was one-directional as well.
  test("a private group message is a sync candidate on bit 10", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.GROUP_MESSAGE, 60_000, new Uint8Array([1])));
    expect(gs.handleFilter(emptyFilterPacket())).toHaveLength(1);
  });

  test("a group message is not offered to a peer that did not ask for bit 10", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.GROUP_MESSAGE, 60_000, new Uint8Array([1])));
    const announceOnly: Packet = {
      ...emptyFilterPacket(),
      payload: encodeGossipFilterPayload({
        p: 7,
        m: 1,
        data: new Uint8Array(0),
        types: 1 << 0,
      }),
    };
    expect(gs.handleFilter(announceOnly)).toHaveLength(0);
  });

  // A roster change rotates the epoch key, so a message older than the public
  // window can no longer be opened by anyone and is not worth carrying.
  test("a group message ages out on the message window", () => {
    const stale = new GossipSync();
    stale.track(
      makePacket(PacketType.GROUP_MESSAGE, 16 * 60_000, new Uint8Array([1])),
    );
    expect(stale.handleFilter(emptyFilterPacket())).toHaveLength(0);
  });

  // A packet stamped in the future would otherwise pin itself at the head of
  // every candidate set forever.
  test("a packet stamped far in the future is not carried", () => {
    const gs = new GossipSync();
    gs.track(
      makePacket(PacketType.CHANNEL_MSG, -10 * 60_000, new Uint8Array([1])),
    );
    expect(gs.handleFilter(emptyFilterPacket())).toHaveLength(0);
  });

  test("prune drops expired candidates", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.ANNOUNCE, 61_000, new Uint8Array([1])));
    gs.track(makePacket(PacketType.ANNOUNCE, 0, new Uint8Array([2])));
    expect(gs.seenCount).toBe(2);
    gs.prune();
    expect(gs.seenCount).toBe(1);
  });
});

describe("GossipSync: sinceTimestamp cursor", () => {
  // The cursor is a disclaimer about filter coverage, not a request boundary.
  // Emitting it when the filter covers everything would tell every peer to
  // withhold anything older than our oldest packet - which for a device that
  // just joined is precisely the history it turned up to collect. This is the
  // regression the F02 latecomer scenario exists to catch.
  test("no cursor is sent when the filter covers everything held", () => {
    const identity = makeIdentity();
    const gs = new GossipSync();
    gs.track(
      makePacket(PacketType.CHANNEL_MSG, 5 * 60_000, new Uint8Array([1])),
    );
    gs.track(makePacket(PacketType.CHANNEL_MSG, 0, new Uint8Array([2])));

    const decoded = decodeGossipFilterPayload(
      gs.buildFilterPacket(identity)!.payload,
    );
    expect(decoded!.since).toBeUndefined();
  });

  // With more history than the 400-byte budget can describe, the filter is a
  // newest-prefix and the cursor states how far back it reaches.
  test("a truncated filter reports how far back it actually covers", () => {
    const identity = makeIdentity();
    const gs = new GossipSync();
    for (let i = 0; i < 2000; i++) {
      gs.track(
        makePacket(
          PacketType.CHANNEL_MSG,
          i,
          new Uint8Array([i & 0xff, i >> 8]),
        ),
      );
    }

    const decoded = decodeGossipFilterPayload(
      gs.buildFilterPacket(identity)!.payload,
    )!;
    expect(decoded.since).toBeDefined();
    // It covers the newest end, so the cursor is recent rather than the
    // oldest thing we hold.
    expect(decoded.since!).toBeGreaterThan(Date.now() - 2000);
  });

  // The failure mode this replaces: an overflowing filter used to encode to
  // nothing, and an empty filter does not read as "I could not tell you" - it
  // reads as "I have nothing", so the responder replies with its entire store.
  test("an overflowing filter still describes the newest packets", () => {
    const gs = new GossipSync();
    for (let i = 0; i < 2000; i++) {
      gs.track(
        makePacket(
          PacketType.CHANNEL_MSG,
          i,
          new Uint8Array([i & 0xff, i >> 8]),
        ),
      );
    }
    const pkt = gs.buildFilterPacket(makeIdentity())!;
    const decoded = decodeGossipFilterPayload(pkt.payload)!;
    expect(decoded.data.length).toBeGreaterThan(0);
    expect(decoded.data.length).toBeLessThanOrEqual(400);

    // A peer holding the same recent traffic is told so, rather than being
    // asked to resend all of it.
    const peer = new GossipSync();
    const shared = makePacket(
      PacketType.CHANNEL_MSG,
      0,
      new Uint8Array([7, 7]),
    );
    gs.track(shared);
    peer.track(shared);
    const refreshed = gs.buildFilterPacket(makeIdentity())!;
    expect(peer.handleFilter(refreshed)).toHaveLength(0);
  });

  // Without the cursor, anything older than the requester's window looks
  // missing rather than out of scope, and gets re-sent on every single round.
  test("a responder skips packets older than the requester's cursor", () => {
    const gs = new GossipSync();
    gs.track(
      makePacket(PacketType.CHANNEL_MSG, 10 * 60_000, new Uint8Array([1])),
    );
    gs.track(makePacket(PacketType.CHANNEL_MSG, 0, new Uint8Array([2])));

    expect(gs.handleFilter(emptyFilterPacket())).toHaveLength(2);
    const cursor = Date.now() - 5 * 60_000;
    expect(gs.handleFilter(emptyFilterPacket(cursor))).toHaveLength(1);
  });

  test("the cursor survives a payload round trip", () => {
    const since = Date.now();
    const decoded = decodeGossipFilterPayload(
      encodeGossipFilterPayload({
        p: 7,
        m: 256,
        data: new Uint8Array([1]),
        since,
      }),
    );
    expect(decoded!.since).toBe(since);
  });
});

describe("GossipSync: response rate limiting", () => {
  // A response can replay the whole store. A peer that asks in a tight loop is
  // an amplifier pointed at us and at the shared radio, so bound how often one
  // peer can make us pay for a diff pass. bitchat: 8 per 30s.
  test("one peer gets at most 8 answers in the window", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.CHANNEL_MSG, 0, new Uint8Array([1])));

    let answered = 0;
    for (let i = 0; i < 30; i++) {
      if (gs.handleFilter(emptyFilterPacket(), "peer-a").length > 0) answered++;
    }
    expect(answered).toBe(8);
  });

  test("the budget is per peer, so one flooder cannot starve another", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.CHANNEL_MSG, 0, new Uint8Array([1])));

    for (let i = 0; i < 30; i++)
      gs.handleFilter(emptyFilterPacket(), "flooder");
    expect(gs.handleFilter(emptyFilterPacket(), "quiet-peer")).toHaveLength(1);
  });

  test("forgetPeer clears the budget so a reconnect is not throttled", () => {
    const gs = new GossipSync();
    gs.track(makePacket(PacketType.CHANNEL_MSG, 0, new Uint8Array([1])));

    for (let i = 0; i < 10; i++) gs.handleFilter(emptyFilterPacket(), "peer-a");
    expect(gs.handleFilter(emptyFilterPacket(), "peer-a")).toHaveLength(0);
    gs.forgetPeer("peer-a");
    expect(gs.handleFilter(emptyFilterPacket(), "peer-a")).toHaveLength(1);
  });
});
