// Wallet service: the single place that talks to Cashu mints.
//
// Every screen (Wallet tab, DM thread, peer sheet) goes through here, so the
// rules that protect real money live in one file instead of being re-derived in
// three UIs. Before this existed each screen open-coded its own "pick proofs,
// serialise, delete them from the store" sequence, which meant a crash or a
// dismissed sheet between the delete and the delivery destroyed the value.
//
// Guarantees this module provides
// -------------------------------
//  1. Proofs are never deleted to send. They are moved into a reserved bucket
//     against a transaction id and only dropped once delivery is confirmed, so
//     an interrupted send is always recoverable (`reclaimSend`).
//  2. Nothing is credited to the balance without either a mint swap or a
//     passing DLEQ check; anything credited offline is marked unverified and
//     redeemed first when connectivity returns.
//  3. A mint call is never made silently over the clear net while the user has
//     Tor on (iOS), because Arti only wraps WebSockets, not fetch.
//  4. Units are never mixed. A (mint, unit) pair is one account.
//
// Offline is the normal case, not the error case: `getWallet` builds a fully
// functional wallet from the cached keysets, so fee maths, proof selection and
// DLEQ verification all work with the radio off. Only swap, mint and melt
// actually need the network.

import {
  Mint,
  OutputData,
  Wallet,
  isMintOperationError,
  setGlobalRequestOptions,
  type CounterSource,
  type GetInfoResponse,
  type KeyChainCache,
  type MeltQuoteBolt11Response,
  type MintQuoteBolt11Response,
  type Proof,
  type ProofLike,
  type SerializedOutputData,
} from "@cashu/cashu-ts";
import { KEYCHAIN_ITEMS, readSecret, writeSecret } from "@core/crypto/keychain";
import type { NostrClient } from "@core/nostr/nostr-client";
import {
  buildToken,
  decodeToken,
  feeForProofs,
  selectProofsForAmount,
  toProofLike,
  toStoredProof,
  verifyTokenOffline,
  type TokenInfo,
} from "@core/payments/cashu";
import {
  fetchNutzapInfo,
  publishNutzap,
  publishNutzapInfo,
  subscribeNutzaps,
  type NutzapInfo,
} from "@core/payments/nutzap";
import {
  generateRecoveryPhrase,
  isValidRecoveryPhrase,
  loadStoredPhrase,
  normalizeRecoveryPhrase,
  recoveryPhraseToSeed,
  storePhrase,
} from "@core/payments/wallet-seed";
import { t } from "@i18n";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { useMeshStateStore } from "@store/mesh-state-store";
import { useSettingsStore } from "@store/settings-store";
import {
  accountKey,
  bootstrapWalletStorage,
  isWalletStorageReady,
  normalizeMintUrl,
  useWalletStore,
  whenWalletHydrated,
  type StoredMint,
  type StoredProof,
  type WalletTx,
} from "@store/wallet-store";
import { Platform } from "react-native";

// ---- Network limits ---------------------------------------------------------

// Every mint request is bounded. cashu-ts only builds an AbortController when a
// timeout is given, and React Native's fetch has none of its own, so without
// this a mint that accepts the connection and then never answers hangs the call
// forever. That is not an abstract worry on mobile: captive portals, a dropped
// cell handover and an overloaded mint all produce exactly that shape.
//
// A hang is worse than a failure here, because the UI is built around promises
// settling. A stuck request leaves the confirm button spinning, holds the
// per-mint refresh lock so every other mint is unrefreshable, and stalls the
// startup chain before the nutzap watcher is ever installed. A timeout turns
// all of that into an ordinary error the user can retry.
//
// 20s is generous for a mint round trip on a slow connection while still being
// well inside the patience of somebody staring at a spinner.
const MINT_REQUEST_TIMEOUT_MS = 20_000;

setGlobalRequestOptions({ requestTimeout: MINT_REQUEST_TIMEOUT_MS });

// ---- Errors -----------------------------------------------------------------

export type WalletErrorCode =
  // The encrypted proof store could not be opened (Keychain/Keystore refused).
  | "locked"
  // The mint could not be reached. The offline path may still be available.
  | "offline"
  // Tor is on and this platform would send the mint request in the clear.
  | "tor-blocked"
  // Not enough spendable balance at any single mint for this amount.
  | "insufficient"
  // The exact amount cannot be made from the proofs held, offline.
  | "inexact"
  // No mint is configured, or the named mint is unknown.
  | "no-mint"
  // An incoming payment named a mint this wallet does not hold. Distinct from
  // "no-mint" because it is a REFUSAL, not a failure: retrying cannot fix it,
  // and the caller should tell the user rather than quietly try again.
  | "untrusted-mint"
  // The mint does not support a NUT this operation needs.
  | "unsupported"
  // The mint accepted the request and rejected it on its own terms.
  | "mint-error"
  // The token string did not decode.
  | "invalid-token"
  // A DLEQ witness failed: the mint did not sign this. Do not credit it.
  | "forged-token"
  // The mint says these proofs are already spent.
  | "already-spent";

export class WalletError extends Error {
  readonly code: WalletErrorCode;
  readonly detail?: string;

  constructor(code: WalletErrorCode, message: string, detail?: string) {
    super(message);
    this.name = "WalletError";
    this.code = code;
    this.detail = detail;
  }
}

// Turn anything thrown by cashu-ts or fetch into a WalletError, so callers only
// ever branch on our own codes.
function asWalletError(err: unknown, fallback: WalletErrorCode): WalletError {
  if (err instanceof WalletError) return err;
  if (isMintOperationError(err)) {
    return new WalletError("mint-error", err.message, String(err));
  }
  const message = err instanceof Error ? err.message : String(err);
  // fetch failures in React Native surface as a bare "Network request failed".
  if (/network|fetch|timeout|abort/i.test(message)) {
    return new WalletError(
      "offline",
      t("wallet.svc.mint_unreachable"),
      message,
    );
  }
  return new WalletError(fallback, message, String(err));
}

// ---- Network policy ---------------------------------------------------------

// Refuse a mint call that would leak this device's IP while the user believes
// their traffic is anonymised.
//
// On Android, Orbot runs as a VPN and captures every socket, so a mint request
// really does go through Tor and there is nothing to block. On iOS, Tor is Arti
// behind a SOCKS5 proxy that we only wire into the Nostr WebSocket; plain fetch
// bypasses it entirely. Silently making the request there would tell the mint
// exactly who is swapping which proofs, which is the one thing a Tor user is
// trying to avoid, so it is refused unless they have explicitly allowed it.
// Gated on the user's PREFERENCE, not on whether a circuit happens to be up
// right now, and the difference is a real leak rather than a nicety.
//
// `torActive` is a claim about this instant. `torEnabled` is what the user
// asked for and what their toggle still shows. Those two diverge in exactly one
// state, and it is the worst one: iOS revalidation deliberately stands the claim
// down while keeping the preference on, because a failed bootstrap is usually
// transient and the socket must stay Tor-only rather than falling back to the
// clear net. In that state the Nostr side is still hard-routed through Arti, the
// switch still reads on, the user still believes they are covered - and reading
// `torActive` alone opened this gate and put mint HTTP on the clear net with the
// device's real IP. That is precisely the linkage the gate exists to prevent,
// and it happened only when Tor was struggling, which is when it matters most.
//
// Either flag being set is enough to refuse. Overshooting costs a mint call the
// user can allow explicitly; undershooting costs them the anonymity they think
// they have. `version-screen.tsx` already gates its update check on
// `torEnabled`, so this also stops the two network gates disagreeing.
//
// Both are read from stores rather than by calling `isTorRoutingActive()`:
// tor-routing pulls in the BLE native module at import time, and this module is
// reachable from the panic wipe, which must stay loadable without a native host.
function assertMintNetworkAllowed(): void {
  const torClaimed =
    useMeshStateStore.getState().torActive ||
    useSettingsStore.getState().torEnabled;
  if (!torClaimed) return;
  if (Platform.OS !== "ios") return;
  if (useSettingsStore.getState().allowMintOverClearnet) return;
  throw new WalletError(
    "tor-blocked",
    t("wallet.svc.tor_ios"),
    t("wallet.svc.tor_ios_body"),
  );
}

// Whether a mint call would currently be refused, for disabling buttons ahead
// of time rather than failing after a tap.
export function isMintNetworkBlocked(): boolean {
  try {
    assertMintNetworkAllowed();
    return false;
  } catch {
    return true;
  }
}

// ---- Recovery phrase (NUT-13 deterministic secrets) -------------------------

// The seed derived from the user's recovery phrase, held in memory for the
// process lifetime once loaded. Null means backup is off and proof secrets are
// random, which is the default: nothing is restorable until the user opts in.
//
// This is the *only* thing that decides whether new proofs are recoverable, so
// it is read at wallet construction and every wallet is rebuilt when it flips.
let activeSeed: Uint8Array | null = null;

function isBackupActive(): boolean {
  return activeSeed !== null;
}

// NUT-13 derives a proof's secret from (seed, keyset id, counter). Reusing a
// counter recreates a secret the mint has already signed, which it rejects as a
// duplicate, so the cursor must be persisted and must only ever move forward.
//
// The store write is synchronous; persisting it to the encrypted file is not.
// A crash in that window can lose a counter bump, and the next swap using that
// counter fails with a duplicate error the user can simply retry. Restore also
// pushes the cursor past everything the mint has ever signed, which repairs it
// permanently. Losing money this way is not possible: a rejected swap leaves
// the input proofs untouched.
const counterSource: CounterSource = {
  reserve(keysetId: string, n: number) {
    return Promise.resolve(
      useWalletStore.getState().reserveCounters(keysetId, n),
    );
  },
  advanceToAtLeast(keysetId: string, minNext: number) {
    useWalletStore.getState().advanceCounter(keysetId, minNext);
    return Promise.resolve();
  },
  snapshot() {
    return Promise.resolve({ ...useWalletStore.getState().counters });
  },
};

// ---- Wallet instances -------------------------------------------------------

// One Wallet per (mint, unit). Building one is cheap from cache but involves a
// round trip online, so they are reused for the process lifetime. Keysets are
// re-fetched by `refreshMint`, not by rebuilding.
const wallets = new Map<string, Wallet>();

// Wallets capture the seed at construction, so any change to backup state has
// to throw the cache away or half the app would keep minting random secrets.
function invalidateWallets(): void {
  wallets.clear();
}

// Options every Wallet is built with. With a seed present, outputs are
// deterministic and counter-tracked; without one, cashu-ts falls back to random
// secrets, which is exactly the pre-backup behaviour.
function walletOptions(unit: string): {
  unit: string;
  bip39seed?: Uint8Array;
  secretsPolicy?: "deterministic" | "random";
  counterSource?: CounterSource;
} {
  if (activeSeed === null) return { unit, secretsPolicy: "random" };
  return {
    unit,
    bip39seed: activeSeed,
    secretsPolicy: "deterministic",
    counterSource,
  };
}

// How long a cached keyset is trusted before an online operation refreshes it.
// Mints rotate keysets rarely; a day keeps fees and keys current without
// hammering the mint on every send.
const KEYSET_TTL_MS = 24 * 60 * 60 * 1000;

