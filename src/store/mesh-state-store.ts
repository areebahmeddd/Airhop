// Transport health for the Mesh-tab status banners.
//
// Without this, "Bluetooth is switched off", "you denied the permission",
// "location is off" and "nobody is nearby" all render identically, as an empty
// peer list and a radar spinning "Scanning for nearby peers..." forever. That is
// impossible for a user to diagnose and was the single most confusing gap in
// the Mesh tab.
//
// The Mesh tab can show SEVERAL banners at once (e.g. Bluetooth off AND location
// off), so this exposes an ordered list rather than a single state. Order is
// severity-first: a hard blocker outranks an informational note.
//
// Not persisted: every field is live device state that must be re-read on
// launch, never restored from disk.

import { t, useLanguage } from "@i18n";
import {
  getDeviceBrand,
  needsBatteryOptimizationPrompt,
} from "@platform/battery-optimization";
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
//   danger   a hard blocker to fix now (red), Bluetooth off, permission
//   caution  a feature is unavailable (amber), location off
//   relay    traffic carried over the internet (blue), Nostr relay
//   tor      internet traffic onion-routed (purple), Tor on
//   gateway  this device relaying for others (teal), internet gateway
//   bridge   islands stitched over the internet (indigo), mesh bridge
//   neutral  a calm, intentional pause (muted), Away
export type BannerTone =
  "danger" | "caution" | "relay" | "tor" | "gateway" | "bridge" | "neutral";

// How far along Airhop's own Tor bootstrap is. iOS only; see `torBootstrap`.
export type TorBootstrapPhase = "idle" | "starting" | "blocked";

// State of the WiFi Aware fast path, the high-bandwidth transport that carries
// photos and files between two phones on the same platform. BLE carries
// everything without it, so none of this is ever a blocker.
//
//   unknown      not asked yet, or a failure we cannot name. Says nothing,
//                which is the only honest thing to render for "no reading".
//   unsupported  no Aware hardware, or an OS below the floor (API 29 on
//                Android, iOS 26 here).
//   active       attached, publishing and subscribing.
//   unavailable  the device has it, but not right now - WiFi switched off,
//                tethering, battery saver. Android only, since iOS exposes no
//                equivalent reading. The only state worth a banner: it is the
//                one the user can undo, and the difference it makes (a video
//                that arrives in seconds rather than minutes) is otherwise
//                invisible.
//   unpaired     iOS only. Everything works and nothing is paired, so there is
//                nobody to reach. A resting state rather than a fault, shown on
//                the Network screen beside the control that answers it.
//   permission   NEARBY_WIFI_DEVICES missing. Android only, and not surfaced,
//                but not because it could not be: from API 33 that permission
//                shares a group with the BLUETOOTH_* ones, so the single dialog
//                that grants Bluetooth grants it too and this state is close to
//                unreachable. A banner for it would carry more weight than the
//                situation has.
export type WifiFastPath =
  | "unknown"
  | "unsupported"
  | "active"
  | "unavailable"
  | "unpaired"
  | "permission";

