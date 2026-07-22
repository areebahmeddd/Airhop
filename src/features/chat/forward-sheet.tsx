// "Forward to…" target picker. Reuses the existing send pipeline: a forward
// is just composing a new message with the original content in a different
// channel/DM, so it needs no protocol changes at all.

import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useChatStore } from "../../store/chat-store";
import Avatar from "../../ui/components/avatar";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { peerIDToUsername } from "../../utils/username";

interface Props {
  visible: boolean;
  excludeChannel: string;
  onClose: () => void;
  onForward: (targetChannel: string) => void;
}

export default function ForwardSheet({
  visible,
  excludeChannel,
  onClose,
  onForward,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const channels = useChatStore((s) => s.channels);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const targets = channels.filter((c) => c !== excludeChannel);

  function handlePick(channel: string): void {
    onForward(channel);
    setSentTo(channel);
    setTimeout(() => {
      setSentTo(null);
      onClose();
    }, 500);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Forward to…</Text>
          <FlatList
            data={targets}
            keyExtractor={(item) => item}
            style={styles.list}
            renderItem={({ item }) => {
              const isDM = item.startsWith("dm:");
              const label = isDM ? peerIDToUsername(item.slice(3)) : item;
              const justSent = sentTo === item;
              return (
                <Pressable
                  style={styles.row}
                  onPress={() => handlePick(item)}
                  disabled={sentTo !== null}
                  accessibilityRole="button"
                  accessibilityLabel={`Forward to ${label}`}
                >
                  {isDM ? (
                    <Avatar username={label} peerID={item.slice(3)} size={36} />
                  ) : (
                    <View style={styles.channelIcon}>
                      <Feather
                        name="hash"
                        size={16}
                        color={Colors.textSecondary}
                      />
                    </View>
                  )}
                  <Text style={styles.rowLabel} numberOfLines={1}>
                    {label}
                  </Text>
                  {justSent && (
                    <Feather
                      name="check-circle"
                      size={18}
                      color={Colors.success}
                    />
                  )}
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.empty}>No other chats yet.</Text>
            }
          />
        </View>
      </View>
    </Modal>
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
      width: "100%",
      maxHeight: "70%",
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
      paddingTop: Spacing.base,
      paddingBottom: Spacing.xl,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.borderStrong,
      alignSelf: "center",
      marginBottom: Spacing.base,
    },
    title: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
      paddingHorizontal: Spacing.xl,
      marginBottom: Spacing.sm,
    },
    list: {
      paddingHorizontal: Spacing.base,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.sm,
      borderRadius: Radius.md,
      backgroundColor: Colors.surfaceRaised,
      marginBottom: Spacing.xs,
    },
    channelIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.surfaceRaised,
      alignItems: "center",
      justifyContent: "center",
    },
    rowLabel: {
      flex: 1,
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    empty: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
      paddingVertical: Spacing.xl,
    },
  });
}
