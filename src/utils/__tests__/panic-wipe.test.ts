/**
 * @jest-environment node
 */

// Imports come first in source; Babel hoists jest.mock() calls above them.
import { panicWipe as identityPanicWipe } from "../../core/crypto/identity";
import { panicWipe } from "../panic-wipe";

// Mocks are hoisted before variable declarations by Babel. We call jest.fn()
// inside each factory so the functions are always valid when the module loads.
jest.mock("../../core/crypto/identity", () => ({
  panicWipe: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("react-native-mmkv", () => {
  const clearAll = jest.fn();
  const instances = new Map<string, { clearAll: jest.Mock }>();
  return {
    createMMKV: ({ id }: { id: string }) => {
      if (!instances.has(id)) instances.set(id, { clearAll });
      return instances.get(id)!;
    },
    // Expose the shared clearAll mock so tests can assert on it.
    __mockClearAll: clearAll,
  };
});

// Convenience aliases for the mocks created inside the factories above.
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
    expect(mockClearAll.mock.calls.length).toBe(2);
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
