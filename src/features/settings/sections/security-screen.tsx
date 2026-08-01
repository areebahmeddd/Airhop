// Privacy & Security sub-screen: the always-on Double Ratchet / packet-signing
// guarantees, and the blocked-peer list.
//
// The connectivity toggles (live voice, Tor, gateway, bridge) used to lead this
// screen. They are the switches people come here to flip, so they now sit on
// the settings hub itself; see connectivity-group.tsx.

import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { showAlert } from "../../../store/alert-store";
import { useBlockedStore } from "../../../store/blocked-store";
import { HIT_SLOP, useThemeColors } from "../../../ui/theme";
import { resolveDisplayName } from "../../../utils/display-name";
import {
  GroupDivider,
  SettingRow,
  SettingSwitch,
  SubHeader,
  useSharedStyles,
} from "../shared";

import { t, useT } from "../../../i18n";
interface Props {
  onBack: () => void;
}

export default function SecurityScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const T = useT();
  // Subscribe to the array itself (not the isBlocked function, whose identity
  // never changes) so the list re-renders when a block is added or removed.
  const blockedPeerIDs = useBlockedStore((s) => s.blockedPeerIDs);

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
    </View>
  );
}
