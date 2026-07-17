# Airhop: Build Progress

> Updated when milestones complete, blockers are found, or decisions are made. It is the canonical answer to "where are we right now?"

## Current Version: v0.8.0 (Completed)

**Status:** Double Ratchet per-message forward secrecy, X3DH prekey agreement (Nostr bundle serialization), Android WiFi Aware native module (AirhopWiFiModule + AirhopWiFiPackage), iOS MultipeerConnectivity native module (AirhopMCModule), NativeAirhopWiFi TurboModule spec, chunked file transfer >1 MiB (FileAssembler), video capture + player (HEVC, VIDEO_FRAME 0x30, WiFi Direct only), all implemented and tested (265 passing).
**Started:** July 18, 2026
**Last Updated:** July 18, 2026

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
- [ ] Cross-language Noise XX test: JS client ↔ bitchat-ios Swift server (MUST PASS before shipping)
- [x] `src/core/crypto/noise-x.ts`: one-way Noise X for courier sealing
- [x] `src/core/mesh/fragment-manager.ts`: split/reassemble, 30s timeout, 128-slot concurrent cap
- [x] `src/core/mesh/gossip-sync.ts`: GCS filter reconciliation (Golomb-Rice encoding, TLV wire format)
- [x] `src/core/mesh/courier-store.ts`: sealed envelopes, trust tiers, spray-and-wait, daily recipient tags
- [x] `src/core/router/message-router.ts`: transport selection (BLE mesh broadcast / unicast, courier fallback)
- [x] Basic UI: channel list, message thread, peer list (minimal, functional)

**Milestone:** Full offline BLE mesh chat. Airhop ↔ bitchat message delivery verified.

## v0.7.0: Internet Bridge + Voice + Payments ✅

- [x] `src/core/nostr/client.ts`: SimplePool, auto-reconnect, Tor proxy config
- [x] `src/core/nostr/gift-wrap.ts`: NIP-17/59 gift-wrap DMs (HKDF key derivation, round-trip tested)
- [x] `src/core/nostr/geo-relay.ts`: load `assets/data/relays.csv`, Haversine nearest relay
- [x] `src/core/nostr/presence.ts`: kind 20001 geohash heartbeats
- [x] `src/core/nostr/courier-relay.ts`: Nostr bridge courier drops (kind 1401, tested)
- [x] `src/core/payments/cashu.ts`: token parse/embed/redeem with offline DLEQ validation
- [x] `src/core/payments/nutzap.ts`: NIP-61 online zaps
- [x] `src/core/payments/wallet-store.ts`: MMKV-backed local Cashu proof storage (balances, dedup)
- [x] `src/core/router/message-router.ts`: Nostr added as priority-2 transport (BLE > Nostr > Courier)
- [x] PTT voice: `src/core/mesh/voice-capture.ts` + `src/core/mesh/voice-player.ts`
- [x] iOS: `AirhopTorManager.swift`: full Arti lifecycle management (FFI, bootstrap, SOCKS probe)
- [x] iOS: `AirhopTorSession.swift`: URLSession SOCKS5 proxy factory (port 39050)
- [x] iOS: `AirhopTorModule.swift` + `AirhopTorModule.mm`: RN native module exposing Tor to JS
- [x] iOS: `ios/Arti.podspec`: CocoaPods spec linking `arti.xcframework` system libs (resolv, z, sqlite3)
- [x] iOS: `ios/Podfile`: `pod 'Arti'` added to link the xcframework
- [x] `src/bridge/NativeAirhopTor.ts`: TurboModule spec (startTor, stopTor, getTorStatus, awaitTorReady)
- [x] Android: `getTorProxyPort()`: probes localhost:9050 for Orbot SOCKS5 (in AirhopBLEModule.kt)

**Milestone:** Cross-city DMs via Nostr. Live voice PTT over BLE. Cashu offline payment working. Tor routing available on iOS via Arti.

## v0.8.0: High Bandwidth + Double Ratchet ✅

