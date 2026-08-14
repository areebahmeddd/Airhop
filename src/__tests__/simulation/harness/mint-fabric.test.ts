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

import { hashToCurve as cashuHashToCurve, Mint, Wallet } from "@cashu/cashu-ts";
import { hashToCurve, hexToBytes, MintFabric, simInvoice } from "./mint-fabric";
import { World } from "./world";

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

// The other half of the same argument. A mint that ACCEPTS whatever a wallet
// offers cannot tell a correctly priced transaction from an underpaid one, so
// every scenario about fees would pass with the fee arithmetic removed
// entirely. NUT-02 is enforced here for the same reason double-spend is: it is
// what a real mint would do, and it is what makes a fee bug in the wallet
// visible.
//
// Both tests set the fee AFTER the wallet has cached the keyset, which is not a
// trick to get a failure: it is exactly the situation an offline-first wallet
// lives in. Fees are cached for a day so a send can be priced with no signal,
// and a mint that raised its rate since then takes more than the quote said.
describe("NUT-02 input fees", () => {
  async function fundedWallet(fabric: MintFabric, sats: number) {
    const wallet = new Wallet(new Mint(fabric.url), { unit: "sat" });
    await wallet.loadMint(true);
    const quote = await wallet.createMintQuoteBolt11(sats);
    const proofs = await wallet.mintProofsBolt11(sats, quote);
    return { wallet, proofs };
  }

  it("refuses a swap whose outputs leave no room for the fee", async () => {
    const world = new World({ seed: 1 });
    const fabric = new MintFabric(world, "https://fee-swap.test");
    fabric.setConditions({ latencyMs: 0 });
    fabric.install();
    try {
      const { wallet, proofs } = await fundedWallet(fabric, 8);
      // The wallet's cached rate is now stale by exactly one sat.
      fabric.setConditions({ inputFeePpk: 100 });
      await expect(wallet.receive(proofs)).rejects.toThrow();
      expect(fabric.feesCollected).toBe(0);
    } finally {
      world.close();
    }
  });

  it("refuses a melt the inputs cannot cover once the fee is taken", async () => {
    const world = new World({ seed: 2 });
    const fabric = new MintFabric(world, "https://fee-melt.test");
    fabric.setConditions({ latencyMs: 0 });
    fabric.install();
    try {
      const { wallet, proofs } = await fundedWallet(fabric, 8);
      fabric.setConditions({ inputFeePpk: 100 });
      const quote = await wallet.createMeltQuoteBolt11(simInvoice(8));
      const preview = await wallet.prepareMelt("bolt11", quote, proofs);
      await expect(wallet.completeMelt(preview)).rejects.toThrow();
      // The refusal has to come BEFORE the payment, or the mint has paid an
      // invoice it was never funded for and the inputs are gone with it.
      expect(fabric.isSpent(proofs[0]?.secret ?? "")).toBe(false);
    } finally {
      world.close();
    }
  });

  it("rounds the total up once, not once per input", async () => {
    // NUT-02 sums the per-input rate and rounds the TOTAL. At 100 ppk that is
    // one sat for anything up to ten inputs and two for eleven; rounding per
    // input would charge one each and overcharge a multi-proof spend tenfold.
    const world = new World({ seed: 3 });
    const fabric = new MintFabric(world, "https://fee-round.test");
    fabric.setConditions({ latencyMs: 0, inputFeePpk: 100 });
    fabric.install();
    try {
      // 1023 is ten proofs: 512+256+128+64+32+16+8+4+2+1.
      const { wallet, proofs } = await fundedWallet(fabric, 1023);
      expect(proofs).toHaveLength(10);
      const kept = await wallet.receive(proofs);
      expect(fabric.feesCollected).toBe(1);
      expect(kept.reduce((sum, p) => sum + p.amount.toNumber(), 0)).toBe(1022);
    } finally {
      world.close();
    }
  });
});
