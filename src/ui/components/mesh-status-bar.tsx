// MeshStatusBar component.
// A stack of slim contextual banners surfacing Mesh-tab state: a deliberate
// pause (Away), hard blockers (Bluetooth off, permission), and calm notes
// (location off, relaying via Nostr, Tor on, gateway on). Shown only on the
// Mesh tab.
//
// Each banner carries a semantic tone, surfaced only as the color of the leading
// dot so distinct network states read at a glance: red = blocker, amber = a
// feature off, blue = internet relay, purple = Tor, teal = gateway, muted = a
// calm pause. The bar itself stays neutral (subtle tint, secondary text); the
// dot is the single point of color, keeping the Mesh tab minimal.
//
// Several can be active at once (e.g. Bluetooth AND location off), so they
// render one below the other, severity-first. Renders nothing when the list is
// empty, so a healthy mesh with peers shows no chrome at all.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { BannerTone, MeshBanner } from "../../store/mesh-state-store";
import { FontSize, FontWeight, Spacing, useThemeColors } from "../theme";

interface Props {
  banners: MeshBanner[];
}

// The dot color for each tone. This is the only place a banner shows its hue;
// the bar background and text are the same neutral for every banner.
function dotColor(
  tone: BannerTone,
  Colors: ReturnType<typeof useThemeColors>,
): string {
  switch (tone) {
    case "danger":
      return Colors.danger;
    case "caution":
      return Colors.syncing;
    case "relay":
      return Colors.relay;
    case "tor":
      return Colors.tor;
    case "gateway":
      return Colors.gateway;
    case "neutral":
      return Colors.textMuted;
  }
}

export default function MeshStatusBar({
  banners,
}: Props): React.JSX.Element | null {
  const Colors = useThemeColors();
  if (banners.length === 0) return null;

  return (
    <View>
      {banners.map((banner) => (
        <View
          key={banner.key}
          style={[styles.bar, { backgroundColor: Colors.accentGhost }]}
        >
          <View
            style={[
              styles.indicator,
              { backgroundColor: dotColor(banner.tone, Colors) },
            ]}
          />
          <Text style={[styles.label, { color: Colors.textSecondary }]}>
            {banner.label}
          </Text>
        </View>
      ))}
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
