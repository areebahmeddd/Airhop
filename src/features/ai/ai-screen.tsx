// AI assistant screen.
// Local, offline-only LLM assistant for on-device questions when there is
// no network at all (e.g. survival or first-aid questions in the field).
// No inference is wired up yet, so this only shows a placeholder state.

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FontSize, Spacing, useThemeColors } from "../../ui/theme";

export default function AiScreen(): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="robot-outline"
        size={40}
        color={Colors.textMuted}
      />
      <Text style={styles.subtitle}>
        A local, offline-only assistant is coming soon, so you can get help
        anytime.
      </Text>
    </View>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.xl,
      gap: Spacing.md,
      backgroundColor: Colors.bg,
    },
    subtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: FontSize.sm * 1.6,
    },
  });
}
