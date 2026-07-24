// Add-contact screen: for a peer that isn't visible on the mesh radar.
//
// Entry-first: tapping "Add contact" opens a small hub, not the camera. From
// there a peer ID can be pasted or typed, or their QR scanned with the camera or
// picked from a saved image in the gallery. This keeps the common case (someone
// texts you their ID) one paste away, and treats the camera as a deliberate
// choice rather than an interruption. All three paths converge on the same
// confirm step (avatar, username, peer ID, then Add Contact) before a contact is
// actually added, so identity is always double-checked regardless of how the ID
// arrived.
//
// A scanned QR carries a full contact card (peer ID + Noise and Ed25519 public
// keys + nickname) and its peer ID is verified against the fingerprint of its
// own Noise key before it is accepted. A manually typed ID carries no keys, so
// that contact stays unverified until their first ANNOUNCE arrives.

import { Feather } from "@expo/vector-icons";
import { bytesToHex } from "@noble/hashes/utils.js";
import {
  CameraView,
  scanFromURLAsync,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
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

type Stage = "entry" | "camera" | "confirm";

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
  const [stage, setStage] = useState<Stage>("entry");
  const [foundPeerID, setFoundPeerID] = useState<string | null>(null);
  // Keys from a scanned contact card, when the payload carried them.
  const [foundCard, setFoundCard] = useState<ContactCard | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  // Guards against onBarcodeScanned firing repeatedly while a code stays
  // in frame: only the first read in a scan session is used.
  const hasScannedRef = useRef(false);

  // Request camera access when the scanner opens. If it's denied, fall back to
  // the entry hub with a note rather than showing a dead camera view.
  useEffect(() => {
    if (!visible || stage !== "camera" || cameraPermission?.granted) return;
    requestCameraPermission().then((result) => {
      if (!result.granted) {
        setError(
          "Camera access is off. Turn it on in Settings, or add by peer ID.",
        );
        setStage("entry");
      }
    });
  }, [visible, stage, cameraPermission, requestCameraPermission]);

  function resetAll(): void {
    setStage("entry");
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

  // Open the live camera scanner. Permission is requested by the effect above.
  function handleScanWithCamera(): void {
    setError(null);
    hasScannedRef.current = false;
    setStage("camera");
  }

  // Decode a QR from an image the user already has saved, no camera needed.
  async function handlePickFromGallery(): Promise<void> {
    setError(null);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      setError(
        "Grant photo access to scan a saved QR image, or add by peer ID.",
      );
      return;
    }
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });
    if (picked.canceled || !picked.assets[0]) return;
    try {
      const scans = await scanFromURLAsync(picked.assets[0].uri, ["qr"]);
      const raw = scans[0]?.data;
      const result = raw ? parseScan(raw) : null;
      if (!result) {
        setError("No Airhop QR code found in that image.");
        return;
      }
      setFoundPeerID(result.peerID);
      setFoundCard(result.card);
      setStage("confirm");
    } catch {
      setError("Couldn't read a QR code from that image.");
    }
  }

  function handleRescan(): void {
    setFoundPeerID(null);
    setFoundCard(null);
    hasScannedRef.current = false;
    setStage("entry");
  }

  function handleConfirmAdd(): void {
    if (!foundPeerID) return;
    const peerID = foundPeerID;
    const card = foundCard;
    // Read fresh: never clobber an existing contact's saved fields (nickname,
    // added date, learned Nostr key) just because we saw them again.
    const prior = useContactsStore.getState().getContact(peerID);

    if (card) {
      // Reject a card whose peer ID isn't the fingerprint of its own Noise key.
      // Such a QR is claiming an identity it cannot prove. Accepting it would
      // mean every DM "to that contact" gets encrypted to whoever forged it.
      const accepted = getMeshService()?.addVerifiedContact(card) ?? false;
      if (!accepted) {
        setError(
          "This QR code is invalid: its peer ID doesn't match its keys. It may have been tampered with.",
        );
        setStage("entry");
        return;
      }
      // Scanning a card upgrades a known peer to verified without disturbing a
      // name they chose. The card also carries the peer's Nostr pubkey, which
      // makes them reachable over the internet even if we never meet on BLE.
      useContactsStore.getState().addContact({
        ...prior,
        peerID: card.peerID,
        noisePubKeyHex: bytesToHex(card.noisePubKey),
        signingPubKeyHex: bytesToHex(card.signingPubKey),
        nickname: prior?.nickname.trim() ? prior.nickname : card.nickname,
        addedAtMs: prior?.addedAtMs ?? Date.now(),
        source: "qr",
        // The card always carries the peer's Nostr pubkey, which makes them
        // reachable over the internet even if we never meet on Bluetooth.
        nostrPubkeyHex: bytesToHex(card.nostrPubKey),
      });
    } else if (!prior) {
      // New peer, ID only: remember them so the contact survives a restart, but
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
    // else: already saved and a bare ID carries nothing new. Leave their record
    // untouched and just open the conversation.

    resetAll();
    onPeerFound(peerID);
  }

  const foundUsername = foundPeerID ? peerIDToUsername(foundPeerID) : "";
  const canContinueManual = parsePeerID(input) !== null;

  // Is this peer already saved? Drives the confirm step: an existing contact is
  // shown by their saved name with a "Message" action, a new one with "Add
  // Contact". Reactive so the sheet reflects a contact added moments earlier.
  const existingContact = useContactsStore((s) =>
    foundPeerID ? s.contacts[foundPeerID] : undefined,
  );
  const alreadyContact = existingContact !== undefined;
  const confirmName =
    existingContact && existingContact.nickname.trim().length > 0
      ? existingContact.nickname
      : foundUsername;
  // Confirm-step status: an existing contact takes precedence over the
  // verified/unverified read of the payload we just scanned or typed.
  const confirmPillColor = alreadyContact
    ? Colors.textSecondary
    : foundCard
      ? Colors.online
      : Colors.textMuted;
  const confirmPillLabel = alreadyContact
    ? "Already in your contacts"
    : foundCard
      ? "Verified via QR"
      : "Not verified yet";
  const confirmPrimaryLabel = alreadyContact ? "Message" : "Add Contact";

  // The camera is a full-bleed surface; the entry and confirm steps ride in a
  // bottom sheet, matching the app's other sheets (contact info, channel info).
  if (stage === "camera") {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleClose}
      >
        <View style={styles.root}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={(result) => handleBarcodeScanned(result.data)}
          />
          <SafeAreaView style={styles.scanChrome}>
            <View style={styles.scanTopBar}>
              <Pressable
                onPress={() => setStage("entry")}
                style={styles.scanIconBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Back"
              >
                <Feather name="chevron-left" size={24} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.scanTitle}>Scan QR code</Text>
              <View style={styles.scanIconBtn} />
            </View>

            <View style={styles.scanFrameWrap} pointerEvents="none">
              <View style={styles.scanFrame} />
              <Text style={styles.scanHint}>
                Point your camera at their QR code
              </Text>
            </View>

            <View style={styles.scanBottomBar} />
          </SafeAreaView>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        {stage === "entry" && (
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>Add Contact</Text>
              <Text style={styles.sheetSubtitle}>
                Reach someone who isn&apos;t nearby on the mesh.
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Peer ID</Text>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                value={input}
                onChangeText={(v) => {
                  setInput(v);
                  setError(null);
                }}
                placeholder="Paste or type a peer ID"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleManualContinue}
                selectionColor={Colors.accent}
              />
              <Text style={styles.fieldHint}>
                16 characters, or an airhop://peer link.
              </Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

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

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or scan their QR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={styles.optionRow}
              onPress={handleScanWithCamera}
              accessibilityRole="button"
              accessibilityLabel="Scan QR code with camera"
            >
              <View style={styles.optionIcon}>
                <Feather name="camera" size={20} color={Colors.textPrimary} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Scan QR code</Text>
                <Text style={styles.optionSub}>Use your camera</Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={Colors.textMuted}
              />
            </Pressable>

            <Pressable
              style={styles.optionRow}
              onPress={handlePickFromGallery}
              accessibilityRole="button"
              accessibilityLabel="Upload QR image from gallery"
            >
              <View style={styles.optionIcon}>
                <Feather name="image" size={20} color={Colors.textPrimary} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Upload from gallery</Text>
                <Text style={styles.optionSub}>Pick a saved QR image</Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={Colors.textMuted}
              />
            </Pressable>

            <View style={styles.noteRow}>
              <Feather name="shield" size={14} color={Colors.textMuted} />
              <Text style={styles.noteText}>
                Scanning a QR verifies their public key. A typed ID stays
                unverified until you meet on the mesh.
              </Text>
            </View>
          </View>
        )}

        {stage === "confirm" && foundPeerID && (
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.confirmBody}>
              <Avatar username={confirmName} peerID={foundPeerID} size={72} />
              <Text style={styles.confirmUsername}>{confirmName}</Text>
              <Text style={styles.confirmPeerID}>{foundPeerID}</Text>
              <View style={styles.verifyPill}>
                <Feather
                  name={
                    alreadyContact
                      ? "user-check"
                      : foundCard
                        ? "shield"
                        : "clock"
                  }
                  size={12}
                  color={confirmPillColor}
                />
                <Text style={[styles.verifyText, { color: confirmPillColor }]}>
                  {confirmPillLabel}
                </Text>
              </View>
            </View>

            <View style={styles.confirmActions}>
              <Pressable
                style={styles.primaryBtn}
                onPress={handleConfirmAdd}
                accessibilityRole="button"
                accessibilityLabel={confirmPrimaryLabel}
              >
                <Text style={styles.primaryBtnText}>{confirmPrimaryLabel}</Text>
              </Pressable>
              <Pressable
                onPress={handleRescan}
                accessibilityRole="button"
                accessibilityLabel="Back"
              >
                <Text style={styles.rescanText}>Back</Text>
              </Pressable>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
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
    // ---- Bottom sheet shared chrome (entry + confirm) ----
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
      paddingBottom: Spacing["2xl"],
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
    // ---- Entry hub (paste peer ID, or choose a scan source) ----
    sheetHead: {
      gap: Spacing.xs,
    },
    sheetTitle: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      color: Colors.textPrimary,
    },
    sheetSubtitle: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
    },
    field: {
      gap: Spacing.xs,
    },
    fieldLabel: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: Colors.textSecondary,
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
    fieldHint: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    inputError: {
      borderColor: Colors.danger,
    },
    errorText: {
      fontSize: FontSize.xs,
      color: Colors.danger,
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      marginTop: Spacing.xs,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: Colors.border,
    },
    dividerText: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.base,
      backgroundColor: Colors.surface,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
    },
    optionIcon: {
      width: 40,
      height: 40,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      alignItems: "center",
      justifyContent: "center",
    },
    optionText: {
      flex: 1,
      gap: 2,
    },
    optionTitle: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    optionSub: {
      fontSize: FontSize.xs,
      color: Colors.textMuted,
    },
    noteRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: Spacing.sm,
      marginTop: Spacing.xs,
    },
    noteText: {
      flex: 1,
      fontSize: FontSize.xs,
      color: Colors.textMuted,
      lineHeight: 16,
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
    confirmBody: {
      alignItems: "center",
      gap: Spacing.xs,
      paddingVertical: Spacing.md,
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
    verifyPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.xs,
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.full,
      paddingHorizontal: Spacing.md,
      paddingVertical: 6,
      marginTop: Spacing.sm,
    },
    verifyText: {
      fontSize: FontSize.xs,
      fontWeight: FontWeight.semibold,
    },
    confirmActions: {
      alignItems: "center",
      gap: Spacing.base,
    },
    rescanText: {
      fontSize: FontSize.base,
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
  });
}
