# Airhop: Build Plan

> **This is the "what and when" document.** For _why_ we're building this, see [`docs/design/VISION.md`](VISION.md). For _how_ things are architected, see [`docs/spec/ARCHITECTURE.md`](../spec/ARCHITECTURE.md). For exact protocol constants, see [`docs/spec/PROTOCOLS.md`](../spec/PROTOCOLS.md).

## 1. Where Airhop Fits: Gap Analysis vs bitchat

bitchat is an excellent foundation. Airhop fills the gaps it left open.

### Gap 1: Unified Codebase

**bitchat problem:** iOS and Android are separate native codebases that drift. The Android v0.7 fragment size mismatch (500B vs 150B) broke iOS-Android compatibility for months with no one noticing.  
**Airhop:** Single TypeScript protocol stack. A protocol bug surfaces on both platforms simultaneously, and fixes apply simultaneously.

### Gap 2: Video Support

**bitchat problem:** No video packet type, no mechanism, no MIME type for video.  
**Airhop (v0.8.0):** `0x30: videoFrame` packet type over WiFi Aware. 480p/15fps is the BLE ceiling (~80 KB/s). Real video requires WiFi Direct or MultipeerConnectivity.

### Gap 3: Live PTT Voice (from day 1)

**bitchat problem:** Fully designed (`PUSH-TO-TALK-DESIGN.md`) but never shipped.  
**Airhop (v0.7.0):** `0x29: voiceFrame` broadcast type, AAC 16 kHz mono, 350ms jitter buffer, fallback to voice note.

### Gap 4: Larger File Transfers

**bitchat problem:** Hard 1 MiB cap in `FileTransferLimits`.  
**Airhop:** Chunked streaming transfer. 64 KB chunks, sequence tracking, partial delivery. No hard protocol cap.

### Gap 5: Tor on iOS and Android

**bitchat problem:** Tor on iOS only (via Arti xcframework) at the time of writing. Android has no Tor integration.  
**Airhop:** Orbot (SOCKS5 on localhost:9050) detection for short-term. Long-term: embedded `tor` binary in APK.

### Gap 6: Double Ratchet for Offline Mail

**bitchat problem:** Courier envelopes use Noise X (one-way). Compromise of recipient's static key exposes all undelivered mail.  
**Airhop (v0.8.0):** Full Signal Double Ratchet (DR) + X3DH initialization. Prekey bundles on Nostr. Per-message forward secrecy everywhere.

### Gap 7: WiFi Direct / WiFi Aware Transport

**bitchat problem:** BLE-only (~15 KB/s). Android WiFi Aware support exists but is experimental/unshipped.  
**Airhop (v0.8.0):** Android WiFi Aware + iOS MultipeerConnectivity. Automatic transport selection: WiFi when available, BLE fallback. Enables video, large files, high-quality voice.

### Gap 8: Non-Technical UX

**bitchat problem:** No onboarding. Users see raw hex peer IDs. Contact verification is manual fingerprint comparison.  
**Airhop:** Human-readable usernames (Adjective + Noun + 4-digit suffix, deterministic from pubkey). QR bootstrap. NFC tap-to-connect.

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AIRHOP APPLICATION                                 │
│                                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Mesh Chat   │  │ Direct Msgs  │  │ Location Chs │  │ Contacts & Keys │   │
│  │ (public)    │  │ (Noise/DR)   │  │ (geo Nostr)  │  │ (QR/NFC/manual) │   │
│  └─────────────┘  └──────────────┘  └──────────────┘  └─────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              MESSAGE ROUTER (TypeScript)                            │    │
│  │  canDeliverPromptly() → BLE first → WiFi second → Nostr third       │    │
│  │  → Courier envelope (store-and-forward) → Double Ratchet step       │    │
│  └──────────────────────────────┬──────────────────────────────────────┘    │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐    │
│  │              CRYPTO ENGINE (TypeScript, @noble)                     │    │
│  │  NoiseXX │ DoubleRatchet │ X3DH │ HKDF │ Ed25519-sign │ GCS-filter  │    │
│  └──────────┬─────────────────────────────────────┬────────────────────┘    │
│             │                                     │                         │
│  ┌──────────▼──────────────────┐     ┌────────────▼───────────────────┐     │
│  │   BLE MESH ENGINE (TS)      │     │   NOSTR TRANSPORT (TS)         │     │
│  │  PacketCodec, TTL flood     │     │  nostr-tools NIP-17/59         │     │
│  │  GossipSync (GCS filter)    │     │  SimplePool → 350+ relays      │     │
│  │  CourierStore, Fragments    │     │  GeoRelayDirectory, Tor proxy  │     │
│  └──────────┬──────────────────┘     └────────────────────────────────┘     │
│             │ JSI TurboModule                                               │
│  ┌──────────▼──────────────────────────────────────────────────────────┐    │
│  │              AIRHOP NATIVE BLE MODULE                               │    │
│  │  iOS: CBPeripheralManager + CBCentralManager (Swift ~400 lines)     │    │
│  │  Android: BluetoothGattServer + BluetoothLeScanner (Kotlin ~500 ln) │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3. Version Targets

