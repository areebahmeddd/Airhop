// Polyfill must be the first import. Required before any @noble/* usage.
import "react-native-get-random-values";

import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { loadIdentity } from "./src/core/crypto/identity";
import ChannelList from "./src/features/chat/channel-list";
import DmList from "./src/features/chat/dm-list";
import MessageThread from "./src/features/chat/message-thread";
import PeerList from "./src/features/discovery/peer-list";
import IdentityScreen from "./src/features/onboarding/identity-screen";
import UsernameScreen from "./src/features/onboarding/username-screen";
import WelcomeScreen from "./src/features/onboarding/welcome-screen";
import ProfileScreen from "./src/features/settings/profile-screen";
import WalletScreen from "./src/features/wallet/wallet-screen";
import { getMeshService, initMeshService } from "./src/services/mesh-service";
import { useChatStore } from "./src/store/chat-store";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "./src/ui/theme";
import { peerIDToUsername } from "./src/utils/username";

// ---------------------------------------------------------------------------
// Navigation types
// ---------------------------------------------------------------------------

type OnboardingStep = "welcome" | "generating" | "reveal";
type MainTab = "chats" | "mesh" | "wallet" | "profile";
type ChatSubTab = "channels" | "dms";
type ChatView = { kind: "list" } | { kind: "thread"; channel: string };

// Placeholder peer ID shown before identity is loaded from secure storage.
const FALLBACK_PEER_ID = "0000000000000000";

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export default function App(): React.JSX.Element {
  // appReady guards against a flash of the welcome screen on every launch.
  // The identity check is async, so we render nothing until it resolves.
  const [appReady, setAppReady] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | null>(
    null,
  );
  const [generatedPeerID, setGeneratedPeerID] =
    useState<string>(FALLBACK_PEER_ID);
  const [tab, setTab] = useState<MainTab>("chats");
  const [chatSubTab, setChatSubTab] = useState<ChatSubTab>("channels");
  const [chatView, setChatView] = useState<ChatView>({ kind: "list" });
  // Counter-based trigger: incrementing tells ChannelList to open its join modal.
  const [newChanCounter, setNewChanCounter] = useState(0);
  const { setActiveChannel, unreadCounts, markChannelRead, setLastThread } =
    useChatStore();

  // On mount: check for an existing persisted identity. If found, skip
  // onboarding and start the BLE mesh service immediately.
  useEffect(() => {
    loadIdentity()
      .then((existing) => {
        if (existing) {
          setGeneratedPeerID(existing.peerID);
          setOnboardingStep(null);
          initMeshService(existing, peerIDToUsername(existing.peerID));
          // Restore the last open thread after an OS-kill-and-reopen. The
          // channel name is persisted by setLastThread and cleared by closeThread.
          const { lastThread } = useChatStore.getState();
          if (lastThread) {
            if (lastThread.startsWith("dm:")) setChatSubTab("dms");
            setChatView({ kind: "thread", channel: lastThread });
          }
        } else {
          // First launch: show the welcome/onboarding flow.
          setOnboardingStep("welcome");
        }
        setAppReady(true);
      })
      .catch(() => {
        // EncryptedStorage unavailable (e.g. simulator without secure enclave).
        // Fall through to onboarding so identity can be generated and stored later.
        setOnboardingStep("welcome");
        setAppReady(true);
      });
  }, []);

  // Total unread across all channels, shown as a badge on the Chats tab.
  const chatsUnread = Object.values(unreadCounts).reduce(
    (sum, n) => sum + n,
    0,
  );

  // Derived state computed before any early return so hook call order is stable.
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
    setLastThread(channel);
    markChannelRead(channel);
    setChatView({ kind: "thread", channel });
  }

  function closeThread(): void {
    // Clear the active channel so messages arriving after the user leaves the
    // thread are correctly counted as unread in the list view.
    setActiveChannel("");
    setLastThread("");
    setChatView({ kind: "list" });
  }

  function openDMFromMesh(channel: string): void {
    setActiveChannel(channel);
    setLastThread(channel);
    markChannelRead(channel);
    setChatSubTab("dms");
    setTab("chats");
    setChatView({ kind: "thread", channel });
  }

  // ---- Render ------------------------------------------------------------

  // Render nothing until the identity check resolves. This prevents a flash
  // of the welcome screen for returning users on every app launch.
  if (!appReady) {
    return (
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <View style={{ flex: 1, backgroundColor: Colors.bg }} />
      </SafeAreaProvider>
    );
  }

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
              onEnter={() => {
                setOnboardingStep(null);
                // Identity was just generated and saved by IdentityScreen.
                // Load it and start the mesh service for the first time.
                loadIdentity()
                  .then((id) => {
                    if (id) {
                      setGeneratedPeerID(id.peerID);
                      initMeshService(id, peerIDToUsername(id.peerID));
                    }
                  })
                  .catch(() => {});
              }}
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
                // Chats header: title left, segmented + New button right
                <>
                  <Text style={styles.headerTitle}>Chats</Text>
                  <View style={styles.headerControls}>
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
                    {chatSubTab === "channels" && (
                      <Pressable
                        style={styles.newChannelPill}
                        onPress={() => setNewChanCounter((c) => c + 1)}
                        accessibilityRole="button"
                        accessibilityLabel="Create a channel"
                      >
                        <Feather
                          name="plus"
                          size={18}
                          color={Colors.textSecondary}
                        />
                      </Pressable>
                    )}
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
              <ChannelList
                onSelectChannel={openChannel}
                newChannelTrigger={newChanCounter}
              />
            ) : tab === "chats" ? (
              <DmList onSelectDM={openChannel} />
            ) : tab === "mesh" ? (
              <PeerList onOpenDM={openDMFromMesh} />
            ) : tab === "wallet" ? (
              <WalletScreen />
            ) : (
              <ProfileScreen
                peerID={generatedPeerID}
                username={username}
                onWipe={() => {
                  // Stop BLE mesh immediately so old keys are flushed from memory.
                  getMeshService()?.stop();
                  setGeneratedPeerID(FALLBACK_PEER_ID);
                  setOnboardingStep("welcome");
                }}
              />
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
                    <View
                      style={[
                        styles.tabIndicator,
                        active && styles.tabIndicatorActive,
                      ]}
                    />
                    <View style={styles.tabIconWrap}>
                      <Feather
                        name={
                          icon as React.ComponentProps<typeof Feather>["name"]
                        }
                        size={22}
                        color={active ? Colors.accent : Colors.textMuted}
                      />
                      {id === "chats" && chatsUnread > 0 && (
                        <View style={styles.tabBadge}>
                          <Text style={styles.tabBadgeText}>
                            {chatsUnread > 99 ? "99+" : String(chatsUnread)}
                          </Text>
                        </View>
                      )}
                    </View>
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
    paddingHorizontal: Spacing.base,
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
  headerControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
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
  // Circular + channel button
  newChannelPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceRaised,
  },
  content: {
    flex: 1,
  },
  // Tab bar: floating pill
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    borderRadius: Radius["2xl"],
    paddingBottom: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingBottom: Spacing.xs,
    gap: 4,
  },
  tabIndicator: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: "transparent",
    marginBottom: 2,
  },
  tabIndicatorActive: {
    backgroundColor: Colors.accent,
  },
  tabIconWrap: {
    position: "relative",
  },
  tabBadge: {
    position: "absolute",
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: Radius.full,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: "#FFFFFF",
    lineHeight: 12,
  },
  tabLine: {},
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
