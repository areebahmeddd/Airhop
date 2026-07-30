# Airhop: Protocol Reference

> **This is the spec sheet.** Exact constants, byte layouts, and UUIDs. When writing `packet-codec.ts` or the native BLE module, read this document. When in doubt about a value, this document wins.
>
> Source of truth: `bitchat/ios/localPackages/BitFoundation/Sources/BitFoundation/BinaryProtocol.swift` and `bitchat/android/.../protocol/BinaryProtocol.kt`. Both iOS and Android use the same binary format.

## 1. BLE Identifiers

| Identifier                | Value                                  | Notes                                       |
| ------------------------- | -------------------------------------- | ------------------------------------------- |
| **Service UUID**          | `F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C` | Same as bitchat mainnet. Do not change.     |
| **Characteristic UUID**   | `A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D` | Read/Write/Notify                           |
| **Peer ID in the advert** | iOS local name, Android service data   | Carried differently per platform, see below |
| **Protocol version**      | `2`                                    | `u8` at byte `[0]` of every packet          |

A scanner reads the peer ID out of the advertisement so it can identify and
de-duplicate a device before opening a link. The two platforms cannot carry it
the same way:

- **Android** puts the first 8 bytes of the peer ID in scan-response service data
  under the service UUID, and advertises no local name.
- **iOS** advertises the full 16-character peer ID as the local name.
  CoreBluetooth has no API for service data, so the Android layout is not
  available to it.

Neither platform advertises a `bitchat-` name prefix. A scanner that finds no
peer ID in the advertisement still connects and learns the peer from its first
`ANNOUNCE`, which is what happens on every iOS-to-Android link.

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

**Re-encoding must preserve the payload as received.** Because the signature covers a re-encoding of the packet, verifying re-encodes and therefore re-compresses. DEFLATE output is not canonical: bitchat iOS compresses with Apple's `compression_encode_buffer`, bitchat Android with `java.util.zip.Deflater`, and Airhop with pako. All three inflate each other's streams, but they are not guaranteed to emit identical bytes for identical input, and the "only if smaller" check can even make them disagree on whether to compress at all. A re-encode that compresses again would therefore produce a different signing preimage and reject a valid packet.

Airhop's decoder keeps the payload exactly as it arrived (compressed bytes and the `isCompressed` decision) and its encoder reuses that form instead of re-compressing. This is required in two places:

- **Verification**, so a packet signed by any implementation verifies here.
- **Relaying**, because a relay re-encodes. Re-compressing would replace the originator's bytes with the relay's own and invalidate the signature for every node downstream.

Locally originated packets have no received form and are compressed normally, so this never changes what Airhop emits. The reuse is keyed to the decoded payload, so replacing the payload discards the received form and falls back to compressing, keeping tampering detectable.

Airhop's outbound DEFLATE is byte-identical to reference zlib (`pako` with `legacyHash: false`, locked by test vectors in `packet-compression.test.ts`). Verified against zlib 1.3.1, which is also what Android's `Deflater` produces. **Not yet verified against Apple's encoder**, which requires running `CompressionUtil.compress` on Apple hardware.

**Packet deduplication** uses `PacketID = SHA-256(type[1] | senderID[8] | timestamp_u64_BE[8] | payload)[0:16]` per `PacketIdUtil.swift` / `PacketIdUtil.kt`. There is no nonce field.

**Source route field** (when `hasRoute=1`): `count` (1 byte) followed by `count × 8` bytes of intermediate hop Peer IDs. The sender and final recipient are NOT in the route list; they are in the header.

## 3. Packet Type Registry

All type values match bitchat `MessageType.swift` / `MessageType.kt` (public domain). Types `0x01–0x28` are bitchat-defined; `0x29+` are Airhop extensions. bitchat nodes silently drop unknown types.

