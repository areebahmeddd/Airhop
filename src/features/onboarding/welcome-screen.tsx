// Onboarding step 1: Welcome.
// The cover of the book. Bold wordmark, one sentence, one action. Nothing
// else. The design communicates confidence through restraint.

import Feather from "@expo/vector-icons/Feather";
import React, { useMemo, useState } from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../ui/components/primary-button";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";

const TERMS_URL = "https://airhop.1mindlabs.org/terms-of-service";
const PRIVACY_URL = "https://airhop.1mindlabs.org/privacy-policy";

interface Props {
  onContinue: () => void;
}

export default function WelcomeScreen({
  onContinue,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const { width } = useWindowDimensions();
  const [agreed, setAgreed] = useState(false);
  // Size the bird to about half the screen width, capped, so it reads big on
  // phones without overflowing tablets. Cell rounded to a whole pixel keeps
  // the pixel edges crisp.
  const birdCell = Math.max(
    2,
    Math.round(Math.min(width * 0.5, 240) / BIRD_PIXELS[0].length),
  );
  return (
    <SafeAreaView style={styles.root}>
      {/* Centered brand mark filling the space above the footer. Uses the
          primary text color, so it is a black bird on a light background and a
          white bird in dark mode. */}
      <View style={styles.hero}>
        <PixelBird color={Colors.textPrimary} cell={birdCell} />
      </View>

      {/* Bottom: wordmark + tagline, left-aligned, then CTA */}
      <View style={styles.footer}>
        <View style={styles.textBlock}>
          <Text style={styles.wordmark}>airhop</Text>
          <Text style={styles.tagline}>Private mesh communication.</Text>
        </View>
        <View style={styles.actions}>
          <PrimaryButton
            label="Get started"
            onPress={onContinue}
            disabled={!agreed}
            accessibilityLabel="Get started"
          />
          <Pressable
            style={styles.agreement}
            onPress={() => setAgreed((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreed }}
            accessibilityLabel="Agree to the Terms of Service and Privacy Policy"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed ? (
                <Feather name="check" size={13} color={Colors.textInverse} />
              ) : null}
            </View>
            <Text style={styles.agreementText}>
              By tapping Get Started, you agree to our{" "}
              <Text
                style={styles.link}
                onPress={() => void Linking.openURL(TERMS_URL)}
                suppressHighlighting
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                style={styles.link}
                onPress={() => void Linking.openURL(PRIVACY_URL)}
                suppressHighlighting
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// The Airhop brand mark: a monochrome pixel bird, the same soaring-seabird
// glide frame that crowns the Version screen and every app icon (a nod to the
// release codenames, birds, alphabetical; 1.x is Albatross). Drawn as a grid
// of square cells so it stays crisp at any size; filled cells take the passed
// color, so it reads in both light and dark themes.
const BIRD_PIXELS = [
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
];

function PixelBird({
  color,
  cell,
}: {
  color: string;
  cell: number;
}): React.JSX.Element {
  return (
    <View style={{ width: BIRD_PIXELS[0].length * cell }}>
      {BIRD_PIXELS.map((row, y) => (
        <View key={y} style={{ flexDirection: "row" }}>
          {row.map((filled, x) => (
            <View
              key={x}
              style={{
                width: cell,
                height: cell,
                backgroundColor: filled ? color : "transparent",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    // Fills the space above the footer and centers the brand mark in it.
    hero: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
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
    actions: {
      gap: Spacing.base,
    },
    // Checkbox + consent line. The whole row toggles the box; only the two
    // link spans peel off to open the site, so a stray tap never leaves the
    // app by accident.
    agreement: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.xs,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: Radius.sm,
      borderWidth: 1.5,
      borderColor: Colors.borderStrong,
      alignItems: "center",
      justifyContent: "center",
      // Nudge down so the box aligns with the first line's cap height.
      marginTop: 1,
    },
    checkboxChecked: {
      backgroundColor: Colors.accent,
      borderColor: Colors.accent,
    },
    agreementText: {
      flex: 1,
      fontSize: FontSize.sm,
      lineHeight: FontSize.sm * 1.5,
      color: Colors.textSecondary,
    },
    link: {
      color: Colors.textPrimary,
      fontWeight: FontWeight.medium,
      textDecorationLine: "underline",
    },
  });
}
