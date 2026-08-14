# Airhop: Build Plan

> **This is the "what and when" document.** For _why_ we're building this, see [`docs/design/VISION.md`](VISION.md). For _how_ things are architected, see [`docs/spec/ARCHITECTURE.md`](../spec/ARCHITECTURE.md). For exact protocol constants, see [`docs/spec/PROTOCOLS.md`](../spec/PROTOCOLS.md).

## 1. Where Airhop Fits: Gap Analysis vs bitchat

bitchat is an excellent foundation. Airhop fills the gaps it left open.

### Gap 1: Unified Codebase

**bitchat problem:** iOS and Android are separate native codebases that drift. The Android v0.7 fragment size mismatch (500B vs 150B) broke iOS-Android compatibility for months with no one noticing.  
**Airhop:** Single TypeScript protocol stack. A protocol bug surfaces on both platforms simultaneously, and fixes apply simultaneously.

### Gap 2: WiFi Direct / WiFi Aware Transport

**bitchat problem:** BLE-only (~15 KB/s). Android WiFi Aware support exists but is experimental/unshipped.  
**Airhop:** Android WiFi Aware and iOS MultipeerConnectivity, selected automatically when available with BLE as fallback. Important limitation: these two protocols cannot talk to each other, so this only accelerates Android-to-Android or iPhone-to-iPhone transfers. Every cross-platform path stays on Bluetooth or Nostr.

### Gap 3: Tor on iOS and Android

**bitchat problem:** Tor was iOS-only (via Arti xcframework) when Airhop's design was set. bitchat-android has since added `ArtiTorManager.kt`, wired through `BitchatApplication` and `OkHttpProvider`, so both platforms now have it.  
**Airhop:** iOS embeds `arti.xcframework` with a full `AirhopTorManager` (SOCKS5 on port 39050, bootstrap monitor, network path recovery). Android detects Orbot via a TCP probe on localhost:9050. Both platforms route Nostr traffic through the detected proxy.

### Gap 4: Double Ratchet for Offline Mail

**bitchat problem:** Courier envelopes use Noise X (one-way). Compromise of recipient's static key exposes all undelivered mail.  
**Airhop:** Full Signal Double Ratchet (DR) for Airhop-to-Airhop DMs, plus bitchat-compatible one-time prekeys for offline mail. Prekey bundles are signed and gossiped over the mesh as `0x24` (not published to Nostr), and a courier envelope seals to a one-time prekey rather than the recipient's static key, so undelivered mail stays protected if that static key is later compromised.

### Gap 5: File Transfers

**bitchat position:** Per-type caps in `FileTransferLimits`, enforced at the binary-protocol decode layer. 1 MiB is the ceiling for general files; photos and voice notes are capped at 512 KiB.  
**Airhop:** Matches it. An earlier plan for 64 KB chunked streaming with no protocol cap was dropped: the cap is enforced when bitchat _decodes_ a packet, so anything larger is rejected outright and would have broken interop in both directions. Airhop sends one `BitchatFilePacket` per file (512 KiB photos and voice, 1 MiB otherwise, MIME allow-list, magic-byte validation) and lets the fragment layer split it for the radio. A larger Airhop-only path remains possible later, but it cannot be the default without losing bitchat compatibility.

### Gap 6: Video Support

**bitchat problem:** No video packet type, no mechanism, no MIME type for video.  
**Airhop:** videos are shared as files over the mesh and play inline on any platform. Live video streaming was dropped: Android WiFi Aware and iOS MultipeerConnectivity are different protocols that cannot interoperate, so cross-platform video calling is not achievable with these stacks.

### Gap 7: Non-Technical UX

