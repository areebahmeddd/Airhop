// Orchestrates routing Nostr traffic through Tor. React Native's built-in
// WebSocket cannot speak SOCKS5, so on iOS we swap nostr-tools' WebSocket
// implementation for TorWebSocket (backed by the AirhopTorSocket native module
// over Arti's SOCKS5 proxy) and ask the mesh service to rebuild its Nostr
// transport so live relay connections re-open through Tor.
//
// On Android there is no per-socket SOCKS shim: Orbot's VPN mode routes all app
// traffic transparently at the OS level, so the default WebSocket already goes
// through Tor when Orbot is active. There the WebSocket swap is a no-op.
//
// That difference decides where each platform fails closed. iOS fails closed at
// the socket, because every relay connection is dialled through Arti's proxy and
// simply fails until a circuit exists. Android cannot: the moment Orbot's VPN
// goes away the very same sockets keep working, in the clear. So Android fails
// closed one layer up, refusing to have a Nostr transport at all while Tor is
// wanted and not routing - see the gate section below. Bluetooth is untouched on
// both, so the mesh keeps working and only the internet half pauses.
//
// This is the single choke point for the Tor decision. The security screen, the
// app-startup path, the app-foreground re-check and the VPN edges all go through
// here, so the socket factory, the gate and the persisted preference never drift
// apart.

import NativeAirhopBLE, {
  subscribeVpnAvailable,
  subscribeVpnLost,
} from "@bridge/NativeAirhopBLE";
import NativeAirhopTor, { subscribeTorStatus } from "@bridge/NativeAirhopTor";
import { isTorSocketNativeAvailable } from "@bridge/NativeAirhopTorSocket";
import { setTorTeardown } from "@core/nostr/tor-teardown-handle";
import {
  useMeshStateStore,
  type TorBootstrapPhase,
} from "@store/mesh-state-store";
import { useSettingsStore } from "@store/settings-store";
import { useWebSocketImplementation } from "nostr-tools/pool";
import type { EventSubscription } from "react-native";
import { Platform } from "react-native";
import { getMeshService } from "./mesh-service";
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
//                is genuinely running. Without it, an installed-but-idle Orbot
//                sitting beside an unrelated VPN reads as "Tor on, internet
//                traffic
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
//
// The claim and nothing else. The VPN watch belongs to the preference instead,
// because it has to survive the drop it reports. See setAndroidVpnWatch.
function setTorActive(active: boolean): void {
  torActive = active;
  useMeshStateStore.getState().setTorActive(active);
}

function setTorBootstrap(phase: TorBootstrapPhase): void {
  useMeshStateStore.getState().setTorBootstrap(phase);
}

// ---- Android: the fail-closed gate ----
//
// iOS fails closed at the socket: the Tor WebSocket factory is installed before
// any circuit exists, so a relay connection is dialled through Arti's SOCKS
// proxy and fails until it is up. Nothing can reach the clear net even in
// principle.
//
// Android has no per-socket SOCKS shim - Orbot routes transparently at the OS
// level - so the same sockets keep working the instant its VPN goes away, in
// the clear, for a user who asked for Tor. Nothing there can fail, so the only
// place to fail closed is one layer up: refusing to have a Nostr transport at
// all. That is this gate.
//
// Bluetooth is untouched throughout. The mesh keeps working and only the
// internet half pauses, which is the same trade iOS already makes.

let vpnLostSub: EventSubscription | null = null;
let vpnAvailableSub: EventSubscription | null = null;

// Bound to the PREFERENCE, not the claim. The window in which a VPN moving
// matters opens when the user asks for Tor and closes when they stop asking,
// and it spans the blocked state in between - which is precisely when the
// arrival edge is the only thing that can recover the session.
//
// Android-only in effect (both native calls resolve immediately on iOS, where
// Arti reports its own state) and idempotent on both sides.
function setAndroidVpnWatch(enabled: boolean): void {
  if (Platform.OS !== "android") return;
  if (enabled) {
    // Listeners first, so an edge landing between these calls is not missed.
    //
    // Both re-probe rather than acting on the event. A user can be on a
    // corporate VPN and Orbot at once, so "a VPN went away" is not "Orbot went
    // away" - and equally "a VPN arrived" is not "Orbot is back".
    vpnLostSub ??= subscribeVpnLost(() => {
      void applyAndroidTorRouting();
    });
    vpnAvailableSub ??= subscribeVpnAvailable(() => {
      void applyAndroidTorRouting();
    });
    // Optional on the method as well as the module: a JS-only update can land on
    // an older native binary that has neither call. A device that refuses the
    // registration falls back to the foreground re-check, which catches a drop
    // (and a recovery) later.
    void NativeAirhopBLE?.startVpnWatch?.().catch(() => {});
    return;
  }
  void NativeAirhopBLE?.stopVpnWatch?.().catch(() => {});
  vpnLostSub?.remove();
  vpnLostSub = null;
  vpnAvailableSub?.remove();
  vpnAvailableSub = null;
}

