---
description: >
  Reference for the NIP-59 gift-wrap implementation and the Nostr courier relay
  bridge. Read this before touching src/core/nostr/gift-wrap.ts or
  courier-relay.ts. The three-layer structure has specific key and verification
  requirements that are not obvious from the NIPs alone.
---

# Nostr Gift-Wrap and Courier Relay

Implementation: `src/core/nostr/gift-wrap.ts` and `courier-relay.ts`.

## Key Distinction: Nostr Keys vs BLE Keys

Airhop identity uses two separate key systems:

| Key          | Curve   | Used for                                    |
| ------------ | ------- | ------------------------------------------- |
| Noise static | X25519  | BLE session encryption (Noise XX)           |
| Signing key  | Ed25519 | Packet signing, also used as Nostr identity |

The Ed25519 signing key doubles as the Nostr key (`npub`). It is not the same as the X25519 Noise key.

Nostr tools (`nostr-tools`) require secp256k1 keys. Use `deriveNostrPrivKey(ed25519PrivKey)` to derive a deterministic secp256k1 key from the Ed25519 identity key via HKDF-SHA256. This avoids managing a third key pair.

```typescript
// src/core/nostr/gift-wrap.ts
export function deriveNostrPrivKey(ed25519PrivKey: Uint8Array): Uint8Array {
  const info = new TextEncoder().encode("airhop-nostr-key-v1");
  return hkdf(sha256, ed25519PrivKey, undefined, info, 32);
}
```

## NIP-59 Gift-Wrap: Three-Layer Structure

### Send flow

```
plaintext
  -> Rumor  (kind 14, unsigned)          built with sender's real pubkey
  -> Seal   (kind 13, signed by sender)  encrypts rumor with NIP-44 to recipient
  -> Gift wrap (kind 1059, ephemeral)    encrypts seal with NIP-44, throwaway key
```

### Layer 1: Rumor (kind 14)

An `UnsignedEvent`. Never signed — per NIP-17 a rumor must not have a signature.

```typescript
{
  kind: 14,
  pubkey: senderPubkey,      // sender's real secp256k1 pubkey
  created_at: now,
  tags: [["p", recipientPubkeyHex]],
  content: plaintextMessage,
}
```

### Layer 2: Seal (kind 13)

Signed by the **sender's real key**. This is intentional: it authenticates the sender to the recipient, while the outer gift wrap hides that identity from relay operators.

```typescript
const conversationKey = nip44.getConversationKey(
  senderPrivKey,
  recipientPubkeyHex,
);
content = nip44.encrypt(JSON.stringify(rumor), conversationKey);
// event is signed with senderPrivKey
```

### Layer 3: Gift Wrap (kind 1059)

Signed by a freshly generated throwaway key. The ephemeral key's pubkey becomes the gift wrap's `pubkey` field. Relay operators see the throwaway pubkey, not the real sender.

```typescript
const ephemeralPrivKey = generateSecretKey(); // new key every send
const wrapConvKey = nip44.getConversationKey(
  ephemeralPrivKey,
  recipientPubkeyHex,
);
content = nip44.encrypt(JSON.stringify(sealEvent), wrapConvKey);
// Timestamp is randomized +-2 days per NIP-59 to prevent timing analysis
```

### Receive flow

```
1. Decrypt gift wrap using recipient key + gift wrap pubkey field
2. Verify seal signature (rejects forged DMs)
3. Decrypt seal using recipient key + seal pubkey field
4. Verify seal.pubkey === rumor.pubkey (prevents identity substitution)
5. Verify recipient tag in rumor matches our pubkey
```

Step 2 is security-critical. Skipping it means anyone who knows the recipient's pubkey can forge DMs.

## Courier Relay (kind 1401)

When BLE delivery fails, sealed courier envelopes are parked on Nostr relays. The recipient polls when they come online.

### Event Format

```
kind:    1401
tags:    [["x", recipientTagHex], ["expiration", unixSecString]]
content: base64(encodeEnvelopePayload(envelope))
```

The `x` tag is a 16-byte HMAC-derived daily recipient tag (see `computeRecipientTag` in `courier-store.ts`). It rotates daily so relay operators cannot correlate deliveries over time.

NIP-40 compliant relays auto-expire the event at the `expiration` timestamp. Non-compliant relays keep it; the recipient ignores stale envelopes.

### Subscription Filter

Subscribers query by `#x` tag with their current and previous day's tags:

```typescript
{ kinds: [1401], "#x": [todayTagHex, ...], since: now - 86400, limit: 20 }
```

## Event Kind Summary

| Kind | Name         | Signed by          |
| ---- | ------------ | ------------------ |
| 14   | Rumor        | Nobody (unsigned)  |
| 13   | Seal         | Real sender key    |
| 1059 | Gift wrap    | Ephemeral key      |
| 1401 | Courier drop | Sender's Nostr key |

## What Not to Do

- Do not sign the rumor (kind 14). It must stay as `UnsignedEvent`.
- Do not reuse the ephemeral key across gift wraps. Generate a fresh one every time.
- Do not use the Ed25519 signing key directly with `nostr-tools`; derive the secp256k1 key first.
- Do not skip seal signature verification on receive (`verifyEvent(seal)`).
