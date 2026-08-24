/**
 * @jest-environment node
 */
// Recipient tags, which decide who a stored envelope is offered to.
//
// The tag has to be stable for a day so a courier can match it repeatedly, and
// unlinkable across days so the same recipient cannot be tracked over time.
// Those two pull against each other, and both are asserted here.
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { getStorage } from "@store/mmkv";
import { noiseXOpen, noiseXSeal } from "../../../crypto/noise-x";
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

// A private MMKV partition per store: the bag persists, so a shared one would
// make every case here depend on the order it ran in.
let storeCounter = 0;
function freshStore(): CourierStore {
  storeCounter += 1;
  return new CourierStore(`courier-test-${String(storeCounter)}`);
}

// Build a minimal valid envelope payload for deposit tests. The ciphertext is
// UNIQUE per call unless one is passed, matching real envelopes, where two
// seals never collide. Passing an explicit value is how a test says "this is
// deliberately the same envelope again".
let ciphertextCounter = 0;
function uniqueCiphertext(): Uint8Array {
  ciphertextCounter += 1;
  const ct = new Uint8Array(48).fill(0xcc);
  new DataView(ct.buffer).setUint32(0, ciphertextCounter, false);
  return ct;
}

function makeEnvelopePayload(
  tag: Uint8Array,
  copies = 4,
  ciphertext: Uint8Array = uniqueCiphertext(),
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

  test("same pubkey + same day -> same tag", () => {
    const keys = makeNoiseKeypair();
    const nowMs = Date.now();
    expect(bytesToHex(computeRecipientTag(keys.pub, nowMs))).toBe(
      bytesToHex(computeRecipientTag(keys.pub, nowMs)),
    );
  });

  test("different pubkeys -> different tags", () => {
    const k1 = makeNoiseKeypair();
    const k2 = makeNoiseKeypair();
    const nowMs = Date.now();
    expect(bytesToHex(computeRecipientTag(k1.pub, nowMs))).not.toBe(
      bytesToHex(computeRecipientTag(k2.pub, nowMs)),
    );
  });

  test("same pubkey, different day -> different tags", () => {
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
    const store = freshStore();
    const ok = store.deposit(
      makeEnvelopePayload(tag),
      depositor.pub,
      "verified",
    );
    expect(ok).toBe(true);
    expect(store.size).toBe(1);
  });

  test("rejects an expired envelope", () => {
    const store = freshStore();
    const expired = encodeEnvelopePayload({
      recipientTag: tag,
      expiryMs: Date.now() - 1,
      copies: 4,
      ciphertext: new Uint8Array(48),
    });
    expect(store.deposit(expired, depositor.pub, "verified")).toBe(false);
  });

  test("rejects an expiry past the policy lifetime", () => {
    const store = freshStore();
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
    const store = freshStore();
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
    const store = freshStore();
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
    const store = freshStore();
    const big = encodeEnvelopePayload({
      recipientTag: tag,
      expiryMs: Date.now() + 60_000,
      copies: 4,
      ciphertext: new Uint8Array(16 * 1024 + 1),
    });
    expect(store.deposit(big, depositor.pub, "verified")).toBe(false);
  });

  test("enforces per-depositor verified quota (2)", () => {
    const store = freshStore();
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
    const store = freshStore();
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

describe("CourierStore handover", () => {
  test("offers envelopes whose tag matches, and retires them only on commit", () => {
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x42);

    store.deposit(makeEnvelopePayload(tag), depositor.pub, "verified");
    expect(store.size).toBe(1);

    const offered = store.offerHandover([tag]);
    expect(offered).toHaveLength(1);
    // Still carried: nothing has confirmed it reached anybody.
    expect(store.size).toBe(1);

    expect(store.commitHandover(offered[0].ciphertext)).toBe(true);
    expect(store.size).toBe(0);
  });

  // A refused write - a full GATT queue at the busiest moment of a link-up -
  // must not destroy the only copy this device holds.
  test("keeps the envelope when the transport refuses it", () => {
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x43);
    store.deposit(makeEnvelopePayload(tag), depositor.pub, "verified");

    store.offerHandover([tag]); // ...and the write fails, so no commit
    expect(store.size).toBe(1);
    // Still offered on the next encounter.
    expect(store.offerHandover([tag])).toHaveLength(1);
  });

  test("a handed-over copy carries no spray budget", () => {
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x44);
    store.deposit(makeEnvelopePayload(tag, 4), depositor.pub, "verified");

    // It is going to its destination, not to another carrier.
    expect(store.offerHandover([tag])[0].copies).toBe(1);
  });

  test("hands over an envelope down to its last copy", () => {
    // Budget-independent on purpose: a carrier standing next to the recipient
    // holding a carry-only copy is exactly the case spray-and-wait ends with.
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x45);
    store.deposit(makeEnvelopePayload(tag, 1), depositor.pub, "verified");

    expect(store.offerHandover([tag])).toHaveLength(1);
  });

  test("does not offer envelopes with a different tag", () => {
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag1 = new Uint8Array(16).fill(0x01);
    const tag2 = new Uint8Array(16).fill(0x02);

    store.deposit(makeEnvelopePayload(tag1), depositor.pub, "verified");
    expect(store.offerHandover([tag2])).toHaveLength(0);
    expect(store.size).toBe(1);
  });

  test("a second commit for the same envelope is a no-op", () => {
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x46);
    store.deposit(makeEnvelopePayload(tag), depositor.pub, "verified");

    const offered = store.offerHandover([tag]);
    expect(store.commitHandover(offered[0].ciphertext)).toBe(true);
    expect(store.commitHandover(offered[0].ciphertext)).toBe(false);
  });
});

