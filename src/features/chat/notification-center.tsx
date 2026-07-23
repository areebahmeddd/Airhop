// Notification center: the history behind the bell icon.
//
// A single running list of inbound activity across DMs and channels, the way
// Instagram's activity tab or a chat app's notification history reads: avatar,
// who it was from, a one-line preview, and when. Tap a row to jump to that
// conversation. The data comes from activity-store, which logs one entry per
// inbound message.

import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useActivityStore,
  type ActivityEntry,
} from "../../store/activity-store";
import Avatar from "../../ui/components/avatar";
import { FontSize, FontWeight, Spacing, useThemeColors } from "../../ui/theme";
import { resolveDisplayName } from "../../utils/display-name";

interface Props {
  visible: boolean;
  onClose: () => void;
  onOpenChannel: (channel: string) => void;
}

export default function NotificationCenter({
  visible,
  onClose,
  onOpenChannel,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const entries = useActivityStore((s) => s.entries);
  const clearAll = useActivityStore((s) => s.clearAll);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerBtn}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close notifications"
            hitSlop={8}
          >
            <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
          {entries.length > 0 ? (
            <Pressable
              style={styles.headerBtn}
              onPress={clearAll}
              accessibilityRole="button"
              accessibilityLabel="Clear all notifications"
              hitSlop={8}
            >
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          ) : (
            <View style={styles.headerBtn} />
          )}
        </View>

        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Row
              entry={item}
              styles={styles}
              onPress={() => onOpenChannel(item.channel)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather
                name="bell"
                size={36}
                color={Colors.textMuted}
                style={{ opacity: 0.4 }}
              />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubtitle}>
                Messages from your channels and{"\n"}direct chats will show up
                here.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

function Row({
  entry,
  styles,
  onPress,
}: {
  entry: ActivityEntry;
  styles: ReturnType<typeof createStyles>;
  onPress: () => void;
}): React.JSX.Element {
  // DMs read best under the peer's resolved contact name; a channel message
  // keeps the sender's nickname and tags which channel it came from.
  const name = entry.isDM
    ? resolveDisplayName(entry.senderID)
    : entry.senderNickname;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      layout={LinearTransition.duration(200)}
    >
      <Pressable
        style={[styles.row, !entry.seen && styles.rowUnseen]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Open conversation with ${name}`}
      >
        <Avatar username={name} peerID={entry.senderID} size={44} />
        <View style={styles.rowContent}>
          <View style={styles.rowTop}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
              {!entry.isDM && (
                <Text style={styles.channelTag}> in {entry.channel}</Text>
              )}
            </Text>
            <Text style={styles.time}>{formatTime(entry.timestampMs)}</Text>
          </View>
          <Text style={styles.preview} numberOfLines={2}>
            {entry.preview}
          </Text>
        </View>
        {!entry.seen && <View style={styles.unseenDot} />}
      </Pressable>
    </Animated.View>
  );
}

function formatTime(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  return isToday
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },
    headerBtn: {
      minWidth: 60,
      height: 32,
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    clearText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.accent,
      textAlign: "right",
    },
    list: {
      flexGrow: 1,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      minHeight: 68,
    },
    // A whisper of accent so unread activity is scannable without shouting.
    rowUnseen: {
      backgroundColor: Colors.accentGhost,
    },
    rowContent: {
      flex: 1,
      gap: 3,
    },
    rowTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    name: {
      flex: 1,
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    channelTag: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.regular,
      color: Colors.textMuted,
    },
    time: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      marginLeft: Spacing.sm,
    },
    preview: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
    },
    unseenDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.accent,
      marginLeft: Spacing.xs,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginLeft: 60 + Spacing.base,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Spacing["4xl"],
      gap: Spacing.md,
    },
    emptyTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textSecondary,
    },
    emptySubtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: FontSize.sm * 1.6,
    },
  });
}
