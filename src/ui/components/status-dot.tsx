// StatusDot component.
// A small colored indicator for peer / network online state.

import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../theme";

type Status = "online" | "offline" | "syncing";

interface Props {
  status: Status;
  size?: number;
}

const STATUS_COLORS: Record<Status, string> = {
  online: Colors.online,
  offline: Colors.offline,
  syncing: Colors.syncing,
};

export default function StatusDot({
  status,
  size = 8,
}: Props): React.JSX.Element {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: STATUS_COLORS[status],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    flexShrink: 0,
  },
});
