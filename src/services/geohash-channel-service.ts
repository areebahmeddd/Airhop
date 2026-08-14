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
// heartbeats are additionally restricted to coarse precisions by geohash-presence.ts.
//
// Degradation: with location denied, the NAMED channels resolve to no cell and
// keep working over BLE exactly as before. Location is an enhancement, never a
// requirement. Teleported channels (geohash:<gh>) carry a fixed geohash, so
// they stay live over the internet even with no location fix.

import { NoisePayloadType } from "@core/mesh/wire/noise-payload";
import {
  decodeBitchatEnvelope,
  encodeBitchatAckEnvelope,
  encodeBitchatCardEnvelope,
  encodeBitchatDmEnvelope,
} from "@core/nostr/bitchat-envelope";
import {
  GEO_RELAY_COUNT,
  GeoRelayDirectory,
  mergeGeoRelays,
} from "@core/nostr/geo-relay";
import { loadGeoRelays } from "@core/nostr/geo-relay-source";
import {
  deriveGeohashIdentity,
  deriveGeohashSeed,
  geohashDisplayName,
  type GeohashIdentity,
} from "@core/nostr/geohash-identity";
import {
  decodeGeohash,
  decorrelationDelayMs,
  encodeGeohash,
  GeohashPresence,
  KIND_PRESENCE,
  mayBroadcastPresence,
  nextHeartbeatDelayMs,
  TAG_MESSAGE_ID,
} from "@core/nostr/geohash-presence";
import { unwrapDm, wrapDm } from "@core/nostr/gift-wrap";
import type { NostrClient } from "@core/nostr/nostr-client";
import { t } from "@i18n";
import { useActivityStore } from "@store/activity-store";
import { useBlockedStore } from "@store/blocked-store";
import { useChatStore } from "@store/chat-store";
import { useNoticesStore } from "@store/location-notes-store";
import { useMeshStateStore } from "@store/mesh-state-store";
import { useSettingsStore } from "@store/settings-store";
import { finalizeEvent, type Event as NostrEvent } from "nostr-tools";
import { getCoarseLocation, type Coords } from "./location-service";

// Blocking, on the Nostr side. The mesh enforces it at one chokepoint in
// `routePacket`; nothing did here, so a blocked person kept posting in location
// channels, kept counting toward the participant total, and could still open a
// geo DM.
//
// A geohash identity is a per-cell secp256k1 pubkey addressed everywhere as
// `nostr_<pubkey>`: the `senderID` these events carry into chat-store, and the
// key the DM list passes to `blockPeer`. One lookup therefore covers channel
// messages, presence and geo DMs.
//
// Relaying is deliberately out of scope. The gateway hands every inbound event
// to the mesh before this runs, matching `routePacket`, which keeps relaying for
// a blocked sender. A block says what you read, not who the mesh serves.
//
// Not a shield either: cells key on a fresh identity, so someone determined
// reappears under a new pubkey. This stops the ordinary case.
function isBlockedPubkey(pubkey: string): boolean {
  return useBlockedStore.getState().isBlocked(`nostr_${pubkey}`);
}

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
  if (n <= 2) return t("mesh.level.region");
  if (n <= 4) return t("mesh.level.province");
  if (n === 5) return t("mesh.level.city");
  if (n === 6) return t("mesh.level.neighborhood");
  if (n === 7) return t("mesh.level.block");
  return t("mesh.level.building");
}

// How far back a per-cell DM inbox looks on (re)subscribe. Matches bitchat's
// TransportConfig.nostrDMSubscribeLookbackSeconds (24 h).
const GEO_DM_LOOKBACK_SECONDS = 24 * 60 * 60;

// How long a sender stays listed as present in a channel after their last post.
// Matches bitchat's GeohashParticipantTracker activity cutoff (5 minutes) so
// both apps show the same "who is here now" count.
//
// Paired with the 40-80s presence heartbeat (nextHeartbeatDelayMs in
// core/nostr/geohash-presence.ts), so five minutes is about four missed rounds of slack.
// Shortening one without the other makes the list flicker.
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

