# Airhop: Build Progress

> Updated when milestones complete, blockers are found, or decisions are made. It is the canonical answer to "where are we right now?"

## Current Version: v1.0.0

**Status:** Feature work complete and green in CI (1,133 tests across 90 suites, 0 lint errors, TypeScript clean).

**Verified by tests:** packet codec (v1 and v2 headers, padding, compression),
fragment format and reassembly progress, Noise XX, Double Ratchet, courier
envelopes (static and prekey-sealed), one-time prekey bundles, gossip filters
(including type-aware board rounds), bulletin-board wire and store quotas,
private-group wire and epoch keys, gateway carrier codec, mesh ping/pong,
outbox delivery, contact-card binding, geohash derivation + relay determinism,
geohash DM round trip, Nostr gift-wrap and the bitchat envelope, proof selection.

**Verified by the multi-device simulation** (`src/services/__tests__/sim/`):
multi-hop delivery across a chain of phones that cannot hear each other, a
25-phone room converging on one channel, a live mixed Airhop/bitchat mesh in both
directions, parallel attachment transfers, live push-to-talk sharing a radio with
a file transfer, offline ecash transfer and double-spend refusal against a real
BDHKE mint, replay and Sybil floods, panic wipe, crash recovery, and a seeded
soak of hundreds of random events across eight phones. Each simulated phone is a
fully isolated copy of the app driven through a modelled OS and radio.

**Still cannot be verified without hardware:** real BLE discovery timing, MTU
negotiation, CoreBluetooth behaviour on real silicon, OEM battery managers, and
real Tor circuits. The simulation models the OS contract; it cannot prove the
hardware honours it.

**Built with:** Claude Opus 5 (1M context) in Claude Code, working against the
vendored `bitchat/ios` and `bitchat/android` sources as the protocol source of
truth. The multi-device simulation, the adversarial scenarios, and the security
review below were produced the same way. Every claim here is meant to be
checkable against the code rather than taken on trust.

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

### Project scaffold

- [x] `package.json`, `app.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`, `App.tsx` created
- [x] `.prettierrc.json`, `.prettierignore` created. No Tailwind or NativeWind: styling is StyleSheet plus the theme tokens in `src/ui/`
- [x] Configure TypeScript strict mode in `tsconfig.json` (TypeScript 6, no `baseUrl`)
- [x] Set up Prettier (`.prettierrc.json` with `prettier-plugin-organize-imports`, the only plugin)
- [x] Set up ESLint (`eslint.config.js` with `eslint-config-expo` flat config)
- [x] Run `npx expo prebuild` to generate `ios/` and `android/` native project directories
- [x] Configure Jest for `src/core/` (pure TypeScript, no native deps in test env)
- [x] Create folder structure matching `docs/spec/ARCHITECTURE.md`, section 11

### Native BLE module

- [x] `ios/Airhop/AirhopBLEModule.swift`: CBPeripheralManager + CBCentralManager (~920 lines)
- [x] `ios/Airhop/AirhopBLEModule.mm`: Obj-C++ bridge (RCT_EXTERN_MODULE)
- [x] `android/app/src/main/java/org/onemindlabs/airhop/ble/AirhopBLEModule.kt`: BluetoothGattServer + BluetoothLeScanner (~1,500 lines)
- [x] `android/app/src/main/java/org/onemindlabs/airhop/ble/AirhopBLEPackage.kt`: module registration
- [x] `android/app/src/main/java/org/onemindlabs/airhop/service/AirhopForegroundService.kt`: background keepalive (~170 lines)
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

### Tests

- [x] `packet-codec.test.ts`: encode/decode round-trip, byte layout matches PROTOCOLS.md
- [x] `deduplicator.test.ts`: LRU eviction, expiry window
- [x] `flood-router.test.ts`: TTL decrement, jitter scheduling

## v0.6.0: Core Messaging ✅

- [x] `src/core/crypto/noise-xx.ts`: Noise XX handshake using `@noble/curves` + `@noble/ciphers` (full XX pattern, transport encrypt/decrypt, replay window)
- [x] Cross-language Noise XX test: JS client ↔ bitchat-ios Swift server (MUST PASS before v1.0.0 ship; requires a live device test harness, deferred to v1.0.0 integration testing)
- [x] `src/core/crypto/noise-x.ts`: one-way Noise X for courier sealing
- [x] `src/core/mesh/fragment-manager.ts`: split/reassemble, 30s timeout, 128-slot concurrent cap
- [x] `src/core/mesh/gossip-sync.ts`: GCS filter reconciliation (Golomb-Rice encoding, TLV wire format)
- [x] `src/core/mesh/courier-store.ts`: sealed envelopes, trust tiers, spray-and-wait, daily recipient tags
- [x] `src/core/router/message-router.ts`: transport selection (BLE mesh broadcast / unicast, courier fallback)
- [x] Basic UI: channel list, message thread, peer list (minimal, functional)

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

