// Following a source route planned by another node.
//
// A v2 packet may carry an explicit hop list between sender and recipient
// (`[count:u8][hop:8]...`, decoded by packet-codec into `route`). A relay named
// in that list forwards to the next name instead of flooding.
//
// Airhop follows routes but never originates them. Following is cheap and
// keeps us from being a node other implementations have to route around.
// Originating would require a topology, and the only source of one is the
// `directNeighbors` TLV (`0x04`): every node publishing, in cleartext, who it
// is connected to. For an app built for protests and blackouts, that hands the
// social graph of a room to any nearby radio to save relay bandwidth. bitchat's
// own peer-ID rotation analysis reaches the same conclusion about their client.
// So we emit no `0x04`, build no topology, and attach no routes; flooding is
// the documented fallback either way.

import { isBroadcast, SENDER_ID_SIZE, type Packet } from "../wire/packet-codec";

function toHex(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += b.toString(16).padStart(2, "0");
  return s;
}

// The peer this packet should go to next, or null when it is not source-routed
// through us and should be handled by the ordinary flood path.
//
// Returns null - meaning "flood" - for every case that is not an unambiguous
// instruction addressed to us:
//
//   * no route, or a v1 packet (the HAS_ROUTE flag is not valid below v2 and
//     the decoder never sets `route` for one)
//   * a route we are not named in, which is someone else's path crossing us
//   * a route naming us more than once, which is a loop rather than a path
//
// Falling back to flooding on anything unclear is the safe direction: a flood
// heals around a bad hop, whereas a routed unicast to a guessed peer is a
// packet quietly dropped.
export function nextHopFor(packet: Packet, myPeerIDHex: string): string | null {
  const route = packet.route;
  if (route === undefined || route.length === 0) return null;
  if ((packet.version ?? 2) < 2) return null;

  const me = myPeerIDHex.toLowerCase();
  const hops = route.map((h) => toHex(h.slice(0, SENDER_ID_SIZE)));

  const index = hops.indexOf(me);
  if (index < 0) return null;
  if (hops.indexOf(me, index + 1) >= 0) return null;

  // Last intermediate hop: the next name is the recipient, which lives in the
  // header rather than the route (the route carries intermediates only).
  if (index === hops.length - 1) {
    // A broadcast has no single next hop, so a route on one is meaningless;
    // flood it. isBroadcast() owns the definition, which covers the omitted
    // field, the all-zero form and the all-0xFF sentinel other implementations
    // send. Testing the bytes here instead would miss the last one and unicast
    // to a peer ID that cannot exist.
    if (isBroadcast(packet)) return null;
    return toHex(packet.recipientID.slice(0, SENDER_ID_SIZE));
  }

  return hops[index + 1];
}
