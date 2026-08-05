// A Cashu mint that exists only in this process.
//
// The seam is `globalThis.fetch`, which is what @cashu/cashu-ts uses for every
// call. Everything above the wire therefore runs for real: real blinding, real
// unblinding, real proof selection, real fee arithmetic, real DLEQ
// verification. The mint does real BDHKE too - it is only forty lines of
// secp256k1 - because a mint that returned made-up signatures would make every
// DLEQ check pass or fail for the wrong reason, and DLEQ is precisely what
// stands between a user and a forged token.
//
// What this buys that a stubbed wallet cannot:
//
//   * Double-spend is REAL. The mint keeps a spent set, and the second person
//     to present a proof is refused by the same code path a real mint uses.
//   * Value conservation is checkable. Everything the mint ever signed is
//     known, so "no sat was created or destroyed" is an arithmetic fact rather
//     than an assumption.
//   * Failure is injectable at the transport, so "the mint went away mid-swap"
//     is the same event the app would see in a tunnel.

import { deriveKeysetId } from "@cashu/cashu-ts";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import type { World } from "./world";

// Cashu denominations are powers of two, so any amount is a sum of them.
const DENOMINATIONS = [
  1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
  65536,
];

// NUT-00 hash_to_curve, domain-separated exactly as the spec requires. Getting
// this wrong would make every signature verify against nothing.
//
// The separator is `Secp256k1_HashToCurve_Cashu_`, verified against the NUT-00
// test vectors in mint-fabric.test.ts. This read `HashToCurvePoint_` for a long
// time and nothing caught it, because the only consumer was `yFor`, which
// compares the fabric's own Y against the fabric's own Y: a double-spend was
// still refused, so W03 passed on a hash the rest of the world disagreed with.
// What it silently broke was NUT-07 `checkstate`, where the CLIENT computes Y
// with cashu-ts. Every proof therefore came back UNSPENT no matter what, so any
// scenario relying on the mint reporting a spent proof - reconcile settling a
// send, refreshAccount dropping spent proofs - could not have failed if it were
// wrong, and could not have passed if it were right.
const DOMAIN = new TextEncoder().encode("Secp256k1_HashToCurve_Cashu_");

function hashToCurve(
  secretBytes: Uint8Array,
): ReturnType<typeof secp256k1.Point.fromHex> {
  const msgHash = sha256(new Uint8Array([...DOMAIN, ...secretBytes]));
  for (let counter = 0; counter < 0x10000; counter++) {
    const counterBytes = new Uint8Array(4);
    new DataView(counterBytes.buffer).setUint32(0, counter, true);
    const candidate = sha256(new Uint8Array([...msgHash, ...counterBytes]));
    try {
      return secp256k1.Point.fromHex(`02${bytesToHex(candidate)}`);
    } catch {
      // Not on the curve; try the next counter, as the spec says.
    }
  }
  throw new Error("hash_to_curve exhausted its counter");
}

export interface MintConditions {
  // Every call fails at the transport, as it does with no internet.
  offline: boolean;
  // HTTP 500 from the mint itself, which is a different failure: reachable but
  // refusing.
  serverError: boolean;
  // Round-trip delay.
  latencyMs: number;
  // The mint accepts a swap, marks the inputs spent, then fails before
  // returning the outputs. The nastiest real failure: value has moved and the
  // client does not know where.
  swapVanishes: boolean;
  // Routing reserve quoted on a melt, in sats. A real mint cannot know the
  // Lightning fee in advance, so it over-reserves and returns the unused part
  // as change (NUT-08). Zero means "quote exactly", which is the easy case and
  // not the one that loses money.
  meltFeeReserve: number;
  // Of that reserve, what the route actually cost. The difference comes back as
  // change. Only meaningful when meltFeeReserve > 0.
  meltActualFee: number;
  // The Lightning payment fails. The inputs MUST survive: a mint that burns
  // them on a failed payment has eaten the sender's money.
  meltFails: boolean;
  // The mint pays the invoice, marks the inputs spent, and then the response
  // never reaches the wallet. The worst melt failure and the realistic one: a
  // dropped connection at exactly the wrong moment. The wallet cannot know
  // whether it paid, so it must not guess in either direction - releasing the
  // proofs would double-count money that is gone, dropping them would throw away
  // the unused routing reserve the mint is holding for it.
  meltVanishes: boolean;
}

