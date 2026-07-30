# Airhop: Build Progress

> Updated when milestones complete, blockers are found, or decisions are made. It is the canonical answer to "where are we right now?"

## Current Version: v1.0.0 (pre-field-test)

**Status:** Feature work complete and green in CI (900 tests, 0 lint errors, TypeScript clean).

**Verified by tests:** packet codec (v1 and v2 headers, padding, compression),
fragment format and reassembly progress, Noise XX, Double Ratchet, courier
envelopes (static and prekey-sealed), one-time prekey bundles, gossip filters
(including type-aware board rounds), bulletin-board wire and store quotas,
private-group wire and epoch keys, gateway carrier codec, mesh ping/pong,
outbox delivery, contact-card binding, geohash derivation + relay determinism,
geohash DM round trip, Nostr gift-wrap and the bitchat envelope, proof selection.

**Cannot be verified without hardware:** discovery, MTU negotiation, cross-OS
connection lifecycle, real attachment transfer over the radio.

## Documentation Status

| Document                                                                   | Status      | Purpose                                          |
| -------------------------------------------------------------------------- | ----------- | ------------------------------------------------ |
| [`docs/design/VISION.md`](../design/VISION.md)                             | ✅ Complete | Why + principles + build order                   |
| [`docs/design/ROADMAP.md`](../design/ROADMAP.md)                           | ✅ Complete | Version targets, milestones, gap analysis        |
| [`docs/spec/ARCHITECTURE.md`](../spec/ARCHITECTURE.md)                     | ✅ Complete | Architecture, stack, code snippets               |
| [`docs/spec/PROTOCOLS.md`](../spec/PROTOCOLS.md)                           | ✅ Complete | Wire format, constants, compat table             |
| [`docs/dev/REFERENCE.md`](REFERENCE.md)                                    | ✅ Complete | bitchat codebase knowledge transfer              |
| [`docs/dev/PROGRESS.md`](PROGRESS.md)                                      | ✅ Active   | Current implementation progress                  |
| [`docs/dev/GLOSSARY.md`](GLOSSARY.md)                                      | ✅ Complete | Definitions for all technical terms              |
| [`CONTRIBUTING.md`](../../CONTRIBUTING.md)                                 | ✅ Complete | Standards for contributors + AI agents           |
| [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md) | ✅ Complete | VS Code Copilot workspace context                |
| [`.github/agents/`](../../.github/agents)                                  | ✅ Complete | Architect, Upstream Sync, Security Review agents |

## v0.5.0: Foundation ✅

**Goal:** Hello World BLE mesh between two phones.

### Project scaffold

- [x] `package.json`, `app.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`, `App.tsx` created
- [x] `global.css`, `tailwind.config.js`, `nativewind-env.d.ts`, `.prettierrc.json`, `.prettierignore` created
- [x] Configure TypeScript strict mode in `tsconfig.json` (TypeScript 7, no `baseUrl`)
- [x] Set up Prettier (`.prettierrc.json` with `prettier-plugin-tailwindcss` + `prettier-plugin-organize-imports`)
- [x] Set up ESLint (`eslint.config.js` with `eslint-config-expo` flat config)
- [x] Run `npx expo prebuild` to generate `ios/` and `android/` native project directories
- [x] Configure Jest for `src/core/` (pure TypeScript, no native deps in test env)
- [x] Create folder structure matching `docs/spec/ARCHITECTURE.md`, section 1

### Native BLE module

- [x] `ios/Airhop/AirhopBLEModule.swift`: CBPeripheralManager + CBCentralManager (~400 lines)
- [x] `ios/Airhop/AirhopBLEModule.mm`: Obj-C++ bridge (RCT_EXTERN_MODULE)
- [x] `android/app/src/main/java/tech/permissionless/airhop/ble/AirhopBLEModule.kt`: BluetoothGattServer + BluetoothLeScanner (~500 lines)
- [x] `android/app/src/main/java/tech/permissionless/airhop/ble/AirhopBLEPackage.kt`: module registration
- [x] `android/app/src/main/java/tech/permissionless/airhop/service/AirhopForegroundService.kt`: background keepalive
- [x] iOS: `UIBackgroundModes: [bluetooth-central, bluetooth-peripheral]` in `app.json`
- [x] Android: foreground service permission in AndroidManifest
- [x] Foreground service is started with the mesh (`AirhopBLEModule.startAdvertising`), so the process, BLE, and the Nostr socket survive backgrounding
- [x] Local message notifications (`expo-notifications`, no push server): per-conversation heads-up with sender and channel, tap to open the thread, clears on read, app-icon badge synced to total unread; foreground haptic when a message lands on another chat while the app is open
- [x] `src/bridge/NativeAirhopBLE.ts`: TurboModule TypeScript spec (Codegen input)

