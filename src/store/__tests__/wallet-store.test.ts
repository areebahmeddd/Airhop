/**
 * @jest-environment node
 */
// Local Cashu proof wallet-store tests.
// Uses the in-memory MMKV mock — no native or network required.

import {
  selectMintBalances,
  selectSecrets,
  selectTotalBalance,
  useWalletStore,
  type StoredProof,
} from "../wallet-store";

// Reset store between tests.
beforeEach(() => {
  useWalletStore.getState().clearAll();
});

// ---- Helpers ----------------------------------------------------------------

function makeProof(amount: number, secret?: string): StoredProof {
  return {
    id: "000f01" + amount.toString(16).padStart(4, "0"),
    amount,
    secret: secret ?? Math.random().toString(36).slice(2),
    C: "02" + "ab".repeat(32),
  };
}

function state() {
  return useWalletStore.getState();
}

// ---- addProofs --------------------------------------------------------------

describe("addProofs", () => {
  it("adds proofs and reflects in proofsByMint", () => {
    state().addProofs("https://mint.example", [makeProof(64), makeProof(128)]);

    expect(state().proofsByMint["https://mint.example"]).toHaveLength(2);
  });

  it("deduplicates by secret", () => {
    const proof = makeProof(32, "same-secret");

    state().addProofs("https://mint.example", [proof]);
    state().addProofs("https://mint.example", [proof, makeProof(64)]);

    // Only 2 unique proofs: 'same-secret' (32 sat) + new (64 sat)
    expect(state().proofsByMint["https://mint.example"]).toHaveLength(2);
  });

  it("is a no-op for empty array", () => {
    state().addProofs("https://mint.example", []);

    expect(state().proofsByMint["https://mint.example"]).toBeUndefined();
  });

  it("keeps separate proof lists per mint", () => {
    state().addProofs("https://mint-a.example", [makeProof(100)]);
    state().addProofs("https://mint-b.example", [
      makeProof(200),
      makeProof(50),
    ]);

    expect(state().proofsByMint["https://mint-a.example"]).toHaveLength(1);
    expect(state().proofsByMint["https://mint-b.example"]).toHaveLength(2);
  });
});

// ---- removeProofs -----------------------------------------------------------

describe("removeProofs", () => {
  it("removes proofs by secret", () => {
    state().addProofs("https://mint.example", [
      makeProof(64, "keep-me"),
      makeProof(32, "remove-me"),
    ]);
    state().removeProofs("https://mint.example", ["remove-me"]);

    const remaining = state().proofsByMint["https://mint.example"];
    expect(remaining).toHaveLength(1);
    expect(remaining[0].secret).toBe("keep-me");
  });

  it("is a no-op for unknown secrets", () => {
    state().addProofs("https://mint.example", [makeProof(64, "existing")]);
    state().removeProofs("https://mint.example", ["ghost"]);

    expect(state().proofsByMint["https://mint.example"]).toHaveLength(1);
  });
});

// ---- replaceProofs ----------------------------------------------------------

describe("replaceProofs", () => {
  it("replaces the full proof list for a mint", () => {
    state().addProofs("https://mint.example", [makeProof(32), makeProof(64)]);
    state().replaceProofs("https://mint.example", [makeProof(128)]);

    expect(state().proofsByMint["https://mint.example"]).toHaveLength(1);
    expect(state().proofsByMint["https://mint.example"][0].amount).toBe(128);
  });
});

// ---- clearMint / clearAll ---------------------------------------------------

describe("clearMint", () => {
  it("removes all proofs for the given mint, keeping others", () => {
    state().addProofs("https://a.mint", [makeProof(10)]);
    state().addProofs("https://b.mint", [makeProof(20)]);
    state().clearMint("https://a.mint");

    expect(state().proofsByMint["https://a.mint"]).toBeUndefined();
    expect(state().proofsByMint["https://b.mint"]).toHaveLength(1);
  });
});

describe("clearAll", () => {
  it("empties all proofs across all mints", () => {
    state().addProofs("https://a.mint", [makeProof(10), makeProof(20)]);
    state().clearAll();

    expect(Object.keys(state().proofsByMint)).toHaveLength(0);
  });
});

// ---- Selectors --------------------------------------------------------------

describe("selectTotalBalance", () => {
  it("sums amounts across all mints", () => {
    state().addProofs("https://a.mint", [makeProof(100), makeProof(50)]);
    state().addProofs("https://b.mint", [makeProof(200)]);

    expect(selectTotalBalance(state())).toBe(350);
  });

  it("returns 0 for an empty store", () => {
    expect(selectTotalBalance(state())).toBe(0);
  });
});

describe("selectMintBalances", () => {
  it("returns per-mint balance entries with correct totals", () => {
    state().addProofs("https://a.mint", [makeProof(64), makeProof(32)]);

    const balances = selectMintBalances(state());
    expect(balances).toHaveLength(1);
    expect(balances[0].mintUrl).toBe("https://a.mint");
    expect(balances[0].balance).toBe(96);
    expect(balances[0].proofCount).toBe(2);
    expect(balances[0].unit).toBe("sat");
  });
});

describe("selectSecrets", () => {
  it("returns a Set of all stored secrets for a mint", () => {
    state().addProofs("https://mint.example", [
      makeProof(10, "alpha"),
      makeProof(20, "beta"),
    ]);

    const secrets = selectSecrets(state(), "https://mint.example");
    expect(secrets.has("alpha")).toBe(true);
    expect(secrets.has("beta")).toBe(true);
    expect(secrets.has("gamma")).toBe(false);
  });

  it("returns empty Set for unknown mint", () => {
    const secrets = selectSecrets(state(), "https://unknown.mint");
    expect(secrets.size).toBe(0);
  });
});
