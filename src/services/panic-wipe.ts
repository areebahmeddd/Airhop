// Orchestrated panic wipe: clears all keys and message data in one call.
//
// This is the single entry point for the "triple-tap logo" wipe gesture and
// any other UI surface that needs to destroy user data. It:
//   1. Removes every private key from the OS keychain via core/crypto/keychain.
//   2. Clears all MMKV storage instances (messages, peer state, etc.).
//   3. Deletes received media files from the cache (photos, videos, voice
//      notes), which live on disk, not in MMKV, and would otherwise survive.
//
// This takes real time on a device with real data on it, and two rules follow
// from that: every step that can stall is time-boxed, and the sequence is
// resumable if the process dies partway through (see ./wipe-marker).
//
// After this call the app is left in an empty, first-run state.
// A restart will trigger key regeneration at next launch.

import NativeAirhopTor from "@bridge/NativeAirhopTor";
import { wipeAllSecrets } from "@core/crypto/keychain";
import { teardownTorState } from "@core/nostr/tor-teardown-handle";
import { useActivityStore } from "@store/activity-store";
import { useBlockedStore } from "@store/blocked-store";
import { useBoardStore } from "@store/board-store";
import { useChannelMembersStore } from "@store/channel-members-store";
import { dropPendingChatPersistence, useChatStore } from "@store/chat-store";
import { useContactsStore } from "@store/contacts-store";
import { useGeohashBookmarksStore } from "@store/geohash-bookmarks-store";
import { clearOwedGroupStates } from "@store/group-invite-outbox-store";
import { useGroupStore } from "@store/group-store";
import { useLocationNotesStore } from "@store/location-notes-store";
import { useMeshStateStore } from "@store/mesh-state-store";
import { getStorage } from "@store/mmkv";
import { useOutboxStore } from "@store/outbox-store";
import { usePeerStore } from "@store/peer-store";
import { usePlaceNamesStore } from "@store/place-names-store";
import { useSettingsStore } from "@store/settings-store";
import { useTransferStore } from "@store/transfer-store";
import {
  resetWalletStorage,
  useWalletStore,
  wipeWalletStorage,
} from "@store/wallet-store";
import { settleOr, withTimeout } from "@utils/with-timeout";
import { wipeCacheDirectory } from "./file-transfer-service";
import { clearLocationCache } from "./location-service";
import { dismissAllNotifications } from "./notification-service";
import { setNutzapRebinder, stopNutzapWatcher } from "./nutzap-watcher-handle";
import { resetWalletService } from "./wallet-service";
import { bumpWipeGeneration } from "./wipe-generation";
import { beginPanicWipe, endPanicWipe } from "./wipe-marker";

// Ceiling on the two best-effort steps that run after the data is destroyed.
// Long enough for a normal native round trip, short enough that the confirm
// sheet never looks stuck on the one gesture that has to feel instant.
const BEST_EFFORT_TIMEOUT_MS = 2_000;

// Ceiling on the keychain wipe, the one step everything else waits behind.
//
// A Keystore that stalls does not reject, it never answers, so only a deadline
// separates it from one about to succeed. `keysDestroyed: false` already carries
// that answer to the alert, the wipeIncomplete banner and the next launch's
// retry. Generous, because a healthy delete is a few milliseconds: past this the
// binder is wedged rather than the device slow.
const KEY_WIPE_TIMEOUT_MS = 5_000;

