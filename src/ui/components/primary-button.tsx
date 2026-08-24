// PrimaryButton component.
// The single filled CTA surface for a screen's primary action (onboarding,
// confirmations). Near-black fill + inverse text, matching the same
// iMessage-style inversion used for outgoing message bubbles.

import React, { useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  BUTTON_HEIGHT,
  FontSize,
  FontWeight,
  PRESSED_OPACITY,
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
  return (
    <Pressable
      // Pressable's style callback, the one form every tappable surface here
      // uses: holding the press in state re-renders twice per tap, which a list
      // row cannot afford.
      style={({ pressed }) => [
        styles.button,
        style,
        disabled && styles.disabled,
        !disabled && pressed && styles.pressed,
      ]}
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
      minHeight: BUTTON_HEIGHT,
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
      opacity: PRESSED_OPACITY,
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
