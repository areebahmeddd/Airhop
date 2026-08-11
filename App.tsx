// Polyfill must be the first import. Required before any @noble/* usage.
import "react-native-get-random-values";

import {
  JetBrainsMono_400Regular,
  useFonts,
} from "@expo-google-fonts/jetbrains-mono";
import { Feather } from "@expo/vector-icons";
import { NavigationBar } from "expo-navigation-bar";
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
  DeviceEventEmitter,
  Linking,
  Platform,
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
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import AirhopBLE from "./src/bridge/NativeAirhopBLE";
import type { Identity } from "./src/core/crypto/identity";
import { loadIdentity } from "./src/core/crypto/identity";
import { sweepOrphanedSecrets } from "./src/core/crypto/keychain";
import {
  primeTorRoutingOnStartup,
  revalidateTorRouting,
} from "./src/core/nostr/tor-routing";
import ChannelList from "./src/features/chat/channel-list";
import ChatSearchResults from "./src/features/chat/chat-search-results";
import DmList from "./src/features/chat/dm-list";
import MessageThread from "./src/features/chat/message-thread";
import NotificationCenter from "./src/features/chat/notification-center";
import { StartNewSheet } from "./src/features/chat/start-new-sheet";
import PeerList from "./src/features/discovery/peer-list";
import IdentityScreen from "./src/features/onboarding/identity-screen";
import PermissionPrimer from "./src/features/onboarding/permission-primer";
import UsernameScreen from "./src/features/onboarding/username-screen";
import WelcomeScreen from "./src/features/onboarding/welcome-screen";
import ProfileScreen from "./src/features/settings/profile-screen";
import WalletScreen, {
  type WalletAction,
} from "./src/features/wallet/wallet-screen";
import { initI18n, t, useT, useTPlural, type TranslationKey } from "./src/i18n";
import { arrowBack, isRTLLayout } from "./src/i18n/layout";
import { setAudioForPlayback } from "./src/services/audio-session";
import { sweepExpiredAttachments } from "./src/services/file-transfer-service";
import { applyAirhopLink } from "./src/services/link-router";
import {
  hasLocationPermission,
  requestLocationPermission,
} from "./src/services/location-service";
import { getMeshService, initMeshService } from "./src/services/mesh-service";
import {
  configureNotifications,
  dismissNearbyNotification,
  dismissNotificationsFor,
  handleInboundMessage,
  handleNearbyPeers,
  requestNotificationPermission,
  setAppBadgeCount,
  setMeshNavigator,
  setNotificationNavigator,
  setNotificationsActiveChannel,
  setNotificationsAppActive,
} from "./src/services/notification-service";
import {
  rebindNutzapWatcher,
  setNutzapRebinder,
  setNutzapWatcher,
} from "./src/services/nutzap-watcher-handle";
import { applyPresence } from "./src/services/presence";
import {
  initWalletService,
  publishOwnNutzapInfo,
  reconcile,
  reconcileIfDue,
  startNutzapWatcher,
} from "./src/services/wallet-service";
import { useActivityStore } from "./src/store/activity-store";
import { showAlert } from "./src/store/alert-store";
import {
  flushChatPersistence,
  subscribeInboundMessages,
  useChatStore,
} from "./src/store/chat-store";
import {
  useMeshBanners,
  useMeshStateStore,
  type BannerAction,
} from "./src/store/mesh-state-store";
import { countReachablePeers, usePeerStore } from "./src/store/peer-store";
import {
  acknowledgePermissionPrimer,
  showPermissionPrimer,
  usePrimerStore,
} from "./src/store/primer-store";
import { useSettingsStore } from "./src/store/settings-store";
import { useTransferStore } from "./src/store/transfer-store";
import { useWalletStore } from "./src/store/wallet-store";
import Avatar from "./src/ui/components/avatar";
import CustomAlert from "./src/ui/components/custom-alert";
import {
  ErrorBoundary,
  installGlobalErrorHandler,
} from "./src/ui/components/error-boundary";
import MeshStatusBar from "./src/ui/components/mesh-status-bar";
import TransferBadge from "./src/ui/components/transfer-badge";
import {
  DISABLED_OPACITY,
  FontSize,
  FontWeight,
  hitSlopFor,
  MaxFontScale,
  Radius,
  Shadow,
  Spacing,
  useResolvedTheme,
  useThemeColors,
} from "./src/ui/theme";
import { getBatteryOptimizationSettingsURI } from "./src/utils/battery-optimization";
import {
  ensureBlePermissions,
  hasBlePermissions,
  type BlePermissionResult,
} from "./src/utils/ble-permissions";
import { parseAirhopLink } from "./src/utils/deep-link";
import { formatNumber } from "./src/utils/format";
import { mentionsNickname } from "./src/utils/mentions";
import { messagePreviewText } from "./src/utils/message-preview";
import { showBlockedAlert } from "./src/utils/permissions";
import { sumUnread } from "./src/utils/unread";
import { peerIDToUsername } from "./src/utils/username";
import {
  currentWipeGeneration,
  isCurrentWipeGeneration,
} from "./src/utils/wipe-generation";
import { settleOr, withTimeout } from "./src/utils/with-timeout";

// Layout direction is a native flag that React Native reads once, at startup,
// before anything mounts. Setting it here, at module scope, is the only place
// early enough for the very first frame to be correct.
initI18n();

// ---------------------------------------------------------------------------
// Navigation types
// ---------------------------------------------------------------------------

type OnboardingStep = "welcome" | "generating" | "reveal";
type MainTab = "chats" | "mesh" | "wallet" | "profile";
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

// How long to wait for the keychain before deciding this launch has no
// identity. A healthy read is single-digit milliseconds; this is the point past
// which "slow" has become "never" and the user is owed a screen either way.
const IDENTITY_LOAD_TIMEOUT_MS = 8_000;

// How long the permission conversation may hold the mesh start.
//
// `PermissionsAndroid.requestMultiple` settles when the user answers a dialog
// hosted by another process, so it can be orphaned by an Activity that is
// destroyed while the dialog is up - which is exactly what an OEM that reaps
// the Activity behind a foreground service does. Past this deadline the mesh
// starts regardless and the radio controller reads the real grant off the
// device, which it would have done anyway.
const PERMISSION_PROMPT_TIMEOUT_MS = 60_000;

// A `PermissionsAndroid.check` is a synchronous binder call behind a promise,
// so anything past this is the binder being wedged rather than a slow answer.
const PERMISSION_CHECK_TIMEOUT_MS = 3_000;

// The primer is a sheet the user dismisses, so this is deliberately long enough
// to read it twice. It is a backstop against the sheet never appearing at all,
// not a limit on how long someone may take.
const PRIMER_TIMEOUT_MS = 120_000;

