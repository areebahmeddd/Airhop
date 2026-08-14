// Nostr bridge for courier store-and-forward (kind 1401).
//
// When BLE mesh delivery is not possible, sealed courier envelopes can be
// parked on Nostr relays under a rotating daily recipient tag. The recipient
// polls for matching events when they come online. This mirrors bitchat iOS
// NostrProtocol.EventKind.courierDrop.
//
// Event format (kind 1401):
//   kind:    1401
//   tags:    [["x", recipientTagHex], ["expiration", unixSecString]]
//   content: base64(ciphertext)  - the Noise X ciphertext from courier-store
//
// The "x" tag is a 16-byte HMAC-derived daily tag (see courier-store.ts
// recipientTag()). Relays supporting NIP-40 will auto-expire the event at
// the expiration timestamp.

import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { finalizeEvent, type Event } from "nostr-tools";
import { base64ToBytes, bytesToBase64 } from "../encoding/base64";
import {
  encodeEnvelopePayload,
  type SealedEnvelope,
} from "../mesh/courier/courier-store";
import type { NostrClient } from "./nostr-client";

// Event kind per PROTOCOLS.md section 8 / bitchat NostrProtocol.swift.
const KIND_COURIER_DROP = 1401;

// Subscription limit: fetch at most this many pending drops per poll.
const MAX_FETCH_PER_POLL = 20;

// Publish a sealed courier envelope to Nostr as a kind 1401 event.
// The envelope's expiryMs is used as the NIP-40 expiration tag.
export async function publishCourierDrop(
  envelope: SealedEnvelope,
  nostrPrivKey: Uint8Array,
  client: NostrClient,
): Promise<void> {
  const tagHex = bytesToHex(envelope.recipientTag);
  const expiryUnixSec = Math.floor(envelope.expiryMs / 1000).toString();

  // Encode the full envelope payload (TLV) to base64 for the event content.
  const payload = encodeEnvelopePayload(envelope);
  const content = bytesToBase64(payload);

  const event = finalizeEvent(
    {
      kind: KIND_COURIER_DROP,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["x", tagHex],
        ["expiration", expiryUnixSec],
      ],
      content,
    },
    nostrPrivKey,
  );

  await client.publish(event);
}

// Subscribe to incoming courier drops addressed to the given recipient tags.
// Returns a closer function. The callback receives raw SealedEnvelope objects
// ready for CourierStore.open().
export function subscribeCourierDrops(
  recipientTags: Uint8Array[],
  client: NostrClient,
  onEnvelope: (envelope: SealedEnvelope) => void,
): () => void {
  if (recipientTags.length === 0) return () => {};

  const tagHexes = recipientTags.map(bytesToHex);
  const filter = {
    kinds: [KIND_COURIER_DROP],
    "#x": tagHexes,
    since: Math.floor(Date.now() / 1000) - 86400, // last 24h (envelope TTL)
    limit: MAX_FETCH_PER_POLL,
  };

  const closer = client.subscribe([filter], (event: Event) => {
    const parsed = parseCourierDropEvent(event);
    if (parsed) onEnvelope(parsed);
  });

  return () => closer.close();
}

// Fetch all pending courier drops for the given recipient tags and return them.
export async function fetchCourierDrops(
  recipientTags: Uint8Array[],
  client: NostrClient,
): Promise<SealedEnvelope[]> {
  if (recipientTags.length === 0) return [];

  const tagHexes = recipientTags.map(bytesToHex);
  const events = await client.queryEvents({
    kinds: [KIND_COURIER_DROP],
    "#x": tagHexes,
    since: Math.floor(Date.now() / 1000) - 86400,
    limit: MAX_FETCH_PER_POLL,
  });

  const envelopes: SealedEnvelope[] = [];
  for (const event of events) {
    const parsed = parseCourierDropEvent(event);
    if (parsed) envelopes.push(parsed);
  }
  return envelopes;
}

function parseCourierDropEvent(event: Event): SealedEnvelope | null {
  if (event.kind !== KIND_COURIER_DROP) return null;

  const xTag = event.tags.find(([t]) => t === "x");
  if (!xTag || !xTag[1]) return null;

  const expiryTag = event.tags.find(([t]) => t === "expiration");
  const expiryMs = expiryTag
    ? parseInt(expiryTag[1], 10) * 1000
    : Date.now() + 86400_000;

  if (isNaN(expiryMs) || expiryMs < Date.now()) return null; // already expired

  let ciphertext: Uint8Array;
  try {
    ciphertext = base64ToBytes(event.content);
  } catch {
    return null;
  }

  let recipientTag: Uint8Array;
  try {
    recipientTag = hexToBytes(xTag[1]);
  } catch {
    return null;
  }

  if (recipientTag.length !== 16) return null;
  if (ciphertext.length === 0) return null;

  return { recipientTag, expiryMs, copies: 1, ciphertext };
}
