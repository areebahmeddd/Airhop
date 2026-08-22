/**
 * @jest-environment node
 */
// Cashu core tests: detection, decoding, fee-aware selection, serialisation.
//
// Real tokens are built with cashu-ts and round-tripped, rather than hand-rolled
// fixtures, so the tests fail if the library's wire format moves under us.
// Nothing here touches a mint.

import { getEncodedToken, type Token } from "@cashu/cashu-ts";
import type { StoredProof } from "@store/wallet-store";
import {
  bareToken,
  buildToken,
  canEncodeTokenQr,
  decodeToken,
  feeForProofs,
  findTokensInText,
  inputFeeFor,
  isLikelyTestMint,
  mayContainToken,
  satsToBtc,
  selectProofsForAmount,
  TOKEN_QR_MAX_CHARS,
  TOKEN_QR_SIZE,
  tokenQrPayload,
  toProofLike,
} from "../cashu";

const MINT = "https://mint.example.com";
const KEYSET = "00ad268c4d1f5826";

function proofSet(amounts: number[]): StoredProof[] {
  return amounts.map((amount, i) => ({
    id: KEYSET,
    amount,
    secret: `secret-${String(i)}`,
    C: "02" + i.toString(16).padStart(2, "0").repeat(32),
  }));
}

// A genuinely encodable token, so decode assertions exercise the real codec.
function realToken(amounts: number[], memo?: string, unit = "sat"): string {
  return getEncodedToken({
    mint: MINT,
    unit,
    proofs: proofSet(amounts).map(toProofLike),
    ...(memo ? { memo } : {}),
  } as unknown as Token);
}

// The same, with the mint left to the caller, for the bound checks that turn on
// what the mint URL looks like.
function encodedToken(mint: string, amounts: number[]): string {
  return getEncodedToken({
    mint,
    unit: "sat",
    proofs: proofSet(amounts).map(toProofLike),
  } as unknown as Token);
}

// ---- Detection ----

describe("mayContainToken", () => {
  it("spots the cashuA, cashuB and URI forms", () => {
    expect(mayContainToken("payment: cashuAabcdef")).toBe(true);
    expect(mayContainToken("cashuBabcdef")).toBe(true);
    expect(mayContainToken("cashu:cashuAabcdef")).toBe(true);
  });

  it("returns false for plain text and empty input", () => {
    expect(mayContainToken("hello world")).toBe(false);
    expect(mayContainToken("")).toBe(false);
  });
});

describe("findTokensInText", () => {
  it("returns nothing for text with no token", () => {
    expect(findTokensInText("hello world")).toHaveLength(0);
  });

  it("finds a real token embedded in prose", () => {
    const token = realToken([2, 8], "coffee");
    const found = findTokensInText(`here you go\n${token}\nenjoy`);

    expect(found).toHaveLength(1);
    expect(found[0].raw).toBe(token);
    expect(found[0].info.amount).toBe(10);
    expect(found[0].info.memo).toBe("coffee");
    expect(found[0].offset).toBe("here you go\n".length);
  });

  it("yields one card for a token written in URI form", () => {
    // The URI wrapper used to be scanned separately from the bare prefix, so a
    // single bearer token rendered as two payment cards.
    const token = realToken([4]);
    const found = findTokensInText(`cashu:${token}`);
    expect(found).toHaveLength(1);
    expect(found[0].raw).toBe(token);
  });

  it("deduplicates a token repeated in one message", () => {
    const token = realToken([16]);
    expect(findTokensInText(`${token} and again ${token}`)).toHaveLength(1);
  });

  it("finds several distinct tokens", () => {
    const a = realToken([1]);
    const b = realToken([2]);
    const found = findTokensInText(`${a} ${b}`);
    expect(found).toHaveLength(2);
  });

  it("drops token-shaped junk that does not decode", () => {
    expect(findTokensInText(`cashuA${"x".repeat(60)}`)).toHaveLength(0);
  });

  it("ignores a prefix that is too short to be a token", () => {
    expect(findTokensInText("cashuAshort")).toHaveLength(0);
  });
});

