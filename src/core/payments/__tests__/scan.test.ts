/**
 * @jest-environment node
 */
// What the camera is allowed to hand the wallet.
//
// Scanning is the one input path where the user cannot proof-read what they are
// giving the app: they point a camera and trust the result. Two failure shapes
// matter, and they fail in opposite directions:
//
//   * Too strict, and a perfectly good QR from another wallet does nothing at
//     all. The camera just sits there, and there is nowhere for the app to put
//     an error message, so it reads as broken hardware.
//   * Too loose, and the wrong kind of string is accepted. A testnet invoice
//     pasted into a mainnet withdrawal spends real sats at a worthless invoice.
//
// The round-trip case is the one worth stating outright: a token this wallet
// produced, rendered as a QR and scanned back by this wallet, must come out
// identical. That is the Wallet tab's own share-and-scan loop.

import type { StoredProof } from "../../../store/wallet-store";
import { buildToken } from "../cashu";
import { bareInvoice, readScan } from "../scan";

const MINT = "https://mint.airhop.example";

function proof(amount: number, n: number): StoredProof {
  return {
    id: "00ad268c4d1f5826",
    amount,
    secret: `${String(n)}${"a".repeat(63)}`,
    C: "02" + "cc".repeat(32),
  };
}

describe("readScan for a token", () => {
  it("round-trips a token this wallet built", () => {
    const token = buildToken(MINT, [proof(64, 1), proof(8, 2)]);
    expect(readScan(token, "token")).toBe(token);
  });

  it("strips a cashu: scheme, which other wallets add to their QRs", () => {
    const token = buildToken(MINT, [proof(4, 1)]);
    expect(readScan(`cashu:${token}`, "token")).toBe(token);
    expect(readScan(`cashu://${token}`, "token")).toBe(token);
  });

  it("tolerates the whitespace a camera picks up around a code", () => {
    const token = buildToken(MINT, [proof(2, 1)]);
    expect(readScan(`  ${token}\n`, "token")).toBe(token);
  });

  it("refuses an invoice when it was asked for a token", () => {
    // Pointing the Receive scanner at a Lightning QR must not half-work.
    expect(readScan("lnbc500n1pjqxyz", "token")).toBeNull();
  });

  it("refuses empty, missing and non-token input", () => {
    expect(readScan(undefined, "token")).toBeNull();
    expect(readScan("", "token")).toBeNull();
    expect(readScan("https://example.com", "token")).toBeNull();
    expect(readScan("hello world", "token")).toBeNull();
  });
});

describe("readScan for an invoice", () => {
  it("accepts a bare mainnet invoice", () => {
    expect(readScan("lnbc500n1pjqxyz", "invoice")).toBe("lnbc500n1pjqxyz");
  });

  it("strips the lightning: scheme most wallets encode", () => {
    expect(readScan("lightning:lnbc500n1pjqxyz", "invoice")).toBe(
      "lnbc500n1pjqxyz",
    );
    expect(readScan("LIGHTNING:LNBC500N1PJQXYZ", "invoice")).toBe(
      "lnbc500n1pjqxyz",
    );
  });

  it("lowercases, because bech32 is case-insensitive but the mint is not", () => {
    expect(readScan("LNBC500N1PJQXYZ", "invoice")).toBe("lnbc500n1pjqxyz");
  });

  it("accepts test networks, so a testnut mint can be exercised", () => {
    // Refusing these would make the documented testing flow impossible.
    expect(bareInvoice("lntb500n1pjqxyz")).toBe("lntb500n1pjqxyz");
    expect(bareInvoice("lnbcrt500n1pjqxyz")).toBe("lnbcrt500n1pjqxyz");
    expect(bareInvoice("lntbs500n1pjqxyz")).toBe("lntbs500n1pjqxyz");
  });

  it("refuses a token when it was asked for an invoice", () => {
    const token = buildToken(MINT, [proof(4, 1)]);
    expect(readScan(token, "invoice")).toBeNull();
  });

  it("refuses anything that is not a bolt11 invoice at all", () => {
    expect(bareInvoice("bitcoin:bc1qxyz")).toBeNull();
    expect(bareInvoice("lnurl1dp68gurn8ghj7")).toBeNull();
    expect(bareInvoice("ln")).toBeNull();
    // A prefix with no amount digit after it is not an invoice either.
    expect(bareInvoice("lnbc")).toBeNull();
    expect(bareInvoice("")).toBeNull();
  });
});
