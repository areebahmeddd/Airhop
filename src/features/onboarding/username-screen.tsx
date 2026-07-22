// Onboarding step 3: Username reveal.
// Shows the user their deterministic human-readable username derived from the
// generated peer ID. Communicates that this is permanent and unique to them.

import React, { useEffect, useMemo, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../../ui/components/primary-button";
import {
  avatarColor,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { peerIDToUsername } from "../../utils/username";

interface Props {
  peerID: string;
  onEnter: () => void;
}

export default function UsernameScreen({
  peerID,
  onEnter,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const username = peerIDToUsername(peerID);
  const accentColor = avatarColor(peerID);
  const [scaleAnim] = useState(() => new Animated.Value(0.88));
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <SafeAreaView style={styles.root}>
      <Animated.View style={[styles.inner, { opacity: fadeAnim }]}>
        {/* Identity card */}
        <Animated.View
          style={[
            styles.card,
            {
              borderColor: accentColor + "33",
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Avatar */}
          <View
            style={[
              styles.avatarCircle,
              {
                backgroundColor: accentColor + "18",
                borderColor: accentColor + "44",
              },
            ]}
          >
            <Text style={[styles.avatarInitials, { color: accentColor }]}>
              {username.slice(0, 2).toUpperCase()}
            </Text>
          </View>

          {/* Username */}
          <Text style={styles.label}>Your name on the mesh</Text>
          <Text style={[styles.username, { color: accentColor }]}>
            {username}
          </Text>

          {/* Peer ID */}
          <Text style={styles.peerIDLabel}>Peer ID</Text>
          <Text style={styles.peerID}>
            {peerID.slice(0, 8)}
            {"\u2009\u00b7\u2009"}
            {peerID.slice(8)}
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Properties */}
          <View style={styles.props}>
            {PROPS.map((p) => (
              <View key={p.label} style={styles.propRow}>
                <Text style={styles.propLabel}>{p.label}</Text>
                <Text
                  style={[
                    styles.propValue,
                    p.accent ? { color: accentColor } : null,
                  ]}
                >
                  {p.value}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Explanation */}
        <Text style={styles.explanation}>
          This username is deterministically derived from your public key. It is
          the same on every device that sees your peer ID.
        </Text>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <PrimaryButton
          label="Enter Airhop"
          onPress={onEnter}
          accessibilityLabel="Enter Airhop"
        />
      </View>
    </SafeAreaView>
  );
}

const PROPS = [
  { label: "Algorithm", value: "Ed25519 + X25519", accent: false },
  { label: "Storage", value: "OS Keychain only", accent: false },
  { label: "Account required", value: "None", accent: true },
] as const;

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    inner: {
      flex: 1,
      paddingHorizontal: Spacing["2xl"],
      justifyContent: "center",
      gap: Spacing.xl,
    },
    // Card
    card: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.xl,
      borderWidth: 1,
      padding: Spacing.xl,
      alignItems: "center",
      gap: Spacing.sm,
    },
    avatarCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Spacing.sm,
    },
    avatarInitials: {
      fontSize: FontSize.xl,
      fontWeight: FontWeight.bold,
      letterSpacing: 1,
    },
    label: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
    username: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      letterSpacing: -0.3,
      marginBottom: Spacing.xs,
    },
    peerIDLabel: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      marginTop: Spacing.sm,
    },
    peerID: {
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
      fontFamily: "monospace",
      letterSpacing: 1,
    },
    divider: {
      alignSelf: "stretch",
      height: 1,
      backgroundColor: Colors.border,
      marginVertical: Spacing.sm,
    },
    props: {
      alignSelf: "stretch",
      gap: Spacing.xs + 2,
    },
    propRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    propLabel: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
    propValue: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    // Explanation
    explanation: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: FontSize.sm * 1.6,
      paddingHorizontal: Spacing.md,
    },
    // Footer: same horizontal margin as the app's floating tab bar
    // (Spacing.base) so the CTA width matches once onboarding hands off.
    footer: {
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing.md,
    },
  });
}
