// Local Cashu proof storage backed by MMKV.
//
// Cashu proofs are bearer tokens representing real value. Per ARCHITECTURE.md
// they live in MMKV (not EncryptedStorage) because MMKV supports an optional
// encryptionKey that wraps the backing file with AES-256. The encryption key
// itself must be stored in Keychain/Keystore via react-native-encrypted-storage
// and passed to createMMKV({ id, encryptionKey }) before first use. Callers
// are responsible for that key provisioning step; this module just defines the
// store schema and operations.
//
// This store is intentionally minimal: it tracks unspent proofs only. The
// NIP-60 history (kind 7375/7376 events) is synced separately via Nostr.
// Redemption (swap at mint) is delegated to @cashu/cashu-ts Wallet.
//
// For proof serialization: Proof objects (from @cashu/cashu-ts) are stored
// as a JSON array keyed by mint URL. The Amount value object is serialized via
// its toJSON() method (which returns the decimal string).

import type { Proof } from "@cashu/cashu-ts";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// ---- Types ------------------------------------------------------------------

// Simplified serializable proof for MMKV storage.
// We strip the Amount value object and store numeric sats directly.
export interface StoredProof {
  id: string; // Keyset ID
  amount: number; // Denominated in the keyset unit (typically sats)
  secret: string; // The blinded secret
  C: string; // Unblinded signature from mint
  dleq?: SerializedDleq; // Optional offline DLEQ proof
}

export interface SerializedDleq {
  e: string;
  s: string;
  r?: string;
}

export interface MintBalance {
  mintUrl: string;
  unit: string; // "sat" typically
  balance: number; // Sum of unspent proof amounts
  proofCount: number;
}

// ---- Conversion helpers -----------------------------------------------------

export function proofToStored(proof: Proof): StoredProof {
  return {
    id: proof.id,
    amount: proof.amount.toNumber(),
    secret: proof.secret,
    C: proof.C,
    dleq: proof.dleq as SerializedDleq | undefined,
  };
}

// ---- State ------------------------------------------------------------------

interface WalletState {
  // Unspent proofs grouped by mint URL.
  proofsByMint: Record<string, StoredProof[]>;
  // Default unit assumed for all proofs (sats per NUT-00 default).
  unit: string;

  // Register a new mint URL (zero proofs). No-op if already registered.
  addMint: (mintUrl: string) => void;
  // Add proofs from a received token.
  addProofs: (mintUrl: string, proofs: StoredProof[]) => void;
  // Remove specific proofs by their secret (called after mint swap/redemption).
  removeProofs: (mintUrl: string, secrets: string[]) => void;
  // Replace proofs for a mint wholesale (after a swap operation).
  replaceProofs: (mintUrl: string, proofs: StoredProof[]) => void;
  // Clear all proofs for a mint (panic wipe hook).
  clearMint: (mintUrl: string) => void;
  // Clear everything (panic wipe).
  clearAll: () => void;
}

// ---- Selectors --------------------------------------------------------------

// Total balance across all mints in sats.
export function selectTotalBalance(state: WalletState): number {
  return Object.values(state.proofsByMint).reduce(
    (total, proofs) => total + proofs.reduce((sum, p) => sum + p.amount, 0),
    0,
  );
}

// Per-mint balances for display.
export function selectMintBalances(state: WalletState): MintBalance[] {
  return Object.entries(state.proofsByMint).map(([mintUrl, proofs]) => ({
    mintUrl,
    unit: state.unit,
    balance: proofs.reduce((sum, p) => sum + p.amount, 0),
    proofCount: proofs.length,
  }));
}

// Proof secrets as a Set: used to prevent duplicate deposits.
export function selectSecrets(
  state: WalletState,
  mintUrl: string,
): Set<string> {
  return new Set((state.proofsByMint[mintUrl] ?? []).map((p) => p.secret));
}

// ---- Store ------------------------------------------------------------------

const storage = createMMKV({ id: "wallet-store" });

const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set, _get) => ({
      proofsByMint: {},
      unit: "sat",

      addMint(mintUrl: string) {
        set((state) => {
          if (mintUrl in state.proofsByMint) return state;
          return {
            proofsByMint: { ...state.proofsByMint, [mintUrl]: [] },
          };
        });
      },

      addProofs(mintUrl: string, proofs: StoredProof[]) {
        if (proofs.length === 0) return;
        set((state) => {
          const existing = state.proofsByMint[mintUrl] ?? [];
          // Reject duplicates by secret to prevent double-counting.
          const existingSecrets = new Set(existing.map((p) => p.secret));
          const novel = proofs.filter((p) => !existingSecrets.has(p.secret));
          if (novel.length === 0) return state;
          return {
            proofsByMint: {
              ...state.proofsByMint,
              [mintUrl]: [...existing, ...novel],
            },
          };
        });
      },

      removeProofs(mintUrl: string, secrets: string[]) {
        if (secrets.length === 0) return;
        const secretSet = new Set(secrets);
        set((state) => {
          const existing = state.proofsByMint[mintUrl] ?? [];
          const remaining = existing.filter((p) => !secretSet.has(p.secret));
          return {
            proofsByMint: { ...state.proofsByMint, [mintUrl]: remaining },
          };
        });
      },

      replaceProofs(mintUrl: string, proofs: StoredProof[]) {
        set((state) => ({
          proofsByMint: { ...state.proofsByMint, [mintUrl]: proofs },
        }));
      },

      clearMint(mintUrl: string) {
        set((state) => {
          const next = { ...state.proofsByMint };
          delete next[mintUrl];
          return { proofsByMint: next };
        });
      },

      clearAll() {
        set({ proofsByMint: {} });
      },
    }),
    {
      name: "wallet-state",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
