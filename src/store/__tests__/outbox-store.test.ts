/**
 * @jest-environment node
 */
// Outbox tests.
//
// This queue is the difference between "queued for delivery" being true and
// being a lie, so the properties that matter are: nothing is lost, nothing is
// delivered twice, and nothing lingers forever.

import {
  MAX_PENDING_PER_PEER,
  MAX_SEND_ATTEMPTS,
  OUTBOX_TTL_MS,
  useOutboxStore,
} from "../outbox-store";

beforeEach(() => {
  useOutboxStore.getState().clearAll();
});

function state() {
  return useOutboxStore.getState();
}

function enqueue(id: string, peerID: string, createdAtMs = Date.now()) {
  state().enqueue({
    id,
    recipientPeerID: peerID,
    channel: `dm:${peerID}`,
    text: `msg ${id}`,
    createdAtMs,
  });
}

const PEER_A = "aabbccdd00112233";
const PEER_B = "9f8e7d6c5b4a3210";

describe("enqueue", () => {
  it("queues a message for a peer", () => {
    enqueue("m1", PEER_A);
    expect(state().forPeer(PEER_A)).toHaveLength(1);
    expect(state().forPeer(PEER_A)[0].attempts).toBe(0);
  });

  it("does not double-queue the same message id", () => {
    enqueue("m1", PEER_A);
    enqueue("m1", PEER_A);
    expect(state().forPeer(PEER_A)).toHaveLength(1);
  });

  it("keeps peers' queues separate", () => {
    enqueue("m1", PEER_A);
    enqueue("m2", PEER_B);
    expect(
      state()
        .forPeer(PEER_A)
        .map((m) => m.id),
    ).toEqual(["m1"]);
    expect(
      state()
        .forPeer(PEER_B)
        .map((m) => m.id),
    ).toEqual(["m2"]);
  });
});

describe("ordering and resolution", () => {
  it("returns a peer's messages oldest first", () => {
    const t = Date.now();
    enqueue("newer", PEER_A, t + 5000);
    enqueue("older", PEER_A, t);
    expect(
      state()
        .forPeer(PEER_A)
        .map((m) => m.id),
    ).toEqual(["older", "newer"]);
  });

  it("removes a message once delivered", () => {
    enqueue("m1", PEER_A);
    enqueue("m2", PEER_A);
    state().resolve("m1");
    expect(
      state()
        .forPeer(PEER_A)
        .map((m) => m.id),
    ).toEqual(["m2"]);
  });

  it("resolving is idempotent", () => {
    enqueue("m1", PEER_A);
    state().resolve("m1");
    state().resolve("m1");
    expect(state().forPeer(PEER_A)).toHaveLength(0);
  });

  it("records delivery attempts without dropping the message", () => {
    enqueue("m1", PEER_A);
    state().markAttempted("m1");
    state().markAttempted("m1");
    expect(state().forPeer(PEER_A)[0].attempts).toBe(2);
  });
});

describe("expiry", () => {
  it("evicts messages older than the TTL", () => {
    const now = Date.now();
    enqueue("stale", PEER_A, now - OUTBOX_TTL_MS - 1);
    enqueue("fresh", PEER_A, now);

    state().evictExpired(now);

    expect(
      state()
        .forPeer(PEER_A)
        .map((m) => m.id),
    ).toEqual(["fresh"]);
  });

  it("keeps a message exactly at the TTL boundary", () => {
    const now = Date.now();
    enqueue("edge", PEER_A, now - OUTBOX_TTL_MS);
    state().evictExpired(now);
    expect(state().forPeer(PEER_A)).toHaveLength(1);
  });

  it("is a no-op when nothing has expired", () => {
    const now = Date.now();
    enqueue("m1", PEER_A, now);
    const before = state().pending;
    expect(state().evictExpired(now)).toEqual([]);
    // Same array reference: no needless re-render of subscribers.
    expect(state().pending).toBe(before);
  });

  it("reports what it dropped, so the bubble can stop waiting", () => {
    const now = Date.now();
    enqueue("stale", PEER_A, now - OUTBOX_TTL_MS - 1);

    const dropped = state().evictExpired(now);

    // Eviction used to be silent, which left the sender's message under a
    // "waiting to send" hourglass forever for something that was never going
    // out again. The caller marks these failed.
    expect(dropped.map((m) => m.id)).toEqual(["stale"]);
  });

  it("gives up after MAX_SEND_ATTEMPTS real send opportunities", () => {
    // bitchat's number with bitchat's meaning. An attempt is charged only when
    // something actually went out over a route that could have acked it, and
    // retries fire on delivery opportunities rather than on a timer, so eight is
    // eight genuine chances. Charged per timer tick this same constant would
    // turn a seven-day queue into six minutes.
    const now = Date.now();
    enqueue("tried", PEER_A, now);
    for (let i = 0; i < MAX_SEND_ATTEMPTS; i++) state().markAttempted("tried");

    const dropped = state().evictExpired(now);
    expect(dropped.map((m) => m.id)).toEqual(["tried"]);
    expect(state().forPeer(PEER_A)).toHaveLength(0);
  });

  it("keeps a message that has not used its attempts up", () => {
    const now = Date.now();
    enqueue("owed", PEER_A, now);
    for (let i = 0; i < MAX_SEND_ATTEMPTS - 1; i++)
      state().markAttempted("owed");

    expect(state().evictExpired(now)).toEqual([]);
    expect(state().forPeer(PEER_A)).toHaveLength(1);
  });

  it("caps per recipient, so one dead conversation cannot evict another", () => {
    const now = Date.now();
    // One unreachable peer fills its own allowance and then some.
    for (let i = 0; i < MAX_PENDING_PER_PEER + 5; i++) {
      enqueue(`a${String(i)}`, PEER_A, now + i);
    }
    enqueue("b-important", PEER_B, now);

    // A single global cap evicted the oldest entry whatever it was, so the
    // chatty peer above would silently have deleted this one.
    expect(
      state()
        .forPeer(PEER_B)
        .map((m) => m.id),
    ).toEqual(["b-important"]);
    expect(state().forPeer(PEER_A)).toHaveLength(MAX_PENDING_PER_PEER);
    // Oldest-first within that peer.
    expect(state().forPeer(PEER_A)[0].id).toBe("a5");
  });
});
