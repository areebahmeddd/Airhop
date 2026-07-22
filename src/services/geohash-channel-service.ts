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

import { GeoRelayDirectory } from "../core/nostr/geo-relay";
import {
  deriveGeohashIdentity,
  deriveGeohashSeed,
  geohashDisplayName,
  type GeohashIdentity,
} from "../core/nostr/geohash-identity";
import type { NostrClient } from "../core/nostr/nostr-client";
import {
  decodeGeohash,
  encodeGeohash,
  GeohashPresence,
  KIND_PRESENCE,
  TAG_MESSAGE_ID,
} from "../core/nostr/presence";
import { GEO_RELAYS } from "../data/relays";
import { useChatStore } from "../store/chat-store";
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

// How long a sender stays listed as present in a channel after their last post.
const PARTICIPANT_TTL_MS = 10 * 60 * 1000;

// Nostr tag carrying the sender's chosen display name. Nostr events identify
// the author only by pubkey, so without this every geohash message would show
// as a raw hex string.
const TAG_NICKNAME = "n";

export interface GeoParticipant {
  pubkey: string;
  nickname: string;
  lastSeenMs: number;
}

export class GeohashChannelService {
  private readonly client: NostrClient;
  private readonly relayDirectory = new GeoRelayDirectory();
  private readonly nickname: string;
  // Seed for per-geohash key derivation. Never published.
  private readonly geohashSeed: Uint8Array;

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
  ) {
    this.client = client;
    this.nickname = nickname;
    this.geohashSeed = deriveGeohashSeed(signingPrivKey);
    this.relayDirectory.loadEntries(GEO_RELAYS);
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

  // The 5 relays carrying a given cell. Chosen from the cell's CENTRE so every
  // participant converges on the same set. See closestRelaysToGeohash.
  relaysForChannel(channel: string, count = 5): string[] {
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
          timestampMs: event.created_at * 1000,
          isMine: false,
        });
      },
    );
    this.subscriptions.set(channel, close);
  }

  private unsubscribeChannel(channel: string): void {
    const close = this.subscriptions.get(channel);
    if (close !== undefined) {
      close();
      this.subscriptions.delete(channel);
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