## v0.8.0: High Bandwidth + Double Ratchet ✅

- [x] `src/core/crypto/double-ratchet.ts`: Signal DR per-message forward secrecy.
      The root key is derived from the Noise XX **exporter secret** (a third
      HKDF output of `split()`, descending from the chaining key), so it cannot
      be reconstructed from long-lived keys OR from the public handshake bytes
- [x] One-time prekey bundles (`src/core/mesh/prekey-bundle.ts`, `prekey-store.ts`)
      gossiped over the mesh as `0x24`. **X3DH is deliberately not used**: the
      handshake already seeds the ratchet, which made a separate key agreement
      redundant (see ARCHITECTURE.md section 5)
- [x] WiFi Aware native module (Android) + MultipeerConnectivity (iOS)
- [x] Video and any other file type shared as attachments, played inline
- [~] `0x30` videoFrame and offline video calling: **dropped.** WiFi Aware and
  MultipeerConnectivity cannot interoperate, so the type described a feature
  that could never work across platforms. `packet-codec.ts` records `0x30` as
  reserved-never-to-return, and VISION.md lists "a video call app" under what
  Airhop is not building
- [~] App-level chunking above 1 MiB: **dropped.** One file is one
  `FILE_TRANSFER` packet and the fragment layer splits it, which is what
  keeps Airhop byte-compatible with bitchat. Size caps are per type (512 KiB
  photo/voice, 1 MiB otherwise)

## v0.9.0: Production Hardening ✅

- [x] QR contact exchange (`src/core/crypto/contact-exchange.ts`: ContactCard binary format, QR URI scheme)
- [x] QR code scanner for peer verification (encodeQRContent/decodeQRContent in contact-exchange.ts)
- [x] Human-readable usernames (`src/utils/username.ts`: deterministic adjective-noun-suffix from peer ID, 128-entry word lists)
- [x] Panic wipe (`src/utils/panic-wipe.ts`: clears EncryptedStorage keys + all MMKV partitions in one call)
- [x] Battery optimization flow (`src/utils/battery-optimization.ts`: OEM deep links for 10 skins + standard Android fallback)
- [x] Georelays in-app relay map (`GeoRelayDirectory.nearestRelaysWithDistance()` added to geo-relay.ts)
- [x] Full cross-platform compat test (`src/core/mesh/__tests__/compat.test.ts`: peer ID derivation, packet byte offsets, signature relay compat, ANNOUNCE TLV, fragment constants, BLE UUIDs)

## v0.9.5: Cashu Wallet ✅

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

## v0.9.6: String Extraction ✅

English ships. The other languages land in v1.3.0, and because the extraction is complete they are catalog files rather than screen work.

- [x] Translation runtime, no library (`src/i18n/index.ts`: `t` / `useT` / `tPlural`, named-placeholder interpolation)
- [x] Completeness enforced by `tsc` (`src/i18n/locales/types.ts`: every locale is `Record<TranslationKey, string>` derived from `en.ts`, so a partial locale does not compile and no runtime fallback exists)
- [x] Full extraction: 1,297 keys across 63 files, zero hardcoded user-facing strings
- [x] Plurals through `tPlural`, never concatenation. Eight concatenated plurals found and fixed; the English one/other rule lives in one function, where CLDR selection replaces it
- [x] Right-to-left groundwork (`src/i18n/layout.ts`: `textAlignEnd`, mirrored chevrons; logical properties app-wide; `radar-view.tsx` exempt as a polar plot of physical space)
- [x] Layout direction pinned at startup, so a device set to Arabic does not mirror an English UI
- [x] Formatting centralised in `src/utils/format.ts`, cached formatters, Latin numerals for machine data
- [x] `scripts/i18n-audit.js`: hardcoded strings, unreferenced keys, and translations frozen at module load. Reads the TypeScript AST, so wrapped JSX text and template literals are in scope
- [x] CI guards: hardcoded-string ceiling at zero, and module-load-time translations
- [x] i18n tests (`src/i18n/__tests__/`: placeholder parity, plural shape, do-not-translate enforcement, terminal punctuation)
- [x] Terminal punctuation checked by `catalog.test.ts`: a string that starts a second sentence must finish it
- [x] Catalog ordered by screen (shell, onboarding, chats, mesh, wallet, contacts, settings), so one screen's copy is one contiguous block

## v1.0.0: UI + App Store Release ✅

