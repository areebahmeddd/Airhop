// Mesh bridge: stitch separate BLE mesh islands together over the internet.
//
// While bridging, this device republishes its public #bluetooth mesh messages
// to a geohash-cell rendezvous on Nostr (a signed, unlinkable per-cell identity;
// see bridge-event.ts). A separate island subscribed to the same cell renders
// those into its own #bluetooth timeline, so two crowds out of Bluetooth range
// share one public chat. Mesh-only peers (no internet) reach the rendezvous
// through a nearby bridge peer via toBridge/fromBridge carriers.
//
// This mirrors bitchat BridgeService's design (rendezvous events, three loop
// caches, per-role rate limits) but leans on Airhop infrastructure and keeps the
// dedup simple: both the radio copy and the bridged copy key the timeline row on
// the same content-derived stable ID, so duplicates collapse in either arrival
// order without bitchat's alias-removal bookkeeping.
//
// Scope note: the rendezvous covers the device's own geohash-6 cell only.
// Boundary-neighbor coverage (subscribing to adjacent cells) is a future
// refinement; two islands in the same ~1.2 km cell meet today.

import { verifyEvent, type Event as NostrEvent } from "nostr-tools";
import {
  CarrierDirection,
  encodeNostrCarrier,
  type NostrCarrierPacket,
} from "../core/mesh/nostr-carrier";
import {
  bridgeStableID,
  createBridgeMeshEvent,
  createBridgePresenceEvent,
  parseBridgeEvent,
} from "../core/nostr/bridge-event";
import {
  GEO_RELAY_COUNT,
  GeoRelayDirectory,
  mergeGeoRelays,
} from "../core/nostr/geo-relay";
import { loadGeoRelays } from "../core/nostr/geo-relay-source";
import {
  deriveGeohashIdentity,
  deriveGeohashSeed,
  geohashDisplayName,
  type GeohashIdentity,
} from "../core/nostr/geohash-identity";
import type { NostrClient } from "../core/nostr/nostr-client";
import { decodeGeohash, encodeGeohash } from "../core/nostr/presence";
import { useSettingsStore } from "../store/settings-store";
import { getCoarseLocation } from "./location-service";

// Geohash precision of the rendezvous cell (~1.2 km neighborhood), matching
// bitchat BridgeService.Limits.cellPrecision.
export const CELL_PRECISION = 6;
// Relays to publish/subscribe per cell. Shared with the geohash channels so
// both converge on the same rendezvous set.
const RELAY_COUNT = GEO_RELAY_COUNT;
// Reject rendezvous events outside this clock skew (matches the gateway path).
export const MAX_EVENT_AGE_SECONDS = 15 * 60;
// A rendezvous participant counts toward "across the bridge" for this long.
export const PARTICIPANT_TTL_MS = 10 * 60 * 1000;
// Airtime budget for downlink rebroadcasts (per rolling minute).
export const DOWNLINK_EVENTS_PER_MINUTE = 20;
// Uplink deposits accepted per depositor per rolling minute.
export const UPLINK_EVENTS_PER_MINUTE_PER_DEPOSITOR = 10;
// Minimum spacing between our own presence heartbeats.
const PRESENCE_MIN_INTERVAL_MS = 30_000;
export const ID_SET_CAP = 512;

// A remote-island message to render into the local #bluetooth timeline.
export interface BridgeInboundMessage {
  id: string; // stable timeline id (collapses radio + bridge copies)
  senderKey: string; // `nostr_<pubkey>` of the rendezvous author
  nickname: string;
  text: string;
  timestampMs: number;
}

export interface BridgeStatus {
  active: boolean; // bridging with a known cell
  cell?: string;
  peopleAcross: number;
}

// Wiring supplied by MeshService.
export interface BridgeHooks {
  // Render a remote-island message into the #bluetooth timeline.
  injectMessage(msg: BridgeInboundMessage): void;
  // A reachable peer advertising the bridge capability, or undefined.
  firstReachableBridge(): { peerID: string } | undefined;
  // A rendezvous cell advertised by a reachable bridge peer (ANNOUNCE TLV 0x06),
  // used when we have no location of our own.
  advertisedBridgeCell(): string | undefined;
  // Send a directed, signed toBridge carrier to a bridge peer.
  sendCarrierToBridge(payload: Uint8Array, peerID: string): void;
  // Broadcast a fromBridge carrier onto the mesh (unsigned; receivers verify the
  // carried event's own signature).
  broadcastCarrierFromBridge(payload: Uint8Array): void;
  // Whether any Nostr relay is currently live.
  relaysConnected(): boolean;
  // Our nickname, for outgoing rendezvous events.
  nickname(): string;
  // Report status changes so the banner/header can react.
  onStatus(status: BridgeStatus): void;
}

