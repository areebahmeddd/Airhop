/**
 * @jest-environment node
 */

// Imports come first in source; Babel hoists jest.mock() calls above them.
import { wipeAllSecrets } from "../../core/crypto/keychain";
import { wipeCacheDirectory } from "../../services/file-transfer-service";
import { dismissAllNotifications } from "../../services/notification-service";
import { setNutzapWatcher } from "../../services/nutzap-watcher-handle";
import { useChatStore } from "../../store/chat-store";
import { useMeshStateStore } from "../../store/mesh-state-store";
import { WALLET_STORAGE_ID } from "../../store/wallet-store";
import { MMKV_STORE_IDS, panicWipe } from "../panic-wipe";
import {
  currentWipeGeneration,
  isCurrentWipeGeneration,
} from "../wipe-generation";

// wipeAllSecrets reaches the Keychain/Keystore; mock it out in tests. Only that
// one export: KEYCHAIN_ITEMS is read at module scope by wallet-store and
// wallet-service, so replacing the whole module leaves those reading a property
// off undefined before a single test runs.
jest.mock("../../core/crypto/keychain", () => ({
  ...jest.requireActual("../../core/crypto/keychain"),
  wipeAllSecrets: jest.fn().mockResolvedValue(undefined),
}));

// The cache wipe touches expo-file-system; mock the whole module so the test
// stays a pure unit and can assert the wipe was invoked.
jest.mock("../../services/file-transfer-service", () => ({
  wipeCacheDirectory: jest.fn(),
}));

// Dismissing the tray reaches expo-notifications, which registers push
// listeners at import. Mocked so this stays a unit test of the wipe and does not
// depend on a notifications runtime.
jest.mock("../../services/notification-service", () => ({
  dismissAllNotifications: jest.fn().mockResolvedValue(undefined),
}));

// Provide a full in-memory MMKV implementation so Zustand's persist middleware
// (which calls getString/set/remove) works correctly, while still exposing a
// shared clearAll spy so tests can assert on it.
jest.mock("react-native-mmkv", () => {
  const clearAll = jest.fn();

  class MockMMKV {
    private _store = new Map<string, string>();
    getString(key: string): string | undefined {
      return this._store.get(key);
    }
    set(key: string, value: string): void {
      this._store.set(key, value);
    }
    remove(key: string): void {
      this._store.delete(key);
    }
    clearAll(): void {
      this._store.clear();
      clearAll();
    }
  }

  const instances = new Map<string, MockMMKV>();
  return {
    createMMKV: ({ id = "default" }: { id?: string } = {}) => {
      if (!instances.has(id)) instances.set(id, new MockMMKV());
      return instances.get(id)!;
    },
    // The encrypted wallet store is removed with deleteMMKV, not clearAll, so
    // the mock has to expose it for the wipe to be assertable.
    deleteMMKV: jest.fn(() => true),
    __mockClearAll: clearAll,
  };
});

const mockClearKeys = wipeAllSecrets as jest.Mock;
const mmkvMock = jest.requireMock("react-native-mmkv") as {
  __mockClearAll: jest.Mock;
  deleteMMKV: jest.Mock;
};
const mockClearAll = mmkvMock.__mockClearAll;
const deleteMMKV = mmkvMock.deleteMMKV;

beforeEach(() => {
  mockClearKeys.mockClear();
  mockClearAll.mockClear();
  deleteMMKV.mockClear();
  (wipeCacheDirectory as jest.Mock).mockClear();
  mockClearKeys.mockResolvedValue(undefined);
});

