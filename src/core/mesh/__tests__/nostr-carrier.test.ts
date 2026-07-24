/**
 * @jest-environment node
 */
// NostrCarrier wire codec (0x28), byte-compatible with bitchat.
import {
  CARRIER_MAX_EVENT_JSON_BYTES,
  CarrierDirection,
  decodeNostrCarrier,
  encodeNostrCarrier,
} from "../nostr-carrier";

const eventJSON = new TextEncoder().encode(
  JSON.stringify({
    id: "a".repeat(64),
    pubkey: "b".repeat(64),
    created_at: 1_700_000_000,
    kind: 20000,
    tags: [["g", "u4pruy"]],
    content: "hi from the mesh",
    sig: "c".repeat(128),
  }),
);

describe("nostr carrier", () => {
  it("round-trips a toGateway packet", () => {
    const packet = {
      direction: CarrierDirection.TO_GATEWAY,
      geohash: "u4pruy",
      eventJSON,
    };
    const decoded = decodeNostrCarrier(encodeNostrCarrier(packet)!)!;
    expect(decoded.direction).toBe(CarrierDirection.TO_GATEWAY);
    expect(decoded.geohash).toBe("u4pruy");
    expect(new TextDecoder().decode(decoded.eventJSON)).toContain(
      "hi from the mesh",
    );
  });

  it("round-trips every direction", () => {
    for (const direction of [
      CarrierDirection.TO_GATEWAY,
      CarrierDirection.FROM_GATEWAY,
      CarrierDirection.TO_BRIDGE,
      CarrierDirection.FROM_BRIDGE,
    ]) {
      const decoded = decodeNostrCarrier(
        encodeNostrCarrier({ direction, geohash: "u4", eventJSON })!,
      )!;
      expect(decoded.direction).toBe(direction);
    }
  });

  it("rejects an empty geohash", () => {
    expect(
      encodeNostrCarrier({
        direction: CarrierDirection.TO_GATEWAY,
        geohash: "",
        eventJSON,
      }),
    ).toBeNull();
  });

  it("rejects an oversize event", () => {
    const tooBig = new Uint8Array(CARRIER_MAX_EVENT_JSON_BYTES + 1).fill(0x20);
    expect(
      encodeNostrCarrier({
        direction: CarrierDirection.FROM_GATEWAY,
        geohash: "u4pruy",
        eventJSON: tooBig,
      }),
    ).toBeNull();
  });

  it("rejects an unknown direction byte on decode", () => {
    // Hand-build a TLV with direction 0x09.
    const bad = new Uint8Array([0x01, 0x00, 0x01, 0x09]);
    expect(decodeNostrCarrier(bad)).toBeNull();
  });

  it("skips unknown TLVs for forward compatibility", () => {
    const base = encodeNostrCarrier({
      direction: CarrierDirection.FROM_GATEWAY,
      geohash: "u4pruy",
      eventJSON,
    })!;
    const extended = new Uint8Array([...base, 0x7f, 0x00, 0x02, 0xaa, 0xbb]);
    // Trailing unknown TLV makes offset != length only if not consumed; the
    // decoder consumes it, so this should still decode.
    const decoded = decodeNostrCarrier(extended);
    expect(decoded).not.toBeNull();
    expect(decoded!.geohash).toBe("u4pruy");
  });
});
