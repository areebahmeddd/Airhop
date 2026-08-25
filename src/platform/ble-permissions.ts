// Runtime BLE permission gate.
//
// Ungranted, startScanning / startAdvertising throw SecurityException and the
// mesh service swallows it, so the app looks fine and never sees a peer. That
// silence is why this gate is explicit rather than lazy.
//
// What it asks for, per API level:
//   - API 31+ : BLUETOOTH_SCAN, BLUETOOTH_ADVERTISE, BLUETOOTH_CONNECT, and no
//     location. neverForLocation on BLUETOOTH_SCAN is accurate (a result is read
//     for service UUID, peer ID and RSSI, none of them a position) and releases
//     scanning from the location permission and the OS toggle both.
//   - API <=30: ACCESS_FINE_LOCATION, since neverForLocation does not exist and
//     Android withholds every result without it.
//
// Deliberately unlike bitchat/android, which requires location at every level
// and so also needs ACCESS_BACKGROUND_LOCATION and a `location` service type:
// that coupling costs a backgrounded phone every scan result, and anyone on
// "Approximate" a mesh that finds nobody. The advertisement and the wire
// protocol are untouched, so interop is unaffected.
//
// location-service.ts still requests location when a geohash channel opens.
// Denying it costs channels, not the mesh.
//
// iOS needs nothing here: CoreBluetooth prompts on first manager use, backed by
// the NSBluetooth*UsageDescription strings in Info.plist.

import { PermissionsAndroid, Platform, type Permission } from "react-native";

// Below this, BLUETOOTH_SCAN does not exist and a BLE scan is a location
// access whatever we say about it.
const NEVER_FOR_LOCATION_MIN_API = 31;

export interface BlePermissionResult {
  granted: boolean;
  // Permissions the user denied. Empty when granted === true.
  denied: string[];
  // "Don't ask again" on any required permission. A re-request silently no-ops
  // from here, so the caller has to send them to Settings instead.
  blockedForever: boolean;
  // True below API 31, where the mesh waits on location rather than Bluetooth,
  // so the caller can name the permission the user actually saw from the first
  // frame rather than after the controller's first reconcile.
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

// Read the current grant WITHOUT prompting, for app resume, where the user may
// have just granted in Settings. Re-requesting there is either a no-op or a
// prompt thrown at someone who did not ask, and both leave the mesh dead until
// a restart.
//
// Required permissions only, and never the optional ones: this answers whether
// the mesh can run, and a missing accelerator grant must not shut down a
// transport that does not depend on it.
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

  // Optional extras for the WiFi Aware fast path, batched here so the user
  // answers one run of dialogs rather than two, but kept OUT of `required`:
  // WiFi is an accelerator, the mesh must run without it, and a denial here
  // never fails the gate.
  //
  // NEARBY_WIFI_DEVICES is API 33+. Below that the location permissions cover
  // Aware discovery already.
  //
  // ACCESS_LOCAL_NETWORK is deliberately not here yet. The manifest declares it
  // so the Aware socket keeps working later, but local network protection is
  // only enforced for apps targeting Android 17 and this one targets 36. Asking
  // now would show a dialog that unlocks nothing. Add it in the same commit
  // that raises targetSdkVersion to 37, and with the persisted marker the fast
  // path below describes: it carries its own permission group, so a denial
  // would otherwise be re-prompted on every launch.
  const optional: Permission[] = [];
  if (apiLevel >= 33) {
    optional.push("android.permission.NEARBY_WIFI_DEVICES" as Permission);
  }

  // Fast path: skip the prompt when there is nothing left to ask for.
  //
  // Both lists, because they move independently. A build that adds an optional
  // permission reaches phones whose required grants are already settled, so a
  // check reading only `required` returns early for the life of the install and
  // the new permission is never requested at all. On API 33+ both lists sit in
  // the NEARBY_DEVICES group, so the extra pass is granted without a dialog.
  //
  // That is what makes re-requesting safe here. An optional permission carrying
  // its own group would re-prompt every launch once denied, and needs a
  // persisted "already asked" marker instead.
  const alreadyGranted = await Promise.all(
    [...required, ...optional].map((p) => PermissionsAndroid.check(p)),
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