### Core mesh engine

- [x] `src/core/mesh/packet-codec.ts`: binary encode/decode, matches PROTOCOLS.md exactly
- [x] `src/core/mesh/flood-router.ts`: TTL flood, jitter, dedup
- [x] `src/core/mesh/deduplicator.ts`: LRU 1000-entry seen-set
- [x] `src/core/mesh/announce-manager.ts`: signed presence broadcasts
- [x] `src/core/crypto/identity.ts`: key generation, Keychain storage, peer ID

### Tests (must pass before milestone)

- [x] `packet-codec.test.ts`: encode/decode round-trip, byte layout matches PROTOCOLS.md
- [x] `deduplicator.test.ts`: LRU eviction, expiry window
- [x] `flood-router.test.ts`: TTL decrement, jitter scheduling

**Milestone:** Two phones on BLE discover each other and exchange signed ANNOUNCE packets.

## v0.6.0: Core Messaging ✅

- [x] `src/core/crypto/noise-xx.ts`: Noise XX handshake using `@noble/curves` + `@noble/ciphers` (full XX pattern, transport encrypt/decrypt, replay window)
- [ ] Cross-language Noise XX test: JS client ↔ bitchat-ios Swift server (MUST PASS before v1.0.0 ship; requires a live device test harness, deferred to v1.0.0 integration testing)
- [x] `src/core/crypto/noise-x.ts`: one-way Noise X for courier sealing
- [x] `src/core/mesh/fragment-manager.ts`: split/reassemble, 30s timeout, 128-slot concurrent cap
- [x] `src/core/mesh/gossip-sync.ts`: GCS filter reconciliation (Golomb-Rice encoding, TLV wire format)
- [x] `src/core/mesh/courier-store.ts`: sealed envelopes, trust tiers, spray-and-wait, daily recipient tags
- [x] `src/core/router/message-router.ts`: transport selection (BLE mesh broadcast / unicast, courier fallback)
- [x] Basic UI: channel list, message thread, peer list (minimal, functional)

**Milestone:** Full offline BLE mesh chat. Airhop ↔ bitchat message delivery verified.

## v0.7.0: Internet Bridge + Voice ✅

- [x] `src/core/nostr/nostr-client.ts`: SimplePool, auto-reconnect, Tor proxy config
- [x] `src/core/nostr/gift-wrap.ts`: NIP-17/59 gift-wrap DMs (HKDF key derivation, round-trip tested)
- [x] `src/core/nostr/geo-relay.ts`: load `assets/data/relays.csv`, Haversine nearest relay
- [x] `src/core/nostr/presence.ts`: kind 20001 geohash heartbeats
- [x] `src/core/nostr/courier-relay.ts`: Nostr bridge courier drops (kind 1401, tested)
- [x] `src/core/router/message-router.ts`: Nostr added as priority-2 transport (BLE > Nostr > Courier)
- [x] PTT voice: `src/core/mesh/voice-capture.ts` + `src/core/mesh/voice-player.ts`
- [x] iOS: `AirhopTorManager.swift`: full Arti lifecycle management (FFI, bootstrap, SOCKS probe)
- [x] iOS: `AirhopTorSession.swift`: URLSession SOCKS5 proxy factory (port 39050)
- [x] iOS: `AirhopTorModule.swift` + `AirhopTorModule.mm`: RN native module exposing Tor to JS
- [x] iOS: `AirhopTorSocket.swift` + `AirhopTorSocket.mm`: WebSocket over Arti's SOCKS5 proxy (`URLSessionWebSocketTask`), so Nostr relay traffic can be Tor-routed (needs adding to the Xcode target + device validation)
- [x] iOS: `ios/Arti.podspec`: CocoaPods spec linking `arti.xcframework` system libs (resolv, z, sqlite3)
- [x] iOS: `ios/Podfile`: `pod 'Arti'` added to link the xcframework
- [x] `src/bridge/NativeAirhopTor.ts`: TurboModule spec (startTor, stopTor, getTorStatus, awaitTorReady)
- [x] `src/bridge/NativeAirhopTorSocket.ts` + `src/core/nostr/tor-websocket.ts` + `src/core/nostr/tor-routing.ts`: JS Tor WebSocket shim, socket-implementation swap, and the single toggle/startup choke point that rebuilds the Nostr transport
- [x] Android: `getTorProxyPort()`: probes localhost:9050 for Orbot SOCKS5 (in AirhopBLEModule.kt)