describe("CourierStore spray", () => {
  test("offers half the budget and spends it on commit", () => {
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x10);

    store.deposit(makeEnvelopePayload(tag, 4), depositor.pub, "verified");
    const first = makeNoiseKeypair();
    const offered = store.offerSpray(first.pub);
    expect(offered).toHaveLength(1);
    expect(offered[0].copies).toBe(2); // half of 4
    expect(store.commitSpray(first.pub, offered[0].ciphertext, 2)).toBe(true);

    // A DIFFERENT courier, which is what halving is for. The budget is spent on
    // reaching new carriers, so the second one gets half of what is left.
    const second = makeNoiseKeypair();
    const next = store.offerSpray(second.pub);
    expect(next[0].copies).toBe(1);
  });

  test("keeps the budget when the transport refuses the copy", () => {
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x13);
    store.deposit(makeEnvelopePayload(tag, 4), depositor.pub, "verified");

    const peer = makeNoiseKeypair();
    store.offerSpray(peer.pub); // ...write refused, no commit
    // The peer is still eligible and the branch has lost no reach.
    const retry = store.offerSpray(peer.pub);
    expect(retry).toHaveLength(1);
    expect(retry[0].copies).toBe(2);
  });

  test("hands an envelope to each peer once, not once per announce", () => {
    // Spraying is driven by announces, which arrive continuously from the same
    // neighbours. Without a per-peer record the budget was spent re-handing the
    // same copy to someone who already held it, so an envelope decayed
    // 4 -> 2 -> 1 without ever reaching a second carrier - the opposite of what
    // spray-and-wait is for.
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x11);
    store.deposit(makeEnvelopePayload(tag, 4), depositor.pub, "verified");

    const peer = makeNoiseKeypair();
    const offered = store.offerSpray(peer.pub);
    expect(offered).toHaveLength(1);
    store.commitSpray(peer.pub, offered[0].ciphertext, offered[0].copies);
    expect(store.offerSpray(peer.pub)).toHaveLength(0);
    expect(store.offerSpray(peer.pub)).toHaveLength(0);

    // And the budget it did not spend is still there for somebody new.
    const stranger = makeNoiseKeypair();
    expect(store.offerSpray(stranger.pub)).toHaveLength(1);
  });

  // Spraying back at whoever handed it over spends half a budget on a peer that
  // demonstrably has it, and when the depositor is the sender leaves them
  // carrying their own outgoing mail. bitchat excludes depositorNoiseKey too.
  test("never sprays an envelope back at the peer who deposited it", () => {
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x14);
    store.deposit(makeEnvelopePayload(tag, 4), depositor.pub, "verified");

    expect(store.offerSpray(depositor.pub)).toHaveLength(0);
    // Anybody else still gets it.
    expect(store.offerSpray(makeNoiseKeypair().pub)).toHaveLength(1);
  });

  test("clamps a hostile copy budget rather than amplifying it", () => {
    // `copies` is unauthenticated input that decides how many times a carrier
    // re-emits an envelope. bitchat clamps it in the envelope initialiser; an
    // unclamped byte would let one sender claim 255 and recruit every carrier
    // that picked it up into an amplifier.
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x12);
    store.deposit(makeEnvelopePayload(tag, 255), depositor.pub, "verified");

    const peer = makeNoiseKeypair();
    expect(store.offerSpray(peer.pub)[0].copies).toBeLessThanOrEqual(4);
  });

  test("skips envelopes with copies < 2", () => {
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x20);

    store.deposit(makeEnvelopePayload(tag, 1), depositor.pub, "verified");
    expect(store.offerSpray(makeNoiseKeypair().pub)).toHaveLength(0);
  });

  test("refuses a stale commit that would overspend the budget", () => {
    // The write is async, so two sprays can be in flight against one envelope.
    // A commit that claims more than is left must be refused rather than
    // driving the budget to zero.
    const store = freshStore();
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x15);
    store.deposit(makeEnvelopePayload(tag, 2), depositor.pub, "verified");

    const peer = makeNoiseKeypair();
    const offered = store.offerSpray(peer.pub);
    expect(store.commitSpray(peer.pub, offered[0].ciphertext, 2)).toBe(false);
    expect(store.commitSpray(peer.pub, offered[0].ciphertext, 1)).toBe(true);
  });
});

