# Airhop: Agent Guide

> For AI agents (GitHub Copilot, Claude, GPT-5, etc.) working in this codebase. This is the companion to `.github/copilot-instructions.md`.

## What You're Working In

This is **Airhop**, a React Native (Expo bare workflow) iOS + Android app for offline-first BLE mesh communication. Wire-compatible with bitchat (`permissionlesstech/bitchat`).

The workspace contains the bitchat reference implementation alongside the Airhop project:

- `bitchat/ios/`: Swift iOS implementation (public domain, copy freely)
- `bitchat/android/`: Kotlin Android implementation (public domain, copy freely)
- `bitchat/georelays/`: Nostr relay discovery

## Read Before You Write Code

You must read these four documents before making any code suggestions:

1. [`docs/design/VISION.md`](docs/design/VISION.md): non-negotiable principles
2. [`docs/spec/ARCHITECTURE.md`](docs/spec/ARCHITECTURE.md): architecture and stack decisions
3. [`docs/spec/PROTOCOLS.md`](docs/spec/PROTOCOLS.md): the wire format you must not break
4. [`docs/dev/PROGRESS.md`](docs/dev/PROGRESS.md): what exists, what's next, what's blocked

## Rules Every Agent Must Follow

### Crypto

- **`@noble/curves`, `@noble/ciphers`, `@noble/hashes` only.** No other crypto library. No `Math.random()` for security. No `crypto-js`, no `elliptic`, no `tweetnacl`.
- `react-native-get-random-values` must be the **first import** in `App.tsx`.

### Native Code

- Swift lives in `ios/`. Kotlin lives in `android/`. They expose **raw bytes** to TypeScript.
- **No protocol logic in native code.** No routing decisions. No crypto in Swift or Kotlin.
- The only native modules are `AirhopBLEModule` (Swift + Kotlin) and `AirhopForegroundService` (Kotlin).

### Build Order

```
src/core/ → Native modules → src/features/ → src/ui/
```

Never suggest UI code for a feature whose `src/core/` service isn't tested.

### Protocol Compatibility

- Never change `packet-codec.ts` byte layout without bumping the protocol version.
- Never change BLE Service UUID (`F47B5E2D...`) or Characteristic UUID (`A1B2C3D4...`).
- Never change peer ID derivation (`hex(SHA-256(noiseStaticPubKey)).slice(0, 16)`).

### Storage

- Private keys: `react-native-encrypted-storage` only (iOS Keychain / Android Keystore)
- Non-secret state: `react-native-mmkv` (JSI, synchronous)
- Never store private keys in MMKV, AsyncStorage, SQLite, or filesystem

## Where Things Live

| Thing                                                         | Location                 |
| ------------------------------------------------------------- | ------------------------ |
| Crypto (Noise XX, identity, DR)                               | `src/core/crypto/`       |
| BLE mesh (routing, codec, fragments, gossip, courier)         | `src/core/mesh/`         |
| Nostr (client, gift-wrap, geo-relay, presence, courier-relay) | `src/core/nostr/`        |
| Payments (Cashu, Nutzap)                                      | `src/core/payments/`     |
| Screen logic                                                  | `src/features/`          |
| UI components                                                 | `src/ui/`                |
| State management                                              | `src/store/`             |
| TurboModule specs (Codegen input)                             | `src/bridge/`            |
| iOS native                                                    | `ios/`                   |
| Android native                                                | `android/`               |
| All protocol constants                                        | `docs/spec/PROTOCOLS.md` |

## Specialized Agents

Invoke these when needed (via VS Code Copilot chat):

| Agent              | When to invoke                                                |
| ------------------ | ------------------------------------------------------------- |
| `@architect`       | Before merging any `src/core/`, `android/`, or `ios/` change  |
| `@upstream-sync`   | When bitchat releases a new version                           |
| `@security-review` | Before any PR touching crypto, key storage, or packet signing |

## Skills

Skills are reference files in `.github/skills/`. Read the relevant one before working on a subsystem. They contain dense, accurate reference material cross-checked against the source code and the bitchat implementations.

| Skill                                                                     | Read before working on                                                        |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`bitchat-wire-format.md`](.github/skills/bitchat-wire-format.md)         | `packet-codec.ts`, BLE native modules, any packet encoding or decoding        |
| [`noise-session-lifecycle.md`](.github/skills/noise-session-lifecycle.md) | `noise-xx.ts`, `noise-x.ts`, handshake logic, transport encryption            |
| [`ble-native-boundary.md`](.github/skills/ble-native-boundary.md)         | `android/`, `ios/`, `src/bridge/`, TurboModule specs                          |
| [`mesh-routing.md`](.github/skills/mesh-routing.md)                       | `flood-router.ts`, `deduplicator.ts`, `fragment-manager.ts`, `gossip-sync.ts` |
| [`nostr-gift-wrap.md`](.github/skills/nostr-gift-wrap.md)                 | `gift-wrap.ts`, `courier-relay.ts`, any Nostr DM or event handling            |

## TypeScript Conventions

- `tsc --strict` must pass with zero errors
- No `any` in `src/core/` or `src/bridge/`
- Named exports only in `src/core/` and `src/bridge/`
- File naming: `kebab-case.ts`
- Max 400 lines per file. Split by responsibility if longer.

## Common Mistakes to Avoid

| Mistake                                    | Correct approach                                             |
| ------------------------------------------ | ------------------------------------------------------------ |
| Using `Math.random()` for nonces           | Use `@noble/hashes` HKDF or `crypto.getRandomValues`         |
| Storing keys in Zustand store              | Zustand is MMKV-persisted; use `EncryptedStorage` for keys   |
| Writing routing logic in Swift/Kotlin      | Routing lives in `src/core/mesh/flood-router.ts`             |
| Creating a new native module for BLE       | Extend `AirhopBLEModule`; one module only                    |
| Hardcoding a relay URL                     | Load from `assets/data/relays.csv` via `GeoRelayDirectory`   |
| Changing packet byte layout "to fix a bug" | Understand the wire format in `docs/spec/PROTOCOLS.md` first |
