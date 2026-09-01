// Orchestrates routing internet traffic through Tor.
//
// Airhop embeds Arti on both platforms (native/arti), so this is one code path
// rather than two. Turning Tor on starts the embedded client and points the
// app's sockets at its SOCKS5 proxy; turning it off stops the client and puts
// them back.
//
// Bluetooth is untouched throughout. Tor is an internet-only concern, so the
// mesh keeps working whatever happens here, and every failure message says so.
//
// ---- What is covered, and the one place the platforms differ ----
//
// Android: the proxy is installed into React Native's shared OkHttp client at
// application start, so every socket the app opens goes through it. `fetch` and
// WebSocket both build from that client, which means relay sockets, Cashu mint
// calls and the release check are all covered by the same switch.
//
// iOS: React Native's WebSocket cannot speak SOCKS5, so nostr-tools is given
// TorWebSocket instead, backed by the AirhopTorSocket native module. That covers
// relay traffic and nothing else, which is why `wallet-service` refuses a mint
// call while Tor is on rather than sending it in the clear.
//
// ---- Failing closed ----
//
// Both platforms fail closed at the socket, and for the same reason: Arti has no
// clearnet path at all. A request made before a circuit exists fails; it does
// not fall back. So the protection starts the instant the user consents, not the
// instant the circuit finishes forming, and there is no window in between.
//
// This is the single choke point for the Tor decision. The security screen, app
// startup and the app-foreground re-check all come through here, so the socket
// factory, the native client and the persisted preference cannot drift apart.

import NativeAirhopTor, { subscribeTorStatus } from "@bridge/NativeAirhopTor";
import { isTorSocketNativeAvailable } from "@bridge/NativeAirhopTorSocket";
import { setTorTeardown } from "@core/nostr/tor-teardown-handle";
import {
  useMeshStateStore,
  type TorBootstrapPhase,
} from "@store/mesh-state-store";
import { useSettingsStore } from "@store/settings-store";
import { useWebSocketImplementation } from "nostr-tools/pool";
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
  //   unavailable  the native Tor client is missing from this build
  //   timeout      Arti did not bootstrap in time
  //   error        Arti failed to start
  reason?: "unavailable" | "timeout" | "error";
}

// Whether internet traffic is currently routed through the embedded Tor client.
export function isTorRoutingActive(): boolean {
  return torActive;
}

// Single writer for the active flag, mirrored into the mesh store so the Mesh
// banner reacts the instant Tor is toggled, or primed at startup.
function setTorActive(active: boolean): void {
  torActive = active;
  useMeshStateStore.getState().setTorActive(active);
}

function setTorBootstrap(phase: TorBootstrapPhase): void {
  useMeshStateStore.getState().setTorBootstrap(phase);
}

// Hold the Nostr transport down while Tor is wanted and cannot carry it, and let
// it back up when Tor can.
//
// Not a safety gate any more. Both platforms fail closed at the socket, so a
// relay dialled during a dead bootstrap simply fails; nothing reaches the clear
// net whether this is set or not. What it prevents is futility: without it, a
// phone on a network that blocks Tor spends the session reconnecting a relay
// pool through a proxy that will never answer, which on a censored network is
// exactly where battery is worth saving.
//
// It also gives the Mesh banner and the wallet one honest answer to "is the
// internet half working right now", instead of each deriving it separately.

// Record the gate without touching the transport. Returns whether it moved, so
// a caller can tell a change from a re-assert.
//
// Split from setNostrBlocked for the callers that rebuild anyway: writing and
// then rebuilding once is one teardown, where letting the setter rebuild first
// costs a second that drops the sockets it just opened.
function writeNostrBlocked(blocked: boolean): boolean {
  const store = useMeshStateStore.getState();
  if (store.nostrBlockedByTor === blocked) return false;
  store.setNostrBlockedByTor(blocked);
  return true;
}

// Open or close the gate, and make the transport match.
//
// Skipped when nothing moves: restartNostr destroys and re-opens every relay
// socket, geohash subscription and the DM inbox, and the status feed reports the
// same phase more than once.
function setNostrBlocked(blocked: boolean): void {
  if (!writeNostrBlocked(blocked)) return;
  getMeshService()?.restartNostr();
}

// Whether the per-socket Tor WebSocket shim is needed and present.
//
// iOS only. Android needs no shim because its proxy is installed one layer
// lower, in the HTTP client every socket is built from.
function needsTorWebSocketShim(): boolean {
  return Platform.OS === "ios" && isTorSocketNativeAvailable();
}

// Install the Tor WebSocket implementation. Safe to call repeatedly.
// (useWebSocketImplementation is a nostr-tools setter, not a React hook.)
function installTorSocket(): void {
  if (!needsTorWebSocketShim()) return;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useWebSocketImplementation(TorWebSocket);
}

// Restore the direct WebSocket implementation.
function installDirectSocket(): void {
  if (!needsTorWebSocketShim()) return;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useWebSocketImplementation(DirectWebSocket);
}

