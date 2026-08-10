// Inbound relay traffic must never hold the JS thread.
//
// The field report these cover: a fresh install with WiFi on froze on the Mesh
// screen. The radar's sonar loop pulsed once and stopped, the tab bar answered
// nothing, and a relaunch sat on a black screen - all of which are what a
// blocked JS thread looks like from the outside. With WiFi off the same build
// was fine, because with no relay reachable none of the traffic arrived.
//
// Two things caused it, and both are fixed separately. The volume was a
// deletion filter asking for everything a relay held (geohash-channel-service).
// The shape was this: handlers ran inline on the socket callback, so however
// much arrived at once ran as one unbroken block of JS with no frame in
// between.
//
// These assert the shape. The properties that matter are that nothing is
// dispatched synchronously from the socket callback, that a burst is spread
// across turns rather than run as one, that order survives, and that a handler
// which throws does not strand the queue behind it.

import type { Event } from "nostr-tools";
import { NostrClient } from "../nostr-client";

// The pool stands in for a relay: `emit` is the socket callback, calling
// straight into whatever onevent the client registered.
let emit: (event: Event) => void = () => undefined;

jest.mock("nostr-tools/pool", () => ({
  SimplePool: class {
    onRelayConnectionSuccess?: () => void;
    onRelayConnectionFailure?: () => void;
    subscribeMany(
      _relays: string[],
      _filter: unknown,
      params: { onevent: (event: Event) => void },
    ): { close: () => void } {
      emit = params.onevent;
      return { close: () => undefined };
    }
    listConnectionStatus(): Map<string, boolean> {
      return new Map();
    }
    destroy(): void {}
  },
}));

function eventWithId(id: string): Event {
  return {
    id,
    pubkey: "f".repeat(64),
    created_at: 0,
    kind: 1,
    tags: [],
    content: "",
    sig: "0".repeat(128),
  };
}

// One turn of the pump: it schedules itself on a zero-delay timer.
async function pumpOnce(): Promise<void> {
  jest.advanceTimersByTime(0);
  await Promise.resolve();
}

// Drain to completion, however many slices it takes.
async function drain(): Promise<void> {
  for (let i = 0; i < 200; i++) await pumpOnce();
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("the inbound pump", () => {
  it("does not run a handler inside the socket callback", () => {
    const client = new NostrClient();
    const seen: string[] = [];
    client.subscribe([{ kinds: [1] }], (e) => seen.push(e.id));

    emit(eventWithId("a"));

    // The whole point: returning from the socket callback with nothing run is
    // what leaves the thread free for the frame that is due.
    expect(seen).toEqual([]);
  });

  it("delivers everything, in the order it arrived", async () => {
    const client = new NostrClient();
    const seen: string[] = [];
    client.subscribe([{ kinds: [1] }], (e) => seen.push(e.id));

    const ids = Array.from({ length: 50 }, (_, i) => `e${i}`);
    for (const id of ids) emit(eventWithId(id));
    await drain();

    expect(seen).toEqual(ids);
  });

  // Real timers and real wall clock here: the slice is measured in milliseconds,
  // and a fake clock the test drives would only prove the test can count.
  it("spreads a burst of slow handlers across turns instead of running it as one", async () => {
    jest.useRealTimers();
    const client = new NostrClient();
    const seen: string[] = [];
    // Each handler burns ~3ms, so an 8ms slice fits a couple and a burst of
    // twelve cannot be one turn's work however the slice lands.
    client.subscribe([{ kinds: [1] }], (e) => {
      const until = Date.now() + 3;
      while (Date.now() < until) {
        /* burn */
      }
      seen.push(e.id);
    });

    for (let i = 0; i < 12; i++) emit(eventWithId(`e${i}`));
    // Nothing yet: the socket callback returned without running any of it.
    expect(seen).toHaveLength(0);

    await new Promise((resolve) => setTimeout(resolve, 0));
    const afterFirstTurn = seen.length;
    expect(afterFirstTurn).toBeGreaterThan(0);
    expect(afterFirstTurn).toBeLessThan(12);

    for (let i = 0; i < 20 && seen.length < 12; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    expect(seen).toHaveLength(12);
  });

  it("keeps going when a handler throws on attacker-supplied content", async () => {
    const client = new NostrClient();
    const seen: string[] = [];
    client.subscribe([{ kinds: [1] }], (e) => {
      if (e.id === "bad") throw new Error("undecodable");
      seen.push(e.id);
    });

    emit(eventWithId("a"));
    emit(eventWithId("bad"));
    emit(eventWithId("b"));
    await drain();

    expect(seen).toEqual(["a", "b"]);
  });

  it("drops the queue when the client is closed, so a dead transport stops calling back", async () => {
    const client = new NostrClient();
    const seen: string[] = [];
    client.subscribe([{ kinds: [1] }], (e) => seen.push(e.id));

    emit(eventWithId("a"));
    client.close();
    await drain();

    expect(seen).toEqual([]);
  });
});
