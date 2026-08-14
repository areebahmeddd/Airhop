/**
 * @jest-environment node
 */
// What happens to the money between "send" and "they got it".
//
// A Cashu send is offline: nothing is destroyed at the mint, the proofs are
// moved into a reservation and serialised into a token string. So the coins
// exist in exactly one of three places at any moment, and every bug in this
// file's subject matter is the same bug: they end up in two, or in none.
//
// The three resolutions are `confirmSend` (they have it, drop the reservation),
// `reclaimSend` (it never landed, put it back) and neither (still pending, the
// token is re-shareable after a restart). These tests are written from the taps
// a real person makes, including the ones they were not supposed to make: two
// sends at once, reclaim tapped twice, reclaim tapped after delivery finally
// confirmed. None of those are hypothetical, they are what a flaky radio and an
// impatient thumb produce.
//
// No mint is involved and none is needed: the offline path is the whole point.

// Imports come first in source; Babel hoists jest.mock() calls above them.
import { getEncodedToken, type Token } from "@cashu/cashu-ts";
import { toProofLike } from "@core/payments/cashu";
import {
  accountKey,
  bootstrapWalletStorage,
  isWalletStorageReady,
  useWalletStore,
  whenWalletHydrated,
  type StoredProof,
} from "@store/wallet-store";
import {
  confirmSend,
  failNutzapDelivery,
  failSend,
  prepareSend,
  quoteSend,
  receiveToken,
  reclaimSend,
  settleNutzap,
  WalletError,
} from "../wallet-service";

// The keychain holds the wallet partition's AES key. Only the two secret
// accessors are replaced: KEYCHAIN_ITEMS is read at module scope by both
// wallet-store and wallet-service, so swapping the whole module leaves those
// reading a property off undefined.
jest.mock("@core/crypto/keychain", () => {
  const secrets = new Map<string, string>();
  return {
    ...jest.requireActual("@core/crypto/keychain"),
    readSecret: jest.fn((item: string) => secrets.get(item) ?? null),
    writeSecret: jest.fn((item: string, value: string) => {
      secrets.set(item, value);
    }),
  };
});

// An in-memory MMKV, so zustand's persist middleware works for real rather than
// being stubbed out. Persistence is part of what is under test here: a
// reservation that does not survive a write is a reservation that loses money.
jest.mock("react-native-mmkv", () => {
  class MockMMKV {
    private store = new Map<string, string>();
    getString(key: string): string | undefined {
      return this.store.get(key);
    }
    set(key: string, value: string): void {
      this.store.set(key, value);
    }
    remove(key: string): void {
      this.store.delete(key);
    }
    clearAll(): void {
      this.store.clear();
    }
  }
  const instances = new Map<string, MockMMKV>();
  return {
    createMMKV: ({ id = "default" }: { id?: string } = {}) => {
      if (!instances.has(id)) instances.set(id, new MockMMKV());
      return instances.get(id)!;
    },
    deleteMMKV: jest.fn(() => true),
  };
});

const MINT = "https://mint.example.com";
const KEYSET = "00ad268c4d1f5826";
const UNIT = "sat";

// Powers of two, which is what a mint actually hands out, so an exact amount is
// constructible and the fee-free fallback selector can land on it.
// A real encodable token from an arbitrary mint, for the cases that turn on
// which mint a token names.
function encodedToken(mint: string, amounts: number[]): string {
  return getEncodedToken({
    mint,
    unit: UNIT,
    proofs: proofsOf(amounts).map(toProofLike),
  } as unknown as Token);
}

function proofsOf(amounts: number[]): StoredProof[] {
  return amounts.map((amount, i) => ({
    id: KEYSET,
    amount,
    secret: `secret-${String(amount)}-${String(i)}`,
    C: "02" + i.toString(16).padStart(2, "0").repeat(32),
    verified: true,
  }));
}

function spendable(): number {
  const held = useWalletStore.getState().proofs[accountKey(MINT, UNIT)] ?? [];
  return held.reduce((sum, p) => sum + p.amount, 0);
}

function reservedTotal(): number {
  return Object.values(useWalletStore.getState().reserved).reduce(
    (sum, entry) => sum + entry.proofs.reduce((s, p) => s + p.amount, 0),
    0,
  );
}

function txStatus(txId: string): string | undefined {
  return useWalletStore.getState().history.find((t) => t.id === txId)?.status;
}

