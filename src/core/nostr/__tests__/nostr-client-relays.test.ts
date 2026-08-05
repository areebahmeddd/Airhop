// Which relays NostrClient actually contacts.
//
// The bug these cover: a custom relay added while geo-relay discovery was on
// (the default) was never contacted. mergeGeoRelays appends custom relays after
// the cell's interop set, and NostrClient re-capped every per-call relay list to
// the size of the default DM pool (5). A geo set is already exactly 5, so the
// cap trimmed precisely the user's entries. The settings row read "1 added" and
// nothing ever opened a socket to it.
//
// mergeGeoRelays was unit-tested and correct (see geo-relay.test.ts, "interop
// relays never dropped"); the contract broke one layer down. So these assert the
// relays NostrClient targets, not the ones the caller asked for.

import type { Event } from "nostr-tools";
import {
  GEO_RELAY_COUNT,
  MAX_CUSTOM_RELAYS,
  mergeGeoRelays,
} from "../geo-relay";
import { NostrClient } from "../nostr-client";

const mockPublishTargets: string[][] = [];
const mockSubscribeTargets: string[][] = [];

jest.mock("nostr-tools/pool", () => ({
  SimplePool: class {
    onRelayConnectionSuccess?: () => void;
    onRelayConnectionFailure?: () => void;
    publish(relays: string[]): Promise<void>[] {
      mockPublishTargets.push(relays);
      return relays.map(() => Promise.resolve());
    }
    subscribeMany(relays: string[]): { close: () => void } {
      mockSubscribeTargets.push(relays);
      return { close: () => undefined };
    }
    listConnectionStatus(): Map<string, boolean> {
      return new Map();
    }
    close(): void {}
  },
}));

// Five nearest relays for a cell, as GeoRelayDirectory would return them.
const NEAREST = ["wss://n1", "wss://n2", "wss://n3", "wss://n4", "wss://n5"];
const CUSTOM = ["wss://my-own-relay.example.com"];

const EVENT = {
  id: "e",
  kind: 1,
  pubkey: "p",
  created_at: 0,
  tags: [],
  content: "",
  sig: "s",
} as unknown as Event;

beforeEach(() => {
  mockPublishTargets.length = 0;
  mockSubscribeTargets.length = 0;
});

describe("NostrClient relay targeting", () => {
  // The exact list the geohash services hand down with discovery left on.
  const geoSet = mergeGeoRelays(NEAREST, CUSTOM, true, GEO_RELAY_COUNT);

  test("publish contacts the custom relay alongside the whole interop set", async () => {
    const client = new NostrClient({ relays: [] });
    await client.publish(EVENT, geoSet);

    expect(mockPublishTargets).toHaveLength(1);
    const targets = mockPublishTargets[0];
    // The regression: this used to be absent, trimmed off the tail.
    expect(targets).toContain(CUSTOM[0]);
    // And it must not have come at the cost of the rendezvous set.
    for (const relay of NEAREST) expect(targets).toContain(relay);
  });

  test("subscribe contacts the custom relay alongside the whole interop set", () => {
    const client = new NostrClient({ relays: [] });
    client.subscribe([{ kinds: [20000] }], () => undefined, undefined, geoSet);

    expect(mockSubscribeTargets).toHaveLength(1);
    const targets = mockSubscribeTargets[0];
    expect(targets).toContain(CUSTOM[0]);
    for (const relay of NEAREST) expect(targets).toContain(relay);
  });

  test("a full custom list still fits beside the interop set", async () => {
    const full = Array.from(
      { length: MAX_CUSTOM_RELAYS },
      (_, i) => `wss://c${i}.example.com`,
    );
    const client = new NostrClient({ relays: [] });
    await client.publish(
      EVENT,
      mergeGeoRelays(NEAREST, full, true, GEO_RELAY_COUNT),
    );

    const targets = mockPublishTargets[0];
    for (const relay of [...NEAREST, ...full]) expect(targets).toContain(relay);
  });

  test("the override ceiling still bounds a pathological list", async () => {
    const many = Array.from(
      { length: 40 },
      (_, i) => `wss://r${i}.example.com`,
    );
    const client = new NostrClient({ relays: [] });
    await client.publish(EVENT, many);

    expect(mockPublishTargets[0]).toHaveLength(
      GEO_RELAY_COUNT + MAX_CUSTOM_RELAYS,
    );
  });

  test("the default DM pool is unchanged: defaults only, no override applied", async () => {
    const client = new NostrClient({ relays: [] });
    expect(client.activeRelays).toEqual([
      "wss://nos.lol",
      "wss://offchain.pub",
      "wss://relay.damus.io",
      "wss://relay.primal.net",
    ]);

    await client.publish(EVENT);
    expect(mockPublishTargets[0]).toEqual(client.activeRelays);
  });
});
