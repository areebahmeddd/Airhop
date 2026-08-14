// Jest mock for expo-secure-store, backed by an in-memory map rather than the
// iOS Keychain or Android Keystore.
//
// `__reset` empties the map and reinstalls the defaults, so a test that stubs a
// failing call does not leak it into the next one. It is test-only: the real
// module has no clear-all, which is why keychain.ts enumerates its items.
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
  // keychain.ts reads one of these at module scope, so they must exist or
  // importing it throws before any test runs. Values match the real module,
  // ordered by value; nothing asserts on them.
  WHEN_UNLOCKED: 0,
  AFTER_FIRST_UNLOCK: 1,
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 2,
  ALWAYS: 3,
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 4,
  ALWAYS_THIS_DEVICE_ONLY: 5,
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
