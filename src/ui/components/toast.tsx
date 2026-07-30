// A brief confirmation pill: "Saved to your photos", and anything else where
// the user did something small and deserves to see that it worked.
//
// Sits between the two things this app already had and neither of which fits.
// An alert dialog demands a tap for news nobody needs to acknowledge; the muted
// status strip above the compose bar is quiet enough to miss, and it is behind
// a full-screen photo when the action was taken from there. So: same pill the
// Undo Send window uses (surface fill, hairline border, fully rounded), floated
// over whatever it is confirming, gone on its own.
//
// Positioned absolutely inside its parent rather than mounted globally, because
// the one place it is needed most is inside a Modal, and a globally mounted
// toast renders behind those.

import { Feather } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Duration, FontSize, Radius, Spacing, useThemeColors } from "../theme";

// Long enough to read a few words without looking for it, short enough that it
// never sits in the way of the next thing.
const VISIBLE_MS = 2200;
const FADE_MS = Duration.base;

interface Props {
  message: string | null;
  onHide: () => void;
  icon?: React.ComponentProps<typeof Feather>["name"];
  // Lifts the pill clear of whatever is pinned to the bottom of the parent (a
  // compose bar, a row of viewer controls).
  bottomOffset?: number;
}

export default function Toast({
  message,
  onHide,
  icon = "check",
  bottomOffset = Spacing.base,
}: Props): React.JSX.Element | null {
  const Colors = useThemeColors();
  const opacity = useSharedValue(0);
  const lift = useSharedValue(8);

  useEffect(() => {
    if (message === null) return;
    opacity.value = withTiming(1, { duration: FADE_MS });
    lift.value = withTiming(0, { duration: FADE_MS });
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: FADE_MS });
      lift.value = withTiming(8, { duration: FADE_MS });
      // Unmount after the fade, not with it, or the pill vanishes mid-animation.
      setTimeout(onHide, FADE_MS);
    }, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [message, onHide, opacity, lift]);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: lift.value }],
  }));

  if (message === null) return null;

  return (
    <Animated.View
      style={[styles.wrap, { bottom: bottomOffset }, anim]}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
    >
      <View
        style={[
          styles.pill,
          { backgroundColor: Colors.surface, borderColor: Colors.border },
        ]}
      >
        <Feather name={icon} size={14} color={Colors.textSecondary} />
        <Text style={[styles.label, { color: Colors.textSecondary }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: FontSize.sm,
  },
});