### v0.5.0: Foundation ✅

**Goal:** Hello World BLE mesh between two phones.

- [x] Set up Expo bare workflow with TypeScript strict
- [x] `AirhopBLEModule` iOS (Swift, ~400 lines): dual-role GATT server + client
- [x] `AirhopBLEModule` Android (Kotlin, ~490 lines): dual-role GATT
- [x] `AirhopForegroundService.kt`: background keepalive (foreground service, `connectedDevice` type)
- [x] Wire TurboModule to `src/bridge/NativeAirhopBLE.ts`
- [x] `src/core/mesh/packet-codec.ts`: binary encode/decode matching bitchat v2 (`PROTOCOLS.md`, section 2)
- [x] `src/core/mesh/flood-router.ts`: TTL flood, jitter 10-220ms, dedup
- [x] `src/core/mesh/announce-manager.ts`: signed presence broadcasts
- [x] `src/core/crypto/identity.ts`: key generation, Keychain storage, peer ID

**Milestone:** Two phones discover each other and exchange signed ANNOUNCE packets.

### v0.6.0: Core Messaging ✅

**Goal:** Full offline BLE mesh chat, bitchat wire-compatible.

- [x] `src/core/crypto/noise-xx.ts`: Noise XX handshake using `@noble` (transport session, replay window)
- [x] `src/core/crypto/noise-x.ts`: one-way Noise X for courier sealing
- [x] `src/core/mesh/fragment-manager.ts`: fragmentation / reassembly (469B chunks, 30s timeout)
- [x] `src/core/mesh/gossip-sync.ts`: GCS filter reconciliation (15s interval, Golomb-Rice encoding)
- [x] `src/core/mesh/courier-store.ts`: sealed envelopes, trust tiers, spray-and-wait
- [x] `src/core/router/message-router.ts`: BLE-only routing (broadcast + unicast + courier fallback)
- [ ] Cross-language Noise XX test: JS ↔ bitchat-ios Swift server (required before device testing)
- [x] Basic React Native UI: channel list, message thread, peer list (minimal, functional)

**Milestone:** Full offline BLE mesh chat. Airhop ↔ bitchat message delivery verified.

### v0.7.0: Internet Bridge + Voice + Payments

**Goal:** Nostr fallback, live PTT voice, Cashu ecash.

- [ ] `src/core/nostr/client.ts`: SimplePool, auto-reconnect
- [ ] `src/core/nostr/gift-wrap.ts`: NIP-17/59 gift-wrap DMs
- [ ] `src/core/nostr/geo-relay.ts`: Haversine nearest relay from bundled CSV
- [ ] `src/core/nostr/presence.ts`: kind 20001 geohash heartbeats
- [ ] `CourierStore.ts`: Nostr bridge courier drops (kind 1401)
- [ ] iOS: Arti Tor integration (copy from `bitchat/ios/`)
- [ ] Android: Orbot SOCKS5 proxy detection
- [ ] `src/core/payments/cashu.ts`: token parse/embed/redeem
- [ ] `src/core/payments/nutzap.ts`: NIP-61 online zaps
- [ ] `VoiceCapture.ts` + `VoicePlayer.ts`: PTT AAC 16 kHz, jitter buffer