**bitchat problem:** No onboarding. Users see raw hex peer IDs. Contact verification is manual fingerprint comparison.  
**Airhop:** Human-readable usernames (Adjective + Noun + 4-digit suffix, deterministic from pubkey). QR bootstrap.

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AIRHOP APPLICATION                                 │
│                                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Mesh Chat   │  │ Direct Msgs  │  │ Location Chs │  │ Contacts & Keys │   │
│  │ (public)    │  │ (Noise/DR)   │  │ (geo Nostr)  │  │ (QR/link/manual)│   │
│  └─────────────┘  └──────────────┘  └──────────────┘  └─────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │              MESSAGE ROUTER (TypeScript)                            │    │
│  │  canDeliverPromptly() -> both radios -> Nostr -> courier            │    │
│  │  -> Courier envelope (store-and-forward) -> Double Ratchet step     │    │
│  └──────────────────────────────┬──────────────────────────────────────┘    │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐    │
│  │              CRYPTO ENGINE (TypeScript, @noble)                     │    │
│  │  NoiseXX │ DoubleRatchet │ HKDF │ Ed25519-sign │ GCS-filter         │    │
│  └──────────┬─────────────────────────────────────┬────────────────────┘    │
│             │                                     │                         │
│  ┌──────────▼──────────────────┐     ┌────────────▼───────────────────┐     │
│  │   BLE MESH ENGINE (TS)      │     │   NOSTR TRANSPORT (TS)         │     │
│  │  PacketCodec, TTL flood     │     │  nostr-tools NIP-17/59         │     │
│  │  GossipSync (GCS filter)    │     │  SimplePool -> 300+ relays     │     │
│  │  CourierStore, Fragments    │     │  GeoRelayDirectory, Tor proxy  │     │
│  └──────────┬──────────────────┘     └────────────────────────────────┘     │
│             │ JSI TurboModule                                               │
│  ┌──────────▼──────────────────────────────────────────────────────────┐    │
│  │              AIRHOP NATIVE BLE MODULE                               │    │
│  │  iOS: CBPeripheralManager + CBCentralManager (Swift)                │    │
│  │  Android: BluetoothGattServer + BluetoothLeScanner (Kotlin)         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3. Version Targets

### v0.5.0: Foundation ✅

**Goal:** Hello World BLE mesh between two phones.

- [x] Set up Expo bare workflow with TypeScript strict
- [x] `AirhopBLEModule` iOS (Swift): dual-role GATT server + client
- [x] `AirhopBLEModule` Android (Kotlin): dual-role GATT
- [x] `AirhopForegroundService.kt`: background keepalive (foreground service, `connectedDevice` type), started with the mesh from `AirhopBLEModule` so the process, BLE, and Nostr socket survive backgrounding
- [x] Wire TurboModule to `src/bridge/NativeAirhopBLE.ts`
- [x] `src/core/mesh/wire/packet-codec.ts`: binary encode/decode matching bitchat v2 (`PROTOCOLS.md`, section 2)
- [x] `src/core/mesh/routing/flood-router.ts`: TTL flood, jitter 10-220ms, dedup
- [x] `src/core/mesh/discovery/announce-manager.ts`: signed presence broadcasts
- [x] `src/core/crypto/identity.ts`: key generation, Keychain storage, peer ID

**Milestone:** Two phones discover each other and exchange signed ANNOUNCE packets.

### v0.6.0: Core Messaging ✅

**Goal:** Full offline BLE mesh chat, bitchat wire-compatible.

- [x] `src/core/crypto/noise-xx.ts`: Noise XX handshake using `@noble` (transport session, replay window)
- [x] `src/core/crypto/noise-x.ts`: one-way Noise X for courier sealing
- [x] `src/core/mesh/routing/fragment-manager.ts`: fragmentation / reassembly (467B of data per 512B frame, 30s timeout)
- [x] `src/core/mesh/sync/gossip-sync.ts`: GCS filter reconciliation (15s interval, Golomb-Rice encoding)
- [x] `src/core/mesh/courier/courier-store.ts`: sealed envelopes, trust tiers, spray-and-wait
- [x] `src/core/router/message-router.ts`: BLE-only routing (broadcast + unicast + courier fallback)
- [x] Cross-language Noise XX test: JS ↔ bitchat-ios Swift server (required before device testing)
- [x] Basic React Native UI: channel list, message thread, peer list (minimal, functional)

**Milestone:** Full offline BLE mesh chat. Airhop ↔ bitchat message delivery verified.

### v0.7.0: Internet Bridge + Voice ✅

**Goal:** Nostr fallback, live PTT voice.

