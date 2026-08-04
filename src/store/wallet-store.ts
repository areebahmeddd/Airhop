// Local Cashu wallet state: proofs, mints, in-flight sends, and history.
//
// Cashu proofs are bearer instruments. Whoever holds the `secret`/`C` pair owns
// the value, so this store is the only place in the app that must be encrypted
// at rest: the backing MMKV file is opened with an AES-256 key that lives in the
// iOS Keychain / Android Keystore (see `bootstrapWalletStorage`). Nothing here
// touches the network; every mint call lives in `src/services/wallet-service.ts`.
//
// Shape
// -----
// State is keyed by *account*, meaning a (mint URL, unit) pair. A mint can issue
// sat, usd and eur from the same host, and those are different currencies: they
// must never be summed into one balance. `accountKey()` builds the composite key
// and `parseAccountKey()` splits it back (mint URLs cannot contain `|`).
//
// Proof lifecycle
// ---------------
//   spendable + verified    swapped at the mint, or minted by us. Known good.
//   spendable + unverified  received offline (BLE/QR/paste). Cryptographically
//                           well-formed, and DLEQ-checked when we hold the mint
//                           keys, but the mint has NOT confirmed it is unspent.
//                           DLEQ proves the mint signed it; it can never prove
//                           the sender did not already spend it elsewhere. These
//                           count towards the balance but are surfaced
//                           separately in the UI and are redeemed first.
//   reserved                set aside for a send that has been serialised into a
//                           token but not yet confirmed delivered. Excluded from
//                           the spendable balance so the same proof cannot be
//                           handed to two people, and recoverable via
//                           `reclaimSend` if the transfer never lands.
//
// The reserved bucket is what makes a crash mid-send survivable: proofs are
// moved (never deleted) and the exact token string is kept on the transaction,
// so the user can re-share or reclaim it after a restart.
//
// Backup
// ------
// Off by default. When the user sets up a recovery phrase, proof secrets stop
// being random and are derived from it instead (NUT-13), which is what lets a
// new device rebuild the balance by asking the mint which of those secrets it
// signed (NUT-09). `counters` is the per-keyset derivation cursor that makes
// that ordering reproducible; it must only ever move forward, because reusing a
// counter recreates a secret the mint has already seen. `StoredProof.derived`
// records which proofs are actually covered, since anything received from
// somebody else carries their secrets until it is swapped.
//
// The phrase itself is never stored here. It lives in the keychain alongside
// the identity keys (see `core/payments/wallet-seed.ts`).

import EncryptedStorage from "react-native-encrypted-storage";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { bytesToBase64 } from "../core/encoding/base64";

// ---- Constants --------------------------------------------------------------

export const WALLET_STORAGE_ID = "wallet-store";

// Keychain/Keystore entry holding the MMKV encryption key.
const ENCRYPTION_KEY_ITEM = "airhop.wallet.mmkvKey.v1";

// MMKV caps AES-256 keys at 32 bytes; 24 random bytes in base64 is exactly 32
// ASCII characters, so this spends the whole budget on entropy.
const ENCRYPTION_KEY_BYTES = 24;

// Separator between mint URL and unit in an account key.
const ACCOUNT_SEP = "|";

// ---- Types ------------------------------------------------------------------

export interface SerializedDleq {
  e: string;
  s: string;
  r?: string;
}

// A proof as persisted. `amount` is a plain number (the cashu-ts `Amount` value
// object does not survive JSON), denominated in the account's unit.
export interface StoredProof {
  id: string; // Keyset ID
  amount: number;
  secret: string;
  C: string; // Unblinded signature from the mint
  dleq?: SerializedDleq; // NUT-12 discrete-log-equality witness, when present
  witness?: string; // NUT-11 P2PK / NUT-14 HTLC witness, when present
  // False for anything received offline: the mint has not told us this proof is
  // unspent. Set true after a successful swap or NUT-07 state check.
  verified?: boolean;
  // True when this proof's secret was derived from the recovery phrase (NUT-13)
  // rather than generated randomly, which is what makes it restorable on
  // another device. Proofs received from someone else carry *their* secrets, so
  // they are never derived until we swap them at the mint.
  derived?: boolean;
  // When this proof entered the wallet, for "oldest unverified" prompts.
  receivedAtMs?: number;
}

