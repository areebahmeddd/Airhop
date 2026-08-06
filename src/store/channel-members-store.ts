// Who has proven they are in a private channel.
//
// A private channel has no roster on the wire: the key rides an invite link and
// there is no signed member list (unlike a private group, whose creator-signed
// roster lives in group-store). Membership is possession of the key, and the
// only proof of it is a message that opened with it.
//
// Written from both transports, since a private channel can be BLE-only or
// BLE + Nostr:
//   BLE    mesh-service onChannelEnc, when the trial decrypt succeeds
//   Nostr  private-channel-service, when the sealed event opens
//
// Not persisted: this is who is here, not who was ever invited.

import { create } from "zustand";

export interface ChannelMember {
  peerID: string;
  nickname: string;
  lastSeenMs: number;
}

// A memory bound rather than a rule: private channels have no member cap.
const MAX_MEMBERS_PER_CHANNEL = 256;

interface ChannelMembersState {
  byChannel: Record<string, ChannelMember[]>;

  // Record proof that this peer holds the channel key. Idempotent.
  noteMember: (channel: string, peerID: string, nickname: string) => void;
  membersFor: (channel: string) => ChannelMember[];
  clearChannel: (channel: string) => void;
  clearAll: () => void;
}

export const useChannelMembersStore = create<ChannelMembersState>(
  (set, get) => ({
    byChannel: {},

    noteMember(channel, peerID, nickname) {
      const existing = get().byChannel[channel] ?? [];
      const prior = existing.find((m) => m.peerID === peerID);
      // Skip the write when nothing changed, so a busy channel does not
      // re-render every subscriber on each message.
      const now = Date.now();
      if (prior?.nickname === nickname && prior.lastSeenMs === now) return;

      const next = [
        { peerID, nickname, lastSeenMs: now },
        ...existing.filter((m) => m.peerID !== peerID),
      ]
        .sort((a, b) => b.lastSeenMs - a.lastSeenMs)
        .slice(0, MAX_MEMBERS_PER_CHANNEL);
      set((state) => ({ byChannel: { ...state.byChannel, [channel]: next } }));
    },

    membersFor(channel) {
      return get().byChannel[channel] ?? [];
    },

    clearChannel(channel) {
      set((state) => {
        if (state.byChannel[channel] === undefined) return state;
        const next = { ...state.byChannel };
        delete next[channel];
        return { byChannel: next };
      });
    },

    clearAll() {
      set({ byChannel: {} });
    },
  }),
);
