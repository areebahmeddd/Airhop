// Profile and settings screen.
// Identity block + a WhatsApp-style nav list that drills into its own
// sub-screens (src/features/settings/sections/*). Panic wipe stays here,
// at the very bottom, outside every section.

import Feather from "@expo/vector-icons/Feather";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BackHandler,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { encodeQRContent } from "../../core/crypto/contact-exchange";
import {
  LANGUAGES,
  PLANNED_LANGUAGES,
  t,
  useT,
  type TranslationKey,
} from "../../i18n";
import {
  destroyMeshService,
  getMeshService,
} from "../../services/mesh-service";
import { applyPresence } from "../../services/presence";
import { showAlert } from "../../store/alert-store";
import {
  useMeshStateStore,
  type PresenceStatus,
} from "../../store/mesh-state-store";
import {
  useSettingsStore,
  type ThemePreference,
} from "../../store/settings-store";
import Avatar from "../../ui/components/avatar";
import BottomSheet from "../../ui/components/bottom-sheet";
import { MONO_FONT_ORDER, MONO_FONTS } from "../../ui/fonts";
import {
  FontFamily,
  FontSize,
  FontWeight,
  HIT_SLOP,
  MIN_TOUCH,
  Radius,
  Spacing,
  TAB_BAR_CLEARANCE,
  useThemeColors,
  withAlpha,
} from "../../ui/theme";
import { peerInviteLink } from "../../utils/deep-link";
import { panicWipe } from "../../utils/panic-wipe";
import { ensurePermission } from "../../utils/permissions";
import ConnectivityGroup from "./connectivity-group";
import AboutScreen from "./sections/about-screen";
import GeneralScreen from "./sections/general-screen";
import HelpScreen from "./sections/help-screen";
import LicensesScreen from "./sections/licenses-screen";
import NetworkScreen from "./sections/network-screen";
import PermissionsScreen from "./sections/permissions-screen";
import PrivacyScreen from "./sections/privacy-screen";
import SecurityScreen from "./sections/security-screen";
import StorageScreen from "./sections/storage-screen";
import SupportScreen from "./sections/support-screen";
import TermsScreen from "./sections/terms-screen";
import VersionScreen from "./sections/version-screen";
import { GroupDivider, SettingLinkRow, useSharedStyles } from "./shared";

// Share sheets are fire-and-forget: a rejection (the OS refusing to present, a
// provider crash) is not something the user can act on, and leaving it
// unhandled turns the app's front-door "share my ID" pair into an unhandled
// rejection and a button that visibly did nothing.
async function shareOrIgnore(
  content: Parameters<typeof Share.share>[0],
): Promise<void> {
  try {
    await Share.share(content);
  } catch {
    // Dismissed, or the sheet could not open. Nothing to report.
  }
}

// Presence on the mesh. Online broadcasts + scans, Away stops the mesh
// entirely, Invisible keeps scanning but stops advertising our presence.
type Status = PresenceStatus;

// Colors passed in so the dot colors track light/dark instead of being
// baked in once at module load.
function getStatusMeta(Colors: ReturnType<typeof useThemeColors>): Record<
  Status,
  {
    label: string;
    description: string;
    color: string;
    icon: keyof typeof Feather.glyphMap;
  }
> {
  return {
    online: {
      label: t("settings.status.online"),
      description: t("settings.status.online_desc"),
      color: Colors.online,
      icon: "wifi",
    },
    away: {
      label: t("settings.status.away"),
      description: t("settings.status.away_desc"),
      color: Colors.offline,
      icon: "moon",
    },
    invisible: {
      label: t("settings.status.invisible"),
      description: t("settings.status.invisible_desc"),
      color: Colors.danger,
      icon: "eye-off",
    },
  };
}

const STATUS_ORDER: Status[] = ["online", "away", "invisible"];

// Diameter of the presence dot overlaid on the profile avatar. Named so its
// radius follows it rather than being a hand-halved 9.
const STATUS_DOT_SIZE = 18;

// Keys, not text: a module constant is evaluated once at import, so translated
// strings here would freeze in whichever language the app started in. The
// component translates them on render. Guarded by `npm run i18n:audit`.
const THEME_META: Record<
  ThemePreference,
  {
    labelKey: TranslationKey;
    descriptionKey: TranslationKey;
    icon: keyof typeof Feather.glyphMap;
  }
> = {
  light: {
    labelKey: "settings.theme.light",
    descriptionKey: "settings.theme.light_desc",
    icon: "sun",
  },
  dark: {
    labelKey: "settings.theme.dark",
    descriptionKey: "settings.theme.dark_desc",
    icon: "moon",
  },
  system: {
    labelKey: "settings.theme.system",
    descriptionKey: "settings.theme.system_desc",
    icon: "smartphone",
  },
};
const THEME_ORDER: ThemePreference[] = ["light", "dark", "system"];

