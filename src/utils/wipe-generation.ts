// Monotonic counter, bumped once per panic wipe.
//
// Startup installs the nutzap subscription behind a wallet unlock and a relay
// round trip. A wipe inside that window stops the watcher, then the in-flight
// startup installs its replacement on the destroyed identity, keeping that
// identity's Nostr key alive in a closure.
//
// Capture before the first await, re-check before acting; both calls are
// synchronous, so nothing interleaves between them. bitchat-ios gates startup
// on the same kind of token (`capturePanicLifecycleGeneration`).
//
// Importless: panic-wipe.ts imports this, so importing back would be a cycle.

let generation = 0;

export function currentWipeGeneration(): number {
  return generation;
}

export function isCurrentWipeGeneration(captured: number): boolean {
  return captured === generation;
}

// Invalidates every generation captured before now.
export function bumpWipeGeneration(): void {
  generation++;
}
