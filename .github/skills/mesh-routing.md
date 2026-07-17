---
description: >
  Reference for the mesh flood routing, deduplication, and fragment reassembly
  rules. Read this before modifying src/core/mesh/flood-router.ts,
  deduplicator.ts, or fragment-manager.ts. Subtle mistakes here cause routing
  loops, dropped messages, or broken interoperability with bitchat nodes.
---

# Mesh Routing and Deduplication

Implementation: `src/core/mesh/flood-router.ts`, `deduplicator.ts`, `fragment-manager.ts`. Reference: `bitchat/ios/bitchat/Services/BLE/BLEService.swift` and bitchat Android.

## Flood Routing Rules

```
receive(packet, send) -> boolean
```

- Returns `true` if the packet is new; the caller should handle it locally.
- Returns `false` if the packet is a duplicate; the caller drops it silently.
- When the packet is new and `ttl > 1`, a relay is scheduled automatically.

### TTL Handling

TTL is decremented **before** relay. The relayed copy has `packet.ttl - 1`. A packet with `ttl <= 1` is never relayed (only handled locally if new). Default TTL is `7`.

Relays decrement TTL but do not re-sign. The original signature remains valid because signing normalizes TTL to `0` (see `bitchat-wire-format` skill).

### Originating Packets

Call `originate(packet)` when this node creates a packet. This records the packet ID in the dedup cache so the node does not relay its own broadcasts when it hears them echoed back.

### Jitter Delay

Relay is not immediate. A random delay of `10-220 ms` is applied before the `send` callback fires. This prevents cascade relay storms when many nodes receive the same packet at the same time. The delay is random, not deterministic.

## Deduplication

The `Deduplicator` is a time-bounded LRU cache of packet IDs.

### Packet ID Formula

```
PacketID = SHA-256(type[1] | senderID[8] | timestamp_u64_BE[8] | payload)[0:16]
```

16 bytes (32 hex chars). Matches `PacketIdUtil.swift` / `PacketIdUtil.kt`. The same formula is used in `computePacketId` in `packet-codec.ts`.

### Cache Parameters

| Parameter     | Value     |
| ------------- | --------- |
| Max entries   | 1000      |
| Expiry window | 5 minutes |

Oldest entry is evicted when the cache is full. A packet seen again within the expiry window is a duplicate regardless of its content.

## Fragment Reassembly

Large packets that exceed the BLE MTU are split into 469-byte fragments. The fragment manager reassembles them transparently.

### Fragment Payload Layout

```
[8 bytes: stream ID (u64 BE, random per original packet)]
[2 bytes: fragment index (u16 BE, 0-based)]
[2 bytes: total fragment count (u16 BE)]
[1 byte:  original packet type]
[up to 456 bytes: fragment data]
```

Header is 13 bytes. Data per fragment is 456 bytes (469 - 13).

### Assembly Parameters

| Parameter                 | Value      |
| ------------------------- | ---------- |
| Fragment size             | 469 bytes  |
| Data per fragment         | 456 bytes  |
| Max concurrent assemblies | 128        |
| Reassembly timeout        | 30 seconds |
| Max reassembled size      | 1 MiB      |

These values match bitchat iOS `BLEFragmentHandler` / `BLEFragmentAssemblyBuffer`. Do not change them without checking the reference implementations.

Partial assemblies are silently dropped after 30 seconds. The sender must retransmit if fragments are lost.

## Gossip Sync

`REQUEST_SYNC` packets (type `0x21`) use TTL=2 intentionally. They propagate only to immediate mesh neighbors, not across the wider network. This is by design: gossip reconciliation is a local-mesh operation.

Gossip uses a Golomb-Coded Set (GCS) filter, not a bloom filter. The false positive rate formula is different. See `src/core/mesh/gossip-sync.ts` and the reference `bitchat/ios/bitchat/Sync/GossipSyncManager.swift`.

## Announce Broadcasts

`ANNOUNCE` packets are broadcast every 30 seconds. Receiving a valid `ANNOUNCE` is how a node learns another peer's `senderID` to `signingPubKey` mapping. This mapping must be verified before relaying any other packet from that sender.

## What Not to Do

- Do not relay a packet before decrementing TTL.
- Do not relay packets originating from this node (use `originate()` to register them).
- Do not change the fragment size, reassembly timeout, or dedup expiry without matching bitchat.
- Do not use a bloom filter; the protocol requires a GCS filter for gossip.
