// The internet: a set of Nostr relays that exist only in this process.
//
// The seam is `useWebSocketImplementation`, which nostr-tools exposes precisely
// so the socket can be swapped (Airhop already uses it to route through Tor).
// Installing a virtual socket instead of stubbing NostrClient means EVERYTHING
// above the wire runs for real: the actual SimplePool, its actual reconnect and
// backoff, actual subscription bookkeeping, actual REQ/EVENT/OK/EOSE framing,
// actual gift-wrap encryption. The only fiction is that the bytes never leave
// the process.
//
// That distinction matters more than it looks. A mocked NostrClient would agree
// with Airhop about what a subscription is. A relay that speaks NIP-01 badly -
// dropping an OK, never sending EOSE, delivering an event twice, going away
// mid-subscription - disagrees in exactly the ways real relays do, and those
// are the disagreements that produce duplicate messages and stuck spinners.

import type { Prng } from "./prng";
import type { World } from "./world";

export interface NostrEventLike {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

interface Filter {
  ids?: string[];
  authors?: string[];
  kinds?: number[];
  since?: number;
  until?: number;
  limit?: number;
  [tagQuery: string]: unknown;
}

export interface RelayConditions {
  // The relay refuses connections outright.
  down: boolean;
  // One-way delivery delay.
  latencyMs: number;
  // Probability a published event is accepted and then quietly not stored.
  // Relays do this under load, and it is indistinguishable from success at the
  // sender.
  swallowPublish: number;
  // Probability an event is delivered twice to a subscriber.
  duplicate: number;
  // Never send EOSE. A client that waits for it before rendering hangs.
  withholdEose: boolean;
  // Accept the EVENT but never send OK. A publisher awaiting an ack must time
  // out rather than wedge.
  withholdOk: boolean;
}

const DEFAULT_CONDITIONS: RelayConditions = {
  down: false,
  latencyMs: 40,
  swallowPublish: 0,
  duplicate: 0,
  withholdEose: false,
  withholdOk: false,
};

interface Subscription {
  id: string;
  filters: Filter[];
  socket: VirtualSocket;
}

class Relay {
  readonly events: NostrEventLike[] = [];
  readonly subs = new Set<Subscription>();
  conditions: RelayConditions = { ...DEFAULT_CONDITIONS };
  readonly sockets = new Set<VirtualSocket>();

  constructor(readonly url: string) {}
}

function matches(filter: Filter, event: NostrEventLike): boolean {
  if (filter.ids !== undefined && !filter.ids.includes(event.id)) return false;
  if (filter.authors !== undefined && !filter.authors.includes(event.pubkey)) {
    return false;
  }
  if (filter.kinds !== undefined && !filter.kinds.includes(event.kind)) {
    return false;
  }
  if (filter.since !== undefined && event.created_at < filter.since)
    return false;
  if (filter.until !== undefined && event.created_at > filter.until)
    return false;
  for (const key of Object.keys(filter)) {
    if (!key.startsWith("#")) continue;
    const wanted = filter[key] as string[];
    const tagName = key.slice(1);
    const has = event.tags.some(
      (t) => t.length >= 2 && t[0] === tagName && wanted.includes(t[1]),
    );
    if (!has) return false;
  }
  return true;
}

// ---- the socket ----

class VirtualSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readyState = 0;
  onopen: (() => void) | null = null;
  onmessage: ((ev: { data: string }) => void) | null = null;
  onerror: ((ev?: unknown) => void) | null = null;
  onclose: ((ev?: unknown) => void) | null = null;

  private relay: Relay | null = null;
  private readonly mySubs = new Set<Subscription>();

  constructor(
    readonly url: string,
    private readonly fabric: RelayFabric,
    readonly deviceID: string,
  ) {
    // Connection is asynchronous, as it is on a real network. Code that assumes
    // a socket is usable on the line after construction is wrong.
    setTimeout(() => this.settleConnect(), 5);
  }

  private settleConnect(): void {
    const relay = this.fabric.relayFor(this.url, this.deviceID);
    if (relay === null || relay.conditions.down) {
      this.readyState = VirtualSocket.CLOSED;
      this.fabric.note("RELAY_REFUSED", `${this.deviceID} -> ${this.url}`);
      this.onerror?.();
      this.onclose?.({ code: 1006, reason: "refused" });
      return;
    }
    this.relay = relay;
    relay.sockets.add(this);
    this.readyState = VirtualSocket.OPEN;
    this.fabric.note("RELAY_OPEN", `${this.deviceID} -> ${this.url}`);
    this.onopen?.();
  }

