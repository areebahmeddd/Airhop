// Message thread screen for a single channel.
// Shows messages with sender and timestamp. Text input to compose and PTT button.

import { Feather } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getMeshService } from "../../services/mesh-service";
import { useChatStore, type ChatMessage } from "../../store/chat-store";
import Avatar from "../../ui/components/avatar";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../ui/theme";
import { peerIDToUsername } from "../../utils/username";

const ATTACH_OPTIONS: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  desc: string;
}[] = [
  { icon: "camera", label: "Camera", desc: "Take a photo or video" },
  { icon: "image", label: "Photo library", desc: "Choose from your library" },
  { icon: "file", label: "Document", desc: "Send a file or PDF" },
  { icon: "mic", label: "Voice note", desc: "Record a voice message" },
];

interface Props {
  channel: string;
  localNickname: string;
  localPeerID: string;
  onBack: () => void;
}

export default function MessageThread({
  channel,
  localNickname,
  localPeerID,
  onBack,
}: Props): React.JSX.Element {
  const { messages, addMessage } = useChatStore();
  const [draft, setDraft] = useState("");
  const [isPTTActive, setIsPTTActive] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const msgs = messages[channel] ?? [];
  const isDM = channel.startsWith("dm:");

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: `${localPeerID}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      channel,
      senderID: localPeerID,
      senderNickname: localNickname,
      text,
      timestampMs: Date.now(),
      isMine: true,
    };
    addMessage(msg);
    setDraft("");

    // Broadcast over BLE mesh (channel) or route as DM.
    const service = getMeshService();
    if (service) {
      if (isDM) {
        service.sendDm(channel.slice(3), text);
      } else {
        service.sendChannelMessage(channel, text);
      }
    }
  }, [draft, channel, localPeerID, localNickname, addMessage, isDM]);

  function handleAttach(): void {
    setShowAttachMenu(true);
  }

  function handleInvite(): void {
    void Share.share({
      message: `Join me in ${channel} on Airhop - offline-first, private mesh messaging.`,
    });
  }

  function formatTime(ms: number): string {
    const d = new Date(ms);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Show a date separator when consecutive messages are from different days.
  function needsDateSeparator(idx: number): boolean {
    if (idx === 0) return true;
    const cur = new Date(msgs[idx].timestampMs);
    const prev = new Date(msgs[idx - 1].timestampMs);
    return (
      cur.getDate() !== prev.getDate() ||
      cur.getMonth() !== prev.getMonth() ||
      cur.getFullYear() !== prev.getFullYear()
    );
  }

  function formatDateSeparator(ms: number): string {
    const d = new Date(ms);
    const now = new Date();
    if (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    ) {
      return "Today";
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }
    return d.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  const displayName = channel.startsWith("dm:")
    ? peerIDToUsername(channel.slice(3))
    : channel;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.channelTitle} numberOfLines={1}>
            {isDM ? displayName : channel}
          </Text>
          {isDM && <Feather name="lock" size={12} color={Colors.textMuted} />}
        </View>

        <View style={styles.headerRight}>
          {isDM ? (
            <Avatar
              username={peerIDToUsername(channel.slice(3))}
              peerID={channel.slice(3)}
              size={28}
            />
          ) : (
            <Pressable
              onPress={handleInvite}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Invite someone to this channel"
            >
              <Feather
                name="user-plus"
                size={18}
                color={Colors.textSecondary}
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const showAvatar = !item.isMine;
          const isFirstFromSender =
            index === 0 || msgs[index - 1].senderID !== item.senderID;

          return (
            <View>
              {needsDateSeparator(index) && (
                <View style={styles.dateSeparator}>
                  <View style={styles.dateLine} />
                  <Text style={styles.dateLabel}>
                    {formatDateSeparator(item.timestampMs)}
                  </Text>
                  <View style={styles.dateLine} />
                </View>
              )}
              <View
                style={[
                  styles.messageRow,
                  item.isMine ? styles.messageRowMine : styles.messageRowTheirs,
                ]}
              >
                {/* Avatar placeholder for alignment */}
                {showAvatar ? (
                  isFirstFromSender ? (
                    <Avatar
                      username={item.senderNickname}
                      peerID={item.senderID}
                      size={32}
                    />
                  ) : (
                    <View style={styles.avatarSpacer} />
                  )
                ) : null}

                <View
                  style={[
                    styles.bubbleWrapper,
                    item.isMine
                      ? styles.bubbleWrapperMine
                      : styles.bubbleWrapperTheirs,
                  ]}
                >
                  {showAvatar && isFirstFromSender && (
                    <Text style={styles.senderName}>{item.senderNickname}</Text>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      item.isMine ? styles.bubbleMine : styles.bubbleTheirs,
                      // Tail shape: square the corner closest to avatar/edge
                      !item.isMine &&
                        isFirstFromSender &&
                        styles.bubbleTailLeft,
                      item.isMine && styles.bubbleTailRight,
                    ]}
                  >
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
                    <Text
                      style={[
                        styles.timestamp,
                        item.isMine && styles.timestampMine,
                      ]}
                    >
                      {formatTime(item.timestampMs)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
        onContentSizeChange={() => {
          if (msgs.length > 0)
            listRef.current?.scrollToEnd({ animated: false });
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              {isDM
                ? "Start an encrypted conversation."
                : `Say something in ${channel}.`}
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      {/* Compose bar */}
      <View style={styles.composeBar}>
        <Pressable
          style={styles.attachButton}
          onPress={handleAttach}
          accessibilityRole="button"
          accessibilityLabel="Attach a file"
        >
          <Feather name="paperclip" size={18} color={Colors.textMuted} />
        </Pressable>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder={"Message\u2026"}
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={2000}
          returnKeyType="send"
          blurOnSubmit
          onSubmitEditing={handleSend}
          selectionColor={Colors.accent}
        />

        {draft.trim().length > 0 ? (
          // Send button: shown when there is text
          <Pressable
            style={styles.sendButton}
            onPress={handleSend}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Feather name="arrow-up" size={18} color={Colors.textInverse} />
          </Pressable>
        ) : (
          // PTT button: hold to talk
          <Pressable
            style={[styles.pttButton, isPTTActive && styles.pttButtonActive]}
            onPressIn={() => setIsPTTActive(true)}
            onPressOut={() => setIsPTTActive(false)}
            accessibilityRole="button"
            accessibilityLabel="Hold to talk"
          >
            <Feather
              name="mic"
              size={16}
              color={isPTTActive ? Colors.danger : Colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      {/* Attachment picker */}
      <Modal
        visible={showAttachMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachMenu(false)}
      >
        <Pressable
          style={styles.attachOverlay}
          onPress={() => setShowAttachMenu(false)}
        >
          <Pressable style={styles.attachSheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.attachSheetTitle}>Attach</Text>
            {ATTACH_OPTIONS.map(({ icon, label, desc }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <View style={styles.attachSeparator} />}
                <Pressable
                  style={({ pressed }) => [
                    styles.attachOption,
                    pressed && styles.attachOptionPressed,
                  ]}
                  onPress={() => {
                    setShowAttachMenu(false);
                    Alert.alert(
                      label,
                      `${desc}. File transfer is built into the mesh core and will connect to this UI in an upcoming update.`,
                    );
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                >
                  <View style={styles.attachOptionIcon}>
                    <Feather
                      name={icon}
                      size={20}
                      color={Colors.textSecondary}
                    />
                  </View>
                  <View style={styles.attachOptionBody}>
                    <Text style={styles.attachOptionLabel}>{label}</Text>
                    <Text style={styles.attachOptionDesc}>{desc}</Text>
                  </View>
                </Pressable>
              </React.Fragment>
            ))}
            <Pressable
              style={styles.attachCancel}
              onPress={() => setShowAttachMenu(false)}
              accessibilityRole="button"
            >
              <Text style={styles.attachCancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
    minHeight: 56,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  channelTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    flexShrink: 1,
  },
  encryptedBadge: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.sm,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  encryptedBadgeText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 36,
    alignItems: "center",
  },
  // Messages
  list: {
    flexGrow: 1,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  dateSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  dateLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
  dateLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 0.4,
  },
  messageRow: {
    flexDirection: "row",
    marginVertical: 2,
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  messageRowMine: {
    justifyContent: "flex-end",
  },
  messageRowTheirs: {
    justifyContent: "flex-start",
  },
  avatarSpacer: {
    width: 32,
    flexShrink: 0,
  },
  bubbleWrapper: {
    maxWidth: "75%",
    gap: 2,
  },
  bubbleWrapperMine: {
    alignItems: "flex-end",
  },
  bubbleWrapperTheirs: {
    alignItems: "flex-start",
  },
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
  bubbleMine: {
    backgroundColor: Colors.myBubble,
  },
  bubbleTheirs: {
    backgroundColor: Colors.theirBubble,
  },
  // Flatten the corner that points "at" the sender
  bubbleTailLeft: {
    borderBottomLeftRadius: Radius.sm,
  },
  bubbleTailRight: {
    borderBottomRightRadius: Radius.sm,
  },
  messageText: {
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.5,
  },
  messageTextMine: {
    color: Colors.textInverse,
  },
  messageTextTheirs: {
    color: Colors.textPrimary,
  },
  timestamp: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  timestampMine: {
    color: "rgba(255,255,255,0.55)",
  },
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
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
  // Compose bar
  composeBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.bg,
  },
  attachButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginBottom: 3,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    maxHeight: 120,
    lineHeight: FontSize.base * 1.4,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.accent,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginBottom: 1,
  },
  pttButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginBottom: 1,
  },
  pttButtonActive: {
    backgroundColor: Colors.dangerDim,
    borderColor: Colors.danger,
  },
  // Attachment picker sheet
  attachOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end",
  },
  attachSheet: {
    alignSelf: "stretch",
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius["2xl"],
    borderTopRightRadius: Radius["2xl"],
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing["2xl"],
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderStrong,
    alignSelf: "center",
    marginBottom: Spacing.md,
  },
  attachSheetTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  attachOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.base,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
  },
  attachOptionPressed: {
    backgroundColor: Colors.surfaceRaised,
  },
  attachOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  attachOptionBody: {
    flex: 1,
  },
  attachOptionLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  attachOptionDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  attachSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: 44 + Spacing.base + Spacing.sm,
  },
  attachCancel: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    paddingVertical: Spacing.base,
    alignItems: "center",
    marginTop: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attachCancelText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
});
