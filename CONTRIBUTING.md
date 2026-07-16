# Contributing & Development Guide

Thanks for your interest in contributing to Airhop. This guide covers coding standards, crypto rules, testing requirements, and the pull request process.

By participating, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

> Standards for everyone working in this codebase, for human contributors and AI agents alike. If it isn't in the code and isn't here, it doesn't exist as a standard.

## 1. Read Before You Touch Anything

Every contributor reads these documents before writing a single line of code, in this order:

1. [`docs/design/VISION.md`](docs/design/VISION.md): what Airhop is and what it will never compromise on
2. [`docs/spec/PROTOCOLS.md`](docs/spec/PROTOCOLS.md): the wire format and exact constants you must not break
3. [`docs/spec/ARCHITECTURE.md`](docs/spec/ARCHITECTURE.md): the architecture decisions and why they were made
4. [`docs/dev/PROGRESS.md`](docs/dev/PROGRESS.md): current build state; what's done and what's next

Skipping this step causes rework.

## 2. Build Order

```
src/core/   →   Native modules   →   src/features/   →   src/ui/
```

- **Do not write `src/features/` code** until the `src/core/` service it depends on has passing unit tests.
- **Do not write `src/ui/` code** until the feature logic in `src/features/` is proved functional.
- **Native code** (`android/`, `ios/`) is written once during Phase 0 and touched only to fix BLE hardware bugs. Protocol logic lives in TypeScript.

## 3. Coding Standards

### TypeScript (all code)

- Strict mode everywhere. All files must pass `tsc --strict` with zero errors.
- No `any` types in `src/core/` or `src/bridge/`. Period.
- Named exports only. No default exports in `src/core/` or `src/bridge/`.
- File naming: `kebab-case.ts` throughout.
- Keep files under 400 lines. If it's longer, it has more than one responsibility.

### Native Code (Android + iOS)

- Native code lives exclusively in `android/` and `ios/`.
- Native modules expose **raw bytes** to TypeScript. They do not interpret packets, run routing logic, or make crypto decisions.
- `AirhopBLEModule` is the one and only native module for BLE. Do not create additional BLE modules.

## 4. Crypto Rules

These are not style guidelines. Violating them is a build blocker.

| Rule                                                                                       | Enforcement                                 |
| ------------------------------------------------------------------------------------------ | ------------------------------------------- |
| All crypto MUST use `@noble/curves`, `@noble/ciphers`, `@noble/hashes`                     | Reject any PR importing other crypto libs   |
| NEVER use `Math.random()` for anything security-related                                    | `@noble/hashes` HKDF or OS CSPRNG only      |
| Polyfill `crypto.getRandomValues` with `react-native-get-random-values` at app entry point | Required before importing any noble library |
| Private keys MUST only be stored via `react-native-encrypted-storage`                      | iOS Keychain / Android Keystore backed      |
| Message content MUST only be stored in encrypted MMKV                                      | Not AsyncStorage, not SQLite plaintext      |
| NEVER log private keys, session keys, plaintext message content, or Cashu token proofs     | Zero exceptions                             |
| All outgoing packets MUST be Ed25519 signed                                                | `packet-codec.ts` enforces this             |
| All incoming packets MUST have signatures verified before relay or display                 | Drop on failure, never propagate            |

## 5. Protocol Compatibility Rules

These rules exist because a bug here breaks Airhop's interoperability with bitchat.

- **Never change the bitchat v2 packet byte layout** in `packet-codec.ts` without:
  1. Bumping `version` byte from `2` to `3`
  2. Maintaining a `v2` decode path for backward compat
  3. Testing cross-protocol delivery: Airhop v3 node → bitchat node
- **Never change the BLE Service UUID or Characteristic UUID.** They are fixed in `PROTOCOLS.md`, section 1. Changing them creates a network partition.
- **Never change Peer ID derivation.** It is `hex(SHA-256(noiseStaticPubKey)).slice(0, 16)`. Changing it breaks gossip sync and DM addressing.
- **Airhop extension packet types (`0x29`, `0x30`, `0x40`)** are safe to broadcast; bitchat drops unknown types silently. No compat concern.
- Before any protocol change ships, run: Airhop node ↔ bitchat-ios node ↔ bitchat-android node message exchange test.

