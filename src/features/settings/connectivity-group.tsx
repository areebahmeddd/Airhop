// The connectivity toggles: live voice, Tor, the internet gateway, and the
// mesh bridge. These sat inside Privacy & Security, one drill-in away, which
// buried the four switches people actually reach for. They live on the settings
// hub itself, so the whole group is one scroll from opening Settings.
//
// It stays its own component rather than being inlined into the hub: the Tor
// toggle owns an async start, all four toggles share a confirm sheet, and none
// of that belongs in a screen whose job is navigation.
//
// Every one of the four confirms in both directions, through the same sheet.
// Before, live voice and Tor flipped silently while the gateway and the bridge
// asked once and then went quiet, so the same gesture on four adjacent rows
// did three different things. Each of these changes what your phone does with
// other people's radios, data, or voices, and the direction you are moving in
// is exactly what the sheet spells out: what turning it on costs, or what you
// lose by turning it off.

import { useT, type TranslationKey } from "@i18n";
import { requestLocationPermission } from "@services/location-service";
import { getMeshService } from "@services/mesh-service";
import { useMeshStateStore } from "@store/mesh-state-store";
import { useSettingsStore } from "@store/settings-store";
import BottomSheet from "@ui/components/bottom-sheet";
import { HIT_SLOP, useThemeColors } from "@ui/theme";
import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import {
  GroupDivider,
  SettingLinkRow,
  SettingRow,
  SettingSwitch,
  useSharedStyles,
} from "./settings-primitives";

type ToggleKey = "liveVoice" | "background" | "gateway" | "bridge";

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
  background: {
    on: {
      title: "settings.conn.background_on_title",
      body: "settings.conn.background_on_body",
      action: "settings.conn.turn_on",
    },
    off: {
      title: "settings.conn.background_off_title",
      body: "settings.conn.background_off_body",
      action: "settings.conn.turn_off",
    },
  },
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

interface Props {
  onOpenTor: () => void;
}

export default function ConnectivityGroup({
  onOpenTor,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const T = useT();
  const torEnabled = useSettingsStore((s) => s.torEnabled);
  const liveVoiceEnabled = useSettingsStore((s) => s.liveVoiceEnabled);
  const setLiveVoiceEnabled = useSettingsStore((s) => s.setLiveVoiceEnabled);
  const backgroundMeshEnabled = useSettingsStore(
    (s) => s.backgroundMeshEnabled,
  );
  const setBackgroundMeshEnabled = useSettingsStore(
    (s) => s.setBackgroundMeshEnabled,
  );
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
  const bridgeMode = useSettingsStore((s) => s.torBridgeMode);

  // Off, or on and how it reaches the network. The bridge is worth naming here:
  // it is the difference between hiding the traffic and hiding that there is
  // any, and a user who chose one wants to see it held.
  function torSummary(): string {
    if (!torEnabled) return T("common.off");
    switch (bridgeMode) {
      case "snowflake":
        return T("settings.tor.mode_snowflake");
      case "obfs4":
        return T("settings.tor.mode_obfs4");
      case "custom":
        return T("settings.tor.mode_custom");
      case "off":
        return T("common.on");
    }
  }
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
      case "background":
        setBackgroundMeshEnabled(next);
        break;
      case "gateway":
        setGatewayEnabled(next);
        break;
      case "bridge":
        setBridgeEnabled(next);
        break;
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
        {/* First, because it is the widest switch in the group: everything
            below decides how the mesh behaves, this one decides whether it is
            running at all once the app is closed.

            Android only. The switch drives `setBackgroundServiceEnabled`,
            which starts or stops the foreground service holding the process up;
            on iOS that call is a declared no-op, because background BLE there
            comes from the `bluetooth-central` mode, a build-time entitlement no
            runtime call can withdraw.

            Hidden rather than reworded, and rather than faked by suspending the
            radios on background: CoreBluetooth relaunches the app on a BLE
            event through the restoration identifier, so a suspend is undone by
            the platform at the moment it matters. A control that cannot be
            honoured is worse than an absent one on the screen where people
            decide what their phone does for other people. */}
        {Platform.OS === "android" && (
          <>
            <SettingRow
              icon="power"
              label={T("settings.conn.background")}
              description={T("settings.conn.background_desc")}
              control={
                <SettingSwitch
                  value={backgroundMeshEnabled}
                  onValueChange={(v) => requestToggle("background", v)}
                />
              }
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
        {/* Last of the switches, and the only one that buys the phone holding
            it nothing: it spends your data and battery so another phone can
            reach the channels. "cast" rather than "radio", which the hub's own
            Network & Relays row already wears. */}
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
        <GroupDivider />
        {/* Closes the group, below the switches rather than among them: it is
            the one row that drills in, and Tor qualifies how everything above
            reaches the internet rather than being another thing to turn on.
            The value keeps the answer visible without opening the screen. */}
        <SettingLinkRow
          icon="globe"
          label={T("settings.conn.tor")}
          description={T("settings.conn.tor_desc")}
          control={<Text style={styles.settingValue}>{torSummary()}</Text>}
          onPress={onOpenTor}
        />
        {/* iOS only, a platform limit rather than a policy: Tor there wraps
            the Nostr socket alone, so a mint request would bypass it and hand
            the mint this device's IP. Refused unless opted in. Android proxies
            every socket, so it has nothing to opt into. */}
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
              style={({ pressed }) => [
                styles.sheetBtnPrimary,
                pressed && styles.sheetBtnPrimaryPressed,
              ]}
              onPress={applyPending}
              accessibilityRole="button"
              accessibilityLabel={copy.action}
            >
              <Text style={styles.sheetBtnTextPrimary}>{copy.action}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.sheetBtn,
                pressed && styles.sheetBtnPressed,
              ]}
              onPress={() => setConfirmVisible(false)}
              accessibilityRole="button"
              accessibilityLabel={T("common.cancel")}
            >
              <Text style={styles.sheetBtnText}>{T("common.cancel")}</Text>
            </Pressable>
          </View>
        </BottomSheet>
      )}
    </View>
  );
}
