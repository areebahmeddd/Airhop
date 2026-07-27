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

import { Feather } from "@expo/vector-icons";
import {
  CameraView,
  scanFromURLAsync,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { bareToken } from "../../core/payments/cashu";
import {
  FontSize,
  FontWeight,
  Radius,
  Spacing,
  useThemeColors,
} from "../../ui/theme";
import { ensurePermission } from "../../utils/permissions";

interface Props {
  visible: boolean;
  onClose: () => void;
  // Called with the bare token string once a valid one is read. The caller
  // decides what to do with it; nothing is claimed here.
  onToken: (token: string) => void;
}

export default function TokenScanner({
  visible,
  onClose,
  onToken,
}: Props): React.JSX.Element | null {
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

  function finish(token: string): void {
    reset();
    onToken(token);
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
      { label: "Camera access", purpose: "scan an ecash QR code" },
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
      { label: "Photo access", purpose: "read an ecash QR from an image" },
    );
    if (!granted) return;

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });
    if (picked.canceled || !picked.assets[0]) return;

    try {
      const scans = await scanFromURLAsync(picked.assets[0].uri, ["qr"]);
      const token = readToken(scans[0]?.data);
      if (token === null) {
        setError("No ecash token found in that image.");
        return;
      }
      finish(token);
    } catch {
      setError("Could not read that image.");
    }
  }

  function handleBarcodeScanned(raw: string): void {
    if (hasScannedRef.current) return;
    const token = readToken(raw);
    // Not latching on a miss is deliberate: a non-token QR should not end the
    // session, it should just keep scanning until a real one comes into frame.
    if (token === null) return;
    hasScannedRef.current = true;
    finish(token);
  }

  function handleCameraMountError(): void {
    setError(
      "Couldn't start the camera. Close other camera apps and try again.",
    );
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
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Close scanner"
              >
                <Feather name="x" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
            <View style={styles.reticle} />
            <Text style={styles.cameraHint}>
              Point at an ecash QR code. It is read on this device; nothing is
              sent anywhere.
            </Text>
          </SafeAreaView>
        </View>
      ) : (
        <View style={styles.sheetRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.title}>Scan ecash</Text>
            <Text style={styles.subtitle}>
              Read a Cashu token from another wallet. Works with any Cashu
              wallet, not only Airhop.
            </Text>
            {error !== null && <Text style={styles.error}>{error}</Text>}

            <Pressable
              style={styles.action}
              onPress={() => void handleUseCamera()}
              accessibilityRole="button"
              accessibilityLabel="Scan with the camera"
            >
              <Feather name="camera" size={18} color={Colors.accent} />
              <Text style={styles.actionText}>Use camera</Text>
            </Pressable>
            <Pressable
              style={styles.action}
              onPress={() => void handleUseImage()}
              accessibilityRole="button"
              accessibilityLabel="Read a QR code from a saved image"
            >
              <Feather name="image" size={18} color={Colors.accent} />
              <Text style={styles.actionText}>Pick from photos</Text>
            </Pressable>
            <Pressable style={styles.cancel} onPress={dismiss}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Modal>
  );
}

// A scanned string is only accepted if it really is a token. `bareToken` also
// strips a `cashu:` scheme, so a QR from a wallet that adds one still reads.
function readToken(raw: string | undefined): string | null {
  if (typeof raw !== "string" || raw.length === 0) return null;
  return bareToken(raw);
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
      borderRadius: 18,
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
    sheetRoot: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: Colors.overlay,
    },
    sheet: {
      backgroundColor: Colors.surface,
      borderTopLeftRadius: Radius["2xl"],
      borderTopRightRadius: Radius["2xl"],
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing["2xl"],
      gap: Spacing.md,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.borderStrong,
      alignSelf: "center",
      marginTop: Spacing.sm,
      marginBottom: Spacing.md,
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
      color: Colors.textSecondary,
      fontWeight: FontWeight.medium,
    },
  });
}
