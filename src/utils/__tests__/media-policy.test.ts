/**
 * @jest-environment node
 */
// Media policy: media rides BLE only, so it is offered only where it can
// actually deliver. This mirrors bitchat's canSendMediaInCurrentContext, so the
// two apps agree on what a channel can carry. The boundaries are load-bearing
// (an unencrypted photo must never be offered in a private channel), so pin them.

import { canSendMedia } from "../media-policy";

describe("canSendMedia", () => {
  it("allows media in the Bluetooth mesh channel", () => {
    expect(canSendMedia("#bluetooth")).toBe(true);
  });

  it("allows media in a direct mesh DM", () => {
    expect(canSendMedia("dm:aabbccdd00112233")).toBe(true);
  });

  it("blocks media in a geohash (Nostr-only) DM", () => {
    expect(canSendMedia("dm:nostr_deadbeef")).toBe(false);
  });

  it("blocks media in named location channels", () => {
    for (const ch of ["#block", "#neighborhood", "#city", "#region"]) {
      expect(canSendMedia(ch)).toBe(false);
    }
  });

  it("blocks media in a teleported geohash cell", () => {
    expect(canSendMedia("geohash:tdr1k")).toBe(false);
  });

  it("blocks media in private channels and groups (encrypted text)", () => {
    expect(canSendMedia("#my-private-room")).toBe(false);
    expect(canSendMedia("group:aabbcc")).toBe(false);
  });
});
