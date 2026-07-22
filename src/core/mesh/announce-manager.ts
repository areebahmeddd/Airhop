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
import {
  Flags,
  PacketType,
  signPacket,
  verifyPacket,
  type Packet,
} from "./packet-codec";

const ANNOUNCE_INTERVAL_MS = 30_000;

// TTL stamped on every outgoing ANNOUNCE. Receivers use this to tell a direct
// announce from a relayed one: FloodRouter decrements TTL on each hop, so a
// packet still carrying ANNOUNCE_TTL came straight from its originator.
// Exported so mesh-service can't drift out of sync with the value used here.
export const ANNOUNCE_TTL = 7;

const TLV_NICKNAME = 0x01;
const TLV_NOISE_PUB = 0x02;
const TLV_SIGNING_PUB = 0x03;
const TLV_NEIGHBORS = 0x04;
const TLV_NOSTR_PUB = 0x05;

export interface AnnounceInfo {
  senderID: Uint8Array; // 8 bytes
  nickname: string;
  noisePubKey: Uint8Array; // 32 bytes X25519
  signingPubKey: Uint8Array; // 32 bytes Ed25519
  neighborIDs: Uint8Array[]; // up to 10 x 8 bytes
  nostrPubKey?: Uint8Array; // 32 bytes secp256k1 X-only (Airhop extension)
}

function writeTlv(buf: number[], type: number, value: Uint8Array): void {
  buf.push(type, value.length, ...value);
}

export function encodeAnnouncePayload(
  identity: Identity,
  nickname: string,
  neighborIDs: readonly Uint8Array[] = [],
  nostrPubKey?: Uint8Array,
): Uint8Array {
  const nicknameBytes = new TextEncoder().encode(nickname.slice(0, 32));
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
        nickname = new TextDecoder().decode(value);
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
  };
}

export type SendPacketFn = (packet: Packet) => void;

export class AnnounceManager {
  private timer: ReturnType<typeof setInterval> | null = null;

  // Build and return a signed ANNOUNCE packet ready to send.
  // Pass neighborIDs (each 8 bytes) to include TLV 0x04 so topology gossip works.
  // Pass nostrPubKey (32 bytes secp256k1 X-only) to include TLV 0x05 for Nostr DMs.
  buildPacket(
    identity: Identity,
    nickname: string,
    neighborIDs: readonly Uint8Array[] = [],
    nostrPubKey?: Uint8Array,
  ): Packet {
    const payload = encodeAnnouncePayload(
      identity,
      nickname,
      [...neighborIDs],
      nostrPubKey,
    );
    const senderIDBytes = hexToBytes(identity.peerID);

    const packet: Packet = {
      type: PacketType.ANNOUNCE,
      ttl: ANNOUNCE_TTL,
      flags: Flags.SIGNED, // broadcast: no HAS_RECIPIENT, always signed
      senderID: senderIDBytes,
      recipientID: new Uint8Array(8), // all-zeros = broadcast
      timestamp: Math.floor(Date.now() / 1000),
      signature: new Uint8Array(64),
      payload,
    };

    packet.signature = signPacket(packet, identity.signingPrivKey);
    return packet;
  }

  // Start broadcasting ANNOUNCE packets every 30 seconds.
  // Sends an initial packet immediately then repeats on the interval.
  //
  // Pass getNeighborIDs to include TLV 0x04 in each ANNOUNCE. The callback is
  // called on every broadcast tick so the neighbor list stays current.
  // Pass nostrPubKey to include TLV 0x05 (constant for the session lifetime).
  start(
    identity: Identity,
    nickname: string,
    send: SendPacketFn,
    getNeighborIDs?: () => readonly Uint8Array[],
    nostrPubKey?: Uint8Array,
  ): void {
    if (this.timer !== null) this.stop();

    const broadcast = (): void => {
      const neighbors = getNeighborIDs?.() ?? [];
      send(this.buildPacket(identity, nickname, neighbors, nostrPubKey));
    };

    broadcast(); // immediate first announce
    this.timer = setInterval(broadcast, ANNOUNCE_INTERVAL_MS);
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
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
