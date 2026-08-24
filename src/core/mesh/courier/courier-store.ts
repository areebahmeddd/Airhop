// Store-and-forward courier system.
//
// Compatible with bitchat iOS CourierStore.swift.
//
// When no transport can reach a recipient, a message is sealed (Noise X) into
// a courier envelope and handed to connected peers who may physically encounter
// the recipient later. Strict quotas prevent the device from being used as a
// public mailbag.
//
// This module owns the envelope and the bag it sits in: wire format, routing
// tag, trust tiers, pool bounds, spray budget. Sealing and packet building stay
// in mesh-service, which seals ONCE per message and addresses the same bytes to
// every courier. That is what lets `deposit` recognise the copies as one
// envelope, so nothing here may re-seal.
//
// Envelope wire format (COURIER_ENV packet payload):
//   [16 bytes: recipient tag]  HMAC-SHA256(recipientNoisePub, dayEpoch)[0:16]
//   [8  bytes: expiry]         Unix milliseconds as u64 BE
//   [1  byte:  copies]         Spray-and-wait budget
//   [rest:     ciphertext]     Noise X sealed payload

import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { getStorage } from "@store/mmkv";
import { base64ToBytes, bytesToBase64 } from "../../encoding/base64";

// Constants per PROTOCOLS.md section 6. Every value here matches bitchat's
// CourierStore.Limits and CourierEnvelope, because a carrier applies its own
// limits to envelopes it did not write: anything we exceed is simply dropped by
// the other side, and anything we fail to enforce is a slot someone else can
// take from us.
const POOL_SIZE = 40;
// Verified-tier mail can never crowd out favourites' share of the pool.
const VERIFIED_POOL_SIZE = 20;
// How long an envelope is worth carrying, matching CourierEnvelope
// .maxLifetimeSeconds. Exported because mesh-service stamps the envelopes it
// originates and the two must not drift.
export const ENVELOPE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
// Tolerance on a depositor's expiry, matching Limits.maxExpirySlack. Absorbs
// clock skew between two phones without letting anyone park mail indefinitely.
const EXPIRY_SLACK_MS = 60 * 60 * 1000; // 1 hour
const MAX_ENVELOPE_BYTES = 16 * 1024; // 16 KiB plaintext cap
const FAVORITE_QUOTA = 5;
const VERIFIED_QUOTA = 2;

// Spray-and-wait: initial copy budget per envelope, matching bitchat's
// TransportConfig.courierInitialCopies. Exported so the sender stamps the same
// number every carrier clamps against.
export const COURIER_INITIAL_COPIES = 4;

// Hard ceiling on a decoded spray budget, matching bitchat's
// CourierEnvelope.maxCopies. `copies` is unauthenticated input deciding how
// often a carrier re-emits, so an unclamped byte makes every carrier an
// amplifier for whoever claims 255.
const MAX_COPIES = 8;

// ---- Recipient tag ----

// Matches CourierEnvelope.recipientTag(noiseStaticKey:epochDay:) in BitFoundation.
// HMAC-SHA256(key=noiseStaticKey,
//             message="bitchat-courier-tag-v1" || epochDay_BE4)[0:16]
// epochDay = floor(unixSeconds / 86400) as u32 BE (rotates daily).
const TAG_CONTEXT = new TextEncoder().encode("bitchat-courier-tag-v1");

export function computeRecipientTag(
  recipientNoisePubKey: Uint8Array,
  nowMs: number = Date.now(),
): Uint8Array {
  const epochDay = Math.floor(nowMs / (86400 * 1000));
  // 4-byte BE u32 epoch day (matches Swift epochDay(for:) which returns UInt32)
  const dayBuf = new Uint8Array(4);
  new DataView(dayBuf.buffer).setUint32(0, epochDay >>> 0, false);
  const message = new Uint8Array(TAG_CONTEXT.length + 4);
  message.set(TAG_CONTEXT);
  message.set(dayBuf, TAG_CONTEXT.length);
  const mac = hmac(sha256, recipientNoisePubKey, message);
  return mac.slice(0, 16);
}

// ---- Envelope wire format ----
//
// TLV encoding matching bitchat iOS CourierEnvelope.encode() / .decode().
// Types:
//   0x01  recipientTag  (16 bytes)
//   0x02  expiry        (8 bytes, u64 BE, milliseconds)
//   0x03  ciphertext    (variable)
//   0x04  copies        (1 byte, omitted when copies == 1)
//
// All lengths are u16 BE.

