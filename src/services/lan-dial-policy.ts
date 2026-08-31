// Who to open a LAN link to, out of everyone mDNS found.
//
// Bluetooth caps itself: the radio holds six or so links and refuses more. mDNS
// hands back every device on the network, so the cap has to be deliberate here,
// or the mesh lands in a density none of its constants were tuned for. See
// ARCHITECTURE.md section 3 for the arithmetic.
//
// Policy, so it is a pure function here rather than a decision in native. Same
// split as power-policy.ts.

// Links one phone opens on a network.
//
// Sized against Bluetooth rather than the network: bitchat caps central links at
// 6 (`bleMaxCentralLinks`), so eight keeps a LAN room reading the way a
// Bluetooth room does to the flood router's jitter bands and TTL cap.
//
// Even, because the ring below takes half on each side.
export const MAX_LAN_LINKS = 8;

// The peers this device should dial.
//
// Names, not peer IDs. The ring needs an identifier every device agrees on for
// the session, and LAN's is the random mDNS instance name (see
// lan-controller.ts). Anything durable published here would be linkable across
// networks.
//
// Sort every name, our own included, into one ring; link to the
// `MAX_LAN_LINKS / 2` peers either side. Both ends compute the same ring from
// the same list, so they agree without negotiating, and each dials only the
// pairs sorting after its own name so nobody dials a peer already dialling
// them.
//
// A ring rather than "everyone dials the lowest N", which would point the room
// at a few phones: a star with hot spots, not a mesh. Below the cap the ring
// wraps and every peer is a neighbour, which is right for a hotspot.
export function dialTargets(
  selfName: string,
  discovered: readonly string[],
  maxLinks: number = MAX_LAN_LINKS,
): readonly string[] {
  const ring = [...new Set([selfName, ...discovered])].sort();
  const size = ring.length;
  if (size < 2 || maxLinks < 1) return [];

  const selfIndex = ring.indexOf(selfName);
  const reach = Math.max(1, Math.floor(maxLinks / 2));
  const neighbours = new Set<string>();
  for (let offset = 1; offset <= reach; offset++) {
    neighbours.add(ring[(selfIndex + offset) % size]);
    neighbours.add(ring[(((selfIndex - offset) % size) + size) % size]);
  }
  neighbours.delete(selfName);

  return [...neighbours].filter((name) => name > selfName).sort();
}