const DEFAULT_CONDITIONS: MintConditions = {
  offline: false,
  serverError: false,
  latencyMs: 20,
  swapVanishes: false,
  meltFeeReserve: 0,
  meltActualFee: 0,
  meltFails: false,
  meltVanishes: false,
};

interface Keyset {
  id: string;
  unit: string;
  // Private key per denomination.
  keys: Map<number, Uint8Array>;
  // The matching public keys, hex, keyed by amount as a string.
  publicKeys: Record<string, string>;
}

export class MintFabric {
  readonly url: string;
  private readonly keyset: Keyset;
  // Every proof secret the mint has signed, and whether it has been spent.
  private readonly issued = new Map<
    string,
    { amount: number; spent: boolean }
  >();
  private conditions: MintConditions = { ...DEFAULT_CONDITIONS };
  private readonly quotes = new Map<
    string,
    {
      amount: number;
      unit: string;
      paid: boolean;
      issued: boolean;
      // The bolt11 string. NUT-05 echoes it back as `request` on every melt
      // quote and melt response, and cashu-ts refuses a response without it.
      request?: string;
      // Change signed against the wallet's blank outputs. Held on the quote so
      // a later `checkMeltQuote` can return it, which is the ONLY way a wallet
      // recovers its unused routing reserve after a melt response goes missing.
      change?: { id: string; amount: number; C_: string }[];
    }
  >();
  // Every blinded message the mint has ever signed, keyed by B_. NUT-09 restore
  // is exactly a lookup in this table: the wallet re-derives its blinded
  // messages from the seed and asks "which of these do you recognise".
  private readonly signedByB = new Map<
    string,
    { id: string; amount: number; C_: string }
  >();
  private previousFetch: typeof globalThis.fetch | undefined;

  // Counters a scenario can assert on.
  swapCount = 0;
  doubleSpendRefusals = 0;
  totalIssued = 0;

  constructor(
    private readonly world: World,
    url = "https://mint.test",
  ) {
    this.url = url;
    const keys = new Map<number, Uint8Array>();
    const publicKeys: Record<string, string> = {};
    for (const amount of DENOMINATIONS) {
      // Deterministic per denomination, so a scenario replays identically.
      const priv = sha256(
        new TextEncoder().encode(`airhop-sim-mint-${String(amount)}`),
      );
      keys.set(amount, priv);
      publicKeys[String(amount)] = bytesToHex(
        secp256k1.getPublicKey(priv, true),
      );
    }
    // NUT-02: the keyset ID is DERIVED from the public keys, not chosen. A mint
    // that picks an id the client cannot reproduce has its whole keyset
    // discarded as invalid, which surfaces as "no active keyset for unit sat"
    // rather than as anything about ids. Deriving it with the client's own
    // function makes disagreement impossible by construction.
    // versionByte 0 is the NUT-02 v1 id: "00" plus 14 hex characters, 16
    // characters total. cashu-ts will happily derive a v2 ("01"-prefixed,
    // 33-byte) id by default, but a V4 `cashuB` token encodes the keyset id as
    // 8 raw bytes, so a v2 id cannot round-trip through one: the token encodes,
    // and then fails to decode, with nothing more specific than "that is not a
    // readable Cashu token". Real mints in the wild still issue v1 ids, so this
    // is also the more representative choice.
    this.keyset = {
      id: deriveKeysetId(publicKeys, { versionByte: 0 }),
      unit: "sat",
      keys,
      publicKeys,
    };
  }

  // ---- lifecycle ------------------------------------------------------------

