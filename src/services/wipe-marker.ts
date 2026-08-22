// The record that a panic wipe is in progress.
//
// panicWipe is a sequence of destructive steps, not an atomic one, and a process
// that dies partway through leaves the keys gone and the message stores intact.
// That presents as a clean install over live data, which is the one way this
// gesture must never fail. So the intent is written before the first step and
// cleared after the last, and any launch that finds it set replays the wipe.
// Every step is a delete or a clear, so a replay is idempotent.
//
// One marker, where bitchat-ios keeps two (PanicRecoveryOperations): its second
// covers UserDefaults.synchronize() reporting a write that never landed. MMKV
// writes reach a kernel-owned mmap that a force-stop cannot lose.
//
// The partition is deliberately absent from MMKV_STORE_IDS, since a wipe that
// clears its own marker destroys the only thing that could finish the job.
//
// A completed wipe still leaves no trace of having been attempted: the flag
// survives only an interrupted one, which has left the message store behind
// anyway.

import { getStorage } from "@store/mmkv";

const STORAGE_ID = "panic-wipe-marker";
const PENDING_KEY = "pending";

// Call before the first destructive step.
//
// A failure costs the ability to RESUME the wipe, not the wipe itself, so it is
// swallowed rather than thrown. Refusing to destroy anything because the
// bookkeeping failed is the wrong trade under duress; bitchat agrees.
export function beginPanicWipe(): void {
  try {
    getStorage(STORAGE_ID).set(PENDING_KEY, true);
  } catch {
    // No writable storage. The wipe runs unresumably rather than not at all.
  }
}

// Call once the sequence has finished.
//
// Unconditional, including when the keychain refused the keys. This marks "the
// sequence did not finish", not "the keys are gone": surviving keys retry
// through sweepOrphanedSecrets, which is safe beside re-onboarding because it
// never touches the identity item. Holding the marker for them would replay the
// wipe over the identity the user creates next and destroy it.
export function endPanicWipe(): void {
  try {
    getStorage(STORAGE_ID).remove(PENDING_KEY);
  } catch {
    // The next launch replays a wipe that already ran. Idempotent.
  }
}

// Fails CLOSED: a read that throws is answered "replay it".
//
// A false positive re-wipes an app whose storage is already unreadable; a false
// negative leaves a full message store on a device whose owner believes it is
// empty. Only the first is survivable for the person holding the phone.
export function isPanicWipePending(): boolean {
  try {
    return getStorage(STORAGE_ID).getBoolean(PENDING_KEY) === true;
  } catch {
    return true;
  }
}
