// Haptic feedback, named by situation rather than by feedback type.
//
// Keeps the vocabulary small: two call sites that mean the same thing to the
// user cannot drift into two different buzzes.
//
// Every call is fire-and-forget. A device with no motor, a simulator, or a
// declined vibration permission rejects, and none of it is actionable, so it is
// swallowed once here rather than at each call site.
//
// Not wired to reduced-motion. That setting is about animation, and haptics are
// what the app falls back to when motion is off (see radar-view). Android
// applies the system haptics setting below this layer; iOS exposes no equivalent
// to read.

import * as Haptics from "expo-haptics";

// A silent action landed. Copying is the case that matters: the only visual
// confirmation is a glyph under the thumb that just covered it.
export function acknowledged(): void {
  void Haptics.selectionAsync().catch(() => {});
}

// A press-and-hold crossed its threshold. The only gesture with no visible
// progress, so the tick is what confirms the hold is working. Used by the
// message bubble and both chat lists.
export function held(): void {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

// An operation completed while the user may not be watching the screen. Scanning
// is the case that matters: the phone is held up at another display.
export function succeeded(): void {
  void Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success,
  ).catch(() => {});
}

// A check refused something. For failures the user must register rather than
// ones already on screen: a card that does not match the contact, or whose keys
// do not match its own peer ID. Not for "that wasn't a QR code".
export function rejected(): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
    () => {},
  );
}