  install(): void {
    this.previousFetch = globalThis.fetch;
    globalThis.fetch = ((input: unknown, init?: unknown) =>
      this.handle(input, init)) as typeof globalThis.fetch;
    this.world.onClose(() => this.uninstall());
  }

  uninstall(): void {
    if (this.previousFetch !== undefined) {
      globalThis.fetch = this.previousFetch;
      this.previousFetch = undefined;
    }
  }

  setConditions(partial: Partial<MintConditions>): void {
    this.conditions = { ...this.conditions, ...partial };
    this.world.say("MINT_CONDITIONS", JSON.stringify(partial));
  }

  // ---- accounting -----------------------------------------------------------

  // Everything the mint has ever put into circulation and not seen spent. The
  // sum of every wallet's spendable balance can never exceed this.
  outstandingValue(): number {
    let sum = 0;
    for (const record of this.issued.values()) {
      if (!record.spent) sum += record.amount;
    }
    return sum;
  }

  // ---- HTTP -----------------------------------------------------------------

  private async handle(input: unknown, init?: unknown): Promise<Response> {
    const url = typeof input === "string" ? input : String(input);
    // Anything not addressed to this mint goes to whoever was installed before
    // us. That chaining is what lets two mints exist at once, which a
    // consolidate scenario needs: without it the second `install()` would
    // shadow the first and every call to mint A would 404.
    if (!url.startsWith(this.url)) {
      if (this.previousFetch !== undefined) {
        return this.previousFetch(input as RequestInfo, init as RequestInit);
      }
      return this.json({ detail: "not found" }, 404);
    }
    if (this.conditions.offline) {
      this.world.say("MINT_UNREACHABLE", url);
      throw new TypeError("Network request failed");
    }
    await this.delay();
    if (this.conditions.serverError) {
      return this.json({ detail: "mint is having a bad day" }, 500);
    }

    const path = url.slice(this.url.length);
    const body = this.parseBody(init);

    if (path.startsWith("/v1/info")) return this.info();
    if (path.startsWith("/v1/keysets")) return this.keysets();
    if (path.startsWith("/v1/keys")) return this.keys();
    if (path.startsWith("/v1/checkstate")) return this.checkState(body);
    if (path.startsWith("/v1/restore")) return this.restore(body);
    if (path.startsWith("/v1/swap")) return this.swap(body);
    if (path.startsWith("/v1/mint/quote")) return this.mintQuote(path, body);
    if (path.startsWith("/v1/mint")) return this.mint(body);
    if (path.startsWith("/v1/melt/quote")) return this.meltQuote(path, body);
    if (path.startsWith("/v1/melt")) return this.melt(body);
    return this.json({ detail: `unhandled ${path}` }, 404);
  }

  private parseBody(init: unknown): Record<string, unknown> {
    const raw = (init as { body?: unknown } | undefined)?.body;
    if (typeof raw !== "string") return {};
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  private async delay(): Promise<void> {
    if (this.conditions.latencyMs <= 0) return;
    await new Promise<void>((resolve) => {
      setTimeout(resolve, this.conditions.latencyMs);
    });
  }

  private json(payload: unknown, status = 200): Response {
    const text = JSON.stringify(payload);
    return {
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => "application/json" },
      json: async () => JSON.parse(text) as unknown,
      text: async () => text,
    } as unknown as Response;
  }

  // ---- endpoints ------------------------------------------------------------

  private info(): Response {
    return this.json({
      name: "Airhop simulation mint",
      pubkey: bytesToHex(
        secp256k1.getPublicKey(
          this.keyset.keys.get(1) ?? new Uint8Array(32),
          true,
        ),
      ),
      version: "sim/1.0",
      nuts: {
        // `description: true` is what lets a mint quote carry a memo. Moving a
        // balance between mints needs it: the destination invoice is labelled
        // so the transfer is identifiable in history, and cashu-ts refuses to
        // send a description to a mint that has not advertised support.
        "4": {
          methods: [{ method: "bolt11", unit: "sat", description: true }],
          disabled: false,
        },
        "5": { methods: [{ method: "bolt11", unit: "sat" }] },
        "7": { supported: true },
        "9": { supported: true },
        "11": { supported: true },
        "12": { supported: true },
      },
    });
  }

