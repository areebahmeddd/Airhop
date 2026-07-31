// Message router: decides which transport carries each message.
//
// Priority order (per ARCHITECTURE.md section 3, Adaptive Transport Stack):
//   1. WiFi Aware / MultipeerConnectivity direct (high-bandwidth, same Noise session)
//   2. BLE mesh direct (Noise session established)
//   3. Nostr gift-wrap DM (if recipient's Nostr pubkey is known)
//   4. Courier (store-and-forward via connected mesh peers)
//
// The router does not own a network connection. BLE and Courier are injected
// as plain callbacks. The optional Nostr and WiFi send functions are injected at
// construction time so the router stays testable without a live transport.

import { type NoiseSession } from "../crypto/noise-xx";
import {
  decodeNoisePayload,
  encodeNoisePayload,
  encodeNoisePrivateMessage,
  encodeNoiseReceipt,
  NoisePayloadType,
  type NoisePayload,
} from "../mesh/noise-payload";
import {
  Flags,
  PacketType,
  signPacket,
  type Packet,
} from "../mesh/packet-codec";

// Timeout for a peer directly connected over BLE (no ANNOUNCE heard within
// this window means the radio link is gone). Matches bitchat's 15-second
// direct-link timeout in BLEMaintenancePolicy.
const DIRECT_PEER_TTL_MS = 15_000;

// Timeout for mesh peers learned via relayed ANNOUNCEs (not directly connected).
// Longer because relayed packets can take several hops and arrive late.
// Matches bitchat's 60-second mesh reachability window.
const PEER_REACHABLE_TTL_MS = 60_000;

// ---- Peer registry ----------------------------------------------------------

export interface PeerEntry {
  peerID: string; // 16 hex chars
  noisePubKey: Uint8Array; // 32-byte X25519
  signingPubKey: Uint8Array; // 32-byte Ed25519
  nickname: string;
  lastSeenMs: number;
  // Whether this peer is directly connected over BLE (link event received).
  // Direct peers use a shorter TTL (15s); mesh peers use 60s.
  isDirect: boolean;
  // Nostr public key (secp256k1 hex) announced by this peer, if known.
  // Used as priority-3 transport when direct transports are unavailable.
  nostrPubkey?: string;
  // bitchat capability bits announced by this peer (ANNOUNCE TLV 0x05), if any.
  // 0/undefined means the peer advertised none (old client or no TLV).
  capabilities?: number;
  // Rendezvous geohash cell a bridge peer advertises (ANNOUNCE TLV 0x06), so a
  // mesh-only peer knows which cell to deposit into. Undefined for non-bridges.
  bridgeGeohash?: string;
  // Active Noise XX session, set once handshake is complete.
  session?: NoiseSession;
}

// Capability bits (bitchat PeerCapabilities). Kept here so registry queries need
// not import announce-manager.
const CAPABILITY_GATEWAY = 1 << 2;
const CAPABILITY_BRIDGE = 1 << 7;

// Ceiling on how many peers the registry will remember.
//
// Entries here are created from ANNOUNCE packets, which are unauthenticated
// input: anyone in radio range can mint an unlimited number of internally
// consistent identities (real keypair, correctly derived peer ID, valid
// self-signature) and announce them. Nothing about any individual one is
// detectably wrong, which is what makes a Sybil flood a resource problem rather
// than a signature problem.
//
// Reads were already TTL-bounded, so a flood never made a fake peer look
// reachable - but the underlying map grew without limit and was never swept, so
// the memory was held for the life of the process and every reachablePeers()
// scan walked all of it. 200 matches prekey-store.ts, which caps the same class
// of gossiped, attacker-supplied state the same way.
const MAX_TRACKED_PEERS = 200;