export type TxKind =
  | "send" // outgoing ecash token (BLE, QR, share sheet)
  | "receive" // incoming ecash token
  | "mint" // Lightning deposit (bolt11 invoice paid to the mint)
  | "melt" // Lightning withdrawal (mint pays an invoice out)
  | "swap" // refresh/consolidate at the mint, no net value change
  | "nutzap-out" // NIP-61 outgoing
  | "nutzap-in"; // NIP-61 incoming

export type TxStatus =
  | "pending" // reserved/awaiting the mint or the recipient
  | "completed"
  | "failed"
  | "reclaimed" // a pending send the user pulled back into the balance
  | "expired"; // a mint quote that ran out before it was paid

export interface WalletTx {
  id: string;
  kind: TxKind;
  status: TxStatus;
  // Face value moved, always positive. Direction comes from `kind`.
  amount: number;
  // Mint fee paid on top (NUT-02 input fees, or a melt fee reserve).
  fee?: number;
  unit: string;
  mintUrl: string;
  createdAtMs: number;
  updatedAtMs: number;
  memo?: string;
  // Peer ID, npub, or mint host, depending on `kind`.
  counterparty?: string;
  // Serialised token for a pending send, so it can be re-shared after a
  // restart, and so `reclaimSend` has something to show if reclaim fails.
  token?: string;
  // Mint/melt quote identifier and the bolt11 invoice it relates to.
  quoteId?: string;
  invoice?: string;
  // Melt only: the blank change outputs (NUT-08), serialised, written before
  // the melt request goes out.
  //
  // A melt sends the invoice amount plus a routing reserve, and whatever
  // routing does not use comes back as change the mint signs against these
  // blanks. Unblinding them needs the blinding factors, which otherwise live
  // only in memory for the duration of the call. If the response never arrives,
  // the melt may still have succeeded at the mint and that change becomes
  // unrecoverable. Persisting them first lets `reconcile` rebuild it later.
  // Cleared once the change has been credited.
  meltOutputs?: unknown;
  // Populated on `failed`, shown verbatim in the transaction detail sheet.
  error?: string;
}

// A mint the user has chosen to trust, plus everything we cached from it so the
// wallet stays useful offline (fees, units, and the keys DLEQ verification
// needs).
export interface StoredMint {
  url: string;
  addedAtMs: number;
  name?: string;
  description?: string;
  // Units the mint advertises keysets for, e.g. ["sat", "usd"].
  units?: string[];
  // NUT numbers the mint supports, used to gate Lightning and P2PK features.
  supportedNuts?: number[];
  // `keyChain.cache` from cashu-ts, verbatim. Holds public keys only, so it is
  // not secret, but it is what makes offline DLEQ verification possible.
  keysetCache?: unknown;
  keysetCacheAtMs?: number;
  // Raw `/v1/info` response, kept verbatim so `wallet.loadMintFromCache` can be
  // handed exactly what it expects on a cold start with no network.
  infoResponse?: unknown;
  // Per-keyset input fee in parts-per-thousand (NUT-02), for offline fee maths.
  feePpkByKeysetId?: Record<string, number>;
  // Last time any mint call succeeded, for the "unreachable" badge.
  lastSeenMs?: number;
}

export interface AccountBalance {
  key: string;
  mintUrl: string;
  unit: string;
  // Sum of spendable proofs (verified + unverified).
  balance: number;
  // Subset of `balance` the mint has not confirmed as unspent.
  unverified: number;
  // Subset of `balance` that the recovery phrase could not rebuild, because
  // those secrets were not derived from it. Zero when backup is off, since
  // nothing is covered then and the distinction would be noise.
  unbacked: number;
  // Sum of proofs held in the reserved bucket, not spendable.
  reserved: number;
  proofCount: number;
}

