// Known contacts: identities the user has deliberately added (QR / NFC).
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
  // How this contact was learned. Verified sources carry the peer's real keys;
  // "manual" means only a peer ID was typed in, so the keys are unknown and the
  // identity is unverified until their first ANNOUNCE arrives.
  source: "qr" | "nfc" | "manual";
}

interface ContactsState {
  contacts: Record<string, Contact>;

  addContact: (contact: Contact) => void;
  removeContact: (peerID: string) => void;
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

      removeContact(peerID) {
        set((state) => {
          const next = { ...state.contacts };
          delete next[peerID];
          return { contacts: next };
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
