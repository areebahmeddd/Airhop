/**
 * @jest-environment node
 */
// The rule that stops mDNS turning a room into a full mesh.
//
// The properties asserted below are what the rest of the mesh depends on, so
// they are checked over a whole simulated room rather than one device: every
// pair agrees, nobody dials twice, the graph stays connected, and no device
// carries more links than the cap allows.
import { dialTargets, MAX_LAN_LINKS } from "../lan-dial-policy";

// Peer IDs are 16 lowercase hex characters, all the same length, so a plain
// string sort is the numeric one.
function room(count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    i.toString(16).padStart(16, "0"),
  );
}

// Every link the room ends up holding, from each device's own decision.
function linksOf(peers: readonly string[]): Map<string, Set<string>> {
  const links = new Map<string, Set<string>>(
    peers.map((p) => [p, new Set<string>()]),
  );
  for (const self of peers) {
    const others = peers.filter((p) => p !== self);
    for (const target of dialTargets(self, others)) {
      links.get(self)?.add(target);
      links.get(target)?.add(self);
    }
  }
  return links;
}

function isConnected(links: Map<string, Set<string>>): boolean {
  const all = [...links.keys()];
  if (all.length === 0) return true;
  const seen = new Set<string>([all[0]]);
  const queue = [all[0]];
  while (queue.length > 0) {
    const next = queue.shift() as string;
    for (const peer of links.get(next) ?? []) {
      if (seen.has(peer)) continue;
      seen.add(peer);
      queue.push(peer);
    }
  }
  return seen.size === all.length;
}

describe("dialTargets", () => {
  it("dials nobody when the network is empty", () => {
    expect(dialTargets("aaaa", [])).toEqual([]);
  });

  it("has exactly one side of a pair dial", () => {
    expect(dialTargets("aaaa", ["bbbb"])).toEqual(["bbbb"]);
    expect(dialTargets("bbbb", ["aaaa"])).toEqual([]);
  });

  it("ignores our own ID appearing in the discovered list", () => {
    expect(dialTargets("aaaa", ["aaaa", "bbbb"])).toEqual(["bbbb"]);
  });

  it("connects everyone to everyone while the room is under the cap", () => {
    const peers = room(4);
    const links = linksOf(peers);

    for (const peer of peers) {
      expect(links.get(peer)?.size).toBe(peers.length - 1);
    }
  });

  describe("a room past the cap", () => {
    const peers = room(30);
    const links = linksOf(peers);

    it("holds no device over the cap", () => {
      for (const peer of peers) {
        expect(links.get(peer)?.size).toBeLessThanOrEqual(MAX_LAN_LINKS);
      }
    });

    it("spreads the load rather than pointing the room at a few phones", () => {
      const counts = peers.map((p) => links.get(p)?.size ?? 0);
      expect(Math.min(...counts)).toBe(MAX_LAN_LINKS);
      expect(Math.max(...counts)).toBe(MAX_LAN_LINKS);
    });

    it("leaves the graph connected, so nothing is stranded", () => {
      expect(isConnected(links)).toBe(true);
    });

    it("never has both ends dial the same pair", () => {
      for (const self of peers) {
        const others = peers.filter((p) => p !== self);
        for (const target of dialTargets(self, others)) {
          const back = dialTargets(
            target,
            peers.filter((p) => p !== target),
          );
          expect(back).not.toContain(self);
        }
      }
    });
  });

  it("stays connected at the sizes a venue actually reaches", () => {
    for (const size of [2, 3, 5, 9, 16, 50, 200]) {
      const peers = room(size);
      const links = linksOf(peers);
      expect(isConnected(links)).toBe(true);
      for (const peer of peers) {
        expect(links.get(peer)?.size).toBeLessThanOrEqual(MAX_LAN_LINKS);
      }
    }
  });

  it("is stable: the same room always produces the same plan", () => {
    const peers = room(12);
    const shuffled = [...peers].reverse();
    expect(
      dialTargets(
        peers[3],
        peers.filter((p) => p !== peers[3]),
      ),
    ).toEqual(
      dialTargets(
        peers[3],
        shuffled.filter((p) => p !== peers[3]),
      ),
    );
  });
});
