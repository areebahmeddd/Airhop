/**
 * @jest-environment node
 */
// Wallet store tests: account keying, proof lifecycle, reservations, history.
//
// These cover the invariants that protect real money rather than the plumbing:
// a proof can never be counted twice, a reserved proof is out of the spendable
// balance but not gone, and units from the same mint never merge.
//
// Uses the in-memory MMKV mock, so no native module and no network.

import {
  accountKey,
  normalizeMintUrl,
  parseAccountKey,
  selectAccounts,
  selectBalanceForUnit,
  selectSecrets,
  selectUnits,
  useWalletStore,
  type StoredProof,
  type WalletTx,
} from "../wallet-store";

const MINT = "https://mint.example.com";
const OTHER = "https://other.mint";

beforeEach(() => {
  useWalletStore.getState().clearAll();
});

// ---- Helpers ----

let secretCounter = 0;
function makeProof(amount: number, secret?: string): StoredProof {
  secretCounter += 1;
  return {
    id: "00ad268c4d1f5826",
    amount,
    secret: secret ?? `secret-${String(secretCounter)}`,
    C: "02" + "ab".repeat(32),
  };
}

function state() {
  return useWalletStore.getState();
}

function tx(overrides: Partial<WalletTx> = {}): WalletTx {
  return {
    id: "tx-1",
    kind: "send",
    status: "pending",
    amount: 100,
    unit: "sat",
    mintUrl: MINT,
    createdAtMs: 1,
    updatedAtMs: 1,
    ...overrides,
  };
}

// ---- Account keys ----

describe("account keys", () => {
  it("normalises trailing slashes and host case to one mint", () => {
    expect(normalizeMintUrl("https://Mint.Example.com/")).toBe(MINT);
    expect(normalizeMintUrl("https://mint.example.com")).toBe(MINT);
  });

  it("strips query and fragment, which are not part of a mint identity", () => {
    expect(normalizeMintUrl("https://mint.example.com/?x=1#y")).toBe(MINT);
  });

  it("round-trips through parseAccountKey", () => {
    const key = accountKey(MINT, "usd");
    expect(parseAccountKey(key)).toEqual({ mintUrl: MINT, unit: "usd" });
  });

  it("keeps a path-bearing mint URL intact", () => {
    const key = accountKey("https://host.example/cashu/", "sat");
    expect(parseAccountKey(key).mintUrl).toBe("https://host.example/cashu");
  });
});

// ---- addProofs ----

describe("addProofs", () => {
  it("adds proofs under the (mint, unit) account", () => {
    state().addProofs(MINT, "sat", [makeProof(64), makeProof(128)]);
    expect(state().proofs[accountKey(MINT, "sat")]).toHaveLength(2);
  });

  it("deduplicates by secret so a re-paste cannot inflate the balance", () => {
    const proof = makeProof(32, "same-secret");
    state().addProofs(MINT, "sat", [proof]);
    const result = state().addProofs(MINT, "sat", [proof, makeProof(64)]);

    expect(result).toEqual({ added: 1, duplicates: 1 });
    expect(state().proofs[accountKey(MINT, "sat")]).toHaveLength(2);
  });

  it("refuses a proof that is currently reserved for an in-flight send", () => {
    const proof = makeProof(50, "reserved-secret");
    state().addProofs(MINT, "sat", [proof]);
    state().reserveProofs("tx-1", MINT, "sat", [proof]);

    // Receiving our own outgoing token back must not credit it twice: the
    // reservation still holds those proofs against the pending send.
    const result = state().addProofs(MINT, "sat", [proof]);
    expect(result).toEqual({ added: 0, duplicates: 1 });
    expect(selectBalanceForUnit(state(), "sat")).toBe(0);
  });

  it("never merges units from the same mint", () => {
    state().addProofs(MINT, "sat", [makeProof(100)]);
    state().addProofs(MINT, "usd", [makeProof(5)]);

    expect(selectBalanceForUnit(state(), "sat")).toBe(100);
    expect(selectBalanceForUnit(state(), "usd")).toBe(5);
    expect(selectUnits(state())).toEqual(["sat", "usd"]);
  });

  it("is a no-op for an empty array", () => {
    expect(state().addProofs(MINT, "sat", [])).toEqual({
      added: 0,
      duplicates: 0,
    });
    expect(state().proofs[accountKey(MINT, "sat")]).toBeUndefined();
  });
});

// ---- Verification state ----

describe("verification", () => {
  it("reports offline-received proofs as unverified until marked", () => {
    state().addProofs(MINT, "sat", [
      makeProof(10, "a"),
      { ...makeProof(20, "b"), verified: true },
    ]);

    const account = selectAccounts(state())[0];
    expect(account.balance).toBe(30);
    expect(account.unverified).toBe(10);

    state().markVerified(MINT, "sat", ["a"]);
    expect(selectAccounts(state())[0].unverified).toBe(0);
  });
});

