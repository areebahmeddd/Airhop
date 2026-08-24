/**
 * @jest-environment node
 */
// Checks every hand-written rule in `plurals.ts` against CLDR itself.
//
// Node ships full ICU, so `Intl.PluralRules` here IS the data a polyfill would
// have bundled. Hermes has neither, which is why plurals.ts exists; this is
// where the two are reconciled.

import { LANGUAGES } from "../languages";
import { PLURAL_CATEGORIES, selectPlural } from "../plurals";

const CODES = Object.keys(PLURAL_CATEGORIES);

// Where the interesting behaviour lives: teens, the decades either side of
// them, the round millions French and Spanish treat specially, and the
// hundred-boundaries Arabic cares about.
const EDGE_CASES = [
  10_000, 100_000, 1_000_000, 1_000_001, 2_000_000, 10_000_000, 100_000_000,
  1_000_000_000, 999_999, 1_000_100, 123_456, 111_111,
];

function everyInteger(): number[] {
  return Array.from({ length: 2001 }, (_, n) => n);
}

describe("plural rules match CLDR", () => {
  it("covers every language in the picker", () => {
    // A language with no rule takes the `other` fallback and mispluralises
    // every count on every screen.
    const missing = Object.keys(LANGUAGES).filter(
      (code) => !CODES.includes(code),
    );
    expect(missing).toEqual([]);
  });

  it.each(CODES)("%s agrees with Intl.PluralRules on 0 to 2000", (code) => {
    const reference = new Intl.PluralRules(code);
    const disagreements: string[] = [];
    for (const n of everyInteger()) {
      const expected = reference.select(n);
      const actual = selectPlural(code as never, n);
      if (expected !== actual) {
        disagreements.push(
          `${code} ${String(n)}: CLDR ${expected}, got ${actual}`,
        );
      }
    }
    expect(disagreements).toEqual([]);
  });

  it.each(CODES)(
    "%s agrees with Intl.PluralRules on the edge cases",
    (code) => {
      const reference = new Intl.PluralRules(code);
      const disagreements: string[] = [];
      for (const n of EDGE_CASES) {
        const expected = reference.select(n);
        const actual = selectPlural(code as never, n);
        if (expected !== actual) {
          disagreements.push(
            `${code} ${String(n)}: CLDR ${expected}, got ${actual}`,
          );
        }
      }
      expect(disagreements).toEqual([]);
    },
  );

  it.each(CODES)("%s declares exactly the categories CLDR reports", (code) => {
    // PLURAL_CATEGORIES drives what a translator must supply, so a wrong entry
    // means a form nothing selects, or a missing form at runtime.
    const reference = new Intl.PluralRules(code).resolvedOptions()
      .pluralCategories;
    expect([code, [...PLURAL_CATEGORIES[code]].sort()]).toEqual([
      code,
      [...reference].sort(),
    ]);
  });

  it.each(CODES)("%s only ever returns a category it declares", (code) => {
    const declared = new Set<string>(PLURAL_CATEGORIES[code]);
    const escaped = new Set<string>();
    for (const n of [...everyInteger(), ...EDGE_CASES]) {
      const category = selectPlural(code as never, n);
      if (!declared.has(category)) escaped.add(category);
    }
    expect([...escaped]).toEqual([]);
  });
});

describe("selectPlural", () => {
  it("treats a fraction as other", () => {
    // CLDR's fractional rules key off the number of visible decimal places,
    // which is a property of the formatting rather than the value. Nothing here
    // counts in fractions, and `other` exists in every language.
    expect(selectPlural("en", 1.5)).toBe("other");
    expect(selectPlural("en", 0.5)).toBe("other");
  });

  it("counts a negative by its magnitude", () => {
    expect(selectPlural("en", -1)).toBe(selectPlural("en", 1));
    expect(selectPlural("en", -7)).toBe(selectPlural("en", 7));
  });

  it("distinguishes the shapes it exists to distinguish", () => {
    expect(selectPlural("en", 0)).toBe("other");
    expect(selectPlural("en", 1)).toBe("one");
  });
});
