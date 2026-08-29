// Network sub-screen: the internet (Nostr) connectivity choices, the Wi-Fi
// Aware pairing that the same-platform fast path needs, and the always-on
// bitchat wire compatibility.

import {
  DEFAULT_DM_RELAYS,
  MAX_CUSTOM_RELAYS,
  relayDisplayHost,
  relayDisplayScheme,
  validateRelayUrl,
} from "@core/nostr/geo-relay";
import Feather from "@expo/vector-icons/Feather";
import { useT } from "@i18n";
import { getMeshService } from "@services/mesh-service";
import { presentWiFiPairing } from "@services/wifi-pairing-service";
import { showAlert } from "@store/alert-store";
import { useMeshStateStore } from "@store/mesh-state-store";
import { useSettingsStore } from "@store/settings-store";
import { HIT_SLOP, useThemeColors } from "@ui/theme";
import { formatNumber } from "@utils/format";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import {
  GroupDivider,
  SettingLinkRow,
  SettingRow,
  SettingSwitch,
  SubHeader,
  useSharedStyles,
} from "../settings-primitives";

interface Props {
  onBack: () => void;
}

// The three ways addCustomRelay declines a relay, so the screen can never report
// success for one the store dropped.
type RelayError = "invalid" | "duplicate" | "full";

