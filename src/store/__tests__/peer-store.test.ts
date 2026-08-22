/**
 * @jest-environment node
 */
// Peer store regression tests.
//
// These pin two behaviours that are easy to break because the two writers
// (ANNOUNCE-driven upsertPeer, RSSI-poll-driven updateRssi) touch the same
// entry from different sources at different cadences.

import {
  countReachablePeers,
  hasUnseenPeers,
  REACHABLE_TTL_MS,
  usePeerStore,
  type NearbyPeer,
} from "../peer-store";

beforeEach(() => {
  usePeerStore.getState().clearAll();
});

function state() {
  return usePeerStore.getState();
}

function makePeer(overrides: Partial<NearbyPeer> = {}): NearbyPeer {
  return {
    peerID: "aabbccdd00112233",
    nickname: "swift-otter-42",
    lastSeenMs: Date.now(),
    noisePubKeyHex: "11".repeat(32),
    ...overrides,
  };
}

describe("upsertPeer", () => {
  it("preserves an existing rssi when an ANNOUNCE update arrives", () => {
    // ANNOUNCE payloads carry no signal reading, so a naive replace would wipe
    // the value the RSSI poller just wrote (every 30s, in practice).
    state().upsertPeer(makePeer());
    state().updateRssi("aabbccdd00112233", -57);

    state().upsertPeer(makePeer({ nickname: "renamed" }));

    const peer = state().getPeer("aabbccdd00112233");
    expect(peer?.rssi).toBe(-57);
    expect(peer?.nickname).toBe("renamed");
  });

  it("lets an explicit rssi in the update win", () => {
    state().upsertPeer(makePeer());
    state().updateRssi("aabbccdd00112233", -57);
    state().upsertPeer(makePeer({ rssi: -80 }));
    expect(state().getPeer("aabbccdd00112233")?.rssi).toBe(-80);
  });
});

describe("updateRssi", () => {
  it("does not refresh lastSeenMs", () => {
    // RSSI is polled off the GATT link every 5s. If that counted as liveness a
    // peer whose ANNOUNCE timer died would be pinned "just seen" forever and
    // evictStale could never remove it, a permanent ghost on the Mesh tab.
    const stale = Date.now() - 50_000;
    state().upsertPeer(makePeer({ lastSeenMs: stale }));
    // upsertPeer stamps its own lastSeenMs, so re-read the stored value.
    const before = state().getPeer("aabbccdd00112233")?.lastSeenMs;

    state().updateRssi("aabbccdd00112233", -60);

    expect(state().getPeer("aabbccdd00112233")?.lastSeenMs).toBe(before);
    expect(state().getPeer("aabbccdd00112233")?.rssi).toBe(-60);
  });

  it("is a no-op for an unknown peer", () => {
    // A signal reading alone does not tell us who the peer is.
    state().updateRssi("ffffffffffffffff", -60);
    expect(state().getPeer("ffffffffffffffff")).toBeUndefined();
  });

  it("leaves a peer evictable once its announces stop, despite RSSI polls", () => {
    // The real ghost-peer scenario: the GATT link stays up (so RSSI keeps
    // polling every 5s) but the peer stops announcing. It must still age out.
    jest.useFakeTimers();
    try {
      jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      state().upsertPeer(makePeer());

      // 90s later, past the 60s reachable TTL, with only RSSI polls between.
      jest.setSystemTime(new Date("2026-01-01T00:01:30Z"));
      state().updateRssi("aabbccdd00112233", -60);
      state().evictStale();

      expect(state().getPeer("aabbccdd00112233")).toBeUndefined();
    } finally {
      jest.useRealTimers();
    }
  });
});

describe("countReachablePeers", () => {
  it("counts only peers seen inside the reachable window", () => {
    const now = 1_000_000;
    const peers = new Map<string, NearbyPeer>([
      ["a", makePeer({ peerID: "a", lastSeenMs: now - 1_000 })],
      ["b", makePeer({ peerID: "b", lastSeenMs: now - 59_000 })],
      // Walked off without a LEAVE: still in the map, no longer reachable.
      ["c", makePeer({ peerID: "c", lastSeenMs: now - 120_000 })],
    ]);
    expect(countReachablePeers(peers, now)).toBe(2);
  });

  it("counts an empty map as an empty mesh", () => {
    expect(countReachablePeers(new Map(), 1_000_000)).toBe(0);
  });
});

describe("unseen peers", () => {
  it("reports a peer nobody has looked at yet", () => {
    state().upsertPeer(makePeer());
    expect(hasUnseenPeers(state())).toBe(true);
  });

  it("goes quiet once the Mesh screen has been looked at", () => {
    state().upsertPeer(makePeer());
    state().markPeersSeen();
    expect(hasUnseenPeers(state())).toBe(false);
  });

  it("reports a newcomer arriving after that", () => {
    state().upsertPeer(makePeer());
    state().markPeersSeen();
    state().upsertPeer(makePeer({ peerID: "ffeeddcc99887766" }));
    expect(hasUnseenPeers(state())).toBe(true);
  });

  it("reports a swap that leaves the count unchanged", () => {
    const first = makePeer();
    state().upsertPeer(first);
    state().markPeersSeen();
    state().removePeer(first.peerID);
    state().upsertPeer(makePeer({ peerID: "ffeeddcc99887766" }));
    expect(hasUnseenPeers(state())).toBe(true);
  });

  it("ignores a peer who has gone stale", () => {
    state().upsertPeer(makePeer());
    state().markPeersSeen();
    state().upsertPeer(
      makePeer({ peerID: "ffeeddcc99887766", lastSeenMs: Date.now() }),
    );
    expect(hasUnseenPeers(state(), Date.now() + REACHABLE_TTL_MS + 1)).toBe(
      false,
    );
  });

  it("forgets peers who are no longer here", () => {
    const first = makePeer();
    state().upsertPeer(first);
    state().markPeersSeen();
    state().removePeer(first.peerID);
    state().markPeersSeen();
    expect(state().seenPeerIDs.has(first.peerID)).toBe(false);
  });
});