interface WalletState {
  // Spendable proofs, keyed by `accountKey(mintUrl, unit)`.
  proofs: Record<string, StoredProof[]>;
  // Proofs set aside for an in-flight send, keyed by transaction id.
  reserved: Record<string, { account: string; proofs: StoredProof[] }>;
  // Mints the user trusts, keyed by normalised URL.
  mints: Record<string, StoredMint>;
  // Newest first, capped at MAX_HISTORY.
  history: WalletTx[];
  // P2PK public key we publish in NIP-61 kind 10019, hex, 33-byte compressed.
  // The matching private key lives in the Keychain, never here.
  nutzapPubkey?: string;
  // Nostr event ids of nutzaps already redeemed, so a relay replay cannot
  // double-credit the balance.
  redeemedNutzaps: string[];
  // First proof secret of every token already taken into the wallet. A secret
  // is random and unique to its token, so it identifies one without storing the
  // whole string. This is display state, not a spend guard: `addProofs` already
  // deduplicates. It exists so a payment card in a chat can read "Claimed"
  // instead of offering a button that can only produce a confusing error.
  claimedTokens: string[];

  // Whether a recovery phrase has been set up. Off by default: until the user
  // opts in, proof secrets are random and nothing is restorable. The phrase
  // itself lives in the keychain, never here.
  backupEnabled: boolean;
  // Whether the user proved they wrote the phrase down. A phrase that exists
  // but was never copied out is the worst state to be in, because the wallet
  // looks protected and is not, so the two are tracked separately and the UI
  // says which one it is.
  backupVerified: boolean;
  // Next NUT-13 derivation counter per keyset id. Deriving the same counter
  // twice recreates the same secret, which the mint rejects as a duplicate, so
  // this only ever moves forward and is persisted before the outputs it covers
  // are sent.
  counters: Record<string, number>;

  // ---- Mints ----
  addMint: (mintUrl: string, patch?: Partial<StoredMint>) => void;
  updateMint: (mintUrl: string, patch: Partial<StoredMint>) => void;
  removeMint: (mintUrl: string) => void;

  // ---- Proofs ----
  addProofs: (
    mintUrl: string,
    unit: string,
    proofs: StoredProof[],
  ) => { added: number; duplicates: number };
  removeProofs: (mintUrl: string, unit: string, secrets: string[]) => void;
  replaceProofs: (mintUrl: string, unit: string, proofs: StoredProof[]) => void;
  markVerified: (mintUrl: string, unit: string, secrets: string[]) => void;

  // ---- Reservations ----
  // Move proofs out of the spendable pool and hold them against `txId`.
  // Returns false and changes nothing when any of the proofs has already been
  // taken by another send, which is the only thing standing between two
  // concurrent sends and putting the same coin in two tokens.
  reserveProofs: (
    txId: string,
    mintUrl: string,
    unit: string,
    proofs: StoredProof[],
  ) => boolean;
  // Put a reservation back into the spendable pool (send never landed).
  releaseReserved: (txId: string) => StoredProof[] | null;
  // Drop a reservation for good (recipient confirmed, or mint says spent).
  dropReserved: (txId: string) => void;

  // ---- History ----
  addTx: (tx: WalletTx) => void;
  updateTx: (id: string, patch: Partial<WalletTx>) => void;

  // ---- Nutzap ----
  setNutzapPubkey: (pubkey: string) => void;
  markNutzapRedeemed: (eventId: string) => void;
  markTokenClaimed: (firstSecret: string) => void;

