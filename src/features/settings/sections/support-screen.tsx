// Support sub-screen. Two links, both of which leave the app.
//
// Neither goes straight to a checkout, and that is the point. App Store Review
// Guideline 3.1.1 treats an in-app path to a payment sheet as a purchase that
// has to go through in-app purchase, and the carve-outs (registered nonprofits,
// person-to-person gifts) do not cover supporting an individual developer. An
// app that opens a hosted checkout from a "Support" row is the exact shape that
// gets rejected. Sending people to the website instead is what every project in
// this position does, it is explicitly permitted, and it costs one tap.
//
// The card option therefore points at the Support section of the site, which
// carries the same two choices - Dodo Payments for cards, UPI, netbanking and
// wallets, and GitHub Sponsors - and owns the checkout itself. GitHub Sponsors
// stays a direct link because it is a third-party page the user already has an
// account relationship with, not a checkout this app is presenting.
//
// Kept identical on both platforms deliberately. A payment path that differs by
// OS is two flows to reason about and two to keep compliant, for no benefit to
// anyone using it.

import React, { useMemo } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { useT } from "../../../i18n";
import { FontSize, Radius, Spacing, useThemeColors } from "../../../ui/theme";
import {
  GroupDivider,
  SettingLinkRow,
  SubHeader,
  useSharedStyles,
} from "../shared";

interface Props {
  onBack: () => void;
}

// The Support section of the website, which owns the Dodo Payments checkout
// (cards, UPI, netbanking and wallets) and repeats the GitHub Sponsors link.
// See the note at the top of this file for why the app does not open the
// checkout itself.
const SUPPORT_URL = "https://airhop.1mindlabs.org/#support";

const GITHUB_SPONSORS_URL = "https://github.com/sponsors/areebahmeddd";

export default function SupportScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const T = useT();
  const styles = useSharedStyles();
  const localStyles = useMemo(() => createLocalStyles(Colors), [Colors]);
  return (
    <View style={styles.container}>
      <SubHeader title={T("settings.section.support")} onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingLinkRow
              icon="credit-card"
              label={T("settings.support.card")}
              description={T("settings.support.card_desc")}
              onPress={() => void Linking.openURL(SUPPORT_URL)}
              accessibilityLabel={T("settings.support.card_a11y")}
              external
            />
            <GroupDivider />
            <SettingLinkRow
              icon="github"
              label={T("settings.support.sponsors")}
              description={T("settings.support.sponsors_desc")}
              onPress={() => void Linking.openURL(GITHUB_SPONSORS_URL)}
              accessibilityLabel={T("settings.support.sponsors_a11y")}
              external
            />
          </View>
        </View>
        <View style={localStyles.note}>
          <Text style={localStyles.noteText}>{T("settings.support.note")}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function createLocalStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    // A small personal note, set in its own soft card so it reads as an aside
    // rather than a plea tacked under the payment rows.
    note: {
      marginTop: Spacing.xs,
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.base,
    },
    noteText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm * 1.6,
    },
  });
}
