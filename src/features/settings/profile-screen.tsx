// Profile and settings screen.
// Identity, security controls, network settings, and danger zone.
// Triple-tap the logo triggers panic wipe per the spec.

import Feather from "@expo/vector-icons/Feather";
import React, { useRef, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Avatar from "../../ui/components/avatar";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../ui/theme";
import { panicWipe } from "../../utils/panic-wipe";

interface Props {
  peerID: string;
  username: string;
}

export default function ProfileScreen({
  peerID,
  username,
}: Props): React.JSX.Element {
  const [torEnabled, setTorEnabled] = useState(false);
  const logoTapCount = useRef(0);
  const logoTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
              "All keys and data have been destroyed. Restart the app to generate a new identity.",
            );
          },
        },
      ],
    );
  }

  const shortPubKey =
    peerID.slice(0, 8) + "\u2009\u00b7\u2009" + peerID.slice(8);

  async function handleSharePeerID(): Promise<void> {
    await Share.share({ message: peerID });
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
        <View style={styles.qrContainer}>
          <QRCode
            value={peerID}
            size={48}
            color={Colors.textPrimary}
            backgroundColor={Colors.surfaceRaised}
          />
        </View>
      </Pressable>
      <Text style={styles.tripleHint}>Triple-tap card for panic wipe</Text>

      {/* Share peer ID */}
      <Pressable
        style={styles.shareRow}
        onPress={() => void handleSharePeerID()}
        accessibilityRole="button"
        accessibilityLabel="Share your Peer ID"
      >
        <Feather name="share-2" size={14} color={Colors.textSecondary} />
        <Text style={styles.shareRowText}>Share Peer ID</Text>
      </Pressable>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.settingsGroup}>
          <SettingRow
            label="Tor routing"
            description="Route Nostr traffic through Tor"
            control={
              <Switch
                value={torEnabled}
                onValueChange={setTorEnabled}
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
            accessibilityRole="button"
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
            accessibilityRole="button"
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
              void Linking.openURL("upi://pay?pa=areebahmed0709@okaxis")
            }
            accessibilityRole="button"
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

      {/* Danger zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.danger }]}>
          Danger
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.dangerButton,
            pressed && styles.dangerButtonPressed,
          ]}
          onPress={confirmPanicWipe}
          accessibilityRole="button"
          accessibilityLabel="Trigger panic wipe"
        >
          <Text style={styles.dangerButtonText}>Panic wipe</Text>
          <Text style={styles.dangerButtonSubtext}>
            Instantly destroy all keys, messages, and proofs
          </Text>
        </Pressable>
      </View>
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
  shareRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  shareRowText: {
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
  // Danger zone
  dangerButton: {
    backgroundColor: Colors.dangerDim,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    gap: Spacing.xs,
  },
  dangerButtonPressed: {
    opacity: 0.8,
  },
  dangerButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.danger,
  },
  dangerButtonSubtext: {
    fontSize: FontSize.sm,
    color: Colors.danger,
    opacity: 0.7,
  },
});
