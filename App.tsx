// Polyfill must be the first import. Required before any @noble/* usage.
import "react-native-get-random-values";

import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ChannelList from "./src/features/chat/channel-list";
import MessageThread from "./src/features/chat/message-thread";
import PeerList from "./src/features/discovery/peer-list";
import { useChatStore } from "./src/store/chat-store";

// In v0.7+ these come from the identity/key store. Stubbed for v0.6 UI.
const LOCAL_PEER_ID = "0000000000000000";
const LOCAL_NICKNAME = "me";

type Tab = "chat" | "peers";
type ChatView = { kind: "channels" } | { kind: "thread"; channel: string };

export default function App(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>("chat");
  const [chatView, setChatView] = useState<ChatView>({ kind: "channels" });
  const { setActiveChannel } = useChatStore();

  function openChannel(channel: string): void {
    setActiveChannel(channel);
    setChatView({ kind: "thread", channel });
  }

  function closeThread(): void {
    setChatView({ kind: "channels" });
  }

  const headerTitle =
    tab === "peers"
      ? "Nearby Peers"
      : chatView.kind === "thread"
        ? chatView.channel
        : "Channels";

  // The message-thread screen manages its own header (with back button),
  // so we skip the shared header when it's active.
  const showSharedHeader = !(tab === "chat" && chatView.kind === "thread");

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {showSharedHeader && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
      )}

      <View style={styles.content}>
        {tab === "chat" ? (
          chatView.kind === "thread" ? (
            <MessageThread
              channel={chatView.channel}
              localNickname={LOCAL_NICKNAME}
              localPeerID={LOCAL_PEER_ID}
              onBack={closeThread}
            />
          ) : (
            <ChannelList onSelectChannel={openChannel} />
          )
        ) : (
          <PeerList />
        )}
      </View>

      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, tab === "chat" && styles.tabActive]}
          onPress={() => setTab("chat")}
        >
          <Text
            style={[styles.tabIcon, tab === "chat" && styles.tabIconActive]}
          >
            ◉
          </Text>
          <Text
            style={[styles.tabLabel, tab === "chat" && styles.tabLabelActive]}
          >
            Chat
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === "peers" && styles.tabActive]}
          onPress={() => setTab("peers")}
        >
          <Text
            style={[styles.tabIcon, tab === "peers" && styles.tabIconActive]}
          >
            ◎
          </Text>
          <Text
            style={[styles.tabLabel, tab === "peers" && styles.tabLabelActive]}
          >
            Peers
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
    backgroundColor: "#000",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    gap: 2,
  },
  tabActive: {
    borderTopWidth: 2,
    borderTopColor: "#fff",
    marginTop: -1,
  },
  tabIcon: {
    color: "#444",
    fontSize: 18,
  },
  tabIconActive: {
    color: "#fff",
  },
  tabLabel: {
    color: "#444",
    fontSize: 11,
    fontFamily: "monospace",
  },
  tabLabelActive: {
    color: "#fff",
  },
});