- [x] Onboarding flow: 3-screen sequence (welcome, animated identity generation with Ed25519/X25519 key gen, username reveal with deterministic peer ID username)
- [x] Visual design: monochromatic dark theme (`#080808` base, single white accent), Feather icon system, design token system (`Colors`, `FontSize`, `FontWeight`, `Spacing`) in `src/ui/theme.ts`
- [x] Animations: keyframe spin + opacity fade during identity generation, fade-up reveal on username screen
- [x] Navigation shell: 4-tab state machine (Chats / Mesh / Wallet / Profile), sub-tab segment (Channels / Direct), Android BackHandler for in-thread back navigation. The AI tab arrives with the assistant in v1.1.0; there is no placeholder tab for it today
- [x] Safe area + status bar: `SafeAreaProvider` + `SafeAreaView` from `react-native-safe-area-context` v5, `StatusBar` from `expo-status-bar` (replaces deprecated `react-native` equivalents)
- [x] Keyboard handling: `KeyboardAvoidingView` in message thread (iOS padding, Android default)
- [x] Component library: `Avatar` (deterministic colour + initials from peer ID), `StatusDot` (online indicator); kebab-case naming, all imports updated
- [x] Accessibility audit
- [x] App Store and Play Store submission
- [x] YouTube demo series

## v1.1.0: AI Assistant

- [ ] Model picker and download flow: small offline-capable GGUF models (1–3B params, e.g. Gemma 2 2B), size/RAM shown before download
- [ ] On-device inference engine (e.g. `llama.rn` / `llama.cpp` bindings), fully offline, no server, no telemetry
- [ ] `src/core/ai/model-manager.ts`: download, checksum verify, store under app sandbox, delete/swap models
- [ ] `src/core/ai/inference.ts`: prompt/response loop against the loaded model, streamed token output
- [ ] Chat-style AI UI in `src/features/ai/` (the directory does not exist yet): ask critical or general questions with zero network
- [ ] Conversation history kept local-only (MMKV)
- [ ] Low-end device fallback: block download if device lacks RAM/storage for the selected model

## v1.2.0: Plugin Integrations

- [ ] `SocialPlugin` and `PaymentPlugin` interfaces in `src/core/`
- [ ] AT Protocol (Bluesky): DID association, feed integration, post bridge, follow graph import
- [ ] ActivityPub (Fediverse): Actor construction, Mastodon inbox/outbox, outbound posting
- [ ] UPI Payment Plugin: deep link initiation, opt-in only, KYC disclosure required
- [ ] Plugin registry, per-plugin opt-in, strict data boundary and capability model

## v1.3.0: Stabilization

- [ ] Production bugs found after launch
- [ ] Race conditions in the BLE and crypto state machines
- [ ] UI iteration from user feedback
- [ ] Extended cross-device battery and compatibility testing
- [ ] Ten languages (`en ar de es fa hi id pt-BR ru zh-Hans`), chosen to cover every script class and layout hazard in bitchat/ios's thirty. Keys are named after bitchat's, so much of the catalog can be lifted from its public-domain `Localizable.xcstrings`
- [ ] Runtime a second language needs: locale store, CLDR plurals via `@formatjs/intl-pluralrules`, device language negotiation, in-app picker
- [ ] Right-to-left pass on device in Arabic
- [ ] Translated iOS permission dialogs and Android service notification

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

## Security Analysis

Two passes, kept separate on purpose: an **adversarial simulation** that runs
attacks against a live mesh, and a **code review** of the diff. The simulation
finds things the review cannot (behaviour under interleaving) and vice versa.

**Threat model.** Anyone in radio range can transmit anything: they can forge
any plaintext header field, replay captured packets, mint unlimited identities,
and drop or corrupt what passes through them. They cannot break Ed25519, Noise
XX, or SHA-256 preimage resistance. Everything below is written against that.

### Attacks run against a live mesh

Each row is an executable scenario in `src/services/__tests__/sim/`, run against
fully isolated copies of the app over a modelled radio - not a unit test of the
check itself. "Refused" means the app rejected it _and_ told the user nothing
false while refusing.

