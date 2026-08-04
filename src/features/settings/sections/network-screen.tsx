// Network sub-screen: the internet (Nostr) connectivity choices, plus the
// always-on bitchat wire compatibility.

import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { validateRelayUrl } from "../../../core/nostr/geo-relay";
import { t, useT } from "../../../i18n";
import { getMeshService } from "../../../services/mesh-service";
import { showAlert } from "../../../store/alert-store";
import { useSettingsStore } from "../../../store/settings-store";
import { HIT_SLOP, useThemeColors } from "../../../ui/theme";
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

export default function NetworkScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const T = useT();
  const internetEnabled = useSettingsStore((s) => s.internetEnabled);
  const setInternetEnabled = useSettingsStore((s) => s.setInternetEnabled);
  const geoRelayDiscovery = useSettingsStore((s) => s.geoRelayDiscovery);
  const setGeoRelayDiscovery = useSettingsStore((s) => s.setGeoRelayDiscovery);
  const customRelays = useSettingsStore((s) => s.customRelays);
  const addCustomRelay = useSettingsStore((s) => s.addCustomRelay);
  const removeCustomRelay = useSettingsStore((s) => s.removeCustomRelay);

  const [relaysExpanded, setRelaysExpanded] = useState(false);
  const [relayInput, setRelayInput] = useState("");
  const [relayError, setRelayError] = useState(false);

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
      setRelayError(true);
      return;
    }
    addCustomRelay(normalized);
    setRelayInput("");
    setRelayError(false);
  }

  // Turning geo-relay discovery OFF only makes sense with at least one custom
  // relay to fall back to, so block it (with a nudge) when the list is empty,
  // and confirm the reach/interop trade-off when it is not. Turning it on never
  // prompts. This keeps the invariant "discovery off implies a custom relay".
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

  // Removing the last custom relay while discovery is off would leave no relays,
  // so re-enable discovery to keep location channels working.
  function handleRemoveRelay(url: string): void {
    removeCustomRelay(url);
    if (!geoRelayDiscovery && customRelays.length <= 1) {
      setGeoRelayDiscovery(true);
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
              icon="radio"
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
                    : t("settings.network.custom_added", {
                        count: customRelays.length,
                      })}
                </Text>
              </View>
              <Feather
                name={relaysExpanded ? "chevron-up" : "chevron-down"}
                size={18}
                color={internetEnabled ? Colors.textMuted : Colors.borderStrong}
              />
            </Pressable>
            {relaysExpanded && internetEnabled && (
              <>
                {customRelays.map((url) => (
                  <React.Fragment key={url}>
                    <GroupDivider />
                    <View style={styles.settingRow}>
                      <View style={styles.settingIcon}>
                        <Feather name="check" size={16} color={Colors.online} />
                      </View>
                      <Text
                        style={[styles.settingLabel, { flex: 1 }]}
                        numberOfLines={1}
                      >
                        {url}
                      </Text>
                      <Pressable
                        onPress={() => handleRemoveRelay(url)}
                        hitSlop={HIT_SLOP}
                        accessibilityRole="button"
                        accessibilityLabel={T("settings.network.remove_relay", {
                          url,
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
                    onChangeText={(t) => {
                      setRelayInput(t);
                      if (relayError) setRelayError(false);
                    }}
                    placeholder="relay.example.com"
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    returnKeyType="done"
                    onSubmitEditing={handleAddRelay}
                    selectionColor={Colors.accent}
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
                {relayError && (
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
                    {T("settings.network.relay_invalid")}
                  </Text>
                )}
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
      </ScrollView>
    </View>
  );
}
