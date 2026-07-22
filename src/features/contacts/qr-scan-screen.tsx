// Add-contact screen: for a peer that isn't visible on the mesh radar.
//
// Camera-first, matching the common WhatsApp / Signal / Telegram pattern:
// the scanner opens immediately, no chooser screen first. Manual Peer ID entry
// remains as a quiet secondary path (a text link) rather than an upfront option
// that needs explaining. Both paths converge on the same confirm step (avatar,
// username, peer ID, then Add Contact / Re-scan) before a contact is actually
// added, so identity is always double-checked regardless of how the ID arrived.
//
// A scanned QR carries a full contact card (peer ID + Noise and Ed25519 public
// keys + nickname) and its peer ID is verified against the fingerprint of its
// own Noise key before it is accepted. A manually typed ID carries no keys, so
// that contact stays unverified until their first ANNOUNCE arrives.

import { Feather } from "@expo/vector-icons";
import { bytesToHex } from "@noble/hashes/utils.js";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  decodeQRContent,
  type ContactCard,
} from "../../core/crypto/contact-exchange";
import { getMeshService } from "../../services/mesh-service";
import { useContactsStore } from "../../store/contacts-store";
import Avatar from "../../ui/components/avatar";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { peerIDToUsername } from "../../utils/username";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  visible: boolean;
  onClose: () => void;
  onPeerFound: (peerID: string) => void;
}

type Stage = "camera" | "manual" | "confirm";

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

// Result of reading a scanned payload. A full contact card carries the peer's
// public keys; a bare peer ID (older builds, manual entry, shared deep-link)
// identifies them but proves nothing and cannot seed an encrypted session.
interface ScanResult {
  peerID: string;
  card: ContactCard | null;
}

