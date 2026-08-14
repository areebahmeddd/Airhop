// The native contract for the high-bandwidth WiFi transport.
//
// Hand-maintained, not Codegen input. See NativeAirhopBLE.ts for why.
//
// ANDROID ONLY, backed by AirhopWiFiModule.kt (WiFi Aware / NAN, API 26+).
// TurboModuleRegistry.get returns null on iOS, every call below is
// optional-chained, and services/wifi-controller.ts latches "unsupported" on its
// first pass.
//
// There is deliberately no iOS counterpart. MultipeerConnectivity was removed
// rather than repaired: bitchat/ios has never had a same-platform fast path, the
// protocol caps an attachment at 1 MiB (256 KiB for a sent photo) so the ceiling
// BLE has to clear is seconds rather than minutes, and the implementation had two
// independently fatal defects. Every device advertised the same MCPeerID, so the
// invite tie-break compared equal strings and no two iPhones paired; and the
// Bonjour declaration was missing its UDP service, so iOS 14's local-network gate
// refused browsing outright.
//
// Events emitted by native code:
//
//   AirhopWiFi.packetReceived      { linkID, dataBase64 }
//   AirhopWiFi.linkConnected       { linkID }
//   AirhopWiFi.linkDisconnected    { linkID }
//   AirhopWiFi.availabilityChanged { available }
//
// availabilityChanged carries both edges, from the framework's WiFi Aware state
// broadcast (the user toggling WiFi, the OS reclaiming the radio for tethering,
// battery saver), which is what lets wifi-controller.ts recover the fast path
// without a relaunch.
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  // Attach to WiFi Aware, then publish and subscribe.
  //
  // Rejects with a `code` the caller branches on, because the difference between
  // them is the difference between retrying and giving up:
  //
  //   WIFI_AWARE_UNSUPPORTED    no hardware, or an OS below the data-path floor.
  //                             Permanent, so never ask again.
  //   WIFI_AWARE_UNAVAILABLE    WiFi off, tethering, battery saver. Transient.
  //   PERMISSION_DENIED         NEARBY_WIFI_DEVICES or location missing.
  //   WIFI_AWARE_ATTACH_FAILED  anything else.
  startWiFi(): Promise<void>;

  // Stop discovery, close active links, release platform resources.
  stopWiFi(): Promise<void>;

  // Write base64-encoded bytes to an active link. Native frames the data with a
  // 4-byte big-endian length prefix.
  //
  // Rejects with UNKNOWN_LINK (the same code the BLE module uses for the same
  // condition), INVALID_DATA, FRAME_TOO_LARGE, WRITE_FAILED or LINK_CLOSED.
  // Nothing branches on which: every one means this packet did not go, and the
  // caller's response is the same.
  writeToWiFiLink(linkID: string, dataBase64: string): Promise<void>;

  // Required by the NativeEventEmitter contract.
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// `get`, not `getEnforcing`, deliberately: the Android package does not register
// this module below API 26, and a device without the fast path must still run the
// mesh. Callers optional-chain, and wifi-controller.ts reads a missing module as
// permanently unsupported.
export default TurboModuleRegistry.get<Spec>("AirhopWiFi");
