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
  <a href="https://github.com/areebahmeddd/Airhop/releases"><img src="https://img.shields.io/github/v/release/areebahmeddd/Airhop?style=flat-square" alt="release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" /></a>
  <a href="https://github.com/areebahmeddd/Airhop/actions/workflows/ci.yaml"><img src="https://img.shields.io/github/actions/workflow/status/areebahmeddd/Airhop/ci.yaml?style=flat-square&label=CI" alt="CI" /></a>
  <a href="https://codecov.io/gh/areebahmeddd/Airhop"><img src="https://img.shields.io/codecov/c/github/areebahmeddd/Airhop?style=flat-square" alt="coverage" /></a>
  <a href="https://securityscorecards.dev/viewer/?uri=github.com/areebahmeddd/Airhop"><img src="https://api.securityscorecards.dev/projects/github.com/areebahmeddd/Airhop/badge?style=flat-square" alt="OpenSSF Scorecard" /></a>
</p>

<p align="center">
  <a href="https://apps.apple.com/app/airhop/id000000000">
    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" height="48" />
  </a>
  &nbsp;
  <a href="https://play.google.com/store/apps/details?id=com.1mindlabs.airhop">
    <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" height="48" />
  </a>
</p>

<br />

Airhop is an iOS + Android app (macOS and Windows coming soon) for private, offline-first peer-to-peer communication over [Bluetooth mesh](https://en.wikipedia.org/wiki/Mesh_networking) networks, with [Nostr](https://nostr.org) internet bridging and [Cashu](https://cashu.space) ecash payments. **Our mission is to make censorship-resistant communication available to anyone: during natural disasters, internet blackouts, mass protests, or any situation where networks are unavailable, surveilled, or shut down.**

Built on the foundation of [bitchat](https://bitchat.free), using the same [BLE wire protocol](docs/spec/PROTOCOLS.md), [service UUIDs](docs/spec/PROTOCOLS.md#1-ble-identifiers), and security model, meaning **Airhop-installed devices** can automatically discover and join the same mesh as nearby **Bitchat-installed devices**, relay messages, and exchange DMs with zero setup. Airhop also extends the protocol with [Double Ratchet](https://signal.org/docs/specifications/doubleratchet/) forward secrecy, [Tor](https://torproject.org) on both platforms, and offline Cashu payments (not present in bitchat _at the time of writing_).

> [!NOTE]
> Airhop is an independent side project built and maintained by [Areeb Ahmed](https://github.com/areebahmeddd) in his free time. It is not backed by any company or organization, not affiliated with or endorsed by permissionlesstech or the bitchat project, and not an impersonation of any existing app or service.

> [!WARNING]
> **WIP.** Not externally security-reviewed. All code is personally reviewed and run through the [security review agent](.github/agents/security-review.md) before shipping, but this is not a substitute for a formal audit. Do not rely on its security for sensitive use cases. External audit planned for [v1.9.0](docs/design/ROADMAP.md#v190-security-hardening).

## Features

| Category          | Feature                   | Description                                                                             |
| ----------------- | ------------------------- | --------------------------------------------------------------------------------------- |
| 💬 **Messaging**  | Private DMs               | One-on-one end-to-end encrypted messaging                                               |
|                   | Public channels           | IRC-style group chat rooms anyone nearby can join                                       |
|                   | Push-to-talk voice        | Live voice and voice notes over the local mesh (AAC, 16 kHz mono, only `.m4a`)          |
|                   | Video                     | 480p/15fps HEVC video over WiFi Aware or MultipeerConnectivity (only `.mp4`)            |
|                   | File transfer             | Send **any** file format and size using chunked streaming (images, documents, archives) |
|                   | Store-and-forward courier | Messages are delivered automatically when a route becomes available                     |
| 💰 **Payments**   | Cashu ecash               | Send and receive offline ecash payments over BLE                                        |
|                   | Nutzaps                   | NIP-61 Lightning payments when internet is available                                    |
| 🔒 **Identity**   | No-account identity       | Identity is an Ed25519 key pair stored only on your device                              |
|                   | Human-readable names      | Deterministic usernames derived from your public key                                    |
|                   | QR & NFC contacts         | Add contacts by scanning a QR code or tapping phones together                           |
|                   | End-to-end encryption     | Secure sessions using the Noise XX protocol                                             |
|                   | Forward secrecy           | Double Ratchet protects past messages even if keys are later compromised                |
|                   | Panic wipe                | Triple-tap instantly erases keys and local messages (nuke your account)                 |
| 🕸️ **Networking** | Bluetooth mesh            | Communicate with nearby devices without internet                                        |
|                   | Multi-hop routing         | Messages automatically relay across nearby devices (up to 7 hops)                       |
|                   | WiFi high-bandwidth mode  | Android WiFi Aware and iOS MultipeerConnectivity for fast file and video transfers      |
|                   | bitchat compatibility     | Airhop nodes communicate directly with bitchat on iOS and Android                       |
| 🌐 **Internet**   | Nostr bridge              | Continue conversations over Nostr relays when Bluetooth range ends                      |
|                   | Geo-relay discovery       | Discover location-based channels across 350+ distributed Nostr relays                   |
|                   | Tor integration           | Route Nostr traffic through Tor (Arti on iOS, Orbot on Android)                         |

**TL;DR -- No internet required. No central servers. No accounts. No tracking.**

## Stack

| Layer                   | Technology                                                                                                                                                                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Application Framework   | [React Native](https://reactnative.dev) 0.86, [Expo](https://expo.dev) SDK 57 (bare workflow)                                                                                                                                                                                                                |
| Network Transport       | [Bluetooth LE](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy) mesh, [WiFi Aware](https://wi-fi.org/discover-wi-fi/wi-fi-aware) (Android), [MultipeerConnectivity](https://developer.apple.com/documentation/multipeerconnectivity) (iOS), [Nostr](https://github.com/nostr-protocol/nostr) relay bridge |
| Cryptographic Protocols | [Noise XX](https://noiseprotocol.org/noise.html) handshake, [Double Ratchet](https://signal.org/docs/specifications/doubleratchet/) algorithm                                                                                                                                                                |
| Cryptographic Library   | [`@noble/curves`](https://github.com/paulmillr/noble-curves), [`@noble/ciphers`](https://github.com/paulmillr/noble-ciphers), [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) ([Cure53](https://cure53.de) audited)                                                                             |
| Identity & Signatures   | [Ed25519](https://ed25519.cr.yp.to/) scheme                                                                                                                                                                                                                                                                  |
| Network Privacy         | [Arti](https://gitlab.torproject.org/tpo/core/arti) (iOS), [Orbot](https://guardianproject.info/apps/org.torproject.android/) (Android)                                                                                                                                                                      |
| Payment System          | [Cashu](https://cashu.space) ecash (offline), [NIP-61](https://github.com/nostr-protocol/nips/blob/master/61.md) Nutzaps (online)                                                                                                                                                                            |
| State Management        | [Zustand](https://github.com/pmndrs/zustand) store, [MMKV](https://github.com/mrousavy/react-native-mmkv) storage                                                                                                                                                                                            |
| Key Storage             | [iOS Keychain](https://developer.apple.com/documentation/security/storing-keys-in-the-keychain), [Android Keystore](https://developer.android.com/privacy-and-security/keystore)                                                                                                                             |

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

| Document                                     | Description                                                                 |
| -------------------------------------------- | --------------------------------------------------------------------------- |
| [VISION.md](docs/design/VISION.md)           | Why Airhop exists and what it will never compromise on                      |
| [ROADMAP.md](docs/design/ROADMAP.md)         | Version targets (v0.5.0 to v3.0.0), gap analysis, and competitive landscape |
| [ARCHITECTURE.md](docs/spec/ARCHITECTURE.md) | System architecture, design decisions, and stack rationale                  |
| [PROTOCOLS.md](docs/spec/PROTOCOLS.md)       | Wire format, BLE UUIDs, and protocol specifications                         |
| [REFERENCE.md](docs/dev/REFERENCE.md)        | Bitchat codebase deep dive and implementation reference                     |
| [PROGRESS.md](docs/dev/PROGRESS.md)          | Current build state and development milestones                              |
| [GLOSSARY.md](docs/dev/GLOSSARY.md)          | Definitions of technical terms used throughout the documentation            |
| [CONTRIBUTING.md](CONTRIBUTING.md)           | Development workflow, coding standards, and pull request guidelines         |
| [SECURITY.md](SECURITY.md)                   | Security policy and vulnerability reporting                                 |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)     | Community standards and expectations                                        |

## Acknowledgements

Airhop would not exist without the work of the bitchat community. Thank you to everyone who built the foundation this project stands on. Their work is released into the public domain under the [Unlicense](https://github.com/permissionlesstech/bitchat/blob/main/LICENSE).

| Person                                          | Contribution                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [jackjackbits](https://github.com/jackjackbits) | Created bitchat iOS, designed the BLE mesh protocol and wire format that Airhop implements |
| [callebtc](https://github.com/callebtc)         | Lead on bitchat-android, author of the Cashu ecash protocol                                |
| [qalandarov](https://github.com/qalandarov)     | Major contributor to bitchat iOS                                                           |
| [lollerfirst](https://github.com/lollerfirst)   | Built the georelays toolkit powering `assets/data/relays.csv`                              |
| [Nadim Kobeissi](https://github.com/mimoo)      | Noise Protocol implementation in bitchat iOS                                               |

## Support

Help keep the project going by making a voluntary donation through our app or website, or simply give this repository a star.

<a href="https://www.star-history.com/?repos=areebahmeddd%2FAirhop&type=date&logscale=&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=areebahmeddd/Airhop&type=date&theme=dark&logscale&legend=top-left&sealed_token=-WkVGqvQDeQazbrkJu_cQRz5cPPAO6r0amRCkxBz9TDWfy-pvo-a8Iwuc-JqmwgWoWIBOfDJcjvCf8BEJyd0vbq4heI9MeZJiAnMahoWYaYeFSVS7g5StAqbZFATBHow8IpRrAoT2L41KWJqTUKqlA2x0Ksf3PuBSpr5X_REc7lIyWLGqNv_8BG7wv44" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=areebahmeddd/Airhop&type=date&logscale&legend=top-left&sealed_token=-WkVGqvQDeQazbrkJu_cQRz5cPPAO6r0amRCkxBz9TDWfy-pvo-a8Iwuc-JqmwgWoWIBOfDJcjvCf8BEJyd0vbq4heI9MeZJiAnMahoWYaYeFSVS7g5StAqbZFATBHow8IpRrAoT2L41KWJqTUKqlA2x0Ksf3PuBSpr5X_REc7lIyWLGqNv_8BG7wv44" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=areebahmeddd/Airhop&type=date&logscale&legend=top-left&sealed_token=-WkVGqvQDeQazbrkJu_cQRz5cPPAO6r0amRCkxBz9TDWfy-pvo-a8Iwuc-JqmwgWoWIBOfDJcjvCf8BEJyd0vbq4heI9MeZJiAnMahoWYaYeFSVS7g5StAqbZFATBHow8IpRrAoT2L41KWJqTUKqlA2x0Ksf3PuBSpr5X_REc7lIyWLGqNv_8BG7wv44" />
 </picture>
</a>
