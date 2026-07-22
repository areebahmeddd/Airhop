# Changelog

All notable changes are documented here.


## What's Changed in v0.9.7

- feat: update footer with new links and add PixelHeart animation (by @areebahmeddd) [6c79d4b]
- feat(landing): dockerize the frontend (by @areebahmeddd) [b9874a2]
- docs: pre-field-test hardening changelog, transports table, reference guide (by @areebahmeddd) [21b53e7]
- docs(legal): panic wipe is now on the Profile screen; bullet crypto/nostr sections (by @areebahmeddd) [ac0cfc8]
- chore(data): regenerate Nostr geo-relay directory (417 relays) (by @areebahmeddd) [396c118]
- feat(chat): full-screen photo viewer, video tap-to-load, payment card restyle (by @areebahmeddd) [b3122fd]
- feat(file-transfer): raise attachment cap to 50 MB to match bitchat (by @areebahmeddd) [70d5333]
- feat(mesh): adapt relay jitter and announce cadence to mesh density (by @areebahmeddd) [c942bde]
- feat(chat): live attachment transfer progress with cancel (by @areebahmeddd) [6a92ed5]

**Full changelog:** [v0.9.6..v0.9.7](https://github.com/areebahmeddd/Airhop/compare/v0.9.6..v0.9.7)

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
- docs: replace em dashes in skills/landing; fix CHANGELOG formatting (by @areebahmeddd) [eee8b44]
- chore(deps): add expo-av, expo-image-picker, expo-clipboard, expo-document-picker, expo-file-system, react-native-nfc-manager; configure permissions (by @areebahmeddd) [f266d4e]
- feat(wallet): wire decodeToken for receive; add balance validation for send and zap (by @areebahmeddd) [53d5305]
- feat(settings): add QR modal, share pills, and live Tor toggle wired to AirhopTorModule (by @areebahmeddd) [13c1fd4]
- fix(discovery): refine controls-row layout and add-contact button accessibility (by @areebahmeddd) [dd65fa5]
- feat(contacts): add NFC tap-to-add and camera QR scan to QrScanScreen (by @areebahmeddd) [d6056d4]
- feat(app): add + new-channel button to Chats header; pass trigger counter to ChannelList (by @areebahmeddd) [354ed8d]
- feat(chat): add voice recording UI, real attach actions, channel/DM info sheets to MessageThread (by @areebahmeddd) [ee3ddb6]
- feat(chat): accept newChannelTrigger prop in ChannelList; update DmList layout (by @areebahmeddd) [f8d1f7e]
- feat(chat): add ChannelInfoSheet bottom-sheet component (by @areebahmeddd) [ca01a53]
- feat(store): add channel-leave, metadata, and clearAll helpers to chat-store (by @areebahmeddd) [d166cc8]
- feat(mesh): wire WiFi transport, Noise XX handshake, DR, file transfer, and fix BLE ad name prefix (by @areebahmeddd) [191a868]
- feat(services): add FileTransferService for chunked mesh file transfer (by @areebahmeddd) [c4c7434]
- fix(codec): minor packet-codec correction (by @areebahmeddd) [a0ae380]
- feat(payments): expand cashu.ts decode helpers for V3/V4 tokens (by @areebahmeddd) [b58e3ce]
- fix(security): clear Zustand in-memory state on panic wipe (by @areebahmeddd) [594e0e5]
- fix(android): suppress deprecated ReactPackage override warnings in BLE and WiFi packages (by @areebahmeddd) [b3da90d]
- chore(android): add CAMERA, RECORD_AUDIO, NFC, media permissions; add dark-mode colors stub (by @areebahmeddd) [208c019]
- fix(tests): repair panic-wipe test suite (by @areebahmeddd) [04d479b]
- fix: stop peer selector update loop and stabilize Expo runtime (by @areebahmeddd) [4261b7d]
- feat(landing): add favicon set and enrich JSON-LD structured data (by @areebahmeddd) [0d9e431]
- chore(landing): self-host JetBrains Mono and respect prefers-reduced-motion (by @areebahmeddd) [e866b1f]
- feat(landing): add useSEO and useInView hooks (by @areebahmeddd) [5102dc4]
- feat(landing): wire per-page SEO metadata and skip-to-content link (by @areebahmeddd) [7316202]
- content(landing): expand FAQ with bitchat comparison and richer formatting (by @areebahmeddd) [fba3a5d]
- docs(landing): update llms.txt and sitemap for latest copy (by @areebahmeddd) [ba8adf7]
- docs(landing): rewrite README with tech stack table and Lighthouse metrics (by @areebahmeddd) [f367e8a]
- feat(landing): fetch live relay locations from CSV and animate relay arcs (by @areebahmeddd) [e5589c9]
- feat(landing): lazy-load relay map and animate on scroll into view (by @areebahmeddd) [df5efe2]
- feat(landing): respect prefers-reduced-motion in feature illustrations (by @areebahmeddd) [c0c4533]
- feat(landing): add App Store / Play Store download dropdown to hero (by @areebahmeddd) [b6636a0]
- content(landing): expand About section with bitchat attribution and links (by @areebahmeddd) [fa039d6]
- style(landing): improve text contrast and clean up focus/comments in nav, footer, explore, contribute (by @areebahmeddd) [17acd74]
- feat(docs): update README and ROADMAP with new links and feature milestones (by @areebahmeddd) [1650379]

**Full changelog:** [v0.9.5..v0.9.6](https://github.com/areebahmeddd/Airhop/compare/v0.9.5..v0.9.6)

## What's Changed in v0.9.5

- chore: update changelog format for better clarity (by @areebahmeddd) [ecb0a37]
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

**Full changelog:** [v0.9.0..v0.9.5](https://github.com/areebahmeddd/Airhop/compare/v0.9.0..v0.9.5)

## What's Changed in v0.9.0

- refactor: naming conventions, known gap fixes, docs, and agent skills (v0.9) (by @areebahmeddd) [502be8a]
- chore: scaffold future platform directories (by @areebahmeddd) [1570204]
- chore: add release automation, git-cliff changelog, and fix eslint config (by @areebahmeddd) [93c8134]

**Full changelog:** [v0.8.0..v0.9.0](https://github.com/areebahmeddd/Airhop/compare/v0.8.0..v0.9.0)

## What's Changed in v0.8.0

- docs: some clarity for ai agents (by @areebahmeddd) [092d192]
- feat(crypto): implement Signal Double Ratchet (double-ratchet.ts) (by @areebahmeddd) [1211db0]
- feat(crypto): implement X3DH prekey agreement (x3dh.ts) (by @areebahmeddd) [c5d9164]
- feat(android): add WiFi Aware high-bandwidth transport (AirhopWiFiModule) (by @areebahmeddd) [8c3bb3a]
- feat(ios): add MultipeerConnectivity high-bandwidth transport (AirhopMCModule) (by @areebahmeddd) [dd3c4f8]
- feat(bridge): add NativeAirhopWiFi TurboModule spec (by @areebahmeddd) [a84f801]
- feat(mesh): add chunked streaming file transfer (file-transfer.ts) (by @areebahmeddd) [cb4e064]
- feat(mesh): add VIDEO_FRAME capture and jitter-buffer player (video-capture/player.ts) (by @areebahmeddd) [569469c]
- docs: mark v0.8.0 complete (by @areebahmeddd) [a43c8fa]

**Full changelog:** [v0.7.0..v0.8.0](https://github.com/areebahmeddd/Airhop/compare/v0.7.0..v0.8.0)

## What's Changed in v0.7.0

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

**Full changelog:** [v0.6.0..v0.7.0](https://github.com/areebahmeddd/Airhop/compare/v0.6.0..v0.7.0)

## What's Changed in v0.6.0

- docs: fix wording + star history graph (by @areebahmeddd) [f9f3c36]
- feat(crypto): Noise XX handshake+transport and Noise X one-way sealing (by @areebahmeddd) [9d7d0cf]
- fix(mesh): align packet types with bitchat MessageType.swift (by @areebahmeddd) [f92f684]
- feat(mesh): BLE packet fragmentation and reassembly (by @areebahmeddd) [d3c3c82]
- feat(mesh): GCS gossip reconciliation, wire-compatible with bitchat (by @areebahmeddd) [dc69f81]
- feat(mesh): courier store-and-forward with TLV envelope, bitchat-compatible (by @areebahmeddd) [20c5f6b]
- feat(router): message routing — broadcast, unicast, courier fallback (by @areebahmeddd) [2483f2e]
- feat(store): Zustand + MMKV chat state and in-memory peer registry (by @areebahmeddd) [be3fed3]
- feat(ui): channel list, message thread, and peer list screens (by @areebahmeddd) [0b30310]
- docs: correct protocol constants (GCS, courier, packet types); mark v0.6.0 complete (by @areebahmeddd) [609b648]

**Full changelog:** [v0.5.0..v0.6.0](https://github.com/areebahmeddd/Airhop/compare/v0.5.0..v0.6.0)

## What's Changed in v0.5.0

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



