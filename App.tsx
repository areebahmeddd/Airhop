// Polyfill must be the first import. Required before any @noble/* usage.
import "react-native-get-random-values";

import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import ChannelList from "./src/features/chat/channel-list";
import DmList from "./src/features/chat/dm-list";
import MessageThread from "./src/features/chat/message-thread";
import PeerList from "./src/features/discovery/peer-list";
import IdentityScreen from "./src/features/onboarding/identity-screen";
import UsernameScreen from "./src/features/onboarding/username-screen";
import WelcomeScreen from "./src/features/onboarding/welcome-screen";
import ProfileScreen from "./src/features/settings/profile-screen";
import WalletScreen from "./src/features/wallet/wallet-screen";
import { useChatStore } from "./src/store/chat-store";
import { Colors, FontSize, FontWeight, Spacing } from "./src/ui/theme";
import { peerIDToUsername } from "./src/utils/username";

// ---------------------------------------------------------------------------
// Navigation types
// ---------------------------------------------------------------------------

type OnboardingStep = "welcome" | "generating" | "reveal";
type MainTab = "chats" | "mesh" | "wallet" | "profile";
type ChatSubTab = "channels" | "dms";
type ChatView = { kind: "list" } | { kind: "thread"; channel: string };

// Identity stub â€” wire to loadIdentity() / generateIdentity() before ship.
const STUB_PEER_ID = "a7f3b192c8d04e15";

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export default function App(): React.JSX.Element {
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | null>(
    "welcome",
  );
  const [generatedPeerID, setGeneratedPeerID] = useState<string>(STUB_PEER_ID);
  const [tab, setTab] = useState<MainTab>("chats");
  const [chatSubTab, setChatSubTab] = useState<ChatSubTab>("channels");
  const [chatView, setChatView] = useState<ChatView>({ kind: "list" });
  const { setActiveChannel } = useChatStore();

  // Derived state — computed before any early return so hook call order is stable.
  const isInThread =
    onboardingStep === null && tab === "chats" && chatView.kind === "thread";
  const username = peerIDToUsername(generatedPeerID);

  // Android hardware/gesture back button: exit a message thread.
  useEffect(() => {
    if (!isInThread) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setChatView({ kind: "list" });
      return true; // prevent default (close app)
    });
    return () => sub.remove();
  }, [isInThread]);

  function openChannel(channel: string): void {
    setActiveChannel(channel);
    setChatView({ kind: "thread", channel });
  }

  function closeThread(): void {
    setChatView({ kind: "list" });
  }

  function openDMFromMesh(channel: string): void {
    setActiveChannel(channel);
    setChatSubTab("dms");
    setTab("chats");
    setChatView({ kind: "thread", channel });
  }

  // ---- Render ------------------------------------------------------------

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar style="dark" />

      {/* Onboarding flow */}
      {onboardingStep !== null && (
        <>
          {onboardingStep === "welcome" && (
            <WelcomeScreen onContinue={() => setOnboardingStep("generating")} />
          )}
          {onboardingStep === "generating" && (
            <IdentityScreen
              onComplete={(peerID) => {
                setGeneratedPeerID(peerID);
                setOnboardingStep("reveal");
              }}
            />
          )}
          {onboardingStep === "reveal" && (
            <UsernameScreen
              peerID={generatedPeerID}
              onEnter={() => setOnboardingStep(null)}
            />
          )}
        </>
      )}

      {/* Main app */}
      {onboardingStep === null && (
        <SafeAreaView style={styles.root}>
          {/* Header */}
          {!isInThread && (
            <View style={styles.header}>
              {tab === "chats" && chatView.kind === "list" ? (
                // Chats header: title left, segment right
                <>
                  <Text style={styles.headerTitle}>Chats</Text>
                  <View style={styles.segmented}>
                    <Pressable
                      style={[
                        styles.seg,
                        chatSubTab === "channels" && styles.segActive,
                      ]}
                      onPress={() => setChatSubTab("channels")}
                    >
                      <Text
                        style={[
                          styles.segText,
                          chatSubTab === "channels" && styles.segTextActive,
                        ]}
                      >
                        Channels
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.seg,
                        chatSubTab === "dms" && styles.segActive,
                      ]}
                      onPress={() => setChatSubTab("dms")}
                    >
                      <Text
                        style={[
                          styles.segText,
                          chatSubTab === "dms" && styles.segTextActive,
                        ]}
                      >
                        Direct
                      </Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                // Standard header: just the title
                <Text style={styles.headerTitle}>{HEADER_TITLES[tab]}</Text>
              )}
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>
            {tab === "chats" && chatView.kind === "thread" ? (
              <MessageThread
                channel={chatView.channel}
                localNickname={username}
                localPeerID={generatedPeerID}
                onBack={closeThread}
              />
            ) : tab === "chats" && chatSubTab === "channels" ? (
              <ChannelList onSelectChannel={openChannel} />
            ) : tab === "chats" ? (
              <DmList onSelectDM={openChannel} />
            ) : tab === "mesh" ? (
              <PeerList onOpenDM={openDMFromMesh} />
            ) : tab === "wallet" ? (
              <WalletScreen />
            ) : (
              <ProfileScreen peerID={generatedPeerID} username={username} />
            )}
          </View>

          {/* Tab bar */}
          {!isInThread && (
            <View style={styles.tabBar}>
              {TABS.map(({ id, label, icon }) => {
                const active = tab === id;
                return (
                  <Pressable
                    key={id}
                    style={styles.tabItem}
                    onPress={() => {
                      setTab(id as MainTab);
                      if (id === "chats") setChatView({ kind: "list" });
                    }}
                    accessibilityRole="tab"
                    accessibilityLabel={label}
                    accessibilityState={{ selected: active }}
                  >
                    {active && <View style={styles.tabLine} />}
                    <Feather
                      name={
                        icon as React.ComponentProps<typeof Feather>["name"]
                      }
                      size={22}
                      color={active ? Colors.accent : Colors.textMuted}
                    />
                    <Text
                      style={[styles.tabLabel, active && styles.tabLabelActive]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </SafeAreaView>
      )}
    </SafeAreaProvider>
  );
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const HEADER_TITLES: Record<MainTab, string> = {
  chats: "Chats",
  mesh: "Mesh",
  wallet: "Wallet",
  profile: "Profile",
};

const TABS: { id: MainTab; label: string; icon: string }[] = [
  { id: "chats", label: "Chats", icon: "message-square" },
  { id: "mesh", label: "Mesh", icon: "radio" },
  { id: "wallet", label: "Wallet", icon: "credit-card" },
  { id: "profile", label: "Profile", icon: "user" },
];

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  // Segmented control (Channels / Direct)
  segmented: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceRaised,
    borderRadius: 8,
    padding: 2,
  },
  seg: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: 6,
  },
  segActive: {
    backgroundColor: Colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  segText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
  },
  segTextActive: {
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  // Tab bar
  tabBar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingBottom: Platform.OS === "ios" ? 0 : Spacing.xs,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === "ios" ? Spacing.xs : Spacing.sm,
    gap: 4,
    overflow: "hidden",
  },
  tabLine: {
    position: "absolute",
    top: 0,
    left: "20%",
    right: "20%",
    height: 1.5,
    backgroundColor: Colors.accent,
    borderRadius: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    color: Colors.accent,
  },
});