**Milestone:** Cross-city DMs via Nostr. Live voice PTT over BLE. Cashu offline payment working.

### v0.8.0: High Bandwidth + Double Ratchet

**Goal:** High-bandwidth transport and per-message forward secrecy.

- [ ] `src/core/crypto/double-ratchet.ts`: Signal DR per-message forward secrecy
- [ ] `src/core/crypto/x3dh.ts`: X3DH prekey agreement; bundles published to Nostr
- [ ] WiFi Aware native module (Android) + MultipeerConnectivity (iOS)
- [ ] Chunked file transfer >1 MiB (streaming reassembly)
- [ ] Video frame capture (react-native-vision-camera v4, HEVC)
- [ ] `0x30: videoFrame` packet type (WiFi Direct only)

**Milestone:** Offline video calling over WiFi Aware. Double Ratchet passing test vectors.

### v0.9.0: Production Hardening

**Goal:** All features complete, hardened, and cross-platform verified.

- [ ] NFC contact exchange (`react-native-nfc-manager`)
- [ ] QR code scanner for peer verification
- [ ] Human-readable usernames (deterministic from pubkey)
- [ ] Panic wipe (triple-tap logo; all keys and data destroyed in <1s)
- [ ] Battery optimization flow (Android OEM whitelist request)
- [ ] Georelays in-app relay map
- [ ] Full cross-platform compat test: Airhop ↔ bitchat-ios ↔ bitchat-android

**Milestone:** Feature-complete. Every core service has passing tests. No known protocol bugs.

### v1.0.0: UI + App Store Release

**Goal:** Production UI polish and public release.

- [ ] Onboarding flow (first launch, key generation, username reveal)
- [ ] Visual design pass (typography, spacing, colour system, dark/light mode)
- [ ] Animations and transitions (react-native-reanimated)
- [ ] Accessibility audit
- [ ] App Store and Play Store submission
- [ ] YouTube demo series: full offline mesh demo, voice PTT across 3 devices, Cashu payment over BLE, Nostr bridge handoff, panic wipe

**Milestone:** Submitted to app stores. Demo videos published.

### v1.1.0 to v1.3.x: Stabilization

**Goal:** Harden the v1.0.0 release before expanding to new platforms.

No new features ship in this range. The focus is production bugs found after launch, race conditions in the BLE and crypto state machines, UI iteration from real user feedback, and extended cross-device battery and compatibility testing. The mesh backend gets battle-tested across as many device and OS combinations as possible before the codebase expands to new targets.

**Milestone:** Zero open P0/P1 bugs. BLE state machine stable across Pixel, Samsung, and Xiaomi device classes. Ready to expand to new platforms.

### v1.4.0: Web / Browser

**Goal:** A Nostr-only web companion that shares the TypeScript protocol core.

Web Bluetooth cannot advertise as a GATT Peripheral, so browser tabs cannot participate in the BLE mesh. The web target is a Nostr-only interface: private DMs, group channels, geo-relay discovery, Cashu payments, and full identity and crypto. It is a lightweight companion for desktop or remote use, not a mesh node.

Browser support is limited by the Web Bluetooth API. Chrome and Edge support it. Firefox and Safari do not, and there is no polyfill path. The app will detect the browser and show a clear unsupported notice on Firefox and Safari rather than silently failing.

- [ ] `react-native-web` build target
- [ ] BLE-dependent code paths gated behind platform checks so the build does not fail
- [ ] Nostr client, gift-wrap DMs, geo-relay, and payments working in browser
- [ ] Progressive Web App manifest for offline caching
- [ ] Hosted as a static bundle (no server required)
- [ ] Unsupported browser notice for Firefox and Safari

**Milestone:** A browser tab exchanges encrypted DMs with an Airhop mobile node over Nostr.