- [x] `src/core/nostr/nostr-client.ts`: SimplePool, auto-reconnect, Tor proxy config
- [x] `src/core/nostr/gift-wrap.ts`: NIP-17/59 gift-wrap DMs (HKDF key derivation, seal/unwrap round-trip)
- [x] `src/core/nostr/geo-relay.ts`: Haversine nearest relay from bundled relays.csv
- [x] `src/core/nostr/geohash-presence.ts`: kind 20001 geohash heartbeats (40–80s jitter, precision-5)
- [x] `src/core/nostr/courier-relay.ts`: Nostr bridge courier drops (kind 1401, NIP-40 expiry)
- [x] iOS: `AirhopTorManager` + `AirhopTorSession` + `AirhopTorModule`: full Arti integration (SOCKS5 port 39050), bundled `ios/Frameworks/arti.xcframework`
- [x] Android: Orbot SOCKS5 detection via `getTorProxyPort()` (probes localhost:9050)
- [x] `src/core/mesh/voice/voice-capture.ts`: PTT frame encoder (VOICE_FRAME 0x29, AAC/Opus 16 kHz)
- [x] `src/core/mesh/voice/voice-player.ts`: 350ms jitter buffer, ordered frame delivery
- [x] `src/bridge/NativeAirhopVoice.ts` + `AirhopVoiceModule.kt` / `.swift`: streaming mic and speaker (AAC-LC 16 kHz mono, off the JS thread)
- [x] `VOICE_FRAME` (0x29) send/receive/relay in mesh-service, plus `NoisePayloadType.VOICE_FRAME` (0x08) for DM bursts
- [x] Hold-to-talk UI: live HUD, floor-courtesy hint, autoplay gating, live-voice setting
- [x] `src/bridge/NativeAirhopTor.ts`: TurboModule spec for Tor module
- [x] `src/core/router/message-router.ts`: Nostr added as priority-2 transport (BLE > Nostr > Courier)

**Milestone:** Cross-city DMs via Nostr. Tor routing on iOS via Arti. Live PTT over BLE, in public rooms and DMs, interoperating with bitchat.

### v0.8.0: High Bandwidth + Double Ratchet ✅

**Goal:** High-bandwidth transport and per-message forward secrecy.

- [x] `src/core/crypto/double-ratchet.ts`: Signal DR per-message forward secrecy
- [~] X3DH: **dropped.** The Noise handshake already seeds the ratchet, so a separate key agreement was redundant. One-time prekey bundles (`src/core/mesh/wire/prekey-bundle.ts`) are gossiped over the mesh as `0x24`, never published to Nostr.
- [x] WiFi Aware native module (Android) + MultipeerConnectivity (iOS)
- [~] Chunked file transfer >1 MiB: **dropped, see Gap 4.** bitchat enforces the 1 MiB cap when it _decodes_ a packet, so anything larger is rejected outright and interop breaks in both directions. Airhop sends one `BitchatFilePacket` per file and lets the fragment layer split it
- [~] Video frame capture (`react-native-vision-camera` was removed from `package.json` entirely) and `0x30: videoFrame`: **dropped, see Gap 2.** The removal is recorded in `packet-codec.ts` so the type is not reintroduced by accident

**Milestone:** Double Ratchet passing test vectors. Same-platform WiFi transport for faster transfers. Offline video calling was **dropped**: WiFi Aware and MultipeerConnectivity cannot interoperate, so it could never work iOS ↔ Android.

### v0.9.0: Production Hardening ✅

**Goal:** All features complete, hardened, and cross-platform verified.

- [x] QR contact exchange (`src/core/crypto/contact-exchange.ts`: binary ContactCard, QR URI scheme `airhop:v1/<base64url>`)
- [x] QR code scanner for peer verification (encodeQRContent/decodeQRContent, deep-link format)
- [x] Human-readable usernames (`src/utils/username.ts`: deterministic `adjective-noun-XXXX` from peer ID)
- [x] Panic wipe (`src/services/panic-wipe.ts`: clears every keychain item, all MMKV partitions, the media cache and Tor state)
- [x] Battery optimization flow (`src/platform/battery-optimization.ts`: OEM deep links for 10 skins + standard Android fallback)
- [x] Georelay visibility: the channel info sheet lists the relays carrying a cell and marks the ones the user added (`GeoRelayDirectory.closestRelaysToGeohash()` via `MeshService.getGeohashRelays()`)
- [x] Full cross-platform compat test (`src/core/mesh/wire/__tests__/packet-frame-vectors.test.ts`: peer ID, byte offsets, relay TTL compat, ANNOUNCE TLV, fragment constants, BLE UUIDs)

