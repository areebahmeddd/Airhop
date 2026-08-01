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
import { t, useLanguage } from "../i18n";
import {
  getDeviceBrand,
  needsBatteryOptimizationPrompt,
} from "../utils/battery-optimization";
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
//   bridge   islands stitched over the internet (indigo) — mesh bridge
//   neutral  a calm, intentional pause (muted)        — Away
export type BannerTone =
  "danger" | "caution" | "relay" | "tor" | "gateway" | "bridge" | "neutral";

// The single reason the BLE mesh cannot run right now, or "none".
//
// This replaces the three independent booleans (adapterEnabled,
// permissionGranted, locationServices) that used to stand in for it. Three
// booleans describe eight states, five of which are impossible, and nothing
// stopped them being mutually contradictory - which is how "permission granted,
// Bluetooth on, radios dead" became a state the UI had no vocabulary for. One
// value, set from one place, cannot disagree with itself.
//
// Ordered loosely by how early it stops us:
//   unsupported            no BLE hardware. Nothing will ever fix this.
//   permission-blocked     denied for good; only the Settings app can undo it.
//   permission-denied      denied, but the OS will still ask again.
//   precise-location       Android 12+: "Approximate" chosen, so scan results
//                          are withheld. Re-prompting does NOT re-offer Precise.
//   adapter-off            the radio is switched off.
//   location-services-off  Android: the OS location toggle is off, so the
//                          scanner returns nothing however healthy it looks.
//   starting               permissions just landed and the stack has not
//                          honoured them yet. Transient by definition.
//   none                   nothing is in the way.
export type BleBlocker =
  | "none"
  | "starting"
  | "unsupported"
  | "permission-denied"
  | "permission-blocked"
  | "precise-location"
  | "adapter-off"
  | "location-services-off";

// What a banner's button does. The banner layer names the intent; App.tsx owns
// the implementation, so the store stays free of navigation and native calls.
export type BannerAction =
  | "resume"
  | "enable-bluetooth"
  | "open-location-settings"
  | "open-app-settings"
  // Open the OEM's own background/autostart screen. Android only, and only on
  // the brands that actually need it - see utils/battery-optimization.ts.
  | "open-background-limits";

export interface MeshBanner {
  // Stable identity for React keys and de-duplication.
  key: string;
  label: string;
  tone: BannerTone;
  // A one-tap way out, when one exists. A blocker the user cannot act on from
  // the banner is a blocker they have to go and research, and the Mesh tab is
  // where they are already looking.
  action?: { label: string; kind: BannerAction };
  // Whether the user can put this one away for good.
  //
  // Only advisories are dismissible. A real blocker is not: hiding "Bluetooth
  // is off" would leave an empty radar with nothing explaining it, which is the
  // state this whole banner system exists to eliminate. Advice about a phone's
  // background behaviour is different - it is true, it is worth saying once,
  // and a user who has read it should not have to read it forever.
  dismissible?: boolean;
}