const ENV_TLV_TAG = 0x01;
const ENV_TLV_EXPIRY = 0x02;
const ENV_TLV_CIPHERTEXT = 0x03;
const ENV_TLV_COPIES = 0x04;
// v2 (forward-secret) envelopes: the ciphertext is Noise X to the recipient's
// one-time prekey with this ID rather than their static key. Omitted for v1 so
// v1 decoders skip it as unknown and still carry v2 envelopes opaquely.
const ENV_TLV_PREKEY_ID = 0x05;
const TAG_LENGTH = 16;

// Not constant-time: every caller compares public routing material (recipient
// tag, ciphertext, announced Noise public key), never a secret.
function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function appendTlv(type: number, value: Uint8Array, into: number[]): void {
  into.push(type);
  into.push((value.length >> 8) & 0xff);
  into.push(value.length & 0xff);
  for (const b of value) into.push(b);
}

export interface SealedEnvelope {
  recipientTag: Uint8Array; // 16 bytes
  expiryMs: number; // Unix ms
  copies: number; // spray budget
  ciphertext: Uint8Array; // Noise X output
  // Present on v2 envelopes: the recipient prekey id the ciphertext was sealed
  // to. Absent means v1 (sealed to the recipient's static key).
  prekeyID?: number;
}

export function encodeEnvelopePayload(env: SealedEnvelope): Uint8Array {
  const bytes: number[] = [];

  appendTlv(ENV_TLV_TAG, env.recipientTag.slice(0, TAG_LENGTH), bytes);

  const expiryBuf = new Uint8Array(8);
  new DataView(expiryBuf.buffer).setBigUint64(0, BigInt(env.expiryMs), false);
  appendTlv(ENV_TLV_EXPIRY, expiryBuf, bytes);

  appendTlv(ENV_TLV_CIPHERTEXT, env.ciphertext, bytes);

  // Omit copies TLV when == 1 (carry-only); matches bitchat iOS wire format
  if (env.copies > 1) {
    appendTlv(ENV_TLV_COPIES, new Uint8Array([env.copies & 0xff]), bytes);
  }

  // Omitted for v1 static-sealed envelopes so they stay byte-identical to the
  // pre-prekey wire format.
  if (env.prekeyID !== undefined) {
    const idBuf = new Uint8Array(4);
    new DataView(idBuf.buffer).setUint32(0, env.prekeyID >>> 0, false);
    appendTlv(ENV_TLV_PREKEY_ID, idBuf, bytes);
  }

  return new Uint8Array(bytes);
}

export function decodeEnvelopePayload(
  payload: Uint8Array,
): SealedEnvelope | null {
  let off = 0;
  let tag: Uint8Array | undefined;
  let expiryMs: number | undefined;
  let ciphertext: Uint8Array | undefined;
  let copies = 1;
  let prekeyID: number | undefined;

  while (off + 3 <= payload.length) {
    const type = payload[off];
    off++;
    const len = new DataView(
      payload.buffer,
      payload.byteOffset + off,
    ).getUint16(0, false);
    off += 2;
    if (off + len > payload.length) return null;
    const value = payload.slice(off, off + len);
    off += len;

    switch (type) {
      case ENV_TLV_TAG:
        if (len === TAG_LENGTH) tag = value;
        break;
      case ENV_TLV_EXPIRY:
        if (len === 8)
          expiryMs = Number(
            new DataView(value.buffer, value.byteOffset).getBigUint64(0, false),
          );
        break;
      case ENV_TLV_CIPHERTEXT:
        if (len > 0 && len <= MAX_ENVELOPE_BYTES) ciphertext = value;
        break;
      case ENV_TLV_COPIES:
        // Clamped, exactly as bitchat clamps it in CourierEnvelope's
        // initialiser. An envelope is unauthenticated input, and `copies` is a
        // spray budget: accepting the raw byte let a hostile envelope claim 255
        // and turn every carrier that picked it up into an amplifier.
        if (len === 1) copies = Math.min(Math.max(value[0], 1), MAX_COPIES);
        break;
      case ENV_TLV_PREKEY_ID:
        if (len === 4)
          prekeyID = new DataView(value.buffer, value.byteOffset).getUint32(
            0,
            false,
          );
        break;
      // Unknown TLVs: skip for forward compatibility
    }
  }

  if (tag === undefined || expiryMs === undefined || ciphertext === undefined)
    return null;
  return { recipientTag: tag, expiryMs, copies, ciphertext, prekeyID };
}

// ---- Trust tiers ----

export type CourierTier = "favorite" | "verified";

