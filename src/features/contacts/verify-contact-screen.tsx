// Confirm that an existing contact's keys really are theirs.
//
// Unlike the add-contact scanner, this never starts a conversation: the person
// is already in your DMs. A scan whose identity does not match the contact is
// rejected, so "verified" always means "I checked this exact person".
//
// Two ways in, because verification is a claim about a channel rather than
// about a camera:
//
//   Scan their code     they are here, and the camera witnesses the exchange.
//                       Imports keys as well as confirming them, which is why
//                       it alone may re-pin (addVerifiedContact)
//   Compare a code      both parties read the same six words over a channel
//                       they trust. The app witnesses nothing, the human does.
//                       Imports nothing, so it grants no re-pinning power
//
// Both earn the same shield, and differ only in what else they may do.

import { decodeQRContent } from "@core/crypto/contact-exchange";
import { peerFingerprint, safetyNumber } from "@core/crypto/fingerprint";
import { Feather } from "@expo/vector-icons";
import { useT } from "@i18n";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { rejected, succeeded } from "@platform/haptics";
import { getMeshService } from "@services/mesh-service";
import { useContactsStore } from "@store/contacts-store";
import {
  BUTTON_HEIGHT,
  FontFamily,
  FontSize,
  FontWeight,
  HIT_SLOP,
  MIN_TOUCH,
  Radius,
  Spacing,
  useThemeColors,
} from "@ui/theme";
import { safetyNumberWords } from "@utils/username";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useMemo, useRef, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  // The contact being verified. Always a 16-hex mesh peer ID: a per-cell
  // geohash pseudonym has no lasting identity to confirm.
  peerID: string;
  name: string;
  onClose: () => void;
}

// Every session starts at `choose`, so neither method is the default and a tap
// meaning "how do I verify somebody" does not open a camera.
type Stage = "choose" | "camera" | "compare";

// Outcome of a single scan. `match` has already written the verified contact by
// the time it is set, so the sheet behind us is updated the moment we land here.
type Outcome = "match" | "mismatch" | "tampered";

