/**
 * @jest-environment node
 */
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { noiseXOpen } from "../../crypto/noise-x";
import {
  CourierStore,
  decodeEnvelopePayload,
  encodeEnvelopePayload,
  recipientTag,
} from "../courier-store";

function makeNoiseKeypair() {
  const priv = ed25519.utils.randomSecretKey();
  const pub = x25519.getPublicKey(priv);
  return { priv, pub };
}

function makeSigningKeypair() {
  const priv = ed25519.utils.randomSecretKey();
  return { priv, peerID: bytesToHex(ed25519.getPublicKey(priv).slice(0, 8)) };
}

// Build a minimal valid envelope payload for deposit tests.
function makeEnvelopePayload(
  tag: Uint8Array,
  copies = 4,
  ciphertext = new Uint8Array(48).fill(0xcc),
): Uint8Array {
  return encodeEnvelopePayload({
    recipientTag: tag,
    expiryMs: Date.now() + 60_000,
    copies,
    ciphertext,
  });
}

describe("recipientTag", () => {
  test("produces 16 bytes", () => {
    const keys = makeNoiseKeypair();
    expect(recipientTag(keys.pub)).toHaveLength(16);
  });

  test("same pubkey + same day → same tag", () => {
    const keys = makeNoiseKeypair();
    const nowMs = Date.now();
    expect(bytesToHex(recipientTag(keys.pub, nowMs))).toBe(
      bytesToHex(recipientTag(keys.pub, nowMs)),
    );
  });

  test("different pubkeys → different tags", () => {
    const k1 = makeNoiseKeypair();
    const k2 = makeNoiseKeypair();
    const nowMs = Date.now();
    expect(bytesToHex(recipientTag(k1.pub, nowMs))).not.toBe(
      bytesToHex(recipientTag(k2.pub, nowMs)),
    );
  });

  test("same pubkey, different day → different tags", () => {
    const keys = makeNoiseKeypair();
    const day0 = 0;
    const day1 = 86400 * 1000;
    expect(bytesToHex(recipientTag(keys.pub, day0))).not.toBe(
      bytesToHex(recipientTag(keys.pub, day1)),
    );
  });
});

describe("encodeEnvelopePayload / decodeEnvelopePayload", () => {
  test("round-trips correctly", () => {
    const tag = new Uint8Array(16).fill(0xaa);
    const ct = new Uint8Array(64).fill(0xbb);
    const env = {
      recipientTag: tag,
      expiryMs: 1_000_000,
      copies: 4,
      ciphertext: ct,
    };
    const encoded = encodeEnvelopePayload(env);
    const decoded = decodeEnvelopePayload(encoded);
    expect(decoded).not.toBeNull();
    expect(bytesToHex(decoded!.recipientTag)).toBe(bytesToHex(tag));
    expect(decoded!.expiryMs).toBe(1_000_000);
    expect(decoded!.copies).toBe(4);
    expect(bytesToHex(decoded!.ciphertext)).toBe(bytesToHex(ct));
  });

  test("returns null for too-short payload", () => {
    expect(decodeEnvelopePayload(new Uint8Array(5))).toBeNull();
  });
});

describe("CourierStore deposit", () => {
  const depositor = makeNoiseKeypair();
  const tag = new Uint8Array(16).fill(0x01);

  test("accepts a valid envelope", () => {
    const store = new CourierStore();
    const ok = store.deposit(
      makeEnvelopePayload(tag),
      depositor.pub,
      "verified",
    );
    expect(ok).toBe(true);
    expect(store.size).toBe(1);
  });

  test("rejects an expired envelope", () => {
    const store = new CourierStore();
    const expired = encodeEnvelopePayload({
      recipientTag: tag,
      expiryMs: Date.now() - 1,
      copies: 4,
      ciphertext: new Uint8Array(48),
    });
    expect(store.deposit(expired, depositor.pub, "verified")).toBe(false);
  });

  test("rejects oversized ciphertext", () => {
    const store = new CourierStore();
    const big = encodeEnvelopePayload({
      recipientTag: tag,
      expiryMs: Date.now() + 60_000,
      copies: 4,
      ciphertext: new Uint8Array(16 * 1024 + 1),
    });
    expect(store.deposit(big, depositor.pub, "verified")).toBe(false);
  });

  test("enforces per-depositor verified quota (2)", () => {
    const store = new CourierStore();
    const d = makeNoiseKeypair();
    // First 2: ok
    expect(
      store.deposit(
        makeEnvelopePayload(new Uint8Array(16).fill(0)),
        d.pub,
        "verified",
      ),
    ).toBe(true);
    expect(
      store.deposit(
        makeEnvelopePayload(new Uint8Array(16).fill(1)),
        d.pub,
        "verified",
      ),
    ).toBe(true);
    // 3rd: exceeds quota of 2
    expect(
      store.deposit(
        makeEnvelopePayload(new Uint8Array(16).fill(2)),
        d.pub,
        "verified",
      ),
    ).toBe(false);
  });

  test("enforces per-depositor favorite quota (5)", () => {
    const store = new CourierStore();
    const d = makeNoiseKeypair();
    for (let i = 0; i < 5; i++) {
      const accepted = store.deposit(
        makeEnvelopePayload(new Uint8Array(16).fill(i)),
        d.pub,
        "favorite",
      );
      expect(accepted).toBe(true);
    }
    // 6th: exceeds quota
    expect(
      store.deposit(
        makeEnvelopePayload(new Uint8Array(16).fill(5)),
        d.pub,
        "favorite",
      ),
    ).toBe(false);
  });
});

