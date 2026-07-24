// Profile and settings screen.
// Identity block + a WhatsApp-style nav list that drills into its own
// sub-screens (src/features/settings/sections/*). Panic wipe stays here,
// at the very bottom, outside every section.

import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { encodeQRContent } from "../../core/crypto/contact-exchange";
import { getMeshService } from "../../services/mesh-service";
import { showAlert } from "../../store/alert-store";
import {
  useSettingsStore,
  type ThemePreference,
} from "../../store/settings-store";
import Avatar from "../../ui/components/avatar";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { peerInviteLink } from "../../utils/deep-link";
import { panicWipe } from "../../utils/panic-wipe";
import AboutScreen from "./sections/about-screen";
import DonateScreen from "./sections/donate-screen";
import HelpScreen from "./sections/help-screen";
import LicensesScreen from "./sections/licenses-screen";
import NetworkScreen from "./sections/network-screen";
import PrivacyScreen from "./sections/privacy-screen";
import SecurityScreen from "./sections/security-screen";
import StorageScreen from "./sections/storage-screen";
import TermsScreen from "./sections/terms-screen";
import VersionScreen from "./sections/version-screen";
import {
  GroupDivider,
  SettingLinkRow,
  SettingRow,
  SettingSwitch,
  useSharedStyles,
} from "./shared";

// Presence on the mesh. Online broadcasts + scans, Away stops the mesh
// entirely, Invisible keeps scanning but stops advertising our presence.
type Status = "online" | "away" | "invisible";

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
    description: "Match your device's appearance setting",
    icon: "smartphone",
  },
};
const THEME_ORDER: ThemePreference[] = ["light", "dark", "system"];

// Payments has shipped, so it sits at the top of the features group with a
// real switch instead of a "Coming soon" tag. The switch alone carries the
// on/off state, since a status word beside it only restated what it shows.
// The rest aren't built yet: each one expands in place to explain what it
// will do, rather than linking out or staying silent about it.
type FeatureKey = "ai" | "feeds";

const FEATURES: {
  key: FeatureKey;
  label: string;
  // Unused for "ai": that row renders a robot glyph from
  // MaterialCommunityIcons instead, which Feather has no equivalent for.
  icon: keyof typeof Feather.glyphMap;
  description: string;
}[] = [
  {
    key: "ai",
    label: "AI",
    icon: "cpu",
    description: "Private on-device assistant, no network calls",
  },
  {
    key: "feeds",
    label: "Feeds",
    icon: "rss",
    description: "Read and post to Bluesky and Mastodon feeds",
  },
];

