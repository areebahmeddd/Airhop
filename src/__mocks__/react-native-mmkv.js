// Mock for react-native-mmkv used in Jest test environments.
// The real module is a JSI native module that cannot run in Node.js.
// This mock provides the same API surface backed by a simple in-memory Map
// so store modules (wallet-store, chat-store, etc.) can be exercised in CI.

// Shared spy so tests can assert on clearAll calls across all instances.
const clearAllSpy = jest.fn();

class MMKVInstance {
  constructor() {
    this._store = new Map();
  }

  getString(key) {
    const v = this._store.get(key);
    return typeof v === "string" ? v : undefined;
  }

  set(key, value) {
    this._store.set(key, value);
  }

  // Alias used by chat-store and wallet-store mmkvStorage adapters.
  remove(key) {
    this._store.delete(key);
  }

  delete(key) {
    this._store.delete(key);
  }

  contains(key) {
    return this._store.has(key);
  }

  getAllKeys() {
    return Array.from(this._store.keys());
  }

  clearAll() {
    this._store.clear();
    clearAllSpy();
  }
}

const instanceCache = new Map();

function createMMKV({ id = "default" } = {}) {
  if (!instanceCache.has(id)) {
    instanceCache.set(id, new MMKVInstance());
  }
  return instanceCache.get(id);
}

// Allow tests to reset all instance state between runs.
function __resetAll() {
  instanceCache.clear();
}

module.exports = { createMMKV, __resetAll, __mockClearAll: clearAllSpy };
