---
description: >
  Reference for the bitchat v2 binary wire format. Read this before touching
  src/core/mesh/packet-codec.ts, the BLE native modules, or any code that
  constructs or parses packets. A one-byte mistake silently breaks
  interoperability with every bitchat iOS and Android node on the mesh.
---

# bitchat Wire Format

Source of truth: `bitchat/ios/localPackages/BitFoundation/Sources/BitFoundation/BinaryProtocol.swift` and the Android equivalent `BinaryProtocol.kt`. The Airhop implementation is in `src/core/mesh/packet-codec.ts`.

## Fixed Header (v2, 16 bytes)

Every packet starts with this exact layout. Field order is non-negotiable.

Two header versions exist and both must be **decoded**: v1 is 14 bytes with a `u16` payload length and no route section; v2 is 16 bytes with a `u32` length. Airhop **emits v2 for everything** (bitchat decodes v2 for every type), but bitchat still emits v1 for its small broadcasts such as announce and leave, so a v1 decoder path is required. Read the version byte, never assume.

| Offset | Size | Type   | Field         | Notes                                       |
| ------ | ---- | ------ | ------------- | ------------------------------------------- |
| 0      | 1    | u8     | version       | `2` on send; accept `1` and `2` on receive  |
| 1      | 1    | u8     | type          | See packet type table below                 |
| 2      | 1    | u8     | ttl           | Default `7`; must be set to `0` for signing |
| 3-10   | 8    | u64-BE | timestamp     | Unix **milliseconds**, big-endian           |
| 11     | 1    | u8     | flags         | See flag bits below                         |
| 12-15  | 4    | u32-BE | payloadLength | Length of the payload section only          |

## Variable Sections (in this order after the header)

```
senderID     8 bytes     always present
recipientID  8 bytes     only when HAS_RECIPIENT flag is set
route        variable    only when HAS_ROUTE flag is set: [count u8][hop1 8B]...[hopN 8B]
payload      N bytes     payloadLength bytes
signature    64 bytes    only when HAS_SIGNATURE flag is set (Ed25519)
```

Broadcast packets omit the `recipientID` field entirely. `HAS_RECIPIENT` is cleared. Decoders set `recipientID` to all-zeros when the flag is absent.

## Flag Bits

| Bit | Hex    | Name          | Meaning                                       |
| --- | ------ | ------------- | --------------------------------------------- |
| 0   | `0x01` | HAS_RECIPIENT | `recipientID` field is present (unicast)      |
| 1   | `0x02` | HAS_SIGNATURE | 64-byte Ed25519 signature is appended         |
| 2   | `0x04` | COMPRESSED    | Raw-DEFLATE payload, preceded by originalSize |
| 3   | `0x08` | HAS_ROUTE     | Source-route hop list is present              |
| 4   | `0x10` | IS_RSR        | This is a solicited sync response             |

## Signing Rule

To sign or verify a packet:

1. Encode the full packet with `ttl = 0`, `IS_RSR = false`, `HAS_SIGNATURE = 0` (omit the signature field).
2. Ed25519-sign or verify the resulting bytes.

Clearing TTL lets relays decrement it without invalidating the signature. This matches `toBinaryDataForSigning()` in bitchat iOS and Android.

## Packet ID (Deduplication Key)

```
PacketID = SHA-256(type[1] | senderID[8] | timestamp_u64_BE[8] | payload)[0:16]
```

There is no nonce field. Deduplication is content-addressed. See `computePacketId` in `packet-codec.ts` and `PacketIdUtil.swift` / `PacketIdUtil.kt`.

## Packet Type Registry

bitchat allocates forward and has reached `0x2C`. `0x29` is defined by both
projects; `0x2A` and `0x2B` are reserved upstream for courier spray-ack, and
`0x2C` is `announceV2`. The range just above `0x29` is not free.

Airhop extensions therefore live at `0x50` and up. Read `MessageType.swift`
before claiming a value, and keep clear of bitchat's frontier by a margin;
`conformance.test.ts` parses their enum and fails if the gap closes to 16.

A bitchat node never interprets a type it does not know, but it does relay it,
so an extension still crosses a mesh of bitchat phones. Relaying is not the
risk; two projects assigning meaning to the same number is.

