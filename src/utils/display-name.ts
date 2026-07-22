// Single source of truth for how a peer is named in the UI.
//
// Three names can exist for one peer and they were being resolved
// inconsistently: peer-list, radar-view and dm-list all called
// peerIDToUsername() directly, so a peer who had set a nickname, or whom the
// user had deliberately added as a contact, still showed as the generated
// "swift-otter-42". Meanwhile channel-info-sheet did consult the announced
// nickname, so the SAME peer appeared under two different names on two screens.
//
// Precedence, most trusted first:
//   1. Contact nickname: the user added them deliberately (QR/NFC card).
//   2. Announced nickname: what the peer calls themselves over the mesh.
//   3. Generated username: deterministic from the peer ID; always available.
//
// A Nostr-only correspondent (`nostr_<pubkey>`) has no peer ID to derive from,
// so it gets a short npub-style label instead of a nonsense generated name.

import { useContactsStore } from "../store/contacts-store";
import { usePeerStore } from "../store/peer-store";
import { peerIDToUsername } from "./username";

const NOSTR_PREFIX = "nostr_";

// Name shown for a sender inside a PUBLIC channel.
//
// Public channels are open to anyone in range, so the nickname a peer announces
// is self-asserted and unverified. Two people can claim the same one, whether
// by coincidence or to impersonate. Suffixing with the last 4 chars of the peer
// ID (which IS cryptographically bound, being the fingerprint of their Noise
// key) keeps them distinguishable. Same convention geohash channels use, so one
// person renders identically whether their message arrived over BLE or Nostr.
//
// DMs deliberately do NOT use this: there the peer is a specific verified
// session, not one of a crowd.
export function channelDisplayName(
  peerID: string,
  announcedNickname?: string,
): string {
  const suffix = peerID.slice(-4);
  const contactName = useContactsStore.getState().nicknameFor(peerID);
  const base =
    contactName ??
    (announcedNickname !== undefined && announcedNickname.length > 0
      ? announcedNickname
      : peerIDToUsername(peerID));
  return `${base}#${suffix}`;
}

// Resolve outside React (services, stores, event handlers).
export function resolveDisplayName(peerID: string): string {
  if (peerID.startsWith(NOSTR_PREFIX)) {
    return `npub…${peerID.slice(-6)}`;
  }

  const contactName = useContactsStore.getState().nicknameFor(peerID);
  if (contactName !== undefined) return contactName;

  const announced = usePeerStore.getState().getPeer(peerID)?.nickname;
  if (announced !== undefined && announced.length > 0) return announced;

  return peerIDToUsername(peerID);
}

// Hook form: re-renders when the contact or peer entry changes.
export function useDisplayName(peerID: string): string {
  const contactName = useContactsStore((s) => s.contacts[peerID]?.nickname);
  const announced = usePeerStore((s) => s.peers.get(peerID)?.nickname);

  if (peerID.startsWith(NOSTR_PREFIX)) return `npub…${peerID.slice(-6)}`;
  if (contactName !== undefined && contactName.length > 0) return contactName;
  if (announced !== undefined && announced.length > 0) return announced;
  return peerIDToUsername(peerID);
}
