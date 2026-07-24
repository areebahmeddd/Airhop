// Private-DM payload envelope: what actually sits inside an encrypted DM.
//
// Before this, a DM's decrypted plaintext was just the raw message text. To
// support delivery and read receipts we need two things inside the encrypted
// payload: a type discriminator (is this a message, or a receipt?) and the
// message id a receipt refers to. This mirrors bitchat's NoisePayloadType so
// the format is already wire-compatible when the full bitchat pass happens:
//   0x01 message, 0x02 read receipt, 0x03 delivered receipt.
//
// Layout:
//   [0]              type      u8
//   [1]              idLen     u8   (bytes of the message id, 0-255)
//   [2 .. 2+idLen]   id        UTF-8 message id
//   [2+idLen .. ]    text      UTF-8 message text (type 0x01 only; empty for receipts)
//
// Backward compatibility is the safety net: any buffer that is not a
// well-formed envelope (too short, unknown type byte, or an idLen that does not
// fit) is treated as a legacy raw-text message. Normal UTF-8 text never starts
// with a 0x01/0x02/0x03 control byte, so a real message is never misread as an
// envelope, and vice versa. This means a peer on the old format still shows up
// correctly, just without a receipt.

export const DmPayloadType = {
  MESSAGE: 0x01,
  READ_RECEIPT: 0x02,
  DELIVERED: 0x03,
} as const;

export type DmPayloadType = (typeof DmPayloadType)[keyof typeof DmPayloadType];

export interface DmPayload {
  type: DmPayloadType;
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
  type: DmPayloadType,
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
