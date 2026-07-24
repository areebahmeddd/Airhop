# Airhop: Architecture

## Full Stack: Every Layer, Every Decision

**Date:** July 12, 2026  
**Cross-referenced against:** [ROADMAP.md](../design/ROADMAP.md), bitchat/ios, bitchat/android, bitchat/georelays  
**Security stance:** Security-first from day 0. No compromises. No exceptions.

## Table of Contents

1. [Project Folder Structure](#1-project-folder-structure)
2. [Core Feature Matrix](#2-core-feature-matrix)
3. [Identity: No Accounts, Ever](#3-identity--no-accounts-ever)
4. [Adaptive Transport Stack](#4-adaptive-transport-stack)
5. [Encryption Architecture](#5-encryption-architecture)
6. [Messaging Protocol](#6-messaging-protocol)
7. [Groups & Channels](#7-groups--channels)
8. [Payments: Offline-First Ecash](#8-payments--offline-first-ecash)
9. [Privacy & Tor Integration](#9-privacy--tor-integration)
10. [Security Threat Model](#10-security-threat-model)
11. [Native Module Architecture](#11-native-module-architecture)
12. [Protocol Decision Log](#12-protocol-decision-log)
13. [Dependency Manifest](#13-dependency-manifest)

## 1. Project Folder Structure

### The guiding rule: if it compiles to JS, it lives in `src/`. If it touches hardware, it lives in `android/` or `ios/`

Directories, not files, since the file list moves every release:

| Path            | Holds                                                                         |
| --------------- | ----------------------------------------------------------------------------- |
| `android/`      | Kotlin BLE module and the foreground service that keeps the mesh alive        |
| `ios/`          | Swift BLE module built on CoreBluetooth                                       |
| `src/bridge/`   | TurboModule specs. The only place native and TypeScript meet                  |
| `src/core/`     | The whole protocol in pure TypeScript: crypto, mesh, nostr, payments, routing |
| `src/services/` | Long-lived runtime wiring, chiefly the mesh service that owns the radios      |
| `src/features/` | Screens and screen-level logic                                                |
| `src/store/`    | Zustand state with MMKV persistence                                           |
| `src/ui/`       | Shared components and theme tokens                                            |
| `src/utils/`    | Stateless helpers                                                             |
| `assets/data/`  | Bundled relay list, refreshed by CI                                           |

`src/core/` has no native dependencies, so the entire protocol is testable in CI
without a phone. That is why the test suite can cover the wire format, the
handshakes and the routing while the radios stay unproven until a field test.

### Will native code cause problems building or shipping?

**No. This is exactly how every production React Native app with native modules ships.**

- `android/` is compiled by Gradle into a `.aab` (Play Store). Xcode is not involved.
- `ios/` is compiled by Xcode into an `.ipa` (App Store Connect). Gradle is not involved.
- EAS Build (Expo's CI) runs both builds in parallel on cloud VMs
- Google Play and Apple App Store treat the result as a fully native app. They don't know or care that TypeScript orchestrates the native layers

**Consistency guarantee for ALL features on BOTH platforms:** Every feature lives in `src/core/` TypeScript. The ~900 lines of native BLE code expose an _identical_ TypeScript interface on both platforms. A bug fix in gossip sync fixes both iOS and Android at once. Protocol upgrades ship simultaneously. No drift.

## 2. Core Feature Matrix

| Feature                   | Offline (BLE)            | Online (Nostr)      | Notes                                                                          |
| ------------------------- | ------------------------ | ------------------- | ------------------------------------------------------------------------------ |
| Peer discovery            | Yes, announce broadcasts | Yes, kind 20001     | Peers show on the mesh radar and in the location cell                          |
| Public channels           | Yes, TTL flood           | Yes, kind 20000     | `#bluetooth` stays local; `#block` to `#region` also bridge                    |
| Private channels          | Yes, sealed `0x2a`       | Optional, same blob | Airhop only. Key rides an invite link, no member cap                           |
| Private groups            | Yes, sealed `0x25`       | No                  | bitchat compatible. Creator-signed roster, max 16, Bluetooth only              |
| Private DMs               | Yes, Noise XX (+DR)      | Yes, NIP-17 wrap    | Receipts on every path. DR only between Airhop peers                           |
| Bulletin board            | Yes, signed `0x23`       | Yes, kind 1 mirror  | Public and signed, 1 to 7 day expiry, gossip catch-up                          |
| Voice notes               | Yes, as a file           | No                  | Recorded AAC, not live                                                         |
| Video sharing             | Yes, as a file           | No                  | Recorded and played inline. Live streaming is not possible across platforms    |
| File transfer             | Yes, 1 MiB cap           | No                  | Cap is enforced by bitchat's decoder, so it is not ours to raise               |
| Store-and-forward courier | Yes, sealed envelope     | Yes, parked drop    | 24 hour life. Sealed to a one-time prekey for forward secrecy                  |
| Live push-to-talk         | No                       | No                  | `0x29` reserved, never sent. Needs a streaming-mic native module               |
| Payments (Cashu)          | Yes, token in a message  | Yes, NIP-61 Nutzap  | Transfer works offline, redemption needs internet                              |
| Contact verification      | Yes, QR exchange         | n/a                 | The card carries public keys, and the peer ID is checked against its noise key |
| Panic wipe                | Yes                      | Yes                 | Triple-tap. Destroys keys, messages, groups, board, prekeys                    |
| Internet gateway          | Relays for others        | Yes                 | Off by default. Carries public location traffic for offline peers              |
| Tor routing               | n/a                      | Yes                 | Arti on iOS, Orbot on Android. BLE is local, so nothing to route               |
| Relay discovery           | n/a                      | Yes                 | Bundled CSV, refreshed from the georelays repo                                 |
| bitchat compatibility     | Yes                      | Yes                 | Same wire format both directions. Airhop-only types are simply ignored         |

Optional, shipped but switchable:

| Feature         | Needs internet | Notes                                               |
| --------------- | -------------- | --------------------------------------------------- |
| Cashu ecash     | Only to redeem | Tokens move device to device over the mesh          |
| Nutzaps         | Yes            | NIP-61 lightning payments                           |
| Local assistant | No             | On-device inference, nothing leaves the phone       |
| AT Protocol     | Yes            | Opt-in bridge to Bluesky using the Airhop identity  |
| ActivityPub     | Yes            | Opt-in bridge to Mastodon using the Airhop identity |

## 3. Identity: No Accounts, Ever

Airhop identity is a **cryptographic key pair generated locally, stored in OS Keychain, never transmitted to any server.**

### Key pair structure

```
Identity
├── Noise Static Key   (X25519)     - for session encryption (Noise XX handshake)
├── Signing Key        (Ed25519)    - for packet + board/prekey/group authentication
├── Nostr Key          (secp256k1)  - derived from the signing key; the Nostr identity
└── Peer ID            (string)     - SHA-256(noiseStaticPub).slice(0, 8 bytes) → 16 hex chars
```

The **Nostr key is a separate secp256k1 (Schnorr) keypair deterministically derived
from the Ed25519 signing key** (HKDF, see `deriveNostrPrivKey`). Nostr uses secp256k1,
so the Ed25519 signing key is not itself the `npub`. Deriving it means one root identity
still yields a single stable Nostr identity across BLE mesh + Nostr + payments, with no
linking to phone numbers, emails, or real-world identifiers. Location channels use a
further per-geohash secp256k1 identity (also derived from the signing key) so presence in
one cell cannot be linked to another.

### Human-readable names

Usernames are **deterministically derived from the public key**, never user-chosen:

```
peerID 3a9f2c1b → "swift-falcon-3a9f"
```

This prevents impersonation and username squatting. Users verify real identity via QR code fingerprint exchange.

### Anti-impersonation

- Every packet is **Ed25519-signed** by the sender
- Receivers **verify signatures before relaying or displaying** any message
- A peer cannot forge another peer's messages without their private key
- Relay nodes drop unsigned or invalid-signature packets immediately
- Name collisions are impossible: the name is derived from the public key

### Key storage

| Secret               | Storage                          | Backed by                         |
| -------------------- | -------------------------------- | --------------------------------- |
| `noiseStaticPrivKey` | `react-native-encrypted-storage` | iOS Keychain / Android Keystore   |
| `signingPrivKey`     | `react-native-encrypted-storage` | iOS Keychain / Android Keystore   |
| `cashuWalletPrivKey` | `react-native-encrypted-storage` | iOS Keychain / Android Keystore   |
| Active sessions      | `react-native-mmkv` (encrypted)  | RAM-backed, not persisted         |
| Message history      | `react-native-mmkv`              | Encrypted at rest, panic-wipeable |

## 4. Adaptive Transport Stack

Airhop routes messages through the best available transport **automatically, without user involvement.** The user sees one interface regardless of which radio is carrying their message.

```
MessageRouter.ts - transport selection logic

Priority order:
1. BLE Mesh          - always preferred if recipient is nearby (confirmed by announce)
2. WiFi Aware/Direct - if both parties have it active and are in range (~30m, 250Mbps)
3. Nostr Relay       - if internet available, for confirmed offline recipients
4. Courier           - if everything else fails (spray-and-wait through mesh peers)
```

### BLE Mesh Transport

Identical to bitchat's proven design:

- **Dual-role**: every device is simultaneously GATT Central (scanner) and GATT Peripheral (advertiser)
- **Service UUID**: `F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C` (bitchat-compatible)
- **TTL**: 7 hops default; packet copy count decrements each relay
- **Jitter**: 10–220ms random delay before relay (prevents cascade storms)
- **Dedup**: 1000-entry LRU seen-set, 5-minute expiry on nonce
- **Fragment size**: 469 bytes (bitchat-compatible)
- **Max concurrent assemblies**: 128
- **Range per hop**: ~30–50m; 7 hops = ~350m max mesh range

### Same-platform WiFi Transport (optional fast path)

> [!IMPORTANT]
> Android WiFi Aware and iOS MultipeerConnectivity are different protocols and
> cannot talk to each other. This is an Android-to-Android or iPhone-to-iPhone
> accelerator only. Anything cross-platform uses Bluetooth or Nostr.
> (Apple shipped a standards-based Wi-Fi Aware framework in iOS 26 which could
> close this gap in future, but it would make the feature iOS 26+ only.)

- **Android**: [`WifiAwareManager`](https://developer.android.com/develop/connectivity/wifi/wifi-aware) API (API 26+): 250 Mbps, no internet, no router
- **iOS**: [`MultipeerConnectivity`](https://developer.apple.com/documentation/multipeerconnectivity): 30–100 Mbps between nearby iOS devices
- Same `Transport` interface as BLE; mesh engine doesn't care which radio
- Enables: live video, large files, high-quality voice (anything BLE can't support

### Nostr Internet Transport

- **350+ public relays** (georelays dataset, bundled as `assets/data/relays.csv`)
- **Geographic relay selection**: [Haversine](https://en.wikipedia.org/wiki/Haversine_formula) distance from device location to relay server → lowest latency
- **NIP-17 gift-wrap** for private DMs (metadata-minimal, no message content on relays)
- **Kind 20000/20001**: geohash public channels and presence heartbeats
- **Tor-proxied by default** on iOS (Arti); optional via Orbot on Android
- **No single relay dependency**: `SimplePool` connects to 3–5 relays simultaneously; first ACK wins

## 5. Encryption Architecture

### Session Encryption: Noise XX

```
Protocol: Noise_XX_25519_ChaChaPoly_SHA256
```

Used for all live BLE DM sessions:

- **Pattern XX**: both parties are mutually authenticated (each sends their static key encrypted)
- **Forward secrecy**: ephemeral keys generated fresh per session; compromise of static key doesn't expose past sessions
- **Deniability**: after session, neither party can prove to a third party what was said

The XX handshake produces two symmetric keys (`send`, `recv`). Messages are then encrypted with [ChaCha20-Poly1305](https://datatracker.ietf.org/doc/html/rfc7539) using a counter nonce (preventing replay).

### Persistent Message Encryption: [Double Ratchet](https://signal.org/docs/specifications/doubleratchet/)

```
Algorithm: Signal Double Ratchet (same as Signal/WhatsApp)
Root key seeded from: the Noise XX static-static ECDH, no extra round trips
```

Used for all DMs stored in the courier / offline outbox:

- **Per-message forward secrecy**: compromise of message N does not expose messages N-1 or N+1
- **Break-in recovery**: if an attacker learns current keys, future messages are still protected after a few ratchet steps
- Prekey bundles: one-time public prekeys are signed and gossiped over the mesh as `0x24`, never published to Nostr. A sender seals courier mail to one of them, so an undelivered message stays protected even if the recipient's long-lived key leaks later. X3DH is not used: the Noise static-static ECDH already seeds the ratchet, which made a separate key agreement redundant

### Packet Signing: [Ed25519](https://ed25519.cr.yp.to/)

Every packet carries an Ed25519 signature from the sender:

- Signed before transmission, verified before relay or display
- Signature covers all packet fields except TTL and signature itself
- **Prevents replay across different contexts**: packet includes timestamp + nonce

### Summary

```
Live DM session:      Noise XX (mutual auth, perfect forward secrecy per session)
Stored DM:            Double Ratchet (per-message forward secrecy)
Public channel:       Plaintext + Ed25519 signature (public, readable by all peers)
Courier envelope:     Noise X (one-way seal to recipient's static key) wrapping DR ciphertext
Nostr DM:             NIP-44 encryption (XChaCha20-Poly1305, versioned) + NIP-17 gift-wrap
```

## 6. Messaging Protocol

### Wire format (bitchat v2, binary)

Airhop is **100% wire-compatible with bitchat**. Airhop nodes appear as normal peers to bitchat devices on the mesh. Unknown packet types (Airhop extensions) are silently dropped by bitchat. No disruption.

> **See [`docs/spec/PROTOCOLS.md`](../spec/PROTOCOLS.md) for the complete byte layout (section 2), packet type registry (section 3), routing constants (section 4), and all other protocol constants.**

### Routing logic

Public channel messages: **TTL flood**, every peer re-broadcasts with TTL decremented  
Direct messages: **flood with recipientID**, only recipient decrypts; others relay until TTL=0  
Courier envelopes: **spray-and-wait**, trusted peers carry sealed blobs for offline recipients

## 7. Groups & Channels

### Mesh Channels (offline-first)

Channels are prefixed with `#`, same as bitchat. They are **not** registered anywhere. Anyone who broadcasts on `#channel-name` participates.

- Fully offline: no server, no registration
- History: 6-hour public message window (gossip sync reconciles on connect)
- Channel discovery: scan announce packets for `channelMemberships[]` field
- Moderation: client-side block list (muted peer IDs don't relay to UI)

### Private channels (Airhop only)

An invite-only room. A symmetric key is generated at creation and travels inside
the invite link, so anyone holding the link can read. There is no roster and no
member cap, which is the point: the link has to spread faster than anyone could
add people by hand.

- Sealed with XChaCha20-Poly1305 and broadcast as `0x2a`
- Reach is the creator's choice: Bluetooth only, or Bluetooth plus Nostr, where
  the same sealed blob is published so out-of-range members still receive it
- bitchat drops `0x2a` as an unknown type, so this coexists without breaking it

### Private groups (bitchat compatible)

A fixed set of people rather than a place. The creator signs a roster of up to 16
members, and the group key is delivered to each member individually inside their
Noise session. No link exists, so nobody can forward their way in.

- Messages are sealed with ChaCha20-Poly1305 under the current epoch key and
  broadcast as `0x25`, with the group ID and epoch left in the clear so relays
  can carry them without being members
- Bluetooth only. A group message does not bridge to Nostr, so a member who
  walks out of range stops receiving it until they return
- Rotating the key bumps the epoch, and older epochs are refused

### Not used: NIP-29

Relay-hosted groups were considered and dropped. They put membership enforcement
on a relay, which is a server deciding who may speak, and that contradicts the
no-central-server principle. Both group models above keep that decision on the
devices that hold the keys.

### The Airhop model: same channel, two transports

A public location channel exists on both at once:

1. BLE mesh when offline, relaying through nearby devices
2. Nostr when internet is available, through relays chosen near the cell

Reconnecting after time offline reconciles the gap through GCS gossip sync, the
same mechanism bitchat uses.

## 8. Payments: Offline-First Ecash

> bitchat already includes `CashuTokenDecoderTests.swift`; this validates Cashu as the right choice. We are not inventing; we are completing what bitchat started.

### Why Cashu for offline payments

Cashu is a **Chaumian ecash protocol** (blind signatures). Tokens are strings that represent value. Critically:

- **Transfer is fully offline**: Alice sends a Cashu token string over BLE to Bob; Bob has the value immediately
- **No network during transfer**: the token is a bearer instrument; whoever holds it, owns it
- **Redemption** (swapping to Lightning/Bitcoin) requires internet connection to the mint
- **Double-spend protection**: the mint tracks spent proofs; Bob should redeem quickly when he gets internet
- **Privacy**: the mint cannot link token issuance to redemption (blind signatures)
- **Denominations**: tokens can be split and combined (1 sat granularity)

### Cashu token in a message

A payment is sent as a **message attachment**: the same channel/DM that carries text carries the token. The sender includes the token string in the message body. The receiver's app detects and renders it as a payment card.

```
Message body example:
💸 500 sats - coffee money
cashuBo3Blk4J...
```

The token flows over BLE like any other message: encrypted if DM, signed always.

### Online payments: NIP-61 Nutzaps

When internet is available, users can send **Nutzaps** (NIP-61):

1. Sender fetches recipient's `kind:10019` (trusted mints + P2PK pubkey)
2. Sender mints/swaps ecash P2PK-locked to recipient's `kind:10019` pubkey
3. Sender publishes `kind:9321` nutzap event to recipient's relays
4. Recipient's client swaps token into their wallet
5. Transaction history stored in `kind:7376` events (NIP-60)

### Payment security model

| Attack             | Mitigation                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Double-spend       | Receiver redeems with mint ASAP; mint tracks spent proofs                                                                 |
| Mint failure       | User controls which mints to trust; can use multiple mints                                                                |
| Token interception | DM channel encrypts the token; plain channel tokens are bearer; anyone who decodes the message can claim them (warn user) |
| Fake token         | DLEQ proofs allow offline verification that token is valid blind signature                                                |
| Inflated amount    | Token self-describes amount; client validates against proofs                                                              |

### Wallet UX

- **Balance**: sum of all unspent Cashu proofs in local MMKV store
- **Receive**: display QR of Lightning invoice (via mint) or accept raw Cashu token
- **Send offline**: paste Cashu token into DM / channel
- **Send online**: NIP-61 nutzap to any Nostr pubkey
- **Redeem**: when internet available, swap held tokens at mint to refresh to non-double-spent state
- **No custodian**: mint is a minimal trust party; user's proofs are local

### Library

`@cashu/cashu-ts` v5 (MIT, 105 stars, actively maintained, TypeScript-first, ESM)

## 9. Privacy & Tor Integration

### Metadata minimization

- **No phone numbers, email, username registration**
- **No IP address exposed to relays** when Tor is active
- **NIP-17 gift-wrap** means DM metadata (who is talking to whom) is hidden from relay operators
- **BLE mesh**: local radio only; physical proximity required; no internet signature
- **Geolocation**: opt-in for geohash presence; never stored or transmitted without consent
- **Message ephemerality**: no plaintext ever written to disk; panic wipe destroys all keys

### Tor: Both Platforms

| Platform        | Tor Integration                                                                                                                        | Default               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| iOS             | **[Arti](https://gitlab.torproject.org/tpo/core/arti)** Rust xcframework (same as bitchat-ios), embedded in app binary                 | On by default         |
| Android Phase 1 | **[Orbot](https://guardianproject.info/apps/org.torproject.android/)** proxy detection: SOCKS5 on `localhost:9050` if Orbot is running | Optional, with prompt |
| Android Phase 2 | Embed `tor` binary in APK (legal, Tor Project permits)                                                                                 | On by default         |

Tor is used exclusively for **Nostr relay connections**. BLE traffic is radio-local and cannot be routed through Tor.

### Panic Wipe

Triggered by triple-tap on the logo (same as bitchat):

1. Immediately zeroize all private keys in memory
2. Delete all Keychain/Keystore entries
3. Clear all MMKV databases
4. Delete all files in app sandbox
5. Terminate app process

After panic wipe: fresh install state. No forensic recovery possible.

## 10. Security Threat Model

### Threats and countermeasures

| Threat                                            | Countermeasure                                                                         |
| ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Message forgery**                               | Ed25519 signature on every packet; invalid signatures dropped before relay             |
| **Identity impersonation**                        | Usernames deterministically derived from pubkey; name ≠ identity                       |
| **Replay attack**                                 | Packet includes timestamp + 8-byte random nonce; deduplicator rejects seen nonces      |
| **Man-in-the-middle (session)**                   | Noise XX mutual authentication; both parties sign their static keys into the handshake |
| **Traffic analysis (Nostr)**                      | NIP-17 gift-wrap hides sender, recipient, content from relay; Tor hides IP             |
| **Traffic analysis (BLE)**                        | Short ephemeral peer IDs rotate; payload encrypted; observer sees random bytes         |
| **Relay censorship**                              | 3–5 relays queried in parallel; any single relay failure is transparent                |
| **Sybil attack on mesh**                          | TTL limits propagation; signed announces prevent fake peer injection                   |
| **Key compromise (session)**                      | Noise XX perfect forward secrecy: past sessions safe even if static key leaked         |
| **Key compromise (stored DM)**                    | Double Ratchet: per-message keys; compromise of one message doesn't expose others      |
| **Malicious relay injecting messages**            | Message must be signed by claimed sender's private key; relay cannot forge             |
| **Malicious mesh peer relaying modified packets** | Full signature chain; any modification invalidates signature                           |
| **Cashu double-spend**                            | Mint enforces with blind signature tracking; receiver redeems promptly                 |
| **Physical device seizure**                       | Panic wipe (triple-tap); keys in Keychain (hardware-backed on modern devices)          |
| **Screen surveillance**                           | App background blurs sensitive content (standard iOS/Android API)                      |

### What Airhop does NOT protect against

- **Physical proximity**: BLE mesh reveals you are geographically near certain peers
- **Traffic timing correlation**: an observer watching multiple BLE radios could infer communication patterns
- **Compromised OS**: if the device OS is compromised, all security guarantees are void
- **Mint trust**: Cashu requires trusting the mint for token redemption; choose reputable mints

## 11. Native Module Architecture

### Why only one native module?

The BLE hardware requires native code. Everything else (routing, crypto, Nostr, payments) is pure TypeScript. This is a deliberate constraint: native code is harder to test, harder to keep consistent across platforms, and harder to reason about security-wise.

**One native module: `AirhopBLEModule`**

It does exactly four things:

1. Advertises as a BLE GATT Peripheral (makes the device visible)
2. Scans as a BLE GATT Central (discovers other devices)
3. Accepts incoming connections and routes raw bytes to TypeScript
4. Sends raw bytes from TypeScript to connected peers

It knows nothing about the protocol. It has no concept of packets, routing, or encryption. That logic lives in TypeScript where it's testable, consistent, and portable.

### The contract between native and TypeScript

The bridge spec lives in `src/bridge/`, and React Native Codegen turns it into
the native bridge for both platforms. It is deliberately tiny. TypeScript calls
down to do four things: start and stop advertising, start and stop scanning, and
write bytes to a connected link. Bytes cross the bridge base64-encoded, since
that is the only representation both runtimes agree on safely.

Native calls back up with four events: a packet arrived on a link, a link
connected, a link disconnected, and a signal-strength reading changed.

That is the whole surface. Anything richer would mean protocol knowledge on the
native side, which is the one thing this design exists to prevent.

### Background execution

| Platform       | Mechanism                                           | Result                               |
| -------------- | --------------------------------------------------- | ------------------------------------ |
| iOS Central    | `UIBackgroundModes: bluetooth-central`              | Receives BLE data in background      |
| iOS Peripheral | `UIBackgroundModes: bluetooth-peripheral`           | Continues advertising in background  |
| iOS Suspended  | `CBCentralManagerOptionRestoreIdentifierKey`        | iOS restarts app on BLE event        |
| Android        | `AirhopForegroundService` (persistent notification) | Survives Doze + battery optimization |
| Android        | `FOREGROUND_SERVICE_CONNECTED_DEVICE` permission    | Required Android 14+                 |

## 12. Protocol Decision Log

Each decision records what was considered, what was chosen, and why.

### Why Nostr and not Matrix/XMPP/Signal?

| Protocol            | Verdict         | Reason                                                                                                                                                                    |
| ------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Matrix**          | ❌              | Requires homeserver. Single homeserver = single point of failure. Federated but not truly serverless.                                                                     |
| **XMPP**            | ❌              | Same: requires always-on server. Complex extension ecosystem. Limited offline story.                                                                                      |
| **Signal Protocol** | ❌ (as network) | Signal the company owns the relay infrastructure. Requires phone number. Not permissionless.                                                                              |
| **SimpleX**         | ✅ Close second | No persistent identifiers, privacy-first. But no BLE mesh story, smaller ecosystem, fewer relays.                                                                         |
| **Nostr**           | ✅ Chosen       | Permissionless keypair identity. 350+ independent relays. Active ecosystem. NIP-17 gift-wrap for private DMs. NIP-61 for payments. bitchat already validated this choice. |

### Why Noise XX and not TLS/Signal's X3DH?

- **TLS**: requires CAs, server certificates; antithetical to a serverless system
- **Signal's X3DH alone**: does not provide mutual authentication (receiver doesn't auth sender in the handshake)
- **Noise XX**: mutual authentication, perfect forward secrecy, no CAs, proven in WireGuard; bitchat already battle-tested this choice

### Why Cashu and not Lightning-only?

- Lightning requires internet for payment execution (payment routing requires network)
- Cashu tokens are strings that can flow over BLE like any message
- Token transfer is fully offline; redemption happens later when internet is available
- `CashuTokenDecoderTests.swift` in bitchat shows this was already being explored
- NIP-61 (Nutzaps) integrates Cashu with Nostr identity for online zaps

### Why Double Ratchet in addition to Noise XX?

- Noise XX provides perfect forward secrecy _per session_; if you reconnect, a new session key is derived
- But Noise XX does not provide _per-message_ forward secrecy within a session
- Double Ratchet (Signal's algorithm) provides per-message key rotation; compromise of one message's key doesn't expose adjacent messages
- This also handles offline mail: even when Bob is offline, a DR-ratcheted message can be sent via courier and forward secrecy is maintained

## 13. Dependency Manifest

### Core (required from day 1)

| Package                          | Version | Purpose                                                          | License |
| -------------------------------- | ------- | ---------------------------------------------------------------- | ------- |
| `@noble/curves`                  | `^2.2`  | X25519, Ed25519 (Noise XX, signing)                              | MIT     |
| `@noble/ciphers`                 | `^2.2`  | ChaCha20-Poly1305 (Noise, Nostr NIP-44                           | MIT     |
| `@noble/hashes`                  | `^2.2`  | SHA-256, HKDF, HMAC                                              | MIT     |
| `react-native-get-random-values` | `^2.0`  | Polyfill `crypto.getRandomValues` for @noble (requires RN ≥0.81) | MIT     |
| `nostr-tools`                    | `^2.23` | Nostr client, NIP-17/59 gift-wrap                                | MIT     |
| `react-native-encrypted-storage` | `^4.0`  | Private key storage (Keychain/Keystore)                          | MIT     |
| `react-native-mmkv`              | `^4.3`  | Fast JSI key-value store (requires `react-native-nitro-modules`) | MIT     |
| `react-native-nitro-modules`     | `^0.36` | Peer dep for react-native-mmkv v4                                | MIT     |
| `zustand`                        | `^5.x`  | State management                                                 | MIT     |

### BLE / Transport (required from day 1)

| Package                  | Version  | Purpose                   | License |
| ------------------------ | -------- | ------------------------- | ------- |
| Custom `AirhopBLEModule` | internal | BLE GATT Server + Central | N/A     |

### Media / Voice (Phase 2)

| Package                      | Version | Purpose                             | License |
| ---------------------------- | ------- | ----------------------------------- | ------- |
| `react-native-audio-record`  | `^0.2`  | PTT audio capture (AAC 16kHz)       | MIT     |
| `react-native-sound`         | `^0.13` | Voice note and PTT playback         | MIT     |
| `react-native-fs`            | `^2.20` | File system access for media        | MIT     |
| `react-native-vision-camera` | `^5.1`  | Video frame capture (Phase 3, HEVC) | MIT     |

### Payments (Phase 2)

| Package           | Version | Purpose                       | License |
| ----------------- | ------- | ----------------------------- | ------- |
| `@cashu/cashu-ts` | `^4.7`  | Cashu ecash wallet operations | MIT     |

### UX / Polish (Phase 1+)

| Package                    | Version          | Purpose                         | License |
| -------------------------- | ---------------- | ------------------------------- | ------- |
| `@react-navigation/native` | `^7.x`           | Screen navigation, deep links   | MIT     |
| `react-native-reanimated`  | `^4.x`           | Hardware-accelerated animations | MIT     |
| `nativewind`               | `^4.x`           | Tailwind CSS for React Native   | MIT     |
| `react-native-camera`      | via VisionCamera | QR code scanning                | MIT     |

### Build toolchain

| Tool                               | Version  | Purpose                                        |
| ---------------------------------- | -------- | ---------------------------------------------- |
| `expo`                             | `SDK 57` | Bare workflow, EAS Build, config plugins       |
| `react`                            | `^19.2`  | Required by React Native 0.86 (peer dep)       |
| `react-native`                     | `^0.86`  | New Architecture (default since 0.76)          |
| `typescript`                       | `^7.0`   | Strict mode, no `baseUrl`, `./`-prefixed paths |
| `tailwindcss`                      | `^3.4`   | v3 required by NativeWind v4 (v4 incompatible) |
| `jest`                             | `^29`    | Unit tests for all `src/core/`                 |
| `prettier`                         | `^3.9`   | Formatting                                     |
| `prettier-plugin-tailwindcss`      | `^0.8`   | Auto-sort NativeWind class names               |
| `prettier-plugin-organize-imports` | `^4.3`   | Auto-sort import blocks                        |

_ARCHITECTURE.md is the ground truth for implementation decisions. Cross-reference ROADMAP.md for phased timeline and ROADMAP.md Gap Analysis for competitive differentiation. All protocol decisions above are final unless explicitly revisited with evidence._
