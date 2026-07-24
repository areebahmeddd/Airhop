---
description: >
  Reference for private groups: the creator-signed roster and epoch key that
  travel over Noise, and the ChaCha20-Poly1305 group messages broadcast as
  0x25. Read before touching group-protocol.ts or group-store.ts. The AAD
  binding and the roster check after decrypt are easy to omit and fail silently.
---

# Private Groups

> Read before touching `group-protocol.ts`, `group-store.ts`, or anything handling `0x25` or group state.
>
> Source of truth: `bitchat/ios/bitchat/Services/Groups/GroupProtocol.swift`.

## The two halves

Group state and group messages travel on completely different paths. Confusing them is the most common way to break this subsystem.

| Part                 | Travels as                            | Encrypted by      |
| -------------------- | ------------------------------------- | ----------------- |
| Roster + epoch key   | `NOISE_ENCRYPTED` (`0x11`) over Noise | The Noise session |
| Actual chat messages | `GROUP_MESSAGE` (`0x25`) broadcast    | The epoch key     |

The symmetric epoch key is **only ever delivered inside an authenticated Noise session**, one member at a time, as NoisePayload type `0x06` (groupInvite) or `0x07` (groupKeyUpdate). It is never broadcast and never put in a link. That is the whole difference between a private group and a private channel.

## Group state payload

TLV, 2-byte big-endian lengths: `0x01` groupID (16B), `0x02` name, `0x03` key (32B), `0x04` epoch (u32 BE), `0x05` roster, `0x06` creatorFingerprint (32B), `0x07` signature (64B).

Roster blob is deterministic: a count byte, then per member the raw 32-byte fingerprint, 32-byte Ed25519 signing key, and a length-prefixed UTF-8 nickname. Max 16 members. A member's `fingerprint` is `SHA-256(their Noise static key)` as 64 hex chars.

The creator signs:

```
"bitchat-group-v1" | groupID | epoch(4B BE) | SHA256(key) | SHA256(rosterBlob) | SHA256(name)
```

Hashing the key, roster, and name keeps the signed content fixed-size while still binding all three. The name is covered so a cached signed state cannot be replayed with a swapped display name.

## Accepting state: three checks, all required

```typescript
const state = decodeGroupState(body);
if (state === null || !verifyGroupState(state)) return; // 1. creator signature
const senderNoise = registry.get(senderPeerID)?.noisePubKey;
if (senderNoise === undefined) return;
if (groupFingerprint(senderNoise) !== state.creatorFingerprint) return; // 2. sender IS the creator
const me = groupFingerprint(identity.noiseStaticPubKey);
if (!state.members.some((m) => m.fingerprint === me)) return; // 3. we are on the roster
```

Check 2 is easy to miss and important: without it, any member who received a valid signed state could rebroadcast it to a stranger, handing out the group key. Binding the state to the authenticated Noise peer stops that.

Only a **newer** epoch replaces stored state. Ignore equal or older epochs, or a replayed old invite downgrades the group to a key that has since rotated.

## Message envelope (`0x25`)

TLV: `0x01` groupID (16B, cleartext), `0x02` epoch (u32 BE), `0x03` nonce (12B), `0x04` ciphertext (ChaChaPoly body ‖ 16-byte tag).

The group ID and epoch are deliberately cleartext so relays can carry and dedupe group traffic without membership. Everything identifying (sender, content, timestamp) is inside the ciphertext.

**AAD is `groupID ‖ epoch(4B BE)`.** This is the single most important line in the subsystem: it binds a ciphertext to one group at one epoch, so it cannot be replayed into another group or under a rotated key. Never seal or open without it.

ChaCha20-Poly1305 here is RFC 8439 (12-byte nonce, 16-byte tag), which is what CryptoKit's `ChaChaPoly` implements, so `@noble/ciphers` interoperates directly.

## Inner payload

Decrypted content is its own TLV: `0x01` messageID, `0x02` senderSigningKey (32B), `0x03` senderNickname, `0x04` timestamp (u64 BE), `0x05` content, `0x06` signature (64B Ed25519) over:

```
"bitchat-group-msg-v1" | groupID | epoch(4B BE) | messageID | timestamp(8B BE) | content
```

Covering the epoch stops a current member re-sealing another member's decrypted bytes under a later epoch key.

## Two checks on receive, not one

`openGroupMessage` only proves the author holds `senderSigningKey`. It does **not** prove they belong to this group. The caller must also confirm that key is on the roster:

```typescript
const plain = openGroupMessage(env, group.key);
if (plain === null) return;
const member = group.members.find(
  (m) => bytesToHex(m.signingKey) === bytesToHex(plain.senderSigningKey),
);
if (member === undefined) return; // holds a valid key but is not a member
```

## Review checklist

- AAD is `groupID ‖ epoch` on both seal and open: **required**
- Creator signature verified, and the Noise sender is the creator: **required**
- We are on the roster before storing the key: **required**
- Older or equal epoch never replaces stored state: **required**
- Author confirmed against the roster after decrypt: **required**
- Epoch key never broadcast, never in a link, never in MMKV outside `group-store` (which panic-wipes): **required**