  send(raw: string): void {
    if (this.readyState !== VirtualSocket.OPEN || this.relay === null) return;
    let msg: unknown[];
    try {
      msg = JSON.parse(raw) as unknown[];
    } catch {
      return;
    }
    const verb = msg[0];
    if (verb === "EVENT") {
      this.handleEvent(msg[1] as NostrEventLike);
    } else if (verb === "REQ") {
      this.handleReq(msg[1] as string, msg.slice(2) as Filter[]);
    } else if (verb === "CLOSE") {
      this.handleClose(msg[1] as string);
    }
  }

  private handleEvent(event: NostrEventLike): void {
    const relay = this.relay;
    if (relay === null) return;
    const swallowed = this.fabric.roll(relay.conditions.swallowPublish);
    this.fabric.publishCount++;

    if (!relay.conditions.withholdOk) {
      this.fabric.later(relay.conditions.latencyMs, () => {
        this.deliver(JSON.stringify(["OK", event.id, true, ""]));
      });
    }
    if (swallowed) {
      this.fabric.note(
        "RELAY_SWALLOWED",
        `${relay.url} ate ${event.id.slice(0, 8)}`,
      );
      return;
    }
    if (relay.events.some((e) => e.id === event.id)) return;
    relay.events.push(event);
    this.fabric.later(relay.conditions.latencyMs, () => {
      this.fabric.fanout(relay, event);
    });
  }

  private handleReq(subID: string, filters: Filter[]): void {
    const relay = this.relay;
    if (relay === null) return;
    const sub: Subscription = { id: subID, filters, socket: this };
    relay.subs.add(sub);
    this.mySubs.add(sub);

    // Stored events first, then EOSE, exactly as a relay does.
    const stored = relay.events.filter((e) =>
      filters.some((f) => matches(f, e)),
    );
    this.fabric.later(relay.conditions.latencyMs, () => {
      for (const e of stored) {
        this.deliver(JSON.stringify(["EVENT", subID, e]));
      }
      if (!relay.conditions.withholdEose) {
        this.deliver(JSON.stringify(["EOSE", subID]));
      }
    });
  }

  private handleClose(subID: string): void {
    for (const sub of [...this.mySubs]) {
      if (sub.id !== subID) continue;
      this.relay?.subs.delete(sub);
      this.mySubs.delete(sub);
    }
  }

  deliver(raw: string): void {
    if (this.readyState !== VirtualSocket.OPEN) return;
    this.onmessage?.({ data: raw });
  }

  // The relay went away without a close frame, which is what actually happens
  // when a phone loses signal.
  killFromRelay(): void {
    if (this.readyState === VirtualSocket.CLOSED) return;
    this.readyState = VirtualSocket.CLOSED;
    this.relay?.sockets.delete(this);
    for (const sub of this.mySubs) this.relay?.subs.delete(sub);
    this.mySubs.clear();
    this.relay = null;
    this.onclose?.({ code: 1006, reason: "connection lost" });
  }

  close(): void {
    if (this.readyState === VirtualSocket.CLOSED) return;
    this.readyState = VirtualSocket.CLOSED;
    this.relay?.sockets.delete(this);
    for (const sub of this.mySubs) this.relay?.subs.delete(sub);
    this.mySubs.clear();
    this.relay = null;
    this.onclose?.({ code: 1000, reason: "" });
  }
}

// ---- the fabric ----

export class RelayFabric {
  private readonly relays = new Map<string, Relay>();
  private readonly rng: Prng;
  // Devices cut off from the internet entirely (aeroplane mode), and devices
  // cut off from a SUBSET of relays (a partition).
  private readonly offline = new Set<string>();
  private readonly partitions = new Map<string, Set<string>>();
  private disposed = false;

  publishCount = 0;
  deliveryCount = 0;

  constructor(private readonly world: World) {
    this.rng = world.rng.fork("relay");
    world.onClose(() => {
      this.disposed = true;
    });
  }

