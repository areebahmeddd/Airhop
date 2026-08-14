// The "bitchat1:" envelope carried inside a Nostr DM's decrypted rumor.
//
// bitchat never puts raw text in a Nostr DM. It wraps the message in a binary
// BitchatPacket (type NOISE_ENCRYPTED, unsigned) whose payload is a NoisePayload
// (private message or receipt), base64url-encoded behind a "bitchat1:" prefix
// (NostrEmbeddedBitChat.swift). A bitchat client drops any DM without this
// prefix, so we must produce and parse it to interoperate. The packet is exactly
// our BLE wire format, so this reuses packet-codec + noise-payload.

import { base64UrlToBytes, bytesToBase64Url } from "../encoding/base64";
import {
  decodeNoisePayload,
  decodePrivateMessagePacket,
  encodeNoisePrivateMessage,
  encodeNoiseReceipt,
  NoisePayloadType,
} from "../mesh/wire/noise-payload";
import {
  BROADCAST_ID,
  decodePacket,
  encodePacket,
  PacketType,
  type Packet,
} from "../mesh/wire/packet-codec";

const PREFIX = "bitchat1:";

export interface BitchatDmContent {
  type: number; // NoisePayloadType
  messageID: string;
  content: string; // empty for receipts
  // Raw payload body, for the types that carry bytes rather than text. Only
  // CONTACT_CARD uses it today; `content` stays the text channel so no existing
  // caller has to learn about it.
  body?: Uint8Array;
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
  return PREFIX + bytesToBase64Url(encodePacket(packet));
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

// Build the "bitchat1:" content for a contact card handed over inside a
// conversation. The body is the same binary a QR carries, so a card that arrives
// this way goes through exactly the checks a scanned one does.
//
// No message ID: a card is not a message, gets no bubble and no receipt. It is
// wrapped in the same envelope only because that is the shape this transport
// carries, and because a bitchat client then drops it on the unknown type rather
// than rendering something it cannot read.
export function encodeBitchatCardEnvelope(
  senderPeerID: string,
  recipientPeerID: string | null,
  card: Uint8Array,
): string {
  const payload = new Uint8Array(1 + card.length);
  payload[0] = NoisePayloadType.CONTACT_CARD;
  payload.set(card, 1);
  return wrap(senderPeerID, recipientPeerID, payload);
}

// Parse a "bitchat1:" string into its NoisePayload contents. Null if it is not a
// bitchat envelope or is malformed.
export function decodeBitchatEnvelope(s: string): BitchatDmContent | null {
  if (!s.startsWith(PREFIX)) return null;
  let bytes: Uint8Array;
  try {
    bytes = base64UrlToBytes(s.slice(PREFIX.length));
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
  if (np.type === NoisePayloadType.CONTACT_CARD) {
    // Handed back as bytes and validated by the caller, not here: a card is only
    // trustworthy once its peer ID is checked against SHA-256 of its Noise key,
    // and that check lives with the one place that already does it.
    return { type: np.type, messageID: "", content: "", body: np.body };
  }
  return null;
}
