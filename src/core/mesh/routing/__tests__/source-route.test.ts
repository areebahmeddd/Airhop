/**
 * @jest-environment node
 */
// Following a source route: the relay half of bitchat's v2 routing extension.
// Airhop follows routes and never originates them; see source-route.ts for why.
import { Flags, PacketType, type Packet } from "../../wire/packet-codec";
import { nextHopFor } from "../source-route";

const ALICE = "aaaaaaaaaaaaaaaa";
const BOB = "bbbbbbbbbbbbbbbb";
const CAROL = "cccccccccccccccc";
const DAVE = "dddddddddddddddd";

function bytes(peerIDHex: string): Uint8Array {
  const out = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    out[i] = parseInt(peerIDHex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

// Alice -> [route] -> Dave, per SOURCE_ROUTING.md section 3: the route carries
// intermediate hops only, never the sender or the recipient.
function routed(route: string[], recipient = DAVE, version = 2): Packet {
  return {
    type: PacketType.NOISE_ENCRYPTED,
    ttl: 7,
    flags: Flags.HAS_RECIPIENT | Flags.HAS_ROUTE,
    senderID: bytes(ALICE),
    recipientID: bytes(recipient),
    timestamp: Date.now(),
    signature: new Uint8Array(64),
    payload: new Uint8Array([1, 2, 3]),
    version,
    route: route.map(bytes),
  };
}

describe("nextHopFor", () => {
  test("a middle hop forwards to the next name in the list", () => {
    expect(nextHopFor(routed([BOB, CAROL]), BOB)).toBe(CAROL);
  });

  // The route holds intermediates only, so the last one reads the recipient out
  // of the header rather than off the end of the list.
  test("the last hop forwards to the recipient in the header", () => {
    expect(nextHopFor(routed([BOB, CAROL]), CAROL)).toBe(DAVE);
  });

  test("a single-hop route goes straight to the recipient", () => {
    expect(nextHopFor(routed([BOB]), BOB)).toBe(DAVE);
  });

  // Everything below returns null, meaning "flood". Flooding is the documented
  // fallback and the safe direction: it heals around a break, where a routed
  // unicast to a guessed peer is a packet silently lost.
  test("a packet with no route floods", () => {
    const p = routed([BOB]);
    delete (p as { route?: unknown }).route;
    expect(nextHopFor(p, BOB)).toBeNull();
  });

  test("an empty route floods", () => {
    expect(nextHopFor(routed([]), BOB)).toBeNull();
  });

  // HAS_ROUTE is not valid below v2 and a v1 relay must ignore it even when set.
  test("a v1 packet ignores the route entirely", () => {
    expect(nextHopFor(routed([BOB, CAROL], DAVE, 1), BOB)).toBeNull();
  });

  test("a route we are not named in is someone else's path", () => {
    expect(nextHopFor(routed([BOB, CAROL]), DAVE)).toBeNull();
  });

  // A repeated name is a loop, not a path: two different readings of "next"
  // exist and neither is trustworthy.
  test("a route naming us twice floods rather than guessing", () => {
    expect(nextHopFor(routed([BOB, CAROL, BOB]), BOB)).toBeNull();
  });

  // A broadcast has no single next hop, so a route on one is meaningless.
  test("a routed broadcast floods", () => {
    const p = routed([BOB], "0000000000000000");
    expect(nextHopFor(p, BOB)).toBeNull();
  });

  // The other broadcast sentinel on the wire. Missing it would unicast to a
  // peer ID of ffffffffffffffff, which cannot exist.
  test("a routed all-0xFF broadcast floods too", () => {
    const p = routed([BOB], "ffffffffffffffff");
    expect(nextHopFor(p, BOB)).toBeNull();
  });

  test("peer ID matching is case-insensitive on our side", () => {
    expect(nextHopFor(routed([BOB, CAROL]), BOB.toUpperCase())).toBe(CAROL);
  });
});