// The single reason the BLE mesh cannot run right now, or "none".
//
// One value rather than three independent booleans (adapterEnabled,
// permissionGranted, locationServices). Three booleans describe eight states,
// five of which are impossible, and nothing stops them contradicting each other,
// which is how "permission granted, Bluetooth on, radios dead" becomes a state
// the UI has no vocabulary for. One
// value, set from one place, cannot disagree with itself.
//
// Ordered loosely by how early it stops us:
//   unsupported            no BLE hardware. Nothing will ever fix this.
//   permission-blocked     denied for good; only the Settings app can undo it.
//   permission-denied      denied, but the OS will still ask again.
//   location-permission    Android 11 and below: the permission waited on is
//                          LOCATION, since BLUETOOTH_SCAN does not exist there.
//                          Distinct from the two above because those versions
//                          list no Bluetooth entry in app settings at all.
//   adapter-off            the radio is switched off.
//   location-services-off  Android 11 and below: the OS location toggle is off,
//                          so the scanner returns nothing however healthy it
//                          looks. Cannot occur from API 31, where the manifest
//                          asserts neverForLocation on BLUETOOTH_SCAN.
//   starting               permissions just landed and the stack has not
//                          honoured them yet. Transient by definition.
//   none                   nothing is in the way.
//
// A `precise-location` member covered the Android 12+ "Approximate" case. It
// went with the location coupling: the mesh no longer asks for location on API
// 31+, so the state cannot arise.
export type BleBlocker =
  | "none"
  | "starting"
  | "unsupported"
  | "permission-denied"
  | "permission-blocked"
  | "location-permission"
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
  // This device's Bluetooth chipset has no peripheral role, so it can scan and
  // relay but can never advertise. Distinct from every BleBlocker: the mesh is
  // working, one half of it is simply unavailable on this hardware and always
  // will be. Set once by the radio controller, off a native UNSUPPORTED refusal.
  bleAdvertisingUnsupported: boolean;
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
  // A panic wipe left secrets on the device. Set when a wipe reports that the
  // keychain refused something, and when a launch with no identity to own them
  // still finds secrets it can read. Never persisted: it is re-derived every
  // launch, so a retry that succeeds simply stops raising it - and a wipe leaves
  // no on-disk trace of having been attempted.
  wipeIncomplete: boolean;
  // The location cells we are currently listening for geo DMs in, or null when
  // we cannot say (no position fix, or the mesh is stopped). A conversation
  // started in a cell that is not in this list can still be written to, but
  // nothing sent back reaches us - see publishLiveCells in
  // services/geohash-channel-service for why null is not the empty list.
  liveGeoCells: string[] | null;
  // State of the WiFi Aware fast path (see services/wifi-controller).
  wifiFastPath: WifiFastPath;
  // Wi-Fi Aware pairing, iOS only (see services/wifi-pairing-service). Both stay
  // false and zero on Android, where the Network screen hides the section rather
  // than showing a control that would do nothing.
  wifiPairingSupported: boolean;
  wifiPairedCount: number;
  // Whether the Nostr relay pool has at least one live connection.
  nostrConnected: boolean;
  // Whether Nostr traffic is currently routed through Tor (see tor-routing.ts).
  // Mirrored here so the Mesh banner reacts the moment Tor is toggled.
  torActive: boolean;
  // Why `torActive` is not true while the user has asked for Tor.
  //
  //   idle      nothing to say (Tor off, or Tor is routing)
  //   starting  the route is being established and may yet succeed. On iOS,
  //             Arti building a circuit. On Android, the first moments of a
  //             launch, before the Orbot probe has answered - short, but the
  //             gate is already shut behind it, so it needs a name that is not
  //             a verdict.
  //   blocked   Tor is wanted and is not carrying traffic. On iOS that is a
  //             bootstrap that ran out its deadline, which is what a network
  //             filtering Tor looks like. On Android it is Orbot stopped or
  //             uninstalled.
  //
  // Separate from `torActive` on purpose. That flag is a privacy claim and must
  // stay false while a circuit is only forming; this is the explanation for WHY
  // the claim is not yet true, which is the difference between a user who
  // thinks the app is broken and one who knows to wait or move network.
  torBootstrap: TorBootstrapPhase;
  // Android: hold the Nostr transport DOWN, because Tor is on and nothing is
  // routing through it. While this is true mesh-service refuses to build the
  // transport and tears down any that exists; Bluetooth is untouched, so only
  // the internet half pauses.
  //
  // The two platforms fail closed in different places. iOS installs the Tor
  // socket factory before any circuit exists, so a relay connection is dialled
  // through Arti's SOCKS proxy and fails until it is up. Android has no
  // per-socket shim - Orbot routes transparently at the OS level - so the same
  // sockets keep working the instant its VPN goes, carrying geohash presence
  // (a location), DM metadata and bridge events for someone who asked for none
  // of it.
  //
  // Set true BEFORE the answer is known: at launch with Tor on, Orbot has not
  // been probed yet, and assuming it routes is a clear-net window in the one
  // state that must not have one.
  //
  // Always false on iOS. services/tor-routing.ts is the only writer.
  nostrBlockedByTor: boolean;
  // Whether the mesh bridge is active (bridging with a known rendezvous cell)
  // and how many people are reachable across it. Mirrored here so the banner and
  // header react as participants come and go (see bridge-service.ts).
  bridgeActive: boolean;
  bridgePeopleAcross: number;
  // Whether this device's clock looks wrong to the mesh.
  //
  // Every packet is held to a +/-2 minute freshness window, which stops a
  // recorded packet being replayed at someone who never heard the original. The
  // cost is that a drifted phone rejects everything it hears and has everything
  // it sends rejected, going mute while showing a healthy radio and an empty
  // room. That is indistinguishable from nobody being around.
  //
  // Set only when several different peers look out of time, since one peer
  // sending stale packets is that peer's problem rather than our clock.
  clockSkewed: boolean;
  // Chosen presence. Session-level: the mesh starts Online on every launch, so
  // this resets to match rather than being restored from disk.
  presenceStatus: PresenceStatus;

  setClockSkewed: (skewed: boolean) => void;
  setBleBlocker: (blocker: BleBlocker) => void;
  setBleAdvertisingUnsupported: (unsupported: boolean) => void;
  setBlePermissionBlocked: (blocked: boolean) => void;
  setPowerSaving: (saving: boolean) => void;
  setLocationGranted: (granted: boolean) => void;
  setWipeIncomplete: (incomplete: boolean) => void;
  setLiveGeoCells: (cells: string[] | null) => void;
  setWifiFastPath: (state: WifiFastPath) => void;
  setWifiPairing: (supported: boolean, count: number) => void;
  setNostrConnected: (connected: boolean) => void;
  setTorActive: (active: boolean) => void;
  setTorBootstrap: (phase: TorBootstrapPhase) => void;
  setNostrBlockedByTor: (blocked: boolean) => void;
  setBridgeState: (active: boolean, peopleAcross: number) => void;
  setPresenceStatus: (status: PresenceStatus) => void;
}

