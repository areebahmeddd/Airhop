// Channel list screen.
// Shows all joined public channels with last-message preview and unread counts.
// Tap a channel to open its message thread. FAB at bottom-right to join/create.

import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useChatStore } from "../../store/chat-store";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../ui/theme";

interface Props {
  onSelectChannel: (channel: string) => void;
}

export default function ChannelList({
  onSelectChannel,
}: Props): React.JSX.Element {
  const { channels, messages, addChannel } = useChatStore();
  const [showModal, setShowModal] = useState(false);
  const [newChannel, setNewChannel] = useState("");

  function handleAdd(): void {
    const name = newChannel.trim().replace(/^#*/, "#");
    if (name.length < 2) return;
    addChannel(name);
    setNewChannel("");
    setShowModal(false);
  }

  // Public channels only (filter out dm: prefixed channels).
  const publicChannels = channels.filter((c) => !c.startsWith("dm:"));

  return (
    <View style={styles.container}>
      <FlatList
        data={publicChannels}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const msgs = messages[item] ?? [];
          const last = msgs[msgs.length - 1];
          const unread = msgs.filter((m) => !m.isMine).length;

          return (
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
              onPress={() => onSelectChannel(item)}
              accessibilityRole="button"
              accessibilityLabel={`Open channel ${item}`}
            >
              {/* Content */}
              <View style={styles.rowContent}>
                <View style={styles.rowTop}>
                  <Text style={styles.channelName} numberOfLines={1}>
                    <Text style={styles.channelHash}>#</Text>
                    {item.replace(/^#/, "")}
                  </Text>
                  {last ? (
                    <Text style={styles.timestamp}>
                      {formatTime(last.timestampMs)}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.rowBottom}>
                  {last ? (
                    <Text style={styles.preview} numberOfLines={1}>
                      <Text style={styles.previewSender}>
                        {last.isMine ? "You" : last.senderNickname}:{" "}
                      </Text>
                      {last.text}
                    </Text>
                  ) : (
                    <Text style={styles.previewEmpty}>No messages yet</Text>
                  )}
                  {unread > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {unread > 99 ? "99+" : unread}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather
              name="hash"
              size={36}
              color={Colors.textMuted}
              style={{ opacity: 0.4 }}
            />
            <Text style={styles.emptyTitle}>No channels</Text>
            <Text style={styles.emptySubtitle}>
              Tap + to join or create a channel.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      {/* Floating action button */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => setShowModal(true)}
        accessibilityRole="button"
        accessibilityLabel="Add or join a channel"
      >
        <Feather name="plus" size={22} color={Colors.textInverse} />
      </Pressable>

      {/* Add channel modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Join or create</Text>
            <TextInput
              style={styles.modalInput}
              value={newChannel}
              onChangeText={setNewChannel}
              placeholder="#channel-name"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
              autoFocus
              onSubmitEditing={handleAdd}
              returnKeyType="done"
              selectionColor={Colors.accent}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalConfirm} onPress={handleAdd}>
                <Text style={styles.modalConfirmText}>Join</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function formatTime(ms: number): string {
  const d = new Date(ms);
  const now = new Date();
  if (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  ) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  list: {
    flexGrow: 1,
    paddingBottom: 88, // room for FAB
  },
  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    minHeight: 68,
  },
  rowPressed: {
    backgroundColor: Colors.surface,
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
  rowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  channelName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  channelHash: {
    color: Colors.textMuted,
    fontWeight: FontWeight.regular,
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
  preview: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  previewSender: {
    color: Colors.textMuted,
  },
  previewEmpty: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  badge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginLeft: Spacing.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: Spacing.base,
  },
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["4xl"],
    gap: Spacing.sm,
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
  },
  // FAB
  fab: {
    position: "absolute",
    right: Spacing.xl,
    bottom: Spacing.xl,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabPressed: {
    opacity: 0.88,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius["2xl"],
    borderTopRightRadius: Radius["2xl"],
    padding: Spacing["2xl"],
    gap: Spacing.base,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderStrong,
    alignSelf: "center",
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  modalInput: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontFamily: "monospace",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  modalCancel: {
    flex: 1,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  modalConfirm: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  modalConfirmText: {
    fontSize: FontSize.base,
    color: Colors.textInverse,
    fontWeight: FontWeight.semibold,
  },
});
