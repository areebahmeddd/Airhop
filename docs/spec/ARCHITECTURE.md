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

| Feature                   | Offline (BLE)            | Online (Nostr)      | Notes                                                                                                                                                                                            |
| ------------------------- | ------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Peer discovery            | Yes, announce broadcasts | Yes, kind 20001     | Peers show on the mesh radar and in the location cell                                                                                                                                            |
| Public channels           | Yes, TTL flood           | Yes, kind 20000     | `#bluetooth` stays local; `#block` to `#region` also bridge                                                                                                                                      |
| Private channels          | Yes, sealed `0x50`       | Optional, same blob | Airhop only. Key rides an invite link, no member cap                                                                                                                                             |
| Private groups            | Yes, sealed `0x25`       | No                  | bitchat compatible. Creator-signed roster, max 16, Bluetooth only                                                                                                                                |
| Private DMs               | Yes, Noise XX (+DR)      | Yes, NIP-17 wrap    | Receipts on every path. DR only between Airhop peers                                                                                                                                             |
| Bulletin board            | Yes, signed `0x23`       | Yes, kind 1 mirror  | Public and signed, 1 to 7 day expiry, gossip catch-up                                                                                                                                            |
| Voice notes               | Yes, as a file           | No                  | Recorded AAC, not live                                                                                                                                                                           |
| Location pin              | Yes, sealed `0x50`       | No                  | One point in a DM, sent once. No live sharing, no map, never couriered                                                                                                                           |
| Video sharing             | Yes, as a file           | No                  | Recorded and played inline. Live streaming is not possible across platforms                                                                                                                      |
| File transfer             | Yes, per-type caps       | No                  | 512 KiB photos and voice, 1 MiB otherwise. Enforced by bitchat's decoder, so not ours to raise                                                                                                   |
| Store-and-forward courier | Yes, sealed envelope     | Yes, parked drop    | 24 hour life, as bitchat carriers enforce. Sealed to a one-time prekey for forward secrecy                                                                                                       |
| Live push-to-talk         | Yes, `0x29` bursts       | No                  | AAC-LC 16 kHz mono, 350 ms jitter buffer. Also shipped by bitchat, so it works between the two                                                                                                   |
| Payments (Cashu)          | Yes, token in a message  | Yes, NIP-61 nutzap  | Transfer works offline, redemption needs internet                                                                                                                                                |
| Contact verification      | Yes, QR or safety number | n/a                 | Two ways in: a camera scan, or reading a six-word safety number to each other. `source` records how keys arrived, `verification` whether a human checked. Only an in-person scan may re-pin keys |
| Panic wipe                | Yes                      | Yes                 | Panic button on Profile. Destroys keys, messages, groups, board, prekeys                                                                                                                         |
| Internet gateway          | Relays for others        | Yes                 | Off by default. Carries public location traffic for offline peers                                                                                                                                |
| Tor routing               | n/a                      | Yes                 | Arti on iOS, Orbot on Android. BLE is local, so nothing to route                                                                                                                                 |
| Relay discovery           | n/a                      | Yes                 | Bundled CSV, refreshed from the georelays repo                                                                                                                                                   |
| bitchat compatibility     | Yes                      | Yes                 | Same wire format both directions. Airhop-only types are ignored by bitchat                                                                                                                       |

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
peerID 3a9f2c1b -> "swift-falcon-3a9f"
```

A name cannot be claimed without the key it comes from, so no Airhop user can
take another's. It does not make impersonation impossible on the mesh: a bitchat
peer chooses its own nickname freely and Airhop renders what it announces, which
is why a public-channel sender is always shown with a `#last4` suffix taken from
the peer ID.

Your generated nickname is fixed after setup. Real identity is confirmed
separately, two ways:

- **Scanning their QR in person.** The camera witnesses the exchange, so this is
  also the only route allowed to re-pin keys already bound to a peer ID.
- **Comparing a safety number.** Six words derived from both parties' Noise and
  signing keys, identical on both phones, read to each other over a channel they
  trust. Confirms keys already held rather than importing any, so it grants no
  re-pinning power and needs none. This is what lets somebody you can only reach
  by call or radio be verified at all.

Both earn the same badge. `source` records how the keys arrived (`qr`, `link` or
`manual`), `verification` records whether a human has checked them; they are
independent, so a contact learned from a link can be verified on a call.

