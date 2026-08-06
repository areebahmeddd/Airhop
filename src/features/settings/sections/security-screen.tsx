// Privacy & Security sub-screen: the always-on Double Ratchet / packet-signing
// guarantees, and the blocked-peer list.
//
// The connectivity toggles (live voice, Tor, gateway, bridge) used to lead this
// screen. They are the switches people come here to flip, so they now sit on
// the settings hub itself; see connectivity-group.tsx.

import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { showAlert } from "../../../store/alert-store";
import { useBlockedStore } from "../../../store/blocked-store";
import {
  MEDIA_RETENTION_DAY_OPTIONS,
  useSettingsStore,
  type MediaRetentionDays,
} from "../../../store/settings-store";
import BottomSheet from "../../../ui/components/bottom-sheet";
import { HIT_SLOP, useThemeColors } from "../../../ui/theme";
import { resolveDisplayName } from "../../../utils/display-name";
import {
  GroupDivider,
  SettingLinkRow,
  SettingRow,
  SettingSwitch,
  SubHeader,
  useSharedStyles,
} from "../shared";

import { t, useT, useTPlural, type TranslationKey } from "../../../i18n";
interface Props {
  onBack: () => void;
}

// What each retention choice actually means for the person picking it. The
// number alone decides nothing: "7 days" and "30 days" only become a choice
// once the tradeoff is named.
//
// Keyed on the union rather than `number`, so adding a fourth option to
// MEDIA_RETENTION_DAY_OPTIONS is a compile error here until it has copy. The
// alternative is a picker that silently renders one blank row.
const RETENTION_DESCRIPTION: Record<MediaRetentionDays, TranslationKey> = {
  7: "settings.security.retention_7_desc",
  14: "settings.security.retention_14_desc",
  30: "settings.security.retention_30_desc",
};

export default function SecurityScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const T = useT();
  const TP = useTPlural();
  // Subscribe to the array itself (not the isBlocked function, whose identity
  // never changes) so the list re-renders when a block is added or removed.
  const blockedPeerIDs = useBlockedStore((s) => s.blockedPeerIDs);
  const hideNotificationPreviews = useSettingsStore(
    (s) => s.hideNotificationPreviews,
  );
  const keyboardLearning = useSettingsStore((s) => s.keyboardLearning);
  const mediaRetentionDays = useSettingsStore((s) => s.mediaRetentionDays);
  const [showRetentionSheet, setShowRetentionSheet] = useState(false);

  function confirmUnblock(peerID: string): void {
    showAlert(
      t("settings.security.unblock_title"),
      t("settings.security.unblock_body", { name: resolveDisplayName(peerID) }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.security.unblock"),
          onPress: () => {
            useBlockedStore.getState().unblockPeer(peerID);
          },
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <SubHeader title={T("settings.section.privacy")} onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Always-on guarantees: not choices, just what is true of every
            message. Shown as a locked-on switch so it reads as "on and not
            changeable" rather than plain text. */}
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="repeat"
              label={T("settings.security.forward_secrecy")}
              description={T("settings.security.forward_secrecy_desc")}
              control={<SettingSwitch value={true} disabled />}
            />
            <GroupDivider />
            <SettingRow
              icon="check-circle"
              label={T("settings.security.signed_packets")}
              description={T("settings.security.signed_packets_desc")}
              control={<SettingSwitch value={true} disabled />}
            />
          </View>
        </View>

        {/* The choices, below the guarantees: those describe what is true, these
            ask the user something. All three are the same question in different
            clothes - what does this device leak to something outside the app? -
            so they share one box: the keyboard, the lock screen, and the disk. */}
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            {/* On by default. Typing comfort is not a luxury in an app somebody
                opens during a blackout, and the leak is small and indirect: the
                keyboard's dictionary, not the message. */}
            <SettingRow
              icon="type"
              label={T("settings.security.keyboard_learning")}
              description={T("settings.security.keyboard_learning_desc")}
              control={
                <SettingSwitch
                  value={keyboardLearning}
                  onValueChange={(v) =>
                    useSettingsStore.getState().setKeyboardLearning(v)
                  }
                />
              }
            />
            <GroupDivider />
            <SettingRow
              icon="eye-off"
              label={T("settings.security.hide_previews")}
              description={T("settings.security.hide_previews_desc")}
              control={
                <SettingSwitch
                  value={hideNotificationPreviews}
                  onValueChange={(v) =>
                    useSettingsStore.getState().setHideNotificationPreviews(v)
                  }
                />
              }
            />
            <GroupDivider />
            {/* Retention sits here rather than under Storage because the reason
                it is adjustable is a seized phone, not a full one. Storage is a
                meter by design and holds no preferences. */}
            <SettingLinkRow
              icon="clock"
              label={T("settings.security.media_retention")}
              description={T("settings.security.media_retention_desc")}
              control={
                <Text style={styles.settingValue}>
                  {TP("settings.security.retention_days", mediaRetentionDays)}
                </Text>
              }
              onPress={() => setShowRetentionSheet(true)}
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
                label={T("settings.security.no_blocked")}
                description={T("settings.security.no_blocked_desc")}
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
                        hitSlop={HIT_SLOP}
                        accessibilityRole="button"
                        accessibilityLabel={T(
                          "settings.security.unblock_peer",
                          {
                            name: resolveDisplayName(peerID),
                          },
                        )}
                      >
                        <Text
                          style={[
                            styles.settingValue,
                            { color: Colors.accent },
                          ]}
                        >
                          {T("settings.security.unblock")}
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
          {T("settings.security.media_retention")}
        </Text>
        <Text style={styles.sheetSubtitle}>
          {T("settings.security.media_retention_sheet")}
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
                    "settings.security.retention_days",
                    days,
                  )}
                >
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>
                      {TP("settings.security.retention_days", days)}
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
    </View>
  );
}
