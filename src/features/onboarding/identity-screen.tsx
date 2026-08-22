// Onboarding step 2: Identity generation.
// Shown while the Ed25519 + X25519 key pair is generated and written to
// the OS Keychain. The loading animation reassures the user that something
// real is happening without exposing cryptographic jargon.

import { generateIdentity, saveIdentity } from "@core/crypto/identity";
import { useT, type TranslationKey } from "@i18n";
import PrimaryButton from "@ui/components/primary-button";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "@ui/theme";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Diameter of the keygen spinner ring. Named so the radius below cannot drift
// out of step with it and quietly stop being a circle.
const SPINNER_SIZE = 64;

interface Props {
  onComplete: (peerID: string) => void;
}

// Minimum time to hold this screen on-screen, regardless of how fast the
// underlying keygen/storage write actually completes.
const MIN_DISPLAY_MS = 5000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function IdentityScreen({
  onComplete,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const T = useT();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [spinAnim] = useState(() => new Animated.Value(0));
  const steps = STEP_KEYS.map((key) => T(key));
  // The work either produced a key pair on disk or it did not.
  //
  // A failure must not fall through to `onComplete` with a timestamp shaped like
  // a peer ID. Onboarding accepts it, and the user lands in an app whose mesh can
  // never start (loadIdentity finds nothing) with no screen saying why.
  const [failed, setFailed] = useState(false);
  // Bumped by Try again to re-run the effect below. A Keystore refuses for
  // reasons that pass: locked mid-write, or storage momentarily full.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Spin the ring indicator.
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Generate and persist real Ed25519 + X25519 key pairs.
    //
    // Keygen + storage write typically finish in well under MIN_DISPLAY_MS, so
    // this screen is held on-screen for a minimum duration alongside the real
    // work. Otherwise it flashes by unreadably fast on most devices.
    //
    // The minimum applies to the failure too: an error screen in 80ms reads as
    // a validation error the user caused rather than as attempted work.
    let cancelled = false;
    Promise.all([
      generateIdentity().then(async (id) => {
        await saveIdentity(id);
        return id.peerID;
      }),
      delay(MIN_DISPLAY_MS),
    ])
      .then(([peerID]) => {
        if (!cancelled) onComplete(peerID);
      })
      .catch(async () => {
        await delay(MIN_DISPLAY_MS);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [onComplete, spinAnim, attempt]);

  const retry = useCallback((): void => {
    setFailed(false);
    setAttempt((n) => n + 1);
  }, []);

  if (failed) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.inner}>
          {/* Live region for the same reason the working state has one: this
              replaces the spinner with no navigation event. */}
          <View style={styles.copy} accessibilityLiveRegion="assertive">
            <Text style={styles.heading} accessibilityRole="header">
              {T("onboarding.identity.failed_heading")}
            </Text>
            <Text style={styles.body}>
              {T("onboarding.identity.failed_body")}
            </Text>
          </View>
          <PrimaryButton
            label={T("common.try_again")}
            onPress={retry}
            accessibilityLabel={T("common.try_again")}
          />
        </View>
      </SafeAreaView>
    );
  }

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.inner}>
        {/* Spinner. Purely decorative for a screen reader: the heading below
            already announces what is happening, so a second "in progress"
            element would just be read twice.

            The rotation is deliberately NOT gated on reduce-motion. Both
            platforms keep their own system spinners turning under that setting
            because an activity indicator conveys status rather than decoration,
            and this screen has nothing else to say "still working". */}
        <View
          style={styles.spinnerWrapper}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        >
          <Animated.View
            style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]}
          />
          <View style={styles.spinnerDot} />
        </View>

        {/* Copy. The live region is what makes the transition audible: this
            screen replaces the welcome screen with no navigation event, so
            without it a screen reader user hears nothing at all after tapping
            Get started and again nothing when it moves on. */}
        <View style={styles.copy} accessibilityLiveRegion="polite">
          <Text style={styles.heading} accessibilityRole="header">
            {T("onboarding.identity.heading")}
          </Text>
          <Text style={styles.body}>{T("onboarding.identity.body")}</Text>
        </View>

        {/* Steps: a description of the work, not a checklist. Read as one
            element so it is four short phrases rather than four stops. */}
        <View
          style={styles.steps}
          accessible
          accessibilityLabel={T("onboarding.identity.steps_a11y", {
            steps: steps.join(". "),
          })}
        >
          {steps.map((step) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepDot} />
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const STEP_KEYS: TranslationKey[] = [
  "onboarding.identity.step.x25519",
  "onboarding.identity.step.ed25519",
  "onboarding.identity.step.keychain",
  "onboarding.identity.step.peer_id",
];

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    inner: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing["2xl"],
      gap: Spacing["2xl"],
    },
    spinnerWrapper: {
      width: 72,
      height: 72,
      alignItems: "center",
      justifyContent: "center",
    },
    spinnerRing: {
      position: "absolute",
      width: SPINNER_SIZE,
      height: SPINNER_SIZE,
      borderRadius: SPINNER_SIZE / 2,
      borderWidth: 1.5,
      borderColor: "transparent",
      borderTopColor: Colors.accent,
      // The border token, never a hardcoded rgba(0,0,0,0.08): black on black
      // leaves the ring's trailing arc invisible in dark mode, and the spinner
      // reads as a single floating tick.
      //
      // Physical, and deliberately not logical. This ring is artwork that spins
      // continuously, so which side of it carries the muted arc is a starting
      // rotation and nothing more. `borderEndColor` would claim the choice
      // means something in Arabic, and it does not.
      // eslint-disable-next-line no-restricted-syntax
      borderRightColor: Colors.border,
    },
    spinnerDot: {
      width: 8,
      height: 8,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
    },
    copy: {
      alignItems: "center",
      gap: Spacing.sm,
    },
    heading: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
      textAlign: "center",
    },
    body: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      textAlign: "center",
      lineHeight: FontSize.sm * 1.6,
    },
    steps: {
      alignSelf: "stretch",
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      // Every card in the app carries a hairline edge. Without one, this card has
      // no boundary at all on the near-white onboarding background.
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.base,
      gap: Spacing.md,
    },
    step: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    stepDot: {
      width: 4,
      height: 4,
      borderRadius: Radius.xs,
      backgroundColor: Colors.textMuted,
    },
    stepText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontFamily: FontFamily.mono,
    },
  });
}
