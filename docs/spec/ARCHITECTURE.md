# Airhop: Architecture

## Full Stack: Every Layer, Every Decision

**Date:** July 12, 2026  
**Cross-referenced against:** [ROADMAP.md](../design/ROADMAP.md), bitchat/ios, bitchat/android, bitchat/georelays  
**Security stance:** Security-first from day 0. No compromises. No exceptions.

## Table of Contents

1. [Core Feature Matrix](#1-core-feature-matrix)
2. [Identity: No Accounts, Ever](#2-identity-no-accounts-ever)
3. [Adaptive Transport Stack](#3-adaptive-transport-stack)
4. [Messaging Protocol](#4-messaging-protocol)
5. [Encryption Architecture](#5-encryption-architecture)
6. [Groups & Channels](#6-groups--channels)
7. [Payments: Offline-First Ecash](#7-payments-offline-first-ecash)
8. [Localization](#8-localization)
9. [Privacy & Tor Integration](#9-privacy--tor-integration)
10. [Security Threat Model](#10-security-threat-model)
11. [Project Folder Structure](#11-project-folder-structure)
12. [Native Module Architecture](#12-native-module-architecture)
13. [Protocol Decision Log](#13-protocol-decision-log)
14. [Dependency Manifest](#14-dependency-manifest)

## 1. Core Feature Matrix

| Feature                   | Offline (BLE)            | Online (Nostr)      | Notes                                                                                                                                          |
| ------------------------- | ------------------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Peer discovery            | Yes, announce broadcasts | Yes, kind 20001     | Peers show on the mesh radar and in the location cell                                                                                          |
| Public channels           | Yes, TTL flood           | Yes, kind 20000     | `#bluetooth` stays local; `#block` to `#region` also bridge                                                                                    |
| Private channels          | Yes, sealed `0x2a`       | Optional, same blob | Airhop only. Key rides an invite link, no member cap                                                                                           |
| Private groups            | Yes, sealed `0x25`       | No                  | bitchat compatible. Creator-signed roster, max 16, Bluetooth only                                                                              |
| Private DMs               | Yes, Noise XX (+DR)      | Yes, NIP-17 wrap    | Receipts on every path. DR only between Airhop peers                                                                                           |
| Bulletin board            | Yes, signed `0x23`       | Yes, kind 1 mirror  | Public and signed, 1 to 7 day expiry, gossip catch-up                                                                                          |
| Voice notes               | Yes, as a file           | No                  | Recorded AAC, not live                                                                                                                         |
| Video sharing             | Yes, as a file           | No                  | Recorded and played inline. Live streaming is not possible across platforms                                                                    |
| File transfer             | Yes, per-type caps       | No                  | 512 KiB photos and voice, 1 MiB otherwise. Enforced by bitchat's decoder, so not ours to raise                                                 |
| Store-and-forward courier | Yes, sealed envelope     | Yes, parked drop    | 24 hour life, as bitchat carriers enforce. Sealed to a one-time prekey for forward secrecy                                                     |
| Live push-to-talk         | Yes, `0x29` bursts       | No                  | AAC-LC 16 kHz mono, 350 ms jitter buffer. Also shipped by bitchat, so it works between the two                                                 |
| Payments (Cashu)          | Yes, token in a message  | Yes, NIP-61 Nutzap  | Transfer works offline, redemption needs internet                                                                                              |
| Contact verification      | Yes, QR exchange         | n/a                 | The card carries public keys, checked against the noise key. Source is `qr`, `link` or `manual`; only an in-person camera scan may re-pin keys |
| Panic wipe                | Yes                      | Yes                 | Panic button on Profile. Destroys keys, messages, groups, board, prekeys                                                                       |
| Internet gateway          | Relays for others        | Yes                 | Off by default. Carries public location traffic for offline peers                                                                              |
| Tor routing               | n/a                      | Yes                 | Arti on iOS, Orbot on Android. BLE is local, so nothing to route                                                                               |
| Relay discovery           | n/a                      | Yes                 | Bundled CSV, refreshed from the georelays repo                                                                                                 |
| bitchat compatibility     | Yes                      | Yes                 | Same wire format both directions. Airhop-only types are simply ignored                                                                         |

Optional, shipped but switchable:

| Feature         | Needs internet | Notes                                               |
| --------------- | -------------- | --------------------------------------------------- |
| Cashu ecash     | Only to redeem | Tokens move device to device over the mesh          |
| Nutzaps         | Yes            | NIP-61 ecash locked to the recipient key            |
| Local assistant | No             | On-device inference, nothing leaves the phone       |
| AT Protocol     | Yes            | Opt-in bridge to Bluesky using the Airhop identity  |
| ActivityPub     | Yes            | Opt-in bridge to Mastodon using the Airhop identity |

## 2. Identity: No Accounts, Ever

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
- Receivers drop unsigned or invalid-signature packets before displaying or acting on them. Relaying is deliberately separate: a node forwards opaque bytes it may not be able to verify (it may not hold the sender's key yet), and the flood router runs before per-type verification
- Name collisions are impossible: the name is derived from the public key

### Key storage

| Secret               | Storage                          | Backed by                         |
| -------------------- | -------------------------------- | --------------------------------- |
| `noiseStaticPrivKey` | `react-native-encrypted-storage` | iOS Keychain / Android Keystore   |
| `signingPrivKey`     | `react-native-encrypted-storage` | iOS Keychain / Android Keystore   |
| Wallet AES-256 key   | `react-native-encrypted-storage` | iOS Keychain / Android Keystore   |
| Nutzap P2PK privkey  | `react-native-encrypted-storage` | iOS Keychain / Android Keystore   |
| Recovery phrase      | `react-native-encrypted-storage` | iOS Keychain / Android Keystore   |
| Cashu proofs         | `react-native-mmkv` (AES-256)    | File encrypted with the key above |
| Active sessions      | `react-native-mmkv` (encrypted)  | RAM-backed, not persisted         |
| Message history      | `react-native-mmkv`              | Encrypted at rest, panic-wipeable |

Cashu proofs are bearer instruments, so `wallet-store` is the one MMKV partition
opened with an explicit `encryptionKey`. The key is 24 random bytes, base64 (32
ASCII characters, the AES-256 maximum), generated on first run and held in the
Keychain/Keystore. Because the key is fetched asynchronously, the store cannot
exist at module scope: `bootstrapWalletStorage()` opens it and every
`zustand/persist` read and write awaits that promise. If the Keychain refuses,
the store is **not** opened unencrypted; the wallet reports itself locked and no
proof is ever written to plaintext disk.

The panic wipe deletes this partition with `deleteMMKV` rather than `clearAll`,
since the file cannot be reliably reopened without its key, and the key itself
is destroyed by the same wipe that clears the Keychain.

## 3. Adaptive Transport Stack

Airhop routes messages through the best available transport **automatically, without user involvement.** The user sees one interface regardless of which radio is carrying their message.

```
MessageRouter.ts - transport selection logic

Priority order:
1. WiFi Aware/Direct - if both parties have it active and are in range (~30m, 250Mbps)
2. BLE Mesh          - if the recipient is nearby (confirmed by announce)
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
- **Tor is off by default on both platforms**; one toggle turns it on (Arti on iOS, Orbot on Android)
- **No single relay dependency**: `SimplePool` connects to 3–5 relays simultaneously; first ACK wins

### Radio Power Policy (Android)

BLE scanning is the single largest battery cost in the app. A continuous
`SCAN_MODE_LOW_LATENCY` scan is roughly an order of magnitude more expensive
than `SCAN_MODE_LOW_POWER`, and Airhop's whole purpose is to run in a pocket all
day. So the radios do not run at one fixed effort: they scale with what the
device can afford.

**Policy lives in TypeScript, mechanism lives in Kotlin.** `services/power-policy.ts`
is a pure function of four facts; the native module observes the battery, reports
it, and applies whichever mode it is told. Nothing decides anything on the native
side. This keeps the decision unit-testable without a device, and puts "how hard
to run the radios" next to "whether to run them at all", which
`services/radio-controller.ts` already owns.

**Battery bands** match bitchat-android's `AppConstants.Power`: critical at
`≤10%`, low at `≤20%`.

| Mode              | Scan          | Advertise     | TX power    | RSSI poll | Duty cycle      |
| ----------------- | ------------- | ------------- | ----------- | --------- | --------------- |
| `performance`     | `LOW_LATENCY` | `LOW_LATENCY` | `HIGH`      | 5s        | continuous      |
| `balanced`        | `BALANCED`    | `BALANCED`    | `MEDIUM`    | 10s       | continuous      |
| `power-saver`     | `LOW_POWER`   | `LOW_POWER`   | `LOW`       | 30s       | 2s on / 28s off |
| `ultra-low-power` | `LOW_POWER`   | `LOW_POWER`   | `ULTRA_LOW` | 60s       | 1s on / 29s off |

**Selection order** is identical to bitchat's `PowerProfileResolver`, and the
order _is_ the policy:

1. **Backgrounded** → `power-saver`, or `ultra-low-power` on a critical battery.
   Off screen nobody is waiting on discovery latency, and this is where a phone
   spends nearly all of its day.
2. **Charging** (foreground) → `performance`. The cost is someone else's.
3. Otherwise the **battery band** decides: critical → `ultra-low-power`,
   low → `power-saver`, else → `balanced`.

Foreground on battery is `balanced` rather than `performance` on purpose: a
balanced scan still finds peers in seconds, and reserving the most expensive
setting for "plugged in" is what keeps the app from being the reason a phone dies.

> [!NOTE]
> The five knobs move together deliberately. A duty-cycled `LOW_POWER` scan
> beside a `LOW_LATENCY` advertise at full TX power saves almost nothing, because
> the advertiser is transmitting continuously either way.

**Hysteresis** is Airhop's addition. bitchat re-resolves on every
`ACTION_BATTERY_CHANGED`, which fires per 1%; a phone hovering at a threshold
would flip modes repeatedly, and every flip restarts the scanner. Dropping into a
lower band is immediate (running hard on a nearly flat phone is the failure that
matters); climbing back out needs `+3%`.

**The duty cycle is invisible above the native boundary.** JS asks for
"scanning" and keeps getting it; native decides the rate. A burst ending is
never reported as an adapter or link change, because the reconciler would
otherwise try to "fix" a state that is working as intended.

**UI.** When the app is in the foreground on a low battery, peers can take up to
half a minute to appear. That is indistinguishable from a broken mesh unless it
is said out loud, so the Mesh tab shows a muted `Battery saver · scanning less
often` note. No button (charging is the fix) and not dismissible (it clears
itself). It is deliberately silent while backgrounded: a slower scan nobody is
waiting on is not worth a banner.

> [!IMPORTANT]
> iOS is a declared no-op. CoreBluetooth exposes no scan-rate control and
> already throttles background BLE aggressively on the app's behalf. The
> `setPowerMode` method exists on both platforms so the shared reconciler has one
> code path rather than a platform branch, and `getRadioState` reports
> `batteryPercent: -1` there, which the policy reads as "unknown" and leaves the
> mode alone.

## 4. Messaging Protocol

### Wire format (bitchat v2, binary)

Airhop is **100% wire-compatible with bitchat**. Airhop nodes appear as normal peers to bitchat devices on the mesh. Unknown packet types (Airhop extensions) are silently dropped by bitchat. No disruption.

> **See [`docs/spec/PROTOCOLS.md`](../spec/PROTOCOLS.md) for the complete byte layout (section 2), packet type registry (section 3), routing constants (section 4), and all other protocol constants.**

### Routing logic

Public channel messages: **TTL flood**, every peer re-broadcasts with TTL decremented  
Direct messages: **flood with recipientID**, only recipient decrypts; others relay until TTL=0  
Courier envelopes: **spray-and-wait**, trusted peers carry sealed blobs for offline recipients

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
Root key seeded from: the Noise XX exporter secret, no extra round trips
```

Used for all DMs stored in the courier / offline outbox:

- **Per-message forward secrecy**: compromise of message N does not expose messages N-1 or N+1
- **Break-in recovery**: if an attacker learns current keys, future messages are still protected after a few ratchet steps
- Prekey bundles: one-time public prekeys are signed and gossiped over the mesh as `0x24`, never published to Nostr. A sender seals courier mail to one of them, so an undelivered message stays protected even if the recipient's long-lived key leaks later. X3DH is not used: the Noise handshake already seeds the ratchet, which made a separate key agreement redundant.

  The seed is the handshake's **exporter secret**: a third HKDF output of `split()`, alongside the two transport keys, descending from the Noise chaining key. Both sides already hold it, so it still costs no extra round trips, and because the chaining key absorbs the ephemeral DH outputs (whose private halves are destroyed when the handshake splits) it cannot be reconstructed from long-term keys either. It must NOT be the transcript hash: `mixHash` absorbs only bytes that went over the wire, so that hash is public to anyone who captured the handshake, and handshakes flood the mesh at TTL 7. Nor a static-static ECDH, which would be derivable forever from long-term keys alone

### Packet Signing: [Ed25519](https://ed25519.cr.yp.to/)

Every packet carries an Ed25519 signature from the sender:

- Signed before transmission, verified before display or action
- Signature covers all packet fields except TTL and signature itself
- **Bounds replay**: the packet carries a millisecond timestamp, and the deduplicator rejects any packet ID it has already seen. There is no nonce field. Where staleness is itself the attack, a freshness window backs this up (announces 15 min, live voice 30 s), because the deduplicator is per-device and cannot speak for a phone that never heard the original

### Summary

```
Live DM session:      Noise XX (mutual auth, perfect forward secrecy per session)
Stored DM:            Double Ratchet (per-message forward secrecy)
Public channel:       Plaintext + Ed25519 signature (public, readable by all peers)
Courier envelope:     Noise X (one-way seal to recipient's static key) wrapping DR ciphertext
Nostr DM:             NIP-44 encryption (XChaCha20-Poly1305, versioned) + NIP-17 gift-wrap
```

## 6. Groups & Channels

### Mesh Channels (offline-first)

Channels are prefixed with `#`, same as bitchat. They are **not** registered anywhere. Anyone who broadcasts on `#channel-name` participates.

- Fully offline: no server, no registration
- History: 6-hour public message window (gossip sync reconciles on connect)
- Channel discovery: a channel exists as soon as someone broadcasts on it; there is no membership advertisement
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
- A group also pins the `creatorFingerprint` it was created with, and a state
  naming a different creator is refused even at a higher epoch

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

A teleported cell is the exception: when the user opens a location channel by
its geohash rather than by being there, nobody in Bluetooth range is in it, so
it runs over Nostr only. Its messages carry a `t=teleport` tag, so bitchat lists
the sender as teleported rather than nearby.

## 7. Payments: Offline-First Ecash

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
4. Recipient's client swaps token into their wallet, and refuses outright if the
   event names a mint the wallet does not already hold
5. Transaction history is stored locally in `wallet-store`; Airhop does not publish NIP-60 events

### Payment security model

| Attack              | Mitigation                                                                                                                                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Double-spend        | The mint is the only authority. A proof received offline is stored as **unverified** and is not claimed to be confirmed; `refreshAccount` runs a NUT-07 state check and swaps, and anything the mint reports as spent is removed from the balance rather than shown as money |
| Fake token          | NUT-12 DLEQ verification against the mint's cached public keys, on every received token. A failing witness is rejected outright and never reaches the store. Missing keys report "unchecked", never "valid"                                                                  |
| Inflated amount     | Amounts come from the decoded proofs, not from a self-declared field, and every proof is bounded before being summed                                                                                                                                                         |
| Token interception  | DMs encrypt the token in transit; a token posted to a public channel is a bearer instrument anyone reading can redeem, which the UI states plainly                                                                                                                           |
| Interrupted send    | Proofs are moved to a reserved bucket, never deleted, and the serialised token is kept on the transaction. An abandoned sheet, a crash, or a DM that never routes leaves the value reclaimable                                                                               |
| Mint failure        | The user chooses which mints to trust; balances are per (mint, unit) and never pooled across mints, so one mint failing cannot take the rest                                                                                                                                 |
| Proofs at rest      | The MMKV partition is AES-256 encrypted with a Keychain/Keystore-held key. If that key is unavailable the wallet locks rather than falling back to plaintext                                                                                                                 |
| IP linkage over Tor | On iOS, Arti wraps only Nostr WebSockets, so mint HTTP would bypass it. Mint calls are refused while Tor is on unless the user explicitly opts in. Android is covered by Orbot's VPN                                                                                         |

### Recovery

Off by default. Turning it on generates a 12-word BIP-39 phrase, stored in the
Keychain/Keystore next to the identity keys, and switches proof creation from
random secrets to NUT-13 deterministic derivation. Recovery (NUT-09) re-derives
those secrets on any device and asks each mint which of them it signed, so the
balance is rebuilt from the mint's own records rather than from any backup file.

|                    |                                                                                                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Covers             | Ecash derived from the phrase, at mints the user re-adds                                                                                                                                               |
| Does **not** cover | The Airhop identity, chats, contacts, or the mint list                                                                                                                                                 |
| Does **not** cover | Coins received and never swapped: those carry the sender's secrets, so no seed of ours can reproduce them. They come under the phrase the moment they are swapped, which is what `refreshAccount` does |

Three properties keep this honest rather than decorative:

- **The keychain is the source of truth.** If the flag says backup is on but the
  phrase is gone, startup turns the flag off rather than claiming coverage the
  user does not have.
- **Coverage is reported, not assumed.** `StoredProof.derived` tracks which
  proofs the phrase can actually rebuild, and the UI shows the uncovered
  remainder rather than folding it into a green tick.
- **It is one-way.** There is no "turn backup off", because deleting a phrase
  that coins were derived from is indistinguishable from deleting the coins.
  Only the panic wipe removes it, and it is destroying everything anyway.

Counters are the one place this can go wrong: re-deriving a counter recreates a
secret the mint has already signed and the swap is rejected. The cursor is
persisted per keyset, only ever moves forward, and restore pushes it past
everything the mint has on record. A rejected swap leaves the input proofs
untouched, so the failure mode is a retry, never a loss.

### Moving between mints

A token names exactly one mint, so ecash from two mints can never be combined
into a single token. That is Cashu's design and is not worked around. What
`consolidateMints` does instead is move the value: the destination mint issues a
Lightning invoice and the source mint pays it, so the balance ends up at one
mint and can then pay any amount it covers. One routing fee, no external wallet.

Two limits are worth stating explicitly, because wallets often blur them:

- **DLEQ proves origin, not freshness.** A valid witness proves the mint signed
  that proof. It can never prove the sender did not already spend it. Only the
  mint knows that, and only over the network.
- **Reclaiming an undelivered send is not free.** The proofs are still valid at
  the mint, so a reclaim works, but if the recipient also holds the token string
  then whoever reaches the mint first keeps the value. The UI says so before
  reclaiming.

### Wallet UX

- **Balance**: spendable proofs per (mint, unit), with unverified and reserved amounts broken out rather than folded into the headline number
- **Deposit**: bolt11 invoice from the mint (NUT-04); polled while the sheet is open and reconciled on next launch if the app is closed
- **Withdraw**: pay any bolt11 invoice from ecash (NUT-05), quoted with the routing reserve first, unused reserve returned as change
- **Send offline**: build a token from held proofs; hand it to a mesh peer, share it, or copy it. Fee-aware, so "send 100" means the recipient can claim 100
- **Receive**: paste or claim from a message. Swapped at the mint when online, stored unverified when not
- **Send online**: NIP-61 nutzap locked to the recipient's P2PK key, falling back to an encrypted DM and then to a manual token, telling the user which happened
- **Refresh**: NUT-07 state check, a swap of everything unverified, and a swap of anything the recovery phrase does not yet cover
- **Backup**: opt-in 12-word recovery phrase (NUT-13 / NUT-09), with the uncovered remainder shown rather than hidden
- **Consolidate**: move a split balance onto one mint over Lightning, since a token can only name one mint
- **History**: every send, receive, deposit, withdrawal, nutzap and swap, with status
- **No custodian**: the mint is a minimal trust party; proofs live only on the device

### Library

`@cashu/cashu-ts` v4.7 (MIT, actively maintained, TypeScript-first, ESM). The
library owns proof selection (RGLI), fee arithmetic, blinding, and the mint HTTP
surface; `src/services/wallet-service.ts` owns everything above it.

## 8. Localization

Airhop ships in English. Every user-facing string in the app is in one catalog,
`src/i18n/locales/en.ts`, and a second language is a second file. Working
reference: [`.github/skills/i18n.md`](../../.github/skills/i18n.md).

### Why it is a protocol concern and not a polish concern

The mission statement scopes this app to blackouts, protests and disasters. The
languages that matters in are Persian, Arabic, Urdu, Bengali, Hindi, Tamil,
Indonesian, Filipino, Nepali, Ukrainian and Russian. An English-only UI in a
network shutdown in Tehran or Dhaka is a product that does not work for the
person it was built for, and every other feature in this document is downstream
of someone being able to read the join button.

That is the target. Ten languages land in v1.3.0 (see
[ROADMAP.md](../design/ROADMAP.md)). The work in this release is the part that
touches screens, so that one touches none.

### Scope

| In this release                                                  | In v1.3.0                                                 |
| ---------------------------------------------------------------- | --------------------------------------------------------- |
| Every user-facing string in one catalog, 1,297 keys              | Nine more catalogs                                        |
| Zero hardcoded strings, enforced in CI (`i18n:audit -- --max 0`) | Locale store and in-app picker                            |
| Plurals through `tPlural`, never concatenation                   | CLDR plural rules beyond English's one/other              |
| Stylesheets on logical properties, so RTL is a catalog away      | Device language negotiation                               |
| Formatting centralised in `src/utils/format.ts`                  | Translated OS permission dialogs and service notification |

A language reaches a user by being listed in `src/i18n/languages.ts`, and it can
be listed only once its catalog compiles, which requires every key. There is no
coverage threshold and no partial state to manage.

### Decisions

| Decision                                                   | Rationale                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bundled catalogs, never fetched                            | A translation download is a network call and a fingerprint. It would also fail in exactly the conditions this app exists for. Every locale is compiled into the bundle, so the text is byte-identical on every device running a given build                                                               |
| No i18n library                                            | i18next and react-intl bring namespaces, lazy network backends and untyped runtime keys. None is usable by an offline-first app with a bundled catalog, and the codebase already hand-rolls its sheet, alert, toast and theme layers                                                                      |
| Completeness enforced by `tsc`, not by a test              | Every locale is `Record<TranslationKey, string>` derived from `en.ts`, so a partial locale does not compile. bitchat needs `LocalizationCoverageTests.swift` because `.xcstrings` permits partial locales; here one cannot be constructed                                                                 |
| The runtime carries what the shipped catalog needs         | One language needs no locale store, plural polyfill, device negotiation or picker. Each arrives with the language that requires it, listed in the skill file so the set is known rather than rediscovered                                                                                                 |
| Strings the OS renders stay where the OS reads them        | iOS permission dialogs live in `app.json`, the Android service notification in Kotlin. Routing them through the catalog costs a generated per-locale bundle or a bridge call, and both arrive with the second language                                                                                    |
| Prose numerals follow the locale, machine data stays Latin | A byte count, a clock time and a wallet balance sit in the monospace face next to Latin units. Numbers inside a translated sentence get no override                                                                                                                                                       |
| Keys named after bitchat's                                 | bitchat is public domain, ships 30 languages, and its catalog is vendored here. A key that matches theirs is a translation that can be lifted rather than commissioned. This is the single biggest lever on the cost of the whole effort                                                                  |
| Counts go through `tPlural`, never concatenation           | `"item" + "s"` is untranslatable: no language outside English pluralises by appending to the stem, Russian needs four forms and Arabic six. Eight of these were found and fixed during extraction. The English one/other rule lives in the runtime, in one place, and is where CLDR selection replaces it |
| Translation never happens at module load                   | A module constant holding `t("key")` type-checks, renders correctly, and freezes in whichever language the app started in. Constants hold `TranslationKey`s and the component translates on render. `npm run i18n:audit` fails the build on it; it found 25 on its first run                              |
| Terminal punctuation is checked, not reviewed              | A string that starts a second sentence must finish it. A stop in the middle and none at the end reads as truncated, and a screen reader runs the two halves together. Translators copy English punctuation, so it is settled here before nine more catalogs inherit it                                    |

### What never gets translated

Some strings are not copy: they cross the wire, or an identity derives from
them, and a translated variant is an interop bug rather than a cosmetic one.
The full list with reasons is in the skill file, and `catalog.test.ts` enforces
it. The two that matter most:

- **The username word lists** (`src/utils/username.ts`). A peer's generated name
  must resolve identically on every device and in bitchat.
- **The transmitted `/hug` and `/slap` text.** It is sent as message content, and
  bitchat/ios recognises an incoming emote by matching the **English** substrings
  in `ChatPublicConversationCoordinator.swift`. bitchat is itself fully localized
  and still keeps these as English literals, for exactly this reason.

Terms of Service and Privacy Policy stay in English, with the reader chrome
around them translated. English is the authoritative version, and a
machine-translated liability clause is not something to ship.

### Consistency across devices

The text is identical everywhere, because it is compiled in. What varies, and
what is done about it:

| Varies                                        | Handling                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Intl` date and number output, per OS and OEM | Centralised in `src/utils/format.ts`, formatted in the **app's** language rather than the device's, with cached formatters and Latin numerals for machine data                                                                                                                                                                                                                                |
| Font glyph coverage for non-Latin scripts     | Monospace is restricted to machine data. Translated prose never uses it                                                                                                                                                                                                                                                                                                                       |
| `Intl` availability across engines            | Hermes ships a partial Intl: `DateTimeFormat`, `NumberFormat` and `Collator` are present, `PluralRules` is not, on either platform. Nothing calls the missing one. Plural selection is English's one/other, decided in `src/i18n/index.ts` and not by the engine. A second language needs `@formatjs/intl-pluralrules`                                                                        |
| Cached reverse-geocoded place names           | Come from the OS geocoder, which answers in the **device's** language and takes no locale argument on either platform. `place-names-store.ts` keys its cache on that language, sampled once at startup, so changing the phone's language re-resolves rather than leaving every channel labelled in the old one forever. This is the one place in the app where device language is read at all |
| Layout direction on a right-to-left device    | React Native mirrors the whole layout when the device is set to Arabic or Hebrew, which would put English text in a right-to-left frame. `initI18n()` pins direction to the app's language at startup, so the app looks the same everywhere. It becomes language-driven the day an RTL catalog ships                                                                                          |

## 9. Privacy & Tor Integration

### Metadata minimization

- **No phone numbers, email, username registration**
- **No IP address exposed to relays** when Tor is active
- **NIP-17 gift-wrap** means DM metadata (who is talking to whom) is hidden from relay operators
- **BLE mesh**: local radio only; physical proximity required; no internet signature
- **Geolocation**: opt-in for geohash presence; never stored or transmitted without consent
- **Message ephemerality**: no plaintext ever written to disk; panic wipe destroys all keys

### Tor: Both Platforms

| Platform | Tor Integration                                                                                                                        | Default               |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| iOS      | **[Arti](https://gitlab.torproject.org/tpo/core/arti)** Rust xcframework (same as bitchat-ios), embedded in app binary                 | Off by default        |
| Android  | **[Orbot](https://guardianproject.info/apps/org.torproject.android/)** proxy detection: SOCKS5 on `localhost:9050` if Orbot is running | Optional, with prompt |

Tor is used exclusively for **Nostr relay connections**. BLE traffic is radio-local and cannot be routed through Tor.

### Panic Wipe

Triggered by the panic button on the Profile screen
(`src/features/settings/profile-screen.tsx`). A single tap opens a confirmation
sheet; three quick taps skip it and wipe immediately.

1. Remove all private keys from the secure store (Keychain/Keystore)
2. Clear or delete every MMKV partition, including the encrypted wallet file
3. Delete received media files from the cache (photos, videos, voice notes)

The app is left in an empty, first-run state and drops straight to onboarding.
The process is not terminated and the app sandbox is not otherwise touched.

## 10. Security Threat Model

### The attacker

Anyone within radio range can transmit anything. They can forge any plaintext
header field (`senderID`, `ttl`, `flags`, `timestamp`), replay packets they
captured, mint unlimited identities, and drop or alter anything passing through
them. They cannot break Ed25519, X25519, ChaCha20-Poly1305, or SHA-256 preimage
resistance. Everything below is written against that attacker.

### Threats and countermeasures

| Threat                                 | Countermeasure                                                                                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Message forgery**                    | Ed25519 signature verified against the key bound to the claimed sender. A missing key or a missing SIGNED flag is a FAILED check, never a skipped one     |
| **Identity impersonation**             | `peerID == SHA-256(noiseStaticPubKey)[0:16]`, enforced on announces and on completed Noise sessions, so a peer ID cannot be claimed without its key       |
| **Signing-key substitution**           | TOFU pinning: once a signing key is bound to a peer ID it is never replaced over the air. Only an in-person QR scan may re-pin                            |
| **Replay attack**                      | Content-derived packet IDs plus a deduplicator, and freshness windows where staleness itself is the attack: ANNOUNCE 15 min, live voice 30 s              |
| **Man-in-the-middle (session)**        | Noise XX mutual authentication, with the authenticated static key required to derive the peer ID it claims                                                |
| **Traffic analysis (Nostr)**           | NIP-17 gift-wrap hides sender, recipient and content from the relay; Tor hides the IP; per-cell ephemeral identities for geohash channels                 |
| **Traffic analysis (BLE)**             | Payloads are encrypted and padded to fixed buckets, so an observer sees uniform random bytes                                                              |
| **Relay censorship**                   | Several relays queried in parallel; any single relay failure is transparent                                                                               |
| **Sybil flooding the mesh**            | TTL bounds propagation; the registry and radar are capped with oldest-first eviction that never drops a peer holding a real BLE link                      |
| **Key compromise (session)**           | Noise XX forward secrecy: past sessions stay safe if a static key later leaks                                                                             |
| **Key compromise (DM history)**        | Double Ratchet per-message keys, seeded from the Noise **exporter secret** (never the public transcript hash), so the chain is not derivable by observers |
| **Malicious relay injecting messages** | A relay cannot produce the sender's signature, and forwarding is separate from delivery                                                                   |
| **Confused-deputy delivery**           | Directed packets are relayed but only rendered by the addressee, so a relay never surfaces someone else's private content                                 |
| **Group takeover**                     | A group keeps the creator it was created with; a state naming a different creator is refused even at a higher epoch                                       |
| **Hostile payment source**             | Ecash is only redeemed from a mint the user already added; incoming proofs are DLEQ-verified before anything is stored                                    |
| **Cashu double-spend**                 | Mint enforces with blind-signature tracking; the receiver redeems promptly                                                                                |
| **Physical device seizure**            | Panic wipe (triple-tap); keys in Keychain/Keystore (hardware-backed on modern devices)                                                                    |
| **Screen surveillance**                | App background blurs sensitive content (standard iOS/Android API)                                                                                         |

### What Airhop does NOT protect against

- **Physical proximity**: BLE mesh reveals you are geographically near certain peers
- **A stable peer ID**: it derives from your long-term Noise key and does NOT rotate, so the same device is linkable across sessions until the identity is regenerated. Only the per-cell geohash identities are ephemeral
- **Attachment confidentiality**: photos, files and voice notes are signed but NOT encrypted, to stay wire-compatible with bitchat. They are therefore restricted to `#bluetooth` and mesh DMs, and never bridged
- **Traffic timing correlation**: an observer watching multiple BLE radios could infer communication patterns
- **Who you are talking to on the mesh**: packet headers carry sender and recipient IDs in the clear, as bitchat's do
- **Compromised OS**: if the device OS is compromised, all guarantees are void
- **Mint trust**: Cashu requires trusting the mint to honour redemption; choose reputable mints

Not every packet is signed, and that is deliberate rather than an omission.
Noise handshake messages are unsigned (matching bitchat: the peer may not hold
our signing key yet, and the handshake authenticates itself), and messages inside
a Noise session or a ratchet carry no redundant signature because the session
already authenticates them. Signatures are required exactly where a claimed
sender is otherwise unverifiable: announces, public and private channel
messages, attachments, voice frames, board posts, and gateway uplinks.

## 11. Project Folder Structure

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
| `src/i18n/`     | Translation runtime and the bundled English catalog                           |
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

**Consistency guarantee for ALL features on BOTH platforms:** Every feature lives in `src/core/` TypeScript. The ~2,400 lines of native BLE code expose an _identical_ TypeScript interface on both platforms. A bug fix in gossip sync fixes both iOS and Android at once. Protocol upgrades ship simultaneously. No drift.

## 12. Native Module Architecture

### One native module per hardware capability

Hardware requires native code. Everything else (routing, crypto, Nostr, payments) is pure TypeScript. This is a deliberate constraint: native code is harder to test, harder to keep consistent across platforms, and harder to reason about security-wise. So there is exactly one module per capability, and no more.

| Module                               | Platform | Capability                                             |
| ------------------------------------ | -------- | ------------------------------------------------------ |
| `AirhopBLEModule`                    | Both     | BLE GATT Peripheral + Central, radio state, power mode |
| `AirhopVoiceModule`                  | Both     | AAC-LC capture and playback for voice notes and PTT    |
| `AirhopWiFiModule`                   | Android  | WiFi Aware same-platform fast path                     |
| `AirhopMCModule`                     | iOS      | MultipeerConnectivity same-platform fast path          |
| `AirhopTorModule`, `AirhopTorSocket` | iOS      | Embedded Arti and the SOCKS socket it fronts           |

None of them knows anything about the protocol. They have no concept of packets, routing, or encryption. That logic lives in TypeScript where it's testable, consistent, and portable.

### The contract between native and TypeScript

The bridge specs live in `src/bridge/`, and React Native Codegen turns them into
the native bridge for both platforms. Bytes cross the bridge base64-encoded,
since that is the only representation both runtimes agree on safely.

`src/bridge/NativeAirhopBLE.ts` is the largest of them, and it is still small:
twelve methods.

1. `startAdvertising` / `stopAdvertising` - GATT Peripheral
2. `startScanning` / `stopScanning` - GATT Central
3. `writeToLink` - raw bytes to a connected peer
4. `getRadioState` - support, power, authorization, location, battery, in one answer
5. `setPowerMode` - how hard to run the radios
6. `requestEnableBluetooth` / `openLocationSettings` - one-tap fixes for the Mesh banner
7. `setBackgroundServiceEnabled` - hold the process up, independent of advertising
8. `getTorProxyPort` / `getTorAvailability` - is a SOCKS proxy actually routing

Native calls back up with six events: `packetReceived`, `linkConnected`,
`linkDisconnected`, `rssiUpdated`, `adapterStateChanged`, and
`powerStateChanged`.

Anything richer would mean protocol knowledge on the native side, which is the
one thing this design exists to prevent.

### Background execution

| Platform       | Mechanism                                           | Result                                      |
| -------------- | --------------------------------------------------- | ------------------------------------------- |
| iOS Central    | `UIBackgroundModes: bluetooth-central`              | Receives BLE data in background             |
| iOS Peripheral | `UIBackgroundModes: bluetooth-peripheral`           | Keeps advertising, but see the caveat below |
| iOS Suspended  | `CBCentralManagerOptionRestoreIdentifierKey`        | iOS restarts app on BLE event               |
| Android        | `AirhopForegroundService` (persistent notification) | Survives Doze + battery optimization        |
| Android        | `FOREGROUND_SERVICE_CONNECTED_DEVICE` permission    | Required Android 14+                        |

**A backgrounded iPhone is not discoverable from Android.** Once the app leaves
the foreground, CoreBluetooth moves the service UUID into the advertisement's
overflow area and drops the local name. Only another iOS device scanning for
that exact UUID can see it there, so iPhone-to-iPhone still works but
iPhone-to-Android discovery stops until the app is reopened. An already
connected link keeps carrying traffic. Android has no equivalent restriction:
the foreground service keeps it advertising normally.

## 13. Protocol Decision Log

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

## 14. Dependency Manifest

### Core (required from day 1)

| Package                          | Version | Purpose                                                          | License |
| -------------------------------- | ------- | ---------------------------------------------------------------- | ------- |
| `@noble/curves`                  | `^2.2`  | X25519, Ed25519 (Noise XX, signing)                              | MIT     |
| `@noble/ciphers`                 | `^2.2`  | ChaCha20-Poly1305 (Noise, Nostr NIP-44)                          | MIT     |
| `@noble/hashes`                  | `^2.2`  | SHA-256, HKDF, HMAC                                              | MIT     |
| `react-native-get-random-values` | `~1.11` | Polyfill `crypto.getRandomValues` for @noble (Expo SDK 57 pin)   | MIT     |
| `nostr-tools`                    | `^2.24` | Nostr client, NIP-17/59 gift-wrap                                | MIT     |
| `react-native-encrypted-storage` | `^4.0`  | Private key storage (Keychain/Keystore)                          | MIT     |
| `react-native-mmkv`              | `^4.3`  | Fast JSI key-value store (requires `react-native-nitro-modules`) | MIT     |
| `react-native-nitro-modules`     | `^0.36` | Peer dep for react-native-mmkv v4                                | MIT     |
| `zustand`                        | `^5.x`  | State management                                                 | MIT     |

### BLE / Transport (required from day 1)

| Package                  | Version  | Purpose                   | License |
| ------------------------ | -------- | ------------------------- | ------- |
| Custom `AirhopBLEModule` | internal | BLE GATT Server + Central | N/A     |

### Media / Voice (Phase 2)

| Package              | Version | Purpose                                     | License |
| -------------------- | ------- | ------------------------------------------- | ------- |
| `expo-audio`         | `~57.0` | Voice note and PTT capture and playback     | MIT     |
| `expo-video`         | `~57.0` | Inline video playback                       | MIT     |
| `expo-camera`        | `~57.0` | Photo capture and QR scanning               | MIT     |
| `expo-file-system`   | `~57.0` | Attachment cache on disk                    | MIT     |
| `expo-image-picker`  | `~57.0` | Picking photos and videos to send           | MIT     |
| `expo-media-library` | `^57.0` | Saving received media to the device gallery | MIT     |

### Payments (Phase 2)

| Package           | Version | Purpose                              | License |
| ----------------- | ------- | ------------------------------------ | ------- |
| `@cashu/cashu-ts` | `^4.7`  | Cashu ecash wallet operations        | MIT     |
| `@scure/bip39`    | `^2.0`  | BIP-39 recovery phrase (NUT-13 seed) | MIT     |

### UX / Polish (Phase 1+)

| Package                        | Version | Purpose                         | License |
| ------------------------------ | ------- | ------------------------------- | ------- |
| `react-native-reanimated`      | `^4.x`  | Hardware-accelerated animations | MIT     |
| `react-native-gesture-handler` | `^2.32` | Gestures, sheets, swipe actions | MIT     |
| `react-native-qrcode-svg`      | `^6.3`  | Rendering the contact card QR   | MIT     |

There is no navigation library. `App.tsx` holds a hand-rolled 4-tab state
machine, and screens are plain components. Styling is StyleSheet plus the theme
tokens in `src/ui/`; there is no Tailwind or NativeWind.

### Build toolchain

| Tool                               | Version  | Purpose                                        |
| ---------------------------------- | -------- | ---------------------------------------------- |
| `expo`                             | `SDK 57` | Bare workflow, EAS Build, config plugins       |
| `react`                            | `^19.2`  | Required by React Native 0.86 (peer dep)       |
| `react-native`                     | `^0.86`  | New Architecture (default since 0.76)          |
| `typescript`                       | `~6.0.3` | Strict mode, no `baseUrl`, `./`-prefixed paths |
| `jest`                             | `^29`    | Unit tests for all `src/core/`                 |
| `prettier`                         | `^3.9`   | Formatting                                     |
| `prettier-plugin-organize-imports` | `^4.3`   | Auto-sort import blocks                        |

_ARCHITECTURE.md is the ground truth for implementation decisions. Cross-reference ROADMAP.md for phased timeline and ROADMAP.md Gap Analysis for competitive differentiation. All protocol decisions above are final unless explicitly revisited with evidence._
