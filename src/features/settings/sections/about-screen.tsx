// About sub-screen: version, changelog, source, and third-party licenses.
//
// No Build Number row: Expo doesn't expose a real build number outside an
// EAS build, and this app isn't on EAS yet, so a fabricated number would
// violate the "every row must be real" rule rather than satisfy it.

import React from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import {
  GroupDivider,
  SettingLinkRow,
  SettingRow,
  SubHeader,
  useSharedStyles,
} from "../shared";

interface Props {
  onBack: () => void;
  onOpenLicenses: () => void;
}

export default function AboutScreen({
  onBack,
  onOpenLicenses,
}: Props): React.JSX.Element {
  const styles = useSharedStyles();
  return (
    <View style={styles.container}>
      <SubHeader title="About" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="tag"
              label="Version"
              description="Current release"
              control={<Text style={styles.settingValue}>1.0.0</Text>}
            />
            <GroupDivider />
            <SettingLinkRow
              icon="clock"
              label="Changelog"
              description="What's changed, release by release"
              onPress={() =>
                void Linking.openURL(
                  "https://github.com/areebahmeddd/airhop/blob/main/docs/dev/CHANGELOG.md",
                )
              }
              accessibilityLabel="Open changelog on GitHub"
              external
            />
            <GroupDivider />
            <SettingLinkRow
              icon="github"
              label="GitHub"
              description="areebahmeddd/airhop"
              onPress={() =>
                void Linking.openURL("https://github.com/areebahmeddd/airhop")
              }
              accessibilityLabel="Open GitHub repository"
              external
            />
            <GroupDivider />
            <SettingLinkRow
              icon="file-text"
              label="Licenses"
              description="Third-party open source packages"
              onPress={onOpenLicenses}
              accessibilityLabel="View third-party licenses"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
