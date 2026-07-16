<div align="center">

```text
           ░██         ░██                              
                       ░██                              
 ░██████   ░██░██░████ ░████████   ░███████  ░████████  
      ░██  ░██░███     ░██    ░██ ░██    ░██ ░██    ░██ 
 ░███████  ░██░██      ░██    ░██ ░██    ░██ ░██    ░██ 
░██   ░██  ░██░██      ░██    ░██ ░██    ░██ ░███   ░██ 
 ░█████░██ ░██░██      ░██    ░██  ░███████  ░██░█████  
                                             ░██        
                                             ░██        
```

</div>

<p align="center">
  <a href="https://github.com/areebahmeddd/airhop/releases"><img src="https://img.shields.io/github/v/release/areebahmeddd/airhop?style=flat-square" alt="release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" /></a>
  <a href="https://github.com/areebahmeddd/airhop/actions/workflows/ci.yaml"><img src="https://img.shields.io/github/actions/workflow/status/areebahmeddd/airhop/ci.yaml?style=flat-square&label=CI" alt="CI" /></a>
  <a href="https://codecov.io/gh/areebahmeddd/airhop"><img src="https://img.shields.io/codecov/c/github/areebahmeddd/airhop?style=flat-square" alt="coverage" /></a>
  <a href="https://securityscorecards.dev/viewer/?uri=github.com/areebahmeddd/airhop"><img src="https://api.securityscorecards.dev/projects/github.com/areebahmeddd/airhop/badge?style=flat-square" alt="OpenSSF Scorecard" /></a>
</p>

<br />

