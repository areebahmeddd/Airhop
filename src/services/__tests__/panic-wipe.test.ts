/**
 * @jest-environment node
 */

// Imports come first in source; Babel hoists jest.mock() calls above them.
import { wipeAllSecrets } from "@core/crypto/keychain";
import { useChatStore } from "@store/chat-store";
import { useMeshStateStore } from "@store/mesh-state-store";
import {
  bootstrapWalletStorage,
  resetWalletStorage,
  WALLET_STORAGE_ID,
} from "@store/wallet-store";
import { wipeCacheDirectory } from "../file-transfer-service";
import { dismissAllNotifications } from "../notification-service";
import { setNutzapWatcher } from "../nutzap-watcher-handle";
import { MMKV_STORE_IDS, panicWipe } from "../panic-wipe";
import {
  currentWipeGeneration,
  isCurrentWipeGeneration,
} from "../wipe-generation";
import { endPanicWipe, isPanicWipePending } from "../wipe-marker";

// wipeAllSecrets reaches the Keychain/Keystore; mock it out in tests. Only that
// one export: KEYCHAIN_ITEMS is read at module scope by wallet-store and
// wallet-service, so replacing the whole module leaves those reading a property
// off undefined before a single test runs.
jest.mock("@core/crypto/keychain", () => ({
  ...jest.requireActual("@core/crypto/keychain"),
  wipeAllSecrets: jest.fn().mockResolvedValue(undefined),
}));

// The cache wipe touches expo-file-system; mock the whole module so the test
// stays a pure unit and can assert the wipe was invoked.
jest.mock("../file-transfer-service", () => ({
  wipeCacheDirectory: jest.fn().mockResolvedValue(undefined),
}));

// Dismissing the tray reaches expo-notifications, which registers push
// listeners at import. Mocked so this stays a unit test of the wipe and does not
// depend on a notifications runtime.
jest.mock("../notification-service", () => ({
  dismissAllNotifications: jest.fn().mockResolvedValue(undefined),
}));

// Provide a full in-memory MMKV implementation so Zustand's persist middleware
// (which calls getString/set/remove) works correctly, while still exposing a
// shared clearAll spy so tests can assert on it.
jest.mock("react-native-mmkv", () => {
  const clearAll = jest.fn();
  const opened: string[] = [];

  class MockMMKV {
    // A plain field, not a constructor parameter property: Babel hoists this
    // factory above the imports and reads the shorthand's `id` as an
    // out-of-scope variable.
    readonly id: string;
    constructor(id: string) {
      this.id = id;
    }
    private _store = new Map<string, unknown>();
    getString(key: string): string | undefined {
      return this._store.get(key) as string | undefined;
    }
    // The wipe marker is a boolean, and it is the one value in the app read
    // back through this rather than through Zustand's persist middleware.
    getBoolean(key: string): boolean | undefined {
      return this._store.get(key) as boolean | undefined;
    }
    set(key: string, value: string | boolean): void {
      this._store.set(key, value);
    }
    remove(key: string): void {
      this._store.delete(key);
    }
    clearAll(): void {
      this._store.clear();
      clearAll(this.id);
    }
  }

  const instances = new Map<string, MockMMKV>();
  return {
    createMMKV: ({ id = "default" }: { id?: string } = {}) => {
      // Every call, not every distinct id: a second handle to a partition
      // another module holds is the failure worth asserting on.
      opened.push(id);
      if (!instances.has(id)) instances.set(id, new MockMMKV(id));
      return instances.get(id)!;
    },
    // Only reached for a wallet partition nothing ever opened; an open one is
    // cleared through its own handle instead.
    deleteMMKV: jest.fn(() => true),
    __mockClearAll: clearAll,
    __mockOpened: opened,
  };
});

const mockClearKeys = wipeAllSecrets as jest.Mock;
const mmkvMock = jest.requireMock("react-native-mmkv") as {
  __mockClearAll: jest.Mock;
  __mockOpened: string[];
  deleteMMKV: jest.Mock;
};
const mockClearAll = mmkvMock.__mockClearAll;
const deleteMMKV = mmkvMock.deleteMMKV;

function clearedPartitions(): string[] {
  return mockClearAll.mock.calls.map((call) => String(call[0]));
}

beforeEach(() => {
  mockClearKeys.mockClear();
  mockClearAll.mockClear();
  deleteMMKV.mockClear();
  (wipeCacheDirectory as jest.Mock).mockClear();
  (wipeCacheDirectory as jest.Mock).mockResolvedValue(undefined);
  mockClearKeys.mockResolvedValue(undefined);
  // The mock MMKV keeps one instance per id for the whole file, so the marker
  // outlives a test the way it outlives a process. Each case starts from "no
  // wipe was interrupted".
  endPanicWipe();
});

// One case below drives the keychain timeout with fake timers. Restored here
// rather than in that test: a mid-test failure skips the rest of its body, and
// leaked fake timers then fail every case after it for an unrelated reason.
afterEach(() => {
  jest.useRealTimers();
});

