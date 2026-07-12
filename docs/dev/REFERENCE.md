# bitchat: Knowledge Transfer Document

**Prepared:** July 2026  
**Scope:** iOS (`bitchat-ios`), Android (`bitchat-android`), Georelays infrastructure  
**Whitepaper version:** 2.0 (July 6, 2026)

## Table of Contents

1. [Project Vision & Core Philosophy](#1-project-vision--core-philosophy)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Transport Layer 1: Bluetooth LE Mesh](#3-transport-layer-1--bluetooth-le-mesh)
4. [Transport Layer 2: Nostr (Internet)](#4-transport-layer-2--nostr-internet)
5. [Identity & Cryptography](#5-identity--cryptography)
6. [Store-and-Forward System](#6-store-and-forward-system)
7. [Channel Types & Routing Logic](#7-channel-types--routing-logic)
8. [Media Support: What Really Works](#8-media-support--what-really-works)
9. [Voice: Current State & Push-to-Talk Design](#9-voice--current-state--push-to-talk-design)
10. [iOS Codebase Walkthrough](#10-ios-codebase-walkthrough)
11. [Android Codebase Walkthrough](#11-android-codebase-walkthrough)
12. [Georelays Infrastructure](#12-georelays-infrastructure)
13. [Cross-Platform Protocol Compatibility](#13-cross-platform-protocol-compatibility)
14. [Distance Limitations](#14-distance-limitations)
15. [Is It Truly Offline?](#15-is-it-truly-offline)
16. [Privacy & Security Model](#16-privacy--security-model)
17. [Current Gaps & Known Limitations](#17-current-gaps--known-limitations)
18. [Roadmap & Future Work](#18-roadmap--future-work)
19. [Technology Stack Summary](#19-technology-stack-summary)

## 1. Project Vision & Core Philosophy

bitchat is a **decentralized, peer-to-peer messaging application** designed for secure, private, censorship-resistant communication that works **with or without the internet**. Its closest cultural reference is IRC, but implemented entirely without servers, accounts, or phone numbers.

### Core Beliefs

- **No accounts.** Identity is a cryptographic key pair stored in the device Keychain; nothing registers anywhere.
- **No central server.** There is no bitchat server. Messages travel device-to-device.
- **No persistent identifiers.** Peers appear under short ephemeral IDs derived per session.
- **Ephemerality by default.** No plaintext message content is ever written to disk. Everything persisted is sealed ciphertext, and all of it is erased by the panic wipe (triple-tap logo).
- **Censorship resistance.** Because there is no infrastructure to take down, the network cannot be "turned off."
- **Emergency use.** Works in protests, natural disasters, remote areas: any situation where internet infrastructure has failed.

The tagline: _"the side-groupchat."_

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          APPLICATION LAYER                      │
│  Public Chat │ Private DMs │ Location Channels │ Voice Notes    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   MessageRouter   │  ← decides which transport
                    └──────┬────────────┘    to use for each message
                           │
          ┌────────────────┴────────────────┐
          │                                 │
 ┌────────▼─────────┐             ┌─────────▼──────────┐
 │  BLE Mesh        │             │  Nostr Transport   │
 │  (Transport 1)   │             │  (Transport 2)     │
 │  - GATT Central  │             │  - NIP-17 gift-wrap│
 │  - GATT Periph.  │             │  - 290+ relays     │
 │  - TTL=7 flood   │             │  - Tor by default  │
 │  - Noise XX E2E  │             │  - Geohash channels│
 └──────────────────┘             └────────────────────┘
          │                                 │
          └──────────── Store & Forward ────┘
                  ┌──────────────────────┐
                  │  Sender Outbox       │  24h, 100 msgs/peer
                  │  Courier System      │  physical carry
                  │  Gossip Sync         │  GCS filter reconcile
                  │  Nostr Mailboxes     │  24h relay lookback
                  └──────────────────────┘
```

### Dual Transport Model

bitchat runs **two fully independent transports in parallel** under a unified `Transport` protocol interface:

| Transport | Medium            | Internet? | Scope           | Encryption                   |
| --------- | ----------------- | --------- | --------------- | ---------------------------- |
| BLE Mesh  | Bluetooth LE 4.0+ | No        | Local multi-hop | Noise XX (forward-secret)    |
| Nostr     | TCP/WebSocket     | Yes       | Global          | NIP-17 gift-wrap (XChaCha20) |

The `MessageRouter` picks the best option per message, prefers BLE when available, falls back to Nostr, and engages the courier system when neither can deliver promptly.

## 3. Transport Layer 1: Bluetooth LE Mesh

### 3.1 How BLE Mesh Is Built

Every device operates as **both a GATT Central and a GATT Peripheral simultaneously**. This dual-role design means:

- As a **central**: it scans for and connects to nearby peripherals.
- As a **peripheral**: it advertises itself and accepts connections from nearby centrals.

This is the fundamental trick that enables a mesh; every node is both server and client.

```
Service UUID:  F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C  (mainnet)
               F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5A  (testnet/debug)
Characteristic UUID: A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D
```

No pairing, no Bluetooth bonding, no user prompts; just open GATT writes.

### 3.2 Packet Format

Every BLE packet is a compact binary structure:

```
┌────────┬──────┬─────┬───────────┬───────────┬──────────┬───────────┬──────────────┐
│version │ type │ TTL │ timestamp │ sender ID │ recip ID │  payload  │  signature?  │
│ 1 byte │1 byte│1byte│  8 bytes  │  8 bytes  │  8 bytes │ variable  │  64 bytes    │
└────────┴──────┴─────┴───────────┴───────────┴──────────┴──────────┴──────────────┘
```

- **Version 2** packets may carry an explicit **source route** (array of peer ID hops).
- **Signatures** (Ed25519) exclude the TTL byte so relays can decrement it without invalidating them.
- Packets are **padded** toward uniform sizes to defeat traffic analysis.
- **LZ4 compression** is applied to message payloads before they are sent.

### 3.3 Controlled Flood Routing

Messages propagate through a **deterministic controlled flood** (not pure flooding, not routing tables):

**TTL (Time-To-Live):**

- Packets originate with **TTL = 7** (7 hops maximum).
- Dense graphs (≥ 6 links): broadcast TTL clamped to 5.
- Thin chains (≤ 2 links): relay at full incoming TTL depth.
- Directed traffic (handshakes, private messages): relayed with TTL − 1.

**Deduplication (Seen-Set):**

- LRU cache of **1,000 entries** with **5-minute expiry**.
- Keyed on: sender + timestamp + type + payload digest.
- A scheduled relay is **cancelled** when a duplicate arrives first from another relay.

**Jitter:**

- Relays wait a **random 10–220 ms** (wider in dense graphs) before re-sending.
- This lets duplicate suppression win; the first copy silences retransmits.

**Fanout Subsetting:**

- Broadcast messages go to a **deterministic, message-ID-seeded subset** (~log₂ of degree links) rather than all links.
- Announces, fragments, and sync packets use **full fanout** (all links).
- The ingress link is always excluded (split-horizon rule).
- Directed traffic (handshakes, DMs, courier envelopes) always uses full targeted fanout.

### 3.4 Source Routing

Announcements carry up to **10 direct-neighbor IDs**, giving each node a **shallow topology map** (60 s freshness). When a bidirectional path is confirmed, packets are source-routed along it. If no confirmed path exists, or if a route fails, delivery falls back to flooding.

### 3.5 Fragmentation

Packets exceeding the link MTU are split into **~469-byte fragments**:

- Each fragment carries an 8-byte fragment ID plus index/total header.
- Fragments relay independently through the mesh.
- Reassembly happens at each receiving node (up to **128 concurrent assemblies**, **30 s timeout**, **1 MiB cap**).

### 3.6 Presence & Discovery

- **Signed announcements** propagate multi-hop.
- Announcement cadence: every **4 s when isolated**, backing off to **15–30 s (jittered)** when connected.
- A verified announce retains a peer as _reachable_ for **60 seconds** after last contact.
- Connection scheduling is **RSSI-gated**: only connect when signal strength is strong enough.
- **Duty-cycled scanning** bounds battery drain: when well-connected and no recent traffic, the radio cycles between scan-on and scan-off windows instead of scanning continuously.

### 3.7 Battery Management

The `BLEScanDutyPolicy` controls scanning mode:

- **Continuous scan** when: ≤ 2 connections OR recent traffic present.
- **Duty cycle** when: connected, app active, no recent traffic, and duty cycling is enabled.
- Dense graphs: shorter on-duration, longer off-duration.
- Sparse graphs: longer on-duration.

### 3.8 Android BLE Specifics

The Android implementation (`BluetoothMeshService.kt`, `MeshCore.kt`) uses:

- **BluetoothGattServerManager**: peripheral/server role.
- **BluetoothGattClientManager**: central/client role.
- **FragmentManager**: fragmentation/reassembly.
- **PacketRelayManager**: relay decisions with TTL management.
- Minimum API level **26 (Android 8.0)**.
- Location permission required (Android mandates it for BLE scanning).

## 4. Transport Layer 2: Nostr (Internet)

### 4.1 What Nostr Is

[Nostr](https://nostr.com) is an open protocol for censorship-resistant social networking. It uses WebSocket connections to **relays** (simple servers) and signs all events with cryptographic keys. bitchat uses Nostr as its internet bridge.

### 4.2 How bitchat Uses Nostr

bitchat does **not** use Nostr for social networking. It uses Nostr as a **message transport**:

| Usage               | Event Kind          | Purpose                           |
| ------------------- | ------------------- | --------------------------------- |
| Private DMs         | kind 14 → 13 → 1059 | NIP-17 gift-wrapped DMs           |
| Location channels   | kind 20000          | Ephemeral geohash room messages   |
| Presence heartbeats | kind 20001          | Geohash presence announcements    |
| Courier drops       | kind 1401           | Store-and-forward relay mailboxes |

### 4.3 NIP-17 Gift-Wrap Encryption

Private messages use a 3-layer wrapping scheme:

1. **Rumor** (kind 14): The actual message content, unsigned.
2. **Seal** (kind 13): The rumor encrypted to the recipient's key, signed by the **sender's real key** (authentication).
3. **Gift Wrap** (kind 1059): The seal encrypted under a **throwaway ephemeral key**. The outer layer hides the sender's identity from relay operators.

This means relays learn neither who is talking to whom nor what they are saying.

### 4.4 Tor Integration (iOS)

All Nostr and geodata traffic on iOS routes through a **Tor SOCKS5 proxy** by default (fail-closed):

- Uses **Arti** (Rust implementation of Tor) bundled as an xcframework.
- SOCKS5 on `127.0.0.1:39050`.
- `TorURLSession` wraps all URL sessions; `TorManager` manages lifecycle.
- `NostrRelayManager` and `GeoRelayDirectory` both await Tor readiness before starting.
- **Fail-closed**: the app will not connect at all if Tor hasn't bootstrapped.
- Android does **not** yet have Tor integration.

### 4.5 Relay Network

- **290+ relays** worldwide (as of mid-2026).
- The `georelays` repository tracks and geolocates all bitchat-capable relays.
- The iOS app bundles a `nostr_relays.csv` fallback and fetches live updates from `georelays`.
- The `GeoRelayDirectory` selects the closest relay(s) to a geohash coordinate for location channels.

### 4.6 Geohash Location Channels

Location channels are Nostr channels scoped by [geohash](https://en.wikipedia.org/wiki/Geohash) precision:

| Channel Level | Geohash Length | Coverage               |
| ------------- | -------------- | ---------------------- |
| region        | 2 chars        | Country / large region |
| province      | 4 chars        | State / province       |
| city          | 5 chars        | City                   |
| neighborhood  | 6 chars        | District               |
| block         | 7 chars        | City block             |

Each geohash level gets its own Nostr identity (derived from the base identity + geohash string), and messages are published to the closest geographic relay(s) for that precision level.

Presence heartbeats (kind 20001) are broadcast only to **region, province, and city** precision levels; the app explicitly refuses to broadcast presence at neighborhood/block level for privacy reasons.

## 5. Identity & Cryptography

### 5.1 Key Pairs

Each device holds **two long-term key pairs** in the Keychain:

| Key                 | Algorithm  | Purpose                                                         |
| ------------------- | ---------- | --------------------------------------------------------------- |
| Static identity key | Curve25519 | Noise key agreement; SHA-256 fingerprint = stable peer identity |
| Signing key         | Ed25519    | Packet signatures on the mesh                                   |

These are generated once on first launch and never leave the device (except through secure key exchange).

### 5.2 Noise Protocol XX Pattern

For **live BLE sessions**, bitchat runs the [Noise Protocol Framework](https://noiseprotocol.org) `XX` pattern:

- **3-message handshake**: `e → e,ee,s,es → s,se`
- **Mutual authentication**: both sides verify each other's static keys.
- **Identity hiding**: identities are only revealed after initial key exchange.
- **Forward secrecy**: session keys are ephemeral; compromise of static keys does not expose past sessions.
- **Cipher suite**: Curve25519 / ChaCha20-Poly1305 / SHA-256.

After handshake, all private payloads (messages, delivery acks, read receipts) ride inside the session as typed ciphertext. Intermediate relay nodes see only opaque `noiseEncrypted` packets.

### 5.3 Noise X (Courier / Offline Sealing)

For offline courier envelopes, the **Noise X** (one-way) pattern is used:

- Sealed to the recipient's **static** key.
- Sender identity is authenticated inside the ciphertext.
- **No forward secrecy**: compromise of the recipient's static key exposes undelivered sealed mail.
- This is explicitly acknowledged as the main cryptographic trade-off of the offline path.

### 5.4 Peer Identity & Favorites

- On the mesh, peers appear as **short 8-byte (16 hex char) ephemeral IDs** per session.
- **Favoriting** a peer pins their full Noise public key (64-hex fingerprint), making identity survive across sessions.
- Mutual favorites also exchange **Nostr public keys**, enabling the internet delivery path.
- **QR code verification** optionally binds a human nickname to a cryptographic fingerprint in person.

### 5.5 Prekey Store (Partial Implementation)

The iOS codebase contains `PrekeyBundleStore` and `LocalPrekeyStore`; one-time prekey bundles that would enable forward-secret sealed courier mail. This is noted as future work in the whitepaper; the infrastructure exists but is not yet the default path.

### 5.6 Android Crypto

Android uses:

- **X25519 key exchange** + **AES-256-GCM** for private messages.
- The `EncryptionService.kt` provides identity fingerprint derivation and crypto operations.
- Peer ID is the **first 16 hex characters** of the Noise identity fingerprint (same as iOS).

## 6. Store-and-Forward System

This is one of bitchat's most sophisticated components; it solves the "recipient is offline" problem with four layered mechanisms. **All persisted state is wiped by panic mode.**

### 6.1 Sender Outbox

```
100 messages per peer, 24-hour TTL, 8 retry attempts max
Persisted as AES-ChaChaPoly ciphertext (key in Keychain; plaintext never touches disk)
```

- Private messages without a prompt route are retained per peer.
- Re-sent on reconnect events until a delivery or read ack clears them.
- On expiry or retry cap exhaustion: the UI surfaces a visible failure.

### 6.2 Courier System (Physical Carry)

The most novel mechanism. When no transport can deliver:

1. The message is **sealed** (Noise X) into a **courier envelope**.
2. The envelope is handed to up to **3 connected peers** who may physically encounter the recipient.

**Opaque addressing:** The only routing information is a **16-byte rotating recipient tag**: an HMAC of the recipient's static key and the UTC day. Only parties who already know the recipient's key can compute this tag. Couriers see nothing about sender, recipient, or content. Tags rotate daily, so they cannot be correlated across days.

**Trust tiers:**

- Mutual favorites: deposit up to **5 envelopes**.
- Verified strangers (signature-verified announce): deposit up to **2 envelopes**.
- Pool size: 40 total slots (20 reserved for verified-tier, so favorites can never crowd out stranger mail).
- Envelope cap: **16 KiB**, **24-hour lifetime**.

**Spray-and-Wait:**

- Each envelope carries a **copy budget** (initially 4, max 8).
- When a courier meets another eligible courier, it hands over **half its remaining budget**.
- Mail diffuses through a moving crowd rather than riding one person.

**Handover:**

- Direct announce from the recipient → deliver over live link and remove envelope.
- Relayed announce from the recipient → flood a directed copy toward them (throttled to one attempt per envelope per 10 minutes), retain the carried original.

**Bridge Courier (Internet Extension):**

- When a live transport fails, the `MessageRouter` can also deposit a **sealed copy on Nostr relays** (kind 1401, `courierDrop`) as a parallel internet courier path.
- Tagged with the same rotating recipient tag.
- Receiver deduplicates by message ID; redundant copies are harmless.

### 6.3 Gossip Sync (Public History)

- Public broadcast messages are **cached (1,000 packets)** and reconciled between peers every **~15 seconds**.
- Uses **Golomb-Coded Set (GCS) filters** (like Bitcoin's compact block filters): each side advertises what it holds, the other returns what is missing.
- Messages stay sync-able for **6 hours** (fragments and file transfers: 15 minutes).
- Cache persists to disk so a device that walks between two partitions, or relaunches later, serves the room's recent history.

### 6.4 Nostr Mailboxes

- Gift-wrapped private messages rest on Nostr relays indefinitely (subject to relay policy).
- On reconnect, clients **re-subscribe with a 24-hour lookback**, covering the both-devices-offline case.
- This is the fallback for mutual favorites when the BLE mesh and courier system both fail.

## 7. Channel Types & Routing Logic

### 7.1 Three Conversation Types in the App

| Conversation                        | Transport             | Internet? | Scope                                 |
| ----------------------------------- | --------------------- | --------- | ------------------------------------- |
| `mesh #bluetooth`                   | BLE mesh              | No        | All nearby devices in multi-hop range |
| Location channels (`#dr5rsj7` etc.) | Nostr                 | Yes       | Geographic area by geohash            |
| Direct Messages                     | BLE → Nostr → Courier | Optional  | One specific peer                     |

### 7.2 DM Routing Priority

The `MessageRouter` selects transport in this order:

1. **BLE first**: if peer is reachable and a Noise session can deliver promptly.
2. **Nostr fallback**: if peer is a mutual favorite and has a Nostr public key.
3. **Courier + Bridge**: if neither can deliver: seal into courier envelope for physical carry **and** deposit on Nostr relay.

`canDeliverPromptly()` on a transport checks active connection state plus Noise session establishment, not just BLE reachability.

### 7.3 Group / Channel Chats

bitchat supports IRC-style channel commands:

- `/j #channel`: join or create a channel (public, visible to all mesh peers).
- `/pass [password]`: set channel password (owner only).
- `/transfer @name`: transfer channel ownership.
- `/save`: toggle message retention (owner only).
- Channels are scoped to the mesh; everyone within BLE multi-hop range who has joined sees them.
- Optional password protection (AES-256-GCM key derived from password).

### 7.4 Gateway Mode

A "gateway" device can bridge the BLE mesh to the Nostr internet:

- The `GatewayService` on iOS and the `TransportBridgeService` on Android act as bridges.
- A gateway carries a `nostrCarrier` capability bit in its announce.
- Devices can deposit `nostrCarrier` packets (type `0x28`) into the gateway's BLE uplink for relay to the internet, enabling mesh-only devices to reach the Nostr network.

## 8. Media Support: What Really Works

### 8.1 Images

**Status: Fully supported over BLE mesh and partially over Nostr.**

- Supported formats: JPEG, PNG, GIF, WebP.
- Images are sent as `fileTransfer` packets (type `0x22`), fragmented into ~469-byte chunks.
- **Hard size limit: 1 MiB** (enforced by `FileTransferLimits.isValidPayload()`).
- Explicit user accept before anything touches disk (no auto-download).
- Magic byte validation: declared MIME type must match actual file header bytes.
- Sender authentication required: files from unverified/unknown peers are dropped.
- **Gossip sync**: image transfer progress tracked and sync-able for 15 minutes.
- **Couriers carry text only** (16 KiB courier envelope cap); images cannot be physically relayed.
- Nostr path: media does not ride Nostr today (confirmed in push-to-talk design doc).

### 8.2 Audio / Voice Notes

**Status: Fully supported over BLE mesh.**

- Android: `VoiceRecorder.kt` records AAC-LC (16 kHz mono, 20 kbps) to `.m4a` files.
- iOS: `VoiceRecorder` uses AVAudioRecorder (AAC-LC, 16 kHz mono, 16 kbps).
- Sent as `fileTransfer` (type `0x22`) after recording is complete; the whole file ships.
- Supported MIME types: `audio/mp4`, `audio/m4a`, `audio/aac`, `audio/mpeg` (mp3), `audio/wav`, `audio/ogg`.
- PDFs and arbitrary binary (`application/octet-stream`) are also allowed.
- Subject to the **1 MiB limit**; long recordings will be rejected.
- **Geohash channels**: media cannot be sent (confirmed by `canSendMediaInCurrentContext` policy).

### 8.3 Video

**Status: Not explicitly supported.**

- No video MIME type appears in `MimeType.swift` or `MimeType.kt`.
- `mp4` audio is supported but not video.
- This is a gap. No video transmission mechanism exists.

### 8.4 Push-to-Talk / Live Voice Streaming

**Status: Designed, not yet shipped (iOS only, in design phase).**

The `docs/PUSH-TO-TALK-DESIGN.md` describes a complete PTT design:

| Scenario                   | Delivery                                                    |
| -------------------------- | ----------------------------------------------------------- |
| DM, peer connected on mesh | Live stream (Noise-encrypted frames) + finalized voice note |
| DM, peer via Nostr only    | Voice note only (no live)                                   |
| Public mesh chat           | Live broadcast stream (signed) + voice note                 |
| Geohash (Nostr) channels   | Not available                                               |

**Wire protocol designed:**

- New packet type `0x29` (`voiceFrame`) for public broadcasts.
- New `NoisePayloadType.voiceFrame = 0x08` for DMs.
- AAC-LC at 16 kHz, ~2 KB/s, ~1 frame/packet, ~15.6 pkt/s.
- Each burst shares an 8-byte random `burstID`; sequence numbers allow gap detection.
- Jitter buffer: 350 ms before playback starts.
- **No delivery acks, no retransmit** for individual frames (live audio; reliability is the fallback voice note).
- Bandwidth math: BLE mesh moves ~15 KB/s per link; voice needs ~2 KB/s; fits with margin.

**This feature does not yet exist in shipping code.** VoiceRecorder and VoiceVisualizer exist on both platforms, but live streaming is not implemented.

### 8.5 Video Calling

**Status: Not implemented. Not planned.**

There is no design document, no code, and no packet type for video calling. The BLE mesh's ~15 KB/s per link capacity makes real-time video impractical. This is an architectural constraint, not just a roadmap gap.

## 9. Voice: Current State & Push-to-Talk Design

### Current Reality

- Both iOS and Android support **voice note recording and playback**.
- Hold mic button → records AAC `.m4a` → sends as file transfer on release.
- The receiver hears the audio only **after the entire file arrives**.
- This works on BLE mesh. It does **not** work on Nostr or geohash channels.

### PTT Design (iOS, Not Yet Shipped)

The full design exists in `bitchat/ios/docs/PUSH-TO-TALK-DESIGN.md`. Key elements:

- `AVAudioEngine` input tap → `PTTInputResampler` → `PTTFrameEncoder` → packetizer → BLE.
- Simultaneously writes to `.m4a` for finalized note delivery (no remux needed).
- 8 concurrent receive assemblies max, 256 KB per burst cap, 30 s stale cleanup.
- Flood protection: drop inbound frames beyond ~2× realtime per sender.
- Playback: `VoiceBurstAssembler` feeding `PTTBurstPlayer` with 350 ms jitter buffer.

## 10. iOS Codebase Walkthrough

### Directory Structure

```
bitchat/ios/bitchat/
├── App/               # AppRuntime (composition root), ConversationStore, LocationChannelsModel
├── Features/
│   ├── media/         # ImageUtils.swift
│   └── voice/         # (PTT design docs only, not yet implemented)
├── Identity/          # IdentityModels.swift, SecureIdentityStateManager.swift
├── Models/            # BitchatMessage, BitchatPeer, NoisePayload, ReadReceipt
├── Noise/             # NoiseProtocol, NoiseSession, NoiseSessionManager, NoiseEncryptionService
├── Nostr/             # NIP-17, GeoRelayDirectory, NostrIdentity, NostrRelayManager
├── Protocols/         # (shared protocol definitions)
├── Services/
│   ├── BLE/           # ~45 files - the BLE mesh engine
│   ├── Board/         # Bulletin board feature
│   ├── Courier/       # CourierStore, MessageOutboxStore, StoreAndForwardMetrics
│   ├── Gateway/       # BridgeService, GatewayService (mesh→Nostr bridge)
│   ├── Groups/        # GroupProtocol, GroupStore
│   ├── Prekeys/       # PrekeyBundleStore, LocalPrekeyStore
│   ├── MessageRouter.swift   # Central routing logic
│   ├── NostrTransport.swift  # Nostr as a Transport impl
│   ├── Transport.swift       # Transport protocol + events
│   └── TransportConfig.swift # All tuning constants
├── Sync/              # GCSFilter, GossipSyncManager, RequestSyncManager
├── ViewModels/        # ChatViewModel (legacy hub), ChatViewModelBootstrapper
└── Views/             # SwiftUI views
```

### Key Classes

| Class/File                     | Role                                                          |
| ------------------------------ | ------------------------------------------------------------- |
| `AppRuntime.swift`             | Composition root - wires all services on launch               |
| `BLEService.swift`             | CoreBluetooth dual-role mesh engine (central + peripheral)    |
| `MessageRouter.swift`          | Routes messages across transports + outbox + courier          |
| `NostrTransport.swift`         | Nostr as a `Transport` protocol implementation                |
| `NostrRelayManager.swift`      | Manages WebSocket connections to Nostr relays                 |
| `GeoRelayDirectory.swift`      | Geohash → nearest relay lookup; fetches `nostr_relays.csv`    |
| `GossipSyncManager.swift`      | GCS-based public message history reconciliation               |
| `CourierStore.swift`           | Holds sealed courier envelopes for third-party peers          |
| `MessageOutboxStore.swift`     | Per-peer sent message queue (24h, 100/peer)                   |
| `NoiseSession.swift`           | Per-peer Noise XX state machine                               |
| `NoiseEncryptionService.swift` | Crypto operations: handshake, encrypt/decrypt, key management |
| `NostrProtocol.swift`          | NIP-17/NIP-59 gift-wrap implementation                        |
| `GeohashPresenceService.swift` | Broadcasts kind 20001 presence to geohash channels            |
| `BLEConnectionScheduler.swift` | RSSI-gated connection candidate management                    |
| `BLEScanDutyPolicy.swift`      | Adaptive scan duty cycling for battery                        |
| `BLEFanoutSelector.swift`      | Deterministic broadcast subsetting                            |
| `BLEFragmentHandler.swift`     | Fragment assembly and re-injection                            |
| `BLEAnnounceHandler.swift`     | Peer discovery via signed announcements                       |
| `GatewayService.swift`         | Bridges mesh `nostrCarrier` packets to Nostr internet         |

### iOS-Specific Features

- **Tor integration** (Arti/Rust xcframework).
- **macOS support** (universal app via Catalyst).
- **Share Extension** (`bitchatShareExtension`): share content into bitchat from other apps.
- **Keychain** for key storage (iOS Keychain API).
- **Background BLE** via CoreBluetooth state restoration.

## 11. Android Codebase Walkthrough

### Directory Structure

```
bitchat/android/app/src/main/java/com/bitchat/android/
├── BitchatApplication.kt     # Application class
├── MainActivity.kt
├── MainViewModel.kt
├── core/                     # Core utilities
├── crypto/                   # EncryptionService.kt (X25519 + AES-256-GCM)
├── favorites/                # Favorite peer management
├── features/
│   ├── file/                 # FileUtils.kt
│   ├── media/                # ImageUtils.kt
│   └── voice/                # VoiceRecorder.kt, VoiceVisualizer.kt, Waveform.kt
├── geohash/                  # Geohash utilities
├── identity/                 # Identity management
├── mesh/                     # ~25 files - BLE mesh engine
│   ├── BluetoothMeshService.kt  # Main mesh coordinator
│   ├── BluetoothConnectionManager.kt
│   ├── BluetoothGattClientManager.kt
│   ├── BluetoothGattServerManager.kt
│   ├── MeshCore.kt           # Shared mesh coordinator
│   ├── MessageHandler.kt     # Message type processing
│   ├── PacketRelayManager.kt # Relay decisions
│   ├── FragmentManager.kt    # Fragmentation/reassembly
│   ├── SecurityManager.kt    # Dedup + signature verification
│   ├── StoreForwardManager.kt # Offline message cache
│   ├── PeerManager.kt        # Peer lifecycle
│   └── PowerManager.kt       # Battery/scan management
├── model/                    # Data models (BitchatMessage, etc.)
├── net/                      # Network utilities
├── noise/                    # Noise protocol implementation
├── nostr/                    # ~24 files - Nostr client
│   ├── NostrClient.kt
│   ├── NostrRelayManager.kt
│   ├── NostrProtocol.kt      # NIP-17 implementation
│   ├── GeohashMessageHandler.kt
│   ├── RelayDirectory.kt
│   └── NostrIdentity.kt
├── protocol/                 # BitchatPacket, MessageType, SpecialRecipients
├── service/                  # TransportBridgeService
├── services/                 # VerificationService
├── sync/                     # GossipSyncManager
├── ui/                       # Jetpack Compose UI
├── util/                     # AppConstants, utilities
└── wifi-aware/               # WiFi Aware transport (experimental)
```

### Key Differences from iOS

| Aspect         | iOS                             | Android                                        |
| -------------- | ------------------------------- | ---------------------------------------------- |
| Crypto         | Noise XX (Curve25519/ChaCha20)  | X25519 + AES-256-GCM                           |
| Tor            | Yes (Arti/Rust)                 | No                                             |
| UI             | SwiftUI                         | Jetpack Compose + Material Design 3            |
| Background BLE | CoreBluetooth state restoration | Foreground service required                    |
| macOS support  | Yes (Catalyst)                  | No                                             |
| WiFi Aware     | No                              | Experimental (`wifi-aware/` folder)            |
| Fragment size  | ~469 bytes                      | Was 500, corrected to 150 bytes for iOS compat |

### Android Fragment Fix

A critical cross-platform bug was fixed in v0.7: Android was fragmenting at 500 bytes (vs iOS's ~469/150 bytes), breaking iOS-Android messaging. This was corrected in the changelog entry for v0.7.

## 12. Georelays Infrastructure

### What It Is

The `bitchat/georelays` folder is a **standalone toolchain** for discovering, filtering, and geolocating Nostr relays. It is not part of the app; it is infrastructure that produces the `nostr_relays.csv` dataset that the apps consume.

### Pipeline

```
1. nostr_relay_discovery.py
   └─ BFS from seed relay → follows kind 3 / kind 10002 events → tests responsiveness
   └─ Output: relay_discovery_results.json (functioning relay URLs)

2. filter_bitchat_relays.sh
   └─ Filters relays that support kind 20000 (bitchat ephemeral events)
   └─ Tests both read (nak req -k 20000) and write (nak event -k 20000)
   └─ Output: bitchat_relays.txt

3. relays_geo_lookup.py <output.csv>
   └─ Downloads DB-IP city IPv4 ranges
   └─ Resolves relay URLs to A records
   └─ Binary search to map IPv4 → lat/lon
   └─ Output: nostr_relays.csv (URL, Latitude, Longitude)
```

### Automation

A GitHub Actions workflow runs the full pipeline daily and commits the results. The apps fetch the latest `nostr_relays.csv` at runtime from:

```
https://raw.githubusercontent.com/permissionlesstech/georelays/refs/heads/main/nostr_relays.csv
```

### Usage in the App

The iOS `GeoRelayDirectory` class:

1. Tries the cached CSV from app support directory.
2. Falls back to bundled CSV files (shipped with the app).
3. Fetches remote CSV via `TorURLSession` (Tor-proxied).
4. `closestRelays(toGeohash:count:)` returns the nearest relay URLs by Haversine distance.

### Scale

- ~290+ total Nostr relays worldwide.
- Subset support kind 20000 (bitchat-specific).
- Coverage maps and heatmaps tracked in `georelays/assets/`.
- IPv4-only geolocation (IPv6-only relays are skipped).

## 13. Cross-Platform Protocol Compatibility

Android is explicitly designed for **100% protocol compatibility** with iOS. Key shared elements:

| Element                    | Value                                                    |
| -------------------------- | -------------------------------------------------------- |
| BLE Service UUID (mainnet) | `F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C`                   |
| BLE Characteristic UUID    | `A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D`                   |
| Peer ID format             | First 16 hex chars of Noise identity SHA-256 fingerprint |
| TTL                        | 7 hops default                                           |
| Packet types               | Shared `MessageType` enum (same byte values)             |
| Announcement format        | Same binary layout (AnnouncementPacket)                  |
| Deduplication              | Same 5-minute window, same key derivation                |
| Fragment size              | ~469 bytes (critical fix in Android v0.7)                |

A future Rust implementation is mentioned in changelog references, also targeting the same protocol.

## 14. Distance Limitations

### BLE Radio Range

Bluetooth LE typically reaches **10–100 meters** depending on:

- Environment (walls, interference, obstacles).
- Device antenna quality.
- BLE power level (most phones use ~4 dBm).

In practice: **~30–50 meters** in open air, **10–20 meters** through walls.

### Multi-Hop Extension

With TTL = 7, a message can traverse up to **7 hops**. In a dense crowd or city environment where peers are ~30–50 meters apart:

```
7 hops × 30–50 m ≈ 210–350 meters effective range
```

In ideal open conditions (50 m per hop):

```
7 hops × 50 m ≈ 350 meters maximum mesh range
```

In a dense indoor environment (15 m per hop through walls):

```
7 hops × 15 m ≈ 105 meters
```

**Key insight:** Range scales with density of users. In a crowded stadium or protest, with hundreds of people all running bitchat, effective range can cover the entire venue. With sparse users (e.g., countryside), range is severely limited.

### The Internet Extension

When BLE cannot reach, the Nostr path has **global range**, but requires internet connectivity. Mutual favorites can exchange messages across continents via Nostr relays.

### The Courier Extension

When neither BLE nor Nostr is available, the courier system relies on **physical movement** of people. If a device carrier walks from one mesh partition to another, messages flow. This has effectively **unlimited range** but **unbounded and unpredictable latency** (could be hours).

## 15. Is It Truly Offline?

**Partially yes, but with important nuances:**

### Fully Offline (No Internet Needed)

- ✅ **BLE mesh chat**: public channels and private DMs within radio range.
- ✅ **Multi-hop relay**: up to 7 hops through nearby devices.
- ✅ **Store-and-forward**: messages queued in outbox, delivered on reconnect.
- ✅ **Courier system**: sealed envelopes physically carried by other users.
- ✅ **Gossip sync**: public message history reconciled between peers.
- ✅ **Voice notes**: sent as file transfers over BLE.
- ✅ **Image sharing**: sent as file transfers over BLE (≤ 1 MiB).

### Requires Internet

- ❌ **Location (geohash) channels**: Nostr relays are internet-only.
- ❌ **Cross-mesh DMs to non-nearby mutual favorites**: requires Nostr delivery.
- ❌ **Courier drop on relays**: the internet bridge courier path.
- ❌ **Relay discovery updates**: fetching fresh `nostr_relays.csv`.
- ❌ **Tor bootstrapping** (iOS): requires initial internet to bootstrap Tor circuits.

### The Offline Story in Practice

bitchat is genuinely useful in a fully offline environment, but its feature set degrades:

- You lose contact with people who are not physically nearby.
- Location channels go silent.
- The app functions as a local encrypted mesh chat for people in the same physical space.

This makes it valuable for **protests, disaster zones, events, and remote areas**, but not as a full replacement for internet messaging when you need to reach people who are far away.

## 16. Privacy & Security Model

### What Is Private

- **Message content**: all private messages are E2E encrypted (Noise XX on mesh, NIP-17 on Nostr).
- **Relay operators**: Nostr relays see only encrypted event blobs; the sender/recipient identities are hidden by the gift-wrap layer.
- **Courier carriers**: couriers carry opaque ciphertext addressed by a daily-rotating tag; they learn nothing about sender, recipient, or content.
- **Tor (iOS)**: all internet traffic is onion-routed, hiding IP address from relay operators.

### What Is Observable

- **BLE proximity**: anyone with a BLE scanner can detect that a device with bitchat is nearby. Ephemeral IDs limit long-term correlation.
- **PTT timing fingerprint** (when implemented): a steady ~8 pkt/s burst cadence reveals "someone is speaking to someone" even under Noise encryption.
- **Mesh participation**: a relay device is detectable as an active node.

### Relay Node Trust

- Relay nodes cannot read private traffic (only opaque padded ciphertext).
- A malicious relay can **drop** messages (mitigated by courier redundancy and outbox retry).
- A malicious relay **cannot** read, link across days, or amplify messages beyond their TTL.

### Replay Protection

- Public broadcasts: 6-hour acceptance window + deduplication.
- Private payloads: protected by Noise nonces (replay invalidates MAC).

### Panic Wipe

Triple-tap the app logo → **immediately erases**:

- Identity keys (Keychain)
- Favorites list
- All carried courier envelopes
- Sealed outbox
- Archived public history
- Gossip sync cache
- Delivery metrics

No forensic recovery is possible after panic wipe without the Keychain, which is also wiped.

## 17. Current Gaps & Known Limitations

### Technical Gaps

| Gap                                     | Severity | Notes                                                                   |
| --------------------------------------- | -------- | ----------------------------------------------------------------------- |
| **No video support**                    | High     | No packet type, no codec, BLE bandwidth insufficient (~15 KB/s)         |
| **No live voice (PTT)**                 | Medium   | Designed but not shipped; voice notes work as fallback                  |
| **No video calling**                    | High     | Architecturally infeasible over BLE; would require internet path        |
| **Courier envelopes = text only**       | Medium   | 16 KiB cap; images cannot be physically relayed                         |
| **Nostr path = text only**              | Medium   | Media does not ride Nostr                                               |
| **No forward secrecy for courier mail** | Medium   | Noise X (static-key sealed); prekey scheme is future work               |
| **Android lacks Tor**                   | High     | All Nostr traffic is clearnet on Android; IP visible to relay operators |
| **No offline geohash channels**         | Design   | Geohash = Nostr only; no BLE geohash broadcast                          |
| **WiFi Aware (Android)**                | Low      | Folder exists but experimental, not integrated into main flow           |
| **No prekey forward secrecy**           | Medium   | `PrekeyBundleStore` infrastructure exists but not default path          |

### Operational Gaps

| Gap                              | Notes                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Sparse network problem**       | With few users, mesh range collapses; the network requires critical mass                                        |
| **Discovery requires proximity** | You cannot find strangers unless they are physically nearby or mutual favorites                                 |
| **Push notifications**           | Background delivery is limited by OS restrictions (especially iOS)                                              |
| **Large file transfers**         | 1 MiB cap; no chunked streaming or resumable transfers                                                          |
| **No read receipts on Nostr**    | Read receipts work on BLE but not reliably over Nostr                                                           |
| **Relay quality variance**       | Not all 290+ relays reliably accept kind 20000; `filter_bitchat_relays.sh` filters but results change over time |
| **Android battery optimization** | Many Android OEMs aggressively kill background apps, disrupting BLE mesh                                        |

### Protocol Gaps

| Gap                           | Notes                                                                               |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| **Multi-hop courier routing** | Current courier just hands to 3 nearby peers; no encounter-history-informed routing |
| **Probabilistic relay**       | Dense/sparse graph TTL boosting not yet implemented                                 |
| **No group E2E encryption**   | Group/channel messages are broadcast-signed, not E2E                                |
| **No key rotation**           | Long-lived static keys with no automated rotation schedule                          |

## 18. Roadmap & Future Work

From the whitepaper's "Future Work" section and observed codebase state:

### Explicitly Planned (Whitepaper, section 9)

1. **Prekey-based forward secrecy for courier envelopes**: infrastructure (`PrekeyBundleStore`) already in codebase.
2. **Couriered media beyond 16 KiB text cap**: would require envelope size increase + memory pressure management.
3. **Probabilistic relay and edge-of-network TTL boosting**: for very dense and very sparse graphs.
4. **Multi-hop courier routing informed by encounter history**: probabilistic routing based on peer meeting frequency.

### In Progress / Designed

1. **Push-to-Talk live voice** (iOS, `PUSH-TO-TALK-DESIGN.md`): full wire protocol designed.
2. **Architecture V2**: ongoing refactor to `AppRuntime` composition root, feature-scoped models.
3. **Bluetooth architecture improvements**: `BLEOutboundWriteBuffer`, `BLEIngressLinkRegistry`, `BLEFanoutSelector` separation in progress.

### Inferred from Codebase

1. **Android Tor integration**: Android currently has no Tor; iOS has full Arti integration.
2. **Rust client compatibility**: changelog mentions Rust as a third platform target.
3. **WiFi Aware transport (Android)**: `wifi-aware/` folder exists; higher bandwidth, longer range than BLE.
4. **Board/bulletin board feature**: `BoardStore` in iOS codebase suggests an async public posting feature.
5. **Gateway / bridge mode**: partially implemented; BLE→Nostr bridge for mesh-only devices.

## 19. Technology Stack Summary

### iOS

| Layer          | Technology                                                                       |
| -------------- | -------------------------------------------------------------------------------- |
| Language       | Swift 5.9+                                                                       |
| UI             | SwiftUI (iOS + macOS)                                                            |
| BLE            | CoreBluetooth (dual central/peripheral)                                          |
| Noise Protocol | Custom Swift implementation                                                      |
| Nostr          | Custom Swift NIP-17/NIP-59 implementation                                        |
| Tor            | Arti (Rust, bundled as xcframework)                                              |
| Crypto         | CryptoKit (Curve25519, ChaCha20-Poly1305, SHA-256) + P256K (secp256k1 for Nostr) |
| Compression    | LZ4                                                                              |
| Key Storage    | iOS Keychain                                                                     |
| Persistence    | File system (AES-ChaChaPoly encrypted), UserDefaults                             |
| Geolocation    | DB-IP database via `georelays`                                                   |
| Min OS         | iOS (latest, universal with macOS)                                               |

### Android

| Layer          | Technology                                     |
| -------------- | ---------------------------------------------- |
| Language       | Kotlin                                         |
| UI             | Jetpack Compose + Material Design 3            |
| BLE            | Android BluetoothLE API (GATT client + server) |
| Noise Protocol | Custom Kotlin implementation                   |
| Nostr          | Custom Kotlin NIP-17 implementation            |
| Tor            | Not yet integrated                             |
| Crypto         | X25519 key exchange + AES-256-GCM              |
| Compression    | LZ4                                            |
| Key Storage    | Android Keystore                               |
| Persistence    | Coroutines + ConcurrentHashMap, file system    |
| Min API        | 26 (Android 8.0)                               |

### Georelays

| Layer       | Technology                            |
| ----------- | ------------------------------------- |
| Discovery   | Python (asyncio, aiohttp, websockets) |
| Filtering   | Bash + `nak` CLI (Nostr toolkit)      |
| Geolocation | Python + DB-IP IPv4 city database     |
| Automation  | GitHub Actions (daily cron)           |
| Output      | CSV (URL, Lat, Lon) consumed by apps  |

## Appendix: Key Constants Reference

| Constant                      | Value                          | Meaning                                               |
| ----------------------------- | ------------------------------ | ----------------------------------------------------- |
| TTL default                   | 7                              | Max hops for a packet                                 |
| Dense graph threshold         | 6                              | ≥ 6 links = dense; clamp broadcast TTL to 5           |
| Jitter range                  | 10–220 ms                      | Relay wait before re-sending                          |
| Dedup seen-set                | 1,000 entries, 5 min expiry    | Duplicate suppression                                 |
| Announce interval (isolated)  | 4 s                            | Presence heartbeat when alone                         |
| Announce interval (connected) | 15–30 s jittered               | Presence heartbeat when in mesh                       |
| Peer reachable window         | 60 s                           | How long a peer stays "reachable" after last announce |
| Fragment size                 | ~469 bytes                     | Per-fragment chunk (BLE MTU limited)                  |
| Max concurrent assemblies     | 128                            | Fragment reassembly slots                             |
| Fragment timeout              | 30 s                           | Abandon incomplete fragment sets                      |
| Fragment size cap             | 1 MiB                          | Reassembled payload hard limit                        |
| Outbox TTL                    | 24 h                           | Max retention for queued DMs                          |
| Outbox per-peer cap           | 100 messages                   |                                                       |
| Outbox retry cap              | 8 attempts                     | After 8 failures: drop + notify user                  |
| Courier per-favorite          | 5 envelopes                    | Deposit quota for mutual favorites                    |
| Courier per-verified          | 2 envelopes                    | Deposit quota for verified strangers                  |
| Courier pool                  | 40 total, 20 for verified tier |                                                       |
| Courier envelope max size     | 16 KiB                         | Text-only; no media                                   |
| Courier envelope TTL          | 24 h                           |                                                       |
| Copy budget (spray-and-wait)  | 4 initial, 8 max               |                                                       |
| Gossip sync interval          | 15 s                           | Public message reconciliation cadence                 |
| Gossip public message window  | 6 h                            | How long messages stay sync-able                      |
| Gossip fragment/file window   | 15 min                         | Shorter window for transfers                          |
| Gossip cache size             | 1,000 packets                  |                                                       |
| Nostr lookback on reconnect   | 24 h                           |                                                       |
| Announce neighbor list        | 10 peers                       | Topology carried in each announce                     |
| BLE PTT burst content budget  | 210 bytes                      | Voice frame fits in 256-byte padding bucket           |
| PTT max burst duration        | 120 s                          |                                                       |
| PTT jitter buffer             | 350 ms                         | Before starting live playback                         |

_This document reflects the codebase as of July 2026. The bitchat protocol is public domain (Unlicense). Airhop is MIT licensed._