describe("bareToken", () => {
  it("strips cashu:// and cashu: wrappers", () => {
    const token = realToken([1]);
    expect(bareToken(`cashu://${token}`)).toBe(token);
    expect(bareToken(`cashu:${token}`)).toBe(token);
    expect(bareToken(`  ${token}  `)).toBe(token);
  });

  it("rejects non-token input", () => {
    expect(bareToken("hello")).toBeNull();
    expect(bareToken("cashuC" + "a".repeat(50))).toBeNull();
    expect(bareToken("cashuA!!!!" + "a".repeat(50))).toBeNull();
  });
});

// ---- Decode ----

describe("decodeToken", () => {
  it("reads amount, unit, mint and memo from a real token", () => {
    const info = decodeToken(realToken([2, 8], "lunch"));
    expect(info).not.toBeNull();
    expect(info?.amount).toBe(10);
    expect(info?.unit).toBe("sat");
    expect(info?.mintUrl).toBe(MINT);
    expect(info?.mintHost).toBe("mint.example.com");
    expect(info?.memo).toBe("lunch");
    expect(info?.proofCount).toBe(2);
    expect(info?.version).toBe("B");
  });

  it("reports whether every proof carries a DLEQ witness", () => {
    // Our fixtures have none, which is exactly the "cannot verify offline" case.
    expect(decodeToken(realToken([4]))?.hasDleq).toBe(false);
  });

  it("carries a non-sat unit through rather than assuming sats", () => {
    expect(decodeToken(realToken([3], undefined, "usd"))?.unit).toBe("usd");
  });

  it("returns null for garbage", () => {
    expect(decodeToken("hello")).toBeNull();
    expect(decodeToken("cashuAnotbase64!!!")).toBeNull();
    expect(decodeToken("")).toBeNull();
  });

  it("strips control characters from an attacker-supplied memo", () => {
    const info = decodeToken(realToken([1], "line\x00one\x1ftwo"));
    expect(info?.memo).toBe("line one two");
  });
});

// Every token here encodes cleanly and only fails on a bound, so each case
// reaches the specific check it names rather than dying earlier in the codec.
// A token arrives from a stranger over the mesh, and a card that renders it is
// an invitation to tap. Anything the sender controls therefore needs a ceiling.
describe("decodeToken bounds", () => {
  it("rejects a token carrying no proofs", () => {
    // Encodes fine and reads as a valid token, but is worth nothing. Without
    // the check it renders as a 0 sat card the recipient can try to redeem.
    expect(decodeToken(encodedToken(MINT, []))).toBeNull();
  });

  it("rejects a total above MAX_AMOUNT even when each proof is under it", () => {
    // The per-proof check cannot see a sum. Two proofs at 2e15 each pass
    // individually and total nearly twice the bitcoin supply.
    const each = 2_000_000_000_000_000;
    expect(decodeToken(encodedToken(MINT, [each, each]))).toBeNull();
    // The same shape just under the ceiling still decodes, so the bound is
    // what rejects it and not the proof count.
    expect(decodeToken(encodedToken(MINT, [1, 1]))).not.toBeNull();
  });

  it("rejects a token with no mint to redeem against", () => {
    expect(decodeToken(encodedToken("", [4]))).toBeNull();
  });

  it("rejects an over-long mint URL", () => {
    // A mint URL is displayed and dialled, so an unbounded one is both a
    // layout problem and a request the user never intended.
    expect(
      decodeToken(encodedToken(`https://${"a".repeat(600)}.com`, [4])),
    ).toBeNull();
  });
});

describe("bareToken bounds", () => {
  it("rejects a token too short to be one", () => {
    expect(bareToken("cashuA")).toBeNull();
  });

  it("rejects a token past MAX_TOKEN_LENGTH", () => {
    // The ceiling is what stops a single pasted string costing an unbounded
    // decode. Just under it still passes the length gate.
    expect(bareToken(`cashuA${"a".repeat(60_000)}`)).toBeNull();
    expect(bareToken(`cashuA${"a".repeat(1_000)}`)).not.toBeNull();
  });
});

// ---- Denomination display ----