// Request the BLE runtime permissions the OS requires, THEN start the mesh.
// Without the grant, native startScanning/startAdvertising throw and are
// swallowed: a silent, total discovery failure. On denial we surface a
// dialog instead of failing quietly, and still start the service so Nostr
// (internet) transport keeps working even when BLE is unavailable.
async function startMeshWithPermissions(
  identity: Identity,
  nickname: string,
): Promise<void> {
  // Explain the ask before the OS makes it, once per install.
  //
  // Gated on the permission not already being held, so it never appears for a
  // returning user whose grant is settled - and gated on the flag so a user who
  // declined does not get the lecture again on every launch. It resolves however
  // the sheet is dismissed, so nothing here can hang: a primer that failed to
  // resolve would hold BLE startup behind it forever, which is a far worse bug
  // than the one it exists to prevent.
  //
  // Android-only in practice, and correctly so: hasBlePermissions() resolves
  // true on iOS, where CoreBluetooth prompts on first use and carries our own
  // NSBluetoothAlwaysUsageDescription string. That prompt IS the primer there,
  // and iOS has no location coupling to explain away. The sheet still renders
  // correctly on iOS if it is ever shown; it simply is not needed.
  //
  // Both awaits below are time-boxed, and the deadline is the point of them
  // rather than a nicety. Everything from here to initMeshService() is a
  // conversation with the OS about permissions, and the mesh used to be started
  // only once that conversation finished. It is not a conversation the app
  // controls: the primer resolves on a sheet the user has to dismiss, and
  // `PermissionsAndroid.requestMultiple` settles on a dialog hosted by another
  // process, which an Activity teardown can orphan. Either one going quiet left
  // a running app with no mesh at all and a Mesh tab reading "starting…" for
  // the rest of the session, which is indistinguishable from a broken radio.
  //
  // Missing the deadline costs nothing that matters. The radio controller reads
  // the real grant off the device on its first pass and publishes the true
  // blocker, so a permission answer that arrives late, or never, changes only
  // how quickly the banner is right - not whether the mesh exists.
  const settings = useSettingsStore.getState();
  if (
    !settings.permissionPrimerSeen &&
    !(await settleOr(hasBlePermissions(), PERMISSION_CHECK_TIMEOUT_MS, false))
  ) {
    settings.markPermissionPrimerSeen();
    await settleOr(showPermissionPrimer(), PRIMER_TIMEOUT_MS, undefined);
    // The sheet never came up, or came up and was never dismissed. Put the
    // store back in step so a later caller is not told a primer is on screen.
    acknowledgePermissionPrimer();
  }

  // `null` is "the OS never answered", which is different from every answer it
  // could have given and must not be rendered as one. Nothing is published for
  // it: the controller's own reading of the device is the better source, and
  // guessing here would put a red banner over a permission the user may well
  // have granted.
  const perm = await settleOr<BlePermissionResult | null>(
    ensureBlePermissions(),
    PERMISSION_PROMPT_TIMEOUT_MS,
    null,
  );
  if (perm !== null) applyBlePermissionResult(perm);

  // Apply the persisted Tor preference BEFORE the mesh starts, so the very first
  // relay pool is built on the Tor socket (never leaking the clear net for a Tor
  // user). No-op when Tor is off or unavailable.
  //
  // Guarded because it is the last thing standing between here and the mesh
  // existing. It used to be a bare call: a throw from it meant initMeshService
  // on the next line never ran, and because this function is void-ed at both
  // call sites the failure was silent - a fully rendered app whose
  // getMeshService() returned null forever.
  try {
    primeTorRoutingOnStartup();
  } catch {
    // Tor is a preference, not a prerequisite. The pool comes up on the direct
    // socket and the Privacy screen reports Tor as off, which is true.
  }
  initMeshService(identity, nickname);
  // The grant may have landed while the mesh was still being built, and the
  // controller stops retrying once it has published a permission blocker. This
  // is the nudge that turns "denied" into a running radio without a relaunch.
  getMeshService()?.retryRadios();
  startMeshDependents();
}

// Turn a permission answer into the one reason the mesh cannot run.
//
// Split out so the startup path and the Permissions screen cannot drift: both
// need the blocked/denied distinction and the Settings deep link, and the
// screen previously had neither.
function applyBlePermissionResult(perm: BlePermissionResult): void {
  // Record WHY the mesh cannot run, not merely that it cannot.
  //
  // A single "granted" boolean collapsed two situations that need different
  // responses: denied but re-askable, and denied for good. Only the first is
  // fixed by asking again, and both used to render as "Bluetooth permission
  // needed". The controller re-reads the device on its first pass and will
  // correct this either way; setting it here means the banner is right during
  // the very first frames rather than after the first reconcile.
  const blocker = useMeshStateStore.getState().setBleBlocker;
  // Recorded separately, and BEFORE the mesh starts, so the controller's first
  // reconcile refines the platform's coarse "denied" into the permanent form
  // rather than offering a prompt that will never appear.
  useMeshStateStore.getState().setBlePermissionBlocked(perm.blockedForever);
  if (perm.granted) {
    blocker("starting");
  } else if (perm.locationRequired) {
    // Android 11 and below, where what the user was just shown was a location
    // dialog. Checked before the blocked/denied split because both of those
    // resolve to the same action, so naming the right permission matters more
    // than distinguishing them. See BleBlocker in the mesh state store.
    blocker("location-permission");
  } else if (perm.blockedForever) {
    blocker("permission-blocked");
  } else {
    blocker("permission-denied");
  }
  if (!perm.granted && perm.blockedForever) {
    // The OS will not prompt again, so the only way out is Settings. Same
    // deep-linked dialog the camera and photo flows use, rather than a
    // dead-end box reciting a path to tap through.
    showBlockedAlert({
      label: t("permission.bluetooth.label"),
      purpose: t("permission.bluetooth.purpose"),
    });
  }
  // A denial that can still be re-asked gets no dialog. The Mesh banner already
  // says what is wrong and carries the button that fixes it, and stacking a
  // modal on top of that is two things to dismiss for one problem.
}

// Everything that rides on a started mesh: the wallet, the presence reset, and
// the permission prompts that are not the mesh's own.
//
// Separated from the mesh start so it is unmistakable that nothing here can
// prevent the mesh existing. Every branch is fire-and-forget by design.
function startMeshDependents(): void {
  // Open the encrypted ecash store and settle anything left in flight. Proofs
  // live in an AES-256 MMKV file whose key is in the Keychain/Keystore, so this
  // is async and must happen before the Wallet tab can spend. Failure leaves
  // the wallet locked rather than silently falling back to plaintext storage.
  //
  // `reconcile` then finishes the work a previous session could not: Lightning
  // deposits whose invoice was paid after the app was closed, and reserved
  // sends whose recipient has since redeemed them.
  void (async () => {
    // A panic wipe can land in any await gap below. Re-checked after each one so
    // startup cannot resurrect the identity it destroyed. See wipe-generation.ts.
    const generation = currentWipeGeneration();

    const unlocked = await initWalletService();
    if (!unlocked || !isCurrentWipeGeneration(generation)) return;

    // Settling leftovers is a background chore, not a prerequisite. It walks
    // every pending deposit and reserved send, one mint round trip at a time,
    // so on a bad network it can take minutes. Awaiting it here would hold the
    // nutzap watcher behind it and quietly drop incoming payments for that
    // whole window. Nothing below depends on its result.
    void reconcile().catch(() => {
      // Offline, or the mint is down. Retried on the next launch.
    });

    // Register how to (re)attach the nutzap watcher, then attach it.
    //
    // Registered rather than only called, because the watcher captures a
    // NostrClient and that instance dies with every transport rebuild. Toggling
    // Tor, or internet fallback, used to end NIP-61 for the rest of the session
    // and silently stop redeeming incoming payments. The mesh service calls the
    // rebinder after it builds a transport, so the subscription follows the
    // client instead of outliving it.
    setNutzapRebinder(() => {
      const live = getMeshService()?.getNostrClient();
      const myPubkey = getMeshService()?.getNostrPubKeyHex();
      if (!live || !myPubkey) {
        // Internet is off, or the mesh is stopped. Drop the old subscription
        // rather than leaving it against a closed pool.
        setNutzapWatcher(null);
        return;
      }
      if (!isCurrentWipeGeneration(generation)) return;
      // setNutzapWatcher stops whatever it replaces, so this cannot stack.
      setNutzapWatcher(
        startNutzapWatcher({
          myPubkey,
          client: live,
          onRedeemed: (amount, unit, from) => {
            showAlert(
              t("wallet.nutzap.received_title", {
                amount: formatNumber(amount),
                unit,
              }),
              t("wallet.nutzap.received_body", { from: from.slice(0, 12) }),
            );
          },
        }),
      );
    });

    const client = getMeshService()?.getNostrClient();
    const privKey = getMeshService()?.getNostrPrivKey();
    if (!client || !privKey) return;
    // Tell the network how to pay us (NIP-61 kind 10019). A no-op without a
    // mint configured.
    await publishOwnNutzapInfo({
      client,
      privKey,
      relays: client.activeRelays,
    });
    if (!isCurrentWipeGeneration(generation)) return;
    rebindNutzapWatcher();
  })();
  // The mesh always starts Online (advertising + scanning), so keep the chosen
  // presence in step, in case a prior session left it Away/Invisible.
  useMeshStateStore.getState().setPresenceStatus("online");

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
    // Reflect the grant on the Mesh banner: without it the location channels
    // are unavailable, and saying so beats a silently empty channel list.
    useMeshStateStore.getState().setLocationGranted(granted);
    if (granted) getMeshService()?.refreshGeoChannels();
    await requestNotificationPermission();
  })();
}

