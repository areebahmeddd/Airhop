// Orchestrated panic wipe: clears all keys and message data in one call.
//
// This is the single entry point for the "triple-tap logo" wipe gesture and
// any other UI surface that needs to destroy user data. It:
//   1. Removes all private keys from the secure enclave via the identity module.
//   2. Clears all MMKV storage instances (messages, peer state, etc.).
//   3. Deletes received media files from the cache (photos, videos, voice
//      notes), which live on disk, not in MMKV, and would otherwise survive.
//
// The function is intentionally synchronous where possible and completes
// in well under 1 second on all supported devices.
//
// After this call the app is left in an empty, first-run state.
// A restart will trigger key regeneration at next launch.

import { createMMKV } from "react-native-mmkv";
import { panicWipe as clearKeys } from "../core/crypto/identity";
import { clearAttachmentCache } from "../services/file-transfer-service";
import { useActivityStore } from "../store/activity-store";
import { useBlockedStore } from "../store/blocked-store";
import { useChatStore } from "../store/chat-store";
import { useContactsStore } from "../store/contacts-store";
import { useOutboxStore } from "../store/outbox-store";
import { usePeerStore } from "../store/peer-store";
import { useSettingsStore } from "../store/settings-store";
import { useTransferStore } from "../store/transfer-store";
import { useWalletStore } from "../store/wallet-store";

// The IDs used by all MMKV storage instances in src/store/ and src/core/.
// peer-store is intentionally absent: it uses in-memory Zustand with no MMKV
// persistence, so it resets automatically when the process restarts.
// wallet-store holds Cashu bearer tokens and MUST be cleared on panic wipe.
// blocked-store records who this identity has blocked, which is tied to this
// identity's relationships, same as chat data, so it goes too.
// If a new persisted store is added, add its MMKV ID here.
// outbox-store holds undelivered plaintext DMs awaiting a route, exactly the
// kind of content a panic wipe exists to destroy, so it must be cleared too.
// contacts-store holds who this identity knows, plus their public keys, the
// social graph a panic wipe is meant to erase.
// activity-store holds the notification feed: message previews and sender
// names, exactly the plaintext content a panic wipe must destroy.
// settings-store holds only device preferences (theme, quality), but a wipe is
// meant to leave a clean first-run state, so it is reset too.
export const MMKV_STORE_IDS = [
  "chat-store",
  "wallet-store",
  "blocked-store",
  "outbox-store",
  "contacts-store",
  "activity-store",
  "settings-store",
] as const;

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
  useOutboxStore.getState().clearAll();
  useContactsStore.getState().clearAll();
  useTransferStore.getState().clearAll();
  useActivityStore.getState().clearAll();
  useSettingsStore.getState().reset();
  useBlockedStore.setState({ blockedPeerIDs: [] });

  // 4. Delete received media files from disk. Best-effort: a failure here must
  //    not abort the wipe, the keys and stores are already gone.
  try {
    clearAttachmentCache();
  } catch {
    // Cache directory missing or unreadable: nothing to clear.
  }
}