// Duplicates are guaranteed rather than exotic: a sender seals ONCE and hands
// the same bytes to every courier, so any two of them meeting already hold what
// the other offers.
describe("CourierStore duplicate envelopes", () => {
  test("collapses an identical ciphertext instead of taking a second slot", () => {
    const store = freshStore();
    const a = makeNoiseKeypair();
    const b = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x30);
    const shared = new Uint8Array(48).fill(0xab);

    expect(
      store.deposit(makeEnvelopePayload(tag, 4, shared), a.pub, "verified"),
    ).toBe(true);
    expect(
      store.deposit(makeEnvelopePayload(tag, 2, shared), b.pub, "verified"),
    ).toBe(true);
    expect(store.size).toBe(1);
  });

  test("raises the budget before any spray, so a carry-only copy arriving first does not cap it", () => {
    const store = freshStore();
    const a = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x31);
    const shared = new Uint8Array(48).fill(0xac);

    store.deposit(makeEnvelopePayload(tag, 1, shared), a.pub, "verified");
    store.deposit(makeEnvelopePayload(tag, 4, shared), a.pub, "verified");

    expect(store.offerSpray(makeNoiseKeypair().pub)[0].copies).toBe(2);
  });

  test("never replenishes a budget once the branch has sprayed", () => {
    // Otherwise replaying the depositor's packet resets the budget and
    // spray-and-wait never terminates. bitchat guards the same case.
    const store = freshStore();
    const a = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x32);
    const shared = new Uint8Array(48).fill(0xad);

    store.deposit(makeEnvelopePayload(tag, 4, shared), a.pub, "verified");
    const peer = makeNoiseKeypair();
    const offered = store.offerSpray(peer.pub);
    store.commitSpray(peer.pub, offered[0].ciphertext, offered[0].copies);

    // The original 4-copy packet arrives again.
    store.deposit(makeEnvelopePayload(tag, 4, shared), a.pub, "verified");

    expect(store.offerSpray(makeNoiseKeypair().pub)[0].copies).toBe(1);
  });

  test("a duplicate costs the depositor no quota", () => {
    // Same envelope, so charging would let a replay exhaust a depositor's
    // allowance against mail already carried.
    const store = freshStore();
    const d = makeNoiseKeypair();
    const shared = new Uint8Array(48).fill(0xae);
    const tag = new Uint8Array(16).fill(0x33);

    for (let i = 0; i < 5; i++) {
      expect(
        store.deposit(makeEnvelopePayload(tag, 4, shared), d.pub, "verified"),
      ).toBe(true);
    }
    expect(store.size).toBe(1);
    // The first (genuinely new) deposit spent one slot and the four replays
    // cost nothing, so one more distinct envelope fits under the verified quota
    // of 2 and the next is refused: the same answer as without the replays.
    expect(store.deposit(makeEnvelopePayload(tag), d.pub, "verified")).toBe(
      true,
    );
    expect(store.deposit(makeEnvelopePayload(tag), d.pub, "verified")).toBe(
      false,
    );
  });
});

