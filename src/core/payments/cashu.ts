// Cashu ecash: token detection, decoding, offline verification, and selection.
//
// Cashu tokens are bearer instruments: whoever holds the string owns the value.
// Airhop embeds tokens in message text and detects them on receive, so no
// network call is needed to transfer value. Everything in this module is pure
// and offline; anything that talks to a mint lives in
// `src/services/wallet-service.ts`.
//
// Supported token formats (NUT-00):
//   cashuA<base64url>  V3 token (JSON, legacy)
//   cashuB<base64url>  V4 token (CBOR, compact) - what we emit
//   cashu:<token>      URI form
//   cashu://<token>    URI form (alternative)
//
// Detection is deliberately identical to bitchat's
// `MessageFormattingEngine.Patterns.cashu`, down to the character class and the
// 40-character minimum body. Both apps read the same messages off the same
// mesh, so a string that renders as a payment chip on one must render as a
// payment chip on the other; being more permissive here would show a card where
// bitchat shows raw text.
//
// What "verification" means offline
// ---------------------------------
// `verifyTokenOffline` runs NUT-12 DLEQ checks against the mint's cached public
// keys. A passing DLEQ proves the mint really signed this proof, so it catches
// forged and tampered tokens. It cannot prove the proof is *unspent* - only the
// mint knows that, and only over the network. Offline-received proofs are
// therefore stored as unverified and redeemed at the first opportunity.

import {
  getDecodedToken,
  getEncodedToken,
  hasValidDleq,
  KeyChain,
  type KeyChainCache,
  type Proof,
  type ProofLike,
  type Token,
} from "@cashu/cashu-ts";
import type { StoredProof } from "../../store/wallet-store";

// ---- Constants --------------------------------------------------------------

// Upper bound on an accepted token string. Real tokens are a few KB.
const MAX_TOKEN_LENGTH = 60_000;

// Stop scanning message text beyond this. Guards CPU on hostile input.
const MAX_SCAN_LENGTH = MAX_TOKEN_LENGTH * 2;

// Most chips we will render for one message, matching bitchat's cap.
const MAX_TOKENS_PER_MESSAGE = 3;

// Sanity cap on any single amount or token total: more sats than will ever
// exist. Anything above this is a malformed or hostile token.
const MAX_AMOUNT = 2_100_000_000_000_000;

// Cheap pre-check before running the scanner.
const TOKEN_HINTS = ["cashuA", "cashuB", "cashu:"];

// Bare-token pattern, byte-for-byte the same as bitchat's. The `cashu:` and
// `cashu://` URI forms are handled implicitly: the match starts at the embedded
// `cashuA`/`cashuB`, which is exactly the bearer string we want.
const TOKEN_PATTERN = /\bcashu[AB][A-Za-z0-9._-]{40,}\b/g;

// ---- Types ------------------------------------------------------------------

export interface TokenInfo {
  version: "A" | "B";
  // Total of the proof amounts, in `unit`.
  amount: number;
  // "sat" when the token does not declare one (NUT-00 default).
  unit: string;
  // Full mint URL as declared by the token.
  mintUrl: string;
  // Mint hostname only, for compact display.
  mintHost: string;
  memo?: string;
  proofCount: number;
  // Whether every proof carries a NUT-12 DLEQ witness. Without one there is
  // nothing to verify offline, so the token can only be trusted after a swap.
  hasDleq: boolean;
  // Decoded token, to hand to a Wallet for redemption.
  token: Token;
}

export interface EmbeddedToken {
  info: TokenInfo;
  // The bare `cashuA…`/`cashuB…` string as it appeared in the message body.
  raw: string;
  // Character offset in the message text where the token starts.
  offset: number;
}

export type DleqResult =
  // Every proof carried a DLEQ witness and every one verified against the
  // mint's keys. The mint definitely signed this. Still says nothing about
  // whether it has already been spent.
  | { status: "valid"; checked: number }
  // At least one witness failed to verify. The token is forged or corrupted;
  // refuse it.
  | { status: "invalid"; reason: string }
  // No witnesses present, or we hold no keys for this mint's keyset, so there
  // was nothing to check. Not a failure, just no offline assurance.
  | { status: "unchecked"; reason: string };

// ---- Detection --------------------------------------------------------------

