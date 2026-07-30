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
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { BannerTone, MeshBanner } from "../../store/mesh-state-store";
import {
  FontSize,
  FontWeight,
  hitSlopFor,
  MaxFontScale,
  Radius,
  Spacing,
  useThemeColors,
} from "../theme";

// The tone dot's diameter. Named so its radius below stays a circle.
const DOT_SIZE = 6;

// Drawn height of the "Resume" pill: 5pt padding either side of an 11pt label.
// Named only so hitSlopFor() has something honest to measure against.
const RESUME_PILL_HEIGHT = 24;

interface Props {
  banners: MeshBanner[];
  // Turn the mesh back on. Shown only on the paused banner, because Away is the
  // one state reachable from outside the app (the background notification's
  // "Stop mesh"), and someone who arrives in it that way has no reason to know
  // the way out lives under Profile → Status.
  onResume?: () => void;
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
    case "bridge":
      return Colors.bridge;
    case "neutral":
      return Colors.textMuted;
  }
}

export default function MeshStatusBar({
  banners,
  onResume,
}: Props): React.JSX.Element | null {
  const Colors = useThemeColors();
  if (banners.length === 0) return null;

  return (
    // One live region for the stack. Bluetooth being switched off, a permission
    // being revoked in system settings, or Tor coming up are all things that
    // happen TO the user rather than because of them, and until now the only way
    // to learn about any of them was to look. "polite" so it waits for a pause
    // rather than cutting across whatever is being read.
    <View accessibilityLiveRegion="polite">
      {banners.map((banner, index) => (
        <View
          key={banner.key}
          style={[
            styles.bar,
            { backgroundColor: Colors.accentGhost },
            // Several banners can be up at once, and with one flat tint behind
            // all of them they ran together as a single paragraph. A hairline
            // between keeps them countable.
            index > 0 && {
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: Colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.indicator,
              { backgroundColor: dotColor(banner.tone, Colors) },
            ]}
          />
          <Text
            style={[styles.label, { color: Colors.textSecondary }]}
            maxFontSizeMultiplier={MaxFontScale.chrome}
          >
            {banner.label}
          </Text>
          {banner.key === "paused" && onResume && (
            <Pressable
              style={[styles.action, { borderColor: Colors.border }]}
              onPress={onResume}
              // The pill draws small so the banner stays slim; the slop is what
              // gets the target to the 44pt floor. It was 8, leaving it at 39.
              hitSlop={hitSlopFor(RESUME_PILL_HEIGHT)}
              accessibilityRole="button"
              accessibilityLabel="Resume the mesh"
              accessibilityHint="Turns Bluetooth advertising and scanning back on"
            >
              <Text
                style={[styles.actionText, { color: Colors.textPrimary }]}
                maxFontSizeMultiplier={MaxFontScale.chrome}
              >
                Resume
              </Text>
            </Pressable>
          )}
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
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    // Never let the dot be squeezed out by a long label wrapping beside it: it
    // is the only thing carrying the banner's severity.
    flexShrink: 0,
  },
  label: {
    flex: 1,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.2,
  },
  action: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    flexShrink: 0,
  },
  actionText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
