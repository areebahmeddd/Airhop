// Channel list screen.
// Shows all joined public channels with last-message preview and unread counts.
// Tap a channel to open its message thread.
// Long-press (or tap the info icon) to see channel details and leave.
// FAB at bottom-right to join or create a new channel.

import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useChatStore } from "../../store/chat-store";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../ui/theme";

// Scope info for built-in bitchat-compatible channels.
const CHANNEL_SCOPE: Record<
  string,
  { tag: string; description: string; transport: string }
> = {
  "#bluetooth": {
    tag: "Local mesh · BLE only",
    description:
      "Reaches devices within BLE range (roughly 10 to 100 metres). No internet required. Ideal for local coordination.",
    transport: "BLE only",
  },
  "#block": {
    tag: "City block · ~100m",
    description:
      "City-block level coverage. Messages are bridged over Nostr so peers outside BLE range but nearby can participate.",
    transport: "BLE + Nostr",
  },
  "#neighborhood": {
    tag: "Neighborhood · ~1km",
    description:
      "Neighborhood coverage. Relay-assisted so peers across the area are reachable even without a direct BLE link.",
    transport: "BLE + Nostr",
  },
  "#city": {
    tag: "City · ~10km",
    description:
      "City-wide channel. Uses geo-located Nostr relays to reach peers across the metro area.",
    transport: "BLE + Nostr",
  },
  "#province": {
    tag: "Province or state · ~100km",
    description:
      "Provincial or state coverage. Bridged over Nostr for regional reach across hundreds of kilometres.",
    transport: "BLE + Nostr",
  },
  "#region": {
    tag: "Country or region · ~1000km",
    description:
      "Country-wide coverage. Any Airhop or bitchat user in the region can join and read messages.",
    transport: "BLE + Nostr",
  },
};

interface Props {
  onSelectChannel: (channel: string) => void;
}

