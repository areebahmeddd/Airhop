// Tor sub-screen: whether internet traffic is onion routed, and how it reaches
// the network.
//
// A screen rather than the switch it replaced. Tor now carries a second choice
// that only matters once it is on, and a row that both toggles and drills in is
// two controls in one place. The row on the hub shows the current state, so the
// answer is still visible without opening this.
//
// The confirm sheet on the toggle stays. Turning Tor on is a real change in what
// this device tells the network about itself, and the connectivity group asks
// before every one of those.

import Feather from "@expo/vector-icons/Feather";
import { useT } from "@i18n";
import {
  setTorBridgeMode,
  setTorRouting,
  type TorRoutingResult,
} from "@services/tor-routing";
import { showAlert } from "@store/alert-store";
import { useMeshStateStore } from "@store/mesh-state-store";
import { useSettingsStore, type TorBridgeMode } from "@store/settings-store";
import BottomSheet from "@ui/components/bottom-sheet";
import { FontFamily, HIT_SLOP, MIN_TOUCH, useThemeColors } from "@ui/theme";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import {
  GroupDivider,
  SettingRow,
  SettingSwitch,
  SettingsScroll,
  SubHeader,
  useSharedStyles,
} from "../settings-primitives";

interface Props {
  onBack: () => void;
}

// Ordered by how likely each is to work, not by speed.
//
// Off first because it is the default and right on an uncensored network.
// Snowflake above obfs4 because it needs no bridge list, so it cannot be
// enumerated and cannot go stale; obfs4 is faster but its lines are public.
// Custom last: the answer when the built-in ones have been blocked.
const MODES: {
  // Null is a transport the app carries but does not offer yet.
  value: TorBridgeMode | null;
  labelKey: Parameters<ReturnType<typeof useT>>[0];
  descriptionKey: Parameters<ReturnType<typeof useT>>[0];
}[] = [
  {
    value: "off",
    labelKey: "settings.tor.mode_off",
    descriptionKey: "settings.tor.mode_off_desc",
  },
  {
    value: "snowflake",
    labelKey: "settings.tor.mode_snowflake",
    descriptionKey: "settings.tor.mode_snowflake_desc",
  },
  {
    value: "obfs4",
    labelKey: "settings.tor.mode_obfs4",
    descriptionKey: "settings.tor.mode_obfs4_desc",
  },
  {
    value: null,
    labelKey: "settings.tor.mode_webtunnel",
    descriptionKey: "settings.tor.mode_webtunnel_desc",
  },
  {
    value: "custom",
    labelKey: "settings.tor.mode_custom",
    descriptionKey: "settings.tor.mode_custom_desc",
  },
];