export class BridgeService {
  private readonly relayDirectory = new GeoRelayDirectory();
  private readonly seed: Uint8Array;
  private enabled = false;
  private activeCell: string | null = null;
  private subscription: { close: () => void } | null = null;
  private subscribedCell: string | null = null;
  private readonly identityCache = new Map<string, GeohashIdentity>();

  // Loop prevention (mirrors the gateway's three caches).
  private readonly publishedEventIDs = new Set<string>(); // our own published events
  private readonly receivedEventIDs = new Set<string>(); // acted-on once
  private readonly rebroadcastEventIDs = new Set<string>(); // ferried to mesh once
  private readonly seenRadioStableIDs = new Set<string>(); // radio copies present

  // Rate limiting.
  private readonly uplinkDepositTimes = new Map<string, number[]>();
  private downlinkSendTimes: number[] = [];

  // "People across the bridge" accounting.
  private readonly participants = new Map<string, number>(); // pubkey -> lastSeenMs
  private presenceTimer: ReturnType<typeof setTimeout> | null = null;
  private lastPresenceAtMs = 0;

  constructor(
    private readonly client: NostrClient,
    signingPrivKey: Uint8Array,
    private readonly hooks: BridgeHooks,
  ) {
    this.seed = deriveGeohashSeed(signingPrivKey);
    this.relayDirectory.loadEntries(loadGeoRelays());
  }

  // ---- Lifecycle ------------------------------------------------------------

  setEnabled(enabled: boolean): void {
    if (enabled === this.enabled) return;
    this.enabled = enabled;
    if (enabled) {
      void this.refresh();
      this.armPresenceTimer();
    } else {
      this.teardown();
    }
  }

  // Resolve the rendezvous cell and (re)open its subscription. Safe to call
  // repeatedly; only re-subscribes when the cell changes.
  async refresh(): Promise<void> {
    if (!this.enabled) return;
    const cell = await this.resolveCell();
    // Re-check after the await: resolveCell() can take seconds on a cold GPS
    // fix, and the user (or a Tor rebuild) may have disabled the bridge in that
    // window. Without this, teardown would run and then this stale call would
    // re-open a relay subscription while disabled, leaking it for the session.
    if (!this.enabled) return;
    if (cell !== this.activeCell) {
      this.activeCell = cell;
      this.resubscribe(cell);
    }
    this.emitStatus();
    this.publishPresence();
  }

  private async resolveCell(): Promise<string | null> {
    const coords = await getCoarseLocation();
    if (coords !== null) {
      return encodeGeohash(coords.lat, coords.lng, CELL_PRECISION);
    }
    // No location of our own: fall back to a cell a nearby bridge advertises,
    // so a mesh-only peer can still deposit into the right rendezvous.
    const advertised = this.hooks.advertisedBridgeCell();
    return advertised !== undefined && advertised.length > 0
      ? advertised.slice(0, CELL_PRECISION)
      : null;
  }

  private resubscribe(cell: string | null): void {
    this.subscription?.close();
    this.subscription = null;
    this.subscribedCell = null;
    // Everyone counted "across" was across the OLD cell. Carrying them into the
    // new one inflated the banner with people the user has just walked away
    // from, for as long as their ten-minute presence TTL had left to run.
    this.participants.clear();
    // And let the first heartbeat into the new cell go out immediately rather
    // than waiting out the rate limit from the old one, which left the device in
    // a cell nobody there could see it in for up to half a minute.
    this.lastPresenceAtMs = 0;
    if (cell === null) return;
    const relays = this.relaysForCell(cell);
    this.subscribedCell = cell;
    this.subscription = this.client.subscribe(
      [
        {
          kinds: [20000, 20001],
          "#r": [cell],
          since: Math.floor(Date.now() / 1000) - MAX_EVENT_AGE_SECONDS,
        },
      ],
      (event) => this.handleRendezvousEvent(event),
      undefined,
      relays,
    );
  }

  private teardown(): void {
    this.subscription?.close();
    this.subscription = null;
    this.subscribedCell = null;
    this.activeCell = null;
    this.participants.clear();
    if (this.presenceTimer !== null) {
      clearTimeout(this.presenceTimer);
      this.presenceTimer = null;
    }
    this.emitStatus();
  }