// Whether a string could contain a Cashu token. Cheap enough to call per
// message render before the full scan.
export function mayContainToken(text: string): boolean {
  return TOKEN_HINTS.some((hint) => text.includes(hint));
}

// Find Cashu tokens embedded in message text, at most MAX_TOKENS_PER_MESSAGE.
// Safe on attacker-controlled content: bounded scan window, bounded matches,
// and every decode failure drops the candidate rather than throwing.
//
// Tokens are deduplicated by their bare string, so `cashu:cashuA…` and the same
// `cashuA…` written twice in one message yield exactly one card. The previous
// implementation scanned once per URI prefix and deduplicated on the raw slice
// including the prefix, which rendered the same bearer token as two cards.
export function findTokensInText(text: string): EmbeddedToken[] {
  if (!mayContainToken(text)) return [];
  const scanned =
    text.length > MAX_SCAN_LENGTH ? text.slice(0, MAX_SCAN_LENGTH) : text;

  const results: EmbeddedToken[] = [];
  const seen = new Set<string>();

  // `lastIndex` is mutated by exec on a /g regex, so use a fresh instance
  // rather than the shared literal (which is not re-entrant).
  const pattern = new RegExp(TOKEN_PATTERN.source, "g");
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(scanned)) !== null) {
    const raw = match[0];
    if (raw.length > MAX_TOKEN_LENGTH) continue;
    if (seen.has(raw)) continue;
    seen.add(raw);

    const info = decodeToken(raw);
    if (!info) continue;

    results.push({ info, raw, offset: match.index });
    if (results.length >= MAX_TOKENS_PER_MESSAGE) break;
  }

  return results;
}

// Strip a `cashu:` / `cashu://` URI wrapper and percent-encoding to get the
// bare bearer string. Returns null when the input is not token-shaped.
export function bareToken(raw: string): string | null {
  let token = raw.trim();
  const lower = token.toLowerCase();
  if (lower.startsWith("cashu://")) token = token.slice(8);
  else if (lower.startsWith("cashu:")) token = token.slice(6);

  if (token.includes("%")) {
    try {
      token = decodeURIComponent(token);
    } catch {
      // Malformed percent-encoding: keep the original and let the shape check
      // below reject it.
    }
  }

  if (token.length < 12 || token.length > MAX_TOKEN_LENGTH) return null;
  if (!token.startsWith("cashuA") && !token.startsWith("cashuB")) return null;
  // Same charset as the detection pattern, plus the base64 (non-url) characters
  // that older wallets emit, since a directly pasted token is not constrained by
  // what survives a message body.
  if (!/^[A-Za-z0-9._\-+/=]+$/.test(token.slice(6))) return null;
  return token;
}

// ---- Decode -----------------------------------------------------------------

// Decode a token string into a display/redemption summary, or null if it does
// not cleanly parse into a known version carrying a positive amount.
//
// There is no permissive mode: unlike bitchat, which renders a generic chip for
// a V4 payload its minimal CBOR reader cannot walk, we use a full CBOR decoder,
// so failure to decode here means the token really is malformed. Showing a card
// for something we cannot price would be worse than showing the raw string.
export function decodeToken(raw: string): TokenInfo | null {
  const tokenStr = bareToken(raw);
  if (!tokenStr) return null;

  try {
    // The keyset-id list only matters for rehydrating the short ids that V4
    // tokens use for keysets we already know about. An empty list keeps the
    // short id, which is still a valid lookup key everywhere we use it.
    const token = getDecodedToken(tokenStr, []);
    if (!Array.isArray(token.proofs) || token.proofs.length === 0) return null;

    let amount = 0;
    for (const proof of token.proofs) {
      const value = proof.amount.toNumber();
      if (!Number.isFinite(value) || value <= 0 || value > MAX_AMOUNT)
        return null;
      amount += value;
      if (amount > MAX_AMOUNT) return null;
    }
    if (amount <= 0) return null;

    const mintUrl = typeof token.mint === "string" ? token.mint : "";
    if (mintUrl.length === 0 || mintUrl.length > 512) return null;

    return {
      version: tokenStr.startsWith("cashuA") ? "A" : "B",
      amount,
      unit: sanitizeUnit(token.unit),
      mintUrl,
      mintHost: mintHostOf(mintUrl),
      memo: sanitizeMemo(token.memo),
      proofCount: token.proofs.length,
      hasDleq: token.proofs.every((p) => p.dleq !== undefined),
      token,
    };
  } catch {
    return null;
  }
}

