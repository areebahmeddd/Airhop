/**
 * @jest-environment node
 */
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import {
  initReceiver,
  initSender,
  ratchetDecrypt,
  ratchetEncrypt,
} from "../double-ratchet";
import {
  deserializeBundle,
  generatePrekeyBundle,
  generateX25519KeyPair,
  serializeBundle,
  x3dhInitiate,
  x3dhReceive,
} from "../x3dh";

// Generate a full Airhop identity (noise static + Ed25519 signing).
// x25519 uses the same randomSecretKey generator as ed25519 in @noble/curves.
function makeIdentity() {
  const signingPriv = ed25519.utils.randomSecretKey();
  const signingPub = ed25519.getPublicKey(signingPriv);
  const noisePriv = ed25519.utils.randomSecretKey(); // 32-byte X25519 scalar
  return { signingPriv, signingPub, noisePriv };
}

function encode(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}
function decode(b: Uint8Array): string {
  return new TextDecoder().decode(b);
}

describe("X3DH", () => {
  test("Alice and Bob derive the same shared secret (with OPK)", () => {
    const alice = makeIdentity();
    const bob = makeIdentity();

    const { bundle, spkPriv, opkPrivs } = generatePrekeyBundle(
      bob.noisePriv,
      bob.signingPriv,
      5,
    );

    const { result: aliceResult, initMsg } = x3dhInitiate(
      alice.noisePriv,
      bob.signingPub,
      bundle,
    );

    const opkPriv = initMsg.opkIndex >= 0 ? opkPrivs[initMsg.opkIndex] : null;
    const bobResult = x3dhReceive(bob.noisePriv, spkPriv, opkPriv, initMsg);

    expect(bytesToHex(aliceResult.sk)).toBe(bytesToHex(bobResult.sk));
  });

  test("shared secret derived without OPK (empty opkPubs)", () => {
    const alice = makeIdentity();
    const bob = makeIdentity();

    const { bundle, spkPriv } = generatePrekeyBundle(
      bob.noisePriv,
      bob.signingPriv,
      0, // no one-time prekeys
    );

    const { result: aliceResult, initMsg } = x3dhInitiate(
      alice.noisePriv,
      bob.signingPub,
      bundle,
    );

    const bobResult = x3dhReceive(bob.noisePriv, spkPriv, null, initMsg);
    expect(bytesToHex(aliceResult.sk)).toBe(bytesToHex(bobResult.sk));
  });

  test("tampered SPK signature causes initiate to throw", () => {
    const alice = makeIdentity();
    const bob = makeIdentity();
    const { bundle } = generatePrekeyBundle(bob.noisePriv, bob.signingPriv, 2);

    // Corrupt one byte of the SPK signature.
    const bad = { ...bundle, spkSig: bundle.spkSig.slice() };
    bad.spkSig[0] ^= 0xff;

    expect(() => x3dhInitiate(alice.noisePriv, bob.signingPub, bad)).toThrow(
      /SPK signature/,
    );
  });

  test("different initiators produce different shared secrets", () => {
    const alice1 = makeIdentity();
    const alice2 = makeIdentity();
    const bob = makeIdentity();

    const { bundle } = generatePrekeyBundle(bob.noisePriv, bob.signingPriv, 2);

    const { result: r1 } = x3dhInitiate(
      alice1.noisePriv,
      bob.signingPub,
      bundle,
    );
    // Use second OPK for second initiator so bundle state doesn't collide.
    const bundle2 = { ...bundle, opkPubs: bundle.opkPubs.slice(1) };
    const { result: r2 } = x3dhInitiate(
      alice2.noisePriv,
      bob.signingPub,
      bundle2,
    );

    expect(bytesToHex(r1.sk)).not.toBe(bytesToHex(r2.sk));
  });

  test("X3DH → DR integration: full offline session round-trip", () => {
    const alice = makeIdentity();
    const bob = makeIdentity();

    // Bob publishes bundle; Alice picks it up and initiates.
    const { bundle, spkPriv, opkPrivs } = generatePrekeyBundle(
      bob.noisePriv,
      bob.signingPriv,
      1,
    );

    const { result: aliceSk, initMsg } = x3dhInitiate(
      alice.noisePriv,
      bob.signingPub,
      bundle,
    );

    const opkPriv = initMsg.opkIndex >= 0 ? opkPrivs[initMsg.opkIndex] : null;
    const bobSk = x3dhReceive(bob.noisePriv, spkPriv, opkPriv, initMsg);

    // Shared secret must match.
    expect(bytesToHex(aliceSk.sk)).toBe(bytesToHex(bobSk.sk));

    // Use the SK to bootstrap a Double Ratchet session.
    const aliceRatchet = initSender(aliceSk.sk, bundle.spkPub);
    const bobRatchet = initReceiver(bobSk.sk, spkPriv);

    const ct = ratchetEncrypt(aliceRatchet, encode("offline message"));
    const pt = ratchetDecrypt(bobRatchet, ct);
    expect(decode(pt)).toBe("offline message");
  });

  test("bundle serialization round-trip", () => {
    const bob = makeIdentity();
    const { bundle } = generatePrekeyBundle(bob.noisePriv, bob.signingPriv, 3);

    const json = serializeBundle(bundle);
    const parsed = deserializeBundle(json);

    expect(bytesToHex(parsed.ikPub)).toBe(bytesToHex(bundle.ikPub));
    expect(bytesToHex(parsed.spkPub)).toBe(bytesToHex(bundle.spkPub));
    expect(bytesToHex(parsed.spkSig)).toBe(bytesToHex(bundle.spkSig));
    expect(parsed.opkPubs).toHaveLength(bundle.opkPubs.length);
    for (let i = 0; i < bundle.opkPubs.length; i++) {
      expect(bytesToHex(parsed.opkPubs[i])).toBe(bytesToHex(bundle.opkPubs[i]));
    }
  });

  test("generateX25519KeyPair produces a valid pair", () => {
    const kp = generateX25519KeyPair();
    expect(kp.priv).toHaveLength(32);
    expect(kp.pub).toHaveLength(32);
    expect(bytesToHex(x25519.getPublicKey(kp.priv))).toBe(bytesToHex(kp.pub));
  });
});