export default function ChannelList({
  onSelectChannel,
}: Props): React.JSX.Element {
  const { channels, messages, addChannel, removeChannel, unreadCounts } =
    useChatStore();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  const [infoChannel, setInfoChannel] = useState<string | null>(null);

  function handleAdd(): void {
    const name = newChannel.trim().replace(/^#*/, "#");
    if (name.length < 2) return;
    addChannel(name);
    setNewChannel("");
    setShowJoinModal(false);
  }

  function handleLeave(channel: string): void {
    removeChannel(channel);
    setInfoChannel(null);
  }

  // Public channels only (filter out dm: prefixed channels).
  const publicChannels = channels.filter((c) => !c.startsWith("dm:"));

  const channelInfoData = infoChannel ? CHANNEL_SCOPE[infoChannel] : undefined;

  return (
    <View style={styles.container}>
      <FlatList
        data={publicChannels}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const msgs = messages[item] ?? [];
          const last = msgs[msgs.length - 1];
          const unread = unreadCounts[item] ?? 0;
          const scopeTag = CHANNEL_SCOPE[item]?.tag;

          return (
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
              onPress={() => onSelectChannel(item)}
              onLongPress={() => setInfoChannel(item)}
              accessibilityRole="button"
              accessibilityLabel={`Open channel ${item}`}
            >
              <View style={styles.rowContent}>
                <View style={styles.rowTop}>
                  <View style={styles.rowNameGroup}>
                    <Text style={styles.channelName} numberOfLines={1}>
                      <Text style={styles.channelHash}>#</Text>
                      {item.replace(/^#/, "")}
                    </Text>
                    {scopeTag !== undefined ? (
                      <Text style={styles.channelScope} numberOfLines={1}>
                        {scopeTag}
                      </Text>
                    ) : null}
                  </View>
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
                  <View style={styles.rowRight}>
                    {unread > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {unread > 99 ? "99+" : unread}
                        </Text>
                      </View>
                    )}
                    <Pressable
                      style={styles.infoBtn}
                      onPress={() => setInfoChannel(item)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 0 }}
                      accessibilityRole="button"
                      accessibilityLabel={`Info for channel ${item}`}
                    >
                      <Feather name="info" size={14} color={Colors.textMuted} />
                    </Pressable>
                  </View>
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
        onPress={() => setShowJoinModal(true)}
        accessibilityRole="button"
        accessibilityLabel="Add or join a channel"
      >
        <Feather name="plus" size={22} color={Colors.textInverse} />
      </Pressable>

      {/* Join or create channel modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowJoinModal(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Join or create</Text>
            <Text style={styles.modalHint}>
              Type a channel name to join an existing one or create a new one.
              Anyone with the same name can join.
            </Text>
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
                onPress={() => setShowJoinModal(false)}
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

      {/* Channel info sheet */}
      <Modal
        visible={infoChannel !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setInfoChannel(null)}
      >
        {infoChannel !== null && (
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setInfoChannel(null)}
          >
            <Pressable style={styles.infoSheet} onPress={() => {}}>
              <View style={styles.handleCentered} />

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.infoContent}
              >
                {/* Channel header */}
                <View style={styles.infoHeader}>
                  <View style={styles.infoIconWrap}>
                    <Feather name="hash" size={22} color={Colors.textPrimary} />
                  </View>
                  <Text style={styles.infoChannelName}>
                    {infoChannel.replace(/^#/, "")}
                  </Text>
                  <Text style={styles.infoScopeTag}>
                    {channelInfoData ? channelInfoData.tag : "Custom channel"}
                  </Text>
                </View>

                {/* About */}
                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>About</Text>
                  <Text style={styles.infoDescription}>
                    {channelInfoData
                      ? channelInfoData.description
                      : "A custom channel. Anyone who knows the name can join from any Airhop or bitchat device."}
                  </Text>
                </View>

                {/* Transport */}
                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>Transport</Text>
                  <View style={styles.transportRow}>
                    <Feather
                      name="radio"
                      size={14}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.transportLabel}>
                      {channelInfoData?.transport ?? "BLE + Nostr"}
                    </Text>
                  </View>
                </View>

                {/* Join from another device */}
                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>
                    Join from another device
                  </Text>
                  <View style={styles.shareHint}>
                    <Text style={styles.shareCode}>{infoChannel}</Text>
                  </View>
                  <Text style={styles.shareNote}>
                    Share this channel name. Open Airhop or bitchat and tap + to
                    join.
                  </Text>
                </View>

                {/* Leave */}
                <Pressable
                  style={({ pressed }) => [
                    styles.leaveBtn,
                    pressed && styles.leaveBtnPressed,
                  ]}
                  onPress={() => handleLeave(infoChannel)}
                  accessibilityRole="button"
                  accessibilityLabel={`Leave channel ${infoChannel}`}
                >
                  <Feather name="log-out" size={16} color={Colors.danger} />
                  <Text style={styles.leaveBtnText}>Leave channel</Text>
                </Pressable>
              </ScrollView>
            </Pressable>
          </Pressable>
        )}
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
    paddingBottom: 88,
  },
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
    alignItems: "flex-start",
  },
  rowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowNameGroup: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  channelName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  channelHash: {
    color: Colors.textMuted,
    fontWeight: FontWeight.regular,
  },
  channelScope: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.1,
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
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
  },
  infoBtn: {
    paddingLeft: Spacing.xs,
    opacity: 0.6,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: Spacing.base,
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius["2xl"],
    borderTopRightRadius: Radius["2xl"],
    padding: Spacing.xl,
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
  handleCentered: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderStrong,
    alignSelf: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  modalHint: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 19,
  },
  modalInput: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.base,
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
  // Channel info sheet
  infoSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius["2xl"],
    borderTopRightRadius: Radius["2xl"],
    maxHeight: "80%",
  },
  infoContent: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  infoHeader: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  infoIconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  infoChannelName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  infoScopeTag: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: "center",
  },
  infoSection: {
    gap: Spacing.sm,
  },
  infoSectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  infoDescription: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  transportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  transportLabel: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  shareHint: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareCode: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  shareNote: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  leaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.danger,
    marginTop: Spacing.sm,
  },
  leaveBtnPressed: {
    backgroundColor: Colors.dangerDim,
  },
  leaveBtnText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.danger,
  },
});
