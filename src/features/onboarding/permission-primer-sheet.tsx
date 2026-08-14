// The sheet shown once before the OS permission prompts.
//
// Not a gate: the app behind it already works, and its one button resolves
// whatever the user does. It exists because a chat app asking for location
// reads as tracking, and because two refusals block the permission for good,
// leaving only the Settings deep-link.
//
// Each row says what the permission does and what it does not.

import Feather from "@expo/vector-icons/Feather";
import { useT, type Translator } from "@i18n";
import BottomSheet from "@ui/components/bottom-sheet";
import PrimaryButton from "@ui/components/primary-button";
import { FontSize, FontWeight, Spacing, useThemeColors } from "@ui/theme";
import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  onAcknowledge: () => void;
}

interface Reason {
  icon: keyof typeof Feather.glyphMap;
  key: string;
  title: string;
  body: string;
}

// One row per prompt startMeshWithPermissions fires, in the order it fires
// them, so the sheet previews what the user is about to see. Location is
// Android-only: BLE scanning is coupled to it there and not on iOS.
function reasons(T: Translator): Reason[] {
  const rows: Reason[] = [
    {
      icon: "bluetooth",
      // Keyed on the permission rather than the translated title, so the list
      // key stays stable when the language changes.
      key: "bluetooth",
      title: T("onboarding.primer.bluetooth.title"),
      body: T("onboarding.primer.bluetooth.body"),
    },
  ];
  if (Platform.OS === "android") {
    rows.push({
      icon: "map-pin",
      key: "location",
      title: T("onboarding.primer.location.title"),
      body: T("onboarding.primer.location.body"),
    });
  }
  rows.push({
    icon: "bell",
    key: "notifications",
    title: T("onboarding.primer.notifications.title"),
    body: T("onboarding.primer.notifications.body"),
  });
  return rows;
}

export default function PermissionPrimerSheet({
  visible,
  onAcknowledge,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const T = useT();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const rows = useMemo(() => reasons(T), [T]);

  return (
    // Dismissing by drag or backdrop counts as acknowledged. The sheet is an
    // explanation, not a question, so there is no wrong way to close it and
    // nothing should be waiting on a specific gesture.
    <BottomSheet
      visible={visible}
      onClose={onAcknowledge}
      // Bottom padding is inline because it has to clear the home indicator.
      sheetStyle={[styles.sheet, { paddingBottom: Spacing.xl + insets.bottom }]}
    >
      <View style={styles.head}>
        <Text style={styles.title}>{T("onboarding.primer.title")}</Text>
        <Text style={styles.lede}>{T("onboarding.primer.lede")}</Text>
      </View>

      <View style={styles.rows}>
        {rows.map((row) => (
          <View key={row.key} style={styles.row}>
            <View style={styles.iconWrap}>
              <Feather name={row.icon} size={18} color={Colors.textSecondary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{row.title}</Text>
              <Text style={styles.rowBody}>{row.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.footnote}>{T("onboarding.primer.footnote")}</Text>

      <PrimaryButton
        label={T("common.continue")}
        onPress={onAcknowledge}
        accessibilityLabel={T("onboarding.primer.cta_a11y")}
      />
    </BottomSheet>
  );
}

function createStyles(
  Colors: ReturnType<typeof useThemeColors>,
): ReturnType<typeof StyleSheet.create> {
  return StyleSheet.create({
    sheet: {
      paddingHorizontal: Spacing.xl,
      gap: Spacing.base,
    },
    head: {
      gap: Spacing.xs,
    },
    title: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    lede: {
      fontSize: FontSize.sm,
      lineHeight: FontSize.sm * 1.55,
      color: Colors.textSecondary,
    },
    rows: {
      gap: Spacing.base,
    },
    row: {
      flexDirection: "row",
      gap: Spacing.md,
      alignItems: "flex-start",
    },
    iconWrap: {
      width: 22,
      flexShrink: 0,
      // Optical alignment with the cap height of the title beside it.
      paddingTop: 1,
    },
    rowText: {
      flex: 1,
      gap: 2,
    },
    rowTitle: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    rowBody: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm * 1.5,
    },
    footnote: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      lineHeight: FontSize.xs * 1.5,
    },
  });
}