// The invariant every test below re-checks. Coins are conserved: whatever is
// not spendable is reserved, and nothing is in both places or neither.
function totalHeld(): number {
  return spendable() + reservedTotal();
}

beforeAll(async () => {
  await bootstrapWalletStorage();
  await whenWalletHydrated();
  expect(isWalletStorageReady()).toBe(true);
});

beforeEach(() => {
  useWalletStore.getState().clearAll();
  // The mint is added first, as it always is in a real wallet: you choose a
  // mint before you hold any of its paper. Receiving refuses a mint the user
  // never chose, so seeding proofs without this would not resemble the app.
  useWalletStore.getState().addMint(MINT, { units: [UNIT] });
  useWalletStore
    .getState()
    .addProofs(MINT, UNIT, proofsOf([1, 2, 4, 8, 16, 32]));
});

describe("preparing a send", () => {
  it("moves the coins out of the balance and into a reservation", async () => {
    const before = spendable();
    const prepared = await prepareSend({ amount: 10 });

    // 2 + 8, exactly. The user is told 10 and 10 is what leaves.
    expect(prepared.amount).toBe(10);
    expect(prepared.spend).toBe(10);
    expect(spendable()).toBe(before - 10);
    expect(reservedTotal()).toBe(10);
    expect(totalHeld()).toBe(before);
    expect(txStatus(prepared.txId)).toBe("pending");
  });

  it("hands back a token that carries the money", async () => {
    // The token string is what the recipient actually receives, and it is kept
    // on the transaction so it survives a restart and stays re-shareable.
    const prepared = await prepareSend({ amount: 4 });
    expect(prepared.token.startsWith("cashu")).toBe(true);
    expect(prepared.token.length).toBeGreaterThan(12);
  });

  it("refuses to overpay silently when no exact amount can be made", async () => {
    // Only a 16 is left, so paying 10 would really spend 16. The user has to be
    // told and has to agree, otherwise a tap costs them 6 sats they never saw.
    useWalletStore.getState().clearAll();
    useWalletStore.getState().addMint(MINT, { units: [UNIT] });
    useWalletStore.getState().addProofs(MINT, UNIT, proofsOf([16]));

    await expect(prepareSend({ amount: 10 })).rejects.toMatchObject({
      code: "inexact",
    });
    // And nothing moved, so a refusal is not a silent reservation.
    expect(spendable()).toBe(16);
    expect(reservedTotal()).toBe(0);
  });

  it("spends the larger coin once the user has agreed to it", async () => {
    useWalletStore.getState().clearAll();
    useWalletStore.getState().addMint(MINT, { units: [UNIT] });
    useWalletStore.getState().addProofs(MINT, UNIT, proofsOf([16]));

    const prepared = await prepareSend({ amount: 10, allowInexact: true });
    expect(prepared.spend).toBe(16);
    expect(reservedTotal()).toBe(16);
  });

  it("refuses a send larger than the balance", async () => {
    await expect(prepareSend({ amount: 10_000 })).rejects.toBeInstanceOf(
      WalletError,
    );
    expect(reservedTotal()).toBe(0);
  });

  it("refuses a zero or negative amount", async () => {
    for (const amount of [0, -5]) {
      await expect(quoteSend({ amount })).rejects.toMatchObject({
        code: "insufficient",
      });
    }
  });
});

describe("resolving a send", () => {
  it("keeps the money gone once the recipient has it", async () => {
    const before = spendable();
    const prepared = await prepareSend({ amount: 10 });

    confirmSend(prepared.txId);

    expect(spendable()).toBe(before - 10);
    expect(reservedTotal()).toBe(0);
    expect(txStatus(prepared.txId)).toBe("completed");
  });

  it("gives the money back when the transfer never landed", async () => {
    const before = spendable();
    const prepared = await prepareSend({ amount: 10 });

    expect(reclaimSend(prepared.txId)).toBe(true);

    expect(spendable()).toBe(before);
    expect(reservedTotal()).toBe(0);
    expect(txStatus(prepared.txId)).toBe("reclaimed");
  });

  it("does not pay the user twice when reclaim is tapped again", async () => {
    // An impatient thumb, or a retry after a UI hiccup. The second tap must be
    // a no-op: crediting twice invents coins the mint will refuse later, and
    // the user only finds out when a spend fails.
    const before = spendable();
    const prepared = await prepareSend({ amount: 10 });

    expect(reclaimSend(prepared.txId)).toBe(true);
    expect(reclaimSend(prepared.txId)).toBe(false);

    expect(spendable()).toBe(before);
    expect(totalHeld()).toBe(before);
  });

  it("refuses to reclaim money the recipient already has", async () => {
    // Delivery confirms, then the user taps reclaim on a stale screen. The
    // coins are genuinely spent, so putting them back would show a balance
    // that does not exist.
    const before = spendable();
    const prepared = await prepareSend({ amount: 10 });

    confirmSend(prepared.txId);
    expect(reclaimSend(prepared.txId)).toBe(false);

    expect(spendable()).toBe(before - 10);
    expect(txStatus(prepared.txId)).toBe("completed");
  });

  it("keeps the coins reclaimable after a delivery failure", async () => {
    // `failSend` records why without resolving anything, because a failed
    // delivery is not proof the recipient has nothing. The reservation stays so
    // the token can still be re-shared or pulled back deliberately.
    const prepared = await prepareSend({ amount: 10 });

    failSend(prepared.txId, "relay timeout");

    expect(reservedTotal()).toBe(10);
    expect(reclaimSend(prepared.txId)).toBe(true);
    expect(reservedTotal()).toBe(0);
  });
});