// Carry out the fix a Mesh banner offers.
//
// The banner names an intent; this turns it into the platform call. Keeping the
// two apart means the store stays free of native imports and Linking, and the
// copy for a blocker lives next to the logic that decides the blocker applies.
//
// Every branch ends by re-reading the device rather than assuming the fix
// worked: the user may cancel the Bluetooth dialog, or wander out of Settings
// without changing anything, and a banner that clears itself optimistically is
// how you end up with a green UI over a dead radio.
async function handleBannerAction(
  kind: BannerAction,
  nickname: string,
): Promise<void> {
  switch (kind) {
    case "resume":
      applyPresence("online", nickname);
      return;

    case "enable-bluetooth": {
      // Android can show the system enable dialog in place. iOS cannot - Apple
      // provides no API to turn the radio on from inside an app - so it
      // resolves false and we fall back to Settings rather than offering a
      // button that does nothing.
      const enabled = await AirhopBLE.requestEnableBluetooth().catch(
        () => false,
      );
      if (!enabled) await Linking.openSettings().catch(() => undefined);
      break;
    }

    case "open-location-settings": {
      const opened = await AirhopBLE.openLocationSettings().catch(() => false);
      if (!opened) await Linking.openSettings().catch(() => undefined);
      break;
    }

    case "open-app-settings":
      await Linking.openSettings().catch(() => undefined);
      break;

    case "open-background-limits": {
      // Deep-link straight into the OEM's own background/autostart screen -
      // Xiaomi's autostart list, Samsung's sleeping-apps list, and so on. There
      // is no common Android surface for this, which is exactly why describing
      // where to tap does not work: the path differs on every skin.
      //
      // Acknowledged either way. The whitelist itself is not readable back, so
      // "did it work" is unanswerable; taking the user to the right screen is
      // the whole of what the app can do, and repeating the advice afterwards
      // would be nagging someone who has already acted on it.
      useSettingsStore.getState().markBackgroundLimitsAcknowledged();
      const uri = getBatteryOptimizationSettingsURI();
      if (uri !== null) {
        const opened = await Linking.openURL(uri).then(
          () => true,
          () => false,
        );
        // OEM deep links are undocumented and disappear between skin versions.
        // The app's own settings page always exists, and battery controls are
        // reachable from it, so it is a landing place rather than a dead end.
        if (!opened) await Linking.openSettings().catch(() => undefined);
      } else {
        await Linking.openSettings().catch(() => undefined);
      }
      // Nothing about the radios changed, so there is nothing to re-read.
      return;
    }
  }
  getMeshService()?.retryRadios();
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

// The root, and nothing else: everything the app does lives in AppContent
// below.
//
// The boundary has to be OUTSIDE that component rather than somewhere inside
// its tree, because the failures worth surviving are the ones that take the
// shell down with them - a throw while rendering the tab bar, or from a decoder
// running off a packet that arrived a moment ago. A boundary mounted under the
// thing that broke catches nothing.
//
// It sits outside the providers too. GestureHandlerRootView and
// SafeAreaProvider are ordinary components that can themselves fail to mount,
// and the fallback screen is deliberately built to need neither of them.
export default function App(): React.JSX.Element {
  const boundary = useRef<ErrorBoundary>(null);

  // React catches what it renders. Everything else - a rejected promise nobody
  // awaited, a throw inside a native event listener, a setTimeout callback -
  // goes to ErrorUtils instead, and in a release build the default handler
  // there ends the process. Routed onto the same screen so both kinds of
  // failure look the same to the person holding the phone.
  useEffect(() => {
    installGlobalErrorHandler((error) => boundary.current?.showError(error));
  }, []);

  return (
    <ErrorBoundary ref={boundary}>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent(): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const resolvedTheme = useResolvedTheme();
  // App is the root, so subscribing here is what makes a language change
  // re-render every screen below it, the same way useThemeColors does for a
  // theme change. It is also why the formatters in utils/format.ts can read
  // the language at call time instead of each being a hook.
  const T = useT();
  const TP = useTPlural();

  // appReady guards against a flash of the welcome screen on every launch.
  // The identity check is async, so we render nothing until it resolves.
  const [appReady, setAppReady] = useState(false);
  // Load JetBrains Mono in the background so it is ready the instant a user
  // picks it under Appearance. Startup is NOT gated on it: the app defaults to
  // the system monospace, so there is nothing to wait for and a missing/unlinked
  // font can never delay or hang launch. The mono bits switch over live once it
  // is loaded (see useThemeColors).
  useFonts({ JetBrainsMono_400Regular });
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
  // Profile owns its own settings stack (sections are early returns, not
  // routes), so the shell learns its depth from the screen and pops it by
  // bumping a counter. See ProfileScreen onCanGoBackChange / popSignal.
  const [profileCanGoBack, setProfileCanGoBack] = useState(false);
  const [profilePopSignal, setProfilePopSignal] = useState(0);
  const [chatSubTab, setChatSubTab] = useState<ChatSubTab>("channels");
  const [chatView, setChatView] = useState<ChatView>({ kind: "list" });
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);
  // Which message a search result should scroll a thread to on open.
  const [messageTarget, setMessageTarget] = useState<MessageTarget | null>(
    null,
  );
  // Counter-based trigger: incrementing opens the "start something new" chooser.
  const [startNewTrigger, setStartNewTrigger] = useState(0);
  const [meshViewMode, setMeshViewMode] = useState<"list" | "radar">("radar");
  // Counter-based trigger: incrementing tells PeerList to open the add-contact scanner.
  const [meshAddCounter, setMeshAddCounter] = useState(0);
  // Counter-based trigger: incrementing (with an action) tells WalletScreen
  // to open the matching modal, same pattern as startNewTrigger/meshAddCounter.
  const [walletAction, setWalletAction] = useState<WalletAction | null>(null);
  // Whether there is any ecash at all to spend. Selected as a boolean so the
  // header only re-renders when the answer flips, not on every proof change.
  const hasSpendableEcash = useWalletStore((s) =>
    Object.values(s.proofs).some((list) => list.length > 0),
  );
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
  const meshBanners = useMeshBanners();
  const primerVisible = usePrimerStore((s) => s.visible);

  // Android system nav bar: tint its buttons/pill to the theme, the same way the
  // status bar does, so the top and bottom chrome read as one themed surface.
  // Driven by our in-app theme, not the OS scheme, so forcing dark while the
  // phone is light still gets light buttons. Under edge-to-edge the bar is
  // transparent and our content draws behind it, so only the button contrast is
  // ours to set. No-op on iOS, which has no such bar.
  //
  // Set imperatively rather than through the declarative <NavigationBar>
  // component, and the difference is the whole point. That component keeps a
  // module-level stack of mounted entries and re-derives the native state
  // whenever the stack changes - including when it EMPTIES. Unmounting the last
  // one therefore fires `ExpoNavigationBar.setHidden(false)` on a setImmediate,
  // unawaited and uncaught. The one moment the stack empties is teardown: the
  // Activity is destroyed, React unmounts the root, and the call lands on an
  // app context whose activity is already gone, so it rejects with "The current
  // activity is no longer available" as an unhandled rejection nobody can catch
  // from here. Setting the style directly has no unmount path, so there is
  // nothing left to fire into a dead Activity.
  useEffect(() => {
    if (Platform.OS !== "android") return;
    NavigationBar.setStyle(resolvedTheme === "dark" ? "dark" : "light");
  }, [resolvedTheme]);

  // On mount: check for an existing persisted identity. If found, skip
  // onboarding and start the BLE mesh service immediately.
  useEffect(() => {
    // Time-boxed, because this one promise decides whether the app renders at
    // all. `readSecret` reaches the Keystore, and a Keystore that
    // stalls never rejects - it simply does not answer. The `.catch` below
    // covers a refusal; nothing covered silence, so the app sat on the blank
    // background-coloured view above forever, which reads as a hung splash.
    //
    // Timing out yields `null`, which is the same answer a first install gives,
    // so the user lands on onboarding rather than on nothing. That is the right
    // failure: a device whose keychain is unreachable cannot load an identity
    // this launch either way, and IdentityScreen surfaces the write failure
    // where it can be read. IDENTITY_LOAD_TIMEOUT_MS is far longer than a
    // healthy read (single-digit milliseconds) so a slow-but-working device is
    // never sent to onboarding by mistake.
    withTimeout(loadIdentity(), IDENTITY_LOAD_TIMEOUT_MS, null)
      .then((existing) => {
        if (existing) {
          setGeneratedPeerID(existing.peerID);
          setOnboardingStep(null);
          // Android can destroy the Activity while the foreground service keeps
          // the process (and the JS runtime, and the mesh) alive. Reopening then
          // remounts this component with everything already set up, and tearing
          // that down just to rebuild it is what made a reopen feel like a hang:
          // a full stop() says goodbye to every peer, drops the relay pool, and
          // bounces the foreground service, all to arrive back where we started.
          //
          // So a cold start is exactly: no mesh at all, or one belonging to a
          // different identity (a wipe re-onboarded as someone else). An
          // existing mesh is left alone whatever state it is in - including
          // stopped, because the only things that stop it are the user choosing
          // Away and the notification's "Stop mesh". Restarting it here would
          // undo a decision they just made, from an event they didn't trigger.
          const existingMesh = getMeshService();
          if (existingMesh?.peerID !== existing.peerID) {
            void startMeshWithPermissions(
              existing,
              peerIDToUsername(existing.peerID),
            );
          }
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
          // No identity means nothing on this device owns a wallet secret, so
          // anything still in the keychain is a leftover - in practice, a panic
          // wipe the Keystore refused while the phone was locked. Sweeping here
          // is what makes that wipe retry itself instead of failing once and
          // staying failed.
          //
          // Deliberately not awaited: it is a keychain round trip and the
          // welcome screen must not wait on it. That is also why the sweep
          // leaves the identity item alone - the very next thing onboarding does
          // is write one, and a delete still in flight would take it with it.
          // See sweepOrphanedSecrets. A first install finds nothing and this is
          // three no-op deletes.
          void sweepOrphanedSecrets()
            .then((leftovers) => {
              // Only ever raises the banner. Clearing is not this call's to do:
              // a wipe in THIS session sets the flag from its own result, and it
              // could still be in flight - the primer, the OS dialogs and the
              // mesh start all sit between. Every launch re-derives it from
              // scratch, which is what makes it self-clearing.
              if (leftovers) {
                useMeshStateStore.getState().setWipeIncomplete(true);
              }
            })
            .catch(() => {
              // Unreachable keychain. It said nothing about data at rest, so
              // neither do we.
            });
        }
        setAppReady(true);
      })
      .catch(() => {
        // Keychain unavailable (e.g. simulator without secure enclave).
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
  // The thread on screen, which is not always the one that was asked for: a DM
  // keyed by a Nostr pubkey is folded into its peer-ID thread when that peer's
  // announce arrives, which can happen while it is open. Derived rather than
  // synced into state, so no frame renders a channel that is already gone.
  const channelRedirects = useChatStore((s) => s.channelRedirects);
  // Scoped to the Chats tab, because "open" has to mean "on screen".
  //
  // chatView survives a tab switch by design, so without the tab test a thread
  // left behind on Chats stayed the active channel while the user looked at the
  // radar or the wallet. Everything downstream trusts that: inbound messages to
  // it were marked read, produced no haptic and no bell entry, and vanished from
  // the unread counts, all while nobody was looking at them.
  const openThread =
    tab === "chats" && chatView.kind === "thread"
      ? (channelRedirects[chatView.channel] ?? chatView.channel)
      : "";
  const isSearching =
    onboardingStep === null && tab === "chats" && chatView.kind === "search";
  const username = peerIDToUsername(generatedPeerID);

  // Android hardware/gesture back button: exit a message thread, or cancel
  // an in-progress search. Otherwise back would fall through to minimizing
  // the app while either is open.
  // Reached through a ref, so the subscription depends only on whether it should
  // exist rather than on a function identity that changes every render. Listing
  // `handleCancelSearch` itself would tear down and re-register the OS back
  // handler on each render; capturing render-zero's copy would eventually cancel
  // a search using stale state.
  const cancelSearchRef = useRef(handleCancelSearch);
  const closeThreadRef = useRef(closeThread);
  useEffect(() => {
    cancelSearchRef.current = handleCancelSearch;
    closeThreadRef.current = closeThread;
  });
  useEffect(() => {
    if (!isInThread && !isSearching) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (isInThread) {
        setChatView({ kind: "list" });
      } else {
        cancelSearchRef.current();
      }
      return true; // prevent default (close app)
    });
    return () => sub.remove();
  }, [isInThread, isSearching]);

  // Retire attachments past their retention window, once per launch.
  //
  // Runs unconditionally, before any identity check: expired media belongs to
  // nobody, and a launch that ends at the onboarding screen is exactly the
  // launch after a wipe, where leftover files matter most. Deliberately not on
  // a timer, since nothing accumulates while the app is closed.
  //
  // Wrapped because the cache directory may be unreadable on a device with no
  // storage left, and a failed sweep must not stop the app from opening.
  //
  // Read once at launch rather than subscribed to: shortening the window takes
  // effect on the next start, which is when the sweep runs anyway. Lengthening
  // it cannot bring anything back, since the files are already gone.
  useEffect(() => {
    try {
      const days = useSettingsStore.getState().mediaRetentionDays;
      sweepExpiredAttachments(Date.now(), days * 24 * 60 * 60 * 1000);
    } catch {
      // Unreadable cache directory. Retried next launch.
    }
  }, []);

  // Claim an audible audio session once. Otherwise it is the OS default, which
  // on iOS is a category the ring/silent switch mutes, so a voice note played
  // before anything has been recorded is silent. Recording borrows the session
  // and hands it back. See services/audio-session.
  useEffect(() => {
    void setAudioForPlayback().catch(() => {
      // No audio hardware, or a call holds the session. Nothing to say here.
    });
  }, []);

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
  // Same trick for the tab navigator, which a tapped nearby-peers notice uses
  // to land on Mesh.
  const navigateToTabRef = useRef<(tab: MainTab) => void>(() => undefined);

  // Whether the app is on screen. Read by the "what is being read" effect
  // below, because a thread the user has walked away from is not being read.
  const [appActive, setAppActive] = useState(
    AppState.currentState === "active",
  );

  // Foreground/background tracking, so a banner is only raised when the user is
  // not already looking at the app.
  useEffect(() => {
    // No setAppActive here: the useState initialiser above already read
    // AppState, and the listener below carries every change after it.
    setNotificationsAppActive(AppState.currentState === "active");
    // Re-read the permissions whenever we come to the foreground: the user may
    // have changed either in system Settings while we were backgrounded, and
    // coming back is the only signal we get. Bluetooth adapter changes already
    // arrive as native events, so they need no polling here.
    //
    // Both are checks, never requests: prompting someone who just walked back
    // into the app would be ambushing them.
    const syncPermissions = (): void => {
      void hasLocationPermission().then((granted) => {
        const store = useMeshStateStore.getState();
        const changed = store.locationGranted !== granted;
        store.setLocationGranted(granted);
        // Re-resolve the location channels when the answer actually moved.
        //
        // Leaving for system Settings and coming back is the main way a location
        // grant changes, and this handler recorded it without acting on it, so
        // the geohash channels stayed empty on the one edge where they were most
        // likely to have just become available. Gated on the change so an
        // ordinary resume does not re-subscribe every cell.
        if (changed && granted) getMeshService()?.refreshGeoChannels();
      });
      // Re-check the radios unconditionally.
      //
      // This used to compare the BLE permission against the last known value
      // and only act when it had changed, which meant every blocker that is not
      // a permission - Bluetooth switched off, location services switched off,
      // a grant that had not yet reached the Bluetooth stack - came back to a
      // mesh that had decided nothing needed doing. The controller is a
      // reconciler: it reads the device itself and issues only the calls that
      // change something, so calling it on every resume is both correct and
      // free.
      getMeshService()?.retryRadios();
    };
    syncPermissions();
    // Tell the mesh which side of the screen we are on, for both states: the
    // radio controller turns the scan rate down when backgrounded, and needs
    // the leaving edge as much as the returning one.
    getMeshService()?.setAppForeground(AppState.currentState === "active");
    const sub = AppState.addEventListener("change", (next) => {
      setAppActive(next === "active");
      setNotificationsAppActive(next === "active");
      // "inactive" is NOT backgrounded, and this is the one consumer that has to
      // know the difference.
      //
      // It means the app is on screen but not receiving events: a permission
      // dialog on top of it, the app switcher open, an incoming call. Reading it
      // as backgrounded told the power policy nobody was watching, which drops
      // the radios to power-saver, and every mode change restarts the scanner.
      // The result was that the OS permission dialog - the single most common
      // way to reach this state, on the very first launch - bounced the scan off
      // and on again underneath itself. Everything else here still treats it as
      // "not active", which is right for them: a notification should be raised,
      // chat state should be flushed, and the privacy cover should be up,
      // because the user genuinely is not reading the screen.
      getMeshService()?.setAppForeground(next !== "background");
      if (next !== "active") {
        // Chat persistence is throttled, so leaving the foreground is the last
        // safe moment to force whatever is still inside that window to disk.
        // The OS can stop giving us cycles at any point after this.
        flushChatPersistence();
      }
      if (next === "active") {
        syncPermissions();
        // The Mesh tab is a tap away now, so a "someone nearby" from earlier is
        // stale the moment the app is open.
        void dismissNearbyNotification();
        // A trip away from Airhop is how Orbot gets stopped, so returning is
        // when a "Tor on" claim is most likely to have gone stale. Cheap and
        // Android-only; iOS owns Arti and hears about it directly.
        void revalidateTorRouting();
        // Leaving the app is also how a Lightning invoice gets paid: the user
        // switches to their Lightning wallet, pays, and comes back. Until this,
        // the deposit only landed if the deposit sheet happened to still be open
        // (it polls) or the user thought to pull to refresh, so coming back to a
        // balance that had not moved was the normal experience of paying.
        //
        // Throttled and deduplicated inside the service, and returns
        // immediately: a pass is minutes of mint round trips and must never be
        // awaited on the foreground path. Also settles a melt whose response was
        // lost and a reserved send the recipient has since redeemed.
        reconcileIfDue();
      }
    });
    return () => sub.remove();
  }, []);

  // "Stop mesh" on the Android background notification. The native service
  // hands it here rather than tearing things down itself, so stopping from the
  // notification and stopping from the Status picker are the same action: the
  // radios come down, the gateway switches off, and presence lands on Away - so
  // reopening the app shows "Mesh paused · You're away" with a way back, not a
  // dead mesh wearing a green dot.
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      "AirhopBLE.meshStopRequested",
      () => applyPresence("away", username),
    );
    return () => sub.remove();
  }, [username]);

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
      // Being @-mentioned overrides mute, the way every major chat app treats a
      // mention: even a muted channel pings and logs a bell entry when it is you
      // being addressed by name.
      const mentionsMe = !msg.isSystem && mentionsNickname(msg.text, username);
      // A muted conversation otherwise stays silent: no system notification, no
      // haptic, and no bell entry. Its unread still shows on its own row.
      if (!isMuted || mentionsMe) {
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
    // Nearby peers, while nobody is looking. The mesh keeps scanning with the
    // app in the background (Android's foreground service), so this is a real
    // event the user would otherwise never learn about. Counted by the store's
    // own reachability rule rather than by map size, because a peer who left
    // without a LEAVE lingers in the map: measure both sides of the change with
    // one clock so the comparison is honest. Everything about when it is worth
    // a notification is in shouldNotifyNearby.
    setMeshNavigator(() => navigateToTabRef.current("mesh"));
    const unsubscribePeers = usePeerStore.subscribe((state, prev) => {
      const nowMs = Date.now();
      void handleNearbyPeers(
        countReachablePeers(state.peers, nowMs),
        countReachablePeers(prev.peers, nowMs),
      );
    });
    void configureNotifications();
    return () => {
      unsubscribe();
      unsubscribePeers();
    };
  }, [appReady, onboardingStep, username]);

  // The single answer to "which conversation is the user reading right now".
  //
  // Every consumer of that fact reads it from here: the chat store decides
  // whether an arriving message counts as unread, and the notifier decides
  // whether to buzz and which delivered notification to clear.
  //
  // Backgrounded counts as NOT reading, even with a thread still on screen.
  // Without that the app contradicts itself: the OS notification fires (it is
  // gated on foreground alone, correctly), while the chat store sees the thread
  // as active and files the message as already read, so the user taps the
  // notification and finds no unread badge and no app icon count. Every
  // mainstream messenger treats leaving the app as leaving the conversation.
  //
  // Coming back marks it read again, which is the same rule as opening it.
  useEffect(() => {
    const reading = appActive ? openThread : "";
    setActiveChannel(reading);
    setNotificationsActiveChannel(reading);
    if (reading) {
      markChannelRead(reading);
      void dismissNotificationsFor(reading);
    }
  }, [openThread, appActive, setActiveChannel, markChannelRead]);

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
      // What the link does lives in services/link-router, shared with the Join
      // sheet's paste field, so a tapped link and a pasted one behave the same.
      const channel = applyAirhopLink(link);
      if (channel !== null) openChannelRef.current(channel);
    };
    void Linking.getInitialURL().then(handle);
    const sub = Linking.addEventListener("url", ({ url }) => handle(url));
    return () => sub.remove();
  }, [appReady, onboardingStep]);

  function triggerWalletAction(action: WalletAction): void {
    setWalletAction(action);
    setWalletActionTrigger((c) => c + 1);
  }

  function openChannel(requested: string): void {
    // A notification, a bell row or a restored last-thread can name a DM by
    // the key it had before its owner was identified, so resolve it first.
    const channel = useChatStore.getState().resolveChannel(requested);
    setLastThread(channel);
    // So returning to list view lands on whichever sub-tab this channel
    // actually belongs to. That matters when opened from search, which spans
    // both; a no-op when opened from the list itself (already the right tab).
    setChatSubTab(channel.startsWith("dm:") ? "dms" : "channels");
    // Switch to Chats, which this did not do.
    //
    // The thread render is gated on `tab === "chats"`, so setting the view
    // without the tab opened nothing: a tapped notification, a deep link and the
    // restored last thread all landed on whatever tab was showing, usually Mesh.
    // Worse than doing nothing, because the "what is being read" effect is
    // driven by chatView alone, so the app marked the message read, cleared its
    // unread count and dismissed its notification while showing the radar. The
    // message was gone with nothing to say it had arrived.
    //
    // `false` keeps the view: navigateToTab resets chatView to the list when it
    // is told to, and this is the one caller that has already chosen a thread.
    // Matches openDMFromMesh and openTransferChannel, which always did this.
    navigateToTab("chats", false);
    setChatView({ kind: "thread", channel });
  }
  // Keep the notification tap handler pointed at the latest openChannel. In an
  // effect, not during render: a render can be discarded or replayed, and the
  // handler outlives both.
  useEffect(() => {
    openChannelRef.current = openChannel;
  });

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
    setLastThread("");
    setChatView({ kind: "list" });
  }

  // Single entry point for every tab change (tab bar tap, swipe gesture,
  // deep-link-style jumps like opening a DM from Mesh).
  const navigateToTab = useCallback(
    (nextTab: MainTab, resetChatView = true): void => {
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
    [],
  );
  // Keep the notification tap handler pointed at the latest navigateToTab, in an
  // effect for the same reason as openChannelRef above.
  useEffect(() => {
    navigateToTabRef.current = navigateToTab;
  });

  function openDMFromMesh(channel: string): void {
    setLastThread(channel);
    setChatSubTab("dms");
    navigateToTab("chats", false);
    setChatView({ kind: "thread", channel });
  }

  // Jump to the conversation a transfer belongs to (from the global badge).
  function openTransferChannel(channel: string): void {
    setLastThread(channel);
    setChatSubTab(channel.startsWith("dm:") ? "dms" : "channels");
    navigateToTab("chats", false);
    setChatView({ kind: "thread", channel });
  }

  // Somewhere to go back to within the current tab, and how to get there.
  // Chats holds threads and search, Profile holds its settings sections; from
  // inside one of those, stepping to the next tab loses the reader's place.
  const canGoBackInTab =
    isInThread || isSearching || (tab === "profile" && profileCanGoBack);
  const goBackInTab = useCallback((): void => {
    if (isInThread) {
      closeThreadRef.current();
      return;
    }
    if (isSearching) {
      cancelSearchRef.current();
      return;
    }
    setProfilePopSignal((n) => n + 1);
  }, [isInThread, isSearching]);

  // Swipe across the content area. Two behaviours, decided by where you are:
  //
  //   at a tab's root   step through tabs, in the order the tab bar shows them
  //   inside a section  go back to its parent, and never change tab
  //
  // The back swipe is confined to a leading-edge strip, the width iOS gives its
  // interactive pop. `hitSlop` keeps the gesture from ever seeing a mid-screen
  // drag: a thread carries its own horizontal scrollers (the mention picker),
  // and a full-width pan would take those touches and do nothing with them.
  //
  // activeOffsetX/failOffsetY keep this from hijacking vertical list scrolling:
  // it only activates once the gesture is clearly more horizontal than vertical,
  // and per-row Swipeable actions (channel/DM list) still win since they
  // activate on a much smaller offset than the 60px threshold below.
  const swipeGesture = useMemo(() => {
    const pan = Gesture.Pan()
      .activeOffsetX([-20, 20])
      .failOffsetY([-15, 15])
      .onEnd((event) => {
        const passedThreshold =
          Math.abs(event.translationX) > 60 || Math.abs(event.velocityX) > 600;
        if (!passedThreshold) return;
        // Forward in reading order, so the gesture matches RTL layouts.
        const forward = isRTLLayout
          ? event.translationX > 0
          : event.translationX < 0;
        if (canGoBackInTab) {
          if (!forward) scheduleOnRN(goBackInTab);
          return;
        }
        const currentIndex = TABS.findIndex((t) => t.id === tab);
        const target = forward
          ? TABS[currentIndex + 1]
          : TABS[currentIndex - 1];
        if (target) scheduleOnRN(navigateToTab, target.id, true);
      });
    if (!canGoBackInTab) return pan;
    return pan.hitSlop(
      isRTLLayout
        ? { right: 0, width: EDGE_BACK_ZONE }
        : { left: 0, width: EDGE_BACK_ZONE },
    );
  }, [tab, canGoBackInTab, goBackInTab, navigateToTab]);

  // ---- Render ------------------------------------------------------------

  // Render nothing until the identity check resolves (and the bundled font is
  // ready). This prevents a flash of the welcome screen for returning users on
  // every app launch, and of system-font mono text before JetBrains Mono loads.
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
        {/* Mounted beside the alert, not inside the onboarding flow: the primer
            is shown on the first launch that actually needs a permission, which
            for someone who killed the app mid-onboarding is a launch that skips
            onboarding entirely. */}
        <PermissionPrimer
          visible={primerVisible}
          onAcknowledge={acknowledgePermissionPrimer}
        />
        <NotificationCenter
          visible={showActivity}
          onClose={() => setShowActivity(false)}
          onOpenChannel={openChannelFromActivity}
        />
        {/* Last in the tree, so it paints over the tab bar and every screen
            under it. Modals render in their own window and mount their own. */}

        <View style={styles.flexFill}>
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
                      <Text
                        style={styles.headerTitle}
                        numberOfLines={1}
                        // Screen readers offer heading navigation; with nothing
                        // marked as a heading that gesture goes nowhere.
                        accessibilityRole="header"
                      >
                        {T("nav.tab.chats")}
                      </Text>
                      <View style={styles.headerControls}>
                        {/* tablist goes on the segmented track itself, not on
                            headerControls: the outer row also holds the bell and
                            the + button, and calling those two "tabs" would have
                            a screen reader announce "tab 3 of 4" for an action
                            that navigates nowhere. */}
                        <View
                          style={styles.segmented}
                          accessibilityRole="tablist"
                        >
                          <Pressable
                            style={[
                              styles.seg,
                              styles.segIconText,
                              chatSubTab === "channels" && styles.segActive,
                            ]}
                            onPress={() => setChatSubTab("channels")}
                            accessibilityRole="tab"
                            // The count lives in the label rather than being
                            // left to the badge Text below: read on its own, a
                            // trailing "3" is ambiguous, and TalkBack merges the
                            // subtree into one node either way.
                            accessibilityLabel={
                              channelsUnread > 0
                                ? TP("a11y.unread_count", channelsUnread, {
                                    label: T("chat.subtab.channels"),
                                  })
                                : T("chat.subtab.channels")
                            }
                            accessibilityState={{
                              selected: chatSubTab === "channels",
                            }}
                          >
                            {/* Same icon language as the rows below: hash for
                                rooms, message-circle for DMs. */}
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
                              maxFontSizeMultiplier={MaxFontScale.chrome}
                            >
                              {T("chat.subtab.channels")}
                            </Text>
                            {channelsUnread > 0 && (
                              <View
                                style={styles.segBadge}
                                // Already spoken by the label above; left
                                // visible it would be read a second time.
                                importantForAccessibility="no-hide-descendants"
                                accessibilityElementsHidden
                              >
                                <Text
                                  style={styles.segBadgeText}
                                  maxFontSizeMultiplier={MaxFontScale.badge}
                                >
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
                            accessibilityRole="tab"
                            accessibilityLabel={
                              dmsUnread > 0
                                ? TP("a11y.unread_count", dmsUnread, {
                                    label: T("chat.subtab.dms"),
                                  })
                                : T("chat.subtab.dms")
                            }
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
                              maxFontSizeMultiplier={MaxFontScale.chrome}
                            >
                              {T("chat.subtab.direct")}
                            </Text>
                            {dmsUnread > 0 && (
                              <View
                                style={styles.segBadge}
                                importantForAccessibility="no-hide-descendants"
                                accessibilityElementsHidden
                              >
                                <Text
                                  style={styles.segBadgeText}
                                  maxFontSizeMultiplier={MaxFontScale.badge}
                                >
                                  {dmsUnread > 99 ? "99+" : dmsUnread}
                                </Text>
                              </View>
                            )}
                          </Pressable>
                        </View>
                        {/* Bell: notification history, shown on both the Channels
                            and Direct sub-tabs, badged with unseen activity.
                            Same filled circle as the + beside it. */}
                        <Pressable
                          style={styles.headerIconBtn}
                          onPress={openActivityCenter}
                          hitSlop={hitSlopFor(HEADER_ICON_SIZE)}
                          accessibilityRole="button"
                          accessibilityLabel={
                            activityUnseen > 0
                              ? TP("a11y.new_count", activityUnseen, {
                                  label: T("nav.notifications"),
                                })
                              : T("nav.notifications")
                          }
                        >
                          <Feather
                            name="bell"
                            size={18}
                            color={Colors.textSecondary}
                          />
                          {activityUnseen > 0 && (
                            <View
                              style={styles.bellBadge}
                              importantForAccessibility="no-hide-descendants"
                              accessibilityElementsHidden
                            >
                              <Text
                                style={styles.bellBadgeText}
                                maxFontSizeMultiplier={MaxFontScale.badge}
                              >
                                {activityUnseen > 99 ? "99+" : activityUnseen}
                              </Text>
                            </View>
                          )}
                        </Pressable>
                        {/* Shown on both sub-tabs. What it opens is the same
                            chooser either way, so the header keeps its shape
                            when you switch between Channels and Direct. */}
                        <Pressable
                          style={styles.newChannelPill}
                          onPress={() => setStartNewTrigger((c) => c + 1)}
                          hitSlop={hitSlopFor(HEADER_ICON_SIZE)}
                          accessibilityRole="button"
                          accessibilityLabel={T("chat.new.title")}
                        >
                          <Feather
                            name="plus"
                            size={18}
                            color={Colors.textSecondary}
                          />
                        </Pressable>
                      </View>
                    </>
                  ) : tab === "mesh" ? (
                    // Mesh header: title left, view toggle + add-contact button
                    // right. Radar is the default view.
                    <>
                      <Text
                        style={styles.headerTitle}
                        numberOfLines={1}
                        // Screen readers offer heading navigation; with nothing
                        // marked as a heading that gesture goes nowhere.
                        accessibilityRole="header"
                      >
                        {T("nav.tab.mesh")}
                      </Text>
                      <View style={styles.headerControls}>
                        {/* Same reasoning as the Chats header: the track is the
                            tablist, the add-contact pill beside it is not. */}
                        <View
                          style={styles.segmented}
                          accessibilityRole="tablist"
                        >
                          <Pressable
                            style={[
                              styles.seg,
                              styles.segIconText,
                              meshViewMode === "radar" && styles.segActive,
                            ]}
                            onPress={() => setMeshViewMode("radar")}
                            accessibilityRole="tab"
                            accessibilityLabel={T("mesh.view.radar")}
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
                              maxFontSizeMultiplier={MaxFontScale.chrome}
                            >
                              {T("mesh.view.radar_short")}
                            </Text>
                          </Pressable>
                          <Pressable
                            style={[
                              styles.seg,
                              styles.segIconText,
                              meshViewMode === "list" && styles.segActive,
                            ]}
                            onPress={() => setMeshViewMode("list")}
                            accessibilityRole="tab"
                            accessibilityLabel={T("mesh.view.list")}
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
                              maxFontSizeMultiplier={MaxFontScale.chrome}
                            >
                              {T("mesh.view.list_short")}
                            </Text>
                          </Pressable>
                        </View>
                        <Pressable
                          style={styles.newChannelPill}
                          onPress={() => setMeshAddCounter((c) => c + 1)}
                          hitSlop={hitSlopFor(HEADER_ICON_SIZE)}
                          accessibilityRole="button"
                          accessibilityLabel={T("contacts.qr.scan_a11y")}
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
                      <Text
                        style={styles.headerTitle}
                        numberOfLines={1}
                        // Screen readers offer heading navigation; with nothing
                        // marked as a heading that gesture goes nowhere.
                        accessibilityRole="header"
                      >
                        {T("nav.tab.wallet")}
                      </Text>
                      <View style={styles.headerControls}>
                        {/* Send and Zap spend, so they dim on an empty balance
                            rather than opening a sheet that can only fail.
                            Receive and Add mint stay live: that is how a new
                            wallet starts. A dim glyph does not say why, so the
                            reason rides in the accessibility label. */}
                        <Pressable
                          style={[
                            styles.newChannelPill,
                            !hasSpendableEcash && styles.headerPillDisabled,
                          ]}
                          disabled={!hasSpendableEcash}
                          onPress={() => triggerWalletAction("send")}
                          hitSlop={hitSlopFor(HEADER_ICON_SIZE)}
                          accessibilityRole="button"
                          accessibilityState={{ disabled: !hasSpendableEcash }}
                          accessibilityLabel={
                            hasSpendableEcash
                              ? T("wallet.action.send")
                              : T("wallet.action.send_disabled")
                          }
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
                          hitSlop={hitSlopFor(HEADER_ICON_SIZE)}
                          accessibilityRole="button"
                          accessibilityLabel={T("wallet.action.receive")}
                        >
                          <Feather
                            name="arrow-down"
                            size={18}
                            color={Colors.textSecondary}
                          />
                        </Pressable>
                        <Pressable
                          style={[
                            styles.newChannelPill,
                            !hasSpendableEcash && styles.headerPillDisabled,
                          ]}
                          disabled={!hasSpendableEcash}
                          onPress={() => triggerWalletAction("zap")}
                          hitSlop={hitSlopFor(HEADER_ICON_SIZE)}
                          accessibilityRole="button"
                          accessibilityState={{ disabled: !hasSpendableEcash }}
                          accessibilityLabel={
                            hasSpendableEcash
                              ? T("wallet.action.zap")
                              : T("wallet.action.zap_disabled")
                          }
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
                          hitSlop={hitSlopFor(HEADER_ICON_SIZE)}
                          accessibilityRole="button"
                          accessibilityLabel={T("wallet.action.add_mint")}
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
                    <Text
                      style={styles.headerTitle}
                      numberOfLines={1}
                      // Screen readers offer heading navigation; with nothing
                      // marked as a heading that gesture goes nowhere.
                      accessibilityRole="header"
                    >
                      {T(HEADER_TITLES[tab])}
                    </Text>
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
                      hitSlop={hitSlopFor(20)}
                      accessibilityRole="button"
                      accessibilityLabel={T("chat.search.close")}
                    >
                      <Feather
                        name={arrowBack}
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
                      placeholder={T("chat.search.placeholder")}
                      placeholderTextColor={Colors.textMuted}
                      returnKeyType="search"
                      selectionColor={Colors.selection}
                      // A placeholder is not a label: it disappears the moment
                      // there is a query, so a screen reader landing on a
                      // half-typed field would otherwise announce nothing but
                      // the text itself.
                      accessibilityLabel={T("chat.search.a11y")}
                      // Search is a name/content scan, never an address or a
                      // sentence, so the OS should not try to help.
                      autoCorrect={false}
                      autoCapitalize="none"
                      // iOS gets the native clear affordance for free; the
                      // explicit button below covers Android, so only one of
                      // the two ever renders.
                      clearButtonMode={
                        Platform.OS === "ios" ? "while-editing" : "never"
                      }
                    />
                    {Platform.OS !== "ios" && searchQuery.length > 0 && (
                      <Pressable
                        onPress={() => setSearchQuery("")}
                        hitSlop={hitSlopFor(16)}
                        accessibilityRole="button"
                        accessibilityLabel={T("chat.search.clear")}
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

              {/* Transport banner. Mesh tab only: that is where an empty screen
                  needs explaining, and it is where the buttons that fix each
                  blocker belong. Renders nothing when nothing is wrong. */}
              {!isInThread && tab === "mesh" && (
                <MeshStatusBar
                  banners={meshBanners}
                  onAction={(kind) => void handleBannerAction(kind, username)}
                  onDismiss={(key) => {
                    if (key === "background-limits") {
                      useSettingsStore
                        .getState()
                        .markBackgroundLimitsAcknowledged();
                    }
                  }}
                />
              )}

              {/* Content: swipe left/right to step through tabs, matching the
                tab bar's order. */}
              <GestureDetector gesture={swipeGesture}>
                <View style={styles.content}>
                  {tab === "chats" && chatView.kind === "thread" ? (
                    // Keyed by channel so switching threads REMOUNTS. Without
                    // this the component persisted across a channel change and
                    // leaked per-thread state: an unsent draft typed in one
                    // chat reappeared in the next, and a "queued for delivery"
                    // banner from the old chat rendered over the new one.
                    <MessageThread
                      key={openThread}
                      channel={openThread}
                      localNickname={username}
                      localPeerID={generatedPeerID}
                      onBack={closeThread}
                      targetMessageId={
                        messageTarget?.channel === openThread
                          ? messageTarget.messageId
                          : undefined
                      }
                      targetMessageTrigger={
                        messageTarget?.channel === openThread
                          ? messageTarget.trigger
                          : undefined
                      }
                      onNavigateToChannel={openChannel}
                      // Scoped to the list this thread sits under, so the back
                      // button counts what you would actually find on the
                      // screen it returns to. Same split the Channels/Direct
                      // segments use, from the same source.
                      backUnreadCount={
                        openThread.startsWith("dm:")
                          ? dmsUnread
                          : channelsUnread
                      }
                    />
                  ) : tab === "chats" && chatView.kind === "search" ? (
                    <ChatSearchResults
                      query={searchQuery}
                      onSelectChat={handleSelectChatResult}
                      onSelectMessage={handleSelectMessageResult}
                    />
                  ) : tab === "chats" && chatSubTab === "channels" ? (
                    <ChannelList onSelectChannel={openChannel} />
                  ) : tab === "chats" ? (
                    <DmList onSelectDM={openChannel} />
                  ) : tab === "mesh" ? (
                    <PeerList
                      onOpenDM={openDMFromMesh}
                      viewMode={meshViewMode}
                      addContactTrigger={meshAddCounter}
                    />
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
                      onCanGoBackChange={setProfileCanGoBack}
                      popSignal={profilePopSignal}
                      onWipe={() => {
                        // The mesh is already down and its keys released: the
                        // wipe does that first, before it clears anything.
                        // All that is left here is putting the shell back to
                        // a first-run state.
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
                </View>
              </GestureDetector>

              {/* The header "+" flow, mounted beside the Chats list rather than
                  inside it: both sub-tabs share one copy of the chooser and its
                  forms. Sheets render in a Modal, so this sits anywhere. */}
              {tab === "chats" && chatView.kind === "list" && (
                <StartNewSheet
                  trigger={startNewTrigger}
                  onOpenChannel={openChannel}
                />
              )}

              {/* Floating bottom stack: the ongoing-transfer pill and the tab
                  bar, both hovering over the content that scrolls beneath.
                  box-none so taps land on content in the gaps around the pills,
                  not on the transparent container.

                  A SafeAreaView rather than a View, for its bottom edge only.
                  An absolutely positioned child is laid out against its parent's
                  PADDING box, so `bottom: 0` sits under the outer SafeAreaView's
                  inset rather than above it. Under gesture navigation that inset
                  is a few points and the pill's own margin hid the difference;
                  with three-button navigation it is around 48, and the system
                  buttons drew straight over the tab bar. Consuming the inset
                  here puts it back on top.

                  Not the `useSafeAreaInsets` hook: the provider is rendered
                  inside this component, so a hook call in its body would sit
                  ABOVE the provider and throw. This element is a descendant, so
                  it reads the inset correctly. */}
              {!isInThread && (
                <SafeAreaView
                  edges={["bottom"]}
                  style={styles.floatingBottom}
                  pointerEvents="box-none"
                >
                  <TransferBadge onOpen={openTransferChannel} />
                  {/* Outer wrap carries the shadow + rounding; the bar itself
                      clips its children to the pill (overflow hidden), and a
                      clipped view can't cast the shadow itself. */}
                  <View style={styles.tabBarWrap}>
                    {/* accessibilityRole="tablist" is what tells VoiceOver and
                        TalkBack that the four children below are one group of
                        alternatives ("tab 2 of 4"). Without it each tab was an
                        unrelated button and the set had no announced size. */}
                    <View style={styles.tabBar} accessibilityRole="tablist">
                      {TABS.map(({ id, labelKey, icon }) => {
                        const active = tab === id;
                        const unread = id === "chats" ? chatsUnread : 0;
                        const label = T(labelKey);
                        return (
                          <Pressable
                            key={id}
                            style={styles.tabItem}
                            onPress={() => navigateToTab(id as MainTab)}
                            accessibilityRole="tab"
                            accessibilityLabel={
                              unread > 0
                                ? TP("a11y.unread_count", unread, { label })
                                : label
                            }
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
                              ) : (
                                <Feather
                                  name={
                                    icon as React.ComponentProps<
                                      typeof Feather
                                    >["name"]
                                  }
                                  size={22}
                                  color={
                                    active ? Colors.accent : Colors.textMuted
                                  }
                                />
                              )}
                              {unread > 0 && (
                                <View
                                  style={styles.tabBadge}
                                  importantForAccessibility="no-hide-descendants"
                                  accessibilityElementsHidden
                                >
                                  <Text
                                    style={styles.tabBadgeText}
                                    maxFontSizeMultiplier={MaxFontScale.badge}
                                  >
                                    {unread > 99 ? "99+" : String(unread)}
                                  </Text>
                                </View>
                              )}
                            </View>
                            <Text
                              style={[
                                styles.tabLabel,
                                active && styles.tabLabelActive,
                              ]}
                              // The pill is a fixed height, so an uncapped
                              // label at the largest OS text size pushed the
                              // icon out of it entirely.
                              maxFontSizeMultiplier={MaxFontScale.chrome}
                              numberOfLines={1}
                            >
                              {label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                </SafeAreaView>
              )}
            </SafeAreaView>
          )}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// Module-level tables cannot call a hook, so they hold keys rather than text
// and the component translates on render. This is the pattern for every static
// table in the app: the table stays a table, and the language stays live.
const HEADER_TITLES: Record<MainTab, TranslationKey> = {
  chats: "nav.tab.chats",
  mesh: "nav.tab.mesh",
  wallet: "nav.tab.wallet",
  profile: "nav.tab.profile",
};

const TABS: { id: MainTab; labelKey: TranslationKey; icon: string }[] = [
  { id: "chats", labelKey: "nav.tab.chats", icon: "message-circle" },
  { id: "mesh", labelKey: "nav.tab.mesh", icon: "radio" },
  { id: "wallet", labelKey: "nav.tab.wallet", icon: "credit-card" },
  { id: "profile", labelKey: "nav.tab.profile", icon: "user" },
];

// How near the leading edge a back-swipe has to start. Matches the width iOS
// uses for its interactive pop.
const EDGE_BACK_ZONE = 44;

// The drawn size of a header icon button. Deliberately smaller than MIN_TOUCH so
// the header stays light; hitSlopFor() makes up the difference for the thumb.
const HEADER_ICON_SIZE = 32;

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
      // minHeight, so a title that wraps at large system font is not clipped.
      minHeight: 56,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
    },
    headerTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
      letterSpacing: -0.2,
      // The Wallet header packs four action pills beside this title. On a narrow
      // device at a large text size the row used to overflow rather than the
      // title giving up its width first.
      flexShrink: 1,
      marginEnd: Spacing.sm,
    },
    // Search bar (Chats tab only), moved up from ChannelList so one search
    // spans both Channels and Direct instead of being duplicated per sub-tab.
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      // Spacing.md, not sm. Each pill is 32pt with 6pt of slop per side, so an
      // 8pt gap put centres 40pt apart and made adjacent 44pt touch boxes
      // overlap by 4 - resolved by view order, not by which is nearer the
      // finger. On the wallet header that puts Send next to Receive. Same
      // reasoning as the segmented control below, which avoids slop entirely.
      gap: Spacing.md,
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
      borderRadius: Radius.full,
      padding: 2,
    },
    // Raised from 7 to 9 vertical padding: at 7 the segment measured ~30pt
    // tall, under the 44pt floor, and hitSlop is not an option here because
    // slop on adjacent segments overlaps and makes the boundary unpredictable.
    // Growing the track itself is the only honest fix.
    seg: {
      paddingHorizontal: Spacing.md,
      paddingVertical: 9,
      borderRadius: Radius.full,
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
      ...Shadow.low,
    },
    segText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: Colors.textMuted,
    },
    segTextActive: {
      color: Colors.textPrimary,
    },
    // Circular action button (add/create), shared by Chats, Mesh and Wallet
    // headers so every header icon-action reads the same.
    newChannelPill: {
      width: HEADER_ICON_SIZE,
      height: HEADER_ICON_SIZE,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.surfaceRaised,
    },
    headerPillDisabled: {
      opacity: DISABLED_OPACITY,
    },
    // Same circle as the + pill, so the two header actions read as one set.
    headerIconBtn: {
      width: HEADER_ICON_SIZE,
      height: HEADER_ICON_SIZE,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.surfaceRaised,
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
      fontSize: FontSize["2xs"],
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
      // Fixed-width digits so a count ticking 9 -> 10 -> 11 does not make the
      // badge breathe. Same on all three badge styles below.
      fontVariant: ["tabular-nums"],
    },
    content: {
      flex: 1,
    },
    // Bottom stack (transfer pill + tab bar) floating over the content beneath.
    // Clearance from the system navigation bar comes from the element itself
    // consuming the bottom inset, not from here - see the note where it is
    // rendered. Scrolling screens are unaffected either way: they sit inside the
    // outer SafeAreaView, so TAB_BAR_CLEARANCE still measures from the right
    // place.
    floatingBottom: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
    },
    // Outer wrap: carries the shadow + rounding + margins. Kept separate from
    // the bar itself because the bar clips its children to the pill (overflow
    // hidden), and a clipped view cannot also cast a shadow.
    tabBarWrap: {
      marginHorizontal: Spacing.base,
      marginBottom: Spacing.md,
      borderRadius: Radius.full,
      ...Shadow.high,
    },
    // The pill itself: a solid surface with a hairline edge.
    tabBar: {
      flexDirection: "row",
      backgroundColor: Colors.surface,
      borderRadius: Radius.full,
      overflow: "hidden",
      paddingTop: Spacing.xs,
      paddingBottom: Spacing.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
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
      borderRadius: Radius.xs,
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
      backgroundColor: Colors.accent,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 3,
      borderWidth: 1.5,
      borderColor: Colors.surface,
    },
    tabBadgeText: {
      fontSize: FontSize["2xs"],
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
      lineHeight: 12,
      fontVariant: ["tabular-nums"],
    },
    // Unread badge on the Channels/Direct segmented control, the same visual
    // language as tabBadge, just anchored to a smaller pill instead of a tab icon.
    // 16pt, matching the tab and bell badges: all three sit on chrome, so they
    // are the same object at the same size. It was 15, which read as a third
    // badge size for no reason anyone could name.
    segBadge: {
      position: "absolute",
      top: -5,
      right: -6,
      minWidth: 16,
      height: 16,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 3,
      borderWidth: 1.5,
      borderColor: Colors.surfaceRaised,
    },
    segBadgeText: {
      fontSize: FontSize["2xs"],
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
      lineHeight: 11,
      fontVariant: ["tabular-nums"],
    },
    tabLabel: {
      fontSize: FontSize["2xs"],
      fontWeight: FontWeight.medium,
      color: Colors.textMuted,
      letterSpacing: 0.1,
    },
    tabLabelActive: {
      color: Colors.accent,
    },
  });
}
