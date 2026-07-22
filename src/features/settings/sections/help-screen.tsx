// Help and feedback sub-screen: contact, bug reports, FAQ, and legal links.

import React from "react";
import { Linking, ScrollView, View } from "react-native";
import {
  GroupDivider,
  SettingLinkRow,
  SubHeader,
  useSharedStyles,
} from "../shared";

interface Props {
  onBack: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export default function HelpScreen({
  onBack,
  onOpenTerms,
  onOpenPrivacy,
}: Props): React.JSX.Element {
  const styles = useSharedStyles();
  return (
    <View style={styles.container}>
      <SubHeader title="Help and feedback" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingLinkRow
              icon="life-buoy"
              label="Contact us"
              description="hi@areeb.dev"
              onPress={() => void Linking.openURL("mailto:hi@areeb.dev")}
              accessibilityLabel="Email hi@areeb.dev"
              external
            />
            <GroupDivider />
            <SettingLinkRow
              icon="alert-circle"
              label="Report a bug"
              description="Open an issue on GitHub"
              onPress={() =>
                void Linking.openURL(
                  "https://github.com/areebahmeddd/airhop/issues/new",
                )
              }
              accessibilityLabel="Report a bug on GitHub"
              external
            />
            <GroupDivider />
            <SettingLinkRow
              icon="help-circle"
              label="Frequently asked questions"
              description="Answers to common questions"
              onPress={() =>
                void Linking.openURL("https://airhop.1mindlabs.org/faq")
              }
              accessibilityLabel="Open FAQ"
              external
            />
            <GroupDivider />
            <SettingLinkRow
              icon="file-text"
              label="Terms of Service"
              description="How Airhop can be used"
              onPress={onOpenTerms}
              accessibilityLabel="Open Terms of Service"
            />
            <GroupDivider />
            <SettingLinkRow
              icon="shield"
              label="Privacy Policy"
              description="What we don't collect"
              onPress={onOpenPrivacy}
              accessibilityLabel="Open Privacy Policy"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