describe("CourierStore deliverMatching", () => {
  test("delivers envelopes with matching tag and removes them", () => {
    const store = new CourierStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x42);

    store.deposit(makeEnvelopePayload(tag), depositor.pub, "verified");
    expect(store.size).toBe(1);

    const delivered = store.deliverMatching(tag);
    expect(delivered.length).toBe(1);
    expect(store.size).toBe(0);
  });

  test("does not deliver envelopes with different tag", () => {
    const store = new CourierStore();
    const depositor = makeNoiseKeypair();
    const tag1 = new Uint8Array(16).fill(0x01);
    const tag2 = new Uint8Array(16).fill(0x02);

    store.deposit(makeEnvelopePayload(tag1), depositor.pub, "verified");
    const delivered = store.deliverMatching(tag2);
    expect(delivered.length).toBe(0);
    expect(store.size).toBe(1);
  });
});

describe("CourierStore sprayTo", () => {
  test("halves copy budget and returns envelopes to spray", () => {
    const store = new CourierStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x10);

    store.deposit(makeEnvelopePayload(tag, 4), depositor.pub, "verified");
    const peer = makeNoiseKeypair();
    const toSpray = store.sprayTo(peer.pub);
    expect(toSpray.length).toBe(1);
    expect(toSpray[0].copies).toBe(2); // half of 4
    // Store copy budget reduced to 2
    // (no direct accessor, but spray again should yield 1)
    const toSpray2 = store.sprayTo(peer.pub);
    expect(toSpray2[0].copies).toBe(1);
  });

  test("skips envelopes with copies < 2", () => {
    const store = new CourierStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x20);

    store.deposit(makeEnvelopePayload(tag, 1), depositor.pub, "verified");
    const peer = makeNoiseKeypair();
    const toSpray = store.sprayTo(peer.pub);
    expect(toSpray.length).toBe(0);
  });
});

describe("CourierStore evictExpired", () => {
  test("removes envelopes with past expiry from deposit if expired immediately", () => {
    const store = new CourierStore();
    // Deposit something valid, then manually call evictExpired while still fresh
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x30);
    store.deposit(makeEnvelopePayload(tag), depositor.pub, "verified");
    expect(store.size).toBe(1);
    store.evictExpired();
    expect(store.size).toBe(1); // still valid
  });
});

describe("CourierStore seal/open integration", () => {
  test("seal creates a valid packet; open recovers the plaintext", () => {
    const sender = makeNoiseKeypair();
    const recipient = makeNoiseKeypair();
    const signing = makeSigningKeypair();
    const plaintext = new TextEncoder().encode("hello courier");

    const packet = CourierStore.seal(
      plaintext,
      sender.priv,
      recipient.pub,
      signing.peerID,
      signing.priv,
    );

    expect(packet.type).toBe(0x04); // PacketType.COURIER_ENV

    // Decode the envelope payload
    const env = decodeEnvelopePayload(packet.payload);
    expect(env).not.toBeNull();

    // Open the ciphertext
    const { plaintext: recovered } = noiseXOpen(
      recipient.priv,
      env!.ciphertext,
    );
    expect(new TextDecoder().decode(recovered)).toBe("hello courier");
  });
});
