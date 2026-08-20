/**
 * @jest-environment node
 */
// Tests for the durable Nostr-pubkey binding on contacts, the piece that lets a
// DM fall back to the internet after a peer leaves Bluetooth range. Uses the
// in-memory MMKV mock: no native module required.

import {
  hasKeys,
  isVerified,
  useContactsStore,
  verificationMethod,
  type Contact,
} from "../contacts-store";

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

  // Gated on holding their keys, not on verification. A label never leaves the
  // device and is typed against one specific peer ID, so nobody but the user
  // can cause one; what it needs is an identity worth labelling.
  it("renames anyone whose keys we hold, verified or not", () => {
    for (const source of ["qr", "link", "manual"] as const) {
      state().clearAll();
      state().addContact(makeContact({ source, nickname: "swift" }));
      state().setLocalNickname("aabbccdd00112233", "Ravi");
      expect(state().nicknameFor("aabbccdd00112233")).toBe("Ravi");
    }
  });

  it("refuses to rename a contact we hold no keys for", () => {
    state().addContact(
      makeContact({
        source: "manual",
        nickname: "swift",
        noisePubKeyHex: "",
        signingPubKeyHex: "",
      }),
    );
    state().setLocalNickname("aabbccdd00112233", "Ravi");
    expect(state().nicknameFor("aabbccdd00112233")).toBe("swift");
    expect(
      state().getContact("aabbccdd00112233")?.localNickname,
    ).toBeUndefined();
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

// The merge rules on addContact: a write may fill gaps in a record but never
// weaken one, whichever of the four screens made it.
describe("addContact merges and never weakens", () => {
  const ID = "aabbccdd00112233";

  // The shape a link tap writes: a fresh record carrying no prior fields.
  function linkCard(overrides: Partial<Contact> = {}): Contact {
    return makeContact({
      source: "link",
      nickname: "whatever-they-called-themselves",
      addedAtMs: 1_800_000_000_000,
      ...overrides,
    });
  }

  it("keeps the verified source when a link arrives afterwards", () => {
    state().addContact(makeContact({ source: "qr" }));
    state().addContact(linkCard());
    expect(state().getContact(ID)?.source).toBe("qr");
  });

  it("keeps the local nickname a link tap does not carry", () => {
    state().addContact(makeContact({ source: "qr" }));
    state().setLocalNickname(ID, "Sarah");
    state().addContact(linkCard());

    expect(state().getContact(ID)?.localNickname).toBe("Sarah");
    expect(state().nicknameFor(ID)).toBe("Sarah");
  });

  it("keeps renaming available after a link tap", () => {
    state().addContact(makeContact({ source: "qr" }));
    state().addContact(linkCard());
    state().setLocalNickname(ID, "Sarah");
    expect(state().nicknameFor(ID)).toBe("Sarah");
  });

  it("keeps the earliest added date", () => {
    state().addContact(makeContact({ addedAtMs: 1_000 }));
    state().addContact(linkCard({ addedAtMs: 9_000 }));
    expect(state().getContact(ID)?.addedAtMs).toBe(1_000);
  });

  it("keeps the verification date across a later write", () => {
    state().addContact(makeContact({ source: "qr", verifiedAtMs: 5_000 }));
    state().addContact(linkCard({ addedAtMs: 9_000 }));
    expect(state().getContact(ID)?.verifiedAtMs).toBe(5_000);
  });

  it("keeps the verification method across a later write", () => {
    state().addContact(makeContact({ source: "qr" }));
    state().addContact(linkCard());
    expect(state().getContact(ID)?.verification).toBe("in-person");
    expect(isVerified(state().getContact(ID))).toBe(true);
  });

  it("keeps a fingerprint verification when a link arrives afterwards", () => {
    state().addContact(makeContact({ source: "link" }));
    state().markVerified(ID);
    state().addContact(linkCard());
    expect(state().getContact(ID)?.verification).toBe("fingerprint");
    expect(state().getContact(ID)?.source).toBe("link");
  });

  it("stamps a verification date on a first in-person save", () => {
    state().addContact(makeContact({ source: "qr", addedAtMs: 4_200 }));
    expect(state().getContact(ID)?.verifiedAtMs).toBe(4_200);
  });

  it("leaves an unverified contact with no verification date", () => {
    state().addContact(makeContact({ source: "link" }));
    expect(state().getContact(ID)?.verifiedAtMs).toBeUndefined();
  });

  it("upgrades a link contact when it is later scanned in person", () => {
    state().addContact(makeContact({ source: "link", addedAtMs: 1_000 }));
    state().addContact(
      makeContact({ source: "qr", addedAtMs: 7_000, verifiedAtMs: 7_000 }),
    );

    const contact = state().getContact(ID);
    expect(contact?.source).toBe("qr");
    expect(contact?.addedAtMs).toBe(1_000);
    expect(contact?.verifiedAtMs).toBe(7_000);
  });

  it("keeps the name they went by when we first met them", () => {
    state().addContact(makeContact({ nickname: "swift" }));
    state().addContact(linkCard({ nickname: "renamed-themselves" }));
    expect(state().ownNicknameFor(ID)).toBe("swift");
  });

  it("fills a name we never had", () => {
    state().addContact(makeContact({ nickname: "", source: "manual" }));
    state().addContact(linkCard({ nickname: "swift" }));
    expect(state().ownNicknameFor(ID)).toBe("swift");
  });

  // `signingPubKeyHex` is the fallback key leaveIsAuthentic uses before the
  // registry holds a pin, which is every restart, so a link able to overwrite
  // it could forge a departure.
  it("refuses to let a link replace a stored signing key", () => {
    state().addContact(makeContact({ source: "qr" }));
    state().addContact(linkCard({ signingPubKeyHex: "99".repeat(32) }));
    expect(state().getContact(ID)?.signingPubKeyHex).toBe("bb".repeat(32));
  });

  it("lets an in-person scan correct a key learned from a link", () => {
    state().addContact(makeContact({ source: "link" }));
    state().addContact(
      makeContact({ source: "qr", signingPubKeyHex: "99".repeat(32) }),
    );
    expect(state().getContact(ID)?.signingPubKeyHex).toBe("99".repeat(32));
  });

  it("fills keys a bare-ID contact never had", () => {
    state().addContact(
      makeContact({
        source: "manual",
        noisePubKeyHex: "",
        signingPubKeyHex: "",
      }),
    );
    state().addContact(linkCard());

    const contact = state().getContact(ID);
    expect(contact?.noisePubKeyHex).toBe("aa".repeat(32));
    expect(contact?.signingPubKeyHex).toBe("bb".repeat(32));
  });

  it("keeps the first Nostr key, matching setNostrPubkey", () => {
    state().addContact(makeContact({ nostrPubkeyHex: "cc".repeat(32) }));
    state().addContact(linkCard({ nostrPubkeyHex: "dd".repeat(32) }));
    expect(state().getContact(ID)?.nostrPubkeyHex).toBe("cc".repeat(32));
  });
});

// `source` says how the keys arrived, `verification` whether a human has
// confirmed them. Separate fields because they change under opposite rules, and
// because "learned by link, confirmed on a call" has to be expressible.
describe("verification is separate from source", () => {
  const ID = "aabbccdd00112233";

  it("reads a legacy qr contact as verified in person", () => {
    // No `verification` field, as records predating it.
    const legacy: Contact = {
      peerID: ID,
      noisePubKeyHex: "aa".repeat(32),
      signingPubKeyHex: "bb".repeat(32),
      nickname: "swift",
      addedAtMs: 1_000,
      source: "qr",
    };
    expect(isVerified(legacy)).toBe(true);
    expect(verificationMethod(legacy)).toBe("in-person");
  });

  it("treats a link contact as unverified until somebody checks", () => {
    state().addContact(makeContact({ source: "link" }));
    expect(isVerified(state().getContact(ID))).toBe(false);
    expect(verificationMethod(state().getContact(ID))).toBeUndefined();
  });

  it("verifies a link contact by fingerprint without changing its source", () => {
    state().addContact(makeContact({ source: "link" }));
    state().markVerified(ID);

    const contact = state().getContact(ID);
    expect(isVerified(contact)).toBe(true);
    expect(contact?.verification).toBe("fingerprint");
    // How they arrived is still true and still recorded.
    expect(contact?.source).toBe("link");
    expect(contact?.verifiedAtMs).toBeGreaterThan(0);
  });

  // A comparison confirms keys already held. Nothing is imported, which is why
  // it can be offered where a scan cannot.
  it("markVerified touches no keys", () => {
    state().addContact(makeContact({ source: "link" }));
    const before = state().getContact(ID);
    state().markVerified(ID);
    const after = state().getContact(ID);

    expect(after?.noisePubKeyHex).toBe(before?.noisePubKeyHex);
    expect(after?.signingPubKeyHex).toBe(before?.signingPubKeyHex);
    expect(after?.nostrPubkeyHex).toBe(before?.nostrPubkeyHex);
  });

  it("refuses to verify a contact we hold no keys for", () => {
    state().addContact(
      makeContact({
        source: "manual",
        noisePubKeyHex: "",
        signingPubKeyHex: "",
      }),
    );
    state().markVerified(ID);
    expect(isVerified(state().getContact(ID))).toBe(false);
  });

  // A second comparison of the same words must not move "Verified since" to
  // today, which would claim trust was established this morning.
  it("does not re-stamp a contact that is already verified", () => {
    state().addContact(makeContact({ source: "qr", verifiedAtMs: 5_000 }));
    state().markVerified(ID);
    expect(state().getContact(ID)?.verifiedAtMs).toBe(5_000);
    expect(state().getContact(ID)?.verification).toBe("in-person");
  });

  it("does nothing for a peer that is not a contact", () => {
    state().markVerified("ffffffffffffffff");
    expect(state().getContact("ffffffffffffffff")).toBeUndefined();
  });

  it("hasKeys answers whether there is an identity worth labelling", () => {
    expect(hasKeys(undefined)).toBe(false);
    expect(hasKeys(makeContact({ noisePubKeyHex: "" }))).toBe(false);
    expect(hasKeys(makeContact())).toBe(true);
  });
});
