// One MMKV handle per partition, for the whole app.
//
// Each instance caches its own view of the file: meta info, the CRC, and where
// the next write goes, and two instances over one partition do not share it.
// Clearing through one rewrites the file underneath the other, whose next write
// reloads the stale meta info and dies with SIGSEGV in
// MMKV::loadMetaInfoAndCheck. No JS catch can see a native segfault.
//
// So handles come from here, and nothing calls createMMKV directly for a
// partition another module also opens. The wallet is the exception: it is
// AES-256 encrypted and its handle carries the key, so it owns its own (see
// store/wallet-store).

import { createMMKV } from "react-native-mmkv";

type Storage = ReturnType<typeof createMMKV>;

const handles = new Map<string, Storage>();

export function getStorage(id: string): Storage {
  let handle = handles.get(id);
  if (handle === undefined) {
    handle = createMMKV({ id });
    handles.set(id, handle);
  }
  return handle;
}
