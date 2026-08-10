# Airhop: Protocol Reference

> **This is the spec sheet.** Exact constants, byte layouts, and UUIDs. When writing `packet-codec.ts` or the native BLE module, read this document. When in doubt about a value, this document wins.
>
> Values here are taken from bitchat's own binary protocol implementations. iOS and Android share the header layout and the framing.
>
> **They do not implement the same set of packet types.** bitchat-android's
> `MessageType` enum carries `0x01`–`0x03`, `0x10`, `0x11`, `0x20`–`0x22` and
> `0x29`. Everything else is bitchat-iOS only: `0x04` courier envelope, `0x23`
> board post, `0x24` prekey bundle, `0x25` group message, `0x26`/`0x27`
> ping/pong, `0x28` gateway carrier. Airhop sending one of those reaches iOS
> peers and is ignored by Android ones, exactly as an unknown type should be.
> Read every "bitchat compatible" note in these docs as "bitchat-iOS
> compatible, ignored by bitchat-android" for those types.

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

**Signature coverage** (`toBinaryDataForSigning()`): encode the full packet with `ttl=0`, `isRSR=false`, `hasSignature=0` (no signature field), **padded**, then Ed25519-sign the resulting bytes. This allows relays to decrement TTL and tag solicited responses without invalidating the original signature.

### 2.1 Padding: two different rules

Padding appears twice and the two uses are not the same rule. Conflating them breaks the protocol in opposite directions.

|                        | Padded?                                                                                  | Why                                                                                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Signing preimage**   | Every type, always                                                                       | bitchat's `toBinaryDataForSigning()` encodes with padding on, so pad bytes are inside the signed material of every signed packet. Any deviation means no other implementation can verify anything we send. |
| **Outbound BLE frame** | `NOISE_ENCRYPTED`, `NOISE_HANDSHAKE`, and the Airhop-only `DR_ENCRYPTED` / `CHANNEL_ENC` | Only where ciphertext length reveals plaintext length. Matches bitchat's `BLEOutboundPacketPolicy.padsBLEFrame`, extended to the two Airhop private types bitchat never interprets.                        |

Padding every frame is not a safe default. It buys nothing for a type whose size is already public and costs real airtime on a ~15 KB/s radio: a 30-byte `PING` becomes 256 bytes, and a ~309-byte live voice burst becomes 512, past both the 512-byte fragment frame budget and most negotiated MTUs, the outcome the 210-byte burst budget exists to prevent.