  stop(): void {
    this.teardown();
  }

  // The cell we advertise to mesh-only peers (ANNOUNCE TLV 0x06). Only when we
  // can actually serve: bridging, online, and with a known cell.
  advertisedBridgeGeohash(): string | undefined {
    if (
      this.enabled &&
      this.hooks.relaysConnected() &&
      this.activeCell !== null
    ) {
      return this.activeCell;
    }
    return undefined;
  }

  // ---- Outgoing (sender role) ----------------------------------------------

  // Compose and ship the bridged copy of an outgoing public #bluetooth message.
  // Call AFTER the radio send. `timestampMs` must equal the radio packet's
  // timestamp so the bridged copy and the radio copy derive the same stable ID.
  bridgeOutgoing(
    content: string,
    senderPeerID: string,
    timestampMs: number,
    nearbyOnly: boolean,
  ): void {
    if (!this.enabled || nearbyOnly) return;
    const cell = this.activeCell;
    if (cell === null || content.length === 0) return;
    const identity = this.identityFor(cell);
    const event = createBridgeMeshEvent({
      content,
      cell,
      privKey: identity.privKey,
      nickname: this.hooks.nickname(),
      meshSenderID: senderPeerID,
      meshTimestampMs: timestampMs,
    });
    this.remember(this.publishedEventIDs, event.id);
    // Our own radio copy is already on our timeline; note its stable ID so the
    // event coming back from our own subscription is recognised as a local copy.
    this.seenRadioStableIDs.add(
      bridgeStableID(senderPeerID, timestampMs, content),
    );
    if (this.hooks.relaysConnected()) {
      void this.client.publish(event, this.relaysForCell(cell)).catch(() => {});
    } else {
      this.uplinkViaBridgePeer(event, cell);
    }
  }

  private uplinkViaBridgePeer(event: NostrEvent, cell: string): void {
    const peer = this.hooks.firstReachableBridge();
    if (peer === undefined) return;
    const payload = this.encodeCarrier(CarrierDirection.TO_BRIDGE, cell, event);
    if (payload !== null) this.hooks.sendCarrierToBridge(payload, peer.peerID);
  }

  // ---- Radio-copy accounting -----------------------------------------------

  // Record a public #bluetooth radio message so a bridged copy of the same
  // message (same origin sender/timestamp/content) is not rendered twice.
  noteRadioMessage(
    senderIDHex: string,
    timestampMs: number,
    content: string,
  ): void {
    if (!this.enabled) return;
    this.remember(
      this.seenRadioStableIDs,
      bridgeStableID(senderIDHex, timestampMs, content),
    );
  }

  // ---- Subscription ingress (internet role) --------------------------------

  private handleRendezvousEvent(event: NostrEvent): void {
    if (!this.enabled) return;
    if (typeof event.id !== "string") return;
    // Only events for our subscribed cell, trusting the event's own signed r tag.
    const parsed = parseBridgeEvent(event);
    if (parsed === null || parsed.cell !== this.subscribedCell) return;
    // Skip our own events (both this-session cache and deterministic pubkey
    // self-recognition, so a relay backfill after a restart is still ours).
    if (this.publishedEventIDs.has(event.id)) return;
    if (this.isOwnEvent(event, parsed.cell)) {
      this.remember(this.publishedEventIDs, event.id);
      return;
    }
    if (!verifyEvent(event)) return;
    if (this.receivedEventIDs.has(event.id)) return;
    this.remember(this.receivedEventIDs, event.id);

    if (parsed.kind === "presence") {
      this.recordParticipant(event.pubkey);
      return;
    }

    const isLocalRadioCopy =
      parsed.radioMessageIDHint !== undefined &&
      this.seenRadioStableIDs.has(parsed.radioMessageIDHint);
    if (!isLocalRadioCopy) {
      this.injectRemote(event, parsed.content, parsed.nickname);
      this.recordParticipant(event.pubkey);
      this.maybeRebroadcast(event, parsed.cell);
    }
  }

