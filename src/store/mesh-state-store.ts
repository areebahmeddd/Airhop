// Transport health for the mesh status banner.
//
// Without this, "Bluetooth is switched off", "you denied the permission" and
// "nobody is nearby" all render identically, as an empty peer list and a radar
// spinning "Scanning for nearby peers…" forever. That is impossible for a user
// to diagnose and was the single most confusing gap in the Mesh tab.
//
// Not persisted: every field is live device state that must be re-read on
// launch, never restored from disk.

import { create } from "zustand";
import { usePeerStore } from "./peer-store";

export type MeshState =
  | "connected" // at least one peer in range
  | "scanning" // radio up, permission granted, no peers yet
  | "offline" // Bluetooth off, or permission denied
  | "nostr"; // no BLE, but the internet bridge is live

// Presence the user chose in Profile. Online advertises + scans, Away stops the
// mesh entirely, Invisible scans but stops advertising. Lives here, not in the
// Profile screen's local state, so it survives that screen unmounting on a tab
// switch: otherwise the label reset to "Online" while the mesh stayed stopped.
export type PresenceStatus = "online" | "away" | "invisible";

interface MeshStateStore {
  // OS Bluetooth toggle. Starts true so the banner doesn't flash "off" during
  // the first render, before native has reported.
  adapterEnabled: boolean;
  // Runtime BLE permission grant (Android). iOS reports via adapter state.
  permissionGranted: boolean;
  // Whether the Nostr relay pool has at least one live connection.
  nostrConnected: boolean;
  // Chosen presence. Session-level: the mesh starts Online on every launch, so
  // this resets to match rather than being restored from disk.
  presenceStatus: PresenceStatus;

  setAdapterEnabled: (enabled: boolean) => void;
  setPermissionGranted: (granted: boolean) => void;
  setNostrConnected: (connected: boolean) => void;
  setPresenceStatus: (status: PresenceStatus) => void;
}

export const useMeshStateStore = create<MeshStateStore>()((set) => ({
  adapterEnabled: true,
  permissionGranted: true,
  nostrConnected: false,
  presenceStatus: "online",

  setAdapterEnabled(enabled) {
    set({ adapterEnabled: enabled });
  },
  setPermissionGranted(granted) {
    set({ permissionGranted: granted });
  },
  setNostrConnected(connected) {
    set({ nostrConnected: connected });
  },
  setPresenceStatus(status) {
    set({ presenceStatus: status });
  },
}));

// Resolve the banner state from transport health + live peer count.
//
// Order matters: a hard blocker (radio off / permission denied) outranks
// "scanning", because telling someone to wait for peers when the radio is off
// is actively misleading.
export function resolveMeshState(
  adapterEnabled: boolean,
  permissionGranted: boolean,
  nostrConnected: boolean,
  peerCount: number,
): MeshState {
  if (!adapterEnabled || !permissionGranted) return "offline";
  if (peerCount > 0) return "connected";
  return nostrConnected ? "nostr" : "scanning";
}

// Hook form for components: recomputes as peers come and go.
export function useMeshState(): { state: MeshState; peerCount: number } {
  const adapterEnabled = useMeshStateStore((s) => s.adapterEnabled);
  const permissionGranted = useMeshStateStore((s) => s.permissionGranted);
  const nostrConnected = useMeshStateStore((s) => s.nostrConnected);
  const peerCount = usePeerStore((s) => s.peers.size);
  return {
    state: resolveMeshState(
      adapterEnabled,
      permissionGranted,
      nostrConnected,
      peerCount,
    ),
    peerCount,
  };
}
