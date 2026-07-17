// Battery optimization helpers for Android OEM whitelist flows.
//
// On Android, aggressive battery management from OEM skins (Xiaomi MIUI,
// Samsung One UI, Huawei EMUI, Oppo ColorOS, etc.) kills background services.
// This breaks BLE scanning, foreground service scheduling, and Nostr relay
// connections. The correct fix is to ask the user to whitelist the app in the
// OEM's battery settings.
//
// This module returns the deep-link Intent action string for each known OEM so
// the app can open the right settings screen directly with Linking.openURL()
// or Linking.sendIntent(). It returns null on iOS (not applicable) and on
// Android OEMs that don't need special handling.
//
// Usage (React Native):
//   const uri = getBatteryOptimizationSettingsURI();
//   if (uri) await Linking.openURL(uri);

import { Platform } from "react-native";

// ---- Types ------------------------------------------------------------------

export type OEMSettingsURI = string | null;

// ---- Known OEM deep links ---------------------------------------------------

// Each entry is [brandPattern, settingsIntentOrURI].
// Checked in order; first match wins. Brand is from Platform.constants.Brand
// (lowercased) on Android.

export const OEM_DEEP_LINKS: readonly { brand: string; uri: string }[] = [
  // Xiaomi / MIUI
  { brand: "xiaomi", uri: "miui://battery/autostart" },
  { brand: "redmi", uri: "miui://battery/autostart" },
  { brand: "poco", uri: "miui://battery/autostart" },
  // Samsung One UI
  { brand: "samsung", uri: "package:tech.permissionless.airhop" },
  // Huawei / EMUI / HarmonyOS
  {
    brand: "huawei",
    uri: "hwappmarket://details?id=tech.permissionless.airhop",
  },
  {
    brand: "honor",
    uri: "hwappmarket://details?id=tech.permissionless.airhop",
  },
  // Oppo / ColorOS
  { brand: "oppo", uri: "opporinotoast://openintent/battery_optimize" },
  { brand: "realme", uri: "opporinotoast://openintent/battery_optimize" },
  { brand: "oneplus", uri: "opporinotoast://openintent/battery_optimize" },
  // Vivo / FuntouchOS
  {
    brand: "vivo",
    uri: "vivostatistic://com.vivo.permissionmanager/autostart",
  },
];

// Standard Android battery optimization settings intent (API 23+).
// This is a proper intent URI that works with Linking.openURL() on Android.
// It opens the system battery optimization list so the user can find our app.
// OEM deep links above bypass this list and open the OEM-specific whitelist UI.
export const ANDROID_STANDARD_BATTERY_URI =
  "intent:#Intent;action=android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS;end";

// ---- Internal helpers (exported for testing) --------------------------------

// Look up the settings URI for a given brand/OS without touching Platform.
// This is the pure logic, testable without mocking react-native.
export function resolveSettingsURI(os: string, brand: string): OEMSettingsURI {
  if (os !== "android") return null;

  const brandLower = brand.toLowerCase();
  for (const { brand: pattern, uri } of OEM_DEEP_LINKS) {
    if (brandLower.includes(pattern)) return uri;
  }
  return ANDROID_STANDARD_BATTERY_URI;
}

export function isKnownAggressiveOEM(brand: string): boolean {
  const brandLower = brand.toLowerCase();
  return OEM_DEEP_LINKS.some(({ brand: pattern }) =>
    brandLower.includes(pattern),
  );
}

// ---- Public API -------------------------------------------------------------

// Returns the most specific settings URI for the current device, or null on iOS.
export function getBatteryOptimizationSettingsURI(): OEMSettingsURI {
  return resolveSettingsURI(Platform.OS, getDeviceBrand());
}

// Returns true when the device is an Android OEM known to kill background
// services more aggressively than stock Android.
export function needsBatteryOptimizationPrompt(): boolean {
  if (Platform.OS !== "android") return false;
  return isKnownAggressiveOEM(getDeviceBrand());
}

// ---- Device brand -----------------------------------------------------------

// Reads the device brand from React Native's Platform.constants.
// Returns empty string if not available (e.g. running in tests without mocks).
export function getDeviceBrand(): string {
  // Platform.constants is available on both old and New Architecture.
  const constants = Platform.constants as Record<string, unknown>;
  return typeof constants.Brand === "string" ? constants.Brand : "";
}