// ---- Reservations ----

describe("reservations", () => {
  it("moves proofs out of the spendable balance without deleting them", () => {
    const proof = makeProof(64, "held");
    state().addProofs(MINT, "sat", [proof, makeProof(32)]);
    state().reserveProofs("tx-1", MINT, "sat", [proof]);

    expect(selectBalanceForUnit(state(), "sat")).toBe(32);
    const account = selectAccounts(state()).find((a) => a.unit === "sat");
    expect(account?.reserved).toBe(64);
    expect(state().reserved["tx-1"].proofs).toHaveLength(1);
  });

  it("restores a reservation on release", () => {
    const proof = makeProof(64, "held");
    state().addProofs(MINT, "sat", [proof]);
    state().reserveProofs("tx-1", MINT, "sat", [proof]);

    const restored = state().releaseReserved("tx-1");
    expect(restored).toHaveLength(1);
    expect(selectBalanceForUnit(state(), "sat")).toBe(64);
    expect(state().reserved["tx-1"]).toBeUndefined();
  });

  it("does not double-credit when the reserved proof is already back", () => {
    const proof = makeProof(64, "held");
    state().addProofs(MINT, "sat", [proof]);
    state().reserveProofs("tx-1", MINT, "sat", [proof]);
    // Simulate the same proof arriving again (the recipient bounced the token
    // back) before the reservation was released.
    useWalletStore.setState({
      proofs: { [accountKey(MINT, "sat")]: [proof] },
    });

    state().releaseReserved("tx-1");
    expect(selectBalanceForUnit(state(), "sat")).toBe(64);
  });

  it("drops a reservation for good once delivery is confirmed", () => {
    const proof = makeProof(64, "held");
    state().addProofs(MINT, "sat", [proof]);
    state().reserveProofs("tx-1", MINT, "sat", [proof]);
    state().dropReserved("tx-1");

    expect(state().reserved["tx-1"]).toBeUndefined();
    expect(selectBalanceForUnit(state(), "sat")).toBe(0);
  });

  it("returns null when releasing an unknown reservation", () => {
    expect(state().releaseReserved("nope")).toBeNull();
  });

  // The reservation is the only thing standing between two concurrent sends and
  // putting one coin into two tokens. Callers select proofs, then await a mint
  // round trip, so both arrive here holding the same coins.
  it("refuses to reserve a proof another send already took", () => {
    const proof = makeProof(64, "contested");
    state().addProofs(MINT, "sat", [proof]);

    expect(state().reserveProofs("tx-a", MINT, "sat", [proof])).toBe(true);
    expect(state().reserveProofs("tx-b", MINT, "sat", [proof])).toBe(false);

    expect(state().reserved["tx-b"]).toBeUndefined();
    expect(selectBalanceForUnit(state(), "sat")).toBe(0);
  });

  it("reserves all or nothing when only part of the set is still available", () => {
    const kept = makeProof(8, "kept");
    const taken = makeProof(16, "taken");
    state().addProofs(MINT, "sat", [kept, taken]);
    state().reserveProofs("tx-a", MINT, "sat", [taken]);

    // A second send that wants both must not quietly reserve just the one it
    // can get: the token it builds would be short of the amount promised.
    expect(state().reserveProofs("tx-b", MINT, "sat", [kept, taken])).toBe(
      false,
    );
    expect(state().reserved["tx-b"]).toBeUndefined();
    expect(selectBalanceForUnit(state(), "sat")).toBe(8);
  });

  it("is idempotent, so a retry cannot reserve twice under one id", () => {
    const proof = makeProof(32, "once");
    state().addProofs(MINT, "sat", [proof]);

    expect(state().reserveProofs("tx-a", MINT, "sat", [proof])).toBe(true);
    expect(state().reserveProofs("tx-a", MINT, "sat", [proof])).toBe(false);
    expect(state().reserved["tx-a"].proofs).toHaveLength(1);
  });

  it("never lets a reused id replace a reservation with different coins", () => {
    // The case the check above cannot reach. Retrying with the SAME coins is
    // refused either way, because those coins are no longer spendable. Retrying
    // with DIFFERENT ones is only refused by the id check, and without it the
    // reservation is overwritten: the first coins are then in neither the
    // spendable pool nor any reservation, so the balance simply loses them.
    const first = makeProof(32, "first");
    const second = makeProof(8, "second");
    state().addProofs(MINT, "sat", [first, second]);

    expect(state().reserveProofs("tx-a", MINT, "sat", [first])).toBe(true);
    expect(state().reserveProofs("tx-a", MINT, "sat", [second])).toBe(false);

    expect(state().reserved["tx-a"].proofs).toEqual([first]);
    // The 8 was never taken, so it is still spendable and nothing vanished.
    expect(selectBalanceForUnit(state(), "sat")).toBe(8);
  });
});

