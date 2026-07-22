// Global search results: ranked "Chats" (name matches) and "Messages"
// (content matches) sections, shown in place of the channel/DM list while
// the App-level search bar has an active query. Mirrors the WhatsApp /
// Telegram / Signal convention of one unified search surface across every
// chat, not scoped to whichever sub-tab happens to be selected.

import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, SectionList, StyleSheet, Text, View } from "react-native";
import { useChatStore } from "../../store/chat-store";
import Avatar from "../../ui/components/avatar";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import {
  searchChats,
  searchMessages,
  type ChatHit,
  type MessageHit,
} from "../../utils/chat-search";
import { peerIDToUsername } from "../../utils/username";

// Debounce so fast typing doesn't recompute the scan on every keystroke.
const DEBOUNCE_MS = 150;

interface Props {
  query: string;
  onSelectChat: (channel: string) => void;
  onSelectMessage: (channel: string, messageId: string) => void;
}

type ResultRow =
  { kind: "chat"; hit: ChatHit } | { kind: "message"; hit: MessageHit };

interface ResultSection {
  title: string;
  data: ResultRow[];
}

function channelDisplayName(channel: string): string {
  return channel.startsWith("dm:")
    ? peerIDToUsername(channel.slice(3))
    : channel.replace(/^#/, "");
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

export default function ChatSearchResults({
  query,
  onSelectChat,
  onSelectMessage,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const channels = useChatStore((s) => s.channels);
  const messages = useChatStore((s) => s.messages);

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const chatHits = useMemo(
    () => searchChats(debouncedQuery, channels),
    [debouncedQuery, channels],
  );
  const messageHits = useMemo(
    () => searchMessages(debouncedQuery, messages),
    [debouncedQuery, messages],
  );

  const sections: ResultSection[] = [
    ...(chatHits.length > 0
      ? [
          {
            title: "Chats",
            data: chatHits.map((hit): ResultRow => ({ kind: "chat", hit })),
          },
        ]
      : []),
    ...(messageHits.length > 0
      ? [
          {
            title: "Messages",
            data: messageHits.map((hit): ResultRow => ({
              kind: "message",
              hit,
            })),
          },
        ]
      : []),
  ];

  const trimmed = debouncedQuery.trim();
  if (trimmed.length === 0) return <View style={styles.container} />;

  if (sections.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Feather name="search" size={26} color={Colors.textMuted} />
        <Text style={styles.emptyText}>
          No results for &ldquo;{trimmed}&rdquo;
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList<ResultRow, ResultSection>
        sections={sections}
        keyExtractor={(row, index) =>
          row.kind === "chat"
            ? `chat-${row.hit.channel}`
            : `msg-${row.hit.messageId}-${index}`
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={({ item }) =>
          item.kind === "chat" ? (
            <ChatResultRow
              hit={item.hit}
              styles={styles}
              colors={Colors}
              onPress={onSelectChat}
            />
          ) : (
            <MessageResultRow
              hit={item.hit}
              styles={styles}
              colors={Colors}
              onPress={onSelectMessage}
            />
          )
        }
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

function ChatResultRow({
  hit,
  styles,
  colors,
  onPress,
}: {
  hit: ChatHit;
  styles: ReturnType<typeof createStyles>;
  colors: ReturnType<typeof useThemeColors>;
  onPress: (channel: string) => void;
}): React.JSX.Element {
  const isDM = hit.channel.startsWith("dm:");
  return (
    <Pressable
      style={styles.row}
      onPress={() => onPress(hit.channel)}
      accessibilityRole="button"
      accessibilityLabel={`Open ${hit.displayName}`}
    >
      {isDM ? (
        <Avatar
          username={hit.displayName}
          peerID={hit.channel.slice(3)}
          size={36}
        />
      ) : (
        <View style={styles.channelIcon}>
          <Feather name="hash" size={16} color={colors.textSecondary} />
        </View>
      )}
      <Text style={styles.chatName} numberOfLines={1}>
        {hit.displayName}
      </Text>
    </Pressable>
  );
}

function MessageResultRow({
  hit,
  styles,
  colors,
  onPress,
}: {
  hit: MessageHit;
  styles: ReturnType<typeof createStyles>;
  colors: ReturnType<typeof useThemeColors>;
  onPress: (channel: string, messageId: string) => void;
}): React.JSX.Element {
  const before = hit.snippet.slice(0, hit.matchStart);
  const match = hit.snippet.slice(hit.matchStart, hit.matchEnd);
  const after = hit.snippet.slice(hit.matchEnd);
  return (
    <Pressable
      style={styles.row}
      onPress={() => onPress(hit.channel, hit.messageId)}
      accessibilityRole="button"
      accessibilityLabel={`${channelDisplayName(hit.channel)}, message from ${
        hit.isMine ? "you" : hit.senderNickname
      }: ${hit.snippet}`}
    >
      <View style={styles.channelIcon}>
        <Feather
          name={hit.channel.startsWith("dm:") ? "user" : "hash"}
          size={16}
          color={colors.textSecondary}
        />
      </View>
      <View style={styles.messageBody}>
        <View style={styles.messageHead}>
          <Text style={styles.messageChannel} numberOfLines={1}>
            {channelDisplayName(hit.channel)}
          </Text>
          <Text style={styles.messageTime}>{formatTime(hit.timestampMs)}</Text>
        </View>
        <Text style={styles.messageSnippet} numberOfLines={2}>
          <Text style={styles.messageSender}>
            {hit.isMine ? "You" : hit.senderNickname}:{" "}
          </Text>
          {before}
          <Text style={styles.messageMatch}>{match}</Text>
          {after}
        </Text>
      </View>
    </Pressable>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    list: {
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing["3xl"],
    },
    sectionTitle: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginTop: Spacing.base,
      marginBottom: Spacing.xs,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      padding: Spacing.sm,
      borderRadius: Radius.lg,
      backgroundColor: Colors.surfaceRaised,
      marginBottom: Spacing.xs,
    },
    channelIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    chatName: {
      flex: 1,
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: Colors.textPrimary,
    },
    messageBody: {
      flex: 1,
      gap: 2,
    },
    messageHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    messageChannel: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      flexShrink: 1,
    },
    messageTime: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    messageSnippet: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm * 1.4,
    },
    messageSender: {
      color: Colors.textPrimary,
      fontWeight: FontWeight.medium,
    },
    messageMatch: {
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      backgroundColor: Colors.accentGhost,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing["4xl"],
    },
    emptyText: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
    },
  });
}
