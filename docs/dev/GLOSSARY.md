# Airhop: Glossary

## Cryptography

**[Ed25519](https://ed25519.cr.yp.to/)**: An elliptic curve digital signature scheme. Every outgoing BLE packet is signed with the sender's Ed25519 key; every relay verifies the signature before forwarding.

**[X25519](https://cr.yp.to/ecdh.html)**: Elliptic curve Diffie-Hellman using Curve25519. The key agreement function inside both Noise XX and Noise X.

**[SHA-256](https://en.wikipedia.org/wiki/SHA-2)**: A cryptographic hash function. Used for Peer ID derivation (`hex(SHA-256(noiseStaticPubKey)).slice(0, 16)`), packet deduplication IDs, the hash function inside the Noise suite, and the hash inside GCS filters during gossip sync (`gossip-sync.ts`; Airhop does not use SipHash).

**[HKDF](https://datatracker.ietf.org/doc/html/rfc5869)**: HMAC-based Key Derivation Function. Derives session keys and subkeys from Diffie-Hellman shared secrets inside the Noise handshake and Double Ratchet.

**[ChaCha20-Poly1305](https://datatracker.ietf.org/doc/html/rfc7539)**: An authenticated encryption cipher (AEAD). Used as the symmetric cipher inside the Noise XX and Noise X handshakes.

**[XChaCha20-Poly1305](https://libsodium.gitbook.io/doc/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction)**: ChaCha20-Poly1305 with a 192-bit nonce instead of 96-bit. Used by NIP-44 for Nostr DM encryption; the extended nonce eliminates nonce-reuse risk.

**[Noise Protocol / Noise XX / Noise X](https://noiseprotocol.org/noise.html)**: A framework for building authenticated key exchange protocols. Airhop uses `Noise_XX_25519_ChaChaPoly_SHA256` for live BLE sessions (mutual authentication, forward secrecy) and `Noise_X_25519_ChaChaPoly_SHA256` for one-way courier envelope sealing.

**[Double Ratchet](https://signal.org/docs/specifications/doubleratchet/)**: A key agreement algorithm that provides per-message forward secrecy. The same algorithm used by Signal and WhatsApp. Airhop applies it to all stored DMs so that compromise of one message key does not expose others.

**[X3DH](https://signal.org/docs/specifications/x3dh/)**: Extended Triple Diffie-Hellman. A key agreement protocol that lets a sender initiate a Double Ratchet session with a recipient who is offline, using prekey bundles the recipient publishes in advance. Airhop deliberately does not use X3DH: the Noise handshake already seeds the ratchet, and one-time prekeys are gossiped over the mesh as `0x24`, never published to Nostr.

## Networking and Transport

**[BLE (Bluetooth Low Energy)](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy)**: A low-power Bluetooth variant for short-range device communication. The primary offline transport in Airhop; every device acts as both a GATT Central and GATT Peripheral simultaneously.

**[GATT (Generic Attribute Profile)](https://bluetooth.com/specifications/specs/)**: The client-server protocol layered on top of BLE. A GATT Central scans and connects; a GATT Peripheral advertises and accepts connections. Airhop runs both roles on the same device to form a mesh.

**TTL (Time To Live)**: A counter embedded in each BLE packet. Every relay node decrements it by one before forwarding; the packet is dropped when TTL reaches zero. Default TTL is 7, bounding propagation to 7 hops.

**[WiFi Aware](https://wi-fi.org/discover-wi-fi/wi-fi-aware)**: An Android API (API 26+) for direct device-to-device WiFi connections without a router or internet connection. Provides up to 250 Mbps at ~30 m range. Used for high-bandwidth transfers between two Android devices. It cannot interoperate with iOS MultipeerConnectivity, so it is never a cross-platform path.

**[MultipeerConnectivity](https://developer.apple.com/documentation/multipeerconnectivity)**: Apple's framework for peer-to-peer networking between iOS and macOS devices over WiFi or Bluetooth without a router. Used for high-bandwidth transfers between two Apple devices. It runs on Apple's proprietary AWDL and cannot interoperate with Android WiFi Aware, so it is never a cross-platform path.

**[NFC (Near Field Communication)](https://en.wikipedia.org/wiki/Near-field_communication)**: Short-range radio for tap-to-exchange between two devices held together. The appeal for a messenger is that the range itself is the security property: a few centimetres is hard to eavesdrop on and impossible to spoof from across a room, which makes it a natural way to bind a key fingerprint to a person standing in front of you. **Not implemented in Airhop.** Contact exchange is camera QR only (`qr-scan-screen.tsx`), which gives the same in-person guarantee with no extra dependency and works on every device.

**GCS (Golomb-Coded Set)**: A probabilistic data structure, more compact than a Bloom filter, that encodes a set of hashes. Used in gossip sync to let two peers compare which messages each holds and exchange only what is missing. See [Golomb coding](https://en.wikipedia.org/wiki/Golomb_coding).

**[LRU (Least Recently Used)](https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU)**: A cache eviction policy that removes the least-recently-accessed entry when the cache is full. Used for the 1,000-entry packet deduplication seen-set and the 1,000-packet gossip cache.

## Nostr Protocol

**[Nostr](https://nostr.org)**: Notes and Other Stuff Transmitted by Relays. A simple, open, decentralized protocol where clients sign events with keypairs and publish them to relays. Airhop uses Nostr as its internet bridge transport when BLE range is insufficient.

**NIP (Nostr Improvement Proposal)**: A numbered specification defining a Nostr protocol feature or extension. The full list is at [github.com/nostr-protocol/nips](https://github.com/nostr-protocol/nips).

**[NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md)**: The Nostr private direct message standard. Wraps messages using gift-wrap (NIP-59) so relay operators see neither sender, recipient, nor content.

**[NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)**: Nostr relay-managed groups. Considered and rejected for Airhop: it puts membership enforcement on a relay. See ARCHITECTURE.md section 6, Channels and Groups.

**[NIP-44](https://github.com/nostr-protocol/nips/blob/master/44.md)**: The Nostr encryption standard using XChaCha20-Poly1305 with versioning. Used inside NIP-17 gift-wrap envelopes.

**[NIP-59](https://github.com/nostr-protocol/nips/blob/master/59.md)**: See Gift-wrap above.

**[Gift-wrap (NIP-59)](https://github.com/nostr-protocol/nips/blob/master/59.md)**: A metadata-minimizing envelope scheme for Nostr events. The real message is sealed inside two nested encryption layers; the outer layer uses an ephemeral throwaway key so relay operators cannot learn who is talking to whom.

**[NIP-61](https://github.com/nostr-protocol/nips/blob/master/61.md)**: The Nutzap standard. Defines how to send Cashu ecash tokens via Nostr events as a form of Lightning-backed payment.

**[Geohash](https://en.wikipedia.org/wiki/Geohash)**: A geographic encoding that maps GPS coordinates to a short alphanumeric string, hierarchically scoping an area. Airhop scopes location-based Nostr channels by geohash, from a 2-character region down to a 7-character city block (a city is 5 characters, ~5 km x 5 km). The named channels resolve their geohash from your location; you can also teleport to any cell by entering its geohash.

**[Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula)**: A formula for computing the great-circle distance between two GPS coordinates on a sphere. Used by `geo-relay.ts` to select the nearest Nostr relay from `assets/data/relays.csv`.

## Payments

**[Cashu](https://cashu.space)**: A Chaumian ecash protocol backed by Bitcoin and Lightning. Tokens are cryptographically signed bearer instruments that transfer with no internet connection. Airhop uses Cashu for offline BLE payments; internet is only needed to move value in or out over Lightning, and to confirm a received token is unspent.

**Mint**: The server that issues and redeems ecash and holds the bitcoin backing it. The only trusted party in the payment system. Airhop ships with no default mint: the user chooses one, or runs their own.

**Proof**: One ecash coin. An amount, a random secret only its owner knows, and the mint's blind signature over that secret. A **token** is one or more proofs packed into a single `cashuB…` string, which is what actually moves between devices.

**[DLEQ (Discrete Log Equivalence Proof)](https://en.wikipedia.org/wiki/Proof_of_knowledge#Sigma_protocols)**: A zero-knowledge proof that lets a Cashu mint prove a token was correctly blind-signed without revealing its private key. Lets a recipient verify a token is genuine with no network. It cannot prove the token is _unspent_: only the mint knows that.

**[NUT](https://github.com/cashubtc/nuts)**: A numbered Cashu specification ("Notation, Usage, and Terminology"), the Cashu equivalent of a NIP. Airhop implements NUT-04/05 (Lightning in and out), NUT-07 (proof state), NUT-11 (P2PK locking), NUT-12 (DLEQ), and NUT-13 (deterministic secrets for the recovery phrase).

**Nutzap**: A Cashu payment sent via Nostr ([NIP-61](https://github.com/nostr-protocol/nips/blob/master/61.md)). The ecash is locked to the recipient's public key, so the event can be public while only they can spend it.

## Tools and Libraries

**[DEFLATE (raw)](https://datatracker.ietf.org/doc/html/rfc1951)**: A lossless compression algorithm. Applied to BLE packet payloads before transmission to fit more content within the 512-byte BLE write ceiling. `packet-compression.ts` uses pako's `deflateRaw` / `inflateRaw`, matching bitchat's headerless zlib stream.

**[AAC (Advanced Audio Coding)](https://en.wikipedia.org/wiki/Advanced_Audio_Coding)**: A lossy audio compression format. Airhop encodes push-to-talk voice at 16 kHz mono using AAC before transmission as BLE `VOICE_FRAME` packets.

**[Arti](https://gitlab.torproject.org/tpo/core/arti)**: The Tor Project's Rust implementation of the Tor client. Bundled as an xcframework in bitchat iOS; Airhop uses the same approach to route all Nostr traffic through Tor on iOS by default.

**[Orbot](https://guardianproject.info/apps/org.torproject.android/)**: Guardian Project's Android app providing a Tor SOCKS5 proxy on `localhost:9050`. Airhop detects Orbot and routes all Nostr traffic through it when available.

**[TurboModule](https://reactnative.dev/docs/the-new-architecture/what-are-turbo-native-modules)**: React Native's new architecture native module system. `src/bridge/NativeAirhopBLE.ts` is a TurboModule TypeScript spec (Codegen input) that provides a typed interface over the Swift and Kotlin BLE implementations.

## Localization

**[BCP 47](https://www.rfc-editor.org/info/bcp47)**: The standard for language tags (`en`, `pt-BR`, `zh-Hans`). `src/i18n/languages.ts` is keyed on these.

**[CLDR plural category](https://cldr.unicode.org/index/cldr-spec/plural-rules)**: The set of grammatical number forms a language uses. English has `one` and `other`, Russian four, Arabic six, Chinese only `other`. `tPlural` selects one per call; English's rule is the only one implemented, and a second language means selecting through `Intl.PluralRules` instead.

**Endonym**: A language's name in its own script (`فارسی`, `русский`, `简体中文`). What a language picker lists, matching bitchat's `AppLanguageSettings.endonym(for:)`.

**[ICU](https://icu.unicode.org/)**: The Unicode internationalization library the platform exposes through `Intl`. Backs date, time and number formatting, so `src/utils/format.ts` pins the locale and numbering system to keep output stable across OS versions. Hermes exposes `DateTimeFormat`, `NumberFormat` and `Collator` from it, but not `PluralRules`.

**LTR / RTL**: Left-to-right and right-to-left layout direction. `I18nManager` sets it once per process, so changing between them needs a relaunch; layout uses logical properties plus the helpers in `src/i18n/layout.ts`.

**Locale**: A language plus its formatting conventions. In Airhop a locale is a TypeScript module under `src/i18n/locales/`, compiled into the bundle rather than fetched. English is the only one today.

**Translation key**: The identifier a string is looked up by (`chat.dm.clear`). Code holds keys, never sentences; `TranslationKey` is derived from `en.ts`, so an unknown key is a compile error.
