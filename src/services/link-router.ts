// What an Airhop link does once it has been parsed.
//
// There are two ways one arrives: the OS hands it to us because the user tapped
// it somewhere else (App.tsx), or the user pastes it into the Join sheet. Both
// are the same act of consent and must have the same effect, so the effect
// lives here rather than in either caller. Everything is a pure consequence of
// the link plus the stores; the caller only decides where to navigate.
//
// Parsing stays in utils/deep-link (pure, no crypto). This module owns the side
// effects, which is why it lives with the services.

import { decodeQRContent } from "@core/crypto/contact-exchange";
import { isValidChannelKey } from "@core/mesh/channel-crypto";
import { bytesToHex } from "@noble/hashes/utils.js";
import { useChatStore } from "@store/chat-store";
import { useContactsStore } from "@store/contacts-store";
import type { DeepLink } from "@utils/deep-link";
import { getMeshService } from "./mesh-service";

// Apply a link and return the conversation to open, or null when the link
// carried something we could not accept (a forged contact card). The caller
// navigates; nothing here touches navigation state.
export function applyAirhopLink(link: DeepLink): string | null {
  if (link.kind === "channel") {
    // A private channel invite carries its E2E key; a public one does not.
    // joinPrivateChannel answers with the room it actually landed in, which
    // differs from the name asked for when that name is already taken by a
    // different key.
    if (link.key !== undefined && isValidChannelKey(link.key)) {
      return useChatStore
        .getState()
        .joinPrivateChannel(link.channel, link.key, link.overNostr);
    }
    useChatStore.getState().addChannel(link.channel);
    return link.channel;
  }

  if (link.kind === "peer") {
    const channel = `dm:${link.peerID}`;
    useChatStore.getState().addChannel(channel);
    return channel;
  }

  // A contact card: verify and import the keys, then open the DM.
  const card = decodeQRContent(link.card);
  if (card === null) return null;
  // Reject a card whose peer ID isn't the fingerprint of its Noise key;
  // accepting it would encrypt every DM to whoever forged the card. Seeds the
  // routing registry and inbound Nostr map as a side effect.
  //
  // Deliberately NOT in person. Both routes into this function are links - the
  // OS handing one over, or the user pasting one - and neither says anything
  // about who produced it. So the card may not re-pin keys already bound to
  // that peer (see addVerifiedContact), and the contact it writes is not
  // verified.
  const accepted = getMeshService()?.addVerifiedContact(card) ?? false;
  if (!accepted) return null;
  useContactsStore.getState().addContact({
    peerID: card.peerID,
    noisePubKeyHex: bytesToHex(card.noisePubKey),
    signingPubKeyHex: bytesToHex(card.signingPubKey),
    nickname: card.nickname,
    addedAtMs: Date.now(),
    // "link", not "qr". The card is self-consistent, but a link proves only
    // that someone put it somewhere the user tapped: a web page, an SMS, a
    // message in another app. Recording it as a scan would have shown the
    // verified shield and "Scanned their QR code" for a person the user has
    // never met, under a nickname the sender chose. Verification is an
    // in-person act, and this is the one path that cannot witness it.
    source: "link",
    // The card carries the peer's Nostr pubkey (internet reachability). An
    // `airhop:v1/` link always has one; the guard is for the type, not the
    // format.
    ...(card.nostrPubKey !== undefined
      ? { nostrPubkeyHex: bytesToHex(card.nostrPubKey) }
      : {}),
  });
  const channel = `dm:${card.peerID}`;
  useChatStore.getState().addChannel(channel);
  return channel;
}
