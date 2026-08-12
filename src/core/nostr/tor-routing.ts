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
import type { EventSubscription } from "react-native";
import { Platform } from "react-native";
import NativeAirhopBLE, {
  subscribeVpnLost,
} from "../../bridge/NativeAirhopBLE";
import NativeAirhopTor, {
  subscribeTorStatus,
} from "../../bridge/NativeAirhopTor";
import { isTorSocketNativeAvailable } from "../../bridge/NativeAirhopTorSocket";
import { getMeshService } from "../../services/mesh-service";
import {
  useMeshStateStore,
  type TorBootstrapPhase,
} from "../../store/mesh-state-store";
import { useSettingsStore } from "../../store/settings-store";
import { setTorTeardown } from "./tor-teardown-handle";
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

let vpnLostSub: EventSubscription | null = null;

// Single writer for the active flag, mirrored into the mesh store so the Mesh
// banner reacts the instant Tor is toggled (or primed at startup).
//
// The VPN watch is bound here rather than to the setting: the setting is what
// the user asked for, this is what is actually carrying traffic.
//
// Android-only in effect (both native calls resolve immediately on iOS, where
// Arti reports its own state) and idempotent on both sides.
function setTorActive(active: boolean): void {
  torActive = active;
  useMeshStateStore.getState().setTorActive(active);
  if (active) {
    // Listener first, so a VPN dropping between the two calls is not missed.
    //
    // It re-probes rather than acting on the event: a user can be on a corporate
    // VPN and Orbot at once, so "a VPN went away" is not "Orbot went away".
    // revalidateTorRouting no-ops if Tor is still routing.
    vpnLostSub ??= subscribeVpnLost(() => {
      void revalidateTorRouting();
    });
    // Optional on the method as well as the module: a JS-only update can land on
    // an older native binary that has neither call. A device that refuses the
    // registration keeps the old behaviour, where the foreground re-check
    // catches a drop later.
    void NativeAirhopBLE?.startVpnWatch?.().catch(() => {});
  } else {
    void NativeAirhopBLE?.stopVpnWatch?.().catch(() => {});
    vpnLostSub?.remove();
    vpnLostSub = null;
  }
}

function setTorBootstrap(phase: TorBootstrapPhase): void {
  useMeshStateStore.getState().setTorBootstrap(phase);
}

// Live bootstrap reporting for iOS, where Airhop embeds Arti and therefore owns
// the only signal about whether a circuit is forming, formed, or never coming.
//
// Without this, a bootstrap that never lands is silent: `primeTorRoutingOnStartup`
// installs the Tor socket and returns, every relay socket then fails closed
// behind a circuit that does not exist, and the user sees an app whose internet
// half quietly does nothing. `revalidateTorRouting` catches it at the next
// foreground; this catches it at the moment it happens, which is what makes the
// difference between "Airhop is broken" and "this network blocks Tor".
//
// Mirrors bitchat/ios `ChatViewModel+Tor`, which posts starting, started and
// blocked as system messages. Airhop's equivalent surface is the Mesh banner,
// and the wording keeps their most important point: the mesh still works.
let statusSubscription: { remove: () => void } | null = null;

function watchTorBootstrap(): void {
  if (statusSubscription !== null) return;
  // Register the teardown so a panic wipe can reach it. See
  // tor-teardown-handle: this module cannot be imported from panic-wipe.ts, and
  // a live native listener plus a stale routing flag must not outlive a wipe.
  setTorTeardown(() => {
    stopWatchingTorBootstrap();
    setTorActive(false);
    // Put nostr-tools back on the direct socket.
    //
    // A wipe stops Arti and deletes its state, so leaving the factory pointed
    // at a Tor socket meant every relay built afterwards dialled a proxy that
    // no longer exists: relays, geohash channels, gift-wrapped DMs and nutzaps
    // all silently dead for the rest of the process, while Settings correctly
    // showed Tor as off. Safe because the wipe also resets torEnabled to false,
    // so this restores the socket the preference now asks for.
    installDirectSocket();
    setTorTeardown(null);
  });
  statusSubscription = subscribeTorStatus((status) => {
    if (status.isReady) {
      setTorBootstrap("idle");
      // A circuit that comes up after `primeTorRoutingOnStartup` handed over,
      // or after a stall that resolved itself, is the moment the privacy claim
      // becomes true. Only claim it while the user still wants Tor.
      if (useSettingsStore.getState().torEnabled) setTorActive(true);
      return;
    }
    if (status.isStarting) {
      setTorBootstrap("starting");
      return;
    }
    // Neither ready nor starting, with the preference on, is the terminal
    // shape: Arti gave up. Stand the claim down and say why. The socket
    // factory stays on Tor, because falling back to a direct one would put
    // traffic on the clear net that the user never agreed to.
    if (useSettingsStore.getState().torEnabled) {
      setTorActive(false);
      setTorBootstrap("blocked");
    } else {
      setTorBootstrap("idle");
    }
  });
}