// Mint hostname for display. Attacker-controlled, so it is length-capped and
// lowercased; falls back to a truncated raw string for non-URL mints.
function mintHostOf(mintUrl: string): string {
  try {
    return new URL(mintUrl).hostname.toLowerCase().slice(0, 48);
  } catch {
    return mintUrl.slice(0, 48);
  }
}

// Units are alphanumeric currency codes ("sat", "usd", "eur"). Reject anything
// else rather than rendering attacker-chosen text next to an amount.
function sanitizeUnit(unit: string | undefined): string {
  if (typeof unit !== "string") return "sat";
  if (unit.length === 0 || unit.length > 12) return "sat";
  if (!/^[a-zA-Z0-9]+$/.test(unit)) return "sat";
  return unit.toLowerCase();
}

// Memos are shown verbatim in the payment card, so strip control characters and
// newlines (which would let a sender fake extra UI lines) and cap the length.
function sanitizeMemo(memo: string | undefined): string | undefined {
  if (typeof memo !== "string" || memo.length > 512) return undefined;
  const cleaned = memo.replace(/[ -]/g, " ").trim();
  return cleaned.length > 0 ? cleaned.slice(0, 80) : undefined;
}

// ---- Offline DLEQ verification ----------------------------------------------

// Verify every proof in a token against the mint's cached public keys (NUT-12).
//
// `keysetCache` is the `keyChain.cache` blob persisted per mint by the wallet
// service. It contains public keys only, so it is safe to keep unencrypted and
// safe to use offline. Without it there is nothing to check against, which is
// reported as "unchecked", not as a pass: the old implementation returned true
// both when a witness was missing and when the check threw, which meant it
// could only ever say yes.
export function verifyTokenOffline(
  token: Token,
  keysetCache: KeyChainCache | undefined,
  unit: string,
): DleqResult {
  const withDleq = token.proofs.filter((p) => p.dleq !== undefined);
  if (withDleq.length === 0) {
    return { status: "unchecked", reason: "token carries no DLEQ witness" };
  }
  if (!keysetCache) {
    return {
      status: "unchecked",
      reason: "mint keys not cached on this device",
    };
  }

  let keyChain: KeyChain;
  try {
    keyChain = KeyChain.fromCache(token.mint, unit, keysetCache);
  } catch {
    return { status: "unchecked", reason: "cached mint keys are unreadable" };
  }

  let checked = 0;
  for (const proof of token.proofs) {
    let keyset;
    try {
      keyset = keyChain.getKeyset(proof.id);
    } catch {
      // We know this mint but not this keyset (it rotated, or the token uses a
      // short id we cannot resolve). Nothing to check for this proof.
      continue;
    }
    try {
      // `require: false` accepts a proof carrying no witness, which is the
      // NUT-12 "MUST verify if present" rule: a mint that predates DLEQ is not
      // a mint issuing bad proofs. Anything that DOES carry one must verify.
      // (This replaces `verifyDleqIfPresent`, which is the same behaviour under
      // the name cashu-ts is removing in v5.)
      if (!hasValidDleq(proof, keyset, { require: false })) {
        return {
          status: "invalid",
          reason: `proof ${proof.secret.slice(0, 8)}… failed DLEQ verification`,
        };
      }
      if (proof.dleq !== undefined) checked += 1;
    } catch (err) {
      // A throw here means the proof's amount matches no key in the keyset,
      // i.e. it claims a denomination the mint does not issue. That is a
      // forgery, not an inconclusive check.
      return {
        status: "invalid",
        reason: `proof ${proof.secret.slice(0, 8)}… has no matching mint key (${String(err)})`,
      };
    }
  }

  if (checked === 0) {
    return {
      status: "unchecked",
      reason: "no keys cached for this token's keyset",
    };
  }
  if (checked < withDleq.length) {
    return {
      status: "unchecked",
      reason: `verified ${String(checked)} of ${String(withDleq.length)} witnesses`,
    };
  }
  return { status: "valid", checked };
}

// ---- Proof conversion -------------------------------------------------------

