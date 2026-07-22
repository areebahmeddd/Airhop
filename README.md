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
  <a href="https://airhop.1mindlabs.org">Website</a>
  |
  <a href="https://github.com/areebahmeddd/Airhop/releases/latest">Download</a>
  |
  <a href="https://docs.airhop.free">Docs</a>
  |
  <a href="https://razorpay.me/@1mindlabs">Donate</a>
</p>

<p align="center">
  <a href="https://github.com/areebahmeddd/Airhop/releases"><img src="https://img.shields.io/github/v/release/areebahmeddd/Airhop?style=flat-square" alt="release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" /></a>
  <a href="https://github.com/areebahmeddd/Airhop/actions/workflows/ci.yaml"><img src="https://img.shields.io/github/actions/workflow/status/areebahmeddd/Airhop/ci.yaml?style=flat-square&label=CI" alt="CI" /></a>
  <a href="https://codecov.io/gh/areebahmeddd/Airhop"><img src="https://img.shields.io/codecov/c/github/areebahmeddd/Airhop?style=flat-square" alt="coverage" /></a>
  <a href="https://securityscorecards.dev/viewer/?uri=github.com/areebahmeddd/Airhop"><img src="https://api.securityscorecards.dev/projects/github.com/areebahmeddd/Airhop/badge?style=flat-square" alt="OpenSSF Scorecard" /></a>
</p>

<br />

