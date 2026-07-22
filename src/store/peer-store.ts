// Peer state: nearby peers discovered via ANNOUNCE packets.
// Not persisted: peer list is always rebuilt from live BLE discovery.

import { create } from "zustand";

export interface NearbyPeer {
  peerID: string; // 16-hex chars
  nickname: string;
  lastSeenMs: number;
  noisePubKeyHex: string; // hex of 32-byte X25519 pub
  rssi?: number; // dBm, populated once BLE service is wired in v0.7+
}

interface PeerState {
  peers: Map<string, NearbyPeer>;

  upsertPeer: (peer: NearbyPeer) => void;
  // Record a fresh RSSI reading for an already-known peer. No-op for unknown
  // peers: a signal reading alone doesn't tell us their identity.
  updateRssi: (peerID: string, rssi: number) => void;
  removePeer: (peerID: string) => void;
  evictStale: (ttlMs?: number) => void;
  getPeer: (peerID: string) => NearbyPeer | undefined;
  reachablePeers: () => NearbyPeer[];
  clearAll: () => void;
}

// A peer is "reachable" if seen within the last 60 seconds (matches
// the PeerRegistry TTL in message-router.ts).
const REACHABLE_TTL_MS = 60_000;

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