### v1.5.0: Terminal / CLI

**Goal:** A headless Node.js node for Linux, Raspberry Pi, or any server.

The TypeScript protocol core runs in Node.js without React Native. A terminal node participates in the Nostr bridge, acts as a persistent store-and-forward courier, and can run BLE on Linux via BlueZ. Useful for fixed relay infrastructure in a space where phones are not always present.

- [ ] Node.js build target for `src/core/` (strip React Native platform imports)
- [ ] Linux BLE via `@abandonware/noble` (BlueZ wrapper for Node.js)
- [ ] CLI interface: join channel, send message, peer list, relay stats
- [ ] Daemonize support for always-on relay nodes
- [ ] Docker image for straightforward deployment

**Milestone:** A Raspberry Pi running Airhop CLI relays BLE packets between two mobile nodes.

### v1.6.0: Smartwatch Companions

**Goal:** Lightweight companion apps for Apple Watch and Wear OS that extend Airhop's interface to the wrist without requiring any change to the core protocol.

Neither watchOS nor Wear OS provide the background BLE execution primitives needed to act as a full mesh relay node. The watch apps are companion interfaces that communicate with the Airhop phone app, not standalone nodes.

**Apple Watch (watchOS)**
Built in SwiftUI using WatchConnectivity to communicate with the iOS Airhop app.

- [ ] Incoming message notifications with sender name and channel
- [ ] Quick reply from a set of short pre-defined responses
- [ ] Panic wipe trigger: a specific gesture or button sequence on the watch sends an immediate wipe command to the paired iPhone, destroying all keys and message content in under one second
- [ ] Contact tap via NFC on supported Watch models (Series 7+)
- [ ] App Clip / glanceable recent messages complication

**Wear OS (Android)**
Built in Kotlin with Jetpack Compose for Wear, using the Wearable Data Layer API.

- [ ] Incoming message notifications mirrored from the Android app
- [ ] Quick reply support
- [ ] Panic wipe trigger matching the Apple Watch behaviour
- [ ] Tile showing unread message count and last sender

**Milestone:** A user can read incoming messages and trigger a full panic wipe from their wrist on both Apple Watch and Wear OS.

### v1.7.0: Desktop (macOS + Windows)

**Goal:** Native desktop apps, macOS first.

**macOS** is the priority. CoreBluetooth runs on macOS with the same API surface as iOS. The existing Swift `AirhopBLEModule` requires minimal changes. The bitchat project already ships a macOS target, so this path is well-understood.

**Windows** is secondary. BLE is supported via WinRT Bluetooth APIs, but it requires a new native module since the Swift code does not run on Windows. The `react-native-windows` target is the React Native path. This is a separate work stream and ships as a point release after macOS stabilizes.

- [ ] `react-native-macos` target added to the project
- [ ] `AirhopBLEModule.swift` audited and tested on macOS (CoreBluetooth is identical)
- [ ] macOS-specific entitlements and sandbox config (`bitchat-macOS.entitlements` as reference)
- [ ] MultipeerConnectivity enabled on macOS
- [ ] Mac App Store submission
- [ ] `react-native-windows` target scoped and scheduled
- [ ] Windows BLE native module via WinRT Bluetooth APIs
- [ ] Microsoft Store submission

**Milestone:** A macOS node joins the BLE mesh alongside iOS and Android peers. Windows target scoped and in progress.

### v1.8.0: SDK / Library

**Goal:** Extract the protocol core into a versioned, documented public package and extend it to other languages before the security audit locks down the API surface.

`src/core/` is already structured as a pure TypeScript library: named exports, strict mode, no UI coupling. v1.8.0 formalises this into a standalone package. Shipping the SDK before the audit means v1.9.0 covers the public API as well as the internal protocol, and third-party developers building on `@airhop/core` inherit the same cryptographic guarantees.

Developers will be able to build bitchat-compatible applications without reimplementing Noise XX, the GCS gossip filter, Double Ratchet, or the packet codec. More independent implementations of the same wire protocol means a larger, more resilient mesh network for everyone.

