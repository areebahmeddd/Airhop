// Location-scoped channels bridged over Nostr.
//
// This is what makes #block / #neighborhood / #city / #province / #region mean
// something. Until now they were BLE-only broadcasts despite being described in
// the UI as "bridged over Nostr", so two people in the same city but out of
// Bluetooth range could sit in #city and never see each other.
//
// How it works:
//   - The device's coarse position is truncated to a geohash. Each channel maps
//     to a precision, so "#city" resolves to a ~5 km cell and "#region" to a
//     ~1250 km one.
//   - Messages are published as ephemeral Nostr events tagged with that
//     geohash, and we subscribe to the same tag. Anyone whose position falls in
//     the same cell shares the channel.
//   - Relays are chosen by distance from the user, so a city channel is carried
//     by relays near that city rather than whatever is hardcoded.
//
// Privacy: raw coordinates NEVER leave the device. Only the truncated geohash
// is published, and the finest cell we ever publish is ~150 m across. Presence
// heartbeats are additionally restricted to coarse precisions by presence.ts.
//
// Degradation: with location denied, every geohash resolves to null and the
// service is inert and the channels keep working over BLE exactly as before.
// Location is an enhancement, never a requirement.

import { finalizeEvent, type Event as NostrEvent } from "nostr-tools";
import { NoisePayloadType } from "../core/mesh/noise-payload";
import {
  decodeBitchatEnvelope,
  encodeBitchatAckEnvelope,
  encodeBitchatDmEnvelope,
} from "../core/nostr/bitchat-envelope";
import { GeoRelayDirectory } from "../core/nostr/geo-relay";
import {
  loadGeoRelays,
  refreshGeoRelays,
} from "../core/nostr/geo-relay-source";
import {
  deriveGeohashIdentity,
  deriveGeohashSeed,
  geohashDisplayName,
  type GeohashIdentity,
} from "../core/nostr/geohash-identity";
import { unwrapDm, wrapDm } from "../core/nostr/gift-wrap";
import type { NostrClient } from "../core/nostr/nostr-client";
import {
  decodeGeohash,
  encodeGeohash,
  GeohashPresence,
  KIND_PRESENCE,
  TAG_MESSAGE_ID,
} from "../core/nostr/presence";
import { useChatStore } from "../store/chat-store";
import { useNoticesStore } from "../store/notices-store";
import { getCoarseLocation, type Coords } from "./location-service";

// Channel name → geohash precision.
//
// Cell sizes are the standard geohash grid, chosen to match the coverage each
// channel already advertises in the UI:
//   7 → ~153 m      (city block)
//   6 → ~1.2 km     (neighborhood)
//   5 → ~4.9 km     (city)
//   4 → ~39 km      (province / state)
//   2 → ~1250 km    (region)
//
// #bluetooth is deliberately absent: it is the BLE-only channel and must never
// be bridged to the internet.
export const GEO_CHANNEL_PRECISION: Readonly<Record<string, number>> = {
  "#block": 7,
  "#neighborhood": 6,
  "#city": 5,
  "#province": 4,
  "#region": 2,
};

export function isGeoChannel(channel: string): boolean {
  return channel in GEO_CHANNEL_PRECISION;
}

// Relays to publish/subscribe per geohash cell. Matches bitchat's
// TransportConfig.nostrGeoRelayCount so both clients converge on the same set.
const GEO_RELAY_COUNT = 5;

// How far back a per-cell DM inbox looks on (re)subscribe. Matches bitchat's
// TransportConfig.nostrDMSubscribeLookbackSeconds (24 h).
const GEO_DM_LOOKBACK_SECONDS = 24 * 60 * 60;

// How long a sender stays listed as present in a channel after their last post.
// Matches bitchat's GeohashParticipantTracker activity cutoff (5 minutes) so
// both apps show the same "who is here now" count.
const PARTICIPANT_TTL_MS = 5 * 60 * 1000;

// Nostr tag carrying the sender's chosen display name. Nostr events identify
// the author only by pubkey, so without this every geohash message would show
// as a raw hex string.
const TAG_NICKNAME = "n";

// Nostr event kinds for the board's Nostr bridge: a geohash board post is
// mirrored as a kind-1 location note so online users see it, and retracted with
// a kind-5 deletion. Matches bitchat's NostrProtocol.createGeohashTextNote /
// createDeleteEvent.
const KIND_TEXT_NOTE = 1;
const KIND_DELETION = 5;
const TAG_GEOHASH = "g";
const TAG_EXPIRATION = "expiration"; // NIP-40
const TAG_TOPIC = "t"; // ["t","urgent"] parity with urgent board posts

