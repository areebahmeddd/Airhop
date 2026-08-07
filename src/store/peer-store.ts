// Peer state: nearby peers discovered via ANNOUNCE packets.
// Not persisted: peer list is always rebuilt from live BLE discovery.

import { create } from "zustand";

export interface NearbyPeer {
  peerID: string; // 16-hex chars
  nickname: string;
  lastSeenMs: number;
  noisePubKeyHex: string; // hex of 32-byte X25519 pub
  rssi?: number; // dBm, populated once BLE service is wired in v0.7+
  // Whether this peer's ANNOUNCE arrived over a BLE link we hold, rather than
  // relayed through the mesh. A direct peer cannot be invented: it requires an
  // actual GATT connection. That makes it the one thing worth protecting when
  // the list has to be trimmed.
  isDirect?: boolean;
}

interface PeerState {
  peers: Map<string, NearbyPeer>;

  upsertPeer: (peer: NearbyPeer) => void;
  // Record a fresh RSSI reading for an already-known peer. No-op for unknown
  // peers: a signal reading alone doesn't tell us their identity.
  updateRssi: (peerID: string, rssi: number) => void;
  // Bind or release a peer's direct-neighbour standing from the LINK lifecycle
  // rather than from announce contents. A link is physical: it cannot be
  // claimed, only held.
  setDirect: (peerID: string, isDirect: boolean) => void;
  removePeer: (peerID: string) => void;
  evictStale: (ttlMs?: number) => void;
  getPeer: (peerID: string) => NearbyPeer | undefined;
  reachablePeers: () => NearbyPeer[];
  clearAll: () => void;
}

// A peer is "reachable" if seen within the last 60 seconds (matches
// PEER_REACHABLE_TTL_MS in message-router.ts).
//
// Exported because this is also what the UI's green dot means. Every screen
// that renders presence reads it rather than its own literal, so the radar and
// the peer list cannot disagree about the same peer. 60s is one missed ANNOUNCE
// of slack against the 15-30s jitter in announce-manager, and it is the eviction
// cutoff below, so anything shorter greys out peers the store still holds.
export const REACHABLE_TTL_MS = 60_000;

// Ceiling on how many peers the radar will hold.
//
// Peers arrive here from ANNOUNCE packets, which anyone in range can mint in
// unlimited numbers with correctly derived IDs and valid self-signatures. The
// stale sweep runs on a timer, so between sweeps a flood could put thousands of
// invented devices into the list this screen renders. Matches the ceiling in
// PeerRegistry (message-router.ts), which bounds the same input for the same
// reason.
const MAX_TRACKED_PEERS = 200;

// How many of a peer map's entries are still reachable. Exported because the
// map outlives reachability: a peer who walks out of range without a LEAVE (or
// a BLE disconnect) sits in the map until something evicts it, so counting
// entries would report a mesh that is no longer there. Takes the map rather
// than reading the store so a caller can measure a previous state too.
export function countReachablePeers(
  peers: Map<string, NearbyPeer>,
  nowMs: number = Date.now(),
): number {
  const cutoff = nowMs - REACHABLE_TTL_MS;
  let count = 0;
  for (const peer of peers.values()) if (peer.lastSeenMs >= cutoff) count++;
  return count;
}

// The same reachable set, as IDs, for a caller that has to intersect it with a
// roster rather than just size it. Takes the map for the same reason as above,
// so a component can derive it from the value it already subscribes to instead
// of reaching back into the store and losing its reactivity.
export function reachablePeerIDs(
  peers: Map<string, NearbyPeer>,
  nowMs: number = Date.now(),
): Set<string> {
  const cutoff = nowMs - REACHABLE_TTL_MS;
  const ids = new Set<string>();
  for (const peer of peers.values()) {
    if (peer.lastSeenMs >= cutoff) ids.add(peer.peerID);
  }
  return ids;
}

export const usePeerStore = create<PeerState>()((set, get) => ({
  peers: new Map(),

  upsertPeer(peer: NearbyPeer) {
    set((state) => {
      const next = new Map(state.peers);
      const existing = state.peers.get(peer.peerID);
      // Merge over the existing entry rather than replacing it. ANNOUNCE-derived
      // updates carry no `rssi`, so a plain replace wiped the signal reading
      // every 30s: it would flicker between a real value and undefined.
      next.set(peer.peerID, { ...existing, ...peer, lastSeenMs: Date.now() });
      // Bound the list on insert.
      //
      // Directly connected peers are never trimmed: holding a GATT link to
      // someone is proof they exist, and they are exactly who an attacker would
      // want pushed off the radar. Everything else goes oldest-seen first.
      if (existing === undefined && next.size > MAX_TRACKED_PEERS) {
        const evictable = [...next.values()]
          .filter((p) => p.isDirect !== true)
          .sort((a, b) => a.lastSeenMs - b.lastSeenMs);
        let over = next.size - MAX_TRACKED_PEERS;
        for (const stale of evictable) {
          if (over <= 0) break;
          next.delete(stale.peerID);
          over--;
        }
      }
      return { peers: next };
    });
  },

  updateRssi(peerID: string, rssi: number) {
    set((state) => {
      const existing = state.peers.get(peerID);
      if (existing === undefined) return state;
      const next = new Map(state.peers);
      // Deliberately does NOT refresh lastSeenMs. RSSI is polled every 5s off
      // the GATT link, so treating it as liveness would pin a peer as "just
      // seen" forever even after their ANNOUNCE timer died, a ghost peer that
      // evictStale could never remove. Reachability stays driven by ANNOUNCEs.
      next.set(peerID, { ...existing, rssi });
      return { peers: next };
    });
  },

  setDirect(peerID: string, isDirect: boolean) {
    set((state) => {
      const existing = state.peers.get(peerID);
      if (existing === undefined || existing.isDirect === isDirect)
        return state;
      const next = new Map(state.peers);
      next.set(peerID, { ...existing, isDirect });
      return { peers: next };
    });
  },

  removePeer(peerID: string) {
    set((state) => {
      const next = new Map(state.peers);
      next.delete(peerID);
      return { peers: next };
    });
  },

  evictStale(ttlMs = REACHABLE_TTL_MS) {
    const cutoff = Date.now() - ttlMs;
    set((state) => {
      const next = new Map(state.peers);
      for (const [id, peer] of next) {
        if (peer.lastSeenMs < cutoff) next.delete(id);
      }
      return { peers: next };
    });
  },

  getPeer(peerID: string) {
    return get().peers.get(peerID);
  },

  reachablePeers() {
    const cutoff = Date.now() - REACHABLE_TTL_MS;
    return [...get().peers.values()].filter((p) => p.lastSeenMs >= cutoff);
  },

  clearAll() {
    set({ peers: new Map() });
  },
}));
