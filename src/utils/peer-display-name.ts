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
//   1. Local nickname: a name the user typed for a contact they verified in
//      person. Theirs to choose, so it outranks anything the peer asserts.
//   2. Contact nickname: what the peer called themselves on the card that was
//      scanned.
//   3. Announced nickname: what the peer calls themselves over the mesh.
//   4. Generated username: deterministic from the peer ID; always available.
//
// The first two both come back from `nicknameFor`, which prefers the local one.
// `resolvePeerOwnName` below skips it, for the one place that has to show who
// the peer says they are rather than what the user has filed them under.
//
// A Nostr-only correspondent (`nostr_<pubkey>`) has no peer ID to derive from,
// so it gets a short npub-style label instead of a nonsense generated name.

import { geohashDisplayName } from "@core/nostr/geohash-identity";
import { useChatStore } from "@store/chat-store";
import { useContactsStore } from "@store/contacts-store";
import { usePeerStore } from "@store/peer-store";
import {
  isNostrId,
  NOSTR_ID_PREFIX,
  nostrShortLabel,
  peerIDToUsername,
} from "./username";

// A Nostr/geohash pseudonym (`nostr_<pubkey>`) is named the same way the cell
// chat names it (and the same way bitchat does): `anon#<last4>` of the pubkey,
// or `<nick>#<last4>`. Using the npub label here instead made the very same
// person you saw as "anon#ed17" in the channel show up as "npub…d4ed17" in the
// DM header, the DM list and the contact-info sheet. This keeps them identical
// across all of those. The stored message senderNickname uses this exact form.
function nostrPseudonym(peerID: string): string {
  const pubkey = peerID.slice(NOSTR_ID_PREFIX.length);
  // Their geohash nickname rides the `n` tag on channel messages and nothing
  // else - a geo DM carries none - so the pubkey alone can only ever produce
  // "anon#last4". Recorded when the conversation opened; see geoDmNames.
  const known = useChatStore.getState().geoDmNames[pubkey];
  if (known !== undefined && known.length > 0) return known;
  return geohashDisplayName(pubkey);
}

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
  const contactName = useContactsStore.getState().nicknameFor(peerID);
  const announced =
    announcedNickname !== undefined && announcedNickname.length > 0
      ? announcedNickname
      : undefined;
  const nick = contactName ?? announced;

  // A Nostr sender's public-key tail already identifies them uniquely, so no
  // fingerprint suffix when we fall back to it. A trusted or announced name
  // still wins, kept distinguishable with the same tail.
  if (isNostrId(peerID)) {
    return nick ? `${nick}#${peerID.slice(-4)}` : nostrShortLabel(peerID);
  }

  const base = nick ?? peerIDToUsername(peerID);
  return `${base}#${peerID.slice(-4)}`;
}

// Resolve outside React (services, stores, event handlers).
export function resolveDisplayName(peerID: string): string {
  if (isNostrId(peerID)) return nostrPseudonym(peerID);

  const contactName = useContactsStore.getState().nicknameFor(peerID);
  if (contactName !== undefined) return contactName;

  const announced = usePeerStore.getState().getPeer(peerID)?.nickname;
  if (announced !== undefined && announced.length > 0) return announced;

  return peerIDToUsername(peerID);
}

// The name the peer goes by, ignoring any local label the user has put on them.
//
// The same chain as above minus step 1, and it exists for one screen: the
// contact sheet shows this beside the name it displays, so renaming somebody
// never hides who they say they are. Everywhere else wants resolveDisplayName.
export function resolvePeerOwnName(peerID: string): string {
  if (isNostrId(peerID)) return nostrPseudonym(peerID);

  const own = useContactsStore.getState().ownNicknameFor(peerID);
  if (own !== undefined) return own;

  const announced = usePeerStore.getState().getPeer(peerID)?.nickname;
  if (announced !== undefined && announced.length > 0) return announced;

  return peerIDToUsername(peerID);
}
