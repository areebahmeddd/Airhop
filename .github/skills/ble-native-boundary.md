---
description: >
  Reference for the boundary between TypeScript and native code. Read this before
  adding or modifying anything in android/, ios/, or src/bridge/. The rule is
  simple: native code exposes raw bytes; all protocol logic lives in TypeScript.
  Putting routing, parsing, or crypto decisions in Swift or Kotlin is an
  architectural violation.
---

# BLE Native Boundary

## The Rule

Native modules expose raw bytes to TypeScript. That is all. No packet parsing, no routing decisions, no crypto, no peer ID awareness in Swift or Kotlin.

Every feature is implemented in `src/core/`. Native code is a thin I/O driver.

## What Native Does

- Advertise as a GATT peripheral (BLE server)
- Scan as a GATT central (BLE client)
- Write raw bytes to connected peers
- Emit events when bytes are received or connections change

## What Native Does Not Do

- Parse packet headers
- Check TTL, flags, or packet type
- Make routing decisions
- Know what a peer ID is
- Perform encryption or decryption

## TurboModule Contract

The spec file is `src/bridge/NativeAirhopBLE.ts`. It is Codegen input only — React Native generates the native bridge headers from it automatically. Do not add business logic to this file.

### Methods

```typescript
startAdvertising(serviceUUID: string, localName: string): Promise<void>
stopAdvertising(): Promise<void>
startScanning(serviceUUIDs: string[]): Promise<void>
stopScanning(): Promise<void>
writeToLink(linkID: string, dataBase64: string): Promise<void>
getTorProxyPort(): Promise<number>  // returns 9050 if Orbot/Arti reachable, 0 if not
```

`writeToLink` takes base64-encoded bytes. The bridge transfers binary data as base64 strings for safety across the JS/native boundary. Encode before calling, decode on receipt.

### Events (NativeEventEmitter)

| Event name                   | Payload                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| `AirhopBLE.packetReceived`   | `{ linkID: string, dataBase64: string }`                            |
| `AirhopBLE.linkConnected`    | `{ linkID: string, role: 'central' \| 'peripheral', rssi: number }` |
| `AirhopBLE.linkDisconnected` | `{ linkID: string }`                                                |
| `AirhopBLE.rssiUpdated`      | `{ linkID: string, rssi: number }`                                  |

`linkID` is an opaque string assigned by the native layer. It identifies a BLE connection, not a peer. TypeScript derives the peer identity from the decoded packet's `senderID` field.

## Naming Convention

TurboModule spec files must be named `Native<Name>.ts` (PascalCase) in `src/bridge/`. This is required by React Native Codegen for automatic module discovery. It is the only place in `src/` where PascalCase file names are used.

The three modules:

| File                  | Registered as  | Purpose                        |
| --------------------- | -------------- | ------------------------------ |
| `NativeAirhopBLE.ts`  | `"AirhopBLE"`  | BLE peripheral and central I/O |
| `NativeAirhopTor.ts`  | `"AirhopTor"`  | Tor lifecycle (Arti / Orbot)   |
| `NativeAirhopWiFi.ts` | `"AirhopWiFi"` | WiFi Aware / Multipeer I/O     |

## BLE UUIDs

The Service and Characteristic UUIDs are passed to `startAdvertising` and `startScanning` at runtime from TypeScript constants in `docs/spec/PROTOCOLS.md`. They are not hardcoded in native code.

| Identifier          | Value                                  |
| ------------------- | -------------------------------------- |
| Service UUID        | `F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C` |
| Characteristic UUID | `A1B2C3D4-E5F6-4A5B-8C9D-0E1F2A3B4C5D` |

## One Module Only

There is one native BLE module (`AirhopBLEModule`). Do not create a second BLE module. Extend the existing one if new native capabilities are needed. The same applies to Tor and WiFi.

## Where to Read More

- `bitchat/ios/bitchat/Services/BLE/BLEService.swift`: the reference iOS BLE implementation
- `bitchat/android/.../ble/`: the reference Android implementation
- `src/bridge/NativeAirhopBLE.ts`: the current Codegen spec
