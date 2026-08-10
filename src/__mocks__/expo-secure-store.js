// Mock for expo-secure-store used in Jest test environments.
// The real module talks to the iOS Keychain / Android Keystore; tests use an
// in-memory map instead.
//
// `__reset` empties the map and reinstalls the default implementations, so a
// test that stubs a failing call does not leak it into the next one. Test-only:
// the real module has no clear-all, which is why keychain.ts enumerates.
const store = new Map();

const getItemAsync = jest.fn();
const setItemAsync = jest.fn();
const deleteItemAsync = jest.fn();
const isAvailableAsync = jest.fn();
const getItem = jest.fn();
const setItem = jest.fn();

function installDefaults() {
  getItemAsync.mockImplementation(async (key) => store.get(key) ?? null);
  setItemAsync.mockImplementation(async (key, value) => {
    store.set(key, value);
  });
  deleteItemAsync.mockImplementation(async (key) => {
    store.delete(key);
  });
  isAvailableAsync.mockImplementation(async () => true);
  getItem.mockImplementation((key) => store.get(key) ?? null);
  setItem.mockImplementation((key, value) => {
    store.set(key, value);
  });
}

installDefaults();

module.exports = {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
  isAvailableAsync,
  // Synchronous variants, for parity with the real module's surface.
  getItem,
  setItem,
  // keychain.ts reads one at module scope, so these must exist or importing it
  // throws before any test runs. Values match the real module; nothing asserts
  // on them.
  AFTER_FIRST_UNLOCK: 1,
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 2,
  ALWAYS: 3,
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 4,
  ALWAYS_THIS_DEVICE_ONLY: 5,
  WHEN_UNLOCKED: 0,
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
  __reset: () => {
    store.clear();
    for (const fn of [
      getItemAsync,
      setItemAsync,
      deleteItemAsync,
      isAvailableAsync,
      getItem,
      setItem,
    ]) {
      fn.mockClear();
    }
    installDefaults();
  },
};
