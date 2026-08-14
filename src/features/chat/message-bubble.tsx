// A single message row: bubble, forwarded tag, star badge, and the long-press
// surface that opens the message action sheet.
//
// Attachment and Cashu-token rendering stay in message-thread.tsx (they
// depend on per-thread interactive state: playingUri, revealedAttachments,
// claimToken) and are handed down as render props.

import type { EmbeddedToken } from "@core/payments/cashu";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useT } from "@i18n";
import { held } from "@platform/haptics";
import type {
  ChatAttachment,
  ChatMessage,
  MessageStatus,
} from "@store/chat-store";
import Avatar from "@ui/components/avatar";
import {
  FontSize,
  FontWeight,
  HIT_SLOP,
  hitSlopFor,
  Radius,
  Spacing,
  useThemeColors,
} from "@ui/theme";
import React, { useMemo } from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";

// Drawn size of a sender's avatar in a channel thread. Tapping it (or the name
// beside it) opens that sender's profile, so both carry hitSlopFor() to reach the
// 44pt floor from 32pt without making the bubbles taller.
const AVATAR_TAP_SIZE = 32;

// Memoized (see the export) so a thread of hundreds of messages doesn't
// re-render every bubble on each keyboard/scroll/state tick, which is what
// triggered React Native's "VirtualizedList slow to update" warning. A message
// object is replaced whenever it changes (immutable store updates), so a
// reference check on `item` is enough; `tokens` is skipped because it derives
// from `item.text`, and the plain callbacks are behaviorally stable (they act
// on the item passed to them). The two render props are not: they draw on the
// thread's interactive state, which `renderState` exposes. The bubble still
// re-renders on theme/font changes via its own useThemeColors subscription, and
// an in-progress attachment card keeps updating through its own store
// subscription.
interface Props {
  item: ChatMessage;
  showAvatar: boolean;
  isFirstFromSender: boolean;
  tokens: EmbeddedToken[];
  isPureToken: boolean;
  renderToken: (token: EmbeddedToken) => React.ReactNode;
  renderAttachment: (attachment: ChatAttachment) => React.ReactNode;
  // This row's interactive state, flattened for the memo comparator: photo
  // revealed, voice note playing, token being claimed.
  //
  // The comparator cannot check the render props themselves. They are fresh
  // closures every parent render, so comparing them would defeat the memo (the
  // composer's draft changes per keystroke); ignoring them froze the bubble on
  // its first render, so tapping load/play/claim changed nothing on screen.
  // Row-scoped, so one tap re-renders one bubble.
  renderState: string;
  formatTime: (ms: number) => string;
  onLongPress: (item: ChatMessage) => void;
  // Tapping the failed indicator on one of your own messages resends it. Only
  // wired for text messages, the only kind this bubble owns the send path for.
  onRetry?: (item: ChatMessage) => void;
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
  // Selection mode, for forwarding several messages at once. When `selecting`
  // is true a plain tap toggles this row instead of doing nothing, and the
  // sender/avatar taps are suppressed so the whole row is one target.
  selecting?: boolean;
  selected?: boolean;
  onToggleSelect?: (item: ChatMessage) => void;
}