**Milestone:** Feature-complete. Every core service has passing tests. No known protocol bugs.

### v0.9.5: Cashu Wallet ✅

**Goal:** A real wallet in the `Wallet` tab, not a token viewer.

Cashu is the primary rail because its tokens are plain strings, so value moves device to device over BLE with no server in the middle. Lightning moves value in and out, and Nutzaps are a secondary online path.

- [x] `src/core/payments/cashu.ts`: detection (bitchat-identical), decoding, NUT-12 DLEQ verification against cached keysets, fee-aware proof selection
- [x] `src/core/payments/nutzap.ts`: NIP-61 kind 9321 / 10019 construction and parsing
- [x] `src/core/payments/wallet-seed.ts`: BIP-39 recovery phrase, kept in the keychain
- [x] `src/store/wallet-store.ts`: AES-256 encrypted proof storage, per (mint, unit) accounts, reserved bucket, transaction history, NUT-13 counters
- [x] `src/services/wallet-service.ts`: the only module that talks to a mint. Reservations, Tor guard, Lightning, restore, consolidate
- [x] `src/services/payment-router.ts`: `payPerson`, one payment ladder (radio, nutzap, token, manual) shared by all four entry points: DM attach, contact sheet, Mesh peer sheet and Wallet Zap
- [x] Send that reserves rather than deletes, so an undelivered token is always reclaimable
- [x] Lightning deposit and withdrawal (NUT-04 / NUT-05) with quoted routing reserve
- [x] Opt-in recovery phrase (NUT-13 / NUT-09), off by default, with uncovered balance shown rather than hidden
- [x] Mint management: validated add, per-mint balances, consolidate a split balance over Lightning
- [x] Nutzap send and receive, with honest fallback to an encrypted DM when the recipient publishes no NIP-61 info
- [x] Tap the balance to read it in sats or bitcoin, a pure display switch with no price feed
- [x] QR display and scan for tokens, so a hand-off works without BLE and to Cashu wallets that are not Airhop

**Milestone:** A user sends and receives Cashu ecash entirely offline over BLE, tops up and cashes out over Lightning, and can rebuild the balance on a new device from twelve words.

### v0.9.6: String Extraction ✅

**Goal:** Every user-facing string in one catalog, with the compiler enforcing it.

English ships. The other languages land in v1.3.0, and because the extraction is complete they are catalog files rather than screen work.

- [x] Translation runtime with no library (`src/i18n/`): `t` / `useT` / `tPlural`, named-placeholder interpolation
- [x] Completeness enforced by `tsc`: every locale is a `Record<TranslationKey, string>` derived from `en.ts`, so a partial locale does not compile and there is no runtime fallback
- [x] Every user-facing string in the catalog, zero hardcoded, enforced in CI
- [x] Plurals through `tPlural`, never concatenation
- [x] Terminal punctuation checked by `catalog.test.ts`
- [x] Right-to-left groundwork (`src/i18n/layout.ts`): logical properties app-wide, mirrored chevrons; `radar-view.tsx` exempt as a polar plot of physical space
- [x] Layout direction pinned at startup, so a device set to Arabic does not mirror an English UI
- [x] CI guards: a hardcoded-string ceiling of zero, and module-load-time translations

**Milestone:** Every screen reads from the catalog, and CI cannot regress it.

### v1.0.0: UI + App Store Release ✅

**Goal:** Production UI polish and public release.

- [x] Onboarding flow (welcome screen, animated identity generation, username reveal)
- [x] Visual design (monochromatic dark theme, Feather icon system, design token system)
- [x] Animations and transitions (keyframe spin/fade for key generation, fade-up reveal)
- [x] Navigation shell (4-tab state machine, sub-tabs, Android BackHandler)
- [x] Accessibility audit
- [x] App Store and Play Store submission
- [x] YouTube demo series: full offline mesh demo, voice PTT across 3 devices, Nostr bridge handoff, panic wipe

