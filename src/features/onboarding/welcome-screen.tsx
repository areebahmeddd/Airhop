// Onboarding step 1: Welcome.
// The cover of the book. Bold wordmark, one sentence, one action. Nothing
// else. The design communicates confidence through restraint.

import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
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
  HIT_SLOP,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import HelloSheet from "./hello-sheet";

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
  // Opens with the screen. This screen is only ever reached on a fresh install
  // or after a panic wipe, so the note lands exactly where it should with no
  // "seen it" flag to store (and nothing left behind for a wipe to miss).
  const [showHello, setShowHello] = useState(true);
  // Size the bird to about half the screen width, capped, so it reads big on
  // phones without overflowing tablets. Cell rounded to a whole pixel keeps
  // the pixel edges crisp.
  const birdCell = Math.max(
    2,
    Math.round(Math.min(width * 0.5, 240) / BIRD_PIXELS[0].length),
  );

  function toggleAgreed(): void {
    // A selection tick, the lightest feedback the OS offers, matching how a
    // native checkbox or picker feels. Not an impact: nothing happened yet.
    void Haptics.selectionAsync().catch(() => {});
    setAgreed((v) => !v);
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Scrolls only when it has to. `flexGrow: 1` on the content lets the hero
          keep its `flex: 1` and stay centered on a normal portrait screen; on a
          short viewport (landscape, a small phone at the largest OS text size)
          the wordmark, CTA and consent row used to be clipped off the bottom
          with no way to reach them, which on the very first screen means the
          app cannot be started at all. */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Centered brand mark filling the space above the footer. Uses the
            primary text color, so it is a black bird on a light background and a
            white bird in dark mode. */}
        {/* minHeight keeps the mark whole once the content is taller than the
            viewport: with only `flex: 1` the leftover space is zero on a short
            screen and the bird collapses to nothing. */}
        <View
          style={[
            styles.hero,
            { minHeight: BIRD_PIXELS.length * birdCell + Spacing["3xl"] },
          ]}
        >
          <PixelBird color={Colors.textPrimary} cell={birdCell} />
        </View>

        {/* Bottom: wordmark + tagline, left-aligned, then CTA */}
        <View style={styles.footer}>
          <View style={styles.textBlock}>
            <Text style={styles.wordmark} accessibilityRole="header">
              airhop
            </Text>
            <Text style={styles.tagline}>Private mesh communication.</Text>
          </View>
          <View style={styles.actions}>
            <PrimaryButton
              label="Get started"
              onPress={onContinue}
              disabled={!agreed}
              accessibilityLabel="Get started"
              // A dimmed button with no stated reason is a dead end. The hint is
              // read out the moment focus lands on it, so the blocker is
              // announced before the tap that would do nothing.
              accessibilityHint={
                agreed ? undefined : "Agree to the terms below to continue"
              }
            />
            <Pressable
              style={styles.agreement}
              onPress={toggleAgreed}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agreed }}
              accessibilityLabel="Agree to the Terms of Service and Privacy Policy"
              // The two inline links are inside an accessible parent, which
              // means a screen reader treats the whole row as one element and
              // never reaches them. Exposing them as custom actions is the
              // supported way back in: VoiceOver and TalkBack both offer them
              // from the actions menu, so the documents are reachable without
              // breaking the row into three separate stops.
              accessibilityActions={[
                { name: "terms", label: "Open Terms of Service" },
                { name: "privacy", label: "Open Privacy Policy" },
              ]}
              onAccessibilityAction={(event) => {
                if (event.nativeEvent.actionName === "terms") {
                  void Linking.openURL(TERMS_URL);
                } else if (event.nativeEvent.actionName === "privacy") {
                  void Linking.openURL(PRIVACY_URL);
                }
              }}
              hitSlop={HIT_SLOP}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed ? (
                  <Feather name="check" size={13} color={Colors.textInverse} />
                ) : null}
              </View>
              <Text style={styles.agreementText}>
                By tapping Get started, you agree to our{" "}
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
      </ScrollView>

      <HelloSheet visible={showHello} onClose={() => setShowHello(false)} />
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
    scroll: {
      flexGrow: 1,
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
      borderRadius: Radius.full,
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
