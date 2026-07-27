// Support sub-screen: Dodo Payments, a hosted checkout covering cards, UPI,
// netbanking, and wallets worldwide, plus GitHub Sponsors (no platform fee)
// and Bitcoin (coming soon).

import React, { useMemo } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { FontSize, Radius, Spacing, useThemeColors } from "../../../ui/theme";
import {
  GroupDivider,
  SettingLinkRow,
  SettingRow,
  SubHeader,
  useSharedStyles,
} from "../shared";

interface Props {
  onBack: () => void;
}

// Product id copied from the Dodo dashboard. Empty until the account clears
// review, and the checkout row renders as "coming soon" while it is, so a
// half-configured build can never open a dead checkout.
const DODO_PRODUCT_ID = "";

// Dodo serves static payment links at /buy/<product_id>. redirect_url is where
// the browser lands once payment completes.
const DODO_CHECKOUT_URL = DODO_PRODUCT_ID
  ? `https://checkout.dodopayments.com/buy/${DODO_PRODUCT_ID}` +
    `?quantity=1&redirect_url=${encodeURIComponent(
      "https://airhop.1mindlabs.org/#support",
    )}`
  : null;

const GITHUB_SPONSORS_URL = "https://github.com/sponsors/areebahmeddd";

export default function SupportScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const localStyles = useMemo(() => createLocalStyles(Colors), [Colors]);
  return (
    <View style={styles.container}>
      <SubHeader title="Support" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            {DODO_CHECKOUT_URL ? (
              <SettingLinkRow
                icon="credit-card"
                label="Card or UPI"
                description="Netbanking and wallets too, worldwide"
                onPress={() => void Linking.openURL(DODO_CHECKOUT_URL)}
                accessibilityLabel="Support by card, UPI, netbanking, or wallet"
                external
              />
            ) : (
              <SettingRow
                icon="credit-card"
                label="Card or UPI"
                control={<Text style={styles.comingSoon}>Coming soon</Text>}
              />
            )}
            <GroupDivider />
            <SettingLinkRow
              icon="github"
              label="GitHub Sponsors"
              description="Monthly or one-time, no platform fee"
              onPress={() => void Linking.openURL(GITHUB_SPONSORS_URL)}
              accessibilityLabel="Support through GitHub Sponsors"
              external
            />
            <GroupDivider />
            <SettingRow
              icon="dollar-sign"
              label="Bitcoin"
              control={<Text style={styles.comingSoon}>Coming soon</Text>}
            />
          </View>
        </View>
        <View style={localStyles.note}>
          <Text style={localStyles.noteText}>
            I build Airhop in my free time, with no investors and no ads. If it
            is useful to you, a one-off or monthly contribution helps keep it
            going. Every feature stays free either way.
          </Text>
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
