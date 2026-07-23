// Licenses sub-screen: every third-party package this app ships with, its
// license, and a tap to open its repository. Data snapshotted from each
// package's own package.json (src/data/licenses.ts), not a fabricated list.
// Each group opens with a one-line note on what those packages are for.

import React, { useMemo } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { THIRD_PARTY_LICENSES } from "../../../data/licenses";
import { FontSize, Spacing, useThemeColors } from "../../../ui/theme";
import { GroupDivider, SubHeader, useSharedStyles } from "../shared";

interface Props {
  onBack: () => void;
}

export default function LicensesScreen({ onBack }: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useSharedStyles();
  const local = useMemo(() => createStyles(Colors), [Colors]);
  return (
    <View style={styles.container}>
      <SubHeader title="Open source licenses" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {THIRD_PARTY_LICENSES.map((group) => (
          <View key={group.category} style={styles.section}>
            <View style={local.header}>
              <Text style={styles.sectionTitle}>{group.category}</Text>
              <Text style={local.description}>{group.description}</Text>
            </View>
            <View style={styles.settingsGroup}>
              {group.entries.map((entry, index) => (
                <React.Fragment key={entry.name}>
                  {index > 0 && <GroupDivider />}
                  <Pressable
                    style={styles.settingRow}
                    android_ripple={{ color: Colors.surfacePressed }}
                    onPress={() => void Linking.openURL(entry.repo)}
                    accessibilityRole="link"
                    accessibilityLabel={`Open the ${entry.name} repository`}
                  >
                    <View style={styles.settingLabelGroup}>
                      <Text style={styles.settingLabel}>{entry.name}</Text>
                      <Text style={styles.settingDescription}>
                        v{entry.version}
                      </Text>
                    </View>
                    <Text style={styles.settingValue}>{entry.license}</Text>
                  </Pressable>
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    // Title and its blurb kept tight together, above the group card.
    header: {
      gap: Spacing.xs,
    },
    description: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm * 1.5,
      paddingHorizontal: Spacing.xs,
    },
  });
}