// The IDs used by all MMKV storage instances in src/store/ and src/core/.
// peer-store is intentionally absent: it uses in-memory Zustand with no MMKV
// persistence, so it resets automatically when the process restarts.
// wallet-store is absent here on purpose: it is encrypted, so it is destroyed
// by WALLET_STORE_IDS below rather than cleared through this list.
// blocked-store records who this identity has blocked, which is tied to this
// identity's relationships, same as chat data, so it goes too.
// If a new persisted store is added, add its MMKV ID here.
// One exception, and it is not an oversight: the wipe marker's partition
// (services/wipe-marker) must never appear here. It records that this wipe is
// running, so clearing it halfway through destroys the only thing that could
// finish the job after a crash.
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
  // courier-store holds sealed envelopes carried for other people. Unreadable
  // here (each is Noise X to a key this device does not hold), but a bag of a
  // neighbour's mail is evidence this phone stood next to whoever deposited it,
  // and a recipient tag names who it is for to anyone who heard that person
  // announce.
  "courier-store",
  // group-store holds private-group epoch keys, which decrypt every group
  // message; destroy them on panic like any other conversation key material.
  "group-store",
  // group-invite-outbox holds signed group states owed to members who were not
  // reachable yet, each carrying the same epoch key. Same reasoning as above.
  "group-invite-outbox",
  // geohash-bookmarks-store holds cells the user saved; a bookmark reveals a
  // place they care about, so it is erased with the rest of their data.
  "geohash-bookmarks-store",
  // place-names-store caches geocoded names for cells the user has opened, which
  // trace the places they have been active in; cleared on panic.
  "place-names-store",
] as const;

// What the wipe managed to do. Only the one claim the caller must not make
// falsely: everything else is best-effort and its failure changes nothing the
// user needs to decide about.
export interface PanicWipeResult {
  // False when the OS refused to release the keys - a locked Keychain on a
  // device that has booted but not been unlocked, which is precisely the
  // seizure case. Everything else is still destroyed; the secrets are not.
  keysDestroyed: boolean;
}

