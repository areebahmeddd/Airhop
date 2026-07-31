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
const DOMAIN = new TextEncoder().encode("Secp256k1_HashToCurvePoint_Cashu_");

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
}

const DEFAULT_CONDITIONS: MintConditions = {
  offline: false,
  serverError: false,
  latencyMs: 20,
  swapVanishes: false,
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
    { amount: number; unit: string; paid: boolean; issued: boolean }
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
    // Anything not addressed to this mint is not ours to answer.
    if (!url.startsWith(this.url)) {
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
        "4": { methods: [{ method: "bolt11", unit: "sat" }], disabled: false },
        "5": { methods: [{ method: "bolt11", unit: "sat" }] },
        "7": { supported: true },
        "9": { supported: true },
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
        fee_reserve: 0,
        state: "UNPAID",
        expiry: Math.floor(Date.now() / 1000) + 3600,
        payment_preimage: null,
      });
    }
    // The simulation's invoices encode their amount as lnbc<amount>sim.
    const request =
      typeof body.request === "string" ? body.request : "lnbc0sim";
    const amount = Number(/lnbc(\d+)/.exec(request)?.[1] ?? 0);
    const id = `melt-${String(this.quotes.size + 1)}`;
    this.quotes.set(id, { amount, unit: "sat", paid: false, issued: false });
    return this.json({
      quote: id,
      amount,
      unit: "sat",
      fee_reserve: 0,
      state: "UNPAID",
      expiry: Math.floor(Date.now() / 1000) + 3600,
      payment_preimage: null,
    });
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
    for (const input of inputs) this.spentYs.add(this.yFor(input.secret));
    const quoteId = typeof body.quote === "string" ? body.quote : "";
    const quote = this.quotes.get(quoteId);
    if (quote !== undefined) quote.paid = true;
    return this.json({
      quote: quoteId,
      amount: quote?.amount ?? 0,
      unit: "sat",
      fee_reserve: 0,
      state: "PAID",
      payment_preimage: "sim-preimage",
      change: [],
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
    return { id: this.keyset.id, amount: output.amount, C_: C.toHex(true) };
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
