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

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getStorage } from "./mmkv";

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
  // How this contact's keys reached us. NOT whether they have been confirmed:
  // that is `verification` below, and keeping the two apart is the point.
  //
  // "qr"     scanned off the other person's screen with the camera
  // "link"   the same card delivered some other way: an airhop:// link, the
  //          photo roll, a card handed over inside a geohash DM. The keys are
  //          equally real and equally self-consistent; what is missing is any
  //          evidence about WHO sent it, since a link can be posted on a web
  //          page or pasted into a message by anyone
  // "manual" only a peer ID was typed in, so no keys at all until their first
  //          ANNOUNCE arrives
  source: "qr" | "link" | "manual";
  // Whether a human has confirmed the keys above are this person's, and how.
  // Absent means nobody has checked.
  //
  // Separate from `source` because the two change under opposite rules: how
  // keys arrived may be rewritten by any later write, confirmation may not.
  //
  // "in-person"   camera scan of their live screen. The app witnessed the
  //               exchange, which is also the only thing that earns the right
  //               to re-pin keys (see MeshService.addVerifiedContact)
  // "fingerprint" both parties read the same safety number to each other over a
  //               channel they trust. Confirms keys already held rather than
  //               importing any, so it grants no re-pinning power
  //
  // Equally strong as verification. They differ in what else they may do.
  //
  // Absent on records predating the field; `isVerified` reads `source === "qr"`
  // as in-person for those, so no migration is required.
  verification?: "in-person" | "fingerprint";
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
  // Available for any contact whose keys we hold, see setLocalNickname.
  localNickname?: string;
  // When the confirmation happened, which is not when the contact was saved.
  // Holding them apart is what lets `addContact` keep the earliest `addedAtMs`
  // unconditionally.
  //
  // Absent on records predating the field; readers fall back to `addedAtMs`,
  // which those records were stamped with at confirmation time.
  verifiedAtMs?: number;
}

// Ordering for the merge, so a write can never lower a contact's standing. A
// camera scan witnessed the exchange, a link witnessed nothing, and a typed
// peer ID carries no keys at all.
const SOURCE_RANK: Readonly<Record<Contact["source"], number>> = {
  manual: 0,
  link: 1,
  qr: 2,
};

// Has a human confirmed this identity, by any means. The one place that
// question is answered, so no two surfaces can disagree about one contact.
//
// The `source` fallback carries records predating `verification`, where a `qr`
// source could only have come from the camera.
export function isVerified(contact: Contact | undefined): boolean {
  if (contact === undefined) return false;
  return contact.verification !== undefined || contact.source === "qr";
}

// Which means was used, for the line under the shield. Same fallback.
export function verificationMethod(
  contact: Contact | undefined,
): Contact["verification"] | undefined {
  if (contact === undefined) return undefined;
  if (contact.verification !== undefined) return contact.verification;
  return contact.source === "qr" ? "in-person" : undefined;
}

// Do we hold enough of this identity to reach them and to label them.
//
// The Noise key is the test rather than the signing key: it is what a session
// opens against, so a contact without one is a peer ID and nothing more.
// A predicate rather than a boolean so a caller that has checked can reach the
// fields it just proved are present.
export function hasKeys(contact: Contact | undefined): contact is Contact {
  return contact !== undefined && contact.noisePubKeyHex.length > 0;
}

interface ContactsState {
  contacts: Record<string, Contact>;