function stopWatchingTorBootstrap(): void {
  statusSubscription?.remove();
  statusSubscription = null;
  setTorBootstrap("idle");
  // Nothing left to tear down, so nothing should hold a teardown for it.
  setTorTeardown(null);
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
    // Swap the socket and rebuild the pool BEFORE awaiting the circuit, not
    // after.
    //
    // The old order awaited readiness first, which left the existing clear-net
    // pool live for the whole bootstrap - up to a minute of relay
    // subscriptions, gift-wrapped DMs, geohash presence and bridge events going
    // out unprotected AFTER the user asked for Tor. Consent is the moment the
    // protection has to start, not the moment the circuit happens to finish.
    //
    // nostr-tools captures the socket constructor per relay when the relay
    // object is built, so the order is load-bearing in both directions: install
    // the factory, then tear the old pool down, then let it rebuild on the new
    // one. Sockets opened against a circuit that is not up yet simply fail and
    // retry, which is the same fail-closed behaviour startup has always had.
    watchTorBootstrap();
    setTorBootstrap("starting");
    installTorSocket();
    // Persist first so a relaunch during the bootstrap comes back on Tor rather
    // than on the clear net.
    useSettingsStore.getState().setTorEnabled(true);
    getMeshService()?.restartNostr();

    await NativeAirhopTor.startTor();
    const ready = await NativeAirhopTor.awaitTorReady(TOR_READY_TIMEOUT_S);
    if (!ready) {
      // Deliberately NOT undone. Arti keeps running, the socket stays on Tor,
      // and the claim stays down: a bootstrap can still land after this
      // deadline (the native poll runs longer than it does), and the stall
      // event reports it terminally if it does not. Stopping Arti here used to
      // kill a circuit that was nearly up, and reverting the socket would put
      // the user back on the clear net they had just opted out of.
      //
      // The caller gets the failure so the sheet can explain it; the banner
      // carries "starting" or "blocked" from the watcher above.
      return { ok: false, reason: "timeout" };
    }
    // Re-check consent before claiming it. Sixty seconds is long enough for the
    // user to toggle Tor back off, or for a panic wipe to tear the whole thing
    // down, and an enable that resolves afterwards would assert onion routing
    // over a socket that is back on the clear net. The status watcher above
    // guards its own claim the same way.
    if (!useSettingsStore.getState().torEnabled) {
      return { ok: false, reason: "error" };
    }
    setTorActive(true);
    setTorBootstrap("idle");
    return { ok: true };
  } catch {
    // A throw is different from a slow bootstrap: the module itself failed, so
    // there is nothing to wait for and leaving the app with no internet half
    // would be worse than the clear net it started on. Unwind completely.
    await NativeAirhopTor.stopTor().catch(() => {});
    installDirectSocket();
    setTorActive(false);
    useSettingsStore.getState().setTorEnabled(false);
    stopWatchingTorBootstrap();
    getMeshService()?.restartNostr();
    return { ok: false, reason: "error" };
  }
}

async function disableTorRouting(): Promise<void> {
  if (Platform.OS === "ios") {
    stopWatchingTorBootstrap();
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

  // The socket goes on immediately: traffic must be fail-closed from the first
  // relay attempt, before anything is known about the circuit.
  installTorSocket();
  // The CLAIM does not. `torActive` drives the "internet traffic onion routed"
  // banner, and asserting it here asserted it before a single circuit existed -
  // true within seconds on a good network, and never true at all on one that
  // blocks Tor, where it sat green for the whole session. The watcher below
  // raises it the moment Arti reports ready, which is the first instant it is
  // actually true, and lowers it on the stall event.
  watchTorBootstrap();
  setTorBootstrap("starting");
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
// iOS needs the same check for a different reason. `enableTorRouting` awaits
// `awaitTorReady` before claiming anything, so a toggle is honest. But
// `primeTorRoutingOnStartup` cannot wait: it runs before the mesh exists, so it
// installs the Tor socket, claims active, and lets Arti bootstrap behind it.
// That is fail-closed and correct for traffic, since every relay socket goes
// through Arti's SOCKS and simply fails until the circuit is up rather than
// falling back to clear net. What it is not is honest for a bootstrap that
// never completes: the banner reads "Tor on" over a Nostr layer that silently
// never connects, and nothing ever corrected it.
//
// This file's comment used to say iOS status arrives over `TorStatusChanged`.
// Nothing subscribes to that event, so on iOS the claim was simply never
// revisited. Rather than add an event subscription and its lifecycle, this uses
// the status snapshot the native module already exposes, on the same foreground
// trigger Android uses.
//
// `isStarting` is treated as still-fine: a bootstrap in progress is the normal
// state for the first seconds after launch, and standing the flag down there
// would flicker the banner on every cold start.
//
// No-ops when Tor is already off.
export async function revalidateTorRouting(): Promise<void> {
  if (!torActive) return;

  if (Platform.OS === "ios") {
    if (NativeAirhopTor == null) return;
    try {
      const status = await NativeAirhopTor.getTorStatus();
      if (status.isReady || status.isStarting) return;
    } catch {
      // The module answered with an error rather than a status. Treat that the
      // same as "not routing": the point of this path is to stop overstating.
    }
    // The socket factory is deliberately left alone, for the same reason as
    // Android below: swapping back to a direct socket here would put traffic on
    // the clear net that a user who asked for Tor never agreed to. Failing
    // closed and stopping the claim is the honest pair.
    //
    // The persisted preference also stays on, which is where iOS and Android
    // differ. Arti is ours and a failed bootstrap is usually transient (no
    // signal yet), so the next launch should retry rather than making the user
    // re-enable Tor by hand. Orbot is not ours: if it has gone, only the user
    // can bring it back, so Android clears the preference to match.
    setTorActive(false);
    return;
  }

  if (Platform.OS !== "android") return;

  const { routing } = await probeAndroidTorProxy();
  if (routing) return;

  setTorActive(false);
  useSettingsStore.getState().setTorEnabled(false);
}
