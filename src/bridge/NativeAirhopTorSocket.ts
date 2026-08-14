// The native contract for a WebSocket tunnelled over Arti's SOCKS5 proxy, so
// Nostr relay traffic can go through Tor. React Native's own WebSocket cannot
// speak SOCKS5, which is why this exists.
//
// iOS ONLY, backed by ios/Airhop/AirhopTorSocket.swift and driven by
// core/nostr/tor-websocket.ts. A classic RCTEventEmitter rather than a Codegen
// TurboModule, so it is reached through NativeModules and its events through
// NativeEventEmitter, mirroring NativeAirhopTor.
//
// Absent on Android, where Orbot's VPN routes transparently, and absent in any
// build where the native file was not compiled in. Callers must gate on
// isTorSocketNativeAvailable().
import type { EventSubscription } from "react-native";
import { NativeEventEmitter, NativeModules } from "react-native";

interface AirhopTorSocketModule {
  // Open a socket to `url` over Tor, identified by `id`. Lifecycle arrives
  // asynchronously as TorSocketEvent; this call returns void.
  connect(id: string, url: string): void;
  send(id: string, data: string): void;
  close(id: string, code: number, reason: string): void;
}

const nativeModule = NativeModules.AirhopTorSocket as
  AirhopTorSocketModule | undefined;

export interface TorSocketEvent {
  // Connection id, assigned on the JS side by TorWebSocket.
  id: string;
  type: "open" | "message" | "close" | "error";
  // On "message": the frame payload, JSON text or base64 when binary.
  data?: string;
  binary?: boolean;
  // On "close".
  code?: number;
  reason?: string;
  // On "error".
  message?: string;
}

// Whether the native module is compiled in and callable. False on Android and on
// any build without the native file. Callers check this before installing the Tor
// WebSocket implementation, so a missing module cannot break Nostr: it stays on
// the direct socket.
export function isTorSocketNativeAvailable(): boolean {
  return nativeModule != null && typeof nativeModule.connect === "function";
}

export const AirhopTorSocketNative = nativeModule;

let emitter: NativeEventEmitter | null = null;

// Only call when isTorSocketNativeAvailable() is true; the emitter needs the
// native module.
export function subscribeTorSocket(
  listener: (event: TorSocketEvent) => void,
): EventSubscription {
  if (emitter === null) {
    emitter = new NativeEventEmitter(
      NativeModules.AirhopTorSocket as unknown as ConstructorParameters<
        typeof NativeEventEmitter
      >[0],
    );
  }
  return emitter.addListener("TorSocketEvent", listener);
}
