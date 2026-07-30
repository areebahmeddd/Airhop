/**
 * @jest-environment node
 */
// Media policy: media rides BLE only, so it is offered only where it can
// actually deliver. This mirrors bitchat's canSendMediaInCurrentContext, so the
// two apps agree on what a channel can carry. The boundaries are load-bearing
// (an unencrypted photo must never be offered in a private channel), so pin them.

import { canSendMedia, mediaBlockedReason } from "../media-policy";

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

// The greyed attach and mic buttons say this when tapped, so every blocked
// context has to give its OWN reason. A private channel told "it would never
// arrive" (the location-channel reason) would be simply wrong, and the named
// location channels are `#`-prefixed exactly like a private channel, so that
// boundary is the one worth pinning.
describe("mediaBlockedReason", () => {
  it("is null wherever media is allowed", () => {
    expect(mediaBlockedReason("#bluetooth")).toBeNull();
    expect(mediaBlockedReason("dm:aabbccdd00112233")).toBeNull();
  });

  it("blames the relay for a Nostr-only DM", () => {
    expect(mediaBlockedReason("dm:nostr_deadbeef")).toMatch(/relay/);
  });

  it("blames reachability for location channels, named or teleported", () => {
    for (const ch of ["#block", "#city", "#region", "geohash:tdr1k"]) {
      expect(mediaBlockedReason(ch)).toMatch(/never arrive/);
    }
  });

  it("blames encryption for private rooms, and names the right kind", () => {
    expect(mediaBlockedReason("#my-private-room")).toMatch(/private channel/);
    expect(mediaBlockedReason("group:aabbcc")).toMatch(/private group/);
  });
});
