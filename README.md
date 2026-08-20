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
  <a href="https://airhop.1mindlabs.org/architecture">Architecture</a>
  |
  <a href="https://airhop.1mindlabs.org/faq">FAQ</a>
  |
  <a href="https://airhop.1mindlabs.org/terms-of-service">Terms of Service</a>
  |
  <a href="https://airhop.1mindlabs.org/privacy-policy">Privacy Policy</a>
  |
  <a href="https://airhop.1mindlabs.org/#support">Support</a>
</p>

<p align="center">
  <a href="https://github.com/areebahmeddd/airhop/releases"><img src="https://img.shields.io/github/v/release/areebahmeddd/airhop?style=flat-square" alt="release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" /></a>
  <a href="https://github.com/areebahmeddd/airhop/actions/workflows/ci.yaml"><img src="https://img.shields.io/github/actions/workflow/status/areebahmeddd/airhop/ci.yaml?style=flat-square&label=CI" alt="CI" /></a>
  <a href="https://codecov.io/gh/areebahmeddd/airhop"><img src="https://img.shields.io/codecov/c/github/areebahmeddd/airhop?style=flat-square" alt="coverage" /></a>
  <a href="https://securityscorecards.dev/viewer/?uri=github.com/areebahmeddd/airhop"><img src="https://api.securityscorecards.dev/projects/github.com/areebahmeddd/airhop/badge?style=flat-square" alt="OpenSSF Scorecard" /></a>
</p>

<br />

