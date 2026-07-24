// tor-routing.ts
//
// Orchestrates routing Nostr traffic through Tor. React Native's built-in
// WebSocket cannot speak SOCKS5, so on iOS we swap nostr-tools' WebSocket
// implementation for TorWebSocket (backed by the AirhopTorSocket native module
// over Arti's SOCKS5 proxy) and ask the mesh service to rebuild its Nostr
// transport so live relay connections re-open through Tor.
//
// On Android there is no per-socket SOCKS shim: Orbot's VPN mode routes all app
// traffic transparently at the OS level, so the default WebSocket already goes
// through Tor when Orbot is active. There the WebSocket swap is a no-op and we
// only record intent and rebuild the transport (so connections re-open, in case
// Orbot came up after the pool first connected).
//
// This is the single choke point for the Tor decision. The security screen and
// the app-startup path both go through here, so the socket factory and the
// persisted preference never drift apart.

import { useWebSocketImplementation } from "nostr-tools/pool";
import { Platform } from "react-native";
import NativeAirhopTor from "../../bridge/NativeAirhopTor";
import { isTorSocketNativeAvailable } from "../../bridge/NativeAirhopTorSocket";
import { getMeshService } from "../../services/mesh-service";
import { useMeshStateStore } from "../../store/mesh-state-store";
import { useSettingsStore } from "../../store/settings-store";
import { TorWebSocket } from "./tor-websocket";

// The real React Native WebSocket, captured before any swap so it can be
// restored when Tor is turned off.
const DirectWebSocket = WebSocket;

// How long to wait for Arti to bootstrap when enabling Tor, in seconds.
const TOR_READY_TIMEOUT_S = 60;

let torActive = false;

export interface TorRoutingResult {
  ok: boolean;
  // Why enabling failed, for the UI to explain: the native module is missing,
  // or Arti did not bootstrap in time.
  reason?: "unavailable" | "timeout" | "error";
}

// Whether Nostr WebSockets are currently routed through the in-app Tor proxy.
export function isTorRoutingActive(): boolean {
  return torActive;
}

// Single writer for the active flag, mirrored into the mesh store so the Mesh
// banner reacts the instant Tor is toggled (or primed at startup).
function setTorActive(active: boolean): void {
  torActive = active;
  useMeshStateStore.getState().setTorActive(active);
}

// Whether this platform can route Nostr WebSockets through the in-app Tor (Arti)
// SOCKS proxy. iOS only; Android relies on Orbot's transparent VPN instead.
export function canRouteNostrThroughTor(): boolean {
  return Platform.OS === "ios" && isTorSocketNativeAvailable();
}

// Install the Tor WebSocket implementation. Safe to call repeatedly.
// (useWebSocketImplementation is a nostr-tools setter, not a React hook.)
function installTorSocket(): void {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useWebSocketImplementation(TorWebSocket);
}

// Restore the direct WebSocket implementation.
function installDirectSocket(): void {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useWebSocketImplementation(DirectWebSocket);
}

// Turn Tor routing on or off at runtime (from the settings toggle). Starts or
// stops Arti on iOS, swaps the socket factory, persists the preference, and
// rebuilds the Nostr transport so connections re-open on the selected path.
export async function setTorRouting(
  enabled: boolean,
): Promise<TorRoutingResult> {
  if (enabled) {
    return enableTorRouting();
  }
  await disableTorRouting();
  return { ok: true };
}

async function enableTorRouting(): Promise<TorRoutingResult> {
  // Android: cannot start Orbot ourselves; assume the user has its VPN running.
  // Traffic is routed transparently, so there is no socket to swap. Persist the
  // intent and rebuild so connections re-open (helps if Orbot just came up).
  if (Platform.OS === "android") {
    setTorActive(true);
    useSettingsStore.getState().setTorEnabled(true);
    getMeshService()?.restartNostr();
    return { ok: true };
  }

  if (NativeAirhopTor == null || !canRouteNostrThroughTor()) {
    return { ok: false, reason: "unavailable" };
  }

  try {
    await NativeAirhopTor.startTor();
    const ready = await NativeAirhopTor.awaitTorReady(TOR_READY_TIMEOUT_S);
    if (!ready) {
      await NativeAirhopTor.stopTor().catch(() => {});
      return { ok: false, reason: "timeout" };
    }
    installTorSocket();
    setTorActive(true);
    useSettingsStore.getState().setTorEnabled(true);
    getMeshService()?.restartNostr();
    return { ok: true };
  } catch {
    await NativeAirhopTor.stopTor().catch(() => {});
    installDirectSocket();
    setTorActive(false);
    return { ok: false, reason: "error" };
  }
}

async function disableTorRouting(): Promise<void> {
  if (Platform.OS === "ios") {
    installDirectSocket();
    await NativeAirhopTor?.stopTor().catch(() => {});
  }
  setTorActive(false);
  useSettingsStore.getState().setTorEnabled(false);
  getMeshService()?.restartNostr();
}

// Apply the persisted Tor preference at app startup, BEFORE the mesh service is
// initialized, so the very first relay pool is built on the right socket
// factory. On iOS it installs the Tor WebSocket and kicks off Arti; because the
// pool has auto-reconnect, relays simply retry over Tor until the circuit is up
// rather than ever touching the clear net. There is no mesh rebuild here: the
// mesh has not started yet.
export function primeTorRoutingOnStartup(): void {
  if (!useSettingsStore.getState().torEnabled) return;

  if (Platform.OS === "android") {
    // Orbot VPN routes transparently; nothing to install. Record intent so the
    // UI reflects it and a later toggle behaves consistently.
    setTorActive(true);
    return;
  }

  if (NativeAirhopTor == null || !canRouteNostrThroughTor()) {
    // Preference is on but Tor is unavailable in this build: leave the direct
    // socket in place rather than breaking Nostr. The toggle will surface it.
    return;
  }

  installTorSocket();
  setTorActive(true);
  // Start Arti in the background; relays retry over Tor until it is ready.
  void NativeAirhopTor.startTor().catch(() => {});
}