**Milestone:** Cross-city DMs via Nostr. Live voice PTT over BLE. Tor routing available on iOS via Arti.

## v0.8.0: High Bandwidth + Double Ratchet ✅

- [x] `src/core/crypto/double-ratchet.ts`: Signal DR per-message forward secrecy
- [x] `src/core/crypto/x3dh.ts`: X3DH prekey agreement; bundles published to Nostr
- [x] WiFi Aware native module (Android) + MultipeerConnectivity (iOS)
- [x] Chunked file transfer >1 MiB
- [x] Video frame capture (react-native-vision-camera v5, HEVC)
- [x] `0x30: videoFrame` packet type (WiFi Direct only)

**Milestone:** Offline video calling over WiFi Aware. Double Ratchet passing test vectors.

## v0.9.0: Production Hardening ✅

- [x] QR contact exchange (`src/core/crypto/contact-exchange.ts`: ContactCard binary format, QR URI scheme)
- [x] QR code scanner for peer verification (encodeQRContent/decodeQRContent in contact-exchange.ts)
- [x] Human-readable usernames (`src/utils/username.ts`: deterministic adjective-noun-suffix from peer ID, 128-entry word lists)
- [x] Panic wipe (`src/utils/panic-wipe.ts`: clears EncryptedStorage keys + all MMKV partitions in one call)
- [x] Battery optimization flow (`src/utils/battery-optimization.ts`: OEM deep links for 10 skins + standard Android fallback)
- [x] Georelays in-app relay map (`GeoRelayDirectory.nearestRelaysWithDistance()` added to geo-relay.ts)
- [x] Full cross-platform compat test (`src/core/mesh/__tests__/compat.test.ts`: peer ID derivation, packet byte offsets, signature relay compat, ANNOUNCE TLV, fragment constants, BLE UUIDs)

**Milestone:** Feature-complete. Every core service has passing tests. No known protocol bugs.

## v1.0.0: UI + App Store Release ✅

- [x] Onboarding flow: 3-screen sequence (welcome, animated identity generation with Ed25519/X25519 key gen, username reveal with deterministic peer ID username)
- [x] Visual design: monochromatic dark theme (`#080808` base, single white accent), Feather icon system, design token system (`Colors`, `FontSize`, `FontWeight`, `Spacing`) in `src/ui/theme.ts`
- [x] Animations: keyframe spin + opacity fade during identity generation, fade-up reveal on username screen
- [x] Navigation shell: 5-tab state machine (Chats / AI / Mesh / Wallet / Profile), sub-tab segment (Channels / Direct), Android BackHandler for in-thread back navigation
- [x] Safe area + status bar: `SafeAreaProvider` + `SafeAreaView` from `react-native-safe-area-context` v5, `StatusBar` from `expo-status-bar` (replaces deprecated `react-native` equivalents)
- [x] Keyboard handling: `KeyboardAvoidingView` in message thread (iOS padding, Android default)
- [x] Component library: `Avatar` (deterministic colour + initials from peer ID), `StatusDot` (online indicator); kebab-case naming, all imports updated
- [ ] Accessibility audit
- [ ] App Store and Play Store submission
- [ ] YouTube demo series

**Milestone:** UI complete and dev-ready.

## v1.1.0: AI + Wallets

