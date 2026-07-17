# Airhop: Reference Docs

## What Is Airhop

Airhop is a **cross-platform iOS + Android app** (React Native, Expo SDK 57, bare workflow) for **offline-first peer-to-peer communication**. It works over Bluetooth mesh with no internet, no accounts, no servers, and no tracking. When internet is available, it bridges through Nostr and adds Cashu ecash payments.

It is **wire-compatible with bitchat**: an Airhop node and a bitchat node find each other over BLE and exchange messages without any setup. We share the same packet format, BLE service UUIDs, and security model.

**Core goal:** censorship-resistant communication for natural disasters, internet blackouts, and mass protests, anywhere networks are unavailable, surveilled, or shut down.

## Non-Negotiable Rules (Summarized)

| Rule                             | What It Means                                                 |
| -------------------------------- | ------------------------------------------------------------- |
| `@noble/*` crypto only           | No other crypto library. Ever.                                |
| No protocol logic in native code | Swift/Kotlin expose raw bytes only                            |
| Build core before UI             | `src/core/` → native → `src/features/` → `src/ui/`            |
| Don't break packet layout        | Changing `packet-codec.ts` needs a version bump + compat test |
| Keys in Keychain/Keystore only   | Never in MMKV, AsyncStorage, or SQLite                        |
| Every packet is Ed25519-signed   | Drop anything unsigned or invalid, silently                   |
| No plaintext on disk             | Panic wipe destroys all keys in under 1 second                |

## Reference Codebase

Airhop is built on two open-source (Unlicense / public domain) implementations:

- `bitchat/ios/`: Swift iOS app
- `bitchat/android/`: Kotlin Android app
- `bitchat/georelays/`: Nostr relay discovery scripts

Both are free to copy. Their internal docs are the primary source of truth for how the protocol actually behaves. Summaries below.

# bitchat/ios/docs: Summaries

### ARCHITECTURE_V2.md: Cleaning Up a Messy App

**What it is:** A refactoring plan (and status update) for the iOS app's internal structure.

**The problem:** Everything was jammed into one giant `ChatViewModel`: startup logic, UI state, BLE events, message routing, Tor wiring. It worked but was hard to test and unsafe to change.

**The fix:** Pull each concern into its own focused object. `AppRuntime` owns the startup sequence and lifecycle. `ConversationStore` owns message state. Feature models like `PublicChatModel`, `PrivateInboxModel`, and `ConversationUIModel` each do one job and read from the store directly. Views only talk to their feature model, not to the global view model.

**Impact for Airhop:** Don't repeat this mistake. In our TypeScript codebase, the equivalent is: don't put everything in a Zustand store and call it done. `src/core/` services are the runtime. `src/features/` consumes them. `src/store/` holds derived read state. Keep it layered from day one.

**Takeaway:** One source of truth per concern. Views are passive renderers. State flows down, events flow up.

### CONVERSATION-STORE-DESIGN.md: One Source of Truth for Messages

**What it is:** The design doc for replacing bitchat's fragmented message storage with a single `ConversationStore`.

**The problem:** One incoming private message used to touch four different stores and three async bridges, re-sorting, re-comparing, and re-publishing every conversation on every single message. The math was O(total messages) x 3 layers per append. Delivery status was patched in two places using a positional index that any concurrent mutation could invalidate.

**The fix:** `ConversationStore` is the only writer and only holder of message state. Each conversation is a reference-type `ObservableObject` with an incremental message-ID index. Appending to chat A never republishes chat B. Mutations go through a typed intent API (`append`, `upsertByID`, `setDeliveryStatus`, `markRead`, `migrateConversation`). Feature models observe a single conversation object, not the entire dictionary.

**Impact for Airhop:** In our Zustand store, the same principle applies. Don't scatter message state across multiple slices that sync to each other. One slice per conversation keyed by `ConversationID`. Write through a defined action API. Never do a full-dictionary replace per message.

**Takeaway:** Append should be O(1). Full re-sort on every message is a performance bug waiting to blow up on cheap Android hardware.

