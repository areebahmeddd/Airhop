// MeshStatusBar component.
// A stack of slim contextual banners surfacing Mesh-tab state: a deliberate
// pause (Away), hard blockers (Bluetooth off, permission), and calm notes
// (location off, relaying via Nostr, Tor on). Shown only on the Mesh tab.
//
// Several can be active at once (e.g. Bluetooth AND location off), so they
// render one below the other, severity-first. Renders nothing when the list is
// empty, so a healthy mesh with peers shows no chrome at all.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { MeshBanner } from "../../store/mesh-state-store";
import { FontSize, FontWeight, Spacing, useThemeColors } from "../theme";

interface Props {
  banners: MeshBanner[];
}

export default function MeshStatusBar({
  banners,
}: Props): React.JSX.Element | null {
  const Colors = useThemeColors();
  if (banners.length === 0) return null;

  return (
    <View>
      {banners.map((banner) => {
        const danger = banner.tone === "danger";
        const bg = danger ? Colors.dangerDim : Colors.accentGhost;
        const fg = danger ? Colors.danger : Colors.textSecondary;
        return (
          <View key={banner.key} style={[styles.bar, { backgroundColor: bg }]}>
            <View style={[styles.indicator, { backgroundColor: fg }]} />
            <Text style={[styles.label, { color: fg }]}>{banner.label}</Text>
          </View>
        );
      })}
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
