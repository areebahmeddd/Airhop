// The one empty state in the app.
//
// Used by dm-list, peer-list, channel-list, notification-center and
// chat-search-results. An empty screen is the first thing a new user sees on four
// of these surfaces, so icon size, opacity, title colour and spacing are fixed
// here rather than per caller, where they drift.
//
// Two variants, because there are two jobs:
//
//   full     the whole surface is empty (no peers, no DMs, no notifications).
//            Centres in the space it is given.
//   compact  one section of an otherwise populated screen is empty (Your Rooms
//            with no rooms in it). Sits inline, no vertical centring, so it does
//            not shove the sections around it.
//
// The three parts are announced as one utterance rather than three stops: an
// empty state is a single sentence to a screen reader, and the icon is
// decoration that should never be read at all.

import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FontSize, FontWeight, Spacing, useThemeColors } from "../theme";

// Held down so the glyph reads as a watermark behind the words rather than
// competing with them for the eye. One value, not 0.4 or 0.6 by file.
const ICON_OPACITY = 0.4;

interface Props {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  // Plain string in almost every case. Accepts a node for the one caller that
  // needs an inline accent inside the sentence ("Tap + above to join one").
  subtitle?: React.ReactNode;
  // Anything tappable that belongs under the copy, e.g. an "Add a mint" link.
  action?: React.ReactNode;
  // Spoken instead of `title` + `subtitle` when the subtitle is a node and so
  // cannot be flattened into a sentence automatically.
  accessibilityLabel?: string;
  compact?: boolean;
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  action,
  accessibilityLabel,
  compact = false,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  return (
    <View
      style={[styles.root, compact ? styles.compact : styles.full]}
      accessible
      accessibilityLabel={
        accessibilityLabel ??
        (typeof subtitle === "string" ? `${title}. ${subtitle}` : title)
      }
    >
      <Feather
        name={icon}
        size={compact ? 26 : 36}
        color={Colors.textMuted}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      {typeof subtitle === "string" ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : (
        subtitle
      )}
      {action}
    </View>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    root: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.xl,
      gap: Spacing.xs,
    },
    full: {
      flex: 1,
      paddingVertical: Spacing["4xl"],
      gap: Spacing.sm,
    },
    compact: {
      paddingVertical: Spacing["2xl"],
    },
    icon: {
      opacity: ICON_OPACITY,
      marginBottom: Spacing.xs,
    },
    title: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textSecondary,
      textAlign: "center",
    },
    subtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: FontSize.sm * 1.6,
    },
  });
}
