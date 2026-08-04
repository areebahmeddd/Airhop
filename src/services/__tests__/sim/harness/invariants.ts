// What must be true of Airhop after ANY sequence of events.
//
// This file is the reason the chaos tiers are worth running. For two phones and
// a scripted exchange you can write down the expected outcome. For twenty
// phones, a flapping radio and a partitioned relay set you cannot: the number
// of legal outcomes is enormous, and enumerating them would mean encoding the
// implementation's behaviour as the expectation, which tests nothing.
//
// So the assertions here are properties, not outcomes. "Everyone who could hear
// it ended up with the same messages" is true of a correct system under every
// interleaving and false under none of them. A property that survives a
// thousand random schedules is evidence; a scripted expectation that passes
// once is not.
//
// Each check returns findings rather than throwing, so one scenario reports
// every way it went wrong instead of only the first.

import type { SeenMessage, SimDevice } from "./device";

export interface Finding {
  invariant: string;
  detail: string;
}

// A message identity that is stable across devices. The store's `id` is the
// protocol message id, which is exactly what dedup is supposed to key on, so
// using it here is the point: if two rows share an id, the app rendered one
// message twice.
function key(m: SeenMessage): string {
  return m.id;
}

// ---- convergence ------------------------------------------------------------

// Everyone listed ended up with the same set of messages in the channel.
//
// Deliberately compares SETS, not sequences. Two devices can legitimately order
// two messages sent in the same millisecond differently, because they arrived in
// different orders and the tie-break is local. Requiring identical sequences
// would fail on correct behaviour, which is how a harness loses its credibility.
// A device is only expected to hold messages it did not write. The sender's own
// copy is a DIFFERENT row with a DIFFERENT id: message-thread.tsx mints a local
// id for the optimistic echo, while the wire copy carries the id
// sendChannelMessage generated. That is correct behaviour - a broadcaster never
// receives its own broadcast back - so comparing raw id sets across devices
// would report a failure on a perfectly converged room.
export function convergence(
  devices: SimDevice[],
  channel: string,
  // Messages the harness knows were never deliverable to anyone, e.g. sent
  // while the sender was alone, so their absence is not a failure.
  ignore: (m: SeenMessage) => boolean = () => false,
): Finding[] {
  if (devices.length < 2) return [];
  const inboundOf = new Map<string, Map<string, string>>();
  for (const d of devices) {
    const rows = new Map<string, string>();
    for (const m of d.messages(channel)) {
      if (m.isMine || m.isSystem === true || ignore(m)) continue;
      rows.set(key(m), m.senderID);
    }
    inboundOf.set(d.id, rows);
  }

  // Every inbound message anyone saw, with who wrote it.
  const union = new Map<string, string>();
  for (const rows of inboundOf.values()) {
    for (const [id, sender] of rows) union.set(id, sender);
  }

  const findings: Finding[] = [];
  for (const d of devices) {
    const rows = inboundOf.get(d.id);
    if (rows === undefined) continue;
    const missing = [...union.entries()]
      // Its own messages are not expected to come back to it.
      .filter(([, sender]) => sender !== d.peerID)
      .filter(([id]) => !rows.has(id))
      .map(([id]) => id);
    if (missing.length > 0) {
      findings.push({
        invariant: "convergence",
        detail: `${d.id} is missing ${missing.length} message(s) in ${channel} that others received: ${missing
          .slice(0, 5)
          .join(", ")}`,
      });
    }
  }
  return findings;
}

// The sender kept its own copy. Separate from convergence because it is a
// different failure: the message went out but the composer lost it.
export function senderKeptOwnCopy(
  device: SimDevice,
  channel: string,
  texts: string[],
): Finding[] {
  const mine = device
    .messages(channel)
    .filter((m) => m.isMine)
    .map((m) => m.text);
  return texts
    .filter((t) => !mine.includes(t))
    .map((t) => ({
      invariant: "sender-kept-own-copy",
      detail: `${device.id} sent "${t}" in ${channel} but holds no copy of it`,
    }));
}

