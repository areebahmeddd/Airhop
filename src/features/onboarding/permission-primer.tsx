// The one screen shown before the OS asks for Bluetooth and Location.
//
// Not a gate. It is a sheet, it appears once per install, its single button
// resolves whatever the user does, and nothing downstream branches on it. The
// app behind it is already usable.
//
// It exists because the Android ask is genuinely confusing on its face - a chat
// app wanting your location reads as tracking - and because a refusal there is
// the most expensive mistake in the whole flow: two "Don't allow"s and the
// permission is blocked for good, after which the only route back is the
// Settings deep-link. Saying why first is the cheapest possible insurance
// against that, and it is what every app with a non-obvious permission does.
//
// Deliberately says what Airhop does NOT do with location, because that is the
// actual question in the user's head, and answering it is the whole point.

import Feather from "@expo/vector-icons/Feather";
import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useT, type Translator } from "../../i18n";
import BottomSheet from "../../ui/components/bottom-sheet";
import PrimaryButton from "../../ui/components/primary-button";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";

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

// Android couples BLE scanning to location and iOS does not, so the second row
// only appears where it is true. Saying "Android needs this" on an iPhone would
// be both wrong and alarming.
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
  return rows;
}

export default function PermissionPrimer({
  visible,
  onAcknowledge,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const T = useT();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const rows = useMemo(() => reasons(T), [T]);

  return (
    // Dismissing by drag or backdrop counts as acknowledged. The sheet is an
    // explanation, not a question, so there is no wrong way to close it and
    // nothing should be waiting on a specific gesture.
    <BottomSheet visible={visible} onClose={onAcknowledge}>
      <View style={styles.body}>
        <Text style={styles.title}>{T("onboarding.primer.title")}</Text>
        <Text style={styles.lede}>{T("onboarding.primer.lede")}</Text>

        {rows.map((row) => (
          <View key={row.key} style={styles.row}>
            <View style={styles.iconWrap}>
              <Feather name={row.icon} size={16} color={Colors.textSecondary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{row.title}</Text>
              <Text style={styles.rowBody}>{row.body}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.footnote}>{T("onboarding.primer.footnote")}</Text>

        <PrimaryButton
          label={T("common.continue")}
          onPress={onAcknowledge}
          accessibilityLabel={T("onboarding.primer.cta_a11y")}
        />
      </View>
    </BottomSheet>
  );
}

function createStyles(
  Colors: ReturnType<typeof useThemeColors>,
): ReturnType<typeof StyleSheet.create> {
  return StyleSheet.create({
    body: {
      gap: Spacing.base,
    },
    title: {
      fontSize: FontSize.xl,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    lede: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      marginTop: -Spacing.sm,
    },
    row: {
      flexDirection: "row",
      gap: Spacing.md,
      alignItems: "flex-start",
    },
    iconWrap: {
      width: 32,
      height: 32,
      borderRadius: Radius.sm,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.accentGhost,
      flexShrink: 0,
    },
    rowText: {
      flex: 1,
      gap: 2,
    },
    rowTitle: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    rowBody: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm + 6,
    },
    footnote: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      lineHeight: FontSize.xs + 5,
    },
  });
}