function sameKey(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

// Live map of recently seen peers (keyed by peerID hex string).
export class PeerRegistry {
  private readonly peers = new Map<string, PeerEntry>();

  // `trusted` marks an out-of-band identity the user established in person (a
  // scanned QR contact card), which outranks anything learned over the air and
  // may therefore re-pin the keys below. Announces must never set it.
  update(
    entry: Omit<PeerEntry, "lastSeenMs" | "session" | "isDirect"> & {
      isDirect?: boolean;
      session?: NoiseSession;
      trusted?: boolean;
    },
  ): void {
    const existing = this.peers.get(entry.peerID);

    // TOFU key pinning. A valid packet signature only proves an announce is
    // self-consistent: it is checked against the Ed25519 key carried inside
    // that same announce. Since peerIDs derive from the Noise public key - and
    // that key is broadcast in the clear in every announce - an attacker can
    // replay a victim's peerID and Noise key while substituting their own
    // signing key, then sign with it. Both the derivation check and the
    // signature check in onAnnounce pass. Only refusing to *replace* a signing
    // key already bound to this peer stops it, so the first key we see for a
    // peer is the one that stands for as long as we remember them.
    //
    // Rejecting the whole update (rather than keeping the old key and taking
    // the rest) is deliberate: the nickname and capabilities in a conflicting
    // announce come from the same unverified source, so accepting any of it
    // would still let an attacker rewrite how that peer is presented.
    //
    // Mirrors bitchat BLEAnnounceTrustPolicy .signingKeyMismatch / .keyMismatch.
    if (existing !== undefined && entry.trusted !== true) {
      if (!sameKey(existing.signingPubKey, entry.signingPubKey)) return;
      if (!sameKey(existing.noisePubKey, entry.noisePubKey)) return;
    }

    // `trusted` is a caller-supplied hint about the source, not peer state, so
    // it is dropped rather than stored.
    const { trusted: _trusted, ...fields } = entry;
    this.peers.set(entry.peerID, {
      ...fields,
      isDirect: entry.isDirect ?? existing?.isDirect ?? false,
      lastSeenMs: Date.now(),
      // Preserve the learned Nostr pubkey across BLE re-announces, which do
      // not carry a nostrPubkey field. Same pattern as session.
      nostrPubkey: entry.nostrPubkey ?? existing?.nostrPubkey,
      capabilities: entry.capabilities ?? existing?.capabilities,
      bridgeGeohash: entry.bridgeGeohash ?? existing?.bridgeGeohash,
      session: entry.session ?? existing?.session,
    });
    if (existing === undefined) this.enforceCap();
  }

  // Drop the least recently seen peers once the registry is over its ceiling.
  //
  // Direct peers are never evicted. A direct peer is one we hold an actual BLE
  // link to, which no amount of announcing can fake, so they are the entries
  // most worth keeping and the ones an attacker most wants pushed out. Anything
  // already past its TTL goes first, since it is dead weight either way.
  private enforceCap(): void {
    if (this.peers.size <= MAX_TRACKED_PEERS) return;
    const evictable = [...this.peers.values()]
      .filter((e) => !e.isDirect)
      .sort((a, b) => a.lastSeenMs - b.lastSeenMs);
    let over = this.peers.size - MAX_TRACKED_PEERS;
    for (const entry of evictable) {
      if (over <= 0) break;
      this.peers.delete(entry.peerID);
      over--;
    }
  }

  // Mark a peer as directly BLE-connected. Called when the BLE native module
  // fires a linkConnected event for this peerID. Direct peers use DIRECT_PEER_TTL_MS.
  markDirect(peerID: string): void {
    const e = this.peers.get(peerID);
    if (e) {
      e.isDirect = true;
      e.lastSeenMs = Date.now();
    }
  }

  // Mark a peer as no longer directly connected (BLE link dropped).
  // The peer may still be reachable as a mesh peer until their ANNOUNCE expires.
  markIndirect(peerID: string): void {
    const e = this.peers.get(peerID);
    if (e) e.isDirect = false;
  }

  setSession(peerID: string, session: NoiseSession): void {
    const e = this.peers.get(peerID);
    if (e) e.session = session;
  }

  setNostrPubkey(peerID: string, nostrPubkey: string): void {
    const e = this.peers.get(peerID);
    if (e) e.nostrPubkey = nostrPubkey;
  }

  get(peerID: string): PeerEntry | undefined {
    const e = this.peers.get(peerID);
    if (!e) return undefined;
    const ttl = e.isDirect ? DIRECT_PEER_TTL_MS : PEER_REACHABLE_TTL_MS;
    if (Date.now() - e.lastSeenMs > ttl) return undefined;
    return e;
  }

  isReachable(peerID: string): boolean {
    return this.get(peerID) !== undefined;
  }

  reachablePeers(): PeerEntry[] {
    const now = Date.now();
    return [...this.peers.values()].filter((e) => {
      const ttl = e.isDirect ? DIRECT_PEER_TTL_MS : PEER_REACHABLE_TTL_MS;
      return now - e.lastSeenMs <= ttl;
    });
  }

  // A reachable peer advertising the gateway capability, if any. Used to pick an
  // uplink relay when the internet is unreachable directly. Prefers direct peers
  // (fewer hops), then most-recently-seen.
  firstReachableGateway(): PeerEntry | undefined {
    return this.reachablePeers()
      .filter((e) => ((e.capabilities ?? 0) & CAPABILITY_GATEWAY) !== 0)
      .sort(
        (a, b) =>
          Number(b.isDirect) - Number(a.isDirect) ||
          b.lastSeenMs - a.lastSeenMs,
      )[0];
  }

  hasReachableGateway(): boolean {
    return this.firstReachableGateway() !== undefined;
  }

  // A reachable peer advertising the bridge capability, if any. Used by a
  // mesh-only peer to pick a bridge gateway to deposit its public-channel
  // messages through. Prefers direct peers, then most-recently-seen.
  firstReachableBridge(): PeerEntry | undefined {
    return this.reachablePeers()
      .filter((e) => ((e.capabilities ?? 0) & CAPABILITY_BRIDGE) !== 0)
      .sort(
        (a, b) =>
          Number(b.isDirect) - Number(a.isDirect) ||
          b.lastSeenMs - a.lastSeenMs,
      )[0];
  }

  hasReachableBridge(): boolean {
    return this.firstReachableBridge() !== undefined;
  }

  evictStale(): void {
    const now = Date.now();
    for (const [id, e] of this.peers) {
      const ttl = e.isDirect ? DIRECT_PEER_TTL_MS : PEER_REACHABLE_TTL_MS;
      if (now - e.lastSeenMs > ttl) this.peers.delete(id);
    }
  }

  get size(): number {
    return this.peers.size;
  }
}

// ---- Message types ----------------------------------------------------------

export interface ChannelMessage {
  channel: string; // e.g. "#general"
  text: string;
  replyToId?: string;
}

export interface DirectMessage {
  text: string;
}

// ---- MessageRouter ----------------------------------------------------------

export interface RouterIdentity {
  peerID: string; // 16 hex chars
  signingPrivKey: Uint8Array;
  noiseStaticPrivKey: Uint8Array;
}

export type BroadcastFn = (packet: Packet) => void;
export type UnicastFn = (recipientPeerID: string, packet: Packet) => void;
// Sends a gift-wrapped Nostr DM to a recipient by their secp256k1 pubkey.
// Implemented by the feature layer; swapped for a test double in unit tests.
export type NostrSendFn = (
  recipientNostrPubkey: string,
  text: string,
) => Promise<void>;

// NOTE: a separate WiFiUnicastFn tier used to live here. It was removed because
// it duplicated work the injected `unicast` callback already does: MeshService's
// unicast checks for an active WiFi link and uses it before falling back to BLE.
// Having a second WiFi check in the router meant the transport was consulted
// twice, and because the parameter was never actually passed, it read like an
// unfinished feature when the behaviour was in fact already correct.
//
// Transport selection belongs in the callback that owns the link maps, not here.
// The router only decides WHICH tier to use (direct / Nostr / courier); how a
// direct packet reaches the peer is the transport layer's business.

// Encodes the CHANNEL_MSG payload:
//   [channel_utf8_len (u8)][channel_utf8][msg_id_len (u8)][msg_id][text_utf8]
//
// The message ID is a sender-generated identifier carried on EVERY transport
// that message takes. It exists for two reasons:
//
//  1. Deduplication across transports. A location channel goes out over both
//     BLE and Nostr, and the sender signs the Nostr copy with a per-geohash
//     key, so to a receiver the two copies look like two different people
//     saying the same thing. Correlating on a shared ID collapses them.
//  2. Distinguishing genuine repeats. Packet-level dedup hashes the payload,
//     so sending "ok" twice in one second used to be silently swallowed as a
//     duplicate packet. A per-message ID makes the second one distinct.
//
// bitchat's message payload carries an `id` field for the same reason, so this
// also moves the format toward wire compatibility rather than away from it.
export function encodeChannelMsgPayload(
  channel: string,
  text: string,
  msgId: string,
): Uint8Array {
  const chBytes = new TextEncoder().encode(channel.slice(0, 64));
  const idBytes = new TextEncoder().encode(msgId.slice(0, 32));
  const textBytes = new TextEncoder().encode(text);
  const buf = new Uint8Array(
    1 + chBytes.length + 1 + idBytes.length + textBytes.length,
  );
  let off = 0;
  buf[off++] = chBytes.length;
  buf.set(chBytes, off);
  off += chBytes.length;
  buf[off++] = idBytes.length;
  buf.set(idBytes, off);
  off += idBytes.length;
  buf.set(textBytes, off);
  return buf;
}

export function decodeChannelMsgPayload(
  payload: Uint8Array,
): { channel: string; text: string; msgId: string } | null {
  if (payload.length < 1) return null;
  const chLen = payload[0];
  if (1 + chLen + 1 > payload.length) return null;
  const channel = new TextDecoder().decode(payload.slice(1, 1 + chLen));

  let off = 1 + chLen;
  const idLen = payload[off++];
  if (off + idLen > payload.length) return null;
  const msgId = new TextDecoder().decode(payload.slice(off, off + idLen));
  off += idLen;

  const text = new TextDecoder().decode(payload.slice(off));
  return { channel, text, msgId };
}

// 16 hex chars from 8 random bytes: short enough to stay cheap on the wire,
// wide enough that collisions are irrelevant at mesh scale.
export function newMessageId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
}

