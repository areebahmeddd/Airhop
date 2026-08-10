// The native contract for the high-bandwidth WiFi transport. Hand-maintained,
// not Codegen input - see NativeAirhopBLE.ts for why nothing here is generated.
//
// ANDROID ONLY. Backed by AirhopWiFiModule.kt (WiFi Aware / NAN, API 26+).
// `TurboModuleRegistry.get` returns null on iOS, every call below is optional-
// chained, and services/wifi-controller latches "unsupported" on its first pass.
//
// There is deliberately no iOS counterpart. MultipeerConnectivity was removed
// rather than repaired: bitchat/ios has never had a same-platform fast path
// either, the protocol caps an attachment at 1 MiB (256 KiB for a sent photo)
// so the ceiling BLE has to clear is seconds rather than minutes, and the
// implementation carried two independently fatal defects - every device
// advertised the same MCPeerID, so the invite tie-break compared equal strings
// and no two iPhones ever paired, and the Bonjour declaration was missing its
// UDP service, so iOS 14's local-network gate refused browsing outright. It had
// never carried a byte, so removing it cost nothing and deleted a whole class
// of platform-shaped state in this layer.
//
// Events emitted by native code via NativeEventEmitter:
//
// 'AirhopWiFi.packetReceived'
//   { linkID: string, dataBase64: string }
//   A frame arrived from a connected peer.
//
// 'AirhopWiFi.linkConnected'
//   { linkID: string }
//   A peer-to-peer link was established.
//
// 'AirhopWiFi.linkDisconnected'
//   { linkID: string }
//   An established link was lost.
//
// 'AirhopWiFi.availabilityChanged'
//   { available: boolean }
//   The fast path became usable, or stopped being usable, and the reconciler in
//   services/wifi-controller recovers it without a relaunch.
//
//   Both edges are emitted, from the framework's WiFi Aware state broadcast:
//   the user toggling WiFi, the OS reclaiming the radio for tethering, battery
//   saver.
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  // Attach to WiFi Aware, then publish and subscribe.
  //
  // Rejects with a `code` the caller is expected to branch on, because the
  // difference between them is the difference between retrying and giving up:
  //   WIFI_AWARE_UNSUPPORTED   no hardware, or an OS below the data-path floor.
  //                            Permanent. Never ask again.
  //   WIFI_AWARE_UNAVAILABLE   WiFi off, tethering, battery saver. Transient.
  //   PERMISSION_DENIED        NEARBY_WIFI_DEVICES (or location) missing.
  //   WIFI_AWARE_ATTACH_FAILED anything else.
  startWiFi(): Promise<void>;

  // Stop all discovery, close all active links, and release platform resources.
  stopWiFi(): Promise<void>;

  // Write raw bytes (base64-encoded) to an active link identified by linkID.
  // The native layer frames the data with a 4-byte BE length prefix.
  //
  // Rejects with UNKNOWN_LINK (no such link, same code the BLE module uses for
  // the same condition), INVALID_DATA (undecodable base64), FRAME_TOO_LARGE
  // (past the frame ceiling), WRITE_FAILED (the socket refused) or LINK_CLOSED
  // (it went away mid-write). Nothing branches on which: every one of them means
  // this packet did not go, and the caller's answer is the same.
  writeToWiFiLink(linkID: string, dataBase64: string): Promise<void>;

  // Required by React Native NativeEventEmitter contract.
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// 'AirhopWiFi' is the only registered name, from AirhopWiFiModule.kt's
// getName(). There is no iOS module to reconcile it with any more.
//
// `get`, not `getEnforcing`, and deliberately: the Android package does not
// register this module below API 26, and every device without the fast path
// must still run the mesh. Callers optional-chain, and wifi-controller.ts reads
// a missing module as permanently unsupported.
export default TurboModuleRegistry.get<Spec>("AirhopWiFi");
