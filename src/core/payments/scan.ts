// What a scanned QR code is allowed to mean.
//
// The camera hands back whatever it saw. Two things then have to be true before
// the wallet acts on it: it has to be the KIND of thing the sheet asked for, and
// it has to be normalised to the bare form the rest of the wallet expects.
//
// This lives apart from the scanner component because it is the part that can be
// wrong in a way a user notices: a scan that silently does nothing, or worse, a
// mainnet wallet accepting a testnet invoice. The camera is not interesting; the
// acceptance rule is.

import { bareToken } from "./cashu";

export type ScanTarget = "token" | "invoice";

// A scanned string is only accepted if it really is what we asked for. Returns
// the normalised value, or null to keep the camera open and keep looking.
export function readScan(
  raw: string | undefined,
  target: ScanTarget,
): string | null {
  if (typeof raw !== "string" || raw.length === 0) return null;
  // `bareToken` also strips a `cashu:` scheme, so a QR from a wallet that adds
  // one still reads.
  if (target === "token") return bareToken(raw);
  return bareInvoice(raw);
}

// bolt11 is bech32, so wallets legitimately encode it in either case, and many
// prefix a `lightning:` scheme. Normalise to the lowercase bare form the mint
// expects.
//
// Only the human-readable prefix is checked here; the mint is the one that
// validates the invoice properly, and duplicating that badly would only reject
// invoices that are actually fine. What this DOES catch is the network: `lnbc`
// is mainnet, `lntb`/`lntbs` testnet, `lnbcrt` regtest. Accepting the wrong one
// sends a real payment at a worthless invoice, so the prefix is not cosmetic.
export function bareInvoice(raw: string): string | null {
  const trimmed = raw.trim().replace(/^lightning:/i, "");
  return /^ln(bc|tb|bcrt|tbs)[0-9]/i.test(trimmed)
    ? trimmed.toLowerCase()
    : null;
}
