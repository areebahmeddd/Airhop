---
description: >
  Reference for one-time prekey bundles (0x24) and the forward-secret courier
  envelopes that seal to them. Read before touching prekey-bundle.ts,
  prekey-store.ts, or courier-store.ts. Breaking forward secrecy here is silent:
  the message still delivers, it just stops being protected.
---

# One-time Prekeys and Courier Mail

> Read before touching `prekey-bundle.ts`, `prekey-store.ts`, `courier-store.ts`, or any offline-delivery path.
>
> Source of truth: `bitchat/ios/localPackages/BitFoundation/Sources/BitFoundation/PrekeyBundle.swift` and `CourierEnvelope.swift`.

## Why this exists

A courier envelope lets you message someone who is offline: you seal it and hand it to a peer who may physically meet them later. Sealed to the recipient's long-lived static key, every undelivered envelope is exposed the day that key leaks.

One-time prekeys fix this. Each device publishes a batch of single-use public keys. A sender seals to one of them; the recipient opens it and destroys that key. A later compromise of the static key does not open past mail. This is the whole point, and it fails **silently** if broken: the message still delivers, it just is not forward secret any more. Reviews must check it explicitly.

## Bundle wire format (`0x24`)

TLV, 2-byte big-endian lengths. Broadcast and gossiped.

| Tag    | Field                | Notes                                        |
| ------ | -------------------- | -------------------------------------------- |
| `0x01` | noiseStaticPublicKey | 32 bytes; identifies whose prekeys these are |
| `0x02` | prekeys              | N x (4-byte BE id + 32-byte pubkey), N <= 8  |
| `0x03` | generatedAt          | u64 BE ms; newer replaces older per key      |
| `0x04` | signature            | 64-byte Ed25519 over `signableBytes()`       |

Signature covers, in order: 1-byte-length-prefixed context `"bitchat-prekey-bundle-v1"`, the 32-byte noise key, a 1-byte prekey count, each (id BE, 32-byte key), then `generatedAt` BE. Encoders and verifiers must derive these identically. Duplicate prekey IDs are rejected at decode: one consumed ID must never shadow another.

## Rules

- Bundles are **public and unencrypted by design**. They carry only public halves. Do not "fix" this by sealing them; bitchat gossips them in the clear and sealing breaks interop.
- Verify every inbound bundle against the owner's **announce-bound Ed25519 signing key** before storing. The bundle itself carries only the noise key, so resolve the owner via `peerID = hex(SHA-256(noiseStaticPublicKey))[0:16]` and look up their signing key. No signing key means no verification, so ignore it (the flood layer still relays it for others).
- Private prekeys never leave the device.
- A prekey is **single use**. On opening an envelope, consume it and publish a fresh bundle so senders stop using the spent key.
- Consumed private keys are kept for a grace window (48h) so a second in-flight envelope sealed to the same key still opens, then dropped. Do not keep them forever; the grace window is the forward-secrecy boundary.

## Courier envelope: v1 vs v2

`CourierEnvelope` gains one optional TLV:

| Tag    | Field    | Meaning                                      |
| ------ | -------- | -------------------------------------------- |
| `0x05` | prekeyID | Present = v2, sealed to that one-time prekey |
|        | (absent) | v1, sealed to the recipient's static key     |

The tag is omitted for v1 so the bytes stay identical to the pre-prekey format. A v1-only decoder skips `0x05` as unknown, carries the envelope opaquely, and simply fails to open one addressed to it. That degradation is intentional.

**The routing tag always derives from the recipient's STATIC key**, in both v1 and v2. Delivery matching must not change when the seal target changes, or carriers stop recognising envelopes.

## Seal and open

Sealing to a prekey reuses the same one-way Noise X primitive with the prekey pair substituted for the static pair:

```typescript
// Sender: prefer a prekey when we hold a bundle for them.
const prekey = peerPrekeys.assign(recipientNoisePub) ?? undefined;
const ciphertext = noiseXSeal(
  senderStaticPriv,
  prekey?.publicKey ?? recipientNoisePub, // prekey when available
  plaintext,
);
// tag still from the STATIC key
recipientTag: computeRecipientTag(recipientNoisePub),
prekeyID: prekey?.id,
```

```typescript
// Recipient: pick the opening key from the envelope, then burn it.
const openKey =
  env.prekeyID !== undefined
    ? localPrekeys.privForId(env.prekeyID) // may be null if expired
    : identity.noiseStaticPrivKey;
if (openKey === null) return; // cannot open, drop
const { plaintext, senderStaticPubKey } = noiseXOpen(openKey, env.ciphertext);
if (env.prekeyID !== undefined) {
  localPrekeys.consume(env.prekeyID);
  emitPrekeyBundle(); // republish so senders stop using the spent key
}
```

The sender's identity is authenticated **inside** the ciphertext. Identify the sender from `senderStaticPubKey`, never from the packet header, which names whoever relayed it.

## Review checklist

- Bundle signed by the identity key, and verified on receipt: **required**
- Private prekey never serialised off-device: **required**
- Consumed prekey never reused to open a second envelope: **required**
- Routing tag derived from the static key even on v2: **required**
- Sender identified from the sealed static key, not the packet header: **required**