| Name              | Hex    | Direction         | Description                                                                                                                                                                                                                                                                |
| ----------------- | ------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANNOUNCE`        | `0x01` | Broadcast         | Signed presence heartbeat. Payload is TLV-encoded (1-byte length): `0x01` nickname, `0x02` Noise pubkey (32B), `0x03` Ed25519 signing pubkey (32B), `0x04` direct neighbors (optional, up to 10 × 8B peer IDs).                                                            |
| `CHANNEL_MSG`     | `0x02` | Broadcast         | Public channel message. Plaintext + signed. Channel name embedded in payload.                                                                                                                                                                                              |
| `LEAVE`           | `0x03` | Broadcast         | Peer departing notification.                                                                                                                                                                                                                                               |
| `COURIER_ENV`     | `0x04` | Broadcast         | Store-and-forward sealed envelope. Noise X encrypted. TLV format (see section 6).                                                                                                                                                                                          |
| `NOISE_HANDSHAKE` | `0x10` | Unicast           | Noise XX handshake message (initiator msg1 / responder msg2 / initiator msg3). recipientID set.                                                                                                                                                                            |
| `NOISE_ENCRYPTED` | `0x11` | Unicast           | Post-handshake encrypted payload: DM text, receipts, group invites (`0x06`/`0x07`), live voice (`0x08`), metadata. recipientID set. HAS_RECIPIENT flag set.                                                                                                                |
| `DR_ENCRYPTED`    | `0x12` | Unicast           | Double Ratchet encrypted DM (per-message forward secrecy beyond Noise transport). Airhop-to-Airhop only; bitchat drops as unknown. (Airhop extension)                                                                                                                      |
| `FRAGMENT`        | `0x20` | Broadcast/Unicast | BLE fragment of a larger message. Stream ID + index + total in payload header. See section 7.                                                                                                                                                                              |
| `REQUEST_SYNC`    | `0x21` | Broadcast         | GCS filter gossip request. TTL=2 (local-only). Type-aware (SyncTypeFlags bit 8 = board posts). Payload TLV format (see section 5).                                                                                                                                         |
| `FILE_TRANSFER`   | `0x22` | Broadcast/Unicast | Binary file / audio / image payload. Single `BitchatFilePacket` TLV (section 3.2), MIME allow-list + magic-byte validation.                                                                                                                                                |
| `BOARD_POST`      | `0x23` | Broadcast         | Signed bulletin-board post or tombstone (TLV). Ed25519-signed by the author; persists until its author-chosen expiry (max 7 days) and gossip-syncs.                                                                                                                        |
| `PREKEY_BUNDLE`   | `0x24` | Broadcast         | Signed batch of one-time Curve25519 prekeys (TLV). Gossiped; a sender seals a courier envelope to a prekey for forward-secret async first contact.                                                                                                                         |
| `GROUP_MESSAGE`   | `0x25` | Broadcast         | Private-group message: cleartext groupID + epoch framing a ChaCha20-Poly1305 body with an Ed25519-signed inner payload. Roster/key travel over Noise (`0x06`/`0x07`).                                                                                                      |
| `PING`            | `0x26` | Unicast           | Directed mesh echo request: 8-byte nonce + origin TTL. Unsigned; the reply's echoed nonce binds it to the probe.                                                                                                                                                           |
| `PONG`            | `0x27` | Unicast           | Directed mesh echo reply: echoed nonce + origin TTL. Hops = originTTL − receivedTTL + 1.                                                                                                                                                                                   |
| `NOSTR_CARRIER`   | `0x28` | Broadcast/Unicast | Gateway-ferried signed Nostr event (direction byte + geohash + event JSON). Verified against its own Schnorr signature before use.                                                                                                                                         |
| `VOICE_FRAME`     | `0x29` | Broadcast         | One live push-to-talk burst packet, signed like a public message. Payload is a `VoiceBurstPacket` (section 3.1). Also shipped by bitchat, so live voice works between the two. A DM burst carries the same payload inside `NoisePayloadType.VOICE_FRAME` (`0x08`) instead. |
| `CHANNEL_ENC`     | `0x2a` | Broadcast         | Airhop private channel: XChaCha20-Poly1305 sealed message. bitchat drops as unknown. (Airhop extension)                                                                                                                                                                    |

### 3.1 Voice burst payload

One packet of a live push-to-talk burst. The same bytes are the payload of a
`VOICE_FRAME` (`0x29`) broadcast and of a `NoisePayloadType.VOICE_FRAME`
(`0x08`) DM, so one format serves both scopes and only the envelope differs.
Byte-identical to bitchat's `VoiceBurstPacket.swift`.

```
[burstID: 8][seq: u16 BE][flags: u8][payload...]
```

| flags  | Meaning  | Payload                                                |
| ------ | -------- | ------------------------------------------------------ |
| `0x01` | START    | `[codec: u8]` (`0x01` = AAC-LC, 16 kHz, mono, 16 kbps) |
| `0x00` | DATA     | repeated `[len: u16 BE][raw AAC frame]`                |
| `0x02` | END      | `[totalDataPackets: u16 BE][durationMs: u32 BE]`       |
| `0x04` | CANCELED | empty; receivers discard the burst                     |

`seq` 0 is reserved for START; DATA packets start at 1. Frames carry no ADTS
header: the codec byte fully describes them, and the receiver rebuilds the
`AudioSpecificConfig` from it.

Notes that matter for interoperating:

- **A burst can begin at a DATA packet.** START is sent once, so a lost packet
  at the head of a burst, or walking into range mid-sentence, would otherwise
  mean silence. Both Airhop and bitchat open the assembly with the default
  codec in that case.
- **Payloads stay under 210 bytes** (`pttMaxBurstContentBytes`) so a voice
  packet never enters the fragment scheduler, which caps concurrent transfers
  and would starve file sends while somebody talks.
- **Voice frames are never padded and never gossiped.** Padding would push
  them into fragmentation; gossip replay of stale audio is worthless.
- **Relayed on the fragment policy**: 8–25 ms jitter, TTL clamped to 5 in a
  dense mesh and 7 otherwise, so multi-hop audio stays inside the receiver's
  350 ms jitter buffer.

### 3.2 File packet payload

One whole file per packet, as a TLV blob. There is no app-level chunking: the
fragment layer splits the packet for the radio and reassembles it on the far
side. Byte-compatible with bitchat's `BitchatFilePacket`.

| Tag    | Field      | Length | Notes                                 |
| ------ | ---------- | ------ | ------------------------------------- |
| `0x01` | fileName   | u16    |                                       |
| `0x02` | fileSize   | u16    | value is u32                          |
| `0x03` | mimeType   | u16    |                                       |
| `0x04` | content    | u32    | last; u16 accepted for legacy senders |
| `0x05` | channel    | u16    | Airhop: routes a room attachment      |
| `0x06` | durationMs | u16    | Airhop: voice length, value is u32    |
| `0x07` | caption    | u16    | Airhop: media caption, 512 bytes max  |

Tags `0x05`–`0x07` are Airhop additions. bitchat skips unknown tags by reading
their u16 length, so they cost nothing in either direction: a bitchat client
reads the file and ignores the extras.

**Size caps are per type, not one number.** bitchat enforces them when it
_decodes_, so exceeding one is not a partial success — the whole file is
refused. Airhop checks before the first fragment goes out.

| Type          | Cap     |
| ------------- | ------- |
| Photo         | 512 KiB |
| Voice note    | 512 KiB |
| Anything else | 1 MiB   |

**MIME is resolved, never passed through.** A picker often returns nothing, and
an empty or unrecognised type is dropped on arrival by both clients, which looks
identical to a successful send from the sender's side. The type is taken from
the declared value when the allow-list admits it, else inferred from the file
extension, else `application/octet-stream`, which is always accepted and renders
as a document. On receive, the declared type is checked against the file's magic
bytes, so a file cannot lie about what it is.

## 4. Routing Constants

| Constant                  | Value          | Source                                       |
| ------------------------- | -------------- | -------------------------------------------- |
| Default TTL               | `7`            | `TransportConfig.swift`                      |
| Relay jitter range        | `10–220 ms`    | Random delay before re-broadcast             |
| Fragment size             | `469 bytes`    | Max BLE payload per fragment                 |
| Max concurrent assemblies | `128`          | In-flight fragment reassembly slots          |
| Dedup LRU size            | `1000 entries` | Seen-packetID cache (16-byte IDs)            |
| Dedup expiry window       | `5 minutes`    | PacketID expiry in dedup cache               |
| Fanout subset size        | `~⌈sqrt(n)⌉`   | Deterministic fanout, excludes ingress peer  |
| Voice relay jitter        | `8–25 ms`      | Live voice and fragments (`TransportConfig`) |
| Voice relay TTL cap       | `7` / `5`      | Sparse / dense (degree ≥ 6) meshes           |
| Voice jitter buffer       | `350 ms`       | Buffered before live playback starts         |
| Concurrent voice bursts   | `8`            | Inbound assembly cap per device              |

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

| Constant                          | Value          | Notes                                     |
| --------------------------------- | -------------- | ----------------------------------------- |
| Courier pool size                 | `40 envelopes` | Max carried per device                    |
| Verified-tier sub-cap             | `20 envelopes` | Verified mail cannot crowd out favorites  |
| Envelope TTL                      | `24 hours`     | Stamped by the sender, dropped after      |
| Expiry slack accepted             | `1 hour`       | Clock skew only; longer expiries rejected |
| Per-envelope size cap             | `16 KiB`       | Text only; media not couriered            |
| Per-peer deposit quota (favorite) | `5 envelopes`  | Trust tier: favorite                      |
| Per-peer deposit quota (verified) | `2 envelopes`  | Trust tier: verified/known                |

A carrier judges an envelope by its own limits, not the sender's. An expiry
beyond `TTL + slack` is refused outright rather than clamped, so a sender that
stamps longer does not get longer carriage, it gets no carriage at all.
| Recipient tag derivation | HMAC-SHA256(key=noiseStaticKey, msg=`"bitchat-courier-tag-v1"` \|\| epochDay_BE4)[0:16] | epochDay = floor(unixSec/86400) as u32 BE |

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
| Nutzap event kind    | `9321` (NIP-61; `proof` tag per proof, `u` = mint)                                                      |
| Wallet info kind     | `10019` (NIP-61; `mint`, `relay`, 33-byte `pubkey`)                                                     |
| Cashu wallet kind    | `17375` (NIP-60, not published by Airhop yet)                                                           |
| Token event kind     | `7375` (NIP-60, not published by Airhop yet)                                                            |
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