function storedMint(mintUrl: string): StoredMint | undefined {
  return useWalletStore.getState().mints[normalizeMintUrl(mintUrl)];
}

// Build a Wallet for this account.
//
// `offline: true` never touches the network: it either returns a wallet built
// from the cached keysets or throws "offline". `offline: false` prefers the
// cache and refreshes from the mint only when the cache is missing or stale, so
// a send does not pay for a round trip it does not need.
async function getWallet(
  mintUrl: string,
  unit: string,
  opts: { offline?: boolean; forceRefresh?: boolean } = {},
): Promise<Wallet> {
  const url = normalizeMintUrl(mintUrl);
  const key = accountKey(url, unit);
  const cached = wallets.get(key);
  if (cached && !opts.forceRefresh) return cached;

  const record = storedMint(url);
  const cacheFresh =
    record?.keysetCache !== undefined &&
    record.infoResponse !== undefined &&
    Date.now() - (record.keysetCacheAtMs ?? 0) < KEYSET_TTL_MS;

  const wallet = new Wallet(new Mint(url), walletOptions(unit));

  if (!opts.forceRefresh && cacheFresh) {
    try {
      wallet.loadMintFromCache(
        record.infoResponse as GetInfoResponse,
        record.keysetCache as KeyChainCache,
      );
      wallets.set(key, wallet);
      return wallet;
    } catch {
      // Cache written by an older cashu-ts, or corrupted. Fall through and
      // re-fetch rather than failing the operation.
    }
  }

  if (opts.offline === true) {
    // Last resort offline: a stale cache still verifies DLEQ and prices fees
    // correctly for keysets that have not rotated, which beats refusing.
    if (
      record?.keysetCache !== undefined &&
      record.infoResponse !== undefined
    ) {
      try {
        wallet.loadMintFromCache(
          record.infoResponse as GetInfoResponse,
          record.keysetCache as KeyChainCache,
        );
        wallets.set(key, wallet);
        return wallet;
      } catch {
        // fall through to the throw below
      }
    }
    throw new WalletError(
      "offline",
      t("wallet.svc.keys_uncached"),
      t("wallet.svc.keys_uncached_body"),
    );
  }

  assertMintNetworkAllowed();
  try {
    await wallet.loadMint(opts.forceRefresh === true);
  } catch (err) {
    throw asWalletError(err, "offline");
  }
  persistMintSnapshot(url, unit, wallet);
  wallets.set(key, wallet);
  return wallet;
}

// Persist everything the wallet learned from the mint, so the next cold start
// is fully functional offline: keys for DLEQ, fees for selection, units and NUT
// support for feature gating.
function persistMintSnapshot(
  mintUrl: string,
  unit: string,
  wallet: Wallet,
): void {
  const store = useWalletStore.getState();
  let cache: KeyChainCache | undefined;
  let feePpkByKeysetId: Record<string, number> | undefined;
  let units: string[] | undefined;
  try {
    cache = wallet.keyChain.cache;
    feePpkByKeysetId = {};
    units = [];
    for (const keyset of cache.keysets) {
      feePpkByKeysetId[keyset.id] = keyset.input_fee_ppk ?? 0;
      if (!units.includes(keyset.unit)) units.push(keyset.unit);
    }
  } catch {
    // A wallet built from a partial cache may not expose one; keep what we have.
  }

  let info: GetInfoResponse | undefined;
  let name: string | undefined;
  let description: string | undefined;
  let supportedNuts: number[] | undefined;
  try {
    // `.cache` is the raw /v1/info response the MintInfo wrapper was built
    // from, which is exactly what `loadMintFromCache` wants back.
    info = wallet.getMintInfo().cache;
    name = typeof info.name === "string" ? info.name.slice(0, 64) : undefined;
    description =
      typeof info.description === "string"
        ? info.description.slice(0, 200)
        : undefined;
    supportedNuts = Object.keys(info.nuts ?? {})
      .map((n) => Number.parseInt(n, 10))
      .filter((n) => Number.isFinite(n));
  } catch {
    // Mint info is optional for offline operation; keys are what matter.
  }

  store.addMint(mintUrl, {
    ...(name !== undefined ? { name } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(units !== undefined && units.length > 0
      ? { units }
      : { units: [unit] }),
    ...(supportedNuts !== undefined ? { supportedNuts } : {}),
    ...(info !== undefined ? { infoResponse: info } : {}),
    ...(cache !== undefined
      ? { keysetCache: cache, keysetCacheAtMs: Date.now() }
      : {}),
    ...(feePpkByKeysetId !== undefined ? { feePpkByKeysetId } : {}),
    lastSeenMs: Date.now(),
  });
}

// Forget every cached Wallet. Called after a panic wipe so a fresh identity
// never reuses another identity's loaded keysets.
export function resetWalletService(): void {
  wallets.clear();
  // A pass in flight is walking transactions the wipe is about to delete. It
  // cannot be cancelled mid-round-trip, but clearing the handle stops a later
  // caller joining it and stops the throttle carrying across the reset.
  reconcileInFlight = null;
  lastReconcileAtMs = 0;
  walletEpoch += 1;
  // The recovery phrase went with the keychain the wipe just cleared, so the
  // in-memory seed has to go too. Leaving it would keep deriving proofs from a
  // phrase the user can no longer see or write down.
  activeSeed = null;
  // Same for the cached P2PK key: it resolved from an item the wipe destroyed.
  // Re-onboarding in the same process would otherwise publish a kind 10019
  // naming the previous identity's pubkey.
  nutzapPrivKey = null;
}

// ---- Store readiness --------------------------------------------------------

// Open the encrypted proof store. Call once at app start, before the wallet tab
// can be reached. Resolves false when the Keychain/Keystore is unavailable, in
// which case the wallet stays locked rather than falling back to plaintext.
export async function initWalletService(): Promise<boolean> {
  try {
    await bootstrapWalletStorage();
  } catch {
    return false;
  }
  // Opening the file is not the same as having read it. zustand overwrites the
  // store with the persisted snapshot when hydration lands, so anything that
  // credits or spends before that point is discarded. Wait for it, then check:
  // hydration can fail, and a failed read must not look like an empty wallet.
  await whenWalletHydrated();
  if (!isWalletStorageReady()) return false;
  // Backup state comes from the keychain, not the store, so it has to be read
  // before the first mint operation or new proofs would be created with random
  // secrets and quietly fall outside the user's recovery phrase.
  try {
    await loadBackupState();
  } catch {
    // A keychain read failure leaves backup off, which is the safe default:
    // the wallet still works, it just says nothing is covered.
  }
  return true;
}

// ---- Backup lifecycle -------------------------------------------------------

// Load the recovery phrase from the keychain, if the user has set one up, and
// switch new proof creation over to deterministic secrets. Called once at
// startup. A missing phrase is the normal case and simply leaves backup off.
async function loadBackupState(): Promise<void> {
  const phrase = await loadStoredPhrase();
  if (phrase === null) {
    activeSeed = null;
    // The keychain is the source of truth. If the flag says backup is on but
    // the phrase is gone (a keychain reset, a restore from a device backup that
    // did not carry keychain items), say so rather than claiming coverage the
    // user does not have.
    if (useWalletStore.getState().backupEnabled) {
      useWalletStore.getState().setBackupEnabled(false);
    }
    return;
  }
  activeSeed = recoveryPhraseToSeed(phrase);
  useWalletStore.getState().setBackupEnabled(true);
  invalidateWallets();
}

export interface BackupSetup {
  phrase: string;
  // True when a phrase already existed, so this returned the old one rather
  // than generating a new one. Generating a second phrase would orphan every
  // coin derived from the first.
  existed: boolean;
}

// Turn on backup, generating a phrase if there is not already one.
//
// This is deliberately one-way. There is no "turn backup off", because once
// coins are derived from a phrase, deleting the phrase is indistinguishable
// from deleting the coins. The only thing that removes it is the panic wipe,
// which is destroying everything anyway.
export async function enableWalletBackup(): Promise<BackupSetup> {
  assertUnlocked();
  const existing = await loadStoredPhrase();
  if (existing !== null) {
    activeSeed = recoveryPhraseToSeed(existing);
    useWalletStore.getState().setBackupEnabled(true);
    invalidateWallets();
    return { phrase: existing, existed: true };
  }

  const phrase = generateRecoveryPhrase();
  await storePhrase(phrase);
  activeSeed = recoveryPhraseToSeed(phrase);
  useWalletStore.getState().setBackupEnabled(true);
  // Existing proofs stay random until they are swapped, so every wallet has to
  // be rebuilt with the seed before the next mint operation can start covering
  // them.
  invalidateWallets();
  return { phrase, existed: false };
}

// The phrase, for the "view recovery phrase" screen. Null when backup is off.
export function getRecoveryPhrase(): Promise<string | null> {
  return loadStoredPhrase();
}

// Record that the user proved they copied the phrase out. Kept in the service
// rather than written from the UI so the flag can never claim more than
// `enableWalletBackup` actually set up.
export function markBackupVerified(): void {
  if (activeSeed === null) return;
  useWalletStore.getState().setBackupVerified(true);
}

export interface RestoreProgress {
  mintUrl: string;
  keysetId: string;
  // 1-based index of the keyset being scanned, and how many there are.
  step: number;
  total: number;
}

export interface RestoreResult {
  // Recovered, confirmed-unspent value per unit.
  recovered: Record<string, number>;
  proofCount: number;
  // Proofs the mint had signed but already marked spent. Reported so a user who
  // recovers "nothing" understands it is because the money was spent, not
  // because the restore failed.
  alreadySpent: number;
  mintsScanned: string[];
  // Mints that could not be reached; their balance may still be out there.
  mintsFailed: { mintUrl: string; reason: string }[];
}

// How far past the last signature to keep looking before deciding a keyset is
// exhausted. Counters only ever increase by one per output, so a real gap this
// wide does not occur in practice; 200 is comfortable headroom.
const RESTORE_GAP_LIMIT = 200;
const RESTORE_BATCH_SIZE = 100;

// Rebuild the wallet from a recovery phrase (NUT-09).
//
// For every keyset at every mint, this re-derives the secrets the phrase would
// have produced and asks the mint which of them it signed. The mint answers
// from its own records, so this works on a completely fresh install with an
// empty proof store.
//
// Two things it cannot do, both worth surfacing in the UI:
//   * It has to know which mint to ask. A mint the user forgets to add is
//     simply never queried, and its balance stays invisible.
//   * It only recovers coins whose secrets came from this phrase. Anything
//     received and never swapped carried the sender's secrets and is gone.
export async function restoreFromRecoveryPhrase(params: {
  phrase: string;
  mintUrls: string[];
  unit?: string;
  onProgress?: (progress: RestoreProgress) => void;
}): Promise<RestoreResult> {
  assertUnlocked();
  assertMintNetworkAllowed();

  const phrase = normalizeRecoveryPhrase(params.phrase);
  if (!isValidRecoveryPhrase(phrase)) {
    throw new WalletError(
      "invalid-token",
      t("wallet.svc.phrase_invalid"),
      t("wallet.svc.phrase_invalid_body"),
    );
  }
  if (params.mintUrls.length === 0) {
    throw new WalletError(
      "no-mint",
      t("wallet.svc.need_mint"),
      t("wallet.svc.need_mint_body"),
    );
  }

  const unit = params.unit ?? "sat";
  const seed = recoveryPhraseToSeed(phrase);

  // Switch over before scanning: the restore itself creates no new outputs, but
  // everything after it must derive from this phrase or the recovered coins and
  // the new ones would need two different backups.
  await storePhrase(phrase);
  activeSeed = seed;
  useWalletStore.getState().setBackupEnabled(true);
  // Someone restoring has demonstrably got the phrase in front of them, so
  // there is nothing left to prove with a write-it-down check.
  useWalletStore.getState().setBackupVerified(true);
  invalidateWallets();

  const store = useWalletStore.getState();
  const recovered: Record<string, number> = {};
  const mintsScanned: string[] = [];
  const mintsFailed: { mintUrl: string; reason: string }[] = [];
  let proofCount = 0;
  let alreadySpent = 0;

  for (const rawUrl of params.mintUrls) {
    const url = normalizeMintUrl(rawUrl);
    try {
      const wallet = await getWallet(url, unit, { forceRefresh: true });
      const keysets = wallet.keyChain.getKeysets();

      for (const [index, keyset] of keysets.entries()) {
        params.onProgress?.({
          mintUrl: url,
          keysetId: keyset.id,
          step: index + 1,
          total: keysets.length,
        });

        // `batchRestore` takes the keyset id directly, so the main wallet can
        // scan every keyset. Going through `withKeyset` would look tidier but
        // it builds the new wallet without a unit, defaulting it to sat, which
        // then fails to bind any keyset in another currency.
        const { proofs, lastCounterWithSignature } = await wallet.batchRestore(
          RESTORE_GAP_LIMIT,
          RESTORE_BATCH_SIZE,
          0,
          keyset.id,
        );

        // Push the cursor past everything the mint has ever signed for this
        // keyset. Without this the next swap would re-derive a counter the mint
        // already knows and be rejected as a duplicate.
        if (typeof lastCounterWithSignature === "number") {
          store.advanceCounter(keyset.id, lastCounterWithSignature + 1);
        }
        if (proofs.length === 0) continue;

        // The mint signed these, but plenty will have been spent since. Only
        // the unspent ones are money.
        const grouped = await wallet.groupProofsByState(proofs);
        alreadySpent += grouped.spent.length;
        const live = [...grouped.unspent, ...grouped.pending];
        if (live.length === 0) continue;

        creditProofs(url, unit, live, { verified: true });
        proofCount += live.length;
        recovered[unit] =
          (recovered[unit] ?? 0) +
          live.reduce((sum, p) => sum + p.amount.toNumber(), 0);
      }
      mintsScanned.push(url);
    } catch (err) {
      mintsFailed.push({
        mintUrl: url,
        reason: asWalletError(err, "mint-error").message,
      });
    }
  }

  if (proofCount > 0) {
    recordTx({
      kind: "receive",
      status: "completed",
      amount: recovered[unit] ?? 0,
      unit,
      mintUrl: mintsScanned[0] ?? params.mintUrls[0],
      memo: t("wallet.svc.restored"),
    });
  }

  return { recovered, proofCount, alreadySpent, mintsScanned, mintsFailed };
}

function assertUnlocked(): void {
  if (!isWalletStorageReady()) {
    throw new WalletError(
      "locked",
      t("wallet.svc.storage_locked"),
      t("wallet.svc.storage_locked_body"),
    );
  }
}

// ---- Mints ------------------------------------------------------------------

export interface AddMintResult {
  mint: StoredMint;
  units: string[];
}

// Add a mint after checking it really is one. An unreachable or non-Cashu URL is
// rejected up front rather than being saved and failing on first use: a mint
// row that cannot mint is worse than no row.
export async function addMint(rawUrl: string): Promise<AddMintResult> {
  assertUnlocked();
  const url = normalizeMintUrl(rawUrl);
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new WalletError("no-mint", t("wallet.svc.bad_url"));
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new WalletError("no-mint", t("wallet.svc.needs_https"));
  }
  // http is allowed only for loopback (running Nutshell locally). Anywhere else
  // it would send proofs over an unauthenticated channel.
  const isLoopback =
    parsed.hostname === "localhost" ||
    parsed.hostname === "127.0.0.1" ||
    parsed.hostname === "::1";
  if (parsed.protocol === "http:" && !isLoopback) {
    throw new WalletError(
      "no-mint",
      t("wallet.svc.refuse_http"),
      t("wallet.svc.refuse_http_body"),
    );
  }

  assertMintNetworkAllowed();

  const wallet = new Wallet(new Mint(url), walletOptions("sat"));
  try {
    await wallet.loadMint(true);
  } catch (err) {
    throw asWalletError(err, "no-mint");
  }
  persistMintSnapshot(url, "sat", wallet);
  wallets.set(accountKey(url, "sat"), wallet);

  const record = storedMint(url);
  if (!record) throw new WalletError("no-mint", t("wallet.svc.mint_not_saved"));
  return { mint: record, units: record.units ?? ["sat"] };
}