### REQUEST_SYNC_MANAGER.md: Hardening Gossip Sync Against Spoofing

**What it is:** An upgrade to the mesh sync protocol that tracks outgoing sync requests and validates that responses are solicited.

**The problem before:** Sync requests were broadcast to all neighbors. Responses were accepted from anyone without checking if we'd actually asked them. This opened the door to replaying old packets (timestamp bypass) and unsolicited sync floods.

**The fix:** A `RequestSyncManager` tracks `peerID -> timestamp` of every sync request we send. Normal packets now require timestamps within 2 minutes of the local clock. Sync response packets (marked with new flag `IS_RSR = 0x10`) bypass the timestamp check only if they match a pending request to that specific peer. Unsolicited RSR packets are rejected.

**New features bundled in:**

- `sinceTimestamp` TLV field in REQUEST_SYNC: the responder skips packets older than the requester's filter cursor, avoiding re-sending everything every 30s
- `fragmentIdFilter` TLV: stalled fragment reassembly can request just the specific missing fragment streams instead of triggering a full sync

**Impact for Airhop:** In `src/core/mesh/gossip-sync.ts`, sync requests must be unicast and registered before sending. Response packets carry the `IS_RSR` flag. The deduplicator and packet processor must check this flag and validate against pending requests. This is the version of sync we implement, not the naive broadcast version.

**Takeaway:** Gossip sync without request tracking is a spoofing surface. Track what you ask for and reject anything you didn't.

### SOURCE_ROUTING.md: Teaching Packets to Plan Their Own Route

**What it is:** The v2 protocol upgrade that allows a sender to embed an explicit hop-by-hop path inside the packet instead of relying on flood routing.

**The problem with flooding:** Every packet is forwarded by every relay to every neighbor until TTL hits zero. That's fine for small networks but wastes bandwidth on dense meshes where you already know the topology.

**The v2 upgrade:**

- Header grows from 14 to 16 bytes (payload length field expands from 2 to 4 bytes, enabling files up to 4 GiB)
- New `HAS_ROUTE` flag (`0x08`), only valid in v2 packets
- Route field: `[count: 1 byte][hop1: 8 bytes][hop2: 8 bytes]...` inserted after `RecipientID`
- Route includes only intermediate hops, not sender or recipient (both already in the header)

**How topology is discovered:** Nodes include a `TLV 0x04` (Direct Neighbors) in their ANNOUNCE packets, a list of peer IDs they're currently connected to. Receivers build a mesh graph from this. An edge is only used for routing when _both_ endpoints announce each other (two-way handshake, which prevents spoofed or stale routes).

**Security:** The Ed25519 signature covers the entire packet including the route field. Any relay that tampers with the route invalidates the signature and the packet is silently dropped.

**Impact for Airhop:** `src/core/mesh/packet-codec.ts` must handle both v1 (2-byte length, no route) and v2 (4-byte length, optional route). Source routing is opt-in; we flood by default and originate routes only when we have a confirmed topology. The `announce-manager.ts` must append TLV `0x04` with current direct neighbors.

**Takeaway:** v2 packets are strictly better: larger files, optional efficient routing, backward compatible. Build v2 support from day one.

### GeohashPresenceSpec.md: "Who's Online Near Me?"

**What it is:** The spec for broadcasting and counting online participants in geohash-based location channels over Nostr.

**How it works:** When the app is open, it sends a Nostr ephemeral event (kind `20001`) to each geohash channel matching your current location. These are heartbeats; they carry no content, just a public key and a geohash tag. Other clients listen for both chat events (kind `20000`) and heartbeats, track the last-seen timestamp per public key, and show a count of anyone seen in the last 5 minutes.

**Privacy built in:** Heartbeats are only sent for coarse precision levels (region, province, city; geohash precision <= 5). Neighborhood-level and finer channels get no presence broadcast. For those, the UI shows `[? people]` instead of `[0 people]` so users understand lurkers might be there. Random delays between broadcasts prevent timing correlation across precision levels.

