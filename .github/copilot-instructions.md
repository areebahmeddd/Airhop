# Airhop: Copilot Workspace Instructions

> This file is automatically loaded by VS Code GitHub Copilot for all sessions in this workspace. It provides the project context needed to give accurate, on-spec suggestions.

## What This Project Is

**Airhop** is a React Native (Expo SDK 57, RN 0.86+, bare workflow, New Architecture) cross-platform iOS + Android application for **offline-first, private peer-to-peer communication** over Bluetooth mesh networks, with Nostr internet bridging and Cashu ecash payments.

It is **wire-protocol-compatible with bitchat** (`permissionlesstech/bitchat`, `permissionlesstech/bitchat-android`), both under the Unlicense (public domain). Airhop nodes and bitchat nodes communicate over BLE without configuration. The source code for both bitchat implementations is in this workspace as reference:

- `bitchat/ios/`: Swift iOS implementation (copy freely)
- `bitchat/android/`: Kotlin Android implementation (copy freely)
- `bitchat/georelays/`: relay discovery scripts and relay CSV

## Read These Docs First

Before working on any code, read in this order:

1. [`docs/design/VISION.md`](docs/design/VISION.md): why + principles
2. [`docs/spec/PROTOCOLS.md`](docs/spec/PROTOCOLS.md): wire format and constants you must not break
3. [`docs/spec/ARCHITECTURE.md`](docs/spec/ARCHITECTURE.md): architecture, stack decisions, code snippets
4. [`docs/dev/PROGRESS.md`](docs/dev/PROGRESS.md): current build state

## Non-Negotiable Rules

Apply these to every suggestion, every file, every PR:

1. **All crypto = `@noble/*` only.** `@noble/curves` (X25519, Ed25519), `@noble/ciphers` (ChaCha20-Poly1305, XChaCha20), `@noble/hashes` (SHA-256, HMAC, HKDF). No other crypto library. No exceptions.

2. **Native code boundary.** Swift lives in `ios/`. Kotlin lives in `android/`. These expose **raw bytes** to TypeScript. Protocol logic, routing, and crypto decisions live in TypeScript (`src/core/`).

3. **Build order.** `src/core/` → native modules → `src/features/` → `src/ui/`. Never write UI before core is unit-tested.

4. **Protocol compatibility.** Never change the bitchat v2 packet byte layout (`src/core/mesh/packet-codec.ts`) or the BLE Service UUID without a version bump and compat test. See `docs/spec/PROTOCOLS.md`.

5. **Key storage.** Private keys in `react-native-encrypted-storage` only (iOS Keychain / Android Keystore). MMKV for all non-secret state.

6. **Packet signing.** Every outgoing packet is Ed25519-signed. Every incoming packet has its signature verified before relay or display. Drop unsigned/invalid packets silently.

7. **No plaintext on disk.** Message content is encrypted at rest. Panic wipe destroys all keys in <1s.

8. **Polyfill at entry point.** `import 'react-native-get-random-values'` must be the first import in `App.tsx` before any `@noble` import.

## Project Folder Structure

```
src/
  bridge/       # TurboModule TypeScript specs (Codegen input only)
  core/
    crypto/     # identity, noise-xx, noise-x, double-ratchet, x3dh
    mesh/       # packet-codec, flood-router, deduplicator, fragments, gossip, courier
    nostr/      # client, gift-wrap, geo-relay, presence
    payments/   # cashu, nutzap
  features/     # screen-level logic (chat, contacts, wallet, discovery, settings)
  ui/           # shared components, theming
  store/        # Zustand slices + MMKV persistence
  utils/        # pure helpers

android/        # Kotlin: AirhopBLEModule, AirhopForegroundService
ios/            # Swift: AirhopBLEModule

assets/data/    # relays.csv (bundled from bitchat/georelays/, CI-refreshed)
docs/
  design/       # VISION.md, ROADMAP.md
  spec/         # ARCHITECTURE.md, PROTOCOLS.md
  dev/          # PROGRESS.md, REFERENCE.md
.github/agents/ # specialized Copilot agents
```

## Key Protocol Constants (Never Change Without Version Bump)

- **BLE Service UUID:** `F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C`
- **BLE Characteristic UUID:** `A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D`
- **Noise algorithm:** `Noise_XX_25519_ChaChaPoly_SHA256`
- **TTL default:** 7 hops
- **Fragment size:** 469 bytes
- **Peer ID:** `hex(SHA-256(noiseStaticPubKey)).slice(0, 16)`

Full constant table: [`docs/spec/PROTOCOLS.md`](docs/spec/PROTOCOLS.md)

## TypeScript Conventions

- Strict mode: `tsc --strict` must pass with zero errors
- No `any` in `src/core/` or `src/bridge/`
- Named exports only in `src/core/` and `src/bridge/`
- `kebab-case.ts` file naming
- Files under 400 lines. Split by responsibility if longer.

## Code Style

- Write code and comments in a clear, concise, and factual style that follows standard language and platform conventions.
- Comment intent, assumptions, constraints, or non-obvious decisions, not the implementation.
- Prefer clear names over unnecessary comments.
- Do not use em dashes (`—`) or double hyphens (`--`) in comments or documentation. Avoid AI-style, robotic wording. Keep the language natural and human.

## Agents Available

- **`@architect`**: architectural compliance review (build order, layer boundaries, protocol compat)
- **`@upstream-sync`**: analyze bitchat upstream changes and generate integration checklist
- **`@security-review`**: crypto, key storage, packet signing, OWASP Mobile Top 10 audit
