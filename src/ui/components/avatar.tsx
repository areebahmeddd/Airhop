// Avatar component.
// A circular badge showing the first two characters of a username,
// with a background color deterministically derived from the peer ID.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { avatarColor, Colors, FontWeight } from "../theme";

interface Props {
  username: string;
  peerID: string;
  size?: number;
}

export default function Avatar({
  username,
  peerID,
  size = 40,
}: Props): React.JSX.Element {
  const initials = username.slice(0, 2).toUpperCase();
  const bg = avatarColor(peerID);
  const fontSize = size * 0.36;

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg + "22",
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize, color: bg }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  initials: {
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
  },
});
