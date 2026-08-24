/**
 * @jest-environment node
 */

// Tests for battery-optimization.ts.
//
// The public API (getBatterySettingsTargets, needsBatteryOptimizationPrompt)
// reads Platform.OS and Platform.constants.Brand directly from react-native, which
// cannot be cleanly mocked without breaking jest-expo's setup files.
//
// We test the pure logic through the exported internal helpers:
//   resolveBatterySettingsTargets(os, brand) -> BatterySettingsTarget[]
//   isKnownAggressiveOEM(brand)              -> boolean
//
// This covers every code path without any react-native imports in the test file.

import {
  AGGRESSIVE_OEMS,
  ANDROID_BATTERY_SETTINGS_ACTION,
  ANDROID_STANDARD_BATTERY_TARGET,
  OEM_DEEP_LINKS,
  isKnownAggressiveOEM,
  resolveBatterySettingsTargets,
} from "../battery-optimization";

describe("resolveBatterySettingsTargets", () => {
  test("returns nothing on iOS regardless of brand", () => {
    expect(resolveBatterySettingsTargets("ios", "Samsung")).toEqual([]);
    expect(resolveBatterySettingsTargets("ios", "Xiaomi")).toEqual([]);
    expect(resolveBatterySettingsTargets("ios", "")).toEqual([]);
  });

  test("stock Android gets the standard battery list, and only that", () => {
    expect(resolveBatterySettingsTargets("android", "Google")).toEqual([
      ANDROID_STANDARD_BATTERY_TARGET,
    ]);
    expect(resolveBatterySettingsTargets("android", "")).toEqual([
      ANDROID_STANDARD_BATTERY_TARGET,
    ]);
  });

  // Linking.openURL builds ACTION_VIEW on the parsed URI and never calls
  // Intent.parseUri, so an `intent:` string resolves to nothing on every device
  // it reaches. An action has to travel as an action.
  test("the standard fallback is an intent action, never a URL", () => {
    expect(ANDROID_STANDARD_BATTERY_TARGET).toEqual({
      kind: "intent",
      action: ANDROID_BATTERY_SETTINGS_ACTION,
    });
    expect(ANDROID_BATTERY_SETTINGS_ACTION).not.toContain("intent:");
  });

  // Not the one-tap ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS dialog: that
  // needs a Play-restricted permission Airhop is not eligible for.
  test("uses the settings list action, not the request-exemption dialog", () => {
    expect(ANDROID_BATTERY_SETTINGS_ACTION).toBe(
      "android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS",
    );
  });

  test.each([
    ["Xiaomi", "miui://battery/autostart"],
    ["Redmi", "miui://battery/autostart"],
    ["POCO", "miui://battery/autostart"],
    ["OPPO", "opporinotoast://openintent/battery_optimize"],
    ["realme", "opporinotoast://openintent/battery_optimize"],
    ["OnePlus", "opporinotoast://openintent/battery_optimize"],
    ["vivo", "vivostatistic://com.vivo.permissionmanager/autostart"],
  ])("%s tries its own autostart screen first", (brand, uri) => {
    const targets = resolveBatterySettingsTargets("android", brand);
    expect(targets[0]).toEqual({ kind: "url", uri });
  });

  // OEM schemes are undocumented and disappear between skin versions, so one
  // must never be the only thing tried.
  test("an OEM deep link is always backed by the standard list", () => {
    for (const { brand } of OEM_DEEP_LINKS) {
      const targets = resolveBatterySettingsTargets("android", brand);
      expect(targets).toHaveLength(2);
      expect(targets[1]).toEqual(ANDROID_STANDARD_BATTERY_TARGET);
    }
  });

  // Samsung's sleeping-apps and Huawei's protected-apps screens live in their
  // own system-manager packages with no public action, so there is nothing to
  // deep-link to and the standard list is the whole of what the app can offer.
  test.each(["Samsung", "HUAWEI", "HONOR"])(
    "%s goes straight to the standard list rather than a wrong screen",
    (brand) => {
      expect(resolveBatterySettingsTargets("android", brand)).toEqual([
        ANDROID_STANDARD_BATTERY_TARGET,
      ]);
    },
  );

  test("brand matching is case-insensitive", () => {
    expect(resolveBatterySettingsTargets("android", "XIAOMI")).toEqual(
      resolveBatterySettingsTargets("android", "xiaomi"),
    );
    expect(resolveBatterySettingsTargets("android", "samsung")).toEqual(
      resolveBatterySettingsTargets("android", "SAMSUNG"),
    );
  });
});

describe("isKnownAggressiveOEM", () => {
  test("returns false for stock Android brands", () => {
    expect(isKnownAggressiveOEM("Google")).toBe(false);
    expect(isKnownAggressiveOEM("")).toBe(false);
    expect(isKnownAggressiveOEM("Motorola")).toBe(false);
  });

  test("returns true for every warned brand", () => {
    for (const brand of AGGRESSIVE_OEMS) {
      expect(isKnownAggressiveOEM(brand)).toBe(true);
    }
  });

  // The note and the deep link are separate questions: tied together, a brand
  // can only be warned about if a link happens to exist for it, and Samsung and
  // Huawei are among the most aggressive skins there are.
  test.each(["Samsung", "HUAWEI", "HONOR"])(
    "%s is warned about even with no deep link of its own",
    (brand) => {
      expect(isKnownAggressiveOEM(brand)).toBe(true);
      expect(
        OEM_DEEP_LINKS.some((e) => brand.toLowerCase().includes(e.brand)),
      ).toBe(false);
    },
  );
});

describe("the OEM tables", () => {
  test("no duplicate brand entries", () => {
    const brands = OEM_DEEP_LINKS.map((e) => e.brand);
    expect(new Set(brands).size).toBe(brands.length);
    expect(new Set(AGGRESSIVE_OEMS).size).toBe(AGGRESSIVE_OEMS.length);
  });

  test("all deep links are non-empty and carry a scheme", () => {
    for (const { uri } of OEM_DEEP_LINKS) {
      expect(uri).toMatch(/^[a-z][a-z0-9+.-]*:\/\//);
    }
  });

  // A brand with a deep link but no warning would open a screen nobody is ever
  // sent to, since the note is the only entry point.
  test("every deep-linked brand is also a warned brand", () => {
    for (const { brand } of OEM_DEEP_LINKS) {
      expect(isKnownAggressiveOEM(brand)).toBe(true);
    }
  });
});
