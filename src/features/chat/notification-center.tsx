// Notification center: the history behind the bell icon.
//
// A single running list of inbound activity across DMs, channels and board
// notices, the way Instagram's activity tab or a chat app's notification history
// reads: avatar, who it was from, which room, a one-line preview, and when. Tap
// a row to jump straight to that conversation or channel. The data comes from
// activity-store, which logs one entry per inbound message or notice.

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
import { showAlert } from "../../store/alert-store";
import Avatar from "../../ui/components/avatar";
import EmptyState from "../../ui/components/empty-state";
import {
  Duration,
  FontSize,
  FontWeight,
  HIT_SLOP,
  MIN_TOUCH,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { channelLabel } from "../../utils/chat-display-name";
import { resolveDisplayName } from "../../utils/display-name";
import { formatListTimestamp } from "../../utils/format";

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

  // Clearing wiped the entire history on a single tap of a small text button in
  // the corner, with nothing to undo it. Every other irreversible action in this
  // app asks first (leave a room, clear a chat, remove a contact, panic wipe),
  // through this same alert. This was the one that did not.
  function handleClearAll(): void {
    showAlert(
      "Clear notifications",
      `Remove all ${String(entries.length)} notifications from this list? The messages themselves stay in their conversations.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearAll },
      ],
    );
  }

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
            hitSlop={HIT_SLOP}
          >
            <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle} accessibilityRole="header">
            Notifications
          </Text>
          {entries.length > 0 ? (
            <Pressable
              style={styles.headerBtn}
              onPress={handleClearAll}
              accessibilityRole="button"
              accessibilityLabel={`Clear all ${String(entries.length)} notifications`}
              hitSlop={HIT_SLOP}
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
            <EmptyState
              icon="bell"
              title="No notifications yet"
              subtitle="Messages, mentions, and notices from your channels and chats show up here."
            />
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
  // DMs read best under the peer's resolved contact name; a channel message or
  // notice keeps the sender's nickname and tags which room it came from.
  const name = entry.isDM
    ? resolveDisplayName(entry.senderID)
    : entry.senderNickname;
  const room = entry.isDM ? "" : channelLabel(entry.channel);
  // Formatted once for both the visible time and the row label below.
  const timeLabel = formatListTimestamp(entry.timestampMs);
  // The row's whole content, in reading order, then where the tap goes. The
  // label used to be only the destination ("Open #city"), so the sender, the
  // preview, the time and the unseen dot were all silent: a screen reader user
  // heard a list of identical "Open" buttons.
  const a11y = [
    entry.seen ? null : "New",
    name,
    entry.isDM ? null : entry.kind === "notice" ? `notice in ${room}` : room,
    entry.preview,
    timeLabel,
  ]
    .filter((part) => part !== null)
    .join(", ");

  return (
    <Animated.View
      entering={FadeIn.duration(Duration.base)}
      layout={LinearTransition.duration(Duration.slow)}
    >
      <Pressable
        style={[styles.row, !entry.seen && styles.rowUnseen]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={a11y}
      >
        <Avatar username={name} peerID={entry.senderID} size={44} />
        <View style={styles.rowContent}>
          <View style={styles.rowTop}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
              {!entry.isDM && <Text style={styles.channelTag}> in {room}</Text>}
            </Text>
            <Text style={styles.time}>{timeLabel}</Text>
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
    // 44pt tall, not 32: this is a full-screen modal's own header, so its two
    // controls are the only way out of it and the only way to clear the list.
    headerBtn: {
      minWidth: 60,
      height: MIN_TOUCH,
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
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
      marginLeft: Spacing.xs,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginLeft: 60 + Spacing.base,
    },
  });
}