export interface GeoParticipant {
  pubkey: string;
  nickname: string;
  lastSeenMs: number;
}

export class GeohashChannelService {
  private readonly client: NostrClient;
  private readonly relayDirectory = new GeoRelayDirectory();
  private readonly nickname: string;
  // Our mesh peer ID, embedded in the bitchat1 envelope of a geo DM.
  private readonly localPeerID: string;
  // Seed for per-geohash key derivation. Never published.
  private readonly geohashSeed: Uint8Array;

  // channel → unsubscribe function for that cell's geo-DM gift-wrap inbox.
  private readonly dmSubscriptions = new Map<string, () => void>();
  // channel → unsubscribe function for that cell's kind-1 location-note feed.
  private readonly noteSubscriptions = new Map<string, () => void>();
  // A geo-DM peer's Nostr pubkey → the geohash cell we talk to them in, so a
  // reply re-derives our per-cell identity and targets the right relays.
  private readonly geoDmPeers = new Map<string, string>();
  // Read receipts owed over geo DM, keyed by the peer's Nostr pubkey.
  private readonly pendingGeoDmReadAcks = new Map<string, Set<string>>();

  // Last resolved position. Retained so refresh() can detect a cell change.
  private coords: Coords | null = null;
  // channel → resolved geohash for our current position.
  private readonly channelGeohash = new Map<string, string>();
  // channel → unsubscribe function.
  private readonly subscriptions = new Map<string, () => void>();
  // channel → pubkey → participant.
  private readonly participants = new Map<
    string,
    Map<string, GeoParticipant>
  >();
  // geohash → the identity we post under there. Cached so a user keeps a
  // stable pseudonym within a channel for the session.
  private readonly identities = new Map<string, GeohashIdentity>();
  // One presence broadcaster per geohash, since each signs with its own key.
  private readonly presenceByGeohash = new Map<string, GeohashPresence>();

  constructor(
    client: NostrClient,
    signingPrivKey: Uint8Array,
    nickname: string,
    localPeerID: string,
  ) {
    this.client = client;
    this.nickname = nickname;
    this.localPeerID = localPeerID;
    this.geohashSeed = deriveGeohashSeed(signingPrivKey);
    // Load the freshest relay list we have synchronously (cached CSV from a
    // prior fetch, else the vendored snapshot), then refresh from the live
    // directory bitchat also reads so our closest-relay picks stay aligned.
    this.relayDirectory.loadEntries(loadGeoRelays());
    void refreshGeoRelays().then((fresh) => {
      if (fresh) this.relayDirectory.loadEntries(fresh);
    });
  }

  // The identity used for one geohash. Derived lazily and cached.
  private identityFor(geohash: string): GeohashIdentity {
    let identity = this.identities.get(geohash);
    if (identity === undefined) {
      identity = deriveGeohashIdentity(this.geohashSeed, geohash);
      this.identities.set(geohash, identity);
    }
    return identity;
  }

  private presenceFor(geohash: string): GeohashPresence {
    let p = this.presenceByGeohash.get(geohash);
    if (p === undefined) {
      p = new GeohashPresence(
        { nostrPrivKey: this.identityFor(geohash).privKey },
        this.client,
      );
      this.presenceByGeohash.set(geohash, p);
    }
    return p;
  }

  // Resolve position and subscribe to every geo channel the user has joined.
  // Safe to call repeatedly; re-resolves location and re-subscribes only where
  // the geohash actually changed.
  async refresh(): Promise<void> {
    const coords = await getCoarseLocation();
    if (coords === null) {
      // No location: tear down any existing subscriptions so we don't keep
      // serving a stale cell after permission is revoked.
      this.teardownAll();
      this.coords = null;
      return;
    }
    this.coords = coords;

    const joined = useChatStore.getState().channels.filter(isGeoChannel);

    // Drop subscriptions for channels the user has since left.
    for (const channel of [...this.subscriptions.keys()]) {
      if (!joined.includes(channel)) this.unsubscribeChannel(channel);
    }

    for (const channel of joined) {
      const precision = GEO_CHANNEL_PRECISION[channel];
      const geohash = encodeGeohash(coords.lat, coords.lng, precision);
      if (this.channelGeohash.get(channel) === geohash) continue; // unchanged

      // Moved into a new cell: the old cell's traffic is no longer ours.
      this.unsubscribeChannel(channel);
      this.channelGeohash.set(channel, geohash);
      this.subscribeChannel(channel, geohash);
    }
  }

