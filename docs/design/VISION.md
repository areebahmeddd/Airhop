# Airhop: Vision & Principles

> Read this first. Everything else in `docs/` follows from it.

## What Is Airhop

Airhop is a **cross-platform (iOS + Android) React Native application** for private, offline-first, peer-to-peer communication over Bluetooth mesh networks, with internet bridging via Nostr and offline ecash payments via Cashu.

It is a **spiritual fork of bitchat** ([permissionlesstech/bitchat](https://github.com/permissionlesstech/bitchat)). We share bitchat's BLE wire protocol, service UUIDs, security model, and Nostr transport. We are not competitors. We are builders on the same open foundation, extending it with:

- A single TypeScript codebase (vs. two diverging native apps that regularly break cross-platform compat)
- Live PTT voice from day 1 (designed but never shipped in bitchat)
- Cashu ecash payments that work offline over BLE
- Double Ratchet forward secrecy for all stored messages
- WiFi Aware / Multipeer transport for high-bandwidth use cases (video, large files)
- Tor on both iOS and Android (bitchat iOS only)
- Human-readable identities and QR contact exchange

## Core Principles

These do not change under schedule pressure or feature requests.

1. **Security first.** Every design decision passes a security lens before a product lens. If it can't be done securely, it doesn't ship.

2. **Offline first.** Every feature must work with zero internet connectivity. Internet bridges _enhance_ the experience; it never _enables_ it.

3. **No accounts, ever.** Identity is a cryptographic key pair generated on-device and stored in OS Keychain. Nothing registers anywhere. There is no "create account" screen.

4. **No central server.** No infrastructure to seize. No company to subpoena. No service to shut down. If Airhop's servers were seized tomorrow, the app would still work.

5. **Ephemerality by default.** No plaintext message content ever touches disk. Panic wipe (triple-tap logo) destroys all keys and data in under one second.

6. **bitchat wire compatibility.** Airhop nodes must communicate with bitchat nodes. The BLE packet wire format, service UUIDs, and peer ID derivation algorithm are fixed. Breaking this requires a protocol version bump and explicit compat testing.

7. **Protocol compliance over clever shortcuts.** When in doubt, do what bitchat does. The bitchat team are smart engineers who made deliberate choices.

## Build Order Philosophy

```
1. src/core/       ← crypto, BLE mesh routing, Nostr, payments (pure TypeScript)
2. Native modules  ← AirhopBLEModule (Swift + Kotlin), the only native code
3. src/features/   ← screen-level logic consuming core services
4. src/ui/         ← visual design, theming, polish
```

**UI is always last.** A beautiful app that can't relay a BLE packet is useless. An ugly app that correctly implements Noise XX and gossip sync is the working prototype.

Do not open a PR for a UI component until the underlying `src/core/` service backing it has unit tests passing.

## What We Are Not Building

- **A video call app over BLE.** BLE bandwidth (~15 KB/s) cannot carry video. Video is WiFi Aware only, Phase 3, not core.
- **A server.** We operate no relays, mints, or infrastructure. Ever.
- **A centralized social network.** No profiles hosted on our servers. No search index we control.
- **A KYC product.** No phone number. No email. No government ID.
- **A moderated platform.** Moderation is strictly client-side (mute/block lists). We cannot and will not moderate content at the protocol level.
- **An analytics product.** No crash reporting to our servers. No usage analytics. No tracking.

## What Success Looks Like

- An Airhop node and a bitchat node discover each other over BLE and exchange messages without any configuration
- A message sent in a city with no internet travels 5 hops across a mesh of strangers' phones
- A user sends 500 sats to a contact with no internet connection; the contact redeems them when back online
- Live PTT voice works clearly across a 3-device BLE relay chain
- The cryptographic implementation (Noise XX + Double Ratchet) passes an independent security audit
- Both iOS and Android ship the same features, with the same behavior, on the same day
