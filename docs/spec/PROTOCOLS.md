# Airhop: Protocol Reference

> **This is the spec sheet.** Exact constants, byte layouts, and UUIDs. When writing `packet-codec.ts` or the native BLE module, read this document. When in doubt about a value, this document wins.
>
> Source of truth: `bitchat/ios/localPackages/BitFoundation/Sources/BitFoundation/BinaryProtocol.swift` and `bitchat/android/.../protocol/BinaryProtocol.kt`. Both iOS and Android use the same binary format.

## 1. BLE Identifiers

| Identifier              | Value                                  | Notes                                   |
| ----------------------- | -------------------------------------- | --------------------------------------- |
| **Service UUID**        | `F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C` | Same as bitchat mainnet. Do not change. |
| **Characteristic UUID** | `A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D` | Read/Write/Notify                       |
| **Local Name prefix**   | `bitchat-`                             | Advertised in scan response             |
| **Protocol version**    | `2`                                    | `u8` at byte `[0]` of every packet      |

## 2. Packet Frame Layout

Every packet over BLE uses this exact binary format (bitchat v2):

```
Fixed header (v2 = 16 bytes):
Offset  Size  Type     Field
------  ----  -------  ----------------------------------------
[0]        1   u8       version = 2
[1]        1   u8       type (see section 3 for packet types)
[2]        1   u8       ttl (default 7, decremented each hop; set to 0 for signing)
[3 to 10]  8   u64-BE   timestamp (Unix MILLISECONDS, not seconds)
[11]       1   u8       flags
                          bit 0 (0x01): hasRecipient: recipientID field present
                          bit 1 (0x02): hasSignature: 64-byte Ed25519 signature appended
                          bit 2 (0x04): isCompressed: raw-DEFLATE payload, preceded by originalSize
                          bit 3 (0x08): hasRoute: source-route hop list present
                          bit 4 (0x10): isRSR: solicited sync response
[12 to 15] 4   u32-BE   payloadLength

Variable sections (in this exact order after the header):
  senderID    (8 bytes, always present)
  recipientID (8 bytes, only when hasRecipient = 1)
  route       (when hasRoute = 1: [count: u8][hop1: 8 bytes]...[hopN: 8 bytes])
  payload     (payloadLength bytes)
  signature   (64 bytes Ed25519, only when hasSignature = 1)
```

**Broadcast packets** omit the recipientID field entirely (hasRecipient = 0). Decoders set recipientID to all-zeros when hasRecipient = 0.

**Signature coverage** (`toBinaryDataForSigning()`): encode the full packet with `ttl=0`, `isRSR=false`, `hasSignature=0` (no signature field), then Ed25519-sign the resulting bytes. This allows relays to decrement TTL and tag solicited responses without invalidating the original signature.

**Packet deduplication** uses `PacketID = SHA-256(type[1] | senderID[8] | timestamp_u64_BE[8] | payload)[0:16]` per `PacketIdUtil.swift` / `PacketIdUtil.kt`. There is no nonce field.

**Source route field** (when `hasRoute=1`): `count` (1 byte) followed by `count × 8` bytes of intermediate hop Peer IDs. The sender and final recipient are NOT in the route list; they are in the header.

## 3. Packet Type Registry

All type values match bitchat `MessageType.swift` / `MessageType.kt` (public domain). Types `0x01–0x28` are bitchat-defined; `0x29+` are Airhop extensions. bitchat nodes silently drop unknown types.

