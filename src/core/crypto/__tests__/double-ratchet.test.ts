/**
 * @jest-environment node
 */
import { x25519 } from "@noble/curves/ed25519.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import {
  generateRatchetKeyPair,
  initReceiver,
  initSender,
  ratchetDecrypt,
  ratchetEncrypt,
  type RatchetState,
} from "../double-ratchet";

// A minimal shared root key (would normally come from X3DH).
function makeRootKey(): Uint8Array {
  const key = new Uint8Array(32);
  for (let i = 0; i < 32; i++) key[i] = i + 1;
  return key;
}

// Set up a matched Alice/Bob ratchet pair for testing.
// Bob holds the SPK; Alice initiates.
function makeAliceBob(): { alice: RatchetState; bob: RatchetState } {
  const rk = makeRootKey();
  const bobSpk = generateRatchetKeyPair();
  const alice = initSender(rk, bobSpk.pub);
  const bob = initReceiver(rk, bobSpk.priv);
  return { alice, bob };
}

function encode(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}
function decode(b: Uint8Array): string {
  return new TextDecoder().decode(b);
}

describe("Double Ratchet", () => {
  test("basic round-trip: Alice sends, Bob decrypts", () => {
    const { alice, bob } = makeAliceBob();

    const ct = ratchetEncrypt(alice, encode("hello"));
    const pt = ratchetDecrypt(bob, ct);
    expect(decode(pt)).toBe("hello");
  });

  test("multiple sequential messages Alice → Bob", () => {
    const { alice, bob } = makeAliceBob();
    const messages = ["msg0", "msg1", "msg2", "msg3", "msg4"];

    const ciphertexts = messages.map((m) => ratchetEncrypt(alice, encode(m)));
    for (let i = 0; i < messages.length; i++) {
      expect(decode(ratchetDecrypt(bob, ciphertexts[i]))).toBe(messages[i]);
    }
  });

  test("bidirectional exchange triggers DH ratchet steps", () => {
    const { alice, bob } = makeAliceBob();

    const ct1 = ratchetEncrypt(alice, encode("a→b"));
    expect(decode(ratchetDecrypt(bob, ct1))).toBe("a→b");

    const ct2 = ratchetEncrypt(bob, encode("b→a"));
    expect(decode(ratchetDecrypt(alice, ct2))).toBe("b→a");

    const ct3 = ratchetEncrypt(alice, encode("a→b again"));
    expect(decode(ratchetDecrypt(bob, ct3))).toBe("a→b again");
  });

  test("out-of-order delivery (skipped messages)", () => {
    const { alice, bob } = makeAliceBob();

    const ct0 = ratchetEncrypt(alice, encode("first"));
    const ct1 = ratchetEncrypt(alice, encode("second"));
    const ct2 = ratchetEncrypt(alice, encode("third"));

    // Deliver out of order: 2, 0, 1
    expect(decode(ratchetDecrypt(bob, ct2))).toBe("third");
    expect(decode(ratchetDecrypt(bob, ct0))).toBe("first");
    expect(decode(ratchetDecrypt(bob, ct1))).toBe("second");
  });

  test("ciphertexts are different for the same plaintext (counter increments)", () => {
    const { alice, bob } = makeAliceBob();
    const pt = encode("same");

    const ct1 = ratchetEncrypt(alice, pt);
    const ct2 = ratchetEncrypt(alice, pt);
    expect(bytesToHex(ct1)).not.toBe(bytesToHex(ct2));

    expect(decode(ratchetDecrypt(bob, ct1))).toBe("same");
    expect(decode(ratchetDecrypt(bob, ct2))).toBe("same");
  });

  test("tampered ciphertext throws on decrypt", () => {
    const { alice, bob } = makeAliceBob();
    const ct = ratchetEncrypt(alice, encode("secret"));
    const tampered = new Uint8Array(ct);
    tampered[ct.length - 1] ^= 0xff;
    expect(() => ratchetDecrypt(bob, tampered)).toThrow();
  });

  test("replayed ciphertext fails (skipped key already consumed)", () => {
    const { alice, bob } = makeAliceBob();
    const ct = ratchetEncrypt(alice, encode("replay me"));

    ratchetDecrypt(bob, ct); // first delivery — succeeds
    // The MK was deleted from MKSKIPPED on first use; replaying the same
    // header will not find a key and will fail with a chain error.
    expect(() => ratchetDecrypt(bob, ct)).toThrow();
  });

  test("forward secrecy: DH ratchet keys change after each round-trip", () => {
    const { alice, bob } = makeAliceBob();

    const aliceDhPub0 = bytesToHex(alice.DHs.pub);

    ratchetDecrypt(bob, ratchetEncrypt(alice, encode("ping")));
    ratchetDecrypt(alice, ratchetEncrypt(bob, encode("pong")));

    // After a round-trip, Alice's ratchet key pair has been rotated.
    expect(bytesToHex(alice.DHs.pub)).not.toBe(aliceDhPub0);
  });

  test("empty plaintext round-trip", () => {
    const { alice, bob } = makeAliceBob();
    const ct = ratchetEncrypt(alice, new Uint8Array(0));
    const pt = ratchetDecrypt(bob, ct);
    expect(pt.length).toBe(0);
  });

  test("large plaintext round-trip (64 KiB)", () => {
    const { alice, bob } = makeAliceBob();
    const big = new Uint8Array(65536);
    for (let i = 0; i < big.length; i++) big[i] = i & 0xff;

    const ct = ratchetEncrypt(alice, big);
    const pt = ratchetDecrypt(bob, ct);
    expect(pt).toEqual(big);
  });

  test("generateRatchetKeyPair produces valid X25519 pair", () => {
    const kp = generateRatchetKeyPair();
    expect(kp.priv).toHaveLength(32);
    expect(kp.pub).toHaveLength(32);
    // The public key must equal x25519(priv).
    expect(bytesToHex(x25519.getPublicKey(kp.priv))).toBe(bytesToHex(kp.pub));
  });
});
