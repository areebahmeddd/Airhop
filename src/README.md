# src

Application source code, organized by architectural layer. See [docs/spec/ARCHITECTURE.md](../docs/spec/ARCHITECTURE.md) for design decisions and layer boundaries.

## Modules

| Folder           | Responsibility                                                          |
| ---------------- | ----------------------------------------------------------------------- |
| `bridge/`        | TurboModule TypeScript specs (Codegen input only, no business logic)    |
| `core/crypto/`   | Identity, Noise XX/X, Double Ratchet, X3DH, contact exchange            |
| `core/mesh/`     | Packet codec, flood router, fragments, gossip, announce, courier, media |
| `core/nostr/`    | Nostr client, NIP-59 gift-wrap, geo-relay discovery, presence           |
| `core/payments/` | Cashu token parsing, Nutzap event handling                              |
| `core/router/`   | Transport selection: `PeerRegistry` and `MessageRouter`                 |
| `features/`      | Screen-level logic, wires core services to the UI                       |
| `store/`         | Zustand state slices with MMKV persistence                              |
| `ui/`            | Shared UI components                                                    |
| `utils/`         | Stateless helpers: username, panic-wipe, battery optimization           |

## Tests

```sh
npx jest
```

Tests are co-located with their module in a `__tests__/` directory. All `src/core/` tests use `@jest-environment node`, so no React Native runtime is required.

### Unit Test Coverage

| Layer            | Suites | Tests   | Lines   | Excluded                             |
| ---------------- | ------ | ------- | ------- | ------------------------------------ |
| `core/crypto/`   | 5      | 50      | 95%     | -                                    |
| `core/mesh/`     | 11     | 207     | 85%     | Live BLE I/O (native boundary)       |
| `core/nostr/`    | 4      | 47      | 74%     | Network calls (`NostrClient` mocked) |
| `core/payments/` | 1      | 17      | 65%     | Mint connectivity (network)          |
| `core/router/`   | 1      | 25      | 93%     | BLE and WiFi transports (native)     |
| `store/`         | 1      | 14      | 94%     | MMKV persistence (mocked)            |
| `utils/`         | 3      | 33      | 82%     | -                                    |
| **Total**        | **26** | **393** | **86%** |                                      |

### Integration Test Coverage

Not yet added. The UI layer is not built. Once feature screens exist, [Maestro](https://maestro.mobile.dev) is the planned tool for UI flow smoke tests.

BLE mesh behavior cannot be emulated. Testing actual peer discovery, multi-hop routing, and Noise handshakes over a live connection requires two physical devices. This is covered by manual two-device testing before any release.
