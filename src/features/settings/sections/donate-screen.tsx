// Donate sub-screen: Bitcoin (coming soon), and Razorpay, a hosted payment
// link covering UPI, cards, netbanking, and wallets (India + global).

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useMemo } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../../ui/theme";
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

const RAZORPAY_PAYMENT_LINK = "https://razorpay.me/@1mindlabs";

export default function DonateScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const localStyles = useMemo(() => createLocalStyles(Colors), [Colors]);
  return (
    <View style={styles.container}>
      <SubHeader title="Donate" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="dollar-sign"
              label="Bitcoin"
              control={<Text style={styles.comingSoon}>Coming soon</Text>}
            />
            <GroupDivider />
            <SettingLinkRow
              iconOverride={
                <MaterialCommunityIcons
                  name="currency-inr"
                  size={18}
                  color={Colors.textSecondary}
                />
              }
              label="Razorpay"
              description="UPI, cards, netbanking & wallets"
              onPress={() => void Linking.openURL(RAZORPAY_PAYMENT_LINK)}
              accessibilityLabel="Donate via Razorpay, including UPI"
              external
            />
          </View>
        </View>
        <View style={localStyles.note}>
          <Text style={localStyles.noteText}>
            I build Airhop in my free time, with no investors and no ads. If it
            is useful to you, a small donation helps keep it going.
          </Text>
          <Text style={localStyles.noteSignature}>Areeb</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function createLocalStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    // A small personal note, set in its own soft card so it reads as a signed
    // aside rather than a plea tacked under the payment rows.
    note: {
      marginTop: Spacing.xs,
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.base,
      gap: Spacing.sm,
    },
    noteText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm * 1.6,
    },
    noteSignature: {
      alignSelf: "flex-end",
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontWeight: FontWeight.medium,
    },
  });
}
