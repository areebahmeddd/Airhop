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
import { Linking, Platform, Pressable, Text, View } from "react-native";
import { setTorRouting } from "../../core/nostr/tor-routing";
import { useT, type TranslationKey } from "../../i18n";
import { requestLocationPermission } from "../../services/location-service";
import { getMeshService } from "../../services/mesh-service";
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

// Keys rather than text: this is a module constant, so it cannot call a hook,
// and building it once at module load would freeze the copy in whichever
// language the app started in. The component translates it on render.
interface ConfirmCopy {
  title: TranslationKey;
  body: TranslationKey;
  action: TranslationKey;
}

// One entry per switch per direction. Written as the consequence of the tap
// rather than a restatement of the row: the row already says what the feature
// is, and somebody holding their thumb over a switch is asking what happens
// next, not what it is called.
const CONFIRM: Record<ToggleKey, { on: ConfirmCopy; off: ConfirmCopy }> = {
  liveVoice: {
    on: {
      title: "settings.conn.live_voice_on_title",
      body: "settings.conn.live_voice_on_body",
      action: "settings.conn.turn_on",
    },
    off: {
      title: "settings.conn.live_voice_off_title",
      body: "settings.conn.live_voice_off_body",
      action: "settings.conn.turn_off",
    },
  },
  tor: {
    on: {
      title: "settings.conn.tor_on_title",
      body: "settings.conn.tor_on_body",
      action: "settings.conn.turn_on",
    },
    off: {
      title: "settings.conn.tor_off_title",
      body: "settings.conn.tor_off_body",
      action: "settings.conn.turn_off",
    },
  },
  gateway: {
    on: {
      title: "settings.conn.gateway_on_title",
      body: "settings.conn.gateway_on_body",
      action: "settings.conn.turn_on",
    },
    off: {
      title: "settings.conn.gateway_off_title",
      body: "settings.conn.gateway_off_body",
      action: "settings.conn.turn_off",
    },
  },
  bridge: {
    on: {
      title: "settings.conn.bridge_on_title",
      body: "settings.conn.bridge_on_body",
      action: "settings.conn.turn_on",
    },
    off: {
      title: "settings.conn.bridge_off_title",
      body: "settings.conn.bridge_off_body",
      action: "settings.conn.turn_off",
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
  const T = useT();
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
    // Android routes through Orbot's VPN, which the app cannot start.
    // setTorRouting probes Orbot's SOCKS port and requires a VPN transport
    // before enabling; if either is missing, we surface the install guide
    // (orbot-missing) or a "start Orbot" hint (orbot-inactive) from the result
    // below rather than assuming it worked.
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
            T("settings.conn.tor_short"),
            result.reason === "orbot-inactive"
              ? T("settings.conn.tor_orbot_idle")
              : result.reason === "unavailable"
                ? T("settings.conn.tor_unavailable")
                : result.reason === "timeout"
                  ? T("settings.conn.tor_timeout")
                  : T("settings.conn.tor_failed"),
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
    if (!granted) return;
    // Act on the grant, do not just record it.
    //
    // This row exists because the bridge needs a location cell, and recording
    // the grant without re-resolving anything left the bridge inert until a
    // pull-to-refresh or a relaunch: the user granted exactly what was asked for
    // and nothing happened. refreshGeoChannels re-resolves the cell, which is
    // also what the bridge reads.
    //
    // retryRadios matters on Android 11 and below, where the mesh's own
    // permission IS location, so this grant can unblock the radios too.
    getMeshService()?.refreshGeoChannels();
    getMeshService()?.retryRadios();
  }

  const confirm =
    pending === null ? null : CONFIRM[pending.key][pending.next ? "on" : "off"];
  const copy =
    confirm === null
      ? null
      : {
          title: T(confirm.title),
          body: T(confirm.body),
          action: T(confirm.action),
        };

  return (
    <View style={styles.section}>
      {/* All but live voice ride the internet, so they are disabled while
          Internet fallback is off (a note explains where). */}
      <View style={styles.settingsGroup}>
        {!internetEnabled && (
          <>
            <SettingRow
              icon="wifi-off"
              label={T("settings.conn.internet_off")}
              description={T("settings.conn.internet_off_desc")}
            />
            <GroupDivider />
          </>
        )}
        {/* Above the internet toggles because it is not one of them: live
            voice never leaves Bluetooth, so it stays available when
            everything below is greyed out. */}
        <SettingRow
          icon="mic"
          label={T("settings.conn.live_voice")}
          description={T("settings.conn.live_voice_desc")}
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
          label={T("settings.conn.tor")}
          // Standard description regardless of on/off; the switch and the Mesh
          // banner communicate state.
          description={T("settings.conn.tor_desc")}
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
              label={T("settings.conn.mint_clearnet")}
              description={T("settings.conn.mint_clearnet_desc")}
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
          label={T("settings.conn.bridge")}
          description={T("settings.conn.bridge_desc")}
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
              label={T("settings.conn.bridge_needs_location")}
              description={T("settings.conn.bridge_needs_location_desc")}
              control={
                <Pressable
                  onPress={() => void grantLocation()}
                  hitSlop={HIT_SLOP}
                  accessibilityRole="button"
                  accessibilityLabel={T("settings.conn.grant_location")}
                >
                  <Text style={[styles.settingValue, { color: Colors.accent }]}>
                    {T("settings.conn.grant_short")}
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
          label={T("settings.conn.gateway")}
          description={T("settings.conn.gateway_desc")}
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
          sheetStyle={styles.sheet}
        >
          <Text style={styles.sheetTitle}>{copy.title}</Text>
          <Text style={styles.sheetSubtitle}>{copy.body}</Text>
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
              accessibilityLabel={T("common.cancel")}
            >
              <Text style={styles.sheetBtnText}>{T("common.cancel")}</Text>
            </Pressable>
          </View>
        </BottomSheet>
      )}

      {/* Orbot modal: shown when enabling Tor on Android finds no Orbot. Same
          shape as the confirm sheet above, so the whole group speaks one way. */}
      <BottomSheet
        visible={showOrbotModal}
        onClose={() => setShowOrbotModal(false)}
        sheetStyle={styles.sheet}
      >
        <Text style={styles.sheetTitle}>{T("settings.conn.orbot_title")}</Text>
        <Text style={styles.sheetSubtitle}>
          {T("settings.conn.orbot_body")}
        </Text>
        <View style={styles.sheetActions}>
          <Pressable
            style={styles.sheetBtnPrimary}
            onPress={handleGetOrbot}
            accessibilityRole="button"
            accessibilityLabel={T("settings.conn.get_orbot")}
          >
            <Text style={styles.sheetBtnTextPrimary}>
              {T("settings.conn.get_orbot")}
            </Text>
          </Pressable>
          <Pressable
            style={styles.sheetBtn}
            onPress={() => setShowOrbotModal(false)}
            accessibilityRole="button"
            accessibilityLabel={T("settings.conn.later")}
          >
            <Text style={styles.sheetBtnText}>{T("settings.conn.later")}</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
}
