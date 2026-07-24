/**
 * @jest-environment node
 */
// Prekey stores + the forward-secret courier seal/open path they enable.
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { CourierStore, decodeEnvelopePayload } from "../courier-store";
import { PREKEY_MAX_PREKEYS, verifyPrekeyBundle } from "../prekey-bundle";
import { LocalPrekeyStore, PeerPrekeyStore } from "../prekey-store";

let counter = 0;
function freshId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

function x25519Keypair(): { priv: Uint8Array; pub: Uint8Array } {
  const priv = crypto.getRandomValues(new Uint8Array(32));
  return { priv, pub: x25519.getPublicKey(priv) };
}

describe("LocalPrekeyStore", () => {
  it("generates a full pool and builds a verifiable bundle", () => {
    const store = new LocalPrekeyStore(freshId("local"));
    const signPriv = ed25519.utils.randomSecretKey();
    const signPub = ed25519.getPublicKey(signPriv);
    const noise = x25519Keypair();

    const bundle = store.buildBundle(noise.pub, signPriv)!;
    expect(bundle.prekeys).toHaveLength(PREKEY_MAX_PREKEYS);
    expect(verifyPrekeyBundle(bundle, signPub)).toBe(true);

    // A private key exists for every published prekey.
    for (const p of bundle.prekeys) {
      expect(store.privForId(p.id)).not.toBeNull();
    }
  });

  it("keeps a consumed key openable during the grace window but drops it from new bundles", () => {
    const store = new LocalPrekeyStore(freshId("local"));
    const signPriv = ed25519.utils.randomSecretKey();
    const noise = x25519Keypair();
    const first = store.buildBundle(noise.pub, signPriv)!;
    const usedId = first.prekeys[0].id;

    store.consume(usedId);
    // Still openable (grace window) ...
    expect(store.privForId(usedId)).not.toBeNull();
    // ... but not offered in a fresh bundle.
    const second = store.buildBundle(noise.pub, signPriv)!;
    expect(second.prekeys.some((p) => p.id === usedId)).toBe(false);
    expect(second.prekeys).toHaveLength(PREKEY_MAX_PREKEYS);
  });
});

describe("PeerPrekeyStore", () => {
  it("assigns distinct prekeys and exhausts", () => {
    const local = new LocalPrekeyStore(freshId("local"));
    const peers = new PeerPrekeyStore(freshId("peers"));
    const signPriv = ed25519.utils.randomSecretKey();
    const noise = x25519Keypair();
    const bundle = local.buildBundle(noise.pub, signPriv)!;

    peers.ingest(bundle);
    const assigned = new Set<number>();
    for (let i = 0; i < PREKEY_MAX_PREKEYS; i++) {
      const a = peers.assign(noise.pub)!;
      expect(assigned.has(a.id)).toBe(false);
      assigned.add(a.id);
    }
    // Pool exhausted: no more to hand out.
    expect(peers.assign(noise.pub)).toBeNull();
  });

  it("ignores an older bundle and adopts a newer one", () => {
    const peers = new PeerPrekeyStore(freshId("peers"));
    const signPriv = ed25519.utils.randomSecretKey();
    const noise = x25519Keypair();
    const local = new LocalPrekeyStore(freshId("local"));
    const b1 = local.buildBundle(noise.pub, signPriv)!;
    const older = { ...b1, generatedAt: b1.generatedAt - 1000 };

    peers.ingest(b1);
    peers.ingest(older); // ignored (not newer)
    expect(peers.has(noise.pub)).toBe(true);
  });
});

describe("forward-secret courier seal/open via prekey", () => {
  it("seals to a peer's one-time prekey and opens with the matching private key", () => {
    // Recipient publishes a bundle.
    const recipLocal = new LocalPrekeyStore(freshId("local"));
    const recipSignPriv = ed25519.utils.randomSecretKey();
    const recipNoise = x25519Keypair();
    const bundle = recipLocal.buildBundle(recipNoise.pub, recipSignPriv)!;

    // Sender stores it and assigns a prekey to seal to.
    const senderPeers = new PeerPrekeyStore(freshId("peers"));
    senderPeers.ingest(bundle);
    const prekey = senderPeers.assign(recipNoise.pub)!;

    const sender = x25519Keypair();
    const senderSignPriv = ed25519.utils.randomSecretKey();
    const packet = CourierStore.seal(
      new TextEncoder().encode("secret handshake"),
      sender.priv,
      recipNoise.pub,
      "aabbccdd00112233",
      senderSignPriv,
      prekey,
    );

    const env = decodeEnvelopePayload(packet.payload)!;
    expect(env.prekeyID).toBe(prekey.id);

    // Recipient opens with the matching one-time private prekey.
    const openKey = recipLocal.privForId(env.prekeyID!)!;
    const { plaintext, senderStaticPubKey } = CourierStore.open(
      env.ciphertext,
      openKey,
    );
    expect(new TextDecoder().decode(plaintext)).toBe("secret handshake");
    expect([...senderStaticPubKey]).toEqual([...sender.pub]);

    // A different one-time key cannot open it (forward secrecy boundary).
    const otherId = bundle.prekeys.find((p) => p.id !== env.prekeyID)!.id;
    const wrongKey = recipLocal.privForId(otherId)!;
    expect(() => CourierStore.open(env.ciphertext, wrongKey)).toThrow();
  });
});
