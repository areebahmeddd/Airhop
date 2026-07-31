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
import NativeAirhopBLE from "../../bridge/NativeAirhopBLE";
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
  // Why enabling failed, for the UI to explain:
  //   unavailable    the native module is missing (iOS build without Arti)
  //   timeout        Arti did not bootstrap in time (iOS)
  //   error          Arti failed to start (iOS)
  //   orbot-missing  Orbot is not installed (Android)
  //   orbot-inactive Orbot is installed but is not actually routing (Android)
  reason?:
    "unavailable" | "timeout" | "error" | "orbot-missing" | "orbot-inactive";
}

// What we could establish about Android's Tor path.
interface AndroidTorProbe {
  // The security decision: is traffic genuinely going through Tor right now.
  routing: boolean;
  // Messaging only. Picks between "install Orbot" and "start Orbot", and must
  // never be used to decide whether Tor is on.
  orbotInstalled: boolean;
}

// Establish whether Android is actually routing through Orbot.
//
// Two independent signals, both required:
//
//   port !== 0   something answers on Orbot's SOCKS port, so Orbot's Tor daemon
//                is genuinely running. This is the signal the old check lacked,
//                and the reason an installed-but-idle Orbot sitting beside an
//                unrelated VPN used to read as "Tor on - internet traffic
//                routed" while nothing was routed at all.
//   vpnActive    a VPN transport is up, so app traffic is being captured. Orbot
//                routes transparently in VPN mode, so without this Tor may be
//                running with nothing being sent through it.
//
// Neither is sufficient alone. The pair still cannot prove the VPN belongs to
// Orbot rather than to something else running alongside it, because Android
// exposes no per-VPN ownership to other apps. That last gap closes only when
// Airhop owns the Tor process itself, which is what embedding Arti buys us.
//
// Both calls are already off the JS thread natively (the port probe runs on its
// own thread with a 500 ms connect timeout) and neither throws into callers:
// a rejection is read as "not routing", which is the safe direction.
async function probeAndroidTorProxy(): Promise<AndroidTorProbe> {
  const [port, availability] = await Promise.all([
    NativeAirhopBLE.getTorProxyPort().catch(() => 0),
    NativeAirhopBLE.getTorAvailability().catch(() => ({
      orbotInstalled: false,
      vpnActive: false,
    })),
  ]);
  return {
    routing: port !== 0 && availability.vpnActive,
    orbotInstalled: availability.orbotInstalled,
  };
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
  // Android: we cannot start Orbot ourselves, so the most we can do is refuse to
  // claim Tor is on unless we can show it is. probeAndroidTorProxy makes that
  // call; orbotInstalled only picks which of the two messages to show.
  if (Platform.OS === "android") {
    const probe = await probeAndroidTorProxy();
    if (!probe.routing) {
      return {
        ok: false,
        reason: probe.orbotInstalled ? "orbot-inactive" : "orbot-missing",
      };
    }
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
    // The preference is on, but Orbot may have been uninstalled or stopped since
    // we last ran. Re-verify before claiming Tor is active, so the toggle does
    // not show green when nothing is routing. Done async (the mesh has not
    // started yet); the settings switch is driven by the persisted preference,
    // which we clear if Tor is no longer actually routing. Clearing it is the
    // point: leaving it set would show an "on" switch over clear-net traffic,
    // which is the exact thing this path exists to prevent.
    void probeAndroidTorProxy()
      .then(({ routing }) => {
        if (routing) {
          setTorActive(true);
          return;
        }
        setTorActive(false);
        useSettingsStore.getState().setTorEnabled(false);
      })
      .catch(() => {});
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

// Re-check Android's Tor path and stand the flag down if it has gone away.
//
// Enabling is a point-in-time check, so without this a session that began with
// Orbot up keeps a green banner forever, even after the user switches to Orbot,
// stops it, and comes back. App foreground is exactly when that round trip
// lands, which is where this is wired.
//
// Deliberately does NOT rebuild the Nostr transport on failure. On Android the
// socket factory is the same either way (Orbot routes at the OS level, so there
// is no per-socket Tor path to tear down). If Orbot's VPN has dropped, traffic
// is already on the clear net whether we reconnect or not, and forcing a
// reconnect would only open fresh clear-net sockets we did not have to open.
// The honest and minimal action is to stop claiming Tor is on.
//
// No-ops on iOS, where Airhop owns Arti and its status arrives over
// TorStatusChanged rather than by probing, and no-ops when Tor is already off.
export async function revalidateTorRouting(): Promise<void> {
  if (Platform.OS !== "android") return;
  if (!torActive) return;

  const { routing } = await probeAndroidTorProxy();
  if (routing) return;

  setTorActive(false);
  useSettingsStore.getState().setTorEnabled(false);
}
