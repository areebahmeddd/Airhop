// Every link this device holds, across every transport, and the only place
// bytes are written to one.
//
// A transport here is one that carries links, so BLE and the WiFi fast path.
// Nostr and courier are transports in MessageRouter's sense but hold no
// sockets, so they are not this file's concern.
//
// It holds links and answers questions about them. It decides nothing: which
// packet goes where, what makes a peer count as direct, and what a refused
// write means all stay in services/mesh-service.ts.
//
// Two things a change here must keep. One question gets one answer covering
// every transport, never an answer per transport for the caller to combine.
// And enumeration order is observable, since couriers are the first few
// `directPeers()`, so `TRANSPORT_KINDS` order is load-bearing.
//
// Adding a transport is a member of `TRANSPORT_KINDS` and a writer for it. The
// writers are injected and nothing here imports native code, so this runs in CI
// without a radio.

// The order every observable list is enumerated in. Distinct from
// `SEND_PREFERENCE`: this is "what order do we list things in", that is "which
// link do we use".
export const TRANSPORT_KINDS = ["ble", "wifi"] as const;

export type TransportKind = (typeof TRANSPORT_KINDS)[number];

// Which link to take when a peer is reachable on more than one transport. WiFi
// first: it exists to move an attachment BLE would split into hundreds of paced
// writes, so whenever both are held the fast one is the point of having it.
const SEND_PREFERENCE: readonly TransportKind[] = ["wifi", "ble"];

export interface Link {
  readonly id: string;
  readonly kind: TransportKind;
}

// Hands bytes to a radio, rejecting when the write did not go. The rejection is
// never interpreted here: a refused BLE write usually means a full queue on a
// healthy link, a refused WiFi unicast is treated as a dead socket, and that
// difference is the caller's to make.
export type LinkWriteFn = (linkID: string, dataBase64: string) => Promise<void>;

// Not exported: callers pass an object literal.
interface BroadcastOptions {
  // Restrict to one transport, as the periodic ANNOUNCE does.
  readonly kind?: TransportKind;
  // Skip one link. This is the relay rule: bytes are never written back down
  // the link they arrived on.
  readonly exclude?: string;
}

export class LinkRegistry {
  // linkID to the transport that opened it, in the order links came up.
  //
  // One table rather than one per transport because the native modules namespace
  // link IDs and they cannot collide: BLE issues `c:<id>` and `p:<id>` on both
  // platforms, WiFi issues `wifi-<n>` on iOS and `wifi-in-<n>` / `wifi-out-<n>`
  // on Android.
  private readonly kindByLink = new Map<string, TransportKind>();

  // linkID to the peer bound to it. Not every open link has one: a link is a
  // socket, and it says nothing about who is on the far end until they announce.
  private readonly peerByLink = new Map<string, string>();

  // peerID to every link bound to it, most recently bound first.
  //
  // A list, not one entry per transport: Bluetooth is dual-role, so two phones
  // that meet each dial the other and hold two BLE links to the same peer. One
  // slot per transport cannot represent that, and closing either link would
  // unbind the other.
  private readonly linksByPeer = new Map<string, string[]>();

  private sent = 0;

  constructor(
    private readonly writers: Readonly<Record<TransportKind, LinkWriteFn>>,
  ) {}

  // ---- Lifecycle ----

  // Idempotent, so a repeated event for a link we hold leaves its binding alone.
  open(kind: TransportKind, linkID: string): void {
    if (this.kindByLink.has(linkID)) return;
    this.kindByLink.set(linkID, kind);
  }

  // Returns the peer only when this was its last link, so the caller can run
  // whatever else its departure owes. Sessions, presence and sync budgets are
  // not this file's business.
  //
  // Nothing is returned while the peer still holds another link. It has not
  // gone anywhere, and reporting a departure would retire a live neighbour's
  // session state and drop it off the radar until its next announce.
  close(linkID: string): string | undefined {
    this.kindByLink.delete(linkID);
    const peerID = this.peerByLink.get(linkID);
    this.peerByLink.delete(linkID);
    if (peerID === undefined) return undefined;
    return this.dropBinding(peerID, linkID) ? peerID : undefined;
  }

