// Support sub-screen, ordered by how most people will actually pay: Dodo
// Payments first (a hosted checkout covering cards, UPI, netbanking and wallets
// worldwide), then GitHub Sponsors (no platform fee).

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

// Pay-what-you-want product id from the Dodo dashboard.
const DODO_PRODUCT_ID = "pdt_0NkbLWhlAvN1028Lzqwed";

// Dodo serves static payment links at /buy/<product_id>. redirect_url is where
// the browser lands once payment completes.
const DODO_CHECKOUT_URL =
  `https://checkout.dodopayments.com/buy/${DODO_PRODUCT_ID}` +
  `?quantity=1&redirect_url=${encodeURIComponent(
    "https://airhop.1mindlabs.org/#support",
  )}`;

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
              onPress={() => void Linking.openURL(DODO_CHECKOUT_URL)}
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