describe("satsToBtc", () => {
  it("shifts the decimal point without rounding", () => {
    // A sat is exactly 1e-8 BTC, so every one of these is exact rather than
    // approximate. Dividing by 1e8 in floating point is what would introduce
    // error, and a balance that rounds up is a balance that lies.
    expect(satsToBtc(100_000_000)).toBe("1");
    expect(satsToBtc(21_500)).toBe("0.000215");
    expect(satsToBtc(1)).toBe("0.00000001");
    expect(satsToBtc(0)).toBe("0");
  });

  it("keeps large balances exact", () => {
    expect(satsToBtc(2_100_000_000_000_000)).toBe("21000000");
    expect(satsToBtc(123_456_789)).toBe("1.23456789");
  });

  it("trims trailing zeros but never significant digits", () => {
    expect(satsToBtc(150_000_000)).toBe("1.5");
    expect(satsToBtc(100_000_010)).toBe("1.0000001");
  });
});

// ---- QR hand-off ----

describe("token QR", () => {
  it("encodes the bare token, with no cashu: scheme", () => {
    // Every Cashu wallet reads the bare form; only some read the URI form, and
    // the prefix would spend scarce QR capacity on nothing.
    const token = realToken([8]);
    expect(tokenQrPayload(token)).toBe(token);
    expect(tokenQrPayload(`cashu:${token}`)).toBe(token);
    expect(tokenQrPayload(`cashu://${token}`)).toBe(token);
  });

  it("accepts an ordinary payment", () => {
    // A handful of proofs is what a real send looks like.
    expect(canEncodeTokenQr(realToken([1, 2, 4, 8, 16]))).toBe(true);
  });

  it("refuses a token past the QR capacity rather than throwing at render", () => {
    // The generator throws past its limit, which would take the sheet down
    // with it, so the check has to happen before anything is rendered.
    expect(canEncodeTokenQr("c".repeat(TOKEN_QR_MAX_CHARS))).toBe(true);
    expect(canEncodeTokenQr("c".repeat(TOKEN_QR_MAX_CHARS + 1))).toBe(false);
  });

  it("refuses an empty string", () => {
    expect(canEncodeTokenQr("")).toBe(false);
  });
});

// ---- Fees ----

describe("inputFeeFor", () => {
  it("rounds up, as the mint does", () => {
    expect(inputFeeFor(1, 100)).toBe(1); // 0.1 -> 1
    expect(inputFeeFor(10, 100)).toBe(1); // exactly 1
    expect(inputFeeFor(11, 100)).toBe(2); // 1.1 -> 2
  });

  it("is zero for a fee-free keyset", () => {
    expect(inputFeeFor(5, 0)).toBe(0);
    expect(inputFeeFor(0, 100)).toBe(0);
  });
});

describe("feeForProofs", () => {
  it("sums per-keyset fees and rounds once at the end", () => {
    const fees = { [KEYSET]: 100 };
    expect(feeForProofs(proofSet([1, 2, 4]), fees)).toBe(1);
    expect(feeForProofs(proofSet([1, 2, 4]), undefined)).toBe(0);
  });
});

// ---- Selection ----

