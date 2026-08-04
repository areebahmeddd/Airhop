// Signed ANNOUNCE broadcast manager.
//
// Every peer periodically broadcasts a signed ANNOUNCE packet so others can
// discover its identity, Noise public key, and signing key. This is the entry
// point for peer discovery: receiving a valid ANNOUNCE is how a node learns
// another peer's senderID → signingPubKey mapping.
//
// ANNOUNCE payload format (TLV, per PROTOCOLS.md section 3):
//   0x01  nickname           (UTF-8, up to 32 bytes)
//   0x02  Noise static pub   (32 bytes X25519)
//   0x03  Ed25519 signing pub (32 bytes)
//   0x04  neighbor IDs       (optional, up to 10 x 8 bytes)
//   0x05  Nostr secp256k1 pub (32 bytes X-only, Airhop extension, ignored by bitchat)
//
// Broadcast interval: 30 seconds.
import { hexToBytes } from "@noble/hashes/utils.js";
import type { Identity } from "../crypto/identity";
import { normalizeNickname } from "./nickname";
import {
  Flags,
  PacketType,
  signPacket,
  verifyPacket,
  type Packet,
} from "./packet-codec";

// Announce cadence adapts to whether we can currently hear anyone, matching
// bitchat: broadcast quickly while isolated so a lone pair of devices discovers
// each other fast, then back off to a jittered 15-30s once connected to keep
// steady-state traffic (and battery) low.
const ANNOUNCE_ISOLATED_MS = 4_000;
const ANNOUNCE_CONNECTED_MIN_MS = 15_000;
const ANNOUNCE_CONNECTED_MAX_MS = 30_000;

// TTL stamped on every outgoing ANNOUNCE. Receivers use this to tell a direct
// announce from a relayed one: FloodRouter decrements TTL on each hop, so a
// packet still carrying ANNOUNCE_TTL came straight from its originator.
// Exported so mesh-service can't drift out of sync with the value used here.
export const ANNOUNCE_TTL = 7;

// How far an ANNOUNCE's timestamp may sit from our own clock before we refuse
// it. Without a bound, a captured announce can be rebroadcast forever: it stays
// correctly signed and correctly key-bound, so every other check passes, and a
// peer who left hours ago keeps reappearing in the room.
//
// Both upstreams bound this, but differently, so this is a choice rather than a
// port. iOS uses 900s and only looks backwards (BLEPacketFreshnessPolicy:
// `timestamp < now - maxAge`); Android uses 10 minutes and compares the
// absolute difference (AnnouncementIdentityValidator MAX_CLOCK_SKEW_MS), which
// also rejects timestamps from the future.
//
// We take 15 minutes AND make it symmetric, which is the union of what the two
// accept: never tighter than either upstream in the direction it checks, so no
// announce that a bitchat device would accept is refused here. The forward
// bound is the cheap half - it costs nothing and stops a peer parking a
// far-future timestamp, which is the obvious way to make a packet that never
// goes stale.
export const ANNOUNCE_MAX_SKEW_MS = 15 * 60 * 1000;

// Whether an ANNOUNCE is close enough to our clock to act on.
//
// The `now < ANNOUNCE_MAX_SKEW_MS` guard accepts everything early in the epoch
// rather than underflowing. iOS does the same thing for the same reason: a
// device whose clock has not been set yet should still be able to join a mesh,
// and unsigned subtraction on a near-zero clock is how that turns into silently
// dropping every packet instead.
export function isAnnounceFresh(
  timestampMs: number,
  nowMs: number,
  maxSkewMs = ANNOUNCE_MAX_SKEW_MS,
): boolean {
  if (nowMs < maxSkewMs) return true;
  return Math.abs(nowMs - timestampMs) <= maxSkewMs;
}

