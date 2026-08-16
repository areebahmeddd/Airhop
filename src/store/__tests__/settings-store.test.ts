/**
 * @jest-environment node
 */
// Live voice is one switch for two directions: it gates streaming your holds
// and playing other people's bursts. A user who turns it off should not have a
// microphone open on their behalf, and should not have a stranger's voice come
// out of their phone. These pin the store half of that; the teardown of a burst
// already in flight lives in mesh-service.

import { MAX_CUSTOM_RELAYS } from "@core/nostr/geo-relay";
import {
  MEDIA_RETENTION_DAY_OPTIONS,
  useSettingsStore,
} from "../settings-store";

function state() {
  return useSettingsStore.getState();
}

describe("liveVoiceEnabled", () => {
  it("defaults on, matching bitchat's PTTSettings", () => {
    // A walkie-talkie nobody can find is not a feature. bitchat ships this on
    // and so do we; turning it off is the deliberate act.
    expect(state().liveVoiceEnabled).toBe(true);
  });

  it("survives being flipped repeatedly", () => {
    // Chaos case: someone toggling the switch on and off should end up in the
    // state they left it in, with no accumulated effect either way.
    for (let i = 0; i < 6; i++) {
      state().setLiveVoiceEnabled(i % 2 === 0);
    }
    expect(state().liveVoiceEnabled).toBe(false);

    state().setLiveVoiceEnabled(true);
    expect(state().liveVoiceEnabled).toBe(true);
  });

  it("is independent of the other privacy toggles", () => {
    // It shares a screen with Tor, the gateway and the bridge, but not a
    // transport: live voice never leaves Bluetooth, so it stays usable when
    // every internet-dependent switch is off.
    state().setLiveVoiceEnabled(true);
    state().setGatewayEnabled(false);
    state().setBridgeEnabled(false);

    expect(state().liveVoiceEnabled).toBe(true);
    expect(state().gatewayEnabled).toBe(false);
    expect(state().bridgeEnabled).toBe(false);
  });
});

describe("customRelays", () => {
  beforeEach(() => {
    for (const url of state().customRelays) state().removeCustomRelay(url);
  });

  it("accepts up to MAX_CUSTOM_RELAYS and refuses the rest", () => {
    // The cap is what lets NostrClient size its per-call ceiling to hold the
    // cell's interop set plus every pinned relay. Without a bound here, a long
    // list would start getting trimmed again and pinned relays would go quiet.
    for (let i = 0; i < MAX_CUSTOM_RELAYS + 3; i++) {
      state().addCustomRelay(`relay${i}.example.com`);
    }
    expect(state().customRelays).toHaveLength(MAX_CUSTOM_RELAYS);
    // Earliest wins: the ones the user already relies on are not evicted by a
    // later add that should simply have been refused.
    expect(state().customRelays[0]).toBe("wss://relay0.example.com");
  });

  it("does not count a duplicate against the cap", () => {
    state().addCustomRelay("relay.example.com");
    state().addCustomRelay("wss://relay.example.com/");
    expect(state().customRelays).toEqual(["wss://relay.example.com"]);
  });

  it("frees a slot on removal", () => {
    for (let i = 0; i < MAX_CUSTOM_RELAYS; i++) {
      state().addCustomRelay(`relay${i}.example.com`);
    }
    state().removeCustomRelay("wss://relay0.example.com");
    state().addCustomRelay("late.example.com");
    expect(state().customRelays).toContain("wss://late.example.com");
    expect(state().customRelays).toHaveLength(MAX_CUSTOM_RELAYS);
  });

  it("removes a relay named the way it was typed", () => {
    // The list stores the canonical form, but the user typed a bare host and
    // may quote it back that way.
    state().addCustomRelay("relay.example.com");
    state().removeCustomRelay("relay.example.com:443");
    expect(state().customRelays).toEqual([]);
  });
});