describe("selectProofsForAmount", () => {
  it("finds an exact subset from power-of-two denominations", () => {
    const result = selectProofsForAmount(proofSet([1, 2, 4, 8, 16, 32]), 10);
    expect(result?.exact).toBe(true);
    expect(result?.total).toBe(10);
    expect(result?.receivable).toBe(10);
  });

  it("does not overshoot when one large proof would cover the amount", () => {
    // The old largest-first walk spent a whole 64 to send 10.
    const result = selectProofsForAmount(proofSet([64, 8, 2]), 10);
    expect(result?.total).toBe(10);
    expect(result?.selected.map((p) => p.amount).sort((a, b) => a - b)).toEqual(
      [2, 8],
    );
  });

  it("returns null when the balance cannot cover the amount", () => {
    expect(selectProofsForAmount(proofSet([1, 2]), 100)).toBeNull();
    expect(selectProofsForAmount([], 10)).toBeNull();
    expect(selectProofsForAmount(proofSet([8]), 0)).toBeNull();
  });

  it("flags an inexact selection instead of silently overpaying", () => {
    const result = selectProofsForAmount(proofSet([64]), 10);
    expect(result?.exact).toBe(false);
    expect(result?.total).toBe(64);
  });

  it("trims redundant proofs from an inexact covering set", () => {
    // 1 + 32 covers 10; the 1 is unnecessary once the 32 is in.
    const result = selectProofsForAmount(proofSet([1, 32]), 10);
    expect(result?.selected).toHaveLength(1);
    expect(result?.total).toBe(32);
  });

  it("covers the mint's input fee so the recipient nets the amount", () => {
    const fees = { [KEYSET]: 1000 }; // 1 sat per input proof
    const result = selectProofsForAmount(proofSet([1, 2, 4, 8, 16]), 10, fees);
    expect(result).not.toBeNull();
    // Whatever it picks, the recipient must end up with at least the target
    // after the mint takes its cut.
    expect(result!.receivable).toBeGreaterThanOrEqual(10);
    expect(result!.fee).toBe(result!.selected.length);
    expect(result!.total - result!.fee).toBe(result!.receivable);
  });

  it("spends unverified proofs before confirmed ones", () => {
    // Passing on the riskiest proofs first is both safer for us and no worse
    // for the recipient, who swaps immediately.
    const proofs: StoredProof[] = [
      { ...proofSet([8])[0], secret: "confirmed", verified: true },
      { ...proofSet([8])[0], secret: "unconfirmed", verified: false },
    ];
    const result = selectProofsForAmount(proofs, 8);
    expect(result?.selected[0].secret).toBe("unconfirmed");
  });
});

// ---- Serialisation ----

describe("buildToken", () => {
  it("round-trips through decodeToken", () => {
    const encoded = buildToken(MINT, proofSet([2, 8]), "sat", "thanks");
    const info = decodeToken(encoded);

    expect(info?.amount).toBe(10);
    expect(info?.mintUrl).toBe(MINT);
    expect(info?.memo).toBe("thanks");
    expect(info?.unit).toBe("sat");
  });

  it("emits a cashuB (V4) token, which bitchat's decoder also reads", () => {
    expect(buildToken(MINT, proofSet([1]))).toMatch(/^cashuB/);
  });

  it("omits the memo when none is given", () => {
    expect(decodeToken(buildToken(MINT, proofSet([1])))?.memo).toBeUndefined();
  });

  it("produces a token the message scanner then finds", () => {
    const encoded = buildToken(MINT, proofSet([32]));
    const found = findTokensInText(`for you: ${encoded}`);
    expect(found).toHaveLength(1);
    expect(found[0].info.amount).toBe(32);
  });
});

describe("isLikelyTestMint", () => {
  it("flags a mint that describes itself as one", () => {
    expect(
      isLikelyTestMint({
        url: "https://testnut.cashu.space",
        name: "Testnut mint",
        description: "Mint for testing Cashu wallets",
      }),
    ).toBe(true);
  });

  // The name/description path in isolation: a hostname that the URL check
  // cannot flag, so only the word match can pass this. Without it the earlier
  // case still goes green off its testnut.cashu.space hostname while the word
  // regex matches nothing at all.
  it("flags on the name alone, with an ordinary hostname", () => {
    expect(
      isLikelyTestMint({
        url: "https://mint.example.com",
        name: "Regtest Mint",
      }),
    ).toBe(true);
  });

  it("flags on the description alone, with an ordinary hostname", () => {
    expect(
      isLikelyTestMint({
        url: "https://mint.example.com",
        description: "A fakewallet mint, not for real value",
      }),
    ).toBe(true);
  });

  it("flags by hostname when the mint says nothing about itself", () => {
    expect(isLikelyTestMint({ url: "https://testnut.example.com" })).toBe(true);
  });

  it("leaves an ordinary mint alone", () => {
    expect(
      isLikelyTestMint({
        url: "https://mint.minibits.cash/Bitcoin",
        name: "Minibits",
        description: "A mint for everyday payments",
      }),
    ).toBe(false);
  });

  // "latest" contains "test" but is not a test mint. Substring matching would
  // get this wrong; the word boundaries are what make it safe.
  it("does not match a word that merely contains test", () => {
    expect(
      isLikelyTestMint({
        url: "https://mint.example.com",
        description: "Running the latest stable release",
      }),
    ).toBe(false);
  });

  it("survives a malformed url", () => {
    expect(isLikelyTestMint({ url: "not a url" })).toBe(false);
  });
});

