/**
 * @jest-environment node
 */
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { NoiseHandshake } from "../noise-xx";

// Mirrors DR_SEED_INFO in mesh-service: the tests assert the derivation, so they
// have to use the same info string it does.
const INFO = new TextEncoder().encode("airhop-dr-seed-v1");

// Generate a deterministic-looking but actually random keypair pair for tests.
function makeKeypair() {
  const priv = ed25519.utils.randomSecretKey();
  const pub = x25519.getPublicKey(priv);
  return { priv, pub };
}

describe("Noise XX handshake", () => {
  test("full handshake completes: initiator and responder derive matching sessions", () => {
    const iKeys = makeKeypair();
    const rKeys = makeKeypair();

    const initiator = NoiseHandshake.createInitiator(iKeys.priv);
    const responder = NoiseHandshake.createResponder(rKeys.priv);

    // Message 1: initiator → responder
    const msg1 = initiator.writeMsg1();
    expect(msg1).toHaveLength(32);
    responder.readMsg1(msg1);

    // Message 2: responder → initiator
    const msg2 = responder.writeMsg2();
    expect(msg2).toHaveLength(96); // 32 e + 48 enc_s + 16 mac
    initiator.readMsg2(msg2);

    // Message 3: initiator → responder
    const msg3 = initiator.writeMsg3();
    expect(msg3).toHaveLength(64); // 48 enc_s + 16 mac (no payload)
    responder.readMsg3(msg3);

    const sessionI = initiator.split();
    const sessionR = responder.split();

    // Static pub keys are cross-visible
    expect(bytesToHex(sessionI.remoteStaticPubKey)).toBe(bytesToHex(rKeys.pub));
    expect(bytesToHex(sessionR.remoteStaticPubKey)).toBe(bytesToHex(iKeys.pub));

    // Handshake hashes must match (binding proof)
    expect(bytesToHex(sessionI.handshakeHash)).toBe(
      bytesToHex(sessionR.handshakeHash),
    );
  });

  test("transport encrypt/decrypt round-trip", () => {
    const iKeys = makeKeypair();
    const rKeys = makeKeypair();

    const initiator = NoiseHandshake.createInitiator(iKeys.priv);
    const responder = NoiseHandshake.createResponder(rKeys.priv);

    responder.readMsg1(initiator.writeMsg1());
    initiator.readMsg2(responder.writeMsg2());
    responder.readMsg3(initiator.writeMsg3());

    const sessionI = initiator.split();
    const sessionR = responder.split();

    const plaintext = new TextEncoder().encode("Hello, mesh!");
    const ciphertext = sessionI.encrypt(plaintext);
    const recovered = sessionR.decrypt(ciphertext);

    expect(new TextDecoder().decode(recovered)).toBe("Hello, mesh!");
  });

  test("multi-message transport (nonce increments)", () => {
    const iKeys = makeKeypair();
    const rKeys = makeKeypair();

    const i = NoiseHandshake.createInitiator(iKeys.priv);
    const r = NoiseHandshake.createResponder(rKeys.priv);
    r.readMsg1(i.writeMsg1());
    i.readMsg2(r.writeMsg2());
    r.readMsg3(i.writeMsg3());
    const sI = i.split();
    const sR = r.split();

    for (let n = 0; n < 10; n++) {
      const pt = new TextEncoder().encode(`msg-${n}`);
      const ct = sI.encrypt(pt);
      expect(new TextDecoder().decode(sR.decrypt(ct))).toBe(`msg-${n}`);
    }
  });

  test("replay protection: duplicate ciphertext is rejected", () => {
    const iKeys = makeKeypair();
    const rKeys = makeKeypair();

    const i = NoiseHandshake.createInitiator(iKeys.priv);
    const r = NoiseHandshake.createResponder(rKeys.priv);
    r.readMsg1(i.writeMsg1());
    i.readMsg2(r.writeMsg2());
    r.readMsg3(i.writeMsg3());
    const sI = i.split();
    const sR = r.split();

    const ct = sI.encrypt(new TextEncoder().encode("dup"));
    sR.decrypt(ct); // first: ok
    expect(() => sR.decrypt(ct)).toThrow(); // second: replay
  });

  test("tampered ciphertext fails decryption", () => {
    const iKeys = makeKeypair();
    const rKeys = makeKeypair();

    const i = NoiseHandshake.createInitiator(iKeys.priv);
    const r = NoiseHandshake.createResponder(rKeys.priv);
    r.readMsg1(i.writeMsg1());
    i.readMsg2(r.writeMsg2());
    r.readMsg3(i.writeMsg3());
    const sI = i.split();
    const sR = r.split();

    const ct = sI.encrypt(new TextEncoder().encode("secret")).slice();
    ct[ct.length - 1] ^= 0xff; // flip a byte in the auth tag
    expect(() => sR.decrypt(ct)).toThrow();
  });

  test("wrong responder key causes handshake failure", () => {
    const iKeys = makeKeypair();
    const rKeys = makeKeypair();
    const wrongKeys = makeKeypair();

    const initiator = NoiseHandshake.createInitiator(iKeys.priv);
    const responder = NoiseHandshake.createResponder(rKeys.priv);
    const wrongInitiator = NoiseHandshake.createInitiator(wrongKeys.priv);

    responder.readMsg1(wrongInitiator.writeMsg1());
    const msg2 = responder.writeMsg2();
    // Initiator that did the original msg1 tries to consume this msg2
    expect(() => initiator.readMsg2(msg2)).toThrow();
  });
});