// Which sub-screen is currently pushed. "root" renders the hub itself.
type SettingsView =
  | "root"
  | "security"
  | "network"
  | "storage"
  | "help"
  | "terms"
  | "privacy"
  | "donate"
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
  const [status, setStatus] = useState<Status>("online");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showWipeModal, setShowWipeModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const paymentsEnabled = useSettingsStore((s) => s.paymentsEnabled);
  const setPaymentsEnabled = useSettingsStore((s) => s.setPaymentsEnabled);

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
    await panicWipe();
    setShowWipeModal(false);
    onWipe?.();
  }

  const shortPubKey = peerID.slice(0, 8) + " · " + peerID.slice(8);

  // Apply a presence change to the running mesh, then update the dot.
  function applyStatus(next: Status): void {
    const mesh = getMeshService();
    if (next === "online") {
      if (status === "away") mesh?.start(username);
      else if (status === "invisible") mesh?.setDiscoverable(true);
    } else if (next === "away") {
      mesh?.stop();
    } else if (next === "invisible") {
      if (status === "away") mesh?.start(username);
      mesh?.setDiscoverable(false);
    }
    setStatus(next);
  }

  function handleSelectStatus(next: Status): void {
    applyStatus(next);
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
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      showAlert(
        "Permission needed",
        "Grant photo library access in Settings to save the QR code.",
      );
      return;
    }
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

  if (view === "security") {
    return <SecurityScreen onBack={() => setView("root")} />;
  }
  if (view === "network") {
    return <NetworkScreen onBack={() => setView("root")} />;
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
  if (view === "donate") {
    return <DonateScreen onBack={() => setView("root")} />;
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
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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

      {/* Features. Payments is live, so it leads the group with a switch that
          shows or hides the Wallet tab. The rest aren't built yet: each row
          states what it will do and carries a "Coming soon" tag, the same
          shape as the live Payments row above it. */}
      <View style={shared.section}>
        <View style={shared.settingsGroup}>
          <SettingRow
            icon="credit-card"
            label="Wallet"
            description="Send Cashu ecash peer to peer over the mesh"
            control={
              <SettingSwitch
                value={paymentsEnabled}
                onValueChange={setPaymentsEnabled}
                accessibilityLabel="Enable payments"
              />
            }
          />
          {FEATURES.map((feature) => (
            <React.Fragment key={feature.key}>
              <GroupDivider />
              <SettingRow
                icon={feature.key === "ai" ? undefined : feature.icon}
                iconOverride={
                  feature.key === "ai" ? (
                    <MaterialCommunityIcons
                      name="robot-outline"
                      size={18}
                      color={Colors.textSecondary}
                    />
                  ) : undefined
                }
                label={feature.label}
                description={feature.description}
                control={<Text style={shared.comingSoon}>Coming soon</Text>}
              />
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Settings nav: each row drills into its own sub-screen */}
      <View style={shared.section}>
        <View style={shared.settingsGroup}>
          <SettingLinkRow
            icon="lock"
            label="Privacy & Security"
            description="Tor routing, Internet gateway, protocols"
            onPress={() => setView("security")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="radio"
            label="Network"
            description="Mesh relays, Nostr fallback, bitchat compatibility"
            onPress={() => setView("network")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="hard-drive"
            label="Storage & Data"
            description="Usage, cache, and media quality on this device"
            onPress={() => setView("storage")}
          />
          <GroupDivider />
          <SettingLinkRow
            icon="sliders"
            label="Appearance"
            description={THEME_META[theme].label}
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
            label="Donate"
            description="Support development directly"
            onPress={() => setView("donate")}
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

      {/* Danger zone, same settingsGroup box pattern as other sections */}
      <View style={shared.section}>
        <View style={[shared.settingsGroup, styles.dangerGroup]}>
          <Pressable
            style={styles.dangerRow}
            onPress={() => setShowWipeModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Trigger panic wipe"
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
      <Modal
        visible={showQRModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={shared.sheetOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowQRModal(false)}
          />
          <View style={shared.sheet}>
            <View style={shared.sheetHandle} />
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
          </View>
        </View>
      </Modal>

      {/* Status modal: bottom sheet, one selectable row per presence state */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={shared.sheetOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowStatusModal(false)}
          />
          <View style={shared.sheet}>
            <View style={shared.sheetHandle} />
            <Text style={shared.sheetTitle}>Status</Text>
            <Text style={shared.sheetSubtitle}>
              Choose how visible you are on the mesh.
            </Text>
            <View style={shared.optionList}>
              {STATUS_ORDER.map((key) => {
                const meta = STATUS_META[key];
                const selected = key === status;
                return (
                  <Pressable
                    key={key}
                    style={[
                      shared.optionRow,
                      selected && shared.optionRowSelected,
                    ]}
                    onPress={() => handleSelectStatus(key)}
                    accessibilityRole="button"
                    accessibilityLabel={`Set status to ${meta.label}`}
                  >
                    <View style={shared.optionRowInner}>
                      <View
                        style={[
                          shared.optionDot,
                          { backgroundColor: meta.color },
                        ]}
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
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* Appearance modal: light / dark / system default */}
      <Modal
        visible={showThemeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={shared.sheetOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowThemeModal(false)}
          />
          <View style={shared.sheet}>
            <View style={shared.sheetHandle} />
            <Text style={shared.sheetTitle}>Appearance</Text>
            <View style={shared.optionList}>
              {THEME_ORDER.map((key) => {
                const meta = THEME_META[key];
                const selected = key === theme;
                return (
                  <Pressable
                    key={key}
                    style={[
                      shared.optionRow,
                      selected && shared.optionRowSelected,
                    ]}
                    onPress={() => {
                      setTheme(key);
                      setShowThemeModal(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Set appearance to ${meta.label}`}
                  >
                    <View style={shared.optionRowInner}>
                      <View
                        style={[
                          shared.optionDot,
                          { backgroundColor: Colors.surface },
                        ]}
                      >
                        <Feather
                          name={meta.icon}
                          size={14}
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
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* Panic wipe modal: confirm, then wipe and drop straight to onboarding
          rather than making the user tap through a second "Wiped" screen. */}
      <Modal
        visible={showWipeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWipeModal(false)}
      >
        <View style={shared.sheetOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowWipeModal(false)}
          />
          <View style={shared.sheet}>
            <View style={shared.sheetHandle} />
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
          </View>
        </View>
      </Modal>
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
      paddingBottom: Spacing["3xl"],
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
      width: 18,
      height: 18,
      borderRadius: 9,
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
      fontFamily: "monospace",
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
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    qrSheetPeerID: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontFamily: "monospace",
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
