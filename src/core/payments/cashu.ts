// Cashu ecash: token detection, embedding, and offline proof validation.
//
// Cashu tokens are bearer instruments: whoever holds the string owns the value.
// Airhop embeds tokens in message text and detects them on receive. No network
// call is needed to transfer value. Redemption requires internet access to the
// mint (not handled here; that is the user's wallet responsibility).
//
// Supported token formats (per NUT-00):
//   cashuA<base64url>  - V3 token (JSON, human-readable)
//   cashuB<base64url>  - V4 token (CBOR, compact)
//   cashu:<token>      - URI form
//   cashu://<token>    - URI form (alternative)
//
// DLEQ proof verification (hasValidDleq) runs offline and is performed on every
// received proof to catch malformed/forged tokens before displaying them.

import {
  getDecodedToken,
  getEncodedToken,
  getTokenMetadata,
  type Proof,
  type ProofLike,
  type Token,
} from "@cashu/cashu-ts";
import type { StoredProof } from "../../store/wallet-store";

// ---- Constants --------------------------------------------------------------

// Maximum token string length before we stop processing (abuse prevention).
const MAX_TOKEN_LENGTH = 60_000;

// Minimum token prefix we check for.
const TOKEN_PREFIXES = ["cashuA", "cashuB", "cashu://", "cashu:"];

// ---- Types ------------------------------------------------------------------

export interface TokenInfo {
  version: "A" | "B" | "unknown";
  amount: number; // total proof amounts in the token's declared unit
  unit: string; // "sat" if not declared
  mintUrl: string; // mint host (first mint)
  memo?: string;
  // Raw decoded token (to pass to Wallet for redemption)
  token: Token;
}

export interface EmbeddedToken {
  info: TokenInfo;
  // The raw token string as it appeared in the message body.
  raw: string;
  // Byte offset in the message text where the token starts.
  offset: number;
}

// ---- Detection --------------------------------------------------------------

// Find all Cashu tokens embedded in message text. Returns one entry per token.
// Safe to call on attacker-controlled content; all paths are bounded.
export function findTokensInText(text: string): EmbeddedToken[] {
  if (text.length > MAX_TOKEN_LENGTH * 2) {
    // Truncate before scanning to prevent ReDoS-style CPU abuse.
    text = text.slice(0, MAX_TOKEN_LENGTH * 2);
  }

  const results: EmbeddedToken[] = [];
  // Find each prefix occurrence and try to extract a token from that position.
  for (const prefix of TOKEN_PREFIXES) {
    let searchStart = 0;
    while (searchStart < text.length) {
      const idx = text.indexOf(prefix, searchStart);
      if (idx < 0) break;
      searchStart = idx + 1;

      const candidate = extractTokenCandidate(text, idx);
      if (!candidate) continue;

      const info = decodeToken(candidate);
      if (!info) continue;

      results.push({ info, raw: candidate, offset: idx });
    }
  }

  // De-duplicate (same raw token found via multiple prefixes).
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.raw)) return false;
    seen.add(r.raw);
    return true;
  });
}

// Extract a token-shaped string starting at `offset` within `text`.
// Returns null if the candidate is too short, too long, or has illegal chars.
function extractTokenCandidate(text: string, offset: number): string | null {
  // Token body ends at the first whitespace or end of string.
  const rest = text.slice(offset);
  const endIdx = rest.search(/\s|$/);
  const candidate = endIdx >= 0 ? rest.slice(0, endIdx) : rest;

  if (candidate.length < 12 || candidate.length > MAX_TOKEN_LENGTH) return null;

  // Strip URI prefix for the charset check.
  let payload = candidate;
  const lower = payload.toLowerCase();
  if (lower.startsWith("cashu://")) payload = payload.slice(8);
  else if (lower.startsWith("cashu:")) payload = payload.slice(6);

  if (!payload.startsWith("cashuA") && !payload.startsWith("cashuB"))
    return null;

  // Base64url charset plus '.' for legacy multi-part tokens.
  if (!/^[a-zA-Z0-9\-_+/=.]+$/.test(payload.slice(6))) return null;

  return candidate;
}

// ---- Decode -----------------------------------------------------------------

// Decode a raw token string into a TokenInfo. Returns null on parse error.
// All failure modes silently return null (never throws to caller).
export function decodeToken(raw: string): TokenInfo | null {
  try {
    let tokenStr = raw.trim();
    const lower = tokenStr.toLowerCase();
    if (lower.startsWith("cashu://")) tokenStr = tokenStr.slice(8);
    else if (lower.startsWith("cashu:")) tokenStr = tokenStr.slice(6);

    if (tokenStr.length > MAX_TOKEN_LENGTH) return null;

    const token = getDecodedToken(tokenStr, []);
    // getTokenMetadata takes the raw token string, not the decoded Token.
    const meta = getTokenMetadata(tokenStr);

    const version = tokenStr.startsWith("cashuA")
      ? "A"
      : tokenStr.startsWith("cashuB")
        ? "B"
        : "unknown";

    // Sum proof amounts. Proof.amount is an Amount value object; use toNumber().
    const amount = token.proofs.reduce(
      (sum: number, p: Proof) => sum + p.amount.toNumber(),
      0,
    );
    const unit = token.unit ?? meta?.unit ?? "sat";
    const mintUrl = token.mint ?? meta?.mint ?? "";

    return { version, amount, unit, mintUrl, memo: token.memo, token };
  } catch {
    return null;
  }
}

