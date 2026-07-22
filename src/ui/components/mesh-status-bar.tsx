// MeshStatusBar component.
// A slim contextual banner that surfaces the BLE mesh connectivity state.
// Rendered below the header only when something is actionable: the radio is
// off, or traffic has fallen back to Nostr.
//
// "Connected" and "scanning" render nothing. The header peer count already
// covers the first, and the radar view says "Scanning for nearby peers" in
// its own empty state, so a banner repeating it on every tab was noise.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FontSize, FontWeight, Spacing, useThemeColors } from "../theme";

export type MeshState =
  | "connected" // at least one peer in range
  | "scanning" // active scan, no peers yet
  | "offline" // BLE disabled or permission denied
  | "nostr"; // internet fallback via Nostr (no BLE peers)

interface Props {
  state: MeshState;
}

// Only the states that actually render need an entry here.
type BannerState = Exclude<MeshState, "connected" | "scanning">;

function getConfig(
  Colors: ReturnType<typeof useThemeColors>,
): Record<BannerState, { label: string; bg: string; text: string }> {
  return {
    offline: {
      label: "Bluetooth off, mesh unavailable",
      bg: Colors.dangerDim,
      text: Colors.danger,
    },
    nostr: {
      label: "No local peers, relaying via Nostr",
      bg: Colors.accentGhost,
      text: Colors.textSecondary,
    },
  };
}

export default function MeshStatusBar({
  state,
}: Props): React.JSX.Element | null {
  const Colors = useThemeColors();
  if (state === "connected" || state === "scanning") return null;

  const cfg = getConfig(Colors)[state];

  return (
    <View style={[styles.bar, { backgroundColor: cfg.bg }]}>
      <View style={[styles.indicator, { backgroundColor: cfg.text }]} />
      <Text style={[styles.label, { color: cfg.text }]}>{cfg.label}</Text>
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
