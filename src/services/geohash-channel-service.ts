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
// Degradation: with location denied, the NAMED channels resolve to no cell and
// keep working over BLE exactly as before. Location is an enhancement, never a
// requirement. Teleported channels (geohash:<gh>) carry a fixed geohash, so
// they stay live over the internet even with no location fix.

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
import { useActivityStore } from "../store/activity-store";
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

// A teleported cell is keyed `geohash:<gh>`, mirroring the app's `group:` and
// `dm:` channel-key idiom. The named channels above resolve their geohash from
// the device's own location; a teleported one carries a FIXED geohash the user
// jumped to, so it works with no location permission and never moves. The `gh`
// after the prefix is the bare lowercased geohash that rides the Nostr `g` tag,
// so it interoperates with bitchat's location channels for the same cell.
export const MANUAL_GEO_PREFIX = "geohash:";

// The standard geohash base32 alphabet (no a/i/l/o), same as bitchat.
const GEOHASH_ALPHABET = "0123456789bcdefghjkmnpqrstuvwxyz";

export function isManualGeoChannel(channel: string): boolean {
  return channel.startsWith(MANUAL_GEO_PREFIX);
}

export function isGeoChannel(channel: string): boolean {
  return channel in GEO_CHANNEL_PRECISION || isManualGeoChannel(channel);
}

// Build the channel key for a teleported geohash cell.
export function geohashChannel(geohash: string): string {
  return `${MANUAL_GEO_PREFIX}${geohash}`;
}

// The bare geohash a teleported channel points at, or null for a named/other
// channel (whose geohash is location-derived, not fixed in the key).
export function manualGeohashOf(channel: string): string | null {
  return isManualGeoChannel(channel)
    ? channel.slice(MANUAL_GEO_PREFIX.length)
    : null;
}

