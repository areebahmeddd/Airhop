// Coarse location for geohash channels.
//
// Location is used for exactly two things: deciding which geohash cell the
// user is in (so #block/#city/etc. resolve to a real channel), and picking
// Nostr relays that are physically near them. Nothing else.
//
// Deliberately COARSE accuracy, never Highest: a geohash cell is 150 m across
// at its finest here, so GPS-grade precision would buy nothing and cost
// battery and privacy. The raw coordinates never leave the device, only the
// truncated geohash string is ever published.
//
// Every failure path returns null rather than throwing. Location is optional:
// the app must stay fully usable over BLE with location denied, so a refusal
// degrades geohash channels rather than breaking the app.

import * as Location from "expo-location";

export interface Coords {
  lat: number;
  lng: number;
}

// Re-check position at most this often. Geohash cells are large, so polling
// harder would just drain battery for no behavioural change.
const REFRESH_MS = 5 * 60 * 1000;

let cached: { coords: Coords; atMs: number } | null = null;

// Ask for foreground location. Safe to call repeatedly: the OS only shows the
// prompt once. Returns false if the user declined.
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  } catch {
    return false;
  }
}

export async function hasLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  } catch {
    return false;
  }
}

// Current coarse position, or null if unavailable/denied.
// Served from a short cache so several callers on one screen don't each
// trigger a separate fix.
export async function getCoarseLocation(
  forceRefresh = false,
): Promise<Coords | null> {
  if (
    !forceRefresh &&
    cached !== null &&
    Date.now() - cached.atMs < REFRESH_MS
  ) {
    return cached.coords;
  }

  if (!(await hasLocationPermission())) return null;

  try {
    const position = await Location.getLastKnownPositionAsync();
    // A last-known fix is instant and plenty accurate for a geohash cell;
    // only pay for a live fix when there's nothing cached on the device.
    const resolved =
      position ??
      (await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }));
    if (!resolved) return null;

    const coords: Coords = {
      lat: resolved.coords.latitude,
      lng: resolved.coords.longitude,
    };
    cached = { coords, atMs: Date.now() };
    return coords;
  } catch {
    // Location services off at the OS level, or no fix available.
    return null;
  }
}

// Drop the cached fix. Called on panic wipe so a stale position can't outlive
// the identity that observed it.
export function clearLocationCache(): void {
  cached = null;
}
