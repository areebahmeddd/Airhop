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
import { useT } from "../../../i18n";
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
  const T = useT();
  return (
    <View style={styles.container}>
      <SubHeader title={T("settings.section.about")} onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingLinkRow
              icon="tag"
              label={T("settings.about.version")}
              description={T("settings.about.version_desc")}
              control={<Text style={styles.settingValue}>{APP_VERSION}</Text>}
              onPress={onOpenVersion}
              accessibilityLabel={T("settings.about.version_a11y")}
            />
            <GroupDivider />
            <SettingLinkRow
              icon="clock"
              label={T("settings.about.release_notes")}
              description={T("settings.about.release_notes_desc")}
              onPress={() => void Linking.openURL(LATEST_RELEASE_PAGE)}
              accessibilityLabel={T("settings.about.release_notes_a11y")}
              external
            />
            <GroupDivider />
            <SettingLinkRow
              icon="github"
              label={T("settings.about.source")}
              description="areebahmeddd/airhop"
              onPress={() => void Linking.openURL(GITHUB_URL)}
              accessibilityLabel={T("settings.about.source_a11y")}
              external
            />
            <GroupDivider />
            <SettingLinkRow
              icon="file-text"
              label={T("settings.about.licenses")}
              description={T("settings.about.licenses_desc")}
              onPress={onOpenLicenses}
              accessibilityLabel={T("settings.about.licenses_a11y")}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
