// Nostr client: SimplePool with auto-reconnect and optional Tor proxy.
//
// Connects to 3-5 relays simultaneously. Publish uses first-ACK-wins: the
// event is sent to all relays and the promise resolves on the first OK.
//
// Relay selection: caller provides the relay list. Use geo-relay.ts to pick
// the closest relays. A fixed set of default gift-wrap relays is always
// included for DM delivery.
//
// Tor proxy: this client never touches the socket directly. Routing Nostr
// through Tor is done one level up, by swapping nostr-tools' WebSocket
// implementation (see tor-routing.ts): on iOS for TorWebSocket, which tunnels
// over Arti's SOCKS5 proxy, and on Android by Orbot's transparent VPN. The pool
// is created with auto-reconnect so that when the transport is swapped (or a
// relay drops) connections re-open on their own, and so a pool primed for Tor
// before Arti has finished bootstrapping simply retries until the circuit is up
// rather than ever falling back to the clear net.

import type { Event } from "nostr-tools";
import type { Filter } from "nostr-tools/filter";
import type { SubCloser } from "nostr-tools/pool";
import { SimplePool } from "nostr-tools/pool";
import {
  DEFAULT_DM_RELAYS,
  GEO_RELAY_COUNT,
  MAX_CUSTOM_RELAYS,
} from "./geo-relay";

// Maximum relays in the default pool (DM / gift-wrap traffic).
const MAX_RELAY_COUNT = 5;

// Ceiling for an explicit per-call relay set, deliberately higher than
// MAX_RELAY_COUNT.
//
// A geohash cell's set is the 5 nearest relays (the interop rendezvous, which
// must stay intact) PLUS the user's custom relays, appended last by
// mergeGeoRelays. Capping that back to MAX_RELAY_COUNT would trim from the tail
// and so drop exactly the custom entries, silently undoing the setting for
// anyone who left geo-relay discovery on: the UI would report the relay added
// and it would never be contacted. Sized to hold both halves.
const MAX_OVERRIDE_RELAY_COUNT = GEO_RELAY_COUNT + MAX_CUSTOM_RELAYS;

// How long to wait for a publish ACK from at least one relay.
const PUBLISH_TIMEOUT_MS = 8_000;

// Ceiling on a one-shot read (querySync / get). Without it these resolve only
// once every relay has sent EOSE, which never happens on a connection that went
// away without closing - the case where you walk out of Wi-Fi range mid-request.
// The promise would then never settle, and any UI awaiting it stays in its
// loading state for the rest of the session with no way back. Returning
// whatever arrived inside the window is both bounded and honest: these reads
// are best-effort lookups across a relay set that is never guaranteed complete.
const QUERY_MAX_WAIT_MS = 6_000;

// How long the inbound pump may run handlers before handing the thread back.
// Under a 16 ms frame, so a full queue costs at most part of one frame's budget
// rather than every frame until it is empty.
const PUMP_SLICE_MS = 8;

// Queue ceiling for that pump. Sized well above any honest burst (a cold start
// with five cells backfilling is low hundreds), so reaching it means a relay is
// flooding us and the right answer is to stop accepting rather than to grow.
const MAX_PENDING_EVENTS = 4_000;

// Placeholder passed to a queued EOSE callback, which takes no event but shares
// the queue so it keeps its place in line.
const EOSE_MARKER = {} as Event;

export interface NostrClientConfig {
  // Relay URLs to connect to (merged with default DM relays).
  relays?: string[];
  // Called whenever the set of live relay connections crosses the has-any /
  // has-none boundary, so the UI can reflect whether the internet bridge is up.
  onConnectionChange?: (connected: boolean) => void;
}

export interface PublishResult {
  relay: string;
  ok: boolean;
  message?: string;
}

export type EventHandler = (event: Event) => void;
export type EoseHandler = () => void;

export class NostrClient {
  private readonly pool: SimplePool;
  private readonly relays: string[];
  private readonly onConnectionChange?: (connected: boolean) => void;
  // Last reported connectivity, so we only notify on an actual transition.
  private connected = false;
  // Inbound handler queue and its drain flag. See the pump below.
  private readonly pending: [EventHandler, Event][] = [];
  private draining = false;

  constructor(config: NostrClientConfig = {}) {
    this.onConnectionChange = config.onConnectionChange;
    // enableReconnect: relays that drop (or whose first connect fails, e.g. when
    // the pool is primed for Tor before Arti is ready) retry with backoff and
    // re-open their subscriptions, so the transport self-heals without a manual
    // resubscribe. See tor-routing.ts, which rebuilds this pool on a Tor toggle.
    this.pool = new SimplePool({ enableReconnect: true });
    // The pool tells us as relays connect and drop (set as properties: the
    // SimplePool constructor doesn't accept these in its options). We translate
    // that into a single "any live relay" boolean for the caller.
    this.pool.onRelayConnectionSuccess = () => this.reconcileConnected();
    this.pool.onRelayConnectionFailure = () => this.reconcileConnected();

    // Merge caller-provided relays with the default DM relay set, deduplicated
    // and capped at MAX_RELAY_COUNT.
    const provided = (config.relays ?? [])
      .map(normalizeRelayUrl)
      .filter(Boolean) as string[];
    const defaults = DEFAULT_DM_RELAYS.map(normalizeRelayUrl).filter(
      Boolean,
    ) as string[];
    const merged = [...new Set([...provided, ...defaults])];
    this.relays = merged.slice(0, MAX_RELAY_COUNT);
  }

