# Airhop: Build Plan

> **This is the "what and when" document.** For _why_ we're building this, see [`docs/design/VISION.md`](VISION.md). For _how_ things are architected, see [`docs/spec/ARCHITECTURE.md`](../spec/ARCHITECTURE.md). For exact protocol constants, see [`docs/spec/PROTOCOLS.md`](../spec/PROTOCOLS.md).

## 1. Where Airhop Fits: Gap Analysis vs bitchat

bitchat is an excellent foundation. Airhop fills the gaps it left open.

### Gap 1: Unified Codebase

**bitchat problem:** iOS and Android are separate native codebases that drift. The Android v0.7 fragment size mismatch (500B vs 150B) broke iOS-Android compatibility for months with no one noticing.  
**Airhop:** Single TypeScript protocol stack. A protocol bug surfaces on both platforms simultaneously, and fixes apply simultaneously.

### Gap 2: Video Support

**bitchat problem:** No video packet type, no mechanism, no MIME type for video.  
**Airhop (Phase 3):** `0x30: videoFrame` packet type over WiFi Aware. 480p/15fps is the BLE ceiling (~80 KB/s). Real video requires WiFi Direct or MultipeerConnectivity.

### Gap 3: Live PTT Voice (from day 1)

**bitchat problem:** Fully designed (`PUSH-TO-TALK-DESIGN.md`) but never shipped.  
**Airhop (Phase 2):** `0x29: voiceFrame` broadcast type, AAC 16 kHz mono, 350ms jitter buffer, fallback to voice note.

### Gap 4: Larger File Transfers

**bitchat problem:** Hard 1 MiB cap in `FileTransferLimits`.  
**Airhop:** Chunked streaming transfer. 64 KB chunks, sequence tracking, partial delivery. No hard protocol cap.

### Gap 5: Tor on Android

**bitchat problem:** iOS-only via Arti xcframework. Android has no Tor integration.  
**Airhop:** Orbot (SOCKS5 on localhost:9050) detection for short-term. Long-term: embedded `tor` binary in APK.

### Gap 6: Double Ratchet for Offline Mail

**bitchat problem:** Courier envelopes use Noise X (one-way). Compromise of recipient's static key exposes all undelivered mail.  
**Airhop (Phase 3):** Full Signal Double Ratchet (DR) + X3DH initialization. Prekey bundles on Nostr. Per-message forward secrecy everywhere.

### Gap 7: WiFi Direct / WiFi Aware Transport

**bitchat problem:** BLE-only (~15 KB/s). Android WiFi Aware support exists but is experimental/unshipped.  
**Airhop (Phase 3):** Android WiFi Aware + iOS MultipeerConnectivity. Automatic transport selection: WiFi when available, BLE fallback. Enables video, large files, high-quality voice.

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
│  │  GossipSync (GCS filter)    │     │  SimplePool → 290+ relays      │     │
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

## 3. Build Phases

### Phase 0: Foundation (Weeks 1-3)

**Goal:** Hello World BLE mesh between two phones.

- [ ] Set up Expo bare workflow with TypeScript strict
- [ ] `AirhopBLEModule` iOS (Swift, ~400 lines): dual-role GATT server + client
- [ ] `AirhopBLEModule` Android (Kotlin, ~500 lines): dual-role GATT
- [ ] `AirhopForegroundService.kt`: background keepalive
- [ ] Wire TurboModule to `src/bridge/NativeAirhopBLE.ts`
- [ ] `src/core/mesh/packet-codec.ts`: binary encode/decode matching bitchat v2 (`PROTOCOLS.md`, section 2)
- [ ] `src/core/mesh/flood-router.ts`: TTL flood, jitter 10-220ms, dedup
- [ ] `src/core/mesh/announce-manager.ts`: signed presence broadcasts

**Milestone:** Two phones discover each other and exchange signed ANNOUNCE packets.

### Phase 1: Core Messaging (Weeks 4-8)

**Goal:** Full offline BLE mesh chat, bitchat wire-compatible.

- [ ] `src/core/crypto/noise-xx.ts`: Noise XX handshake using `@noble`
- [ ] `src/core/crypto/identity.ts`: key generation, Keychain storage, peer ID
- [ ] `src/core/mesh/fragment-manager.ts`: fragmentation / reassembly (469B chunks)
- [ ] `src/core/mesh/gossip-sync.ts`: GCS filter reconciliation (15s interval)
- [ ] `src/core/mesh/courier-store.ts`: sealed envelopes, trust tiers
- [ ] `src/core/router/message-router.ts`: BLE-only routing
- [ ] Basic React Native UI: channel list, message thread, peer list

**Milestone:** Full offline BLE mesh chat. Airhop ↔ bitchat message delivery verified.

### Phase 2: Internet Bridge + Voice + Payments (Weeks 9-14)

**Goal:** Nostr fallback, live PTT voice, Cashu ecash.