  // The class handed to `useWebSocketImplementation` inside a device sandbox.
  socketClassFor(deviceID: string): unknown {
    const fabric = this;
    return class BoundSocket extends VirtualSocket {
      constructor(url: string) {
        super(url, fabric, deviceID);
      }
    };
  }

  note(kind: string, detail?: string): void {
    this.world.say(kind, detail);
  }

  roll(p: number): boolean {
    return this.rng.chance(p);
  }

  later(ms: number, fn: () => void): void {
    setTimeout(
      () => {
        if (!this.disposed) fn();
      },
      Math.max(1, ms),
    );
  }

  // Which relay, if any, this device can reach at this URL right now.
  relayFor(url: string, deviceID: string): Relay | null {
    if (this.offline.has(deviceID)) return null;
    const allowed = this.partitions.get(deviceID);
    if (allowed !== undefined && !allowed.has(url)) return null;
    let relay = this.relays.get(url);
    if (relay === undefined) {
      relay = new Relay(url);
      this.relays.set(url, relay);
    }
    return relay;
  }

  fanout(relay: Relay, event: NostrEventLike): void {
    for (const sub of [...relay.subs]) {
      if (!sub.filters.some((f) => matches(f, event))) continue;
      this.deliveryCount++;
      sub.socket.deliver(JSON.stringify(["EVENT", sub.id, event]));
      if (this.rng.chance(relay.conditions.duplicate)) {
        this.note("RELAY_DUPLICATED", `${relay.url} ${event.id.slice(0, 8)}`);
        sub.socket.deliver(JSON.stringify(["EVENT", sub.id, event]));
      }
    }
  }

  // ---- faults ----

  setOffline(deviceID: string, offline: boolean): void {
    if (offline) {
      this.offline.add(deviceID);
      for (const relay of this.relays.values()) {
        for (const socket of [...relay.sockets]) {
          if (socket.deviceID === deviceID) socket.killFromRelay();
        }
      }
      this.world.say("INTERNET_LOST", deviceID);
    } else {
      this.offline.delete(deviceID);
      this.world.say("INTERNET_BACK", deviceID);
    }
  }

  // Restrict a device to a subset of relay URLs. Two disjoint subsets is a
  // network partition: both halves work, neither sees the other.
  setPartition(deviceID: string, allowedUrls: string[] | null): void {
    if (allowedUrls === null) {
      this.partitions.delete(deviceID);
    } else {
      this.partitions.set(deviceID, new Set(allowedUrls));
      for (const relay of this.relays.values()) {
        if (allowedUrls.includes(relay.url)) continue;
        for (const socket of [...relay.sockets]) {
          if (socket.deviceID === deviceID) socket.killFromRelay();
        }
      }
    }
    this.world.say(
      "PARTITION",
      `${deviceID} -> ${allowedUrls === null ? "all relays" : allowedUrls.join(",")}`,
    );
  }

  setRelayConditions(url: string, partial: Partial<RelayConditions>): void {
    const relay = this.relayFor(url, "__fabric__");
    if (relay === null) return;
    relay.conditions = { ...relay.conditions, ...partial };
    if (partial.down === true) {
      for (const socket of [...relay.sockets]) socket.killFromRelay();
    }
    this.world.say("RELAY_CONDITIONS", `${url} ${JSON.stringify(partial)}`);
  }

  setAllRelayConditions(partial: Partial<RelayConditions>): void {
    for (const url of this.relays.keys()) this.setRelayConditions(url, partial);
  }

  // ---- introspection ----

  relayUrls(): string[] {
    return [...this.relays.keys()];
  }

  eventsOn(url: string): NostrEventLike[] {
    return [...(this.relays.get(url)?.events ?? [])];
  }

  allEvents(): NostrEventLike[] {
    const seen = new Map<string, NostrEventLike>();
    for (const relay of this.relays.values()) {
      for (const e of relay.events) seen.set(e.id, e);
    }
    return [...seen.values()];
  }

  eventsOfKind(kind: number): NostrEventLike[] {
    return this.allEvents().filter((e) => e.kind === kind);
  }

  // Every relay a device is currently connected to.
  connectionCount(deviceID: string): number {
    let n = 0;
    for (const relay of this.relays.values()) {
      for (const socket of relay.sockets) {
        if (socket.deviceID === deviceID) n++;
      }
    }
    return n;
  }
}
