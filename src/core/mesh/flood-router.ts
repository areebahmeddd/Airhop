// TTL flood router with jitter and deduplication.
//
// Routing rules per PROTOCOLS.md section 4:
//   - Every incoming packet whose packet ID has not been seen is relayed.
//   - TTL is decremented before relay; packets with TTL = 0 are dropped.
//   - Relay is delayed by a random jitter (10–220 ms) to prevent cascade storms.
//   - Duplicate packets (same ID within 5 min) are dropped silently.
//
// Packet ID matches bitchat PacketIdUtil: SHA-256(type|senderID|timestamp|payload)[0:16]
//
// The router does not know about encryption, signatures, or message types.
// Callers are responsible for verifying signatures before passing a packet in.
import { Deduplicator } from "./deduplicator";
import { computePacketId, type Packet } from "./packet-codec";

const DEFAULT_TTL = 7;

// Relay delay scales with how many neighbours we can hear (our "degree"),
// matching bitchat's RelayController. In a sparse mesh we relay almost
// immediately so a packet is not cancelled before it propagates; in a dense
// mesh we wait longer so someone else's relay usually wins first and duplicate
// suppression does more of the work. The overall window is 10–220 ms.
function jitterMs(degree: number): number {
  let min: number;
  let max: number;
  if (degree <= 2) {
    min = 10;
    max = 40;
  } else if (degree <= 5) {
    min = 60;
    max = 150;
  } else if (degree <= 9) {
    min = 80;
    max = 180;
  } else {
    min = 100;
    max = 220;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}

export type SendFn = (packet: Packet) => void;

export class FloodRouter {
  private readonly dedup = new Deduplicator();

  // Returns our current neighbour count so relay jitter can adapt to mesh
  // density. Defaults to 0 (sparse) when the caller does not provide one, which
  // keeps the router usable in tests without wiring up a live peer count.
  constructor(private readonly getDegree: () => number = () => 0) {}
  // Scheduled relay timers, keyed by packet ID hex. Stored so callers can
  // flush on shutdown if needed.
  private readonly pending: Map<string, ReturnType<typeof setTimeout>> =
    new Map();

  // Process an incoming packet from the BLE layer.
  //
  // Returns true if the packet is new (caller should handle it locally).
  // Returns false if the packet is a duplicate (caller should drop silently).
  //
  // When the packet is new AND still has TTL remaining, a relay is scheduled
  // automatically via the provided send function.
  receive(packet: Packet, send: SendFn): boolean {
    const pid = computePacketId(packet);
    if (this.dedup.has(pid)) return false;
    this.dedup.add(pid);

    if (packet.ttl > 1) {
      this.scheduleRelay({ ...packet, ttl: packet.ttl - 1 }, pid, send);
    }

    return true;
  }

  // Originate a packet from this node. Records the ID so we do not relay
  // our own broadcasts back to ourselves.
  originate(packet: Packet): void {
    this.dedup.add(computePacketId(packet));
  }

  private scheduleRelay(packet: Packet, pid: Uint8Array, send: SendFn): void {
    const idKey = Array.from(pid)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const timer = setTimeout(() => {
      this.pending.delete(idKey);
      send(packet);
    }, jitterMs(this.getDegree()));

    this.pending.set(idKey, timer);
  }

  // Cancel all pending relay timers (e.g., on BLE disconnect or shutdown).
  flush(): void {
    for (const timer of this.pending.values()) {
      clearTimeout(timer);
    }
    this.pending.clear();
  }

  get defaultTTL(): number {
    return DEFAULT_TTL;
  }
}