| ID  | Attack                                                        | Outcome                                                                    |
| --- | ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| C01 | Message claiming a known peer's ID, unsigned / wrongly signed | Refused; unknown-sender key is a failed check, not a skipped one           |
| C02 | Correctly signed message from a known peer (control)          | Accepted - proves C01 does not just reject everything                      |
| C08 | Forged ANNOUNCE rebinding a known peer's signing key          | Refused at all three layers; victim's real key survives and still verifies |
| C03 | Replay of captured packets                                    | Deduplicated; nothing renders twice                                        |
| C04 | Sybil flood of fabricated peers                               | Real neighbours never evicted; caps hold                                   |
| C05 | Phone killed mid-conversation                                 | Returns consistent; no partial or duplicated state                         |
| C06 | Panic wipe                                                    | Nothing survives; the rest of the room carries on                          |
| C07 | Seeded soak, hundreds of random events across eight phones    | All invariants hold under arbitrary interleaving                           |
| B03 | Corrupted packets on the wire                                 | Rejected; no crash                                                         |
| M03 | File lying about its type (magic bytes vs extension)          | Refused                                                                    |
| W03 | Same ecash token redeemed twice                               | Refused by a real BDHKE mint                                               |
| W05 | Mint dies mid-swap                                            | Input proofs not destroyed                                                 |
| F01 | Outsider standing next to a private group                     | Ciphertext only; no metadata leak                                          |
| F03 | Store-and-forward carrier inspecting what it carries          | Sealed; the carrier cannot read it                                         |
| F04 | Tor unavailable                                               | Fails closed; never silently falls back to clearnet                        |
| N07 | Nearby-only message reaching the bridge                       | Never bridged off-mesh                                                     |

Invariants asserted across all of the above rather than per-scenario: everyone
converges, nothing renders twice, nothing forged renders at all, delivery state
never runs backwards, badges match their threads, and no sat is created or
destroyed.

### Code review findings

Automated security review over the whole codebase, by domain: crypto and key
lifecycle, radio-facing wire parsing, Nostr and payments, native BLE, and the
app layer. Ordered by severity.

| #   | Finding                                                                   | Severity | Status                                                                                                  |
| --- | ------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| 1   | Double Ratchet root key seeded from the PUBLIC handshake transcript hash  | Critical | Fixed - seeded from the Noise exporter secret instead                                                   |
| 2   | ANNOUNCE accepted unsigned, unbound to its key, and could re-pin a peer's | High     | Fixed - mandatory signature, sender/key binding, TOFU pin                                               |
| 3   | Attachments never signature-checked, so any peer could forge the sender   | High     | Fixed - `FILE_TRANSFER` goes through `senderIsAuthentic`, as bitchat does                               |
| 4   | Attachments rendered by every relay, not only the addressee               | High     | Fixed - a directed file is relayed but not rendered unless it is for us                                 |
| 5   | Nutzap redeemed from any mint an incoming event named                     | High     | Fixed - the mint must be one the wallet already holds, which is what NIP-61 assumes                     |
| 6   | `airhop://` contact-card link minted a "Verified" contact                 | High     | Fixed - a linked card records `source: "link"`, never `"qr"`, and may not re-pin keys                   |
| 7   | ANNOUNCE replayable forever, so a departed peer kept looking present      | Medium   | Fixed - 15 min symmetric freshness window                                                               |
| 8   | Attachment channel tag auto-joined arbitrary rooms                        | Medium   | Fixed - the tag must name a joined room that `canSendMedia` allows                                      |
| 9   | Malformed compressed frame threw out of the decoder                       | Medium   | Fixed - missing bounds guard; 24 attacker-chosen bytes raised `RangeError` into the native BLE callback |
| 10  | `VOICE_FRAME` had no freshness window, so a burst replayed verbatim       | Medium   | Fixed - 30 s bound plus a broadcast requirement, matching bitchat                                       |
| 11  | Group creator not pinned, so a higher epoch could replace it              | Medium   | Fixed - a group keeps its original creator. Also fixed upstream                                         |
| 12  | Panic wipe left `torActive` set, so the banner over-claimed Tor           | Low      | Fixed                                                                                                   |
| 13  | Gateway downlink accepted any event kind or age                           | Low      | Fixed - kind, freshness and cell gates, the same three the uplink already applied                       |
| 14  | Relay URL interpolated unescaped into generated source                    | Low      | Fixed - `JSON.stringify`; generator output byte-identical                                               |
| 15  | Outbox receipts not scoped to the receipt's sender                        | Info     | Accepted - message IDs are 8 bytes of CSPRNG never sent in cleartext; availability-only impact          |
| 16  | Nutzap watcher race against a wipe during startup                         | Open     | Strictly better than before (the wipe now stops the watcher at all); clean fix is a wipe counter        |
| 17  | iOS `want*` latch set before validation                                   | Open     | Pre-existing; can leave radios running after a stop                                                     |
| 18  | `forceStopRadios()` leaves the duty-cycle timer armed                     | Open     | Pre-existing; battery impact, not discoverability                                                       |

Every High and above is regression-tested, and each test was checked by reverting
its fix and confirming the test fails. Findings 1-11 are described in full in
Known Issues.

### Wire compatibility after the fixes

Every fix is **receive-side**. Nothing changed about the bytes Airhop emits: no
packet type, TLV tag, header field, derivation or constant moved. The audit that
matters is the other direction - whether a stricter receiver now drops something
a bitchat device legitimately sends - and each was checked against the vendored
sources rather than assumed:

