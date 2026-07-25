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

| Layer            | Suites | Tests   | Statements | Excluded                             |
| ---------------- | ------ | ------- | ---------- | ------------------------------------ |
| `core/crypto/`   | 5      | 53      | 93%        | -                                    |
| `core/mesh/`     | 22     | 275     | 84%        | Live BLE I/O (native boundary)       |
| `core/nostr/`    | 9      | 77      | 75%        | Network calls (`NostrClient` mocked) |
| `core/payments/` | 3      | 70      | 74%        | Mint connectivity (network)          |
| `core/router/`   | 1      | 30      | 80%        | BLE and WiFi transports (native)     |
| `services/`      | 4      | 46      | 14%        | Mesh and mint I/O (native + network) |
| `store/`         | 11     | 141     | 73%        | MMKV persistence (mocked)            |
| `utils/`         | 9      | 85      | 67%        | -                                    |
| **Total**        | **64** | **777** | **68%**    |                                      |

`services/` is the outlier because it is the layer that owns sockets and HTTP:
`mesh-service` needs a radio and `wallet-service` needs a live mint, so most of
it is only reachable from a device. The rules those services enforce are tested
where they live, in `core/` and `store/`.

### Integration Test Coverage

Not yet added. [Maestro](https://maestro.mobile.dev) is the planned tool for UI
flow smoke tests.

BLE mesh behavior cannot be emulated. Testing actual peer discovery, multi-hop routing, and Noise handshakes over a live connection requires two physical devices. This is covered by manual two-device testing before any release.