Airhop is an iOS + Android app (macOS and Windows coming soon) for private, offline-first peer-to-peer communication over [Bluetooth mesh](https://en.wikipedia.org/wiki/Mesh_networking) networks, with [Nostr](https://nostr.org) internet bridging and [Cashu](https://cashu.space) [ecash](https://en.wikipedia.org/wiki/Ecash) payments. **Our mission is to make censorship-resistant communication available to anyone: during natural disasters, internet blackouts, mass protests, or any situation where networks are unavailable, surveilled, or shut down.**

Built on the foundation of [bitchat](https://bitchat.free), using the same [BLE wire protocol](docs/spec/PROTOCOLS.md), and [service UUIDs](docs/spec/PROTOCOLS.md#1-ble-identifiers), meaning Airhop-installed devices can automatically discover and join the same mesh as nearby Bitchat-installed devices, relay messages, and exchange DMs with zero setup. Airhop also extends the protocol with [Double Ratchet](https://signal.org/docs/specifications/doubleratchet) forward secrecy, [Tor](https://torproject.org) on both platforms, offline ecash payments, and offline AI (not present in bitchat _at the time of writing_).

> [!NOTE]
> Airhop is an independent side project built and maintained by [Areeb Ahmed](https://github.com/areebahmeddd) in his free time. It is not backed by any company or organization, not affiliated with or endorsed by permissionlesstech or the bitchat project, and not an impersonation of any existing app or service.

> [!WARNING]
> **WIP.** Not externally security-reviewed. All code is personally reviewed and run through the [security review agent](.github/agents/security-review.md) before shipping, but this is not a substitute for a formal audit. Do not rely on its security for sensitive use cases. External audit planned for [v1.9.0](docs/design/ROADMAP.md#v190-security-hardening).

## Built-in Features

| Category          | Feature                   | Description                                                                                                                                    |
| ----------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 💬 **Messaging**  | Private DMs               | One-on-one end-to-end encrypted messaging                                                                                                      |
|                   | Public channels           | IRC-style group chat rooms anyone nearby can join                                                                                              |
|                   | Location channels         | Public rooms scoped to a geohash cell, from a block to a region, bridged over the internet. Jump to any cell to read a place you are not in    |
|                   | Private channels          | Invite-only encrypted rooms. A shared key travels in the invite link, so anyone with the link joins and reads; there is no member cap          |
|                   | Private groups            | Fixed-roster encrypted group chats. The creator signs the member list (up to 16) and shares the key over Noise; only listed members can read   |
|                   | Bulletin board            | Signed notices that outlive chat: pin a post to your mesh or location for 1 to 7 days, with urgent flags. Late arrivals catch up automatically |
| 📎 **Sharing**    | Photos & videos           | Send photos and videos over the mesh. Photos support PNG, JPEG, GIF and WebP up to 512 KB; videos support MP4 and MOV up to 1 MB               |
|                   | Voice messages            | Send a recorded voice message over the mesh in AAC, 16 kHz mono, up to 512 KB                                                                  |
|                   | Live voice                | Hold the mic to talk to people in range, walkie-talkie style; recordings land in chat as voice messages                                        |
|                   | File transfer             | Send any file format over the mesh, including documents and archives, up to 1 MB per file                                                      |
|                   | Store-and-forward courier | Messages are delivered automatically when a route becomes available, sealed to a one-time prekey for forward secrecy                           |
| 🔒 **Identity**   | No-account identity       | Identity is an Ed25519 key pair stored only on your device                                                                                     |
|                   | Human-readable names      | Deterministic usernames derived from your public key                                                                                           |
|                   | QR contacts               | Add a contact by scanning their QR code; carries their public keys, not just an ID                                                             |
|                   | End-to-end encryption     | Secure sessions using the Noise XX protocol                                                                                                    |
|                   | Forward secrecy           | Double Ratchet protects past messages even if keys are later compromised                                                                       |
|                   | Panic wipe                | Triple-tap instantly erases keys and local messages (nuke your account)                                                                        |
| 🕸️ **Networking** | Bluetooth mesh            | Communicate with nearby devices without internet                                                                                               |
|                   | Mesh bridge               | Link this area's public #bluetooth chat with another out-of-range Bluetooth crowd over the internet. Off by default                            |
|                   | Multi-hop routing         | Messages automatically relay across nearby devices (up to 7 hops)                                                                              |
|                   | Relay nodes               | Third-party [Bitle](https://bitle.org) hardware extends the mesh where nobody stands. Requires an ESP32 board, plus LoRa to link nodes         |
|                   | WiFi high-bandwidth mode  | Faster file transfers between two Android devices, or two iPhones. Not across platforms                                                        |
|                   | bitchat compatibility     | Airhop nodes communicate directly with bitchat on iOS and Android                                                                              |
| 🌐 **Internet**   | Internet fallback         | DMs and channels keep flowing over Nostr relays when a user moves out of Bluetooth range                                                       |
|                   | Geo-relay discovery       | Discover location-based channels across 300+ distributed Nostr relays                                                                          |
|                   | Internet gateway          | Lend your connection to a nearby offline phone so it can still reach the location (geohash) channels. Off by default                           |
|                   | Tor integration           | Route Nostr traffic through Tor (Arti on iOS, Orbot on Android)                                                                                |

**TL;DR: No internet required. No central servers. No accounts. No tracking.**

## Optional Features

| Category        | Feature         | Description                                                                                                                                                                                                                                                                                                                                       |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 💰 **Payments** | Cashu ecash     | Pay someone standing next to you over Bluetooth, with no internet on either phone. Coins are stored encrypted on your device, checked against the mint’s signature the moment they arrive (NUT-12), and a payment that never reaches anyone can be taken back. Internet is only needed to top up, cash out, or confirm a received coin is unspent |
|                 | Lightning       | Top up from any Lightning wallet, and cash out to any Lightning invoice, through the mint you choose (NUT-04 / NUT-05)                                                                                                                                                                                                                            |
|                 | Nutzaps         | Pay a Nostr identity over the internet, locked to their key so only they can spend it (NIP-61). Falls back to an encrypted message if they have not set it up                                                                                                                                                                                     |
|                 | Wallet recovery | Optional 12-word recovery phrase, off by default. Turn it on and a new phone can rebuild your balance by asking your mints which coins they signed (NUT-13 / NUT-09)                                                                                                                                                                              |
| 🤖 **AI**       | Local assistant | On-device inference answers questions with zero network calls, data never leaves your device                                                                                                                                                                                                                                                      |
| 🔗 **Social**   | AT Protocol     | Opt-in bridge to Bluesky, using your Airhop identity                                                                                                                                                                                                                                                                                              |
|                 | ActivityPub     | Opt-in bridge to Mastodon, using your Airhop identity                                                                                                                                                                                                                                                                                             |

## Stack

| Layer                   | Technology                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application Framework   | [React Native](https://reactnative.dev) 0.86, [Expo](https://expo.dev) SDK 57 (bare workflow)                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Network Transport       | [Bluetooth LE](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy) mesh (all platforms), [Nostr](https://github.com/nostr-protocol/nostr) relay bridge, plus an optional same-platform fast path: [WiFi Aware](https://wi-fi.org/discover-wi-fi/wi-fi-aware) between Android devices and [MultipeerConnectivity](https://developer.apple.com/documentation/multipeerconnectivity) between iPhones                                                                                                                                         |
| Cryptographic Protocols | [Noise XX](https://noiseprotocol.org/noise.html) handshake, [Double Ratchet](https://signal.org/docs/specifications/doubleratchet) algorithm                                                                                                                                                                                                                                                                                                                                                                                              |
| Cryptographic Library   | [`@noble/curves`](https://github.com/paulmillr/noble-curves), [`@noble/ciphers`](https://github.com/paulmillr/noble-ciphers), [`@noble/hashes`](https://github.com/paulmillr/noble-hashes) ([Cure53](https://cure53.de) audited)                                                                                                                                                                                                                                                                                                          |
| Identity & Signatures   | [Ed25519](https://ed25519.cr.yp.to) scheme                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Network Privacy         | [Arti](https://gitlab.torproject.org/tpo/core/arti) (iOS), [Orbot](https://guardianproject.info/apps/org.torproject.android) (Android)                                                                                                                                                                                                                                                                                                                                                                                                    |
| Payment System          | [Cashu](https://cashu.space) [ecash](https://en.wikipedia.org/wiki/Ecash) via [`@cashu/cashu-ts`](https://github.com/cashubtc/cashu-ts): offline transfer, [NUT-12](https://github.com/cashubtc/nuts/blob/main/12.md) DLEQ verification, [NUT-13](https://github.com/cashubtc/nuts/blob/main/13.md) recovery phrase, [NUT-04](https://github.com/cashubtc/nuts/blob/main/04.md) and [NUT-05](https://github.com/cashubtc/nuts/blob/main/05.md) Lightning, plus [NIP-61](https://github.com/nostr-protocol/nips/blob/master/61.md) Nutzaps |
| State Management        | [Zustand](https://github.com/pmndrs/zustand) store, [MMKV](https://github.com/mrousavy/react-native-mmkv) storage                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Key Storage             | [iOS Keychain](https://developer.apple.com/documentation/security/storing-keys-in-the-keychain), [Android Keystore](https://developer.android.com/privacy-and-security/keystore)                                                                                                                                                                                                                                                                                                                                                          |

## Transports

Airhop chooses a transport per message. Bluetooth is the only one that needs no internet and the only one that works across iOS and Android. WiFi and Nostr are used when they are available.

|                         | Bluetooth LE mesh                                                  | WiFi (same platform)                     | Nostr relays                     |
| ----------------------- | ------------------------------------------------------------------ | ---------------------------------------- | -------------------------------- |
| Carries                 | Channel messages, DMs, files, ecash                                | DMs and files, when a link exists        | DMs and geohash channel messages |
| Needs internet          | No                                                                 | No                                       | Yes                              |
| Works iPhone to Android | Yes                                                                | No                                       | Yes                              |
| Range                   | ~10-30 m indoors, up to ~100 m line of sight, extended by each hop | ~30 m                                    | Global                           |
| Max hops                | 7                                                                  | 1                                        | 1                                |
| Speed                   | ~19 KB/s to one peer, ~16 KB/s to a channel                        | ~19 KB/s (shared with Bluetooth for now) | Not used for files               |
| Latency per hop         | 10-220 ms (randomised to avoid collisions)                         | n/a                                      | Relay round trip; more over Tor  |

Notes on the numbers:

- Text messages (channel and DM) are tiny and effectively instant on any transport. Throughput only matters for files.
- The **~19 KB/s** figure is 467 bytes per fragment sent one every 25 ms. The delay is required: without it the radio drops fragments and the transfer never completes.
- A channel attachment paces at 30 ms instead (**~16 KB/s**), since each broadcast fragment requires one radio write per connected peer, increasing airtime usage as the room grows.
- WiFi currently shares that same paced queue, so it runs at the same speed as Bluetooth for now. [ Lifting the cap is planned ]
- A 1 MB file (the per-file cap) takes about 56 seconds to one peer. Attachments are capped at 1 MB for bitchat compatibility and to keep transfers short. [ Increasing the cap is planned ]
- Android WiFi Aware and iOS MultipeerConnectivity are different protocols and cannot connect to each other, so the WiFi path only works Android to Android or iPhone to iPhone.
- Nostr relays carry small signed events, not file bytes. Files can be shared over Nostr only by uploading them to a separate HTTP host and posting a link ([NIP-96](https://github.com/nostr-protocol/nips/blob/master/96.md)). Airhop does not do this: that host is a central server that can log, throttle, or take down your files, which is exactly what this app avoids. Attachments therefore travel only over Bluetooth or WiFi.

Timing intervals:

| Behaviour                  | Interval            | Why                                                                 |
| -------------------------- | ------------------- | ------------------------------------------------------------------- |
| Presence broadcast         | 4 s alone, 15-30 s  | Fast while alone so devices meet quickly, then backs off            |
| Gossip sync                | 15 s                | Lets a peer returning from out of range catch up on missed messages |
| Direct peer timeout        | 45 s                | Handles unreported link drops beyond broadcast                      |
| Mesh peer timeout          | 60 s                | Relayed peers get longer, since multi-hop packets arrive late       |
| Geohash presence heartbeat | 40-80 s, randomised | Randomised so devices in one cell do not announce in lockstep       |
| Geohash participant window | 5 min               | How long a pubkey stays listed as present after its last event      |

## How Airhop Compares

Offline and private messengers generally fall into three categories:

- Internet-only messaging apps that rely on online infrastructure and cannot communicate locally without internet access.
- Radio-based mesh networks that work offline but require dedicated hardware.
- Phone-to-phone mesh apps that use Bluetooth and WiFi on devices people already own.

Airhop belongs to the third category and extends it with a Nostr-based internet layer for long-distance communication when connectivity is available. The table is grouped in that order, starting with the apps most people already measure private messaging against.

| Project                                | Transport                             | Encryption                | Works offline | Hardware-free | Open source | Platforms                       |
| -------------------------------------- | ------------------------------------- | ------------------------- | ------------- | ------------- | ----------- | ------------------------------- |
| [Signal](https://signal.org)           | Centralized servers                   | Signal protocol           | ❌            | ✅            | ✅          | iOS, Android, Desktop           |
| [Threema](https://threema.ch)          | Centralized servers                   | NaCl + Ibex               | ❌            | ✅            | ⚠️          | iOS, Android, Desktop           |
| [Session](https://getsession.org)      | Onion routing (service nodes)         | Session protocol          | ❌            | ✅            | ✅          | iOS, Android, Desktop           |
| [White Noise](https://whitenoise.chat) | Nostr relays                          | MLS (Marmot)              | ❌            | ✅            | ✅          | iOS, Android                    |
| [Meshtastic](https://meshtastic.org)   | LoRa radio                            | AES-256 + Curve25519 PKI  | ✅            | ❌            | ✅          | iOS, Android, Web + hardware    |
| [goTenna](https://gotenna.com)         | Proprietary sub-GHz radio             | AES-256 + ECC-384 PKI     | ✅            | ❌            | ❌          | iOS, Android + hardware         |
| [Bridgefy](https://bridgefy.me)        | Bluetooth + WiFi                      | Signal (libsignal)        | ✅            | ✅            | ❌          | iOS, Android                    |
| [Berty](https://berty.tech)            | Bluetooth + mDNS                      | Scuttlebutt + Ratchet     | ✅            | ✅            | ✅          | iOS, Android                    |
| [Briar](https://briarproject.org)      | Bluetooth + WiFi + Tor                | Bramble                   | ✅            | ✅            | ✅          | Android, Desktop                |
| [bitchat](https://bitchat.free)        | Bluetooth + Nostr + Tor               | Noise XX                  | ✅            | ✅            | ✅          | iOS, Android                    |
| [Airhop](https://airhop.1mindlabs.org) | Bluetooth + Nostr + mDNS + WiFi + Tor | Noise XX + Double Ratchet | ✅            | ✅            | ✅          | iOS, Android, Desktop, Web, CLI |

⚠️ Threema's client apps are open source, but its servers are not, and the app is a paid one-time purchase.

Signal and Threema are here as the benchmark rather than as alternatives. Both are excellent at what they do, and neither is trying to work without a network: Signal ties an account to a phone number and Threema to a Threema ID, and both stop entirely when the network does. Airhop is aimed at the moment after that, when there is no network to be excellent on.

## Getting Started

```bash
git clone https://github.com/areebahmeddd/airhop
cd airhop
npm install
```

> [!CAUTION]
> Never run `npx expo prebuild`. The `ios/` and `android/` directories are checked in and hand-modified, and prebuild overwrites them.

<details>
<summary><strong>Xcode setup</strong></summary>

1. Install [Xcode](https://developer.apple.com/xcode) from the Mac App Store, which also installs the iOS Simulator and base build tools
2. Open Xcode at least once and let it install any additional required components when prompted
3. Go to **Xcode** then **Settings** then **Locations**, and select the most recent version in the **Command Line Tools** dropdown
4. Go to **Xcode** then **Settings** then **Platforms**, click the **+** icon, and add an **iOS** runtime if one is not already installed
5. Install [CocoaPods](https://cocoapods.org) if it is not already present, then run `npx pod-install` from the project root to install the iOS native dependencies.
6. Launch a simulator from the device dropdown, then run `npm run ios`

> The first `npm run ios` builds the native app from scratch and can take several minutes. Later runs are much faster.

> Requires a physical iPhone for BLE mesh testing (the iOS Simulator does not support Bluetooth) and supports iOS 16.0 or later.

> Changing a native dependency also changes `ios/Podfile.lock`, which pins exact pod versions. Regenerate it with `npx pod-install` in the same commit.

If a build fails after changing dependencies, clear the Xcode and CocoaPods caches before trying again:

```bash
rm -rf ios/Pods ios/build ~/Library/Developer/Xcode/DerivedData/Airhop-*
npx pod-install
npm run ios
```

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

> Requires a physical Android device for BLE mesh testing (the Android Emulator does not support Bluetooth) and supports Android 8.0 (API 26) or later.

> Changing a native dependency also changes `android/app/gradle.lockfile`, which pins exact versions. Regenerate it in the same commit.

If a build fails after changing dependencies, clear the Gradle caches before trying again:

```bash
cd android && ./gradlew --stop
rm -rf ../node_modules/expo-modules-core/expo-module-gradle-plugin/{build,.gradle}
./gradlew app:dependencies --write-locks
./gradlew app:assembleDebug -Pkotlin.incremental=false
cd .. && npm run android
```

</details>

## Documentation

| Document                                     | Description                                                         |
| -------------------------------------------- | ------------------------------------------------------------------- |
| [VISION.md](docs/design/VISION.md)           | Why Airhop exists and what it will never compromise on              |
| [ROADMAP.md](docs/design/ROADMAP.md)         | Version targets (v0.5.0 to v2.0.0), and gap analysis                |
| [ARCHITECTURE.md](docs/spec/ARCHITECTURE.md) | System architecture, design decisions, and stack rationale          |
| [PROTOCOLS.md](docs/spec/PROTOCOLS.md)       | Wire format, BLE UUIDs, and protocol specifications                 |
| [REFERENCE.md](docs/dev/REFERENCE.md)        | Bitchat codebase deep dive and implementation reference             |
| [PROGRESS.md](docs/dev/PROGRESS.md)          | Current build, development milestones, and known issues             |
| [GLOSSARY.md](docs/dev/GLOSSARY.md)          | Definitions of technical terms used throughout the documentation    |
| [CONTRIBUTING.md](CONTRIBUTING.md)           | Development workflow, coding standards, and pull request guidelines |
| [SECURITY.md](SECURITY.md)                   | Security policy and vulnerability reporting                         |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)     | Community standards and expectations                                |

## Acknowledgements

Airhop would not exist without the work of the bitchat community. Thank you to everyone who built the foundation this project stands on. Their work is released into the public domain under the [Unlicense](https://github.com/permissionlesstech/bitchat/blob/main/LICENSE).

| Person                                          | Contribution                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------ |
| [jackjackbits](https://github.com/jackjackbits) | Created bitchat-ios, designed the BLE mesh protocol and wire format      |
| [callebtc](https://github.com/callebtc)         | Lead on bitchat-android, author of the Cashu ecash protocol              |
| [Nadim Kobeissi](https://github.com/mimoo)      | Noise Protocol implementation in bitchat                                 |
| [a1denvalu3](https://github.com/a1denvalu3)     | Built the georelays toolkit that produces `assets/data/nostr_relays.csv` |

## Support

Help keep the project going by donating via the website, sponsoring on GitHub, or simply giving this repository a star. What the project needs funding for is published as a [`funding.json`](https://airhop.1mindlabs.org/funding.json) manifest, following the [funding.json](https://fundingjson.org) standard.

<a href="https://www.star-history.com/?repos=areebahmeddd%2Fairhop&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=areebahmeddd/airhop&type=date&theme=dark&legend=top-left&sealed_token=JSsEpriySIayAI2wUVg8LzhhTxFJWz5H0YZ5rvfw7WevEVWX9zhQ37u8MkG4kcls5YxCSAaN7p-XnzLR7zC1dwxrMNapMfl1DKcoP_LxvwWHHaOYoT4tTuwyZSV2DSw7qkGrTJYNxfU6fQ7ljueKHAvq6Vx0rgTJprOdvixJW4SxEv1kWzxeVK9ZV8W_" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=areebahmeddd/airhop&type=date&legend=top-left&sealed_token=JSsEpriySIayAI2wUVg8LzhhTxFJWz5H0YZ5rvfw7WevEVWX9zhQ37u8MkG4kcls5YxCSAaN7p-XnzLR7zC1dwxrMNapMfl1DKcoP_LxvwWHHaOYoT4tTuwyZSV2DSw7qkGrTJYNxfU6fQ7ljueKHAvq6Vx0rgTJprOdvixJW4SxEv1kWzxeVK9ZV8W_" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=areebahmeddd/airhop&type=date&legend=top-left&sealed_token=JSsEpriySIayAI2wUVg8LzhhTxFJWz5H0YZ5rvfw7WevEVWX9zhQ37u8MkG4kcls5YxCSAaN7p-XnzLR7zC1dwxrMNapMfl1DKcoP_LxvwWHHaOYoT4tTuwyZSV2DSw7qkGrTJYNxfU6fQ7ljueKHAvq6Vx0rgTJprOdvixJW4SxEv1kWzxeVK9ZV8W_" />
 </picture>
</a>