describe("panicWipe", () => {
  test("calls identity.panicWipe to clear private keys", async () => {
    await panicWipe();
    expect(mockClearKeys).toHaveBeenCalledTimes(1);
  });

  test("clears all MMKV partitions", async () => {
    await panicWipe();
    // One clearAll call per persisted store: chat-store + wallet-store + blocked-store.
    // Derived from the constant, not hardcoded: adding a persisted store must
    // extend the wipe, and this assertion should follow it automatically rather
    // than failing and inviting someone to just bump the number.
    expect(mockClearAll).toHaveBeenCalledTimes(MMKV_STORE_IDS.length);
  });

  test("clears keys before MMKV (order: secure first)", async () => {
    const callOrder: string[] = [];
    mockClearKeys.mockImplementation(() => {
      callOrder.push("keys");
      return Promise.resolve();
    });
    mockClearAll.mockImplementation(() => {
      callOrder.push("mmkv");
    });

    await panicWipe();

    expect(callOrder[0]).toBe("keys");
    expect(callOrder.filter((x) => x === "mmkv").length).toBe(
      MMKV_STORE_IDS.length,
    );
  });

  test("empties the whole cache directory, not just prefixed attachments", async () => {
    // Prefix matching missed sent documents, sent videos, in-budget images and
    // the saved QR card, all of which survived every wipe.
    await panicWipe();
    expect(wipeCacheDirectory).toHaveBeenCalledTimes(1);
  });

  test("reports the keys as destroyed on success", async () => {
    await expect(panicWipe()).resolves.toEqual({ keysDestroyed: true });
  });

  test("finishes the wipe even when the keychain refuses, and says so", async () => {
    // A locked Keychain is the seizure case this gesture exists for. The bare
    // await here used to abandon every step below it, leaving all thirteen MMKV
    // partitions, the wallet file and the media cache intact while the caller
    // surfaced nothing at all.
    mockClearKeys.mockRejectedValue(new Error("keychain locked"));

    const result = await panicWipe();

    expect(result.keysDestroyed).toBe(false);
    expect(mockClearAll).toHaveBeenCalledTimes(MMKV_STORE_IDS.length);
    expect(deleteMMKV).toHaveBeenCalledWith(WALLET_STORAGE_ID);
    expect(wipeCacheDirectory).toHaveBeenCalledTimes(1);
  });

  test("takes delivered notifications out of the tray", async () => {
    // They carry a sender name and a message preview, live in the system tray
    // rather than in any store, and survive the process.
    await panicWipe();
    expect(dismissAllNotifications).toHaveBeenCalled();
  });

  test("wipes every sensitive persisted store, including the activity feed", () => {
    // Message previews and sender names live in the activity feed, so it must
    // be part of the wipe alongside chats, contacts, blocks and outbox.
    for (const id of [
      "chat-store",
      "blocked-store",
      "outbox-store",
      "contacts-store",
      "activity-store",
      "settings-store",
    ]) {
      expect(MMKV_STORE_IDS).toContain(id);
    }
  });

  test("deletes the encrypted wallet store rather than clearing it", async () => {
    // The wallet file is AES-256 encrypted, so reopening it without the key to
    // call clearAll() is unreliable. It is removed with deleteMMKV instead.
    await panicWipe();
    expect(deleteMMKV).toHaveBeenCalledWith(WALLET_STORAGE_ID);
    // It must never appear in the plain clearAll list, or the wipe would depend
    // on being able to decrypt what it is trying to destroy.
    expect(MMKV_STORE_IDS).not.toContain(WALLET_STORAGE_ID);
  });

  test("stops the live nutzap subscription", async () => {
    // It holds this identity's Nostr private key in a closure and a relay
    // subscription under its pubkey. Both outlive the wipe unless it is
    // stopped explicitly - the stores and the keychain are cleared around it,
    // and neither touches a running subscription.
    const stop = jest.fn();
    setNutzapWatcher(stop);
    await panicWipe();
    expect(stop).toHaveBeenCalled();
  });

  test("invalidates startup work that was already in flight", async () => {
    // Stopping the watcher only reaches one already installed. A wipe during
    // the wallet unlock or relay publish is followed by the in-flight startup
    // installing a subscription on the identity just destroyed.
    const captured = currentWipeGeneration();
    expect(isCurrentWipeGeneration(captured)).toBe(true);
    await panicWipe();
    expect(isCurrentWipeGeneration(captured)).toBe(false);
  });

  test("resets transport health so the Mesh tab shows a first-run state", async () => {
    useMeshStateStore.setState({
      bleBlocker: "adapter-off",
      blePermissionBlocked: true,
      presenceStatus: "away",
      nostrConnected: true,
    });
    await panicWipe();
    const s = useMeshStateStore.getState();
    expect(s.bleBlocker).toBe("starting");
    expect(s.blePermissionBlocked).toBe(false);
    expect(s.presenceStatus).toBe("online");
    expect(s.nostrConnected).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Chat persistence is throttled: a write sits in a 400ms window holding a
// complete plaintext snapshot of every thread in memory, armed to put it back
// on disk. A wipe that clears the store and the file but leaves that snapshot
// armed is a wipe with a queued write of the data it just destroyed.
describe("panic wipe and the persistence throttle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("a pending chat write cannot land after the wipe", async () => {
    useChatStore.getState().addChannel("#bluetooth");
    useChatStore.getState().addMessage({
      id: "m1",
      channel: "#bluetooth",
      senderID: "aabbccdd00112233",
      senderNickname: "alice",
      text: "the meeting is at four",
      timestampMs: Date.now(),
      isMine: false,
    });

    await panicWipe();

    // Run every timer the throttle could possibly have left armed, then read
    // the file back the way a forensic tool would.
    jest.runOnlyPendingTimers();

    const { createMMKV } = require("react-native-mmkv") as {
      createMMKV: (o: { id: string }) => {
        getString(k: string): string | undefined;
      };
    };
    const raw = createMMKV({ id: "chat-store" }).getString("airhop-chat") ?? "";
    expect(raw).not.toContain("the meeting is at four");
    expect(useChatStore.getState().messages).toEqual({});
  });
});
