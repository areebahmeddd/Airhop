// Orchestrated panic wipe: clears all keys and message data in one call.
//
// This is the single entry point for the "triple-tap logo" wipe gesture and
// any other UI surface that needs to destroy user data. It:
//   1. Removes all private keys from the secure enclave via the identity module.
//   2. Clears all MMKV storage instances (messages, peer state, etc.).
//
// The function is intentionally synchronous where possible and completes
// in well under 1 second on all supported devices.
//
// After this call the app is left in an empty, first-run state.
// A restart will trigger key regeneration at next launch.

import { createMMKV } from "react-native-mmkv";
import { panicWipe as clearKeys } from "../core/crypto/identity";
import { useChatStore } from "../store/chat-store";
import { usePeerStore } from "../store/peer-store";
import { useWalletStore } from "../store/wallet-store";

// The IDs used by all MMKV storage instances in src/store/ and src/core/.
// peer-store is intentionally absent: it uses in-memory Zustand with no MMKV
// persistence, so it resets automatically when the process restarts.
// wallet-store holds Cashu bearer tokens and MUST be cleared on panic wipe.
// If a new persisted store is added, add its MMKV ID here.
const MMKV_STORE_IDS = ["chat-store", "wallet-store"] as const;

export async function panicWipe(): Promise<void> {
  // 1. Destroy all private keys from the OS secure enclave.
  await clearKeys();

  // 2. Clear every MMKV partition.
  for (const id of MMKV_STORE_IDS) {
    createMMKV({ id }).clearAll();
  }

  // 3. Reset Zustand in-memory state so stale data does not appear after wipe.
  //    MMKV clearing above only affects persistence; live store state is separate.
  useChatStore.getState().clearAll();
  useWalletStore.getState().clearAll();
  usePeerStore.getState().clearAll();
}