function MessageBubble({
  item,
  showAvatar,
  isFirstFromSender,
  tokens,
  isPureToken,
  // `renderState` is not destructured: the memo comparator reads it, the body
  // never does.
  renderToken,
  renderAttachment,
  formatTime,
  onLongPress,
  onRetry,
  onPressSender,
  highlighted,
  selecting,
  selected,
  onToggleSelect,
}: Props): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  function handleLongPress(): void {
    held();
    // In selection mode a long press is the same as a tap: holding again to
    // reopen the menu that started the selection would be a dead end.
    if (selecting === true) {
      onToggleSelect?.(item);
      return;
    }
    onLongPress(item);
  }

  function handleToggle(): void {
    onToggleSelect?.(item);
  }

  // While selecting, the row itself is the target: the avatar and the sender
  // name stop opening a profile so a tap anywhere reads the same way.
  const senderPress =
    selecting === true || onPressSender === undefined
      ? undefined
      : () => onPressSender(item);

  return (
    <Pressable
      style={[
        styles.messageRow,
        item.isMine ? styles.messageRowMine : styles.messageRowTheirs,
        selected === true && styles.messageRowSelected,
      ]}
      onPress={selecting === true ? handleToggle : undefined}
      disabled={selecting !== true}
      accessibilityRole={selecting === true ? "checkbox" : undefined}
      accessibilityState={
        selecting === true ? { checked: selected === true } : undefined
      }
    >
      {/* Leading check, only while selecting. Outside the bubble so it reads as
          a row control rather than part of the message, and on the same side for
          everyone so a mixed thread has one column of checks. */}
      {selecting === true && (
        <View
          style={[
            styles.selectCheck,
            // Own rows pack to the end, so the check needs the free space on its
            // trailing side to stay in the same column as the one on a received
            // row. Without it the check hugged the bubble and the column zigzagged.
            item.isMine && styles.selectCheckLeading,
            selected === true && styles.selectCheckOn,
          ]}
        >
          {selected === true && (
            <Feather name="check" size={13} color={Colors.textInverse} />
          )}
        </View>
      )}
      {showAvatar ? (
        isFirstFromSender ? (
          <Pressable
            onPress={senderPress}
            disabled={senderPress === undefined}
            hitSlop={hitSlopFor(AVATAR_TAP_SIZE)}
            accessibilityRole={senderPress ? "button" : undefined}
            accessibilityLabel={
              senderPress
                ? T("chat.bubble.view_profile", { name: item.senderNickname })
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
            onPress={senderPress}
            disabled={senderPress === undefined}
            hitSlop={hitSlopFor(AVATAR_TAP_SIZE)}
            accessibilityRole={senderPress ? "button" : undefined}
            accessibilityLabel={
              senderPress
                ? T("chat.bubble.view_profile", { name: item.senderNickname })
                : undefined
            }
          >
            <View style={styles.senderNameRow}>
              <Text style={styles.senderName}>{item.senderNickname}</Text>
              {item.viaBridge && (
                // Arrived from another mesh island across the mesh bridge.
                <Feather
                  name="globe"
                  size={11}
                  color={Colors.bridge}
                  accessibilityLabel={T("chat.bubble.via_bridge")}
                />
              )}
            </View>
          </Pressable>
        )}

        <Pressable
          onPress={selecting === true ? handleToggle : undefined}
          onLongPress={handleLongPress}
          delayLongPress={320}
          accessibilityRole={selecting === true ? "checkbox" : "button"}
          accessibilityState={
            selecting === true ? { checked: selected === true } : undefined
          }
          accessibilityLabel={T("chat.bubble.a11y", {
            sender: item.isMine ? T("chat.you") : item.senderNickname,
            body: item.text || T("chat.bubble.attachment"),
          })}
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
                  {T("chat.bubble.forwarded")}
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
                {renderMessageText(
                  item.text,
                  item.isMine
                    ? styles.messageMentionMine
                    : styles.messageMentionTheirs,
                  item.isMine ? styles.messageLinkMine : styles.messageLink,
                  handleLongPress,
                )}
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
                  notices or received messages). A failed message's mark is
                  tappable to resend. */}
              {item.isMine &&
                !item.isSystem &&
                item.status !== undefined &&
                (item.status === "failed" && onRetry ? (
                  <Pressable
                    onPress={() => onRetry(item)}
                    hitSlop={HIT_SLOP}
                    accessibilityRole="button"
                    accessibilityLabel={T("chat.bubble.failed_retry")}
                  >
                    <StatusTick status={item.status} Colors={Colors} />
                  </Pressable>
                ) : (
                  <StatusTick status={item.status} Colors={Colors} />
                ))}
            </View>
          </View>
        </Pressable>
      </View>
    </Pressable>
  );
}

// Render message text with @mentions emphasised and URLs tappable, the way
// every chat app does. A mention is an "@" at a word start followed by nickname
// characters; anything else (an email's "@", a lone "@") is left plain.
// Highlighting is syntactic, so it does not need the roster. A link opens in
// the system browser; it keeps the bubble's long-press so a message that is
// nothing but a link can still reach the action sheet.
function renderMessageText(
  text: string,
  mentionStyle: StyleProp<TextStyle>,
  linkStyle: StyleProp<TextStyle>,
  onLongPress: () => void,
): React.ReactNode {
  const re = /(^|\s)(@[A-Za-z0-9_-]+)|(https?:\/\/\S+|www\.\S+)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const url = m[3];
    if (url === undefined) {
      const lead = m[1];
      // Plain run up to and including the leading whitespace.
      out.push(text.slice(last, m.index + lead.length));
      out.push(
        <Text key={key++} style={mentionStyle}>
          {m[2]}
        </Text>,
      );
      last = m.index + m[0].length;
      continue;
    }
    // Trailing punctuation is almost always sentence punctuation, not part of
    // the URL ("see https://x.com/a." or "(https://x.com/a)").
    const trimmed = url.replace(/[.,!?;:)\]}'"]+$/, "");
    out.push(text.slice(last, m.index));
    out.push(
      <Text
        key={key++}
        style={linkStyle}
        onPress={() => {
          const href = trimmed.startsWith("www.")
            ? `https://${trimmed}`
            : trimmed;
          void Linking.openURL(href).catch(() => {});
        }}
        onLongPress={onLongPress}
        suppressHighlighting
        accessibilityRole="link"
      >
        {trimmed}
      </Text>,
    );
    last = m.index + trimmed.length;
  }
  if (last === 0) return text; // nothing matched: raw string, no spans
  out.push(text.slice(last));
  return out;
}

