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

import {
  clearAttachmentCache,
  getAttachmentCacheBytes,
} from "@services/file-transfer-service";
import { getMeshService } from "@services/mesh-service";
import { showAlert } from "@store/alert-store";
import { WALLET_STORAGE_ID } from "@store/wallet-store";
import { formatBytes } from "@utils/format";
import { MMKV_STORE_IDS } from "@utils/panic-wipe";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { createMMKV } from "react-native-mmkv";
import {
  GroupDivider,
  SettingLinkRow,
  SettingRow,
  SubHeader,
  useSharedStyles,
} from "../shared";

import { t, useT } from "@i18n";
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
  const T = useT();
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
      t("settings.storage.clear_title"),
      t("settings.storage.clear_body"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.storage.clear"),
          style: "destructive",
          onPress: () => {
            const freed = clearAttachmentCache();
            refresh();
            showAlert(
              t("settings.storage.cleared"),
              t("settings.storage.freed", { size: formatBytes(freed) }),
            );
          },
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <SubHeader title={T("settings.section.storage")} onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="activity"
              label={T("settings.storage.network_usage")}
              description={T("settings.storage.session_usage", {
                sent: formatBytes(stats.network.sent),
                received: formatBytes(stats.network.received),
              })}
              control={
                <Text style={styles.settingValue}>
                  {formatBytes(stats.network.sent + stats.network.received)}
                </Text>
              }
            />
            <GroupDivider />
            <SettingRow
              icon="hard-drive"
              label={T("settings.storage.storage_usage")}
              description={T("settings.storage.storage_usage_desc")}
              control={
                <Text style={styles.settingValue}>
                  {formatBytes(totalBytes)}
                </Text>
              }
            />
            <GroupDivider />
            <SettingLinkRow
              icon="trash-2"
              label={T("settings.storage.cache")}
              description={T("settings.storage.cache_desc", {
                size: formatBytes(stats.cacheBytes),
              })}
              onPress={handleClearCache}
              chevron={false}
              accessibilityLabel={T("settings.storage.clear_cache")}
              control={
                <Text
                  style={[
                    styles.settingValue,
                    // Dimmed when there is nothing to clear, because the handler
                    // returns early in that case and every other confirm-then-act
                    // row in Settings responds to a tap. A full-contrast "Clear"
                    // that does nothing is the row lying about being live.
                    stats.cacheBytes === 0 ? styles.settingValueMuted : null,
                  ]}
                >
                  {T("settings.storage.clear")}
                </Text>
              }
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