  // ---- Backup / NUT-13 counters ----
  setBackupEnabled: (enabled: boolean) => void;
  setBackupVerified: (verified: boolean) => void;
  // Claim `n` counters for a keyset and move the cursor past them. Synchronous
  // read-modify-write with no await in between, so two concurrent callers
  // cannot be handed the same range.
  reserveCounters: (
    keysetId: string,
    n: number,
  ) => { start: number; count: number };
  // Move the cursor forward to at least `minNext`. Never moves it back: a lower
  // value would re-issue counters that have already produced live proofs.
  advanceCounter: (keysetId: string, minNext: number) => void;

  // ---- Wipe ----
  clearAccount: (mintUrl: string, unit: string) => void;
  clearAll: () => void;
}

// Keep history bounded: MMKV holds the whole blob in memory on read.
const MAX_HISTORY = 500;

// Ring buffer of redeemed nutzap ids. Well past any relay's replay window.
const MAX_REDEEMED_NUTZAPS = 1000;

// Ring buffer of claimed-token markers. Purely cosmetic, so an entry falling
// off simply means a very old payment card offers Claim again, which then
// reports "already claimed" as it did before.
const MAX_CLAIMED_TOKENS = 1000;

// ---- Account keys -----------------------------------------------------------

// Normalise a mint URL so `https://m.example.com/` and `https://m.example.com`
// are one mint. Lowercases the host (case-insensitive per RFC 3986) but leaves
// the path alone, since mint paths are case-sensitive.
export function normalizeMintUrl(raw: string): string {
  const trimmed = raw.trim();
  try {
    const url = new URL(trimmed);
    url.hostname = url.hostname.toLowerCase();
    url.hash = "";
    url.search = "";
    const path = url.pathname.replace(/\/+$/, "");
    return `${url.protocol}//${url.host}${path}`;
  } catch {
    return trimmed.replace(/\/+$/, "");
  }
}

export function accountKey(mintUrl: string, unit: string): string {
  return `${normalizeMintUrl(mintUrl)}${ACCOUNT_SEP}${unit}`;
}

export function parseAccountKey(key: string): {
  mintUrl: string;
  unit: string;
} {
  const idx = key.lastIndexOf(ACCOUNT_SEP);
  if (idx < 0) return { mintUrl: key, unit: "sat" };
  return { mintUrl: key.slice(0, idx), unit: key.slice(idx + 1) };
}

// ---- Encrypted storage bootstrap --------------------------------------------

// MMKV needs its encryption key at construction time, but reading the Keychain
// is async, so the instance cannot exist at module scope. Every persist call is
// therefore funnelled through `ready`, a promise that resolves once the key has
// been fetched (or created) and the instance opened. zustand/persist accepts an
// async storage adapter, so this is invisible to callers apart from
// `useWalletStore.persist.hasHydrated()`.

type MMKVLike = ReturnType<typeof createMMKV>;

let instance: MMKVLike | null = null;
let ready: Promise<MMKVLike> | null = null;

function randomKey(): string {
  // Base64 of 24 bytes is 32 characters.
  return bytesToBase64(
    crypto.getRandomValues(new Uint8Array(ENCRYPTION_KEY_BYTES)),
  );
}

async function loadOrCreateEncryptionKey(): Promise<string> {
  const existing = await EncryptedStorage.getItem(ENCRYPTION_KEY_ITEM);
  if (typeof existing === "string" && existing.length > 0) return existing;
  const fresh = randomKey();
  await EncryptedStorage.setItem(ENCRYPTION_KEY_ITEM, fresh);
  return fresh;
}

// Open (or reuse) the encrypted wallet store. Safe to call repeatedly; the
// first call wins and every later one awaits the same promise.
export function bootstrapWalletStorage(): Promise<MMKVLike> {
  ready ??= (async () => {
    let encryptionKey: string | undefined;
    try {
      encryptionKey = await loadOrCreateEncryptionKey();
    } catch {
      // Keychain/Keystore unavailable (locked device, simulator quirk, a build
      // without the native module). Falling back to an unencrypted store would
      // silently downgrade the security of bearer tokens, so refuse: the store
      // stays empty, the UI shows the wallet as locked, and no proof is ever
      // written to plaintext disk.
      encryptionKey = undefined;
    }
    if (encryptionKey === undefined) {
      throw new Error("wallet-keystore-unavailable");
    }
    const mmkv = createMMKV({
      id: WALLET_STORAGE_ID,
      encryptionKey,
      encryptionType: "AES-256",
    });
    instance = mmkv;
    return mmkv;
  })();
  return ready;
}

