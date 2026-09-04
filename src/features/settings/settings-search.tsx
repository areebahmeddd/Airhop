// Settings search: the field, and the ranked list under it.
//
// Deliberately a sibling of the chat search above the chat list: same bar, same
// cancel arrow, so there is one search gesture in the app rather than two.
//
// What it searches lives in settings-index; what a result does belongs to the
// hub, which owns the navigation. This screen hands back the entry.

import { Feather } from "@expo/vector-icons";
import { useT } from "@i18n";
import { arrowBack } from "@i18n/layout";
import EmptyState from "@ui/components/empty-state";
import SearchField from "@ui/components/search-field";
import { FontSize, hitSlopFor, Spacing, useThemeColors } from "@ui/theme";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { searchSettings, type SettingsEntry } from "./settings-index";
import {
  GroupDivider,
  SettingLinkRow,
  useSharedStyles,
} from "./settings-primitives";

const BACK_GLYPH = 20;

interface Props {
  // Controlled by the hub: opening a result unmounts this screen, and coming
  // back to an empty field would make trying the next result cost a retype.
  query: string;
  onChangeQuery: (query: string) => void;
  onClose: () => void;
  onSelect: (entry: SettingsEntry) => void;
}

export default function SettingsSearch({
  query,
  onChangeQuery,
  onClose,
  onSelect,
}: Props): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const shared = useSharedStyles();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  // No debounce, unlike chat search: this walks a fixed list of ~50 rows.
  const hits = useMemo(() => searchSettings(query, T), [query, T]);
  const trimmed = query.trim();

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Pressable
          onPress={onClose}
          hitSlop={hitSlopFor(BACK_GLYPH)}
          accessibilityRole="button"
          accessibilityLabel={T("settings.search.close")}
        >
          <Feather
            name={arrowBack}
            size={BACK_GLYPH}
            color={Colors.textPrimary}
          />
        </Pressable>
        <SearchField
          value={query}
          onChangeText={onChangeQuery}
          placeholder={T("settings.search.placeholder")}
          accessibilityLabel={T("settings.search.a11y")}
          clearAccessibilityLabel={T("settings.search.clear")}
          // Reached by a deliberate tap on the search button, so the keyboard
          // is what was asked for.
          autoFocus
        />
      </View>

      {trimmed.length === 0 ? (
        <View style={styles.hintState}>
          <Text style={styles.hintText}>{T("settings.search.hint")}</Text>
        </View>
      ) : hits.length === 0 ? (
        <EmptyState
          icon="search"
          title={T("settings.search.no_results", { query: trimmed })}
        />
      ) : (
        <ScrollView
          contentContainerStyle={shared.content}
          showsVerticalScrollIndicator={false}
          // A tap on a result opens it rather than only dismissing the keyboard.
          keyboardShouldPersistTaps="handled"
        >
          {/* One bordered group, the shape every settings list is in: a result
              and the row it leads to should not look like different things. */}
          <View style={shared.settingsGroup}>
            {hits.map((hit, i) => (
              <React.Fragment key={hit.entry.key}>
                {i > 0 && <GroupDivider />}
                <SettingLinkRow
                  icon={hit.entry.icon}
                  label={T(hit.entry.labelKey)}
                  // Where it lives, in the slot a description usually takes.
                  description={T(hit.entry.sectionKey)}
                  onPress={() => onSelect(hit.entry)}
                />
              </React.Fragment>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    // Matches the chat search row, so the two fields land in the same place.
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.xs,
    },
    hintState: {
      alignItems: "center",
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing["2xl"],
    },
    hintText: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: "center",
    },
  });
}
