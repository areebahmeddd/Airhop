// Network sub-screen: the internet (Nostr) connectivity choices, plus the
// always-on bitchat wire compatibility.

import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { validateRelayUrl } from "../../../core/nostr/geo-relay";
import { getMeshService } from "../../../services/mesh-service";
import { showAlert } from "../../../store/alert-store";
import { useSettingsStore } from "../../../store/settings-store";
import { useThemeColors } from "../../../ui/theme";
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
      "Turn off the internet?",
      "Airhop will run on Bluetooth only. It stops contacting any Nostr relay, and Tor, the internet gateway, and the mesh bridge all turn off. Nearby Bluetooth chat keeps working.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Turn off",
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
        "Add a custom relay first",
        "Auto-discovery is what points Airhop at the nearest relays. Turning it off only makes sense once you have pinned your own relays below, so add at least one first.",
        [{ text: "OK", style: "cancel" }],
      );
      return; // leave discovery on
    }
    showAlert(
      "Use only your custom relays?",
      "Location channels and the mesh bridge will stop auto-selecting the nearest relays and use only the ones you added. This can reduce reach, and you may stop meeting bitchat users, who converge on the nearest relays.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Turn off",
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
      <SubHeader title="Network & Relays" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="radio"
              label="Internet fallback"
              description="Continue over Nostr relays when mesh peers are out of range."
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
              label="Geo-relay discovery"
              description="Auto-select the nearest relays for a location cell from 350+ distributed relays."
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
              accessibilityLabel="Custom relays"
            >
              <View style={styles.settingIcon}>
                <Feather name="server" size={18} color={Colors.textSecondary} />
              </View>
              <View style={styles.settingLabelGroup}>
                <Text style={styles.settingLabel}>Custom relays</Text>
                <Text style={styles.settingDescription}>
                  {customRelays.length === 0
                    ? "Add your own Nostr relays"
                    : `${customRelays.length} added`}
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
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${url}`}
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
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityRole="button"
                      accessibilityLabel="Add relay"
                    >
                      <Text
                        style={[styles.settingValue, { color: Colors.accent }]}
                      >
                        Add
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
                    Enter a valid relay host, e.g. relay.example.com. IP
                    addresses and local names are not allowed.
                  </Text>
                )}
              </>
            )}
            <GroupDivider />
            <SettingRow
              icon="bluetooth"
              label="bitchat compatibility"
              description="Same BLE mesh as bitchat, fully interoperable. This is always on, and cannot be disabled."
              control={<SettingSwitch value={true} disabled />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
