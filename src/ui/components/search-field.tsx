// The app's one search field: the rounded bar with a leading glyph, used above
// the chat list and inside Settings.
//
// The bar only. Whatever sits beside it (a cancel arrow, a filter row) belongs
// to the screen, which is where the two surfaces genuinely differ.

import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import {
  FontSize,
  hitSlopFor,
  Radius,
  Spacing,
  useThemeColors,
} from "../theme";

const LEADING_GLYPH = 16;
const CLEAR_GLYPH = 16;

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  // A placeholder is not a label: it disappears once there is a query, leaving
  // a screen reader nothing to announce but the text already typed.
  accessibilityLabel: string;
  clearAccessibilityLabel: string;
  onFocus?: () => void;
  inputRef?: React.RefObject<TextInput | null>;
  autoFocus?: boolean;
}

export default function SearchField({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
  clearAccessibilityLabel,
  onFocus,
  inputRef,
  autoFocus,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  return (
    <View style={styles.bar}>
      <Feather name="search" size={LEADING_GLYPH} color={Colors.textMuted} />
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        returnKeyType="search"
        selectionColor={Colors.selection}
        accessibilityLabel={accessibilityLabel}
        autoFocus={autoFocus}
        // A name or content scan, never an address or a sentence.
        autoCorrect={false}
        autoCapitalize="none"
        // iOS has a native clear affordance; the button below covers Android,
        // so only one of the two ever renders.
        clearButtonMode={Platform.OS === "ios" ? "while-editing" : "never"}
      />
      {Platform.OS !== "ios" && value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={hitSlopFor(CLEAR_GLYPH)}
          accessibilityRole="button"
          accessibilityLabel={clearAccessibilityLabel}
        >
          <Feather
            name="x-circle"
            size={CLEAR_GLYPH}
            color={Colors.textMuted}
          />
        </Pressable>
      )}
    </View>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    bar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm + 2,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    input: {
      flex: 1,
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      padding: 0,
    },
  });
}
