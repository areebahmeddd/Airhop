// Codegen input: this file is the TurboModule spec that feeds React Native's
// code generation pipeline to auto-produce the native bridge headers.
// Do not add protocol logic here - only the raw I/O contract with native.
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  // Peripheral (GATT Server - makes this device visible to scanners)
  startAdvertising(serviceUUID: string, localName: string): Promise<void>;
  stopAdvertising(): Promise<void>;

  // Central (GATT Client - scans for other devices)
  startScanning(serviceUUIDs: string[]): Promise<void>;
  stopScanning(): Promise<void>;

  // Write raw bytes to a connected peer (base64-encoded for bridge safety)
  writeToLink(linkID: string, dataBase64: string): Promise<void>;

  // Tor proxy: probe localhost for an active SOCKS5 proxy (Orbot on Android,
  // Orbot/Arti on iOS). Returns the port (9050) if reachable, or 0 if not.
  getTorProxyPort(): Promise<number>;

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

export default TurboModuleRegistry.getEnforcing<Spec>("AirhopBLE");
