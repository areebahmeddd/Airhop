/**
 * @jest-environment node
 */
// What a conversation is called, in the two places that ask.
//
// `conversationDisplayName` feeds search rows, which carry their own hash icon,
// so it strips the "#". `channelLabel` feeds notifications and the bell, where
// there is no icon, so it keeps it. Getting either wrong shows a raw store key
// (`geohash:tdr1k`, `group:9f2a`) to the user.
import { hexToBytes } from "@noble/hashes/utils.js";
import { useGroupStore } from "@store/group-store";
import {
  channelLabel,
  conversationDisplayName,
} from "../conversation-display-name";
import { peerIDToUsername } from "../username";

const GROUP_ID = "9f2a3b4c5d6e7f80";
const GROUP_CHANNEL = `group:${GROUP_ID}`;

beforeEach(() => {
  useGroupStore.getState().clearAll();
});

// The store keys groups by the hex of their 16-byte id, which is what the
// `group:<id>` channel carries.
function storeGroup(name: string): void {
  useGroupStore.getState().upsertLocal(
    {
      groupID: hexToBytes(GROUP_ID),
      name,
      epoch: 1,
      members: [],
      creatorFingerprint: "ff".repeat(32),
    },
    new Uint8Array(32),
  );
}

describe("conversationDisplayName", () => {
  it("resolves a DM to the peer's generated username", () => {
    const peerID = "0123456789abcdef";
    expect(conversationDisplayName(`dm:${peerID}`)).toBe(
      peerIDToUsername(peerID),
    );
  });

  // The icon beside the row already says "channel", so a second # reads as a typo.
  it("strips the hash from a public channel", () => {
    expect(conversationDisplayName("#bluetooth")).toBe("bluetooth");
  });

  it("shows a teleported cell as its bare geohash, never the store key", () => {
    const name = conversationDisplayName("geohash:tdr1k");
    expect(name).toBe("tdr1k");
    expect(name).not.toContain("geohash:");
  });

  it("names a group from the store", () => {
    storeGroup("Roof crew");
    expect(conversationDisplayName(GROUP_CHANNEL)).toBe("Roof crew");
  });

  // A group invite can arrive before its state does. The row still has to say
  // something, and it must not be the hex id.
  it("falls back for a group the store has not seen", () => {
    const name = conversationDisplayName(GROUP_CHANNEL);
    expect(name).not.toBe("");
    expect(name).not.toContain(GROUP_ID);
  });

  it("passes an unprefixed name through unchanged", () => {
    expect(conversationDisplayName("bluetooth")).toBe("bluetooth");
  });
});

describe("channelLabel", () => {
  // The difference from conversationDisplayName, and the reason both exist.
  it("keeps the hash where no icon supplies it", () => {
    expect(channelLabel("#city")).toBe("#city");
  });

  it("writes a teleported cell with a hash", () => {
    expect(channelLabel("geohash:tdr1k")).toBe("#tdr1k");
  });

  it("names a group rather than hashing it", () => {
    storeGroup("Roof crew");
    const label = channelLabel(GROUP_CHANNEL);
    expect(label).toBe("Roof crew");
    expect(label).not.toContain("#");
  });
});