  // Active relay URLs (for diagnostics and UI).
  get activeRelays(): string[] {
    return [...this.relays];
  }

  // Whether any relay in the pool is currently live. Lets callers skip a doomed
  // publish (which would otherwise block a full PUBLISH_TIMEOUT_MS before
  // rejecting) and route straight to a mesh gateway uplink. Mirrors bitchat's
  // synchronous relaysConnected() check.
  get isConnected(): boolean {
    return this.connected;
  }

  // Recompute "any relay live" and notify only on a has-any / has-none flip, so
  // the UI's internet-bridge indicator tracks real connectivity without churn.
  private reconcileConnected(): void {
    const any = [...this.pool.listConnectionStatus().values()].some(Boolean);
    if (any !== this.connected) {
      this.connected = any;
      this.onConnectionChange?.(any);
    }
  }

  // Resolve an optional per-call relay override. Everything reaching here is
  // already a wss:// URL (the geo directory and the custom list both come
  // through validateRelayUrl); normalizeRelayUrl is the backstop for a caller
  // passing a bare hostname, the shape bitchat stores its directory in. An empty
  // or all-invalid override falls back to the default pool, so no caller can
  // accidentally publish to nothing.
  private resolveRelays(relays?: string[]): string[] {
    if (relays === undefined || relays.length === 0) return this.relays;
    const normalized = relays
      .map(normalizeRelayUrl)
      .filter(Boolean) as string[];
    return normalized.length > 0
      ? [...new Set(normalized)].slice(0, MAX_OVERRIDE_RELAY_COUNT)
      : this.relays;
  }

  // Subscribe to events matching the given filter.
  //
  // `relays` targets a specific relay set (e.g. the geohash-closest relays for a
  // location channel) instead of the default DM pool. This is what makes public
  // geohash channels interoperate with bitchat: both clients converge on the
  // same geographically-selected relays for a cell. Omit it for DM / gift-wrap
  // traffic, which uses the default pool.
  // Returns a closer function; call it to cancel the subscription.
  subscribe(
    filters: Filter[],
    onEvent: EventHandler,
    onEose?: EoseHandler,
    relays?: string[],
  ): SubCloser {
    const targets = this.resolveRelays(relays);
    // Every handler goes through the pump, so no subscription can hold the JS
    // thread for longer than one time slice however much a relay sends.
    const deliver = (event: Event): void => this.enqueue(onEvent, event);
    // EOSE queues behind the events it terminates rather than jumping them.
    // Nothing passes an onEose today, but "the backfill is complete" arriving
    // before the backfill would be a genuinely confusing thing to leave lying
    // around for whoever wires the first one up.
    const deliverEose =
      onEose === undefined
        ? undefined
        : (): void => this.enqueue(() => onEose(), EOSE_MARKER);
    // SimplePool.subscribeMany takes a single merged filter. Merge all filters
    // into one using OR semantics via the ids/kinds/authors fields approach:
    // for multiple filters we subscribe each separately and merge the closers.
    if (filters.length === 1) {
      return this.pool.subscribeMany(targets, filters[0], {
        onevent: deliver,
        oneose: deliverEose,
      });
    }
    const closers = filters.map((f) =>
      this.pool.subscribeMany(targets, f, { onevent: deliver }),
    );
    return {
      close: (reason?: string) => closers.forEach((c) => c.close(reason)),
    };
  }

  //
  // Relay traffic arrives on a WebSocket callback, so without this every
  // subscriber handler runs inline on the JS thread the instant an event lands. A
  // handler is not cheap here: it writes a zustand store (and so re-renders),
  // decrypts gift wraps, and walks the notices list. A burst - a cold start with
  // several cells backfilling at once, a busy cell, or simply a relay that
  // decides to send a lot - therefore ran as one unbroken block of JS with no
  // frame in between. The symptom is not a crash but a freeze: animations that
  // need JS between steps stop mid-loop, and taps queue up unanswered, which is
  // indistinguishable from a hang to the person holding the phone.
  //
  // So handlers are queued and drained in slices instead. Ordering is preserved,
  // nothing is dispatched from inside the socket callback, and the thread gets a
  // turn between slices, so the UI stays live under any inbound rate.
  //
  // What this does NOT cover, deliberately: nostr-tools verifies each event's
  // signature inside its own socket handler, before ours is reached. That cost
  // is bounded by asking for less (see the filters in geohash-channel-service),
  // not from here.
  private enqueue(handler: EventHandler, event: Event): void {
    // Back-pressure rather than unbounded growth. A queue this deep means we are
    // thousands of events behind, at which point the newest are the ones we can
    // most afford to drop: every subscription in the app backfills, so anything
    // missed comes back on the next one.
    if (this.pending.length >= MAX_PENDING_EVENTS) return;
    this.pending.push([handler, event]);
    this.scheduleDrain();
  }

