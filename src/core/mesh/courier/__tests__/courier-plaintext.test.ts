/**
 * @jest-environment node
 */
// What goes INSIDE a courier envelope, which nothing covered.
//
// The envelope's own bytes have had vectors since the courier was written, and
// they are checked against `courier-test-vectors.json` so a second
// implementation can be built from the spec. The sealed plaintext had nothing:
// no vector, no round trip, and the simulated bitchat peer never opens a
// ciphertext at all. So Airhop sealed raw UTF-8 for months while bitchat has
// always required a typed private message, every envelope Airhop sent was
// dropped by every bitchat recipient, every envelope it received rendered a
// binary structure as message text, and the whole suite stayed green.
//
// These are the bytes bitchat's `BLENoisePayloadFactory.privateMessage` writes
// and its `openCourierEnvelope` reads. Pinned as literal hex rather than a
// round trip through our own encoder, because a round trip agrees with itself
// whatever it produces, and agreeing with ourselves is exactly the failure this
// replaces.

import {
  decodeNoisePayload,
  decodePrivateMessagePacket,
  encodeNoisePrivateMessage,
  NoisePayloadType,
  PRIVATE_MESSAGE_MAX_CONTENT_BYTES,
} from "../../wire/noise-payload";

function hex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

describe("the courier envelope plaintext", () => {
  test("is a typed private message, byte for byte", () => {
    const sealed = encodeNoisePrivateMessage("id1", "hi");
    expect(sealed).not.toBeNull();

    //  01        NoisePayloadType.privateMessage
    //  00 03     TLV messageID, length 3
    //  69 64 31  "id1"
    //  01 02     TLV content, length 2
    //  68 69     "hi"
    expect(hex(sealed as Uint8Array)).toBe("01" + "000369643101026869");
  });

  test("puts the message ID before the content", () => {
    // The factory on the iOS side takes (content:messageID:) but writes the ID
    // first. Getting this backwards would still round-trip through our own
    // decoder and fail against every bitchat peer.
    const sealed = encodeNoisePrivateMessage("aa", "bb") as Uint8Array;
    expect(sealed[1]).toBe(0x00);
    expect(hex(sealed.slice(3, 5))).toBe("6161");
  });

  test("round trips through the receive path the courier actually uses", () => {
    const sealed = encodeNoisePrivateMessage("msg-7", "meet at the gate");
    const typed = decodeNoisePayload(sealed as Uint8Array);

    expect(typed?.type).toBe(NoisePayloadType.PRIVATE_MESSAGE);
    const pm = decodePrivateMessagePacket((typed as { body: Uint8Array }).body);
    expect(pm).toEqual({ messageID: "msg-7", content: "meet at the gate" });
  });

  test("refuses content no bitchat peer could encode either", () => {
    // Both sides cap a private message at 255 BYTES, not characters, and both
    // return nothing rather than truncating. sendViaCourier turns that into a
    // refusal, so the message stays queued instead of being sealed into
    // something the recipient cannot read.
    const tooLong = "x".repeat(PRIVATE_MESSAGE_MAX_CONTENT_BYTES + 1);
    expect(encodeNoisePrivateMessage("id", tooLong)).toBeNull();

    // Measured in UTF-8: 128 two-byte characters is 256 bytes.
    expect(encodeNoisePrivateMessage("id", "é".repeat(128))).toBeNull();
    expect(encodeNoisePrivateMessage("id", "é".repeat(127))).not.toBeNull();
  });

  test("rejects a plaintext that is not a private message", () => {
    // bitchat refuses any other payload type outright rather than guessing.
    // Airhop's courier open does the same, which is what stops a receipt or a
    // group invite being rendered as somebody's message text.
    const notAMessage = new Uint8Array([NoisePayloadType.DELIVERED, 0x61]);
    const typed = decodeNoisePayload(notAMessage);
    expect(typed?.type).not.toBe(NoisePayloadType.PRIVATE_MESSAGE);
  });

  test("rejects a truncated packet rather than half-reading it", () => {
    const sealed = encodeNoisePrivateMessage("id1", "hi") as Uint8Array;
    const typed = decodeNoisePayload(sealed.slice(0, sealed.length - 1));
    expect(
      decodePrivateMessagePacket((typed as { body: Uint8Array }).body),
    ).toBeNull();
  });
});
