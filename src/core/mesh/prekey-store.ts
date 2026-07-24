// One-time prekey stores for forward-secret asynchronous first contact.
//
// Two halves, mirroring bitchat's LocalPrekeyStore + PrekeyBundleStore:
//
//   LocalPrekeyStore  - our own one-time Curve25519 private prekeys. We publish
//                       their public halves in a signed bundle (0x24); a sender
//                       seals courier mail to one, and we open it with the
//                       matching private key, then consume it. Consumed keys are
//                       kept for a grace window so in-flight envelopes still open
//                       before the key is dropped, giving forward secrecy.
//
//   PeerPrekeyStore   - verified bundles from other peers. When we courier mail
//                       to a peer we hold a bundle for, we assign one of their
//                       unused prekeys and seal to it instead of their long-lived
//                       static key.
//
// Persisted to MMKV (wiped on panic). Private prekeys are one-time and
// lower-value than the Keychain-held static identity key, so MMKV is acceptable.

import { x25519 } from "@noble/curves/ed25519.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { createMMKV } from "react-native-mmkv";
import {
  PREKEY_MAX_PREKEYS,
  signPrekeyBundle,
  type Prekey,
  type PrekeyBundle,
} from "./prekey-bundle";

// Keep a used prekey's private key this long after consumption so a second
// in-flight envelope sealed to it still opens (bitchat's consumed-grace window).
const CONSUMED_GRACE_MS = 48 * 60 * 60 * 1000;
// Cap on stored peer bundles (sender-controlled volume via gossip).
const MAX_PEERS = 200;

interface LocalPrekey {
  id: number;
  priv: string; // hex
  pub: string; // hex
}
interface ConsumedPrekey extends LocalPrekey {
  consumedAt: number;
}
interface LocalState {
  nextId: number;
  generatedAt: number;
  prekeys: LocalPrekey[];
  consumed: ConsumedPrekey[];
}

// ---- LocalPrekeyStore -------------------------------------------------------

export class LocalPrekeyStore {
  private readonly storage;
  private readonly key = "local";
  private state: LocalState;

  constructor(mmkvId = "prekey-store") {
    this.storage = createMMKV({ id: mmkvId });
    this.state = this.load();
    this.ensure();
  }

  private load(): LocalState {
    const raw = this.storage.getString(this.key);
    if (raw !== undefined) {
      try {
        return JSON.parse(raw) as LocalState;
      } catch {
        // fall through to a fresh pool
      }
    }
    return { nextId: 1, generatedAt: 0, prekeys: [], consumed: [] };
  }

  private persist(): void {
    this.storage.set(this.key, JSON.stringify(this.state));
  }

  // Ensure the pool holds a full batch of unused prekeys, generating fresh
  // Curve25519 keypairs as needed. Bumps generatedAt when the pool changes so a
  // freshly built bundle supersedes older copies for our noise key.
  ensure(target = PREKEY_MAX_PREKEYS): void {
    this.pruneConsumed();
    let changed = false;
    while (this.state.prekeys.length < target) {
      const priv = crypto.getRandomValues(new Uint8Array(32));
      const pub = x25519.getPublicKey(priv);
      this.state.prekeys.push({
        id: this.state.nextId,
        priv: bytesToHex(priv),
        pub: bytesToHex(pub),
      });
      this.state.nextId = (this.state.nextId + 1) >>> 0 || 1;
      changed = true;
    }
    if (changed) {
      this.state.generatedAt = Math.max(Date.now(), this.state.generatedAt + 1);
      this.persist();
    }
  }

  // A signed bundle over our current unused prekeys, for broadcast/gossip.
  buildBundle(
    noiseStaticPubKey: Uint8Array,
    signingPrivKey: Uint8Array,
  ): PrekeyBundle | null {
    this.ensure();
    const prekeys: Prekey[] = this.state.prekeys
      .slice(0, PREKEY_MAX_PREKEYS)
      .map((p) => ({ id: p.id, publicKey: hexToBytes(p.pub) }));
    if (prekeys.length === 0) return null;
    return signPrekeyBundle(
      {
        noiseStaticPublicKey: noiseStaticPubKey,
        prekeys,
        generatedAt: this.state.generatedAt,
      },
      signingPrivKey,
    );
  }

