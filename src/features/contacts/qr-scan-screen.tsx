// QR / Peer ID contact screen.
// Accepts a peer ID by paste or manual entry.
// A valid peer ID is 16 lowercase hex characters.

import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
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
// Deep-link format exported by Profile → "Share QR".
const AIRHOP_LINK_RE = /^airhop:\/\/peer\/([0-9a-f]{16})$/i;

// Accept a raw 16-char hex peer ID or an airhop://peer/<id> deep-link URL.
function parsePeerID(raw: string): string | null {
  const t = raw.trim().toLowerCase();
  if (PEER_ID_RE.test(t)) return t;
  const m = AIRHOP_LINK_RE.exec(t);
  return m ? (m[1] ?? null) : null;
}

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
  const [nfcSupported, setNfcSupported] = useState(false);
  const [isNfcScanning, setIsNfcScanning] = useState(false);

  // Check NFC availability each time the modal opens.
  useEffect(() => {
    if (!visible) return;
    NfcManager.isSupported()
      .then(setNfcSupported)
      .catch(() => {});
  }, [visible]);

  const parsed = parsePeerID(input);
  const isValid = parsed !== null;

  function handleAdd(): void {
    if (!parsed) {
      setError(
        "Enter a valid 16-character peer ID or paste an airhop://peer/\u2026 link.",
      );
      return;
    }
    setError(null);
    setInput("");
    onPeerFound(parsed);
  }

  function handleClose(): void {
    setInput("");
    setError(null);
    onClose();
  }

  // Read an NDEF URI or text record from an NFC tag and extract the peer ID.
  async function handleNfcScan(): Promise<void> {
    setIsNfcScanning(true);
    try {
      await NfcManager.start();
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      let foundID: string | null = null;
      for (const record of tag?.ndefMessage ?? []) {
        if (!record.payload || typeof record.payload === "string") continue;
        const payload = new Uint8Array(record.payload);
        const rawType = record.type;
        const type =
          rawType && typeof rawType !== "string"
            ? new Uint8Array(rawType)
            : new Uint8Array(0);
        // URI record (TNF=1, type='U'=0x55)
        if (record.tnf === 0x01 && type.length === 1 && type[0] === 0x55) {
          const URIPrefixes: Record<number, string> = {
            0x01: "http://www.",
            0x02: "https://www.",
            0x03: "http://",
            0x04: "https://",
          };
          const prefix = URIPrefixes[payload[0] ?? 0] ?? "";
          const uri = prefix + new TextDecoder().decode(payload.slice(1));
          const m = /airhop:\/\/peer\/([0-9a-f]{16})/i.exec(uri);
          if (m?.[1]) {
            foundID = m[1];
            break;
          }
        }
        // Text record (TNF=1, type='T'=0x54)
        if (record.tnf === 0x01 && type.length === 1 && type[0] === 0x54) {
          const langLen = (payload[0] ?? 0) & 0x3f;
          const text = new TextDecoder().decode(payload.slice(1 + langLen));
          const m =
            /airhop:\/\/peer\/([0-9a-f]{16})/i.exec(text) ??
            /^([0-9a-f]{16})$/i.exec(text.trim());
          if (m?.[1]) {
            foundID = m[1];
            break;
          }
        }
      }
      if (foundID) {
        setInput(foundID);
        setError(null);
      } else {
        Alert.alert(
          "Tag not recognized",
          "This NFC tag does not contain an Airhop peer ID.",
        );
      }
    } catch {
      // User cancelled the NFC session or the device returned an error.
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
      setIsNfcScanning(false);
    }
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
            placeholder="Peer ID or airhop://peer/\u2026 link"
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
            <Feather name="info" size={13} color={Colors.textMuted} />
            <Text style={styles.scanNoteText}>
              Paste a raw Peer ID or the{" "}
              <Text style={styles.scanNoteEmphasis}>airhop://peer/\u2026</Text>{" "}
              link from someone\u2019s Profile \u2192 Share QR. Your own ID is
              on your Profile tab.
            </Text>
          </View>

          {/* NFC scan — shown only on devices with NFC support */}
          {nfcSupported && (
            <Pressable
              style={({ pressed }) => [
                styles.nfcBtn,
                (pressed || isNfcScanning) && { opacity: 0.7 },
              ]}
              onPress={() => void handleNfcScan()}
              disabled={isNfcScanning}
              accessibilityRole="button"
              accessibilityLabel="Scan NFC tag"
            >
              <Feather name="wifi" size={15} color={Colors.textSecondary} />
              <Text style={styles.nfcBtnText}>
                {isNfcScanning ? "Hold near NFC tag…" : "Scan NFC Tag"}
              </Text>
            </Pressable>
          )}

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
  nfcBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceRaised,
    paddingVertical: Spacing.md,
  },
  nfcBtnText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
});