describe("two sends at once", () => {
  it("never puts the same coin into two tokens", async () => {
    // Both sends are quoted against the same pool before either reserves, so
    // both arrive holding the same coins. Exactly one may win. The loser is a
    // retry, not a second spend: the alternative is two recipients each seeing
    // a balance where only the first to reach the mint actually has it.
    useWalletStore.getState().clearAll();
    useWalletStore.getState().addMint(MINT, { units: [UNIT] });
    useWalletStore.getState().addProofs(MINT, UNIT, proofsOf([8]));

    const results = await Promise.allSettled([
      prepareSend({ amount: 8 }),
      prepareSend({ amount: 8 }),
    ]);

    const won = results.filter((r) => r.status === "fulfilled");
    expect(won).toHaveLength(1);
    expect(reservedTotal()).toBe(8);
    expect(spendable()).toBe(0);
    expect(totalHeld()).toBe(8);
  });

  it("makes the loser retry even when the balance covers both", async () => {
    // Two coins, two sends of one coin each, and still only one gets through.
    // Both were quoted against the same pool before either reserved, so both
    // asked for the same coin. Serialising them is the safe answer and the
    // cost is one retry, which is the trade this design makes deliberately.
    useWalletStore.getState().clearAll();
    useWalletStore.getState().addMint(MINT, { units: [UNIT] });
    useWalletStore.getState().addProofs(MINT, UNIT, proofsOf([8, 8]));

    const first = await Promise.allSettled([
      prepareSend({ amount: 8 }),
      prepareSend({ amount: 8 }),
    ]);
    expect(first.filter((r) => r.status === "fulfilled")).toHaveLength(1);

    // The retry is what the user's second tap becomes, and it must succeed
    // against the coin the winner did not take.
    const retry = await prepareSend({ amount: 8 });
    expect(retry.spend).toBe(8);
    expect(reservedTotal()).toBe(16);
    expect(spendable()).toBe(0);
    expect(totalHeld()).toBe(16);
  });

  it("conserves the balance when one of two racing sends is reclaimed", async () => {
    useWalletStore.getState().clearAll();
    useWalletStore.getState().addMint(MINT, { units: [UNIT] });
    useWalletStore.getState().addProofs(MINT, UNIT, proofsOf([8, 8]));

    const results = await Promise.allSettled([
      prepareSend({ amount: 8 }),
      prepareSend({ amount: 8 }),
    ]);
    const winner = results.find((r) => r.status === "fulfilled");
    if (winner?.status !== "fulfilled") throw new Error("expected one send");

    expect(reclaimSend(winner.value.txId)).toBe(true);

    // Back where it started: nothing reserved, nothing lost, nothing invented.
    expect(totalHeld()).toBe(16);
    expect(spendable()).toBe(16);
    expect(reservedTotal()).toBe(0);
  });
});

