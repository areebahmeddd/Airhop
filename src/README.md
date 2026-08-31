# Source

This directory contains the application source code, organized by
architectural layer.

## Directory layout

| Directory        | Responsibility                                                                 |
| ---------------- | ------------------------------------------------------------------------------ |
| `app/`           | The root component and the tab state machine                                   |
| `bridge/`        | React Native TurboModule TypeScript specifications (Codegen input only)        |
| `core/crypto/`   | Identity, Noise XX/X, Double Ratchet, and contact exchange                     |
| `core/encoding/` | Binary and base64 encoding helpers shared across the protocol                  |
| `core/mesh/`     | The mesh protocol, split by concern (see below)                                |
| `core/nostr/`    | Nostr client, NIP-59 gift-wrap, geohash relay discovery, and presence          |
| `core/payments/` | Cashu tokens, DLEQ, proof selection, NIP-61 events, and BIP-39 seed handling   |
| `core/router/`   | Transport selection through `PeerRegistry` and `MessageRouter`                 |
| `services/`      | Runtime services including mesh, wallet, and transfer orchestration            |
| `features/`      | Screen-level logic that connects services to the UI                            |
| `store/`         | Zustand state slices with MMKV persistence                                     |
| `ui/`            | Shared components, hooks, and theme tokens                                     |
| `platform/`      | Thin wrappers over OS APIs: permissions, haptics, OEM battery settings         |
| `data/`          | Static application data such as relay lists, licenses, and release notes       |
| `i18n/`          | Translation catalog, locale loading, and right-to-left layout support          |
| `utils/`         | Stateless, side-effect-free helpers such as formatting and username generation |

### `core/mesh/`

The mesh protocol is the largest subsystem, so it is grouped by concern rather
than kept flat:

| Directory    | Responsibility                                                    |
| ------------ | ----------------------------------------------------------------- |
| `wire/`      | The packet frame and every payload that rides inside it           |
| `routing/`   | TTL flood, deduplication, fragmentation, source routes            |
| `links/`     | Open links per transport, and the writes that go down them        |
| `sync/`      | GCS gossip sync and outgoing request tracking                     |
| `discovery/` | Signed announces and nickname normalization                       |
| `rooms/`     | Private-channel and private-group crypto                          |
| `courier/`   | Store-and-forward envelopes and the one-time prekeys they seal to |
| `voice/`     | Live push-to-talk capture and playback                            |

`wire/` holds the bytes that must stay compatible with bitchat, so a change to
byte layout is visible as a change under one directory.

### Module specifiers

One rule: a specifier that leaves its top-level layer is written as a path
alias; a specifier that stays inside the layer stays relative.

```ts
import { encodePacket } from "@core/mesh/wire/packet-codec"; // crossing layers
import MessageBubble from "./message-bubble"; // same layer
```

Aliases are declared in `tsconfig.json` and mirrored in `package.json` under
`jest.moduleNameMapper`. Expo's Metro resolves them from `tsconfig.json`
directly.

## Layer boundaries

`core/` contains the protocol implementation and is intentionally free of
platform, native, and network dependencies. That keeps the protocol
deterministic and fully testable in CI without requiring a React Native
runtime.

Code that communicates with the outside world, such as BLE, Nostr relays, or
Cashu mints, lives in `services/`, which wires the pure protocol into the
runtime.

## Testing

### Running tests

```sh
# Run all tests once
npm test

# Re-run on change while working
npm run test:watch

# Run one area
npm test -- --testPathPattern=src/core

# Run with coverage
npm run coverage

# Run the packet codec benchmarks
npm run benchmark
```

A test for one module lives alongside it in a `__tests__/` directory, and
benchmarks live in `__benchmarks__/`.

Suites that exercise the whole app rather than one module live under
`src/__tests__/`:

| Directory     | Holds                                                          |
| ------------- | -------------------------------------------------------------- |
| `harness/`    | The OS, native-module, and app-shell model both suites drive   |
| `lifecycle/`  | Cold start, mid-session transport changes, teardown            |
| `simulation/` | The multi-device simulator, its world model, and its scenarios |

All tests under `src/core/` run with `@jest-environment node`, so they execute
without React Native.

### Testing philosophy

The test suite follows four principles:

- **Never depend on the system clock.** Tests run under fake timers, and
  anything requiring a timestamp receives it from the harness. This avoids
  failures that only appear on slower CI machines.
- **Always seed randomness.** Every simulation scenario uses a deterministic
  PRNG seed so failures can be reproduced exactly.
