// The native contract for the high-bandwidth WiFi transport.
//
// Hand-maintained, not Codegen input. See NativeAirhopBLE.ts for why.
//
// Backed by AirhopWiFiModule.kt (NAN, API 26+) and AirhopWiFiModule.swift
// (WiFiAware, iOS 26+). One contract, two implementations of the same radio
// protocol, and the mesh engine does not know which it has.
//
// Still not a cross-platform path: Apple requires a paired data path and refuses
// an open one, and Android cannot complete Apple's pairing. Android to Android,
// or iPhone to iPhone.
//
// Callers optional-chain, and wifi-controller.ts reads a missing module as
// permanently unsupported.
//
// Events emitted by native code:
//
//   AirhopWiFi.packetReceived      { linkID, dataBase64 }
//   AirhopWiFi.linkConnected       { linkID }
//   AirhopWiFi.linkDisconnected    { linkID }
//   AirhopWiFi.availabilityChanged { available }
//
// availabilityChanged tells the reconciler to forget it is started. Android
// carries both edges off the framework's state broadcast, so it recovers without
// a relaunch. iOS has no such broadcast and reports only the falling edge, which
// is why the controller answers a drop with a retry ladder.
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  // Attach, then publish and subscribe. Rejects with a `code` the caller
  // branches on, since they separate retrying from giving up:
  //
  //   WIFI_AWARE_UNSUPPORTED    no hardware, or an OS below the floor. Permanent.
  //   WIFI_AWARE_UNAVAILABLE    WiFi off, tethering, battery saver. Android only.
  //   WIFI_AWARE_UNPAIRED       iOS only, nobody to reach. Not retried: only a
  //                             pairing changes it, and the pairing module says so.
  //   PERMISSION_DENIED         Android only. iOS gates on an entitlement, a fact
  //                             about the build, so it arrives as UNSUPPORTED.
  //   WIFI_AWARE_ATTACH_FAILED  anything else.
  startWiFi(): Promise<void>;

  // Stop discovery, close active links, release platform resources.
  stopWiFi(): Promise<void>;

  // Base64 bytes to an active link; native frames them with a 4-byte big-endian
  // length prefix. Rejects with UNKNOWN_LINK (as the BLE module does for the same
  // condition), INVALID_DATA, FRAME_TOO_LARGE, WRITE_FAILED or LINK_CLOSED.
  // Nothing branches on which: every one means the packet did not go.
  writeToWiFiLink(linkID: string, dataBase64: string): Promise<void>;

  // Required by the NativeEventEmitter contract.
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// `get`, not `getEnforcing`: the Android package does not register below API 26,
// and a device without the fast path must still run the mesh. iOS always
// registers and refuses inside `startWiFi`, its floor being a runtime check.
export default TurboModuleRegistry.get<Spec>("AirhopWiFi");
