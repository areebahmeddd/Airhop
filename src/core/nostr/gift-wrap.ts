// NIP-17/59 gift-wrap implementation for private Nostr DMs.
//
// Message flow (send):
//   1. Build a rumor (kind 14, unsigned) containing the plaintext.
//   2. Seal the rumor: encrypt with NIP-44 to the recipient; sign the
//      seal with the SENDER's real key (required by NIP-17 so recipients
//      can authenticate who sent the message).
//   3. Gift-wrap the seal: encrypt with NIP-44 using a fresh throwaway key;
//      sign the gift wrap with that throwaway key. This hides the sender
//      identity from relay operators.
//
// Message flow (receive):
//   1. Unwrap the gift wrap (decrypt with recipient private key).
//   2. Verify the seal's signature (rejects forged DMs).
//   3. Open the seal (decrypt rumor with recipient key).
//   4. Verify that the seal signer matches the rumor's claimed sender.
//
// Security notes:
//   - Relay operators see: kind 1059, recipient pubkey, and a random
//     timestamp ±2 days (per NIP-59). They cannot read the content or
//     the sender identity.
//   - The seal (kind 13) is signed by the REAL sender key, providing
//     deniability only at the gift-wrap layer while still authenticating
//     the sender to the recipient.

import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import {
  finalizeEvent,
  generateSecretKey,
  getPublicKey,
  verifyEvent,
  type Event,
  type UnsignedEvent,
} from "nostr-tools";
import * as nip44 from "nostr-tools/nip44";

// Event kinds per PROTOCOLS.md section 8.
const KIND_DM_RUMOR = 14;
const KIND_SEAL = 13;
const KIND_GIFT_WRAP = 1059;

// NIP-59: randomize the gift-wrap timestamp ±2 days to prevent timing analysis.
const TIMESTAMP_JITTER_SECONDS = 2 * 24 * 60 * 60;

// ---- Types ------------------------------------------------------------------

export interface DecryptedDm {
  content: string;
  senderPubkey: string;
  // Actual send time from the rumor (not the randomized gift-wrap time).
  timestamp: number;
}

export interface GiftWrapResult {
  event: Event;
  // The ephemeral pubkey used as the gift-wrap sender (for diagnostics).
  wrapperPubkey: string;
}

// ---- Send -------------------------------------------------------------------

// Wrap a plaintext DM from senderPrivKey to recipientPubkey (hex).
// Returns the kind 1059 gift wrap event ready to publish to relays.
export function wrapDm(
  content: string,
  senderPrivKey: Uint8Array,
  recipientPubkeyHex: string,
): GiftWrapResult {
  const senderPubkey = getPublicKey(senderPrivKey);

  // Step 1: Rumor (kind 14, unsigned - per NIP-17 a rumor is never signed)
  const rumor: UnsignedEvent = {
    kind: KIND_DM_RUMOR,
    pubkey: senderPubkey,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["p", recipientPubkeyHex]],
    content,
  };
  const rumorJson = JSON.stringify(rumor);

  // Step 2: Seal (kind 13) - encrypt rumor to recipient, sign with sender key
  const senderConvKey = nip44.getConversationKey(
    senderPrivKey,
    recipientPubkeyHex,
  );
  const sealContent = nip44.encrypt(rumorJson, senderConvKey);

  const sealEvent = finalizeEvent(
    {
      kind: KIND_SEAL,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: sealContent,
    },
    senderPrivKey,
  );

  // Step 3: Gift wrap (kind 1059) - encrypt seal with throwaway ephemeral key
  const ephemeralPrivKey = generateSecretKey();
  const ephemeralPubkey = getPublicKey(ephemeralPrivKey);

  const wrapConvKey = nip44.getConversationKey(
    ephemeralPrivKey,
    recipientPubkeyHex,
  );
  const wrapContent = nip44.encrypt(JSON.stringify(sealEvent), wrapConvKey);

  // Randomize gift-wrap timestamp per NIP-59 to obscure when messages are sent.
  const jitter = Math.floor((Math.random() * 2 - 1) * TIMESTAMP_JITTER_SECONDS);
  const wrapTimestamp = Math.floor(Date.now() / 1000) + jitter;

  const giftWrap = finalizeEvent(
    {
      kind: KIND_GIFT_WRAP,
      created_at: wrapTimestamp,
      tags: [["p", recipientPubkeyHex]],
      content: wrapContent,
    },
    ephemeralPrivKey,
  );

  return { event: giftWrap, wrapperPubkey: ephemeralPubkey };
}

// ---- Receive ----------------------------------------------------------------

// Decrypt and authenticate a received kind 1059 gift wrap.
// Throws on any authentication or decryption failure so callers can drop the
// event without inspecting error details.
export function unwrapDm(
  giftWrap: Event,
  recipientPrivKey: Uint8Array,
): DecryptedDm {
  if (giftWrap.kind !== KIND_GIFT_WRAP) {
    throw new Error("Not a gift wrap event");
  }

  // Step 1: Unwrap the gift wrap using the recipient key and the ephemeral
  // sender pubkey embedded in the gift wrap's `pubkey` field.
  const wrapConvKey = nip44.getConversationKey(
    recipientPrivKey,
    giftWrap.pubkey,
  );
  const sealJson = nip44.decrypt(giftWrap.content, wrapConvKey);
  const seal: Event = JSON.parse(sealJson) as Event;

  // Step 2: Verify the seal's signature. Per NIP-17 the seal is signed by the
  // real sender key; without this check DMs are forgeable by anyone who knows
  // the recipient's pubkey.
  if (!verifyEvent(seal)) {
    throw new Error("Seal signature invalid");
  }
  if (seal.kind !== KIND_SEAL) {
    throw new Error("Inner event is not a seal");
  }

  // Step 3: Decrypt the seal to reveal the rumor.
  const recipientPubkey = getPublicKey(recipientPrivKey);
  const sealConvKey = nip44.getConversationKey(recipientPrivKey, seal.pubkey);
  const rumorJson = nip44.decrypt(seal.content, sealConvKey);
  const rumor = JSON.parse(rumorJson) as UnsignedEvent;

  // Step 4: Ensure the seal's signer is who the rumor claims to be.
  if (seal.pubkey !== rumor.pubkey) {
    throw new Error("Rumor pubkey does not match seal signer");
  }

  // Verify the recipient tag matches us (reject misdirected wraps).
  const recipientTag = rumor.tags.find(([t]) => t === "p");
  if (recipientTag && recipientTag[1] !== recipientPubkey) {
    throw new Error("Gift wrap not addressed to us");
  }

  return {
    content: rumor.content,
    senderPubkey: seal.pubkey,
    timestamp: rumor.created_at,
  };
}

// ---- Helpers ----------------------------------------------------------------

// Derive a secp256k1 private key from an Ed25519 signing key via HKDF-SHA256.
// This gives each identity a deterministic Nostr key without a second key pair.
// Used when the caller does not manage separate Nostr keys.
export function deriveNostrPrivKey(ed25519PrivKey: Uint8Array): Uint8Array {
  const info = new TextEncoder().encode("airhop-nostr-key-v1");
  return hkdf(sha256, ed25519PrivKey, undefined, info, 32);
}

// Encode a Uint8Array private key to hex for nostr-tools APIs.
export function privKeyToHex(privKey: Uint8Array): string {
  return bytesToHex(privKey);
}

// Decode a hex private key from storage.
export function hexToPrivKey(hex: string): Uint8Array {
  return hexToBytes(hex);
}