**Milestone:** UI complete, accessibility audited, and submitted to both stores.

### v1.1.0: AI Assistant

**Goal:** An offline local AI assistant, shipped as a self-contained addition to the existing tab shell.

It is built to Airhop's core constraint: no network dependency for the on-device experience. The assistant never phones home for inference, and it does not touch the BLE mesh protocol, wire format, or crypto layer.

- [ ] Model picker and download flow: a short list of small, offline-capable GGUF models (1–3B parameters, e.g. Gemma 4) with size and RAM shown before download
- [ ] On-device inference engine (e.g. `llama.rn` / `llama.cpp` bindings) running fully offline, no server, no API key, no telemetry
- [ ] `src/core/ai/model-manager.ts`: download, verify checksum, store under app sandbox, delete/swap models
- [ ] `src/core/ai/inference.ts`: prompt/response loop against the loaded model, streamed token output
- [ ] Chat-style AI UI in a new `src/features/ai/ai-screen.tsx`: ask critical or general questions (first-aid, survival, navigation, general knowledge) when there is no network at all
- [ ] Conversation history kept local-only (MMKV), never leaves the device
- [ ] Clear on-screen indicator that the model is fully offline and no data is transmitted
- [ ] Low-end device fallback: warn and block download if the device lacks the RAM/storage for the selected model

**Milestone:** A user with zero connectivity downloads a model once, then asks it questions and gets answered fully offline, with no server round-trip of any kind.

### v1.2.0: Plugin Integrations

**Goal:** Opt-in plugins for social federation and regional payments, without touching the core protocol.

Airhop's identity model (Ed25519 keypairs, no accounts) maps onto both the [AT Protocol](https://atproto.com) used by Bluesky and [ActivityPub](https://w3.org/TR/activitypub/) used by the Fediverse, so bridging is an integration rather than a redesign. Every plugin is opt-in and separately auditable: users who enable none are unaffected, the mesh protocol and wire format are unchanged, and no plugin reaches private keys or relay traffic without a per-action confirmation. UPI is included as an online-only convenience, not a private rail. Every UPI transaction is KYC-linked and visible to NPCI, so Cashu remains the offline payment system.

#### AT Protocol (Bluesky)