export default function TorScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const T = useT();

  const torEnabled = useSettingsStore((s) => s.torEnabled);
  const bridgeMode = useSettingsStore((s) => s.torBridgeMode);
  const storedLines = useSettingsStore((s) => s.torBridgeLines);
  const internetEnabled = useSettingsStore((s) => s.internetEnabled);
  const torBootstrap = useMeshStateStore((s) => s.torBootstrap);
  const torActive = useMeshStateStore((s) => s.torActive);
  // A start marker still set with Tor off is one that never answered: startup
  // turned Tor off and left this for the screen to explain.
  const startPending = useSettingsStore((s) => s.torStartPending);
  const recovered = startPending && !torEnabled;

  // Cleared on the way out, not on the way in, so the notice survives being read
  // once and does not greet every later visit. Read fresh rather than captured:
  // leaving mid-start would otherwise clear a marker that is still doing its job.
  useEffect(() => {
    return () => {
      const settings = useSettingsStore.getState();
      if (settings.torStartPending && !settings.torEnabled) {
        settings.setTorStartPending(false);
      }
    };
  }, []);

  // Local until applied, so a half-typed bridge line never reaches the client.
  const [draftLines, setDraftLines] = useState(storedLines);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  // Which direction the sheet is asking about. Held rather than derived, so the
  // sheet keeps its words while it slides away.
  const [pendingOn, setPendingOn] = useState(false);

  // What the client is doing, said plainly. `torActive` is the only flag that
  // may claim traffic is onion routed, so nothing else here implies it.
  function statusText(): string {
    // Ahead of the ordinary states: this one the user did not choose, and a
    // bare "Off" would leave them to work that out for themselves.
    if (recovered) return T("settings.tor.recovered");
    if (!torEnabled) return T("common.off");
    // Chosen but not yet usable. setTorBridgeMode leaves the running client
    // alone when the selected mode has no lines, so saying "routed" here would
    // credit the selection for a circuit the previous mode is carrying.
    if (bridgeMode === "custom" && storedLines.trim() === "") {
      return T("settings.tor.custom_empty");
    }
    if (torActive) return T("mesh.banner.tor");
    if (torBootstrap === "blocked") return T("mesh.banner.tor_blocked");
    return T("mesh.banner.tor_starting");
  }

  // One message per outcome, and none of them is "try again": a bootstrap that
  // ran out its deadline may still land, and the status row carries that.
  function report(result: TorRoutingResult): void {
    if (result.ok) return;
    showAlert(
      T("settings.conn.tor_short"),
      result.reason === "unavailable"
        ? T("settings.conn.tor_unavailable")
        : result.reason === "timeout"
          ? T("settings.conn.tor_timeout")
          : result.reason === "no-bridges"
            ? T("settings.tor.custom_empty")
            : T("settings.conn.tor_failed"),
    );
  }

  // Guards the client against overlapping starts. React state settles a render
  // later, which a double tap beats, so the flag has to be readable now.
  async function run(action: () => Promise<TorRoutingResult>): Promise<void> {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      report(await action());
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  function handleToggle(next: boolean): void {
    setPendingOn(next);
    setConfirmVisible(true);
  }

  // Changing this while Tor runs restarts the client, because bridges are fixed
  // when it is built. The status row says so while it happens rather than
  // pretending the switch was instant.
  function chooseMode(mode: TorBridgeMode): void {
    if (mode === bridgeMode) return;
    void run(() =>
      setTorBridgeMode(mode, mode === "custom" ? draftLines : undefined),
    );
  }

  const hasUnappliedLines = draftLines.trim() !== storedLines.trim();

  // Only when the text actually moved. Blurring an untouched field would
  // otherwise drop the circuit and rebuild it for nothing.
  function applyCustomLines(): void {
    if (!hasUnappliedLines) return;
    void run(() => setTorBridgeMode("custom", draftLines));
  }

  const confirmAction = pendingOn
    ? T("settings.conn.turn_on")
    : T("settings.conn.turn_off");

  return (
    <View style={styles.container}>
      <SubHeader title={T("settings.conn.tor")} onBack={onBack} />
      <SettingsScroll>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {T("settings.conn.tor_short")}
          </Text>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="shield"
              label={T("settings.conn.tor")}
              description={T("settings.conn.tor_desc")}
              control={
                <SettingSwitch
                  value={torEnabled}
                  onValueChange={handleToggle}
                  disabled={busy || !internetEnabled}
                />
              }
            />
            <GroupDivider />
            <SettingRow
              icon="activity"
              label={T("settings.tor.status")}
              description={statusText()}
            />
          </View>
        </View>

        {/* Only once Tor is on: a connection choice with nothing to connect is
            a control that cannot do anything. */}
        {torEnabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {T("settings.tor.connection")}
            </Text>
            <View style={styles.optionGroup}>
              {MODES.map((mode, i) => {
                const value = mode.value;
                const selected = value !== null && value === bridgeMode;
                const disabled = busy || value === null;
                return (
                  <React.Fragment key={mode.labelKey}>
                    {i > 0 && <GroupDivider />}
                    <Pressable
                      style={({ pressed }) => [
                        styles.optionRowGrouped,
                        selected && styles.optionRowGroupedSelected,
                        pressed && styles.rowPressed,
                      ]}
                      onPress={() => value !== null && chooseMode(value)}
                      disabled={disabled}
                      hitSlop={HIT_SLOP}
                      accessibilityRole="button"
                      accessibilityState={{ selected, disabled }}
                      accessibilityLabel={T(mode.labelKey)}
                    >
                      <View style={styles.optionText}>
                        <Text style={styles.optionLabel}>
                          {T(mode.labelKey)}
                        </Text>
                        <Text style={styles.optionDescription}>
                          {T(mode.descriptionKey)}
                        </Text>
                      </View>
                      {selected && (
                        <Feather
                          name="check"
                          size={18}
                          color={Colors.textPrimary}
                        />
                      )}
                      {value === null && (
                        <Text style={styles.comingSoon}>
                          {T("settings.coming_soon")}
                        </Text>
                      )}
                    </Pressable>
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        )}

        {torEnabled && bridgeMode === "custom" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {T("settings.tor.mode_custom")}
            </Text>
            <View style={styles.settingsGroup}>
              <View style={styles.settingRow}>
                <TextInput
                  style={[
                    styles.settingLabel,
                    {
                      flex: 1,
                      minHeight: MIN_TOUCH,
                      paddingVertical: 0,
                      fontFamily: FontFamily.mono,
                    },
                  ]}
                  value={draftLines}
                  onChangeText={setDraftLines}
                  onBlur={applyCustomLines}
                  placeholder={T("settings.tor.custom_placeholder")}
                  placeholderTextColor={Colors.textSecondary}
                  multiline
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel={T("settings.tor.mode_custom")}
                />
              </View>
            </View>
            {hasUnappliedLines && (
              <Text style={styles.settingDescription}>
                {T("settings.tor.custom_apply_hint")}
              </Text>
            )}
          </View>
        )}
      </SettingsScroll>

      <BottomSheet
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        sheetStyle={styles.sheet}
      >
        <Text style={styles.sheetTitle}>
          {pendingOn
            ? T("settings.conn.tor_on_title")
            : T("settings.conn.tor_off_title")}
        </Text>
        <Text style={styles.sheetSubtitle}>
          {pendingOn
            ? T("settings.conn.tor_on_body")
            : T("settings.conn.tor_off_body")}
        </Text>
        <View style={styles.sheetActions}>
          <Pressable
            style={({ pressed }) => [
              styles.sheetBtnPrimary,
              pressed && styles.sheetBtnPrimaryPressed,
            ]}
            onPress={() => {
              setConfirmVisible(false);
              void run(() => setTorRouting(pendingOn));
            }}
            accessibilityRole="button"
            accessibilityLabel={confirmAction}
          >
            <Text style={styles.sheetBtnTextPrimary}>{confirmAction}</Text>
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
    </View>
  );
}
