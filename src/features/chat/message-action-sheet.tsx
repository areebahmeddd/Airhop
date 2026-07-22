// Long-press context menu for a message: forward, copy, star.
// Reuses the same bottom-sheet chrome as the attachment picker and channel
// info sheet so it doesn't introduce a new UI paradigm.

import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { ChatMessage } from "../../store/chat-store";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";

interface Props {
  message: ChatMessage | null;
  onClose: () => void;
  onForward: () => void;
  onCopy: () => void;
  onToggleStar: () => void;
}

export default function MessageActionSheet({
  message,
  onClose,
  onForward,
  onCopy,
  onToggleStar,
}: Props): React.JSX.Element | null {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  if (!message) return null;

  function act(action: () => void): void {
    action();
    onClose();
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <ActionRow
            icon="corner-up-right"
            label="Forward"
            onPress={() => act(onForward)}
            color={Colors.textPrimary}
          />
          {message.text.length > 0 && (
            <ActionRow
              icon="copy"
              label="Copy"
              onPress={() => act(onCopy)}
              color={Colors.textPrimary}
            />
          )}
          <ActionRow
            icon="star"
            label={message.isStarred ? "Unstar" : "Star"}
            onPress={() => act(onToggleStar)}
            color={Colors.textPrimary}
          />
        </View>
      </View>
    </Modal>
  );
}

function ActionRow({
  icon,
  label,
  onPress,
  color,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  onPress: () => void;
  color: string;
}): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  return (
    <Pressable
      style={styles.actionRow}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Feather name={icon} size={17} color={color} />
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: Colors.overlay,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.base,
      paddingBottom: Spacing["2xl"],
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.borderStrong,
      alignSelf: "center",
      marginBottom: Spacing.base,
    },
    actionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.base,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.sm,
      borderRadius: Radius.md,
      backgroundColor: Colors.surfaceRaised,
      marginBottom: Spacing.xs,
    },
    actionLabel: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
    },
  });
}
