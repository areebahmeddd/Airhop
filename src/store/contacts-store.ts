// Known contacts: identities the user has deliberately added (via QR).
//
// This is the piece that was missing entirely. `peer-store` holds *nearby*
// peers and is ephemeral by design: it is rebuilt from live ANNOUNCE traffic
// and forgets everything on restart. So "Add Contact" had nowhere durable to
// write, and did nothing beyond creating a chat-store channel string: no keys
// captured, no name remembered, nothing that survived a relaunch.
//
// A contact is a *known* identity; a peer is a *reachable* one. They are
// deliberately separate: someone can be a contact while out of range for days,
// and appearing on the Mesh tab should keep meaning "actually nearby right now".
//
// Storing the public keys is what makes adding a contact meaningful: it lets a
// DM route be established without waiting to hear their ANNOUNCE, gives the
// thread their real nickname instead of one generated from the peer ID, and
// pins the identity so a later ANNOUNCE claiming that peer ID with different
// keys can be recognised as an impersonation attempt.

import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Contact {
  peerID: string; // 16 hex chars
  noisePubKeyHex: string; // 32-byte X25519, hex
  signingPubKeyHex: string; // 32-byte Ed25519, hex
  nickname: string;
  addedAtMs: number;
  // How this contact was learned. A QR scan carries the peer's real keys;
  // "manual" means only a peer ID was typed in, so the keys are unknown and the
  // identity is unverified until their first ANNOUNCE arrives.
  source: "qr" | "manual";
  // The peer's Nostr public key (secp256k1 hex), once we've learned it from a
  // v2 QR card or their ANNOUNCE. This is what makes an out-of-range contact
  // reachable over the internet: the registry forgets a peer's npub 60s after
  // their radio disappears, but a contact keeps it for good, so a DM to someone
  // who has left Bluetooth range (or was never in it) can still fall back to a
  // gift-wrapped Nostr DM. Absent for contacts we only know by peer ID.
  nostrPubkeyHex?: string;
}

interface ContactsState {
  contacts: Record<string, Contact>;

  addContact: (contact: Contact) => void;
  // Save a peer as an unverified contact if not already saved. The one entry
  // point for the Signal-style "people you message are kept" behaviour, so
  // every path that starts a conversation stays consistent.
  saveIfAbsent: (
    peerID: string,
    nickname: string,
    noisePubKeyHex: string,
  ) => void;
  removeContact: (peerID: string) => void;
  // Bind a peer's durable Nostr pubkey to their contact. Idempotent: learning
  // the same key again is a no-op, and it never overwrites a stored key with a
  // different one (an ANNOUNCE claiming a new npub for a known peer is treated
  // as suspect, not authoritative). No-op when no contact exists for the peer,
  // so we never manufacture a contact for a stranger just because we heard them.
  setNostrPubkey: (peerID: string, nostrPubkeyHex: string) => void;
  // Set a custom display name for a saved contact. Flows into DMs, channel
  // messages, and notifications through resolveDisplayName / nicknameFor.
  renameContact: (peerID: string, nickname: string) => void;
  getContact: (peerID: string) => Contact | undefined;
  // Display name for a peer ID, or undefined to fall back to a generated one.
  nicknameFor: (peerID: string) => string | undefined;
  all: () => Contact[];
  clearAll: () => void;
}

const storage = createMMKV({ id: "contacts-store" });

const mmkvStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

export const useContactsStore = create<ContactsState>()(
  persist(
    (set, get) => ({
      contacts: {},

      addContact(contact) {
        set((state) => ({
          contacts: { ...state.contacts, [contact.peerID]: contact },
        }));
      },

      saveIfAbsent(peerID, nickname, noisePubKeyHex) {
        if (get().contacts[peerID]) return;
        set((state) => ({
          contacts: {
            ...state.contacts,
            [peerID]: {
              peerID,
              noisePubKeyHex,
              signingPubKeyHex: "",
              nickname,
              addedAtMs: Date.now(),
              source: "manual",
            },
          },
        }));
      },

      removeContact(peerID) {
        set((state) => {
          const next = { ...state.contacts };
          delete next[peerID];
          return { contacts: next };
        });
      },

      setNostrPubkey(peerID, nostrPubkeyHex) {
        if (nostrPubkeyHex.length === 0) return;
        set((state) => {
          const existing = state.contacts[peerID];
          // Only bind onto an existing contact, and never re-bind a different
          // key over one we already trust (first key wins, matching how the
          // peerID/key binding is pinned on first sight).
          if (!existing || existing.nostrPubkeyHex === nostrPubkeyHex)
            return state;
          if (
            existing.nostrPubkeyHex !== undefined &&
            existing.nostrPubkeyHex.length > 0
          )
            return state;
          return {
            contacts: {
              ...state.contacts,
              [peerID]: { ...existing, nostrPubkeyHex },
            },
          };
        });
      },

      renameContact(peerID, nickname) {
        set((state) => {
          const existing = state.contacts[peerID];
          if (!existing) return state;
          return {
            contacts: {
              ...state.contacts,
              [peerID]: { ...existing, nickname },
            },
          };
        });
      },

      getContact(peerID) {
        return get().contacts[peerID];
      },

      nicknameFor(peerID) {
        const nickname = get().contacts[peerID]?.nickname;
        return nickname !== undefined && nickname.length > 0
          ? nickname
          : undefined;
      },

      all() {
        return Object.values(get().contacts).sort(
          (a, b) => b.addedAtMs - a.addedAtMs,
        );
      },

      clearAll() {
        set({ contacts: {} });
      },
    }),
    {
      name: "contacts-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
