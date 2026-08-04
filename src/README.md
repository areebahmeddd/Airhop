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

### What each layer covers

| Layer            | Covered                                                       | Excluded                             |
| ---------------- | ------------------------------------------------------------- | ------------------------------------ |
| `core/crypto/`   | Noise XX and X, Double Ratchet, contact binding               | -                                    |
| `core/mesh/`     | Wire format, routing, gossip, fragments, voice, board         | Live BLE I/O (native boundary)       |
| `core/nostr/`    | Gift-wrap, geohash identity, relay discovery, bitchat interop | Network calls (`NostrClient` mocked) |
| `core/payments/` | Cashu BDHKE and DLEQ, proof selection, Nutzap, seed           | Mint connectivity (network)          |
| `core/router/`   | Peer registry, transport selection                            | BLE and WiFi transports (native)     |
| `i18n/`          | Catalog completeness and structure                            | -                                    |
| `services/`      | Runtime wiring, app lifecycle, multi-device scenarios         | Native radios (modelled, see below)  |
| `store/`         | State transitions and persistence shape                       | MMKV persistence (mocked)            |
| `utils/`         | Stateless helpers                                             | -                                    |

`npx jest` prints the current suite and test totals; they are deliberately not
repeated here.

`services/` carries the lifecycle and multi-device suites, which is why it is no
longer the thin layer it once was: the rules `mesh-service` enforces are
exercised against a modelled OS and radio rather than left to a device.

### Multi-device simulation

`services/__tests__/sim/` runs whole scenarios across several phones at once.
Each simulated phone is a **fully isolated copy of the app**, with its own
`mesh-service`, stores, MMKV and event emitter, built with `jest.isolateModules`
and driven through a modelled Android/iOS OS, a modelled BLE medium, in-memory
Nostr relays that speak real NIP-01, and a Cashu mint doing real BDHKE. Nothing
above the wire is stubbed: the real flood router, real Noise XX, real Double
Ratchet, real `SimplePool`, real proof selection.

Scenarios assert **invariants** rather than scripted outcomes, because for
twenty phones under random faults there is no single correct transcript. What
must hold after any interleaving: everyone converges, nothing renders twice,
nothing forged renders at all, delivery state never runs backwards, badges match
their threads, and no sat is created or destroyed.

Covered today:

- **Delivery.** Multi-hop across a chain that cannot hear itself, a 25-phone
  room, gossip catch-up after a partition, a source route followed rather than
  flooded.
- **bitchat interop.** A live mixed mesh, Airhop-only types dropped as unknown
  by a bitchat relay in the middle, and an Android-convention broadcast voice
  burst reaching an Airhop speaker.
- **Media.** Parallel attachment transfers, push-to-talk sharing a radio with a
  file send, a private attachment refused by the relays that carried it.
- **Attacks.** Replay and Sybil floods, a recorded voice burst replayed at
  strangers hours later, a stale packet carrying a perfect signature, and
  impersonation at the message, attachment and ANNOUNCE layers. The last is the
  one that matters most: it decides which key a claimed sender is checked
  against.
- **Payments.** Offline ecash transfer and double-spend refusal.
- **Recovery.** Panic wipe, crash recovery, a seeded soak of hundreds of random
  events.
- **Anything needing a third phone.** Private groups with an outsider in the
  room, a bulletin reaching someone who arrived later, store-and-forward where
  the carrier cannot read what it carries, the internet gateway, the mesh
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
