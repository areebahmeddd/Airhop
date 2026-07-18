// MeshStatusBar component.
// A slim contextual banner that surfaces the BLE mesh connectivity state.
// Rendered below the header when BLE is off or scanning.
// Hidden entirely when mesh is connected and healthy.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, FontSize, FontWeight, Spacing } from "../theme";

export type MeshState =
  | "connected" // at least one peer in range
  | "scanning" // active scan, no peers yet
  | "offline" // BLE disabled or permission denied
  | "nostr"; // internet fallback via Nostr (no BLE peers)

interface Props {
  state: MeshState;
  peerCount?: number;
}

const CONFIG: Record<
  MeshState,
  { label: (n?: number) => string; bg: string; text: string }
> = {
  connected: {
    label: (n) => `${n ?? 0} peer${n !== 1 ? "s" : ""} in range`,
    bg: "rgba(34,197,94,0.10)",
    text: Colors.online,
  },
  scanning: {
    label: () => "Scanning for peers\u2026",
    bg: "rgba(245,158,11,0.10)",
    text: Colors.syncing,
  },
  offline: {
    label: () => "Bluetooth off \u2014 mesh unavailable",
    bg: Colors.dangerDim,
    text: Colors.danger,
  },
  nostr: {
    label: () => "No local peers \u2014 relaying via Nostr",
    bg: Colors.accentGhost,
    text: Colors.textSecondary,
  },
};

export default function MeshStatusBar({
  state,
  peerCount,
}: Props): React.JSX.Element | null {
  // Don't render the bar when connected; the peer count in the header is enough.
  if (state === "connected") return null;

  const cfg = CONFIG[state];

  return (
    <View style={[styles.bar, { backgroundColor: cfg.bg }]}>
      <View style={[styles.indicator, { backgroundColor: cfg.text }]} />
      <Text style={[styles.label, { color: cfg.text }]}>
        {cfg.label(peerCount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs + 2,
    gap: Spacing.sm,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.2,
  },
});
