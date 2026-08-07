# Airhop: Build Progress

> Updated when milestones complete, blockers are found, or decisions are made. It is the canonical answer to "where are we right now?"

## Current Version: v1.0.0

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

- [x] `ios/Airhop/AirhopBLEModule.swift`: CBPeripheralManager + CBCentralManager
- [x] `ios/Airhop/AirhopBLEModule.mm`: Obj-C++ bridge (RCT_EXTERN_MODULE)
- [x] `android/app/src/main/java/org/onemindlabs/airhop/ble/AirhopBLEModule.kt`: BluetoothGattServer + BluetoothLeScanner
- [x] `android/app/src/main/java/org/onemindlabs/airhop/ble/AirhopBLEPackage.kt`: module registration
- [x] `android/app/src/main/java/org/onemindlabs/airhop/service/AirhopForegroundService.kt`: background keepalive
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
- [x] `src/core/nostr/geo-relay.ts`: load `assets/data/nostr_relays.csv`, Haversine nearest relay
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
- [x] `src/services/ecash-transfer.ts`: `payPerson`, one payment ladder (radio, nutzap, token, manual) shared by all four entry points: DM attach, contact sheet, Mesh peer sheet and Wallet Zap
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
- [x] Full extraction: every user-facing string in the catalog, zero hardcoded, enforced in CI
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

| #   | Finding                                                                   | Severity | Status                                                                                                   |
| --- | ------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| 1   | Double Ratchet root key seeded from the PUBLIC handshake transcript hash  | Critical | Fixed - seeded from the Noise exporter secret instead                                                    |
| 2   | ANNOUNCE accepted unsigned, unbound to its key, and could re-pin a peer's | High     | Fixed - mandatory signature, sender/key binding, TOFU pin                                                |
| 3   | Attachments never signature-checked, so any peer could forge the sender   | High     | Fixed - `FILE_TRANSFER` goes through `senderIsAuthentic`, as bitchat does                                |
| 4   | Attachments rendered by every relay, not only the addressee               | High     | Fixed - a directed file is relayed but not rendered unless it is for us                                  |
| 5   | Nutzap redeemed from any mint an incoming event named                     | High     | Fixed - the mint must be one the wallet already holds, which is what NIP-61 assumes                      |
| 6   | `airhop://` contact-card link minted a "Verified" contact                 | High     | Fixed - a linked card records `source: "link"`, never `"qr"`, and may not re-pin keys                    |
| 7   | ANNOUNCE replayable forever, so a departed peer kept looking present      | Medium   | Fixed - 15 min symmetric freshness window                                                                |
| 8   | Attachment channel tag auto-joined arbitrary rooms                        | Medium   | Fixed - the tag must name a joined room that `canSendMedia` allows                                       |
| 9   | Malformed compressed frame threw out of the decoder                       | Medium   | Fixed - missing bounds guard; 24 attacker-chosen bytes raised `RangeError` into the native BLE callback  |
| 10  | `VOICE_FRAME` had no freshness window, so a burst replayed verbatim       | Medium   | Fixed - 30 s bound plus a broadcast requirement, matching bitchat                                        |
| 11  | Group creator not pinned, so a higher epoch could replace it              | Medium   | Fixed - a group keeps its original creator. Also fixed upstream                                          |
| 16  | Nutzap watcher race against a wipe during startup                         | Medium   | Fixed - startup captures a wipe generation before its first await and re-checks it before installing     |
| 12  | Panic wipe left `torActive` set, so the banner over-claimed Tor           | Low      | Fixed                                                                                                    |
| 13  | Gateway downlink accepted any event kind or age                           | Low      | Fixed - kind, freshness and cell gates, the same three the uplink already applied                        |
| 14  | Relay URL interpolated unescaped into generated source                    | Low      | Fixed - `JSON.stringify`; generator output byte-identical                                                |
| 17  | iOS `want*` latch set before validation                                   | Low      | Fixed - the latch is set per state branch; transient states keep it, refusals no longer arm the radio    |
| 18  | `forceStopRadios()` leaves the duty-cycle timer armed                     | Low      | Fixed - calls `stopScanCycle()`, so the queued toggle cannot restart the scanner after the service stops |
| 15  | Outbox receipts not scoped to the receipt's sender                        | Info     | Accepted - message IDs are 8 bytes of CSPRNG never sent in cleartext; availability-only impact           |