interface MeshStateStore {
  // Why the BLE mesh cannot run, or "none". Starts at "starting" rather than
  // "none": on the very first render we have not asked the device anything yet,
  // and claiming a healthy mesh before checking is the assumption that produced
  // a silent dead radio on first install. "starting" is honest and renders as a
  // calm note rather than an alarm.
  bleBlocker: BleBlocker;
  // Whether a Bluetooth permission refusal is permanent ("Don't allow" twice on
  // Android, any denial on iOS).
  //
  // Kept apart from bleBlocker because only the permission REQUEST can answer
  // it - neither platform reports it through the radio, so a later reconcile
  // reading the device would otherwise downgrade a known-permanent refusal back
  // to "ask again", and the banner would offer a prompt the OS silently
  // swallows.
  blePermissionBlocked: boolean;
  // Whether the radios are deliberately running a reduced scan that the user
  // would notice - a low battery with the app open. Set by the radio controller,
  // which is the only thing that knows both the power mode and whether anyone is
  // looking. Never true while backgrounded: a slower scan nobody is waiting on
  // is not worth a banner.
  powerSaving: boolean;
  // Foreground location permission. Powers the geohash public channels; the BLE
  // mesh works without it, so its banner is informational, not a hard blocker.
  // Distinct from the location-services-off blocker above, which is the OS-wide
  // toggle and does stop BLE scanning on Android.
  locationGranted: boolean;
  // Whether the Nostr relay pool has at least one live connection.
  nostrConnected: boolean;
  // Whether Nostr traffic is currently routed through Tor (see tor-routing.ts).
  // Mirrored here so the Mesh banner reacts the moment Tor is toggled.
  torActive: boolean;
  // Whether the mesh bridge is active (bridging with a known rendezvous cell)
  // and how many people are reachable across it. Mirrored here so the banner and
  // header react as participants come and go (see bridge-service.ts).
  bridgeActive: boolean;
  bridgePeopleAcross: number;
  // Chosen presence. Session-level: the mesh starts Online on every launch, so
  // this resets to match rather than being restored from disk.
  presenceStatus: PresenceStatus;

  setBleBlocker: (blocker: BleBlocker) => void;
  setBlePermissionBlocked: (blocked: boolean) => void;
  setPowerSaving: (saving: boolean) => void;
  setLocationGranted: (granted: boolean) => void;
  setNostrConnected: (connected: boolean) => void;
  setTorActive: (active: boolean) => void;
  setBridgeState: (active: boolean, peopleAcross: number) => void;
  setPresenceStatus: (status: PresenceStatus) => void;
}

