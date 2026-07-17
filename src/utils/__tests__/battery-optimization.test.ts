/**
 * @jest-environment node
 */

// Tests for battery-optimization.ts.
//
// The public API (getBatteryOptimizationSettingsURI, needsBatteryOptimizationPrompt)
// reads Platform.OS and Platform.constants.Brand directly from react-native, which
// cannot be cleanly mocked without breaking jest-expo's setup files.
//
// We test the pure logic through the exported internal helpers:
//   resolveSettingsURI(os, brand) -> OEMSettingsURI
//   isKnownAggressiveOEM(brand)   -> boolean
//
// This covers every code path without any react-native imports in the test file.

import {
  ANDROID_STANDARD_BATTERY_URI,
  OEM_DEEP_LINKS,
  isKnownAggressiveOEM,
  resolveSettingsURI,
} from "../battery-optimization";

describe("resolveSettingsURI", () => {
  test("returns null on iOS regardless of brand", () => {
    expect(resolveSettingsURI("ios", "Samsung")).toBeNull();
    expect(resolveSettingsURI("ios", "Xiaomi")).toBeNull();
    expect(resolveSettingsURI("ios", "")).toBeNull();
  });

  test("returns standard Android URI for unknown/stock brand", () => {
    expect(resolveSettingsURI("android", "Google")).toBe(
      ANDROID_STANDARD_BATTERY_URI,
    );
    expect(resolveSettingsURI("android", "")).toBe(
      ANDROID_STANDARD_BATTERY_URI,
    );
  });

  test("returns Xiaomi deep link for Xiaomi brand", () => {
    expect(resolveSettingsURI("android", "Xiaomi")).toBe(
      "miui://battery/autostart",
    );
  });

  test("returns Xiaomi deep link for Redmi brand", () => {
    expect(resolveSettingsURI("android", "Redmi")).toBe(
      "miui://battery/autostart",
    );
  });

  test("returns Xiaomi deep link for POCO brand", () => {
    expect(resolveSettingsURI("android", "POCO")).toBe(
      "miui://battery/autostart",
    );
  });

  test("returns Samsung URI for Samsung brand", () => {
    expect(resolveSettingsURI("android", "Samsung")).toBe(
      "package:tech.permissionless.airhop",
    );
  });

  test("returns Huawei URI for HUAWEI brand", () => {
    const uri = resolveSettingsURI("android", "HUAWEI");
    expect(uri).toContain("hwappmarket");
  });

  test("returns Huawei URI for HONOR brand", () => {
    const uri = resolveSettingsURI("android", "HONOR");
    expect(uri).toContain("hwappmarket");
  });

  test("returns Oppo URI for OPPO brand", () => {
    const uri = resolveSettingsURI("android", "OPPO");
    expect(uri).toContain("opporinotoast");
  });

  test("returns Oppo URI for OnePlus brand", () => {
    const uri = resolveSettingsURI("android", "OnePlus");
    expect(uri).toContain("opporinotoast");
  });

  test("returns Oppo URI for realme brand", () => {
    const uri = resolveSettingsURI("android", "realme");
    expect(uri).toContain("opporinotoast");
  });

  test("returns Vivo URI for vivo brand", () => {
    const uri = resolveSettingsURI("android", "vivo");
    expect(uri).toContain("vivostatistic");
  });

  test("brand matching is case-insensitive", () => {
    expect(resolveSettingsURI("android", "XIAOMI")).toBe(
      resolveSettingsURI("android", "xiaomi"),
    );
    expect(resolveSettingsURI("android", "samsung")).toBe(
      resolveSettingsURI("android", "SAMSUNG"),
    );
  });
});

describe("isKnownAggressiveOEM", () => {
  test("returns false for stock Android brands", () => {
    expect(isKnownAggressiveOEM("Google")).toBe(false);
    expect(isKnownAggressiveOEM("")).toBe(false);
    expect(isKnownAggressiveOEM("Motorola")).toBe(false);
  });

  test("returns true for Xiaomi", () => {
    expect(isKnownAggressiveOEM("Xiaomi")).toBe(true);
  });

  test("returns true for Samsung", () => {
    expect(isKnownAggressiveOEM("Samsung")).toBe(true);
  });

  test("returns true for all entries in OEM_DEEP_LINKS", () => {
    for (const { brand } of OEM_DEEP_LINKS) {
      expect(isKnownAggressiveOEM(brand)).toBe(true);
    }
  });
});

describe("OEM_DEEP_LINKS constant", () => {
  test("no duplicate brand entries", () => {
    const brands = OEM_DEEP_LINKS.map((e) => e.brand);
    const unique = new Set(brands);
    expect(unique.size).toBe(brands.length);
  });

  test("all URIs are non-empty strings", () => {
    for (const { uri } of OEM_DEEP_LINKS) {
      expect(typeof uri).toBe("string");
      expect(uri.length).toBeGreaterThan(0);
    }
  });

  test("ANDROID_STANDARD_BATTERY_URI is not in OEM_DEEP_LINKS", () => {
    const found = OEM_DEEP_LINKS.some(
      (e) => e.uri === ANDROID_STANDARD_BATTERY_URI,
    );
    expect(found).toBe(false);
  });
});