  // Every link on one transport at once, for when the OS withdraws it or the mesh
  // stops. Not equivalent to closing them from outside: in both cases the
  // disconnect events that would have done so are no longer being delivered, so
  // nothing else clears them and a later send goes down a dead socket.
  closeAll(kind: TransportKind): void {
    for (const linkID of this.linkIDs(kind)) this.close(linkID);
  }

  // On the announce, not at link-up, because a link says nothing about who is on
  // the far end. What counts as a direct announce is the caller's decision.
  //
  // Binding adds a link rather than replacing the peer's others, so a peer
  // reached over two transports, or over both Bluetooth roles, keeps all of them.
  // Most recently bound goes first, which is the one a send prefers within a
  // transport.
  bind(linkID: string, peerID: string): void {
    if (!this.kindByLink.has(linkID)) return;
    // A link claimed by a different peer keeps one owner: drop the old claim
    // first, or the two indexes stop agreeing and every query below inherits
    // the disagreement. The announce handler will not do this today, since it
    // refuses a direct announce from a peer other than the bound one.
    const previous = this.peerByLink.get(linkID);
    if (previous !== undefined && previous !== peerID) {
      this.dropBinding(previous, linkID);
    }
    this.peerByLink.set(linkID, peerID);
    const linkIDs = this.linksByPeer.get(peerID) ?? [];
    const existing = linkIDs.indexOf(linkID);
    if (existing !== -1) linkIDs.splice(existing, 1);
    linkIDs.unshift(linkID);
    this.linksByPeer.set(peerID, linkIDs);
  }

  // Forget a peer's binding while leaving the link open, since it may still be
  // relaying for others. `kind` narrows to one transport, which only the LEAVE
  // handler needs.
  unbind(peerID: string, kind?: TransportKind): void {
    const linkIDs = this.linksByPeer.get(peerID);
    if (linkIDs === undefined) return;
    for (const linkID of [...linkIDs]) {
      if (kind !== undefined && this.kindByLink.get(linkID) !== kind) continue;
      this.peerByLink.delete(linkID);
      this.dropBinding(peerID, linkID);
    }
  }

  // Drops one link from a peer's list. Reports whether that was its last, which
  // is what separates a link closing from a peer leaving.
  private dropBinding(peerID: string, linkID: string): boolean {
    const linkIDs = this.linksByPeer.get(peerID);
    if (linkIDs === undefined) return false;
    const at = linkIDs.indexOf(linkID);
    if (at !== -1) linkIDs.splice(at, 1);
    if (linkIDs.length > 0) return false;
    this.linksByPeer.delete(peerID);
    return true;
  }

  // ---- Queries ----

  // The trustworthy way to attribute an incoming packet: a `senderID` header is
  // plaintext and forgeable, the far end of a socket we hold is not.
  peerOf(linkID: string): string | undefined {
    return this.peerByLink.get(linkID);
  }

  // The strict test. A peer reachable only by flooding through a neighbour is
  // not here: a flood is a hope, a link is a route.
  hasPeer(peerID: string): boolean {
    return this.linksByPeer.has(peerID);
  }

  // Preference-ordered, so a peer held on both transports comes back on the
  // faster one. `kind` pins it to one transport.
  linkFor(peerID: string, kind?: TransportKind): Link | undefined {
    const links = this.linksFor(peerID);
    return kind === undefined
      ? links[0]
      : links.find((link) => link.kind === kind);
  }

  // Every link to a peer, for callers that cannot use the first one: the relay
  // must not send a packet back down the link it arrived on, and should try the
  // peer's other links before falling back to flooding.
  //
  // Ordered by `SEND_PREFERENCE`, then most recently bound first within a
  // transport, which is the link the peer most recently proved it was on.
  linksFor(peerID: string): readonly Link[] {
    const linkIDs = this.linksByPeer.get(peerID);
    if (linkIDs === undefined) return [];
    const links: Link[] = [];
    for (const kind of SEND_PREFERENCE) {
      for (const id of linkIDs) {
        if (this.kindByLink.get(id) === kind) links.push({ id, kind });
      }
    }
    return links;
  }

