// Storage & Data sub-screen: a meter, not a settings screen. Nothing here is a
// preference, so there is nothing to decide; you come to read a number or to
// free some space. The media preferences that used to sit at the bottom moved
// to General, where taste belongs (see general-screen.tsx).
//
// Every number here is real, not decorative:
//   - Storage Usage: MMKV byteSize for chat-store + wallet-store, plus the
//     on-disk size of cached attachments.
//   - Network Usage: cumulative BLE/WiFi bytes sent/received this session,
//     tracked in mesh-service.ts. Resets when the app restarts.
//   - Cache: the same on-disk attachment total, with a working Clear action
//     that actually deletes the files.

import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { createMMKV } from "react-native-mmkv";
import {
  clearAttachmentCache,
  getAttachmentCacheBytes,
} from "../../../services/file-transfer-service";
import { getMeshService } from "../../../services/mesh-service";
import { showAlert } from "../../../store/alert-store";
import { WALLET_STORAGE_ID } from "../../../store/wallet-store";
import { formatBytes } from "../../../utils/format";
import { MMKV_STORE_IDS } from "../../../utils/panic-wipe";
import {
  GroupDivider,
  SettingLinkRow,
  SettingRow,
  SubHeader,
  useSharedStyles,
} from "../shared";

interface Props {
  onBack: () => void;
}

function readStorageStats() {
  // The wallet store is not in MMKV_STORE_IDS (the panic wipe deletes its file
  // rather than clearing it, since it is encrypted), so it is measured
  // separately. `byteSize` reads the file length and needs no decryption key,
  // which is why opening it without one is fine here.
  const messagesBytes = [...MMKV_STORE_IDS, WALLET_STORAGE_ID].reduce(
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
  const styles = useSharedStyles();
  const [stats, setStats] = useState(readStorageStats);

  const refresh = useCallback(() => setStats(readStorageStats()), []);

  const totalBytes = useMemo(
    () => stats.messagesBytes + stats.cacheBytes,
    [stats],
  );

  // Clearing removes real media from disk, not just disposable temp files, so
  // confirm first (Panic wipe is the only other destructive action here, and it
  // confirms too). Nothing to do when the cache is already empty. On success,
  // acknowledge with the amount freed so the tap has visible feedback.
  function handleClearCache(): void {
    if (stats.cacheBytes === 0) return;
    showAlert(
      "Clear cached media?",
      "Received photos, videos, and voice notes will be removed from this device and may need re-downloading. Messages and wallet are untouched.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            const freed = clearAttachmentCache();
            refresh();
            showAlert("Cache cleared", `Freed ${formatBytes(freed)}.`);
          },
        },
      ],
    );
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
            <SettingRow
              icon="hard-drive"
              label="Storage usage"
              description="Messages, wallet proofs, and cached attachments"
              control={
                <Text style={styles.settingValue}>
                  {formatBytes(totalBytes)}
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
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