export const useMeshStateStore = create<MeshStateStore>()((set) => ({
  bleBlocker: "starting",
  blePermissionBlocked: false,
  powerSaving: false,
  locationGranted: true,
  nostrConnected: false,
  torActive: false,
  bridgeActive: false,
  bridgePeopleAcross: 0,
  presenceStatus: "online",

  setBleBlocker(blocker) {
    set({ bleBlocker: blocker });
  },
  setBlePermissionBlocked(blocked) {
    set({ blePermissionBlocked: blocked });
  },
  setPowerSaving(saving) {
    set({ powerSaving: saving });
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
  setBridgeState(active, peopleAcross) {
    set({ bridgeActive: active, bridgePeopleAcross: peopleAcross });
  },
  setPresenceStatus(status) {
    set({ presenceStatus: status });
  },
}));

// Inputs to the banner computation. Kept as a plain object so it is trivially
// unit-testable without a live store.
export interface MeshBannerInputs {
  presenceStatus: PresenceStatus;
  bleBlocker: BleBlocker;
  locationGranted: boolean;
  // The OEM brand whose background limits are known to kill foreground services
  // (Xiaomi, Samsung, Oppo, ...), or undefined when there is nothing to say -
  // stock Android, iOS, or a user who has already acknowledged the note.
  //
  // Optional so every existing caller keeps compiling and simply gets no
  // advisory, which is the correct default for a device we know nothing about.
  backgroundLimitsBrand?: string;
  // The radios are scanning in short bursts to save a nearly flat battery, and
  // the user is watching. Optional so existing callers keep compiling and get no
  // note, which is the right default for a device whose battery we cannot read.
  powerSaving?: boolean;
  nostrConnected: boolean;
  torActive: boolean;
  gatewayEnabled: boolean;
  bridgeActive: boolean;
  bridgePeopleAcross: number;
  internetEnabled: boolean;
  peerCount: number;
}

// One blocker, one banner, one way out.
//
// Every branch names the specific thing that is wrong rather than a category,
// because the generic version of this ("Bluetooth permission needed") was
// advice that could not be acted on: it was shown for a revoked permission, a
// permanently blocked one, and a location downgrade, and only one of those is
// fixed by granting Bluetooth.
function bleBlockerBanner(blocker: BleBlocker): MeshBanner | null {
  switch (blocker) {
    case "none":
      return null;

    // Not a fault, and not worth alarming anyone over: the radios are coming
    // up. It appears for a beat on a cold start and while a fresh grant settles.
    // Saying so beats both a red banner and a silent lie.
    case "starting":
      return {
        key: "ble-starting",
        label: t("mesh.banner.starting"),
        tone: "neutral",
      };

    case "unsupported":
      return {
        key: "ble-unsupported",
        label: t("mesh.banner.no_bluetooth"),
        tone: "caution",
      };

    case "adapter-off":
      return {
        key: "ble-adapter-off",
        label: t("mesh.banner.bluetooth_off"),
        tone: "danger",
        action: {
          label: t("mesh.banner.action.turn_on"),
          kind: "enable-bluetooth",
        },
      };

    case "permission-denied":
      return {
        key: "ble-permission",
        label: t("mesh.banner.permission_needed"),
        tone: "danger",
        action: {
          label: t("mesh.banner.action.allow"),
          kind: "open-app-settings",
        },
      };

    case "permission-blocked":
      return {
        key: "ble-permission-blocked",
        label: t("mesh.banner.blocked"),
        tone: "danger",
        action: { label: t("common.settings"), kind: "open-app-settings" },
      };

    // Android 12+ only. Re-requesting will not re-offer Precise, so Settings is
    // the only route and the copy has to say what to change once there.
    case "precise-location":
      return {
        key: "ble-precise-location",
        label: t("mesh.banner.precise_location"),
        tone: "danger",
        action: { label: t("common.settings"), kind: "open-app-settings" },
      };

    // The permission is granted and the radio is on; the OS-wide location
    // toggle is off, and Android withholds scan results without it. Nothing
    // about the app looks wrong, which is why this has to be said out loud.
    case "location-services-off":
      return {
        key: "ble-location-services",
        label: t("mesh.banner.location_off_android"),
        tone: "danger",
        action: {
          label: t("mesh.banner.action.turn_on"),
          kind: "open-location-settings",
        },
      };
  }
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
      {
        key: "paused",
        label: t("mesh.banner.paused"),
        tone: "neutral",
        action: { label: t("mesh.banner.action.resume"), kind: "resume" },
      },
    ];
  }

  const banners: MeshBanner[] = [];

  // The one thing standing between the user and a working mesh, said plainly,
  // with the button that fixes it. Exactly one of these can apply, because
  // bleBlocker is one value.
  const blocked = bleBlockerBanner(inputs.bleBlocker);
  if (blocked !== null) banners.push(blocked);

  // Aggressive OEM background management is the last remaining way the mesh can
  // stop relaying without anything announcing it: the foreground service is
  // reaped, no callback fires, and the app only finds out because it comes back
  // to a stopped mesh. It ranks above the location note because it affects the
  // mesh itself rather than one feature that rides on it.
  if (
    inputs.backgroundLimitsBrand !== undefined &&
    inputs.backgroundLimitsBrand.length > 0
  ) {
    banners.push({
      key: "background-limits",
      label: t("mesh.banner.background_limits", {
        brand: inputs.backgroundLimitsBrand,
      }),
      tone: "caution",
      action: {
        label: t("mesh.banner.action.fix"),
        kind: "open-background-limits",
      },
      dismissible: true,
    });
  }

  // Location is informational: the BLE mesh works without it, only the location
  // (geohash) channels need it.
  if (!inputs.locationGranted) {
    banners.push({
      key: "location",
      label: t("mesh.banner.location_off"),
      tone: "caution",
    });
  }

  // Not a fault, and not something to act on: the phone is low and the app has
  // turned the scan down to bursts rather than draining what is left. Worth
  // saying only because the visible symptom - peers taking half a minute to
  // appear - is otherwise indistinguishable from the mesh being broken. Muted
  // rather than amber, because nothing is wrong. No button, because there is
  // nothing to tap: charging the phone is the fix, and it clears itself.
  if (inputs.powerSaving === true) {
    banners.push({
      key: "power-saving",
      label: t("mesh.banner.battery_saver"),
      tone: "neutral",
    });
  }

  // Internet off is a deliberate pure-Bluetooth mode: say so once and skip the
  // internet-dependent notes below (relay, Tor, gateway, bridge) that cannot
  // apply while no relay is contacted.
  if (!inputs.internetEnabled) {
    banners.push({
      key: "internet-off",
      label: t("mesh.banner.internet_off"),
      tone: "neutral",
    });
    return banners;
  }

  // Internet fallback: no one is in BLE range but a relay is carrying traffic.
  if (inputs.peerCount === 0 && inputs.nostrConnected) {
    banners.push({
      key: "nostr",
      label: t("mesh.banner.relaying"),
      tone: "relay",
    });
  }

  // Tor indicator: a calm, persistent reminder that internet traffic is onion
  // routed, so the user can trust (and verify) their privacy at a glance.
  if (inputs.torActive) {
    banners.push({
      key: "tor",
      label: t("mesh.banner.tor"),
      tone: "tor",
    });
  }

  // Gateway indicator: this device is spending its data/battery relaying nearby
  // offline peers' location messages to the internet, so make that visible.
  if (inputs.gatewayEnabled) {
    banners.push({
      key: "gateway",
      label: t("mesh.banner.gateway"),
      tone: "gateway",
    });
  }

  // Bridge indicator: public mesh chat is stitched across islands over the
  // internet. Shows the count reachable across the bridge once anyone is seen.
  if (inputs.bridgeActive) {
    const across = inputs.bridgePeopleAcross;
    banners.push({
      key: "bridge",
      label:
        across > 0
          ? t("mesh.banner.bridge_across", { count: across })
          : t("mesh.banner.bridge"),
      tone: "bridge",
    });
  }

  return banners;
}

