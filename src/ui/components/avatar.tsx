// Avatar component.
// A circular badge showing the first two characters of a username,
// with a background color deterministically derived from the peer ID.

import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { avatarColor, FontWeight, useThemeColors } from "../theme";

interface Props {
  username: string;
  peerID: string;
  size?: number;
  // When set, the avatar acts as a tab icon: dimmed like an inactive icon
  // and ringed with the accent color like an active one, instead of always
  // showing its full peer color.
  active?: boolean;
  // Presence dot overlaid at the bottom-right: green when reachable, grey when
  // not. Omit for no dot. `ringColor` should match the background the avatar
  // sits on so the dot reads as a badge; defaults to the base background.
  presence?: "online" | "offline";
  ringColor?: string;
}

export default function Avatar({
  username,
  peerID,
  size = 40,
  active,
  presence,
  ringColor,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const initials = username.slice(0, 2).toUpperCase();
  const bg = avatarColor(peerID);
  const fontSize = size * 0.36;
  const borderColor =
    active === undefined
      ? Colors.border
      : active
        ? Colors.accent
        : Colors.border;

  // Presence dot, matching the profile screen's status dot proportions:
  // ~0.1875 of the avatar, a ~2% border in the background colour, inset ~2%.
  const dotSize = Math.max(8, Math.round(size * 0.1875));
  const dotBorder = Math.max(1.5, Math.round(size * 0.02));
  const dotInset = Math.max(1, Math.round(size * 0.02));
  const presenceColor = presence === "online" ? Colors.online : Colors.offline;

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg + "22",
          borderColor,
          borderWidth: active ? 1.5 : 1,
        },
        active === false && styles.inactive,
      ]}
    >
      <Text style={[styles.initials, { fontSize, color: bg }]}>{initials}</Text>
      {presence !== undefined && (
        <View
          style={{
            position: "absolute",
            right: dotInset,
            bottom: dotInset,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            borderWidth: dotBorder,
            borderColor: ringColor ?? Colors.bg,
            backgroundColor: presenceColor,
          }}
        />
      )}
    </View>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    circle: {
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: Colors.border,
    },
    inactive: {
      opacity: 0.6,
    },
    initials: {
      fontWeight: FontWeight.semibold,
      letterSpacing: 0.5,
    },
  });
}