// ANNOUNCE TLV types. 0x01–0x06 are bitchat's (Packets.swift TLVType); we must
// not reuse them. bitchat's 0x05 is a capabilities bitfield and 0x06 is a bridge
// geohash. Reading either as our Nostr key (or vice versa) would corrupt both
// sides, so our Nostr pubkey lives at 0x07, which bitchat skips as unknown.
const TLV_NICKNAME = 0x01;
const TLV_NOISE_PUB = 0x02;
const TLV_SIGNING_PUB = 0x03;
const TLV_NEIGHBORS = 0x04;
const TLV_CAPABILITIES = 0x05; // bitchat capabilities bitfield (little-endian)
const TLV_BRIDGE_GEOHASH = 0x06; // bitchat bridge cell (decoded, ignored)
const TLV_NOSTR_PUB = 0x07; // Airhop extension: secp256k1 X-only Nostr pubkey

// Capability bits, byte-for-byte with bitchat PeerCapabilities (BitFoundation).
// Advertised in ANNOUNCE TLV 0x05 so peers can degrade per-feature.
export const Capability = {
  prekeys: 1 << 0,
  wifiBulk: 1 << 1,
  gateway: 1 << 2,
  groups: 1 << 3,
  board: 1 << 4,
  vouch: 1 << 5,
  meshDiagnostics: 1 << 6,
  bridge: 1 << 7,
  // Finalized direct-message media encrypted as Noise payload 0x20 before
  // outer BLE fragmentation. A peer without this bit needs the signed directed
  // raw-file path, which is not confidential and is being retired.
  //
  // A discovery hint only: enough to start a handshake, never enough to select
  // encrypted sending or create a pin. Anyone can copy a victim's public Noise
  // key and self-sign an announce carrying whatever bits they like, so only the
  // same bit inside an authenticated 0x21 decides anything. Same rule bitchat
  // applies to its own private-media migration.
  privateMedia: 1 << 8,
  // Stable private-media IDs are durably deduplicated by the receiver, so a
  // sender may safely retry. Does not replace bit 8; it only adds retry.
  privateMediaReceipts: 1 << 9,
} as const;

// Minimal little-endian encoding with trailing zero bytes dropped, always at
// least one byte so an empty set stays distinct from an absent TLV. Mirrors
// bitchat PeerCapabilities.encoded().
export function encodeCapabilities(bits: number): Uint8Array {
  let value = bits >>> 0;
  const bytes: number[] = [];
  do {
    bytes.push(value & 0xff);
    value = Math.floor(value / 256);
  } while (value !== 0);
  return new Uint8Array(bytes);
}

// Reads the low bytes into a JS-safe integer; bytes beyond the defined bits are
// ignored for forward compatibility. Mirrors bitchat PeerCapabilities(encoded:).
export function decodeCapabilities(value: Uint8Array): number {
  let bits = 0;
  const n = Math.min(value.length, 6); // stay within 2^48 to avoid float loss
  for (let i = 0; i < n; i++) bits += value[i] * 2 ** (8 * i);
  return bits;
}

export interface AnnounceInfo {
  senderID: Uint8Array; // 8 bytes
  nickname: string;
  noisePubKey: Uint8Array; // 32 bytes X25519
  signingPubKey: Uint8Array; // 32 bytes Ed25519
  neighborIDs: Uint8Array[]; // up to 10 x 8 bytes
  nostrPubKey?: Uint8Array; // 32 bytes secp256k1 X-only (Airhop extension)
  capabilities: number; // bitchat capability bits (TLV 0x05); 0 when absent
  bridgeGeohash?: string; // rendezvous cell a bridge peer advertises (TLV 0x06)
}

function writeTlv(buf: number[], type: number, value: Uint8Array): void {
  buf.push(type, value.length, ...value);
}

// The nickname TLV budget, in BYTES of UTF-8 (see the layout note at the top).
const NICKNAME_MAX_BYTES = 32;

// Fit a nickname into the TLV, canonicalized first.
//
// Truncation counts UTF-8 bytes and drops whole code points. Slicing the string
// instead would count UTF-16 units, which is the wrong unit twice over: a name
// of 32 emoji is 128 bytes, four times the budget, and a slice can land in the
// middle of a surrogate pair and emit a lone half that decodes to a replacement
// character on the far side.
function fitNickname(nickname: string): Uint8Array {
  const encoder = new TextEncoder();
  const codePoints = [...normalizeNickname(nickname)];
  let bytes = encoder.encode(codePoints.join(""));
  while (bytes.length > NICKNAME_MAX_BYTES) {
    codePoints.pop();
    bytes = encoder.encode(codePoints.join(""));
  }
  return bytes;
}

