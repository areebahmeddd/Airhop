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
import { computePacketId, PacketType, type Packet } from "./packet-codec";

const DEFAULT_TTL = 7;

// Neighbour count at which the mesh counts as dense. Matches bitchat's
// TransportConfig.bleHighDegreeThreshold.
const HIGH_DEGREE_THRESHOLD = 6;

// Time-critical relays (media fragments and live voice) use a much tighter
// window than ordinary traffic. Matches bitchat's bleFragmentRelay* constants.
const TIME_CRITICAL_MIN_DELAY_MS = 8;
const TIME_CRITICAL_MAX_DELAY_MS = 25;
// ...and a TTL clamp, so a sustained stream cannot flood a dense graph to full
// depth. bleFragmentRelayTtlCap / bleFragmentRelayTtlCapDense.
const TIME_CRITICAL_TTL_CAP = 7;
const TIME_CRITICAL_TTL_CAP_DENSE = 5;

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

// Whether a packet type is carrying something the listener is waiting on right
// now, rather than something that merely has to arrive.
//
// Live voice is the reason this exists. A talker emits a steady ~15 packets a
// second and the receiver plays them out of a 350 ms jitter buffer, so relay
// delay is not a throughput question, it is the difference between hearing a
// sentence and hearing gaps. The ordinary window above spends up to 220 ms per
// hop, which three hops of relaying turns into more than the entire buffer.
// Media fragments get the same treatment for the same reason, and this is the
// policy bitchat applies to both.
function isTimeCritical(type: number): boolean {
  return type === PacketType.FRAGMENT || type === PacketType.VOICE_FRAME;
}

// TTL a packet may be relayed with, after clamping. Time-critical floods are
// contained harder in a dense graph, where full-depth flooding of a sustained
// stream would crowd out everything else; a sparse mesh keeps full depth so
// voice reaches as far as text does.
function relayTtl(packet: Packet, degree: number): number {
  const ttl = Math.min(packet.ttl, DEFAULT_TTL);
  if (!isTimeCritical(packet.type)) return ttl;
  const cap =
    degree >= HIGH_DEGREE_THRESHOLD
      ? TIME_CRITICAL_TTL_CAP_DENSE
      : TIME_CRITICAL_TTL_CAP;
  return Math.min(ttl, cap);
}

function relayDelayMs(packet: Packet, degree: number): number {
  if (!isTimeCritical(packet.type)) return jitterMs(degree);
  const span = TIME_CRITICAL_MAX_DELAY_MS - TIME_CRITICAL_MIN_DELAY_MS;
  return TIME_CRITICAL_MIN_DELAY_MS + Math.floor(Math.random() * (span + 1));
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

    const degree = this.getDegree();
    const ttl = relayTtl(packet, degree);
    if (ttl > 1) {
      this.scheduleRelay(
        { ...packet, ttl: ttl - 1 },
        pid,
        send,
        relayDelayMs(packet, degree),
      );
    }

    return true;
  }

  // Originate a packet from this node. Records the ID so we do not relay
  // our own broadcasts back to ourselves.
  originate(packet: Packet): void {
    this.dedup.add(computePacketId(packet));
  }

  private scheduleRelay(
    packet: Packet,
    pid: Uint8Array,
    send: SendFn,
    delayMs: number,
  ): void {
    const idKey = Array.from(pid)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const timer = setTimeout(() => {
      this.pending.delete(idKey);
      send(packet);
    }, delayMs);

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