- [x] `src/core/crypto/double-ratchet.ts`: Signal DR per-message forward secrecy
- [x] `src/core/crypto/x3dh.ts`: X3DH prekey agreement; bundles published to Nostr
- [x] WiFi Aware native module (Android) + MultipeerConnectivity (iOS)
- [x] Chunked file transfer >1 MiB
- [x] Video frame capture (react-native-vision-camera v5, HEVC)
- [x] `0x30: videoFrame` packet type (WiFi Direct only)

**Milestone:** Offline video calling over WiFi Aware. Double Ratchet passing test vectors.

## v0.9.0: Production Hardening

- [ ] NFC contact exchange
- [ ] QR code scanner for peer verification
- [ ] Human-readable usernames (deterministic from pubkey)
- [ ] Panic wipe (triple-tap)
- [ ] Battery optimization flow (Android OEM)
- [ ] Georelays in-app relay map
- [ ] Full cross-platform compat test: Airhop ↔ bitchat-ios ↔ bitchat-android

**Milestone:** Feature-complete. Every core service has passing tests. No known protocol bugs.

## v1.0.0: UI + App Store Release

- [ ] Onboarding flow (first launch, key generation, username reveal)
- [ ] Visual design pass (typography, spacing, colour system, dark/light mode)
- [ ] Animations and transitions (react-native-reanimated)
- [ ] Accessibility audit
- [ ] App Store and Play Store submission
- [ ] YouTube demo series: full offline mesh demo, voice PTT, Cashu payment, Nostr bridge, panic wipe

**Milestone:** Submitted to app stores. Demo videos published.

## v1.1.0 to v1.3.x: Stabilization

No new features. Production bug fixes, race condition resolution in BLE and crypto layers, UI iteration from user feedback, and extended cross-device compatibility testing.

**Milestone:** Zero open P0/P1 bugs. BLE state machine stable across Pixel, Samsung, and Xiaomi device classes. Ready to expand to new platforms.

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

## v2.5.0: Plugin Integrations

- [ ] Generic `SocialPlugin` and `PaymentPlugin` interfaces in `src/core/`
- [ ] AT Protocol (Bluesky): DID association, feed integration, post bridge, follow graph import
- [ ] ActivityPub (Fediverse): Actor construction, Mastodon inbox/outbox, outbound posting
- [ ] UPI Payment Plugin: deep link initiation, opt-in only, KYC disclosure required
- [ ] Plugin registry, per-plugin opt-in, strict data boundary and capability model

## Blockers

_None currently._

## Decision Log

| Date       | Decision                                          | Rationale                                                                              | Alternatives Rejected                     |
| ---------- | ------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------- |
| 2026-07-12 | Build infra before UI                             | Non-negotiable; a reliable mesh node is the product                                    | UI-first (leads to empty shell)           |
| 2026-07-12 | Single-app (not monorepo)                         | No benefit at this stage; extract packages later                                       | Monorepo adds tooling overhead now        |
| 2026-07-12 | Expo bare workflow                                | BLE TurboModule needed from day 1; managed blocks it                                   | Managed workflow, plain RN CLI            |
| 2026-07-12 | Nostr over Matrix/XMPP                            | Permissionless, no homeserver, 350+ relays, bitchat-validated                          | Matrix (requires homeserver), XMPP (same) |
| 2026-07-12 | Follow bitchat-iOS Noise spec (ChaCha20-Poly1305) | bitchat-android diverged (AES-256-GCM); iOS is canonical                               | Match Android (inconsistent with iOS)     |
| 2026-07-12 | `@noble/curves` + `@noble/ciphers` for all crypto | Audited (Cure53), zero deps, React Native compatible                                   | `node:crypto`, sodium-native              |
| 2026-07-12 | Cashu for payments                                | Only offline-first ecash; bitchat already prototyping (`CashuTokenDecoderTests.swift`) | Lightning-only (requires internet)        |
