# Changelog

All notable changes are documented here.

## [0.9.0] - 2026-07-17


### Refactoring

- Naming conventions, known gap fixes, docs, and agent skills (v0.9)


## [0.8.0] - 2026-07-17


### Features

- **crypto:** Implement Signal Double Ratchet (double-ratchet.ts)

- **crypto:** Implement X3DH prekey agreement (x3dh.ts)

- **android:** Add WiFi Aware high-bandwidth transport (AirhopWiFiModule)

- **ios:** Add MultipeerConnectivity high-bandwidth transport (AirhopMCModule)

- **bridge:** Add NativeAirhopWiFi TurboModule spec

- **mesh:** Add chunked streaming file transfer (file-transfer.ts)

- **mesh:** Add VIDEO_FRAME capture and jitter-buffer player (video-capture/player.ts)


## [0.7.0] - 2026-07-17


### Features

- **nostr:** Add Nostr client with SimplePool, auto-reconnect, and Tor proxy config

- **nostr:** Add NIP-17/59 gift-wrap DMs

- **nostr:** Add geo-relay selection from bundled relays.csv

- **nostr:** Add kind-20001 geohash presence heartbeats

- **nostr:** Add courier relay for offline store-and-forward (kind 1401)

- **payments:** Add Cashu token parsing, embed, and DLEQ validation

- **payments:** Add NIP-61 nutzap and MMKV-backed wallet store

- **mesh:** Add PTT voice capture and jitter-buffered playback

- **router:** Add Nostr as priority-2 transport (BLE > Nostr > Courier)

- **bridge:** Add TurboModule spec for Tor module; update BLE spec

- **ios:** Add Arti Tor integration with bundled xcframework

- **android:** Add Orbot SOCKS5 proxy detection via TCP probe


## [0.6.0] - 2026-07-17


### Bug Fixes

- **mesh:** Align packet types with bitchat MessageType.swift


### Features

- **crypto:** Noise XX handshake+transport and Noise X one-way sealing

- **mesh:** BLE packet fragmentation and reassembly

- **mesh:** GCS gossip reconciliation, wire-compatible with bitchat

- **mesh:** Courier store-and-forward with TLV envelope, bitchat-compatible

- **router:** Message routing — broadcast, unicast, courier fallback

- **store:** Zustand + MMKV chat state and in-memory peer registry

- **ui:** Channel list, message thread, and peer list screens


## [0.5.0] - 2026-07-17


### Features

- **core/crypto:** Identity generation, peer ID derivation, Keychain storage

- **core/mesh:** Bitchat v2 packet codec with flags preservation and Ed25519 signing

- **core/mesh:** Deduplicator (LRU nonce cache) and TTL flood router with jitter

- **core/mesh:** Signed ANNOUNCE broadcast manager with TLV payload and peer validation

- **bridge:** TurboModule spec for AirhopBLE native module

- **ios:** AirhopBLEModule Swift dual-role GATT central+peripheral with RSSI polling

- **android:** AirhopBLEModule Kotlin dual-role GATT, AirhopForegroundService, package registration


### Tests

- **core/mesh:** Unit tests for packet-codec, deduplicator and flood-router


