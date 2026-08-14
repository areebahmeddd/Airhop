// Global alert modal, the visual counterpart to src/store/alert-store.ts's
// `showAlert()`. Mounted once at the app root (App.tsx) so any screen can call
// `showAlert(title, message, buttons)` and get this design-language dialog
// instead of the OS-native Alert.alert box.
//
// It rides the app's one BottomSheet, so a confirm or a notice slides up from
// the bottom exactly like every picker and panel does, landing within a thumb's
// reach, rather than dropping a generic card in the middle of the screen. One
// modal language, everywhere.
//
// Buttons stack full-width, the most notable action on top: a non-cancel button
// (destructive red, or solid default) first, the cancel button, if any, plain
// underneath and so closest to the thumb, the safe action easiest to hit. A
// backdrop tap or a drag-down dismisses; neither invokes a button's onPress, so
// a stray gesture can never trigger a destructive action.

import { type AlertButtonConfig, useAlertStore } from "@store/alert-store";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../theme";
import BottomSheet from "./bottom-sheet";

// Height of a dialog button. Comfortably past the 44pt floor because these are
// the app's confirm/cancel pairs, several of them destructive, and they are
// stacked so there is no adjacency to worry about.
const ALERT_BUTTON_HEIGHT = 50;

export default function AlertModal(): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const insets = useSafeAreaInsets();
  const { visible, title, message, buttons, hide } = useAlertStore();

  const cancelButton = buttons.find((b) => b.style === "cancel");
  const otherButtons = buttons.filter((b) => b.style !== "cancel");
  const ordered = [...otherButtons, ...(cancelButton ? [cancelButton] : [])];

  function handlePress(button: AlertButtonConfig): void {
    hide();
    button.onPress?.();
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={hide}
      // Clear the device's gesture-nav inset so the bottom-most button never
      // sits under the system bar (the sheet renders in its own Modal, outside
      // the screen's SafeAreaView, so it has to bake the inset in itself).
      sheetStyle={[styles.sheet, { paddingBottom: Spacing.xl + insets.bottom }]}
    >
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <View style={styles.actions}>
        {ordered.map((button, i) => (
          <Pressable
            key={`${button.text}-${i}`}
            style={
              button.style === "default" || button.style === undefined
                ? styles.btnDefault
                : styles.btnOutline
            }
            onPress={() => handlePress(button)}
            accessibilityRole="button"
            accessibilityLabel={button.text}
          >
            <Text
              style={
                button.style === "destructive"
                  ? styles.btnDestructiveText
                  : button.style === "cancel"
                    ? styles.btnCancelText
                    : styles.btnDefaultText
              }
            >
              {button.text}
            </Text>
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    sheet: {
      paddingHorizontal: Spacing.xl,
      gap: Spacing.sm,
    },
    title: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    message: {
      fontSize: FontSize.base,
      color: Colors.textSecondary,
      lineHeight: 21,
      marginBottom: Spacing.sm,
    },
    actions: {
      width: "100%",
      gap: Spacing.sm,
      marginTop: Spacing.xs,
    },
    btnDefault: {
      width: "100%",
      minHeight: ALERT_BUTTON_HEIGHT,
      borderRadius: Radius.full,
      backgroundColor: Colors.accent,
      alignItems: "center",
      justifyContent: "center",
    },
    btnDefaultText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      color: Colors.textInverse,
    },
    btnOutline: {
      width: "100%",
      minHeight: ALERT_BUTTON_HEIGHT,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    btnDestructiveText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.danger,
    },
    btnCancelText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
  });
}
