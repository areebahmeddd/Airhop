// Licenses sub-screen: every third-party package this app ships with, and
// the license it's under. Data snapshotted from each package's own
// package.json (src/data/licenses.ts), not a fabricated list.

import React from "react";
import { ScrollView, Text, View } from "react-native";
import { THIRD_PARTY_LICENSES } from "../../../data/licenses";
import { GroupDivider, SubHeader, useSharedStyles } from "../shared";

interface Props {
  onBack: () => void;
}

export default function LicensesScreen({ onBack }: Props): React.JSX.Element {
  const styles = useSharedStyles();
  return (
    <View style={styles.container}>
      <SubHeader title="Licenses" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            {THIRD_PARTY_LICENSES.map((entry, index) => (
              <React.Fragment key={entry.name}>
                {index > 0 && <GroupDivider />}
                <View style={styles.settingRow}>
                  <View style={styles.settingLabelGroup}>
                    <Text style={styles.settingLabel}>{entry.name}</Text>
                    <Text style={styles.settingDescription}>
                      v{entry.version}
                    </Text>
                  </View>
                  <Text style={styles.settingValue}>{entry.license}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