// Whether zustand has finished replacing the initial empty state with what was
// on disk. Separate from `instance`, and the distinction matters a great deal.
//
// Opening the MMKV file is only step one. zustand's persist middleware then
// reads it asynchronously and *overwrites* the store with the result. Anything
// written in that window is silently discarded when hydration lands. A nutzap
// redeemed one tick too early would be credited and then erased, and a balance
// check would report an empty wallet to somebody who has money.
//
// Left false when hydration fails (an unreadable keychain, a corrupt file), so
// the wallet reports itself locked rather than presenting an empty balance as
// though it were real.
let hydrated = false;
let hydrationSettled = false;
const hydrationWaiters: (() => void)[] = [];

// How long startup will wait for hydration before giving up on it. Only reached
// if the storage promise never settles at all; a normal failure settles fast.
// Present so a wedged read can never hang app startup behind it.
const HYDRATION_TIMEOUT_MS = 15_000;

// Called exactly once, from `onRehydrateStorage`, on both the success and the
// failure path. Waiting on zustand's `onFinishHydration` instead would deadlock:
// when hydration rejects, zustand invokes the rehydrate callback but leaves
// `hasHydrated` false and never notifies the finish listeners.
function settleHydration(ok: boolean): void {
  if (hydrationSettled) return;
  hydrated = ok;
  hydrationSettled = true;
  for (const waiter of hydrationWaiters.splice(0)) waiter();
}

// True once the store is both open and populated from disk. Everything that
// spends, credits, or reports a balance gates on this.
export function isWalletStorageReady(): boolean {
  return instance !== null && hydrated;
}

// Resolves once hydration has settled, successfully or not. Callers must
// re-check `isWalletStorageReady()` afterwards rather than assuming success.
export function whenWalletHydrated(): Promise<void> {
  if (hydrationSettled) return Promise.resolve();
  return new Promise((resolve) => {
    hydrationWaiters.push(resolve);
    setTimeout(() => {
      settleHydration(false);
    }, HYDRATION_TIMEOUT_MS);
  });
}

const asyncMMKVStorage = {
  async getItem(name: string): Promise<string | null> {
    const mmkv = await bootstrapWalletStorage();
    return mmkv.getString(name) ?? null;
  },
  async setItem(name: string, value: string): Promise<void> {
    const mmkv = await bootstrapWalletStorage();
    mmkv.set(name, value);
  },
  async removeItem(name: string): Promise<void> {
    const mmkv = await bootstrapWalletStorage();
    mmkv.remove(name);
  },
};

// ---- Selectors --------------------------------------------------------------

// The persisted half of the store. Selectors take this rather than the full
// `WalletState` so a component can hand them the exact slices it subscribed to,
// which is both cheaper and what keeps a useMemo's dependency list honest.
export type WalletData = Pick<
  WalletState,
  | "proofs"
  | "reserved"
  | "mints"
  | "history"
  | "redeemedNutzaps"
  | "claimedTokens"
  | "backupEnabled"
  | "backupVerified"
  | "counters"
>;

function sum(proofs: StoredProof[]): number {
  return proofs.reduce((total, p) => total + p.amount, 0);
}