- [ ] Extract `src/core/` as a standalone npm package (`@airhop/core`) with semantic versioning
- [ ] Extract `AirhopBLEModule` as a distributable React Native library (`@airhop/ble`)
- [ ] Compile `@airhop/core` to WebAssembly for cross-language embedding
- [ ] Python SDK (`airhop-core` on PyPI) wrapping the WASM build; targets server-side relay nodes and research tooling
- [ ] Rust crate (`airhop-core` on crates.io) for high-performance relay and IoT infrastructure
- [ ] Go module for deployment in server and container contexts
- [ ] Define and stabilize the public API surface; mark internal utilities as private
- [ ] Developer documentation: API reference, integration guide, example apps for each language
- [ ] Publish all packages under the MIT license
- [ ] Example: a minimal bitchat-compatible node built entirely on `@airhop/core` in under 200 lines

#### Custom Application Profiles

The SDK enables organizations and developers to ship purpose-built versions of Airhop with a specific subset of features, custom branding, and modified defaults. The protocol layer and security guarantees remain unchanged; only the application surface is configurable.

- [ ] Define a build-time configuration interface for enabling and disabling feature modules (`payments`, `voice`, `video`, `nostr`, etc.)
- [ ] Document the supported customization surface and the hard constraints that cannot be changed (crypto stack, packet signing, wire protocol)
- [ ] Reference build: a stripped-down emergency communications profile using `@airhop/core` and `@airhop/ble` with location sharing prioritized and no payment features
- [ ] Reference build: a high-anonymity profile with no persistent usernames, ephemeral-only channels, and stricter Tor defaults

**Milestone:** `@airhop/core` published on npm, PyPI, and crates.io. A third-party app built on the SDK joins the mesh. Two reference custom builds ship.

### v1.9.0: Security Hardening

**Goal:** Independent verification of every security guarantee before the v2.0.0 flagship release.

This phase exists because cryptographic correctness cannot be self-certified. The Noise XX state machine, Double Ratchet ratchet steps, key storage boundaries, and packet signing paths all require external eyes before Airhop can be recommended for high-risk use. The v1.8.0 SDK packages (`@airhop/core`, `@airhop/ble`) are included in the audit scope, because a public API that ships without independent review is a liability for every downstream developer building on it.

- [ ] Engage a third-party security firm (Cure53 or equivalent) for a full cryptographic audit covering `src/core/crypto/`, packet signing, key storage, and the public API surface of `@airhop/core`
- [ ] Engage a second independent auditor for the BLE mesh layer, Nostr bridge, and `@airhop/ble` (two firms, separate scopes)
- [ ] Fuzz the packet codec and fragment reassembly engine with malformed, truncated, and oversized inputs
- [ ] Chaos testing: random packet corruption mid-relay, partial fragment delivery, out-of-order reassembly, simultaneous peer disconnects
- [ ] Adversarial peer simulation: malicious relay injecting forged packets, Sybil node flooding, replay attack attempts, TTL manipulation
- [ ] Verify that all unsigned and signature-invalid packets are silently dropped with no observable side effects
- [ ] Remediate all findings from both audits before proceeding to v2.0.0
- [ ] Publish audit reports publicly

**Milestone:** Both audits complete with no open critical or high findings. All recommendations addressed or formally accepted with documented rationale.

### v2.0.0: Flagship Interface

**Goal:** Ship a production-grade chat interface after the SDK and security audit are complete, and formalise the public-transparency commitment.

#### Flagship Chat Interface

A complete redesign of the UI targeting both modern and constrained devices, following established messaging app UX conventions.

- [ ] Full UI/UX audit against established messaging app conventions (signal, whatsapp, telegram interaction patterns)
- [ ] Redesign with a consistent design system: typography scale, spacing, colour tokens, dark and light mode
- [ ] Accessibility audit: WCAG 2.1 AA compliance, screen reader support, dynamic text sizing
- [ ] Performance profiling on low-end hardware (2GB RAM Android devices, iPhone 7 class)
- [ ] Reduced-motion mode and battery-aware rendering
- [ ] Broad device compatibility: Android API 21+ (Android 5.0, 2014), iOS 14+
- [ ] Smooth animations via `react-native-reanimated` that degrade gracefully on old hardware

