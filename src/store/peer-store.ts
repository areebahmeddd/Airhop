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
  removePeer: (peerID: string) => void;
  evictStale: (ttlMs?: number) => void;
  getPeer: (peerID: string) => NearbyPeer | undefined;
  reachablePeers: () => NearbyPeer[];
}

// A peer is "reachable" if seen within the last 60 seconds (matches
// the PeerRegistry TTL in message-router.ts).
const REACHABLE_TTL_MS = 60_000;

export const usePeerStore = create<PeerState>()((set, get) => ({
  peers: new Map(),

  upsertPeer(peer: NearbyPeer) {
    set((state) => {
      const next = new Map(state.peers);
      next.set(peer.peerID, { ...peer, lastSeenMs: Date.now() });
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
}));
