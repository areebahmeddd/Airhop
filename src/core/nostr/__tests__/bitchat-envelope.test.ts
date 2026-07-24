/**
 * @jest-environment node
 */
// Round-trip tests for the "bitchat1:" Nostr DM envelope.
import { NoisePayloadType } from "../../mesh/noise-payload";
import {
  decodeBitchatEnvelope,
  encodeBitchatAckEnvelope,
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
