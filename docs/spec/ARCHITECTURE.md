# Airhop: Architecture

Every layer and the reasoning behind it. For what is being built and when, see
[ROADMAP.md](../design/ROADMAP.md). For exact protocol constants, see
[PROTOCOLS.md](PROTOCOLS.md).

## Table of Contents

1. [Feature Matrix](#1-feature-matrix)
2. [Identity](#2-identity)
3. [Transport Stack](#3-transport-stack)
4. [Messaging Protocol](#4-messaging-protocol)
5. [Encryption](#5-encryption)
6. [Channels and Groups](#6-channels-and-groups)
7. [Payments](#7-payments)
8. [Privacy and Tor](#8-privacy-and-tor)
9. [Threat Model](#9-threat-model)
10. [Localization](#10-localization)
11. [Codebase Layout](#11-codebase-layout)
12. [Native Modules](#12-native-modules)
13. [Decision Log](#13-decision-log)
14. [Dependencies](#14-dependencies)

## 1. Feature Matrix

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
| Payments (Cashu)          | Yes, token in a message  | Yes, NIP-61 nutzap  | Transfer works offline, redemption needs internet                                                                                              |
| Contact verification      | Yes, QR exchange         | n/a                 | The card carries public keys, checked against the noise key. Source is `qr`, `link` or `manual`; only an in-person camera scan may re-pin keys |
| Panic wipe                | Yes                      | Yes                 | Panic button on Profile. Destroys keys, messages, groups, board, prekeys                                                                       |
| Internet gateway          | Relays for others        | Yes                 | Off by default. Carries public location traffic for offline peers                                                                              |
| Tor routing               | n/a                      | Yes                 | Arti on iOS, Orbot on Android. BLE is local, so nothing to route                                                                               |
| Relay discovery           | n/a                      | Yes                 | Bundled CSV, refreshed from the georelays repo                                                                                                 |
| bitchat compatibility     | Yes                      | Yes                 | Same wire format both directions. Airhop-only types are ignored by bitchat                                                                     |

Optional, shipped but switchable:

| Feature         | Needs internet | Notes                                               |
| --------------- | -------------- | --------------------------------------------------- |
| Cashu ecash     | Only to redeem | Tokens move device to device over the mesh          |
| Nutzaps         | Yes            | NIP-61 ecash locked to the recipient key            |
| Local assistant | No             | On-device inference, nothing leaves the phone       |
| AT Protocol     | Yes            | Opt-in bridge to Bluesky using the Airhop identity  |
| ActivityPub     | Yes            | Opt-in bridge to Mastodon using the Airhop identity |

## 2. Identity

An Airhop identity is a key pair generated on the device, stored in the OS
keychain, and never transmitted to any server. There are no accounts.

### Key pair

```
Identity
├── Noise Static Key   (X25519)     - session encryption (Noise XX handshake)
├── Signing Key        (Ed25519)    - packet, board, prekey and group authentication
├── Nostr Key          (secp256k1)  - derived from the signing key; the Nostr identity
└── Peer ID            (string)     - SHA-256(noiseStaticPub).slice(0, 8 bytes), 16 hex chars
```

Nostr uses secp256k1, so the Ed25519 signing key cannot serve as an `npub`. The
Nostr key is derived from it by HKDF (`deriveNostrPrivKey`), which gives one root
identity a single stable Nostr identity across mesh, relays and payments with no
link to a phone number or email. Location channels derive a further per-geohash
secp256k1 identity, so presence in one cell cannot be linked to another.

### Names

Usernames are derived from the public key, never chosen:

```
peerID 3a9f2c1b → "swift-falcon-3a9f"
```

This makes impersonation and name squatting impossible, since a name cannot be
claimed without the key it comes from. Real identity is confirmed by scanning a
contact QR code.

### Anti-impersonation

- Every packet carries an Ed25519 signature from the sender.
- Receivers verify signatures before displaying or acting on a message.
- Unsigned and invalid-signature packets are dropped before display.
- Relaying is separate from verification. A node forwards opaque bytes it may not
  be able to check, since it may not hold the sender's key yet, and the flood
  router runs before per-type verification.

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

### Storage key names

Three families of string, all currently at `v1`.

| Family                    | Shape                        | Example                 | Renaming costs                      |
| ------------------------- | ---------------------------- | ----------------------- | ----------------------------------- |
| Keychain item             | `airhop.<domain>.<thing>.v1` | `airhop.wallet.p2pk.v1` | The secret becomes unreachable      |
| HKDF domain separator     | `airhop-<purpose>-v1`        | `airhop-dr-root-v1`     | Every key derived from it changes   |
| Persisted store / MMKV id | `<name>-store`               | `wallet-store`          | The user's data becomes unreachable |

The third family has three names that predate the convention: `airhop-chat`,
`wallet-state` (beside the `wallet-store` partition), and `activity`. They stay
as they are. A persisted name is the address of the data, not a label on it, so
renaming one points the next launch at a file that has never been written while
the old data stays on disk with nothing referencing it. No store declares a
`migrate`. Changing these safely means a per-store migration that reads the old
name and writes the new, shipped at least one release before the old name is
dropped.

### Wallet partition

Cashu proofs are bearer instruments, so `wallet-store` is the one MMKV partition
opened with an explicit `encryptionKey`. The key is 24 random bytes, base64
encoded to the 32 ASCII characters AES-256 allows, generated on first run and
held in the keychain. It is fetched asynchronously, so the store cannot exist at
module scope: `bootstrapWalletStorage()` opens it and every `zustand/persist`
read and write awaits that promise. If the keychain refuses, the wallet reports
itself locked rather than opening unencrypted, and no proof reaches plaintext
disk.

The panic wipe deletes this partition with `deleteMMKV` rather than `clearAll`,
since the file cannot be reopened without its key and the same wipe destroys the
key.

## 3. Transport Stack

Messages route through the best available transport with no user involvement.
The interface is the same whichever radio carries the message.

```
MessageRouter.ts - transport selection

Local radios, used together:
  WiFi Aware/Direct - both parties have it active and are in range (~30m, 250Mbps)
  BLE Mesh          - recipient is nearby, confirmed by announce

Ordered fallbacks, tried when no local radio reaches the recipient:
1. Nostr Relay       - internet available, recipient confirmed offline
2. Courier           - everything else failed (spray-and-wait through mesh peers)
```

The two local radios are not a priority ladder. A message addressed to a peer is
TTL bounded and flooded on every link the device has, because no node knows the
mesh topology and the recipient may be several hops away. WiFi and BLE therefore
carry the same packet at the same time, and a packet that enters on one radio is
relayed out on the other. Duplicates are collapsed by the seen set and by a
sender generated message ID, so a message is displayed once however many radios
delivered it.

The one place a radio is chosen rather than used alongside the other is the
direct link shortcut. Once a peer has been mapped to a specific link, a packet
addressed to it goes over WiFi if that mapping is a WiFi link, since the point of
the fast path is to move an attachment that BLE would have to fragment into
hundreds of writes. This is an optimization, not the delivery guarantee.

### BLE mesh

Identical to bitchat's design:

- Dual-role: every device is both GATT Central (scanner) and GATT Peripheral (advertiser)
- Service UUID `F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C`, bitchat-compatible
- TTL 7 hops, decremented per relay
- Jitter of 10 to 220 ms before relay, which prevents cascade storms
- Dedup against a 1000-entry LRU seen-set, 5 minute nonce expiry
- Fragments of 467 data bytes inside a 512-byte frame, the BLE write ceiling
- Up to 128 concurrent reassemblies
- Range of roughly 30 to 50 m per hop, so 7 hops reaches about 350 m

### Same-platform WiFi

> [!IMPORTANT]
> Android WiFi Aware and iOS MultipeerConnectivity are different protocols and
> cannot talk to each other. This is an Android-to-Android or iPhone-to-iPhone
> accelerator only; anything cross-platform uses Bluetooth or Nostr. Apple
> shipped a standards-based Wi-Fi Aware framework in iOS 26 which could close
> the gap, at the cost of making the feature iOS 26+ only.

- Android: [`WifiAwareManager`](https://developer.android.com/develop/connectivity/wifi/wifi-aware) (API 26+), 250 Mbps, no internet or router
- iOS: [`MultipeerConnectivity`](https://developer.apple.com/documentation/multipeerconnectivity), 30 to 100 Mbps between nearby iOS devices
- Same `Transport` interface as BLE, so the mesh engine does not know which radio it has
- Carries what BLE cannot: live video, large files, high-quality voice

### Nostr

- 350+ public relays from the georelays dataset, bundled as `assets/data/relays.csv`
- Relays selected by [Haversine](https://en.wikipedia.org/wiki/Haversine_formula) distance from the device, for lowest latency
- NIP-17 gift-wrap for private DMs, so no message content or metadata reaches relays
- Kinds 20000 and 20001 for geohash channels and presence heartbeats
- `SimplePool` connects to 3 to 5 relays at once and takes the first ACK, so no single relay is load-bearing
- Tor off by default on both platforms, behind one toggle

### Radio power policy (Android)

BLE scanning is the largest battery cost in the app. A continuous
`SCAN_MODE_LOW_LATENCY` scan costs roughly an order of magnitude more than
`SCAN_MODE_LOW_POWER`, and the app is meant to run in a pocket all day, so the
radios scale with what the device can afford.

Policy lives in TypeScript, mechanism in Kotlin. `src/services/power-policy.ts`
is a pure function of four facts; the native module reports the battery and
applies whichever mode it is given, and decides nothing itself. This keeps the
decision testable without a device and puts "how hard to run the radios" beside
"whether to run them at all" in `src/services/radio-controller.ts`.

Battery bands match bitchat-android's `AppConstants.Power`: critical at `≤10%`,
low at `≤20%`.

| Mode              | Scan          | Advertise     | TX power    | RSSI poll | Duty cycle      |
| ----------------- | ------------- | ------------- | ----------- | --------- | --------------- |
| `performance`     | `LOW_LATENCY` | `LOW_LATENCY` | `HIGH`      | 5s        | continuous      |
| `balanced`        | `BALANCED`    | `BALANCED`    | `MEDIUM`    | 10s       | continuous      |
| `power-saver`     | `LOW_POWER`   | `LOW_POWER`   | `LOW`       | 30s       | 2s on / 28s off |
| `ultra-low-power` | `LOW_POWER`   | `LOW_POWER`   | `ULTRA_LOW` | 60s       | 1s on / 29s off |

Selection order matches bitchat's `PowerProfileResolver`, and the order carries
the policy:

1. Backgrounded gives `power-saver`, or `ultra-low-power` on a critical battery.
   Nobody is waiting on discovery latency off screen, and this is where a phone
   spends nearly all of its day.
2. Charging in the foreground gives `performance`, since the cost is someone else's.
3. Otherwise the battery band decides: critical gives `ultra-low-power`, low
   gives `power-saver`, anything else gives `balanced`.

Foreground on battery is `balanced` rather than `performance` because a balanced
scan still finds peers within seconds, and reserving the most expensive setting
for "plugged in" is what stops the app being the reason a phone dies.

> [!NOTE]
> The five knobs move together. A duty-cycled `LOW_POWER` scan beside a
> `LOW_LATENCY` advertise at full TX power saves almost nothing, since the
> advertiser transmits continuously either way.

Hysteresis is Airhop's addition. bitchat re-resolves on every
`ACTION_BATTERY_CHANGED`, which fires per 1%, so a phone hovering at a threshold
flips modes repeatedly and every flip restarts the scanner. Dropping into a lower
band is immediate, since running hard on a nearly flat phone is the failure that
matters; climbing back out needs `+3%`.

The duty cycle is invisible above the native boundary. JS asks for scanning and
keeps getting it while native decides the rate. A burst ending is never reported
as an adapter or link change, or the reconciler would try to repair a state that
is working correctly.

In the foreground on a low battery, peers can take up to half a minute to appear,
which is indistinguishable from a broken mesh unless it is stated. The Mesh tab
shows a muted `Battery saver · scanning less often` note, with no button since
charging is the fix, and no dismiss since it clears itself. It stays silent while
backgrounded, where nobody is waiting on the scan.

> [!IMPORTANT]
> iOS is a declared no-op. CoreBluetooth exposes no scan-rate control and already
> throttles background BLE aggressively. `setPowerMode` exists on both platforms
> so the shared reconciler has one code path, and `getRadioState` reports
> `batteryPercent: -1` there, which the policy reads as unknown and leaves the
> mode alone.

## 4. Messaging Protocol

### Wire format (bitchat v2)

Airhop is wire-compatible with bitchat in both directions. Airhop nodes appear as
ordinary peers to bitchat devices, and bitchat drops Airhop's extension packet
types as unknown without disruption.

> See [`PROTOCOLS.md`](PROTOCOLS.md) for the [byte layout](PROTOCOLS.md#2-packet-frame-layout), [packet type registry](PROTOCOLS.md#3-packet-type-registry), [routing constants](PROTOCOLS.md#4-routing-constants) and every other protocol constant.

### Routing

| Traffic          | Method                                                             |
| ---------------- | ------------------------------------------------------------------ |
| Public channel   | TTL flood; every peer rebroadcasts with TTL decremented            |
| Direct message   | Flood with a recipient ID; only the recipient decrypts             |
| Courier envelope | Spray-and-wait; trusted peers carry sealed blobs for offline peers |

## 5. Encryption

### Sessions: Noise XX

```
Protocol: Noise_XX_25519_ChaChaPoly_SHA256
```

Used for every live BLE DM session.

- Pattern XX mutually authenticates both parties, each sending their static key encrypted
- Ephemeral keys are fresh per session, so a leaked static key does not expose past sessions
- Neither party can prove to a third party what was said

The handshake produces `send` and `recv` keys. Messages are then encrypted with
[ChaCha20-Poly1305](https://datatracker.ietf.org/doc/html/rfc7539) under a counter
nonce, which prevents replay.

### Stored messages: [Double Ratchet](https://signal.org/docs/specifications/doubleratchet/)

Used for DMs held in the courier and the offline outbox.

- Per-message forward secrecy: compromise of message N does not expose N-1 or N+1
- Break-in recovery: if current keys leak, future messages are protected again after a few ratchet steps
- One-time prekeys are signed and gossiped over the mesh as `0x24`, never published to Nostr. A sender seals courier mail to one, so undelivered mail stays protected even if the recipient's long-lived key leaks later

X3DH is not used, since the Noise handshake already seeds the ratchet.

The seed is the handshake's exporter secret, a third HKDF output of `split()`
alongside the two transport keys, descending from the Noise chaining key. Both
sides already hold it, so it costs no extra round trips, and because the chaining
key absorbs ephemeral DH outputs whose private halves are destroyed at split, it
cannot be reconstructed from long-term keys. It must not be the transcript hash:
`mixHash` absorbs only bytes that went over the wire, so that value is public to
anyone who captured the handshake, and handshakes flood the mesh at TTL 7. Nor a
static-static ECDH, which would stay derivable from long-term keys forever.

### Packet signing: [Ed25519](https://ed25519.cr.yp.to/)

- Signed before transmission, verified before display or action
- The signature covers every packet field except TTL and the signature itself
- Replay is bounded by a millisecond timestamp plus a deduplicator that rejects any packet ID already seen. There is no nonce field. Where staleness is itself the attack, a freshness window backs this up: 15 minutes for announces, 30 seconds for live voice. The deduplicator is per-device and cannot speak for a phone that never heard the original

### Summary

| Traffic          | Protection                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| Live DM session  | Noise XX: mutual auth, forward secrecy per session                         |
| Stored DM        | Double Ratchet: forward secrecy per message                                |
| Public channel   | Plaintext plus Ed25519 signature, readable by every peer                   |
| Courier envelope | Noise X one-way seal to the recipient's static key, wrapping DR ciphertext |
| Nostr DM         | NIP-44 (XChaCha20-Poly1305, versioned) inside a NIP-17 gift-wrap           |

## 6. Channels and Groups

### Mesh channels

Channels are prefixed with `#`, as in bitchat, and are registered nowhere.
Anyone broadcasting on `#channel-name` participates.

- No server and no registration
- A 6 hour public message window, reconciled by gossip sync on connect
- A channel exists as soon as someone broadcasts on it; there is no membership advertisement
- Moderation is a client-side block list; muted peer IDs are not surfaced

### Private channels (Airhop only)

An invite-only room. A symmetric key is generated at creation and travels inside
the invite link, so anyone holding the link can read. There is no roster and no
member cap, so the link can spread faster than anyone could add people by hand.

- Sealed with XChaCha20-Poly1305 and broadcast as `0x2a`
- Reach is the creator's choice: Bluetooth only, or Bluetooth plus Nostr, where the same sealed blob is published so out-of-range members receive it
- bitchat drops `0x2a` as an unknown type, so the two coexist

### Private groups (bitchat compatible)

A fixed set of people rather than a place. The creator signs a roster of up to 16
members and delivers the group key to each member inside their Noise session. No
link exists, so nobody can forward their way in.

- Messages are sealed with ChaCha20-Poly1305 under the current epoch key and broadcast as `0x25`, with group ID and epoch in the clear so relays can carry them
- Bluetooth only. Group messages do not bridge to Nostr, so a member who walks out of range stops receiving until they return
- Rotating the key bumps the epoch; older epochs are refused
- A group pins the `creatorFingerprint` it was created with, and a state naming a different creator is refused even at a higher epoch

### NIP-29 was not used

Relay-hosted groups put membership enforcement on a relay, which makes a server
the authority on who may speak. Both models above keep that decision on the
devices holding the keys.

### One channel, two transports

A public location channel exists on both transports at once:

1. BLE mesh when offline, relaying through nearby devices
2. Nostr when internet is available, through relays chosen near the cell

Reconnecting after time offline reconciles the gap through GCS gossip sync, the
mechanism bitchat uses.

A teleported cell is the exception. When a user opens a location channel by its
geohash rather than by being there, nobody in Bluetooth range is in it, so it runs
over Nostr only. Its messages carry a `t=teleport` tag, and bitchat lists the
sender as teleported rather than nearby.

## 7. Payments

### Why Cashu

Cashu is a Chaumian ecash protocol built on blind signatures. Tokens are strings
that carry value.

- Transfer is fully offline: a token string sent over BLE moves the value immediately
- The token is a bearer instrument, so whoever holds it owns it
- Redemption to Lightning or Bitcoin needs internet access to the mint
- The mint tracks spent proofs, so the recipient should redeem once online
- Blind signatures stop the mint linking issuance to redemption
- Tokens split and combine down to 1 sat

### Token in a message

A payment is a message whose body is a token string. The same channel or DM that
carries text carries the payment, and the recipient's app renders it as a payment
card.

```
Message body example:
💸 500 sats - coffee money
cashuBo3Blk4J...
```

The token flows over BLE like any other message: encrypted in a DM, signed always.

### Nutzaps (NIP-61)

With internet available, a payment can address a Nostr identity instead of a
conversation.

1. Fetch the recipient's `kind:10019`, which lists trusted mints and a P2PK pubkey
2. Mint or swap ecash P2PK-locked to that pubkey
3. Publish a `kind:9321` nutzap event **to the recipient's relays**, which is where they subscribe
4. The recipient's client swaps the token into their wallet, refusing outright if the event names a mint they do not already hold
5. History stays local in `wallet-store`; Airhop publishes no NIP-60 events

### Choosing a rail

Every entry point that pays somebody (DM attach menu, contact sheet, Mesh peer
sheet, Wallet Zap) calls `payPerson` in `services/ecash-transfer.ts`, so the four
screens cannot disagree about what a payment does.

| Order | Rail   | When                                                                                                            | Reclaimable |
| ----- | ------ | --------------------------------------------------------------------------------------------------------------- | ----------- |
| 1     | Radio  | A direct BLE or WiFi link exists (`MeshService.hasDirectLink`)                                                  | Yes         |
| 2     | Nutzap | No radio link, their Nostr key is known, they published a `kind:10019`, and we hold value at a mint they accept | No          |
| 3     | Token  | Anything else. `MeshService.sendDm` picks Nostr gift-wrap, a courier, or the outbox                             | Yes         |
| 4     | Manual | Nothing carried it, so the token string returns for the user to hand over                                       | Yes         |

Radio comes first so that someone standing in front of you does not wait on a
mint round trip, and so the in-person case keeps working with no internet. Rail 2
is preferred over rail 3 when available, because locked proofs are the
recipient's whether or not they ever come online, where a bearer token is theirs
only once claimed.

Two rules hold across the ladder:

- **One commitment per payment.** Proofs are either reserved (rails 1, 3, 4) or P2PK-locked (rail 2), never both. A rail that fails before committing falls through to the next; a rail that fails after committing retries delivery only.
- **Finality is reported, never inferred.** `PayResult.final` is true for rail 2 alone, and every confirmation names the rail that carried the money and says whether Pending will offer it back.

### Payment security model

| Attack              | Mitigation                                                                                                                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Double-spend        | The mint is the only authority. A proof received offline is stored as unverified and never claimed as confirmed; `refreshAccount` runs a NUT-07 state check and swaps, and anything the mint reports spent is removed from the balance rather than shown as money |
| Fake token          | NUT-12 DLEQ verification against the mint's cached public keys on every received token. A failing witness is rejected before the store sees it. Missing keys report "unchecked", never "valid"                                                                    |
| Inflated amount     | Amounts come from the decoded proofs rather than a self-declared field, and every proof is bounded before being summed                                                                                                                                            |
| Token interception  | DMs encrypt the token in transit. A token posted to a public channel is a bearer instrument anyone reading can redeem, which the UI states before sending                                                                                                         |
| Interrupted send    | Proofs move to a reserved bucket rather than being deleted, and the serialised token stays on the transaction. An abandoned sheet, a crash, or a DM that never routes leaves the value reclaimable                                                                |
| Mint failure        | The user chooses which mints to trust. Balances are per (mint, unit) and never pooled, so one mint failing cannot take the rest                                                                                                                                   |
| Proofs at rest      | The MMKV partition is AES-256 encrypted under a keychain-held key. If that key is unavailable the wallet locks rather than falling back to plaintext                                                                                                              |
| IP linkage over Tor | On iOS, Arti wraps only Nostr WebSockets, so mint HTTP would bypass it. Mint calls are refused while Tor is on unless the user opts in. Android is covered by Orbot's VPN                                                                                         |

### Recovery

Off by default. Enabling it generates a 12-word BIP-39 phrase, stored in the
keychain beside the identity keys, and switches proof creation from random
secrets to NUT-13 deterministic derivation. Recovery (NUT-09) re-derives those
secrets on any device and asks each mint which of them it signed, so the balance
is rebuilt from the mint's records rather than from a backup file.

| Coverage |                                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Covers   | Ecash derived from the phrase, at mints the user re-adds                                                                                         |
| Excludes | The Airhop identity, chats, contacts and the mint list                                                                                           |
| Excludes | Coins received and never swapped, which carry the sender's secrets. They come under the phrase once swapped, which is what `refreshAccount` does |

- The keychain is the source of truth. If the flag says backup is on but the phrase is gone, startup clears the flag rather than claiming coverage the user does not have.
- `StoredProof.derived` tracks which proofs the phrase can rebuild, and the UI shows the uncovered remainder rather than folding it into a green tick.
- There is no way to turn backup off, since deleting a phrase that coins derive from is indistinguishable from deleting the coins. Only the panic wipe removes it.

Counters are the one place this can go wrong. Re-deriving a counter recreates a
secret the mint has already signed and the swap is rejected. The cursor is
persisted per keyset, only moves forward, and restore pushes it past everything
the mint has on record. A rejected swap leaves the input proofs untouched, so the
failure mode is a retry rather than a loss.

### Moving between mints

A token names exactly one mint, so ecash from two mints can never be combined
into one token. `consolidateMints` moves the value instead: the destination mint
issues a Lightning invoice and the source mint pays it, leaving the balance at
one mint for one routing fee and no external wallet.

Two limits that wallets often blur:

- DLEQ proves origin, not freshness. A valid witness proves the mint signed that proof. It cannot prove the sender has not already spent it. Only the mint knows that, and only over the network.
- Reclaiming an undelivered send is not free. The proofs are still valid at the mint, so the reclaim works, but if the recipient also holds the token string then whoever reaches the mint first keeps the value. The UI says so before reclaiming.

### Wallet operations

| Operation   | Behaviour                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Balance     | Spendable proofs per (mint, unit), with unverified and reserved amounts broken out rather than folded into the headline                |
| Deposit     | bolt11 invoice from the mint (NUT-04), polled while the sheet is open and reconciled on next launch if the app closes                  |
| Withdraw    | Pay any bolt11 invoice from ecash (NUT-05), quoted with the routing reserve first, unused reserve returned as change                   |
| Send        | Build a token from held proofs and hand it to a peer, share it, or copy it. Fee-aware, so "send 100" means the recipient can claim 100 |
| Receive     | Paste or claim from a message. Swapped at the mint when online, stored unverified when not                                             |
| Pay         | The `payPerson` ladder above, from any of the four entry points, always reporting the rail used and whether it can be reclaimed        |
| Refresh     | NUT-07 state check, a swap of everything unverified, and a swap of anything the recovery phrase does not yet cover                     |
| Backup      | Opt-in 12-word phrase (NUT-13 and NUT-09), with the uncovered remainder shown                                                          |
| Consolidate | Move a split balance onto one mint over Lightning                                                                                      |
| History     | Every send, receive, deposit, withdrawal, nutzap and swap, with status                                                                 |

The mint is a minimal trust party and holds no custody of the device's proofs.

### Library

`@cashu/cashu-ts` v4.7 (MIT, TypeScript-first, ESM) owns proof selection (RGLI),
fee arithmetic, blinding, and the mint HTTP surface.
`src/services/wallet-service.ts` owns everything above it.

## 8. Privacy and Tor

### Metadata minimization

- No phone numbers, email addresses or registered usernames
- No IP address reaches a relay while Tor is active
- NIP-17 gift-wrap hides who is talking to whom from relay operators
- BLE mesh is radio-local, requires physical proximity, and leaves no internet signature
- Geolocation is opt-in, used for geohash presence, and never stored or transmitted otherwise
- No plaintext message is written to disk, and the panic wipe destroys all keys

### Tor

| Platform | Integration                                                                                                                          | Default               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| iOS      | [Arti](https://gitlab.torproject.org/tpo/core/arti) Rust xcframework, as in bitchat-ios, embedded in the app binary                  | Off                   |
| Android  | [Orbot](https://guardianproject.info/apps/org.torproject.android/) proxy detection: SOCKS5 on `localhost:9050` when Orbot is running | Optional, with prompt |

Tor covers Nostr relay connections only. BLE traffic is radio-local and cannot be
routed through it.

Tor hides the device IP from the relay and DM metadata from the relay operator.
It does not conceal that Tor is in use, since the first hop is a direct
connection to the Tor network on both platforms. That is why it is off by
default, which is a safety decision rather than a convenience one. Tracked in
[PROGRESS.md](../dev/PROGRESS.md#known-issues).

### Panic wipe

Triggered from the Profile screen (`src/features/settings/profile-screen.tsx`).
One tap opens a confirmation sheet; three quick taps skip it and wipe
immediately.

1. Remove every private key from the keychain
2. Clear or delete every MMKV partition, including the encrypted wallet file
3. Delete received media from the cache: photos, videos and voice notes

The app is left in a first-run state and drops to onboarding. The process is not
terminated and the sandbox is not otherwise touched.

## 9. Threat Model

### The attacker

Anyone within radio range can transmit anything. They can forge any plaintext
header field (`senderID`, `ttl`, `flags`, `timestamp`), replay captured packets,
mint unlimited identities, and drop or alter anything passing through them. They
cannot break Ed25519, X25519, ChaCha20-Poly1305, or SHA-256 preimage resistance.

### Countermeasures

| Threat                             | Countermeasure                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Message forgery                    | Ed25519 signature verified against the key bound to the claimed sender. A missing key or missing SIGNED flag is a failed check, never a skipped one                                                                                                                                                                                   |
| Identity impersonation             | `peerID == SHA-256(noiseStaticPubKey)[0:16]`, enforced on announces and completed Noise sessions, so a peer ID cannot be claimed without its key                                                                                                                                                                                      |
| Signing-key substitution           | Two tiers. An announce is self-signed, so TOFU pinning holds the first key seen and never replaces it over the air. A key proven inside a Noise session (payload `0x21`) outranks that and may correct a pin an attacker won the race for. No announce can overwrite a proven key, and only an in-person QR scan may re-pin otherwise |
| Capability downgrade               | Announced bits are a discovery hint and never authorise a change in how we send. Encrypted private media is selected only on an authenticated capability, so nobody in radio range can force an attachment into the clear by announcing the bit off                                                                                   |
| Replay                             | Content-derived packet IDs, a deduplicator, and a ±2 minute freshness window on every packet at ingress, so stale packets are neither relayed nor acted on. Solicited sync responses are exempt only when tagged `IS_RSR` and attributable to a request made in the last 30 s. Live voice uses a tighter 30 s window                  |
| Sync amplification                 | `REQUEST_SYNC` and every packet answering one ride at TTL 0, so a rejoining peer's catch-up cannot re-flood the mesh. Responses to one peer are capped at 8 per 30 s                                                                                                                                                                  |
| Man-in-the-middle (session)        | Noise XX mutual authentication, with the authenticated static key required to derive the peer ID it claims                                                                                                                                                                                                                            |
| Traffic analysis (Nostr)           | NIP-17 gift-wrap hides sender, recipient and content from the relay; Tor hides the IP; geohash channels use per-cell ephemeral identities                                                                                                                                                                                             |
| Traffic analysis (BLE)             | Payloads are encrypted and padded to fixed buckets, so an observer sees uniform random bytes                                                                                                                                                                                                                                          |
| Relay censorship                   | Several relays are queried in parallel, so any single relay failure is transparent                                                                                                                                                                                                                                                    |
| Forged departure                   | A LEAVE is checked against the pinned signing key before the relay decision, so an unverifiable one is neither acted on nor passed to nodes that may check less strictly. See [PROTOCOLS.md section 3.6](PROTOCOLS.md#36-leave-is-verified-before-it-is-relayed)                                                                      |
| Sybil flooding                     | TTL bounds propagation. The registry and radar are capped with oldest-first eviction that never drops a peer holding a real BLE link                                                                                                                                                                                                  |
| Key compromise (session)           | Noise XX forward secrecy, so past sessions stay safe if a static key later leaks                                                                                                                                                                                                                                                      |
| Key compromise (DM history)        | Double Ratchet per-message keys seeded from the Noise exporter secret rather than the public transcript hash, so the chain is not derivable by observers                                                                                                                                                                              |
| Malicious relay injecting messages | A relay cannot produce the sender's signature, and forwarding is separate from delivery                                                                                                                                                                                                                                               |
| Confused-deputy delivery           | Directed packets are relayed but rendered only by the addressee, so a relay never surfaces someone else's private content                                                                                                                                                                                                             |
| Group takeover                     | A group keeps the creator it was created with, and a state naming a different creator is refused even at a higher epoch. Enforced in two places, since a group state can either update or delete a group: the store pins it for every write, and `groupStateAction` pins it before the removal branch, which never reaches the store  |
| Group eviction by a stranger       | A group ID travels in the clear on every group message so relays can carry it. Without the ordering above, anyone who saw one could craft a self-signed state naming themselves creator with a roster omitting the victim, and the victim's client would destroy its own key and drop the room. The creator pin is checked first      |
| Hostile payment source             | Ecash is redeemed only from a mint the user already added, and incoming proofs are DLEQ-verified before anything is stored                                                                                                                                                                                                            |
| Cashu double-spend                 | The mint enforces this with blind-signature tracking; the receiver redeems promptly                                                                                                                                                                                                                                                   |
| Physical device seizure            | Panic wipe by triple-tap, with keys in the keychain, hardware-backed on modern devices. Attachments are swept at seven days, so a stored photo does not outlive its conversation                                                                                                                                                      |
| Screen surveillance                | Backgrounding blurs sensitive content through the standard OS API. Notification previews are withheld by default, since the system renders them on the lock screen                                                                                                                                                                    |

### Out of scope

- **Physical proximity.** BLE mesh reveals that you are near certain peers.
- **A stable peer ID.** It derives from the long-term Noise key and does not rotate, so the same device is linkable across sessions until the identity is regenerated. Only per-cell geohash identities are ephemeral.
- **Attachment confidentiality in a public room.** A photo posted to `#bluetooth` is signed but not encrypted, exactly like the text beside it. A private attachment is sealed inside the recipient's Noise session (payload `0x20`) whenever they have proven they can read one; the signed cleartext form survives only for peers that have not, and it is the wire form bitchat is retiring. Media stays restricted to `#bluetooth` and mesh DMs, and is never bridged.
- **The fact that Tor is in use.** There are no bridges or pluggable transports on either platform, so the first hop is a direct connection and deep packet inspection sees it. See [section 8](#8-privacy-and-tor).
- **Traffic timing correlation.** An observer watching several BLE radios could infer communication patterns.
- **Courier mail linkability.** The courier recipient tag is keyed on the recipient's public Noise key, which every announce broadcasts, so anyone in radio range can compute a peer's tags for any day and follow their mail. Inherited from bitchat, which documents the same flaw. Fixing it needs a coordinated v2 tag. See [PROTOCOLS.md section 6](PROTOCOLS.md#6-store-and-forward-courier-constants).
- **Public message authorship, some of the time.** Origin TTL for public messages is drawn from 5 to 7 rather than fixed at the maximum, which removes the deterministic "this radio authored it" marker but not the top of the range.
- **Who you are talking to on the mesh.** Packet headers carry sender and recipient IDs in the clear, as bitchat's do.
- **A compromised OS.** All guarantees are void.
- **Mint trust.** Cashu requires trusting the mint to honour redemption.

Not every packet is signed. Noise handshake messages are unsigned, matching
bitchat, because the peer may not hold our signing key yet and the handshake
authenticates itself. Messages inside a Noise session or a ratchet carry no
redundant signature, since the session already authenticates them. Signatures are
required where a claimed sender is otherwise unverifiable: announces, public and
private channel messages, attachments, voice frames, board posts and gateway
uplinks.

## 10. Localization

Airhop ships in English. Every user-facing string lives in one catalog,
`src/i18n/locales/en.ts`, and a second language is a second file. Working
reference: [`.github/skills/i18n.md`](../../.github/skills/i18n.md).

### Why this is a protocol concern

The app is scoped to blackouts, protests and disasters. The languages that
matters in are Persian, Arabic, Urdu, Bengali, Hindi, Tamil, Indonesian,
Filipino, Nepali, Ukrainian and Russian. An English-only UI during a network
shutdown in Tehran or Dhaka does not work for the person it was built for, and
every other feature in this document is downstream of someone being able to read
the join button.

Ten languages land in v1.3.0 (see [ROADMAP.md](../design/ROADMAP.md)). The work
in this release is the part that touches screens, so that one touches none.

### Scope

| This release                                                     | v1.3.0                                                    |
| ---------------------------------------------------------------- | --------------------------------------------------------- |
| Every user-facing string in one catalog                          | Nine more catalogs                                        |
| Zero hardcoded strings, enforced in CI (`i18n:audit -- --max 0`) | Locale store and in-app picker                            |
| Plurals through `tPlural`, never concatenation                   | CLDR plural rules beyond English's one/other              |
| Stylesheets on logical properties, so RTL is a catalog away      | Device language negotiation                               |
| Formatting centralised in `src/utils/format.ts`                  | Translated OS permission dialogs and service notification |

A language reaches a user by being listed in `src/i18n/languages.ts`, and it can
be listed only once its catalog compiles, which requires every key. There is no
coverage threshold and no partial state to manage.

### Decisions

| Decision                                                   | Rationale                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bundled catalogs, never fetched                            | A translation download is a network call and a fingerprint, and it would fail in exactly the conditions this app exists for. Every locale compiles into the bundle, so text is byte-identical on every device running a given build                                             |
| No i18n library                                            | i18next and react-intl bring namespaces, lazy network backends and untyped runtime keys, none of which suits an offline-first app with a bundled catalog. The codebase already hand-rolls its sheet, alert, toast and theme layers                                              |
| Completeness enforced by `tsc` rather than a test          | Every locale is `Record<TranslationKey, string>` derived from `en.ts`, so a partial locale does not compile. bitchat needs `LocalizationCoverageTests.swift` because `.xcstrings` permits partial locales; here one cannot be constructed                                       |
| The runtime carries what the shipped catalog needs         | One language needs no locale store, plural polyfill, device negotiation or picker. Each arrives with the language that requires it, listed in the skill file                                                                                                                    |
| Strings the OS renders stay where the OS reads them        | iOS permission dialogs live in `app.json` and the Android service notification in Kotlin. Routing them through the catalog costs a generated per-locale bundle or a bridge call, and both arrive with the second language                                                       |
| Prose numerals follow the locale, machine data stays Latin | A byte count, a clock time and a wallet balance sit in the monospace face next to Latin units. Numbers inside a translated sentence get no override                                                                                                                             |
| Keys named after bitchat's                                 | bitchat is public domain, ships 30 languages, and its catalog is vendored here. A key matching theirs is a translation that can be lifted rather than commissioned, which is the largest single lever on the cost of the effort                                                 |
| Counts go through `tPlural`, never concatenation           | `"item" + "s"` is untranslatable: no language outside English pluralises by appending to the stem, Russian needs four forms and Arabic six. Eight were found and fixed during extraction. The English one/other rule lives in the runtime, where CLDR selection will replace it |
| Translation never happens at module load                   | A module constant holding `t("key")` type-checks, renders correctly, and freezes in whichever language the app started in. Constants hold `TranslationKey`s and the component translates on render. `npm run i18n:audit` fails the build on it and found 25 on its first run    |
| Terminal punctuation is checked, not reviewed              | A string that starts a second sentence must finish it. A stop in the middle and none at the end reads as truncated, and a screen reader runs the two halves together. Translators copy English punctuation, so it is settled before nine more catalogs inherit it               |

### What never gets translated

Some strings cross the wire or derive an identity, so a translated variant is an
interop bug rather than a cosmetic one. The full list is in the skill file and
`catalog.test.ts` enforces it. The two that matter most:

- **The username word lists** (`src/utils/username.ts`). A generated name must resolve identically on every device and in bitchat.
- **The transmitted `/hug` and `/slap` text.** It is sent as message content, and bitchat/ios recognises an incoming emote by matching the English substrings in `ChatPublicConversationCoordinator.swift`. bitchat is fully localized and still keeps these as English literals for the same reason.

Terms of Service and Privacy Policy stay in English with the reader chrome around
them translated. English is the authoritative version, and a machine-translated
liability clause is not something to ship.

### Consistency across devices

Text is identical everywhere because it is compiled in. What varies:

| Varies                                        | Handling                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Intl` date and number output, per OS and OEM | Centralised in `src/utils/format.ts`, formatted in the app's language rather than the device's, with cached formatters and Latin numerals for machine data                                                                                                                                                                                                  |
| Font glyph coverage for non-Latin scripts     | Monospace is restricted to machine data, so translated prose never uses it                                                                                                                                                                                                                                                                                  |
| `Intl` availability across engines            | Hermes ships a partial Intl: `DateTimeFormat`, `NumberFormat` and `Collator` are present, `PluralRules` is not, on either platform. Nothing calls the missing one. Plural selection is English's one/other, decided in `src/i18n/index.ts`. A second language needs `@formatjs/intl-pluralrules`                                                            |
| Cached reverse-geocoded place names           | These come from the OS geocoder, which answers in the device's language and takes no locale argument on either platform. `place-names-store.ts` keys its cache on that language, sampled once at startup, so changing the phone's language re-resolves rather than leaving channels labelled in the old one. This is the only place device language is read |
| Layout direction on an RTL device             | React Native mirrors the whole layout when the device is set to Arabic or Hebrew, which would put English text in a right-to-left frame. `initI18n()` pins direction to the app's language at startup. It becomes language-driven the day an RTL catalog ships                                                                                              |

## 11. Codebase Layout

Anything that compiles to JS lives in `src/`. Anything that touches hardware
lives in `android/` or `ios/`.

| Path            | Holds                                                                    |
| --------------- | ------------------------------------------------------------------------ |
| `android/`      | Kotlin BLE module and the foreground service that keeps the mesh alive   |
| `ios/`          | Swift BLE module built on CoreBluetooth                                  |
| `src/bridge/`   | TurboModule specs, the only place native and TypeScript meet             |
| `src/core/`     | The protocol in pure TypeScript: crypto, mesh, nostr, payments, routing  |
| `src/services/` | Long-lived runtime wiring, chiefly the mesh service that owns the radios |
| `src/features/` | Screens and screen-level logic                                           |
| `src/store/`    | Zustand state with MMKV persistence                                      |
| `src/ui/`       | Shared components and theme tokens                                       |
| `src/utils/`    | Stateless helpers                                                        |
| `src/i18n/`     | Translation runtime and the bundled English catalog                      |
| `assets/data/`  | Bundled relay list, refreshed by CI                                      |

`src/core/` has no native dependencies, so the whole protocol is testable in CI
without a phone. The suite covers the wire format, the handshakes and the routing
while the radios stay unproven until a field test.

Because every feature lives in `src/core/` and the native layer exposes an
identical TypeScript interface on both platforms, a fix in gossip sync fixes iOS
and Android at once and protocol changes ship together.

Gradle builds `android/` into an `.aab` and Xcode builds `ios/` into an `.ipa`.
EAS Build runs both in parallel, and the stores treat the result as a fully
native app.

## 12. Native Modules

Hardware requires native code. Routing, crypto, Nostr and payments do not, and
native code is harder to test, keep consistent across platforms and reason about.
So there is one module per hardware capability and no more.

| Module                               | Platform | Capability                                               |
| ------------------------------------ | -------- | -------------------------------------------------------- |
| `AirhopBLEModule`                    | Both     | BLE GATT Peripheral and Central, radio state, power mode |
| `AirhopVoiceModule`                  | Both     | AAC-LC capture and playback for voice notes and PTT      |
| `AirhopWiFiModule`                   | Android  | WiFi Aware same-platform fast path                       |
| `AirhopMCModule`                     | iOS      | MultipeerConnectivity same-platform fast path            |
| `AirhopTorModule`, `AirhopTorSocket` | iOS      | Embedded Arti and the SOCKS socket it fronts             |

None of them knows anything about packets, routing or encryption.

### The native contract

Bridge specs live in `src/bridge/`, and React Native Codegen turns them into the
native bridge for both platforms. Bytes cross base64-encoded, the only
representation both runtimes agree on safely.

`src/bridge/NativeAirhopBLE.ts` is the largest, at twelve methods:

1. `startAdvertising` / `stopAdvertising`: GATT Peripheral
2. `startScanning` / `stopScanning`: GATT Central
3. `writeToLink`: raw bytes to a connected peer
4. `getRadioState`: support, power, authorization, location and battery in one answer
5. `setPowerMode`: how hard to run the radios
6. `requestEnableBluetooth` / `openLocationSettings`: one-tap fixes for the Mesh banner
7. `setBackgroundServiceEnabled`: hold the process up, independent of advertising
8. `getTorProxyPort` / `getTorAvailability`: whether a SOCKS proxy is routing

Native calls back with six events: `packetReceived`, `linkConnected`,
`linkDisconnected`, `rssiUpdated`, `adapterStateChanged` and `powerStateChanged`.

Anything richer would put protocol knowledge on the native side, which this
design exists to prevent.

### Background execution

| Platform       | Mechanism                                           | Result                                   |
| -------------- | --------------------------------------------------- | ---------------------------------------- |
| iOS Central    | `UIBackgroundModes: bluetooth-central`              | Receives BLE data in background          |
| iOS Peripheral | `UIBackgroundModes: bluetooth-peripheral`           | Keeps advertising, with the caveat below |
| iOS Suspended  | `CBCentralManagerOptionRestoreIdentifierKey`        | iOS restarts the app on a BLE event      |
| Android        | `AirhopForegroundService` (persistent notification) | Survives Doze and battery optimization   |
| Android        | `FOREGROUND_SERVICE_CONNECTED_DEVICE` permission    | Required on Android 14+                  |

A backgrounded iPhone is not discoverable from Android. Once the app leaves the
foreground, CoreBluetooth moves the service UUID into the advertisement's
overflow area and drops the local name, where only another iOS device scanning
for that exact UUID can see it. iPhone-to-iPhone still works, iPhone-to-Android
discovery stops until the app is reopened, and an already connected link keeps
carrying traffic. Android has no equivalent restriction, since the foreground
service keeps it advertising normally.

## 13. Decision Log

### Nostr over Matrix, XMPP or Signal

| Protocol        | Verdict      | Reason                                                                                                                                            |
| --------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Matrix          | Rejected     | Requires a homeserver, which is a single point of failure. Federated but not serverless                                                           |
| XMPP            | Rejected     | Also requires an always-on server, with a complex extension ecosystem and a limited offline story                                                 |
| Signal Protocol | Rejected     | Signal owns the relay infrastructure and requires a phone number, so it is not permissionless                                                     |
| SimpleX         | Close second | No persistent identifiers and privacy-first, but no BLE mesh story, a smaller ecosystem and fewer relays                                          |
| Nostr           | Chosen       | Permissionless keypair identity, 350+ independent relays, NIP-17 gift-wrap for DMs, NIP-61 for payments, and bitchat already validated the choice |

### Noise XX over TLS or X3DH

- TLS requires CAs and server certificates, which a serverless system cannot have
- X3DH alone does not mutually authenticate: the receiver does not authenticate the sender in the handshake
- Noise XX gives mutual authentication and forward secrecy with no CAs, is proven in WireGuard, and is what bitchat uses

### Cashu over Lightning alone

- Lightning needs internet at the moment of payment, since routing happens live
- Cashu tokens are strings that flow over BLE like any message
- Transfer is fully offline and redemption happens later
- NIP-61 integrates Cashu with Nostr identity for online payments

### Double Ratchet alongside Noise XX

- Noise XX gives forward secrecy per session, with a new key on each reconnect
- It does not give per-message forward secrecy within a session
- Double Ratchet rotates keys per message, so one message's key does not expose its neighbours
- It also covers offline mail: a ratcheted message sent by courier keeps forward secrecy while the recipient is away

## 14. Dependencies

### Core

| Package                          | Version | Purpose                                                          | License |
| -------------------------------- | ------- | ---------------------------------------------------------------- | ------- |
| `@noble/curves`                  | `^2.2`  | X25519, Ed25519 (Noise XX, signing)                              | MIT     |
| `@noble/ciphers`                 | `^2.2`  | ChaCha20-Poly1305 (Noise, Nostr NIP-44)                          | MIT     |
| `@noble/hashes`                  | `^2.2`  | SHA-256, HKDF, HMAC                                              | MIT     |
| `react-native-get-random-values` | `~1.11` | Polyfill `crypto.getRandomValues` for @noble (Expo SDK 57 pin)   | MIT     |
| `nostr-tools`                    | `^2.24` | Nostr client, NIP-17/59 gift-wrap                                | MIT     |
| `react-native-encrypted-storage` | `^4.0`  | Private key storage (Keychain/Keystore)                          | MIT     |
| `react-native-mmkv`              | `^4.3`  | Fast JSI key-value store (requires `react-native-nitro-modules`) | MIT     |
| `react-native-nitro-modules`     | `^0.36` | Peer dependency for react-native-mmkv v4                         | MIT     |
| `zustand`                        | `^5.x`  | State management                                                 | MIT     |

### Transport

| Package                  | Version  | Purpose                   | License |
| ------------------------ | -------- | ------------------------- | ------- |
| Custom `AirhopBLEModule` | internal | BLE GATT Server + Central | N/A     |

### Media and voice

| Package              | Version | Purpose                                     | License |
| -------------------- | ------- | ------------------------------------------- | ------- |
| `expo-audio`         | `~57.0` | Voice note and PTT capture and playback     | MIT     |
| `expo-video`         | `~57.0` | Inline video playback                       | MIT     |
| `expo-camera`        | `~57.0` | Photo capture and QR scanning               | MIT     |
| `expo-file-system`   | `~57.0` | Attachment cache on disk                    | MIT     |
| `expo-image-picker`  | `~57.0` | Picking photos and videos to send           | MIT     |
| `expo-media-library` | `^57.0` | Saving received media to the device gallery | MIT     |

### Payments

| Package           | Version | Purpose                              | License |
| ----------------- | ------- | ------------------------------------ | ------- |
| `@cashu/cashu-ts` | `^4.7`  | Cashu ecash wallet operations        | MIT     |
| `@scure/bip39`    | `^2.0`  | BIP-39 recovery phrase (NUT-13 seed) | MIT     |

### UI

| Package                        | Version | Purpose                         | License |
| ------------------------------ | ------- | ------------------------------- | ------- |
| `react-native-reanimated`      | `^4.x`  | Hardware-accelerated animations | MIT     |
| `react-native-gesture-handler` | `^2.32` | Gestures, sheets, swipe actions | MIT     |
| `react-native-qrcode-svg`      | `^6.3`  | Rendering the contact card QR   | MIT     |

There is no navigation library. `App.tsx` holds a hand-rolled four-tab state
machine and screens are plain components. Styling is StyleSheet plus the theme
tokens in `src/ui/`, with no Tailwind or NativeWind.

### Build toolchain

| Tool                               | Version  | Purpose                                        |
| ---------------------------------- | -------- | ---------------------------------------------- |
| `expo`                             | `SDK 57` | Bare workflow, EAS Build, config plugins       |
| `react`                            | `^19.2`  | Required by React Native 0.86 (peer dep)       |
| `react-native`                     | `^0.86`  | New Architecture (default since 0.76)          |
| `typescript`                       | `~6.0.3` | Strict mode, no `baseUrl`, `./`-prefixed paths |
| `jest`                             | `^29`    | Unit tests for all of `src/core/`              |
| `prettier`                         | `^3.9`   | Formatting                                     |
| `prettier-plugin-organize-imports` | `^4.3`   | Auto-sort import blocks                        |
