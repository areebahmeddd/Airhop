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

Built on the foundation of [bitchat](https://bitchat.free), using the same [BLE wire protocol](docs/spec/PROTOCOLS.md), [service UUIDs](docs/spec/PROTOCOLS.md#1-ble-identifiers), and security model, meaning **Airhop-installed devices** can automatically discover and join the same mesh as nearby **Bitchat-installed devices**, relay messages, and exchange DMs with zero setup. Airhop also extends the protocol with [Double Ratchet](https://signal.org/docs/specifications/doubleratchet) forward secrecy, [Tor](https://torproject.org) on both platforms, offline Cashu payments, and offline AI (not present in bitchat _at the time of writing_).

> [!NOTE]
> Airhop is an independent side project built and maintained by [Areeb Ahmed](https://github.com/areebahmeddd) in his free time. It is not backed by any company or organization, not affiliated with or endorsed by permissionlesstech or the bitchat project, and not an impersonation of any existing app or service.

> [!WARNING]
> **WIP.** Not externally security-reviewed. All code is personally reviewed and run through the [security review agent](.github/agents/security-review.md) before shipping, but this is not a substitute for a formal audit. Do not rely on its security for sensitive use cases. External audit planned for [v1.9.0](docs/design/ROADMAP.md#v190-security-hardening).

## Built-in Features

| Category          | Feature                   | Description                                                                                                                                           |
| ----------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 💬 **Messaging**  | Private DMs               | One-on-one end-to-end encrypted messaging                                                                                                             |
|                   | Public channels           | IRC-style group chat rooms anyone nearby can join                                                                                                     |
|                   | Private channels          | Invite-only encrypted rooms. A shared key travels in the invite link, so anyone with the link joins and reads; there is no member cap                 |
|                   | Private groups            | Fixed-roster encrypted group chats. The creator signs the member list (up to 16) and shares the key over Noise; only listed members can read          |
|                   | Bulletin board            | Signed notices that outlive chat: pin a post to your mesh or location for 1 to 7 days, with urgent flags. Late arrivals catch up automatically        |
|                   | Voice notes               | Record and send voice messages over the local mesh (AAC, 16 kHz mono, only `.m4a`)                                                                    |
|                   | Video sharing             | Record or pick a video and send it over the mesh (H.264 or HEVC in `.mp4` / `.mov`)                                                                   |
|                   | File transfer             | Send **any** file format using chunked streaming (images, documents, archives), up to 50 MB per file                                                  |
|                   | Store-and-forward courier | Messages are delivered automatically when a route becomes available, sealed to a one-time prekey for forward secrecy                                  |
| 🔒 **Identity**   | No-account identity       | Identity is an Ed25519 key pair stored only on your device                                                                                            |
|                   | Human-readable names      | Deterministic usernames derived from your public key                                                                                                  |
|                   | QR contacts               | Add a contact by scanning their QR code; carries their public keys, not just an ID                                                                    |
|                   | End-to-end encryption     | Secure sessions using the Noise XX protocol                                                                                                           |
|                   | Forward secrecy           | Double Ratchet protects past messages even if keys are later compromised                                                                              |
|                   | Panic wipe                | Triple-tap instantly erases keys and local messages (nuke your account)                                                                               |
| 🕸️ **Networking** | Bluetooth mesh            | Communicate with nearby devices without internet                                                                                                      |
|                   | Multi-hop routing         | Messages automatically relay across nearby devices (up to 7 hops)                                                                                     |
|                   | WiFi high-bandwidth mode  | Faster file transfers between two Android devices, or two iPhones. Not across platforms                                                               |
|                   | bitchat compatibility     | Airhop nodes communicate directly with bitchat on iOS and Android                                                                                     |
| 🌐 **Internet**   | Nostr bridge              | Continue conversations over Nostr relays when Bluetooth range ends                                                                                    |
|                   | Geo-relay discovery       | Discover location-based channels across 350+ distributed Nostr relays                                                                                 |
|                   | Internet gateway          | Let a nearby offline phone reach a location channel: when enabled, your device forwards its Bluetooth traffic to Nostr on its behalf. Off by default. |
|                   | Tor integration           | Route Nostr traffic through Tor (Arti on iOS, Orbot on Android)                                                                                       |

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
| Cryptographic Protocols | [Noise XX](https://noiseprotocol.org/noise.html) handshake, [Double Ratchet](https://signal.org/docs/specifications/doubleratchet) algorithm                                                                                                                                                                                                                                                      |
| Cryptographic Library   | [`@noble/curves`](https://github.com/paulmillr/noble-curves), [`@noble/ciphers`](https://github.com/paulmillr/noble-ciphers), [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) ([Cure53](https://cure53.de) audited)                                                                                                                                                                  |
| Identity & Signatures   | [Ed25519](https://ed25519.cr.yp.to) scheme                                                                                                                                                                                                                                                                                                                                                        |
| Network Privacy         | [Arti](https://gitlab.torproject.org/tpo/core/arti) (iOS), [Orbot](https://guardianproject.info/apps/org.torproject.android) (Android)                                                                                                                                                                                                                                                            |
| Payment System          | [Cashu](https://cashu.space) [ecash](https://en.wikipedia.org/wiki/Ecash) (offline), [NIP-61](https://github.com/nostr-protocol/nips/blob/master/61.md) Nutzaps (online)                                                                                                                                                                                                                          |
| State Management        | [Zustand](https://github.com/pmndrs/zustand) store, [MMKV](https://github.com/mrousavy/react-native-mmkv) storage                                                                                                                                                                                                                                                                                 |
| Key Storage             | [iOS Keychain](https://developer.apple.com/documentation/security/storing-keys-in-the-keychain), [Android Keystore](https://developer.android.com/privacy-and-security/keystore)                                                                                                                                                                                                                  |

## Transports

Airhop chooses a transport per message. Bluetooth is the only one that needs no internet and the only one that works across iOS and Android. WiFi and Nostr are used when they are available.

|                         | Bluetooth LE mesh                                                  | WiFi (same platform)                     | Nostr relays                     |
| ----------------------- | ------------------------------------------------------------------ | ---------------------------------------- | -------------------------------- |
| Carries                 | Channel messages, DMs, files, ecash                                | DMs and files, when a link exists        | DMs and geohash channel messages |
| Needs internet          | No                                                                 | No                                       | Yes                              |
| Works iPhone to Android | Yes                                                                | No                                       | Yes                              |
| Range                   | ~10-30 m indoors, up to ~100 m line of sight, extended by relaying | ~30 m                                    | Global                           |
| Max hops                | 7                                                                  | 1                                        | 1                                |
| Speed                   | ~22 KB/s                                                           | ~22 KB/s (shared with Bluetooth for now) | Not used for files               |
| Latency per hop         | 10-220 ms (randomised to avoid collisions)                         | n/a                                      | Relay round trip; more over Tor  |

Notes on the numbers:

- Text messages (channel and DM) are tiny and effectively instant on any transport. Throughput only matters for files.
- The **~22 KB/s** figure is 456 bytes per fragment sent one every 20 ms. The delay is required: without it the radio drops fragments and the transfer never completes.
- WiFi currently shares that same paced queue, so it runs at the same speed as Bluetooth for now. _Lifting the cap on the WiFi path is planned_.
- A 1 MB file (the per-file cap) takes about 45 seconds over Bluetooth. Attachments are capped at 1 MB for bitchat compatibility and to keep transfers short. _Increasing the cap is planned_.
- Android WiFi Aware and iOS MultipeerConnectivity are different protocols and cannot connect to each other, so the WiFi path only works Android to Android or iPhone to iPhone.
- Nostr relays carry small signed events, not file bytes. Files can be shared over Nostr only by uploading them to a separate HTTP host and posting a link ([NIP-96](https://github.com/nostr-protocol/nips/blob/master/96.md)). Airhop does not do this: that host is a central server that can log, throttle, or take down your files, which is exactly what this app avoids. Attachments therefore travel only over Bluetooth or WiFi.

Timing intervals:

| Behaviour                  | Interval            | Why                                                                 |
| -------------------------- | ------------------- | ------------------------------------------------------------------- |
| Presence broadcast         | 30 s                | How peers discover each other and refresh reachability              |
| Gossip sync                | 15 s                | Lets a peer returning from out of range catch up on missed messages |
| Direct peer timeout        | 15 s                | A directly linked peer that goes quiet is demoted quickly           |
| Mesh peer timeout          | 60 s                | Relayed peers get longer, since multi-hop packets arrive late       |
| Geohash presence heartbeat | 40-80 s, randomised | Randomised so devices in one cell do not announce in lockstep       |
| Geohash participant window | 5 min               | How long a pubkey stays listed as present after its last event      |

## How Airhop Compares

Offline and private messengers generally fall into three categories:

- Internet-only messaging apps that rely on online infrastructure and cannot communicate locally without internet access.
- Radio-based mesh networks that work offline but require dedicated hardware.
- Phone-to-phone mesh apps that use Bluetooth and WiFi on devices people already own.

Airhop belongs to the third category and extends it by adding a Nostr-based internet bridge for long-distance communication when connectivity is available. The table is grouped in that order.

| Project                                    | Transport                     | Encryption                | Works offline | Hardware-free | Open source | Platforms                       |
| ------------------------------------------ | ----------------------------- | ------------------------- | ------------- | ------------- | ----------- | ------------------------------- |
| [Session](https://getsession.org)          | Onion routing (service nodes) | Session protocol          | ❌            | ✅            | ✅          | iOS, Android, Desktop           |
| [White Noise](https://www.whitenoise.chat) | Nostr relays                  | MLS (Marmot)              | ❌            | ✅            | ✅          | iOS, Android                    |
| [Meshtastic](https://meshtastic.org)       | LoRa radio                    | AES-256                   | ✅            | ❌            | ✅          | iOS, Android, Web + hardware    |
| [goTenna](https://gotenna.com)             | Proprietary sub-GHz radio     | Proprietary               | ✅            | ❌            | ❌          | iOS, Android + hardware         |
| [Bridgefy](https://bridgefy.me)            | Bluetooth + WiFi              | Signal (libsignal)        | ✅            | ✅            | ❌          | iOS, Android                    |
| [Briar](https://briarproject.org)          | Bluetooth + WiFi + Tor        | Bramble                   | ✅            | ✅            | ✅          | Android, Desktop                |
| [Berty](https://berty.tech)                | Bluetooth + mDNS + Tor        | Noise                     | ✅            | ✅            | ✅          | iOS, Android                    |
| [bitchat](https://bitchat.free)            | Bluetooth + Nostr             | Noise XX                  | ✅            | ✅            | ✅          | iOS, Android                    |
| [Airhop](https://airhop.1mindlabs.org)     | Bluetooth + WiFi + Nostr      | Noise XX + Double Ratchet | ✅            | ✅            | ✅          | iOS, Android, Desktop, Web, CLI |

## Getting Started

```bash
git clone https://github.com/areebahmeddd/airhop
cd airhop
npm install
npx expo prebuild
```

<details>
<summary><strong>Xcode setup</strong></summary>

1. Install [Xcode](https://developer.apple.com/xcode) from the Mac App Store, which also installs the iOS Simulator and base build tools
2. Open Xcode at least once and let it install any additional required components when prompted
3. Go to **Xcode** then **Settings** then **Locations**, and select the most recent version in the **Command Line Tools** dropdown
4. Go to **Xcode** then **Settings** then **Platforms**, click the **+** icon, and add an **iOS** runtime if one is not already installed
5. Install [CocoaPods](https://cocoapods.org) if it is not already present, then run `npx pod-install` from the project root to install the iOS native dependencies. `npx expo prebuild` already does this once, so only re-run it after changing native dependencies
6. Launch a simulator from the device dropdown, then run `npm run ios`

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
6. Copy the SDK path shown at the top of the **Android SDK** page into an `ANDROID_HOME` environment variable, or into `android/local.properties` as `sdk.dir=<path>`, since Gradle looks there for it
7. Open the virtual device manager: **More Actions** then **Virtual Device Manager** from the Welcome screen, or **View** then **Tool Windows** then **Device Manager** if a project is already open
8. Click **Create Device**, choose a **Pixel 9 Pro** profile, select one of the API levels just installed, then click **Finish**
9. Launch the emulator from the device list, then run `npm run android`

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
| [Nadim Kobeissi](https://github.com/mimoo)      | Noise Protocol implementation in bitchat iOS                                               |
| [a1denvalu3](https://github.com/a1denvalu3)     | Built the georelays toolkit that produces `assets/data/relays.csv`                         |

## Support

Help keep the project going by making a voluntary donation through our app or website, or simply give this repository a star.

<a href="https://www.star-history.com/?repos=areebahmeddd%2FAirhop&type=date&logscale=&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=areebahmeddd/Airhop&type=date&theme=dark&logscale&legend=top-left&sealed_token=-WkVGqvQDeQazbrkJu_cQRz5cPPAO6r0amRCkxBz9TDWfy-pvo-a8Iwuc-JqmwgWoWIBOfDJcjvCf8BEJyd0vbq4heI9MeZJiAnMahoWYaYeFSVS7g5StAqbZFATBHow8IpRrAoT2L41KWJqTUKqlA2x0Ksf3PuBSpr5X_REc7lIyWLGqNv_8BG7wv44" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=areebahmeddd/Airhop&type=date&logscale&legend=top-left&sealed_token=-WkVGqvQDeQazbrkJu_cQRz5cPPAO6r0amRCkxBz9TDWfy-pvo-a8Iwuc-JqmwgWoWIBOfDJcjvCf8BEJyd0vbq4heI9MeZJiAnMahoWYaYeFSVS7g5StAqbZFATBHow8IpRrAoT2L41KWJqTUKqlA2x0Ksf3PuBSpr5X_REc7lIyWLGqNv_8BG7wv44" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=areebahmeddd/Airhop&type=date&logscale&legend=top-left&sealed_token=-WkVGqvQDeQazbrkJu_cQRz5cPPAO6r0amRCkxBz9TDWfy-pvo-a8Iwuc-JqmwgWoWIBOfDJcjvCf8BEJyd0vbq4heI9MeZJiAnMahoWYaYeFSVS7g5StAqbZFATBHow8IpRrAoT2L41KWJqTUKqlA2x0Ksf3PuBSpr5X_REc7lIyWLGqNv_8BG7wv44" />
 </picture>
</a>