interface StoredEnvelope {
  recipientTag: Uint8Array;
  expiryMs: number;
  ciphertext: Uint8Array;
  depositorNoisePub: Uint8Array; // 32-byte X25519 pub of who deposited this
  storedAt: number;
  tier: CourierTier;
  copies: number;
  prekeyID?: number;
  // Noise static keys (hex) this envelope has already been handed to, so a
  // repeat announce from the same neighbour cannot spend budget on a copy they
  // already hold. Per-entry, and it dies with the entry.
  sprayedTo: Set<string>;
}

// The on-disk shape. Separate from StoredEnvelope because JSON carries neither
// a Uint8Array nor a Set, and both round-trip to `{}` without erroring.
interface PersistedEnvelope {
  tag: string; // hex
  exp: number;
  ct: string; // base64
  dep: string; // hex
  at: number;
  tier: CourierTier;
  copies: number;
  pk?: number;
  to: string[]; // sprayedTo, hex
}

// ---- CourierStore ----

export class CourierStore {
  private envelopes: StoredEnvelope[] = [];
  private readonly storage;
  private readonly key = "envelopes";

  // Persisted, because carriage spans hours and a React Native process does
  // not: backgrounding, an OEM battery manager and a swipe away all end it, and
  // an in-memory bag loses every envelope this device promised to carry while
  // the depositor's outbox still believes a courier holds it. bitchat persists
  // for the same reason (CourierStore.persistLocked, quotas re-applied on load).
  //
  // MMKV rather than the keychain: an envelope is someone else's ciphertext,
  // sealed to a key this device does not hold. Wiped on panic all the same (see
  // MMKV_STORE_IDS), since holding a neighbour's mail is evidence about who was
  // standing near whom.
  constructor(mmkvId = "courier-store") {
    this.storage = getStorage(mmkvId);
    this.envelopes = this.load();
  }

  private load(): StoredEnvelope[] {
    const raw = this.storage.getString(this.key);
    if (raw === undefined) return [];
    let rows: PersistedEnvelope[];
    try {
      rows = JSON.parse(raw) as PersistedEnvelope[];
    } catch {
      return [];
    }
    if (!Array.isArray(rows)) return [];
    const now = Date.now();
    const restored: StoredEnvelope[] = [];
    for (const r of rows) {
      // Re-validated field by field: this is read after an upgrade, a crash
      // mid-write or a restored partition, and a malformed row must cost one
      // envelope rather than the whole bag.
      try {
        if (typeof r.exp !== "number" || r.exp < now) continue;
        const tag = hexToBytes(r.tag);
        const ct = base64ToBytes(r.ct);
        const dep = hexToBytes(r.dep);
        if (tag.length !== TAG_LENGTH) continue;
        if (ct.length === 0 || ct.length > MAX_ENVELOPE_BYTES) continue;
        restored.push({
          recipientTag: tag,
          expiryMs: r.exp,
          ciphertext: ct,
          depositorNoisePub: dep,
          storedAt: typeof r.at === "number" ? r.at : now,
          tier: r.tier === "favorite" ? "favorite" : "verified",
          copies: Math.min(Math.max(r.copies | 0, 1), MAX_COPIES),
          prekeyID: typeof r.pk === "number" ? r.pk : undefined,
          sprayedTo: new Set(Array.isArray(r.to) ? r.to : []),
        });
      } catch {
        // Unparseable hex or base64 in one row.
      }
      // The pool cap is re-applied on load as well as on deposit: a ceiling
      // lowered in a later build must bind the mail already on disk.
      if (restored.length >= POOL_SIZE) break;
    }
    return restored;
  }

  private persist(): void {
    const rows: PersistedEnvelope[] = this.envelopes.map((e) => ({
      tag: bytesToHex(e.recipientTag),
      exp: e.expiryMs,
      ct: bytesToBase64(e.ciphertext),
      dep: bytesToHex(e.depositorNoisePub),
      at: e.storedAt,
      tier: e.tier,
      copies: e.copies,
      pk: e.prekeyID,
      to: [...e.sprayedTo],
    }));
    this.storage.set(this.key, JSON.stringify(rows));
  }

