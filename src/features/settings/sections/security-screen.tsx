// Privacy & Security sub-screen: Tor routing (with the Orbot install modal
// on Android), and the always-on Double Ratchet / packet-signing guarantees.

import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useState } from "react";
import {
  Linking,
  Modal,
  NativeEventEmitter,
  NativeModules,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NativeAirhopTor from "../../../bridge/NativeAirhopTor";
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
  const [torEnabled, setTorEnabled] = useState(false);
  const gatewayEnabled = useSettingsStore((s) => s.gatewayEnabled);
  const setGatewayEnabled = useSettingsStore((s) => s.setGatewayEnabled);
  const [torStarting, setTorStarting] = useState(false);
  const [torProgress, setTorProgress] = useState(0);
  const [torSummary, setTorSummary] = useState("");
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

  function handleGetOrbot(): void {
    setShowOrbotModal(false);
    void Linking.openURL(
      "https://play.google.com/store/apps/details?id=org.torproject.android",
    );
  }

  // Wire the Tor toggle to the native AirhopTorModule.
  // On Android NativeAirhopTor is null; Orbot detection is done natively.
  async function handleTorToggle(value: boolean): Promise<void> {
    if (!NativeAirhopTor) {
      // Android: Tor routing goes through Orbot (SOCKS5 on port 9050).
      // The app cannot start Orbot itself; the user must install and enable it.
      if (value) {
        setShowOrbotModal(true);
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
          showAlert(
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
      showAlert(
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
              description={
                Platform.OS === "android"
                  ? "Requires Orbot · Install from the Play Store"
                  : torEnabled && !torStarting
                    ? "Active · Nostr traffic routed via Tor"
                    : torStarting
                      ? torProgress > 0
                        ? `Connecting… ${torProgress}%${torSummary ? ` · ${torSummary}` : ""}`
                        : "Starting Tor…"
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
              description={
                gatewayEnabled
                  ? "On · Relaying nearby offline peers' location messages to the internet"
                  : "Relay nearby offline peers' location messages to the internet. Uses your data and battery."
              }
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
