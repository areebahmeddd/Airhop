// Tests for Cashu token detection and decoding.
// Uses only the pure parsing functions; no network calls or native deps.

import type { Token } from "@cashu/cashu-ts";
import type { StoredProof } from "../../../store/wallet-store";
import type { TokenInfo } from "../cashu";
import {
  decodeToken,
  embedTokenInMessage,
  findTokensInText,
  formatTokenSummary,
  mayContainToken,
  selectProofsForAmount,
} from "../cashu";

// Cashu denominations are powers of two; build a proof set from amounts.
function proofSet(amounts: number[]): StoredProof[] {
  return amounts.map((amount, i) => ({
    id: "keyset1",
    amount,
    secret: `secret-${String(i)}`,
    C: `C-${String(i)}`,
  }));
}

// Helpers to build a minimal valid-looking Token object for encoding tests.
function minimalToken(): Token {
  return {
    mint: "https://mint.test",
    proofs: [],
    unit: "sat",
    memo: "test",
  };
}

describe("cashu", () => {
  describe("mayContainToken", () => {
    it("returns true for cashuA prefix", () => {
      expect(mayContainToken("payment: cashuAabcdef")).toBe(true);
    });

    it("returns true for cashu: URI", () => {
      expect(mayContainToken("cashu:cashuAabcdef")).toBe(true);
    });

    it("returns false for plain text", () => {
      expect(mayContainToken("hello world")).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(mayContainToken("")).toBe(false);
    });
  });

  describe("findTokensInText", () => {
    it("returns empty array for text without tokens", () => {
      expect(findTokensInText("hello world")).toHaveLength(0);
    });

    it("returns empty array for malformed cashu prefix", () => {
      expect(findTokensInText("cashuA!!!invalid")).toHaveLength(0);
    });

    it("does not throw on very long input", () => {
      const longText = "a".repeat(200_000);
      expect(() => findTokensInText(longText)).not.toThrow();
    });

    it("does not throw on token-like but invalid base64", () => {
      const text = `cashuA${"\x00".repeat(20)}`;
      expect(() => findTokensInText(text)).not.toThrow();
    });
  });

  describe("decodeToken", () => {
    it("returns null for empty string", () => {
      expect(decodeToken("")).toBeNull();
    });

    it("returns null for plain text", () => {
      expect(decodeToken("hello")).toBeNull();
    });

    it("returns null for truncated cashuA string", () => {
      expect(decodeToken("cashuAabc")).toBeNull();
    });

    it("returns null for invalid base64 payload", () => {
      expect(decodeToken("cashuA!!!")).toBeNull();
    });

    it("handles cashu: URI prefix", () => {
      // Both formats should be handled identically (same underlying decode)
      expect(decodeToken("cashu:")).toBeNull(); // no payload
    });
  });

  describe("embedTokenInMessage", () => {
    it("appends token to message text", () => {
      const token = minimalToken();
      // We need a real encoded token for this test; use encodeToken
      const result = embedTokenInMessage("test message", token);
      expect(result).toContain("test message\n");
    });

    it("returns just the token when text is empty", () => {
      const token = minimalToken();
      const result = embedTokenInMessage("", token);
      expect(result).not.toContain("\n");
    });
  });

  function stubTokenInfo(overrides?: Partial<TokenInfo>): TokenInfo {
    const base: Token = { mint: "https://mint.test", proofs: [], unit: "sat" };
    return {
      version: "A",
      amount: 0,
      unit: "sat",
      mintUrl: "https://mint.test",
      token: base,
      ...overrides,
    };
  }

  describe("formatTokenSummary", () => {
    it("formats amount and unit", () => {
      const info = stubTokenInfo({ amount: 500, unit: "sat" });
      expect(formatTokenSummary(info)).toBe("500 sat");
    });

    it("includes memo when present", () => {
      const info = stubTokenInfo({ amount: 500, unit: "sat", memo: "coffee" });
      expect(formatTokenSummary(info)).toBe("500 sat - coffee");
    });
  });

  // Proof selection spends real value, so exactness is a correctness property,
  // not a nicety: any overshoot is money handed to the recipient with no
  // offline way to get change back.
  describe("selectProofsForAmount", () => {
    it("returns null when the balance cannot cover the target", () => {
      expect(selectProofsForAmount(proofSet([1, 2]), 10)).toBeNull();
    });

    it("returns null for a non-positive target", () => {
      expect(selectProofsForAmount(proofSet([8]), 0)).toBeNull();
    });

    it("picks an exact single proof when one matches", () => {
      const result = selectProofsForAmount(proofSet([1, 2, 8, 64]), 8);
      expect(result).not.toBeNull();
      expect(result?.exact).toBe(true);
      expect(result?.total).toBe(8);
      expect(result?.selected.map((p) => p.amount)).toEqual([8]);
    });

    it("combines denominations to hit the target exactly", () => {
      const result = selectProofsForAmount(proofSet([1, 2, 4, 8, 16]), 13);
      expect(result?.exact).toBe(true);
      expect(result?.total).toBe(13);
      expect(
        result?.selected.map((p) => p.amount).sort((a, b) => a - b),
      ).toEqual([1, 4, 8]);
    });

    it("does NOT spend a large proof to cover a small amount when exact change exists", () => {
      // Regression: the old greedy took 64 first and overshot by 54.
      const result = selectProofsForAmount(proofSet([64, 8, 2]), 10);
      expect(result?.exact).toBe(true);
      expect(result?.total).toBe(10);
      expect(
        result?.selected.map((p) => p.amount).sort((a, b) => a - b),
      ).toEqual([2, 8]);
    });

    it("flags overpayment (never silently) when no exact subset exists", () => {
      // Only a 64 available but 10 requested: must report exact=false so the
      // caller can warn instead of quietly spending 64.
      const result = selectProofsForAmount(proofSet([64]), 10);
      expect(result).not.toBeNull();
      expect(result?.exact).toBe(false);
      expect(result?.total).toBe(64);
    });

    it("minimises the overshoot when overpaying is unavoidable", () => {
      // 16 and 64 available, need 10 => should choose 16, not 64 or both.
      const result = selectProofsForAmount(proofSet([64, 16]), 10);
      expect(result?.exact).toBe(false);
      expect(result?.total).toBe(16);
      expect(result?.selected.map((p) => p.amount)).toEqual([16]);
    });

    it("never selects proofs totalling less than the target", () => {
      const result = selectProofsForAmount(proofSet([1, 2, 4, 32]), 7);
      expect(result?.total).toBeGreaterThanOrEqual(7);
    });
  });
});
