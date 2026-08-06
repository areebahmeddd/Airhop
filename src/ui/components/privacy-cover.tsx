// Covers the screen while the app is not frontmost, so the snapshot the OS
// takes for the app switcher shows the Airhop mark instead of an open
// conversation.
//
// Driven by a Reanimated shared value rather than React state. The snapshot is
// captured moments after the app leaves the foreground, and a shared value is
// applied on the UI thread without waiting for a render pass, which is the
// difference between covering the snapshot and covering the frame after it.
//
// A React Native Modal renders in its own window and is not covered by anything
// in the tree below it, so every full-screen Modal mounts its own copy. That is
// four call sites (the app root, BottomSheet, the photo viewer, the
// notification centre) rather than one, and the alternative is a snapshot of
// whichever sheet happened to be open.

import { useEffect } from "react";
import { AppState, Image, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Duration, useThemeColors } from "../theme";

const MARK_SIZE = 96;

export default function PrivacyCover(): React.JSX.Element {
  const Colors = useThemeColors();
  const shown = useSharedValue(0);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      // Instant on the way out, so nothing is uncovered when the snapshot is
      // taken. Faded on the way back, so returning to the app does not blink.
      shown.value =
        next === "active" ? withTiming(0, { duration: Duration.base }) : 1;
    });
    return () => sub.remove();
  }, [shown]);

  const style = useAnimatedStyle(() => ({ opacity: shown.value }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.cover, style]}
      // Never interactive: it only exists while the app is not being touched,
      // and it must not swallow the first tap on return.
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.bg }]} />
      <Image
        source={require("../../../assets/images/icon.png")}
        style={styles.mark}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cover: {
    alignItems: "center",
    justifyContent: "center",
    // Above every sibling in its own tree.
    zIndex: 9999,
  },
  mark: {
    width: MARK_SIZE,
    height: MARK_SIZE,
  },
});
