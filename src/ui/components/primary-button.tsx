// PrimaryButton component.
// The single filled CTA surface for a screen's primary action (onboarding,
// confirmations). Near-black fill + inverse text, matching the same
// iMessage-style inversion used for outgoing message bubbles.

import React, { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  FontSize,
  FontWeight,
  MIN_TOUCH,
  Radius,
  Spacing,
  useThemeColors,
} from "../theme";

interface Props {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  // Spoken after the label, for saying WHY a disabled CTA is disabled. A dimmed
  // button with no stated blocker is the most common dead end in an onboarding
  // flow, and it is invisible to a screen reader without this.
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  // When true the button reads as inactive: muted fill, muted label, no
  // press feedback, and taps do nothing. Used for gated CTAs (e.g. an
  // agreement checkbox must be ticked first).
  disabled?: boolean;
}

export default function PrimaryButton({
  label,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  style,
  disabled = false,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      // A static style array with the press held in state, which is how every
      // other button surface in this app is written (see settings/shared.tsx and
      // the sheet action pairs). Pressable's `style={({ pressed }) => ...}`
      // callback form is the leaner idiom and is available again now that the
      // NativeWind JSX wrapper is gone, but it is deliberately not used here:
      // one consistent way to write a button beats a lone exception, and the
      // saving is two renders on a tap of a single onboarding CTA.
      style={[
        styles.button,
        style,
        disabled && styles.disabled,
        !disabled && pressed && styles.pressed,
      ]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
    >
      <Text
        style={[styles.label, disabled && styles.labelDisabled]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    button: {
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      paddingVertical: Spacing.md + 2,
      // Padding alone already clears the floor at the default text size; the
      // explicit minimum is what holds it there if the label ever shrinks.
      minHeight: MIN_TOUCH,
      alignItems: "center",
      justifyContent: "center",
      // A transparent hairline in the enabled state, so switching to `disabled`
      // below only changes the border's COLOUR and never the button's geometry.
      // Adding a border only when disabled would shift the label by a pixel and
      // make the gate feel like a glitch.
      borderWidth: 1,
      borderColor: "transparent",
    },
    pressed: {
      opacity: 0.85,
    },
    // A disabled CTA still has to read as a button, just plainly not yours yet.
    // `surfaceRaised` (#F0F0F0) on the onboarding background (#F8F8F8) is a
    // 1.03:1 difference, so on its own the pill had no visible edge and the
    // gated "Get started" looked like a stray line of grey text rather than a
    // control waiting on the checkbox below it. The border is what keeps the
    // shape; the muted fill and label are what say it is inactive.
    disabled: {
      backgroundColor: Colors.surfaceRaised,
      borderColor: Colors.border,
    },
    label: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textInverse,
      letterSpacing: 0.1,
    },
    labelDisabled: {
      color: Colors.textMuted,
    },
  });
}
