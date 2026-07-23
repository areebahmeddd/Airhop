// About sub-screen: version, release notes, source, and third-party licenses.
//
// The version shown is this build's own version (from app.json, the single
// source of truth), not a hand-edited constant. Tapping the row opens the
// Version screen, where the running version can be checked against the latest
// GitHub release. Release notes open GitHub's /releases/latest, which always
// redirects to the newest published release, so no fetch happens here.
//
// No Build Number row: Expo doesn't expose a real build number outside an
// EAS build, and this app isn't on EAS yet, so a fabricated number would
// violate the "every row must be real" rule rather than satisfy it.

import React from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import {
  APP_VERSION,
  GITHUB_URL,
  LATEST_RELEASE_PAGE,
} from "../../../data/app-info";
import {
  GroupDivider,
  SettingLinkRow,
  SubHeader,
  useSharedStyles,
} from "../shared";

interface Props {
  onBack: () => void;
  onOpenVersion: () => void;
  onOpenLicenses: () => void;
}

export default function AboutScreen({
  onBack,
  onOpenVersion,
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
            <SettingLinkRow
              icon="tag"
              label="Version"
              description="Current release"
              control={<Text style={styles.settingValue}>{APP_VERSION}</Text>}
              onPress={onOpenVersion}
              accessibilityLabel="View version and check for updates"
            />
            <GroupDivider />
            <SettingLinkRow
              icon="clock"
              label="Release notes"
              description="What's new in the latest release"
              onPress={() => void Linking.openURL(LATEST_RELEASE_PAGE)}
              accessibilityLabel="Open the latest release notes on GitHub"
              external
            />
            <GroupDivider />
            <SettingLinkRow
              icon="github"
              label="Source Code"
              description="areebahmeddd/Airhop"
              onPress={() => void Linking.openURL(GITHUB_URL)}
              accessibilityLabel="Open source code on GitHub"
              external
            />
            <GroupDivider />
            <SettingLinkRow
              icon="file-text"
              label="Open source licenses"
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
