/**
 * @jest-environment node
 */
// Recovery phrase tests.
//
// This module decides whether a user's money is recoverable, and a phrase that
// is accepted but wrong is worse than one that is rejected: the user walks away
// believing they have a backup. So most of these cover *rejection*, and the one
// property that matters above all is that the same phrase always derives the
// same seed.

import EncryptedStorage from "react-native-encrypted-storage";
import {
  RECOVERY_WORD_COUNT,
  generateRecoveryPhrase,
  isValidRecoveryPhrase,
  loadStoredPhrase,
  normalizeRecoveryPhrase,
  pickVerificationPositions,
  recoveryPhraseToSeed,
  storePhrase,
  unknownWordsIn,
  verifyPositions,
} from "../wallet-seed";

// A known-good BIP-39 test vector, so the tests do not depend on the generator.
const KNOWN =
  "legal winner thank year wave sausage worth useful legal winner thank yellow";

beforeEach(async () => {
  await EncryptedStorage.clear();
});

// ---- Generation -------------------------------------------------------------

describe("generateRecoveryPhrase", () => {
  it("produces twelve valid words", () => {
    const phrase = generateRecoveryPhrase();
    expect(phrase.split(" ")).toHaveLength(RECOVERY_WORD_COUNT);
    expect(isValidRecoveryPhrase(phrase)).toBe(true);
  });

  it("does not repeat itself", () => {
    const phrases = new Set(
      Array.from({ length: 5 }, () => generateRecoveryPhrase()),
    );
    expect(phrases.size).toBe(5);
  });
});

// ---- Normalisation ----------------------------------------------------------

describe("normalizeRecoveryPhrase", () => {
  it("survives the shapes people actually paste", () => {
    // Line breaks from a photo transcription, numbering from a notes app,
    // stray capitals, and doubled spaces.
    const messy =
      "  Legal   WINNER\nthank\tyear wave sausage\n worth useful legal winner thank yellow  ";
    expect(normalizeRecoveryPhrase(messy)).toBe(KNOWN);
  });

  it("strips digits and punctuation left over from a numbered list", () => {
    expect(normalizeRecoveryPhrase("1. legal 2. winner")).toBe("legal winner");
  });
});

// ---- Validation -------------------------------------------------------------

describe("isValidRecoveryPhrase", () => {
  it("accepts a real phrase", () => {
    expect(isValidRecoveryPhrase(KNOWN)).toBe(true);
  });

  it("rejects the wrong number of words", () => {
    expect(isValidRecoveryPhrase("legal winner thank")).toBe(false);
    expect(isValidRecoveryPhrase(`${KNOWN} extra`)).toBe(false);
  });

  it("rejects a single mistyped word via the checksum", () => {
    // Every word is in the wordlist, but the checksum no longer matches. This
    // is the case that would otherwise restore an empty wallet and leave the
    // user thinking their money vanished.
    const swapped = KNOWN.replace("yellow", "zoo");
    expect(swapped.split(" ")).toHaveLength(RECOVERY_WORD_COUNT);
    expect(isValidRecoveryPhrase(swapped)).toBe(false);
  });

  it("rejects words that are not in the list at all", () => {
    expect(isValidRecoveryPhrase(KNOWN.replace("legal", "notaword"))).toBe(
      false,
    );
  });

  it("rejects empty input", () => {
    expect(isValidRecoveryPhrase("")).toBe(false);
    expect(isValidRecoveryPhrase("   ")).toBe(false);
  });
});

describe("unknownWordsIn", () => {
  it("names the words that are not BIP-39, so the UI can point at the typo", () => {
    expect(unknownWordsIn("legal notaword winner alsonot")).toEqual([
      "notaword",
      "alsonot",
    ]);
  });

  it("returns nothing for a valid phrase", () => {
    expect(unknownWordsIn(KNOWN)).toEqual([]);
  });
});

// ---- Seed derivation --------------------------------------------------------

describe("recoveryPhraseToSeed", () => {
  it("is deterministic, which is the whole point", () => {
    const a = recoveryPhraseToSeed(KNOWN);
    const b = recoveryPhraseToSeed(KNOWN);
    expect(Array.from(a)).toEqual(Array.from(b));
    expect(a).toHaveLength(64);
  });

  it("ignores formatting differences in the same phrase", () => {
    const a = recoveryPhraseToSeed(KNOWN);
    const b = recoveryPhraseToSeed(`  ${KNOWN.toUpperCase()}  `);
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it("gives different phrases different seeds", () => {
    const a = recoveryPhraseToSeed(KNOWN);
    const b = recoveryPhraseToSeed(generateRecoveryPhrase());
    expect(Array.from(a)).not.toEqual(Array.from(b));
  });

  it("refuses to derive from an invalid phrase", () => {
    // Deriving anyway would produce secrets no mint has ever signed, and a
    // restore that silently finds nothing.
    expect(() => recoveryPhraseToSeed("not a real phrase at all")).toThrow();
  });
});

// ---- Storage ----------------------------------------------------------------

describe("phrase storage", () => {
  it("round-trips through the keychain", async () => {
    await storePhrase(KNOWN);
    expect(await loadStoredPhrase()).toBe(KNOWN);
  });

  it("returns null when nothing is stored", async () => {
    expect(await loadStoredPhrase()).toBeNull();
  });

  it("refuses to store an invalid phrase", async () => {
    await expect(storePhrase("nonsense words here")).rejects.toThrow();
    expect(await loadStoredPhrase()).toBeNull();
  });

  it("treats a corrupted stored value as absent rather than deriving from it", async () => {
    await EncryptedStorage.setItem("airhop.wallet.recovery.v1", "corrupted");
    expect(await loadStoredPhrase()).toBeNull();
  });
});

// ---- Verification step ------------------------------------------------------

describe("verification", () => {
  it("asks for distinct, in-range, 1-based positions", () => {
    for (let i = 0; i < 20; i++) {
      const positions = pickVerificationPositions(2);
      expect(positions).toHaveLength(2);
      expect(new Set(positions).size).toBe(2);
      for (const p of positions) {
        expect(p).toBeGreaterThanOrEqual(1);
        expect(p).toBeLessThanOrEqual(RECOVERY_WORD_COUNT);
      }
    }
  });

  it("accepts the right words", () => {
    // KNOWN: 1=legal 2=winner ... 12=yellow
    expect(verifyPositions(KNOWN, { 1: "legal", 12: "yellow" })).toBe(true);
  });

  it("forgives capitals and stray spaces", () => {
    expect(verifyPositions(KNOWN, { 1: "  LEGAL " })).toBe(true);
  });

  it("rejects a wrong word", () => {
    expect(verifyPositions(KNOWN, { 1: "legal", 12: "winner" })).toBe(false);
  });

  it("rejects an out-of-range position instead of passing it", () => {
    expect(verifyPositions(KNOWN, { 99: "legal" })).toBe(false);
    expect(verifyPositions(KNOWN, { 0: "legal" })).toBe(false);
  });
});
