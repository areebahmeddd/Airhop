// The native contract for the BLE mesh radios. Hand-maintained, NOT Codegen
// input: there is no `codegenConfig` in package.json, so nothing is generated
// from this file. Both native modules are legacy bridge modules
// (RCT_EXTERN_REMAP_MODULE on iOS, ReactContextBaseJavaModule on Android),
// resolved through the New Architecture's interop layer - which is what
// TurboModuleRegistry hands back below.
//
// The spec shape is kept deliberately: it is what a Codegen migration would
// start from, and it is what keeps the two platforms honest about exposing the
// same surface.
//
// Do not add protocol logic here - only the raw I/O contract with native.
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  // Peripheral (GATT Server - makes this device visible to scanners).
  //
  // REJECTS rather than resolving when the radio cannot actually start, with
  // code RADIO_OFF / PERMISSION_DENIED / UNSUPPORTED. Both platforms used to
  // accept these calls and silently do nothing when the adapter was off or a
  // permission had not settled, which is how a fresh install ended up with two
  // dead radios behind a UI that believed they were running.
  //
  // Two platform differences the caller should know about, both deliberate:
  //
  //   UNSUPPORTED is narrower on Android than on iOS. Android means "this chip
  //   has no peripheral role", which still leaves scanning working. iOS means
  //   "this device has no Bluetooth at all". The radio controller latches it as
  //   "never ask to advertise again", which is right for Android and merely
  //   redundant on iOS, where getRadioState().supported is already false and
  //   produces the stronger blocker first.
  //
  //   iOS remembers the request when the radio is mid-reset. Asked while
  //   CoreBluetooth reports .resetting or .unknown, iOS records the intent AND
  //   rejects, then starts by itself once the adapter settles. Android just
  //   rejects. So on iOS the controller can briefly believe advertising is off
  //   while it is actually on; the next reconcile calls start again, succeeds,
  //   and the two agree. Kept because it recovers without waiting for a retry
  //   tick.
  startAdvertising(serviceUUID: string, localName: string): Promise<void>;
  stopAdvertising(): Promise<void>;

  // Central (GATT Client - scans for other devices). Same rejection contract.
  startScanning(serviceUUIDs: string[]): Promise<void>;
  stopScanning(): Promise<void>;

  // Write raw bytes to a connected peer (base64-encoded for bridge safety)
  writeToLink(linkID: string, dataBase64: string): Promise<void>;

  // Everything the device will tell us about whether BLE can run right now.
  //
  // Needed at startup because adapterStateChanged only fires on a CHANGE, and
  // needed as a whole because the facts are not independent: on Android 11 and
  // below "permission granted" does not imply "scan will return results", since
  // the OS-wide location toggle gates it separately. Answered honestly before
  // any manager exists - the previous iOS implementation read a manager that
  // startScanning had not constructed yet, so a healthy iPhone reported
  // Bluetooth off on every cold launch.
  getRadioState(): Promise<{
    supported: boolean;
    poweredOn: boolean;
    // "unknown" means the platform has not said yet. It is not a denial.
    // Android answers for whatever the mesh needs at this API level: the three
    // Bluetooth runtime permissions from API 31, ACCESS_FINE_LOCATION below it.
    authorization: "granted" | "denied" | "blocked" | "unknown";
    // Android: whether a BLE scan on this device counts as a location access,
    // and therefore whether the toggle below is load-bearing. True only below
    // API 31, where usesPermissionFlags="neverForLocation" does not exist.
    // Always false on iOS, which has no such coupling.
    locationRequiredForScan: boolean;
    // Android: the OS location toggle, reported literally. Only decides
    // anything while locationRequiredForScan is true. Always true on iOS.
    locationServicesEnabled: boolean;
    // 0-100, or -1 when the platform has not reported yet. Feeds the power
    // policy (services/power-policy.ts), which decides how hard to scan.
    // -1 on iOS: CoreBluetooth exposes no scan-rate control, so there is
    // nothing a battery reading could be used for there.
    batteryPercent: number;
    charging: boolean;
  }>;

  // How hard to run the radios: "performance" | "balanced" | "power-saver" |
  // "ultra-low-power".
  //
  // Android applies scan mode, advertise mode, TX power, RSSI poll interval and
  // scan duty cycle together, because they are one decision - a duty-cycled
  // LOW_POWER scan alongside a LOW_LATENCY advertise would save nothing. iOS is
  // a no-op: CoreBluetooth has no equivalent knob, and it already throttles
  // background BLE on the app's behalf. Declared for both so the shared
  // reconciler has one code path.
  //
  // Applying a mode restarts the scan, so the caller is expected to send this
  // only on an actual change (see PowerPolicy).
  setPowerMode(mode: string): Promise<void>;

  // Ask the OS to turn Bluetooth on, so the Mesh banner can offer a one-tap fix
  // instead of describing where to go. Android shows the system enable dialog
  // and resolves with the result. iOS has no such API and resolves false; the
  // caller falls back to opening Settings.
  requestEnableBluetooth(): Promise<boolean>;

  // Open the OS location-services settings (Android). Resolves false on iOS.
  openLocationSettings(): Promise<boolean>;

  // Hold the process up so BLE and the relay socket survive backgrounding.
  //
  // Deliberately NOT tied to advertising. It used to be started and stopped
  // inside startAdvertising/stopAdvertising, so choosing "Invisible" - which
  // only stops advertising and keeps scanning and relaying - silently ended
  // background operation. Android runs a foreground service; iOS is a no-op
  // (background BLE is granted by UIBackgroundModes, not by us).
  setBackgroundServiceEnabled(enabled: boolean): Promise<void>;

  // Tor proxy: probe localhost for an active SOCKS5 proxy. ANDROID ONLY in
  // practice - it looks for Orbot and returns 9050 if reachable, 0 if not.
  //
  // iOS always resolves 0, and that is the honest answer rather than a stub:
  // Orbot does not exist there, and Airhop's own Tor is in-app Arti on a
  // different port, which NativeAirhopTor.getTorStatus() reports properly. This
  // used to claim it covered "Orbot/Arti on iOS" while probing Orbot's port, so
  // it could only ever have timed out and said no.
  getTorProxyPort(): Promise<number>;

  // Whether Tor routing can actually work right now. Android checks the Orbot
  // package is installed and a VPN transport is up; the Tor toggle requires both
  // before turning on, so it never reports "on" while nothing is routing. iOS
  // uses in-app Arti and resolves both false (it never consults this).
  getTorAvailability(): Promise<{
    orbotInstalled: boolean;
    vpnActive: boolean;
  }>;

  // Required by React Native NativeEventEmitter contract
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// Events emitted by native code to TypeScript via NativeEventEmitter:
//
// 'AirhopBLE.packetReceived'
//   { linkID: string, dataBase64: string }
//   Fired when a connected peer writes bytes to our characteristic.
//
// 'AirhopBLE.linkConnected'
//   { linkID: string, role: 'central' | 'peripheral', rssi: number }
//   Fired when a BLE link is established (either direction).
//
// 'AirhopBLE.linkDisconnected'
//   { linkID: string }
//   Fired when a BLE link drops.
//
// 'AirhopBLE.rssiUpdated'
//   { linkID: string, rssi: number }
//   Periodic RSSI readings from connected peers.
//
// 'AirhopBLE.adapterStateChanged'
//   { enabled: boolean }
//   The OS Bluetooth radio was switched on or off. Emitted on a real CHANGE
//   only: iOS previously emitted it from every CBManager state callback, which
//   the mesh read as a radio change, which restarted the radios, which
//   constructed a new CBManager, which fired another state callback - fourteen
//   central and fourteen peripheral managers in ten seconds on an idle phone.
//
// 'AirhopBLE.scanFailed'
//   { errorCode: number }
//   Android only. ScanCallback.onScanFailed, i.e. the platform refused a scan
//   AFTER startScan() returned cleanly. It is the one radio failure the
//   reconciler cannot observe on its own - it already believes it is scanning -
//   so without this event `actual.scanning` stays true forever and nothing
//   retries. errorCode 6 is SCAN_FAILED_SCANNING_TOO_FREQUENTLY, which needs a
//   longer stand-down than the usual backoff ladder.
//
// 'AirhopBLE.powerStateChanged'
//   { batteryPercent: number, charging: boolean }
//   Android only. Emitted when the battery moves enough to possibly matter (a
//   few percent) or the charger is plugged/unplugged - NOT on every 1% step,
//   which ACTION_BATTERY_CHANGED delivers and which would be pure noise. Native
//   applies no policy to it; it only decides when the number is worth
//   reporting.
//
// 'AirhopBLE.meshStopRequested'
//   {}
//   Android only. The user tapped "Stop mesh" on the foreground-service
//   notification. Native raises it rather than stopping the radios itself, so
//   the decision goes through the same presence path as the in-app control and
//   the two can never disagree about what the mesh is doing.

export default TurboModuleRegistry.getEnforcing<Spec>("AirhopBLE");