- [ ] `src/core/nostr/client.ts`: SimplePool, auto-reconnect
- [ ] `src/core/nostr/gift-wrap.ts`: NIP-17/59 gift-wrap DMs
- [ ] `src/core/nostr/geo-relay.ts`: Haversine nearest relay from bundled CSV
- [ ] `src/core/nostr/presence.ts`: kind 20001 geohash heartbeats
- [ ] `CourierStore.ts`: Nostr bridge courier drops (kind 1401)
- [ ] iOS: Arti Tor integration (copy from `bitchat-ios/`)
- [ ] Android: Orbot SOCKS5 proxy detection
- [ ] `src/core/payments/cashu.ts`: token parse/embed/redeem
- [ ] `src/core/payments/nutzap.ts`: NIP-61 online zaps
- [ ] `VoiceCapture.ts` + `VoicePlayer.ts`: PTT AAC 16 kHz, jitter buffer

**Milestone:** Cross-city DMs via Nostr. Live voice PTT over BLE. Cashu offline payment working.

### Phase 3: WiFi Transport + Double Ratchet + Video (Weeks 15-22)

**Goal:** High-bandwidth transport and per-message forward secrecy.

- [ ] `src/core/crypto/double-ratchet.ts`: Signal DR per-message forward secrecy
- [ ] `src/core/crypto/x3dh.ts`: X3DH prekey agreement; bundles published to Nostr
- [ ] WiFi Aware native module (Android) + MultipeerConnectivity (iOS)
- [ ] Chunked file transfer >1 MiB (streaming reassembly)
- [ ] Video frame capture (react-native-vision-camera v4, HEVC)
- [ ] `0x30: videoFrame` packet type (WiFi Direct only)

**Milestone:** Offline video calling over WiFi Aware. Double Ratchet passing test vectors.

### Phase 4: Polish & Publish (Weeks 23-28)

**Goal:** Production-ready for App Store and Play Store.

- [ ] NFC contact exchange (`react-native-nfc-manager`)
- [ ] QR code scanner for peer verification
- [ ] Human-readable usernames (deterministic from pubkey)
- [ ] Panic wipe (triple-tap logo; all keys and data destroyed in <1s)
- [ ] Battery optimization flow (Android OEM whitelist request)
- [ ] App Store / Play Store submission
- [ ] Georelays in-app relay map

**Milestone:** Submitted to app stores.

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
**Mitigation:** Use bitchat-ios as ground truth reference. Mandatory: cross-language test (JS client ↔ bitchat-ios Swift server). Official noiseprotocol.org test vectors. Do not ship Phase 1 until this passes.

### Risk 5: GCS Filter Compatibility

**Probability:** Low. A single off-by-one breaks gossip sync silently.  
**Impact:** Gossip sync stops working; mesh reachability degrades.  
**Mitigation:** Extract bitchat's GCS test vectors. Verify JS output against Swift output for 10,000 inputs.

### Risk 6: Expo Managed vs Bare Decision

**Probability:** None. Already decided.  
**Resolution:** **Bare workflow from day 1.** BLE TurboModule required from day 1 makes managed workflow impossible.

## 5. What to Reuse from bitchat

Everything under the Unlicense. Copy verbatim, no attribution required.

### From bitchat-ios (Swift → TypeScript translation reference)

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

### From bitchat-android (Kotlin → TypeScript/Kotlin)

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
| `double-ratchet.ts`          | No production-grade RN library (Phase 3)                       | ~600                    |
| `x3dh.ts`                    | Same                                                           | ~300                    |
| `gcs-filter.ts`              | No JS implementation with bitchat compat                       | ~150                    |
| `packet-codec.ts`            | Custom binary format                                           | ~300                    |
| **Total**                    |                                                                | ~3,050 TS + ~900 native |

Everything else is a TypeScript port of existing bitchat code or an existing npm package.

## 7. Competitive Landscape

| Project        | Transport                | Crypto        | Offline | Platform                   |
| -------------- | ------------------------ | ------------- | ------- | -------------------------- |
| **bitchat**    | BLE + Nostr              | Noise XX      | Yes     | Native iOS + Android       |
| **Meshtastic** | LoRa                     | AES-256       | Yes     | Requires hardware          |
| **Briar**      | BLE + WiFi + Tor         | Signal        | Yes     | Android-only               |
| **Session**    | Onion routing            | Signal        | Partial | iOS + Android, no BLE      |
| **Bridgefy**   | BLE + WiFi               | Proprietary   | Yes     | Closed source              |
| **GoTenna**    | Proprietary radio        | Proprietary   | Yes     | Requires hardware          |
| **Airhop**     | BLE + WiFi Aware + Nostr | Noise XX + DR | Yes     | React Native iOS + Android |

**The unique position:** Open source, React Native cross-platform (write once), wire-compatible with bitchat's existing mesh, forward secret everywhere, live voice on day one.  
**The gap no one has filled:** A phone-native BLE mesh app in React Native. The peripheral GATT gap blocked everyone. Now you know the solution.