export default function VerifyContactScreen({
  visible,
  peerID,
  name,
  onClose,
}: Props): React.JSX.Element {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  const [permission, requestPermission] = useCameraPermissions();
  const [stage, setStage] = useState<Stage>("choose");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [compared, setCompared] = useState(false);
  // Only the first read per scan session counts, so a code lingering in frame
  // can't fire the handler repeatedly.
  const scannedRef = useRef(false);

  const contact = useContactsStore((s) => s.contacts[peerID]);

  // The six words both phones show, identical on each side. Memoised because
  // the words must not flicker while somebody is reading them aloud.
  const words = useMemo(() => {
    const ourCard = getMeshService()?.getContactCard();
    if (
      ourCard === undefined ||
      contact === undefined ||
      contact.noisePubKeyHex.length !== 64 ||
      contact.signingPubKeyHex.length !== 64
    ) {
      return null;
    }
    try {
      const ours = peerFingerprint(ourCard.noisePubKey, ourCard.signingPubKey);
      const theirs = peerFingerprint(
        hexToBytes(contact.noisePubKeyHex),
        hexToBytes(contact.signingPubKeyHex),
      );
      return safetyNumberWords(safetyNumber(ours, theirs));
    } catch {
      // Stored hex that will not decode. No code beats a wrong one.
      return null;
    }
  }, [contact]);

  // Fresh session each time the sheet is shown.
  //
  // The camera permission belongs to the camera stage, not here. Opening this
  // screen does not mean opening a camera, and prompting for one the user may
  // never reach is the kind of ask that gets denied by reflex.
  function handleShow(): void {
    scannedRef.current = false;
    setOutcome(null);
    setCompared(false);
    setStage("choose");
  }

  function handleChooseCamera(): void {
    setStage("camera");
    if (!permission?.granted && permission?.canAskAgain !== false) {
      void requestPermission();
    }
  }

  // Nothing is imported: the comparison confirms keys already stored, so this
  // records only that a human checked.
  function handleCodesMatch(): void {
    useContactsStore.getState().markVerified(peerID);
    succeeded();
    setCompared(true);
  }

  function handleScanned(data: string): void {
    if (scannedRef.current) return;
    const card = decodeQRContent(data.trim());
    if (!card) return; // Not an Airhop card, keep scanning silently.
    scannedRef.current = true;

    // Guard 1: the code must belong to THIS contact, not just any Airhop user.
    if (card.peerID.toLowerCase() !== peerID.toLowerCase()) {
      // Felt, not just shown. The phone is held up at the other screen through a
      // viewfinder, so the outcome has to reach the hand as well as the eye -
      // and these two outcomes are the security answer this screen exists for.
      rejected();
      setOutcome("mismatch");
      return;
    }
    // Guard 2: the peer ID must be the fingerprint of the card's own key.
    // addVerifiedContact returns false if it isn't (a forged or tampered card).
    const accepted =
      getMeshService()?.addVerifiedContact(card, { inPerson: true }) ?? false;
    if (!accepted) {
      rejected();
      setOutcome("tampered");
      return;
    }
    // Upgrade the record to verified. Nothing already saved needs defending
    // here: addContact merges, keeps the earliest added date, and never lets a
    // write drop a chosen nickname or a learned Nostr key.
    //
    // `verifiedAtMs` is the one thing this screen has to say, because it is the
    // only screen that witnesses the moment. It drives the "Verified since"
    // line, which is about trust established now rather than when the two of
    // you first met on the mesh.
    const now = Date.now();
    useContactsStore.getState().addContact({
      peerID: card.peerID,
      noisePubKeyHex: bytesToHex(card.noisePubKey),
      signingPubKeyHex: bytesToHex(card.signingPubKey),
      nickname: card.nickname,
      addedAtMs: now,
      verifiedAtMs: now,
      source: "qr",
      ...(card.nostrPubKey !== undefined
        ? { nostrPubkeyHex: bytesToHex(card.nostrPubKey) }
        : {}),
    });
    succeeded();
    setOutcome("match");
  }

  function handleRetry(): void {
    scannedRef.current = false;
    setOutcome(null);
  }

  // Three states, not two. `permission == null` (never asked) and a denial both
  // have to keep CameraView unmounted; only an outright grant may mount it.
  // Treating "not yet answered" as permitted is exactly the black-preview bug.
  const granted = permission?.granted === true;
  const denied = permission != null && !permission.granted;
  const awaitingAnswer = !granted && !denied;

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
        {stage === "camera" && outcome === null && granted && (
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
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={T("common.close")}
            >
              <Feather name="x" size={22} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.title}>
              {T("contacts.verify.title", { name })}
            </Text>
            <View style={styles.iconBtn} />
          </View>

          {/* Both confirm the same thing, and differ in which channel does
              the confirming. */}
          {stage === "choose" && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>
                {T("contacts.verify.choose_title")}
              </Text>
              <Text style={styles.resultBody}>
                {T("contacts.verify.choose_body", { name })}
              </Text>
              <Pressable
                style={styles.methodRow}
                onPress={handleChooseCamera}
                accessibilityRole="button"
                accessibilityLabel={T("contacts.verify.method_scan")}
              >
                <Feather name="camera" size={20} color="#FFFFFF" />
                <View style={styles.methodText}>
                  <Text style={styles.methodTitle}>
                    {T("contacts.verify.method_scan")}
                  </Text>
                  <Text style={styles.methodSub}>
                    {T("contacts.verify.method_scan_sub")}
                  </Text>
                </View>
              </Pressable>
              {/* Offered only when there is something to compare: a contact
                  saved from a typed peer ID has no keys and so no code. */}
              {words !== null ? (
                <Pressable
                  style={styles.methodRow}
                  onPress={() => setStage("compare")}
                  accessibilityRole="button"
                  accessibilityLabel={T("contacts.verify.method_compare")}
                >
                  <Feather name="hash" size={20} color="#FFFFFF" />
                  <View style={styles.methodText}>
                    <Text style={styles.methodTitle}>
                      {T("contacts.verify.method_compare")}
                    </Text>
                    <Text style={styles.methodSub}>
                      {T("contacts.verify.method_compare_sub")}
                    </Text>
                  </View>
                </Pressable>
              ) : (
                <Text style={styles.resultBody}>
                  {T("contacts.verify.no_keys")}
                </Text>
              )}
            </View>
          )}

          {/* The code, before either answer. */}
          {stage === "compare" && !compared && words !== null && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>
                {T("contacts.verify.compare_title")}
              </Text>
              <Text style={styles.resultBody}>
                {T("contacts.verify.compare_body", { name })}
              </Text>
              {/* Two rows of three. One line wraps unpredictably across font
                  scales, and a reader needs the same shape on both phones to
                  keep their place. */}
              <View style={styles.wordGrid}>
                {words.map((word, index) => (
                  <Text key={`${index}-${word}`} style={styles.word}>
                    {word}
                  </Text>
                ))}
              </View>
              <Pressable
                style={styles.primaryBtn}
                onPress={handleCodesMatch}
                accessibilityRole="button"
                accessibilityLabel={T("contacts.verify.codes_match")}
              >
                <Text style={styles.primaryBtnText}>
                  {T("contacts.verify.codes_match")}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  // A mismatch is the finding, not a failure to retry: the
                  // words are the same next time, so a retry would only invite
                  // tapping until it passed.
                  rejected();
                  setStage("choose");
                }}
                accessibilityRole="button"
                accessibilityLabel={T("contacts.verify.codes_differ")}
              >
                <Text style={styles.secondaryText}>
                  {T("contacts.verify.codes_differ")}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Compared and matched. */}
          {stage === "compare" && compared && (
            <View style={styles.resultCard}>
              <View style={[styles.resultIcon, styles.iconOk]}>
                <Feather name="check" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.resultTitle}>
                {T("contacts.verify.verified")}
              </Text>
              <Text style={styles.resultBody}>
                {T("contacts.verify.compared_body", { name })}
              </Text>
              <Pressable
                style={styles.primaryBtn}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={T("contacts.verify.done")}
              >
                <Text style={styles.primaryBtnText}>
                  {T("contacts.verify.done")}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Scanning */}
          {stage === "camera" && outcome === null && granted && (
            <>
              <View style={styles.frameWrap} pointerEvents="none">
                <View style={styles.frame} />
                <Text style={styles.hint}>{T("contacts.verify.aim")}</Text>
              </View>
              <View style={styles.bottomBar} />
            </>
          )}

          {/* The OS prompt is up, or its answer hasn't landed yet. A word beats
              a blank screen for the second it takes. */}
          {stage === "camera" && outcome === null && awaitingAnswer && (
            <View style={styles.resultCard}>
              <Text style={styles.resultBody}>
                {T("contacts.verify.waiting_camera")}
              </Text>
            </View>
          )}

          {/* Camera unavailable */}
          {stage === "camera" && outcome === null && denied && (
            <View style={styles.resultCard}>
              <View style={[styles.resultIcon, styles.iconNeutral]}>
                <Feather name="camera-off" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.resultTitle}>
                {T("contacts.verify.camera_off")}
              </Text>
              <Text style={styles.resultBody}>
                {T("contacts.verify.camera_off_body")}
              </Text>
              <Pressable
                style={styles.primaryBtn}
                onPress={() => void Linking.openSettings()}
                accessibilityRole="button"
                accessibilityLabel={T("contacts.verify.open_settings")}
              >
                <Text style={styles.primaryBtnText}>
                  {T("contacts.verify.open_settings")}
                </Text>
              </Pressable>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={T("common.close")}
              >
                <Text style={styles.secondaryText}>{T("common.close")}</Text>
              </Pressable>
            </View>
          )}

          {/* Verified */}
          {outcome === "match" && (
            <View style={styles.resultCard}>
              <View style={[styles.resultIcon, styles.iconOk]}>
                <Feather name="check" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.resultTitle}>
                {T("contacts.verify.verified")}
              </Text>
              <Text style={styles.resultBody}>
                {T("contacts.verify.match_body", { name })}
              </Text>
              <Pressable
                style={styles.primaryBtn}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={T("contacts.verify.done")}
              >
                <Text style={styles.primaryBtnText}>
                  {T("contacts.verify.done")}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Wrong person */}
          {outcome === "mismatch" && (
            <View style={styles.resultCard}>
              <View style={[styles.resultIcon, styles.iconWarn]}>
                <Feather name="alert-triangle" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.resultTitle}>
                {T("contacts.verify.different")}
              </Text>
              <Text style={styles.resultBody}>
                {T("contacts.verify.different_body", { name })}
              </Text>
              <Pressable
                style={styles.primaryBtn}
                onPress={handleRetry}
                accessibilityRole="button"
                accessibilityLabel={T("contacts.verify.scan_again")}
              >
                <Text style={styles.primaryBtnText}>
                  {T("contacts.verify.scan_again")}
                </Text>
              </Pressable>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={T("common.cancel")}
              >
                <Text style={styles.secondaryText}>{T("common.cancel")}</Text>
              </Pressable>
            </View>
          )}

          {/* Self-inconsistent card */}
          {outcome === "tampered" && (
            <View style={styles.resultCard}>
              <View style={[styles.resultIcon, styles.iconWarn]}>
                <Feather name="alert-triangle" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.resultTitle}>
                {T("contacts.verify.failed")}
              </Text>
              <Text style={styles.resultBody}>
                {T("contacts.verify.tampered_body")}
              </Text>
              <Pressable
                style={styles.primaryBtn}
                onPress={handleRetry}
                accessibilityRole="button"
                accessibilityLabel={T("contacts.verify.scan_again")}
              >
                <Text style={styles.primaryBtnText}>
                  {T("contacts.verify.scan_again")}
                </Text>
              </Pressable>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel={T("common.cancel")}
              >
                <Text style={styles.secondaryText}>{T("common.cancel")}</Text>
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
      backgroundColor: Colors.verified,
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
      minHeight: BUTTON_HEIGHT,
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
    // Full width so the two rows read as equals rather than a primary action
    // with an alternative under it.
    methodRow: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      minHeight: MIN_TOUCH,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: Radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255,255,255,0.25)",
      backgroundColor: "rgba(255,255,255,0.06)",
    },
    methodText: {
      flex: 1,
      gap: 2,
    },
    methodTitle: {
      fontSize: FontSize.base,
      fontWeight: FontWeight.medium,
      color: "#FFFFFF",
    },
    methodSub: {
      fontSize: FontSize.xs,
      color: "rgba(255,255,255,0.6)",
    },
    // Three to a row rather than left to wrap: a wrap that differs by font
    // scale gives the two readers different shapes to follow.
    wordGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      rowGap: Spacing.sm,
      columnGap: Spacing.md,
      marginVertical: Spacing.sm,
    },
    word: {
      width: "30%",
      textAlign: "center",
      fontFamily: FontFamily.mono,
      fontSize: FontSize.lg,
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
  });
}
