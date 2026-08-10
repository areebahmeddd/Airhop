/**
 * @jest-environment node
 */
// The launch sweep that makes a failed panic wipe retry itself.
//
// The wipe most likely to fail is the one that matters. Items are stored
// AFTER_FIRST_UNLOCK, so a phone that has booted but not been unlocked refuses
// both deletes and reads - which is exactly the seizure the gesture exists for.
// Nothing used to try again: the wipe failed once, said so in an alert, and the
// keys stayed for the life of the device.
//
// The properties that matter:
//   * A launch with no identity deletes the secrets that no longer have an
//     owner, because with no identity none of them does.
//   * The identity is never touched. The sweep is not awaited, and onboarding
//     writes an identity moments later; a delete still in flight would destroy
//     the key the user just created.
//   * "Leftovers" is only ever claimed when one is positively read back. A
//     keychain that refuses everything is unreadable, not dirty, and saying
//     otherwise would put an alarm about data at rest in front of somebody
//     whose phone is merely locked.
//   * A first install - the overwhelmingly common case - is a silent no-op.

const mockDelete = jest.fn<Promise<void>, [string]>();
const mockGet = jest.fn<Promise<string | null>, [string]>();

jest.mock("expo-secure-store", () => ({
  __esModule: true,
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: "afterFirstUnlockThisDeviceOnly",
  deleteItemAsync: (key: string) => mockDelete(key),
  getItemAsync: (key: string) => mockGet(key),
  setItemAsync: () => Promise.resolve(),
}));

import { KEYCHAIN_ITEMS, sweepOrphanedSecrets } from "../keychain";

// Everything the sweep may touch: the registry minus the identity, which
// onboarding is about to write and which must survive an in-flight sweep.
const ORPHANABLE = Object.values(KEYCHAIN_ITEMS).filter(
  (item) => item !== KEYCHAIN_ITEMS.identity,
);

beforeEach(() => {
  mockDelete.mockReset();
  mockGet.mockReset();
});

describe("sweepOrphanedSecrets", () => {
  it("deletes the orphaned secrets, since none of them has an owner", async () => {
    mockDelete.mockResolvedValue(undefined);

    await expect(sweepOrphanedSecrets()).resolves.toBe(false);

    expect(mockDelete.mock.calls.map(([key]) => key).sort()).toEqual(
      [...ORPHANABLE].sort(),
    );
    // Nothing was refused, so there is nothing to read back and nothing to say.
    expect(mockGet).not.toHaveBeenCalled();
  });

  // The race this ordering exists to avoid: the caller does not await the sweep,
  // and onboarding writes an identity moments later. A delete landing after that
  // would destroy the key the user just made and leave an app that cannot start.
  it("never touches the identity, which onboarding is about to write", async () => {
    mockDelete.mockResolvedValue(undefined);
    mockGet.mockResolvedValue(null);

    await sweepOrphanedSecrets();

    expect(mockDelete).not.toHaveBeenCalledWith(KEYCHAIN_ITEMS.identity);
    expect(mockGet).not.toHaveBeenCalledWith(KEYCHAIN_ITEMS.identity);
  });

  // And it must not report one either: a surviving identity is exactly what a
  // returning user has, and the caller reaches here on a read that already
  // failed once.
  it("does not report a surviving identity as a leftover", async () => {
    mockDelete.mockRejectedValue(new Error("keystore refused"));
    mockGet.mockImplementation((key) =>
      key === KEYCHAIN_ITEMS.identity
        ? Promise.resolve("an identity nobody asked us about")
        : Promise.resolve(null),
    );

    await expect(sweepOrphanedSecrets()).resolves.toBe(false);
  });

  it("is a silent no-op on a first install", async () => {
    // Deleting an absent item resolves; this is the ordinary launch.
    mockDelete.mockResolvedValue(undefined);
    await expect(sweepOrphanedSecrets()).resolves.toBe(false);
  });

  it("reports leftovers when a refused delete leaves something readable", async () => {
    mockDelete.mockImplementation((key) =>
      key === KEYCHAIN_ITEMS.walletRecoveryPhrase
        ? Promise.reject(new Error("keystore refused"))
        : Promise.resolve(),
    );
    mockGet.mockImplementation((key) =>
      key === KEYCHAIN_ITEMS.walletRecoveryPhrase
        ? Promise.resolve("twelve words that should not still be here")
        : Promise.resolve(null),
    );

    await expect(sweepOrphanedSecrets()).resolves.toBe(true);
  });

  // The locked-phone case. Everything refuses, so we know nothing about what is
  // on disk - and an alarm we cannot substantiate is the wrong end of the
  // trade: it would tell someone their wipe failed when it may well not have.
  it("stays quiet when the keychain refuses reads as well as deletes", async () => {
    mockDelete.mockRejectedValue(new Error("keystore locked"));
    mockGet.mockRejectedValue(new Error("keystore locked"));

    await expect(sweepOrphanedSecrets()).resolves.toBe(false);
  });

  // A delete can be refused for a secret that was already gone. Nothing
  // survived, so there is nothing to warn about.
  it("stays quiet when a refused delete leaves nothing behind", async () => {
    mockDelete.mockRejectedValue(new Error("keystore refused"));
    mockGet.mockResolvedValue(null);

    await expect(sweepOrphanedSecrets()).resolves.toBe(false);
  });

  // One item resisting must not stop the others going: a keychain that refuses
  // one value may well release the next.
  it("attempts every item even after one is refused", async () => {
    mockDelete.mockImplementation((key) =>
      key === KEYCHAIN_ITEMS.walletEncryptionKey
        ? Promise.reject(new Error("keystore refused"))
        : Promise.resolve(),
    );
    mockGet.mockResolvedValue(null);

    await sweepOrphanedSecrets();

    expect(mockDelete.mock.calls.map(([key]) => key).sort()).toEqual(
      [...ORPHANABLE].sort(),
    );
  });
});
