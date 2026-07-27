// Long-press context menu for a message: save, forward, copy, info.
// Reuses the same bottom-sheet chrome as the attachment picker and channel
// info sheet so it doesn't introduce a new UI paradigm.

import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ChatMessage } from "../../store/chat-store";
import BottomSheet from "../../ui/components/bottom-sheet";
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
  onInfo: () => void;
  // Get an attachment out of the app. Received files live in Airhop's private
  // cache, so without this a photo or a document dies with the cache.
  onSave: () => void;
}

export default function MessageActionSheet({
  message,
  onClose,
  onForward,
  onCopy,
  onInfo,
  onSave,
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

  // Photos and videos have somewhere to go (the system gallery); everything
  // else goes out through the share sheet, so the row says what will happen.
  const isGallery =
    message.attachment?.type === "image" ||
    message.attachment?.type === "video";

  return (
    <BottomSheet visible onClose={onClose} sheetStyle={styles.sheet}>
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
        {message.attachment && (
          <>
            {canShowInfo && <View style={styles.divider} />}
            <ActionRow
              icon={isGallery ? "download" : "share-2"}
              label={isGallery ? "Save to photos" : "Save a copy"}
              onPress={() => act(onSave)}
              color={Colors.textPrimary}
            />
          </>
        )}
        {(canShowInfo || message.attachment) && <View style={styles.divider} />}
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
      </View>
    </BottomSheet>
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
    sheet: {
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing["2xl"],
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
