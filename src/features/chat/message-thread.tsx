// Message thread screen for a single channel.
// Shows messages with sender and timestamp. Text input to compose.

import React, { useCallback, useRef } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useChatStore, type ChatMessage } from "../../store/chat-store";

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
  const [draft, setDraft] = React.useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const msgs = messages[channel] ?? [];

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
    // The actual BLE send would happen here via the mesh service.
    // For v0.6 UI: message is stored locally; BLE delivery wired in v0.7.
  }, [draft, channel, localPeerID, localNickname, addMessage]);

  function formatTime(ms: number): string {
    const d = new Date(ms);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.channelTitle}>{channel}</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[styles.bubble, item.isMine ? styles.mine : styles.theirs]}
          >
            {!item.isMine && (
              <Text style={styles.senderName}>{item.senderNickname}</Text>
            )}
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{formatTime(item.timestampMs)}</Text>
          </View>
        )}
        onContentSizeChange={() => {
          if (msgs.length > 0)
            listRef.current?.scrollToEnd({ animated: false });
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No messages in {channel} yet.{"\n"}Be the first to say something.
          </Text>
        }
        contentContainerStyle={styles.list}
      />

      {/* Compose */}
      <View style={styles.composeRow}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Message..."
          placeholderTextColor="#444"
          multiline
          maxLength={2000}
          returnKeyType="send"
          blurOnSubmit
          onSubmitEditing={handleSend}
        />
        <Pressable
          style={[
            styles.sendButton,
            !draft.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!draft.trim()}
        >
          <Text style={styles.sendText}>↑</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  backButton: {
    paddingRight: 12,
  },
  backText: {
    color: "#fff",
    fontSize: 24,
    lineHeight: 28,
  },
  channelTitle: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "monospace",
  },
  list: {
    padding: 12,
    flexGrow: 1,
  },
  bubble: {
    maxWidth: "80%",
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: "#1a2a1a",
  },
  theirs: {
    alignSelf: "flex-start",
    backgroundColor: "#1a1a1a",
  },
  senderName: {
    color: "#888",
    fontSize: 11,
    fontFamily: "monospace",
    marginBottom: 2,
  },
  messageText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "monospace",
  },
  timestamp: {
    color: "#444",
    fontSize: 10,
    fontFamily: "monospace",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  empty: {
    color: "#444",
    fontSize: 13,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 60,
    lineHeight: 22,
  },
  composeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    padding: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 15,
    maxHeight: 120,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: "#2a4a2a",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#1a1a1a",
  },
  sendText: {
    color: "#fff",
    fontSize: 18,
  },
});
