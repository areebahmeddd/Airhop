# Airhop: Build Progress

> Updated when milestones complete, blockers are found, or decisions are made. It is the canonical answer to "where are we right now?"

## Current Version: v1.0.0 (pre-field-test)

**Status:** Feature work complete and green in CI (663 tests, 0 lint errors, TypeScript clean). **Not yet validated on physical hardware.**

> [!IMPORTANT]
> A checked box below means "implemented and unit-tested", NOT "verified on devices".
> The BLE mesh has never been exercised on two real phones, and the native
> Kotlin/Swift modules have not been compiled by CI. Treat every radio-dependent
> claim as unproven until the first field test.

**Verified by tests:** packet codec (v1 and v2 headers, padding, compression),
fragment format and reassembly progress, Noise XX, Double Ratchet, courier
envelopes (static and prekey-sealed), one-time prekey bundles, gossip filters
(including type-aware board rounds), bulletin-board wire and store quotas,
private-group wire and epoch keys, gateway carrier codec, mesh ping/pong,
outbox delivery, contact-card binding, geohash derivation + relay determinism,
geohash DM round trip, Nostr gift-wrap and the bitchat envelope, proof selection.

**Cannot be verified without hardware:** discovery, MTU negotiation, cross-OS
connection lifecycle, real attachment transfer over the radio.

**Known not implemented:** live PTT voice (`VOICE_FRAME` reserved; needs a
streaming-mic native module on both platforms) and live video (WiFi Aware and
MultipeerConnectivity cannot interoperate, so cross-OS streaming is impossible).
Voice notes and recorded-video sharing both work via `FILE_TRANSFER`.

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

- [x] `src/core/payments/cashu.ts`: token parse/embed/redeem with offline DLEQ validation
- [x] `src/core/payments/nutzap.ts`: NIP-61 online zaps
- [x] `src/store/wallet-store.ts`: MMKV-backed local Cashu proof storage (balances, dedup)
- [x] Wallet UI in `src/features/wallet/wallet-screen.tsx`: balance view, send/receive over BLE, QR-based token exchange
- [x] Nutzap send/receive when online, distinguished from the offline Cashu flow
- [x] Mint management: add/remove trusted mints, per-mint balance breakdown

**Milestone:** A user with zero connectivity downloads a model once and asks it questions fully offline. A user sends and receives Cashu ecash entirely offline over BLE, and optionally sends a Nutzap when online.

## v1.2.0: Stabilization

No new features. Production bug fixes, race condition resolution in BLE and crypto layers, UI iteration from user feedback, and extended cross-device compatibility testing.

**Milestone:** Zero open P0/P1 bugs. BLE state machine stable across Pixel, Samsung, and Xiaomi device classes. Ready to expand to new platforms.

## v1.3.0: Plugin Integrations

- [ ] `SocialPlugin` and `PaymentPlugin` interfaces in `src/core/`
- [ ] AT Protocol (Bluesky): DID association, feed integration, post bridge, follow graph import
- [ ] ActivityPub (Fediverse): Actor construction, Mastodon inbox/outbox, outbound posting
- [ ] UPI Payment Plugin: deep link initiation, opt-in only, KYC disclosure required
- [ ] Plugin registry, per-plugin opt-in, strict data boundary and capability model

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

| Area                                                  | Status     | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Impact                                                                                     |
| ----------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Cross-language Noise XX testing                       | Gap        | JS ↔ bitchat iOS interoperability testing still requires a device-based test harness.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Must be completed before App Store submission.                                             |
| Attachment encryption                                 | Limitation | Media (photos, videos, files, voice) rides the BLE file-transfer path only, signed but not encrypted, exactly as bitchat does. Encrypting it would change the wire format and break interoperability. Media is restricted to Bluetooth mesh and mesh DMs (`canSendMedia`), matching bitchat's `canSendMediaInCurrentContext`, so it is never exposed where it cannot deliver or would be sent in the clear.                                                                                                                                                                                                                                                                                                                                 | Preserves full wire compatibility with bitchat.                                            |
| ~~Tor routing (iOS)~~                                 | Fixed      | The Nostr WebSocket now rides Arti's SOCKS5 proxy through a native `AirhopTorSocket` module (`URLSessionWebSocketTask` over the proxied ephemeral session), injected into nostr-tools via `useWebSocketImplementation` (see `tor-routing.ts`). Enabling Tor swaps the socket and rebuilds the relay pool; the persisted preference is applied before the first pool connects, and the pool auto-reconnects, so relays retry over Tor until Arti is ready and a Tor user never touches the clear net. TLS is still validated end to end to the relay (SOCKS only tunnels TCP; no certificate bypass). Android continues to route through Orbot's VPN. Requires the native module to be compiled into the iOS target and validated on device. | Tor now protects Nostr traffic on iOS.                                                     |
| Internet gateway (uplink)                             | Limitation | Airhop interoperates with bitchat gateway senders by relaying nearby peers' `TO_GATEWAY` carriers to Nostr. Airhop does not yet originate that carrier for its own offline device, so Airhop-to-Airhop offline gateway hops remain in progress.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Partial gateway functionality.                                                             |
| Mesh Noise handshake over multi-hop                   | Limitation | Airhop initiates a _new_ Noise session only over a direct BLE link, whereas bitchat floods the handshake over multi-hop. Once a session (or Double Ratchet) exists, Airhop floods DMs multi-hop exactly like bitchat. So a first-contact DM to a peer reachable only via relay (never in direct range, no session) falls back to Nostr/courier instead of establishing a mesh session. Non-breaking (the DM still delivers, and Airhop-to-Airhop always has the Nostr fallback); left as-is because flooding the handshake would require flooding the msg2/msg3 replies too, a change to the core handshake path best made with device validation.                                                                                          | First-contact DMs to multi-hop-only peers use the internet path, not a fresh mesh session. |
| ~~Multi-hop encrypted DM~~                            | Fixed      | An encrypted DM (Double Ratchet or Noise) to a peer with no direct link now floods the mesh as a recipient-addressed, TTL-7 packet: every node relays it (it cannot read the ciphertext) and only the addressee's handler claims it, bitchat's baseline mechanism. Signing excludes the TTL, so relaying does not invalidate it, and encrypted DMs are never gossip-replayed. Files stay direct-link only (too large to flood). With no neighbour to relay through, delivery falls back to Nostr then courier. The same directed-flood path carries a gateway carrier to a non-adjacent gateway.                                                                                                                                            | Encrypted DMs reach non-adjacent peers over the mesh, wire-compatible with bitchat v1.     |
| ~~`AnnounceManager.buildPacket()` sends no TLV 0x04~~ | Fixed      | `buildPacket()` now accepts optional `neighborIDs` and calls `buildAnnouncePayloadWithNeighbors()`. `start()` accepts a `getNeighborIDs` callback for live topology gossip.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Topology gossip restored; TLV 0x04 wire-compatible with bitchat.                           |
| ~~WiFi not in `MessageRouter` priority chain~~        | Fixed      | The proposed change was unnecessary. `MessageRouter` already uses the `unicast` callback from `MeshService`, which prefers WiFi over BLE when available.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Behaviour unchanged: WiFi → BLE → Nostr → courier.                                         |
| ~~`DeviceMonitoringManager` not in native BLE~~       | Fixed      | `PeerRegistry` now tracks direct peers with a 15 s TTL and mesh peers with a 60 s TTL. `markDirect()` and `markIndirect()` are called on BLE link events.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Anti-spam defence implemented; direct-peer slot exhaustion mitigated.                      |

## Blockers

_None._