| Name              | Hex    | Direction         | Description                                                                                                                                                                                                              |
| ----------------- | ------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ANNOUNCE`        | `0x01` | Broadcast         | Signed presence heartbeat. Payload is TLV-encoded (1-byte length): `0x01` nickname, `0x02` Noise pubkey (32B), `0x03` Ed25519 signing pubkey (32B), `0x04` direct neighbors (optional, up to 10 × 8B peer IDs).          |
| `CHANNEL_MSG`     | `0x02` | Broadcast         | Public channel message. Plaintext + signed. Channel name embedded in payload.                                                                                                                                            |
| `LEAVE`           | `0x03` | Broadcast         | Peer departing notification.                                                                                                                                                                                             |
| `COURIER_ENV`     | `0x04` | Broadcast         | Store-and-forward sealed envelope. Noise X encrypted. TLV format (see section 6).                                                                                                                                        |
| `NOISE_HANDSHAKE` | `0x10` | Unicast           | Noise XX handshake message (initiator msg1 / responder msg2 / initiator msg3). recipientID set.                                                                                                                          |
| `NOISE_ENCRYPTED` | `0x11` | Unicast           | Post-handshake encrypted payload: DM text, receipts, group invites (`0x06`/`0x07`), metadata. recipientID set. HAS_RECIPIENT flag set.                                                                                   |
| `DR_ENCRYPTED`    | `0x12` | Unicast           | Double Ratchet encrypted DM (per-message forward secrecy beyond Noise transport). Airhop-to-Airhop only; bitchat drops as unknown. (Airhop extension)                                                                    |
| `FRAGMENT`        | `0x20` | Broadcast/Unicast | BLE fragment of a larger message. Stream ID + index + total in payload header. See section 7.                                                                                                                            |
| `REQUEST_SYNC`    | `0x21` | Broadcast         | GCS filter gossip request. TTL=2 (local-only). Type-aware (SyncTypeFlags bit 8 = board posts). Payload TLV format (see section 5).                                                                                       |
| `FILE_TRANSFER`   | `0x22` | Broadcast/Unicast | Binary file / audio / image payload. Single `BitchatFilePacket` TLV, 1 MiB cap, MIME allow-list + magic-byte validation.                                                                                                 |
| `BOARD_POST`      | `0x23` | Broadcast         | Signed bulletin-board post or tombstone (TLV). Ed25519-signed by the author; persists until its author-chosen expiry (max 7 days) and gossip-syncs.                                                                      |
| `PREKEY_BUNDLE`   | `0x24` | Broadcast         | Signed batch of one-time Curve25519 prekeys (TLV). Gossiped; a sender seals a courier envelope to a prekey for forward-secret async first contact.                                                                       |
| `GROUP_MESSAGE`   | `0x25` | Broadcast         | Private-group message: cleartext groupID + epoch framing a ChaCha20-Poly1305 body with an Ed25519-signed inner payload. Roster/key travel over Noise (`0x06`/`0x07`).                                                    |
| `PING`            | `0x26` | Unicast           | Directed mesh echo request: 8-byte nonce + origin TTL. Unsigned; the reply's echoed nonce binds it to the probe.                                                                                                         |
| `PONG`            | `0x27` | Unicast           | Directed mesh echo reply: echoed nonce + origin TTL. Hops = originTTL − receivedTTL + 1.                                                                                                                                 |
| `NOSTR_CARRIER`   | `0x28` | Broadcast/Unicast | Gateway-ferried signed Nostr event (direction byte + geohash + event JSON). Verified against its own Schnorr signature before use.                                                                                       |
| `VOICE_FRAME`     | `0x29` | Broadcast         | PTT audio burst. Matches `VoiceBurstPacket.swift`. **Reserved, not yet sent or handled.** live PTT needs a streaming-mic native module on both platforms. Voice _notes_ ride `FILE_TRANSFER` instead. (Airhop extension) |
| `CHANNEL_ENC`     | `0x2a` | Broadcast         | Airhop private channel: XChaCha20-Poly1305 sealed message. bitchat drops as unknown. (Airhop extension)                                                                                                                  |

## 4. Routing Constants

| Constant                  | Value          | Source                                      |
| ------------------------- | -------------- | ------------------------------------------- |
| Default TTL               | `7`            | `TransportConfig.swift`                     |
| Relay jitter range        | `10–220 ms`    | Random delay before re-broadcast            |
| Fragment size             | `469 bytes`    | Max BLE payload per fragment                |
| Max concurrent assemblies | `128`          | In-flight fragment reassembly slots         |
| Dedup LRU size            | `1000 entries` | Seen-packetID cache (16-byte IDs)           |
| Dedup expiry window       | `5 minutes`    | PacketID expiry in dedup cache              |
| Fanout subset size        | `~⌈sqrt(n)⌉`   | Deterministic fanout, excludes ingress peer |

## 5. Gossip Sync Constants

> **iOS vs Android divergence:** bitchat-iOS and bitchat-android have different default values for these constants. Airhop uses bitchat-iOS values as canonical unless noted.

| Constant                       | Airhop / iOS                                          | bitchat-Android                    | Notes                                         |
| ------------------------------ | ----------------------------------------------------- | ---------------------------------- | --------------------------------------------- |
| Sync interval                  | `15 seconds`                                          | `30 seconds`                       | How often REQUEST_SYNC is broadcast           |
| Triggered sync delay           | `5 seconds`                                           | `5 seconds`                        | After first announce from new direct peer     |
| Gossip cache size              | `1000 packets`                                        | `100 packets`                      | Rolling seen-packet set for GCS               |
| GCS filter false positive rate | `1%` (`targetFpr = 0.01`)                             | `1%` (configurable 0.1%–5%)        | Same default; P = ceil(log2(1/fpr)) = 7       |
| GCS hash modulus M             | `count × 2^P`                                         | configurable                       | Gives FPR ≈ 1/2^P per element; u32 on wire    |
| GCS filter size budget         | `400 bytes`                                           | `128–1024 bytes` (default 256)     | `gcsMaxBytes` in `GossipSyncManager`          |
| GCS hash function              | `SHA-256(packetID)[0:8]` as u63 BE (sign bit cleared) | `SHA-256(packetID)[0:8]` as u63 BE | Not SipHash; both implementations use SHA-256 |
| Packet ID for GCS              | `SHA-256(type\|senderID\|timestamp\|payload)[0:16]`   | same                               | 128-bit deterministic ID                      |
| Sync scope                     | local only                                            | local only                         | REQUEST_SYNC is not relayed                   |

## 6. Store-and-Forward (Courier) Constants

| Constant                          | Value                                                                                   | Notes                                     |
| --------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------- |
| Courier pool size                 | `40 envelopes`                                                                          | Max carried per device                    |
| Envelope TTL                      | `24 hours`                                                                              | Dropped after expiry                      |
| Per-envelope size cap             | `16 KiB`                                                                                | Text only; media not couriered            |
| Per-peer deposit quota (favorite) | `5 envelopes`                                                                           | Trust tier: favorite                      |
| Per-peer deposit quota (verified) | `2 envelopes`                                                                           | Trust tier: verified/known                |
| Recipient tag derivation          | HMAC-SHA256(key=noiseStaticKey, msg=`"bitchat-courier-tag-v1"` \|\| epochDay_BE4)[0:16] | epochDay = floor(unixSec/86400) as u32 BE |

## 7. Cryptographic Constants

| Constant                      | Value                                          |
| ----------------------------- | ---------------------------------------------- |
| **Noise XX algorithm string** | `Noise_XX_25519_ChaChaPoly_SHA256`             |
| **Noise X algorithm string**  | `Noise_X_25519_ChaChaPoly_SHA256`              |
| DH function                   | Curve25519 (X25519)                            |
| AEAD cipher                   | ChaCha20-Poly1305                              |
| Hash function                 | SHA-256                                        |
| Noise static key type         | X25519 (32-byte scalar)                        |
| Signing key type              | Ed25519                                        |
| Peer ID derivation            | `hex(SHA-256(noiseStaticPubKey)).slice(0, 16)` |
| Nostr DM encryption           | NIP-44 (XChaCha20-Poly1305, versioned)         |

## 8. Identity & Nostr Constants

| Constant             | Value                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| Nostr public key     | secp256k1 pubkey (hex), derived via HKDF-SHA256 from Ed25519 signing key (info=`"airhop-nostr-key-v1"`) |
| Nostr channel kind   | `20000` (geohash channel message)                                                                       |
| Nostr presence kind  | `20001` (geohash heartbeat)                                                                             |
| Nostr DM rumor kind  | `14` (NIP-17 unsigned inner event)                                                                      |
| Nostr seal kind      | `13` (NIP-17 seal, signed by real sender, encrypts rumor to recipient)                                  |
| Nostr gift wrap kind | `1059` (NIP-17 outer envelope, signed by ephemeral key)                                                 |
| Nostr courier drop   | `1401` (Nostr store-and-forward envelope; `#x` tag = recipient tag hex; NIP-40 expiry)                  |
| Nutzap event kind    | `9321` (NIP-61)                                                                                         |
| Wallet info kind     | `10019` (NIP-61 receiver info)                                                                          |
| Cashu wallet kind    | `17375` (NIP-60)                                                                                        |
| Token event kind     | `7375` (NIP-60)                                                                                         |
| Geohash precision    | 5 characters (~5 km × 5 km cell)                                                                        |