**Milestone:** The redesigned UI ships as an update across iOS, Android, macOS, and web. WCAG 2.1 AA verified.

#### Transparency and Public Knowledge

Airhop is built on the premise that private communication should be understandable, not just trusted. v2.0.0 formalises a commitment to keeping the technical documentation current and making the knowledge behind it accessible.

- [ ] 100% of public API behaviour documented; no undocumented features or silent changes between releases
- [ ] CVEs and security findings disclosed publicly as soon as a fix is available, with a clear timeline and impact assessment
- [ ] Audit reports published in full with no redactions
- [ ] Blog series: practical guides on building truly private, decentralized applications covering topics such as Noise protocol implementation, offline-first architecture, BLE mesh design, Cashu integration, and Nostr identity management
- [ ] Each guide written for developers who want to build on top of Airhop or implement compatible systems independently
- [ ] YouTube deep-dive series: how the BLE mesh works, how Noise XX is implemented, how Double Ratchet provides forward secrecy, how Cashu tokens transfer offline

### v3.0.0: Plugin Integrations

**Goal:** Extend Airhop with opt-in plugins for social federation and regional payment systems, without touching the core protocol.

Airhop's identity model (Ed25519 keypairs, no accounts) is compatible in spirit with both the [AT Protocol](https://atproto.com) (ATProto, used by Bluesky) and [ActivityPub](https://w3.org/TR/activitypub/) (the W3C standard used by Mastodon, Pixelfed, PeerTube, and the broader Fediverse). v3.0.0 introduces `SocialPlugin` and `PaymentPlugin` interfaces that let users opt in to bridging their Airhop identity to these networks and payment systems. Each plugin is a discrete, auditable integration that users enable individually.

All plugins are strictly opt-in. Users who do not enable any plugin are unaffected. The BLE mesh protocol, wire format, and on-device encryption are unchanged. No plugin can access private keys or relay traffic without explicit per-action user confirmation.

#### AT Protocol (Bluesky)