// ---- Bootstrap reporting ----
//
// Arti reports its own progress, and whether it has stopped making any. Without
// a subscriber a bootstrap that never lands is silent: startup installs the Tor
// path and returns, every relay socket then fails closed behind a circuit that
// does not exist, and the user sees an app whose internet half quietly does
// nothing.
//
// `blocked` is the state a network that blocks Tor produces, and Arti now says
// so directly rather than leaving us to infer it from a deadline. That is the
// difference between "Airhop is broken" and "this network blocks Tor".

let statusSubscription: { remove: () => void } | null = null;

function watchTorBootstrap(): void {
  if (statusSubscription !== null) return;
  // Registered rather than called for the reason tor-teardown-handle exists:
  // panic-wipe stays loadable without a native host, and this module reaches the
  // mesh service at import time.
  setTorTeardown(() => {
    stopWatchingTorBootstrap();
    setTorActive(false);
    // Put nostr-tools back on the direct socket.
    //
    // A wipe stops Arti and deletes its state, so leaving the factory pointed at
    // a Tor socket would mean every relay built afterwards dialled a proxy that
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
      // A circuit that comes up after startup handed over, or after a stall that
      // resolved itself, is the moment the privacy claim becomes true. Only
      // claim it while the user still wants Tor.
      if (useSettingsStore.getState().torEnabled) setTorActive(true);
      // Opened AFTER the claim, so the banner never shows relays coming up under
      // a Tor indicator that is still down.
      setNostrBlocked(false);
      return;
    }
    if (status.isStarting) {
      setTorBootstrap("starting");
      return;
    }
    // Neither ready nor starting, with the preference on, is the terminal shape:
    // Arti gave up. Stand the claim down and say why. The socket path stays on
    // Tor, because falling back to a direct one would put traffic on the clear
    // net that the user never agreed to.
    if (useSettingsStore.getState().torEnabled) {
      // Closed BEFORE the claim is lowered, so there is no instant in which the
      // UI says Tor is off while the sockets it was covering are still open.
      setNostrBlocked(true);
      setTorActive(false);
      setTorBootstrap("blocked");
    } else {
      setTorBootstrap("idle");
      setNostrBlocked(false);
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

// Turn Tor routing on or off at runtime, from the settings toggle. Starts or
// stops Arti, swaps the socket path where one is needed, persists the
// preference, and rebuilds the Nostr transport so connections re-open on the
// selected route.
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
  if (NativeAirhopTor == null) {
    return { ok: false, reason: "unavailable" };
  }

  try {
    // Swap the socket and rebuild the pool BEFORE awaiting the circuit, not
    // after.
    //
    // Awaiting readiness first would leave the existing clear-net pool live for
    // the whole bootstrap: up to a minute of relay subscriptions, gift-wrapped
    // DMs, geohash presence and bridge events going out unprotected AFTER the
    // user asked for Tor. Consent is the moment the protection has to start, not
    // the moment the circuit happens to finish.
    //
    // nostr-tools captures the socket constructor per relay when the relay
    // object is built, so the order is load-bearing in both directions: install
    // the factory, then tear the old pool down, then let it rebuild on the new
    // one. Sockets opened against a circuit that is not up yet simply fail and
    // retry, which is the same fail-closed behaviour startup has always had.
    watchTorBootstrap();
    setTorBootstrap("starting");
    installTorSocket();
    // Persist first, so a relaunch during the bootstrap comes back on Tor rather
    // than on the clear net.
    useSettingsStore.getState().setTorEnabled(true);
    // Native points its own HTTP client at the proxy inside startTor, before the
    // client is even built, so there is no window on either platform.
    await NativeAirhopTor.startTor();
    getMeshService()?.restartNostr();

    const ready = await NativeAirhopTor.awaitTorReady(TOR_READY_TIMEOUT_S);
    if (!ready) {
      // Deliberately NOT undone. Arti keeps running, the sockets stay on Tor,
      // and the claim stays down: a bootstrap can still land after this
      // deadline, and the status watcher reports it terminally if it does not.
      // Stopping Arti here kills a circuit that may be nearly up, and reverting
      // the socket puts the user back on the clear net they just opted out of.
      return { ok: false, reason: "timeout" };
    }
    // Re-check consent before claiming it. Sixty seconds is long enough for the
    // user to toggle Tor back off, or for a panic wipe to tear the whole thing
    // down, and an enable that resolves afterwards would assert onion routing
    // over a socket that is back on the clear net.
    if (!useSettingsStore.getState().torEnabled) {
      return { ok: false, reason: "error" };
    }
    setTorActive(true);
    setTorBootstrap("idle");
    return { ok: true };
  } catch {
    // A throw is different from a slow bootstrap: the module itself failed, so
    // there is nothing to wait for, and leaving the app with no internet half
    // would be worse than the clear net it started on. Unwind completely.
    await NativeAirhopTor.stopTor().catch(() => {});
    installDirectSocket();
    setTorActive(false);
    useSettingsStore.getState().setTorEnabled(false);
    stopWatchingTorBootstrap();
    writeNostrBlocked(false);
    getMeshService()?.restartNostr();
    return { ok: false, reason: "error" };
  }
}

async function disableTorRouting(): Promise<void> {
  stopWatchingTorBootstrap();
  installDirectSocket();
  // Nobody is asking for Tor, so nothing may be held down in its name. This is
  // also the way out of the blocked state, which is why that state needs no
  // rescue of its own: turning Tor off brings the internet half back. Written
  // rather than applied, so the restart at the end of this function covers both.
  writeNostrBlocked(false);
  // The preference goes down first, so anything still racing sees consent
  // withdrawn and stands down instead of writing over this.
  useSettingsStore.getState().setTorEnabled(false);
  setTorActive(false);
  setTorBootstrap("idle");
  // Native puts its HTTP client back on a direct route inside stopTor, after the
  // client is down, so there is no instant in which the proxy is gone while
  // something still believes it is covered.
  await NativeAirhopTor?.stopTor().catch(() => {});
  getMeshService()?.restartNostr();
}

// Apply the persisted Tor preference at app startup, BEFORE the mesh service is
// initialized, so the very first relay pool is built on the right socket path.
// There is no mesh rebuild here: the mesh has not started yet.
export function primeTorRoutingOnStartup(): void {
  if (!useSettingsStore.getState().torEnabled) return;

  if (NativeAirhopTor == null) {
    // The preference is on but Tor is unavailable in this build. Leave the
    // direct socket in place rather than breaking the internet half entirely;
    // the toggle surfaces it.
    return;
  }

  // The socket path goes on immediately: traffic must be fail-closed from the
  // first relay attempt, before anything is known about the circuit.
  installTorSocket();
  // The CLAIM does not. `torActive` drives the "internet traffic onion routed"
  // banner, and asserting it here would assert it before a single circuit
  // existed: true within seconds on a good network, and never true at all on one
  // that blocks Tor, where it would sit green for the whole session. The watcher
  // raises it the moment Arti reports ready, which is the first instant it is
  // actually true, and lowers it when Arti reports it is stuck.
  watchTorBootstrap();
  setTorBootstrap("starting");
  void NativeAirhopTor.startTor().catch(() => {});
}

// Tell Arti which side of the screen the app is on, so it can sleep in the
// background and wake on return.
//
// Ungated on the preference: with nothing running it is a no-op on both
// platforms.
export function notifyTorAppForeground(foreground: boolean): void {
  void NativeAirhopTor?.setAppForeground?.(foreground).catch(() => {
    // An older native binary without the method. The foreground re-check below
    // still corrects the claim; what is lost is the dormancy behind it.
  });
}

// Re-check Tor on app foreground and stand the claim down if it has gone away.
//
// `enableTorRouting` awaits readiness before claiming anything, so a toggle is
// honest. `primeTorRoutingOnStartup` cannot wait: it runs before the mesh exists,
// so it installs the Tor path, leaves the claim down, and lets Arti bootstrap
// behind it. That is fail-closed and correct for traffic. What it is not is
// self-correcting for a bootstrap that completed and then stopped being true,
// which a suspension or a network change can produce.
//
// A status snapshot rather than the event feed, even though watchTorBootstrap
// subscribes to that too. The feed reports transitions; this answers "what is
// true right now", which is the question a resume asks after a gap the feed
// could not report during.
//
// `isStarting` is treated as still-fine: a bootstrap in progress is the normal
// state for the first seconds after launch, and standing the claim down there
// would flicker the banner on every cold start.
export async function revalidateTorRouting(): Promise<void> {
  // Guarded on the PREFERENCE, not the claim. `torActive` is false throughout a
  // blocked state, so an early return on it would make foreground the one
  // trigger that can never recover a session.
  if (!useSettingsStore.getState().torEnabled) return;
  if (NativeAirhopTor == null) return;

  try {
    const status = await NativeAirhopTor.getTorStatus();
    if (status.isReady) {
      setTorActive(true);
      setTorBootstrap("idle");
      setNostrBlocked(false);
      return;
    }
    if (status.isStarting) {
      setTorBootstrap("starting");
      return;
    }
  } catch {
    // The module answered with an error rather than a status. Treat that the
    // same as "not routing": the point of this path is to stop overstating.
  }
  // The socket path is deliberately left alone. Swapping back to a direct socket
  // here would put traffic on the clear net that a user who asked for Tor never
  // agreed to. Failing closed and stopping the claim is the honest pair.
  //
  // The preference stays on. A transport that has gone is usually transient, so
  // the next launch retries rather than making the user re-enable Tor they were
  // never told was switched off for them.
  setNostrBlocked(true);
  setTorActive(false);
  setTorBootstrap("blocked");
}