  // Serving duty: carry a remote island's message onto the radio for mesh-only
  // peers, within the airtime budget. Local-origin events are never rebroadcast
  // (they are already on this island's radio).
  private maybeRebroadcast(event: NostrEvent, cell: string): void {
    if (
      this.rebroadcastEventIDs.has(event.id) ||
      this.publishedEventIDs.has(event.id)
    ) {
      return;
    }
    const now = Date.now();
    this.downlinkSendTimes = this.downlinkSendTimes.filter(
      (t) => now - t < 60_000,
    );
    if (this.downlinkSendTimes.length >= DOWNLINK_EVENTS_PER_MINUTE) return;
    const payload = this.encodeCarrier(
      CarrierDirection.FROM_BRIDGE,
      cell,
      event,
    );
    if (payload === null) return;
    this.hooks.broadcastCarrierFromBridge(payload);
    this.remember(this.rebroadcastEventIDs, event.id);
    this.downlinkSendTimes.push(now);
  }

  // ---- Mesh carrier ingress (both roles) -----------------------------------

  handleMeshCarrier(
    carrier: NostrCarrierPacket,
    fromPeerID: string,
    directedToUs: boolean,
  ): void {
    if (!this.enabled) return;
    let event: NostrEvent;
    try {
      event = JSON.parse(
        new TextDecoder().decode(carrier.eventJSON),
      ) as NostrEvent;
    } catch {
      return;
    }
    if (typeof event.id !== "string" || !verifyEvent(event)) return;

    if (carrier.direction === CarrierDirection.TO_BRIDGE) {
      if (!directedToUs) return; // a broadcast toBridge is malformed
      this.handleUplinkDeposit(carrier, event, fromPeerID);
    } else if (carrier.direction === CarrierDirection.FROM_BRIDGE) {
      if (directedToUs) return; // a directed fromBridge is malformed
      this.handleDownlink(carrier, event);
    }
  }

  // Gateway role: publish a mesh-only peer's deposit to the rendezvous relays.
  private handleUplinkDeposit(
    carrier: NostrCarrierPacket,
    event: NostrEvent,
    depositor: string,
  ): void {
    const parsed = parseBridgeEvent(event);
    if (parsed === null || parsed.kind !== "message") return;
    if (parsed.cell !== carrier.geohash) return; // r tag must match the carrier
    if (!this.isFresh(event)) return;
    if (this.publishedEventIDs.has(event.id)) return;
    if (!this.allowUplinkDeposit(depositor)) return;
    this.remember(this.publishedEventIDs, event.id);
    void this.client
      .publish(event, this.relaysForCell(carrier.geohash))
      .catch(() => {});
  }

  // Mesh-only receiver role: a bridge gateway broadcast a remote message to us.
  private handleDownlink(carrier: NostrCarrierPacket, event: NostrEvent): void {
    const parsed = parseBridgeEvent(event);
    if (parsed === null || parsed.kind !== "message") return;
    if (parsed.cell !== carrier.geohash) return;
    if (!this.isFresh(event)) return;
    if (this.receivedEventIDs.has(event.id)) return;
    this.remember(this.receivedEventIDs, event.id);
    const isLocalRadioCopy =
      parsed.radioMessageIDHint !== undefined &&
      this.seenRadioStableIDs.has(parsed.radioMessageIDHint);
    if (isLocalRadioCopy) return;
    this.injectRemote(event, parsed.content, parsed.nickname);
    this.recordParticipant(event.pubkey);
  }

  // ---- Presence + participants ---------------------------------------------

  private publishPresence(): void {
    if (!this.enabled || this.activeCell === null) return;
    if (!this.hooks.relaysConnected()) return;
    const now = Date.now();
    if (now - this.lastPresenceAtMs < PRESENCE_MIN_INTERVAL_MS) return;
    this.lastPresenceAtMs = now;
    const identity = this.identityFor(this.activeCell);
    const event = createBridgePresenceEvent(this.activeCell, identity.privKey);
    this.remember(this.publishedEventIDs, event.id);
    void this.client
      .publish(event, this.relaysForCell(this.activeCell))
      .catch(() => {});
  }

  private armPresenceTimer(): void {
    if (this.presenceTimer !== null) return;
    const tick = (): void => {
      this.presenceTimer = null;
      if (!this.enabled) return;
      this.pruneParticipants();
      this.publishPresence();
      // Recover a launch that raced the location permission, and migrate cells
      // on a moving device.
      void this.refresh();
      this.armPresenceTimer();
    };
    this.presenceTimer = setTimeout(tick, 4 * 60 * 1000);
  }

  private recordParticipant(pubkey: string): void {
    this.participants.set(pubkey, Date.now());
    this.emitStatus();
  }

  private pruneParticipants(): void {
    const cutoff = Date.now() - PARTICIPANT_TTL_MS;
    for (const [pubkey, seen] of this.participants) {
      if (seen < cutoff) this.participants.delete(pubkey);
    }
  }