// Per (mint, unit) balances, including the reserved, unverified and unbacked
// splits. `backupEnabled` is optional so callers that only care about balances
// can skip it; without it, nothing is reported as unbacked, which is correct
// because with backup off nothing is covered in the first place.
export function selectAccounts(
  state: Pick<WalletData, "proofs" | "reserved" | "mints"> &
    Partial<Pick<WalletData, "backupEnabled">>,
): AccountBalance[] {
  const keys = new Set(Object.keys(state.proofs));
  // Surface mints with no proofs too, so a freshly added mint is visible.
  for (const mint of Object.values(state.mints)) {
    for (const unit of mint.units ?? ["sat"])
      keys.add(accountKey(mint.url, unit));
  }
  for (const res of Object.values(state.reserved)) keys.add(res.account);

  return [...keys]
    .map((key) => {
      const { mintUrl, unit } = parseAccountKey(key);
      const proofs = state.proofs[key] ?? [];
      const reserved = Object.values(state.reserved)
        .filter((r) => r.account === key)
        .flatMap((r) => r.proofs);
      return {
        key,
        mintUrl,
        unit,
        balance: sum(proofs),
        unverified: sum(proofs.filter((p) => p.verified !== true)),
        unbacked:
          state.backupEnabled === true
            ? sum(proofs.filter((p) => p.derived !== true))
            : 0,
        reserved: sum(reserved),
        proofCount: proofs.length,
      };
    })
    .sort((a, b) => b.balance - a.balance || a.key.localeCompare(b.key));
}

// Spendable balance for one unit across every mint. Units are never summed
// together: 100 sat and 100 usd are not 200 of anything.
export function selectBalanceForUnit(
  state: Pick<WalletData, "proofs">,
  unit: string,
): number {
  return Object.entries(state.proofs).reduce(
    (total, [key, proofs]) =>
      parseAccountKey(key).unit === unit ? total + sum(proofs) : total,
    0,
  );
}

// Every unit the wallet currently holds value in, spendable or reserved.
export function selectUnits(
  state: Pick<WalletData, "proofs" | "reserved">,
): string[] {
  const units = new Set<string>();
  for (const [key, proofs] of Object.entries(state.proofs)) {
    if (proofs.length > 0) units.add(parseAccountKey(key).unit);
  }
  for (const res of Object.values(state.reserved)) {
    units.add(parseAccountKey(res.account).unit);
  }
  return [...units].sort();
}

// Reserved (in-flight) sends that the user can still reclaim or re-share.
export function selectPendingSends(
  state: Pick<WalletData, "history" | "reserved">,
): WalletTx[] {
  return state.history.filter(
    (tx) => tx.status === "pending" && state.reserved[tx.id] !== undefined,
  );
}

export function selectSecrets(
  state: Pick<WalletData, "proofs">,
  key: string,
): Set<string> {
  return new Set((state.proofs[key] ?? []).map((p) => p.secret));
}

