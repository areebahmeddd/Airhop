// Wallet recovery phrase: 12 BIP-39 words that can rebuild the ecash balance.
//
// Why this exists
// ---------------
// A Cashu proof is a secret plus the mint's signature on it. By default every
// secret is fresh random bytes, which means the only copy that has ever existed
// is the one on this phone. Lose the phone and the money is unreachable
// forever: the mint still holds the bitcoin, but nobody can prove they own it.
//
// With a recovery phrase, secrets stop being random. They are *derived* from
// one master seed in a fixed order (NUT-13), so secret #0, #1, #2 and so on can
// be regenerated anywhere from the same twelve words. Recovery then works by
// re-deriving them and asking the mint "did you sign this one?" (NUT-09). The
// mint answers from its own records and the balance reassembles.
//
// What it does NOT cover
// ----------------------
//   * The Airhop identity itself. That is a separate key and a separate
//     decision; these words restore money only.
//   * Which mints you used. Recovery has to ask a specific mint, so the mint
//     list is shown alongside the words and has to be kept with them.
//   * Chat history, contacts, or transaction memos.
//   * Coins received offline and never swapped. Those carry the *sender's*
//     secrets, not ours, so no seed of ours can reproduce them. They become
//     covered the moment they are swapped at the mint.
//
// The phrase is the money. It lives in the OS keychain next to the identity
// keys and is never written to the proof store, never sent anywhere, and never
// logged.

import {
  generateMnemonic,
  mnemonicToSeedSync,
  validateMnemonic,
} from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import EncryptedStorage from "react-native-encrypted-storage";

// Keychain / Keystore entry holding the phrase.
const PHRASE_ITEM = "airhop.wallet.recovery.v1";

// 128 bits of entropy is 12 words. Enough that guessing is hopeless, short
// enough that people will actually write it down, and the length every other
// wallet uses so it looks familiar.
const ENTROPY_BITS = 128;

export const RECOVERY_WORD_COUNT = 12;

// ---- Phrase handling --------------------------------------------------------

// A fresh 12-word phrase. Uses the platform CSPRNG via @scure/bip39.
export function generateRecoveryPhrase(): string {
  return generateMnemonic(wordlist, ENTROPY_BITS);
}

// Lowercase, collapse runs of whitespace and newlines to single spaces, drop
// stray punctuation. People paste these from notes apps, photos and password
// managers, so accept whatever shape it arrives in rather than making them
// fight the input field.
export function normalizeRecoveryPhrase(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .trim()
    .split(/\s+/)
    .join(" ");
}

// Whether a phrase is a real BIP-39 mnemonic. This checks the checksum built
// into the standard, so a typo in any single word is caught here rather than
// silently restoring an empty wallet and leaving the user thinking their money
// is gone.
export function isValidRecoveryPhrase(raw: string): boolean {
  const phrase = normalizeRecoveryPhrase(raw);
  if (phrase.split(" ").length !== RECOVERY_WORD_COUNT) return false;
  try {
    return validateMnemonic(phrase, wordlist);
  } catch {
    return false;
  }
}

// Which words are not in the BIP-39 list, so the UI can point at the typo
// instead of only saying "invalid".
export function unknownWordsIn(raw: string): string[] {
  const known = new Set(wordlist);
  return normalizeRecoveryPhrase(raw)
    .split(" ")
    .filter((word) => word.length > 0 && !known.has(word));
}

// The 64-byte seed cashu-ts derives proof secrets from. Throws on an invalid
// phrase rather than deriving from garbage, which would produce secrets no
// mint has ever signed and a restore that silently finds nothing.
export function recoveryPhraseToSeed(raw: string): Uint8Array {
  const phrase = normalizeRecoveryPhrase(raw);
  if (!isValidRecoveryPhrase(phrase)) {
    throw new Error("invalid recovery phrase");
  }
  return mnemonicToSeedSync(phrase);
}

// ---- Secure storage ---------------------------------------------------------

export async function loadStoredPhrase(): Promise<string | null> {
  try {
    const stored = await EncryptedStorage.getItem(PHRASE_ITEM);
    if (typeof stored !== "string" || stored.length === 0) return null;
    return isValidRecoveryPhrase(stored)
      ? normalizeRecoveryPhrase(stored)
      : null;
  } catch {
    // Keychain locked or unavailable. Treated as "no phrase", which makes the
    // wallet fall back to random secrets rather than failing the operation.
    return null;
  }
}

export async function storePhrase(raw: string): Promise<void> {
  const phrase = normalizeRecoveryPhrase(raw);
  if (!isValidRecoveryPhrase(phrase)) {
    throw new Error("refusing to store an invalid recovery phrase");
  }
  await EncryptedStorage.setItem(PHRASE_ITEM, phrase);
}

// There is deliberately no "forget phrase" here. Once coins are derived from a
// phrase, deleting it is the same as deleting the coins, so the only thing that
// removes it is the panic wipe clearing the whole keychain.

// ---- Verification helper ----------------------------------------------------

// Pick `count` distinct word positions to quiz the user on after showing them
// the phrase. Randomised per setup so screenshotting one verification screen
// does not teach anyone how to pass the next one.
//
// Positions are 1-based, because that is how they are labelled on screen.
export function pickVerificationPositions(count = 2): number[] {
  // A byte runs 0..255, which is not a whole number of twelves, so a plain
  // `% 12` would land on the first four positions slightly more often than on
  // the rest. Discarding the short tail leaves a range that divides evenly and
  // keeps every position equally likely.
  const unbiasedLimit = 256 - (256 % RECOVERY_WORD_COUNT);
  const positions = new Set<number>();
  while (positions.size < Math.min(count, RECOVERY_WORD_COUNT)) {
    const bytes = crypto.getRandomValues(new Uint8Array(1));
    if (bytes[0] >= unbiasedLimit) continue;
    positions.add((bytes[0] % RECOVERY_WORD_COUNT) + 1);
  }
  return [...positions].sort((a, b) => a - b);
}

// Whether the words typed into the verification step match the phrase at those
// positions. Compared after normalising, so capitalisation and stray spaces do
// not fail an otherwise correct answer.
export function verifyPositions(
  phrase: string,
  answers: Record<number, string>,
): boolean {
  const words = normalizeRecoveryPhrase(phrase).split(" ");
  return Object.entries(answers).every(([position, answer]) => {
    const index = Number.parseInt(position, 10) - 1;
    if (index < 0 || index >= words.length) return false;
    return words[index] === normalizeRecoveryPhrase(answer);
  });
}