  // Save or update a contact. Merges onto an existing record and can never
  // weaken one, whichever of the four screens calls it. The policy lives here
  // rather than in the callers, because a rule several of them have to remember
  // is not a rule:
  //
  //   source           never decreases (see SOURCE_RANK)
  //   verification     kept once earned; only a write carrying one may set it
  //   addedAtMs        earliest wins; a re-add is not a new acquaintance
  //   verifiedAtMs     kept once set
  //   localNickname    kept unless the caller supplies one
  //   nickname         a name already on file wins over one arriving now
  //   nostrPubkeyHex   first key wins, matching setNostrPubkey
  //   noise/signing    filled when absent, replaced only by an in-person scan
  //
  // The last is the security-relevant one. `signingPubKeyHex` is not a display
  // field: `leaveIsAuthentic` falls back to it to check a LEAVE when the live
  // registry holds no pin, which is every restart. The registry already refuses
  // an over-the-air re-pin, and this holds the durable copy to the same rule.
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
  // Bind the mesh keys a peer PROVED, onto a contact saved without them.
  //
  // `saveIfAbsent` reaches only what the live registry held at that instant, so
  // a messaged contact carries no signing key and often no Noise key either. A
  // safety number needs both, which is why the two keys travel together here.
  //
  // Proof, never an announce: an announce carries the same two fields and
  // establishes neither. AUTHENTICATED_PEER_STATE qualifies because it rides
  // inside a completed Noise session, and a session completes only when the
  // remote static key hashes to the claimed peer ID.
  //
  // Fills empty slots and nothing else, so it can never re-pin what a scan
  // established, and grants no verification: holding somebody's keys is not
  // having checked them.
  setProvenKeys: (
    peerID: string,
    noisePubKeyHex: string,
    signingPubKeyHex: string,
  ) => void;
  // Record that the safety number was compared and matched. The other half of
  // verification, beside the camera scan.
  //
  // Touches no keys, which is what makes it safe for a contact whose keys
  // arrived by link: it confirms what is already stored, and a substituted key
  // would have produced words that did not match. Nothing is imported, so there
  // is no re-pinning power to gate.
  //
  // Refused without keys, since there would be nothing to have compared.
  markVerified: (peerID: string) => void;
  // Give a contact a name only you see. An empty string clears it and hands the
  // peer their own name back.
  //
  // Gated on holding their keys, not on verification, matching bitchat's
  // `canEditLocalAlias`. The label is typed against one specific peer ID and
  // never leaves the device, so no attacker can cause one, and the sheet keeps
  // `ownNicknameFor` beside it so the claimed identity stays checkable after a
  // rename. A label on an identity the app cannot address is a label on
  // nothing, which is the case the gate still refuses.
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

// Fold an incoming record onto what is stored, per the rules on `addContact`.
// Pure, so the policy is one testable function rather than four conventions.
function mergeContact(prior: Contact | undefined, next: Contact): Contact {
  if (prior === undefined) {
    // A camera scan confirms as it imports, so stamp both here rather than
    // asking every caller to remember.
    if (next.source !== "qr") return next;
    return {
      ...next,
      verification: next.verification ?? "in-person",
      verifiedAtMs: next.verifiedAtMs ?? next.addedAtMs,
    };
  }

  const source =
    SOURCE_RANK[next.source] > SOURCE_RANK[prior.source]
      ? next.source
      : prior.source;
  // Only an in-person write may replace keys already held. Anything else fills
  // an empty slot and nothing more. See addContact for why the signing key is
  // not merely cosmetic.
  const mayReplaceKeys = next.source === "qr";
  const pick = (priorKey: string, nextKey: string): string => {
    if (priorKey.length === 0) return nextKey;
    return mayReplaceKeys && nextKey.length > 0 ? nextKey : priorKey;
  };

  return {
    peerID: prior.peerID,
    noisePubKeyHex: pick(prior.noisePubKeyHex, next.noisePubKeyHex),
    signingPubKeyHex: pick(prior.signingPubKeyHex, next.signingPubKeyHex),
    // A name already on file wins, so re-adding somebody never replaces what
    // they called themselves at first contact.
    nickname: prior.nickname.trim().length > 0 ? prior.nickname : next.nickname,
    addedAtMs: Math.min(prior.addedAtMs, next.addedAtMs),
    source,
    // Set only by a write that carries one: a camera scan states "in-person",
    // `markVerified` states "fingerprint". A link carries neither, so it can
    // neither remove nor invent it. `verificationMethod` supplies the reading
    // for records predating the field.
    verification:
      verificationMethod(prior) ??
      (next.source === "qr" ? "in-person" : next.verification),
    verifiedAtMs:
      prior.verifiedAtMs ??
      (next.source === "qr" || next.verification !== undefined
        ? (next.verifiedAtMs ?? next.addedAtMs)
        : undefined),
    // First key wins, matching setNostrPubkey: a new npub for a known peer is
    // suspect rather than authoritative.
    nostrPubkeyHex:
      prior.nostrPubkeyHex !== undefined && prior.nostrPubkeyHex.length > 0
        ? prior.nostrPubkeyHex
        : next.nostrPubkeyHex,
    // Never dropped by a write that did not set one.
    localNickname: next.localNickname ?? prior.localNickname,
  };
}

const storage = getStorage("contacts-store");

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
          contacts: {
            ...state.contacts,
            [contact.peerID]: mergeContact(
              state.contacts[contact.peerID],
              contact,
            ),
          },
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

      setProvenKeys(peerID, noisePubKeyHex, signingPubKeyHex) {
        set((state) => {
          const existing = state.contacts[peerID];
          // Never manufacture a contact, matching setNostrPubkey: completing a
          // session with somebody is not the user choosing to keep them.
          if (!existing) return state;
          const noise =
            existing.noisePubKeyHex.length === 0
              ? noisePubKeyHex
              : existing.noisePubKeyHex;
          const signing =
            existing.signingPubKeyHex.length === 0
              ? signingPubKeyHex
              : existing.signingPubKeyHex;
          // Same object when neither slot moved, so a peer re-proving itself on
          // every reconnect does not re-render every screen watching this store.
          if (
            noise === existing.noisePubKeyHex &&
            signing === existing.signingPubKeyHex
          ) {
            return state;
          }
          return {
            contacts: {
              ...state.contacts,
              [peerID]: {
                ...existing,
                noisePubKeyHex: noise,
                signingPubKeyHex: signing,
              },
            },
          };
        });
      },

      markVerified(peerID) {
        set((state) => {
          const existing = state.contacts[peerID];
          // Nothing to confirm without keys, and a second comparison of the
          // same words must not move "Verified since" to today.
          if (!hasKeys(existing) || isVerified(existing)) return state;
          return {
            contacts: {
              ...state.contacts,
              [peerID]: {
                ...existing,
                verification: "fingerprint",
                verifiedAtMs: Date.now(),
              },
            },
          };
        });
      },

      setLocalNickname(peerID, nickname) {
        set((state) => {
          const existing = state.contacts[peerID];
          if (!existing) return state;
          // Here rather than in the sheet, so the rule holds however the store
          // is reached. See the interface for why.
          if (!hasKeys(existing)) return state;
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