// RELAY_SOURCE_INVARIANT. The Network screen explains the rule to the user;
// these pin the store half, which is what holds it for every other writer.
describe("geoRelayDiscovery", () => {
  beforeEach(() => {
    for (const url of state().customRelays) state().removeCustomRelay(url);
    state().setGeoRelayDiscovery(true);
  });

  it("refuses to turn off with no custom relay to fall back to", () => {
    state().setGeoRelayDiscovery(false);
    expect(state().geoRelayDiscovery).toBe(true);
  });

  it("turns off once a relay is pinned", () => {
    state().addCustomRelay("relay.example.com");
    state().setGeoRelayDiscovery(false);
    expect(state().geoRelayDiscovery).toBe(false);
  });

  it("comes back on when the last relay is removed", () => {
    state().addCustomRelay("relay.example.com");
    state().setGeoRelayDiscovery(false);
    state().removeCustomRelay("wss://relay.example.com");
    expect(state().customRelays).toEqual([]);
    expect(state().geoRelayDiscovery).toBe(true);
  });

  it("stays off while another relay remains", () => {
    state().addCustomRelay("one.example.com");
    state().addCustomRelay("two.example.com");
    state().setGeoRelayDiscovery(false);
    state().removeCustomRelay("wss://one.example.com");
    expect(state().geoRelayDiscovery).toBe(false);
  });

  it("is restored by the panic wipe along with the relay list", () => {
    state().addCustomRelay("relay.example.com");
    state().setGeoRelayDiscovery(false);
    state().reset();
    expect(state().customRelays).toEqual([]);
    expect(state().geoRelayDiscovery).toBe(true);
  });
});

// MMKV is plain storage, and this is the one persisted setting that reaches a
// socket. bitchat re-normalizes its stored relays on read for the same reason.
describe("customRelays rehydration", () => {
  function rehydrateState(persisted: object) {
    const merge = useSettingsStore.persist.getOptions().merge;
    if (merge === undefined) throw new Error("persist has no merge hook");
    return merge(persisted, state());
  }

  function rehydrate(customRelays: unknown): string[] {
    return rehydrateState({ customRelays }).customRelays;
  }

  it("drops an entry that no longer validates", () => {
    expect(
      rehydrate([
        "wss://good.example.com",
        "wss://localhost",
        "wss://10.0.0.1",
        "not a relay",
        "",
      ]),
    ).toEqual(["wss://good.example.com"]);
  });

  it("collapses two spellings of one relay", () => {
    // Two entries for one endpoint would each take a slot and hold a socket.
    expect(
      rehydrate([
        "relay.example.com",
        "wss://relay.example.com:443",
        "wss://relay.example.com/",
      ]),
    ).toEqual(["wss://relay.example.com"]);
  });

  it("trims a list that is over the cap", () => {
    const stored = Array.from(
      { length: MAX_CUSTOM_RELAYS + 4 },
      (_, i) => `relay${i}.example.com`,
    );
    expect(rehydrate(stored)).toHaveLength(MAX_CUSTOM_RELAYS);
  });

  it("turns discovery back on when sanitizing empties the list", () => {
    // Discovery was legitimately off against relays that no longer validate.
    const merged = rehydrateState({
      customRelays: ["wss://localhost"],
      geoRelayDiscovery: false,
    });
    expect(merged.customRelays).toEqual([]);
    expect(merged.geoRelayDiscovery).toBe(true);
  });

  it("leaves discovery off when a stored relay survives", () => {
    const merged = rehydrateState({
      customRelays: ["relay.example.com"],
      geoRelayDiscovery: false,
    });
    expect(merged.customRelays).toEqual(["wss://relay.example.com"]);
    expect(merged.geoRelayDiscovery).toBe(false);
  });

  it("survives a value that is not a list of strings", () => {
    expect(rehydrate(undefined)).toEqual([]);
    expect(rehydrate([null, 42, { url: "wss://a.example.com" }])).toEqual([]);
  });
});

// Two settings whose defaults are the load-bearing part. Both are the kind of
// choice where the wrong default silently harms the person least likely to go
// looking for it, so the defaults are pinned rather than left to be noticed.
describe("media retention", () => {
  it("defaults to seven days, matching bitchat's sweep", () => {
    useSettingsStore.getState().reset();
    expect(state().mediaRetentionDays).toBe(7);
  });

  it("offers only bounded windows, never keep-forever", () => {
    // The threat model says an attachment must not outlive its conversation.
    // An unbounded option would retire that quietly for whoever picked it.
    expect([...MEDIA_RETENTION_DAY_OPTIONS]).toEqual([7, 14, 30]);
    for (const days of MEDIA_RETENTION_DAY_OPTIONS) {
      expect(Number.isFinite(days)).toBe(true);
      expect(days).toBeGreaterThan(0);
    }
  });

  it("keeps a chosen window across other changes", () => {
    useSettingsStore.getState().setMediaRetentionDays(30);
    useSettingsStore.getState().setHideNotificationPreviews(false);
    expect(state().mediaRetentionDays).toBe(30);
  });

  it("returns to seven days on a panic wipe", () => {
    // A wipe leaves a first-run device. Inheriting the previous person's
    // 30-day window would leave the next one holding media longer than the
    // default promises, without ever having chosen it.
    useSettingsStore.getState().setMediaRetentionDays(30);
    useSettingsStore.getState().reset();
    expect(state().mediaRetentionDays).toBe(7);
  });
});
