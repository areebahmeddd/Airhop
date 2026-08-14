// Geohash presence heartbeats: kind 20001 ephemeral Nostr events.
//
// When the user has location permission, GeohashPresence broadcasts a kind
// 20001 event to the geohash channel(s) that cover their current location.
// The event content is the geohash string itself. Subscribers learn that the
// sender's Nostr pubkey is in that geohash cell.
//
// Privacy: presence is only broadcast at precision-5 (~5 km x 5 km) and
// coarser cells: never at precision 6+ which would reveal exact location.
// Presence heartbeats are ephemeral (kind 2xxxx in Nostr) and are not
// persisted by relays.
//
// Heartbeat interval: 40-80 s (jittered) matching bitchat iOS behavior.

import type { Event } from "nostr-tools";
import { finalizeEvent } from "nostr-tools";
import type { EventHandler, NostrClient } from "./nostr-client";

// Event kind constants per PROTOCOLS.md section 8.
export const KIND_PRESENCE = 20001;
const KIND_GEOHASH_CHANNEL = 20000;

// Geohash precision per PROTOCOLS.md section 8 (~5 km x 5 km cell).
const PRESENCE_PRECISION = 5;

// Allowed broadcast precisions (privacy: no fine-grained location).
const ALLOWED_PRECISIONS: ReadonlySet<number> = new Set([2, 4, 5]);

// Heartbeat interval range in milliseconds.
const HEARTBEAT_MIN_MS = 40_000;
const HEARTBEAT_MAX_MS = 80_000;

// Opening a channel replays up to an hour of recent traffic, so the room isn't
// empty on arrival. Capped so a busy cell can't flood the client on join.
const CHANNEL_LOOKBACK_SECONDS = 3600;
const CHANNEL_INITIAL_LIMIT = 200;

// Tag carrying the sender's cross-transport message ID, used to collapse the
// BLE and Nostr copies of one message into a single bubble.
export const TAG_MESSAGE_ID = "mid";

const BASE32_CHARS = "0123456789bcdefghjkmnpqrstuvwxyz";

// Encode (lat, lng) to a geohash string of the given precision (1-9).
export function encodeGeohash(
  lat: number,
  lng: number,
  precision: number = PRESENCE_PRECISION,
): string {
  let minLat = -90,
    maxLat = 90;
  let minLng = -180,
    maxLng = 180;
  let hash = "";
  let bits = 0;
  let bitCount = 0;
  let isLng = true; // interleave: longitude bits first

  while (hash.length < precision) {
    if (isLng) {
      const mid = (minLng + maxLng) / 2;
      if (lng >= mid) {
        bits = (bits << 1) | 1;
        minLng = mid;
      } else {
        bits = bits << 1;
        maxLng = mid;
      }
    } else {
      const mid = (minLat + maxLat) / 2;
      if (lat >= mid) {
        bits = (bits << 1) | 1;
        minLat = mid;
      } else {
        bits = bits << 1;
        maxLat = mid;
      }
    }
    isLng = !isLng;
    bitCount++;

    if (bitCount === 5) {
      hash += BASE32_CHARS[bits];
      bits = 0;
      bitCount = 0;
    }
  }

  return hash;
}

// Decode a geohash string to its bounding box center.
export function decodeGeohash(hash: string): { lat: number; lng: number } {
  let minLat = -90,
    maxLat = 90;
  let minLng = -180,
    maxLng = 180;
  let isLng = true;

  for (const char of hash) {
    const idx = BASE32_CHARS.indexOf(char);
    if (idx < 0) break;
    for (let bit = 4; bit >= 0; bit--) {
      const bitVal = (idx >> bit) & 1;
      if (isLng) {
        const mid = (minLng + maxLng) / 2;
        if (bitVal) minLng = mid;
        else maxLng = mid;
      } else {
        const mid = (minLat + maxLat) / 2;
        if (bitVal) minLat = mid;
        else maxLat = mid;
      }
      isLng = !isLng;
    }
  }

  return {
    lat: (minLat + maxLat) / 2,
    lng: (minLng + maxLng) / 2,
  };
}