## 6. Testing Requirements

### src/core/ (100% coverage required on critical paths)

| Module                        | Required Tests                                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `packet-codec.ts`             | Encode/decode round-trip; byte layout matches `PROTOCOLS.md`, section 2                                               |
| `noise-xx.ts`                 | Pass official Noise test vectors from [noiseprotocol.org](https://noiseprotocol.org/noise.html#appendix-test-vectors) |
| `noise-xx.ts`                 | Cross-language test: JS client handshake with bitchat-ios Swift server                                                |
| `gossip-sync.ts` (GCS filter) | Bit-for-bit match with bitchat Swift/Kotlin test vectors                                                              |
| `deduplicator.ts`             | LRU eviction at 1000 entries; 5-minute expiry window                                                                  |
| `flood-router.ts`             | TTL decrement; jitter scheduling; loop prevention                                                                     |
| `cashu.ts`                    | Token parse/embed/redeem round-trip                                                                                   |

Run tests: `npm test -- --testPathPattern=src/core`

## 7. PR Checklist

Before opening any pull request:

- [ ] `npm test` passes with zero failures
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run format` run (no uncommitted format changes)
- [ ] No `any` types added to `src/core/` or `src/bridge/`
- [ ] No crypto library other than `@noble/*` imported
- [ ] Protocol wire format unchanged (or version bumped with compat path)
- [ ] `docs/dev/PROGRESS.md` updated if a milestone was completed or a decision was made
- [ ] If touching `src/core/` or `android/` or `ios/`: invoke `@architect` agent for review

## 8. Commit Sign-Off (DCO)

All commits must include a `Signed-off-by` trailer. Use `git commit -s` to add it automatically:

```
Signed-off-by: Your Name <your@email.com>
```

This certifies that you agree to the [Developer Certificate of Origin](https://developercertificate.org/): that you wrote the contribution or have the right to submit it under this project's license.

## 9. AI Agent Usage

Three specialized agents are available in `.github/agents/`. Invoke them via VS Code Copilot chat.

### `@architect`

**When:** Before merging any change to `src/core/`, `android/`, or `ios/`.  
**What it checks:** Build order compliance, layer boundary violations, protocol compatibility, crypto library usage, key storage rules.

### `@upstream-sync`

**When:** When bitchat (`permissionlesstech/bitchat` or `permissionlesstech/bitchat-android`) publishes a new release or merge.  
**What it produces:** Integration checklist categorizing changes as PROTOCOL / SECURITY / BUG FIX / FEATURE, with mapping to Airhop's TypeScript equivalents.

### `@security-review`

**When:** Before any PR touching `src/core/crypto/`, key storage, or packet signing code.  
**What it checks:** Crypto compliance, key storage, packet signing, OWASP Mobile Top 10.

## 10. Upstream bitchat Sync Process

When bitchat publishes a new version:

1. Invoke `@upstream-sync` with the release tag or commit range.
2. The agent categorizes each change:
   - 🔴 **PROTOCOL CHANGE**: must evaluate for adoption; run compat tests
   - 🟠 **SECURITY PATCH**: must adopt immediately, do not wait for next sprint
   - 🟡 **BUG FIX**: adopt unless it conflicts with Airhop architecture
   - 🟢 **FEATURE**: evaluate against Airhop's gap analysis in `ROADMAP.md`
3. Adopt security patches within 48 hours of identification.
4. Record each decision in `docs/dev/PROGRESS.md` decision log with date and rationale.

## 11. Dependency Policy

- No new dependencies without discussion.
- New production dependencies must be: audited (Cure53 or equivalent), actively maintained (commit in last 6 months), and have a clear TypeScript interface.
- No native modules beyond `react-native-encrypted-storage`, `react-native-mmkv`, `react-native-get-random-values`, and `AirhopBLEModule` (our own) in Phase 0–1.
- See `docs/spec/ARCHITECTURE.md`, section 14 for the full approved dependency manifest.