  // The relays carrying a given geohash cell, chosen from the cell's CENTRE so
  // every participant (Airhop or bitchat) converges on the same set. bitchat
  // selects relays exactly this way (GeoRelayDirectory.closestRelays), so
  // routing our geohash traffic through these relays instead of the default DM
  // pool is what makes the public location channels actually interoperate.
  private relaysForGeohash(geohash: string): string[] {
    return this.relayDirectory.closestRelaysToGeohash(
      geohash,
      decodeGeohash,
      GEO_RELAY_COUNT,
    );
  }

  // The relays carrying a given cell. Chosen from the cell's CENTRE so every
  // participant converges on the same set. See closestRelaysToGeohash.
  relaysForChannel(channel: string, count = GEO_RELAY_COUNT): string[] {
    const geohash = this.channelGeohash.get(channel);
    if (geohash === undefined) return [];
    return this.relayDirectory.closestRelaysToGeohash(
      geohash,
      decodeGeohash,
      count,
    );
  }

  // The geohash this channel currently resolves to, or null when location is
  // unavailable (in which case the channel is BLE-only).
  geohashFor(channel: string): string | null {
    return this.channelGeohash.get(channel) ?? null;
  }

  // Whether a position has been resolved. The UI uses this to explain that a
  // location channel is running BLE-only rather than leaving it silently local.
  get hasLocation(): boolean {
    return this.coords !== null;
  }

  // Publish a message to a geo channel's Nostr cell. Returns false when there
  // is no cell to publish to, so the caller knows the message went out over
  // BLE only.
  async publish(
    channel: string,
    text: string,
    msgId: string,
  ): Promise<boolean> {
    const geohash = this.channelGeohash.get(channel);
    if (geohash === undefined) return false;
    try {
      await this.presenceFor(geohash).publishChannelMessage(
        geohash,
        text,
        this.nickname,
        msgId,
        this.relaysForGeohash(geohash),
      );
      return true;
    } catch {
      // Relay unreachable. The BLE broadcast still happened, so this is a
      // partial send rather than a failure.
      return false;
    }
  }

  // Everyone who has posted in this channel recently, newest first.
  //
  // Derived from actual messages rather than presence heartbeats on purpose:
  // presence is only broadcast at coarse precisions (privacy), so it cannot
  // populate a block- or neighborhood-level participant list, and "people who
  // spoke here" is a more honest definition of who is in a channel anyway.
  participantsFor(channel: string): GeoParticipant[] {
    const map = this.participants.get(channel);
    if (map === undefined) return [];
    const cutoff = Date.now() - PARTICIPANT_TTL_MS;
    return [...map.values()]
      .filter((p) => p.lastSeenMs >= cutoff)
      .sort((a, b) => b.lastSeenMs - a.lastSeenMs);
  }

  stop(): void {
    this.teardownAll();
    for (const p of this.presenceByGeohash.values()) p.stop();
    this.presenceByGeohash.clear();
  }

  // ---- Board Nostr bridge ---------------------------------------------------

  // Mirror a geohash board post as a kind-1 location note so users who are
  // online (out of BLE range) see it. Signed with our per-cell identity and
  // published to the cell's relays. Returns the Nostr event id for a later
  // merged delete, or null when there is no relay to carry it.
  async publishBoardNote(
    geohash: string,
    content: string,
    nickname: string,
    expiresAtMs: number,
    urgent: boolean,
  ): Promise<string | null> {
    const relays = this.relaysForGeohash(geohash);
    if (relays.length === 0) return null;
    const tags: string[][] = [[TAG_GEOHASH, geohash]];
    if (nickname.length > 0) tags.push([TAG_NICKNAME, nickname]);
    // NIP-40: the note fades in step with the board post's expiry.
    tags.push([TAG_EXPIRATION, String(Math.floor(expiresAtMs / 1000))]);
    if (urgent) tags.push([TAG_TOPIC, "urgent"]);
    try {
      const event = finalizeEvent(
        {
          kind: KIND_TEXT_NOTE,
          created_at: Math.floor(Date.now() / 1000),
          tags,
          content,
        },
        this.identityFor(geohash).privKey,
      );
      await this.client.publish(event, relays);
      return event.id;
    } catch {
      return null;
    }
  }

