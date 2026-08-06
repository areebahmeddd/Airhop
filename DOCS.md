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

Airhop is built on two open-source (Unlicense / public domain) implementations, `permissionlesstech/bitchat` and `permissionlesstech/bitchat-android`, plus the georelays repository for Nostr relay discovery. Both are free to copy.

They are a local reference checkout rather than part of this repository, so the summaries below stand on their own: each one states what the upstream doc says and what Airhop does about it, and nothing here depends on having the checkout to hand.

## bitchat iOS docs: Summaries

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

**Impact for Airhop:** the same shape exists in `chat-store.ts`. `messages` is one dictionary, and `zustand/persist` serialises the whole persisted slice on every `set()`. One arriving message therefore costs a full JSON encode of every thread, synchronously, on the JS thread.

Partly addressed: the store now `partialize`s (dropping `activeChannel`, which is where the user is looking rather than history, and which was rewriting everything on each thread switch) and coalesces writes on a 400 ms trailing throttle, flushed on backgrounding. That removes the per-message full serialise without a refactor.

Not addressed: the store is still one dictionary rather than a slice per conversation, so appending to chat A still rebuilds chat A's array. Worth doing before the message cap rises.

**Takeaway:** Append should be O(1). Full re-sort on every message is a performance bug waiting to blow up on cheap Android hardware, and the moment it blows up is a gossip catch-up burst after a partition, which is exactly when the mesh matters most.

### REQUEST_SYNC_MANAGER.md: Hardening Gossip Sync Against Spoofing

**What it is:** An upgrade to the mesh sync protocol that tracks outgoing sync requests and validates that responses are solicited.

**The problem before:** Sync requests were broadcast to all neighbors. Responses were accepted from anyone without checking if we'd actually asked them. This opened the door to replaying old packets (timestamp bypass) and unsolicited sync floods.

**The fix:** A `RequestSyncManager` tracks `peerID -> timestamp` of every sync request we send. Normal packets now require timestamps within 2 minutes of the local clock. Sync response packets (marked with new flag `IS_RSR = 0x10`) bypass the timestamp check only if they match a pending request to that specific peer. Unsolicited RSR packets are rejected.

**New features bundled in:**

- `sinceTimestamp` TLV field in REQUEST_SYNC: the responder skips packets older than the requester's filter cursor, avoiding re-sending everything every 30s
- `fragmentIdFilter` TLV: stalled fragment reassembly can request just the specific missing fragment streams instead of triggering a full sync

**Impact for Airhop: implemented.** `src/core/mesh/request-sync-manager.ts` tracks every request against the peer it went to; `gossip-sync.ts` sends unicast and registers before sending; responses carry `IS_RSR` and `ttl = 0`; `mesh-service.isFreshOrSolicited` holds every packet to ±2 minutes at ingress and grants the exemption only to a tagged response from a peer we actually asked.

Three things had to land together, and the doc is clear about why: the freshness window cannot exist without the exemption, the exemption cannot be attributed without unicast, and unattributed sync is what the flag was invented to stop.

**Also implemented from this doc:** `sinceTimestamp` (TLV `0x05`), with the semantics that are easy to get backwards. It is a coverage disclaimer sent **only** when the filter was truncated, never a request boundary. Sent unconditionally it tells every peer to withhold anything older than the requester's oldest packet, which for a device that just joined is exactly the history it turned up for. Airhop's simulation caught that as a latecomer failing to catch up.

**Not implemented: `fragmentIdFilter` (TLV `0x06`).** Airhop neither emits nor reads it. It is an optional narrowing hint, so the omission is compatible in both directions: a peer that sends one gets an ordinary full sync response, which is the behaviour it would fall back to anyway. The gap it leaves is a stalled reassembly recovering through the regular 15-second round rather than asking for the exact missing streams. Worth revisiting if fragment loss shows up in practice; there is no evidence of it today.

**Takeaway:** Gossip sync without request tracking is a spoofing surface. Track what you ask for and reject anything you didn't.

### PEER-ID-ROTATION.md: The Deepest Threat Analysis bitchat Has Written

**What it is:** A 342-line draft for rotating the 8-byte peer ID so a passive listener cannot follow one phone across time and place. Explicitly unshipped: "the derivations and the wire format **are implemented and tested**; nothing is wired into the shipping mesh."

