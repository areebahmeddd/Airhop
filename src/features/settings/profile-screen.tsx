// Profile and settings screen.
// Identity, security controls, network settings, and danger zone.
// Triple-tap the logo triggers panic wipe per the spec.

import Feather from "@expo/vector-icons/Feather";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  NativeEventEmitter,
  NativeModules,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import QRCode from "react-native-qrcode-svg";
import NativeAirhopTor from "../../bridge/NativeAirhopTor";
import Avatar from "../../ui/components/avatar";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../ui/theme";
import { panicWipe } from "../../utils/panic-wipe";

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
  const [torEnabled, setTorEnabled] = useState(false);
  const [torStarting, setTorStarting] = useState(false);
  const [torProgress, setTorProgress] = useState(0);
  const [torSummary, setTorSummary] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [idCopied, setIdCopied] = useState(false);
  const idCopiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [nfcSupported, setNfcSupported] = useState(false);
  const [isNfcWriting, setIsNfcWriting] = useState(false);
  const logoTapCount = useRef(0);
  const logoTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subscribe to Tor bootstrap events (iOS only; NativeAirhopTor is null on Android).
  useEffect(() => {
    if (!NativeAirhopTor || !NativeModules.AirhopTorModule) return;
    const emitter = new NativeEventEmitter(NativeModules.AirhopTorModule);
    const sub = emitter.addListener(
      "TorStatusChanged",
      (event: {
        isReady: boolean;
        isStarting: boolean;
        progress: number;
        bootstrapSummary: string;
      }) => {
        setTorProgress(event.progress);
        setTorSummary(event.bootstrapSummary);
        if (event.isReady) {
          setTorEnabled(true);
          setTorStarting(false);
        }
        if (!event.isStarting && !event.isReady) {
          // Tor has stopped or failed outside of our control.
          setTorEnabled(false);
          setTorStarting(false);
          setTorProgress(0);
          setTorSummary("");
        }
      },
    );
    return () => sub.remove();
  }, []);

  // Triple-tap on the identity card triggers panic wipe.
  function handleLogoTap(): void {
    logoTapCount.current += 1;

    if (logoTapTimer.current) clearTimeout(logoTapTimer.current);
    logoTapTimer.current = setTimeout(() => {
      logoTapCount.current = 0;
    }, 1200);

    if (logoTapCount.current >= 3) {
      logoTapCount.current = 0;
      if (logoTapTimer.current) clearTimeout(logoTapTimer.current);
      confirmPanicWipe();
    }
  }

  function confirmPanicWipe(): void {
    Alert.alert(
      "Panic wipe",
      "This will instantly destroy all your keys, messages, and wallet proofs. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Wipe now",
          style: "destructive",
          onPress: async () => {
            await panicWipe();
            Alert.alert(
              "Wiped",
              "All keys and data have been destroyed. Tap OK to set up a new identity.",
              [{ text: "OK", onPress: () => onWipe?.() }],
            );
          },
        },
      ],
    );
  }

  const shortPubKey =
    peerID.slice(0, 8) + "\u2009\u00b7\u2009" + peerID.slice(8);

  // Check NFC support each time the QR modal opens.
  useEffect(() => {
    if (!showQRModal) return;
    NfcManager.isSupported()
      .then(setNfcSupported)
      .catch(() => {});
  }, [showQRModal]);

  async function handleCopyID(): Promise<void> {
    await Clipboard.setStringAsync(peerID);
    if (idCopiedTimer.current) clearTimeout(idCopiedTimer.current);
    setIdCopied(true);
    idCopiedTimer.current = setTimeout(() => setIdCopied(false), 2000);
  }

  async function handleSharePeerID(): Promise<void> {
    await Share.share({ message: peerID });
  }

  async function handleWriteNfc(): Promise<void> {
    setIsNfcWriting(true);
    try {
      await NfcManager.start();
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([
        Ndef.uriRecord(`airhop://peer/${peerID}`),
      ]);
      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        Alert.alert(
          "NFC tag written",
          "Your Peer ID is now on the NFC tag. Anyone who scans it will be prompted to add you as a contact.",
        );
      }
    } catch {
      Alert.alert(
        "Write failed",
        "Could not write to the NFC tag. Make sure it is writable and held close to your phone.",
      );
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
      setIsNfcWriting(false);
    }
  }

  async function handleShareQR(): Promise<void> {
    // Share a deep-link URL that any Airhop / bitchat-compatible app can open.
    await Share.share({
      message: `airhop://peer/${peerID}`,
      title: "Scan to add me on Airhop",
    });
  }

  // Wire the Tor toggle to the native AirhopTorModule.
  // On Android NativeAirhopTor is null; Orbot detection is done natively.
  async function handleTorToggle(value: boolean): Promise<void> {
    if (!NativeAirhopTor) {
      // Android: Tor routing goes through Orbot (SOCKS5 on port 9050).
      // The app cannot start Orbot itself; the user must install and enable it.
      if (value) {
        Alert.alert(
          "Tor on Android",
          "Airhop routes Tor traffic through Orbot. Install and enable Orbot from the Play Store, then turn this on.",
          [
            {
              text: "Get Orbot",
              onPress: () =>
                void Linking.openURL(
                  "https://play.google.com/store/apps/details?id=org.torproject.android",
                ),
            },
            { text: "Later", style: "cancel" },
          ],
        );
        // Keep the switch off until the user comes back with Orbot running.
        return;
      }
      setTorEnabled(false);
      return;
    }
    try {
      setTorStarting(true);
      if (value) {
        await NativeAirhopTor.startTor();
        // Block until Tor has fully bootstrapped (SOCKS5 ready) or times out.
        const ready = await NativeAirhopTor.awaitTorReady(60);
        if (ready) {
          setTorEnabled(true);
          setTorProgress(100);
        } else {
          await NativeAirhopTor.stopTor().catch(() => {});
          setTorEnabled(false);
          setTorProgress(0);
          setTorSummary("");
          Alert.alert(
            "Tor",
            "Could not connect through Tor within 60 seconds. Check your network connection and try again.",
          );
        }
      } else {
        await NativeAirhopTor.stopTor();
        setTorEnabled(false);
        setTorProgress(0);
        setTorSummary("");
      }
    } catch {
      Alert.alert(
        "Tor",
        value
          ? "Could not start Tor. Ensure the app has network access."
          : "Could not stop Tor.",
      );
      setTorEnabled(false);
    } finally {
      setTorStarting(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Identity card: triple-tap triggers panic wipe */}
      <Pressable
        style={styles.identityCard}
        onPress={handleLogoTap}
        accessibilityRole="button"
        accessibilityLabel="Your identity card"
        accessibilityHint="Triple-tap to trigger panic wipe"
      >
        <Avatar username={username} peerID={peerID} size={72} />
        <View style={styles.identityInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.peerIDLabel}>Peer ID</Text>
          <Text style={styles.peerID}>{shortPubKey}</Text>
        </View>
        {/* Tap QR to open the full-screen QR modal */}
        <Pressable
          style={styles.qrContainer}
          onPress={() => setShowQRModal(true)}
          accessibilityRole="button"
          accessibilityLabel="View full-size QR code"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <QRCode
            value={peerID}
            size={48}
            color={Colors.textPrimary}
            backgroundColor={Colors.surfaceRaised}
          />
        </Pressable>
      </Pressable>
      <Text style={styles.tripleHint}>Triple-tap card for panic wipe</Text>

      {/* Share action pills: side by side below the identity card */}
      <View style={styles.sharePills}>
        <Pressable
          style={styles.sharePill}
          onPress={() => void handleSharePeerID()}
          accessibilityRole="button"
          accessibilityLabel="Share your Peer ID"
        >
          <Feather name="share-2" size={13} color={Colors.textSecondary} />
          <Text style={styles.sharePillText}>Share ID</Text>
        </Pressable>
        <Pressable
          style={styles.sharePill}
          onPress={() => setShowQRModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Share QR code"
        >
          <Feather name="share-2" size={13} color={Colors.textSecondary} />
          <Text style={styles.sharePillText}>Share QR</Text>
        </Pressable>
      </View>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            label="Tor routing"
            description={
              Platform.OS === "android"
                ? "Requires Orbot \u00b7 Install from the Play Store"
                : torEnabled && !torStarting
                  ? "Active \u00b7 Nostr traffic routed via Tor"
                  : torStarting
                    ? torProgress > 0
                      ? `Connecting\u2026 ${torProgress}%${torSummary ? ` \u00b7 ${torSummary}` : ""}`
                      : "Starting Tor\u2026"
                    : "Route Nostr traffic through Tor for enhanced privacy"
            }
            control={
              <Switch
                value={torEnabled}
                onValueChange={(v) => void handleTorToggle(v)}
                disabled={torStarting}
                trackColor={{
                  false: Colors.surfaceRaised,
                  true: Colors.online,
                }}
                thumbColor={Colors.surface}
              />
            }
          />
          <View style={styles.groupDivider} />
          <SettingRow
            label="Forward secrecy"
            description="Double Ratchet is always on for DMs"
            control={<Text style={styles.alwaysOn}>Always on</Text>}
          />
          <View style={styles.groupDivider} />
          <SettingRow
            label="Signed packets"
            description="Every packet is Ed25519-signed"
            control={<Text style={styles.alwaysOn}>Always on</Text>}
          />
        </View>
      </View>

      {/* Network */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            label="Nostr bridge"
            description="Fall back to Nostr relays when mesh peers are out of range"
            control={<Text style={styles.alwaysOn}>Auto</Text>}
          />
          <View style={styles.groupDivider} />
          <SettingRow
            label="Geo-relay discovery"
            description="350+ distributed relays, auto-selected by location"
            control={<Text style={styles.alwaysOn}>Auto</Text>}
          />
          <View style={styles.groupDivider} />
          <SettingRow
            label="bitchat compatibility"
            description="BLE Service UUID F47B5E2D-... unchanged"
            control={<Text style={styles.alwaysOn}>Always on</Text>}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
          <View style={styles.groupDivider} />
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Protocol</Text>
            <Text style={styles.settingValue}>bitchat v2</Text>
          </View>
          <View style={styles.groupDivider} />
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>License</Text>
            <Text style={styles.settingValue}>MIT</Text>
          </View>
        </View>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.settingsGroup}>
          <Pressable
            style={styles.settingRow}
            onPress={() => void Linking.openURL("mailto:hi@areeb.dev")}
            accessibilityRole="link"
            accessibilityLabel="Email hi@areeb.dev"
          >
            <View style={styles.settingLabelGroup}>
              <Text style={styles.settingLabel}>Get help</Text>
              <Text style={styles.settingDescription}>hi@areeb.dev</Text>
            </View>
            <Feather name="mail" size={16} color={Colors.textMuted} />
          </Pressable>
          <View style={styles.groupDivider} />
          <Pressable
            style={styles.settingRow}
            onPress={() => void Linking.openURL("https://airhop.1mindlabs.org")}
            accessibilityRole="link"
            accessibilityLabel="Open airhop.1mindlabs.org"
          >
            <View style={styles.settingLabelGroup}>
              <Text style={styles.settingLabel}>Website</Text>
              <Text style={styles.settingDescription}>
                airhop.1mindlabs.org
              </Text>
            </View>
            <Feather name="external-link" size={16} color={Colors.textMuted} />
          </Pressable>
        </View>
      </View>

      {/* Donate */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Donate</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelGroup}>
              <Text style={styles.settingLabel}>Bitcoin</Text>
              <Text style={styles.settingDescription}>Coming soon</Text>
            </View>
            <Feather name="dollar-sign" size={16} color={Colors.textMuted} />
          </View>
          <View style={styles.groupDivider} />
          <View style={styles.settingRow}>
            <View style={styles.settingLabelGroup}>
              <Text style={styles.settingLabel}>Ecash</Text>
              <Text style={styles.settingDescription}>Coming soon</Text>
            </View>
            <Feather name="zap" size={16} color={Colors.textMuted} />
          </View>
          <View style={styles.groupDivider} />
          <Pressable
            style={styles.settingRow}
            onPress={() =>
              void Linking.openURL(
                "upi://pay?pa=areebahmed0709@okaxis&pn=Areeb",
              )
            }
            accessibilityRole="link"
            accessibilityLabel="Pay via UPI"
          >
            <View style={styles.settingLabelGroup}>
              <Text style={styles.settingLabel}>UPI</Text>
              <Text style={styles.settingDescription}>
                areebahmed0709@okaxis
              </Text>
            </View>
            <Feather name="credit-card" size={16} color={Colors.textMuted} />
          </Pressable>
        </View>
      </View>

      {/* Danger zone, same settingsGroup box pattern as other sections */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.danger }]}>
          Danger
        </Text>
        <View style={[styles.settingsGroup, styles.dangerGroup]}>
          <Pressable
            style={({ pressed }) => [
              styles.dangerRow,
              pressed && styles.dangerRowPressed,
            ]}
            onPress={confirmPanicWipe}
            accessibilityRole="button"
            accessibilityLabel="Trigger panic wipe"
          >
            {/* Inner View owns the row layout. Pressable does not reliably
                propagate flexDirection on all RN versions. */}
            <View style={styles.dangerRowInner}>
              <View style={styles.dangerIconWrap}>
                <Feather
                  name="alert-triangle"
                  size={16}
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

      {/* QR code modal: bottom sheet with large QR, peerID, and share actions */}
      <Modal
        visible={showQRModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQRModal(false)}
      >
        <Pressable
          style={styles.qrOverlay}
          onPress={() => setShowQRModal(false)}
        >
          <View style={styles.qrSheet}>
            <View style={styles.qrSheetHandle} />
            <Text style={styles.qrSheetTitle}>Your QR Code</Text>
            <Text style={styles.qrSheetSubtitle}>
              Share this code to let anyone on Airhop or bitchat add you as a
              contact.
            </Text>
            <View style={styles.qrLarge}>
              <QRCode
                value={peerID}
                size={200}
                color={Colors.textPrimary}
                backgroundColor={Colors.surface}
              />
            </View>
            <Text style={styles.qrSheetPeerID}>{peerID}</Text>
            <View style={styles.qrSheetActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.qrSheetBtn,
                  pressed && styles.qrSheetBtnPressed,
                ]}
                onPress={() => void handleCopyID()}
                accessibilityRole="button"
                accessibilityLabel="Copy Peer ID to clipboard"
              >
                <Feather
                  name={idCopied ? "check" : "copy"}
                  size={15}
                  color={idCopied ? Colors.online : Colors.textPrimary}
                />
                <Text style={styles.qrSheetBtnText}>
                  {idCopied ? "Copied!" : "Copy ID"}
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.qrSheetBtn,
                  styles.qrSheetBtnPrimary,
                  pressed && styles.qrSheetBtnPressed,
                ]}
                onPress={() => void handleShareQR()}
                accessibilityRole="button"
                accessibilityLabel="Share QR code"
              >
                <Feather name="share-2" size={15} color={Colors.textInverse} />
                <Text style={styles.qrSheetBtnTextPrimary}>Share QR</Text>
              </Pressable>
            </View>
            {/* NFC tag write: shown only on NFC-capable devices */}
            {nfcSupported && (
              <Pressable
                style={({ pressed }) => [
                  styles.qrSheetNfcBtn,
                  (pressed || isNfcWriting) && { opacity: 0.7 },
                ]}
                onPress={() => void handleWriteNfc()}
                disabled={isNfcWriting}
                accessibilityRole="button"
                accessibilityLabel="Write Peer ID to NFC tag"
              >
                <Feather name="wifi" size={15} color={Colors.textSecondary} />
                <Text style={styles.qrSheetBtnText}>
                  {isNfcWriting ? "Hold phone near tag…" : "Write NFC Tag"}
                </Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

// Reusable settings row
interface SettingRowProps {
  label: string;
  description?: string;
  control: React.ReactNode;
}

function SettingRow({
  label,
  description,
  control,
}: SettingRowProps): React.JSX.Element {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLabelGroup}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description ? (
          <Text style={styles.settingDescription}>{description}</Text>
        ) : null}
      </View>
      <View style={styles.settingControl}>{control}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing["3xl"],
  },
  // Identity card
  identityCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.base,
  },
  identityInfo: {
    flex: 1,
    gap: 3,
  },
  username: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
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
  qrContainer: {
    width: 60,
    height: 60,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tripleHint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: "center",
    letterSpacing: 0.3,
    marginTop: -Spacing.xs,
  },
  // Two pill buttons below the identity card
  sharePills: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  sharePill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sharePillText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  // Sections
  section: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: Spacing.xs,
  },
  settingsGroup: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  groupDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: Spacing.base,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  settingLabelGroup: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  settingDescription: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: FontSize.xs * 1.5,
  },
  settingValue: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontFamily: "monospace",
  },
  settingControl: {
    flexShrink: 0,
  },
  alwaysOn: {
    fontSize: FontSize.sm,
    color: Colors.online,
    fontWeight: FontWeight.medium,
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
  dangerRowPressed: {
    backgroundColor: Colors.dangerDim,
  },
  dangerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dangerDim,
    borderWidth: 1,
    borderColor: "rgba(220,38,38,0.2)",
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
  // QR code modal
  qrOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end",
  },
  qrSheet: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius["2xl"],
    borderTopRightRadius: Radius["2xl"],
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing["2xl"],
    alignItems: "center",
    gap: Spacing.md,
  },
  qrSheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderStrong,
    alignSelf: "center",
    marginBottom: Spacing.xs,
  },
  qrSheetTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  qrSheetSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: FontSize.sm * 1.5,
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
  qrSheetActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    width: "100%",
    marginTop: Spacing.xs,
  },
  qrSheetBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceRaised,
  },
  qrSheetBtnPrimary: {
    backgroundColor: Colors.accent,
    borderColor: "transparent",
  },
  qrSheetBtnPressed: {
    opacity: 0.8,
  },
  qrSheetBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  qrSheetBtnTextPrimary: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textInverse,
  },
  qrSheetNfcBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceRaised,
    width: "100%",
  },
});
