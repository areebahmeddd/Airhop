# Changelog

All notable changes are documented here.

## What's Changed in v0.9.6

- chore(changelog): minor fixes (by @areebahmeddd) [1c2f4b9]
- refactor(android): rename package from tech.permissionless to org.onemindlabs (by @areebahmeddd) [d7ef1a4]
- chore: update app name, bundle ID, and version metadata (by @areebahmeddd) [c24ca3b]
- fix(crypto): patch double-ratchet and noise-xx session handling (by @areebahmeddd) [f1f6077]
- feat(mesh): update packet-codec, deduplicator, file-transfer, announce, voice, and video (by @areebahmeddd) [ada633f]
- feat(nostr,payments): update courier-relay, presence, gift-wrap, and cashu (by @areebahmeddd) [c8bda28]
- feat(core): add message router (by @areebahmeddd) [b10f447]
- feat(services): add mesh-service orchestration layer (by @areebahmeddd) [f5bce18]
- feat(store): update chat, peer, and wallet stores (by @areebahmeddd) [94d4ee7]
- feat(features): add QR scan, radar view, and update chat/discovery/onboarding/settings/wallet screens (by @areebahmeddd) [65e4fb2]
- fix(ui,utils): update theme and battery-optimization utility (by @areebahmeddd) [0c89d8b]
- chore: update App.tsx, package deps, and prettier config (by @areebahmeddd) [3dc32dd]
- feat(landing): add RelayMap component, relay coords data, and refresh all pages/components (by @areebahmeddd) [484fac7]
- chore(android): delete old files (by @areebahmeddd) [7b781e3]
- fix: build issues + update docs (by @areebahmeddd) [c53ebad]

