// QR / Peer ID contact screen.
// Accepts a peer ID by paste or manual entry.
// A valid peer ID is 16 lowercase hex characters.

import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../ui/theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  visible: boolean;
  onClose: () => void;
  onPeerFound: (peerID: string) => void;
}

const PEER_ID_RE = /^[0-9a-f]{16}$/;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function QrScanScreen({
  visible,
  onClose,
  onPeerFound,
}: Props): React.JSX.Element {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const trimmed = input.trim().toLowerCase();
  const isValid = PEER_ID_RE.test(trimmed);

  function handleAdd(): void {
    if (!isValid) {
      setError("Enter a valid 16-character hex peer ID.");
      return;
    }
    setError(null);
    setInput("");
    onPeerFound(trimmed);
  }

  function handleClose(): void {
    setInput("");
    setError(null);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Feather
                name="user-plus"
                size={20}
                color={Colors.textSecondary}
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Add contact</Text>
              <Text style={styles.subtitle}>
                {"Enter or paste your contact\u2019s Peer ID."}
              </Text>
            </View>
          </View>

          {/* Input */}
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={input}
            onChangeText={(v) => {
              setInput(v);
              setError(null);
            }}
            placeholder="16-character peer ID (e.g. a7f3b192c8d04e15)"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleAdd}
            selectionColor={Colors.accent}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Guidance */}
          <View style={styles.scanNote}>
            <Feather name="share-2" size={13} color={Colors.textMuted} />
            <Text style={styles.scanNoteText}>
              Your Peer ID is in your Profile tab. Tap{" "}
              <Text style={styles.scanNoteEmphasis}>Share</Text> there to let
              others add you as a contact.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.addBtn, !isValid && styles.addBtnDisabled]}
              onPress={handleAdd}
              disabled={!isValid}
            >
              <Text style={styles.addText}>Add</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius["2xl"],
    borderTopRightRadius: Radius["2xl"],
    padding: Spacing.xl,
    gap: Spacing.base,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderStrong,
    alignSelf: "center",
    marginBottom: Spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  input: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontFamily: "monospace",
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.danger,
    marginTop: -Spacing.xs,
  },
  scanNote: {
    flexDirection: "row",
    gap: Spacing.xs,
    alignItems: "flex-start",
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  scanNoteText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: FontSize.xs * 1.6,
  },
  scanNoteEmphasis: {
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  cancelText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  addBtn: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  addBtnDisabled: {
    opacity: 0.38,
  },
  addText: {
    fontSize: FontSize.base,
    color: Colors.textInverse,
    fontWeight: FontWeight.semibold,
  },
});
