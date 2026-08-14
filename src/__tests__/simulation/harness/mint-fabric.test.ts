/**
 * @jest-environment node
 */
// The simulated mint has to agree with the real world about hash_to_curve.
//
// A fake mint that is merely self-consistent is worse than no fake mint: every
// scenario written against it passes, and none of them mean anything. That is
// exactly what happened here. `hashToCurve` used the domain separator
// `Secp256k1_HashToCurvePoint_Cashu_` instead of NUT-00's
// `Secp256k1_HashToCurve_Cashu_`, and nothing failed, because the only consumer
// compared the fabric's Y against the fabric's own Y. Double-spend refusal still
// worked. What broke was NUT-07 `checkstate`, where the CLIENT computes Y using
// cashu-ts: every proof came back UNSPENT forever, so no scenario could observe
// the mint reporting a spent proof.
//
// The assertion that matters is therefore not "matches a constant I typed in"
// but "matches the library the app actually ships". Comparing against cashu-ts
// pins the fabric to the exact counterparty it has to interoperate with, and
// cannot drift the way a hand-copied vector can. The NUT-00 vector is kept as
// well, so a bug in BOTH implementations still has something to fail against.

import { hashToCurve as cashuHashToCurve } from "@cashu/cashu-ts";
import { hashToCurve, hexToBytes } from "./mint-fabric";

// https://github.com/cashubtc/nuts/blob/main/00.md#hash_to_curve
const NUT00_ZERO = [
  "0000000000000000000000000000000000000000000000000000000000000000",
  "024cce997d3b518f739663b757deaec95bcd9473c30a14ac2fd04023a739d1a725",
] as const;

// Spread of shapes a real secret takes: the spec vectors, a UTF-8 secret string
// as a wallet actually produces, and something long enough to need a few
// counter increments before it lands on the curve.
const INPUTS = [
  NUT00_ZERO[0],
  "0000000000000000000000000000000000000000000000000000000000000001",
  "0000000000000000000000000000000000000000000000000000000000000002",
  "deadbeef",
  "00",
];

describe("mint fabric hash_to_curve", () => {
  it("matches the NUT-00 test vector", () => {
    expect(hashToCurve(hexToBytes(NUT00_ZERO[0])).toHex(true)).toBe(
      NUT00_ZERO[1],
    );
  });

  it.each(INPUTS)("agrees with cashu-ts for %s", (x) => {
    const bytes = hexToBytes(x);
    expect(hashToCurve(bytes).toHex(true)).toBe(
      cashuHashToCurve(bytes).toHex(true),
    );
  });

  it("agrees with cashu-ts for a wallet-shaped secret string", () => {
    // Real proofs carry a random hex STRING as the secret, and Y is taken over
    // its UTF-8 bytes, not over the bytes it decodes to. Getting that wrong is
    // the other way these two can silently disagree.
    const secret = "94d00ecd6427716444813 97bf4171b21d9cd7b0cf065be7139e3bc60";
    const bytes = new TextEncoder().encode(secret);
    expect(hashToCurve(bytes).toHex(true)).toBe(
      cashuHashToCurve(bytes).toHex(true),
    );
  });

  it("is deterministic, so a scenario replays identically", () => {
    const bytes = hexToBytes(NUT00_ZERO[0]);
    expect(hashToCurve(bytes).toHex(true)).toBe(hashToCurve(bytes).toHex(true));
  });
});