  // Deposit an incoming courier envelope. Returns true if accepted.
  deposit(
    payload: Uint8Array,
    depositorNoisePub: Uint8Array,
    tier: CourierTier,
  ): boolean {
    const env = decodeEnvelopePayload(payload);
    if (env === null) return false;
    const now = Date.now();
    if (env.expiryMs < now) return false; // already expired
    // Reject an expiry past the policy lifetime. Without this a depositor sets
    // its own retention: one envelope stamped years out would hold a pool slot
    // for as long as the app is installed. The slack absorbs clock skew between
    // two phones, nothing more.
    if (env.expiryMs > now + ENVELOPE_TTL_MS + EXPIRY_SLACK_MS) return false;
    if (env.ciphertext.length > MAX_ENVELOPE_BYTES) return false;

    this.evictExpired();

    // Identical ciphertext is the same envelope. Merging keeps spray-and-wait a
    // splitting scheme rather than a minting one, and duplicates are guaranteed
    // rather than exotic: a sender seals ONCE and hands the same bytes to every
    // courier, so any two of them meeting already hold what the other offers.
    // A second entry would carry its own budget and its own sprayedTo, letting
    // one message fill the bag and the mesh-wide copy count grow per encounter.
    //
    // The budget rises only while nothing has been sprayed yet, as bitchat does
    // it (CourierStore.deposit): before a spray a carry-only copy may arrive
    // ahead of the original and the larger is right; after one, replaying the
    // depositor's packet must never replenish what was spent, or the scheme
    // never terminates.
    const dupe = this.envelopes.find((e) =>
      sameBytes(e.ciphertext, env.ciphertext),
    );
    if (dupe !== undefined) {
      if (dupe.sprayedTo.size === 0 && env.copies > dupe.copies) {
        dupe.copies = env.copies;
        this.persist();
      }
      return true;
    }

    // Check per-depositor quota by tier.
    const quota = tier === "favorite" ? FAVORITE_QUOTA : VERIFIED_QUOTA;
    const depositorCount = this.envelopes.filter(
      (e) =>
        e.depositorNoisePub.every((b, i) => b === depositorNoisePub[i]) &&
        e.tier === tier,
    ).length;
    if (depositorCount >= quota) return false;

    // Verified-tier sub-cap. The per-depositor quota alone does not stop enough
    // distinct verified strangers filling the pool between them and leaving no
    // room for the people this device actually knows.
    if (
      tier === "verified" &&
      this.envelopes.filter((e) => e.tier === "verified").length >=
        VERIFIED_POOL_SIZE
    ) {
      return false;
    }

    // Check total pool cap.
    if (this.envelopes.length >= POOL_SIZE) {
      // Evict lowest-priority slot (verified-tier, then oldest).
      const idx = this.findEvictionCandidate(tier);
      if (idx < 0) return false; // pool full, all favorites
      this.envelopes.splice(idx, 1);
    }

    this.envelopes.push({
      recipientTag: env.recipientTag,
      expiryMs: env.expiryMs,
      ciphertext: env.ciphertext,
      depositorNoisePub: depositorNoisePub.slice(),
      storedAt: Date.now(),
      tier,
      copies: env.copies,
      prekeyID: env.prekeyID,
      sprayedTo: new Set(),
    });
    this.persist();
    return true;
  }

  // Envelopes addressed to a peer just met. NON-DESTRUCTIVE: the caller hands
  // each to the transport and calls `commitHandover` only once the write is
  // accepted onto that peer's own link. Retiring before then loses the mail to
  // a refused write, and refusals are ordinary here - this runs from
  // `onAnnounce`, when the link is busiest with the announce, the prekey bundle
  // and a gossip round, and a full GATT queue answers WRITE_BUSY. bitchat
  // splits handover the same way.
  //
  // The copy carries a budget of 1: it is going to its destination, not to
  // another carrier, so there is nothing left for it to spray.
  offerHandover(tags: Uint8Array[]): SealedEnvelope[] {
    this.evictExpired();
    const offered: SealedEnvelope[] = [];
    for (const e of this.envelopes) {
      if (!tags.some((t) => sameBytes(e.recipientTag, t))) continue;
      offered.push({
        recipientTag: e.recipientTag,
        expiryMs: e.expiryMs,
        copies: 1,
        ciphertext: e.ciphertext,
        prekeyID: e.prekeyID,
      });
    }
    return offered;
  }

  // Retire an envelope the transport confirmed. Re-finds the entry rather than
  // trusting an index, so a concurrent handover or expiry sweep makes this a
  // no-op instead of removing the wrong one.
  commitHandover(ciphertext: Uint8Array): boolean {
    const idx = this.envelopes.findIndex((e) =>
      sameBytes(e.ciphertext, ciphertext),
    );
    if (idx < 0) return false;
    this.envelopes.splice(idx, 1);
    this.persist();
    return true;
  }

