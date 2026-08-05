// NIP-61 Nutzaps: Cashu ecash sent over Nostr, for when the internet is up.
//
// A nutzap is not a request to pay; it *is* the payment. The sender mints
// proofs locked to the recipient's public key (NUT-11 P2PK) and publishes them
// in a public event. Anyone can read the event, but only the holder of the
// matching private key can swap the proofs, so the relay never holds
// spendable value and the recipient does not need to be online to be paid.
//
// Two event kinds, both defined by NIP-61:
//
//   kind 10019  "here is how to pay me", replaceable, published by the receiver
//               tags: ["relay", <url>]           where to send nutzaps
//                     ["mint", <url>, <unit>…]   which mints they will accept
//                     ["pubkey", <33-byte hex>]  the P2PK key to lock to
//
//   kind 9321   the nutzap itself, published by the sender
//               content: optional comment
//               tags: ["proof", <proof JSON>]    one tag per locked proof
//                     ["u", <mint url>]          which mint issued them
//                     ["p", <recipient pubkey>]  who they are for
//                     ["e", <event id>, <relay>] optional, what is being zapped
//
// Two rules are easy to get wrong and both lose money:
//   - The mint the proofs come from MUST be one the recipient listed in their
//     kind 10019. Proofs from an untrusted mint are worthless to them.
//   - The `pubkey` tag is a 33-byte compressed secp256k1 key, NOT the Nostr
//     pubkey. Nostr keys are 32-byte x-only. Locking to the wrong form makes
//     the proofs unspendable by everyone, including the sender.
//
// References:
//   NIP-61 https://github.com/nostr-protocol/nips/blob/master/61.md
//   NIP-60 https://github.com/nostr-protocol/nips/blob/master/60.md
//   PROTOCOLS.md section 8 for the kind numbers Airhop uses.

import type { Proof, ProofLike } from "@cashu/cashu-ts";
import { finalizeEvent, type Event } from "nostr-tools";
import type { NostrClient } from "../nostr/nostr-client";

// Event kinds per PROTOCOLS.md section 8.
export const KIND_NUTZAP = 9321;
export const KIND_NUTZAP_INFO = 10019;

// Guard rails on relay-supplied content. A nutzap event is public and
// unauthenticated apart from its signature, so every field is treated as
// hostile until it has been parsed.
const MAX_PROOFS_PER_NUTZAP = 64;
const MAX_PROOF_TAG_LENGTH = 4096;
const MAX_COMMENT_LENGTH = 280;
const MAX_MINTS = 16;
const MAX_RELAYS = 16;

// How far back to look for nutzaps we might have missed while offline.
const LOOKBACK_S = 60 * 60 * 24 * 30;

// ---- Types ------------------------------------------------------------------

export interface NutzapInfo {
  // Nostr pubkey of the person being paid (hex, x-only).
  pubkey: string;
  // Mints they will accept proofs from, normalised, in their stated order of
  // preference.
  mintUrls: string[];
  // 33-byte compressed secp256k1 key to lock proofs to (hex).
  p2pkPubkey: string;
  // Relays they watch for nutzaps.
  relays: string[];
}

export interface ReceivedNutzap {
  eventId: string;
  senderPubkey: string;
  createdAt: number;
  mintUrl: string;
  unit: string;
  proofs: ProofLike[];
  amount: number;
  comment?: string;
  // The event this nutzap was attached to, when the sender tagged one.
  targetEventId?: string;
}

// ---- Publish our own nutzap info (kind 10019) -------------------------------

// Announce where and how we can be paid. Without this event nobody can nutzap
// us at all: a sender has no way to know which mints we trust or which key to
// lock proofs to, and NIP-61 explicitly says not to guess.
//
// This is a replaceable event, so publishing again simply supersedes the last
// one. The P2PK key must stay stable across republishes or proofs locked
// against an older announcement become unspendable.
export async function publishNutzapInfo(params: {
  mintUrls: string[];
  p2pkPubkey: string;
  relays: string[];
  privKey: Uint8Array;
  client: NostrClient;
}): Promise<Event> {
  const mints = params.mintUrls.slice(0, MAX_MINTS);
  if (mints.length === 0) {
    throw new Error("nutzap info needs at least one mint");
  }
  if (!/^0[23][0-9a-f]{64}$/i.test(params.p2pkPubkey)) {
    // A 32-byte x-only Nostr key here is the classic NIP-61 mistake: the mint
    // would accept the lock and nobody could ever unlock it.
    throw new Error(
      "p2pk pubkey must be a 33-byte compressed secp256k1 key (02/03 prefix)",
    );
  }

  const event = finalizeEvent(
    {
      kind: KIND_NUTZAP_INFO,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ...params.relays.slice(0, MAX_RELAYS).map((url) => ["relay", url]),
        // The trailing entries are the units we accept from that mint. "sat"
        // is the only unit Airhop holds today; listing it explicitly saves a
        // sender from guessing.
        ...mints.map((url) => ["mint", url, "sat"]),
        ["pubkey", params.p2pkPubkey.toLowerCase()],
      ],
      content: "",
    },
    params.privKey,
  );

  await params.client.publish(event);
  return event;
}