Either person may assign the other a local nickname once their keys are held.
That label never leaves the device and never touches the cryptographic identity,
and the sheet keeps showing the name the peer chose beside it.

### Anti-impersonation

- Every packet carries an Ed25519 signature from the sender.
- Receivers verify signatures before displaying or acting on a message.
- Unsigned and invalid-signature packets are dropped before display.
- Relaying is separate from verification. A node forwards opaque bytes it may not
  be able to check, since it may not hold the sender's key yet, and the flood
  router runs before per-type verification.

### Key storage

| Secret               | Storage                         | Backed by                         |
| -------------------- | ------------------------------- | --------------------------------- |
| `noiseStaticPrivKey` | `expo-secure-store`             | iOS Keychain / Android Keystore   |
| `signingPrivKey`     | `expo-secure-store`             | iOS Keychain / Android Keystore   |
| Wallet AES-256 key   | `expo-secure-store`             | iOS Keychain / Android Keystore   |
| Nutzap P2PK privkey  | `expo-secure-store`             | iOS Keychain / Android Keystore   |
| Recovery phrase      | `expo-secure-store`             | iOS Keychain / Android Keystore   |
| Cashu proofs         | `react-native-mmkv` (AES-256)   | File encrypted with the key above |
| Active sessions      | `react-native-mmkv` (encrypted) | RAM-backed, not persisted         |
| Message history      | `react-native-mmkv`             | Encrypted at rest, panic-wipeable |

All five go through `src/core/crypto/keychain.ts`; nothing else calls
`expo-secure-store` directly. The module exports a union type of the item names,
so a caller cannot write a secret outside the registry.

That registry is what the panic wipe walks, since `expo-secure-store` has no
delete-all. A secret stored under an ad-hoc key would survive the wipe. Every
item is attempted even after one fails, and anything left behind is reported as
`keysDestroyed: false` rather than as success.

Items are written `AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY` rather than the
`WHEN_UNLOCKED` default. `AFTER_FIRST_UNLOCK` because iOS relaunches the app on a
BLE event after termination and that relaunch must load the identity to join the
mesh; `WHEN_UNLOCKED` refuses the read on a locked phone. `THIS_DEVICE_ONLY`
because the default class is included in encrypted iCloud and iTunes backups and
restorable onto another device. The trade is that the keychain is unreadable
between boot and the first unlock.

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
  BLE Mesh          - recipient is nearby, confirmed by announce
  WiFi Aware        - both parties have it active and are in range (~30m), and on iOS are paired

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

### LAN transport

WiFi Aware is a radio protocol rather than a way of using a network: two phones
on the same router cannot reach each other over it, and it cannot cross
platforms, because Apple demands a paired data path that Android cannot
complete. So an iPhone and an Android sharing a WiFi network have no local path
between them, which is the gap on a ship, in a hotel, at a conference, or
anywhere with WiFi and no route out.