// ---- Receive ----------------------------------------------------------------

export interface ReceiveResult {
  amount: number;
  unit: string;
  mintUrl: string;
  memo?: string;
  // "swapped"     redeemed at the mint; the value is now provably ours
  // "stored"      kept offline; DLEQ passed but the mint has not confirmed it
  //               is unspent, so it counts as unverified balance
  // "duplicate"   every proof was already in the wallet; nothing was credited
  outcome: "swapped" | "stored" | "duplicate" | "own-pending";
  // Why we did not swap, when outcome is "stored".
  offlineReason?: string;
  // Result of the offline DLEQ check, for the receipt UI.
  dleq: "valid" | "unchecked";
}

// Take a token string into the wallet.
//
// The order matters. We decode, then verify what can be verified offline, then
// try to swap at the mint, and only fall back to storing the raw proofs when
// the mint is unreachable. A forged token (DLEQ fails) is refused outright and
// never reaches the store, which is the case the old receive path could not
// catch at all: it credited the balance from any well-formed string.
export async function receiveToken(
  raw: string,
  opts: { preferOffline?: boolean; counterparty?: string } = {},
): Promise<ReceiveResult> {
  assertUnlocked();

  const info = decodeToken(raw);
  if (!info) {
    throw new WalletError(
      "invalid-token",
      t("wallet.svc.unreadable_token"),
      t("wallet.svc.unreadable_token_body"),
    );
  }

  const store = useWalletStore.getState();
  const url = normalizeMintUrl(info.mintUrl);
  const record = store.mints[url];

  // Offline verification first: it costs nothing and it is the only thing
  // standing between a forged token and the balance when there is no network.
  const dleq = verifyTokenOffline(
    info.token,
    record?.keysetCache as KeyChainCache | undefined,
    info.unit,
  );
  if (dleq.status === "invalid") {
    throw new WalletError(
      "forged-token",
      t("wallet.svc.wrong_mint"),
      dleq.reason,
    );
  }

  // Everything is already ours: report it instead of showing a phantom credit.
  const existing = new Set(
    (store.proofs[accountKey(url, info.unit)] ?? []).map((p) => p.secret),
  );
  if (info.token.proofs.every((p) => existing.has(p.secret))) {
    return {
      amount: info.amount,
      unit: info.unit,
      mintUrl: url,
      memo: info.memo,
      outcome: "duplicate",
      dleq: dleq.status === "valid" ? "valid" : "unchecked",
    };
  }

  // Our own send that has not settled yet. Sending moves proofs out of the
  // spendable pool and into reservation, so the check above cannot see them and
  // this would otherwise look like a stranger's token.
  //
  // Redeeming it would work, but badly: it pays the mint a swap fee to hand
  // back money we already hold, files it in history as money received, and
  // leaves the original send pending until `reconcile` happened to notice the
  // proofs were spent. Reclaim on that transaction does the same job directly
  // and settles the balance immediately, so point there instead.
  const reservedSecrets = new Set<string>();
  for (const entry of Object.values(store.reserved)) {
    for (const proof of entry.proofs) reservedSecrets.add(proof.secret);
  }
  if (
    reservedSecrets.size > 0 &&
    info.token.proofs.every((p) => reservedSecrets.has(p.secret))
  ) {
    return {
      amount: info.amount,
      unit: info.unit,
      mintUrl: url,
      memo: info.memo,
      outcome: "own-pending",
      dleq: dleq.status === "valid" ? "valid" : "unchecked",
    };
  }

  const dleqLabel =
    dleq.status === "valid" ? ("valid" as const) : ("unchecked" as const);

  // Online path: swap the proofs so they are provably unspent and no longer
  // known to the sender. This is what makes a received token safe to hold.
  if (opts.preferOffline !== true) {
    try {
      assertMintNetworkAllowed();
      const wallet = await getWallet(url, info.unit);
      // `requireDleq` makes cashu-ts reject a proof whose witness does not
      // verify against the freshly loaded keys, closing the window where our
      // cached keys were missing and the offline check came back "unchecked".
      //
      // `privkey` is our NIP-61 P2PK key, and it is what makes a locked token
      // claimable at all. Most tokens are ordinary bearer proofs and ignore it,
      // but a nutzap whose relay publish failed is delivered to the recipient as
      // a token in a DM, and those proofs are locked to this key: without a
      // witness the mint refuses the swap, so the money could be neither claimed
      // by them nor reclaimed by the sender. Passing it costs nothing on every
      // other path.
      const fresh = await wallet.receive(info.token, {
        requireDleq: info.hasDleq,
        privkey: await getNutzapPrivKeyHex(),
      });
      creditProofs(url, info.unit, fresh, { verified: true });
      markClaimed(info);
      recordTx({
        kind: "receive",
        status: "completed",
        amount: info.amount,
        unit: info.unit,
        mintUrl: url,
        memo: info.memo,
        counterparty: opts.counterparty,
      });
      return {
        amount: info.amount,
        unit: info.unit,
        mintUrl: url,
        memo: info.memo,
        outcome: "swapped",
        dleq: dleqLabel,
      };
    } catch (err) {
      const walletErr = asWalletError(err, "mint-error");
      // A mint that says "already spent" is authoritative: storing the proofs
      // would show a balance that can never be redeemed.
      if (
        walletErr.code === "mint-error" &&
        /spent|already|TOKEN_ALREADY/i.test(
          walletErr.detail ?? walletErr.message,
        )
      ) {
        throw new WalletError(
          "already-spent",
          t("wallet.svc.already_spent"),
          t("wallet.svc.already_spent_body"),
        );
      }
      if (walletErr.code !== "offline" && walletErr.code !== "tor-blocked") {
        throw walletErr;
      }
      // Offline or Tor-blocked: fall through and store the raw proofs.
      return storeOffline(
        url,
        info,
        walletErr.message,
        dleqLabel,
        opts.counterparty,
      );
    }
  }

  return storeOffline(
    url,
    info,
    t("wallet.svc.receiving_offline"),
    dleqLabel,
    opts.counterparty,
  );
}

