/**
 * @jest-environment node
 */
// Tests for the durable Nostr-pubkey binding on contacts, the piece that lets a
// DM fall back to the internet after a peer leaves Bluetooth range. Uses the
// in-memory MMKV mock: no native module required.

import { useContactsStore, type Contact } from "../contacts-store";

beforeEach(() => {
  useContactsStore.getState().clearAll();
});

function state() {
  return useContactsStore.getState();
}

function makeContact(overrides: Partial<Contact> = {}): Contact {
  return {
    peerID: "aabbccdd00112233",
    noisePubKeyHex: "aa".repeat(32),
    signingPubKeyHex: "bb".repeat(32),
    nickname: "swift",
    addedAtMs: 1_700_000_000_000,
    source: "qr",
    ...overrides,
  };
}

describe("setNostrPubkey", () => {
  it("binds a Nostr pubkey onto an existing contact", () => {
    state().addContact(makeContact());
    state().setNostrPubkey("aabbccdd00112233", "cc".repeat(32));
    expect(state().getContact("aabbccdd00112233")?.nostrPubkeyHex).toBe(
      "cc".repeat(32),
    );
  });

  it("is a no-op when no contact exists (never invents a stranger)", () => {
    state().setNostrPubkey("aabbccdd00112233", "cc".repeat(32));
    expect(state().getContact("aabbccdd00112233")).toBeUndefined();
  });

  it("is a no-op for an empty key", () => {
    state().addContact(makeContact());
    state().setNostrPubkey("aabbccdd00112233", "");
    expect(
      state().getContact("aabbccdd00112233")?.nostrPubkeyHex,
    ).toBeUndefined();
  });

  it("first key wins: does not overwrite a key already bound", () => {
    state().addContact(makeContact({ nostrPubkeyHex: "cc".repeat(32) }));
    state().setNostrPubkey("aabbccdd00112233", "dd".repeat(32));
    expect(state().getContact("aabbccdd00112233")?.nostrPubkeyHex).toBe(
      "cc".repeat(32),
    );
  });

  it("re-binding the same key is idempotent (no throw, same value)", () => {
    state().addContact(makeContact());
    state().setNostrPubkey("aabbccdd00112233", "cc".repeat(32));
    state().setNostrPubkey("aabbccdd00112233", "cc".repeat(32));
    expect(state().getContact("aabbccdd00112233")?.nostrPubkeyHex).toBe(
      "cc".repeat(32),
    );
  });

  it("carries the npub through a QR-added contact", () => {
    state().addContact(makeContact({ nostrPubkeyHex: "ee".repeat(32) }));
    expect(state().getContact("aabbccdd00112233")?.nostrPubkeyHex).toBe(
      "ee".repeat(32),
    );
  });
});

// A name only you see, kept apart from the one they announce.
//
// The two used to be one field, so renaming somebody destroyed the only copy of
// what they call themselves, and the contact sheet has to show both, or a label
// the user chose could quietly stand in for the identity they verified.
describe("local nicknames", () => {
  it("shows your label over theirs, and keeps theirs readable", () => {
    state().addContact(makeContact({ nickname: "swift" }));
    state().setLocalNickname("aabbccdd00112233", "Ravi");

    expect(state().nicknameFor("aabbccdd00112233")).toBe("Ravi");
    // Still there, which is the whole reason it is a separate field.
    expect(state().ownNicknameFor("aabbccdd00112233")).toBe("swift");
    expect(state().getContact("aabbccdd00112233")?.nickname).toBe("swift");
  });

  it("hands their own name back when cleared", () => {
    state().addContact(makeContact({ nickname: "swift" }));
    state().setLocalNickname("aabbccdd00112233", "Ravi");
    state().setLocalNickname("aabbccdd00112233", "");

    expect(state().nicknameFor("aabbccdd00112233")).toBe("swift");
    expect(
      state().getContact("aabbccdd00112233")?.localNickname,
    ).toBeUndefined();
  });

  it("treats whitespace as clearing rather than as a name", () => {
    state().addContact(makeContact({ nickname: "swift" }));
    state().setLocalNickname("aabbccdd00112233", "   ");
    expect(state().nicknameFor("aabbccdd00112233")).toBe("swift");
  });

  // The gate, and it is a security property rather than a formality: a local
  // name replaces the generated username everywhere, so if any stranger could
  // be relabelled, somebody announcing a familiar nickname could be filed under
  // a trusted name and the label would do the identifying from then on.
  it("refuses to rename anyone not verified in person", () => {
    for (const source of ["link", "manual"] as const) {
      state().clearAll();
      state().addContact(makeContact({ source, nickname: "swift" }));
      state().setLocalNickname("aabbccdd00112233", "Ravi");
      expect(state().nicknameFor("aabbccdd00112233")).toBe("swift");
      expect(
        state().getContact("aabbccdd00112233")?.localNickname,
      ).toBeUndefined();
    }
  });

  it("does nothing for a peer that is not a contact", () => {
    state().setLocalNickname("ffffffffffffffff", "Ravi");
    expect(state().getContact("ffffffffffffffff")).toBeUndefined();
  });

  it("caps a label at the length a card carries for their own name", () => {
    state().addContact(makeContact());
    state().setLocalNickname("aabbccdd00112233", "x".repeat(80));
    expect(state().nicknameFor("aabbccdd00112233")).toHaveLength(32);
  });
});