  // Spray: when meeting another courier-eligible peer, offer half the copy
  // budget. NON-DESTRUCTIVE, like offerHandover; `commitSpray` spends the budget
  // once the write is accepted, so a refused one leaves this peer eligible to be
  // sprayed again on the next encounter.
  //
  // Three exclusions, and each is load-bearing:
  //
  //   copies < 2   nothing to halve; a carry-only copy is the end of its branch
  //   sprayedTo    once per peer, not once per announce. Announces arrive
  //                continuously, so without it a budget decays 4 -> 2 -> 1
  //                against one neighbour without ever reaching a new carrier.
  //                bitchat tracks the same set
  //   depositor    they handed us this envelope, so they demonstrably hold it.
  //                Spraying it back spends half a budget on a hop that delivers
  //                nothing, and leaves a SENDER carrying their own outgoing mail
  //                as third-party mail. bitchat excludes depositorNoiseKey too
  //
  // bitchat also excludes envelopes addressed TO this peer. Here that is
  // structural instead: the caller runs offerHandover first, so anything for
  // them has already been offered as a delivery rather than as a spray.
  offerSpray(peerNoisePub: Uint8Array): SealedEnvelope[] {
    this.evictExpired();
    const peerKey = bytesToHex(peerNoisePub);
    const toSpray: SealedEnvelope[] = [];

    for (const e of this.envelopes) {
      if (e.copies < 2) continue;
      if (e.sprayedTo.has(peerKey)) continue;
      if (sameBytes(e.depositorNoisePub, peerNoisePub)) continue;
      toSpray.push({
        recipientTag: e.recipientTag,
        expiryMs: e.expiryMs,
        copies: Math.floor(e.copies / 2),
        ciphertext: e.ciphertext,
        prekeyID: e.prekeyID,
      });
    }
    return toSpray;
  }

  // Spend the budget that left the device, and mark the peer so the next
  // encounter does not spend it again. Re-checks every precondition rather than
  // trusting the offer, since the write is async and a concurrent spray or
  // expiry sweep may have moved the entry: `copies > given` is what stops a
  // stale commit driving the budget to zero.
  commitSpray(
    peerNoisePub: Uint8Array,
    ciphertext: Uint8Array,
    given: number,
  ): boolean {
    const peerKey = bytesToHex(peerNoisePub);
    const e = this.envelopes.find((x) => sameBytes(x.ciphertext, ciphertext));
    if (e === undefined) return false;
    if (e.sprayedTo.has(peerKey)) return false;
    if (given < 1 || e.copies <= given) return false;
    e.copies -= given;
    e.sprayedTo.add(peerKey);
    this.persist();
    return true;
  }

  evictExpired(): void {
    const now = Date.now();
    let removed = false;
    for (let i = this.envelopes.length - 1; i >= 0; i--) {
      if (this.envelopes[i].expiryMs < now) {
        this.envelopes.splice(i, 1);
        removed = true;
      }
    }
    if (removed) this.persist();
  }

  get size(): number {
    return this.envelopes.length;
  }

  reset(): void {
    this.envelopes.length = 0;
    this.storage.remove(this.key);
  }

  // Returns index of best eviction candidate: prefer verified-tier, then oldest.
  // Which envelope to drop to make room for `incoming`, or -1 to refuse it.
  //
  // Verified mail is evicted before favourite mail, oldest first. The tier of
  // the INCOMING envelope matters too: a verified arrival may never displace a
  // favourite, because that would let anyone who has merely announced push a
  // contact's mail out of a full pool. bitchat states the same rule - evict a
  // favourite only when the incoming envelope is itself a favourite, otherwise
  // reject.
  //
  // Scoring tier and age together always returns an index for a non-empty pool,
  // which makes the "pool full, all favourites" refusal at the call site
  // unreachable and lets a verified envelope displace a favourite.
  private findEvictionCandidate(incoming: CourierTier): number {
    let bestIdx = -1;
    let bestAge = -1;

    // First choice: the oldest verified envelope, whatever the arrival is.
    for (let i = 0; i < this.envelopes.length; i++) {
      const e = this.envelopes[i];
      if (e.tier !== "verified") continue;
      const age = Date.now() - e.storedAt;
      if (age > bestAge) {
        bestAge = age;
        bestIdx = i;
      }
    }
    if (bestIdx !== -1) return bestIdx;

    // Nothing but favourites left. Only another favourite may take a slot.
    if (incoming !== "favorite") return -1;
    for (let i = 0; i < this.envelopes.length; i++) {
      const age = Date.now() - this.envelopes[i].storedAt;
      if (age > bestAge) {
        bestAge = age;
        bestIdx = i;
      }
    }
    return bestIdx;
  }
}
