// Stands in for the Avatar when a peer is a relay node.
//
// Same circle, same size, same place in the row, so a list of peers keeps its
// rhythm and the one that is not a person still reads as different at a glance.
// Initials are the thing being replaced: a relay has no name worth abbreviating,
// and "BI" over a Bitle node says less than an aerial does.
//
// Deliberately colourless. Avatar tints itself from the peer ID, which is what
// makes a crowd of people look like a crowd; equipment should recede instead.

import { Feather } from "@expo/vector-icons";
import { useThemeColors } from "@ui/theme";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  size?: number;
}

export default function RelayGlyph({ size = 40 }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Feather
        name="radio"
        size={Math.round(size * 0.42)}
        color={Colors.textSecondary}
      />
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
      backgroundColor: Colors.surfaceRaised,
    },
  });
}
