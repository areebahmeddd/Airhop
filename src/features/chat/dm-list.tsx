// DM (direct message) list screen.
// Shows one-on-one encrypted conversations, identified by channels prefixed
// with "dm:<peerID>". These use Noise XX + Double Ratchet for E2E encryption.
// Swipe left on a row for More (clear / delete), the same gesture as the
// Channels list, so both chat surfaces manage conversations consistently.

import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { getMeshService } from "../../services/mesh-service";
import { showAlert } from "../../store/alert-store";
import { useChatStore } from "../../store/chat-store";
import { usePeerStore } from "../../store/peer-store";
import Avatar from "../../ui/components/avatar";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { resolveDisplayName } from "../../utils/display-name";
import { messagePreviewText } from "../../utils/message-preview";

// How long the pull-to-refresh spinner stays up. The refresh itself
// (BLE rescan kick) returns instantly, but a flash-then-gone spinner reads
// as broken, so hold it briefly for legible feedback.
const REFRESH_SPINNER_MS = 700;

interface Props {
  onSelectDM: (channel: string) => void;
}

export default function DmList({ onSelectDM }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const {
    channels,
    messages,
    unreadCounts,
    clearChannelMessages,
    removeChannel,
  } = useChatStore();
  // Subscribe to the peers Map so the list re-renders when any peer
  // comes online or goes offline (Map reference changes on every upsert).
  const peerMap = usePeerStore((s) => s.peers);
  // Snapshot of Date.now() refreshed every 15 s; avoids calling the impure
  // function inside renderItem (React Compiler / react-hooks/purity rule).
  const [nowMs, setNowMs] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);
  const [refreshing, setRefreshing] = useState(false);
  // Swipe left on a DM row for More (clear / delete), the same pattern as the
  // Channels list, so both chat surfaces manage conversations consistently.
  const [moreOptionsDM, setMoreOptionsDM] = useState<string | null>(null);
  const swipeableRefs = useRef(new Map<string, Swipeable>()).current;

  function handleRefresh(): void {
    setRefreshing(true);
    getMeshService()?.refresh();
    setTimeout(() => setRefreshing(false), REFRESH_SPINNER_MS);
  }

  function handleSwipeMore(channel: string): void {
    swipeableRefs.get(channel)?.close();
    setMoreOptionsDM(channel);
  }

  function handleClearDM(channel: string): void {
    setMoreOptionsDM(null);
    showAlert(
      "Clear chat",
      "Delete all messages in this conversation? This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => clearChannelMessages(channel),
        },
      ],
    );
  }

  function handleDeleteDM(channel: string): void {
    setMoreOptionsDM(null);
    showAlert("Delete chat", "Delete this conversation and all its messages?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          removeChannel(channel);
          // Same "forget this contact" outcome as Remove contact inside
          // the thread itself, since deleting from the list shouldn't behave
          // differently just because of which entry point was used.
          usePeerStore.getState().removePeer(channel.slice(3));
        },
      },
    ]);
  }

  // DM channels are prefixed "dm:<16-hex peerID>".
  const dmChannels = channels.filter((c) => c.startsWith("dm:"));

  return (
    <View style={styles.container}>
      <FlatList
        data={dmChannels}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const peerID = item.slice(3);
          const username = resolveDisplayName(peerID);
          const msgs = messages[item] ?? [];
          const last = msgs[msgs.length - 1];
          const peerEntry = peerMap.get(peerID);
          const isOnline =
            peerEntry !== undefined && nowMs - peerEntry.lastSeenMs < 60_000;

          const row = (
            <Pressable
              style={styles.row}
              onPress={() => onSelectDM(item)}
              accessibilityRole="button"
              accessibilityLabel={`Open DM with ${username}${isOnline ? ", online" : ""}`}
            >
              {/* Avatar with optional online indicator */}
              <View style={styles.avatarWrapper}>
                <Avatar username={username} peerID={peerID} size={46} />
                {isOnline && <View style={styles.onlineDot} />}
              </View>

              {/* Content */}
              <View style={styles.rowContent}>
                <View style={styles.rowTop}>
                  <Text style={styles.username} numberOfLines={1}>
                    {username}
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
                      {last.isMine ? (
                        <Text style={styles.previewSender}>You: </Text>
                      ) : null}
                      {messagePreviewText(last)}
                    </Text>
                  ) : (
                    <Text style={styles.previewEmpty}>No messages yet</Text>
                  )}
                  {(unreadCounts[item] ?? 0) > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {(unreadCounts[item] ?? 0) > 99
                          ? "99+"
                          : String(unreadCounts[item] ?? 0)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          );

          // Swipe left for More (clear / delete), the same interaction as the
          // Channels list, so both surfaces feel like one consistent app.
          return (
            <Swipeable
              ref={(ref) => {
                if (ref) swipeableRefs.set(item, ref);
                else swipeableRefs.delete(item);
              }}
              overshootRight={false}
              renderRightActions={() => (
                <View style={styles.swipeActions}>
                  <Pressable
                    style={styles.swipeAction}
                    onPress={() => handleSwipeMore(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`More options for ${username}`}
                  >
                    <Feather
                      name="more-horizontal"
                      size={18}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.swipeActionText}>More</Text>
                  </Pressable>
                </View>
              )}
            >
              {row}
            </Swipeable>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.textMuted}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather
              name="message-circle"
              size={36}
              color={Colors.textMuted}
              style={{ opacity: 0.4 }}
            />
            <Text style={styles.emptyTitle}>No direct messages</Text>
            <Text style={styles.emptySubtitle}>
              Go to the Mesh tab and tap a peer{"\n"}to start an encrypted DM.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      {/* Swipe "More" sheet: clear or delete a conversation */}
      <Modal
        visible={moreOptionsDM !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setMoreOptionsDM(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setMoreOptionsDM(null)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.handle} />
            {moreOptionsDM && (
              <>
                <Text style={styles.modalTitle}>
                  {resolveDisplayName(moreOptionsDM.slice(3))}
                </Text>

                <View style={styles.moreRowsGroup}>
                  <Pressable
                    style={styles.moreRow}
                    onPress={() => handleClearDM(moreOptionsDM)}
                    accessibilityRole="button"
                  >
                    <Feather
                      name="x-circle"
                      size={18}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.moreRowText}>Clear chat</Text>
                  </Pressable>

                  <Pressable
                    style={styles.moreRowDanger}
                    onPress={() => handleDeleteDM(moreOptionsDM)}
                    accessibilityRole="button"
                  >
                    <Feather name="trash-2" size={18} color={Colors.danger} />
                    <Text
                      style={[styles.moreRowText, styles.moreRowTextDanger]}
                    >
                      Delete chat
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
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

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    list: {
      flexGrow: 1,
    },
    // No per-row background, just flat rows directly on the screen background,
    // divided only by the hairline separator below. Matches the WhatsApp
    // chat-list look rather than a "card per row" treatment.
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      gap: Spacing.md,
      minHeight: 72,
    },
    // Avatar
    avatarWrapper: {
      flexShrink: 0,
    },
    // Row content
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
    username: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
      flex: 1,
    },
    timestamp: {
      fontSize: FontSize.xs,
      color: Colors.textPrimary,
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
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginLeft: 62, // avatar (46) + gap (16)
    },
    // Empty state
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Spacing["4xl"],
      gap: Spacing.md,
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: Spacing.sm,
    },
    emptyIconText: {
      fontSize: FontSize.xl,
      color: Colors.textMuted,
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
    badge: {
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      minWidth: 18,
      height: 18,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 5,
      marginLeft: Spacing.sm,
      flexShrink: 0,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
    },
    onlineDot: {
      position: "absolute",
      bottom: 1,
      right: 1,
      width: 11,
      height: 11,
      borderRadius: 6,
      backgroundColor: Colors.online,
      borderWidth: 2,
      borderColor: Colors.bg,
    },
    // Swipe-to-more (matches channel-list.tsx's swipe action styling)
    swipeActions: {
      flexDirection: "row",
      height: "100%",
    },
    swipeAction: {
      width: 72,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      backgroundColor: Colors.border,
    },
    swipeActionText: {
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
    // More sheet
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
    modalTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    moreRowsGroup: {
      gap: Spacing.xs,
    },
    moreRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.sm,
      borderRadius: Radius.md,
      backgroundColor: Colors.surfaceRaised,
    },
    moreRowDanger: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.sm + 2,
      paddingHorizontal: Spacing.sm,
      borderRadius: Radius.md,
      backgroundColor: Colors.dangerDim,
    },
    moreRowText: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.medium,
    },
    moreRowTextDanger: {
      color: Colors.danger,
    },
  });
}
