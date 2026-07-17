/**
 * @jest-environment node
 */
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { NoiseHandshake } from "../noise-xx";

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
