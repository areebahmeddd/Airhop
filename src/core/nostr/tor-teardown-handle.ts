// How to tear down live Tor state, held where the panic wipe can reach it.
//
// Same shape, and the same reason, as nutzap-watcher-handle. tor-routing owns
// the native status subscription and the module-level "is Tor routing" flag, but
// it reaches the mesh service at import time, and panic-wipe.ts has to stay
// loadable without a native host. A module with no imports of its own sits
// between them and belongs to neither.
//
// What survived a wipe without this: the native TorStatusChanged listener, whose
// callback keeps writing into the store the wipe has just reset, and the module
// flag, which stayed true while the store said false. Neither is dangerous on
// its own - Arti is stopped by then, so no event is coming - but a wipe that
// leaves live listeners and disagreeing copies of a privacy flag has not
// finished, and this file exists so the next thing added here is covered too.

type TeardownFn = () => void;

let teardown: TeardownFn | null = null;

// Registered by tor-routing when it first installs a watcher.
export function setTorTeardown(next: TeardownFn | null): void {
  teardown = next;
}

// Drop the status subscription and reset the routing flag. Safe to call when
// nothing is installed, and on Android, where there is no Arti to watch.
export function teardownTorState(): void {
  try {
    teardown?.();
  } catch {
    // The subscription was already removed, or the native module has gone.
  }
}
