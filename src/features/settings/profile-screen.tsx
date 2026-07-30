// Profile and settings screen.
// Identity block + a WhatsApp-style nav list that drills into its own
// sub-screens (src/features/settings/sections/*). Panic wipe stays here,
// at the very bottom, outside every section.

import Feather from "@expo/vector-icons/Feather";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
      label: "Online",
      description: "Discoverable, advertising and scanning",
      color: Colors.online,
      icon: "wifi",
    },
    away: {
      label: "Away",
      description: "Mesh paused, not scanning or advertising",
      color: Colors.offline,
      icon: "moon",
    },
    invisible: {
      label: "Invisible",
      description: "Scanning, but hidden from discovery",
      color: Colors.danger,
      icon: "eye-off",
    },
  };
}

const STATUS_ORDER: Status[] = ["online", "away", "invisible"];

// Diameter of the presence dot overlaid on the profile avatar. Named so its
// radius follows it rather than being a hand-halved 9.
const STATUS_DOT_SIZE = 18;

const THEME_META: Record<
  ThemePreference,
  { label: string; description: string; icon: keyof typeof Feather.glyphMap }
> = {
  light: {
    label: "Light",
    description: "Always use the light palette",
    icon: "sun",
  },
  dark: {
    label: "Dark",
    description: "Always use the dark palette",
    icon: "moon",
  },
  system: {
    label: "System default",
    description: "Uses your device's appearance setting",
    icon: "smartphone",
  },
};
const THEME_ORDER: ThemePreference[] = ["light", "dark", "system"];

