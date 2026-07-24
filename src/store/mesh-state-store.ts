// Transport health for the Mesh-tab status banners.
//
// Without this, "Bluetooth is switched off", "you denied the permission",
// "location is off" and "nobody is nearby" all render identically, as an empty
// peer list and a radar spinning "Scanning for nearby peers…" forever. That is
// impossible for a user to diagnose and was the single most confusing gap in
// the Mesh tab.
//
// The Mesh tab can show SEVERAL banners at once (e.g. Bluetooth off AND location
// off), so this exposes an ordered list rather than a single state. Order is
// severity-first: a hard blocker outranks an informational note.
//
// Not persisted: every field is live device state that must be re-read on
// launch, never restored from disk.

import { create } from "zustand";
import { usePeerStore } from "./peer-store";
import { useSettingsStore } from "./settings-store";

// Presence the user chose in Profile. Online advertises + scans, Away stops the
// mesh entirely, Invisible scans but stops advertising. Lives here, not in the
// Profile screen's local state, so it survives that screen unmounting on a tab
// switch: otherwise the label reset to "Online" while the mesh stayed stopped.
export type PresenceStatus = "online" | "away" | "invisible";

// A banner's semantic tone, which the status bar maps to a hue. Each names a
// distinct network state rather than a generic weight, so the Mesh tab reads at
// a glance:
//   danger   a hard blocker to fix now (red)          — Bluetooth off, permission
//   caution  a feature is unavailable (amber)         — location off
//   relay    traffic carried over the internet (blue) — Nostr relay
//   tor      internet traffic onion-routed (purple)   — Tor on
//   gateway  this device relaying for others (teal)   — internet gateway
//   neutral  a calm, intentional pause (muted)        — Away
export type BannerTone =
  "danger" | "caution" | "relay" | "tor" | "gateway" | "neutral";

export interface MeshBanner {
  // Stable identity for React keys and de-duplication.
  key: string;
  label: string;
  tone: BannerTone;
}

interface MeshStateStore {
  // OS Bluetooth toggle. Starts true so the banner doesn't flash "off" during
  // the first render, before native has reported.
  adapterEnabled: boolean;
  // Runtime BLE permission grant (Android). iOS reports via adapter state.
  permissionGranted: boolean;
  // Foreground location permission. Powers the geohash public channels; the BLE
  // mesh works without it, so its banner is informational, not a hard blocker.
  locationGranted: boolean;
  // Whether the Nostr relay pool has at least one live connection.
  nostrConnected: boolean;
  // Whether Nostr traffic is currently routed through Tor (see tor-routing.ts).
  // Mirrored here so the Mesh banner reacts the moment Tor is toggled.
  torActive: boolean;
  // Chosen presence. Session-level: the mesh starts Online on every launch, so
  // this resets to match rather than being restored from disk.
  presenceStatus: PresenceStatus;

  setAdapterEnabled: (enabled: boolean) => void;
  setPermissionGranted: (granted: boolean) => void;
  setLocationGranted: (granted: boolean) => void;
  setNostrConnected: (connected: boolean) => void;
  setTorActive: (active: boolean) => void;
  setPresenceStatus: (status: PresenceStatus) => void;
}

export const useMeshStateStore = create<MeshStateStore>()((set) => ({
  adapterEnabled: true,
  permissionGranted: true,
  locationGranted: true,
  nostrConnected: false,
  torActive: false,
  presenceStatus: "online",

  setAdapterEnabled(enabled) {
    set({ adapterEnabled: enabled });
  },
  setPermissionGranted(granted) {
    set({ permissionGranted: granted });
  },
  setLocationGranted(granted) {
    set({ locationGranted: granted });
  },
  setNostrConnected(connected) {
    set({ nostrConnected: connected });
  },
  setTorActive(active) {
    set({ torActive: active });
  },
  setPresenceStatus(status) {
    set({ presenceStatus: status });
  },
}));

// Inputs to the banner computation. Kept as a plain object so it is trivially
// unit-testable without a live store.
export interface MeshBannerInputs {
  presenceStatus: PresenceStatus;
  adapterEnabled: boolean;
  permissionGranted: boolean;
  locationGranted: boolean;
  nostrConnected: boolean;
  torActive: boolean;
  gatewayEnabled: boolean;
  peerCount: number;
}

// Resolve the ordered set of banners from presence + transport health + peers.
//
// Order = severity: a deliberate pause and hard blockers come first, then the
// informational notes. "Away" is special: it stops the whole mesh, so it is the
// only thing worth saying and it short-circuits the rest (telling someone their
// Bluetooth is off while they chose to go dark would be noise). Invisible is
// intentionally NOT special-cased: it still scans and relays, so its banners
// track real connectivity.
export function computeMeshBanners(inputs: MeshBannerInputs): MeshBanner[] {
  if (inputs.presenceStatus === "away") {
    return [
      { key: "paused", label: "Mesh paused · You're away", tone: "neutral" },
    ];
  }

  const banners: MeshBanner[] = [];

  // Hard blockers for the BLE mesh, most severe first.
  if (!inputs.adapterEnabled) {
    banners.push({
      key: "bluetooth",
      label: "Bluetooth off · mesh unavailable",
      tone: "danger",
    });
  } else if (!inputs.permissionGranted) {
    banners.push({
      key: "ble-permission",
      label: "Bluetooth permission needed",
      tone: "danger",
    });
  }

  // Location is informational: the BLE mesh works without it, only the location
  // (geohash) channels need it.
  if (!inputs.locationGranted) {
    banners.push({
      key: "location",
      label: "Location off · location channels unavailable",
      tone: "caution",
    });
  }

  // Internet fallback: no one is in BLE range but a relay is carrying traffic.
  if (inputs.peerCount === 0 && inputs.nostrConnected) {
    banners.push({
      key: "nostr",
      label: "No local peers · relaying via Nostr",
      tone: "relay",
    });
  }

  // Tor indicator: a calm, persistent reminder that internet traffic is onion
  // routed, so the user can trust (and verify) their privacy at a glance.
  if (inputs.torActive) {
    banners.push({
      key: "tor",
      label: "Tor on · internet traffic routed",
      tone: "tor",
    });
  }

  // Gateway indicator: this device is spending its data/battery relaying nearby
  // offline peers' location messages to the internet, so make that visible.
  if (inputs.gatewayEnabled) {
    banners.push({
      key: "gateway",
      label: "Internet gateway on · relaying nearby peers",
      tone: "gateway",
    });
  }

  return banners;
}

// Hook form for components: recomputes as presence, permissions, relay, Tor and
// peers change.
export function useMeshBanners(): MeshBanner[] {
  const presenceStatus = useMeshStateStore((s) => s.presenceStatus);
  const adapterEnabled = useMeshStateStore((s) => s.adapterEnabled);
  const permissionGranted = useMeshStateStore((s) => s.permissionGranted);
  const locationGranted = useMeshStateStore((s) => s.locationGranted);
  const nostrConnected = useMeshStateStore((s) => s.nostrConnected);
  const torActive = useMeshStateStore((s) => s.torActive);
  const gatewayEnabled = useSettingsStore((s) => s.gatewayEnabled);
  const peerCount = usePeerStore((s) => s.peers.size);
  return computeMeshBanners({
    presenceStatus,
    adapterEnabled,
    permissionGranted,
    locationGranted,
    nostrConnected,
    torActive,
    gatewayEnabled,
    peerCount,
  });
}