// Keep the token's own proofs, unverified. This is the offline mesh case: value
// really has moved, and refusing it would make the app useless in the situation
// it exists for. It is recorded as unverified so the UI can be honest that the
// mint has not confirmed it, and so `refreshAccount` redeems it first.
function storeOffline(
  mintUrl: string,
  info: TokenInfo,
  reason: string,
  dleq: "valid" | "unchecked",
  counterparty?: string,
): ReceiveResult {
  const store = useWalletStore.getState();
  store.addMint(mintUrl, { units: [info.unit] });
  const stored = info.token.proofs.map((p) =>
    toStoredProof(p, { verified: false }),
  );
  const { added } = store.addProofs(mintUrl, info.unit, stored);
  markClaimed(info);
  if (added === 0) {
    return {
      amount: info.amount,
      unit: info.unit,
      mintUrl,
      memo: info.memo,
      outcome: "duplicate",
      dleq,
    };
  }
  recordTx({
    kind: "receive",
    status: "pending",
    amount: info.amount,
    unit: info.unit,
    mintUrl,
    memo: info.memo,
    counterparty,
  });
  return {
    amount: info.amount,
    unit: info.unit,
    mintUrl,
    memo: info.memo,
    outcome: "stored",
    offlineReason: reason,
    dleq,
  };
}

// Credit proofs the mint has just signed for us.
//
// `derived` is not a parameter because it is never a judgement call: a proof is
// restorable exactly when the wallet that created it had the seed loaded. These
// proofs always came out of a wallet built by `getWallet`, so `isBackupActive()`
// at this moment is the truth.
//
// `addProofs` deduplicates by secret, so passing a list that also contains
// proofs we already hold (as `wallet.send` does, since its `keep` array carries
// untouched originals alongside fresh change) leaves those records exactly as
// they were rather than relabelling them.
// Remember that this exact token has been taken in, so a payment card in a chat
// can show "Claimed" rather than a button whose only outcome is an error. Keyed
// on the first proof's secret, which is random and unique to the token.
function markClaimed(info: TokenInfo): void {
  const first = info.token.proofs[0]?.secret;
  if (first !== undefined) useWalletStore.getState().markTokenClaimed(first);
}

function creditProofs(
  mintUrl: string,
  unit: string,
  proofs: Proof[],
  opts: { verified: boolean },
): void {
  const store = useWalletStore.getState();
  const derived = isBackupActive();
  store.addMint(mintUrl, { units: [unit] });
  store.addProofs(
    mintUrl,
    unit,
    proofs.map((p) => toStoredProof(p, { verified: opts.verified, derived })),
  );
}

// ---- Send -------------------------------------------------------------------

export interface SendQuote {
  mintUrl: string;
  unit: string;
  // What the recipient will be able to claim.
  amount: number;
  // Face value leaving the wallet (amount + fee when the sender covers it).
  spend: number;
  // Mint input fee the recipient would otherwise have paid.
  fee: number;
  // False when the denominations held cannot make this amount exactly. The
  // caller must get explicit consent, because offline there is no change: the
  // difference is a gift to the recipient.
  exact: boolean;
  proofs: StoredProof[];
}

export interface PreparedSend extends SendQuote {
  txId: string;
  token: string;
}

// Price a send without committing to it, so the UI can show "they receive N,
// you spend M" before the user taps.
//
// Fees are the reason these two numbers differ. Under NUT-02 the mint charges
// the *recipient* an input fee when they swap, so sending exactly N leaves them
// with less than N. We select enough to cover the fee, which is what every
// production Cashu wallet does and what makes "send 100" mean "they get 100".
export async function quoteSend(params: {
  amount: number;
  mintUrl?: string;
  unit?: string;
}): Promise<SendQuote> {
  assertUnlocked();
  const unit = params.unit ?? "sat";
  const amount = Math.floor(params.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new WalletError("insufficient", t("wallet.svc.amount_positive"));
  }

  const account = pickAccount(amount, unit, params.mintUrl);
  const record = storedMint(account.mintUrl);

  // With the mint's keysets cached, defer to cashu-ts: its RGLI selector and
  // fee handling are the reference implementation and get the edge cases
  // (rotated keysets, mixed fee schedules) right.
  try {
    const wallet = await getWallet(account.mintUrl, unit, { offline: true });
    const proofLikes = account.proofs.map(toProofLike);
    const result = wallet.sendOffline(amount, proofLikes, {
      includeFees: true,
      exactMatch: true,
    });
    const selected = matchStored(account.proofs, result.send);
    const spend = selected.reduce((s, p) => s + p.amount, 0);
    // A selection is only a quote if it actually covers the amount.
    //
    // `matchStored` maps cashu-ts's chosen proofs back to ours BY SECRET and
    // silently drops anything it cannot find. That is the right shape for the
    // lookup and the wrong shape to trust blindly: if the mapping loses proofs
    // for any reason, this returned `exact: true` with a short (or empty)
    // proof list and a NEGATIVE fee, and `prepareSend` went on to reserve
    // nothing, serialise an empty token, and open a pending send for the full
    // amount. The user is told the payment went out; the recipient receives a
    // token worth nothing. Nothing downstream could detect it, because every
    // field said the send had succeeded.
    //
    // Throwing here falls into the catch below, which re-selects with our own
    // selector and reports honestly - including refusing with "insufficient"
    // when the balance genuinely cannot cover it. That is the same path a
    // missing keyset cache already takes, so there is no new failure mode.
    if (selected.length !== result.send.length || spend < amount) {
      throw new Error(
        // Not user-facing: this is an invariant breach aimed at a stack trace.
        `offline selection did not map back to stored proofs (matched ${String(selected.length)} of ${String(result.send.length)}, covering ${String(spend)} of ${String(amount)})`,
      );
    }
    return {
      mintUrl: account.mintUrl,
      unit,
      amount,
      spend,
      fee: spend - amount,
      exact: true,
      proofs: selected,
    };
  } catch (err) {
    if (err instanceof WalletError && err.code === "locked") throw err;
    // No exact offline match, or no cached keysets. Fall back to our own
    // selector, which reports honestly whether it landed on the amount.
    const selection = selectProofsForAmount(
      account.proofs,
      amount,
      record?.feePpkByKeysetId,
    );
    if (!selection) {
      throw new WalletError(
        "insufficient",
        t("wallet.svc.insufficient_at_mint", { mint: hostOf(account.mintUrl) }),
      );
    }
    return {
      mintUrl: account.mintUrl,
      unit,
      amount,
      spend: selection.total,
      fee: selection.fee,
      exact: selection.exact,
      proofs: selection.selected,
    };
  }
}

// Commit a quoted send: reserve the proofs, serialise the token, and open a
// pending transaction. Nothing is destroyed. The proofs stay recoverable until
// `confirmSend` is called, and the token string is kept on the transaction so
// it can be re-shared after an app restart.
export async function prepareSend(params: {
  amount: number;
  mintUrl?: string;
  unit?: string;
  memo?: string;
  counterparty?: string;
  // Set when the user has already been told the amount is not exact and chose
  // to continue. Without it an inexact quote is refused, so overpaying can
  // never happen by accident.
  allowInexact?: boolean;
}): Promise<PreparedSend> {
  const quote = await quoteSend(params);
  if (!quote.exact && params.allowInexact !== true) {
    throw new WalletError(
      "inexact",
      t("wallet.svc.inexact_title", {
        amount: params.amount,
        unit: quote.unit,
      }),
      t("wallet.svc.inexact_detail", {
        spend: quote.spend,
        unit: quote.unit,
        extra: quote.spend - quote.amount,
      }),
    );
  }

  const txId = newTxId();
  const token = buildToken(
    quote.mintUrl,
    quote.proofs,
    quote.unit,
    params.memo,
  );

  const store = useWalletStore.getState();
  // The quote was priced before the awaits above, so another send may have
  // claimed these coins in the meantime. Reserving is the point at which that
  // is settled, and losing the race is a retry, not an error worth alarming
  // anybody about.
  if (!store.reserveProofs(txId, quote.mintUrl, quote.unit, quote.proofs)) {
    throw new WalletError(
      "insufficient",
      t("wallet.svc.coins_raced"),
      t("wallet.svc.coins_raced_body"),
    );
  }
  store.addTx({
    id: txId,
    kind: "send",
    status: "pending",
    amount: quote.amount,
    fee: quote.fee,
    unit: quote.unit,
    mintUrl: quote.mintUrl,
    createdAtMs: Date.now(),
    updatedAtMs: Date.now(),
    memo: params.memo,
    counterparty: params.counterparty,
    token,
  });

  return { ...quote, txId, token };
}

// The recipient has it. Drop the reservation for good.
export function confirmSend(txId: string): void {
  const store = useWalletStore.getState();
  store.dropReserved(txId);
  store.updateTx(txId, { status: "completed" });
}

// The transfer never landed. Put the proofs back.
//
// This is safe precisely because the send was offline: no swap happened, so the
// proofs are still valid at the mint. The risk is the recipient also kept a
// copy of the token, which is why the caller should only offer reclaim when
// delivery demonstrably failed, and why `refreshAccount` re-checks state with
// the mint afterwards.
export function reclaimSend(txId: string): boolean {
  const store = useWalletStore.getState();
  const restored = store.releaseReserved(txId);
  if (!restored) return false;
  store.updateTx(txId, { status: "reclaimed" });
  return true;
}

// Delivery failed in a way we cannot retry. Keeps the reservation (so the token
// can still be reclaimed or re-shared) and records why.
export function failSend(txId: string, reason: string): void {
  useWalletStore.getState().updateTx(txId, { error: reason });
}

// Choose the account to spend from: the mint the caller named, or the one that
// can cover the amount on its own. Cashu proofs cannot be combined across
// mints in a single token, so a balance split over two mints genuinely cannot
// pay a sum that neither covers; that is a mint-level fact, not a UI shortcut.
function pickAccount(
  amount: number,
  unit: string,
  preferredMint?: string,
): { mintUrl: string; proofs: StoredProof[] } {
  const state = useWalletStore.getState();
  const candidates = Object.entries(state.proofs)
    .filter(([key]) => key.endsWith(`|${unit}`))
    .map(([key, proofs]) => ({
      mintUrl: key.slice(0, key.length - unit.length - 1),
      proofs,
      balance: proofs.reduce((s, p) => s + p.amount, 0),
    }))
    .sort((a, b) => b.balance - a.balance);

  if (candidates.length === 0) {
    throw new WalletError(
      "no-mint",
      t("wallet.svc.no_ecash"),
      t("wallet.svc.no_ecash_body"),
    );
  }

  if (preferredMint) {
    const url = normalizeMintUrl(preferredMint);
    const hit = candidates.find((c) => c.mintUrl === url);
    if (!hit || hit.balance < amount) {
      throw new WalletError(
        "insufficient",
        t("wallet.svc.insufficient_at_mint", { mint: hostOf(url) }),
      );
    }
    return hit;
  }

  const covering = candidates.find((c) => c.balance >= amount);
  if (covering) return covering;

  const total = candidates.reduce((s, c) => s + c.balance, 0);
  if (total >= amount) {
    throw new WalletError(
      "insufficient",
      t("wallet.svc.split_across_mints"),
      t("wallet.svc.no_single_mint", { amount, unit }),
    );
  }
  throw new WalletError(
    "insufficient",
    t("wallet.svc.have_tried_send", { total, unit, amount }),
  );
}