// WhatsApp-style delivery ticks: a single check for sent, a dim double check
// for delivered, and a filled blue double check for read. Everything up to
// delivered stays monochrome (textInverse on the near-black "mine" bubble); read
// is the sole status that spends the blue accent, so "seen" is unmistakable.
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
    case "queued":
      // Held locally, not handed to anyone: an hourglass, distinct from the
      // courier hand-off ("carried") and the transient "sending" clock.
      return (
        <MaterialCommunityIcons
          name="timer-sand"
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
      // Read is the one status that spends colour: a filled blue double-check,
      // the universal "they've seen it" signal. Delivered stays monochrome
      // (a dim double-check), so the jump to blue reads as a real state change.
      return (
        <MaterialCommunityIcons
          name="check-all"
          size={SIZE}
          color={Colors.verified}
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
    case "reclaimed":
      // An ecash payment the sender pulled back. An undo arrow rather than a
      // tick: no tick would be true of a payment that was taken back.
      return (
        <MaterialCommunityIcons
          name="undo-variant"
          size={SIZE}
          color={Colors.textInverse}
          style={dim}
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
    // A wash rather than a border: the row already carries a bubble with its own
    // edges, and a second outline next to the search highlight's ring would be
    // two different meanings drawn the same way.
    messageRowSelected: { backgroundColor: Colors.accentGhost },
    selectCheck: {
      width: 22,
      height: 22,
      borderRadius: Radius.full,
      borderWidth: 1.5,
      borderColor: Colors.borderStrong,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    selectCheckLeading: {
      marginEnd: "auto",
    },
    selectCheckOn: {
      backgroundColor: Colors.accent,
      borderColor: Colors.accent,
    },
    messageRowTheirs: { justifyContent: "flex-start" },
    avatarSpacer: { width: 32, flexShrink: 0 },
    bubbleWrapper: { maxWidth: "75%", gap: 2 },
    bubbleWrapperMine: { alignItems: "flex-end" },
    bubbleWrapperTheirs: { alignItems: "flex-start" },
    senderNameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginBottom: 2,
    },
    senderName: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      marginStart: Spacing.md,
    },
    bubble: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm + 2,
      // Matches the message input box (Radius.xl) so bubbles and the composer
      // share the same generous rounding. The one tail corner (below) stays
      // tight to keep the bubble's pointer.
      borderRadius: Radius.xl,
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
    // @mentions: bold everywhere for emphasis, plus the accent colour on the
    // light "theirs" bubble. On the near-black "mine" bubble the accent has too
    // little contrast, so bold alone carries it (same reasoning as the ticks).
    messageMentionMine: {
      color: Colors.textInverse,
      fontWeight: FontWeight.bold,
    },
    messageMentionTheirs: {
      color: Colors.accent,
      fontWeight: FontWeight.bold,
    },
    // Links are underlined so they read as tappable in both bubbles. Same
    // colour reasoning as mentions: the accent on the light "theirs" bubble,
    // inherited text on the near-black "mine" one.
    messageLink: {
      color: Colors.accent,
      textDecorationLine: "underline",
    },
    messageLinkMine: {
      color: Colors.textInverse,
      textDecorationLine: "underline",
    },
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
  });
}

export default React.memo(
  MessageBubble,
  (prev, next) =>
    prev.item === next.item &&
    prev.renderState === next.renderState &&
    prev.showAvatar === next.showAvatar &&
    prev.isFirstFromSender === next.isFirstFromSender &&
    prev.isPureToken === next.isPureToken &&
    prev.highlighted === next.highlighted &&
    prev.selecting === next.selecting &&
    prev.selected === next.selected,
);
