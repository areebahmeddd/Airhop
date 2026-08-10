/**
 * @jest-environment node
 */
// expo-secure-store has no clear-all, so the panic wipe destroys exactly the
// items this registry lists. A secret missing from it survives the wipe, so
// these pin the properties the wipe depends on.

import * as SecureStore from "expo-secure-store";
import {
  deleteSecret,
  KEYCHAIN_ITEMS,
  readSecret,
  wipeAllSecrets,
  writeSecret,
  type KeychainItem,
} from "../keychain";

const mock = SecureStore as unknown as {
  __reset: () => void;
  deleteItemAsync: jest.Mock;
};

const ALL_ITEMS = Object.values(KEYCHAIN_ITEMS) as KeychainItem[];

// Also restores default behaviour, so a test that stubs a failing delete does
// not leak it into the next one.
beforeEach(() => {
  mock.__reset();
});

describe("item names", () => {
  it("are accepted by SecureStore's key grammar", () => {
    // SecureStore throws on a key outside [A-Za-z0-9._-]. A bad name compiles
    // and fails on the first write on device.
    for (const item of ALL_ITEMS) {
      expect(item).toMatch(/^[A-Za-z0-9._-]+$/);
    }
  });

  it("are distinct, so no two secrets share an address", () => {
    expect(new Set(ALL_ITEMS).size).toBe(ALL_ITEMS.length);
  });

  it("carry the versioned namespace", () => {
    // `airhop.<domain>.<thing>.v1`: the suffix lets a format change be a new
    // name rather than old bytes read as a new shape.
    for (const item of ALL_ITEMS) {
      expect(item).toMatch(/^airhop\..+\.v\d+$/);
    }
  });
});

describe("round trip", () => {
  it("reads back what was written", async () => {
    await writeSecret(KEYCHAIN_ITEMS.identity, "value");
    expect(await readSecret(KEYCHAIN_ITEMS.identity)).toBe("value");
  });

  it("reports an absent item as null rather than empty string", async () => {
    // loadIdentity reads null as "first launch".
    expect(await readSecret(KEYCHAIN_ITEMS.identity)).toBeNull();
  });

  it("removes a deleted item", async () => {
    await writeSecret(KEYCHAIN_ITEMS.walletP2pkKey, "abc");
    await deleteSecret(KEYCHAIN_ITEMS.walletP2pkKey);
    expect(await readSecret(KEYCHAIN_ITEMS.walletP2pkKey)).toBeNull();
  });
});

describe("wipeAllSecrets", () => {
  it("destroys every item in the registry", async () => {
    for (const item of ALL_ITEMS) await writeSecret(item, "secret");

    await wipeAllSecrets();

    for (const item of ALL_ITEMS) {
      expect(await readSecret(item)).toBeNull();
    }
  });

  it("asks the keychain for every item, not just the ones that exist", async () => {
    // Never read-then-delete: a read can fail on a keychain that would still
    // accept the delete.
    await wipeAllSecrets();
    const asked = mock.deleteItemAsync.mock.calls.map((c) => c[0] as string);
    expect(asked.sort()).toEqual([...ALL_ITEMS].sort());
  });

  it("throws when an item could not be destroyed", async () => {
    // panic-wipe turns this into `keysDestroyed: false`.
    mock.deleteItemAsync.mockImplementation(async (key: string) => {
      if (key === KEYCHAIN_ITEMS.identity) throw new Error("keychain locked");
    });
    await expect(wipeAllSecrets()).rejects.toThrow();
  });

  it("still attempts the rest after one item fails", async () => {
    // A keychain that refuses one value may release the next.
    mock.deleteItemAsync.mockImplementation(async (key: string) => {
      if (key === KEYCHAIN_ITEMS.identity) throw new Error("keychain locked");
    });

    await expect(wipeAllSecrets()).rejects.toThrow();

    const asked = mock.deleteItemAsync.mock.calls.map((c) => c[0] as string);
    expect(asked.sort()).toEqual([...ALL_ITEMS].sort());
  });
});