// Map cashu-ts proofs back onto the stored records they came from, so the
// reservation removes exactly the rows the library chose.
function matchStored(stored: StoredProof[], chosen: Proof[]): StoredProof[] {
  const bySecret = new Map(stored.map((p) => [p.secret, p]));
  const out: StoredProof[] = [];
  for (const proof of chosen) {
    const hit = bySecret.get(proof.secret);
    if (hit) out.push(hit);
  }
  return out;
}

// ---- Refresh / reconcile ----------------------------------------------------

export interface RefreshResult {
  // Face value that was swapped for fresh proofs.
  swapped: number;
  // Number of proofs the mint reported as already spent, now removed.
  spentRemoved: number;
  stillUnverified: number;
  // Of what was swapped, how much was swapped purely to bring it under the
  // recovery phrase rather than to confirm it. Reported separately so the UI
  // can say "secured for backup" instead of implying it was suspect.
  securedForBackup: number;
}

// Bring an account into a known-good state with the mint.
//
// Two jobs, in this order:
//   1. Ask the mint which proofs are actually unspent (NUT-07). Anything the
//      mint calls spent is removed: it is not money, and showing it as balance
//      is the single worst thing an offline-first wallet can do.
//   2. Swap the surviving unverified proofs for fresh ones. That both confirms
//      them and cuts the sender's copy loose, so they can no longer be
//      double-spent by whoever sent them.
export async function refreshAccount(
  mintUrl: string,
  unit = "sat",
): Promise<RefreshResult> {
  assertUnlocked();
  assertMintNetworkAllowed();

  const url = normalizeMintUrl(mintUrl);
  const store = useWalletStore.getState();
  const key = accountKey(url, unit);
  const held = store.proofs[key] ?? [];
  if (held.length === 0) {
    return {
      swapped: 0,
      spentRemoved: 0,
      stillUnverified: 0,
      securedForBackup: 0,
    };
  }

  const wallet = await getWallet(url, unit, { forceRefresh: true });

  // Group by state, then map back to our stored rows by secret: a proof's
  // secret is its identity, so it survives the round trip through cashu-ts
  // without smuggling extra fields into the library's types.
  let unspent: StoredProof[];
  let spent: StoredProof[];
  try {
    const bySecret = new Map(held.map((p) => [p.secret, p]));
    const grouped = await wallet.groupProofsByState(held.map(toProofLike));
    const pick = (list: ProofLike[]): StoredProof[] =>
      list
        .map((p) => bySecret.get(p.secret))
        .filter((p): p is StoredProof => p !== undefined);
    // "pending" means an in-flight melt at the mint, not spent. Keep those.
    unspent = [...pick(grouped.unspent), ...pick(grouped.pending)];
    spent = pick(grouped.spent);
  } catch (err) {
    throw asWalletError(err, "mint-error");
  }

  if (spent.length > 0) {
    store.removeProofs(
      url,
      unit,
      spent.map((p) => p.secret),
    );
    recordTx({
      kind: "swap",
      status: "failed",
      amount: spent.reduce((s, p) => s + p.amount, 0),
      unit,
      mintUrl: url,
      error: t("wallet.svc.mint_says_spent"),
    });
  }

  // Two independent reasons to swap, and a proof can need it for either:
  //
  //   not verified  someone else gave us these proofs and still holds a copy of
  //                 the token. A state check says they are unspent right now,
  //                 not that they will be in a second. Swapping mints fresh
  //                 secrets only we know, which is what actually makes them
  //                 ours.
  //   not derived   the secret was random, so the recovery phrase cannot
  //                 rebuild it. Swapping re-issues it deterministically and
  //                 brings it under the backup. Only relevant once the user has
  //                 set a phrase up.
  const backupOn = isBackupActive();
  const needsSwap = (proof: StoredProof): boolean =>
    proof.verified !== true || (backupOn && proof.derived !== true);

  const toSwap = unspent.filter(needsSwap);
  const securedOnly = toSwap.filter(
    (proof) => proof.verified === true && proof.derived !== true,
  );
  const securedForBackup = securedOnly.reduce((sum, p) => sum + p.amount, 0);

  // Everything the mint just confirmed is unspent is verified, whether or not
  // it also needs re-deriving.
  store.markVerified(
    url,
    unit,
    unspent.map((p) => p.secret),
  );

  if (toSwap.length === 0) {
    return {
      swapped: 0,
      spentRemoved: spent.length,
      stillUnverified: 0,
      securedForBackup: 0,
    };
  }

  // Swap in one batch so the fee is charged once. A failure here leaves the
  // proofs untouched (the mint either accepts the whole swap or none of it),
  // so there is no partial-loss window.
  const face = toSwap.reduce((s, p) => s + p.amount, 0);
  try {
    const fresh = await wallet.receive(buildToken(url, toSwap, unit), {
      requireDleq: false,
    });
    store.removeProofs(
      url,
      unit,
      toSwap.map((p) => p.secret),
    );
    creditProofs(url, unit, fresh, { verified: true });
    const received = fresh.reduce((s, p) => s + p.amount.toNumber(), 0);
    recordTx({
      kind: "swap",
      status: "completed",
      amount: received,
      fee: face - received,
      unit,
      mintUrl: url,
    });
    // Close out the receipts that were left open when those proofs arrived
    // offline. Without this every mesh-received token would sit in the history
    // as "Received, unconfirmed" forever, even after it had been confirmed.
    for (const open of useWalletStore.getState().history) {
      if (
        open.kind === "receive" &&
        open.status === "pending" &&
        open.mintUrl === url &&
        open.unit === unit
      ) {
        store.updateTx(open.id, { status: "completed" });
      }
    }
    return {
      swapped: received,
      spentRemoved: spent.length,
      stillUnverified: 0,
      securedForBackup,
    };
  } catch (err) {
    // The state check already ran and any spent proofs are gone, so the wallet
    // is in a better state than before even though the swap failed. Surface the
    // error rather than reporting success, but do not undo step 1.
    throw asWalletError(err, "mint-error");
  }
}

// Re-check every pending transaction. Safe to call on app resume and whenever
// connectivity returns; it never spends and never credits without the mint.
// One pass at a time. A pass is a serial walk of every pending deposit, melt and
// reserved send, one mint round trip each, so on a bad network it runs for
// minutes. Two overlapping passes would ask the same mint the same questions and
// double every round trip for nothing.
//
// Callers join the pass in flight rather than starting a second one, so an
// explicit refresh during an automatic pass still awaits a real answer.
let reconcileInFlight: Promise<void> | null = null;
let lastReconcileAtMs = 0;

// Bumped by resetWalletService. A pass holds mint round trips open for minutes,
// so a panic wipe can land in the middle of one, and `recoverMeltChange` credits
// proofs: without this the tail of an orphaned pass could put money back into a
// wallet the user had just erased. The pass re-checks between steps and stops.
let walletEpoch = 0;

// Floor between AUTOMATIC passes only. Foregrounding is a frequent event and a
// pass is expensive; a user who explicitly pulls to refresh is never throttled.
const RECONCILE_MIN_INTERVAL_MS = 60_000;

// Settle whatever a previous session or a lost response left hanging: deposits
// whose invoice was paid while we were away, melts whose result never arrived,
// and reserved sends the recipient has since redeemed.
//
// Never throws: every step is individually best-effort, because one unreachable
// mint must not stop the others being settled.
export async function reconcile(): Promise<void> {
  if (reconcileInFlight !== null) return reconcileInFlight;
  const epoch = walletEpoch;
  reconcileInFlight = runReconcilePass().finally(() => {
    reconcileInFlight = null;
    // Only if a wipe did not happen underneath us. An orphaned pass finishing
    // after a reset would otherwise re-arm the throttle the reset had just
    // cleared, delaying the first pass of the new wallet for no reason.
    if (walletEpoch === epoch) lastReconcileAtMs = Date.now();
  });
  return reconcileInFlight;
}

// Automatic trigger: fire and forget, throttled, and safe to call from anywhere
// including an AppState handler. Deliberately synchronous and void-returning so
// a caller on the foreground path cannot accidentally await minutes of mint
// round trips.
export function reconcileIfDue(): void {
  if (reconcileInFlight !== null) return;
  if (Date.now() - lastReconcileAtMs < RECONCILE_MIN_INTERVAL_MS) return;
  void reconcile().catch(() => {
    // Offline, or a mint is down. The next trigger tries again.
  });
}

async function runReconcilePass(): Promise<void> {
  if (!isWalletStorageReady()) return;
  if (isMintNetworkBlocked()) return;

  const epoch = walletEpoch;
  const wiped = (): boolean => walletEpoch !== epoch;
  const state = useWalletStore.getState();

  // Lightning deposits whose invoice may have been paid while the app was shut.
  for (const tx of state.history) {
    if (tx.kind !== "mint" || tx.status !== "pending" || !tx.quoteId) continue;
    if (wiped()) return;
    try {
      await claimLightningDeposit(tx.mintUrl, tx.unit, tx.quoteId);
    } catch {
      // Still unpaid, or the mint is unreachable. Left pending for next time.
    }
  }

  // Melts whose response never arrived. The mint may have paid regardless, in
  // which case the unused routing reserve is sitting there as change signed
  // against blanks only this device can unblind.
  for (const tx of state.history) {
    if (tx.kind !== "melt" || tx.status !== "pending") continue;
    if (!tx.quoteId || tx.meltOutputs === undefined) continue;
    if (wiped()) return;
    try {
      await recoverMeltChange(tx);
    } catch {
      // Still unknown, or the mint is unreachable. The blanks stay put.
    }
  }

  // Reserved sends whose proofs the recipient has now redeemed: the value is
  // gone for good, so close them out rather than offering a reclaim that would
  // fail at the mint.
  for (const [txId, entry] of Object.entries(state.reserved)) {
    const tx = state.history.find((t) => t.id === txId);
    if (!tx || tx.status !== "pending") continue;
    if (wiped()) return;
    try {
      const wallet = await getWallet(tx.mintUrl, tx.unit);
      const grouped = await wallet.groupProofsByState(
        entry.proofs.map(toProofLike),
      );
      if (grouped.spent.length === entry.proofs.length) confirmSend(txId);
    } catch {
      // Unreachable mint: leave the reservation alone.
    }
  }

  // Locked nutzaps that never found a route.
  //
  // These have no reservation, so the loop above cannot see them: their proofs
  // are P2PK-locked to the recipient and left the wallet the moment the mint
  // swapped them. When the relay refused the kind 9321 AND no transport carried
  // the token either, the transaction is parked as pending with an explanation
  // and is deliberately not reclaimable. Something still has to close it, or the
  // outbox delivers the token days later, the recipient redeems it, and the
  // sender's Pending list keeps showing a payment that already landed.
  for (const tx of state.history) {
    if (tx.kind !== "nutzap-out" || tx.status !== "pending") continue;
    if (tx.token === undefined || state.reserved[tx.id] !== undefined) continue;
    if (wiped()) return;
    try {
      const info = decodeToken(tx.token);
      if (!info) continue;
      const wallet = await getWallet(tx.mintUrl, tx.unit);
      const grouped = await wallet.groupProofsByState(info.token.proofs);
      if (grouped.spent.length === info.token.proofs.length) {
        useWalletStore
          .getState()
          .updateTx(tx.id, { status: "completed", error: undefined });
      }
    } catch {
      // Unreachable mint, or a token we can no longer parse. Try again later.
    }
  }
}