describe("panicWipe", () => {
  test("calls identity.panicWipe to clear private keys", async () => {
    await panicWipe();
    expect(mockClearKeys).toHaveBeenCalledTimes(1);
  });

  test("clears every persisted partition, by name", async () => {
    await panicWipe();
    // Asserted by id rather than by count. Derived from the constant, so adding
    // a persisted store extends this automatically rather than failing and
    // inviting someone to bump a number.
    expect(clearedPartitions()).toEqual(
      expect.arrayContaining([...MMKV_STORE_IDS]),
    );
    // And the wallet, which is encrypted and clears itself through the handle
    // it owns rather than being deleted from under one.
    expect(clearedPartitions()).toContain(WALLET_STORAGE_ID);
  });

  test("opens one handle per partition, never a second", async () => {
    // Two handles over one file do not share its cached meta info, so clearing
    // through one and writing through the other segfaults the process. Nothing
    // in JS catches that, so the wipe dies partway and the marker replays it.
    mmkvMock.__mockOpened.length = 0;

    await panicWipe();

    const counts = new Map<string, number>();
    for (const id of mmkvMock.__mockOpened) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    expect([...counts.entries()].filter(([, n]) => n > 1)).toEqual([]);
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
    expect(callOrder.filter((x) => x === "mmkv").length).toBeGreaterThanOrEqual(
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

  test("reports the keys as not destroyed when the keychain never answers", async () => {
    // A Keystore that stalls does not reject, it goes quiet, which the
    // try/catch cannot see. Only the deadline separates it from a slow success.
    jest.useFakeTimers();
    mockClearKeys.mockReturnValue(new Promise(() => undefined));

    const wipe = panicWipe();
    await jest.advanceTimersByTimeAsync(10_000);
    const result = await wipe;

    expect(result.keysDestroyed).toBe(false);
    // And the rest of the sequence still ran, rather than waiting behind it.
    expect(clearedPartitions()).toEqual(
      expect.arrayContaining([...MMKV_STORE_IDS]),
    );
    expect(wipeCacheDirectory).toHaveBeenCalledTimes(1);
  });

  test("marks a wipe as pending before it destroys anything", async () => {
    // Written before the first destructive step or it guarantees nothing: a
    // process that dies between the keys going and the stores going is exactly
    // the case it exists for.
    let pendingWhenKeysWent = false;
    mockClearKeys.mockImplementation(() => {
      pendingWhenKeysWent = isPanicWipePending();
      return Promise.resolve();
    });

    await panicWipe();

    expect(pendingWhenKeysWent).toBe(true);
  });

  test("clears the marker only once the last step has finished", async () => {
    // After the media cache, not after the stores: the cache walk is the
    // longest step and the likeliest to be interrupted.
    let pendingDuringCacheWipe = false;
    (wipeCacheDirectory as jest.Mock).mockImplementation(() => {
      pendingDuringCacheWipe = isPanicWipePending();
      return Promise.resolve();
    });

    await panicWipe();

    expect(pendingDuringCacheWipe).toBe(true);
    expect(isPanicWipePending()).toBe(false);
  });

  test("leaves the marker set when the wipe is interrupted", async () => {
    // Storage failing partway stands in for the real case, a killed process.
    // Either way the sequence did not finish, so the flag must survive.
    mockClearAll.mockImplementationOnce(() => {
      throw new Error("storage went away");
    });

    await expect(panicWipe()).rejects.toThrow();

    expect(isPanicWipePending()).toBe(true);
  });

  test("clears the marker even when the keychain refused the keys", async () => {
    // The marker means "the sequence did not finish", not "the keys are gone".
    // Holding it for surviving keys, which retry separately, would replay the
    // wipe over the identity the user creates next and destroy it.
    mockClearKeys.mockRejectedValue(new Error("keychain locked"));

    const result = await panicWipe();

    expect(result.keysDestroyed).toBe(false);
    expect(isPanicWipePending()).toBe(false);
  });

  test("finishes the wipe even when the keychain refuses, and says so", async () => {
    // A locked Keychain is the seizure case this gesture exists for. The bare
    // await here used to abandon every step below it, leaving all thirteen MMKV
    // partitions, the wallet file and the media cache intact while the caller
    // surfaced nothing at all.
    mockClearKeys.mockRejectedValue(new Error("keychain locked"));

    const result = await panicWipe();

    expect(result.keysDestroyed).toBe(false);
    expect(clearedPartitions()).toEqual(
      expect.arrayContaining([...MMKV_STORE_IDS]),
    );
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

  test("destroys an open wallet through its own handle, not by deleting it", async () => {
    // Deleting the file frees the native instance while the async persist
    // adapter still holds it, and the write its own clearAll schedules then
    // lands on freed memory.
    await bootstrapWalletStorage();

    await panicWipe();

    expect(clearedPartitions()).toContain(WALLET_STORAGE_ID);
    expect(deleteMMKV).not.toHaveBeenCalled();
    // It must never appear in the plain clearAll list, or the wipe would depend
    // on being able to decrypt what it is trying to destroy.
    expect(MMKV_STORE_IDS).not.toContain(WALLET_STORAGE_ID);
  });

  test("deletes the wallet partition when nothing ever opened it", async () => {
    // No handle, no race, and deleting is the only option for a wallet that was
    // never unlocked on this device.
    resetWalletStorage();

    await panicWipe();

    expect(deleteMMKV).toHaveBeenCalledWith(WALLET_STORAGE_ID);
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
