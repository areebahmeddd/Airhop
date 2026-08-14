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
