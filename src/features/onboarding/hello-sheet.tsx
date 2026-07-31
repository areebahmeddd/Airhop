// A short note from the person who made this, shown once over the welcome
// screen. Fresh install and panic wipe both land back on "welcome", so mounting
// it there covers both without any extra flag.
//
// It exists to say four things plainly, before anyone assumes otherwise: who
// built it, who did not, where bugs go, and where a kind word helps. Everything
// else belongs elsewhere.

import React, { useMemo } from "react";
import { Linking, Platform, StyleSheet, Text, View } from "react-native";
import { APP_STORE_URL, GITHUB_URL, PLAY_STORE_URL } from "../../data/app-info";
import { useT } from "../../i18n";
import { useRichText } from "../../i18n/rich-text";
import BottomSheet from "../../ui/components/bottom-sheet";
import PrimaryButton from "../../ui/components/primary-button";
import { FontSize, FontWeight, Spacing, useThemeColors } from "../../ui/theme";

const EMAIL_ADDRESS = "hi@areeb.dev";
const EMAIL_URL = `mailto:${EMAIL_ADDRESS}`;

// Point at the one store the user can actually review on, rather than naming
// both and making them work out which is theirs.
const STORE_NAME = Platform.OS === "ios" ? "App Store" : "Play Store";
const STORE_URL = Platform.OS === "ios" ? APP_STORE_URL : PLAY_STORE_URL;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function HelloSheet({
  visible,
  onClose,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const T = useT();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  // Built once and shared by both paragraphs that mention GitHub, so the two
  // links can never drift apart.
  const links = useMemo(
    () => ({
      github: (
        <Text
          style={styles.link}
          onPress={() => void Linking.openURL(GITHUB_URL)}
          suppressHighlighting
        >
          GitHub
        </Text>
      ),
      email: (
        <Text
          style={styles.link}
          onPress={() => void Linking.openURL(EMAIL_URL)}
          suppressHighlighting
        >
          {EMAIL_ADDRESS}
        </Text>
      ),
      store: (
        <Text
          style={styles.link}
          onPress={() => void Linking.openURL(STORE_URL)}
          suppressHighlighting
        >
          {STORE_NAME}
        </Text>
      ),
    }),
    [styles.link],
  );

  const p2 = useRichText("onboarding.hello.p2", links);
  const p3 = useRichText("onboarding.hello.p3", links);

  return (
    <BottomSheet visible={visible} onClose={onClose} sheetStyle={styles.sheet}>
      <Text style={styles.title}>{T("onboarding.hello.title")}</Text>

      <View style={styles.body}>
        <Text style={styles.paragraph}>{T("onboarding.hello.p1")}</Text>
        <Text style={styles.paragraph}>{p2}</Text>
        <Text style={styles.paragraph}>{p3}</Text>
      </View>

      <PrimaryButton
        label={T("common.ok")}
        onPress={onClose}
        accessibilityLabel={T("common.ok")}
      />
    </BottomSheet>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    sheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      gap: Spacing.base,
    },
    title: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    body: {
      gap: Spacing.md,
    },
    paragraph: {
      fontSize: FontSize.sm,
      lineHeight: FontSize.sm * 1.55,
      color: Colors.textSecondary,
    },
    link: {
      color: Colors.textPrimary,
      fontWeight: FontWeight.medium,
      textDecorationLine: "underline",
    },
  });
}
