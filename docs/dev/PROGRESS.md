# Airhop: Build Progress

> Updated when milestones complete, blockers are found, or decisions are made. It is the canonical answer to "where are we right now?"

## Current Phase: 0 (Pre-Build)

**Status:** Project scaffold complete. Prettier, TypeScript, NativeWind, and all config files set up. Run `npx expo prebuild` to generate native `ios/` and `android/` directories, then start Phase 0 native BLE work.  
**Started:** July 12, 2026  
**Phase 0 target:** Two phones discover each other over BLE and exchange signed announce packets.

## Documentation Status

| Document                                                                   | Status      | Purpose                                          |
| -------------------------------------------------------------------------- | ----------- | ------------------------------------------------ |
| [`docs/design/VISION.md`](../design/VISION.md)                             | ✅ Complete | Why + principles + build order                   |
| [`docs/design/ROADMAP.md`](../design/ROADMAP.md)                           | ✅ Complete | Phases, milestones, gap analysis                 |
| [`docs/spec/ARCHITECTURE.md`](../spec/ARCHITECTURE.md)                     | ✅ Complete | Architecture, stack, code snippets               |
| [`docs/spec/PROTOCOLS.md`](../spec/PROTOCOLS.md)                           | ✅ Complete | Wire format, constants, compat table             |
| [`docs/dev/REFERENCE.md`](REFERENCE.md)                                    | ✅ Complete | bitchat codebase knowledge transfer              |
| [`docs/dev/PROGRESS.md`](PROGRESS.md)                                      | ✅ Active   | This file                                        |
| [`docs/dev/CONTRIBUTING.md`](CONTRIBUTING.md)                              | ✅ Complete | Standards for contributors + AI agents           |
| [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md) | ✅ Complete | VS Code Copilot workspace context                |
| [`.github/agents/`](../../.github/agents)                                  | ✅ Complete | Architect, Upstream Sync, Security Review agents |

## Phase 0: Foundation

**Goal:** Hello World BLE mesh between two phones.

### Project scaffold

- [x] `package.json`, `app.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`, `App.tsx` created
- [x] `global.css`, `tailwind.config.js`, `nativewind-env.d.ts`, `.prettierrc.json`, `.prettierignore` created
- [x] Configure TypeScript strict mode in `tsconfig.json` (TypeScript 7, no `baseUrl`)
- [x] Set up Prettier (`.prettierrc.json` with `prettier-plugin-tailwindcss` + `prettier-plugin-organize-imports`)
- [x] Set up ESLint (`eslint.config.js` with `eslint-config-expo` flat config)
- [ ] Run `npx expo prebuild` to generate `ios/` and `android/` native project directories
- [ ] Configure Jest for `src/core/` (pure TypeScript, no native deps in test env)
- [x] Create folder structure matching `docs/spec/ARCHITECTURE.md`, section 1

### Native BLE module

- [ ] `ios/Airhop/AirhopBLEModule.swift`: CBPeripheralManager + CBCentralManager (~400 lines)
- [ ] `ios/Airhop/AirhopBLEModule.mm`: Obj-C++ bridge (Codegen-generated or manual)
- [ ] `android/app/src/main/java/com/airhop/ble/AirhopBLEModule.kt`: BluetoothGattServer + BluetoothLeScanner (~500 lines)
- [ ] `android/app/src/main/java/com/airhop/ble/AirhopBLEPackage.kt`: module registration
- [ ] `android/app/src/main/java/com/airhop/service/AirhopForegroundService.kt`: background keepalive
- [x] iOS: `UIBackgroundModes: [bluetooth-central, bluetooth-peripheral]` in `app.json`
- [ ] Android: foreground service permission in AndroidManifest (after `prebuild`)
- [ ] `src/bridge/NativeAirhopBLE.ts`: TurboModule TypeScript spec (Codegen input)

### Core mesh engine

- [ ] `src/core/mesh/packet-codec.ts`: binary encode/decode, matches PROTOCOLS.md exactly
- [ ] `src/core/mesh/flood-router.ts`: TTL flood, jitter, dedup
- [ ] `src/core/mesh/deduplicator.ts`: LRU 1000-entry seen-set
- [ ] `src/core/mesh/announce-manager.ts`: signed presence broadcasts
- [ ] `src/core/crypto/identity.ts`: key generation, Keychain storage, peer ID

### Tests (must pass before milestone)

- [ ] `packet-codec.test.ts`: encode/decode round-trip, byte layout matches PROTOCOLS.md
- [ ] `deduplicator.test.ts`: LRU eviction, expiry window
- [ ] `flood-router.test.ts`: TTL decrement, jitter scheduling