  // Retract a previously bridged note with a NIP-09 deletion (kind 5), signed
  // by the same per-cell key that published it.
  async deleteBoardNote(geohash: string, eventID: string): Promise<void> {
    const relays = this.relaysForGeohash(geohash);
    if (relays.length === 0) return;
    try {
      const event = finalizeEvent(
        {
          kind: KIND_DELETION,
          created_at: Math.floor(Date.now() / 1000),
          tags: [["e", eventID]],
          content: "",
        },
        this.identityFor(geohash).privKey,
      );
      await this.client.publish(event, relays);
    } catch {
      // Best-effort: the board tombstone already suppresses the mesh copy.
    }
  }

  // ---- Gateway carrier bridge -----------------------------------------------

  // Publish a pre-signed Nostr event to a cell's relays. Used by an uplink
  // gateway to forward a mesh-only peer's toGateway carrier to the internet.
  publishCarriedEvent(event: NostrEvent, geohash: string): void {
    void this.client
      .publish(event, this.relaysForGeohash(geohash))
      .catch(() => {});
  }

  // Render a geohash chat event that arrived via a mesh gateway (fromGateway),
  // exactly as the live Nostr subscription would, so a mesh-only user sees the
  // channel a nearby gateway is bridging. No-op unless the user is in a channel
  // resolving to the event's cell.
  ingestCarriedEvent(event: NostrEvent): void {
    const geohash = event.tags.find(([t]) => t === TAG_GEOHASH)?.[1];
    if (geohash === undefined) return;
    let channel: string | undefined;
    for (const [ch, gh] of this.channelGeohash) {
      if (gh === geohash) {
        channel = ch;
        break;
      }
    }
    if (channel === undefined) return;
    if (event.pubkey === this.identityFor(geohash).pubKeyHex) return; // own echo
    if (event.kind === KIND_PRESENCE || event.content.length === 0) return;

    const rawNick = event.tags.find(([t]) => t === TAG_NICKNAME)?.[1];
    const nickname = geohashDisplayName(event.pubkey, rawNick);
    this.trackParticipant(channel, event.pubkey, nickname);
    const sharedId = event.tags.find(([t]) => t === TAG_MESSAGE_ID)?.[1];
    useChatStore.getState().addMessage({
      id:
        sharedId !== undefined && sharedId.length > 0
          ? `ch-${sharedId}`
          : `geo-${event.id}`,
      channel,
      senderID: `nostr_${event.pubkey}`,
      senderNickname: nickname,
      text: event.content,
      timestampMs:
        Math.min(event.created_at, Math.floor(Date.now() / 1000)) * 1000,
      isMine: false,
    });
  }

  // ---- Geohash direct messages ----------------------------------------------

  // Whether we have an active geo-DM conversation with a Nostr pubkey, i.e. the
  // caller should route a reply through the per-cell path rather than a main
  // Nostr DM. Returns the geohash if so.
  geohashForGeoDmPeer(pubkey: string): string | undefined {
    return this.geoDmPeers.get(pubkey);
  }

  // Bind a participant's geohash pubkey to a cell, so tapping them in a channel
  // and sending first (before they message us) still routes correctly.
  registerGeoDmPeer(pubkey: string, geohash: string): void {
    this.geoDmPeers.set(pubkey, geohash);
  }

  // Send an end-to-end encrypted DM to a participant's per-geohash pubkey, from
  // our own per-geohash identity for that cell. Returns false if the content is
  // too long for one PrivateMessagePacket.
  sendGeoDm(
    geohash: string,
    recipientPubkey: string,
    messageID: string,
    text: string,
  ): boolean {
    const envelope = encodeBitchatDmEnvelope(
      this.localPeerID,
      null,
      messageID,
      text,
    );
    if (envelope === null) return false;
    this.publishGeoWrap(geohash, recipientPubkey, envelope);
    this.registerGeoDmPeer(recipientPubkey, geohash);
    return true;
  }