  // In `TRANSPORT_KINDS` order, each transport's in the order its links came up.
  linkIDs(kind?: TransportKind): readonly string[] {
    const ids: string[] = [];
    for (const candidate of TRANSPORT_KINDS) {
      if (kind !== undefined && candidate !== kind) continue;
      for (const [linkID, linkKind] of this.kindByLink) {
        if (linkKind === candidate) ids.push(linkID);
      }
    }
    return ids;
  }

  // Peers we hold a link to, deduplicated, since one peer reached over two
  // transports, or over both Bluetooth roles, is still one peer. `kind` narrows
  // to peers reachable on that transport.
  //
  // Order matters to both callers: a sync request is link-local, so asking a
  // peer three hops away wastes a write, and couriers are the first few of
  // these.
  directPeers(kind?: TransportKind): readonly string[] {
    const peers: string[] = [];
    const seen = new Set<string>();
    for (const linkID of this.linkIDs(kind)) {
      const peerID = this.peerByLink.get(linkID);
      if (peerID === undefined || seen.has(peerID)) continue;
      seen.add(peerID);
      peers.push(peerID);
    }
    return peers;
  }

  // How crowded the mesh looks. The flood router scales relay jitter and the
  // time-critical TTL cap by it.
  //
  // Peers, not links, and Bluetooth only. Both halves matter and both match
  // bitchat, whose degree is `peerRegistry.connectedCount`:
  //
  //   * Peers, because Bluetooth is dual-role. Two phones that meet each dial
  //     the other, so one neighbour is two links, and counting links reads a
  //     room as twice as crowded as it is.
  //   * Bluetooth, because the delay exists for radio contention. Every phone
  //     in earshot hears a packet at the same instant and rebroadcasting
  //     together drowns the room out. A socket on another transport does not
  //     compete for that airtime, so counting it slows the radio down for no
  //     reason.
  degree(): number {
    return this.directPeers("ble").length;
  }

  // Open links. Distinct from `degree`: this counts sockets we hold, which is
  // what the announce reports and what the diagnostics screen shows.
  size(kind?: TransportKind): number {
    if (kind === undefined) return this.kindByLink.size;
    let count = 0;
    for (const linkKind of this.kindByLink.values()) {
      if (linkKind === kind) count++;
    }
    return count;
  }

  // ---- Writes ----

  // Accurate by construction, since every write goes through `send`.
  get bytesSent(): number {
    return this.sent;
  }

  // Rejects exactly as the radio did, so callers keep their own failure
  // handling. A link we do not hold resolves instead: it is the outcome the
  // radio would have produced for a socket that closed a moment ago.
  send(linkID: string, dataBase64: string): Promise<void> {
    const kind = this.kindByLink.get(linkID);
    if (kind === undefined) return Promise.resolve();
    this.sent += Math.ceil((dataBase64.length * 3) / 4);
    return this.writers[kind](linkID, dataBase64);
  }

  // Resolves to whether at least one link took the bytes. Most callers ignore
  // that; the fragment pacer cannot, because a refused write it does not retry
  // is a file the far side can never finish.
  //
  // A refused write never closes a link: a radio says the same thing when its
  // queue is merely full, and nothing re-adds a link except a fresh connect
  // event that never comes for one that stayed up. Teardown belongs to the
  // disconnect event.
  async broadcast(
    dataBase64: string,
    options: BroadcastOptions = {},
  ): Promise<boolean> {
    const results = await Promise.all(
      this.linkIDs(options.kind)
        .filter((linkID) => linkID !== options.exclude)
        .map((linkID) =>
          this.send(linkID, dataBase64).then(
            () => true,
            () => false,
          ),
        ),
    );
    return results.some(Boolean);
  }

  // Onward to every link except the one the bytes arrived on. A packet does not
  // need to go back to the peer it just came from, and doing so is how a
  // two-node mesh spins.
  relay(dataBase64: string, ingressLinkID: string): void {
    void this.broadcast(dataBase64, { exclude: ingressLinkID });
  }
}