  private keysets(): Response {
    return this.json({
      keysets: [
        {
          id: this.keyset.id,
          unit: this.keyset.unit,
          active: true,
          input_fee_ppk: 0,
        },
      ],
    });
  }

  private keys(): Response {
    return this.json({
      keysets: [
        {
          id: this.keyset.id,
          unit: this.keyset.unit,
          keys: this.keyset.publicKeys,
        },
      ],
    });
  }

  // NUT-07: which of these proofs has the mint already seen spent?
  private checkState(body: Record<string, unknown>): Response {
    const ys = Array.isArray(body.Ys) ? (body.Ys as string[]) : [];
    return this.json({
      states: ys.map((y) => ({
        Y: y,
        state: this.spentYs.has(y) ? "SPENT" : "UNSPENT",
        witness: null,
      })),
    });
  }

  // Spent proofs, keyed by Y = hash_to_curve(secret), which is how NUT-07
  // identifies a proof without revealing its secret.
  private readonly spentYs = new Set<string>();

  private swap(body: Record<string, unknown>): Response {
    this.swapCount++;
    const inputs = (body.inputs ?? []) as {
      amount: number;
      secret: string;
      C: string;
      id: string;
    }[];
    const outputs = (body.outputs ?? []) as {
      amount: number;
      B_: string;
      id: string;
    }[];

    // Double-spend check FIRST, before anything is marked. Whoever gets here
    // second is refused, which is the entire security model of ecash.
    for (const input of inputs) {
      const y = this.yFor(input.secret);
      if (this.spentYs.has(y)) {
        this.doubleSpendRefusals++;
        this.world.say(
          "MINT_DOUBLE_SPEND_REFUSED",
          `${input.amount} sat proof already spent`,
        );
        return this.json({ detail: "Token already spent.", code: 11001 }, 400);
      }
    }

    const inputSum = inputs.reduce((a, b) => a + b.amount, 0);
    const outputSum = outputs.reduce((a, b) => a + b.amount, 0);
    if (outputSum > inputSum) {
      return this.json({ detail: "Outputs exceed inputs.", code: 11002 }, 400);
    }

    for (const input of inputs) this.spentYs.add(this.yFor(input.secret));

    if (this.conditions.swapVanishes) {
      this.world.say("MINT_SWAP_VANISHED", "inputs burned, outputs never sent");
      return this.json({ detail: "gateway timeout" }, 504);
    }

    return this.json({ signatures: outputs.map((o) => this.blindSign(o)) });
  }

  private mintQuote(path: string, body: Record<string, unknown>): Response {
    // GET /v1/mint/quote/bolt11/<id> is a lookup; POST is a request.
    const parts = path.split("/").filter((p) => p.length > 0);
    const maybeId = parts[parts.length - 1];
    const existing = this.quotes.get(maybeId);
    if (existing !== undefined) {
      return this.json({
        quote: maybeId,
        request: `lnbc${String(existing.amount)}sim`,
        amount: existing.amount,
        unit: existing.unit,
        state: existing.paid ? (existing.issued ? "ISSUED" : "PAID") : "UNPAID",
        expiry: Math.floor(Date.now() / 1000) + 3600,
      });
    }
    const amount = typeof body.amount === "number" ? body.amount : 0;
    const id = `quote-${String(this.quotes.size + 1)}`;
    this.quotes.set(id, {
      amount,
      unit: typeof body.unit === "string" ? body.unit : "sat",
      // The simulation's Lightning always pays instantly; a scenario that wants
      // an unpaid invoice can hold the quote and assert on the UNPAID state.
      paid: true,
      issued: false,
    });
    return this.json({
      quote: id,
      request: `lnbc${String(amount)}sim`,
      amount,
      unit: body.unit ?? "sat",
      state: "UNPAID",
      expiry: Math.floor(Date.now() / 1000) + 3600,
    });
  }