  private scheduleDrain(): void {
    if (this.draining) return;
    this.draining = true;
    setTimeout(() => this.drain(), 0);
  }

  private drain(): void {
    const deadline = Date.now() + PUMP_SLICE_MS;
    while (this.pending.length > 0 && Date.now() < deadline) {
      const next = this.pending.shift();
      if (next === undefined) break;
      const [handler, event] = next;
      try {
        handler(event);
      } catch {
        // One malformed event must not stop the queue behind it. The handlers
        // parse attacker-supplied content, so a throw here is an expected
        // outcome rather than a bug worth taking the pump down for.
      }
    }
    this.draining = false;
    if (this.pending.length > 0) this.scheduleDrain();
  }

  // Publish an event. Resolves when at least one relay ACKs OK, or rejects after
  // PUBLISH_TIMEOUT_MS with no ACK. `relays` targets a specific relay set (see
  // subscribe); omit it for DM / gift-wrap traffic on the default pool.
  async publish(event: Event, relays?: string[]): Promise<PublishResult> {
    const targets = this.resolveRelays(relays);
    return new Promise<PublishResult>((resolve, reject) => {
      let resolved = false;
      const results: PublishResult[] = [];

      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          const anyOk = results.find((r) => r.ok);
          if (anyOk) {
            resolve(anyOk);
          } else {
            reject(new Error("Publish timeout: no relay ACK"));
          }
        }
      }, PUBLISH_TIMEOUT_MS);

      const promises = this.pool.publish(targets, event);
      targets.forEach((relay, i) => {
        promises[i]
          ?.then(() => {
            results.push({ relay, ok: true });
            if (!resolved) {
              resolved = true;
              clearTimeout(timer);
              resolve({ relay, ok: true });
            }
          })
          .catch((err: unknown) => {
            const msg = err instanceof Error ? err.message : String(err);
            results.push({ relay, ok: false, message: msg });
            // Every relay has now answered, and all of them refused. Settle on
            // that rather than holding the timer, the event and this closure for
            // the rest of the timeout: the answer cannot change, and the caller
            // is waiting to queue the message for a later retry.
            if (!resolved && results.length === targets.length) {
              resolved = true;
              clearTimeout(timer);
              reject(new Error("Publish rejected by every relay"));
            }
          });
      });
    });
  }

  // Fetch a single event by its ID (queries all relays, returns first found).
  async fetchEvent(id: string): Promise<Event | null> {
    return this.pool.get(
      this.relays,
      { ids: [id] },
      { maxWait: QUERY_MAX_WAIT_MS },
    );
  }

  // Query relays and collect all matching events up to eose.
  async queryEvents(filter: Filter): Promise<Event[]> {
    return this.pool.querySync(this.relays, filter, {
      maxWait: QUERY_MAX_WAIT_MS,
    });
  }

  // Close all relay connections. ALL of them, not just the default set.
  //
  // Not `pool.close(this.relays)`, which closes only the URLs it is handed.
  // `this.relays` is the merged DM set, capped at five, so that leaves behind
  // every socket opened through a per-call relay override: each geohash cell the
  // user has opened, and every bridge rendezvous cell. Those are exactly the
  // relays that know the most about where somebody is.
  //
  // The consequences were all in the wrong direction. Turning the internet off
  // left them connected while the Mesh tab reported no relay. Going Away left
  // them connected over a stopped mesh. A panic wipe left them connected. And
  // enabling Tor rebuilt the DM pool on the Tor socket while those sockets
  // stayed on the clear net, holding the device's real IP open to the relays it
  // had just been bridging through, which is the one thing the toggle exists to
  // stop. nostr-tools keeps a relay alive until it is closed explicitly and its
  // idle pruning is never invoked, so nothing collected them.
  //
  // `destroy()` closes every relay the pool holds and empties its map, which is
  // what "close" was always meant to mean here. The client is single-use either
  // way: every caller builds a fresh one rather than reopening this.
  close(): void {
    this.pool.destroy();
    // Anything still queued belongs to subscriptions that have just gone away,
    // and its handlers close over a transport this client no longer owns. A
    // pending drain finds an empty queue and stops.
    this.pending.length = 0;
  }
}

// Ensure a relay URL starts with wss:// or ws://, and strip a trailing slash.
// Looser than validateRelayUrl by design, not a second copy of it: this is the
// last step before a socket, where the only question is whether there is a URL
// to open. Whether a host may be pinned at all is answered once, at entry.
function normalizeRelayUrl(url: string): string | null {
  const trimmed = url.trim().replace(/\/$/, "");
  if (trimmed.startsWith("wss://") || trimmed.startsWith("ws://")) {
    return trimmed;
  }
  // Accept bare hostnames by adding wss://
  if (!trimmed.includes("://") && trimmed.length > 0) {
    return `wss://${trimmed}`;
  }
  return null;
}