  // Flush queued read receipts for a geo-DM conversation when its thread opens.
  sendGeoReadReceipts(pubkey: string): void {
    const geohash = this.geoDmPeers.get(pubkey);
    const pending = this.pendingGeoDmReadAcks.get(pubkey);
    if (geohash === undefined || pending === undefined || pending.size === 0)
      return;
    for (const messageID of pending) {
      this.publishGeoWrap(
        geohash,
        pubkey,
        encodeBitchatAckEnvelope(
          this.localPeerID,
          null,
          NoisePayloadType.READ_RECEIPT,
          messageID,
        ),
      );
    }
    pending.clear();
  }

  // Gift-wrap `envelope` from our per-cell identity to `recipientPubkey` and
  // publish it to the default relays (matching bitchat's geo-DM transport).
  private publishGeoWrap(
    geohash: string,
    recipientPubkey: string,
    envelope: string,
  ): void {
    const identity = this.identityFor(geohash);
    const { event } = wrapDm(envelope, identity.privKey, recipientPubkey);
    void this.client.publish(event).catch(() => {});
  }

  // Handle an inbound gift wrap on a cell's DM inbox.
  private handleGeoDm(event: NostrEvent, geohash: string): void {
    let dm: { content: string; senderPubkey: string; timestamp: number };
    try {
      dm = unwrapDm(event, this.identityFor(geohash).privKey);
    } catch {
      return;
    }
    const env = decodeBitchatEnvelope(dm.content);
    if (env === null) return;

    const channel = `dm:nostr_${dm.senderPubkey}`;
    this.registerGeoDmPeer(dm.senderPubkey, geohash);

    if (env.type === NoisePayloadType.DELIVERED) {
      useChatStore
        .getState()
        .setMessageStatus(channel, env.messageID, "delivered", Date.now());
      return;
    }
    if (env.type === NoisePayloadType.READ_RECEIPT) {
      useChatStore
        .getState()
        .setMessageStatus(channel, env.messageID, "read", Date.now());
      return;
    }
    if (env.type !== NoisePayloadType.PRIVATE_MESSAGE) return;

    useChatStore.getState().addChannel(channel);
    useChatStore.getState().addMessage({
      id: env.messageID,
      channel,
      senderID: `nostr_${dm.senderPubkey}`,
      senderNickname: geohashDisplayName(dm.senderPubkey),
      text: env.content,
      timestampMs: Math.min(dm.timestamp, Math.floor(Date.now() / 1000)) * 1000,
      isMine: false,
    });

    // Acknowledge delivery now; queue the read receipt for thread open.
    this.publishGeoWrap(
      geohash,
      dm.senderPubkey,
      encodeBitchatAckEnvelope(
        this.localPeerID,
        null,
        NoisePayloadType.DELIVERED,
        env.messageID,
      ),
    );
    const pending =
      this.pendingGeoDmReadAcks.get(dm.senderPubkey) ?? new Set<string>();
    pending.add(env.messageID);
    this.pendingGeoDmReadAcks.set(dm.senderPubkey, pending);
  }

  // ---- Private --------------------------------------------------------------