  private mint(body: Record<string, unknown>): Response {
    const quoteId = typeof body.quote === "string" ? body.quote : "";
    const quote = this.quotes.get(quoteId);
    if (quote === undefined || !quote.paid) {
      return this.json({ detail: "Quote not paid.", code: 20001 }, 400);
    }
    if (quote.issued) {
      return this.json({ detail: "Quote already issued.", code: 20002 }, 400);
    }
    quote.issued = true;
    const outputs = (body.outputs ?? []) as {
      amount: number;
      B_: string;
      id: string;
    }[];
    return this.json({ signatures: outputs.map((o) => this.blindSign(o)) });
  }

  private meltQuote(path: string, body: Record<string, unknown>): Response {
    const parts = path.split("/").filter((p) => p.length > 0);
    const maybeId = parts[parts.length - 1];
    const existing = this.quotes.get(maybeId);
    if (existing !== undefined) {
      return this.json({
        quote: maybeId,
        amount: existing.amount,
        unit: existing.unit,
        request: existing.request ?? "",
        fee_reserve: this.conditions.meltFeeReserve,
        state: existing.paid ? "PAID" : "UNPAID",
        expiry: Math.floor(Date.now() / 1000) + 3600,
        payment_preimage: existing.paid ? "sim-preimage" : null,
        change: existing.change ?? [],
      });
    }
    // The simulation's invoices encode their amount as lnbc<amount>sim.
    const request =
      typeof body.request === "string" ? body.request : "lnbc0sim";
    const amount = Number(/lnbc(\d+)/.exec(request)?.[1] ?? 0);
    const id = `melt-${String(this.quotes.size + 1)}`;
    this.quotes.set(id, {
      amount,
      unit: "sat",
      paid: false,
      issued: false,
      request,
    });
    return this.json({
      quote: id,
      amount,
      unit: "sat",
      request,
      fee_reserve: this.conditions.meltFeeReserve,
      state: "UNPAID",
      expiry: Math.floor(Date.now() / 1000) + 3600,
      payment_preimage: null,
    });
  }

  // NUT-09 restore. The wallet re-derives blinded messages from its seed and
  // asks which the mint already signed; the mint answers with the matching
  // subset, in the SAME order it received them, paired with their signatures.
  //
  // Deliberately says nothing about whether a returned proof is still unspent.
  // That is NUT-07's job, and the wallet does that separately: a restore that
  // silently dropped spent proofs would hide exactly the case where a user
  // restores an old phrase and thinks they are richer than they are.
  private restore(body: Record<string, unknown>): Response {
    const outputs = (body.outputs ?? []) as {
      B_: string;
      amount?: number;
      id?: string;
    }[];
    const matchedOutputs: unknown[] = [];
    const signatures: { id: string; amount: number; C_: string }[] = [];
    for (const output of outputs) {
      const known = this.signedByB.get(output.B_);
      if (known === undefined) continue;
      matchedOutputs.push({
        B_: output.B_,
        amount: known.amount,
        id: known.id,
      });
      signatures.push(known);
    }
    return this.json({ outputs: matchedOutputs, signatures });
  }

