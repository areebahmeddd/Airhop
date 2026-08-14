/**
 * @jest-environment node
 */
// The only thing between a forged token and the balance when there is no mint.
//
// Offline, nobody can ask whether a proof is unspent. What CAN be checked is
// whether the mint ever signed it, because a NUT-12 DLEQ witness is verifiable
// against the mint's public keys alone. That is what `verifyTokenOffline` does,
// and its answer decides whether a stranger's token is credited in a dead zone.
//
// The three answers are not interchangeable and the distinction is the whole
// point. "invalid" means provably forged and the token is refused outright.
// "unchecked" means we could not tell, so the value is stored as UNVERIFIED and
// redeemed at the first opportunity. Collapsing the second into the first would
// break every legitimate offline transfer; collapsing it into "valid" would
// credit forgeries. Nothing tested this function before.
//
// Not covered here: a genuinely valid witness, which needs the mint's private
// keys. That belongs to the simulation, where a mint issues real ones, and is
// covered by scenario W14 in src/__tests__/simulation/scenarios/wallet.test.ts.
// The split is deliberate: refusal is decided by this function alone and is
// cheap to pin here, while acceptance is only meaningful end to end.

import {
  deriveKeysetId,
  KeyChain,
  type KeyChainCache,
  type MintKeys,
  type MintKeyset,
  type Proof,
  type Token,
} from "@cashu/cashu-ts";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { verifyTokenOffline, type DleqResult } from "../cashu";

const MINT = "https://mint.example.com";
const UNIT = "sat";
const DENOMINATIONS = [1, 2, 4, 8, 16, 32];

// A keyset with real secp256k1 public keys. They are real because
// `deriveKeysetId` hashes them and `hasValidDleq` does curve arithmetic with
// them: made-up hex would fail for the wrong reason and prove nothing.
function buildKeyset(): { cache: KeyChainCache; keysetId: string } {
  const publicKeys: Record<string, string> = {};
  for (const amount of DENOMINATIONS) {
    // Deterministic per denomination, so a failure is reproducible.
    const priv = new Uint8Array(32).fill(0);
    priv[31] = amount;
    publicKeys[String(amount)] = bytesToHex(secp256k1.getPublicKey(priv, true));
  }
  const keysetId = deriveKeysetId(publicKeys, { versionByte: 0 });

  const keysets: MintKeyset[] = [
    { id: keysetId, unit: UNIT, active: true, input_fee_ppk: 0 },
  ];
  const keys: MintKeys[] = [{ id: keysetId, unit: UNIT, keys: publicKeys }];
  return {
    cache: KeyChain.mintToCacheDTO(MINT, keysets, keys),
    keysetId,
  };
}

const { cache, keysetId } = buildKeyset();

// Built loosely and cast once: cashu-ts models an amount as a wrapper type, and
// the point here is the verifier's behaviour on hand-made proofs, not our
// ability to satisfy its constructors.
function proof(
  over: {
    id?: string;
    amount?: number;
    secret?: string;
    dleq?: { e: string; s: string; r: string };
  } = {},
): Proof {
  return {
    id: over.id ?? keysetId,
    amount: over.amount ?? 8,
    secret: over.secret ?? "a".repeat(64),
    C: bytesToHex(secp256k1.getPublicKey(new Uint8Array(32).fill(7), true)),
    ...(over.dleq === undefined ? {} : { dleq: over.dleq }),
  } as unknown as Proof;
}

function token(proofs: Proof[]): Token {
  return { mint: MINT, unit: UNIT, proofs } as unknown as Token;
}

// `reason` is carried by the two verdicts that have something to explain, so
// reaching for it needs the union narrowed rather than an assertion.
function reasonOf(result: DleqResult): string {
  return result.status === "valid" ? "" : result.reason;
}

// A witness that is structurally a witness and cryptographically nonsense. This
// is what a forgery looks like: the attacker can put any bytes in the field,
// they just cannot make them verify.
const FORGED_DLEQ = {
  e: "11".repeat(32),
  s: "22".repeat(32),
  r: "33".repeat(32),
};

describe("when the check cannot reach a conclusion", () => {
  // Every one of these must be "unchecked" rather than "invalid", because a
  // legitimate offline transfer looks exactly like this. Treating it as forged
  // would break the feature the wallet exists for.
  it("reports a token carrying no witness as unchecked", () => {
    const result = verifyTokenOffline(token([proof()]), cache, UNIT);
    expect(result.status).toBe("unchecked");
    expect(reasonOf(result)).toMatch(/no DLEQ/i);
  });

  it("reports unchecked when this device has never cached the mint's keys", () => {
    const result = verifyTokenOffline(
      token([proof({ dleq: FORGED_DLEQ })]),
      undefined,
      UNIT,
    );
    expect(result.status).toBe("unchecked");
    expect(reasonOf(result)).toMatch(/not cached/i);
  });

  it("reports unchecked when the cached keys are unreadable", () => {
    // A corrupted or half-written cache must not be read as a forgery verdict.
    const corrupt = { keysets: [], mintUrl: MINT } as unknown as KeyChainCache;
    const result = verifyTokenOffline(
      token([proof({ dleq: FORGED_DLEQ })]),
      corrupt,
      UNIT,
    );
    expect(result.status).toBe("unchecked");
  });

  it("skips a proof from a keyset the mint has since rotated away", () => {
    // We know the mint but not this keyset, so there is nothing to check. It
    // must not be called a forgery: rotation is normal mint behaviour.
    const rotated = proof({ id: "00" + "ff".repeat(7), dleq: FORGED_DLEQ });
    const result = verifyTokenOffline(token([rotated]), cache, UNIT);
    expect(result.status).not.toBe("invalid");
  });
});

describe("when the token is provably forged", () => {
  it("refuses a witness that does not verify against the mint's keys", () => {
    // The case the function exists for: someone hands over a token in a dead
    // zone with a witness they made up.
    const result = verifyTokenOffline(
      token([proof({ dleq: FORGED_DLEQ })]),
      cache,
      UNIT,
    );
    expect(result.status).toBe("invalid");
    expect(reasonOf(result)).toMatch(/DLEQ/);
  });

  it("refuses a proof claiming a denomination the mint does not issue", () => {
    // Cashu amounts are powers of two and the mint holds one key per
    // denomination. A proof for 999 matches no key, which is forgery rather
    // than an inconclusive check.
    const result = verifyTokenOffline(
      token([proof({ amount: 999, dleq: FORGED_DLEQ })]),
      cache,
      UNIT,
    );
    expect(result.status).toBe("invalid");
  });

  it("refuses the whole token when only one proof among many is forged", () => {
    // Partial credit is not an option: the token is one bearer instrument, so
    // a single bad proof poisons all of it.
    const result = verifyTokenOffline(
      token([proof(), proof({ secret: "b".repeat(64), dleq: FORGED_DLEQ })]),
      cache,
      UNIT,
    );
    expect(result.status).toBe("invalid");
  });
});
