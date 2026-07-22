// Runtime BLE permission gate.
//
// On Android 12+ (API 31), BLUETOOTH_SCAN / BLUETOOTH_ADVERTISE /
// BLUETOOTH_CONNECT are *runtime* permissions: declaring them in the manifest
// is not enough, they must be requested with PermissionsAndroid before any BLE
// call. Without the grant, the native module's startScanning / startAdvertising
// throw SecurityException, which the mesh service swallows: the result is a
// silent, total discovery failure (the app looks fine but never sees a peer).
//
// This mirrors bitchat-android's PermissionManager.getRequiredPermissions():
//   - API 31+ : BLUETOOTH_SCAN, BLUETOOTH_ADVERTISE, BLUETOOTH_CONNECT
//   - API <=30: BLUETOOTH, BLUETOOTH_ADMIN (normal perms, auto-granted)
//   - all levels: ACCESS_FINE_LOCATION (bitchat does NOT set
//     usesPermissionFlags="neverForLocation", so scanning stays coupled to
//     location and the location grant is required on every API level).
//
// iOS needs no runtime request here: CoreBluetooth triggers its own system
// prompt on first CBCentralManager / CBPeripheralManager use, backed by the
// NSBluetooth*UsageDescription strings already present in Info.plist.

import { PermissionsAndroid, Platform, type Permission } from "react-native";

export interface BlePermissionResult {
  granted: boolean;
  // Permissions the user denied. Empty when granted === true.
  denied: string[];
  // True if the user checked "don't ask again" on any required permission, so
  // a re-request will silently no-op and the caller should send them to
  // Settings instead of asking again.
  blockedForever: boolean;
}

// Request every BLE permission required for the current Android API level.
// Resolves { granted: true } on iOS (handled by CoreBluetooth) and on Android
// once all required permissions are granted.
export async function ensureBlePermissions(): Promise<BlePermissionResult> {
  if (Platform.OS !== "android") {
    return { granted: true, denied: [], blockedForever: false };
  }

  const required: Permission[] = [
    // Coupled to BLE scanning because neverForLocation is not declared.
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ];

  // Platform.Version is the API level (number) on Android.
  const apiLevel =
    typeof Platform.Version === "number"
      ? Platform.Version
      : parseInt(String(Platform.Version), 10);

  if (apiLevel >= 31) {
    required.push(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    );
  }

  // Fast path: skip the prompt if everything is already granted.
  const alreadyGranted = await Promise.all(
    required.map((p) => PermissionsAndroid.check(p)),
  );
  if (alreadyGranted.every(Boolean)) {
    return { granted: true, denied: [], blockedForever: false };
  }

  const result = await PermissionsAndroid.requestMultiple(required);

  const denied: string[] = [];
  let blockedForever = false;
  for (const perm of required) {
    const status = result[perm as keyof typeof result];
    if (status !== PermissionsAndroid.RESULTS.GRANTED) {
      denied.push(perm);
      if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        blockedForever = true;
      }
    }
  }

  return { granted: denied.length === 0, denied, blockedForever };
}