// ---- Lightning: deposit (mint) ----------------------------------------------

export interface LightningDeposit {
  txId: string;
  quoteId: string;
  invoice: string;
  amount: number;
  unit: string;
  mintUrl: string;
  expiresAtMs?: number;
}

// Ask the mint for a bolt11 invoice. Paying it converts Lightning sats into
// ecash proofs, which is the only way value enters the wallet without someone
// handing over a token. Without this the wallet can only ever spend what it was
// given, which is why the balance stayed at zero for anyone starting fresh.
export async function createLightningDeposit(params: {
  amount: number;
  mintUrl: string;
  unit?: string;
  description?: string;
}): Promise<LightningDeposit> {
  assertUnlocked();
  assertMintNetworkAllowed();
  const unit = params.unit ?? "sat";
  const url = normalizeMintUrl(params.mintUrl);
  const amount = Math.floor(params.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new WalletError("insufficient", t("wallet.svc.amount_positive"));
  }

  const wallet = await getWallet(url, unit);
  requireNut(url, 4, t("wallet.svc.issue_against_invoice"));

  let quote: MintQuoteBolt11Response;
  try {
    quote = await wallet.createMintQuoteBolt11(amount, params.description);
  } catch (err) {
    throw asWalletError(err, "mint-error");
  }

  const txId = newTxId();
  useWalletStore.getState().addTx({
    id: txId,
    kind: "mint",
    status: "pending",
    amount,
    unit,
    mintUrl: url,
    createdAtMs: Date.now(),
    updatedAtMs: Date.now(),
    quoteId: quote.quote,
    invoice: quote.request,
    memo: params.description,
    counterparty: hostOf(url),
  });

  return {
    txId,
    quoteId: quote.quote,
    invoice: quote.request,
    amount,
    unit,
    mintUrl: url,
    expiresAtMs:
      typeof quote.expiry === "number" ? quote.expiry * 1000 : undefined,
  };
}

// Poll a deposit quote and mint the proofs once the invoice is paid. Throws
// while the invoice is still unpaid, so callers can poll on a timer or leave it
// to `reconcile` on next launch.
export async function claimLightningDeposit(
  mintUrl: string,
  unit: string,
  quoteId: string,
): Promise<number> {
  assertUnlocked();
  assertMintNetworkAllowed();
  const url = normalizeMintUrl(mintUrl);
  const store = useWalletStore.getState();
  const tx = store.history.find(
    (t) => t.quoteId === quoteId && t.kind === "mint",
  );
  if (!tx) throw new WalletError("mint-error", t("wallet.svc.unknown_deposit"));

  const wallet = await getWallet(url, unit);
  let quote: MintQuoteBolt11Response;
  try {
    quote = await wallet.checkMintQuoteBolt11(quoteId);
  } catch (err) {
    throw asWalletError(err, "mint-error");
  }

  // NUT-04 states: UNPAID -> PAID -> ISSUED. Only PAID can be minted, and only
  // once; ISSUED means we already claimed it (a duplicate poll, or a retry that
  // actually succeeded), so close the transaction rather than erroring.
  if (quote.state === "ISSUED") {
    store.updateTx(tx.id, { status: "completed" });
    return 0;
  }
  if (quote.state !== "PAID") {
    const expired =
      typeof quote.expiry === "number" && quote.expiry * 1000 < Date.now();
    if (expired) {
      store.updateTx(tx.id, {
        status: "expired",
        error: t("wallet.svc.invoice_expired_before"),
      });
      throw new WalletError("mint-error", t("wallet.svc.invoice_expired"));
    }
    throw new WalletError("offline", t("wallet.svc.invoice_unpaid"));
  }

  let proofs: Proof[];
  try {
    proofs = await wallet.mintProofsBolt11(tx.amount, quote);
  } catch (err) {
    const walletErr = asWalletError(err, "mint-error");
    store.updateTx(tx.id, { error: walletErr.message });
    throw walletErr;
  }

  creditProofs(url, unit, proofs, { verified: true });
  const minted = proofs.reduce((s, p) => s + p.amount.toNumber(), 0);
  store.updateTx(tx.id, { status: "completed", amount: minted });
  return minted;
}

// Settle a melt whose response was lost, using the blank outputs saved before
// the request went out.
//
// The mint is the only authority on whether the invoice was actually paid, so
// this asks rather than guesses:
//
//   PAID    the payment went through. Rebuild the change from the signatures
//           the quote carries and credit it, then close the transaction and
//           drop the reservation, because those inputs really are spent.
//   UNPAID  the melt never happened, so the reserved proofs are still good and
//           go back into the balance.
//   PENDING the mint is still trying. Leave everything exactly as it is.
async function recoverMeltChange(tx: WalletTx): Promise<void> {
  if (!tx.quoteId) return;
  const store = useWalletStore.getState();
  const wallet = await getWallet(tx.mintUrl, tx.unit);
  const quote = await wallet.checkMeltQuoteBolt11(tx.quoteId);

  if (quote.state === "PENDING") return;

  if (quote.state === "UNPAID") {
    store.releaseReserved(tx.id);
    store.updateTx(tx.id, {
      status: "failed",
      error: t("wallet.svc.mint_did_not_pay"),
      meltOutputs: undefined,
    });
    return;
  }

  // PAID. Rebuild the change, if the mint returned any.
  let recovered = 0;
  const signatures = quote.change ?? [];
  if (signatures.length > 0 && Array.isArray(tx.meltOutputs)) {
    try {
      const outputs = (tx.meltOutputs as SerializedOutputData[]).map((entry) =>
        OutputData.deserialize(entry),
      );
      const change = wallet.createMeltChangeProofs(outputs, signatures);
      if (change.length > 0) {
        creditProofs(tx.mintUrl, tx.unit, change, { verified: true });
        recovered = change.reduce((sum, p) => sum + p.amount.toNumber(), 0);
      }
    } catch {
      // Malformed or mismatched blanks. The payment still succeeded, so carry
      // on and close the transaction rather than leaving it pending forever.
    }
  }

  store.dropReserved(tx.id);
  store.updateTx(tx.id, {
    status: "completed",
    error: undefined,
    meltOutputs: undefined,
    ...(recovered > 0 ? { fee: Math.max(0, (tx.fee ?? 0) - recovered) } : {}),
  });
}

// ---- Lightning: withdraw (melt) ---------------------------------------------

export interface MeltQuote {
  quoteId: string;
  mintUrl: string;
  unit: string;
  // Amount the invoice pays out.
  amount: number;
  // Routing reserve the mint holds back; any unused part comes back as change.
  feeReserve: number;
  // What leaves the wallet in the worst case.
  total: number;
  invoice: string;
  expiresAtMs?: number;
  // The mint's own quote object, needed verbatim by `meltProofsBolt11`. Not
  // serialisable (it holds Amount value objects), so a quote does not survive a
  // restart: the UI must re-quote, which is correct anyway since fee reserves
  // and invoice expiry both move.
  raw: MeltQuoteBolt11Response;
}

// Price a Lightning withdrawal without committing. The fee reserve is an upper
// bound: whatever routing does not consume is returned as change proofs, so the
// UI should present it as "up to".
export async function quoteLightningWithdrawal(params: {
  invoice: string;
  mintUrl: string;
  unit?: string;
}): Promise<MeltQuote> {
  assertUnlocked();
  assertMintNetworkAllowed();
  const unit = params.unit ?? "sat";
  const url = normalizeMintUrl(params.mintUrl);
  const invoice = params.invoice.trim().replace(/^lightning:/i, "");
  if (!/^ln(bc|tb|bcrt)[0-9a-z]+$/i.test(invoice)) {
    throw new WalletError(
      "invalid-token",
      t("wallet.svc.not_an_invoice"),
      t("wallet.svc.not_an_invoice_body"),
    );
  }

  const wallet = await getWallet(url, unit);
  requireNut(url, 5, t("wallet.svc.pay_invoice"));

  let quote: MeltQuoteBolt11Response;
  try {
    quote = await wallet.createMeltQuoteBolt11(invoice);
  } catch (err) {
    throw asWalletError(err, "mint-error");
  }

  const amount = quote.amount.toNumber();
  const feeReserve = quote.fee_reserve.toNumber();
  const total = amount + feeReserve;

  const balance = (
    useWalletStore.getState().proofs[accountKey(url, unit)] ?? []
  ).reduce((s, p) => s + p.amount, 0);
  if (balance < total) {
    throw new WalletError(
      "insufficient",
      t("wallet.svc.invoice_needs", { total, unit, balance }),
    );
  }

  return {
    quoteId: quote.quote,
    mintUrl: url,
    unit,
    amount,
    feeReserve,
    total,
    invoice,
    expiresAtMs:
      typeof quote.expiry === "number" ? quote.expiry * 1000 : undefined,
    raw: quote,
  };
}

// Execute a quoted withdrawal.
//
// The proofs are reserved before the call and only dropped once the mint
// confirms payment, so a timeout mid-melt leaves them recoverable rather than
// vanished. On an ambiguous failure the reservation is deliberately kept: the
// mint may still settle, and `reconcile` will resolve it from the proof state
// rather than us guessing.
export async function payLightningInvoice(quote: MeltQuote): Promise<{
  paid: number;
  fee: number;
  changeReturned: number;
  preimage?: string;
}> {
  assertUnlocked();
  assertMintNetworkAllowed();

  const store = useWalletStore.getState();
  const key = accountKey(quote.mintUrl, quote.unit);
  const available = store.proofs[key] ?? [];
  const selection = selectProofsForAmount(
    available,
    quote.total,
    storedMint(quote.mintUrl)?.feePpkByKeysetId,
  );
  if (!selection) {
    throw new WalletError(
      "insufficient",
      t("wallet.svc.insufficient_for_invoice"),
    );
  }

  const txId = newTxId();
  if (
    !store.reserveProofs(txId, quote.mintUrl, quote.unit, selection.selected)
  ) {
    throw new WalletError(
      "insufficient",
      t("wallet.svc.coins_raced"),
      t("wallet.svc.coins_raced_invoice_body"),
    );
  }
  store.addTx({
    id: txId,
    kind: "melt",
    status: "pending",
    amount: quote.amount,
    fee: quote.feeReserve,
    unit: quote.unit,
    mintUrl: quote.mintUrl,
    createdAtMs: Date.now(),
    updatedAtMs: Date.now(),
    quoteId: quote.quoteId,
    invoice: quote.invoice,
    counterparty: "lightning",
  });

  try {
    const wallet = await getWallet(quote.mintUrl, quote.unit);

    // Split into prepare and complete so the blank change outputs exist before
    // the request does. Their blinding factors are the only way to unblind the
    // change the mint signs, and they would otherwise live purely in memory:
    // lose the response and the unused routing reserve is gone for good.
    const preview = await wallet.prepareMelt(
      "bolt11",
      quote.raw,
      selection.selected.map(toProofLike),
    );
    store.updateTx(txId, {
      meltOutputs: preview.outputData.map((output) =>
        OutputData.serialize(output),
      ),
    });

    const result = await wallet.completeMelt(preview);

    // Unused routing reserve comes back as change proofs.
    const change = result.change;
    if (change.length > 0) {
      creditProofs(quote.mintUrl, quote.unit, change, { verified: true });
    }
    const changeReturned = change.reduce((s, p) => s + p.amount.toNumber(), 0);
    const spent = selection.total - changeReturned;

    store.dropReserved(txId);
    store.updateTx(txId, {
      status: "completed",
      fee: spent - quote.amount,
      // Change is in hand, so the blanks have served their purpose.
      meltOutputs: undefined,
    });
    return {
      paid: quote.amount,
      fee: spent - quote.amount,
      changeReturned,
      preimage: result.quote.payment_preimage ?? undefined,
    };
  } catch (err) {
    const walletErr = asWalletError(err, "mint-error");
    // Only put the proofs back when the mint definitively refused. A network
    // error means the payment may have gone through; restoring the proofs then
    // would show a balance the mint has already spent.
    if (walletErr.code === "mint-error") {
      store.releaseReserved(txId);
      store.updateTx(txId, {
        status: "failed",
        error: walletErr.message,
        meltOutputs: undefined,
      });
    } else {
      // Ambiguous: the mint may have paid. The blanks stay on the transaction
      // so `reconcile` can recover the change once the quote's state is known.
      store.updateTx(txId, {
        error: `${walletErr.message} ${t("wallet.svc.payment_unknown")}`,
      });
    }
    throw walletErr;
  }
}

