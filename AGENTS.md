# Airhop: Agent Guide

> For AI agents (GitHub Copilot, Claude, GPT-5, etc.) working in this codebase. This is the companion to `.github/copilot-instructions.md`.

## What You're Working In

This is **Airhop**, a React Native (Expo bare workflow) iOS + Android app for offline-first BLE mesh communication. Wire-compatible with bitchat (`permissionlesstech/bitchat`).

The bitchat reference implementation sits alongside the Airhop project as a local checkout. It is **not part of this repository**: clone it into `bitchat/` yourself, which is where every path below expects it.

- `bitchat/ios/`: Swift iOS implementation (public domain, copy freely)
- `bitchat/android/`: Kotlin Android implementation (public domain, copy freely)
- `bitchat/georelays/`: Nostr relay discovery

Nothing under `bitchat/` is committed, so a `bitchat/...` path is a dangling reference for anyone without the checkout. Never cite one from **shipping source** (`src/`, `scripts/`, `android/`, `ios/`): read it freely, then write the conclusion rather than the citation. This guide, `.github/agents/` and `.github/skills/` are the exception, since telling an agent where to look in that checkout is exactly their job.

## Read Before You Write Code

You must read these four documents before making any code suggestions:

1. [`docs/design/VISION.md`](docs/design/VISION.md): non-negotiable principles
2. [`docs/spec/ARCHITECTURE.md`](docs/spec/ARCHITECTURE.md): architecture and stack decisions
3. [`docs/spec/PROTOCOLS.md`](docs/spec/PROTOCOLS.md): the wire format you must not break
4. [`docs/dev/PROGRESS.md`](docs/dev/PROGRESS.md): what exists, what's next, what's blocked

## Rules Every Agent Must Follow

### Crypto

- **`@noble/curves`, `@noble/ciphers`, `@noble/hashes` only.** No other crypto library. No `Math.random()` for security. No `crypto-js`, no `elliptic`, no `tweetnacl`.
- `react-native-get-random-values` must be the **first import** in `src/app/app.tsx`. The root `App.tsx` is a one-line re-export that Expo's AppEntry resolves.

### Native Code

- Swift lives in `ios/`. Kotlin lives in `android/`. They expose **raw bytes** to TypeScript.
- **No protocol logic in native code.** No routing decisions. No crypto in Swift or Kotlin.
- Native modules: `AirhopBLEModule` and `AirhopVoiceModule` (Swift + Kotlin), `AirhopForegroundService` and `AirhopWiFiModule` (Kotlin), `AirhopTorModule` and `AirhopTorSocket` (Swift).

### Build Order

```
src/core/ -> Native modules -> src/features/ -> src/ui/
```

Never suggest UI code for a feature whose `src/core/` service isn't tested.

### Protocol Compatibility

- Never change `packet-codec.ts` byte layout without bumping the protocol version.
- Never change BLE Service UUID (`F47B5E2D...`) or Characteristic UUID (`A1B2C3D4...`).
- Never change peer ID derivation (`hex(SHA-256(noiseStaticPubKey)).slice(0, 16)`).

### Pinned Artifacts

Two things in the tree are pinned by hash and checked in CI. Both fail the build
rather than drifting quietly, so a change to either has to be deliberate.

- **Vendored binaries** (`ios/Frameworks/`, the Arti xcframework). Prebuilt, not compiled here, and nobody reviews a binary diff. If you genuinely need to update one, re-record it in the same commit: `node scripts/verify-vendored.js --write`. CI runs `npm run verify:vendored`.
- **Gradle dependencies** (`android/app/gradle.lockfile`). Adding or bumping an npm package with an Android side can change what Gradle resolves. Regenerate in the same commit: `./gradlew dependencies --write-locks` then `./gradlew :app:dependencies --write-locks`.

### User-Facing Copy

- **Never hardcode a user-facing string.** Add a key to `src/i18n/locales/en.ts`, use `T("your.key")`. CI fails on any hardcoded string (`npm run i18n:audit`).
- `en.ts` is the source catalog; every other locale is generated from a translation map and checked against it. Adding one is a new file, never a sweep of every screen.
- Placeholders are named (`{count}`), never positional. Plurals go through `tPlural`, never `count === 1` at a call site.
- **No em dashes**, in copy or in comments. Use a comma, parentheses or a full stop.
- **Byte sizes follow IEC 80000-13, everywhere, copy included.** `KiB` / `MiB` are 1024-based, `KB` / `MB` are 1000-based, and the label must match the arithmetic. Every size we control is a power of two (the 1 MiB file cap, the 512 KiB photo budget, the 16 KiB envelope) and `formatBytes` divides by 1024, so all of it reads `KiB` / `MiB` in specs, `docs/`, skills, comments, `en.ts` and `landing/` alike. Decimal units stay only for genuinely decimal figures, such as an observed camera file size. Never label a 1024-based value `KB`.
- Layout uses logical properties (`marginStart`, `start`, `textAlignEnd`), never `marginLeft` / `left` / `textAlign: "right"`, so right-to-left works when a catalog for it ships.
- **Some strings must never be translated** because they cross the wire: the `username.ts` word lists, the transmitted `/hug` and `/slap` text (bitchat matches it as an English substring), slash command tokens, channel names. Read [`i18n.md`](.github/skills/i18n.md) before touching any of them.