  private peopleAcross(): number {
    this.pruneParticipants();
    return this.participants.size;
  }

  // ---- Helpers --------------------------------------------------------------

  private injectRemote(
    event: NostrEvent,
    content: string,
    nickname: string | undefined,
  ): void {
    if (content.length === 0) return;
    const parsedTs = Math.min(event.created_at, Math.floor(Date.now() / 1000));
    this.hooks.injectMessage({
      // Key on the content-stable radio ID when present so a later radio copy
      // (or a copy from another gateway) collapses onto the same row; else fall
      // back to the event id.
      id: this.timelineID(event),
      senderKey: `nostr_${event.pubkey}`,
      nickname: geohashDisplayName(event.pubkey, nickname),
      text: content,
      timestampMs: parsedTs * 1000,
    });
  }

  private timelineID(event: NostrEvent): string {
    const parsed = parseBridgeEvent(event);
    if (parsed?.radioMessageIDHint !== undefined) {
      return `mesh-${parsed.radioMessageIDHint}`;
    }
    return `bridge-${event.id}`;
  }

  private isOwnEvent(event: NostrEvent, cell: string): boolean {
    return event.pubkey === this.identityFor(cell).pubKeyHex;
  }

  private identityFor(cell: string): GeohashIdentity {
    let identity = this.identityCache.get(cell);
    if (identity === undefined) {
      identity = deriveGeohashIdentity(this.seed, cell);
      this.identityCache.set(cell, identity);
    }
    return identity;
  }

  private relaysForCell(cell: string): string[] {
    const nearest = this.relayDirectory.closestRelaysToGeohash(
      cell,
      decodeGeohash,
      RELAY_COUNT,
    );
    const { geoRelayDiscovery, customRelays } = useSettingsStore.getState();
    return mergeGeoRelays(
      nearest,
      customRelays,
      geoRelayDiscovery,
      RELAY_COUNT,
    );
  }

  private encodeCarrier(
    direction: CarrierDirection,
    cell: string,
    event: NostrEvent,
  ): Uint8Array | null {
    return encodeNostrCarrier({
      direction,
      geohash: cell,
      eventJSON: new TextEncoder().encode(JSON.stringify(event)),
    });
  }

  private isFresh(event: NostrEvent): boolean {
    return (
      Math.abs(Date.now() / 1000 - event.created_at) <= MAX_EVENT_AGE_SECONDS
    );
  }

  private allowUplinkDeposit(depositor: string): boolean {
    const now = Date.now();
    const times = (this.uplinkDepositTimes.get(depositor) ?? []).filter(
      (t) => now - t < 60_000,
    );
    if (times.length >= UPLINK_EVENTS_PER_MINUTE_PER_DEPOSITOR) {
      this.uplinkDepositTimes.set(depositor, times);
      return false;
    }
    times.push(now);
    this.uplinkDepositTimes.set(depositor, times);
    if (this.uplinkDepositTimes.size > ID_SET_CAP) {
      for (const [id, ts] of this.uplinkDepositTimes) {
        if (ts.every((t) => now - t >= 60_000)) {
          this.uplinkDepositTimes.delete(id);
        }
      }
    }
    return true;
  }

  private remember(set: Set<string>, id: string): void {
    set.add(id);
    if (set.size > 2000) {
      const oldest = set.values().next().value;
      if (oldest !== undefined) set.delete(oldest);
    }
  }

  // Relay connectivity moved under us. Re-publish the status, because `active`
  // depends on it and nothing else recomputes on that edge.
  //
  // Status was only emitted on refresh, teardown and an inbound participant
  // event, and all three need working relays. So losing them left the banner
  // claiming to be bridging islands for as long as the outage lasted, bounded
  // only by the four-minute presence tick. Gating `active` on relays fixed the
  // value; this is what makes anyone recompute it.
  onRelayConnectivityChanged(): void {
    this.emitStatus();
  }

  private emitStatus(): void {
    this.hooks.onStatus({
      // The same predicate the advertised capability uses, relays included.
      //
      // These two had drifted: the bit peers read self-gated on live relays, but
      // the banner did not, so a phone with the toggle on and every relay down
      // told its owner it was bridging islands while it could neither publish
      // nor receive a single message. A status indicator that over-claims is the
      // failure the banner layer exists to prevent.
      active:
        this.enabled &&
        this.activeCell !== null &&
        this.hooks.relaysConnected(),
      cell: this.activeCell ?? undefined,
      peopleAcross: this.peopleAcross(),
    });
  }
}