// Encodes the DM payload for Noise-encrypted unicast, byte-compatible with
// bitchat: the plaintext is a NoisePayload ([0x01] + PrivateMessagePacket TLV),
// then Noise-encrypted. Returns null when the content is longer than one
// PrivateMessagePacket can carry (255 bytes), matching bitchat's cap.
export function encodeDmPayload(
  messageID: string,
  text: string,
  session: NoiseSession,
): Uint8Array | null {
  const inner = encodeNoisePrivateMessage(messageID, text);
  if (inner === null) return null;
  return session.encrypt(inner);
}

export class MessageRouter {
  constructor(
    private readonly identity: RouterIdentity,
    private readonly registry: PeerRegistry,
    private readonly broadcast: BroadcastFn,
    private readonly unicast: UnicastFn,
    // Nostr gift-wrap DM. Optional. When absent, DMs fall through to courier
    // if no direct session is available.
    private readonly nostrSend?: NostrSendFn,
  ) {}

  // Send a message to a public channel. Always broadcast over mesh.
  // `msgId` is generated by the caller so the same identifier can be reused on
  // every transport this message takes (BLE here, Nostr for geo channels).
  // `timestampMs` defaults to now; callers pass an explicit value when the same
  // timestamp must be reused elsewhere (the mesh bridge derives a content-stable
  // ID from sender+timestamp+content, and it must match on both transports).
  sendChannelMessage(
    channel: string,
    text: string,
    msgId: string,
    timestampMs: number = Date.now(),
  ): void {
    const payload = encodeChannelMsgPayload(channel, text, msgId);
    const senderIDBytes = hexToBytes(this.identity.peerID);

    const packet: Packet = {
      type: PacketType.CHANNEL_MSG,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: senderIDBytes,
      recipientID: new Uint8Array(8), // broadcast
      timestamp: timestampMs,
      signature: new Uint8Array(64),
      payload,
    };
    packet.signature = signPacket(packet, this.identity.signingPrivKey);
    this.broadcast(packet);
  }