## 9. bitchat Wire Compatibility Table

| Field                 | Airhop                    | bitchat iOS               | bitchat Android           | Must Match   |
| --------------------- | ------------------------- | ------------------------- | ------------------------- | ------------ |
| Service UUID          | `F47B5E2D...`             | `F47B5E2D...`             | `F47B5E2D...`             | ✅ Yes       |
| Characteristic UUID   | `A1B2C3D4...`             | `A1B2C3D4...`             | `A1B2C3D4...`             | ✅ Yes       |
| Packet version        | `2`                       | `2`                       | `2`                       | ✅ Yes       |
| TTL default           | `7`                       | `7`                       | `7`                       | ✅ Yes       |
| Fragment size         | `469` bytes               | `469` bytes               | `469` bytes               | ✅ Yes       |
| Peer ID format        | SHA-256 slice 16          | SHA-256 slice 16          | SHA-256 slice 16          | ✅ Yes       |
| Noise XX cipher suite | `25519_ChaChaPoly_SHA256` | `25519_ChaChaPoly_SHA256` | `25519_ChaChaPoly_SHA256` | ✅ Identical |
| Packet types `0x29+`  | Airhop extensions         | Unknown → dropped         | Unknown → dropped         | ✅ Safe      |

> ✅ **Crypto note (corrected):** all three clients use `Noise_XX_25519_ChaChaPoly_SHA256`. An earlier version of this doc claimed bitchat-Android had diverged to AES-256-GCM; that was incorrect. Its vendored noise-java library contains AES-GCM cipher classes, but the only protocol name ever instantiated is ChaChaPoly, so those classes are never selected. There is no divergence and no platform to choose between.
