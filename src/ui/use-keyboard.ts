// Keyboard geometry, measured rather than guessed.
//
// Android is edge-to-edge from Expo SDK 54 on, which means the activity window
// no longer shrinks when the IME opens even with `adjustResize`: the keyboard
// simply draws over the app. `KeyboardAvoidingView` inherits that problem (its
// Android path relies on the window resize), so anything anchored to the bottom
// of the screen - the compose bar, a sheet's text field - ends up underneath the
// keyboard. Reading the IME frame directly and lifting by that amount is the one
// approach that behaves the same on both platforms.
//
// The catch is that the two platforms do not measure the keyboard from the same
// place, so there is no single number that suits both callers:
//
//   * iOS reports the keyboard's frame in screen coordinates. Its height runs
//     to the very bottom of the screen and therefore covers the home indicator.
//   * Android reports `imeInsets.bottom - barInsets.bottom` (RN 0.86,
//     ReactRootView.checkForKeyboardEvents): the IME height measured from the
//     TOP OF THE NAVIGATION BAR, with the system inset already taken out.
//
// Hence two hooks. `useKeyboardHeight` is the raw platform value, for content
// anchored to the true bottom of the screen; `useKeyboardInset` is the lift for
// content that already sits inside the bottom safe area.

import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// iOS fires `will*` ahead of the animation, which lets the layout move in step
// with the keyboard. Android only has the `did*` pair.
const SHOW_EVENT =
  Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
const HIDE_EVENT =
  Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

// The platform's own keyboard height, 0 when closed. Use this for content that
// draws behind the system bars and is anchored to the true bottom of the
// screen: a Modal, and so every BottomSheet. Re-fires while the keyboard stays
// open if its height changes (a suggestion strip appearing, an emoji panel
// opening), so the value tracks the real IME rather than its first frame.
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener(SHOW_EVENT, (e) => {
      setHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener(HIDE_EVENT, () => setHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return height;
}

// How far a view whose bottom edge already sits above the system inset has to
// lift to clear the keyboard. Screens inside the app's root SafeAreaView want
// this one, the message thread's compose bar above all.
//
// Only iOS has anything to subtract: its measurement includes the home
// indicator that such a view is already clear of. Android has taken its
// navigation bar out already, so subtracting again left the compose bar sitting
// a navigation bar's height under the keyboard, clipped along its bottom edge.
export function useKeyboardInset(): number {
  const keyboard = useKeyboardHeight();
  const insets = useSafeAreaInsets();
  if (keyboard <= 0) return 0;
  return Platform.OS === "ios"
    ? Math.max(0, keyboard - insets.bottom)
    : keyboard;
}