**Impact for Airhop:** This is a cross-platform spec; both iOS and Android implement the same logic. When we build `src/core/nostr/presence.ts`, this document is the spec. Kind `20001`, 40-80s randomized heartbeat, precision <= 5 only, 5-minute online window.

**Takeaway:** "Online counts" leak location. The spec's privacy restrictions exist for a reason. Don't loosen them.

### privacy-assessment.md: What Actually Gets Exposed

**What it is:** An honest, implementation-level audit of what data is observable, what is stored, and what the panic wipe covers.

**The honest picture:**

- Signed ANNOUNCE packets expose your nickname, public keys, and capability flags to every nearby radio
- BLE timing, traffic volume, and radio fingerprints are always observable to nearby devices
- Private messages use Noise XX (end-to-end) but metadata (timing, ciphertext size, recipient tags) leaks to mesh relays
- Public mesh messages are intentionally visible to all participants (that's the point)
- Nostr relays log event metadata, timing, and your IP unless you use Tor
- Location: exact coordinates never leave the device; geohashes do; reverse geocoding goes to Apple (not purely on-device)
- Panic wipe covers: identity keys, session keys, messages, courier mail, gossip archive, board data, media, and active transport state

**What's not covered by panic wipe (residual risks):**

- Apple system logs, Nostr relay retention, and network provider logs are outside the app's control
- A seized, unlocked device with board or media data still reveals content

**Impact for Airhop:** Every new persistent store we add needs an explicit panic wipe hook. Every new network action needs to consider what metadata it leaks to relays. Privacy manifests (`PrivacyInfo.xcprivacy`) must be updated before App Store submission.

**Takeaway:** Encrypt everything, log nothing, wipe aggressively. Default to ephemerality.

### ARTI-BINARY-PROVENANCE.md: Bundling Tor Inside the App

**What it is:** Instructions and verification hashes for the Arti (Rust-based Tor client) static library that is compiled and embedded directly in the iOS app as an xcframework.

**The problem:** iOS has no system Tor daemon. To route all network traffic through Tor, you have to ship Tor yourself.

**The fix:** Compile a Rust crate (`arti-client`) targeting iOS/macOS slices, package it as an xcframework, and link it via SwiftPM. The build is reproducible: specific Rust toolchain version (`1.96.0`), specific cbindgen version (`0.29.4`), normalized archive metadata, and SHA-256 hashes committed to the doc.

**Impact for Airhop:** On iOS, we copy this approach; Arti is already in `bitchat/ios/localPackages/Arti/`. On Android, we use Orbot (an existing Tor app the user installs) via SOCKS5 proxy detection. We don't need to rebuild Arti from scratch.

**Takeaway:** Never accept an updated xcframework without matching source evidence, lockfile review, and new hashes. Binary blobs without provenance are a supply chain risk.

### TOR-INTEGRATION.md: All Internet Traffic Goes Through Tor

**What it is:** The integration plan for routing all Nostr and relay traffic through a local Tor SOCKS5 proxy, fail-closed by default.

**How it works:**

- `TorManager` boots Arti on app launch, generates a `torrc` in Application Support, and exposes a SOCKS5 proxy at `127.0.0.1:39050`
- `TorURLSession` is a `URLSession` pre-configured with that SOCKS5 proxy
- `NostrRelayManager` and `GeoRelayDirectory` await Tor readiness before starting any network activity
- If Tor isn't bootstrapped, the app does not connect (fail-closed, not fail-open)
- For local development only: set compiler flag `BITCHAT_DEV_ALLOW_CLEARNET` to bypass Tor

**Why fail-closed matters:** Fail-open means "if Tor breaks, use clearnet." That's a privacy disaster. Fail-closed means "if Tor breaks, you're offline." That's annoying but correct.

**Impact for Airhop:** On iOS, we copy `bitchat/ios/localPackages/Arti/` and wire it the same way. On Android, Orbot is detected via SOCKS5 proxy at `127.0.0.1:9050`; if Orbot isn't running, internet features don't work. This is by design, not a bug.

**Takeaway:** Never connect to a Nostr relay without going through Tor first. `TorURLSession` is the only session used for external network calls. Never hard-code a clearnet fallback in release builds.

### PUSH-TO-TALK-DESIGN.md: Live Voice Over Bluetooth

**What it is:** The full design for walkie-talkie-style live voice over the BLE mesh.

**The core idea:** Instead of hold-to-record then release-to-send (which delivers audio only after you let go), PTT streams audio frames _while you speak_. The listener hears you with sub-second delay. It's a delivery strategy, not a mode; the system picks it automatically based on whether the peer is reachable on mesh or only via Nostr.

**How it fits in BLE:** BLE moves ~15 KB/s per link. AAC-LC voice at 16 kHz uses ~2 KB/s. Live voice fits comfortably with room for other traffic. Frames are 64ms each (~130 bytes), batched into 210-byte burst packets that never need fragmentation. Public mesh uses a new message type `0x29`; DMs wrap frames inside a Noise session as `NoisePayloadType.voiceFrame = 0x08`.

**Reliability trick:** The finalized voice note is always sent after the live burst ends. Old clients that can't decode live frames still receive the note. Late joiners and out-of-range peers catch up. Live and reliable delivery are not mutually exclusive.

**Receiver behavior:** 350ms jitter buffer, silence insertion for lost frames, auto-converts partial burst to a replayable note. If the finalized note arrives after a complete live burst, it silently replaces the partial file behind the existing bubble with no duplicate message.

**Impact for Airhop:** We're building this in v0.7.0 (`VoiceCapture.ts` + `VoicePlayer.ts`). This doc is the complete spec. Key numbers: `pttMaxBurstContentBytes = 210`, `burstID = 8 random bytes`, `seq = UInt16 BE`, AAC-LC 16kHz mono 16kbps, 350ms jitter buffer, 120s max burst.

**Takeaway:** Live voice over BLE is absolutely feasible. The math works. The trick is keeping frames small enough to skip the fragment scheduler entirely.

# bitchat/android/docs: Summaries

### ANNOUNCEMENT_GOSSIP.md: How Peers Share Their Neighbor Lists

**What it is:** The spec for a TLV extension to ANNOUNCE packets that lets peers gossip which other peers they're directly connected to.

**The mechanic:** After the standard nickname/keys TLVs in an ANNOUNCE packet, a sender can optionally append `TLV 0x04` containing up to 10 peer IDs (each 8 bytes, binary-encoded). Receivers use these neighbor lists to build a local mesh topology graph, where nodes are peers and edges are direct connections.

**Backward compatible:** Unknown TLVs are ignored by old clients. Omitting TLV `0x04` is always valid. The gossip data is covered by the Ed25519 signature (since it's part of the payload), so it can't be spoofed.

**Decoding rule:** The neighbor count is `TLV length / 8`; there's no explicit count field. If the length isn't a multiple of 8, ignore the trailing bytes.

**Impact for Airhop:** `src/core/mesh/announce-manager.ts` must include TLV `0x04` in outgoing ANNOUNCE packets. The flood router needs a topology graph that it updates on each received ANNOUNCE. This graph feeds source routing (when we have a confirmed path) and debug visualizations.

**Takeaway:** The mesh builds its own map. Every ANNOUNCE is both a hello and a topology update. Trust only mutual announcements.

### SOURCE_ROUTING.md: Source-Based Routing (Cross-Platform Spec)

This is the same v2 routing spec as the iOS version, implemented on both platforms.

**Summary:** Senders can embed an explicit hop list in v2 packets. Topology is built from mutual ANNOUNCE neighbor gossip. Routes are only used when both endpoints confirm the connection. The signature covers the route field, so tampering is detected.

See the [iOS SOURCE_ROUTING summary](#source_routingmd-teaching-packets-to-plan-their-own-route) above; the spec is the same, and the Android implementation is in `BluetoothMeshService.kt` + `MeshGraph`.

### sync.md: GCS Gossip Sync (Efficient Packet Reconciliation)

**What it is:** The spec for gossip-based packet synchronization using Golomb-Coded Sets (GCS), inspired by how Bitcoin Core syncs transaction inventories.

**The problem it solves:** When a node joins the mesh or misses packets during a partition, how does it catch up without everyone re-broadcasting everything? Flooding all packets again is wasteful. Asking for specific ones requires knowing what you're missing.

**How GCS sync works:**

1. Every 30 seconds, send a `REQUEST_SYNC` packet (`0x21`) to all direct neighbors (TTL=0, local only; never relayed)
2. The packet contains a compact GCS filter representing the last ~100 packets you've seen
3. A GCS is like a probabilistic set; it proves membership with 1% false positives in ~256 bytes
4. The receiver checks each of its local packets against your filter; anything not in your filter gets sent back to you

**What's included:** Public broadcast messages and the most recent ANNOUNCE per peer (up to 60 seconds old). Private messages are never synced.

**Pruning:** Announcements older than 60 seconds are removed from the sync candidate set. LEAVE messages immediately remove that peer's stored announcement.

**New peer optimization:** When a new peer sends their first ANNOUNCE, wait 5 seconds, then send them a unicast REQUEST_SYNC so they can catch up on what they missed before joining.

**Impact for Airhop:** `src/core/mesh/gossip-sync.ts` implements this spec. Key parameters: 30s periodic sync, 5s new-peer sync, 256-byte default GCS, 1% FPR, 100-packet rolling window, 60s announcement expiry. The GCS must be cross-implementation compatible: same hashing scheme (`first 8 bytes of SHA-256 over 16-byte Packet ID`), same Golomb-Rice encoding, MSB-first bit packing.

**Takeaway:** GCS sync is what makes the mesh eventually consistent across partitions without flooding. Every disconnected pocket that rejoins can catch up efficiently. It's not a nice-to-have; it's how the mesh stays coherent.

### device_manager.md: Blocking Misbehaving Bluetooth Devices

**What it is:** The design for `DeviceMonitoringManager`, a lightweight component that blocks or disconnects BLE devices that behave badly.

**What it protects against:**

- Devices that connect but never send an ANNOUNCE within 15 seconds (scanner bots, probers)
- Devices that go silent for over 60 seconds (stale connections wasting BLE slots)
- Devices that disconnect with errors 5+ times in 5 minutes (buggy firmware or attack)

**How it works:** Each device (by MAC address) gets a 15-second ANNOUNCE timer and a rolling 60-second inactivity timer. Both reset on legitimate traffic. Error disconnects are counted; hitting 5 in 5 minutes triggers a 15-minute block. Blocked devices are refused at both client (no outgoing connection) and server (immediate `cancelConnection`).

**Panic wipe integration:** Triple-tapping the title clears the blocklist and all device tracking state. Panic wipe already covers this.

**Impact for Airhop:** Our `AirhopBLEModule` (Swift + Kotlin) needs equivalent logic in the native layer. The TypeScript `announce-manager.ts` notifies the native module when an ANNOUNCE is validated. The native module handles timers and connection lifecycle. Keep the blocking logic close to the BLE layer; it doesn't belong in TypeScript.

**Takeaway:** BLE connection slots are scarce. Don't waste them on devices that won't talk properly. Block early, unblock automatically.

### file_transfer.md: Sending Files Over Bluetooth

**What it is:** The exhaustive wire protocol spec for sending voice notes, images, and arbitrary files over BLE, including interactive features like waveform seeking.

**The packet format (v2):**

- Envelope: standard `BitchatPacket` with `type = 0x22` (FILE_TRANSFER), always v2
- v2 header: 15 bytes (vs. 13 for v1), with payload length expanded to 4 bytes (supports up to 4 GiB)
- Payload: TLV structure: `0x01` filename, `0x02` file size (4 bytes), `0x03` MIME type, `0x04` content (4-byte length prefix)
- Transport fragmentation still applies: large files split into 469-byte BLE fragments

**Public vs. private:** Public file sends use BROADCAST recipient. Private sends use the target peer's 8-byte ID and are wrapped in a Noise session.

**Interactive audio:** Waveform seeking (tap anywhere on the waveform to jump) is supported. The receiver stores the complete ADTS `.aac` file so seeking is always possible.

**Cross-version compat:** All clients must decode both v1 and v2 packets. New file transfers always use v2. Fragmented files inherit the v2 version and route fields from the parent packet.

**Impact for Airhop:** `src/core/mesh/fragment-manager.ts` handles split/reassemble. `src/core/mesh/packet-codec.ts` must encode/decode both v1 and v2 headers. File transfer is Phase 2 (v0.6.0+); don't block on it for v0.5.0.

**Takeaway:** Use v2 for all new packets. Never send a file transfer as v1. The 4-byte payload length is not optional for files; voice notes on modern phones routinely exceed 64 KB.

### GeohashPresenceSpec.md: Location Presence (Cross-Platform Spec)

This is the same spec as the iOS version, shared across both platforms.

**Summary:** Send Nostr kind `20001` heartbeats every 40-80 seconds (randomized) to geohash channels at precision <= 5. Count participants online if seen in the last 5 minutes. Show `[? people]` for high-precision channels where presence isn't broadcast.

See the [iOS GeohashPresenceSpec summary](#geohashpresencespecmd-whos-online-near-me) above; it's identical.

## How It All Fits Together

```
+------------------------------------------------------------------+
|                          Airhop App                              |
|                                                                  |
|  src/ui/          <- passive views, one feature model each       |
|  src/features/    <- screen logic, consumes core services        |
|  src/store/       <- Zustand + MMKV, one conversation per slot   |
|                                                                  |
|  src/core/                                                       |
|    crypto/        <- identity, Noise XX, Double Ratchet, X3DH    |
|    mesh/          <- packet-codec (v1+v2), flood-router,         |
|                      dedup, gossip-sync (GCS), courier,          |
|                      fragment-manager, announce-manager          |
|    nostr/         <- client, gift-wrap, geo-relay, presence      |
|    payments/      <- Cashu (offline), Nutzap (online)            |
|                                                                  |
|  Native (AirhopBLEModule only)                                   |
|    ios/   -> Swift: CBPeripheralManager + CBCentralManager       |
|              + TorManager (Arti xcframework)                     |
|    android/ -> Kotlin: BluetoothGattServer + BluetoothLeScanner  |
|                 + DeviceMonitoringManager + ForegroundService    |
+------------------------------------------------------------------+
         <-> BLE (Service UUID: F47B5E2D...)
+----------------------------------+
|     bitchat iOS / Android        |  <- wire-compatible, public domain
+----------------------------------+
         <-> Nostr relays (via Tor)
+----------------------------------+
|   Internet bridge (optional)     |  <- 350+ geo-distributed relays
+----------------------------------+
```

**Data flow for an outgoing message:**

1. User sends -> `src/features/` -> `src/core/mesh/` signs + encodes packet
2. TypeScript passes raw bytes to `AirhopBLEModule` native
3. Native writes to BLE characteristic
4. Nearby peers receive, validate signature, decrement TTL, re-broadcast (flood)
5. GCS sync fills in gaps for peers who missed it during partitions
6. Source routing (v0.6.0+) can replace flooding for known paths

**Key things we inherit from bitchat and don't reinvent:**

- The exact wire format (`packet-codec.ts` must match byte-for-byte)
- The Noise XX handshake parameters and key derivation
- Geohash presence spec (kind `20001`, same intervals, same privacy rules)
- GCS gossip sync parameters (same hash scheme for cross-impl compat)
- Source routing v2 packet layout (same byte offsets)
- PTT voice wire format (same burst framing, same message type `0x29`)