export interface PresenceConfig {
  nostrPrivKey: Uint8Array; // secp256k1 private key for Nostr event signing
}

export interface PeerPresence {
  pubkey: string; // Nostr pubkey (hex)
  geohash: string; // Where they were seen
  timestamp: number; // Unix seconds
}

// Whether presence may be broadcast into a cell of this precision.
//
// A heartbeat is a public statement that you are inside a cell. At precision 6
// and finer that cell is a neighbourhood, a block, a building; region, province
// and city are coarse enough that "someone is here" says little about who.
//
// The spec states the UI consequence: a fine-grained channel showing "0 people"
// would be wrong, since nobody announces themselves there, so it shows
// "? people" instead.
export function mayBroadcastPresence(precision: number): boolean {
  return ALLOWED_PRECISIONS.has(precision);
}

export class GeohashPresence {
  private readonly privKey: Uint8Array;
  private readonly client: NostrClient;

  constructor(config: PresenceConfig, client: NostrClient) {
    this.privKey = config.nostrPrivKey;
    this.client = client;
  }

  // Announce that we are in this cell, signed with this cell's key.
  //
  // One cell per call. Publishing every allowed precision from one object put
  // the same key in the region, province and city cells at once, which a relay
  // can stitch into one person's location. Cadence and cell selection belong to
  // the caller, which knows which channels the user is in.
  async publishHeartbeat(geohash: string): Promise<void> {
    await this.publishPresence(geohash);
  }

  // Nothing to tear down: the schedule lives with the caller.
  stop(): void {
    // Kept so callers can treat every presence object the same way.
  }

  // Subscribe to presence heartbeats in all geohash cells that cover (lat, lng).
  // Returns a closer function. The callback receives one PeerPresence per event.
  subscribePresence(
    lat: number,
    lng: number,
    onPresence: (p: PeerPresence) => void,
  ): () => void {
    const geohashes = ancestorGeohashes(lat, lng);
    const filter = {
      kinds: [KIND_PRESENCE],
      "#g": geohashes,
      since: Math.floor(Date.now() / 1000) - (HEARTBEAT_MAX_MS * 3) / 1000,
    };

    const closer = this.client.subscribe([filter], (event: Event) => {
      if (event.kind !== KIND_PRESENCE) return;
      const g = event.tags.find(([t]) => t === "g")?.[1];
      if (!g) return;
      onPresence({
        pubkey: event.pubkey,
        geohash: g,
        timestamp: event.created_at,
      });
    });

    return () => closer.close();
  }

  // Subscribe to a geohash channel: chat messages AND presence heartbeats.
  //
  // Both kinds share one subscription because both count as "this pubkey is
  // here" for the participant list. The one-hour lookback lets someone opening
  // a channel see recent conversation instead of an empty room, and the limit
  // caps the initial replay burst.
  subscribeChannel(
    geohash: string,
    onEvent: EventHandler,
    relays?: string[],
  ): () => void {
    const filter = {
      kinds: [KIND_GEOHASH_CHANNEL, KIND_PRESENCE],
      "#g": [geohash],
      since: Math.floor(Date.now() / 1000) - CHANNEL_LOOKBACK_SECONDS,
      limit: CHANNEL_INITIAL_LIMIT,
    };
    const closer = this.client.subscribe([filter], onEvent, undefined, relays);
    return () => closer.close();
  }

