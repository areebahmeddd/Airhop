// The native contract for the Arti-based Tor client.
//
// Hand-maintained, not Codegen input. See NativeAirhopBLE.ts for why.
//
// iOS ONLY, backed by ios/Airhop/AirhopTorModule.swift and the bundled
// ios/Frameworks/arti.xcframework. Android routes Tor traffic through Orbot's
// system-level VPN instead, and reports whether it can through
// NativeAirhopBLE.getTorAvailability().
import type { EventSubscription, TurboModule } from "react-native";
import {
  NativeEventEmitter,
  NativeModules,
  TurboModuleRegistry,
} from "react-native";

export interface TorStatus {
  // True once Arti is bootstrapped and its SOCKS5 port is reachable.
  isReady: boolean;
  isStarting: boolean;
  // The SOCKS5 port (39050) when ready, 0 otherwise.
  port: number;
  // Bootstrap progress, 0 to 100.
  progress: number;
  // Arti's own summary of the current bootstrap stage.
  bootstrapSummary: string;
}

export interface Spec extends TurboModule {
  // Resolves once startup has been initiated, not once Tor is usable. Use
  // awaitTorReady for that.
  startTor(): Promise<void>;
  stopTor(): Promise<void>;

  // Stop Arti and delete everything it has written to disk. Panic wipe only.
  //
  // Arti's data directory sits under Application Support rather than the cache,
  // so the wipe's cache sweep does not reach it. It holds a cached consensus,
  // chosen guard nodes and directory state, which together are evidence on disk
  // that this device used Tor and roughly when.
  wipeTorState(): Promise<void>;

  getTorStatus(): Promise<TorStatus>;

  // Resolves true once bootstrapped and SOCKS-ready, false on timeout.
  awaitTorReady(timeoutSeconds: number): Promise<boolean>;

  // Required by the RCTEventEmitter contract.
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// Payload of the native TorStatusChanged event.
export type TorStatusChangedEvent = TorStatus;

let emitter: NativeEventEmitter | null = null;

// Subscribe to Arti's bootstrap status. Returns null wherever the module is
// absent, which is every Android build and any iOS build without Arti. Without a
// subscriber, a stalled bootstrap is never reported.
export function subscribeTorStatus(
  listener: (status: TorStatusChangedEvent) => void,
): EventSubscription | null {
  const native = NativeModules.AirhopTorModule as
    ConstructorParameters<typeof NativeEventEmitter>[0] | undefined;
  if (native == null) return null;
  emitter ??= new NativeEventEmitter(native);
  return emitter.addListener("TorStatusChanged", listener);
}

// Returns null on Android, where Orbot is detected through
// NativeAirhopBLE.getTorAvailability() instead.
export default TurboModuleRegistry.get<Spec>("AirhopTorModule");
