// Inner payload of a NOISE_ENCRYPTED direct message, byte-identical to bitchat
// (NoisePayload.swift, BLENoisePayloadFactory.swift, Packets.swift).
//
// After the Noise session decrypts a NOISE_ENCRYPTED packet, the plaintext is a
// NoisePayload: a single type byte followed by a body. This is what lets bitchat
// tell a private message apart from a delivery/read receipt on the same
// encrypted channel. Our old code put raw UTF-8 text here, so bitchat dropped it
// (its NoisePayload.decode rejects an unknown first byte) and we never sent or
// understood receipts. This module matches their format exactly.

// bitchat NoisePayloadType (BitchatProtocol.swift). 0x04/0x05 are reserved;
// verify (0x10/0x11) and vouch (0x12) are later milestones.
export const NoisePayloadType = {
  PRIVATE_MESSAGE: 0x01,
  READ_RECEIPT: 0x02,
  DELIVERED: 0x03,
  GROUP_INVITE: 0x06, // creator-signed group state (invite)
  GROUP_KEY_UPDATE: 0x07, // creator-signed group state (key rotation / roster)
  // One live push-to-talk burst packet. The body is a VoiceBurstPacket, the
  // same bytes a public burst carries in a VOICE_FRAME packet, so one wire
  // format serves both scopes and only the envelope differs.
  VOICE_FRAME: 0x08,
  // A whole file, encrypted inside the session rather than signed in the open.
  // Body is a BitchatFilePacket TLV - the same bytes a public FILE_TRANSFER
  // carries, so one encoder serves both and only the envelope differs.
  //
  // 0x20 is the value already deployed by bitchat-android and required of new
  // senders. bitchat-iOS also accepts 0x09 from its own prerelease builds and
  // canonicalizes it on receive; it never emits it, and neither do we. We
  // accept it for the same reason iOS does: those builds exist in the wild.
  PRIVATE_FILE: 0x20,
  PRIVATE_FILE_LEGACY_ALIAS: 0x09,
  // Capabilities and signing key, proven inside the session instead of
  // asserted in an announce. See peer-state-packet.ts for why that difference
  // is the whole point. Permanently assigned; not part of the media migration.
  AUTHENTICATED_PEER_STATE: 0x21,
} as const;
export type NoisePayloadTypeValue =
  (typeof NoisePayloadType)[keyof typeof NoisePayloadType];

export interface NoisePayload {
  type: number;
  body: Uint8Array;
}

// PrivateMessagePacket TLV type bytes (Packets.swift).
const TLV_MESSAGE_ID = 0x00;
const TLV_CONTENT = 0x01;

// How much text one DM can carry, in BYTES of UTF-8 rather than characters.
//
// bitchat's number, not a product decision: `PrivateMessagePacket` in
// Packets.swift writes one byte of length per field, and both clients refuse
// anything longer. Raising it needs a versioned or negotiated format agreed
// across iOS and Android (their #784 has been held on that for months);
// reinterpreting the existing length byte in place corrupts a legitimate
// 255-byte DM from every deployed client.
//
// Exported so the composer enforces the same budget the wire does. Letting the
// UI guess is what produced the bug this prevents: a 2000-character composer
// over a 255-byte envelope, so a long DM encoded to null and went nowhere on
// every transport, reported as sent.
export const PRIVATE_MESSAGE_MAX_CONTENT_BYTES = 255;

function utf8(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

// Encode a PrivateMessagePacket: [0x00,len,messageID][0x01,len,content].
// Returns null when either field exceeds its single-byte length; see
// PRIVATE_MESSAGE_MAX_CONTENT_BYTES.
export function encodePrivateMessagePacket(
  messageID: string,
  content: string,
): Uint8Array | null {
  const id = utf8(messageID);
  const c = utf8(content);
  if (id.length > 255 || c.length > PRIVATE_MESSAGE_MAX_CONTENT_BYTES) {
    return null;
  }
  const out = new Uint8Array(2 + id.length + 2 + c.length);
  let o = 0;
  out[o++] = TLV_MESSAGE_ID;
  out[o++] = id.length;
  out.set(id, o);
  o += id.length;
  out[o++] = TLV_CONTENT;
  out[o++] = c.length;
  out.set(c, o);
  return out;
}

export function decodePrivateMessagePacket(
  data: Uint8Array,
): { messageID: string; content: string } | null {
  let off = 0;
  let messageID: string | null = null;
  let content: string | null = null;
  const dec = new TextDecoder();
  while (off + 2 <= data.length) {
    const type = data[off];
    const len = data[off + 1];
    off += 2;
    if (off + len > data.length) return null;
    const value = data.slice(off, off + len);
    off += len;
    if (type === TLV_MESSAGE_ID) messageID = dec.decode(value);
    else if (type === TLV_CONTENT) content = dec.decode(value);
    else return null;
  }
  if (messageID === null || content === null) return null;
  return { messageID, content };
}

// Wrap a body with its NoisePayload type byte: [type] ++ body.
function typedPayload(type: number, body: Uint8Array): Uint8Array {
  const out = new Uint8Array(1 + body.length);
  out[0] = type;
  out.set(body, 1);
  return out;
}

// Generic NoisePayload: [type] ++ body. Used for payloads whose body is already
// a self-describing blob (e.g. a group-state TLV under GROUP_INVITE).
export function encodeNoisePayload(type: number, body: Uint8Array): Uint8Array {
  return typedPayload(type, body);
}

// The plaintext for a NOISE_ENCRYPTED private message: [0x01] ++ PMP TLV.
export function encodeNoisePrivateMessage(
  messageID: string,
  content: string,
): Uint8Array | null {
  const pmp = encodePrivateMessagePacket(messageID, content);
  if (pmp === null) return null;
  return typedPayload(NoisePayloadType.PRIVATE_MESSAGE, pmp);
}

// The plaintext for a NOISE_ENCRYPTED receipt: [type] ++ utf8(messageID).
// bitchat encodes the ack body as the raw message-ID string (no TLV).
export function encodeNoiseReceipt(
  type:
    typeof NoisePayloadType.DELIVERED | typeof NoisePayloadType.READ_RECEIPT,
  messageID: string,
): Uint8Array {
  return typedPayload(type, utf8(messageID));
}

// Split a decrypted NOISE_ENCRYPTED plaintext into its type byte and body.
export function decodeNoisePayload(data: Uint8Array): NoisePayload | null {
  if (data.length === 0) return null;
  return { type: data[0], body: data.slice(1) };
}
