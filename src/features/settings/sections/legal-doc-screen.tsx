// Shared reader layout for legal documents (Terms of Service, Privacy
// Policy) rendered natively in-app, rather than sending the user out to
// the website. FAQ stays an external link since it benefits from the
// website's search and formatting; these two are short enough to read
// as plain settled text.
//
// Mirrors the landing page's structure, not just its words: a section can
// be a plain paragraph or a bulleted list, and either can contain inline
// **bold** emphasis, the same shape as the <ul>/<strong> markup on
// landing/src/pages/PrivacyPage.tsx and TermsPage.tsx, so the two stay
// visually consistent, not just textually.

import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  FontSize,
  FontWeight,
  Spacing,
  useThemeColors,
} from "../../../ui/theme";
import { SubHeader, useSharedStyles } from "../shared";

// A block is either a paragraph string or a bulleted list of strings.
// Any string (paragraph or bullet item) may contain **bold** spans.
export type LegalBlock = string | { bullets: string[] };

export interface LegalSection {
  heading: string;
  paragraphs: LegalBlock[];
}

interface Props {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
  onBack: () => void;
}

export default function LegalDocScreen({
  title,
  lastUpdated,
  sections,
  onBack,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const shared = useSharedStyles();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  return (
    <View style={shared.container}>
      <SubHeader title={title} onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>
        {sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.heading}>{section.heading}</Text>
            {section.paragraphs.map((block, i) =>
              typeof block === "string" ? (
                <RichText
                  key={i}
                  text={block}
                  style={styles.paragraph}
                  boldStyle={styles.bold}
                />
              ) : (
                <View key={i} style={styles.list}>
                  {block.bullets.map((item, j) => (
                    <View key={j} style={styles.listRow}>
                      <View style={styles.dot} />
                      <RichText
                        text={item}
                        style={styles.listText}
                        boldStyle={styles.bold}
                      />
                    </View>
                  ))}
                </View>
              ),
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// Splits on **bold** markers and renders each span inline within one Text.
// RN Text nests fine, and an unstyled nested Text inherits its parent's
// color/fontSize, so bold spans only need to add fontWeight.
function RichText({
  text,
  style,
  boldStyle,
}: {
  text: string;
  style: object;
  boldStyle: object;
}): React.JSX.Element {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <Text style={style}>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <Text key={i} style={boldStyle}>
            {part.slice(2, -2)}
          </Text>
        ) : (
          <Text key={i}>{part}</Text>
        ),
      )}
    </Text>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    content: {
      padding: Spacing.base,
      paddingBottom: Spacing["3xl"],
      gap: Spacing.xl,
    },
    lastUpdated: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    section: {
      gap: Spacing.sm,
    },
    heading: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    paragraph: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm * 1.6,
    },
    bold: {
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    list: {
      gap: Spacing.sm,
    },
    listRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.sm,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.textMuted,
      marginTop: 8,
      flexShrink: 0,
    },
    listText: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: FontSize.sm * 1.6,
    },
  });
}
