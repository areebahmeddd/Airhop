// Privacy & Security sub-screen: Tor routing (with the Orbot install modal
// on Android), and the always-on Double Ratchet / packet-signing guarantees.

import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { setTorRouting } from "../../../core/nostr/tor-routing";
import { showAlert } from "../../../store/alert-store";
import { useBlockedStore } from "../../../store/blocked-store";
import { useSettingsStore } from "../../../store/settings-store";
import { useThemeColors } from "../../../ui/theme";
import { resolveDisplayName } from "../../../utils/display-name";
import {
  GroupDivider,
  SettingRow,
  SettingSwitch,
  SubHeader,
  useSharedStyles,
} from "../shared";

interface Props {
  onBack: () => void;
}

export default function SecurityScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  // The switch reflects the persisted preference (user intent), which
  // setTorRouting owns. torStarting only disables the switch while a toggle is
  // in flight, so it can't be double-tapped mid-operation.
  const torEnabled = useSettingsStore((s) => s.torEnabled);
  const gatewayEnabled = useSettingsStore((s) => s.gatewayEnabled);
  const setGatewayEnabled = useSettingsStore((s) => s.setGatewayEnabled);
  const [torStarting, setTorStarting] = useState(false);
  const [showOrbotModal, setShowOrbotModal] = useState(false);
  // Subscribe to the array itself (not the isBlocked function, whose identity
  // never changes) so the list re-renders when a block is added or removed.
  const blockedPeerIDs = useBlockedStore((s) => s.blockedPeerIDs);

  function confirmUnblock(peerID: string): void {
    showAlert(
      "Unblock this peer",
      `${resolveDisplayName(peerID)} will be able to message you again and will reappear on the Mesh tab when nearby.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblock",
          onPress: () => {
            useBlockedStore.getState().unblockPeer(peerID);
          },
        },
      ],
    );
  }

  function handleGetOrbot(): void {
    setShowOrbotModal(false);
    void Linking.openURL(
      "https://play.google.com/store/apps/details?id=org.torproject.android",
    );
  }

  // Route the Tor toggle through tor-routing.setTorRouting, the single place
  // that starts/stops Arti (iOS), swaps nostr-tools' WebSocket for the Tor
  // socket, persists the preference, and rebuilds the Nostr transport. The
  // switch itself is driven by the persisted preference, so it always reflects
  // the real routing state rather than a copy that can drift.
  async function handleTorToggle(value: boolean): Promise<void> {
    // Android routes through Orbot's VPN, which the app cannot start. setTorRouting
    // verifies Orbot is installed and a VPN is up before enabling; if it isn't, we
    // surface the install guide (orbot-missing) or a "start Orbot" hint
    // (orbot-inactive) from the result below rather than assuming it worked.
    try {
      setTorStarting(true);
      const result = await setTorRouting(value);
      if (value && !result.ok) {
        if (result.reason === "orbot-missing") {
          // Orbot isn't installed, so nothing can route. Re-open the install
          // guide rather than a dead-end alert.
          setShowOrbotModal(true);
        } else {
          showAlert(
            "Tor",
            result.reason === "orbot-inactive"
              ? "Orbot is installed but not connected. Open Orbot, start its VPN, then turn this on."
              : result.reason === "unavailable"
                ? "Tor routing is not available in this build."
                : result.reason === "timeout"
                  ? "Could not connect through Tor within 60 seconds. Check your network connection and try again."
                  : "Could not start Tor. Ensure the app has network access.",
          );
        }
      }
    } finally {
      setTorStarting(false);
    }
  }

  return (
    <View style={styles.container}>
      <SubHeader title="Privacy & Security" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="globe"
              label="Tor routing"
              // Standard description regardless of on/off; the switch and the Mesh
              // banner communicate state.
              description={
                Platform.OS === "android"
                  ? "Requires Orbot · Install from the Play Store"
                  : "Route Nostr traffic through Tor for enhanced privacy"
              }
              control={
                <SettingSwitch
                  value={torEnabled}
                  onValueChange={(v) => void handleTorToggle(v)}
                  disabled={torStarting}
                />
              }
            />
            <GroupDivider />
            <SettingRow
              icon="radio"
              label="Internet gateway"
              // Standard description regardless of on/off; the switch shows state.
              description="Relay nearby offline peers' location messages to the internet. Uses your data and battery."
              control={
                <SettingSwitch
                  value={gatewayEnabled}
                  onValueChange={setGatewayEnabled}
                />
              }
            />
            <GroupDivider />
            <SettingRow
              icon="repeat"
              label="Forward secrecy"
              description="Double Ratchet is always on for DMs"
              control={<Text style={styles.alwaysOn}>Always on</Text>}
            />
            <GroupDivider />
            <SettingRow
              icon="check-circle"
              label="Signed packets"
              description="Every packet is Ed25519-signed"
              control={<Text style={styles.alwaysOn}>Always on</Text>}
            />
          </View>
        </View>

        {/* Blocked peers. Blocking was previously a one-way door: the only
            entry point was a DM info sheet, and nothing anywhere called
            unblockPeer, so short of a full panic wipe a block could never be
            undone. */}
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            {blockedPeerIDs.length === 0 ? (
              <SettingRow
                icon="slash"
                label="No blocked peers"
                description="Blocked peers can't message you or appear on the Mesh tab"
              />
            ) : (
              blockedPeerIDs.map((peerID, index) => (
                <React.Fragment key={peerID}>
                  {index > 0 && <GroupDivider />}
                  <SettingRow
                    icon="slash"
                    label={resolveDisplayName(peerID)}
                    description={peerID}
                    control={
                      <Pressable
                        onPress={() => confirmUnblock(peerID)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel={`Unblock ${resolveDisplayName(peerID)}`}
                      >
                        <Text
                          style={[
                            styles.settingValue,
                            { color: Colors.accent },
                          ]}
                        >
                          Unblock
                        </Text>
                      </Pressable>
                    }
                  />
                </React.Fragment>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Orbot modal: bottom sheet shown when enabling Tor on Android */}
      <Modal
        visible={showOrbotModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOrbotModal(false)}
      >
        <View style={styles.sheetOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowOrbotModal(false)}
          />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetIconWrap}>
              <Feather name="globe" size={22} color={Colors.textSecondary} />
            </View>
            <Text style={styles.sheetTitle}>Tor on Android</Text>
            <Text style={styles.sheetSubtitle}>
              Airhop routes Tor traffic through Orbot. Install and enable Orbot
              from the Play Store, then turn this on.
            </Text>
            <View style={styles.sheetActions}>
              <Pressable
                style={styles.sheetBtnPrimary}
                onPress={handleGetOrbot}
                accessibilityRole="button"
                accessibilityLabel="Get Orbot"
              >
                <Text style={styles.sheetBtnTextPrimary}>Get Orbot</Text>
              </Pressable>
              <Pressable
                style={styles.sheetBtn}
                onPress={() => setShowOrbotModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Later"
              >
                <Text style={styles.sheetBtnText}>Later</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