  private subscribeChannel(channel: string, geohash: string): void {
    const selfPubkey = this.identityFor(geohash).pubKeyHex;

    const close = this.presenceFor(geohash).subscribeChannel(
      geohash,
      (event) => {
        // Ignore the echo of our own publishes; the sender already rendered
        // the message optimistically.
        if (event.pubkey === selfPubkey) return;
        // Only surface traffic for channels the user is still in.
        if (!useChatStore.getState().channels.includes(channel)) return;

        const rawNick = event.tags.find(([t]) => t === TAG_NICKNAME)?.[1];
        const nickname = geohashDisplayName(event.pubkey, rawNick);

        // Both chat (20000) and presence (20001) prove someone is in the cell.
        this.trackParticipant(channel, event.pubkey, nickname);

        // Presence heartbeats carry no content: they update the participant
        // list only and must never render as an empty chat bubble.
        if (event.kind === KIND_PRESENCE || event.content.length === 0) return;

        // Prefer the sender-assigned cross-transport ID so the BLE copy of this
        // same message collapses into one bubble. In a location channel both
        // copies arrive, and the Nostr one is signed with a per-geohash key,
        // so without this the reader sees the message twice, apparently from
        // two different people. Falls back to the Nostr event id, which still
        // dedupes copies arriving from several relays.
        const sharedId = event.tags.find(([t]) => t === TAG_MESSAGE_ID)?.[1];

        useChatStore.getState().addMessage({
          id:
            sharedId !== undefined && sharedId.length > 0
              ? `ch-${sharedId}`
              : `geo-${event.id}`,
          channel,
          senderID: `nostr_${event.pubkey}`,
          senderNickname: nickname,
          text: event.content,
          // Clamp to now, matching bitchat: a relay event may carry a
          // future-dated created_at, and without this it would sort ahead of
          // real messages and stick to the bottom of the thread.
          timestampMs:
            Math.min(event.created_at, Math.floor(Date.now() / 1000)) * 1000,
          isMine: false,
        });
      },
      this.relaysForGeohash(geohash),
    );
    this.subscriptions.set(channel, close);

    // Per-cell direct-message inbox: gift wraps addressed to our geohash
    // identity. bitchat runs this on the DEFAULT relay set (not the geo-closest
    // ones), so we pass no relay list.
    const identity = this.identityFor(geohash);
    const dmClose = this.client.subscribe(
      [
        {
          kinds: [1059],
          "#p": [identity.pubKeyHex],
          since: Math.floor(Date.now() / 1000) - GEO_DM_LOOKBACK_SECONDS,
        },
      ],
      (event) => this.handleGeoDm(event, geohash),
    );
    this.dmSubscriptions.set(channel, () => dmClose.close());

    // Location-note feed: kind-1 notes tagged to this cell (standalone notes
    // and bitchat board posts bridged to Nostr) surface in the notices sheet.
    const notesClose = this.client.subscribe(
      [{ kinds: [KIND_TEXT_NOTE], "#g": [geohash], limit: 200 }],
      (event) => this.handleLocationNote(event, geohash, identity.pubKeyHex),
      undefined,
      this.relaysForGeohash(geohash),
    );
    this.noteSubscriptions.set(channel, () => notesClose.close());
  }

  // Parse a kind-1 location note into the notices store. Our own bridged copy
  // is skipped: the signed board post already renders it, carrying urgency and
  // supporting merged deletion.
  private handleLocationNote(
    event: NostrEvent,
    geohash: string,
    selfPubkey: string,
  ): void {
    if (event.pubkey === selfPubkey) return;
    const matched = event.tags.find(
      ([t, v]) => t === TAG_GEOHASH && v === geohash,
    );
    if (matched === undefined) return;
    const expirationSec = event.tags.find(([t]) => t === TAG_EXPIRATION)?.[1];
    const expiresAtMs =
      expirationSec !== undefined ? Number(expirationSec) * 1000 : undefined;
    const nickname = event.tags.find(([t]) => t === TAG_NICKNAME)?.[1];
    const isUrgent = event.tags.some(
      ([t, v]) => t === TAG_TOPIC && v === "urgent",
    );
    useNoticesStore.getState().addNote({
      id: event.id,
      pubkey: event.pubkey,
      content: event.content,
      // Clamp to now: a relay event may carry a future-dated created_at.
      createdAtMs:
        Math.min(event.created_at, Math.floor(Date.now() / 1000)) * 1000,
      nickname,
      geohash,
      expiresAtMs:
        expiresAtMs !== undefined && Number.isFinite(expiresAtMs)
          ? expiresAtMs
          : undefined,
      isUrgent,
    });
  }

  private unsubscribeChannel(channel: string): void {
    const close = this.subscriptions.get(channel);
    if (close !== undefined) {
      close();
      this.subscriptions.delete(channel);
    }
    const dmClose = this.dmSubscriptions.get(channel);
    if (dmClose !== undefined) {
      dmClose();
      this.dmSubscriptions.delete(channel);
    }
    const notesClose = this.noteSubscriptions.get(channel);
    if (notesClose !== undefined) {
      notesClose();
      this.noteSubscriptions.delete(channel);
    }
    this.channelGeohash.delete(channel);
  }

  private teardownAll(): void {
    for (const channel of [...this.subscriptions.keys()]) {
      this.unsubscribeChannel(channel);
    }
  }

  private trackParticipant(
    channel: string,
    pubkey: string,
    nickname: string,
  ): void {
    let map = this.participants.get(channel);
    if (map === undefined) {
      map = new Map();
      this.participants.set(channel, map);
    }
    map.set(pubkey, { pubkey, nickname, lastSeenMs: Date.now() });
  }

  // Exposed for the publish path so outgoing events carry our display name.
  get displayNickname(): string {
    return this.nickname;
  }
}
