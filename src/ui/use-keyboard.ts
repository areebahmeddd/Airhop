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
// The returned height is measured from the BOTTOM OF THE SCREEN, so it includes
// whatever system inset (nav bar, home indicator) the keyboard covers up. A
// layout that already sits inside the safe area must subtract its own bottom
// inset before using this: see `useKeyboardInset`.

import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// iOS fires `will*` ahead of the animation, which lets the layout move in step
// with the keyboard. Android only has the `did*` pair.
const SHOW_EVENT =
  Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
const HIDE_EVENT =
  Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

// Height of the on-screen keyboard, measured from the bottom of the screen.
// 0 when it is closed.
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
// lift to clear the keyboard. Screens inside the app's root SafeAreaView (every
// tab, the message thread) want this one; content inside a Modal draws behind
// the system bars and wants the raw `useKeyboardHeight`.
export function useKeyboardInset(): number {
  const keyboard = useKeyboardHeight();
  const insets = useSafeAreaInsets();
  return keyboard > 0 ? Math.max(0, keyboard - insets.bottom) : 0;
}