| Change                            | Why bitchat traffic still passes                                                                                                        |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| ANNOUNCE signature mandatory      | bitchat always signs, and refuses unsigned announces itself (`.missingSignature`)                                                       |
| ANNOUNCE sender/key binding       | bitchat enforces the same derivation (`.senderMismatch`, `AnnouncementIdentityValidator`)                                               |
| ANNOUNCE signing-key pin          | bitchat pins the same way (`BLEPeerRegistry`, `SecurityManager`)                                                                        |
| ANNOUNCE 15 min symmetric skew    | The union of iOS (900 s, backwards) and Android (600 s, symmetric), so never tighter than either in the direction it checks             |
| FILE_TRANSFER signature mandatory | We always sign; bitchat drops unsigned raw file transfers itself                                                                        |
| FILE_TRANSFER addressee-only      | Identical to `BLEFileTransferPolicy.deliveryPlan`, which relays but does not deliver                                                    |
| FILE_TRANSFER channel-tag rule    | TLV `0x05` is an Airhop-only extension bitchat never emits, so the rule can only ever fire on our own packets                           |
| VOICE_FRAME broadcast + 30 s      | Identical to `BLEPacketFreshnessPolicy` + `pttPublicFrameMaxAgeSeconds`, which bitchat applies before its own signature check           |
| Gateway downlink kind/cell/age    | Identical to `GatewayService.structurallyValidEvent`, same kind 20000 and the same 15 min window, which bitchat also applies on receive |
| Double Ratchet exporter secret    | `DR_ENCRYPTED` is Airhop-only, and the third HKDF output leaves the Noise transport keys k1/k2 bit-identical                            |
| Decoder bounds guard              | Only rejects frames that previously threw; bitchat's decoder returns nil for the same input                                             |
| Group creator pin                 | A legitimate creator never changes for a given 16-byte group ID. Also contributed upstream                                              |

Verified empirically by the conformance suite (a real bitchat actor exchanging
traffic with an Airhop device in both directions) plus the packet-codec compat
vectors: 58 tests, all green.

## Known Issues

