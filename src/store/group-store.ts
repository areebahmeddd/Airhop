// Private groups this device belongs to: metadata, roster, and the current
// epoch's symmetric key. Persisted to MMKV (wiped on panic, since the epoch key
// decrypts every group message). The chat itself lives in chat-store under the
// virtual channel `group:<groupID hex>`.
//
// State arrives two ways: our own groups (we are the creator) via upsertLocal,
// and groups we are invited to via a creator-signed GroupStatePayload the caller
// has already verified (upsertFromState). A newer epoch replaces an older one.

import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import {
  type BitchatGroup,
  type GroupMember,
  type GroupStatePayload,
} from "../core/mesh/group-protocol";

interface StoredMember {
  fingerprint: string;
  signingKey: string; // hex
  nickname: string;
}
export interface StoredGroup {
  groupID: string; // hex
  name: string;
  epoch: number;
  members: StoredMember[];
  creatorFingerprint: string;
  key: string; // hex epoch key
}

export interface RuntimeGroup {
  groupID: Uint8Array;
  name: string;
  epoch: number;
  members: GroupMember[];
  creatorFingerprint: string;
  key: Uint8Array;
}

interface GroupState {
  groups: StoredGroup[];
  upsertLocal: (group: BitchatGroup, key: Uint8Array) => void;
  upsertFromState: (payload: GroupStatePayload) => void;
  get: (groupIDHex: string) => RuntimeGroup | undefined;
  getByID: (groupID: Uint8Array) => RuntimeGroup | undefined;
  nameForChannel: (channel: string) => string | undefined;
  remove: (groupIDHex: string) => void;
  clearAll: () => void;
}

const STORAGE_ID = "group-store";
const STORAGE_KEY = "groups";
const storage = createMMKV({ id: STORAGE_ID });

function toStoredMember(m: GroupMember): StoredMember {
  return {
    fingerprint: m.fingerprint,
    signingKey: bytesToHex(m.signingKey),
    nickname: m.nickname,
  };
}

function toStored(group: BitchatGroup, key: Uint8Array): StoredGroup {
  return {
    groupID: bytesToHex(group.groupID),
    name: group.name,
    epoch: group.epoch,
    members: group.members.map(toStoredMember),
    creatorFingerprint: group.creatorFingerprint,
    key: bytesToHex(key),
  };
}

function toRuntime(g: StoredGroup): RuntimeGroup {
  return {
    groupID: hexToBytes(g.groupID),
    name: g.name,
    epoch: g.epoch,
    members: g.members.map((m) => ({
      fingerprint: m.fingerprint,
      signingKey: hexToBytes(m.signingKey),
      nickname: m.nickname,
    })),
    creatorFingerprint: g.creatorFingerprint,
    key: hexToBytes(g.key),
  };
}

function load(): StoredGroup[] {
  const raw = storage.getString(STORAGE_KEY);
  if (raw === undefined) return [];
  try {
    return JSON.parse(raw) as StoredGroup[];
  } catch {
    return [];
  }
}

export const useGroupStore = create<GroupState>((set, get) => {
  function persist(groups: StoredGroup[]): void {
    if (groups.length === 0) storage.remove(STORAGE_KEY);
    else storage.set(STORAGE_KEY, JSON.stringify(groups));
  }

  function put(entry: StoredGroup): void {
    set((state) => {
      const existing = state.groups.find((g) => g.groupID === entry.groupID);
      // Ignore an older or equal epoch: the newest key/roster wins.
      if (existing !== undefined && entry.epoch < existing.epoch) return state;
      const groups = [
        ...state.groups.filter((g) => g.groupID !== entry.groupID),
        entry,
      ];
      persist(groups);
      return { groups };
    });
  }

  return {
    groups: load(),

    upsertLocal(group, key) {
      put(toStored(group, key));
    },

    upsertFromState(payload) {
      put(
        toStored(
          {
            groupID: payload.groupID,
            name: payload.name,
            epoch: payload.epoch,
            members: payload.members,
            creatorFingerprint: payload.creatorFingerprint,
          },
          payload.key,
        ),
      );
    },

    get(groupIDHex) {
      const g = get().groups.find((x) => x.groupID === groupIDHex);
      return g !== undefined ? toRuntime(g) : undefined;
    },

    getByID(groupID) {
      return get().get(bytesToHex(groupID));
    },

    nameForChannel(channel) {
      if (!channel.startsWith("group:")) return undefined;
      const id = channel.slice("group:".length);
      return get().groups.find((g) => g.groupID === id)?.name;
    },

    remove(groupIDHex) {
      set((state) => {
        const groups = state.groups.filter((g) => g.groupID !== groupIDHex);
        persist(groups);
        return { groups };
      });
    },

    clearAll() {
      set({ groups: [] });
      storage.remove(STORAGE_KEY);
    },
  };
});

// The virtual chat channel for a group.
export function groupChannel(groupIDHex: string): string {
  return `group:${groupIDHex}`;
}
