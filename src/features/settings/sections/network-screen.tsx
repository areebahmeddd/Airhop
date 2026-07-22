// Network sub-screen: the mesh's always-on transport guarantees.

import React from "react";
import { ScrollView, Text, View } from "react-native";
import {
  GroupDivider,
  SettingRow,
  SubHeader,
  useSharedStyles,
} from "../shared";

interface Props {
  onBack: () => void;
}

export default function NetworkScreen({ onBack }: Props): React.JSX.Element {
  const styles = useSharedStyles();
  return (
    <View style={styles.container}>
      <SubHeader title="Network" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="radio"
              label="Nostr bridge"
              description="Fall back to Nostr relays when mesh peers are out of range"
              control={<Text style={styles.alwaysOn}>Auto</Text>}
            />
            <GroupDivider />
            <SettingRow
              icon="map-pin"
              label="Geo-relay discovery"
              description="350+ distributed relays, auto-selected by location"
              control={<Text style={styles.alwaysOn}>Auto</Text>}
            />
            <GroupDivider />
            <SettingRow
              icon="bluetooth"
              label="bitchat compatibility"
              description="BLE Service UUID F47B5E2D-... unchanged"
              control={<Text style={styles.alwaysOn}>Always on</Text>}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
