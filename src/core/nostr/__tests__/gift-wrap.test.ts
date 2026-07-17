/**
 * @jest-environment node
 */
// NIP-17/59 gift-wrap round-trip tests.
// No network — pure crypto using @noble and nostr-tools.

import { ed25519 } from "@noble/curves/ed25519.js";
import { generateSecretKey, getPublicKey } from "nostr-tools";
import { deriveNostrPrivKey, unwrapDm, wrapDm } from "../gift-wrap";

// ---- Helpers ----------------------------------------------------------------

function makePair(): { priv: Uint8Array; pub: string } {
  const priv = generateSecretKey();
  const pub = getPublicKey(priv);
  return { priv, pub };
}

// ---- wrapDm / unwrapDm round-trip -------------------------------------------

describe("wrapDm / unwrapDm", () => {
  it("round-trips plaintext content", () => {
    const sender = makePair();
    const recipient = makePair();

    const result = wrapDm("hello mesh", sender.priv, recipient.pub);
    const dm = unwrapDm(result.event, recipient.priv);

    expect(dm.content).toBe("hello mesh");
    expect(dm.senderPubkey).toBe(sender.pub);
  });

  it("round-trips multiline content with emoji", () => {
    const sender = makePair();
    const recipient = makePair();
    const text = "line one\nline two\n✓ done 🎉";

    const { event } = wrapDm(text, sender.priv, recipient.pub);
    const dm = unwrapDm(event, recipient.priv);

    expect(dm.content).toBe(text);
  });

  it("sets senderPubkey to the real sender (not the ephemeral wrapper)", () => {
    const sender = makePair();
    const recipient = makePair();

    const { event, wrapperPubkey } = wrapDm("test", sender.priv, recipient.pub);
    const dm = unwrapDm(event, recipient.priv);

    expect(dm.senderPubkey).toBe(sender.pub);
    expect(dm.senderPubkey).not.toBe(wrapperPubkey);
  });

  it("sets a timestamp within 2 days of now", () => {
    const sender = makePair();
    const recipient = makePair();
    const now = Math.floor(Date.now() / 1000);
    const jitter = 2 * 24 * 60 * 60;

    const { event } = wrapDm("timing test", sender.priv, recipient.pub);

    expect(event.created_at).toBeGreaterThanOrEqual(now - jitter);
    expect(event.created_at).toBeLessThanOrEqual(now + jitter);
  });

  it("produces a kind 1059 gift-wrap event", () => {
    const sender = makePair();
    const recipient = makePair();

    const { event } = wrapDm("kind check", sender.priv, recipient.pub);

    expect(event.kind).toBe(1059);
  });

  it("returns a signed event with a non-empty signature", () => {
    const sender = makePair();
    const recipient = makePair();

    const { event } = wrapDm("sig check", sender.priv, recipient.pub);

    expect(typeof event.sig).toBe("string");
    expect(event.sig.length).toBe(128); // 64-byte hex
  });

  it("two wraps of the same message produce different events (ephemeral key)", () => {
    const sender = makePair();
    const recipient = makePair();

    const { event: e1 } = wrapDm("same text", sender.priv, recipient.pub);
    const { event: e2 } = wrapDm("same text", sender.priv, recipient.pub);

    // Ephemeral key is fresh each time so the outer pubkey and sig differ.
    expect(e1.pubkey).not.toBe(e2.pubkey);
    expect(e1.id).not.toBe(e2.id);
  });
});

// ---- Error cases ------------------------------------------------------------

describe("unwrapDm error cases", () => {
  it("throws when the gift wrap is opened with the wrong recipient key", () => {
    const sender = makePair();
    const recipient = makePair();
    const wrongKey = makePair();

    const { event } = wrapDm("secret", sender.priv, recipient.pub);

    expect(() => unwrapDm(event, wrongKey.priv)).toThrow();
  });

  it("throws when gift-wrap content is tampered", () => {
    const sender = makePair();
    const recipient = makePair();

    const { event } = wrapDm("tamper me", sender.priv, recipient.pub);
    const tampered = { ...event, content: event.content.slice(0, -4) + "xxxx" };

    expect(() => unwrapDm(tampered, recipient.priv)).toThrow();
  });

  it("throws when misdirected wrap is opened by a third party", () => {
    const sender = makePair();
    const realRecipient = makePair();
    const eavesDropper = makePair();

    const { event } = wrapDm("private", sender.priv, realRecipient.pub);

    // Third party cannot unwrap (wrong private key for decryption).
    expect(() => unwrapDm(event, eavesDropper.priv)).toThrow();
  });
});

// ---- deriveNostrPrivKey -----------------------------------------------------

describe("deriveNostrPrivKey", () => {
  it("produces a 32-byte key", () => {
    const edPriv = ed25519.utils.randomSecretKey();
    const nostrPriv = deriveNostrPrivKey(edPriv);

    expect(nostrPriv).toBeInstanceOf(Uint8Array);
    expect(nostrPriv.length).toBe(32);
  });

  it("is deterministic for the same input", () => {
    const edPriv = ed25519.utils.randomSecretKey();

    const k1 = deriveNostrPrivKey(edPriv);
    const k2 = deriveNostrPrivKey(edPriv);

    expect(k1).toEqual(k2);
  });

  it("produces different keys for different inputs", () => {
    const k1 = deriveNostrPrivKey(ed25519.utils.randomSecretKey());
    const k2 = deriveNostrPrivKey(ed25519.utils.randomSecretKey());

    expect(k1).not.toEqual(k2);
  });

  it("derived key is usable as a Nostr signing key", () => {
    const edPriv = ed25519.utils.randomSecretKey();
    const nostrPriv = deriveNostrPrivKey(edPriv);

    // If the derived key is valid, getPublicKey will not throw.
    const pub = getPublicKey(nostrPriv);
    expect(pub).toHaveLength(64); // hex pubkey
  });
});
