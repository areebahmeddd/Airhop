// The native contract for the BLE mesh radios.
//
// Hand-maintained, NOT Codegen input: package.json declares no `codegenConfig`.
// The modules behind it are legacy bridge modules (RCT_EXTERN_REMAP_MODULE on
// iOS, ReactContextBaseJavaModule on Android) resolved through the New
// Architecture interop layer, which is what TurboModuleRegistry returns below.
// The spec shape is kept so a Codegen migration has a starting point and both
// platforms stay honest about exposing the same surface.
//
// Raw I/O only. Protocol logic belongs in core/.
import type { EventSubscription, TurboModule } from "react-native";
import {
  NativeEventEmitter,
  NativeModules,
  TurboModuleRegistry,
} from "react-native";

export interface Spec extends TurboModule {
  // Peripheral role: make this device visible to scanners.
  //
  // Rejects rather than resolving when the radio cannot start (RADIO_OFF,
  // PERMISSION_DENIED, UNSUPPORTED). Accepting the call and doing nothing leaves
  // dead radios behind a UI that believes they are running.
  //
  // UNSUPPORTED is narrower on Android, meaning "no peripheral role" while
  // scanning still works, than on iOS, where it means no Bluetooth at all. The
  // radio controller latches it as never-advertise-again: correct for Android,
  // redundant on iOS where `supported` is already false.
  //
  // Asked mid-reset (CoreBluetooth `.resetting` or `.unknown`), iOS records the
  // intent, rejects, then starts once the adapter settles; Android only rejects.
  // So the controller can briefly believe advertising is off while it is on, and
  // the next reconcile corrects it. Kept because it recovers without a retry tick.
  startAdvertising(serviceUUID: string, localName: string): Promise<void>;
  stopAdvertising(): Promise<void>;

  // Central role: scan for other devices. Same rejection contract.
  startScanning(serviceUUIDs: string[]): Promise<void>;
  stopScanning(): Promise<void>;

  // Write raw bytes to a connected peer, base64-encoded for bridge safety.
  writeToLink(linkID: string, dataBase64: string): Promise<void>;

  // Everything the device will report about whether BLE can run right now.
  //
  // Needed at startup, since adapterStateChanged only fires on a change, and
  // needed as one answer, since the facts are not independent: on Android 11 and
  // below a granted permission does not imply a scan returns results, because the
  // OS location toggle gates them separately. Must answer before any native
  // manager exists, or a healthy phone reports Bluetooth off on every cold launch.
  getRadioState(): Promise<{
    supported: boolean;
    poweredOn: boolean;
    // "unknown" means the platform has not answered yet, not that it refused.
    // Android reports what the mesh needs at this API level: the three Bluetooth
    // runtime permissions from API 31, ACCESS_FINE_LOCATION below it.
    authorization: "granted" | "denied" | "blocked" | "unknown";
    // Android: whether a scan counts as a location access here, and so whether
    // the toggle below is load-bearing. True only below API 31, where
    // `neverForLocation` does not exist. Always false on iOS.
    locationRequiredForScan: boolean;
    // Android: the OS location toggle, reported literally. Only matters while
    // locationRequiredForScan is true. Always true on iOS.
    locationServicesEnabled: boolean;
    // 0 to 100, or -1 when unreported. Feeds services/power-policy.ts. Always -1
    // on iOS, which exposes no scan-rate control for it to inform.
    batteryPercent: number;
    charging: boolean;
  }>;

  // How hard to run the radios: "performance", "balanced", "power-saver" or
  // "ultra-low-power".
  //
  // Android applies scan mode, advertise mode, TX power, RSSI poll interval and
  // duty cycle together, because they are one decision: a duty-cycled LOW_POWER
  // scan beside a LOW_LATENCY advertise saves nothing. iOS is a no-op, having no
  // equivalent knob and already throttling background BLE. Declared on both so
  // the reconciler has one code path.
  //
  // Applying a mode restarts the scan, so callers send it only on a real change.
  setPowerMode(mode: string): Promise<void>;

  // Ask the OS to enable Bluetooth, so the Mesh banner can offer a one-tap fix
  // rather than describing where to go. Android shows the system dialog; iOS has
  // no such API and resolves false, leaving the caller to open Settings.
  requestEnableBluetooth(): Promise<boolean>;

  // Open OS location settings (Android). Resolves false on iOS.
  openLocationSettings(): Promise<boolean>;

  // Hold the process up so BLE and the relay socket survive backgrounding.
  //
  // Deliberately not tied to advertising: driving it from startAdvertising would
  // break "Invisible", which stops advertising while still scanning and relaying.
  // Android runs a foreground service; iOS is a no-op, since background BLE comes
  // from UIBackgroundModes.
  setBackgroundServiceEnabled(enabled: boolean): Promise<void>;