// Canonicalise raw user input into a geohash: lowercase, drop a leading #,
// discard anything outside the alphabet, cap at 12 chars. Mirrors bitchat's
// LocationStateManager.normalizeGeohash so both accept the same strings.
export function normalizeGeohash(raw: string): string {
  return [...raw.trim().toLowerCase().replace(/#/g, "")]
    .filter((c) => GEOHASH_ALPHABET.includes(c))
    .join("")
    .slice(0, 12);
}

// A geohash the user may teleport to: 2 to 12 alphabet chars. Matches bitchat's
// open-channel gate (2...12); 1-char cells are half the globe and pointless.
export function isValidGeohash(gh: string): boolean {
  return (
    gh.length >= 2 &&
    gh.length <= 12 &&
    [...gh].every((c) => GEOHASH_ALPHABET.includes(c))
  );
}

// The coverage level a geohash length maps to, matching bitchat's
// GeohashChannelLevel.level(forLength:). Used only for display labels.
export function geohashLevelName(gh: string): string {
  const n = gh.length;
  if (n <= 2) return "Region";
  if (n <= 4) return "Province";
  if (n === 5) return "City";
  if (n === 6) return "Neighborhood";
  if (n === 7) return "Block";
  return "Building";
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

// A bridged note only counts as "new" for the notification bell if it arrived
// within this window, so a subscription's history replay does not flood it.
// Mirrors NOTICE_BELL_WINDOW_MS in mesh-service (the BLE board path).
const NOTICE_BELL_WINDOW_MS = 5 * 60 * 1000;

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
  // True when this participant posted with a teleport marker, i.e. they are not
  // physically in the cell. bitchat sets the same flag from the ["t","teleport"]
  // tag, so the two apps show the same "here vs teleported" state.
  teleported: boolean;
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
    // Location may be null (denied or off). That only affects the named
    // channels, whose cell is derived from where the user is. Teleported
    // channels carry a fixed geohash and stay live regardless, so we no longer
    // tear everything down when there is no fix.
    const coords = await getCoarseLocation();
    this.coords = coords;

    const joined = useChatStore.getState().channels.filter(isGeoChannel);

    // Drop subscriptions for channels the user has since left.
    for (const channel of [...this.subscriptions.keys()]) {
      if (!joined.includes(channel)) this.unsubscribeChannel(channel);
    }

    for (const channel of joined) {
      const geohash = this.resolveGeohash(channel, coords);
      if (geohash === null) {
        // A named channel with no location fix: it runs BLE-only, so make sure
        // it isn't left subscribed to a stale cell from before permission went.
        if (this.channelGeohash.has(channel)) this.unsubscribeChannel(channel);
        continue;
      }
      if (this.channelGeohash.get(channel) === geohash) continue; // unchanged

      // New cell (moved, or first resolve): the old cell's traffic is no
      // longer ours.
      this.unsubscribeChannel(channel);
      this.channelGeohash.set(channel, geohash);
      this.subscribeChannel(channel, geohash);
    }
  }

  // The geohash a joined channel should subscribe to right now. Teleported
  // channels use their fixed key geohash; named channels derive it from the
  // current position, or null when there is no fix (BLE-only).
  private resolveGeohash(
    channel: string,
    coords: Coords | null,
  ): string | null {
    const manual = manualGeohashOf(channel);
    if (manual !== null) return isValidGeohash(manual) ? manual : null;
    if (coords === null) return null;
    const precision = GEO_CHANNEL_PRECISION[channel];
    if (precision === undefined) return null;
    return encodeGeohash(coords.lat, coords.lng, precision);
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

  // The named location channel (#city etc.) whose current cell equals `geohash`,
  // or null. Lets the teleport flow redirect to a channel the user is already
  // standing in rather than opening a duplicate teleported room for the same
  // cell. Mirrors bitchat, which clears teleport when the target matches one of
  // the device's own computed channels. Returns null with no location fix, since
  // then no named channel has a resolved cell to compare against.
  namedChannelForGeohash(geohash: string): string | null {
    for (const channel of Object.keys(GEO_CHANNEL_PRECISION)) {
      if (this.channelGeohash.get(channel) === geohash) return channel;
    }
    return null;
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
        // A teleported cell is one we are not standing in, so mark our posts
        // teleported for bitchat's participant list, matching its own clients.
        isManualGeoChannel(channel),
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
      .sort((a, b) => {
        // People physically here first, teleported below them, matching
        // bitchat's list ordering; within each group, most recent first.
        if (a.teleported !== b.teleported) return a.teleported ? 1 : -1;
        return b.lastSeenMs - a.lastSeenMs;
      });
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
    // A number bridges a mesh board post (NIP-40 expiry, fades with the post).
    // `null` is a permanent, standalone note: no expiry tag, no mesh copy.
    expiresAtMs: number | null,
    urgent: boolean,
  ): Promise<string | null> {
    const relays = this.relaysForGeohash(geohash);
    if (relays.length === 0) return null;
    const tags: string[][] = [[TAG_GEOHASH, geohash]];
    if (nickname.length > 0) tags.push([TAG_NICKNAME, nickname]);
    // NIP-40: a bridged note fades in step with the board post's expiry. A
    // permanent note carries no expiration tag.
    if (expiresAtMs !== null) {
      tags.push([TAG_EXPIRATION, String(Math.floor(expiresAtMs / 1000))]);
    }
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
      // A permanent note has no mesh board post to render it locally, and our
      // own bridged copy is filtered out on receive, so add it optimistically:
      // the author sees their own note the moment it goes out.
      if (expiresAtMs === null) {
        useNoticesStore.getState().addNote({
          id: event.id,
          pubkey: event.pubkey,
          content,
          createdAtMs: Date.now(),
          nickname: nickname.length > 0 ? nickname : undefined,
          geohash,
          expiresAtMs: undefined,
          isUrgent: urgent,
        });
      }
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
    this.trackParticipant(
      channel,
      event.pubkey,
      nickname,
      this.isTeleportEvent(event),
    );
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
        // Only a chat event can carry the teleport marker; presence never does.
        this.trackParticipant(
          channel,
          event.pubkey,
          nickname,
          this.isTeleportEvent(event),
        );

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
    // Clamp to now: a relay event may carry a future-dated created_at.
    const createdAtMs =
      Math.min(event.created_at, Math.floor(Date.now() / 1000)) * 1000;
    useNoticesStore.getState().addNote({
      id: event.id,
      pubkey: event.pubkey,
      content: event.content,
      createdAtMs,
      nickname,
      geohash,
      expiresAtMs:
        expiresAtMs !== undefined && Number.isFinite(expiresAtMs)
          ? expiresAtMs
          : undefined,
      isUrgent,
    });
    // Log a live note on the bell + the room's board badge. Own notes are
    // already filtered above; the recency gate skips replayed history.
    if (Date.now() - createdAtMs <= NOTICE_BELL_WINDOW_MS) {
      useActivityStore.getState().record({
        id: event.id,
        channel:
          this.namedChannelForGeohash(geohash) ?? geohashChannel(geohash),
        isDM: false,
        senderID: event.pubkey,
        senderNickname:
          nickname !== undefined && nickname.length > 0 ? nickname : "Someone",
        preview: `${isUrgent ? "Urgent notice · " : "Notice · "}${event.content}`,
        timestampMs: createdAtMs,
        kind: "notice",
        geohash,
      });
    }
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
    teleported = false,
  ): void {
    let map = this.participants.get(channel);
    if (map === undefined) {
      map = new Map();
      this.participants.set(channel, map);
    }
    map.set(pubkey, { pubkey, nickname, lastSeenMs: Date.now(), teleported });
  }

  // Whether an event was published with a teleport marker (["t","teleport"]).
  // Only meaningful on chat events; presence heartbeats never carry it.
  private isTeleportEvent(event: NostrEvent): boolean {
    return event.tags.some(([t, v]) => t === "t" && v === "teleport");
  }

  // Exposed for the publish path so outgoing events carry our display name.
  get displayNickname(): string {
    return this.nickname;
  }
}