// cashu-ts `Proof` -> persisted `StoredProof`. The `Amount` value object does
// not survive JSON, so it is flattened to a number here and rebuilt on the way
// out. `verified` is set by the caller: only the mint can grant it.
export function toStoredProof(
  proof: Proof,
  opts?: { verified?: boolean; derived?: boolean; receivedAtMs?: number },
): StoredProof {
  return {
    id: proof.id,
    amount: proof.amount.toNumber(),
    secret: proof.secret,
    C: proof.C,
    ...(proof.dleq
      ? { dleq: proof.dleq as unknown as StoredProof["dleq"] }
      : {}),
    ...(proof.witness !== undefined
      ? {
          witness:
            typeof proof.witness === "string"
              ? proof.witness
              : JSON.stringify(proof.witness),
        }
      : {}),
    verified: opts?.verified ?? false,
    derived: opts?.derived ?? false,
    receivedAtMs: opts?.receivedAtMs ?? Date.now(),
  };
}

// Persisted proof -> the `ProofLike` shape cashu-ts accepts everywhere (it
// normalises the numeric amount internally via `Amount.from`).
export function toProofLike(proof: StoredProof): ProofLike {
  return {
    id: proof.id,
    amount: proof.amount,
    secret: proof.secret,
    C: proof.C,
    ...(proof.dleq ? { dleq: proof.dleq as Proof["dleq"] } : {}),
    ...(proof.witness !== undefined
      ? { witness: proof.witness as Proof["witness"] }
      : {}),
  } as ProofLike;
}

// ---- Encode -----------------------------------------------------------------

// Serialise stored proofs into a `cashuB` token string. Pure serialisation: no
// mint contact, no state change. The caller MUST reserve or remove the selected
// proofs from the store before handing the string out, or the same value can be
// spent twice from this device.
//
// DLEQ witnesses are carried through when present, so the recipient can verify
// the mint's signature offline. That is the whole point of sending them.
export function buildToken(
  mintUrl: string,
  proofs: StoredProof[],
  unit = "sat",
  memo?: string,
): string {
  const token = {
    mint: mintUrl,
    proofs: proofs.map(toProofLike),
    unit,
    ...(memo ? { memo } : {}),
  };
  return getEncodedToken(token as unknown as Token);
}

// ---- Fees -------------------------------------------------------------------

// NUT-02 input fee for spending `inputCount` proofs of a keyset charging
// `feePpk` parts-per-thousand. The mint rounds up, so the wallet must too or
// swaps get rejected for underpaying by one sat.
export function inputFeeFor(inputCount: number, feePpk: number): number {
  if (feePpk <= 0 || inputCount <= 0) return 0;
  return Math.ceil((inputCount * feePpk) / 1000);
}

// Fee the recipient will pay to swap `proofs` at the mint. Used to show "they
// receive N" honestly, and to decide how much to over-send when the sender
// chooses to cover it.
export function feeForProofs(
  proofs: StoredProof[],
  feePpkByKeysetId: Record<string, number> | undefined,
): number {
  if (!feePpkByKeysetId) return 0;
  const ppk = proofs.reduce(
    (total, p) => total + (feePpkByKeysetId[p.id] ?? 0),
    0,
  );
  return ppk > 0 ? Math.ceil(ppk / 1000) : 0;
}

// ---- Offline proof selection ------------------------------------------------

export interface ProofSelection {
  selected: StoredProof[];
  // Face value of `selected`.
  total: number;
  // What the recipient can actually claim after paying the mint's input fee.
  receivable: number;
  // Fee the recipient will pay to swap this selection.
  fee: number;
  // True when `receivable` lands exactly on the requested amount.
  exact: boolean;
}

