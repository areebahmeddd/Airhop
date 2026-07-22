// Floating badge for attachment transfers happening outside the current view.
//
// The in-thread progress card disappears when you leave that thread, but the
// transfer keeps running. This badge keeps it visible from anywhere (chat list,
// Mesh, Wallet), the way WhatsApp shows an ongoing upload, and tapping it jumps
// back to the conversation the transfer belongs to.

import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTransferStore } from "../../store/transfer-store";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../theme";

export default function TransferBadge({
  onOpen,
}: {
  onOpen: (channel: string) => void;
}): React.JSX.Element | null {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const transfers = useTransferStore((s) => s.transfers);

  const active = Object.values(transfers)
    .filter((t) => t.status === "active" || t.status === "stalled")
    .sort((a, b) => b.startedAtMs - a.startedAtMs);

  if (active.length === 0) return null;

  const primary = active[0];
  const stalled = primary.status === "stalled";
  const pct =
    primary.totalBytes > 0
      ? Math.min(
          100,
          Math.round((primary.transferredBytes / primary.totalBytes) * 100),
        )
      : 0;

  const label =
    active.length > 1
      ? `${String(active.length)} transfers`
      : stalled
        ? `Waiting · ${primary.name}`
        : `${primary.direction === "send" ? "Sending" : "Receiving"} ${primary.name}`;

  return (
    <Pressable
      style={styles.pill}
      onPress={() => onOpen(primary.channel)}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${String(pct)} percent. Open conversation.`}
    >
      <Feather
        name={
          stalled
            ? "clock"
            : primary.direction === "send"
              ? "arrow-up-circle"
              : "arrow-down-circle"
        }
        size={16}
        color={stalled ? Colors.syncing : Colors.accent}
      />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.pct}>{pct}%</Text>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${pct}%`,
              backgroundColor: stalled ? Colors.syncing : Colors.accent,
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      marginHorizontal: Spacing.base,
      marginBottom: Spacing.sm,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.full,
      backgroundColor: Colors.surface,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    label: {
      flex: 1,
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    pct: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: Colors.textSecondary,
      fontVariant: ["tabular-nums"],
    },
    // Thin progress line pinned to the bottom edge of the pill.
    track: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 2,
    },
    fill: {
      height: 2,
      backgroundColor: Colors.accent,
    },
  });
}
