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

// Cap on a local nickname, matching the 32 bytes a contact card carries for the
// peer's own name. A label the user types has no wire format of its own, but
// holding the two to one length keeps the sheet's two name rows the same shape.
const MAX_NICKNAME_LENGTH = 32;

export interface Contact {
  peerID: string; // 16 hex chars
  noisePubKeyHex: string; // 32-byte X25519, hex
  signingPubKeyHex: string; // 32-byte Ed25519, hex
  nickname: string;
  addedAtMs: number;
  // How this contact was learned, which is what "Verified" is allowed to mean.
  //
  // "qr"     scanned off the other person's screen with the camera. The keys are
  //          real AND the user was standing there, so this is the only source
  //          that earns the verified shield.
  // "link"   the same card, but delivered as an airhop:// link. The keys are
  //          equally real and equally self-consistent - what is missing is any
  //          evidence about WHO sent it, since a link can be posted on a web
  //          page or pasted into a message by anyone. Treated as a convenience,
  //          never as verification.
  // "manual" only a peer ID was typed in, so the keys are unknown and the
  //          identity is unverified until their first ANNOUNCE arrives.
  source: "qr" | "link" | "manual";
  // The peer's Nostr public key (secp256k1 hex), once we've learned it from a
  // v2 QR card or their ANNOUNCE. This is what makes an out-of-range contact
  // reachable over the internet: the registry forgets a peer's npub 60s after
  // their radio disappears, but a contact keeps it for good, so a DM to someone
  // who has left Bluetooth range (or was never in it) can still fall back to a
  // gift-wrapped Nostr DM. Absent for contacts we only know by peer ID.
  nostrPubkeyHex?: string;
  // A name only you see, kept apart from `nickname` above.
  //
  // `nickname` is what the peer calls themselves, and it must survive being
  // relabelled: the contact sheet shows both, so "who they say they are" stays
  // checkable after you have renamed them to something you recognise. Writing
  // your label over theirs would destroy the only copy of it you hold.
  //
  // Never leaves the device. It is not announced, not carried in a card, and
  // not what anyone else sees.
  //
  // Set only on a contact verified in person - see setLocalNickname for why
  // that gate is a security property rather than a formality.
  localNickname?: string;
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
  // Give a verified contact a name only you see. An empty string clears it and
  // hands the peer their own name back.
  //
  // Refused for anyone not verified in person, and that is the point rather
  // than a formality. A local name is what you will recognise them by from then
  // on - it replaces the generated username in the DM list, in the radar, in
  // channel messages and in notifications. If any stranger could be relabelled,
  // somebody who announced a familiar-looking nickname could be filed under
  // "Mum" and the label would be doing the identifying from that moment on.
  // Requiring a scanned card means the name is anchored to a fingerprint the
  // user checked while standing in front of the person.
  setLocalNickname: (peerID: string, nickname: string) => void;
  getContact: (peerID: string) => Contact | undefined;
  // Display name for a peer ID, or undefined to fall back to a generated one.
  nicknameFor: (peerID: string) => string | undefined;
  // The peer's own name, ignoring any local label. Undefined when they have
  // never announced one.
  ownNicknameFor: (peerID: string) => string | undefined;
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

      setLocalNickname(peerID, nickname) {
        set((state) => {
          const existing = state.contacts[peerID];
          if (!existing) return state;
          // The gate lives here rather than in the sheet, so the rule holds
          // however the store is reached. See the interface for why.
          if (existing.source !== "qr") return state;
          const trimmed = nickname.trim().slice(0, MAX_NICKNAME_LENGTH);
          return {
            contacts: {
              ...state.contacts,
              [peerID]: {
                ...existing,
                localNickname: trimmed.length > 0 ? trimmed : undefined,
              },
            },
          };
        });
      },

      getContact(peerID) {
        return get().contacts[peerID];
      },

      // Your own label wins over theirs. Everything downstream reads names
      // through here, so one line puts a local nickname on the DM list, the
      // radar, channel messages and notifications at once.
      nicknameFor(peerID) {
        const contact = get().contacts[peerID];
        const name = contact?.localNickname ?? contact?.nickname;
        return name !== undefined && name.length > 0 ? name : undefined;
      },

      // What the peer calls themselves, ignoring any label you have put on
      // them. The contact sheet shows this beside your name for them, so the
      // identity you verified stays checkable after renaming.
      ownNicknameFor(peerID) {
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
