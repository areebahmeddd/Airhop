/**
 * @jest-environment node
 */
// Media policy: media rides BLE only, so it is offered only where it can
// actually deliver. This mirrors bitchat's canSendMediaInCurrentContext, so the
// two apps agree on what a channel can carry. The boundaries are load-bearing
// (an unencrypted photo must never be offered in a private channel), so pin them.

import {
  canSendMedia,
  mediaBlockedReason,
  notifiesOnScreenshot,
} from "../media-policy";

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

// Forwarding is where this policy is easiest to bypass: the composer hides its
// attach button in a room that refuses media, but the forward picker offers
// every room. A forwarded attachment landing in one of them leaves a bubble on
// the sender's screen and reaches nobody, because the receiver drops it.
//
// So the picker asks the same question, and every room that answers with a
// reason is refused rather than tried.
describe("forwarding an attachment", () => {
  const rooms = [
    "#bluetooth",
    "dm:aabbccdd00112233",
    "#neighborhood",
    "geohash:tdr1w",
    "dm:nostr_" + "ab".repeat(32),
    "#secret",
    "group:0011223344556677",
  ];

  it("agrees with canSendMedia on every room, so neither can drift", () => {
    for (const room of rooms) {
      expect(mediaBlockedReason(room) === null).toBe(canSendMedia(room));
    }
  });

  it("permits only the two rooms media can actually reach", () => {
    const allowed = rooms.filter((r) => mediaBlockedReason(r) === null);
    expect(allowed).toEqual(["#bluetooth", "dm:aabbccdd00112233"]);
  });

  it("gives a reason for every room it refuses", () => {
    for (const room of rooms.filter((r) => !canSendMedia(r))) {
      expect(mediaBlockedReason(room)).toBeTruthy();
    }
  });
});

// A screenshot notice is worth sending to the people who could already read the
// thread, and is a beacon anywhere else. On a location cell the notice is
// published to Nostr relays as a signed event, which permanently records that
// this nickname was in this cell at this moment, the opposite of what somebody
// screenshotting police conduct or a threat needs.
describe("notifiesOnScreenshot", () => {
  it("tells the peer in a direct message", () => {
    expect(notifiesOnScreenshot("dm:aabbccdd00112233", false)).toBe(true);
    // A geohash DM is still a DM: sealed to one pseudonymous recipient.
    expect(notifiesOnScreenshot("dm:nostr_" + "ab".repeat(32), false)).toBe(
      true,
    );
  });

  it("tells a private group, which is sealed under its epoch key", () => {
    expect(notifiesOnScreenshot("group:0011223344556677", false)).toBe(true);
  });

  it("tells a private channel, which is sealed under its channel key", () => {
    expect(notifiesOnScreenshot("#book-club", true)).toBe(true);
  });

  it("tells nobody in the public mesh room", () => {
    // Plaintext broadcast to every radio in range.
    expect(notifiesOnScreenshot("#bluetooth", false)).toBe(false);
  });

  it("tells nobody in a location cell, named or teleported", () => {
    for (const cell of [
      "#block",
      "#neighborhood",
      "#city",
      "#province",
      "#region",
      "geohash:u4pruy",
    ]) {
      expect(notifiesOnScreenshot(cell, false)).toBe(false);
    }
  });

  it("keys a #channel on the key, not the name", () => {
    // The same room name is public without a key and private with one, so the
    // decision has to follow key ownership rather than the "#" prefix.
    expect(notifiesOnScreenshot("#book-club", false)).toBe(false);
    expect(notifiesOnScreenshot("#book-club", true)).toBe(true);
  });

  it("never announces anywhere media is refused for being public", () => {
    // The two rules answer different questions but share a boundary: a room
    // public enough to carry an unencrypted photo is public enough that
    // announcing a screenshot in it is a beacon.
    expect(canSendMedia("#bluetooth")).toBe(true);
    expect(notifiesOnScreenshot("#bluetooth", false)).toBe(false);
  });
});