- [ ] AT Protocol DID resolution and keypair association (`did:key` derived from Airhop's Ed25519 identity)
- [ ] Read feed integration: pull Bluesky home and discovery feeds into a dedicated Airhop tab
- [ ] Post bridge: optionally publish Airhop channel messages as Bluesky records (`app.bsky.feed.post` lexicon)
- [ ] Follow graph import: discover which Bluesky contacts are also Airhop users via DID cross-referencing
- [ ] PDS (Personal Data Server) self-hosting option for users who want full data sovereignty

#### ActivityPub / Fediverse

- [ ] ActivityPub Actor construction from Airhop's Ed25519 identity
- [ ] Mastodon-compatible inbox and outbox: receive mentions and DMs from any ActivityPub-compliant server
- [ ] Outbound posting: optionally broadcast Airhop public channel messages as ActivityPub Notes
- [ ] WebFinger lookup for Fediverse contact discovery

#### UPI Payment Plugin (India)

UPI is an overlay on India's IMPS infrastructure operated by NPCI under RBI. Every transaction is a real-time bank-to-bank transfer with full KYC linkage, visible to NPCI and the Indian government. This is structurally incompatible with Airhop's core threat model, so Cashu remains the correct offline payment system.

For Indian users who want to transact in Rupees when online, UPI works cleanly as an opt-in plugin. Android's standard UPI deep link (`upi://pay?pa=...`) lets any UPI-registered app (GPay, PhonePe, BHIM) handle payment initiation with no NPCI API keys required.

- [ ] `UPIPaymentPlugin` implementing the `PaymentPlugin` interface
- [ ] Deep link payment initiation: `upi://pay?pa=recipient@upi&am=...&cu=INR` (Android only)
- [ ] Opt-in only, disabled by default
- [ ] Disclosure shown on enable: "UPI transactions are linked to your verified identity and visible to NPCI. Do not use for sensitive communications."
- [ ] Only activates when internet is available; no offline UPI
- [ ] Shares UPI ID as contact info only; no bank details transmitted

> Additional plugins for new integrations can be proposed and documented here as the ecosystem grows.

#### Plugin Architecture

- [ ] Define a generic `Plugin` interface in `src/core/` with typed subtypes for each integration category, so any future integration can be added without modifying core protocol code
- [ ] Plugin registry: users see available plugins and opt in per-plugin with explicit permission prompts
- [ ] Strict data boundary: plugins can only access content the user explicitly marks as shareable; BLE mesh traffic is never exposed to plugins
- [ ] Plugin capability model: no plugin can access private keys or contact the network on behalf of the user without a per-action confirmation

**Milestone:** A user can link their Airhop identity to a Bluesky DID and a Mastodon actor, view their Bluesky feed inside Airhop, and optionally cross-post to both networks. Indian users can initiate UPI payments from a contact's profile when online.

_Personal goal: I hope this thing takes off and I become a millionaire_

## 4. Risk Register

### Risk 1: iOS Background BLE Killing

**Probability:** High. iOS 17+ is aggressive about suspending background apps.  
**Impact:** iOS nodes drop from mesh when screen is off.  
**Mitigation:** `CBCentralManagerOptionRestoreIdentifierKey` state restoration. Accept the limitation: iOS is a "softer node." Document it in UX. Get Android working first; it's more reliable.

### Risk 2: Android BLE Peripheral Fragmentation

**Probability:** Medium. Samsung, Huawei, Xiaomi OEMs have non-standard BLE stacks.  
**Impact:** Dual-role (central + peripheral simultaneously) fails on some devices.  
**Mitigation:** Test matrix: Pixel (reference), Samsung Galaxy, Xiaomi. Graceful degradation to central-only if peripheral fails to start. Maintain a device-specific quirk workaround list (bitchat has already accumulated this).

### Risk 3: @noble Crypto Performance on Old Phones

**Probability:** Medium. X25519 is ~0.5ms on M4; could be 5–10ms on a 2019 Android budget phone.  
**Impact:** 20 simultaneous handshakes = 100–200ms blocking.  
**Mitigation:** Run crypto on a separate JS worker thread. Cache established sessions. React Native exposes `crypto.subtle` with hardware AES as fallback for symmetric operations.

### Risk 4: Noise XX Implementation Correctness

**Probability:** Low-medium. The state machine is subtle (wrong MixHash/MixKey order silently breaks).  
**Impact:** Interop failure between Airhop and bitchat nodes; potential session key leak.  
**Mitigation:** Use bitchat-ios as ground truth reference. Mandatory: cross-language test (JS client ↔ bitchat-ios Swift server). Official noiseprotocol.org test vectors. Do not ship v0.6.0 until this passes.

### Risk 5: GCS Filter Compatibility

**Probability:** Low. A single off-by-one breaks gossip sync silently.  
**Impact:** Gossip sync stops working; mesh reachability degrades.  
**Mitigation:** Extract bitchat's GCS test vectors. Verify JS output against Swift output for 10,000 inputs.

### Risk 6: Expo Managed vs Bare Decision

**Probability:** None. Already decided.  
**Resolution:** **Bare workflow from day 1.** BLE TurboModule required from day 1 makes managed workflow impossible.

## 5. What to Reuse from bitchat

Everything under the Unlicense. Copy verbatim, no attribution required.

### From bitchat/ios (Swift → TypeScript translation reference)

| Component                      | Reuse Strategy                                                        |
| ------------------------------ | --------------------------------------------------------------------- |
| `BLEService.swift`             | Port GATT logic to Swift TurboModule. Use for edge cases.             |
| `NoiseSession.swift`           | Line-for-line TypeScript translation. Test vectors.                   |
| `GossipSyncManager.swift`      | Full TypeScript port. GCS filter logic.                               |
| `CourierStore.swift`           | Full TypeScript port. Trust tier logic.                               |
| `BLEFanoutSelector.swift`      | Full TypeScript port. Deterministic subset selection.                 |
| `MessageDeduplicator.swift`    | Full TypeScript port. LRU seen-set.                                   |
| `BLEFragmentHandler.swift`     | Full TypeScript port.                                                 |
| `TransportConfig.swift`        | Copy all constants. See `docs/spec/PROTOCOLS.md`.                     |
| `GeoRelayDirectory.swift`      | TypeScript port using nostr-tools.                                    |
| `GeohashPresenceService.swift` | TypeScript port.                                                      |
| Protocol binary format         | Exact byte layout preserved. See `docs/spec/PROTOCOLS.md`, section 2. |

### From bitchat/android (Kotlin → TypeScript/Kotlin)

| Component                       | Reuse Strategy                             |
| ------------------------------- | ------------------------------------------ |
| `BluetoothGattClientManager.kt` | Port to Airhop Android BLE TurboModule     |
| `BluetoothGattServerManager.kt` | Port to Airhop Android BLE TurboModule     |
| `FragmentManager.kt`            | TypeScript port                            |
| `SecurityManager.kt`            | TypeScript port (dedup, replay protection) |
| `StoreForwardManager.kt`        | TypeScript port                            |
| `PacketRelayManager.kt`         | TypeScript port                            |

### From bitchat/georelays

| Component                        | Reuse Strategy                                                    |
| -------------------------------- | ----------------------------------------------------------------- |
| `nostr_relays.csv`               | Bundle in `assets/data/relays.csv`; CI-refresh via GitHub Actions |
| `filter_bitchat_relays.sh`       | Run as GH Actions workflow to refresh bundled CSV                 |
| `relays_geo_lookup.py` algorithm | Reimplement in TypeScript for in-app Haversine lookup             |

## 6. What Must Be Built from Scratch

| Component                    | Why                                                            | Est. LOC                |
| ---------------------------- | -------------------------------------------------------------- | ----------------------- |
| `AirhopBLEModule.swift`      | No existing RN library supports dual-role GATT server + client | ~400                    |
| `AirhopBLEModule.kt`         | Same                                                           | ~500                    |
| `AirhopForegroundService.kt` | Android background keepalive requirement                       | ~150                    |
| `noise-xx.ts`                | No maintained npm Noise XX package                             | ~300                    |
| `noise-x.ts`                 | Same (needed for courier sealing)                              | ~150                    |
| `double-ratchet.ts`          | No production-grade RN library (v0.8.0)                        | ~600                    |
| `x3dh.ts`                    | Same                                                           | ~300                    |
| `gcs-filter.ts`              | No JS implementation with bitchat compat                       | ~150                    |
| `packet-codec.ts`            | Custom binary format                                           | ~300                    |
| **Total**                    |                                                                | ~3,050 TS + ~900 native |

Everything else is a TypeScript port of existing bitchat code or an existing npm package.

## 7. Competitive Landscape

| Project                              | Transport                | Crypto        | Offline | Platform                    |
| ------------------------------------ | ------------------------ | ------------- | ------- | --------------------------- |
| [Session](https://getsession.org)    | Onion routing            | Signal        | Partial | iOS + Android               |
| [Bridgefy](https://bridgefy.me)      | BLE + WiFi               | Proprietary   | Yes     | iOS + Android               |
| [Briar](https://briarproject.org)    | BLE + WiFi + Tor         | Signal        | Yes     | Android                     |
| [Meshtastic](https://meshtastic.org) | LoRa                     | AES-256       | Yes     | Requires hardware           |
| [Berty](https://berty.tech)          | BLE + mDNS + Tor         | Noise XX      | Yes     | iOS + Android (open source) |
| [GoTenna](https://gotennamesh.com)   | Proprietary radio        | Proprietary   | Yes     | Requires hardware           |
| [bitchat](https://bitchat.free)      | BLE + Nostr              | Noise XX      | Yes     | Native iOS + Android        |
| [Airhop](https://airhop.free)        | BLE + WiFi Aware + Nostr | Noise XX + DR | Yes     | iOS + Android + Desktop     |
