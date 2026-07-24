// A single message row: bubble, forwarded tag, star badge, and the long-press
// surface that opens the message action sheet.
//
// Attachment and Cashu-token rendering stay in message-thread.tsx (they
// depend on per-thread interactive state: playingUri, revealedAttachments,
// claimToken) and are handed down as render props.

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { EmbeddedToken } from "../../core/payments/cashu";
import type {
  ChatAttachment,
  ChatMessage,
  MessageStatus,
} from "../../store/chat-store";
import Avatar from "../../ui/components/avatar";
import { FontSize, Radius, Spacing, useThemeColors } from "../../ui/theme";

interface Props {
  item: ChatMessage;
  showAvatar: boolean;
  isFirstFromSender: boolean;
  tokens: EmbeddedToken[];
  isPureToken: boolean;
  renderToken: (token: EmbeddedToken) => React.ReactNode;
  renderAttachment: (attachment: ChatAttachment) => React.ReactNode;
  formatTime: (ms: number) => string;
  onLongPress: (item: ChatMessage) => void;
  // Tapping the avatar or name opens a profile sheet for that sender, same
  // "tap a peer to see who they are" affordance as the Mesh tab. Omitted in
  // a DM thread (there's only one other participant, already reachable via
  // the header). Only wired for channels, where a message can come from
  // any of several people.
  onPressSender?: (item: ChatMessage) => void;
  // Briefly true right after navigating here from a search result, so the
  // matched message is unmistakable among a screen of otherwise-identical
  // bubbles. A border ring (not a background wash) so it reads the same way
  // on both the light "theirs" bubble and the near-black "mine" bubble.
  highlighted?: boolean;
}

