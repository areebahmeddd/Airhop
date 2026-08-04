# Source

This directory contains the application source code, organized by
architectural layer.

## Directory layout

| Directory        | Responsibility                                                                        |
| ---------------- | ------------------------------------------------------------------------------------- |
| `bridge/`        | React Native TurboModule TypeScript specifications (Codegen input only)               |
| `core/crypto/`   | Identity, Noise XX/X, Double Ratchet, and contact exchange                            |
| `core/encoding/` | Binary and base64 encoding helpers shared across the protocol                         |
| `core/mesh/`     | Packet codec, flood routing, fragmentation, gossip, announcements, courier, and media |
| `core/nostr/`    | Nostr client, NIP-59 gift-wrap, geohash relay discovery, and presence                 |
| `core/payments/` | Cashu tokens, DLEQ, proof selection, NIP-61 events, and BIP-39 seed handling          |
| `core/router/`   | Transport selection through `PeerRegistry` and `MessageRouter`                        |
| `services/`      | Runtime services including mesh, wallet, and transfer orchestration                   |
| `features/`      | Screen-level logic that connects services to the UI                                   |
| `store/`         | Zustand state slices with MMKV persistence                                            |
| `ui/`            | Shared UI components                                                                  |
| `data/`          | Static application data such as relay lists, licenses, and release notes              |
| `i18n/`          | Translation catalog, locale loading, and right-to-left layout support                 |
| `utils/`         | Stateless utilities such as username generation, panic wipe, and battery optimization |

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
# Run all tests
npx jest

# Run with coverage
npm run coverage

# Run the packet codec benchmarks
npm run benchmark
```

Tests live alongside the code they exercise in a `__tests__/` directory, and
benchmarks live in `__benchmarks__/`.

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
| `services/`      | Runtime wiring, lifecycle, multi-device scenarios                      | Physical radios (simulated)               |
| `store/`         | State transitions and persistence shape                                | MMKV persistence (mocked)                 |
| `utils/`         | Stateless utilities                                                    | None                                      |

`npx jest` reports the current suite and test totals, so they are not duplicated
here.

`services/` contains the runtime lifecycle and multi-device simulation suites.
Although it began as a thin wiring layer, most of the application's behavioral
tests now live here because they exercise the system as a whole rather than
individual components.

### Multi-device simulation

The simulator under `services/__tests__/sim/` runs complete scenarios across
multiple virtual devices.

Each simulated phone is a fully isolated application instance with its own
`mesh-service`, Zustand stores, MMKV storage, and event emitter. Isolation is
provided through `jest.isolateModules()`.

The simulated environment models:

- Android and iOS lifecycle behavior
- BLE communication
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
- **Payments:** offline Cashu transfers and double-spend prevention.
- **Recovery:** panic wipe, crash recovery, and long-running seeded soak tests.
- **Complex network behavior:** private groups, delayed bulletin delivery,
  store-and-forward messaging, internet gateways, mesh bridges, and Tor
  fail-closed behavior.

Gateway and bridge behavior is tested separately in
`tier-gateway-bridge.test.ts`. These scenarios depend on a location model,
because both features operate on geohash cells. Without a location fix there is
no shared cell to uplink or route between.

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