- **Assert invariants instead of execution order.** Distributed systems rarely
  have a single valid message sequence. Tests verify properties that must always
  hold regardless of scheduling.
- **Every bug fix gets a negative control.** Before trusting a new test, revert
  the fix and confirm the test fails. A test that passes with and without the
  change provides no confidence.

### Test coverage

| Layer            | Covered                                                                | Excluded                                  |
| ---------------- | ---------------------------------------------------------------------- | ----------------------------------------- |
| `core/crypto/`   | Noise XX/X, Double Ratchet, contact binding                            | None                                      |
| `core/encoding/` | Base64 round-trips and malformed input                                 | None                                      |
| `core/mesh/`     | Wire format, routing, gossip, fragments, voice, bulletin board         | Native BLE I/O                            |
| `core/nostr/`    | Gift-wrap, geohash identity, relay discovery, bitchat interoperability | Live network calls (`NostrClient` mocked) |
| `core/payments/` | Cashu BDHKE, DLEQ, proof selection, Nutzap, seed handling              | Mint connectivity                         |
| `core/router/`   | Peer registry and transport selection                                  | Native transports                         |
| `i18n/`          | Translation catalog completeness                                       | None                                      |
| `services/`      | Per-service behaviour: payments, geohash channels, transfers, policy   | Physical radios (simulated)               |
| `store/`         | State transitions and persistence shape                                | MMKV persistence (mocked)                 |
| `platform/`      | OEM battery-settings URI resolution                                    | OS dialogs                                |
| `utils/`         | Stateless utilities                                                    | None                                      |
| `__tests__/`     | Whole-app lifecycle and multi-device simulation                        | Physical radios (simulated)               |

Most of the application's behavioural coverage is in `src/__tests__/`, because
those suites exercise the system as a whole rather than any single component.

### Multi-device simulation

The simulator under `src/__tests__/simulation/` runs complete scenarios across
multiple virtual devices.

Each simulated phone is a fully isolated application instance with its own
`mesh-service`, Zustand stores, MMKV storage, and event emitter. Isolation is
provided through `jest.isolateModules()`.

The simulated environment models:

- Android and iOS lifecycle behavior
- BLE, Wi-Fi Aware, and LAN communication
- In-memory Nostr relays implementing NIP-01
- A Cashu mint performing real BDHKE operations

Above the transport boundary, production code is used throughout. The simulator
runs the real flood router, Noise XX, Double Ratchet, `SimplePool`, proof
selection, and protocol logic without stubbing.

Rather than asserting a fixed transcript, scenarios verify invariants that must
hold regardless of scheduling. For example:

- every participant eventually converges
- messages never render twice
- forged messages are rejected
- delivery state never regresses
- unread counts remain consistent
- no value is created or destroyed during payments

Current scenarios cover:

- **Delivery:** multi-hop routing, large mesh rooms, network partitions, gossip
  recovery, and source routing.
- **bitchat interoperability:** mixed Airhop/bitchat meshes, unknown packet
  handling, and cross-network voice delivery.
- **Media:** concurrent attachment transfers, push-to-talk alongside file
  transfers, and relay enforcement of private attachments.
- **Security:** replay attacks, Sybil floods, stale signed packets, recorded
  voice replay, and sender impersonation across messages, attachments, and
  announcements.
- **Transports:** the LAN dial cap, cross-platform delivery with no Bluetooth
  between the phones, and client isolation.
- **Payments:** offline Cashu transfers and double-spend prevention.
- **Recovery:** panic wipe, crash recovery, and long-running seeded soak tests.
- **Complex network behavior:** private groups, delayed bulletin delivery,
  store-and-forward messaging, internet gateways, mesh bridges, and Tor
  fail-closed behavior.

Gateway and bridge behavior is tested separately in
`simulation/scenarios/gateway-bridge.test.ts`. These scenarios depend on a
location model, because both features operate on geohash cells. Without a
location fix there is no shared cell to uplink or route between.

`smoke.test.ts` validates the simulator itself. If those tests fail, the
simulation harness cannot be trusted, making every other simulation result
meaningless.

### Hardware validation

The simulator models the operating system contract, not the physical hardware.

The following still require testing on real devices before a release:

- BLE discovery timing
- MTU negotiation
- CoreBluetooth behavior on physical hardware
- OEM battery management
- Real Tor circuits

On-device UI smoke tests are planned with
[Maestro](https://maestro.mobile.dev).