// What a phone-to-phone move will carry. Shown in the transfer sheet so the
// scope of the feature is stated before it exists: people ask "does my wallet
// come with me" long before they ask how it works.
// Keys, not text: a module constant is evaluated once at import, so translated
// strings here would freeze in whichever language the app started in. The
// component translates them on render. Guarded by `npm run i18n:audit`.
const TRANSFER_ITEMS: {
  icon: keyof typeof Feather.glyphMap;
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
}[] = [
  {
    icon: "key",
    labelKey: "settings.transfer.identity",
    descriptionKey: "settings.transfer.identity_desc",
  },
  {
    icon: "message-square",
    labelKey: "settings.transfer.chats",
    descriptionKey: "settings.transfer.chats_desc",
  },
  {
    icon: "credit-card",
    labelKey: "settings.transfer.wallet",
    descriptionKey: "settings.transfer.wallet_desc",
  },
];

// Which sub-screen is currently pushed. "root" renders the hub itself.
type SettingsView =
  | "root"
  | "general"
  | "security"
  | "network"
  | "permissions"
  | "storage"
  | "help"
  | "terms"
  | "privacy"
  | "support"
  | "about"
  | "version"
  | "licenses";

// Where hardware back should land for a sub-screen nested one level deeper
// than its section (e.g. Terms/Privacy under Help, Licenses under About).
// Any view not listed here falls back to "root".
const SETTINGS_PARENT_VIEW: Partial<Record<SettingsView, SettingsView>> = {
  version: "about",
  licenses: "about",
  terms: "help",
  privacy: "help",
};

interface Props {
  peerID: string;
  username: string;
  onWipe?: () => void;
  // This screen owns a navigation stack the shell cannot see: its sections are
  // early returns, not routes. The shell needs its depth so a horizontal swipe
  // inside a section goes back rather than stepping to the next tab.
  onCanGoBackChange?: (canGoBack: boolean) => void;
  // Bumped by the shell to pop one level. A counter rather than a boolean, so
  // repeated pops each register.
  popSignal?: number;
}

