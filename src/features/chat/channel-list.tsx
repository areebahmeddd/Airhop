// Channel list screen.
// Shows all joined channels with the last message preview.
// Tap a channel to open its message thread.

import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useChatStore } from "../../store/chat-store";

interface Props {
  onSelectChannel: (channel: string) => void;
}

export default function ChannelList({
  onSelectChannel,
}: Props): React.JSX.Element {
  const { channels, messages, addChannel } = useChatStore();
  const [newChannel, setNewChannel] = useState("");

  function handleAdd(): void {
    const name = newChannel.trim().replace(/^#*/, "#");
    if (name.length < 2) return;
    addChannel(name);
    setNewChannel("");
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={channels}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const msgs = messages[item] ?? [];
          const last = msgs[msgs.length - 1];
          return (
            <Pressable style={styles.row} onPress={() => onSelectChannel(item)}>
              <Text style={styles.channelName}>{item}</Text>
              {last ? (
                <Text style={styles.preview} numberOfLines={1}>
                  {last.senderNickname}: {last.text}
                </Text>
              ) : (
                <Text style={styles.empty}>No messages yet</Text>
              )}
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No channels. Add one below.</Text>
        }
        contentContainerStyle={styles.list}
      />
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={newChannel}
          onChangeText={setNewChannel}
          placeholder="#new-channel"
          placeholderTextColor="#555"
          autoCapitalize="none"
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <Pressable style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
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
  list: {
    flexGrow: 1,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  channelName: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "monospace",
  },
  preview: {
    color: "#666",
    fontSize: 13,
    fontFamily: "monospace",
    marginTop: 2,
  },
  empty: {
    color: "#444",
    fontSize: 13,
    fontFamily: "monospace",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#1a1a1a",
    marginLeft: 16,
  },
  addRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    padding: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 14,
  },
});