export default function NetworkScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const T = useT();
  // False on Android, and on hardware or an iOS too old for the framework, so
  // the section is absent rather than showing a control that cannot work.
  const pairingSupported = useMeshStateStore((s) => s.wifiPairingSupported);
  const pairedCount = useMeshStateStore((s) => s.wifiPairedCount);
  const internetEnabled = useSettingsStore((s) => s.internetEnabled);
  const setInternetEnabled = useSettingsStore((s) => s.setInternetEnabled);
  const geoRelayDiscovery = useSettingsStore((s) => s.geoRelayDiscovery);
  const setGeoRelayDiscovery = useSettingsStore((s) => s.setGeoRelayDiscovery);
  const customRelays = useSettingsStore((s) => s.customRelays);
  const addCustomRelay = useSettingsStore((s) => s.addCustomRelay);
  const removeCustomRelay = useSettingsStore((s) => s.removeCustomRelay);

  const [relaysExpanded, setRelaysExpanded] = useState(false);
  const [dmRelaysExpanded, setDmRelaysExpanded] = useState(false);
  // Read the live pool where there is one, so this cannot quietly drift from
  // what the client actually opened; fall back to the constant it is built from
  // when the transport is down, which is still what messages would use.
  const dmRelays = getMeshService()?.getNostrClient()?.activeRelays ?? [
    ...DEFAULT_DM_RELAYS,
  ];
  const [relayInput, setRelayInput] = useState("");
  const [relayError, setRelayError] = useState<RelayError | null>(null);

  // Master internet switch: persist the preference AND build/tear down the Nostr
  // transport immediately so the change takes effect without a restart. Turning
  // it OFF disables a lot (relays, Tor, gateway, bridge), so confirm first;
  // turning it on is harmless and does not prompt. Cancelling leaves the switch
  // on, because it is driven by the persisted setting we never changed.
  function setInternet(value: boolean): void {
    setInternetEnabled(value);
    getMeshService()?.applyInternetEnabled(value);
  }
  function handleInternetToggle(value: boolean): void {
    if (value) {
      setInternet(true);
      return;
    }
    showAlert(
      T("settings.network.internet_off_title"),
      T("settings.network.internet_off_body"),
      [
        { text: T("common.cancel"), style: "cancel" },
        {
          text: T("settings.network.turn_off"),
          style: "destructive",
          onPress: () => setInternet(false),
        },
      ],
    );
  }

  function handleAddRelay(): void {
    const normalized = validateRelayUrl(relayInput);
    if (normalized === null) {
      setRelayError("invalid");
      return;
    }
    // The store ignores a repeat and a full list silently, so both are named
    // here or the add is a no-op that reads as success. Compared on the
    // canonical form, since "example.com" and "example.com:443" are one relay.
    if (customRelays.includes(normalized)) {
      setRelayError("duplicate");
      return;
    }
    if (customRelays.length >= MAX_CUSTOM_RELAYS) {
      setRelayError("full");
      return;
    }
    addCustomRelay(normalized);
    setRelayInput("");
    setRelayError(null);
  }

  function relayErrorMessage(reason: RelayError): string {
    if (reason === "duplicate") return T("settings.network.relay_duplicate");
    if (reason === "full") {
      return T("settings.network.relay_limit", { count: MAX_CUSTOM_RELAYS });
    }
    return T("settings.network.relay_invalid");
  }

  // Off needs at least one custom relay to fall back to (RELAY_SOURCE_INVARIANT,
  // which the store enforces), so block it with a nudge when the list is empty
  // and confirm the reach/interop trade-off when it is not. On never prompts.
  function handleGeoRelayToggle(value: boolean): void {
    if (value) {
      setGeoRelayDiscovery(true);
      return;
    }
    if (customRelays.length === 0) {
      setRelaysExpanded(true);
      showAlert(
        T("settings.network.discovery_needs_relay"),
        T("settings.network.discovery_needs_relay_body"),
        [{ text: T("common.ok"), style: "cancel" }],
      );
      return; // leave discovery on
    }
    showAlert(
      T("settings.network.custom_only_title"),
      T("settings.network.custom_only_body"),
      [
        { text: T("common.cancel"), style: "cancel" },
        {
          text: T("settings.network.turn_off"),
          style: "destructive",
          onPress: () => setGeoRelayDiscovery(false),
        },
      ],
    );
  }

  // Removing the last relay while discovery is off turns discovery back on in
  // the store (RELAY_SOURCE_INVARIANT). Say so, rather than let a switch the
  // user deliberately set change itself with no explanation.
  function handleRemoveRelay(url: string): void {
    const wasLast = !geoRelayDiscovery && customRelays.length === 1;
    removeCustomRelay(url);
    // A "list full" error is stale the moment a slot frees up.
    setRelayError(null);
    if (wasLast) {
      showAlert(
        T("settings.network.discovery_back_on"),
        T("settings.network.discovery_back_on_body"),
        [{ text: T("common.ok"), style: "cancel" }],
      );
    }
  }

  return (
    <View style={styles.container}>
      <SubHeader title={T("settings.section.network")} onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="cloud"
              label={T("settings.network.internet")}
              description={T("settings.network.internet_desc")}
              control={
                <SettingSwitch
                  value={internetEnabled}
                  onValueChange={handleInternetToggle}
                />
              }
            />
            <GroupDivider />
            <SettingRow
              icon="map-pin"
              label={T("settings.network.discovery")}
              description={T("settings.network.discovery_desc")}
              control={
                <SettingSwitch
                  value={geoRelayDiscovery}
                  onValueChange={handleGeoRelayToggle}
                  disabled={!internetEnabled}
                />
              }
            />
            <GroupDivider />
            {/* Custom relays: an expandable sub-section. Collapsed by default so
                the common user never sees it; power users open it to pin their
                own relays (used alongside discovery, or alone when it is off). */}
            <Pressable
              style={styles.settingRow}
              onPress={() => setRelaysExpanded((v) => !v)}
              disabled={!internetEnabled}
              accessibilityRole="button"
              accessibilityState={{ expanded: relaysExpanded }}
              accessibilityLabel={T("settings.network.custom")}
            >
              <View style={styles.settingIcon}>
                <Feather name="server" size={18} color={Colors.textSecondary} />
              </View>
              <View style={styles.settingLabelGroup}>
                <Text style={styles.settingLabel}>
                  {T("settings.network.custom")}
                </Text>
                <Text style={styles.settingDescription}>
                  {customRelays.length === 0
                    ? T("settings.network.custom_desc")
                    : T("settings.network.custom_added", {
                        count: customRelays.length,
                        max: MAX_CUSTOM_RELAYS,
                      })}
                </Text>
              </View>
              <Feather
                name={relaysExpanded ? "chevron-up" : "chevron-down"}
                size={18}
                color={internetEnabled ? Colors.textMuted : Colors.borderStrong}
              />
            </Pressable>
            {/* Kept in the order the user added them, not sorted. This is their
                own list, and re-ordering someone's entries under them is
                surprising in a way that re-ordering a built-in set is not. */}
            {relaysExpanded && internetEnabled && (
              <>
                {customRelays.map((url) => (
                  <React.Fragment key={url}>
                    <GroupDivider />
                    <View style={styles.settingRow}>
                      {/* Muted, not a green check. Colors.online means "is
                          reachable", and nothing here has contacted this relay:
                          it is configured, not verified. The palette is
                          monochrome outside real status for that reason. */}
                      <View style={styles.settingIcon}>
                        <Feather
                          name="server"
                          size={16}
                          color={Colors.textMuted}
                        />
                      </View>
                      <Text
                        style={[styles.settingLabel, { flex: 1 }]}
                        numberOfLines={1}
                      >
                        {relayDisplayHost(url)}
                      </Text>
                      <Pressable
                        onPress={() => handleRemoveRelay(url)}
                        hitSlop={HIT_SLOP}
                        accessibilityRole="button"
                        accessibilityLabel={T("settings.network.remove_relay", {
                          url: relayDisplayHost(url),
                        })}
                      >
                        <Feather name="x" size={18} color={Colors.danger} />
                      </Pressable>
                    </View>
                  </React.Fragment>
                ))}
                <GroupDivider />
                <View style={styles.settingRow}>
                  <View style={styles.settingIcon}>
                    <Feather name="plus" size={18} color={Colors.textMuted} />
                  </View>
                  <TextInput
                    style={[
                      styles.settingLabel,
                      { flex: 1, paddingVertical: 0 },
                    ]}
                    value={relayInput}
                    onChangeText={(text) => {
                      setRelayInput(text);
                      if (relayError !== null) setRelayError(null);
                    }}
                    placeholder="relay.example.com"
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    returnKeyType="done"
                    onSubmitEditing={handleAddRelay}
                    selectionColor={Colors.selection}
                  />
                  {relayInput.trim().length > 0 && (
                    <Pressable
                      onPress={handleAddRelay}
                      hitSlop={HIT_SLOP}
                      accessibilityRole="button"
                      accessibilityLabel={T("settings.network.add_relay")}
                    >
                      <Text
                        style={[styles.settingValue, { color: Colors.accent }]}
                      >
                        {T("settings.network.add_short")}
                      </Text>
                    </Pressable>
                  )}
                </View>
                {relayError !== null && (
                  <Text
                    style={[
                      styles.settingDescription,
                      {
                        color: Colors.danger,
                        paddingHorizontal: 16,
                        paddingBottom: 10,
                      },
                    ]}
                  >
                    {relayErrorMessage(relayError)}
                  </Text>
                )}
              </>
            )}
            <GroupDivider />
            {/* Message relays: read-only, and deliberately sitting right below
                custom relays. That adjacency is the explanation. Custom relays
                say "location channels and the mesh bridge", these say "direct
                messages", and seeing them together is what stops someone
                pinning a relay and expecting their DMs to follow. */}
            <Pressable
              style={styles.settingRow}
              onPress={() => setDmRelaysExpanded((v) => !v)}
              disabled={!internetEnabled}
              accessibilityRole="button"
              accessibilityState={{ expanded: dmRelaysExpanded }}
              accessibilityLabel={T("settings.network.dm_relays")}
            >
              <View style={styles.settingIcon}>
                <Feather name="mail" size={18} color={Colors.textSecondary} />
              </View>
              <View style={styles.settingLabelGroup}>
                <Text style={styles.settingLabel}>
                  {T("settings.network.dm_relays")}
                </Text>
                <Text style={styles.settingDescription}>
                  {T("settings.network.dm_relays_desc")}
                </Text>
              </View>
              <Feather
                name={dmRelaysExpanded ? "chevron-up" : "chevron-down"}
                size={18}
                color={internetEnabled ? Colors.textMuted : Colors.borderStrong}
              />
            </Pressable>
            {dmRelaysExpanded && internetEnabled && (
              <>
                {dmRelays.map((url) => (
                  <React.Fragment key={url}>
                    <GroupDivider />
                    <View style={styles.settingRow}>
                      <View style={styles.settingIcon}>
                        <Feather
                          name="lock"
                          size={16}
                          color={Colors.textMuted}
                        />
                      </View>
                      <Text
                        style={[styles.settingLabel, { flex: 1 }]}
                        numberOfLines={1}
                      >
                        <Text style={{ color: Colors.textMuted }}>
                          {relayDisplayScheme(url)}
                        </Text>
                        {relayDisplayHost(url)}
                      </Text>
                    </View>
                  </React.Fragment>
                ))}
              </>
            )}
            <GroupDivider />
            <SettingRow
              icon="bluetooth"
              label={T("settings.network.bitchat")}
              description={T("settings.network.bitchat_desc")}
              control={<SettingSwitch value={true} disabled />}
            />
          </View>
        </View>

        {/* Two actions because Apple's pairing is two-sided: one phone browses
            and the other advertises, at the same moment. There is no one-tap
            version to build, so the screen names each half rather than hiding it
            behind a button that works half the time. */}
        {pairingSupported && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {T("settings.network.wifi_pair")}
            </Text>
            <View style={styles.settingsGroup}>
              <SettingRow
                icon="link"
                label={T("settings.network.wifi_paired")}
                description={T("settings.network.wifi_pair_forget")}
                control={
                  <Text style={[styles.settingValue, styles.settingValueMono]}>
                    {formatNumber(pairedCount)}
                  </Text>
                }
              />
              <GroupDivider />
              <SettingLinkRow
                icon="search"
                label={T("settings.network.wifi_pair_find")}
                description={T("settings.network.wifi_pair_find_desc")}
                onPress={() => void presentWiFiPairing("find", Colors)}
              />
              <GroupDivider />
              <SettingLinkRow
                icon="radio"
                label={T("settings.network.wifi_pair_show")}
                description={T("settings.network.wifi_pair_show_desc")}
                onPress={() => void presentWiFiPairing("discoverable", Colors)}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