// How far back the location-note feed looks.
//
// The feed used to carry no `since` at all, so five joined cells each pulled
// their relays' 200 most recent `#g` notes however old they were. A note that
// predates this window is either NIP-40 expired or older than the 7-day life of
// the board post it mirrors, so it has nothing to show; asking for it only
// bought a bigger cold-start burst to verify and throw away.
const GEO_NOTE_LOOKBACK_SECONDS = 7 * 24 * 60 * 60;

// Deletions are asked for by author, and this caps how many authors one filter
// may name. Ordered by when we last heard from them, so the cap drops the
// authors whose notes are oldest - which are the ones nearest to ageing out of
// the window above anyway.
const MAX_DELETION_AUTHORS = 128;

// Debounce on rebuilding a cell's deletion subscription. A backfill hands us a
// couple of hundred notes in a burst, and resubscribing per new author would
// open and close a subscription per note.
const DELETION_RESUBSCRIBE_DEBOUNCE_MS = 2_000;

// Hooks the mesh layer supplies so geohash chat can cross the mesh/internet
// boundary through a gateway peer. Both are optional; without them the service
// is a plain internet-only geohash client.
export interface GatewayHooks {
  // Relays were unreachable for our own post: ferry the signed event to a nearby
  // internet gateway peer over the mesh (uplink carrier), if one is reachable.
  uplink(event: NostrEvent, geohash: string): void;
  // Every channel event our relay subscription delivers. When this device is a
  // gateway it may rebroadcast the event onto the mesh (downlink carrier).
  onRelayEvent(event: NostrEvent, geohash: string): void;
  // Someone in a location channel handed us their durable contact card. The
  // mesh layer owns what happens next - the peer-ID binding check, the contact
  // record, the routing registry - because it already does all three for a
  // scanned QR and a card must not get an easier path for arriving over a wire.
  // Returns the peer ID once accepted, or null if the card does not hold up.
  onContactCard(card: Uint8Array, senderPubkey: string): string | null;
}

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
  // channel → unsubscribe for the NIP-09 deletions that can retract those
  // notes, scoped to the authors we have actually heard from. See
  // resubscribeDeletions for why this is not one standing filter.
  private readonly deletionSubscriptions = new Map<string, () => void>();
  // channel → authors of the notes we hold there, in the order we last saw
  // them, which is what MAX_DELETION_AUTHORS trims against.
  private readonly noteAuthors = new Map<string, Set<string>>();
  // channel → pending debounce for the above.
  private readonly deletionResubscribes = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();
  // The geo-DM peer → cell binding lives in chat-store (`geoDmCells`), NOT in a
  // field here. It used to be an in-memory Map, which meant it did not survive a
  // relaunch: see the note on that field for what a reply then did instead.
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

  // Mesh<->internet bridge hooks, injected by MeshService. Undefined in tests
  // and in an internet-only build.
  private readonly gateway?: GatewayHooks;

  constructor(
    client: NostrClient,
    signingPrivKey: Uint8Array,
    nickname: string,
    localPeerID: string,
    gateway?: GatewayHooks,
  ) {
    this.client = client;
    this.nickname = nickname;
    this.localPeerID = localPeerID;
    this.gateway = gateway;
    this.geohashSeed = deriveGeohashSeed(signingPrivKey);
    // Load the vendored relay directory synchronously. It is kept current by a
    // weekly CI sync from bitchat's reviewed list (see geo-relay-source.ts); we
    // never fetch it at runtime, so there is nothing to refresh here.
    this.relayDirectory.loadEntries(loadGeoRelays());
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

    // Decided here, once, from the state that actually exists - rather than
    // started as a side effect of a cell changing. Leaving every location
    // channel would otherwise leave a heartbeat timer running forever with
    // nothing to announce into.
    if (this.broadcastableCells().length > 0) this.startPresenceHeartbeat();
    else this.stopPresenceHeartbeat();

    // Every subscribe and unsubscribe above has landed, so this is the one place
    // the answer is settled. Publishing per-channel instead would flap through
    // "not listening anywhere" on the way past a cell change.
    this.publishLiveCells();
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
  // Public because the channel info sheet shows the user which relays carry the
  // cell they are in. Keyed on the geohash rather than the channel name because
  // every caller already holds one, and the sheet's is available earlier: it
  // reads a teleported cell straight off the channel name via manualGeohashOf,
  // which answers before refresh() has populated channelGeohash. Going back
  // through the channel would make the list depend on a lookup the caller had
  // no need for.
  //
  // Returns GEO_RELAY_COUNT relays plus any custom ones, so up to
  // GEO_RELAY_COUNT + MAX_CUSTOM_RELAYS. That total is exactly NostrClient's
  // per-call ceiling, which is what keeps the count shown in the info sheet
  // equal to the count actually contacted.
  relaysForGeohash(geohash: string): string[] {
    const nearest = this.relayDirectory.closestRelaysToGeohash(
      geohash,
      decodeGeohash,
      GEO_RELAY_COUNT,
    );
    const { geoRelayDiscovery, customRelays } = useSettingsStore.getState();
    return mergeGeoRelays(
      nearest,
      customRelays,
      geoRelayDiscovery,
      GEO_RELAY_COUNT,
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

  // Publish the cells we are currently listening for geo DMs in.
  //
  // The per-cell DM inbox is opened per SUBSCRIBED channel, so leaving the
  // channel - or simply moving until the cell resolves elsewhere - ends it with
  // nothing said. Sending still works either way (the key is derived from the
  // cell, not from where we are standing), so this is the RECEIVING half, and it
  // is the half a conversation goes quiet on. A thread compares its own cell
  // against this to say so out loud.
  //
  // `null` when we have no position, and that is load-bearing rather than lazy:
  // with no fix, "not listening there" and "no idea where we are" are the same
  // observation, and only one of them is worth telling somebody their
  // conversation has moved on from. Publishing null says nothing, which is the
  // honest answer to a question we cannot answer.
  private publishLiveCells(): void {
    if (!this.hasLocation) {
      useMeshStateStore.getState().setLiveGeoCells(null);
      return;
    }
    const live: string[] = [];
    for (const [channel, cell] of this.channelGeohash) {
      if (this.dmSubscriptions.has(channel)) live.push(cell);
    }
    useMeshStateStore.getState().setLiveGeoCells(live);
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
    const { event, delivered } = await this.presenceFor(
      geohash,
    ).publishChannelMessage(
      geohash,
      text,
      this.nickname,
      msgId,
      this.relaysForGeohash(geohash),
      // A teleported cell is one we are not standing in, so mark our posts
      // teleported for bitchat's participant list, matching its own clients.
      isManualGeoChannel(channel),
      // Skip the publish attempt (and its timeout) when no relay is live, so an
      // offline send ferries to a gateway immediately instead of after ~8s.
      this.client.isConnected,
    );
    if (!delivered) {
      // No relay reachable directly. If a nearby peer bridges to the internet,
      // hand it our signed event to publish on our behalf. The BLE broadcast of
      // this same message still happened, so this is additive, not a failure.
      this.gateway?.uplink(event, geohash);
    }
    return delivered;
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
      .filter((p) => p.lastSeenMs >= cutoff && !isBlockedPubkey(p.pubkey))
      .sort((a, b) => {
        // People physically here first, teleported below them, matching
        // bitchat's list ordering; within each group, most recent first.
        if (a.teleported !== b.teleported) return a.teleported ? 1 : -1;
        return b.lastSeenMs - a.lastSeenMs;
      });
  }

  // ---- Presence heartbeat ---------------------------------------------------

  // Tell the cells we are in that somebody is here.
  //
  // Without this an Airhop user reads the participant count and never appears
  // in anyone else's, on Airhop or bitchat. A room that says "2 people" when
  // five are reading it is worse than no count, because people act on it.
  //
  // Three rules from the cross-platform spec:
  //
  //   * Coarse cells only (precision <= 5), enforced in geohash-presence.ts.
  //   * Each cell signs with its own derived key, so being in the city cell and
  //     the region cell cannot be linked to one person.
  //   * Cells within a round are spaced 2-5s apart. Distinct keys arriving in
  //     the same instant, round after round, group by timing alone.
  private heartbeatTimer: ReturnType<typeof setTimeout> | null = null;

  // Spacing inside a round. A plain promise timer rather than a scheduler,
  // because the round is a sequence rather than a set of independent jobs.
  private static wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private startPresenceHeartbeat(): void {
    if (this.heartbeatTimer !== null) return;
    const tick = (): void => {
      void this.broadcastPresenceRound();
      this.heartbeatTimer = setTimeout(tick, nextHeartbeatDelayMs());
    };
    this.heartbeatTimer = setTimeout(tick, nextHeartbeatDelayMs());
  }

  private stopPresenceHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // The cells we may announce presence into right now.
  //
  // A teleported cell is somewhere the user is NOT. Announcing presence there
  // would be a false statement about their location, which is worse than an
  // undercount - and the `t=teleport` marker on messages exists precisely
  // because the two are different things. Fine-grained cells are excluded by
  // mayBroadcastPresence; see geohash-presence.ts for why that restriction is the
  // feature rather than a limitation.
  private broadcastableCells(): string[] {
    const cells = [...this.channelGeohash.entries()]
      .filter(([channel]) => !isManualGeoChannel(channel))
      .filter(([channel]) =>
        mayBroadcastPresence(GEO_CHANNEL_PRECISION[channel] ?? 99),
      )
      .map(([, geohash]) => geohash);
    return [...new Set(cells)];
  }

  // One round: a heartbeat into every cell we may announce into.
  private async broadcastPresenceRound(): Promise<void> {
    const unique = this.broadcastableCells();
    for (let i = 0; i < unique.length; i++) {
      if (i > 0) await GeohashChannelService.wait(decorrelationDelayMs());
      // The timer may have been cancelled while we were spacing the round out.
      if (this.heartbeatTimer === null) return;
      await this.presenceFor(unique[i])
        .publishHeartbeat(unique[i])
        .catch(() => {
          // Best-effort. Presence is a hint, and a relay that refuses one
          // heartbeat must not stop the next cell in the round.
        });
    }
  }

  stop(): void {
    this.stopPresenceHeartbeat();
    this.teardownAll();
    // The mesh is going down, so we are not listening anywhere and no longer
    // know whether we would be. Back to "cannot say" rather than "nowhere",
    // which would tell every location thread it had been left behind.
    useMeshStateStore.getState().setLiveGeoCells(null);
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
    if (isBlockedPubkey(event.pubkey)) return;
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

  // Whether this Nostr pubkey is someone we met in a location channel, i.e. the
  // caller must route a reply from our per-cell identity rather than our main
  // one. Returns the cell if so, and undefined for a peer who reached our
  // durable identity - where replying from it is the correct thing to do.
  //
  // Read from the persisted store rather than a field, so the answer is the same
  // on the first launch of a conversation and every one after it. The cell is
  // all that is needed: our per-cell key is derived from (seed, geohash), so we
  // can still write from it long after we have left the cell.
  geohashForGeoDmPeer(pubkey: string): string | undefined {
    return useChatStore.getState().geoDmCells[pubkey];
  }

  // Bind a participant's geohash pubkey to a cell, so tapping them in a channel
  // and sending first (before they message us) still routes correctly.
  // `displayName` is the `nick#last4` the channel rendered. Optional because the
  // inbound path has no nickname to offer: a geo DM carries none, so only the
  // channel that introduced the two people ever knows it.
  registerGeoDmPeer(
    pubkey: string,
    geohash: string,
    displayName?: string,
  ): void {
    useChatStore.getState().setGeoDmCell(pubkey, geohash, displayName);
  }

  // Send an end-to-end encrypted DM to a participant's per-geohash pubkey, from
  // our own per-geohash identity for that cell. Returns false if the content is
  // too long for one PrivateMessagePacket.
  //
  // The envelope names us by durable peer ID and omits the recipient, matching
  // bitchat (NostrTransport.sendPrivateMessageGeohash). Sealed, so no relay sees
  // it, but the recipient does from the first message. That ID carries no keys
  // and cannot be used to reach us, but it does not rotate per cell, so a
  // correspondent who meets us in two neighbourhoods can link the two. Public
  // channel notes carry nothing of the sort.
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

  // Hand our durable contact card to someone we met under a location-channel
  // pseudonym, so the two of us can keep talking once either of us moves.
  //
  // The one thing that can cross the gap per-cell identities create on purpose:
  // a cell key works only in its own cell, so both sides lose the thread as soon
  // as either one moves.
  //
  // What it discloses is the KEYS, not the name. Our peer ID already reached this
  // recipient inside every DM envelope (see sendGeoDm); what is new is the Noise,
  // Ed25519 and durable Nostr keys, which turn a handle they cannot use into an
  // identity they can verify, encrypt to and reach anywhere.
  //
  // Never automatic, and never a reply to receiving one. It has to be a tap.
  //
  // Still written from our PER-CELL key, like every other message in this
  // conversation. The card in the payload is what discloses us; the envelope
  // around it stays pseudonymous, so a relay learns nothing new.
  sendContactCard(
    geohash: string,
    recipientPubkey: string,
    card: Uint8Array,
  ): void {
    this.publishGeoWrap(
      geohash,
      recipientPubkey,
      encodeBitchatCardEnvelope(this.localPeerID, null, card),
    );
    this.registerGeoDmPeer(recipientPubkey, geohash);
  }

  // Flush queued read receipts for a geo-DM conversation when its thread opens.
  sendGeoReadReceipts(pubkey: string): void {
    const geohash = this.geohashForGeoDmPeer(pubkey);
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
      dm = unwrapDm(
        event,
        this.identityFor(geohash).privKey,
        GEO_DM_LOOKBACK_SECONDS,
      );
    } catch {
      return;
    }
    // Before the peer binding and before the delivery ack: a blocked person
    // must not learn we are here, and must not be able to reopen a thread the
    // block closed.
    if (isBlockedPubkey(dm.senderPubkey)) return;
    const env = decodeBitchatEnvelope(dm.content);
    if (env === null) return;

    // Resolved, not assumed. Once a card exchange completes we fold this
    // pseudonymous thread into the durable one - but the other side only stops
    // using this rail when OUR card reaches them, and that is a relay round trip
    // away. Anything they send in between arrives here addressed to a name that
    // is now an alias, and writing to it directly would file the message in a
    // thread the user can no longer open. resolveChannel is exactly the contract
    // for "anything still holding the old name".
    const pseudonymous = `dm:nostr_${dm.senderPubkey}`;
    const channel = useChatStore.getState().resolveChannel(pseudonymous);
    // Re-bound only while this is still a pseudonymous conversation. Completing
    // a card exchange deliberately drops the cell - once the thread is durable,
    // where we met is a location breadcrumb with nothing left to serve - and a
    // late message on the old rail must not quietly write it back.
    if (channel === pseudonymous) {
      this.registerGeoDmPeer(dm.senderPubkey, geohash);
    }

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
    // They chose to tell us who they durably are. Accepting it is what turns a
    // conversation that dies when either of us moves into one that does not.
    //
    // No bubble and no receipt: a card is not a message. What the reader gets is
    // the system line the mesh layer writes once the card has actually been
    // accepted - saying "they shared their contact" for one that failed its
    // binding check would be worse than silence.
    if (env.type === NoisePayloadType.CONTACT_CARD) {
      if (env.body !== undefined) {
        this.gateway?.onContactCard(env.body, dm.senderPubkey);
      }
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
        // Gateway downlink: hand every inbound relay event to the mesh layer,
        // which rebroadcasts it to mesh-only peers when this device is a
        // gateway. Runs before the own-echo/membership gates below because a
        // gateway must relay events for the cell whether or not it renders
        // them, and even for cells it is only bridging.
        this.gateway?.onRelayEvent(event, geohash);
        // Ignore the echo of our own publishes; the sender already rendered
        // the message optimistically.
        if (event.pubkey === selfPubkey) return;
        // Only surface traffic for channels the user is still in.
        if (!useChatStore.getState().channels.includes(channel)) return;
        // Below the gateway hand-off above on purpose: we stop reading them,
        // we do not stop carrying their traffic for the rest of the cell.
        if (isBlockedPubkey(event.pubkey)) return;

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
      [
        {
          kinds: [KIND_TEXT_NOTE],
          "#g": [geohash],
          since: Math.floor(Date.now() / 1000) - GEO_NOTE_LOOKBACK_SECONDS,
          limit: 200,
        },
      ],
      (event) => {
        // Only an author whose note we KEPT is worth asking about: our own
        // bridged copies and notes tagged to a neighbouring cell are both
        // dropped by handleLocationNote, and a deletion for either could never
        // apply to anything on screen.
        if (this.handleLocationNote(event, geohash, identity.pubKeyHex)) {
          this.rememberNoteAuthor(channel, geohash, event.pubkey);
        }
      },
      undefined,
      this.relaysForGeohash(geohash),
    );
    this.noteSubscriptions.set(channel, () => notesClose.close());
  }

  // Note the author of a note we now hold, and rebuild this cell's deletion
  // subscription if that is somebody new.
  private rememberNoteAuthor(
    channel: string,
    geohash: string,
    pubkey: string,
  ): void {
    let authors = this.noteAuthors.get(channel);
    if (authors === undefined) {
      authors = new Set();
      this.noteAuthors.set(channel, authors);
    }
    const known = authors.has(pubkey);
    // Re-inserted even when known, so the set stays ordered by last-seen and
    // the trim below drops the stalest rather than an arbitrary 128. Only a
    // genuinely new author is worth a resubscribe.
    authors.delete(pubkey);
    authors.add(pubkey);
    // Bounded to what a filter can carry, so a busy cell cannot grow this
    // without limit for the life of the subscription.
    while (authors.size > MAX_DELETION_AUTHORS) {
      const oldest = authors.values().next();
      if (oldest.done === true) break;
      authors.delete(oldest.value);
    }
    if (known) return;
    const pending = this.deletionResubscribes.get(channel);
    if (pending !== undefined) return;
    this.deletionResubscribes.set(
      channel,
      setTimeout(() => {
        this.deletionResubscribes.delete(channel);
        // The cell may have been left, or moved, during the debounce.
        if (this.channelGeohash.get(channel) !== geohash) return;
        this.resubscribeDeletions(channel, geohash);
      }, DELETION_RESUBSCRIBE_DEBOUNCE_MS),
    );
  }

  // Deletions that can retract the notes on screen, asked for BY AUTHOR.
  //
  // This used to ride the note subscription as a bare `{ kinds: [5], limit: 200 }`
  // - no author, no tag, no `since` - which is a request for every deletion
  // event the relay holds, and then a standing feed of every new one. Five
  // joined cells each opened one, across five geo relays apiece, so a launch
  // with internet pulled thousands of events that had nothing to do with this
  // app. Every one of them costs a SHA-256 and a schnorr verify inside
  // nostr-tools' socket handler, on the JS thread, before our handler is even
  // reached. That is what froze the app on a fresh install with WiFi on: the
  // radar's sonar loop stopped between pulses, the tab bar stopped answering,
  // and turning WiFi off "fixed" it because with no relay reachable the flood
  // never arrived.
  //
  // Scoping by author loses nothing. handleNoteDeletion already refuses any
  // deletion not signed by the same key that signed the note - `e` tags are
  // free to write - so a deletion from an author we hold no note from could
  // never have applied. What used to be filtered after paying for it is now
  // filtered by the relay.
  private resubscribeDeletions(channel: string, geohash: string): void {
    const close = this.deletionSubscriptions.get(channel);
    if (close !== undefined) {
      close();
      this.deletionSubscriptions.delete(channel);
    }
    const authors = [...(this.noteAuthors.get(channel) ?? [])];
    if (authors.length === 0) return;
    const deletionsClose = this.client.subscribe(
      [
        {
          kinds: [KIND_DELETION],
          authors,
          // A deletion older than the notes it could retract is unusable.
          since: Math.floor(Date.now() / 1000) - GEO_NOTE_LOOKBACK_SECONDS,
        },
      ],
      (event) => this.handleNoteDeletion(event),
      undefined,
      this.relaysForGeohash(geohash),
    );
    this.deletionSubscriptions.set(channel, () => deletionsClose.close());
  }

  // Apply a NIP-09 deletion to the notes on screen. The authorship check is the
  // whole mechanism: `e` tags are free to write, so a deletion only counts for
  // events signed by the same key that signed the note.
  private handleNoteDeletion(event: NostrEvent): void {
    const notices = useNoticesStore.getState();
    // Flattened once per event rather than once per `e` tag. A deletion may
    // carry many, and the old shape rebuilt the whole cross-cell note list and
    // rescanned it for each one - work that grows with the product of the two.
    let held: { id: string; pubkey: string }[] | null = null;
    for (const [tag, value] of event.tags) {
      if (tag !== "e" || value === undefined) continue;
      held ??= Object.values(notices.notesByGeohash).flat();
      const target = held.find((n) => n.id === value);
      if (target === undefined || target.pubkey !== event.pubkey) continue;
      notices.removeNote(value);
    }
  }

  // Parse a kind-1 location note into the notices store. Our own bridged copy
  // is skipped: the signed board post already renders it, carrying urgency and
  // supporting merged deletion.
  //
  // Returns whether the note was kept, which is what decides whether its author
  // is worth watching for deletions. See rememberNoteAuthor.
  private handleLocationNote(
    event: NostrEvent,
    geohash: string,
    selfPubkey: string,
  ): boolean {
    if (event.pubkey === selfPubkey) return false;
    const matched = event.tags.find(
      ([t, v]) => t === TAG_GEOHASH && v === geohash,
    );
    if (matched === undefined) return false;
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
          nickname !== undefined && nickname.length > 0
            ? nickname
            : t("notif.someone"),
        preview: `${isUrgent ? "Urgent notice · " : "Notice · "}${event.content}`,
        timestampMs: createdAtMs,
        kind: "notice",
        geohash,
      });
    }
    return true;
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
    const deletionsClose = this.deletionSubscriptions.get(channel);
    if (deletionsClose !== undefined) {
      deletionsClose();
      this.deletionSubscriptions.delete(channel);
    }
    const resubscribe = this.deletionResubscribes.get(channel);
    if (resubscribe !== undefined) {
      clearTimeout(resubscribe);
      this.deletionResubscribes.delete(channel);
    }
    // Dropped with the subscription: the authors belong to the cell that was
    // just left, and carrying them into the next one would ask its relays for
    // deletions by people who never posted there.
    this.noteAuthors.delete(channel);
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
