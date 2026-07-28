// Privacy & Security sub-screen: Tor routing (with the Orbot install modal
// on Android), and the always-on Double Ratchet / packet-signing guarantees.

import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { setTorRouting } from "../../../core/nostr/tor-routing";
import { requestLocationPermission } from "../../../services/location-service";
import { showAlert } from "../../../store/alert-store";
import { useBlockedStore } from "../../../store/blocked-store";
import { useMeshStateStore } from "../../../store/mesh-state-store";
import { useSettingsStore } from "../../../store/settings-store";
import BottomSheet from "../../../ui/components/bottom-sheet";
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
  const liveVoiceEnabled = useSettingsStore((s) => s.liveVoiceEnabled);
  const setLiveVoiceEnabled = useSettingsStore((s) => s.setLiveVoiceEnabled);
  const gatewayEnabled = useSettingsStore((s) => s.gatewayEnabled);
  const setGatewayEnabled = useSettingsStore((s) => s.setGatewayEnabled);
  const bridgeEnabled = useSettingsStore((s) => s.bridgeEnabled);
  const setBridgeEnabled = useSettingsStore((s) => s.setBridgeEnabled);
  const bridgeConsented = useSettingsStore((s) => s.bridgeConsented);
  const setBridgeConsented = useSettingsStore((s) => s.setBridgeConsented);
  // All three connectivity toggles need the internet; disabled while it is off.
  const internetEnabled = useSettingsStore((s) => s.internetEnabled);
  // The bridge needs a location fix to find its neighborhood cell; surface a
  // hint when it is on but location is denied.
  const locationGranted = useMeshStateStore((s) => s.locationGranted);
  const allowMintOverClearnet = useSettingsStore(
    (s) => s.allowMintOverClearnet,
  );
  const setAllowMintOverClearnet = useSettingsStore(
    (s) => s.setAllowMintOverClearnet,
  );
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

  // First time the bridge is turned on, confirm the one privacy-relevant fact:
  // it makes your public messages leave Bluetooth range. After that, it toggles
  // silently. Turning it off never prompts.
  function handleBridgeToggle(value: boolean): void {
    if (!value || bridgeConsented) {
      setBridgeEnabled(value);
      return;
    }
    showAlert(
      "Turn on the mesh bridge?",
      "Your public #bluetooth messages will be published to your neighborhood over the internet, so people beyond Bluetooth range can read them. Private messages are never bridged, and 'nearby only' keeps any single message local.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Turn on",
          onPress: () => {
            setBridgeConsented(true);
            setBridgeEnabled(true);
          },
        },
      ],
    );
  }

  async function grantLocation(): Promise<void> {
    const granted = await requestLocationPermission();
    useMeshStateStore.getState().setLocationGranted(granted);
  }

  return (
    <View style={styles.container}>
      <SubHeader title="Privacy & Security" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* The connectivity toggles (Tor, gateway, bridge), grouped apart from
            the always-on guarantees below. All three ride the internet, so they
            are disabled while Internet fallback is off (a note explains where). */}
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            {!internetEnabled && (
              <>
                <SettingRow
                  icon="wifi-off"
                  label="Internet is off"
                  description="Tor, the gateway, and the bridge all use the internet. Turn on Internet fallback under Network to use them."
                />
                <GroupDivider />
              </>
            )}
            {/* Above the internet toggles because it is not one of them: live
                voice never leaves Bluetooth, so it stays available when
                everything below is greyed out. It sits here rather than under
                Storage because what it really controls is whether a microphone
                opens and whether a stranger's voice comes out of your phone,
                which is a privacy decision before it is a media one. */}
            <SettingRow
              icon="mic"
              label="Live voice"
              description="Walkie-talkie over Bluetooth: hold the mic and people in range hear you as you speak. Off records a voice note instead"
              control={
                <SettingSwitch
                  value={liveVoiceEnabled}
                  onValueChange={setLiveVoiceEnabled}
                />
              }
            />
            <GroupDivider />
            <SettingRow
              icon="globe"
              label="Tor routing"
              // Standard description regardless of on/off; the switch and the Mesh
              // banner communicate state.
              description="Route Nostr traffic through Tor for extra privacy"
              control={
                <SettingSwitch
                  value={torEnabled}
                  onValueChange={(v) => void handleTorToggle(v)}
                  disabled={torStarting || !internetEnabled}
                />
              }
            />
            {/* Only meaningful on iOS. Arti is a per-socket SOCKS shim that we
                wire into the Nostr WebSocket, so a Cashu mint request (plain
                fetch) would bypass Tor entirely and hand the mint this device's
                IP alongside the proofs being swapped. Rather than leak
                silently, mint calls are refused while Tor is on unless the user
                opts in here. Android needs no such switch: Orbot's VPN captures
                every socket, so mint traffic is already covered. */}
            {Platform.OS === "ios" && torEnabled && (
              <>
                <GroupDivider />
                <SettingRow
                  icon="alert-triangle"
                  label="Allow mint traffic over clear net"
                  description="Tor on iOS only covers Nostr. Leave off to block mint requests; ecash over the mesh keeps working either way."
                  control={
                    <SettingSwitch
                      value={allowMintOverClearnet}
                      onValueChange={setAllowMintOverClearnet}
                    />
                  }
                />
              </>
            )}
            <GroupDivider />
            <SettingRow
              icon="radio"
              label="Internet gateway"
              description="Lend your connection to a nearby offline phone so it can still reach the location channels. Uses your data and battery."
              control={
                <SettingSwitch
                  value={gatewayEnabled}
                  onValueChange={setGatewayEnabled}
                  disabled={!internetEnabled}
                />
              }
            />
            <GroupDivider />
            <SettingRow
              icon="git-merge"
              label="Mesh bridge"
              description="Link this area's public #bluetooth chat with another out-of-range Bluetooth crowd over the internet."
              control={
                <SettingSwitch
                  value={bridgeEnabled}
                  onValueChange={handleBridgeToggle}
                  disabled={!internetEnabled}
                />
              }
            />
            {/* The bridge derives its neighborhood cell from a location fix, so
                without permission it stays inert. Offer a one-tap grant rather
                than leaving it silently doing nothing. */}
            {bridgeEnabled && !locationGranted && (
              <>
                <GroupDivider />
                <SettingRow
                  icon="alert-triangle"
                  label="Mesh bridge needs location"
                  description="It finds your neighborhood from a location fix. Grant location to start bridging."
                  control={
                    <Pressable
                      onPress={() => void grantLocation()}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityRole="button"
                      accessibilityLabel="Grant location permission"
                    >
                      <Text
                        style={[styles.settingValue, { color: Colors.accent }]}
                      >
                        Grant
                      </Text>
                    </Pressable>
                  }
                />
              </>
            )}
          </View>
        </View>

        {/* Always-on guarantees: not choices, just what is true of every
            message. Shown as a locked-on switch so it reads as "on and not
            changeable" rather than plain text. */}
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="repeat"
              label="Forward secrecy"
              description="Double Ratchet is always on for DMs"
              control={<SettingSwitch value={true} disabled />}
            />
            <GroupDivider />
            <SettingRow
              icon="check-circle"
              label="Signed packets"
              description="Every packet is Ed25519-signed"
              control={<SettingSwitch value={true} disabled />}
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
      <BottomSheet
        visible={showOrbotModal}
        onClose={() => setShowOrbotModal(false)}
        sheetStyle={styles.sheet}
      >
        <View style={styles.sheetIconWrap}>
          <Feather name="globe" size={22} color={Colors.textSecondary} />
        </View>
        <Text style={styles.sheetTitle}>Tor on Android</Text>
        <Text style={styles.sheetSubtitle}>
          Airhop routes Tor traffic through Orbot. Install and enable Orbot from
          the Play Store, then turn this on.
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
      </BottomSheet>
    </View>
  );
}
