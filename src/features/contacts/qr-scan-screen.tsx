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
import React, { useMemo, useRef, useState } from "react";
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
import { t, useT } from "../../i18n";
import { chevronBack } from "../../i18n/layout";
import { getMeshService } from "../../services/mesh-service";
import { useContactsStore } from "../../store/contacts-store";
import Avatar from "../../ui/components/avatar";
import BottomSheet from "../../ui/components/bottom-sheet";
import {
  DISABLED_OPACITY,
  FontFamily,
  FontSize,
  FontWeight,
  HIT_SLOP,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { ensurePermission } from "../../utils/permissions";
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
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [stage, setStage] = useState<Stage>("entry");
  const [foundPeerID, setFoundPeerID] = useState<string | null>(null);
  // Keys from a scanned contact card, when the payload carried them.
  const [foundCard, setFoundCard] = useState<ContactCard | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, requestCameraPermission, getCameraPermission] =
    useCameraPermissions();
  // Guards against onBarcodeScanned firing repeatedly while a code stays
  // in frame: only the first read in a scan session is used.
  const hasScannedRef = useRef(false);

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
      setError(t("contacts.scan.invalid_id"));
      return;
    }
    setError(null);
    setFoundPeerID(parsed);
    // Typed IDs carry no keys, so this contact stays unverified until we hear
    // their ANNOUNCE.
    setFoundCard(null);
    setStage("confirm");
  }

  // Open the live camera scanner.
  //
  // Permission is settled BEFORE the camera stage is entered, not alongside it.
  // Mounting CameraView while the OS prompt is still up hands it a denied
  // camera; expo-camera doesn't re-acquire the device when the answer arrives,
  // so granting access left the user staring at a permanently black preview.
  // Asking first means the camera view only ever mounts with a camera it can
  // actually open.
  async function handleScanWithCamera(): Promise<void> {
    setError(null);
    const granted = await ensurePermission(
      getCameraPermission,
      requestCameraPermission,
      {
        label: t("contacts.scan.camera_label"),
        purpose: t("contacts.scan.camera_purpose"),
      },
    );
    if (!granted) {
      // A plain "not now" needs no dialog on top of the one just dismissed:
      // the hub already offers two other ways to add someone.
      setError(t("contacts.scan.camera_needed"));
      return;
    }
    hasScannedRef.current = false;
    setStage("camera");
  }

  // The camera opened but the device wouldn't start (already in use by another
  // app, or unavailable on this hardware). Say so instead of leaving the black
  // preview to speak for itself.
  function handleCameraMountError(): void {
    setError(t("contacts.scan.camera_failed"));
    setStage("entry");
  }

  // Decode a QR from an image the user already has saved, no camera needed.
  async function handlePickFromGallery(): Promise<void> {
    setError(null);
    const granted = await ensurePermission(
      () => ImagePicker.getMediaLibraryPermissionsAsync(),
      () => ImagePicker.requestMediaLibraryPermissionsAsync(),
      {
        label: t("contacts.scan.photo_label"),
        purpose: t("contacts.scan.photo_purpose"),
      },
    );
    if (!granted) {
      setError(t("contacts.scan.photo_needed"));
      return;
    }
    // Inside the try, not before it. The launch can reject on its own - the OS
    // refusing to present, a provider crash - and this runs from an onPress as a
    // bare async call, so a rejection there was unhandled: the sheet stayed open
    // and the error line this screen already has was never set.
    try {
      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });
      if (picked.canceled || !picked.assets[0]) return;
      const scans = await scanFromURLAsync(picked.assets[0].uri, ["qr"]);
      const raw = scans[0]?.data;
      const result = raw ? parseScan(raw) : null;
      if (!result) {
        setError(t("contacts.scan.no_qr"));
        return;
      }
      setFoundPeerID(result.peerID);
      setFoundCard(result.card);
      setStage("confirm");
    } catch {
      setError(t("contacts.scan.unreadable"));
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
      const accepted =
        getMeshService()?.addVerifiedContact(card, { inPerson: true }) ?? false;
      if (!accepted) {
        setError(t("contacts.scan.tampered"));
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
      ? Colors.verified
      : Colors.textMuted;
  const confirmPillLabel = alreadyContact
    ? T("contacts.scan.already_added")
    : foundCard
      ? T("contacts.qr.verified")
      : T("contacts.qr.not_verified");
  const confirmPrimaryLabel = alreadyContact
    ? T("contacts.qr.message")
    : T("contacts.qr.add");

  // The entry and confirm steps ride in a bottom sheet, matching the app's other
  // sheets (contact info, channel info). The camera is a full-bleed surface
  // stacked OVER that sheet rather than replacing it: dismissing one modal in
  // the same frame as another is presented is how you end up with neither, and
  // keeping the sheet mounted underneath means backing out of the camera lands
  // exactly where it left off.
  return (
    <>
      <Modal
        visible={visible && stage === "camera"}
        animationType="slide"
        presentationStyle="fullScreen"
        // System back does what the on-screen back arrow does: step out of the
        // camera to the hub, not out of adding a contact altogether.
        onRequestClose={() => setStage("entry")}
      >
        <View style={styles.root}>
          {/* Mounted only once permission is granted (see handleScanWithCamera),
              so this is never the black rectangle of a denied camera. */}
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={(result) => handleBarcodeScanned(result.data)}
            onMountError={handleCameraMountError}
          />
          <SafeAreaView style={styles.scanChrome}>
            <View style={styles.scanTopBar}>
              <Pressable
                onPress={() => setStage("entry")}
                style={styles.scanIconBtn}
                hitSlop={HIT_SLOP}
                accessibilityRole="button"
                accessibilityLabel={T("common.back")}
              >
                <Feather name={chevronBack} size={24} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.scanTitle}>
                {T("contacts.qr.scan_title")}
              </Text>
              <View style={styles.scanIconBtn} />
            </View>

            <View style={styles.scanFrameWrap} pointerEvents="none">
              <View style={styles.scanFrame} />
              <Text style={styles.scanHint}>{T("contacts.qr.aim")}</Text>
            </View>

            <View style={styles.scanBottomBar} />
          </SafeAreaView>
        </View>
      </Modal>

      <BottomSheet
        visible={visible}
        onClose={handleClose}
        sheetStyle={styles.sheet}
      >
        {stage !== "confirm" && (
          <>
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>{T("contacts.qr.add")}</Text>
              <Text style={styles.sheetSubtitle}>
                {T("contacts.qr.add_desc")}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>{T("contacts.qr.peer_id")}</Text>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                value={input}
                onChangeText={(v) => {
                  setInput(v);
                  setError(null);
                }}
                placeholder={T("contacts.qr.peer_id_placeholder")}
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleManualContinue}
                selectionColor={Colors.selection}
              />
              <Text style={styles.fieldHint}>
                {T("contacts.qr.peer_id_hint")}
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
              accessibilityRole="button"
              accessibilityLabel={T("common.continue")}
              accessibilityState={{ disabled: !canContinueManual }}
            >
              <Text style={styles.primaryBtnText}>{T("common.continue")}</Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{T("contacts.qr.or_scan")}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* One grouped card with a hairline divider, matching the
                "Start something new" chooser so the two sheets read alike. */}
            <View style={styles.optionGroup}>
              <Pressable
                style={styles.optionRow}
                onPress={handleScanWithCamera}
                accessibilityRole="button"
                accessibilityLabel={T("contacts.qr.scan_camera_a11y")}
              >
                <View style={styles.optionIcon}>
                  <Feather name="camera" size={18} color={Colors.textPrimary} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>
                    {T("contacts.qr.scan_title")}
                  </Text>
                  <Text style={styles.optionSub}>
                    {T("contacts.qr.scan_camera_desc")}
                  </Text>
                </View>
              </Pressable>

              <View style={styles.optionDivider} />

              <Pressable
                style={styles.optionRow}
                onPress={handlePickFromGallery}
                accessibilityRole="button"
                accessibilityLabel={T("contacts.qr.upload_a11y")}
              >
                <View style={styles.optionIcon}>
                  <Feather name="image" size={18} color={Colors.textPrimary} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>
                    {T("contacts.qr.upload")}
                  </Text>
                  <Text style={styles.optionSub}>
                    {T("contacts.qr.upload_desc")}
                  </Text>
                </View>
              </Pressable>
            </View>

            <View style={styles.noteRow}>
              <Feather name="shield" size={14} color={Colors.verified} />
              <Text style={styles.noteText}>{T("contacts.qr.trust_note")}</Text>
            </View>
          </>
        )}

        {stage === "confirm" && foundPeerID && (
          <>
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
                accessibilityLabel={T("common.back")}
              >
                <Text style={styles.rescanText}>{T("common.back")}</Text>
              </Pressable>
            </View>
          </>
        )}
      </BottomSheet>
    </>
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
    // ---- Bottom sheet body (entry + confirm). Scrim, handle and drag come
    // from BottomSheet; this is only what's inside it. ----
    sheet: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing["2xl"],
      gap: Spacing.base,
    },
    // ---- Entry hub (paste peer ID, or choose a scan source) ----
    sheetHead: {
      gap: Spacing.xs,
    },
    sheetTitle: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
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
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      color: Colors.textPrimary,
      fontSize: FontSize.sm,
      fontFamily: FontFamily.mono,
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
    optionGroup: {
      backgroundColor: Colors.surfaceRaised,
      borderRadius: Radius.lg,
      overflow: "hidden",
    },
    optionDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginStart: Spacing.base,
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.base,
    },
    optionIcon: {
      width: 38,
      height: 38,
      borderRadius: Radius.full,
      backgroundColor: Colors.surface,
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
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 18,
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
      opacity: DISABLED_OPACITY,
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
      fontFamily: FontFamily.mono,
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
