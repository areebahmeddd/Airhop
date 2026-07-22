// Onboarding step 1: Welcome.
// The cover of the book. Bold wordmark, one sentence, one action. Nothing
// else. The design communicates confidence through restraint.

import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../ui/components/primary-button";
import { FontSize, FontWeight, Spacing, useThemeColors } from "../../ui/theme";

interface Props {
  onContinue: () => void;
}

export default function WelcomeScreen({
  onContinue,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  return (
    <SafeAreaView style={styles.root}>
      {/* Bottom: wordmark + tagline, left-aligned, then CTA */}
      <View style={styles.footer}>
        <View style={styles.textBlock}>
          <Text style={styles.wordmark}>airhop</Text>
          <Text style={styles.tagline}>Private mesh communication.</Text>
        </View>
        <PrimaryButton
          label="Get started"
          onPress={onContinue}
          accessibilityLabel="Get started"
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Colors.bg,
      justifyContent: "flex-end",
    },
    footer: {
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing.md,
      gap: Spacing.xl,
    },
    textBlock: {
      alignItems: "flex-start",
      gap: Spacing.xs,
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
  });
}
