// General sub-screen: the preferences that answer to taste rather than to a
// domain. Every other section owns a subject (privacy, network, storage, help)
// and its rows are about that subject; these are about how you like the app to
// behave. Features first, then messages, then media, with reset kept apart at
// the bottom.
//
// The two media rows sat under Storage & Data before, borrowed from where
// WhatsApp and Signal keep theirs. Theirs gate downloads and bandwidth; these
// do not. Upload quality picks how much detail to keep inside a fixed 512 KB
// budget, and Show media automatically only decides whether a photo already on
// disk renders by itself. Neither saves a byte, so neither belongs on a screen
// that reports usage.

import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { setTorRouting } from "../../../core/nostr/tor-routing";
import {
  useT,
  useTPlural,
  type TranslationKey,
  type Translator,
} from "../../../i18n";
import { getMeshService } from "../../../services/mesh-service";
import { showAlert } from "../../../store/alert-store";
import {
  MEDIA_RETENTION_DAY_OPTIONS,
  useSettingsStore,
  type MediaRetentionDays,
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
//
// The tables in this file hold translation keys rather than text, because a
// module constant cannot call a hook. The component translates them on render,
// which is also what keeps them live when the language changes.
const UNDO_OPTIONS: {
  value: number;
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
}[] = [
  {
    value: 0,
    labelKey: "common.off",
    descriptionKey: "settings.general.undo_off_desc",
  },
  {
    value: 2,
    labelKey: "settings.general.undo_2",
    descriptionKey: "settings.general.undo_2_desc",
  },
  {
    value: 10,
    labelKey: "settings.general.undo_10",
    descriptionKey: "settings.general.undo_10_desc",
  },
];

function undoLabel(T: Translator, seconds: number): string {
  const match = UNDO_OPTIONS.find((o) => o.value === seconds);
  return match
    ? T(match.labelKey)
    : T("settings.general.undo_seconds", { count: seconds });
}

const QUALITY_META: Record<
  UploadQuality,
  { labelKey: TranslationKey; descriptionKey: TranslationKey }
> = {
  // Every photo is fitted to the same 512 KB budget before it is sent, so this
  // is not a size dial: it is how much detail to try to keep inside that
  // budget. Low reaches a sendable file in one pass and gets moving sooner,
  // High holds on to detail and may take a couple of passes to fit.
  low: {
    labelKey: "settings.general.quality_low",
    descriptionKey: "settings.general.quality_low_desc",
  },
  medium: {
    labelKey: "settings.general.quality_medium",
    descriptionKey: "settings.general.quality_medium_desc",
  },
  high: {
    labelKey: "settings.general.quality_high",
    descriptionKey: "settings.general.quality_high_desc",
  },
};
const QUALITY_ORDER: UploadQuality[] = ["low", "medium", "high"];

// One line per option, because the number alone decides nothing: "7 days" and
// "30 days" only become a choice once the tradeoff is named.
//
// Keyed on the union rather than `number`, so adding a fourth option to
// MEDIA_RETENTION_DAY_OPTIONS is a compile error here until it has copy. The
// alternative is a picker that silently renders one blank row.
const RETENTION_DESCRIPTION: Record<MediaRetentionDays, TranslationKey> = {
  7: "settings.general.retention_7_desc",
  14: "settings.general.retention_14_desc",
  30: "settings.general.retention_30_desc",
};

// The unshipped features. Each row states what it will do rather than linking
// out or staying silent about it, so the answer to "can Airhop do X" is on a
// screen instead of only in a changelog.
type FeatureKey = "ai" | "feeds";

const FEATURES: {
  key: FeatureKey;
  // "AI" and "Feeds" are product names for unshipped features, so the label is
  // a key like everything else: several languages will want to translate
  // "Feeds", and none should be forced to.
  labelKey: TranslationKey;
  // Unused for "ai": that row renders a robot glyph from
  // MaterialCommunityIcons instead, which Feather has no equivalent for.
  icon: keyof typeof Feather.glyphMap;
  descriptionKey: TranslationKey;
}[] = [
  {
    key: "ai",
    labelKey: "settings.general.feature_ai",
    icon: "cpu",
    descriptionKey: "settings.general.feature_ai_desc",
  },
  {
    key: "feeds",
    labelKey: "settings.general.feature_feeds",
    icon: "rss",
    descriptionKey: "settings.general.feature_feeds_desc",
  },
];

export default function GeneralScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const T = useT();
  const TP = useTPlural();
  const styles = useSharedStyles();
  const undoSendSeconds = useSettingsStore((s) => s.undoSendSeconds);
  const setUndoSendSeconds = useSettingsStore((s) => s.setUndoSendSeconds);
  const autoDownloadMedia = useSettingsStore((s) => s.autoDownloadMedia);
  const setAutoDownloadMedia = useSettingsStore((s) => s.setAutoDownloadMedia);
  const uploadQuality = useSettingsStore((s) => s.uploadQuality);
  const setUploadQuality = useSettingsStore((s) => s.setUploadQuality);
  const [showUndoSheet, setShowUndoSheet] = useState(false);
  const [showQualitySheet, setShowQualitySheet] = useState(false);
  const mediaRetentionDays = useSettingsStore((s) => s.mediaRetentionDays);
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);

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
      T("settings.general.reset_title"),
      T("settings.general.reset_body"),
      [
        { text: T("common.cancel"), style: "cancel" },
        {
          text: T("settings.general.reset_confirm"),
          style: "destructive",
          onPress: doReset,
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <SubHeader title={T("settings.section.general")} onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Features. Wallet has shipped, so it leads the group with a switch
            locked on: the Wallet tab is part of what Airhop is, not something
            to switch off. The rest aren't built yet and carry a "Coming soon"
            tag in the same row shape.

            This sat on the settings hub, above the nav list, where it was the
            first thing you saw and none of it was actionable: one switch you
            cannot move and two rows that only say "later". The hub now opens on
            the connectivity toggles instead, and this reads as what it is, a
            note on what the app does and will do. */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {T("settings.group.features")}
          </Text>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="credit-card"
              label={T("settings.general.feature_wallet")}
              description={T("settings.general.feature_wallet_desc")}
              control={
                <SettingSwitch
                  value
                  disabled
                  accessibilityLabel={T("settings.general.feature_wallet_a11y")}
                />
              }
            />
            {FEATURES.map((feature) => (
              <React.Fragment key={feature.key}>
                <GroupDivider />
                <SettingRow
                  icon={feature.key === "ai" ? undefined : feature.icon}
                  iconOverride={
                    feature.key === "ai" ? (
                      <MaterialCommunityIcons
                        name="robot-outline"
                        size={18}
                        color={Colors.textSecondary}
                      />
                    ) : undefined
                  }
                  label={T(feature.labelKey)}
                  description={T(feature.descriptionKey)}
                  control={
                    <Text style={styles.comingSoon}>
                      {T("settings.coming_soon")}
                    </Text>
                  }
                />
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {T("settings.group.messages")}
          </Text>
          <View style={styles.settingsGroup}>
            <SettingLinkRow
              icon="rotate-ccw"
              label={T("settings.general.undo")}
              description={T("settings.general.undo_desc")}
              control={
                <Text style={styles.settingValue}>
                  {undoLabel(T, undoSendSeconds)}
                </Text>
              }
              onPress={() => setShowUndoSheet(true)}
            />
          </View>
        </View>

        {/* Media you send, then media you receive. One box, because from the
            user's side they are the same subject: how photos behave. */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{T("settings.group.media")}</Text>
          <View style={styles.settingsGroup}>
            <SettingLinkRow
              icon="image"
              label={T("settings.general.quality")}
              description={T(QUALITY_META[uploadQuality].descriptionKey)}
              onPress={() => setShowQualitySheet(true)}
              control={
                <Text style={styles.settingValue}>
                  {T(QUALITY_META[uploadQuality].labelKey)}
                </Text>
              }
            />
            <GroupDivider />
            {/* Moved here from Privacy & security. It reads as a privacy
                control (a seized phone holds less), but every neighbour of it
                there was about what leaves this device, and this is about what
                stays on it. Beside quality and show-media it completes one
                subject: how media behaves, sending through keeping. */}
            <SettingLinkRow
              icon="clock"
              label={T("settings.general.media_retention")}
              description={T("settings.general.media_retention_desc")}
              control={
                <Text style={styles.settingValue}>
                  {TP("settings.general.retention_days", mediaRetentionDays)}
                </Text>
              }
              onPress={() => setShowRetentionSheet(true)}
            />
            <GroupDivider />
            {/* Not a download switch, whatever it used to be called. Media
                arrives as one packet and is already on disk before any of this
                runs, so there is nothing here to decline; what this controls is
                whether it appears by itself or waits behind a tap. Worth having
                for the shoulder-surfing case, worth naming honestly. */}
            <SettingRow
              icon="eye"
              label={T("settings.general.show_media")}
              description={T("settings.general.show_media_desc")}
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
          <Text style={styles.sectionTitle}>{T("settings.group.reset")}</Text>
          <View style={styles.settingsGroup}>
            <SettingLinkRow
              icon="refresh-ccw"
              label={T("settings.general.reset")}
              description={T("settings.general.reset_desc")}
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
        <Text style={styles.sheetTitle}>{T("settings.general.undo")}</Text>
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
                  accessibilityLabel={T("settings.general.undo_a11y", {
                    value: T(opt.labelKey),
                  })}
                >
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{T(opt.labelKey)}</Text>
                    <Text style={styles.optionDescription}>
                      {T(opt.descriptionKey)}
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

      {/* Retention picker. Same grouped-option sheet the quality and undo
          pickers use, so this reads as one more of those rather than a new
          kind of control. Each option carries the consequence rather than only
          the number, because "14 days" says nothing on its own. */}
      <BottomSheet
        visible={showRetentionSheet}
        onClose={() => setShowRetentionSheet(false)}
        sheetStyle={styles.sheet}
      >
        <Text style={styles.sheetTitle}>
          {T("settings.general.media_retention")}
        </Text>
        <Text style={styles.sheetSubtitle}>
          {T("settings.general.media_retention_sheet")}
        </Text>
        <View style={styles.optionGroup}>
          {MEDIA_RETENTION_DAY_OPTIONS.map((days, i) => {
            const selected = days === mediaRetentionDays;
            return (
              <React.Fragment key={days}>
                {i > 0 && <GroupDivider />}
                <Pressable
                  style={[
                    styles.optionRowGrouped,
                    selected && styles.optionRowGroupedSelected,
                  ]}
                  onPress={() => {
                    useSettingsStore.getState().setMediaRetentionDays(days);
                    setShowRetentionSheet(false);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={TP(
                    "settings.general.retention_days",
                    days,
                  )}
                >
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>
                      {TP("settings.general.retention_days", days)}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {T(RETENTION_DESCRIPTION[days])}
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
        <Text style={styles.sheetTitle}>{T("settings.general.quality")}</Text>
        <Text style={styles.sheetSubtitle}>
          {T("settings.general.quality_desc")}
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
                  accessibilityLabel={T("settings.general.quality_a11y", {
                    value: T(meta.labelKey),
                  })}
                >
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{T(meta.labelKey)}</Text>
                    <Text style={styles.optionDescription}>
                      {T(meta.descriptionKey)}
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