### AI Assistant

- [ ] Model picker and download flow: small offline-capable GGUF models (1–3B params, e.g. Gemma 2 2B), size/RAM shown before download
- [ ] On-device inference engine (e.g. `llama.rn` / `llama.cpp` bindings), fully offline, no server, no telemetry
- [ ] `src/core/ai/model-manager.ts`: download, checksum verify, store under app sandbox, delete/swap models
- [ ] `src/core/ai/inference.ts`: prompt/response loop against the loaded model, streamed token output
- [ ] Chat-style AI UI in `src/features/ai/ai-screen.tsx` (currently a placeholder): ask critical or general questions with zero network
- [ ] Conversation history kept local-only (MMKV)
- [ ] Low-end device fallback: block download if device lacks RAM/storage for the selected model

### Cashu Wallet (Shipped in v1.0.0)

- [x] `src/core/payments/cashu.ts`: detection (bitchat-identical), decoding, NUT-12 DLEQ verification, fee-aware proof selection
- [x] `src/core/payments/nutzap.ts`: NIP-61 kind 9321 / 10019 construction and parsing
- [x] `src/core/payments/wallet-seed.ts`: BIP-39 recovery phrase, kept in the keychain
- [x] `src/store/wallet-store.ts`: AES-256 encrypted proofs, per (mint, unit) accounts, reserved bucket, history, NUT-13 counters
- [x] `src/services/wallet-service.ts`: the only module that talks to a mint
- [x] `src/services/ecash-transfer.ts`: one send-to-peer flow shared by the Wallet, Mesh and Chat entry points
- [x] Send that reserves rather than deletes, so an undelivered token is reclaimable
- [x] Lightning deposit and withdrawal (NUT-04 / NUT-05)
- [x] Opt-in recovery phrase (NUT-13 / NUT-09), off by default
- [x] Mint management: validated add, per-mint balances, consolidate over Lightning
- [x] Nutzap send and receive, with honest fallback when the recipient publishes no NIP-61 info
- [x] Tap the balance to read it in sats or bitcoin (display only, no price feed)
- [x] QR display and scan for tokens

**Milestone:** A user with zero connectivity downloads a model once and asks it questions fully offline. A user sends and receives Cashu ecash entirely offline over BLE, tops up and cashes out over Lightning, and can rebuild the balance on a new device from twelve words.

## v1.2.0: Plugin Integrations

- [ ] `SocialPlugin` and `PaymentPlugin` interfaces in `src/core/`
- [ ] AT Protocol (Bluesky): DID association, feed integration, post bridge, follow graph import
- [ ] ActivityPub (Fediverse): Actor construction, Mastodon inbox/outbox, outbound posting
- [ ] UPI Payment Plugin: deep link initiation, opt-in only, KYC disclosure required
- [ ] Plugin registry, per-plugin opt-in, strict data boundary and capability model

## v1.3.0: Stabilization

No new features. Production bug fixes, race condition resolution in BLE and crypto layers, UI iteration from user feedback, and extended cross-device compatibility testing. Also ships an embedded Arti-based Tor library for Android, so Orbot is no longer required.

**Milestone:** Zero open P0/P1 bugs. BLE state machine stable across Pixel, Samsung, and Xiaomi device classes. Embedded Tor on both platforms. Ready to expand to new platforms.

## v1.4.0: Web / Browser

- [ ] `react-native-web` build, Nostr-only (no BLE mesh in browser)
- [ ] Chrome and Edge supported; Firefox and Safari unsupported (Web Bluetooth limitation)
- [ ] PWA manifest, static hosting

## v1.5.0: Terminal / CLI

- [ ] Node.js build target for `src/core/`
- [ ] Linux BLE via `@abandonware/noble` (BlueZ)
- [ ] CLI interface + daemonize support + Docker image

## v1.6.0: Smartwatch Companions

- [ ] Apple Watch app (SwiftUI, WatchConnectivity): message notifications, quick reply, panic wipe trigger
- [ ] Wear OS app (Kotlin, Compose for Wear, Wearable Data Layer): notifications, quick reply, panic wipe trigger

## v1.7.0: Desktop (macOS + Windows)

