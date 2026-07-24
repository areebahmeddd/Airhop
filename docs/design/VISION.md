# Airhop: Vision & Principles

> Read this first. Everything else in `docs/` follows from it.

## What Is Airhop

Airhop is a **cross-platform (iOS + Android) React Native application** for private, offline-first, peer-to-peer communication over Bluetooth mesh networks, with internet bridging via Nostr and offline ecash payments via Cashu.

It is a **spiritual fork of bitchat** ([permissionlesstech/bitchat](https://github.com/permissionlesstech/bitchat)). We share bitchat's BLE wire protocol, service UUIDs, security model, and Nostr transport. We are not competitors. We are builders on the same open foundation, extending it with:

- A single TypeScript codebase (vs. two diverging native apps that regularly break cross-platform compat)
- Live PTT voice from day 1 (designed but never shipped in bitchat _at the time of writing_)
- Cashu ecash payments that work offline over BLE
- Double Ratchet forward secrecy for all stored messages
- Same-platform WiFi transport for high-bandwidth use cases (large files). Android uses WiFi Aware, iOS uses MultipeerConnectivity. These are different protocols and do not interoperate, so this is a within-Android or within-iOS fast path only. Bluetooth remains the universal transport.
- Tor on both iOS and Android (bitchat iOS only _at the time of writing_)
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

## Features in Practice

What each feature is for, and when someone would actually reach for it.

### Messaging

- Private DMs. One to one, encrypted end to end, with delivery and read receipts. You message a friend across a festival ground with no signal and it hops through other people's phones to reach them.
- Public channels. Open rooms anyone nearby can join. `#bluetooth` stays inside Bluetooth range. `#block` through `#region` widen to a geographic cell and also travel over the internet, so `#city` still works when you are the only person on your street with the app.
- Jump to a place. Open the location channel for anywhere by its geohash, even a city you are not in. You show as teleported rather than nearby, and it reaches over the internet only. Scout a spot before you arrive, or follow an area from afar.
- Private channels. An invite-only room where the key rides inside the invite link, so anyone you send the link to can read. No member cap. Put a QR on a flyer for a march and a few hundred people join through the day.
- Private groups. A fixed list of people the creator signs, up to 16. There is no link to forward, so nobody joins by accident. Your four friends at that same march, rather than the whole crowd.
- Bulletin board. Signed notices that outlive a conversation, pinned to your mesh or your area for one to seven days, with an urgent flag. "Water station at the south entrance," left for whoever walks past an hour later.
- Voice notes. Recorded audio sent as a file, faster than typing directions.
- Video sharing. Recorded clips that play inline. There is no live video, because the two platforms' direct-WiFi stacks cannot talk to each other.
- File transfer. Any format, up to 1 MB, which is bitchat's limit and takes about 45 seconds over Bluetooth. A photo of a road closure.
- Store-and-forward courier. When nothing can reach the recipient now, a nearby phone carries the sealed message and hands it over when they eventually meet. The carrier cannot read it.

### Identity

- No account. Your identity is a key pair made on the phone. Nothing registers anywhere, so there is nothing to seize or subpoena.
- Human-readable names. Derived from your public key rather than chosen, so nobody can take someone else's name.
- QR contacts. Scanning a card carries public keys, not just a name, and the peer ID is verified against them before anything is trusted.
- End-to-end encryption. Live sessions use Noise XX. Nobody in the middle, including relaying phones, can read a private message.
- Forward secrecy. Double Ratchet for live chats, and single-use prekeys for messages left for someone offline, so an old message stays protected even if a key leaks later.
- Panic wipe. Triple-tap the logo and every key, message, group, notice and prekey is gone in under a second.

### Networking

- Bluetooth mesh. The part that works when nothing else does. No towers, no router, no bill.
- Multi-hop routing. Messages relay through up to seven phones, so two people who cannot see each other still connect through the strangers between them.
- WiFi fast path. Two Androids, or two iPhones, move large files faster. It never crosses platforms, so Bluetooth stays the universal path.
- bitchat compatibility. An Airhop phone and a bitchat phone join the same mesh and talk with no setup. Airhop's own additions are ignored by bitchat rather than breaking it.

### Internet

- Nostr bridge. Picks up where Bluetooth range ends, without a server we own.
- Geo-relay discovery. Location channels pick relays near that place, so people in one city converge on the same ones.
- Internet gateway. Off by default. Turn it on and your phone carries public location traffic for nearby people who have no connection of their own.
- Tor. Routes Nostr traffic so relay operators never see your IP.

### Optional

- Cashu ecash. Send value device to device with no internet and no payment company. Settle a shared bill in a dead zone; the recipient redeems whenever they are back online.
- Nutzaps. Lightning payments over Nostr when you do have a connection.
- Local assistant. On-device inference. Questions answered with nothing leaving the phone.
- AT Protocol. Opt-in bridge to Bluesky using the same Airhop identity.
- ActivityPub. Opt-in bridge to Mastodon, same identity.

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

- **A video call app.** BLE bandwidth (~15 KB/s) cannot carry live video, and the two platforms' direct-WiFi stacks do not interoperate, so cross-platform video calling is not achievable today. Videos are shared as files instead.
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
- Censorship-resistant communication is available to anyone, anywhere: during natural disasters, internet blackouts, mass protests, or any situation where networks are unavailable, surveilled, or shut down