// The QR ceiling is a scannability budget, not the format's capacity, so it has
// to be checked against what a REAL token weighs. The proofs above are toy
// sized (short secrets, no DLEQ witness); a token from a mint that issues DLEQ
// carries roughly 210 bytes per proof before base64, which is what pushed a
// plain 10 sat hand-off past a code that could actually be read.
describe("token QR sizing", () => {
  // Same shape a mint really returns: 64-hex secret, 33-byte C, DLEQ witness.
  function heavyProofs(count: number): StoredProof[] {
    return Array.from({ length: count }, (_, i) => ({
      id: KEYSET,
      amount: 2 ** i,
      secret: "a".repeat(64),
      C: "02" + "b".repeat(64),
      dleq: { e: "c".repeat(64), s: "d".repeat(64), r: "e".repeat(64) },
    })) as unknown as StoredProof[];
  }

  function heavyToken(count: number): string {
    return buildToken(MINT, heavyProofs(count));
  }

  it("fits an ordinary hand-off, DLEQ witnesses and all", () => {
    // One to four proofs covers the great majority of real sends.
    // A 10 sat send is two proofs (8 + 2) and weighs ~664 characters, which is
    // exactly the hand-off that was failing to scan.
    for (const count of [1, 2, 3]) {
      expect(canEncodeTokenQr(heavyToken(count))).toBe(true);
    }
    // Four proofs (~1250) is past what stays readable at this size, so it takes
    // the copy / share / mesh route instead of rendering a code nobody can read.
    expect(canEncodeTokenQr(heavyToken(4))).toBe(false);
  });

  it("keeps the ceiling inside what the drawn code can carry", () => {
    // 264 px over a version-20 code (97 modules) is ~2.7 screen pixels per
    // module. Raising the char ceiling without growing the square is what makes
    // a QR that renders perfectly and scans never, so pin the pair.
    expect(TOKEN_QR_MAX_CHARS).toBeLessThanOrEqual(1159);
    expect(TOKEN_QR_SIZE / 97).toBeGreaterThanOrEqual(2.5);
  });
});

// A V4 token names its keyset by a short id, and the v2 form (ids beginning
// "01") cannot be resolved without the full id to map it back to. NUT-00
// requires refusing rather than guessing: an unresolved id means the signing
// keyset is unknown, so the proof can be neither verified nor priced.
//
// Decoding with no ids at all therefore returned null for a valid token, which
// the app showed as an unreadable token and rendered as no payment chip.
describe("short keyset ids", () => {
  function tokenWithKeyset(keysetId: string): string {
    return getEncodedToken({
      mint: MINT,
      unit: "sat",
      proofs: [
        {
          id: keysetId,
          amount: 8,
          secret: "a".repeat(64),
          C: "02" + "11".repeat(32),
        },
      ],
    } as unknown as Token);
  }

  const V1_KEYSET = "00ad268c4d1f5826";
  const V2_KEYSET = "01ad268c4d1f5826bb";

  it("decodes a v1 keyset id without needing anything cached", () => {
    expect(decodeToken(tokenWithKeyset(V1_KEYSET))?.amount).toBe(8);
  });

  it("decodes a v2 keyset id when the mint's ids are cached", () => {
    const info = decodeToken(tokenWithKeyset(V2_KEYSET), [V2_KEYSET]);
    expect(info).not.toBeNull();
    expect(info?.amount).toBe(8);
    expect(info?.mintUrl).toBe(MINT);
  });

  it("refuses a v2 keyset id it cannot resolve, rather than guessing", () => {
    // Correct, not a gap: without the full id the proof cannot be verified or
    // priced. Supplying the ids we hold is the fix, never pretending an
    // unresolved one is fine.
    expect(decodeToken(tokenWithKeyset(V2_KEYSET))).toBeNull();
  });

  it("renders a chat chip for a v2 token once the ids are known", () => {
    // The user-visible half: without the ids, no chip renders at all.
    const token = tokenWithKeyset(V2_KEYSET);
    expect(findTokensInText(`here you go ${token}`)).toHaveLength(0);
    expect(findTokensInText(`here you go ${token}`, [V2_KEYSET])).toHaveLength(
      1,
    );
  });
});
