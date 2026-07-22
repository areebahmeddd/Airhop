// Blocked peers. Persisted (unlike peer-store, which is pure ephemeral BLE
// discovery state) so a block survives an app restart. Otherwise a blocked
// peer would just reappear on the next launch.
//
// Enforcement points:
//   - mesh-service `routePacket` drops every non-ANNOUNCE packet from a blocked
//     sender at a single chokepoint, so channel messages, Noise/DR DMs and file
//     transfers can never reach chat-store (and cannot resurrect a conversation
//     the user deleted). The Nostr gift-wrap handler applies the same check.
//   - mesh-service `onAnnounce` keeps them out of peer-store, so they never
//     appear on the Mesh tab. Relay/topology state is still updated, so blocking
//     one peer does not degrade the mesh for others routing through us.
//   - peer-list filters the rendered list (radar receives the already-filtered
//     array rather than filtering independently).

import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BlockedState {
  blockedPeerIDs: string[];
  blockPeer: (peerID: string) => void;
  unblockPeer: (peerID: string) => void;
  isBlocked: (peerID: string) => boolean;
}

const storage = createMMKV({ id: "blocked-store" });

const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const useBlockedStore = create<BlockedState>()(
  persist(
    (set, get) => ({
      blockedPeerIDs: [],

      blockPeer(peerID: string) {
        set((state) => {
          if (state.blockedPeerIDs.includes(peerID)) return state;
          return { blockedPeerIDs: [...state.blockedPeerIDs, peerID] };
        });
      },

      unblockPeer(peerID: string) {
        set((state) => ({
          blockedPeerIDs: state.blockedPeerIDs.filter((id) => id !== peerID),
        }));
      },

      isBlocked(peerID: string) {
        return get().blockedPeerIDs.includes(peerID);
      },
    }),
    {
      name: "blocked-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
