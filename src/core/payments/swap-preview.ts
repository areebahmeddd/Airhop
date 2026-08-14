// A prepared Cashu swap, in a shape that survives a process kill.
//
// A swap is the one mint operation with no quote to ask about afterwards. The
// mint takes the inputs, signs the outputs, and answers once. Lose that answer
// to a dropped socket or an OS kill and the inputs are spent while the outputs
// exist nowhere: the blinding factors that would unblind them lived only in the
// memory that just went away. The money is gone silently, which is the worst
// shape a payment failure can take.
//
// cashu-ts splits the operation for exactly this reason. `prepareSwapToReceive`
// / `prepareSwapToSend` hand back a `SwapPreview`, and `completeSwap` builds its
// request purely from that preview, so a preview written to disk before the
// request goes out can be replayed afterwards. NUT-19 makes the replay safe: the
// mint caches successful responses by request, so an identical request returns
// the same signatures rather than "already spent". NUT-09 is the backstop when
// it does not, because the blinded messages are here too and the mint can be
// asked whether it ever signed them.
//
// Two things make a faithful round trip subtle, and both are why this is a
// module rather than two inline maps:
//
//   1. The replay must be BYTE-IDENTICAL, not merely equivalent. The mint keys
//      its NUT-19 cache on the request payload, and `JSON.stringify` preserves
//      key insertion order, so rebuilding an input as `{id, amount, secret, C}`
//      when cashu-ts built it as `{id, amount, C, secret}` produces a different
//      body and a cache miss. Inputs are therefore stored as an opaque JSON
//      round trip of what cashu-ts produced, never re-shaped field by field.
//   2. A P2PK witness is a BIP-340 signature over randomised auxiliary data, so
//      signing the same input twice yields two different witnesses. Inputs are
//      signed once, before they are stored, and the replay never re-signs.
//
// `amount` and `fees` are carried for the UI's benefit only. `completeSwap`
// never reads them, which is fortunate: they are `Amount` value objects and do
// not survive JSON.

import {
  Amount,
  normalizeProofAmounts,
  OutputData,
  type OutputDataLike,
  type ProofLike,
  type SerializedOutputData,
  type SwapPreview,
} from "@cashu/cashu-ts";

// Bumped if the stored shape ever changes meaning. A record written by an older
// build is discarded rather than half-read: a swap replayed from a
// misinterpreted preview would send a request the mint has never seen, which is
// a fresh spend rather than a recovery.
const SWAP_PREVIEW_VERSION = 1;

// Sanity ceiling on a stored preview. A swap is a handful of proofs and a
// handful of blinded messages; anything wildly larger is corruption, and
// rebuilding it would only waste a mint round trip.
const MAX_PREVIEW_ENTRIES = 512;

export interface StoredSwapPreview {
  v: number;
  keysetId: string;
  amount: number;
  fees: number;
  // Exactly what cashu-ts handed us, JSON round-tripped. Deliberately opaque:
  // field order is load-bearing (see the header).
  inputs: ProofLike[];
  keepOutputs: SerializedOutputData[];
  sendOutputs?: SerializedOutputData[];
}

// Flatten a prepared swap for storage. Call this BEFORE the request goes out,
// and after any P2PK signing, or the replay will not reproduce the same body.
export function serializeSwapPreview(preview: SwapPreview): StoredSwapPreview {
  return {
    v: SWAP_PREVIEW_VERSION,
    keysetId: preview.keysetId,
    amount: preview.amount.toNumber(),
    fees: preview.fees.toNumber(),
    // The round trip is the point: it turns every `Amount` into the number the
    // wire carries while leaving each object's key order untouched.
    inputs: JSON.parse(JSON.stringify(preview.inputs)) as ProofLike[],
    keepOutputs: (preview.keepOutputs ?? []).map((output) =>
      OutputData.serialize(output),
    ),
    ...(preview.sendOutputs !== undefined && preview.sendOutputs.length > 0
      ? {
          sendOutputs: preview.sendOutputs.map((output) =>
            OutputData.serialize(output),
          ),
        }
      : {}),
  };
}

// Rebuild a preview `completeSwap` will accept, or null when the record cannot
// be trusted. Null is not an error path to log and move on from: it means the
// value that swap was carrying has to be recovered some other way, so the caller
// must decide, not this module.
//
// `unselectedProofs` is deliberately not stored or rebuilt. cashu-ts only echoes
// it back through `completeSwap`, and those proofs never left our store, so
// replaying without it changes nothing about the request and keeps the record
// from carrying a second copy of coins we already hold.
export function rebuildSwapPreview(stored: unknown): SwapPreview | null {
  if (!isStoredSwapPreview(stored)) return null;
  try {
    const preview: SwapPreview = {
      amount: Amount.from(stored.amount),
      fees: Amount.from(stored.fees),
      keysetId: stored.keysetId,
      inputs: normalizeProofAmounts(stored.inputs),
      keepOutputs: stored.keepOutputs.map((output) =>
        OutputData.deserialize(output),
      ),
      ...(stored.sendOutputs !== undefined
        ? {
            sendOutputs: stored.sendOutputs.map((output) =>
              OutputData.deserialize(output),
            ),
          }
        : {}),
    };
    if (preview.inputs.length === 0) return null;
    if (
      (preview.keepOutputs?.length ?? 0) +
        (preview.sendOutputs?.length ?? 0) ===
      0
    ) {
      return null;
    }
    return preview;
  } catch {
    // `OutputData.deserialize` throws on a non-canonical blinding factor or a
    // malformed secret, and `Amount.from` on a value it cannot parse.
    return null;
  }
}

// Every blinded message the preview would have sent, in request order. This is
// what NUT-09 restore is asked about when a replay is refused: the mint answers
// from its own records whether it ever signed these, which recovers the outputs
// even from a mint with no NUT-19 cache and even when the secrets were random.
export function swapPreviewOutputs(preview: SwapPreview): OutputDataLike[] {
  return [...(preview.keepOutputs ?? []), ...(preview.sendOutputs ?? [])];
}

// How many of a preview's outputs are proofs we keep. The rest are locked or
// otherwise destined for somebody else, and a recovery has to tell them apart:
// crediting a P2PK-locked output to our own balance would show money only the
// recipient can spend.
export function swapPreviewKeepCount(preview: SwapPreview): number {
  return preview.keepOutputs?.length ?? 0;
}

function isStoredSwapPreview(value: unknown): value is StoredSwapPreview {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Partial<StoredSwapPreview>;
  if (record.v !== SWAP_PREVIEW_VERSION) return false;
  if (typeof record.keysetId !== "string" || record.keysetId.length === 0) {
    return false;
  }
  if (!Number.isFinite(record.amount) || !Number.isFinite(record.fees)) {
    return false;
  }
  if (!isBoundedArray(record.inputs)) return false;
  if (!isBoundedArray(record.keepOutputs)) return false;
  if (record.sendOutputs !== undefined && !isBoundedArray(record.sendOutputs)) {
    return false;
  }
  return true;
}

function isBoundedArray(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length <= MAX_PREVIEW_ENTRIES &&
    value.every((entry) => typeof entry === "object" && entry !== null)
  );
}