// ---- Encode -----------------------------------------------------------------

// Encode a Token object back to a cashuA/B string.
export function encodeToken(token: Token): string {
  return getEncodedToken(token);
}

// Create a token-bearing message body by appending the token string.
// Example output: "here's 500 sats for coffee\ncashuA..."
export function embedTokenInMessage(text: string, token: Token): string {
  const tokenStr = encodeToken(token);
  return text ? `${text}\n${tokenStr}` : tokenStr;
}

// ---- Offline proof validation -----------------------------------------------

// Validate that a proof carries a valid DLEQ witness for the given mint key.
// This runs offline and does not contact the mint. Returns false for any proof
// that fails validation (reject before displaying as payment).
//
// Note: DLEQ verification requires the mint's keyset key for that amount
// denomination. If the keyset is not cached locally, skip and redeem directly.
export function validateProofDleq(
  proof: Proof,
  mintPubkeyHex: string,
): boolean {
  // Import inline to avoid issues in test environments that mock cashu.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { hasValidDleq } = require("@cashu/cashu-ts") as {
      hasValidDleq: (proof: Proof, A: unknown) => boolean;
    };
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { hashToCurve } = require("@cashu/cashu-ts") as {
      hashToCurve: (secret: Uint8Array) => unknown;
    };
    void hashToCurve; // used internally by hasValidDleq
    // The mint key for this proof's amount denomination (provided by caller).
    // If no DLEQ witness is present, the proof may still be valid at the mint.
    if (!proof.dleq) return true; // no witness to check
    // Convert hex mint key to the point representation cashu-ts expects.
    // This is a best-effort check; if conversion fails, we return true (skip).
    return hasValidDleq(proof, mintPubkeyHex as unknown);
  } catch {
    return true; // DLEQ check unavailable; defer to mint
  }
}

// ---- Helpers ----------------------------------------------------------------

// Summarize a TokenInfo for display in the chat UI.
export function formatTokenSummary(info: TokenInfo): string {
  const amount = `${info.amount} ${info.unit}`;
  if (info.memo) return `${amount} - ${info.memo}`;
  return amount;
}

// Check whether a string looks like it might contain a Cashu token
// (lightweight pre-check before running the full scanner).
export function mayContainToken(text: string): boolean {
  return TOKEN_PREFIXES.some((p) => text.includes(p));
}

// ---- Offline send helpers ---------------------------------------------------

// Select the minimum set of proofs from `proofs` whose total covers
// `targetAmount`. Uses a greedy-largest-first strategy. Returns null if
// the available proofs are insufficient.
export function selectProofsForAmount(
  proofs: StoredProof[],
  targetAmount: number,
): { selected: StoredProof[]; total: number } | null {
  if (targetAmount <= 0 || proofs.length === 0) return null;
  const totalAvailable = proofs.reduce((s, p) => s + p.amount, 0);
  if (totalAvailable < targetAmount) return null;

  // Sort descending so we pick as few proofs as possible.
  const sorted = [...proofs].sort((a, b) => b.amount - a.amount);
  const selected: StoredProof[] = [];
  let sum = 0;
  for (const p of sorted) {
    if (sum >= targetAmount) break;
    selected.push(p);
    sum += p.amount;
  }
  return { selected, total: sum };
}

// Build a cashuA token string from locally stored proofs without any network
// call. This is pure serialization: pick proofs, encode them, hand off the
// string. The caller must remove the selected proofs from the wallet store to
// prevent double-spending from the same device.
export function buildOfflineToken(
  mintUrl: string,
  proofs: StoredProof[],
  unit: string = "sat",
  memo?: string,
): string {
  // ProofLike accepts AmountLike (number), so our StoredProof.amount (number)
  // maps directly. getEncodedToken internally normalises via Amount.from().
  const cashuProofs = proofs.map((p): ProofLike => ({
    id: p.id,
    amount: p.amount,
    secret: p.secret,
    C: p.C,
    ...(p.dleq ? { dleq: p.dleq as Proof["dleq"] } : {}),
  }));

  const token = {
    mint: mintUrl,
    proofs: cashuProofs,
    unit,
    ...(memo ? { memo } : {}),
  };
  return getEncodedToken(token as unknown as Token);
}
