// DM (direct message) list screen.
// Shows one-on-one encrypted conversations, identified by channels prefixed
// with "dm:<peerID>". These use Noise XX + Double Ratchet for E2E encryption.

import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useChatStore } from "../../store/chat-store";
import Avatar from "../../ui/components/avatar";
import { Colors, FontSize, FontWeight, Spacing } from "../../ui/theme";
import { peerIDToUsername } from "../../utils/username";

interface Props {
  onSelectDM: (channel: string) => void;
}

export default function DmList({ onSelectDM }: Props): React.JSX.Element {
  const { channels, messages } = useChatStore();

  // DM channels are prefixed "dm:<16-hex peerID>".
  const dmChannels = channels.filter((c) => c.startsWith("dm:"));

  return (
    <View style={styles.container}>
      <FlatList
        data={dmChannels}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const peerID = item.slice(3);
          const username = peerIDToUsername(peerID);
          const msgs = messages[item] ?? [];
          const last = msgs[msgs.length - 1];

          return (
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
              onPress={() => onSelectDM(item)}
              accessibilityRole="button"
              accessibilityLabel={`Open DM with ${username}`}
            >
              {/* Avatar */}
              <View style={styles.avatarWrapper}>
                <Avatar username={username} peerID={peerID} size={46} />
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
                      {last.text}
                    </Text>
                  ) : (
                    <Text style={styles.previewEmpty}>No messages yet</Text>
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
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    minHeight: 72,
  },
  rowPressed: {
    backgroundColor: Colors.surface,
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
  lockIcon: {}, // removed
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
});
