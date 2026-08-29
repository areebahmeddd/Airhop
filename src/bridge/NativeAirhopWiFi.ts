// The native contract for the high-bandwidth WiFi transport.
//
// Hand-maintained, not Codegen input. See NativeAirhopBLE.ts for why.
//
// Backed by AirhopWiFiModule.kt (NAN, API 26+) and AirhopWiFiModule.swift
// (Apple's WiFiAware framework, iOS 26+). One contract, two implementations of
// the same radio protocol, and the mesh engine does not know which it has.
//
// Still not a cross-platform path: Apple requires a paired device for every data
// path and refuses an open one, and Android cannot complete Apple's pairing. So
// Android to Android, or iPhone to iPhone, and anything crossing platforms uses
// Bluetooth or Nostr.
//
// Callers optional-chain every method below, and services/wifi-controller.ts
// reads a missing module as permanently unsupported.
//
// Events emitted by native code:
//
//   AirhopWiFi.packetReceived      { linkID, dataBase64 }
//   AirhopWiFi.linkConnected       { linkID }
//   AirhopWiFi.linkDisconnected    { linkID }
//   AirhopWiFi.availabilityChanged { available }
//
// availabilityChanged is the transport telling the reconciler to forget it is
// started. Android carries both edges, off the framework's WiFi Aware state
// broadcast (the user toggling WiFi, the OS reclaiming the radio for tethering,
// battery saver), so the fast path recovers there without a relaunch. iOS has no
// such broadcast and reports only the falling edge, when the listener or browser
// fails, which is why wifi-controller.ts answers a drop with a retry ladder
// rather than by waiting to be told the radio came back.
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
  //                             Android only: iOS has no equivalent reading.
  //   WIFI_AWARE_UNPAIRED       iOS only. Nothing is paired, so there is nobody
  //                             this transport could reach. Not retried on a
  //                             ladder, because only a pairing changes the
  //                             answer and NativeAirhopWiFiPairing says when one
  //                             does.
  //   PERMISSION_DENIED         NEARBY_WIFI_DEVICES or location missing.
  //                             Android only: iOS gates this on an entitlement,
  //                             which is a fact about the build rather than a
  //                             grant the user can give, so it arrives as
  //                             UNSUPPORTED instead.
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

// `get`, not `getEnforcing`: the Android package does not register this module
// below API 26, and a device without the fast path must still run the mesh. iOS
// always registers and refuses inside `startWiFi` instead, since its floor is a
// runtime check rather than something a package can decline to register below.
export default TurboModuleRegistry.get<Spec>("AirhopWiFi");