  // Broadcast an already-sealed private-channel message (XChaCha20-Poly1305).
  // The payload is opaque here; only key-holders can open it. Signed at the
  // packet layer so the sender stays attributable.
  sendChannelEnc(sealedPayload: Uint8Array): void {
    const packet: Packet = {
      type: PacketType.CHANNEL_ENC,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: new Uint8Array(8), // broadcast
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload: sealedPayload,
    };
    packet.signature = signPacket(packet, this.identity.signingPrivKey);
    this.broadcast(packet);
  }

  // Send a direct message.
  //
  // Transport selection:
  //   1. Direct: if the recipient has an active Noise session, encrypt and
  //      unicast it. The injected `unicast` callback picks the physical
  //      transport, preferring a WiFi link (MultipeerConnectivity on iOS,
  //      WiFi Aware on Android) over BLE when one exists. Both share the same
  //      Noise session, which is transport-agnostic.
  //   2. Nostr: if a NostrSendFn was injected and the recipient's Nostr pubkey
  //      is known, fire-and-forget a gift-wrap DM over the internet. Returns
  //      'sent-nostr' so the caller can show a pending indicator.
  //   3. Courier: returns 'needs-courier' so the caller can seal the message
  //      and hand it to connected peers.
  sendDm(
    recipientPeerID: string,
    text: string,
    messageID: string,
  ): "sent" | "sent-nostr" | "needs-courier" {
    const peer = this.registry.get(recipientPeerID);

    // Direct transport. Requires an active Noise session so the payload can be
    // encrypted end-to-end; the callback below chooses WiFi or BLE. This is the
    // path a bitchat peer's DM travels: NOISE_ENCRYPTED carrying a bitchat
    // NoisePayload private message.
    if (peer?.session !== undefined) {
      const payload = encodeDmPayload(messageID, text, peer.session);
      // Content longer than one PrivateMessagePacket (255 bytes): fall through
      // to courier rather than send something bitchat can't parse.
      if (payload !== null) {
        const packet = this.makeNoisePacket(recipientPeerID, payload);
        // The transport layer owns the WiFi-vs-BLE decision.
        this.unicast(recipientPeerID, packet);
        return "sent";
      }
    }

    // Priority 3: Nostr gift-wrap DM when recipient pubkey is known.
    if (this.nostrSend !== undefined && peer?.nostrPubkey !== undefined) {
      void this.nostrSend(peer.nostrPubkey, text).catch(() => {
        // Delivery failure is handled at the feature layer via Nostr client
        // events. Silently dropping here keeps the router side-effect-free.
      });
      return "sent-nostr";
    }

    // Priority 3: Courier store-and-forward.
    return "needs-courier";
  }

