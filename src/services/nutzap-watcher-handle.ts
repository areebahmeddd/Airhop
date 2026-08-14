// The live NIP-61 nutzap subscription, held where both the startup path and the
// panic wipe can reach it.
//
// Held here, in a module with no imports of its own and therefore no cycle,
// rather than at app scope where only the app could stop it. A panic wipe
// destroys the mesh, the keys and every store; a subscription left running
// against the wiped identity holds that identity's Nostr private key alive in a
// closure for the rest of the process, which is precisely what the wipe exists to
// prevent.

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

// How to build a watcher against whatever Nostr client is current.
//
// The watcher captures a NostrClient instance, and that instance does not
// survive a transport rebuild: toggling Tor, or turning internet fallback off
// and on, constructs a new client and leaves the old subscription pointing at a
// closed pool. It was installed exactly once, at startup, so either toggle
// silently ended NIP-61 for the rest of the session and incoming nutzaps
// stopped being redeemed with nothing to say so.
//
// Registered by the startup path, which owns the wallet keys and the alert it
// raises, and called by the mesh service after it builds a transport. The
// indirection is what keeps mesh-service from importing the wallet layer.
type RebindFn = () => void;

let rebind: RebindFn | null = null;

export function setNutzapRebinder(next: RebindFn | null): void {
  rebind = next;
}

// Re-establish the watcher against the current client. A no-op before the
// startup path has registered one, and after a panic wipe clears it.
export function rebindNutzapWatcher(): void {
  try {
    rebind?.();
  } catch {
    // The wallet is locked, or there is no mint configured. Payments over the
    // radio are unaffected; only the internet-side watcher is missing.
  }
}