// Choose proofs covering `targetAmount` from `proofs`, preferring an exact
// match on what the *recipient receives* rather than on face value.
//
// This is the offline fallback used when the mint's keysets have never been
// cached on this device. When they have been, the wallet service defers to
// cashu-ts `Wallet.sendOffline`, which runs the same job with the library's
// RGLI selector and the mint's real fee schedule.
//
// Cashu denominations are powers of two, so an exact subset usually exists. We
// take a proof only when it fits inside the remaining need, which finds that
// subset whenever the denominations allow it; walking largest-first and pushing
// until the sum crosses the target overshoots badly (sending 10 from a single
// 64 spends all 64, with no change).
//
// `exact: false` means the wallet cannot make this amount offline without
// overpaying. The caller MUST get explicit consent before spending `total`,
// because offline there is no change: the difference goes to the recipient.
export function selectProofsForAmount(
  proofs: StoredProof[],
  targetAmount: number,
  feePpkByKeysetId?: Record<string, number>,
): ProofSelection | null {
  if (targetAmount <= 0 || proofs.length === 0) return null;

  const describe = (selected: StoredProof[]): ProofSelection => {
    const total = selected.reduce((s, p) => s + p.amount, 0);
    const fee = feeForProofs(selected, feePpkByKeysetId);
    const receivable = total - fee;
    return {
      selected,
      total,
      receivable,
      fee,
      exact: receivable === targetAmount,
    };
  };

  // Prefer spending the proofs the mint has not confirmed for us: they are the
  // ones most at risk of turning out to be already spent, and passing them on
  // immediately is both safer for us and no worse for the recipient, who will
  // swap right away. Within each group, largest first.
  const ranked = [...proofs].sort(
    (a, b) =>
      Number(a.verified === true) - Number(b.verified === true) ||
      b.amount - a.amount,
  );

  // Fees depend on how many proofs we pick, so the target moves as we select.
  // Walk greedily against a target that includes the fee accrued so far.
  const selected: StoredProof[] = [];
  let sum = 0;
  for (const proof of ranked) {
    const feeIfTaken = feeForProofs([...selected, proof], feePpkByKeysetId);
    const need = targetAmount + feeIfTaken;
    if (sum >= need) break;
    if (sum + proof.amount <= need) {
      selected.push(proof);
      sum += proof.amount;
    }
  }

  const exactAttempt = describe(selected);
  if (exactAttempt.exact) return exactAttempt;

  // No exact subset. Fall back to the smallest selection that still covers the
  // target plus its own fee, so the recipient is never short-changed, and flag
  // it so the caller can warn instead of silently overpaying.
  const ascending = [...proofs].sort((a, b) => a.amount - b.amount);
  const covering: StoredProof[] = [];
  let coverSum = 0;
  for (const proof of ascending) {
    if (coverSum >= targetAmount + feeForProofs(covering, feePpkByKeysetId))
      break;
    covering.push(proof);
    coverSum += proof.amount;
  }
  if (coverSum - feeForProofs(covering, feePpkByKeysetId) < targetAmount) {
    // Even everything we hold cannot cover the amount plus its fee.
    return null;
  }

  // Drop now-redundant proofs: a later, larger pick can make an earlier small
  // one unnecessary. Keeps the overpayment as small as the denominations allow.
  for (let i = 0; i < covering.length; i++) {
    const trial = covering.filter((_, idx) => idx !== i);
    const trialSum = trial.reduce((s, p) => s + p.amount, 0);
    if (trialSum - feeForProofs(trial, feePpkByKeysetId) >= targetAmount) {
      covering.splice(i, 1);
      i--;
    }
  }

  return describe(covering);
}

// ---- Display ----------------------------------------------------------------

// "500 sat" / "500 sat - coffee money", for chat search previews and
// accessibility labels.
export function formatTokenSummary(info: TokenInfo): string {
  const amount = `${info.amount.toLocaleString()} ${info.unit}`;
  return info.memo ? `${amount} - ${info.memo}` : amount;
}

// ---- QR hand-off ------------------------------------------------------------

// Most characters a token can have and still fit in one QR code.
//
// A Cashu token is base64url, which is outside QR's alphanumeric character set,
// so it always encodes in byte mode. Byte mode at the largest QR version tops
// out at 2,953 bytes with the lowest error-correction level, and the generator
// this app uses throws rather than truncating past that. Measured against that
// generator, not taken on faith.
//
// The low correction level is the right trade here: a token QR is read off a
// bright screen held at arm's length, not off a crumpled receipt, so redundancy
// buys little and costs a third of the capacity.
// Mints that hand out play money. Test mints say so about themselves, so the
// mint's own name and description carry the signal and there is no list to keep
// up to date. The hostname check is a backstop for a mint that forgets to.
//
// This only ever adds a warning label, never blocks anything, so the heuristic
// is deliberately permissive: a false positive costs a needless badge, while a
// false negative lets someone mistake fake sats for real ones.
const TEST_MINT_WORDS =
  /(testnut|fakes?wallet|tests?mint|testing|testnet|regtest|signet)/i;