export default function ProfileScreen({
  peerID,
  username,
  onWipe,
  onCanGoBackChange,
  popSignal = 0,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const T = useT();
  const shared = useSharedStyles();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const STATUS_META = useMemo(() => getStatusMeta(Colors), [Colors]);
  const [view, setView] = useState<SettingsView>("root");
  const [showQRModal, setShowQRModal] = useState(false);
  // Presence lives in the app-level mesh-state store, not local state, so it
  // survives this screen unmounting on a tab switch and never drifts out of sync
  // with the actual mesh (which stays stopped/hidden until changed again).
  const status = useMeshStateStore((s) => s.presenceStatus);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const monoFont = useSettingsStore((s) => s.monoFont);
  const setMonoFont = useSettingsStore((s) => s.setMonoFont);

  // The QR encodes a full contact card (peer ID + Noise and Ed25519 public keys
  // + nickname), not just the peer ID. A bare ID carries nothing a scanner can
  // verify or encrypt to; the card lets the other device confirm the ID really
  // is the fingerprint of these keys and open an encrypted session immediately.
  // Falls back to the plain ID if the mesh service isn't up yet, which older
  // builds' scanners also still accept.
  const qrValue = useMemo(() => {
    const card = getMeshService()?.getContactCard();
    return card ? encodeQRContent(card) : peerID;
  }, [peerID]);

  // The sections below are early returns rather than an overlay, so opening one
  // unmounts the hub's list and loses its scroll position. Remember it on the way
  // out and restore it when the sub-screen pops. Restored from
  // `onContentSizeChange` because the `contentOffset` prop is iOS-only.
  const rootScrollRef = useRef<ScrollView>(null);
  const rootScrollY = useRef(0);
  const restoreRootScroll = useRef(false);

  function openSection(next: SettingsView): void {
    restoreRootScroll.current = rootScrollY.current > 0;
    setView(next);
  }

  // One way back out of a sub-screen, used by three things: the header chevron,
  // the Android back button, and the shell's back-swipe.
  const goBack = useCallback(() => {
    setView((current) =>
      current === "root" ? current : (SETTINGS_PARENT_VIEW[current] ?? "root"),
    );
  }, []);

  // Android hardware/gesture back: leave a sub-screen instead of exiting.
  useEffect(() => {
    if (view === "root") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [view, goBack]);

  // Tell the shell whether there is anywhere to go back to, so it can turn its
  // tab-stepping swipe into a back-swipe while we are inside a section.
  useEffect(() => {
    onCanGoBackChange?.(view !== "root");
  }, [view, onCanGoBackChange]);

  // Skipped on mount: `popSignal` starts at whatever the shell's counter is,
  // and acting on that would close a section as it opened.
  const lastPopSignal = useRef(popSignal);
  useEffect(() => {
    if (popSignal === lastPopSignal.current) return;
    lastPopSignal.current = popSignal;
    goBack();
  }, [popSignal, goBack]);

  async function handleConfirmWipe(): Promise<void> {
    // Order matters. The mesh comes down FIRST: it is a live process with radios
    // open and relay subscriptions running, and anything that lands while the
    // wipe is in flight would be written straight back into the stores the wipe
    // just cleared. Stopping first also lets the goodbye packet go out under the
    // identity that is about to cease existing, which is the last honest moment
    // to send it. Destroying rather than stopping releases the key material too.
    destroyMeshService();
    // Never leaves the app mid-wipe.
    //
    // `await panicWipe()` used to be unwrapped, and both callers invoke this as
    // `void handleConfirmWipe()`. A rejection therefore skipped the two lines
    // below: the confirm sheet stayed open over a half-wiped app, the shell was
    // never told to drop to onboarding, and the only thing the user had seen was
    // the triple-tap's warning haptic - which fires BEFORE any of this runs. The
    // one irreversible action in the app reported its own failure by doing
    // nothing at all.
    let keysDestroyed = false;
    try {
      ({ keysDestroyed } = await panicWipe());
    } catch {
      // The wipe itself is internally best-effort, so reaching here means
      // something outside it threw. The app still drops to onboarding below,
      // because a half-wiped app the user cannot leave is the worse end state.
    }
    setShowWipeModal(false);
    onWipe?.();
    // The one claim that must not be made falsely. Everything else is gone
    // either way; if the OS refused to release the keys, the user has to know,
    // because the whole point of the gesture was the keys.
    //
    // Said twice, and both are needed. The alert is the interruption: it lands
    // the moment it is known, while the person is still standing over the
    // decision. The banner is the memory: an alert is dismissed once and then
    // the app looks exactly like a fresh install over data that is still here,
    // and "did it work?" becomes a guess - which under duress is answered by
    // wiping again. Set after panicWipe, whose own store reset would otherwise
    // clear it. Re-derived on every launch from the keychain itself, so a retry
    // that succeeds takes it away without anything having to remember.
    if (!keysDestroyed) {
      useMeshStateStore.getState().setWipeIncomplete(true);
      showAlert(
        t("settings.wipe.keys_failed"),
        t("settings.wipe.keys_failed_body"),
      );
    }
  }

  // Panic button taps: a single tap opens the confirm sheet; three quick taps
  // are an escape-hatch easter egg that wipes immediately, no confirmation.
  const wipeTapCount = useRef(0);
  const wipeTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The triple-tap window is a live timer on an irreversible action, so it goes
  // with the screen rather than outliving it.
  useEffect(() => {
    return () => {
      if (wipeTapTimer.current) clearTimeout(wipeTapTimer.current);
    };
  }, []);
  function handlePanicPress(): void {
    wipeTapCount.current += 1;
    if (wipeTapTimer.current) clearTimeout(wipeTapTimer.current);
    if (wipeTapCount.current >= 3) {
      wipeTapCount.current = 0;
      // The triple tap skips every dialog by design: it exists for the moment
      // when there is no time to read one. That makes it the only irreversible
      // action in the app with no visual confirmation at all, so it gets the
      // one unmistakable non-visual one. A warning notification, not an impact:
      // it is the OS pattern for "something serious just happened", and it is
      // the only signal a user gets that the wipe fired rather than that they
      // merely mistapped.
      void Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning,
      ).catch(() => {});
      void handleConfirmWipe();
      return;
    }
    wipeTapTimer.current = setTimeout(() => {
      wipeTapCount.current = 0;
      setShowWipeModal(true);
    }, 400);
  }

  const shortPubKey = peerID.slice(0, 8) + " · " + peerID.slice(8);

  function handleSelectStatus(next: Status): void {
    // Shared with the background notification's "Stop mesh" action, so both
    // routes into Away do exactly the same thing. See services/presence.
    applyPresence(next, username);
    setShowStatusModal(false);
  }

  async function handleSharePeerID(): Promise<void> {
    await shareOrIgnore({ message: peerID });
  }

  // The QRCode component exposes an SVG ref whose toDataURL() returns the
  // rendered code as base64 PNG data, no data URI prefix.
  const qrRef = useRef<{
    toDataURL: (callback: (data: string) => void) => void;
  } | null>(null);

  async function handleDownloadQR(): Promise<void> {
    // writeOnly: saving one image needs permission to add to the library, not
    // to read everything already in it. Asking for less is both faster to grant
    // and the honest ask.
    const granted = await ensurePermission(
      () => MediaLibrary.getPermissionsAsync(true),
      () => MediaLibrary.requestPermissionsAsync(true),
      {
        label: t("settings.qr.permission_label"),
        purpose: t("settings.qr.permission_purpose"),
      },
    );
    if (!granted) return;
    qrRef.current?.toDataURL(async (base64) => {
      try {
        const file = new FileSystem.File(
          FileSystem.Paths.cache,
          `airhop-qr-${peerID.slice(0, 8)}.png`,
        );
        if (file.exists) file.delete();
        file.create();
        file.write(base64, { encoding: "base64" });
        // See the note in message-thread's saveAttachmentToDevice:
        // saveToLibraryAsync is a throwing stub in expo-media-library 57, so
        // this branch always fell into the catch below and Download QR could
        // never have worked.
        await MediaLibrary.Asset.create(file.uri);
        showAlert(t("settings.qr.saved"), t("settings.qr.saved_body"));
      } catch {
        showAlert(
          t("settings.qr.save_failed"),
          t("settings.qr.save_failed_body"),
        );
      }
    });
  }

  async function handleShareQR(): Promise<void> {
    // A tappable deep link that opens Airhop straight into a chat with me.
    await shareOrIgnore({
      message: `${t("settings.qr.share_body")}\n\n${peerInviteLink(peerID)}`,
      title: t("settings.qr.share_message"),
    });
  }

  // ---- Sub-screens --------------------------------------------------------

  if (view === "general") {
    return <GeneralScreen onBack={() => setView("root")} />;
  }
  if (view === "security") {
    return <SecurityScreen onBack={() => setView("root")} />;
  }
  if (view === "network") {
    return <NetworkScreen onBack={() => setView("root")} />;
  }
  if (view === "permissions") {
    return <PermissionsScreen onBack={() => setView("root")} />;
  }
  if (view === "storage") {
    return <StorageScreen onBack={() => setView("root")} />;
  }
  if (view === "help") {
    return (
      <HelpScreen
        onBack={() => setView("root")}
        onOpenTerms={() => setView("terms")}
        onOpenPrivacy={() => setView("privacy")}
      />
    );
  }
  if (view === "terms") {
    return <TermsScreen onBack={() => setView("help")} />;
  }
  if (view === "privacy") {
    return <PrivacyScreen onBack={() => setView("help")} />;
  }
  if (view === "support") {
    return <SupportScreen onBack={() => setView("root")} />;
  }
  if (view === "about") {
    return (
      <AboutScreen
        onBack={() => setView("root")}
        onOpenVersion={() => setView("version")}
        onOpenLicenses={() => setView("licenses")}
      />
    );
  }
  if (view === "version") {
    return <VersionScreen onBack={() => setView("about")} />;
  }
  if (view === "licenses") {
    return <LicensesScreen onBack={() => setView("about")} />;
  }

  // ---- Root hub -------------------------------------------------------------

  return (
    <ScrollView
      ref={rootScrollRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={(e) => {
        rootScrollY.current = e.nativeEvent.contentOffset.y;
      }}
      onContentSizeChange={() => {
        if (!restoreRootScroll.current) return;
        restoreRootScroll.current = false;
        rootScrollRef.current?.scrollTo({
          y: rootScrollY.current,
          animated: false,
        });
      }}
    >
      {/* Header: pencil edits presence status, top-right */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerEditBtn}
          onPress={() => setShowStatusModal(true)}
          accessibilityRole="button"
          accessibilityLabel={T("settings.status.edit")}
          hitSlop={HIT_SLOP}
        >
          <Feather name="edit-2" size={15} color={Colors.textSecondary} />
        </Pressable>
      </View>

      {/* Identity block: large centered avatar, name, peer ID, no card background */}
      <View style={styles.identityBlock}>
        <View style={styles.avatarWrap}>
          <Avatar username={username} peerID={peerID} size={96} />
          <View
            style={[
              styles.statusDot,
              { backgroundColor: STATUS_META[status].color },
            ]}
          />
        </View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.statusLabel}>{STATUS_META[status].label}</Text>
        <View style={styles.peerIDGroup}>
          <Text style={styles.peerIDLabel}>{T("settings.peer_id")}</Text>
          <Text style={styles.peerID}>{shortPubKey}</Text>
        </View>
      </View>

      {/* Share actions: bordered pill buttons below the identity block */}
      <View style={styles.sharePills}>
        <Pressable
          style={styles.sharePill}
          onPress={() => void handleSharePeerID()}
          accessibilityRole="button"
          accessibilityLabel={T("settings.share_peer_id")}
        >
          <View style={styles.sharePillInner}>
            <Feather name="share" size={13} color={Colors.textSecondary} />
            <Text style={styles.sharePillText} numberOfLines={1}>
              {T("settings.share_id_short")}
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.sharePill}
          onPress={() => setShowQRModal(true)}
          accessibilityRole="button"
          accessibilityLabel={T("settings.qr.show")}
        >
          <View style={styles.sharePillInner}>
            <Feather name="eye" size={13} color={Colors.textSecondary} />
            <Text style={styles.sharePillText} numberOfLines={1}>
              {T("settings.qr.show_short")}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* The connectivity toggles, in the box the feature list used to hold.
          Wallet/AI/Feeds were a standing statement about the app rather than
          controls, so they read as chrome on the first screen and have moved
          under General; these four are the switches people open Settings to
          flip, and they belong where the thumb already is. */}
      <ConnectivityGroup />

      {/* Settings nav: each row drills into its own sub-screen */}
      <View style={shared.section}>
        <View style={shared.settingsGroup}>
          <SettingLinkRow
            icon="settings"
            label={T("settings.section.general")}
            description={T("settings.section.general_desc")}
            onPress={() => openSection("general")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="lock"
            label={T("settings.section.privacy")}
            description={T("settings.section.privacy_desc")}
            onPress={() => openSection("security")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="radio"
            label={T("settings.section.network")}
            description={T("settings.section.network_desc")}
            onPress={() => openSection("network")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="key"
            label={T("settings.section.permissions")}
            description={T("settings.section.permissions_desc")}
            onPress={() => openSection("permissions")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="hard-drive"
            label={T("settings.section.storage")}
            description={T("settings.section.storage_desc")}
            onPress={() => openSection("storage")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="sliders"
            label={T("settings.section.appearance")}
            description={T("settings.section.appearance_desc")}
            onPress={() => setShowThemeModal(true)}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="help-circle"
            label={T("settings.section.help")}
            description={T("settings.section.help_desc")}
            onPress={() => openSection("help")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="heart"
            label={T("settings.section.support")}
            description={T("settings.section.support_desc")}
            onPress={() => openSection("support")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="info"
            label={T("settings.section.about")}
            description={T("settings.section.about_desc")}
            onPress={() => openSection("about")}
          />
        </View>
      </View>

      {/* Moving to a new phone. Not built yet, so the row carries the same
          "Coming soon" tag as the unshipped feature rows above, and opens a
          sheet describing the move rather than starting one. It sits directly
          above the danger zone because both answer "I am leaving this device",
          and the safe answer should be the one you reach first. */}
      <View style={shared.section}>
        <View style={shared.settingsGroup}>
          <SettingLinkRow
            icon="smartphone"
            label={T("settings.transfer.title")}
            description={T("settings.transfer.desc")}
            onPress={() => setShowTransferModal(true)}
            chevron={false}
            control={
              <Text style={shared.comingSoon}>{T("settings.coming_soon")}</Text>
            }
            accessibilityLabel={T("settings.transfer.coming_soon_a11y")}
          />
        </View>
      </View>

      {/* Danger zone, same settingsGroup box pattern as other sections */}
      <View style={shared.section}>
        <View style={[shared.settingsGroup, styles.dangerGroup]}>
          <Pressable
            style={styles.dangerRow}
            onPress={handlePanicPress}
            accessibilityRole="button"
            accessibilityLabel={T("settings.wipe.trigger")}
            accessibilityHint={T("settings.wipe.trigger_desc")}
          >
            {/* Inner View owns the row layout. Pressable does not reliably
                propagate flexDirection on all RN versions. */}
            <View style={styles.dangerRowInner}>
              <View style={styles.dangerIconWrap}>
                <Feather
                  name="alert-triangle"
                  size={18}
                  color={Colors.danger}
                />
              </View>
              <View style={styles.dangerRowContent}>
                <Text style={styles.dangerLabel}>
                  {T("settings.wipe.title")}
                </Text>
                <Text style={styles.dangerDescription}>
                  {T("settings.wipe.desc")}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>

      {/* QR code modal: the QR, a Share button, and a Download button */}
      <BottomSheet
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
        sheetStyle={shared.sheet}
      >
        {/* The one settings sheet with a centered body (QR, peer ID, two
            stacked buttons), so its title centers with them instead of sitting
            flush left like the rest. */}
        <Text style={[shared.sheetTitle, styles.qrSheetTitle]}>
          {T("settings.qr.title")}
        </Text>
        <View style={styles.qrLarge}>
          <QRCode
            value={qrValue}
            size={200}
            color={Colors.textPrimary}
            backgroundColor={Colors.surface}
            getRef={(c) => {
              qrRef.current = c;
            }}
          />
        </View>
        <Text style={styles.qrSheetPeerID}>{peerID}</Text>
        <View style={styles.qrActions}>
          <Pressable
            style={styles.qrShareBtn}
            onPress={() => void handleShareQR()}
            accessibilityRole="button"
            accessibilityLabel={T("settings.qr.share")}
          >
            <Feather name="share" size={16} color={Colors.textInverse} />
            <Text style={styles.qrShareText}>
              {T("settings.qr.share_short")}
            </Text>
          </Pressable>
          <Pressable
            style={styles.qrDownloadBtn}
            onPress={() => void handleDownloadQR()}
            accessibilityRole="button"
            accessibilityLabel={T("settings.qr.download")}
          >
            <Feather name="download" size={16} color={Colors.textPrimary} />
            <Text style={styles.qrDownloadText}>
              {T("settings.qr.download_short")}
            </Text>
          </Pressable>
        </View>
      </BottomSheet>

      {/* Status modal: bottom sheet, one selectable row per presence state */}
      <BottomSheet
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        sheetStyle={shared.sheet}
      >
        <Text style={shared.sheetTitle}>{T("settings.status.title")}</Text>
        <Text style={shared.sheetSubtitle}>{T("settings.status.desc")}</Text>
        <View style={[shared.settingsGroup, styles.appearanceGroup]}>
          {STATUS_ORDER.map((key, i) => {
            const meta = STATUS_META[key];
            const selected = key === status;
            return (
              <React.Fragment key={key}>
                {i > 0 && <View style={shared.groupDivider} />}
                <Pressable
                  style={[
                    styles.optionRowGrouped,
                    selected && styles.optionRowGroupedSelected,
                  ]}
                  onPress={() => handleSelectStatus(key)}
                  accessibilityRole="button"
                  accessibilityLabel={T("settings.status.set_a11y", {
                    value: meta.label,
                  })}
                >
                  <View
                    style={[shared.optionDot, { backgroundColor: meta.color }]}
                  >
                    <Feather name={meta.icon} size={14} color="#FFFFFF" />
                  </View>
                  <View style={shared.optionText}>
                    <Text style={shared.optionLabel}>{meta.label}</Text>
                    <Text style={shared.optionDescription}>
                      {meta.description}
                    </Text>
                  </View>
                  {selected && (
                    <Feather
                      name="check"
                      size={18}
                      color={Colors.textPrimary}
                    />
                  )}
                </Pressable>
              </React.Fragment>
            );
          })}
        </View>
      </BottomSheet>

      {/* Appearance modal: theme, mono font, and the language list. Three
          groups outgrow a phone screen, so the body scrolls and the grab
          handle keeps the drag. */}
      <BottomSheet
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        sheetStyle={[shared.sheet, styles.appearanceSheet]}
        scrollable
      >
        <Text style={shared.sheetTitle}>
          {T("settings.section.appearance")}
        </Text>

        <ScrollView
          style={styles.appearanceScroll}
          contentContainerStyle={styles.appearanceScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.appearanceGroupLabel}>
            {T("settings.theme.group")}
          </Text>
          <View style={[shared.settingsGroup, styles.appearanceGroup]}>
            {THEME_ORDER.map((key, i) => {
              const meta = THEME_META[key];
              const selected = key === theme;
              return (
                <React.Fragment key={key}>
                  {i > 0 && <View style={shared.groupDivider} />}
                  <Pressable
                    style={[
                      styles.optionRowGrouped,
                      selected && styles.optionRowGroupedSelected,
                    ]}
                    onPress={() => {
                      setTheme(key);
                      setShowThemeModal(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={T("settings.theme.set_a11y", {
                      value: T(meta.labelKey),
                    })}
                  >
                    <View style={styles.optionIconGrouped}>
                      <Feather
                        name={meta.icon}
                        size={18}
                        color={Colors.textSecondary}
                      />
                    </View>
                    <View style={shared.optionText}>
                      <Text style={shared.optionLabel}>{T(meta.labelKey)}</Text>
                      <Text style={shared.optionDescription}>
                        {T(meta.descriptionKey)}
                      </Text>
                    </View>
                    {selected && (
                      <Feather
                        name="check"
                        size={18}
                        color={Colors.textPrimary}
                      />
                    )}
                  </Pressable>
                </React.Fragment>
              );
            })}
          </View>

          {/* Font: keep the sheet open on select so the change is visible live
                (the mono bits behind it update instantly) and easy to compare. */}
          <Text style={styles.appearanceGroupLabel}>
            {T("settings.font.group")}
          </Text>
          <View style={[shared.settingsGroup, styles.appearanceGroup]}>
            {MONO_FONT_ORDER.map((key, i) => {
              const meta = MONO_FONTS[key];
              const selected = key === monoFont;
              return (
                <React.Fragment key={key}>
                  {i > 0 && <View style={shared.groupDivider} />}
                  <Pressable
                    style={[
                      styles.optionRowGrouped,
                      selected && styles.optionRowGroupedSelected,
                    ]}
                    onPress={() => setMonoFont(key)}
                    accessibilityRole="button"
                    accessibilityLabel={T("settings.font.set_a11y", {
                      value: T(meta.labelKey),
                    })}
                  >
                    <View style={styles.optionIconGrouped}>
                      <Feather
                        name={meta.icon}
                        size={18}
                        color={Colors.textSecondary}
                      />
                    </View>
                    <View style={shared.optionText}>
                      <Text
                        style={[
                          shared.optionLabel,
                          { fontFamily: meta.family },
                        ]}
                      >
                        {T(meta.labelKey)}
                      </Text>
                      <Text style={shared.optionDescription}>
                        {T(meta.descriptionKey)}
                      </Text>
                    </View>
                    {selected && (
                      <Feather
                        name="check"
                        size={18}
                        color={Colors.textPrimary}
                      />
                    )}
                  </Pressable>
                </React.Fragment>
              );
            })}
          </View>

          {/* Language: English is the whole catalog today, so the other nine are
            listed but not selectable. Naming them is the point. It answers
            "is my language coming" without a picker that can only pick one
            thing, and the rows become live the release their catalogs land. */}
          <Text style={styles.appearanceGroupLabel}>
            {T("settings.language.group")}
          </Text>
          <View style={[shared.settingsGroup, styles.appearanceGroup]}>
            <View
              style={[styles.optionRowGrouped, styles.optionRowGroupedSelected]}
            >
              <View style={styles.optionIconGrouped}>
                <Text style={styles.languageCode}>EN</Text>
              </View>
              <View style={shared.optionText}>
                <Text style={shared.optionLabel}>
                  {T("settings.language.en")}
                </Text>
                <Text style={shared.optionDescription}>
                  {LANGUAGES.en.endonym}
                </Text>
              </View>
              <Feather name="check" size={18} color={Colors.textPrimary} />
            </View>
            {PLANNED_LANGUAGES.map((lang) => (
              <React.Fragment key={lang.code}>
                <View style={shared.groupDivider} />
                <View
                  style={[styles.optionRowGrouped, styles.languageRowSoon]}
                  accessible
                  accessibilityLabel={T("settings.language.soon_a11y", {
                    value: T(lang.nameKey),
                  })}
                >
                  <View style={styles.optionIconGrouped}>
                    <Text style={styles.languageCode}>{lang.shortCode}</Text>
                  </View>
                  <View style={shared.optionText}>
                    <Text style={shared.optionLabel}>{T(lang.nameKey)}</Text>
                    <Text style={shared.optionDescription}>{lang.endonym}</Text>
                  </View>
                  <Text style={styles.languageSoon}>
                    {T("settings.language.soon")}
                  </Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      </BottomSheet>

      {/* Transfer sheet: a preview, not a flow. It states what a move will
          carry and how it will run, so the shape of the feature is settled
          before anything is behind it. There is nothing to start yet, so the
          only action is dismissing it. */}
      <BottomSheet
        visible={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        sheetStyle={shared.sheet}
      >
        <Text style={shared.sheetTitle}>{T("settings.transfer.title")}</Text>
        <Text style={shared.sheetSubtitle}>{T("settings.transfer.body")}</Text>
        <View style={[shared.settingsGroup, styles.appearanceGroup]}>
          {TRANSFER_ITEMS.map((item, i) => (
            <React.Fragment key={item.labelKey}>
              {i > 0 && <View style={shared.groupDivider} />}
              <View style={styles.optionRowGrouped}>
                <View style={styles.optionIconGrouped}>
                  <Feather
                    name={item.icon}
                    size={18}
                    color={Colors.textSecondary}
                  />
                </View>
                <View style={shared.optionText}>
                  <Text style={shared.optionLabel}>{T(item.labelKey)}</Text>
                  <Text style={shared.optionDescription}>
                    {T(item.descriptionKey)}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>
        <View style={shared.sheetActions}>
          <Pressable
            style={shared.sheetBtnPrimary}
            onPress={() => setShowTransferModal(false)}
            accessibilityRole="button"
            accessibilityLabel={T("settings.wipe.got_it")}
          >
            <Text style={shared.sheetBtnTextPrimary}>
              {T("settings.wipe.got_it")}
            </Text>
          </Pressable>
        </View>
      </BottomSheet>

      {/* Panic wipe modal: confirm, then wipe and drop straight to onboarding
          rather than making the user tap through a second "Wiped" screen. */}
      <BottomSheet
        visible={showWipeModal}
        onClose={() => setShowWipeModal(false)}
        sheetStyle={shared.sheet}
      >
        <Text style={shared.sheetTitle}>{T("settings.wipe.title")}</Text>
        <Text style={shared.sheetSubtitle}>{T("settings.wipe.body")}</Text>
        <View style={styles.wipeActions}>
          <Pressable
            style={styles.wipeConfirmBtn}
            onPress={() => void handleConfirmWipe()}
            accessibilityRole="button"
            accessibilityLabel={T("settings.wipe.now")}
          >
            <Text style={styles.wipeConfirmText}>{T("settings.wipe.now")}</Text>
          </Pressable>
          <Pressable
            style={styles.wipeCancelBtn}
            onPress={() => setShowWipeModal(false)}
            accessibilityRole="button"
            accessibilityLabel={T("common.cancel")}
          >
            <Text style={styles.wipeCancelText}>{T("common.cancel")}</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </ScrollView>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    content: {
      padding: Spacing.base,
      gap: Spacing.md,
      paddingBottom: TAB_BAR_CLEARANCE,
    },
    // Header row above the identity block: status edit pencil, top-right
    header: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    headerEditBtn: {
      width: 32,
      height: 32,
      borderRadius: Radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    // Identity block: large centered avatar, name, peer ID, no card background
    identityBlock: {
      alignItems: "center",
      paddingTop: Spacing.xs,
    },
    avatarWrap: {
      position: "relative",
    },
    statusDot: {
      position: "absolute",
      end: 2,
      bottom: 2,
      width: STATUS_DOT_SIZE,
      height: STATUS_DOT_SIZE,
      borderRadius: Radius.full,
      borderWidth: 2,
      borderColor: Colors.bg,
    },
    username: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      marginTop: Spacing.md,
      textAlign: "center",
    },
    statusLabel: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      marginTop: 2,
    },
    // The sheet centers its children, so both the box and its header need to be
    // stretched to full width or they collapse to their content and the rows
    // wrap and overlap.
    appearanceGroup: {
      width: "100%",
    },
    // Small group header inside the Appearance sheet (theme / font / language).
    appearanceGroupLabel: {
      alignSelf: "stretch",
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      letterSpacing: 0.8,
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
      marginStart: Spacing.xs,
    },
    // Capped so the language list scrolls inside the sheet instead of pushing
    // the sheet past the top of the screen, where it would clip rather than
    // scroll (a sheet body is a plain View).
    appearanceSheet: {
      maxHeight: "85%",
    },
    appearanceScroll: {
      alignSelf: "stretch",
      // Shrink inside the capped sheet rather than pushing past it: without
      // this the list keeps its full content height and clips at the top.
      flexShrink: 1,
    },
    appearanceScrollContent: {
      paddingBottom: Spacing.sm,
    },
    // Leading column of a language row: the code in mono, standing in for the
    // icon the theme and font rows carry. A flag would be wrong (a language is
    // not a country) and a globe on all ten would say nothing.
    languageCode: {
      fontFamily: FontFamily.mono,
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
    },
    // The nine without a catalog yet: dimmed and inert, so the group reads as
    // one list rather than as a selectable box with disabled strays in it.
    languageRowSoon: {
      opacity: 0.55,
    },
    languageSoon: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      flexShrink: 0,
    },
    // One row inside the Appearance box (no per-row border; the box + dividers
    // group them, matching the settings and room-actions sheets).
    optionRowGrouped: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      minHeight: 60,
    },
    optionRowGroupedSelected: {
      backgroundColor: Colors.surfaceRaised,
    },
    optionIconGrouped: {
      width: 24,
      alignItems: "center",
      flexShrink: 0,
    },
    peerIDGroup: {
      alignItems: "center",
      gap: 3,
      marginTop: Spacing.sm,
    },
    peerIDLabel: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      marginTop: Spacing.xs,
    },
    peerID: {
      fontSize: FontSize.xs,
      color: Colors.textSecondary,
      fontFamily: FontFamily.mono,
      letterSpacing: 0.8,
    },
    // Share actions: bordered pill buttons below the identity block
    sharePills: {
      flexDirection: "row",
      gap: Spacing.sm,
    },
    sharePill: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Spacing.sm + 2,
      minHeight: MIN_TOUCH,
      borderRadius: Radius.full,
      backgroundColor: Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    sharePillInner: {
      flexDirection: "row",
      alignItems: "center",
    },
    sharePillText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
      marginStart: Spacing.xs,
    },
    // Danger zone, uses settingsGroup box for consistency with other sections
    dangerGroup: {
      borderColor: withAlpha(Colors.danger, 0.2),
    },
    // Pressable fills the cell; inner View owns the row direction.
    dangerRow: {
      overflow: "hidden",
    },
    dangerRowInner: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      gap: Spacing.md,
    },
    dangerIconWrap: {
      width: 22,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    dangerRowContent: {
      flex: 1,
      gap: 2,
    },
    dangerLabel: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.danger,
    },
    dangerDescription: {
      fontSize: FontSize.xs,
      color: Colors.danger,
      opacity: 0.7,
      lineHeight: FontSize.xs * 1.5,
    },
    qrSheetTitle: {
      textAlign: "center",
    },
    qrLarge: {
      padding: Spacing.xl,
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    qrSheetPeerID: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontFamily: FontFamily.mono,
      letterSpacing: 0.8,
      textAlign: "center",
    },
    // Share / Download: stacked full-width buttons, same bounded-pill
    // pattern as the panic-wipe actions. Share is the solid primary action;
    // Download is a bordered secondary pill underneath it.
    qrActions: {
      width: "100%",
      marginTop: Spacing.sm,
    },
    qrShareBtn: {
      width: "100%",
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
    },
    qrShareText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
    },
    qrDownloadBtn: {
      width: "100%",
      minHeight: 50,
      marginTop: Spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: Colors.borderStrong,
      backgroundColor: Colors.surfaceRaised,
    },
    qrDownloadText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    // Wipe now / Cancel: stacked full-width buttons. Wipe now is a solid red
    // pill (the one unmistakable destructive action on the whole screen);
    // Cancel is a plain, clearly-tappable button underneath it.
    wipeActions: {
      width: "100%",
      marginTop: Spacing.sm,
    },
    wipeConfirmBtn: {
      width: "100%",
      minHeight: 50,
      paddingVertical: Spacing.md,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      alignItems: "center",
      justifyContent: "center",
    },
    wipeConfirmText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.danger,
    },
    wipeCancelBtn: {
      width: "100%",
      minHeight: 50,
      paddingVertical: Spacing.md,
      marginTop: Spacing.sm,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      alignItems: "center",
      justifyContent: "center",
    },
    wipeCancelText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
  });
}