Decoders accept both forms (decode as-is, then retry after stripping PKCS#7), so an implementation that pads more than we do stays readable.

**Re-encoding must preserve the payload as received.** Because the signature covers a re-encoding of the packet, verifying re-encodes and therefore re-compresses. DEFLATE output is not canonical: bitchat iOS compresses with Apple's `compression_encode_buffer`, bitchat Android with `java.util.zip.Deflater`, and Airhop with pako. All three inflate each other's streams, but they are not guaranteed to emit identical bytes for identical input, and the "only if smaller" check can even make them disagree on whether to compress at all. A re-encode that compresses again would therefore produce a different signing preimage and reject a valid packet.

Airhop's decoder keeps the payload exactly as it arrived (compressed bytes and the `isCompressed` decision) and its encoder reuses that form instead of re-compressing. This is required in two places:

- **Verification**, so a packet signed by any implementation verifies here.
- **Relaying**, because a relay re-encodes. Re-compressing would replace the originator's bytes with the relay's own and invalidate the signature for every node downstream.

Locally originated packets have no received form and are compressed normally, so this never changes what Airhop emits. The reuse is keyed to the decoded payload, so replacing the payload discards the received form and falls back to compressing, keeping tampering detectable.

Airhop's outbound DEFLATE is byte-identical to reference zlib (`pako` with `legacyHash: false`, locked by test vectors in `packet-compression.test.ts`). Verified against zlib 1.3.1, which is also what Android's `Deflater` produces. **Not yet verified against Apple's encoder**, which requires running `CompressionUtil.compress` on Apple hardware.

**Decompression is bounded by the declared size while it runs, not checked afterwards.** `originalSize` is a sender-supplied field, so a packet can declare 100 bytes and carry a stream that expands to a gigabyte. The decoder caps output at the declared size and refuses the packet at the first byte over, which is what both bitchat clients do: iOS inflates into a buffer allocated at exactly `originalSize`, and Android does the same before probing for one further byte. A valid stream inflates to exactly `originalSize`, so nothing legitimate is affected; the packets this refuses were already refused by the size comparison, just after the memory had been spent.

**Packet deduplication** uses `PacketID = SHA-256(type[1] | senderID[8] | timestamp_u64_BE[8] | payload)[0:16]` per `PacketIdUtil.swift` / `PacketIdUtil.kt`. There is no nonce field.

**Source route field** (when `hasRoute=1`): `count` (1 byte) followed by `count × 8` bytes of intermediate hop Peer IDs. The sender and final recipient are NOT in the route list; they are in the header.

Airhop **follows** routes and never **originates** them, and never emits the `directNeighbors` TLV (`0x04`) that route planning depends on. Following is close to free and keeps Airhop from being a node other implementations must route around: a relay named in the list unicasts to the next name, falling back to flooding when that hop is unreachable. Originating would require publishing our adjacency in cleartext to every nearby radio, which bitchat's own peer-ID rotation analysis rejects for the same reason. Flooding is the documented fallback for a route that cannot be built, and it is what we already do.

## 3. Packet Type Registry

Everything up to `VOICE_FRAME` matches bitchat `MessageType.swift` / `MessageType.kt` (public domain). bitchat allocates forward and has reached `0x2C`, with `0x2A` and `0x2B` reserved upstream for courier spray-ack, so Airhop extensions start at `0x50`. A bitchat node never interprets a type it does not know, but it does relay it, so an extension still crosses a mesh of bitchat phones. `conformance.test.ts` parses their enum and fails if the gap between the two allocations closes to 16.

| Name                 | Hex    | Direction                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------- | ------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANNOUNCE`           | `0x01` | Broadcast                    | Signed presence heartbeat. Payload is TLV-encoded (1-byte length): `0x01` nickname (UTF-8, 32 bytes max; normalized to Unicode NFC, see [section 3.5](#35-nicknames-are-canonicalized-not-just-carried)), `0x02` Noise pubkey (32B), `0x03` Ed25519 signing pubkey (32B), `0x04` direct neighbors (decoded, **never emitted by Airhop**, see [section 2](#2-packet-frame-layout)), `0x05` capability bits, `0x06` bridge rendezvous geohash, `0x07` Nostr secp256k1 pubkey (Airhop extension). Receive rules: signature mandatory, `senderID` must equal `SHA-256(noisePubKey)[0:16]`, timestamp bounded to ±15 min. |
| `CHANNEL_MSG`        | `0x02` | Broadcast                    | Public channel message. Plaintext + signed. Payload is the message text as bare UTF-8 and nothing else, byte-identical to bitchat. Carries **only** `#bluetooth`, the one public mesh room; every other public channel uses `0x51`. See [section 3.7](#37-public-channel-messages).                                                                                                                                                                                                                                                                                                                                  |
| `LEAVE`              | `0x03` | Broadcast                    | Peer departing notification. Signature mandatory, checked against the pinned signing key **before** the relay decision, so an unverifiable leave is neither acted on nor forwarded. A verified one also retires the sender's Noise session. See [section 3.6](#36-leave-is-verified-before-it-is-relayed).                                                                                                                                                                                                                                                                                                           |
| `COURIER_ENV`        | `0x04` | Directed                     | Store-and-forward sealed envelope. Noise X encrypted. TLV format (see [section 6](#6-store-and-forward-courier-constants)).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `NOISE_HANDSHAKE`    | `0x10` | Unicast                      | Noise XX handshake message (initiator msg1 / responder msg2 / initiator msg3). recipientID set.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `NOISE_ENCRYPTED`    | `0x11` | Unicast                      | Post-handshake encrypted payload: DM text, receipts, group invites (`0x06`/`0x07`), live voice (`0x08`), private media (`0x20`), authenticated peer state (`0x21`). recipientID set. HAS_RECIPIENT flag set. See [section 3.3](#33-noise-inner-payload-types).                                                                                                                                                                                                                                                                                                                                                       |
| `DR_ENCRYPTED`       | `0x12` | Unicast                      | Double Ratchet encrypted DM (per-message forward secrecy beyond Noise transport). Airhop-to-Airhop only; bitchat relays it without interpreting it. (Airhop extension)                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `FRAGMENT`           | `0x20` | Broadcast/Unicast            | BLE fragment of a larger message. Stream ID + index + total in payload header. See [section 3.4](#34-fragmentation-the-budget-is-the-frame).                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `REQUEST_SYNC`       | `0x21` | Unicast (broadcast fallback) | GCS filter gossip request. **TTL=0, link-local, never relayed.** Unicast per connected peer so responses can be attributed; broadcast only as a discovery-phase fallback. Type-aware: the request names the types it wants in a `SyncTypeFlags` bitfield (see [section 5.2](#52-sync-type-bits)). Payload TLV format (see [section 5](#5-gossip-sync-constants)).                                                                                                                                                                                                                                                    |
| `FILE_TRANSFER`      | `0x22` | Broadcast/Unicast            | Binary file / audio / image payload. Single `BitchatFilePacket` TLV ([section 3.2](#32-file-packet-payload)), MIME allow-list + magic-byte validation. Signature mandatory; rendered only by the addressee; the channel tag must name a joined room that permits media.                                                                                                                                                                                                                                                                                                                                              |
| `BOARD_POST`         | `0x23` | Broadcast                    | Signed bulletin-board post or tombstone (TLV). Ed25519-signed by the author; persists until its author-chosen expiry (max 7 days) and gossip-syncs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `PREKEY_BUNDLE`      | `0x24` | Broadcast                    | Signed batch of one-time Curve25519 prekeys (TLV). Gossiped; a sender seals a courier envelope to a prekey for forward-secret async first contact.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `GROUP_MESSAGE`      | `0x25` | Broadcast                    | Private-group message: cleartext groupID + epoch framing a ChaCha20-Poly1305 body with an Ed25519-signed inner payload. Roster/key travel over Noise (`0x06`/`0x07`).                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `PING`               | `0x26` | Unicast                      | Directed mesh echo request: 8-byte nonce + origin TTL. Unsigned; the reply's echoed nonce binds it to the probe.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `PONG`               | `0x27` | Unicast                      | Directed mesh echo reply: echoed nonce + origin TTL. Hops = originTTL − receivedTTL + 1.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `NOSTR_CARRIER`      | `0x28` | Broadcast/Unicast            | Gateway-ferried signed Nostr event (direction byte + geohash + event JSON). Verified against its own Schnorr signature before use.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `VOICE_FRAME`        | `0x29` | Broadcast                    | One live push-to-talk burst packet, signed like a public message. Payload is a `VoiceBurstPacket` ([section 3.1](#31-voice-burst-payload)). Also shipped by bitchat, so live voice works between the two. A DM burst carries the same payload inside `NoisePayloadType.VOICE_FRAME` (`0x08`) instead. Broadcast only, with a 30 s freshness window.                                                                                                                                                                                                                                                                  |
| `CHANNEL_ENC`        | `0x50` | Broadcast                    | Airhop private channel: XChaCha20-Poly1305 sealed message. bitchat relays it without interpreting it. (Airhop extension)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `CHANNEL_MSG_AIRHOP` | `0x51` | Broadcast                    | Public message in a NAMED Airhop channel (a location cell). Payload `[chLen u8][channel][idLen u8][msgId][text]`, see [section 3.7](#37-public-channel-messages). Its own type because bitchat's mesh has one public room and no channel field to name a second. bitchat relays it without interpreting it. (Airhop extension)                                                                                                                                                                                                                                                                                       |

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
_decodes_, so exceeding one is not a partial success: the whole file is
refused. Airhop checks before the first fragment goes out.

| Type          | Cap     |
| ------------- | ------- |
| Photo         | 512 KiB |
| Voice note    | 512 KiB |
| Anything else | 1 MiB   |

> [!IMPORTANT]
> **These caps cannot be raised unilaterally.** bitchat-iOS refuses any packet whose declared expanded size passes `FileTransferLimits.maxFramedFileBytes` (`maxPayloadBytes` plus the TLV and binary envelopes, ~1.13 MiB), and it refuses it by returning nil with nothing logged. Raising `MAX_FILE_BYTES` past that would leave sending, Android delivery and the local UI all working while every attachment to an iPhone silently stopped arriving, with no error at either end. bitchat-android allows 10 MiB, so the ceiling is iOS's alone and there is no cross-platform number to raise to.
>
> Airhop is deliberately on both sides of the split, which is what bitchat's own [#1634](https://github.com/permissionlesstech/bitchat/pull/1634) argues for. The generic decompression bound (`MAX_PAYLOAD_BYTES`, [section 4](#4-routing-constants)) is Android's 10 MiB, because Airhop caps inflation at the declared size while it runs rather than checking afterwards, so a large declared size costs nothing to refuse. The file ceiling (`MAX_FRAMED_FILE_BYTES`) uses the iOS formula verbatim, because a file is the only payload that ever approaches it.
>
> `conformance.test.ts` reads `maxPayloadBytes` out of the vendored `FileTransferLimits.swift` and fails if the caps above no longer fit under the ceiling it implies, so this stays enforced rather than remembered.

**MIME is resolved, never passed through.** A picker often returns nothing, and
an empty or unrecognised type is dropped on arrival by both clients, which looks
identical to a successful send from the sender's side. The type is taken from
the declared value when the allow-list admits it, else inferred from the file
extension, else `application/octet-stream`, which is always accepted and renders
as a document. On receive, the declared type is checked against the file's magic
bytes, so a file cannot lie about what it is.

### 3.3 Noise inner payload types

The plaintext inside a `NOISE_ENCRYPTED` packet is `[type: u8][body]`. Values match bitchat's `NoisePayloadType`.

| Type   | Name                     | Body                                                                                           |
| ------ | ------------------------ | ---------------------------------------------------------------------------------------------- |
| `0x01` | PRIVATE_MESSAGE          | `PrivateMessagePacket` TLV (messageID, content)                                                |
| `0x02` | READ_RECEIPT             | UTF-8 messageID                                                                                |
| `0x03` | DELIVERED                | UTF-8 messageID                                                                                |
| `0x06` | GROUP_INVITE             | Creator-signed group state                                                                     |
| `0x07` | GROUP_KEY_UPDATE         | Creator-signed group state (rotation / roster)                                                 |
| `0x08` | VOICE_FRAME              | `VoiceBurstPacket` ([section 3.1](#31-voice-burst-payload))                                    |
| `0x09` | _(accepted, never sent)_ | Alias for `0x20` emitted by prerelease bitchat-iOS builds                                      |
| `0x20` | PRIVATE_FILE             | `BitchatFilePacket` TLV ([section 3.2](#32-file-packet-payload)), encrypted before fragmenting |
| `0x21` | AUTHENTICATED_PEER_STATE | `[version=0x01][TLV…]`: `0x01` capabilities, `0x02` Ed25519 key                                |

**`0x20` is how a DM attachment travels.** The cleartext directed `FILE_TRANSFER` is signed, so a relay cannot forge it, but it is not confidential, and every node it crosses can read the whole file. bitchat classifies that form as the legacy migration fallback and has scheduled its removal. Airhop seals to `0x20` whenever the recipient has **proven** capability bit 8, and falls back to the signed cleartext form only for peers that have not.

**`0x21` is the identity proof.** An announce is signed with a key carried inside the same announce, so an attacker who reads a victim's public Noise key off the air can self-sign a consistent announce under that peer ID, and trust-on-first-use then binds whoever announced first. `0x21` travels inside a completed Noise XX session, which only completes when the remote static key hashes to the claimed peer ID, so it proves possession of the private key. Consequences:

- A proven signing key **may correct** a TOFU pin. An announce **may never** overwrite a proven one.
- Capabilities from `0x21` are authoritative; announced bits are a discovery hint and never authorise a change in how we send.
- Decoding is all-or-nothing: unknown version, missing or duplicated required fields, a non-minimal capability encoding, or malformed lengths all change no state.

Capability bits (ANNOUNCE TLV `0x05` and `0x21` TLV `0x01`, minimal little-endian):

| Bit | Name                 | Meaning                                                   |
| --- | -------------------- | --------------------------------------------------------- |
| 0–7 | prekeys … bridge     | As bitchat `PeerCapabilities`                             |
| 8   | privateMedia         | Reads Noise `0x20`. Only the **authenticated** bit counts |
| 9   | privateMediaReceipts | Durable dedup of stable media IDs; permits bounded retry  |

### 3.4 Fragmentation: the budget is the frame

A fragment's size limit is the **whole encoded packet**, not its payload. The
Bluetooth ATT ceiling on a single attribute value is 512 bytes: past it Android
truncates the write (it writes without response, which cannot exceed MTU minus 3)
and iOS refuses it, and a truncated frame fails to decode on the far side. Nothing
is reported at either end, so the transfer simply never completes.

Spending the budget on the payload instead is how Airhop shipped 557-byte
fragments: 469 payload bytes, plus a 16-byte header, an 8-byte senderID and a
64-byte signature. Every fragment of every attachment was discarded before any
handler saw it, in both directions. Live voice was unaffected only because a burst
is capped at 210 bytes and never fragments, which is why push-to-talk kept
working while no photo ever arrived.

The budget therefore decomposes as:

| Part                  | Bytes | Notes                                           |
| --------------------- | ----- | ----------------------------------------------- |
| v2 packet header      | 16    |                                                 |
| senderID              | 8     |                                                 |
| recipientID           | 8     | present on a DM fragment; a public one omits it |
| fragment header       | 13    | streamID 8 + index 2 + total 2 + inner type 1   |
| **data per fragment** | 467   | what is left of the 512-byte frame              |

Two rules follow, and both match bitchat:

- **Fragments are unsigned.** Authenticity belongs to the inner packet, which is
  signed and re-verified after reassembly; bitchat sends `signature: nil` and
  neither side's fragment path inspects one. A per-fragment signature would cost
  64 of the 512 bytes for nothing.
- **A fragment carries its parent's recipientID.** Addressed to nobody, bitchat
  classifies a DM's fragments as public: it archives sealed private media in its
  gossip store, re-offers it to third parties, and floods each fragment to every
  neighbour instead of sending it down the directed path.

bitchat derives 469 data bytes from the same 512-byte budget with a smaller
header. Being two bytes under it is harmless: the chunk size is a sender-side
choice, and the receiver reassembles by index without needing to agree on it.

### 3.5 Nicknames are canonicalized, not just carried

The nickname in `ANNOUNCE` TLV `0x01` is UTF-8 with a **32-byte** budget, and the
same visible name has more than one valid encoding: "José" is either `U+00E9` or
`U+0065` followed by the combining acute `U+0301`. The two render identically and
compare unequal.

Airhop normalizes to **NFC** on both encode and decode, so everything downstream
of the wire compares one form. Without it, an accented name typed on one platform
and announced from another fails to match: an @-mention never fires, and one
person occupies two rows of a participant list. The failure is silent at both
ends, which is what makes it worth a rule rather than a bug report.

This is a local canonicalization, not a wire change. The packet still carries
whatever bytes the sender chose, peer IDs derive from keys rather than names, and
no signature covers the normalized form, so a peer that normalizes differently or
not at all stays fully interoperable.

Truncation to the budget counts **UTF-8 bytes and drops whole code points**.
Counting UTF-16 units instead is wrong twice over: 32 emoji is 128 bytes, four
times the budget, and a slice can land inside a surrogate pair and emit a lone
half that decodes to a replacement character on the far side.

### 3.6 LEAVE is verified before it is relayed

Every other packet type is relayed first and checked afterwards. That is the
right default: a relay carries traffic for peers whose signing keys it has never
seen, and demanding a key before forwarding would break multi-hop delivery for
exactly the strangers the mesh exists to reach.

`LEAVE` is the exception. It is an eviction instruction rather than content, it
costs nothing to forge for any peer ID in earshot, and forwarding one that has
already been refused spends the room's airtime and carries the attack onward to
any node that checks less strictly. So the signature is checked first, and an
unverifiable leave is dropped outright: not acted on, not relayed.

Two details make that safe rather than merely strict:

- **The key is the pinned one, not the reachable one.** A departure arrives
  precisely when a peer has stopped announcing, so resolving its signing key
  through the reachability window would refuse the genuine ones. Identity
  pinning has no expiry; reachability does. They are different questions. The
  same split governs inbound decryption: a `NOISE_ENCRYPTED` packet resolves its
  session directly rather than through that window, because the packet having
  arrived is the presence the window only estimates.
- **A saved contact's key is the fallback.** After a restart the live registry
  is empty until the next announce, and without this a departure from someone
  already in the address book would be unverifiable for that window.

The cost is a legitimate leave from a peer whose key we hold in neither place.
That is bounded: `LEAVE` rides `ttl 3` while announces flood at `ttl 7` every
15-30 s once connected (4 s while isolated) and on every link-up, so a peer close
enough for their leave to arrive is one whose announce almost certainly already
did. Worst case their row lingers until it ages out, which is what an ungraceful
departure does anyway.

**Sending one has an ordering rule of its own.** Stopping the mesh sends the
leave, then holds the radios up for a short grace (150 ms) before tearing them
down, because taking the transport down first hands the farewell to something
already told to shut. The window is one GATT connection interval's worth of
radio, invisible to the user, and it is the difference between disappearing from
a room at once and lingering in it as a ghost until presence ages out. It is
cancelled if the mesh restarts inside it, and skipped entirely on dispose, so a
panic wipe never waits on a timer.

A verified leave also **retires the sender's Noise session**. A leave is a
deliberate shutdown, so the peer tears their own session down on the way out;
keeping ours would seal the next DM under a session that no longer exists on the
other side, where it is silently discarded but reported as sent. Only an
explicit leave does this. An ordinary link drop keeps the session on purpose,
because resuming one is far cheaper than a fresh handshake and radios drop links
constantly.

### 3.7 Public channel messages

A public message travels under one of two packet types, decided by the channel.
The type is the discriminator, so neither payload carries a marker byte.

| Channel      | Type   | Payload                                             |
| ------------ | ------ | --------------------------------------------------- |
| `#bluetooth` | `0x02` | `text` as UTF-8. Nothing else.                      |
| Any other    | `0x51` | `[chLen u8][channel][idLen u8][msgId][text]`, UTF-8 |

**`#bluetooth` is bitchat's mesh room, so it uses bitchat's type and payload.**
bitchat's BLE mesh has one public room, which its UI labels "bluetooth".
`BLEService.sendMessage` builds the packet with `payload: Data(content.utf8)`,
and `BLEPublicMessageHandler` reads it back with
`String(data: packet.payload, encoding: .utf8)`, taking the whole payload as the
body. Anything wrapped around the text is displayed as part of it.

That channel carries no message ID and needs none: both implementations derive
the same content-stable identifier from sender, timestamp and content
(`bridgeStableID` here, `MeshMessageIdentity.stableID` in bitchat), which is
what `onChannelMsg` keys the bridge channel on and what the Nostr bridge dedupes
against. The payload is decoded strictly, matching bitchat-iOS: invalid UTF-8 is
dropped rather than rendered as replacement characters.

**Every other public channel carries its own type, because bitchat reaches those
channels a different way.** bitchat has the same location channels Airhop does,
at the same geohash precisions, but it publishes them to Nostr relays and never
over Bluetooth: `ChatOutgoingCoordinator` forks on `.mesh` versus `.location`,
and only the first reaches `BLEService`. On the Bluetooth mesh, bitchat has one
public room.

So the Bluetooth copy of a location-channel message is an Airhop-only path, and
a bitchat peer already receives the Nostr copy. Sent under `0x02` it would be
rendered in their mesh room as well, addressed to an audience its author never
chose. Under `0x51` it is a type neither bitchat client interprets.

Unknown does not mean lost. bitchat's type switch logs `case .none` and falls
through to `scheduleRelayIfNeeded`, and `RelayController.decide` receives the
type as booleans that are all false for an unknown one, so it takes the ordinary
broadcast relay path. A named Airhop channel therefore crosses a mesh made of
bitchat phones while staying invisible to their users. Pinned end to end by the
three-node scenario in `services/__tests__/sim/conformance.test.ts`.

Catch-up is preserved by giving the type its own sync bit
([section 5.2](#52-sync-type-bits)); without one, moving these messages off
`0x02` would drop location channels out of gossip sync silently.

## 4. Routing Constants

| Constant                  | Value          | Source                                                               |
| ------------------------- | -------------- | -------------------------------------------------------------------- |
| Default TTL               | `7`            | `TransportConfig.swift`                                              |
| Relay jitter range        | `10–220 ms`    | Random delay before re-broadcast                                     |
| Fragment frame budget     | `512 bytes`    | ATT attribute ceiling: the whole encoded frame, not the payload      |
| Fragment data per frame   | `467 bytes`    | Frame budget minus header, senderID, recipientID and fragment header |
| Max concurrent assemblies | `128`          | In-flight fragment reassembly slots                                  |
| Max payload length        | `10 MiB`       | Declared wire length AND decompressed output                         |
| Dedup LRU size            | `1000 entries` | Seen-packetID cache (16-byte IDs)                                    |
| Dedup expiry window       | `5 minutes`    | PacketID expiry in dedup cache                                       |
| Fanout subset size        | `~⌈sqrt(n)⌉`   | Deterministic fanout, excludes ingress peer                          |
| Voice relay jitter        | `8–25 ms`      | Live voice and fragments (`TransportConfig`)                         |
| Voice relay TTL cap       | `7` / `5`      | Sparse / dense (degree ≥ 6) meshes                                   |
| Voice jitter buffer       | `350 ms`       | Buffered before live playback starts                                 |
| Concurrent voice bursts   | `8`            | Inbound assembly cap per device                                      |

## 5. Gossip Sync Constants

> **iOS vs Android divergence:** bitchat-iOS and bitchat-android have different default values for these constants. Airhop uses bitchat-iOS values as canonical unless noted.

| Constant                        | Airhop / iOS                                          | bitchat-Android                    | Notes                                          |
| ------------------------------- | ----------------------------------------------------- | ---------------------------------- | ---------------------------------------------- |
| Sync interval                   | `15 seconds`                                          | `30 seconds`                       | How often REQUEST_SYNC is broadcast            |
| Triggered sync delay            | `5 seconds`                                           | `5 seconds`                        | After first announce from new direct peer      |
| Gossip cache size               | `1000 packets`                                        | `100 packets`                      | Rolling seen-packet set for GCS                |
| GCS filter false positive rate  | `1%` (`targetFpr = 0.01`)                             | `1%` (configurable 0.1%–5%)        | Same default; P = ceil(log2(1/fpr)) = 7        |
| GCS hash modulus M              | `count × 2^P`                                         | configurable                       | Gives FPR ≈ 1/2^P per element; u32 on wire     |
| GCS filter size budget          | `400 bytes`                                           | `128–1024 bytes` (default 256)     | `gcsMaxBytes` in `GossipSyncManager`           |
| GCS hash function               | `SHA-256(packetID)[0:8]` as u63 BE (sign bit cleared) | `SHA-256(packetID)[0:8]` as u63 BE | Not SipHash; both implementations use SHA-256  |
| Packet ID for GCS               | `SHA-256(type\|senderID\|timestamp\|payload)[0:16]`   | same                               | 128-bit deterministic ID                       |
| Sync scope                      | local only (ttl 0)                                    | local only (ttl 0)                 | REQUEST_SYNC **and every response** ride ttl 0 |
| Response rate limit             | `8 per 30 s per peer`                                 | same                               | `responseRateLimitMaxResponses`                |
| Candidate max age (ANNOUNCE)    | `60 s`                                                | `60 s`                             | Consensus rule in android `sync.md`            |
| Candidate max age (CHANNEL_MSG) | `900 s`                                               | n/a                                | `publicMessageMaxAgeSeconds`                   |
| Candidate max age (BOARD_POST)  | `7 days`                                              | n/a                                | Backstop only; the board store owns expiry     |
| Candidate max age (GROUP_MSG)   | `900 s`                                               | n/a                                | Same window as public messages                 |

### 5.1 Solicited responses and the freshness window

Every packet is held to a **±2 minute** timestamp window at ingress, and is neither relayed nor acted on outside it. Gossip sync exists to replay old packets, so it needs an exemption, and the exemption is what makes the window possible at all.

- A response is sent with **`IS_RSR` set and `ttl = 0`**. Both fields are normalised out of the signing preimage, so retagging a stored packet leaves its original signature intact.
- A receiver skips the window **only** when the packet claims `IS_RSR` (or is a legacy `ttl = 0` response) **and** arrives from a peer it has an outstanding `REQUEST_SYNC` to, inside a 30 s response window. The flag alone is a sender's claim; the pending request is the receiver's own record.
- This is why requests are unicast. A broadcast request has no peer to register against, so nothing it draws back can be attributed.

**`sinceTimestamp` (TLV `0x05`)** is a coverage disclaimer, not a request boundary. It is sent **only when the filter could not cover everything held** (the store exceeded the cap, or the encoder trimmed the tail to fit 400 bytes), and names the oldest packet the filter reaches. Candidates are ordered newest-first so the covered set is a contiguous newest-prefix and the cursor is exact. Sending it unconditionally would tell every peer to withhold anything older than the requester's oldest packet, which for a device that just joined is precisely the history it turned up to collect.

**`fragmentIdFilter` (TLV `0x06`)** is not implemented. Airhop neither emits nor reads it. It narrows a request to specific stalled fragment streams; without it a stalled reassembly recovers through the ordinary 15-second round instead. A peer that sends one receives a normal full response, so the omission is compatible in both directions.

### 5.2 Sync type bits

A request carries a `SyncTypeFlags` bitfield naming the types it wants, and a responder answers only with those. The field is a little-endian integer inside a length-prefixed TLV, 1 to 8 bytes with trailing zero bytes trimmed, and a bit that maps to no known type is ignored. That makes the set extensible in both directions: a peer setting a bit we do not implement still gets a valid response covering the types we do.

| Bit  | Type                 | Airhop | bitchat |
| ---- | -------------------- | ------ | ------- |
| `0`  | `ANNOUNCE`           | Yes    | Yes     |
| `1`  | `CHANNEL_MSG`        | Yes    | Yes     |
| `8`  | `BOARD_POST`         | Yes    | Yes     |
| `9`  | `PREKEY_BUNDLE`      | No     | Yes     |
| `10` | `GROUP_MESSAGE`      | Yes    | Yes     |
| `11` | `CHANNEL_MSG_AIRHOP` | Yes    | n/a     |

**Bit 11 is Airhop-only and safe by the bitfield's own rules.** bitchat's
`SyncTypeFlags(rawValue:)` masks off every bit that maps to no known type, so a
request carrying it is answered with the types bitchat does know, and bitchat
never sets it. Named public channels need their own bit because they no longer
ride `0x02`; without one they would have no catch-up at all.

Every other type is deliberately absent from both implementations. Courier envelopes are directed deposits and must not spread by gossip; ping, pong and gateway carriers are ephemeral and would replay as unanswerable echoes; live voice is only useful in the moment and receivers drop stale frames anyway; rotating-ID presence is valid only inside its epoch, and syncing it would let a device that was never in radio range collect presence it could not otherwise observe.

**Bit 9 is the one gap.** Airhop distributes its own prekey bundle by flooding it to each new link, and accepts and verifies bundles that reach it that way, but it does not reconcile them through sync. The effect is narrow: a device that arrives after a bundle has already flooded cannot pull it from a peer that still holds one, so a courier message it seals to that owner falls back to the owner's long-lived static key instead of a one-time prekey. The message is still delivered and still encrypted; what is lost is forward secrecy for that envelope.

## 6. Store-and-Forward (Courier) Constants

| Constant                          | Value          | Notes                                                          |
| --------------------------------- | -------------- | -------------------------------------------------------------- |
| Courier pool size                 | `40 envelopes` | Max carried per device                                         |
| Verified-tier sub-cap             | `20 envelopes` | Verified mail cannot crowd out favorites                       |
| Envelope TTL                      | `24 hours`     | Stamped by the sender, dropped after                           |
| Expiry slack accepted             | `1 hour`       | Clock skew only; longer expiries rejected                      |
| Per-envelope size cap             | `16 KiB`       | Ciphertext ceiling; the plaintext below caps content far lower |
| Per-peer deposit quota (favorite) | `5 envelopes`  | Trust tier: favorite                                           |
| Per-peer deposit quota (verified) | `2 envelopes`  | Trust tier: verified/known                                     |

### What the envelope carries

The sealed plaintext is a **typed Noise payload**, not raw text, and this is a
compatibility requirement rather than a preference: bitchat refuses any courier
envelope whose plaintext is not a private message, so a raw-text envelope is
carried by the mesh and then dropped by its recipient.

```
plaintext = 0x01 || PrivateMessagePacket
PrivateMessagePacket = 0x00 || len(messageID) || messageID
                       0x01 || len(content)   || content
```

`0x01` is `NoisePayloadType.privateMessage`. Both TLV lengths are one byte, so
**messageID and content are each capped at 255 bytes** (UTF-8 bytes, not
characters) on all three implementations, and all three return nothing rather
than truncating. A message too long to encode has no courier representation
anywhere and stays in the sender's outbox instead.

The message ID is what makes the rest work. Spray-and-wait deliberately puts
several copies on the mesh, each resealed by its carrier, so no envelope-derived
identity can collapse them; the recipient dedupes on the sender's ID, and can
acknowledge the message because it has one to name.

`courier-plaintext.test.ts` pins these bytes.

A carrier judges an envelope by its own limits, not the sender's. An expiry
beyond `TTL + slack` is refused outright rather than clamped, so a sender that
stamps longer does not get longer carriage, it gets no carriage at all.

| Constant                 | Value                                                                                   | Notes                                     |
| ------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------- |
| Recipient tag derivation | HMAC-SHA256(key=noiseStaticKey, msg=`"bitchat-courier-tag-v1"` \|\| epochDay_BE4)[0:16] | epochDay = floor(unixSec/86400) as u32 BE |

Every constant above is pinned in machine-readable form in
[`courier-test-vectors.json`](courier-test-vectors.json), so a second
implementation can be written against this section without reading Airhop's
source. The vectors are not decoration: `courier-vectors.test.ts` reads its
expected values out of that file, so a drift between the two fails CI rather
than shipping a spec that quietly disagrees with the code.

> **The courier tag is NOT unlinkable, and this is inherited from bitchat rather than chosen.**
> The HMAC key is the recipient's **public** Noise static key, which every announce broadcasts in the clear. Anyone who has heard one announce can therefore compute that peer's tags for any day, past or future, and follow their mail across days. bitchat documents the same flaw in its own implementation, and notes that its whitepaper's claim that couriers cannot link mail across days does not hold.
>
> Airhop keeps the derivation byte-for-byte because changing it unilaterally breaks courier interop with bitchat for no gain, since every carrier on both sides would have to change together. Fixing it means a v2 tag keyed on a shared secret, agreed across implementations. Until then, do not describe courier mail as unlinkable.

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
| Nostr DM encryption           | bitchat `nip44-v2`, see below                  |

### 7.1 The Nostr DM construction is NOT the published NIP-44

bitchat labels its relay-DM encryption `nip44-v2`, and the name is misleading: it is a bitchat-specific construction, not the registered [NIP-44](https://github.com/nostr-protocol/nips/blob/master/44.md). The differences are load-bearing, not cosmetic:

|              | Published NIP-44 v2                        | bitchat `nip44-v2` (and Airhop)                |
| ------------ | ------------------------------------------ | ---------------------------------------------- |
| Cipher       | ChaCha20 + HMAC-SHA256                     | XChaCha20-Poly1305 (AEAD, 24-byte nonce)       |
| Key schedule | HKDF extract then expand, per-message salt | Single-step HKDF, `info = "nip44-v2"`, no salt |
| ECDH output  | x-coordinate only                          | COMPRESSED point, 33 bytes                     |
| Padding      | Padded to a power-of-two bucket            | None                                           |
| Framing      | base64, version byte inside the payload    | `"v2:"` prefix plus base64url                  |

**Airhop implements bitchat's construction deliberately, and must keep doing so.** The Nostr event signature covers the encrypted content, so byte-identical output is the whole of DM interoperability: a real NIP-44 payload is not something a bitchat client can open, and vice versa. The implementation and its reasoning are in [`src/core/nostr/bitchat-nostr-crypto.ts`](../../src/core/nostr/bitchat-nostr-crypto.ts).

The envelope around it **is** NIP-17-shaped: kinds 13, 14 and 1059 in section 8 carry their standard meanings, and the gift-wrap layering is the one NIP-17 describes. Only the encryption inside each layer diverges. So "NIP-17 gift-wrap" elsewhere in these docs is accurate about the structure and should be read as excluding the cipher.

bitchat reached the same conclusion about its own docs and has relabelled them ([#1437](https://github.com/permissionlesstech/bitchat/pull/1437), split and landed as #1480). Recorded here for the same reason: an implementer who reads "NIP-44" and reaches for a standard library produces DMs that no bitchat or Airhop peer can read, and the failure is silent at both ends.

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
| Fragment frame size   | `≤512` bytes              | `≤512` bytes              | `≤512` bytes              | ✅ Yes       |
| Fragment signed       | no                        | no                        | no                        | ✅ Yes       |
| Peer ID format        | SHA-256 slice 16          | SHA-256 slice 16          | SHA-256 slice 16          | ✅ Yes       |
| Noise XX cipher suite | `25519_ChaChaPoly_SHA256` | `25519_ChaChaPoly_SHA256` | `25519_ChaChaPoly_SHA256` | ✅ Identical |
| Packet types `0x50+`  | Airhop extensions         | Relayed, not interpreted  | Relayed, not interpreted  | ✅ Safe      |

> ✅ **Crypto note (corrected):** all three clients use `Noise_XX_25519_ChaChaPoly_SHA256`. An earlier version of this doc claimed bitchat-Android had diverged to AES-256-GCM; that was incorrect. Its vendored noise-java library contains AES-GCM cipher classes, but the only protocol name ever instantiated is ChaChaPoly, so those classes are never selected. There is no divergence and no platform to choose between.
