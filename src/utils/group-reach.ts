// How much of a private group a message could actually have got to.
//
// Groups have no read receipts and are not getting any: a receipt is a directed
// message to the author, so it needs a pairwise Noise session with them, and a
// group deliberately has none. Its epoch key is symmetric precisely so sixteen
// people can read each other without sixteen sessions each. Adding receipts
// would turn that star into a full mesh of up to 120 handshakes.
//
// What can be answered for free is the question people actually have on a mesh,
// which is not "did they read it" but "did it get out". The roster is known, and
// so is who is currently reachable, so the two can be compared locally with no
// packet, no session and nothing reported by anyone else.
//
// Two counting rules, both so the number agrees with the member list beside it:
//
//   - You are excluded from both halves. "4 of 7" where the 7 includes you
//     reads as though your own device were in question.
//   - Blocked members are excluded from both halves, matching what the geohash
//     participant list does. Counting someone the roster no longer shows would
//     make the two disagree.

export interface GroupReach {
  // Members other than you, minus anyone blocked.
  total: number;
  // How many of those are currently reachable.
  reachable: number;
}

// `reachablePeerIDs` and `blockedPeerIDs` are passed in rather than read from
// their stores, so this stays a pure function the tests can drive directly.
//
// A member is identified on the roster by fingerprint and on the radio by peer
// ID, and the peer ID is the first 16 hex of the fingerprint. That mapping is
// used in five other places (see channel-info-sheet and mesh-service) and is a
// consequence of peerID = SHA-256(noiseStaticPub)[0:8].
export function groupReach(
  memberFingerprints: readonly string[],
  localPeerID: string,
  reachablePeerIDs: ReadonlySet<string>,
  blockedPeerIDs: ReadonlySet<string>,
): GroupReach {
  let total = 0;
  let reachable = 0;
  for (const fingerprint of memberFingerprints) {
    const peerID = fingerprint.slice(0, 16);
    if (peerID === localPeerID) continue;
    if (blockedPeerIDs.has(peerID)) continue;
    total++;
    if (reachablePeerIDs.has(peerID)) reachable++;
  }
  return { total, reachable };
}
