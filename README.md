<div align="center">

```text
        _      _
   __ _(_)_ __| |__   ___  _ __
  / _` | | '__| '_ \ / _ \| '_ \
 | (_| | | |  | | | | (_) | |_) |
  \__,_|_|_|  |_| |_|\___/| .__/
                          |_|
```

</div>

<p align="center">
  <a href="https://github.com/areebahmeddd/airhop/releases"><img src="https://img.shields.io/github/v/release/areebahmeddd/airhop?style=flat-square" alt="release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" /></a>
</p>

<br />

Airhop is an iOS + Android app for private, offline-first peer-to-peer communication over Bluetooth mesh networks, with Nostr internet bridging and Cashu ecash payments.

Built on the foundation of [bitchat](https://github.com/permissionlesstech/bitchat), sharing the same BLE wire protocol, service UUIDs, and security model. Airhop is a single TypeScript codebase that ships identical features on both platforms from one source of truth, extended with Double Ratchet forward secrecy, offline Cashu payments over the mesh, and live push-to-talk voice.

## Stack

| Layer       | Technology                                                          |
| ----------- | ------------------------------------------------------------------- |
| Runtime     | React Native 0.86, Expo SDK 57 (bare workflow)                      |
| Crypto      | `@noble/curves`, `@noble/ciphers`, `@noble/hashes` (Cure53 audited) |
| Transport   | Bluetooth LE mesh + Nostr relay bridge                              |
| Encryption  | Noise XX handshake, Double Ratchet                                  |
| Payments    | Cashu ecash (offline), NIP-61 Nutzaps (online)                      |
| State       | Zustand + MMKV                                                      |
| Key Storage | iOS Keychain / Android Keystore                                     |

## Getting Started

```bash
git clone https://github.com/areebahmeddd/airhop
cd airhop
npm install
npx expo prebuild
```

**Android**

```bash
npx react-native run-android
```

**iOS**

```bash
npx react-native run-ios
```

> Requires Android Studio with API 26+ SDK (Android) and Xcode 16+ (iOS)

## Documentation

- [docs/design/VISION.md](docs/design/VISION.md): why and what we will never compromise on
- [docs/spec/PROTOCOLS.md](docs/spec/PROTOCOLS.md): wire format, BLE UUIDs, all protocol constants
- [docs/spec/ARCHITECTURE.md](docs/spec/ARCHITECTURE.md): architecture and stack decisions
- [docs/dev/PROGRESS.md](docs/dev/PROGRESS.md): current build state and phase checklists
- [docs/dev/REFERENCE.md](docs/dev/REFERENCE.md): bitchat codebase deep-dive and knowledge transfer
