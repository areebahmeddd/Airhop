// Codegen input: TurboModule spec for the high-bandwidth WiFi transport.
//
// On Android: backed by AirhopWiFiModule.kt (WiFi Aware / NAN, API 26+).
// On iOS:     backed by AirhopMCModule.swift (MultipeerConnectivity).
//
// Both native modules expose the same method set and the same event names
// so this single spec covers both platforms.
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
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  // Start advertising and discovering peers. On Android: attach to WiFi Aware
  // and publish + subscribe. On iOS: start MCNearbyServiceAdvertiser + Browser.
  startWiFi(): Promise<void>;

  // Stop all discovery, close all active links, and release platform resources.
  stopWiFi(): Promise<void>;

  // Write raw bytes (base64-encoded) to an active link identified by linkID.
  // The native layer frames the data with a 4-byte BE length prefix.
  writeToWiFiLink(linkID: string, dataBase64: string): Promise<void>;

  // Required by React Native NativeEventEmitter contract.
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// Android module name: "AirhopWiFi"
// iOS module name:     "AirhopMCModule"
//
// The registry key 'AirhopWiFi' matches the Android module name. On iOS,
// the module is registered under 'AirhopMCModule'; feature code should use
// NativeModules.AirhopWiFi ?? NativeModules.AirhopMCModule for compatibility.
export default TurboModuleRegistry.get<Spec>("AirhopWiFi");
