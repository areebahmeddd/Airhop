// Polyfill must be the first import. Required before any @noble/* usage.
import "react-native-get-random-values";

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { bytesToHex } from "@noble/hashes/utils.js";
import { StatusBar } from "expo-status-bar";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AppState,
  BackHandler,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { decodeQRContent } from "./src/core/crypto/contact-exchange";
import type { Identity } from "./src/core/crypto/identity";
import { loadIdentity } from "./src/core/crypto/identity";
import { isValidChannelKey } from "./src/core/mesh/channel-crypto";
import AiScreen from "./src/features/ai/ai-screen";
import ChannelList from "./src/features/chat/channel-list";
import ChatSearchResults from "./src/features/chat/chat-search-results";
import DmList from "./src/features/chat/dm-list";
import MessageThread from "./src/features/chat/message-thread";
import NotificationCenter from "./src/features/chat/notification-center";
import PeerList from "./src/features/discovery/peer-list";
import IdentityScreen from "./src/features/onboarding/identity-screen";
import UsernameScreen from "./src/features/onboarding/username-screen";
import WelcomeScreen from "./src/features/onboarding/welcome-screen";
import ProfileScreen from "./src/features/settings/profile-screen";
import WalletScreen, {
  type WalletAction,
} from "./src/features/wallet/wallet-screen";
import {
  hasLocationPermission,
  requestLocationPermission,
} from "./src/services/location-service";
import { getMeshService, initMeshService } from "./src/services/mesh-service";
import {
  configureNotifications,
  dismissNotificationsFor,
  handleInboundMessage,
  requestNotificationPermission,
  setAppBadgeCount,
  setNotificationNavigator,
  setNotificationsActiveChannel,
  setNotificationsAppActive,
} from "./src/services/notification-service";
import { useActivityStore } from "./src/store/activity-store";
import { showAlert } from "./src/store/alert-store";
import { subscribeInboundMessages, useChatStore } from "./src/store/chat-store";
import { useContactsStore } from "./src/store/contacts-store";
import { useMeshState, useMeshStateStore } from "./src/store/mesh-state-store";
import { useSettingsStore } from "./src/store/settings-store";
import { useTransferStore } from "./src/store/transfer-store";
import Avatar from "./src/ui/components/avatar";
import CustomAlert from "./src/ui/components/custom-alert";
import MeshStatusBar from "./src/ui/components/mesh-status-bar";
import TransferBadge from "./src/ui/components/transfer-badge";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useResolvedTheme,
  useThemeColors,
} from "./src/ui/theme";
import { ensureBlePermissions } from "./src/utils/ble-permissions";
import { parseAirhopLink } from "./src/utils/deep-link";
import { messagePreviewText } from "./src/utils/message-preview";
import { sumUnread } from "./src/utils/unread";
import { peerIDToUsername } from "./src/utils/username";

// ---------------------------------------------------------------------------
// Navigation types
// ---------------------------------------------------------------------------

type OnboardingStep = "welcome" | "generating" | "reveal";
type MainTab = "chats" | "mesh" | "ai" | "wallet" | "profile";
type ChatSubTab = "channels" | "dms";
type ChatView =
  { kind: "list" } | { kind: "thread"; channel: string } | { kind: "search" };

// Which message a thread should scroll to and flash on open, set from a
// search-result tap. `trigger` increments on every selection so re-tapping
// the same result re-fires the effect (an id-only dependency wouldn't).
interface MessageTarget {
  channel: string;
  messageId: string;
  trigger: number;
}

// Placeholder peer ID shown before identity is loaded from secure storage.
const FALLBACK_PEER_ID = "0000000000000000";

