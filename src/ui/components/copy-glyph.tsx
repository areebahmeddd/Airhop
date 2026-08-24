// The copy affordance, and the tick that stands in for it after a tap.
//
// Both glyphs are stacked in one fixed square and cross-faded rather than
// swapped by name: at 14-18pt a swap between two frames reads as a flicker, and
// this is the only feedback a copy gives. The square is sized from the glyph so
// nothing in the row moves.
//
// Reanimated defaults to ReduceMotion.System, so the crossfade becomes an
// instant swap on its own when the OS setting is on.
//
// The state half lives in ui/hooks/use-copy.ts.

import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Duration, useThemeColors } from "../theme";

// The tick settles up to size so the confirmation has a direction. Small: this
// sits in a row of otherwise still text, and more reads as a bounce.
const TICK_FROM = 0.8;

interface Props {
  copied: boolean;
  size: number;
  // The resting colour of the copy glyph. The tick is always `online` green,
  // which is the palette's one "this worked" colour.
  color: string;
}

export default function CopyGlyph({
  copied,
  size,
  color,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const timing = { duration: Duration.base };

  const copyAnim = useAnimatedStyle(() => ({
    opacity: withTiming(copied ? 0 : 1, timing),
  }));

  const tickAnim = useAnimatedStyle(() => ({
    opacity: withTiming(copied ? 1 : 0, timing),
    transform: [{ scale: withTiming(copied ? 1 : TICK_FROM, timing) }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={[StyleSheet.absoluteFill, copyAnim]}>
        <Feather name="copy" size={size} color={color} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, tickAnim]}>
        <Feather name="check" size={size} color={Colors.online} />
      </Animated.View>
    </View>
  );
}
