// Getting the user to the screen where they can stop the OS killing the mesh.
//
// On Android, aggressive battery management from OEM skins (Xiaomi MIUI,
// Samsung One UI, Huawei EMUI, Oppo ColorOS, vivo Funtouch) reaps foreground
// services. That breaks BLE scanning, the foreground service that holds the
// process up, and the Nostr relay socket. The app cannot fix it from code; the
// only fix is the user whitelisting Airhop, and there is no single Android
// screen for that, which is exactly why describing where to tap does not work.
//
// This module answers "where should this device be sent", as an ORDERED list of
// targets to try. The caller walks it and stops at the first one that opens.
//
// A settings ACTION is not a URL and must not be posted as one. React Native's
// `Linking.openURL` builds `Intent(ACTION_VIEW, Uri.parse(url))` and never calls
// `Intent.parseUri` (IntentModule.kt), so an `intent:#Intent;action=...;end`
// string resolves to nothing and throws. `Linking.sendIntent(action)` builds
// `Intent(action)` and pre-resolves it against the package manager, rejecting
// cleanly when nothing handles it. Hence a target that says which of the two it
// is, and a caller that dispatches accordingly.
//
// The two lists below answer different questions. "This brand kills background
// services" is not "this brand exposes a screen to deep-link to": Samsung's
// sleeping-apps screen lives inside com.samsung.android.lool and Huawei's
// protected-apps inside com.huawei.systemmanager, neither reachable by a public
// action. They belong in the first list only, and get the standard
// battery-optimization list, which exists on both and is where the whitelist
// lives.

import { Platform } from "react-native";

// Where to send the user, and how to get there.
//
//   intent  a settings action, dispatched with Linking.sendIntent
//   url     a real URI with a scheme an OEM app registers, via Linking.openURL
export type BatterySettingsTarget =
  { kind: "intent"; action: string } | { kind: "url"; uri: string };

// The standard battery-optimization list, present on every Android 6+ device
// including all the skins below.
//
// Deliberately the LIST action rather than ACTION_REQUEST_IGNORE_BATTERY_-
// OPTIMIZATIONS, which pops the one-tap "allow?" dialog. That dialog needs the
// REQUEST_IGNORE_BATTERY_OPTIMIZATIONS permission, which Google Play restricts
// to a short list of app categories Airhop is not in, and shipping it risks the
// listing for a convenience. The list is one extra tap and no policy exposure.
export const ANDROID_BATTERY_SETTINGS_ACTION =
  "android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS";

export const ANDROID_STANDARD_BATTERY_TARGET: BatterySettingsTarget = {
  kind: "intent",
  action: ANDROID_BATTERY_SETTINGS_ACTION,
};

// Brands whose background management is known to kill a foreground service.
// Drives whether the Mesh tab says anything at all; independent of whether a
// deep link exists for them.
export const AGGRESSIVE_OEMS: readonly string[] = [
  "xiaomi",
  "redmi",
  "poco",
  "samsung",
  "huawei",
  "honor",
  "oppo",
  "realme",
  "oneplus",
  "vivo",
];

// Of those, the ones with a scheme their own settings app registers, pointing
// at the autostart list the standard action does not cover. Checked in order;
// first match wins.
//
// Every one of these is undocumented and disappears between skin versions,
// which is why they are only ever the FIRST thing tried and never the only
// thing: resolveBatterySettingsTargets always appends the standard action
// behind them.
export const OEM_DEEP_LINKS: readonly { brand: string; uri: string }[] = [
  // Xiaomi / MIUI
  { brand: "xiaomi", uri: "miui://battery/autostart" },
  { brand: "redmi", uri: "miui://battery/autostart" },
  { brand: "poco", uri: "miui://battery/autostart" },
  // Oppo / ColorOS, and the OnePlus and realme skins built on it
  { brand: "oppo", uri: "opporinotoast://openintent/battery_optimize" },
  { brand: "realme", uri: "opporinotoast://openintent/battery_optimize" },
  { brand: "oneplus", uri: "opporinotoast://openintent/battery_optimize" },
  // vivo / Funtouch OS
  {
    brand: "vivo",
    uri: "vivostatistic://com.vivo.permissionmanager/autostart",
  },
];

function matches(brandLower: string, pattern: string): boolean {
  return brandLower.includes(pattern);
}

// Everywhere worth trying for this device, most specific first.
//
// Pure, so the ordering is testable without a device. Empty on iOS, which has
// no equivalent concept: background BLE there is an entitlement, not a
// per-app permission a user can revoke.
export function resolveBatterySettingsTargets(
  os: string,
  brand: string,
): BatterySettingsTarget[] {
  if (os !== "android") return [];

  const brandLower = brand.toLowerCase();
  const oem = OEM_DEEP_LINKS.find((entry) => matches(brandLower, entry.brand));
  return oem === undefined
    ? [ANDROID_STANDARD_BATTERY_TARGET]
    : [{ kind: "url", uri: oem.uri }, ANDROID_STANDARD_BATTERY_TARGET];
}

export function isKnownAggressiveOEM(brand: string): boolean {
  const brandLower = brand.toLowerCase();
  return AGGRESSIVE_OEMS.some((pattern) => matches(brandLower, pattern));
}

// Everywhere worth trying on the current device, or empty on iOS.
export function getBatterySettingsTargets(): BatterySettingsTarget[] {
  return resolveBatterySettingsTargets(Platform.OS, getDeviceBrand());
}

// Returns true when the device is an Android OEM known to kill background
// services more aggressively than stock Android.
export function needsBatteryOptimizationPrompt(): boolean {
  if (Platform.OS !== "android") return false;
  return isKnownAggressiveOEM(getDeviceBrand());
}

// Reads the device brand from React Native's Platform.constants.
// Returns empty string if not available (e.g. running in tests without mocks).
export function getDeviceBrand(): string {
  // Platform.constants is available on both old and New Architecture.
  const constants = Platform.constants as Record<string, unknown>;
  return typeof constants.Brand === "string" ? constants.Brand : "";
}