| Name                 | Hex    | Direction         | Description                                                          |
| -------------------- | ------ | ----------------- | -------------------------------------------------------------------- |
| `ANNOUNCE`           | `0x01` | Broadcast         | Signed presence heartbeat; TLV payload                               |
| `CHANNEL_MSG`        | `0x02` | Broadcast         | Public channel message                                               |
| `LEAVE`              | `0x03` | Broadcast         | Peer departing                                                       |
| `COURIER_ENV`        | `0x04` | Broadcast         | Store-and-forward sealed envelope                                    |
| `NOISE_HANDSHAKE`    | `0x10` | Unicast           | Noise XX handshake message                                           |
| `NOISE_ENCRYPTED`    | `0x11` | Unicast           | Post-handshake payload (DM, receipts, group state)                   |
| `DR_ENCRYPTED`       | `0x12` | Unicast           | Double Ratchet DM (Airhop extension)                                 |
| `FRAGMENT`           | `0x20` | Broadcast/Unicast | BLE fragment of a larger message                                     |
| `REQUEST_SYNC`       | `0x21` | Broadcast         | GCS gossip request; TTL=2 (local mesh only)                          |
| `FILE_TRANSFER`      | `0x22` | Broadcast/Unicast | Binary file, audio, or image payload; 1 MiB cap                      |
| `BOARD_POST`         | `0x23` | Broadcast         | Signed bulletin-board post or tombstone                              |
| `PREKEY_BUNDLE`      | `0x24` | Broadcast         | Signed batch of one-time public prekeys                              |
| `GROUP_MESSAGE`      | `0x25` | Broadcast         | Group-encrypted message (groupID + epoch, ChaChaPoly)                |
| `PING`               | `0x26` | Unicast           | Directed echo request (nonce + origin TTL)                           |
| `PONG`               | `0x27` | Unicast           | Directed echo reply (echoed nonce)                                   |
| `NOSTR_CARRIER`      | `0x28` | Broadcast/Unicast | Gateway-ferried signed Nostr event                                   |
| `VOICE_FRAME`        | `0x29` | Broadcast         | PTT audio burst; reserved, not yet sent (Airhop ext.)                |
| `CHANNEL_ENC`        | `0x50` | Broadcast         | Private channel, XChaCha20-Poly1305 (Airhop extension)               |
| `CHANNEL_MSG_AIRHOP` | `0x51` | Broadcast         | Named Airhop public channel, i.e. a location cell (Airhop extension) |

Two types were specified and then deliberately removed. Do not reintroduce them:

- `0x30 VIDEO_FRAME`: was specified over WiFi Aware / MultipeerConnectivity, which are different protocols that cannot interoperate, so iOS-to-Android video was never achievable. Video ships as a file over `FILE_TRANSFER` instead.
- `0x40 CASHU_TOKEN`: ecash travels as text inside an ordinary encrypted DM and is detected by `findTokensInText()`. A dedicated type would be a second path to keep in sync for no gain.

## Public Channel Message Payloads

A public message takes one of two packet types. The type decides the payload, so
neither carries a marker byte and neither decoder needs a heuristic.

| Channel      | Type   | Payload                                      |
| ------------ | ------ | -------------------------------------------- |
| `#bluetooth` | `0x02` | The message text as UTF-8, and nothing else  |
| Any other    | `0x51` | `[chLen u8][channel][idLen u8][msgId][text]` |

bitchat's mesh has one public room, which Airhop names `#bluetooth`. Its payload
carries no channel field and no message ID: `BLEService.sendMessage` writes the
message text as UTF-8, and `BLEPublicMessageHandler` reads the whole payload back
as the body. Anything wrapped around the text is displayed as part of it, so that
channel must send and accept the bare form.

No message ID is needed there because both implementations derive the same one
from sender, timestamp and content, in `MeshMessageIdentity.stableID` and
`bridgeStableID` respectively. The payload is decoded strictly: invalid UTF-8 is
dropped rather than rendered as replacement characters, matching bitchat-iOS.

Airhop's other public channels are location cells, which bitchat has no room to
put and no channel field to name. They travel under `CHANNEL_MSG_AIRHOP` instead,
where both bitchat clients treat the type as unknown.

Unknown does not mean lost. bitchat's type switch logs the unknown case and falls
through to `scheduleRelayIfNeeded`, and `RelayController.decide` receives the type
as a set of flags that are all false for an unrecognised value, so the packet
takes the ordinary broadcast relay path. An Airhop-only type therefore crosses a
mesh made of bitchat phones while staying invisible to their users. `DR_ENCRYPTED`
and `CHANNEL_ENC` behave the same way.

Catch-up is preserved by giving `CHANNEL_MSG_AIRHOP` its own gossip-sync bit, 11.
bitchat masks off bits it does not recognise, so setting it costs nothing in
either direction. See PROTOCOLS section 5.2.

Implementation: `channelPacketType`, `encodeMeshPublicPayload`,
`decodeMeshPublicPayload`, `encodeAirhopChannelPayload` and
`decodeAirhopChannelPayload` in `src/core/router/message-router.ts`. Byte layout
is pinned by `src/core/mesh/__tests__/bitchat-payload-vectors.test.ts`, and the
end-to-end behaviour by the three-node scenario in
`src/services/__tests__/sim/conformance.test.ts`.

## ANNOUNCE TLV Payload

The `ANNOUNCE` packet payload is TLV-encoded. TLV format: `[type u8][length u8][value N bytes]`.

| Tag    | Field           | Size           | Notes                           |
| ------ | --------------- | -------------- | ------------------------------- |
| `0x01` | nickname        | up to 32 bytes | UTF-8                           |
| `0x02` | Noise pub key   | 32 bytes       | X25519 static public key        |
| `0x03` | signing pub key | 32 bytes       | Ed25519 public key              |
| `0x04` | neighbor IDs    | up to 80 bytes | Optional; up to 10 x 8-byte IDs |

## BLE Identifiers

These must never change without a coordinated protocol version bump.

| Identifier          | Value                                  |
| ------------------- | -------------------------------------- |
| Service UUID        | `F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C` |
| Characteristic UUID | `A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D` |
| Local name prefix   | `bitchat-`                             |
| Protocol version    | `2`                                    |

## Peer ID Derivation

```
peerID = hex(SHA-256(noiseStaticPubKey)).slice(0, 16)
```

16 hex characters representing the first 8 bytes of the hash. Peer ID is derived from the Noise static key, not the Ed25519 signing key.