// Receiving is where a token can be credited twice, or credited when it was
// never anybody else's. Only the offline paths are exercised here, which is
// deliberate: they are the ones that decide whether the money is real before
// any mint is asked, and they are what runs when there is no signal.
describe("receiving a token", () => {
  it("refuses an unreadable token without touching the balance", async () => {
    const before = spendable();

    await expect(receiveToken("not a token")).rejects.toMatchObject({
      code: "invalid-token",
    });

    expect(spendable()).toBe(before);
    expect(reservedTotal()).toBe(0);
  });

  it("says which mint, rather than 'unreadable', for a mint we do not have", async () => {
    // The two failures need different words because only one is actionable.
    // A token from a mint the user has not added is thirty seconds from
    // working; calling it unreadable sends them looking for a bug instead.
    // `getTokenMetadata` is what separates them: it reads the mint without
    // needing keyset data, so it answers even when the full decode cannot.
    const before = spendable();
    const other = "https://mint.someone-else.example";
    const token = encodedToken(other, [8]);

    await expect(
      receiveToken(token, { preferOffline: true }),
    ).rejects.toMatchObject({ code: "no-mint" });

    // Refused, and nothing about our own mint's balance moved.
    expect(spendable()).toBe(before);
    expect(reservedTotal()).toBe(0);
  });

  it("points a re-scanned own send at reclaim instead of redeeming it", async () => {
    // The real sequence: a send fails, and the user scans the token still on
    // their own screen to "get the money back". Redeeming would work but pays
    // the mint a fee to return money already held, files it as income, and
    // leaves the send pending. Reclaim does it directly and for free.
    const before = spendable();
    const prepared = await prepareSend({ amount: 10 });

    const result = await receiveToken(prepared.token, { preferOffline: true });

    expect(result.outcome).toBe("own-pending");
    expect(result.amount).toBe(10);
    // Nothing was credited and the reservation is intact, so reclaim still works.
    expect(spendable()).toBe(before - 10);
    expect(reservedTotal()).toBe(10);
    expect(reclaimSend(prepared.txId)).toBe(true);
    expect(spendable()).toBe(before);
  });

  it("reports a token it already holds rather than crediting it twice", async () => {
    // Scanning the same token twice, or receiving it over two rails at once.
    // A second credit would invent coins the mint has already spent.
    const before = spendable();
    const prepared = await prepareSend({ amount: 10 });
    reclaimSend(prepared.txId);
    expect(spendable()).toBe(before);

    const result = await receiveToken(prepared.token, { preferOffline: true });

    expect(result.outcome).toBe("duplicate");
    expect(spendable()).toBe(before);
    expect(totalHeld()).toBe(before);
  });
});

// A nutzap is the one payment that is final the moment it is made. The proofs
// are cryptographically locked to the recipient's key, so they are theirs
// whatever happens to the delivery afterwards. That makes the usual "put it
// back" path actively wrong here, and the protection is structural rather than
// a check: locking never creates a reservation, so there is nothing to release.
describe("a nutzap, once locked to their key", () => {
  const NUTZAP_TX = "nutzap-tx-1";

  // What `lockProofsForNutzap` leaves behind after its mint round trip: the
  // proofs are gone from the pool, not reserved, and a pending record remains.
  function lockedNutzap(): void {
    const store = useWalletStore.getState();
    store.removeProofs(
      MINT,
      UNIT,
      proofsOf([8]).map((p) => p.secret),
    );
    store.addTx({
      id: NUTZAP_TX,
      kind: "nutzap-out",
      status: "pending",
      amount: 8,
      unit: UNIT,
      mintUrl: MINT,
      createdAtMs: 1_700_000_000_000,
      updatedAtMs: 1_700_000_000_000,
      counterparty: "02" + "ab".repeat(32),
    });
  }

  it("cannot be reclaimed, because the money is already theirs", () => {
    lockedNutzap();
    const after = spendable();

    // The same call that legitimately pulls back an ordinary send must refuse
    // here. Succeeding would credit this wallet with proofs the recipient can
    // spend, inventing money that the mint will refuse later.
    expect(reclaimSend(NUTZAP_TX)).toBe(false);
    expect(spendable()).toBe(after);
    expect(reservedTotal()).toBe(0);
  });

  it("is marked delivered when it arrives by some other route", () => {
    // The relay publish failed but the recipient got it another way, so the
    // transaction has to stop looking pending forever.
    lockedNutzap();
    settleNutzap(NUTZAP_TX);
    expect(txStatus(NUTZAP_TX)).toBe("completed");
  });

  it("records a delivery failure without giving the money back", () => {
    lockedNutzap();
    const after = spendable();

    failNutzapDelivery(NUTZAP_TX, "no relay accepted the event");

    // Still not reclaimable, and still not credited: a failed delivery says
    // nothing about whether the recipient can spend the proofs.
    expect(spendable()).toBe(after);
    expect(reclaimSend(NUTZAP_TX)).toBe(false);
    expect(spendable()).toBe(after);
  });
});