// ---- Consolidate across mints -----------------------------------------------

export interface ConsolidateResult {
  fromMintUrl: string;
  toMintUrl: string;
  unit: string;
  // What left the source mint, including the Lightning routing fee.
  spent: number;
  // What arrived at the destination.
  received: number;
  fee: number;
}

// Lightning fee reserves are usually well under 1%, but a first guess has to
// leave room or every attempt overshoots. The loop below corrects it.
const CONSOLIDATE_FEE_GUESS = 0.02;
const CONSOLIDATE_MIN_BUFFER = 2;
// Each attempt is a live mint round trip, so this is bounded tightly. Two
// corrections is enough for any realistic fee schedule.
const CONSOLIDATE_MAX_ATTEMPTS = 3;

// Move value from one mint to another over Lightning.
//
// Ecash from two mints can never be combined into one token, because a token
// names exactly one mint. That part is Cashu's design and is not fixable. What
// *is* fixable is being stuck with a split balance: the source mint pays a
// Lightning invoice that the destination mint issued, and the value lands as
// spendable ecash at the destination.
//
// This is the same pair of operations a user could do by hand with an external
// Lightning wallet, except the mints pay each other directly, so it costs one
// routing fee instead of two and needs no third app.
//
// Sizing is the awkward part: the melt quote's fee reserve is only known after
// asking, and asking requires an invoice, which requires an amount. So this
// quotes, checks whether the total fits, and shrinks the amount if it does not.
export async function consolidateMints(params: {
  fromMintUrl: string;
  toMintUrl: string;
  unit?: string;
  // Amount to arrive at the destination. Omit to move as much as will fit.
  amount?: number;
}): Promise<ConsolidateResult> {
  assertUnlocked();
  assertMintNetworkAllowed();

  const unit = params.unit ?? "sat";
  const from = normalizeMintUrl(params.fromMintUrl);
  const to = normalizeMintUrl(params.toMintUrl);
  if (from === to) {
    throw new WalletError(
      "no-mint",
      t("wallet.svc.same_mint"),
      t("wallet.svc.same_mint_body"),
    );
  }

  requireNut(from, 5, t("wallet.svc.pay_invoice"));
  requireNut(to, 4, t("wallet.svc.issue_against_invoice"));

  const store = useWalletStore.getState();
  const available = store.proofs[accountKey(from, unit)] ?? [];
  const sourceBalance = available.reduce((s, p) => s + p.amount, 0);
  if (sourceBalance <= 0) {
    throw new WalletError(
      "insufficient",
      t("wallet.svc.nothing_to_move", { mint: hostOf(from), unit }),
    );
  }

  // First guess: everything, less a buffer for the routing fee.
  let target =
    params.amount ??
    sourceBalance -
      Math.max(
        CONSOLIDATE_MIN_BUFFER,
        Math.ceil(sourceBalance * CONSOLIDATE_FEE_GUESS),
      );

  for (let attempt = 0; attempt < CONSOLIDATE_MAX_ATTEMPTS; attempt++) {
    if (target <= 0) break;

    const deposit = await createLightningDeposit({
      amount: target,
      mintUrl: to,
      unit,
      description: t("wallet.svc.consolidate_memo", { mint: hostOf(from) }),
    });

    let quote: MeltQuote;
    try {
      quote = await quoteLightningWithdrawal({
        invoice: deposit.invoice,
        mintUrl: from,
        unit,
      });
    } catch (err) {
      // The invoice we just asked for cannot be paid from this mint at this
      // size. Abandon it so it does not linger in history as a live deposit.
      abandonDeposit(deposit.txId, t("wallet.svc.quote_failed_retried"));
      const walletErr = asWalletError(err, "mint-error");
      if (walletErr.code !== "insufficient") throw walletErr;
      target = Math.floor(target * 0.95);
      continue;
    }

    // The melt needs the invoice amount, the routing reserve, and the mint's
    // own per-proof input fees, all out of the same balance.
    const inputFee = feeForProofs(
      available,
      storedMint(from)?.feePpkByKeysetId,
    );
    if (quote.total + inputFee > sourceBalance) {
      abandonDeposit(deposit.txId, t("wallet.svc.amount_unfit_retried"));
      const overshoot = quote.total + inputFee - sourceBalance;
      target -= overshoot;
      continue;
    }

    // Committed from here. The source pays; the destination issues on claim.
    const melt = await payLightningInvoice(quote);
    const received = await claimLightningDeposit(to, unit, deposit.quoteId);

    // Report what the move actually cost, not what it might have.
    //
    // `quote.total` is the worst case: the invoice plus the whole routing
    // reserve. The mint returns the unused part of that reserve as change, so
    // using the quote here told the user a move cost eight sats when it cost
    // one, and made the arithmetic on screen disagree with their own balance.
    // `melt.fee` is what the route really charged.
    const spent = quote.amount + melt.fee;

    return {
      fromMintUrl: from,
      toMintUrl: to,
      unit,
      spent,
      received,
      fee: spent - received,
    };
  }

  throw new WalletError(
    "insufficient",
    t("wallet.svc.cannot_size"),
    t("wallet.svc.cannot_size_detail", { from: hostOf(from), to: hostOf(to) }),
  );
}

// Close out a deposit quote we asked for and then decided not to use, so the
// Lightning section does not show phantom "waiting on payment" entries.
function abandonDeposit(txId: string, reason: string): void {
  useWalletStore.getState().updateTx(txId, {
    status: "expired",
    error: reason,
  });
}

// ---- NUT support gating -----------------------------------------------------

// Fail before a network round trip when the mint has told us it cannot do this.
function requireNut(mintUrl: string, nut: number, what: string): void {
  const nuts = storedMint(mintUrl)?.supportedNuts;
  if (!nuts || nuts.length === 0) return; // unknown: let the mint decide
  if (nuts.includes(nut)) return;
  throw new WalletError(
    "unsupported",
    t("wallet.svc.mint_cannot", { mint: hostOf(mintUrl), action: what }),
    t("wallet.svc.no_nut", { nut }),
  );
}

// ---- P2PK identity (NIP-61) -------------------------------------------------

// Nutzaps are received by locking proofs to a public key the recipient
// publishes. That key must be a real secp256k1 key we hold the private half of,
// and it must be stable, or previously published kind 10019 events point at a
// key we can no longer spend from. It lives in the Keychain next to the
// identity keys, never in the proof store.
const P2PK_KEY_ITEM = KEYCHAIN_ITEMS.walletP2pkKey;

// In-flight or resolved read-or-mint. Cleared by resetWalletService.
let nutzapPrivKey: Promise<string> | null = null;

async function getNutzapPrivKeyHex(): Promise<string> {
  // Single-flight. Four call sites reach this; on a fresh install two running
  // together would both read nothing, both mint a key and both write. The last
  // write wins, leaving the other caller with a private key the keychain does
  // not hold - and its public half goes into the kind 10019, so senders would
  // lock ecash to a pubkey this device cannot spend from. Same pattern as
  // bootstrapWalletStorage.
  nutzapPrivKey ??= (async () => {
    const existing = await readSecret(P2PK_KEY_ITEM);
    if (typeof existing === "string" && /^[0-9a-f]{64}$/i.test(existing)) {
      return existing.toLowerCase();
    }
    const fresh = bytesToHex(secp256k1.utils.randomSecretKey());
    await writeSecret(P2PK_KEY_ITEM, fresh);
    return fresh;
  })();
  try {
    return await nutzapPrivKey;
  } catch (error) {
    // Drop the handle so a locked keychain is not cached as the answer for the
    // rest of the process.
    nutzapPrivKey = null;
    throw error;
  }
}

// 33-byte compressed public key, hex. This is what goes in the kind 10019
// `pubkey` tag and what senders lock proofs to.
async function getNutzapPubKeyHex(): Promise<string> {
  const priv = await getNutzapPrivKeyHex();
  const pub = bytesToHex(secp256k1.getPublicKey(hexToBytes(priv), true));
  useWalletStore.getState().setNutzapPubkey(pub);
  return pub;
}

// ---- Nutzap redemption ------------------------------------------------------

// Redeem P2PK-locked proofs from an incoming NIP-61 nutzap. The proofs are
// locked to our key, so they must be signed before the mint will swap them;
// until that swap they are not spendable by anyone else, which is what makes
// nutzaps safe to leave sitting on a relay.
async function redeemNutzapProofs(params: {
  proofs: ProofLike[];
  mintUrl: string;
  unit: string;
  eventId: string;
  senderPubkey: string;
  comment?: string;
}): Promise<number> {
  assertUnlocked();
  const store = useWalletStore.getState();
  if (store.redeemedNutzaps.includes(params.eventId)) return 0;

  assertMintNetworkAllowed();
  const url = normalizeMintUrl(params.mintUrl);

  // Only redeem from a mint this wallet already trusts.
  //
  // The mint URL is read verbatim out of the incoming kind-9321 event, and the
  // watcher runs unattended from launch against public relays, so this is one
  // of the very few paths where a stranger's bytes reach the network stack with
  // no user in the loop at all. NIP-61 says the mint must be one the recipient
  // listed in their kind 10019, and core/payments/nutzap.ts states that same
  // invariant in its header; it was simply never enforced on the receive side.
  //
  // What it costs to skip: a P2PK witness signs the proof's secret and nothing
  // else - not the mint it is presented to - so a witness produced for a
  // hostile mint is equally valid at the real one. Redeeming against an
  // attacker's server hands them a signature they can replay to the genuine
  // mint and take the funds, quite apart from confirming the user's IP and
  // liveness and leaving their server persisted in the mint list.
  //
  // The user's own mint set is exactly the right allowlist: it is what
  // publishOwnNutzapInfo advertises in the kind 10019, so anyone following the
  // spec already sends to one of these.
  if (useWalletStore.getState().mints[url] === undefined) {
    throw new WalletError(
      "untrusted-mint",
      t("wallet.svc.unknown_mint"),
      t("wallet.svc.unknown_mint_body"),
    );
  }

  const wallet = await getWallet(url, params.unit);
  const privkey = await getNutzapPrivKeyHex();

  let fresh: Proof[];
  try {
    fresh = await wallet.receive(params.proofs, { privkey });
  } catch (err) {
    throw asWalletError(err, "mint-error");
  }

  creditProofs(url, params.unit, fresh, { verified: true });
  const amount = fresh.reduce((s, p) => s + p.amount.toNumber(), 0);
  store.markNutzapRedeemed(params.eventId);
  recordTx({
    kind: "nutzap-in",
    status: "completed",
    amount,
    unit: params.unit,
    mintUrl: url,
    memo: params.comment,
    counterparty: params.senderPubkey,
  });
  return amount;
}

