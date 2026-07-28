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
import BottomSheet from "../../ui/components/bottom-sheet";
import PrimaryButton from "../../ui/components/primary-button";
import { FontSize, FontWeight, Spacing, useThemeColors } from "../../ui/theme";

const EMAIL_URL = "mailto:hi@areeb.dev";

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
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  return (
    <BottomSheet visible={visible} onClose={onClose} sheetStyle={styles.sheet}>
      <Text style={styles.title}>Welcome to Airhop</Text>

      <View style={styles.body}>
        <Text style={styles.paragraph}>
          Hi, I&apos;m Areeb. I built Airhop on top of bitchat as an
          independent, open source side project. It&apos;s not affiliated with
          or endorsed by the bitchat project or permissionless tech, just
          something I enjoy building and sharing with the community.
        </Text>
        <Text style={styles.paragraph}>
          This is the first iOS and Android release, so while I&apos;ve tested
          it with friends, you&apos;ll probably run into a few bugs. If you do,
          or if you have an idea for a feature, I&apos;d love to hear from you.
          Open an issue on{" "}
          <Text
            style={styles.link}
            onPress={() => void Linking.openURL(GITHUB_URL)}
            suppressHighlighting
          >
            GitHub
          </Text>{" "}
          or send me an email at{" "}
          <Text
            style={styles.link}
            onPress={() => void Linking.openURL(EMAIL_URL)}
            suppressHighlighting
          >
            hi@areeb.dev
          </Text>
          .
        </Text>
        <Text style={styles.paragraph}>
          If Airhop is useful to you, consider leaving a star on{" "}
          <Text
            style={styles.link}
            onPress={() => void Linking.openURL(GITHUB_URL)}
            suppressHighlighting
          >
            GitHub
          </Text>{" "}
          or a review on the{" "}
          <Text
            style={styles.link}
            onPress={() => void Linking.openURL(STORE_URL)}
            suppressHighlighting
          >
            {STORE_NAME}
          </Text>
          . It helps more people discover the project. Thanks for giving it a
          try!
        </Text>
      </View>

      <PrimaryButton label="OK" onPress={onClose} accessibilityLabel="OK" />
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