mDNS discovery on `_airhop-mesh._tcp` plus TCP links closes it. The links carry
the same packet frames BLE carries, so the mesh engine needs no new concept and
the wire format does not move. Being ordinary IP, it is platform-neutral, and
it carries the whole mesh rather than only the parts Nostr can express.
Tracked in [#38](https://github.com/areebahmeddd/airhop/issues/38).

It sits beside WiFi Aware rather than replacing it. Aware needs no network at
all, which mDNS structurally cannot do; mDNS reaches everyone on a network,
which Aware cannot. Neither is a superset of the other.

| Constraint       | Consequence                                                                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client isolation | Most guest and venue WiFi blocks peer-to-peer traffic at the access point, and it cannot be detected before trying. The UI has to say "no peers on this network" rather than spin |
| mDNS filtering   | Common even where ordinary traffic works. A manual join by address covers it                                                                                                      |
| iOS background   | A TCP socket has no equivalent of `bluetooth-central`, so a locked iPhone drops the link. A foreground accelerator, which WiFi Aware already is on iOS                            |

### Same-platform WiFi

Both platforms run WiFi Aware, the Wi-Fi Alliance's NAN. Same protocol, same
service name, same length-prefixed frames, one TypeScript contract
(`src/bridge/NativeAirhopWiFi.ts`) and one reconciler
(`src/services/wifi-controller.ts`).

> [!IMPORTANT]
> It is still not a cross-platform path. Apple requires a paired device for
> every data path and refuses an open one; Android cannot complete Apple's
> pairing. So this is an Android-to-Android or iPhone-to-iPhone accelerator, and
> anything crossing platforms uses Bluetooth or Nostr. The iOS module is not the
> MultipeerConnectivity one that was written, never worked on a device and was
> removed: that was proprietary AWDL, and it stays gone.

- Android: [`WifiAwareManager`](https://developer.android.com/develop/connectivity/wifi/wifi-aware), 250 Mbps, no internet or router. Discovery is API 26, but the data path needs API 29: the peer's address is a link-local IPv6 delivered in `WifiAwareNetworkInfo`, which does not exist before then, so below API 29 the transport reports itself unavailable and BLE carries everything. Android 17 additionally gates the socket behind `ACCESS_LOCAL_NETWORK`, declared already
- iOS: [`WiFiAware`](https://developer.apple.com/documentation/WiFiAware) on Network framework, iOS 26 and iPhone 12 or later. Needs the `com.apple.developer.wifi-aware` entitlement, which is a managed capability rather than a switch in Xcode, and the service declared in `Info.plist` under `WiFiAwareServices`
- Same `Transport` interface as BLE, so the mesh engine does not know which radio it has
- Carries what BLE cannot: a whole attachment in one write rather than hundreds of fragments the radio can drop

Three things are true only on iOS, and each shapes the code:

| Constraint                                                                                                                                        | Consequence                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No unpaired mode. Every target a listener or browser can name comes from the app's paired list, and the only way into that list is a system sheet | A pairing gate in the controller, a second native module for the sheet (`AirhopWiFiPairing`), and a `unpaired` state that is reported rather than retried, because only a pairing changes it                           |
| Discovery is symmetric, and Apple exposes no `serviceSpecificInfo` to break a tie with before connecting                                          | An 8-byte token exchanged as the first frame of every connection. Both ends keep the one whose initiator holds the lower token, and the loser is closed before TypeScript is ever told a link existed                  |
| `NetworkConnection` has no cancel. A connection ends when the last reference to it is dropped                                                     | One task per link owns its connection for the whole life of the link. Closing means cancelling that task, not calling a method, and the registry entry is removed on the way out or the connection outlives its reader |

Pairing is also two-sided, the way Bluetooth pairing is: one phone browses and
the other advertises, at the same moment. That is a user-visible cost with no
one-tap version to build, so it lives on one screen (Settings, Network) that
says which half each person is playing, rather than being hidden behind a button
that would work half the time.

### Nostr

- 300+ public relays from the georelays dataset, bundled as `assets/data/nostr_relays.csv`
- Relays selected by [Haversine](https://en.wikipedia.org/wiki/Haversine_formula) distance from the device, for lowest latency
- NIP-17-shaped gift-wrap for private DMs, so no message content or metadata reaches relays. The layering is NIP-17's; the encryption inside each layer is bitchat's `nip44-v2` rather than the published NIP-44, and has to be, since the event signature covers the ciphertext and interop is byte-for-byte. See [PROTOCOLS.md section 7.1](PROTOCOLS.md#71-the-nostr-dm-construction-is-not-the-published-nip-44)
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
| Nostr DM         | bitchat's `nip44-v2` inside a NIP-17-shaped gift-wrap. See below           |

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

- Sealed with XChaCha20-Poly1305 and broadcast as `0x50`
- Reach is the creator's choice: Bluetooth only, or Bluetooth plus Nostr, where the same sealed blob is published so out-of-range members receive it
- bitchat relays `0x50` without interpreting it, so the two coexist

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
sheet, Wallet Zap) calls `payPerson` in `services/payment-router.ts`, so the four
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
3. Empty the cache directory. Not just the files Airhop prefixes: a sent
   document, a sent video, an image small enough to send unmodified and the
   saved QR card all live under other names or in the pickers' own
   subdirectories, and every one of them used to survive
4. Stop Arti and delete its data directory (iOS). It sits under Application
   Support rather than the cache, and holds a cached consensus, chosen guard
   nodes and timestamps, which is evidence that this device used Tor and roughly
   when
5. Take every delivered notification out of the system tray. Each carries a
   sender name and a message preview, and they outlive the process

The keychain step is best-effort like the rest, and the wipe continues past a
failure rather than abandoning the data. It is the one step whose outcome is
reported: `panicWipe` returns `keysDestroyed`, and the Profile screen says so
when the OS refused, because a locked keychain on a booted-but-unlocked device
is exactly the seizure case and "your keys are gone" must never be claimed
falsely.

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
| Physical device seizure            | Panic wipe by triple-tap, with keys in the keychain, hardware-backed on modern devices. Attachments are swept on a schedule (Privacy -> Keep media for: 7 days by default, 14 or 30 by choice, with no unbounded option), so a stored photo does not outlive its conversation                                                         |
| Screen surveillance                | Notification previews are withheld by default, since the system renders them on the lock screen, and a screenshot taken inside a chat is announced to the other side. Airhop does not cover the app-switcher snapshot                                                                                                                 |

### Out of scope

- **Physical proximity.** BLE mesh reveals that you are near certain peers.
- **A location you chose to send.** A location pin carries real coordinates. It is encrypted inside the recipient's Noise session, so no relay can read it, but the recipient holds it and can do what they like with it, including screenshotting it. Sent only on an explicit tap, to one contact, never automatically, never as a reply in kind, and never forwarded onward by the app.
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

Airhop ships in 35 languages. Every user-facing string lives in one catalog per
language under `src/i18n/locales/`, compiled into the bundle: 1,535 strings and
27 plural keys, byte-identical on every device. Working reference:
[`.github/skills/i18n.md`](../../.github/skills/i18n.md).

### Why this sits in the spec

The app is scoped to blackouts, protests and disasters. The languages spoken
there are Persian, Arabic, Urdu, Hindi, Bengali, Punjabi, Tamil, Indonesian,
Filipino, Nepali, Ukrainian and Russian. An English-only UI during a shutdown in
Tehran or Dhaka does not reach the person it was built for.

Three of those read right to left and several are written in scripts with
rendering rules the code has to know about, so this is a correctness concern
rather than a presentation one. A mention that never fires, a name that reorders
the punctuation around it and a row frozen in last week's language are all
silent: nothing looks broken, and the feature simply does not work.

### Decisions

| Decision                                         | Rationale                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bundled catalogs, never fetched                  | A translation download is a network call and a fingerprint, and it would fail in exactly the conditions this app exists for                                                                                                                                                                             |
| No i18n library                                  | i18next and react-intl bring namespaces, lazy network backends and untyped runtime keys, none of which suits an offline-first app with a bundled catalog                                                                                                                                                |
| Completeness enforced by `tsc`                   | Every locale is `Record<TranslationKey, string>` derived from `en.ts`, so a partial locale does not compile and needs no runtime fallback                                                                                                                                                               |
| Plural rules hand-written, not polyfilled        | Hermes has no `Intl.PluralRules`. 35 languages reduce to nine CLDR rule shapes, so `plurals.ts` is nine functions rather than a dependency plus a locale-data module per language. `plurals.test.ts` checks every rule against Node's ICU                                                               |
| Device language read through `Intl`              | `Intl.DateTimeFormat().resolvedOptions().locale` is present on Hermes on both platforms. `expo-localization` would mean a config plugin against native trees that must never see `prebuild`                                                                                                             |
| Translation happens at display, never at storage | A `t()` result written into MMKV freezes in the language of the day it was stored. Persisted rows keep a `systemKey` and translate on render                                                                                                                                                            |
| A right-to-left switch waits for the next launch | React Native fixes layout direction at process start and iOS has no sanctioned self-restart, so the preference is stored and applied next launch. Both facts it depends on are read rather than assumed: `I18nManager.isRTL` for the direction in force, `frameLanguage` for the language it belongs to |
| Every substituted value is bidi-isolated         | A placeholder holds text of unknown direction. Unisolated, the bidirectional algorithm resolves the punctuation around it against whichever way that text reads, so an Arabic name in an English sentence drags the comma to the wrong side. One wrap in `interpolate` covers every key                 |
| Word boundaries are Unicode, not ASCII           | A closing `[\s.,!?;:]` is the punctuation of a third of these languages, so "@name。" has to count as a mention or it passes no mute and raises no notification. Comparisons normalise to NFC, since two keyboards spell the same accented character differently                                        |
| One digit system, locale grouping                | Every number the app renders uses Latin digits, prose counts included, and `catalog.test.ts` forbids a catalog its own. Grouping still follows the locale, which is the half that helps: Hindi and Tamil group by lakh                                                                                  |
| Strings the OS renders stay where it reads them  | Passing them through the app would mean a native shim on both platforms for a permission dialog and a notification. `npm run i18n:native` holds them to the shipped set instead                                                                                                                         |
| A generated pseudolocale, debug builds only      | `qps-ploc` accents every string, brackets it and pads it past the longest real translation of the same key, so a layout can be proven against all 35 languages at once without reading any of them                                                                                                      |

### Which language each surface follows

Both platforms offer a per-app language of their own: Android 13's picker, which
`res/xml/locales_config.xml` opts into, and iOS's, which appears once a bundle
carries more than one localization. Airhop ships its own as well, because
neither exists below Android 13 and because changing a system setting is not
something to ask of somebody using this app under duress.

Two settings for one question, so the split is deliberate:

| Surface                                             | Follows              |
| --------------------------------------------------- | -------------------- |
| Everything rendered by React Native                 | The in-app picker    |
| iOS permission dialogs, Android's foreground notice | The OS per-app value |
| Reverse-geocoded place names                        | The OS per-app value |

On the default "system" preference the two agree, because the device language is
re-sampled on every foreground edge. Android needs that: it recreates the
Activity for a language change while keeping the JS context alive.

Picking a language explicitly pins the app and leaves the OS-rendered strings on
the system value. Writing through to `LocaleManager.setApplicationLocales` would
close that gap and is not done: it recreates the Activity underneath a live
mesh, in-flight transfers and possibly live voice, for five notification
strings.

### What never gets translated

Some strings cross the wire or derive an identity, so a translated variant is an
interop bug rather than a cosmetic one. `catalog.test.ts` enforces the full
list, which lives in the skill file. The two that matter here:

- **The username word lists** (`src/utils/username.ts`). A generated name must resolve identically on every device, and in bitchat.
- **The transmitted `/hug` and `/slap` text.** bitchat/ios recognises an incoming emote by matching the English substrings.

Terms of Service and Privacy Policy stay in English, with the reader chrome
around them translated. English is the authoritative version.

Nothing on the wire carries a language, a locale or a script. A Persian reader
and an English one are indistinguishable at the protocol layer, and a courier
holding sealed mail for either cannot tell them apart.

### What varies between devices

Text is identical everywhere because it is compiled in. Three things are not:

| Varies                                        | Handling                                                                                                                                                                                                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Intl` date and number output, per OS and OEM | Centralised in `src/utils/format.ts`, formatted in the app's language rather than the device's, with cached formatters and Latin digits throughout                                                                                                           |
| Font glyph coverage for non-Latin scripts     | JetBrains Mono covers Latin, Greek and Cyrillic and none of the other ten scripts shipped, so the monospace face is reserved for machine data: a value from a formatter or a constant may use it, a value through a catalog key is prose                     |
| Cached reverse-geocoded place names           | The OS geocoder answers in the device's language. Both native APIs accept a locale and `expo-location` exposes neither, and a native shim for a room-header label is not worth it, so `place-names-store.ts` keys its cache on that language and re-resolves |

## 11. Codebase Layout

Anything that compiles to JS lives in `src/`. Anything that touches hardware
lives in `android/` or `ios/`.

| Path             | Holds                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| `android/`       | Kotlin BLE module and the foreground service that keeps the mesh alive   |
| `ios/`           | Swift BLE module built on CoreBluetooth                                  |
| `src/app/`       | The root component and the four-tab state machine                        |
| `src/bridge/`    | TurboModule specs, the only place native and TypeScript meet             |
| `src/core/`      | The protocol in pure TypeScript: crypto, mesh, nostr, payments, routing  |
| `src/services/`  | Long-lived runtime wiring, chiefly the mesh service that owns the radios |
| `src/features/`  | Screens and screen-level logic                                           |
| `src/store/`     | Zustand state with MMKV persistence                                      |
| `src/ui/`        | Shared components, hooks, and theme tokens                               |
| `src/platform/`  | Thin wrappers over OS APIs: permissions, haptics, battery settings       |
| `src/utils/`     | Stateless helpers, free of side effects                                  |
| `src/i18n/`      | Translation runtime and the bundled English catalog                      |
| `src/__tests__/` | Whole-app suites: the device harness, lifecycle, and the simulator       |
| `assets/data/`   | Bundled relay list, refreshed by CI                                      |

`src/core/mesh/` is the one subsystem large enough to be grouped further, into
`wire/`, `routing/`, `sync/`, `discovery/`, `rooms/`, `courier/` and `voice/`.
`wire/` is the byte layout this document's [section 4](#4-messaging-protocol)
and [PROTOCOLS.md](PROTOCOLS.md) describe, so a diff that changes the wire
format shows up under one directory.

A module specifier that leaves its top-level layer is written as a path alias
(`@core/mesh/wire/packet-codec`); one that stays inside the layer stays
relative. Aliases live in `tsconfig.json` and are mirrored in `package.json`
for jest.

`src/core/` has no native dependencies, so the whole protocol is testable in CI
without a phone. The suite covers the wire format, the handshakes and the routing
while the radios stay unproven until a field test.

Because every feature lives in `src/core/` and the native layer exposes an
identical TypeScript interface on both platforms, a fix in gossip sync fixes iOS
and Android at once and protocol changes ship together.

Gradle builds `android/` into an `.aab` and Xcode builds `ios/` into an `.ipa`,
and the stores treat the result as a fully native app.

Android is automated end to end. `ci.yaml` builds a full R8-minified release on
every change, so a broken keep rule or a dependency that stops being 16 KB
aligned fails a pull request rather than a tagged release, and `release.yaml`
builds and signs the shipped APK and AAB.

iOS is automated up to signing. `ci.yaml` compiles an unsigned Release build on a
macOS runner, so native and release-only breakage fails the same pull request
Android does. Distribution credentials do not exist yet, so the `ios-release` job
in `release.yaml` is a placeholder and the shipped `.ipa` is still produced by
hand from Xcode.

Neither platform uses EAS. There is no EAS configuration here and there is
unlikely to be: its main draws are prebuild and managed credentials, and this
project does not run prebuild.

## 12. Native Modules

Hardware requires native code. Routing, crypto, Nostr and payments do not, and
native code is harder to test, keep consistent across platforms and reason about.
So there is one module per hardware capability and no more.

| Module                               | Platform | Capability                                               |
| ------------------------------------ | -------- | -------------------------------------------------------- |
| `AirhopBLEModule`                    | Both     | BLE GATT Peripheral and Central, radio state, power mode |
| `AirhopVoiceModule`                  | Both     | AAC-LC capture and playback for voice notes and PTT      |
| `AirhopWiFiModule`                   | Both     | WiFi Aware same-platform fast path                       |
| `AirhopWiFiPairing`                  | iOS      | The system pairing sheet that fast path needs            |
| `AirhopTorModule`, `AirhopTorSocket` | iOS      | Embedded Arti and the SOCKS socket it fronts             |

None of them knows anything about packets, routing or encryption.

### The native contract

Bridge specs live in `src/bridge/`, and React Native Codegen turns them into the
native bridge for both platforms. Bytes cross base64-encoded, the only
representation both runtimes agree on safely.

`src/bridge/NativeAirhopBLE.ts` is the largest, at fourteen methods:

1. `startAdvertising` / `stopAdvertising`: GATT Peripheral
2. `startScanning` / `stopScanning`: GATT Central
3. `writeToLink`: raw bytes to a connected peer
4. `getRadioState`: support, power, authorization, location and battery in one answer
5. `setPowerMode`: how hard to run the radios
6. `requestEnableBluetooth` / `openLocationSettings`: one-tap fixes for the Mesh banner
7. `setBackgroundServiceEnabled`: hold the process up, independent of advertising
8. `getTorProxyPort` / `getTorAvailability`: whether a SOCKS proxy is routing
9. `startVpnWatch` / `stopVpnWatch`: watch the VPN carrying Orbot, while Tor is on

Native calls back with ten events: `packetReceived`, `linkConnected`,
`linkDisconnected`, `rssiUpdated`, `adapterStateChanged`, `powerStateChanged`,
`scanFailed`, `meshStopRequested`, `onVpnLost` and `onVpnAvailable`. The last
two are unprefixed because JS subscribes to them by those exact names.

`AirhopWiFiModule` mirrors the shape with four of its own: `packetReceived`,
`linkConnected`, `linkDisconnected` and `availabilityChanged`. The last is what
lets the fast path recover without a relaunch. Android carries both edges, from
the framework's WiFi Aware state broadcast; iOS has no such broadcast and
reports only the falling edge, so the reconciler answers a drop with its retry
ladder rather than by waiting to be told the radio came back.

`AirhopWiFiPairing` is iOS-only and deliberately not part of that contract:
pairing is a precondition to HAVING links on one platform, not a property of a
link, so folding it in would make the Kotlin module answer three questions that
mean nothing there. Two methods (`getPairingState`, `presentPairing`) and one
event (`devicesChanged`), which is also how a pairing removed in the Settings app
reaches the transport.

Anything richer would put protocol knowledge on the native side, which this
design exists to prevent.

### Background execution

| Platform | Mechanism                                           | Result                                             |
| -------- | --------------------------------------------------- | -------------------------------------------------- |
| iOS      | `UIBackgroundModes: bluetooth-central`              | Receives BLE data while backgrounded               |
| iOS      | `UIBackgroundModes: bluetooth-peripheral`           | Keeps advertising, though not visibly to Android   |
| iOS      | `CBCentralManagerOptionRestoreIdentifierKey`        | Relaunches the app on a BLE event after suspension |
| Android  | `AirhopForegroundService` (persistent notification) | Survives Doze and battery optimization             |
| Android  | `FOREGROUND_SERVICE_CONNECTED_DEVICE`               | Required for that service on Android 14+           |
| Android  | `neverForLocation` on `BLUETOOTH_SCAN`              | Delivers scan results without a location grant     |

The scan flag is what makes the rest deliver. Android treats a BLE scan as a
location access unless the manifest says otherwise, and an app counts as
foreground for location only with a visible activity or a `location`-typed
foreground service. A `connectedDevice` service does not qualify, so a
backgrounded Airhop held its process up, kept a notification reading
"Discovering and relaying nearby messages", and was handed no scan results.

bitchat solves this with `ACCESS_BACKGROUND_LOCATION` and a `location` service
type. Airhop asserts `neverForLocation` instead, which is accurate here: a scan
result is read for its service UUID, its 8-byte peer ID and its RSSI, none of
which is a position. From API 31 that removes the coupling entirely. API 26 to 30
keeps it, since the flag does not exist there; `getRadioState` reports which
regime applies through `locationRequiredForScan`, read only by `blockerFor`.

Location is still requested, but only for geohash channels, and only when the
user opens one.

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
| Nostr           | Chosen       | Permissionless keypair identity, 300+ independent relays, NIP-17 gift-wrap for DMs, NIP-61 for payments, and bitchat already validated the choice |

### Noise XX over TLS or X3DH

- TLS requires CAs and server certificates, which a serverless system cannot have
- X3DH alone does not mutually authenticate: the receiver does not authenticate the sender in the handshake
- Noise XX gives mutual authentication and forward secrecy with no CAs, is proven in WireGuard, and is what bitchat uses

### Relay URLs stay strict

`validateRelayUrl` refuses `ws://`, bare IP addresses, `.local`, `localhost`,
`.internal` and single-label hosts. That is deliberate and stays.

Relaxing it would compromise two things at once. Android blocks cleartext from
API 28 and its network security config cannot scope an exception to an address
range, so permitting `ws://` to a user-typed address means permitting cleartext
for the whole app, including the mint URLs that carry bearer ecash. And a
`ws://` public host would put gift-wrapped DMs on the open internet unencrypted,
which is worse than anything the change would buy.

A relay reachable only on a local network is served by the LAN transport in
[section 3](#lan-transport), which needs no cleartext exception because it does
not go through the HTTP stack at all.

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
| `expo-secure-store`              | `~57.0` | Private key storage (Keychain/Keystore)                          | MIT     |
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

There is no navigation library. `src/app/app.tsx` holds a hand-rolled four-tab state
machine and screens are plain components. Styling is StyleSheet plus the theme
tokens in `src/ui/`, with no Tailwind or NativeWind.

### Build toolchain

| Tool                               | Version  | Purpose                                         |
| ---------------------------------- | -------- | ----------------------------------------------- |
| `expo`                             | `SDK 57` | Bare workflow and config plugins. Not EAS Build |
| `react`                            | `^19.2`  | Required by React Native 0.86 (peer dep)        |
| `react-native`                     | `^0.86`  | New Architecture (default since 0.76)           |
| `typescript`                       | `~6.0.3` | Strict mode, no `baseUrl`, `./`-prefixed paths  |
| `jest`                             | `^29`    | Unit tests for all of `src/core/`               |
| `prettier`                         | `^3.9`   | Formatting                                      |
| `prettier-plugin-organize-imports` | `^4.3`   | Auto-sort import blocks                         |