// Build P2PK-locked proofs for an outgoing nutzap. This requires the mint, since
// locking means minting new outputs with a spending condition; there is no
// offline equivalent.
export async function lockProofsForNutzap(params: {
  amount: number;
  mintUrl: string;
  unit: string;
  recipientPubkey: string;
}): Promise<{ locked: Proof[]; txId: string }> {
  assertUnlocked();
  assertMintNetworkAllowed();
  const url = normalizeMintUrl(params.mintUrl);
  const store = useWalletStore.getState();
  const key = accountKey(url, params.unit);
  const available = store.proofs[key] ?? [];

  const wallet = await getWallet(url, params.unit);
  const txId = newTxId();

  let result;
  try {
    result = await wallet.send(
      params.amount,
      available.map(toProofLike),
      { includeFees: true },
      { send: { type: "p2pk", options: { pubkey: params.recipientPubkey } } },
    );
  } catch (err) {
    throw asWalletError(err, "mint-error");
  }

  // Work out which proofs the mint actually consumed.
  //
  // cashu-ts returns `keep` as [change proofs, ...proofs it never selected], so
  // the originals it left alone come back with their own secrets intact. The
  // difference between what we offered and what came back is therefore exactly
  // the set that was spent. Removing that set and then crediting `keep` is
  // safe in either order because `addProofs` deduplicates by secret, so the
  // untouched originals are not re-added.
  const consumed = new Set(available.map((p) => p.secret));
  for (const kept of result.keep) consumed.delete(kept.secret);
  store.removeProofs(url, params.unit, [...consumed]);
  creditProofs(url, params.unit, result.keep, { verified: true });

  const sent = result.send.reduce((s, p) => s + p.amount.toNumber(), 0);
  store.addTx({
    id: txId,
    kind: "nutzap-out",
    status: "pending",
    amount: sent,
    unit: params.unit,
    mintUrl: url,
    createdAtMs: Date.now(),
    updatedAtMs: Date.now(),
    counterparty: params.recipientPubkey,
  });

  return { locked: result.send, txId };
}

// ---- Nutzap send ------------------------------------------------------------

// Everything from here down is money, not delivery.
//
// These used to be one `sendNutzap` that also published the DMs. Putting
// delivery inside the module that has no business knowing what a chat thread is
// cost exactly what you would expect: the DM it published never appeared in the
// conversation, was never retried when a relay dropped it, and on a publish
// timeout it fell through to a path that reserved a SECOND set of proofs for the
// same payment. Delivery now lives in services/payment-router.ts, the one module
// allowed to import both the mesh and the wallet.

export interface NutzapTarget {
  // Where to lock: a mint they listed that we also hold enough value at.
  mintUrl: string;
  // Their 33-byte compressed P2PK key, from the kind 10019.
  p2pkPubkey: string;
  // The relays they watch for nutzaps, also from the kind 10019. Carried all the
  // way to `publishNutzap`, because publishing to our own relays instead is the
  // difference between a payment they receive and one that sits somewhere they
  // never subscribe to.
  relays: string[];
}

export type NutzapLookup =
  { ok: true; target: NutzapTarget } | { ok: false; reason: string };

// Can this person be paid the NIP-61 way, and where?
//
// Spends nothing and never throws. Every failure here means "not this rail",
// which the caller answers with a different one, so a thrown error would only
// turn a routine fallback into a dead end. The `reason` is user-facing copy,
// because the person who just paid deserves to know why they got the lesser
// instrument.
export async function findNutzapTarget(params: {
  recipientPubkey: string;
  amount: number;
  unit: string;
  client: NostrClient;
}): Promise<NutzapLookup> {
  let info: NutzapInfo | null = null;
  try {
    info = await fetchNutzapInfo(params.recipientPubkey, params.client);
  } catch {
    info = null;
  }
  if (!info) return { ok: false, reason: t("wallet.svc.no_nutzap_info") };

  // A token names exactly one mint, so the lock has to happen at a mint that is
  // both on their list and already funded on our side. Reading the store rather
  // than asserting unlocked is deliberate: a locked wallet reads as zero
  // balance, so it lands on "no shared mint" and the caller's next rail raises
  // the real "wallet is locked" error with the wording the user needs.
  const state = useWalletStore.getState();
  const shared = info.mintUrls
    .map(normalizeMintUrl)
    .find(
      (url) =>
        (state.proofs[accountKey(url, params.unit)] ?? []).reduce(
          (s, p) => s + p.amount,
          0,
        ) >= params.amount,
    );
  if (shared === undefined) {
    return { ok: false, reason: t("wallet.svc.no_shared_mint") };
  }
  return {
    ok: true,
    target: {
      mintUrl: shared,
      p2pkPubkey: info.p2pkPubkey,
      relays: info.relays,
    },
  };
}

// Publish proofs that are already locked to the recipient (kind 9321).
//
// Returns whether a relay took it, and always returns the token string for
// those locked proofs. The value is committed either way: the proofs are
// spendable only by the recipient's key and are not ours to take back, so a
// failed publish is a delivery problem, never a reason to pay again. The token
// is written onto the transaction before this returns so a crash still leaves
// something the user can hand over by hand.
export async function publishLockedNutzap(params: {
  locked: Proof[];
  txId: string;
  mintUrl: string;
  unit: string;
  recipientPubkey: string;
  senderPrivKey: Uint8Array;
  client: NostrClient;
  comment?: string;
  // Their kind 10019 relay list. See NutzapTarget.
  relays?: string[];
}): Promise<{ published: boolean; token: string }> {
  const store = useWalletStore.getState();
  const token = buildToken(
    params.mintUrl,
    params.locked.map((p) => toStoredProof(p, { verified: true })),
    params.unit,
    params.comment,
  );
  store.updateTx(params.txId, { token });

  try {
    await publishNutzap({
      proofs: params.locked,
      mintUrl: params.mintUrl,
      recipientPubkey: params.recipientPubkey,
      senderPrivKey: params.senderPrivKey,
      client: params.client,
      comment: params.comment,
      ...(params.relays !== undefined ? { relays: params.relays } : {}),
    });
    store.updateTx(params.txId, { status: "completed" });
    return { published: true, token };
  } catch {
    // Relay refused or unreachable. The money is already theirs; only the
    // notification failed, so the caller delivers the token another way.
    return { published: false, token };
  }
}

// Mark a locked nutzap as delivered by some route other than the relay.
export function settleNutzap(txId: string): void {
  useWalletStore.getState().updateTx(txId, { status: "completed" });
}

// Record that locked proofs reached nobody. Not reclaimable by design: they are
// the recipient's, whatever happens next.
export function failNutzapDelivery(txId: string, reason: string): void {
  useWalletStore.getState().updateTx(txId, { error: reason });
}

// ---- Nutzap receive ---------------------------------------------------------

// Watch relays for incoming nutzaps and redeem them as they arrive.
//
// Redemption needs the mint, so a zap that lands while offline stays on the
// relay and is picked up by the next subscription: NIP-61 events are public and
// replaceable-by-nobody, so nothing is lost by not acting immediately. Already
// redeemed event ids are remembered in the store, which is what stops a relay
// replay from crediting the same zap twice.
export function startNutzapWatcher(params: {
  myPubkey: string;
  client: NostrClient;
  onRedeemed?: (amount: number, unit: string, from: string) => void;
}): () => void {
  return subscribeNutzaps(params.myPubkey, params.client, (zap) => {
    void (async () => {
      const store = useWalletStore.getState();
      if (store.redeemedNutzaps.includes(zap.eventId)) return;
      try {
        const amount = await redeemNutzapProofs({
          proofs: zap.proofs,
          mintUrl: zap.mintUrl,
          unit: zap.unit,
          eventId: zap.eventId,
          senderPubkey: zap.senderPubkey,
          comment: zap.comment,
        });
        if (amount > 0) params.onRedeemed?.(amount, zap.unit, zap.senderPubkey);
      } catch (err) {
        // A refusal is not a failure, and the two need opposite handling.
        //
        // "untrusted-mint" means the zap named a mint this wallet does not
        // hold, so we declined to talk to it at all. Retrying cannot change
        // that, and silently retrying forever would leave the user wondering
        // why a payment they were told about never arrived. Mark it seen so the
        // subscription moves on, and write it into the wallet history the same
        // way every other money event is recorded, so there is somewhere to
        // look and an obvious next step (add the mint, if they trust it).
        if (err instanceof WalletError && err.code === "untrusted-mint") {
          store.markNutzapRedeemed(zap.eventId);
          recordTx({
            kind: "nutzap-in",
            status: "failed",
            amount: zap.proofs.reduce((s, p) => s + Number(p.amount), 0),
            unit: zap.unit,
            mintUrl: zap.mintUrl,
            counterparty: zap.senderPubkey,
            error: err.message,
          });
          return;
        }
        // Everything else is transient - mint unreachable, Tor-blocked, or the
        // proofs already claimed. Left unmarked so the next subscription
        // retries.
      }
    })();
  });
}

// Publish (or refresh) our own kind 10019 so other wallets can nutzap us. Safe
// to call on every launch: it is a replaceable event, and it only publishes
// when there is something to say (at least one mint).
export async function publishOwnNutzapInfo(params: {
  client: NostrClient;
  privKey: Uint8Array;
  relays: string[];
}): Promise<boolean> {
  if (!isWalletStorageReady()) return false;
  const mints = Object.keys(useWalletStore.getState().mints);
  if (mints.length === 0) return false;
  try {
    await publishNutzapInfo({
      mintUrls: mints,
      p2pkPubkey: await getNutzapPubKeyHex(),
      relays: params.relays,
      privKey: params.privKey,
      client: params.client,
    });
    return true;
  } catch {
    return false;
  }
}

// ---- Helpers ----------------------------------------------------------------

function newTxId(): string {
  return `${Date.now().toString(36)}-${bytesToHex(
    crypto.getRandomValues(new Uint8Array(8)),
  )}`;
}

function recordTx(
  tx: Omit<WalletTx, "id" | "createdAtMs" | "updatedAtMs">,
): string {
  const id = newTxId();
  useWalletStore.getState().addTx({
    ...tx,
    id,
    createdAtMs: Date.now(),
    updatedAtMs: Date.now(),
  });
  return id;
}

export function hostOf(mintUrl: string): string {
  try {
    return new URL(mintUrl).hostname;
  } catch {
    return mintUrl.replace(/^https?:\/\//, "");
  }
}