Airhop is an iOS + Android app (macOS and Windows coming soon) for private, offline-first peer-to-peer communication over [Bluetooth mesh](https://en.wikipedia.org/wiki/Mesh_networking) networks, with [Nostr](https://nostr.org) internet bridging and [Cashu](https://cashu.space) [ecash](https://en.wikipedia.org/wiki/Ecash) payments. **Our mission is to make censorship-resistant communication available to anyone: during natural disasters, internet blackouts, mass protests, or any situation where networks are unavailable, surveilled, or shut down.**

Built on the foundation of [bitchat](https://bitchat.free), using the same [BLE wire protocol](docs/spec/PROTOCOLS.md), [service UUIDs](docs/spec/PROTOCOLS.md#1-ble-identifiers), and security model, meaning **Airhop-installed devices** can automatically discover and join the same mesh as nearby **Bitchat-installed devices**, relay messages, and exchange DMs with zero setup. Airhop also extends the protocol with [Double Ratchet](https://signal.org/docs/specifications/doubleratchet/) forward secrecy, [Tor](https://torproject.org) on both platforms, offline Cashu payments, and offline AI (not present in bitchat _at the time of writing_).

> [!NOTE]
> Airhop is an independent side project built and maintained by [Areeb Ahmed](https://github.com/areebahmeddd) in his free time. It is not backed by any company or organization, not affiliated with or endorsed by permissionlesstech or the bitchat project, and not an impersonation of any existing app or service.

> [!WARNING]
> **WIP.** Not externally security-reviewed. All code is personally reviewed and run through the [security review agent](.github/agents/security-review.md) before shipping, but this is not a substitute for a formal audit. Do not rely on its security for sensitive use cases. External audit planned for [v1.9.0](docs/design/ROADMAP.md#v190-security-hardening).

## Built-in Features

| Category          | Feature                   | Description                                                                             |
| ----------------- | ------------------------- | --------------------------------------------------------------------------------------- |
| 💬 **Messaging**  | Private DMs               | One-on-one end-to-end encrypted messaging                                               |
|                   | Public channels           | IRC-style group chat rooms anyone nearby can join                                       |
|                   | Voice notes               | Record and send voice messages over the local mesh (AAC, 16 kHz mono, only `.m4a`)      |
|                   | Video sharing             | Record or pick a video and send it over the mesh; plays inline on any platform          |
|                   | File transfer             | Send **any** file format and size using chunked streaming (images, documents, archives) |
|                   | Store-and-forward courier | Messages are delivered automatically when a route becomes available                     |
| 🔒 **Identity**   | No-account identity       | Identity is an Ed25519 key pair stored only on your device                              |
|                   | Human-readable names      | Deterministic usernames derived from your public key                                    |
|                   | QR contacts               | Add a contact by scanning their QR code; carries their public keys, not just an ID      |
|                   | End-to-end encryption     | Secure sessions using the Noise XX protocol                                             |
|                   | Forward secrecy           | Double Ratchet protects past messages even if keys are later compromised                |
|                   | Panic wipe                | Triple-tap instantly erases keys and local messages (nuke your account)                 |
| 🕸️ **Networking** | Bluetooth mesh            | Communicate with nearby devices without internet                                        |
|                   | Multi-hop routing         | Messages automatically relay across nearby devices (up to 7 hops)                       |
|                   | WiFi high-bandwidth mode  | Faster file transfers between two Android devices, or two iPhones. Not across platforms |
|                   | bitchat compatibility     | Airhop nodes communicate directly with bitchat on iOS and Android                       |
| 🌐 **Internet**   | Nostr bridge              | Continue conversations over Nostr relays when Bluetooth range ends                      |
|                   | Geo-relay discovery       | Discover location-based channels across 350+ distributed Nostr relays                   |
|                   | Tor integration           | Route Nostr traffic through Tor (Arti on iOS, Orbot on Android)                         |

**TL;DR: No internet required. No central servers. No accounts. No tracking.**

## Optional Features

| Category        | Feature         | Description                                                                                  |
| --------------- | --------------- | -------------------------------------------------------------------------------------------- |
| 💰 **Payments** | Cashu ecash     | Send and receive offline ecash payments over BLE                                             |
|                 | Nutzaps         | NIP-61 Lightning payments when internet is available                                         |
| 🤖 **AI**       | Local assistant | On-device inference answers questions with zero network calls, data never leaves your device |
| 🔗 **Social**   | AT Protocol     | Opt-in bridge to Bluesky, using your Airhop identity                                         |
|                 | ActivityPub     | Opt-in bridge to Mastodon, using your Airhop identity                                        |

## Stack

| Layer                   | Technology                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application Framework   | [React Native](https://reactnative.dev) 0.86, [Expo](https://expo.dev) SDK 57 (bare workflow)                                                                                                                                                                                                                                                                                                     |
| Network Transport       | [Bluetooth LE](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy) mesh (all platforms), [Nostr](https://github.com/nostr-protocol/nostr) relay bridge, plus an optional same-platform fast path: [WiFi Aware](https://wi-fi.org/discover-wi-fi/wi-fi-aware) between Android devices and [MultipeerConnectivity](https://developer.apple.com/documentation/multipeerconnectivity) between iPhones |
| Cryptographic Protocols | [Noise XX](https://noiseprotocol.org/noise.html) handshake, [Double Ratchet](https://signal.org/docs/specifications/doubleratchet/) algorithm                                                                                                                                                                                                                                                     |
| Cryptographic Library   | [`@noble/curves`](https://github.com/paulmillr/noble-curves), [`@noble/ciphers`](https://github.com/paulmillr/noble-ciphers), [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) ([Cure53](https://cure53.de) audited)                                                                                                                                                                  |
| Identity & Signatures   | [Ed25519](https://ed25519.cr.yp.to/) scheme                                                                                                                                                                                                                                                                                                                                                       |
| Network Privacy         | [Arti](https://gitlab.torproject.org/tpo/core/arti) (iOS), [Orbot](https://guardianproject.info/apps/org.torproject.android/) (Android)                                                                                                                                                                                                                                                           |
| Payment System          | [Cashu](https://cashu.space) [ecash](https://en.wikipedia.org/wiki/Ecash) (offline), [NIP-61](https://github.com/nostr-protocol/nips/blob/master/61.md) Nutzaps (online)                                                                                                                                                                                                                          |
| State Management        | [Zustand](https://github.com/pmndrs/zustand) store, [MMKV](https://github.com/mrousavy/react-native-mmkv) storage                                                                                                                                                                                                                                                                                 |
| Key Storage             | [iOS Keychain](https://developer.apple.com/documentation/security/storing-keys-in-the-keychain), [Android Keystore](https://developer.android.com/privacy-and-security/keystore)                                                                                                                                                                                                                  |

## Getting Started

```bash
git clone https://github.com/areebahmeddd/airhop
cd airhop
npm install
npx expo prebuild
```

<details>
<summary><strong>Xcode setup</strong></summary>

1. Install [Xcode](https://developer.apple.com/xcode/) from the Mac App Store, which also installs the iOS Simulator and base build tools
2. Open Xcode at least once and let it install any additional required components when prompted
3. Go to **Xcode** then **Settings** then **Locations**, and select the most recent version in the **Command Line Tools** dropdown
4. Go to **Xcode** then **Settings** then **Platforms**, click the **+** icon, and add an **iOS** runtime if one is not already installed
5. Install [CocoaPods](https://cocoapods.org) if it is not already present, then run `npx pod-install` from the project root to install the iOS native dependencies. `npx expo prebuild` already does this once, so only re-run it after changing native dependencies
6. Launch a simulator from the device dropdown in Xcode, then run `npm run ios`

> The first `npm run ios` builds the native app from scratch and can take several minutes. Later runs are much faster.

> A physical iPhone is required to test the BLE mesh, since the iOS Simulator does not support Bluetooth.

> Supports iOS 16 or later.

</details>

<details>
<summary><strong>Android Studio setup</strong></summary>

1. Install [Android Studio](https://developer.android.com/studio) from the official site, which also installs the Android SDK and base build tools
2. Open Android Studio at least once and let the setup wizard install any additional required components when prompted
3. Click the gear icon and open **Settings**, then go to **Languages & Frameworks** then **Android SDK**
4. On the **SDK Platforms** tab, tick **API 34**, **API 35**, and **API 36**, then click **Apply** to download them, since a fresh install does not include them
5. On the **SDK Tools** tab, confirm **Android SDK Build-Tools**, **Android SDK Platform-Tools**, and **Android Emulator** are installed
6. Open the virtual device manager: **More Actions** then **Virtual Device Manager** from the Welcome screen, or **View** then **Tool Windows** then **Device Manager** if a project is already open
7. Click **Create Device**, choose a **Pixel 9 Pro** profile, select one of the API levels just installed, then click **Finish**
8. Launch the emulator from the device list, then run `npm run android`

> The first `npm run android` builds the native app from scratch and can take several minutes. Later runs are much faster.

> A physical Android device is required to test the BLE mesh, since the Android Emulator does not support Bluetooth.

> Supports Android 8.0 (API 26) or later.

</details>

## Documentation

| Document                                     | Description                                                                 |
| -------------------------------------------- | --------------------------------------------------------------------------- |
| [VISION.md](docs/design/VISION.md)           | Why Airhop exists and what it will never compromise on                      |
| [ROADMAP.md](docs/design/ROADMAP.md)         | Version targets (v0.5.0 to v2.0.0), gap analysis, and competitive landscape |
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
| [lollerfirst](https://github.com/lollerfirst)   | Built the georelays toolkit that produces `assets/data/relays.csv`                         |
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