### Storage

- Private keys: `src/core/crypto/keychain.ts` only, never `expo-secure-store`
  directly. It holds the registry the panic wipe deletes (SecureStore has no
  clear-all), so a secret written outside it survives a wipe. Add new ones to
  `KEYCHAIN_ITEMS`.
- Non-secret state: `react-native-mmkv` (JSI, synchronous)
- Never store private keys in MMKV, AsyncStorage, SQLite, or filesystem

## Where Things Live

| Thing                                                         | Location                   |
| ------------------------------------------------------------- | -------------------------- |
| Crypto (Noise XX, identity, DR)                               | `src/core/crypto/`         |
| Wire format: the packet frame and every payload               | `src/core/mesh/wire/`      |
| Mesh routing, dedup, fragmentation, source routes             | `src/core/mesh/routing/`   |
| GCS gossip sync                                               | `src/core/mesh/sync/`      |
| Announces and nickname normalisation                          | `src/core/mesh/discovery/` |
| Private-channel and private-group crypto                      | `src/core/mesh/rooms/`     |
| Store-and-forward envelopes and one-time prekeys              | `src/core/mesh/courier/`   |
| Live push-to-talk capture and playback                        | `src/core/mesh/voice/`     |
| Nostr (client, gift-wrap, geo-relay, presence, courier-relay) | `src/core/nostr/`          |
| Payments: tokens, DLEQ, NIP-61, seed (pure)                   | `src/core/payments/`       |
| Payments: anything touching a mint                            | `src/services/`            |
| Screen logic                                                  | `src/features/`            |
| UI components, hooks, theme tokens                            | `src/ui/`                  |
| Thin wrappers over OS APIs (permissions, haptics)             | `src/platform/`            |
| State management                                              | `src/store/`               |
| UI copy: the catalog, the runtime, RTL helpers                | `src/i18n/`                |
| TurboModule specs (Codegen input)                             | `src/bridge/`              |
| Root component and tab state machine                          | `src/app/`                 |
| Whole-app lifecycle and simulation suites                     | `src/__tests__/`           |
| iOS native                                                    | `ios/`                     |
| Android native                                                | `android/`                 |
| All protocol constants                                        | `docs/spec/PROTOCOLS.md`   |

## Specialized Agents

Invoke these when needed (via VS Code Copilot chat):

| Agent              | When to invoke                                                |
| ------------------ | ------------------------------------------------------------- |
| `@architect`       | Before merging any `src/core/`, `android/`, or `ios/` change  |
| `@upstream-sync`   | When bitchat releases a new version                           |
| `@security-review` | Before any PR touching crypto, key storage, or packet signing |

## Skills

Skills are reference files in `.github/skills/`. Read the relevant one before working on a subsystem. They contain dense, accurate reference material cross-checked against the source code and the bitchat implementations.

| Skill                                                             | Read before working on                                                        |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`bitchat-wire-format.md`](.github/skills/bitchat-wire-format.md) | `packet-codec.ts`, BLE native modules, any packet encoding or decoding        |
| [`noise-sessions.md`](.github/skills/noise-sessions.md)           | `noise-xx.ts`, `noise-x.ts`, handshake logic, transport encryption            |
| [`native-boundary.md`](.github/skills/native-boundary.md)         | `android/`, `ios/`, `src/bridge/`, TurboModule specs                          |
| [`mesh-routing.md`](.github/skills/mesh-routing.md)               | `flood-router.ts`, `deduplicator.ts`, `fragment-manager.ts`, `gossip-sync.ts` |
| [`nostr-gift-wrap.md`](.github/skills/nostr-gift-wrap.md)         | `gift-wrap.ts`, `courier-relay.ts`, any Nostr DM or event handling            |
| [`courier-envelopes.md`](.github/skills/courier-envelopes.md)     | `prekey-bundle.ts`, `prekey-store.ts`, `courier-store.ts`, offline mail       |
| [`i18n.md`](.github/skills/i18n.md)                               | `src/i18n/`, any user-facing copy anywhere, right-to-left layout              |
| [`ui-ux.md`](.github/skills/ui-ux.md)                             | `src/ui/`, any style block, component, tappable surface or dark-mode work     |

