// Mock for react-native-encrypted-storage used in Jest test environments.
// The real module talks to iOS Keychain / Android Keystore; in tests we use
// an in-memory map so identity.ts can be exercised without a native host.
const store = new Map();

const EncryptedStorage = {
  setItem: jest.fn(async (key, value) => {
    store.set(key, value);
  }),
  getItem: jest.fn(async (key) => {
    return store.get(key) ?? null;
  }),
  removeItem: jest.fn(async (key) => {
    store.delete(key);
  }),
  clear: jest.fn(async () => {
    store.clear();
  }),
};

module.exports = EncryptedStorage;
module.exports.default = EncryptedStorage;