// ---- exactly once -----------------------------------------------------------

// The same logical message never appears twice on one device.
//
// This is the invariant that BLE flood + gossip resync + the Nostr mirror +
// the mesh bridge all conspire against: four independent paths can deliver the
// same message, and only the deduplicator stops the user seeing it four times.
export function exactlyOnce(devices: SimDevice[]): Finding[] {
  const findings: Finding[] = [];
  for (const d of devices) {
    const all = d.allMessages();
    for (const channel of Object.keys(all)) {
      const seen = new Map<string, number>();
      for (const m of all[channel]) {
        if (m.isSystem === true) continue;
        seen.set(key(m), (seen.get(key(m)) ?? 0) + 1);
      }
      for (const [id, count] of seen) {
        if (count > 1) {
          findings.push({
            invariant: "exactly-once",
            detail: `${d.id} rendered message ${id} ${count} times in ${channel}`,
          });
        }
      }
    }
  }
  return findings;
}

// Text-level duplication, which catches the case where the same content arrived
// under two different ids because a transport re-originated it rather than
// relaying it. The id-level check above cannot see that.
export function noDuplicateText(
  devices: SimDevice[],
  channel: string,
): Finding[] {
  const findings: Finding[] = [];
  for (const d of devices) {
    const counts = new Map<string, number>();
    for (const m of d.messages(channel)) {
      if (m.isSystem === true || m.text.length === 0) continue;
      const k = `${m.senderID}|${m.text}`;
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    for (const [k, n] of counts) {
      if (n > 1) {
        findings.push({
          invariant: "no-duplicate-text",
          detail: `${d.id} shows "${k.split("|")[1]}" ${n} times in ${channel}`,
        });
      }
    }
  }
  return findings;
}

// ---- authenticity -----------------------------------------------------------

// Nothing rendered claims to come from a peer ID that no device in the world
// owns. A forged or corrupted packet must be dropped before display, never
// shown with an attacker-chosen sender.
export function noForgedSenders(
  devices: SimDevice[],
  // Peer IDs that are legitimately expected beyond the simulated phones, e.g. a
  // bitchat actor or a deliberately injected adversary the scenario is about.
  extraLegitimate: string[] = [],
): Finding[] {
  const legit = new Set<string>([
    ...devices.map((d) => d.peerID),
    ...extraLegitimate,
  ]);
  const findings: Finding[] = [];
  for (const d of devices) {
    const all = d.allMessages();
    for (const channel of Object.keys(all)) {
      for (const m of all[channel]) {
        if (m.isSystem === true) continue;
        if (m.senderID.length === 0) continue;
        // Nostr-only correspondents are addressed by pubkey, not peer ID.
        if (m.senderID.startsWith("nostr_")) continue;
        if (!legit.has(m.senderID)) {
          findings.push({
            invariant: "no-forged-senders",
            detail: `${d.id} rendered a message in ${channel} from unknown sender ${m.senderID}`,
          });
        }
      }
    }
  }
  return findings;
}

// ---- delivery state ---------------------------------------------------------

const STATUS_RANK: Record<string, number> = {
  sending: 0,
  failed: 1,
  sent: 2,
  carried: 2,
  queued: 2,
  delivered: 3,
  read: 4,
};

// Watches outgoing message status over the life of a scenario and reports any
// backwards step. A late "delivered" arriving after "read" must not downgrade
// the tick the user already saw.
export class StatusWatcher {
  private readonly best = new Map<string, { rank: number; status: string }>();
  private readonly findings: Finding[] = [];

  constructor(private readonly devices: SimDevice[]) {}

  // Call between advances. Cheap: it only reads the store.
  sample(): void {
    for (const d of this.devices) {
      const all = d.allMessages();
      for (const channel of Object.keys(all)) {
        for (const m of all[channel]) {
          if (!m.isMine || m.status === undefined) continue;
          const rank = STATUS_RANK[m.status];
          if (rank === undefined) continue;
          const id = `${d.id}|${m.id}`;
          const prev = this.best.get(id);
          if (prev !== undefined && rank < prev.rank) {
            this.findings.push({
              invariant: "monotonic-delivery-state",
              detail: `${d.id} message ${m.id} went ${prev.status} -> ${m.status}`,
            });
          }
          if (prev === undefined || rank > prev.rank) {
            this.best.set(id, { rank, status: m.status });
          }
        }
      }
    }
  }

  results(): Finding[] {
    return this.findings;
  }
}

// ---- unread / badge ---------------------------------------------------------

// The unread count for a conversation never exceeds the number of messages in
// it that could plausibly be unread, and an opened thread reads as zero.
export function unreadCoherent(
  devices: SimDevice[],
  openThreads: Record<string, string | null> = {},
): Finding[] {
  const findings: Finding[] = [];
  for (const d of devices) {
    const all = d.allMessages();
    for (const channel of Object.keys(all)) {
      const unread = d.unread(channel);
      const incoming = all[channel].filter(
        (m) => !m.isMine && m.isSystem !== true,
      ).length;
      if (unread > incoming) {
        findings.push({
          invariant: "unread-coherent",
          detail: `${d.id} shows ${unread} unread in ${channel} but only holds ${incoming} incoming messages`,
        });
      }
      if (unread < 0) {
        findings.push({
          invariant: "unread-coherent",
          detail: `${d.id} shows a negative unread count (${unread}) in ${channel}`,
        });
      }
      if (openThreads[d.id] === channel && unread !== 0) {
        findings.push({
          invariant: "unread-coherent",
          detail: `${d.id} has ${channel} open but still reports ${unread} unread`,
        });
      }
    }
  }
  return findings;
}

// The aggregate badge equals the sum of the parts. A badge that disagrees with
// the list beneath it is the single most common "app feels broken" complaint.
export function badgeMatchesThreads(devices: SimDevice[]): Finding[] {
  const findings: Finding[] = [];
  for (const d of devices) {
    const all = d.allMessages();
    let sum = 0;
    for (const channel of Object.keys(all)) sum += d.unread(channel);
    if (sum !== d.totalUnread()) {
      findings.push({
        invariant: "badge-matches-threads",
        detail: `${d.id} badge ${d.totalUnread()} != sum of thread unreads ${sum}`,
      });
    }
  }
  return findings;
}

// Nothing was offered to a link that a link cannot carry. A frame past the
// 512-byte ATT ceiling is truncated by Android and refused by iOS, so it never
// decodes on the far side and the transfer dies with no error anywhere. This is
// the invariant that was missing when every attachment fragment shipped at 557
// bytes: the fabric had no limit, so nothing noticed.
export function noOversizedFrames(radio: {
  framesOversized: number;
}): Finding[] {
  if (radio.framesOversized === 0) return [];
  return [
    {
      invariant: "no-oversized-frames",
      detail: `${String(radio.framesOversized)} frame(s) exceeded the BLE link limit and were dropped`,
    },
  ];
}

// ---- process health ---------------------------------------------------------

// No device died. An uncaught exception on a thread the OS owns is process
// death, and the OS model records it rather than letting the harness carry on
// as if a thrown callback were survivable.
export function noCrashes(devices: SimDevice[]): Finding[] {
  return devices
    .filter((d) => d.os.crashed !== null)
    .map((d) => ({
      invariant: "no-crashes",
      detail: `${d.id} died: ${String(d.os.crashed)}`,
    }));
}

// After a scenario tears down, nothing should still be scheduled. A leaked
// interval is a background battery drain on a real phone and a leaked
// subscription is a message delivered to a mesh that no longer exists.
export function noLeakedTimers(before: number): Finding[] {
  const after = jest.getTimerCount();
  if (after <= before) return [];
  return [
    {
      invariant: "no-leaked-timers",
      detail: `${after - before} timer(s) still scheduled after teardown (was ${before}, now ${after})`,
    },
  ];
}

// ---- helpers ----------------------------------------------------------------

export function combine(...groups: Finding[][]): Finding[] {
  return groups.flat();
}
