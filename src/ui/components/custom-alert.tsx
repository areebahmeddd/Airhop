// Global alert modal, the visual counterpart to src/store/alert-store.ts's
// `showAlert()`. Mounted once at the app root (App.tsx) so any screen can
// call `showAlert(title, message, buttons)` and get this design-language
// modal instead of the OS-native Alert.alert box.
//
// Centered card, same shape as message-thread.tsx's screenshot notice
// modal. Buttons stack full-width, most-notable action on top: a
// non-cancel button (destructive red, or solid default) first, the cancel
// button, if any, plain/bordered underneath. Tapping the backdrop only
// dismisses; it never invokes a button's onPress, so a stray tap can't
// accidentally trigger a destructive action.

import React, { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { type AlertButtonConfig, useAlertStore } from "../../store/alert-store";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../theme";

export default function CustomAlert(): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const { visible, title, message, buttons, hide } = useAlertStore();

  const cancelButton = buttons.find((b) => b.style === "cancel");
  const otherButtons = buttons.filter((b) => b.style !== "cancel");
  const ordered = [...otherButtons, ...(cancelButton ? [cancelButton] : [])];

  function handlePress(button: AlertButtonConfig): void {
    hide();
    button.onPress?.();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={hide}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={hide} />
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.actions}>
            {ordered.map((button, i) => (
              <Pressable
                key={`${button.text}-${i}`}
                style={
                  button.style === "destructive"
                    ? styles.btnDestructive
                    : button.style === "cancel"
                      ? styles.btnCancel
                      : styles.btnDefault
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
        </View>
      </View>
    </Modal>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: Colors.overlay,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.xl,
    },
    card: {
      width: "100%",
      maxWidth: 340,
      backgroundColor: Colors.surface,
      borderRadius: Radius.xl,
      padding: Spacing.xl,
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
    },
    btnDefault: {
      width: "100%",
      minHeight: 50,
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
    btnDestructive: {
      width: "100%",
      minHeight: 50,
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
    btnCancel: {
      width: "100%",
      minHeight: 50,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    btnCancelText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
  });
}
