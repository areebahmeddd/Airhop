// Tracks outgoing sync requests, so a solicited response can be told apart from
// an unsolicited one. Matches bitchat's RequestSyncManager.swift.
//
// Gossip sync replays old packets by design: a peer returning from a partition
// asks for what it missed, and the answer is stale by definition. That rules
// out a blanket freshness window, which is why the mesh had neither and every
// packet stayed replayable by anyone who had recorded one.
//
// The exemption is attributed by the receiver rather than asserted by the
// sender. We register every REQUEST_SYNC against the peer we sent it to, and a
// response carrying IS_RSR skips the freshness window only if it comes from a
// peer we asked, inside the window. Everything else is held to +/-2 minutes.
//
// This is why requests are unicast: a broadcast request has no peer to register
// against, so nothing it draws back can be attributed.

// How long a request stays answerable. Matches bitchat's 30s responseWindow:
// long enough for a responder to diff its whole store and stream the misses
// back over a congested link, short enough that a recorded response is useless
// by the time it could be replayed.
export const RESPONSE_WINDOW_MS = 30_000;

export class RequestSyncManager {
  // peerID -> when we last asked them. One entry per peer, not per request: a
  // second request to the same peer simply extends the window, and a single
  // request legitimately draws many response packets.
  private readonly pending = new Map<string, number>();

  // Record that we are asking `peerID` for a sync. Must be called before the
  // packet goes out: on a fast link the response can beat our own continuation,
  // and a response arriving before its registration looks unsolicited.
  registerRequest(peerID: string, now: number = Date.now()): void {
    this.pending.set(peerID, now);
  }

  // Whether a packet from `peerID` may skip the freshness window.
  //
  // `isRSR` is the sender's claim; the pending entry is our own record. Both
  // are required, so tagging replayed traffic as a sync response buys nothing
  // from a peer we never asked.
  isValidResponse(
    peerID: string,
    isRSR: boolean,
    now: number = Date.now(),
  ): boolean {
    if (!isRSR) return false;
    const requestedAt = this.pending.get(peerID);
    if (requestedAt === undefined) return false;
    // Not deleted on match: one request draws many packets, and the window is
    // what bounds it, not a single use.
    return now - requestedAt <= RESPONSE_WINDOW_MS;
  }

  // Drop entries whose window has closed. Cheap and idempotent; called from the
  // sync tick rather than a timer of its own.
  prune(now: number = Date.now()): void {
    for (const [peerID, at] of this.pending) {
      if (now - at > RESPONSE_WINDOW_MS) this.pending.delete(peerID);
    }
  }

  // A peer went away: forget we asked it, so a reconnecting device under the
  // same ID cannot inherit the previous session's exemption.
  forget(peerID: string): void {
    this.pending.delete(peerID);
  }

  reset(): void {
    this.pending.clear();
  }

  get pendingCount(): number {
    return this.pending.size;
  }
}
