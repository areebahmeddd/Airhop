/**
 * @jest-environment node
 */
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { noiseXOpen, noiseXSeal } from "../noise-x";

function makeKeypair() {
  const priv = ed25519.utils.randomSecretKey();
  const pub = x25519.getPublicKey(priv);
  return { priv, pub };
}

describe("Noise X seal/open", () => {
  test("round-trip: open recovers plaintext and sender pubkey", () => {
    const sender = makeKeypair();
    const recipient = makeKeypair();
    const plaintext = new TextEncoder().encode("courier message");

    const envelope = noiseXSeal(sender.priv, recipient.pub, plaintext);
    const { plaintext: recovered, senderStaticPubKey } = noiseXOpen(
      recipient.priv,
      envelope,
    );

    expect(new TextDecoder().decode(recovered)).toBe("courier message");
    expect(bytesToHex(senderStaticPubKey)).toBe(
      bytesToHex(x25519.getPublicKey(sender.priv)),
    );
  });

  test("envelope has expected minimum length (32 e + 48 enc_s + payload + 16)", () => {
    const sender = makeKeypair();
    const recipient = makeKeypair();
    const plaintext = new Uint8Array(10);

    const envelope = noiseXSeal(sender.priv, recipient.pub, plaintext);
    // 32 (e_pub) + 48 (enc_static + tag) + 10 (payload) + 16 (payload tag)
    expect(envelope.length).toBe(32 + 48 + 10 + 16);
  });

  test("tampered envelope bytes cause open to throw", () => {
    const sender = makeKeypair();
    const recipient = makeKeypair();
    const envelope = noiseXSeal(
      sender.priv,
      recipient.pub,
      new TextEncoder().encode("secret"),
    );
    const tampered = new Uint8Array(envelope);
    tampered[envelope.length - 1] ^= 0xff;
    expect(() => noiseXOpen(recipient.priv, tampered)).toThrow();
  });

  test("wrong recipient key causes open to throw", () => {
    const sender = makeKeypair();
    const recipient = makeKeypair();
    const wrong = makeKeypair();
    const envelope = noiseXSeal(sender.priv, recipient.pub, new Uint8Array(8));
    expect(() => noiseXOpen(wrong.priv, envelope)).toThrow();
  });

  test("empty plaintext round-trip", () => {
    const sender = makeKeypair();
    const recipient = makeKeypair();
    const envelope = noiseXSeal(sender.priv, recipient.pub, new Uint8Array(0));
    const { plaintext } = noiseXOpen(recipient.priv, envelope);
    expect(plaintext.length).toBe(0);
  });

  test("different senders produce different envelopes (ephemeral key randomness)", () => {
    const sender = makeKeypair();
    const recipient = makeKeypair();
    const pt = new TextEncoder().encode("same");
    const e1 = noiseXSeal(sender.priv, recipient.pub, pt);
    const e2 = noiseXSeal(sender.priv, recipient.pub, pt);
    // Envelopes differ due to random ephemeral key
    expect(bytesToHex(e1)).not.toBe(bytesToHex(e2));
  });
});
