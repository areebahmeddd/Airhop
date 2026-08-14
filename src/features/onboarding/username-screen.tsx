// Onboarding step 3: Username reveal.
// Shows the user their deterministic human-readable username derived from the
// generated peer ID. Communicates that this is permanent and unique to them.

import { useT, type Translator } from "@i18n";
import PrimaryButton from "@ui/components/primary-button";
import {
  avatarColor,
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
  withAlpha,
} from "@ui/theme";
import { peerIDToUsername } from "@utils/username";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Diameter of the identity card's avatar. Named so its border radius stays a
// circle if the size is ever tuned.
const AVATAR_SIZE = 72;

interface Props {
  peerID: string;
  onEnter: () => void;
}

export default function UsernameScreen({
  peerID,
  onEnter,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const T = useT();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const username = peerIDToUsername(peerID);
  const accentColor = avatarColor(peerID);
  const props = identityProps(T);

  return (
    <SafeAreaView style={styles.root}>
      {/* Same "centre if it fits, scroll if it does not" container as the
          welcome screen. This card is the tallest fixed block in onboarding, so
          on a short viewport it was the CTA underneath that got clipped. */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.inner}>
          {/* Identity card. Read as one element: broken into its eight Texts a
              screen reader recites "Your name on the mesh", the name, "Peer
              ID", 16 characters of hex read digit by digit, then three
              label/value pairs, as ten separate stops. One label states the
              same thing in the order a sighted user takes it in. */}
          <View
            style={[styles.card, { borderColor: withAlpha(accentColor, 0.2) }]}
            accessible
            accessibilityLabel={T("onboarding.username.card_a11y", {
              username,
              peerID,
              props: props.map((p) => `${p.label}: ${p.value}`).join(". "),
            })}
          >
            {/* Avatar */}
            <View
              style={[
                styles.avatarCircle,
                {
                  backgroundColor: withAlpha(accentColor, 0.09),
                  borderColor: withAlpha(accentColor, 0.27),
                },
              ]}
            >
              <Text style={[styles.avatarInitials, { color: accentColor }]}>
                {username.slice(0, 2).toUpperCase()}
              </Text>
            </View>

            {/* Username */}
            <Text style={styles.label}>{T("onboarding.username.label")}</Text>
            <Text style={[styles.username, { color: accentColor }]}>
              {username}
            </Text>

            {/* Peer ID */}
            <Text style={styles.peerIDLabel}>
              {T("onboarding.username.peer_id")}
            </Text>
            <Text style={styles.peerID}>
              {peerID.slice(0, 8)}
              {"\u2009\u00b7\u2009"}
              {peerID.slice(8)}
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Properties */}
            <View style={styles.props}>
              {props.map((p) => (
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
          </View>

          {/* Explanation */}
          <Text style={styles.explanation}>
            {T("onboarding.username.explanation")}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <PrimaryButton
            label={T("onboarding.username.cta")}
            onPress={onEnter}
            accessibilityLabel={T("onboarding.username.cta")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Built per render rather than as a module constant: the labels are
// translated, so the table has to be able to change language.
function identityProps(
  T: Translator,
): { label: string; value: string; accent: boolean }[] {
  return [
    {
      label: T("onboarding.username.prop.algorithm"),
      // A cryptosystem name, not prose. Never translated, never transliterated.
      value: "Ed25519 + X25519",
      accent: false,
    },
    {
      label: T("onboarding.username.prop.storage"),
      value: T("onboarding.username.prop.storage_value"),
      accent: false,
    },
    {
      label: T("onboarding.username.prop.account"),
      value: T("onboarding.username.prop.account_value"),
      accent: true,
    },
  ];
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
    inner: {
      flex: 1,
      paddingHorizontal: Spacing["2xl"],
      justifyContent: "center",
      gap: Spacing.xl,
      // Keeps the card and its explanation clear of the header inset once the
      // content is taller than the viewport and `flex: 1` has nothing to give.
      paddingVertical: Spacing.xl,
    },
    // Card
    card: {
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      padding: Spacing.xl,
      alignItems: "center",
      gap: Spacing.sm,
    },
    avatarCircle: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE / 2,
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
      fontFamily: FontFamily.mono,
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
