/**
 * @jest-environment node
 */
// Round-trip tests for the "bitchat1:" Nostr DM envelope.
import { NoisePayloadType } from "../../mesh/noise-payload";
import {
  decodeBitchatEnvelope,
  encodeBitchatAckEnvelope,
  encodeBitchatCardEnvelope,
  encodeBitchatDmEnvelope,
} from "../bitchat-envelope";

const SENDER = "aabbccdd00112233";
const RECIP = "1122334455667788";

describe("bitchat-envelope", () => {
  it("round-trips a private message and starts with bitchat1:", () => {
    const env = encodeBitchatDmEnvelope(SENDER, RECIP, "msg-1", "hello there")!;
    expect(env.startsWith("bitchat1:")).toBe(true);
    const dec = decodeBitchatEnvelope(env)!;
    expect(dec.type).toBe(NoisePayloadType.PRIVATE_MESSAGE);
    expect(dec.messageID).toBe("msg-1");
    expect(dec.content).toBe("hello there");
  });

  it("round-trips a message with no embedded recipient (geohash DM form)", () => {
    const env = encodeBitchatDmEnvelope(SENDER, null, "m2", "geo dm")!;
    const dec = decodeBitchatEnvelope(env)!;
    expect(dec.content).toBe("geo dm");
  });

  it("round-trips a delivered receipt", () => {
    const env = encodeBitchatAckEnvelope(
      SENDER,
      RECIP,
      NoisePayloadType.DELIVERED,
      "orig-99",
    );
    const dec = decodeBitchatEnvelope(env)!;
    expect(dec.type).toBe(NoisePayloadType.DELIVERED);
    expect(dec.messageID).toBe("orig-99");
    expect(dec.content).toBe("");
  });

  it("returns null for content longer than 255 bytes", () => {
    expect(
      encodeBitchatDmEnvelope(SENDER, RECIP, "m", "x".repeat(256)),
    ).toBeNull();
  });

  it("returns null for a non-envelope string", () => {
    expect(decodeBitchatEnvelope("hello raw text")).toBeNull();
  });
});

// A contact card handed over inside a location-channel DM, which is how two
// people who met under per-cell pseudonyms can choose to become durable
// contacts. The envelope is the existing one; only the payload type is new.
describe("the contact-card envelope", () => {
  const CARD = Uint8Array.from({ length: 138 }, (_, i) => i & 0xff);

  it("round-trips the card bytes untouched", () => {
    const wire = encodeBitchatCardEnvelope("aabbccdd00112233", null, CARD);
    const env = decodeBitchatEnvelope(wire)!;
    expect(env.type).toBe(NoisePayloadType.CONTACT_CARD);
    expect(Array.from(env.body!)).toEqual(Array.from(CARD));
  });

  // Not a message: no id, no text. So it renders no bubble and earns no
  // delivery or read receipt - a card is something you accept, not something
  // that arrives in the conversation.
  it("carries no message identity", () => {
    const env = decodeBitchatEnvelope(
      encodeBitchatCardEnvelope("aabbccdd00112233", null, CARD),
    )!;
    expect(env.messageID).toBe("");
    expect(env.content).toBe("");
  });

  // It is still a bitchat1 envelope, so a bitchat client parses the packet and
  // then drops it on the unknown payload type - which is the right outcome for
  // a client with no concept of keeping someone from a geohash. What must NOT
  // happen is it being mistaken for a message.
  it("is never mistaken for a private message", () => {
    const env = decodeBitchatEnvelope(
      encodeBitchatCardEnvelope("aabbccdd00112233", null, CARD),
    )!;
    expect(env.type).not.toBe(NoisePayloadType.PRIVATE_MESSAGE);
  });

  // The other direction: every existing type must keep reading exactly as it
  // did, with no stray body attached.
  it("leaves ordinary messages and receipts alone", () => {
    const msg = decodeBitchatEnvelope(
      encodeBitchatDmEnvelope("aabbccdd00112233", null, "m-1", "hello")!,
    )!;
    expect(msg.content).toBe("hello");
    expect(msg.body).toBeUndefined();

    const ack = decodeBitchatEnvelope(
      encodeBitchatAckEnvelope(
        "aabbccdd00112233",
        null,
        NoisePayloadType.DELIVERED,
        "m-1",
      ),
    )!;
    expect(ack.messageID).toBe("m-1");
    expect(ack.body).toBeUndefined();
  });
});