export default function MessageBubble({
  item,
  showAvatar,
  isFirstFromSender,
  tokens,
  isPureToken,
  renderToken,
  renderAttachment,
  formatTime,
  onLongPress,
  onPressSender,
  highlighted,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  function handleLongPress(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onLongPress(item);
  }

  return (
    <View
      style={[
        styles.messageRow,
        item.isMine ? styles.messageRowMine : styles.messageRowTheirs,
      ]}
    >
      {showAvatar ? (
        isFirstFromSender ? (
          <Pressable
            onPress={onPressSender ? () => onPressSender(item) : undefined}
            disabled={!onPressSender}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            accessibilityRole={onPressSender ? "button" : undefined}
            accessibilityLabel={
              onPressSender
                ? `View ${item.senderNickname}'s profile`
                : undefined
            }
          >
            <Avatar
              username={item.senderNickname}
              peerID={item.senderID}
              size={32}
            />
          </Pressable>
        ) : (
          <View style={styles.avatarSpacer} />
        )
      ) : null}

      <View
        style={[
          styles.bubbleWrapper,
          item.isMine ? styles.bubbleWrapperMine : styles.bubbleWrapperTheirs,
        ]}
      >
        {showAvatar && isFirstFromSender && (
          <Pressable
            onPress={onPressSender ? () => onPressSender(item) : undefined}
            disabled={!onPressSender}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            accessibilityRole={onPressSender ? "button" : undefined}
            accessibilityLabel={
              onPressSender
                ? `View ${item.senderNickname}'s profile`
                : undefined
            }
          >
            <Text style={styles.senderName}>{item.senderNickname}</Text>
          </Pressable>
        )}

        <Pressable
          onLongPress={handleLongPress}
          delayLongPress={320}
          accessibilityRole="button"
          accessibilityLabel={`${item.isMine ? "You" : item.senderNickname}: ${
            item.text || "attachment"
          }. Long press for more options.`}
        >
          <View
            style={[
              styles.bubble,
              item.isMine ? styles.bubbleMine : styles.bubbleTheirs,
              !item.isMine && isFirstFromSender && styles.bubbleTailLeft,
              item.isMine && styles.bubbleTailRight,
              highlighted && styles.bubbleHighlighted,
            ]}
          >
            {item.forwarded && (
              <View
                style={[
                  styles.forwardedTag,
                  item.isMine && styles.forwardedTagMine,
                ]}
              >
                <Feather
                  name="corner-up-right"
                  size={11}
                  color={item.isMine ? Colors.textInverse : Colors.textMuted}
                />
                <Text
                  style={[
                    styles.forwardedTagText,
                    item.isMine && styles.forwardedTagTextMine,
                  ]}
                >
                  Forwarded
                </Text>
              </View>
            )}

            {item.attachment && renderAttachment(item.attachment)}

            {item.text.length > 0 && !isPureToken && (
              <Text
                style={[
                  styles.messageText,
                  item.isMine
                    ? styles.messageTextMine
                    : styles.messageTextTheirs,
                ]}
              >
                {item.text}
              </Text>
            )}

            {tokens.map((token) => (
              <React.Fragment key={token.raw}>
                {renderToken(token)}
              </React.Fragment>
            ))}

            <View style={styles.metaRow}>
              <Text
                style={[styles.timestamp, item.isMine && styles.timestampMine]}
              >
                {formatTime(item.timestampMs)}
              </Text>
              {/* Delivery ticks, own outgoing messages only (never on system
                  notices or received messages). */}
              {item.isMine && !item.isSystem && item.status !== undefined && (
                <StatusTick status={item.status} Colors={Colors} />
              )}
            </View>
          </View>
        </Pressable>

        {item.isStarred && (
          <View
            style={[
              styles.chipRow,
              item.isMine ? styles.chipRowMine : styles.chipRowTheirs,
            ]}
          >
            <View style={styles.starChip}>
              <Feather name="star" size={10} color={Colors.textMuted} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// WhatsApp-style delivery ticks, kept monochrome to match the app: a single
// check for sent, a double check for delivered, the same double check at full
// brightness for read (the app has no second accent colour to spend, so read
// reads as "brighter", not "blue"). Rendered on the near-black "mine" bubble,
// hence textInverse.
function StatusTick({
  status,
  Colors,
}: {
  status: MessageStatus;
  Colors: ReturnType<typeof useThemeColors>;
}): React.JSX.Element {
  const SIZE = 13;
  const dim = { opacity: 0.55 };
  switch (status) {
    case "sending":
      return (
        <MaterialCommunityIcons
          name="clock-outline"
          size={SIZE}
          color={Colors.textInverse}
          style={dim}
        />
      );
    case "sent":
      return (
        <MaterialCommunityIcons
          name="check"
          size={SIZE}
          color={Colors.textInverse}
          style={dim}
        />
      );
    case "carried":
      return (
        <MaterialCommunityIcons
          name="account-arrow-right"
          size={SIZE}
          color={Colors.textInverse}
          style={dim}
        />
      );
    case "delivered":
      return (
        <MaterialCommunityIcons
          name="check-all"
          size={SIZE}
          color={Colors.textInverse}
          style={dim}
        />
      );
    case "read":
      return (
        <MaterialCommunityIcons
          name="check-all"
          size={SIZE}
          color={Colors.textInverse}
        />
      );
    case "failed":
      return (
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={SIZE}
          color={Colors.danger}
        />
      );
  }
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    messageRow: {
      flexDirection: "row",
      marginVertical: 2,
      alignItems: "flex-end",
      gap: Spacing.sm,
    },
    messageRowMine: { justifyContent: "flex-end" },
    messageRowTheirs: { justifyContent: "flex-start" },
    avatarSpacer: { width: 32, flexShrink: 0 },
    bubbleWrapper: { maxWidth: "75%", gap: 2 },
    bubbleWrapperMine: { alignItems: "flex-end" },
    bubbleWrapperTheirs: { alignItems: "flex-start" },
    senderName: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      marginLeft: Spacing.md,
      marginBottom: 2,
    },
    bubble: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm + 2,
      borderRadius: Radius.lg,
    },
    bubbleMine: { backgroundColor: Colors.myBubble },
    bubbleTheirs: { backgroundColor: Colors.theirBubble },
    bubbleTailLeft: { borderBottomLeftRadius: Radius.sm },
    bubbleTailRight: { borderBottomRightRadius: Radius.sm },
    bubbleHighlighted: {
      borderWidth: 2,
      borderColor: Colors.accent,
    },
    messageText: {
      fontSize: FontSize.base,
      lineHeight: FontSize.base * 1.5,
    },
    messageTextMine: { color: Colors.textInverse },
    messageTextTheirs: { color: Colors.textPrimary },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 6,
      marginTop: 4,
    },
    timestamp: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    // myBubbleText already resolves correctly per theme (white on the
    // near-black light-mode bubble, dark on the near-white dark-mode
    // bubble): a hardcoded white was invisible once dark mode flipped the
    // bubble itself to near-white.
    timestampMine: { color: Colors.textInverse, opacity: 0.55 },
    // Forwarded tag
    forwardedTag: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginBottom: 4,
    },
    forwardedTagMine: { opacity: 0.7 },
    forwardedTagText: {
      fontSize: FontSize.xs,
      fontStyle: "italic",
      color: Colors.textMuted,
    },
    forwardedTagTextMine: { color: Colors.textInverse },
    // Star chip row
    chipRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: -4,
    },
    chipRowMine: { justifyContent: "flex-end" },
    chipRowTheirs: { justifyContent: "flex-start" },
    starChip: {
      backgroundColor: Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Radius.full,
      width: 22,
      height: 22,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
