# Airhop: Vision & Principles

> Read this first. Everything else in `docs/` follows from it.

## What Is Airhop

Airhop is a **cross-platform (iOS + Android) React Native application** for private, offline-first, peer-to-peer communication over a Bluetooth mesh, with Nostr for internet bridging and Cashu for offline ecash payments.

It is a **spiritual fork of bitchat** ([permissionlesstech/bitchat](https://github.com/permissionlesstech/bitchat)). We share bitchat's BLE wire protocol, service UUIDs, security model, and Nostr transport. We are not competitors. We are builders on the same open foundation, extending it with:

- One TypeScript codebase in place of two native apps that drift apart and break cross-platform compat
- Two WiFi transports beside Bluetooth: WiFi Aware as the same-platform fast path, and LAN over mDNS and TCP, which carries the mesh between an iPhone and an Android as no direct-WiFi stack can
- A full Cashu wallet, not a token decoder: balances, mints, Lightning in and out, and value moving device to device with no internet
- Double Ratchet on live DMs, and one-time prekeys for mail left with a courier, so waiting mail survives a key leaking later
- Video that plays inline; bitchat carries it across the wire but opens it on neither platform
- An interface built for people who are not us, in 35 languages, with QR contact exchange and names derived from keys

The full comparison is in [`ROADMAP.md`](ROADMAP.md), section 1.

## Core Principles

These do not change under schedule pressure or feature requests.

1. **Security first.** Every design decision passes a security lens before a product lens. If it can't be done securely, it doesn't ship.

2. **Offline first.** Every feature must work with zero internet connectivity. Internet bridges _enhance_ the experience; they never _enable_ it.

3. **No accounts, ever.** Identity is a cryptographic key pair generated on-device and stored in OS Keychain. Nothing registers anywhere. There is no "create account" screen.

4. **No central server.** No infrastructure to seize. No company to subpoena. No service to shut down. If Airhop's servers were seized tomorrow, the app would still work.

5. **Nothing to hand over.** Message content exists only on the devices in the conversation. No server copy, so no account to subpoena and no backup to compel. Keys live in the Keychain, never beside the history. Panic wipe destroys every key, message and cached file in under one second.

6. **bitchat wire compatibility.** Airhop nodes must communicate with bitchat nodes. The BLE packet wire format, service UUIDs, and peer ID derivation algorithm are fixed. Breaking this requires a protocol version bump and explicit compat testing.

7. **Protocol compliance over clever shortcuts.** When in doubt, do what bitchat does. The bitchat team are smart engineers who made deliberate choices.

## Features in Practice

What each feature is for, and when someone would actually reach for it.

### Messaging

- Private DMs. One to one, encrypted end to end, with delivery and read receipts. You message a friend across a festival ground with no signal and it hops through other people's phones to reach them.
- Private groups. A fixed roster the creator signs, up to 16. There is no link to forward, so nobody joins by accident. Your four friends at that march, rather than the whole crowd.
- Private channels. An invite-only room where the key rides inside the invite link, so anyone you send it to can read. No member cap. Put a QR on a flyer and a few hundred people join through the day.
- Public channels. Open rooms anyone nearby can join. `#bluetooth` stays inside Bluetooth range.
- Location channels. Rooms scoped to a cell, from a block to a region, bridged over the internet, so `#city` works when you are the only person on your street with the app. Open any cell by its geohash to follow a place you are not in.
- Bulletin board. Signed notices that outlive a conversation, pinned to your mesh or your area for one to seven days, with an urgent flag. "Water station at the south entrance," left for whoever walks past an hour later.

### Sharing

- Photos and video. Both open in the chat where they land, with no download step.
- Voice notes. Recorded audio, faster than typing directions.
- Live voice. Hold the mic and talk to everyone in range, walkie-talkie style. Hands stay on what you are doing.
- File transfer. Up to 1 MiB, bitchat's limit and about 56 seconds over Bluetooth, from an allow-list of everyday formats.
- Store-and-forward courier. When nothing can reach the recipient now, a nearby phone carries the sealed message and hands it over when they eventually meet. The carrier cannot read it, and media never travels this way.

### Identity

- No account. Your identity is a key pair made on the phone. Nothing registers anywhere, so there is nothing to seize or subpoena.
- Human-readable names. Your key decides your name, so nobody can take someone else's.
- QR contacts. A scanned card carries public keys, and the peer ID is checked against them before anything is trusted. A card arriving by `airhop://` link is recorded as unverified; only an in-person scan counts.
- End-to-end encryption. Live sessions use Noise XX. Nobody in the middle, including relaying phones, can read a private message.
- Forward secrecy. Double Ratchet for live chats, and single-use prekeys for mail left with a courier, so an old message stays protected even if a key leaks later.
- Panic wipe. The panic button on the Profile screen, triple-tapped to skip the confirmation, and every key, message, group, notice and prekey is gone in under a second.

### Networking

- Bluetooth mesh. The part that works when nothing else does. No towers, no router, no bill.
- Multi-hop routing. Messages relay through up to seven phones, so two people who cannot see each other still connect through the strangers between them.
- WiFi fast path. Two Androids, or two iPhones, move large files over a direct WiFi link, steadier than Bluetooth and leaving the radio free. It never crosses platforms.
- Local network. On one shared WiFi, an iPhone and an Android carry the whole mesh straight to each other. Off until you turn it on, since joining announces you to everyone else on the network.
- Relay nodes. Bitle hardware speaks the same protocol as a phone, so a fixed node holds a mesh open where nobody is standing.
- bitchat compatibility. An Airhop phone and a bitchat phone join the same mesh and talk with no setup. bitchat ignores Airhop's own additions instead of breaking on them.

### Internet

- Nostr bridge. Picks up where Bluetooth range ends, without a server we own.
- Geo-relay discovery. Location channels pick relays near that place, so people in one city converge on the same ones.
- Mesh bridge. Joins your local `#bluetooth` room to another crowd too far away to reach by radio.
- Internet gateway. Off by default. Turn it on and your phone carries public location traffic for nearby people who have no connection of their own.
- Tor. Built in on both platforms, with nothing else to install. Every relay connection is dialled through it, so operators never see your IP and switching it on never leaves traffic in the clear.

### Optional

- Cashu ecash. Send value device to device with no internet and no payment company. Settle a shared bill in a dead zone; the recipient redeems whenever they are back online.
- Lightning. Top up and cash out through a mint you pick, the only part of the wallet that needs a connection.
- Nutzaps. Pay a Nostr identity in ecash when you do have a connection, locked to their key so only they can spend it.
- Wallet recovery. Off by default. Turn it on and twelve words rebuild your balance on a new phone.
- Local assistant. On-device inference. Questions answered with nothing leaving the phone.
- AT Protocol and ActivityPub. Opt-in bridges to Bluesky and Mastodon on the same Airhop identity.

## What We Are Not Building

- **A video call app.** Bluetooth is far too slow at ~18 KiB/s, WiFi Aware does not cross platforms, and LAN needs both people on one network with it switched on. Video is shared as files instead.
- **A server.** We operate no relays, mints, or infrastructure. Ever.
- **A centralized social network.** No profiles hosted on our servers. No search index we control.
- **A KYC product.** No phone number. No email. No government ID.
- **A moderated platform.** Moderation is strictly client-side (mute/block lists). We cannot and will not moderate content at the protocol level.
- **An analytics product.** No crash reporting to our servers. No usage analytics. No tracking.

## What Success Looks Like

- An Airhop node and a bitchat node find each other over Bluetooth and exchange messages with no configuration
- A message crosses five hops of strangers' phones in a city with no internet
- An iPhone and an Android carry the mesh to each other over a shared WiFi network, with the Bluetooth radio idle
- Live voice stays intelligible across a three-device relay chain
- 500 sats reach a contact with no connection on either phone, and redeem when one of them is back online
- Someone who has never heard of Noise or Nostr installs it and sends a message, in their own language, without being taught
- Noise XX and Double Ratchet pass an independent audit, and the report is published in full
- Someone in a blackout, a protest, or a disaster reaches the person they were looking for
