// Verify an existing contact by scanning their QR in person.
//
// Unlike the add-contact scanner, this never starts a conversation: the person
// is already in your DMs. It confirms that whoever is in front of you actually
// owns the identity you have been chatting with, then marks THAT one contact
// verified. A scan whose identity doesn't match the contact is rejected, so
// "verified" always means "I checked this exact person", never "I scanned some
// code once".

import { Feather } from "@expo/vector-icons";
import { bytesToHex } from "@noble/hashes/utils.js";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { decodeQRContent } from "../../core/crypto/contact-exchange";
import { getMeshService } from "../../services/mesh-service";
import { useContactsStore } from "../../store/contacts-store";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";

interface Props {
  visible: boolean;
  // The contact being verified. Always a 16-hex mesh peer ID: verification is an
  // in-person act, so it only applies to peers you can physically meet.
  peerID: string;
  name: string;
  onClose: () => void;
}

// Outcome of a single scan. `match` has already written the verified contact by
// the time it is set, so the sheet behind us is updated the moment we land here.
type Outcome = "match" | "mismatch" | "tampered";

export default function VerifyContactScanner({
  visible,
  peerID,
  name,
  onClose,
}: Props): React.JSX.Element {
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [permission, requestPermission] = useCameraPermissions();
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  // Only the first read per scan session counts, so a code lingering in frame
  // can't fire the handler repeatedly.
  const scannedRef = useRef(false);

  useEffect(() => {
    if (visible && !permission?.granted) requestPermission();
  }, [visible, permission, requestPermission]);

  // Fresh session each time the scanner is shown. Done on the Modal's onShow
  // event rather than an effect, so it never triggers a cascading render.
  function handleShow(): void {
    scannedRef.current = false;
    setOutcome(null);
  }

  function handleScanned(data: string): void {
    if (scannedRef.current) return;
    const card = decodeQRContent(data.trim());
    if (!card) return; // Not an Airhop card, keep scanning silently.
    scannedRef.current = true;

    // Guard 1: the code must belong to THIS contact, not just any Airhop user.
    if (card.peerID.toLowerCase() !== peerID.toLowerCase()) {
      setOutcome("mismatch");
      return;
    }
    // Guard 2: the peer ID must be the fingerprint of the card's own key.
    // addVerifiedContact returns false if it isn't (a forged or tampered card).
    const accepted = getMeshService()?.addVerifiedContact(card) ?? false;
    if (!accepted) {
      setOutcome("tampered");
      return;
    }
    // Upgrade the record to verified without disturbing anything already saved
    // (a chosen nickname, the first-seen date, a learned Nostr key).
    const prior = useContactsStore.getState().getContact(peerID);
    useContactsStore.getState().addContact({
      ...prior,
      peerID: card.peerID,
      noisePubKeyHex: bytesToHex(card.noisePubKey),
      signingPubKeyHex: bytesToHex(card.signingPubKey),
      nickname: prior?.nickname.trim() ? prior.nickname : card.nickname,
      // Stamp the verification moment: this date drives the "Verified since"
      // line, which is about trust established now, not when we first met them.
      addedAtMs: Date.now(),
      source: "qr",
      nostrPubkeyHex: card.nostrPubKey
        ? bytesToHex(card.nostrPubKey)
        : prior?.nostrPubkeyHex,
    });
    setOutcome("match");
  }

  function handleRetry(): void {
    scannedRef.current = false;
    setOutcome(null);
  }

  const denied = permission != null && !permission.granted;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onShow={handleShow}
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        {/* Live camera, only while we're still waiting for a scan. */}
        {outcome === null && !denied && (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={(r) => handleScanned(r.data)}
          />
        )}

        <SafeAreaView style={styles.chrome}>
          <View style={styles.topBar}>
            <Pressable
              onPress={onClose}
              style={styles.iconBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Feather name="x" size={22} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.title}>Verify {name}</Text>
            <View style={styles.iconBtn} />
          </View>

          {/* Scanning */}
          {outcome === null && !denied && (
            <>
              <View style={styles.frameWrap} pointerEvents="none">
                <View style={styles.frame} />
                <Text style={styles.hint}>
                  Point your camera at their QR code
                </Text>
              </View>
              <View style={styles.bottomBar} />
            </>
          )}

          {/* Camera unavailable */}
          {denied && (
            <View style={styles.resultCard}>
              <View style={[styles.resultIcon, styles.iconNeutral]}>
                <Feather name="camera-off" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.resultTitle}>Camera is off</Text>
              <Text style={styles.resultBody}>
                Turn on camera access in Settings to verify by QR.
              </Text>
              <Pressable style={styles.primaryBtn} onPress={onClose}>
                <Text style={styles.primaryBtnText}>Close</Text>
              </Pressable>
            </View>
          )}

          {/* Verified */}
          {outcome === "match" && (
            <View style={styles.resultCard}>
              <View style={[styles.resultIcon, styles.iconOk]}>
                <Feather name="check" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.resultTitle}>Verified</Text>
              <Text style={styles.resultBody}>
                {name}&apos;s key matches. You can trust this contact.
              </Text>
              <Pressable style={styles.primaryBtn} onPress={onClose}>
                <Text style={styles.primaryBtnText}>Done</Text>
              </Pressable>
            </View>
          )}

          {/* Wrong person */}
          {outcome === "mismatch" && (
            <View style={styles.resultCard}>
              <View style={[styles.resultIcon, styles.iconWarn]}>
                <Feather name="alert-triangle" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.resultTitle}>Different contact</Text>
              <Text style={styles.resultBody}>
                This QR belongs to someone else. Ask {name} to show their own
                code.
              </Text>
              <Pressable style={styles.primaryBtn} onPress={handleRetry}>
                <Text style={styles.primaryBtnText}>Scan again</Text>
              </Pressable>
              <Pressable onPress={onClose}>
                <Text style={styles.secondaryText}>Cancel</Text>
              </Pressable>
            </View>
          )}

          {/* Self-inconsistent card */}
          {outcome === "tampered" && (
            <View style={styles.resultCard}>
              <View style={[styles.resultIcon, styles.iconWarn]}>
                <Feather name="alert-triangle" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.resultTitle}>Couldn&apos;t verify</Text>
              <Text style={styles.resultBody}>
                This QR looks tampered with: its ID doesn&apos;t match its key.
              </Text>
              <Pressable style={styles.primaryBtn} onPress={handleRetry}>
                <Text style={styles.primaryBtnText}>Scan again</Text>
              </Pressable>
              <Pressable onPress={onClose}>
                <Text style={styles.secondaryText}>Cancel</Text>
              </Pressable>
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    // Dark scrim over the camera, matching the platform-standard scanner look
    // (system scanners are always dark-on-camera, not theme-aware).
    root: {
      flex: 1,
      backgroundColor: "#000000",
    },
    chrome: {
      flex: 1,
      justifyContent: "space-between",
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.sm,
    },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: Radius.full,
      backgroundColor: "rgba(0,0,0,0.4)",
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.semibold,
      color: "#FFFFFF",
    },
    frameWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.lg,
    },
    frame: {
      width: 240,
      height: 240,
      borderRadius: Radius.xl,
      borderWidth: 2,
      borderColor: "#FFFFFF",
    },
    hint: {
      fontSize: FontSize.sm,
      color: "#FFFFFF",
      textAlign: "center",
    },
    bottomBar: {
      paddingBottom: Spacing.xl,
    },
    // Result panels sit centered on the dark scrim, camera torn down.
    resultCard: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: Spacing.xl,
      gap: Spacing.md,
    },
    resultIcon: {
      width: 56,
      height: 56,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    iconOk: {
      backgroundColor: Colors.online,
    },
    iconWarn: {
      backgroundColor: Colors.danger,
    },
    iconNeutral: {
      backgroundColor: "rgba(255,255,255,0.16)",
    },
    resultTitle: {
      fontSize: FontSize.lg,
      fontWeight: FontWeight.bold,
      color: "#FFFFFF",
    },
    resultBody: {
      fontSize: FontSize.sm,
      color: "rgba(255,255,255,0.75)",
      textAlign: "center",
      lineHeight: FontSize.sm * 1.4,
    },
    primaryBtn: {
      minWidth: 200,
      minHeight: 50,
      marginTop: Spacing.sm,
      backgroundColor: "#FFFFFF",
      borderRadius: Radius.full,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryBtnText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.bold,
      color: "#000000",
    },
    secondaryText: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: "rgba(255,255,255,0.75)",
      paddingVertical: Spacing.sm,
    },
  });
}
