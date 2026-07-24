// NativeAirhopTor.ts
//
// TurboModule spec for the Arti-based Tor native module (iOS only).
// Source: ios/Airhop/AirhopTorModule.swift + AirhopTorModule.mm
// Binary: ios/Frameworks/arti.xcframework (bundled)
//
// On Android, Tor traffic is routed via Orbot's system-level VPN rather than an
// embedded Arti instance. Whether Tor can actually route is detected by
// AirhopBLEModule.getTorAvailability() (Orbot installed + a VPN transport up).
// This module is iOS-only.

import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

// ---- Types ------------------------------------------------------------------

export interface TorStatus {
  /** True when Arti is bootstrapped and the SOCKS5 port is reachable. */
  isReady: boolean;
  /** True while Arti is still bootstrapping (not yet fully connected). */
  isStarting: boolean;
  /** SOCKS5 port number when ready (39050), 0 when not ready. */
  port: number;
  /** Bootstrap progress 0-100. */
  progress: number;
  /** Human-readable bootstrap stage summary from Arti. */
  bootstrapSummary: string;
}

// ---- Module spec ------------------------------------------------------------

export interface Spec extends TurboModule {
  /**
   * Enable and start the Arti Tor client. Resolves when startup has been
   * initiated. Use `awaitTorReady()` to wait for the SOCKS5 port to be ready.
   */
  startTor(): Promise<void>;

  /** Fully shut down Arti. Resolves when shutdown has been requested. */
  stopTor(): Promise<void>;

  /** Return the current Tor status snapshot. */
  getTorStatus(): Promise<TorStatus>;

  /**
   * Wait up to `timeoutSeconds` for Arti to be bootstrapped and SOCKS-ready.
   * Resolves `true` when ready, `false` on timeout.
   */
  awaitTorReady(timeoutSeconds: number): Promise<boolean>;

  /** (RCTEventEmitter) Subscribe to TorStatusChanged events. */
  addListener(eventName: string): void;

  /** (RCTEventEmitter) Unsubscribe from TorStatusChanged events. */
  removeListeners(count: number): void;
}

// ---- Events -----------------------------------------------------------------

/** Payload of the `TorStatusChanged` native event. */
export type TorStatusChangedEvent = TorStatus;

// ---- Registry ---------------------------------------------------------------

// Returns null on Android (Arti is iOS-only; use
// NativeAirhopBLE.getTorAvailability() to detect Orbot on Android instead).
export default TurboModuleRegistry.get<Spec>("AirhopTorModule");