// ---- Store ------------------------------------------------------------------

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      proofs: {},
      reserved: {},
      mints: {},
      history: [],
      redeemedNutzaps: [],
      claimedTokens: [],
      backupEnabled: false,
      backupVerified: false,
      counters: {},

      // ---- Mints ----

      addMint(mintUrl, patch) {
        const url = normalizeMintUrl(mintUrl);
        set((state) => {
          const existing = state.mints[url];
          return {
            mints: {
              ...state.mints,
              [url]: {
                ...existing,
                ...patch,
                url,
                addedAtMs: existing?.addedAtMs ?? Date.now(),
              },
            },
          };
        });
      },

      updateMint(mintUrl, patch) {
        const url = normalizeMintUrl(mintUrl);
        set((state) => {
          const existing = state.mints[url];
          if (!existing) return state;
          return {
            mints: { ...state.mints, [url]: { ...existing, ...patch } },
          };
        });
      },

      removeMint(mintUrl) {
        const url = normalizeMintUrl(mintUrl);
        set((state) => {
          const mints = { ...state.mints };
          delete mints[url];
          const proofs = { ...state.proofs };
          for (const key of Object.keys(proofs)) {
            if (parseAccountKey(key).mintUrl === url) delete proofs[key];
          }
          return { mints, proofs };
        });
      },

      // ---- Proofs ----

      addProofs(mintUrl, unit, incoming) {
        if (incoming.length === 0) return { added: 0, duplicates: 0 };
        const key = accountKey(mintUrl, unit);
        let added = 0;
        let duplicates = 0;
        set((state) => {
          const existing = state.proofs[key] ?? [];
          // A proof is uniquely identified by its secret. Re-adding one is
          // either a duplicate paste or a replayed message; either way it must
          // not inflate the balance.
          const seen = new Set(existing.map((p) => p.secret));
          // Also guard against a proof that is currently reserved for a send:
          // crediting it back while the token is still out there would let the
          // balance count the same value twice.
          for (const res of Object.values(state.reserved)) {
            for (const p of res.proofs) seen.add(p.secret);
          }
          const novel = incoming.filter((p) => {
            if (seen.has(p.secret)) return false;
            seen.add(p.secret);
            return true;
          });
          added = novel.length;
          duplicates = incoming.length - novel.length;
          if (novel.length === 0) return state;
          return {
            proofs: { ...state.proofs, [key]: [...existing, ...novel] },
          };
        });
        return { added, duplicates };
      },

      removeProofs(mintUrl, unit, secrets) {
        if (secrets.length === 0) return;
        const key = accountKey(mintUrl, unit);
        const drop = new Set(secrets);
        set((state) => {
          const existing = state.proofs[key];
          if (!existing) return state;
          return {
            proofs: {
              ...state.proofs,
              [key]: existing.filter((p) => !drop.has(p.secret)),
            },
          };
        });
      },

      replaceProofs(mintUrl, unit, proofs) {
        const key = accountKey(mintUrl, unit);
        set((state) => ({ proofs: { ...state.proofs, [key]: proofs } }));
      },

      markVerified(mintUrl, unit, secrets) {
        if (secrets.length === 0) return;
        const key = accountKey(mintUrl, unit);
        const mark = new Set(secrets);
        set((state) => {
          const existing = state.proofs[key];
          if (!existing) return state;
          return {
            proofs: {
              ...state.proofs,
              [key]: existing.map((p) =>
                mark.has(p.secret) ? { ...p, verified: true } : p,
              ),
            },
          };
        });
      },

      // ---- Reservations ----

      reserveProofs(txId, mintUrl, unit, proofs) {
        const key = accountKey(mintUrl, unit);
        const want = new Set(proofs.map((p) => p.secret));
        let reserved = false;

        // Validate and move in one synchronous pass, and refuse if any of the
        // requested proofs is no longer spendable.
        //
        // Callers select proofs, then await a mint round trip, then land here.
        // Two sends started close together therefore both pick from the same
        // pool and both arrive holding the same coins. Trusting the caller
        // would put one proof into two different tokens: both recipients see a
        // balance, only the first to reach the mint actually has it, and our
        // own accounting reserves the same value twice.
        set((state) => {
          if (state.reserved[txId] !== undefined) return state;
          const existing = state.proofs[key] ?? [];
          const spendable = new Set(existing.map((p) => p.secret));
          for (const secret of want) {
            if (!spendable.has(secret)) return state;
          }
          reserved = true;
          return {
            proofs: {
              ...state.proofs,
              [key]: existing.filter((p) => !want.has(p.secret)),
            },
            reserved: {
              ...state.reserved,
              [txId]: { account: key, proofs },
            },
          };
        });

        return reserved;
      },

      releaseReserved(txId) {
        const entry = get().reserved[txId];
        if (!entry) return null;
        set((state) => {
          const reserved = { ...state.reserved };
          delete reserved[txId];
          const existing = state.proofs[entry.account] ?? [];
          const seen = new Set(existing.map((p) => p.secret));
          const restored = entry.proofs.filter((p) => !seen.has(p.secret));
          return {
            reserved,
            proofs: {
              ...state.proofs,
              [entry.account]: [...existing, ...restored],
            },
          };
        });
        return entry.proofs;
      },

      dropReserved(txId) {
        set((state) => {
          if (state.reserved[txId] === undefined) return state;
          const reserved = { ...state.reserved };
          delete reserved[txId];
          return { reserved };
        });
      },

      // ---- History ----

      addTx(tx) {
        set((state) => ({
          history: [tx, ...state.history].slice(0, MAX_HISTORY),
        }));
      },

      updateTx(id, patch) {
        set((state) => ({
          history: state.history.map((tx) =>
            tx.id === id ? { ...tx, ...patch, updatedAtMs: Date.now() } : tx,
          ),
        }));
      },

      // ---- Nutzap ----

      setNutzapPubkey(pubkey) {
        set({ nutzapPubkey: pubkey });
      },

      setBackupEnabled(enabled) {
        // Turning backup off also drops the "written down" claim: there is
        // nothing left to have written down.
        set(
          enabled
            ? { backupEnabled: true }
            : {
                backupEnabled: false,
                backupVerified: false,
              },
        );
      },

      setBackupVerified(verified) {
        set({ backupVerified: verified });
      },

      reserveCounters(keysetId, n) {
        const start = get().counters[keysetId] ?? 0;
        if (n <= 0) return { start, count: 0 };
        set((state) => ({
          counters: { ...state.counters, [keysetId]: start + n },
        }));
        return { start, count: n };
      },

      advanceCounter(keysetId, minNext) {
        set((state) => {
          const current = state.counters[keysetId] ?? 0;
          if (current >= minNext) return state;
          return { counters: { ...state.counters, [keysetId]: minNext } };
        });
      },

      markTokenClaimed(firstSecret) {
        set((state) =>
          state.claimedTokens.includes(firstSecret)
            ? state
            : {
                claimedTokens: [firstSecret, ...state.claimedTokens].slice(
                  0,
                  MAX_CLAIMED_TOKENS,
                ),
              },
        );
      },

      markNutzapRedeemed(eventId) {
        set((state) =>
          state.redeemedNutzaps.includes(eventId)
            ? state
            : {
                redeemedNutzaps: [eventId, ...state.redeemedNutzaps].slice(
                  0,
                  MAX_REDEEMED_NUTZAPS,
                ),
              },
        );
      },

      // ---- Wipe ----

      clearAccount(mintUrl, unit) {
        const key = accountKey(mintUrl, unit);
        set((state) => {
          const proofs = { ...state.proofs };
          delete proofs[key];
          return { proofs };
        });
      },

      clearAll() {
        set({
          proofs: {},
          reserved: {},
          mints: {},
          history: [],
          redeemedNutzaps: [],
          claimedTokens: [],
          nutzapPubkey: undefined,
          // Backup goes with everything else: the panic wipe clears the
          // keychain too, so the phrase that made these coins restorable is
          // gone and claiming otherwise would be a lie.
          backupEnabled: false,
          backupVerified: false,
          counters: {},
        });
      },
    }),
    {
      name: "wallet-state",
      storage: createJSONStorage(() => asyncMMKVStorage),
      version: 1,
      // Fires on both the success and the failure path, which is why readiness
      // is tracked here rather than through `onFinishHydration`. A failure
      // means the on-disk state could not be read, so the wallet presents
      // itself as locked instead of as empty.
      onRehydrateStorage: () => (_state, error) => {
        settleHydration(error === undefined);
      },
      // Actions are recreated by the initializer; only data is persisted.
      partialize: (state) =>
        ({
          proofs: state.proofs,
          reserved: state.reserved,
          mints: state.mints,
          history: state.history,
          redeemedNutzaps: state.redeemedNutzaps,
          nutzapPubkey: state.nutzapPubkey,
          backupEnabled: state.backupEnabled,
          backupVerified: state.backupVerified,
          counters: state.counters,
        }) as unknown as WalletState,
    },
  ),
);