export async function panicWipe(): Promise<PanicWipeResult> {
  // 0. Record the intent BEFORE anything is destroyed. Everything below is a
  //    sequence, not a transaction, and the process can die anywhere in it.
  //    See ./wipe-marker.
  beginPanicWipe();

  // 0a. Invalidate startup work still in flight. Stopping the watcher below
  //     only reaches one already installed; a startup mid-relay-publish would
  //     install its replacement afterwards. See wipe-generation.ts.
  bumpWipeGeneration();

  // 0b. Stop the live NIP-61 nutzap subscription. It holds this identity's
  //     Nostr private key in a closure and a relay subscription under its
  //     pubkey, so leaving it running would keep the two things a wipe most
  //     needs gone alive for the rest of the process.
  stopNutzapWatcher();
  // And forget HOW to rebuild it. The rebinder closes over this identity's wipe
  // generation and its wallet keys, and the mesh calls it on every transport
  // rebuild, so leaving it registered would let a later rebuild resurrect a
  // subscription under keys that no longer exist.
  setNutzapRebinder(null);

  // 0c. Cancel any chat write still inside its throttle window, before
  //     anything is cleared. A pending write holds a plaintext snapshot of
  //     every thread and is armed to put it back on disk. Cancelled rather than
  //     flushed: these bytes must not reach disk again.
  dropPendingChatPersistence();

  // 1. Destroy all private keys from the OS secure enclave. This also removes
  //    the wallet store's AES key, making step 2's ciphertext unrecoverable.
  //
  //    Guarded, and the wipe continues either way. This was the one bare await
  //    in the sequence, and it is the step most likely to fail: the Keychain is
  //    unreadable on a device that has booted but not been unlocked, which is
  //    exactly the seizure scenario the panic wipe exists for. A throw here used
  //    to abandon everything below - all thirteen MMKV partitions, every store,
  //    the wallet file and the media cache stayed on disk - and the caller
  //    surfaced nothing, so the user got a confirmation haptic and a dead app
  //    over completely intact data.
  //
  //    Continuing is strictly better: the data goes even if the keys resist, and
  //    `keysDestroyed` is returned so the UI can tell the user the one thing
  //    they must not be lied to about.
  //
  //    wipeAllSecrets walks the item registry (expo-secure-store has no
  //    clear-all), attempting each even after one fails and throwing only if
  //    something was left behind.
  //
  //    Time-boxed as well as guarded: the try/catch covers a keychain that
  //    refuses, the deadline one that goes quiet. See KEY_WIPE_TIMEOUT_MS.
  let keysDestroyed = false;
  try {
    keysDestroyed = await withTimeout(
      wipeAllSecrets().then(() => true),
      KEY_WIPE_TIMEOUT_MS,
      false,
    );
  } catch {
    keysDestroyed = false;
  }

  // 2. Clear every MMKV partition, through the one handle each is persisted
  //    through. See store/mmkv for why a second handle is fatal.
  for (const id of MMKV_STORE_IDS) {
    getStorage(id).clearAll();
  }
  // The wallet is encrypted and asynchronously persisted, so it destroys
  // itself through the handle it owns rather than being deleted from here.
  // See wipeWalletStorage.
  wipeWalletStorage();

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
  clearOwedGroupStates();
  useLocationNotesStore.getState().clearAll();
  useChannelMembersStore.getState().clearAll();
  useGeohashBookmarksStore.getState().clearAll();
  usePlaceNamesStore.getState().clearAll();
  useSettingsStore.getState().reset();
  useBlockedStore.setState({ blockedPeerIDs: [] });
  // Transport health is live device state, not user data, but a wipe is meant
  // to leave a clean first-run state and the mesh is gone by this point. Left
  // as-is, the Mesh tab would keep showing the last identity's presence.
  useMeshStateStore.setState({
    bleBlocker: "starting",
    blePermissionBlocked: false,
    presenceStatus: "online",
    nostrConnected: false,
    // Tor is reset because it is a privacy *claim*, not just cosmetic state.
    // The wipe tears the transport down, but this flag drives the "Tor on ·
    // internet traffic routed" banner, so leaving it set meant the UI kept
    // promising onion routing that was no longer running. A security indicator
    // that over-claims is worse than none.
    torActive: false,
    torBootstrap: "idle",
    // The gate holding the Nostr transport down while Android waits on Orbot.
    // The wipe turns Tor off, so a gate left shut would leave a fresh install
    // with no internet half and a banner about a Tor nobody asked for.
    // teardownTorState clears it too; this covers either ordering.
    nostrBlockedByTor: false,
    bridgeActive: false,
    bridgePeopleAcross: 0,
    // Also a claim rather than cosmetic state, drawn from traffic that no
    // longer exists. A first-run state should not open by diagnosing a mesh the
    // user has just destroyed.
    clockSkewed: false,
    // Same rule, and no risk of disagreeing with the controller that publishes
    // it: destroyMeshService() ran before this, so the WiFiController holding
    // the last reading is already gone and the next one starts from "unknown"
    // too. Left set, a wipe on a phone with WiFi off would open the fresh
    // install on a note about a transport it has not tried yet.
    wifiFastPath: "unknown",
    // Same rule for the LAN transport, which a wipe has just switched off along
    // with every other setting. Left set, the Network screen would keep
    // describing a network this phone is no longer publishing on.
    lanState: "off",
    // Which cells we were listening in is a record of where the user was. It
    // goes with the mesh that was just destroyed, and null is the honest value
    // for a device that is no longer listening anywhere.
    liveGeoCells: null,
    // Cleared, not set, and the caller raises it a moment later if the keychain
    // actually refused something. A wipe that works must not leave the warning
    // from the one before it standing.
    wipeIncomplete: false,
  });

  // Drop the cached Cashu Wallet instances too: they hold the previous
  // identity's loaded keysets and a handle on the now-deleted store.
  resetWalletService();
  // And the wallet STORAGE bootstrap, which resetWalletService does not reach.
  //
  // deleteMMKV unlinks the file, but the JS handle and the resolved `ready`
  // promise are module scope and survived it. Three things went wrong with that:
  // the wallet reported itself unlocked and hydrated against a partition that no
  // longer existed, so the Wallet tab showed an empty-but-working wallet rather
  // than a first-run one; any later write recreated the file through the stale
  // handle, still holding the AES key whose keychain copy had just been
  // destroyed, leaving ciphertext no future launch could ever open; and
  // re-onboarding in the same process wrote the new identity's proofs under that
  // same dead key.
  resetWalletStorage();

  // Tray and Tor, moved to LAST on purpose.
  //
  // Neither runs before the keys and stores are gone, because both are slow:
  // dismissing the shade is a native round trip, and wiping Arti polls for its
  // process to exit before deleting a directory tree. For a gesture whose threat
  // model is a phone being taken, running them first spends the seconds that
  // matter on the notification shade and a Tor consensus cache while the keys and
  // the
  // thirteen message partitions were still on disk. Neither depends on the keys
  // existing, so both belong after the data is gone.
  // Dismiss every notification already in the shade.
  //     Each one carries a sender nickname and a message preview, and they
  //     survive the process, so a wipe that cleared the database and left the
  //     lock screen showing the last three conversations has not done what the
  //     user asked. Best-effort by design.
  // Time-boxed: both remaining steps are best-effort and run after every byte
  // is already gone, but the caller holds the confirm sheet until this resolves,
  // and wipeTorState polls for Arti to exit before deleting its directory.
  setTimeout(() => {}, 1000);
  await settleOr(dismissAllNotifications(), BEST_EFFORT_TIMEOUT_MS, undefined);

  // Stop Arti and destroy its data directory (iOS only; null elsewhere).
  //
  //     Two things survived every wipe here. Arti kept running, holding live
  //     circuits for an identity that no longer existed. And its state lives
  //     under Application Support rather than the cache, so the media sweep
  //     below never reached it: a cached consensus, the guard nodes this device
  //     chose, directory data and timestamps. That is on-disk evidence of the
  //     shape "this device used Tor, around here, around then", which is
  //     exactly the inference a panic wipe exists to destroy.
  //
  //     The module rather than tor-routing, deliberately: tor-routing pulls in
  //     the BLE native module at import, and this file has to stay loadable
  //     without a native host. Best-effort, like every other step here.
  //     The JS side goes first: the native status listener writes into the very
  //     store this wipe resets a few lines below, and the module-level routing
  //     flag would otherwise stay true while the store said false.
  teardownTorState();
  try {
    await settleOr(
      NativeAirhopTor?.wipeTorState() ?? Promise.resolve(),
      BEST_EFFORT_TIMEOUT_MS,
      undefined,
    );
  } catch {
    // Arti absent (Android), or the directory was already gone.
  }

  // Module state with a 5-minute TTL, and the wipe does not restart the
  // process: the next geohash channel would otherwise resolve from the position
  // the old identity observed.
  clearLocationCache();

  // 4. Empty the cache directory. Not just the prefixed attachments this used
  //    to clear: sent documents, sent videos, small sent images and the saved QR
  //    card all live under other names or in the pickers' own subdirectories and
  //    survived every wipe. See wipeCacheDirectory. Best-effort: a failure here
  //    must not abort the wipe, the keys and stores are already gone.
  //
  //    Awaited: it yields between batches rather than holding the thread, and
  //    awaiting it is what keeps step 5 honest.
  try {
    await wipeCacheDirectory();
  } catch {
    // Cache directory missing or unreadable: nothing to clear.
  }

  // 5. The sequence finished, so the next launch has nothing to resume.
  //
  //    Not in a `finally`, and not conditional on `keysDestroyed`: a throw on
  //    the way here means it did NOT finish, and the marker surviving is what
  //    makes the next launch pick it up. See endPanicWipe.
  endPanicWipe();

  // Whether the secrets themselves actually went. Everything else above is
  // best-effort and reported as done; this one the caller has to be able to tell
  // the user about, because "your keys are destroyed" is the single claim a
  // panic wipe must never make falsely.
  return { keysDestroyed };
}
