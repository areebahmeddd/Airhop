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
}

export default function Avatar({
  username,
  peerID,
  size = 40,
  active,
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
