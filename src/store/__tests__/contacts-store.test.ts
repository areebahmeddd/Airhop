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