  // Probe localhost for a SOCKS5 proxy, returning its port or 0. Android only in
  // practice: it looks for Orbot and returns 9050 when reachable. iOS resolves 0
  // honestly rather than as a stub, since Orbot does not exist there and Airhop's
  // own Tor is in-app Arti on another port, reported by NativeAirhopTor.
  getTorProxyPort(): Promise<number>;

  // Whether Tor routing can work right now. Android checks that Orbot is
  // installed and a VPN transport is up, and the Tor toggle requires both, so it
  // never reports on while nothing is routing. iOS resolves both false and never
  // consults this.
  getTorAvailability(): Promise<{
    orbotInstalled: boolean;
    vpnActive: boolean;
  }>;

  // Watch the VPN transport while Tor is on: 'onVpnLost' when it goes,
  // 'onVpnAvailable' when one comes up. getTorAvailability only answers when
  // asked, and app foreground is the only other caller, so these are what keep
  // a Tor claim off clear-net traffic and what report Orbot coming back.
  //
  // Bound to the Tor PREFERENCE, not the claim: the window in which a VPN moving
  // matters spans the blocked state, where the claim is already false. Binding
  // to the claim tears the watch down at the drop it exists to recover from.
  //
  // Android only. iOS resolves immediately and emits nothing, since Arti is
  // in-process and reports its own state.
  startVpnWatch(): Promise<void>;
  stopVpnWatch(): Promise<void>;

  // Required by the NativeEventEmitter contract.
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// Events emitted by native code:
//
//   AirhopBLE.packetReceived    { linkID, dataBase64 }
//   AirhopBLE.linkConnected     { linkID, role: 'central' | 'peripheral', rssi }
//   AirhopBLE.linkDisconnected  { linkID }
//   AirhopBLE.rssiUpdated       { linkID, rssi }
//   AirhopBLE.adapterStateChanged { enabled }
//   AirhopBLE.scanFailed        { errorCode }         Android
//   AirhopBLE.powerStateChanged { batteryPercent, charging }  Android
//   AirhopBLE.meshStopRequested {}                    Android
//   onVpnLost                   {}                    Android
//   onVpnAvailable              {}                    Android
//
// Four of them carry a constraint worth stating:
//
// adapterStateChanged fires on a real change only. Emitting it from every
// CBManager state callback reads as a radio change, which restarts the radios,
// which builds a new manager, which fires another callback.
//
// scanFailed is Android's ScanCallback.onScanFailed: the platform refusing a scan
// after startScan() returned cleanly. It is the one radio failure the reconciler
// cannot observe for itself, since it already believes it is scanning, so without
// the event `actual.scanning` stays true forever and nothing retries. errorCode 6
// is SCAN_FAILED_SCANNING_TOO_FREQUENTLY and needs a longer stand-down than the
// usual backoff ladder.
//
// powerStateChanged is coalesced to meaningful battery movement and charger
// changes, not the per-1% stream ACTION_BATTERY_CHANGED delivers. Native applies
// no policy, only deciding when the number is worth reporting.
//
// meshStopRequested is the "Stop mesh" button on the foreground-service
// notification. Native raises it rather than stopping the radios itself, so the
// decision goes through the same presence path as the in-app control and the two
// cannot disagree.

let emitter: NativeEventEmitter | null = null;

// Returns null on iOS and wherever the module is absent, so callers need no
// platform branch.
function subscribeVpnEdge(
  event: "onVpnLost" | "onVpnAvailable",
  listener: () => void,
): EventSubscription | null {
  const native = NativeModules.AirhopBLE as
    ConstructorParameters<typeof NativeEventEmitter>[0] | undefined;
  if (native == null) return null;
  emitter ??= new NativeEventEmitter(native);
  return emitter.addListener(event, listener);
}

// The VPN carrying Tor went away. The safety edge.
export function subscribeVpnLost(
  listener: () => void,
): EventSubscription | null {
  return subscribeVpnEdge("onVpnLost", listener);
}

// A VPN transport came up. The recovery edge, and evidence of nothing on its
// own: any VPN raises it, so the listener re-probes rather than concluding
// Orbot is back. A native binary that never emits it degrades to the foreground
// re-check.
export function subscribeVpnAvailable(
  listener: () => void,
): EventSubscription | null {
  return subscribeVpnEdge("onVpnAvailable", listener);
}

export default TurboModuleRegistry.getEnforcing<Spec>("AirhopBLE");