// ---- Fetch a recipient's nutzap info ----------------------------------------

// Look up how to pay someone. Returns null when they have never published a
// kind 10019, which is the normal case for most Nostr users and the signal to
// fall back to an unlocked token in a DM.
export async function fetchNutzapInfo(
  recipientPubkey: string,
  client: NostrClient,
): Promise<NutzapInfo | null> {
  const events = await client.queryEvents({
    kinds: [KIND_NUTZAP_INFO],
    authors: [recipientPubkey],
    limit: 1,
  });
  const event = events[0];
  if (!event) return null;
  return parseNutzapInfo(event);
}

export function parseNutzapInfo(event: Event): NutzapInfo | null {
  if (event.kind !== KIND_NUTZAP_INFO) return null;

  const mintUrls: string[] = [];
  const relays: string[] = [];
  let p2pkPubkey: string | undefined;

  for (const tag of event.tags) {
    const [name, value] = tag;
    if (typeof value !== "string" || value.length === 0) continue;
    if (name === "mint" && mintUrls.length < MAX_MINTS) {
      if (isHttpUrl(value)) mintUrls.push(value);
    } else if (name === "relay" && relays.length < MAX_RELAYS) {
      if (/^wss?:\/\//i.test(value)) relays.push(value);
    } else if (name === "pubkey" && p2pkPubkey === undefined) {
      if (/^0[23][0-9a-f]{64}$/i.test(value)) p2pkPubkey = value.toLowerCase();
    }
  }

  // Both are load-bearing. Without a mint we do not know what they will accept;
  // without a valid P2PK key we cannot lock proofs to them. Falling back to
  // `event.pubkey` as the lock key (as the previous implementation did) locks
  // proofs to a 32-byte x-only Nostr key, which no mint can unlock.
  if (mintUrls.length === 0 || p2pkPubkey === undefined) return null;

  return { pubkey: event.pubkey, mintUrls, p2pkPubkey, relays };
}

// ---- Publish a nutzap (kind 9321) -------------------------------------------

// Send P2PK-locked proofs to a recipient.
//
// `proofs` must already be locked to the recipient's `p2pkPubkey` (see
// `lockProofsForNutzap` in wallet-service) and must come from a mint in their
// kind 10019 list. Publishing unlocked proofs here would put spendable bearer
// tokens on a public relay for anyone to grab.
export async function publishNutzap(params: {
  proofs: Proof[];
  mintUrl: string;
  recipientPubkey: string;
  senderPrivKey: Uint8Array;
  client: NostrClient;
  comment?: string;
  targetEventId?: string;
  // The relays THEY listed in their kind 10019. NIP-61 is explicit that a
  // nutzap goes to the recipient's relays, and it matters: the recipient
  // subscribes to their own set, so publishing to ours instead puts the payment
  // somewhere they never look. That is invisible between two Airhop users, who
  // share a default pool, and completely broken against any other NIP-61 wallet.
  // Empty falls back to our own pool, for a kind 10019 with no relay tags.
  relays?: string[];
}): Promise<Event> {
  if (params.proofs.length === 0) throw new Error("nutzap needs proofs");
  if (params.proofs.length > MAX_PROOFS_PER_NUTZAP) {
    throw new Error("too many proofs for one nutzap");
  }

  const event = finalizeEvent(
    {
      kind: KIND_NUTZAP,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        // One tag per proof, each holding the serialised proof object. This is
        // the NIP-61 wire format; putting the whole array in `content` (as the
        // previous implementation did) produces an event no other Nostr wallet
        // can read.
        ...params.proofs.map((proof) => [
          "proof",
          JSON.stringify({
            id: proof.id,
            amount: proof.amount.toNumber(),
            secret: proof.secret,
            C: proof.C,
            ...(proof.witness !== undefined ? { witness: proof.witness } : {}),
          }),
        ]),
        // "u" is the mint URL. The old code emitted a second "u" tag holding
        // the unit, which readers parse as a second mint.
        ["u", params.mintUrl],
        ["p", params.recipientPubkey],
        ...(params.targetEventId ? [["e", params.targetEventId]] : []),
      ],
      content: (params.comment ?? "").slice(0, MAX_COMMENT_LENGTH),
    },
    params.senderPrivKey,
  );

  await params.client.publish(event, params.relays);
  return event;
}