**Milestone:** ✅ Two phones on BLE discover each other and exchange signed ANNOUNCE packets.

## Phase 1: Core Messaging

_(Not started; begins after Phase 0 milestone)_

- [ ] `src/core/crypto/noise-xx.ts`: Noise XX handshake using `@noble/curves` + `@noble/ciphers`
- [ ] Cross-language Noise XX test: JS client ↔ bitchat-ios Swift server (MUST PASS before shipping)
- [ ] `src/core/crypto/noise-x.ts`: one-way Noise X for courier sealing
- [ ] `src/core/mesh/fragment-manager.ts`: split/reassemble, 30s timeout
- [ ] `src/core/mesh/gossip-sync.ts`: GCS filter reconciliation
- [ ] `src/core/mesh/courier-store.ts`: sealed envelopes, trust tiers, spray-and-wait
- [ ] `src/core/router/message-router.ts`: transport selection
- [ ] Basic UI: channel list, message thread, peer list (minimal, functional, not beautiful)

**Milestone:** Full offline BLE mesh chat. Airhop ↔ bitchat message delivery verified.

## Phase 2: Internet Bridge + Voice

_(Not started)_

- [ ] `src/core/nostr/client.ts`: SimplePool, auto-reconnect
- [ ] `src/core/nostr/gift-wrap.ts`: NIP-17/59 gift-wrap DMs
- [ ] `src/core/nostr/geo-relay.ts`: load `assets/data/relays.csv`, Haversine nearest relay
- [ ] `src/core/nostr/presence.ts`: kind 20001 geohash heartbeats
- [ ] iOS: Arti Tor integration (copy from `bitchat-ios/`)
- [ ] Android: Orbot SOCKS5 proxy detection
- [ ] `src/core/payments/cashu.ts`: token parse/embed/redeem
- [ ] `src/core/payments/nutzap.ts`: NIP-61 online zaps
- [ ] PTT voice: `VoiceCapture.ts` + `VoicePlayer.ts`

**Milestone:** Cross-city DMs via Nostr. Live voice PTT over BLE. Cashu offline payment working.

## Phase 3: WiFi Transport + Double Ratchet

_(Not started)_

- [ ] `src/core/crypto/double-ratchet.ts`: Signal DR per-message forward secrecy
- [ ] `src/core/crypto/x3dh.ts`: X3DH prekey agreement
- [ ] WiFi Aware native module (Android) + MultipeerConnectivity (iOS)
- [ ] Chunked file transfer >1 MiB
- [ ] Video frame capture (react-native-vision-camera)
- [ ] `0x30 VIDEO_FRAME` packet type

**Milestone:** Offline video calling over WiFi Aware between two Android phones.

## Phase 4: Polish & Publish

_(Not started)_

- [ ] NFC contact exchange
- [ ] QR code scanner for peer verification
- [ ] Human-readable usernames (deterministic from pubkey)
- [ ] Panic wipe (triple-tap)
- [ ] Battery optimization flow (Android OEM)
- [ ] App Store + Play Store submission

## Blockers

_None currently._

## Decision Log

| Date       | Decision                                          | Rationale                                                                              | Alternatives Rejected                     |
| ---------- | ------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------- |
| 2026-07-12 | Single-app (not monorepo)                         | No benefit at this stage; extract packages later                                       | Monorepo adds tooling overhead now        |
| 2026-07-12 | Expo bare workflow                                | BLE TurboModule needed from day 1; managed blocks it                                   | Managed workflow, plain RN CLI            |
| 2026-07-12 | `@noble/curves` + `@noble/ciphers` for all crypto | Audited (Cure53), zero deps, React Native compatible                                   | node:crypto, sodium-native                |
| 2026-07-12 | Nostr over Matrix/XMPP                            | Permissionless, no homeserver, 290+ relays, bitchat-validated                          | Matrix (requires homeserver), XMPP (same) |
| 2026-07-12 | Cashu for payments                                | Only offline-first ecash; bitchat already prototyping (`CashuTokenDecoderTests.swift`) | Lightning-only (requires internet)        |
| 2026-07-12 | Follow bitchat-iOS Noise spec (ChaCha20-Poly1305) | bitchat-android diverged (AES-256-GCM); iOS is canonical                               | Match Android (inconsistent with iOS)     |
| 2026-07-12 | Build infra before UI                             | Non-negotiable; a reliable mesh node is the product                                    | UI-first (leads to empty shell)           |