// Parse either a v1 contact card (`airhop:v1/<base64url>`) or a bare peer ID.
// Card parsing is tried first: it is strictly more informative, and the two
// formats are unambiguous.
function parseScan(raw: string): ScanResult | null {
  const card = decodeQRContent(raw.trim());
  if (card) return { peerID: card.peerID.toLowerCase(), card };
  const peerID = parsePeerID(raw);
  return peerID ? { peerID, card: null } : null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function QrScanScreen({
  visible,
  onClose,
  onPeerFound,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [stage, setStage] = useState<Stage>("camera");
  const [foundPeerID, setFoundPeerID] = useState<string | null>(null);
  // Keys from a scanned contact card, when the payload carried them.
  const [foundCard, setFoundCard] = useState<ContactCard | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  // Guards against onBarcodeScanned firing repeatedly while a code stays
  // in frame: only the first read in a scan session is used.
  const hasScannedRef = useRef(false);

  // Request camera access as soon as the scanner is shown. If it's denied,
  // fall back to manual entry rather than showing a dead camera view.
  useEffect(() => {
    if (!visible || stage !== "camera" || cameraPermission?.granted) return;
    requestCameraPermission().then((result) => {
      if (!result.granted) setStage("manual");
    });
  }, [visible, stage, cameraPermission, requestCameraPermission]);

  function resetAll(): void {
    setStage("camera");
    setFoundPeerID(null);
    setInput("");
    setError(null);
    hasScannedRef.current = false;
  }

  function handleClose(): void {
    resetAll();
    onClose();
  }

  function handleBarcodeScanned(data: string): void {
    if (hasScannedRef.current) return;
    const result = parseScan(data);
    if (!result) return; // Not an Airhop QR code, keep scanning.
    hasScannedRef.current = true;
    setFoundPeerID(result.peerID);
    setFoundCard(result.card);
    setStage("confirm");
  }

  function handleManualContinue(): void {
    const parsed = parsePeerID(input);
    if (!parsed) {
      setError(
        "Enter a valid 16-character peer ID or paste an airhop://peer/… link.",
      );
      return;
    }
    setError(null);
    setFoundPeerID(parsed);
    // Typed IDs carry no keys, so this contact stays unverified until we hear
    // their ANNOUNCE.
    setFoundCard(null);
    setStage("confirm");
  }

  function handleRescan(): void {
    setFoundPeerID(null);
    setFoundCard(null);
    hasScannedRef.current = false;
    setStage("camera");
  }

  function handleConfirmAdd(): void {
    if (!foundPeerID) return;
    const peerID = foundPeerID;
    const card = foundCard;

    if (card) {
      // Reject a card whose peer ID isn't the fingerprint of its own Noise key.
      // Such a QR is claiming an identity it cannot prove. Accepting it would
      // mean every DM "to that contact" gets encrypted to whoever forged it.
      const accepted = getMeshService()?.addVerifiedContact(card) ?? false;
      if (!accepted) {
        setError(
          "This QR code is invalid: its peer ID doesn't match its keys. It may have been tampered with.",
        );
        setStage("manual");
        return;
      }
      useContactsStore.getState().addContact({
        peerID: card.peerID,
        noisePubKeyHex: bytesToHex(card.noisePubKey),
        signingPubKeyHex: bytesToHex(card.signingPubKey),
        nickname: card.nickname,
        addedAtMs: Date.now(),
        source: "qr",
      });
    } else {
      // Peer ID only: remember them so the contact survives a restart, but
      // record that we hold no keys for them yet.
      useContactsStore.getState().addContact({
        peerID,
        noisePubKeyHex: "",
        signingPubKeyHex: "",
        nickname: "",
        addedAtMs: Date.now(),
        source: "manual",
      });
    }

    resetAll();
    onPeerFound(peerID);
  }

  // Phone-to-phone NFC contact exchange was removed, not merely left unwired.
  // iOS has no host card emulation: an iPhone cannot present an NDEF tag for
  // another phone to read, and Core NFC only READS tags. An iOS<->Android tap
  // is therefore impossible, and no write/emit side existed on either platform
  // -- there was literally nothing to tap. The QR path covers this on both
  // platforms and now carries the peer public keys.

  const foundUsername = foundPeerID ? peerIDToUsername(foundPeerID) : "";
  const canContinueManual = parsePeerID(input) !== null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.root}>
        {stage === "camera" && (
          <>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={(result) => handleBarcodeScanned(result.data)}
            />
            <SafeAreaView style={styles.scanChrome}>
              <View style={styles.scanTopBar}>
                <Pressable
                  onPress={handleClose}
                  style={styles.scanIconBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <Feather name="x" size={22} color="#FFFFFF" />
                </Pressable>
                <Text style={styles.scanTitle}>Scan to Add</Text>
                <View style={styles.scanIconBtn} />
              </View>

              <View style={styles.scanFrameWrap} pointerEvents="none">
                <View style={styles.scanFrame} />
                <Text style={styles.scanHint}>
                  Point your camera at their QR code
                </Text>
              </View>

              <View style={styles.scanBottomBar}>
                <Pressable
                  onPress={() => setStage("manual")}
                  accessibilityRole="button"
                  accessibilityLabel="Enter Peer ID manually"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.scanManualLink}>
                    Enter Peer ID manually
                  </Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </>
        )}

        {stage === "manual" && (
          <SafeAreaView style={styles.formRoot}>
            <View style={styles.formHeader}>
              <Pressable
                onPress={() => setStage("camera")}
                style={styles.backBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Back to scanner"
              >
                <Feather
                  name="chevron-left"
                  size={24}
                  color={Colors.textPrimary}
                />
              </Pressable>
              <Text style={styles.formTitle}>Enter Peer ID</Text>
              <View style={styles.backBtn} />
            </View>

            <View style={styles.formBody}>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                value={input}
                onChangeText={(v) => {
                  setInput(v);
                  setError(null);
                }}
                placeholder="Peer ID or airhop://peer/… link"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                autoFocus
                onSubmitEditing={handleManualContinue}
                selectionColor={Colors.accent}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Pressable
                style={[
                  styles.primaryBtn,
                  !canContinueManual && styles.primaryBtnDisabled,
                ]}
                onPress={handleManualContinue}
                disabled={!canContinueManual}
              >
                <Text style={styles.primaryBtnText}>Continue</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        )}

        {stage === "confirm" && foundPeerID && (
          <SafeAreaView style={styles.confirmRoot}>
            <Pressable
              onPress={handleClose}
              style={[styles.backBtn, styles.confirmCloseBtn]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Feather name="x" size={22} color={Colors.textSecondary} />
            </Pressable>

            <View style={styles.confirmBody}>
              <Avatar username={foundUsername} peerID={foundPeerID} size={88} />
              <Text style={styles.confirmUsername}>{foundUsername}</Text>
              <Text style={styles.confirmPeerID}>{foundPeerID}</Text>
            </View>

            <View style={styles.confirmActions}>
              <Pressable
                style={styles.primaryBtn}
                onPress={handleConfirmAdd}
                accessibilityRole="button"
                accessibilityLabel="Add contact"
              >
                <Text style={styles.primaryBtnText}>Add Contact</Text>
              </Pressable>
              <Pressable
                onPress={handleRescan}
                accessibilityRole="button"
                accessibilityLabel="Re-scan"
              >
                <Text style={styles.rescanText}>Re-scan</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        )}
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    // ---- Camera scan chrome: fixed dark scrim regardless of app theme,
    // matching the platform-standard scanner look (iOS/Android system
    // scanners are always dark-on-camera, not theme-aware). ----
    scanChrome: {
      flex: 1,
      justifyContent: "space-between",
    },
    scanTopBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.sm,
    },
    scanIconBtn: {
      width: 40,
      height: 40,
      borderRadius: Radius.full,
      backgroundColor: "rgba(0,0,0,0.4)",
      alignItems: "center",
      justifyContent: "center",
    },
    scanNfcBtn: {
      marginBottom: Spacing.md,
    },
    scanTitle: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: "#FFFFFF",
    },
    scanFrameWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.lg,
    },
    scanFrame: {
      width: 240,
      height: 240,
      borderRadius: Radius.xl,
      borderWidth: 2,
      borderColor: "#FFFFFF",
    },
    scanHint: {
      fontSize: FontSize.sm,
      color: "#FFFFFF",
      textAlign: "center",
    },
    scanBottomBar: {
      alignItems: "center",
      paddingBottom: Spacing.xl,
      gap: Spacing.sm,
    },
    scanManualLink: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.medium,
      color: "#FFFFFF",
      textDecorationLine: "underline",
    },
    // ---- Manual entry form ----
    formRoot: {
      flex: 1,
      backgroundColor: Colors.bg,
    },
    formHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.base,
      height: 56,
    },
    backBtn: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    formTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    formBody: {
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.lg,
      gap: Spacing.md,
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
    },
    primaryBtn: {
      width: "100%",
      minHeight: 50,
      backgroundColor: Colors.accent,
      borderRadius: Radius.full,
      paddingVertical: Spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryBtnDisabled: {
      opacity: 0.38,
    },
    primaryBtnText: {
      fontSize: FontSize.base,
      color: Colors.textInverse,
      fontWeight: FontWeight.bold,
    },
    // ---- Confirm step ----
    confirmRoot: {
      flex: 1,
      backgroundColor: Colors.bg,
      paddingHorizontal: Spacing.xl,
    },
    confirmCloseBtn: {
      alignSelf: "flex-end",
      marginTop: Spacing.sm,
    },
    confirmBody: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
    },
    confirmUsername: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
      marginTop: Spacing.md,
    },
    confirmPeerID: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      fontFamily: "monospace",
      letterSpacing: 0.8,
    },
    confirmActions: {
      alignItems: "center",
      gap: Spacing.base,
      paddingBottom: Spacing.xl,
    },
    rescanText: {
      fontSize: FontSize.base,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
  });
}