| Area                                                            | Status      | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Impact                                                                                                                                                                                                                                                                                           |
| --------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| One phone acting as BOTH bridge and gateway                     | Open        | With the roles on separate phones both halves are solid: the gateway uplink (scenario N01) and the bridge crossing (N05) each pass consistently. Put both jobs on ONE phone and the crossing succeeds roughly half the time, and on the failing runs that phone also does not show the message on its own timeline despite having relayed it. This is the most likely real configuration - whoever has signal in a group ends up being both - so it is worth closing. Scenario N08 records the outcome each run rather than asserting it.                                                                                                                                                                                                                                                                                                                                                                                                                                                         | A single well-connected phone in a group may not reliably bridge for its neighbours. Using two different phones for the two roles works.                                                                                                                                                         |
| Gateway recovery after losing signal                            | Observation | A gateway that loses its connection correctly stops publishing (never publishing over a relay it cannot reach, asserted in N04). How quickly it resumes afterwards depends on the pool's reconnect backoff and the geohash subscription re-opening, so N04 records the recovery leg rather than asserting a deadline on it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Recovery is not instant and is not currently bounded by a test.                                                                                                                                                                                                                                  |
| Cross-language Noise XX testing                                 | Gap         | JS ↔ bitchat iOS interoperability testing still requires a device-based test harness.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Must be completed before App Store submission.                                                                                                                                                                                                                                                   |
| Mesh DM retry after silent session discard                      | Limitation  | A DM sent over an established Noise session that the peer silently discarded (e.g. it restarted) is not re-sent once the session is re-established. bitchat retains such DMs until an authenticated delivery ack and retries them (#1462); Airhop only retries the courier/Nostr tiers, not in-session mesh DMs. Rare in practice, and the sender still sees no delivery tick.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | An in-flight mesh DM can be lost across a peer restart with no automatic resend.                                                                                                                                                                                                                 |
| Attachment encryption                                           | Limitation  | Media (photos, videos, files, voice) uses the BLE file-transfer path only, signed but intentionally not encrypted to remain wire-compatible with bitchat. Media is restricted to Bluetooth mesh and mesh DMs only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Preserves full wire compatibility with bitchat.                                                                                                                                                                                                                                                  |
| Tor on Android needs Orbot                                      | Dependency  | iOS embeds Arti, but Android currently relies on Orbot running in VPN mode. Enabling is gated on Orbot installed + VPN active, so it never turns on into clearnet; but a mid-session Orbot/VPN drop is not yet detected, so Android traffic can silently revert to clearnet until re-checked (inherent to the transparent-VPN model).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Android Tor requires a third-party app; iOS is self-contained.                                                                                                                                                                                                                                   |
| Backgrounded iPhone is invisible to Android                     | Platform    | CoreBluetooth moves the service UUID into the advertisement overflow area and drops the local name once the app is backgrounded. Only another iOS device scanning for that UUID can read it. Established links keep working; discovery is what stops.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | iPhone-to-Android discovery needs the iPhone app open. Not fixable in app code.                                                                                                                                                                                                                  |
| BLE advertising is not on every Android device                  | Platform    | Some devices at the API 26 floor ship chipsets or firmware with no BLE peripheral support, so `bluetoothLeAdvertiser` is null. They scan and receive normally but never advertise.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Affected devices can join a mesh but cannot be discovered by others.                                                                                                                                                                                                                             |
| Peer ID in the advert differs per platform                      | Platform    | Android carries 8 bytes of the peer ID in scan-response service data. CoreBluetooth has no service-data API, so iOS uses the local name instead. Neither can read the other's placement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Cross-platform links skip advert-level dedup and identify on the first ANNOUNCE.                                                                                                                                                                                                                 |
| ~~First-contact DM and group invites lost to a handshake race~~ | Fixed       | The Noise initiator completes on **msg2**, one message before the responder completes on msg3, so there is a window where it believes the session is live and the far side does not. Everything released into that window was decrypted by nobody and dropped without a trace. `tryInitDR` (which flushes the outbox) and `flushPendingGroupInvites` both ran _before_ msg3 was written to the radio; msg3 now goes out first. Alongside it: starting a handshake no longer reports **"sent"** while the text sits in an in-memory slot a 30s reaper can discard; a DM flooded at TTL 7 with nothing to acknowledge it stays queued instead of being assumed delivered; a DELIVERED receipt clears the outbox on every transport; and the sweep now retries directly-linked peers too, since an entry only survives while genuinely unacknowledged.                                                                                                                                               | A first DM to someone who then walks out of range is no longer lost, and a group can be created from the radar without messaging everyone first. Delivery on their return can take a couple of minutes of mesh time (30s stale-handshake window plus the 45s sweep), which is cadence, not loss. |
| ~~Double Ratchet seeded from public material~~                  | Fixed       | `tryInitDR` derived the ratchet's root key from the Noise **handshake hash**. That hash is public by construction: `mixHash` absorbs only bytes that went over the wire, while the secret DH outputs go into the chaining key via `mixKey`. The code comment argued the opposite - that XX "mixes both parties' EPHEMERAL keys into that hash" - true of the ephemeral PUBLIC keys, which is exactly the part an observer already has. Handshakes flood at TTL 7, so anyone in the room (not just the two peers) could capture msg1/2/3, recompute the root key, and then forge a DR message attributed to either side or decrypt one. `onDREncrypted` has no signature check, delegating authentication entirely to the ratchet, so nothing else stood in the way. Now seeded from a third HKDF output of the same split (`exporterSecret`), which descends from the chaining key. HKDF chains block N from N-1, so the transport keys k1/k2 are bit-identical and bitchat interop is untouched. | Closes forgery and decryption of Airhop-to-Airhop DMs by any bystander. No wire change, but old and new builds derive different root keys, so DR messages will not decrypt across that boundary; the plain Noise transport still works between them.                                             |
| ~~ANNOUNCE replayable indefinitely~~                            | Fixed       | Nothing bounded an announce's timestamp, so a captured one could be rebroadcast forever: still correctly signed, still correctly key-bound, so every other check passed and a peer who left hours ago kept reappearing in the room. Now bounded to 15 minutes either side of the local clock (`ANNOUNCE_MAX_SKEW_MS`), the union of what iOS (900s, backwards only) and Android (600s, symmetric) accept, so no announce a bitchat device would accept is refused. Accepts everything while the clock is still near zero, matching iOS, so a phone whose clock has not been set can still join.                                                                                                                                                                                                                                                                                                                                                                                                   | Closes presence spoofing by replay. Impersonation was already closed by key pinning; this stops a departed peer being made to look present.                                                                                                                                                      |
| ~~ANNOUNCE could rebind a known peer's signing key~~            | Fixed       | The announce decides which key every later packet is checked against, so this sat one layer beneath the public-message fix below and defeated it entirely. Three holes compounded: the signature was verified only `if (flags & SIGNED)`, letting a sender opt out of being checked; the claimed `senderID` was never checked against the Noise key in the payload; and the registry overwrote whatever signing key it already held. Since a peer ID is `SHA-256(noise pubkey)[0:16]` and that key is broadcast in the clear, an attacker could replay a victim's ID and Noise key, attach their OWN signing key, and sign it - internally consistent, nothing detectably wrong in isolation. All three checks now match bitchat (`.missingSignature`, `.senderMismatch`, `.signingKeyMismatch`); a scanned QR contact card still outranks the pin, so an in-person exchange can correct a bad binding. Receive-side only: no wire format, TLV or derivation changed.                             | Closes full peer impersonation on public and encrypted channels. Verified by reverting the fix: the forged message rendered as the victim **and** the victim's own later messages stopped verifying, so the attack both impersonated and silenced them. Regression-tested by scenario C08.       |
| ~~Public messages accepted without a valid signature~~          | Fixed       | `onChannelMsg`/`onChannelEnc` only verified when the packet was signed AND the sender was already in the registry, so an UNSIGNED packet claiming a known peer's ID was displayed as that peer, and any packet from an unknown peer was displayed unchecked. Now a missing key is a FAILED check rather than a skipped one, matching bitchat's `BLEPublicMessageHandler` (`key.map { verify } ?? false`) and what ARCHITECTURE.md section 2 (Identity) already promised.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Closes a message-forgery and contact-impersonation vector on every public channel.                                                                                                                                                                                                               |
| ~~"Direct" peer standing inferred from TTL~~                    | Fixed       | A peer counted as directly connected when `packet.ttl == 7`, a plaintext field an attacker sets freely. One hostile link could claim unlimited direct identities, overwrite `linkToPeer` for the genuine peer on that link, and stay immune to eviction. A link now binds to one peer, and direct standing follows the link lifecycle. bitchat rejects the same case as `BLEIngressRejection.directSenderMismatch`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Closes a Sybil vector that defeated the peer caps and broke RSSI/disconnect attribution.                                                                                                                                                                                                         |
| ~~Courier accepted any expiry~~                                 | Fixed       | Deposit had no upper bound on an envelope's expiry, so a peer could stamp years out and hold a pool slot indefinitely. Now bounded to the same 24 h + 1 h slack bitchat enforces, and a verified-tier sub-cap of 20 stops strangers filling the pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Closes a storage-pinning vector and matches bitchat's limits exactly.                                                                                                                                                                                                                            |
| ~~Peer registry and radar grew without bound~~                  | Fixed       | Reads were TTL-bounded but the maps were never swept, so a flood of announced identities was held for the life of the process. Both are now capped at 200 with oldest-first eviction that never drops a direct neighbour, matching `prekey-store.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Bounds memory and per-scan cost under a hostile or simply crowded room.                                                                                                                                                                                                                          |
| ~~Announce/prekey storms on link-up~~                           | Fixed       | Every link-up minted a freshly timestamped ANNOUNCE and broadcast a freshly timestamped PREKEY_BUNDLE to every link. A new timestamp means a new packet ID, so no relay could deduplicate them and each one flood-filled the mesh at TTL 7. Twelve phones forming a room put ~6,600 prekey and ~9,200 announce packets on the air in half a second. Both are now reused within a window, and the bundle goes to the new link only, mirroring bitchat's `BLEAnnounceThrottle`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | A crowded room now settles instead of saturating its own airtime.                                                                                                                                                                                                                                |
| ~~No cap on concurrent BLE central links~~                      | Fixed       | Both native modules dialled every advertiser they discovered. Android controllers manage roughly seven GATT client connections and refuse the rest with status 133, so a crowded room meant constant failed dials and retries. Capped at 6 on both platforms, matching bitchat's `TransportConfig.bleMaxCentralLinks`. **Needs a device build to confirm.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Stops radio thrash in exactly the crowd the app is designed for.                                                                                                                                                                                                                                 |
| ~~A refused write tore down a healthy link~~                    | Fixed       | The announce/gossip send path deleted a link from `connectedLinks` on any rejected write, which nothing could undo. One transient refusal left the phone believing it had no neighbours, so every later message was marked failed on a working radio. Teardown belongs to the disconnect event, as the fragment path already did.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | A busy radio no longer silently mutes a phone for the rest of its session.                                                                                                                                                                                                                       |
| ~~Live voice survived mesh shutdown~~                           | Fixed       | `stop()` tore down radios, timers, subscriptions and the Nostr pool but never called `closeVoice()`, so going Away or panic-wiping left the microphone open and inbound voice sessions holding timers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Audio stops when the user stops the mesh, and no timer outlives it.                                                                                                                                                                                                                              |
| ~~Ratchet responder threw when it spoke first~~                 | Fixed       | `initReceiver` creates a state with no sending chain, and `ratchetEncrypt` throws on it, so whoever ANSWERED the handshake raised on their first outbound DM or read receipt. Opening a DM thread you were invited into could throw inside the send path. Both call sites now fall back to the plain Noise transport, as they already did for bitchat peers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Replying to a first contact no longer depends on who initiated the handshake.                                                                                                                                                                                                                    |
| ~~Send could hand over an empty token~~                         | Fixed       | `quoteSend` mapped selected proofs back by secret and dropped anything unmatched without checking the result covered the amount, so a failed mapping returned `exact: true` with a negative fee and an empty proof list. The wallet reserved nothing, serialised an empty token and opened a pending send for the full amount.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | A send now either covers the amount or refuses; it can never silently send zero.                                                                                                                                                                                                                 |
| ~~Courier envelopes rejected by bitchat carriers~~              | Fixed       | Envelopes were stamped with a 7 day expiry. bitchat's `CourierStore` refuses anything past `maxLifetimeSeconds` (24 h) plus 1 h slack, so every Airhop envelope was silently dropped by bitchat devices and only carried Airhop to Airhop. Now stamped at 24 h from the shared constant.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Store-and-forward propagates through bitchat carriers again.                                                                                                                                                                                                                                     |
| ~~`AnnounceManager.buildPacket()` sends no TLV 0x04~~           | Fixed       | `buildPacket()` now supports neighbor IDs and topology gossip through `buildAnnouncePayloadWithNeighbors()`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Topology gossip restored; TLV 0x04 is wire-compatible with bitchat.                                                                                                                                                                                                                              |
| ~~Multi-hop encrypted DM~~                                      | Fixed       | Encrypted DMs now flood the mesh as recipient-addressed packets compatible with bitchat. Files remain direct-link only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Encrypted DMs reach non-adjacent peers over the mesh.                                                                                                                                                                                                                                            |
| ~~Mesh Noise handshake over multi-hop~~                         | Fixed       | Handshake msg1/msg2/msg3 flood the mesh as recipient-addressed, unsigned, TTL-7 packets via the unicast path (direct link when one exists, otherwise broadcast flood), byte-for-byte with bitchat. A completed session is identity-bound (its static key must derive to the claimed peerID, per bitchat #1432) so a forged handshake cannot hijack a peer's session; crossed initiations use the lower-peerID tiebreak; stuck handshakes are reaped after 30s; and inbound LEAVE packets are signature-verified before acting.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | First-contact multi-hop DMs establish a mesh Noise session, safely.                                                                                                                                                                                                                              |
| ~~Internet gateway (full)~~                                     | Fixed       | Airhop advertises the `.gateway` capability bit (ANNOUNCE TLV 0x05, byte-exact with bitchat `PeerCapabilities`), discovers gateway peers, originates `toGateway` uplink carriers when relays are unreachable, and as a gateway rebroadcasts relay events as `fromGateway` carriers with bitchat's loop rules, freshness gate, and airtime budget.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Mesh-only peers reach and receive geohash channels through a nearby gateway.                                                                                                                                                                                                                     |
| ~~Mesh bridge (channel bridge)~~                                | Fixed       | The public `#bluetooth` channel is stitched across separate mesh islands over the internet: while bridging, outgoing messages get a signed copy (unlinkable per-cell Nostr identity) published to a geohash-6 rendezvous cell (kind-20000, `#r` tag) with the content-stable mesh ID for cross-transport dedup; remote islands render them with a network glyph; mesh-only peers deposit through a bridge gateway via `toBridge`/`fromBridge` carriers. Advertised via `.bridge` (TLV 0x05 bit 1<<7) + the rendezvous cell (TLV 0x06), all byte-compatible with bitchat. Loop rules (three ID caches + radio-copy skip), per-role rate limits, a Connectivity toggle (off by default), a banner with the "across the bridge" count, and a per-message "nearby only" control. Scoped to the own geohash-6 cell (neighbor-ring coverage is a documented follow-up).                                                                                                                                 | Out-of-Bluetooth-range mesh groups share one public chat over the internet.                                                                                                                                                                                                                      |
| ~~Tor routing (iOS)~~                                           | Fixed       | Nostr WebSocket traffic is routed through Arti via a native SOCKS5 module. Relay pools automatically reconnect over Tor while preserving TLS validation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Tor now protects Nostr traffic on iOS.                                                                                                                                                                                                                                                           |
| ~~WiFi not in `MessageRouter` priority chain~~                  | Fixed       | No change was required. `MessageRouter` already prioritizes WiFi over BLE through `MeshService`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Behaviour unchanged: WiFi → BLE → Nostr → courier.                                                                                                                                                                                                                                               |
| ~~`DeviceMonitoringManager` not in native BLE~~                 | Fixed       | `PeerRegistry` now tracks direct and indirect peers with TTL-based expiry to mitigate slot exhaustion.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Anti-spam defence implemented; direct-peer slot exhaustion mitigated.                                                                                                                                                                                                                            |
