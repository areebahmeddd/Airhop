// DM (direct message) list screen.
// Shows one-on-one encrypted conversations, identified by channels prefixed
// with "dm:<peerID>". These use Noise XX + Double Ratchet for E2E encryption.
// Swipe left on a row for More (clear / delete), the same gesture as the
// Channels list, so both chat surfaces manage conversations consistently.

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { getMeshService } from "../../services/mesh-service";
import { showAlert } from "../../store/alert-store";
import { useBlockedStore } from "../../store/blocked-store";
import { useChatStore } from "../../store/chat-store";
import { useContactsStore } from "../../store/contacts-store";
import { usePeerStore } from "../../store/peer-store";
import Avatar from "../../ui/components/avatar";
import BottomSheet from "../../ui/components/bottom-sheet";
import EmptyState from "../../ui/components/empty-state";
import {
  Duration,
  FontSize,
  FontWeight,
  MaxFontScale,
  MIN_TOUCH,
  Radius,
  Spacing,
  TAB_BAR_CLEARANCE,
  useThemeColors,
} from "../../ui/theme";
import { usePullRefreshColors } from "../../ui/use-pull-refresh";
import { sortConversationsByActivity } from "../../utils/conversation-order";
import { resolveDisplayName } from "../../utils/display-name";
import { formatListTimestamp } from "../../utils/format";
import { messagePreviewText } from "../../utils/message-preview";
import ContactInfoSheet from "./contact-info-sheet";

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
  const pullRefreshColors = usePullRefreshColors();
  const {
    channels,
    messages,
    unreadCounts,
    clearChannelMessages,
    removeChannel,
    pinnedChannels,
    togglePinChannel,
    mutedChannels,
    toggleMuteChannel,
  } = useChatStore();
  const blockPeer = useBlockedStore((s) => s.blockPeer);
  const removeContact = useContactsStore((s) => s.removeContact);
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
  // Which DM's contact-info sheet is open (null when closed).
  const [infoChannel, setInfoChannel] = useState<string | null>(null);
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

  function handleContactInfo(channel: string): void {
    setMoreOptionsDM(null);
    setInfoChannel(channel);
  }

  function handleMuteDM(channel: string): void {
    setMoreOptionsDM(null);
    toggleMuteChannel(channel);
  }

  function handleClearDM(channel: string): void {
    setMoreOptionsDM(null);
    showAlert(
      "Clear chat",
      `Delete all messages with ${resolveDisplayName(channel.slice(3))}? This can't be undone.`,
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

  // Remove contact: forget the person (contact + ephemeral peer entry) and the
  // conversation. Not a block: if they are still nearby they reappear on the
  // Mesh tab and can be messaged again. Mirrors the in-thread Remove contact.
  function handleRemoveContactDM(channel: string): void {
    setMoreOptionsDM(null);
    const peerID = channel.slice(3);
    showAlert(
      "Remove contact",
      `Remove ${resolveDisplayName(peerID)}? This deletes the conversation and forgets the contact. They can still reach you if they message again.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeChannel(channel);
            removeContact(peerID);
            usePeerStore.getState().removePeer(peerID);
          },
        },
      ],
    );
  }

  // Block: forget them AND refuse to hear from them again. Enforced in
  // mesh-service (announces and messages dropped before reaching any store),
  // so a block survives them re-announcing.
  function handleBlockDM(channel: string): void {
    setMoreOptionsDM(null);
    const peerID = channel.slice(3);
    showAlert(
      "Block this peer",
      `Block ${resolveDisplayName(peerID)}? You won't see them on the Mesh tab or receive messages from them, even if they're nearby.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: () => {
            blockPeer(peerID);
            // Tear down the live crypto session and link maps too, not just the
            // UI entry (forgetPeer also drops them from the peer store).
            getMeshService()?.forgetPeer(peerID);
            removeContact(peerID);
            removeChannel(channel);
          },
        },
      ],
    );
  }

  function handleDeleteDM(channel: string): void {
    setMoreOptionsDM(null);
    showAlert(
      "Delete chat",
      "This removes the conversation from your list and deletes its messages. The contact is kept, and a new message from them starts a fresh chat.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          // Only the conversation view is removed. The peer stays in contacts
          // (unlike Remove contact inside the thread), so this is a clean "hide
          // this chat" rather than "forget this person".
          onPress: () => removeChannel(channel),
        },
      ],
    );
  }

  function handlePinDM(channel: string): void {
    setMoreOptionsDM(null);
    togglePinChannel(channel);
  }

  // DM channels are prefixed "dm:<16-hex peerID>", ordered pinned-first then by
  // most recent activity, the same rule the channel list uses.
  const dmChannels = sortConversationsByActivity(
    channels.filter((c) => c.startsWith("dm:")),
    messages,
    pinnedChannels,
  );

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
          const isPinned = pinnedChannels.includes(item);
          const isMuted = mutedChannels.includes(item);

          // Formatted once for both the visible timestamp and the label below.
          const timeLabel =
            last === undefined ? null : formatListTimestamp(last.timestampMs);

          // The whole row as one sentence, matching the room list. Previously
          // only the name and online state were spoken, so the unread count,
          // last message and time (all on screen) were inaudible.
          const rowLabel = [
            username,
            isOnline ? "in range" : null,
            (unreadCounts[item] ?? 0) > 0
              ? `${String(unreadCounts[item] ?? 0)} unread`
              : null,
            isMuted ? "muted" : null,
            isPinned ? "pinned" : null,
            last
              ? `${last.isMine ? "You: " : ""}${messagePreviewText(last)}`
              : "No messages yet",
            timeLabel,
          ]
            .filter((part) => part !== null)
            .join(", ");

          const row = (
            <Pressable
              style={styles.row}
              onPress={() => onSelectDM(item)}
              accessibilityRole="button"
              accessibilityLabel={rowLabel}
            >
              {/* Avatar with presence dot (green in range, grey otherwise) */}
              <Avatar
                username={username}
                peerID={peerID}
                size={46}
                presence={isOnline ? "online" : "offline"}
              />

              {/* Content */}
              <View style={styles.rowContent}>
                <View style={styles.rowTop}>
                  <Text style={styles.username} numberOfLines={1}>
                    {username}
                  </Text>
                  <View style={styles.rowMeta}>
                    {last ? (
                      <Text style={styles.timestamp}>{timeLabel}</Text>
                    ) : null}
                    {isMuted && (
                      <Feather
                        name="bell-off"
                        size={13}
                        color={Colors.textMuted}
                      />
                    )}
                    {isPinned && (
                      <MaterialCommunityIcons
                        name="pin"
                        size={13}
                        color={Colors.textMuted}
                      />
                    )}
                  </View>
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
                    <View
                      style={styles.badge}
                      importantForAccessibility="no-hide-descendants"
                      accessibilityElementsHidden
                    >
                      <Text
                        style={styles.badgeText}
                        maxFontSizeMultiplier={MaxFontScale.badge}
                      >
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

          // Swipe left for More, the same interaction as the Channels list, so
          // both surfaces feel like one consistent app. The wrapper animates the
          // row settling into place when the list reorders (pin, new activity)
          // and fading in/out on add/remove.
          return (
            <Animated.View
              layout={LinearTransition.duration(Duration.slow)}
              entering={FadeIn.duration(Duration.base)}
            >
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
            </Animated.View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            {...pullRefreshColors}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="message-circle"
            title="No direct messages"
            subtitle="Go to the Mesh tab and tap a peer to start an encrypted DM."
          />
        }
        contentContainerStyle={styles.list}
      />

      {/* Swipe "More" sheet: clear or delete a conversation */}
      <BottomSheet
        visible={moreOptionsDM !== null}
        onClose={() => setMoreOptionsDM(null)}
        sheetStyle={styles.modalSheet}
      >
        {moreOptionsDM && (
          <>
            <View style={styles.modalTitleRow}>
              <Avatar
                username={resolveDisplayName(moreOptionsDM.slice(3))}
                peerID={moreOptionsDM.slice(3)}
                size={32}
              />
              <Text style={styles.modalTitle} numberOfLines={1}>
                {resolveDisplayName(moreOptionsDM.slice(3))}
              </Text>
            </View>

            {/* Everyday actions, grouped in one box. */}
            <View style={styles.moreRowsGroup}>
              <Pressable
                style={styles.moreRow}
                onPress={() => handleContactInfo(moreOptionsDM)}
                accessibilityRole="button"
              >
                <Feather name="info" size={18} color={Colors.textSecondary} />
                <Text style={styles.moreRowText}>Contact info</Text>
              </Pressable>

              <View style={styles.moreDivider} />
              <Pressable
                style={styles.moreRow}
                onPress={() => handlePinDM(moreOptionsDM)}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name={
                    pinnedChannels.includes(moreOptionsDM) ? "pin-off" : "pin"
                  }
                  size={18}
                  color={Colors.textSecondary}
                />
                <Text style={styles.moreRowText}>
                  {pinnedChannels.includes(moreOptionsDM)
                    ? "Unpin chat"
                    : "Pin chat"}
                </Text>
              </Pressable>

              <View style={styles.moreDivider} />
              <Pressable
                style={styles.moreRow}
                onPress={() => handleMuteDM(moreOptionsDM)}
                accessibilityRole="button"
              >
                <Feather
                  name={
                    mutedChannels.includes(moreOptionsDM) ? "bell" : "bell-off"
                  }
                  size={18}
                  color={Colors.textSecondary}
                />
                <Text style={styles.moreRowText}>
                  {mutedChannels.includes(moreOptionsDM)
                    ? "Unmute chat"
                    : "Mute chat"}
                </Text>
              </Pressable>

              <View style={styles.moreDivider} />
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
            </View>

            {/* Destructive actions in their own red box. */}
            <View style={styles.moreRowsGroup}>
              <Pressable
                style={styles.moreRow}
                onPress={() => handleRemoveContactDM(moreOptionsDM)}
                accessibilityRole="button"
              >
                <Feather name="user-x" size={18} color={Colors.danger} />
                <Text style={[styles.moreRowText, styles.moreRowTextDanger]}>
                  Remove contact
                </Text>
              </Pressable>

              <View style={styles.moreDivider} />
              <Pressable
                style={styles.moreRow}
                onPress={() => handleBlockDM(moreOptionsDM)}
                accessibilityRole="button"
              >
                <Feather name="slash" size={18} color={Colors.danger} />
                <Text style={[styles.moreRowText, styles.moreRowTextDanger]}>
                  Block contact
                </Text>
              </Pressable>

              <View style={styles.moreDivider} />
              <Pressable
                style={styles.moreRow}
                onPress={() => handleDeleteDM(moreOptionsDM)}
                accessibilityRole="button"
              >
                <Feather name="trash-2" size={18} color={Colors.danger} />
                <Text style={[styles.moreRowText, styles.moreRowTextDanger]}>
                  Delete chat
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </BottomSheet>

      <ContactInfoSheet
        channel={infoChannel}
        onClose={() => setInfoChannel(null)}
      />
    </View>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    list: {
      flexGrow: 1,
      // Clear the floating tab bar so the last DM row can scroll above it.
      paddingBottom: TAB_BAR_CLEARANCE,
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
    rowMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      flexShrink: 0,
      marginLeft: Spacing.sm,
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
      fontSize: FontSize["2xs"],
      fontVariant: ["tabular-nums"],
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
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
    modalSheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      gap: Spacing.base,
    },
    modalTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    modalTitle: {
      flexShrink: 1,
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    // Two grouped boxes: neutral actions in one card, destructive in another, so
    // a mis-tap cannot cross from Mute into Block. Rows are transparent; the card
    // owns the background and the rounded corners (overflow clips the rows to the
    // radius).
    //
    // The "-Danger" halves of all three of these were byte-identical copies of
    // their neutral counterparts, kept alive by a comment promising "a solid red
    // card" that the code never delivered. What separates the destructive group
    // is being a separate box with red content in it, and that is what these
    // three styles plus moreRowTextDanger now say, once each.
    moreRowsGroup: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      overflow: "hidden",
    },
    moreRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.base,
      // Same 44pt floor as the room list's sheet. Half the rows here are
      // destructive, which is where an undersized target costs the most.
      minHeight: MIN_TOUCH,
    },
    moreDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginLeft: Spacing.base,
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
