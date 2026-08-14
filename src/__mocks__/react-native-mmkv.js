// Jest mock for react-native-mmkv, backed by an in-memory Map.
//
// The real module is a JSI native module that cannot run in node, so without
// this no store module (wallet-store, chat-store and the rest) is testable.

// Shared across instances so a test can assert on clearAll wherever it happened.
const clearAllSpy = jest.fn();

class MMKVInstance {
  constructor() {
    this._store = new Map();
  }

  getString(key) {
    const v = this._store.get(key);
    return typeof v === "string" ? v : undefined;
  }

  getNumber(key) {
    const v = this._store.get(key);
    return typeof v === "number" ? v : undefined;
  }

  getBoolean(key) {
    const v = this._store.get(key);
    return typeof v === "boolean" ? v : undefined;
  }

  set(key, value) {
    this._store.set(key, value);
  }

  // Alias for delete, which the chat-store and wallet-store adapters call.
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

// Instance deletion, which the panic wipe uses for the encrypted wallet store:
// that partition cannot be reopened once its key is gone, so it is deleted
// rather than cleared.
function deleteMMKV(id) {
  return instanceCache.delete(id);
}

function existsMMKV(id) {
  return instanceCache.has(id);
}

function __resetAll() {
  instanceCache.clear();
}

module.exports = {
  createMMKV,
  deleteMMKV,
  existsMMKV,
  __resetAll,
  __mockClearAll: clearAllSpy,
};