// Hook form for components: recomputes as presence, permissions, relay, Tor and
// peers change.
export function useMeshBanners(): MeshBanner[] {
  // Every banner label and action below is translated at call time, so the
  // language is a real input to this computation. Subscribing states that
  // outright: without it the banners would still refresh, but only because a
  // parent happened to re-render, which is the kind of coupling that survives
  // exactly until somebody memoises the parent.
  void useLanguage();
  const presenceStatus = useMeshStateStore((s) => s.presenceStatus);
  const bleBlocker = useMeshStateStore((s) => s.bleBlocker);
  const locationGranted = useMeshStateStore((s) => s.locationGranted);
  const nostrConnected = useMeshStateStore((s) => s.nostrConnected);
  const torActive = useMeshStateStore((s) => s.torActive);
  const gatewayEnabled = useSettingsStore((s) => s.gatewayEnabled);
  const bridgeActive = useMeshStateStore((s) => s.bridgeActive);
  const bridgePeopleAcross = useMeshStateStore((s) => s.bridgePeopleAcross);
  const internetEnabled = useSettingsStore((s) => s.internetEnabled);
  const peerCount = usePeerStore((s) => s.peers.size);
  // Read once and only while it still matters: an acknowledged note is gone for
  // good, and on stock Android or iOS there is nothing to say in the first place.
  const backgroundLimitsAcknowledged = useSettingsStore(
    (s) => s.backgroundLimitsAcknowledged,
  );
  const powerSaving = useMeshStateStore((s) => s.powerSaving);
  const backgroundLimitsBrand =
    !backgroundLimitsAcknowledged && needsBatteryOptimizationPrompt()
      ? getDeviceBrand()
      : undefined;
  return computeMeshBanners({
    presenceStatus,
    bleBlocker,
    locationGranted,
    backgroundLimitsBrand,
    powerSaving,
    nostrConnected,
    torActive,
    gatewayEnabled,
    bridgeActive,
    bridgePeopleAcross,
    internetEnabled,
    peerCount,
  });
}
