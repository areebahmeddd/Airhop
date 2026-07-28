/**
 * @jest-environment node
 */
// Live voice is one switch for two directions: it gates streaming your holds
// and playing other people's bursts. A user who turns it off should not have a
// microphone open on their behalf, and should not have a stranger's voice come
// out of their phone. These pin the store half of that; the teardown of a burst
// already in flight lives in mesh-service.

import { useSettingsStore } from "../settings-store";

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