export function isLikelyTestMint(mint: {
  url: string;
  name?: string;
  description?: string;
}): boolean {
  if (TEST_MINT_WORDS.test(`${mint.name ?? ""} ${mint.description ?? ""}`)) {
    return true;
  }
  try {
    const host = new URL(mint.url).hostname.toLowerCase();
    return host.includes("testnut") || /(^|.)test./.test(host);
  } catch {
    return false;
  }
}

// How large the code is drawn, and how much it may carry. These two are ONE
// decision and must move together, which is why they live side by side.
//
// The limit is not the format's capacity, it is what survives being read off
// one phone's screen by another phone's camera. A token is base64url, so it is
// case-sensitive and cannot use the dense alphanumeric mode a bolt11 invoice
// gets by being upper-cased: every character costs a full byte. More characters
// means a higher QR version, more modules in the same square, and fewer screen
// pixels per module.
//
// This pair budgets roughly 2.7 screen pixels per module at the ceiling:
//   264 px drawn / version 20 (97 modules) = 2.72 px per module
// which reads reliably screen to screen. The previous pair promised the format
// maximum (2953 chars, version 40, 177 modules) inside a 200 px square, or 1.1
// px per module: a code that is valid, renders fine, and cannot be scanned by
// anything. A 10 sat token from a mint that issues DLEQ witnesses is already
// ~650 characters, so that ceiling was routinely being handed out.
export const TOKEN_QR_SIZE = 264;
export const TOKEN_QR_MAX_CHARS = 1159;
export const TOKEN_QR_ERROR_CORRECTION = "L";

// Whether this token can be handed over as a QR.
//
// False for a token split across so many proofs that the code would be too
// dense to read at the size it is drawn. Callers must check rather than render
// blindly, and offer copy or the mesh hand-off instead: past the format limit
// the generator throws, which would take the whole sheet down with it.
export function canEncodeTokenQr(token: string): boolean {
  return token.length > 0 && token.length <= TOKEN_QR_MAX_CHARS;
}

// What to put in the QR.
//
// The bare token, with no `cashu:` scheme in front. Every Cashu wallet reads the
// bare form, only some read the URI form, and the prefix would spend capacity on
// nothing. Scanning stays permissive in the other direction: `bareToken` strips
// a scheme if one is present, so a QR produced by a wallet that adds one is
// still read correctly.
export function tokenQrPayload(token: string): string {
  return bareToken(token) ?? token;
}

// Which denomination a balance is shown in. Not a currency conversion: one
// bitcoin is exactly 100,000,000 satoshis by definition, so this is a rename,
// not a rate. It needs no price feed, no network, and cannot go stale.
export type BitcoinUnit = "sat" | "btc";

const SATS_PER_BTC_DIGITS = 8;

// Render an amount for display, in the denomination the user picked.
//
// Only `sat` amounts have a bitcoin denomination to switch to. Every other unit
// is the mint's own (a mint may issue usd or eur directly), and those are
// already the thing they say they are: reformatting them as bitcoin would
// invent an exchange rate nobody supplied.
//
// Returns the number and its label separately so the caller can style them
// apart, which the balance card does.
export function formatAmount(
  amount: number,
  unit: string,
  display: BitcoinUnit,
): { value: string; label: string } {
  if (unit !== "sat" || display === "sat") {
    return { value: amount.toLocaleString(), label: unit };
  }
  return { value: satsToBtc(amount), label: "BTC" };
}

// Exact sat -> BTC rendering, done on the digits rather than by dividing.
//
// Float division would be the obvious approach and is the wrong one for money:
// it invites rounding at the last decimal place, and a balance that rounds up
// is a balance that lies. Shifting the decimal point in the integer's own
// digits cannot round at all.
export function satsToBtc(sats: number): string {
  const negative = sats < 0;
  const digits = String(Math.abs(Math.trunc(sats))).padStart(
    SATS_PER_BTC_DIGITS + 1,
    "0",
  );
  const whole = digits.slice(0, -SATS_PER_BTC_DIGITS);
  const fraction = digits.slice(-SATS_PER_BTC_DIGITS).replace(/0+$/, "");
  const rendered = fraction.length > 0 ? `${whole}.${fraction}` : whole;
  return negative ? `-${rendered}` : rendered;
}