// Record the gate, without touching the transport.
//
// Split from applyTorGate for the two callers that rebuild anyway (the toggle,
// both directions): writing then rebuilding once is one teardown, where letting
// the setter rebuild first costs a second that drops the sockets it just
// opened. Returns whether it moved, so a caller can tell a change from a
// re-assert.
function writeTorGate(blocked: boolean): boolean {
  const store = useMeshStateStore.getState();
  if (store.nostrBlockedByTor === blocked) return false;
  store.setNostrBlockedByTor(blocked);
  return true;
}

// Open or close the gate, and make the transport match.
//
// `restartNostr` is the whole mechanism: it tears the pool down and then
// rebuilds only if every gate is open, so one call does the right thing in both
// directions and mesh-service needs no notion of Tor. Before the mesh exists it
// is a no-op and `start()` reads the gate itself, so startup ordering does not
// matter.
//
// Skipped when nothing moves: restartNostr destroys and re-opens every relay
// socket, geohash subscription and the DM inbox, and the probe below resolves
// with the same answer whenever a VPN edge and an app foreground land together.
function applyTorGate(blocked: boolean): void {
  if (!writeTorGate(blocked)) return;
  getMeshService()?.restartNostr();
}

// What a panic wipe has to undo on Android: two native listeners, the native
// watch, the claim, and any gate still holding the transport down. Registered
// rather than called for the reason tor-teardown-handle exists - panic-wipe
// stays loadable without a native host, and this module reaches the mesh service
// at import time. iOS registers its equivalent from watchTorBootstrap.
//
// The wipe clears torEnabled a few steps earlier, so opening the gate here
// restores what the preference now asks for rather than overriding it.
function registerAndroidTorTeardown(): void {
  if (Platform.OS !== "android") return;
  setTorTeardown(() => {
    setAndroidVpnWatch(false);
    setTorActive(false);
    setTorBootstrap("idle");
    // Written, not applied: the mesh service is destroyed before this runs, so
    // there is no transport to rebuild and restartNostr would be a no-op with a
    // misleading name at the call site.
    writeTorGate(false);
    setTorTeardown(null);
  });
}

// Serialises overlapping probes. A VPN drop, a VPN arrival and an app
// foreground can all land within a few hundred milliseconds of each other, and
// each probe takes up to the native 500 ms connect timeout, so results can
// resolve out of order. Only the newest may write, or a stale "not routing" can
// close the gate over a session that has already recovered - the same rule
// WiFiController's generation counter enforces for a stale attach.
let androidProbeGeneration = 0;

