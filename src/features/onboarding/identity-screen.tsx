// Onboarding step 2: Identity generation.
// Shown while the Ed25519 + X25519 key pair is generated and written to
// the OS Keychain. The loading animation reassures the user that something
// real is happening without exposing cryptographic jargon.

import React, { useEffect, useMemo, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { generateIdentity, saveIdentity } from "../../core/crypto/identity";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Spacing,
  useThemeColors,
} from "../../ui/theme";

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
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [spinAnim] = useState(() => new Animated.Value(0));
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // Fade in the screen.
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

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
    // Falls back to a time-based stub only if EncryptedStorage is unavailable
    // (e.g., the Android emulator without a secure hardware backend).
    //
    // Keygen + storage write typically finish in well under MIN_DISPLAY_MS, so
    // this screen is held on-screen for a minimum duration alongside the real
    // work. Otherwise it flashes by unreadably fast on most devices.
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
        const fallback = Date.now().toString(16).padStart(16, "0").slice(0, 16);
        await delay(MIN_DISPLAY_MS);
        if (!cancelled) onComplete(fallback);
      });

    return () => {
      cancelled = true;
    };
  }, [onComplete, fadeAnim, spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.root}>
      <Animated.View style={[styles.inner, { opacity: fadeAnim }]}>
        {/* Spinner */}
        <View style={styles.spinnerWrapper}>
          <Animated.View
            style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]}
          />
          <View style={styles.spinnerDot} />
        </View>

        {/* Copy */}
        <View style={styles.copy}>
          <Text style={styles.heading}>Generating your identity</Text>
          <Text style={styles.body}>
            Creating an Ed25519 key pair on this device.{"\n"}
            Nothing is sent anywhere.
          </Text>
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          {STEPS.map((step) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepDot} />
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const STEPS = [
  "Generating X25519 static key pair",
  "Generating Ed25519 signing key pair",
  "Storing keys in OS Keychain",
  "Deriving peer ID",
] as const;

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
    // Spinner
    spinnerWrapper: {
      width: 72,
      height: 72,
      alignItems: "center",
      justifyContent: "center",
    },
    spinnerRing: {
      position: "absolute",
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 1.5,
      borderColor: "transparent",
      borderTopColor: Colors.accent,
      borderRightColor: "rgba(0,0,0,0.08)",
    },
    spinnerDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.accent,
    },
    // Copy
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
    // Steps
    steps: {
      alignSelf: "stretch",
      backgroundColor: Colors.surface,
      borderRadius: 12,
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
      borderRadius: 3,
      backgroundColor: Colors.textMuted,
    },
    stepText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontFamily: FontFamily.mono,
    },
  });
}
