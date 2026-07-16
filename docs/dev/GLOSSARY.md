# Airhop: Glossary

## Cryptography

**[Ed25519](https://ed25519.cr.yp.to/)**: An elliptic curve digital signature scheme. Every outgoing BLE packet is signed with the sender's Ed25519 key; every relay verifies the signature before forwarding.

**[X25519](https://cr.yp.to/ecdh.html)**: Elliptic curve Diffie-Hellman using Curve25519. The key agreement function inside both Noise XX and Noise X.

**[SHA-256](https://en.wikipedia.org/wiki/SHA-2)**: A cryptographic hash function. Used for Peer ID derivation (`hex(SHA-256(noiseStaticPubKey)).slice(0, 16)`), packet deduplication IDs, and as the hash function inside the Noise suite.

**[HKDF](https://datatracker.ietf.org/doc/html/rfc5869)**: HMAC-based Key Derivation Function. Derives session keys and subkeys from Diffie-Hellman shared secrets inside the Noise handshake and Double Ratchet.

**[SipHash-2-4](https://www.131002.net/siphash/)**: A fast keyed hash designed to resist hash-flooding attacks. Used as the hash function inside GCS filters during gossip sync.

**[ChaCha20-Poly1305](https://datatracker.ietf.org/doc/html/rfc7539)**: An authenticated encryption cipher (AEAD). Used as the symmetric cipher inside the Noise XX and Noise X handshakes.

**[XChaCha20-Poly1305](https://libsodium.gitbook.io/doc/secret-key_cryptography/aead/chacha20-poly1305/xchacha20-poly1305_construction)**: ChaCha20-Poly1305 with a 192-bit nonce instead of 96-bit. Used by NIP-44 for Nostr DM encryption; the extended nonce eliminates nonce-reuse risk.

**[Noise Protocol / Noise XX / Noise X](https://noiseprotocol.org/noise.html)**: A framework for building authenticated key exchange protocols. Airhop uses `Noise_XX_25519_ChaChaPoly_SHA256` for live BLE sessions (mutual authentication, forward secrecy) and `Noise_X_25519_ChaChaPoly_SHA256` for one-way courier envelope sealing.

**[Double Ratchet](https://signal.org/docs/specifications/doubleratchet/)**: A key agreement algorithm that provides per-message forward secrecy. The same algorithm used by Signal and WhatsApp. Airhop applies it to all stored DMs so that compromise of one message key does not expose others.

**[X3DH](https://signal.org/docs/specifications/x3dh/)**: Extended Triple Diffie-Hellman. A key agreement protocol that lets a sender initiate a Double Ratchet session with a recipient who is offline, using prekey bundles the recipient publishes to Nostr in advance.

## Networking and Transport

**[BLE (Bluetooth Low Energy)](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy)**: A low-power Bluetooth variant for short-range device communication. The primary offline transport in Airhop; every device acts as both a GATT Central and GATT Peripheral simultaneously.

**[GATT (Generic Attribute Profile)](https://www.bluetooth.com/specifications/specs/)**: The client-server protocol layered on top of BLE. A GATT Central scans and connects; a GATT Peripheral advertises and accepts connections. Airhop runs both roles on the same device to form a mesh.

**TTL (Time To Live)**: A counter embedded in each BLE packet. Every relay node decrements it by one before forwarding; the packet is dropped when TTL reaches zero. Default TTL is 7, bounding propagation to 7 hops.

**[WiFi Aware](https://www.wi-fi.org/discover-wi-fi/wi-fi-aware)**: An Android API (API 26+) for direct device-to-device WiFi connections without a router or internet connection. Provides up to 250 Mbps at ~30 m range. Used in v0.8.0 for high-bandwidth transfers on Android.

**[MultipeerConnectivity](https://developer.apple.com/documentation/multipeerconnectivity)**: Apple's framework for peer-to-peer networking between iOS and macOS devices over WiFi or Bluetooth without a router. Used in v0.8.0 for high-bandwidth transfers on iOS.

**GCS (Golomb-Coded Set)**: A probabilistic data structure, more compact than a Bloom filter, that encodes a set of hashes. Used in gossip sync to let two peers compare which messages each holds and exchange only what is missing. See [Golomb coding](https://en.wikipedia.org/wiki/Golomb_coding).

**[LRU (Least Recently Used)](https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU)**: A cache eviction policy that removes the least-recently-accessed entry when the cache is full. Used for the 1,000-entry packet deduplication seen-set and the 1,000-packet gossip cache.

## Nostr Protocol

**[Nostr](https://nostr.com)**: Notes and Other Stuff Transmitted by Relays. A simple, open, decentralized protocol where clients sign events with keypairs and publish them to relays. Airhop uses Nostr as its internet bridge transport when BLE range is insufficient.

**NIP (Nostr Improvement Proposal)**: A numbered specification defining a Nostr protocol feature or extension. The full list is at [github.com/nostr-protocol/nips](https://github.com/nostr-protocol/nips).

**[NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md)**: The Nostr private direct message standard. Wraps messages using gift-wrap (NIP-59) so relay operators see neither sender, recipient, nor content.

**[NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)**: Nostr relay-managed groups. Used in Airhop for internet-connected group chats with persistent relay-side membership.

**[NIP-44](https://github.com/nostr-protocol/nips/blob/master/44.md)**: The Nostr encryption standard using XChaCha20-Poly1305 with versioning. Used inside NIP-17 gift-wrap envelopes.

**[NIP-59](https://github.com/nostr-protocol/nips/blob/master/59.md)**: See Gift-wrap above.

**[Gift-wrap (NIP-59)](https://github.com/nostr-protocol/nips/blob/master/59.md)**: A metadata-minimizing envelope scheme for Nostr events. The real message is sealed inside two nested encryption layers; the outer layer uses an ephemeral throwaway key so relay operators cannot learn who is talking to whom.

**[NIP-61](https://github.com/nostr-protocol/nips/blob/master/61.md)**: The Nutzap standard. Defines how to send Cashu ecash tokens via Nostr events as a form of Lightning-backed payment.

**[Geohash](https://en.wikipedia.org/wiki/Geohash)**: A geographic encoding that maps GPS coordinates to a short alphanumeric string, hierarchically scoping an area. Airhop uses 5-character geohashes (~5 km x 5 km cells) to scope location-based Nostr channels.

**[Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula)**: A formula for computing the great-circle distance between two GPS coordinates on a sphere. Used by `geo-relay.ts` to select the nearest Nostr relay from `assets/data/relays.csv`.

## Payments

**[Cashu](https://cashu.space)**: A Chaumian ecash protocol backed by Bitcoin and Lightning. Tokens are cryptographically signed bearer instruments that transfer with no internet connection. Airhop uses Cashu for offline BLE payments; internet is only required when redeeming tokens back to Lightning.

**[DLEQ (Discrete Log Equivalence Proof)](https://en.wikipedia.org/wiki/Proof_of_knowledge#Sigma_protocols)**: A zero-knowledge proof that lets a Cashu mint prove a token was correctly blind-signed without revealing its private key. Enables a recipient to verify a token's authenticity offline before redeeming.

**Nutzap**: A Cashu-based payment sent via Nostr ([NIP-61](https://github.com/nostr-protocol/nips/blob/master/61.md)). Functions like a Lightning zap but settles as ecash rather than requiring a live Lightning payment channel.

## Tools and Libraries

**[LZ4](https://lz4.github.io/lz4/)**: An extremely fast lossless compression algorithm. Applied to BLE packet payloads before transmission to fit more content within the 469-byte fragment limit.

**[AAC (Advanced Audio Coding)](https://en.wikipedia.org/wiki/Advanced_Audio_Coding)**: A lossy audio compression format. Airhop encodes push-to-talk voice at 16 kHz mono using AAC before transmission as BLE `VOICE_FRAME` packets.

**[NFC (Near-Field Communication)](https://en.wikipedia.org/wiki/Near-field_communication)**: A short-range (<4 cm) radio standard for device-to-device data exchange. Used in Airhop for tap-to-add-contact, physically binding a cryptographic key fingerprint to a person you meet in person.

**[Arti](https://gitlab.torproject.org/tpo/core/arti)**: The Tor Project's Rust implementation of the Tor client. Bundled as an xcframework in bitchat iOS; Airhop uses the same approach to route all Nostr traffic through Tor on iOS by default.

**[Orbot](https://guardianproject.info/apps/org.torproject.android/)**: Guardian Project's Android app providing a Tor SOCKS5 proxy on `localhost:9050`. Airhop detects Orbot and routes all Nostr traffic through it when available (v0.7.0), with an embedded Tor binary as the long-term default.

**[TurboModule](https://reactnative.dev/docs/the-new-architecture/what-are-turbo-native-modules)**: React Native's new architecture native module system. `src/bridge/NativeAirhopBLE.ts` is a TurboModule TypeScript spec (Codegen input) that provides a typed interface over the Swift and Kotlin BLE implementations.
