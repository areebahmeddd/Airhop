// General sub-screen: the preferences that answer to taste rather than to a
// domain. Every other section owns a subject (privacy, network, storage, help)
// and its rows are about that subject; these are about how you like the app to
// behave. Messages first, then media, with reset kept apart at the bottom.
//
// The two media rows sat under Storage & Data before, borrowed from where
// WhatsApp and Signal keep theirs. Theirs gate downloads and bandwidth; these
// do not. Upload quality picks how much detail to keep inside a fixed 512 KB
// budget, and Show media automatically only decides whether a photo already on
// disk renders by itself. Neither saves a byte, so neither belongs on a screen
// that reports usage.

import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { setTorRouting } from "../../../core/nostr/tor-routing";
import { getMeshService } from "../../../services/mesh-service";
import { showAlert } from "../../../store/alert-store";
import {
  useSettingsStore,
  type UploadQuality,
} from "../../../store/settings-store";
import BottomSheet from "../../../ui/components/bottom-sheet";
import { useThemeColors } from "../../../ui/theme";
import {
  GroupDivider,
  SettingLinkRow,
  SettingRow,
  SettingSwitch,
  SubHeader,
  useSharedStyles,
} from "../shared";

interface Props {
  onBack: () => void;
}

// Undo-send window choices. 0 seconds means no hold: a message transmits the
// instant you send it, with no pill. The rest hold it that long behind an
// "undo" pill before it goes out.
const UNDO_OPTIONS: { value: number; label: string; description: string }[] = [
  { value: 0, label: "Off", description: "Send right away, no undo" },
  {
    value: 2,
    label: "2 seconds",
    description: "A quick chance to take it back",
  },
  { value: 5, label: "5 seconds", description: "A longer window" },
  { value: 10, label: "10 seconds", description: "The longest window" },
];

function undoLabel(seconds: number): string {
  return (
    UNDO_OPTIONS.find((o) => o.value === seconds)?.label ?? `${seconds} seconds`
  );
}

const QUALITY_META: Record<
  UploadQuality,
  { label: string; description: string }
> = {
  // Every photo is fitted to the same 512 KB budget before it is sent, so this
  // is not a size dial: it is how much detail to try to keep inside that
  // budget. Low reaches a sendable file in one pass and gets moving sooner,
  // High holds on to detail and may take a couple of passes to fit.
  low: { label: "Low", description: "Smallest photos, quickest to send" },
  medium: { label: "Medium", description: "Balanced detail and speed" },
  high: { label: "High", description: "Keeps the most detail" },
};
const QUALITY_ORDER: UploadQuality[] = ["low", "medium", "high"];

