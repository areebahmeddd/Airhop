// Long-press context menu for a message: forward, copy, star.
// Reuses the same bottom-sheet chrome as the attachment picker and channel
// info sheet so it doesn't introduce a new UI paradigm.

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
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
  onTogglePin: () => void;
  onToggleStar: () => void;
  onInfo: () => void;
}

export default function MessageActionSheet({
  message,
  onClose,
  onForward,
  onCopy,
  onTogglePin,
  onToggleStar,
  onInfo,
}: Props): React.JSX.Element | null {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  if (!message) return null;

  function act(action: () => void): void {
    action();
    onClose();
  }

  // Delivery info is only meaningful for your own outgoing messages.
  const canShowInfo =
    message.isMine && !message.isSystem && message.status !== undefined;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Everyday actions, grouped in one box so it matches the channel
              "more" sheet: transparent rows on a single raised card, hairline
              dividers between them, corners clipped by the card. */}
          <View style={styles.actionGroup}>
            {canShowInfo && (
              <ActionRow
                icon="info"
                label="Message info"
                onPress={() => act(onInfo)}
                color={Colors.textPrimary}
              />
            )}
            {canShowInfo && <View style={styles.divider} />}
            <ActionRow
              icon="corner-up-right"
              label="Forward"
              onPress={() => act(onForward)}
              color={Colors.textPrimary}
            />
            {message.text.length > 0 && (
              <>
                <View style={styles.divider} />
                <ActionRow
                  icon="copy"
                  label="Copy"
                  onPress={() => act(onCopy)}
                  color={Colors.textPrimary}
                />
              </>
            )}
            <View style={styles.divider} />
            <ActionRow
              iconNode={
                <MaterialCommunityIcons
                  name={message.isPinned ? "pin-off" : "pin"}
                  size={18}
                  color={Colors.textPrimary}
                />
              }
              label={message.isPinned ? "Unpin" : "Pin"}
              onPress={() => act(onTogglePin)}
              color={Colors.textPrimary}
            />
            <View style={styles.divider} />
            <ActionRow
              icon="star"
              label={message.isStarred ? "Unstar" : "Star"}
              onPress={() => act(onToggleStar)}
              color={Colors.textPrimary}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ActionRow({
  icon,
  iconNode,
  label,
  onPress,
  color,
}: {
  icon?: React.ComponentProps<typeof Feather>["name"];
  iconNode?: React.ReactNode;
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
      {iconNode ?? (icon && <Feather name={icon} size={17} color={color} />)}
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
    // One raised card owns the background and rounded corners; the rows sit
    // transparent inside it, clipped to the radius by overflow.
    actionGroup: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      overflow: "hidden",
    },
    actionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.base,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.base,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginLeft: Spacing.base,
    },
    actionLabel: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
    },
  });
}
