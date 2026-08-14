// Camera sheet for reading a Cashu token QR into the wallet.
//
// Deliberately narrower than the contact scanner: there is no hub, no manual
// entry, no confirm step. Pasting a token already has a field in the Receive
// sheet, and the value is checked by the wallet service when it is claimed, so
// this screen has exactly one job: turn a camera frame into a token string.
//
// It does mirror two things the contact scanner learned the hard way, because
// both are easy to get wrong and expensive to debug on a device:
//
//   * Permission is settled BEFORE `CameraView` mounts. Mounting it while the
//     OS prompt is still up hands it a camera it cannot open, and expo-camera
//     does not re-acquire the device when the answer arrives, so granting
//     access leaves a permanently black preview.
//   * `onBarcodeScanned` fires repeatedly while a code stays in frame. Without
//     a latch, one QR in view produces a stream of duplicate reads.

import { readScan, type ScanTarget } from "@core/payments/scan";
import { Feather } from "@expo/vector-icons";
import { t, useT } from "@i18n";
import { ensurePermission } from "@platform/permissions";
import BottomSheet from "@ui/components/bottom-sheet";
import {
  FontSize,
  FontWeight,
  HIT_SLOP,
  Radius,
  Spacing,
  useThemeColors,
} from "@ui/theme";
import {
  CameraView,
  scanFromURLAsync,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// What the camera is being pointed at. The mechanics are identical; only the
// validator and the wording change, so one screen serves both rather than two
// near-copies drifting apart. The type and its acceptance rules live in
// core/payments/scan.ts; re-exported here so callers keep importing one thing.
export type { ScanTarget };

interface Props {
  visible: boolean;
  target: ScanTarget;
  onClose: () => void;
  // Called with the scanned value once it validates. The caller decides what to
  // do with it; nothing is claimed or paid here.
  onScanned: (value: string) => void;
}

export default function TokenScanSheet({
  visible,
  target,
  onClose,
  onScanned,
}: Props): React.JSX.Element | null {
  const T = useT();
  const Colors = useThemeColors();
  const styles = useMemo(() => createStyles(Colors), [Colors]);

  // Only true once permission is granted, which is what gates the camera mount.
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, requestCameraPermission, getCameraPermission] =
    useCameraPermissions();
  const hasScannedRef = useRef(false);

  function reset(): void {
    setCameraReady(false);
    setError(null);
    hasScannedRef.current = false;
  }

  function finish(value: string): void {
    reset();
    onScanned(value);
  }

  function dismiss(): void {
    reset();
    onClose();
  }

  async function handleUseCamera(): Promise<void> {
    setError(null);
    const granted = await ensurePermission(
      getCameraPermission,
      requestCameraPermission,
      {
        label: t("wallet.scan.camera_label"),
        purpose: t("wallet.scan.camera_purpose"),
      },
    );
    if (!granted) return;
    hasScannedRef.current = false;
    setCameraReady(true);
  }

  // Reading a QR out of a saved screenshot. Worth having: a token is often
  // received as an image in another chat app, and photographing your own screen
  // is not an option.
  async function handleUseImage(): Promise<void> {
    setError(null);
    const granted = await ensurePermission(
      () => ImagePicker.getMediaLibraryPermissionsAsync(),
      () => ImagePicker.requestMediaLibraryPermissionsAsync(),
      {
        label: t("wallet.scan.photo_label"),
        purpose: t("wallet.scan.photo_purpose"),
      },
    );
    if (!granted) return;

    // Inside the try, for the same reason as the contact scanner: the launch can
    // reject on its own, and this runs from an onPress as a bare async call, so
    // a rejection there was unhandled and left the sheet open with no error.
    try {
      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
      });
      if (picked.canceled || !picked.assets[0]) return;

      const scans = await scanFromURLAsync(picked.assets[0].uri, ["qr"]);
      const value = readScan(scans[0]?.data, target);
      if (value === null) {
        setError(
          target === "token"
            ? t("wallet.scan.no_token")
            : t("wallet.scan.no_invoice"),
        );
        return;
      }
      finish(value);
    } catch {
      setError(t("wallet.scan.unreadable"));
    }
  }

  function handleBarcodeScanned(raw: string): void {
    if (hasScannedRef.current) return;
    const value = readScan(raw, target);
    // Not latching on a miss is deliberate: an unrelated QR should not end the
    // session, it should just keep scanning until a real one comes into frame.
    if (value === null) return;
    hasScannedRef.current = true;
    finish(value);
  }

  function handleCameraMountError(): void {
    setError(t("wallet.scan.camera_failed"));
    setCameraReady(false);
  }

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={dismiss}>
      {cameraReady ? (
        <View style={styles.cameraRoot}>
          {/* Mounted only once permission is granted, so this is never the
              black rectangle of a denied camera. */}
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={(result) => handleBarcodeScanned(result.data)}
            onMountError={handleCameraMountError}
          />
          <SafeAreaView style={styles.cameraChrome}>
            <View style={styles.cameraTopBar}>
              <Pressable
                onPress={dismiss}
                style={styles.cameraIconBtn}
                hitSlop={HIT_SLOP}
                accessibilityRole="button"
                accessibilityLabel={T("wallet.scan.close")}
              >
                <Feather name="x" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
            <View style={styles.reticle} />
            <Text style={styles.cameraHint}>
              {target === "token"
                ? T("wallet.scan.aim_token")
                : T("wallet.scan.aim_invoice")}{" "}
              {T("wallet.scan.on_device")}
            </Text>
          </SafeAreaView>
        </View>
      ) : (
        // The shared sheet, not a hand-rolled one. This was the last screen
        // still building its own Modal + scrim + decorative grab handle - a
        // handle that ignored the finger, which BottomSheet exists to stop.
        // It also brings real drag-to-dismiss, a labelled backdrop and the
        // paused-activity unmount backstop.
        <BottomSheet visible onClose={dismiss} sheetStyle={styles.sheet}>
          <View>
            <Text style={styles.title}>
              {target === "token"
                ? T("wallet.scan.title_token")
                : T("wallet.scan.title_invoice")}
            </Text>
            <Text style={styles.subtitle}>
              {target === "token"
                ? T("wallet.scan.desc_token")
                : T("wallet.scan.desc_invoice")}
            </Text>
            {error !== null && <Text style={styles.error}>{error}</Text>}

            <Pressable
              style={styles.action}
              onPress={() => void handleUseCamera()}
              accessibilityRole="button"
              accessibilityLabel={T("wallet.scan.use_camera_a11y")}
            >
              <Feather name="camera" size={18} color={Colors.accent} />
              <Text style={styles.actionText}>
                {T("wallet.scan.use_camera")}
              </Text>
            </Pressable>
            <Pressable
              style={styles.action}
              onPress={() => void handleUseImage()}
              accessibilityRole="button"
              accessibilityLabel={T("wallet.scan.pick_image_a11y")}
            >
              <Feather name="image" size={18} color={Colors.accent} />
              <Text style={styles.actionText}>
                {T("wallet.scan.pick_image")}
              </Text>
            </Pressable>
            <Pressable
              style={styles.cancel}
              onPress={dismiss}
              accessibilityRole="button"
              accessibilityLabel={T("common.cancel")}
            >
              <Text style={styles.cancelText}>{T("common.cancel")}</Text>
            </Pressable>
          </View>
        </BottomSheet>
      )}
    </Modal>
  );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    cameraRoot: {
      flex: 1,
      backgroundColor: "#000000",
    },
    cameraChrome: {
      flex: 1,
      justifyContent: "space-between",
      alignItems: "center",
    },
    cameraTopBar: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "flex-end",
      padding: Spacing.base,
    },
    cameraIconBtn: {
      width: 36,
      height: 36,
      borderRadius: Radius.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    reticle: {
      width: 240,
      height: 240,
      borderRadius: Radius.xl,
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.85)",
    },
    cameraHint: {
      color: "#FFFFFF",
      fontSize: FontSize.sm,
      textAlign: "center",
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
      lineHeight: FontSize.sm * 1.5,
    },
    sheet: {
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing["2xl"],
      gap: Spacing.md,
    },
    title: {
      fontSize: FontSize.md,
      fontWeight: FontWeight.semibold,
      color: Colors.textPrimary,
    },
    subtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: FontSize.sm * 1.5,
    },
    error: {
      fontSize: FontSize.sm,
      color: Colors.danger,
    },
    action: {
      width: "100%",
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.xs,
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    actionText: {
      fontSize: FontSize.sm,
      fontWeight: FontWeight.semibold,
      color: Colors.accent,
    },
    cancel: {
      width: "100%",
      minHeight: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: Radius.full,
      backgroundColor: Colors.surfaceRaised,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    cancelText: {
      fontSize: FontSize.base,
      color: Colors.textPrimary,
      fontWeight: FontWeight.semibold,
    },
  });
}
