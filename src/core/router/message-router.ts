// Message router: decides which transport carries each message.
//
// Priority order (per ARCHITECTURE.md section 4):
//   1. BLE mesh direct (Noise session established)
//   2. Nostr gift-wrap DM (if recipient's Nostr pubkey is known)
//   3. Courier (store-and-forward via connected mesh peers)
//
// The router does not own a network connection. BLE and Courier are injected
// as plain callbacks. The optional Nostr send function is injected at
// construction time so the router stays testable without a live relay pool.

import { type NoiseSession } from "../crypto/noise-xx";
import {
  Flags,
  PacketType,
  signPacket,
  type Packet,
} from "../mesh/packet-codec";

// How long a peer remains "reachable" after their last ANNOUNCE. Matches
// bitchat's reachability timeout.
const PEER_REACHABLE_TTL_MS = 60_000;

// ---- Peer registry ----------------------------------------------------------

export interface PeerEntry {
  peerID: string; // 16 hex chars
  noisePubKey: Uint8Array; // 32-byte X25519
  signingPubKey: Uint8Array; // 32-byte Ed25519
  nickname: string;
  lastSeenMs: number;
  // Nostr public key (secp256k1 hex) announced by this peer, if known.
  // Used as priority-2 transport when the BLE session is unavailable.
  nostrPubkey?: string;
  // Active Noise XX session, set once handshake is complete.
  session?: NoiseSession;
}

// Live map of recently seen peers (keyed by peerID hex string).
export class PeerRegistry {
  private readonly peers = new Map<string, PeerEntry>();

  update(
    entry: Omit<PeerEntry, "lastSeenMs" | "session"> & {
      session?: NoiseSession;
    },
  ): void {
    const existing = this.peers.get(entry.peerID);
    this.peers.set(entry.peerID, {
      ...entry,
      lastSeenMs: Date.now(),
      // Preserve the learned Nostr pubkey across BLE re-announces, which do
      // not carry a nostrPubkey field. Same pattern as session.
      nostrPubkey: entry.nostrPubkey ?? existing?.nostrPubkey,
      session: entry.session ?? existing?.session,
    });
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
    if (Date.now() - e.lastSeenMs > PEER_REACHABLE_TTL_MS) return undefined;
    return e;
  }

  isReachable(peerID: string): boolean {
    return this.get(peerID) !== undefined;
  }

  reachablePeers(): PeerEntry[] {
    const cutoff = Date.now() - PEER_REACHABLE_TTL_MS;
    return [...this.peers.values()].filter((e) => e.lastSeenMs >= cutoff);
  }

  evictStale(): void {
    const cutoff = Date.now() - PEER_REACHABLE_TTL_MS;
    for (const [id, e] of this.peers) {
      if (e.lastSeenMs < cutoff) this.peers.delete(id);
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

// Encodes the CHANNEL_MSG payload:
//   [channel_utf8_len (u8)][channel_utf8][text_utf8]
export function encodeChannelMsgPayload(
  channel: string,
  text: string,
): Uint8Array {
  const chBytes = new TextEncoder().encode(channel.slice(0, 64));
  const textBytes = new TextEncoder().encode(text);
  const buf = new Uint8Array(1 + chBytes.length + textBytes.length);
  buf[0] = chBytes.length;
  buf.set(chBytes, 1);
  buf.set(textBytes, 1 + chBytes.length);
  return buf;
}

export function decodeChannelMsgPayload(
  payload: Uint8Array,
): { channel: string; text: string } | null {
  if (payload.length < 1) return null;
  const chLen = payload[0];
  if (1 + chLen > payload.length) return null;
  const channel = new TextDecoder().decode(payload.slice(1, 1 + chLen));
  const text = new TextDecoder().decode(payload.slice(1 + chLen));
  return { channel, text };
}

// Encodes the DM payload for Noise-encrypted unicast:
//   [noise_ciphertext: session.encrypt(text_utf8)]
export function encodeDmPayload(
  text: string,
  session: NoiseSession,
): Uint8Array {
  const plaintext = new TextEncoder().encode(text);
  return session.encrypt(plaintext);
}

export class MessageRouter {
  constructor(
    private readonly identity: RouterIdentity,
    private readonly registry: PeerRegistry,
    private readonly broadcast: BroadcastFn,
    private readonly unicast: UnicastFn,
    // Priority-2 transport: Nostr gift-wrap DM. Optional — when absent, DMs
    // fall through to courier if BLE session is unavailable.
    private readonly nostrSend?: NostrSendFn,
  ) {}

  // Send a message to a public channel. Always broadcast over mesh.
  sendChannelMessage(channel: string, text: string): void {
    const payload = encodeChannelMsgPayload(channel, text);
    const senderIDBytes = hexToBytes(this.identity.peerID);

    const packet: Packet = {
      type: PacketType.CHANNEL_MSG,
      ttl: 7,
      flags: Flags.SIGNED,
      senderID: senderIDBytes,
      recipientID: new Uint8Array(8), // broadcast
      timestamp: Math.floor(Date.now() / 1000),
      nonce: crypto.getRandomValues(new Uint8Array(8)),
      signature: new Uint8Array(64),
      payload,
    };
    packet.signature = signPacket(packet, this.identity.signingPrivKey);
    this.broadcast(packet);
  }

  // Send a direct message.
  //
  // Transport selection:
  //   1. BLE direct: if the recipient has an active Noise session, encrypt and
  //      unicast over the mesh immediately.
  //   2. Nostr: if a NostrSendFn was injected and the recipient's Nostr pubkey
  //      is known, fire-and-forget a gift-wrap DM over the internet. Returns
  //      'sent-nostr' so the caller can show a pending indicator.
  //   3. Courier: returns 'needs-courier' so the caller can seal the message
  //      and hand it to connected peers.
  sendDm(
    recipientPeerID: string,
    text: string,
  ): "sent" | "sent-nostr" | "needs-courier" {
    const peer = this.registry.get(recipientPeerID);

    // Priority 1: BLE direct.
    if (peer?.session !== undefined) {
      const payload = encodeDmPayload(text, peer.session);
      const senderIDBytes = hexToBytes(this.identity.peerID);
      const recipientIDBytes = hexToBytes(recipientPeerID);

      const packet: Packet = {
        type: PacketType.NOISE_ENCRYPTED,
        ttl: 7,
        flags: Flags.HAS_RECIPIENT | Flags.SIGNED,
        senderID: senderIDBytes,
        recipientID: recipientIDBytes,
        timestamp: Math.floor(Date.now() / 1000),
        nonce: crypto.getRandomValues(new Uint8Array(8)),
        signature: new Uint8Array(64),
        payload,
      };
      packet.signature = signPacket(packet, this.identity.signingPrivKey);
      this.unicast(recipientPeerID, packet);
      return "sent";
    }

    // Priority 2: Nostr gift-wrap DM when recipient pubkey is known.
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

  // Decrypt an incoming DM payload.
  decryptDm(packet: Packet, senderPeerID: string): string | null {
    const peer = this.registry.get(senderPeerID);
    if (peer?.session === undefined) return null;
    try {
      const plaintext = peer.session.decrypt(packet.payload);
      return new TextDecoder().decode(plaintext);
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
