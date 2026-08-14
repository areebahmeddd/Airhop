/**
 * @jest-environment node
 */
// Who a peer is, as shown on four screens.
//
// Three names can exist for one person: a label the user typed, the name on the
// card they scanned, and the name they broadcast. The order between them is a
// trust decision, not a preference: a name the user chose outranks anything the
// peer asserts, and an announced name outranks a generated one only because it
// is at least self-consistent. Resolving them in a different order elsewhere is
// how the same person ends up with two names on two screens.
import { useContactsStore } from "@store/contacts-store";
import { usePeerStore } from "@store/peer-store";
import { resolveDisplayName, resolvePeerOwnName } from "../peer-display-name";
import { peerIDToUsername } from "../username";

const PEER = "0123456789abcdef";

// `nickname` is the name on the card they handed over; `localNickname` is the
// label this user typed for them. The two resolvers differ only on which wins.
function addContact(over: { nickname: string; localNickname?: string }): void {
  useContactsStore.getState().addContact({
    peerID: PEER,
    noisePubKeyHex: "aa".repeat(32),
    signingPubKeyHex: "bb".repeat(32),
    addedAtMs: 1_700_000_000_000,
    source: "qr",
    ...over,
  });
}

function announce(nickname: string): void {
  usePeerStore.getState().upsertPeer({
    peerID: PEER,
    nickname,
    lastSeenMs: 1_700_000_000_000,
    noisePubKeyHex: "aa".repeat(32),
  });
}

beforeEach(() => {
  usePeerStore.getState().clearAll();
  useContactsStore.getState().clearAll();
});

describe("resolveDisplayName", () => {
  // The floor: always a name, never a raw peer ID, even knowing nothing.
  it("falls back to the generated username for an unknown peer", () => {
    const name = resolveDisplayName(PEER);
    expect(name).toBe(peerIDToUsername(PEER));
    expect(name).not.toBe(PEER);
  });

  it("prefers an announced nickname over the generated one", () => {
    announce("otter");
    expect(resolveDisplayName(PEER)).toBe("otter");
  });

  // The precedence that matters: a name the user chose wins over one the peer
  // asserts, so a peer cannot rename themselves in someone else's list.
  it("prefers a contact name over an announced nickname", () => {
    announce("otter");
    addContact({ nickname: "otter-card", localNickname: "Sam from the roof" });
    expect(resolveDisplayName(PEER)).toBe("Sam from the roof");
  });

  // An empty announce is not a name. Treating "" as one blanks the row.
  it("ignores an empty announced nickname", () => {
    announce("");
    expect(resolveDisplayName(PEER)).toBe(peerIDToUsername(PEER));
  });

  // A Nostr correspondent has no peer ID to derive from, so it must not fall
  // through to the generated-username path and invent an unrelated name.
  it("names a Nostr pseudonym without a generated username", () => {
    const nostrID = `nostr_${"ed".repeat(32)}`;
    const name = resolveDisplayName(nostrID);
    expect(name).not.toBe(peerIDToUsername(nostrID));
    expect(name.length).toBeGreaterThan(0);
  });
});

describe("resolvePeerOwnName", () => {
  // The one screen that must show who the peer says they are, so renaming
  // somebody never hides their own name from the person who renamed them.
  it("ignores the local label and reports the announced name", () => {
    announce("otter");
    addContact({ nickname: "otter-card", localNickname: "Sam from the roof" });
    expect(resolvePeerOwnName(PEER)).toBe("otter-card");
    // And the two disagree on purpose: that is the whole point of the pair.
    expect(resolveDisplayName(PEER)).toBe("Sam from the roof");
  });

  it("falls back to the generated username like the other path", () => {
    expect(resolvePeerOwnName(PEER)).toBe(peerIDToUsername(PEER));
  });
});