Airhop is an iOS + Android app (macOS and Windows coming soon) for private, offline-first peer-to-peer communication over [Bluetooth mesh](https://en.wikipedia.org/wiki/Mesh_networking) networks, with [Nostr](https://nostr.com) internet bridging and [Cashu](https://cashu.space) ecash payments. **Our goal is to make censorship-resistant communication available to anyone: during natural disasters, internet blackouts, mass protests, or any situation where networks are unavailable, surveilled, or shut down.**

Built on the foundation of [bitchat](https://bitchat.free), sharing the same [BLE wire protocol](docs/spec/PROTOCOLS.md), [service UUIDs](docs/spec/PROTOCOLS.md#1-ble-identifiers), and security model (extending it with [Double Ratchet](https://signal.org/docs/specifications/doubleratchet/) forward secrecy, [Tor](https://torproject.org) on both platforms, and offline Cashu payments over the mesh).

> [!NOTE]
> Airhop is an independent side project built and maintained by [Areeb Ahmed](https://github.com/areebahmeddd) in his free time. It is not backed by any company or organization, not affiliated with or endorsed by permissionlesstech or the bitchat project, and not an impersonation of any existing app or service.

## Features

| Category                  | Feature                   | Description                                                                        |
| ------------------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| 💬 **Messaging**          | Private DMs               | One-on-one end-to-end encrypted messaging                                          |
|                           | Public channels           | IRC-style group chat rooms anyone nearby can join                                  |
|                           | Push-to-talk voice        | Live voice conversations over the local mesh                                       |
|                           | Video                     | 480p/15fps video over WiFi Aware or MultipeerConnectivity                          |
|                           | File transfer             | Send files of any size with chunked streaming                                      |
|                           | Store-and-forward courier | Messages are delivered automatically when a route becomes available                |
| 💰 **Payments**           | Cashu ecash               | Send and receive offline ecash payments over BLE                                   |
|                           | Nutzaps                   | NIP-61 Lightning payments when internet is available                               |
| 🔒 **Identity & Privacy** | No-account identity       | Identity is an Ed25519 key pair stored only on your device                         |
|                           | Human-readable names      | Deterministic usernames derived from your public key                               |
|                           | QR & NFC contacts         | Add contacts by scanning a QR code or tapping phones together                      |
|                           | End-to-end encryption     | Secure sessions using the Noise XX protocol                                        |
|                           | Forward secrecy           | Double Ratchet protects past messages even if keys are later compromised           |
|                           | Panic wipe                | Triple-tap instantly erases keys and local messages (nuke your account)            |
| 🕸️ **Connectivity**       | Bluetooth mesh            | Communicate with nearby devices without internet                                   |
|                           | Multi-hop routing         | Messages automatically relay across nearby devices (up to 7 hops)                  |
|                           | WiFi high-bandwidth mode  | Android WiFi Aware and iOS MultipeerConnectivity for fast file and video transfers |
|                           | bitchat compatibility     | Airhop nodes communicate directly with bitchat on iOS and Android                  |
| 🌐 **Internet Bridge**    | Nostr bridge              | Continue conversations over Nostr relays when Bluetooth range ends                 |
|                           | Geo-relay discovery       | Discover location-based channels across 350+ distributed Nostr relays              |
|                           | Tor integration           | Route Nostr traffic through Tor (Arti on iOS, Orbot on Android)                    |

**TL;DR -- No internet required. No central servers. No accounts. No tracking.**

## Stack

| Layer       | Technology                                                                                                                                                                                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime     | [React Native](https://reactnative.dev) 0.86, [Expo](https://expo.dev) SDK 57 (bare workflow)                                                                                                                                                                     |
| Crypto      | [`@noble/curves`](https://github.com/paulmillr/noble-curves), [`@noble/ciphers`](https://github.com/paulmillr/noble-ciphers), [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) ([Cure53](https://cure53.de) audited)                                  |
| Transport   | [Bluetooth LE](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy) mesh, [WiFi Aware](https://wi-fi.org/discover-wi-fi/wi-fi-aware) (Android), [MultipeerConnectivity](https://developer.apple.com/documentation/multipeerconnectivity) (iOS), Nostr relay bridge |
| Encryption  | [Noise XX](https://noiseprotocol.org/noise.html) handshake, [Double Ratchet](https://signal.org/docs/specifications/doubleratchet/), [Ed25519](https://ed25519.cr.yp.to/) signing                                                                                 |
| Privacy     | [Arti](https://gitlab.torproject.org/tpo/core/arti) on iOS, [Orbot](https://guardianproject.info/apps/org.torproject.android/) on Android                                                                                                                         |
| Payments    | [Cashu](https://cashu.space) ecash (offline), [NIP-61](https://github.com/nostr-protocol/nips/blob/master/61.md) Nutzaps (online)                                                                                                                                 |
| State       | [Zustand](https://github.com/pmndrs/zustand) + [MMKV](https://github.com/mrousavy/react-native-mmkv)                                                                                                                                                              |
| Key Storage | iOS Keychain / Android Keystore                                                                                                                                                                                                                                   |

## Getting Started

```bash
git clone https://github.com/areebahmeddd/airhop
cd airhop
npm install
npx expo prebuild
```

**iOS**

```bash
npx react-native run-ios
```

**Android**

```bash
npx react-native run-android
```

> Requires Xcode 16+ (iOS) and Android Studio with API 26+ SDK (Android)

## Documentation

| Document                                     | Description                                                      |
| -------------------------------------------- | ---------------------------------------------------------------- |
| [VISION.md](docs/design/VISION.md)           | Why Airhop exists and what it will never compromise on           |
| [ROADMAP.md](docs/design/ROADMAP.md)         | Version targets (v0.5.0 to v3.0.0), milestones, and gap analysis |
| [PROTOCOLS.md](docs/spec/PROTOCOLS.md)       | Wire format, BLE UUIDs, and all protocol constants               |
| [ARCHITECTURE.md](docs/spec/ARCHITECTURE.md) | Architecture decisions and stack rationale                       |
| [PROGRESS.md](docs/dev/PROGRESS.md)          | Current build state and phase checklists                         |
| [CONTRIBUTING.md](CONTRIBUTING.md)           | Coding standards, crypto rules, and PR checklist                 |
| [REFERENCE.md](docs/dev/REFERENCE.md)        | bitchat codebase deep-dive and knowledge transfer                |
| [GLOSSARY.md](docs/dev/GLOSSARY.md)          | Definitions for all technical terms used across the docs         |
| [SECURITY.md](SECURITY.md)                   | How to report a vulnerability                                    |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)     | Community standards and expectations                             |

## Acknowledgements

Airhop would not exist without the work of the bitchat community. Thank you to everyone who built the foundation this project stands on. Their work is released into the public domain under the [Unlicense](https://github.com/permissionlesstech/bitchat/blob/main/LICENSE).

| Person                                          | Contribution                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [jackjackbits](https://github.com/jackjackbits) | Created bitchat iOS, designed the BLE mesh protocol and wire format that Airhop implements |
| [callebtc](https://github.com/callebtc)         | Lead on bitchat-android, author of the Cashu ecash protocol                                |
| [qalandarov](https://github.com/qalandarov)     | Major contributor to bitchat iOS                                                           |
| [lollerfirst](https://github.com/lollerfirst)   | Built the georelays toolkit powering `assets/data/relays.csv`                              |
| [Nadim Kobeissi](https://github.com/mimoo)      | Noise Protocol implementation in bitchat iOS                                               |
