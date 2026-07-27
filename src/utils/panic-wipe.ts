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

import { createMMKV, deleteMMKV } from "react-native-mmkv";
import { panicWipe as clearKeys } from "../core/crypto/identity";
import { clearAttachmentCache } from "../services/file-transfer-service";
import { resetWalletService } from "../services/wallet-service";
import { useActivityStore } from "../store/activity-store";
import { useBlockedStore } from "../store/blocked-store";
import { useBoardStore } from "../store/board-store";
import { useChatStore } from "../store/chat-store";
import { useContactsStore } from "../store/contacts-store";
import { useGeohashBookmarksStore } from "../store/geohash-bookmarks-store";
import { useGroupStore } from "../store/group-store";
import { useNoticesStore } from "../store/notices-store";
import { useOutboxStore } from "../store/outbox-store";
import { usePeerStore } from "../store/peer-store";
import { usePlaceNamesStore } from "../store/place-names-store";
import { useSettingsStore } from "../store/settings-store";
import { useTransferStore } from "../store/transfer-store";
import { WALLET_STORAGE_ID, useWalletStore } from "../store/wallet-store";

// The IDs used by all MMKV storage instances in src/store/ and src/core/.
// peer-store is intentionally absent: it uses in-memory Zustand with no MMKV
// persistence, so it resets automatically when the process restarts.
// wallet-store is absent here on purpose: it is encrypted, so it is destroyed
// by WALLET_STORE_IDS below rather than cleared through this list.
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
  "blocked-store",
  "outbox-store",
  "contacts-store",
  "activity-store",
  "settings-store",
  // board-store holds signed public bulletin-board posts tied to this identity's
  // signing key; a wipe erases them along with the rest of this identity's data.
  "board-store",
  // prekey-store holds our one-time prekey private keys and peers' bundles;
  // both are identity-linked key material and must be destroyed on panic.
  "prekey-store",
  // group-store holds private-group epoch keys, which decrypt every group
  // message; destroy them on panic like any other conversation key material.
  "group-store",
  // geohash-bookmarks-store holds cells the user saved; a bookmark reveals a
  // place they care about, so it is erased with the rest of their data.
  "geohash-bookmarks-store",
  // place-names-store caches geocoded names for cells the user has opened, which
  // trace the places they have been active in; cleared on panic.
  "place-names-store",
] as const;

// The wallet store is handled separately from MMKV_STORE_IDS above: its file is
// AES-256 encrypted, so opening it with `createMMKV({ id })` (no key) to call
// clearAll() is not reliable. `deleteMMKV` removes the instance and its backing
// file outright, which works whatever the encryption state. The key itself is
// already destroyed by clearKeys() wiping the Keychain/Keystore, so even a
// failed delete leaves ciphertext nobody can open.
const WALLET_STORE_IDS = [WALLET_STORAGE_ID] as const;

export async function panicWipe(): Promise<void> {
  // 1. Destroy all private keys from the OS secure enclave. This also removes
  //    the wallet store's AES key, making step 2's ciphertext unrecoverable.
  await clearKeys();

  // 2. Clear every MMKV partition.
  for (const id of MMKV_STORE_IDS) {
    createMMKV({ id }).clearAll();
  }
  for (const id of WALLET_STORE_IDS) {
    try {
      deleteMMKV(id);
    } catch {
      // Instance never opened on this device, or already gone.
    }
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
  useBoardStore.getState().clearAll();
  useGroupStore.getState().clearAll();
  useNoticesStore.getState().clearAll();
  useGeohashBookmarksStore.getState().clearAll();
  usePlaceNamesStore.getState().clearAll();
  useSettingsStore.getState().reset();
  useBlockedStore.setState({ blockedPeerIDs: [] });

  // Drop the cached Cashu Wallet instances too: they hold the previous
  // identity's loaded keysets and a handle on the now-deleted store.
  resetWalletService();

  // 4. Delete received media files from disk. Best-effort: a failure here must
  //    not abort the wipe, the keys and stores are already gone.
  try {
    clearAttachmentCache();
  } catch {
    // Cache directory missing or unreadable: nothing to clear.
  }
}
