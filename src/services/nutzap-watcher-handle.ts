// The live NIP-61 nutzap subscription, held where both the startup path and the
// panic wipe can reach it.
//
// It used to live at module scope in App.tsx, which meant only App.tsx could
// stop it - and the only thing that did was the NEXT successful startup
// replacing it. A panic wipe destroys the mesh, the keys and every store, but
// left this running: a subscription against the wiped identity, holding that
// identity's Nostr private key alive in a closure for the rest of the process.
// That is precisely what the wipe exists to prevent, so the handle lives here
// instead, in a module with no imports of its own and therefore no cycle.

type StopFn = () => void;

let stop: StopFn | null = null;

// Install the current watcher, replacing (and stopping) any previous one. Pass
// null to clear without starting a new one.
export function setNutzapWatcher(next: StopFn | null): void {
  if (stop !== null && stop !== next) {
    try {
      stop();
    } catch {
      // A watcher whose relay pool is already closed. Nothing to do.
    }
  }
  stop = next;
}

// Tear the watcher down and forget it. Safe to call when none is running.
export function stopNutzapWatcher(): void {
  setNutzapWatcher(null);
}
