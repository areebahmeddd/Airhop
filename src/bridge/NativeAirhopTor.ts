// The native contract for the Arti-based Tor client.
//
// Hand-maintained, not Codegen input. See NativeAirhopBLE.ts for why.
//
// Both platforms, backed by one Rust crate in native/arti: iOS links it as a
// static library behind ios/Airhop/AirhopTorModule.swift, Android loads it as a
// shared object behind AirhopTorModule.kt. The two modules expose this identical
// surface, so nothing above here branches on platform for Tor's lifecycle.
//
// One difference survives, and it is about coverage rather than lifecycle. On
// Android the proxy is installed into React Native's shared OkHttp client, so
// every socket the app opens is covered, `fetch` included. On iOS only the Nostr
// WebSocket goes through Tor, which is why a mint request there has to be
// refused rather than routed. See services/tor-routing.ts.
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
  //
  // `bridgeLines` is a newline-separated list in standard Tor format; empty is a
  // direct connection to a public relay. Passed per start rather than set
  // separately, so a client cannot come up without stating which it is. Native
  // starts the transports the lines name before Arti, and rejects when they do
  // not come up rather than falling back to a direct route.
  startTor(bridgeLines: string): Promise<void>;
  stopTor(): Promise<void>;

  // Stop Arti and delete everything it has written to disk. Panic wipe only.
  //
  // Arti's data directory sits outside the media cache on both platforms
  // (Application Support on iOS, the app's files directory on Android), so the
  // wipe's cache sweep does not reach it. It holds a cached consensus, chosen
  // guard nodes and directory state, which together are evidence on disk that
  // this device used Tor and roughly when.
  wipeTorState(): Promise<void>;

  // Tell Arti which side of the screen the app is on, so it can sleep.
  //
  // Not advisory, and it means the same thing on both platforms even though the
  // pressure differs. iOS suspends the process, so circuits do not survive a
  // long background spell either way; Android keeps it alive through the
  // foreground service, so without this a backgrounded Airhop keeps a consensus
  // fresh and guards warm all day on a battery.
  //
  // Dormancy rather than a stop, deliberately. Stopping would drop the guards,
  // cost the user a fresh bootstrap on every return to the app, and make the
  // device look like a brand new client to a guard each time.
  //
  // Safe to call whatever the Tor preference says: with nothing running it is a
  // no-op.
  setAppForeground(foreground: boolean): Promise<void>;

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
// absent, which is any build the native library was not packaged into. Without
// a subscriber, a stalled bootstrap is never reported.
export function subscribeTorStatus(
  listener: (status: TorStatusChangedEvent) => void,
): EventSubscription | null {
  const native = NativeModules.AirhopTorModule as
    ConstructorParameters<typeof NativeEventEmitter>[0] | undefined;
  if (native == null) return null;
  emitter ??= new NativeEventEmitter(native);
  return emitter.addListener("TorStatusChanged", listener);
}

// Optional rather than enforcing: an ABI the native library was not built for,
// or a build that omitted it, must degrade to "Tor unavailable" rather than
// taking the app down at import time. Callers null-check.
export default TurboModuleRegistry.get<Spec>("AirhopTorModule");