export default function GeneralScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const undoSendSeconds = useSettingsStore((s) => s.undoSendSeconds);
  const setUndoSendSeconds = useSettingsStore((s) => s.setUndoSendSeconds);
  const autoDownloadMedia = useSettingsStore((s) => s.autoDownloadMedia);
  const setAutoDownloadMedia = useSettingsStore((s) => s.setAutoDownloadMedia);
  const uploadQuality = useSettingsStore((s) => s.uploadQuality);
  const setUploadQuality = useSettingsStore((s) => s.setUploadQuality);
  const [showUndoSheet, setShowUndoSheet] = useState(false);
  const [showQualitySheet, setShowQualitySheet] = useState(false);

  function doReset(): void {
    // reset() flips the persisted values back to defaults, but the connectivity
    // runtime needs a nudge to match. Tor teardown is explicit (and only when it
    // was actually on, to avoid a needless Nostr restart); the now-default
    // internet-on state is (re)applied so the transport matches. Gateway and
    // bridge react to their own settings via MeshService subscriptions.
    const torWasOn = useSettingsStore.getState().torEnabled;
    useSettingsStore.getState().reset();
    if (torWasOn) void setTorRouting(false);
    getMeshService()?.applyInternetEnabled(true);
  }

  function handleReset(): void {
    showAlert(
      "Reset settings?",
      "Every preference goes back to its default: appearance, undo send, and connectivity (internet, Tor, gateway, bridge, relays). Your identity, messages, contacts, and wallet are untouched.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: doReset },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <SubHeader title="General" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingLinkRow
              icon="rotate-ccw"
              label="Undo send"
              description="Hold a sent message briefly so you can take it back before it goes out."
              control={
                <Text style={styles.settingValue}>
                  {undoLabel(undoSendSeconds)}
                </Text>
              }
              onPress={() => setShowUndoSheet(true)}
            />
          </View>
        </View>

        {/* Media you send, then media you receive. One box, because from the
            user's side they are the same subject: how photos behave. */}
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingLinkRow
              icon="image"
              label="Upload quality"
              description={QUALITY_META[uploadQuality].description}
              onPress={() => setShowQualitySheet(true)}
              control={
                <Text style={styles.settingValue}>
                  {QUALITY_META[uploadQuality].label}
                </Text>
              }
            />
            <GroupDivider />
            {/* Not a download switch, whatever it used to be called. Media
                arrives as one packet and is already on disk before any of this
                runs, so there is nothing here to decline; what this controls is
                whether it appears by itself or waits behind a tap. Worth having
                for the shoulder-surfing case, worth naming honestly. */}
            <SettingRow
              icon="eye"
              label="Show media automatically"
              description="Photos and videos appear in the chat. Turn off to keep them behind a tap"
              control={
                <SettingSwitch
                  value={autoDownloadMedia}
                  onValueChange={setAutoDownloadMedia}
                />
              }
            />
          </View>
        </View>

        {/* Reset stands alone, unlabelled: it is not a preference, it is what
            undoes all of them, and it should not read as one more row in the
            list above it. */}
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingLinkRow
              icon="refresh-ccw"
              label="Reset settings"
              description="Put every preference back to its default. Your identity, messages, contacts, and wallet are untouched."
              chevron={false}
              onPress={handleReset}
            />
          </View>
        </View>
      </ScrollView>

      <BottomSheet
        visible={showUndoSheet}
        onClose={() => setShowUndoSheet(false)}
        sheetStyle={styles.sheet}
      >
        <Text style={styles.sheetTitle}>Undo send</Text>
        <View style={styles.optionGroup}>
          {UNDO_OPTIONS.map((opt, i) => {
            const selected = opt.value === undoSendSeconds;
            return (
              <React.Fragment key={opt.value}>
                {i > 0 && <GroupDivider />}
                <Pressable
                  style={[
                    styles.optionRowGrouped,
                    selected && styles.optionRowGroupedSelected,
                  ]}
                  onPress={() => {
                    setUndoSendSeconds(opt.value);
                    setShowUndoSheet(false);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Undo send: ${opt.label}`}
                >
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{opt.label}</Text>
                    <Text style={styles.optionDescription}>
                      {opt.description}
                    </Text>
                  </View>
                  {selected && (
                    <Feather
                      name="check"
                      size={18}
                      color={Colors.textPrimary}
                    />
                  )}
                </Pressable>
              </React.Fragment>
            );
          })}
        </View>
      </BottomSheet>

      <BottomSheet
        visible={showQualitySheet}
        onClose={() => setShowQualitySheet(false)}
        sheetStyle={styles.sheet}
      >
        <Text style={styles.sheetTitle}>Upload quality</Text>
        <Text style={styles.sheetSubtitle}>
          Applies to photos sent from your camera or library. Every photo is
          fitted to the mesh either way.
        </Text>
        <View style={styles.optionGroup}>
          {QUALITY_ORDER.map((key, i) => {
            const meta = QUALITY_META[key];
            const selected = key === uploadQuality;
            return (
              <React.Fragment key={key}>
                {i > 0 && <GroupDivider />}
                <Pressable
                  style={[
                    styles.optionRowGrouped,
                    selected && styles.optionRowGroupedSelected,
                  ]}
                  onPress={() => {
                    setUploadQuality(key);
                    setShowQualitySheet(false);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Set upload quality to ${meta.label}`}
                >
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{meta.label}</Text>
                    <Text style={styles.optionDescription}>
                      {meta.description}
                    </Text>
                  </View>
                  {selected && (
                    <Feather
                      name="check"
                      size={18}
                      color={Colors.textPrimary}
                    />
                  )}
                </Pressable>
              </React.Fragment>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}