// Request the BLE runtime permissions the OS requires, THEN start the mesh.
// Without the grant, native startScanning/startAdvertising throw and are
// swallowed: a silent, total discovery failure. On denial we surface a
// dialog instead of failing quietly, and still start the service so Nostr
// (internet) transport keeps working even when BLE is unavailable.
async function startMeshWithPermissions(
  identity: Identity,
  nickname: string,
): Promise<void> {
  const perm = await ensureBlePermissions();
  // Record the grant so the Mesh tab can explain an empty peer list rather
  // than spinning "Scanning…" forever with no route to a fix.
  useMeshStateStore.getState().setPermissionGranted(perm.granted);
  if (!perm.granted) {
    showAlert(
      "Bluetooth permission needed",
      perm.blockedForever
        ? "Airhop can't find nearby devices without Bluetooth (and Nearby devices/Location) permission. Enable it in Settings → Apps → Airhop → Permissions."
        : "Airhop needs Bluetooth and Location permission to discover nearby devices over the mesh. Without it, only internet (Nostr) messaging will work.",
    );
  }
  initMeshService(identity, nickname);

  // Remaining permission prompts, sequenced one after another so the OS never
  // shows two at once (concurrent prompts raced on a fresh install: the
  // notification prompt got swallowed and sometimes crashed). Runs after the
  // mesh has started so BLE is never held up waiting on any of them.
  //   1. Location powers the geohash public channels (#block…#region): without a
  //      position the app cannot resolve its cell, so they stay BLE-only and
  //      never show internet participants or bitchat traffic. On Android the BLE
  //      grant above already covers it; on iOS this is the only place it is asked.
  //   2. Notifications, last, so it lands cleanly after the others.
  void (async () => {
    const granted =
      (await hasLocationPermission()) || (await requestLocationPermission());
    if (granted) getMeshService()?.refreshGeoChannels();
    await requestNotificationPermission();
  })();
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export default function App(): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const resolvedTheme = useResolvedTheme();

  // appReady guards against a flash of the welcome screen on every launch.
  // The identity check is async, so we render nothing until it resolves.
  const [appReady, setAppReady] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | null>(
    null,
  );
  const [generatedPeerID, setGeneratedPeerID] =
    useState<string>(FALLBACK_PEER_ID);
  const [tab, setTab] = useState<MainTab>("mesh");
  // Bumped whenever the Profile tab is tapped, so tapping "You" while inside a
  // sub-screen (About, Version, ...) pops ProfileScreen back to its root, the
  // same way tapping Chats returns to the conversation list.
  const [profileResetSignal, setProfileResetSignal] = useState(0);
  // Which way the last tab change moved through TABS, so the content
  // transition slides the same direction the tab bar (or swipe) implied.
  const [tabDirection, setTabDirection] = useState<"forward" | "backward">(
    "forward",
  );
  const [chatSubTab, setChatSubTab] = useState<ChatSubTab>("channels");
  const [chatView, setChatView] = useState<ChatView>({ kind: "list" });
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);
  // Which message a search result should scroll a thread to on open.
  const [messageTarget, setMessageTarget] = useState<MessageTarget | null>(
    null,
  );
  // Counter-based trigger: incrementing tells ChannelList to open its join modal.
  const [newChanCounter, setNewChanCounter] = useState(0);
  const [meshViewMode, setMeshViewMode] = useState<"list" | "radar">("radar");
  // Counter-based trigger: incrementing tells PeerList to open the add-contact scanner.
  const [meshAddCounter, setMeshAddCounter] = useState(0);
  // Counter-based trigger: incrementing (with an action) tells WalletScreen
  // to open the matching modal, same pattern as newChanCounter/meshAddCounter.
  const [walletAction, setWalletAction] = useState<WalletAction | null>(null);
  const [walletActionTrigger, setWalletActionTrigger] = useState(0);
  // Notification center (bell) visibility, and the count of unseen activity
  // that badges the bell. Subscribing to entries keeps the badge live.
  const [showActivity, setShowActivity] = useState(false);
  const activityUnseen = useActivityStore((s) =>
    s.entries.reduce((n, e) => (e.seen ? n : n + 1), 0),
  );
  const {
    setActiveChannel,
    unreadCounts,
    mutedChannels,
    markChannelRead,
    setLastThread,
  } = useChatStore();
  const { state: meshState } = useMeshState();
  // Payments is switchable from the profile screen, so the tab bar (and the
  // swipe order that follows it) is derived rather than fixed.
  const paymentsEnabled = useSettingsStore((s) => s.paymentsEnabled);
  const tabs = useMemo(
    () => ALL_TABS.filter((t) => t.id !== "wallet" || paymentsEnabled),
    [paymentsEnabled],
  );

  // On mount: check for an existing persisted identity. If found, skip
  // onboarding and start the BLE mesh service immediately.
  useEffect(() => {
    loadIdentity()
      .then((existing) => {
        if (existing) {
          setGeneratedPeerID(existing.peerID);
          setOnboardingStep(null);
          void startMeshWithPermissions(
            existing,
            peerIDToUsername(existing.peerID),
          );
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

  // Aggregate unread for the badges, muted conversations excluded (their
  // per-row count still shows; they just do not shout at the app level). Split
  // by the "dm:" prefix (see chat-store) so the Channels/Direct segments show
  // which side the activity is on, from one source of truth.
  const chatsUnread = sumUnread(unreadCounts, mutedChannels);
  const channelsUnread = sumUnread(
    unreadCounts,
    mutedChannels,
    (channel) => !channel.startsWith("dm:"),
  );
  const dmsUnread = sumUnread(unreadCounts, mutedChannels, (channel) =>
    channel.startsWith("dm:"),
  );

  // Derived state computed before any early return so hook call order is stable.
  const isInThread =
    onboardingStep === null && tab === "chats" && chatView.kind === "thread";
  const isSearching =
    onboardingStep === null && tab === "chats" && chatView.kind === "search";
  const username = peerIDToUsername(generatedPeerID);

  // Android hardware/gesture back button: exit a message thread, or cancel
  // an in-progress search. Otherwise back would fall through to minimizing
  // the app while either is open.
  useEffect(() => {
    if (!isInThread && !isSearching) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (isInThread) {
        setChatView({ kind: "list" });
      } else {
        handleCancelSearch();
      }
      return true; // prevent default (close app)
    });
    return () => sub.remove();
  }, [isInThread, isSearching]);

  // Transfer watchdog: promote quiet transfers to "stalled", then "failed", on a
  // wall clock. This is what turns a bar frozen mid-progress (peer out of range)
  // into an honest "waiting for peer" and eventually a themed failure, rather
  // than a silent lie. Only ticks while transfers exist, so it costs nothing at
  // rest. See transfer-store reconcile().
  const hasTransfers = useTransferStore(
    (s) => Object.keys(s.transfers).length > 0,
  );
  useEffect(() => {
    if (!hasTransfers) return;
    const handle = setInterval(
      () => useTransferStore.getState().reconcile(),
      3000,
    );
    return () => clearInterval(handle);
  }, [hasTransfers]);

  // Local message notifications. There is no push server: the running process
  // raises these itself the instant a message lands over any transport (BLE,
  // WiFi, courier, Nostr), so a backgrounded app still alerts. On Android the
  // mesh foreground service keeps the process alive to make that possible; on
  // iOS it fires whenever the OS has the app awake. See notification-service.
  // The ref lets a notification tap open the right thread without re-registering
  // the handler on every render.
  const openChannelRef = useRef<(channel: string) => void>(() => undefined);

  // Foreground/background tracking, so a banner is only raised when the user is
  // not already looking at the app.
  useEffect(() => {
    setNotificationsAppActive(AppState.currentState === "active");
    const sub = AppState.addEventListener("change", (next) => {
      setNotificationsAppActive(next === "active");
    });
    return () => sub.remove();
  }, []);

  // One-time setup, deferred until past onboarding so the OS permission prompt
  // lands on the mesh screen in context (alongside the Bluetooth/Location
  // prompt) rather than on the welcome screen. Wires the inbound observer
  // (raise a notification) and the tap handler (open the conversation).
  //
  // The appReady guard matters: onboardingStep starts as null (unknown) before
  // loadIdentity resolves, so without it a brand-new install would run this
  // during that initial window and fire the notification prompt at launch,
  // before onboarding even appears.
  useEffect(() => {
    if (!appReady || onboardingStep !== null) return;
    setNotificationNavigator((channel) => openChannelRef.current(channel));
    const unsubscribe = subscribeInboundMessages((msg) => {
      const chat = useChatStore.getState();
      const isMuted = chat.mutedChannels.includes(msg.channel);
      // A muted conversation stays silent: no system notification, no haptic,
      // and no bell entry. Its unread still shows on its own row.
      if (!isMuted) {
        void handleInboundMessage(
          msg,
          sumUnread(chat.unreadCounts, chat.mutedChannels),
        );
        // Bell history logs real notifications only: skip the conversation you
        // are actively reading (that is not a notification), same activeChannel
        // rule the unread count uses.
        if (!msg.isSystem && msg.channel !== chat.activeChannel) {
          useActivityStore.getState().record({
            id: msg.id,
            channel: msg.channel,
            isDM: msg.channel.startsWith("dm:"),
            senderID: msg.senderID,
            senderNickname: msg.senderNickname,
            preview: messagePreviewText(msg),
            timestampMs: msg.timestampMs,
          });
        }
      }
    });
    void configureNotifications();
    return unsubscribe;
  }, [appReady, onboardingStep]);

  // Tell the notifier which conversation is open, so it suppresses that chat's
  // banner and clears its delivered notification once the user reads it.
  useEffect(() => {
    const channel = chatView.kind === "thread" ? chatView.channel : "";
    setNotificationsActiveChannel(channel);
    if (channel) void dismissNotificationsFor(channel);
  }, [chatView]);

  // Keep the app icon badge in step with total unread across channels and DMs.
  useEffect(() => {
    void setAppBadgeCount(chatsUnread);
  }, [chatsUnread]);

  // Airhop deep links: airhop://channel/<name> and airhop://peer/<id>. Tapping a
  // shared invite opens the app here. Joining is user-initiated (you tapped the
  // link), so adding the channel / opening the DM is legitimate consent, not the
  // stranger-injection the mesh guards against. Deferred until past onboarding,
  // so a cold-start link waits for the identity to load.
  useEffect(() => {
    if (!appReady || onboardingStep !== null) return;
    const handle = (url: string | null): void => {
      if (url === null) return;
      const link = parseAirhopLink(url);
      if (link === null) return;
      if (link.kind === "channel") {
        // A private channel invite carries its E2E key; a public one does not.
        if (link.key !== undefined && isValidChannelKey(link.key)) {
          useChatStore
            .getState()
            .joinPrivateChannel(link.channel, link.key, link.overNostr);
        } else {
          useChatStore.getState().addChannel(link.channel);
        }
        openChannelRef.current(link.channel);
      } else if (link.kind === "peer") {
        const channel = `dm:${link.peerID}`;
        useChatStore.getState().addChannel(channel);
        openChannelRef.current(channel);
      } else {
        // A scanned contact card: verify + import the keys, then open the DM.
        const card = decodeQRContent(link.card);
        if (card === null) return;
        // Reject a card whose peer ID isn't the fingerprint of its Noise key;
        // accepting it would encrypt every DM to whoever forged the QR. Seeds
        // the routing registry and inbound Nostr map as a side effect.
        const accepted = getMeshService()?.addVerifiedContact(card) ?? false;
        if (!accepted) return;
        useContactsStore.getState().addContact({
          peerID: card.peerID,
          noisePubKeyHex: bytesToHex(card.noisePubKey),
          signingPubKeyHex: bytesToHex(card.signingPubKey),
          nickname: card.nickname,
          addedAtMs: Date.now(),
          source: "qr",
          // The card carries the peer's Nostr pubkey (internet reachability).
          nostrPubkeyHex: bytesToHex(card.nostrPubKey),
        });
        const channel = `dm:${card.peerID}`;
        useChatStore.getState().addChannel(channel);
        openChannelRef.current(channel);
      }
    };
    void Linking.getInitialURL().then(handle);
    const sub = Linking.addEventListener("url", ({ url }) => handle(url));
    return () => sub.remove();
  }, [appReady, onboardingStep]);

  function triggerWalletAction(action: WalletAction): void {
    setWalletAction(action);
    setWalletActionTrigger((c) => c + 1);
  }

  function openChannel(channel: string): void {
    setActiveChannel(channel);
    setLastThread(channel);
    markChannelRead(channel);
    // So returning to list view lands on whichever sub-tab this channel
    // actually belongs to. That matters when opened from search, which spans
    // both; a no-op when opened from the list itself (already the right tab).
    setChatSubTab(channel.startsWith("dm:") ? "dms" : "channels");
    setChatView({ kind: "thread", channel });
  }
  // Keep the notification tap handler pointed at the latest openChannel.
  openChannelRef.current = openChannel;

  // Open the bell screen and mark its backlog seen, so the badge clears the way
  // it does when you open any notifications list.
  function openActivityCenter(): void {
    useActivityStore.getState().markAllSeen();
    setShowActivity(true);
  }

  // Tapping a notification-center row: close the sheet and jump to that thread.
  function openChannelFromActivity(channel: string): void {
    setShowActivity(false);
    openChannel(channel);
  }

  // Same as openChannel, but also tells the thread which message to scroll
  // to and flash, used when opening from a "Messages" search result.
  function openChannelAtMessage(channel: string, messageId: string): void {
    setMessageTarget((prev) => ({
      channel,
      messageId,
      trigger: (prev?.trigger ?? 0) + 1,
    }));
    openChannel(channel);
  }

  function closeSearch(): void {
    searchInputRef.current?.blur();
    setSearchQuery("");
  }

  function handleSelectChatResult(channel: string): void {
    closeSearch();
    openChannel(channel);
  }

  function handleSelectMessageResult(channel: string, messageId: string): void {
    closeSearch();
    openChannelAtMessage(channel, messageId);
  }

  function handleCancelSearch(): void {
    closeSearch();
    setChatView({ kind: "list" });
  }

  function closeThread(): void {
    // Clear the active channel so messages arriving after the user leaves the
    // thread are correctly counted as unread in the list view.
    setActiveChannel("");
    setLastThread("");
    setChatView({ kind: "list" });
  }

  // Single entry point for every tab change (tab bar tap, swipe gesture,
  // deep-link-style jumps like opening a DM from Mesh) so the slide
  // direction always matches TABS order instead of only working for taps.
  const navigateToTab = useCallback(
    (nextTab: MainTab, resetChatView = true): void => {
      const nextIndex = tabs.findIndex((t) => t.id === nextTab);
      const currentIndex = tabs.findIndex((t) => t.id === tab);
      setTabDirection(nextIndex >= currentIndex ? "forward" : "backward");
      setTab(nextTab);
      if (nextTab === "chats" && resetChatView) {
        setChatView({ kind: "list" });
        setSearchQuery("");
      }
      // Tapping the Profile tab always returns to its root sub-screen.
      if (nextTab === "profile") {
        setProfileResetSignal((n) => n + 1);
      }
    },
    [tab, tabs],
  );

  function openDMFromMesh(channel: string): void {
    setActiveChannel(channel);
    setLastThread(channel);
    markChannelRead(channel);
    setChatSubTab("dms");
    navigateToTab("chats", false);
    setChatView({ kind: "thread", channel });
  }

  // Jump to the conversation a transfer belongs to (from the global badge).
  function openTransferChannel(channel: string): void {
    setActiveChannel(channel);
    setLastThread(channel);
    markChannelRead(channel);
    setChatSubTab(channel.startsWith("dm:") ? "dms" : "channels");
    navigateToTab("chats", false);
    setChatView({ kind: "thread", channel });
  }

  // Swipe left/right across the content area to step through tabs in the
  // same order the tab bar shows them. activeOffsetX/failOffsetY keep this
  // from hijacking vertical list scrolling: it only activates once the
  // gesture is clearly more horizontal than vertical, and per-row
  // Swipeable actions (channel/DM list) still win since they activate on a
  // much smaller offset than the 60px threshold below.
  const swipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!isInThread)
        .activeOffsetX([-20, 20])
        .failOffsetY([-15, 15])
        .onEnd((event) => {
          const passedThreshold =
            Math.abs(event.translationX) > 60 ||
            Math.abs(event.velocityX) > 600;
          if (!passedThreshold) return;
          const currentIndex = tabs.findIndex((t) => t.id === tab);
          const target =
            event.translationX < 0
              ? tabs[currentIndex + 1]
              : tabs[currentIndex - 1];
          if (target) runOnJS(navigateToTab)(target.id, true);
        }),
    [tab, tabs, isInThread, navigateToTab],
  );

  const tabEntering =
    tabDirection === "forward"
      ? SlideInRight.duration(240).easing(Easing.out(Easing.cubic))
      : SlideInLeft.duration(240).easing(Easing.out(Easing.cubic));
  const tabExiting =
    tabDirection === "forward"
      ? SlideOutLeft.duration(200).easing(Easing.in(Easing.cubic))
      : SlideOutRight.duration(200).easing(Easing.in(Easing.cubic));

  // ---- Render ------------------------------------------------------------

  // Render nothing until the identity check resolves. This prevents a flash
  // of the welcome screen for returning users on every app launch.
  if (!appReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <View style={{ flex: 1, backgroundColor: Colors.bg }} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
        <CustomAlert />
        <NotificationCenter
          visible={showActivity}
          onClose={() => setShowActivity(false)}
          onOpenChannel={openChannelFromActivity}
        />

        {/* Keyed by screen: welcome -> generating -> reveal -> main app each
            get their own mount, so this slide plays on every step of
            onboarding as well as the final hand-off into the main app. */}
        <Animated.View
          key={onboardingStep ?? "main"}
          style={styles.flexFill}
          entering={SlideInRight.duration(280).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutLeft.duration(220).easing(Easing.in(Easing.cubic))}
        >
          {/* Onboarding flow */}
          {onboardingStep !== null && (
            <>
              {onboardingStep === "welcome" && (
                <WelcomeScreen
                  onContinue={() => setOnboardingStep("generating")}
                />
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
                          void startMeshWithPermissions(
                            id,
                            peerIDToUsername(id.peerID),
                          );
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
              {/* Header. The "You" tab skips this entirely: ProfileScreen
                renders its own top row (status-edit pencil), so a second
                bar that only said "You" was pure redundancy. */}
              {!isInThread && tab !== "profile" && (
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
                              styles.segIconText,
                              chatSubTab === "channels" && styles.segActive,
                            ]}
                            onPress={() => setChatSubTab("channels")}
                            accessibilityRole="button"
                            accessibilityLabel="Channels"
                            accessibilityState={{
                              selected: chatSubTab === "channels",
                            }}
                          >
                            {/* Same icon language as the channel rows below:
                                hash for channels, message-circle for DMs. */}
                            <Feather
                              name="hash"
                              size={14}
                              color={
                                chatSubTab === "channels"
                                  ? Colors.textPrimary
                                  : Colors.textMuted
                              }
                            />
                            <Text
                              style={[
                                styles.segText,
                                chatSubTab === "channels" &&
                                  styles.segTextActive,
                              ]}
                            >
                              Channels
                            </Text>
                            {channelsUnread > 0 && (
                              <View style={styles.segBadge}>
                                <Text style={styles.segBadgeText}>
                                  {channelsUnread > 99 ? "99+" : channelsUnread}
                                </Text>
                              </View>
                            )}
                          </Pressable>
                          <Pressable
                            style={[
                              styles.seg,
                              styles.segIconText,
                              chatSubTab === "dms" && styles.segActive,
                            ]}
                            onPress={() => setChatSubTab("dms")}
                            accessibilityRole="button"
                            accessibilityLabel="Direct messages"
                            accessibilityState={{
                              selected: chatSubTab === "dms",
                            }}
                          >
                            <Feather
                              name="message-circle"
                              size={14}
                              color={
                                chatSubTab === "dms"
                                  ? Colors.textPrimary
                                  : Colors.textMuted
                              }
                            />
                            <Text
                              style={[
                                styles.segText,
                                chatSubTab === "dms" && styles.segTextActive,
                              ]}
                            >
                              Direct
                            </Text>
                            {dmsUnread > 0 && (
                              <View style={styles.segBadge}>
                                <Text style={styles.segBadgeText}>
                                  {dmsUnread > 99 ? "99+" : dmsUnread}
                                </Text>
                              </View>
                            )}
                          </Pressable>
                        </View>
                        {/* Bell: notification history, shown on both the
                            Channels and Direct sub-tabs, badged with unseen
                            activity. Plain icon, no filled box (unlike the +),
                            so the two read as different weights of action. */}
                        <Pressable
                          style={styles.headerIconBtn}
                          onPress={openActivityCenter}
                          accessibilityRole="button"
                          accessibilityLabel={
                            activityUnseen > 0
                              ? `Notifications, ${String(activityUnseen)} new`
                              : "Notifications"
                          }
                        >
                          <Feather
                            name="bell"
                            size={18}
                            color={Colors.textSecondary}
                          />
                          {activityUnseen > 0 && (
                            <View style={styles.bellBadge}>
                              <Text style={styles.bellBadgeText}>
                                {activityUnseen > 99 ? "99+" : activityUnseen}
                              </Text>
                            </View>
                          )}
                        </Pressable>
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
                  ) : tab === "mesh" ? (
                    // Mesh header: title left, view toggle + add-contact button
                    // right. Radar is the default view.
                    <>
                      <Text style={styles.headerTitle}>Mesh</Text>
                      <View style={styles.headerControls}>
                        <View style={styles.segmented}>
                          <Pressable
                            style={[
                              styles.seg,
                              styles.segIconText,
                              meshViewMode === "radar" && styles.segActive,
                            ]}
                            onPress={() => setMeshViewMode("radar")}
                            accessibilityRole="button"
                            accessibilityLabel="Radar view"
                            accessibilityState={{
                              selected: meshViewMode === "radar",
                            }}
                          >
                            <Feather
                              name="radio"
                              size={14}
                              color={
                                meshViewMode === "radar"
                                  ? Colors.textPrimary
                                  : Colors.textMuted
                              }
                            />
                            <Text
                              style={[
                                styles.segText,
                                meshViewMode === "radar" &&
                                  styles.segTextActive,
                              ]}
                            >
                              Radar
                            </Text>
                          </Pressable>
                          <Pressable
                            style={[
                              styles.seg,
                              styles.segIconText,
                              meshViewMode === "list" && styles.segActive,
                            ]}
                            onPress={() => setMeshViewMode("list")}
                            accessibilityRole="button"
                            accessibilityLabel="List view"
                            accessibilityState={{
                              selected: meshViewMode === "list",
                            }}
                          >
                            <Feather
                              name="list"
                              size={14}
                              color={
                                meshViewMode === "list"
                                  ? Colors.textPrimary
                                  : Colors.textMuted
                              }
                            />
                            <Text
                              style={[
                                styles.segText,
                                meshViewMode === "list" && styles.segTextActive,
                              ]}
                            >
                              List
                            </Text>
                          </Pressable>
                        </View>
                        <Pressable
                          style={styles.newChannelPill}
                          onPress={() => setMeshAddCounter((c) => c + 1)}
                          accessibilityRole="button"
                          accessibilityLabel="Add contact"
                        >
                          <Feather
                            name="user-plus"
                            size={18}
                            color={Colors.textSecondary}
                          />
                        </Pressable>
                      </View>
                    </>
                  ) : tab === "wallet" ? (
                    // Wallet header: title left, quick actions right, the same
                    // icon-box style as Mesh's "add contact" pill, moved up
                    // here from a row inside the balance card.
                    <>
                      <Text style={styles.headerTitle}>Wallet</Text>
                      <View style={styles.headerControls}>
                        <Pressable
                          style={styles.newChannelPill}
                          onPress={() => triggerWalletAction("send")}
                          accessibilityRole="button"
                          accessibilityLabel="Send ecash token"
                        >
                          <Feather
                            name="arrow-up"
                            size={18}
                            color={Colors.textSecondary}
                          />
                        </Pressable>
                        <Pressable
                          style={styles.newChannelPill}
                          onPress={() => triggerWalletAction("receive")}
                          accessibilityRole="button"
                          accessibilityLabel="Receive ecash token"
                        >
                          <Feather
                            name="arrow-down"
                            size={18}
                            color={Colors.textSecondary}
                          />
                        </Pressable>
                        <Pressable
                          style={styles.newChannelPill}
                          onPress={() => triggerWalletAction("zap")}
                          accessibilityRole="button"
                          accessibilityLabel="Zap a Nostr contact"
                        >
                          <Feather
                            name="zap"
                            size={18}
                            color={Colors.textSecondary}
                          />
                        </Pressable>
                        <Pressable
                          style={styles.newChannelPill}
                          onPress={() => triggerWalletAction("addMint")}
                          accessibilityRole="button"
                          accessibilityLabel="Add a Cashu mint"
                        >
                          <Feather
                            name="plus"
                            size={18}
                            color={Colors.textSecondary}
                          />
                        </Pressable>
                      </View>
                    </>
                  ) : (
                    // Standard header: just the title
                    <Text style={styles.headerTitle}>{HEADER_TITLES[tab]}</Text>
                  )}
                </View>
              )}

              {/* Search bar: always available at the Chats tab, spans both
                Channels and Direct. A message doesn't care which sub-tab
                its chat lives in, so search isn't scoped to one either.
                Focusing the field is what switches into search mode. */}
              {!isInThread && tab === "chats" && (
                <View style={styles.searchRow}>
                  {chatView.kind === "search" && (
                    <Pressable
                      onPress={handleCancelSearch}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityRole="button"
                      accessibilityLabel="Close search"
                    >
                      <Feather
                        name="arrow-left"
                        size={20}
                        color={Colors.textPrimary}
                      />
                    </Pressable>
                  )}
                  <View style={styles.searchBar}>
                    <Feather name="search" size={16} color={Colors.textMuted} />
                    <TextInput
                      ref={searchInputRef}
                      style={styles.searchInput}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      onFocus={() => setChatView({ kind: "search" })}
                      placeholder="Search chats"
                      placeholderTextColor={Colors.textMuted}
                      returnKeyType="search"
                      selectionColor={Colors.accent}
                    />
                    {searchQuery.length > 0 && (
                      <Pressable
                        onPress={() => setSearchQuery("")}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel="Clear search"
                      >
                        <Feather
                          name="x-circle"
                          size={16}
                          color={Colors.textMuted}
                        />
                      </Pressable>
                    )}
                  </View>
                </View>
              )}

              {/* Transport banner. Shown on Mesh and Chats, the two places an
                  empty screen would otherwise be unexplainable. Renders nothing
                  while peers are connected or a scan is in progress. */}
              {!isInThread && (tab === "mesh" || tab === "chats") && (
                <MeshStatusBar state={meshState} />
              )}

              {/* Content: swipe left/right to step through TABS, matching the
                tab bar's order. The inner Animated.View is keyed by tab so
                only a genuine tab change slides. Switching Channels/Direct
                or opening a thread within the same tab does not. */}
              <GestureDetector gesture={swipeGesture}>
                <View style={styles.content}>
                  <Animated.View
                    key={tab}
                    style={styles.flexFill}
                    entering={tabEntering}
                    exiting={tabExiting}
                  >
                    {tab === "chats" && chatView.kind === "thread" ? (
                      // Keyed by channel so switching threads REMOUNTS. Without
                      // this the component persisted across a channel change and
                      // leaked per-thread state: an unsent draft typed in one
                      // chat reappeared in the next, and a "queued for delivery"
                      // banner from the old chat rendered over the new one.
                      <MessageThread
                        key={chatView.channel}
                        channel={chatView.channel}
                        localNickname={username}
                        localPeerID={generatedPeerID}
                        onBack={closeThread}
                        targetMessageId={
                          messageTarget?.channel === chatView.channel
                            ? messageTarget.messageId
                            : undefined
                        }
                        targetMessageTrigger={
                          messageTarget?.channel === chatView.channel
                            ? messageTarget.trigger
                            : undefined
                        }
                        onNavigateToChannel={openChannel}
                      />
                    ) : tab === "chats" && chatView.kind === "search" ? (
                      <ChatSearchResults
                        query={searchQuery}
                        onSelectChat={handleSelectChatResult}
                        onSelectMessage={handleSelectMessageResult}
                      />
                    ) : tab === "chats" && chatSubTab === "channels" ? (
                      <ChannelList
                        onSelectChannel={openChannel}
                        newChannelTrigger={newChanCounter}
                      />
                    ) : tab === "chats" ? (
                      <DmList onSelectDM={openChannel} />
                    ) : tab === "mesh" ? (
                      <PeerList
                        onOpenDM={openDMFromMesh}
                        viewMode={meshViewMode}
                        addContactTrigger={meshAddCounter}
                      />
                    ) : tab === "ai" ? (
                      <AiScreen />
                    ) : tab === "wallet" ? (
                      <WalletScreen
                        action={walletAction}
                        actionTrigger={walletActionTrigger}
                      />
                    ) : (
                      <ProfileScreen
                        key={`profile-${profileResetSignal}`}
                        peerID={generatedPeerID}
                        username={username}
                        onWipe={() => {
                          // Stop BLE mesh immediately so old keys are flushed from memory.
                          getMeshService()?.stop();
                          setGeneratedPeerID(FALLBACK_PEER_ID);
                          // Reset navigation to the fresh-start landing tab.
                          // Panic wipe is triggered from Profile, so without this
                          // the re-onboarded app reopens on the Profile screen
                          // instead of Mesh.
                          setTab("mesh");
                          setChatView({ kind: "list" });
                          setOnboardingStep("welcome");
                        }}
                      />
                    )}
                  </Animated.View>
                </View>
              </GestureDetector>

              {/* Ongoing attachment transfers, kept visible after you leave the
                  thread. Sits just above the tab bar. */}
              {!isInThread && <TransferBadge onOpen={openTransferChannel} />}

              {/* Tab bar */}
              {!isInThread && (
                <View style={styles.tabBar}>
                  {tabs.map(({ id, label, icon }) => {
                    const active = tab === id;
                    return (
                      <Pressable
                        key={id}
                        style={styles.tabItem}
                        onPress={() => navigateToTab(id as MainTab)}
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
                          {id === "profile" ? (
                            <Avatar
                              username={username}
                              peerID={generatedPeerID}
                              size={20}
                              active={active}
                            />
                          ) : id === "ai" ? (
                            <MaterialCommunityIcons
                              name={
                                icon as React.ComponentProps<
                                  typeof MaterialCommunityIcons
                                >["name"]
                              }
                              size={22}
                              color={active ? Colors.accent : Colors.textMuted}
                            />
                          ) : (
                            <Feather
                              name={
                                icon as React.ComponentProps<
                                  typeof Feather
                                >["name"]
                              }
                              size={22}
                              color={active ? Colors.accent : Colors.textMuted}
                            />
                          )}
                          {id === "chats" && chatsUnread > 0 && (
                            <View style={styles.tabBadge}>
                              <Text style={styles.tabBadgeText}>
                                {chatsUnread > 99 ? "99+" : String(chatsUnread)}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.tabLabel,
                            active && styles.tabLabelActive,
                          ]}
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
        </Animated.View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const HEADER_TITLES: Record<MainTab, string> = {
  chats: "Chats",
  mesh: "Mesh",
  ai: "AI Assistant",
  wallet: "Wallet",
  profile: "You",
};

// The AI tab is deliberately absent: the assistant isn't finished, so it's
// kept out of the tab bar while AiScreen and its "ai" branch below stay in
// place: re-adding the entry here is all it takes to bring the tab back.
const ALL_TABS: { id: MainTab; label: string; icon: string }[] = [
  { id: "chats", label: "Chats", icon: "message-square" },
  { id: "mesh", label: "Mesh", icon: "radio" },
  { id: "wallet", label: "Wallet", icon: "credit-card" },
  { id: "profile", label: "You", icon: "user" },
];

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    flexFill: {
      flex: 1,
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
    // Search bar (Chats tab only), moved up from ChannelList so one search
    // spans both Channels and Direct instead of being duplicated per sub-tab.
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.xs,
    },
    searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm + 2,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    searchInput: {
      flex: 1,
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      padding: 0,
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
    // Icon + label variant of `seg`, used wherever a segment carries an icon
    // alongside its text (Chats' Channels/Direct, Mesh's Radar/List) so every
    // segmented control in the header reads the same.
    segIconText: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
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
    // Boxed action button (add/create), matching the segmented switcher's radius
    newChannelPill: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.surfaceRaised,
    },
    // Same tap target as the + pill but with no filled background, so the bell
    // sits as a lighter-weight action beside it.
    headerIconBtn: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    // Unseen-activity count over the bell, same visual language as the tab and
    // segment badges.
    bellBadge: {
      position: "absolute",
      top: -4,
      right: -4,
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      minWidth: 16,
      height: 16,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
      borderWidth: 1.5,
      borderColor: Colors.bg,
    },
    bellBadgeText: {
      fontSize: 9,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
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
      width: 22,
      height: 22,
      alignItems: "center",
      justifyContent: "center",
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
    // Unread badge on the Channels/Direct segmented control, the same visual
    // language as tabBadge, just anchored to a smaller pill instead of a tab icon.
    segBadge: {
      position: "absolute",
      top: -5,
      right: -6,
      minWidth: 15,
      height: 15,
      borderRadius: Radius.full,
      backgroundColor: Colors.danger,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 3,
      borderWidth: 1.5,
      borderColor: Colors.surfaceRaised,
    },
    segBadgeText: {
      fontSize: 9,
      fontWeight: FontWeight.bold,
      color: "#FFFFFF",
      lineHeight: 11,
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
}