// ---- Subscribe to incoming nutzaps ------------------------------------------

// Watch for nutzaps addressed to us. The callback fires once per event; the
// caller is responsible for redeeming and for ignoring events it has already
// redeemed (wallet-store tracks those ids, since a relay can and will replay).
export function subscribeNutzaps(
  myPubkey: string,
  client: NostrClient,
  onNutzap: (zap: ReceivedNutzap) => void,
): () => void {
  const closer = client.subscribe(
    [
      {
        kinds: [KIND_NUTZAP],
        "#p": [myPubkey],
        since: Math.floor(Date.now() / 1000) - LOOKBACK_S,
      },
    ],
    (event: Event) => {
      const parsed = parseNutzap(event);
      if (parsed) onNutzap(parsed);
    },
  );
  return () => closer.close();
}

// ---- Parsing ----------------------------------------------------------------

export function parseNutzap(event: Event): ReceivedNutzap | null {
  if (event.kind !== KIND_NUTZAP) return null;

  const proofs: ProofLike[] = [];
  let mintUrl: string | undefined;
  let targetEventId: string | undefined;

  for (const tag of event.tags) {
    const [name, value] = tag;
    if (typeof value !== "string") continue;
    if (name === "proof") {
      if (proofs.length >= MAX_PROOFS_PER_NUTZAP) continue;
      if (value.length > MAX_PROOF_TAG_LENGTH) continue;
      const proof = parseProofTag(value);
      if (proof) proofs.push(proof);
    } else if (name === "u" && mintUrl === undefined) {
      if (isHttpUrl(value)) mintUrl = value;
    } else if (name === "e" && targetEventId === undefined) {
      if (/^[0-9a-f]{64}$/i.test(value)) targetEventId = value.toLowerCase();
    }
  }

  // No mint means we cannot redeem, and no proofs means there is nothing to
  // redeem. Either way there is nothing to show the user.
  if (proofs.length === 0 || mintUrl === undefined) return null;

  const amount = proofs.reduce((total, p) => total + Number(p.amount), 0);
  if (!Number.isSafeInteger(amount) || amount <= 0) return null;

  const comment = event.content.trim().slice(0, MAX_COMMENT_LENGTH);

  return {
    eventId: event.id,
    senderPubkey: event.pubkey,
    createdAt: event.created_at,
    mintUrl,
    // NIP-61 carries no unit tag; sat is the NUT-00 default and the only unit
    // Airhop's nutzap info advertises.
    unit: "sat",
    proofs,
    amount,
    ...(comment.length > 0 ? { comment } : {}),
    ...(targetEventId !== undefined ? { targetEventId } : {}),
  };
}

// One `["proof", "<json>"]` tag. Rejects anything that is not a structurally
// complete proof: a half-parsed proof would be shown as incoming money and then
// fail at the mint.
function parseProofTag(raw: string): ProofLike | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const p = parsed as Record<string, unknown>;

  const amount = typeof p.amount === "number" ? p.amount : Number(p.amount);
  if (
    typeof p.id !== "string" ||
    typeof p.secret !== "string" ||
    typeof p.C !== "string" ||
    !Number.isSafeInteger(amount) ||
    amount <= 0
  ) {
    return null;
  }
  if (!/^[0-9a-f]{2,66}$/i.test(p.id)) return null;
  if (!/^0[23][0-9a-f]{64}$/i.test(p.C)) return null;

  return {
    id: p.id,
    amount,
    secret: p.secret,
    C: p.C,
    ...(p.witness !== undefined
      ? { witness: p.witness as ProofLike["witness"] }
      : {}),
    ...(p.dleq !== undefined ? { dleq: p.dleq as ProofLike["dleq"] } : {}),
  } as ProofLike;
}

function isHttpUrl(value: string): boolean {
  if (value.length > 512) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
