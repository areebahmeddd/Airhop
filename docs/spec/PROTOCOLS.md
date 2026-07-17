# Airhop: Protocol Reference

> **This is the spec sheet.** Exact constants, byte layouts, and UUIDs. When writing `packet-codec.ts` or the native BLE module, read this document. When in doubt about a value, this document wins.
>
> Source of truth cross-referenced with: `bitchat/ios/BLEService.swift`, `bitchat/android/MeshCore.kt`, `bitchat/android/BluetoothGattClientManager.kt`

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
Offset  Size  Type    Field
------  ----  ------  ----------------------------------------
[0]       1   u8      version = 2
[1]       1   u8      type (see section 3 for packet types)
[2]       1   u8      ttl (default 7, decremented each hop)
[3]       1   u8      flags
                        bit 0: hasRecipient (1 = unicast)
                        bit 1: compressed (1 = LZ4 payload)
                        bit 2: signed (1 = signature present)
                        bit 3: hasRoute (1 = source route present, v2 only)
[4–11]    8   bytes   senderID   (first 8 bytes of SHA-256(noiseStaticPubKey))
[12–19]   8   bytes   recipientID (all-zeros = broadcast)
[20–23]   4   u32-BE  timestamp  (Unix seconds)
[24–31]   8   bytes   nonce      (random, for dedup)
[32–95]  64   bytes   signature  (Ed25519 over bytes [0–31] + payload)
[96+]    var  bytes   payload    (LZ4-compressed content)
```

**Signature coverage:** bytes `[0–31]` (header) plus the full payload, with TTL byte `[2]` **normalized to `0`** before signing. This allows relays to decrement TTL without invalidating the signature.

**Source route field (when `hasRoute=1`):** Inserted between `recipientID` and `payload`. Format: `count` (1 byte) followed by `count × 8` bytes of intermediate hop Peer IDs. The sender and recipient are NOT included in the route list; they are already in the header.

## 3. Packet Type Registry

All type values match bitchat `MessageType.swift` (public domain). Types `0x01–0x28` are bitchat-defined; `0x29+` are Airhop extensions. bitchat nodes silently drop unknown types.

| Name              | Hex    | Direction         | Description                                                                                                                                                                                     |
| ----------------- | ------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANNOUNCE`        | `0x01` | Broadcast         | Signed presence heartbeat. Payload is TLV-encoded: `0x01` nickname, `0x02` Noise pubkey (32B), `0x03` Ed25519 signing pubkey (32B), `0x04` direct neighbors (optional, up to 10 × 8B peer IDs). |
| `CHANNEL_MSG`     | `0x02` | Broadcast         | Public channel message. Plaintext + signed. Channel name embedded in payload.                                                                                                                   |
| `LEAVE`           | `0x03` | Broadcast         | Peer departing notification.                                                                                                                                                                    |
| `COURIER_ENV`     | `0x04` | Broadcast         | Store-and-forward sealed envelope. Noise X encrypted. TLV format (see section 6).                                                                                                               |
| `NOISE_HANDSHAKE` | `0x10` | Unicast           | Noise XX handshake message (initiator msg1 / responder msg2 / initiator msg3). recipientID set.                                                                                                 |
| `NOISE_ENCRYPTED` | `0x11` | Unicast           | Post-handshake encrypted payload: DM text, receipts, metadata. recipientID set. HAS_RECIPIENT flag set.                                                                                         |
| `FRAGMENT`        | `0x20` | Broadcast/Unicast | BLE fragment of a larger message. Stream ID + index + total in payload header. See section 7.                                                                                                   |
| `REQUEST_SYNC`    | `0x21` | Broadcast         | GCS filter gossip request. TTL=2 (local-only). Payload TLV format (see section 5).                                                                                                              |
| `FILE_TRANSFER`   | `0x22` | Broadcast/Unicast | Binary file / audio / image payload.                                                                                                                                                            |
| `VOICE_FRAME`     | `0x29` | Broadcast         | PTT audio burst. AAC 16 kHz mono frame. (Airhop extension)                                                                                                                                      |
| `VIDEO_FRAME`     | `0x30` | Unicast           | Video frame (WiFi Aware only, Airhop extension). HEVC.                                                                                                                                          |
| `CASHU_TOKEN`     | `0x40` | Unicast           | Cashu ecash token transfer (Airhop extension).                                                                                                                                                  |

## 4. Routing Constants

| Constant                  | Value          | Source                                      |
| ------------------------- | -------------- | ------------------------------------------- |
| Default TTL               | `7`            | `TransportConfig.swift`                     |
| Relay jitter range        | `10–220 ms`    | Random delay before re-broadcast            |
| Fragment size             | `469 bytes`    | Max BLE payload per fragment                |
| Max concurrent assemblies | `128`          | In-flight fragment reassembly slots         |
| Dedup LRU size            | `1000 entries` | Seen-nonce cache                            |
| Dedup expiry window       | `5 minutes`    | Nonce expiry in dedup cache                 |
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

| Field                 | Airhop                    | bitchat iOS               | bitchat Android    | Must Match         |
| --------------------- | ------------------------- | ------------------------- | ------------------ | ------------------ |
| Service UUID          | `F47B5E2D...`             | `F47B5E2D...`             | `F47B5E2D...`      | ✅ Yes             |
| Characteristic UUID   | `A1B2C3D4...`             | `A1B2C3D4...`             | `A1B2C3D4...`      | ✅ Yes             |
| Packet version        | `2`                       | `2`                       | `2`                | ✅ Yes             |
| TTL default           | `7`                       | `7`                       | `7`                | ✅ Yes             |
| Fragment size         | `469` bytes               | `469` bytes               | `469` bytes        | ✅ Yes             |
| Peer ID format        | SHA-256 slice 16          | SHA-256 slice 16          | SHA-256 slice 16   | ✅ Yes             |
| Noise XX cipher suite | `25519_ChaChaPoly_SHA256` | `25519_ChaChaPoly_SHA256` | X25519+AES-256-GCM | ⚠️ Android differs |
| Packet types `0x29+`  | Airhop extensions         | Unknown → dropped         | Unknown → dropped  | ✅ Safe            |

> ⚠️ **Android crypto note:** bitchat-android uses X25519 + AES-256-GCM instead of ChaCha20-Poly1305. This is a known divergence between the two official clients. Airhop follows bitchat-**iOS** (ChaCha20-Poly1305) as the canonical spec.
