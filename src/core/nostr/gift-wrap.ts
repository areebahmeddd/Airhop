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
import {
  bitchatNip44Decrypt,
  bitchatNip44Encrypt,
} from "./bitchat-nostr-crypto";

// Event kinds per PROTOCOLS.md section 8.
const KIND_DM_RUMOR = 14;
const KIND_SEAL = 13;
const KIND_GIFT_WRAP = 1059;

// bitchat randomizes seal + gift-wrap timestamps by ±15 minutes (NostrProtocol
// randomizedTimestamp). Matching this keeps our events indistinguishable from
// theirs to a relay.
const TIMESTAMP_JITTER_SECONDS = 15 * 60;

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
  const recipientXOnly = hexToBytes(recipientPubkeyHex);

  // Step 1: Rumor (kind 14, unsigned - per NIP-17 a rumor is never signed).
  // Empty tags, matching bitchat (the recipient is targeted by the gift wrap's
  // `p` tag, not the rumor).
  const rumor: UnsignedEvent = {
    kind: KIND_DM_RUMOR,
    pubkey: senderPubkey,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content,
  };
  const rumorJson = JSON.stringify(rumor);

  // Step 2: Seal (kind 13) - encrypt the rumor to the recipient with bitchat's
  // nip44-v2 flavor, sign with the sender's real key so the recipient can
  // authenticate who sent it.
  const sealEvent = finalizeEvent(
    {
      kind: KIND_SEAL,
      created_at: randomizedTimestamp(),
      tags: [],
      content: bitchatNip44Encrypt(rumorJson, recipientXOnly, senderPrivKey),
    },
    senderPrivKey,
  );

  // Step 3: Gift wrap (kind 1059) - encrypt the seal with a throwaway ephemeral
  // key so relays cannot see the sender.
  const ephemeralPrivKey = generateSecretKey();
  const ephemeralPubkey = getPublicKey(ephemeralPrivKey);

  const giftWrap = finalizeEvent(
    {
      kind: KIND_GIFT_WRAP,
      created_at: randomizedTimestamp(),
      tags: [["p", recipientPubkeyHex]],
      content: bitchatNip44Encrypt(
        JSON.stringify(sealEvent),
        recipientXOnly,
        ephemeralPrivKey,
      ),
    },
    ephemeralPrivKey,
  );

  return { event: giftWrap, wrapperPubkey: ephemeralPubkey };
}

// bitchat randomizes the seal and gift-wrap timestamps by ±15 minutes to blur
// send timing without moving them so far that relays reject them.
function randomizedTimestamp(): number {
  const jitter = Math.floor((Math.random() * 2 - 1) * TIMESTAMP_JITTER_SECONDS);
  return Math.floor(Date.now() / 1000) + jitter;
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

  // Step 1: Unwrap the gift wrap with the recipient key and the ephemeral sender
  // pubkey embedded in the gift wrap's `pubkey` field (bitchat nip44-v2).
  const sealJson = bitchatNip44Decrypt(
    giftWrap.content,
    hexToBytes(giftWrap.pubkey),
    recipientPrivKey,
  );
  if (sealJson === null) throw new Error("Gift wrap decrypt failed");
  const seal: Event = JSON.parse(sealJson) as Event;

  // Step 2: Verify the seal's signature. Per NIP-17 the seal is signed by the
  // real sender key; without this check DMs are forgeable by anyone who knows
  // the recipient's pubkey. bitchat's seal is BIP-340 Schnorr, which nostr-tools
  // verifyEvent checks.
  if (!verifyEvent(seal)) {
    throw new Error("Seal signature invalid");
  }
  if (seal.kind !== KIND_SEAL) {
    throw new Error("Inner event is not a seal");
  }

  // Step 3: Decrypt the seal to reveal the rumor.
  const rumorJson = bitchatNip44Decrypt(
    seal.content,
    hexToBytes(seal.pubkey),
    recipientPrivKey,
  );
  if (rumorJson === null) throw new Error("Seal decrypt failed");
  const rumor = JSON.parse(rumorJson) as UnsignedEvent;

  // Step 4: Ensure the seal's signer is who the rumor claims to be.
  if (seal.pubkey !== rumor.pubkey) {
    throw new Error("Rumor pubkey does not match seal signer");
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
