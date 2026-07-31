# src

Application source code, organized by architectural layer. See [docs/spec/ARCHITECTURE.md](../docs/spec/ARCHITECTURE.md) for design decisions and layer boundaries.

## Modules

| Folder           | Responsibility                                                          |
| ---------------- | ----------------------------------------------------------------------- |
| `bridge/`        | TurboModule TypeScript specs (Codegen input only, no business logic)    |
| `core/crypto/`   | Identity, Noise XX/X, Double Ratchet, contact exchange                  |
| `core/mesh/`     | Packet codec, flood router, fragments, gossip, announce, courier, media |
| `core/nostr/`    | Nostr client, NIP-59 gift-wrap, geo-relay discovery, presence           |
| `core/payments/` | Cashu tokens, DLEQ, proof selection, NIP-61 events, BIP-39 seed         |
| `core/router/`   | Transport selection: `PeerRegistry` and `MessageRouter`                 |
| `services/`      | Long-lived runtime wiring: mesh service, wallet service, transfers      |
| `features/`      | Screen-level logic, wires core services to the UI                       |
| `store/`         | Zustand state slices with MMKV persistence                              |
| `ui/`            | Shared UI components                                                    |
| `utils/`         | Stateless helpers: username, panic-wipe, battery optimization           |

`core/` is pure and has no native or network dependencies, which is why the
whole protocol is testable in CI. Anything that opens a socket or talks to a
mint lives in `services/`.

## Tests

```sh
# Run all tests
npx jest

# Run with coverage report
npm run coverage
```

Tests are co-located with their module in a `__tests__/` directory. All `src/core/` tests use `@jest-environment node`, so no React Native runtime is required.

### Unit Test Coverage

| Layer            | Suites | Tests     | Excluded                             |
| ---------------- | ------ | --------- | ------------------------------------ |
| `core/crypto/`   | 5      | 58        | -                                    |
| `core/mesh/`     | 23     | 338       | Live BLE I/O (native boundary)       |
| `core/nostr/`    | 11     | 111       | Network calls (`NostrClient` mocked) |
| `core/payments/` | 3      | 88        | Mint connectivity (network)          |
| `core/router/`   | 1      | 38        | BLE and WiFi transports (native)     |
| `i18n/`          | 2      | 15        | -                                    |
| `services/`      | 19     | 176       | Native radios (modelled, see below)  |
| `store/`         | 14     | 182       | MMKV persistence (mocked)            |
| `utils/`         | 12     | 126       | -                                    |
| **Total**        | **90** | **1,132** |                                      |

`services/` includes the lifecycle and multi-device suites, which is why it is no
longer the thin layer it once was: the rules `mesh-service` enforces are now
exercised against a modelled OS and radio rather than left to a device.

### Multi-device simulation

`services/__tests__/sim/` runs whole scenarios across several phones at once.
Each simulated phone is a **fully isolated copy of the app** - its own
`mesh-service`, stores, MMKV and event emitter, built with `jest.isolateModules`

- driven through a modelled Android/iOS OS, a modelled BLE medium, in-memory
Nostr relays that speak real NIP-01, and a Cashu mint doing real BDHKE. Nothing
above the wire is stubbed: the real flood router, real Noise XX, real Double
Ratchet, real `SimplePool`, real proof selection.

Scenarios assert **invariants** rather than scripted outcomes, because for
twenty phones under random faults there is no single correct transcript. What
must hold after any interleaving: everyone converges, nothing renders twice,
nothing forged renders at all, delivery state never runs backwards, badges match
their threads, and no sat is created or destroyed.

Covered today: multi-hop delivery across a chain that cannot hear itself, a
25-phone room, a live mixed Airhop/bitchat mesh, parallel attachment transfers,
live push-to-talk sharing a radio with a file send, offline ecash and
double-spend refusal, replay and Sybil floods, impersonation at the message, the
attachment and the ANNOUNCE layer (the last being the one that picks which key a
claimed sender is checked against), a private attachment being rendered by the
relays that merely carried it, a recorded voice burst replayed at strangers hours
later, panic wipe, crash recovery, a
seeded soak of hundreds of random events, and the features that only mean
anything with a third device present: private groups with an outsider in the
room, a bulletin notice reaching someone who arrived later, store-and-forward
where the carrier cannot read what it carries, the internet gateway, the mesh
bridge, and Tor failing closed rather than falling back to the clear net.

The internet gateway and the mesh bridge get their own file
(`tier-gateway-bridge.test.ts`) and a location fabric, because both are defined
by geohash cells: without a position fix the named location channels resolve to
no cell, so there is nothing to uplink and nowhere for two islands to meet.

`smoke.test.ts` contains the harness's own self-checks. If those go red, nothing
else in that directory means anything.

### What still needs hardware

The simulation models the OS contract; it cannot prove the hardware honours it.
Real BLE discovery timing, MTU negotiation, CoreBluetooth on real silicon, OEM
battery managers and real Tor circuits still require two physical devices before
a release. [Maestro](https://maestro.mobile.dev) remains the planned tool for
on-device UI flow smoke tests.