export const useMeshStateStore = create<MeshStateStore>()((set) => ({
  bleBlocker: "starting",
  bleAdvertisingUnsupported: false,
  blePermissionBlocked: false,
  powerSaving: false,
  locationGranted: true,
  wipeIncomplete: false,
  liveGeoCells: null,
  wifiFastPath: "unknown",
  wifiPairingSupported: false,
  wifiPairedCount: 0,
  nostrConnected: false,
  torActive: false,
  torBootstrap: "idle",
  nostrBlockedByTor: false,
  bridgeActive: false,
  bridgePeopleAcross: 0,
  clockSkewed: false,
  presenceStatus: "online",

  setClockSkewed(skewed) {
    set({ clockSkewed: skewed });
  },
  setBleBlocker(blocker) {
    set({ bleBlocker: blocker });
  },
  setBleAdvertisingUnsupported(unsupported) {
    set({ bleAdvertisingUnsupported: unsupported });
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
  setWipeIncomplete(incomplete) {
    set({ wipeIncomplete: incomplete });
  },
  setLiveGeoCells(cells) {
    set({ liveGeoCells: cells });
  },
  setWifiFastPath(state) {
    set({ wifiFastPath: state });
  },
  setWifiPairing(supported, count) {
    set({ wifiPairingSupported: supported, wifiPairedCount: count });
  },
  setNostrConnected(connected) {
    set({ nostrConnected: connected });
  },
  setTorActive(active) {
    set({ torActive: active });
  },
  setTorBootstrap(phase) {
    set({ torBootstrap: phase });
  },
  setNostrBlockedByTor(blocked) {
    set({ nostrBlockedByTor: blocked });
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
  // This device's clock looks wrong to the mesh. Optional so existing callers
  // keep compiling and get no banner, which is the right default for a caller
  // with no evidence either way.
  clockSkewed?: boolean;
  // This chipset has no BLE peripheral role, so the device can scan and relay
  // but can never be discovered. Optional, defaulting to the capable case.
  advertisingUnsupported?: boolean;
  // State of the WiFi Aware fast path. Optional and defaulting to "unknown", so
  // a caller with no reading says nothing rather than guessing.
  wifiFastPath?: WifiFastPath;
  // A panic wipe left secrets behind. Optional, defaulting to the case where
  // nothing has told us otherwise.
  wipeIncomplete?: boolean;
  nostrConnected: boolean;
  torActive: boolean;
  // Optional so existing callers keep compiling; absent reads as "idle".
  torBootstrap?: TorBootstrapPhase;
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

    // Android 11 and below. Same action as the two above, since Settings is the
    // only route either way; only the noun changes.
    case "location-permission":
      return {
        key: "ble-location-permission",
        label: t("mesh.banner.location_permission"),
        tone: "danger",
        action: { label: t("common.settings"), kind: "open-app-settings" },
      };

    // Android 11 and below. The permission is granted and the radio is on; the
    // OS-wide location toggle is off, and Android withholds scan results
    // without it. Nothing about the app looks wrong, which is why this has to
    // be said out loud.
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
  const banners: MeshBanner[] = [];

  // A panic wipe that did not commit, and the one banner that outranks even
  // Away - because it is not about the mesh at all.
  //
  // The wipe already raises an alert when the keychain refuses something, but an
  // alert is dismissed once and then gone, leaving an app that looks like a
  // fresh install over data that is still on the device. Under duress "did it
  // work?" must not be a guess, and the natural response to a guess is doing it
  // again. So the claim stands on screen until it stops being true.
  //
  // Nothing to tap: the retry is automatic on the next launch (see
  // sweepOrphanedSecrets), which is also what makes this self-clearing rather
  // than a flag somebody has to remember to lower.
  if (inputs.wipeIncomplete === true) {
    banners.push({
      key: "wipe-incomplete",
      label: t("mesh.banner.wipe_incomplete"),
      tone: "danger",
    });
  }

  if (inputs.presenceStatus === "away") {
    banners.push({
      key: "paused",
      label: t("mesh.banner.paused"),
      tone: "neutral",
      action: { label: t("mesh.banner.action.resume"), kind: "resume" },
    });
    return banners;
  }

  // The one thing standing between the user and a working mesh, said plainly,
  // with the button that fixes it. Exactly one of these can apply, because
  // bleBlocker is one value.
  const blocked = bleBlockerBanner(inputs.bleBlocker);
  if (blocked !== null) banners.push(blocked);

  // A wrong clock is a hard blocker, so it ranks with them rather than with the
  // informational notes below. A drifted phone is refused by every peer and
  // refuses every peer, a silent outage that looks like an empty room, and none
  // of the notes below can be trusted while it holds. No action button: nothing
  // in the app can set the system clock, so it says what to do instead.
  if (inputs.clockSkewed === true) {
    banners.push({
      key: "clock-skew",
      label: t("mesh.banner.clock_skew"),
      tone: "caution",
    });
  }

  // Aggressive OEM background management is the last remaining way the mesh can
  // stop relaying without anything announcing it: the foreground service is
  // reaped, no callback fires, and the app only finds out because it comes back
  // to a stopped mesh. It ranks above the location note because it affects the
  // mesh itself rather than one feature that rides on it.
  // A permanent property of the hardware, not a fault and not actionable: some
  // chipsets at the API 26 floor ship no BLE peripheral role, so the phone can
  // see everyone and nobody can see it. Said once, then dismissible, because it
  // will be true for as long as the user owns the phone and there is no button
  // that changes it. Ranked below the hard blockers: the mesh IS working.
  if (inputs.advertisingUnsupported === true) {
    banners.push({
      key: "ble-advertising-unsupported",
      label: t("mesh.banner.advertising_unsupported"),
      tone: "caution",
      dismissible: true,
    });
  }

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

  // The WiFi Aware fast path exists on this device but is not usable right now,
  // which in practice means WiFi is switched off. Placed above the internet
  // block rather than inside it, and deliberately: Aware is a direct
  // phone-to-phone radio, so it is just as relevant in pure-Bluetooth mode.
  //
  // Neutral, and with no button, because nothing is broken. Every message, photo
  // and file still goes over BLE; what is lost is speed, and a video that takes
  // minutes instead of seconds is otherwise an unexplained slowness the user
  // would reasonably read as the app being bad at its job.
  //
  // Only "unavailable" says anything. "unsupported" is hardware that never had
  // the fast path; "permission" is near-unreachable, since the permission shares
  // an OS group with the Bluetooth ones and is granted by the same dialog; and
  // "unpaired" is the resting state of any iPhone whose owner has not paired
  // anyone, so a banner would be nagging someone about a feature they never
  // asked for. The Network screen carries that one, beside the control that
  // answers it. None of the three is a note the user can act on here.
  if (inputs.wifiFastPath === "unavailable") {
    banners.push({
      key: "wifi-fast-path",
      label: t("mesh.banner.wifi_off"),
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
  } else if (inputs.torBootstrap === "starting") {
    // Not the purple claim: a circuit still forming is not onion routing yet,
    // and saying so would be the overstatement the whole Tor path avoids.
    banners.push({
      key: "tor-starting",
      label: t("mesh.banner.tor_starting"),
      tone: "caution",
    });
  } else if (inputs.torBootstrap === "blocked") {
    // The terminal state on a network that filters Tor. Naming the mesh keeps
    // it from reading as "the app is broken": everything local still works, and
    // only the internet half is paused.
    banners.push({
      key: "tor-blocked",
      label: t("mesh.banner.tor_blocked"),
      tone: "caution",
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
  const torBootstrap = useMeshStateStore((s) => s.torBootstrap);
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
  const advertisingUnsupported = useMeshStateStore(
    (s) => s.bleAdvertisingUnsupported,
  );
  const powerSaving = useMeshStateStore((s) => s.powerSaving);
  const clockSkewed = useMeshStateStore((s) => s.clockSkewed);
  const wifiFastPath = useMeshStateStore((s) => s.wifiFastPath);
  const wipeIncomplete = useMeshStateStore((s) => s.wipeIncomplete);
  const backgroundLimitsBrand =
    !backgroundLimitsAcknowledged && needsBatteryOptimizationPrompt()
      ? getDeviceBrand()
      : undefined;
  return computeMeshBanners({
    presenceStatus,
    bleBlocker,
    locationGranted,
    advertisingUnsupported,
    backgroundLimitsBrand,
    powerSaving,
    clockSkewed,
    wifiFastPath,
    wipeIncomplete,
    nostrConnected,
    torActive,
    torBootstrap,
    gatewayEnabled,
    bridgeActive,
    bridgePeopleAcross,
    internetEnabled,
    peerCount,
  });
}