export function encodeAnnouncePayload(
  identity: Identity,
  nickname: string,
  neighborIDs: readonly Uint8Array[] = [],
  nostrPubKey?: Uint8Array,
  capabilities = 0,
  bridgeGeohash?: string,
): Uint8Array {
  const nicknameBytes = fitNickname(nickname);
  const buf: number[] = [];

  writeTlv(buf, TLV_NICKNAME, nicknameBytes);
  writeTlv(buf, TLV_NOISE_PUB, identity.noiseStaticPubKey);
  writeTlv(buf, TLV_SIGNING_PUB, identity.signingPubKey);

  if (neighborIDs.length > 0) {
    const capped = neighborIDs.slice(0, 10);
    const neighborBytes = new Uint8Array(capped.length * 8);
    for (let i = 0; i < capped.length; i++) {
      neighborBytes.set(capped[i].slice(0, 8), i * 8);
    }
    writeTlv(buf, TLV_NEIGHBORS, neighborBytes);
  }

  // Only advertise capabilities when we have some: a peer with no bits looks
  // like an old client (no TLV), matching bitchat's nil-when-absent semantics.
  if (capabilities !== 0) {
    writeTlv(buf, TLV_CAPABILITIES, encodeCapabilities(capabilities));
  }

  // Bridge rendezvous cell (TLV 0x06): a bridge gateway advertises the geohash
  // cell it ferries so mesh-only peers know which cell to deposit into. Only
  // written when set (a non-bridging peer omits it, like bitchat).
  if (bridgeGeohash !== undefined && bridgeGeohash.length > 0) {
    const cellBytes = new TextEncoder().encode(bridgeGeohash.slice(0, 12));
    writeTlv(buf, TLV_BRIDGE_GEOHASH, cellBytes);
  }

  if (nostrPubKey !== undefined && nostrPubKey.length === 32) {
    writeTlv(buf, TLV_NOSTR_PUB, nostrPubKey);
  }

  return new Uint8Array(buf);
}

export function decodeAnnouncePayload(
  payload: Uint8Array,
  senderID: Uint8Array,
): AnnounceInfo | null {
  let offset = 0;
  let nickname = "";
  let noisePubKey: Uint8Array | null = null;
  let signingPubKey: Uint8Array | null = null;
  let nostrPubKey: Uint8Array | undefined;
  let capabilities = 0;
  let bridgeGeohash: string | undefined;
  const neighborIDs: Uint8Array[] = [];

  while (offset + 2 <= payload.length) {
    const type = payload[offset];
    const length = payload[offset + 1];
    offset += 2;

    if (offset + length > payload.length) break;
    const value = payload.slice(offset, offset + length);
    offset += length;

    switch (type) {
      case TLV_NICKNAME:
        // Canonicalized at the point it enters the app, so everything
        // downstream (registry, peer store, mentions, autocomplete) compares
        // one form. See nickname.ts for why the two encodings exist.
        nickname = normalizeNickname(new TextDecoder().decode(value));
        break;
      case TLV_NOISE_PUB:
        if (value.length === 32) noisePubKey = value;
        break;
      case TLV_SIGNING_PUB:
        if (value.length === 32) signingPubKey = value;
        break;
      case TLV_NEIGHBORS:
        for (let i = 0; i + 8 <= value.length; i += 8) {
          neighborIDs.push(value.slice(i, i + 8));
        }
        break;
      case TLV_CAPABILITIES:
        capabilities = decodeCapabilities(value);
        break;
      case TLV_BRIDGE_GEOHASH:
        bridgeGeohash = new TextDecoder().decode(value);
        break;
      case TLV_NOSTR_PUB:
        if (value.length === 32) nostrPubKey = value;
        break;
    }
  }

  if (!noisePubKey || !signingPubKey) return null;

  return {
    senderID,
    nickname,
    noisePubKey,
    signingPubKey,
    neighborIDs,
    nostrPubKey,
    capabilities,
    bridgeGeohash,
  };
}

export type SendPacketFn = (packet: Packet) => void;