## TypeScript Conventions

- `tsc --strict` must pass with zero errors
- No `any` in `src/core/` or `src/bridge/`
- Named exports only in `src/core/` and `src/bridge/`
- File naming: `kebab-case.ts`. The one exception is `src/bridge/Native*.ts`, which keeps React Native's Codegen spec convention. A file's name and its primary export must agree (`alert-modal.tsx` exports `AlertModal`).
- Module specifiers: leaving your top-level `src/` layer means a path alias (`@core/mesh/wire/packet-codec`); staying inside the layer stays relative (`./message-bubble`, `../shared`). Aliases are declared in `tsconfig.json` and mirrored in `package.json` for jest.
- Write escape sequences, never the literal byte. A regex holding a raw backspace instead of `\b` matches nothing and makes git treat the file as binary, so it is unenforced and unreviewable at once. This has happened here. CI runs `npm run verify:invisibles` over control characters, bidirectional overrides and zero-width characters.
- One protocol concern per `src/core/` module, each independently testable. A file that needs "and" to describe it is two files.
- `src/services/mesh-service.ts` and several `src/features/` screens are far past that. They are known refactor targets, **not** precedent. Add a new packet type's codec as a focused module in `src/core/mesh/wire/` and keep the mesh-service side to wiring.

## Design Language

Every visual value comes from a token in `src/ui/theme.ts`.

- Read the palette through `useThemeColors()`, never by importing `Colors` or `DarkColors`, or the screen stops answering the theme setting. Check both themes: a wash that reads on white can vanish on near-black.
- Tokens, not literals, for spacing, radius, font size, weight, duration and elevation. Never arithmetic on one (`FontSize.xs - 1`): if the scale lacks a value, add it to the scale.
- `MIN_TOUCH` (44pt) is the floor. A smaller control carries `hitSlopFor(visualSize)`, and adjacent controls must not overlap slop.
- Colour carries meaning, never decoration. Green is end-to-end encrypted, blue is a verified contact, and neither is reused.
- Reuse `BottomSheet`, `EmptyState`, `PrimaryButton`, `AlertModal` and the settings row primitives before writing a variant.
- Motion respects the OS reduce-motion switch. Reanimated honours it already; anything on `Animated` uses `useReducedMotion()`.

## Comments and Documentation

Comments here are dense on purpose. The bar for keeping one is that it says something the code cannot.

- **Explain why, not what.** Justify a magic number, name a platform quirk, state an invariant. A comment restating the signature below it is noise.
- **No history.** A file is not a changelog. Keep the rule a war story justified and drop the story; the commit message is where it belongs.
- **File headers stay** on every non-trivial module: one sentence on what it is, then only what a reader needs to change it safely. Length tracks load-bearing content, not the file's age.
- **`//` everywhere**, headers and members alike. The only block comments are two tool pragmas a line comment is invisible to: `/** @jest-environment node */` and a `/** @public */` knip suppression.
- **Section banners** (`// ---- Name ----`) belong only in a long file or a flat data table, where they are the only navigation.
- **Style blocks**: justify a number, a touch target or a platform quirk, or say nothing.
- **Describe the system, not the authors.** The exception is protocol code, where "we" means _this node_ rather than the peer, a distinction the prose needs.
- `landing/` takes **no** `//` comments at all.

## Common Mistakes to Avoid

| Mistake                                     | Correct approach                                                 |
| ------------------------------------------- | ---------------------------------------------------------------- |
| Using `Math.random()` for nonces            | Use `@noble/hashes` HKDF or `crypto.getRandomValues`             |
| Storing keys in Zustand store               | Zustand is MMKV-persisted; use `core/crypto/keychain` for keys   |
| Writing routing logic in Swift/Kotlin       | Routing lives in `src/core/mesh/routing/flood-router.ts`         |
| Creating a new native module for BLE        | Extend `AirhopBLEModule`; one module only                        |
| Hardcoding a relay URL                      | Load from `assets/data/nostr_relays.csv` via `GeoRelayDirectory` |
| Writing a user-facing string inline         | Add a key to `src/i18n/locales/en.ts` and use `T("key")`         |
| Using `marginLeft` / `left` in a stylesheet | Use `marginStart` / `start`, so right-to-left flips              |
| Changing packet byte layout "to fix a bug"  | Understand the wire format in `docs/spec/PROTOCOLS.md` first     |
