/**
 * @jest-environment node
 */

// Imports come first in source; Babel hoists jest.mock() calls above them.
import { panicWipe as identityPanicWipe } from "../../core/crypto/identity";
import { panicWipe } from "../panic-wipe";

// identity.panicWipe wipes the Keychain/Keystore; mock it out in tests.
jest.mock("../../core/crypto/identity", () => ({
  panicWipe: jest.fn().mockResolvedValue(undefined),
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
    __mockClearAll: clearAll,
  };
});

const mockClearKeys = identityPanicWipe as jest.Mock;
const mockClearAll = (
  jest.requireMock("react-native-mmkv") as { __mockClearAll: jest.Mock }
).__mockClearAll;

beforeEach(() => {
  mockClearKeys.mockClear();
  mockClearAll.mockClear();
});

describe("panicWipe", () => {
  test("calls identity.panicWipe to clear private keys", async () => {
    await panicWipe();
    expect(mockClearKeys).toHaveBeenCalledTimes(1);
  });

  test("clears all MMKV partitions", async () => {
    await panicWipe();
    // One clearAll call per persisted store: chat-store + wallet-store.
    expect(mockClearAll).toHaveBeenCalledTimes(2);
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
    expect(callOrder.filter((x) => x === "mmkv").length).toBe(2);
  });

  test("resolves (does not throw) on success", async () => {
    await expect(panicWipe()).resolves.toBeUndefined();
  });
});