// What a phone-to-phone move will carry. Shown in the transfer sheet so the
// scope of the feature is stated before it exists: people ask "does my wallet
// come with me" long before they ask how it works.
const TRANSFER_ITEMS: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  description: string;
}[] = [
  {
    icon: "key",
    label: "Identity and keys",
    description: "Your peer ID, username, and contacts",
  },
  {
    icon: "message-square",
    label: "Chats and history",
    description: "Conversations, groups, and the channels you have joined",
  },
  {
    icon: "credit-card",
    label: "Wallet balance",
    description: "Cashu proofs and transaction history",
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
}

export default function ProfileScreen({
  peerID,
  username,
  onWipe,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
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

  // Android hardware/gesture back: leave a sub-screen instead of exiting.
  useEffect(() => {
    if (view === "root") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setView(SETTINGS_PARENT_VIEW[view] ?? "root");
      return true;
    });
    return () => sub.remove();
  }, [view]);

  async function handleConfirmWipe(): Promise<void> {
    // Order matters. The mesh comes down FIRST: it is a live process with radios
    // open and relay subscriptions running, and anything that lands while the
    // wipe is in flight would be written straight back into the stores the wipe
    // just cleared. Stopping first also lets the goodbye packet go out under the
    // identity that is about to cease existing, which is the last honest moment
    // to send it. Destroying rather than stopping releases the key material too.
    destroyMeshService();
    await panicWipe();
    setShowWipeModal(false);
    onWipe?.();
  }

  // Panic button taps: a single tap opens the confirm sheet; three quick taps
  // are an escape-hatch easter egg that wipes immediately, no confirmation.
  const wipeTapCount = useRef(0);
  const wipeTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    await Share.share({ message: peerID });
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
      { label: "Photo access", purpose: "save your QR code" },
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
        await MediaLibrary.saveToLibraryAsync(file.uri);
        showAlert("Saved", "QR code saved to your photo library.");
      } catch {
        showAlert(
          "Couldn't save",
          "The QR code could not be saved. Try again.",
        );
      }
    });
  }

  async function handleShareQR(): Promise<void> {
    // A tappable deep link that opens Airhop straight into a chat with me.
    await Share.share({
      message: `Add me on Airhop - offline-first, private mesh messaging.\n\n${peerInviteLink(peerID)}`,
      title: "Add me on Airhop",
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
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header: pencil edits presence status, top-right */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerEditBtn}
          onPress={() => setShowStatusModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Edit status"
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
          <Text style={styles.peerIDLabel}>Peer ID</Text>
          <Text style={styles.peerID}>{shortPubKey}</Text>
        </View>
      </View>

      {/* Share actions: bordered pill buttons below the identity block */}
      <View style={styles.sharePills}>
        <Pressable
          style={styles.sharePill}
          onPress={() => void handleSharePeerID()}
          accessibilityRole="button"
          accessibilityLabel="Share your Peer ID"
        >
          <View style={styles.sharePillInner}>
            <Feather name="share-2" size={13} color={Colors.textSecondary} />
            <Text style={styles.sharePillText} numberOfLines={1}>
              Share ID
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.sharePill}
          onPress={() => setShowQRModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Show QR code"
        >
          <View style={styles.sharePillInner}>
            <Feather name="eye" size={13} color={Colors.textSecondary} />
            <Text style={styles.sharePillText} numberOfLines={1}>
              Show QR
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
            label="General"
            description="Optional features, undo send, media, reset"
            onPress={() => setView("general")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="lock"
            label="Privacy & Security"
            description="Forward secrecy, signed packets, blocked peers"
            onPress={() => setView("security")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="radio"
            label="Network & Relays"
            description="Internet fallback, nostr relays, bitchat compatibility"
            onPress={() => setView("network")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="key"
            label="Permissions"
            description="Bluetooth, location, notifications, camera, mic"
            onPress={() => setView("permissions")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="hard-drive"
            label="Storage & Data"
            description="Usage and cache"
            onPress={() => setView("storage")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="sliders"
            label="Appearance"
            description="Theme and font"
            onPress={() => setShowThemeModal(true)}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="help-circle"
            label="Help and feedback"
            description="Contact us, report a bug, or read the FAQ"
            onPress={() => setView("help")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="heart"
            label="Support"
            description="Help keep development active"
            onPress={() => setView("support")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="info"
            label="About"
            description="Version, changelog, and source"
            onPress={() => setView("about")}
          />
        </View>
      </View>

      {/* Moving to a new phone. Not built yet, so the row carries the same
          "Coming soon" tag as the unshipped feature rows above and opens a
          sheet describing the move rather than starting one. It sits directly
          above the danger zone because both answer "I am leaving this device",
          and the safe answer should be the one you reach first. */}
      <View style={shared.section}>
        <View style={shared.settingsGroup}>
          <SettingLinkRow
            icon="smartphone"
            label="Transfer to a new phone"
            description="Move your identity, chats, and wallet to another device"
            onPress={() => setShowTransferModal(true)}
            chevron={false}
            control={<Text style={shared.comingSoon}>Coming soon</Text>}
            accessibilityLabel="Transfer to a new phone, coming soon"
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
            accessibilityLabel="Trigger panic wipe"
            accessibilityHint="Triple-tap to wipe immediately without confirming"
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
                <Text style={styles.dangerLabel}>Panic wipe</Text>
                <Text style={styles.dangerDescription}>
                  Instantly destroy all keys, messages, and proofs
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
        <Text style={shared.sheetTitle}>Your QR Code</Text>
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
            accessibilityLabel="Share QR code"
          >
            <Feather name="share-2" size={16} color={Colors.textInverse} />
            <Text style={styles.qrShareText}>Share QR</Text>
          </Pressable>
          <Pressable
            style={styles.qrDownloadBtn}
            onPress={() => void handleDownloadQR()}
            accessibilityRole="button"
            accessibilityLabel="Download QR code"
          >
            <Feather name="download" size={16} color={Colors.textPrimary} />
            <Text style={styles.qrDownloadText}>Download QR</Text>
          </Pressable>
        </View>
      </BottomSheet>

      {/* Status modal: bottom sheet, one selectable row per presence state */}
      <BottomSheet
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        sheetStyle={shared.sheet}
      >
        <Text style={shared.sheetTitle}>Status</Text>
        <Text style={shared.sheetSubtitle}>
          Choose how visible you are on the mesh.
        </Text>
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
                  accessibilityLabel={`Set status to ${meta.label}`}
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

      {/* Appearance modal: light / dark / system default */}
      <BottomSheet
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        sheetStyle={shared.sheet}
      >
        <Text style={shared.sheetTitle}>Appearance</Text>

        <Text style={styles.appearanceGroupLabel}>THEME</Text>
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
                  accessibilityLabel={`Set appearance to ${meta.label}`}
                >
                  <View style={styles.optionIconGrouped}>
                    <Feather
                      name={meta.icon}
                      size={18}
                      color={Colors.textSecondary}
                    />
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

        {/* Font: keep the sheet open on select so the change is visible live
                (the mono bits behind it update instantly) and easy to compare. */}
        <Text style={styles.appearanceGroupLabel}>FONT</Text>
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
                  accessibilityLabel={`Set monospace font to ${meta.label}`}
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
                      style={[shared.optionLabel, { fontFamily: meta.family }]}
                    >
                      {meta.label}
                    </Text>
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

      {/* Transfer sheet: a preview, not a flow. It states what a move will
          carry and how it will run, so the shape of the feature is settled
          before anything is behind it. There is nothing to start yet, so the
          only action is dismissing it. */}
      <BottomSheet
        visible={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        sheetStyle={shared.sheet}
      >
        <View style={shared.sheetIconWrap}>
          <Feather name="smartphone" size={22} color={Colors.textSecondary} />
        </View>
        <Text style={shared.sheetTitle}>Transfer to a new phone</Text>
        <Text style={shared.sheetSubtitle}>
          Hold both phones together and move everything across over Bluetooth.
          Nothing passes through a server, so it works with no internet.
        </Text>
        <View style={[shared.settingsGroup, styles.appearanceGroup]}>
          {TRANSFER_ITEMS.map((item, i) => (
            <React.Fragment key={item.label}>
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
                  <Text style={shared.optionLabel}>{item.label}</Text>
                  <Text style={shared.optionDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>
        <Text style={styles.transferNote}>
          Coming in a future update. When it ships, the old phone clears itself
          once the move finishes, so one identity only ever lives on one device.
        </Text>
        <View style={shared.sheetActions}>
          <Pressable
            style={shared.sheetBtnPrimary}
            onPress={() => setShowTransferModal(false)}
            accessibilityRole="button"
            accessibilityLabel="Got it"
          >
            <Text style={shared.sheetBtnTextPrimary}>Got it</Text>
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
        <Text style={shared.sheetTitle}>Panic wipe</Text>
        <Text style={shared.sheetSubtitle}>
          This will instantly destroy all your keys, messages, and wallet
          proofs. This cannot be undone.
        </Text>
        <View style={styles.wipeActions}>
          <Pressable
            style={styles.wipeConfirmBtn}
            onPress={() => void handleConfirmWipe()}
            accessibilityRole="button"
            accessibilityLabel="Wipe now"
          >
            <Text style={styles.wipeConfirmText}>Wipe now</Text>
          </Pressable>
          <Pressable
            style={styles.wipeCancelBtn}
            onPress={() => setShowWipeModal(false)}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.wipeCancelText}>Cancel</Text>
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
      right: 2,
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
    // Small group header inside the Appearance sheet ("THEME" / "FONT").
    appearanceGroupLabel: {
      alignSelf: "stretch",
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
      color: Colors.textMuted,
      letterSpacing: 0.8,
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
      marginLeft: Spacing.xs,
    },
    // Footnote under the transfer list: quieter than sheetSubtitle, since it
    // qualifies what was just described rather than introducing it.
    transferNote: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      textAlign: "center",
      lineHeight: FontSize.xs * 1.5,
      paddingHorizontal: Spacing.xs,
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
      marginLeft: Spacing.xs,
    },
    // Danger zone, uses settingsGroup box for consistency with other sections
    dangerGroup: {
      borderColor: "rgba(220,38,38,0.2)",
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