// ---- removeProofs / replaceProofs ----

describe("removeProofs", () => {
  it("removes by secret and leaves the rest", () => {
    state().addProofs(MINT, "sat", [
      makeProof(64, "keep-me"),
      makeProof(32, "remove-me"),
    ]);
    state().removeProofs(MINT, "sat", ["remove-me"]);

    const remaining = state().proofs[accountKey(MINT, "sat")];
    expect(remaining).toHaveLength(1);
    expect(remaining[0].secret).toBe("keep-me");
  });

  it("is a no-op for unknown secrets", () => {
    state().addProofs(MINT, "sat", [makeProof(64, "existing")]);
    state().removeProofs(MINT, "sat", ["ghost"]);
    expect(state().proofs[accountKey(MINT, "sat")]).toHaveLength(1);
  });
});

describe("replaceProofs", () => {
  it("swaps the whole account list", () => {
    state().addProofs(MINT, "sat", [makeProof(32), makeProof(64)]);
    state().replaceProofs(MINT, "sat", [makeProof(128)]);

    const list = state().proofs[accountKey(MINT, "sat")];
    expect(list).toHaveLength(1);
    expect(list[0].amount).toBe(128);
  });
});

// ---- Mints ----

describe("mints", () => {
  it("keeps addedAtMs stable across patches", () => {
    state().addMint(MINT, { name: "First" });
    const first = state().mints[MINT].addedAtMs;
    state().addMint(MINT, { name: "Renamed" });

    expect(state().mints[MINT].addedAtMs).toBe(first);
    expect(state().mints[MINT].name).toBe("Renamed");
  });

  it("removing a mint deletes every account it holds", () => {
    state().addMint(MINT);
    state().addProofs(MINT, "sat", [makeProof(10)]);
    state().addProofs(MINT, "usd", [makeProof(5)]);
    state().addProofs(OTHER, "sat", [makeProof(20)]);

    state().removeMint(MINT);

    expect(state().proofs[accountKey(MINT, "sat")]).toBeUndefined();
    expect(state().proofs[accountKey(MINT, "usd")]).toBeUndefined();
    expect(state().proofs[accountKey(OTHER, "sat")]).toHaveLength(1);
  });
});

// ---- History ----

describe("history", () => {
  it("prepends newest first and updates in place", () => {
    state().addTx(tx({ id: "a" }));
    state().addTx(tx({ id: "b" }));
    expect(state().history.map((t) => t.id)).toEqual(["b", "a"]);

    state().updateTx("a", { status: "completed" });
    expect(state().history.find((t) => t.id === "a")?.status).toBe("completed");
  });
});

// ---- Nutzap replay guard ----

describe("redeemed nutzaps", () => {
  it("records an event id once so a relay replay cannot re-credit it", () => {
    state().markNutzapRedeemed("event-1");
    state().markNutzapRedeemed("event-1");
    expect(state().redeemedNutzaps).toEqual(["event-1"]);
  });
});

// ---- What survives a restart ----

// `partialize` decides what is written to disk, and a field left out of it is
// silently reset on every launch. Nothing else catches that: the field is
// declared, typed and written to all session long, and only a restart shows it
// was never kept.
//
// The key list is asserted as a whole on purpose. Adding a field to the store
// should require a deliberate answer to "does this need to outlive the process",
// and a test that has to be updated is how the question gets asked.
describe("persistence", () => {
  function persisted(): Record<string, unknown> {
    const partialize = useWalletStore.persist.getOptions().partialize;
    if (partialize === undefined) throw new Error("no partialize configured");
    return partialize(state()) as unknown as Record<string, unknown>;
  }

  it("writes exactly the state the wallet cannot rebuild for itself", () => {
    expect(Object.keys(persisted()).sort()).toEqual(
      [
        "backupEnabled",
        "backupVerified",
        "claimedTokens",
        "counters",
        "history",
        "mints",
        "nutzapPubkey",
        "proofs",
        "redeemedNutzaps",
        "reserved",
      ].sort(),
    );
  });

  it("keeps claimed-token markers, which outlive the process that made them", () => {
    // A payment chip lives in a chat message and messages survive a restart, so
    // a marker that does not leaves the chip offering a tap whose only possible
    // outcome is an error.
    state().markTokenClaimed("first-proof-secret");
    expect(persisted().claimedTokens).toEqual(["first-proof-secret"]);
  });
});

// ---- Selectors ----