  // Send a delivery/read receipt over the Noise session, in bitchat's format
  // ([type] + utf8(messageID)). Used for peers reachable only over plain Noise
  // (bitchat, or an Airhop peer without a Double Ratchet). Returns false when no
  // session exists, so the caller knows the receipt did not go out.
  sendNoiseReceipt(
    recipientPeerID: string,
    type:
      typeof NoisePayloadType.DELIVERED | typeof NoisePayloadType.READ_RECEIPT,
    messageID: string,
  ): boolean {
    const peer = this.registry.get(recipientPeerID);
    if (peer?.session === undefined) return false;
    const payload = peer.session.encrypt(encodeNoiseReceipt(type, messageID));
    this.unicast(
      recipientPeerID,
      this.makeNoisePacket(recipientPeerID, payload),
    );
    return true;
  }

  // Send an arbitrary NoisePayload (type + body) over the Noise session, e.g. a
  // creator-signed group invite. Returns false when no session exists yet, so
  // the caller can retry once the handshake completes.
  sendNoisePayload(
    recipientPeerID: string,
    type: number,
    body: Uint8Array,
  ): boolean {
    const peer = this.registry.get(recipientPeerID);
    if (peer?.session === undefined) return false;
    const payload = peer.session.encrypt(encodeNoisePayload(type, body));
    this.unicast(
      recipientPeerID,
      this.makeNoisePacket(recipientPeerID, payload),
    );
    return true;
  }

  // Build and sign a NOISE_ENCRYPTED unicast packet around an already-encrypted
  // payload.
  private makeNoisePacket(
    recipientPeerID: string,
    encryptedPayload: Uint8Array,
  ): Packet {
    const packet: Packet = {
      type: PacketType.NOISE_ENCRYPTED,
      ttl: 7,
      flags: Flags.HAS_RECIPIENT | Flags.SIGNED,
      senderID: hexToBytes(this.identity.peerID),
      recipientID: hexToBytes(recipientPeerID),
      timestamp: Date.now(),
      signature: new Uint8Array(64),
      payload: encryptedPayload,
    };
    packet.signature = signPacket(packet, this.identity.signingPrivKey);
    return packet;
  }

  // Decrypt an incoming NOISE_ENCRYPTED payload into its typed NoisePayload
  // (private message, delivery, or read receipt). Null on any failure.
  decryptDm(packet: Packet, senderPeerID: string): NoisePayload | null {
    const peer = this.registry.get(senderPeerID);
    if (peer?.session === undefined) return null;
    try {
      return decodeNoisePayload(peer.session.decrypt(packet.payload));
    } catch {
      return null;
    }
  }
}

// ---- Helpers -----------------------------------------------------------------

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length >> 1);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