**Full changelog:** [v0.9.5..v0.9.6](https://github.com/areebahmeddd/Airhop/compare/v0.9.5..v0.9.6)## What's Changed in v0.9.5

- chore: update changelog format for better clarity (by @areebahmeddd) [ecb0a37]
- Merge branch 'main' of <https://github.com/areebahmeddd/Airhop> (by @areebahmeddd) [4ff5709]
- chore: revise CHANGELOG format (by @areebahmeddd) [bc3e71b]
- feat(deps): install react-native-safe-area-context and expo-status-bar (by @areebahmeddd) [1a74e91]
- chore(config): update ESLint config for v1.0 feature set (by @areebahmeddd) [1dbd51b]
- feat(ui): add centralised design token system (by @areebahmeddd) [a657634]
- feat(ui): add Avatar, StatusDot, and MeshStatusBar components (by @areebahmeddd) [5c13a5a]
- feat(onboarding): add welcome, identity generation, and username reveal screens (by @areebahmeddd) [0b36c31]
- feat(chat): add channel list, DM list, and message thread screens (by @areebahmeddd) [4acf079]
- feat(mesh): add peer discovery list with BLE peer detail sheet (by @areebahmeddd) [89cfe41]
- feat(wallet): add Cashu ecash wallet screen (by @areebahmeddd) [a433dc2]
- feat(settings): add profile and settings screen with panic wipe (by @areebahmeddd) [fac5044]
- feat(app): wire root navigation with SafeAreaProvider and 4-tab layout (by @areebahmeddd) [93849c7]
- docs: mark v0.9.5 complete (by @areebahmeddd) [1f9ac98]
- chore(landing): init Vite + React landing page scaffold (by @areebahmeddd) [621aab9]
- chore: add landing page to gitignore, prettierignore, and dependabot (by @areebahmeddd) [5f4fe70]
- chore(landing): add public assets and Cloudflare Pages config (by @areebahmeddd) [c9df1bd]
- feat(landing): add Airhop landing page source (by @areebahmeddd) [d5c9f2b]
- chore(ci): update Codecov action configuration for coverage reporting (by @areebahmeddd) [433e137]

**Full changelog:** [v0.9.0..v0.9.5](https://github.com/areebahmeddd/Airhop/compare/v0.9.0..v0.9.5)## What's Changed in v0.9.0

- major bitchat compatibility fixes + tests

- Implemented `nearestRelaysWithDistance` method in `GeoRelayDirectory` to return the nearest N relays with their distances in kilometers.
- Enhanced `PeerRegistry` to manage direct and indirect peer connections, including methods to mark peers as direct or indirect.
- Updated `MessageRouter` to prioritize WiFi direct messaging over BLE, with fallback mechanisms for message delivery.
- Added tests for new functionalities in `message-router.test.ts` to ensure proper behavior of direct messaging and fallback strategies.
- Introduced battery optimization utilities in `battery-optimization.ts` to handle aggressive OEM settings on Android devices.
- Created panic wipe functionality in `panic-wipe.ts` to clear user data securely.
- Developed deterministic username generation from peer IDs in `username.ts`, ensuring unique and human-readable usernames.
- Added comprehensive tests for new utility functions in `battery-optimization.test.ts`, `panic-wipe.test.ts`, and `username.test.ts`. (by @areebahmeddd) [3332b95]
- refactor: naming conventions, known gap fixes, docs, and agent skills (v0.9)

- Rename parse*/build* functions to encode*/decode* across mesh and nostr modules
- Move wallet-store.ts to src/store/, rename client.ts to nostr-client.ts
- Fix three known gaps: announce neighbor gossip, WiFi unicast tier, direct peer TTLs
- Add src/README.md with module map and test coverage table (393 tests, 86%)
- Sync folder trees across ARCHITECTURE.md, PROGRESS.md, ROADMAP.md, and agent docs
- Add 5 skill files to .github/skills/ covering wire format, Noise, BLE boundary, mesh routing, and gift-wrap (by @areebahmeddd) [502be8a]
- chore: scaffold future platform directories (by @areebahmeddd) [1570204]
- chore: add release automation, git-cliff changelog, and fix eslint config (by @areebahmeddd) [93c8134]

**Full changelog:** [v0.8.0..v0.9.0](https://github.com/areebahmeddd/Airhop/compare/v0.8.0..v0.9.0)## What's Changed in v0.8.0

- docs: some clarity for ai agents (by @areebahmeddd) [092d192]
- feat(crypto): implement Signal Double Ratchet (double-ratchet.ts)

Per-message forward secrecy and break-in recovery for offline courier DMs.
Symmetric-key + DH ratchet, ChaCha20-Poly1305 AEAD, 1000-entry skipped-key
map for out-of-order delivery. 12 passing unit tests. (by @areebahmeddd) [1211db0]

- feat(crypto): implement X3DH prekey agreement (x3dh.ts)

Allows initiating a Double Ratchet session to an offline peer via a prekey
bundle published to Nostr. SPK is Ed25519-signed for authenticity. JSON
serialization for Nostr kind-10002 events. 7 passing unit tests including
full X3DH -> DR integration round-trip. (by @areebahmeddd) [c5d9164]

- feat(android): add WiFi Aware high-bandwidth transport (AirhopWiFiModule)

Implements NAN publish/subscribe, WifiAwareNetworkSpecifier socket channels,
and length-prefixed frame I/O. Requires API 26+; gracefully absent on older
devices. Registered in MainApplication.kt alongside AirhopBLEPackage. (by @areebahmeddd) [8c3bb3a]

- feat(ios): add MultipeerConnectivity high-bandwidth transport (AirhopMCModule)

MCNearbyServiceBrowser + MCNearbyServiceAdvertiser + MCSession with required
encryption. Lexicographic invite-collision avoidance. Emits the same
AirhopWiFi.* event names as the Android module for symmetric TypeScript handling. (by @areebahmeddd) [dd3c4f8]

- feat(bridge): add NativeAirhopWiFi TurboModule spec

Codegen input covering both AirhopWiFiModule (Android) and AirhopMCModule
(iOS) with startWiFi, stopWiFi, writeToWiFiLink. Uses TurboModuleRegistry.get
(nullable) since WiFi transport is optional on older devices. (by @areebahmeddd) [a84f801]

- feat(mesh): add chunked streaming file transfer (file-transfer.ts)

Splits files into 64 KiB FILE_TRANSFER chunks with stream_id, chunk_index,
and total_chunks headers. FileAssembler handles out-of-order delivery,
duplicates, and 60-second stale-session eviction. No hard size cap.
13 passing unit tests including 3 MiB and out-of-order scenarios. (by @areebahmeddd) [cb4e064]

- feat(mesh): add VIDEO_FRAME capture and jitter-buffer player (video-capture/player.ts)

VideoCapture packages HEVC frames as 0x30 VIDEO_FRAME packets (TTL=1, WiFi
Direct only). VideoPlayer maintains per-session 100ms jitter buffers with
automatic cleanup on is_last or 10s timeout. 14 passing unit tests. (by @areebahmeddd) [569469c]

- docs: mark v0.8.0 complete (by @areebahmeddd) [a43c8fa]

**Full changelog:** [v0.7.0..v0.8.0](https://github.com/areebahmeddd/Airhop/compare/v0.7.0..v0.8.0)## What's Changed in v0.7.0

- docs: update links, version targets (by @areebahmeddd) [9be8399]
- feat(nostr): add Nostr client with SimplePool, auto-reconnect, and Tor proxy config (by @areebahmeddd) [6d8f3bb]
- feat(nostr): add NIP-17/59 gift-wrap DMs (by @areebahmeddd) [5c08d2b]
- feat(nostr): add geo-relay selection from bundled relays.csv (by @areebahmeddd) [c617fd2]
- feat(nostr): add kind-20001 geohash presence heartbeats (by @areebahmeddd) [1812653]
- feat(nostr): add courier relay for offline store-and-forward (kind 1401) (by @areebahmeddd) [e3866b8]
- feat(payments): add Cashu token parsing, embed, and DLEQ validation (by @areebahmeddd) [7dd533d]
- feat(payments): add NIP-61 nutzap and MMKV-backed wallet store (by @areebahmeddd) [06da7bc]
- feat(mesh): add PTT voice capture and jitter-buffered playback (by @areebahmeddd) [26259c7]
- feat(router): add Nostr as priority-2 transport (BLE > Nostr > Courier) (by @areebahmeddd) [82b9542]
- feat(bridge): add TurboModule spec for Tor module; update BLE spec (by @areebahmeddd) [8123222]
- feat(ios): add Arti Tor integration with bundled xcframework (by @areebahmeddd) [0532c83]
- feat(android): add Orbot SOCKS5 proxy detection via TCP probe (by @areebahmeddd) [ad770b9]
- docs: mark v0.7.0 complete (by @areebahmeddd) [0e7fcb0]

**Full changelog:** [v0.6.0..v0.7.0](https://github.com/areebahmeddd/Airhop/compare/v0.6.0..v0.7.0)## What's Changed in v0.6.0

- docs: fix wording + star history graph (by @areebahmeddd) [f9f3c36]
- feat(crypto): Noise XX handshake+transport and Noise X one-way sealing (by @areebahmeddd) [9d7d0cf]
- fix(mesh): align packet types with bitchat MessageType.swift (by @areebahmeddd) [f92f684]
- feat(mesh): BLE packet fragmentation and reassembly (by @areebahmeddd) [d3c3c82]
- feat(mesh): GCS gossip reconciliation, wire-compatible with bitchat (by @areebahmeddd) [dc69f81]
- feat(mesh): courier store-and-forward with TLV envelope, bitchat-compatible (by @areebahmeddd) [20c5f6b]
- feat(router): message routing: broadcast, unicast, courier fallback (by @areebahmeddd) [2483f2e]
- feat(store): Zustand + MMKV chat state and in-memory peer registry (by @areebahmeddd) [be3fed3]
- feat(ui): channel list, message thread, and peer list screens (by @areebahmeddd) [0b30310]
- docs: correct protocol constants (GCS, courier, packet types); mark v0.6.0 complete (by @areebahmeddd) [609b648]

**Full changelog:** [v0.5.0..v0.6.0](https://github.com/areebahmeddd/Airhop/compare/v0.5.0..v0.6.0)## What's Changed in v0.5.0

- Init project (Alpha stage) (by @areebahmeddd) [fbb0caf]
- update docs with feature list + version targets + glossary (by @areebahmeddd) [dda2e0b]
- update deps + add relays csv (by @areebahmeddd) [0e67041]
- update docs (by @areebahmeddd) [2bd9c79]
- run npm prebuild for android (by @areebahmeddd) [a9637bb]
- run npm prebuild for ios

Signed-off-by: Rishi Chirchi <rishiraj.chirchi@gmail.com> (by @Rishi Chirchi) [c33b4b1]

- docs: adjust roadmap, pretty readme (by @areebahmeddd) [5d73340]
- docs: minor fixes (by @areebahmeddd) [fad3a49]
- chore: configure Jest and TypeScript for @noble ESM modules (by @areebahmeddd) [c674718]
- feat(core/crypto): identity generation, peer ID derivation, Keychain storage (by @areebahmeddd) [768abfc]
- feat(core/mesh): bitchat v2 packet codec with flags preservation and Ed25519 signing (by @areebahmeddd) [268acc4]
- feat(core/mesh): deduplicator (LRU nonce cache) and TTL flood router with jitter (by @areebahmeddd) [6a71607]
- feat(core/mesh): signed ANNOUNCE broadcast manager with TLV payload and peer validation (by @areebahmeddd) [ce3474e]
- test(core/mesh): unit tests for packet-codec, deduplicator and flood-router (by @areebahmeddd) [e6b1e3f]
- feat(bridge): TurboModule spec for AirhopBLE native module (by @areebahmeddd) [9a31028]
- feat(ios): AirhopBLEModule Swift dual-role GATT central+peripheral with RSSI polling (by @areebahmeddd) [27cda57]
- feat(android): AirhopBLEModule Kotlin dual-role GATT, AirhopForegroundService, package registration (by @areebahmeddd) [65df2bf]
- docs: mark v0.5.0 complete (by @areebahmeddd) [ef1c14f]
