// Onboarding step 1: Welcome.
// The cover of the book. Bold wordmark, one sentence, one action.
// Nothing else. The design communicates confidence through restraint.

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../ui/theme";

interface Props {
  onContinue: () => void;
}

export default function WelcomeScreen({
  onContinue,
}: Props): React.JSX.Element {
  return (
    <SafeAreaView style={styles.root}>
      {/* Center: wordmark + tagline */}
      <View style={styles.center}>
        <Text style={styles.wordmark}>airhop</Text>
        <Text style={styles.tagline}>Private mesh communication.</Text>
      </View>

      {/* Bottom: CTA + disclaimer */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Get started"
        >
          <Text style={styles.ctaText}>Get started</Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          No account. No server. No tracking.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: Spacing["2xl"],
    gap: Spacing.base,
  },
  wordmark: {
    fontSize: FontSize["3xl"],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -1.5,
    lineHeight: FontSize["3xl"] * 1.05,
  },
  tagline: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    letterSpacing: 0,
  },
  footer: {
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: Spacing.base,
    gap: Spacing.base,
  },
  cta: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.base + 2,
    alignItems: "center",
  },
  ctaPressed: {
    opacity: 0.88,
  },
  ctaText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textInverse,
    letterSpacing: 0.1,
  },
  disclaimer: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: FontSize.xs * 1.8,
  },
});
