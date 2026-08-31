// The one place that decides whether the LAN transport should be running, and
// makes reality match.
//
// Same reconciler as wifi-controller.ts, and for the same reasons: a DESIRED
// state, an OBSERVED outcome, one idempotent pass that closes the gap, and a
// retry when it cannot. Read that file for why one fire-and-forget start call
// is not enough.
//
// Two things differ from the other transports.
//
// Consent. This does not run because the mesh is running; it runs when the user
// turns it on. An mDNS record is cleartext to the whole network and is logged by
// ordinary infrastructure, which on a workplace or venue network is an
// attendance list, so `setEnabled` gates everything and defaults to off.
//
// Dialling. mDNS returns the whole network, so who to connect to is a decision
// rather than a consequence. lan-dial-policy.ts makes it; native opens the
// sockets it is told to.

import NativeAirhopLAN from "@bridge/NativeAirhopLAN";
import type { LanState } from "@store/mesh-state-store";
import { dialTargets } from "./lan-dial-policy";

// Retry schedule for a start that was refused. Matches the WiFi ladder: nothing
// the user is looking at depends on this transport, so being a few seconds late
// costs nothing and polling a network interface in a pocket is not free.
const BACKOFF_MS = [500, 1500, 4000, 10_000, 30_000] as const;

// How long to wait after a discovery before dialling.
//
// mDNS answers arrive in a burst, one per device. Dialling on the first means
// planning a ring of two, then replanning as each further answer lands.
// Settling first costs half a second nobody is watching and produces one
// correct plan instead of N wrong ones.
const DISCOVERY_SETTLE_MS = 500;

// How often to walk the dial plan again while the transport is running.
//
// A TCP link can drop while the peer's mDNS record stays visible, which is no
// discovery change at all, so without this a hiccup loses that peer until it
// restarts. Matched to the gossip sync interval. Re-dialling a live peer is
// free: `connectToPeer` is idempotent, and which names are linked stays with
// native.
const DIAL_REVIEW_MS = 15_000;

// Rejection codes the native modules use. A union rather than message text:
// wording is a UI concern and control flow that reads it breaks the first time
// somebody rewords it.
type LanFailure =
  // No mDNS stack, or an OS below the floor. Permanent.
  | "unsupported"
  // No network, or not on WiFi. Clears on its own.
  | "unavailable"
  // Local network access refused. Android asks at runtime; on iOS the prompt is
  // raised by browsing and a refusal is only reversible in Settings.
  | "permission"
  // Anything else. Treated as transient, having nothing better to assume.
  | "transient";

function classify(error: unknown): LanFailure {
  const code = (error as { code?: string } | undefined)?.code;
  switch (code) {
    case "LAN_UNSUPPORTED":
      return "unsupported";
    case "LAN_UNAVAILABLE":
      return "unavailable";
    case "PERMISSION_DENIED":
      return "permission";
    default:
      return "transient";
  }
}

// A name to publish on the network, good for one publishing session.
//
// Never the peer ID, which is derived from the long-term Noise key and never
// changes: publishing it in a record every network logs would let anyone
// holding logs from two networks link them. Sixteen random hex characters carry
// no history and collide rarely enough that mDNS never renames us.
//
// Called for every start, not once per process. A phone carried from an office
// to a cafe stops and starts on the way, and one name across both would hand an
// observer the link this denies.
export function newInstanceName(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
}

export class LANController {
  // A factory rather than a name: one is minted per publishing session, so the
  // same phone on two networks is two unrelated records. See newInstanceName.
  constructor(
    private readonly makeInstanceName: () => string,
    private readonly onState?: (state: LanState) => void,
  ) {}

  // What we are currently published as, and what the ring sorts on. Empty until
  // the first start.
  private instanceName = "";

  private reported: LanState = "off";

  private report(state: LanState): void {
    if (state === this.reported) return;
    this.reported = state;
    this.onState?.(state);
  }

  // The user's switch. Everything else is downstream of this.
  private enabled = false;
  // Whether the mesh as a whole is running. Both must be true.
  private meshRunning = false;
  private started = false;
  private unsupported = false;
  private lastFailure: LanFailure | null = null;