Every High and above is regression-tested, and each test was checked by reverting
its fix and confirming the test fails. Findings 1-11 are described in full in
Known Issues.

## Known Issues

| Area                                                            | Status      | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Impact                                                                                                                                                                                                                                                            |
| --------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One phone acting as BOTH bridge and gateway                     | Open        | On separate phones, both roles hold up: the gateway uplink (scenario N01) and the bridge crossing (N05) pass consistently. On one phone doing both jobs, the crossing succeeds only about half the time, and on failing runs that phone also drops the message from its own timeline. This is the most likely real-world setup, since whoever has signal ends up running both roles. Scenario N08 records the outcome per run rather than asserting it.                                                                                                                                                                                                        | Requires two separate phones for reliable bridge and gateway roles.                                                                                                                                                                                               |
| Gateway recovery after losing signal                            | Observation | A gateway correctly stops publishing once it loses its relay connection (asserted in N04). Recovery time depends on the pool's reconnect backoff and geohash resubscription. N04 records the recovery leg but does not assert a deadline on it.                                                                                                                                                                                                                                                                                                                                                                                                                | Leaves gateway recovery time unbounded and untested.                                                                                                                                                                                                              |
| Tor on Android needs Orbot                                      | Dependency  | iOS embeds Arti directly; Android relies on Orbot running in VPN mode. Enabling is gated on Orbot installed and VPN active, so Tor never turns on into clearnet. A mid-session Orbot/VPN drop is not yet detected, so traffic can silently revert to clearnet until the next check.                                                                                                                                                                                                                                                                                                                                                                            | Requires a third-party app for Tor on Android; iOS is self-contained.                                                                                                                                                                                             |
| No Tor bridges or pluggable transports                          | Gap         | Neither platform can reach Tor through a bridge. The vendored Arti build has no pluggable-transport support, and Android inherits whatever Orbot is configured to do, which Airhop cannot set or verify. A direct Tor connection is identifiable by consumer-grade deep packet inspection. bitchat has the same gap.                                                                                                                                                                                                                                                                                                                                           | Leaves Tor use itself visible to network observers, which is why Tor stays off by default on both platforms.                                                                                                                                                      |
| Nearby alerts cannot be silenced per device                     | Gap         | The nearby notification fires on a 0-to-1 peer-count edge and counts peers without distinguishing them, so a user's own second device retriggers it on every radio flap. The planned fix is a per-peer `notifyOnProximity` flag, on by default, with an "Ignore in nearby alerts" toggle on that peer's info sheet.                                                                                                                                                                                                                                                                                                                                            | Retriggers nearby alerts for a user's own second device on every radio flap.                                                                                                                                                                                      |
| Backgrounded iPhone is invisible to Android                     | Platform    | CoreBluetooth moves the service UUID into the advertisement overflow area and drops the local name once the app is backgrounded. Only another iOS device scanning for that UUID can read it. Established links keep working; only discovery stops.                                                                                                                                                                                                                                                                                                                                                                                                             | Requires the iPhone app to stay open for Android to discover it. Not fixable in app code.                                                                                                                                                                         |
| BLE advertising is not on every Android device                  | Platform    | Some devices at the API 26 floor have no BLE peripheral support, so `bluetoothLeAdvertiser` is null. They scan, relay and receive but never advertise. The platform fact stands; the handling is fixed. Native answers `UNSUPPORTED`, which the reconciler treated as transient and retried on a 5s ladder for the life of the mesh. The refusal is now latched once, scanning continues, and the Mesh tab carries a dismissible note. Scenario S13.                                                                                                                                                                                                           | Affected devices join a mesh but are not discoverable, now stated in the UI rather than retried in silence.                                                                                                                                                       |
| Neighbour list is never advertised                              | Deliberate  | `buildPacket()` can encode neighbour IDs, but every call site passes an empty list, so Airhop advertises no adjacency of its own. The TLV carries up to ten 8-byte peer IDs, so one passive listener in range could otherwise reconstruct who is standing next to whom. bitchat stopped emitting it for the same reason (#1492). Lists from other peers are still parsed, so a mixed mesh behaves normally.                                                                                                                                                                                                                                                    | Falls back to flooding for directed sends, since there is no adjacency to route on. More airtime in dense meshes; no correctness change.                                                                                                                          |
| ~~Double Ratchet seeded from public material~~                  | Fixed       | `tryInitDR` derived the ratchet's root key from the Noise handshake hash, which is public: only wire bytes go through `mixHash`, while the secret DH output goes through `mixKey`. Handshakes flood at TTL 7, so anyone in the room could capture msg1/2/3, recompute the root key, and forge or decrypt DR messages. Now seeded from a third HKDF output of the same split (`exporterSecret`), descending from the chaining key; k1/k2 stay bit-identical, so bitchat interop is unaffected.                                                                                                                                                                  | Closes forgery and decryption of Airhop DMs by bystanders; old and new builds derive different root keys and cannot decrypt each other's DR messages.                                                                                                             |
| ~~ANNOUNCE could rebind a known peer's signing key~~            | Fixed       | Signature checks were skipped unless the SIGNED flag was set, the claimed senderID was never checked against the Noise key, and the registry overwrote any existing signing key. Since peer ID is `SHA-256(noise pubkey)[0:16]` and that key is public, an attacker could replay a victim's ID and Noise key with their own signing key attached. Now matches bitchat's three checks (`.missingSignature`, `.senderMismatch`, `.signingKeyMismatch`); a scanned QR contact still outranks the pin.                                                                                                                                                             | Closes full peer impersonation on public and encrypted channels; regression-tested by scenario C08.                                                                                                                                                               |
| ~~ANNOUNCE replayable indefinitely~~                            | Fixed       | Announce timestamps had no bound, so a captured announce could be rebroadcast forever and pass every other check. Now bounded to 15 minutes either side of the local clock (`ANNOUNCE_MAX_SKEW_MS`), matching the union of iOS (900s, backwards only) and Android (600s, symmetric).                                                                                                                                                                                                                                                                                                                                                                           | Stops a departed peer from being replayed into looking present.                                                                                                                                                                                                   |
| ~~Public messages accepted without a valid signature~~          | Fixed       | `onChannelMsg`/`onChannelEnc` only verified signed packets from senders already in the registry, so an unsigned packet claiming a known ID rendered as that peer. A missing key is now a failed check, matching bitchat's `BLEPublicMessageHandler`.                                                                                                                                                                                                                                                                                                                                                                                                           | Closes message forgery and impersonation on public channels.                                                                                                                                                                                                      |
| ~~"Direct" peer standing inferred from TTL~~                    | Fixed       | A peer counted as directly connected whenever `packet.ttl == 7`, a field an attacker sets freely, letting one hostile link claim unlimited direct identities. A link now binds to one peer, and direct standing follows the link lifecycle, matching bitchat's `directSenderMismatch` rejection.                                                                                                                                                                                                                                                                                                                                                               | Closes a Sybil vector that defeated peer caps and RSSI/disconnect attribution.                                                                                                                                                                                    |
| ~~Peer ID in the advert differs per platform~~                  | Fixed       | Android carries 8 bytes of the peer ID in scan-response service data; iOS carried it in the advertisement local name. Removed from iOS rather than taught to Android: nothing read that field on either platform, so it was a stable identifier broadcast to every passive scanner for nothing. iOS now advertises the service UUID alone, matching bitchat-ios `advertisementData()`.                                                                                                                                                                                                                                                                         | Removes a passive-tracking identifier. Advert-level dedup of iPhones never worked, so discovery, QR exchange and `airhop://` links are unaffected; a duplicate link under a rotated address is reclaimed by the 15s reaper, as it already is for bitchat iPhones. |
| ~~Ratchet responder threw when it spoke first~~                 | Fixed       | `initReceiver` creates a state with no sending chain, so `ratchetEncrypt` threw on the first outbound message from whoever answered a handshake. Both call sites now fall back to the plain Noise transport.                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Removes the send-path crash when replying to a first contact.                                                                                                                                                                                                     |
| ~~First-contact DM and group invites lost to a handshake race~~ | Fixed       | The initiator completes on msg2, one message before the responder completes on msg3, so anything sent in that window was decrypted by nobody. `tryInitDR` and `flushPendingGroupInvites` now run after msg3 goes out. Also fixed: sends no longer report "sent" from a discardable in-memory slot, unacknowledged TTL-7 DMs stay queued, a DELIVERED receipt clears the outbox on every transport, and the sweep retries direct-linked peers too.                                                                                                                                                                                                              | Prevents loss of first DMs and group invites sent during the handshake window; delivery on return adds cadence, not loss.                                                                                                                                         |
| ~~Mesh DM retry after silent session discard~~                  | Fixed       | A DM over an established session with a direct link returned "sent" and was never queued, so a peer that had restarted and discarded the session received nothing while the sender saw a tick. Every mesh `sent` is now enqueued, matching bitchat's rule that nothing counts as delivered without an authenticated ack (#1462). All three receipt paths clear the entry, and a receipt arrives well inside the 15-30s flush interval.                                                                                                                                                                                                                         | Closes silent loss of a mesh DM across a peer restart.                                                                                                                                                                                                            |
| ~~Announce/prekey storms on link-up~~                           | Fixed       | Every link-up minted a freshly timestamped ANNOUNCE and PREKEY_BUNDLE, so no relay could dedup them and each flooded the mesh at TTL 7: twelve phones put ~6,600 prekey and ~9,200 announce packets on the air in half a second. Both are now reused within a window, and the bundle only goes to the new link, matching bitchat's `BLEAnnounceThrottle`.                                                                                                                                                                                                                                                                                                      | Stops a crowded room from saturating its own airtime.                                                                                                                                                                                                             |
| ~~No cap on concurrent BLE central links~~                      | Fixed       | Both native modules dialled every advertiser they discovered; Android controllers support roughly seven GATT client connections and refuse the rest with status 133. Capped at 6 on both platforms, matching bitchat's `bleMaxCentralLinks`.                                                                                                                                                                                                                                                                                                                                                                                                                   | Stops radio thrash in a crowded room. Needs a device build to confirm.                                                                                                                                                                                            |
| ~~A refused write tore down a healthy link~~                    | Fixed       | The announce/gossip send path deleted a link from `connectedLinks` on any rejected write, an action nothing could undo, so one transient refusal left the phone believing it had no neighbours. Teardown now belongs to the disconnect event, as the fragment path already handled it.                                                                                                                                                                                                                                                                                                                                                                         | Stops a busy radio from silently muting a phone for the rest of its session.                                                                                                                                                                                      |
| ~~Live voice survived mesh shutdown~~                           | Fixed       | `stop()` tore down radios, timers, subscriptions and the Nostr pool but never called `closeVoice()`, so going Away or panic-wiping left the microphone open and voice timers running.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Stops audio and timers from outliving a stopped mesh.                                                                                                                                                                                                             |
| ~~Peer registry and radar grew without bound~~                  | Fixed       | Reads were TTL-bounded but the maps were never swept, so announced identities accumulated for the life of the process. Both are now capped at 200 with oldest-first eviction that never drops a direct neighbour, matching `prekey-store.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                  | Bounds memory and per-scan cost in a hostile or crowded room.                                                                                                                                                                                                     |
| ~~`DeviceMonitoringManager` not in native BLE~~                 | Fixed       | `PeerRegistry` now tracks direct and indirect peers with TTL-based expiry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Mitigates direct-peer slot exhaustion.                                                                                                                                                                                                                            |
| ~~Courier accepted any expiry~~                                 | Fixed       | Deposit had no upper bound on envelope expiry, so a peer could stamp years out and hold a pool slot indefinitely. Now bounded to bitchat's 24h + 1h slack, with a 20-slot sub-cap for the verified tier.                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Closes a storage-pinning vector; matches bitchat's limits exactly.                                                                                                                                                                                                |
| ~~Courier envelopes rejected by bitchat carriers~~              | Fixed       | Envelopes were stamped with a 7-day expiry, but bitchat's `CourierStore` refuses anything past 24h + 1h slack, so every Airhop envelope was silently dropped by bitchat carriers. Now stamped at 24h from the shared constant.                                                                                                                                                                                                                                                                                                                                                                                                                                 | Restores store-and-forward propagation through bitchat carriers.                                                                                                                                                                                                  |
| ~~Send could hand over an empty token~~                         | Fixed       | `quoteSend` mapped selected proofs back by secret and dropped unmatched ones without checking coverage, so a failed mapping returned `exact: true` with a negative fee and an empty proof list, reserving nothing.                                                                                                                                                                                                                                                                                                                                                                                                                                             | Guarantees a send either covers the amount or refuses; it can never silently send zero.                                                                                                                                                                           |
| ~~Multi-hop encrypted DM~~                                      | Fixed       | Encrypted DMs now flood the mesh as recipient-addressed packets compatible with bitchat. Files remain direct-link only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Reaches non-adjacent peers with encrypted DMs over the mesh.                                                                                                                                                                                                      |
| ~~Mesh Noise handshake over multi-hop~~                         | Fixed       | Handshake msg1/msg2/msg3 flood the mesh as recipient-addressed, unsigned, TTL-7 packets, byte-for-byte with bitchat. A completed session is identity-bound (static key must derive to the claimed peerID, per bitchat #1432); crossed initiations tiebreak on the lower peerID; stuck handshakes reap after 30s; inbound LEAVE packets are signature-verified before acting.                                                                                                                                                                                                                                                                                   | Establishes a safe mesh Noise session for first-contact multi-hop DMs.                                                                                                                                                                                            |
| ~~Internet gateway (full)~~                                     | Fixed       | Airhop advertises the `.gateway` capability bit (ANNOUNCE TLV 0x05, byte-exact with bitchat's `PeerCapabilities`), discovers gateway peers, originates `toGateway` uplinks when relays are unreachable, and rebroadcasts relay events as `fromGateway` carriers with bitchat's loop rules, freshness gate, and airtime budget.                                                                                                                                                                                                                                                                                                                                 | Reaches geohash channels for mesh-only peers through a nearby gateway.                                                                                                                                                                                            |
| ~~Mesh bridge (channel bridge)~~                                | Fixed       | The public `#bluetooth` channel bridges across mesh islands over the internet: outgoing messages get a signed copy published to a geohash-6 rendezvous cell (kind-20000, `#r` tag) via an unlinkable per-cell Nostr identity, with a content-stable mesh ID for cross-transport dedup. Mesh-only peers deposit through a bridge gateway via `toBridge`/`fromBridge`. Advertised via `.bridge` (TLV 0x05 bit 1<<7) and the rendezvous cell (TLV 0x06), byte-compatible with bitchat, with loop protection, per-role rate limits, and an off-by-default Connectivity toggle. Scoped to the own geohash-6 cell; neighbor-ring coverage is a documented follow-up. | Shares one public chat across out-of-range mesh groups over the internet.                                                                                                                                                                                         |
| ~~Tor routing (iOS)~~                                           | Fixed       | Nostr WebSocket traffic routes through Arti via a native SOCKS5 module; relay pools reconnect over Tor automatically while preserving TLS validation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Protects Nostr traffic over Tor on iOS.                                                                                                                                                                                                                           |
| ~~WiFi not in `MessageRouter` priority chain~~                  | Fixed       | No change was required; `MessageRouter` already prioritizes WiFi over BLE through `MeshService`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Leaves transport priority unchanged: WiFi → BLE → Nostr → courier.                                                                                                                                                                                                |
