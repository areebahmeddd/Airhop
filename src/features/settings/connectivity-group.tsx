// The connectivity toggles: live voice, Tor, the internet gateway, and the
// mesh bridge. These sat inside Privacy & Security, one drill-in away, which
// buried the four switches people actually reach for. They live on the
// settings hub itself now, in the box the feature list used to occupy, so the
// whole group is one scroll from opening Settings.
//
// It stays its own component rather than being inlined into the hub: the Tor
// toggle owns an async start and an Orbot install sheet, all four toggles
// share a confirm sheet, and none of that belongs in a screen whose job is
// navigation.
//
// Every one of the four confirms in both directions, through the same sheet.
// Before, live voice and Tor flipped silently while the gateway and the bridge
// asked once and then went quiet, so the same gesture on four adjacent rows
// did three different things. Each of these changes what your phone does with
// other people's radios, data, or voices, and the direction you are moving in
// is exactly what the sheet spells out: what turning it on costs, or what you
// lose by turning it off.

import React, { useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { setTorRouting } from "../../core/nostr/tor-routing";
import { requestLocationPermission } from "../../services/location-service";
import { showAlert } from "../../store/alert-store";
import { useMeshStateStore } from "../../store/mesh-state-store";
import { useSettingsStore } from "../../store/settings-store";
import BottomSheet from "../../ui/components/bottom-sheet";
import { HIT_SLOP, useThemeColors } from "../../ui/theme";
import {
  GroupDivider,
  SettingRow,
  SettingSwitch,
  useSharedStyles,
} from "./shared";

type ToggleKey = "liveVoice" | "tor" | "gateway" | "bridge";

interface ConfirmCopy {
  title: string;
  body: string;
  action: string;
}

// One entry per switch per direction. Written as the consequence of the tap
// rather than a restatement of the row: the row already says what the feature
// is, and somebody holding their thumb over a switch is asking what happens
// next, not what it is called.
const CONFIRM: Record<ToggleKey, { on: ConfirmCopy; off: ConfirmCopy }> = {
  liveVoice: {
    on: {
      title: "Turn on live voice?",
      body: "Holding the mic sends your voice to everyone in Bluetooth range as you speak, and their voice plays on your phone. Nothing is recorded.",
      action: "Turn on",
    },
    off: {
      title: "Turn off live voice?",
      body: "Holding the mic records a voice note instead. It sends when you let go, and nobody hears it until they play it.",
      action: "Turn off",
    },
  },
  tor: {
    on: {
      title: "Route Nostr traffic through Tor?",
      body: "Relays stop seeing your IP address. Connecting takes longer and messages arrive slower. Bluetooth is unaffected.",
      action: "Turn on",
    },
    off: {
      title: "Turn off Tor routing?",
      body: "Nostr traffic goes back over your ordinary connection, so relays see your IP address again. Bluetooth is unaffected either way.",
      action: "Turn off",
    },
  },
  gateway: {
    on: {
      title: "Turn on the internet gateway?",
      body: "Nearby phones with no connection of their own will send and receive location-channel messages through yours. It uses your mobile data and battery, and their messages stay encrypted end to end, so you cannot read what passes through.",
      action: "Turn on",
    },
    off: {
      title: "Turn off the internet gateway?",
      body: "Nearby offline phones stop reaching the location channels through yours. Your own messages are unaffected.",
      action: "Turn off",
    },
  },
  bridge: {
    on: {
      title: "Turn on the mesh bridge?",
      body: "Your public #bluetooth messages will be published to your neighborhood over the internet, so people beyond Bluetooth range can read them. Private messages are never bridged, and 'nearby only' keeps any single message local.",
      action: "Turn on",
    },
    off: {
      title: "Turn off the mesh bridge?",
      body: "Your public #bluetooth messages stay in Bluetooth range again, and messages from the bridged crowd stop arriving here.",
      action: "Turn off",
    },
  },
};

// Which switch was tapped and where it was headed. Held until the confirm is
// answered; the switches themselves keep showing the persisted value, so a
// cancelled confirm needs nothing undone.
interface Pending {
  key: ToggleKey;
  next: boolean;
}

export default function ConnectivityGroup(): React.JSX.Element {
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
  // All but live voice need the internet; disabled while it is off.
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
  // What the sheet is asking about, and whether it is up. Two pieces of state
  // rather than one nullable: the sheet slides out over ~200ms, and it still
  // has to draw its own words on the way down. `pending` is therefore never
  // cleared, only replaced by the next tap.
  const [pending, setPending] = useState<Pending | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  function requestToggle(key: ToggleKey, next: boolean): void {
    setPending({ key, next });
    setConfirmVisible(true);
  }

  function applyPending(): void {
    if (pending === null) return;
    const { key, next } = pending;
    setConfirmVisible(false);
    switch (key) {
      case "liveVoice":
        setLiveVoiceEnabled(next);
        break;
      case "tor":
        void handleTorToggle(next);
        break;
      case "gateway":
        setGatewayEnabled(next);
        break;
      case "bridge":
        setBridgeEnabled(next);
        break;
    }
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

  async function grantLocation(): Promise<void> {
    const granted = await requestLocationPermission();
    useMeshStateStore.getState().setLocationGranted(granted);
  }

  const copy =
    pending === null ? null : CONFIRM[pending.key][pending.next ? "on" : "off"];

  return (
    <View style={styles.section}>
      {/* All but live voice ride the internet, so they are disabled while
          Internet fallback is off (a note explains where). */}
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
            everything below is greyed out. */}
        <SettingRow
          icon="mic"
          label="Live voice"
          description="Walkie-talkie over Bluetooth: hold the mic and people in range hear you as you speak."
          control={
            <SettingSwitch
              value={liveVoiceEnabled}
              onValueChange={(v) => requestToggle("liveVoice", v)}
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
              onValueChange={(v) => requestToggle("tor", v)}
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
            every socket, so mint traffic is already covered.

            No confirm sheet on this one: it only appears while Tor is on, it
            is a qualifier on the row above rather than a feature of its own,
            and its description already states both sides. */}
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
          icon="git-merge"
          label="Mesh bridge"
          description="Link this area's public #bluetooth chat with another out-of-range Bluetooth crowd over the internet."
          control={
            <SettingSwitch
              value={bridgeEnabled}
              onValueChange={(v) => requestToggle("bridge", v)}
              disabled={!internetEnabled}
            />
          }
        />
        {/* The bridge derives its neighborhood cell from a location fix, so
            without permission it stays inert. Offer a one-tap grant rather
            than leaving it silently doing nothing. Stays directly under the
            bridge row, wherever that row sits. */}
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
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel="Grant location permission"
                >
                  <Text style={[styles.settingValue, { color: Colors.accent }]}>
                    Grant
                  </Text>
                </Pressable>
              }
            />
          </>
        )}
        <GroupDivider />
        {/* Last in the box: the only row whose switch buys nothing for the
            phone holding it, since the gateway spends your data and battery so
            somebody else's phone can reach the channels.

            "cast", not "radio": the hub's own Network & Relays row is a radio
            tower, and two rows a thumb apart wearing the same glyph read as the
            same subject. A gateway is a phone handing its connection to another
            phone beside it, which is what cast draws. */}
        <SettingRow
          icon="cast"
          label="Internet gateway"
          description="Lend your connection to a nearby offline phone so it can still reach the location channels."
          control={
            <SettingSwitch
              value={gatewayEnabled}
              onValueChange={(v) => requestToggle("gateway", v)}
              disabled={!internetEnabled}
            />
          }
        />
      </View>

      {/* The one confirm sheet, shared by all four switches in both
          directions: same layout, same button order, only the words change.
          Left-aligned like the app's other explain-then-act sheets. */}
      {copy !== null && (
        <BottomSheet
          visible={confirmVisible}
          onClose={() => setConfirmVisible(false)}
          sheetStyle={[styles.sheet, localStyles.sheetLeft]}
        >
          <Text style={[styles.sheetTitle, localStyles.textLeft]}>
            {copy.title}
          </Text>
          <Text style={[styles.sheetSubtitle, localStyles.textLeft]}>
            {copy.body}
          </Text>
          <View style={styles.sheetActions}>
            <Pressable
              style={styles.sheetBtnPrimary}
              onPress={applyPending}
              accessibilityRole="button"
              accessibilityLabel={copy.action}
            >
              <Text style={styles.sheetBtnTextPrimary}>{copy.action}</Text>
            </Pressable>
            <Pressable
              style={styles.sheetBtn}
              onPress={() => setConfirmVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={styles.sheetBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </BottomSheet>
      )}

      {/* Orbot modal: shown when enabling Tor on Android finds no Orbot. Same
          shape as the confirm sheet above, so the whole group speaks one way. */}
      <BottomSheet
        visible={showOrbotModal}
        onClose={() => setShowOrbotModal(false)}
        sheetStyle={[styles.sheet, localStyles.sheetLeft]}
      >
        <Text style={[styles.sheetTitle, localStyles.textLeft]}>
          Tor on Android
        </Text>
        <Text style={[styles.sheetSubtitle, localStyles.textLeft]}>
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

// The shared sheet body centers its children, which suits a QR code or a
// one-line confirm. These sheets are a short explanation followed by an action,
// so they read left-aligned like the app's other explain-then-act sheets.
const localStyles = StyleSheet.create({
  sheetLeft: {
    alignItems: "stretch",
  },
  textLeft: {
    textAlign: "left",
  },
});