// The mailbag has to outlive the process: carriage spans hours, a React Native
// process does not, and a kill must not empty the bag while the depositor's
// outbox still believes a courier holds it.
describe("CourierStore persistence", () => {
  test("carried mail survives a restart, with its budget and spray record", () => {
    const id = `courier-persist-${String(++storeCounter)}`;
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x50);
    const peer = makeNoiseKeypair();

    const first = new CourierStore(id);
    first.deposit(makeEnvelopePayload(tag, 4), depositor.pub, "favorite");
    const offered = first.offerSpray(peer.pub);
    first.commitSpray(peer.pub, offered[0].ciphertext, offered[0].copies);

    const reopened = new CourierStore(id);
    expect(reopened.size).toBe(1);
    // Budget spent before the restart stays spent...
    expect(reopened.offerSpray(makeNoiseKeypair().pub)[0].copies).toBe(1);
    // ...and so does the record of who already holds a copy.
    expect(reopened.offerSpray(peer.pub)).toHaveLength(0);
    // The depositor exclusion survives too, which needs its key on disk.
    expect(reopened.offerSpray(depositor.pub)).toHaveLength(0);
  });

  test("an envelope that expired while the app was closed does not come back", () => {
    const id = `courier-persist-${String(++storeCounter)}`;
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x51);

    const first = new CourierStore(id);
    first.deposit(
      encodeEnvelopePayload({
        recipientTag: tag,
        expiryMs: Date.now() + 40,
        copies: 4,
        ciphertext: uniqueCiphertext(),
      }),
      depositor.pub,
      "verified",
    );
    expect(first.size).toBe(1);

    jest.useFakeTimers().setSystemTime(Date.now() + 60_000);
    try {
      expect(new CourierStore(id).size).toBe(0);
    } finally {
      jest.useRealTimers();
    }
  });

  test("a corrupt partition costs the bag, not the launch", () => {
    const id = `courier-persist-${String(++storeCounter)}`;
    getStorage(id).set("envelopes", "{not json");
    expect(new CourierStore(id).size).toBe(0);
  });

  test("reset clears what is on disk, not just what is in memory", () => {
    const id = `courier-persist-${String(++storeCounter)}`;
    const store = new CourierStore(id);
    store.deposit(
      makeEnvelopePayload(new Uint8Array(16).fill(0x52)),
      makeNoiseKeypair().pub,
      "verified",
    );
    store.reset();

    expect(new CourierStore(id).size).toBe(0);
  });
});

describe("CourierStore evictExpired", () => {
  test("removes envelopes with past expiry from deposit if expired immediately", () => {
    const store = freshStore();
    // Deposit something valid, then manually call evictExpired while still fresh
    const depositor = makeNoiseKeypair();
    const tag = new Uint8Array(16).fill(0x30);
    store.deposit(makeEnvelopePayload(tag), depositor.pub, "verified");
    expect(store.size).toBe(1);
    store.evictExpired();
    expect(store.size).toBe(1); // still valid
  });
});

// The round trip built the way mesh-service builds it: seal once with Noise X,
// encode the envelope, open with the recipient's static key. Sealing per
// courier instead would produce a distinct ciphertext each time and defeat the
// duplicate merge above, so the shape here is the shape production must keep.
describe("envelope round trip", () => {
  test("a sealed envelope opens with the recipient static key", () => {
    const sender = makeNoiseKeypair();
    const recipient = makeNoiseKeypair();
    const plaintext = new TextEncoder().encode("hello courier");

    const payload = encodeEnvelopePayload({
      recipientTag: computeRecipientTag(recipient.pub),
      expiryMs: Date.now() + 60_000,
      copies: 4,
      ciphertext: noiseXSeal(sender.priv, recipient.pub, plaintext),
    });

    const env = decodeEnvelopePayload(payload);
    expect(env).not.toBeNull();

    const { plaintext: recovered, senderStaticPubKey } = noiseXOpen(
      recipient.priv,
      env!.ciphertext,
    );
    expect(new TextDecoder().decode(recovered)).toBe("hello courier");
    // The envelope authenticates its sender internally, which is what lets the
    // receive path attribute a message to a peer the packet header never named.
    expect([...senderStaticPubKey]).toEqual([...sender.pub]);
  });

  test("the routing tag is the recipient's, so a carrier can match it", () => {
    const recipient = makeNoiseKeypair();
    const payload = encodeEnvelopePayload({
      recipientTag: computeRecipientTag(recipient.pub),
      expiryMs: Date.now() + 60_000,
      copies: 4,
      ciphertext: uniqueCiphertext(),
    });
    const env = decodeEnvelopePayload(payload)!;
    expect(bytesToHex(env.recipientTag)).toBe(
      bytesToHex(computeRecipientTag(recipient.pub)),
    );
  });
});
