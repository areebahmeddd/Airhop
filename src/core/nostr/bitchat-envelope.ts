// The "bitchat1:" envelope carried inside a Nostr DM's decrypted rumor.
//
// bitchat never puts raw text in a Nostr DM. It wraps the message in a binary
// BitchatPacket (type NOISE_ENCRYPTED, unsigned) whose payload is a NoisePayload
// (private message or receipt), base64url-encoded behind a "bitchat1:" prefix
// (NostrEmbeddedBitChat.swift). A bitchat client drops any DM without this
// prefix, so we must produce and parse it to interoperate. The packet is exactly
// our BLE wire format, so this reuses packet-codec + noise-payload.

import {
  decodeNoisePayload,
  decodePrivateMessagePacket,
  encodeNoisePrivateMessage,
  encodeNoiseReceipt,
  NoisePayloadType,
} from "../mesh/noise-payload";
import {
  BROADCAST_ID,
  decodePacket,
  encodePacket,
  PacketType,
  type Packet,
} from "../mesh/packet-codec";

const PREFIX = "bitchat1:";

export interface BitchatDmContent {
  type: number; // NoisePayloadType
  messageID: string;
  content: string; // empty for receipts
}

function peerIdBytes(peerID: string | null): Uint8Array {
  if (peerID === null) return BROADCAST_ID;
  const clean = peerID.length >= 16 ? peerID.slice(0, 16) : peerID;
  const out = new Uint8Array(8);
  for (let i = 0; i < 8 && i * 2 + 1 < clean.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16) || 0;
  }
  return out;
}

function wrap(
  senderPeerID: string,
  recipientPeerID: string | null,
  noisePayload: Uint8Array,
): string {
  const packet: Packet = {
    type: PacketType.NOISE_ENCRYPTED,
    ttl: 7,
    flags: 0, // unsigned: the Nostr gift-wrap already authenticates the sender
    senderID: peerIdBytes(senderPeerID),
    recipientID: peerIdBytes(recipientPeerID),
    timestamp: Date.now(),
    signature: new Uint8Array(64),
    payload: noisePayload,
  };
  return PREFIX + toBase64Url(encodePacket(packet));
}

// Build the "bitchat1:" content for a private message. Null when the content is
// longer than one PrivateMessagePacket (255 bytes), matching bitchat.
export function encodeBitchatDmEnvelope(
  senderPeerID: string,
  recipientPeerID: string | null,
  messageID: string,
  content: string,
): string | null {
  const np = encodeNoisePrivateMessage(messageID, content);
  if (np === null) return null;
  return wrap(senderPeerID, recipientPeerID, np);
}

// Build the "bitchat1:" content for a delivery/read receipt.
export function encodeBitchatAckEnvelope(
  senderPeerID: string,
  recipientPeerID: string | null,
  type:
    typeof NoisePayloadType.DELIVERED | typeof NoisePayloadType.READ_RECEIPT,
  messageID: string,
): string {
  return wrap(
    senderPeerID,
    recipientPeerID,
    encodeNoiseReceipt(type, messageID),
  );
}

// Parse a "bitchat1:" string into its NoisePayload contents. Null if it is not a
// bitchat envelope or is malformed.
export function decodeBitchatEnvelope(s: string): BitchatDmContent | null {
  if (!s.startsWith(PREFIX)) return null;
  let bytes: Uint8Array;
  try {
    bytes = fromBase64Url(s.slice(PREFIX.length));
  } catch {
    return null;
  }
  const packet = decodePacket(bytes);
  if (packet === null || packet.type !== PacketType.NOISE_ENCRYPTED)
    return null;
  const np = decodeNoisePayload(packet.payload);
  if (np === null) return null;

  if (np.type === NoisePayloadType.PRIVATE_MESSAGE) {
    const pm = decodePrivateMessagePacket(np.body);
    if (pm === null) return null;
    return { type: np.type, messageID: pm.messageID, content: pm.content };
  }
  if (
    np.type === NoisePayloadType.DELIVERED ||
    np.type === NoisePayloadType.READ_RECEIPT
  ) {
    return {
      type: np.type,
      messageID: new TextDecoder().decode(np.body),
      content: "",
    };
  }
  return null;
}

// ---- base64url (no padding) -------------------------------------------------

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) b64 += "=";
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