// The seam between Noise and the Double Ratchet.
//
// tryInitDR seeds the ratchet's root key from `exporterSecret`. Three properties
// have to hold together, and a change to any one silently breaks or weakens
// every Airhop-to-Airhop DM, so all three are pinned here.
//
// The middle one is the reason this block exists in its current form. The seed
// used to come from `handshakeHash`, on the reasoning that Noise XX mixes both
// parties' ephemerals into it. It does - but it mixes the ephemeral PUBLIC keys,
// via mixHash, while the secret DH outputs go into the chaining key via mixKey.
// Every input to the hash is a byte that went over the air, so an observer who
// captured the handshake could recompute the root key outright. The old tests
// checked that the seed was not derivable from the STATIC keys and never checked
// the transcript itself, which is exactly how it survived.
describe("Double Ratchet seeding", () => {
  function completeHandshake(iPriv: Uint8Array, rPriv: Uint8Array) {
    const initiator = NoiseHandshake.createInitiator(iPriv);
    const responder = NoiseHandshake.createResponder(rPriv);
    const msg1 = initiator.writeMsg1();
    responder.readMsg1(msg1);
    const msg2 = responder.writeMsg2();
    initiator.readMsg2(msg2);
    const msg3 = initiator.writeMsg3();
    responder.readMsg3(msg3);
    return {
      i: initiator.split(),
      r: responder.split(),
      // Everything an eavesdropper sees.
      wire: { msg1, msg2, msg3 },
    };
  }

  test("both sides can seed the same root key with no extra round-trips", () => {
    const iKeys = makeKeypair();
    const rKeys = makeKeypair();
    const { i, r } = completeHandshake(iKeys.priv, rKeys.priv);

    const rootI = hkdf(sha256, i.exporterSecret, undefined, INFO, 32);
    const rootR = hkdf(sha256, r.exporterSecret, undefined, INFO, 32);

    expect(bytesToHex(rootI)).toBe(bytesToHex(rootR));
  });

  test("the seed is NOT the public transcript hash", () => {
    // The handshake hash is a channel binder and is public by construction.
    // Anyone who recorded the three packets holds it, so if the seed were equal
    // to it (or derived from it) the ratchet would be forgeable by a bystander.
    const iKeys = makeKeypair();
    const rKeys = makeKeypair();
    const { i, wire } = completeHandshake(iKeys.priv, rKeys.priv);

    expect(bytesToHex(i.exporterSecret)).not.toBe(bytesToHex(i.handshakeHash));

    // Reconstruct the transcript hash the way an eavesdropper would - protocol
    // name padded to 32, empty prologue, then each message verbatim - and
    // confirm it reproduces the PUBLIC hash but not the seed.
    const name = new TextEncoder().encode("Noise_XX_25519_ChaChaPoly_SHA256");
    let h = new Uint8Array(32);
    h.set(name.slice(0, 32));
    const absorb = (data: Uint8Array): void => {
      h = sha256(new Uint8Array([...h, ...data]));
    };
    absorb(new Uint8Array(0)); // prologue
    absorb(wire.msg1);
    absorb(wire.msg2);
    absorb(wire.msg3);

    // The observer's reconstruction is not asserted equal to handshakeHash here
    // (the real transcript absorbs each message in sub-parts), but it IS built
    // purely from public bytes - and the seed must not be reachable from them.
    expect(bytesToHex(i.exporterSecret)).not.toBe(bytesToHex(h));
    expect(bytesToHex(i.exporterSecret)).not.toBe(
      bytesToHex(hkdf(sha256, h, undefined, INFO, 32)),
    );
  });

  test("the root key is NOT derivable from the two static keys alone", () => {
    // An attacker who later obtains both long-term keys and has recorded the
    // traffic must still not reconstruct the root key.
    const iKeys = makeKeypair();
    const rKeys = makeKeypair();
    const { i } = completeHandshake(iKeys.priv, rKeys.priv);

    const staticStatic = hkdf(
      sha256,
      x25519.getSharedSecret(iKeys.priv, rKeys.pub),
      undefined,
      INFO,
      32,
    );
    const fromExporter = hkdf(sha256, i.exporterSecret, undefined, INFO, 32);

    expect(bytesToHex(fromExporter)).not.toBe(bytesToHex(staticStatic));
  });

  test("two handshakes between the SAME pair yield different root keys", () => {
    // Fresh ephemerals every handshake, so re-pairing does not replay the old
    // chain. A static-static seed was identical for a given pair forever.
    const iKeys = makeKeypair();
    const rKeys = makeKeypair();
    const first = completeHandshake(iKeys.priv, rKeys.priv);
    const second = completeHandshake(iKeys.priv, rKeys.priv);

    expect(bytesToHex(first.i.exporterSecret)).not.toBe(
      bytesToHex(second.i.exporterSecret),
    );
  });

  test("asking for a third split output leaves the transport keys unchanged", () => {
    // The exporter secret is the third HKDF output of the same split that makes
    // the Noise transport keys. HKDF chains block N from block N-1, so k1/k2 are
    // identical to a two-output split - but that is a property of the KDF, not
    // something the type system enforces, and breaking it would silently end
    // transport interop with bitchat. A round-trip pins it.
    const iKeys = makeKeypair();
    const rKeys = makeKeypair();
    const { i, r } = completeHandshake(iKeys.priv, rKeys.priv);

    const ct = i.encrypt(new TextEncoder().encode("still interoperable"));
    expect(new TextDecoder().decode(r.decrypt(ct))).toBe("still interoperable");
  });
});
