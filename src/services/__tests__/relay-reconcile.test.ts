/**
 * @jest-environment node
 */
// Changing the relay preferences has to move a live subscription, not just the
// next publish.
//
// The publish path re-reads the relay set per event; a subscription reads it
// only as its sockets open. The failure is silent: the user adds a relay,
// watches the UI confirm it, sends into the cell over it, and never hears a
// reply from anyone who only speaks there.

import type { NostrClient } from "@core/nostr/nostr-client";
import { ed25519 } from "@noble/curves/ed25519.js";
import { useChatStore } from "@store/chat-store";
import { useSettingsStore } from "@store/settings-store";
import { GeohashChannelService } from "../geohash-channel-service";

jest.mock("expo-location", () => ({}));

// Fixed, so the only thing moving between runs is the relay list. The "mock"
// prefix is what lets the hoisted module factory below close over it.
const mockCoords = { lat: 51.5074, lng: -0.1278 };

jest.mock("../location-service", () => ({
  getCoarseLocation: () => Promise.resolve(mockCoords),
  clearLocationCache: () => undefined,
}));

const CUSTOM = "wss://pinned.example.com";

// Closed matters as much as opened: a reconcile that opens without closing
// leaves the cell double-subscribed, which reads as working right up until every
// message arrives twice.
interface OpenedSubscription {
  relays: string[];
  closed: boolean;
}

function mockClient(opened: OpenedSubscription[]): NostrClient {
  return {
    subscribe: (
      _filters: unknown,
      _onEvent: unknown,
      _onEose: unknown,
      relays?: string[],
    ) => {
      const record: OpenedSubscription = {
        relays: relays ?? [],
        closed: false,
      };
      opened.push(record);
      return {
        close: () => {
          record.closed = true;
        },
      };
    },
    publish: async () => ({ relay: "", ok: true }),
  } as unknown as NostrClient;
}

// Opening a cell also opens the per-cell DM inbox, which passes no relay
// override because it rides the default pool, as bitchat's does. It is not
// scoped to the cell's relays, so it is filtered out rather than asserted over.
function cellScoped(subs: OpenedSubscription[]): OpenedSubscription[] {
  return subs.filter((s) => s.relays.length > 0);
}

function newService(opened: OpenedSubscription[]): GeohashChannelService {
  return new GeohashChannelService(
    mockClient(opened),
    ed25519.utils.randomSecretKey(),
    "alice",
    "aabbccdd00112233",
  );
}

describe("applyRelayChange", () => {
  beforeEach(() => {
    for (const url of useSettingsStore.getState().customRelays) {
      useSettingsStore.getState().removeCustomRelay(url);
    }
    useSettingsStore.getState().setGeoRelayDiscovery(true);
    useChatStore.setState({ channels: ["#city"] });
  });

  it("reopens a live cell on a relay the user just added", async () => {
    const opened: OpenedSubscription[] = [];
    const service = newService(opened);
    await service.refresh();

    const before = opened.length;
    expect(cellScoped(opened)).not.toHaveLength(0);
    expect(opened.every((s) => !s.relays.includes(CUSTOM))).toBe(true);

    useSettingsStore.getState().addCustomRelay(CUSTOM);
    service.applyRelayChange();

    expect(opened.slice(0, before).every((s) => s.closed)).toBe(true);
    const after = opened.slice(before);
    expect(after).toHaveLength(before);
    expect(cellScoped(after).every((s) => s.relays.includes(CUSTOM))).toBe(
      true,
    );

    service.stop();
  });

  it("drops the discovered relays when discovery is turned off", async () => {
    const opened: OpenedSubscription[] = [];
    const service = newService(opened);
    await service.refresh();
    expect(cellScoped(opened)).not.toHaveLength(0);

    useSettingsStore.getState().addCustomRelay(CUSTOM);
    useSettingsStore.getState().setGeoRelayDiscovery(false);
    const before = opened.length;
    service.applyRelayChange();

    // Leaving the reads on the nearest relays would keep the cell working by
    // accident and hide the trade-off the user chose.
    const after = cellScoped(opened.slice(before));
    expect(after).not.toHaveLength(0);
    for (const sub of after) {
      expect(sub.relays).toEqual([CUSTOM]);
    }

    service.stop();
  });

  it("does nothing when no cell is subscribed", () => {
    // Turning a relay on and off from Settings, with no location channel
    // joined, must not open a subscription that nothing will ever close.
    useChatStore.setState({ channels: [] });
    const opened: OpenedSubscription[] = [];
    const service = newService(opened);

    useSettingsStore.getState().addCustomRelay(CUSTOM);
    service.applyRelayChange();

    expect(opened).toHaveLength(0);
  });
});