  private melt(body: Record<string, unknown>): Response {
    const inputs = (body.inputs ?? []) as { secret: string; amount: number }[];
    for (const input of inputs) {
      const y = this.yFor(input.secret);
      if (this.spentYs.has(y)) {
        this.doubleSpendRefusals++;
        return this.json({ detail: "Token already spent.", code: 11001 }, 400);
      }
    }

    // A failed Lightning payment must leave the inputs alone. The mint has paid
    // nobody, so burning them would be the mint eating the sender's money, and
    // the wallet's whole recovery story for a failed melt depends on the proofs
    // still being valid when it releases the reservation.
    if (this.conditions.meltFails) {
      this.world.say("MINT_MELT_FAILED", "route not found, inputs untouched");
      return this.json({ detail: "Payment failed.", code: 20000 }, 400);
    }

    for (const input of inputs) this.spentYs.add(this.yFor(input.secret));
    const quoteId = typeof body.quote === "string" ? body.quote : "";
    const quote = this.quotes.get(quoteId);
    if (quote !== undefined) quote.paid = true;

    // NUT-08: the wallet sent blank outputs to receive its change. The mint
    // decides the amounts and signs a prefix of them; the wallet unblinds in
    // order using the blinding factors it kept.
    //
    // Change is everything the mint was given and did not need:
    //
    //   inputs - invoice amount - what the route actually cost
    //
    // NOT merely the unused reserve. Those differ whenever the wallet could not
    // assemble inputs summing exactly to amount + reserve, which is the normal
    // case for a balance made of powers of two. Getting this wrong made the
    // fabric quietly pocket the difference, and a wallet losing money to
    // over-payment would have looked like a passing test.
    const reserve = this.conditions.meltFeeReserve;
    const inputSum = inputs.reduce((a, b) => a + b.amount, 0);
    const unused = Math.max(
      0,
      inputSum - (quote?.amount ?? 0) - this.conditions.meltActualFee,
    );
    const blanks = (body.outputs ?? []) as {
      B_: string;
      amount: number;
      id: string;
    }[];
    const change: { id: string; amount: number; C_: string }[] = [];
    let remaining = unused;
    for (const blank of blanks) {
      if (remaining <= 0) break;
      // Largest denomination that still fits, so the change comes back in as
      // few coins as the blanks allow.
      const denom = DENOMINATIONS.filter((d) => d <= remaining).pop();
      if (denom === undefined) break;
      change.push(this.blindSign({ ...blank, amount: denom }));
      remaining -= denom;
    }
    if (change.length > 0) {
      this.world.say(
        "MINT_MELT_CHANGE",
        `${String(unused - remaining)} sat of ${String(reserve)} reserve returned`,
      );
    }
    // Kept on the quote either way. A wallet that never saw this response comes
    // back later and asks the quote for it, which is the whole recovery path.
    if (quote !== undefined) quote.change = change;

    if (this.conditions.meltVanishes) {
      // Paid, inputs burned, change signed - and the wallet hears nothing. It
      // must not guess. Only the quote can tell it what happened.
      this.world.say("MINT_MELT_VANISHED", "paid, but the answer never landed");
      throw new TypeError("Network request failed");
    }

    return this.json({
      quote: quoteId,
      amount: quote?.amount ?? 0,
      unit: "sat",
      request: quote?.request ?? "",
      fee_reserve: reserve,
      state: "PAID",
      expiry: Math.floor(Date.now() / 1000) + 3600,
      payment_preimage: "sim-preimage",
      change,
    });
  }

  // ---- BDHKE ----------------------------------------------------------------

  private yFor(secret: string): string {
    return hashToCurve(new TextEncoder().encode(secret)).toHex(true);
  }

  // C_ = k * B_. The wallet unblinds this into a signature it can present back.
  private blindSign(output: { amount: number; B_: string; id: string }): {
    id: string;
    amount: number;
    C_: string;
  } {
    const priv = this.keyset.keys.get(output.amount);
    if (priv === undefined) {
      throw new Error(`no key for denomination ${output.amount}`);
    }
    const B = secp256k1.Point.fromHex(output.B_);
    const C = B.multiply(BigInt(`0x${bytesToHex(priv)}`));
    this.totalIssued += output.amount;
    const signature = {
      id: this.keyset.id,
      amount: output.amount,
      C_: C.toHex(true),
    };
    this.signedByB.set(output.B_, signature);
    return signature;
  }

  // Test affordance: mark a proof spent behind the wallet's back, which is what
  // "somebody else redeemed this token first" looks like from here.
  markSpent(secret: string): void {
    this.spentYs.add(this.yFor(secret));
  }

  isSpent(secret: string): boolean {
    return this.spentYs.has(this.yFor(secret));
  }
}

export { hashToCurve, hexToBytes };