  // Publish a public message to a geohash channel (kind 20000).
  //
  // `nickname` rides along in an "n" tag: a Nostr event identifies its author
  // only by pubkey, so without it every geohash message would render as a raw
  // hex string with no way to tell participants apart. It is self-asserted and
  // unverified, the same trust level as a nickname in any public chat room.
  // Returns the signed event and whether a relay ACKed it. On failure the caller
  // still gets the event so it can be ferried to an internet gateway peer over
  // the mesh (uplink carrier) instead of being lost. Pass relaysConnected=false
  // to skip the relay publish entirely (we know we are offline), so the caller
  // ferries immediately instead of waiting a full publish timeout to fail.
  async publishChannelMessage(
    geohash: string,
    content: string,
    nickname?: string,
    msgId?: string,
    relays?: string[],
    teleported = false,
    relaysConnected = true,
  ): Promise<{ event: Event; delivered: boolean }> {
    const tags: string[][] = [["g", geohash]];
    if (nickname !== undefined && nickname.length > 0) {
      tags.push(["n", nickname.slice(0, 32)]);
    }
    // Sender-assigned ID shared with the BLE copy of this same message. A
    // receiver on both transports would otherwise see it twice, and because
    // the Nostr copy is signed with a per-geohash key, apparently from two
    // different people. Unknown tags are ignored by other clients, so this is
    // additive and safe.
    if (msgId !== undefined && msgId.length > 0) {
      tags.push([TAG_MESSAGE_ID, msgId.slice(0, 32)]);
    }
    // Teleport marker: this sender is posting into a cell they are not
    // physically in. bitchat tags the same way (["t","teleport"]) so its
    // participant list shows them as teleported rather than nearby.
    if (teleported) tags.push(["t", "teleport"]);
    const event = finalizeEvent(
      {
        kind: KIND_GEOHASH_CHANNEL,
        created_at: Math.floor(Date.now() / 1000),
        tags,
        content,
      },
      this.privKey,
    );
    // Known offline: don't spend a publish timeout on a doomed send. Hand the
    // signed event straight back so the caller can ferry it over the mesh.
    if (!relaysConnected) return { event, delivered: false };
    try {
      await this.client.publish(event, relays);
      return { event, delivered: true };
    } catch {
      // No relay ACKed (offline, or none reachable for this cell). The event is
      // fully signed and valid; the caller decides whether to ferry it.
      return { event, delivered: false };
    }
  }

  private async publishPresence(geohash: string): Promise<void> {
    const event = finalizeEvent(
      {
        kind: KIND_PRESENCE,
        created_at: Math.floor(Date.now() / 1000),
        // Presence carries the geohash tag and NOTHING else: no nickname, and
        // an empty body. A heartbeat says "someone is in this cell". Attaching
        // a name would turn a presence beacon into a location disclosure tied
        // to a person. Names travel only on chat events the user chose to send.
        tags: [["g", geohash]],
        content: "",
      },
      this.privKey,
    );
    await this.client.publish(event);
  }
}

// How long to wait before the next round of heartbeats. Randomised 40-80s per
// the spec: a fixed cadence is itself a fingerprint, and the average of 60s is
// what keeps a peer inside everyone else's five-minute online window with room
// for a missed round.
export function nextHeartbeatDelayMs(
  random: () => number = Math.random,
): number {
  return HEARTBEAT_MIN_MS + random() * (HEARTBEAT_MAX_MS - HEARTBEAT_MIN_MS);
}

// Gap between two cells' heartbeats inside one round, 2-5s per the spec.
//
// Each cell uses a different derived key, but publishing them together still
// leaks: three unfamiliar pubkeys arriving in the same instant, round after
// round, group into one device by timing alone.
export function decorrelationDelayMs(
  random: () => number = Math.random,
): number {
  return 2_000 + random() * 3_000;
}

// Build the list of geohash strings at all ancestor precisions for (lat, lng).
// Used to subscribe to presence across multiple precision levels at once.
function ancestorGeohashes(lat: number, lng: number): string[] {
  const hashes: string[] = [];
  const full = encodeGeohash(lat, lng, PRESENCE_PRECISION);
  for (let p = 1; p <= PRESENCE_PRECISION; p++) {
    hashes.push(full.slice(0, p));
  }
  return hashes;
}
