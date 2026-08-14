// The envelope inside a Double Ratchet DM (packet type DR_ENCRYPTED).
//
// Receipts need two things in the encrypted payload that raw text cannot carry:
// a type discriminator, and the message id a receipt refers to. Type values
// mirror bitchat's NoisePayloadType, though this format is Airhop-to-Airhop
// only. The bitchat-compatible envelope is noise-payload.ts, used for
// NOISE_ENCRYPTED.
//
// Layout:
//   [0]              type    u8
//   [1]              idLen   u8   (bytes of the message id, 0 to 255)
//   [2 .. 2+idLen]   id      UTF-8 message id
//   [2+idLen .. ]    text    UTF-8 text (type 0x01 only, empty for receipts)
//
// Anything that is not a well-formed envelope (too short, unknown type byte, an
// idLen that does not fit) is read as legacy raw text. UTF-8 text never starts
// with a 0x01, 0x02 or 0x03 control byte, so the two cannot be confused, and a
// peer on the old format still renders correctly, just without receipts.

export const DmPayloadType = {
  MESSAGE: 0x01,
  READ_RECEIPT: 0x02,
  DELIVERED: 0x03,
} as const;

export type DmPayloadTypeValue =
  (typeof DmPayloadType)[keyof typeof DmPayloadType];

export interface DmPayload {
  type: DmPayloadTypeValue;
  // Message id this payload is about: the message's own id (MESSAGE) or the id
  // being acknowledged (receipts). Empty string only for a legacy message with
  // no id on the wire.
  messageId: string;
  // Present for MESSAGE; empty for receipts.
  text: string;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Encode a private message (text) with its id.
export function encodeDmMessage(messageId: string, text: string): Uint8Array {
  return encodeEnvelope(DmPayloadType.MESSAGE, messageId, text);
}

// Encode a receipt (delivered or read) for a given message id.
export function encodeDmReceipt(
  type: typeof DmPayloadType.DELIVERED | typeof DmPayloadType.READ_RECEIPT,
  messageId: string,
): Uint8Array {
  return encodeEnvelope(type, messageId, "");
}

function encodeEnvelope(
  type: DmPayloadTypeValue,
  messageId: string,
  text: string,
): Uint8Array {
  // Ids are short (a local id string); clamp defensively to one length byte.
  const idBytes = encoder.encode(messageId).slice(0, 255);
  const textBytes = encoder.encode(text);
  const out = new Uint8Array(2 + idBytes.length + textBytes.length);
  out[0] = type;
  out[1] = idBytes.length;
  out.set(idBytes, 2);
  out.set(textBytes, 2 + idBytes.length);
  return out;
}

// Decode a decrypted DM payload. Never throws: an unrecognised buffer falls
// back to a legacy raw-text message so old-format DMs keep working.
export function decodeDmPayload(bytes: Uint8Array): DmPayload {
  if (bytes.length >= 2) {
    const type = bytes[0];
    const idLen = bytes[1];
    if (
      (type === DmPayloadType.MESSAGE ||
        type === DmPayloadType.READ_RECEIPT ||
        type === DmPayloadType.DELIVERED) &&
      2 + idLen <= bytes.length
    ) {
      const messageId = decoder.decode(bytes.slice(2, 2 + idLen));
      const text =
        type === DmPayloadType.MESSAGE
          ? decoder.decode(bytes.slice(2 + idLen))
          : "";
      return { type, messageId, text };
    }
  }
  // Legacy path: the whole buffer is the message text, no id on the wire.
  return {
    type: DmPayloadType.MESSAGE,
    messageId: "",
    text: decoder.decode(bytes),
  };
}
