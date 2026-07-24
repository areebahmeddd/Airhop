// Wire payload shared by the ping (0x26) and pong (0x27) mesh-diagnostic types.
//
// Byte-identical to bitchat MeshPingPayload.swift so an Airhop /ping resolves
// against a bitchat node and vice versa.
//
// Layout (9 bytes):
//   8 bytes  random nonce (a pong echoes the nonce of the ping it answers)
//   1 byte   origin TTL: the TTL the packet launched with, so the receiver can
//            compute hops as originTTL - receivedTTL + 1.
//
// Both directions are unencrypted and unsigned: the payload carries no private
// data, and the unguessable nonce already binds a pong to a probe we sent.

export const PING_NONCE_LENGTH = 8;
const ENCODED_LENGTH = PING_NONCE_LENGTH + 1;

export interface MeshPingPayload {
  nonce: Uint8Array; // 8 bytes
  originTTL: number;
}

export function encodeMeshPing(payload: MeshPingPayload): Uint8Array {
  const out = new Uint8Array(ENCODED_LENGTH);
  out.set(payload.nonce.slice(0, PING_NONCE_LENGTH), 0);
  out[PING_NONCE_LENGTH] = payload.originTTL & 0xff;
  return out;
}

// Accepts trailing bytes so a future revision can extend the format without
// breaking older clients (matches bitchat's tolerant decode).
export function decodeMeshPing(data: Uint8Array): MeshPingPayload | null {
  if (data.length < ENCODED_LENGTH) return null;
  return {
    nonce: data.slice(0, PING_NONCE_LENGTH),
    originTTL: data[PING_NONCE_LENGTH],
  };
}

export function newPingNonce(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(PING_NONCE_LENGTH));
}

// Number of links a packet crossed: TTL decrements plus the final delivery link
// (a directly connected peer is 1 hop). Null when TTLs are inconsistent.
export function pingHopCount(
  originTTL: number,
  receivedTTL: number,
): number | null {
  if (originTTL < receivedTTL) return null;
  return originTTL - receivedTTL + 1;
}
