// Storage & Data sub-screen, WhatsApp-style.
//
// Every number here is real, not decorative:
//   - Storage Usage: MMKV byteSize for chat-store + wallet-store, plus the
//     on-disk size of cached attachments.
//   - Network Usage: cumulative BLE/WiFi bytes sent/received this session,
//     tracked in mesh-service.ts. Resets when the app restarts.
//   - Cache: the same on-disk attachment total, with a working Clear action
//     that actually deletes the files.
//   - Auto Download: gates whether incoming photos/videos render inline in
//     a chat thread immediately or need a tap to reveal (message-thread.tsx).
//   - Upload Quality: the JPEG compression factor actually passed to
//     expo-image-picker when you attach a photo (message-thread.tsx).

import Feather from "@expo/vector-icons/Feather";
import React, { useCallback, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { createMMKV } from "react-native-mmkv";
import {
  clearAttachmentCache,
  getAttachmentCacheBytes,
} from "../../../services/file-transfer-service";
import { getMeshService } from "../../../services/mesh-service";
import {
  useSettingsStore,
  type UploadQuality,
} from "../../../store/settings-store";
import { useThemeColors } from "../../../ui/theme";
import { MMKV_STORE_IDS } from "../../../utils/panic-wipe";
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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const QUALITY_META: Record<
  UploadQuality,
  { label: string; description: string }
> = {
  low: { label: "Low", description: "Smaller uploads, faster over BLE" },
  medium: { label: "Medium", description: "Balanced size and quality" },
  high: { label: "High", description: "Best quality, largest uploads" },
};
const QUALITY_ORDER: UploadQuality[] = ["low", "medium", "high"];

function readStorageStats() {
  const messagesBytes = MMKV_STORE_IDS.reduce(
    (sum, id) => sum + createMMKV({ id }).byteSize,
    0,
  );
  const cacheBytes = getAttachmentCacheBytes();
  const network = getMeshService()?.getByteCounters() ?? {
    sent: 0,
    received: 0,
  };
  return { messagesBytes, cacheBytes, network };
}

export default function StorageScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const [stats, setStats] = useState(readStorageStats);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const autoDownloadMedia = useSettingsStore((s) => s.autoDownloadMedia);
  const setAutoDownloadMedia = useSettingsStore((s) => s.setAutoDownloadMedia);
  const uploadQuality = useSettingsStore((s) => s.uploadQuality);
  const setUploadQuality = useSettingsStore((s) => s.setUploadQuality);

  const refresh = useCallback(() => setStats(readStorageStats()), []);

  const totalBytes = useMemo(
    () => stats.messagesBytes + stats.cacheBytes,
    [stats],
  );

  function handleClearCache(): void {
    clearAttachmentCache();
    refresh();
  }

  return (
    <View style={styles.container}>
      <SubHeader title="Storage & Data" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="hard-drive"
              label="Storage usage"
              description="Messages, wallet proofs, and cached attachments on this device"
              control={
                <Text style={styles.settingValue}>
                  {formatBytes(totalBytes)}
                </Text>
              }
            />
            <GroupDivider />
            <SettingRow
              icon="activity"
              label="Network usage"
              description={`This session · ${formatBytes(stats.network.sent)} sent, ${formatBytes(stats.network.received)} received`}
              control={
                <Text style={styles.settingValue}>
                  {formatBytes(stats.network.sent + stats.network.received)}
                </Text>
              }
            />
            <GroupDivider />
            <SettingLinkRow
              icon="trash-2"
              label="Cache"
              description={`${formatBytes(stats.cacheBytes)} of received attachments`}
              onPress={handleClearCache}
              chevron={false}
              accessibilityLabel="Clear attachment cache"
              control={<Text style={styles.settingValue}>Clear</Text>}
            />
            <GroupDivider />
            <SettingRow
              icon="download"
              label="Auto-download media"
              description="Load incoming photos and videos automatically"
              control={
                <SettingSwitch
                  value={autoDownloadMedia}
                  onValueChange={setAutoDownloadMedia}
                />
              }
            />
            <GroupDivider />
            <SettingLinkRow
              icon="image"
              label="Upload quality"
              description={QUALITY_META[uploadQuality].description}
              onPress={() => setShowQualityModal(true)}
              chevron={false}
              control={
                <Text style={styles.settingValue}>
                  {QUALITY_META[uploadQuality].label}
                </Text>
              }
            />
          </View>
        </View>
      </ScrollView>

      {/* Upload quality modal */}
      <Modal
        visible={showQualityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQualityModal(false)}
      >
        <View style={styles.sheetOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowQualityModal(false)}
          />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Upload quality</Text>
            <Text style={styles.sheetSubtitle}>
              Applies to photos sent from your camera or library.
            </Text>
            <View style={styles.optionList}>
              {QUALITY_ORDER.map((key) => {
                const meta = QUALITY_META[key];
                const selected = key === uploadQuality;
                return (
                  <Pressable
                    key={key}
                    style={[
                      styles.optionRow,
                      selected && styles.optionRowSelected,
                    ]}
                    onPress={() => {
                      setUploadQuality(key);
                      setShowQualityModal(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Set upload quality to ${meta.label}`}
                  >
                    <View style={styles.optionRowInner}>
                      <View
                        style={[
                          styles.optionDot,
                          { backgroundColor: Colors.surface },
                        ]}
                      >
                        <Feather
                          name="image"
                          size={14}
                          color={Colors.textSecondary}
                        />
                      </View>
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
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
