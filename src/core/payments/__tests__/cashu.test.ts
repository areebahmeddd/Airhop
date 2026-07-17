// Tests for Cashu token detection and decoding.
// Uses only the pure parsing functions; no network calls or native deps.

import type { Token } from "@cashu/cashu-ts";
import type { TokenInfo } from "../cashu";
import {
  decodeToken,
  embedTokenInMessage,
  findTokensInText,
  formatTokenSummary,
  mayContainToken,
} from "../cashu";

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
});
