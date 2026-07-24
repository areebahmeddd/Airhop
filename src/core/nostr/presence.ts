// Geohash presence heartbeats: kind 20001 ephemeral Nostr events.
//
// When the user has location permission, GeohashPresence broadcasts a kind
// 20001 event to the geohash channel(s) that cover their current location.
// The event content is the geohash string itself. Subscribers learn that the
// sender's Nostr pubkey is in that geohash cell.
//
// Privacy: presence is only broadcast at precision-5 (~5 km × 5 km) and
// coarser cells: never at precision 6+ which would reveal exact location.
// Presence heartbeats are ephemeral (kind 2xxxx in Nostr) and are not
// persisted by relays.
//
// Heartbeat interval: 40–80 s (jittered) matching bitchat iOS behavior.

import type { Event } from "nostr-tools";
import { finalizeEvent } from "nostr-tools";
import type { EventHandler, NostrClient } from "./nostr-client";

// Event kind constants per PROTOCOLS.md section 8.
export const KIND_PRESENCE = 20001;
const KIND_GEOHASH_CHANNEL = 20000;

// Geohash precision per PROTOCOLS.md section 8 (~5 km × 5 km cell).
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

// A pubkey counts as present if seen (via either kind) within this window.
export const PARTICIPANT_ONLINE_MS = 5 * 60 * 1000;

// Tag carrying the sender's cross-transport message ID, used to collapse the
// BLE and Nostr copies of one message into a single bubble.
export const TAG_MESSAGE_ID = "mid";

// ---- Geohash encoding -------------------------------------------------------

const BASE32_CHARS = "0123456789bcdefghjkmnpqrstuvwxyz";

// Encode (lat, lng) to a geohash string of the given precision (1–9).
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

// ---- GeohashPresence --------------------------------------------------------

export interface PresenceConfig {
  nostrPrivKey: Uint8Array; // secp256k1 private key for Nostr event signing
}

export interface PeerPresence {
  pubkey: string; // Nostr pubkey (hex)
  geohash: string; // Where they were seen
  timestamp: number; // Unix seconds
}

export class GeohashPresence {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private currentLat: number | null = null;
  private currentLng: number | null = null;
  private readonly privKey: Uint8Array;
  private readonly client: NostrClient;

  constructor(config: PresenceConfig, client: NostrClient) {
    this.privKey = config.nostrPrivKey;
    this.client = client;
  }

  // Update the current GPS position and broadcast immediately, then restart
  // the heartbeat timer.
  updateLocation(lat: number, lng: number): void {
    this.currentLat = lat;
    this.currentLng = lng;
    this.broadcastNow();
    this.scheduleNext();
  }

  // Stop broadcasting presence heartbeats.
  stop(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.currentLat = null;
    this.currentLng = null;
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
  async publishChannelMessage(
    geohash: string,
    content: string,
    nickname?: string,
    msgId?: string,
    relays?: string[],
  ): Promise<void> {
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
    const event = finalizeEvent(
      {
        kind: KIND_GEOHASH_CHANNEL,
        created_at: Math.floor(Date.now() / 1000),
        tags,
        content,
      },
      this.privKey,
    );
    await this.client.publish(event, relays);
  }

  // ---- Private ---------------------------------------------------------------

  private broadcastNow(): void {
    if (this.currentLat === null || this.currentLng === null) return;
    const lat = this.currentLat;
    const lng = this.currentLng;

    // Broadcast at each allowed precision level.
    for (const precision of ALLOWED_PRECISIONS) {
      const geohash = encodeGeohash(lat, lng, precision);
      this.publishPresence(geohash).catch(() => {
        // Best-effort: ignore relay errors for ephemeral presence
      });
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

  private scheduleNext(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    const interval =
      HEARTBEAT_MIN_MS + Math.random() * (HEARTBEAT_MAX_MS - HEARTBEAT_MIN_MS);
    this.timer = setTimeout(() => {
      this.broadcastNow();
      this.scheduleNext();
    }, interval);
  }
}

// ---- Helpers ----------------------------------------------------------------

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
