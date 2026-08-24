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

// A drag crossed the point where letting go closes rather than springs back.
// The sheet's dismiss threshold is invisible, so this is the only thing marking
// it. Selection-style because neither outcome is destructive, unlike `armed`.
// Entering the zone only, so a drag settling near the line does not chatter.
export function crossedThreshold(): void {
  void Haptics.selectionAsync().catch(() => {});
}

// A hold crossed into "let go now and this is thrown away": sliding a
// push-to-talk recording back to cancel. Rigid rather than the tick
// `crossedThreshold` uses, because push-to-talk is used without looking and the
// destructive threshold has to be tellable apart by feel.
export function armed(): void {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid).catch(() => {});
}

// A hold ended, or backed out of an armed threshold. The light counterpart to
// `held`, closing the pair a press-and-hold opens.
export function released(): void {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

// Something irreversible happened with no dialog in front of it. The panic
// wipe's triple tap is the only one, and this is its only confirmation. A
// warning notification, not an impact: the OS pattern for "something serious
// just happened".
export function warned(): void {
  void Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Warning,
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