describe("selectors", () => {
  it("sums a unit across mints but never across units", () => {
    state().addProofs(MINT, "sat", [makeProof(100), makeProof(50)]);
    state().addProofs(OTHER, "sat", [makeProof(200)]);
    state().addProofs(OTHER, "usd", [makeProof(7)]);

    expect(selectBalanceForUnit(state(), "sat")).toBe(350);
    expect(selectBalanceForUnit(state(), "usd")).toBe(7);
  });

  it("returns 0 for an empty store", () => {
    expect(selectBalanceForUnit(state(), "sat")).toBe(0);
    expect(selectAccounts(state())).toEqual([]);
  });

  it("lists an added mint with no proofs so it is visible in the UI", () => {
    state().addMint(MINT, { units: ["sat"] });
    const accounts = selectAccounts(state());
    expect(accounts).toHaveLength(1);
    expect(accounts[0]).toMatchObject({
      mintUrl: MINT,
      unit: "sat",
      balance: 0,
    });
  });

  it("selectSecrets returns the account's secrets", () => {
    state().addProofs(MINT, "sat", [
      makeProof(10, "alpha"),
      makeProof(20, "beta"),
    ]);
    const secrets = selectSecrets(state(), accountKey(MINT, "sat"));
    expect(secrets.has("alpha")).toBe(true);
    expect(secrets.has("gamma")).toBe(false);
    expect(selectSecrets(state(), accountKey(OTHER, "sat")).size).toBe(0);
  });
});

// ---- Backup coverage ----

describe("backup coverage", () => {
  it("reports nothing as unbacked while backup is off", () => {
    // With no recovery phrase there is no coverage to be inside or outside of,
    // so flagging proofs as "unbacked" would be noise.
    state().addProofs(MINT, "sat", [makeProof(10), makeProof(20)]);
    expect(selectAccounts(state())[0].unbacked).toBe(0);
  });

  it("counts proofs that were not derived from the phrase", () => {
    state().setBackupEnabled(true);
    state().addProofs(MINT, "sat", [
      { ...makeProof(10), secret: "ours", derived: true },
      { ...makeProof(20), secret: "theirs", derived: false },
    ]);

    const account = selectAccounts({
      proofs: state().proofs,
      reserved: state().reserved,
      mints: state().mints,
      backupEnabled: true,
    })[0];
    expect(account.balance).toBe(30);
    expect(account.unbacked).toBe(20);
  });
});

// ---- NUT-13 counters ----

describe("counters", () => {
  const KEYSET = "00ad268c4d1f5826";

  it("hands out a fresh range each time and never repeats", () => {
    // Reusing a counter re-derives a secret the mint has already signed, which
    // it rejects as a duplicate. Ranges must not overlap.
    const first = state().reserveCounters(KEYSET, 3);
    const second = state().reserveCounters(KEYSET, 2);

    expect(first).toEqual({ start: 0, count: 3 });
    expect(second).toEqual({ start: 3, count: 2 });
    expect(state().counters[KEYSET]).toBe(5);
  });

  it("treats a zero-size reservation as a read-only peek", () => {
    state().reserveCounters(KEYSET, 4);
    const peek = state().reserveCounters(KEYSET, 0);

    expect(peek).toEqual({ start: 4, count: 0 });
    expect(state().counters[KEYSET]).toBe(4);
  });

  it("tracks keysets independently", () => {
    state().reserveCounters(KEYSET, 5);
    expect(state().reserveCounters("other-keyset", 1).start).toBe(0);
  });

  it("advances to a floor but never backwards", () => {
    state().reserveCounters(KEYSET, 10);
    state().advanceCounter(KEYSET, 50);
    expect(state().counters[KEYSET]).toBe(50);

    // A restore that finds an older last-signature must not rewind the cursor
    // into counters already used by live proofs.
    state().advanceCounter(KEYSET, 20);
    expect(state().counters[KEYSET]).toBe(50);
  });

  it("clearAll resets backup state and counters together", () => {
    state().setBackupEnabled(true);
    state().reserveCounters(KEYSET, 5);
    state().clearAll();

    expect(state().backupEnabled).toBe(false);
    expect(state().counters).toEqual({});
  });
});

// ---- clearAll ----

describe("clearAll", () => {
  it("empties proofs, reservations, mints and history", () => {
    state().addMint(MINT);
    state().addProofs(MINT, "sat", [makeProof(10)]);
    state().addTx(tx());
    state().reserveProofs("tx-2", MINT, "sat", [makeProof(5)]);

    state().clearAll();

    expect(Object.keys(state().proofs)).toHaveLength(0);
    expect(Object.keys(state().reserved)).toHaveLength(0);
    expect(Object.keys(state().mints)).toHaveLength(0);
    expect(state().history).toHaveLength(0);
  });
});