- [ ] `react-native-macos` target, macOS BLE via CoreBluetooth
- [ ] `react-native-windows` target, Windows BLE via WinRT
- [ ] Mac App Store + Microsoft Store submission

## v1.8.0: SDK / Library

- [ ] Extract `src/core/` as `@airhop/core` npm package with stable public API
- [ ] Extract `AirhopBLEModule` as `@airhop/ble` React Native library
- [ ] WASM build of `@airhop/core`; Python (PyPI), Rust (crates.io), Go language SDKs
- [ ] Custom application profiles: emergency communications and high-anonymity reference builds
- [ ] Developer documentation and API reference

## v1.9.0: Security Hardening

- [ ] Third-party cryptographic audit (Cure53 or equivalent), covering `src/core/crypto/`, packet signing, key storage, and `@airhop/core` public API
- [ ] Second independent audit, BLE mesh layer, Nostr bridge, and `@airhop/ble` scope
- [ ] Fuzz testing: packet codec, fragment reassembly, malformed inputs
- [ ] Chaos testing: packet corruption, adversarial peers, replay attacks, Sybil flooding
- [ ] Remediate all audit findings; publish reports publicly

## v2.0.0: Flagship Interface

- [ ] Full UI/UX redesign with design system, accessibility audit (WCAG 2.1 AA), low-end device support
- [ ] Android API 21+ (Android 5.0) and iOS 14+ compatibility verified
- [ ] All docs kept in sync with every release; CVEs disclosed publicly with timeline and impact
- [ ] Audit reports published in full; blog series on building private decentralized applications

## Known Issues