export class AnnounceManager {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private broadcastFn: (() => void) | null = null;

  // Build and return a signed ANNOUNCE packet ready to send.
  // Pass neighborIDs (each 8 bytes) to include TLV 0x04 so topology gossip works.
  // Pass nostrPubKey (32 bytes secp256k1 X-only) to include TLV 0x07 for Nostr DMs.
  // Pass capabilities (bitchat capability bits) to include TLV 0x05.
  buildPacket(
    identity: Identity,
    nickname: string,
    neighborIDs: readonly Uint8Array[] = [],
    nostrPubKey?: Uint8Array,
    capabilities = 0,
    bridgeGeohash?: string,
  ): Packet {
    const payload = encodeAnnouncePayload(
      identity,
      nickname,
      [...neighborIDs],
      nostrPubKey,
      capabilities,
      bridgeGeohash,
    );
    const senderIDBytes = hexToBytes(identity.peerID);

    const packet: Packet = {
      type: PacketType.ANNOUNCE,
      ttl: ANNOUNCE_TTL,
      flags: Flags.SIGNED, // broadcast: no HAS_RECIPIENT, always signed
      senderID: senderIDBytes,
      recipientID: new Uint8Array(8), // all-zeros = broadcast
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload,
    };

    packet.signature = signPacket(packet, identity.signingPrivKey);
    return packet;
  }

  // Start broadcasting ANNOUNCE packets.
  //
  // The interval adapts to connectivity: ~4s while isolated (no peers), then a
  // jittered 15-30s once at least one peer is connected. Pass getPeerCount so
  // the manager can tell which state it is in on each tick.
  //
  // Pass getNeighborIDs to include TLV 0x04 in each ANNOUNCE. The callback is
  // called on every broadcast tick so the neighbor list stays current.
  // Pass nostrPubKey to include TLV 0x05 (constant for the session lifetime).
  // Pass getCapabilities to include TLV 0x05; it is read on every tick so a
  // toggled capability (e.g. the internet gateway) rides the next announce.
  start(
    identity: Identity,
    nickname: string,
    send: SendPacketFn,
    getNeighborIDs?: () => readonly Uint8Array[],
    nostrPubKey?: Uint8Array,
    getPeerCount?: () => number,
    getCapabilities?: () => number,
    getBridgeGeohash?: () => string | undefined,
  ): void {
    if (this.timer !== null) this.stop();

    const broadcast = (): void => {
      const neighbors = getNeighborIDs?.() ?? [];
      const capabilities = getCapabilities?.() ?? 0;
      const bridgeGeohash = getBridgeGeohash?.();
      send(
        this.buildPacket(
          identity,
          nickname,
          neighbors,
          nostrPubKey,
          capabilities,
          bridgeGeohash,
        ),
      );
    };
    this.broadcastFn = broadcast;

    const nextDelay = (): number => {
      const connected = (getPeerCount?.() ?? 0) > 0;
      if (!connected) return ANNOUNCE_ISOLATED_MS;
      return (
        ANNOUNCE_CONNECTED_MIN_MS +
        Math.random() * (ANNOUNCE_CONNECTED_MAX_MS - ANNOUNCE_CONNECTED_MIN_MS)
      );
    };

    const scheduleNext = (): void => {
      this.timer = setTimeout(() => {
        broadcast();
        scheduleNext();
      }, nextDelay());
    };

    broadcast(); // immediate first announce
    scheduleNext();
  }

  // Send one announce immediately, out of the normal cadence, so a state change
  // (capability toggle, nickname edit) propagates without waiting a full cycle.
  // No-op until start() has run.
  announceNow(): void {
    this.broadcastFn?.();
  }

  stop(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.broadcastFn = null;
  }

  // Validate that an incoming ANNOUNCE packet is self-consistent:
  // the signature must verify against the signing key declared in the payload.
  // Returns parsed info on success, null on failure (caller must drop the packet).
  validateAndParse(packet: Packet): AnnounceInfo | null {
    const info = decodeAnnouncePayload(packet.payload, packet.senderID);
    if (!info) return null;
    if (!verifyPacket(packet, info.signingPubKey)) return null;
    return info;
  }
}
