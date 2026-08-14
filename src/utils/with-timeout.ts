// Bound a promise that has no business taking forever.
//
// An unbounded await on the launch path is a way for the app to never open. Two
// that must always be bounded:
//
//   * `readSecret` for the identity, which gates the whole first
//     render. A Keystore that stalls left a bare background-coloured screen with
//     no text, no spinner and no way out, and it looked exactly like a hung
//     splash.
//   * `PermissionsAndroid.requestMultiple`, whose promise is tied to the
//     permission dialog's activity. The dialog runs in another process, and an
//     Activity destroyed or recreated while it is up orphans the promise. The
//     mesh was started after that await, so an orphaned dialog meant a phone
//     that never scanned and a Mesh tab stuck on "starting" for the session.
//
// Neither of those is a state the app can detect from the inside, because a
// promise that will never settle is indistinguishable from one that is about to.
// The only defence is a deadline.
//
// A timeout is NOT an error here. Every caller has a defensible answer for "we
// do not know yet" - re-onboard, ask again later, let the reconciler read the
// device itself - so this resolves with a fallback rather than rejecting, and
// the caller stays linear. A late-arriving real answer is ignored: whatever the
// fallback set in motion has already happened, and applying a stale result on
// top of it is how you get two identities or two prompts.

// Resolve with `fallback` if `promise` has not settled within `ms`.
//
// A rejection is still a rejection: this only covers a promise that never
// answers, and swallowing genuine failures would hide the bugs that produce
// them. Callers that also want rejections handled put a `.catch` on the promise
// they hand in.
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(fallback);
    }, ms);
    promise.then(
      (value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}

// The same, for a promise whose rejection is as uninteresting as its silence.
// Used where the caller's only question is "did we get an answer in time", and
// a native module that is missing, older, or refusing is answered the same way
// as one that never replied.
export function settleOr<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
): Promise<T> {
  return withTimeout(promise, ms, fallback).catch(() => fallback);
}
