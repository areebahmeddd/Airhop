// NativeAirhopTorSocket.ts
//
// Accessor for the AirhopTorSocket native module (iOS only): a WebSocket that
// tunnels over Arti's SOCKS5 proxy so Nostr relay traffic can go through Tor.
// React Native's built-in WebSocket cannot speak SOCKS5, which is why this
// exists. See ios/Airhop/AirhopTorSocket.swift and tor-websocket.ts.
//
// The module is a classic RCTEventEmitter (not a codegen TurboModule), so it is
// reached through NativeModules and its events through NativeEventEmitter,
// mirroring NativeAirhopTor. It is absent on Android (Orbot's VPN routes
// transparently there, so no per-socket shim is needed) and in any build where
// the native file has not been compiled in; callers must gate on
// isTorSocketNativeAvailable() before use.

import type { EmitterSubscription } from "react-native";
import { NativeEventEmitter, NativeModules } from "react-native";

// ---- Native module ----------------------------------------------------------

interface AirhopTorSocketModule {
  // Open a WebSocket to `url` over Tor, identified by `id`. Lifecycle is
  // reported asynchronously via TorSocketEvent; this call itself returns void.
  connect(id: string, url: string): void;
  // Send a text frame on the socket `id`.
  send(id: string, data: string): void;
  // Close the socket `id` with a WebSocket close code and reason.
  close(id: string, code: number, reason: string): void;
}

const nativeModule = NativeModules.AirhopTorSocket as
  AirhopTorSocketModule | undefined;

// ---- Events -----------------------------------------------------------------

export interface TorSocketEvent {
  // Connection id assigned by the JS side in TorWebSocket.
  id: string;
  type: "open" | "message" | "close" | "error";
  // Present on "message": the frame payload (JSON text, or base64 if binary).
  data?: string;
  // Present and true on a base64-encoded binary "message".
  binary?: boolean;
  // Present on "close": WebSocket close code and reason.
  code?: number;
  reason?: string;
  // Present on "error": a human-readable description.
  message?: string;
}

// ---- Public surface ---------------------------------------------------------

// Whether the native Tor socket module is compiled in and callable. False on
// Android and on any build without the native file. Callers must check this
// before installing the Tor WebSocket implementation, so a missing module can
// never break Nostr: it simply stays on the direct socket.
export function isTorSocketNativeAvailable(): boolean {
  return nativeModule != null && typeof nativeModule.connect === "function";
}

export const AirhopTorSocketNative = nativeModule;

let emitter: NativeEventEmitter | null = null;

// Subscribe to native socket lifecycle events. Only call when
// isTorSocketNativeAvailable() is true; the emitter needs the native module.
export function subscribeTorSocket(
  listener: (event: TorSocketEvent) => void,
): EmitterSubscription {
  if (emitter === null) {
    emitter = new NativeEventEmitter(
      NativeModules.AirhopTorSocket as unknown as ConstructorParameters<
        typeof NativeEventEmitter
      >[0],
    );
  }
  return emitter.addListener("TorSocketEvent", listener);
}
