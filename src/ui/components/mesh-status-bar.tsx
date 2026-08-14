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

import { t, useLanguage } from "@i18n";
import type {
  BannerAction,
  BannerTone,
  MeshBanner,
} from "@store/mesh-state-store";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
  // Perform a banner's one-tap fix. Every blocker that a user can do something
  // about carries one, because the alternative is a red bar describing a
  // problem and leaving them to find the setting themselves - and the settings
  // in question (the OS location toggle, the app's own permission page) are not
  // somewhere people think to look when a chat app says it cannot see anyone.
  onAction?: (kind: BannerAction) => void;
  // Put an advisory away for good. Only banners marked dismissible offer this;
  // a real blocker has no × , because hiding it would leave an empty radar with
  // nothing explaining it.
  onDismiss?: (key: string) => void;
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

// What the button promises to do, for a screen reader. The visible label is
// deliberately terse ("Turn on"), which reads as an unanswered question without
// the surrounding banner text that a screen reader announces separately.
//
// Module-level `t` rather than the hook: this is called during render from the
// component below, which subscribes to the locale itself, so the lookup is
// always current without threading a translator through.
function actionHint(kind: BannerAction): string {
  switch (kind) {
    case "resume":
      return t("mesh.banner.hint.resume");
    case "enable-bluetooth":
      return t("mesh.banner.hint.enable_bluetooth");
    case "open-location-settings":
      return t("mesh.banner.hint.location_settings");
    case "open-app-settings":
      return t("mesh.banner.hint.app_settings");
    case "open-background-limits":
      return t("mesh.banner.hint.battery_settings");
  }
}

export default function MeshStatusBar({
  banners,
  onAction,
  onDismiss,
}: Props): React.JSX.Element | null {
  const Colors = useThemeColors();
  // The accessibility hints below are built with the module-level `t`, so this
  // is what makes them re-read on a language change rather than relying on an
  // ancestor to re-render.
  void useLanguage();
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
          {banner.dismissible && onDismiss && (
            <Pressable
              style={styles.dismiss}
              onPress={() => onDismiss(banner.key)}
              hitSlop={hitSlopFor(RESUME_PILL_HEIGHT)}
              accessibilityRole="button"
              accessibilityLabel={t("mesh.banner.dismiss", {
                label: banner.label,
              })}
              accessibilityHint={t("mesh.banner.hint.dismiss")}
            >
              <Text
                style={[styles.dismissText, { color: Colors.textMuted }]}
                maxFontSizeMultiplier={MaxFontScale.chrome}
              >
                {"×"}
              </Text>
            </Pressable>
          )}
          {banner.action && onAction && (
            <Pressable
              style={[styles.action, { borderColor: Colors.border }]}
              onPress={() => onAction(banner.action!.kind)}
              // The pill draws small so the banner stays slim; the slop is what
              // gets the target to the 44pt floor. It was 8, leaving it at 39.
              hitSlop={hitSlopFor(RESUME_PILL_HEIGHT)}
              accessibilityRole="button"
              accessibilityLabel={`${banner.action.label}: ${banner.label}`}
              accessibilityHint={actionHint(banner.action.kind)}
            >
              <Text
                style={[styles.actionText, { color: Colors.textPrimary }]}
                maxFontSizeMultiplier={MaxFontScale.chrome}
              >
                {banner.action.label}
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
  dismiss: {
    // Drawn after the label and before the action pill, so the reading order is
    // "what is wrong, put it away, or fix it" and the fix stays the rightmost
    // (and most reachable) target.
    paddingHorizontal: Spacing.xs,
    flexShrink: 0,
  },
  dismissText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.base + 2,
  },
});