  // The private key for a prekey id, from the live pool or the grace window.
  privForId(id: number): Uint8Array | null {
    const live = this.state.prekeys.find((p) => p.id === id);
    if (live !== undefined) return hexToBytes(live.priv);
    const grace = this.state.consumed.find((p) => p.id === id);
    return grace !== undefined ? hexToBytes(grace.priv) : null;
  }

  // Mark a prekey used: move it to the grace window and replenish the pool.
  consume(id: number): void {
    const idx = this.state.prekeys.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const [used] = this.state.prekeys.splice(idx, 1);
    this.state.consumed.push({ ...used, consumedAt: Date.now() });
    this.persist();
    this.ensure();
  }

  private pruneConsumed(): void {
    const cutoff = Date.now() - CONSUMED_GRACE_MS;
    const before = this.state.consumed.length;
    this.state.consumed = this.state.consumed.filter(
      (p) => p.consumedAt > cutoff,
    );
    if (this.state.consumed.length !== before) this.persist();
  }

  clearAll(): void {
    this.state = { nextId: 1, generatedAt: 0, prekeys: [], consumed: [] };
    this.storage.remove(this.key);
    this.ensure();
  }
}

// ---- PeerPrekeyStore --------------------------------------------------------

interface StoredPeerBundle {
  generatedAt: number;
  prekeys: { id: number; pub: string }[]; // pub hex
  usedIds: number[];
  receivedAt: number;
}

export class PeerPrekeyStore {
  private readonly storage;
  private readonly key = "peers";
  private peers: Record<string, StoredPeerBundle>;

  constructor(mmkvId = "prekey-store") {
    this.storage = createMMKV({ id: mmkvId });
    this.peers = this.load();
  }

  private load(): Record<string, StoredPeerBundle> {
    const raw = this.storage.getString(this.key);
    if (raw !== undefined) {
      try {
        return JSON.parse(raw) as Record<string, StoredPeerBundle>;
      } catch {
        // fall through
      }
    }
    return {};
  }

  private persist(): void {
    this.storage.set(this.key, JSON.stringify(this.peers));
  }

  // Store a (caller-verified) bundle, replacing an older one for the same noise
  // key. A newer bundle resets the used-id set: its prekeys are fresh.
  ingest(bundle: PrekeyBundle): void {
    const noiseHex = bytesToHex(bundle.noiseStaticPublicKey);
    const existing = this.peers[noiseHex];
    if (existing !== undefined && bundle.generatedAt <= existing.generatedAt) {
      return; // not newer
    }
    this.peers[noiseHex] = {
      generatedAt: bundle.generatedAt,
      prekeys: bundle.prekeys.map((p) => ({
        id: p.id,
        pub: bytesToHex(p.publicKey),
      })),
      usedIds: [],
      receivedAt: Date.now(),
    };
    this.enforceCap();
    this.persist();
  }

  // Assign an unused prekey for sealing to this peer, marking it used so a
  // later message picks a different one. Null when we hold no fresh prekey.
  assign(
    noiseStaticPubKey: Uint8Array,
  ): { id: number; publicKey: Uint8Array } | null {
    const noiseHex = bytesToHex(noiseStaticPubKey);
    const peer = this.peers[noiseHex];
    if (peer === undefined) return null;
    const used = new Set(peer.usedIds);
    const next = peer.prekeys.find((p) => !used.has(p.id));
    if (next === undefined) return null;
    peer.usedIds.push(next.id);
    this.persist();
    return { id: next.id, publicKey: hexToBytes(next.pub) };
  }

  has(noiseStaticPubKey: Uint8Array): boolean {
    return this.peers[bytesToHex(noiseStaticPubKey)] !== undefined;
  }

  private enforceCap(): void {
    const entries = Object.entries(this.peers);
    if (entries.length <= MAX_PEERS) return;
    entries
      .sort((a, b) => a[1].receivedAt - b[1].receivedAt)
      .slice(0, entries.length - MAX_PEERS)
      .forEach(([k]) => delete this.peers[k]);
  }

  clearAll(): void {
    this.peers = {};
    this.storage.remove(this.key);
  }
}
