// Gateway carrier: a complete, signed Nostr event ferried over the mesh between
// a mesh-only peer and an internet gateway peer (MessageType.nostrCarrier 0x28).
//
// Byte-compatible with bitchat NostrCarrierPacket.swift.
//
//   toGateway (0x01)   rides a DIRECTED packet (recipientID = gateway): a
//                      mesh-only sender asks the gateway to publish its locally
//                      signed geohash event to Nostr relays.
//   fromGateway (0x02) rides a BROADCAST packet: the gateway rebroadcasts inbound
//                      relay events so mesh-only peers see the channel.
//   toBridge (0x03) / fromBridge (0x04) are the mesh-bridge variants.
//
// The carried event is public geohash chat (already plaintext on Nostr), so the
// carrier adds no encryption. It IS Schnorr-signed by the originator's per-cell
// identity, so a gateway or relay cannot forge it: verify before acting.
//
// TLV, 2-byte big-endian lengths (event JSON exceeds the 1-byte TLV range):
//   0x01 direction (1 byte)
//   0x02 geohash   (UTF-8, 1..12 bytes)
//   0x03 eventJSON (full signed event JSON, 1..16384 bytes)
// Unknown TLVs are skipped for forward compatibility.

export enum CarrierDirection {
  TO_GATEWAY = 0x01,
  FROM_GATEWAY = 0x02,
  TO_BRIDGE = 0x03,
  FROM_BRIDGE = 0x04,
}

export const CARRIER_MAX_EVENT_JSON_BYTES = 16 * 1024;
export const CARRIER_MAX_GEOHASH_LENGTH = 12;

export interface NostrCarrierPacket {
  direction: CarrierDirection;
  geohash: string;
  eventJSON: Uint8Array; // UTF-8 JSON of a full signed Nostr event
}

enum TLV {
  DIRECTION = 0x01,
  GEOHASH = 0x02,
  EVENT_JSON = 0x03,
}

const enc = new TextEncoder();
const dec = new TextDecoder("utf-8", { fatal: false });

function isDirection(v: number): v is CarrierDirection {
  return v >= 0x01 && v <= 0x04;
}

export function encodeNostrCarrier(
  packet: NostrCarrierPacket,
): Uint8Array | null {
  const geohashBytes = enc.encode(packet.geohash);
  if (
    geohashBytes.length === 0 ||
    geohashBytes.length > CARRIER_MAX_GEOHASH_LENGTH ||
    packet.eventJSON.length === 0 ||
    packet.eventJSON.length > CARRIER_MAX_EVENT_JSON_BYTES
  ) {
    return null;
  }

  const parts: Uint8Array[] = [];
  const put = (type: TLV, value: Uint8Array) => {
    const header = new Uint8Array(3);
    header[0] = type;
    header[1] = (value.length >> 8) & 0xff;
    header[2] = value.length & 0xff;
    parts.push(header, value);
  };
  put(TLV.DIRECTION, new Uint8Array([packet.direction]));
  put(TLV.GEOHASH, geohashBytes);
  put(TLV.EVENT_JSON, packet.eventJSON);

  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

export function decodeNostrCarrier(
  data: Uint8Array,
): NostrCarrierPacket | null {
  let off = 0;
  let direction: CarrierDirection | undefined;
  let geohash: string | undefined;
  let eventJSON: Uint8Array | undefined;

  while (off + 3 <= data.length) {
    const type = data[off];
    const length = (data[off + 1] << 8) | data[off + 2];
    off += 3;
    if (off + length > data.length) return null;
    const value = data.subarray(off, off + length);
    off += length;

    switch (type) {
      case TLV.DIRECTION:
        if (value.length !== 1 || !isDirection(value[0])) return null;
        direction = value[0];
        break;
      case TLV.GEOHASH:
        geohash = dec.decode(value);
        break;
      case TLV.EVENT_JSON:
        eventJSON = value.slice();
        break;
      default:
        break; // unknown TLV: forward compatible
    }
  }

  if (
    off !== data.length ||
    direction === undefined ||
    geohash === undefined ||
    eventJSON === undefined
  ) {
    return null;
  }
  // Apply the same field bounds as the constructor.
  if (
    geohash.length === 0 ||
    enc.encode(geohash).length > CARRIER_MAX_GEOHASH_LENGTH ||
    eventJSON.length === 0 ||
    eventJSON.length > CARRIER_MAX_EVENT_JSON_BYTES
  ) {
    return null;
  }
  return { direction, geohash, eventJSON };
}
