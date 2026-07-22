/**
 * @jest-environment node
 */
// Outbox tests.
//
// This queue is the difference between "queued for delivery" being true and
// being a lie, so the properties that matter are: nothing is lost, nothing is
// delivered twice, and nothing lingers forever.

import { OUTBOX_TTL_MS, useOutboxStore } from "../outbox-store";

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
    state().evictExpired(now);
    // Same array reference: no needless re-render of subscribers.
    expect(state().pending).toBe(before);
  });
});
