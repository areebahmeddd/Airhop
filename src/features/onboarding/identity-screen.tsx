// Onboarding step 2: Identity generation.
// Shown while the Ed25519 + X25519 key pair is generated and written to
// the OS Keychain. The loading animation reassures the user that something
// real is happening without exposing cryptographic jargon.

import React, { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSize, FontWeight, Spacing } from "../../ui/theme";

interface Props {
  onComplete: (peerID: string) => void;
}

export default function IdentityScreen({
  onComplete,
}: Props): React.JSX.Element {
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

    // Simulate async key generation. In production, replace this with:
    //   import { generateIdentity, saveIdentity } from '../../core/crypto/identity';
    //   const id = await generateIdentity();
    //   await saveIdentity(id);
    //   onComplete(id.peerID);
    const timer = setTimeout(() => {
      // Stub peerID derived from current time; replaced by real identity module.
      const stubPeerID = Date.now().toString(16).padStart(16, "0").slice(0, 16);
      onComplete(stubPeerID);
    }, 2200);

    return () => clearTimeout(timer);
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

const styles = StyleSheet.create({
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
    fontFamily: "monospace",
  },
});