**The problem:** A BLE dongle in a crowd gets four things with no cryptographic attack: that a phone runs bitchat, a permanent identifier for it (`SHA-256(noiseStaticKey)[0..8]`, which never rotates), its long-term public keys and nickname, and, via the `directNeighbors` TLV, the local social graph, from one receiver, with no trilateration.

**The correction that matters:** rotating the ID alone accomplishes nothing. As long as announces carry static keys in cleartext, a rotated ID is re-linked on its first announce. Rotation and announce confidentiality land together or not at all.

**Impact for Airhop: do NOT implement rotation.** It changes the wire protocol, neither bitchat platform can ship it alone, and the doc lists six things it breaks that Airhop has too (outbox keyed by peer ID, fragment reassembly keys, initiator tie-break, dedup, gossip archive, read receipts). Rotating unilaterally would make Airhop invisible to both bitchat clients.

**What we DID take from it:**

- **We never emit the neighbour list.** The doc calls publishing a crowd's adjacency graph an unreasonable price for routing bandwidth, and notes that dropping it is independently backward compatible. Airhop follows routes and never originates them.
- **Origin TTL is randomised for public messages** (5–7 rather than a fixed 7), so a listener cannot read "this radio authored it" off the header. Not applied to announces: the direct-peer rule depends on `ttl === ANNOUNCE_TTL`, and that rule is what stops one hostile peer inventing hundreds of undropable "direct" identities.
- **The courier tag flaw**, which Airhop had inherited verbatim along with a false unlinkability claim. See [PROTOCOLS.md section 6](docs/spec/PROTOCOLS.md#6-store-and-forward-courier-constants).

**Also worth knowing:** rotation would not protect against later key compromise. `K_rot` is long-lived, so whoever seizes a phone can recompute every past epoch's ID and re-identify old radio captures.

### PRIVATE-MEDIA-MIGRATION.md / PRIVATE_MEDIA_V1.md: DM Attachments Are Encrypted Now

**What it is:** The migration from signed-cleartext private files to files sealed inside the Noise session, plus the identity proof that decides which form is safe to use.

**The two wire values:** `NoisePayloadType.privateFile = 0x20` (what current clients send; iOS also accepts `0x09` from its own prerelease builds and never emits it), and `NoisePayloadType.authenticatedPeerState = 0x21`, which is permanent and "part of the protocol security boundary".

**The rule that makes it safe:** the announced `privateMedia` capability bit "is a discovery hint: it starts a Noise handshake, but never selects encrypted sending or creates a pin." Only a `0x21` decrypted inside the session pins the peer's Ed25519 key and authorises encrypted sending. Gating on the announced bit would be a downgrade attack anyone in radio range could run.

**Impact for Airhop: implemented.** Airhop seals DM attachments to `0x20` on a proven bit 8, emits and verifies `0x21` after every completed handshake, and keeps the signed cleartext path only for peers that have not proven they can read one. Without this, every Airhop DM attachment took the path bitchat has scheduled for removal, and was legible to every relay on the way.

### NOISE_PEER_ID_BINDING.md: Announces Are Hints, Not Proof

**What it is:** Android's statement of where identity actually binds, and where it does not.

**The residual it names:** "The first public announcement is still self-signed trust-on-first-use. An attacker can copy a public Noise key and self-sign an announcement, but cannot complete the bound Noise handshake for that ID... discovery metadata or capability bits in an announcement are hints, not proof of Noise-key possession."

**Impact for Airhop:** this is the doc that justifies `0x21`. Airhop's announce checks (derived peer ID, mandatory signature, TOFU pin) are exactly the ones this doc calls insufficient on their own. A key proven in-session now outranks a TOFU pin, which heals the case where an attacker announced first; the reverse is refused.

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

**Impact for Airhop:** `src/core/mesh/packet-codec.ts` handles both v1 (2-byte length, no route) and v2 (4-byte length, optional route). Airhop **follows** routes (`src/core/mesh/source-route.ts`: find ourselves in the hop list, unicast to the next name, fall back to flooding when that hop is unreachable) and **never originates** them.

> **Correction to an earlier version of this file**, which said `announce-manager.ts` must append TLV `0x04` with current direct neighbours. It must not. Route planning needs a topology, and the only way to build one is for every node to publish its neighbour list in cleartext, handing the social graph of the room to anyone with a dongle. bitchat's own PEER-ID-ROTATION analysis rejects that trade and notes dropping the TLV is independently backward compatible. Flooding is the documented fallback and costs us nothing measurable at Airhop's mesh sizes.

**Takeaway:** v2 packets are strictly better: larger files, optional efficient routing, backward compatible. Follow other people's routes; do not publish the map.

### GeohashPresenceSpec.md: "Who's Online Near Me?"

**What it is:** The spec for broadcasting and counting online participants in geohash-based location channels over Nostr.

**How it works:** When the app is open, it sends a Nostr ephemeral event (kind `20001`) to each geohash channel matching your current location. These are heartbeats; they carry no content, just a public key and a geohash tag. Other clients listen for both chat events (kind `20000`) and heartbeats, track the last-seen timestamp per public key, and show a count of anyone seen in the last 5 minutes.

**Privacy built in:** Heartbeats are only sent for coarse precision levels (region, province, city; geohash precision <= 5). Neighborhood-level and finer channels get no presence broadcast. For those, the UI shows `[? people]` instead of `[0 people]` so users understand lurkers might be there. Random delays between broadcasts prevent timing correlation across precision levels.

**Impact for Airhop: implemented.** `src/core/nostr/presence.ts` holds the policy (kind `20001`, precision ≤ 5 only, 40–80s randomised round, 2–5s decorrelation gap between cells) and `geohash-channel-service.ts` drives the schedule, because it is the layer that knows which cells the user is actually in.

Two things were wrong before and are worth recording:

- **The heartbeat never ran.** The entry point was dead code, so Airhop users read participant counts and never appeared in anyone else's, on Airhop or bitchat.
- **One key was used across all three precisions, published together.** Each cell now signs with its own derived key and the round is spaced out, which is what the spec's delays are for: distinct keys arriving in the same instant, round after round, group into one device by timing alone.

Teleported cells are excluded: announcing presence somewhere you are not is a false statement about your location, which is worse than an undercount.

**Takeaway:** "Online counts" leak location. The spec's privacy restrictions exist for a reason. Don't loosen them, and remember that a spec you implemented but never called is not implemented.

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

**Impact for Airhop:** On iOS we use the same Arti xcframework; on Android, Orbot is detected via SOCKS5 on `127.0.0.1:9050`.

> **Airhop diverges here, deliberately.** bitchat is fail-closed and always-on. Airhop ships Tor **off by default on both platforms**, behind one toggle ([ARCHITECTURE.md section 8](docs/spec/ARCHITECTURE.md#8-privacy-and-tor)). Android's Tor depends on the user having installed a second app, so always-on would mean "internet features are broken until you go find Orbot" for most users; and a fail-closed default on iOS pushes a first launch through a bootstrap the user did not ask for. Once the toggle IS on, the fail-closed rule holds exactly as bitchat states it: no clearnet fallback, relays wait for bootstrap. An earlier version of this file described bitchat's default as Airhop's requirement, which contradicted the architecture doc.

**The gap neither project has closed:** there are no bridges or pluggable transports. The vendored Arti build ships without them and Orbot's configuration is outside the app's control, so the first hop is a direct connection to the Tor network and consumer-grade deep packet inspection identifies it on sight. In the places that inspection is deployed, being seen to use Tor is itself the risk. That makes off-by-default the safer setting on its own merits rather than only a convenience call, and it is recorded in the "does NOT protect against" list rather than left implied.

**Takeaway:** with Tor on, never connect to a relay outside it and never hard-code a clearnet fallback. The default is a product decision; the behaviour once enabled is not.

### PUSH-TO-TALK-DESIGN.md: Live Voice Over Bluetooth

**What it is:** The full design for walkie-talkie-style live voice over the BLE mesh.

**The core idea:** Instead of hold-to-record then release-to-send (which delivers audio only after you let go), PTT streams audio frames _while you speak_. The listener hears you with sub-second delay. It's a delivery strategy, not a mode; the system picks it automatically based on whether the peer is reachable on mesh or only via Nostr.

**How it fits in BLE:** BLE moves ~15 KB/s per link. AAC-LC voice at 16 kHz uses ~2 KB/s. Live voice fits comfortably with room for other traffic. Frames are 64ms each (~130 bytes), batched into 210-byte burst packets that never need fragmentation. Public mesh uses a new message type `0x29`; DMs wrap frames inside a Noise session as `NoisePayloadType.voiceFrame = 0x08`.

**Reliability trick:** The finalized voice note is always sent after the live burst ends. Old clients that can't decode live frames still receive the note. Late joiners and out-of-range peers catch up. Live and reliable delivery are not mutually exclusive.

**Receiver behavior:** 350ms jitter buffer, silence insertion for lost frames, auto-converts partial burst to a replayable note. If the finalized note arrives after a complete live burst, it silently replaces the partial file behind the existing bubble with no duplicate message.

**Impact for Airhop:** built in v0.7.0 (`voice-capture.ts` + `voice-player.ts`). Key numbers: `pttMaxBurstContentBytes = 210`, `burstID = 8 random bytes`, `seq = UInt16 BE`, AAC-LC 16kHz mono 16kbps, 350ms jitter buffer, 120s max burst.

**The trap this doc warns about, which Airhop had walked into:** the 210-byte budget only works if the whole encoded frame stays within what one BLE write can carry. Airhop padded every outbound frame to a fixed block, which took a ~309-byte voice packet to 512, over the 467 bytes a fragment carries and at or above most negotiated MTUs, so every live voice packet entered the fragment scheduler that the budget exists to avoid. bitchat leaves `voiceFrame` unpadded for the same reason. Airhop now pads only the types whose length leaks their plaintext (see [PROTOCOLS.md section 2.1](docs/spec/PROTOCOLS.md#21-padding-two-different-rules)), and the voice test asserts on the encoded frame rather than the payload.

**Takeaway:** Live voice over BLE is absolutely feasible. The math works. The trick is keeping frames small enough to skip the fragment scheduler entirely. "The payload is small" is not the same claim as "the frame is small".

## bitchat Android docs: Summaries

### ANNOUNCEMENT_GOSSIP.md: How Peers Share Their Neighbor Lists

**What it is:** The spec for a TLV extension to ANNOUNCE packets that lets peers gossip which other peers they're directly connected to.

**The mechanic:** After the standard nickname/keys TLVs in an ANNOUNCE packet, a sender can optionally append `TLV 0x04` containing up to 10 peer IDs (each 8 bytes, binary-encoded). Receivers use these neighbor lists to build a local mesh topology graph, where nodes are peers and edges are direct connections.

**Backward compatible:** Unknown TLVs are ignored by old clients. Omitting TLV `0x04` is always valid. The gossip data is covered by the Ed25519 signature (since it's part of the payload), so it can't be spoofed.

**Decoding rule:** The neighbor count is `TLV length / 8`; there's no explicit count field. If the length isn't a multiple of 8, ignore the trailing bytes.

**Impact for Airhop: we decode it and never send it.** An earlier version of this file said `announce-manager.ts` must include TLV `0x04`. That was the wrong call for this app, and bitchat's own later analysis says so: the neighbour list is one of the four things a passive listener gets free, and it hands over the adjacency graph of a crowd from a single receiver. For an app scoped to protests and blackouts, that is not worth the relay bandwidth it saves. Airhop builds no topology graph and originates no routes; it follows routes other nodes plan, and otherwise floods, which is the documented fallback.

**Takeaway:** every ANNOUNCE is a hello. Whether it should also be a map of who is standing next to whom is a separate question, and the answer here is no.

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

**Impact for Airhop:** `src/core/mesh/gossip-sync.ts` implements this spec on the iOS constants (15s message round, 400-byte GCS, 1000-packet window) rather than Android's. The GCS is cross-implementation compatible: same hashing (`first 8 bytes of SHA-256 over the 16-byte Packet ID`), same Golomb-Rice encoding, MSB-first bit packing.

Two rules from this doc that are enforced rather than assumed:

- **"MUST NOT be relayed beyond immediate neighbors."** Requests and responses both ride `ttl = 0`. Responses used to be replayed at their original TTL, which meant one peer rejoining after a partition re-flooded the whole archive across the mesh, a failure that looks like a busy room rather than an error.
- **Per-type age bounds.** Announces expire from the candidate set at 60s (consensus rule), public messages at 15 minutes, group messages at 15 minutes, board posts not until their own expiry. A single blanket window would be wrong in both directions: it keeps presence alive after its owner has left, and deletes board posts that are meant to outlive everyone carrying them.

**Which types Airhop gossips.** The request advertises a `SyncTypeFlags` bitfield, and a peer answers only with the types it names. Airhop sets four of the five bits bitchat defines:

| Bit  | Type            | Airhop | Notes                                                                        |
| ---- | --------------- | ------ | ---------------------------------------------------------------------------- |
| `0`  | `ANNOUNCE`      | Yes    | 60 s candidate window                                                        |
| `1`  | `CHANNEL_MSG`   | Yes    | 15 min                                                                       |
| `8`  | `BOARD_POST`    | Yes    | 7 day backstop; the board store owns real expiry                             |
| `9`  | `PREKEY_BUNDLE` | No     | Bundles reach the mesh by flood on link-up, not by reconciliation. See below |
| `10` | `GROUP_MESSAGE` | Yes    | 15 min. Ciphertext only: a relay carries it without holding the epoch key    |

The bitfield is a length-prefixed little-endian integer with trailing zero bytes trimmed, and unknown bits map to no type, so a peer that sets a bit we do not implement gets a normal response covering the types we do. Leaving bit 9 clear is compatible in both directions; [PROTOCOLS.md section 5.2](docs/spec/PROTOCOLS.md#52-sync-type-bits) records what it costs.

**Takeaway:** GCS sync is what makes the mesh eventually consistent across partitions without flooding. Every disconnected pocket that rejoins can catch up efficiently. It's not a nice-to-have; it's how the mesh stays coherent, and only if catching up stays local.

### device_manager.md: Blocking Misbehaving Bluetooth Devices

**What it is:** The design for `DeviceMonitoringManager`, a lightweight component that blocks or disconnects BLE devices that behave badly.

**What it protects against:**

- Devices that connect but never send an ANNOUNCE within 15 seconds (scanner bots, probers)
- Devices that go silent for over 60 seconds (stale connections wasting BLE slots)
- Devices that disconnect with errors 5+ times in 5 minutes (buggy firmware or attack)

**How it works:** Each device (by MAC address) gets a 15-second ANNOUNCE timer and a rolling 60-second inactivity timer. Both reset on legitimate traffic. Error disconnects are counted; hitting 5 in 5 minutes triggers a 15-minute block. Blocked devices are refused at both client (no outgoing connection) and server (immediate `cancelConnection`).

**Panic wipe integration:** Triple-tapping the title clears the blocklist and all device tracking state. Panic wipe already covers this.

**Impact for Airhop: implemented in `AirhopBLEModule.kt`.** A 15s first-traffic deadline, a 60s inactivity reap, and a 5-errors-in-5-minutes block for 15 minutes, refused at both the client (no dial) and the server (`cancelConnection`).

One deliberate difference: bitchat keys the first deadline on a validated ANNOUNCE, which would mean telling native code what an ANNOUNCE is. Airhop's rule is "no inbound bytes at all in 15s", which catches the same devices, since a real peer announces within a few seconds of connecting. It also keeps protocol knowledge out of the native layer, which is one of this project's non-negotiables.

iOS is not covered. CoreBluetooth manages the connection budget itself and does not surface the same status-133 pressure that makes an Android slot precious; the same declared-no-op treatment as the power policy.

**Takeaway:** BLE connection slots are scarce. Don't waste them on devices that won't talk properly. Block early, unblock automatically.

### file_transfer.md: Sending Files Over Bluetooth

**What it is:** The exhaustive wire protocol spec for sending voice notes, images, and arbitrary files over BLE, including interactive features like waveform seeking.

**The packet format (v2):**

- Envelope: standard `BitchatPacket` with `type = 0x22` (FILE_TRANSFER), always v2
- v2 header: **16 bytes (vs. 14 for v1)**, with payload length expanded to 4 bytes (supports up to 4 GiB). The Android doc says 13→15; it is off by one (it omits the version byte). Both bitchat codebases and [PROTOCOLS.md section 2](docs/spec/PROTOCOLS.md#2-packet-frame-layout) say 14→16, and that is what Airhop implements
- Payload: TLV structure: `0x01` filename, `0x02` file size (4 bytes), `0x03` MIME type, `0x04` content (4-byte length prefix)
- Transport fragmentation still applies: large files split into fragments of 467 data bytes, sized so the whole encoded frame fits the 512-byte BLE write ceiling

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
|  src/store/       <- Zustand, one MMKV partition per domain      |
|                      (wallet-store is AES-256 encrypted)         |
|  src/services/    <- mesh-service, wallet-service (all mint      |
|                      calls), ecash-transfer (peer hand-off)      |
|                                                                  |
|  src/core/                                                       |
|    crypto/        <- identity, Noise XX, Noise X (courier seal), |
|                      Double Ratchet, QR contact exchange         |
|    mesh/          <- packet-codec (v1+v2), flood-router,         |
|                      dedup, gossip-sync (GCS), courier,          |
|                      fragment-manager, announce-manager          |
|    nostr/         <- client, gift-wrap, geo-relay, presence      |
|    payments/      <- Cashu (offline: detect, decode, DLEQ,       |
|                      select), Nutzap (NIP-61 online)             |
|                                                                  |
|  Native modules (BLE, voice, Tor, same-platform WiFi)            |
|    ios/   -> Swift: CBPeripheralManager + CBCentralManager,      |
|              AirhopVoiceModule, TorManager (Arti xcframework),   |
|              MultipeerConnectivity                               |
|    android/ -> Kotlin: BluetoothGattServer + BluetoothLeScanner, |
|                 device monitoring, foreground service,           |
|                 AirhopVoiceModule, WiFi Aware                    |
+------------------------------------------------------------------+
         <-> BLE (Service UUID: F47B5E2D...)
+----------------------------------+
|     bitchat iOS / Android        |  <- wire-compatible, public domain
+----------------------------------+
         <-> Nostr relays (via Tor)
+----------------------------------+
|   Internet bridge (optional)     |  <- 300+ geo-distributed relays
+----------------------------------+
```

**Data flow for an outgoing message:**

1. User sends -> `src/features/` -> `src/core/mesh/` signs + encodes packet
2. TypeScript passes raw bytes to `AirhopBLEModule` native
3. Native writes to BLE characteristic
4. Nearby peers receive, validate signature, decrement TTL, re-broadcast (flood)
5. GCS sync fills in gaps for peers who missed it during partitions
6. A packet that arrives carrying a source route is forwarded along it instead of flooded. Airhop follows routes and never originates them, so this narrows other people's traffic, not our own

## Where Airhop Deliberately Differs

Everything else in this file is bitchat's design, followed. These three are not, and each is a decision rather than an omission.

|                                 | bitchat                | Airhop                                          | Why                                                                                                                                                                                             |
| ------------------------------- | ---------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Neighbour list (`TLV 0x04`)** | Emitted                | Decoded, never emitted                          | Publishing a crowd's adjacency graph to any nearby dongle is not worth the routing bandwidth. bitchat's own rotation analysis reaches the same conclusion. Routes we receive are still followed |
| **Tor**                         | Fail-closed, always on | Off by default, one toggle; fail-closed once on | Android Tor needs a second app installed. Always-on would mean "internet is broken until you find Orbot" for most users                                                                         |
| **Origin TTL**                  | Fixed at max           | 5 to 7 for public messages                      | Removes the deterministic "this radio authored it" marker. Not applied to announces, where the direct-peer rule depends on `ttl === ANNOUNCE_TTL`                                               |

Everything on the wire is inherited and must not drift:

- The packet frame, byte for byte (`packet-codec.ts`)
- The Noise XX handshake parameters and key derivation
- The geohash presence spec (kind `20001`, same intervals, same privacy rules)
- The GCS gossip sync parameters, including the hash scheme both sides reconcile against
- The source-route v2 layout, at the same byte offsets
- The push-to-talk burst framing and message type `0x29`

## Corrections to Earlier Versions of This File

Recorded rather than silently edited, because each one was acted on:

1. **"`announce-manager.ts` must include TLV `0x04`"**. It must not. See above.
2. **"v2 header: 15 bytes (vs. 13 for v1)"**. It is 16 vs 14. The Android file-transfer doc is off by one; both bitchat codebases say 16.
3. **"Tor... fail-closed by default"** described as an Airhop requirement. It is bitchat's default, and it contradicted [ARCHITECTURE.md section 8](docs/spec/ARCHITECTURE.md#8-privacy-and-tor), which the code follows.
4. This file summarised the refactoring and feature docs and skipped the threat-model ones. `PEER-ID-ROTATION.md`, `PRIVATE-MEDIA-MIGRATION.md` and `NOISE_PEER_ID_BINDING.md` are now covered above; each turned out to describe something Airhop was getting wrong.
5. **The public participant list** was listed here as a deliberate divergence. It is not one: once the presence heartbeat was wired up, Airhop's counts matched bitchat's again.