| Area                                                  | Status     | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Impact                                                                           |
| ----------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Cross-language Noise XX testing                       | Gap        | JS ↔ bitchat iOS interoperability testing still requires a device-based test harness.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Must be completed before App Store submission.                                   |
| Mesh DM retry after silent session discard            | Limitation | A DM sent over an established Noise session that the peer silently discarded (e.g. it restarted) is not re-sent once the session is re-established. bitchat retains such DMs until an authenticated delivery ack and retries them (#1462); Airhop only retries the courier/Nostr tiers, not in-session mesh DMs. Rare in practice, and the sender still sees no delivery tick.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | An in-flight mesh DM can be lost across a peer restart with no automatic resend. |
| Attachment encryption                                 | Limitation | Media (photos, videos, files, voice) uses the BLE file-transfer path only, signed but intentionally not encrypted to remain wire-compatible with bitchat. Media is restricted to Bluetooth mesh and mesh DMs only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Preserves full wire compatibility with bitchat.                                  |
| Tor on Android needs Orbot                            | Dependency | iOS embeds Arti, but Android currently relies on Orbot running in VPN mode. Enabling is gated on Orbot installed + VPN active, so it never turns on into clearnet; but a mid-session Orbot/VPN drop is not yet detected, so Android traffic can silently revert to clearnet until re-checked (inherent to the transparent-VPN model). Planned to be replaced with an embedded Arti library in v1.3.0.                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Android Tor requires a third-party app until v1.3.0; iOS is self-contained.      |
| Backgrounded iPhone is invisible to Android           | Platform   | CoreBluetooth moves the service UUID into the advertisement overflow area and drops the local name once the app is backgrounded. Only another iOS device scanning for that UUID can read it. Established links keep working; discovery is what stops.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | iPhone-to-Android discovery needs the iPhone app open. Not fixable in app code.  |
| BLE advertising is not on every Android device        | Platform   | Some devices at the API 26 floor ship chipsets or firmware with no BLE peripheral support, so `bluetoothLeAdvertiser` is null. They scan and receive normally but never advertise.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Affected devices can join a mesh but cannot be discovered by others.             |
| Peer ID in the advert differs per platform            | Platform   | Android carries 8 bytes of the peer ID in scan-response service data. CoreBluetooth has no service-data API, so iOS uses the local name instead. Neither can read the other's placement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Cross-platform links skip advert-level dedup and identify on the first ANNOUNCE. |
| ~~Internet gateway (full)~~                           | Fixed      | Airhop advertises the `.gateway` capability bit (ANNOUNCE TLV 0x05, byte-exact with bitchat `PeerCapabilities`), discovers gateway peers, originates `toGateway` uplink carriers when relays are unreachable, and as a gateway rebroadcasts relay events as `fromGateway` carriers with bitchat's loop rules, freshness gate, and airtime budget.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Mesh-only peers reach and receive geohash channels through a nearby gateway.     |
| ~~Mesh Noise handshake over multi-hop~~               | Fixed      | Handshake msg1/msg2/msg3 flood the mesh as recipient-addressed, unsigned, TTL-7 packets via the unicast path (direct link when one exists, otherwise broadcast flood), byte-for-byte with bitchat. A completed session is identity-bound (its static key must derive to the claimed peerID, per bitchat #1432) so a forged handshake cannot hijack a peer's session; crossed initiations use the lower-peerID tiebreak; stuck handshakes are reaped after 30s; and inbound LEAVE packets are signature-verified before acting.                                                                                                                                                                                                                                                                                                                                    | First-contact multi-hop DMs establish a mesh Noise session, safely.              |
| ~~Mesh bridge (channel bridge)~~                      | Fixed      | The public `#bluetooth` channel is stitched across separate mesh islands over the internet: while bridging, outgoing messages get a signed copy (unlinkable per-cell Nostr identity) published to a geohash-6 rendezvous cell (kind-20000, `#r` tag) with the content-stable mesh ID for cross-transport dedup; remote islands render them with a network glyph; mesh-only peers deposit through a bridge gateway via `toBridge`/`fromBridge` carriers. Advertised via `.bridge` (TLV 0x05 bit 1<<7) + the rendezvous cell (TLV 0x06), all byte-compatible with bitchat. Loop rules (three ID caches + radio-copy skip), per-role rate limits, a Connectivity toggle (off by default), a banner with the "across the bridge" count, and a per-message "nearby only" control. Scoped to the own geohash-6 cell (neighbor-ring coverage is a documented follow-up). | Out-of-Bluetooth-range mesh groups share one public chat over the internet.      |
| ~~Courier envelopes rejected by bitchat carriers~~    | Fixed      | Envelopes were stamped with a 7 day expiry. bitchat's `CourierStore` refuses anything past `maxLifetimeSeconds` (24 h) plus 1 h slack, so every Airhop envelope was silently dropped by bitchat devices and only carried Airhop to Airhop. Now stamped at 24 h from the shared constant.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Store-and-forward propagates through bitchat carriers again.                     |
| ~~Courier accepted any expiry~~                       | Fixed      | Deposit had no upper bound on an envelope's expiry, so a peer could stamp years out and hold a pool slot indefinitely. Now bounded to the same 24 h + 1 h slack bitchat enforces, and a verified-tier sub-cap of 20 stops strangers filling the pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Closes a storage-pinning vector and matches bitchat's limits exactly.            |
| ~~Tor routing (iOS)~~                                 | Fixed      | Nostr WebSocket traffic is routed through Arti via a native SOCKS5 module. Relay pools automatically reconnect over Tor while preserving TLS validation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Tor now protects Nostr traffic on iOS.                                           |
| ~~Multi-hop encrypted DM~~                            | Fixed      | Encrypted DMs now flood the mesh as recipient-addressed packets compatible with bitchat. Files remain direct-link only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Encrypted DMs reach non-adjacent peers over the mesh.                            |
| ~~`AnnounceManager.buildPacket()` sends no TLV 0x04~~ | Fixed      | `buildPacket()` now supports neighbor IDs and topology gossip through `buildAnnouncePayloadWithNeighbors()`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Topology gossip restored; TLV 0x04 is wire-compatible with bitchat.              |
| ~~WiFi not in `MessageRouter` priority chain~~        | Fixed      | No change was required. `MessageRouter` already prioritizes WiFi over BLE through `MeshService`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Behaviour unchanged: WiFi → BLE → Nostr → courier.                               |
| ~~`DeviceMonitoringManager` not in native BLE~~       | Fixed      | `PeerRegistry` now tracks direct and indirect peers with TTL-based expiry to mitigate slot exhaustion.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Anti-spam defence implemented; direct-peer slot exhaustion mitigated.            |