- [ ] DID resolution and keypair association (`did:key` derived from Airhop's Ed25519 identity)
- [ ] Read feed integration: Bluesky home and discovery feeds in a dedicated tab
- [ ] Post bridge: optionally publish channel messages as `app.bsky.feed.post` records
- [ ] Follow graph import: find which Bluesky contacts are also Airhop users via DID cross-referencing
- [ ] PDS (Personal Data Server) self-hosting option for full data sovereignty

#### ActivityPub / Fediverse

- [ ] Actor construction from Airhop's Ed25519 identity
- [ ] Mastodon-compatible inbox and outbox: mentions and DMs from any compliant server
- [ ] Outbound posting: optionally broadcast public channel messages as Notes
- [ ] WebFinger lookup for contact discovery

#### UPI Payments (India)

- [ ] `UPIPaymentPlugin` implementing the `PaymentPlugin` interface
- [ ] Deep link initiation (`upi://pay?pa=...&am=...&cu=INR`), Android only, handled by any UPI-registered app
- [ ] Opt-in, disabled by default, online only
- [ ] Disclosure on enable: transactions are linked to a verified identity and visible to NPCI
- [ ] Shares the UPI ID as contact info only; no bank details transmitted

#### Plugin Architecture

- [ ] Generic `Plugin` interface in `src/core/` with typed subtypes per integration category
- [ ] Plugin registry with per-plugin opt-in and explicit permission prompts
- [ ] Strict data boundary: plugins see only what the user marks shareable, never mesh traffic
- [ ] Capability model: no key access or network call on the user's behalf without a per-action confirmation

**Milestone:** An Airhop identity linked to a Bluesky DID and a Mastodon actor, cross-posting to both. Indian users initiate UPI payments from a contact's profile when online.

### v1.3.0: Stabilization

**Goal:** Harden the shipped release before expanding to new platforms, and ship the catalog in ten languages.

No new features ship in this range. The mesh backend gets battle-tested across as many device and OS combinations as possible, and the extraction from v0.9.6 becomes translations.

- [ ] Production bugs found after launch
- [ ] Race conditions in the BLE and crypto state machines
- [ ] UI iteration from real user feedback
- [ ] Extended cross-device battery and compatibility testing
- [ ] Ten languages (`en ar de es fa hi id pt-BR ru zh-Hans`), chosen to cover every script class and layout hazard in bitchat/ios's thirty. Keys are named after bitchat's, so much of the catalog can be lifted from its public-domain `Localizable.xcstrings`
- [ ] Runtime a second language needs: locale store, CLDR plurals via `@formatjs/intl-pluralrules`, device language negotiation, in-app picker
- [ ] Right-to-left pass on device in Arabic
- [ ] Translated iOS permission dialogs and Android service notification

**Milestone:** Zero open P0/P1 bugs. BLE state machine stable across Pixel, Samsung, and Xiaomi device classes. Ten complete catalogs, each compiling against English. Ready to expand to new platforms.

### v1.4.0: Web / Browser

**Goal:** A Nostr-only web companion that shares the TypeScript protocol core.

Web Bluetooth cannot advertise as a GATT Peripheral, so a browser tab cannot join the BLE mesh. The web target is Nostr-only: private DMs, group channels, geo-relay discovery, Cashu payments, identity and crypto. A companion for desktop or remote use, not a mesh node. Chrome and Edge support Web Bluetooth; Firefox and Safari do not, and there is no polyfill path, so those get an explicit notice rather than a silent failure.

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

**Goal:** Companion apps for Apple Watch and Wear OS, with no change to the core protocol.

Neither watchOS nor Wear OS provides the background BLE execution primitives needed to relay mesh traffic, so both are companion interfaces to the phone app rather than standalone nodes.

#### Apple Watch (watchOS)

- [ ] SwiftUI app talking to the iOS app over WatchConnectivity
- [ ] Incoming message notifications with sender name and channel
- [ ] Quick reply from a set of short pre-defined responses
- [ ] Panic wipe trigger: a gesture sends an immediate wipe command to the paired iPhone, destroying all keys and message content in under a second
- [ ] Glanceable recent-messages complication

#### Wear OS (Android)

- [ ] Kotlin app on Compose for Wear, using the Wearable Data Layer API
- [ ] Incoming message notifications mirrored from the Android app
- [ ] Quick reply support
- [ ] Panic wipe trigger matching the Apple Watch behaviour
- [ ] Tile showing unread message count and last sender

**Milestone:** A user can read incoming messages and trigger a full panic wipe from their wrist on both Apple Watch and Wear OS.

### v1.7.0: Desktop (macOS + Windows)

**Goal:** Native desktop apps, macOS first.

macOS is the priority: CoreBluetooth has the same API surface as iOS, so the existing Swift `AirhopBLEModule` needs minimal change, and bitchat already ships a macOS target. Windows is secondary and ships as a point release after macOS stabilizes, since WinRT needs a new native module that the Swift code cannot provide.

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

**Goal:** Extract the protocol core into a versioned public package before the audit locks down the API surface.

`src/core/` is already a pure TypeScript library: named exports, strict mode, no UI coupling. Shipping the SDK before v1.9.0 puts the public API inside the audit scope, and lets developers build bitchat-compatible apps without reimplementing Noise XX, the GCS gossip filter, Double Ratchet, or the packet codec. More independent implementations of the same wire protocol means a larger, more resilient mesh for everyone.

#### SDK Packages

- [ ] Extract `src/core/` as a standalone npm package (`@airhop/core`) with semantic versioning
- [ ] Extract `AirhopBLEModule` as a distributable React Native library (`@airhop/ble`)
- [ ] Compile `@airhop/core` to WebAssembly for cross-language embedding
- [ ] Python SDK (`airhop-core` on PyPI) over the WASM build, for server-side relays and research tooling
- [ ] Rust crate (`airhop-core` on crates.io) for high-performance relay and IoT infrastructure
- [ ] Go module for server and container deployment
- [ ] Stabilize the public API surface; mark internal utilities as private
- [ ] Developer documentation: API reference, integration guide, example app per language
- [ ] Publish all packages under the MIT license
- [ ] Example: a minimal bitchat-compatible node on `@airhop/core` in under 200 lines

#### Custom Application Profiles

- [ ] Build-time configuration for enabling and disabling feature modules (`payments`, `voice`, `video`, `nostr`)
- [ ] Document the customization surface and the constraints that cannot change (crypto stack, packet signing, wire protocol)
- [ ] Reference build: emergency communications, location sharing prioritized, no payments
- [ ] Reference build: high anonymity, no persistent usernames, ephemeral-only channels, stricter Tor defaults

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

**Goal:** A production-grade chat interface once the SDK and audit are complete, plus a standing transparency commitment.

Private communication should be understandable, not merely trusted. v2.0.0 redesigns the interface for both modern and constrained devices, and makes the documentation and audit trail a permanent obligation rather than a release artifact.

#### Flagship Chat Interface

- [ ] Full UI/UX audit against established messaging conventions (Signal, WhatsApp, Telegram interaction patterns)
- [ ] Redesign on a consistent design system: typography scale, spacing, colour tokens, light and dark
- [ ] Accessibility audit: WCAG 2.1 AA, screen reader support, dynamic text sizing
- [ ] Performance profiling on low-end hardware (2GB RAM Android, iPhone 7 class)
- [ ] Reduced-motion mode and battery-aware rendering
- [ ] Broad device compatibility: Android API 21+ (Android 5.0, 2014), iOS 14+
- [ ] Smooth animations via `react-native-reanimated`, degrading gracefully on old hardware

#### Transparency and Public Knowledge

- [ ] 100% of public API behaviour documented; no undocumented features, no silent changes between releases
- [ ] CVEs and security findings disclosed as soon as a fix is available, with timeline and impact
- [ ] Audit reports published in full, unredacted
- [ ] Blog series on building private decentralized applications: Noise, offline-first architecture, BLE mesh design, Cashu, Nostr identity
- [ ] YouTube deep dives: how the BLE mesh works, how Noise XX is implemented, how Double Ratchet gives forward secrecy, how Cashu tokens move offline

**Milestone:** The redesigned UI ships across iOS, Android, macOS, and web, WCAG 2.1 AA verified, with audit reports and documentation public.

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

### From bitchat/ios (Swift -> TypeScript translation reference)

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

### From bitchat/android (Kotlin -> TypeScript/Kotlin)

| Component                       | Reuse Strategy                             |
| ------------------------------- | ------------------------------------------ |
| `BluetoothGattClientManager.kt` | Port to Airhop Android BLE TurboModule     |
| `BluetoothGattServerManager.kt` | Port to Airhop Android BLE TurboModule     |
| `FragmentManager.kt`            | TypeScript port                            |
| `SecurityManager.kt`            | TypeScript port (dedup, replay protection) |
| `StoreForwardManager.kt`        | TypeScript port                            |
| `PacketRelayManager.kt`         | TypeScript port                            |

### From bitchat/georelays

| Component                        | Reuse Strategy                                                          |
| -------------------------------- | ----------------------------------------------------------------------- |
| `nostr_relays.csv`               | Bundle in `assets/data/nostr_relays.csv`; CI-refresh via GitHub Actions |
| `filter_bitchat_relays.sh`       | Run as GH Actions workflow to refresh bundled CSV                       |
| `relays_geo_lookup.py` algorithm | Reimplement in TypeScript for in-app Haversine lookup                   |

## 6. What Must Be Built from Scratch

| Component                    | Why                                                            |
| ---------------------------- | -------------------------------------------------------------- |
| `AirhopBLEModule.swift`      | No existing RN library supports dual-role GATT server + client |
| `AirhopBLEModule.kt`         | Same                                                           |
| `AirhopForegroundService.kt` | Android background keepalive requirement                       |
| `noise-xx.ts`                | No maintained npm Noise XX package                             |
| `noise-x.ts`                 | Same, needed for courier sealing                               |
| `double-ratchet.ts`          | No production-grade RN library                                 |
| `gcs-filter.ts`              | No JS implementation compatible with bitchat                   |
| `packet-codec.ts`            | Custom binary format                                           |

Everything else is a TypeScript port of existing bitchat code or an existing npm package.
