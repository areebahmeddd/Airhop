// Help and feedback sub-screen: contact, bug reports, FAQ, and legal links.

import React from "react";
import { Linking, View } from "react-native";
import {
  GroupDivider,
  SettingLinkRow,
  SettingsScroll,
  SubHeader,
  useSharedStyles,
} from "../settings-primitives";

import { NEW_ISSUE_URL } from "@data/app-info";
import { useT } from "@i18n";

const CONTACT_EMAIL = "hi@areeb.dev";

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
  const T = useT();
  return (
    <View style={styles.container}>
      <SubHeader title={T("settings.section.help")} onBack={onBack} />
      <SettingsScroll>
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingLinkRow
              id="help-contact"
              icon="life-buoy"
              label={T("settings.help.contact")}
              description={CONTACT_EMAIL}
              onPress={() => void Linking.openURL("mailto:" + CONTACT_EMAIL)}
              accessibilityLabel={T("settings.help.contact_a11y", {
                address: CONTACT_EMAIL,
              })}
              external
            />
            <GroupDivider />
            <SettingLinkRow
              id="help-bug"
              icon="alert-circle"
              label={T("settings.help.bug")}
              description={T("settings.help.bug_desc")}
              onPress={() => void Linking.openURL(NEW_ISSUE_URL)}
              accessibilityLabel={T("settings.help.bug_a11y")}
              external
            />
            <GroupDivider />
            <SettingLinkRow
              id="help-faq"
              icon="help-circle"
              label={T("settings.help.faq")}
              description={T("settings.help.faq_desc")}
              onPress={() =>
                void Linking.openURL("https://airhop.1mindlabs.org/faq")
              }
              accessibilityLabel={T("settings.help.faq_a11y")}
              external
            />
            <GroupDivider />
            <SettingLinkRow
              icon="file-text"
              label={T("legal.terms")}
              description={T("settings.help.terms_desc")}
              onPress={onOpenTerms}
              accessibilityLabel={T("settings.help.terms_a11y")}
            />
            <GroupDivider />
            <SettingLinkRow
              icon="shield"
              label={T("legal.privacy")}
              description={T("settings.help.privacy_desc")}
              onPress={onOpenPrivacy}
              accessibilityLabel={T("settings.help.privacy_a11y")}
            />
          </View>
        </View>
      </SettingsScroll>
    </View>
  );
}