// Re-probe Orbot and bring the claim, the banner and the transport into line.
//
// The one Android writer. Every trigger - the toggle, startup, a VPN edge, an
// app foreground - goes through here, so there is exactly one description of
// what "Tor is on" means on this platform and the four paths cannot disagree.
async function applyAndroidTorRouting(): Promise<boolean> {
  if (Platform.OS !== "android") return false;
  // The user is not asking for Tor, so there is nothing to enforce and nothing
  // to hold down. Reached when an edge fires between a disable and the watch
  // being torn down.
  if (!useSettingsStore.getState().torEnabled) {
    applyTorGate(false);
    return false;
  }

  const generation = ++androidProbeGeneration;
  const { routing } = await probeAndroidTorProxy();
  // A newer probe is already in flight, or has already answered. Its result is
  // the current one; this is history.
  if (generation !== androidProbeGeneration) return routing;
  // And consent can move during the probe - a toggle off, or a panic wipe - in
  // which case this answer is about a question nobody is asking any more.
  if (!useSettingsStore.getState().torEnabled) {
    applyTorGate(false);
    return false;
  }

  if (routing) {
    setTorBootstrap("idle");
    setTorActive(true);
    // Opened AFTER the claim, so the banner never shows relays coming up under
    // a Tor indicator that is still down.
    applyTorGate(false);
    return true;
  }

  // Closed BEFORE the claim is lowered, so there is no instant in which the UI
  // says Tor is off while the sockets it was covering are still open.
  applyTorGate(true);
  setTorActive(false);
  setTorBootstrap("blocked");
  return false;
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
      // Refused rather than accepted-into-blocked: declining and saying so is
      // a better answer to "Orbot is not running" than switching on and pausing
      // every internet feature, and the sheet can offer the install or the
      // nudge. The blocked state is for a routing path that was working and
      // went away, which is a different event.
      return {
        ok: false,
        reason: probe.orbotInstalled ? "orbot-inactive" : "orbot-missing",
      };
    }
    // Persist first, so the watch and the gate below both read a preference
    // that already says what the user asked for.
    useSettingsStore.getState().setTorEnabled(true);
    registerAndroidTorTeardown();
    setAndroidVpnWatch(true);
    setTorBootstrap("idle");
    setTorActive(true);
    // Opened explicitly: an earlier pass in this process may have left the gate
    // closed, and the restart below is what puts the pool back on the path the
    // user has just chosen.
    writeTorGate(false);
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
    // Awaiting readiness first would leave the existing clear-net pool live for
    // the whole bootstrap, up to a minute of relay subscriptions, gift-wrapped
    // DMs, geohash presence and bridge events going
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
      // event reports it terminally if it does not. Stopping Arti here kills a
      // circuit that is nearly up, and reverting the socket puts the user back on
      // the clear net they just opted out of.
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
  // The preference goes down first, so anything still racing - a probe in
  // flight, a VPN edge arriving as the watch is torn down - sees consent
  // withdrawn and stands down instead of writing over this.
  useSettingsStore.getState().setTorEnabled(false);
  setTorActive(false);
  setTorBootstrap("idle");
  if (Platform.OS === "android") {
    setAndroidVpnWatch(false);
    // Nobody is asking for Tor, so nothing may be held down in its name. This
    // is also the way out of the blocked state, which is why that state needs no
    // rescue of its own: turning Tor off brings the internet features back.
    // Ordered before the restart so one rebuild covers both.
    writeTorGate(false);
    setTorTeardown(null);
  }
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
    // Closed FIRST, synchronously, before anything can open a socket.
    //
    // The preference is on, but Orbot may have been uninstalled or stopped
    // since the last launch, and the probe that answers takes up to half a
    // second.
    // Assuming it is routing for that half second is a clear-net window in the
    // one state that must not have one - and it is the window a cold start on a
    // hostile network lands in. The mesh has not started yet, so `start()` will
    // read this gate and simply build no transport until the probe says it may;
    // the cost on a healthy device is relay connections a few hundred
    // milliseconds later than before, which nothing is waiting on.
    //
    // The preference is NOT cleared when the probe fails. Clearing it would
    // quietly revert a user who asked for Tor onto the clear net and leave them
    // to notice; keeping it on and holding the transport down is the answer iOS
    // already gives a bootstrap that never completes. The way out is the same on
    // both: the banner says Tor could not connect, and turning Tor off restores
    // the internet half at once.
    writeTorGate(true);
    // "starting", not "blocked". The gate is shut either way, but the banner is
    // a statement about the world and "Tor could not connect" is not yet true
    // half a second into a launch. Blocked is what the probe concludes.
    setTorBootstrap("starting");
    registerAndroidTorTeardown();
    // The watch goes up before the probe, not after: Orbot may finish starting
    // during it (a phone that boots both apps at once), and the arrival edge is
    // what turns that into a recovery instead of a wait for the next
    // foreground.
    setAndroidVpnWatch(true);
    void applyAndroidTorRouting();
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

// Tell Arti which side of the screen the app is on, so it can recover from a
// suspension.
//
// iOS only, and not advisory. The process is suspended in the background, which
// kills circuits and guard connections, while the manager stops polling once
// bootstrap reaches 100% and never re-probes the SOCKS port. `isReady` stays
// latched, so a resume reports Tor ready over dead circuits and the restart path
// declines for the same reason - leaving relay sockets failing closed with
// nothing to trigger a recovery. bitchat drives the same two calls from its
// scene-phase handler.
//
// Ungated on the preference: the native side revokes auto-start consent on any
// explicit stop, so the restart half is already a no-op for a user with Tor off.
// Optional-chained for Android and for any build without Arti.
export function notifyTorAppForeground(foreground: boolean): void {
  if (Platform.OS !== "ios") return;
  void NativeAirhopTor?.setAppForeground?.(foreground).catch(() => {
    // An older native binary without the method. The foreground re-check below
    // still corrects the claim; what is lost is the restart behind it.
  });
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
// A status snapshot rather than the `TorStatusChanged` feed, even though
// watchTorBootstrap subscribes to that too. The feed reports transitions; this
// answers "what is true right now", which is the question a resume asks after a
// suspension the feed could not report during.
//
// `isStarting` is treated as still-fine: a bootstrap in progress is the normal
// state for the first seconds after launch, and standing the flag down there
// would flicker the banner on every cold start.
//
// No-ops when Tor is off.
export async function revalidateTorRouting(): Promise<void> {
  if (Platform.OS === "android") {
    // Guarded on the PREFERENCE, not the claim. `torActive` is false throughout
    // the blocked state, so an early return on it would make foreground the one
    // trigger that can never recover a session. Consent says whether the check
    // is wanted; the claim is one of the things it recomputes.
    if (!useSettingsStore.getState().torEnabled) return;
    // Re-asserted here as well as at startup: on a native binary too old to
    // emit the VPN edges, a foreground round trip is the only signal there is.
    setAndroidVpnWatch(true);
    await applyAndroidTorRouting();
    return;
  }

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
    // The preference stays on, on both platforms. A transport that has gone is
    // usually transient (no signal yet, Orbot not restarted), so the next launch
    // retries rather than making the user re-enable Tor they were never told was
    // switched off for them.
    setTorActive(false);
    setTorBootstrap("blocked");
    return;
  }
}
