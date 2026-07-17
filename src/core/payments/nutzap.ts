// NIP-61 Nutzap: online Cashu payments over Nostr.
//
// Flow (send):
//   1. Fetch recipient's kind 10019 event to learn their mint preferences
//      and P2PK locking pubkey.
//   2. Create a P2PK-locked Cashu token at the recipient's preferred mint.
//   3. Publish a kind 9321 event embedding the locked proofs.
//
// Flow (receive):
//   1. Subscribe to kind 9321 events tagged to our pubkey.
//   2. Decode the embedded proofs from the event.
//   3. Hand proofs to the Cashu wallet for redemption (internet required).
//
// References:
//   NIP-61: https://github.com/nostr-protocol/nips/blob/master/61.md
//   NIP-60: https://github.com/nostr-protocol/nips/blob/master/60.md
//   PROTOCOLS.md section 8 for kind numbers.

import type { Proof } from "@cashu/cashu-ts";
import { finalizeEvent, type Event } from "nostr-tools";
import type { NostrClient } from "../nostr/client";

// Event kinds per PROTOCOLS.md section 8.
const KIND_NUTZAP = 9321;
const KIND_WALLET_INFO = 10019;

// ---- Types ------------------------------------------------------------------

export interface WalletInfo {
  pubkey: string; // recipient Nostr pubkey (hex)
  mintUrls: string[]; // mints the recipient trusts
  p2pkPubkey: string; // secp256k1 pubkey for P2PK locking (hex, 33-byte compressed)
  relays: string[]; // relays where the recipient receives nutzaps
}

export interface NutzapContent {
  proofs: Proof[]; // P2PK-locked Cashu proofs
  mint: string; // which mint the proofs are from
  unit: string; // token unit (typically "sat")
  comment?: string; // optional visible comment
}

export interface ReceivedNutzap {
  eventId: string;
  senderPubkey: string;
  timestamp: number;
  content: NutzapContent;
}

// ---- Fetch recipient wallet info (kind 10019) --------------------------------

// Fetch the recipient's NIP-61 wallet info. Returns null if not found or
// malformed (caller should fall back to offline Cashu token transfer).
export async function fetchWalletInfo(
  recipientPubkey: string,
  client: NostrClient,
): Promise<WalletInfo | null> {
  const events = await client.queryEvents({
    kinds: [KIND_WALLET_INFO],
    authors: [recipientPubkey],
    limit: 1,
  });

  const event = events[0];
  if (!event) return null;

  return parseWalletInfoEvent(event);
}

// ---- Publish nutzap (kind 9321) ---------------------------------------------

// Publish a kind 9321 nutzap event targeting recipientPubkey.
// The proofs must already be P2PK-locked to walletInfo.p2pkPubkey.
// Use a Cashu wallet library to create locked proofs before calling this.
export async function publishNutzap(
  proofs: Proof[],
  mintUrl: string,
  unit: string,
  recipientPubkey: string,
  senderPrivKey: Uint8Array,
  client: NostrClient,
  comment?: string,
): Promise<Event> {
  const nutzapContent: NutzapContent = {
    proofs,
    mint: mintUrl,
    unit,
    comment,
  };

  const event = finalizeEvent(
    {
      kind: KIND_NUTZAP,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["p", recipientPubkey],
        ["u", mintUrl],
        ["u", unit],
      ],
      content: JSON.stringify(nutzapContent),
    },
    senderPrivKey,
  );

  await client.publish(event);
  return event;
}

// ---- Subscribe to incoming nutzaps ------------------------------------------

// Subscribe to nutzaps addressed to our pubkey. Returns a closer function.
// The callback receives each new nutzap ready for redemption.
export function subscribeNutzaps(
  myPubkey: string,
  client: NostrClient,
  onNutzap: (zap: ReceivedNutzap) => void,
): () => void {
  const filter = {
    kinds: [KIND_NUTZAP],
    "#p": [myPubkey],
    since: Math.floor(Date.now() / 1000) - 86400 * 7, // last 7 days
  };

  const closer = client.subscribe([filter], (event: Event) => {
    const parsed = parseNutzapEvent(event);
    if (parsed) onNutzap(parsed);
  });

  return () => closer.close();
}

// ---- Parse helpers ----------------------------------------------------------

function parseWalletInfoEvent(event: Event): WalletInfo | null {
  if (event.kind !== KIND_WALLET_INFO) return null;

  const mintUrls = event.tags
    .filter(([t]) => t === "mint")
    .map(([, url]) => url)
    .filter(Boolean);

  const relays = event.tags
    .filter(([t]) => t === "relay")
    .map(([, url]) => url)
    .filter(Boolean);

  // p2pk pubkey: kind 10019 includes a "pubkey" tag with the P2PK lock key
  const p2pkTag = event.tags.find(([t]) => t === "pubkey");
  const p2pkPubkey = p2pkTag?.[1] ?? event.pubkey;

  if (mintUrls.length === 0) return null;

  return {
    pubkey: event.pubkey,
    mintUrls,
    p2pkPubkey,
    relays,
  };
}

function parseNutzapEvent(event: Event): ReceivedNutzap | null {
  if (event.kind !== KIND_NUTZAP) return null;

  let content: NutzapContent;
  try {
    content = JSON.parse(event.content) as NutzapContent;
  } catch {
    return null;
  }

  if (!Array.isArray(content.proofs) || content.proofs.length === 0)
    return null;
  if (!content.mint) return null;

  return {
    eventId: event.id,
    senderPubkey: event.pubkey,
    timestamp: event.created_at,
    content: {
      proofs: content.proofs,
      mint: content.mint,
      unit: content.unit ?? "sat",
      comment: content.comment,
    },
  };
}
