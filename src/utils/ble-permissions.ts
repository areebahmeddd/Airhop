// Runtime BLE permission gate.
//
// On Android 12+ (API 31), BLUETOOTH_SCAN / BLUETOOTH_ADVERTISE /
// BLUETOOTH_CONNECT are *runtime* permissions: declaring them in the manifest
// is not enough, they must be requested with PermissionsAndroid before any BLE
// call. Without the grant, the native module's startScanning / startAdvertising
// throw SecurityException, which the mesh service swallows: the result is a
// silent, total discovery failure (the app looks fine but never sees a peer).
//
// What this asks for, per API level:
//   - API 31+ : BLUETOOTH_SCAN, BLUETOOTH_ADVERTISE, BLUETOOTH_CONNECT. No
//     location. The manifest declares neverForLocation on BLUETOOTH_SCAN, which
//     is accurate here (a scan result is read for its service UUID, peer ID and
//     RSSI, none of which is a position) and releases scanning from both the
//     location permission and the OS toggle.
//   - API <=30: ACCESS_FINE_LOCATION, since neverForLocation does not exist and
//     Android withholds every result without it. BLUETOOTH and BLUETOOTH_ADMIN
//     are install-time permissions.
//
// bitchat/android requires location at every API level and so also declares
// ACCESS_BACKGROUND_LOCATION and a `location` foreground-service type. Airhop
// takes the other route: the coupling meant a backgrounded phone got no scan
// results at all, and anyone choosing "Approximate" got a mesh that found
// nobody. Discovery, the advertisement and the wire protocol are unchanged, so
// bitchat interop is unaffected.
//
// Location is still requested by services/location-service.ts when a location
// channel is opened. Denying that costs geohash channels, not the mesh.
//
// iOS needs no runtime request here: CoreBluetooth triggers its own system
// prompt on first CBCentralManager / CBPeripheralManager use, backed by the
// NSBluetooth*UsageDescription strings already present in Info.plist.

import { PermissionsAndroid, Platform, type Permission } from "react-native";

// Below this, BLUETOOTH_SCAN does not exist and a BLE scan is a location
// access whatever we say about it.
const NEVER_FOR_LOCATION_MIN_API = 31;

export interface BlePermissionResult {
  granted: boolean;
  // Permissions the user denied. Empty when granted === true.
  denied: string[];
  // True if the user checked "don't ask again" on any required permission, so
  // a re-request will silently no-op and the caller should send them to
  // Settings instead of asking again.
  blockedForever: boolean;
  // True below API 31, where the mesh waits on location rather than Bluetooth.
  // Lets the caller name the permission the user was actually shown, from the
  // first frame rather than after the controller's first reconcile.
  locationRequired: boolean;
}

// Platform.Version is the API level (number) on Android, but the typings allow
// a string, so it is normalised in one place rather than at four call sites.
function androidApiLevel(): number {
  return typeof Platform.Version === "number"
    ? Platform.Version
    : parseInt(String(Platform.Version), 10);
}

// The permissions the BLE mesh cannot run without, for this API level.
function requiredBlePermissions(): Permission[] {
  if (androidApiLevel() >= NEVER_FOR_LOCATION_MIN_API) {
    return [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ];
  }
  // API <=30: the Bluetooth permissions are install-time, and scanning is
  // coupled to location with no way to say otherwise.
  return [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
}

// Read the current grant WITHOUT prompting. Used on app resume, where the user
// may have just granted the permission in system Settings: re-requesting there
// would either be a no-op or throw a prompt at someone who is not asking for
// one, and both leave the mesh dead until a full restart.
export async function hasBlePermissions(): Promise<boolean> {
  if (Platform.OS !== "android") return true;
  const checks = await Promise.all(
    requiredBlePermissions().map((p) => PermissionsAndroid.check(p)),
  );
  return checks.every(Boolean);
}

// Request every BLE permission required for the current Android API level.
// Resolves { granted: true } on iOS (handled by CoreBluetooth) and on Android
// once all required permissions are granted.
export async function ensureBlePermissions(): Promise<BlePermissionResult> {
  if (Platform.OS !== "android") {
    return {
      granted: true,
      denied: [],
      blockedForever: false,
      locationRequired: false,
    };
  }

  const required = requiredBlePermissions();
  const apiLevel = androidApiLevel();
  const locationRequired = apiLevel < NEVER_FOR_LOCATION_MIN_API;

  // Optional extras for the same-platform WiFi Aware fast path, requested in
  // the same batch so the user answers one run of dialogs rather than two, but
  // kept OUT of `required`: WiFi is an accelerator and the BLE mesh must work
  // whether or not it is granted, so a denial here never fails the gate.
  //
  // NEARBY_WIFI_DEVICES is API 33+, for Aware discovery. On API <=32 the
  // location permissions already cover it.
  //
  // ACCESS_LOCAL_NETWORK is deliberately not here yet. The manifest declares it
  // so the Aware socket keeps working later, but local network protection is
  // only enforced for apps targeting Android 17 and this one targets 36. Asking
  // now would show a dialog that unlocks nothing. Add it in the same commit
  // that raises targetSdkVersion to 37.
  const optional: Permission[] = [];
  if (apiLevel >= 33) {
    optional.push("android.permission.NEARBY_WIFI_DEVICES" as Permission);
  }

  // Fast path: skip the prompt if every REQUIRED permission is already granted.
  // (Optional extras are not checked here, so a prior WiFi denial never
  // re-prompts once BLE is settled.)
  const alreadyGranted = await Promise.all(
    required.map((p) => PermissionsAndroid.check(p)),
  );
  if (alreadyGranted.every(Boolean)) {
    return {
      granted: true,
      denied: [],
      blockedForever: false,
      locationRequired,
    };
  }

  const result = await PermissionsAndroid.requestMultiple([
    ...required,
    ...optional,
  ]);

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

  return {
    granted: denied.length === 0,
    denied,
    blockedForever,
    locationRequired,
  };
}
