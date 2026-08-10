/**
 * @jest-environment node
 */
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { noiseXOpen } from "../../crypto/noise-x";
import {
  computeRecipientTag,
  CourierStore,
  decodeEnvelopePayload,
  encodeEnvelopePayload,
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
    expect(computeRecipientTag(keys.pub)).toHaveLength(16);
  });

  test("same pubkey + same day → same tag", () => {
    const keys = makeNoiseKeypair();
    const nowMs = Date.now();
    expect(bytesToHex(computeRecipientTag(keys.pub, nowMs))).toBe(
      bytesToHex(computeRecipientTag(keys.pub, nowMs)),
    );
  });

  test("different pubkeys → different tags", () => {
    const k1 = makeNoiseKeypair();
    const k2 = makeNoiseKeypair();
    const nowMs = Date.now();
    expect(bytesToHex(computeRecipientTag(k1.pub, nowMs))).not.toBe(
      bytesToHex(computeRecipientTag(k2.pub, nowMs)),
    );
  });

  test("same pubkey, different day → different tags", () => {
    const keys = makeNoiseKeypair();
    const day0 = 0;
    const day1 = 86400 * 1000;
    expect(bytesToHex(computeRecipientTag(keys.pub, day0))).not.toBe(
      bytesToHex(computeRecipientTag(keys.pub, day1)),
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

  test("rejects an expiry past the policy lifetime", () => {
    const store = new CourierStore();
    // A depositor that sets its own retention would hold a pool slot for as
    // long as it liked. bitchat rejects the same envelope, so accepting it
    // would also mean carrying mail no other client would.
    const tooLong = encodeEnvelopePayload({
      recipientTag: tag,
      expiryMs: Date.now() + 8 * 24 * 60 * 60 * 1000,
      copies: 4,
      ciphertext: new Uint8Array(48),
    });
    expect(store.deposit(tooLong, depositor.pub, "verified")).toBe(false);
  });

  test("allows an expiry inside the slack window", () => {
    const store = new CourierStore();
    // 24h plus a few minutes: a depositor whose clock runs fast, not an abuse.
    const skewed = encodeEnvelopePayload({
      recipientTag: tag,
      expiryMs: Date.now() + 24 * 60 * 60 * 1000 + 5 * 60 * 1000,
      copies: 4,
      ciphertext: new Uint8Array(48),
    });
    expect(store.deposit(skewed, depositor.pub, "verified")).toBe(true);
  });

  test("caps verified-tier mail at 20 so favorites keep room", () => {
    const store = new CourierStore();
    // Two per depositor, so ten distinct strangers reach the sub-cap.
    for (let d = 0; d < 10; d++) {
      const stranger = makeNoiseKeypair();
      for (let i = 0; i < 2; i++) {
        const accepted = store.deposit(
          makeEnvelopePayload(new Uint8Array(16).fill(d * 2 + i)),
          stranger.pub,
          "verified",
        );
        expect(accepted).toBe(true);
      }
    }
    expect(store.size).toBe(20);
    // An eleventh stranger is refused even though the pool holds 40.
    const extra = makeNoiseKeypair();
    expect(
      store.deposit(
        makeEnvelopePayload(new Uint8Array(16).fill(99)),
        extra.pub,
        "verified",
      ),
    ).toBe(false);
    // Favorites still get in: the remaining 20 slots were never theirs to take.
    const friend = makeNoiseKeypair();
    expect(
      store.deposit(
        makeEnvelopePayload(new Uint8Array(16).fill(100)),
        friend.pub,
        "favorite",
      ),
    ).toBe(true);
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
    const first = makeNoiseKeypair();
    const toSpray = store.sprayTo(first.pub);
    expect(toSpray.length).toBe(1);
    expect(toSpray[0].copies).toBe(2); // half of 4

    // A DIFFERENT courier, which is what halving is for. The budget is spent on
    // reaching new carriers, so the second one gets half of what is left.
    const second = makeNoiseKeypair();
    const toSpray2 = store.sprayTo(second.pub);
    expect(toSpray2[0].copies).toBe(1);
  });

  test("hands an envelope to each peer once, not once per announce", () => {
    // Spraying is driven by announces, which arrive continuously from the same
    // neighbours. Without a per-peer record the budget was spent re-handing the
    // same copy to someone who already held it, so an envelope decayed
    // 4 -> 2 -> 1 without ever reaching a second carrier - the opposite of what
    // spray-and-wait is for.
    const store = new CourierStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x11);
    store.deposit(makeEnvelopePayload(tag, 4), depositor.pub, "verified");

    const peer = makeNoiseKeypair();
    expect(store.sprayTo(peer.pub)).toHaveLength(1);
    expect(store.sprayTo(peer.pub)).toHaveLength(0);
    expect(store.sprayTo(peer.pub)).toHaveLength(0);

    // And the budget it did not spend is still there for somebody new.
    const stranger = makeNoiseKeypair();
    expect(store.sprayTo(stranger.pub)).toHaveLength(1);
  });

  test("clamps a hostile copy budget rather than amplifying it", () => {
    // `copies` is unauthenticated input that decides how many times a carrier
    // re-emits an envelope. bitchat clamps it in the envelope initialiser; an
    // unclamped byte would let one sender claim 255 and recruit every carrier
    // that picked it up into an amplifier.
    const store = new CourierStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x12);
    store.deposit(makeEnvelopePayload(tag, 255), depositor.pub, "verified");

    const peer = makeNoiseKeypair();
    const sprayed = store.sprayTo(peer.pub);
    expect(sprayed[0].copies).toBeLessThanOrEqual(4);
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
      "00112233445566aa",
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
