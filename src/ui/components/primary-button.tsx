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
  Radius,
  Spacing,
  useThemeColors,
} from "../theme";

interface Props {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
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
  style,
  disabled = false,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
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
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
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
      alignItems: "center",
      justifyContent: "center",
    },
    pressed: {
      opacity: 0.85,
    },
    disabled: {
      backgroundColor: Colors.surfaceRaised,
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