  // Everyone mDNS currently sees, by the name they publish. A name is the only
  // address this layer needs: the ring sorts on it and native dials by it.
  private readonly discovered = new Set<string>();
  // Dials currently in flight, so a pass that lands while one is open does not
  // start a second. Emptied when each settles, either way: a name that stays
  // here after its dial finished is a peer that can never be dialled again.
  private readonly dialling = new Set<string>();

  private linkCount = 0;

  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private settleTimer: ReturnType<typeof setTimeout> | null = null;
  private reviewTimer: ReturnType<typeof setInterval> | null = null;
  private attempt = 0;
  private reconciling = false;
  private dirty = false;
  private disposed = false;
  // Bumped whenever intent changes under an in-flight start, so a resolve that
  // lands late cannot mark the transport started against an intent that has
  // already moved on. Same guard, and the same reason, as the WiFi controller.
  private generation = 0;

  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;
    this.enabled = enabled;
    if (!enabled) this.generation += 1;
    this.attempt = 0;
    void this.reconcile();
  }

  start(): void {
    this.meshRunning = true;
    this.attempt = 0;
    void this.reconcile();
  }

  stop(): void {
    this.meshRunning = false;
    this.generation += 1;
    this.clearTimers();
    void this.reconcile();
  }

  // The world may have moved: the app was resumed, a permission was granted,
  // the phone joined a different network.
  refresh(): void {
    if (this.unsupported) return;
    this.attempt = 0;
    void this.reconcile();
  }

  // Native saw the network go away or come back.
  //
  // Losing it is the case that is otherwise unrecoverable: the listener and the
  // browser are dead but the module still holds its handles, so every later
  // start resolves instantly having done nothing. Forgetting that belief here
  // is what lets the next pass do real work.
  onAvailabilityChanged(available: boolean): void {
    if (this.unsupported) return;
    if (!available) {
      this.started = false;
      this.generation += 1;
      this.forgetNetwork();
      void NativeAirhopLAN?.stopLAN().catch(() => {});
      this.attempt = 0;
      this.scheduleRetry();
      return;
    }
    this.attempt = 0;
    void this.reconcile();
  }

  // How many LAN links the registry holds. The controller owns what the Mesh
  // tab says, and this is the one input it cannot observe: links are reported
  // to mesh-service, not here. Same shape as WiFiController.setPairedCount.
  //
  // "searching" rather than "nothing here" while the count is zero: client
  // isolation is on by default at most venues and cannot be detected before
  // trying, so an empty network and a network that forbids peer traffic look
  // identical from inside the app.
  setLinkCount(count: number): void {
    if (this.linkCount === count) return;
    this.linkCount = count;
    if (this.started && this.wanted) {
      this.report(count > 0 ? "active" : "searching");
    }
  }

  onPeerDiscovered(serviceName: string): void {
    if (serviceName === this.instanceName) return;
    if (this.discovered.has(serviceName)) return;
    this.discovered.add(serviceName);
    this.scheduleSettle();
  }

  onPeerLost(serviceName: string): void {
    this.discovered.delete(serviceName);
    this.dialling.delete(serviceName);
    this.scheduleSettle();
  }

  dispose(): void {
    this.disposed = true;
    this.generation += 1;
    this.clearTimers();
    this.enabled = false;
    this.meshRunning = false;
    if (this.started) void this.releaseNative();
  }

  private clearTimers(): void {
    if (this.retryTimer !== null) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.settleTimer !== null) {
      clearTimeout(this.settleTimer);
      this.settleTimer = null;
    }
    if (this.reviewTimer !== null) {
      clearInterval(this.reviewTimer);
      this.reviewTimer = null;
    }
  }

  private forgetNetwork(): void {
    this.discovered.clear();
    this.dialling.clear();
    this.linkCount = 0;
  }

  private scheduleRetry(): void {
    if (this.disposed || !this.wanted) return;
    if (this.retryTimer !== null) return;
    const delay = BACKOFF_MS[Math.min(this.attempt, BACKOFF_MS.length - 1)];
    this.attempt++;
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      void this.reconcile();
    }, delay);
  }

  private scheduleSettle(): void {
    if (this.disposed || this.settleTimer !== null) return;
    this.settleTimer = setTimeout(() => {
      this.settleTimer = null;
      this.dialPlanned();
    }, DISCOVERY_SETTLE_MS);
  }

  private get wanted(): boolean {
    return this.enabled && this.meshRunning;
  }

  // Open the links the ring says are ours to open.
  //
  // Runs on every arrival and departure, and again on a timer, so a link that
  // dropped while its peer stayed visible is reopened. Native is idempotent, so
  // a peer already linked costs one resolved call.
  private dialPlanned(): void {
    if (!this.started || !this.wanted) return;
    const targets = dialTargets(this.instanceName, [...this.discovered]);
    for (const name of targets) {
      if (this.dialling.has(name)) continue;
      this.dialling.add(name);
      const settle = (): void => {
        this.dialling.delete(name);
      };
      NativeAirhopLAN?.connectToPeer(name).then(settle, () => {
        // A refused connect is usually client isolation, which never clears,
        // but it can also be a peer that has not finished opening its listener.
        // Either way the next review asks again; the cost of asking is one
        // rejected promise.
        settle();
      });
    }
  }

  private scheduleReview(): void {
    if (this.disposed || this.reviewTimer !== null) return;
    this.reviewTimer = setInterval(() => {
      this.dialPlanned();
    }, DIAL_REVIEW_MS);
  }

  private async reconcile(): Promise<void> {
    if (this.disposed) return;
    if (this.reconciling) {
      this.dirty = true;
      return;
    }
    this.reconciling = true;
    try {
      do {
        this.dirty = false;
        await this.reconcileOnce();
      } while (this.dirty && !this.disposed);
    } finally {
      this.reconciling = false;
    }
  }

  private async reconcileOnce(): Promise<void> {
    const generation = this.generation;

    // No module at all: a build without the native side. Latched, so a device
    // with no LAN transport is asked once and never polled again.
    if (NativeAirhopLAN === null || NativeAirhopLAN === undefined) {
      this.unsupported = true;
      this.report("unsupported");
      return;
    }

    if (!this.wanted) {
      if (this.started) await this.releaseNative();
      this.report("off");
      return;
    }

    if (this.unsupported) return;
    if (this.started) return;

    // A fresh name for this session. Anything discovered under the old one is
    // stale by definition: we were not on this network when it was published.
    this.instanceName = this.makeInstanceName();
    this.forgetNetwork();

    try {
      await NativeAirhopLAN.startLAN(this.instanceName);
    } catch (error) {
      const failure = classify(error);
      this.lastFailure = failure;
      if (failure === "unsupported") {
        this.unsupported = true;
        this.report("unsupported");
        return;
      }
      this.report(failure === "permission" ? "permission" : "unavailable");
      this.scheduleRetry();
      return;
    }

    // Intent moved while the start was in flight, so this result is stale.
    if (generation !== this.generation) {
      await this.releaseNative();
      return;
    }

    this.started = true;
    this.lastFailure = null;
    this.attempt = 0;
    this.report(this.linkCount > 0 ? "active" : "searching");

    // `stop()` and `dispose()` are synchronous and can land while the start
    // above is in flight. Release here rather than deferring to the loop, which
    // does not run again once disposed.
    if (!this.wanted || this.disposed) {
      await this.releaseNative();
      return;
    }

    // Anything discovered while starting still needs dialling, and from here on
    // the plan is walked again periodically.
    this.scheduleSettle();
    this.scheduleReview();
  }

  private async releaseNative(): Promise<void> {
    this.started = false;
    this.forgetNetwork();
    try {
      await NativeAirhopLAN?.stopLAN();
    } catch {
      // Best effort. The sockets go with the process either way, and a refused
      // stop must not leave `started` claiming a live transport.
    }
  }

  get isStarted(): boolean {
    return this.started;
  }

  get isUnsupported(): boolean {
    return this.unsupported;
  }

  get failure(): LanFailure | null {
    return this.lastFailure;
  }

  // Peers currently visible on the network, for the Mesh tab's neutral note.
  get discoveredCount(): number {
    return this.discovered.size;
  }
}
